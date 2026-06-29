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

export async function aliasesOf(reader: string): Promise<string[]> {
  return [reader]
}
