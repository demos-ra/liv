// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, 4b-nodeid-propagation, lm-v2-3-shot2
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  NodeId          core/R5 (primitives)
//   W-ATOM  MemGraph        F-memory/R0
//   W-ATOM  MemEdge         F-memory/R0
//   W-ATOM  ActivationMap   F-memory/R0
//   W-ATOM  MLayer          F-memory/R0
//   W-ATOM  MEMORY_CONFIG   F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v1.1 — propagation and learning.
// R1: pure functions, zero I/O.
// §6 propagate(): conserved activation flow with M1 bias.
// §7 learn(): inline reinforcement — Δw = lr × flow × (1 - w/sum_outgoing).
// MA1: Σ activations = 1 throughout. Energy conserved, never created or destroyed.
// MA2: read, write, and learning are one pass.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures.
//
// lm-v1.1 changes:
//   learn() returns 6-field MemEdge (Amendment 1+3):
//     primitiveType: null (learning is sub-op, not a direct primitive)
//     createdAt: Date.now() (timestamp of the learning event)
//     userId: preserved from source edge (scope continuity)
//
// lm-v2-3-shot2 (LMA28): trust-weighted accumulation at commit.
//   propagate() and learn() accept τ (scalar derived from the writing node's
//   sourceAuthority by the R2 seam). τ multiplies the inline learning Δw
//   before the new edge weight is computed. τ = 1.0 reduces LMA28 to identity
//   (preserves v2.2 behavior). τ is constant within a single propagate()
//   invocation — one traversal, one τ. LMA12 preserved: τ is derived at
//   write, applied at write; not a function of elapsed wall-clock time.

import type {
  MemGraph,
  MemEdge,
  ActivationMap,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M1_PURPOSE,
} from '../config/memory-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Propagate ────────────────────────────────────────────────────────────────
// §7: spread activation through graph, biased by M1 field.
// MA1: conservation — Σ activations = 1 throughout.
// Top-K competition each step. Lateral inhibition preserved from v0.6.
//
// Returns: final activation map + edge mutations from inline learning.

export type PropagationResult = {
  activation:   ActivationMap
  edgeMutations: MemEdge[]   // edges reinforced by learn()
}

export function propagate(
  seed:  ActivationMap,
  graph: MemGraph,
  tau:   number = 1.0,   // lm-v2-3-shot2 (LMA28): trust scalar; default = identity
): PropagationResult {
  if (seed.size === 0) {
    return { activation: new Map(), edgeMutations: [] }
  }

  // Normalize seed to Σ = 1 (MA1: conservation)
  let activation = normalize(seed)
  const allEdgeMutations: MemEdge[] = []

  for (let step = 0; step < MEMORY_CONFIG.PROPAGATION_STEPS; step++) {
    const next = new Map<NodeId, number>()

    // Self-retention: 10% stays at current node
    for (const [nodeId, a] of activation) {
      next.set(nodeId, (next.get(nodeId) ?? 0) + a * 0.1)
    }

    // Flow to neighbors
    for (const [nodeId, nodeActivation] of activation) {
      const outEdges = graph.edges.get(nodeId) ?? []
      if (outEdges.length === 0) continue

      const totalOutWeight = outEdges.reduce((sum, e) => sum + effectiveWeight(e, graph), 0)
      if (totalOutWeight === 0) continue

      for (const edge of outEdges) {
        const effWeight = effectiveWeight(edge, graph)
        const flow = nodeActivation * 0.9 * (effWeight / totalOutWeight)

        next.set(edge.toId, (next.get(edge.toId) ?? 0) + flow)

        // §7 learn(): inline reinforcement — same pass as propagation (MA2)
        // lm-v2-3-shot2 (LMA28): thread τ into reinforcement Δw multiplication.
        const mutations = learn(edge, flow, graph, tau)
        allEdgeMutations.push(...mutations)
      }
    }

    // Lateral inhibition: subtract β × mean from all nodes (v0.6 survivor)
    const values = Array.from(next.values())
    if (values.length > 0) {
      const mean = values.reduce((s, v) => s + v, 0) / values.length
      const inhibition = MEMORY_CONFIG.COMPETITION_BETA * mean

      for (const [nodeId, a] of next) {
        const inhibited = a - inhibition
        if (inhibited <= 0) {
          next.delete(nodeId)
        } else {
          next.set(nodeId, inhibited)
        }
      }
    }

    // Top-K competition: keep only top K activated nodes per step
    activation = topK(next, MEMORY_CONFIG.TOP_K_ACTIVATION)

    // Renormalize: enforce Σ = 1 (MA1)
    activation = normalize(activation)
  }

  return { activation, edgeMutations: allEdgeMutations }
}

// ─── Learn (inline) ───────────────────────────────────────────────────────────
// §7: reinforcement inline with propagation.
// Δw = lr × flow × (1 - w / sum_outgoing)
// Self-regulating: strong edges learn slower, weak edges learn faster.
// Learning rate scales inversely with node degree (dense = stable, sparse = plastic).
//
// Amendment 1+3: returns 6-field MemEdge.
//   primitiveType: null — learning is sub-op, not a direct primitive (A6)
//   createdAt: Date.now() — timestamp of the learning event (A6)
//   userId: preserved from source edge — scope continuity (A6)
//
// lm-v2-3-shot2 (LMA28): τ-multiplied reinforcement.
//   Final Δw = base Δw × τ. τ = 1.0 reduces to v2.2 identity behavior.
//   τ is constant within a single propagate() invocation.

function learn(
  edge:  MemEdge,
  flow:  number,
  graph: MemGraph,
  tau:   number,
): MemEdge[] {
  if (flow <= 0) return []

  const fromNode = graph.nodes.get(edge.fromId)
  if (!fromNode) return []

  const outDegree = (graph.edges.get(edge.fromId) ?? []).length
  if (outDegree === 0) return []

  // Learning rate scales inversely with degree
  const lr = MEMORY_CONFIG.BASE_LEARNING_RATE / Math.sqrt(outDegree)

  // Sum of outgoing weights from this node
  const sumOutgoing = (graph.edges.get(edge.fromId) ?? [])
    .reduce((s, e) => s + e.weight, 0)

  // Self-regulating: (1 - w/sum) → strong edges learn slower
  const ratio = sumOutgoing > 0 ? edge.weight / sumOutgoing : 0
  // lm-v2-3-shot2 (LMA28): trust-weighted reinforcement.
  // base Δw = lr × flow × (1 - ratio); final Δw = base × τ.
  const delta = lr * flow * (1 - ratio) * tau

  if (Math.abs(delta) < 1e-8) return []

  const newWeight = Math.max(0, Math.min(1, edge.weight + delta))

  return [{
    fromId:        edge.fromId,
    toId:          edge.toId,
    weight:        newWeight,
    primitiveType: null,         // learning is sub-op, not a direct primitive (Amendment 1, A6)
    createdAt:     Date.now(),   // timestamp of the learning event (Amendment 1, A6)
    userId:        edge.userId,  // preserve scope from source edge (Amendment 3, A6)
  }]
}

// ─── Effective weight (M1 bias) ───────────────────────────────────────────────
// §7: w' = w × policy_bias(node)
// M1 nodes bias traversal via non-reciprocal weight asymmetry.
// policy_bias = 1 + asymmetry for M1 nodes, 1.0 for others.

function effectiveWeight(edge: MemEdge, graph: MemGraph): number {
  const targetNode = graph.nodes.get(edge.toId)
  if (!targetNode) return edge.weight

  let bias = 1.0

  // M1 purpose nodes amplify traversal toward them
  if (targetNode.cachedLayer <= M1_PURPOSE) {
    bias += targetNode.cachedAsymmetry
  }

  return edge.weight * bias
}

// ─── Top-K selection ──────────────────────────────────────────────────────────
// Hard cutoff. Nodes compete for activation each step.
// Recurrence across traversals protects persistent nodes.

function topK(map: ActivationMap, k: number): ActivationMap {
  if (map.size <= k) return map

  const entries = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)

  return new Map(entries)
}

// ─── Normalize ────────────────────────────────────────────────────────────────
// MA1: Σ activations = 1. Called after every mutation.

function normalize(map: ActivationMap): ActivationMap {
  if (map.size === 0) return map

  let total = 0
  for (const v of map.values()) total += v

  if (total === 0) return new Map()

  const result = new Map<NodeId, number>()
  for (const [k, v] of map) {
    result.set(k, v / total)
  }
  return result
}
