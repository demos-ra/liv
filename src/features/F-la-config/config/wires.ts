// @liv-standard v1.3
// [F-la-config/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-la-config.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    getPerimeterSession()  ←  F-identity/R3 (perimeter-consultation; replaces validateSession+SESSION_COOKIE_NAME pattern per Sprint 6 Shot 3)
//   W-FN    requirePermission()    ←  F-permissions/R3 (permissions-contract)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    useNamespace()         →  F-chat/R3 (chat-hook), F-permissions/R3 (permissions-hook),
//                                     F-user-profile/R3 (user-profile-hook)
//   W-ATOM  StateRegistryProvider  →  F-dashboard/R3 (providers)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
