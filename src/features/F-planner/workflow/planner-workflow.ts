// @liv-standard v1.3
// [F-planner/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-event-bus-r3
// slice:      F-planner
// layer:      R2
// wires-in:
//   W-ATOM    PlannerJob            ../types/planner-types
//   W-ATOM    PlannerJobId          ../types/planner-types
//   W-ATOM    PipelineStage         ../types/planner-types
//   W-ATOM    StageLogEntry         ../types/planner-types
//   W-ATOM    IfContract            ../types/planner-types
//   W-ATOM    PlannerResult         ../types/planner-types
//   W-ATOM    StartPipelinePayload  ../types/planner-types
//   W-ATOM    AdvanceStagePayload   ../types/planner-types
//   W-ATOM    FailStagePayload      ../types/planner-types
//   W-ATOM    FreezeContractPayload ../types/planner-types
//   W-ATOM    PLANNER_EVENTS        ../types/planner-events
//   W-ATOM    emitEvent             F-event-system/contract/event-bus  (A2-event-bus-r3)
// wires-out:
//   W-INJECT  IPlannerDb  →  F-planner/R3 (planner-inject.ts binds, planner-contract.ts consumes)
//   W-INJECT  IAiAdapter  →  F-planner/R3 (planner-inject.ts binds, planner-contract.ts consumes)
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-events
//   R1  ../domain/planner-logic
//   R3  F-event-system/contract/event-bus  (A2-event-bus-r3 — see below)
// validated:  2026-03-12
//
// A2-event-bus-r3 amendment:
//   emitEvent lives in F-event-system/contract/ (R3) because the bus is DB-backed and
//   requires I/O infrastructure. All R2 workflow files in this codebase import it the
//   same way. The correct resolution is to expose a thin emitEvent shim at F-event-system R0
//   that delegates to the R3 implementation — deferred to the F-event-system rebuild
//   (logged as pre-existing D-series debt). Until that rebuild, all workflow files carry
//   this amendment to make the deviation auditable.

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import type {
  PlannerJob,
  PlannerJobId,
  PipelineStage,
  IfContract,
  StageLogEntry,
  PlannerResult,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
} from '../types/planner-types'
import {
  PLANNER_EVENTS,
  type PipelineStartedPayload,
  type PipelineCompletedPayload,
  type PipelineFailedPayload,
  type StageCompletedPayload,
  type StageFailedPayload,
} from '../types/planner-events'
import {
  nextStage,
  canRetry,
  buildStageLogEntry,
  validateIfContract,
} from '../domain/planner-logic'

// ── W-INJECT interfaces ────────────────────────────────────────────────────────
// Declared at R2. Implemented at R4 (exec/). Bound at R3 (contract/planner-inject.ts).
// R2 never imports R4. R4 never imports R2. R3 is the bridge.

export interface IPlannerDb {
  getJob(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
  createJob(jobId: PlannerJobId, projectId: string, userId: string, source: 'CONTINUOUS' | 'REENTRY'): Promise<PlannerResult<PlannerJob>>
  updateStage(jobId: PlannerJobId, stage: PipelineStage, stageStatus: 'running' | 'complete' | 'failed'): Promise<PlannerResult<PlannerJob>>
  appendLogEntry(jobId: PlannerJobId, entry: StageLogEntry): Promise<PlannerResult<void>>
  freezeContract(jobId: PlannerJobId, ifContract: IfContract): Promise<PlannerResult<PlannerJob>>
  completePipeline(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
  failPipeline(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
}

export interface IAiAdapter {
  streamCompletion(opts: {
    userId:   string
    modelId:  string
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
    onChunk:  (chunk: string) => void
  }): Promise<PlannerResult<{ totalTokens: number; modelId: string }>>
}

// ── startPipeline ─────────────────────────────────────────────────────────────

export async function startPipeline(
  deps:  { db: IPlannerDb },
  input: StartPipelinePayload
): Promise<PlannerResult<PlannerJob>> {
  const jobId  = input.buildId as PlannerJobId
  const result = await deps.db.createJob(jobId, input.projectId, input.userId, input.source)
  if (!result.ok) return result

  const stageResult = await deps.db.updateStage(jobId, 'IN_MAIN', 'running')
  if (!stageResult.ok) return stageResult

  const logEntry = buildStageLogEntry({
    stage: 'IN_MAIN', status: 'running',
    startedAt: Date.now(), completedAt: null,
    message: 'Pipeline started — IN_MAIN running', axiomCite: null, retryCount: 0,
  })
  await deps.db.appendLogEntry(jobId, logEntry)

  await emitEvent({
    type:    PLANNER_EVENTS.PIPELINE_STARTED,
    slice:   'F-planner',
    payload: {
      jobId, projectId: input.projectId, userId: input.userId, source: input.source,
    } satisfies PipelineStartedPayload,
  })

  return stageResult
}

// ── freezeContract ────────────────────────────────────────────────────────────

export async function freezeContract(
  deps:  { db: IPlannerDb },
  input: FreezeContractPayload
): Promise<PlannerResult<PlannerJob>> {
  const err = validateIfContract(input.ifContract)
  if (err) return { ok: false, error: err }
  return deps.db.freezeContract(input.jobId, input.ifContract)
}

// ── advanceStage ──────────────────────────────────────────────────────────────

export async function advanceStage(
  deps:  { db: IPlannerDb },
  input: AdvanceStagePayload
): Promise<PlannerResult<PlannerJob>> {
  const jobResult = await deps.db.getJob(input.jobId)
  if (!jobResult.ok) return jobResult

  const job          = jobResult.data
  const currentStage = job.currentStage

  if (!currentStage)
    return { ok: false, error: { code: 'INVALID_STATE', message: 'No active stage to advance from' } }

  if (job.stageStatus !== 'running')
    return { ok: false, error: { code: 'INVALID_STATE', message: `Stage ${currentStage} is not running (status: ${job.stageStatus})` } }

  const startedAt = job.pipelineLog.find(e => e.stage === currentStage && e.status === 'running')?.startedAt ?? Date.now()

  await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
    stage: currentStage, status: 'complete',
    startedAt, completedAt: Date.now(),
    message: input.message, axiomCite: null, retryCount: 0,
  }))

  await emitEvent({
    type:    PLANNER_EVENTS.STAGE_COMPLETED,
    slice:   'F-planner',
    payload: { jobId: input.jobId, stage: currentStage, message: input.message } satisfies StageCompletedPayload,
  })

  const next = nextStage(currentStage)

  if (!next) {
    const doneResult = await deps.db.completePipeline(input.jobId)
    if (!doneResult.ok) return doneResult

    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_COMPLETED,
      slice:   'F-planner',
      payload: { jobId: input.jobId, projectId: job.projectId, userId: job.userId } satisfies PipelineCompletedPayload,
    })

    return doneResult
  }

  const nextResult = await deps.db.updateStage(input.jobId, next, 'running')
  if (!nextResult.ok) return nextResult

  await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
    stage: next, status: 'running',
    startedAt: Date.now(), completedAt: null,
    message: null, axiomCite: null, retryCount: 0,
  }))

  return nextResult
}

// ── failStage ─────────────────────────────────────────────────────────────────

export async function failStage(
  deps:  { db: IPlannerDb },
  input: FailStagePayload
): Promise<PlannerResult<PlannerJob>> {
  const jobResult = await deps.db.getJob(input.jobId)
  if (!jobResult.ok) return jobResult

  const job          = jobResult.data
  const currentStage = job.currentStage

  if (!currentStage)
    return { ok: false, error: { code: 'INVALID_STATE', message: 'No active stage to fail' } }

  const retryCount = job.pipelineLog.filter(e => e.stage === currentStage).length
  const startedAt  = job.pipelineLog.find(e => e.stage === currentStage && e.status === 'running')?.startedAt ?? Date.now()

  await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
    stage: currentStage, status: 'failed',
    startedAt, completedAt: Date.now(),
    message: input.reason, axiomCite: input.axiomCite, retryCount,
  }))

  await emitEvent({
    type:    PLANNER_EVENTS.STAGE_FAILED,
    slice:   'F-planner',
    payload: { jobId: input.jobId, stage: currentStage, reason: input.reason, axiomCite: input.axiomCite, retryCount } satisfies StageFailedPayload,
  })

  if (canRetry(currentStage, retryCount)) {
    const retryResult = await deps.db.updateStage(input.jobId, currentStage, 'running')
    await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
      stage: currentStage, status: 'running',
      startedAt: Date.now(), completedAt: null,
      message: `Retry ${retryCount + 1}`, axiomCite: null, retryCount: retryCount + 1,
    }))
    return retryResult
  }

  const failResult = await deps.db.failPipeline(input.jobId)
  if (!failResult.ok) return failResult

  await emitEvent({
    type:    PLANNER_EVENTS.PIPELINE_FAILED,
    slice:   'F-planner',
    payload: { jobId: input.jobId, projectId: job.projectId, stage: currentStage, reason: input.reason, axiomCite: input.axiomCite } satisfies PipelineFailedPayload,
  })

  return failResult
}

// ── getPipelineStatus ─────────────────────────────────────────────────────────

export async function getPipelineStatus(
  deps:  { db: IPlannerDb },
  jobId: PlannerJobId
): Promise<PlannerResult<PlannerJob>> {
  return deps.db.getJob(jobId)
}
