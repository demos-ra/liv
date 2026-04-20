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
// PLAN STANDARD v1.0 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Canonical constants for Plan Standard v1.0.
// Governs the content (payload) of PlanArtifacts carried by Artifact Standard v1.0.
// See: src/core/standards/plan-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. No R5 cross-imports.

// ─── Axioms (PA1–PA10) ────────────────────────────────────────────────────────
// Canonical axiom IDs per Plan Standard §7.

export const PLAN_AXIOMS = {
  DECLARATION_ATOMICITY:     'PA1',
  SHAPE_CLOSURE_ACYCLIC:     'PA2',
  CONTRACT_TYPING:           'PA3',
  LIMIT_TOTALITY:            'PA4',
  PLAN_IMMUTABILITY:         'PA5',
  DECLARATION_DELETABILITY:  'PA6',
  CAPACITY_SUFFICIENCY:      'PA7',
  DOMAIN_BINDING_CLOSURE:    'PA8',
  BINDING_IMMUTABILITY:      'PA9',
  SPLIT_REPLACEMENT:         'PA10',
} as const

// ─── Plan topologies ──────────────────────────────────────────────────────────
// Per Plan Standard §4.1 Shape. Closed set — adding a topology is a v-bump.

export const PLAN_TOPOLOGIES = [
  'sequence',
  'tier',
  'loop',
  'singleton',
] as const

// ─── Tier classes ─────────────────────────────────────────────────────────────
// Default tier class set per Plan Standard §4.2 Intent. Domain standards may
// widen by declaring their own tier labels in DomainBinding.tierLimits; the type
// layer accepts the wider set by allowing domain-declared TierClass labels.

export const PLAN_TIER_CLASSES = [
  'smallest',
  'medium',
  'largest',
] as const

// ─── Artifact domain identifier ───────────────────────────────────────────────
// Used as ArtifactEmission.payload.domain when a Plan is emitted per
// Artifact Standard §8. Source of truth for the domain label.

export const PLAN_ARTIFACT_DOMAIN = 'plan' as const
