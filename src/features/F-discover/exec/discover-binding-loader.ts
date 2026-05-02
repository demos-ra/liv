// @liv-standard v1.5.1
// [F-discover/R4]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
// slice:      F-discover
// layer:      R4
// wires-in:
//   W-ATOM   ResearchBinding,
//            ResearchBindingRegistry  ←  F-discover/R0 f-discover-types
//   W-ATOM   liv-architecture-binding (smoke)  ←  F-discover/R0 config/bindings
// wires-out:
//   W-FN     loadResearchBinding       →  F-discover/R3 discover-contract,
//                                          F-discover external callers
//   W-FN     listAvailableBindings     →  F-discover external admin callers
// deps:
//   R0 ../config/f-discover-types
//   R0 ../config/bindings/liv-architecture-binding
// validated:  pending
//
// F-discover R4 — domain binding registry loader.
//
// A4: this is the I/O boundary for binding resolution. At v1.0 the registry is
//     a static module-import map (one binding: LIV-architecture smoke). Future
//     versions may load bindings from filesystem / DB — that I/O lives here.
//     R0 declares ResearchBindingRegistry shape; R4 fills it.
//
// Per spec §6.9 + §6.2 HR-RS2: domain standards supply ResearchBinding
// instances. R4 is the slice's lookup helper for callers that want to fetch
// a binding by domainId rather than constructing ResearchInput.binding by
// hand.
//
// Sprint 5 D-RS-BINDING-V1 scope (Demos confirmed):
//   - One binding: 'liv-architecture' → LIV_ARCHITECTURE_SMOKE_BINDING
//     (1 InvestigationMethod methodKind='lookup', 1 SourceCriterion
//      groundingClass='reference-resolution')
//   - Full domain bindings deferred per natural-defer rule (Playbook §1.21)

import type {
  ResearchBinding,
  ResearchBindingRegistry,
} from '../config/f-discover-types'
import { LIV_ARCHITECTURE_SMOKE_BINDING } from '../config/bindings/liv-architecture-binding'

// ─── Static registry (v1.0 — module-import map) ──────────────────────────────

const BINDING_REGISTRY: ResearchBindingRegistry = {
  'liv-architecture': LIV_ARCHITECTURE_SMOKE_BINDING,
}

// ─── loadResearchBinding — primary lookup ────────────────────────────────────

/**
 * Fetch a ResearchBinding by domainId.
 *
 * Returns null when no binding is registered for the domain. Callers (R3 or
 * external) decide how to handle the miss — typically by surfacing a typed
 * error to the user.
 *
 * Sprint 5 v1.0 scope:
 *   - 'liv-architecture' → LIV_ARCHITECTURE_SMOKE_BINDING (smoke)
 *   - any other domainId → null
 */
export function loadResearchBinding(domainId: string): ResearchBinding | null {
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

// ─── End of discover-binding-loader.ts ──────────────────────────────────────
