// Re-export error types from auth-error-factory (canonical location)
export type { AuthError, AuthErrorCode } from './auth-error-factory';

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

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;      // hashed session token stored in DB
  expiresAt: Date;
  createdAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
}

// AuthSessionPayload: F-identity's internal session shape (not the JWT payload).
// The JWT payload lives in core/types/session.ts (SessionPayload).
// Named distinctly to prevent collision — both are valid, different types.
export interface AuthSessionPayload {
  sessionId: string;
  userId: string;
  email: string;
  expiresAt: Date;
}

// ─── Auth State (namespace owned exclusively by F-identity) ───────────────────

export interface AuthState {
  user: AuthUser | null;
  session: AuthSessionPayload | null;
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
