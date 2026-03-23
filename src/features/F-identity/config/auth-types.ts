// @liv-standard v1.3
// [F-identity/config/auth-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
// slice:      F-identity
// layer:      R0
// wires-out:
//   W-ATOM  AuthUser        →  F-identity/R3
//   W-ATOM  AuthState       →  F-identity/R3, src/app/page.tsx
//   W-ATOM  SessionPayload  →  F-identity/R3
//   W-ATOM  AuthStatus      →  F-identity/R3
//   W-ATOM  AuthResult      →  F-identity/R3
// deps:      none (R0 — pure declarations)
// validated: pending
//
// step5b-phaseA (A1, A3, A6):
//   Added: isAdmin to AuthState.
//   isAdmin is derived at login time from ALLOWED_EMAILS (server env var) and
//   stored in the session-hydrated client state. F-identity owns this derivation
//   (A1). No other slice computes admin status — they read state.isAdmin (A3).
//   Axiom cite: A1 — F-identity owns identity state. A3 — typed atom at boundary.
//   A6 — declared at R0, single source of truth.

// Re-export error types from auth-error-factory (canonical location)
export type { AuthError, AuthErrorCode } from './auth-error-factory';
import type { AuthError } from './auth-error-factory'; // local use

/**
 * F-identity / R0 / auth-types.ts
 * R0 Rule: No imports. No logic. Pure declarations only.
 */

// ─── Core Identity ────────────────────────────────────────────────────────────

export interface AuthUser {
  id:          string;
  email:       string;
  createdAt:   Date;
  lastLoginAt: Date | null;
}

// ─── Magic Link ───────────────────────────────────────────────────────────────

export interface MagicLinkToken {
  id:        string;
  userId:    string;
  email:     string;
  tokenHash: string;
  expiresAt: Date;
  usedAt:    Date | null;
  createdAt: Date;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerifyRequest {
  token: string;
  email: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = 'liv_session' as const

export interface Session {
  id:        string;
  userId:    string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
}

// SessionPayload: method-agnostic identity contract.
// A1: owned exclusively by F-identity.
export interface SessionPayload {
  sessionId: string;
  userId:    string;
  email:     string;
  expiresAt: Date;
}

// ─── Auth State ───────────────────────────────────────────────────────────────

export interface AuthState {
  user:    AuthUser | null;
  session: SessionPayload | null;
  status:  AuthStatus;
  error:   AuthError | null;
  // step5b-phaseA: isAdmin derived from ALLOWED_EMAILS at session hydration.
  // True iff authenticated user's email is in ALLOWED_EMAILS server env var.
  // Defaults false — no privilege escalation on missing data.
  isAdmin: boolean;
}

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

// ─── Operation Results ────────────────────────────────────────────────────────

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError };

// ─── Email Content ────────────────────────────────────────────────────────────

export interface MagicLinkEmailContent {
  subject: string;
  text:    string;
  html:    string;
}
