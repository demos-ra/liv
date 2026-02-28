// [F-integration/R2/C3] Cross-slice event subscriptions
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

// ─── F-session subscriptions ──────────────────────────────────────────────────

import { createSessionForUser, destroySessionForUser } from '@/features/F-session/contract/session-contract'
import { resolveSession } from '@/features/F-session/contract/session-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  // Session was already created by F-identity R2; this subscription records
  // session-level lifecycle state in F-session namespace.
  await createSessionForUser(userId, sessionId)
})

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_OUT, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  await destroySessionForUser(userId, sessionId)
})

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (event: LivEvent) => {
  const { userId, sessionId } = event.payload as { userId: string; sessionId: string }
  // Clean up any session-level resources
  await destroySessionForUser(userId, sessionId)
})

// ─── F-permissions subscriptions ─────────────────────────────────────────────

import { assignDefaultRole } from '@/features/F-permissions/contract/permissions-contract'
import { setMemberRole } from '@/features/F-permissions/contract/permissions-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId } = event.payload as { userId: string }
  await assignDefaultRole(userId)
})

subscribeToEvent(EVENTS.PROJECT.PROJECT_CREATED, async (event: LivEvent) => {
  const { projectId, ownerId } = event.payload as { projectId: string; ownerId: string }
  await setMemberRole(ownerId, projectId, 'owner')
})

// ─── F-user-profile subscriptions ────────────────────────────────────────────

import { upsertProfileForUser } from '@/features/F-user-profile/contract/user-profile-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_IN, async (event: LivEvent) => {
  const { userId, email } = event.payload as {
    userId: string
    email: string
  }
  // Auth method: magic link. No GitHub OAuth tokens in auth payload.
  // Profile enrichment via GitHub (if connected) is handled by F-git-connector post-auth.
  await upsertProfileForUser(userId, email)
})

// ─── F-notifications subscriptions ───────────────────────────────────────────

import { createNotification } from '@/features/F-notifications/contract/notifications-contract'

subscribeToEvent(EVENTS.IDENTITY.USER_SIGNED_OUT, async (event: LivEvent) => {
  const { userId } = event.payload as { userId: string }
  await createNotification({
    userId,
    kind: 'info',
    severity: 'low',
    title: 'Signed out',
    message: 'You have been signed out successfully.',
  })
})

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (event: LivEvent) => {
  const { userId } = event.payload as { userId: string }
  await createNotification({
    userId,
    kind: 'warning',
    severity: 'medium',
    title: 'Session expired',
    message: 'Your session has expired. Please sign in again.',
  })
})

subscribeToEvent(EVENTS.GIT.CONNECTED, async (event: LivEvent) => {
  const { userId, projectId, repoName } = event.payload as {
    userId: string; projectId: string; repoName: string
  }
  await createNotification({
    userId,
    kind: 'success',
    severity: 'low',
    title: 'Repository connected',
    message: `${repoName} is now connected to LIV.`,
    projectId,
  })
})

subscribeToEvent(EVENTS.GIT.DISCONNECTED, async (event: LivEvent) => {
  const { userId, projectId, repoName } = event.payload as {
    userId: string; projectId: string; repoName: string
  }
  await createNotification({
    userId,
    kind: 'warning',
    severity: 'medium',
    title: 'Repository disconnected',
    message: `${repoName} has disconnected from LIV.`,
    projectId,
  })
})

subscribeToEvent(EVENTS.CONSTITUTION.CONSTITUTION_CONFIRMED, async (event: LivEvent) => {
  const { userId, projectId, sliceCount } = event.payload as {
    userId: string; projectId: string; sliceCount: number
  }
  await createNotification({
    userId,
    kind: 'success',
    severity: 'low',
    title: 'Build begins',
    message: `Constitution confirmed. ${sliceCount} slice${sliceCount !== 1 ? 's' : ''} queued for build.`,
    projectId,
  })
})

subscribeToEvent(EVENTS.HEALTH.VIOLATION_FOUND, async (event: LivEvent) => {
  const { userId, projectId, featureTag, message } = event.payload as {
    userId: string; projectId: string; featureTag: string; message: string
  }
  await createNotification({
    userId,
    kind: 'error',
    severity: 'high',
    title: `Health violation — ${featureTag}`,
    message,
    projectId,
  })
})

// ─── F-constitution subscriptions ────────────────────────────────────────────

import { initConstitution } from '@/features/F-constitution/contract/constitution-contract'

subscribeToEvent(EVENTS.PROJECT.PROJECT_CREATED, async (event: LivEvent) => {
  const { projectId, ownerId } = event.payload as { projectId: string; ownerId: string }
  // Initialise an empty draft constitution for every new project
  await initConstitution(projectId)
})

// ─── F-commit-log subscriptions ──────────────────────────────────────────────

import { recordCommit } from '@/features/F-commit-log/contract/commit-log-contract'

subscribeToEvent(EVENTS.GIT.COMMIT_DETECTED, async (event: LivEvent) => {
  const { projectId, hash, message, userId, isAi } = event.payload as {
    projectId: string
    hash: string
    message: string
    userId: string
    isAi: boolean
  }
  await recordCommit(projectId, hash, message, userId, isAi ? 'ai' : 'human')
})

// ─── F-topography subscriptions ──────────────────────────────────────────────

import { recordActivity, rebuildGrid } from '@/features/F-topography/contract/topography-contract'
import { buildGridFromResults } from '@/features/F-la-config/contract/execution-check'

subscribeToEvent(EVENTS.COMMIT_LOG.COMMIT_RECORDED, async (event: LivEvent) => {
  const { projectId, featureTag } = event.payload as { projectId: string; featureTag: string }
  // Commit recorded → trigger full LA validation run → grid rebuild
  await buildGridFromResults(projectId)
  await recordActivity(projectId, featureTag, 3, 'commit')
})

subscribeToEvent(EVENTS.HEALTH.CHECK_RUN, async (event: LivEvent) => {
  const { projectId } = event.payload as { projectId: string }
  await buildGridFromResults(projectId)
})

subscribeToEvent(EVENTS.EXECUTION.CHECK_RUN, async (event: LivEvent) => {
  const { projectId } = event.payload as { projectId: string }
  await buildGridFromResults(projectId)
})

subscribeToEvent(EVENTS.CONSTITUTION.SLICE_COMPLETE, async (event: LivEvent) => {
  const { projectId, featureTag } = event.payload as { projectId: string; featureTag: string }
  await recordActivity(projectId, featureTag, 4, 'slice.complete')
})

subscribeToEvent(EVENTS.CONSTITUTION.SLICE_BLOCKED, async (event: LivEvent) => {
  const { projectId, featureTag } = event.payload as { projectId: string; featureTag: string }
  await recordActivity(projectId, featureTag, 3, 'slice.blocked')
})

subscribeToEvent(EVENTS.CHAT.MESSAGE_ADDED, async (event: LivEvent) => {
  const { projectId } = event.payload as { projectId: string }
  await recordActivity(projectId, 'F-chat', 2, 'chat.message.streaming')
})

// ─── F-notifications subscriptions (from commit log) ─────────────────────────

subscribeToEvent(EVENTS.COMMIT_LOG.COMMIT_RECORDED, async (event: LivEvent) => {
  const { projectId, userId, featureTag, authorship } = event.payload as {
    projectId: string; userId: string; featureTag: string; authorship: 'human' | 'ai'
  }
  await createNotification({
    userId,
    kind: 'info',
    severity: 'low',
    title: `Commit recorded — ${featureTag}`,
    message: `${authorship === 'ai' ? 'AI-generated' : 'Human'} commit recorded for ${featureTag}.`,
    projectId,
  })
})

// ─── F-memory subscriptions ───────────────────────────────────────────────────

import { onSessionEnd as memoryOnSessionEnd } from '@/features/F-memory/contract/memory-contract'

subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED, async (_event: LivEvent) => {
  await memoryOnSessionEnd()
})

// ─── Export registration function ────────────────────────────────────────────
// Called exactly once in startup.ts.

export function registerAllSubscriptions(): void {
  // All subscribe() calls above execute at module evaluation time.
  // This function exists as an explicit signal that wiring is complete.
  console.log(JSON.stringify({
    level: 'info',
    event: 'integration.subscriptions.registered',
    count: 'see above',
    timestamp: new Date().toISOString(),
  }))
}

