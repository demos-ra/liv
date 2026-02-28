// [F-project/R0/C2] Project configuration and types
// R0: pure config, zero dependencies

export const PROJECT_CONFIG = {
  maxNameLength: 80,
  maxDescriptionLength: 500,
  pageSize: 20,
} as const

export const PROJECT_NAMESPACE = 'project' as const

export type ProjectStatus = 'active' | 'archived' | 'deleted'

export type Project = {
  projectId: string
  ownerId: string
  name: string
  description: string | null
  status: ProjectStatus
  repoOwner: string | null      // GitHub owner
  repoName: string | null       // GitHub repo name
  defaultBranch: string | null
  createdAt: number
  updatedAt: number
}

export type ProjectSummary = Pick<
  Project,
  'projectId' | 'name' | 'description' | 'status' | 'createdAt' | 'updatedAt'
> & {
  memberCount: number
  lastCommitAt: number | null
}
