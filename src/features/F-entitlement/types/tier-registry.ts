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
//   W-ATOM  Tier    →  F-entitlement/R0 grant-types, R1 gate-matrix
//   W-ATOM  TIERS   →  F-entitlement (catalog reads)
// deps:      none
// validated: pending
//
// THE TIER REGISTRY — the catalog of tiers a Grant may reference. A tier is a paid LEVEL; today
// there is exactly one ('paid'). N-tier-READY BY SHAPE: a new level is a VALUE here + a matrix row
// (gate-matrix) — no structural change, no new branch. The registry owns WHICH TIERS EXIST; it
// holds NO access logic (the matrix says what a tier can do) and NO duration (the grant's field).
//
// Free is NOT a tier — it is the fail-closed floor (no live grant → free), owned by the floor
// (grant-floor), not the registry. A Grant always carries a registry Tier; ABSENCE resolves to free
// at read. Trial references a tier (paid); it never embeds one.

export type Tier = 'paid'

// The catalog. One level today. Add 'pro' | … as a VALUE here, with its matrix row — that is the
// whole N-tier change.
export const TIERS: readonly Tier[] = ['paid'] as const

// Source-blind validity check — is a raw string a registered tier? (No access logic; membership.)
export function isTier(value: string): value is Tier {
  return (TIERS as readonly string[]).includes(value)
}
