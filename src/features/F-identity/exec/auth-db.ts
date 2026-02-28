/**
 * F-identity / R4 / auth-db.ts
 * [F-identity/R4/C2] Postgres queries and external I/O for auth slice
 *
 * R4 Rules:
 * - Imports from R0 only. No R1, R2, R3 imports.
 * - Owns all Postgres operations for F-identity.
 * - O3: All operations have timeouts (enforced via query timeout).
 * - O6: All config (DB connection, secrets) from environment — zero hardcoding.
 * - O7: All inputs validated before reaching here (done at R3/R2). Deletion is explicit.
 * - Single owner per I/O channel (execution.json: io_ownership rule).
 *
 * Exports two interfaces: IAuthDb and IEmailService.
 * R2 depends on these interfaces. Concrete implementations are in auth-queries.ts.
 */

import { createHash, randomBytes } from 'crypto';
import type {
  AuthUser,
  Session,
  MagicLinkToken,
  AuthResult,
} from '../config/auth-types';
import type { MagicLinkEmailContent } from '../config/auth-types';
import { AuthErrors } from '../config/auth-error-factory';

// ─── Database Interface (R2 depends on this, not the implementation) ──────────

export interface UpsertUserResult extends AuthResult<AuthUser> {
  isNew: boolean;
}

export interface CreateTokenResult {
  success: true;
  data: { rawToken: string; tokenRecord: MagicLinkToken };
}

export interface IAuthDb {
  upsertUser(email: string): Promise<UpsertUserResult>;
  findUserById(id: string): Promise<AuthResult<AuthUser>>;
  findUserByEmail(email: string): Promise<AuthResult<AuthUser>>;
  updateLastLogin(userId: string): Promise<void>;

  createMagicLinkToken(
    userId: string,
    email: string,
    expiresAt: Date
  ): Promise<AuthResult<{ rawToken: string }>>;
  findMagicLinkToken(rawToken: string, email: string): Promise<AuthResult<MagicLinkToken>>;
  markTokenUsed(tokenId: string): Promise<void>;
  invalidatePendingTokens(email: string): Promise<void>;

  createSession(userId: string, expiresAt: Date, meta?: { userAgent?: string; ipAddress?: string }): Promise<AuthResult<Session>>;
  findSession(rawSessionToken: string): Promise<AuthResult<Session>>;
  deleteSession(sessionId: string): Promise<AuthResult<void>>;
  refreshSession(sessionId: string, newExpiresAt: Date): Promise<void>;
}

// ─── Email Service Interface ──────────────────────────────────────────────────

export interface IEmailService {
  sendMagicLink(
    to: string,
    content: MagicLinkEmailContent
  ): Promise<AuthResult<void>>;
}

// ─── Token Hashing (R4 — uses Node crypto, correct layer) ────────────────────

export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

export function generateRawToken(): string {
  // 48 bytes → 64 chars URL-safe base64 (no padding issues)
  return randomBytes(48).toString('base64url');
}

// ─── Schema (DDL — reference, not executed by this file) ─────────────────────

export const AUTH_SCHEMA_DDL = `
-- F-identity schema
-- Version: 1.0.0
-- [F-identity/R4/C2] Initial schema

CREATE TABLE IF NOT EXISTS auth_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth_magic_link_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast token lookup during verification
CREATE INDEX IF NOT EXISTS idx_magic_link_token_hash ON auth_magic_link_tokens(token_hash);
-- Index for invalidating pending tokens by email
CREATE INDEX IF NOT EXISTS idx_magic_link_email_pending ON auth_magic_link_tokens(email) WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent  TEXT,
  ip_address  TEXT
);

-- Index for fast session lookup on every authenticated request
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON auth_sessions(token_hash);
-- Index for cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON auth_sessions(expires_at);
` as const;

// ─── Postgres Implementation ──────────────────────────────────────────────────

/**
 * Concrete IAuthDb implementation using postgres.js.
 * O6: DB_URL from env. Never hardcoded.
 * O3: Statement timeout set at connection level (30s max per LA operations.json).
 */
export function createAuthDb(sql: PostgresClient): IAuthDb {
  return {
    // ── Users ────────────────────────────────────────────────────────────────

    async upsertUser(email: string): Promise<UpsertUserResult> {
      try {
        // Atomic upsert — no race condition on concurrent registrations
        const rows = await sql`
          INSERT INTO auth_users (email)
          VALUES (${email})
          ON CONFLICT (email) DO UPDATE
            SET email = EXCLUDED.email  -- no-op update to get the row back
          RETURNING *, (xmax = 0) AS is_new
        `;

        if (rows.length === 0) {
          return { success: false, error: AuthErrors.dbError('upsertUser', 'no row returned'), isNew: false };
        }

        const row = rows[0];
        const user: AuthUser = {
          id: row.id,
          email: row.email,
          createdAt: row.created_at,
          lastLoginAt: row.last_login_at,
        };

        return { success: true, data: user, isNew: row.is_new };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('upsertUser', err), isNew: false };
      }
    },

    async findUserById(id: string): Promise<AuthResult<AuthUser>> {
      try {
        const rows = await sql`
          SELECT * FROM auth_users WHERE id = ${id} LIMIT 1
        `;
        if (rows.length === 0) {
          return { success: false, error: AuthErrors.userNotFound() };
        }
        const row = rows[0];
        return {
          success: true,
          data: { id: row.id, email: row.email, createdAt: row.created_at, lastLoginAt: row.last_login_at },
        };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('findUserById', err) };
      }
    },

    async findUserByEmail(email: string): Promise<AuthResult<AuthUser>> {
      try {
        const rows = await sql`
          SELECT * FROM auth_users WHERE email = ${email} LIMIT 1
        `;
        if (rows.length === 0) {
          return { success: false, error: AuthErrors.userNotFound(email) };
        }
        const row = rows[0];
        return {
          success: true,
          data: { id: row.id, email: row.email, createdAt: row.created_at, lastLoginAt: row.last_login_at },
        };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('findUserByEmail', err) };
      }
    },

    async updateLastLogin(userId: string): Promise<void> {
      // Fire and forget — failure here is non-blocking (observability concern, not auth concern)
      try {
        await sql`
          UPDATE auth_users SET last_login_at = now() WHERE id = ${userId}
        `;
      } catch {
        // Logged at R2 level if needed, not blocking auth flow
      }
    },

    // ── Magic Link Tokens ────────────────────────────────────────────────────

    async createMagicLinkToken(
      userId: string,
      email: string,
      expiresAt: Date
    ): Promise<AuthResult<{ rawToken: string }>> {
      try {
        const rawToken = generateRawToken();
        const tokenHash = hashToken(rawToken);

        await sql`
          INSERT INTO auth_magic_link_tokens (user_id, email, token_hash, expires_at)
          VALUES (${userId}, ${email}, ${tokenHash}, ${expiresAt})
        `;

        return { success: true, data: { rawToken } };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('createMagicLinkToken', err) };
      }
    },

    async findMagicLinkToken(rawToken: string, email: string): Promise<AuthResult<MagicLinkToken>> {
      try {
        const tokenHash = hashToken(rawToken);

        const rows = await sql`
          SELECT * FROM auth_magic_link_tokens
          WHERE token_hash = ${tokenHash}
            AND email = ${email}
          LIMIT 1
        `;

        if (rows.length === 0) {
          return { success: false, error: AuthErrors.tokenInvalid('not found') };
        }

        const row = rows[0];
        return {
          success: true,
          data: {
            id: row.id,
            userId: row.user_id,
            email: row.email,
            tokenHash: row.token_hash,
            expiresAt: row.expires_at,
            usedAt: row.used_at,
            createdAt: row.created_at,
          },
        };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('findMagicLinkToken', err) };
      }
    },

    async markTokenUsed(tokenId: string): Promise<void> {
      try {
        await sql`
          UPDATE auth_magic_link_tokens
          SET used_at = now()
          WHERE id = ${tokenId} AND used_at IS NULL
        `;
      } catch (err) {
        // Non-blocking but should be observed
        console.error(JSON.stringify({ level: 'error', event: 'auth.token.mark-used-failed', tokenId, cause: String(err) }));
      }
    },

    async invalidatePendingTokens(email: string): Promise<void> {
      try {
        // Soft invalidate by marking as used (preserves audit trail — O7)
        await sql`
          UPDATE auth_magic_link_tokens
          SET used_at = now()
          WHERE email = ${email}
            AND used_at IS NULL
            AND expires_at > now()
        `;
      } catch {
        // Non-blocking
      }
    },

    // ── Sessions ─────────────────────────────────────────────────────────────

    async createSession(
      userId: string,
      expiresAt: Date,
      meta?: { userAgent?: string; ipAddress?: string }
    ): Promise<AuthResult<Session>> {
      try {
        const rawToken = generateRawToken();
        const tokenHash = hashToken(rawToken);

        const rows = await sql`
          INSERT INTO auth_sessions (user_id, token_hash, expires_at, user_agent, ip_address)
          VALUES (
            ${userId},
            ${tokenHash},
            ${expiresAt},
            ${meta?.userAgent ?? null},
            ${meta?.ipAddress ?? null}
          )
          RETURNING *
        `;

        const row = rows[0];

        // Return session with rawToken embedded for cookie setting
        // After this point raw token exists ONLY in the cookie — never stored
        const session: Session & { rawToken?: string } = {
          id: row.id,
          userId: row.user_id,
          tokenHash: rawToken, // intentional: R3 needs raw token to set cookie
          expiresAt: row.expires_at,
          createdAt: row.created_at,
          userAgent: row.user_agent,
          ipAddress: row.ip_address,
        };

        return { success: true, data: session };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('createSession', err) };
      }
    },

    async findSession(rawSessionToken: string): Promise<AuthResult<Session>> {
      try {
        const tokenHash = hashToken(rawSessionToken);

        const rows = await sql`
          SELECT * FROM auth_sessions
          WHERE token_hash = ${tokenHash}
            AND expires_at > now()
          LIMIT 1
        `;

        if (rows.length === 0) {
          return { success: false, error: AuthErrors.sessionNotFound() };
        }

        const row = rows[0];
        return {
          success: true,
          data: {
            id: row.id,
            userId: row.user_id,
            tokenHash: row.token_hash,
            expiresAt: row.expires_at,
            createdAt: row.created_at,
            userAgent: row.user_agent,
            ipAddress: row.ip_address,
          },
        };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('findSession', err) };
      }
    },

    async deleteSession(sessionId: string): Promise<AuthResult<void>> {
      try {
        await sql`
          DELETE FROM auth_sessions WHERE id = ${sessionId}
        `;
        return { success: true, data: undefined };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('deleteSession', err) };
      }
    },

    async refreshSession(sessionId: string, newExpiresAt: Date): Promise<void> {
      try {
        await sql`
          UPDATE auth_sessions
          SET expires_at = ${newExpiresAt}
          WHERE id = ${sessionId}
        `;
      } catch {
        // Non-blocking — old expiry still valid
      }
    },
  };
}

// ─── Type stub for postgres.js client (real type comes from 'postgres' package) ─

type PostgresClient = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]>;
};
