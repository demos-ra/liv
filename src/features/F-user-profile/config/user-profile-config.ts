// @liv-standard v1.3
// [F-user-profile/R0]
// Built with LIV · livai.dev
// R0: pure config, zero dependencies.
// A6: UserProfile is the canonical type for this slice.
// Change from prior version: removed githubLogin + avatarUrl — no schema backing,
// no active use. Will be re-added when F-git-connector is built (A7: no dead fields).

export const USER_PROFILE_NAMESPACE = 'user_profile' as const

export type UserProfile = {
  userId:           string
  displayName:      string | null   // user-set, null until explicitly named
  email:            string | null   // from auth at sign-in
  preferredModelId: string | null   // vestigial (chain-b: preferred_provider is the stored fact); null-honest
  createdAt:        number          // epoch ms
  updatedAt:        number          // epoch ms
}

export const USER_PROFILE_DEFAULTS = {
  preferredModelId: 'claude-sonnet-4-6',
} as const

// ── Update input types ────────────────────────────────────────────────────────
// A3: typed boundaries — callers pass these, workflow validates, db persists

export type UpdateDisplayNameInput = {
  userId:      string
  displayName: string
}

export type UpdatePreferredModelInput = {
  userId:           string
  preferredModelId: string
}
