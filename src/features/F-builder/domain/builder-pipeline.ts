// @liv-standard v1.5.1 amended sprint-12-shot-3 sprint-13-shot-2 sprint-b1-shot-3b b1-final-shot-3
// [F-builder/domain/builder-pipeline.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-3 (NEW — moved from F-planner/workflow/planner-workflow + planner-plan-emit — dissolution)
// slice:      F-builder
// layer:      R2
// wires-in:
//   W-ATOM    PlannerJob             F-plan/types/pipeline-types
//   W-ATOM    PlannerJobId           F-plan/types/pipeline-types
//   W-ATOM    PipelineStage          F-plan/types/pipeline-types
//   W-ATOM    PipelineStatus         F-plan/types/pipeline-types
//   W-ATOM    PipelineReport         F-plan/types/pipeline-types
//   W-ATOM    StageReportEntry       F-plan/types/pipeline-types
//   W-ATOM    IfContract             F-plan/types/pipeline-types
//   W-ATOM    StageLogEntry          F-plan/types/pipeline-types
//   W-ATOM    PlannerResult          F-plan/types/pipeline-types
//   W-ATOM    FileEntry              F-plan/types/pipeline-types
//   W-ATOM    FileSnapshot           F-plan/types/pipeline-types
//   W-ATOM    ReadSnapshot           F-plan/types/pipeline-types
//   W-ATOM    BuildVersion           F-plan/types/planner-version-types
//   W-ATOM    PLANNER_EVENTS         F-builder/config/builder-events
//   W-ATOM    PLANNER_CONST          F-builder/config/builder-const
//   W-ATOM    emitEvent              F-event-system/contract/event-bus
//   W-ATOM    getSliceForInstance    @/core/constants/liv-api
//   W-ATOM    getInstanceProfile     @/core/constants/liv-api
//   W-ATOM    FlowLibraryEntry       F-plan/types/planner-library-types
//   W-ATOM    LibraryInsertPayload   F-plan/types/planner-library-types
//   W-ATOM    AdminBuild             F-admin/types/admin-types
//   W-ATOM    NodeId, Semver, CognitivePrimitive  core/R5 primitives
// wires-out:
//   W-INJECT  IPlannerDb    →  F-builder/R4 builder-inject
//   W-INJECT  IAiAdapter    →  F-builder/R4 builder-inject
//   W-INJECT  IExecutor     →  F-builder/R4 builder-inject
//   W-INJECT  IOutputWriter →  F-builder/R4 builder-inject
//   W-FN      runPipeline   →  F-builder/R2 builder-workflow
//   W-FN      emitPlanForContract  (internal — called by runPipeline)
// deps:
//   R0  @/features/F-plan/types/pipeline-types
//   R0  @/features/F-plan/types/planner-version-types
//   R0  @/features/F-plan/types/planner-library-types
//   R0  @/features/F-builder/config/builder-events
//   R0  @/features/F-builder/config/builder-const
//   R0  @/features/F-admin/types/admin-types
//   R1  @/features/F-planner/domain/planner-logic  (R1 pure functions — cross-slice exception, Sprint B)
//   R3  @/features/F-event-system/contract/event-bus
//   R3  @/features/F-artifact/contract/artifact-contract  (decodePayloadContent re-exported — b1-final-shot-3)
//   R3  @/features/F-memory/contract/substrate-contract  (threadQuery — b1-final-shot-3)
//   R3  @/features/F-plan/contract/liv-standard-binding
//   R3  @/features/F-multi-instance/contract/mi-contract
//   R3  ./planner-adapter-port  (same-slice R3; Sprint B — dissolve with F-planner R1)
//   R5  @/core/constants/liv-api
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
//   R5  @/core/types/artifact-standard.types
//   R5  @/core/types/substrate.types               (IdentityRef, ThreadQueryInput)
//   R0  @/core/constants/liv-standard.types
// validated:  pending
//
// sprint-12-shot-3: F-planner dissolution. Interfaces IPlannerDb/IAiAdapter/
//   IExecutor/IOutputWriter declared here (F-builder owns pipeline execution per
//   Builder Standard v1.0). runPipeline and emitPlanForContract moved here verbatim.
//   event slice references updated: 'F-planner' → 'F-builder' in all emitEvent calls.
//   readProjectState moved to F-plan/app/plan-pipeline.ts (D5 resolution).
//   handleInMainTurn moved to F-plan/app/plan-pipeline.ts.
//   handleConfirmationTurn moved to F-plan/app/plan-pipeline.ts.
//   startPipeline, freezeContract, advanceStage, failStage, getPipelineStatus
//   moved to F-plan/app/plan-pipeline.ts.
//   ModelTierPreferenceLike/ModelPreferencesLike declared here for IPlannerDb
//   interface signature (A6 — declared at R2 of owner slice).
//
// Note: F-planner/domain/planner-logic.ts R1 pure functions (buildStageLogEntry,
//   nextStage, etc.) are imported cross-slice here pending Sprint B relocation.
//   Declared debt — no new axiom violation (same cross-slice pattern as Sprint 11).

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import {
  getSliceForInstance,
  getInstanceProfile,
} from '@/core/constants/liv-api'
import type { FlowId, AtomDecl, WireEntry } from '@/core/constants/liv-standard.types'
import type { FlowLibraryEntry, LibraryInsertPayload } from '@/features/F-plan/types/planner-library-types'
import type { BuildVersion } from '@/features/F-plan/types/planner-version-types'
import type { AdminBuild } from '@/features/F-admin/types/admin-types'
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
  FileEntry,
  FileSnapshot,
  ReadSnapshot,
} from '@/features/F-plan/types/pipeline-types'
import {
  PLANNER_EVENTS,
  type PipelineStartedPayload,
  type PipelineCompletedPayload,
  type PipelineFailedPayload,
  type StageCompletedPayload,
  type StageFailedPayload,
} from '../config/builder-events'
import { PLANNER_CONST } from '../config/builder-const'

import { emitPlanForContract } from './builder-plan-emit'
import { executeRun, type MultiInstancePorts } from '@/features/F-multi-instance/contract/mi-contract'
import type { RunReportContent } from '@/features/F-multi-instance/contract/mi-contract'
import type { Semver, NodeId, CognitivePrimitive } from '@/core/types/primitives'
import { threadQuery } from '@/features/F-memory/contract/substrate-contract'
import type { ThreadQueryInput, IdentityRef } from '@/core/types/substrate.types'
import { decodePayloadContent } from '@/features/F-artifact/contract/artifact-contract'
import { createAdapterPort } from '../contract/planner-adapter-port'

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
  getModelPreferences(userId: string): Promise<PlannerResult<ModelPreferencesLike | null>>
  // ── Flow library ─────────────────────────────────────────────────────────
  lookupExact(flowId: FlowId, standardVersion: string, atomShapeHash: string, wireSignatureHash: string): Promise<PlannerResult<FlowLibraryEntry | null>>
  lookupPartial(flowId: FlowId, standardVersion: string): Promise<PlannerResult<FlowLibraryEntry | null>>
  insertLibraryEntry(payload: LibraryInsertPayload): Promise<PlannerResult<FlowLibraryEntry | null>>
  incrementReuseFailure(id: string): Promise<PlannerResult<void>>
  // ── Hash fns ──────────────────────────────────────────────────────────────
  hashAtomShape(atoms: readonly AtomDecl[]): string
  hashWireSignature(wires: readonly WireEntry[]): string
  // ── Version management ────────────────────────────────────────────────────
  getLatestVersion(projectId: string): Promise<PlannerResult<string | null>>
  setBuildVersion(buildId: string, version: string, description: string): Promise<PlannerResult<void>>
  getVersionHistory(projectId: string): Promise<PlannerResult<BuildVersion[]>>
  // ── Admin query ───────────────────────────────────────────────────────────
  getBuildsForAdmin(filters: { status?: string[]; limit?: number }): Promise<PlannerResult<AdminBuild[]>>
  // ── Read phase ────────────────────────────────────────────────────────────
  scanProjectFiles(projectId: string): Promise<PlannerResult<{ path: string; content: string }[]>>
  getVersionSnapshot(projectId: string): Promise<PlannerResult<FileSnapshot[] | null>>
  storeVersionSnapshot(buildId: string, snapshot: FileSnapshot[]): Promise<PlannerResult<void>>
  storeExternalFileCache(buildId: string, files: { path: string; content: string }[]): Promise<PlannerResult<void>>
  // ── Plan anchor persistence ───────────────────────────────────────────────
  getPriorPlanAnchor(jobId: PlannerJobId): Promise<PlannerResult<NodeId | null>>
  setPlanAnchor(jobId: PlannerJobId, nodeId: NodeId): Promise<PlannerResult<void>>
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

export interface IOutputWriter {
  writeFiles(jobId: string, files: FileEntry[]): Promise<PlannerResult<void>>
}

// ── BuilderPipelineDeps — replaces inline BuilderDeps in builder-workflow.ts ──
export type BuilderPipelineDeps = {
  db:       IPlannerDb
  ai:       IAiAdapter
  executor: IExecutor
  output:   IOutputWriter
}

// ── runPipeline ───────────────────────────────────────────────────────────────
// Moved verbatim from F-planner/workflow/planner-workflow.ts.
// Event slice references updated: 'F-planner' → 'F-builder'.

export async function runPipeline(
  deps:  BuilderPipelineDeps,
  jobId: PlannerJobId,
  _readSnapshot: ReadSnapshot | null = null
): Promise<void> {
  const pipelineStartedAt = Date.now()

  let job: PlannerJob | null = null

  try {
    const jobResult = await deps.db.getJob(jobId)
    if (!jobResult.ok) {
      console.error(JSON.stringify({ level: 'error', event: 'pipeline.load.failed', jobId, error: jobResult.error }))
      return
    }
    job = jobResult.data
    if (!job.ifContract) { await deps.db.failPipeline(jobId); return }
    const contract = job.ifContract as IfContract

    await deps.db.setPipelineStatus(jobId, 'running')

    const cognitive = {
      classifyRunReport: async (_args: {
        runReport: RunReportContent
        userId:    string
        runTurnId: string
      }): Promise<{
        classificationNodeId: NodeId
        primitive:            CognitivePrimitive
        confidence:           number
      }> => ({
        classificationNodeId: jobId as unknown as NodeId,
        primitive:            'anchor',
        confidence:           0.0,
      }),
    }
    const adapter   = createAdapterPort(deps.ai, job.userId)

    // b1-final-shot-3: PlanResolutionPort backed by substrate threadQuery.
    // Artifact payload written by createArtifact S3 includes artifact-content:{JSON}
    // identity. Recovery: threadQuery identity-recurrence on anchorNodeId →
    // find content identity → decodePayloadContent → validate → return.
    const plan: import('@/features/F-multi-instance/contract/mi-contract').PlanResolutionPort = {
      resolvePlan: async (planAnchorNodeId: NodeId): Promise<import('@/core/types/plan-standard.types').PlanArtifactContent | null> => {
        try {
          const result = await threadQuery({
            threadKind: 'identity-recurrence',
            anchor:     planAnchorNodeId as unknown as IdentityRef,
            limit:      1,
          } as ThreadQueryInput)
          if (!result.ok || result.data.records.length === 0) return null
          const record = result.data.records[result.data.records.length - 1]
          const contentIdentity = record.content.identities.find(
            (id) => (id as string).startsWith('artifact-content:')
          )
          if (!contentIdentity) return null
          const decoded = decodePayloadContent(contentIdentity)
          if (!decoded || typeof decoded !== 'object') return null
          const content = decoded as Partial<import('@/core/types/plan-standard.types').PlanArtifactContent>
          if (!('planId' in content) || !('binding' in content) || !('shape' in content)) return null
          return content as import('@/core/types/plan-standard.types').PlanArtifactContent
        } catch {
          return null
        }
      },
    }

    const planVersion = (`1.${job.reentryCount}.0`) as Semver

    const priorAnchorResult = await deps.db.getPriorPlanAnchor(jobId)
    const priorPlanAnchorNodeId = priorAnchorResult.ok ? priorAnchorResult.data : null

    const planCodec = {
      classificationNodeId: jobId as unknown as NodeId,
      primitive:            'anchor' as CognitivePrimitive,
      confidence:           0.0,
    }

    const planResult = await emitPlanForContract(contract, {
      userId:                job.userId,
      turnId:                jobId as string,
      projectId:             job.projectId,
      classificationNodeId:  planCodec.classificationNodeId,
      primitive:             planCodec.primitive,
      confidence:            planCodec.confidence,
      planVersion,
      priorPlanAnchorNodeId: priorPlanAnchorNodeId ?? undefined,
    })

    if (!planResult.ok) {
      const reason = planResult.error.failedAxiom
        ? `Plan validity failure (${planResult.error.failedAxiom}): ${planResult.error.message}`
        : `Plan emission rejected: ${planResult.error.message}`

      await writeFailure(deps, jobId, job, pipelineStartedAt, reason, {
        stage: 'IN_MAIN',
        axiomCite: planResult.error.failedAxiom ?? null,
      })

      await maybeReEnter(deps, jobId, job)
      return
    }

    const planAnchorNodeId = planResult.data.planAnchorNodeId

    await deps.db.setPlanAnchor(jobId, planAnchorNodeId).catch(() => {})

    const ports: MultiInstancePorts = {
      plan,
      adapter,
      cognitive,
    }

    const miResult = await executeRun(
      {
        planAnchorNodeId,
        userId:    job.userId,
        runTurnId: jobId as string,
        projectId: job.projectId,
      },
      ports,
    )

    if (!miResult.ok) {
      const reason = `M-I run failure (${miResult.error.code} at ${miResult.error.phase}): ${miResult.error.message}`
      const failedStage = declIdToPipelineStage(String(miResult.error.declId ?? 'IN-BUILD'))

      await writeFailure(deps, jobId, job, pipelineStartedAt, reason, {
        stage:     failedStage,
        axiomCite: miResult.error.testedAxiomId ?? null,
      })

      await maybeReEnter(deps, jobId, job)
      return
    }

    const emission   = miResult.data
    const runReport  = emission.payload.content as RunReportContent

    const stages: StageReportEntry[] = runReport.instanceResults.map(ir => ({
      instanceId:   declIdToPipelineStage(String(ir.declId)),
      model:        '',
      startedAt:    runReport.startedAt as unknown as number,
      completedAt:  (runReport.startedAt as unknown as number) + ir.durationMs,
      tokenCount:   ir.tokenCount,
      handoffValid: ir.status === 'complete',
      retries:      ir.retries,
      errors:       [],
    }))

    const nonCompleteReason = runReport.outcome !== 'complete'
      ? (runReport.setViolations[0]?.reason
        ?? runReport.instanceResults.find(ir => ir.errors.length > 0)?.errors[0]?.message
        ?? `M-I outcome: ${runReport.outcome}`)
      : undefined

    const report: PipelineReport = {
      buildId:          jobId as string,
      userId:           job.userId,
      stages,
      totalTransitions: job.transitionCount,
      reentries:        job.reentryCount,
      outcome:          runReport.outcome === 'complete' ? 'complete'
                      : runReport.outcome === 'escalated' ? 'escalated'
                      : 'failed',
      ...(nonCompleteReason ? { failureReason: nonCompleteReason } : {}),
      startedAt:        pipelineStartedAt,
      completedAt:      Date.now(),
    }
    await deps.db.writePipelineReport(jobId, report)

    if (runReport.outcome === 'complete') {
      await deps.db.completePipeline(jobId)
    } else {
      await deps.db.failPipeline(jobId)
      await maybeReEnter(deps, jobId, job)
    }

    try {
      await emitEvent({
        type:    PLANNER_EVENTS.PIPELINE_COMPLETED,
        slice:   'F-builder',
        payload: { jobId: jobId as string, projectId: job.projectId, userId: job.userId, featureIntent: contract.featureIntent ?? null, outcome: report.outcome } satisfies PipelineCompletedPayload,
      })
    } catch (emitErr) {
      console.error(JSON.stringify({
        level:     'warn',
        event:     'pipeline.event-emit.failed',
        jobId:     jobId as string,
        cause:     emitErr instanceof Error ? emitErr.message : String(emitErr),
        slice:     'F-builder',
        timestamp: new Date().toISOString(),
      }))
    }
  } catch (err) {
    const reason = `runPipeline uncaught: ${err instanceof Error ? err.message : String(err)}`
    const report: PipelineReport = {
      buildId:          jobId as string,
      userId:           job?.userId ?? '',
      stages:           [],
      totalTransitions: job?.transitionCount ?? 0,
      reentries:        job?.reentryCount ?? 0,
      outcome:          'failed',
      failureReason:    reason,
      startedAt:        pipelineStartedAt,
      completedAt:      Date.now(),
    }
    await deps.db.writePipelineReport(jobId, report).catch(() => {})
    await deps.db.failPipeline(jobId).catch(() => {})

    console.error(JSON.stringify({
      level:     'error',
      event:     'pipeline.uncaught',
      jobId:     jobId as string,
      reason,
      slice:     'F-builder',
      timestamp: new Date().toISOString(),
    }))
  }
}

// ── writeFailure helper ───────────────────────────────────────────────────────

async function writeFailure(
  deps:              { db: IPlannerDb },
  jobId:             PlannerJobId,
  job:               PlannerJob,
  pipelineStartedAt: number,
  reason:            string,
  failureMeta:       { stage: PipelineStage; axiomCite: string | null },
): Promise<void> {
  const report: PipelineReport = {
    buildId:          jobId as string,
    userId:           job.userId,
    stages:           [],
    totalTransitions: job.transitionCount,
    reentries:        job.reentryCount,
    outcome:          'failed',
    failureReason:    reason,
    startedAt:        pipelineStartedAt,
    completedAt:      Date.now(),
  }
  await deps.db.writePipelineReport(jobId, report)
  await deps.db.failPipeline(jobId)
  try {
    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_FAILED,
      slice:   'F-builder',
      payload: { jobId: jobId as string, projectId: job.projectId, stage: failureMeta.stage, reason, axiomCite: failureMeta.axiomCite } satisfies PipelineFailedPayload,
    })
  } catch (emitErr) {
    console.error(JSON.stringify({
      level:     'warn',
      event:     'pipeline.event-emit.failed',
      jobId:     jobId as string,
      cause:     emitErr instanceof Error ? emitErr.message : String(emitErr),
      slice:     'F-builder',
      timestamp: new Date().toISOString(),
    }))
  }
}

// ── maybeReEnter helper ───────────────────────────────────────────────────────

async function maybeReEnter(
  deps:  BuilderPipelineDeps,
  jobId: PlannerJobId,
  job:   PlannerJob,
): Promise<void> {
  if (job.reentryCount >= PLANNER_CONST.FAILSAFE.MAX_REENTRIES) {
    return
  }
  const incResult = await deps.db.incrementReentry(jobId)
  if (!incResult.ok) {
    console.error(JSON.stringify({
      level: 'error',
      event: 'pipeline.reentry.increment.failed',
      jobId, error: incResult.error,
    }))
    return
  }

  void runPipeline(deps, jobId, null).catch(err => {
    console.error(JSON.stringify({
      level:     'error',
      event:     'pipeline.reentry.uncaught',
      jobId:     jobId as string,
      message:   err instanceof Error ? err.message : String(err),
      slice:     'F-builder',
      timestamp: new Date().toISOString(),
    }))
  })
}

// ── declIdToPipelineStage ─────────────────────────────────────────────────────

export function declIdToPipelineStage(declId: string): PipelineStage {
  switch (declId) {
    case 'IN-MAIN':    return 'IN_MAIN'
    case 'IN-BUILD':   return 'IN_BUILD'
    case 'IN-RESOLVE': return 'IN_RESOLVE'
    case 'IN-AUDIT':   return 'IN_AUDIT'
    case 'IN-COMPILE': return 'IN_COMPILE'
    case 'IN-QA':      return 'IN_QA'
    case 'IN-DIAGNOSE': return 'IN_BUILD'
    default:           return 'IN_BUILD'
  }
}

// ─── End ──────────────────────────────────────────────────────────────────────
