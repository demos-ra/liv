// [F-session/R2/C3] Session workflow orchestration
// commit: add createSessionForUser + destroySessionForUser for event-subscriptions
//
// R2: orchestration, depends R0 + R1 + R4

import { SESSION_CONFIG, SessionPayload, RefreshPayload } from '../config/session-config'
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  isSessionExpired,
  sessionNeedsRefresh,
  buildSessionState,
} from '../domain/session-logic'
import { persistSession, getSession, revokeSession, rotateRefreshToken } from '../exec/session-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { generateId } from '@/core/types/primitives'

// ─── Event-subscription hooks ─────────────────────────────────────────────────
// Called by event-subscriptions.ts when identity.user-signed-in fires.
// F-identity owns the auth_sessions row — F-session observes lifecycle only.

export async function createSessionForUser(userId: string, sessionId: string): Promise<void> {
  try {
    await persistSession({
      sessionId,
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_CONFIG.refreshTokenTTL * 1000),
      status: 'active',
    })
  } catch {
    // Session row may already exist from F-identity — ON CONFLICT DO NOTHING handles it
  }
}

export async function destroySessionForUser(userId: string, sessionId: string): Promise<void> {
  try {
    await revokeSession(sessionId)
  } catch {
    // Non-blocking — session may already be gone
  }
}

// ─── Core session functions ───────────────────────────────────────────────────

export async function createSession(userId: string, email: string) {
  const sessionId = generateId('ses')

  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken({ userId, sessionId, email, githubAccessToken: '', status: 'active' }),
    createRefreshToken({ userId, sessionId }),
  ])

  await persistSession({
    sessionId,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_CONFIG.refreshTokenTTL * 1000),
    status: 'active',
  })

  await emitEvent({ type: EVENTS.SESSION.SESSION_CREATED, payload: { userId, sessionId } })

  return { accessToken, refreshToken, sessionId }
}

export async function refreshSession(refreshTokenRaw: string) {
  const payload = await verifyRefreshToken(refreshTokenRaw)
  if (!payload) return null

  const stored = await getSession(payload.sessionId)
  if (!stored || stored.status !== 'active') return null

  const newSessionId = generateId('ses')
  const [accessToken, newRefreshToken] = await Promise.all([
    createAccessToken({
      userId: stored.userId,
      sessionId: newSessionId,
      email: '',          // magic-link sessions: email not stored in session row
      githubAccessToken: '', // magic-link sessions: no OAuth token
      status: 'active',
    }),
    createRefreshToken({ userId: stored.userId, sessionId: newSessionId }),
  ])

  await rotateRefreshToken(payload.sessionId, newSessionId, newRefreshToken)
  await emitEvent({ type: EVENTS.SESSION.SESSION_REFRESHED, payload: { userId: stored.userId, sessionId: newSessionId } })

  return { accessToken, refreshToken: newRefreshToken, sessionId: newSessionId }
}

export async function terminateSession(sessionId: string) {
  const stored = await getSession(sessionId)
  if (!stored) return

  await revokeSession(sessionId)
  await emitEvent({ type: EVENTS.SESSION.SESSION_EXPIRED, payload: { userId: stored.userId, sessionId } })
}

export async function resolveSession(accessToken: string): Promise<SessionPayload | null> {
  const payload = await verifyAccessToken(accessToken)
  if (!payload) return null
  if (isSessionExpired(payload)) return null
  return payload
}
