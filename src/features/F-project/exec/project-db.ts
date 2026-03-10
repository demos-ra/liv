// [F-project/R4/C2] Project database I/O
// R4: execution layer, depends R0 only

import { db } from '@/core/db/client'
import { Project, ProjectSummary, PROJECT_CONFIG } from '../config/project-config'

export async function persistProject(project: Project): Promise<void> {
  await db.query(
    `INSERT INTO projects (
      project_id, owner_id, name, description, status,
      repo_owner, repo_name, default_branch, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
      to_timestamp($9 / 1000.0),
      to_timestamp($10 / 1000.0))`,
    [
      project.projectId, project.ownerId, project.name, project.description,
      project.status, project.repoOwner, project.repoName, project.defaultBranch,
      project.createdAt, project.updatedAt,  // unix ms — to_timestamp($9/1000) handles conversion
    ] as unknown[]
  )
}

export async function updateProject(project: Project): Promise<void> {
  await db.query(
    `UPDATE projects SET
      name = $2, description = $3, status = $4,
      repo_owner = $5, repo_name = $6, default_branch = $7,
      updated_at = to_timestamp($8 / 1000.0)
     WHERE project_id = $1`,
    [
      project.projectId, project.name, project.description, project.status,
      project.repoOwner, project.repoName, project.defaultBranch, project.updatedAt,
    ] as unknown[]
  )
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const result = await db.query(
    `SELECT * FROM projects WHERE project_id = $1 AND status != 'deleted'`,
    [projectId]
  )
  return result.rows[0] ? rowToProject(result.rows[0]) : null
}

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  const result = await db.query(
    `SELECT * FROM projects WHERE owner_id = $1 AND status = 'active' ORDER BY updated_at DESC`,
    [ownerId]
  )
  return result.rows.map(rowToProject)
}

export async function getProjectSummaries(
  ownerId: string,
  cursor: string | null
): Promise<{ projects: ProjectSummary[]; hasMore: boolean; cursor: string | null }> {
  const limit = PROJECT_CONFIG.pageSize
  const result = await db.query(
    `SELECT
      p.project_id, p.name, p.description, p.status,
      p.created_at, p.updated_at,
      COUNT(DISTINCT pm.user_id) AS member_count,
      MAX(cl.created_at) AS last_commit_at
     FROM projects p
     LEFT JOIN project_members pm ON pm.project_id = p.project_id
     LEFT JOIN commit_log cl ON cl.project_id = p.project_id
     WHERE p.owner_id = $1
       AND p.status = 'active'
       ${cursor ? 'AND p.updated_at < to_timestamp($3 / 1000.0)' : ''}
     GROUP BY p.project_id
     ORDER BY p.updated_at DESC
     LIMIT $2`,
    cursor ? [ownerId, limit + 1, Number(cursor)] : [ownerId, limit + 1]
  )

  const rows = result.rows
  const hasMore = rows.length > limit
  const projects: ProjectSummary[] = rows.slice(0, limit).map((r) => { const row = r as unknown as ProjectSummaryRow; return ({
    projectId: row.project_id,
    name: row.name,
    description: row.description,
    status: row.status as ProjectSummary['status'],
    createdAt: Number(new Date(row.created_at)),
    updatedAt: Number(new Date(row.updated_at)),
    memberCount: Number(row.member_count),
    lastCommitAt: row.last_commit_at ? Number(new Date(row.last_commit_at)) : null,
  })})

  return {
    projects,
    hasMore,
    cursor: projects.length > 0 ? String(projects[projects.length - 1].updatedAt) : null,
  }
}


// ─── Row Types (Amendment 1: W-INJECT boundary — DB→domain cast explicit) ─────

interface ProjectSummaryRow {
  project_id: string
  name: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
  member_count: string  // COUNT returns string in pg
  last_commit_at: string | null
}

function rowToProject(row: Record<string, unknown>): Project {
  return {
    projectId: row.project_id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    description: row.description as string | null,
    status: row.status as Project['status'],
    repoOwner: row.repo_owner as string | null,
    repoName: row.repo_name as string | null,
    defaultBranch: row.default_branch as string | null,
    createdAt: Number(new Date(row.created_at as string)),
    updatedAt: Number(new Date(row.updated_at as string)),
  }
}
