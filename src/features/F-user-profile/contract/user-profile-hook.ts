// @liv-standard v1.3
// [F-user-profile/R3]
// Built with LIV · livai.dev
// [F-user-profile/R3/C2] useUserProfile hook
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { USER_PROFILE_NAMESPACE, UserProfile } from '../config/user-profile-config'
import { getDisplayHandle } from '../domain/user-profile-logic'

export function useUserProfile(): UserProfile | null {
  return useNamespace<UserProfile>(USER_PROFILE_NAMESPACE) ?? null
}

export function useDisplayHandle(): string {
  const profile = useUserProfile()
  if (!profile) return ''
  return getDisplayHandle(profile)
}

export function usePreferredModel(): string {
  return useUserProfile()?.preferredModelId ?? 'claude-sonnet-4-6'
}
