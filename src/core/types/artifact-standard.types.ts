// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId             ← core/R5 primitives
//   W-ATOM Semver             ← core/R5 primitives
//   W-ATOM UserId             ← core/R5 primitives
//   W-ATOM CognitivePrimitive ← core/R5 primitives
// wires-out:
//   W-ATOM ArtifactEmission    → any artifact consumer (Phase 4a+)
//   W-ATOM ArtifactWriteA4     → any artifact consumer
//   W-ATOM ArtifactWriteA7     → any artifact consumer
//   W-ATOM ArtifactEdge        → any artifact consumer
//   W-ATOM ArtifactPayload     → any artifact consumer
//   W-ATOM CreateArtifactInput → any AS caller (content frameworks)
//   W-ATOM EdgeKind            → any artifact consumer
//   W-ATOM ChainWritePoint     → any slice iterating chain positions
// deps:
//   R5 ./primitives
//   R5 ../constants/artifact-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v2.1 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Matches Artifact Standard v2.1 §8 input schema (CreateArtifactInput) and
// §9 output schema (ArtifactEmission).
// Regenerated against metaframework v2.4 (MA-G5c custody, MA-G5d provenance).
// ArA5 (post-emission immutability) — shape members are `readonly` where the
// standard implies immutability; co-occurrence constraints (a7 present iff
// framework applied, payload present iff a7 present) enforced at emission
// time per §10 validity, not at the type level.

import type { NodeId, Semver, UserId, CognitivePrimitive } from './primitives'
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

export type { NodeId, Semver, UserId, CognitivePrimitive }

// ─── A4 write (always present per ArA1) ───────────────────────────────────────
// Cognitive Standard owns the semantic definition; this field is a snapshot
// reference to what mutation occurred. Label and full classification details
// live on the classification node, retrievable via classificationNodeId.

export interface ArtifactWriteA4 {
  readonly classificationNodeId: NodeId
  readonly primitive:            CognitivePrimitive
  readonly confidence:           number
}

// ─── A7 write (present iff framework applied per ArA1) ────────────────────────
// ArA2: companionDataNodeId is the exactly-one 1:1 companion binding by emissionId.
// ArA3: contentNodeIds cardinality >= 1 via traversal of payload.content.

export interface ArtifactWriteA7 {
  readonly artifactAnchorNodeId: NodeId
  readonly companionDataNodeId:  NodeId
  readonly contentNodeIds:       readonly NodeId[]
}

// ─── Artifact edge (ArA4a–ArA4d) ──────────────────────────────────────────────
// Edge kinds: 4 total (classification-lineage, categorical, version, dependency).
// Cardinality per emission: always 2 (classification-lineage + categorical) +
// conditional (version iff prior anchor; dependency iff dependsOn non-empty).
// Enforced at emission time per §10.

export interface ArtifactEdge {
  readonly fromId: NodeId
  readonly toId:   NodeId
  readonly kind:   EdgeKind
}

// ─── Domain payload (present iff a7 present per §9) ───────────────────────────
// content is `unknown` by design — content frameworks (Plan, M-I, etc.) declare
// their own payload schemas. Consumers narrow via schemaRef + domainVersion.

export interface ArtifactPayload {
  readonly domain:        string
  readonly domainVersion: Semver
  readonly schemaRef:     string
  readonly content:       unknown
}

// ─── CreateArtifactInput (§8 input W-ATOM) ────────────────────────────────────
// W-ATOM consumed by `createArtifact` at R3.
// Provenance per v2.1 §8: every field traces to a named owning framework or
// external source. Custody per §7.1.

export interface CreateArtifactInput {
  readonly framework: {
    readonly id:      string         // provenance: caller (content framework) R0
    readonly version: Semver         // provenance: caller R0
  }
  readonly turnId:               string             // provenance: caller turn context
  readonly userId:               UserId             // provenance: F-identity session
  readonly payload:              ArtifactPayload    // provenance: caller output
  readonly classificationNodeId: NodeId             // provenance: Cognitive Standard R3 encodeLLM
  readonly primitive:            CognitivePrimitive // provenance: same encodeLLM call
  readonly confidence:           number             // provenance: same encodeLLM call
  readonly dependsOn?:           readonly NodeId[]  // provenance: caller prior-artifact refs
}

// ─── ArtifactEmission (§9 output W-ATOM) ──────────────────────────────────────
// Co-occurrence constraint — "a7 present iff framework applied" and
// "payload present iff a7 present" — enforced at emission time (§10 validity),
// not at the type level.

export interface ArtifactEmission {
  readonly emissionId: string                       // provenance: runtime-generated (UUID v4)
  readonly framework:  {
    readonly id:      string                        // provenance: input.framework.id (verbatim)
    readonly version: Semver                        // provenance: input.framework.version (verbatim)
  }
  readonly turnId: string                           // provenance: input.turnId (verbatim)

  readonly writes: {
    readonly a4:  ArtifactWriteA4                   // always present per ArA1 — from input
    readonly a7?: ArtifactWriteA7                   // present iff framework applied — ArA2/ArA3
  }

  readonly edges: readonly ArtifactEdge[]           // per ArA4a–ArA4d

  readonly payload?: ArtifactPayload                // present iff a7 present — input.payload (verbatim)
}
