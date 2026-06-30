// @liv-standard v1.5.2
// [F-entitlement/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R2
// wires-in:
//   W-ATOM  Grant      @/features/F-entitlement/types/grant-types
//   W-ATOM  GrantSpec  @/features/F-entitlement/domain/grant-issuance
//   W-FN    makeGrant  @/features/F-entitlement/domain/grant-issuance
// wires-out:
//   W-FN    issueGrant  →  issuance wiring (signup / payment producer) — DORMANT until activation
// deps:
//   R0  @/features/F-entitlement/types/grant-types
//   R1  @/features/F-entitlement/domain/grant-issuance
// validated: pending
//
// THE ISSUER — issues a Grant ONCE per principal per source. Owns exactly two things: VALID (a
// well-formed grant via makeGrant) + ONCE-PER-PRINCIPAL (the injected store seam). NO access logic
// (the matrix), NO liveness (the floor), NO tier embedding (the registry). Trial/promo/comp/referral
// all flow through here — the difference is the spec VALUE, never a branch.
//
// Persistence is an INJECTED PORT (the grants store): its impl + table land with issuance wiring /
// the (e) cutover. The issuer is the ONE home that decides once-ness; the store only records.
// DORMANT this pass — no caller, no store impl.

import type { Grant } from '../types/grant-types'
import type { GrantSpec } from '../domain/grant-issuance'
import { makeGrant } from '../domain/grant-issuance'

// The grants store seam — once-per-principal-per-source check + the append-only record. (The store
// keeps `source` for the once-key; the Grant handed to the gate never carries it — source-blind.)
export interface IssuerStore {
  alreadyIssued(principalUserId: string, source: GrantSpec['source']): Promise<boolean>
  persist(principalUserId: string, grant: Grant, source: GrantSpec['source']): Promise<void>
}

export type IssueResult =
  | { issued: true;  grant: Grant }
  | { issued: false; reason: 'already-issued' }

// issueGrant — the one issuance entry. Check once → construct (valid) → persist. Idempotent by the
// once-check: a second issuance of the same source for a principal is refused, not duplicated.
export async function issueGrant(
  principalUserId: string,
  spec:            GrantSpec,
  grantedAt:       Date,
  store:           IssuerStore,
): Promise<IssueResult> {
  if (await store.alreadyIssued(principalUserId, spec.source)) {
    return { issued: false, reason: 'already-issued' }
  }
  const grant = makeGrant(spec, grantedAt)
  await store.persist(principalUserId, grant, spec.source)
  return { issued: true, grant }
}
