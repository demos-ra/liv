// [F-la-config/R4/C2] LA check result persistence
// R4: execution layer, depends R0 only.
//
// Persists health violations and execution check results to DB.
// These are the namespaces read by F-health-panel and F-execution-panel hooks.
// Separate from topography_snapshots (grid shape) — these are the raw check data.

import { db } from '@/core/db/client'
import type { HealthViolation } from '@/features/F-health-panel/config/health-panel-config'
import type { ExecutionCheckResult } from '@/features/F-execution-panel/config/execution-panel-config'

// ─── Health violations ────────────────────────────────────────────────────────

export async function persistHealthResults(
  projectId: string,
  violations: HealthViolation[]
): Promise<void> {
  // Upsert pattern: replace all violations for project with latest run
  // This is a full replace — we do not accumulate violations across runs.
  // Resolution history tracked by marking old violations resolved before insert.
  await db.query(
    `UPDATE health_violations
     SET resolved = true, resolved_at = NOW()
     WHERE project_id = $1 AND resolved = false`,
    [projectId]
  )

  if (violations.length === 0) return

  // Bulk insert new violations
  const values = violations.flatMap((v) => [
    v.violationId,
    projectId,
    v.featureTag,
    v.rLayer,
    v.type,
    v.filePath,
    v.message,
    v.detectedAt,
    false,
  ])

  const placeholders = violations.map((_, i) => {
    const base = i * 9
    return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},to_timestamp($${base+8}/1000.0),$${base+9})`
  }).join(',')

  await db.query(
    `INSERT INTO health_violations
       (violation_id, project_id, feature_tag, r_layer, type, file_path, message, detected_at, resolved)
     VALUES ${placeholders}`,
    values
  )
}

export async function loadHealthResults(projectId: string): Promise<HealthViolation[]> {
  const result = await db.query<Record<string, unknown>>(
    `SELECT * FROM health_violations
     WHERE project_id = $1
     ORDER BY detected_at DESC`,
    [projectId]
  )
  return result.rows.map((r) => ({
    violationId:  r.violation_id as string,
    projectId:    r.project_id as string,
    featureTag:   r.feature_tag as string,
    rLayer:       r.r_layer as number,
    type:         r.type as HealthViolation['type'],
    filePath:     r.file_path as string,
    message:      r.message as string,
    detectedAt:   Number(new Date(r.detected_at as string)),
    resolved:     r.resolved as boolean,
  }))
}

// ─── Execution check results ──────────────────────────────────────────────────

export async function persistExecutionResults(
  projectId: string,
  results: ExecutionCheckResult[]
): Promise<void> {
  // Replace latest run results for this project
  await db.query(
    `DELETE FROM execution_checks WHERE project_id = $1`,
    [projectId]
  )

  if (results.length === 0) return

  const values = results.flatMap((r) => [
    r.checkId,
    projectId,
    r.featureTag,
    r.rLayer,
    r.filePath,
    r.passed,
    JSON.stringify(r.violations),
    r.checkedAt,
  ])

  const placeholders = results.map((_, i) => {
    const base = i * 8
    return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7}::jsonb,to_timestamp($${base+8}/1000.0))`
  }).join(',')

  await db.query(
    `INSERT INTO execution_checks
       (check_id, project_id, feature_tag, r_layer, file_path, passed, violations, checked_at)
     VALUES ${placeholders}`,
    values
  )
}

export async function loadExecutionResults(projectId: string): Promise<ExecutionCheckResult[]> {
  const result = await db.query<Record<string, unknown>>(
    `SELECT * FROM execution_checks
     WHERE project_id = $1
     ORDER BY checked_at DESC`,
    [projectId]
  )
  return result.rows.map((r) => ({
    checkId:    r.check_id as string,
    projectId:  r.project_id as string,
    featureTag: r.feature_tag as string,
    rLayer:     r.r_layer as number,
    filePath:   r.file_path as string,
    passed:     r.passed as boolean,
    violations: (r.violations as string[]) ?? [],
    checkedAt:  Number(new Date(r.checked_at as string)),
  }))
}
