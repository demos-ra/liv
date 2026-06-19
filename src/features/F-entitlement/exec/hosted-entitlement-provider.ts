// @liv-standard v1.5.2
// [F-entitlement/R4]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R4
// wires-in:
//   W-ATOM  EntitlementProvider     @/features/F-entitlement/types/entitlement-types
//   W-ATOM  ENTITLEMENT_TRIAL_DAYS   @/features/F-entitlement/types/entitlement-types
//   W-FN    computeTrialEntitlement  @/features/F-entitlement/domain/entitlement-logic
// wires-out:
//   W-FN    hostedDefaultProvider  →  F-entitlement/R2
// deps:
//   R0  @/features/F-entitlement/types/entitlement-types
//   R1  @/features/F-entitlement/domain/entitlement-logic
// validated: pending

import type { EntitlementProvider } from '@/features/F-entitlement/types/entitlement-types'
import { ENTITLEMENT_TRIAL_DAYS } from '@/features/F-entitlement/types/entitlement-types'
import { computeTrialEntitlement } from '@/features/F-entitlement/domain/entitlement-logic'

// The hosted default provider — the integration-socket slot, occupied.
//
// This is where a provider's outbound I/O lives. The hosted default has NO
// external system to call: it is the trial gate over the account anchor, so it
// delegates straight to the R1 computation. A real provider (Polar) sits beside
// this file — it calls its API by query.userId, maps the response to an
// Entitlement, and the R2 binding is repointed at it. Nothing else moves.
export const hostedDefaultProvider: EntitlementProvider = async (query) =>
  computeTrialEntitlement(query.accountCreatedAt, new Date(), ENTITLEMENT_TRIAL_DAYS)
