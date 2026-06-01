// @liv-standard v1.3
// [F-user-profile/R4]
// Built with LIV · livai.dev
// R4: I/O only, depends R0 only.
// A1: F-user-profile is sole owner of user_api_keys table.
// A4: all encryption/decryption happens here — never leaks raw key outside this file.
// Modular: swap encryption algorithm by changing encryptKey/decryptKey only.
// Schema: user_api_keys (user_id, provider, encrypted_key) — PK: (user_id, provider)
// amended: chain-b-provider-fact (providersWithKeys added — all providers with a stored
//          key for a user; used by resolveActiveProvider for key-aware default resolution)

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { db } from '@/core/db/client'
import type { Result } from '@/core/types/primitives'
import type { ProviderId } from '../config/provider-keys-config'

// ── Encryption ────────────────────────────────────────────────────────────────
// AES-256-GCM. Key from API_KEY_ENCRYPTION_SECRET env (32 bytes hex).
// Stored format: base64(iv):base64(authTag):base64(ciphertext)
// A6: encryption constant declared here at R4 boundary — never in config (security boundary).

const ALGORITHM = 'aes-256-gcm' as const
const IV_BYTES  = 12  // 96-bit IV — GCM standard

function getEncryptionKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('[api-key-db] API_KEY_ENCRYPTION_SECRET must be set (min 32 chars)')
  }
  // Derive 32-byte key from secret — supports both hex (64 chars) and raw (32+ chars)
  return secret.length === 64
    ? Buffer.from(secret, 'hex')
    : Buffer.from(secret.slice(0, 32), 'utf8')
}

function encryptKey(plaintext: string): string {
  const iv     = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const ct     = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag    = cipher.getAuthTag()
  return [
    iv.toString('base64'),
    tag.toString('base64'),
    ct.toString('base64'),
  ].join(':')
}

function decryptKey(stored: string): string {
  const [ivB64, tagB64, ctB64] = stored.split(':')
  if (!ivB64 || !tagB64 || !ctB64) throw new Error('[api-key-db] malformed stored key')
  const iv       = Buffer.from(ivB64, 'base64')
  const tag      = Buffer.from(tagB64, 'base64')
  const ct       = Buffer.from(ctB64, 'base64')
  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv)
  decipher.setAuthTag(tag)
  return decipher.update(ct).toString('utf8') + decipher.final('utf8')
}

// ── DB I/O ────────────────────────────────────────────────────────────────────

export async function getApiKey(
  userId: string,
  provider: ProviderId,
): Promise<Result<string | null>> {
  try {
    const result = await db.query<{ encrypted_key: string }>(
      `SELECT encrypted_key FROM user_api_keys WHERE user_id = $1 AND provider = $2`,
      [userId, provider]
    )
    const row = result.rows[0]
    if (!row) return { ok: true, data: null }
    try {
      return { ok: true, data: decryptKey(row.encrypted_key) }
    } catch {
      // Decryption failure — key is corrupt or encryption secret rotated
      // Return null so caller falls back to env. Log but do not throw.
      console.error('[api-key-db] decryption failed', { userId, provider })
      return { ok: true, data: null }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'USER_PROFILE_DB_QUERY_FAILED', message } }
  }
}

export async function setApiKey(
  userId: string,
  provider: ProviderId,
  plainKey: string,
): Promise<Result<void>> {
  try {
    const encrypted = encryptKey(plainKey)
    await db.query(
      `INSERT INTO user_api_keys (user_id, provider, encrypted_key, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, provider)
       DO UPDATE SET encrypted_key = $3, updated_at = now()`,
      [userId, provider, encrypted]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'USER_PROFILE_DB_WRITE_FAILED', message } }
  }
}

export async function deleteApiKey(
  userId: string,
  provider: ProviderId,
): Promise<Result<void>> {
  try {
    await db.query(
      `DELETE FROM user_api_keys WHERE user_id = $1 AND provider = $2`,
      [userId, provider]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'USER_PROFILE_DB_DELETE_FAILED', message } }
  }
}

// ── Key presence check (no decryption — for UI "is key set?" check) ───────────

export async function hasApiKey(
  userId: string,
  provider: ProviderId,
): Promise<Result<boolean>> {
  try {
    const result = await db.query<{ exists: boolean }>(
      `SELECT EXISTS(
        SELECT 1 FROM user_api_keys WHERE user_id = $1 AND provider = $2
      ) AS exists`,
      [userId, provider]
    )
    return { ok: true, data: result.rows[0]?.exists ?? false }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'USER_PROFILE_DB_QUERY_FAILED', message } }
  }
}

// ── All providers with a stored key for this user ─────────────────────────────
// Returns the list of ProviderId values for which the wearer has a key stored.
// Used by resolveActiveProvider to pick the key-aware default without decrypting.
// Order is DB order (non-deterministic) — caller applies PROVIDER_ORDER for
// deterministic selection.

export async function providersWithKeys(
  userId: string,
): Promise<Result<ProviderId[]>> {
  try {
    const result = await db.query<{ provider: string }>(
      `SELECT provider FROM user_api_keys WHERE user_id = $1`,
      [userId]
    )
    return { ok: true, data: result.rows.map(r => r.provider as ProviderId) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'USER_PROFILE_DB_QUERY_FAILED', message } }
  }
}
