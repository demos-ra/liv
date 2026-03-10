// [F-integration/R2/C2] Startup orchestration
// R2: orchestration layer, depends R0 + R1 + R4.
//
// Called once at server start (Next.js instrumentation hook or app/layout.tsx server init).
// Wires: migrations → db → event bus → dispatch loop → all subscriptions → topography subscriptions.
//
// Idempotent guard: will not re-initialize if already bootstrapped.
// O5: structured JSON log at each boot stage.
// G4 + G7: runMigrations() ensures fresh clone boots without manual psql.

import { db, closeDb } from '@/core/db/client'
import { dispatchPending } from './event-dispatch'
import { registerAllSubscriptions } from './event-subscriptions'
import { registerTopographySubscriptions } from '@/features/F-topography/contract/topography-contract'
import { onBoot as memoryOnBoot } from '@/features/F-memory/contract/memory-contract'
import { runMigrations } from '@/exec/migrations/run-migrations'

let _bootstrapped = false
let _dispatchInterval: ReturnType<typeof setInterval> | null = null

// ─── Boot ──────────────────────────────────────────────────────────────────────

export async function bootstrap(): Promise<void> {
  if (_bootstrapped) {
    console.warn(JSON.stringify({
      level: 'warn',
      event: 'startup.already-bootstrapped',
      timestamp: new Date().toISOString(),
    }))
    return
  }

  log('startup.begin')

  // 0. Verify DB connection
  try {
    await db.query('SELECT 1')
    log('startup.db.connected')
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'startup.db.failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    throw err  // Hard failure — server cannot start without DB
  }

  // 1. Run migrations (G4/G7: schema in code, no manual psql on fresh deploy)
  try {
    await runMigrations(db)
    log('startup.migrations.complete')
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'startup.migrations.failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    throw err  // Hard failure — cannot run without schema
  }

  // 2. Boot F-memory (loads graph, seeds backbone)
  try {
    await memoryOnBoot()
    log('startup.memory.booted')
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'startup.memory.boot-failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — server continues without memory
  }

  // 3. Register all event subscriptions (cross-slice wiring)
  registerAllSubscriptions()
  log('startup.subscriptions.registered')

  // 4. Register topography subscriptions (T-axis pulse handlers)
  registerTopographySubscriptions()
  log('startup.topography-subscriptions.registered')

  // 5. Start event dispatch loop
  // Drains up to 50 pending events every 500ms.
  // Bounded: no unbounded loop — each tick processes a capped batch.
  _dispatchInterval = setInterval(async () => {
    try {
      await dispatchPending(db, 50)
    } catch (err) {
      console.error(JSON.stringify({
        level: 'error',
        event: 'startup.dispatch-loop.error',
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      }))
    }
  }, 500)

  // Drain any events that queued up during downtime immediately
  await dispatchPending(db, 200)
  log('startup.dispatch-loop.started')

  _bootstrapped = true
  log('startup.complete')
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────

export async function shutdown(): Promise<void> {
  if (_dispatchInterval) {
    clearInterval(_dispatchInterval)
    _dispatchInterval = null
  }

  await closeDb()

  _bootstrapped = false
  log('startup.shutdown.complete')
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function log(event: string): void {
  console.log(JSON.stringify({
    level: 'info',
    event,
    timestamp: new Date().toISOString(),
  }))
}
