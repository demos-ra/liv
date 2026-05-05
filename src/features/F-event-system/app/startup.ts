// @liv-standard v1.5.1
// [F-event-system/R2]
// Built with LIV · livai.dev
// R2: orchestration layer, depends R0 + R1 + R4.
//
// Called once at server start via Next.js instrumentation hook.
// Wires: db → substrate → F-artifact hydrate → event bus → dispatch loop → subscriptions.
// sprint-8-shot-3b: substrate replaces memory (legacy F-memory engine dissolved).
// sprint-8-shot-4: hydrateArtifactStore() boot hook re-established here (was hosted
//                  at F-memory/R2 memory-service before relocation; now lives at
//                  F-artifact/R2 artifact-store and is invoked from this startup
//                  orchestrator since F-memory no longer holds any boot logic).
//
// Schema management is NOT a runtime concern — run `npm run migrate` before starting.
// Idempotent guard: will not re-initialize if already bootstrapped.
// O5: structured JSON log at each boot stage.

import { db, closeDb } from '@/core/db/client'
import { dispatchPending } from './event-dispatch'
import { registerAllSubscriptions } from './event-subscriptions'
import { onBoot as substrateOnBoot } from '@/features/F-memory/contract/substrate-contract'
import { hydrateArtifactStore } from '@/features/F-artifact/contract/artifact-contract'

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

  // 1. Boot substrate (LM v3.1 — initialize last-position observability)
  try {
    await substrateOnBoot()
    log('startup.substrate.booted')
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'startup.substrate.boot-failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — server continues without substrate
  }

  // 2. Hydrate F-artifact in-memory cache from art_* tables.
  // sprint-8-shot-4: boot hook re-establishment after relocation from F-memory.
  // Idempotent — clears cache before reading. Sync correctness for the cache-
  // backed isEmissionIdCollision predicate depends on hydration completing
  // before any consumer reads. Subscriptions register only after this step.
  try {
    await hydrateArtifactStore()
    log('startup.artifact.hydrated')
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'startup.artifact.hydrate-failed',
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — server continues, but artifact-store reads will return
    // empty until next successful hydration. Cache-backed sync collision
    // predicate may report false negatives until populated.
  }

  // 3. Register all event subscriptions (cross-slice wiring)
  registerAllSubscriptions()
  log('startup.subscriptions.registered')

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
