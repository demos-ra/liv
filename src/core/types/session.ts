// [core/types/session.ts]
// R5 — session infrastructure config. Zero slice dependencies.
// SESSION_CONFIG is pure technical config (TTLs, cookie names) used by core itself.
// Domain types (SessionPayload, SessionStatus) stay here as shared infra types.
// F-session/config/session-config.ts re-exports for backwards compat.

export const SESSION_CONFIG = {
  accessTokenTTL:    60 * 15,           // 15 minutes (seconds)
  refreshTokenTTL:   60 * 60 * 24 * 7,  // 7 days (seconds)
  cookieName:        'liv_session',
  refreshCookieName: 'liv_refresh',
  cookieOptions: {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax' as const,
    path:     '/',
  },
} as const

export const SESSION_NAMESPACE = 'session' as const

export type SessionStatus = 'active' | 'expired' | 'revoked'

export type SessionPayload = {
  userId:            string
  sessionId:         string
  email:             string
  githubAccessToken: string
  issuedAt:          number
  expiresAt:         number
  status:            SessionStatus
}

export type RefreshPayload = {
  sessionId: string
  userId:    string
  issuedAt:  number
  expiresAt: number
}
