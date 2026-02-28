// [F-memory/R4/C5] Memory repository — all Postgres I/O
// R4: I/O only. Zero domain logic. Imports R0 types and core db client.
// All mutations are atomic where noted. No business rules here.

import { db } from '@/core/db/client'
import type { MemNode, MemEdge, MemGraph, GraphMutation } from '../config/memory-types'

// ─── Node operations ──────────────────────────────────────────────────────────

export async function upsertNode(node: MemNode): Promise<void> {
  await db.query(
    `INSERT INTO mem_nodes (id, type, persistence, timestamp, concept_id)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       persistence = EXCLUDED.persistence,
       timestamp   = EXCLUDED.timestamp`,
    [node.id, node.type, node.persistence, node.timestamp ?? null, null]
  )
}

// ─── Edge operations ──────────────────────────────────────────────────────────

export async function upsertEdge(edge: MemEdge): Promise<void> {
  await db.query(
    `INSERT INTO mem_edges (from_id, to_id, weight)
     VALUES ($1, $2, $3)
     ON CONFLICT (from_id, to_id) DO UPDATE SET weight = EXCLUDED.weight`,
    [edge.fromId, edge.toId, edge.weight]
  )
}

export async function deleteEdge(fromId: string, toId: string): Promise<void> {
  await db.query(
    `DELETE FROM mem_edges WHERE from_id = $1 AND to_id = $2`,
    [fromId, toId]
  )
}

// ─── Atomic mutation commit ───────────────────────────────────────────────────

export async function commitMutation(mutation: GraphMutation): Promise<void> {
  await db.query('BEGIN', [])
  try {
    for (const node of mutation.nodeUpserts) {
      await upsertNode(node)
    }
    for (const edge of mutation.edgeUpserts) {
      await db.query(
        `INSERT INTO mem_nodes (id, type, persistence)
         VALUES ($1, 'concept', 0.1)
         ON CONFLICT (id) DO NOTHING`,
        [edge.fromId]
      )
      await db.query(
        `INSERT INTO mem_nodes (id, type, persistence)
         VALUES ($1, 'concept', 0.1)
         ON CONFLICT (id) DO NOTHING`,
        [edge.toId]
      )
      await upsertEdge(edge)
    }
    for (const edgeId of mutation.edgeDeletes) {
      const [fromId, toId] = edgeId.split(':')
      if (fromId && toId) await deleteEdge(fromId, toId)
    }
    await db.query('COMMIT', [])
  } catch (err) {
    await db.query('ROLLBACK', [])
    throw err
  }
}

// ─── Graph load ───────────────────────────────────────────────────────────────

export async function loadGraph(): Promise<MemGraph> {
  const nodeRows = await db.query<{
    id: string; type: string; persistence: number; timestamp: number | null
  }>(`SELECT id, type, persistence, timestamp FROM mem_nodes`)

  const edgeRows = await db.query<{
    from_id: string; to_id: string; weight: number
  }>(`SELECT from_id, to_id, weight FROM mem_edges`)

  const nodes = new Map<string, MemNode>()
  for (const row of nodeRows.rows) {
    nodes.set(row.id, {
      id:          row.id,
      type:        row.type as 'concept' | 'episode',
      persistence: row.persistence,
      timestamp:   row.timestamp ?? undefined,
    })
  }

  const edges = new Map<string, MemEdge[]>()
  for (const row of edgeRows.rows) {
    const list = edges.get(row.from_id) ?? []
    list.push({ fromId: row.from_id, toId: row.to_id, weight: row.weight })
    edges.set(row.from_id, list)
  }

  return { nodes, edges }
}

// ─── Candidate / vocab operations ─────────────────────────────────────────────

export async function upsertCandidate(text: string): Promise<number> {
  const result = await db.query<{ count: number }>(
    `INSERT INTO mem_concept_candidates (text, count)
     VALUES ($1, 1)
     ON CONFLICT (text) DO UPDATE SET count = mem_concept_candidates.count + 1
     RETURNING count`,
    [text]
  )
  return result.rows[0]?.count ?? 1
}

export async function upsertVocab(
  id:          string,
  text:        string,
  embedding:   number[],
  persistence: number
): Promise<void> {
  await db.query(
    `INSERT INTO mem_concept_vocab (id, text, embedding, persistence)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [id, text, JSON.stringify(embedding), persistence]
  )
  await db.query(
    `INSERT INTO mem_nodes (id, type, persistence, concept_id)
     VALUES ($1, 'concept', $2, $1)
     ON CONFLICT (id) DO UPDATE SET persistence = EXCLUDED.persistence`,
    [id, persistence]
  )
}

export async function lookupVocab(text: string): Promise<MemNode | null> {
  const result = await db.query<{
    id: string; embedding: number[] | string; persistence: number
  }>(
    `SELECT id, embedding, persistence FROM mem_concept_vocab WHERE text = $1`,
    [text]
  )
  if (result.rows.length === 0) return null
  const row = result.rows[0]

  // pg returns jsonb columns as already-parsed JS values — no JSON.parse needed.
  // Guard for both cases in case driver version differs.
  const embedding: number[] = Array.isArray(row.embedding)
    ? row.embedding as number[]
    : JSON.parse(row.embedding as string) as number[]

  return {
    id:          row.id,
    type:        'concept',
    persistence: row.persistence,
    embedding,
  }
}

// ─── Co-occurrence operations ──────────────────────────────────────────────────

export async function incrementCooccurrence(tokenA: string, tokenB: string): Promise<void> {
  const [a, b] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  await db.query(
    `INSERT INTO mem_concept_cooccurrences (token_a, token_b, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (token_a, token_b) DO UPDATE
       SET count = mem_concept_cooccurrences.count + 1`,
    [a, b]
  )
}

export async function getCooccurrenceCount(tokenA: string, tokenB: string): Promise<number> {
  const [a, b] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const result = await db.query<{ count: number }>(
    `SELECT count FROM mem_concept_cooccurrences WHERE token_a = $1 AND token_b = $2`,
    [a, b]
  )
  return result.rows[0]?.count ?? 0
}

export async function getConceptCount(token: string): Promise<number> {
  const result = await db.query<{ count: number }>(
    `SELECT count FROM mem_concept_candidates WHERE text = $1`,
    [token]
  )
  return result.rows[0]?.count ?? 0
}
