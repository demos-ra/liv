// [F-integration/R2/C2] Startup orchestration
// R2: orchestration layer, depends R0 + R1 + R4.
//
// Called once at server start via Next.js instrumentation hook.
// Wires: db → memory → event bus → dispatch loop → subscriptions.
//
// Schema management is NOT a runtime concern — run `npm run migrate` before starting.
// Idempotent guard: will not re-initialize if already bootstrapped.
// O5: structured JSON log at each boot stage.

import { db, closeDb } from '@/core/db/client'
import { dispatchPending } from './event-dispatch'
import { registerAllSubscriptions } from './event-subscriptions'
import { registerTopographySubscriptions } from '@/features/F-topography/contract/topography-contract'
import { onBoot as memoryOnBoot } from '@/features/F-memory/contract/memory-contract'

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

  // 1. Boot F-memory (loads graph, seeds backbone)
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

  // 2. Register all event subscriptions (cross-slice wiring)
  registerAllSubscriptions()
  log('startup.subscriptions.registered')

  // 3. Register topography subscriptions (T-axis pulse handlers)
  registerTopographySubscriptions()
  log('startup.topography-subscriptions.registered')

  // 4. Start event dispatch loop
  // Drains up to 50 pending events every 500ms.
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
