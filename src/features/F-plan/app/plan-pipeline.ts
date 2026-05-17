// @liv-standard v1.5.1 amended sprint-12-shot-3 sprint-13-shot-2
// [F-plan/app/plan-pipeline.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-3 (NEW — moved from F-planner/workflow/planner-workflow — dissolution)
//             sprint-13-shot-2 (R1 import relocated: F-planner/domain/planner-logic → F-plan/domain/plan-logic)
// slice:      F-plan
// layer:      R2
// wires-in:
//   W-ATOM    PlannerJob, PlannerJobId, PipelineStage, PipelineReport  F-plan/types/pipeline-types
//   W-ATOM    PipelineStatus, IfContract, StageLogEntry, PlannerResult  F-plan/types/pipeline-types
//   W-ATOM    BuildRequestPayload, StartPipelinePayload, AdvanceStagePayload  F-plan/types/pipeline-types
//   W-ATOM    FailStagePayload, FreezeContractPayload, ReadSnapshot  F-plan/types/pipeline-types
//   W-ATOM    StageReportEntry, FileSnapshot  F-plan/types/pipeline-types
//   W-ATOM    PLANNER_EVENTS         F-builder/config/builder-events
//   W-ATOM    PLANNER_CONST          F-builder/config/builder-const
//   W-INJECT  IPlannerDb, IAiAdapter  F-builder/domain/builder-pipeline
//   W-ATOM    emitEvent              F-event-system/contract/event-bus
//   W-FN      writeStateChange  F-memory/contract/substrate-contract
//   W-ATOM    getSliceForInstance, getInstanceProfile  @/core/constants/liv-api
// wires-out:
//   W-FN  handleInMainTurn   →  F-plan/R3 plan-contract
//   W-FN  startPipeline      →  F-plan/R3 plan-contract
//   W-FN  freezeContract     →  F-plan/R3 plan-contract
//   W-FN  advanceStage       →  F-plan/R3 plan-contract
//   W-FN  failStage          →  F-plan/R3 plan-contract
//   W-FN  getPipelineStatus  →  F-plan/R3 plan-contract
//   W-FN  isPipelineActive   →  F-plan/R3 plan-contract (re-exported from R3)
//   W-FN  readProjectState   (internal — D5: moved to F-plan alongside handleInMainTurn)
// deps:
//   R0  ../types/pipeline-types
//   R0  @/features/F-builder/config/builder-events
//   R0  @/features/F-builder/config/builder-const
//   R2  @/features/F-builder/domain/builder-pipeline  (type imports only — IPlannerDb, IAiAdapter, IExecutor)
//   R1  ../domain/plan-logic                                              (sprint-13-shot-2: relocated from F-planner)
//   R3  @/features/F-event-system/contract/event-bus
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/constants/liv-api
// validated:  pending
//
// sprint-12-shot-3: handleInMainTurn, readProjectState, startPipeline,
//   freezeContract, advanceStage, failStage, getPipelineStatus, isPipelineActive
//   moved verbatim from F-planner/workflow/planner-workflow.ts.
//   D5 resolution: readProjectState moved here alongside handleInMainTurn (option c).
//   planner-logic.ts R1 functions imported cross-slice pending Sprint B relocation.
//   event slice references updated: 'F-planner' → 'F-plan' in all emitEvent calls.

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { writeStateChange } from '@/features/F-memory/contract/substrate-contract'
import type { IdentityRef, RoleRef, ScopeRef } from '@/features/F-memory/contract/substrate-contract'
import {
  getSliceForInstance,
  getInstanceProfile,
} from '@/core/constants/liv-api'
import type {
  PlannerJob,
  PlannerJobId,
  PipelineStage,
  PipelineStatus,
  PipelineReport,
  StageReportEntry,
  IfContract,
  PlannerResult,
  ReadSnapshot,
  FileSnapshot,
  BuildRequestPayload,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
} from '../types/pipeline-types'
import {
  PLANNER_EVENTS,
  type PipelineStartedPayload,
  type PipelineCompletedPayload,
  type PipelineFailedPayload,
  type StageCompletedPayload,
  type StageFailedPayload,
} from '@/features/F-builder/config/builder-events'
import { PLANNER_CONST } from '@/features/F-builder/config/builder-const'
import type { IPlannerDb, IAiAdapter, IExecutor } from '@/features/F-builder/domain/builder-pipeline'
import {
  nextStage,
  canRetry,
  buildStageLogEntry,
  validateIfContract,
  buildInMainPrompt,
  parseIfFieldsFromResponse,
  isContractComplete,
  buildDecompositionSummary,
  resolveModel,
  assessFileCompliance,
  buildReadSnapshot,
  deriveScopingConstraints,
} from '../domain/plan-logic'

// ── readProjectState (D5: moved to F-plan alongside handleInMainTurn) ─────────

async function readProjectState(
  projectId: string,
  deps:      { db: IPlannerDb }
): Promise<PlannerResult<ReadSnapshot>> {
  const scanResult = await deps.db.scanProjectFiles(projectId)
  if (!scanResult.ok) return scanResult

  const snapshotResult = await deps.db.getVersionSnapshot(projectId)
  const storedSnapshot = snapshotResult.ok ? snapshotResult.data : null

  const assessed = scanResult.data.map(f => {
    const { compliant, issues } = assessFileCompliance(f.content, f.path)
    return { ...f, compliant, issues }
  })

  const snapshot = buildReadSnapshot(assessed, storedSnapshot)

  return { ok: true, data: snapshot }
}

// ── handleInMainTurn ──────────────────────────────────────────────────────────

export async function handleInMainTurn(
  deps:  { db: IPlannerDb; ai: IAiAdapter },
  input: BuildRequestPayload
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob; readSnapshot: ReadSnapshot | null }>> {
  const turnStartedAt = Date.now()

  const readResult = await readProjectState(input.projectId, deps)
  const readSnapshot = readResult.ok ? readResult.data : null

  const activeResult = await deps.db.getActiveJobForProject(input.projectId)
  if (!activeResult.ok) return activeResult

  let job: PlannerJob
  if (!activeResult.data) {
    const newJobId = crypto.randomUUID() as PlannerJobId
    const createResult = await deps.db.createJob(newJobId, input.projectId, input.userId, 'CONTINUOUS')
    if (!createResult.ok) return createResult
    const stageResult = await deps.db.updateStage(newJobId, 'IN_MAIN', 'running')
    if (!stageResult.ok) return stageResult
    await deps.db.appendLogEntry(newJobId, buildStageLogEntry({
      stage: 'IN_MAIN', status: 'running',
      startedAt: Date.now(), completedAt: null,
      message: 'IN-MAIN started', axiomCite: null, retryCount: 0,
    }))
    job = stageResult.data
  } else {
    job = activeResult.data
  }

  const jobId = job.jobId

  const isConfirmationMessage = /^\s*(confirm|yes|approve|looks good|lgtm)\s*[.!]?\s*$/i.test(
    input.message.trim()
  )

  if (isConfirmationMessage && job.ifContract) {
    return handleConfirmationTurn(deps, jobId, job, input.userId, turnStartedAt, readSnapshot)
  }

  const providersResult = await deps.db.getAvailableProviders(input.userId)
  if (!providersResult.ok) return providersResult

  const providers = providersResult.data
  if (providers.length === 0) {
    return { ok: false, error: { code: 'NO_PROVIDERS', message: 'No API keys configured. Please add an API key in account settings.' } }
  }

  const prefsResult  = await deps.db.getModelPreferences(input.userId)
  const preferences  = prefsResult.ok ? prefsResult.data : null

  const { model }       = resolveModel('Largest', providers, preferences)
  const standardSlice   = getSliceForInstance('IN-MAIN')
  const instanceProfile = getInstanceProfile('IN-MAIN')
  const currentContract: Partial<IfContract> = (job.ifContract as Partial<IfContract> | null) ?? {}

  const reentryContext = (job.reentryCount > 0 && job.pipelineReport?.failureReason)
    ? {
        failureReason: job.pipelineReport.failureReason,
        failedStage:   job.pipelineReport.stages.at(-1)?.instanceId ?? 'unknown',
        reentryCount:  job.reentryCount,
      }
    : undefined

  const scopingConstraints = readSnapshot
    ? deriveScopingConstraints(readSnapshot)
    : undefined

  const systemPrompt = buildInMainPrompt(
    standardSlice, instanceProfile, currentContract,
    reentryContext, scopingConstraints
  )

  let fullResponse = ''
  let totalTokens  = 0

  const aiResult = await deps.ai.streamCompletion({
    userId:  input.userId,
    modelId: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: input.message },
    ],
    onChunk: chunk => { fullResponse += chunk },
  })

  if (!aiResult.ok) return aiResult
  totalTokens = aiResult.data.totalTokens

  const mergedContract = parseIfFieldsFromResponse(fullResponse, currentContract)

  const updateResult = await deps.db.updateIfContract(jobId, mergedContract)
  if (!updateResult.ok) return updateResult
  job = updateResult.data

  await deps.db.incrementTransition(jobId)

  const { complete } = isContractComplete(mergedContract)

  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: 'IN_MAIN', status: 'running',
    startedAt: turnStartedAt, completedAt: Date.now(),
    message: `Turn complete. Fields filled: ${Object.keys(mergedContract).length}/10. Tokens: ${totalTokens}`,
    axiomCite: null, retryCount: 0,
  }))

  if (complete) {
    const summary = buildDecompositionSummary(mergedContract as IfContract)
    return { ok: true, data: { response: summary, isConfirmation: false, job, readSnapshot } }
  }

  return { ok: true, data: { response: fullResponse, isConfirmation: false, job, readSnapshot } }
}

// ── handleConfirmationTurn ────────────────────────────────────────────────────

async function handleConfirmationTurn(
  deps:          { db: IPlannerDb; ai: IAiAdapter },
  jobId:         PlannerJobId,
  job:           PlannerJob,
  userId:        string,
  turnStartedAt: number,
  readSnapshot:  ReadSnapshot | null = null
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob; readSnapshot: ReadSnapshot | null }>> {

  const frozenContract: IfContract = {
    ...(job.ifContract as IfContract),
    frozenAt: Date.now(),
    frozenBy: userId,
  }
  const freezeResult = await deps.db.freezeContract(jobId, frozenContract)
  if (!freezeResult.ok) return freezeResult

  const statusResult = await deps.db.setPipelineStatus(jobId, 'confirmed')
  if (!statusResult.ok) return statusResult
  const confirmedJob = statusResult.data

  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: 'IN_MAIN', status: 'complete',
    startedAt: turnStartedAt, completedAt: Date.now(),
    message: 'Contract confirmed by user. Pipeline starting.',
    axiomCite: null, retryCount: 0,
  }))

  const inMainReport: PipelineReport = {
    buildId:          jobId as string,
    userId,
    stages: [{
      instanceId:   'IN_MAIN',
      model:        'unknown',
      startedAt:    turnStartedAt,
      completedAt:  Date.now(),
      tokenCount:   0,
      handoffValid: true,
      retries:      0,
      errors:       [],
    } satisfies StageReportEntry],
    totalTransitions: confirmedJob.transitionCount,
    reentries:        confirmedJob.reentryCount,
    outcome:          null,
    startedAt:        turnStartedAt,
  }
  await deps.db.writePipelineReport(jobId, inMainReport)

  await emitEvent({
    type:    PLANNER_EVENTS.STAGE_COMPLETED,
    slice:   'F-plan',
    payload: {
      jobId:   jobId as string,
      stage:   'IN_MAIN',
      message: 'Contract confirmed — pipeline queued',
    } satisfies StageCompletedPayload,
  })

  const ack = [
    '✓ Contract confirmed and frozen.',
    '',
    'The pipeline is starting. Track progress in the dashboard.',
    'IN-BUILD → IN-RESOLVE → IN-AUDIT → IN-COMPILE → IN-QA',
  ].join('\n')

  return { ok: true, data: { response: ack, isConfirmation: true, job: confirmedJob, readSnapshot } }
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

  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: 'IN_MAIN', status: 'running',
    startedAt: Date.now(), completedAt: null,
    message: 'Pipeline started — IN_MAIN running', axiomCite: null, retryCount: 0,
  }))

  await emitEvent({
    type:    PLANNER_EVENTS.PIPELINE_STARTED,
    slice:   'F-plan',
    payload: { jobId, projectId: input.projectId, userId: input.userId, source: input.source } satisfies PipelineStartedPayload,
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
  deps:  { db: IPlannerDb; executor?: IExecutor },
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

  if (currentStage === 'IN_COMPILE' && deps.executor) {
    const files      = input.files ?? []
    const execResult = await deps.executor.run({
      jobId:     job.jobId as string,
      projectId: job.projectId,
      files,
      timeoutMs: PLANNER_CONST.AI_CALL_TIMEOUT_MS,
    })

    if (!execResult.ok) {
      await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
        stage: 'IN_COMPILE', status: 'failed',
        startedAt: Date.now(), completedAt: Date.now(),
        message: `Executor error: ${execResult.error.message}`,
        axiomCite: 'A4', retryCount: 0,
      }))
      await emitEvent({
        type:    PLANNER_EVENTS.STAGE_FAILED,
        slice:   'F-plan',
        payload: { jobId: input.jobId, stage: 'IN_COMPILE', reason: execResult.error.message, axiomCite: 'A4', retryCount: 0 } satisfies StageFailedPayload,
      })
      return deps.db.failPipeline(input.jobId)
    }

    if (!execResult.data.passed) {
      const summary = execResult.data.testSummary
      const msg = summary
        ? `Tests failed: ${summary.failed}/${summary.total} failing. Exit ${execResult.data.exitCode}. Duration ${execResult.data.durationMs}ms.`
        : `Execution failed. Exit ${execResult.data.exitCode}. Duration ${execResult.data.durationMs}ms.${execResult.data.timedOut ? ' TIMED OUT.' : ''}`
      await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
        stage: 'IN_COMPILE', status: 'failed',
        startedAt: Date.now(), completedAt: Date.now(),
        message: msg, axiomCite: null, retryCount: 0,
      }))
      await emitEvent({
        type:    PLANNER_EVENTS.STAGE_FAILED,
        slice:   'F-plan',
        payload: { jobId: input.jobId, stage: 'IN_COMPILE', reason: msg, axiomCite: null, retryCount: 0 } satisfies StageFailedPayload,
      })
      return deps.db.failPipeline(input.jobId)
    }

    const summary = execResult.data.testSummary
    input = {
      ...input,
      message: summary
        ? `Execution passed: ${summary.passed}/${summary.total} tests. Duration ${execResult.data.durationMs}ms.`
        : `Execution passed. Exit 0. Duration ${execResult.data.durationMs}ms.`,
    }
  }

  const startedAt = job.pipelineLog.find(e => e.stage === currentStage && e.status === 'running')?.startedAt ?? Date.now()

  await deps.db.appendLogEntry(input.jobId, buildStageLogEntry({
    stage: currentStage, status: 'complete',
    startedAt, completedAt: Date.now(),
    message: input.message, axiomCite: null, retryCount: 0,
  }))

  await emitEvent({
    type:    PLANNER_EVENTS.STAGE_COMPLETED,
    slice:   'F-plan',
    payload: { jobId: input.jobId, stage: currentStage, message: input.message } satisfies StageCompletedPayload,
  })

  const next = nextStage(currentStage)

  if (!next) {
    const doneResult = await deps.db.completePipeline(input.jobId)
    if (!doneResult.ok) return doneResult
    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_COMPLETED,
      slice:   'F-plan',
      payload: { jobId: input.jobId, projectId: job.projectId, userId: job.userId, featureIntent: job.ifContract?.featureIntent ?? null, outcome: job.pipelineReport?.outcome ?? null } satisfies PipelineCompletedPayload,
    })
    writeStateChange({
      userId: job.userId,
      content: {
        identities: [
          'pipeline-completed'    as IdentityRef,
          input.jobId             as unknown as IdentityRef,
          job.projectId           as IdentityRef,
          job.userId              as IdentityRef,
        ],
        relations: [
          {
            type:                'pipeline-completed' as IdentityRef,
            modality:            'declarative',
            identitiesWithRoles: [
              { identity: input.jobId   as unknown as IdentityRef, role: 'pipeline' as RoleRef },
              { identity: job.projectId as IdentityRef,            role: 'project'  as RoleRef },
              ...(job.pipelineReport?.outcome != null
                ? [{ identity: job.pipelineReport.outcome as IdentityRef, role: 'outcome' as RoleRef }]
                : []),
            ],
            negation: false,
          },
        ],
      },
      metadata: {
        time:   Date.now(),
        source: { channel: 'internal-derivation', scope: job.projectId as ScopeRef },
      },
    }).catch((err: unknown) => {
      console.error('[F-plan] pipeline-completed substrate write failed',
        err instanceof Error ? err.message : err)
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
    slice:   'F-plan',
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
    slice:   'F-plan',
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

// ── isPipelineActive ──────────────────────────────────────────────────────────
// Read-only query for F-chat. Returns pipeline active state + status.
// Moved from F-planner/contract/planner-contract.ts; re-exported from F-plan/R3.

export async function isPipelineActive(
  projectId: string,
  deps: { db: IPlannerDb }
): Promise<{ active: boolean; status: string | null }> {
  const result = await deps.db.getActiveJobForProject(projectId)
  if (!result.ok || !result.data) return { active: false, status: null }
  return { active: true, status: result.data.pipelineStatus }
}

// ─── End ──────────────────────────────────────────────────────────────────────
