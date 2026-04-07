// @liv-standard v1.3
// [F-permissions/R3]
// Built with LIV · livai.dev
// [F-permissions/R3/C2] usePermissions hook — reads from permissions:: namespace
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { PERMISSIONS_NAMESPACE, Role, Action } from '../config/permissions-config'
import { can } from '../domain/permissions-logic'

export type PermissionsState = {
  projectId: string | null
  role: Role | null
}

const INITIAL_STATE: PermissionsState = {
  projectId: null,
  role: null,
}

export function usePermissions(): PermissionsState {
  return useNamespace<PermissionsState>(PERMISSIONS_NAMESPACE) ?? INITIAL_STATE
}

export function useCan(action: Action): boolean {
  const { role } = usePermissions()
  if (!role) return false
  return can(role, action)
}
