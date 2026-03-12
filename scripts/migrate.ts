// @liv-standard v1.3
// [scripts/migrate.ts]
// Built with LIV · livai.dev
// Deploy-time migration runner entrypoint. Run as livadmin before starting the app.
// Usage: npm run migrate
// Requires: MIGRATION_DATABASE_URL in environment (livadmin credentials).
// This script exits after migrations complete — it is NOT imported by the app.
// A4: tsx does not auto-load .env.local (Next.js does; tsx does not).
// Env loaded here using only Node built-ins — zero new dependencies.
// Phase 3: runMigrations import updated from src/exec/migrations → migrations/

import { readFileSync } from 'fs'
import { resolve }      from 'path'

function loadEnvLocal(): void {
  try {
    const raw   = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    const lines = raw.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (key && !(key in process.env)) {
        process.env[key] = val
      }
    }
  } catch {
    // .env.local absent — rely on env vars already in environment
  }
}

loadEnvLocal()

import { runMigrations } from '../migrations/run-migrations'

async function main() {
  console.log(JSON.stringify({
    level:     'info',
    event:     'migrate.start',
    url:       (process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL ?? '').replace(/:([^:@]+)@/, ':***@'),
    timestamp: new Date().toISOString(),
  }))

  try {
    await runMigrations()
    console.log(JSON.stringify({
      level:     'info',
      event:     'migrate.success',
      timestamp: new Date().toISOString(),
    }))
    process.exit(0)
  } catch (err) {
    console.error(JSON.stringify({
      level:     'error',
      event:     'migrate.failed',
      error:     err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    process.exit(1)
  }
}

main()
