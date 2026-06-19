// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/features/F-memory/exec/substrate-repository.ts (d6d13c8).
//
// Substrate Postgres CRUD. I/O only; zero domain logic. Imports the row/config
// types and the raw pool only — no upward imports, no engine, no perimeter.
// Result<T> on all fallible operations. DB reads are the external-origin ingress
// boundary; raw row strings are cast to branded substrate refs at this layer.
//
// The portable store's scope-ordered read (readScopeRows) lives here. Scope
// ACCESS CONTROL is a perimeter responsibility, not the store's — the store reads
// whatever userId arrives, exactly as the canonical home does.

import { db } from '../db/client'
import { generateId } from '../types/primitives'
import type { Result } from '../types/primitives'
import type {
  StateChangeRecord,
  StateChangeId,
  PositionRef,
  ScopeRef,
  IdentityRef,
  Relation,
  SubstrateSourceRef,
  ContentClass,
} from '../types/substrate.types'
import type {
  StateChangeRow,
  SubstrateWriteValidated,
} from './substrate-config'
import { SUBSTRATE_TABLE_NAME } from './substrate-config'

// ─── Row inflation ────────────────────────────────────────────────────────────

function rowToRecord(row: StateChangeRow): StateChangeRecord {
  // brand: external origin — DB strings cast to branded substrate refs.
  // 027-nullable: cognition rows carry NULL identities/relations; represent as
  // empty arrays — the read-side mirror of the write (which omits the columns).
  const identities = row.identities != null
    ? (row.identities as string[]).map(s => s as IdentityRef)
    : ([] as IdentityRef[])
  const relations  = row.relations != null
    ? (row.relations as Relation[])
    : ([] as Relation[])

  return {
    id:       row.id as StateChangeId,
    userId:   row.user_id as string,
    content: { identities, relations },
    metadata: {
      time:     Number(row.time_ms),
      source: {
        channel:      row.source_channel as SubstrateSourceRef['channel'],
        contentClass: row.source_content_class as SubstrateSourceRef['contentClass'],
        scope:        row.source_scope as ScopeRef,
      },
      position: Number(row.position) as PositionRef,
    },
  }
}

// ─── Write (forward-additive, atomic commit) ──────────────────────────────────
// commitStateChange — inserts a single state-change row inside one transaction.
// Position is assigned by the database via the state_change_position_seq DEFAULT;
// the INSERT omits position, RETURNING position reads back the assigned value.

export async function commitStateChange(
  validated: SubstrateWriteValidated,
): Promise<Result<StateChangeRecord>> {
  const id: StateChangeId = generateId('sc') as StateChangeId

  try {
    const record = await db.transaction(async (tx) => {
      const inserted = await tx.query<{ position: string }>(
        `INSERT INTO ${SUBSTRATE_TABLE_NAME}
           (id, time_ms, source_channel, source_content_class, source_scope, user_id, identities, relations)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
         RETURNING position::text AS position`,
        [
          id,
          String(validated.time),
          validated.source.channel,
          validated.source.contentClass,
          validated.source.scope,
          validated.userId,
          JSON.stringify(validated.identities),
          JSON.stringify(validated.relations),
        ],
      )

      const position = Number(inserted.rows[0]?.position)
      if (!Number.isFinite(position)) {
        throw new Error('INSERT returned no position')
      }

      const built: StateChangeRecord = {
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
      return built
    })

    return { ok: true, data: record }
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

// ─── Revocation (in-band destructive exception) ───────────────────────────────
// commitRevocation — atomic delete of the target record. The revocation itself is
// NOT stored. Position gaps are honest: no renumbering after delete.

export async function commitRevocation(
  targetId: StateChangeId,
): Promise<Result<{ revokedId: StateChangeId; revokedPosition: PositionRef | null }>> {
  try {
    const result = await db.query<{ position: string }>(
      `DELETE FROM ${SUBSTRATE_TABLE_NAME} WHERE id = $1 RETURNING position::text AS position`,
      [targetId],
    )
    const row = result.rows[0]
    let revokedPosition: PositionRef | null = null
    if (row) {
      const p = Number(row.position)
      revokedPosition = Number.isFinite(p) ? (p as PositionRef) : null
    }
    return {
      ok: true,
      data: {
        revokedId: targetId,
        revokedPosition,
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
      `SELECT id, position::text AS position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
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
      `SELECT id, position::text AS position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
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

// ─── Identity recurrence ──────────────────────────────────────────────────────
// All state-changes whose identities array contains the anchor identity.
// Optional scope / contentClass / asOfPosition read-side conjuncts.

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
      `SELECT id, position::text AS position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
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

// ─── Role pattern ─────────────────────────────────────────────────────────────
// State-changes where the anchor identity appears under the given role. Delegates
// to readIdentityRecurrence and filters roles in TS.

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

// ─── Adjacency ────────────────────────────────────────────────────────────────
// Position-anchored ± window. Returns ordered ascending. Position gaps are honest.

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
      `SELECT id, position::text AS position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
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

// ─── Scope-ordered read ───────────────────────────────────────────────────────
// readScopeRows: the canonical substrate read — every StateChangeRecord for a
// userId, position ASC. userId-scoped: the substrate isolation floor. Optional
// contentClass filter. The store surface wraps this as readScope; the perimeter
// applies scope ACCESS CONTROL above the store, not here.

export async function readScopeRows(
  userId: string,
  contentClass?: ContentClass,
): Promise<Result<StateChangeRecord[]>> {
  try {
    const params: unknown[] = [userId]
    let contentClassClause = ''
    if (contentClass !== undefined) {
      params.push(contentClass)
      contentClassClause = ` AND source_content_class = $${params.length}`
    }
    const result = await db.query<StateChangeRow>(
      `SELECT id, position::text AS position, time_ms::text AS time_ms, source_channel, source_content_class, source_scope,
              user_id, identities, relations
         FROM ${SUBSTRATE_TABLE_NAME}
        WHERE user_id = $1${contentClassClause}
        ORDER BY position ASC`,
      params,
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

export async function getLastPosition(): Promise<Result<PositionRef | null>> {
  try {
    const result = await db.query<{ max: string | null }>(
      `SELECT MAX(position)::text AS max FROM ${SUBSTRATE_TABLE_NAME}`,
    )
    const raw = result.rows[0]?.max
    const max = raw === null || raw === undefined ? NaN : Number(raw)
    return {
      ok: true,
      data: Number.isFinite(max) ? (max as PositionRef) : null,
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
