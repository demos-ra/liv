// @liv-standard v1.3
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-event-bus-r3
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  MemGraph          F-memory/R0
//   W-ATOM  MemNode           F-memory/R0
//   W-ATOM  MemEdge           F-memory/R0
//   W-ATOM  GraphMutation     F-memory/R0
//   W-ATOM  PresentState      F-memory/R0
//   W-ATOM  TraversalResult   F-memory/R0
//   W-ATOM  TraversalOptions  F-memory/R0
//   W-ATOM  MemArm            F-memory/R0
//   W-ATOM  DominanceEntry    F-memory/R0
//   W-ATOM  GraphThresholds   F-memory/R0
//   W-ATOM  MLayer            F-memory/R0
//   W-ATOM  MEMORY_CONFIG     F-memory/R0
//   W-ATOM  MEMORY_EVENTS     F-memory/R0
//   W-INJECT bind, computeThresholds         F-memory/R1 (memory-bind)
//   W-INJECT propagate                       F-memory/R1 (memory-traverse)
//   W-INJECT sparsify                        F-memory/R1 (memory-sparsify)
//   W-INJECT computeLayer, updateLayersLocally F-memory/R1 (memory-layer)
//   W-INJECT detectArms, detectArmMerges     F-memory/R1 (memory-arm)
//   W-INJECT computePresentState             F-memory/R1 (memory-present)
//   W-INJECT loadGraph, persistMutations, persistArms, touchTraversedNodes F-memory/R4 (memory-graph-io)
//   W-INJECT encode                          F-memory/R4 (embedding-service)
//   W-INJECT emitEvent                       F-event-system/R3
// wires-out:  none (consumed by R3 contract)
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-events
//   R1  ../domain/memory-bind
//   R1  ../domain/memory-traverse
//   R1  ../domain/memory-sparsify
//   R1  ../domain/memory-layer
//   R1  ../domain/memory-arm
//   R1  ../domain/memory-present
//   R4  ../exec/memory-graph-io
//   R4  ../exec/embedding-service
//   R3  @/features/F-event-system/contract/event-bus (A2-event-bus-r3: documented amendment)
// validated:  pending

// Living Memory v1.0 — orchestration service.
// R2: wires R1 pure functions + R4 I/O. The brain.
//
// §6: one operation — runTraversal(ping).
// MA2: read, write, and learning are one pass.
// G2: getPresentState() reads _cachedPresentState. Recomputed only inside runTraversal().
// G3: all mutations committed atomically via persistMutations().

import type {
  MemGraph,
  MemNode,
  MemEdge,
  MemArm,
  DominanceEntry,
  GraphMutation,
  GraphThresholds,
  PresentState,
  TraversalResult,
  TraversalOptions,
  ActivationMap,
  MLayer,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M3_CONTEXT,
  M4_INPUT,
} from '../config/memory-types'
import { MEMORY_EVENTS } from '../config/memory-events'

// R1 — pure functions
import { bind, computeThresholds } from '../domain/memory-bind'
import { propagate } from '../domain/memory-traverse'
import { sparsify } from '../domain/memory-sparsify'
import { updateLayersLocally } from '../domain/memory-layer'
import { detectArms, detectArmMerges } from '../domain/memory-arm'
import { computePresentState } from '../domain/memory-present'

// R4 — I/O
import { loadGraph, persistMutations, persistArms, touchTraversedNodes } from '../exec/memory-graph-io'
import { encode } from '../exec/embedding-service'

// R3 — event bus (A2-event-bus-r3: documented amendment, same as F-planner/F-output)
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

import type { Result } from '@/core/types/primitives'
import { generateId } from '@/core/types/primitives'

// ─── Module-level state ───────────────────────────────────────────────────────
// Graph is the single source of truth during runtime.
// Loaded from Postgres on boot, kept warm in memory.

let _graph: MemGraph = { nodes: new Map(), edges: new Map() }
let _arms: MemArm[] = []
let _dominanceMap: Map<string, DominanceEntry> = new Map()
let _cachedPresentState: PresentState = { statements: [] }
let _thresholds: GraphThresholds = { bind: 0, close: 0.5, stable: 0.3, asym: 0.2, dom: 0.5 }
let _booted = false

// ─── Boot ─────────────────────────────────────────────────────────────────────
// Called once at server start by F-event-system/startup.ts.

export async function onBoot(): Promise<void> {
  const loadResult = await loadGraph()
  if (!loadResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.boot.load-failed',
      error: loadResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — start with empty graph
    _graph = { nodes: new Map(), edges: new Map() }
    _arms = []
    _dominanceMap = new Map()
    _booted = true
    return
  }

  _graph = loadResult.data.graph
  _arms = loadResult.data.arms
  _dominanceMap = loadResult.data.dominanceMap

  // Compute initial thresholds from loaded graph
  _thresholds = computeThresholds(_graph)

  // Compute initial present state
  _cachedPresentState = computePresentState(_graph, _arms)

  _booted = true

  console.log(JSON.stringify({
    level: 'info', event: 'memory.boot.complete',
    nodeCount: _graph.nodes.size,
    edgeCount: Array.from(_graph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: _arms.length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── Run Traversal ────────────────────────────────────────────────────────────
// §6: the one operation. Handles read, write, and learning in one pass (MA2).
//
// Pipeline per §6 runTraversal(ping):
//   1. encode(ping) → embedding vector
//   2. bind(embedding, G) → find resonant nodes
//   3. if no binding → create new M4 node, return empty
//   4. connect → create edges to bound nodes
//   5. propagate → spread activation, inline learning
//   6. sparsify → top-K competition + edge prune + isolate removal
//   7. update_layers_locally → recompute layer for changed nodes
//   8. persist atomically (G3)
//   9. recompute Present State (G2: side effect of traversal only)
//  10. return → if read: return top-K activated nodes

export async function runTraversal(
  text: string,
  options: TraversalOptions = {},
): Promise<Result<TraversalResult | null>> {
  if (!_booted) {
    return { ok: false, error: { code: 'NOT_BOOTED', message: 'Memory service not initialized' } }
  }

  const now = Date.now()

  // ── Step 1: encode ──────────────────────────────────────────────────────────
  const encodeResult = await encode(text)
  if (!encodeResult.ok) {
    // Embedding provider down — fail graceful, return null
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.encode-failed',
      error: encodeResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return { ok: true, data: null }
  }
  const embedding = encodeResult.data

  // ── Step 2: bind ────────────────────────────────────────────────────────────
  const binding = bind(embedding, _graph, _thresholds)

  // Track all changed nodes for layer recomputation
  const changedNodeIds = new Set<string>()

  // Initialize mutation
  const mutation: GraphMutation = {
    nodeCreates:  [],
    edgeUpserts:  [],
    edgeDeletes:  [],
    nodeDeletes:  [],
    sourcePrunes: [],
    layerUpdates: [],
  }

  // ── Step 3: if no binding → create new M4 node ─────────────────────────────
  const newNodeId = generateId('mem')
  const newNode: MemNode = {
    id:              newNodeId,
    content:         text.slice(0, 500),  // cap content length
    embedding,
    sourceText:      text,
    createdAt:       now,
    lastTraversed:   now,
    cachedLayer:     M4_INPUT,
    cachedClosure:   0,
    cachedAsymmetry: 0,
  }
  mutation.nodeCreates.push(newNode)
  changedNodeIds.add(newNodeId)

  // Apply to in-memory graph immediately (needed for propagation)
  _graph.nodes.set(newNodeId, newNode)

  if (binding.nodes.length === 0) {
    // No resonance — persist the isolated node and return
    await commitAndUpdate(mutation, changedNodeIds, now)

    await emitEvent({
      type: MEMORY_EVENTS.NODE_CREATED,
      payload: { nodeId: newNodeId },
      slice: 'F-memory',
    })

    return { ok: true, data: null }
  }

  // ── Step 4: connect → create edges to bound nodes ───────────────────────────
  // §7 bind(): the activation distribution across resonant nodes is the
  // natural decomposition. One node, multiple edges, weights set by projection magnitude.
  for (const bound of binding.nodes) {
    const edge: MemEdge = {
      fromId: newNodeId,
      toId:   bound.nodeId,
      weight: Math.max(0.01, bound.similarity), // minimum edge weight
    }
    mutation.edgeUpserts.push(edge)
    changedNodeIds.add(bound.nodeId)

    // Apply to in-memory graph
    const outEdges = _graph.edges.get(newNodeId) ?? []
    outEdges.push(edge)
    _graph.edges.set(newNodeId, outEdges)
  }

  // New node now has edges → at least M3
  newNode.cachedLayer = M3_CONTEXT
  _graph.nodes.set(newNodeId, newNode)

  // ── Step 5: propagate → spread activation + inline learning ─────────────────
  const seed: ActivationMap = new Map()
  for (const bound of binding.nodes) {
    seed.set(bound.nodeId, bound.similarity)
  }
  // Also seed the new node
  seed.set(newNodeId, binding.score)

  const { activation, edgeMutations } = propagate(seed, _graph)

  // Collect edge mutations from learning
  for (const learnedEdge of edgeMutations) {
    mutation.edgeUpserts.push(learnedEdge)
    changedNodeIds.add(learnedEdge.fromId)
    changedNodeIds.add(learnedEdge.toId)

    // Apply to in-memory graph
    const outEdges = _graph.edges.get(learnedEdge.fromId) ?? []
    const idx = outEdges.findIndex(e => e.toId === learnedEdge.toId)
    if (idx >= 0) outEdges[idx] = learnedEdge
    else outEdges.push(learnedEdge)
    _graph.edges.set(learnedEdge.fromId, outEdges)
  }

  // ── Step 6: sparsify → edge prune + isolate removal ─────────────────────────
  const sparsifyResult = sparsify(_graph)

  for (const edgeDel of sparsifyResult.edgeDeletes) {
    mutation.edgeDeletes.push(edgeDel)
    changedNodeIds.add(edgeDel.fromId)
    changedNodeIds.add(edgeDel.toId)

    // Apply to in-memory graph
    const outEdges = _graph.edges.get(edgeDel.fromId) ?? []
    _graph.edges.set(edgeDel.fromId, outEdges.filter(e => e.toId !== edgeDel.toId))
  }

  for (const nodeId of sparsifyResult.nodeDeletes) {
    mutation.nodeDeletes.push(nodeId)
    _graph.nodes.delete(nodeId)
    _graph.edges.delete(nodeId)
  }

  // ── Step 7: update_layers_locally → recompute changed nodes ─────────────────
  const layerUpdates = updateLayersLocally(changedNodeIds, _graph, _thresholds, _dominanceMap)

  for (const update of layerUpdates) {
    const node = _graph.nodes.get(update.nodeId)
    if (!node) continue

    const oldLayer = node.cachedLayer

    // Check for M3→M2 transition: prune source text
    if (oldLayer >= M3_CONTEXT && update.layer <= 2) {
      mutation.sourcePrunes.push(update.nodeId)
      node.sourceText = null
    }

    mutation.layerUpdates.push(update)

    // Apply to in-memory graph
    node.cachedLayer = update.layer
    node.cachedClosure = update.closure
    node.cachedAsymmetry = update.asymmetry
    _graph.nodes.set(update.nodeId, node)

    // Emit layer change event
    if (oldLayer !== update.layer) {
      await emitEvent({
        type: MEMORY_EVENTS.LAYER_CHANGED,
        payload: { nodeId: update.nodeId, from: oldLayer, to: update.layer },
        slice: 'F-memory',
      })
    }
  }

  // ── Step 8: persist atomically (G3) ─────────────────────────────────────────
  await commitAndUpdate(mutation, changedNodeIds, now)

  // ── Step 9: recompute Present State (G2) ────────────────────────────────────
  // Recompute thresholds (graph may have changed significantly)
  _thresholds = computeThresholds(_graph)

  // Detect arms periodically (every traversal for now; optimize later)
  const newArms = detectArms(_graph)
  if (newArms.length !== _arms.length) {
    // Check for merges
    const merges = detectArmMerges(newArms, _graph)
    for (const merge of merges) {
      await emitEvent({
        type: MEMORY_EVENTS.ARM_MERGED,
        payload: {
          armIdA: newArms[merge.armIdxA]?.id,
          armIdB: newArms[merge.armIdxB]?.id,
          mergedId: newArms[merge.armIdxA]?.id,
        },
        slice: 'F-memory',
      })
    }

    // Detect new arms
    for (const arm of newArms) {
      const existed = _arms.some(a => a.id === arm.id)
      if (!existed) {
        await emitEvent({
          type: MEMORY_EVENTS.ARM_DETECTED,
          payload: { armId: arm.id, nodeCount: arm.nodeIds.length },
          slice: 'F-memory',
        })
      }
    }

    _arms = newArms
    await persistArms(_arms)
  }

  // Recompute present state
  _cachedPresentState = computePresentState(_graph, _arms)

  // Emit traversal complete
  await emitEvent({
    type: MEMORY_EVENTS.TRAVERSAL_COMPLETE,
    payload: {
      nodeCount: _graph.nodes.size,
      edgeCount: Array.from(_graph.edges.values()).reduce((s, e) => s + e.length, 0),
    },
    slice: 'F-memory',
  })

  // ── Step 10: return ─────────────────────────────────────────────────────────
  if (!options.returnActivation) {
    return { ok: true, data: null }
  }

  // Build TraversalResult from activation
  const topNodes = Array.from(activation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MEMORY_CONFIG.TOP_K_ACTIVATION)
    .map(([nodeId, score]) => {
      const node = _graph.nodes.get(nodeId)
      return {
        nodeId,
        content: node?.content ?? nodeId,
        score,
        layer: (node?.cachedLayer ?? M4_INPUT) as MLayer,
      }
    })

  return {
    ok: true,
    data: { activation, topNodes },
  }
}

// ─── Get Present State ────────────────────────────────────────────────────────
// G2: reads precomputed values only — never triggers recomputation.
// Called by R3 contract before every LLM call.

export function getPresentState(): PresentState {
  return _cachedPresentState
}

// ─── Get graph stats (for vital signs) ────────────────────────────────────────

export function getGraph(): MemGraph {
  return _graph
}

export function getArms(): MemArm[] {
  return _arms
}

export function getDominanceMap(): Map<string, DominanceEntry> {
  return _dominanceMap
}

export function setDominanceMap(map: Map<string, DominanceEntry>): void {
  _dominanceMap = map
}

// ─── Internal: commit mutation + touch traversed nodes ────────────────────────

async function commitAndUpdate(
  mutation: GraphMutation,
  changedNodeIds: Set<string>,
  timestamp: number,
): Promise<void> {
  const persistResult = await persistMutations(mutation)
  if (!persistResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.persist-failed',
      error: persistResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    // In-memory graph already updated — DB will catch up on next successful persist
    return
  }

  // Touch all activated nodes' last_traversed timestamp
  const touchResult = await touchTraversedNodes(Array.from(changedNodeIds), timestamp)
  if (!touchResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.touch-failed',
      error: touchResult.error.message,
      timestamp: new Date().toISOString(),
    }))
  }

  // Update in-memory last_traversed
  for (const nodeId of changedNodeIds) {
    const node = _graph.nodes.get(nodeId)
    if (node) {
      node.lastTraversed = timestamp
      _graph.nodes.set(nodeId, node)
    }
  }

  // Emit node-created events for new nodes
  for (const newNode of mutation.nodeCreates) {
    await emitEvent({
      type: MEMORY_EVENTS.NODE_CREATED,
      payload: { nodeId: newNode.id },
      slice: 'F-memory',
    })
  }

  // Emit source-pruned events
  for (const nodeId of mutation.sourcePrunes) {
    await emitEvent({
      type: MEMORY_EVENTS.SOURCE_PRUNED,
      payload: { nodeId },
      slice: 'F-memory',
    })
  }
}
