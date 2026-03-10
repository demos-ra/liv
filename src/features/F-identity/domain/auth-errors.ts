/**
 * F-identity / R1 / auth-errors.ts
 * [F-identity/R1/C2] Auth error utilities — re-exports R0 factory, adds log shape
 *
 * R1 Rules: Imports from R0 only.
 * AuthErrors factory lives at R0 (so R4 can also import it).
 * This file re-exports it for R1/R2 convenience and adds the log shape.
 */

// Amendment 1: type atoms exported with explicit 'export type' — isolatedModules compliance
export { AuthErrors } from '../config/auth-error-factory';
export type { AuthError, AuthErrorCode } from '../config/auth-error-factory';
import type { AuthError } from '../config/auth-error-factory';

// ─── Error Logging Shape (O5 — structured log format) ────────────────────────

export interface AuthErrorLog {
  [key: string]: unknown;
  level: 'error' | 'warn';
  event: string;
  code: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string; // ISO
}

export function toErrorLog(
  error: AuthError,
  event: string
): AuthErrorLog {
  return {
    level: error.code === 'RATE_LIMITED' || error.code === 'TOKEN_EXPIRED' ? 'warn' : 'error',
    event,
    code: error.code,
    message: error.message,
    context: error.context,
    timestamp: error.timestamp.toISOString(),
  };
}
