// @liv-standard v1.0
// [F-user-profile/exec/user-profile-db.ts]
// Built with LIV · livai.dev
// R4: I/O only, depends R0 only.
// A7: removed github_login + avatar_url — no schema columns, no active use.

import { db } from '@/core/db/client'
import type { UserProfile } from '../config/user-profile-config'

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
