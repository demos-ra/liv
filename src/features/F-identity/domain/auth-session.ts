// @liv-standard v1.3
// [F-identity/R1]
// Built with LIV · livai.dev
/**
 * F-identity / R1 / auth-session.ts
 * [F-identity/R1/C2] Pure session creation and token logic
 *
 * R1 Rules:
 * - Pure functions only. No I/O. No crypto calls that require Node APIs.
 * - All randomness injected as parameters (testable, pure).
 * - Imports from R0 only.
 */

import type { Session, SessionPayload, MagicLinkToken, MagicLinkEmailContent } from '../config/auth-types';

// ─── Expiry Configuration ─────────────────────────────────────────────────────

export const AUTH_CONFIG = {
  MAGIC_LINK_TTL_MINUTES: 15,
  SESSION_TTL_DAYS: 30,
  SESSION_REFRESH_THRESHOLD_DAYS: 7, // refresh if < 7 days remaining
} as const;

// ─── Token Expiry Calculation ─────────────────────────────────────────────────

export function magicLinkExpiresAt(now: Date = new Date()): Date {
  const expires = new Date(now);
  expires.setMinutes(expires.getMinutes() + AUTH_CONFIG.MAGIC_LINK_TTL_MINUTES);
  return expires;
}

export function sessionExpiresAt(now: Date = new Date()): Date {
  const expires = new Date(now);
  expires.setDate(expires.getDate() + AUTH_CONFIG.SESSION_TTL_DAYS);
  return expires;
}

export function sessionNeedsRefresh(expiresAt: Date, now: Date = new Date()): boolean {
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() + AUTH_CONFIG.SESSION_REFRESH_THRESHOLD_DAYS);
  return expiresAt < threshold;
}

// ─── Session Payload Extraction ───────────────────────────────────────────────

/**
 * Derives the cross-slice SessionPayload from a full Session + email.
 * Pure function — takes data in, returns data out.
 */
export function buildSessionPayload(
  session: Session,
  email: string
): SessionPayload {
  return {
    sessionId: session.id,
    userId: session.userId,
    email,
    expiresAt: session.expiresAt,
  };
}

// ─── Magic Link URL Builder ───────────────────────────────────────────────────

/**
 * Constructs the magic link URL from base URL and raw token.
 * Pure string operation — no I/O.
 */
export function buildMagicLinkUrl(
  baseUrl: string,
  token: string,
  email: string
): string {
  const params = new URLSearchParams({
    token,
    email,
  });
  return `${baseUrl}/auth/verify?${params.toString()}`;
}

// ─── Magic Link Email Content ─────────────────────────────────────────────────

// MagicLinkEmailContent canonical owner: R0 auth-types.ts — imported above, not re-exported from here

export function buildMagicLinkEmail(
  email: string,
  magicLinkUrl: string,
  expiresAt: Date
): MagicLinkEmailContent {
  const expiryMinutes = AUTH_CONFIG.MAGIC_LINK_TTL_MINUTES;

  return {
    subject: 'Sign in to LIV',
    text: [
      `Sign in to LIV`,
      ``,
      `Click this link to sign in: ${magicLinkUrl}`,
      ``,
      `This link expires in ${expiryMinutes} minutes.`,
      `If you didn't request this, you can ignore this email.`,
    ].join('\n'),
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
  <h1 style="font-family: 'Instrument Serif', serif; font-size: 28px; font-weight: 400; margin-bottom: 8px;">Sign in to LIV</h1>
  <p style="font-size: 15px; color: #555; margin-bottom: 32px;">Click the button below to sign in to your account. This link expires in ${expiryMinutes} minutes.</p>
  <a href="${magicLinkUrl}"
     style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none;
            padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">
    Sign in to LIV
  </a>
  <p style="font-size: 13px; color: #888; margin-top: 32px;">
    If the button doesn't work, copy and paste this URL:<br/>
    <span style="word-break: break-all; color: #555;">${magicLinkUrl}</span>
  </p>
  <p style="font-size: 12px; color: #aaa; margin-top: 24px;">
    If you didn't request this sign-in link, you can safely ignore this email.
  </p>
</body>
</html>`,
  };
}
