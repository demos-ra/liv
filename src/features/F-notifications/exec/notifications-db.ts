// [F-notifications/R4/C2] Notifications database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { Notification, NOTIFICATIONS_CONFIG } from '../config/notifications-config'

export async function persistNotification(n: Notification): Promise<void> {
  await db.query(
    `INSERT INTO notifications (
      notification_id, user_id, project_id, kind, severity,
      title, body, read, created_at, read_at, meta
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
      to_timestamp($9 / 1000.0),
      to_timestamp($10 / 1000.0),
      $11)`,
    [
      n.notificationId, n.userId, n.projectId, n.kind, n.severity,
      n.title, n.body, n.read, n.createdAt, n.readAt,
      JSON.stringify(n.meta),
    ]
  )
}

export async function markNotificationsRead(userId: string, notificationIds: string[]): Promise<void> {
  await db.query(
    `UPDATE notifications
     SET read = true, read_at = NOW()
     WHERE user_id = $1 AND notification_id = ANY($2) AND read = false`,
    [userId, notificationIds]
  )
}

export async function getNotifications(
  userId: string,
  projectId: string | null,
  cursor: string | null
): Promise<{ notifications: Notification[]; hasMore: boolean; cursor: string | null }> {
  const limit = NOTIFICATIONS_CONFIG.pageSize
  const result = await db.query(
    `SELECT * FROM notifications
     WHERE user_id = $1
       ${projectId ? 'AND project_id = $4' : ''}
       ${cursor ? 'AND created_at < to_timestamp($3 / 1000.0)' : ''}
     ORDER BY created_at DESC
     LIMIT $2`,
    projectId && cursor
      ? [userId, limit + 1, Number(cursor), projectId]
      : projectId
      ? [userId, limit + 1, projectId]
      : cursor
      ? [userId, limit + 1, Number(cursor)]
      : [userId, limit + 1]
  )

  const rows = result.rows
  const hasMore = rows.length > limit
  const notifications = rows.slice(0, limit).map(rowToNotification)

  return {
    notifications,
    hasMore,
    cursor: notifications.length > 0
      ? String(notifications[notifications.length - 1].createdAt)
      : null,
  }
}

export async function purgeExpired(): Promise<number> {
  const result = await db.query(
    `DELETE FROM notifications
     WHERE created_at < NOW() - INTERVAL '${NOTIFICATIONS_CONFIG.ttlDays} days'
     RETURNING notification_id`
  )
  return result.rows.length
}

function rowToNotification(row: Record<string, unknown>): Notification {
  return {
    notificationId: row.notification_id as string,
    userId: row.user_id as string,
    projectId: row.project_id as string | null,
    kind: row.kind as Notification['kind'],
    severity: row.severity as Notification['severity'],
    title: row.title as string,
    body: row.body as string | null,
    read: row.read as boolean,
    createdAt: Number(new Date(row.created_at as string)),
    readAt: row.read_at ? Number(new Date(row.read_at as string)) : null,
    meta: (row.meta as Record<string, unknown>) ?? {},
  }
}
