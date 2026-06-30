// @liv-standard v1.5.2
// [F-entitlement/R0]
// Built with LIV · livai.dev
//
// RETIRED at gate-wiring-(e). The status model (EntitlementStatus 'paid'|'trial'|'lapsed',
// Entitlement, EntitlementQuery, EntitlementProvider, ENTITLEMENT_TRIAL_DAYS) is gone — replaced by
// the grant model: Grant + Tier (types/grant-types, types/tier-registry), grantKey resolution
// (app/entitlement-workflow resolveGrantKey), floor-by-absence (domain/grant-floor). No symbol here
// has any importer (verified by typecheck after the cut).
//
// This file is empty pending physical deletion — `git rm` is blocked by the local bash-guard, so it
// is overwritten to an empty module and FLAGGED for deletion at seal.

export {}
