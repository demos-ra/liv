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
//   W-ATOM MI_AXIOMS                  → multi-instance engine slice (future)
//   W-ATOM MI_ERROR_CLASSES           → consumers handling RunReport errors
//   W-ATOM MI_INSTANCE_TERMINAL_STATES → consumers reading instanceResults
//   W-ATOM MI_SET_TERMINAL_STATES     → consumers reading outcome
//   W-ATOM MI_FAILSAFE_KEYS           → consumers reading setViolations
//   W-ATOM MI_ARTIFACT_DOMAIN         → Artifact Standard emission callers
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// MULTI-INSTANCE STANDARD v1.0 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Canonical constants for Multi-Instance Standard v1.0.
// Governs the content (payload) of RunReports carried by Artifact Standard v1.0.
// See: src/core/standards/multi-instance-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. No R5 cross-imports.

// ─── Axioms (IA1–IA7) ─────────────────────────────────────────────────────────
// Canonical axiom IDs per Multi-Instance Standard §7.

export const MI_AXIOMS = {
  CONSERVATION_OF_PROGRESS:   'IA1',
  DECLARATION_FIDELITY:       'IA2',
  HANDOFF_INTEGRITY:          'IA3',
  BOUNDS_SUPREMACY:           'IA4',
  TOPOLOGY_ISOLATION:         'IA5',
  BINDING_DRIVEN_EXECUTION:   'IA6',
  RUNTIME_CAPACITY_BREACH:    'IA7',
} as const

// ─── Error classes ────────────────────────────────────────────────────────────
// Per Multi-Instance Standard §4.3 Bounds. CLASS_2 = output-quality /
// validation / capacity-breach per IA7; CLASS_3 = infrastructure.

export const MI_ERROR_CLASSES = [2, 3] as const

// ─── Instance terminal states ─────────────────────────────────────────────────
// Per §4.3. Every dispatched instance reaches one of these (IA1).

export const MI_INSTANCE_TERMINAL_STATES = [
  'complete',
  'failed',
  'escalated',
] as const

// ─── Set terminal states ──────────────────────────────────────────────────────
// Per §4.3. 'partial' is reachable only if partialSuccess policy permits AND
// achieved >= minSuccesses. Absent policy allowance, failures propagate to
// 'failed' per topology aggregation rule (§4.1).

export const MI_SET_TERMINAL_STATES = [
  'complete',
  'failed',
  'escalated',
  'partial',
] as const

// ─── Failsafe keys ────────────────────────────────────────────────────────────
// Per-set failsafe identifiers per §4.3 + §8 setViolations. Domain standards
// may widen this set via content.limit.perSet.domainFailsafes (Plan §4.4);
// the type layer admits domain-declared failsafe keys as a string fallback.

export const MI_FAILSAFE_KEYS = [
  'maxTime',
  'maxTransitions',
  'maxReentries',
] as const

// ─── Artifact domain identifier ───────────────────────────────────────────────
// Used as ArtifactEmission.payload.domain when a RunReport is emitted per
// Artifact Standard §8. Source of truth for the domain label.

export const MI_ARTIFACT_DOMAIN = 'multi-instance' as const
