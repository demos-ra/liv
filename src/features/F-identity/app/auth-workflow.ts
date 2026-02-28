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
 */

import type { AuthResult, AuthUser, SessionPayload } from '../config/auth-types';
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
    const isNewUser = userResult.isNew;

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
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload }>> {
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
      data: { user, session: { ...sessionPayload, tokenHash: rawSessionToken } },
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
): Promise<AuthResult<{ user: AuthUser; session: SessionPayload }>> {
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
    }

    const sessionPayload = buildSessionPayload(session, user.email);

    return { success: true, data: { user, session: sessionPayload } };

  } catch (err) {
    const error = AuthErrors.unknown(err);
    log('error', 'auth.validate-session.unexpected', toErrorLog(error, 'validateAndRefreshSession'));
    return { success: false, error };
  }
}
