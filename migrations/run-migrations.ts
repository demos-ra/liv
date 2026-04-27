// @liv-standard v1.5.1
// [migrations/run-migrations.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v2-2-shot5
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
// Phase 3: moved from src/exec/migrations/ to project root migrations/
//
// pool.query(sql) executes each file as a single string — never split on ';'.
// Splitting breaks partial indexes and CHECK constraints. node-postgres simple
// query protocol handles multi-statement DDL strings natively.
//
// lm-v2-2-shot5: MIGRATION_FILES extended to cover 006-015. Pre-flight
// surfaced that the v1.3 array stopped at 003-output.sql; migrations
// 006-014 ran via other deploy mechanisms (manual psql, separate boot
// path) at HEAD. 015-artifact-store.sql lands here for runner inclusion;
// preceding migrations added in chronological order so a clean re-run
// applies the full chain idempotently. All migrations 006-015 use IF NOT
// EXISTS / IF EXISTS / EXCEPTION-WHEN-duplicate-object guards, so re-running
// over an already-migrated DB is safe.
//
// **BUILDER FLAG (lm-v2-2-shot5):** the hardcoded array at HEAD shipped
// before 006-014 landed in the codebase, leaving the runtime runner stale.
// Two readings considered: (a) extend array (chosen — minimal scope,
// preserves v1.3 architecture); (b) replace with directory scan (broader
// rewrite, expanded scope). Manager call welcome on whether (b) modernization
// is preferred for Sprint 3+.

import { readFileSync } from 'fs'
import { join }         from 'path'
import { Pool }         from 'pg'

const MIGRATION_FILES = [
  '000-schema.sql',
  '001-memory.sql',
  '002-planner.sql',
  '003-output.sql',
  // lm-v2-2-shot5: chronological inclusion of 006-014 (previously unrun by
  // this runner; ran via other deploy paths at HEAD). All idempotent.
  '006-pipeline-foundation.sql',
  '007-error-recovery.sql',
  '008-model-preferences.sql',
  '009-flow-library.sql',
  '010-build-versions.sql',
  '010-living-memory-v1.sql',
  '011-add-project-description.sql',
  '012-fix-embedding-dimension.sql',
  '013-memory-v1.1.sql',
  '014-project-snapshot.sql',
  // lm-v2-2-shot5: A4 Postgres artifact store — Phase 9 closure of the
  // Phase 5.5 placeholder (memory-artifact-store.ts).
  '015-artifact-store.sql',
]

function getMigrationUrl(): string {
  const url = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL
  if (!url) throw new Error('[migrations] MIGRATION_DATABASE_URL is not set.')
  return url
}

export async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString:         getMigrationUrl(),
    max:                      1,
    connectionTimeoutMillis:  10_000,
    options:                  '-c statement_timeout=60000',
  })

  try {
    // Phase 3: migrations live at project root /migrations/, not src/exec/migrations/
    const dir = join(process.cwd(), 'migrations')

    for (const file of MIGRATION_FILES) {
      const sql = readFileSync(join(dir, file), 'utf-8')

      await pool.query(sql)

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
