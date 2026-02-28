// [F-memory/R2/C2] Memory service — orchestration layer
// R2: depends R0, R1, R4. Never imports R3.
// Two primitives: remember() (write path), recall() (read path).
// remember() is always async after stream — never blocks recall.
// recall() is on the critical path — embedding fires once here only.

import { readFileSync } from 'fs'
import { join }         from 'path'

import {
  BACKBONE_CONCEPTS,
  CONCEPT_PROMOTE_AT,
  PERSISTENCE_HIGH,
  PERSISTENCE_LOW,
} from '../config/memory-config'
import type { MemGraph, MemEvent, MemoryVitalSigns } from '../config/memory-types'
import { MEMORY_EVENTS } from '../config/memory-events'

import { extractConcepts, derivePersistence, computeUtility, cosine } from '../domain/memory-concepts'
import { applyEvent }    from '../domain/memory-event'
import { diffuse }       from '../domain/memory-diffusion'
import { decayStructure } from '../domain/memory-decay'

import {
  upsertCandidate,
  upsertVocab,
  lookupVocab,
  commitMutation,
  loadGraph as repoLoadGraph,
} from '../exec/memory-repository'
import { embed }     from '../exec/embedding-service'
import { saveEdges } from '../exec/graph-persistence'

import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Module-level in-memory state ────────────────────────────────────────────
// Graph is the single source of truth. Loaded from DB on boot, kept warm.

let _graph: MemGraph = { nodes: new Map(), edges: new Map() }
let _sessionActivation: Map<string, number> | null = null

// ─── onBoot ───────────────────────────────────────────────────────────────────

/**
 * Called once at server start, after DB is verified.
 * 1. Run migration (idempotent)
 * 2. Load graph from Postgres
 * 3. Apply wall-clock decay pass
 * 4. Seed backbone concepts
 * 5. Emit SESSION_STARTED
 */
export async function onBoot(): Promise<void> {
  // 1. Run migration
  try {
    const sql = readFileSync(
      join(process.cwd(), 'src/exec/migrations/001-memory.sql'),
      'utf-8'
    )
    // Execute each statement separately (split on semicolons)
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    const { db } = await import('@/core/db/client')
    for (const stmt of statements) {
      await db.query(stmt, [])
    }
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.boot.migration-failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    throw err
  }

  // 2. Load graph
  _graph = await repoLoadGraph()

  // 3. Apply one decay pass for edges not touched since last session
  const allEdges = Array.from(_graph.edges.values()).flat()
  const decayed  = decayStructure(allEdges)

  // Rebuild edge map from decayed edges
  const edgeMap = new Map<string, typeof decayed>()
  for (const edge of decayed) {
    const list = edgeMap.get(edge.fromId) ?? []
    list.push(edge)
    edgeMap.set(edge.fromId, list)
  }
  _graph.edges = edgeMap

  // 4. Seed backbone concepts at PERSISTENCE_HIGH
  for (const text of BACKBONE_CONCEPTS) {
    if (!_graph.nodes.has(text)) {
      let embedding: number[] | undefined
      try { embedding = await embed(text) } catch { /* backbone gets no embedding if provider down */ }

      await upsertVocab(text, text, embedding ?? [], PERSISTENCE_HIGH)
      _graph.nodes.set(text, {
        id: text, type: 'concept',
        persistence: PERSISTENCE_HIGH,
        embedding,
      })
    }
  }

  // 5. Emit SESSION_STARTED
  await emitEvent({ type: MEMORY_EVENTS.SESSION_STARTED, payload: {} })

  console.log(JSON.stringify({
    level: 'info', event: 'memory.boot.complete',
    nodeCount: _graph.nodes.size,
    edgeCount: Array.from(_graph.edges.values()).flat().length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── remember ─────────────────────────────────────────────────────────────────

/**
 * Write path. Fires async after stream completes — never blocks recall.
 * 1. Extract concepts from text
 * 2. Upsert candidates; promote if count >= CONCEPT_PROMOTE_AT
 * 3. Build MemEvent with mean embedding of promoted concepts
 * 4. applyEvent → GraphMutation → commit atomically
 * 5. Update in-memory graph cache
 * 6. Emit NODE_WRITTEN
 */
export async function remember(text: string, sessionId: string): Promise<void> {
  const concepts = extractConcepts(text)
  if (concepts.length === 0) return

  const promotedIds: string[] = []
  const embeddings:  number[][] = []

  for (const concept of concepts) {
    try {
      const count = await upsertCandidate(concept)

      if (count >= CONCEPT_PROMOTE_AT) {
        // Check if already in vocab
        let node = await lookupVocab(concept)

        if (!node) {
          // Promote: embed once, write to vocab + graph
          const embedding = await embed(concept)
          const id = concept  // use text as id — deduplication is by text
          const persistence = derivePersistence()

          await upsertVocab(id, concept, embedding, persistence)
          node = { id, type: 'concept', persistence, embedding }
          _graph.nodes.set(id, node)
        }

        promotedIds.push(node.id)
        if (node.embedding) embeddings.push(node.embedding)
      }
    } catch (err) {
      console.error(JSON.stringify({
        level: 'error', event: 'memory.remember.concept-failed',
        concept, error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      }))
    }
  }

  if (promotedIds.length === 0) return

  // Mean embedding of this event's concepts
  const dim = embeddings[0]?.length ?? 0
  const incomingEmbedding = dim === 0
    ? []
    : embeddings.reduce(
        (acc, e) => acc.map((v, i) => v + e[i]),
        new Array<number>(dim).fill(0)
      ).map((v) => v / embeddings.length)

  const event: MemEvent = {
    timestamp:         Date.now(),
    concepts:          promotedIds,
    episodeId:         `ep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    incomingEmbedding,
  }

  const mutation = applyEvent(_graph, event, _sessionActivation)
  await commitMutation(mutation)

  // Update in-memory graph
  for (const node of mutation.nodeUpserts) {
    _graph.nodes.set(node.id, node)
  }
  for (const edge of mutation.edgeUpserts) {
    const list = _graph.edges.get(edge.fromId) ?? []
    const idx  = list.findIndex((e) => e.toId === edge.toId)
    if (idx >= 0) list[idx] = edge
    else list.push(edge)
    _graph.edges.set(edge.fromId, list)
  }
  for (const edgeId of mutation.edgeDeletes) {
    const [fromId, toId] = edgeId.split(':')
    if (!fromId || !toId) continue
    const list = _graph.edges.get(fromId) ?? []
    _graph.edges.set(fromId, list.filter((e) => e.toId !== toId))
  }

  await emitEvent({ type: MEMORY_EVENTS.NODE_WRITTEN, payload: { sessionId, conceptCount: promotedIds.length } })
}

// ─── recall ───────────────────────────────────────────────────────────────────

/**
 * Read path. On the critical path — embedding fires once here.
 * 1. Extract concepts from query (no promotion)
 * 2. Build seed map: conceptId → cosine(queryEmbedding, conceptEmbedding)
 * 3. diffuse(graph, seed)
 * 4. Top-K activated nodes → format context string
 * 5. Update _sessionActivation
 * 6. Emit RECALL_FIRED
 */
export async function recall(query: string): Promise<string> {
  const concepts = extractConcepts(query)

  let queryEmbedding: number[] = []
  try {
    queryEmbedding = await embed(query)
  } catch {
    return ''  // embedding provider down — fail silent, chat continues
  }

  const seed = new Map<string, number>()

  for (const concept of concepts) {
    const node = await lookupVocab(concept).catch(() => null)
    if (!node?.embedding) continue
    const sim = cosine(queryEmbedding, node.embedding)
    if (sim > 0) seed.set(node.id, sim)
  }

  if (seed.size === 0) return ''

  const activation = diffuse(_graph, seed)

  // Update session activation state
  _sessionActivation = activation

  // Top-K activated nodes → context string
  const TOP_K = 8
  const topNodes = Array.from(activation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_K)

  const contextLines: string[] = []
  for (const [nodeId, score] of topNodes) {
    const node = _graph.nodes.get(nodeId)
    if (!node) continue
    if (node.type === 'concept') {
      contextLines.push(`[${(score * 100).toFixed(1)}%] concept: ${nodeId}`)
    }
  }

  const context = contextLines.join('\n')

  await emitEvent({ type: MEMORY_EVENTS.RECALL_FIRED, payload: { query, nodeCount: topNodes.length } })

  return context
}

// ─── onSessionEnd ─────────────────────────────────────────────────────────────

/**
 * Called on SESSION_EXPIRED event.
 * 1. decayStructure on all edges → commit to Postgres
 * 2. computeVitalSigns → log
 * 3. Clear session activation
 * 4. Emit SESSION_ENDED
 */
export async function onSessionEnd(): Promise<void> {
  const allEdges = Array.from(_graph.edges.values()).flat()
  const survived = decayStructure(allEdges)

  await saveEdges(survived)

  // Rebuild graph edge map
  const edgeMap = new Map<string, typeof survived>()
  for (const edge of survived) {
    const list = edgeMap.get(edge.fromId) ?? []
    list.push(edge)
    edgeMap.set(edge.fromId, list)
  }
  _graph.edges = edgeMap

  const vitals = computeVitalSigns()
  console.log(JSON.stringify({
    level: 'info', event: 'memory.session-end.vitals',
    vitals, timestamp: new Date().toISOString(),
  }))

  _sessionActivation = null

  await emitEvent({ type: MEMORY_EVENTS.SESSION_ENDED, payload: { vitals } })
}

// ─── computeVitalSigns ────────────────────────────────────────────────────────

/**
 * Pure read of in-memory graph. No DB call.
 * Returns all 7 vital sign metrics.
 */
export function computeVitalSigns(): MemoryVitalSigns {
  const activation = _sessionActivation ?? new Map<string, number>()
  const allEdges   = Array.from(_graph.edges.values()).flat()

  // VS1: Activation entropy
  const activationValues = Array.from(activation.values())
  const totalA = activationValues.reduce((s, v) => s + v, 0) || 1
  const activationEntropy = -activationValues.reduce((h, v) => {
    const p = v / totalA
    return h + (p > 0 ? p * Math.log(p) : 0)
  }, 0)

  const maxA = Math.max(...activationValues, 0)
  const top1ActivationRatio = totalA > 0 ? maxA / totalA : 0

  // VS2: Degree distribution
  const degreeCounts = new Map<string, number>()
  for (const [fromId, edges] of _graph.edges) {
    degreeCounts.set(fromId, edges.length)
  }
  const degrees = Array.from(degreeCounts.values())
  const meanDegree = degrees.length === 0
    ? 0
    : degrees.reduce((s, v) => s + v, 0) / degrees.length

  const sorted = [...degrees].sort((a, b) => a - b)
  const p95idx  = Math.floor(sorted.length * 0.95)
  const p95Degree = sorted[p95idx] ?? 0

  // VS3: Weight distribution
  const saturationRatio = allEdges.length === 0
    ? 0
    : allEdges.filter((e) => e.weight > 0.9).length / allEdges.length

  // VS4: Identity cohesion — backbone edge density
  const backboneIds = Array.from(BACKBONE_CONCEPTS)
  let backboneEdges = 0
  const possibleBackboneEdges = backboneIds.length * (backboneIds.length - 1)
  for (const fromId of backboneIds) {
    const edges = _graph.edges.get(fromId) ?? []
    for (const edge of edges) {
      if (backboneIds.includes(edge.toId as typeof BACKBONE_CONCEPTS[number])) {
        backboneEdges++
      }
    }
  }
  const identityDensity = possibleBackboneEdges === 0
    ? 0
    : backboneEdges / possibleBackboneEdges

  // VS5: Utility-weight correlation (Pearson)
  // Approximate: use activation as proxy for utility of endpoint
  let utilityCorrelation = 0
  if (allEdges.length > 1 && activation.size > 0) {
    const weights    = allEdges.map((e) => e.weight)
    const utilities  = allEdges.map((e) => activation.get(e.toId) ?? 0)
    utilityCorrelation = pearson(weights, utilities)
  }

  return {
    activationEntropy,
    top1ActivationRatio,
    meanDegree,
    p95Degree,
    saturationRatio,
    identityDensity,
    utilityCorrelation,
  }
}

// ─── Pearson correlation helper ───────────────────────────────────────────────

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n === 0) return 0
  const mx = xs.reduce((s, v) => s + v, 0) / n
  const my = ys.reduce((s, v) => s + v, 0) / n
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  const denom = Math.sqrt(dx2) * Math.sqrt(dy2)
  return denom === 0 ? 0 : num / denom
}
