// @liv-standard v1.5.1
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, A2-event-bus-r3, w3-17-contract-ext, 6.1-global-seed, 4b-nodeid-propagation
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
//   W-ATOM  ScopedGraphSet    F-memory/R0
//   W-INJECT bind, computeThresholds         F-memory/R1 (memory-bind)
//   W-INJECT propagate                       F-memory/R1 (memory-traverse)
//   W-INJECT sparsify                        F-memory/R1 (memory-sparsify)
//   W-INJECT computeLayer, updateLayersLocally F-memory/R1 (memory-layer)
//   W-INJECT detectArms, detectArmMerges     F-memory/R1 (memory-arm)
//   W-INJECT computePresentState             F-memory/R1 (memory-present)
//   W-INJECT normalizeLabel                  F-memory/R1 (memory-label)
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
//   R1  ../domain/memory-label
//   R4  ../exec/memory-graph-io
//   R4  ../exec/embedding-service
//   R3  @/features/F-event-system/contract/event-bus (A2-event-bus-r3)
// validated:  pending

// Living Memory v1.1 — orchestration service.
// R2: wires R1 pure functions + R4 I/O. The brain.
//
// §6: one operation — runTraversal(text, userId, options).
// MA2: read, write, and learning are one pass.
// G2: getPresentState(userId) reads _userStates cache. Recomputed only inside runTraversal().
// G3: all mutations committed atomically via persistMutations().
//
// lm-v1.1 changes:
//   Module state: split to global (boot once) + per-user (lazy-loaded, keyed by userId)
//   onBoot(): loads global graph only (userId=null)
//   ensureUserLoaded(userId): lazy per-user graph load
//   runTraversal(text, userId, options):
//     - Fallthrough bind: user graph first, global graph if no resonance (Amendment 3)
//     - Bind-before-create: skip node creation if top match ≥ LABEL_REUSE_THRESHOLD (Amendment 2)
//     - normalizeLabel() on new node content (Amendment 2)
//     - 6-field edges: primitiveType + createdAt + userId (Amendments 1+3)
//     - Scoped persist: userId passed to all R4 calls
//   getPresentState(userId): per-user present state
//   getUserGraph(userId): per-user graph for vital signs

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
import { normalizeLabel } from '../domain/memory-label'

// R4 — I/O
import { loadGraph, persistMutations, persistArms, touchTraversedNodes } from '../exec/memory-graph-io'
import { encode } from '../exec/embedding-service'

// R3 — event bus (A2-event-bus-r3: documented amendment, same as F-planner/F-output)
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

import type { Result, NodeId } from '@/core/types/primitives'
import { generateId } from '@/core/types/primitives'

// ─── Module-level state ───────────────────────────────────────────────────────
// Amendment 3: split to global (boot once, shared read-only) + per-user (lazy).

// Global graph — loaded once on boot, shared read-only
let _globalGraph: MemGraph = { nodes: new Map(), edges: new Map() }
let _globalArms: MemArm[] = []
let _globalDominanceMap: Map<NodeId, DominanceEntry> = new Map()
let _globalThresholds: GraphThresholds = { bind: 0, close: 0.5, stable: 0.3, asym: 0.2, dom: 0.5 }
let _booted = false

// Per-user state — lazy-loaded, keyed by userId
type UserGraphState = {
  graph:        MemGraph
  arms:         MemArm[]
  dominanceMap: Map<NodeId, DominanceEntry>
  thresholds:   GraphThresholds
  presentState: PresentState
  loaded:       boolean
}
const _userStates = new Map<string, UserGraphState>()

// ─── Boot ─────────────────────────────────────────────────────────────────────
// Called once at server start by F-event-system/startup.ts.
// Amendment 3: loads global graph only (userId=null). Per-user graphs lazy-loaded.
// Idempotent: safe to call multiple times (early-exit if already booted).

export async function onBoot(): Promise<void> {
  if (_booted) return

  const loadResult = await loadGraph(null)
  if (!loadResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.boot.load-failed',
      error: loadResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — start with empty global graph
    _globalGraph = { nodes: new Map(), edges: new Map() }
    _globalArms = []
    _globalDominanceMap = new Map()
    _booted = true
    return
  }

  _globalGraph = loadResult.data.graph
  _globalArms = loadResult.data.arms
  _globalDominanceMap = loadResult.data.dominanceMap

  // Compute initial thresholds from global graph
  _globalThresholds = computeThresholds(_globalGraph)

  _booted = true

  console.log(JSON.stringify({
    level: 'info', event: 'memory.boot.complete',
    nodeCount: _globalGraph.nodes.size,
    edgeCount: Array.from(_globalGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: _globalArms.length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── Reload Global Graph ──────────────────────────────────────────────────────
// 6.1-global-seed: force-reload global graph from DB after batch seed.
// Unlike onBoot(), this bypasses the _booted idempotency guard.
// Admin-only. Called via R3 contract after seedAndTraverseGlobal completes.

export async function reloadGlobalGraph(): Promise<void> {
  const loadResult = await loadGraph(null)
  if (!loadResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.reload.load-failed',
      error: loadResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  _globalGraph = loadResult.data.graph
  _globalArms = loadResult.data.arms
  _globalDominanceMap = loadResult.data.dominanceMap
  _globalThresholds = computeThresholds(_globalGraph)

  // Invalidate all per-user present state caches so they recompute
  // with the updated global graph on next access
  for (const [userId, state] of _userStates) {
    state.presentState = computePresentState(
      { user: state.graph, global: _globalGraph },
      state.arms,
      _globalArms,
    )
  }

  console.log(JSON.stringify({
    level: 'info', event: 'memory.reload.complete',
    nodeCount: _globalGraph.nodes.size,
    edgeCount: Array.from(_globalGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: _globalArms.length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── Ensure User Loaded ───────────────────────────────────────────────────────
// Amendment 3: lazy per-user graph load. Returns UserGraphState, creates empty on failure.

async function ensureUserLoaded(userId: string): Promise<UserGraphState> {
  let state = _userStates.get(userId)
  if (state?.loaded) return state

  const result = await loadGraph(userId)

  if (!result.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.user-load.failed',
      userId,
      error: result.error.message,
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — start with empty user graph
    state = {
      graph:        { nodes: new Map(), edges: new Map() },
      arms:         [],
      dominanceMap: new Map(),
      thresholds:   { bind: 0, close: 0.5, stable: 0.3, asym: 0.2, dom: 0.5 },
      presentState: { statements: [] },
      loaded:       true,
    }
    _userStates.set(userId, state)
    return state
  }

  const graph = result.data.graph
  const arms = result.data.arms
  const dominanceMap = result.data.dominanceMap
  const thresholds = computeThresholds(graph)

  // Compute initial present state with scoped graph set
  const presentState = computePresentState(
    { user: graph, global: _globalGraph },
    arms,
    _globalArms,
  )

  state = {
    graph,
    arms,
    dominanceMap,
    thresholds,
    presentState,
    loaded: true,
  }
  _userStates.set(userId, state)
  return state
}

// ─── Run Traversal ────────────────────────────────────────────────────────────
// §6: the one operation. Handles read, write, and learning in one pass (MA2).
// Amendment 3: +userId param. All operations use per-user graph state.
//
// Pipeline per §6 runTraversal(text, userId, options):
//   1. encode(text) → embedding vector
//   2. bind(embedding, userGraph, userThresholds) → find resonant nodes
//   2a. FALLTHROUGH: if no resonance → bind(embedding, _globalGraph, _globalThresholds)
//   2b. BIND-BEFORE-CREATE: if top match ≥ LABEL_REUSE_THRESHOLD → reinforce, skip create
//   3. if no binding → create new M4 node (normalizeLabel), return empty
//   4. connect → create edges to bound nodes (6-field, scoped)
//   5. propagate → spread activation, inline learning
//   6. sparsify → top-K competition + edge prune + isolate removal
//   7. update_layers_locally → recompute layer for changed nodes
//   8. persist atomically (G3, scoped)
//   9. recompute Present State (G2: side effect of traversal only)
//  10. return → if read: return top-K activated nodes

export async function runTraversal(
  text: string,
  userId: string,
  options: TraversalOptions = {},
): Promise<Result<TraversalResult | null>> {
  // Turbopack module isolation: lazy-boot if needed
  if (!_booted) {
    await onBoot()
    if (!_booted) {
      return { ok: false, error: { code: 'NOT_BOOTED', message: 'Memory service not initialized' } }
    }
  }

  // Amendment 3: load per-user graph state
  const userState = await ensureUserLoaded(userId)
  const userGraph = userState.graph
  const userThresholds = userState.thresholds

  const now = Date.now()

  // ── Step 1: encode ──────────────────────────────────────────────────────────
  const encodeResult = await encode(text)
  if (!encodeResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.encode-failed',
      error: encodeResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return { ok: true, data: null }
  }
  const embedding = encodeResult.data

  // ── Step 2: bind ────────────────────────────────────────────────────────────
  let binding = bind(embedding, userGraph, userThresholds)

  // Amendment 3: FALLTHROUGH — if no resonance in user graph, try global graph
  // Fallthrough is read-only: global graph never mutated by user traversals (A6)
  let fallthroughUsed = false
  if (binding.nodes.length === 0) {
    binding = bind(embedding, _globalGraph, _globalThresholds)
    fallthroughUsed = binding.nodes.length > 0
  }

  // Track all changed nodes for layer recomputation
  const changedNodeIds = new Set<NodeId>()

  // Initialize mutation
  const mutation: GraphMutation = {
    nodeCreates:  [],
    edgeUpserts:  [],
    edgeDeletes:  [],
    nodeDeletes:  [],
    sourcePrunes: [],
    layerUpdates: [],
  }

  // ── Step 2b: bind-before-create (Amendment 2) ──────────────────────────────
  // If top match similarity ≥ LABEL_REUSE_THRESHOLD, skip node creation.
  // Reinforce existing node instead of creating a duplicate.
  const topMatch = binding.nodes.length > 0 ? binding.nodes[0] : null
  const skipCreate = topMatch !== null && topMatch.similarity >= MEMORY_CONFIG.LABEL_REUSE_THRESHOLD

  let activeNodeId: NodeId

  if (skipCreate && topMatch) {
    // Amendment 2: reuse existing node — reinforce instead of create
    activeNodeId = topMatch.nodeId
    changedNodeIds.add(activeNodeId)

    // Touch the reused node in the user graph
    // MA1: clone before mutation — global graph energy is independent.
    // A user traversal must not alter global state, even in-memory.
    const sourceNode = userGraph.nodes.get(activeNodeId) ?? _globalGraph.nodes.get(activeNodeId)
    const existingNode = sourceNode ? { ...sourceNode } : null
    if (existingNode) {
      existingNode.lastTraversed = now
      userGraph.nodes.set(activeNodeId, existingNode)
    }
  } else {
    // ── Step 3: create new M4 node ────────────────────────────────────────────
    // Amendment 2: normalizeLabel() on content (A6)
    // brand: locally minted — synthesized inside F-memory via generateId('mem')
    activeNodeId = generateId('mem') as NodeId
    const newNode: MemNode = {
      id:              activeNodeId,
      userId,                                  // Amendment 3: scoped to user (A6)
      content:         normalizeLabel(text.slice(0, 500)),  // Amendment 2: canonical label
      embedding,
      sourceText:      text,
      createdAt:       now,
      lastTraversed:   now,
      cachedLayer:     M4_INPUT,
      cachedClosure:   0,
      cachedAsymmetry: 0,
    }
    mutation.nodeCreates.push(newNode)
    changedNodeIds.add(activeNodeId)

    // Apply to in-memory user graph immediately (needed for propagation)
    userGraph.nodes.set(activeNodeId, newNode)
  }

  if (binding.nodes.length === 0) {
    // No resonance — persist the isolated node and return
    await commitAndUpdate(mutation, changedNodeIds, now, userId, userGraph)

    await emitEvent({
      type: MEMORY_EVENTS.NODE_CREATED,
      payload: { nodeId: activeNodeId },
      slice: 'F-memory',
    })

    return { ok: true, data: null }
  }

  // ── Step 4: connect → create edges to bound nodes ───────────────────────────
  // Amendment 1+3: 6-field edges with primitiveType, createdAt, userId (A6)
  // Fallthrough: edges point to global node IDs but stored with userId in per-user graph
  for (const bound of binding.nodes) {
    const edge: MemEdge = {
      fromId:        activeNodeId,
      toId:          bound.nodeId,
      weight:        Math.max(0.01, bound.similarity),
      primitiveType: options.primitiveType ?? null,  // Amendment 4: caller-specified or null (A6)
      createdAt:     now,                            // Amendment 1 (A6)
      userId,                                        // Amendment 3: scoped (A6)
    }
    mutation.edgeUpserts.push(edge)
    changedNodeIds.add(bound.nodeId)

    // Apply to in-memory user graph
    const outEdges = userGraph.edges.get(activeNodeId) ?? []
    outEdges.push(edge)
    userGraph.edges.set(activeNodeId, outEdges)
  }

  // Active node now has edges → at least M3
  const activeNode = userGraph.nodes.get(activeNodeId)
  if (activeNode && activeNode.cachedLayer === M4_INPUT) {
    activeNode.cachedLayer = M3_CONTEXT
    userGraph.nodes.set(activeNodeId, activeNode)
  }

  // ── Step 5: propagate → spread activation + inline learning ─────────────────
  const seed: ActivationMap = new Map()
  for (const bound of binding.nodes) {
    seed.set(bound.nodeId, bound.similarity)
  }
  seed.set(activeNodeId, binding.score)

  const { activation, edgeMutations } = propagate(seed, userGraph)

  for (const learnedEdge of edgeMutations) {
    mutation.edgeUpserts.push(learnedEdge)
    changedNodeIds.add(learnedEdge.fromId)
    changedNodeIds.add(learnedEdge.toId)

    // Apply to in-memory user graph
    const outEdges = userGraph.edges.get(learnedEdge.fromId) ?? []
    const idx = outEdges.findIndex(e => e.toId === learnedEdge.toId)
    if (idx >= 0) outEdges[idx] = learnedEdge
    else outEdges.push(learnedEdge)
    userGraph.edges.set(learnedEdge.fromId, outEdges)
  }

  // ── Step 6: sparsify → edge prune + isolate removal ─────────────────────────
  const sparsifyResult = sparsify(userGraph)

  for (const edgeDel of sparsifyResult.edgeDeletes) {
    mutation.edgeDeletes.push(edgeDel)
    changedNodeIds.add(edgeDel.fromId)
    changedNodeIds.add(edgeDel.toId)

    const outEdges = userGraph.edges.get(edgeDel.fromId) ?? []
    userGraph.edges.set(edgeDel.fromId, outEdges.filter(e => e.toId !== edgeDel.toId))
  }

  for (const nodeId of sparsifyResult.nodeDeletes) {
    mutation.nodeDeletes.push(nodeId)
    userGraph.nodes.delete(nodeId)
    userGraph.edges.delete(nodeId)
  }

  // ── Step 7: update_layers_locally → recompute changed nodes ─────────────────
  const layerUpdates = updateLayersLocally(changedNodeIds, userGraph, userThresholds, userState.dominanceMap)

  for (const update of layerUpdates) {
    const node = userGraph.nodes.get(update.nodeId)
    if (!node) continue

    const oldLayer = node.cachedLayer

    if (oldLayer >= M3_CONTEXT && update.layer <= 2) {
      mutation.sourcePrunes.push(update.nodeId)
      node.sourceText = null
    }

    mutation.layerUpdates.push(update)

    node.cachedLayer = update.layer
    node.cachedClosure = update.closure
    node.cachedAsymmetry = update.asymmetry
    userGraph.nodes.set(update.nodeId, node)

    if (oldLayer !== update.layer) {
      await emitEvent({
        type: MEMORY_EVENTS.LAYER_CHANGED,
        payload: { nodeId: update.nodeId, from: oldLayer, to: update.layer },
        slice: 'F-memory',
      })
    }
  }

  // ── Step 8: persist atomically (G3, scoped) ─────────────────────────────────
  await commitAndUpdate(mutation, changedNodeIds, now, userId, userGraph)

  // ── Step 9: recompute Present State (G2) ────────────────────────────────────
  userState.thresholds = computeThresholds(userGraph)

  // Detect arms periodically (every traversal for now; optimize later)
  const newArms = detectArms(userGraph)

  // Amendment 3+#5: stamp userId onto detected arms before persist (memory-arm.ts stays pure)
  for (const arm of newArms) {
    arm.userId = userId
  }

  if (newArms.length !== userState.arms.length) {
    const merges = detectArmMerges(newArms, userGraph)
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

    for (const arm of newArms) {
      const existed = userState.arms.some(a => a.id === arm.id)
      if (!existed) {
        await emitEvent({
          type: MEMORY_EVENTS.ARM_DETECTED,
          payload: { armId: arm.id, nodeCount: arm.nodeIds.length },
          slice: 'F-memory',
        })
      }
    }

    userState.arms = newArms
    await persistArms(newArms, userId)
  }

  // Recompute present state with scoped graph set
  userState.presentState = computePresentState(
    { user: userGraph, global: _globalGraph },
    userState.arms,
    _globalArms,
  )

  // Emit traversal complete
  await emitEvent({
    type: MEMORY_EVENTS.TRAVERSAL_COMPLETE,
    payload: {
      nodeCount: userGraph.nodes.size,
      edgeCount: Array.from(userGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    },
    slice: 'F-memory',
  })

  // ── Step 10: return ─────────────────────────────────────────────────────────
  if (!options.returnActivation) {
    return { ok: true, data: null }
  }

  const topNodes = Array.from(activation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MEMORY_CONFIG.TOP_K_ACTIVATION)
    .map(([nodeId, score]) => {
      const node = userGraph.nodes.get(nodeId) ?? _globalGraph.nodes.get(nodeId)
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
// Amendment 3: per-user present state keyed by userId.

export function getPresentState(userId: string): PresentState {
  const state = _userStates.get(userId)
  return state?.presentState ?? { statements: [] }
}

// ─── Get graph stats (for vital signs) ────────────────────────────────────────
// getGraph(): returns global graph (boot-time, shared read-only)
// getUserGraph(): returns per-user graph for vital signs (Amendment 3)

export function getGraph(): MemGraph {
  return _globalGraph
}

export function getUserGraph(userId: string): MemGraph {
  const state = _userStates.get(userId)
  return state?.graph ?? { nodes: new Map(), edges: new Map() }
}

export function getArms(): MemArm[] {
  return _globalArms
}

// A3: typed boundary — per-user arms for cross-slice graph read surface.
// w3-17-contract-ext: new accessor, mirrors getUserGraph pattern.
export function getUserArms(userId: string): MemArm[] {
  const state = _userStates.get(userId)
  return state?.arms ?? []
}

export function getDominanceMap(): Map<NodeId, DominanceEntry> {
  return _globalDominanceMap
}

export function setDominanceMap(map: Map<NodeId, DominanceEntry>): void {
  _globalDominanceMap = map
}

// ─── Internal: commit mutation + touch traversed nodes ────────────────────────
// Amendment 3: +userId param, passed to all R4 persist calls (A4).

async function commitAndUpdate(
  mutation: GraphMutation,
  changedNodeIds: Set<NodeId>,
  timestamp: number,
  userId: string,
  userGraph: MemGraph,
): Promise<void> {
  const persistResult = await persistMutations(mutation, userId)
  if (!persistResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.persist-failed',
      error: persistResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  const touchResult = await touchTraversedNodes(Array.from(changedNodeIds), timestamp, userId)
  if (!touchResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.touch-failed',
      error: touchResult.error.message,
      timestamp: new Date().toISOString(),
    }))
  }

  // Update in-memory last_traversed
  for (const nodeId of changedNodeIds) {
    const node = userGraph.nodes.get(nodeId)
    if (node) {
      node.lastTraversed = timestamp
      userGraph.nodes.set(nodeId, node)
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
