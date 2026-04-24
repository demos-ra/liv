// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId              ← core/R5 primitives
//   W-ATOM UserId              ← core/R5 primitives
//   W-ATOM Semver              ← core/R5 primitives
//   W-ATOM Result              ← core/R5 primitives
//   W-ATOM AppError            ← core/R5 primitives
//   W-ATOM ArtifactEmission    ← core/R5 ./artifact-standard.types
//   W-ATOM ArtifactPayload     ← core/R5 ./artifact-standard.types
//   W-ATOM CreateArtifactInput ← core/R5 ./artifact-standard.types
//   W-ATOM ArtifactEdgeKind    ← core/R5 ./artifact-standard.types
//   W-ATOM PlanArtifactContent ← core/R5 ./plan-standard.types
//   W-ATOM Declaration         ← core/R5 ./plan-standard.types
//   W-ATOM DeclId              ← core/R5 ./plan-standard.types
//   W-ATOM DomainBinding       ← core/R5 ./plan-standard.types
//   (… additional Plan type re-exports — see file body)
// wires-out:
//   W-ATOM InstanceTerminalState     → RunReport consumers
//   W-ATOM SetTerminalState          → RunReport consumers
//   W-ATOM RunOutcome                → RunReport consumers
//   W-ATOM ErrorClass                → RunReport consumers
//   W-ATOM ErrorResolution           → RunReport consumers
//   W-ATOM ShapePositional           → RunReport consumers
//   W-ATOM ExecutionPositional       → RunReport consumers
//   W-ATOM BoundsPositional          → RunReport consumers
//   W-ATOM TypedAtom                 → RunReport consumers
//   W-ATOM InstanceError             → RunReport consumers
//   W-ATOM InstanceResult            → RunReport consumers
//   W-ATOM SetViolation              → RunReport consumers
//   W-ATOM PartialSuccessRecord      → RunReport consumers
//   W-ATOM Aggregation               → RunReport consumers
//   W-ATOM RunReportContent          → Phase 4b engine, RunReport consumers
//   W-ATOM MIInput                   → all M-I callers (Builder, Verify, etc.)
//   W-ATOM MIValidityError           → M-I callers (error surface)
//   W-ATOM MIEmissionResult          → M-I callers (Result-wrapped)
//   W-ATOM MIGateResult              → framework-audit
//   W-ATOM MIDimensionResult         → framework-audit
//   W-ATOM MICustodyRow              → framework-audit
//   W-ATOM MIHandoffRuleInstance     → framework-audit
// deps:
//   R5 ./primitives
//   R5 ./artifact-standard.types
//   R5 ./plan-standard.types
//   R5 ../constants/multi-instance-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// MULTI-INSTANCE STANDARD v2.3 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Multi-Instance Standard v2.3 landing: regenerated against metaframework-v3-1;
// fix-round-1 (§3.8 Relational + §6 Coupling + §10 externalization).
// Consumes Plan Standard v2.2 by graph identity. Carrier pinned to AS v2.2.
// Canonical spec: src/core/standards/multi-instance-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard:   Multi-Instance Standard v2.3
// amended:    none
// slice:      core
// layer:      R5
// wires-in:
//   W-ATOM  NodeId, UserId, Semver, Result, AppError  <-  primitives.ts
//   W-ATOM  ArtifactEmission, ArtifactPayload, CreateArtifactInput  <-  artifact-standard.types.ts (AS v2.2)
//   W-ATOM  PlanArtifactContent, Declaration, DomainBinding, DeclId, RoleClassId, TierClass,
//           TypedAtomRef, PlanTopology, PlanId, EpochMs, Milliseconds, DataFlowEdge,
//           RenderContractDescriptor, ValidateContractDescriptor  <-  plan-standard.types.ts (Plan v2.2)
// wires-out:
//   W-ATOM  MIInput, RunReportContent, MIEmissionResult, MIValidityError,
//           InstanceResult, InstanceError, SetViolation, Aggregation,
//           PartialSuccessRecord, TypedAtom, InstanceTerminalState,
//           SetTerminalState, RunOutcome, ErrorClass, ErrorResolution,
//           MIGateResult, MIDimensionResult, MICustodyRow, MIHandoffRuleInstance
//           ->  authoring programs, framework-audit, Verify
// deps:       artifact-standard.types.ts (AS v2.2), plan-standard.types.ts (Plan v2.2)
// validated:  pending L0 (cycle-3 confirmation)

// ─── Substrate + core/R5 imports ─────────────────────────────────────────────

import type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
} from './primitives'

// ─── Cross-framework imports (AS v2.2) ───────────────────────────────────────

import type {
  ArtifactEmission,
  ArtifactPayload,
  CreateArtifactInput,
  ArtifactEdgeKind,
} from './artifact-standard.types'

// ─── Cross-framework imports (Plan v2.2) ─────────────────────────────────────

import type {
  PlanArtifactContent,
  Declaration,
  DeclId,
  DomainBinding,
  RenderContractDescriptor,
  ValidateContractDescriptor,
  RoleClassId,
  TierClass,
  TypedAtomRef,
  PlanTopology,
  PlanId,
  EpochMs,
  Milliseconds,
  DataFlowEdge,
} from './plan-standard.types'

// ─── Framework-local identifiers + atoms ─────────────────────────────────────

/**
 * Instance terminal state — per §3.5 enum.
 * IA1: every dispatched instance reaches one of these terminal values.
 */
export type InstanceTerminalState = 'complete' | 'failed' | 'escalated'

/**
 * Set terminal state — per §3.5 enum.
 * Alias `RunOutcome` used in `RunReportContent.outcome` field.
 * Note: includes 'partial' (per §3.4.a aggregation rule for tier topology
 * with partialSuccess policy), absent from InstanceTerminalState.
 */
export type SetTerminalState = 'complete' | 'failed' | 'escalated' | 'partial'

/**
 * `RunOutcome` alias of `SetTerminalState` — used as `RunReportContent.outcome` field type.
 */
export type RunOutcome = SetTerminalState

/**
 * Error class enum — per §3.5 + IA7a.
 * CLASS_2 = output-quality / validation / capacity-breach; retry-with-context.
 * CLASS_3 = infrastructure; infra-retry then escalate.
 */
export type ErrorClass = 'CLASS_2' | 'CLASS_3'

/**
 * Error resolution enum — per §3.5.
 * 'retried' = budget consumed, instance re-dispatched.
 * 'escalated' = forwarded out of M-I runtime to caller.
 * 'terminal' = instance status transitioned to failed/escalated.
 */
export type ErrorResolution = 'retried' | 'escalated' | 'terminal'

/**
 * Shape-axis positional — runtime tracking of execution-set progression.
 */
export type ShapePositional = 'dispatched' | 'settled'

/**
 * Execution-axis positional — per-instance lifecycle.
 * Note: 'pending' + 'running' are non-terminal; terminal values from InstanceTerminalState.
 */
export type ExecutionPositional =
  | 'pending'
  | 'running'
  | InstanceTerminalState

/**
 * Bounds-axis positional — per-bound-check observation.
 */
export type BoundsPositional = 'within' | 'breached'

// ─── Typed output atom ───────────────────────────────────────────────────────

/**
 * Typed output atom — wrapper for one instance's output value.
 * `typeRef` consumed from PlanArtifactContent.intent[declId].outputContract (Plan v2.2).
 * `value` validated by DomainBinding.validateContract (IA3); opaque to M-I.
 */
export type TypedAtom = {
  typeRef: TypedAtomRef
  value:   unknown
}

// ─── InstanceResult + sub-atoms ──────────────────────────────────────────────

/**
 * Instance-level error record — per-failure captured shape.
 */
export type InstanceError = {
  class:      ErrorClass
  reason:     string
  message:    string
  resolution: ErrorResolution
}

/**
 * Per-instance terminal result. One entry in RunReportContent.instanceResults[].
 * IA1: `status` reaches a terminal state by run completion.
 */
export type InstanceResult = {
  declId:     DeclId
  status:     InstanceTerminalState
  output?:    TypedAtom
  tokenCount: number
  durationMs: number
  retries:    number
  errors:     InstanceError[]
}

/**
 * Set-level failsafe breach record. One entry per triggered failsafe.
 * IA4a + IA4b: breach suppresses retries and transitions set to failed/escalated.
 */
export type SetViolation = {
  failsafe:   string          // key from PlanArtifactContent.limit.perSet
  breachedAt: EpochMs
  reason:     string
}

/**
 * Partial-success satisfaction record — populated only when
 * PlanArtifactContent.limit.perSet.partialSuccess.allowed === true.
 */
export type PartialSuccessRecord = {
  required:  number
  achieved:  number
  satisfied: boolean          // achieved >= required
}

/**
 * Aggregation section — per-run topology-driven final-output computation.
 * topology verbatim from consumed PlanArtifactContent.shape.topology.
 */
export type Aggregation = {
  topology:        PlanTopology
  finalOutput?:    TypedAtom
  partialSuccess?: PartialSuccessRecord
}

// ─── RunReportContent (W-ATOM; rides as AS v2.2 payload.content) ─────────────

/**
 * W-ATOM emitted by M-I's executeRun entry point via HR-MI3.
 * Rides inside ArtifactPayload.content when AS v2.2 carries it at S3.
 * Every field traces to declared provenance in §6.5 custody + §2.2 three-source summary.
 */
export type RunReportContent = {
  // Verbatim from consumed PlanArtifactContent
  planId:               PlanId
  planAnchorNodeId:     NodeId
  planVersion:          Semver
  bindingDomainId:      string
  bindingDomainVersion: Semver

  // Runtime-generated / runtime-captured
  runId:                string
  startedAt:            EpochMs
  completedAt:          EpochMs
  outcome:              RunOutcome
  instanceResults:      InstanceResult[]
  setViolations:        SetViolation[]
  aggregation:          Aggregation
}

// ─── Input W-ATOM (schema.input per MA-S1) ───────────────────────────────────

/**
 * W-ATOM consumed by M-I's executeRun entry point.
 * Adapter handle NOT present — it is a LIV-Standard R4 runtime dependency
 * injected at slice-wire time, not a schema.input field.
 */
export type MIInput = {
  planAnchorNodeId: NodeId
  userId:           UserId
  runTurnId:        string
}

// ─── Error + return channel ──────────────────────────────────────────────────

/**
 * M-I validity error — AppError subtype per primitives.ts core/R5.
 * Return channel for all fail paths at S1, S2, S3 per §5.6 failure-mode table.
 */
export type MIValidityError = AppError & {
  code:
    | 'MI_PLAN_NOT_FOUND'
    | 'MI_PLAN_INVALID'
    | 'MI_AXIOM_VIOLATION'
    | 'MI_INHERITED_GATE_VIOLATION'
    | 'MI_AS_EMISSION_FAILED'
    | 'MI_ADAPTER_FAILURE'
    | 'MI_BINDING_RESOLUTION_FAILURE'
    | 'MI_SET_FAILSAFE_BREACH'
  phase:          'S1' | 'S2' | 'S3'
  runId?:         string
  gateId?:
    | 'G-MI1'
    | 'G-MI2'
    | 'G-MI3'
    | 'G-MI4a'
    | 'G-MI4b'
    | 'G-MI5'
    | 'G-MI6'
    | 'G-MI7a'
    | 'G-MI7b'
    | 'G-MI7c'
  testedAxiomId?:
    | 'IA1'
    | 'IA2'
    | 'IA3'
    | 'IA4a'
    | 'IA4b'
    | 'IA5'
    | 'IA6'
    | 'IA7a'
    | 'IA7b'
    | 'IA7c'
  declId?:        DeclId
}

/**
 * Emission result — return channel for M-I's executeRun entry point.
 * Success branch: AS v2.2 ArtifactEmission (receipt from HR-MI3).
 * Failure branch: MIValidityError (typed fail per phase + gate).
 */
export type MIEmissionResult = Result<ArtifactEmission, MIValidityError>

// ─── Axiom-gate result atom (per §4.2) ───────────────────────────────────────

/**
 * M-I-own axiom-gate result shape. Consumed by framework-audit + S2 execution.
 */
export type MIGateResult = {
  gateId:
    | 'G-MI1'
    | 'G-MI2'
    | 'G-MI3'
    | 'G-MI4a'
    | 'G-MI4b'
    | 'G-MI5'
    | 'G-MI6'
    | 'G-MI7a'
    | 'G-MI7b'
    | 'G-MI7c'
  testedAxiomId:
    | 'IA1'
    | 'IA2'
    | 'IA3'
    | 'IA4a'
    | 'IA4b'
    | 'IA5'
    | 'IA6'
    | 'IA7a'
    | 'IA7b'
    | 'IA7c'
  result:         'pass' | 'fail'
  escalationPath: 'G-MI-retry' | 'G-MI-escalate-to-L0'
}

// ─── Framework-audit X-dimension result (per §4.4) ───────────────────────────

/**
 * M-I dimension result shape — consumed by framework-audit X1–X10.
 */
export type MIDimensionResult = {
  dimensionId:
    | 'X1' | 'X2' | 'X3' | 'X4' | 'X5'
    | 'X6' | 'X7' | 'X8' | 'X9' | 'X10'
  status:       'pending-first-run' | 'pass' | 'fail'
  evidence:     string
}

// ─── Custody row (per §6.5) ──────────────────────────────────────────────────

/**
 * M-I custody row shape — per substrate SG3.
 */
export type MICustodyRow = {
  atom:      string
  owner:     string
  layer:     'L1' | 'L2' | 'L3' | 'core/R5'
  consumers: string[]
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ───────────────────

/**
 * M-I-local handoff rule instance. Consumed by framework-audit X3 C5 captureShape check.
 * Shape conforms to substrate §8.2 HandoffRulePrimitive amended.
 */
export type MIHandoffRuleInstance = {
  id:                     'HR-MI1' | 'HR-MI2' | 'HR-MI3' | 'HR-MI4'
  direction:              {
    from: { id: string; version: Semver }
    to:   { id: string; version: Semver }
  }
  carrierApplicability:   Array<'self' | 'named' | 'none'>
  diagnosticSignificance: boolean
  captureShape?:          {
    capturedFields: string[]
    captureTarget:  'registry' | 'audit-trail'
    queryInterface: string
  }
  invariant:              string
}

// ─── Re-exports (so downstream consumers can import transitively) ────────────

export type { ArtifactEmission, ArtifactPayload, CreateArtifactInput, ArtifactEdgeKind }
export type { PlanArtifactContent, Declaration, DeclId, DomainBinding,
              RenderContractDescriptor, ValidateContractDescriptor,
              RoleClassId, TierClass, TypedAtomRef, PlanTopology,
              PlanId, EpochMs, Milliseconds, DataFlowEdge }
