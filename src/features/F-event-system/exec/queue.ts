// [F-event-system/R4/C2] Event queue — Postgres persistence
// R4: depends on R0 only.
// All database operations for the event queue.
// No business logic. No validation. R1 handles those.

import type { LivEvent, EventId, EventStatus } from '@/core/types/primitives'

// ─── Database schema (SQL) ───────────────────────────────────────────────────
// Run once during Phase 1 setup.

export const EVENT_QUEUE_SCHEMA = `
CREATE TABLE IF NOT EXISTS liv_events (
  id              TEXT        PRIMARY KEY,
  type            TEXT        NOT NULL CHECK (type IN ('immediate','scheduled','delayed','reactive')),
  slice           TEXT        NOT NULL,
  name            TEXT        NOT NULL,
  payload         JSONB       NOT NULL DEFAULT '{}',
  status          TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  scheduled_at    TIMESTAMPTZ,
  delay_ms        INTEGER,
  after_event_id  TEXT        REFERENCES liv_events(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at    TIMESTAMPTZ,
  error           TEXT
);

CREATE INDEX IF NOT EXISTS idx_liv_events_status   ON liv_events(status);
CREATE INDEX IF NOT EXISTS idx_liv_events_scheduled ON liv_events(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_liv_events_slice    ON liv_events(slice);
CREATE INDEX IF NOT EXISTS idx_liv_events_name     ON liv_events(name);
`

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEvent(row: Record<string, any>): LivEvent {
  return {
    id:            row.id,
    type:          row.type,
    slice:         row.slice,
    name:          row.name,
    payload:       row.payload ?? {},
    status:        row.status,
    scheduledAt:   row.scheduled_at ? new Date(row.scheduled_at) : undefined,
    delayMs:       row.delay_ms ?? undefined,
    afterEventId:  row.after_event_id ?? undefined,
    createdAt:     new Date(row.created_at),
    processedAt:   row.processed_at ? new Date(row.processed_at) : undefined,
    error:         row.error ?? undefined,
  }
}

// ─── DB interface ─────────────────────────────────────────────────────────────
// Injected at runtime. Keeps R4 independent of specific Postgres client.

export interface DbClient {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>
}

// ─── Operations ───────────────────────────────────────────────────────────────

export async function insertEvent(
  db: DbClient,
  event: Omit<LivEvent, 'createdAt'>
): Promise<LivEvent> {
  const { rows } = await db.query<Record<string, unknown>>(
    `INSERT INTO liv_events
       (id, type, slice, name, payload, status, scheduled_at, delay_ms, after_event_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      event.id,
      event.type,
      event.slice,
      event.name,
      JSON.stringify(event.payload),
      event.status,
      event.scheduledAt ?? null,
      event.delayMs ?? null,
      event.afterEventId ?? null,
    ]
  )
  return rowToEvent(rows[0])
}

export async function fetchPendingEvents(db: DbClient, limit = 100): Promise<LivEvent[]> {
  const { rows } = await db.query<Record<string, unknown>>(
    `SELECT * FROM liv_events
     WHERE status = 'pending'
       AND (type = 'immediate'
         OR (type = 'scheduled' AND scheduled_at <= now())
         OR (type = 'delayed'   AND created_at + (delay_ms || ' milliseconds')::interval <= now())
       )
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  )
  return rows.map(rowToEvent)
}

export async function fetchReactiveEvents(
  db: DbClient,
  completedEventId: EventId
): Promise<LivEvent[]> {
  const { rows } = await db.query<Record<string, unknown>>(
    `SELECT * FROM liv_events
     WHERE status = 'pending'
       AND type = 'reactive'
       AND after_event_id = $1`,
    [completedEventId]
  )
  return rows.map(rowToEvent)
}

export async function markProcessing(db: DbClient, id: EventId): Promise<void> {
  await db.query(
    `UPDATE liv_events SET status = 'processing' WHERE id = $1`,
    [id]
  )
}

export async function markCompleted(db: DbClient, id: EventId): Promise<void> {
  await db.query(
    `UPDATE liv_events SET status = 'completed', processed_at = now() WHERE id = $1`,
    [id]
  )
}

export async function markFailed(db: DbClient, id: EventId, error: string): Promise<void> {
  await db.query(
    `UPDATE liv_events SET status = 'failed', processed_at = now(), error = $2 WHERE id = $1`,
    [id, error]
  )
}

export async function fetchById(db: DbClient, id: EventId): Promise<LivEvent | null> {
  const { rows } = await db.query<Record<string, unknown>>(
    `SELECT * FROM liv_events WHERE id = $1`,
    [id]
  )
  return rows.length > 0 ? rowToEvent(rows[0]) : null
}
