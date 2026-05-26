// @liv-standard v1.5.1 amended sprint-11-shot-4 sprint-11-shot-6 sprint-11-shot-6b sprint-12-shot-2 sprint-12-micro
// [F-plan/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), phase-6-cleanup-cycle-4 (F015 lane-emitting symmetry)
//             sprint-11-shot-4 (substrate threadQuery on entry + writeStateChange on completion)
//             sprint-11-shot-6 (permission gate rationale recorded)
//             sprint-11-shot-6b (source.scope corrected: userId → projectId at writeStateChange callsite)
// slice:      F-plan
// layer:      R3
// wires-in:
//   W-ATOM    Result, NodeId, generateId  ← core/R5 primitives
//   W-ATOM    EpochMs                      ← core/R5 plan-standard.types
//   W-ATOM    PlanExecuteResult, PlanRejectError, PlanDraftSummary, PlanArtifactSummary ← F-plan/R0 plan-types
//   W-HOOK    createDraft, amendDraft, getDraftSummary, buildComposerInput ← F-plan/R2 plan-draft
//   W-HOOK    confirmAndEmit, isConfirmKeyword                              ← F-plan/R2 plan-emit
//   W-INJECT  IPlanDb, createPlanDb        ← F-plan/R3 plan-inject
//   W-INJECT  IPlanGraph, createPlanGraph  ← F-plan/R3 plan-inject
//   W-FN      threadQuery                  ← F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   W-FN      writeStateChange             ← F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   W-ATOM    SubstrateWriteInput, ThreadQueryInput, IdentityRef, ScopeRef, RoleRef ← core/types/substrate.types
// wires-out:
//   W-HOOK    executePlan          →  Sprint B registry pointer; smoke harness Shot 5
//   W-HOOK    getOpenDraftSummary  →  Sprint B/dashboard
//   W-HOOK    confirmDraft         →  smoke harness Shot 5; Sprint B explicit-button path
// deps:
//   R0  ../types/plan-types
//   R1  (none direct — via R2)
//   R2  ../app/plan-draft
//   R2  ../app/plan-emit
//   R3  ./plan-inject
//   R3  @/features/F-memory/contract/substrate-contract
//   R3  @/features/F-builder/contract/builder-contract  (sprint-12-micro: was R4 direct — F-S12-K)
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
//   R5  @/core/types/substrate.types
// validated:  pending
//
// F-plan R3 — public contract. Wires concrete ports, exposes the three spec'd
// entry points (executePlan, getOpenDraftSummary, confirmDraft).
//
// A2 (cross-layer):
//   R3 imports R2 (app/) for orchestration + R3 sibling (plan-inject) for
//   port factories. NO direct R4 (exec/) imports — R4 is wrapped by IPlanDb
//   inside plan-inject.
//   R3 IS the public surface. Cross-slice consumers (Sprint B codec orchestrate)
//   import only from this file.
//
// A4 (purity boundary):
//   This is the ONLY R2/R3 file allowed to call `Date.now()` and `generateId()`
//   directly — they're constructed once here and injected as deps into all
//   downstream R2 calls. R1/R2 functions never call these directly.
//
// sprint-11-shot-4 substrate wiring:
//   Decision-D (F-plan): Identity/relation shape.
//     Entry threadQuery: identity-recurrence on userId, scope=userId, scope=projectId
//     not threaded into LM query (projectId available as param — used as ScopeRef).
//     Completion write identities: ['plan-output', planId-or-turnId, userId, projectId].
//     Relation: { type: 'plan-emitted', modality: 'declarative',
//       identitiesWithRoles: [{ identity: userId, role: 'agent' }], negation: false }.
//     Source: { channel: 'internal-derivation', scope: userId }.
//     Rationale: 'internal-derivation' channel correct for program-generated output
//     (not a direct wearer or ai message — a structured program result).
//     Fire-and-forget on completion write per CA4 independence.
//     Substrate read failure → empty context, program continues (parallel to §5.6).

//
// sprint-11-shot-6 (permission gate rationale):
//   writeStateChange callsites in this file are downstream of authenticated
//   entry points (F-chat session-gated for F-plan; F-router dispatch gated
//   by F-chat session for F-discover/F-verify). requirePermission() gates
//   for substrate_write and program_invoke_* are Sprint 9 scope per Perimeter
//   Standard scopeOut (F-009). Perimeter session auth is the active gate.
import { generateId }                          from '@/core/types/primitives'
import type { Result, NodeId }                 from '@/core/types/primitives'
import type { EpochMs }                        from '@/core/types/plan-standard.types'
import type {
  PlanExecuteResult,
  PlanRejectError,
  PlanDraftSummary,
  PlanArtifactSummary,
}                                              from '../types/plan-types'

import {
  createDraft,
  amendDraft,
  getDraftSummary as formatDraftSummary,
  type ExecutePlanInput,
  type R2Deps,
}                                              from '../app/plan-draft'
import {
  confirmAndEmit,
  isConfirmKeyword,
}                                              from '../app/plan-emit'

import {
  createPlanDb,
  createPlanGraph,
  type IPlanDb,
  type IPlanGraph,
}                                              from './plan-inject'

import { threadQuery, writeStateChange }       from '@/features/F-memory/contract/substrate-contract'
import type {
  SubstrateWriteInput,
  ThreadQueryInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                                              from '@/core/types/substrate.types'

// ─── deps construction (A4 boundary) ─────────────────────────────────────────
function makeDeps(): R2Deps {
  return {
    generateId: (prefix?: string) => generateId(prefix),
    epochNow:   ()                => Date.now() as EpochMs,
  }
}

// ─── Singleton ports (lazy) ──────────────────────────────────────────────────
let _db:    IPlanDb    | null = null
let _graph: IPlanGraph | null = null

function getDb(): IPlanDb {
  if (_db === null) _db = createPlanDb()
  return _db
}

function getGraph(): IPlanGraph {
  if (_graph === null) _graph = createPlanGraph()
  return _graph
}

// ─── Substrate helpers ────────────────────────────────────────────────────────

async function readPlanContext(userId: string, projectId: string): Promise<string> {
  try {
    const queryInput: ThreadQueryInput = {
      threadKind: 'identity-recurrence',
      anchor:     userId    as IdentityRef,
      scope:      projectId as ScopeRef,
      limit:      20,
    }
    const result = await threadQuery(queryInput, userId)
    if (result.ok && result.data.records.length > 0) {
      return result.data.records
        .map(r => r.content.identities.join(' | '))
        .join('\n')
    }
  } catch (err) {
    console.error('[F-plan] threadQuery failed', err instanceof Error ? err.message : err)
  }
  return ''
}

async function writePlanOutput(userId: string, projectId: string, planRef: string): Promise<void> {
  const write: SubstrateWriteInput = {
    userId,
    content: {
      identities: [
        'plan-output' as IdentityRef,
        planRef       as IdentityRef,
        userId        as IdentityRef,
        projectId     as IdentityRef,
      ],
      relations: [
        {
          type:                'plan-emitted' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: userId as IdentityRef, role: 'agent' as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   Date.now(),
      // Side-Quest Shot 4 (Phase D, Plan Standard v2.3): F-plan plan-output emits via
      // 'internal-derivation' with contentClass: 'wearer-life'. Basis:
      // plan-output / plan-emitted records carry `{role: 'agent', identity: userId}`
      // — the wearer as agent of the plan emission. Records of wearer cognition
      // (the wearer's planning) participating in the cognition LIV extends per
      // LM v3.4 LMA13. Distinguished from pipeline-completed records
      // (plan-pipeline.ts:468) which classify as 'system-introspection'.
      // Replaces Shot 1 Phase A provisional 'system-introspection' stamp.
      source: { channel: 'internal-derivation', contentClass: 'wearer-life', scope: projectId as ScopeRef },
    },
  }
  // fixround-substrate-write (F6): inspect-and-log — slice-completion side-record.
  const r = await writeStateChange(write)
  if (!r.ok) {
    console.error('[F-plan] writeStateChange failed', r.error.message)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: executePlan — three-mode dispatch
// ═══════════════════════════════════════════════════════════════════════════

export async function executePlan(
  content:    string,
  userId:     string,
  projectId:  string,
  turnId:     string,
  modelId?:   string,
): Promise<Result<PlanExecuteResult, PlanRejectError>> {
  // Step 1 — D-PROJECT gate. Reject before any DB read or substrate I/O.
  if (typeof projectId !== 'string' || projectId.trim().length === 0) {
    return {
      ok: false,
      error: {
        code:    'PLAN_REJECTED_NO_PROJECT_SCOPE',
        message: 'Plan emission requires non-empty project scope',
      },
    }
  }

  // Step 1.5 — substrate context read (sprint-11-shot-4).
  // Failure → empty context; program continues per §5.6 parallel.
  const _substrateContext = await readPlanContext(userId, projectId)

  const db    = getDb()
  const graph = getGraph()
  const deps  = makeDeps()

  const input: ExecutePlanInput = { content, userId, projectId, turnId, modelId }

  // Step 2 — lane lookup.
  const openResult = await db.getOpenDraft(userId, projectId)
  if (!openResult.ok) {
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to read open draft',
        context: { cause: openResult.error },
      },
    }
  }

  // Step 3 — no draft: create.
  if (openResult.data === null) {
    const createResult = await createDraft(input, db, graph, deps)
    if (!createResult.ok) return createResult
    const result: Result<PlanExecuteResult, PlanRejectError> = {
      ok: true,
      data: {
        kind:    'draft',
        draftId: createResult.data.draftId,
        summary: formatDraftSummary(createResult.data),
      },
    }
    writePlanOutput(userId, projectId, createResult.data.draftId)
    return result
  }

  // Step 3b — F015: lane in-flight emission.
  if (openResult.data.status === 'emitting') {
    return {
      ok: false,
      error: {
        code:    'PLAN_LANE_EMITTING',
        message: `Lane has in-flight emission for draft ${openResult.data.draftId}. Retry shortly.`,
        context: { draftId: openResult.data.draftId },
      },
    }
  }

  // Step 4 — draft exists + confirm keyword: emit.
  if (isConfirmKeyword(content)) {
    const emitResult = await confirmAndEmit(openResult.data, input, db, graph, deps)
    if (!emitResult.ok) return emitResult
    const result: Result<PlanExecuteResult, PlanRejectError> = {
      ok: true,
      data: {
        kind:             'emitted',
        planAnchorNodeId: emitResult.data.planAnchorNodeId,
        summary:          emitResult.data.summary,
      },
    }
    writePlanOutput(userId, projectId, String(emitResult.data.planAnchorNodeId))
    return result
  }

  // Step 5 — draft exists + content is amendment: re-compose.
  const amendResult = await amendDraft(openResult.data, input, db, graph, deps)
  if (!amendResult.ok) return amendResult
  const result: Result<PlanExecuteResult, PlanRejectError> = {
    ok: true,
    data: {
      kind:    'amended',
      draftId: amendResult.data.draftId,
      summary: formatDraftSummary(amendResult.data),
    },
  }
  writePlanOutput(userId, projectId, amendResult.data.draftId)
  return result
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: getOpenDraftSummary
// ═══════════════════════════════════════════════════════════════════════════

export async function getOpenDraftSummary(
  userId:    string,
  projectId: string,
): Promise<Result<PlanDraftSummary | null, PlanRejectError>> {
  if (typeof projectId !== 'string' || projectId.trim().length === 0) {
    return {
      ok: false,
      error: {
        code:    'PLAN_REJECTED_NO_PROJECT_SCOPE',
        message: 'Plan scope requires non-empty project id',
      },
    }
  }

  const db = getDb()
  const openResult = await db.getOpenDraft(userId, projectId)
  if (!openResult.ok) {
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to read open draft',
        context: { cause: openResult.error },
      },
    }
  }
  if (openResult.data === null) return { ok: true, data: null }
  return { ok: true, data: formatDraftSummary(openResult.data) }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: confirmDraft
// ═══════════════════════════════════════════════════════════════════════════

export async function confirmDraft(
  userId:    string,
  projectId: string,
  turnId:    string,
  content:   string,
  modelId?:  string,
): Promise<Result<{ planAnchorNodeId: NodeId; summary: PlanArtifactSummary }, PlanRejectError>> {
  if (typeof projectId !== 'string' || projectId.trim().length === 0) {
    return {
      ok: false,
      error: {
        code:    'PLAN_REJECTED_NO_PROJECT_SCOPE',
        message: 'Plan emission requires non-empty project scope',
      },
    }
  }

  const db    = getDb()
  const graph = getGraph()
  const deps  = makeDeps()

  const openResult = await db.getOpenDraft(userId, projectId)
  if (!openResult.ok) {
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to read open draft',
        context: { cause: openResult.error },
      },
    }
  }
  if (openResult.data === null) {
    return {
      ok: false,
      error: {
        code:    'PLAN_DRAFT_NOT_FOUND',
        message: 'No open draft for this lane',
      },
    }
  }

  if (openResult.data.status === 'emitting') {
    return {
      ok: false,
      error: {
        code:    'PLAN_LANE_EMITTING',
        message: `Lane has in-flight emission for draft ${openResult.data.draftId}. Retry shortly.`,
        context: { draftId: openResult.data.draftId },
      },
    }
  }

  const input: ExecutePlanInput = { content, userId, projectId, turnId, modelId }
  const emitResult = await confirmAndEmit(openResult.data, input, db, graph, deps)
  if (emitResult.ok) {
    writePlanOutput(userId, projectId, String(emitResult.data.planAnchorNodeId))
  }
  return emitResult
}

// ── isPipelineActive — moved from F-planner/contract/planner-contract.ts ──────
// Re-exported here at F-plan R3 surface. F-chat imports from this location.
// Uses createPlannerDb() (the existing plan-inject factory for IPlannerDb).

import { isPipelineActive as _isPipelineActiveInner } from '../app/plan-pipeline'
import { createPlannerDb as _createPlannerDb }        from './plan-inject'
import type { PlannerResult }                          from '../types/pipeline-types'
import type { AdminBuild, AdminBuildsFilter }          from '@/features/F-admin/types/admin-types'
import { NextRequest, NextResponse }                   from 'next/server'
import { getPerimeterSession }                         from '@/features/F-identity/contract/perimeter-consultation'
import { createRateLimiter }                           from '@/core/domain/rate-limiter'
import { PLANNER_RATE_LIMIT }                          from '@/features/F-builder/config/builder-const'
import {
  startPipeline   as _startPipeline,
  advanceStage    as _advanceStage,
  failStage       as _failStage,
  freezeContract  as _freezeContract,
  getPipelineStatus as _getPipelineStatus,
}                                                      from '../app/plan-pipeline'
import type {
  PlannerJobId,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
}                                                      from '../types/pipeline-types'
import { createBuilderExecutor, dbCountActiveBuildsForUser } from '@/features/F-builder/contract/builder-contract'

export async function isPipelineActive(
  projectId: string,
): Promise<{ active: boolean; status: string | null }> {
  const db = _createPlannerDb()
  return _isPipelineActiveInner(projectId, { db })
}

// ── getBuildsForAdmin — moved from F-planner/contract/planner-contract.ts ─────
// F-admin/exec/admin-db.ts imports this. Post-dissolution: lives at F-plan R3.

export async function getBuildsForAdmin(
  filters: AdminBuildsFilter,
): Promise<PlannerResult<AdminBuild[]>> {
  const db = _createPlannerDb()
  return db.getBuildsForAdmin(filters)
}

// ── HTTP route handlers — moved from F-planner/contract/planner-contract.ts ───
// All handlers auth-gated via getPerimeterSession per PS v1.0 §6.9.

let _plannerLimiter: ReturnType<typeof createRateLimiter> | null = null
function _getPlannerLimiter() {
  if (!_plannerLimiter) _plannerLimiter = createRateLimiter()
  return _plannerLimiter
}

export async function handleGetPipelineStatus(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = _createPlannerDb()
  const result = await _getPipelineStatus({ db }, jobId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  if (result.data.userId !== session.userId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

export async function handleStartPipeline(req: NextRequest): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const limit = _getPlannerLimiter().check(session.userId, PLANNER_RATE_LIMIT)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMITED', message: 'Too many build requests. Please wait.' } },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
    )
  }

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

  const db     = _createPlannerDb()
  const result = await _startPipeline({ db }, { ...input, userId: session.userId })

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 })
}

export async function handleAdvanceStage(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { body = {} }

  const input: AdvanceStagePayload = {
    jobId,
    message: (body as Record<string, unknown>)?.message as string | null ?? null,
    files:   (body as Record<string, unknown>)?.files   as Array<{ path: string; content: string }> | undefined,
  }

  const db       = _createPlannerDb()
  const executor = createBuilderExecutor()
  const result   = await _advanceStage({ db, executor }, input)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND'     ? 404
                 : result.error.code === 'INVALID_STATE' ? 409
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

export async function handleFailStage(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = getPerimeterSession(req)
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

  const db     = _createPlannerDb()
  const result = await _failStage({ db }, input)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND'     ? 404
                 : result.error.code === 'INVALID_STATE' ? 409
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

export async function handleFreezeContract(
  req:   NextRequest,
  jobId: PlannerJobId
): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const b = body as Record<string, unknown>
  if (!b?.ifContract) return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'ifContract required' }, { status: 422 })

  const input: FreezeContractPayload = {
    jobId,
    ifContract: b.ifContract as FreezeContractPayload['ifContract'],
  }

  const db     = _createPlannerDb()
  const result = await _freezeContract({ db }, input)

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422
                 : result.error.code === 'NOT_FOUND'         ? 404
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

export async function handleGetVersionHistory(
  req:       NextRequest,
  projectId: string,
): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = _createPlannerDb()
  const result = await db.getVersionHistory(projectId)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ─── End of plan-contract.ts ─────────────────────────────────────────────────
