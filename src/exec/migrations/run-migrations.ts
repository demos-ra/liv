// [src/exec/migrations/run-migrations.ts]
// Migration runner — reads SQL files in order, executes idempotently.
// Called from startup.ts before dispatch loop.
// G4: schema in code. G7: fresh clone boots without manual psql.

import { readFileSync } from 'fs'
import { join } from 'path'

export interface MigrationDb {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[] }>
}

const MIGRATION_FILES = [
  '000-schema.sql',
  '001-memory.sql',
]

export async function runMigrations(db: MigrationDb): Promise<void> {
  const dir = join(process.cwd(), 'src/exec/migrations')

  for (const file of MIGRATION_FILES) {
    const sql = readFileSync(join(dir, file), 'utf-8')

    // Execute each statement separately — db.query() runs one statement at a time
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      await db.query(stmt)
    }

    console.log(JSON.stringify({
      level: 'info',
      event: 'migration.applied',
      file,
      timestamp: new Date().toISOString(),
    }))
  }
}
