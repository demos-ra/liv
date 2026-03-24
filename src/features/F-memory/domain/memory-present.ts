// @liv-standard v1.3
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  MemGraph              F-memory/R0
//   W-ATOM  MemArm                F-memory/R0
//   W-ATOM  PresentState          F-memory/R0
//   W-ATOM  PresentStateStatement F-memory/R0
//   W-ATOM  ConfidenceTier        F-memory/R0
//   W-ATOM  MLayer                F-memory/R0
//   W-ATOM  MEMORY_CONFIG         F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v1.0 — Present State Layer.
// R1: pure function, zero I/O.
// §18: the bridge between living process and immediate usability.
// A pure R1 function: computePresentState(graph, arms) → PresentState.
// Never stored. Always derived from current graph state. Never stale.
//
// G1: graceful fallback for weak arm structure.
//     Must produce useful output even when the graph has no clear community
//     structure (first ~5 sessions). Return nodes by layer + recency without
//     arm labels. Never return empty because arms haven't formed.
//
// G2: getPresentState() at R3 reads the precomputed result — this function
//     is called only inside runTraversal() as a side effect.

import type {
  MemGraph,
  MemArm,
  PresentState,
  PresentStateStatement,
  ConfidenceTier,
  MLayer,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M0_IDENTITY,
  M1_PURPOSE,
  M2_KNOWLEDGE,
  M3_CONTEXT,
  M4_INPUT,
} from '../config/memory-types'

// ─── Compute Present State ────────────────────────────────────────────────────
// §18: reads all nodes, weighted by recency + layer depth.
// Output: structured data, not prose. The consuming LLM reads it as context injection.

export function computePresentState(
  graph: MemGraph,
  arms: MemArm[],
): PresentState {
  if (graph.nodes.size === 0) {
    // G2: cold boot — return empty. Never block on computation.
    return { statements: [] }
  }

  const now = Date.now()
  const statements: PresentStateStatement[] = []

  // Build arm lookup: nodeId → arm label
  const nodeToArm = new Map<string, string | null>()
  for (const arm of arms) {
    for (const nodeId of arm.nodeIds) {
      // Assign arm label. If node is in multiple arms, use the deepest one.
      const existing = nodeToArm.get(nodeId)
      if (!existing) {
        nodeToArm.set(nodeId, arm.label ?? arm.id)
      }
    }
  }

  // Score and collect all nodes
  const scored: Array<{
    nodeId:     string
    content:    string
    arm:        string | null
    source:     string | null
    layer:      MLayer
    confidence: ConfidenceTier
    recency:    number
    sortScore:  number
  }> = []

  for (const [nodeId, node] of graph.nodes) {
    // Skip M4 (pre-integration, not yet bound)
    if (node.cachedLayer === M4_INPUT) continue

    // §18: recency = EMA-weighted traversal recency
    const recency = computeRecency(node.lastTraversed, now)

    // §18: layer depth — M0/M1 nodes carry more structural weight
    const layerWeight = layerDepthWeight(node.cachedLayer)

    // Combined sort score: layer weight + recency
    const sortScore = layerWeight * 0.6 + recency * 0.4

    const confidence = layerToConfidence(node.cachedLayer)

    // G1: arm is null if arms haven't formed yet
    const arm = nodeToArm.get(nodeId) ?? null

    // §18 source text lifecycle:
    //   M3: source_text available for exact recall
    //   M2+: source_text pruned, value from graph position
    const source = node.cachedLayer >= M3_CONTEXT ? node.sourceText : null

    scored.push({
      nodeId,
      content:    node.content,
      arm,
      source,
      layer:      node.cachedLayer,
      confidence,
      recency,
      sortScore,
    })
  }

  // Sort by score descending — most relevant first
  scored.sort((a, b) => b.sortScore - a.sortScore)

  // Take top N
  const topN = scored.slice(0, MEMORY_CONFIG.PRESENT_STATE_MAX)

  for (const item of topN) {
    statements.push({
      arm:        item.arm,
      value:      item.content,
      source:     item.source,
      layer:      item.layer,
      confidence: item.confidence,
      recency:    item.recency,
    })
  }

  return { statements }
}

// ─── Recency ──────────────────────────────────────────────────────────────────
// §18: EMA-style weighting on last_traversed.
// Recent traversals contribute more. Half-life from config.
// Returns [0, 1] where 1 = just traversed, 0 = long ago / never.

function computeRecency(lastTraversed: number | null, now: number): number {
  if (lastTraversed === null) return 0

  const elapsed = now - lastTraversed
  if (elapsed <= 0) return 1

  // Exponential decay with half-life
  return Math.exp(-Math.LN2 * elapsed / MEMORY_CONFIG.RECENCY_HALF_LIFE)
}

// ─── Layer depth weight ───────────────────────────────────────────────────────
// §18: M0/M1 nodes carry more structural weight than M3/M4.

function layerDepthWeight(layer: MLayer): number {
  switch (layer) {
    case M0_IDENTITY:  return 1.0
    case M1_PURPOSE:   return 0.85
    case M2_KNOWLEDGE: return 0.65
    case M3_CONTEXT:   return 0.4
    case M4_INPUT:     return 0.1
  }
}

// ─── Confidence tier mapping ──────────────────────────────────────────────────
// §18: confidence tiers from layer position.

function layerToConfidence(layer: MLayer): ConfidenceTier {
  switch (layer) {
    case M0_IDENTITY:  return 'identity'
    case M1_PURPOSE:   return 'purpose'
    case M2_KNOWLEDGE: return 'consolidated'
    case M3_CONTEXT:   return 'recent'
    case M4_INPUT:     return 'new'
  }
}
