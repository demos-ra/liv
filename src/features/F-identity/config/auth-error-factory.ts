// @liv-standard v1.3
// [F-identity/R0]
// Built with LIV · livai.dev
/**
 * F-identity / R0 / auth-error-factory.ts
 * [F-identity/R0/C2] Structured error factory — declared at R0 so R4 can import
 *
 * R0 Rule: No imports from higher layers. This file has no imports at all.
 * AuthErrors is pure — takes primitives, returns structured AuthError objects.
 * Declared here so R4 (exec layer) can construct errors without importing R1.
 */

export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'TOKEN_ALREADY_USED'
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'DB_ERROR'
  | 'EMAIL_SEND_FAILED'
  | 'OAUTH_STATE_INVALID'
  | 'OAUTH_CODE_EXCHANGE_FAILED'
  | 'OAUTH_EMAIL_UNAVAILABLE'
  | 'OAUTH_EMAIL_NOT_VERIFIED'
  | 'UNKNOWN';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  context?: Record<string, unknown>;
  timestamp: Date;
}

function makeError(
  code: AuthErrorCode,
  message: string,
  context?: Record<string, unknown>
): AuthError {
  return { code, message, context, timestamp: new Date() };
}

export const AuthErrors = {
  invalidEmail: (email?: string) =>
    makeError('INVALID_EMAIL', 'The email address provided is not valid', { email }),
  tokenExpired: () =>
    makeError('TOKEN_EXPIRED', 'This magic link has expired. Please request a new one.'),
  tokenInvalid: (reason?: string) =>
    makeError('TOKEN_INVALID', 'This magic link is invalid', { reason }),
  tokenAlreadyUsed: () =>
    makeError('TOKEN_ALREADY_USED', 'This magic link has already been used. Please request a new one.'),
  sessionExpired: (sessionId?: string) =>
    makeError('SESSION_EXPIRED', 'Your session has expired. Please sign in again.', { sessionId }),
  sessionNotFound: (sessionId?: string) =>
    makeError('SESSION_NOT_FOUND', 'Session not found', { sessionId }),
  userNotFound: (email?: string) =>
    makeError('USER_NOT_FOUND', 'No account found with this email address', { email }),
  rateLimited: (context?: Record<string, unknown>) =>
    makeError('RATE_LIMITED', 'Too many requests. Please wait before trying again.', context),
  dbError: (operation: string, cause?: unknown) =>
    makeError('DB_ERROR', 'Database operation failed: ' + operation, {
      operation,
      cause: cause instanceof Error ? cause.message : String(cause),
    }),
  emailSendFailed: (email?: string, cause?: unknown) =>
    makeError('EMAIL_SEND_FAILED', 'Failed to send magic link email', {
      email,
      cause: cause instanceof Error ? cause.message : String(cause),
    }),
  unknown: (cause?: unknown) =>
    makeError('UNKNOWN', 'An unexpected error occurred', {
      cause: cause instanceof Error ? cause.message : String(cause),
    }),

  // ── OAuth Errors (Wave 2 — Item #14) ──────────────────────────────────────
  // A6: declared at R0 so R4 (oauth-io.ts) can construct errors without importing R1.
  oauthStateInvalid: (context?: Record<string, unknown>) =>
    makeError('OAUTH_STATE_INVALID', 'OAuth state parameter is invalid or expired', context),
  oauthCodeExchangeFailed: (context?: Record<string, unknown>) =>
    makeError('OAUTH_CODE_EXCHANGE_FAILED', 'Failed to exchange authorization code for access token', context),
  oauthEmailUnavailable: (context?: Record<string, unknown>) =>
    makeError('OAUTH_EMAIL_UNAVAILABLE', 'Could not retrieve email from OAuth provider', context),
  oauthEmailNotVerified: (context?: Record<string, unknown>) =>
    makeError('OAUTH_EMAIL_NOT_VERIFIED', 'Email address from OAuth provider is not verified', context),
} as const;
