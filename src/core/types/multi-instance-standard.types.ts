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
//   W-ATOM Result            ← core/R5 primitives
//   W-ATOM DeclId            ← core/R5 plan-standard.types
//   W-ATOM OpaqueDescriptor  ← core/R5 plan-standard.types
// wires-out:
//   W-ATOM RunReportContent        → Phase 4+ engine, RunReport consumers
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
// MULTI-INSTANCE STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Matches Multi-Instance Standard v1.0 §8 payload schema.
// Immutability: RunReport is emitted once on run completion and is not mutated
// post-emission (Artifact Standard ArA5 + M-I §10 carrier validity).
// Shape members are `readonly` throughout.
//
// TypedAtom (§8 instanceResults[].output, aggregation.finalOutput):
// Carries actual typed output content, not a schema identifier. Declared as
// `Record<string, unknown> & _brand` for deferred tightening — distinct role
// from Plan's descriptor-based TypedAtomSchema. A3 audit: one forced
// Record<string, unknown> here; justified because output payload must be
// property-readable for observability/validation/aggregation.
//
// Co-occurrence constraints (§8):
// - InstanceResult.output? present iff status === 'complete'
// - Aggregation.finalOutput? absent iff outcome === 'failed'
// - Aggregation.partialSuccess? present iff topology + policy allow
// All represented as spec-literal optional per brief; runtime enforces.
//
// Framework registry (DescriptorResolver, FrameworkRegistry):
// Shape declared here per IA6 (binding-driven execution). Descriptors in
// content.binding resolve through this registry at engine runtime. Registry
// implementation lands at F-la-config; shape is canonical at this layer.

import type { Semver, NodeId, Result } from './primitives'
import type { DeclId, OpaqueDescriptor } from './plan-standard.types'
import type {
  MI_ERROR_CLASSES,
  MI_INSTANCE_TERMINAL_STATES,
  MI_SET_TERMINAL_STATES,
  MI_FAILSAFE_KEYS,
} from '../constants/multi-instance-standard'

// ─── Milliseconds alias ───────────────────────────────────────────────────────
// Per §8 epochMs, durationMs.

export type EpochMs = number

// ─── Union types derived from R5 constants ────────────────────────────────────
// Single source of truth: constants file. Drift-proof unions.

export type ErrorClass            = typeof MI_ERROR_CLASSES[number]
export type InstanceTerminalState = typeof MI_INSTANCE_TERMINAL_STATES[number]
export type SetTerminalState      = typeof MI_SET_TERMINAL_STATES[number]

// FailsafeKey: default set from constants, widened to admit domain-declared
// failsafes per Plan Standard §4.4 (content.limit.perSet.domainFailsafes).
// The `string & {}` idiom preserves IDE completion for the default labels
// while accepting domain-declared strings at assignment sites.
export type FailsafeKey = typeof MI_FAILSAFE_KEYS[number] | (string & {})

// Per §8 errors[].resolution enum.
export type ErrorResolution = 'retried' | 'escalated' | 'terminal'

// Aggregation topology: mirrors Plan Standard's PlanTopology set. Declared
// locally as a literal union per §8 literal rather than imported, because
// the aggregation topology identifier is the RunReport's own categorization —
// it happens to match Plan's topology labels but is semantically separate
// (one is authoring intent, the other is execution categorization).
export type AggregationTopology = 'sequence' | 'tier' | 'loop' | 'singleton'

// ─── TypedAtom (deferred tightening) ──────────────────────────────────────────
// Payload carrier for instance outputs per §8. Distinct from Plan's
// TypedAtomSchema (which is a descriptor identifier via Mechanism C).
// TypedAtom carries actual output data and must remain property-readable for
// observability, validation against output contract, and aggregation.
// TODO: Tighten once domain atom-type conventions stabilize. Deferred per
//       brief A3 note; one forced Record<string, unknown> usage.

export type TypedAtom = Record<string, unknown> & {
  readonly _brand: 'TypedAtom'
}

// ─── InstanceResult sub-shapes (§8) ───────────────────────────────────────────

export interface InstanceError {
  readonly class:      ErrorClass
  readonly reason:     string                       // e.g., 'capacity-breach' per IA7
  readonly message:    string
  readonly resolution: ErrorResolution
}

export interface InstanceResult {
  readonly declId:     DeclId                       // pins to content.shape.declarations[].id
  readonly status:     InstanceTerminalState
  readonly output?:    TypedAtom                    // typed per declaration's outputContract; absent on failure
  readonly tokenCount: number
  readonly durationMs: number
  readonly retries:    number
  readonly errors:     readonly InstanceError[]
}

// ─── SetViolation (§8) ────────────────────────────────────────────────────────

export interface SetViolation {
  readonly failsafe:   FailsafeKey
  readonly breachedAt: EpochMs
  readonly reason:     string
}

// ─── Aggregation (§8) ─────────────────────────────────────────────────────────

export interface PartialSuccessResult {
  readonly required:  number
  readonly achieved:  number
  readonly satisfied: boolean
}

export interface Aggregation {
  readonly topology:        AggregationTopology
  readonly finalOutput?:    TypedAtom               // per §4.1 aggregation rule; absent if outcome = failed
  readonly partialSuccess?: PartialSuccessResult
}

// ─── RunReportContent (§8 top-level) ──────────────────────────────────────────
// This is the `payload.content` shape carried by an Artifact Standard emission
// (per Artifact Standard §8). planAnchorNodeId carries the graph-layer join;
// planId carries the content-layer pin; Artifact Standard's dependency edge
// carries the carrier-layer traversal. Three-way redundancy is by design
// per §8.1 — each identifier serves a distinct join concern.

export interface RunReportContent {
  readonly planId:               string             // PlanArtifact identity, immutable pin
  readonly planAnchorNodeId:     NodeId             // pins to the PlanArtifact anchor node in graph
  readonly planVersion:          Semver
  readonly bindingDomainId:      string             // replay/audit without full PlanArtifact read
  readonly bindingDomainVersion: Semver

  readonly runId:       string
  readonly startedAt:   EpochMs
  readonly completedAt: EpochMs

  readonly outcome: SetTerminalState

  readonly instanceResults: readonly InstanceResult[]

  readonly setViolations: readonly SetViolation[]

  readonly aggregation: Aggregation
}

// ═══════════════════════════════════════════════════════════════
// FRAMEWORK REGISTRY (IA6 — binding-driven execution)
// ═══════════════════════════════════════════════════════════════
// Shape declaration for the descriptor resolution mechanism introduced by
// Plan Standard §6.1 Mechanism C. Descriptors in content.binding carry only
// { domainId, schemaRef } identity; concrete behavior resolves through this
// registry at engine runtime.
//
// Each resolver kind is typed with its resolver signature — never a shared
// Map<string, Function>, which would violate A3 (typed boundaries).
//
// Implementation lands at F-la-config when LIV-Standard's DomainBinding
// instance is authored. Registry must be populated before any domain
// resolves descriptors at engine runtime.

// ─── DescriptorResolver<I, O> ─────────────────────────────────────────────────
// One resolver instance = one (domainId, schemaRef) descriptor kind.
// The resolve function takes typed input I and returns Result<O> (default
// AppError per primitives.ts convention).

export interface DescriptorResolver<I, O> {
  readonly domainId:  string
  readonly schemaRef: string
  readonly resolve:   (input: I) => Result<O>
}

// ─── FrameworkRegistry ────────────────────────────────────────────────────────
// Register-by-kind / resolve-by-descriptor interface. Consumer (F-la-config
// binding builder) registers resolvers; engine resolves descriptors at
// invocation time. Both operations return Result envelopes per primitives.ts
// AK-RES convention.

export interface FrameworkRegistry {
  readonly register: <I, O>(resolver: DescriptorResolver<I, O>) => Result<void>
  readonly resolve:  <I, O>(descriptor: OpaqueDescriptor) => Result<DescriptorResolver<I, O>>
}
