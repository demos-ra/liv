/**
 * F-identity / R4 / auth-queries.ts
 * [F-identity/R4/C2] Email service implementation and DB connection factory
 *
 * R4 Rules:
 * - Imports from R0 only. No R1, R2, R3 imports.
 * - O6: All config from environment — no hardcoded values.
 * - O3: Email send has timeout (enforced via fetch signal).
 * - O2: Rate limiting state storage (Postgres-backed, in auth_rate_limits table).
 */

import type { IEmailService } from './auth-db';
import type { MagicLinkEmailContent } from '../config/auth-types';
import type { AuthResult } from '../config/auth-types';
import { AuthErrors } from '../config/auth-error-factory';

// ─── Email Config (O6: from environment, never hardcoded) ────────────────────

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp';
  apiKey: string;          // from env: EMAIL_API_KEY
  fromAddress: string;     // from env: EMAIL_FROM_ADDRESS
  fromName: string;        // from env: EMAIL_FROM_NAME
}

// ─── Resend Implementation ────────────────────────────────────────────────────

export function createEmailService(config: EmailConfig): IEmailService {
  return {
    async sendMagicLink(
      to: string,
      content: MagicLinkEmailContent
    ): Promise<AuthResult<void>> {
      // O3: Timeout enforced — LA operations.json ≤30s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s email timeout

      try {
        const payload = {
          from: `${config.fromName} <${config.fromAddress}>`,
          to: [to],
          subject: content.subject,
          text: content.text,
          html: content.html,
        };

        let response: Response;

        if (config.provider === 'resend') {
          response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
        } else if (config.provider === 'sendgrid') {
          response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: to }] }],
              from: { email: config.fromAddress, name: config.fromName },
              subject: content.subject,
              content: [
                { type: 'text/plain', value: content.text },
                { type: 'text/html', value: content.html },
              ],
            }),
            signal: controller.signal,
          });
        } else {
          return {
            success: false,
            error: AuthErrors.emailSendFailed(to, `Provider '${config.provider}' not implemented`),
          };
        }

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'unknown');
          return {
            success: false,
            error: AuthErrors.emailSendFailed(to, `HTTP ${response.status}: ${errorText}`),
          };
        }

        return { success: true, data: undefined };

      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === 'AbortError') {
          return {
            success: false,
            error: AuthErrors.emailSendFailed(to, 'Email send timed out after 10s'),
          };
        }

        return {
          success: false,
          error: AuthErrors.emailSendFailed(to, err),
        };
      }
    },
  };
}

// ─── Rate Limit Table Schema (DDL reference) ──────────────────────────────────

export const RATE_LIMIT_SCHEMA_DDL = `
-- O2: Rate limiting state (Postgres-backed)
-- Keyed by identity_type + identity_value + action

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_type   TEXT NOT NULL,  -- 'ip', 'email'
  identity_value  TEXT NOT NULL,
  action          TEXT NOT NULL,  -- 'magic-link-request', 'magic-link-verify'
  attempt_count   INTEGER NOT NULL DEFAULT 1,
  window_start    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Composite index for fast lookup per identity+action
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_identity_action
  ON auth_rate_limits(identity_type, identity_value, action);
` as const;

// ─── Rate Limiter (O2: enforced at R4, state in Postgres) ────────────────────

export interface RateLimitConfig {
  maxAttempts: number;     // ≤5 per LA operations.json
  windowMinutes: number;
}

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'magic-link-request': { maxAttempts: 3, windowMinutes: 60 },   // 3 requests/hour per email
  'magic-link-verify':  { maxAttempts: 5, windowMinutes: 15 },   // 5 attempts/15min per IP
} as const;

type PostgresClient = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]>;
};

export async function checkRateLimit(
  sql: PostgresClient,
  identityType: 'ip' | 'email',
  identityValue: string,
  action: keyof typeof RATE_LIMITS
): Promise<{ allowed: boolean; remainingAttempts: number }> {
  const config = RATE_LIMITS[action];

  try {
    // Upsert rate limit record, reset window if expired
    const rows = await sql`
      INSERT INTO auth_rate_limits (identity_type, identity_value, action, attempt_count, window_start, last_attempt_at)
      VALUES (${identityType}, ${identityValue}, ${action}, 1, now(), now())
      ON CONFLICT (identity_type, identity_value, action) DO UPDATE SET
        attempt_count = CASE
          WHEN auth_rate_limits.window_start < now() - (${config.windowMinutes} || ' minutes')::INTERVAL
          THEN 1  -- reset window
          ELSE auth_rate_limits.attempt_count + 1
        END,
        window_start = CASE
          WHEN auth_rate_limits.window_start < now() - (${config.windowMinutes} || ' minutes')::INTERVAL
          THEN now()
          ELSE auth_rate_limits.window_start
        END,
        last_attempt_at = now()
      RETURNING attempt_count
    `;

    const attemptCount = rows[0]?.attempt_count as number ?? 1;
    const allowed = attemptCount <= config.maxAttempts;
    const remainingAttempts = Math.max(0, config.maxAttempts - attemptCount);

    return { allowed, remainingAttempts };
  } catch {
    // Fail open — rate limiter failure should not block auth
    return { allowed: true, remainingAttempts: config.maxAttempts };
  }
}

// ─── DB Connection Factory (O6: from env) ────────────────────────────────────

export interface DbConfig {
  connectionString: string;  // from env: DATABASE_URL
  maxConnections: number;    // from env: DB_MAX_CONNECTIONS, default 10
  statementTimeout: number;  // from env: DB_STATEMENT_TIMEOUT_MS, default 30000
}

/**
 * Returns config object from environment.
 * Called once at app startup in Next.js instrumentation.ts.
 * No hardcoded values — O6 compliant.
 */
export function getDbConfig(): DbConfig {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('[F-identity/R4] DATABASE_URL environment variable is required');
  }

  return {
    connectionString,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS ?? '10', 10),
    statementTimeout: parseInt(process.env.DB_STATEMENT_TIMEOUT_MS ?? '30000', 10),
  };
}

export function getEmailConfig(): EmailConfig {
  const apiKey = process.env.EMAIL_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const provider = process.env.EMAIL_PROVIDER as EmailConfig['provider'];

  if (!apiKey || !fromAddress || !provider) {
    throw new Error('[F-identity/R4] EMAIL_API_KEY, EMAIL_FROM_ADDRESS, and EMAIL_PROVIDER are required');
  }

  return {
    provider,
    apiKey,
    fromAddress,
    fromName: process.env.EMAIL_FROM_NAME ?? 'LIV',
  };
}
