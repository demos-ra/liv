// @liv-standard v1.3
// [F-event-system/R1]
// Built with LIV · livai.dev
// [F-event-system/R1/C2] Event bus domain logic
// R1: depends on R0 only.
// Pure functions. No I/O. No database calls. No side effects.
// R4 handles persistence. R2 orchestrates dispatch.

import type { LivEvent, EventType, FSlice } from '@/core/types/primitives'
import { ALL_EVENT_NAMES } from '../config/event-schema'

// ─── Validation ───────────────────────────────────────────────────────────────

export interface EventValidationResult {
  valid: boolean
  error?: string
}

export function validateEvent(event: Partial<LivEvent>): EventValidationResult {
  if (!event.name) {
    return { valid: false, error: 'Event name is required' }
  }

  if (!ALL_EVENT_NAMES.has(event.name as string)) {
    return { valid: false, error: `Undeclared event: ${event.name}. Declare in config/event-schema.ts before emitting.` }
  }

  if (!event.slice) {
    return { valid: false, error: 'Emitting slice is required' }
  }

  if (!event.type) {
    return { valid: false, error: 'Event type is required' }
  }

  if (event.type === 'scheduled' && !event.scheduledAt) {
    return { valid: false, error: 'scheduledAt required for scheduled events' }
  }

  if (event.type === 'delayed' && (event.delayMs === undefined || event.delayMs <= 0)) {
    return { valid: false, error: 'delayMs > 0 required for delayed events' }
  }

  if (event.type === 'reactive' && !event.afterEventId) {
    return { valid: false, error: 'afterEventId required for reactive events' }
  }

  return { valid: true }
}

// ─── Event builders ───────────────────────────────────────────────────────────
// Pure factories. Do not persist. R4 handles persistence.

export function buildImmediateEvent(
  slice: FSlice,
  name: string,
  payload: Record<string, unknown> = {}
): Omit<LivEvent, 'id' | 'createdAt'> {
  return { type: 'immediate', slice, name, payload, status: 'pending' }
}

export function buildScheduledEvent(
  slice: FSlice,
  name: string,
  scheduledAt: Date,
  payload: Record<string, unknown> = {}
): Omit<LivEvent, 'id' | 'createdAt'> {
  return { type: 'scheduled', slice, name, payload, status: 'pending', scheduledAt }
}

export function buildDelayedEvent(
  slice: FSlice,
  name: string,
  delayMs: number,
  payload: Record<string, unknown> = {}
): Omit<LivEvent, 'id' | 'createdAt'> {
  return { type: 'delayed', slice, name, payload, status: 'pending', delayMs }
}

export function buildReactiveEvent(
  slice: FSlice,
  name: string,
  afterEventId: string,
  payload: Record<string, unknown> = {}
): Omit<LivEvent, 'id' | 'createdAt'> {
  return { type: 'reactive', slice, name, payload, status: 'pending', afterEventId }
}

// ─── Dispatch readiness check ─────────────────────────────────────────────────
// Pure logic to determine if an event is ready to dispatch now.

export function isReadyToDispatch(event: LivEvent, now: Date = new Date()): boolean {
  switch (event.type) {
    case 'immediate':
      return event.status === 'pending'

    case 'scheduled':
      return (
        event.status === 'pending' &&
        event.scheduledAt !== undefined &&
        event.scheduledAt <= now
      )

    case 'delayed': {
      if (event.status !== 'pending' || event.delayMs === undefined) return false
      const readyAt = new Date(event.createdAt.getTime() + event.delayMs)
      return now >= readyAt
    }

    case 'reactive':
      // Reactive events are triggered explicitly when afterEventId completes.
      // Readiness is determined by the R2 orchestrator, not time.
      return false

    default:
      return false
  }
}
