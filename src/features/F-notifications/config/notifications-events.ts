// [F-notifications/R0/C3] Event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const NOTIFICATIONS_EVENTS = {
  NOTIFY: 'notifications.notify',
  DISMISS: 'notifications.dismiss',
  CREATED: 'notifications.created',
} as const

export type NotificationsEventType = typeof NOTIFICATIONS_EVENTS[keyof typeof NOTIFICATIONS_EVENTS]
