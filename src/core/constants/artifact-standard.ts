// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM ArtifactChainPosition    ← core/R5 ../types/artifact-standard.types
//   W-ATOM ArtifactEdgeKind         ← core/R5 ../types/artifact-standard.types
//   W-ATOM ArtifactProcedureStage   ← core/R5 ../types/artifact-standard.types
//   W-ATOM ArtifactProcedureKind    ← core/R5 ../types/artifact-standard.types
//   W-ATOM ArtifactProcedureStepId  ← core/R5 ../types/artifact-standard.types
// wires-out:
//   W-ATOM ARTIFACT_STANDARD_ID              → all framework consumers
//   W-ATOM ARTIFACT_STANDARD_VERSION         → all framework consumers
//   W-ATOM ARTIFACT_STANDARD_KIND            → all framework consumers
//   W-ATOM ARTIFACT_STANDARD_MODE            → all framework consumers
//   W-ATOM ARTIFACT_STANDARD_LEVEL           → all framework consumers
//   W-ATOM ARTIFACT_STANDARD_CARRIER         → all framework consumers
//   W-ATOM ARTIFACT_CHAIN_POSITIONS          → any slice iterating chain positions
//   W-ATOM ARTIFACT_OWNED_CHAIN_POSITION     → any artifact emitter
//   W-ATOM ARTIFACT_EDGE_KINDS               → any artifact emitter
//   W-ATOM ARTIFACT_AXIOM_IDS                → any slice emitting artifacts
//   W-ATOM ARTIFACT_AXIOM_GATE_IDS           → framework-audit, generation-procedure
//   W-ATOM ARTIFACT_PROCEDURE_STEP_IDS       → framework-audit
//   W-ATOM ARTIFACT_PROCEDURE_STAGES         → framework-audit
//   W-ATOM ARTIFACT_PROCEDURE_KINDS          → framework-audit
//   W-ATOM ARTIFACT_ADJACENT_FRAMEWORKS      → registry, framework-audit
//   W-ATOM ARTIFACT_CARRIER_KEY              → carrier resolution
//   W-ATOM ARTIFACT_CONFIDENCE_MIN           → emission validation
//   W-ATOM ARTIFACT_CONFIDENCE_MAX           → emission validation
//   W-ATOM ARTIFACT_CONTENT_NODES_MIN        → emission validation
//   W-ATOM ARTIFACT_ANCHOR_COMPANION_BINDING → emission validation
// deps:
//   R5 ../types/artifact-standard.types
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v2.2 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Artifact Standard v2.2 landing: regenerated against metaframework-v3-1;
// fix-round-1 applied.
// Canonical spec: src/core/standards/artifact-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// artifact-standard.ts
// R5 constants for Artifact Standard v2.2
// Generated against metaframework-v3-1 via generation-procedure-v1-0
//
// Discipline: declarations only; consumed by runtime slices (F-artifact post-beta).
// Authority: L0 via metaframework-v3-1 §6.2 HR6 (generated L3 framework contract).

import type {
  ArtifactChainPosition,
  ArtifactEdgeKind,
  ArtifactProcedureStage,
  ArtifactProcedureKind,
  ArtifactProcedureStepId,
} from '../types/artifact-standard.types'

// ─── Framework identity constants ───────────────────────────────────────────

export const ARTIFACT_STANDARD_ID      = 'artifact-standard'
export const ARTIFACT_STANDARD_VERSION = 'v2.2'
export const ARTIFACT_STANDARD_KIND    = 'Framework'
export const ARTIFACT_STANDARD_MODE    = 'generative'
export const ARTIFACT_STANDARD_LEVEL   = 'L3'
export const ARTIFACT_STANDARD_CARRIER = 'self'

// ─── Chain positions ────────────────────────────────────────────────────────

export const ARTIFACT_CHAIN_POSITIONS: readonly ArtifactChainPosition[] = [
  'A4',
  'A7',
  'B3',
] as const

/**
 * AS-owned chain position for A-direction emission.
 * A4 is owned by Cognitive Standard; AS consumes input from A4 but does not write there.
 */
export const ARTIFACT_OWNED_CHAIN_POSITION: ArtifactChainPosition = 'A7'

// ─── Edge kinds ─────────────────────────────────────────────────────────────

export const ARTIFACT_EDGE_KINDS: readonly ArtifactEdgeKind[] = [
  'classification-lineage',
  'categorical',
  'version',
  'dependency',
] as const

// ─── Axiom identifiers (ArA1–ArA8) ──────────────────────────────────────────
// One mechanical condition per axiom per AxR2. MA-St4 primitive-atomicity enforced.

export const ARTIFACT_AXIOM_IDS: readonly string[] = [
  'ArA1',  // emission cardinality at A4 + A7
  'ArA2',  // anchor + companion 1:1 binding by emissionId
  'ArA3',  // contentNodeIds cardinality >= 1
  'ArA4a', // classification-lineage edge
  'ArA4b', // categorical (mode-node) edge
  'ArA4c', // version edge (iff prior exists)
  'ArA4d', // dependency edges (cardinality = dependsOn.length)
  'ArA5',  // post-emission immutability
  'ArA6',  // edge-set exhaustive over ArA4a-d
  'ArA7',  // payload verbatim-carry invariant
  'ArA8',  // emissionId uniqueness
] as const

// ─── Gate identifiers ───────────────────────────────────────────────────────
// AS-own axiom gates: one per axiom per MA-V1.

export const ARTIFACT_AXIOM_GATE_IDS: readonly string[] = [
  'G-Ar1',
  'G-Ar2',
  'G-Ar3',
  'G-Ar4a',
  'G-Ar4b',
  'G-Ar4c',
  'G-Ar4d',
  'G-Ar5',
  'G-Ar6',
  'G-Ar7',
  'G-Ar8',
] as const

// ─── Procedure steps (P8 per substrate §8.3) ────────────────────────────────

export const ARTIFACT_PROCEDURE_STEP_IDS: readonly ArtifactProcedureStepId[] = [
  'S1',
  'S2',
  'S3',
] as const

/**
 * Per-step stage declaration per substrate §8.3 Stage enum (subset {2, 3, 5}).
 * Monotonic non-decreasing across order per PR4.
 */
export const ARTIFACT_PROCEDURE_STAGES: Readonly<
  Record<ArtifactProcedureStepId, ArtifactProcedureStage>
> = {
  S1: 2,
  S2: 3,
  S3: 5,
}

/**
 * Per-step kind declaration per substrate §8.3 + PR5 kind-alignment.
 * stage:2 → mechanical; stage:3 → gate-execution; stage:5 → mechanical.
 */
export const ARTIFACT_PROCEDURE_KINDS: Readonly<
  Record<ArtifactProcedureStepId, ArtifactProcedureKind>
> = {
  S1: 'mechanical',
  S2: 'gate-execution',
  S3: 'mechanical',
}

// ─── Adjacent framework identifiers ─────────────────────────────────────────
// Declared for custody and handoff references.

export const ARTIFACT_ADJACENT_FRAMEWORKS: readonly string[] = [
  'cognitive-standard',   // upstream (A4 → A7 boundary)
  'living-memory',        // write carrier for anchor/companion/content
  'liv-standard',         // Semver custodian
] as const

// ─── Content framework convention ───────────────────────────────────────────
// AS consumers declaring carrier='artifact-standard' at their §1 Identity.
// Enumerated consumer list maintained by content frameworks; AS tracks adjacency only.

export const ARTIFACT_CARRIER_KEY = 'artifact-standard' as const

// ─── Confidence range ───────────────────────────────────────────────────────

export const ARTIFACT_CONFIDENCE_MIN = 0
export const ARTIFACT_CONFIDENCE_MAX = 1

// ─── Content node minimum cardinality (per ArA3) ────────────────────────────

export const ARTIFACT_CONTENT_NODES_MIN = 1

// ─── Anchor-to-companion binding cardinality (per ArA2) ─────────────────────

export const ARTIFACT_ANCHOR_COMPANION_BINDING = '1:1' as const

// ─── End of artifact-standard.ts ────────────────────────────────────────────
