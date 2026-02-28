// [F-health-panel/R1/C2] Health panel domain logic
// R1: pure functions, no I/O, depends R0 only

import { HealthViolation, HealthSummary, ViolationType } from '../config/health-panel-config'

export function buildSummary(
  projectId: string,
  violations: HealthViolation[],
  lastCheckedAt: number | null
): HealthSummary {
  const byType = {} as Record<ViolationType, number>
  const bySlice: Record<string, number> = {}

  for (const v of violations.filter((v) => !v.resolved)) {
    byType[v.type] = (byType[v.type] ?? 0) + 1
    bySlice[v.featureTag] = (bySlice[v.featureTag] ?? 0) + 1
  }

  return {
    projectId,
    totalViolations: violations.filter((v) => !v.resolved).length,
    byType,
    bySlice,
    lastCheckedAt,
  }
}

export function groupBySlice(violations: HealthViolation[]): Record<string, HealthViolation[]> {
  return violations.reduce((acc, v) => {
    ;(acc[v.featureTag] ??= []).push(v)
    return acc
  }, {} as Record<string, HealthViolation[]>)
}

export function violationLabel(type: ViolationType): string {
  switch (type) {
    case 'namespace_boundary':     return 'Namespace boundary violation'
    case 'undeclared_event':       return 'Undeclared event'
    case 'upward_dependency':      return 'Upward R-layer dependency'
    case 'orphan_code':            return 'Code outside declared slice'
    case 'local_visual_primitive': return 'Local visual primitive'
  }
}
