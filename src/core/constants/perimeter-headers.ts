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

// build-spec-part5: the entitlement attribute (paid | trial | lapsed) resolved
// from the swappable seam (F-entitlement). Set once at proxy.ts; read by
// getPerimeterSession. The attribute rides the stamp so a crossing decision can
// consult it — the deny decision itself is not made here (Permissions' dimension).
export const PERIMETER_HEADER_ENTITLEMENT = 'x-perimeter-entitlement'

// ── PA-I enforcement: the site's stamp (the write-perimeter's teeth, Part 6) ──────
// The full set of perimeter headers, and the ONE site-stamp helper. PA-I (above) says
// perimeter-validated state can ONLY originate at the perimeter site — so any INBOUND
// perimeter header is a forgery (a client or program cannot legitimately set one) and must
// never survive into the request a route reads. stampPerimeterHeaders clones the inbound
// headers, DELETES every perimeter header (stripping any forgery), THEN sets the authoritative
// site values. getPerimeterSession therefore reads ONLY site-originated state: a stranger
// cannot forge x-perimeter-user-id to write across another wearer's scope. Pure (R5, no deps)
// so it is testable in isolation; the perimeter site (src/proxy.ts) is its sole caller.
export const PERIMETER_HEADERS = [
  PERIMETER_HEADER_USER_ID,
  PERIMETER_HEADER_SESSION_ID,
  PERIMETER_HEADER_CHANNEL,
  PERIMETER_HEADER_CROSSED_AT,
  PERIMETER_HEADER_DISPOSITION,
  PERIMETER_HEADER_AUTHORITY,
  PERIMETER_HEADER_ENTITLEMENT,   // B↔E fold: entitlement is site-originated — a forged x-perimeter-entitlement is stripped, then re-set authoritatively (below, in proxy.ts)
] as const

export function stampPerimeterHeaders(
  incoming: Headers,
  values: Partial<Record<(typeof PERIMETER_HEADERS)[number], string>>,
): Headers {
  const headers = new Headers(incoming)
  for (const name of PERIMETER_HEADERS) headers.delete(name)         // strip any inbound forgery
  for (const name of PERIMETER_HEADERS) {
    const value = values[name]
    if (value !== undefined) headers.set(name, value)               // set the authoritative site value
  }
  return headers
}
