// @liv-standard v1.3
// [F-identity/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-identity.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-ATOM  Surface, Button, ButtonText, Text, Heading, Label  ←  F-design-system/R3 (primitives)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    validateSession()      →  src/middleware.ts (unitary perimeter site per Manual §I.4 + Perimeter Standard v1.0 PA-I; sole consumer post Sprint 6 Shot 3)
//   W-FN    getPerimeterSession()  →  F-chat/R3, F-la-config/R3, F-project/R3,
//                                     F-permissions/R3, F-user-profile/R3,
//                                     F-planner/R3, F-output/R3
//                                     (perimeter consultation surface per PS v1.0 §6.9; replaces distributed validateSession pattern per F-005 closure)
//   W-ATOM  SESSION_COOKIE_NAME    →  src/middleware.ts (sole consumer post Sprint 6 Shot 3; F-identity/contract/trpc-context.ts also retains for tRPC cookie management)
//   W-ATOM  PERIMETER_HEADER_USER_ID, PERIMETER_HEADER_SESSION_ID  →  F-identity/contract/perimeter-consultation.ts (consumed via @/middleware re-export)
//   W-FN    isEmailAllowed()       →  src/app/api/admin/builds/route.ts
//   W-FN    destroySessionForUser() →  F-event-system/R2 (event-subscriptions)
//   W-ATOM  AuthProvider           →  F-dashboard/R3 (providers)
//   W-ATOM  IDENTITY_EVENTS        →  F-event-system/R0 (event-schema)
//   W-ATOM  SESSION_EVENTS         →  F-event-system/R0 (event-schema)

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  IDENTITY_EVENTS       →  F-event-system/R0
//   W-EVENT  SESSION_EVENTS        →  F-event-system/R0
