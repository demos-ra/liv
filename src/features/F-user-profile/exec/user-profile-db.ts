// [F-user-profile/R4/C2] User profile database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { UserProfile } from '../config/user-profile-config'

export async function persistProfile(profile: UserProfile): Promise<void> {
  await db.query(
    `INSERT INTO user_profiles (
      user_id, github_login, display_name, avatar_url, email,
      preferred_model_id, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,
      to_timestamp($7 / 1000.0),
      to_timestamp($8 / 1000.0))`,
    [
      profile.userId, profile.githubLogin, profile.displayName,
      profile.avatarUrl, profile.email, profile.preferredModelId,
      profile.createdAt, profile.updatedAt,
    ]
  )
}

export async function updateProfile(profile: UserProfile): Promise<void> {
  await db.query(
    `UPDATE user_profiles SET
      github_login = $2, display_name = $3, avatar_url = $4,
      email = $5, preferred_model_id = $6,
      updated_at = to_timestamp($7 / 1000.0)
     WHERE user_id = $1`,
    [
      profile.userId, profile.githubLogin, profile.displayName,
      profile.avatarUrl, profile.email, profile.preferredModelId,
      profile.updatedAt,
    ]
  )
}

type UserProfileRow = {
  user_id: string
  github_login: string | null
  display_name: string | null
  avatar_url: string | null
  email: string | null
  preferred_model_id: string | null
  created_at: string
  updated_at: string
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  const result = await db.query<UserProfileRow>(
    `SELECT * FROM user_profiles WHERE user_id = $1`,
    [userId]
  )
  if (!result.rows[0]) return null
  const r = result.rows[0]
  return {
    userId: r.user_id,
    githubLogin: r.github_login,
    displayName: r.display_name,
    avatarUrl: r.avatar_url,
    email: r.email,
    preferredModelId: r.preferred_model_id ?? 'claude-sonnet-4-6', // Amendment 1: null→default at DB boundary
    createdAt: Number(new Date(r.created_at)),
    updatedAt: Number(new Date(r.updated_at)),
  }
}
