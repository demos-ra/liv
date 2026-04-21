// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM PLAN_AXIOMS          → any slice emitting plans
//   W-ATOM PLAN_TOPOLOGIES      → any slice consuming plans
//   W-ATOM PLAN_TIER_CLASSES    → Plan authors, M-I executors
//   W-ATOM PLAN_ARTIFACT_DOMAIN → Artifact Standard emission callers
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLAN STANDARD v2.1 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Canonical constants for Plan Standard v2.1.
// Governs the content (payload) of PlanArtifacts carried by Artifact Standard v2.1.
// Regenerated against metaframework v2.4 (MA-G5c custody, MA-G5d provenance).
// See: src/core/standards/plan-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. No R5 cross-imports.

// ─── Axioms (PA1–PA12) ────────────────────────────────────────────────────────
// Canonical axiom IDs per Plan Standard v2.1 §6.
// v2.1 decomposition (E6 axiom atomicity):
//   PA2 → PA2a (reference closure) + PA2b (acyclicity)
//   PA4 → PA4a (per-decl retry) + PA4b (per-set failsafes)
//   PA10 → PA10a (parent-replacement on split) + PA10b (splitLineage provenance)
// v2.1 additions: PA11 (data-flow closure), PA12 (data-flow typing) —
// separated from v1.0 PA3 per E6 atomicity.

export const PLAN_AXIOMS = {
  DECLARATION_ATOMICITY:       'PA1',
  DEPENDS_ON_CLOSURE:          'PA2a',
  DEPENDS_ON_ACYCLIC:          'PA2b',
  CONTRACT_TYPING:             'PA3',
  LIMIT_PER_DECL:              'PA4a',
  LIMIT_PER_SET:               'PA4b',
  PLAN_IMMUTABILITY:           'PA5',
  DECLARATION_DELETABILITY:    'PA6',
  CAPACITY_SUFFICIENCY:        'PA7',
  DOMAIN_BINDING_CLOSURE:      'PA8',
  BINDING_IMMUTABILITY:        'PA9',
  SPLIT_REPLACEMENT:           'PA10a',
  SPLIT_LINEAGE_PROVENANCE:    'PA10b',
  DATA_FLOW_CLOSURE:           'PA11',
  DATA_FLOW_TYPING:            'PA12',
} as const

// ─── Plan topologies ──────────────────────────────────────────────────────────
// Per Plan Standard v2.1 §4.1 Shape. Closed set — adding a topology is a v-bump.

export const PLAN_TOPOLOGIES = [
  'sequence',
  'tier',
  'loop',
  'singleton',
] as const

// ─── Tier classes ─────────────────────────────────────────────────────────────
// Default tier class set per Plan Standard v2.1 §4.2 Intent. Domain standards
// may widen by declaring their own tier labels in DomainBinding.tierLimits;
// the type layer accepts the wider set by allowing domain-declared TierClass
// labels via the `string & {}` idiom.

export const PLAN_TIER_CLASSES = [
  'smallest',
  'medium',
  'largest',
] as const

// ─── Artifact domain identifier ───────────────────────────────────────────────
// Used as ArtifactEmission.payload.domain when a Plan is emitted per
// Artifact Standard v2.1 §8. Source of truth for the domain label.

export const PLAN_ARTIFACT_DOMAIN = 'plan' as const
