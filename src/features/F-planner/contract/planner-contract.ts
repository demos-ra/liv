// @liv-standard v1.3
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM    PlannerJobId          ../types/planner-types
//   W-ATOM    StartPipelinePayload  ../types/planner-types
//   W-ATOM    AdvanceStagePayload   ../types/planner-types
//   W-ATOM    FailStagePayload      ../types/planner-types
//   W-ATOM    FreezeContractPayload ../types/planner-types
//   W-ATOM    SESSION_COOKIE_NAME   F-identity/contract/auth-contract (W-ATOM)
//   W-ATOM    validateSession       F-identity/contract/auth-contract (W-ATOM)
// wires-out:
//   W-HOOK  usePlanner  →  F-workspace/R3
// deps:
//   R0  ../types/planner-types
//   R2  ../workflow/planner-workflow
//   R3  ./planner-inject
// validated:  2026-03-12

import { NextRequest, NextResponse }           from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import {
  startPipeline,
  advanceStage,
  failStage,
  freezeContract,
  getPipelineStatus,
} from '../workflow/planner-workflow'
import { createPlannerDb } from './planner-inject'
import type {
  PlannerJobId,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
} from '../types/planner-types'

// ── Shared session helper ─────────────────────────────────────────────────────
// FL-AUTH: R3 extracts token → R2 validates → R4 reads session → R3 receives result
async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
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

  // Enforce ownership: userId from session only — never from body
  const db     = createPlannerDb()
  const result = await startPipeline({ db }, {
    ...input,
    userId: session.userId,
  })

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 })
}

// ── GET /api/planner/[jobId] ──────────────────────────────────────────────────
export async function handleGetPipelineStatus(
  req: NextRequest,
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

  // Ownership check — user may only read their own jobs
  if (result.data.userId !== session.userId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── POST /api/planner/[jobId]/advance ─────────────────────────────────────────
export async function handleAdvanceStage(
  req: NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { body = {} }

  const input: AdvanceStagePayload = {
    jobId,
    message: (body as Record<string, unknown>)?.message as string | null ?? null,
  }

  const db     = createPlannerDb()
  const result = await advanceStage({ db }, input)

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
  req: NextRequest,
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
  req: NextRequest,
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
