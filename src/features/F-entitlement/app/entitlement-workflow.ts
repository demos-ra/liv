// @liv-standard v1.5.2
// [F-entitlement/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    gate-wiring-e (resolveEntitlement(status) retired → resolveGrantKey: liveness once,
//             grantKey out; the status model + computeTrialEntitlement + null→'trial' permissive retired)
// slice:      F-entitlement
// layer:      R2
// wires-in:
//   W-ATOM  GrantKey       @/features/F-entitlement/domain/gate-matrix
//   W-ATOM  TRIAL_SPEC     @/features/F-entitlement/domain/grant-issuance
//   W-FN    makeGrant      @/features/F-entitlement/domain/grant-issuance
//   W-FN    grantKeyForRead @/features/F-entitlement/domain/grant-floor
// wires-out:
//   W-FN    resolveGrantKey  →  src/proxy.ts (the perimeter resolve, by principal)
// deps:
//   R1  @/features/F-entitlement/domain/grant-issuance, grant-floor
//   R1  @/features/F-entitlement/domain/gate-matrix
// validated: pending

import type { GrantKey } from '../domain/gate-matrix'
import { TRIAL_SPEC, makeGrant } from '../domain/grant-issuance'
import { grantKeyForRead } from '../domain/grant-floor'

// resolveGrantKey — the perimeter's entitlement resolution, BY PRINCIPAL. Liveness is computed
// ONCE here (the perimeter holds the wearer's grant + `now`); the resolved grantKey ('free'|'paid')
// is what crosses — no Date through the header, R2 re-resolves nothing.
//
// Hosted default: a trial grant derived from the wearer's account anchor (accountCreatedAt). A null
// anchor (no account resolved for this principal) → no grant → the FREE FLOOR. The retired
// null→'trial' permissive is GONE: at enforcement, absence resolves to free uniformly (floor-by-
// absence), there is no permissive carve-out. Polar plugs by emitting a Grant in place of the
// trial-from-anchor default (the GrantProvider seam, grant-types) — this resolve is the swap point.
export function resolveGrantKey(accountCreatedAt: Date | null, now: Date): GrantKey {
  const grant = accountCreatedAt === null ? null : makeGrant(TRIAL_SPEC, accountCreatedAt)
  return grantKeyForRead(grant, now)
}
