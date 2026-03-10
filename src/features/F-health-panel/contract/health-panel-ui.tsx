// [F-health-panel/contract/health-panel-ui.tsx]
// R3 — Health panel UI stub. 'use client'.
// Phase B: full violation list with slice/layer breakdown.

'use client'

import { useHealthPanel } from './health-panel-hook'

export function HealthPanelUI({ projectId }: { projectId: string }) {
  const { violations, isClean } = useHealthPanel(projectId)
  const count = violations.length

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <span style={{ color: isClean ? 'var(--success)' : 'var(--error)' }}>
        health — {count} violation{count !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
