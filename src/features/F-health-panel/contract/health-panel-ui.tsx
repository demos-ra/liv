// [F-health-panel/contract/health-panel-ui.tsx]
// R3 — Health panel UI stub. 'use client'.
// Phase B: full violation list with slice/layer breakdown.

'use client'

import { useHealthPanel } from './health-panel-hook'

export function HealthPanelUI({ projectId }: { projectId: string }) {
  const { state } = useHealthPanel(projectId)
  const count = state?.violations?.length ?? 0

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <span style={{ color: count === 0 ? 'var(--success)' : 'var(--error)' }}>
        health — {count} violation{count !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
