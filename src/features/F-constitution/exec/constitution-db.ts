// [F-constitution/R4/C2] Constitution database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { Constitution } from '../config/constitution-config'

export async function persistConstitution(c: Constitution): Promise<void> {
  await db.query(
    `INSERT INTO constitutions (
      constitution_id, project_id, version, status, slices,
      confirmed_by, confirmed_at, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,
      to_timestamp($7 / 1000.0),
      to_timestamp($8 / 1000.0),
      to_timestamp($9 / 1000.0))`,
    [
      c.constitutionId, c.projectId, c.version, c.status,
      JSON.stringify(c.slices), c.confirmedBy, c.confirmedAt,
      c.createdAt, c.updatedAt,
    ]
  )
}

export async function updateConstitution(c: Constitution): Promise<void> {
  await db.query(
    `UPDATE constitutions SET
      version = $2, status = $3, slices = $4,
      confirmed_by = $5,
      confirmed_at = to_timestamp($6 / 1000.0),
      updated_at = to_timestamp($7 / 1000.0)
     WHERE constitution_id = $1`,
    [
      c.constitutionId, c.version, c.status,
      JSON.stringify(c.slices), c.confirmedBy, c.confirmedAt, c.updatedAt,
    ]
  )
}

export async function getConstitutionByProject(projectId: string): Promise<Constitution | null> {
  const result = await db.query(
    `SELECT * FROM constitutions WHERE project_id = $1 ORDER BY version DESC LIMIT 1`,
    [projectId]
  )
  return result.rows[0] ? rowToConstitution(result.rows[0]) : null
}

function rowToConstitution(row: Record<string, unknown>): Constitution {
  return {
    constitutionId: row.constitution_id as string,
    projectId: row.project_id as string,
    version: row.version as number,
    status: row.status as Constitution['status'],
    slices: row.slices as Constitution['slices'],
    confirmedBy: row.confirmed_by as string | null,
    confirmedAt: row.confirmed_at ? Number(new Date(row.confirmed_at as string)) : null,
    createdAt: Number(new Date(row.created_at as string)),
    updatedAt: Number(new Date(row.updated_at as string)),
  }
}
