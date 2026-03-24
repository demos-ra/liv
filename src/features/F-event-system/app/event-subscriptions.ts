// @liv-standard v1.3
// [F-event-system/app/event-subscriptions.ts]
// Built with LIV · livai.dev
// R2: orchestration layer. Depends R0, R1, R3 contracts only.
//
// This is the complete event wiring of the system.
// Every subscribe() call that crosses slice boundaries lives here.
// No slice imports another slice's internals — only R3 contracts.
//
// Called once at startup by startup.ts.
// Idempotent: calling registerAll() twice will double-subscribe — don't.
//
// Step 1 — D5a fix (A5):
//   Removed direct imports of F-identity/app/auth-workflow and
//   F-identity/exec/auth-db. Both operations now routed through
//   F-identity/contract/auth-contract (R3 surface).
//   createSessionForUser was a no-op — inline confirmed and removed.
//   Axiom cite: A5 — event-subscriptions may only import R3 contracts
//   across slice boundaries, never R2/app or R4/exec directly.

import { subscribeToEvent } from '../contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import type { LivEvent } from '@/core/types/primitives'

// ─── F-identity session lifecycle ────────────────────────────────────────────
// destroySessionForUser: now called via R3 contract (D5a fix).
// createSessionForUser was a confirmed no-op for magic-link auth —
//   session row is created inside verifyMagicLink at R4. No call needed.

import { destroySessionForUser } from '@/features/F-identity/contract/auth-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (_event: LivEvent) => {
  // no-op: session row already created by verifyMagicLink (F-identity R4).
  // Subscription kept as explicit lifecycle signal.
})

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_OUT, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  await destroySessionForUser(userId, sessionId)
})

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  await destroySessionForUser(userId, sessionId)
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
