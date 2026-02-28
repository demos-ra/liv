// [F-memory/R1/C1] diffuse — the only read primitive
// R1: pure function. Zero I/O. Enforces finite energy invariant: Σ a_i = 1.
// Priority queue frontier expansion. Cost = O(STEPS × frontier × MAX_DEGREE).
// Depends: R0 only.

import {
  STEPS,
  GLOBAL_DECAY,
  MIN_ACTIVATION,
  COMPETITION_BETA,
  BACKBONE_CONCEPTS,
} from '../config/memory-config'
import type { MemGraph } from '../config/memory-types'

/**
 * Diffuse activation from seed nodes through the graph.
 * Returns final activation map (nodeId → activation level).
 * Finite energy: Σ activations = 1 throughout.
 *
 * Pipeline per step:
 *   1. Pop highest-activation node
 *   2. Flow to neighbors weighted by edge weight / total out-weight
 *   3. Apply persistence for episode nodes
 *   4. Lateral inhibition: subtract COMPETITION_BETA × mean from all nodes
 *   5. Prune below MIN_ACTIVATION
 *   6. Renormalize: Σ a_i = 1
 */
export function diffuse(
  graph: MemGraph,
  seed: Map<string, number>
): Map<string, number> {
  // Step 1: normalize seed to sum = 1 (energy conservation)
  let activation = normalizeSeed(seed)

  // Seed backbone concepts at their current graph weight (always present)
  for (const conceptText of BACKBONE_CONCEPTS) {
    // Backbone concepts keyed by text — if present in graph, boost
    for (const [nodeId, node] of graph.nodes) {
      if (node.type === 'concept' && nodeId === conceptText) {
        const current = activation.get(nodeId) ?? 0
        // Seed at base level if not already activated
        if (current < 0.01) {
          activation.set(nodeId, 0.01)
        }
      }
    }
  }

  // Renormalize after backbone injection
  activation = renormalize(activation)

  // Run STEPS of frontier expansion
  for (let step = 0; step < STEPS; step++) {
    const next = new Map<string, number>()

    // Copy current activations into next (carried forward)
    for (const [nodeId, a] of activation) {
      next.set(nodeId, (next.get(nodeId) ?? 0) + a * 0.1)  // 10% self-retention
    }

    // Sort by activation descending — process highest first (priority queue approx)
    const frontier = Array.from(activation.entries()).sort((a, b) => b[1] - a[1])

    for (const [nodeId, nodeActivation] of frontier) {
      const outEdges = graph.edges.get(nodeId) ?? []
      if (outEdges.length === 0) continue

      const totalOutWeight = outEdges.reduce((sum, e) => sum + e.weight, 0)
      if (totalOutWeight === 0) continue

      for (const edge of outEdges) {
        const neighbor = graph.nodes.get(edge.toId)
        if (!neighbor) continue

        let flow = nodeActivation * (edge.weight / totalOutWeight) * GLOBAL_DECAY

        // Episode nodes attenuate by persistence (transient concepts fade faster)
        if (neighbor.type === 'episode') {
          flow *= neighbor.persistence
        }

        next.set(edge.toId, (next.get(edge.toId) ?? 0) + flow)
      }
    }

    // Lateral inhibition: subtract COMPETITION_BETA × mean_activation from all nodes
    // This prevents hub monopoly — energy is truly contested
    const values = Array.from(next.values())
    const mean = values.reduce((s, v) => s + v, 0) / (values.length || 1)
    const inhibition = COMPETITION_BETA * mean

    for (const [nodeId, a] of next) {
      const inhibited = a - inhibition
      if (inhibited < MIN_ACTIVATION) {
        next.delete(nodeId)
      } else {
        next.set(nodeId, inhibited)
      }
    }

    // Renormalize: enforce Σ a_i = 1
    activation = renormalize(next)
  }

  return activation
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeSeed(seed: Map<string, number>): Map<string, number> {
  const result = new Map<string, number>()
  if (seed.size === 0) return result

  let total = 0
  for (const v of seed.values()) {
    if (v > 0) total += v
  }

  if (total === 0) return result

  for (const [k, v] of seed) {
    if (v > 0) result.set(k, v / total)
  }
  return result
}

function renormalize(map: Map<string, number>): Map<string, number> {
  const result = new Map<string, number>()
  let total = 0
  for (const v of map.values()) total += v
  if (total === 0) return result
  for (const [k, v] of map) {
    result.set(k, v / total)
  }
  return result
}
