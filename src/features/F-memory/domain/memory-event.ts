// [F-memory/R1/C1] applyEvent — the only mutation primitive
// R1: pure function. Returns GraphMutation. Does not write to DB.
// Unified reinforcement rule: Δw = α · (a_i × a_j) · utility · (1 - w)
// Depends: R0 only.

import {
  BASE_ALPHA,
  MAX_DEGREE,
  PERSISTENCE_LOW,
} from '../config/memory-config'
import type { MemGraph, MemEvent, GraphMutation, MemNode, MemEdge } from '../config/memory-types'
import { computeUtility } from './memory-concepts'

// ─── applyEvent ───────────────────────────────────────────────────────────────

/**
 * Apply a MemEvent to the graph and return the full mutation.
 * Pure: reads graph, emits GraphMutation. R2 commits it.
 *
 * Pipeline:
 * 1. Compute utility (semantic contrast against session state)
 * 2. Create episode node
 * 3. Link episode → each concept, reinforce edges
 * 4. Link episode → previous episode (temporal chain)
 * 5. For each concept pair: reinforce co-activation edge
 * 6. Enforce MAX_DEGREE: drop weakest edge if cap exceeded
 */
export function applyEvent(
  graph: MemGraph,
  event: MemEvent,
  sessionActivation: Map<string, number> | null
): GraphMutation {
  const nodeUpserts: MemNode[] = []
  const edgeUpserts: MemEdge[] = []
  const edgeDeletes: string[]  = []

  const utility = computeUtility(sessionActivation, event.incomingEmbedding, graph)

  // ── Episode node ────────────────────────────────────────────────────────────
  const episodeNode: MemNode = {
    id:          event.episodeId,
    type:        'episode',
    persistence: PERSISTENCE_LOW,
    timestamp:   event.timestamp,
  }
  nodeUpserts.push(episodeNode)

  // Working copy of edges for MAX_DEGREE enforcement
  const edgeMap = buildEdgeMutableCopy(graph)

  // ── Episode → concept edges ─────────────────────────────────────────────────
  for (const conceptId of event.concepts) {
    const conceptNode = graph.nodes.get(conceptId)
    if (!conceptNode) continue

    const a_episode = 1.0  // episode just created — full plasticity
    const a_concept = sessionActivation?.get(conceptId) ?? 1.0
    const coactivation = a_episode * a_concept

    const existing = getEdge(edgeMap, event.episodeId, conceptId)
    const w = existing?.weight ?? 0
    const delta = BASE_ALPHA * coactivation * utility * (1 - w)
    const newWeight = Math.min(1, w + delta)

    const edge: MemEdge = { fromId: event.episodeId, toId: conceptId, weight: newWeight }
    edgeUpserts.push(edge)
    setEdge(edgeMap, edge)

    // Enforce MAX_DEGREE on episode node
    const dropped = enforceDegree(edgeMap, event.episodeId)
    edgeDeletes.push(...dropped)
  }

  // ── Episode chain: episode → previous episode ───────────────────────────────
  // Find the most recent episode before this one in the graph
  let prevEpisodeId: string | null = null
  let latestTs = -1
  for (const [id, node] of graph.nodes) {
    if (node.type === 'episode' && id !== event.episodeId) {
      const ts = node.timestamp ?? 0
      if (ts > latestTs) {
        latestTs = ts
        prevEpisodeId = id
      }
    }
  }

  if (prevEpisodeId) {
    const existing = getEdge(edgeMap, event.episodeId, prevEpisodeId)
    const w = existing?.weight ?? 0
    const delta = BASE_ALPHA * 1.0 * utility * (1 - w)
    const chainEdge: MemEdge = {
      fromId: event.episodeId,
      toId:   prevEpisodeId,
      weight: Math.min(1, w + delta),
    }
    edgeUpserts.push(chainEdge)
    setEdge(edgeMap, chainEdge)
  }

  // ── Concept pair co-activation ──────────────────────────────────────────────
  for (let i = 0; i < event.concepts.length; i++) {
    for (let j = i + 1; j < event.concepts.length; j++) {
      const idA = event.concepts[i]
      const idB = event.concepts[j]

      if (!graph.nodes.has(idA) || !graph.nodes.has(idB)) continue

      const a_a = sessionActivation?.get(idA) ?? 1.0
      const a_b = sessionActivation?.get(idB) ?? 1.0
      const coactivation = a_a * a_b

      // A → B
      const existingAB = getEdge(edgeMap, idA, idB)
      const wAB = existingAB?.weight ?? 0
      const deltaAB = BASE_ALPHA * coactivation * utility * (1 - wAB)
      const edgeAB: MemEdge = { fromId: idA, toId: idB, weight: Math.min(1, wAB + deltaAB) }
      edgeUpserts.push(edgeAB)
      setEdge(edgeMap, edgeAB)

      // B → A (symmetric)
      const existingBA = getEdge(edgeMap, idB, idA)
      const wBA = existingBA?.weight ?? 0
      const deltaBA = BASE_ALPHA * coactivation * utility * (1 - wBA)
      const edgeBA: MemEdge = { fromId: idB, toId: idA, weight: Math.min(1, wBA + deltaBA) }
      edgeUpserts.push(edgeBA)
      setEdge(edgeMap, edgeBA)

      // Enforce degree on both concept nodes
      edgeDeletes.push(...enforceDegree(edgeMap, idA))
      edgeDeletes.push(...enforceDegree(edgeMap, idB))
    }
  }

  return { nodeUpserts, edgeUpserts, edgeDeletes }
}

// ─── Edge map helpers ─────────────────────────────────────────────────────────

type EdgeMap = Map<string, Map<string, MemEdge>>  // fromId → toId → edge

function buildEdgeMutableCopy(graph: MemGraph): EdgeMap {
  const map: EdgeMap = new Map()
  for (const [fromId, edges] of graph.edges) {
    const inner = new Map<string, MemEdge>()
    for (const e of edges) {
      inner.set(e.toId, { ...e })
    }
    map.set(fromId, inner)
  }
  return map
}

function getEdge(map: EdgeMap, fromId: string, toId: string): MemEdge | undefined {
  return map.get(fromId)?.get(toId)
}

function setEdge(map: EdgeMap, edge: MemEdge): void {
  if (!map.has(edge.fromId)) map.set(edge.fromId, new Map())
  map.get(edge.fromId)!.set(edge.toId, edge)
}

function enforceDegree(map: EdgeMap, nodeId: string): string[] {
  const outgoing = map.get(nodeId)
  if (!outgoing || outgoing.size <= MAX_DEGREE) return []

  // Sort by weight ascending — drop weakest edges until at MAX_DEGREE
  const sorted = Array.from(outgoing.values()).sort((a, b) => a.weight - b.weight)
  const toRemove = sorted.slice(0, outgoing.size - MAX_DEGREE)
  const deleted: string[] = []

  for (const edge of toRemove) {
    outgoing.delete(edge.toId)
    deleted.push(`${edge.fromId}:${edge.toId}`)
  }

  return deleted
}
