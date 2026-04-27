// @liv-standard v1.5.1
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, 4b-nodeid-propagation, lm-v2-2-shot5-fix-2
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  NodeId          core/R5 (primitives)
//   W-ATOM  MemGraph        F-memory/R0
//   W-ATOM  GraphMutation   F-memory/R0
//   W-ATOM  MemArm          F-memory/R0
//   W-ATOM  DominanceEntry  F-memory/R0
//   W-INJECT db             core/R5
//   W-INJECT memory-repository F-memory/R4
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
//   R5  @/core/db/client
//   R5  @/core/types/primitives
//   R4  ./memory-repository
// validated:  pending

// Living Memory v1.1 — graph load and atomic persistence.
// R4: I/O only. Composes repository calls.
// G3: persistMutations() commits all mutations atomically in one database transaction.
//     A single runTraversal() can produce node creates, edge upserts, edge deletes,
//     node deletes, source text prunes, AND layer updates. All or nothing.
// MA2: one traversal = one mutation set = one transaction.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures.
//
// lm-v1.1 changes:
//   loadGraph: +userId param, passed to all repository load calls
//   loadScopedGraphs: new — loads user + global graphs for fallthrough
//   persistMutations: +userId param, 6-column edge INSERT, scoped ON CONFLICT
//   persistArms: +userId param, scoped DELETE
//   persistDominance: +userId param
//   touchTraversedNodes: +userId param, scoped UPDATE

import { db } from '@/core/db/client'
import type { Result, AppError, NodeId } from '@/core/types/primitives'
import type {
  MemGraph,
  MemNodeRow,
  MemEdge,
  MemArm,
  DominanceEntry,
  GraphMutation,
} from '../config/memory-types'
import {
  loadAllNodes,
  loadAllEdges,
  loadArms,
  loadDominance,
} from './memory-repository'

// ─── Load Graph ───────────────────────────────────────────────────────────────
// Called on boot (global: userId=null) and per-user lazy load (userId=string).
// Amendment 3: userId param passed to all repository load calls (A4).
//
// lm-v2-2-shot5-fix-2 (G1 Move-to-R2): graph.nodes typed Map<NodeId, MemNodeRow>.
// LoadedGraph carries DB-row shapes; LMA21 scope is added during R2 hydration
// per LIV-Standard T1.1 (R4 = "DB queries, external I/O only"). R2 callers
// (memory-service.ts boot-load paths) iterate rows through ensureNodeScopeStamped
// to produce in-memory MemGraph values.

export type LoadedGraphRaw = {
  graph:        { nodes: Map<NodeId, MemNodeRow>; edges: Map<NodeId, MemEdge[]> }
  arms:         MemArm[]
  dominanceMap: Map<NodeId, DominanceEntry>
}

export async function loadGraph(userId: string | null): Promise<Result<LoadedGraphRaw>> {
  const nodesResult = await loadAllNodes(userId)
  if (!nodesResult.ok) return nodesResult

  const edgesResult = await loadAllEdges(userId)
  if (!edgesResult.ok) return edgesResult

  const armsResult = await loadArms(userId)
  if (!armsResult.ok) return armsResult

  const domResult = await loadDominance(userId)
  if (!domResult.ok) return domResult

  return {
    ok: true,
    data: {
      graph: {
        nodes: nodesResult.data,
        edges: edgesResult.data,
      },
      arms:         armsResult.data,
      dominanceMap: domResult.data,
    },
  }
}

// ─── Load Scoped Graphs ───────────────────────────────────────────────────────
// Amendment 3: loads both user-scoped and global graphs for fallthrough bind (A6).
// User graph is the primary workspace. Global graph is read-only context.

export async function loadScopedGraphs(userId: string): Promise<Result<{
  user:   LoadedGraphRaw
  global: LoadedGraphRaw
}>> {
  const userResult = await loadGraph(userId)
  if (!userResult.ok) return userResult
  const globalResult = await loadGraph(null)
  if (!globalResult.ok) return globalResult
  return { ok: true, data: { user: userResult.data, global: globalResult.data } }
}

// ─── Persist Mutations (Atomic) ───────────────────────────────────────────────
// G3: one traversal = one transaction. All mutations committed atomically.
// Partial commits create inconsistent graph state — this prevents that.
//
// Mutation set may contain:
//   - node creates (new M4 input)
//   - edge upserts (binding + learning)
//   - edge deletes (sparsify)
//   - node deletes (isolate removal)
//   - source text prunes (M3→M2 transition)
//   - layer updates (recomputed by update_layers_locally)
//
// Amendment 1+3: edge INSERT is 6 columns, ON CONFLICT scoped (A6).
// Amendment 3: userId param for defensive node creates (A4).

export async function persistMutations(
  mutation: GraphMutation,
  userId: string | null,
): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])

    try {
      // 1. Node creates — Amendment 3: +user_id
      for (const node of mutation.nodeCreates) {
        await db.query(
          `INSERT INTO mem_node (id, content, embedding, source_text, created_at, last_traversed, cached_layer, cached_closure, cached_asymmetry, user_id)
           VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), to_timestamp($6::double precision / 1000), $7, $8, $9, $10)
           ON CONFLICT (id) DO UPDATE SET
             content         = EXCLUDED.content,
             embedding       = EXCLUDED.embedding,
             source_text     = EXCLUDED.source_text,
             last_traversed  = EXCLUDED.last_traversed,
             cached_layer    = EXCLUDED.cached_layer,
             cached_closure  = EXCLUDED.cached_closure,
             cached_asymmetry = EXCLUDED.cached_asymmetry`,
          [
            node.id,
            node.content,
            node.embedding ? JSON.stringify(node.embedding) : null,
            node.sourceText,
            node.createdAt,
            node.lastTraversed,
            node.cachedLayer,
            node.cachedClosure,
            node.cachedAsymmetry,
            node.userId,
          ],
        )
      }

      // 2. Edge upserts — Amendment 1+3: 6-column INSERT, scoped ON CONFLICT
      for (const edge of mutation.edgeUpserts) {
        // Ensure both endpoints exist (defensive — node creates should have covered this)
        // Amendment 3: defensive creates include user_id
        await db.query(
          `INSERT INTO mem_node (id, content, created_at, cached_layer, user_id)
           VALUES ($1, $1, now(), 4, $2)
           ON CONFLICT (id) DO NOTHING`,
          [edge.fromId, userId],
        )
        await db.query(
          `INSERT INTO mem_node (id, content, created_at, cached_layer, user_id)
           VALUES ($1, $1, now(), 4, $2)
           ON CONFLICT (id) DO NOTHING`,
          [edge.toId, userId],
        )
        // Amendment 1: primitive_type + created_at. Amendment 3: user_id + scoped conflict.
        await db.query(
          `INSERT INTO mem_edge (from_id, to_id, weight, primitive_type, created_at, user_id)
           VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), $6)
           ON CONFLICT (from_id, to_id, COALESCE(user_id, '__global__'))
           DO UPDATE SET weight = EXCLUDED.weight`,
          [edge.fromId, edge.toId, edge.weight, edge.primitiveType, edge.createdAt, edge.userId],
        )
      }

      // 3. Edge deletes — Amendment 3: scoped by user_id (A6)
      for (const del of mutation.edgeDeletes) {
        await db.query(
          `DELETE FROM mem_edge WHERE from_id = $1 AND to_id = $2 AND user_id IS NOT DISTINCT FROM $3`,
          [del.fromId, del.toId, userId],
        )
      }

      // 4. Source text prunes (M3→M2 transition)
      for (const nodeId of mutation.sourcePrunes) {
        await db.query(
          `UPDATE mem_node SET source_text = NULL WHERE id = $1`,
          [nodeId],
        )
      }

      // 5. Layer updates
      for (const update of mutation.layerUpdates) {
        await db.query(
          `UPDATE mem_node SET cached_layer = $2, cached_closure = $3, cached_asymmetry = $4 WHERE id = $1`,
          [update.nodeId, update.layer, update.closure, update.asymmetry],
        )
      }

      // 6. Node deletes (isolate removal — last, after edge cleanup)
      // Amendment 3: scoped by user_id (A6)
      for (const nodeId of mutation.nodeDeletes) {
        await db.query(
          `DELETE FROM mem_node WHERE id = $1 AND user_id IS NOT DISTINCT FROM $2`,
          [nodeId, userId],
        )
      }

      await db.query('COMMIT', [])
      return { ok: true, data: undefined }
    } catch (err) {
      await db.query('ROLLBACK', [])
      throw err
    }
  } catch (err) {
    return { ok: false, error: dbError('PERSIST_MUTATIONS_FAILED', err) }
  }
}

// ─── Persist Arms ─────────────────────────────────────────────────────────────
// Called after detectArms() finds new community structure.
// Amendment 3: +userId param, scoped DELETE (A4).

export async function persistArms(arms: MemArm[], userId: string | null): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])
    try {
      // Clear existing arms for this scope and replace
      // Amendment 3: scoped DELETE — only delete arms for this userId
      await db.query(`DELETE FROM mem_arm WHERE user_id IS NOT DISTINCT FROM $1`, [userId])

      for (const arm of arms) {
        await db.query(
          `INSERT INTO mem_arm (id, label, node_ids, depth, updated_at, user_id)
           VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), $6)`,
          [arm.id, arm.label, arm.nodeIds, arm.depth, arm.updatedAt, arm.userId],
        )
      }

      await db.query('COMMIT', [])
      return { ok: true, data: undefined }
    } catch (err) {
      await db.query('ROLLBACK', [])
      throw err
    }
  } catch (err) {
    return { ok: false, error: dbError('PERSIST_ARMS_FAILED', err) }
  }
}

// ─── Persist Dominance ────────────────────────────────────────────────────────
// Called after background recomputeDominance() completes.
// Amendment 3: +userId param (A4).

export async function persistDominance(
  entries: DominanceEntry[],
  userId: string | null,
): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])
    try {
      for (const entry of entries) {
        await db.query(
          `INSERT INTO mem_dominance (node_id, convergence, computed_at, user_id)
           VALUES ($1, $2, to_timestamp($3::double precision / 1000), $4)
           ON CONFLICT (node_id) DO UPDATE SET
             convergence = EXCLUDED.convergence,
             computed_at = EXCLUDED.computed_at`,
          [entry.nodeId, entry.convergence, entry.computedAt, userId],
        )
      }
      await db.query('COMMIT', [])
      return { ok: true, data: undefined }
    } catch (err) {
      await db.query('ROLLBACK', [])
      throw err
    }
  } catch (err) {
    return { ok: false, error: dbError('PERSIST_DOMINANCE_FAILED', err) }
  }
}

// ─── Touch traversed nodes ────────────────────────────────────────────────────
// Bulk update last_traversed for all nodes activated in a traversal.
// Amendment 3: +userId param, scoped UPDATE (A4).

export async function touchTraversedNodes(
  nodeIds: NodeId[],
  timestamp: number,
  userId: string | null,
): Promise<Result<void>> {
  if (nodeIds.length === 0) return { ok: true, data: undefined }

  try {
    // Amendment 3: scope to user — only touch nodes belonging to this graph scope
    await db.query(
      `UPDATE mem_node SET last_traversed = to_timestamp($2::double precision / 1000)
       WHERE id = ANY($1) AND user_id IS NOT DISTINCT FROM $3`,
      [nodeIds, timestamp, userId],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('TOUCH_TRAVERSED_FAILED', err) }
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function dbError(code: string, err: unknown): AppError {
  return {
    code,
    message: err instanceof Error ? err.message : String(err),
  }
}
