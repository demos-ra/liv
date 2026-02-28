// [F-memory/R4/C5] Graph persistence — load on boot, save edges on session_end
// R4: I/O only. Thin wrappers that compose repository calls.
// Depends: R0, R4/memory-repository, R5 (db via repository).

import type { MemGraph, MemEdge } from '../config/memory-types'
import { loadGraph as repoLoadGraph, upsertEdge, deleteEdge } from './memory-repository'

/**
 * Load the full graph from Postgres on boot.
 * Called once by memory-service.onBoot().
 */
export async function loadGraph(): Promise<MemGraph> {
  return repoLoadGraph()
}

/**
 * Persist the post-decay edge list to Postgres on session_end.
 * Overwrites all edges for affected nodes.
 * Called by memory-service.onSessionEnd() after decayStructure runs.
 */
export async function saveEdges(edges: MemEdge[]): Promise<void> {
  // Upsert all surviving edges with updated weights
  for (const edge of edges) {
    await upsertEdge(edge)
  }
}
