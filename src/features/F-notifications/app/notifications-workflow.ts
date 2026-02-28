// [F-notifications/R2/C3] Notification workflow
// commit: add createNotification for event-subscriptions direct calls
//
// R2: orchestration, depends R0 + R1 + R4

import { NotificationKind, NotificationSeverity } from '../config/notifications-config'
import { buildNotification, buildTitle } from '../domain/notifications-logic'
import { persistNotification, markNotificationsRead, getNotifications, purgeExpired } from '../exec/notifications-db'
import { subscribeToEvent, emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import type { SystemEvent } from '@/features/F-event-system/config/event-schema'

// ─── Direct notification creation ─────────────────────────────────────────────
// Called by event-subscriptions.ts for cross-slice notification writes.
// Uses the same buildNotification factory as the internal subscription system.

export async function createNotification(params: {
  userId: string
  kind: NotificationKind
  severity: NotificationSeverity
  title: string
  message?: string
  projectId?: string
}): Promise<void> {
  const notification = buildNotification(params.userId, params.kind, params.title, {
    projectId: params.projectId,
    body: params.message,
  })
  await persistNotification(notification)
  await emitEvent({
    type: EVENTS.NOTIFICATIONS.CREATED,
    payload: {
      userId: params.userId,
      notificationId: notification.notificationId,
      kind: params.kind,
      severity: notification.severity,
    },
  })
}

// ─── Internal subscription registration ───────────────────────────────────────
// Called once at startup by startup.ts — registers F-notifications own subscriptions.

export function registerNotificationSubscriptions() {
  const notify = async (
    event: SystemEvent,
    kind: NotificationKind,
    getUserId: (e: SystemEvent) => string,
    getMeta: (e: SystemEvent) => Record<string, unknown> = (e) => e.payload
  ) => {
    const userId = getUserId(event)
    if (!userId) return
    const meta = getMeta(event)
    const title = buildTitle(kind, meta)
    const notification = buildNotification(userId, kind, title, {
      projectId: (event.payload as Record<string, unknown>).projectId as string | undefined,
      meta,
    })
    await persistNotification(notification)
    await emitEvent({
      type: EVENTS.NOTIFICATIONS.CREATED,
      payload: { userId, notificationId: notification.notificationId, kind, severity: notification.severity },
    })
  }

  subscribeToEvent(EVENTS.SESSION.SESSION_EXPIRED,             (e) => notify(e, 'session.expired',      (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.GIT.CONNECTED,                       (e) => notify(e, 'git.connected',        (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.GIT.DISCONNECTED,                    (e) => notify(e, 'git.disconnected',     (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.GIT.REPO_SYNCED,                     (e) => notify(e, 'git.repo.synced',      (ev) => ev.payload.userId, (ev) => ({ repo: `${ev.payload.owner}/${ev.payload.repo}` })))
  subscribeToEvent(EVENTS.HEALTH.VIOLATION_FOUND,              (e) => notify(e, 'health.violation',     (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.EXECUTION.SLICE_FAILED,              (e) => notify(e, 'execution.violation',  (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.COMMIT_LOG.COMMIT_CONFIRMED,         (e) => notify(e, 'commit.confirmed',     (ev) => ev.payload.userId))
  subscribeToEvent(EVENTS.CONSTITUTION.CONSTITUTION_UPDATED,   (e) => notify(e, 'constitution.updated', (ev) => ev.payload.userId))
}

// ─── Read functions ───────────────────────────────────────────────────────────

export async function readNotifications(userId: string, notificationIds: string[]): Promise<void> {
  await markNotificationsRead(userId, notificationIds)
}

export async function loadNotifications(userId: string, projectId: string | null, cursor: string | null) {
  return getNotifications(userId, projectId, cursor)
}

export async function purgeOldNotifications(): Promise<number> {
  return purgeExpired()
}
