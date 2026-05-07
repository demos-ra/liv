// @liv-standard v1.5.1
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    w2-item-12, phase-b-item4, phase-b-item2, phase-4.3, phase-5.2, phase-5-audit
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM    PlannerJobId          ../types/planner-types
//   W-ATOM    BuildRequestPayload   ../types/planner-types
//   W-ATOM    StartPipelinePayload  ../types/planner-types
//   W-ATOM    AdvanceStagePayload   ../types/planner-types
//   W-ATOM    FailStagePayload      ../types/planner-types
//   W-ATOM    FreezeContractPayload ../types/planner-types
//   W-FN      getPerimeterSession   F-identity/contract/perimeter-consultation
//   W-ATOM    PLANNER_RATE_LIMIT    ../types/planner-const
//   W-ATOM    AdminBuild, AdminBuildsFilter  F-admin/types/admin-types
//   W-INJECT  dbCountActiveBuildsForUser  ../exec/planner-db
// wires-out:
//   W-HOOK  usePlanner                →  F-dashboard/R3
//   W-HOOK  handleBuildRequest        →  (formerly F-codec/R2 codec-orchestrate; F-codec dissolved Sprint 8 Shot 3a; route currently inactive — see app/api routes returning 501 pending Sprint 9 reauthor against substrate)
//   W-HOOK  handleGetVersionHistory   →  src/app/api/planner/[projectId]/versions/route.ts  (step5e)
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-const
//   R0  @/features/F-admin/types/admin-types
//   R1  @/core/domain/rate-limiter
//   R2  ../workflow/planner-workflow
//   R3  ./planner-inject
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R4  ../exec/planner-db
//   R5  next/server
// validated:  pending
//
// step5e (A1, A2, A4):
//   handleGetVersionHistory added. GET /api/planner/[projectId]/versions.
//   Delegates to deps.db.getVersionHistory via createPlannerDb() — A2 compliant.
//   Route file imports only this handler, never R4 directly — A2 preserved.
//   Axiom cite: A1 — F-planner contract is sole R3 surface for planner operations.
//   A2 — R4 accessed only via IPlannerDb. A4 — I/O at R4 only.
//
// step3-executor: (unchanged)
// step4b2-phase-a: (unchanged)
//
// step4b2-phase-b (A1, A4, A5): (unchanged)
//   handleBuildRequest() extended: when handleInMainTurn returns isConfirmation=true,
//   runPipeline() is called fire-and-forget (no await + .catch for error isolation).
//   The chat SSE stream receives the confirmation ack immediately — runPipeline runs
//   in the background. Dashboard polls status independently via planner-hook.
//   createOutputWriter() added to runPipeline deps — binds IOutputWriter at R3.
//   Axiom cite:
//     A1 — handleBuildRequest is sole R3 surface for build/pipeline interactions.
//     A4 — runPipeline is async I/O; fire-and-forget isolates it from the SSE path.
//     A5 — runPipeline called only here; IOutputWriter bound only in planner-inject.
//
// w2-item-12 (A2, A4):
//   Per-user rate limit check + concurrent build check added to handleStartPipeline.
//   Inserted after session validation, before body parsing — reject cheaply.
//   createRateLimiter() with lazy init (Turbopack rule). Independent store from chat.
//   dbCountActiveBuildsForUser imported from R4 — same pattern as chat-contract's
//   dbGetActiveJobForProject import (A2-r3-active-build-check amendment).
//   Axiom cite: A2 — R1 cross-slice import (lower layer). A4 — R4 query for
//   concurrent build check, minimal boundary crossing.

import { NextRequest, NextResponse }            from 'next/server'
import { getPerimeterSession }                  from '@/features/F-identity/contract/perimeter-consultation'
import { createRateLimiter }                    from '@/core/domain/rate-limiter'
import { PLANNER_RATE_LIMIT }                   from '../types/planner-const'
import { dbCountActiveBuildsForUser }           from '../exec/planner-db'
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
import type { AdminBuild, AdminBuildsFilter } from '@/features/F-admin/types/admin-types'
import type { PlannerResult } from '../types/planner-types'

// ── Shared session helper ─────────────────────────────────────────────────────
// Sprint 6 Shot 3: perimeter validates at unitary site (src/middleware.ts);
// R3 reads middleware-set headers via getPerimeterSession per PS v1.0 §6.9.
async function getSession(req: NextRequest) {
  return getPerimeterSession(req)
}

// ── Rate limiter (lazy init — Turbopack rule) ─────────────────────────────────
let plannerLimiter: ReturnType<typeof createRateLimiter> | null = null
function getPlannerLimiter() {
  if (!plannerLimiter) plannerLimiter = createRateLimiter()
  return plannerLimiter
}

// ── handleBuildRequest ────────────────────────────────────────────────────────
// Called by the chat route handler when an active build is detected (R3→R3, A5).
// Delegates to handleInMainTurn() at R2. On confirmation, fires runPipeline()
// asynchronously — chat SSE stream closes before pipeline execution begins.

export async function handleBuildRequest(
  input: BuildRequestPayload
): Promise<{ ok: true; response: string; isConfirmation: boolean; jobId: string } | { ok: false; error: string }> {
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

    runPipeline({ db, ai, executor, output }, jobId, result.data.readSnapshot ?? null).catch(err => {
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
    jobId:          result.data.job.jobId as string,
  }
}

// ── POST /api/planner/start ───────────────────────────────────────────────────
export async function handleStartPipeline(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  // ── Rate limit (w2-item-12) ─────────────────────────────────────────────────
  const limit = getPlannerLimiter().check(session.userId, PLANNER_RATE_LIMIT)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many build requests. Please wait.' } },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) },
      }
    )
  }

  // ── Concurrent build check (w2-item-12) ─────────────────────────────────────
  const activeCount = await dbCountActiveBuildsForUser(session.userId)
  if (activeCount.ok && activeCount.data > 0) {
    return NextResponse.json(
      { error: { code: 'CONCURRENT_BUILD', message: 'A build is already in progress.' } },
      { status: 429 }
    )
  }

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

// ── GET /api/planner/[projectId]/versions ─────────────────────────────────────
// Returns version history for a project — completed builds with semver tags.
// Auth required. Delegates to IPlannerDb.getVersionHistory via createPlannerDb().
// Route file imports only this handler — no direct R4 access from routes (A2).

export async function handleGetVersionHistory(
  req:       NextRequest,
  projectId: string,
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createPlannerDb()
  const result = await db.getVersionHistory(projectId)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── getBuildsForAdmin (phase-b-item4) ─────────────────────────────────────────
// Read-only query surface for F-admin. Returns admin projection of builds.
// A1: F-planner owns builds table. F-admin imports this, never queries directly.
// A3: AdminBuild atom (F-admin/R0) crosses boundary — typed, read-only.

export async function getBuildsForAdmin(
  filters: AdminBuildsFilter,
): Promise<PlannerResult<AdminBuild[]>> {
  const db = createPlannerDb()
  return db.getBuildsForAdmin(filters)
}

// ── isPipelineActive (phase-b-item2) ──────────────────────────────────────────
// Read-only query for F-chat. Returns pipeline active state + status.
// Option B from brief: single read-only query through R3 contract.
// A3: boolean + string atom crosses boundary. A5: query, not command.
// Replaces F-chat's direct import of dbGetActiveJobForProject from R4.

export async function isPipelineActive(
  projectId: string,
): Promise<{ active: boolean; status: string | null }> {
  const db = createPlannerDb()
  const result = await db.getActiveJobForProject(projectId)
  if (!result.ok || !result.data) return { active: false, status: null }
  return { active: true, status: result.data.pipelineStatus }
}