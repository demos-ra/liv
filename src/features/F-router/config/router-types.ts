// @liv-standard v1.5.1
// [F-router/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-2 (F-router authoring)
// slice:      F-router
// layer:      R0
// wires-in:
//   W-ATOM FSlice    core/R5 (primitives)
// wires-out:
//   W-ATOM Destination              →  F-router/*, F-chat (Sprint 9 wiring)
//   W-ATOM RouterMessage            →  F-router/*, F-chat (Sprint 9 wiring)
//   W-ATOM RouterSessionContext     →  F-router/*, F-chat (Sprint 9 wiring)
//   W-ATOM DestinationRegistration  →  F-router/* (registry shape)
//   W-ATOM RouterRule               →  F-router/R1 (routing rules)
//   W-ATOM RouterError              →  F-router callers (error surface)
//   W-ATOM RouteResult              →  F-router callers (Result-wrapped)
//   W-ATOM RouterRegistrationKey    →  F-router/R2 (registry indexing)
// deps:
//   R5  @/core/types/primitives
// validated:  pending

// F-router R0 — atom declarations.
// F-router is infrastructure, not a governed program — no Standard backs it.
// Per Decision-D-S2-1: 'F-router' added to FSlice enum at core/R5.
//
// A1: F-router owns these atoms exclusively.
// A6: declared at R0.
//
// Sprint 8 Shot 2 scope: declare the contract surface (atoms + registry shape +
// route function signature). No domain registrations populate the registry —
// that wiring is Sprint 9.

import type { FSlice } from '@/core/types/primitives'
import type { Result, AppError } from '@/core/types/primitives'

// ─── Destination (the routing output) ─────────────────────────────────────────
// Slice identifies the handler. programId is optional for program-specific
// routing within a slice (e.g. F-chat hosts multiple program instances).
// Per Decision-D-S2-2 (L0-confirmed at sprint open).

export type Destination = {
  slice:      FSlice
  programId?: string
}

// ─── RouterMessage (the routing input) ────────────────────────────────────────
// F-router does not own the source-of-truth shape of inbound messages —
// it owns only the projection it needs for routing. Callers pass a
// RouterMessage shape regardless of the upstream message kind (chat user
// turn, scheduled trigger, integration event).
//
// Minimal shape:
//   text  — primary content (may be empty for non-text events)
//   kind  — coarse classification used by routing rules
//   meta  — open-vocabulary key/value bag for rule-specific input

export type RouterMessageKind =
  | 'user-turn'
  | 'scheduled-trigger'
  | 'integration-event'
  | 'internal-derivation'

export type RouterMessage = {
  text: string
  kind: RouterMessageKind
  meta?: Record<string, unknown>
}

// ─── RouterSessionContext (per-routing-call context) ──────────────────────────
// Per Decision-D-S2-3: F-router declares its own minimal session shape.
// Cross-slice R0 imports violate R-layer discipline; F-chat session shape
// is consumed at Sprint 9 wiring as a structural conformance check, not
// a type-import.
//
// Minimal shape — fields F-router rules can read:
//   userId       — UserId (plain alias from R5)
//   scope        — current scope identifier (matches substrate ScopeRef
//                   string-shape; not type-imported here to preserve
//                   F-router independence from substrate per Decision-D-S2-5)
//   activeProgram — current program id, if any (caller may know which
//                   program is "in focus")
//   recentDestinations — last-N routing decisions (for stickiness rules)

export type RouterSessionContext = {
  userId:             string
  scope:              string
  activeProgram?:     string
  recentDestinations?: Destination[]
}

// ─── DestinationRegistration (registry entry shape) ───────────────────────────
// What a slice registers when it declares "I handle this destination."
// Sprint 9 wiring: F-chat, F-plan, F-verify, F-discover register at boot.
// Sprint 8 Shot 2: registry is empty. Shape declared.
//
// Match predicate: a pure function over (message, sessionContext) returning
// boolean. Rules declare their own predicates. F-router invokes them in
// priority order; first match wins.

export type RouterMatchPredicate = (
  message: RouterMessage,
  context: RouterSessionContext,
) => boolean

export type DestinationRegistration = {
  destination: Destination
  /** Higher priority evaluated first. Ties broken by registration order. */
  priority:    number
  /** Pure boolean predicate — no I/O, no async. */
  match:       RouterMatchPredicate
  /** Human-readable label for diagnostics; not load-bearing. */
  label?:      string
}

// ─── RouterRule (R1 abstraction over registration) ────────────────────────────
// A rule is a destination registration with an immutable identity. R1 owns
// the data structure that holds rules; R2 owns the registry of rules.

export type RouterRule = DestinationRegistration & {
  ruleId: string
}

// ─── RouterRegistrationKey (registry indexing) ────────────────────────────────
// Composite key for registry storage. Slice + programId disambiguates
// program-specific destinations within a slice.

export type RouterRegistrationKey = string & { readonly _brand: 'RouterRegistrationKey' }

// ─── Errors and Result aliases ────────────────────────────────────────────────

export type RouterError = AppError
export type RouteResult = Result<Destination, RouterError>

// Specific error codes (consumers may match on `error.code`):
//   ROUTER_NO_MATCH         — no rule matched the message+context
//   ROUTER_INVALID_INPUT    — input shape failed validation
//   ROUTER_REGISTRY_EMPTY   — registry has no rules (Sprint 9 wiring missing)

export const ROUTER_ERROR_CODES = {
  NO_MATCH:         'ROUTER_NO_MATCH',
  INVALID_INPUT:    'ROUTER_INVALID_INPUT',
  REGISTRY_EMPTY:   'ROUTER_REGISTRY_EMPTY',
} as const

// ─── End ──────────────────────────────────────────────────────────────────────
