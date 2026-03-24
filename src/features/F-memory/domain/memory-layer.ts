// @liv-standard v1.3
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  MemNode          F-memory/R0
//   W-ATOM  MemGraph         F-memory/R0
//   W-ATOM  MLayer           F-memory/R0
//   W-ATOM  GraphThresholds  F-memory/R0
//   W-ATOM  DominanceEntry   F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v1.0 — layer computation.
// R1: pure functions, zero I/O.
// §7 computeLayer(): decision tree, cheapest checks first.
// MA5: M0 is computed, never declared. The highest-density attractor basin.
// §9: non-collapse guarantees — each transition adds a qualitatively new invariant.

import type {
  MemNode,
  MemGraph,
  MLayer,
  GraphThresholds,
  DominanceEntry,
} from '../config/memory-types'
import {
  M0_IDENTITY,
  M1_PURPOSE,
  M2_KNOWLEDGE,
  M3_CONTEXT,
  M4_INPUT,
} from '../config/memory-types'

// ─── Compute Layer ────────────────────────────────────────────────────────────
// §7: decision tree, cheapest checks first:
//   1. degree = 0 → M4
//   2. has edges  → at least M3
//   3. closure ≥ θ_close AND stability ≥ θ_stable → M2
//   4. asymmetry ≥ θ_asym → M1
//   5. dominance ≥ θ_dom → M0
//
// §4 layer transitions — each adds a new invariant:
//   M4→M3: connectivity (degree ≥ 1)
//   M3→M2: self-sustaining without energy input (closure)
//   M2→M1: non-reciprocal traversal bias across contexts
//   M1→M0: system reconverges through this region after perturbation

export function computeLayer(
  node: MemNode,
  graph: MemGraph,
  thresholds: GraphThresholds,
  dominanceMap: Map<string, DominanceEntry>,
): MLayer {
  // Step 1: degree = 0 → M4 (cheapest check)
  const outDegree = (graph.edges.get(node.id) ?? []).length
  const inDegree  = countIncoming(node.id, graph)
  const totalDegree = outDegree + inDegree

  if (totalDegree === 0) return M4_INPUT

  // Step 2: has edges → at least M3
  // Now check for deeper layers...

  // Step 3: closure + stability → M2
  // Closure: cycle participation ratio (cached, updated incrementally)
  const closure   = computeClosure(node.id, graph)
  const stability = computeStability(node.id, graph)

  if (closure >= thresholds.close && stability >= thresholds.stable) {
    // Check for M1 and M0 before settling on M2

    // Step 4: directional asymmetry → M1
    const asymmetry = computeAsymmetry(node.id, graph)

    if (asymmetry >= thresholds.asym) {
      // Step 5: attractor dominance → M0
      const dominance = dominanceMap.get(node.id)
      if (dominance && dominance.convergence >= thresholds.dom) {
        return M0_IDENTITY  // MA5: emergent, not declared
      }
      return M1_PURPOSE
    }

    return M2_KNOWLEDGE
  }

  // Connected but not self-sustaining
  return M3_CONTEXT
}

// ─── Update layers locally ────────────────────────────────────────────────────
// §7: only recompute nodes whose degree changed during traversal.
// Cached closure/dominance for everything else.
// Returns layer updates for changed nodes.

export type LayerUpdate = {
  nodeId:    string
  layer:     MLayer
  closure:   number
  asymmetry: number
}

export function updateLayersLocally(
  changedNodeIds: Set<string>,
  graph: MemGraph,
  thresholds: GraphThresholds,
  dominanceMap: Map<string, DominanceEntry>,
): LayerUpdate[] {
  const updates: LayerUpdate[] = []

  for (const nodeId of changedNodeIds) {
    const node = graph.nodes.get(nodeId)
    if (!node) continue

    const newLayer = computeLayer(node, graph, thresholds, dominanceMap)
    const closure  = computeClosure(nodeId, graph)
    const asymmetry = computeAsymmetry(nodeId, graph)

    // Only emit update if something changed
    if (
      newLayer !== node.cachedLayer ||
      Math.abs(closure - node.cachedClosure) > 1e-6 ||
      Math.abs(asymmetry - node.cachedAsymmetry) > 1e-6
    ) {
      updates.push({ nodeId, layer: newLayer, closure, asymmetry })
    }
  }

  return updates
}

// ─── Closure ──────────────────────────────────────────────────────────────────
// Cycle participation ratio: fraction of neighbors that form cycles through this node.
// Computed via k-hop reachability (k=3 for performance).
// High closure → self-sustaining structure (M2 invariant).

export function computeClosure(nodeId: string, graph: MemGraph): number {
  const outEdges = graph.edges.get(nodeId) ?? []
  if (outEdges.length === 0) return 0

  const neighbors = outEdges.map(e => e.toId)
  let cycleCount = 0

  // For each neighbor: can we reach back to nodeId within k hops?
  const K_HOPS = 3
  for (const neighborId of neighbors) {
    if (canReach(neighborId, nodeId, graph, K_HOPS, new Set([nodeId]))) {
      cycleCount++
    }
  }

  return neighbors.length > 0 ? cycleCount / neighbors.length : 0
}

// ─── Stability ────────────────────────────────────────────────────────────────
// Structural reactivation test: can this node be activated from its neighbors?
// No history storage — purely structural.
// High stability → reactivatable from partial cues (M2 invariant).

export function computeStability(nodeId: string, graph: MemGraph): number {
  const outEdges = graph.edges.get(nodeId) ?? []
  const inEdges  = getIncomingEdges(nodeId, graph)

  if (inEdges.length === 0) return 0

  // Stability = mean incoming weight × connectivity factor
  // A node is stable if multiple strong paths lead to it
  const meanInWeight = inEdges.reduce((s, e) => s + e.weight, 0) / inEdges.length
  const connectivityFactor = Math.min(1, Math.log(inEdges.length + 1) / Math.log(5))

  return meanInWeight * connectivityFactor
}

// ─── Asymmetry ────────────────────────────────────────────────────────────────
// §7: non-reciprocal weight differential across contexts.
// P(activate B|A) ≠ P(activate A|B).
// High asymmetry → directional bias (M1 invariant).

export function computeAsymmetry(nodeId: string, graph: MemGraph): number {
  const outEdges = graph.edges.get(nodeId) ?? []
  if (outEdges.length === 0) return 0

  let totalAsymmetry = 0
  let pairCount = 0

  for (const edge of outEdges) {
    // Find reverse edge
    const reverseEdges = graph.edges.get(edge.toId) ?? []
    const reverse = reverseEdges.find(e => e.toId === nodeId)
    const reverseWeight = reverse?.weight ?? 0

    totalAsymmetry += Math.abs(edge.weight - reverseWeight)
    pairCount++
  }

  return pairCount > 0 ? totalAsymmetry / pairCount : 0
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countIncoming(nodeId: string, graph: MemGraph): number {
  let count = 0
  for (const [, edges] of graph.edges) {
    for (const edge of edges) {
      if (edge.toId === nodeId) count++
    }
  }
  return count
}

function getIncomingEdges(nodeId: string, graph: MemGraph): Array<{ fromId: string; weight: number }> {
  const incoming: Array<{ fromId: string; weight: number }> = []
  for (const [fromId, edges] of graph.edges) {
    for (const edge of edges) {
      if (edge.toId === nodeId) {
        incoming.push({ fromId, weight: edge.weight })
      }
    }
  }
  return incoming
}

function canReach(
  fromId: string,
  targetId: string,
  graph: MemGraph,
  maxHops: number,
  visited: Set<string>,
): boolean {
  if (maxHops <= 0) return false

  const outEdges = graph.edges.get(fromId) ?? []
  for (const edge of outEdges) {
    if (edge.toId === targetId) return true
    if (visited.has(edge.toId)) continue

    visited.add(edge.toId)
    if (canReach(edge.toId, targetId, graph, maxHops - 1, visited)) {
      return true
    }
  }

  return false
}
