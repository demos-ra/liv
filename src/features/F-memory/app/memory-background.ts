// @liv-standard v1.3
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1, A2-event-bus-r3
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  MemGraph         F-memory/R0
//   W-ATOM  DominanceEntry   F-memory/R0
//   W-ATOM  MEMORY_CONFIG    F-memory/R0
//   W-ATOM  MEMORY_EVENTS    F-memory/R0
//   W-INJECT getGraph, getUserGraph, getDominanceMap, setDominanceMap  F-memory/R2 (memory-service)
//   W-INJECT persistDominance  F-memory/R4 (memory-graph-io)
//   W-INJECT emitEvent        F-event-system/R3
// wires-out:  none
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-events
//   R2  ./memory-service
//   R4  ../exec/memory-graph-io
//   R3  @/features/F-event-system/contract/event-bus (A2-event-bus-r3)
// validated:  pending

// Living Memory v1.1 — background dominance recomputation.
// R2: orchestration. Async, eventually consistent.
// §6: one background process — recomputeDominance().
// Detects M1→M0 transitions via random walk convergence analysis.
// Acceptable latency because M0 transitions are rare.
//
// lm-v1.1 changes (Amendment 3):
//   recomputeDominance: +userId param. null = global graph, string = per-user graph.
//   Caller (startup/cron) dispatches per scope. This function accepts the scope.

import type {
  MemGraph,
  DominanceEntry,
} from '../config/memory-types'
import { MEMORY_CONFIG } from '../config/memory-types'
import { MEMORY_EVENTS } from '../config/memory-events'

import { getGraph, getUserGraph, getDominanceMap, setDominanceMap } from './memory-service'
import { persistDominance } from '../exec/memory-graph-io'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Recompute Dominance ──────────────────────────────────────────────────────
// §6: async random walk convergence analysis.
// For each node: start N random walks, count how many converge back to this node.
// High convergence → attractor (M0 candidate).
//
// Called periodically (not on every traversal — too expensive).
// Results written to dominance cache, read by computeLayer() on next traversal.
//
// Amendment 3: +userId param. null = global graph, string = per-user (A4).

export async function recomputeDominance(userId: string | null): Promise<void> {
  // Amendment 3: select graph by scope
  const graph = userId === null ? getGraph() : getUserGraph(userId)
  if (graph.nodes.size === 0) return

  const now = Date.now()
  const entries: DominanceEntry[] = []
  const nodeIds = Array.from(graph.nodes.keys())

  for (const nodeId of nodeIds) {
    const convergence = computeNodeConvergence(nodeId, graph, nodeIds)
    entries.push({
      nodeId,
      convergence,
      computedAt: now,
    })
  }

  // Update in-memory dominance map (global only — per-user dominance stored in UserGraphState)
  if (userId === null) {
    const newMap = new Map<string, DominanceEntry>()
    for (const entry of entries) {
      newMap.set(entry.nodeId, entry)
    }
    setDominanceMap(newMap)
  }

  // Persist to DB — Amendment 3: scoped (A4)
  const result = await persistDominance(entries, userId)
  if (!result.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.dominance.persist-failed',
      error: result.error.message,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  await emitEvent({
    type: MEMORY_EVENTS.DOMINANCE_UPDATED,
    payload: { nodeCount: entries.length },
    slice: 'F-memory',
  })

  console.log(JSON.stringify({
    level: 'info', event: 'memory.dominance.recomputed',
    nodeCount: entries.length,
    scope: userId ?? 'global',
    timestamp: new Date().toISOString(),
  }))
}

// ─── Random walk convergence ──────────────────────────────────────────────────
// For a given node: start DOMINANCE_WALKS random walks from random starting nodes.
// Each walk runs DOMINANCE_WALK_STEPS steps following weighted edges.
// Convergence = fraction of walks that visit this node.
//
// High convergence → the graph "wants" to flow through this node → attractor.

function computeNodeConvergence(
  targetId: string,
  graph: MemGraph,
  allNodeIds: string[],
): number {
  if (allNodeIds.length <= 1) return 1.0

  const { DOMINANCE_WALKS, DOMINANCE_WALK_STEPS } = MEMORY_CONFIG
  let hits = 0

  for (let w = 0; w < DOMINANCE_WALKS; w++) {
    // Start from a deterministic "random" node (seeded by walk index)
    const startIdx = (simpleHash(targetId + w) & 0x7FFFFFFF) % allNodeIds.length
    let currentId = allNodeIds[startIdx]

    for (let step = 0; step < DOMINANCE_WALK_STEPS; step++) {
      if (currentId === targetId) {
        hits++
        break
      }

      const outEdges = graph.edges.get(currentId) ?? []
      if (outEdges.length === 0) break

      // Weighted random selection (deterministic via hash)
      const totalWeight = outEdges.reduce((s, e) => s + e.weight, 0)
      if (totalWeight <= 0) break

      const hashVal = simpleHash(targetId + w + step + currentId)
      let target = (Math.abs(hashVal) % 10000) / 10000 * totalWeight
      let nextId = outEdges[outEdges.length - 1].toId

      for (const edge of outEdges) {
        target -= edge.weight
        if (target <= 0) {
          nextId = edge.toId
          break
        }
      }

      currentId = nextId
    }
  }

  return hits / DOMINANCE_WALKS
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}
