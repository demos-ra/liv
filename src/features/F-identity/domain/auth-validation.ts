// @liv-standard v1.0
// [F-identity/domain/auth-validation.ts]
// Built with LIV · livai.dev
// R1: pure functions, no I/O, depends R0 only.
// A2: imports only from R0 (auth-types, allowlist).
// Phase 3 change: added isEmailAllowed gate in validateMagicLinkRequest.
// Deliberate: isEmailAllowed reads process.env but is synchronous and side-effect free —
// acceptable at R1 boundary per LIV-Standard (env reads treated as config access, not I/O).

import type { AuthError, MagicLinkRequest, MagicLinkVerifyRequest } from '../config/auth-types'
import { isEmailAllowed } from '../config/allowlist'

// ─── Error Factory ────────────────────────────────────────────────────────────

function authError(
  code: AuthError['code'],
  message: string,
  context?: Record<string, unknown>
): AuthError {
  return { code, message, context, timestamp: new Date() }
}

// ─── Email Validation ─────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254 // RFC 5321

export function validateEmail(email: unknown): AuthError | null {
  if (typeof email !== 'string') {
    return authError('INVALID_EMAIL', 'Email must be a string')
  }
  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return authError('INVALID_EMAIL', 'Email is required')
  }
  if (trimmed.length > EMAIL_MAX_LENGTH) {
    return authError('INVALID_EMAIL', `Email exceeds maximum length of ${EMAIL_MAX_LENGTH}`)
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return authError('INVALID_EMAIL', 'Email format is invalid')
  }
  return null
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// ─── Magic Link Request Validation ───────────────────────────────────────────

export function validateMagicLinkRequest(
  input: unknown
): { valid: true; data: MagicLinkRequest } | { valid: false; error: AuthError } {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: authError('INVALID_EMAIL', 'Request body is required') }
  }

  const { email } = input as Record<string, unknown>
  const emailError = validateEmail(email)
  if (emailError) {
    return { valid: false, error: emailError }
  }

  const normalized = normalizeEmail(email as string)

  // A6: allowlist check — isEmailAllowed declared at R0/allowlist.ts.
  // Returns same generic response as invalid email — no enumeration of allowlist.
  if (!isEmailAllowed(normalized)) {
    return { valid: false, error: authError('INVALID_EMAIL', 'Check your email for a magic link.') }
  }

  return {
    valid: true,
    data: { email: normalized },
  }
}

// ─── Magic Link Token Validation ─────────────────────────────────────────────

const TOKEN_MIN_LENGTH = 32
const TOKEN_MAX_LENGTH = 128

export function validateMagicLinkToken(token: unknown): AuthError | null {
  if (typeof token !== 'string') {
    return authError('TOKEN_INVALID', 'Token must be a string')
  }
  if (token.length < TOKEN_MIN_LENGTH || token.length > TOKEN_MAX_LENGTH) {
    return authError('TOKEN_INVALID', 'Token format is invalid')
  }
  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    return authError('TOKEN_INVALID', 'Token contains invalid characters')
  }
  return null
}

export function validateMagicLinkVerifyRequest(
  input: unknown
): { valid: true; data: MagicLinkVerifyRequest } | { valid: false; error: AuthError } {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: authError('TOKEN_INVALID', 'Request body is required') }
  }

  const { token, email } = input as Record<string, unknown>

  const tokenError = validateMagicLinkToken(token)
  if (tokenError) return { valid: false, error: tokenError }

  const emailError = validateEmail(email)
  if (emailError) return { valid: false, error: emailError }

  return {
    valid: true,
    data: {
      token: token as string,
      email: normalizeEmail(email as string),
    },
  }
}

// ─── Token Expiry Validation ──────────────────────────────────────────────────

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

export function isTokenAlreadyUsed(usedAt: Date | null): boolean {
  return usedAt !== null
}

export function validateTokenState(
  expiresAt: Date,
  usedAt: Date | null
): AuthError | null {
  if (isTokenAlreadyUsed(usedAt)) {
    return authError('TOKEN_ALREADY_USED', 'This magic link has already been used')
  }
  if (isTokenExpired(expiresAt)) {
    return authError('TOKEN_EXPIRED', 'This magic link has expired. Please request a new one.')
  }
  return null
}

// ─── Session Expiry Validation ────────────────────────────────────────────────

export function isSessionExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

export function validateSession(expiresAt: Date): AuthError | null {
  if (isSessionExpired(expiresAt)) {
    return authError('SESSION_EXPIRED', 'Session has expired. Please sign in again.')
  }
  return null
}
