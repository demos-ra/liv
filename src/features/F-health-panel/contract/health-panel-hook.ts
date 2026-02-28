// [F-health-panel/R3/C2] useHealthPanel hook
// R3: client-side contract

'use client'

import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { HEALTH_PANEL_NAMESPACE, HealthViolation, HealthSummary } from '../config/health-panel-config'
import { buildSummary, groupBySlice, violationLabel } from '../domain/health-panel-logic'

export type HealthPanelState = {
  violations: HealthViolation[]
  summary: HealthSummary | null
}

export function useHealthPanel(projectId: string) {
  const state = useNamespace<HealthPanelState>(`${HEALTH_PANEL_NAMESPACE}:${projectId}`)
  const violations = state?.violations ?? []
  const summary = state?.summary ?? null

  return {
    violations,
    summary,
    bySlice: groupBySlice(violations),
    violationLabel,
    isClean: violations.filter((v) => !v.resolved).length === 0,
  }
}
