// @liv-standard v1.3
// [F-permissions/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R2
// wires-in:
//   W-ATOM  Role, Action, ROLES, PERMISSIONS_NAMESPACE  F-permissions/R0 (permissions-config)
//   W-FN    can, assertPermission, PermissionContext     F-permissions/R1 (permissions-logic)
//   W-FN    getMemberRole, setMemberRole                 F-permissions/R4 (permissions-db)
//   W-FN    emitEvent                                    F-event-system/R3 (event-bus)
//   W-ATOM  EVENTS                                       F-event-system/R0 (event-schema)
// wires-out:
//   W-FN    assignDefaultRole  →  F-permissions/R3 (permissions-contract)
//   W-FN    setMemberRole      →  F-permissions/R3 (permissions-contract)
//   W-FN    resolveAndCheck    →  F-permissions/R3 (permissions-contract)
// deps:
//   R0  ../config/permissions-config
//   R1  ../domain/permissions-logic
//   R4  ../exec/permissions-db
//   R3  @/features/F-event-system/contract/event-bus
//   R0  @/features/F-event-system/config/event-schema
// validated:  pending
// [F-permissions/R2/C3] Permission resolution workflow
// commit: add assignDefaultRole + setMemberRole for event-subscriptions
//
// R2: orchestration, depends R0 + R1 + R4

import { Role, Action, ROLES, PERMISSIONS_NAMESPACE } from '../config/permissions-config'
import { can, assertPermission, PermissionContext } from '../domain/permissions-logic'
import { getMemberRole, setMemberRole as dbSetMemberRole } from '../exec/permissions-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

// ─── Event-subscription hooks ─────────────────────────────────────────────────
// Called by event-subscriptions.ts on identity.user-authenticated
// and project.project-created events.

export async function assignDefaultRole(userId: string): Promise<void> {
  // Default role is granted at the system level (not project-scoped).
  // Emits permissions-loaded so downstream slices know the user is active.
  await emitEvent({
    type: EVENTS.PERMISSIONS.PERMISSIONS_LOADED,
    payload: { userId, role: ROLES.viewer, scope: 'system' },
  })
}

export async function setMemberRole(
  userId: string,
  projectId: string,
  role: Role
): Promise<void> {
  const result = await dbSetMemberRole(userId, projectId, role)
  if (!result.ok) throw new Error(result.error.message)
  await emitEvent({
    type: EVENTS.PERMISSIONS.PERMISSIONS_LOADED,
    payload: { userId, projectId, role },
  })
}

// ─── Core permission functions ────────────────────────────────────────────────

export async function resolveAndCheck(
  userId: string,
  projectId: string,
  action: Action
): Promise<{ allowed: boolean; role: Role | null }> {
  const roleResult = await getMemberRole(userId, projectId)
  if (!roleResult.ok) throw new Error(roleResult.error.message)
  const role = roleResult.data

  if (!role) {
    await emitEvent({
      type: EVENTS.PERMISSIONS.ACCESS_DENIED,
      payload: { userId, projectId, action, reason: 'no_role' },
    })
    return { allowed: false, role: null }
  }

  const allowed = can(role, action)

  if (!allowed) {
    await emitEvent({
      type: EVENTS.PERMISSIONS.ACCESS_DENIED,
      payload: { userId, projectId, action, reason: 'insufficient_role', role },
    })
  } else {
    await emitEvent({
      type: EVENTS.PERMISSIONS.PERMISSIONS_LOADED,
      payload: { userId, projectId, action, role },
    })
  }

  return { allowed, role }
}

export async function requirePermission(
  userId: string,
  projectId: string,
  action: Action
): Promise<PermissionContext> {
  const { allowed, role } = await resolveAndCheck(userId, projectId, action)

  if (!allowed || !role) {
    throw new Error(`PermissionDenied: ${userId} / ${action} / ${projectId}`)
  }

  return { userId, projectId, role }
}


// ── enforceSubstrateReadScope (sprint-12-shot-3) ──────────────────────────────
// Throws PermissionDeniedError if requestedUserId !== callerUserId.
// Called at threadQuery callsites when the read scope is a userId scope.
// D7 discrimination: callsites determine scope kind. When scope is a userId
// (user-scoped read), callers pass callerUserId explicitly. When scope is a
// projectId (project-scoped read), callers do not call this gate — project
// scopes are caller-managed per LM v3.2 §3.9 TQ3. Pure comparison, no DB.

export function enforceSubstrateReadScope(
  callerUserId:   string,
  requestedUserId: string,
): void {
  if (requestedUserId !== callerUserId) {
    throw new Error(
      `PermissionDenied: substrate read scope mismatch — caller ${callerUserId} cannot read scope ${requestedUserId}`
    )
  }
}
