// [F-dashboard/contract/dashboard-ui.tsx]
// R3 — Dashboard UI stub. 'use client'.
// Phase B: full project grid + topology overview.

'use client'

import { useDashboard } from './dashboard-hook'

export function DashboardUI({ projectId }: { projectId: string }) {
  const { view, isLoading } = useDashboard()

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-ui)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dis)' }}>
        dashboard — {projectId} — {view}{isLoading ? ' (loading)' : ''}
      </span>
    </div>
  )
}
