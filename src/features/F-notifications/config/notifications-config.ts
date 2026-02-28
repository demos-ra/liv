// [F-notifications/R0/C2] Notification configuration and types
// R0: pure config, zero dependencies

export const NOTIFICATIONS_CONFIG = {
  maxUnread: 100,
  pageSize: 30,
  ttlDays: 30,         // notifications older than 30 days auto-cleared
} as const

export const NOTIFICATIONS_NAMESPACE = 'notifications' as const

// Every system event that can surface as a notification
export type NotificationKind =
  | 'session.expired'
  | 'git.connected'
  | 'git.disconnected'
  | 'git.repo.synced'
  | 'build.complete'
  | 'build.failed'
  | 'health.violation'
  | 'execution.violation'
  | 'commit.confirmed'
  | 'constitution.updated'
  | 'member.joined'
  | 'member.removed'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export type Notification = {
  notificationId: string
  userId: string
  projectId: string | null
  kind: NotificationKind
  severity: NotificationSeverity
  title: string
  body: string | null
  read: boolean
  createdAt: number   // unix ms
  readAt: number | null
  meta: Record<string, unknown>  // kind-specific structured data
}

// Severity map — drives UI treatment, declared here so R1 logic stays pure
export const KIND_SEVERITY: Record<NotificationKind, NotificationSeverity> = {
  'session.expired':        'warning',
  'git.connected':          'success',
  'git.disconnected':       'warning',
  'git.repo.synced':        'info',
  'build.complete':         'success',
  'build.failed':           'error',
  'health.violation':       'error',
  'execution.violation':    'error',
  'commit.confirmed':       'success',
  'constitution.updated':   'info',
  'member.joined':          'info',
  'member.removed':         'info',
}
