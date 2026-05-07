// @liv-standard v1.4
// [F-planner/contract/planner-inject.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    step5e, phase-b-item4, phase-b-item2, phase-4.3
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-INJECT  IPlannerDb    ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IAiAdapter    ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IExecutor     ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IOutputWriter ../workflow/planner-workflow  (R2 interface — type import only)
//   W-ATOM    getApiKey         F-user-profile/contract/user-profile-contract  (R3→R3 — permitted)
//   W-ATOM    providerForModel  F-ai-adapter/config/ai-adapter-config          (R0 — permitted)
// wires-out:
//   W-INJECT  createPlannerDb    →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createAiAdapter    →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createExecutor     →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createOutputWriter →  F-planner/R3 (planner-contract.ts)
// deps:
//   R2  ../workflow/planner-workflow        (type import only)
//   R4  ../exec/planner-db
//   R4  ../exec/planner-library-db          (step4d-phase2, step4d-corrective)
//   R4  ../exec/planner-version-db          (step5e)
//   R4  ../exec/ai-adapter-io
//   R3  @/features/F-executor/contract/executor-contract
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R3  @/features/F-output/contract/output-contract  (phase-b-item2 — was R4)
// validated:  pending
//
// A2-w-inject-bridge amendment: (unchanged)
// step3-executor amendment: (unchanged)
// step4b2-phase-a: (unchanged)
// step4b2-phase-b: (unchanged)
// step4b2-phase-c (A3, A5): dbIncrementReentry added. (unchanged)
// step4d-phase2 (A2, A3): 4 library bindings added. (unchanged)
// step4d-corrective (A2): hashAtomShape, hashWireSignature added. (unchanged)
//
// step5e (A2, A3):
//   3 version bindings added to createPlannerDb() — IPlannerDb grows to 24 methods.
//     getLatestVersion, setBuildVersion, getVersionHistory.
//   All bound from planner-version-db.ts (R4) — never imported at R2 directly.
//   Axiom cite: A2 — R4 bound at R3 inject, consumed via IPlannerDb at R2.
//   A3 — BuildVersion is a typed atom at boundary. A7 — separate R4 file, deletable.
//
// phase-b-item4 (A1, A2):
//   getBuildsForAdmin binding added to createPlannerDb() — IPlannerDb grows to 25 methods.
//   Bound from planner-db.ts (R4). Query moved from F-admin/exec/admin-db.ts.
//   Axiom cite: A1 — F-planner owns builds table. A2 — R4 bound at R3 inject.
//
// phase-4.3 (A2, A4):
//   4 read phase bindings added to createPlannerDb() — IPlannerDb grows to 29 methods.
//     scanProjectFiles, getVersionSnapshot, storeVersionSnapshot, storeExternalFileCache.
//   All bound from planner-db.ts (R4). Filesystem and DB I/O at R4 only (A4).
//   Axiom cite: A2 — R4 bound at R3 inject. A4 — I/O at R4.
//
// phase-5 (A5, A7):
//   M-I dispatch swap — runPipeline now emits a Plan and delegates to
//   F-multi-instance/R3 executeRun. Port surface for executeRun (graph, plan,
//   cognitive) and the adapter wrap (createAdapterPort) are constructed
//   per-pipeline-call inside runPipeline rather than as module-level bindings
//   here. Rationale: the plan-store carrier in createPhase5StubSurface is
//   build-scoped — a module-level binding would leak plan cache across runs
//   and contradict A7. Long-lived dependencies (db, ai, executor, output)
//   remain bound here as before. Real wiring in Phase 6/7 (F-memory R3
//   primitives, F-ai-adapter R3 llm-classify-io adapter post Sprint 8 Shot 3a F-codec dissolution) replaces createPhase5StubSurface
//   without touching this file.

import type { IPlannerDb, IAiAdapter, IExecutor, IOutputWriter } from '../workflow/planner-workflow'
import {
  dbGetJob,
  dbGetActiveJobForProject,
  dbCreateJob,
  dbUpdateStage,
  dbAppendLogEntry,
  dbFreezeContract,
  dbCompletePipeline,
  dbFailPipeline,
  dbSetPipelineStatus,
  dbIncrementTransition,
  dbWritePipelineReport,
  dbUpdateIfContract,
  dbGetAvailableProviders,
  dbIncrementReentry,
  dbGetModelPreferences,
  dbGetBuildsForAdmin,
  dbScanProjectFiles,
  dbGetVersionSnapshot,
  dbStoreVersionSnapshot,
  dbStoreExternalFileCache,
  dbGetPriorPlanAnchor,
  dbSetPlanAnchor,
} from '../exec/planner-db'
import {
  dbLookupExactFlowLibrary,
  dbLookupPartialFlowLibrary,
  dbInsertFlowLibraryEntry,
  dbIncrementReuseFailure,
  hashAtomShape,
  hashWireSignature,
} from '../exec/planner-library-db'
import {
  dbGetLatestVersion,
  dbSetBuildVersion,
  dbGetVersionHistory,
} from '../exec/planner-version-db'
import { ioStreamCompletion }   from '../exec/ai-adapter-io'
import { runExecution }         from '@/features/F-executor/contract/executor-contract'
import { getApiKey }            from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel }     from '@/features/F-ai-adapter/config/ai-adapter-config'
import { writeOutputFiles } from '@/features/F-output/contract/output-contract'
import type { FileEntry }       from '../types/planner-types'

export function createPlannerDb(): IPlannerDb {
  return {
    getJob:                 (jobId)                          => dbGetJob(jobId),
    getActiveJobForProject: (projectId)                      => dbGetActiveJobForProject(projectId),
    createJob:              (jobId, pId, uId, src)           => dbCreateJob(jobId, pId, uId, src),
    updateStage:            (jobId, stage, status)           => dbUpdateStage(jobId, stage, status),
    appendLogEntry:         (jobId, entry)                   => dbAppendLogEntry(jobId, entry),
    freezeContract:         (jobId, contract)                => dbFreezeContract(jobId, contract),
    completePipeline:       (jobId)                          => dbCompletePipeline(jobId),
    failPipeline:           (jobId)                          => dbFailPipeline(jobId),
    setPipelineStatus:      (jobId, status)                  => dbSetPipelineStatus(jobId, status),
    incrementTransition:    (jobId)                          => dbIncrementTransition(jobId),
    writePipelineReport:    (jobId, report)                  => dbWritePipelineReport(jobId, report),
    updateIfContract:       (jobId, contract)                => dbUpdateIfContract(jobId, contract),
    getAvailableProviders:  (userId)                         => dbGetAvailableProviders(userId),
    incrementReentry:       (jobId)                          => dbIncrementReentry(jobId),
    getModelPreferences:    (userId)                         => dbGetModelPreferences(userId),
    // ── Flow library (step4d-phase2) ─────────────────────────────────────────
    lookupExact:            (flowId, stdVer, atomHash, wireHash) => dbLookupExactFlowLibrary(flowId, stdVer, atomHash, wireHash),
    lookupPartial:          (flowId, stdVer)                 => dbLookupPartialFlowLibrary(flowId, stdVer),
    insertLibraryEntry:     (payload)                        => dbInsertFlowLibraryEntry(payload),
    incrementReuseFailure:  (id)                             => dbIncrementReuseFailure(id),
    // ── Hash fns (step4d-corrective) ─────────────────────────────────────────
    hashAtomShape:          (atoms)                          => hashAtomShape(atoms),
    hashWireSignature:      (wires)                          => hashWireSignature(wires),
    // ── Version management (step5e) ───────────────────────────────────────────
    getLatestVersion:       (projectId)                      => dbGetLatestVersion(projectId),
    setBuildVersion:        (buildId, version, description)  => dbSetBuildVersion(buildId, version, description),
    getVersionHistory:      (projectId)                      => dbGetVersionHistory(projectId),
    // ── Admin query (phase-b-item4) ─────────────────────────────────────────
    getBuildsForAdmin:      (filters)                        => dbGetBuildsForAdmin(filters),
    // ── Read phase (phase-4.3) ───────────────────────────────────────────────
    scanProjectFiles:       (projectId)                      => dbScanProjectFiles(projectId),
    getVersionSnapshot:     (projectId)                      => dbGetVersionSnapshot(projectId),
    storeVersionSnapshot:   (buildId, snapshot)              => dbStoreVersionSnapshot(buildId, snapshot),
    storeExternalFileCache: (buildId, files)                 => dbStoreExternalFileCache(buildId, files),
    // ── Plan anchor persistence (phase-5 — PA5 re-entry) ─────────────────────
    getPriorPlanAnchor:     (jobId)                          => dbGetPriorPlanAnchor(jobId),
    setPlanAnchor:          (jobId, nodeId)                  => dbSetPlanAnchor(jobId, nodeId),
  }
}

export function createAiAdapter(): IAiAdapter {
  return {
    streamCompletion: async (opts) => {
      const provider = providerForModel(opts.modelId)
      const keyResult = await getApiKey(opts.userId, provider)
      const apiKey    = keyResult.ok ? keyResult.data : null
      return ioStreamCompletion({
        apiKey:   apiKey ?? undefined,
        modelId:  opts.modelId,
        messages: opts.messages,
        onChunk:  opts.onChunk,
      })
    },
  }
}

export function createExecutor(): IExecutor {
  return {
    run: (job) => runExecution(job),
  }
}

// ── createOutputWriter — IOutputWriter binding (step4b2-phase-b) ─────────────
// Wraps writeOutputFiles (F-output/R3) into IOutputWriter.
// FileEntry[] → OutputFile[] shape conversion: encoding always 'utf8' for
// AI-generated source files. OutputJobId branded string — cast from plain string.
// phase-b-item2: import changed from F-output/R4 to F-output/R3 (A2, T1.1).

export function createOutputWriter(): IOutputWriter {
  return {
    writeFiles: async (jobId, files: FileEntry[]) => {
      const outputFiles = files.map(f => ({
        path:     f.path,
        content:  f.content,
        encoding: f.encoding,
      }))
      const result = await writeOutputFiles(
        jobId as Parameters<typeof writeOutputFiles>[0],
        outputFiles
      )
      return result
    },
  }
}
