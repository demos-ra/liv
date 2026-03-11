// @liv-standard v1.0
// [src/exec/migrations/run-migrations.ts]
// Built with LIV · livai.dev
// R4: I/O only. Migration runner — deploy-time, never imported at runtime.
// A4: owns the migration connection lifecycle. No logic outside this file.
// A1: sole owner of migration execution path.
//
// Fix: pool.query(sql) executes each file as a single string.
// Splitting on ';' broke partial indexes (WHERE clause detached from CREATE INDEX)
// and CHECK constraints. node-postgres simple query protocol handles multi-statement
// DDL strings natively. No params = no prepared statement restriction.

import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from 'pg'

const MIGRATION_FILES = [
  '000-schema.sql',
  '001-memory.sql',
]

function getMigrationUrl(): string {
  const url = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL
  if (!url) throw new Error('[migrations] MIGRATION_DATABASE_URL is not set.')
  return url
}

export async function runMigrations(): Promise<void> {
  const pool = new Pool({
    connectionString: getMigrationUrl(),
    max: 1,
    connectionTimeoutMillis: 10_000,
    options: '-c statement_timeout=60000',
  })

  try {
    const dir = join(process.cwd(), 'src/exec/migrations')

    for (const file of MIGRATION_FILES) {
      const sql = readFileSync(join(dir, file), 'utf-8')

      // Execute entire file as one query — never split on ';'.
      // Splitting breaks partial indexes and CHECK constraints.
      await pool.query(sql)

      console.log(JSON.stringify({
        level: 'info',
        event: 'migration.applied',
        file,
        timestamp: new Date().toISOString(),
      }))
    }

    console.log(JSON.stringify({
      level: 'info',
      event: 'migrations.complete',
      timestamp: new Date().toISOString(),
    }))

  } finally {
    await pool.end()
  }
}
