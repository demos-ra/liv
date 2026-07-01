// @liv-standard v1.5.2
// [F-entitlement/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R1
// wires-in:
//   W-ATOM  AccessRegion  @/features/F-entitlement/domain/gate-matrix
// wires-out:
//   W-FN    regionOfScope  →  the gate consult, the admit floor (e), the CTA producer (6)
// deps:
//   R1  @/features/F-entitlement/domain/gate-matrix
// validated: pending
//
// regionOfScope — derive the AccessRegion from the row's write-stamped source_scope, the MEETING
// POINT where read-who and write-who converge (written at substrate-repository.ts:143
// `validated.source.scope`; read-filtered at scope-clause.ts:62 `source_scope = 'public'`). ONE
// home: every consumer (the gate, the admit floor, the CTA) derives HERE, none reconstructs.
//
// NEVER caller-supplied (the "too raw" guard): the producer takes only the stamped column, so a
// caller cannot hand in a region — region is a projection of the row's intrinsic visibility.
//
// FAIL-CLOSED posture, adapted to an OPEN set: source_scope is NOT a closed enum — a private write
// stamps the wearer's own circumstance (an arbitrary projectId/sessionId), and 'public' is the ONE
// reserved cross-author value. So scopeClause's throw-on-unknown does NOT transfer (it would throw
// on every private projectId). The fail-closed equivalent is DEFAULT-TO-MOST-RESTRICTIVE: anything
// that is not the reserved 'public' resolves to PRIVATE (owner-only, the least-access cell) — never
// accidentally PUBLIC. The deny-on-undefined-cell teeth then live in grantAdmits (gate-matrix.ts:48).
//
// WAVE-4 SEAM (named, not stubbed): INBOX and BROADCAST are not yet source_scope values; when those
// reserved scopes exist they get explicit cases here (live cells unchanged, no re-cut). Until then a
// non-'public' scope is PRIVATE — fail-closed-safe: a future forum scope mis-bucketed to PRIVATE
// UNDER-grants (owner-only), never over-grants.

import type { AccessRegion } from './gate-matrix'

export function regionOfScope(sourceScope: string): AccessRegion {
  // 'public' is the substrate's PUBLIC_SCOPE (scope-clause.ts). Kept as a literal here, NOT imported:
  // F-memory's tier floor already calls grantAdmits (F-memory → F-entitlement), so importing back
  // would form an F-entitlement ↔ F-memory cycle. Billing's categorization knows the reserved value.
  if (sourceScope === 'public') return 'PUBLIC'
  // Wave-4: add 'inbox' → 'INBOX', 'broadcast' → 'BROADCAST' here when those scopes exist.
  return 'PRIVATE'
}
