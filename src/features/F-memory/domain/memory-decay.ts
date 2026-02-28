// [F-memory/R1/C1] decayStructure — structural cooling
// R1: pure function. Zero I/O. Runs on session_end only — never per-event.
// w ← w · (1 - λ)  for all edges. Deletes edges below MIN_EDGE_WEIGHT.
// Depends: R0 only.

import { STRUCTURAL_DECAY, MIN_EDGE_WEIGHT } from '../config/memory-config'
import type { MemEdge } from '../config/memory-types'

/**
 * Apply one decay pass to the full edge list.
 * Returns surviving edges only.
 * Called once per session boundary by memory-service.
 */
export function decayStructure(edges: MemEdge[]): MemEdge[] {
  const surviving: MemEdge[] = []

  for (const edge of edges) {
    const decayed = edge.weight * (1 - STRUCTURAL_DECAY)
    if (decayed >= MIN_EDGE_WEIGHT) {
      surviving.push({ ...edge, weight: decayed })
    }
    // edges below MIN_EDGE_WEIGHT are dropped — structural pruning
  }

  return surviving
}
