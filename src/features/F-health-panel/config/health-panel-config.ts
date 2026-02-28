// [F-health-panel/R0/C2] Health panel configuration and types
// R0: pure config, zero dependencies

export const HEALTH_PANEL_NAMESPACE = 'health_panel' as const

export type ViolationType =
  | 'namespace_boundary'    // slice wrote to another slice's namespace
  | 'undeclared_event'      // event emitted/subscribed not in R0 schema
  | 'upward_dependency'     // R layer imported from higher layer
  | 'orphan_code'           // code exists outside any declared F slice
  | 'local_visual_primitive'// UI defined outside F-design-system

export type HealthViolation = {
  violationId: string
  projectId: string
  featureTag: string
  rLayer: number
  type: ViolationType
  filePath: string
  message: string
  detectedAt: number
  resolved: boolean
}

export type HealthSummary = {
  projectId: string
  totalViolations: number
  byType: Record<ViolationType, number>
  bySlice: Record<string, number>
  lastCheckedAt: number | null
}
