// @liv-standard v1.4
// [F-identity/R3]
// Built with LIV · livai.dev
// R3 — the single session contract surface for all other slices.
// Import from here only. Never import from F-identity internals directly.
// A1: F-identity is sole owner of SessionPayload and session validation.
// A2: R3 owns IAuthDb factory instantiation. R2 depends on interface only.
// A6: SESSION_COOKIE_NAME re-exported from R0 canonical declaration.
//
// Step 1 — D5a fix (A5):
//   destroySessionForUser exposed here so event-subscriptions.ts never
//   imports F-identity/app or F-identity/exec directly.
//   Axiom cite: A5 — cross-slice calls via contract only.
//
// phase-b-item4 (A1, A5):
//   getUserEmail exposed. F-admin was querying auth_users directly (A1 violation).
//   F-identity owns auth_users — email lookup belongs here.
//   Uses IAuthDb.findUserById (existing R4 function, no new R4 code needed).
//   Axiom cite: A1 — single ownership. A5 — cross-slice via contract only.

import { lookupSession as _lookupSession, destroySessionForUser as _destroySessionForUser } from '../app/auth-workflow'
import { createAuthDb } from '../exec/auth-db'
import { db, taggedDb } from '@/core/db/client'

// ─── Public type exports (W-ATOM — other slices read, never mutate) ───────────
export type { SessionPayload } from '../config/auth-types'
export type { ValidatedSession } from '../app/auth-workflow'
export { SESSION_COOKIE_NAME } from '../config/auth-types'
// step5b-patch: re-export isEmailAllowed so API routes import via contract only (A5).
export { isEmailAllowed } from '../config/allowlist'

// ─── Session validation (the only cross-slice auth call) ──────────────────────
export async function validateSession(rawToken: string) {
  const authDb = createAuthDb(taggedDb(db))
  return _lookupSession(rawToken, authDb)
}

// ─── Session destruction (D5a fix — was imported cross-slice from app/) ───────
// event-subscriptions.ts calls this on USER_SIGNED_OUT and SESSION_EXPIRED.
// R3 owns the authDb instantiation — R2 never touches it directly.
// Axiom cite: A5 cross-slice via contract only; A2 R3 wires R4.
export async function destroySessionForUser(userId: string, sessionId: string): Promise<void> {
  const authDb = createAuthDb(taggedDb(db))
  return _destroySessionForUser(userId, sessionId, authDb)
}

// ─── getUserEmail (phase-b-item4) ─────────────────────────────────────────────
// Read-only email lookup. F-admin was querying auth_users directly — A1 violation.
// Uses existing IAuthDb.findUserById. Returns null if user not found.
// A1: F-identity owns auth_users. A3: string atom crosses boundary.
export async function getUserEmail(userId: string): Promise<string | null> {
  const authDb = createAuthDb(taggedDb(db))
  const result = await authDb.findUserById(userId)
  if (!result.success || !result.data) return null
  return result.data.email
}

// ─── aliasesOf (the principal-set producer; DATA, not a decision) ─────────────────────────────
// R3 supplies the live resolve adapter — aliasPrincipalSet over the auth DB (A2: R3 wires R4; R2's
// aliasesOf only declares the port, never touches the DB). Activation: every `mine`-reader folds
// through this; an empty auth_user_aliases table → [reader] (fail-safe in aliasesOf), behavior-
// preserving until a reconcile appends an alias.
import { aliasesOf as aliasesOfImpl } from '../app/principal-aliases'

const liveAliasResolve = async (reader: string): Promise<string[]> => {
  const res = await createAuthDb(taggedDb(db)).aliasPrincipalSet(reader)
  return res.success ? res.data : [reader]
}
export const aliasesOf = (reader: string): Promise<string[]> => aliasesOfImpl(reader, liveAliasResolve)
