// @liv-standard v1.5.2
// [F-entitlement/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R1
// wires-in:
//   W-ATOM  Grant  @/features/F-entitlement/types/grant-types
//   W-ATOM  Tier   @/features/F-entitlement/types/tier-registry
// wires-out:
//   W-ATOM  GrantSpec / EntitlementSource / TRIAL_SPEC  →  F-entitlement/R2 issuer-workflow
//   W-FN    makeGrant                                   →  F-entitlement/R2 issuer-workflow
// deps:
//   R0  @/features/F-entitlement/types/grant-types
//   R0  @/features/F-entitlement/types/tier-registry
// validated: pending
//
// THE ISSUANCE PRIMITIVE (pure) — a Grant is ISSUED from a spec, never branched into existence.
// ISSUANCE-IS-THE-MECHANISM: trial is a VALUE (paid · 30d · source 'trial'), not a code path;
// promo/comp/referral are other VALUES on the SAME primitive — no `if trial` anywhere. This file
// owns one thing: a valid spec → a Grant. NO access logic (the matrix owns that), NO liveness (the
// floor owns that), NO once-per-principal (the issuer-workflow's persistence concern, R2).

import type { Grant } from '../types/grant-types'
import type { Tier } from '../types/tier-registry'

// The source a grant was issued from — issuance provenance, NEVER on the Grant the gate consumes
// (the gate stays source-blind); carried here + by the store for once-per-principal-per-source.
export type EntitlementSource = 'trial' | 'promo' | 'comp' | 'referral' | 'paid'

export interface GrantSpec {
  tier:         Tier
  durationDays: number
  source:       EntitlementSource
}

// The trial spec — confirmed values: paid tier · 30 days · source 'trial' · once-per-principal
// (enforced by the issuer) · expire-to-floor (liveness by absence, grant-floor). A value, not a path.
export const TRIAL_SPEC: GrantSpec = { tier: 'paid', durationDays: 30, source: 'trial' }

// makeGrant — construct the Grant value from a spec at an anchor. Pure: no I/O, no branch on source.
// The Grant carries only what the gate consumes (tier + window); source stays out of it.
export function makeGrant(spec: GrantSpec, grantedAt: Date): Grant {
  const tier: Tier = spec.tier
  return { tier, grantedAt, durationDays: spec.durationDays }
}
