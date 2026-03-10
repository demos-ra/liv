// [F-user-profile/R1/C2] User profile domain logic
// R1: pure functions, no I/O, depends R0 only

import { UserProfile, USER_PROFILE_DEFAULTS } from '../config/user-profile-config'

export function buildProfile(userId: string, githubData: {
  login: string | null   // null for magic-link auth — GitHub enrichment happens later via F-git-connector
  avatarUrl: string | null
  email: string | null
}): UserProfile {
  const now = Date.now()
  return {
    userId,
    githubLogin: githubData.login,
    displayName: githubData.login, // null until GitHub connected or user sets manually
    avatarUrl: githubData.avatarUrl,
    email: githubData.email,
    preferredModelId: USER_PROFILE_DEFAULTS.preferredModelId,
    createdAt: now,
    updatedAt: now,
  }
}

export function updatePreferredModel(profile: UserProfile, modelId: string): UserProfile {
  return { ...profile, preferredModelId: modelId, updatedAt: Date.now() }
}

export function updateDisplayName(profile: UserProfile, displayName: string): UserProfile {
  return { ...profile, displayName: displayName.trim() || profile.githubLogin, updatedAt: Date.now() }
}

export function getDisplayHandle(profile: UserProfile): string {
  return profile.displayName ?? profile.githubLogin ?? profile.userId
}
