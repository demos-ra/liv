// @liv-standard v1.0
// [F-event-system/app/event-subscriptions.ts]
// Built with LIV · livai.dev
// R2: orchestration layer. Depends R0, R1, R4.
//
// This is the complete event wiring of the system.
// Every subscribe() call that crosses slice boundaries lives here.
// No slice imports another slice's internals — only R3 contracts.
//
// Called once at startup by startup.ts.
// Idempotent: calling registerAll() twice will double-subscribe — don't.

import { subscribeToEvent } from '../contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import type { LivEvent } from '@/core/types/primitives'

// ─── F-identity session lifecycle ────────────────────────────────────────────
// F-session deleted — session lifecycle owned by F-identity (A1).
// createSessionForUser: no-op for magic-link auth (session row created by verifyMagicLink).
// destroySessionForUser: deletes auth_sessions row via F-identity R4.

import { createSessionForUser, destroySessionForUser } from '@/features/F-identity/app/auth-workflow'
import { createAuthDb } from '@/features/F-identity/exec/auth-db'
import { db, taggedDb } from '@/core/db/client'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  await createSessionForUser(userId, sessionId)
})

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_OUT, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  const authDb = createAuthDb(taggedDb(db))
  await destroySessionForUser(userId, sessionId, authDb)
})

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  const authDb = createAuthDb(taggedDb(db))
  await destroySessionForUser(userId, sessionId, authDb)
})

// ─── F-permissions ────────────────────────────────────────────────────────────

import { assignDefaultRole } from '@/features/F-permissions/contract/permissions-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId } = event.payload as { userId: string }
  await assignDefaultRole(userId)
})

// ─── F-user-profile ───────────────────────────────────────────────────────────

import { upsertProfileForUser } from '@/features/F-user-profile/contract/user-profile-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId, email } = event.payload as { userId: string; email: string }
  await upsertProfileForUser(userId, email)
})

// ─── F-memory ─────────────────────────────────────────────────────────────────

import { onSessionEnd as memoryOnSessionEnd } from '@/features/F-memory/contract/memory-contract'

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (_event: LivEvent) => {
  await memoryOnSessionEnd()
})

// ─── Export registration function ────────────────────────────────────────────
// Called exactly once in startup.ts.

export function registerAllSubscriptions(): void {
  console.log(JSON.stringify({
    level: 'info',
    event: 'integration.subscriptions.registered',
    count: 'see above',
    timestamp: new Date().toISOString(),
  }))
}
