// @liv-standard v1.3
// [F-project/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R4
// wires-in:
//   W-ATOM  Project          ../types/project-types
//   W-ATOM  Build            ../types/project-types
//   W-ATOM  ProjectId        ../types/project-types
//   W-ATOM  BuildId          ../types/project-types
//   W-ATOM  BuildStatus      ../types/project-types
//   W-ATOM  BuildSource      ../types/project-types
//   W-ATOM  ProjectResult    ../types/project-types
//   W-INJECT IProjectDb      ../workflow/project-workflow (interface defined at R2)
// wires-out:  none  (R4 is never imported. Injected into R2 via interface.)
// deps:
//   R0  ../types/project-types
//   R5  @/core/db/client
// validated:  2026-03-12

import { db } from '@/core/db/client'
import type {
  Project,
  Build,
  ProjectId,
  BuildId,
  BuildStatus,
  BuildSource,
  ProjectDelta,
  ProjectResult,
} from '../types/project-types'

// ── Row types — typed boundaries at R4 ────────────────────────────────────────
type ProjectRow = {
  project_id:  string
  name:        string
  owner_id:    string
  description: string | null
  created_at:  Date
  updated_at:  Date
}

type BuildRow = {
  build_id:      string
  project_id:    string
  user_id:       string
  status:        string
  source:        string
  if_contract:   string | null
  drift_report:  unknown | null
  base_build_id: string | null
  started_at:    Date
  completed_at:  Date | null
  created_at:    Date
  updated_at:    Date
}

// ── Row mappers ────────────────────────────────────────────────────────────────
function mapProject(r: ProjectRow): Project {
  return {
    projectId:   r.project_id   as ProjectId,
    name:        r.name,
    ownerId:     r.owner_id,
    description: r.description,
    createdAt:   r.created_at.getTime(),
    updatedAt:   r.updated_at.getTime(),
  }
}

function mapBuild(r: BuildRow): Build {
  return {
    buildId:     r.build_id     as BuildId,
    projectId:   r.project_id   as ProjectId,
    userId:      r.user_id,
    status:      r.status       as BuildStatus,
    source:      r.source       as BuildSource,
    ifContract:  r.if_contract,
    driftReport: r.drift_report,
    baseBuildId: r.base_build_id ? r.base_build_id as BuildId : null,
    startedAt:   r.started_at.getTime(),
    completedAt: r.completed_at ? r.completed_at.getTime() : null,
    createdAt:   r.created_at.getTime(),
    updatedAt:   r.updated_at.getTime(),
  }
}

// ── Project queries ────────────────────────────────────────────────────────────

export async function dbGetProject(
  projectId: ProjectId
): Promise<ProjectResult<Project>> {
  try {
    const result = await db.query<ProjectRow>(
      `SELECT project_id, name, owner_id, description, created_at, updated_at
       FROM projects WHERE project_id = $1`,
      [projectId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Project not found' } }
    return { ok: true, data: mapProject(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

export async function dbListProjectsForUser(
  userId: string
): Promise<ProjectResult<Project[]>> {
  try {
    const result = await db.query<ProjectRow>(
      `SELECT p.project_id, p.name, p.owner_id, p.description, p.created_at, p.updated_at
       FROM projects p
       WHERE p.owner_id = $1
       ORDER BY p.updated_at DESC`,
      [userId]
    )
    return { ok: true, data: result.rows.map(mapProject) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

export async function dbCreateProject(
  projectId: ProjectId,
  name: string,
  ownerId: string,
  description: string | null
): Promise<ProjectResult<Project>> {
  try {
    const result = await db.query<ProjectRow>(
      `INSERT INTO projects (project_id, name, owner_id, description)
       VALUES ($1, $2, $3, $4)
       RETURNING project_id, name, owner_id, description, created_at, updated_at`,
      [projectId, name.trim(), ownerId, description]
    )
    return { ok: true, data: mapProject(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to create project', context: { cause: String(e) } } }
  }
}

export async function dbUpdateProject(
  projectId: ProjectId,
  delta: ProjectDelta
): Promise<ProjectResult<Project>> {
  const sets: string[]  = []
  const vals: unknown[] = []
  let   i               = 1

  if (delta.name        !== undefined) { sets.push(`name = $${i++}`);        vals.push(delta.name.trim()) }
  if (delta.description !== undefined) { sets.push(`description = $${i++}`); vals.push(delta.description) }

  if (sets.length === 0)
    return { ok: false, error: { code: 'VALIDATION_FAILED', message: 'No fields to update' } }

  sets.push(`updated_at = now()`)
  vals.push(projectId)

  try {
    const result = await db.query<ProjectRow>(
      `UPDATE projects SET ${sets.join(', ')} WHERE project_id = $${i}
       RETURNING project_id, name, owner_id, description, created_at, updated_at`,
      vals
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Project not found' } }
    return { ok: true, data: mapProject(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to update project', context: { cause: String(e) } } }
  }
}

export async function dbDeleteProject(
  projectId: ProjectId
): Promise<ProjectResult<void>> {
  try {
    await db.query(`DELETE FROM projects WHERE project_id = $1`, [projectId])
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to delete project', context: { cause: String(e) } } }
  }
}

// ── Build queries ──────────────────────────────────────────────────────────────

export async function dbGetBuild(
  buildId: BuildId
): Promise<ProjectResult<Build>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status, source,
              if_contract, drift_report, base_build_id,
              started_at, completed_at, created_at, updated_at
       FROM builds WHERE build_id = $1`,
      [buildId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Build not found' } }
    return { ok: true, data: mapBuild(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

export async function dbGetLatestBuildForProject(
  projectId: ProjectId
): Promise<ProjectResult<Build | null>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status, source,
              if_contract, drift_report, base_build_id,
              started_at, completed_at, created_at, updated_at
       FROM builds WHERE project_id = $1
       ORDER BY started_at DESC LIMIT 1`,
      [projectId]
    )
    return { ok: true, data: result.rows[0] ? mapBuild(result.rows[0]) : null }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

export async function dbListBuildsForProject(
  projectId: ProjectId
): Promise<ProjectResult<Build[]>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status, source,
              if_contract, drift_report, base_build_id,
              started_at, completed_at, created_at, updated_at
       FROM builds WHERE project_id = $1
       ORDER BY started_at DESC`,
      [projectId]
    )
    return { ok: true, data: result.rows.map(mapBuild) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

export async function dbCreateBuild(
  buildId: BuildId,
  projectId: ProjectId,
  userId: string,
  source: BuildSource,
  baseBuildId: BuildId | null
): Promise<ProjectResult<Build>> {
  try {
    const result = await db.query<BuildRow>(
      `INSERT INTO builds
         (build_id, project_id, user_id, status, source, base_build_id, started_at)
       VALUES ($1, $2, $3, 'pending', $4, $5, now())
       RETURNING build_id, project_id, user_id, status, source,
                 if_contract, drift_report, base_build_id,
                 started_at, completed_at, created_at, updated_at`,
      [buildId, projectId, userId, source, baseBuildId]
    )
    return { ok: true, data: mapBuild(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to create build', context: { cause: String(e) } } }
  }
}

// ── W-INJECT binding is in contract/project-inject.ts (R3), not here ──────────
// R4 exports raw db functions only. R3 assembles them into the IProjectDb interface.
// A2: R4 never imports R2. IProjectDb is declared at R2 and wired at R3.

export async function dbUpdateBuildStatus(
  buildId: BuildId,
  status: BuildStatus,
  completedAt?: number
): Promise<ProjectResult<Build>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET status = $2,
           completed_at = $3,
           updated_at = now()
       WHERE build_id = $1
       RETURNING build_id, project_id, user_id, status, source,
                 if_contract, drift_report, base_build_id,
                 started_at, completed_at, created_at, updated_at`,
      [buildId, status, completedAt ? new Date(completedAt) : null]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Build not found' } }
    return { ok: true, data: mapBuild(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to update build', context: { cause: String(e) } } }
  }
}
