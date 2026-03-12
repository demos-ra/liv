// @liv-standard v1.3
// [migrations/run-migrations.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core
// layer:      R4
// wires-in:   none
// wires-out:  none  (deploy-time only — never imported at runtime)
// deps:
//   R5  fs (Node built-in)
//   R5  path (Node built-in)
//   R5  pg
// validated:  2026-03-12

// R4: I/O only. Migration runner — deploy-time, never imported at runtime.
// A4: owns the migration connection lifecycle. No logic outside this file.
// A1: sole owner of migration execution path.
// Phase 3: moved from src/exec/migrations/ to project root migrations/
//
// pool.query(sql) executes each file as a single string — never split on ';'.
// Splitting breaks partial indexes and CHECK constraints. node-postgres simple
// query protocol handles multi-statement DDL strings natively.

import { readFileSync } from 'fs'
import { join }         from 'path'
import { Pool }         from 'pg'

const MIGRATION_FILES = [
  '000-schema.sql',
  '001-memory.sql',
  '002-planner.sql',
  '003-output.sql',
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
