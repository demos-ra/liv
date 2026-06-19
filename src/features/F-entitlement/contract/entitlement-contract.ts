// @liv-standard v1.5.2
// [F-entitlement/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R3
// wires-in:
//   W-FN    resolveEntitlement   @/features/F-entitlement/app/entitlement-workflow
//   W-FN    entitlementAdmits    @/features/F-entitlement/domain/entitlement-logic
//   W-ATOM  EntitlementStatus    @/features/F-entitlement/types/entitlement-types
//   W-ATOM  Entitlement          @/features/F-entitlement/types/entitlement-types
//   W-ATOM  EntitlementQuery     @/features/F-entitlement/types/entitlement-types
//   W-ATOM  EntitlementProvider  @/features/F-entitlement/types/entitlement-types
// wires-out:
//   W-FN    resolveEntitlement  →  src/proxy.ts (the stamp site)
//   W-FN    entitlementAdmits   →  crossing-decision consumers (integration)
//   W-ATOM  EntitlementStatus   →  F-identity/R3 perimeter-consultation (the stamped field type)
// deps:
//   R2  ../app/entitlement-workflow
//   R1  ../domain/entitlement-logic
//   R0  ../types/entitlement-types
// validated: pending

export { resolveEntitlement } from '../app/entitlement-workflow'
// The seam's public boundary. proxy.ts resolves the attribute here (riding the
// stamp); a crossing decision reads entitlementAdmits here. External consumers
// import from this surface only — never from R0/R1/R2/R4 directly.
export { entitlementAdmits } from '../domain/entitlement-logic'
export type { EntitlementStatus, Entitlement, EntitlementQuery, EntitlementProvider } from '../types/entitlement-types'
