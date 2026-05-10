// @liv-standard v1.3
// [F-permissions/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-permissions.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    emitEvent()            ←  F-event-system/R3 (event-bus)
//   W-ATOM  EVENTS                 ←  F-event-system/R0 (event-schema)
//   W-FN    useNamespace()         ←  F-verify/R3 (registry-hook)
//   W-FN    getPerimeterSession()  ←  F-identity/R3 (perimeter-consultation; replaces validateSession+SESSION_COOKIE_NAME pattern per Sprint 6 Shot 3)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    requirePermission()    →  (internal; la-contract dissolved sprint-13-shot-3)
//   W-FN    assignDefaultRole()    →  F-event-system/R2 (event-subscriptions)
//   W-ATOM  PERMISSIONS_EVENTS     →  F-event-system/R0 (event-schema)

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  PERMISSIONS_EVENTS    →  F-event-system/R0
