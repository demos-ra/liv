// @liv-standard v1.5.1
// [F-router/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-2 (F-router authoring)
// slice:      F-router
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  pending

// Wire contract registry for F-router (Sprint 8 Shot 2 — pure routing slice).
// A1: F-router owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
//
// F-router is infrastructure, not a governed program. No Standard backs it.
// Sprint 8 Shot 2 declares the contract surface. Sprint 9 wires consumers.

// ─── R3 surface contracts ─────────────────────────────────────────────────────

// @wire
// type:    W-HOOK
// id:      W-HOOK-router-route
// payload: route(message: RouterMessage, context: RouterSessionContext) → RouteResult
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-router-register
// payload: registerDestination(reg: DestinationRegistration) → Result<RouterRegistrationKey>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-router-unregister
// payload: unregisterDestination(key: RouterRegistrationKey) → Result<void>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-router-list
// payload: listDestinations() → Result<RouterRule[]>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-router-on-boot
// payload: onBoot() → Promise<Result<void>>
// version: 1
// status:  active

// ─── R3 wire-atoms ────────────────────────────────────────────────────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-router-message
// payload: RouterMessage
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-router-session-context
// payload: RouterSessionContext
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-destination
// payload: Destination
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-destination-registration
// payload: DestinationRegistration
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-router-rule
// payload: RouterRule
// version: 1
// status:  active

// ─── Events ───────────────────────────────────────────────────────────────────

// @wire
// type:    W-EVENT
// id:      W-EVENT-registration-added
// payload: { ruleId: string; slice: FSlice; programId?: string; priority: number }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-registration-removed
// payload: { ruleId: string }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-route-matched
// payload: { ruleId: string; destination: Destination; messageKind: RouterMessageKind }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-route-unmatched
// payload: { messageKind: RouterMessageKind; ruleCount: number }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-router-boot-complete
// payload: { ruleCount: number }
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
