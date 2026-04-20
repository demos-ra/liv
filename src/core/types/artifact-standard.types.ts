// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId ← core/R5 primitives
//   W-ATOM Semver ← core/R5 primitives
//   W-ATOM CognitivePrimitive ← core/R5 primitives
// wires-out:
//   W-ATOM ArtifactEmission → any artifact consumer (Phase 4+)
//   W-ATOM ArtifactWriteA4  → any artifact consumer
//   W-ATOM ArtifactWriteA7  → any artifact consumer
//   W-ATOM ArtifactEdge     → any artifact consumer
//   W-ATOM ArtifactPayload  → any artifact consumer
//   W-ATOM EdgeKind         → any artifact consumer
//   W-ATOM ChainWritePoint  → any artifact consumer
// deps:
//   R5 ./primitives
//   R5 ../constants/artifact-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v1.1 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Matches Artifact Standard v1.1 §8 output artifact schema.
// Payload.content is intentionally `unknown` — domains type their own payloads
// per §6.3 (domain standards declare content payload schemas).
// ArA5 (evolution via primitives) — shape members are `readonly` where the
// standard implies post-emission immutability.

import type { NodeId, Semver, CognitivePrimitive } from './primitives'
import type {
  ARTIFACT_EDGE_KINDS,
  CHAIN_WRITE_POINTS,
} from '../constants/artifact-standard'

// ─── Union types derived from R5 constants ────────────────────────────────────
// Single source of truth: constants file. Types here are narrow unions over
// those arrays, preventing drift between runtime constant and compile-time type.

export type EdgeKind        = typeof ARTIFACT_EDGE_KINDS[number]
export type ChainWritePoint = typeof CHAIN_WRITE_POINTS[number]

// Re-export branded primitives for consumer convenience.
// A6-compliant: not a redeclaration; a type-only re-export.

export type { NodeId, Semver, CognitivePrimitive }

// ─── A4 write (always present per ArA1) ───────────────────────────────────────
// A4 write — always present per ArA1.
// primitive: the cognitive primitive applied at write time.
//   Cognitive Standard owns the semantic definition; this field is a snapshot
//   reference to what mutation occurred. Label and full classification details
//   live on the classification node, retrievable via classificationNodeId.

export interface ArtifactWriteA4 {
  readonly classificationNodeId: NodeId
  readonly primitive:            CognitivePrimitive
  readonly confidence:           number
}

// ─── A7 write (present iff framework applied per ArA1) ────────────────────────
// ArA2: companionDataNodeId is the exactly-one companion binding.
// ArA3: contentNodeIds are the traversed semantic-content nodes.

export interface ArtifactWriteA7 {
  readonly artifactAnchorNodeId: NodeId
  readonly companionDataNodeId:  NodeId
  readonly contentNodeIds:       readonly NodeId[]
}

// ─── Artifact edge (ArA4) ─────────────────────────────────────────────────────

export interface ArtifactEdge {
  readonly fromId: NodeId
  readonly toId:   NodeId
  readonly kind:   EdgeKind
}

// ─── Domain payload (present iff a7 present per §8) ───────────────────────────
// content is `unknown` by design — §6.3: domain standards declare their own
// payload schemas. Consumers narrow via schemaRef + domainVersion.

export interface ArtifactPayload {
  readonly domain:        string
  readonly domainVersion: Semver
  readonly schemaRef:     string
  readonly content:       unknown
}

// ─── ArtifactEmission (top-level per §8) ──────────────────────────────────────
// Co-occurrence constraint — "a7 present iff framework applied" and
// "payload present iff a7 present" — is enforced at emission time (§9 validity),
// not at the type level. See Artifact Standard v1.1 §8 note.

export interface ArtifactEmission {
  readonly emissionId: string
  readonly framework:  {
    readonly id:      string
    readonly version: Semver
  }
  readonly turnId: string

  readonly writes: {
    readonly a4:  ArtifactWriteA4      // always present — ArA1
    readonly a7?: ArtifactWriteA7      // present iff framework applied — ArA1
  }

  readonly edges: readonly ArtifactEdge[]   // ArA4

  readonly payload?: ArtifactPayload         // present iff a7 present
}
