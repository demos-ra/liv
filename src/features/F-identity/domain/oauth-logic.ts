// @liv-standard v1.3
// [F-identity/domain/oauth-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// slice:      F-identity
// layer:      R1
// wires-in:   none (pure functions, crypto only)
// wires-out:
//   W-FN  generateOAuthState   → F-identity/contract/oauth-contract
//   W-FN  verifyOAuthState     → F-identity/contract/oauth-contract
// deps:      node:crypto
//
// R1 Rules: Pure functions only. No I/O beyond crypto.randomBytes.
// A4: R1 contains no external I/O. Same crypto pattern as generateRawToken in auth-db.ts.

import { randomBytes, timingSafeEqual } from 'crypto'

// ─── State Generation ─────────────────────────────────────────────────────────
// CSRF protection: generate random state for OAuth redirect, verify on callback.

export function generateOAuthState(): string {
  return randomBytes(32).toString('base64url')
}

// ─── State Verification ───────────────────────────────────────────────────────
// Timing-safe comparison prevents timing attacks on state parameter.

export function verifyOAuthState(stateCookie: string, stateParam: string): boolean {
  try {
    const a = Buffer.from(stateCookie, 'utf-8')
    const b = Buffer.from(stateParam, 'utf-8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
