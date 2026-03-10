// [core/types/session.ts]
// R5 — session infrastructure config only. Zero slice dependencies.
// SESSION_CONFIG: pure technical config (TTLs, options) for use by core infrastructure.
// SESSION_COOKIE_NAME: canonical cookie name — declared at F-identity/config/auth-types.ts (A6).
// Domain types (SessionPayload, SessionStatus, RefreshPayload) deleted — owned by F-identity (A1).

export const SESSION_CONFIG = {
  accessTokenTTL:    60 * 15,           // 15 minutes (seconds)
  refreshTokenTTL:   60 * 60 * 24 * 7,  // 7 days (seconds)
  cookieOptions: {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax' as const,
    path:     '/',
  },
} as const
