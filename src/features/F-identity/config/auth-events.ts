// @liv-standard v1.3
// [F-identity/R0]
// Built with LIV · livai.dev
// [F-identity/R0/C3] Auth event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const IDENTITY_EVENTS = {
  USER_SIGNED_IN:    'identity.user-signed-in',
  USER_SIGNED_OUT:   'identity.user-signed-out',
  USER_AUTHENTICATED:'identity.user-authenticated',
  USER_FAILED:       'identity.user-failed',
  AUTH_FAILED:       'identity.auth-failed',
  TOKEN_REFRESHED:   'identity.token-refreshed',
  USER_REGISTERED:   'identity.user-registered',
} as const

export type IdentityEventType = typeof IDENTITY_EVENTS[keyof typeof IDENTITY_EVENTS]

// ─── Payload types ────────────────────────────────────────────────────────────

export interface AuthUserRegisteredPayload {
  userId: string
  email:  string
}

export interface AuthUserAuthenticatedPayload {
  userId:    string
  sessionId: string
  email:     string
}

export interface AuthUserSignedOutPayload {
  userId:    string
  sessionId: string
}

// Convenience alias for internal use — same strings, named for intent
export const AUTH_EVENTS = IDENTITY_EVENTS

// ─── Event bus interface (dep-injection contract for R2) ──────────────────────
// Declared at R0 so R2 can reference it without importing from R4 or F-event-system.
export interface IEventBus {
  emit(event: { type: string; payload: Record<string, unknown>; eventKind?: string }): Promise<void>
}

// ─── Session Events (absorbed from F-session — A1: single owner) ─────────────
// SESSION_EVENTS are re-exported by event-schema.ts under EVENTS.SESSION.

export const SESSION_EVENTS = {
  SESSION_CREATED:   'session.session-created',
  SESSION_EXPIRED:   'session.session-expired',
  SESSION_REFRESHED: 'session.session-refreshed',
} as const

export type SessionEventType = typeof SESSION_EVENTS[keyof typeof SESSION_EVENTS]
