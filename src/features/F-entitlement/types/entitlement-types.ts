// @liv-standard v1.5.2
// [F-entitlement/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  EntitlementStatus    →  F-entitlement/R1 R2 R3, F-identity/R3
//   W-ATOM  Entitlement          →  F-entitlement/R1 R2 R4
//   W-ATOM  EntitlementQuery     →  F-entitlement/R2 R4, src/proxy.ts
//   W-ATOM  EntitlementProvider  →  F-entitlement/R2 R4
//   W-ATOM  ENTITLEMENT_TRIAL_DAYS  →  F-entitlement/R2 R4
// deps:      none
// validated: pending

export type EntitlementStatus = 'paid' | 'trial' | 'lapsed'
// The one attribute the seam exposes. Three states; nothing else crosses.
//   paid   — a settled payment (only a real provider returns this).
//   trial  — inside the time-boxed trial window (a gate, never a meter).
//   lapsed — the trial window has elapsed and nothing was paid.

// The resolved attribute. One field today; a struct so a provider can carry
// more (a renewal date, a plan name) without re-cutting every consumer.
export interface Entitlement {
  status: EntitlementStatus
}

// What a provider is asked. userId is the resolution key a real provider
// (Polar) calls its API with. accountCreatedAt is the trial anchor the hosted
// default reads; it is null when the crossing carries no account record
// (the token path), and the provider decides what a null anchor means.
export interface EntitlementQuery {
  userId:           string
  accountCreatedAt: Date | null
}

// THE SWAP POINT. A provider is one async function behind this shape. The
// hosted default plugs in here; L0 plugs Polar in here. Swapping the provider
// is changing which function the R2 binding names — no consumer re-cut, no
// line touched. This is the outbound integration-socket (Blueprint §3b).
export type EntitlementProvider = (query: EntitlementQuery) => Promise<Entitlement>

// The trial window — time-boxed, ≈ one month. A gate, not a meter: no usage
// count, no cap, only an elapsed-days boundary.
export const ENTITLEMENT_TRIAL_DAYS = 30
