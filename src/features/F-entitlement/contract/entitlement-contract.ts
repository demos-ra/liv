// @liv-standard v1.5.2
// [F-entitlement/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    gate-wiring-e (status surface retired → grant surface: resolveGrantKey + GrantKey;
//             resolveEntitlement/entitlementAdmits/EntitlementStatus removed — the status model is gone)
// slice:      F-entitlement
// layer:      R3
// wires-in:
//   W-FN    resolveGrantKey  @/features/F-entitlement/app/entitlement-workflow
//   W-ATOM  GrantKey         @/features/F-entitlement/domain/gate-matrix
//   W-FN    grantAdmits      @/features/F-entitlement/domain/gate-matrix
//   W-FN    regionOfScope    @/features/F-entitlement/domain/region-of-scope
// wires-out:
//   W-FN    resolveGrantKey  →  src/proxy.ts (the perimeter resolve + grantKey stamp)
//   W-ATOM  GrantKey         →  F-identity/R3 perimeter-consultation (the stamped field type)
//   W-FN    grantAdmits / regionOfScope  →  the R3 CTA producer + the R2 cognition-door floor
// deps:
//   R2  ../app/entitlement-workflow
//   R1  ../domain/gate-matrix, ../domain/region-of-scope
// validated: pending

// The seam's public boundary. proxy.ts resolves the grantKey here (riding the stamp); the doors
// read grantAdmits + regionOfScope here. External consumers import from this surface only.
export { resolveGrantKey } from '../app/entitlement-workflow'
export { grantAdmits } from '../domain/gate-matrix'
export type { GrantKey, AccessRegion, AccessDirection } from '../domain/gate-matrix'
export { regionOfScope } from '../domain/region-of-scope'
