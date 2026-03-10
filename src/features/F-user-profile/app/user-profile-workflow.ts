// [F-user-profile/R2/C2] User profile workflow
// R2: orchestration, depends R0 + R1 + R4

import { buildProfile, updatePreferredModel, updateDisplayName } from '../domain/user-profile-logic'
import { persistProfile, updateProfile, getProfileByUserId } from '../exec/user-profile-db'

export async function upsertProfileFromGithub(
  userId: string,
  githubData: { login: string; avatarUrl: string | null; email: string | null }
): Promise<void> {
  const existing = await getProfileByUserId(userId)
  if (existing) {
    // Only update github fields on re-login, preserve user preferences
    await updateProfile({
      ...existing,
      githubLogin: githubData.login,
      avatarUrl: githubData.avatarUrl,
      email: githubData.email,
    })
    return
  }
  await persistProfile(buildProfile(userId, githubData))
}

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

export async function loadProfile(userId: string) {
  return getProfileByUserId(userId)
}

// ─── Magic link auth profile bootstrap ───────────────────────────────────────
// Called by Phase 4 event-subscriptions on identity.user-signed-in.
// Auth method is magic link — no GitHub data at sign-in time.
// GitHub profile enrichment happens later via F-git-connector if user connects a repo.

export async function upsertProfileForUser(userId: string, email: string | null): Promise<void> {
  // Magic link auth: no GitHub data at sign-in. login/avatar null until F-git-connector enriches.
  await upsertProfileFromGithub(userId, {
    login: null as unknown as string, // Amendment 1: githubLogin is string|null in UserProfile — cast at boundary
    avatarUrl: null,
    email,
  })
}
