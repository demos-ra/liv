// @liv-standard v1.5.2
// [F-entitlement/R4]
// Built with LIV · livai.dev
//
// RETIRED at gate-wiring-(e). The hosted status provider (computeTrialEntitlement over the account
// anchor) is gone. The grant resolution now lives at app/entitlement-workflow (resolveGrantKey):
// a trial grant derived from the wearer's anchor, liveness once at the perimeter. Polar plugs there
// via the GrantProvider seam (types/grant-types). No importer remains (verified by typecheck).
//
// Empty pending physical deletion — `git rm` blocked by bash-guard; overwritten to an empty module
// and FLAGGED for deletion at seal.

export {}
