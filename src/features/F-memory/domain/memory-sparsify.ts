// @liv-standard v1.3
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  MemGraph       F-memory/R0
//   W-ATOM  GraphMutation  F-memory/R0
//   W-ATOM  MEMORY_CONFIG  F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v1.0 — sparsification.
// R1: pure function, zero I/O.
// §6/§7: two sub-operations within each traversal:
//   1. Edge pruning (post-traversal): edges below weight threshold removed.
//   2. Isolate removal: degree 0 after pruning → deleted.
// MA1: no hysteresis — conservation model prevents flicker.
// MA3: connectivity is persistence. Isolation is the only death.
// MA6: any node can be removed and the system re-equilibrates.

import type {
  MemGraph,
} from '../config/memory-types'
import { MEMORY_CONFIG } from '../config/memory-types'

// ─── Sparsify result ──────────────────────────────────────────────────────────
// Returns edges to delete and nodes to delete (isolated after pruning).

export type SparsifyResult = {
  edgeDeletes: Array<{ fromId: string; toId: string }>
  nodeDeletes: string[]
}

// ─── Sparsify ─────────────────────────────────────────────────────────────────
// §7: edge threshold is graph-relative — prune edges below fraction of
// mean outgoing weight from the same node.
// Then: any node with degree 0 is deleted (MA3: isolation is death).
// Does not mutate the graph — returns the mutation set for atomic commit (G3).

export function sparsify(graph: MemGraph): SparsifyResult {
  const edgeDeletes: Array<{ fromId: string; toId: string }> = []
  const pruneFraction = MEMORY_CONFIG.EDGE_PRUNE_FRACTION

  // Track which nodes still have edges after pruning
  const hasEdgeAfterPrune = new Set<string>()

  // ── Edge pruning ────────────────────────────────────────────────────────────
  // For each node: compute mean outgoing weight, prune edges below fraction × mean.
  for (const [fromId, edges] of graph.edges) {
    if (edges.length === 0) continue

    const meanWeight = edges.reduce((s, e) => s + e.weight, 0) / edges.length
    const threshold = pruneFraction * meanWeight

    for (const edge of edges) {
      if (edge.weight < threshold) {
        edgeDeletes.push({ fromId: edge.fromId, toId: edge.toId })
      } else {
        // This edge survives — both endpoints have connectivity
        hasEdgeAfterPrune.add(edge.fromId)
        hasEdgeAfterPrune.add(edge.toId)
      }
    }
  }

  // Also count incoming edges for nodes that aren't sources
  // (a node might only have incoming edges and no outgoing)
  for (const [, edges] of graph.edges) {
    for (const edge of edges) {
      // Check if this edge survives
      const isPruned = edgeDeletes.some(
        d => d.fromId === edge.fromId && d.toId === edge.toId
      )
      if (!isPruned) {
        hasEdgeAfterPrune.add(edge.toId)
      }
    }
  }

  // ── Isolate removal ─────────────────────────────────────────────────────────
  // MA3: degree 0 after pruning → deleted. MA6: deletability.
  const nodeDeletes: string[] = []

  for (const [nodeId] of graph.nodes) {
    if (!hasEdgeAfterPrune.has(nodeId)) {
      // MA3: degree 0 after pruning → deleted.
      // MA6: no exceptions — even M0 nodes. If an M0 node becomes isolated,
      // the system re-equilibrates to a new attractor. In practice this won't
      // happen because M0 nodes have dense connectivity (that's what makes them M0).
      nodeDeletes.push(nodeId)
    }
  }

  return { edgeDeletes, nodeDeletes }
}
