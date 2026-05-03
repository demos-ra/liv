// @liv-standard v1.5.1
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    w3-20-admin-write, 6.1-global-seed, 4b-nodeid-propagation, lm-v2-2-shot3, lm-v2-2-shot5-fix-2, lm-v2-3-shot1
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM   NodeId                                                        core/R5 (primitives)
//   W-ATOM   MemNode, MemEdge, GraphMutation, MemGraph, GraphThresholds  F-memory/R0
//   W-ATOM   ActivationMap, M4_INPUT, M3_CONTEXT                         F-memory/R0
//   W-ATOM   GlobalSeedNode                                               F-memory/R0
//   W-ATOM   SYSTEM_DEFAULT_ARRIVAL                                        F-memory/R0 (LMA22/23/24, lm-v2-3-shot1)
// wires-out:
//   W-INJECT seedGlobalNode        →  F-memory/R3 (memory-contract)
//   W-INJECT removeGlobalNode      →  F-memory/R3 (memory-contract)
//   W-INJECT seedAndTraverseGlobal →  F-memory/R3 (memory-contract)
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-seed-data
//   R1  ../domain/memory-bind
//   R1  ../domain/memory-traverse
//   R1  ../domain/memory-sparsify
//   R1  ../domain/memory-layer
//   R1  ../domain/memory-arm
//   R4  ../exec/memory-graph-io
//   R4  ../exec/memory-repository
//   R4  ../exec/embedding-service
//   R5  @/core/types/primitives
// validated:  pending

// Admin write service — global graph seed, remove, and batch seed+traverse.
// R2: orchestration. Composes R1 pure functions + R4 I/O.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures. Two locally-
//     minted node-id sites: `global-seed-${node.key}` synthesized from seed-file
//     key at batch phase 1 and phase 2 traversal.
//
// 6.1-global-seed:
//   seedAndTraverseGlobal() — batch seed all nodes, then self-traverse.
//   Loads its own copy of the global graph from DB via loadGraph(null).
//   After completion, caller calls onBoot() to force global graph reload
//   in memory-service.ts. No mutable state accessors needed.

import type { Result, NodeId } from '@/core/types/primitives'
import type {
  MemNode,
  MemEdge,
  MemGraph,
  GraphMutation,
  GraphThresholds,
  ActivationMap,
} from '../config/memory-types'
import { M4_INPUT, M3_CONTEXT, SYSTEM_DEFAULT_ARRIVAL } from '../config/memory-types'
// lm-v2-2-shot3: stampScope helper from peer R2 service for LMA21 stamping.
import { stampScope, ensureNodeScopeStamped } from './memory-service'
import type { GlobalSeedNode } from '../config/memory-seed-data'

// R4 — I/O
import { persistMutations, loadGraph, touchTraversedNodes, persistArms } from '../exec/memory-graph-io'
import { loadEdgesForNode } from '../exec/memory-repository'
import { encode } from '../exec/embedding-service'

// R1 — pure functions
import { bind, computeThresholds } from '../domain/memory-bind'
import { propagate } from '../domain/memory-traverse'
import { sparsify } from '../domain/memory-sparsify'
import { updateLayersLocally } from '../domain/memory-layer'
import { detectArms } from '../domain/memory-arm'

// ─── Traversal order ─────────────────────────────────────────────────────────
// Deepest-meaning nodes traverse first so they form the attractor core.
// Identity → modules → concepts → modes → protocol → variables.
const TRAVERSAL_ORDER: string[] = [
  'identity-liv',
  'identity-method',
  'module-liv-standard',
  'module-living-memory',
  'module-cognitive-standard',
  'concept-slices',
  'concept-layers',
  'concept-wires',
  'concept-axioms',
  'mode-epistemic',
  'mode-structural',
  'mode-generative',
  'mode-verificative',
  'protocol-scope',
  'protocol-validity',
  'protocol-execution',
  'protocol-fidelity',
  'var-temporal',
  'var-categorical',
  'var-relational',
  'var-positional',
]

// ─── seedGlobalNode ───────────────────────────────────────────────────────────
// Direct node + edge insert into global graph (userId: null).
// Not a traversal — no propagation, no sparsification, no activation.
// Defaults: M4 layer, closure 0, asymmetry 0 (fresh node, no topology yet).
//
// lm-v2-3-shot1 (LMA22, LMA23, LMA24): admin seed is a system-tagged write.
// Caller may pre-stamp arrival metadata; if not, default-fills from
// SYSTEM_DEFAULT_ARRIVAL. Same idempotency pattern as LMA21 scope-stamping at
// this seam — pre-stamped passes through, unstamped gets defaulted.

export async function seedGlobalNode(
  node: Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry' | 'modality' | 'sourceAuthority' | 'confidence'> & Partial<Pick<MemNode, 'modality' | 'sourceAuthority' | 'confidence'>>,
  edges: MemEdge[],
): Promise<Result<void>> {
  const fullNode: MemNode = {
    ...node,
    // lm-v2-2-shot3 (LMA21): if caller did not pre-stamp scope, stamp here
    // from node.userId (null → 'global'). Idempotent — pre-stamped passes
    // through. Total LMA21 stamping: every persisted node carries scope tags.
    scope:           (node.scope && node.scope.size > 0) ? node.scope : stampScope(node.userId),
    cachedLayer:     M4_INPUT,
    cachedClosure:   0,
    cachedAsymmetry: 0,
    // lm-v2-3-shot1 (LMA22, LMA23, LMA24): default-fill arrival metadata at
    // the admin seed seam. Caller may pre-stamp via the Partial<> fields;
    // unset values fall through to SYSTEM_DEFAULT_ARRIVAL.
    modality:        node.modality        ?? SYSTEM_DEFAULT_ARRIVAL.modality,
    sourceAuthority: node.sourceAuthority ?? SYSTEM_DEFAULT_ARRIVAL.sourceAuthority,
    confidence:      node.confidence      ?? SYSTEM_DEFAULT_ARRIVAL.confidence,
  }

  const mutation: GraphMutation = {
    nodeCreates:  [fullNode],
    edgeUpserts:  edges,
    edgeDeletes:  [],
    nodeDeletes:  [],
    sourcePrunes: [],
    layerUpdates: [],
  }

  return persistMutations(mutation, null)
}

// ─── removeGlobalNode ─────────────────────────────────────────────────────────
// Cascade delete: query connected edges via R4, build single atomic mutation.
// A4: I/O delegated to R4 (loadEdgesForNode + persistMutations).

export async function removeGlobalNode(nodeId: NodeId): Promise<Result<void>> {
  const edgeResult = await loadEdgesForNode(nodeId, null)
  if (!edgeResult.ok) {
    return {
      ok: false,
      error: {
        code: 'ADMIN_REMOVE_FAILED',
        message: edgeResult.error.message,
        context: { nodeId },
      },
    }
  }

  const mutation: GraphMutation = {
    nodeCreates:  [],
    edgeUpserts:  [],
    edgeDeletes:  edgeResult.data,
    nodeDeletes:  [nodeId],
    sourcePrunes: [],
    layerUpdates: [],
  }

  return persistMutations(mutation, null)
}

// ─── seedAndTraverseGlobal ────────────────────────────────────────────────────
// Phase 6.1: batch seed all nodes, then self-traverse.
//
// Loads its own copy of the global graph from DB via loadGraph(null).
// Operates on that local copy for the full seed+traverse pass.
// After completion, caller calls onBoot() to force global graph reload.
//
// Phase 1 — Seed: direct write, no traversal. Idempotent by key.
// Phase 2 — Self-traversal: embed → bind → connect → propagate → sparsify →
//           update layers → persist. Nodes earn M3+ through physics (MA5).

export async function seedAndTraverseGlobal(
  nodes: GlobalSeedNode[],
): Promise<Result<{ seeded: number; traversed: number }>> {

  // ── Build key→node lookup ───────────────────────────────────────────────────
  const nodeByKey = new Map<string, GlobalSeedNode>()
  for (const node of nodes) {
    nodeByKey.set(node.key, node)
  }

  // ── Phase 1: Seed (direct write, no traversal) ─────────────────────────────
  let seededCount = 0
  const now = Date.now()

  // Load current global graph to check for existing nodes (idempotency)
  const loadResult = await loadGraph(null)
  if (!loadResult.ok) {
    return {
      ok: false,
      error: { code: 'SEED_LOAD_FAILED', message: loadResult.error.message },
    }
  }

  // lm-v2-2-shot5-fix-2 (G1 Move-to-R2): R4 returns row shapes; R2 hydrates.
  const seedStampedNodes = new Map<NodeId, MemNode>()
  for (const [id, row] of loadResult.data.graph.nodes) {
    seedStampedNodes.set(id, ensureNodeScopeStamped(row))
  }
  const graph: MemGraph = { nodes: seedStampedNodes, edges: loadResult.data.graph.edges }

  for (const node of nodes) {
    // brand: locally minted — synthesized from seed-file key inside F-memory
    const nodeId = `global-seed-${node.key}` as NodeId

    // Idempotency: skip if already exists
    if (graph.nodes.has(nodeId)) continue

    const memNode: MemNode = {
      id:              nodeId,
      userId:          null,
      // lm-v2-2-shot3 (LMA21): batch-seed path stamps 'global' scope (userId null).
      scope:           stampScope(null),
      content:         node.content,
      embedding:       null,
      sourceText:      node.content,
      createdAt:       now,
      lastTraversed:   null,
      cachedLayer:     M4_INPUT,
      cachedClosure:   0,
      cachedAsymmetry: 0,
      // lm-v2-3-shot1 (LMA22, LMA23, LMA24): batch-seed is a system-tagged
      // write — admin-authored knowledge entering the global graph. Defaults
      // preserve the implicit pre-v2.3 reading.
      modality:        SYSTEM_DEFAULT_ARRIVAL.modality,
      sourceAuthority: SYSTEM_DEFAULT_ARRIVAL.sourceAuthority,
      confidence:      SYSTEM_DEFAULT_ARRIVAL.confidence,
    }

    const edges: MemEdge[] = node.edges.map(e => ({
      fromId:        nodeId,
      // brand: locally minted — synthesized from seed-file edge key inside F-memory
      toId:          `global-seed-${e.key}` as NodeId,
      weight:        0.5,
      primitiveType: e.primitiveType,
      createdAt:     now,
      userId:        null,
    }))

    const seedResult = await seedGlobalNode(memNode, edges)
    if (!seedResult.ok) {
      return {
        ok: false,
        error: {
          code: 'SEED_NODE_FAILED',
          message: seedResult.error.message,
          context: { key: node.key },
        },
      }
    }

    // Apply to in-memory graph for Phase 2
    graph.nodes.set(nodeId, memNode)
    graph.edges.set(nodeId, edges)
    seededCount++
  }

  // ── Phase 2: Self-traversal (earn depth through physics) ───────────────────
  // Reload from DB to pick up all seeded nodes with edges
  const reloadResult = await loadGraph(null)
  if (!reloadResult.ok) {
    return {
      ok: false,
      error: { code: 'SEED_RELOAD_FAILED', message: reloadResult.error.message },
    }
  }

  // lm-v2-2-shot5-fix-2 (G1 Move-to-R2): hydrate row → MemNode at R2.
  const reloadStampedNodes = new Map<NodeId, MemNode>()
  for (const [id, row] of reloadResult.data.graph.nodes) {
    reloadStampedNodes.set(id, ensureNodeScopeStamped(row))
  }
  const fullGraph: MemGraph = { nodes: reloadStampedNodes, edges: reloadResult.data.graph.edges }
  let thresholds: GraphThresholds = computeThresholds(fullGraph)
  const dominanceMap = reloadResult.data.dominanceMap
  let traversedCount = 0

  for (const key of TRAVERSAL_ORDER) {
    const seedNode = nodeByKey.get(key)
    if (!seedNode) continue

    // brand: locally minted — synthesized from seed-file key inside F-memory
    const nodeId = `global-seed-${key}` as NodeId
    const node = fullGraph.nodes.get(nodeId)
    if (!node) continue

    // ── Embed ─────────────────────────────────────────────────────────────────
    const encodeResult = await encode(node.content)
    if (!encodeResult.ok) {
      console.error(JSON.stringify({
        level: 'error', event: 'seed.traverse.encode-failed',
        key, error: encodeResult.error.message,
        timestamp: new Date().toISOString(),
      }))
      continue
    }

    const embedding = encodeResult.data
    node.embedding = embedding
    fullGraph.nodes.set(nodeId, node)

    // Persist embedding so subsequent binds can use it
    const embedMutation: GraphMutation = {
      nodeCreates:  [node],
      edgeUpserts:  [],
      edgeDeletes:  [],
      nodeDeletes:  [],
      sourcePrunes: [],
      layerUpdates: [],
    }
    const embedPersist = await persistMutations(embedMutation, null)
    if (!embedPersist.ok) {
      console.error(JSON.stringify({
        level: 'error', event: 'seed.traverse.embed-persist-failed',
        key, error: embedPersist.error.message,
        timestamp: new Date().toISOString(),
      }))
      continue
    }

    // ── Bind ──────────────────────────────────────────────────────────────────
    const binding = bind(embedding, fullGraph, thresholds)

    const changedNodeIds = new Set<NodeId>()
    changedNodeIds.add(nodeId)

    const mutation: GraphMutation = {
      nodeCreates:  [],
      edgeUpserts:  [],
      edgeDeletes:  [],
      nodeDeletes:  [],
      sourcePrunes: [],
      layerUpdates: [],
    }

    if (binding.nodes.length > 0) {
      // ── Connect — edges to bound nodes ────────────────────────────────────
      for (const bound of binding.nodes) {
        if (bound.nodeId === nodeId) continue
        const existingEdges = fullGraph.edges.get(nodeId) ?? []
        if (existingEdges.some(e => e.toId === bound.nodeId)) continue

        const edge: MemEdge = {
          fromId:        nodeId,
          toId:          bound.nodeId,
          weight:        Math.max(0.01, bound.similarity),
          primitiveType: 'relate',
          createdAt:     now,
          userId:        null,
        }
        mutation.edgeUpserts.push(edge)
        changedNodeIds.add(bound.nodeId)

        const outEdges = fullGraph.edges.get(nodeId) ?? []
        outEdges.push(edge)
        fullGraph.edges.set(nodeId, outEdges)
      }

      // Promote to M3 if at M4
      if (node.cachedLayer === M4_INPUT) {
        node.cachedLayer = M3_CONTEXT
        fullGraph.nodes.set(nodeId, node)
      }

      // ── Propagate ─────────────────────────────────────────────────────────
      const seed: ActivationMap = new Map()
      for (const bound of binding.nodes) {
        seed.set(bound.nodeId, bound.similarity)
      }
      seed.set(nodeId, binding.score)

      const { edgeMutations } = propagate(seed, fullGraph)

      for (const learnedEdge of edgeMutations) {
        mutation.edgeUpserts.push(learnedEdge)
        changedNodeIds.add(learnedEdge.fromId)
        changedNodeIds.add(learnedEdge.toId)

        const outEdges = fullGraph.edges.get(learnedEdge.fromId) ?? []
        const idx = outEdges.findIndex(e => e.toId === learnedEdge.toId)
        if (idx >= 0) outEdges[idx] = learnedEdge
        else outEdges.push(learnedEdge)
        fullGraph.edges.set(learnedEdge.fromId, outEdges)
      }

      // ── Sparsify ──────────────────────────────────────────────────────────
      const sparsifyResult = sparsify(fullGraph)

      for (const edgeDel of sparsifyResult.edgeDeletes) {
        mutation.edgeDeletes.push(edgeDel)
        changedNodeIds.add(edgeDel.fromId)
        changedNodeIds.add(edgeDel.toId)

        const outEdges = fullGraph.edges.get(edgeDel.fromId) ?? []
        fullGraph.edges.set(edgeDel.fromId, outEdges.filter(e => e.toId !== edgeDel.toId))
      }

      for (const delNodeId of sparsifyResult.nodeDeletes) {
        mutation.nodeDeletes.push(delNodeId)
        fullGraph.nodes.delete(delNodeId)
        fullGraph.edges.delete(delNodeId)
      }

      // ── Update layers ─────────────────────────────────────────────────────
      const layerUpdates = updateLayersLocally(changedNodeIds, fullGraph, thresholds, dominanceMap)

      for (const update of layerUpdates) {
        mutation.layerUpdates.push(update)
        const updatedNode = fullGraph.nodes.get(update.nodeId)
        if (updatedNode) {
          updatedNode.cachedLayer = update.layer
          updatedNode.cachedClosure = update.closure
          updatedNode.cachedAsymmetry = update.asymmetry
          fullGraph.nodes.set(update.nodeId, updatedNode)
        }
      }
    } else {
      // No binding — promote to M3 if node has seed edges
      const existingEdges = fullGraph.edges.get(nodeId) ?? []
      if (existingEdges.length > 0 && node.cachedLayer === M4_INPUT) {
        node.cachedLayer = M3_CONTEXT
        fullGraph.nodes.set(nodeId, node)
        mutation.layerUpdates.push({
          nodeId,
          layer: M3_CONTEXT,
          closure: node.cachedClosure,
          asymmetry: node.cachedAsymmetry,
        })
      }
    }

    // ── Persist ─────────────────────────────────────────────────────────────
    if (
      mutation.edgeUpserts.length > 0 ||
      mutation.edgeDeletes.length > 0 ||
      mutation.nodeDeletes.length > 0 ||
      mutation.layerUpdates.length > 0
    ) {
      const persistResult = await persistMutations(mutation, null)
      if (!persistResult.ok) {
        console.error(JSON.stringify({
          level: 'error', event: 'seed.traverse.persist-failed',
          key, error: persistResult.error.message,
          timestamp: new Date().toISOString(),
        }))
        continue
      }
    }

    // ── Touch ───────────────────────────────────────────────────────────────
    await touchTraversedNodes(Array.from(changedNodeIds), now, null)

    // Recompute thresholds after each traversal
    thresholds = computeThresholds(fullGraph)
    traversedCount++
  }

  // ── Post-traversal: detect and persist arms ─────────────────────────────────
  const arms = detectArms(fullGraph)
  for (const arm of arms) {
    arm.userId = null
  }
  await persistArms(arms, null)

  console.log(JSON.stringify({
    level: 'info', event: 'seed.complete',
    seeded: seededCount,
    traversed: traversedCount,
    nodeCount: fullGraph.nodes.size,
    edgeCount: Array.from(fullGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: arms.length,
    timestamp: new Date().toISOString(),
  }))

  return { ok: true, data: { seeded: seededCount, traversed: traversedCount } }
}
