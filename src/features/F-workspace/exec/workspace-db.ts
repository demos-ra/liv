// [F-workspace/R4/C2] Workspace database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { WorkspaceLayout } from '../config/workspace-config'

export async function saveLayout(userId: string, layout: WorkspaceLayout): Promise<void> {
  await db.query(
    `INSERT INTO workspace_layouts (user_id, project_id, layout, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id, project_id) DO UPDATE
       SET layout = $3, updated_at = NOW()`,
    [userId, layout.projectId, JSON.stringify(layout)]
  )
}

export async function loadLayout(userId: string, projectId: string): Promise<WorkspaceLayout | null> {
  const result = await db.query<{ layout: WorkspaceLayout }>(
    `SELECT layout FROM workspace_layouts WHERE user_id = $1 AND project_id = $2`,
    [userId, projectId]
  )
  return result.rows[0]?.layout ?? null
}
