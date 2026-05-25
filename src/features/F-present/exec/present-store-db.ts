// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R4]
// Built with LIV · livai.dev
// [F-present/exec/present-store-db.ts]
// Sprint Item-1 — Shot 1c (per-user disk backing for the four F-present stores)
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    item-1-storage
// slice:      F-present
// layer:      R4
// wires-in:
//   W-ATOM  PRESENT_STORE_POLICY  ../config/present-config
//   W-ATOM  PresentFrame/GranularityDial/SnapshotArchiveEntry/Window  ../config/present-types
// wires-out:
//   W-FN  storeHeldPresent / readHeldPresentRow      →  F-present/R4 (present-execution)
//   W-FN  storeDial / readDialRow                    →  F-present/R4 (present-execution)
//   W-FN  storeArchiveEntry / readArchiveEntryRow    →  F-present/R4 (present-execution)
//   W-FN  listArchivePositionsRow                    →  F-present/R4 (present-execution)
//   W-FN  appendWindowRow                            →  F-present/R4 (present-execution)
// deps:
//   R0  ../config/present-config
//   R0  ../config/present-types
//   R5  @/core/db/client
// validated:  pending
//
// R4 — Execution / I/O layer. A4 (LIV-Standard v1.5.2 — Isolated execution):
// all disk I/O lives here; no business logic beyond row-mapping. A6: every
// type imported from R0 (present-config / present-types).
//
// This module is the durable backing for F-present's four own stores. It
// REPLACES the in-process Maps that present-execution.ts held at v6.0. The
// substrate is NOT one of these stores — F-present is a non-emitter ([R1]);
// nothing here writes the substrate.
//
// POLICY OBEDIENCE. Each store's persist-vs-derive comes from
// PRESENT_STORE_POLICY in present-config.ts — this module READS it and acts on
// it (a persisted store hits disk; a non-persisted store would no-op its write
// and return the in-memory/recompute path). It does not CONTAIN the policy.
//
// PROPRIETARY BOUNDARY. These four tables are F-present-owned and NOT
// user-downloadable. This module adds no export function; F-present's contract
// publishes only `present.read`. The boundary is structural-by-absence.

import { db }                  from '@/core/db/client'
import {
  PRESENT_STORE_POLICY,
  ARCHIVE_RETENTION,
}                               from '../config/present-config'
import type {
  PresentFrame,
  GranularityDial,
  SnapshotArchiveEntry,
  SnapshotArchiveKey,
  Window,
  UserId,
  ScopeRef,
  PositionRef,
} from '../config/present-types'

// ── R4 boundary Result type — peer: user-profile-db.ts ProfileResult<T> ───────
export type PresentStoreResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

function dbError(message: string, cause: unknown): { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } } {
  return { ok: false, error: { code: 'PRESENT_STORE_DB_ERROR', message, context: { cause: String(cause) } } }
}

// ── Store (2a) — held present — table present_held ────────────────────────────

/**
 * storeHeldPresent — upsert the live held PresentFrame for (userId, scopeRef).
 * Last-write-wins (PrG7). Obeys PRESENT_STORE_POLICY['held-present'].
 */
export async function storeHeldPresent(frame: PresentFrame): Promise<PresentStoreResult<void>> {
  if (!PRESENT_STORE_POLICY['held-present'].persisted) return { ok: true, data: undefined }
  try {
    await db.query(
      `INSERT INTO present_held (user_id, scope_ref, frame, updated_at)
       VALUES ($1, $2, $3::jsonb, now())
       ON CONFLICT (user_id, scope_ref)
       DO UPDATE SET frame = EXCLUDED.frame, updated_at = now()`,
      [frame.userId as string, frame.scopeRef as string, JSON.stringify(frame)],
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('storeHeldPresent failed', e)
  }
}

/**
 * readHeldPresentRow — the live held PresentFrame for (userId, scopeRef), or
 * null when none has been resolved. Pure read; row-mapping only.
 */
export async function readHeldPresentRow(
  userId: UserId, scopeRef: ScopeRef,
): Promise<PresentStoreResult<PresentFrame | null>> {
  try {
    const r = await db.query<{ frame: unknown }>(
      `SELECT frame FROM present_held WHERE user_id = $1 AND scope_ref = $2`,
      [userId as string, scopeRef as string],
    )
    if (!r.rows[0]) return { ok: true, data: null }
    const raw = r.rows[0].frame
    const frame = (typeof raw === 'string' ? JSON.parse(raw) : raw) as PresentFrame
    return { ok: true, data: frame }
  } catch (e) {
    return dbError('readHeldPresentRow failed', e)
  }
}

// ── Store (2b) — dial — table present_dial ────────────────────────────────────

/**
 * storeDial — upsert the lens (GranularityDial) for (userId, scopeRef).
 * Obeys PRESENT_STORE_POLICY['dial'].
 */
export async function storeDial(
  userId: UserId, scopeRef: ScopeRef, dial: GranularityDial,
): Promise<PresentStoreResult<void>> {
  if (!PRESENT_STORE_POLICY['dial'].persisted) return { ok: true, data: undefined }
  try {
    await db.query(
      `INSERT INTO present_dial (user_id, scope_ref, dial, updated_at)
       VALUES ($1, $2, $3::jsonb, now())
       ON CONFLICT (user_id, scope_ref)
       DO UPDATE SET dial = EXCLUDED.dial, updated_at = now()`,
      [userId as string, scopeRef as string, JSON.stringify(dial)],
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('storeDial failed', e)
  }
}

/**
 * readDialRow — the stored GranularityDial for (userId, scopeRef), or null when
 * none has been set (the caller applies the default). Pure read.
 */
export async function readDialRow(
  userId: UserId, scopeRef: ScopeRef,
): Promise<PresentStoreResult<GranularityDial | null>> {
  try {
    const r = await db.query<{ dial: unknown }>(
      `SELECT dial FROM present_dial WHERE user_id = $1 AND scope_ref = $2`,
      [userId as string, scopeRef as string],
    )
    if (!r.rows[0]) return { ok: true, data: null }
    const raw = r.rows[0].dial
    const dial = (typeof raw === 'string' ? JSON.parse(raw) : raw) as GranularityDial
    return { ok: true, data: dial }
  } catch (e) {
    return dbError('readDialRow failed', e)
  }
}

// ── Store (2c) — window set — table present_window ────────────────────────────

/**
 * appendWindowRow — append one Window to the accumulating set for
 * (userId, scopeRef). Windows accumulate ([R12]) — INSERT, never replace.
 * Obeys PRESENT_STORE_POLICY['window-set'].
 */
export async function appendWindowRow(
  userId: UserId, scopeRef: ScopeRef, window: Window,
): Promise<PresentStoreResult<void>> {
  if (!PRESENT_STORE_POLICY['window-set'].persisted) return { ok: true, data: undefined }
  try {
    await db.query(
      `INSERT INTO present_window (window_id, user_id, scope_ref, window, opened_at)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (window_id) DO NOTHING`,
      [
        window.windowId as string,
        userId as string,
        scopeRef as string,
        JSON.stringify(window),
        window.openedAt as unknown as number,
      ],
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('appendWindowRow failed', e)
  }
}

/**
 * listWindowRows — the accumulated Window set for (userId, scopeRef), in the
 * order opened (the look-trail). Pure read; row-mapping only.
 */
export async function listWindowRows(
  userId: UserId, scopeRef: ScopeRef,
): Promise<PresentStoreResult<Window[]>> {
  try {
    const r = await db.query<{ window: unknown }>(
      `SELECT window FROM present_window
       WHERE user_id = $1 AND scope_ref = $2
       ORDER BY opened_at ASC`,
      [userId as string, scopeRef as string],
    )
    const windows = r.rows.map(row => {
      const raw = row.window
      return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Window
    })
    return { ok: true, data: windows }
  } catch (e) {
    return dbError('listWindowRows failed', e)
  }
}

// ── Store (3) — present archive — table present_archive ───────────────────────

/**
 * storeArchiveEntry — write a resolved present to the per-user archive ([R15]),
 * keyed (userId, scopeRef, position). Obeys PRESENT_STORE_POLICY['archive'].
 * Retention (ARCHIVE_RETENTION) governs post-write pruning: 'keepAll' prunes
 * nothing; { keepDays } prunes entries older than the cutoff.
 */
export async function storeArchiveEntry(
  entry: SnapshotArchiveEntry,
): Promise<PresentStoreResult<void>> {
  if (!PRESENT_STORE_POLICY['archive'].persisted) return { ok: true, data: undefined }
  try {
    const key = entry.archiveKey
    await db.query(
      `INSERT INTO present_archive (user_id, scope_ref, position, entry, archived_at)
       VALUES ($1, $2, $3, $4::jsonb, $5)
       ON CONFLICT (user_id, scope_ref, position)
       DO UPDATE SET entry = EXCLUDED.entry, archived_at = EXCLUDED.archived_at`,
      [
        key.userId as string,
        key.scopeRef as string,
        key.position as unknown as number,
        JSON.stringify(entry),
        entry.archivedAt as unknown as number,
      ],
    )
    // Retention — obeys ARCHIVE_RETENTION (present-config.ts). keepAll: no prune.
    if (ARCHIVE_RETENTION !== 'keepAll') {
      const cutoffMs = Date.now() - ARCHIVE_RETENTION.keepDays * 86_400_000
      await db.query(
        `DELETE FROM present_archive
         WHERE user_id = $1 AND scope_ref = $2 AND archived_at < $3`,
        [key.userId as string, key.scopeRef as string, cutoffMs],
      )
    }
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('storeArchiveEntry failed', e)
  }
}

/**
 * readArchiveEntryRow — the scrub-back read ([R16]). Retrieves the archived
 * present at (userId, scopeRef, position), or null when none was archived
 * there. A LOOKUP — the present as it was actually resolved, not a recompute.
 */
export async function readArchiveEntryRow(
  userId: UserId, scopeRef: ScopeRef, position: PositionRef,
): Promise<PresentStoreResult<SnapshotArchiveEntry | null>> {
  try {
    const r = await db.query<{ entry: unknown }>(
      `SELECT entry FROM present_archive
       WHERE user_id = $1 AND scope_ref = $2 AND position = $3`,
      [userId as string, scopeRef as string, position as unknown as number],
    )
    if (!r.rows[0]) return { ok: true, data: null }
    const raw = r.rows[0].entry
    const entry = (typeof raw === 'string' ? JSON.parse(raw) : raw) as SnapshotArchiveEntry
    return { ok: true, data: entry }
  } catch (e) {
    return dbError('readArchiveEntryRow failed', e)
  }
}

/**
 * listArchivePositionsRow — the positions at which presents are archived for
 * (userId, scopeRef), ascending. Played in order, these are the movie's frames.
 */
export async function listArchivePositionsRow(
  userId: UserId, scopeRef: ScopeRef,
): Promise<PresentStoreResult<PositionRef[]>> {
  try {
    const r = await db.query<{ position: string | number }>(
      `SELECT position FROM present_archive
       WHERE user_id = $1 AND scope_ref = $2
       ORDER BY position ASC`,
      [userId as string, scopeRef as string],
    )
    const positions = r.rows.map(row => Number(row.position) as unknown as PositionRef)
    return { ok: true, data: positions }
  } catch (e) {
    return dbError('listArchivePositionsRow failed', e)
  }
}

// SnapshotArchiveKey re-exported for callers assembling a lookup key.
export type { SnapshotArchiveKey }
