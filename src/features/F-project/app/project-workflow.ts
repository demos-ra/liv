// [F-project/R2/C3] Project workflow orchestration
// R2: orchestration, depends R0 + R1 + R4

import {
  buildProject,
  attachRepo,
  archiveProject,
  softDeleteProject,
  validateProjectName,
  validateDescription,
} from '../domain/project-logic'
import {
  persistProject,
  updateProject,
  getProjectById,
  getProjectsByOwner,
  getProjectSummaries,
} from '../exec/project-db'
import { setMemberRole } from '@/features/F-permissions/contract/permissions-contract'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

// --- Create project ---

export async function createProject(
  ownerId: string,
  name: string,
  description: string | null
): Promise<{ projectId: string } | { error: string }> {
  const nameValidation = validateProjectName(name)
  if (!nameValidation.valid) return { error: nameValidation.error! }

  if (description) {
    const descValidation = validateDescription(description)
    if (!descValidation.valid) return { error: descValidation.error! }
  }

  const project = buildProject(ownerId, name, description)
  await persistProject(project)

  // Owner gets owner role automatically
  await setMemberRole(ownerId, project.projectId, 'owner')

  await emitEvent({
    type: EVENTS.PROJECT.PROJECT_CREATED,
    payload: { projectId: project.projectId, ownerId },
  })

  return { projectId: project.projectId }
}

// --- Connect repo to project ---

export async function connectRepo(
  projectId: string,
  repoOwner: string,
  repoName: string,
  defaultBranch: string
): Promise<boolean> {
  const project = await getProjectById(projectId)
  if (!project) return false

  const updated = attachRepo(project, repoOwner, repoName, defaultBranch)
  await updateProject(updated)

  await emitEvent({
    type: EVENTS.PROJECT.REPO_CONNECTED,
    payload: { projectId, repoOwner, repoName },
  })

  return true
}

// --- Archive ---

export async function archive(projectId: string): Promise<boolean> {
  const project = await getProjectById(projectId)
  if (!project) return false

  await updateProject(archiveProject(project))
  await emitEvent({ type: EVENTS.PROJECT.PROJECT_ARCHIVED, payload: { projectId } })
  return true
}

// --- Load project + summaries ---

export async function loadProject(projectId: string) {
  return getProjectById(projectId)
}

export async function loadUserProjects(ownerId: string, cursor: string | null) {
  return getProjectSummaries(ownerId, cursor)
}
