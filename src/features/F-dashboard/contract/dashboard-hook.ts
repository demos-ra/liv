// [F-dashboard/R3/C2] Dashboard contract — hook only (reads project:: namespace)
// R3: client-side contract, depends R0 + R1
// No API routes — dashboard reads from F-project namespace directly.

'use client'

import { useState, useMemo } from 'react'
import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { DASHBOARD_NAMESPACE, DashboardView, DashboardState } from '../config/dashboard-config'
import { filterProjects, sortByLastActivity, buildInitialState } from '../domain/dashboard-logic'
import { useProjectList } from '@/features/F-project/contract/project-hook'
import { useUnreadCount } from '@/features/F-notifications/contract/notifications-hook'

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(buildInitialState)
  const { projects, hasMore, cursor } = useProjectList()
  const unreadCount = useUnreadCount()

  const filtered = useMemo(
    () => sortByLastActivity(filterProjects(projects, state.searchQuery)),
    [projects, state.searchQuery]
  )

  return {
    ...state,
    projects: filtered,
    hasMore,
    cursor,
    unreadCount,
    setView:        (view: DashboardView) => setState((s) => ({ ...s, view })),
    setSearchQuery: (q: string) => setState((s) => ({ ...s, searchQuery: q })),
    setLoading:     (isLoading: boolean) => setState((s) => ({ ...s, isLoading })),
  }
}
