// @liv-standard v1.3
// [F-project/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R2
// wires-in:
//   W-ATOM    Project              ../types/project-types
//   W-ATOM    Build                ../types/project-types
//   W-ATOM    ProjectId            ../types/project-types
//   W-ATOM    BuildId              ../types/project-types
//   W-ATOM    BuildSource          ../types/project-types
//   W-ATOM    ProjectResult        ../types/project-types
//   W-ATOM    CreateProjectPayload ../types/project-types
//   W-ATOM    CreateBuildPayload   ../types/project-types
//   W-ATOM    ProjectDelta         ../types/project-types
//   W-ATOM    ProjectSummary       ../types/project-types
//   W-ATOM    PROJECT_CONST        ../types/project-const
//   W-ATOM    PROJECT_EVENTS       ../types/project-events
// wires-out:
//   W-INJECT  IProjectDb  →  F-project/R4
// deps:
//   R0  ../types/project-types
//   R0  ../types/project-events
//   R0  ../types/project-const
//   R1  ../domain/project-logic
// validated:  2026-03-12

import { generateId }         from '@/core/types/primitives'
import { emitEvent }          from '@/features/F-event-system/contract/event-bus'
import type {
  Project,
  Build,
  ProjectId,
  BuildId,
  BuildSource,
  ProjectDelta,
  ProjectResult,
  ProjectSummary,
  CreateProjectPayload,
  CreateBuildPayload,
} from '../types/project-types'
import {
  PROJECT_EVENTS,
  type ProjectCreatedPayload,
  type BuildStartedPayload,
  type BuildCompletedPayload,
} from '../types/project-events'
import {
  validateCreateProject,
  validateProjectDelta,
  toProjectSummary,
  isProjectOwner,
} from '../domain/project-logic'

// ── W-INJECT — interface declared at R2, implemented at R4 ────────────────────
// A2: R2 never imports R4. R4 receives this interface and implements it.
export interface IProjectDb {
  getProject(projectId: ProjectId): Promise<ProjectResult<Project>>
  listProjectsForUser(userId: string): Promise<ProjectResult<Project[]>>
  createProject(projectId: ProjectId, name: string, ownerId: string, description: string | null): Promise<ProjectResult<Project>>
  updateProject(projectId: ProjectId, delta: ProjectDelta): Promise<ProjectResult<Project>>
  deleteProject(projectId: ProjectId): Promise<ProjectResult<void>>
  getBuild(buildId: BuildId): Promise<ProjectResult<Build>>
  getLatestBuildForProject(projectId: ProjectId): Promise<ProjectResult<Build | null>>
  listBuildsForProject(projectId: ProjectId): Promise<ProjectResult<Build[]>>
  createBuild(buildId: BuildId, projectId: ProjectId, userId: string, source: BuildSource, baseBuildId: BuildId | null): Promise<ProjectResult<Build>>
  updateBuildStatus(buildId: BuildId, status: 'complete' | 'failed' | 'cancelled', completedAt?: number): Promise<ProjectResult<Build>>
}

// ── Workflows ─────────────────────────────────────────────────────────────────
// A4: all I/O via injected db interface. R2 never imports R4 directly.
// FL-CRUD step sequence: R3 validates → R2 orchestrates → R4 persists → event emits

export async function createProject(
  deps: { db: IProjectDb },
  userId: string,
  input: CreateProjectPayload
): Promise<ProjectResult<Project>> {
  const err = validateCreateProject(input)
  if (err) return { ok: false, error: { ...err } }

  const projectId = generateId() as ProjectId
  const result    = await deps.db.createProject(projectId, input.name, userId, input.description)
  if (!result.ok) return result

  emitEvent({
    type:    PROJECT_EVENTS.PROJECT_CREATED,
    slice:   'F-project',
    payload: {
      projectId: result.data.projectId,
      userId,
      name:      result.data.name,
    } satisfies ProjectCreatedPayload,
  })

  return result
}

export async function getProject(
  deps: { db: IProjectDb },
  userId: string,
  projectId: ProjectId
): Promise<ProjectResult<Project>> {
  const result = await deps.db.getProject(projectId)
  if (!result.ok) return result

  // A2: ownership check in R2 — not at R4
  if (!isProjectOwner(result.data, userId))
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }

  return result
}

export async function listProjects(
  deps: { db: IProjectDb },
  userId: string
): Promise<ProjectResult<ProjectSummary[]>> {
  const projectsResult = await deps.db.listProjectsForUser(userId)
  if (!projectsResult.ok) return projectsResult

  // Attach latest build summary to each project (FL-QUERY pattern)
  const summaries = await Promise.all(
    projectsResult.data.map(async (project) => {
      const buildResult = await deps.db.getLatestBuildForProject(project.projectId)
      const latestBuild = buildResult.ok ? buildResult.data : null
      return toProjectSummary(project, latestBuild)
    })
  )

  return { ok: true, data: summaries }
}

export async function updateProject(
  deps: { db: IProjectDb },
  userId: string,
  projectId: ProjectId,
  delta: ProjectDelta
): Promise<ProjectResult<Project>> {
  const validationErr = validateProjectDelta(delta)
  if (validationErr) return { ok: false, error: { ...validationErr } }

  const existing = await deps.db.getProject(projectId)
  if (!existing.ok) return existing
  if (!isProjectOwner(existing.data, userId))
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }

  return deps.db.updateProject(projectId, delta)
}

export async function deleteProject(
  deps: { db: IProjectDb },
  userId: string,
  projectId: ProjectId
): Promise<ProjectResult<void>> {
  const existing = await deps.db.getProject(projectId)
  if (!existing.ok) return existing
  if (!isProjectOwner(existing.data, userId))
    return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }

  return deps.db.deleteProject(projectId)
}

export async function startBuild(
  deps: { db: IProjectDb },
  input: CreateBuildPayload & { userId: string }
): Promise<ProjectResult<Build>> {
  const buildId = generateId() as BuildId
  const result  = await deps.db.createBuild(
    buildId,
    input.projectId,
    input.userId,
    input.source,
    input.baseBuildId
  )
  if (!result.ok) return result

  emitEvent({
    type:    PROJECT_EVENTS.BUILD_STARTED,
    slice:   'F-project',
    payload: {
      buildId:   result.data.buildId,
      projectId: result.data.projectId,
      userId:    input.userId,
      source:    result.data.source,
    } satisfies BuildStartedPayload,
  })

  return result
}

export async function completeBuild(
  deps: { db: IProjectDb },
  buildId: BuildId,
  status: 'complete' | 'failed' | 'cancelled'
): Promise<ProjectResult<Build>> {
  const completedAt = Date.now()
  const result      = await deps.db.updateBuildStatus(buildId, status, completedAt)
  if (!result.ok) return result

  emitEvent({
    type:    PROJECT_EVENTS.BUILD_COMPLETED,
    slice:   'F-project',
    payload: {
      buildId:   result.data.buildId,
      projectId: result.data.projectId,
      status,
    } satisfies BuildCompletedPayload,
  })

  return result
}
