// [F-execution-panel/contract/execution-panel-ui.tsx]
// R3 — Execution panel UI stub. 'use client'.
// Phase B: full LA validator output with per-slice pass/fail grid.

'use client'

import { useExecutionPanel } from './execution-panel-hook'

export function ExecutionPanelUI({ projectId }: { projectId: string }) {
  const { results, isClean } = useExecutionPanel(projectId)
  const total  = results.length
  const passed = results.filter((r) => r.passed).length

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <span style={{ color: isClean ? 'var(--success)' : 'var(--error)' }}>
        execution — {passed}/{total} passed
      </span>
    </div>
  )
}
