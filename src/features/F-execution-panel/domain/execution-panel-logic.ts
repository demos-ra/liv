// [F-execution-panel/R1/C2] Execution panel domain logic
// R1: pure functions, no I/O, depends R0 only

import { ExecutionCheckResult, ExecutionSummary } from '../config/execution-panel-config'

export function buildSummary(
  projectId: string,
  results: ExecutionCheckResult[]
): ExecutionSummary {
  const passed = results.filter((r) => r.passed).length
  const lastRunAt = results.length > 0
    ? Math.max(...results.map((r) => r.checkedAt))
    : null

  return {
    projectId,
    totalChecks: results.length,
    passed,
    failed: results.length - passed,
    lastRunAt,
  }
}

export function groupBySlice(
  results: ExecutionCheckResult[]
): Record<string, ExecutionCheckResult[]> {
  return results.reduce((acc, r) => {
    ;(acc[r.featureTag] ??= []).push(r)
    return acc
  }, {} as Record<string, ExecutionCheckResult[]>)
}

export function failedResults(results: ExecutionCheckResult[]): ExecutionCheckResult[] {
  return results.filter((r) => !r.passed)
}
