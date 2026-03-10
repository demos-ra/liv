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
