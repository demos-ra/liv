// @liv-standard v1.5.1
// [F-verify/R4]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
// slice:      F-verify
// layer:      R4
// wires-in:
//   W-ATOM   VerificationBinding,
//            VerificationBindingRegistry  ←  F-verify/R0 f-verify-types
//   W-ATOM   liv-standard-binding (smoke)  ←  F-verify/R0 config/bindings
// wires-out:
//   W-FN     loadVerificationBinding       →  F-verify/R3 verify-contract,
//                                             F-verify external callers
//   W-FN     listAvailableBindings         →  F-verify external admin callers
// deps:
//   R0 ../config/f-verify-types
//   R0 ../config/bindings/liv-standard-binding
// validated:  pending
//
// F-verify R4 — domain binding registry loader.
//
// A4: this is the I/O boundary for binding resolution. At v1.0 the registry is
//     a static module-import map (one binding: LIV-Standard smoke). Future
//     versions may load bindings from filesystem / DB — that I/O lives here.
//     R0 declares VerificationBindingRegistry shape; R4 fills it.
//
// Per spec §6.9 + §6.2 HR-VS2: domain standards supply VerificationBinding
// instances. R4 is the slice's lookup helper for callers that want to fetch a
// binding by domainId rather than constructing VerificationInput.binding by
// hand.
//
// Sprint 4 D3 scope (γ — confirmed by L0):
//   - One binding: 'liv-standard' → LIV_STANDARD_SMOKE_BINDING
//     (3 structural-property predicates against a known target shape)
//   - Full LIV-Standard 153-predicate binding lands in subsequent cycle
//     (Sprint 4.x) post pre-pass classification work.

import type {
  VerificationBinding,
  VerificationBindingRegistry,
} from '../config/f-verify-types'
import { LIV_STANDARD_SMOKE_BINDING } from '../config/bindings/liv-standard-binding'

// ─── Static registry (v1.0 — module-import map) ──────────────────────────────

const BINDING_REGISTRY: VerificationBindingRegistry = {
  'liv-standard': LIV_STANDARD_SMOKE_BINDING,
}

// ─── loadVerificationBinding — primary lookup ────────────────────────────────

/**
 * Fetch a VerificationBinding by domainId.
 *
 * Returns null when no binding is registered for the domain. Callers (R3 or
 * external) decide how to handle the miss — typically by surfacing a typed
 * error to the user.
 *
 * Sprint 4 v1.0 scope:
 *   - 'liv-standard' → LIV_STANDARD_SMOKE_BINDING (3-predicate smoke set)
 *   - any other domainId → null
 */
export function loadVerificationBinding(domainId: string): VerificationBinding | null {
  return BINDING_REGISTRY[domainId] ?? null
}

// ─── listAvailableBindings — admin / introspection ───────────────────────────

/**
 * List all registered binding domain ids. Used by admin tooling +
 * framework-audit binding-existence checks.
 */
export function listAvailableBindings(): string[] {
  return Object.keys(BINDING_REGISTRY)
}

// ─── End of verify-binding-loader.ts ────────────────────────────────────────
