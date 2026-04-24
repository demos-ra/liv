// @liv-standard v1.5.1
// [F-artifact/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice
// slice:      F-artifact
// layer:      R1
// wires-in:
//   W-ATOM  NodeId, ArtifactEdge  ←  F-artifact/R0 types/artifact-types
// wires-out:  consumed by F-artifact/R2 artifact-emit
// deps:
//   R0  ../types/artifact-types
// validated:  pending
//
// F-artifact R1 — ArA4 edge derivation.
// Pure. No I/O, no side effects. Same inputs = same outputs.
// A6: R1 is deterministic pure-function layer per LIV-Standard.
//
// ArA4 axioms (artifact-standard.md §3.6):
//   ArA4a — classification-lineage:  exactly 1 edge; fromId = anchor, toId = classificationNodeId
//   ArA4b — categorical:             exactly 1 edge; fromId = anchor, toId = mode-node (by primitive)
//   ArA4c — version:                 0 or 1 edge; 1 iff a prior anchor of same (framework, domain,
//                                    schemaRef, turnId-lineage) resolves; toId = prior anchor
//   ArA4d — dependency:              n edges; cardinality == input.dependsOn.length; fromId = anchor,
//                                    toId = each declared prior-artifact reference
//
// G-Ar6 (§4.2): every emitted edge.kind ∈ ArtifactEdgeKind enum.
// ArA5 (§3.6 implication for edges): edges added here are strictly derived; no mutation of existing edges.

import type {
  NodeId,
  ArtifactEdge,
} from '../types/artifact-types'

// ─── Inputs to derivation ────────────────────────────────────────────────────

/**
 * Resolved references required before ArA4 can be computed.
 * anchor / classificationNodeId come from input; modeNodeId is looked up from
 * primitive by R2 caller; priorAnchorNodeId is a deterministic lookup against
 * the artifact registry (null when no prior anchor exists).
 */
export type Ara4ResolutionInput = {
  anchorNodeId:         NodeId
  classificationNodeId: NodeId
  modeNodeId:           NodeId
  priorAnchorNodeId:    NodeId | null
  dependsOn:            NodeId[]
}

// ─── ArA4a: classification-lineage ───────────────────────────────────────────

/**
 * Derive the single ArA4a edge.
 * Invariant: exactly one; fromId = anchor; toId = classificationNodeId.
 */
export function deriveClassificationLineageEdge(
  anchorNodeId:         NodeId,
  classificationNodeId: NodeId,
): ArtifactEdge {
  return {
    fromId: anchorNodeId,
    toId:   classificationNodeId,
    kind:   'classification-lineage',
  }
}

// ─── ArA4b: categorical ──────────────────────────────────────────────────────

/**
 * Derive the single ArA4b edge.
 * Invariant: exactly one; fromId = anchor; toId = mode-node resolved from primitive.
 */
export function deriveCategoricalEdge(
  anchorNodeId: NodeId,
  modeNodeId:   NodeId,
): ArtifactEdge {
  return {
    fromId: anchorNodeId,
    toId:   modeNodeId,
    kind:   'categorical',
  }
}

// ─── ArA4c: version ──────────────────────────────────────────────────────────

/**
 * Derive the conditional ArA4c edge.
 * Invariant: zero or one; one iff priorAnchorNodeId resolves to a NodeId.
 * Returns null when no prior anchor exists.
 */
export function deriveVersionEdge(
  anchorNodeId:      NodeId,
  priorAnchorNodeId: NodeId | null,
): ArtifactEdge | null {
  if (priorAnchorNodeId === null) return null
  return {
    fromId: anchorNodeId,
    toId:   priorAnchorNodeId,
    kind:   'version',
  }
}

// ─── ArA4d: dependency ───────────────────────────────────────────────────────

/**
 * Derive the n ArA4d dependency edges.
 * Invariant: cardinality === dependsOn.length; fromId = anchor for every edge.
 */
export function deriveDependencyEdges(
  anchorNodeId: NodeId,
  dependsOn:    NodeId[],
): ArtifactEdge[] {
  return dependsOn.map(toId => ({
    fromId: anchorNodeId,
    toId,
    kind:   'dependency',
  }))
}

// ─── Composition: derive all ArA4 edges ──────────────────────────────────────

/**
 * Derive the full ArA4 edge set for one emission.
 * Output order: classification-lineage, categorical, version?, dependency[].
 * Total cardinality = 2 + (priorAnchorNodeId ? 1 : 0) + dependsOn.length.
 */
export function deriveAllEdges(input: Ara4ResolutionInput): ArtifactEdge[] {
  const edges: ArtifactEdge[] = []

  // ArA4a
  edges.push(deriveClassificationLineageEdge(input.anchorNodeId, input.classificationNodeId))

  // ArA4b
  edges.push(deriveCategoricalEdge(input.anchorNodeId, input.modeNodeId))

  // ArA4c
  const versionEdge = deriveVersionEdge(input.anchorNodeId, input.priorAnchorNodeId)
  if (versionEdge !== null) edges.push(versionEdge)

  // ArA4d
  edges.push(...deriveDependencyEdges(input.anchorNodeId, input.dependsOn))

  return edges
}
