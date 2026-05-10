// @liv-standard v1.3
// [F-verify/R4]
// Built with LIV · livai.dev
// R4: execution layer, depends R0 only.
//
// Stubbed pending F-health-panel and F-execution-panel build.
// DB tables (health_violations, execution_checks) added when those slices are built.

import type { HealthViolation, ExecutionCheckResult } from '../config/la-types'
import type { Result } from '@/core/types/primitives'

export async function persistHealthResults(
  _projectId: string,
  _violations: HealthViolation[]
): Promise<Result<void>> {
  // Stub — health_violations table not yet created.
  return { ok: true, data: undefined }
}

export async function loadHealthResults(_projectId: string): Promise<Result<HealthViolation[]>> {
  return { ok: true, data: [] }
}

export async function persistExecutionResults(
  _projectId: string,
  _results: ExecutionCheckResult[]
): Promise<Result<void>> {
  // Stub — execution_checks table not yet created.
  return { ok: true, data: undefined }
}

export async function loadExecutionResults(_projectId: string): Promise<Result<ExecutionCheckResult[]>> {
  return { ok: true, data: [] }
}
