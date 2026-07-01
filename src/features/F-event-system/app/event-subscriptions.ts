// @liv-standard v1.5.1
// [F-event-system/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    D5a, phase-b-item2, phase-5.1-r1, phase-5-audit, sprint-beta-fixround (F4: three identity subscriptions retargeted USER_SIGNED_IN→USER_AUTHENTICATED — the event the auth path actually emits on sign-in)
// slice:      F-event-system
// category:   Tool
// layer:      R2
// wires-in:
//   W-HOOK  subscribeToEvent       F-event-system/R3 (event-bus)
//   W-ATOM  EVENTS                 F-event-system/R0 (event-schema)
//   W-ATOM  LivEvent               core/R0 (primitives)
//   W-HOOK  destroySessionForUser  F-identity/R3 (auth-contract)
//   W-HOOK  upsertProfileForUser   F-user-profile/R3 (user-profile-contract)
// wires-out:
//   W-HOOK  registerAllSubscriptions  →  core/startup.ts
// deps:
//   R0  @/features/F-event-system/config/event-schema
//   R0  @/core/types/primitives
//   R3  ../contract/event-bus
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-user-profile/contract/user-profile-contract
// validated:  pending
//
// D5a fix (A5):
//   Removed direct imports of F-identity/app/auth-workflow and
//   F-identity/exec/auth-db. Both operations now routed through
//   F-identity/contract/auth-contract (R3 surface).
//   createSessionForUser was a no-op — inline confirmed and removed.
//   Axiom cite: A5 — event-subscriptions may only import R3 contracts
//   across slice boundaries, never R2/app or R4/exec directly.
//
// phase-b-item2 (A5):
//   Planner route-build subscription added. F-planner subscribes to
//   codec.route-build events and calls handleBuildRequest internally.
//   Previously F-chat called handleBuildRequest directly (A5 violation).
//   Axiom cite: A5 — cross-slice via event bus + R3 contracts only.
//
// phase-5.1-r1 (A5):
//   Removed codec.route-build → handleBuildRequest subscription.
//   Confirmation is now handled synchronously via W-HOOK inside codec
//   (codec-orchestrate calls handleBuildRequest directly from F-planner/R3).
//   The codec.route-build event is retained for observability only —
//   no subscriber needs to act on it.
//   Removed imports: handleBuildRequest, CODEC_ROUTING_EVENTS, RouteBuildPayload.
//   Axiom cite: A5 — event subscriptions are for notification.
//   The confirmation query moved to synchronous W-HOOK.

import { subscribeToEvent } from '../contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import type { LivEvent } from '@/core/types/primitives'

// ─── F-identity session lifecycle ────────────────────────────────────────────
// destroySessionForUser: now called via R3 contract (D5a fix).
// createSessionForUser was a confirmed no-op for magic-link auth —
//   session row is created inside verifyMagicLink at R4. No call needed.

import { destroySessionForUser } from '@/features/F-identity/contract/auth-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_AUTHENTICATED, async (_event: LivEvent) => {
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

// ─── F-user-profile ───────────────────────────────────────────────────────────

import { upsertProfileForUser } from '@/features/F-user-profile/contract/user-profile-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_AUTHENTICATED, async (event: LivEvent) => {
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
