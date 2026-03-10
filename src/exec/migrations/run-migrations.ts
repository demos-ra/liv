// [src/exec/migrations/run-migrations.ts]
// R4 — migration runner. Uses MIGRATION_DATABASE_URL (livadmin) — never the app pool.
// Called by scripts/migrate.ts at deploy time, NOT at runtime.
// G4: schema in code. G7: fresh clone boots via `npm run migrate` before `pm2 start`.
//
// A4: I/O at R4 only. This file owns the migration connection lifecycle.
// Separation of concerns: schema management is deploy-time, not runtime.

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

      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const stmt of statements) {
        await pool.query(stmt)
      }

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
