// [F-dashboard/R1/C2] Dashboard domain logic — project filtering
// R1: pure functions, no I/O, depends R0 only

import { DashboardState } from '../config/dashboard-config'
import { ProjectSummary } from '@/features/F-project/config/project-config'

export function filterProjects(projects: ProjectSummary[], query: string): ProjectSummary[] {
  if (!query.trim()) return projects
  const q = query.toLowerCase()
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
  )
}

export function sortByLastActivity(projects: ProjectSummary[]): ProjectSummary[] {
  return [...projects].sort((a, b) => {
    const aTime = a.lastCommitAt ?? a.updatedAt
    const bTime = b.lastCommitAt ?? b.updatedAt
    return bTime - aTime
  })
}

export function buildInitialState(): DashboardState {
  return { view: 'grid', searchQuery: '', isLoading: true }
}
