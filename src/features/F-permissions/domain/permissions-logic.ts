// @liv-standard v1.3
// [F-permissions/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R1
// wires-in:
//   W-ATOM  Role, Action, PERMISSION_MATRIX  F-permissions/R0 (permissions-config)
// wires-out:
//   W-FN    can, canAll, canAny, assertPermission, isOwner  →  F-permissions/R2 (permissions-workflow)
//   W-FN    can                                              →  F-permissions/R3 (permissions-hook)
//   W-ATOM  PermissionContext                                →  F-permissions/R2
//   W-ATOM  PermissionDeniedError                           →  F-permissions/R2
// deps:
//   R0  ../config/permissions-config
// validated:  pending
// [F-permissions/R1/C2] Permission domain logic
// R1: pure functions, no I/O, depends R0 only

import { Role, Action, PERMISSION_MATRIX } from '../config/permissions-config'

export type PermissionContext = {
  userId: string
  projectId: string
  role: Role
}

// --- Core check ---

export function can(role: Role, action: Action): boolean {
  return PERMISSION_MATRIX[role]?.includes(action) ?? false
}

export function canAll(role: Role, actions: Action[]): boolean {
  return actions.every((action) => can(role, action))
}

export function canAny(role: Role, actions: Action[]): boolean {
  return actions.some((action) => can(role, action))
}

// --- Context-based check ---

export function assertPermission(ctx: PermissionContext, action: Action): void {
  if (!can(ctx.role, action)) {
    throw new PermissionDeniedError(ctx.userId, action, ctx.projectId)
  }
}

// --- Structured error ---

export class PermissionDeniedError extends Error {
  readonly userId: string
  readonly action: Action
  readonly projectId: string

  constructor(userId: string, action: Action, projectId: string) {
    super(`Permission denied: user ${userId} cannot perform ${action} on project ${projectId}`)
    this.name = 'PermissionDeniedError'
    this.userId = userId
    this.action = action
    this.projectId = projectId
  }
}

// --- Role resolution helpers ---

export function isOwner(role: Role): boolean {
  return role === 'owner'
}

export function canWrite(role: Role): boolean {
  return can(role, 'constitution_write') || can(role, 'project_update')
}
