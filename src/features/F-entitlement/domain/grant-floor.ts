// @liv-standard v1.5.2
// [F-entitlement/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R1
// wires-in:
//   W-ATOM  Grant      @/features/F-entitlement/types/grant-types
//   W-ATOM  GrantKey   @/features/F-entitlement/domain/gate-matrix
//   W-FN    grantKeyOf @/features/F-entitlement/domain/gate-matrix
// wires-out:
//   W-FN    grantKeyForRead / isGrantLive / FREE_FLOOR  →  the gate consult (e), the CTA producer (R3)
// deps:
//   R0  @/features/F-entitlement/types/grant-types
//   R1  @/features/F-entitlement/domain/gate-matrix
// validated: pending
//
// THE FLOOR — WHICH key applies when there is no LIVE grant. Free is the fail-closed floor, NOT a
// grant. Expiry is ABSENCE: liveness is computed at read (now inside the grant's window?), with NO
// stored active→expired flip and NO second 'lapsed' branch. Trial-end, paid-end, never-had-one all
// resolve ONE way: a live grant → its tier (via grantKeyOf); else → the free floor.
//
// TWO HOMES, no overlap: the MATRIX (gate-matrix) says WHAT a key can do; the FLOOR (here) says
// WHICH key when no live grant. grantKeyOf does one job (grant → key); the floor does the other.

import type { Grant } from '@/features/F-entitlement/types/grant-types'
import type { GrantKey } from '@/features/F-entitlement/domain/gate-matrix'
import { grantKeyOf } from '@/features/F-entitlement/domain/gate-matrix'

const MS_PER_DAY = 86_400_000

// The fail-closed floor key — the ONLY key reached by absence; never stored on a grant.
export const FREE_FLOOR: GrantKey = 'free'

// Liveness BY ABSENCE — is `now` inside the grant's window? Computed each read; nothing is stored
// flipping active→expired. A grant past its window is simply not live (→ the floor resolves it).
export function isGrantLive(grant: Grant, now: Date): boolean {
  return now.getTime() <= grant.grantedAt.getTime() + grant.durationDays * MS_PER_DAY
}

// The floor resolution — the ONE-WAY resolve. A live grant → its tier key; null OR past-window →
// the free floor. No `if trial`, no `lapsed`: never-had-one and elapsed fall the same way.
export function grantKeyForRead(grant: Grant | null, now: Date): GrantKey {
  return grant && isGrantLive(grant, now) ? grantKeyOf(grant) : FREE_FLOOR
}
