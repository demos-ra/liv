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

// The crossing-decision predicate. It states what the attribute means to a crossing
// (paid/trial admit; lapsed is the gate point) — one named, testable place. WP1 WIRED it:
// entitlementAdmits is now consulted at BOTH write-doors (the MCP turn door + REST /api/compose).
// What stays off the line is the PROVIDER — the swappable outbound seam (§3b), not the decision.
export function entitlementAdmits(status: EntitlementStatus): boolean {
  return status === 'paid' || status === 'trial'
}
