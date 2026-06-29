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

import type { EntitlementStatus } from '@/features/F-entitlement/types/entitlement-types'

export type AccessRegion    = 'PRIVATE' | 'INBOX' | 'BROADCAST' | 'PUBLIC'
export type AccessDirection = 'read' | 'write'
export type GrantKey        = 'free' | 'paid'

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

// grantKeyOf — map the resolved entitlement STATUS to the access GRANT KEY. paid and trial both
// grant the paid key (the trial is the time-boxed FULL-access trial that converts); lapsed falls
// to the free key (the trial elapsed, unpaid → the free tier, NOT a hard deny — free still has
// PUBLIC r+w etc).
// ⚠ FLAG (deferred, L0): the spec §4 pins the free/paid CONTENTS but does NOT pin the
// status→key mapping (paid|trial|lapsed → free|paid). This is my read; L0 confirms or overrides —
// esp. whether `trial` is the full-access trial (paid key) or the free taste (free key).
export function grantKeyOf(status: EntitlementStatus): GrantKey {
  return status === 'lapsed' ? 'free' : 'paid'
}
