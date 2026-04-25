// @liv-standard v1.5.1
// [F-plan/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), phase-6-cleanup-cycle-4 (F015 lane-emitting symmetry)
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
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
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

import { generateId } from '@/core/types/primitives'
import type { Result, NodeId } from '@/core/types/primitives'
import type { EpochMs } from '@/core/types/plan-standard.types'
import type {
  PlanExecuteResult,
  PlanRejectError,
  PlanDraftSummary,
  PlanArtifactSummary,
} from '../types/plan-types'

import {
  createDraft,
  amendDraft,
  getDraftSummary as formatDraftSummary,
  type ExecutePlanInput,
  type R2Deps,
} from '../app/plan-draft'
import {
  confirmAndEmit,
  isConfirmKeyword,
} from '../app/plan-emit'

import {
  createPlanDb,
  createPlanGraph,
  type IPlanDb,
  type IPlanGraph,
} from './plan-inject'

// ─── deps construction (A4 boundary) ─────────────────────────────────────────
// Concrete deps built once at R3. Injected into every R2 call.
//
// epochNow: Date.now() wrapped + branded as EpochMs.
// generateId: re-exports core/R5 generateId.
//
// Per A4: R3 is the boundary where ambient time/randomness is captured.
// R1/R2 functions are pure and accept these via deps.

function makeDeps(): R2Deps {
  return {
    generateId: (prefix?: string) => generateId(prefix),
    epochNow:   ()                => Date.now() as EpochMs,
  }
}

// ─── Singleton ports (lazy) ──────────────────────────────────────────────────
// One port instance per process — same pattern F-planner uses with
// createPlannerDb. R4/R3 dependencies are stateless wrappers; safe to share.

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

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: executePlan — three-mode dispatch
// ═══════════════════════════════════════════════════════════════════════════

/**
 * F-plan executor — single entry point used by Sprint B's registry pointer.
 *
 * Per Manager Shot 4 dispatch + spec §3.5:
 *
 *   1. D-PROJECT gate first. Empty/undefined projectId →
 *      Result.err({ code: 'PLAN_REJECTED_NO_PROJECT_SCOPE' }). Before any DB read.
 *   2. db.getOpenDraft(userId, projectId) → existing draft or null.
 *   3. No draft → createDraft(...) → return { kind: 'draft', ... }.
 *   4. Draft + content matches D-CONFIRM-PATTERN → confirmAndEmit(...) →
 *      return { kind: 'emitted', ... }.
 *   5. Draft + content doesn't match → amendDraft(...) → return { kind: 'amended', ... }.
 *
 * D-TURNID: turnId is a required parameter. Sprint A: smoke harness supplies
 * a generated turnId. Sprint B: registry pointer threads codec's turnId.
 */
export async function executePlan(
  content:    string,
  userId:     string,
  projectId:  string,
  turnId:     string,
  modelId?:   string,
): Promise<Result<PlanExecuteResult, PlanRejectError>> {
  // Step 1 — D-PROJECT gate. Reject before any DB read.
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
    return {
      ok: true,
      data: {
        kind:    'draft',
        draftId: createResult.data.draftId,
        summary: formatDraftSummary(createResult.data),
      },
    }
  }

  // Step 3b — F015: lane in-flight emission. Migration 003 widened lane to
  // (draft|emitting); dbGetOpenDraft now surfaces 'emitting' rows. Reject
  // with typed retry context — caller retries once the in-flight emission
  // resolves to terminal (success → 'emitted', failure → 'emitting' stays
  // for admin reconciliation per F005). Derived mechanically: MFv3.0
  // directional symmetry (typed return), Cognitive Standard (don't destroy
  // intent via supersede), LIV-Standard A1 (don't merge into the in-flight
  // composition).
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
    return {
      ok: true,
      data: {
        kind:             'emitted',
        planAnchorNodeId: emitResult.data.planAnchorNodeId,
        summary:          emitResult.data.summary,
      },
    }
  }

  // Step 5 — draft exists + content is amendment: re-compose.
  const amendResult = await amendDraft(openResult.data, input, db, graph, deps)
  if (!amendResult.ok) return amendResult
  return {
    ok: true,
    data: {
      kind:    'amended',
      draftId: amendResult.data.draftId,
      summary: formatDraftSummary(amendResult.data),
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: getOpenDraftSummary
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Read the open draft for a (userId, projectId) lane and format its summary.
 * Returns null when no open draft exists. Used by Sprint B / dashboard.
 *
 * Note: spec §3.6 named this `getDraftSummary`. Renamed here to
 * `getOpenDraftSummary` to disambiguate from the pure formatter
 * `formatDraftSummary` re-exported from plan-draft.ts. Same semantics.
 */
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
  // F015: open lane row may be status='draft' or status='emitting' (migration
  // 003). Summary carries `status` field (PlanDraftSummary.status) so callers
  // can discriminate. Read-only entry — no confirm/amend gate here.
  return { ok: true, data: formatDraftSummary(openResult.data) }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ENTRY: confirmDraft
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Explicit confirmation entry — distinct from executePlan's keyword path.
 * Used by smoke harness (Shot 5) and Sprint B's potential explicit-button path.
 *
 * Looks up open draft for (userId, projectId), then runs confirmAndEmit. The
 * `content` parameter is required for buildComposerInput (used during the
 * fresh re-compose at confirm time per spec §3.6). Smoke harness should pass
 * the same content that originally created the draft (or a confirm keyword —
 * doesn't matter for compose, since compose only reads it as the userMessage
 * for fresh decomposition).
 */
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

  // F015: 'emitting' row means an in-flight emission is in progress.
  // Caller cannot double-confirm — retry after the in-flight resolves.
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
  return confirmAndEmit(openResult.data, input, db, graph, deps)
}

// ─── End of plan-contract.ts ─────────────────────────────────────────────────
