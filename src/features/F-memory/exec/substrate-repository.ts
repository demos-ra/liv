// @liv-standard v1.5.1
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring), sprint-12-shot-2 (LM v3.2: user_id column), sprint-b2-shot-3 (exportByScope: §3.11 userId index scan), side-quest-shot-1 (substrate v1.8.3: source_content_class column read/written; row→record populates contentClass per A-24), present-rederive-shot-1 (LM v3.4/v3.5: readIdentityRecurrence/readRolePattern/readAdjacency gain contentClass? + asOfPosition? optional WHERE conjuncts — v3.4 contentClass? deferred plumbing landed; v3.5 asOfPosition? Reading-A ceiling added)
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM    StateChangeRecord       core/R5 substrate.types
//   W-ATOM    StateChangeRow          F-memory/R0 substrate-config
//   W-ATOM    SubstrateWriteValidated F-memory/R0 substrate-config
//   W-ATOM    IdentityRef             core/R5 substrate.types
//   W-ATOM    PositionRef             core/R5 substrate.types
//   W-ATOM    ScopeRef                core/R5 substrate.types
//   W-ATOM    StateChangeId           core/R5 substrate.types
//   W-CONST   SUBSTRATE_TABLE_NAME    F-memory/R0 substrate-config
//   W-INJECT  db                      core/R5
// wires-out:  none (consumed by R2 substrate-service)
//   W-FN      exportByScope           →  F-memory/R2 substrate-service (sprint-b2-shot-3)
// deps:
//   R0  ../config/substrate-config
//   R5  @/core/db/client
//   R5  @/core/types/substrate.types
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v3.2 — substrate Postgres CRUD.
// R4: I/O only. Zero domain logic.
// A4: all I/O isolated at R4.
// A2: imports R0 types and R5 db client only. No upward imports.
// Result<T> on all fallible operations.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
//
// DB row → typed atom boundary:
//   DB reads are the external-origin ingress boundary. Raw row strings are cast
//   to branded substrate refs at this layer.
//   Every cast site tagged `// brand: external origin`.
//
// Atomicity (LMA4):
//   writeStateChange + revokeStateChange both run inside a single Postgres
//   transaction. Position assignment, content insert, and (if present)
//   revocation delete commit together — all or nothing.

import { db } from '@/core/db/client'
import { generateId } from '@/core/types/primitives'
import type { Result } from '@/core/types/primitives'
import type {
  StateChangeRecord,
  StateChangeId,
  PositionRef,
  ScopeRef,
  IdentityRef,
  Relation,
  SubstrateSourceRef,
  ContentClass,
} from '@/core/types/substrate.types'
import type {
  StateChangeRow,
  SubstrateWriteValidated,
} from '../config/substrate-config'
import { SUBSTRATE_TABLE_NAME } from '../config/substrate-config'

// ─── Row inflation ────────────────────────────────────────────────────────────

function rowToRecord(row: StateChangeRow): StateChangeRecord {
  // brand: external origin — DB strings cast to branded substrate refs
  const identities = (row.identities as string[]).map(s => s as IdentityRef)
  const relations  = (row.relations as Relation[])   // brand: external origin (validated at write)

  return {
    id:       row.id as StateChangeId,                 // brand: external origin
    userId:   row.user_id as string,                   // brand: external origin (v3.2 LMA12)
    content: { identities, relations },
    metadata: {
      time:     Number(row.time_ms),
      source: {
        channel:      row.source_channel as SubstrateSourceRef['channel'],
        contentClass: row.source_content_class as SubstrateSourceRef['contentClass'],  // v1.8.3 A-24
        scope:        row.source_scope as ScopeRef,    // brand: external origin
      },
      position: row.position as PositionRef,           // brand: external origin (number)
    },
  }
}

// ─── Position assignment (monotonic, Axis 1) ──────────────────────────────────
// LMA10: Axis 1 is positions. Monotonic integer next-in-sequence.
// Read inside the same transaction as insert to avoid race against concurrent
// writers. SELECT MAX returns NULL on empty table → 0 → next position 1.

async function nextPosition(client: {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: { max: number | null }[] }>
}): Promise<number> {
  const result = await client.query(
    `SELECT MAX(position) AS max FROM ${SUBSTRATE_TABLE_NAME}`,
  )
  const max = result.rows[0]?.max
  return (typeof max === 'number' ? max : 0) + 1
}

// ─── Write (LMA1 + LMA4: forward-additive, atomic commit) ─────────────────────
// commitStateChange — inserts a single state-change row inside one transaction.
// Position is assigned within the transaction. Returns the persisted record.

export async function commitStateChange(
  validated: SubstrateWriteValidated,
): Promise<Result<StateChangeRecord>> {
  const id: StateChangeId = generateId('sc') as StateChangeId
  // brand: locally minted — id generated for this commit

  try {
    // Get a dedicated client to run a transaction.
    // db.query is a pool helper — use the pool client directly for tx.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require('pg') as typeof import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Position assignment inside the transaction (LMA10 monotonic guarantee
      // under serializable isolation; for read-committed we rely on row-level
      // locking via the SELECT FOR UPDATE pattern, but with a single-writer
      // insert path the SELECT MAX inside BEGIN is sufficient at this load).
      const position = (validated.position as number) > 0
        ? (validated.position as number)
        : await nextPosition(client)

      await client.query(
        `INSERT INTO ${SUBSTRATE_TABLE_NAME}
           (id, position, time_ms, source_channel, source_content_class, source_scope, user_id, identities, relations)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)`,
        [
          id,
          position,
          String(validated.time),
          validated.source.channel,
          validated.source.contentClass,  // v1.8.3 A-24: stamped at construction site
          validated.source.scope,
          validated.userId,
          JSON.stringify(validated.identities),
          JSON.stringify(validated.relations),
        ],
      )

      await client.query('COMMIT')

      const record: StateChangeRecord = {
        id,
        userId:  validated.userId,
        content: {
          identities: validated.identities,
          relations:  validated.relations,
        },
        metadata: {
          time:     validated.time,
          source:   validated.source,
          position: position as PositionRef,
        },
      }

      return { ok: true, data: record }
    } catch (err) {
      await client.query('ROLLBACK').catch(() => { /* ignore rollback failure */ })
      throw err
    } finally {
      client.release()
      await pool.end().catch(() => { /* pool close best-effort */ })
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_COMMIT_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Revocation (LMA2: in-band destructive exception) ─────────────────────────
// commitRevocation — atomic: deletes target StateChangeRecord identified by
// the relation's identitiesWithRoles. The revocation itself is NOT stored.
// Position gaps are honest (LMA2): no renumbering after delete.
//
// The "target" is identified by an identitiesWithRoles entry whose identity
// is a StateChangeId-shaped IdentityRef. Convention (Decision-D-4): when SW3
// sees a top-level relation with type=REVOKE_REF, it interprets the first
// identitiesWithRoles[0].identity as the target StateChangeId. Caller (perimeter)
// constructs the relation accordingly.

export async function commitRevocation(
  targetId: StateChangeId,
): Promise<Result<{ revokedId: StateChangeId; revokedPosition: PositionRef | null }>> {
  try {
    // Single statement = atomic at the DB level. Returning clause gives us
    // the position for emission (so callers can emit the revoked event).
    const result = await db.query<{ position: number }>(
      `DELETE FROM ${SUBSTRATE_TABLE_NAME} WHERE id = $1 RETURNING position`,
      [targetId],
    )
    const row = result.rows[0]
    return {
      ok: true,
      data: {
        revokedId: targetId,
        revokedPosition: row ? (row.position as PositionRef) : null,
      },
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_REVOKE_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Read by position ─────────────────────────────────────────────────────────

export async function readByPosition(
  position: PositionRef,
): Promise<Result<StateChangeRecord | null>> {
  try {
    const result = await db.query<StateChangeRow>(
      `SELECT id, position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE position = $1`,
      [position],
    )
    const row = result.rows[0]
    return { ok: true, data: row ? rowToRecord(row) : null }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_READ_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Iterate Axis 1 (raw scan) ────────────────────────────────────────────────
// iterateAxis: forward or backward from start position, up to count rows.
// Used by adjacency thread query (TQ3) and by general axis-walking consumers.

export async function iterateAxisRows(
  start: PositionRef,
  direction: 'forward' | 'backward',
  count: number,
): Promise<Result<StateChangeRecord[]>> {
  if (count <= 0) return { ok: true, data: [] }

  const op    = direction === 'forward' ? '>=' : '<='
  const order = direction === 'forward' ? 'ASC' : 'DESC'

  try {
    const result = await db.query<StateChangeRow>(
      `SELECT id, position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE position ${op} $1
        ORDER BY position ${order}
        LIMIT $2`,
      [start, count],
    )
    return { ok: true, data: result.rows.map(rowToRecord) }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_ITERATE_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Identity recurrence (TQ3 thread kind: 'identity-recurrence') ─────────────
// All state-changes whose identities array contains the anchor identity.
// Optionally scope-filtered.
//
// present-rederive-shot-1: two optional read-side filters added.
//   contentClass? — LM v3.4 LMA13 filter (type added at v3.4; repository
//     read-path plumbing deferred to "the F-present build sprint" — landed here).
//     Applied as `AND source_content_class = $n`.
//   asOfPosition? — LM v3.5 Reading-A position ceiling. Applied as
//     `AND position <= $n` — an open-ended ceiling: every state-change at or
//     before the standpoint position. NOT count-limited, NOT direction-dispatched
//     (it is not the iterateAxisRows clause — that scan is LIMIT-bounded and
//     direction='backward'/'forward' dispatched; this is a fresh conjunct on this
//     function's own WHERE clause).
// Both conjuncts are independently optional: absent ⇒ no conjunct emitted.
// They compose by AND with each other and with the existing scope and limit
// clauses. Parameter indices assigned in the existing incremental-`params` style.

export async function readIdentityRecurrence(
  anchor: IdentityRef,
  scope?: ScopeRef,
  limit?: number,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<StateChangeRecord[]>> {
  try {
    const params: unknown[] = [JSON.stringify([anchor])]
    let scopeClause = ''
    if (scope !== undefined) {
      params.push(scope)
      scopeClause = ` AND source_scope = $${params.length}`
    }
    let contentClassClause = ''
    if (contentClass !== undefined) {
      params.push(contentClass)
      contentClassClause = ` AND source_content_class = $${params.length}`
    }
    let asOfClause = ''
    if (asOfPosition !== undefined) {
      params.push(asOfPosition)
      asOfClause = ` AND position <= $${params.length}`
    }
    let limitClause = ''
    if (typeof limit === 'number' && limit > 0) {
      params.push(limit)
      limitClause = ` LIMIT $${params.length}`
    }

    const result = await db.query<StateChangeRow>(
      `SELECT id, position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE identities @> $1::jsonb${scopeClause}${contentClassClause}${asOfClause}
        ORDER BY position ASC${limitClause}`,
      params,
    )
    return { ok: true, data: result.rows.map(rowToRecord) }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_RECURRENCE_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Role pattern (TQ3 thread kind: 'role-pattern') ───────────────────────────
// State-changes where the anchor identity appears under the given role
// in any relation's identitiesWithRoles array.
//
// Implementation: filter at SQL level by identity presence (fast path);
// role match applied in TS by walking the relations JSON for each row.
// Acceptable at current scale; an (identity, role) GIN index can replace
// the TS walk if needed (see substrate-config SUBSTRATE_INDICES.identityRole).
//
// present-rederive-shot-1: readRolePattern has no SQL of its own — it delegates
// to readIdentityRecurrence and filters roles in TS. It gains both optional
// parameters (contentClass?, asOfPosition?) and passes them straight through to
// readIdentityRecurrence, where the WHERE conjuncts are applied.

export async function readRolePattern(
  anchor: IdentityRef,
  role: string,
  scope?: ScopeRef,
  limit?: number,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<StateChangeRecord[]>> {
  const recurrence = await readIdentityRecurrence(anchor, scope, limit, contentClass, asOfPosition)
  if (!recurrence.ok) return recurrence

  const matches = recurrence.data.filter(record =>
    record.content.relations.some(rel =>
      rel.identitiesWithRoles.some(iwr =>
        iwr.identity === anchor && iwr.role === role,
      ),
    ),
  )
  return { ok: true, data: matches }
}

// ─── Adjacency (TQ3 thread kind: 'adjacency') ─────────────────────────────────
// Position-anchored ± window. Returns ordered ascending. Position gaps are
// honest (LMA2) — gaps are skipped without error.
//
// present-rederive-shot-1: two optional read-side filters added.
//   contentClass? — LM v3.4 LMA13 filter. Applied as `AND source_content_class = $n`.
//   asOfPosition? — LM v3.5 Reading-A position ceiling. Applied as
//     `AND position <= $n` — it clips the upper edge of the BETWEEN window at the
//     standpoint: a window whose far edge is beyond the standpoint is restricted
//     to the standpoint. Open-ended ceiling, composes by AND with the window.
// Both conjuncts independently optional; parameter indices in incremental style.

export async function readAdjacency(
  anchor: PositionRef,
  window: number,
  scope?: ScopeRef,
  contentClass?: ContentClass,
  asOfPosition?: PositionRef,
): Promise<Result<StateChangeRecord[]>> {
  if (window <= 0) return { ok: true, data: [] }

  try {
    const params: unknown[] = [anchor, window]
    let scopeClause = ''
    if (scope !== undefined) {
      params.push(scope)
      scopeClause = ` AND source_scope = $${params.length}`
    }
    let contentClassClause = ''
    if (contentClass !== undefined) {
      params.push(contentClass)
      contentClassClause = ` AND source_content_class = $${params.length}`
    }
    let asOfClause = ''
    if (asOfPosition !== undefined) {
      params.push(asOfPosition)
      asOfClause = ` AND position <= $${params.length}`
    }

    const result = await db.query<StateChangeRow>(
      `SELECT id, position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE position BETWEEN ($1::int - $2::int) AND ($1::int + $2::int)${scopeClause}${contentClassClause}${asOfClause}
        ORDER BY position ASC`,
      params,
    )
    return { ok: true, data: result.rows.map(rowToRecord) }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_ADJACENCY_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Export by scope (§3.11 userId index scan) ────────────────────────────────
// exportByScope: returns all StateChangeRecords for a given userId, ordered by
// position ASC. Uses the userId index declared at LM v3.1 §3.11 (scope → positions).
// R4 I/O only — zero domain logic. Additive: no existing primitive signature changed.

export async function exportByScope(
  userId: string,
): Promise<Result<StateChangeRecord[]>> {
  try {
    const result = await db.query<StateChangeRow>(
      `SELECT id, position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE user_id = $1
        ORDER BY position ASC`,
      [userId],
    )
    return { ok: true, data: result.rows.map(rowToRecord) }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_EXPORT_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── Last-position helper (boot) ──────────────────────────────────────────────
// Used at boot to surface the highest position for observability and to
// initialize position counters if implementation changes from SELECT MAX
// per-write to a cached counter.

export async function getLastPosition(): Promise<Result<PositionRef | null>> {
  try {
    const result = await db.query<{ max: number | null }>(
      `SELECT MAX(position) AS max FROM ${SUBSTRATE_TABLE_NAME}`,
    )
    const max = result.rows[0]?.max
    return {
      ok: true,
      data: typeof max === 'number' ? (max as PositionRef) : null,
    }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:    'SUBSTRATE_LAST_POSITION_FAILED',
        message: err instanceof Error ? err.message : String(err),
      },
    }
  }
}

// ─── End ──────────────────────────────────────────────────────────────────────
