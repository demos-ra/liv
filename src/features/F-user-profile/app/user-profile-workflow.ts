// @liv-standard v1.3
// [F-user-profile/R2]
// Built with LIV · livai.dev
// R2: orchestration, depends R0 + R1 + R4 only.
// A7: removed upsertProfileFromGithub — GitHub enrichment path deferred to F-git-connector.
// upsertProfileForUser is now the sole bootstrap entry point (magic link auth).
// amended: chain-b-provider-fact (resolveActiveProvider + savePreferredProvider added;
//          imports expanded to getPreferredProvider/setPreferredProvider/providersWithKeys/PROVIDER_ORDER)

import { buildProfile, updatePreferredModel, updateDisplayName } from '../domain/user-profile-logic'
import { persistProfile, updateProfile, getProfileByUserId, getPreferredProvider, setPreferredProvider as dbSetPreferredProvider } from '../exec/user-profile-db'
import { providersWithKeys } from '../exec/api-key-db'
import { PROVIDER_ORDER } from '../config/provider-keys-config'
import type { ProviderId } from '../config/provider-keys-config'

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

// ── Provider resolution (chain-b-provider-fact) ────────────────────────────────
// resolveActiveProvider: the single server-side source for which provider to use.
// Resolution order:
//   1. preferred_provider is set AND the wearer has a key for it → that provider.
//   2. Else: walk PROVIDER_ORDER, pick first that has a key → deterministic default.
//   3. Else → null (no key; caller routes to key-prompt).
// No model id anywhere in this function. Model is derived forward at the call site.
// No hardcoded provider literal — default follows the key, not a constant.

export async function resolveActiveProvider(userId: string): Promise<ProviderId | null> {
  // Step 1: check stored preference.
  const prefResult = await getPreferredProvider(userId)
  if (prefResult.ok && prefResult.data) {
    const stored = prefResult.data as ProviderId
    // Verify the wearer still has a key for the stored provider.
    const keysResult = await providersWithKeys(userId)
    if (keysResult.ok && keysResult.data.includes(stored)) {
      return stored
    }
    // Stored provider has no key — fall through to key-walk.
  }

  // Step 2: key-aware default — first provider in PROVIDER_ORDER with a key.
  const keysResult = await providersWithKeys(userId)
  if (!keysResult.ok) return null
  const withKeys = new Set(keysResult.data)
  for (const p of PROVIDER_ORDER) {
    if (withKeys.has(p)) return p
  }

  // Step 3: no keys at all.
  return null
}

// Write the wearer's provider selection to preferred_provider.
// Returns the ProfileResult from the DB layer for error surfacing at R3.
export async function savePreferredProvider(
  userId: string,
  provider: ProviderId,
): ReturnType<typeof dbSetPreferredProvider> {
  return dbSetPreferredProvider(userId, provider)
}
