// [F-session/R1/C2] Session domain logic
// R1: pure functions, no I/O, depends R0 only

import { SESSION_CONFIG, SessionPayload, RefreshPayload, SessionStatus } from '../config/session-config'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const getSecret = () => new TextEncoder().encode(process.env.SESSION_SECRET!)
const getRefreshSecret = () => new TextEncoder().encode(process.env.REFRESH_SECRET!)

// --- Token creation ---

export async function createAccessToken(payload: Omit<SessionPayload, 'issuedAt' | 'expiresAt'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ ...payload, issuedAt: now, expiresAt: now + SESSION_CONFIG.accessTokenTTL })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_CONFIG.accessTokenTTL)
    .sign(getSecret())
}

export async function createRefreshToken(payload: Omit<RefreshPayload, 'issuedAt' | 'expiresAt'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({ ...payload, issuedAt: now, expiresAt: now + SESSION_CONFIG.refreshTokenTTL })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_CONFIG.refreshTokenTTL)
    .sign(getRefreshSecret())
}

// --- Token verification ---

export async function verifyAccessToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret())
    return payload as unknown as RefreshPayload
  } catch {
    return null
  }
}

// --- Session state logic ---

export function isSessionExpired(payload: SessionPayload): boolean {
  return Math.floor(Date.now() / 1000) >= payload.expiresAt
}

export function sessionNeedsRefresh(payload: SessionPayload): boolean {
  const now = Math.floor(Date.now() / 1000)
  const timeLeft = payload.expiresAt - now
  return timeLeft < SESSION_CONFIG.accessTokenTTL * 0.25 // refresh if < 25% TTL remaining
}

export function buildSessionState(payload: SessionPayload) {
  return {
    userId: payload.userId,
    sessionId: payload.sessionId,
    status: payload.status,
    expiresAt: payload.expiresAt,
  }
}
