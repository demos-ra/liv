// [F-execution-panel/contract/execution-panel-ui.tsx]
// R3 — Execution panel UI stub. 'use client'.
// Phase B: full LA validator output with per-slice pass/fail grid.

'use client'

import { useExecutionPanel } from './execution-panel-hook'

export function ExecutionPanelUI({ projectId }: { projectId: string }) {
  const { state } = useExecutionPanel(projectId)
  const total  = state?.results?.length ?? 0
  const passed = state?.results?.filter((r: { passed: boolean }) => r.passed).length ?? 0

  return (
    <div style={{ padding: 24, color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
      <span style={{ color: total === passed ? 'var(--success)' : 'var(--error)' }}>
        execution — {passed}/{total} passed
      </span>
    </div>
  )
}
