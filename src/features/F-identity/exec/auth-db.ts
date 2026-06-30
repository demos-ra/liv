// @liv-standard v1.3
// [F-identity/R4]
// Built with LIV · livai.dev
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

export type FindOrCreateUserResult = AuthResult<AuthUser & { isNew: boolean }>

export interface CreateTokenResult {
  success: true;
  data: { rawToken: string; tokenRecord: MagicLinkToken };
}

// Reconcile (alias-trust pass) — the proven-link append payload. canonicalUserId and
// aliasUserId are both auth_users ids; sourceChannel + verifiedProvenance record the in-call
// proof that authorized the link (audit provenance, never a read-authority input).
export interface AliasAppend {
  canonicalUserId: string;
  aliasUserId: string;
  sourceChannel: string;
  verifiedProvenance: string;
}

export interface IAuthDb {
  findOrCreateUserByEmail(email: string): Promise<FindOrCreateUserResult>;
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

  // #9 Task E: Cleanup expired/used magic link tokens (A4 — I/O at R4 only)
  cleanupExpiredTokens(): Promise<AuthResult<{ deletedCount: number }>>;

  // ── Identity aliases (reconcile — append-only join; DORMANT, no caller this pass) ──
  // appendAlias links a principal to a canonical root (proven in-call by a verifier adapter);
  // aliasPrincipalSet resolves a reader to its principal-set for the read-fold (user_id = ANY).
  appendAlias(input: AliasAppend): Promise<AuthResult<void>>;
  aliasPrincipalSet(reader: string): Promise<AuthResult<string[]>>;
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


// ─── Row Type Interfaces (Amendment 1: W-INJECT boundary — DB→domain cast explicit) ──

interface UserRow {
  id: string
  email: string
  created_at: Date
  last_login_at: Date | null
  is_new?: boolean
}

interface MagicLinkTokenRow {
  id: string
  user_id: string
  email: string
  token_hash: string
  expires_at: Date
  used_at: Date | null
  created_at: Date
}

interface SessionRow {
  id: string
  user_id: string
  token_hash: string
  expires_at: Date
  created_at: Date
  user_agent: string | null
  ip_address: string | null
}

// ─── Postgres Implementation ──────────────────────────────────────────────────

/**
 * Concrete IAuthDb implementation using postgres.js.
 * O6: DB_URL from env. Never hardcoded.
 * O3: Statement timeout set at connection level (30s max per LA operations.json).
 */
export function createAuthDb(sql: PostgresClient): IAuthDb {
  return {
    // ── Users ────────────────────────────────────────────────────────────────

    // findOrCreateUserByEmail — STAY resolution (reconcile): a PROVEN email resolves to its
    // canonical auth_users row, or creates one. The merge primitive (ON CONFLICT DO UPDATE) is
    // RETIRED — this never overwrites an existing row. Proof-gating lives upstream (the verified-
    // resolution workflow); this is pure resolution. Find-first; on a not-found, insert with
    // ON CONFLICT (email) DO NOTHING — race-safety ONLY (a concurrent insert of the same new
    // email), not a merge: a lost race re-selects the row another caller created.
    async findOrCreateUserByEmail(email: string): Promise<FindOrCreateUserResult> {
      const toUser = (row: UserRow, isNew: boolean) => ({
        success: true as const,
        data: { id: row.id, email: row.email, createdAt: row.created_at, lastLoginAt: row.last_login_at, isNew },
      });
      try {
        const existing = await sql<UserRow>`
          SELECT * FROM auth_users WHERE email = ${email} LIMIT 1
        `;
        if (existing.length > 0) return toUser(existing[0], false);

        const inserted = await sql<UserRow>`
          INSERT INTO auth_users (email)
          VALUES (${email})
          ON CONFLICT (email) DO NOTHING
          RETURNING *
        `;
        if (inserted.length > 0) return toUser(inserted[0], true);

        // Lost the insert race — the row exists now; resolve it (another caller created it).
        const raced = await sql<UserRow>`
          SELECT * FROM auth_users WHERE email = ${email} LIMIT 1
        `;
        if (raced.length === 0) {
          return { success: false, error: AuthErrors.dbError('findOrCreateUserByEmail', 'no row after conflict') };
        }
        return toUser(raced[0], false);
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('findOrCreateUserByEmail', err) };
      }
    },

    async findUserById(id: string): Promise<AuthResult<AuthUser>> {
      try {
        const rows = await sql<UserRow>`
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
        const rows = await sql<UserRow>`
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

    // ── Identity aliases (reconcile — append-only; DORMANT: no caller this pass) ───
    // appendAlias is INSERT-only (no update path). It roots the link before insert (flat star):
    // the incoming canonical is resolved to its OWN root via the COALESCE subquery, so the join
    // is never deeper than one union-find level. Re-appending an already-linked principal is
    // ON CONFLICT(alias_user_id) DO NOTHING — a no-op, never a provenance rewrite.

    async appendAlias(input: AliasAppend): Promise<AuthResult<void>> {
      try {
        await sql`
          INSERT INTO auth_user_aliases
            (canonical_user_id, alias_user_id, source_channel, verified_provenance)
          VALUES (
            COALESCE(
              (SELECT canonical_user_id FROM auth_user_aliases WHERE alias_user_id = ${input.canonicalUserId}),
              ${input.canonicalUserId}::uuid
            ),
            ${input.aliasUserId},
            ${input.sourceChannel},
            ${input.verifiedProvenance}
          )
          ON CONFLICT (alias_user_id) DO NOTHING
        `;
        return { success: true, data: undefined };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('appendAlias', err) };
      }
    },

    // aliasPrincipalSet — the read-fold's principal-set producer (resolve read). Returns the
    // reader's canonical root + every alias of that root (flat star, depth 1). An unlinked reader
    // → [reader]. The set feeds scopeClause's user_id = ANY($ids); it is DATA, the seam decides
    // the bound. Fail direction is narrow-to-self: never empty, never widened.

    async aliasPrincipalSet(reader: string): Promise<AuthResult<string[]>> {
      try {
        const rows = await sql<{ user_id: string }>`
          SELECT COALESCE(
                   (SELECT canonical_user_id FROM auth_user_aliases WHERE alias_user_id = ${reader}),
                   ${reader}::uuid
                 ) AS user_id
          UNION
          SELECT alias_user_id AS user_id
            FROM auth_user_aliases
           WHERE canonical_user_id = COALESCE(
                   (SELECT canonical_user_id FROM auth_user_aliases WHERE alias_user_id = ${reader}),
                   ${reader}::uuid
                 )
        `;
        const ids = rows.map(r => r.user_id);
        return { success: true, data: ids.length > 0 ? ids : [reader] };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('aliasPrincipalSet', err) };
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

        const rows = await sql<MagicLinkTokenRow>`
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

        const rows = await sql<SessionRow>`
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

        const rows = await sql<SessionRow>`
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

    // ── Token Cleanup (#9 Task E — A4: I/O at R4 only) ────────────────────────
    // Deletes expired/used magic link tokens older than 7 days.
    // Called at boot via scheduleTokenCleanup() (R2). Single-server, fire-and-forget.

    async cleanupExpiredTokens(): Promise<AuthResult<{ deletedCount: number }>> {
      try {
        const rows = await sql`
          DELETE FROM auth_magic_link_tokens
          WHERE (used_at IS NOT NULL AND used_at < now() - interval '7 days')
             OR (expires_at < now() - interval '7 days')
          RETURNING id
        `;
        return { success: true, data: { deletedCount: rows.length } };
      } catch (err) {
        return { success: false, error: AuthErrors.dbError('cleanupExpiredTokens', err) };
      }
    },
  };
}

// ─── Type stub for postgres.js client (real type comes from 'postgres' package) ─
// Generic T allows typed row returns at each query site — removes all as unknown as casts.
// Amendment 1: DB→domain boundary typed at the wire, not patched at the consumer.

type PostgresClient = {
  <T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]>;
};
