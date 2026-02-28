// [F-project/R3/C2] useProject + useProjectList hooks
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { PROJECT_NAMESPACE, Project, ProjectSummary } from '../config/project-config'

// --- Single project ---

export function useProject(projectId: string): Project | null {
  return useNamespace<Project>(`${PROJECT_NAMESPACE}:${projectId}`) ?? null
}

export function useProjectRepo(projectId: string) {
  const project = useProject(projectId)
  if (!project) return null
  return project.repoOwner && project.repoName
    ? { owner: project.repoOwner, name: project.repoName, branch: project.defaultBranch }
    : null
}

// --- Project list ---

export type ProjectListState = {
  projects: ProjectSummary[]
  hasMore: boolean
  cursor: string | null
}

const INITIAL_LIST: ProjectListState = {
  projects: [],
  hasMore: false,
  cursor: null,
}

export function useProjectList(): ProjectListState {
  return useNamespace<ProjectListState>(`${PROJECT_NAMESPACE}:list`) ?? INITIAL_LIST
}
