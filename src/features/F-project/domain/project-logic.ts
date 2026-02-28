// [F-project/R1/C2] Project domain logic
// R1: pure functions, no I/O, depends R0 only

import { Project, ProjectStatus, PROJECT_CONFIG } from '../config/project-config'
import { generateId } from '@/core/types/primitives'

// --- Factory ---

export function buildProject(
  ownerId: string,
  name: string,
  description: string | null = null
): Project {
  const now = Date.now()
  return {
    projectId: generateId('proj'),
    ownerId,
    name: name.trim(),
    description: description?.trim() ?? null,
    status: 'active',
    repoOwner: null,
    repoName: null,
    defaultBranch: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function attachRepo(
  project: Project,
  repoOwner: string,
  repoName: string,
  defaultBranch: string
): Project {
  return { ...project, repoOwner, repoName, defaultBranch, updatedAt: Date.now() }
}

export function archiveProject(project: Project): Project {
  return { ...project, status: 'archived', updatedAt: Date.now() }
}

export function softDeleteProject(project: Project): Project {
  return { ...project, status: 'deleted', updatedAt: Date.now() }
}

// --- Validation ---

export function validateProjectName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim()
  if (!trimmed) return { valid: false, error: 'Name cannot be empty' }
  if (trimmed.length > PROJECT_CONFIG.maxNameLength) {
    return { valid: false, error: `Name exceeds ${PROJECT_CONFIG.maxNameLength} characters` }
  }
  return { valid: true }
}

export function validateDescription(description: string): { valid: boolean; error?: string } {
  if (description.length > PROJECT_CONFIG.maxDescriptionLength) {
    return { valid: false, error: `Description exceeds ${PROJECT_CONFIG.maxDescriptionLength} characters` }
  }
  return { valid: true }
}

export function isActive(project: Project): boolean {
  return project.status === 'active'
}

export function hasRepo(project: Project): boolean {
  return project.repoOwner !== null && project.repoName !== null
}
