// Re-export error types from auth-error-factory (canonical location)
export type { AuthError, AuthErrorCode } from './auth-error-factory';
import type { AuthError } from './auth-error-factory'; // local use — Amendment 1: consumer must import atom directly

/**
 * F-identity / R0 / auth-types.ts
 * [F-identity/R0/C2] Shared type contracts for auth slice
 *
 * R0 Rule: No imports. No logic. Pure declarations only.
 * All other layers import from here. Nothing here imports from them.
 */

// ─── Core Identity ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

// ─── Magic Link ───────────────────────────────────────────────────────────────

export interface MagicLinkToken {
  id: string;
  userId: string;
  email: string;
  tokenHash: string;      // hashed — raw token only exists in the email
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerifyRequest {
  token: string;          // raw token from email link
  email: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

// A6: declared at R0, single source of truth for cookie name.
export const SESSION_COOKIE_NAME = 'liv_session' as const

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;      // hashed session token stored in DB
  expiresAt: Date;
  createdAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
}

// SessionPayload: the method-agnostic identity contract.
// 4 fields only — what the user is, not how they authenticated.
// A1: owned exclusively by F-identity. All other slices import from F-identity/contract/auth-contract.ts.
export interface SessionPayload {
  sessionId: string;
  userId:    string;
  email:     string;
  expiresAt: Date;
}

// ─── Auth State (namespace owned exclusively by F-identity) ───────────────────

export interface AuthState {
  user: AuthUser | null;
  session: SessionPayload | null;
  status: AuthStatus;
  error: AuthError | null;
}

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

// Error types: see auth-error-factory.ts (R0)

// ─── Operation Results ────────────────────────────────────────────────────────

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError };

// ─── Email Content (used by R4 email service, declared here so R4 can import from R0) ─

export interface MagicLinkEmailContent {
  subject: string;
  text: string;
  html: string;
}
