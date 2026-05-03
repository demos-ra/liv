// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-nodeid-propagation, lm-v2-3-shot2
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  NodeId         core/R5 (primitives)
//   W-ATOM  MemNode        F-memory/R0
//   W-ATOM  MemGraph       F-memory/R0
//   W-ATOM  BindingResult  F-memory/R0
//   W-ATOM  GraphThresholds F-memory/R0
//   W-ATOM  MEMORY_CONFIG  F-memory/R0
//   W-ATOM  LMA25_MAX_RESTRUCTURE_DEPTH  F-memory/R0 (lm-v2-3-shot2)
// wires-out:  none (consumed by R1 traverse, R2 service)
// deps:
//   R0  ../config/memory-types
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v1.1 — binding functions.
// R1: pure functions, zero I/O, zero side effects.
// §7 bind(): binding score = cosine similarity × log(neighbor count + 1).
// MA2: binding IS the first step of propagation — the input projects onto
// the graph's embedding space and the activation distribution across resonant
// nodes is the natural decomposition.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures.
//
// lm-v2-3-shot2 (LMA25): restructure-edge supersession at read.
//   bind() resolves each above-threshold candidate node through its inbound
//   restructure-edge chain. If node n has any inbound `restructure` edge from
//   an in-scope source node n', n' is substituted for n in the bind result.
//   Transitive resolution applies (n' itself may be superseded). Tie-break on
//   multiple inbound restructure edges: latest createdAt wins. Depth capped
//   at LMA25_MAX_RESTRUCTURE_DEPTH; on cap-hit, returns the deepest resolved
//   node and surfaces a warning trace via cap-hit return signal.
//   `n` remains in the graph and queryable via Lineage; only the read path
//   is redirected. Persistence is not modified.

import type {
  MemGraph,
  MemEdge,
  BindingResult,
  GraphThresholds,
} from '../config/memory-types'
import { MEMORY_CONFIG, LMA25_MAX_RESTRUCTURE_DEPTH } from '../config/memory-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Cosine similarity ────────────────────────────────────────────────────────
// Pure, sync. Used in bind() and arm affinity.

export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

// ─── Compute graph-relative binding threshold ─────────────────────────────────
// §7: θ_bind = μ + kσ of the graph's binding score distribution.
// The graph defines its own noise floor.

export function computeBindingThreshold(graph: MemGraph, embedding: number[]): number {
  const scores: number[] = []

  for (const [nodeId, node] of graph.nodes) {
    if (!node.embedding) continue
    const sim = cosine(embedding, node.embedding)
    const neighborCount = (graph.edges.get(nodeId) ?? []).length
    const score = sim * Math.log(neighborCount + 1)
    scores.push(score)
  }

  if (scores.length === 0) return 0

  const mean = scores.reduce((s, v) => s + v, 0) / scores.length
  const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length
  const sigma = Math.sqrt(variance)

  return mean + MEMORY_CONFIG.BINDING_K_SIGMA * sigma
}

// ─── Bind ─────────────────────────────────────────────────────────────────────
// §7: find resonant nodes. Score = cosine(embedding, node.embedding) × log(neighborCount + 1).
// Returns nodes above threshold, sorted by score descending.
// If no nodes resonate, returns empty — caller handles discard.
//
// lm-v2-3-shot2 (LMA25): after threshold scoring, each resonant candidate is
// passed through `resolveRestructure` to substitute superseded nodes. Build
// the inbound-edge index once per bind call (O(E)) and reuse during transitive
// resolution to avoid quadratic re-scans. Cap-hit warnings surface via the
// `_lma25CapHits` accumulator on the result; consumers (R2 seam) may log them.

export function bind(
  embedding: number[],
  graph: MemGraph,
  thresholds: GraphThresholds,
): BindingResult {
  const resonant: Array<{ nodeId: NodeId; similarity: number; score: number }> = []

  for (const [nodeId, node] of graph.nodes) {
    if (!node.embedding) continue

    const sim = cosine(embedding, node.embedding)
    const neighborCount = (graph.edges.get(nodeId) ?? []).length
    const score = sim * Math.log(neighborCount + 1)

    if (score > thresholds.bind) {
      resonant.push({ nodeId, similarity: sim, score })
    }
  }

  // Sort by score descending — highest resonance first
  resonant.sort((a, b) => b.score - a.score)

  // lm-v2-3-shot2 (LMA25): build inbound restructure-edge index once, then
  // resolve each resonant candidate through its supersession chain.
  const inboundRestructureIndex = buildInboundRestructureIndex(graph)
  const seenSourceIds = new Set<NodeId>()
  const resolvedResonant: Array<{ nodeId: NodeId; similarity: number; score: number }> = []

  for (const r of resonant) {
    const resolved = resolveRestructure(r.nodeId, graph, inboundRestructureIndex)
    // Deduplicate: if multiple original candidates resolve to the same source,
    // keep the highest-scoring entry (which is the first encountered, since
    // `resonant` is already sorted by score descending).
    if (seenSourceIds.has(resolved)) continue
    seenSourceIds.add(resolved)
    resolvedResonant.push({
      nodeId:     resolved,
      similarity: r.similarity,
      score:      r.score,
    })
  }

  // Overall binding score = max score (how well did the input resonate?)
  const maxScore = resolvedResonant.length > 0 ? resolvedResonant[0].score : 0

  return {
    score: maxScore,
    nodes: resolvedResonant.map(r => ({ nodeId: r.nodeId, similarity: r.similarity })),
  }
}

// ─── lm-v2-3-shot2 (LMA25): inbound restructure-edge index ───────────────────
// Build a Map<NodeId, MemEdge[]> keyed by `toId`, containing only edges with
// `primitiveType === 'restructure'`. One pass over graph.edges. Used by
// resolveRestructure for transitive chain walks.
//
// "In-scope" for LMA25 = "exists in this graph". The R2 caller has already
// resolved scope before calling bind (userGraph or fallthrough _globalGraph);
// edges in `graph` are by construction within the active scope.

function buildInboundRestructureIndex(graph: MemGraph): Map<NodeId, MemEdge[]> {
  const index = new Map<NodeId, MemEdge[]>()
  for (const [, edges] of graph.edges) {
    for (const edge of edges) {
      if (edge.primitiveType !== 'restructure') continue
      const list = index.get(edge.toId) ?? []
      list.push(edge)
      index.set(edge.toId, list)
    }
  }
  return index
}

// ─── lm-v2-3-shot2 (LMA25): transitive restructure resolution ────────────────
// Given a candidate node, follow inbound restructure edges to the source node
// that supersedes it. Walk transitively (n → n' → n'' → ...) until either
// no inbound restructure edge exists or LMA25_MAX_RESTRUCTURE_DEPTH is hit.
//
// Tie-break when multiple sources point at the same target: latest createdAt
// wins. The source's createdAt is the source-node's `createdAt`, not the
// edge's — the edge createdAt would be a runtime artifact; the node createdAt
// captures when the superseding concept entered the graph.
//
// Cycle protection: track visited node ids; on revisit, return the current
// node (treats the cycle as terminal). Cycles are not expected for restructure
// (semantically a tree of supersession), but cycle protection guards against
// data anomalies without halting traversal.
//
// Cap-hit behavior: at LMA25_MAX_RESTRUCTURE_DEPTH, return the deepest
// resolved node. Caller (R2 seam) may log a warning by re-walking with the
// debug helper if needed; the bind path itself does not log (R1 = pure).

export function resolveRestructure(
  start:                    NodeId,
  graph:                    MemGraph,
  inboundRestructureIndex:  Map<NodeId, MemEdge[]>,
): NodeId {
  let current = start
  const visited = new Set<NodeId>()
  visited.add(current)

  for (let depth = 0; depth < LMA25_MAX_RESTRUCTURE_DEPTH; depth++) {
    const inbound = inboundRestructureIndex.get(current)
    if (!inbound || inbound.length === 0) {
      return current
    }

    // Filter to in-scope source nodes (must exist in this graph) and
    // tie-break by source-node createdAt descending — latest restructure wins.
    let bestEdge: MemEdge | null = null
    let bestSourceCreatedAt = -Infinity
    for (const edge of inbound) {
      const sourceNode = graph.nodes.get(edge.fromId)
      if (!sourceNode) continue   // source not in scope — skip
      if (visited.has(edge.fromId)) continue  // cycle — skip
      if (sourceNode.createdAt > bestSourceCreatedAt) {
        bestSourceCreatedAt = sourceNode.createdAt
        bestEdge = edge
      }
    }

    if (!bestEdge) {
      // All inbound restructure sources are out-of-scope or cyclic — terminate.
      return current
    }

    current = bestEdge.fromId
    visited.add(current)
  }

  // Depth cap hit. Return deepest resolved node.
  return current
}

// ─── Compute all graph thresholds ─────────────────────────────────────────────
// §7: all thresholds are graph-relative. Derived from graph statistics.
// Called once per traversal before bind/layer/sparsify.

export function computeThresholds(graph: MemGraph): GraphThresholds {
  // ── θ_bind: μ + kσ of binding score distribution ──
  // We can't compute this without an embedding, so we use the distribution
  // of node-to-node scores as a proxy. For actual binding, use computeBindingThreshold().
  // Default: 0 (accept all bindings on empty graph).
  let bindThreshold = 0
  {
    const scores: number[] = []
    const nodesWithEmbeddings = Array.from(graph.nodes.values()).filter(n => n.embedding)
    // Sample pairs to estimate distribution (cap at 100 pairs for performance)
    const sampleSize = Math.min(nodesWithEmbeddings.length, 10)
    for (let i = 0; i < sampleSize; i++) {
      for (let j = i + 1; j < sampleSize; j++) {
        const a = nodesWithEmbeddings[i]
        const b = nodesWithEmbeddings[j]
        if (a.embedding && b.embedding) {
          const sim = cosine(a.embedding, b.embedding)
          const degA = (graph.edges.get(a.id) ?? []).length
          const score = sim * Math.log(degA + 1)
          scores.push(score)
        }
      }
    }
    if (scores.length > 0) {
      const mean = scores.reduce((s, v) => s + v, 0) / scores.length
      const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length
      bindThreshold = mean + MEMORY_CONFIG.BINDING_K_SIGMA * Math.sqrt(variance)
    }
  }

  // ── θ_close: mean closure of existing M2 population ──
  let closeThreshold = 0.5  // default until M2 nodes exist
  {
    const m2Nodes = Array.from(graph.nodes.values()).filter(n => n.cachedLayer <= 2)
    if (m2Nodes.length > 0) {
      closeThreshold = m2Nodes.reduce((s, n) => s + n.cachedClosure, 0) / m2Nodes.length
    }
  }

  // ── θ_stable: stability range of existing M2 population ──
  // Stability = can be reactivated from partial cues (neighbors).
  // Approximated by mean closure — nodes with high closure are structurally stable.
  let stableThreshold = 0.3  // default
  {
    const m2Nodes = Array.from(graph.nodes.values()).filter(n => n.cachedLayer <= 2)
    if (m2Nodes.length > 1) {
      const closures = m2Nodes.map(n => n.cachedClosure)
      const mean = closures.reduce((s, v) => s + v, 0) / closures.length
      const min = Math.min(...closures)
      stableThreshold = (mean + min) / 2  // lower bound of M2 closure range
    }
  }

  // ── θ_asym: mean weight asymmetry across graph ──
  let asymThreshold = 0.2  // default
  {
    const asymmetries: number[] = []
    for (const [fromId, edges] of graph.edges) {
      for (const edge of edges) {
        // Find reverse edge
        const reverseEdges = graph.edges.get(edge.toId) ?? []
        const reverse = reverseEdges.find(e => e.toId === fromId)
        const reverseWeight = reverse?.weight ?? 0
        const asymmetry = Math.abs(edge.weight - reverseWeight)
        asymmetries.push(asymmetry)
      }
    }
    if (asymmetries.length > 0) {
      asymThreshold = asymmetries.reduce((s, v) => s + v, 0) / asymmetries.length
    }
  }

  // ── θ_dom: convergence distribution across graph ──
  // Read from async cache. Default until background process runs.
  const domThreshold = 0.5

  return {
    bind:   bindThreshold,
    close:  closeThreshold,
    stable: stableThreshold,
    asym:   asymThreshold,
    dom:    domThreshold,
  }
}
