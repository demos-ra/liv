// @liv-standard v1.5.2
// [F-entitlement/R1]
// Built with LIV · livai.dev
//
// THE GRANT MATRIX (Wave-3 gate) — grant × region × direction → admit/locked. Extends the flat
// entitlementAdmits (status → bool, write-admit only) into the access-aware gate the Access-Surface
// spec §4 pins. The CONTENTS are from the spec, NOT invented:
//
//   key     grants                                   (Access-Surface Build Spec §4)
//   free    PUBLIC r+w · BROADCAST r · INBOX r
//   paid    + PRIVATE r+w · BROADCAST w (publish) · INBOX w
//
//   Check (§4):  op allowed  iff  key.grants ⊇ region.requirement(direction)
//
// The region is the NAME OF A CELL in who-reads × who-writes (spec §2) — it arrives here as a
// derived VALUE (the access-pair → region values-home is owned elsewhere, a settings concern; this
// matrix only CONSUMES the region value, it does not hardcode the access pair). Tier touches Grant
// ONLY (§4 SHALL: the menu is tier-invariant); the difference surfaces solely as the locked result.

import type { Tier } from '@/features/F-entitlement/types/tier-registry'
import type { Grant } from '@/features/F-entitlement/types/grant-types'

export type AccessRegion    = 'PRIVATE' | 'INBOX' | 'BROADCAST' | 'PUBLIC'
export type AccessDirection = 'read' | 'write'
// The matrix's row id: the free FLOOR plus every registry Tier. 'free' is reached only by absence
// (the floor), never carried on a grant; a Tier is reached by a live grant.
export type GrantKey        = 'free' | Tier

const cell = (region: AccessRegion, direction: AccessDirection) => `${region}:${direction}`

// The §4 contents, encoded once. FREE cells: admitted by BOTH keys (free ⊆ paid). PAID-only cells:
// admitted by the paid key alone. Every region×direction is covered (8 cells); a cell in neither
// set is undefined → not admitted (honest-empty / dark, never a silent allow).
const FREE_CELLS: ReadonlySet<string> = new Set([
  cell('PUBLIC', 'read'), cell('PUBLIC', 'write'),
  cell('BROADCAST', 'read'),
  cell('INBOX', 'read'),
])
const PAID_ONLY_CELLS: ReadonlySet<string> = new Set([
  cell('PRIVATE', 'read'), cell('PRIVATE', 'write'),
  cell('BROADCAST', 'write'),   // publish
  cell('INBOX', 'write'),
])

// grantAdmits — the §4 check. A free cell admits on any key; a paid-only cell admits only on the
// paid key; anything else (an undefined cell) is NOT admitted (fail-closed, like the read builder).
export function grantAdmits(key: GrantKey, region: AccessRegion, direction: AccessDirection): boolean {
  const c = cell(region, direction)
  if (FREE_CELLS.has(c)) return true
  if (key === 'paid') return PAID_ONLY_CELLS.has(c)
  return false
}

// grantKeyOf — the grant's access key, read STRAIGHT OFF the grant's tier. ONE job: grant → key,
// source-blind (never knows the producer, never inspects a status). The `lapsed` branch is GONE —
// expiry is absence, resolved by the FLOOR (grant-floor.ts), a separate home; this function is only
// ever called with a live grant. No status, no trial branch, no embedded tier.
export function grantKeyOf(grant: Grant): GrantKey {
  return grant.tier
}
