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
//   W-ATOM ArtifactPayload     ← core/R5 ./artifact-standard.types
//   W-ATOM ArtifactEmission    ← core/R5 ./artifact-standard.types
//   W-ATOM CreateArtifactInput ← core/R5 ./artifact-standard.types
// wires-out:
//   W-ATOM DeclId                     → all plan consumers, Multi-Instance Standard (AK-REF branded)
//   W-ATOM TypedAtomRef               → all plan consumers (AK-REF branded)
//   W-ATOM RoleClassId                → all plan consumers (AK-REF branded)
//   W-ATOM TierClass                  → all plan consumers (AK-REF branded)
//   W-ATOM PlanId                     → all plan consumers (AK-REF branded)
//   W-ATOM EpochMs                    → all plan consumers (AK-REF branded)
//   W-ATOM Milliseconds               → all plan consumers (AK-REF branded)
//   W-ATOM PlanTopology               → all plan consumers
//   W-ATOM PlanShapePositional        → all plan consumers
//   W-ATOM PlanIntentPositional       → all plan consumers
//   W-ATOM PlanCapacityPositional     → all plan consumers
//   W-ATOM PlanLimitScope             → all plan consumers
//   W-ATOM PlanLimitKind              → all plan consumers
//   W-ATOM PlanLimitPositional        → all plan consumers
//   W-ATOM CapacityBudget             → domain binding authors, framework registry
//   W-ATOM FailsafeRule               → domain binding authors, framework registry
//   W-ATOM SplitAxisDescriptor        → domain binding authors, framework registry
//   W-ATOM TypedAtomSchema            → all consumers, framework registry
//   W-ATOM RenderContractDescriptor   → Multi-Instance consumers, framework registry
//   W-ATOM ValidateContractDescriptor → Multi-Instance consumers, framework registry
//   W-ATOM RoleClassInstance          → Plan authors, domain standards
//   W-ATOM DomainBinding              → Plan authors, Multi-Instance executors
//   W-ATOM DataFlowEdge               → Multi-Instance runtime wire dispatch
//   W-ATOM Declaration                → Multi-Instance per-declaration execution
//   W-ATOM PlanShape                  → all plan consumers
//   W-ATOM IntentEntry                → all plan consumers
//   W-ATOM PlanIntent                 → all plan consumers
//   W-ATOM SplitLineage               → all plan consumers
//   W-ATOM CapacityEntry              → all plan consumers
//   W-ATOM PlanCapacity               → all plan consumers
//   W-ATOM PerDeclLimit               → all plan consumers
//   W-ATOM PerSetLimit                → all plan consumers
//   W-ATOM PlanLimit                  → all plan consumers
//   W-ATOM AuthoringProgramRef        → all plan consumers
//   W-ATOM PlanArtifactContent        → Multi-Instance Standard, Phase 4+ plan consumers
//   W-ATOM PlanInput                  → any Plan authoring program (Builder, Research, etc.)
//   W-ATOM PlanHandoffRuleInstance    → framework-audit
//   W-ATOM PlanGateResult             → framework-audit
//   W-ATOM PlanDimensionResult        → framework-audit
//   W-ATOM PlanCustodyRow             → framework-audit
//   W-ATOM PlanValidityError          → Plan callers (error surface)
//   W-ATOM PlanEmissionResult         → Plan callers (Result-wrapped)
// deps:
//   R5 ./primitives
//   R5 ./artifact-standard.types
//   R5 ../constants/plan-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLAN STANDARD v2.2 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Plan Standard v2.2 landing: regenerated against metaframework-v3-1;
// fix-round-1 (§6 Coupling consolidation) + fix-round-2 (§1 scopeOut row per X4).
// Canonical spec: src/core/standards/plan-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// plan-standard.types.ts
// R5 type atoms for Plan Standard v2.2
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2 (frozen input)
//
// Consumes: primitives.ts (NodeId, UserId, Semver, Result, AppError)
//           artifact-standard.types.ts (ArtifactPayload, ArtifactEmission, CreateArtifactInput)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in plan-standard-v2-2.md §6 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per spec §Constraints).

import type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
} from './primitives'

import type {
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from './artifact-standard.types'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * Declaration identifier — unique within one plan's `shape.declarations`.
 * Scope: one PlanArtifactContent instance.
 */
export type DeclId = string & { readonly _brand: 'DeclId' }

/**
 * Typed-atom reference — names a W-ATOM shape declared in the captured
 * DomainBinding.roleClasses[role].inputType / outputType.
 * Resolved against binding at emission-time (PA3).
 */
export type TypedAtomRef = string & { readonly _brand: 'TypedAtomRef' }

/**
 * Role-class identifier — keys of DomainBinding.roleClasses; declared by domain standard.
 */
export type RoleClassId = string & { readonly _brand: 'RoleClassId' }

/**
 * Tier-class identifier — keys of DomainBinding.tierLimits; declared by domain standard.
 */
export type TierClass = string & { readonly _brand: 'TierClass' }

/**
 * Plan-local identifier for one emitted PlanArtifactContent.
 * Scope: all plans in registry (pins to AS anchor node identity per §9.1).
 */
export type PlanId = string & { readonly _brand: 'PlanId' }

/**
 * Epoch milliseconds.
 */
export type EpochMs = number & { readonly _brand: 'EpochMs' }

/**
 * Millisecond duration.
 */
export type Milliseconds = number & { readonly _brand: 'Milliseconds' }

// ─── Topology and positional enums ───────────────────────────────────────────

/**
 * Shape/topology enum — categorical universal-variable cell for Shape axis.
 * Exhaustive at v2.2.
 */
export type PlanTopology = 'sequence' | 'tier' | 'loop' | 'singleton'

/**
 * Shape positional state — Positional universal-variable cell for Shape axis.
 */
export type PlanShapePositional = 'pending' | 'emitted' | 'superseded'

/**
 * Intent positional state — Positional universal-variable cell for Intent axis.
 */
export type PlanIntentPositional = 'unbound' | 'bound'

/**
 * Capacity positional state — Positional universal-variable cell for Capacity axis.
 */
export type PlanCapacityPositional = 'within-budget' | 'over-budget' | 'split'

/**
 * Limit scope — Relational universal-variable cell for Limit axis.
 */
export type PlanLimitScope = 'declaration' | 'set'

/**
 * Limit kind enum — Categorical universal-variable cell for Limit axis.
 * Exhaustive at v2.2.
 */
export type PlanLimitKind =
  | 'retry'
  | 'maxTime'
  | 'maxTransitions'
  | 'maxReentries'
  | 'domainFailsafe'
  | 'partialSuccess'

/**
 * Limit positional state — Positional universal-variable cell for Limit axis.
 */
export type PlanLimitPositional = 'unconsumed' | 'consumed' | 'breached'

// ─── DomainBinding (shape; instance filled by domain standard) ───────────────

/**
 * Capacity budget — numeric budget per tier class.
 * Concrete unit declared per domain at binding-instance site.
 */
export type CapacityBudget = {
  budget: number
  unit: string   // domain-declared unit label
}

/**
 * Failsafe rule — domain-declared threshold + action descriptor.
 * Instance content owned by domain standard; shape owned by Plan.
 */
export type FailsafeRule = {
  thresholdKind: string   // domain-declared kind label
  thresholdValue: number
  actionRef: string       // domain-declared action identifier
}

/**
 * Split-axis descriptor — names the decomposition axis used pre-emission.
 * Instance content (axis kind, split function ref) owned by domain standard.
 */
export type SplitAxisDescriptor = {
  axisId: string          // domain-declared axis identifier
  splitFnRef: string      // domain-declared function identifier
}

/**
 * Typed-atom schema — W-ATOM shape declaration referenced by TypedAtomRef.
 * Instance content owned by domain standard's R5 type declarations.
 */
export type TypedAtomSchema = {
  ref: TypedAtomRef       // self-identifier
  shapeRef: string        // domain-declared schema identifier
}

/**
 * Render-contract descriptor — M-I runtime slot, pass-through at Plan.
 * Instance content owned by domain standard; semantics owned by Multi-Instance Standard (IA6).
 */
export type RenderContractDescriptor = {
  contractRef: string     // domain-declared descriptor identifier
}

/**
 * Validate-contract descriptor — M-I runtime slot, pass-through at Plan.
 * Instance content owned by domain standard; semantics owned by Multi-Instance Standard (IA6).
 */
export type ValidateContractDescriptor = {
  contractRef: string     // domain-declared descriptor identifier
}

/**
 * Role-class instance — one entry in DomainBinding.roleClasses.
 */
export type RoleClassInstance = {
  inputType:  TypedAtomSchema
  outputType: TypedAtomSchema
  tierHint:   TierClass
}

/**
 * DomainBinding — Plan declares shape; domain standard fills instance values.
 * Captured verbatim at emission per PA9.
 */
export type DomainBinding = {
  domainId:          string                                         // provenance: domain standard
  domainVersion:     Semver                                         // provenance: domain standard
  roleClasses:       { [id: string]: RoleClassInstance }            // key = RoleClassId
  tierLimits:        { [tier: string]: CapacityBudget }             // key = TierClass
  splitAxis:         SplitAxisDescriptor
  domainFailsafes:   { [key: string]: FailsafeRule }
  renderContract:    RenderContractDescriptor
  validateContract:  ValidateContractDescriptor
}

// ─── Declaration (plan's atomic unit) ────────────────────────────────────────

/**
 * Data-flow edge — typed wire from source declaration's output to current declaration's input.
 * Wire type resolves against DomainBinding.roleClasses per PA12.
 */
export type DataFlowEdge = {
  from: DeclId
  wire: TypedAtomRef
}

/**
 * Declaration — atomic statement describing one instance + its plan-local relations.
 * PA1: exactly one instance per declaration.
 */
export type Declaration = {
  id:        DeclId
  dependsOn: DeclId[]                // PA2a (reference closure) + PA2b (acyclicity)
  dataFlow:  DataFlowEdge[]          // PA11 (from closure) + PA12 (wire typing)
}

// ─── PlanArtifactContent sections (§9 output schema) ─────────────────────────

/**
 * Shape section — topology + declaration set.
 * Provenance: authoring-program-computed from input.preplanInputs.
 */
export type PlanShape = {
  topology:     PlanTopology
  declarations: Declaration[]         // length >= 1 per PA1 (at-least-one-instance)
}

/**
 * Intent entry — per-declaration role + contracts + tier hint.
 * inputContract / outputContract derive from binding (PA3).
 * role and tierHint author-computed keys of binding (PA8).
 */
export type IntentEntry = {
  role:           RoleClassId
  inputContract:  TypedAtomRef
  outputContract: TypedAtomRef
  tierHint:       TierClass
}

/**
 * Intent section — keyed by DeclId.
 */
export type PlanIntent = {
  [declId: string]: IntentEntry
}

/**
 * Split-lineage reference — provenance record only, not a dependency.
 * PA10a: parentDeclId is NOT present in shape.declarations of emitted plan.
 * PA10b: splitLineage is a provenance reference (not an edge).
 */
export type SplitLineage = {
  parentDeclId: DeclId
  splitAxis:    string               // identifier from DomainBinding.splitAxis
}

/**
 * Capacity entry — per-declaration estimated cost + optional split lineage.
 */
export type CapacityEntry = {
  estimatedCost: number
  splitLineage?: SplitLineage
}

/**
 * Capacity section — keyed by DeclId.
 */
export type PlanCapacity = {
  [declId: string]: CapacityEntry
}

/**
 * Per-declaration limit — retry budget only.
 * PA4a: every declaration has retryBudget.
 */
export type PerDeclLimit = {
  retryBudget: number
}

/**
 * Per-set limit — plan-wide failsafes and partial-success policy.
 * PA4b: maxTime, maxTransitions, maxReentries declared.
 */
export type PerSetLimit = {
  maxTime:          Milliseconds
  maxTransitions:   number
  maxReentries:     number
  partialSuccess:   { allowed: boolean; minSuccesses?: number }
  domainFailsafes?: { [key: string]: FailsafeRule }
}

/**
 * Limit section — declaration-scoped + set-scoped entries.
 */
export type PlanLimit = {
  perDecl: { [declId: string]: PerDeclLimit }
  perSet:  PerSetLimit
}

// ─── PlanArtifactContent (Plan's output W-ATOM; rides as AS payload.content) ─

/**
 * Authoring-program identity — declared by caller.
 */
export type AuthoringProgramRef = {
  programId:      string
  programVersion: Semver
}

/**
 * W-ATOM emitted by Plan's emission entry point.
 * Rides inside ArtifactPayload.content when AS v2.2 carries it.
 * Every field traces to declared provenance in §6.5 custody table.
 */
export type PlanArtifactContent = {
  planId:      PlanId                  // runtime-generated at emission (pins to AS anchor node identity)
  planVersion: Semver                  // authoring-program-computed (new semver per re-plan per PA5)
  producedBy:  AuthoringProgramRef     // verbatim from input.authoringProgram
  producedAt:  EpochMs                 // runtime-captured at emission

  binding:     DomainBinding           // verbatim from input.domainBinding (frozen per PA9)

  shape:       PlanShape               // authoring-program-computed
  intent:      PlanIntent              // authoring-program-computed, resolved against binding (PA3, PA8)
  capacity:    PlanCapacity            // authoring-program-computed + binding.splitAxis for splits
  limit:       PlanLimit               // authoring-program-computed + binding.domainFailsafes
}

// ─── Input W-ATOM (schema.input per MA-S1) ───────────────────────────────────

/**
 * W-ATOM consumed by Plan's emission entry point.
 * Every field traces to declared source in §6.5 custody table.
 */
export type PlanInput = {
  authoringProgram: AuthoringProgramRef     // caller R0
  userId:           UserId                  // F-identity session
  turnId:           string                  // caller turn context
  domainBinding:    DomainBinding           // domain standard (by-value instance)
  preplanInputs:    unknown                 // authoring-program; typed per domain
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ───────────────────

/**
 * Plan-local handoff rule instance. Consumed by framework-audit X3 C5 captureShape check.
 * Shape conforms to substrate §8.2 HandoffRulePrimitive amended.
 */
export type PlanHandoffRuleInstance = {
  id:                     string             // e.g., 'HR-Pl1'
  direction:              {
    from: { id: string; version: Semver }    // FrameworkRef shape
    to:   { id: string; version: Semver }
  }
  carrierApplicability:   ('self' | 'named' | 'none')[]
  invariant:              string              // declared invariant text
  captureShape?: {
    capturedFields: string[]
    captureTarget:  'registry' | 'audit-trail' | 'custom'
    queryInterface?: string
  }
  diagnosticSignificance: boolean
}

// ─── Gate / dimension / custody result shapes (framework-audit consumption) ──

/**
 * GateResult consumed by framework-audit SelfAuditRecord shape.
 * Shape mirrors framework-audit-v1-2 §8.1 GateResult.
 */
export type PlanGateResult = {
  gateId:    string                                   // e.g., 'G-Pl1', 'PG1', 'G-U5'
  result:    'passed' | 'failed' | 'pending'
  timestamp: string                                    // ISO 8601
  evidence?: string                                    // optional, populated for failed gates
}

/**
 * DimensionResult consumed by framework-audit when evaluating Plan.
 * Shape mirrors framework-audit-v1-2 §8.1 DimensionResult.
 */
export type PlanDimensionResult = {
  dimensionId: string           // 'X1'–'X10'
  result:      'pass' | 'fail' | 'n/a'
  basis?:      string           // required for 'n/a'
  details:     string
}

/**
 * Framework-local custody row. Consumed by framework-audit custody-check.
 * Shape mirrors substrate §4 A-04 CustodyRow.
 */
export type PlanCustodyRow = {
  atomId:           string
  ownerFrameworkId: string
  layer:            string
  consumers:        string[]
}

// ─── Operation result (emission surface) ─────────────────────────────────────

/**
 * PlanArtifact composition error payload. Uses canonical Result<T>/AppError from primitives.ts.
 * Emitted by the authoring program when validity fails pre-AS-emission.
 */
export type PlanValidityError = AppError & {
  code:
    | 'PLAN_INPUT_INVALID'            // schema violation on PlanInput
    | 'PLAN_VALIDITY_FAILED'          // PA1..PA12 failure at emission-time validation
    | 'PLAN_EMISSION_REJECTED'        // AS rejected carrier emission
  failedAxiom?: string                // e.g., 'PA2a', 'PA7', 'PA12' — populated for PLAN_VALIDITY_FAILED
}

/**
 * Terminal Result type for plan composition + emission (authoring program invokes).
 * On success, the AS emission W-ATOM is returned (plan anchor node id lives at
 * ArtifactEmission.writes.a7.artifactAnchorNodeId, which becomes the planAnchorNodeId
 * consumed by Multi-Instance Standard).
 */
export type PlanEmissionResult = Result<ArtifactEmission, PlanValidityError>

// ─── AS v2.2 cross-framework re-exports (declarative, for type-resolution clarity) ──
// Declared by AS, consumed by Plan at §7 Cross-framework handoff.
// Not re-owned; custody remains with artifact-standard (see §6.5 custody table).

export type { ArtifactPayload, ArtifactEmission, CreateArtifactInput }

// ─── End of plan-standard.types.ts ──────────────────────────────────────────
