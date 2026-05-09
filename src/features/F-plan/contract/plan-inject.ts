// @liv-standard v1.5.1
// [F-plan/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), lm-v2-2-shot2, lm-v2-2-shot3, sprint-8-shot-3b (F-memory LM v2.x reads removed; createArtifactGraphPort repointed to F-artifact)
// slice:      F-plan
// layer:      R3
// wires-in:
//   W-ATOM    Result, NodeId, UserId   ←  core/R5 primitives
//   W-ATOM    EpochMs, PlanArtifactContent, PlanValidityError ← core/R5 plan-standard.types
//   W-ATOM    CreateArtifactInput, ArtifactGraphPort, CreateArtifactResult ← F-artifact/R3
//   W-ATOM    PlanDraftId, PlanDraftState ← F-plan/R0 plan-types
//   W-FN      dbInsertPlanDraft      ←  F-plan/R4 plan-db
//   W-FN      dbGetOpenDraft         ←  F-plan/R4 plan-db
//   W-FN      dbGetDraftById         ←  F-plan/R4 plan-db
//   W-FN      dbUpdateDraftComposition ← F-plan/R4 plan-db
//   W-FN      dbMarkDraftEmitting    ←  F-plan/R4 plan-db (Phase 6 cleanup F005)
//   W-FN      dbMarkDraftEmitted     ←  F-plan/R4 plan-db
//   W-FN      dbMarkDraftSuperseded  ←  F-plan/R4 plan-db
//   W-FN      createArtifactGraphPort ← F-artifact/R3 artifact-graph-port (relocated from F-memory at Sprint 8 Shot 3b)
//   W-FN      createArtifact         ←  F-artifact/R3 artifact-contract
// wires-out:
//   W-INJECT  IPlanDb               →  F-plan/R2 (plan-draft, plan-emit consume)
//   W-INJECT  IPlanGraph            →  F-plan/R2 (plan-draft, plan-emit consume)
//   W-INJECT  createPlanDb          →  F-plan/R3 plan-contract
//   W-INJECT  createPlanGraph       →  F-plan/R3 plan-contract
// deps:
//   R0  ../types/plan-types
//   R4  ../exec/plan-db
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
//   R3  @/features/F-artifact/contract/artifact-graph-port
//   R3  @/features/F-artifact/contract/artifact-contract
// validated:  pending
//
// F-plan R3 — port shapes + concrete factories.
// A2: this is the bridge layer. R4 functions imported here, wrapped into
//     IPlanDb. R2 modules consume IPlanDb / IPlanGraph by type only — never
//     import exec/ or other slice R3 directly.
// A2: cross-slice R3 imports allowed (R3→R3 is permitted; R3 IS the public
//     surface). F-memory and F-artifact contracts consumed here.
// A6: port shapes declared at the inject site (R3) per spec §3.2. F-planner's
//     pattern declares IPlannerDb at R2; F-plan follows the spec literally
//     and declares IPlanDb at R3 inject — spec wins.

import type { Result, NodeId } from '@/core/types/primitives'
import type {
  EpochMs,
  PlanArtifactContent,
  PlanValidityError,
} from '@/core/types/plan-standard.types'
import type { PlanDraftId, PlanDraftState } from '../types/plan-types'

// ─── R4 imports (wired into IPlanDb factory) ─────────────────────────────────

import {
  dbInsertPlanDraft,
  dbGetOpenDraft,
  dbGetDraftById,
  dbUpdateDraftComposition,
  dbMarkDraftEmitting,
  dbMarkDraftEmitted,
  dbMarkDraftSuperseded,
} from '../exec/plan-db'

// ─── Cross-slice R3 imports (wired into IPlanGraph factory) ──────────────────
// A2 permitted: R3→R3 cross-slice imports.

// sprint-8-shot-3b: F-memory dissolved its LM v2.x engine.
//   Removed: Present, PresentState, ScopeFilter, AxisSet imports (LM v2.x reads).
//   Removed: present() field from IPlanGraph (the only consumer call site,
//            plan-draft.ts:136, was already a dead read — `void presentState`).
//   Repointed: createArtifactGraphPort from F-memory/R3 memory-graph-contract
//              to F-artifact/R3 artifact-graph-port (relocated at Sprint 8 Shot 3b).
//   Sprint 9 wires substrate thread-query (identity-recurrence) at the
//   plan-composer graphContext input boundary.

import { createArtifactGraphPort } from '@/features/F-artifact/contract/artifact-graph-port'
import {
  createArtifact,
} from '@/features/F-artifact/contract/artifact-contract'
import type {
  ArtifactGraphPort,
  CreateArtifactInput,
  CreateArtifactResult,
} from '@/features/F-artifact/contract/artifact-contract'

// ═══════════════════════════════════════════════════════════════════════════
// PORT SHAPES — consumed at R2 by type only
// ═══════════════════════════════════════════════════════════════════════════

// ─── IPlanDb ─────────────────────────────────────────────────────────────────
// All six R4 functions, surface-renamed for R2 ergonomics. Function shapes
// match plan-db.ts exports verbatim.

export interface IPlanDb {
  insert: (
    state: PlanDraftState,
  ) => Promise<Result<void>>

  getOpenDraft: (
    userId:    string,
    projectId: string,
  ) => Promise<Result<PlanDraftState | null>>

  getDraftById: (
    draftId:   PlanDraftId,
    userId:    string,
    projectId: string,
  ) => Promise<Result<PlanDraftState | null>>

  updateComposition: (
    draftId:             PlanDraftId,
    composedContent:     PlanArtifactContent | null,
    validityErrors:      PlanValidityError[] | null,
    originalUserMessage: string,
    updatedAt:           EpochMs,
  ) => Promise<Result<void>>

  markEmitting: (
    draftId:   PlanDraftId,
    updatedAt: EpochMs,
  ) => Promise<Result<void>>

  markEmitted: (
    draftId:              PlanDraftId,
    emittedAnchorNodeId:  NodeId,
    updatedAt:            EpochMs,
  ) => Promise<Result<void>>

  markSuperseded: (
    draftId:   PlanDraftId,
    updatedAt: EpochMs,
  ) => Promise<Result<void>>
}

// ─── IPlanGraph ──────────────────────────────────────────────────────────────
// Bundles the F-artifact reads R2 needs into a single port.
//
// sprint-8-shot-3b: F-memory dissolved. Previously bundled F-memory + F-artifact
// reads; now F-artifact only. The `present()` field (LM v2.x getPresentState)
// was removed — its only call site (plan-draft.ts:136) was already a dead read
// (`void presentState`). Sprint 9 reauthors plan-composer graphContext input
// against substrate thread-query.

export interface IPlanGraph {
  /** F-artifact R3: build the graph port createArtifact needs to write nodes. */
  createArtifactGraphPort: () => ArtifactGraphPort

  /** F-artifact R3: emit an artifact via AS pipeline. */
  createArtifact: (
    input: CreateArtifactInput,
    port:  ArtifactGraphPort,
  ) => Promise<CreateArtifactResult>
}

// ═══════════════════════════════════════════════════════════════════════════
// CONCRETE FACTORIES — wired at R3 plan-contract.ts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build a concrete IPlanDb instance from F-plan/R4 db functions.
 * Mirrors F-planner createPlannerDb pattern: surface-rename for R2 ergonomics
 * (insert vs dbInsertPlanDraft, etc.) while keeping R4 names verbose.
 */
export function createPlanDb(): IPlanDb {
  return {
    insert:            (state)                                                => dbInsertPlanDraft(state),
    getOpenDraft:      (userId, projectId)                                    => dbGetOpenDraft(userId, projectId),
    getDraftById:      (draftId, userId, projectId)                           => dbGetDraftById(draftId, userId, projectId),
    updateComposition: (draftId, content, errors, originalUserMessage, updatedAt) => dbUpdateDraftComposition(draftId, content, errors, originalUserMessage, updatedAt),
    markEmitting:      (draftId, updatedAt)                                   => dbMarkDraftEmitting(draftId, updatedAt),
    markEmitted:       (draftId, anchorNodeId, updatedAt)                     => dbMarkDraftEmitted(draftId, anchorNodeId, updatedAt),
    markSuperseded:    (draftId, updatedAt)                                   => dbMarkDraftSuperseded(draftId, updatedAt),
  }
}

/**
 * Build a concrete IPlanGraph instance from F-artifact contracts.
 * Each method is a thin pass-through to the underlying R3 surface.
 */
export function createPlanGraph(): IPlanGraph {
  return {
    createArtifactGraphPort: ()              => createArtifactGraphPort(),
    createArtifact:          (input, port)   => createArtifact(input, port),
  }
}

// ── createPlannerDb — pipeline IPlannerDb factory (sprint-12-shot-3) ──────────
// F-plan R3 needs access to IPlannerDb for isPipelineActive and getBuildsForAdmin.
// Delegates to F-builder/exec/builder-inject (the authoritative pipeline DB factory).
// A5: cross-slice import from R4 is acceptable here at R3 (inject layer).

export { createBuilderDb as createPlannerDb } from '@/features/F-builder/exec/builder-inject'

// ─── End of plan-inject.ts ───────────────────────────────────────────────────
