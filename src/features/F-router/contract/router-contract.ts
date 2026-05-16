// @liv-standard v1.5.2 amended sprint-11-shot-3 sprint-11-shot-6a
// [F-router/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-8-shot-2  (F-router authoring); sprint-b2-unified-close (category tag set to Tool; "infrastructure" residue swept per Manual v13.3 reclassification); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep v1.5.1 → v1.5.2)
//             sprint-11-shot-3 (onBoot wired to event-system startup; registerDestination wired to router-registrations)
//             sprint-11-shot-6a (S11-A1 fix: registerDomainPrograms re-exported at R3 — A2 compliance)
// slice:      F-router
// category:   Tool
// layer:      R3
// wires-in:
//   W-FN  route                  F-router/R2 router-service
//   W-FN  registerDestination    F-router/R2 router-service
//   W-FN  unregisterDestination  F-router/R2 router-service
//   W-FN  listDestinations       F-router/R2 router-service
//   W-FN  resetRegistry          F-router/R2 router-service
//   W-FN  onBoot                 F-router/R2 router-service
//   W-FN  registerDomainPrograms  F-router/R4 router-registrations  (re-exported at R3 per A2 — S11-A1 fix)
// wires-out:
//   W-HOOK  route                  →  F-chat/R3 chat-contract (sprint-11-shot-2)
//   W-HOOK  registerDestination    →  F-router/R4 router-registrations (internal call site)
//   W-HOOK  registerDomainPrograms  →  F-event-system/R2 startup (sprint-11-shot-3; re-exported at R3 per S11-A1 fix)
//   W-HOOK  unregisterDestination  →  general consumers
//   W-HOOK  listDestinations       →  diagnostic / admin consumers
//   W-HOOK  resetRegistry          →  boot lifecycle, test fixtures
//   W-HOOK  onBoot                 →  F-event-system/R2 startup (sprint-11-shot-3)
// deps:
//   R2  ../app/router-service
//   R4  ../exec/router-registrations   (registerDomainPrograms — R4 import at R3 is correct: R3 is the export gate)
//   R0  ../config/router-types
// validated:  pending

// F-router R3 — public contract.
// R3: thin wire. No logic. No state. No I/O.
//
// All other slices import from this file — never from app/, domain/.
// A1: declared once. A6: outbound surface declared at R3 of the defining slice.

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

// ─── registerDomainPrograms — R3 re-export (S11-A1 fix) ──────────────────────
// R3 is the cross-slice import gate (A2). External consumers (F-event-system startup)
// import registerDomainPrograms from here — never directly from R4 exec/.
// R3 importing from its own R4 is the standard pattern (A2: R3 may depend on R4
// within the same slice; the violation was cross-slice R4 import from F-event-system).
export { registerDomainPrograms } from '../exec/router-registrations'

// ─── End ──────────────────────────────────────────────────────────────────────
