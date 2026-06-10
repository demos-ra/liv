// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (vocabulary + gate)
// [scripts/reconcile-present-marks.ts]
// Built with LIV · livai.dev
//
// Deploy-time reconciliation — moves every present_marks row that FAILS the mark
// gate (isMark) into present_marks_quarantine (028), so the live store passes the
// gate end-to-end. Run as livadmin AFTER migration 028 has created the sink.
//
// Usage:
//   npx tsx scripts/reconcile-present-marks.ts            # DRY RUN (default): snapshot + counts, NO mutation
//   npx tsx scripts/reconcile-present-marks.ts --apply    # snapshot, MOVE failing rows, write manifest
//   npx tsx scripts/reconcile-present-marks.ts --reverse   # inverse: move ALL quarantined rows back, empty the sink
//
// THE GATE IS THE CRITERION. This script imports the SAME isMark the read perimeter
// and the write crossing use (no re-implementation, no hand-curated id list). A row
// is failing iff its jsonb `mark` does not parse OR isMark(parsed) === false. As an
// EXTERNAL consumer it reaches the gate through F-present's R3 contract surface
// (present-contract), never via domain/mark-gate directly — the slice boundary holds.
//
// SAFE BY DEFAULT: no flag => dry run. Every run writes a snapshot of the failing
// rows BEFORE any mutation. --apply moves rows in ONE transaction (INSERT into
// quarantine + DELETE from present_marks) and writes a manifest. Reversible: the
// quarantine holds the full row (original seq preserved), so --reverse restores
// every quarantined row byte-for-byte. Requires: MIGRATION_DATABASE_URL (or
// DATABASE_URL) in environment.
//
// A4 (Isolated execution): all I/O lives here; the gate logic lives in mark-gate
// (R1, pure) and is consumed through the R3 contract. tsx resolves the `@/` alias
// from tsconfig paths; the contract barrel loads headlessly (the db client is lazy
// — no connection on import), so pulling isMark via the surface is side-effect-free.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, join }                          from 'path'
import { Pool }                                   from 'pg'
import { isMark }                                 from '@/features/F-present/contract/present-contract'

// ── env (tsx does not auto-load .env.local; Node built-ins only) ───────────────
function loadEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (key && !(key in process.env)) process.env[key] = val
    }
  } catch { /* .env.local absent — rely on environment */ }
}

function dbUrl(): string {
  const url = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL
  if (!url) throw new Error('[reconcile] MIGRATION_DATABASE_URL is not set.')
  return url
}

type Row = {
  seq: string
  user_id: string
  home_who: string
  home_sc: string
  home_pos: string
  mark: unknown
  placed_at: string
}

// The gate criterion, applied to a stored row. Returns null if the row PASSES (keep
// it live) or a reason string if it FAILS (quarantine it).
function failReason(row: Row): 'unparseable-jsonb' | 'gate-rejected' | null {
  let parsed: unknown
  try {
    parsed = typeof row.mark === 'string' ? JSON.parse(row.mark) : row.mark
  } catch {
    return 'unparseable-jsonb'
  }
  return isMark(parsed) ? null : 'gate-rejected'
}

function log(event: string, fields: Record<string, unknown>): void {
  console.log(JSON.stringify({ level: 'info', event, ...fields, timestamp: new Date().toISOString() }))
}

function artifactsDir(): string {
  const dir = join(process.cwd(), 'migrations', 'reconcile-artifacts')
  mkdirSync(dir, { recursive: true })
  return dir
}

// stamp for filenames — colon-free for portability
function stamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

async function reconcile(apply: boolean): Promise<void> {
  const pool = new Pool({ connectionString: dbUrl(), max: 1, connectionTimeoutMillis: 10_000 })
  try {
    const all = await pool.query<Row>(
      `SELECT seq, user_id, home_who, home_sc, home_pos, mark, placed_at
         FROM present_marks
        ORDER BY seq ASC`,
    )
    const total   = all.rows.length
    const failing = all.rows
      .map(r => ({ row: r, reason: failReason(r) }))
      .filter((x): x is { row: Row; reason: 'unparseable-jsonb' | 'gate-rejected' } => x.reason !== null)
    const moved     = failing.length
    const remaining = total - moved

    // counts MUST reconcile — the done-criterion invariant
    log('reconcile.counts', { total, moved, remaining, reconciles: moved + remaining === total })

    // snapshot of the failing rows BEFORE any mutation (always written)
    const dir  = artifactsDir()
    const snap = join(dir, `${stamp()}-snapshot.json`)
    writeFileSync(snap, JSON.stringify({ total, moved, remaining, failing }, null, 2))
    log('reconcile.snapshot', { path: snap, rows: moved })

    if (!apply) {
      log('reconcile.dry-run', { note: 'no mutation; re-run with --apply to move the rows above' })
      return
    }
    if (moved === 0) {
      log('reconcile.apply', { moved: 0, note: 'store already passes the gate — nothing to move' })
      return
    }

    // MOVE in one transaction: insert into quarantine, delete from present_marks.
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      for (const { row, reason } of failing) {
        await client.query(
          `INSERT INTO present_marks_quarantine
             (seq, user_id, home_who, home_sc, home_pos, mark, placed_at, reason)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
           ON CONFLICT (seq) DO NOTHING`,
          [row.seq, row.user_id, row.home_who, row.home_sc, row.home_pos,
           typeof row.mark === 'string' ? row.mark : JSON.stringify(row.mark), row.placed_at, reason],
        )
      }
      const seqs = failing.map(f => f.row.seq)
      const del = await client.query(
        `DELETE FROM present_marks WHERE seq = ANY($1::bigint[])`,
        [seqs],
      )
      await client.query('COMMIT')

      const manifest = join(dir, `${stamp()}-manifest.json`)
      writeFileSync(manifest, JSON.stringify({
        total, moved, remaining, deleted: del.rowCount,
        seqs, snapshot: snap, appliedAt: new Date().toISOString(),
      }, null, 2))
      log('reconcile.apply', { moved, deleted: del.rowCount, manifest })

      // post-condition: the live store now passes the gate end-to-end
      const after = await pool.query<Row>(
        `SELECT seq, user_id, home_who, home_sc, home_pos, mark, placed_at FROM present_marks`,
      )
      const stillFailing = after.rows.filter(r => failReason(r) !== null).length
      log('reconcile.verify', { liveRows: after.rows.length, stillFailing, clean: stillFailing === 0 })
      if (stillFailing !== 0) throw new Error(`[reconcile] post-apply: ${stillFailing} rows still fail the gate`)
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {})
      throw err
    } finally {
      client.release()
    }
  } finally {
    await pool.end()
  }
}

// Inverse — move ALL quarantined rows back into present_marks, empty the sink.
async function reverse(): Promise<void> {
  const pool = new Pool({ connectionString: dbUrl(), max: 1, connectionTimeoutMillis: 10_000 })
  try {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const ins = await client.query(
        `INSERT INTO present_marks (seq, user_id, home_who, home_sc, home_pos, mark, placed_at)
         SELECT seq, user_id, home_who, home_sc, home_pos, mark, placed_at
           FROM present_marks_quarantine
         ON CONFLICT (seq) DO NOTHING`,
      )
      const del = await client.query(`DELETE FROM present_marks_quarantine`)
      await client.query('COMMIT')
      log('reconcile.reverse', { restored: ins.rowCount, cleared: del.rowCount })
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {})
      throw err
    } finally {
      client.release()
    }
  } finally {
    await pool.end()
  }
}

async function main(): Promise<void> {
  loadEnvLocal()
  const args = process.argv.slice(2)
  try {
    if (args.includes('--reverse'))    await reverse()
    else                                await reconcile(args.includes('--apply'))
    process.exit(0)
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error', event: 'reconcile.failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    process.exit(1)
  }
}

main()
