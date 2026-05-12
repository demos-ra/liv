// @liv-standard v1.3
// [F-permissions/R4]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R4
// wires-in:
//   W-FN    db    core/db/client
//   W-ATOM  Role  F-permissions/R0 (permissions-config)
// wires-out:
//   W-FN    getMemberRole, setMemberRole, removeMember, getProjectMembers  →  F-permissions/R2 (permissions-workflow)
// deps:
//   R0  ../config/permissions-config
//   R5  @/core/db/client
// validated:  pending
// [F-permissions/R4/C2] Permissions database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import type { Result } from '@/core/types/primitives'
import { Role } from '../config/permissions-config'

export async function getMemberRole(userId: string, projectId: string): Promise<Result<Role | null>> {
  try {
    const result = await db.query<{ role: Role }>(
      `SELECT role FROM project_members WHERE user_id = $1 AND project_id = $2`,
      [userId, projectId]
    )
    return { ok: true, data: result.rows[0]?.role ?? null }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'PERMISSIONS_DB_QUERY_FAILED', message } }
  }
}

export async function setMemberRole(userId: string, projectId: string, role: Role): Promise<Result<void>> {
  try {
    await db.query(
      `INSERT INTO project_members (user_id, project_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, project_id) DO UPDATE SET role = $3`,
      [userId, projectId, role]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'PERMISSIONS_DB_WRITE_FAILED', message } }
  }
}

export async function removeMember(userId: string, projectId: string): Promise<Result<void>> {
  try {
    await db.query(
      `DELETE FROM project_members WHERE user_id = $1 AND project_id = $2`,
      [userId, projectId]
    )
    return { ok: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'PERMISSIONS_DB_DELETE_FAILED', message } }
  }
}

export async function getProjectMembers(projectId: string): Promise<Result<Array<{ userId: string; role: Role }>>> {
  try {
    const result = await db.query<{ user_id: string; role: Role }>(
      `SELECT user_id, role FROM project_members WHERE project_id = $1`,
      [projectId]
    )
    return { ok: true, data: result.rows.map((r) => ({ userId: r.user_id, role: r.role })) }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'PERMISSIONS_DB_QUERY_FAILED', message } }
  }
}
