// @liv-standard v1.5.2
// [F-entitlement/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R2
// wires-in:
//   W-ATOM  Entitlement          @/features/F-entitlement/types/entitlement-types
//   W-ATOM  EntitlementQuery     @/features/F-entitlement/types/entitlement-types
//   W-ATOM  EntitlementProvider  @/features/F-entitlement/types/entitlement-types
//   W-FN    hostedDefaultProvider  @/features/F-entitlement/exec/hosted-entitlement-provider
// wires-out:
//   W-FN    resolveEntitlement  →  F-entitlement/R3
// deps:
//   R0  @/features/F-entitlement/types/entitlement-types
//   R4  @/features/F-entitlement/exec/hosted-entitlement-provider
// validated: pending

import type { Entitlement, EntitlementQuery, EntitlementProvider } from '@/features/F-entitlement/types/entitlement-types'
import { hostedDefaultProvider } from '@/features/F-entitlement/exec/hosted-entitlement-provider'

// THE BINDING — the one line that names the live provider. To plug Polar: add
// the R4 polar provider and repoint this to it. That is the whole swap; no
// consumer changes, no engine/boundary/surface line is touched.
const ACTIVE_ENTITLEMENT_PROVIDER: EntitlementProvider = hostedDefaultProvider

// Resolve the attribute. Consumers call this; they never name a provider. The
// provider override exists for tests (and for a caller that holds its own) —
// proving the seam is provider-agnostic; production passes nothing and gets the
// binding above.
export function resolveEntitlement(
  query:    EntitlementQuery,
  provider: EntitlementProvider = ACTIVE_ENTITLEMENT_PROVIDER,
): Promise<Entitlement> {
  return provider(query)
}
