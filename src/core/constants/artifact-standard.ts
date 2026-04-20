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
//   W-ATOM ARTIFACT_AXIOMS     → any slice emitting artifacts
//   W-ATOM DECODE_CATEGORIES   → F-codec, F-memory, any artifact emitter
//   W-ATOM ARTIFACT_EDGE_KINDS → any artifact emitter
//   W-ATOM CHAIN_WRITE_POINTS  → any slice iterating chain positions
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v1.0 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Canonical constants for Artifact Standard v1.0.
// Governs framework-emitted artifact nodes per ArA1–ArA5.
// See: src/core/standards/artifact-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. No R5 cross-imports.

// ─── Axioms (ArA1–ArA5) ───────────────────────────────────────────────────────
// Canonical axiom IDs per Artifact Standard §7.

export const ARTIFACT_AXIOMS = {
  TWO_POINT_EMISSION:          'ArA1',
  COMPANION_PRESERVATION:      'ArA2',
  TRAVERSED_SEMANTIC_CLOSURE:  'ArA3',
  EDGE_COMPLETENESS:           'ArA4',
  EVOLUTION_VIA_PRIMITIVES:    'ArA5',
} as const

// ─── Decode categories ────────────────────────────────────────────────────────
// Category set for A4 (codec classification) and A7 (artifact anchor).
// Per Artifact Standard §8 writes.a4.category union + 'artifact' added for a7.
// Source of truth for codec classification output shape.

export const DECODE_CATEGORIES = [
  'entity',
  'relation',
  'claim',
  'sequence',
  'tension',
  'artifact',
] as const

// ─── Artifact edge kinds ──────────────────────────────────────────────────────
// Edge kinds per Artifact Standard §4.2 Composition and §4.3 Lineage.
// ArA4 (edge completeness) requires categorical + version + classification-lineage
// at minimum; dependency and split-lineage exist when inputs or splits present.

export const ARTIFACT_EDGE_KINDS = [
  'categorical',
  'dependency',
  'version',
  'classification-lineage',
  'split-lineage',
] as const

// ─── Chain write points ───────────────────────────────────────────────────────
// Per Artifact Standard §4.1 Emission.
// A4 = codec classification write (every turn).
// A7 = framework artifact write (iff framework applied).
// B3 = directional-symmetric counterpart (lands post-beta, Cluster E).
// Cite: see artifact-standard.md §4.1 for current operational scope (A direction).

export const CHAIN_WRITE_POINTS = [
  'A4',
  'A7',
  'B3',
] as const
