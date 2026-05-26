// @liv-standard v1.5.1 amended sprint-b1-shot-1 sprint-b1-shot-2 sprint-beta-shot-3
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended:  sprint-b1-shot-1 (PERIMETER_HEADER_CHANNEL + PERIMETER_HEADER_CROSSED_AT added)
//           sprint-b1-shot-2 (PERIMETER_HEADER_DISPOSITION added)
//           sprint-beta-shot-3 (PERIMETER_HEADER_AUTHORITY added — channel's resolved AuthorityAssertion[] stamp)
// slice:    core
// layer:    R5
// wires-in: none
// wires-out:
//   W-ATOM PERIMETER_HEADER_USER_ID     → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
//   W-ATOM PERIMETER_HEADER_SESSION_ID  → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
//   W-ATOM PERIMETER_HEADER_CHANNEL     → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
//   W-ATOM PERIMETER_HEADER_CROSSED_AT  → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
//   W-ATOM PERIMETER_HEADER_DISPOSITION → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
//   W-ATOM PERIMETER_HEADER_AUTHORITY   → src/proxy.ts (perimeter site setter), F-identity perimeter-consultation (reader)
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PERIMETER HEADER NAMES — R5 placement-stable constants
// ═══════════════════════════════════════════════════════════════
// Canonical spec: F-FORWARD-1 (governance doc not yet authored; see PLACEMENT_REGISTRY change log)
//
// Rationale (DD-Step-5 = 5B): the perimeter site (root middleware.ts) is
// placement-mobile per LIV-Standard (Next.js convention places it at root,
// not inside src/). The header-name string constants it produces are
// placement-stable R5 atoms consumed by both the site (setter) and
// downstream contracts (reader at F-identity/contract/perimeter-
// consultation.ts). Co-locating the constants with the site would violate
// R5 placement stability; relocating them to src/core/constants/ keeps
// them inside the typed-runtime tree where LIV-Standard R-layer rules
// apply uniformly.
//
// Header naming convention: 'x-perimeter-*' marks headers as perimeter-
// internal — set only by the perimeter site, consumed only by F-identity/
// contract/perimeter-consultation.ts. Programs and contracts MUST NOT
// set these headers; the unitary-site invariant (PA-I) requires that
// perimeter-validated state can only originate at the perimeter site.

export const PERIMETER_HEADER_USER_ID    = 'x-perimeter-user-id'
export const PERIMETER_HEADER_SESSION_ID = 'x-perimeter-session-id'
export const PERIMETER_HEADER_CHANNEL    = 'x-perimeter-channel'
export const PERIMETER_HEADER_CROSSED_AT = 'x-perimeter-crossed-at'
export const PERIMETER_HEADER_DISPOSITION = 'x-perimeter-disposition'
// sprint-beta-shot-3: the channel's resolved PermittedAuthoritySet
// (AuthorityAssertion[]) from PerimeterBinding.permittedAuthorityByChannel,
// JSON-serialized. Set once at proxy.ts; read by getPerimeterSession. This is
// the capability mechanism made live — proxy.ts resolves the channel's
// permitted-authority set and stamps it; downstream contracts read, never
// re-resolve (PA-I unitary discipline).
export const PERIMETER_HEADER_AUTHORITY  = 'x-perimeter-authority'
