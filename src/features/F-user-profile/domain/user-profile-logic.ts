// @liv-standard v1.0
// [F-user-profile/domain/user-profile-logic.ts]
// Built with LIV · livai.dev
// R1: pure functions, no I/O, depends R0 only.
// A7: removed githubLogin + avatarUrl — fields had no schema backing and no active use.
// Will be re-introduced when F-git-connector is built.

import { UserProfile, USER_PROFILE_DEFAULTS } from '../config/user-profile-config'

// ── Build ─────────────────────────────────────────────────────────────────────

export function buildProfile(
  userId: string,
  email: string | null,
): UserProfile {
  const now = Date.now()
  return {
    userId,
    displayName:      null,   // null until user sets manually
    email,
    preferredModelId: USER_PROFILE_DEFAULTS.preferredModelId,
    createdAt:        now,
    updatedAt:        now,
  }
}

// ── Updates (all return new object — R1: no mutation) ─────────────────────────

export function updatePreferredModel(profile: UserProfile, modelId: string): UserProfile {
  return { ...profile, preferredModelId: modelId, updatedAt: Date.now() }
}

export function updateDisplayName(profile: UserProfile, displayName: string): UserProfile {
  return { ...profile, displayName: displayName.trim() || null, updatedAt: Date.now() }
}

// ── Display ───────────────────────────────────────────────────────────────────

export function getDisplayHandle(profile: UserProfile): string {
  return profile.displayName ?? profile.email?.split('@')[0] ?? profile.userId
}
