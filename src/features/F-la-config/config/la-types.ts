// @liv-standard v1.0
// [F-la-config/config/la-types.ts]
// Built with LIV · livai.dev
// R0 — type declarations only. No imports. No logic.
// Owns HealthViolation and ExecutionCheckResult — previously in deleted slices.
// A1: F-la-config is the single owner of these types until F-health-panel
// and F-execution-panel are built.

export interface HealthViolation {
  violationId:  string
  projectId:    string
  featureTag:   string
  rLayer:       number
  type:         'namespace_boundary' | 'upward_dependency' | 'orphan_code' | 'missing_stamp' | 'io_leak'
  filePath:     string
  message:      string
  detectedAt:   number
  resolved:     boolean
}

export interface ExecutionCheckResult {
  checkId:    string
  projectId:  string
  featureTag: string
  rLayer:     number
  filePath:   string
  passed:     boolean
  violations: string[]
  checkedAt:  number
}
