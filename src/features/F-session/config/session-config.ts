// [F-session/R0/C2] Session configuration tokens
// R0: pure config, zero dependencies

export const SESSION_CONFIG = {
  accessTokenTTL: 60 * 15,          // 15 minutes (seconds)
  refreshTokenTTL: 60 * 60 * 24 * 7, // 7 days (seconds)
  cookieName: 'liv_session',
  refreshCookieName: 'liv_refresh',
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
  },
} as const

export const SESSION_NAMESPACE = 'session' as const

export type SessionStatus = 'active' | 'expired' | 'revoked'

export type SessionPayload = {
  userId: string
  sessionId: string
  githubAccessToken: string
  issuedAt: number
  expiresAt: number
  status: SessionStatus
}

export type RefreshPayload = {
  sessionId: string
  userId: string
  issuedAt: number
  expiresAt: number
}
