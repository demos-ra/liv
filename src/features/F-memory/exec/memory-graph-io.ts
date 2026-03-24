// @liv-standard v1.3
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R4
// wires-in:
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
//   R4  ./memory-repository
// validated:  pending

// Living Memory v1.0 — graph load and atomic persistence.
// R4: I/O only. Composes repository calls.
// G3: persistMutations() commits all mutations atomically in one database transaction.
//     A single runTraversal() can produce node creates, edge upserts, edge deletes,
//     node deletes, source text prunes, AND layer updates. All or nothing.
// MA2: one traversal = one mutation set = one transaction.

import { db } from '@/core/db/client'
import type { Result, AppError } from '@/core/types/primitives'
import type {
  MemGraph,
  MemNode,
  MemArm,
  DominanceEntry,
  GraphMutation,
  MLayer,
} from '../config/memory-types'
import {
  loadAllNodes,
  loadAllEdges,
  loadArms,
  loadDominance,
} from './memory-repository'

// ─── Load Graph ───────────────────────────────────────────────────────────────
// Called once on boot. Loads full graph + arms + dominance from Postgres.

export type LoadedGraph = {
  graph:        MemGraph
  arms:         MemArm[]
  dominanceMap: Map<string, DominanceEntry>
}

export async function loadGraph(): Promise<Result<LoadedGraph>> {
  const nodesResult = await loadAllNodes()
  if (!nodesResult.ok) return nodesResult

  const edgesResult = await loadAllEdges()
  if (!edgesResult.ok) return edgesResult

  const armsResult = await loadArms()
  if (!armsResult.ok) return armsResult

  const domResult = await loadDominance()
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

export async function persistMutations(mutation: GraphMutation): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])

    try {
      // 1. Node creates
      for (const node of mutation.nodeCreates) {
        await db.query(
          `INSERT INTO mem_node (id, content, embedding, source_text, created_at, last_traversed, cached_layer, cached_closure, cached_asymmetry)
           VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), to_timestamp($6::double precision / 1000), $7, $8, $9)
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
          ],
        )
      }

      // 2. Edge upserts
      for (const edge of mutation.edgeUpserts) {
        // Ensure both endpoints exist (defensive — node creates should have covered this)
        await db.query(
          `INSERT INTO mem_node (id, content, created_at, cached_layer)
           VALUES ($1, $1, now(), 4)
           ON CONFLICT (id) DO NOTHING`,
          [edge.fromId],
        )
        await db.query(
          `INSERT INTO mem_node (id, content, created_at, cached_layer)
           VALUES ($1, $1, now(), 4)
           ON CONFLICT (id) DO NOTHING`,
          [edge.toId],
        )
        await db.query(
          `INSERT INTO mem_edge (from_id, to_id, weight)
           VALUES ($1, $2, $3)
           ON CONFLICT (from_id, to_id) DO UPDATE SET weight = EXCLUDED.weight`,
          [edge.fromId, edge.toId, edge.weight],
        )
      }

      // 3. Edge deletes
      for (const del of mutation.edgeDeletes) {
        await db.query(
          `DELETE FROM mem_edge WHERE from_id = $1 AND to_id = $2`,
          [del.fromId, del.toId],
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
      for (const nodeId of mutation.nodeDeletes) {
        await db.query(`DELETE FROM mem_node WHERE id = $1`, [nodeId])
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

export async function persistArms(arms: MemArm[]): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])
    try {
      // Clear all existing arms and replace
      await db.query(`DELETE FROM mem_arm`, [])

      for (const arm of arms) {
        await db.query(
          `INSERT INTO mem_arm (id, label, node_ids, depth, updated_at)
           VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000))`,
          [arm.id, arm.label, arm.nodeIds, arm.depth, arm.updatedAt],
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

export async function persistDominance(entries: DominanceEntry[]): Promise<Result<void>> {
  try {
    await db.query('BEGIN', [])
    try {
      for (const entry of entries) {
        await db.query(
          `INSERT INTO mem_dominance (node_id, convergence, computed_at)
           VALUES ($1, $2, to_timestamp($3::double precision / 1000))
           ON CONFLICT (node_id) DO UPDATE SET
             convergence = EXCLUDED.convergence,
             computed_at = EXCLUDED.computed_at`,
          [entry.nodeId, entry.convergence, entry.computedAt],
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

export async function touchTraversedNodes(
  nodeIds: string[],
  timestamp: number,
): Promise<Result<void>> {
  if (nodeIds.length === 0) return { ok: true, data: undefined }

  try {
    // Use ANY($1) for batch update
    await db.query(
      `UPDATE mem_node SET last_traversed = to_timestamp($2::double precision / 1000) WHERE id = ANY($1)`,
      [nodeIds, timestamp],
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
