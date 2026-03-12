// @liv-standard v1.3
// [F-project/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R1
// wires-in:
//   W-ATOM  Project         ../types/project-types
//   W-ATOM  Build           ../types/project-types
//   W-ATOM  BuildStatus     ../types/project-types
//   W-ATOM  ProjectSummary  ../types/project-types
//   W-ATOM  BuildSummary    ../types/project-types
//   W-ATOM  PROJECT_CONST   ../types/project-const
// wires-out:  none  (R1 logic is never exported across slices — A2)
// deps:
//   R0  ../types/project-types
//   R0  ../types/project-const
// validated:  2026-03-12

import type {
  Project,
  Build,
  BuildStatus,
  ProjectSummary,
  BuildSummary,
  ProjectDelta,
  CreateProjectPayload,
} from '../types/project-types'
import { PROJECT_CONST } from '../types/project-const'

// ── Validation ────────────────────────────────────────────────────────────────
// A4: pure — no I/O, no throws. Returns typed error or null.

export function validateCreateProject(
  input: CreateProjectPayload
): { code: string; message: string } | null {
  const name = input.name.trim()
  if (!name)
    return { code: 'VALIDATION_FAILED', message: 'Project name is required' }
  if (name.length > PROJECT_CONST.NAME_MAX_LEN)
    return { code: 'VALIDATION_FAILED', message: `Name must be ${PROJECT_CONST.NAME_MAX_LEN} chars or fewer` }
  if (input.description && input.description.length > PROJECT_CONST.DESCRIPTION_MAX_LEN)
    return { code: 'VALIDATION_FAILED', message: `Description must be ${PROJECT_CONST.DESCRIPTION_MAX_LEN} chars or fewer` }
  return null
}

export function validateProjectDelta(
  delta: ProjectDelta
): { code: string; message: string } | null {
  if (delta.name !== undefined) {
    const name = delta.name.trim()
    if (!name)
      return { code: 'VALIDATION_FAILED', message: 'Project name cannot be empty' }
    if (name.length > PROJECT_CONST.NAME_MAX_LEN)
      return { code: 'VALIDATION_FAILED', message: `Name must be ${PROJECT_CONST.NAME_MAX_LEN} chars or fewer` }
  }
  if (delta.description !== undefined && delta.description !== null) {
    if (delta.description.length > PROJECT_CONST.DESCRIPTION_MAX_LEN)
      return { code: 'VALIDATION_FAILED', message: `Description must be ${PROJECT_CONST.DESCRIPTION_MAX_LEN} chars or fewer` }
  }
  return null
}

// ── Status derivation (AK-DRV — never stored) ─────────────────────────────────
// A4: Project.status is derived from its latest Build. Never persisted on Project.
export function deriveProjectStatus(latestBuild: Build | null): BuildStatus | 'idle' {
  if (!latestBuild) return 'idle'
  return latestBuild.status
}

// ── Summary projections ───────────────────────────────────────────────────────
// R1-safe: pure projection functions, no I/O.
export function toBuildSummary(build: Build): BuildSummary {
  return {
    buildId:     build.buildId,
    status:      build.status,
    source:      build.source,
    startedAt:   build.startedAt,
    completedAt: build.completedAt,
  }
}

export function toProjectSummary(
  project: Project,
  latestBuild: Build | null
): ProjectSummary {
  return {
    projectId:   project.projectId,
    name:        project.name,
    ownerId:     project.ownerId,
    description: project.description,
    latestBuild: latestBuild ? toBuildSummary(latestBuild) : null,
    createdAt:   project.createdAt,
  }
}

// ── Ownership check ───────────────────────────────────────────────────────────
// Pure — accepts data already fetched by R2. No DB access here.
export function isProjectOwner(project: Project, userId: string): boolean {
  return project.ownerId === userId
}
