// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM Semver ← core/R5 primitives
//   W-ATOM UserId ← core/R5 primitives
// wires-out:
//   W-ATOM PlanInput                 → any Plan authoring program (Builder, Research, etc.)
//   W-ATOM PlanArtifactContent       → Multi-Instance Standard, Phase 4+ plan consumers
//   W-ATOM DomainBinding             → Plan authors, Multi-Instance executors
//   W-ATOM PlanShape                 → any plan consumer
//   W-ATOM PlanDeclaration           → any plan consumer
//   W-ATOM PlanIntentEntry           → any plan consumer
//   W-ATOM PlanCapacityEntry         → any plan consumer
//   W-ATOM PlanLimit                 → any plan consumer
//   W-ATOM PlanLimitPerDecl          → any plan consumer
//   W-ATOM PlanLimitPerSet           → any plan consumer
//   W-ATOM PlanLimitPartialSuccess   → any plan consumer
//   W-ATOM RoleClassDescriptor       → domain binding authors
//   W-ATOM OpaqueDescriptor          → Multi-Instance Standard (FrameworkRegistry), domain binding authors
//   W-ATOM TypedAtomSchema           → all consumers, framework registry
//   W-ATOM CapacityBudget            → domain binding authors, framework registry
//   W-ATOM SplitAxisDescriptor       → domain binding authors, framework registry
//   W-ATOM FailsafeRule              → domain binding authors, framework registry
//   W-ATOM RenderContractDescriptor  → Multi-Instance consumers, framework registry
//   W-ATOM ValidateContractDescriptor → Multi-Instance consumers, framework registry
//   W-ATOM DeclId                    → all consumers (AK-REF branded)
//   W-ATOM TypedAtomRef              → all consumers (AK-REF branded)
//   W-ATOM RoleClassId               → all consumers (AK-REF branded)
//   W-ATOM PlanTopology              → all consumers
//   W-ATOM TierClass                 → all consumers
//   W-ATOM Ms                        → all consumers
// deps:
//   R5 ./primitives
//   R5 ../constants/plan-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLAN STANDARD v2.1 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Matches Plan Standard v2.1 §8 input schema (PlanInput) and §9 output schema
// (PlanArtifactContent, DomainBinding).
// Regenerated against metaframework v2.4 (MA-G5c custody, MA-G5d provenance).
// PA5 (plan immutability), PA9 (binding immutability) — shape members are
// `readonly` where the standard implies post-emission immutability.
// PA10b split lineage: splitLineage.parentDeclId is a provenance reference;
// its target is NOT an element of shape.declarations. Type layer cannot
// express this negative constraint — enforced at emission time (§10 validity).
//
// Descriptor mechanism (§9 DomainBinding):
// All descriptors carry only { domainId, schemaRef } identity — uniform shape.
// Concrete behavior (and concrete values, including capacity budgets) lives in
// the domain's L3 framework registration, not in the binding struct.
// Each descriptor kind is a branded intersection over OpaqueDescriptor —
// uniform shape (A3 serializability) + nominal separation (A1 ownership).

import type { Semver, UserId } from './primitives'
import type {
  PLAN_TOPOLOGIES,
  PLAN_TIER_CLASSES,
} from '../constants/plan-standard'

// ─── Primitives (AK-REF branded, declared locally per Plan ownership) ─────────
// Plan-specific branded strings — not core primitives, no cross-standard reuse.

export type DeclId       = string & { readonly _brand: 'DeclId' }
export type TypedAtomRef = string & { readonly _brand: 'TypedAtomRef' }
export type RoleClassId  = string & { readonly _brand: 'RoleClassId' }

// ─── Milliseconds alias ───────────────────────────────────────────────────────
// Per §9 epochMs, maxTime.

export type Ms = number

// ─── Union types derived from R5 constants ────────────────────────────────────
// Single source of truth: constants file. Drift-proof unions.

export type PlanTopology = typeof PLAN_TOPOLOGIES[number]

// TierClass: default set from constants, widened to admit domain-declared
// tiers per §9 binding.tierLimits. The `string & {}` idiom preserves IDE
// completion for the default labels while accepting any string at assignment.
export type TierClass = typeof PLAN_TIER_CLASSES[number] | (string & {})

// ─── OpaqueDescriptor (canonical descriptor shape) ────────────────────────────
// Uniform serializable shape for all descriptor kinds. Concrete behavior and
// concrete values live in the domain's L3 framework registration; this struct
// carries identity only. See Plan Standard v2.1 §9 DomainBinding and
// Multi-Instance Standard §7.1 FrameworkRegistry.

export interface OpaqueDescriptor {
  readonly domainId:  string
  readonly schemaRef: string
}

// ─── Descriptor kinds (branded intersections, uniform shape) ──────────────────
// Each kind: OpaqueDescriptor shape + nominal brand. Brands prevent a
// descriptor of kind X being assigned where kind Y is expected (A1).
// Uniform shape (identical fields across all six) preserves serializability
// and registry-routing (A3). Values — including budgets — resolve via the
// domain's framework registration, not via fields on the descriptor itself.

export type TypedAtomSchema            = OpaqueDescriptor & { readonly _brand: 'TypedAtomSchema' }
export type CapacityBudget             = OpaqueDescriptor & { readonly _brand: 'CapacityBudget' }
export type SplitAxisDescriptor        = OpaqueDescriptor & { readonly _brand: 'SplitAxisDescriptor' }
export type FailsafeRule               = OpaqueDescriptor & { readonly _brand: 'FailsafeRule' }
export type RenderContractDescriptor   = OpaqueDescriptor & { readonly _brand: 'RenderContractDescriptor' }
export type ValidateContractDescriptor = OpaqueDescriptor & { readonly _brand: 'ValidateContractDescriptor' }

// ─── DomainBinding sub-shapes (§9) ────────────────────────────────────────────

export interface RoleClassDescriptor {
  readonly inputType:  TypedAtomSchema
  readonly outputType: TypedAtomSchema
  readonly tierHint:   TierClass
}

// ─── DomainBinding (§9) ───────────────────────────────────────────────────────
// Descriptor-typed slots carry identity only; resolution is Multi-Instance's
// concern via framework registry.
// PA9: frozen at emission, captured inside PlanArtifactContent.

export interface DomainBinding {
  readonly domainId:         string
  readonly domainVersion:    Semver
  readonly roleClasses:      { readonly [id: string]: RoleClassDescriptor }
  readonly tierLimits:       { readonly [tier: string]: CapacityBudget }
  readonly splitAxis:        SplitAxisDescriptor
  readonly domainFailsafes:  { readonly [key: string]: FailsafeRule }
  readonly renderContract:   RenderContractDescriptor
  readonly validateContract: ValidateContractDescriptor
}

// ─── PlanArtifactContent sub-shapes (§9) ──────────────────────────────────────

export interface PlanDeclaration {
  readonly id:        DeclId
  readonly dependsOn: readonly DeclId[]             // PA2a closure, PA2b acyclic
  readonly dataFlow:  readonly {
    readonly from: DeclId                           // PA11 closure
    readonly wire: TypedAtomRef                     // PA12 typing
  }[]
}

export interface PlanShape {
  readonly topology:     PlanTopology
  readonly declarations: readonly PlanDeclaration[] // length >= 1
}

export interface PlanIntentEntry {
  readonly role:           RoleClassId              // resolved against binding (PA3, PA8)
  readonly inputContract:  TypedAtomRef
  readonly outputContract: TypedAtomRef
  readonly tierHint:       TierClass
}

export interface PlanCapacityEntry {
  readonly estimatedCost: number
  readonly splitLineage?: {                         // PA10b provenance only
    readonly parentDeclId: DeclId                   // NOT in shape.declarations (PA10a)
    readonly splitAxis:    string
  }
}

export interface PlanLimitPerDecl {
  readonly retryBudget: number                      // PA4a
}

export interface PlanLimitPartialSuccess {
  readonly allowed:       boolean
  readonly minSuccesses?: number
}

// PA4b: maxTime, maxTransitions, maxReentries required per-set.
// domainFailsafes: per v2.1 §9, typed as FailsafeRule descriptors
// (passthrough from DomainBinding.domainFailsafes). v1.0 typed values as
// number — corrected per E2 orthogonality (domain ownership).

export interface PlanLimitPerSet {
  readonly maxTime:          Ms
  readonly maxTransitions:   number
  readonly maxReentries:     number
  readonly partialSuccess:   PlanLimitPartialSuccess
  readonly domainFailsafes?: { readonly [key: string]: FailsafeRule }
}

export interface PlanLimit {
  readonly perDecl: { readonly [declId: string]: PlanLimitPerDecl }
  readonly perSet:  PlanLimitPerSet
}

// ─── PlanInput (§8 input W-ATOM) ──────────────────────────────────────────────
// W-ATOM consumed by Plan's emission entry point at R3.

export interface PlanInput {
  readonly authoringProgram: {
    readonly programId:      string                 // provenance: caller R0
    readonly programVersion: Semver                 // provenance: caller R0
  }
  readonly userId:           UserId                 // provenance: F-identity session
  readonly turnId:           string                 // provenance: caller turn context
  readonly domainBinding:    DomainBinding          // provenance: domain standard (by-value)
  readonly preplanInputs:    unknown                // provenance: authoring program; typed per domain
}

// ─── PlanArtifactContent (§9 top-level output W-ATOM) ─────────────────────────
// This is the `payload.content` shape carried by an Artifact Standard emission
// (per Artifact Standard v2.1 §8). planId pins to the artifact anchor node's
// identity (§9.1 Carrier envelope).

export interface PlanArtifactContent {
  readonly planId:      string                      // provenance: runtime-generated at emission
  readonly planVersion: Semver                      // provenance: authoring program (PA5)
  readonly producedBy:  {                           // provenance: input.authoringProgram (verbatim)
    readonly programId:      string
    readonly programVersion: Semver
  }
  readonly producedAt: Ms                           // provenance: runtime-captured at emission

  readonly binding: DomainBinding                   // provenance: input.domainBinding (verbatim, frozen per PA9)

  readonly shape: PlanShape                         // provenance: authoring-program-computed

  readonly intent: {                                // PA3, PA8 resolve against binding
    readonly [declId: string]: PlanIntentEntry
  }

  readonly capacity: {                              // PA7; PA10b for split lineage
    readonly [declId: string]: PlanCapacityEntry
  }

  readonly limit: PlanLimit                         // PA4a perDecl, PA4b perSet
}
