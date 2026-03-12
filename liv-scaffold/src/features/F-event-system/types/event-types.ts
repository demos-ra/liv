// @liv-standard v1.3
// [F-event-system/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-event-system
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  BusEvent    →  F-event-system/R2, F-event-system/R4
//   W-ATOM  EventHandler  →  F-event-system/R2
// deps:       none
// validated:  2026-03-12

// Minimal event bus type surface.
// Extend event-schema.ts barrel as slices are added to the app.

export type BusEvent = {
  type:      string
  payload:   Record<string, unknown>
  emittedAt: number   // epoch ms
}

export type EventHandler = (event: BusEvent) => Promise<void> | void
