// @liv-standard v1.5.2
// [F-entitlement/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R0
// wires-in:
//   W-ATOM  Tier  @/features/F-entitlement/types/tier-registry
// wires-out:
//   W-ATOM  Grant  →  F-entitlement/R1 gate-matrix + grant-floor, producers (R2/R4), the admit feed (e)
// deps:
//   R0  @/features/F-entitlement/types/tier-registry
// validated: pending
//
// THE GRANT — the unit the gate consumes. Modular fields, each its own home, SOURCE-BLIND: the gate
// never knows Polar-vs-issuer. A producer (payment gateway, issuance primitive) emits a Grant; none
// holds access logic.
//   tier         — references the tier registry (never embeds access); the matrix says what it can do.
//   durationDays — the grant's OWN field (the same one membership uses); a tunable value (trial=30).
//   grantedAt    — the window anchor. Liveness is computed AT READ (now inside the window?) — there
//                  is NO stored active→expired flip; expiry is ABSENCE, resolved by the floor, never
//                  a branch on the grant.

import type { Tier } from './tier-registry'

export interface Grant {
  tier:         Tier
  grantedAt:    Date
  durationDays: number
}

// GrantProvider — the RESHAPED producer seam (the grant-reshape of the status-shaped
// EntitlementProvider). A producer (payment gateway, the issuer) emits the principal's LIVE grant,
// or null (no grant → the floor resolves to free). SOURCE-BLIND: the gate never knows Polar-vs-issuer.
// Dormant until (e) cuts the live consumers (proxy stamp + the door gate) over from the status seam.
export interface GrantQuery {
  userId:           string
  accountCreatedAt: Date | null
}
export type GrantProvider = (query: GrantQuery) => Promise<Grant | null>
