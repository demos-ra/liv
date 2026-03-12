// @liv-standard v1.3
// [F-event-system/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-event-system
// layer:      R3
// wires-in:
//   W-ATOM  BusEvent      ../types/event-types
//   W-ATOM  EventHandler  ../types/event-types
// wires-out:
//   W-ATOM  emitEvent         →  all R2 workflow files (A5 — cross-slice notification)
//   W-ATOM  subscribeToEvent  →  F-event-system/workflow (startup subscriptions)
// deps:
//   R0  ../types/event-types
//   R1  ../domain/bus
// validated:  2026-03-12

// Public event bus surface. All slices import emitEvent from here.
// A5: cross-slice notification uses the event bus only. No direct slice calls.

import type { EventHandler } from '../types/event-types'
import { dispatch, subscribe, unsubscribe } from '../domain/bus'

// Called by R2 workflows to notify the system of state changes.
// FL-EVENT-FAN: emitter → bus → N handlers. No return value. (A5)
export function emitEvent(opts: {
  type:    string
  payload?: Record<string, unknown>
}): void {
  dispatch({
    type:      opts.type,
    payload:   opts.payload ?? {},
    emittedAt: Date.now(),
  })
}

// Called at startup to wire slice reactions.
// Returns an unsubscribe function — call it on teardown.
export function subscribeToEvent(
  eventType: string,
  handler:   EventHandler
): () => void {
  subscribe(eventType, handler)
  return () => unsubscribe(eventType, handler)
}
