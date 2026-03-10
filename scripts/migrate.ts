// [scripts/migrate.ts]
// Deploy-time migration runner. Run as livadmin before starting the app.
// Usage: npm run migrate
// Requires: MIGRATION_DATABASE_URL in environment (livadmin credentials).
// This script exits after migrations complete — it is NOT imported by the app.

import { runMigrations } from '../src/exec/migrations/run-migrations'

async function main() {
  console.log(JSON.stringify({
    level: 'info',
    event: 'migrate.start',
    url: (process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL ?? '').replace(/:([^:@]+)@/, ':***@'),
    timestamp: new Date().toISOString(),
  }))

  try {
    await runMigrations()
    console.log(JSON.stringify({
      level: 'info',
      event: 'migrate.success',
      timestamp: new Date().toISOString(),
    }))
    process.exit(0)
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'migrate.failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    process.exit(1)
  }
}

main()
