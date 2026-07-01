// @liv-standard v1.5.2
// [F-identity/R2]
// Built with LIV · livai.dev
// [F-identity/app/principal-aliases.ts]
//
// aliasesOf — the principal-set producer (Wave-2 keystone, ADDITION). Returns the reader's
// principal ids (self + any reconciled aliases) as DATA for the one read builder's alias-fold
// (the seam folds user_id = ANY($1)). It SUPPLIES data only — it makes NO scoping decision; the
// seam decides the bound.
//
// Append-only / resolved-at-read (the L0 reconciliation shape): aliases are APPENDED
// (auth_user_aliases, ADDITION) and the read folds user_id = ANY(my-ids) at read — nothing
// rewritten, no post orphaned. Today returns [reader] (self only); the fill — querying
// auth_user_aliases, populated when signup-reconcile appends a federated/provisional alias — is
// connect-time identity, OPEN-B (Wave 2/3).

// The resolve port — R2 DECLARES it; R3 supplies the live auth-DB adapter (aliasPrincipalSet). No
// R2→R4 import (the reconcile C-ruling). Tests pass a stub.
export type AliasResolve = (reader: string) => Promise<string[]>

// aliasesOf (activation) — resolves the reader's principal ids (self + reconciled aliases) via the
// injected port; the read folds them into user_id = ANY($1). FAIL-SAFE: a resolve error OR an empty
// set narrows to [reader] — NEVER widens, never empty. With an empty auth_user_aliases table the live
// port returns [reader], so the fold is behavior-IDENTICAL to the pre-fold single-id read until a
// reconcile appends an alias. DATA only — the seam decides the bound, this makes no scoping decision.
export async function aliasesOf(reader: string, resolve: AliasResolve): Promise<string[]> {
  try {
    const set = await resolve(reader)
    return set.length > 0 ? set : [reader]
  } catch {
    return [reader]
  }
}
