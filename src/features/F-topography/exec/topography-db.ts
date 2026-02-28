// [F-topography/R4/C2] Topography database I/O — grid snapshots
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { TopographyGrid } from '../config/topography-config'

export async function persistGridSnapshot(grid: TopographyGrid): Promise<void> {
  await db.query(
    `INSERT INTO topography_snapshots (project_id, grid, snapshot_at)
     VALUES ($1, $2, to_timestamp($3 / 1000.0))
     ON CONFLICT (project_id) DO UPDATE
       SET grid = $2, snapshot_at = to_timestamp($3 / 1000.0)`,
    [grid.projectId, JSON.stringify(grid), grid.lastUpdatedAt]
  )
}

export async function loadGridSnapshot(projectId: string): Promise<TopographyGrid | null> {
  const result = await db.query(
    `SELECT grid FROM topography_snapshots WHERE project_id = $1`,
    [projectId]
  )
  return result.rows[0]?.grid ?? null
}
