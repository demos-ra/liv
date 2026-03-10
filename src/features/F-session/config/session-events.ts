// [F-session/R0/C3] Session event declarations — owned by this slice
export const SESSION_EVENTS = {
  SESSION_CREATED:   'session.session-created',
  SESSION_EXPIRED:   'session.session-expired',
  SESSION_REFRESHED: 'session.session-refreshed',
} as const
export type SessionEventType = typeof SESSION_EVENTS[keyof typeof SESSION_EVENTS]
