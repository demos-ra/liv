// @liv-standard v1.5.1 amended sprint-11-shot-4 sprint-11-shot-6 sprint-11-shot-6b
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
    const result = await threadQuery(queryInput)
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

function writePlanOutput(userId: string, projectId: string, planRef: string): void {
  const write: SubstrateWriteInput = {
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
      source: { channel: 'internal-derivation', scope: projectId as ScopeRef },
    },
  }
  writeStateChange(write).catch((err: unknown) => {
    console.error('[F-plan] writeStateChange failed', err instanceof Error ? err.message : err)
  })
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

// ─── End of plan-contract.ts ─────────────────────────────────────────────────
