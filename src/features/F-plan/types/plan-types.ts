// @liv-standard v1.5.1
// [F-plan/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), phase-6-cleanup-cycle-4 (F015 lane-emitting symmetry)
// slice:      F-plan
// layer:      R0
// wires-in:
//   W-ATOM  NodeId                ←  core/R5 primitives
//   W-ATOM  UserId                ←  core/R5 primitives
//   W-ATOM  ProjectId             ←  core/R5 primitives
//   W-ATOM  Semver                ←  core/R5 primitives
//   W-ATOM  AppError              ←  core/R5 primitives
//   W-ATOM  CognitivePrimitive    ←  core/R5 primitives
//   W-ATOM  EpochMs               ←  core/R5 plan-standard.types
//   W-ATOM  PlanArtifactContent   ←  core/R5 plan-standard.types
//   W-ATOM  PlanValidityError     ←  core/R5 plan-standard.types
// wires-out:
//   W-ATOM  PlanDraftId            →  F-plan/R1, F-plan/R2, F-plan/R3, F-plan/R4
//   W-ATOM  PlanDraftStatus        →  F-plan/R2, F-plan/R4
//   W-ATOM  PlanDraftState         →  F-plan/R2, F-plan/R4
//   W-ATOM  PlanComposerInput      →  F-plan/R1, F-plan/R2
//   W-ATOM  PlanComposerStatement  →  F-plan/R1, F-plan/R2
//   W-ATOM  PlanComposerClassification → F-plan/R1, F-plan/R2
//   W-ATOM  PlanComposerAuthoring  →  F-plan/R1, F-plan/R2
//   W-ATOM  PlanRejectCode         →  F-plan/R1, F-plan/R2, F-plan/R3
//   W-ATOM  PlanRejectError        →  F-plan/R2, F-plan/R3
//   W-ATOM  PlanDraftSummary       →  F-plan/R2, F-plan/R3
//   W-ATOM  PlanArtifactSummary    →  F-plan/R2, F-plan/R3
//   W-ATOM  PlanExecuteResult      →  F-plan/R3 consumers (Sprint B registry pointer)
// deps:
//   R0  core/R5 primitives
//   R0  core/R5 plan-standard.types
// validated:  pending
//
// F-plan R0 — F-plan-local atom declarations.
// A1: F-plan-internal types declared here. Plan Standard atoms (PlanArtifactContent,
//     PlanValidityError, DomainBinding, etc.) are owned by core/R5 and only re-typed
//     in import statements; never redeclared.
// A6: every F-plan-local type lives in this file or plan-const.ts. R1+ imports;
//     never inlines.

import type {
  NodeId,
  UserId,
  ProjectId,
  Semver,
  AppError,
  CognitivePrimitive,
} from '@/core/types/primitives'

import type {
  EpochMs,
  PlanArtifactContent,
  PlanValidityError,
} from '@/core/types/plan-standard.types'

// ═══════════════════════════════════════════════════════════════
// F-PLAN R0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Sprint A scope: PlanComposerInput / PlanDraftState / executor result + error
// surface. No event types this sprint (Sprint A introduces no events).
// PA-row coverage: types in this file are the carriers; PA enforcement happens
// at R1 (compose / validate). PA9 carrier: PlanArtifactContent.binding is
// captured verbatim — F-plan does not re-declare DomainBinding here.

// ─── F-plan-local identifiers ─────────────────────────────────────────────────
// AK-REF branded; declared once at F-plan/R0 per A1+A6.

/**
 * Draft identifier — unique per plan_drafts row.
 * Generated at draft creation via injected generateId('plan-draft').
 */
export type PlanDraftId = string & { readonly _brand: 'PlanDraftId' }

// ─── Draft lifecycle state ────────────────────────────────────────────────────

/**
 * Draft status — finite-state lifecycle for a PlanDraftState row.
 *
 *   draft       — composed, persisted, awaiting confirm. Mutable composedContent.
 *   emitting    — confirm received, AS emission in flight. Three-state F005:
 *                 set BEFORE graph write; cleared to 'emitted' AFTER graph write
 *                 succeeds. If process dies mid-flight or DB markEmitted fails
 *                 post-graph-write, lane stays at 'emitting' as an explicit
 *                 recoverable half-state for admin reconciliation.
 *   emitted     — AS createArtifact returned ok AND DB markEmitted succeeded;
 *                 emittedAnchorNodeId populated. Terminal.
 *   superseded  — replaced by a later draft for the same (userId, projectId)
 *                 lane. Terminal; no further transitions.
 *
 * Terminal states: emitted, superseded. Non-terminal: draft, emitting.
 * Lane invariant: at most one draft+emitting row per (userId, projectId).
 * Enforced by R4 partial unique index: idx_plan_drafts_open.
 *
 * Phase 6 Cleanup F005: 'confirmed' (vestigial) replaced with 'emitting'.
 */
export type PlanDraftStatus = 'draft' | 'emitting' | 'emitted' | 'superseded'

/**
 * Draft persistence atom. Pattern α (mirror F-planner builds table).
 * Persisted by F-plan/R4 plan-db.ts. Read by R2 plan-draft / plan-emit.
 * R0+R4 only — R1 never sees this shape (composition is pure, draft state
 * lives in app layer).
 *
 * Phase 6 Cleanup F006: originalUserMessage carries the user's last intent
 * expression for this draft. Persisted at createDraft, refreshed on amendDraft
 * (each amend is a new intent), used by confirmAndEmit to compose the emitted
 * artifact against the actual intent rather than the confirm keyword.
 */
export type PlanDraftState = {
  draftId:              PlanDraftId
  userId:               UserId
  projectId:            ProjectId
  turnId:               string
  status:               PlanDraftStatus
  composedContent:      PlanArtifactContent | null    // populated on successful compose
  validityErrors:       PlanValidityError[] | null    // populated when compose returns Result.err
  originalUserMessage:  string                        // F006: last intent expression — Sprint A used input.content at confirm; cleanup composes against this
  createdAt:            EpochMs
  updatedAt:            EpochMs
  emittedAnchorNodeId:  NodeId | null                 // populated when status='emitted'
  priorAnchorNodeId:    NodeId | null                 // PA5 chain: prior plan's anchor on amend
}

// ─── Composer input (R1 consumes) ─────────────────────────────────────────────
// Built at R2 from F-codec post-A6 outputs + F-memory present-state read.
// Spec §3.3.2: graphContext follows the present-state pattern in plan-draft.ts
// (getPresentState + ARTIFACT_PREFIX filter).

/**
 * Single statement from F-memory present-state.
 *
 * Sprint A carries the subset of PresentStateStatement fields the composer
 * needs: value (resolved string), confidence (5-tier ranking), recency
 * (EMA-weighted recency score). We omit `arm`, `source`, `layer` — they're
 * available via the F-memory port if downstream composition needs them.
 *
 * `confidence` carries F-memory's `ConfidenceTier` union literally — a small
 * stable union restated here at the F-plan boundary (A3-style boundary type,
 * not an A1 atom redeclaration). F-memory does not re-export ConfidenceTier
 * from its R3 surface; if F-memory adds tiers, F-plan adapts at next iteration.
 */
export type PlanStatementConfidence =
  | 'identity'
  | 'purpose'
  | 'consolidated'
  | 'recent'
  | 'new'

export type PlanComposerStatement = {
  value:      string
  confidence: PlanStatementConfidence
  recency:    number
}

/**
 * F-codec post-A6 classification snapshot. Provided by R2 caller (R2 reads
 * F-codec output from upstream encode result; R1 does not call F-codec).
 */
export type PlanComposerClassification = {
  classificationNodeId: NodeId
  primitive:            CognitivePrimitive
  confidence:           number
}

/**
 * Authoring program identity carried into PlanArtifactContent.producedBy (PA9).
 * Matches Plan Standard AuthoringProgramRef shape; declared here as an alias-
 * shape input wrapper for type clarity at the F-plan boundary. The actual
 * value emitted is { programId: 'F-plan', programVersion: <semver> }.
 */
export type PlanComposerAuthoring = {
  programId:      'F-plan'
  programVersion: Semver
}

/**
 * R1 compose() input. Pure input — no I/O hooks, no DB refs.
 * Constructed at R2 from upstream codec output + F-memory read. R1 consumes
 * this and produces Result<PlanArtifactContent, PlanValidityError>.
 */
export type PlanComposerInput = {
  userMessage:    string                              // raw user text (echoed in summary)
  classification: PlanComposerClassification          // F-codec post-A6
  graphContext: {
    statements:   PlanComposerStatement[]             // F-memory getPresentState
    findingsRefs: string[]                            // artifact://… references (discovery refs)
  }
  authoring:      PlanComposerAuthoring               // → producedBy
}

// ─── F-plan reject codes (executor surface) ───────────────────────────────────
// R3 executePlan returns Result<PlanExecuteResult, PlanRejectError>.
// PlanValidityError (Plan Standard atom) wraps PA-axiom failures — distinct
// surface from F-plan-local rejects below.

/**
 * F-plan reject codes. Terminal at R3 surface — caller (Sprint B dispatch)
 * pattern-matches.
 *
 *   PLAN_REJECTED_NO_PROJECT_SCOPE  — projectId missing/empty (D-PROJECT)
 *   PLAN_REJECTED_EMPTY_INPUT       — D-DECOMPOSE produced zero objectives
 *   PLAN_VALIDITY_FAILED            — PA gate failed (carries failedAxiom via
 *                                     PlanValidityError); surfaced as wrapper
 *                                     when reaching the executor result.
 *   PLAN_DRAFT_NOT_FOUND            — confirmDraft called against missing draft
 *   PLAN_EMISSION_REJECTED          — F-artifact createArtifact returned err
 *   PLAN_EMITTED_BUT_NOT_RECORDED   — F005: graph write succeeded, but DB
 *                                     markEmitted failed. Plan IS in graph;
 *                                     local draft tracking inconsistent. Carries
 *                                     planAnchorNodeId in context for admin
 *                                     reconciliation. Lane stays at 'emitting'.
 *   PLAN_LANE_EMITTING              — F015: lane has an in-flight emission
 *                                     (status='emitting'). Caller retries after
 *                                     the in-flight emission resolves to
 *                                     terminal. Carries draftId in context.
 *                                     Derived from MFv3.0 directional symmetry +
 *                                     Cognitive Standard intent preservation:
 *                                     not silently blocked, not destructively
 *                                     superseded — typed reject with retry
 *                                     context.
 */
export type PlanRejectCode =
  | 'PLAN_REJECTED_NO_PROJECT_SCOPE'
  | 'PLAN_REJECTED_EMPTY_INPUT'
  | 'PLAN_VALIDITY_FAILED'
  | 'PLAN_DRAFT_NOT_FOUND'
  | 'PLAN_EMISSION_REJECTED'
  | 'PLAN_EMITTED_BUT_NOT_RECORDED'
  | 'PLAN_LANE_EMITTING'

/**
 * F-plan executor error payload. Conforms to AppError so it composes with
 * core Result<T,E>. failedAxiom is populated when code='PLAN_VALIDITY_FAILED'
 * and mirrors PlanValidityError.failedAxiom.
 */
export type PlanRejectError = AppError & {
  code:         PlanRejectCode
  failedAxiom?: string
}

// ─── Render-side summary atoms (R3 surface for Sprint B mapping) ──────────────
// Designed for chat-response path: string body suitable for system-prompt
// injection or direct chat render (mirror codec planning ModuleExecutionResult.response).
// Sprint A: F-plan returns these from executePlan; Sprint B maps to
// ModuleExecutionResult shape at the registry-pointer wire site.

/**
 * Summary of an in-progress draft, returned for review before user confirms.
 * Renderable as chat text via `body`. Structured fields available for richer UI.
 */
export type PlanDraftSummary = {
  draftId:        PlanDraftId
  body:           string                              // chat-ready render
  objectiveCount: number
  echo:           string                              // user message echo
  status:         PlanDraftStatus
}

/**
 * Summary returned post-emission. Anchor id is the AS-emitted plan anchor
 * (ArA2 artifactAnchorNodeId).
 */
export type PlanArtifactSummary = {
  planAnchorNodeId: NodeId
  body:             string                            // chat-ready render
  objectiveCount:   number
  planVersion:      Semver
}

// ─── Executor result (R3 surface) ─────────────────────────────────────────────
// Three-way discriminated union. Caller pattern-matches on `kind`.
//   draft    — first turn or amend resulted in new/updated draft, awaiting confirm
//   emitted  — confirm path completed; AS emission committed
//   amended  — open draft updated (re-compose path; no emission)
// Sprint A keeps these as F-plan-internal atoms; Sprint B maps to
// codec-orchestrate's ModuleExecutionResult at dispatch.

export type PlanExecuteResult =
  | { kind: 'draft';   draftId: PlanDraftId; summary: PlanDraftSummary }
  | { kind: 'emitted'; planAnchorNodeId: NodeId; summary: PlanArtifactSummary }
  | { kind: 'amended'; draftId: PlanDraftId; summary: PlanDraftSummary }

// ─── End of plan-types.ts ────────────────────────────────────────────────────
