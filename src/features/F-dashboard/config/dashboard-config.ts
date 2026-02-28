// [F-dashboard/R0/C2] Dashboard configuration
// R0: pure config, zero dependencies

export const DASHBOARD_NAMESPACE = 'dashboard' as const

export type DashboardView = 'grid' | 'list'

export type DashboardState = {
  view: DashboardView
  searchQuery: string
  isLoading: boolean
}
