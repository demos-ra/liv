// @liv-standard v1.3
// [F-permissions/R2]
// Built with LIV · livai.dev
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
// Called by event-subscriptions.ts on identity.user-signed-in
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
  await dbSetMemberRole(userId, projectId, role)
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
  const role = await getMemberRole(userId, projectId)

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
