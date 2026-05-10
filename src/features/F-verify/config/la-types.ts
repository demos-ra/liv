// @liv-standard v1.3
// [F-verify/R0]
// Built with LIV · livai.dev
// R0 — type declarations only. No imports. No logic.
// Owns HealthViolation and ExecutionCheckResult — previously in F-la-config.
// A1: F-verify is the single owner of these types post F-la-config collapse (Sprint 13 Shot 3).

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
