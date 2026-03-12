// @liv-standard v1.3
// [F-planner/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R4
// wires-in:
//   W-ATOM  PlannerJob      ../types/planner-types
//   W-ATOM  PlannerJobId    ../types/planner-types
//   W-ATOM  PipelineStage   ../types/planner-types
//   W-ATOM  IfContract      ../types/planner-types
//   W-ATOM  StageLogEntry   ../types/planner-types
//   W-ATOM  PlannerResult   ../types/planner-types
// wires-out:  none  (R4 is never imported. Injected into R2 via interface at R3.)
// deps:
//   R0  ../types/planner-types
//   R5  @/core/db/client
// validated:  2026-03-12

// A2: R4 never imports R2 or R3. IInterface declared at R2, wired at R3.
// A4: all DB I/O lives here. No logic beyond row mapping.

import { db } from '@/core/db/client'
import type {
  PlannerJob,
  PlannerJobId,
  PipelineStage,
  PipelineStatus,
  StageStatus,
  IfContract,
  StageLogEntry,
  PlannerResult,
} from '../types/planner-types'

// ── Row type — typed R4 boundary (A3) ─────────────────────────────────────────
type BuildRow = {
  build_id:       string
  project_id:     string
  user_id:        string
  status:         string
  current_stage:  string | null
  stage_status:   string
  source:         string
  if_contract:    string | null
  pipeline_log:   unknown       // jsonb array
  created_at:     Date
  updated_at:     Date
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

  return {
    jobId:          r.build_id        as PlannerJobId,
    projectId:      r.project_id,
    userId:         r.user_id,
    pipelineStatus: r.status          as PipelineStatus,
    currentStage:   r.current_stage   as PipelineStage | null,
    stageStatus:    (r.stage_status ?? 'pending') as StageStatus,
    source:         r.source          as 'CONTINUOUS' | 'REENTRY',
    ifContract,
    pipelineLog,
    createdAt:      r.created_at.getTime(),
    updatedAt:      r.updated_at.getTime(),
  }
}

// ── SELECT ─────────────────────────────────────────────────────────────────────

export async function dbGetJob(
  jobId: PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `SELECT build_id, project_id, user_id, status,
              current_stage, stage_status, source,
              if_contract, pipeline_log,
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

// ── INSERT ─────────────────────────────────────────────────────────────────────
// Creates a new pipeline job — writes the planner view of the build row.
// F-project owns the build row creation; F-planner calls this after F-project
// has created the build, initialising the planner-specific columns.

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
          current_stage, stage_status, pipeline_log, started_at)
       VALUES ($1, $2, $3, 'running', $4, NULL, 'pending', '[]'::jsonb, now())
       ON CONFLICT (build_id) DO UPDATE
         SET status = 'running', stage_status = 'pending', updated_at = now()
       RETURNING build_id, project_id, user_id, status,
                 current_stage, stage_status, source,
                 if_contract, pipeline_log, created_at, updated_at`,
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
       RETURNING build_id, project_id, user_id, status,
                 current_stage, stage_status, source,
                 if_contract, pipeline_log, created_at, updated_at`,
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
// Appends a single StageLogEntry to pipeline_log jsonb array atomically.

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
// Sets if_contract — immutable after this write (enforced at application layer).

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
         AND if_contract IS NULL
       RETURNING build_id, project_id, user_id, status,
                 current_stage, stage_status, source,
                 if_contract, pipeline_log, created_at, updated_at`,
      [jobId, JSON.stringify(ifContract)]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'CONFLICT', message: 'IF contract already frozen or job not found' } }
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
       RETURNING build_id, project_id, user_id, status,
                 current_stage, stage_status, source,
                 if_contract, pipeline_log, created_at, updated_at`,
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
  jobId:  PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  try {
    const result = await db.query<BuildRow>(
      `UPDATE builds
       SET status       = 'failed',
           stage_status = 'failed',
           completed_at = now(),
           updated_at   = now()
       WHERE build_id = $1
       RETURNING build_id, project_id, user_id, status,
                 current_stage, stage_status, source,
                 if_contract, pipeline_log, created_at, updated_at`,
      [jobId]
    )
    if (!result.rows[0])
      return { ok: false, error: { code: 'NOT_FOUND', message: 'Pipeline job not found' } }
    return { ok: true, data: mapJob(result.rows[0]) }
  } catch (e) {
    return { ok: false, error: { code: 'DB_ERROR', message: 'Failed to fail pipeline', context: { cause: String(e) } } }
  }
}
