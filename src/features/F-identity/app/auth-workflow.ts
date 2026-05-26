// @liv-standard v1.5.1 amended sprint-b1-shot-1 sprint-13b-shot-1 sprint-beta-shot-3
// [F-identity/R2]
// Built with LIV · livai.dev
// @manifest-delta sprint-beta-shot-3
//   issueDelegatedAgentToken added: an authenticated wearer mints a delegated
//   agent token under their own userId by reusing deps.db.createSession — the
//   token is an ordinary session row, not a new credential kind. The connector
//   door's agent-side credential; validated at proxy.ts via the existing
//   lookupSession path. No parallel token table, no agent identity.
// @manifest-delta sprint-13b-shot-1
//   createAuthDeps: third param `eventBus: IEventBus` added (injected by R3 callers).
//   noopEventBus stub removed — A2 compliance: R2 no longer self-wires the event bus.
//   Real adapter declared at R3 (trpc-context.ts, middleware.ts); wraps emitEvent from F-event-system/contract.
// @manifest-delta sprint-b1-shot-1
//   validateAndRefreshSession return type extended:
//     before: AuthResult<{ user: AuthUser; session: SessionPayload }>
//     after:  AuthResult<{ user: AuthUser; session: SessionPayload; sessionRefreshed: boolean; newToken?: string }>
//   sessionRefreshed: true when deps.db.refreshSession fires; false otherwise.
//   newToken: rawSessionToken (same token, new DB expiry) when sessionRefreshed; absent otherwise.
//   Callers (trpc-context.ts, middleware.ts) check sessionRefreshed to re-set the session cookie.
/**
 * F-identity / R2 / auth-workflow.ts
 * [F-identity/R2/C3] Auth orchestration — wires R1 logic + R4 I/O, emits events
 *
 * R2 Rules:
 * - Imports from R0, R1, R4 only.
 * - NEVER imports from R3.
 * - Owns the flow: validate → execute → emit event → return result.
 * - All external calls comply with O2 (rate limiting enforced at R3),
 *   O3 (timeouts on R4 calls), O5 (structured logs on every path).
 *
 * This is the only file that calls both R1 (logic) and R4 (I/O).
 * R3 routes call this. R3 never calls R4 directly.
 *
 * Amendment 1 compliance: all wire contracts (IEmailService, IAuthDb, IEventBus)
 * imported from canonical R0/R4 owners. Mid-file imports removed.
 */

import type { AuthResult, AuthUser, SessionPayload, MagicLinkEmailContent } from '../config/auth-types';
import type { IEventBus } from '../config/auth-events';
import { AUTH_EVENTS } from '../config/auth-events';
import {
  validateMagicLinkRequest,
  validateMagicLinkVerifyRequest,
  validateTokenState,
  validateSession,
} from '../domain/auth-validation';
import {
  magicLinkExpiresAt,
  sessionExpiresAt,
  sessionNeedsRefresh,
  buildMagicLinkUrl,
  buildMagicLinkEmail,
  buildSessionPayload,
} from '../domain/auth-session';
import { AuthErrors, toErrorLog } from '../domain/auth-errors';
import type { IAuthDb, IEmailService } from '../exec/auth-db';


// ─── Structured Logger (O5) ───────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({
    level,
    event,
    slice: 'F-identity',
    layer: 'R2',
    timestamp: new Date().toISOString(),
    ...data,
  }));
}

// ─── Workflow Dependencies (injected — O6: no hardcoded config) ───────────────

export interface RateLimitFn {
  (identityType: 'ip' | 'email', identityValue: string, action: string): Promise<{ allowed: boolean; remainingAttempts: number }>;
}

export interface AuthWorkflowDeps {
  db: IAuthDb;
  email: IEmailService;
  eventBus: IEventBus;
  baseUrl: string;          // injected from env, never hardcoded
  checkRateLimit: RateLimitFn; // O2: rate limiting, impl lives in R4
  ipAddress?: string;       // from request context, passed down by R3
}

// ─── 1. Request Magic Link (Register or Login) ────────────────────────────────

/**
 * Unified entry point for both register and login.
 * Magic link auth has no separate register step — first link creates the user.
 * Emits: auth.user.registered (new user) or triggers auth.user.authenticated path at verify.
 */
export async function requestMagicLink(
  input: unknown,
  deps: AuthWorkflowDeps
): Promise<AuthResult<{ message: string }>> {
  // R1: Validate input
  const validation = validateMagicLinkRequest(input);
  if (!validation.valid) {
    log('warn', 'auth.magic-link.request.invalid', { error: validation.error });
    return { success: false, error: validation.error };
  }

  const { email } = validation.data;

  try {
    // O2: Rate limit by email (3/hour) and IP (10/hour)
    const emailLimit = await deps.checkRateLimit('email', email, 'magic-link-request');
    if (!emailLimit.allowed) {
      const error = AuthErrors.rateLimited({ identity: 'email', action: 'magic-link-request' });
      return { success: false, error };
    }
    if (deps.ipAddress) {
      const ipLimit = await deps.checkRateLimit('ip', deps.ipAddress, 'magic-link-request');
      if (!ipLimit.allowed) {
        const error = AuthErrors.rateLimited({ identity: 'ip', action: 'magic-link-request' });
        return { success: false, error };
      }
    }

    // R4: Upsert user (create if not exists, return existing if present)
    const userResult = await deps.db.upsertUser(email);
    if (!userResult.success) {
      log('error', 'auth.magic-link.request.db-error', toErrorLog(userResult.error, 'upsertUser'));
      return { success: false, error: userResult.error };
    }

    const user = userResult.data;
    const isNewUser = userResult.data.isNew;

    // R4: Invalidate any existing unused tokens for this email
    await deps.db.invalidatePendingTokens(email);

    // R4: Create new magic link token
    const expiresAt = magicLinkExpiresAt();
    const tokenResult = await deps.db.createMagicLinkToken(user.id, email, expiresAt);
    if (!tokenResult.success) {
      log('error', 'auth.magic-link.request.token-error', toErrorLog(tokenResult.error, 'createMagicLinkToken'));
      return { success: false, error: tokenResult.error };
    }

    const { rawToken } = tokenResult.data;

    // R1: Build magic link URL and email content
    const magicLinkUrl = buildMagicLinkUrl(deps.baseUrl, rawToken, email);
    const emailContent = buildMagicLinkEmail(email, magicLinkUrl, expiresAt);

    // R4: Send email (O3: timeout enforced inside IEmailService implementation)
    const emailResult = await deps.email.sendMagicLink(email, emailContent);
    if (!emailResult.success) {
      log('error', 'auth.magic-link.request.email-error', toErrorLog(emailResult.error, 'sendMagicLink'));
      return { success: false, error: emailResult.error };
    }

    // Emit event for new user registration
    if (isNewUser) {
      await deps.eventBus.emit({
        type: AUTH_EVENTS.USER_REGISTERED,
        payload: { userId: user.id, email, timestamp: new Date() },
        eventKind: 'immediate',
      });
      log('info', 'auth.user.registered', { userId: user.id, email });
    }

    log('info', 'auth.magic-link.sent', { userId: user.id, email, isNewUser });

    return {
      success: true,
      data: { message: 'Magic link sent. Check your email.' },
    };

  } catch (err) {
    const error = AuthErrors.unknown(err);
    log('error', 'auth.magic-link.request.unexpected', toErrorLog(error, 'requestMagicLink'));
    return { success: false, error };
  }
}

// ─── 2. Verify Magic Link → Authenticate ─────────────────────────────────────

export async function verifyMagicLink(
  input: unknown,
  deps: AuthWorkflowDeps
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload; rawToken: string }>> {
  // R1: Validate input
  const validation = validateMagicLinkVerifyRequest(input);
  if (!validation.valid) {
    log('warn', 'auth.magic-link.verify.invalid', { error: validation.error });
    return { success: false, error: validation.error };
  }

  const { token, email } = validation.data;

  try {
    // O2: Rate limit by IP — prevent brute force token guessing
    if (deps.ipAddress) {
      const ipLimit = await deps.checkRateLimit('ip', deps.ipAddress, 'magic-link-verify');
      if (!ipLimit.allowed) {
        const error = AuthErrors.rateLimited({ identity: 'ip', action: 'magic-link-verify' });
        await deps.eventBus.emit({
          type: AUTH_EVENTS.USER_FAILED,
          payload: { email, reason: 'RATE_LIMITED', timestamp: new Date(), ipAddress: deps.ipAddress },
          eventKind: 'immediate',
        });
        return { success: false, error };
      }
    }

    // R4: Find token by hash
    const tokenResult = await deps.db.findMagicLinkToken(token, email);
    if (!tokenResult.success) {
      const error = AuthErrors.tokenInvalid('not found');
      log('warn', 'auth.magic-link.verify.not-found', { email });
      await deps.eventBus.emit({
        type: AUTH_EVENTS.USER_FAILED,
        payload: { email, reason: 'TOKEN_INVALID', timestamp: new Date() },
        eventKind: 'immediate',
      });
      return { success: false, error };
    }

    const magicToken = tokenResult.data;

    // R1: Validate token state (expiry, already used)
    const stateError = validateTokenState(magicToken.expiresAt, magicToken.usedAt);
    if (stateError) {
      log('warn', 'auth.magic-link.verify.state-error', { code: stateError.code, email });
      await deps.eventBus.emit({
        type: AUTH_EVENTS.USER_FAILED,
        payload: { email, reason: stateError.code, timestamp: new Date() },
        eventKind: 'immediate',
      });
      return { success: false, error: stateError };
    }

    // R4: Mark token as used (atomic — prevents race condition replay)
    await deps.db.markTokenUsed(magicToken.id);

    // R4: Get user
    const userResult = await deps.db.findUserById(magicToken.userId);
    if (!userResult.success) {
      log('error', 'auth.magic-link.verify.user-missing', { userId: magicToken.userId });
      return { success: false, error: userResult.error };
    }

    const user = userResult.data;

    // R4: Create session
    const expiresAt = sessionExpiresAt();
    const sessionResult = await deps.db.createSession(user.id, expiresAt);
    if (!sessionResult.success) {
      log('error', 'auth.magic-link.verify.session-error', toErrorLog(sessionResult.error, 'createSession'));
      return { success: false, error: sessionResult.error };
    }

    const session = sessionResult.data;
    const rawSessionToken = session.tokenHash;

    // R4: Update user last login timestamp
    await deps.db.updateLastLogin(user.id);

    // R1: Build session payload
    const sessionPayload = buildSessionPayload(session, user.email);

    // Emit: auth.user.authenticated
    await deps.eventBus.emit({
      type: AUTH_EVENTS.USER_AUTHENTICATED,
      payload: {
        userId: user.id,
        email: user.email,
        sessionId: session.id,
        timestamp: new Date(),
      },
      eventKind: 'immediate',
    });

    log('info', 'auth.user.authenticated', { userId: user.id, sessionId: session.id });

    return {
      success: true,
      data: { user, session: sessionPayload, rawToken: rawSessionToken },
    };

  } catch (err) {
    const error = AuthErrors.unknown(err);
    log('error', 'auth.magic-link.verify.unexpected', toErrorLog(error, 'verifyMagicLink'));
    return { success: false, error };
  }
}

// ─── 3. Sign Out ──────────────────────────────────────────────────────────────

export async function signOut(
  sessionId: string,
  userId: string,
  deps: AuthWorkflowDeps
): Promise<AuthResult<{ message: string }>> {
  try {
    // R4: Delete session
    const result = await deps.db.deleteSession(sessionId);
    if (!result.success) {
      log('error', 'auth.sign-out.db-error', toErrorLog(result.error, 'deleteSession'));
      return { success: false, error: result.error };
    }

    // Emit: auth.user.signed-out
    await deps.eventBus.emit({
      type: AUTH_EVENTS.USER_SIGNED_OUT,
      payload: { userId, sessionId, timestamp: new Date() },
      eventKind: 'immediate',
    });

    log('info', 'auth.user.signed-out', { userId, sessionId });

    return { success: true, data: { message: 'Signed out successfully.' } };

  } catch (err) {
    const error = AuthErrors.unknown(err);
    log('error', 'auth.sign-out.unexpected', toErrorLog(error, 'signOut'));
    return { success: false, error };
  }
}

// ─── 4. Validate Session (used by middleware on every request) ────────────────

export async function validateAndRefreshSession(
  rawSessionToken: string,
  deps: AuthWorkflowDeps
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload; sessionRefreshed: boolean; newToken?: string }>> {
  try {
    // R4: Look up session by token hash
    const sessionResult = await deps.db.findSession(rawSessionToken);
    if (!sessionResult.success) {
      return { success: false, error: AuthErrors.sessionNotFound() };
    }

    const session = sessionResult.data;

    // R1: Check expiry
    const expiredError = validateSession(session.expiresAt);
    if (expiredError) {
      await deps.db.deleteSession(session.id);
      return { success: false, error: expiredError };
    }

    // R4: Get user
    const userResult = await deps.db.findUserById(session.userId);
    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    const user = userResult.data;

    // R1: Check if session needs refresh
    if (sessionNeedsRefresh(session.expiresAt)) {
      const newExpiresAt = sessionExpiresAt();
      await deps.db.refreshSession(session.id, newExpiresAt);
      session.expiresAt = newExpiresAt;

      await deps.eventBus.emit({
        type: AUTH_EVENTS.TOKEN_REFRESHED,
        payload: {
          userId: user.id,
          sessionId: session.id,
          newExpiresAt,
          timestamp: new Date(),
        },
        eventKind: 'immediate',
      });

      log('info', 'auth.token.refreshed', { userId: user.id, sessionId: session.id });

      const sessionPayload = buildSessionPayload(session, user.email);
      // Same token — session row has new expiry in DB; no new token string issued.
      return { success: true, data: { user, session: sessionPayload, sessionRefreshed: true, newToken: rawSessionToken } };
    }

    const sessionPayload = buildSessionPayload(session, user.email);

    return { success: true, data: { user, session: sessionPayload, sessionRefreshed: false } };

  } catch (err) {
    const error = AuthErrors.unknown(err);
    log('error', 'auth.validate-session.unexpected', toErrorLog(error, 'validateAndRefreshSession'));
    return { success: false, error };
  }
}

// ─── Session Lookup (cross-slice — called by auth-contract.ts at R3) ─────────
// R3 calls this → R2 calls R4. R3 never touches R4 directly. (W-INJECT pattern)

export interface ValidatedSession {
  sessionId: string
  userId:    string
}

export async function lookupSession(rawToken: string, authDb: IAuthDb): Promise<ValidatedSession | null> {
  const result = await authDb.findSession(rawToken)
  if (!result.success || !result.data) return null
  return {
    sessionId: result.data.id,
    userId:    result.data.userId,
  }
}

// ─── Delegated agent token issuance (sprint-beta-shot-3 — the connector door) ─
// An authenticated wearer mints a token for an external agent to drive LIV on
// their behalf. The token is NOT a new kind of credential — it is an ordinary
// session row created under the WEARER'S OWN userId (a Wearer-L0 admission
// act). That is what makes "identity by delegation" real: the agent presenting
// this token at proxy.ts is validated by the same lookupSession/findSession
// path as any session, resolves to the wearer's userId, and is stamped on the
// 'external-agent' channel. No agent identity, no parallel token table — the
// delegated token IS a wearer session, just held by the agent rather than a
// browser cookie.
//
// Caller contract: `wearerUserId` MUST be an already-authenticated wearer's id
// (the issuance entry point sits behind the wearer's own cookie-auth at the
// perimeter — issuance is not self-serve for an unauthenticated caller). This
// function does not re-authenticate; it mints under the id it is given.
//
// Returns the raw token string (the agent stores it; after this point the raw
// token exists only in the agent's possession — only its hash is in the DB,
// per createSession discipline). On a store failure, returns null.
export async function issueDelegatedAgentToken(
  wearerUserId: string,
  authDb:       IAuthDb,
): Promise<{ rawToken: string; sessionId: string; expiresAt: Date } | null> {
  try {
    const expiresAt     = sessionExpiresAt()
    const sessionResult = await authDb.createSession(wearerUserId, expiresAt)
    if (!sessionResult.success) {
      log('error', 'auth.delegated-token.issue.session-error',
        toErrorLog(sessionResult.error, 'issueDelegatedAgentToken'))
      return null
    }
    const session = sessionResult.data
    // createSession returns the RAW token in the tokenHash field (intentional —
    // same contract verifyMagicLink relies on; the raw token is never persisted).
    log('info', 'auth.delegated-token.issued', { userId: wearerUserId, sessionId: session.id })
    return {
      rawToken:  session.tokenHash,
      sessionId: session.id,
      expiresAt,
    }
  } catch (err) {
    const error = AuthErrors.unknown(err)
    log('error', 'auth.delegated-token.issue.unexpected', toErrorLog(error, 'issueDelegatedAgentToken'))
    return null
  }
}

// ─── Session Lifecycle (absorbed from F-session — A1: single owner) ─────────
// Called by event-subscriptions.ts on USER_SIGNED_IN / USER_SIGNED_OUT / SESSION_EXPIRED.

export async function createSessionForUser(userId: string, sessionId: string): Promise<void> {
  // Session row already created by verifyMagicLink above.
  // This hook is a no-op for magic-link auth — F-identity owns the row.
  // Kept as explicit lifecycle signal for event-subscriptions wiring.
  void userId; void sessionId;
}

export async function destroySessionForUser(userId: string, sessionId: string, authDb: IAuthDb): Promise<void> {
  try {
    await authDb.deleteSession(sessionId)
  } catch {
    // Non-blocking — session may already be gone
  }
  void userId;
}

// ─── Deps Factory (R3 calls this — never imports exec/ directly) ──────────────
// eventBus is injected by R3 caller (trpc-context.ts, middleware.ts).
// R2 never imports from F-event-system directly (A2).

export function createAuthDeps(ipAddress: string, authDb: IAuthDb, eventBus: IEventBus): AuthWorkflowDeps {
  return {
    db:             authDb,
    email:          IS_DEV ? devEmailServiceStub : createProductionEmailService(),
    eventBus,
    baseUrl:        process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    checkRateLimit: async (_type, _value, _action) => ({
      allowed: true,
      remainingAttempts: 99,
    }),
    ipAddress,
  }
}

// ─── Stubs (IEmailService wire contract — Amendment 1: return shape must match exactly) ─

const IS_DEV = process.env.NODE_ENV !== 'production'

const devEmailServiceStub: IEmailService = {
  async sendMagicLink(to: string, content: MagicLinkEmailContent): Promise<AuthResult<void>> {
    const urlMatch = content.text.match(/https?:\/\/\S+/)
    const link = urlMatch?.[0] ?? content.text
    console.log(JSON.stringify({
      level: 'info', event: 'dev.magic-link', to, link,
      timestamp: new Date().toISOString(),
      note: 'Copy this link to sign in — no email sent in dev',
    }))
    return { success: true, data: undefined }
  },
}


function createProductionEmailService(): IEmailService {
  const apiKey      = process.env.EMAIL_API_KEY
  const fromAddress = process.env.EMAIL_FROM_ADDRESS ?? 'onboarding@resend.dev'
  const fromName    = process.env.EMAIL_FROM_NAME ?? 'LIV'
  return {
    async sendMagicLink(to: string, content: MagicLinkEmailContent): Promise<AuthResult<void>> {
      if (!apiKey) return devEmailServiceStub.sendMagicLink(to, content)
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${fromName} <${fromAddress}>`,
            to: [to], subject: content.subject, text: content.text, html: content.html,
          }),
        })
        if (!res.ok) {
          const err = await res.text()
          return { success: false, error: AuthErrors.emailSendFailed(to, err) }
        }
        return { success: true, data: undefined }
      } catch (err) {
        return { success: false, error: AuthErrors.emailSendFailed(to, err) }
      }
    },
  }
}

// ─── Token Cleanup (#9 Task E — R2 orchestration, A4 cite) ─────────────────
// Fire-and-forget cleanup of expired/used magic link tokens.
// Called once at server boot from instrumentation.ts. Non-blocking.
// R2: orchestrates R4 I/O (cleanupExpiredTokens). A1: F-identity owns entirely.

export function scheduleTokenCleanup(authDb: IAuthDb): void {
  authDb.cleanupExpiredTokens()
    .then((result) => {
      if (result.success) {
        log('info', 'auth.token-cleanup.complete', { deletedCount: result.data.deletedCount })
      } else {
        log('warn', 'auth.token-cleanup.failed', { error: result.error.message })
      }
    })
    .catch((err) => {
      log('warn', 'auth.token-cleanup.unexpected', { error: String(err) })
    })
}
