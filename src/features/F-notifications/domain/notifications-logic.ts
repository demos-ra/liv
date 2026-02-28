// [F-notifications/R1/C2] Notification domain logic
// R1: pure functions, no I/O, depends R0 only

import {
  Notification,
  NotificationKind,
  KIND_SEVERITY,
  NOTIFICATIONS_CONFIG,
} from '../config/notifications-config'
import { generateId } from '@/core/types/primitives'

// --- Factory: build a notification from any system event ---

export function buildNotification(
  userId: string,
  kind: NotificationKind,
  title: string,
  options: {
    projectId?: string
    body?: string
    meta?: Record<string, unknown>
  } = {}
): Notification {
  return {
    notificationId: generateId('notif'),
    userId,
    projectId: options.projectId ?? null,
    kind,
    severity: KIND_SEVERITY[kind],
    title,
    body: options.body ?? null,
    read: false,
    createdAt: Date.now(),
    readAt: null,
    meta: options.meta ?? {},
  }
}

export function markRead(notification: Notification): Notification {
  return { ...notification, read: true, readAt: Date.now() }
}

export function isExpired(notification: Notification): boolean {
  const ttlMs = NOTIFICATIONS_CONFIG.ttlDays * 24 * 60 * 60 * 1000
  return Date.now() - notification.createdAt > ttlMs
}

// --- Unread count (computed, not stored) ---

export function countUnread(notifications: Notification[]): number {
  return Math.min(
    notifications.filter((n) => !n.read).length,
    NOTIFICATIONS_CONFIG.maxUnread
  )
}

// --- Title builders per kind (canonical, single source of truth) ---

export function buildTitle(kind: NotificationKind, meta: Record<string, unknown>): string {
  switch (kind) {
    case 'session.expired':       return 'Your session has expired'
    case 'git.connected':         return `GitHub connected${meta.githubLogin ? ` as @${meta.githubLogin}` : ''}`
    case 'git.disconnected':      return 'GitHub disconnected'
    case 'git.repo.synced':       return `Repo synced: ${meta.repo ?? ''}`
    case 'build.complete':        return 'Build complete'
    case 'build.failed':          return 'Build failed'
    case 'health.violation':      return `Health violation in ${meta.slice ?? 'unknown slice'}`
    case 'execution.violation':   return `Execution violation: ${meta.rule ?? 'unknown'}`
    case 'commit.confirmed':      return `Commit confirmed: ${meta.commitRef ?? ''}`
    case 'constitution.updated':  return 'Feature constitution updated'
    case 'member.joined':         return `${meta.userHandle ?? 'A member'} joined the project`
    case 'member.removed':        return `${meta.userHandle ?? 'A member'} was removed`
    default:                      return 'System notification'
  }
}
