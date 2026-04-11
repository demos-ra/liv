// @liv-standard v1.3
// [F-event-system/R2]
// Built with LIV · livai.dev
// [F-event-system/R2/C2] Event dispatch orchestration
// R2: depends on R0, R1, R4.
// Coordinates: R1 validates, R4 persists, R2 orchestrates dispatch.

import { randomUUID } from 'crypto'
import type { LivEvent, FSlice, EventType } from '@/core/types/primitives'
import { validateEvent, buildImmediateEvent, buildScheduledEvent, buildDelayedEvent, buildReactiveEvent } from '../domain/bus'
import { insertEvent, fetchPendingEvents, fetchReactiveEvents, markProcessing, markCompleted, markFailed } from '../exec/queue'
import type { DbClient } from '../exec/queue'

// ─── Handler registry ─────────────────────────────────────────────────────────
// Slices register handlers at startup. Keyed by event name.

type EventHandler = (event: LivEvent) => Promise<void>
const handlers = new Map<string, EventHandler[]>()

export function subscribe(eventName: string, handler: EventHandler): void {
  const existing = handlers.get(eventName) ?? []
  handlers.set(eventName, [...existing, handler])
}

export function unsubscribe(eventName: string, handler: EventHandler): void {
  const existing = handlers.get(eventName) ?? []
  handlers.set(eventName, existing.filter((h) => h !== handler))
}

// ─── Emit ─────────────────────────────────────────────────────────────────────

export async function emit(
  db: DbClient,
  slice: FSlice,
  name: string,
  payload: Record<string, unknown> = {},
  opts: { type?: EventType; scheduledAt?: Date; delayMs?: number; afterEventId?: string } = {}
): Promise<LivEvent> {
  const type = opts.type ?? 'immediate'
  let partial: Omit<LivEvent, 'id' | 'createdAt'>

  switch (type) {
    case 'scheduled':
      if (!opts.scheduledAt) throw new Error('scheduledAt required for scheduled events')
      partial = buildScheduledEvent(slice, name, opts.scheduledAt, payload)
      break
    case 'delayed':
      if (!opts.delayMs) throw new Error('delayMs required for delayed events')
      partial = buildDelayedEvent(slice, name, opts.delayMs, payload)
      break
    case 'reactive':
      if (!opts.afterEventId) throw new Error('afterEventId required for reactive events')
      partial = buildReactiveEvent(slice, name, opts.afterEventId, payload)
      break
    default:
      partial = buildImmediateEvent(slice, name, payload)
  }

  const validation = validateEvent({ ...partial, id: 'check', createdAt: new Date() })
  if (!validation.valid) {
    throw new Error(`Event validation failed: ${validation.error}`)
  }

  const result = await insertEvent(db, { ...partial, id: randomUUID() })
  if (!result.ok) throw new Error(result.error.message)
  return result.data
}

// ─── Dispatch loop ────────────────────────────────────────────────────────────
// Called by a scheduler (cron or setInterval) to drain the queue.
// Bounded: processes at most `limit` events per call.

export async function dispatchPending(db: DbClient, limit = 50): Promise<void> {
  const pendingResult = await fetchPendingEvents(db, limit)
  if (!pendingResult.ok) throw new Error(pendingResult.error.message)
  const events = pendingResult.data

  for (const event of events) {
    const mpResult = await markProcessing(db, event.id)
    if (!mpResult.ok) { console.error('[event-dispatch] markProcessing failed', mpResult.error); continue }

    try {
      const eventHandlers = handlers.get(event.name) ?? []
      await Promise.all(eventHandlers.map((h) => h(event)))
      const mcResult = await markCompleted(db, event.id)
      if (!mcResult.ok) console.error('[event-dispatch] markCompleted failed', mcResult.error)

      // Trigger any reactive events waiting on this one
      const reactiveResult = await fetchReactiveEvents(db, event.id)
      if (!reactiveResult.ok) { console.error('[event-dispatch] fetchReactiveEvents failed', reactiveResult.error); continue }
      for (const reactive of reactiveResult.data) {
        const reactiveHandlers = handlers.get(reactive.name) ?? []
        const rmpResult = await markProcessing(db, reactive.id)
        if (!rmpResult.ok) { console.error('[event-dispatch] markProcessing reactive failed', rmpResult.error); continue }
        try {
          await Promise.all(reactiveHandlers.map((h) => h(reactive)))
          const rmcResult = await markCompleted(db, reactive.id)
          if (!rmcResult.ok) console.error('[event-dispatch] markCompleted reactive failed', rmcResult.error)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          await markFailed(db, reactive.id, msg)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await markFailed(db, event.id, msg)
    }
  }
}
