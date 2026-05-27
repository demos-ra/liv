// @liv-standard v1.5.2
// [migrations/run-migrations.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    lm-v2-2-shot5, fixround-migration-runner (F7: directory scan + schema_migrations tracking + backfill — MIGRATION_FILES array deleted)
// slice:      core
// layer:      R4
// wires-in:   none
// wires-out:  none  (deploy-time only — never imported at runtime)
// deps:
//   R5  fs (Node built-in)
//   R5  path (Node built-in)
//   R5  pg
// validated:  pending

// R4: I/O only. Migration runner — deploy-time, never imported at runtime.
// A4: owns the migration connection lifecycle. No logic outside this file.
// A1: sole owner of migration execution path.
//
// pool.query(sql) executes each file as a single string — never split on ';'.
// Splitting breaks partial indexes and CHECK constraints. node-postgres simple
// query protocol handles multi-statement DDL strings natively.
//
// -- STANDING CONTRACT: migration-file transactions (F7 re-open) -------------
// Migration files do NOT carry their own BEGIN/COMMIT. The runner owns the
// transaction: it wraps each migration's SQL and its schema_migrations record
// in ONE transaction, so apply-and-record commit together or not at all —
// exactly-once is a guarantee, not a happy-path hope. A migration file is pure
// statements.
// Exception: a migration that must use a statement which cannot run inside a
// transaction block (CREATE INDEX CONCURRENTLY, VACUUM, REINDEX, ...) declares
// the header line  -- liv-migration: no-transaction  ; the runner then runs it
// unwrapped and
// that migration owns its own atomicity. Use only when genuinely required — it
// forfeits the runner's exactly-once guarantee for that file. Migrations
// 000-022 carry no such statement (verified) and no marker.
//
// -- fixround-migration-runner (F7) ------------------------------------------
// Structural close. The prior runner had two coupled defects:
//   (a) a hardcoded MIGRATION_FILES array, chronically stale -- it shipped
//       missing 004/005 (never existed) AND 016-020 (its own comments admitted
//       these "ran via other deploy paths"); a stale array silently skips
//       migrations.
//   (b) no applied-tracking -- every file re-ran on every deploy. Idempotent
//       guards made that survivable, but 022's TRUNCATE is not guardable that
//       way: a re-run would wipe the substrate. The untracked runner is itself
//       the defect, not 022.
// Both collapse at the class:
//   - The MIGRATION_FILES array is DELETED and replaced by a directory scan of
//     migrations/, sorted by numeric prefix. What runs is derived from the
//     filesystem -- nothing hardcoded, nothing to go stale.
//   - A schema_migrations table tracks applied filenames. Each migration runs
//     exactly once, ever. Re-run safety no longer depends on per-statement
//     guards -- it is structural.
//   - Backfill: the live DB already has 000-021 applied but untracked. The
//     first tracked run, on a non-fresh DB, registers 000-021 as already-
//     applied in the same transaction that creates schema_migrations, so
//     history is not re-executed. See TRACKING_INTRODUCED_AT below.

import { readdirSync, readFileSync } from 'fs'
import { join }                     from 'path'
import { Pool }                     from 'pg'

// The migration that introduced applied-tracking -- a one-time historical
// watermark, NOT a recurring threshold. On the first tracked run against an
// existing (non-fresh) DB, every migration ordered before this one is backfilled
// as already-applied (the live DB ran them via prior deploy paths). This value
// never changes: it records a fact about when tracking began. Future migrations
// do not touch it -- they are simply tracked normally from here on.
const TRACKING_INTRODUCED_AT = '022-position-sequence.sql'

// A table created by the very first migration (000-schema.sql). Its presence
// distinguishes an existing DB (needs backfill) from a fresh one (needs none).
const FRESH_DB_PROBE_TABLE = 'liv_events'

function getMigrationUrl(): string {
  const url = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL
  if (!url) throw new Error('[migrations] MIGRATION_DATABASE_URL is not set.')
  return url
}

// Leading integer of a migration filename, e.g. '019_dissolve_art_tables.sql'
// and '019-foo.sql' both -> 19. Files share a prefix only by accident of
// numbering (two 010- files exist); ties break by full filename for a total,
// deterministic order.
function numericPrefix(filename: string): number {
  const m = filename.match(/^(\d+)/)
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER
}

function migrationOrder(a: string, b: string): number {
  const pa = numericPrefix(a)
  const pb = numericPrefix(b)
  return pa !== pb ? pa - pb : a.localeCompare(b)
}

// All migration files on disk, in apply order. The directory IS the source of
// truth -- no hardcoded list.
function discoverMigrations(dir: string): string[] {
  return readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort(migrationOrder)
}

export async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString:         getMigrationUrl(),
    max:                      1,
    connectionTimeoutMillis:  10_000,
    options:                  '-c statement_timeout=60000',
  })

  try {
    const dir        = join(process.cwd(), 'migrations')
    const migrations = discoverMigrations(dir)

    // -- Tracking bootstrap ---------------------------------------------------
    // Create schema_migrations if absent. If this is the first time it is
    // created AND the DB already carries application schema (an existing DB),
    // backfill every migration ordered before TRACKING_INTRODUCED_AT as
    // already-applied -- in the same transaction -- so the first tracked run
    // does not re-execute history. A fresh DB skips the backfill: nothing has
    // run, so the loop below applies everything.
    const tableExisted = await pool.query<{ exists: boolean }>(
      `SELECT to_regclass('public.schema_migrations') IS NOT NULL AS exists`,
    )
    const trackingTablePreexisted = tableExisted.rows[0]?.exists === true

    if (!trackingTablePreexisted) {
      const probe = await pool.query<{ exists: boolean }>(
        `SELECT to_regclass($1) IS NOT NULL AS exists`,
        [`public.${FRESH_DB_PROBE_TABLE}`],
      )
      const existingDb = probe.rows[0]?.exists === true

      // Create the table and (for an existing DB) backfill history atomically.
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(
          `CREATE TABLE IF NOT EXISTS schema_migrations (
             filename   TEXT PRIMARY KEY,
             applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
           )`,
        )
        if (existingDb) {
          const backfill = migrations.filter(
            f => migrationOrder(f, TRACKING_INTRODUCED_AT) < 0,
          )
          for (const file of backfill) {
            await client.query(
              `INSERT INTO schema_migrations (filename) VALUES ($1)
               ON CONFLICT (filename) DO NOTHING`,
              [file],
            )
          }
          console.log(JSON.stringify({
            level:         'info',
            event:         'migrations.backfilled',
            count:         backfill.length,
            throughBefore: TRACKING_INTRODUCED_AT,
            timestamp:     new Date().toISOString(),
          }))
        }
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }
    }

    // -- Apply pending migrations ---------------------------------------------
    // Run each migration not already in schema_migrations, exactly once. Apply
    // and record commit TOGETHER, in one runner-owned transaction per migration:
    // BEGIN -> migration SQL -> INSERT INTO schema_migrations -> COMMIT. There is
    // no window in which a migration is committed but unrecorded — a crash or
    // throw between the two ROLLs BACK both. This is what makes exactly-once a
    // guarantee and not a happy-path hope (F7 re-open: the prior loop committed
    // the SQL body, then recorded separately — a crash between left 022 applied
    // but untracked, re-running its destructive TRUNCATE on the next deploy).
    //
    // Non-transactional statements: a migration containing a statement that
    // cannot run inside a transaction block (CREATE INDEX CONCURRENTLY, VACUUM,
    // REINDEX, etc.) must declare `-- liv-migration: no-transaction` in its
    // header. The runner
    // runs such a file WITHOUT the wrapping transaction and records it in a
    // separate statement — that migration owns its own atomicity (it cannot get
    // the runner's guarantee, by Postgres constraint). Migrations 000-022 carry
    // no such statement (verified) and no marker; all get the atomic path.
    const applied = await pool.query<{ filename: string }>(
      `SELECT filename FROM schema_migrations`,
    )
    const appliedSet = new Set(applied.rows.map(r => r.filename))

    for (const file of migrations) {
      if (appliedSet.has(file)) {
        console.log(JSON.stringify({
          level:     'info',
          event:     'migration.skipped',
          file,
          reason:    'already-applied',
          timestamp: new Date().toISOString(),
        }))
        continue
      }

      const sql            = readFileSync(join(dir, file), 'utf-8')
      const noTransaction  = /^\s*--\s*liv-migration:\s*no-transaction\b/m.test(sql)
      const recordSql      =
        `INSERT INTO schema_migrations (filename) VALUES ($1)
         ON CONFLICT (filename) DO NOTHING`

      if (noTransaction) {
        // Opt-out: the migration carries a non-transactional statement. Run it
        // unwrapped, then record. This file's atomicity is its own concern —
        // the runner cannot wrap it (Postgres rejects such statements inside a
        // transaction block).
        await pool.query(sql)
        await pool.query(recordSql, [file])
        console.log(JSON.stringify({
          level:     'info',
          event:     'migration.applied',
          file,
          mode:      'no-transaction',
          timestamp: new Date().toISOString(),
        }))
        continue
      }

      // Atomic path: apply and record in one transaction. The migration file is
      // pure statements (no internal BEGIN/COMMIT — the runner owns the
      // transaction). Either both the schema change and its tracking row commit,
      // or neither does.
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query(recordSql, [file])
        await client.query('COMMIT')
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      } finally {
        client.release()
      }

      console.log(JSON.stringify({
        level:     'info',
        event:     'migration.applied',
        file,
        timestamp: new Date().toISOString(),
      }))
    }

    console.log(JSON.stringify({
      level:     'info',
      event:     'migrations.complete',
      timestamp: new Date().toISOString(),
    }))

  } finally {
    await pool.end()
  }
}
