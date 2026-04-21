// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM Semver            ← core/R5 primitives
//   W-ATOM NodeId            ← core/R5 primitives
//   W-ATOM UserId            ← core/R5 primitives
//   W-ATOM Result            ← core/R5 primitives
//   W-ATOM DeclId            ← core/R5 plan-standard.types
//   W-ATOM OpaqueDescriptor  ← core/R5 plan-standard.types
// wires-out:
//   W-ATOM MIInput                 → all M-I callers (Builder, Verify, etc.)
//   W-ATOM RunReportContent        → Phase 4b engine, RunReport consumers
//   W-ATOM InstanceResult          → RunReport consumers
//   W-ATOM InstanceError           → RunReport consumers
//   W-ATOM SetViolation            → RunReport consumers
//   W-ATOM Aggregation             → RunReport consumers
//   W-ATOM PartialSuccessResult    → RunReport consumers
//   W-ATOM TypedAtom               → RunReport consumers (deferred tightening)
//   W-ATOM ErrorClass              → RunReport consumers
//   W-ATOM InstanceTerminalState   → RunReport consumers
//   W-ATOM SetTerminalState        → RunReport consumers
//   W-ATOM FailsafeKey             → RunReport consumers
//   W-ATOM ErrorResolution         → RunReport consumers
//   W-ATOM AggregationTopology     → RunReport consumers
//   W-ATOM DescriptorResolver      → F-la-config (registry implementation)
//   W-ATOM FrameworkRegistry       → F-la-config (registry implementation)
// deps:
//   R5 ./primitives
//   R5 ./plan-standard.types
//   R5 ../constants/multi-instance-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// MULTI-INSTANCE STANDARD v2.2 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Matches Multi-Instance Standard v2.2 §8 input schema (MIInput) and §9
// output schema (RunReportContent).
// Regenerated against metaframework v2.4 (MA-G5c custody, MA-G5d provenance).
// v2.2: AI adapter is an LIV-Standard R4 runtime dependency, injected when
// F-M-I slice is wired (Phase 4b); not a spec concern. MIInput carries
// signal W-ATOMs only.
//
// Immutability: RunReport is emitted once on run completion and is not mutated
// post-emission (Artifact Standard ArA5 + M-I §10 carrier validity).
// Shape members are `readonly` throughout.
//
// TypedAtom (§9 instanceResults[].output, aggregation.finalOutput):
// Carries actual typed output content, not a schema identifier. Declared as
// `Record<string, unknown> & _brand` for deferred tightening — distinct role
// from Plan's descriptor-based TypedAtomSchema. A3 audit: one forced
// Record<string, unknown> here; justified because output payload must be
// property-readable for observability/validation/aggregation.
//
// Co-occurrence constraints (§9):
// - InstanceResult.output? present iff status === 'complete'
// - Aggregation.finalOutput? absent iff outcome === 'failed'
// - Aggregation.partialSuccess? present iff topology + policy allow
// All represented as spec-literal optional; runtime enforces.
//
// Framework registry (DescriptorResolver, FrameworkRegistry):
// Shape declared here per IA6 (binding-driven execution). Descriptors in
// content.binding resolve through this registry at engine runtime. Registry
// implementation lands at F-la-config; shape is canonical at this layer.

import type { Semver, NodeId, UserId, Result } from './primitives'
import type { DeclId, OpaqueDescriptor } from './plan-standard.types'
import type {
  MI_ERROR_CLASSES,
  MI_INSTANCE_TERMINAL_STATES,
  MI_SET_TERMINAL_STATES,
  MI_FAILSAFE_KEYS,
} from '../constants/multi-instance-standard'

// ─── Milliseconds alias ───────────────────────────────────────────────────────
// Per §9 epochMs, durationMs.

export type EpochMs = number

// ─── Union types derived from R5 constants ────────────────────────────────────
// Single source of truth: constants file. Drift-proof unions.

export type ErrorClass            = typeof MI_ERROR_CLASSES[number]
export type InstanceTerminalState = typeof MI_INSTANCE_TERMINAL_STATES[number]
export type SetTerminalState      = typeof MI_SET_TERMINAL_STATES[number]

// FailsafeKey: default set from constants, widened to admit domain-declared
// failsafes per Plan Standard §4.4 (content.limit.perSet.domainFailsafes).
export type FailsafeKey = typeof MI_FAILSAFE_KEYS[number] | (string & {})

// Per §9 errors[].resolution enum.
export type ErrorResolution = 'retried' | 'escalated' | 'terminal'

// Aggregation topology: mirrors Plan Standard's PlanTopology set. Declared
// locally as a literal union per §9 literal rather than imported, because
// the aggregation topology identifier is the RunReport's own categorization.
export type AggregationTopology = 'sequence' | 'tier' | 'loop' | 'singleton'

// ─── TypedAtom (deferred tightening) ──────────────────────────────────────────
// Payload carrier for instance outputs per §9. Distinct from Plan's
// TypedAtomSchema (which is a descriptor identifier via OpaqueDescriptor).
// TypedAtom carries actual output data and must remain property-readable for
// observability, validation against output contract, and aggregation.
// TODO: Tighten once domain atom-type conventions stabilize.

export type TypedAtom = Record<string, unknown> & {
  readonly _brand: 'TypedAtom'
}

// ─── InstanceResult sub-shapes (§9) ───────────────────────────────────────────

export interface InstanceError {
  readonly class:      ErrorClass
  readonly reason:     string                       // e.g., 'capacity-breach' per IA7a
  readonly message:    string
  readonly resolution: ErrorResolution
}

export interface InstanceResult {
  readonly declId:     DeclId                       // provenance: PlanArtifactContent.shape.declarations[].id (verbatim)
  readonly status:     InstanceTerminalState        // provenance: runtime-derived per IA1
  readonly output?:    TypedAtom                    // provenance: AI adapter output, validated per IA3
  readonly tokenCount: number                       // provenance: AI adapter response metadata
  readonly durationMs: number                       // provenance: runtime-measured
  readonly retries:    number                       // provenance: runtime-accumulated per IA7b
  readonly errors:     readonly InstanceError[]     // provenance: runtime-captured per failure
}

// ─── SetViolation (§9) ────────────────────────────────────────────────────────

export interface SetViolation {
  readonly failsafe:   FailsafeKey
  readonly breachedAt: EpochMs
  readonly reason:     string
}

// ─── Aggregation (§9) ─────────────────────────────────────────────────────────

export interface PartialSuccessResult {
  readonly required:  number
  readonly achieved:  number
  readonly satisfied: boolean
}

export interface Aggregation {
  readonly topology:        AggregationTopology     // provenance: PlanArtifactContent.shape.topology (verbatim)
  readonly finalOutput?:    TypedAtom               // per §4.1.a aggregation rule; absent if outcome = failed
  readonly partialSuccess?: PartialSuccessResult
}

// ─── MIInput (§8 input W-ATOM) ────────────────────────────────────────────────
// W-ATOM consumed by M-I's dispatch entry point at R3.
// v2.2: AI adapter is a runtime R4 dependency (LIV-Standard wiring), not a
// spec input field. The engine slice injects the adapter at invocation time;
// MIInput carries signal atoms only.

export interface MIInput {
  readonly planAnchorNodeId: NodeId                 // provenance: caller (content framework)
  readonly userId:           UserId                 // provenance: F-identity session
}

// ─── RunReportContent (§9 top-level output W-ATOM) ────────────────────────────
// This is the `payload.content` shape carried by an Artifact Standard emission
// (per Artifact Standard v2.1 §8). planAnchorNodeId carries the graph-layer
// join; planId carries the content-layer pin; Artifact Standard's dependency
// edge carries the carrier-layer traversal. Three-way redundancy is by design
// per §9.1 — each identifier serves a distinct join concern.

export interface RunReportContent {
  readonly planId:               string             // provenance: PlanArtifactContent.planId (verbatim)
  readonly planAnchorNodeId:     NodeId             // provenance: input.planAnchorNodeId (verbatim)
  readonly planVersion:          Semver             // provenance: PlanArtifactContent.planVersion (verbatim)
  readonly bindingDomainId:      string             // provenance: binding.domainId (verbatim)
  readonly bindingDomainVersion: Semver             // provenance: binding.domainVersion (verbatim)

  readonly runId:       string                      // provenance: runtime-generated (UUID v4)
  readonly startedAt:   EpochMs                     // provenance: runtime-captured at dispatch start
  readonly completedAt: EpochMs                     // provenance: runtime-captured at set terminal

  readonly outcome: SetTerminalState                // provenance: runtime-derived per §4.1.a

  readonly instanceResults: readonly InstanceResult[]  // provenance: runtime-accumulated

  readonly setViolations: readonly SetViolation[]   // provenance: runtime-captured on IA4a/IA4b

  readonly aggregation: Aggregation                 // provenance: runtime-computed per topology
}

// ═══════════════════════════════════════════════════════════════
// FRAMEWORK REGISTRY (IA6 — binding-driven execution)
// ═══════════════════════════════════════════════════════════════
// Shape declaration for the descriptor resolution mechanism used by the
// engine. Descriptors in content.binding carry only { domainId, schemaRef }
// identity; concrete behavior resolves through this registry at engine
// runtime.
//
// Each resolver kind is typed with its resolver signature — never a shared
// Map<string, Function>, which would violate A3 (typed boundaries).
//
// Implementation lands at F-la-config when LIV-Standard's DomainBinding
// instance is authored. Registry must be populated before any domain
// resolves descriptors at engine runtime.

// ─── DescriptorResolver<I, O> ─────────────────────────────────────────────────
// One resolver instance = one (domainId, schemaRef) descriptor kind.
// The resolve function takes typed input I and returns Result<O>.

export interface DescriptorResolver<I, O> {
  readonly domainId:  string
  readonly schemaRef: string
  readonly resolve:   (input: I) => Result<O>
}

// ─── FrameworkRegistry ────────────────────────────────────────────────────────
// Register-by-kind / resolve-by-descriptor interface. Consumer (F-la-config
// binding builder) registers resolvers; engine resolves descriptors at
// invocation time. Both operations return Result envelopes.

export interface FrameworkRegistry {
  readonly register: <I, O>(resolver: DescriptorResolver<I, O>) => Result<void>
  readonly resolve:  <I, O>(descriptor: OpaqueDescriptor) => Result<DescriptorResolver<I, O>>
}
