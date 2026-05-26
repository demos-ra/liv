// @liv-standard v1.3
// [F-user-profile/R2]
// Built with LIV · livai.dev
// R2: orchestration, depends R0 + R1 + R4 only.
// A7: removed upsertProfileFromGithub — GitHub enrichment path deferred to F-git-connector.
// upsertProfileForUser is now the sole bootstrap entry point (magic link auth).

import { buildProfile, updatePreferredModel, updateDisplayName } from '../domain/user-profile-logic'
import { persistProfile, updateProfile, getProfileByUserId } from '../exec/user-profile-db'

// ── Bootstrap — called by event-subscriptions on identity.user-authenticated ─

export async function upsertProfileForUser(
  userId: string,
  email: string | null,
): Promise<void> {
  const existing = await getProfileByUserId(userId)
  if (existing) return  // profile already exists — preserve all user preferences
  await persistProfile(buildProfile(userId, email))
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function loadProfile(userId: string) {
  return getProfileByUserId(userId)
}

// ── Updates ───────────────────────────────────────────────────────────────────

export async function setPreferredModel(userId: string, modelId: string): Promise<void> {
  const profile = await getProfileByUserId(userId)
  if (!profile) return
  await updateProfile(updatePreferredModel(profile, modelId))
}

export async function setDisplayName(userId: string, displayName: string): Promise<void> {
  const profile = await getProfileByUserId(userId)
  if (!profile) return
  await updateProfile(updateDisplayName(profile, displayName))
}
