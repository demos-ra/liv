// @liv-standard v1.5.1
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, w3-20-admin-write, 4b-nodeid-propagation, lm-v2-2-shot5-fix, lm-v2-2-shot5-fix-2
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  NodeId           core/R5 (primitives)
//   W-ATOM  MemNode          F-memory/R0
//   W-ATOM  MemNodeRow       F-memory/R0 (raw row shape; lm-v2-2-shot5-fix-2)
//   W-ATOM  MemEdge          F-memory/R0
//   W-ATOM  MemArm           F-memory/R0
//   W-ATOM  DominanceEntry   F-memory/R0
//   W-ATOM  MLayer           F-memory/R0
//   W-ATOM  EdgePrimitiveType F-memory/R0
//   W-INJECT db              core/R5
// wires-out:  none (consumed by R4 graph-io, R2 service)
// deps:
//   R0  ../config/memory-types
//   R5  @/core/db/client
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v1.1 — all Postgres CRUD.
// R4: I/O only. Zero domain logic.
// A4: all I/O isolated at R4.
// A2: imports R0 types and R5 db client only. No upward imports.
// Result<T> on all fallible operations per CC.07.
//
// lm-v1.1 changes:
//   All load functions: +userId param, WHERE user_id IS NOT DISTINCT FROM $N
//   upsertNode: +user_id column
//   upsertEdge: 3→6 columns, ON CONFLICT scoped by COALESCE(user_id, '__global__')
//   upsertArm: +user_id column
//   upsertDominance: +user_id in scope
//
// 4b-nodeid-propagation:
//   DB reads are the external-origin ingress boundary. Raw `row.id`,
//   `row.from_id`, `row.to_id`, `row.node_id`, `row.node_ids` are DB-origin
//   strings that become branded NodeIds at this slice boundary.
//   Every cast site tagged `// brand: external origin`.
//   Scalar nodeId params (deleteNode, updateNodeSourceText, updateNodeLayer,
//   touchNodeTraversal, deleteEdge, loadEdgesForNode) accept NodeId from
//   F-memory-internal callers — no cast needed at those signatures.

import { db } from '@/core/db/client'
import type { Result, AppError, NodeId } from '@/core/types/primitives'
import type {
  MemNode,
  MemNodeRow,
  MemEdge,
  MemArm,
  DominanceEntry,
  MLayer,
  EdgePrimitiveType,
} from '../config/memory-types'

// ─── Node operations ──────────────────────────────────────────────────────────

export async function upsertNode(node: MemNode): Promise<Result<void>> {
  try {
    // Amendment 3: user_id included in INSERT (A6: scope at origin)
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
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_UPSERT_FAILED', err) }
  }
}

export async function deleteNode(nodeId: NodeId): Promise<Result<void>> {
  try {
    await db.query(`DELETE FROM mem_node WHERE id = $1`, [nodeId])
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_DELETE_FAILED', err) }
  }
}

export async function updateNodeSourceText(nodeId: NodeId, sourceText: string | null): Promise<Result<void>> {
  try {
    await db.query(
      `UPDATE mem_node SET source_text = $2 WHERE id = $1`,
      [nodeId, sourceText],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_SOURCE_UPDATE_FAILED', err) }
  }
}

export async function updateNodeLayer(
  nodeId: NodeId,
  layer: MLayer,
  closure: number,
  asymmetry: number,
): Promise<Result<void>> {
  try {
    await db.query(
      `UPDATE mem_node SET cached_layer = $2, cached_closure = $3, cached_asymmetry = $4 WHERE id = $1`,
      [nodeId, layer, closure, asymmetry],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_LAYER_UPDATE_FAILED', err) }
  }
}

export async function touchNodeTraversal(nodeId: NodeId, timestamp: number): Promise<Result<void>> {
  try {
    await db.query(
      `UPDATE mem_node SET last_traversed = to_timestamp($2::double precision / 1000) WHERE id = $1`,
      [nodeId, timestamp],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_TOUCH_FAILED', err) }
  }
}

// ─── Edge operations ──────────────────────────────────────────────────────────

export async function upsertEdge(edge: MemEdge): Promise<Result<void>> {
  try {
    // Amendment 1+3: 6-column INSERT, scoped ON CONFLICT (A6)
    await db.query(
      `INSERT INTO mem_edge (from_id, to_id, weight, primitive_type, created_at, user_id)
       VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), $6)
       ON CONFLICT (from_id, to_id, COALESCE(user_id, '__global__'))
       DO UPDATE SET weight = EXCLUDED.weight`,
      [edge.fromId, edge.toId, edge.weight, edge.primitiveType, edge.createdAt, edge.userId],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('EDGE_UPSERT_FAILED', err) }
  }
}

export async function deleteEdge(fromId: NodeId, toId: NodeId): Promise<Result<void>> {
  try {
    await db.query(
      `DELETE FROM mem_edge WHERE from_id = $1 AND to_id = $2`,
      [fromId, toId],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('EDGE_DELETE_FAILED', err) }
  }
}

// ─── Arm operations ───────────────────────────────────────────────────────────

export async function upsertArm(arm: MemArm): Promise<Result<void>> {
  try {
    // Amendment 3: +user_id (A6: scope at origin)
    await db.query(
      `INSERT INTO mem_arm (id, label, node_ids, depth, updated_at, user_id)
       VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000), $6)
       ON CONFLICT (id) DO UPDATE SET
         label      = EXCLUDED.label,
         node_ids   = EXCLUDED.node_ids,
         depth      = EXCLUDED.depth,
         updated_at = EXCLUDED.updated_at`,
      [arm.id, arm.label, arm.nodeIds, arm.depth, arm.updatedAt, arm.userId],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('ARM_UPSERT_FAILED', err) }
  }
}

export async function deleteArm(armId: string): Promise<Result<void>> {
  try {
    await db.query(`DELETE FROM mem_arm WHERE id = $1`, [armId])
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('ARM_DELETE_FAILED', err) }
  }
}

// Amendment 3: +userId param, IS NOT DISTINCT FROM for null-safe filtering (A4)
export async function loadArms(userId: string | null): Promise<Result<MemArm[]>> {
  try {
    const result = await db.query<{
      id: string; label: string | null; node_ids: string[]; depth: number; updated_at: string; user_id: string | null
    }>(`SELECT id, label, node_ids, depth, updated_at, user_id FROM mem_arm WHERE user_id IS NOT DISTINCT FROM $1`, [userId])

    return {
      ok: true,
      data: result.rows.map(row => ({
        id:        row.id,
        userId:    row.user_id,
        label:     row.label,
        // brand: external origin — DB row strings become NodeId[] at F-memory ingress
        nodeIds:   row.node_ids as NodeId[],
        depth:     row.depth,
        updatedAt: new Date(row.updated_at).getTime(),
      })),
    }
  } catch (err) {
    return { ok: false, error: dbError('ARM_LOAD_FAILED', err) }
  }
}

// ─── Dominance operations ─────────────────────────────────────────────────────

export async function upsertDominance(entry: DominanceEntry): Promise<Result<void>> {
  try {
    await db.query(
      `INSERT INTO mem_dominance (node_id, convergence, computed_at)
       VALUES ($1, $2, to_timestamp($3::double precision / 1000))
       ON CONFLICT (node_id) DO UPDATE SET
         convergence = EXCLUDED.convergence,
         computed_at = EXCLUDED.computed_at`,
      [entry.nodeId, entry.convergence, entry.computedAt],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('DOMINANCE_UPSERT_FAILED', err) }
  }
}

// Amendment 3: +userId param, IS NOT DISTINCT FROM for null-safe filtering (A4)
export async function loadDominance(userId: string | null): Promise<Result<Map<NodeId, DominanceEntry>>> {
  try {
    const result = await db.query<{
      node_id: string; convergence: number; computed_at: string
    }>(`SELECT node_id, convergence, computed_at FROM mem_dominance WHERE user_id IS NOT DISTINCT FROM $1`, [userId])

    const map = new Map<NodeId, DominanceEntry>()
    for (const row of result.rows) {
      // brand: external origin — DB row node_id becomes NodeId at F-memory ingress
      const nodeId = row.node_id as NodeId
      map.set(nodeId, {
        nodeId,
        convergence: row.convergence,
        computedAt:  new Date(row.computed_at).getTime(),
      })
    }
    return { ok: true, data: map }
  } catch (err) {
    return { ok: false, error: dbError('DOMINANCE_LOAD_FAILED', err) }
  }
}

// ─── Graph load ───────────────────────────────────────────────────────────────

// Amendment 3: +userId param, IS NOT DISTINCT FROM for null-safe filtering (A4)
// lm-v2-2-shot5-fix-2 (G1 Move-to-R2): return type changed to Map<NodeId, MemNodeRow>.
// R4 = "DB queries, external I/O only" per LIV-Standard T1.1 / T1.4. Domain-derived
// fields (LMA21 scope) are added during R2 hydration via ensureNodeScopeStamped at
// the boot-load paths in memory-service.ts. Closes patch3's D-G1-INLINE-STAMP carry
// (the inline `Set<string>` stamp at R4 was a layer-scope violation; this revision
// removes it without lifting stampScope into R0, which would itself violate T1.4
// — pure functions are R1 Logic, never R0 Atoms).
export async function loadAllNodes(userId: string | null): Promise<Result<Map<NodeId, MemNodeRow>>> {
  try {
    const result = await db.query<{
      id: string; content: string; embedding: string | null; source_text: string | null
      created_at: string; last_traversed: string | null
      cached_layer: number; cached_closure: number; cached_asymmetry: number
      user_id: string | null
    }>(`SELECT id, content, embedding, source_text, created_at, last_traversed, cached_layer, cached_closure, cached_asymmetry, user_id FROM mem_node WHERE user_id IS NOT DISTINCT FROM $1`, [userId])

    const nodes = new Map<NodeId, MemNodeRow>()
    for (const row of result.rows) {
      // brand: external origin — DB row id becomes NodeId at F-memory ingress
      const nodeId = row.id as NodeId
      nodes.set(nodeId, {
        id:              nodeId,
        userId:          row.user_id,
        content:         row.content,
        embedding:       row.embedding ? parseEmbedding(row.embedding) : null,
        sourceText:      row.source_text,
        createdAt:       new Date(row.created_at).getTime(),
        lastTraversed:   row.last_traversed ? new Date(row.last_traversed).getTime() : null,
        cachedLayer:     row.cached_layer as MLayer,
        cachedClosure:   row.cached_closure,
        cachedAsymmetry: row.cached_asymmetry,
      })
    }
    return { ok: true, data: nodes }
  } catch (err) {
    return { ok: false, error: dbError('NODES_LOAD_FAILED', err) }
  }
}

// Amendment 1+3: +userId param, SELECT includes primitive_type + created_at + user_id.
// Maps primitive_type (snake_case DB) → primitiveType (camelCase TS).
// Maps created_at timestamp → unix ms number.
export async function loadAllEdges(userId: string | null): Promise<Result<Map<NodeId, MemEdge[]>>> {
  try {
    const result = await db.query<{
      from_id: string; to_id: string; weight: number
      primitive_type: EdgePrimitiveType | null; created_at: string; user_id: string | null
    }>(`SELECT from_id, to_id, weight, primitive_type, created_at, user_id FROM mem_edge WHERE user_id IS NOT DISTINCT FROM $1`, [userId])

    const edges = new Map<NodeId, MemEdge[]>()
    for (const row of result.rows) {
      // brand: external origin — DB row from_id/to_id become NodeId at F-memory ingress
      const fromId = row.from_id as NodeId
      const toId   = row.to_id as NodeId
      const list = edges.get(fromId) ?? []
      list.push({
        fromId,
        toId,
        weight:        row.weight,
        primitiveType: row.primitive_type,
        createdAt:     new Date(row.created_at).getTime(),
        userId:        row.user_id,
      })
      edges.set(fromId, list)
    }
    return { ok: true, data: edges }
  } catch (err) {
    return { ok: false, error: dbError('EDGES_LOAD_FAILED', err) }
  }
}

// ─── Admin edge lookup (w3-20-admin-write) ────────────────────────────────────
// A4: I/O at R4. Used by R2 admin service for cascade delete.

export async function loadEdgesForNode(
  nodeId: NodeId,
  userId: string | null,
): Promise<Result<Array<{ fromId: NodeId; toId: NodeId }>>> {
  try {
    const result = await db.query<{ from_id: string; to_id: string }>(
      `SELECT from_id, to_id FROM mem_edge
       WHERE (from_id = $1 OR to_id = $1) AND user_id IS NOT DISTINCT FROM $2`,
      [nodeId, userId],
    )
    return {
      ok: true,
      // brand: external origin — DB row from_id/to_id become NodeId at F-memory ingress
      data: result.rows.map((row) => ({ fromId: row.from_id as NodeId, toId: row.to_id as NodeId })),
    }
  } catch (err) {
    return { ok: false, error: dbError('EDGES_FOR_NODE_LOAD_FAILED', err) }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseEmbedding(raw: string | number[]): number[] {
  if (Array.isArray(raw)) return raw
  try {
    return JSON.parse(raw) as number[]
  } catch {
    return []
  }
}

function dbError(code: string, err: unknown): AppError {
  return {
    code,
    message: err instanceof Error ? err.message : String(err),
  }
}
