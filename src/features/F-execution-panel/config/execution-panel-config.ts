// [F-execution-panel/R0/C2] Execution panel configuration and types
// R0: pure config, zero dependencies

export const EXECUTION_PANEL_NAMESPACE = 'execution_panel' as const

export type ExecutionCheckResult = {
  checkId: string
  projectId: string
  featureTag: string
  rLayer: number
  filePath: string
  passed: boolean
  violations: string[]
  checkedAt: number
}

export type ExecutionSummary = {
  projectId: string
  totalChecks: number
  passed: number
  failed: number
  lastRunAt: number | null
}
