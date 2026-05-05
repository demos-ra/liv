// @liv-standard v1.5.1
// [F-router/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-2 (F-router authoring)
// slice:      F-router
// layer:      R3
// wires-in:
//   W-FN  route                  F-router/R2 router-service
//   W-FN  registerDestination    F-router/R2 router-service
//   W-FN  unregisterDestination  F-router/R2 router-service
//   W-FN  listDestinations       F-router/R2 router-service
//   W-FN  resetRegistry          F-router/R2 router-service
//   W-FN  onBoot                 F-router/R2 router-service
// wires-out:
//   W-HOOK  route                  →  F-chat (Sprint 9 wiring)
//   W-HOOK  registerDestination    →  F-chat, F-plan, F-verify, F-discover (Sprint 9 wiring)
//   W-HOOK  unregisterDestination  →  general consumers
//   W-HOOK  listDestinations       →  diagnostic / admin consumers
//   W-HOOK  resetRegistry          →  boot lifecycle, test fixtures
//   W-HOOK  onBoot                 →  F-event-system/R2 startup (Sprint 9 wiring)
// deps:
//   R2  ../app/router-service
//   R0  ../config/router-types
// validated:  pending

// F-router R3 — public contract.
// R3: thin wire. No logic. No state. No I/O.
//
// All other slices import from this file — never from app/, domain/.
// A1: declared once. A6: outbound surface declared at R3 of the defining slice.
//
// Sprint 8 Shot 2 note: contract authored at the R3 surface. F-chat does not
// yet call F-router. Sprint 9 will wire chat-input → route(...) → dispatch.

export {
  route,
  registerDestination,
  unregisterDestination,
  listDestinations,
  resetRegistry,
  onBoot,
} from '../app/router-service'

// Re-export R0 atoms so external consumers import everything from the
// contract surface without reaching into config/. This matches the
// existing F-memory/F-codec convention.

export type {
  RouterMessage,
  RouterMessageKind,
  RouterSessionContext,
  Destination,
  DestinationRegistration,
  RouterMatchPredicate,
  RouterRule,
  RouterRegistrationKey,
  RouterError,
  RouteResult,
} from '../config/router-types'

export { ROUTER_ERROR_CODES } from '../config/router-types'

// ─── End ──────────────────────────────────────────────────────────────────────
