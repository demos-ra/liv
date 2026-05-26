// @liv-standard v1.3
// [F-user-profile/exec/user-profile-db.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-corrective-2
// slice:      F-user-profile
// layer:      R4
// wires-in:
//   W-ATOM  UserProfile      ../config/user-profile-config
//   W-ATOM  ModelPreferences ../types/profile-types
// wires-out:
//   W-FN  persistProfile       →  F-user-profile/R2 (user-profile-workflow)
//   W-FN  updateProfile        →  F-user-profile/R2 (user-profile-workflow)
//   W-FN  getProfileByUserId   →  F-user-profile/R2 (user-profile-workflow)
//   W-FN  dbGetModelPreferences →  F-user-profile/R3 (user-profile-contract)
//   W-FN  dbSetModelPreferences →  F-user-profile/R3 (user-profile-contract)
// deps:
//   R0  ../config/user-profile-config
//   R0  ../types/profile-types
//   R5  @/core/db/client
// validated:  pending
//
// A4: all DB I/O here. No logic beyond row mapping.
// A7: removed github_login + avatar_url — no schema columns, no active use.
//
// step4b2-phase-d (A4, A6):
//   dbGetModelPreferences — reads user_profiles.model_preferences jsonb.
//   dbSetModelPreferences — writes user_profiles.model_preferences jsonb.
//   Null from DB → null return (caller uses default). Malformed jsonb → null (safe).
//   Axiom cite: A4 — I/O only. A6 — types imported from R0.

import { db } from '@/core/db/client'
import type { UserProfile } from '../config/user-profile-config'
import type { ModelPreferences } from '../types/profile-types'

// ── Write ─────────────────────────────────────────────────────────────────────

export async function persistProfile(profile: UserProfile): Promise<void> {
  await db.query(
    `INSERT INTO user_profiles (
      user_id, display_name, email, preferred_model_id, created_at, updated_at
    ) VALUES ($1, $2, $3, $4,
      to_timestamp($5 / 1000.0),
      to_timestamp($6 / 1000.0))
    ON CONFLICT (user_id) DO NOTHING`,
    [
      profile.userId,
      profile.displayName,
      profile.email,
      profile.preferredModelId,
      profile.createdAt,
      profile.updatedAt,
    ]
  )
}

export async function updateProfile(profile: UserProfile): Promise<void> {
  await db.query(
    `UPDATE user_profiles SET
      display_name       = $2,
      email              = $3,
      preferred_model_id = $4,
      updated_at         = to_timestamp($5 / 1000.0)
     WHERE user_id = $1`,
    [
      profile.userId,
      profile.displayName,
      profile.email,
      profile.preferredModelId,
      profile.updatedAt,
    ]
  )
}

// ── Read ──────────────────────────────────────────────────────────────────────

type UserProfileRow = {
  user_id:           string
  display_name:      string | null
  email:             string | null
  preferred_model_id: string | null
  created_at:        string
  updated_at:        string
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  const result = await db.query<UserProfileRow>(
    `SELECT * FROM user_profiles WHERE user_id = $1`,
    [userId]
  )
  if (!result.rows[0]) return null
  const r = result.rows[0]
  return {
    userId:           r.user_id,
    displayName:      r.display_name,
    email:            r.email,
    // A3: null coerced to default at DB boundary — never propagate null for modelId
    preferredModelId: r.preferred_model_id ?? 'claude-sonnet-4-6',
    createdAt:        Number(new Date(r.created_at)),
    updatedAt:        Number(new Date(r.updated_at)),
  }
}

// ── AK-RES — Result type for R4 boundary (step4b2-corrective-2) ──────────────
// Declared here for the two Phase D functions. Matches PlannerResult<T> shape.
// Pre-existing functions in this file are pre-standard debt — not touched.
type ProfileResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

// ── dbGetModelPreferences (step4b2-phase-d, corrective-2: Result<T>) ──────────
// Reads user_profiles.model_preferences jsonb.
// Returns null if column is null or if value cannot be parsed (safe degradation).
// Returns ProfileResult so callers can distinguish DB error from null preference.

export async function dbGetModelPreferences(
  userId: string
): Promise<ProfileResult<ModelPreferences | null>> {
  try {
    const result = await db.query<{ model_preferences: unknown }>(
      `SELECT model_preferences FROM user_profiles WHERE user_id = $1`,
      [userId]
    )
    if (!result.rows[0]) return { ok: true, data: null }

    const raw = result.rows[0].model_preferences
    if (!raw) return { ok: true, data: null }

    const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as ModelPreferences
    return { ok: true, data: parsed ?? null }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to get model preferences', context: { cause: String(e) } } }
  }
}

// ── dbSetModelPreferences (step4b2-phase-d, corrective-2: Result<T>) ──────────
// Writes user_profiles.model_preferences jsonb.
// Caller (R3) is responsible for validating provider/model integrity before write.

export async function dbSetModelPreferences(
  userId: string,
  prefs:  ModelPreferences
): Promise<ProfileResult<void>> {
  try {
    await db.query(
      `UPDATE user_profiles
       SET model_preferences = $2::jsonb,
           updated_at        = now()
       WHERE user_id = $1`,
      [userId, JSON.stringify(prefs)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to set model preferences', context: { cause: String(e) } } }
  }
}
