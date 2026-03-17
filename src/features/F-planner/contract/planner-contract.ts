// @liv-standard v1.3
// [F-planner/contract/planner-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-b
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM    PlannerJobId          ../types/planner-types
//   W-ATOM    BuildRequestPayload   ../types/planner-types
//   W-ATOM    StartPipelinePayload  ../types/planner-types
//   W-ATOM    AdvanceStagePayload   ../types/planner-types
//   W-ATOM    FailStagePayload      ../types/planner-types
//   W-ATOM    FreezeContractPayload ../types/planner-types
//   W-ATOM    SESSION_COOKIE_NAME   F-identity/contract/auth-contract
//   W-ATOM    validateSession       F-identity/contract/auth-contract
// wires-out:
//   W-HOOK  usePlanner          →  F-dashboard/R3
//   W-FN    handleBuildRequest  →  src/app/api/chat/[projectId]/message/route.ts
// deps:
//   R0  ../types/planner-types
//   R2  ../workflow/planner-workflow
//   R3  ./planner-inject
//   R3  @/features/F-identity/contract/auth-contract
//   R5  next/server
// validated:  pending
//
// step3-executor: (unchanged)
// step4b2-phase-a: (unchanged)
//
// step4b2-phase-b (A1, A4, A5):
//   handleBuildRequest() extended: when handleInMainTurn returns isConfirmation=true,
//   runPipeline() is called fire-and-forget (no await + .catch for error isolation).
//   The chat SSE stream receives the confirmation ack immediately — runPipeline runs
//   in the background. Dashboard polls status independently via planner-hook.
//   createOutputWriter() added to runPipeline deps — binds IOutputWriter at R3.
//   Axiom cite:
//     A1 — handleBuildRequest is sole R3 surface for build/pipeline interactions.
//     A4 — runPipeline is async I/O; fire-and-forget isolates it from the SSE path.
//     A5 — runPipeline called only here; IOutputWriter bound only in planner-inject.

import { NextRequest, NextResponse }            from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import {
  startPipeline,
  advanceStage,
  failStage,
  freezeContract,
  getPipelineStatus,
  handleInMainTurn,
  runPipeline,
} from '../workflow/planner-workflow'
import { createPlannerDb, createAiAdapter, createExecutor, createOutputWriter } from './planner-inject'
import type {
  PlannerJobId,
  BuildRequestPayload,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
} from '../types/planner-types'

// ── Shared session helper ─────────────────────────────────────────────────────
async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// ── handleBuildRequest ────────────────────────────────────────────────────────
// Called by the chat route handler when an active build is detected (R3→R3, A5).
// Delegates to handleInMainTurn() at R2. On confirmation, fires runPipeline()
// asynchronously — chat SSE stream closes before pipeline execution begins.

export async function handleBuildRequest(
  input: BuildRequestPayload
): Promise<{ ok: true; response: string; isConfirmation: boolean } | { ok: false; error: string }> {
  const db = createPlannerDb()
  const ai = createAiAdapter()

  const result = await handleInMainTurn({ db, ai }, input)

  if (!result.ok) {
    return { ok: false, error: result.error.message }
  }

  // ── Fire-and-forget: launch pipeline on confirmation ──────────────────────
  // runPipeline() is called without await. The SSE stream returns the ack
  // message to the user immediately. Pipeline runs in background.
  // .catch() ensures any thrown error sets pipeline_status = 'failed'
  // internally — it never propagates to the chat route handler (A4).
  if (result.data.isConfirmation) {
    const executor = createExecutor()
    const output   = createOutputWriter()
    const jobId    = result.data.job.jobId

    runPipeline({ db, ai, executor, output }, jobId).catch(err => {
      // Last-resort catch — runPipeline should handle its own failures internally.
      // If it throws unexpectedly, log and attempt to mark pipeline failed.
      console.error(JSON.stringify({
        level:     'error',
        event:     'pipeline.unhandled.error',
        jobId:     jobId as string,
        message:   err instanceof Error ? err.message : String(err),
        slice:     'F-planner',
        layer:     'R3',
        timestamp: new Date().toISOString(),
      }))
      db.failPipeline(jobId).catch(() => {})
    })
  }

  return {
    ok:             true,
    response:       result.data.response,
    isConfirmation: result.data.isConfirmation,
  }
}

// ── POST /api/planner/start ───────────────────────────────────────────────────
export async function handleStartPipeline(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const input = body as StartPipelinePayload
  if (!input?.buildId)   return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'buildId required' },   { status: 422 })
  if (!input?.projectId) return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'projectId required' }, { status: 422 })

  const db     = createPlannerDb()
  const result = await startPipeline({ db }, { ...input, userId: session.userId })

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 })
}

// ── GET /api/planner/[jobId] ──────────────────────────────────────────────────
export async function handleGetPipelineStatus(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createPlannerDb()
  const result = await getPipelineStatus({ db }, jobId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  if (result.data.userId !== session.userId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── POST /api/planner/[jobId]/advance ─────────────────────────────────────────
export async function handleAdvanceStage(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { body = {} }

  const input: AdvanceStagePayload = {
    jobId,
    message: (body as Record<string, unknown>)?.message as string | null ?? null,
    files:   (body as Record<string, unknown>)?.files   as Array<{ path: string; content: string }> | undefined,
  }

  const db       = createPlannerDb()
  const executor = createExecutor()
  const result   = await advanceStage({ db, executor }, input)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND'     ? 404
                 : result.error.code === 'INVALID_STATE' ? 409
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── POST /api/planner/[jobId]/fail ────────────────────────────────────────────
export async function handleFailStage(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const b = body as Record<string, unknown>
  if (!b?.reason) return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'reason required' }, { status: 422 })

  const input: FailStagePayload = {
    jobId,
    reason:    b.reason    as string,
    axiomCite: (b.axiomCite as string | null) ?? null,
  }

  const db     = createPlannerDb()
  const result = await failStage({ db }, input)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND'     ? 404
                 : result.error.code === 'INVALID_STATE' ? 409
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── POST /api/planner/[jobId]/contract ────────────────────────────────────────
export async function handleFreezeContract(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const b = body as Record<string, unknown>
  if (!b?.ifContract) return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'ifContract required' }, { status: 422 })

  const input: FreezeContractPayload = {
    jobId,
    ifContract: b.ifContract as FreezeContractPayload['ifContract'],
  }

  const db     = createPlannerDb()
  const result = await freezeContract({ db }, input)

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422
                 : result.error.code === 'NOT_FOUND'         ? 404
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}
