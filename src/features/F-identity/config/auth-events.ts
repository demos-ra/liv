/**
 * F-identity / R0 / auth-events.ts
 * [F-identity/R0/C3] Auth event declarations — aligned to canonical event-schema.ts
 *
 * CANONICAL LAW: No local event name strings. All names imported from event-schema.ts.
 * F-identity emits via IEventBus. F-event-system routes. No direct slice calls.
 */

import { EVENTS } from '@/features/F-event-system/config/event-schema'
import type { AuthUser } from './auth-types'

// ─── Re-export canonical auth event names for internal use ────────────────────
// Use these constants within F-identity. Do not redeclare strings.

export const AUTH_EVENTS = {
  USER_REGISTERED:    EVENTS.IDENTITY.USER_REGISTERED,
  USER_AUTHENTICATED: EVENTS.IDENTITY.USER_SIGNED_IN,
  USER_SIGNED_OUT:    EVENTS.IDENTITY.USER_SIGNED_OUT,
  TOKEN_REFRESHED:    EVENTS.IDENTITY.TOKEN_REFRESHED,
  USER_FAILED:        EVENTS.IDENTITY.AUTH_FAILED,
} as const

export type AuthEventType = typeof AUTH_EVENTS[keyof typeof AUTH_EVENTS]

// ─── Event Payloads ───────────────────────────────────────────────────────────

export interface AuthUserRegisteredPayload {
  userId: string
  email: string
  timestamp: Date
}

export interface AuthUserAuthenticatedPayload {
  userId: string
  email: string
  sessionId: string
  timestamp: Date
}

export interface AuthUserSignedOutPayload {
  userId: string
  sessionId: string
  timestamp: Date
}

export interface AuthTokenRefreshedPayload {
  userId: string
  sessionId: string
  newExpiresAt: Date
  timestamp: Date
}

export interface AuthUserFailedPayload {
  email: string
  reason: string
  timestamp: Date
  ipAddress?: string
}

// ─── Discriminated Union ──────────────────────────────────────────────────────

export type AuthEvent =
  | { type: typeof AUTH_EVENTS.USER_REGISTERED;    payload: AuthUserRegisteredPayload;    eventKind: 'immediate' }
  | { type: typeof AUTH_EVENTS.USER_AUTHENTICATED; payload: AuthUserAuthenticatedPayload; eventKind: 'immediate' }
  | { type: typeof AUTH_EVENTS.USER_SIGNED_OUT;    payload: AuthUserSignedOutPayload;     eventKind: 'immediate' }
  | { type: typeof AUTH_EVENTS.TOKEN_REFRESHED;    payload: AuthTokenRefreshedPayload;    eventKind: 'immediate' }
  | { type: typeof AUTH_EVENTS.USER_FAILED;        payload: AuthUserFailedPayload;        eventKind: 'immediate' }

// ─── Event Bus Interface (satisfied by F-event-system at Phase 4) ─────────────

export interface IEventBus {
  emit(event: AuthEvent): Promise<void>
}

// ─── No-op stub for standalone operation ──────────────────────────────────────

export const noopEventBus: IEventBus = {
  async emit(event: AuthEvent): Promise<void> {
    console.log('[event-bus:noop]', event.type, event.payload)
  },
}
