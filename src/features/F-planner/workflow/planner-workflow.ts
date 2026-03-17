// @liv-standard v1.3
// [F-planner/workflow/planner-workflow.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b4-handoff
// slice:      F-planner
// layer:      R2
// wires-in:
//   W-ATOM    PlannerJob             ../types/planner-types
//   W-ATOM    PlannerJobId           ../types/planner-types
//   W-ATOM    PipelineStage          ../types/planner-types
//   W-ATOM    PipelineStatus         ../types/planner-types
//   W-ATOM    PipelineReport         ../types/planner-types
//   W-ATOM    StageLogEntry          ../types/planner-types
//   W-ATOM    IfContract             ../types/planner-types
//   W-ATOM    PlannerResult          ../types/planner-types
//   W-ATOM    BuildRequestPayload    ../types/planner-types
//   W-ATOM    StartPipelinePayload   ../types/planner-types
//   W-ATOM    AdvanceStagePayload    ../types/planner-types
//   W-ATOM    FailStagePayload       ../types/planner-types
//   W-ATOM    FreezeContractPayload  ../types/planner-types
//   W-ATOM    FileEntry              ../types/planner-types
//   W-ATOM    InstanceCallResult     ../types/planner-types
//   W-ATOM    PLANNER_EVENTS         ../types/planner-events
//   W-ATOM    PLANNER_CONST          ../types/planner-const
//   W-ATOM    emitEvent              F-event-system/contract/event-bus
//   W-ATOM    getSliceForInstance    @/core/constants/liv-api
//   W-ATOM    getInstanceProfile     @/core/constants/liv-api
//   W-ATOM    getPacketForInstance   @/core/constants/liv-api
//   W-ATOM    getTemplatesForFlow    @/core/constants/liv-api
//   W-ATOM    getTemplate            @/core/constants/liv-api
//   W-ATOM    getHandoff             @/core/constants/liv-api
//   W-FN      validateHandoff        @/core/constants/liv-api  (step4b4-handoff — replaces validateHandoffShape)
//   W-ATOM    InstanceId             @/core/constants/liv-standard.types  (step4b4-handoff — type import for cast)
// wires-out:
//   W-INJECT  IPlannerDb   →  F-planner/R3 (planner-inject.ts binds, planner-contract.ts consumes)
//   W-INJECT  IAiAdapter   →  F-planner/R3
//   W-INJECT  IExecutor    →  F-planner/R3
//   W-INJECT  IOutputWriter →  F-planner/R3 (planner-inject.ts binds — step4b2-phase-b)
//   W-FN      handleInMainTurn  →  F-planner/R3
//   W-FN      runPipeline       →  F-planner/R3
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-events
//   R0  ../types/planner-const
//   R1  ../domain/planner-logic
//   R3  @/features/F-event-system/contract/event-bus
//   R5  @/core/constants/liv-api
// validated:  pending
//
// A2-event-bus-r3 amendment: (unchanged)
// step3-executor amendment: (unchanged)
// step4b2-phase-a: (unchanged)
//
// step4b2-phase-b: (unchanged — IOutputWriter, runPipeline, fire-and-forget)
//
// step4b2-phase-c (A2, A3, A4):
//   IPlannerDb extended: incrementReentry() added.
//   runPipeline() retry loops replace fail-fast: classifyError dispatches to
//   CLASS_2 retry-with-context or CLASS_3 infrastructure retry/escalation.
//   IN-COMPILE tsc loop: detectStall routes to IN-DIAGNOSE sub-routine.
//   checkFailsafes() called before every stage transition.
//   Re-entry: retry exhaustion → writePipelineReport(failure) → setPipelineStatus('pending')
//   → incrementReentry() → return. Next handleInMainTurn call detects reentryCount > 0
//   and prepends failure context via buildInMainPrompt reentryContext param.
//   handleInMainTurn extended: re-entry detection and context injection.
//   Axiom cite: A2 — no new R4 imports. A4 — all I/O via injected interfaces.
//
// step4b4-handoff (A2, A7):
//   validateHandoffShape (R1) + getHandoff two-step replaced with single
//   validateHandoff() from @/core/constants/liv-api (R5) at both call sites.
//   getHandoff removed from imports — validateHandoff looks it up internally.
//   validateHandoffShape deleted from planner-logic.ts (A7 — zero consumers).
//   InstanceId imported from liv-standard.types for toId cast in runRetryStage.
//   Axiom cite: A2 — R2 uses canonical R5 fn. A7 — dead R1 helper removed.

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import {
  getSliceForInstance,
  getInstanceProfile,
  getPacketForInstance,
  getTemplatesForFlow,
  getTemplate,
  validateHandoff,
} from '@/core/constants/liv-api'
import type { InstanceId } from '@/core/constants/liv-standard.types'
import type {
  PlannerJob,
  PlannerJobId,
  PipelineStage,
  PipelineStatus,
  PipelineReport,
  StageReportEntry,
  IfContract,
  StageLogEntry,
  PlannerResult,
  BuildRequestPayload,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
  FileEntry,
  InstanceCallResult,
} from '../types/planner-types'
import {
  PLANNER_EVENTS,
  type PipelineStartedPayload,
  type PipelineCompletedPayload,
  type PipelineFailedPayload,
  type StageCompletedPayload,
  type StageFailedPayload,
} from '../types/planner-events'
import { PLANNER_CONST } from '../types/planner-const'
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
  buildInstancePrompt,
  parseInstanceResponse,
  classifyError,
  detectStall,
  checkFailsafes,
} from '../domain/planner-logic'

// ── Local shape — ModelPreferences subset for IPlannerDb return type ──────────
// R2 cannot import from F-user-profile (cross-slice) — A2. Mirrors the shape
// declared in planner-logic.ts (R1) and planner-db.ts (R4). Declared at R2
// of owner for use in IPlannerDb interface only (A6). Not exported.
type ModelTierPreferenceLike = { provider: string; model: string }
type ModelPreferencesLike = {
  largest:  ModelTierPreferenceLike | null
  medium:   ModelTierPreferenceLike | null
  smallest: ModelTierPreferenceLike | null
}

// ── W-INJECT interfaces ────────────────────────────────────────────────────────

export interface IPlannerDb {
  getJob(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
  getActiveJobForProject(projectId: string): Promise<PlannerResult<PlannerJob | null>>
  createJob(jobId: PlannerJobId, projectId: string, userId: string, source: 'CONTINUOUS' | 'REENTRY'): Promise<PlannerResult<PlannerJob>>
  updateStage(jobId: PlannerJobId, stage: PipelineStage, stageStatus: 'running' | 'complete' | 'failed'): Promise<PlannerResult<PlannerJob>>
  appendLogEntry(jobId: PlannerJobId, entry: StageLogEntry): Promise<PlannerResult<void>>
  freezeContract(jobId: PlannerJobId, ifContract: IfContract): Promise<PlannerResult<PlannerJob>>
  completePipeline(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
  failPipeline(jobId: PlannerJobId): Promise<PlannerResult<PlannerJob>>
  setPipelineStatus(jobId: PlannerJobId, status: PipelineStatus): Promise<PlannerResult<PlannerJob>>
  incrementTransition(jobId: PlannerJobId): Promise<PlannerResult<number>>
  writePipelineReport(jobId: PlannerJobId, report: PipelineReport): Promise<PlannerResult<void>>
  updateIfContract(jobId: PlannerJobId, contract: Partial<IfContract>): Promise<PlannerResult<PlannerJob>>
  getAvailableProviders(userId: string): Promise<PlannerResult<string[]>>
  incrementReentry(jobId: PlannerJobId): Promise<PlannerResult<number>>
  getModelPreferences(userId: string): Promise<PlannerResult<ModelPreferencesLike | null>>  // step4b2-phase-d
}

export interface IAiAdapter {
  streamCompletion(opts: {
    userId:   string
    modelId:  string
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
    onChunk:  (chunk: string) => void
  }): Promise<PlannerResult<{ totalTokens: number; modelId: string }>>
}

export interface IExecutor {
  run(job: {
    jobId:     string
    projectId: string
    files:     Array<{ path: string; content: string }>
    timeoutMs: number
  }): Promise<{
    ok:   true
    data: {
      passed:      boolean
      exitCode:    number
      stdout:      string
      stderr:      string
      testSummary: { total: number; passed: number; failed: number; skipped: number } | null
      durationMs:  number
      timedOut:    boolean
    }
  } | {
    ok:    false
    error: { code: string; message: string; context?: Record<string, unknown> }
  }>
}

// ── IOutputWriter — W-INJECT interface for file persistence (step4b2-phase-b) ──
// Declared at R2. Implemented at R3 (planner-inject.ts) via structural exception:
// inject imports dbReplaceOutputFiles from F-output/exec/output-db (R4) directly,
// same pattern as A2-r3-active-build-check. Deferred to proper F-output surface
// in Phase C. Axiom cite: A1 — F-planner owns pipeline execution; file write is
// its responsibility. A3 — FileEntry[] is the typed boundary atom.
export interface IOutputWriter {
  writeFiles(jobId: string, files: FileEntry[]): Promise<PlannerResult<void>>
}

// ── runPipeline (step4b2-phase-c: retry loops, re-entry, failsafes) ───────────
// Full sequential pipeline execution with retry and re-entry logic.
// Called fire-and-forget from handleConfirmationTurn.
//
// Error handling per class:
//   CLASS_2 (output wrong): retry with error context. Budget → re-entry to IN-MAIN.
//   CLASS_3 (infrastructure): retry once (AI_RETRY_LIMIT). Second → 'escalated'.
//
// Re-entry sequence:
//   1. Write failure report to pipeline_report (failureReason set).
//   2. Set pipeline_status = 'pending'. Increment reentry_count.
//   3. Return — pipeline idle. Next user message routes back to handleInMainTurn.
//
// Failsafes checked before every stage transition via checkFailsafes() (R1).

export async function runPipeline(
  deps:  { db: IPlannerDb; ai: IAiAdapter; executor: IExecutor; output: IOutputWriter },
  jobId: PlannerJobId
): Promise<void> {
  const pipelineStartedAt = Date.now()

  const jobResult = await deps.db.getJob(jobId)
  if (!jobResult.ok) {
    console.error(JSON.stringify({ level: 'error', event: 'pipeline.load.failed', jobId, error: jobResult.error }))
    return
  }
  const job      = jobResult.data
  // N2 corrective: null check before cast — TypeScript can now verify both paths.
  // job.ifContract is IfContract | null; guard null first, then narrow the type.
  if (!job.ifContract) { await deps.db.failPipeline(jobId); return }
  const contract = job.ifContract as IfContract

  const providersResult = await deps.db.getAvailableProviders(job.userId)
  if (!providersResult.ok) { await deps.db.failPipeline(jobId); return }
  const providers = providersResult.data

  // Fetch user model preferences (step4b2-phase-d). Non-fatal on failure — null
  // falls back to MODEL_TIER_MAP defaults. resolveModel handles null gracefully.
  const prefsResult = await deps.db.getModelPreferences(job.userId)
  const preferences = prefsResult.ok ? prefsResult.data : null

  await deps.db.setPipelineStatus(jobId, 'running')

  let accumulatedFiles: FileEntry[] = []
  const stageResults: InstanceCallResult[] = []

  // ── Re-entry helper — called on retry exhaustion ──────────────────────────
  // Writes failure report, resets to pending, increments reentry_count.
  const reEnterInMain = async (stage: PipelineStage, reason: string): Promise<void> => {
    const freshJob = await deps.db.getJob(jobId)
    const reentryReport: PipelineReport = {
      buildId:          jobId as string,
      userId:           job.userId,
      stages:           stageResults.map(r => ({
        instanceId:   r.instanceId,
        model:        r.model,
        startedAt:    r.startedAt,
        completedAt:  r.completedAt,
        tokenCount:   r.tokenCount,
        handoffValid: r.handoffValid,
        retries:      0,
        errors:       [],
      } satisfies StageReportEntry)),
      totalTransitions: freshJob.ok ? freshJob.data.transitionCount : job.transitionCount,
      reentries:        (freshJob.ok ? freshJob.data.reentryCount : job.reentryCount) + 1,
      outcome:          'failed',
      failureReason:    `Re-entry triggered from ${stage}: ${reason}`,
      startedAt:        pipelineStartedAt,
      completedAt:      Date.now(),
    }
    await deps.db.writePipelineReport(jobId, reentryReport)
    await deps.db.setPipelineStatus(jobId, 'pending')
    await deps.db.incrementReentry(jobId)
    await emitEvent({
      type:    PLANNER_EVENTS.STAGE_FAILED,
      slice:   'F-planner',
      payload: { jobId: jobId as string, stage, reason, axiomCite: null, retryCount: 0 } satisfies StageFailedPayload,
    })
  }

  // ── Escalation helper — CLASS_3 terminal ──────────────────────────────────
  const escalate = async (stage: PipelineStage, reason: string): Promise<void> => {
    await deps.db.appendLogEntry(jobId, buildStageLogEntry({
      stage, status: 'failed',
      startedAt: Date.now(), completedAt: Date.now(),
      message: `ESCALATED: ${reason}`, axiomCite: null, retryCount: 0,
    }))
    await deps.db.updateStage(jobId, stage, 'failed')
    await deps.db.setPipelineStatus(jobId, 'escalated')
    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_FAILED,
      slice:   'F-planner',
      payload: { jobId: jobId as string, projectId: job.projectId, stage, reason, axiomCite: null } satisfies PipelineFailedPayload,
    })
  }

  // ── Hard fail helper — failsafe breach or unrecoverable ──────────────────
  const hardFail = async (stage: PipelineStage, reason: string): Promise<void> => {
    await deps.db.appendLogEntry(jobId, buildStageLogEntry({
      stage, status: 'failed',
      startedAt: Date.now(), completedAt: Date.now(),
      message: reason, axiomCite: null, retryCount: 0,
    }))
    await deps.db.failPipeline(jobId)
    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_FAILED,
      slice:   'F-planner',
      payload: { jobId: jobId as string, projectId: job.projectId, stage, reason, axiomCite: null } satisfies PipelineFailedPayload,
    })
  }

  // ── Failsafe check helper — called before every transition ────────────────
  const assertSafe = async (stage: PipelineStage): Promise<boolean> => {
    const freshJob = await deps.db.getJob(jobId)
    const checkJob = freshJob.ok ? freshJob.data : job
    const check = checkFailsafes(checkJob, pipelineStartedAt)
    if (!check.safe) {
      await hardFail(stage, check.reason ?? 'Failsafe breach')
      return false
    }
    return true
  }

  // ── IN-BUILD — one call per bundle, with CLASS_2/CLASS_3 retry ────────────
  const buildStage: PipelineStage = 'IN_BUILD'
  if (!await assertSafe(buildStage)) return

  await deps.db.updateStage(jobId, buildStage, 'running')
  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: buildStage, status: 'running',
    startedAt: Date.now(), completedAt: null,
    message: `Starting IN-BUILD for ${contract.bundleScope.length} bundles`,
    axiomCite: null, retryCount: 0,
  }))

  let buildRetries   = 0
  let buildErrorCtx: string | undefined

  for (const bundle of contract.bundleScope) {
    let bundleSuccess = false

    for (let attempt = 0; attempt <= PLANNER_CONST.RETRY_LIMITS.IN_BUILD; attempt++) {
      if (!await assertSafe(buildStage)) return

      const bundleStartedAt = Date.now()
      const { model } = resolveModel('Smallest', providers, preferences)

      const standardSlice   = getSliceForInstance('IN-BUILD')
      const instanceProfile = getInstanceProfile('IN-BUILD')
      const packet          = getPacketForInstance('IN-BUILD', contract, bundle.name)

      const templates = contract.flowSelection.flatMap(flowId => {
        const entries = getTemplatesForFlow(flowId as Parameters<typeof getTemplatesForFlow>[0])
        return entries.flatMap(e => e.templates.map(tplId => getTemplate(tplId)))
      })

      const systemPrompt = buildInstancePrompt({
        standardSlice,
        profile:   instanceProfile,
        packet:    { instanceType: packet.instanceType, fields: packet.fields as Record<string, unknown> },
        templates: templates.map(t => ({ id: t.id, file: t.file, layer: t.layer, body: t.body, slots: t.slots })),
        errorLog:  buildErrorCtx,
      })

      let fullResponse = ''
      let tokenCount   = 0
      const aiResult = await deps.ai.streamCompletion({
        userId:  job.userId,
        modelId: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: `Build bundle: ${bundle.name} (${bundle.status})${attempt > 0 ? ` [retry ${attempt}]` : ''}` },
        ],
        onChunk: chunk => { fullResponse += chunk },
      })

      if (!aiResult.ok) {
        const errClass = classifyError(aiResult.error, buildStage)
        if (errClass === 3) {
          if (buildRetries < PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT) {
            buildRetries++; continue
          }
          await escalate(buildStage, `IN-BUILD CLASS_3: ${aiResult.error.message}`)
          return
        }
        buildErrorCtx = aiResult.error.message
        buildRetries++
        continue
      }
      tokenCount = aiResult.data.totalTokens

      const parsed     = parseInstanceResponse(fullResponse, 'IN-BUILD')
      const shapeCheck = validateHandoff('IN-BUILD', 'IN-RESOLVE', parsed)

      if (!shapeCheck.valid) {
        buildErrorCtx = shapeCheck.reason
        buildRetries++
        if (buildRetries > PLANNER_CONST.RETRY_LIMITS.IN_BUILD) break
        continue
      }

      accumulatedFiles = [...accumulatedFiles, ...parsed.files]
      await deps.db.incrementTransition(jobId)
      stageResults.push({
        instanceId: buildStage, model, response: parsed, tokenCount,
        durationMs: Date.now() - bundleStartedAt, handoffValid: true,
        startedAt: bundleStartedAt, completedAt: Date.now(),
      })
      bundleSuccess = true
      break
    }

    if (!bundleSuccess) {
      await reEnterInMain(buildStage, `IN-BUILD retry exhausted for bundle ${bundle.name}: ${buildErrorCtx ?? 'unknown'}`)
      return
    }
  }

  await deps.db.updateStage(jobId, buildStage, 'complete')
  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: buildStage, status: 'complete',
    startedAt: pipelineStartedAt, completedAt: Date.now(),
    message: `IN-BUILD complete. ${accumulatedFiles.length} files across ${contract.bundleScope.length} bundles.`,
    axiomCite: null, retryCount: buildRetries,
  }))
  await emitEvent({
    type:    PLANNER_EVENTS.STAGE_COMPLETED,
    slice:   'F-planner',
    payload: { jobId: jobId as string, stage: buildStage, message: `${accumulatedFiles.length} files` } satisfies StageCompletedPayload,
  })

  // ── IN-RESOLVE ────────────────────────────────────────────────────────────
  if (!await assertSafe('IN_RESOLVE')) return
  const resolveResult = await runRetryStage(
    deps, jobId, job, 'IN_RESOLVE', 'IN-AUDIT', 'Medium', providers, preferences,
    accumulatedFiles, contract, undefined, PLANNER_CONST.RETRY_LIMITS.IN_RESOLVE,
    pipelineStartedAt, stageResults, reEnterInMain, escalate, assertSafe
  )
  if (!resolveResult.ok) return
  accumulatedFiles = resolveResult.files

  // ── IN-AUDIT — failure routes back to IN-BUILD retry budget ───────────────
  if (!await assertSafe('IN_AUDIT')) return
  const auditResult = await runRetryStage(
    deps, jobId, job, 'IN_AUDIT', 'IN-COMPILE', 'Medium', providers, preferences,
    accumulatedFiles, contract, undefined, PLANNER_CONST.RETRY_LIMITS.IN_AUDIT,
    pipelineStartedAt, stageResults, reEnterInMain, escalate, assertSafe
  )
  if (!auditResult.ok) return
  accumulatedFiles = auditResult.files

  // ── IN-COMPILE — tsc loop with stall detection + IN-DIAGNOSE sub-routine ──
  if (!await assertSafe('IN_COMPILE')) return
  const compileResult = await runCompileLoop(
    deps, jobId, job, providers, preferences, accumulatedFiles, contract,
    pipelineStartedAt, stageResults, reEnterInMain, escalate, assertSafe
  )
  if (!compileResult.ok) return
  accumulatedFiles = compileResult.files
  const compileLog  = compileResult.stdout

  // ── IN-QA ─────────────────────────────────────────────────────────────────
  if (!await assertSafe('IN_QA')) return
  const qaResult = await runRetryStage(
    deps, jobId, job, 'IN_QA', null, 'Medium', providers, preferences,
    accumulatedFiles, contract, compileLog,
    PLANNER_CONST.RETRY_LIMITS.IN_QA,
    pipelineStartedAt, stageResults, reEnterInMain, escalate, assertSafe
  )
  if (!qaResult.ok) return

  // ── Success ───────────────────────────────────────────────────────────────
  const writeResult = await deps.output.writeFiles(jobId as string, accumulatedFiles)
  if (!writeResult.ok) {
    await hardFail('IN_QA', `Failed to write output files: ${writeResult.error.message}`)
    return
  }

  const freshJob2 = await deps.db.getJob(jobId)
  const finalReport: PipelineReport = {
    buildId:          jobId as string,
    userId:           job.userId,
    stages:           stageResults.map(r => ({
      instanceId:   r.instanceId,
      model:        r.model,
      startedAt:    r.startedAt,
      completedAt:  r.completedAt,
      tokenCount:   r.tokenCount,
      handoffValid: r.handoffValid,
      retries:      0,
      errors:       [],
    } satisfies StageReportEntry)),
    totalTransitions: freshJob2.ok ? freshJob2.data.transitionCount : job.transitionCount,
    reentries:        freshJob2.ok ? freshJob2.data.reentryCount : job.reentryCount,
    outcome:          'complete',
    startedAt:        pipelineStartedAt,
    completedAt:      Date.now(),
  }

  await deps.db.writePipelineReport(jobId, finalReport)
  await deps.db.completePipeline(jobId)
  await emitEvent({
    type:    PLANNER_EVENTS.PIPELINE_COMPLETED,
    slice:   'F-planner',
    payload: { jobId: jobId as string, projectId: job.projectId, userId: job.userId } satisfies PipelineCompletedPayload,
  })
}

// ── runRetryStage — internal: single stage with CLASS_2/CLASS_3 retry ─────────

async function runRetryStage(
  deps:            { db: IPlannerDb; ai: IAiAdapter },
  jobId:           PlannerJobId,
  job:             PlannerJob,
  stage:           PipelineStage,
  nextId:          string | null,
  sizeTier:        'Largest' | 'Medium' | 'Smallest',
  providers:       string[],
  preferences:     ModelPreferencesLike | null,
  files:           FileEntry[],
  contract:        IfContract,
  errorLog:        string | undefined,
  retryLimit:      number,
  pipelineStartedAt: number,
  stageResults:    InstanceCallResult[],
  reEnterInMain:   (stage: PipelineStage, reason: string) => Promise<void>,
  escalate:        (stage: PipelineStage, reason: string) => Promise<void>,
  assertSafe:      (stage: PipelineStage) => Promise<boolean>
): Promise<{ ok: true; files: FileEntry[] } | { ok: false }> {
  const stageStartedAt = Date.now()
  const { model }      = resolveModel(sizeTier, providers, preferences)
  const stageId        = stage.replace('IN_', 'IN-') as Parameters<typeof getSliceForInstance>[0]
  let   infraRetries   = 0
  let   errorCtx       = errorLog

  await deps.db.updateStage(jobId, stage, 'running')
  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage, status: 'running',
    startedAt: stageStartedAt, completedAt: null,
    message: `Starting ${stage}`, axiomCite: null, retryCount: 0,
  }))

  for (let attempt = 0; attempt <= retryLimit; attempt++) {
    if (!await assertSafe(stage)) return { ok: false }

    const standardSlice   = getSliceForInstance(stageId)
    const instanceProfile = getInstanceProfile(stageId)
    const packet          = getPacketForInstance(stageId, contract)

    const systemPrompt = buildInstancePrompt({
      standardSlice,
      profile:       instanceProfile,
      packet:        { instanceType: packet.instanceType, fields: packet.fields as Record<string, unknown> },
      existingFiles: files,
      errorLog:      errorCtx,
    })

    let fullResponse = ''
    let tokenCount   = 0

    const aiResult = await deps.ai.streamCompletion({
      userId:  job.userId,
      modelId: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: `Execute ${stage}. Produce your complete output.${attempt > 0 ? ` [retry ${attempt}]` : ''}` },
      ],
      onChunk: chunk => { fullResponse += chunk },
    })

    if (!aiResult.ok) {
      const errClass = classifyError(aiResult.error, stage)
      if (errClass === 3) {
        if (infraRetries < PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT) {
          infraRetries++; continue
        }
        await escalate(stage, `${stage} CLASS_3: ${aiResult.error.message}`)
        return { ok: false }
      }
      errorCtx = aiResult.error.message
      continue
    }
    tokenCount = aiResult.data.totalTokens

    const parsed     = parseInstanceResponse(fullResponse, stage)
    const toId       = (nextId ?? 'IN-MAIN') as InstanceId
    const shapeCheck = validateHandoff(stageId, toId, parsed)

    if (!shapeCheck.valid) {
      errorCtx = shapeCheck.reason
      continue
    }

    const outputFiles = parsed.files.length > 0 ? parsed.files : files
    const msg = `${stage} complete. ${parsed.files.length} files. Tokens: ${tokenCount}. Retries: ${attempt}.`

    await deps.db.appendLogEntry(jobId, buildStageLogEntry({
      stage, status: 'complete',
      startedAt: stageStartedAt, completedAt: Date.now(),
      message: msg, axiomCite: null, retryCount: attempt,
    }))
    await deps.db.updateStage(jobId, stage, 'complete')
    await deps.db.incrementTransition(jobId)
    await emitEvent({
      type:    PLANNER_EVENTS.STAGE_COMPLETED,
      slice:   'F-planner',
      payload: { jobId: jobId as string, stage, message: msg } satisfies StageCompletedPayload,
    })

    stageResults.push({
      instanceId: stage, model, response: parsed, tokenCount,
      durationMs: Date.now() - stageStartedAt, handoffValid: true,
      startedAt: stageStartedAt, completedAt: Date.now(),
    })
    return { ok: true, files: outputFiles }
  }

  // Budget exhausted → re-enter IN-MAIN
  await reEnterInMain(stage, `${stage} retry budget exhausted: ${errorCtx ?? 'output validation failed'}`)
  return { ok: false }
}

// ── runCompileLoop — IN-COMPILE tsc loop + stall detection + IN-DIAGNOSE ──────

async function runCompileLoop(
  deps:              { db: IPlannerDb; ai: IAiAdapter; executor: IExecutor },
  jobId:             PlannerJobId,
  job:               PlannerJob,
  providers:         string[],
  preferences:       ModelPreferencesLike | null,
  files:             FileEntry[],
  contract:          IfContract,
  pipelineStartedAt: number,
  stageResults:      InstanceCallResult[],
  reEnterInMain:     (stage: PipelineStage, reason: string) => Promise<void>,
  escalate:          (stage: PipelineStage, reason: string) => Promise<void>,
  assertSafe:        (stage: PipelineStage) => Promise<boolean>
): Promise<{ ok: true; files: FileEntry[]; stdout: string } | { ok: false }> {
  const compileStartedAt = Date.now()
  const stage: PipelineStage = 'IN_COMPILE'

  await deps.db.updateStage(jobId, stage, 'running')
  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage, status: 'running',
    startedAt: compileStartedAt, completedAt: null,
    message: `Starting IN-COMPILE tsc loop on ${files.length} files`, axiomCite: null, retryCount: 0,
  }))

  let currentFiles  = files
  let previousErrors = Infinity
  let stallCount     = 0

  for (let iter = 0; iter < PLANNER_CONST.RETRY_LIMITS.IN_COMPILE_LOOP; iter++) {
    if (!await assertSafe(stage)) return { ok: false }

    const execResult = await deps.executor.run({
      jobId:     jobId as string,
      projectId: job.projectId,
      files:     currentFiles.map(f => ({ path: f.path, content: f.content })),
      timeoutMs: PLANNER_CONST.AI_CALL_TIMEOUT_MS,
    })

    if (!execResult.ok) {
      await escalate(stage, `Executor error: ${execResult.error.message}`)
      return { ok: false }
    }

    if (execResult.data.passed) {
      const msg = `Compile passed. Exit 0. Duration ${execResult.data.durationMs}ms. Iterations: ${iter + 1}.`
      await deps.db.appendLogEntry(jobId, buildStageLogEntry({
        stage, status: 'complete',
        startedAt: compileStartedAt, completedAt: Date.now(),
        message: msg, axiomCite: null, retryCount: iter,
      }))
      await deps.db.updateStage(jobId, stage, 'complete')
      await deps.db.incrementTransition(jobId)
      await emitEvent({
        type:    PLANNER_EVENTS.STAGE_COMPLETED,
        slice:   'F-planner',
        payload: { jobId: jobId as string, stage, message: msg } satisfies StageCompletedPayload,
      })
      stageResults.push({
        instanceId: stage, model: 'executor',
        response: { files: currentFiles, raw: execResult.data.stdout },
        tokenCount: 0, durationMs: execResult.data.durationMs, handoffValid: true,
        startedAt: compileStartedAt, completedAt: Date.now(),
      })
      return { ok: true, files: currentFiles, stdout: execResult.data.stdout }
    }

    const s             = execResult.data.testSummary
    const currentErrors = s ? s.failed : (execResult.data.timedOut ? Infinity : 1)

    // Stall detection
    if (detectStall(currentErrors, previousErrors)) {
      stallCount++
      if (stallCount >= PLANNER_CONST.RETRY_LIMITS.IN_COMPILE_STALL) {
        // Route to IN-DIAGNOSE sub-routine
        const diagnoseResult = await runDiagnose(
          deps, jobId, job, providers, preferences, currentFiles, contract,
          execResult.data.stdout + '\n' + execResult.data.stderr, assertSafe
        )
        if (!diagnoseResult.ok) {
          await reEnterInMain(stage, `IN-DIAGNOSE could not fix stalled compile: ${execResult.data.stderr.slice(0, 200)}`)
          return { ok: false }
        }
        currentFiles  = diagnoseResult.files
        previousErrors = Infinity  // reset after diagnose
        stallCount     = 0
        continue
      }
    } else {
      stallCount = 0
    }

    previousErrors = currentErrors
  }

  // Loop exhausted without passing
  await reEnterInMain(stage, `IN-COMPILE loop exhausted after ${PLANNER_CONST.RETRY_LIMITS.IN_COMPILE_LOOP} iterations`)
  return { ok: false }
}

// ── runDiagnose — IN-DIAGNOSE sub-routine (not a pipeline stage) ──────────────
// Called when IN-COMPILE stalls. Not visible in current_stage — stays IN_COMPILE.
// Returns fixed files, or { ok: false } if diagnosis couldn't fix.

async function runDiagnose(
  deps:        { db: IPlannerDb; ai: IAiAdapter },
  jobId:       PlannerJobId,
  job:         PlannerJob,
  providers:   string[],
  preferences: ModelPreferencesLike | null,
  files:       FileEntry[],
  contract:    IfContract,
  errorLog:    string,
  assertSafe:  (stage: PipelineStage) => Promise<boolean>
): Promise<{ ok: true; files: FileEntry[] } | { ok: false }> {
  if (!await assertSafe('IN_COMPILE')) return { ok: false }

  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: 'IN_COMPILE', status: 'running',
    startedAt: Date.now(), completedAt: null,
    message: 'Routing to IN-DIAGNOSE sub-routine (stall detected)', axiomCite: null, retryCount: 0,
  }))

  const { model }       = resolveModel('Medium', providers, preferences)
  const standardSlice   = getSliceForInstance('IN-DIAGNOSE')
  const instanceProfile = getInstanceProfile('IN-DIAGNOSE')
  const packet          = getPacketForInstance('IN-DIAGNOSE', contract)

  const systemPrompt = buildInstancePrompt({
    standardSlice,
    profile:       instanceProfile,
    packet:        { instanceType: packet.instanceType, fields: packet.fields as Record<string, unknown> },
    existingFiles: files,
    errorLog,
  })

  let fullResponse = ''
  const aiResult = await deps.ai.streamCompletion({
    userId:  job.userId,
    modelId: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: 'Diagnose the stalled compile errors and return fixed files.' },
    ],
    onChunk: chunk => { fullResponse += chunk },
  })

  if (!aiResult.ok) return { ok: false }

  const parsed = parseInstanceResponse(fullResponse, 'IN-DIAGNOSE')

  await deps.db.appendLogEntry(jobId, buildStageLogEntry({
    stage: 'IN_COMPILE', status: 'running',
    startedAt: Date.now(), completedAt: Date.now(),
    message: `IN-DIAGNOSE returned ${parsed.files.length} fixed files.`, axiomCite: null, retryCount: 0,
  }))
  await deps.db.incrementTransition(jobId)

  // If no files returned, diagnosis produced report only — can't fix
  if (parsed.files.length === 0) return { ok: false }

  // Merge: diagnose files overwrite matching paths in accumulated set
  const fixedPaths = new Set(parsed.files.map(f => f.path))
  const merged     = [
    ...files.filter(f => !fixedPaths.has(f.path)),
    ...parsed.files,
  ]

  return { ok: true, files: merged }
}

// ── handleInMainTurn (step4b2-phase-a, unchanged) ─────────────────────────────

export async function handleInMainTurn(
  deps:  { db: IPlannerDb; ai: IAiAdapter },
  input: BuildRequestPayload
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob }>> {
  const turnStartedAt = Date.now()

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
    return handleConfirmationTurn(deps, jobId, job, input.userId, turnStartedAt)
  }

  const providersResult = await deps.db.getAvailableProviders(input.userId)
  if (!providersResult.ok) return providersResult

  const providers = providersResult.data
  if (providers.length === 0) {
    return { ok: false, error: { code: 'NO_PROVIDERS', message: 'No API keys configured. Please add an API key in account settings.' } }
  }

  // Fetch model preferences (step4b2-phase-d). Non-fatal — null uses defaults.
  const prefsResult  = await deps.db.getModelPreferences(input.userId)
  const preferences  = prefsResult.ok ? prefsResult.data : null

  const { model }       = resolveModel('Largest', providers, preferences)
  const standardSlice   = getSliceForInstance('IN-MAIN')
  const instanceProfile = getInstanceProfile('IN-MAIN')
  const currentContract: Partial<IfContract> = (job.ifContract as Partial<IfContract> | null) ?? {}

  // ── Re-entry context (step4b2-phase-c) ────────────────────────────────────
  // When reentryCount > 0, prepend failure context to the system prompt so
  // IN-MAIN knows the prior build failed and what went wrong.
  const reentryContext = (job.reentryCount > 0 && job.pipelineReport?.failureReason)
    ? {
        failureReason: job.pipelineReport.failureReason,
        failedStage:   job.pipelineReport.stages.at(-1)?.instanceId ?? 'unknown',
        reentryCount:  job.reentryCount,
      }
    : undefined

  const systemPrompt = buildInMainPrompt(standardSlice, instanceProfile, currentContract, reentryContext)

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
    return { ok: true, data: { response: summary, isConfirmation: false, job } }
  }

  return { ok: true, data: { response: fullResponse, isConfirmation: false, job } }
}

// ── handleConfirmationTurn — updated for Phase B + corrective-2 ───────────────

async function handleConfirmationTurn(
  deps:          { db: IPlannerDb; ai: IAiAdapter },
  jobId:         PlannerJobId,
  job:           PlannerJob,
  userId:        string,
  turnStartedAt: number
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob }>> {

  // ── D5 corrective: freeze the contract with frozenAt + frozenBy ───────────
  // job.ifContract holds the partial contract accumulated across IN-MAIN turns.
  // Build the frozen extension: add frozenAt + frozenBy to the canonical fields.
  // dbFreezeContract now guards on status IN ('pending','confirmed') — safe to
  // call even though if_contract may already be partially written by updateIfContract.
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
    slice:   'F-planner',
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

  return { ok: true, data: { response: ack, isConfirmation: true, job: confirmedJob } }
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
    slice:   'F-planner',
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
        slice:   'F-planner',
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
        slice:   'F-planner',
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
