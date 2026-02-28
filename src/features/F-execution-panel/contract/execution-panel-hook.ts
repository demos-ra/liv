// [F-execution-panel/R3/C2] useExecutionPanel hook
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { EXECUTION_PANEL_NAMESPACE, ExecutionCheckResult, ExecutionSummary } from '../config/execution-panel-config'
import { buildSummary, groupBySlice, failedResults } from '../domain/execution-panel-logic'

export type ExecutionPanelState = {
  results: ExecutionCheckResult[]
  summary: ExecutionSummary | null
}

export function useExecutionPanel(projectId: string) {
  const state = useNamespace<ExecutionPanelState>(`${EXECUTION_PANEL_NAMESPACE}:${projectId}`)
  const results = state?.results ?? []

  return {
    results,
    summary: results.length > 0 ? buildSummary(projectId, results) : null,
    bySlice: groupBySlice(results),
    failed: failedResults(results),
    isClean: failedResults(results).length === 0,
  }
}
