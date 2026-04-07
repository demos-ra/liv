// @liv-standard v1.3
// [F-identity/app/oauth-workflow.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// slice:      F-identity
// layer:      R2
// wires-in:
//   W-ATOM  SessionPayload      ../config/auth-types
//   W-ATOM  AuthUser            ../config/auth-types
//   W-ATOM  AuthResult          ../config/auth-types
//   W-FN    IAuthDb             ../exec/auth-db  (interface only — A2)
//   W-FN    buildSessionPayload ../domain/auth-session
//   W-FN    sessionExpiresAt    ../domain/auth-session
// wires-out:
//   W-FN  completeOAuthLogin   → F-identity/contract/oauth-contract
// deps:
//   R0  ../config/auth-types
//   R1  ../domain/auth-session
//   R4  ../exec/auth-db (IAuthDb interface)
//
// R2 Rules: Orchestration only. Imports from R0, R1, R4. Never imports R3.
// A1: F-identity owns all auth orchestration.
// A2: Directional deps — R2 depends on R0/R1/R4 interfaces.

import type { AuthUser, SessionPayload, AuthResult } from '../config/auth-types'
import type { IAuthDb } from '../exec/auth-db'
import { sessionExpiresAt, buildSessionPayload } from '../domain/auth-session'
import { AuthErrors } from '../config/auth-error-factory'

// ─── Structured Logger (O5) ───────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({
    level,
    event,
    slice: 'F-identity',
    layer: 'R2/oauth',
    timestamp: new Date().toISOString(),
    ...data,
  }))
}

// ─── OAuth Login Completion (convergence point) ───────────────────────────────
// Identical to verifyMagicLink post-verification path:
//   upsert user → create session → update last login → build payload.
// Email is the merge key — same email = same user regardless of auth method.

export async function completeOAuthLogin(
  email: string,
  deps: { db: IAuthDb }
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload; rawToken: string }>> {
  try {
    // R4: Upsert user (reuse existing IAuthDb.upsertUser — no DB changes needed)
    const userResult = await deps.db.upsertUser(email)
    if (!userResult.success) {
      log('error', 'auth.oauth.upsert-failed', { email, error: userResult.error.code })
      return { success: false, error: userResult.error }
    }

    const user: AuthUser = {
      id:          userResult.data.id,
      email:       userResult.data.email,
      createdAt:   userResult.data.createdAt,
      lastLoginAt: userResult.data.lastLoginAt,
    }
    const isNew = userResult.data.isNew

    // R4: Create session
    const expiresAt = sessionExpiresAt()
    const sessionResult = await deps.db.createSession(user.id, expiresAt)
    if (!sessionResult.success) {
      log('error', 'auth.oauth.session-failed', { userId: user.id, error: sessionResult.error.code })
      return { success: false, error: sessionResult.error }
    }

    const session = sessionResult.data

    // CRITICAL quirk: createSession returns rawToken in tokenHash field.
    // See auth-db.ts: `tokenHash: rawToken, // intentional: R3 needs raw token to set cookie`
    const rawToken = session.tokenHash

    // R4: Update last login — necessary because upsertUser ON CONFLICT does NOT touch last_login_at
    await deps.db.updateLastLogin(user.id)

    // R1: Build session payload
    const sessionPayload = buildSessionPayload(session, user.email)

    log('info', 'auth.oauth.completed', { userId: user.id, email, isNew })

    return {
      success: true,
      data: { user, session: sessionPayload, rawToken },
    }
  } catch (err) {
    const error = AuthErrors.unknown(err)
    log('error', 'auth.oauth.unexpected', { cause: err instanceof Error ? err.message : String(err) })
    return { success: false, error }
  }
}
