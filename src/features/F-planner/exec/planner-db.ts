// @liv-standard v1.4
// [F-planner/exec/planner-db.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    w2-item-12, phase-b-item4, phase-4.3
// slice:      F-planner
// layer:      R4
// wires-in:
//   W-ATOM  PlannerJob       ../types/planner-types
//   W-ATOM  PlannerJobId     ../types/planner-types
//   W-ATOM  PipelineStage    ../types/planner-types
//   W-ATOM  PipelineStatus   ../types/planner-types
//   W-ATOM  PipelineReport   ../types/planner-types
//   W-ATOM  IfContract       ../types/planner-types
//   W-ATOM  StageLogEntry    ../types/planner-types
//   W-ATOM  PlannerResult    ../types/planner-types
//   W-ATOM  AdminBuild       @/features/F-admin/types/admin-types
//   W-ATOM  AdminBuildsFilter @/features/F-admin/types/admin-types
//   W-ATOM  PipelineReportSummary @/features/F-admin/types/admin-types
// wires-out:
//   W-FN  dbCountActiveBuildsForUser  →  F-planner/R3  (w2-item-12)
//   W-FN  dbGetBuildsForAdmin         →  F-planner/R3  (phase-b-item4)
// deps:
//   R0  ../types/planner-types
//   R0  @/features/F-admin/types/admin-types
//   R5  @/core/db/client
// validated:  pending
//
// A2: R4 never imports R2 or R3. IPlannerDb declared at R2, wired at R3.
// A4: all DB I/O lives here. No logic beyond row mapping.
//
// step4b2-phase-a (A3, A4):
//   BuildRow extended with transition_count, pipeline_report — mirrors
//   006-pipeline-foundation.sql additions.
//   mapJob() updated to populate PlannerJob.transitionCount and
//   PlannerJob.pipelineReport from the new columns.
//   New functions:
//     dbSetPipelineStatus  — updates status column (extended constraint)
//     dbIncrementTransition — atomic transition_count++, returns new value
//     dbWritePipelineReport — writes pipeline_report jsonb
//     dbUpdateIfContract   — progressive partial IF contract writes pre-freeze
//     dbGetAvailableProviders — queries user_api_keys for user's set providers
//   Axiom cite: A3 — BuildRow is the typed R4 boundary; no raw DB types escape.
//               A4 — all I/O here, never in R1/R2.
//
// w2-item-12 (A4):
//   dbCountActiveBuildsForUser added. Counts builds with status IN
//   ('pending', 'confirmed', 'running') for a given userId. Used by
//   planner-contract.ts to enforce max 1 concurrent build per user.
//   Returns PlannerResult<number>. Direct R4 import from R3 — same pattern
//   as dbGetActiveJobForProject (A2-r3-active-build-check amendment).
//   Axiom cite: A4 — I/O only here. No logic beyond count mapping.
//
// phase-b-item4 (A1, A4):
//   dbGetBuildsForAdmin added. Query logic moved from F-admin/exec/admin-db.ts
//   into F-planner/R4 where it belongs (A1 — F-planner owns builds table).
//   Returns AdminBuild[] — typed atom from F-admin/R0 (A3 — atom crosses boundary).
//   Axiom cite: A1 — single ownership. A4 — all I/O at R4.

import { db } from '@/core/db/client'
import * as fs from 'fs/promises'
import * as path from 'path'
import type {
  PlannerJob,
  PlannerJobId,
  PipelineStage,
  PipelineStatus,
  StageStatus,
  IfContract,
  StageLogEntry,
  PlannerResult,
  PipelineReport,
  FileSnapshot,
} from '../types/planner-types'
import type {
  AdminBuild,
  AdminBuildsFilter,
  PipelineReportSummary,
  PipelineStageEntry,
} from '@/features/F-admin/types/admin-types'
import type { NodeId } from '@/core/types/primitives'

// ── Row type — typed R4 boundary (A3) ─────────────────────────────────────────
// Mirrors the builds table schema after migration 006.
type BuildRow = {
  build_id:          string
  project_id:        string
  user_id:           string
  status:            string
  current_stage:     string | null
  stage_status:      string
  source:            string
  if_contract:       string | null
  pipeline_log:      unknown       // jsonb array
  transition_count:  number        // 006: new column
  pipeline_report:   unknown       // 006: new jsonb column, nullable
  reentry_count:     number        // 007: new column (step4b2-phase-c)
  created_at:        Date
  updated_at:        Date
}

// ── Row mapper ────────────────────────────────────────────────────────────────
function mapJob(r: BuildRow): PlannerJob {
  let pipelineLog: StageLogEntry[] = []
  try {
    pipelineLog = Array.isArray(r.pipeline_log) ? r.pipeline_log as StageLogEntry[] : []
  } catch { pipelineLog = [] }

  let ifContract: IfContract | null = null
  if (r.if_contract) {
    try { ifContract = JSON.parse(r.if_contract) as IfContract } catch { ifContract = null }
  }

  let pipelineReport: PipelineReport | null = null
  if (r.pipeline_report) {
    try {
      pipelineReport = (typeof r.pipeline_report === 'string'
        ? JSON.parse(r.pipeline_report)
        : r.pipeline_report) as PipelineReport
    } catch { pipelineReport = null }
  }

  return {
    jobId:           r.build_id       as PlannerJobId,
    projectId:       r.project_id,
    userId:          r.user_id,
    pipelineStatus:  r.status         as PipelineStatus,
    currentStage:    r.current_stage  as PipelineStage | null,
    stageStatus:     (r.stage_status ?? 'pending') as StageStatus,
    source:          r.source         as 'CONTINUOUS' | 'REENTRY',
    ifContract,
    pipelineLog,
    transitionCount: r.transition_count ?? 0,
    pipelineReport,
    reentryCount:    r.reentry_count  ?? 0,   // step4b2-phase-c
    createdAt:       r.created_at.getTime(),
    updatedAt:       r.updated_at.getTime(),
  }
}

// ── RETURNING clause — used by every mutating query ───────────────────────────
// Single source of truth for the column list. Includes 006 + 007 additions.
const RETURNING = `
  RETURNING build_id, project_id, user_id, status,
            current_stage, stage_status, source,
            if_contract, pipeline_log,
            transition_count, pipeline_report,
            reentry_count,
            created_at, updated_at`

// ── SELECT ─────────────────────────────────────────────────────────────────────

export async function dbGetJob(
  jobId: PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status,
              current_stage, stage_status, source,
              if_contract, pipeline_log,
              transition_count, pipeline_report,
              reentry_count,
              created_at, updated_at
       FROM builds WHERE build_id = $1`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

// ── SELECT active job for project ─────────────────────────────────────────────
// Used by chat route handler to detect whether a build is in progress.
// Returns the most recent pending/confirmed/running job for this project, or null.
// Includes 'running' so the chat route can surface "build in progress" feedback
// rather than routing messages to IN-MAIN during autonomous pipeline execution.

export async function dbGetActiveJobForProject(
  projectId: string
): Promise<PlannerResult<PlannerJob | null>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status,
              current_stage, stage_status, source,
              if_contract, pipeline_log,
              transition_count, pipeline_report,
              reentry_count,
              created_at, updated_at
       FROM builds
       WHERE project_id = $1
         AND status IN ('pending', 'confirmed', 'running')
       ORDER BY created_at DESC
       LIMIT 1`,
      [projectId]
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Database error', context: { cause: String(e) } } }
  }
}

// ── INSERT ─────────────────────────────────────────────────────────────────────

export async function dbCreateJob(
  jobId:     PlannerJobId,
  projectId: string,
  userId:    string,
  source:    'CONTINUOUS' | 'REENTRY'
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `INSERT INTO builds
         (build_id, project_id, user_id, status, source,
          current_stage, stage_status, pipeline_log,
          transition_count, started_at)
       VALUES ($1, $2, $3, 'pending', $4, NULL, 'pending', '[]'::jsonb, 0, now())
       ON CONFLICT (build_id) DO UPDATE
         SET status           = 'pending',
             stage_status     = 'pending',
             transition_count = 0,
             updated_at       = now()
       ${RETURNING}`,
      [jobId, projectId, userId, source]
    )
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to create pipeline job', context: { cause: String(e) } } }
  }
}

// ── UPDATE stage ───────────────────────────────────────────────────────────────

export async function dbUpdateStage(
  jobId:       PlannerJobId,
  stage:       PipelineStage,
  stageStatus: 'running' | 'complete' | 'failed'
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET current_stage = $2,
           stage_status  = $3,
           updated_at    = now()
       WHERE build_id = $1
       ${RETURNING}`,
      [jobId, stage, stageStatus]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to update stage', context: { cause: String(e) } } }
  }
}

// ── APPEND log entry ───────────────────────────────────────────────────────────

export async function dbAppendLogEntry(
  jobId: PlannerJobId,
  entry: StageLogEntry
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
       SET pipeline_log = pipeline_log || $2::jsonb,
           updated_at   = now()
       WHERE build_id = $1`,
      [jobId, JSON.stringify(entry)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to append log entry', context: { cause: String(e) } } }
  }
}

// ── FREEZE contract ────────────────────────────────────────────────────────────

export async function dbFreezeContract(
  jobId:      PlannerJobId,
  ifContract: IfContract
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET if_contract = $2,
           updated_at  = now()
       WHERE build_id = $1
         AND status IN ('pending', 'confirmed')
       ${RETURNING}`,
      [jobId, JSON.stringify(ifContract)]
    )
    // Returns no rows if job not found OR if pipeline is already running/complete/failed.
    // Freeze is idempotent on the same contract — caller owns the uniqueness invariant.
    if (!result.rows[0])
      return { ok: false, error: { code: 'CONFLICT', message: 'Job not found or pipeline already past the gate (status not pending/confirmed)' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to freeze contract', context: { cause: String(e) } } }
  }
}

// ── COMPLETE pipeline ──────────────────────────────────────────────────────────

export async function dbCompletePipeline(
  jobId: PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET status       = 'complete',
           stage_status = 'complete',
           completed_at = now(),
           updated_at   = now()
       WHERE build_id = $1
       ${RETURNING}`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to complete pipeline', context: { cause: String(e) } } }
  }
}

// ── FAIL pipeline ──────────────────────────────────────────────────────────────

export async function dbFailPipeline(
  jobId: PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET status       = 'failed',
           stage_status = 'failed',
           completed_at = now(),
           updated_at   = now()
       WHERE build_id = $1
       ${RETURNING}`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to fail pipeline', context: { cause: String(e) } } }
  }
}

// ── SET pipeline status (step4b2-phase-a) ─────────────────────────────────────
// Updates the status column. Used by handleConfirmBuild to set 'confirmed'.
// Validates against the PipelineStatus union at the call site (R2).

export async function dbSetPipelineStatus(
  jobId:  PlannerJobId,
  status: PipelineStatus
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET status     = $2,
           updated_at = now()
       WHERE build_id = $1
       ${RETURNING}`,
      [jobId, status]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to set pipeline status', context: { cause: String(e) } } }
  }
}

// ── INCREMENT transition counter (step4b2-phase-a) ────────────────────────────
// Atomically increments transition_count. Returns the new count value.
// Called once per handleInMainTurn to track conversation turns.

export async function dbIncrementTransition(
  jobId: PlannerJobId
): Promise<PlannerResult<number>> {
  try {
    const result = await db.query<{ transition_count: number }>(
      `UPDATE builds
       SET transition_count = transition_count + 1,
           updated_at       = now()
       WHERE build_id = $1
       RETURNING transition_count`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: result.rows[0].transition_count }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to increment transition count', context: { cause: String(e) } } }
  }
}

// ── WRITE pipeline report (step4b2-phase-a) ───────────────────────────────────
// Writes the PipelineReport to pipeline_report jsonb.
// Called by handleInMainTurn after the confirmation turn completes.
// Overwrites any existing value — report is the authoritative audit record.

export async function dbWritePipelineReport(
  jobId:  PlannerJobId,
  report: PipelineReport
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
       SET pipeline_report = $2::jsonb,
           updated_at      = now()
       WHERE build_id = $1`,
      [jobId, JSON.stringify(report)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to write pipeline report', context: { cause: String(e) } } }
  }
}

// ── UPDATE partial IF contract (step4b2-phase-a, corrective-3: status guard) ──
// Writes a partial IF contract progressively during IN-MAIN turns, before freeze.
// Status guard: only writes while status = 'pending'. Once status advances to
// 'confirmed' (after dbFreezeContract), this becomes a no-op — prevents a stale
// IN-MAIN turn from overwriting a frozen contract. N1 correctness invariant:
// updateIfContract must not de-freeze a frozen contract.

export async function dbUpdateIfContract(
  jobId:    PlannerJobId,
  contract: Partial<IfContract>
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET if_contract = $2,
           updated_at  = now()
       WHERE build_id = $1
         AND status = 'pending'
       ${RETURNING}`,
      [jobId, JSON.stringify(contract)]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found or no longer in pending state' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to update IF contract', context: { cause: String(e) } } }
  }
}

// ── GET available providers (step4b2-phase-a) ─────────────────────────────────
// Queries user_api_keys for providers where this user has a key set.
// Returns the subset of ['anthropic', 'deepseek'] that the user has configured.
// Used by handleInMainTurn to call resolveModel() (R1) with the right providers.
// Returns [] if no keys are set — R2 guards against proceeding with empty list.

export async function dbGetAvailableProviders(
  userId: string
): Promise<PlannerResult<string[]>> {
  try {
    const result = await db.query<{ provider: string }>(
      `SELECT provider
       FROM user_api_keys
       WHERE user_id = $1
         AND encrypted_key IS NOT NULL`,
      [userId]
    )
    const providers = result.rows.map(r => r.provider)
    return { ok: true, data: providers }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to get available providers', context: { cause: String(e) } } }
  }
}

// ── INCREMENT reentry counter (step4b2-phase-c) ───────────────────────────────
// Atomically increments reentry_count when pipeline resets to IN-MAIN after
// retry exhaustion. Never decrements. Returns the new count so R2 can check
// against FAILSAFE.MAX_REENTRIES immediately.

export async function dbIncrementReentry(
  jobId: PlannerJobId
): Promise<PlannerResult<number>> {
  try {
    const result = await db.query<{ reentry_count: number }>(
      `UPDATE builds
       SET reentry_count = reentry_count + 1,
           updated_at    = now()
       WHERE build_id = $1
       RETURNING reentry_count`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: result.rows[0].reentry_count }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to increment reentry count', context: { cause: String(e) } } }
  }
}

// ── GET model preferences (step4b2-phase-d) ───────────────────────────────────
// Reads user_profiles.model_preferences jsonb directly.
// F-planner reads this column at R4 rather than calling F-user-profile's R3
// contract surface, to avoid a cross-slice R4→R3 import (A2 violation).
// Structural exception documented: same A2-w-inject-bridge pattern.
// Returns null if never set (R2 then calls resolveModel with no preferences,
// preserving Phase A default behaviour unchanged).
//
// A2-r4-model-prefs-read amendment:
//   Direct query of user_profiles.model_preferences from F-planner/R4.
//   Justification:
//     - Single read, no side effects. No F-user-profile logic is invoked.
//     - Calling F-user-profile/R3 from F-planner/R4 would violate A2
//       (R4 cannot import R3 of another slice).
//     - The alternative (IPlannerDb.getModelPreferences → planner-inject calls
//       F-user-profile/R3.getModelPreferences) requires R3-in-inject which is
//       the established A2-w-inject-bridge exception. Equivalent coupling.
//     - user_profiles.model_preferences column is owned by F-user-profile (A1).
//       F-planner reads it read-only. F-user-profile remains sole writer.
//   Axiom cite: A1 — F-user-profile is sole writer. A4 — I/O only here.

// Local type — mirrors ModelPreferences from F-user-profile/types/profile-types.ts.
// R4 cannot import cross-slice (A2). Shape is identical — TS structural typing
// guarantees compatibility at the R2 call site where both types are known.
type ModelTierPrefRow = { provider: string; model: string }
type ModelPrefsRow    = {
  largest:  ModelTierPrefRow | null
  medium:   ModelTierPrefRow | null
  smallest: ModelTierPrefRow | null
}

export async function dbGetModelPreferences(
  userId: string
): Promise<PlannerResult<ModelPrefsRow | null>> {
  try {
    const result = await db.query<{ model_preferences: unknown }>(
      `SELECT model_preferences FROM user_profiles WHERE user_id = $1`,
      [userId]
    )
    if (!result.rows[0]) return { ok: true, data: null }

    const raw = result.rows[0].model_preferences
    if (!raw) return { ok: true, data: null }

    const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as ModelPrefsRow
    return { ok: true, data: parsed ?? null }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to get model preferences', context: { cause: String(e) } } }
  }
}

// ── COUNT active builds for user (w2-item-12) ────────────────────────────────
// Returns the number of builds with active statuses for a given userId.
// Used by planner-contract.ts to enforce max 1 concurrent build per user.
// A4: I/O only. No domain logic — just a count query.

export async function dbCountActiveBuildsForUser(
  userId: string
): Promise<PlannerResult<number>> {
  try {
    const result = await db.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count
       FROM builds
       WHERE user_id = $1
         AND status IN ('pending', 'confirmed', 'running')`,
      [userId]
    )
    return { ok: true, data: result.rows[0]?.count ?? 0 }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to count active builds', context: { cause: String(e) } } }
  }
}

// ── dbGetBuildsForAdmin (phase-b-item4) ───────────────────────────────────────
// Read-only admin projection of builds table. Query moved from F-admin/exec/admin-db.ts.
// A1: F-planner owns builds table — query belongs here.
// A3: AdminBuild atom (F-admin/R0) crosses boundary. No F-admin logic imported.
// A4: I/O only. Row mapping + report parsing — no domain logic.

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
          }) as PipelineStageEntry)
        : [],
    }
  } catch {
    return null
  }
}

function mapAdminBuildRow(r: AdminBuildRow): AdminBuild {
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

export async function dbGetBuildsForAdmin(
  filters: AdminBuildsFilter = {},
): Promise<PlannerResult<AdminBuild[]>> {
  try {
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

    return { ok: true, data: result.rows.map(mapAdminBuildRow) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to query builds for admin', context: { cause: String(e) } } }
  }
}
// ── dbScanProjectFiles (phase-4.3) ───────────────────────────────────────────
// Reads all .ts and .tsx files from the project's src/features/ directory on disk.
// Returns path + content pairs. No compliance analysis — R1 handles that.
// A4: filesystem I/O at R4 only.

async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const paths: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      paths.push(...await walkDir(full))
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      paths.push(full)
    }
  }
  return paths
}

export async function dbScanProjectFiles(
  projectId: string
): Promise<PlannerResult<{ path: string; content: string }[]>> {
  try {
    // Resolve project root — convention: projects stored at a known base path.
    // projectId maps to a directory. src/features/ is the scan target.
    const projectRoot = path.resolve('projects', projectId, 'src', 'features')

    let exists = true
    try { await fs.access(projectRoot) } catch { exists = false }
    if (!exists) return { ok: true, data: [] }

    const filePaths = await walkDir(projectRoot)
    const files: { path: string; content: string }[] = []

    for (const filePath of filePaths) {
      const content = await fs.readFile(filePath, 'utf8')
      // Normalize path to src/features/... relative form
      const relPath = filePath.includes('src/features/')
        ? 'src/features/' + filePath.split('src/features/')[1]
        : filePath
      files.push({ path: relPath, content })
    }

    return { ok: true, data: files }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to scan project files', context: { cause: String(e) } } }
  }
}

// ── dbGetVersionSnapshot (phase-4.3) ─────────────────────────────────────────
// Loads the project_snapshot JSONB column from the latest completed build for
// this project. Returns null if no prior version exists.
// A4: DB I/O at R4 only.

export async function dbGetVersionSnapshot(
  projectId: string
): Promise<PlannerResult<FileSnapshot[] | null>> {
  try {
    const result = await db.query<{ project_snapshot: unknown }>(
      `SELECT project_snapshot
       FROM builds
       WHERE project_id = $1
         AND status = 'complete'
         AND project_snapshot IS NOT NULL
       ORDER BY completed_at DESC
       LIMIT 1`,
      [projectId]
    )
    if (!result.rows[0] || !result.rows[0].project_snapshot) {
      return { ok: true, data: null }
    }

    const raw = result.rows[0].project_snapshot
    const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as FileSnapshot[]
    return { ok: true, data: parsed }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to get version snapshot', context: { cause: String(e) } } }
  }
}

// ── dbStoreVersionSnapshot (phase-4.3) ───────────────────────────────────────
// Writes the full project snapshot to the project_snapshot JSONB column on the
// build record. Called once after successful pipeline completion.
// A4: DB I/O at R4 only.

export async function dbStoreVersionSnapshot(
  buildId:  string,
  snapshot: FileSnapshot[]
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
       SET project_snapshot = $2::jsonb,
           updated_at       = now()
       WHERE build_id = $1`,
      [buildId, JSON.stringify(snapshot)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to store version snapshot', context: { cause: String(e) } } }
  }
}

// ── dbStoreExternalFileCache (phase-4.3) ─────────────────────────────────────
// Stores external (non-LIV) file contents detected during read phase.
// Temporary — retained for TEMP_CACHE_RETENTION_DAYS. Stored in a separate
// JSONB column on the build record.
// A4: DB I/O at R4 only.

export async function dbStoreExternalFileCache(
  buildId: string,
  files:   { path: string; content: string }[]
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
       SET external_file_cache = $2::jsonb,
           updated_at          = now()
       WHERE build_id = $1`,
      [buildId, JSON.stringify(files)]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to store external file cache', context: { cause: String(e) } } }
  }
}

// ── PLAN ANCHOR persistence (phase-5 — PA5 re-entry mechanic) ─────────────────
// Reads/writes builds.plan_anchor_node_id. Populated by runPipeline on
// successful emitPlanForContract; read on re-entry to pass as
// priorPlanAnchorNodeId, populating dependsOn at next createArtifact call —
// AS v2.2 ArA4c then writes the version edge automatically.
//
// Schema requirement (deploy-side):
//   ALTER TABLE builds ADD COLUMN plan_anchor_node_id TEXT NULL;
//
// A1: F-planner is sole writer of this column (planAnchorNodeId is owned by
// the plan emission, which lives in F-planner R2).
// A4: I/O at R4 only.
// A6: R4 declared at owner; R2 consumes via IPlannerDb (W-INJECT).

export async function dbGetPriorPlanAnchor(
  jobId: PlannerJobId
): Promise<PlannerResult<NodeId | null>> {
  try {
    const result = await db.query<{ plan_anchor_node_id: string | null }>(
      `SELECT plan_anchor_node_id FROM builds WHERE build_id = $1`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    const raw = result.rows[0].plan_anchor_node_id
    return { ok: true, data: raw === null ? null : (raw as NodeId) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to read plan anchor', context: { cause: String(e) } } }
  }
}

export async function dbSetPlanAnchor(
  jobId:  PlannerJobId,
  nodeId: NodeId,
): Promise<PlannerResult<void>> {
  try {
    await db.query(
      `UPDATE builds
       SET plan_anchor_node_id = $2,
           updated_at          = now()
       WHERE build_id = $1`,
      [jobId, nodeId as string]
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to write plan anchor', context: { cause: String(e) } } }
  }
}
