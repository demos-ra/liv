// @liv-standard v1.3
// [F-admin/exec/admin-db.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-corrective
// slice:      F-admin
// layer:      R4
// wires-in:
//   W-ATOM  AdminBuild            ../types/admin-types
//   W-ATOM  AdminBuildsFilter     ../types/admin-types
//   W-ATOM  PipelineReportSummary ../types/admin-types
// wires-out:  none  (R4 is never imported. Bound via API route at R4.)
// deps:
//   R0  ../types/admin-types
//   R5  @/core/db/client
// validated: pending
//
// step5b-phaseD (A1, A2, A4):
//   dbGetBuilds — cross-slice read on builds table (F-planner owned).
//   Documented A1 exception. Read-only, no side effects.
//   Axiom cite: A4 — all I/O here. A3 — typed row boundary.
//
// step5b-corrective (A1, A4):
//   Added: dbGetUserEmail(userId) — resolves email from auth_users for admin gate.
//   ValidatedSession is intentionally minimal ({ sessionId, userId } only) — Gap 1
//   in Request Context Contract, tracked for future amendment. F-admin resolves
//   its own data need at R4 rather than extending ValidatedSession (Option B).
//   Cross-slice DB read on auth_users (owned by F-identity) — same documented
//   exception class as dbGetBuilds on builds. Read-only, no side effects.
//   Axiom cite: A4 — I/O at R4 only. A1 exception documented.

import { db } from '@/core/db/client'
import type { AdminBuild, AdminBuildsFilter, PipelineReportSummary } from '../types/admin-types'

// ── AdminBuildRow — typed R4 boundary (A3) ────────────────────────────────────
type AdminBuildRow = {
  build_id:          string
  project_id:        string
  user_id:           string
  status:            string
  current_stage:     string | null
  pipeline_report:   unknown
  transition_count:  number
  reentry_count:     number
  created_at:        Date
  updated_at:        Date
}

// ── parsePipelineReport ───────────────────────────────────────────────────────
function parsePipelineReport(raw: unknown): PipelineReportSummary | null {
  if (!raw) return null
  try {
    const obj = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Record<string, unknown>
    return {
      outcome:          (obj.outcome as string | null) ?? null,
      failureReason:    (obj.failureReason as string | null) ?? null,
      totalTransitions: (obj.totalTransitions as number) ?? 0,
      reentries:        (obj.reentries as number) ?? 0,
      startedAt:        (obj.startedAt as number) ?? 0,
      completedAt:      obj.completedAt as number | undefined,
      stages:           Array.isArray(obj.stages)
        ? (obj.stages as Record<string, unknown>[]).map(s => ({
            instanceId:   String(s.instanceId ?? ''),
            model:        String(s.model ?? ''),
            startedAt:    Number(s.startedAt ?? 0),
            completedAt:  Number(s.completedAt ?? 0),
            tokenCount:   Number(s.tokenCount ?? 0),
            handoffValid: Boolean(s.handoffValid),
          }))
        : [],
    }
  } catch {
    return null
  }
}

// ── mapRow ────────────────────────────────────────────────────────────────────
function mapRow(r: AdminBuildRow): AdminBuild {
  return {
    buildId:         r.build_id,
    projectId:       r.project_id,
    userId:          r.user_id,
    status:          r.status,
    currentStage:    r.current_stage,
    pipelineReport:  parsePipelineReport(r.pipeline_report),
    transitionCount: r.transition_count ?? 0,
    reentryCount:    r.reentry_count ?? 0,
    createdAt:       r.created_at instanceof Date ? r.created_at.getTime() : Number(r.created_at),
    updatedAt:       r.updated_at instanceof Date ? r.updated_at.getTime() : Number(r.updated_at),
  }
}

// ── dbGetBuilds ───────────────────────────────────────────────────────────────
// Read-only query on builds table. Sorted by updated_at desc.
// Default: status IN ('escalated'), limit 50.
// Documented A1 exception — cross-slice read on builds (owned by F-planner).
export async function dbGetBuilds(filters: AdminBuildsFilter = {}): Promise<AdminBuild[]> {
  const statuses = filters.status && filters.status.length > 0
    ? filters.status
    : ['escalated']
  const limit = filters.limit ?? 50

  const placeholders = statuses.map((_, i) => `$${i + 1}`).join(', ')

  const result = await db.query<AdminBuildRow>(
    `SELECT build_id, project_id, user_id, status,
            current_stage, pipeline_report,
            transition_count, reentry_count,
            created_at, updated_at
     FROM   builds
     WHERE  status IN (${placeholders})
     ORDER  BY updated_at DESC
     LIMIT  $${statuses.length + 1}`,
    [...statuses, limit],
  )

  return result.rows.map(mapRow)
}

// ── dbGetUserEmail ────────────────────────────────────────────────────────────
// Resolves email for a userId from auth_users.
// Used by admin route: ValidatedSession lacks email (Gap 1 — intentionally minimal).
// Documented A1 exception — cross-slice read on auth_users (owned by F-identity).
// Read-only, no side effects. Returns null if user not found.
export async function dbGetUserEmail(userId: string): Promise<string | null> {
  const result = await db.query<{ email: string }>(
    `SELECT email FROM auth_users WHERE id = $1 LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.email ?? null
}
