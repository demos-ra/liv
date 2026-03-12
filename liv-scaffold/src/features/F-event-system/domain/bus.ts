// @liv-standard v1.3
// [F-event-system/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-event-system
// layer:      R1
// wires-in:
//   W-ATOM  BusEvent      ../types/event-types
//   W-ATOM  EventHandler  ../types/event-types
// wires-out:  none  (R1 logic never exported across slices — A2)
// deps:
//   R0  ../types/event-types
// validated:  2026-03-12

// Pure in-memory subscriber registry. No I/O, no side effects.
// A4: subscribe/unsubscribe are pure mutations on a data structure — not I/O.

import type { BusEvent, EventHandler } from '../types/event-types'

const subscribers = new Map<string, Set<EventHandler>>()

export function subscribe(eventType: string, handler: EventHandler): void {
  if (!subscribers.has(eventType)) subscribers.set(eventType, new Set())
  subscribers.get(eventType)!.add(handler)
}

export function unsubscribe(eventType: string, handler: EventHandler): void {
  subscribers.get(eventType)?.delete(handler)
}

export function getHandlers(eventType: string): EventHandler[] {
  return Array.from(subscribers.get(eventType) ?? [])
}

export function dispatch(event: BusEvent): void {
  const handlers = getHandlers(event.type)
  for (const handler of handlers) {
    // Fire-and-forget — FL-EVENT-FAN: emitter has zero knowledge of handlers
    Promise.resolve(handler(event)).catch((err: unknown) => {
      console.error(JSON.stringify({
        level:     'error',
        event:     'event-bus.handler.error',
        type:      event.type,
        message:   err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      }))
    })
  }
}
