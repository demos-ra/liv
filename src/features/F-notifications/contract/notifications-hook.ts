// [F-notifications/R3/C2] useNotifications hook — namespace + SSE stream
// R3: client-side contract

'use client'

import { useEffect, useCallback } from 'react'
import { useNamespace, useWriteNamespace } from '@/features/F-la-config/contract/registry-hook'
import { NOTIFICATIONS_NAMESPACE, Notification } from '../config/notifications-config'
import { countUnread } from '../domain/notifications-logic'

export type NotificationsState = {
  notifications: Notification[]
  unreadCount: number
  hasMore: boolean
  cursor: string | null
}

const INITIAL_STATE: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  hasMore: false,
  cursor: null,
}

export function useNotifications() {
  const state = useNamespace<NotificationsState>(NOTIFICATIONS_NAMESPACE) ?? INITIAL_STATE
  const write = useWriteNamespace<NotificationsState>(NOTIFICATIONS_NAMESPACE)

  // SSE connection — live push
  useEffect(() => {
    const es = new EventSource('/api/notifications/stream')

    es.addEventListener('notification', (e) => {
      const incoming = JSON.parse(e.data) as Notification
      write((prev) => {
        const next = [incoming, ...(prev?.notifications ?? [])]
        return {
          ...(prev ?? INITIAL_STATE),
          notifications: next,
          unreadCount: countUnread(next),
        }
      })
    })

    es.onerror = () => es.close()

    return () => es.close()
  }, [write])

  const markRead = useCallback(
    async (notificationIds: string[]) => {
      await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      })
      write((prev) => {
        if (!prev) return prev
        const updated = prev.notifications.map((n) =>
          notificationIds.includes(n.notificationId)
            ? { ...n, read: true, readAt: Date.now() }
            : n
        )
        return { ...prev, notifications: updated, unreadCount: countUnread(updated) }
      })
    },
    [write]
  )

  return { ...state, markRead }
}

export function useUnreadCount(): number {
  return useNotifications().unreadCount
}
