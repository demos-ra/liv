// [F-identity/contract/auth-contract.ts]
// R3 — server-side auth validation for cross-slice use.
// Other slices (F-chat, F-session, etc.) import from here — never from exec/auth-db directly.

import { db, taggedDb } from '@/core/db/client'
import { createAuthDb } from '../exec/auth-db'
import type { Session } from '../config/auth-types'

export interface ValidatedSession {
  sessionId: string
  userId:    string
}

/**
 * Validates a raw access token and returns the session if valid.
 * Returns null if the token is missing, expired, or invalid.
 */
export async function validateSession(rawToken: string): Promise<ValidatedSession | null> {
  const authDb = createAuthDb(taggedDb(db))
  const result = await authDb.findSession(rawToken)
  if (!result.success || !result.data) return null
  return {
    sessionId: result.data.id,
    userId:    result.data.userId,
  }
}
