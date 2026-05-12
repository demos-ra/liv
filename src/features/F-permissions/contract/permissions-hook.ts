// @liv-standard v1.3
// [F-permissions/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R3
// wires-in:
//   W-FN    useNamespace          F-verify/R3 (registry-hook)
//   W-ATOM  PERMISSIONS_NAMESPACE F-permissions/R0 (permissions-config)
//   W-ATOM  Role, Action          F-permissions/R0 (permissions-config)
//   W-FN    can                   F-permissions/R1 (permissions-logic)
// wires-out:
//   W-FN    usePermissions  →  F-permissions/R3 (permissions-contract re-export), client components
//   W-FN    useCan          →  client components
// deps:
//   R0  ../config/permissions-config
//   R1  ../domain/permissions-logic
//   R3  @/features/F-verify/contract/registry-hook
// validated:  pending
// [F-permissions/R3/C2] usePermissions hook — reads from permissions:: namespace
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-verify/contract/registry-hook'
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
