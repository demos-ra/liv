// @liv-standard v1.3
// [F-event-system/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-event-system
// layer:      R0
// wires-in:   none
// wires-out:  none  (barrel re-exports only — no owned declarations)
// deps:       none
// validated:  2026-03-12

// Re-export barrel only. Zero declarations. Zero owned event strings.
// A5: each slice declares its own events in {slice}/types/{slice}-events.ts
// Adding a new slice: add one import line + one entry in EVENTS below.
//
// SCAFFOLD: this file starts empty. Add slice event imports as slices are built.

export const EVENTS = {} as const
