// @liv-standard v1.3
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  MemNode          F-memory/R0
//   W-ATOM  MemEdge          F-memory/R0
//   W-ATOM  MemArm           F-memory/R0
//   W-ATOM  DominanceEntry   F-memory/R0
//   W-ATOM  MLayer           F-memory/R0
//   W-INJECT db              core/R5
// wires-out:  none (consumed by R4 graph-io, R2 service)
// deps:
//   R0  ../config/memory-types
//   R5  @/core/db/client
// validated:  pending

// Living Memory v1.0 — all Postgres CRUD.
// R4: I/O only. Zero domain logic.
// A4: all I/O isolated at R4.
// A2: imports R0 types and R5 db client only. No upward imports.
// Result<T> on all fallible operations per CC.07.

import { db } from '@/core/db/client'
import type { Result, AppError } from '@/core/types/primitives'
import type {
  MemNode,
  MemEdge,
  MemArm,
  DominanceEntry,
  MLayer,
} from '../config/memory-types'

// ─── Node operations ──────────────────────────────────────────────────────────

export async function upsertNode(node: MemNode): Promise<Result<void>> {
  try {
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
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_UPSERT_FAILED', err) }
  }
}

export async function deleteNode(nodeId: string): Promise<Result<void>> {
  try {
    await db.query(`DELETE FROM mem_node WHERE id = $1`, [nodeId])
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('NODE_DELETE_FAILED', err) }
  }
}

export async function updateNodeSourceText(nodeId: string, sourceText: string | null): Promise<Result<void>> {
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
  nodeId: string,
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

export async function touchNodeTraversal(nodeId: string, timestamp: number): Promise<Result<void>> {
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
    await db.query(
      `INSERT INTO mem_edge (from_id, to_id, weight)
       VALUES ($1, $2, $3)
       ON CONFLICT (from_id, to_id) DO UPDATE SET weight = EXCLUDED.weight`,
      [edge.fromId, edge.toId, edge.weight],
    )
    return { ok: true, data: undefined }
  } catch (err) {
    return { ok: false, error: dbError('EDGE_UPSERT_FAILED', err) }
  }
}

export async function deleteEdge(fromId: string, toId: string): Promise<Result<void>> {
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
    await db.query(
      `INSERT INTO mem_arm (id, label, node_ids, depth, updated_at)
       VALUES ($1, $2, $3, $4, to_timestamp($5::double precision / 1000))
       ON CONFLICT (id) DO UPDATE SET
         label      = EXCLUDED.label,
         node_ids   = EXCLUDED.node_ids,
         depth      = EXCLUDED.depth,
         updated_at = EXCLUDED.updated_at`,
      [arm.id, arm.label, arm.nodeIds, arm.depth, arm.updatedAt],
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

export async function loadArms(): Promise<Result<MemArm[]>> {
  try {
    const result = await db.query<{
      id: string; label: string | null; node_ids: string[]; depth: number; updated_at: string
    }>(`SELECT id, label, node_ids, depth, updated_at FROM mem_arm`)

    return {
      ok: true,
      data: result.rows.map(row => ({
        id:        row.id,
        label:     row.label,
        nodeIds:   row.node_ids,
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

export async function loadDominance(): Promise<Result<Map<string, DominanceEntry>>> {
  try {
    const result = await db.query<{
      node_id: string; convergence: number; computed_at: string
    }>(`SELECT node_id, convergence, computed_at FROM mem_dominance`)

    const map = new Map<string, DominanceEntry>()
    for (const row of result.rows) {
      map.set(row.node_id, {
        nodeId:      row.node_id,
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

export async function loadAllNodes(): Promise<Result<Map<string, MemNode>>> {
  try {
    const result = await db.query<{
      id: string; content: string; embedding: string | null; source_text: string | null
      created_at: string; last_traversed: string | null
      cached_layer: number; cached_closure: number; cached_asymmetry: number
    }>(`SELECT id, content, embedding, source_text, created_at, last_traversed, cached_layer, cached_closure, cached_asymmetry FROM mem_node`)

    const nodes = new Map<string, MemNode>()
    for (const row of result.rows) {
      nodes.set(row.id, {
        id:              row.id,
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

export async function loadAllEdges(): Promise<Result<Map<string, MemEdge[]>>> {
  try {
    const result = await db.query<{
      from_id: string; to_id: string; weight: number
    }>(`SELECT from_id, to_id, weight FROM mem_edge`)

    const edges = new Map<string, MemEdge[]>()
    for (const row of result.rows) {
      const list = edges.get(row.from_id) ?? []
      list.push({ fromId: row.from_id, toId: row.to_id, weight: row.weight })
      edges.set(row.from_id, list)
    }
    return { ok: true, data: edges }
  } catch (err) {
    return { ok: false, error: dbError('EDGES_LOAD_FAILED', err) }
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
