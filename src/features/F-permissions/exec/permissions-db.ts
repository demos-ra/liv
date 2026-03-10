// [F-permissions/R4/C2] Permissions database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { Role } from '../config/permissions-config'

export async function getMemberRole(userId: string, projectId: string): Promise<Role | null> {
  const result = await db.query<{ role: Role }>(
    `SELECT role FROM project_members WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
  return result.rows[0]?.role ?? null
}

export async function setMemberRole(userId: string, projectId: string, role: Role): Promise<void> {
  await db.query(
    `INSERT INTO project_members (user_id, project_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, project_id) DO UPDATE SET role = $3`,
    [userId, projectId, role]
  )
}

export async function removeMember(userId: string, projectId: string): Promise<void> {
  await db.query(
    `DELETE FROM project_members WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
}

export async function getProjectMembers(projectId: string): Promise<Array<{ userId: string; role: Role }>> {
  const result = await db.query<{ user_id: string; role: Role }>(
    `SELECT user_id, role FROM project_members WHERE project_id = $1`,
    [projectId]
  )
  return result.rows.map((r) => ({ userId: r.user_id, role: r.role }))
}
