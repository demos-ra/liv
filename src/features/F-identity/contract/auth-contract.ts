// [F-identity/contract/auth-contract.ts]
// R3 — the single session contract surface for all other slices.
// Import from here only. Never import from F-identity internals directly.
// A1: F-identity is sole owner of SessionPayload and session validation.
// A2: R3 owns IAuthDb factory instantiation. R2 depends on interface only.
// A6: SESSION_COOKIE_NAME re-exported from R0 canonical declaration.

import { lookupSession as _lookupSession } from '../app/auth-workflow'
import { createAuthDb } from '../exec/auth-db'
import { db, taggedDb } from '@/core/db/client'

// ─── Public type exports (W-ATOM — other slices read, never mutate) ───────────
export type { SessionPayload } from '../config/auth-types'
export type { ValidatedSession } from '../app/auth-workflow'
export { SESSION_COOKIE_NAME } from '../config/auth-types'

// ─── Session validation (the only cross-slice auth call) ──────────────────────
export async function validateSession(rawToken: string) {
  const authDb = createAuthDb(taggedDb(db))
  return _lookupSession(rawToken, authDb)
}
