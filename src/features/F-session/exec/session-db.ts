// [F-session/R4/C3] Session database I/O — aligned to magic link auth
// R4: execution layer, depends R0 only.
// Session schema matches F-identity auth_sessions table (magic link, no OAuth tokens).

import { db } from '@/core/db/client'

export type StoredSession = {
  sessionId: string
  userId: string
  createdAt: Date
  expiresAt: Date
  status: 'active' | 'expired' | 'revoked'
}

export async function persistSession(session: StoredSession): Promise<void> {
  await db.query(
    `INSERT INTO auth_sessions (id, user_id, created_at, expires_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [session.sessionId, session.userId, session.createdAt, session.expiresAt]
  )
}

export async function getSession(sessionId: string): Promise<StoredSession | null> {
  const result = await db.query<Record<string, unknown>>(
    `SELECT id, user_id, created_at, expires_at
     FROM auth_sessions
     WHERE id = $1 AND expires_at > NOW()`,
    [sessionId]
  )
  if (!result.rows[0]) return null
  const row = result.rows[0]
  return {
    sessionId: row.id as string,
    userId: row.user_id as string,
    createdAt: new Date(row.created_at as string),
    expiresAt: new Date(row.expires_at as string),
    status: 'active',
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await db.query(
    `DELETE FROM auth_sessions WHERE id = $1`,
    [sessionId]
  )
}

export async function purgeExpiredSessions(): Promise<number> {
  const result = await db.query(
    `DELETE FROM auth_sessions WHERE expires_at < NOW() RETURNING id`
  )
  return (result.rows as unknown[]).length
}

export async function rotateRefreshToken(sessionId: string, newSessionId: string, newRefreshToken: string): Promise<void> {
  await db.query(
    `UPDATE auth_sessions SET id = $2, token_hash = $3 WHERE id = $1`,
    [sessionId, newSessionId, newRefreshToken]
  )
}
