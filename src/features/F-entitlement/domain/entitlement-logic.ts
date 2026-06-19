// @liv-standard v1.5.2
// [F-entitlement/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R1
// wires-in:
//   W-ATOM  Entitlement        @/features/F-entitlement/types/entitlement-types
//   W-ATOM  EntitlementStatus  @/features/F-entitlement/types/entitlement-types
// wires-out:
//   W-FN    computeTrialEntitlement  →  F-entitlement/R4
//   W-FN    entitlementAdmits        →  F-entitlement/R3
// deps:
//   R0  @/features/F-entitlement/types/entitlement-types
// validated: pending

import type { Entitlement, EntitlementStatus } from '@/features/F-entitlement/types/entitlement-types'

const MS_PER_DAY = 86_400_000

// The trial gate — pure. Given the anchor, now, and the window, decide trial
// vs lapsed. It NEVER returns 'paid': a settled payment is a provider fact, not
// a clock fact, so only a real provider can assert it. A null anchor (no
// account record on this crossing) resolves to 'trial' — permissive, because
// nothing enforces on the attribute yet and a missing record must not lock a
// real wearer out. It is a gate (elapsed-or-not), never a meter (no count).
export function computeTrialEntitlement(
  accountCreatedAt: Date | null,
  now:              Date,
  trialDays:        number,
): Entitlement {
  if (accountCreatedAt === null) return { status: 'trial' }
  const elapsedDays = (now.getTime() - accountCreatedAt.getTime()) / MS_PER_DAY
  return { status: elapsedDays <= trialDays ? 'trial' : 'lapsed' }
}

// The crossing-decision SHAPE — exposed, not wired. It states what the attribute
// would mean to a crossing (paid/trial admit; lapsed is the gate point) so the
// decision is one named, testable place. The line does not call it: enforcing it
// is the integration's act (Permissions' dimension), out of this seam's scope.
export function entitlementAdmits(status: EntitlementStatus): boolean {
  return status === 'paid' || status === 'trial'
}
