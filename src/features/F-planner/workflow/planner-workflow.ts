// @liv-standard v1.5.1
// [F-planner/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-4.2
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
//   W-ATOM    BuildVersion           ../types/planner-version-types  (step5e)
//   W-ATOM    PLANNER_EVENTS         ../types/planner-events
//   W-ATOM    PLANNER_CONST          ../types/planner-const
//   W-ATOM    emitEvent              F-event-system/contract/event-bus
//   W-ATOM    getSliceForInstance    @/core/constants/liv-api
//   W-ATOM    getInstanceProfile     @/core/constants/liv-api
//   W-ATOM    getPacketForInstance   @/core/constants/liv-api
//   W-ATOM    getTemplatesForFlow    @/core/constants/liv-api
//   W-ATOM    getTemplate            @/core/constants/liv-api
//   W-FN      validateHandoff        @/core/constants/liv-api  (step4b4-handoff — replaces validateHandoffShape)
//   W-ATOM    InstanceId             @/core/constants/liv-standard.types  (step4b4-handoff — type import for cast)
//   W-ATOM    FlowLibraryEntry       ../types/planner-library-types  (step4d-phase2)
//   W-ATOM    LibraryInsertPayload   ../types/planner-library-types  (step4d-phase2)
//   W-FN      reslotFiles            ../domain/planner-library-logic  (step4d-phase3)
//   W-FN      extractSlotValues      ../domain/planner-library-logic  (step4d-phase3)
//   W-FN      bumpVersion            ../domain/planner-summary-logic   (step5e)
// wires-out:
//   W-INJECT  IPlannerDb   →  F-planner/R3 (planner-inject.ts binds, planner-contract.ts consumes)
//   W-INJECT  IAiAdapter   →  F-planner/R3
//   W-INJECT  IExecutor    →  F-planner/R3
//   W-INJECT  IOutputWriter →  F-planner/R3 (planner-inject.ts binds — step4b2-phase-b)
//   W-FN      handleInMainTurn  →  F-planner/R3
//   W-FN      runPipeline       →  F-planner/R3
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-version-types  (step5e)
//   R0  ../types/planner-events
//   R0  ../types/planner-const
//   R1  ../domain/planner-logic
//   R1  ../domain/planner-summary-logic  (step5e)
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
//
// step4d-phase2 (A2, A3, A6):
//   IPlannerDb extended: 4 library methods added.
//   lookupExact, lookupPartial, insertLibraryEntry, incrementReuseFailure.
//   Bound at R3 (planner-inject.ts) via planner-library-db.ts (R4) — A2 compliant.
//   FlowLibraryEntry + LibraryInsertPayload imported from planner-library-types (R0).
//   Axiom cite: A2 — interface declared at R2, bound at R3. A3 — typed atoms.
//   A6 — IPlannerDb declared at R2 of owning slice.
//
// step4d-phase3 (A1, A2, A4):
//   runPipeline: read path, write path, demotion. See prior note.
//   Axiom cite: A1, A2, A4.
//
// step4d-corrective (A2):
//   hashAtomShape, hashWireSignature removed from R1 import.
//   Both added to IPlannerDb interface — called via deps.db at R2.
//   AtomDecl, WireEntry added to liv-standard.types import (needed for interface sig).
//   R1 import now: reslotFiles, extractSlotValues only.
//   All call sites: hashAtomShape(x) → deps.db.hashAtomShape(x), same for wire.
//   Axiom cite: A2 — R2 uses R1 for pure fns, R4 infrastructure via interface only.
//
// step5e (A1, A2, A3, A4):
//   IPlannerDb extended: 3 version methods added (24 total).
//     getLatestVersion(projectId), setBuildVersion(buildId, version, description),
//     getVersionHistory(projectId).
//   BuildVersion imported from planner-version-types (R0).
//   bumpVersion imported from planner-summary-logic (R1). parseSemVer used internally by bumpVersion.
//   runPipeline: version assignment block added after completePipeline succeeds,
//   before flow library write path. Reads featureIntent as description, looks up
//   latest version for project, applies minor bump (or 1.0.0 for first build),
//   calls setBuildVersion. Fire-and-forget is not used here — version must be set
//   before the UI can display it; failure is logged but non-fatal to the user.
//   Axiom cite: A1 — F-planner owns version assignment. A2 — interface at R2,
//   bound at R3. A3 — BuildVersion typed atom. A4 — I/O via injected interface.
//
// phase-4.2 (A1, A2, A3, A7):
//   Sequential per-bundle IN-BUILD loop replaced with tiered parallel execution.
//   classifyBundleTiers (R1) sorts bundles into dependency tiers by structural
//   wires (W-ATOM, W-INJECT). Each tier executes concurrently via Promise.allSettled.
//   Prior-tier R0 files passed as referenceContext to downstream-tier IN-BUILD calls.
//   assessBuildOutput (R1) checks for stress signals (missing/placeholder files).
//   Stressed bundles decomposed into per-layer IN-BUILD calls via groupTemplatesByLayer.
//   StageReportEntry extended with tierIndex, decomposed, layerPasses (instrumentation).
//   stdVersion hardcode replaced with contract.standardVersion.
//   Axiom cite: A1 — bundle = single ownership. A2 — R0 reference context only.
//   A3 — typed boundary atoms. A7 — all new code is deletable.

import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import {
  getSliceForInstance,
  getInstanceProfile,
  getPacketForInstance,
  getTemplatesForFlow,
  getTemplate,
  validateHandoff,
} from '@/core/constants/liv-api'
import type { InstanceId, FlowId, AtomDecl, WireEntry } from '@/core/constants/liv-standard.types'
import type { FlowLibraryEntry, LibraryInsertPayload } from '../types/planner-library-types'
import type { BuildVersion } from '../types/planner-version-types'
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
  BuildRequestPayload,
  StartPipelinePayload,
  AdvanceStagePayload,
  FailStagePayload,
  FreezeContractPayload,
  FileEntry,
  InstanceCallResult,
  FileSnapshot,
  ReadSnapshot,
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

// ── Phase 5 imports — M-I dispatch swap ──────────────────────────────────────
import { emitPlanForContract } from './planner-plan-emit'
import { executeRun, type MultiInstancePorts } from '@/features/F-multi-instance/contract/mi-contract'
import type { RunReportContent } from '@/features/F-multi-instance/contract/mi-contract'
import type { Semver, NodeId } from '@/core/types/primitives'
import { createArtifactGraphPort, createPlanResolutionPort } from '@/features/F-memory/contract/memory-graph-contract'
import { createCognitiveStub } from '../exec/phase8-cognitive-stub'
import { createAdapterPort } from '../contract/planner-adapter-port'
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
  classifyBundleTiers,
  assessBuildOutput,
  groupTemplatesByLayer,
  assessFileCompliance,
  buildReadSnapshot,
  deriveScopingConstraints,
} from '../domain/planner-logic'
import {
  reslotFiles,
  extractSlotValues,
} from '../domain/planner-library-logic'
import {
  bumpVersion,
} from '../domain/planner-summary-logic'

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
  // ── Flow library (step4d-phase2) ───────────────────────────────────────────
  lookupExact(flowId: FlowId, standardVersion: string, atomShapeHash: string, wireSignatureHash: string): Promise<PlannerResult<FlowLibraryEntry | null>>
  lookupPartial(flowId: FlowId, standardVersion: string): Promise<PlannerResult<FlowLibraryEntry | null>>
  insertLibraryEntry(payload: LibraryInsertPayload): Promise<PlannerResult<FlowLibraryEntry | null>>
  incrementReuseFailure(id: string): Promise<PlannerResult<void>>
  // ── Hash fns (step4d-corrective) ─────────────────────────────────────────
  hashAtomShape(atoms: readonly AtomDecl[]): string
  hashWireSignature(wires: readonly WireEntry[]): string
  // ── Version management (step5e) ───────────────────────────────────────────
  getLatestVersion(projectId: string): Promise<PlannerResult<string | null>>
  setBuildVersion(buildId: string, version: string, description: string): Promise<PlannerResult<void>>
  getVersionHistory(projectId: string): Promise<PlannerResult<BuildVersion[]>>
  // ── Admin query (phase-b-item4) ─────────────────────────────────────────
  getBuildsForAdmin(filters: { status?: string[]; limit?: number }): Promise<PlannerResult<AdminBuild[]>>
  // ── Read phase (phase-4.3) ──────────────────────────────────────────────
  scanProjectFiles(projectId: string): Promise<PlannerResult<{ path: string; content: string }[]>>
  getVersionSnapshot(projectId: string): Promise<PlannerResult<FileSnapshot[] | null>>
  storeVersionSnapshot(buildId: string, snapshot: FileSnapshot[]): Promise<PlannerResult<void>>
  storeExternalFileCache(buildId: string, files: { path: string; content: string }[]): Promise<PlannerResult<void>>
  // ── Plan anchor persistence (phase-5 — PA5 re-entry) ────────────────────
  // Persists planAnchorNodeId from a successful emit so the next runPipeline
  // invocation (after MIValidityError → re-entry) can pass it as
  // priorPlanAnchorNodeId to emitPlanForContract, populating dependsOn and
  // triggering ArA4c version-edge emission (PA5).
  // Schema requirement (deploy-side): ALTER TABLE builds ADD COLUMN
  //   plan_anchor_node_id TEXT NULL. NULL on first run; populated on first
  //   successful emit; read on re-entry. F-planner sole writer (A1).
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

// ── IOutputWriter — W-INJECT interface for file persistence (step4b2-phase-b) ──
// Declared at R2. Implemented at R3 (planner-inject.ts) via structural exception:
// inject imports dbReplaceOutputFiles from F-output/exec/output-db (R4) directly,
// same pattern as A2-r3-active-build-check. Deferred to proper F-output surface
// in Phase C. Axiom cite: A1 — F-planner owns pipeline execution; file write is
// its responsibility. A3 — FileEntry[] is the typed boundary atom.
export interface IOutputWriter {
  writeFiles(jobId: string, files: FileEntry[]): Promise<PlannerResult<void>>
}

// ── runPipeline (Phase 5 — M-I dispatch swap; phase-5-build-5 — re-entry + defensive wrap) ──
// Phase 5 build 5 amendments:
//   5a (PA5 re-entry mechanic): on failure branches, after writePipelineReport
//      + failPipeline, check FAILSAFE.MAX_REENTRIES. If under cap:
//        incrementReentry → re-invoke runPipeline fire-and-forget (fresh
//        invocation reads bumped reentryCount → planVersion = '1.${n}.0').
//      Prior planAnchorNodeId is read at start (getPriorPlanAnchor), passed
//      to emitPlanForContract → ArA4c version edge fires on re-emit. The new
//      anchor is persisted (setPlanAnchor) after every successful emit so the
//      next re-entry chains forward.
//   5b (defensive try/catch): entire post-pipelineStartedAt body wrapped in a
//      single try/catch. Catch handler emits a terminal failure report + DB
//      writes wrapped in `.catch(() => {})` so the fire-and-forget contract
//      cannot leak an uncaught throw to handleBuildRequest's outer catch.
//      `job` reference hoisted to outer scope so the catch handler can read
//      userId / transitionCount / reentryCount when constructing the report.
//   5c#4 (failure event stage from declId): PIPELINE_FAILED event's stage
//      derived from miResult.error.declId via declIdToPipelineStage rather
//      than hardcoded 'IN_BUILD'.
//
// Preserved:
//   - Entry signature: (deps, jobId, readSnapshot)
//   - Fire-and-forget contract: returns Promise<void>; never throws
//   - pipeline_status writes ('running' → 'complete' | 'failed' | 'escalated')
//   - PipelineReport DB write
//   - PIPELINE_COMPLETED / PIPELINE_FAILED event emission
//
// Axiom cite:
//   A1 — F-planner contains no instance lifecycle code; M-I owns dispatch.
//   A2 — F-planner → F-multi-instance/R3 only.
//   A4 — all I/O via injected interfaces.
//   A7 — phase5StubSurface, adapterPort, plan-anchor R4 fns are deletable.
//   PA5 (Plan v2.2) — re-plan emits new plan with bumped semver and
//                     priorPlanAnchorNodeId in dependsOn.

export async function runPipeline(
  deps:  { db: IPlannerDb; ai: IAiAdapter; executor: IExecutor; output: IOutputWriter },
  jobId: PlannerJobId,
  _readSnapshot: ReadSnapshot | null = null
): Promise<void> {
  const pipelineStartedAt = Date.now()

  // 5b: hoist job to outer scope so the catch handler can synthesize a
  // failure report even when the load step itself throws.
  let job: PlannerJob | null = null

  try {
    // ── 1. Load job + contract ───────────────────────────────────────────────
    const jobResult = await deps.db.getJob(jobId)
    if (!jobResult.ok) {
      console.error(JSON.stringify({ level: 'error', event: 'pipeline.load.failed', jobId, error: jobResult.error }))
      return
    }
    job = jobResult.data
    if (!job.ifContract) { await deps.db.failPipeline(jobId); return }
    const contract = job.ifContract as IfContract

    await deps.db.setPipelineStatus(jobId, 'running')

    // ── 2. Build port surface (Phase 5.5: graph+plan via F-memory R3; cognitive stubbed until Phase 8) ──
    // Phase 5 used createPhase5StubSurface (per-call Maps); Phase 5.5 swaps to
    // F-memory R3 process-warm storage. Same graph instance feeds plan emission
    // (createArtifact) and executeRun (M-I S1 resolvePlan) — F-memory's R2
    // singleton makes them one store, closing PA5 cross-turn re-entry.
    const graph     = createArtifactGraphPort()
    const plan      = createPlanResolutionPort()
    const cognitive = createCognitiveStub()
    const adapter   = createAdapterPort(deps.ai, job.userId)

    // PA5: planVersion bumps on re-entry. First run = '1.0.0'; bump minor per
    // reentryCount. Re-invocation (5a) provides the bump automatically because
    // reentryCount is read fresh on each runPipeline entry.
    const planVersion = (`1.${job.reentryCount}.0`) as Semver

    // PA5 prior anchor — populates dependsOn so AS ArA4c version edge fires.
    // Read failure is non-fatal (treat as no prior); first run path returns null.
    const priorAnchorResult = await deps.db.getPriorPlanAnchor(jobId)
    const priorPlanAnchorNodeId = priorAnchorResult.ok ? priorAnchorResult.data : null

    // Cognitive classifier is the last surviving Phase 5 stub. F-codec R3
    // adapter at Phase 8 replaces createCognitiveStub() and this comment.
    const planCodec = await cognitive.classifyRunReport({
      runReport: undefined as unknown as RunReportContent,  // shape-irrelevant for stub
      userId:    job.userId,
      runTurnId: jobId as string,
    })

    // ── 3. Emit plan ──────────────────────────────────────────────────────────
    const planResult = await emitPlanForContract(contract, {
      graph,
      userId:                job.userId,
      turnId:                jobId as string,
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

      // 5a: PA5 re-entry. Plan-emit failures are typically determinism issues
      // (PA2b cycles) and re-emitting the same contract will hit the same
      // failure — but we route through the same threshold to keep the
      // mechanic uniform. Operator can break the loop by editing the contract
      // (next handleInMainTurn) before retry budget exhausts.
      await maybeReEnter(deps, jobId, job)
      return
    }

    const planAnchorNodeId = planResult.data.planAnchorNodeId

    // 5a: persist anchor for next re-entry's dependsOn. Non-fatal on failure —
    // worst case is the next re-entry has no prior, breaking ArA4c chain but
    // not the run.
    await deps.db.setPlanAnchor(jobId, planAnchorNodeId).catch(() => {})

    // ── 4. Dispatch via M-I ──────────────────────────────────────────────────
    const ports: MultiInstancePorts = {
      plan,
      adapter,
      cognitive,
      graph,
    }

    const miResult = await executeRun(
      {
        planAnchorNodeId,
        userId:    job.userId,
        runTurnId: jobId as string,
      },
      ports,
    )

    // ── 5. Derive PipelineReport + status from M-I result ────────────────────
    if (!miResult.ok) {
      const reason = `M-I run failure (${miResult.error.code} at ${miResult.error.phase}): ${miResult.error.message}`

      // 5c#4: derive failed-stage from MIValidityError.declId rather than
      // hardcode. MIValidityError.declId is optional (M-I R3 contract);
      // declIdToPipelineStage's default branch handles the absent case.
      const failedStage = declIdToPipelineStage(String(miResult.error.declId ?? 'IN-BUILD'))

      await writeFailure(deps, jobId, job, pipelineStartedAt, reason, {
        stage:     failedStage,
        axiomCite: miResult.error.testedAxiomId ?? null,
      })

      // 5a: trigger re-entry within MAX_REENTRIES.
      await maybeReEnter(deps, jobId, job)
      return
    }

    // Success — RunReportContent rides as artifact payload.
    const emission   = miResult.data
    const runReport  = emission.payload.content as RunReportContent

    // Map RunReportContent → StageReportEntry[] for backward-compatible UI.
    const stages: StageReportEntry[] = runReport.instanceResults.map(ir => ({
      instanceId:   declIdToPipelineStage(String(ir.declId)),
      model:        '',                               // surfaced via per-instance metadata in Phase 6+
      startedAt:    runReport.startedAt as unknown as number,
      completedAt:  (runReport.startedAt as unknown as number) + ir.durationMs,
      tokenCount:   ir.tokenCount,
      handoffValid: ir.status === 'complete',
      retries:      ir.retries,
      errors:       [],
    }))

    // If runReport outcome is not 'complete', surface the cause for the UI.
    // Sources, in priority order: setViolations[0].reason → first instanceResult
    // with errors → generic outcome label. Empty string would defeat the
    // PipelineReport's failureReason contract.
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
      // 5a: non-complete terminal (escalated / partial / failed) also routes
      // through the re-entry threshold. 'escalated' specifically respects
      // the cap because escalation came from M-I's own failsafe path.
      await maybeReEnter(deps, jobId, job)
    }

    // Event emission is best-effort. Outcome is already persisted via
    // completePipeline / failPipeline + writePipelineReport above; a broken
    // event bus must not flip a complete run into a 5b-caught "uncaught" record.
    try {
      await emitEvent({
        type:    PLANNER_EVENTS.PIPELINE_COMPLETED,
        slice:   'F-planner',
        payload: { jobId: jobId as string, projectId: job.projectId, userId: job.userId, featureIntent: contract.featureIntent ?? null, outcome: report.outcome } satisfies PipelineCompletedPayload,
      })
    } catch (emitErr) {
      console.error(JSON.stringify({
        level:     'warn',
        event:     'pipeline.event-emit.failed',
        jobId:     jobId as string,
        cause:     emitErr instanceof Error ? emitErr.message : String(emitErr),
        slice:     'F-planner',
        timestamp: new Date().toISOString(),
      }))
    }
  } catch (err) {
    // 5b: defensive catch. Any uncaught throw — DB connectivity, port stub
    // crashes, M-I runtime exception, event-bus failure — funnels here.
    // All recovery I/O is `.catch(() => {})`-wrapped so the catch handler
    // itself cannot throw.
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

    // Best-effort log so operators see the throw class even when DB write fails.
    console.error(JSON.stringify({
      level:     'error',
      event:     'pipeline.uncaught',
      jobId:     jobId as string,
      reason,
      slice:     'F-planner',
      timestamp: new Date().toISOString(),
    }))
  }
}

// ── Failure-write helper (5a/5b shared) ──────────────────────────────────────
// Called from inside try{}; constructs PipelineReport + emits PIPELINE_FAILED.
// DB writes are awaited normally — failures here do propagate to the outer
// catch (5b). Event emission, however, is wrapped: a flaky event bus must
// NOT prevent the re-entry trigger that follows this call. The failure record
// is the source of truth; the event is best-effort observability.
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
  // Event emission isolated — a broken event bus must not block re-entry
  // (which the caller invokes immediately after this returns).
  try {
    await emitEvent({
      type:    PLANNER_EVENTS.PIPELINE_FAILED,
      slice:   'F-planner',
      payload: { jobId: jobId as string, projectId: job.projectId, stage: failureMeta.stage, reason, axiomCite: failureMeta.axiomCite } satisfies PipelineFailedPayload,
    })
  } catch (emitErr) {
    console.error(JSON.stringify({
      level:     'warn',
      event:     'pipeline.event-emit.failed',
      jobId:     jobId as string,
      cause:     emitErr instanceof Error ? emitErr.message : String(emitErr),
      slice:     'F-planner',
      timestamp: new Date().toISOString(),
    }))
  }
}

// ── PA5 re-entry trigger (5a) ────────────────────────────────────────────────
// Called only after a typed failure was written. Threshold:
//   reentryCount >= FAILSAFE.MAX_REENTRIES  → terminal; do not re-invoke.
//   else                                    → incrementReentry, re-invoke
//                                             runPipeline fire-and-forget.
// The fresh invocation reads the bumped reentryCount → planVersion stamp
// becomes '1.{n+1}.0'. priorPlanAnchorNodeId carries forward via getPriorPlanAnchor.
//
// Note: this function is called from within the outer try{}, so any throw it
// produces (e.g. DB write errors) is caught by 5b's handler and converted to
// an uncaught failure record. Re-invocation uses .catch(() => {}) on the
// promise itself to harden the fire-and-forget edge.
async function maybeReEnter(
  deps:  { db: IPlannerDb; ai: IAiAdapter; executor: IExecutor; output: IOutputWriter },
  jobId: PlannerJobId,
  job:   PlannerJob,
): Promise<void> {
  if (job.reentryCount >= PLANNER_CONST.FAILSAFE.MAX_REENTRIES) {
    // Failsafe boundary — no further re-entry. Terminal failure stands.
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

  // Fire-and-forget re-invocation. Inner runPipeline has its own 5b catch, so
  // any throw becomes a logged failure record rather than a process crash.
  // The .catch handler here is the absolute outer rail.
  void runPipeline(deps, jobId, null).catch(err => {
    console.error(JSON.stringify({
      level:     'error',
      event:     'pipeline.reentry.uncaught',
      jobId:     jobId as string,
      message:   err instanceof Error ? err.message : String(err),
      slice:     'F-planner',
      timestamp: new Date().toISOString(),
    }))
  })
}

// PipelineStage uses underscore-form ('IN_BUILD'); RoleClassId/DeclId use
// dash-form ('IN-BUILD'). Translate when surfacing M-I results to the existing UI.
function declIdToPipelineStage(declId: string): PipelineStage {
  switch (declId) {
    case 'IN-MAIN':    return 'IN_MAIN'
    case 'IN-BUILD':   return 'IN_BUILD'
    case 'IN-RESOLVE': return 'IN_RESOLVE'
    case 'IN-AUDIT':   return 'IN_AUDIT'
    case 'IN-COMPILE': return 'IN_COMPILE'
    case 'IN-QA':      return 'IN_QA'
    case 'IN-DIAGNOSE': return 'IN_BUILD'   // no PipelineStage equiv; collapse
    default:           return 'IN_BUILD'
  }
}

// ── executeBundleBuild — internal: single bundle build with library, retry, stress ──
// Extracted from the IN-BUILD loop for use with Promise.allSettled within a tier.
// Returns { ok: true, files, stageResults } on success, { ok: false } on failure.
// Handles flow library read path, single-pass with retry, stress check, and
// R-layer decomposition. Does NOT call reEnterInMain — caller handles that.
// tierIdx passed for StageReportEntry instrumentation.

// Metadata for StageReportEntry instrumentation (phase-4.2, E3 fix).
// Carried alongside InstanceCallResult from executeBundleBuild to report assembly.
// Not added to InstanceCallResult (R0 atom) — local to R2 orchestration only (A6).
type BuildTierMetadata = {
  tierIndex:   number
  decomposed:  boolean
  layerPasses: number
}

type BundleBuildResult =
  | { ok: true;  files: FileEntry[]; stageResults: InstanceCallResult[]; metadata: BuildTierMetadata }
  | { ok: false; escalated?: boolean; reason?: string }

async function executeBundleBuild(
  deps:             { db: IPlannerDb; ai: IAiAdapter },
  jobId:            PlannerJobId,
  job:              PlannerJob,
  contract:         IfContract,
  bundle:           { name: string; status: string },
  buildStage:       PipelineStage,
  providers:        string[],
  preferences:      ModelPreferencesLike | null,
  referenceContext:  FileEntry[],
  tierIdx:          number,
  pipelineStartedAt: number,
  assertSafe:       (stage: PipelineStage) => Promise<boolean>,
  escalate:         (stage: PipelineStage, reason: string) => Promise<void>,
  exactHitMap:      Map<string, string>
): Promise<BundleBuildResult> {
  const localResults: InstanceCallResult[] = []
  const stdVersion = contract.standardVersion

  // ── Flow library read path (step4d-phase3, preserved) ─────────────────
  const bundleAtoms = contract.atomDeclarations.filter(a => a.owner === bundle.name)
  const bundleWires = contract.wireMap.filter(
    w => w.from === bundle.name || w.to === bundle.name
  )
  const atomHash = deps.db.hashAtomShape(bundleAtoms)
  const wireHash = deps.db.hashWireSignature(bundleWires)

  const primaryFlowId = contract.flowSelection[0]

  if (primaryFlowId) {
    const exactResult = await deps.db.lookupExact(primaryFlowId, stdVersion, atomHash, wireHash)

    if (exactResult.ok && exactResult.data) {
      const entry     = exactResult.data
      const newSlots  = extractSlotValues(contract, bundle.name)
      const reslotted = reslotFiles(entry.outputFiles, entry.slotValues, newSlots)

      const files = reslotted.map(f => ({ ...f, encoding: 'utf8' as const }))
      exactHitMap.set(bundle.name, entry.id)
      await deps.db.incrementTransition(jobId)

      console.log(JSON.stringify({
        level: 'info', event: 'flow-library.exact-hit',
        flowId: primaryFlowId, bundleName: bundle.name, libraryEntryId: entry.id,
        slice: 'F-planner', layer: 'R2', timestamp: new Date().toISOString(),
      }))
      return { ok: true, files, stageResults: localResults, metadata: { tierIndex: tierIdx, decomposed: false, layerPasses: 0 } }
    }
  }

  // ── Partial hit: get reference files for IN-BUILD (preserved) ─────────
  let buildErrorCtx: string | undefined
  if (primaryFlowId) {
    const partialResult = await deps.db.lookupPartial(primaryFlowId, stdVersion)
    if (partialResult.ok && partialResult.data) {
      console.log(JSON.stringify({
        level: 'info', event: 'flow-library.partial-hit',
        flowId: primaryFlowId, bundleName: bundle.name,
        libraryEntryId: partialResult.data.id,
        slice: 'F-planner', layer: 'R2', timestamp: new Date().toISOString(),
      }))
      buildErrorCtx = `Reference files available from a partial library match (${partialResult.data.outputFiles.length} files). Use as structural reference — adapt slot values to this build.`
    } else {
      console.log(JSON.stringify({
        level: 'info', event: 'flow-library.miss',
        flowId: primaryFlowId, bundleName: bundle.name,
        slice: 'F-planner', layer: 'R2', timestamp: new Date().toISOString(),
      }))
    }
  }

  // ── Single-pass IN-BUILD with retry ───────────────────────────────────
  let infraRetries = 0

  for (let attempt = 0; attempt <= PLANNER_CONST.RETRY_LIMITS.IN_BUILD; attempt++) {
    if (!await assertSafe(buildStage)) return { ok: false, reason: 'failsafe' }

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
      profile:          instanceProfile,
      packet:           { instanceType: packet.instanceType, fields: packet.fields as Record<string, unknown> },
      templates:        templates.map(t => ({ id: t.id, file: t.file, layer: t.layer, body: t.body, slots: t.slots })),
      referenceContext: referenceContext.length > 0 ? referenceContext : undefined,
      errorLog:         buildErrorCtx,
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
        if (infraRetries < PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT) {
          infraRetries++; continue
        }
        await escalate(buildStage, `IN-BUILD CLASS_3: ${aiResult.error.message}`)
        return { ok: false, escalated: true, reason: aiResult.error.message }
      }
      buildErrorCtx = aiResult.error.message
      continue
    }
    tokenCount = aiResult.data.totalTokens

    const parsed     = parseInstanceResponse(fullResponse, 'IN-BUILD')
    const shapeCheck = validateHandoff('IN-BUILD', 'IN-RESOLVE', parsed)

    if (!shapeCheck.valid) {
      buildErrorCtx = shapeCheck.reason
      continue
    }

    // ── Stress check (phase-4.2) ──────────────────────────────────────────
    const expectedTemplates = templates.map(t => ({ id: t.id, file: t.file }))
    const assessment = assessBuildOutput(expectedTemplates, parsed.files)

    if (assessment.clean) {
      // Clean single-pass — proceed normally
      await deps.db.incrementTransition(jobId)
      localResults.push({
        instanceId: buildStage, model, response: parsed, tokenCount,
        durationMs: Date.now() - bundleStartedAt, handoffValid: true,
        startedAt: bundleStartedAt, completedAt: Date.now(),
      })
      return { ok: true, files: parsed.files, stageResults: localResults, metadata: { tierIndex: tierIdx, decomposed: false, layerPasses: 0 } }
    }

    // ── Stress detected — decompose by R-layer ────────────────────────────
    console.log(JSON.stringify({
      level: 'info', event: 'build.stress-detected',
      bundleName: bundle.name, missing: assessment.missing, stressed: assessment.stressed,
      slice: 'F-planner', layer: 'R2', timestamp: new Date().toISOString(),
    }))

    const flowEntries = contract.flowSelection.flatMap(flowId =>
      getTemplatesForFlow(flowId as Parameters<typeof getTemplatesForFlow>[0])
        .map(e => ({ layer: e.layer, templates: e.templates }))
    )
    const layers = groupTemplatesByLayer(flowEntries)

    let decomposedFiles: FileEntry[] = []
    const layerOrder = ['R0', 'R1', 'R2', 'R3', 'R4']
    let layerPasses  = 0

    for (const layerName of layerOrder) {
      const layerTemplateIds = layers.get(layerName)
      if (!layerTemplateIds || layerTemplateIds.length === 0) continue

      const layerTemplates = layerTemplateIds.map(tplId => getTemplate(tplId as Parameters<typeof getTemplate>[0]))
      let layerSuccess = false
      let layerInfraRetries = 0

      for (let layerAttempt = 0; layerAttempt <= PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT; layerAttempt++) {
        const layerPrompt = buildInstancePrompt({
          standardSlice:    getSliceForInstance('IN-BUILD'),
          profile:          getInstanceProfile('IN-BUILD'),
          packet:           { instanceType: packet.instanceType, fields: packet.fields as Record<string, unknown> },
          templates:        layerTemplates.map(t => ({ id: t.id, file: t.file, layer: t.layer, body: t.body, slots: t.slots })),
          existingFiles:    decomposedFiles.length > 0 ? decomposedFiles : undefined,
          referenceContext: referenceContext.length > 0 ? referenceContext : undefined,
          errorLog:         `Decomposed build: producing ${layerName} layer only. Prior layers already built.${layerAttempt > 0 ? ` [retry ${layerAttempt}]` : ''}`,
        })

        let layerResponse = ''
        const layerAiResult = await deps.ai.streamCompletion({
          userId:  job.userId,
          modelId: model,
          messages: [
            { role: 'system', content: layerPrompt },
            { role: 'user',   content: `Build ${layerName} layer for bundle: ${bundle.name}` },
          ],
          onChunk: chunk => { layerResponse += chunk },
        })

        if (!layerAiResult.ok) {
          const errClass = classifyError(layerAiResult.error, buildStage)
          if (errClass === 3 && layerInfraRetries < PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT) {
            layerInfraRetries++
            continue
          }
          // CLASS_3 exhausted or CLASS_2 — fail this layer
          return { ok: false, reason: `Decomposed build failed at ${layerName}: ${layerAiResult.error.message}` }
        }

        const layerParsed = parseInstanceResponse(layerResponse, 'IN-BUILD')
        decomposedFiles = [...decomposedFiles, ...layerParsed.files]
        layerPasses++
        layerSuccess = true
        break
      }

      if (!layerSuccess) {
        return { ok: false, reason: `Decomposed build: ${layerName} layer retry exhausted` }
      }
    }

    // Re-check after decomposition
    const recheck = assessBuildOutput(expectedTemplates, decomposedFiles)
    if (!recheck.clean) {
      // Decomposition didn't fix it — problem is IF contract
      return { ok: false, reason: `Decomposed build still stressed: missing=${recheck.missing.join(',')}, stressed=${recheck.stressed.join(',')}` }
    }

    await deps.db.incrementTransition(jobId)
    localResults.push({
      instanceId: buildStage, model, response: { files: decomposedFiles, raw: '' }, tokenCount,
      durationMs: Date.now() - bundleStartedAt, handoffValid: true,
      startedAt: bundleStartedAt, completedAt: Date.now(),
    })

    return { ok: true, files: decomposedFiles, stageResults: localResults, metadata: { tierIndex: tierIdx, decomposed: true, layerPasses } }
  }

  // Retry budget exhausted
  return { ok: false, reason: `IN-BUILD retry exhausted for bundle ${bundle.name}: ${buildErrorCtx ?? 'unknown'}` }
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

// ── readProjectState (phase-4.3) ─────────────────────────────────────────────
// Pre-build filesystem scan. Produces structural snapshot of existing code.
// Called at the start of handleInMainTurn, before contract negotiation.
// Reads project files from disk via IPlannerDb.scanProjectFiles (R4).
// Loads latest version snapshot from DB via IPlannerDb.getVersionSnapshot (R4).
// Passes both to buildReadSnapshot (R1) for structural analysis.
// Result injected into IN-MAIN prompt as codebase context.
// Ephemeral — computed fresh each time, not cached between turns.
// Axiom cite: A4 — I/O via injected interface. A2 — R2 orchestration only.

async function readProjectState(
  projectId: string,
  deps:      { db: IPlannerDb }
): Promise<PlannerResult<ReadSnapshot>> {
  // Scan filesystem
  const scanResult = await deps.db.scanProjectFiles(projectId)
  if (!scanResult.ok) return scanResult

  // Load stored snapshot for diffing
  const snapshotResult = await deps.db.getVersionSnapshot(projectId)
  const storedSnapshot = snapshotResult.ok ? snapshotResult.data : null

  // Assess compliance per file (R1 pure)
  const assessed = scanResult.data.map(f => {
    const { compliant, issues } = assessFileCompliance(f.content, f.path)
    return { ...f, compliant, issues }
  })

  // Build structural snapshot (R1 pure)
  const snapshot = buildReadSnapshot(assessed, storedSnapshot)

  return { ok: true, data: snapshot }
}

// ── handleInMainTurn (step4b2-phase-a, extended phase-4.3) ───────────────────

export async function handleInMainTurn(
  deps:  { db: IPlannerDb; ai: IAiAdapter },
  input: BuildRequestPayload
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob; readSnapshot: ReadSnapshot | null }>> {
  const turnStartedAt = Date.now()

  // ── Read phase (phase-4.3) ──────────────────────────────────────────────
  // Scan project state before contract negotiation. Non-fatal on failure —
  // pipeline behaves as pre-4.3 (no prior state context).
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

  // ── Snapshot scoping (phase-4.4) ─────────────────────────────────────────
  // Derive typed scoping constraints from read snapshot. Passes conclusions
  // (skip/rebuild/delta) to buildInMainPrompt, not raw snapshot data.
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

// ── handleConfirmationTurn — updated for Phase B + corrective-2 ───────────────

async function handleConfirmationTurn(
  deps:          { db: IPlannerDb; ai: IAiAdapter },
  jobId:         PlannerJobId,
  job:           PlannerJob,
  userId:        string,
  turnStartedAt: number,
  readSnapshot:  ReadSnapshot | null = null
): Promise<PlannerResult<{ response: string; isConfirmation: boolean; job: PlannerJob; readSnapshot: ReadSnapshot | null }>> {

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
      payload: { jobId: input.jobId, projectId: job.projectId, userId: job.userId, featureIntent: job.ifContract?.featureIntent ?? null, outcome: job.pipelineReport?.outcome ?? null } satisfies PipelineCompletedPayload,
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
