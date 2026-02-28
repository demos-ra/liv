// [F-user-profile/R0/C2] User profile configuration and types
// R0: pure config, zero dependencies

export const USER_PROFILE_NAMESPACE = 'user_profile' as const

export type UserProfile = {
  userId: string
  githubLogin: string | null
  displayName: string | null
  avatarUrl: string | null
  email: string | null
  preferredModelId: string
  createdAt: number
  updatedAt: number
}

export const USER_PROFILE_DEFAULTS = {
  preferredModelId: 'claude-sonnet-4-6',
} as const
