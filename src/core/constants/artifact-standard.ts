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
//   W-ATOM ARTIFACT_EDGE_KINDS → any artifact emitter
//   W-ATOM CHAIN_WRITE_POINTS  → any slice iterating chain positions
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v2.1 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Canonical constants for Artifact Standard v2.1.
// Governs framework-emitted artifact nodes per ArA1–ArA5.
// Regenerated against metaframework v2.4 (MA-G5c custody, MA-G5d provenance).
// See: src/core/standards/artifact-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
// A6: declared at origin. No R5 cross-imports.

// ─── Axioms (ArA1–ArA5) ───────────────────────────────────────────────────────
// Canonical axiom IDs per Artifact Standard v2.1 §6.
// v2.1 decomposition: ArA4 split into ArA4a–ArA4d per E6 axiom atomicity.
// One edge kind per axiom; edge-kind enum exhaustive at §9.

export const ARTIFACT_AXIOMS = {
  TWO_POINT_EMISSION:            'ArA1',
  COMPANION_PRESERVATION:        'ArA2',
  TRAVERSED_SEMANTIC_CLOSURE:    'ArA3',
  EDGE_CLASSIFICATION_LINEAGE:   'ArA4a',
  EDGE_CATEGORICAL:              'ArA4b',
  EDGE_VERSION:                  'ArA4c',
  EDGE_DEPENDENCY:               'ArA4d',
  EVOLUTION_VIA_PRIMITIVES:      'ArA5',
} as const

// ─── Artifact edge kinds ──────────────────────────────────────────────────────
// Edge kinds per Artifact Standard v2.1 §4.3 Lineage and §9 output schema.
// v2.1: 4 kinds (exhaustive). 'split-lineage' dropped — split handled inside
// Plan Standard's own payload (PA10b), not as an AS edge.

export const ARTIFACT_EDGE_KINDS = [
  'classification-lineage',
  'categorical',
  'version',
  'dependency',
] as const

// ─── Chain write points ───────────────────────────────────────────────────────
// Per Artifact Standard v2.1 §4.1 Emission.
// A4 = codec classification write (every turn, Cognitive Standard owns).
// A7 = framework artifact write (iff framework applied, AS owns).
// B3 = directional-symmetric counterpart (post-beta).

export const CHAIN_WRITE_POINTS = [
  'A4',
  'A7',
  'B3',
] as const
