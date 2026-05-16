// @liv-standard v1.5.2
// [F-router/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-8-shot-2 (F-router authoring); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
// slice:      F-router
// category:   Tool
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM ROUTER_EVENTS    →  F-event-system/R0 (Sprint 9 wiring), router callers
//   W-ATOM RouterEventType  →  F-router/*, F-event-system
// deps:       none
// validated:  pending

// F-router R0 — event declarations.
// A5: each slice declares its own events.
// A6: declared at R0.
//
// Sprint 8 Shot 2: events declared. Emission stubbed at R2 (console.log
// JSON-line) per the same Decision-D pattern as Shot 1 substrate-service —
// F-event-system wiring deferred to Sprint 9.

export const ROUTER_EVENTS = {
  /** A registration was added to the registry. Carries slice + programId + priority. */
  REGISTRATION_ADDED:    'router.registration-added',

  /** A registration was removed from the registry. */
  REGISTRATION_REMOVED:  'router.registration-removed',

  /** route() returned a destination match. Carries match details for observability. */
  ROUTE_MATCHED:         'router.route-matched',

  /** route() returned NO_MATCH. Carries the unmatched input for diagnostic. */
  ROUTE_UNMATCHED:       'router.route-unmatched',

  /** Boot complete; registry initialized (empty at Shot 2). */
  BOOT_COMPLETE:         'router.boot-complete',
} as const

export type RouterEventType =
  typeof ROUTER_EVENTS[keyof typeof ROUTER_EVENTS]
