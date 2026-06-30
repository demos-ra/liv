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
//   W-FN  completeVerifiedResolution / emailKeyedResolve / oauthVerifiedCompletion → F-identity/contract/oauth-contract
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

// ─── Verified Resolution (the one resolution workflow) ────────────────────────
// Reconcile (alias-trust pass): a credential is proven in-call by a VERIFIER ADAPTER, which
// hands a VerifiedCompletion to this ONE workflow. The workflow proof-gates THEN resolves via an
// injected port. Authority is the in-call verified state — never the event bus. Replaces the old
// completeOAuthLogin, which upserted-by-email with verified_email discarded (the breach).

// VerifiedCompletion — a verifier adapter's normalized output: a proven credential. `verified` is
// the in-call proof state; the workflow asserts it (defense-in-depth — an adapter that forgets to
// prove is caught here, fail-closed).
export interface VerifiedCompletion {
  email:      string
  channel:    string   // 'oauth-google' | 'oauth-github' | … (the source channel)
  provenance: string   // the proof basis, recorded for audit (never a read-authority input)
  verified:   boolean
}

// ResolvePort — the injected resolution seam. ONE impl now (email-keyed, STAY); a non-email
// verifier plugs its own alias-resolve later WITHOUT touching this workflow. The port resolves a
// proven completion to a principal; it does not decide policy — the disposition lives in the impl.
export interface ResolvePort {
  (completion: VerifiedCompletion): Promise<AuthResult<{ user: AuthUser; isNew: boolean }>>
}

// emailKeyedResolve — STAY: a verified completion resolves to the auth_users row keyed by its
// PROVEN email (find-or-create). Same canonical key as before, now proof-gated upstream — proven
// email-resolution, not unproven email-merge. Swap to LOOSEN replaces this impl; the workflow,
// the port, and the join do not change shape.
export function emailKeyedResolve(db: IAuthDb): ResolvePort {
  return async (completion) => {
    const result = await db.findOrCreateUserByEmail(completion.email)
    if (!result.success) return result
    const { isNew, ...user } = result.data
    return { success: true, data: { user, isNew } }
  }
}

// oauthVerifiedCompletion — the OAuth verifier adapter's output. Proof-of-control is established
// upstream at R4: fetchGoogleEmail now enforces verified_email===true, and fetchGitHubEmail
// already requires a verified address — an email reaches here ONLY if proven, hence verified:true.
export function oauthVerifiedCompletion(provider: string, email: string): VerifiedCompletion {
  return { email, channel: `oauth-${provider}`, provenance: `${provider}-verified-email`, verified: true }
}

export async function completeVerifiedResolution(
  completion: VerifiedCompletion,
  deps: { resolve: ResolvePort; db: IAuthDb }
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload; rawToken: string }>> {
  try {
    // PROOF GATE — fail-closed. No unverified completion reaches the resolver. This co-location
    // (verify in front of resolve) is the structural closer of the unproven-merge breach.
    if (completion.verified !== true) {
      log('error', 'auth.resolution.unverified-blocked', { channel: completion.channel })
      return { success: false, error: AuthErrors.oauthEmailNotVerified({ channel: completion.channel }) }
    }

    // RESOLVE via the injected port (STAY: email-keyed find-or-create).
    const userResult = await deps.resolve(completion)
    if (!userResult.success) {
      log('error', 'auth.resolution.resolve-failed', { channel: completion.channel, error: userResult.error.code })
      return { success: false, error: userResult.error }
    }
    const { user, isNew } = userResult.data

    // R4: Create session
    const expiresAt = sessionExpiresAt()
    const sessionResult = await deps.db.createSession(user.id, expiresAt)
    if (!sessionResult.success) {
      log('error', 'auth.resolution.session-failed', { userId: user.id, error: sessionResult.error.code })
      return { success: false, error: sessionResult.error }
    }

    const session = sessionResult.data
    // CRITICAL quirk: createSession returns the raw token in the tokenHash field (intentional —
    // R3 needs the raw token to set the cookie; only its hash is persisted).
    const rawToken = session.tokenHash

    // R4: Update last login — findOrCreateUserByEmail does not touch last_login_at.
    await deps.db.updateLastLogin(user.id)

    // R1: Build session payload
    const sessionPayload = buildSessionPayload(session, user.email)

    log('info', 'auth.resolution.completed', { userId: user.id, channel: completion.channel, isNew })

    return {
      success: true,
      data: { user, session: sessionPayload, rawToken },
    }
  } catch (err) {
    const error = AuthErrors.unknown(err)
    log('error', 'auth.resolution.unexpected', { cause: err instanceof Error ? err.message : String(err) })
    return { success: false, error }
  }
}
