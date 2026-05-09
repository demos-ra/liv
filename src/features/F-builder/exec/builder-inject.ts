// @liv-standard v1.5.1 amended sprint-11-shot-5 sprint-11-shot-6
// [F-builder/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — port factories for F-builder)
// slice:      F-builder
// layer:      R4  (I/O port factories; never imported from R2 directly)
// wires-in:
//   W-INJECT  IPlannerDb    F-planner/workflow/planner-workflow   (R2 type — structural exception, Sprint 12)
//   W-INJECT  IAiAdapter    F-planner/workflow/planner-workflow   (R2 type — structural exception, Sprint 12)
//   W-INJECT  IExecutor     F-planner/workflow/planner-workflow   (R2 type — structural exception, Sprint 12)
//   W-INJECT  IOutputWriter F-planner/workflow/planner-workflow   (R2 type — structural exception, Sprint 12)
// wires-out:
//   W-INJECT  createBuilderDb      →  F-builder/R3 builder-contract
//   W-INJECT  createBuilderAi      →  F-builder/R3 builder-contract
//   W-INJECT  createBuilderExecutor →  F-builder/R3 builder-contract
//   W-INJECT  createBuilderOutput  →  F-builder/R3 builder-contract
// deps:
//   R2  @/features/F-planner/workflow/planner-workflow  (type imports only — Sprint 12 exception)
//   R4  @/features/F-planner/exec/planner-db
//   R4  @/features/F-planner/exec/planner-library-db
//   R4  @/features/F-planner/exec/planner-version-db
//   R4  @/features/F-planner/exec/ai-adapter-io
//   R3  @/features/F-executor/contract/executor-contract
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R3  @/features/F-output/contract/output-contract
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
// validated:  pending
//
// Sprint 11 Shot 5 structural exception (Decision-D-S5-EXTRACTION):
//   F-builder R4 imports interfaces from F-planner R2 (type imports only).
//   Rationale: F-planner's IPlannerDb/IAiAdapter/IExecutor/IOutputWriter are
//   declared at R2 (planner-workflow.ts). Full type migration to F-builder R0
//   is Sprint 12 scope. At Sprint 11: F-builder re-exports the same port
//   factories as F-planner/planner-inject, bound to the same R4 implementations.
//   No runtime code from F-planner R2 is imported — only interface types.
//   This is a declared structural exception, not a layering violation.

import type {
  IPlannerDb,
  IAiAdapter,
  IExecutor,
  IOutputWriter,
} from '@/features/F-planner/workflow/planner-workflow'

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
} from '@/features/F-planner/exec/planner-db'

import {
  dbLookupExactFlowLibrary,
  dbLookupPartialFlowLibrary,
  dbInsertFlowLibraryEntry,
  dbIncrementReuseFailure,
  hashAtomShape,
  hashWireSignature,
} from '@/features/F-planner/exec/planner-library-db'

import {
  dbGetLatestVersion,
  dbSetBuildVersion,
  dbGetVersionHistory,
} from '@/features/F-planner/exec/planner-version-db'

import { ioStreamCompletion }   from '@/features/F-planner/exec/ai-adapter-io'
import { runExecution }         from '@/features/F-executor/contract/executor-contract'
import { getApiKey }            from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel }     from '@/features/F-ai-adapter/config/ai-adapter-config'
import { writeOutputFiles }     from '@/features/F-output/contract/output-contract'
import type { FileEntry }       from '@/features/F-planner/types/planner-types'

export function createBuilderDb(): IPlannerDb {
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
    lookupExact:            (flowId, stdVer, atomHash, wireHash) => dbLookupExactFlowLibrary(flowId, stdVer, atomHash, wireHash),
    lookupPartial:          (flowId, stdVer)                 => dbLookupPartialFlowLibrary(flowId, stdVer),
    insertLibraryEntry:     (payload)                        => dbInsertFlowLibraryEntry(payload),
    incrementReuseFailure:  (id)                             => dbIncrementReuseFailure(id),
    hashAtomShape:          (atoms)                          => hashAtomShape(atoms),
    hashWireSignature:      (wires)                          => hashWireSignature(wires),
    getLatestVersion:       (projectId)                      => dbGetLatestVersion(projectId),
    setBuildVersion:        (buildId, version, description)  => dbSetBuildVersion(buildId, version, description),
    getVersionHistory:      (projectId)                      => dbGetVersionHistory(projectId),
    getBuildsForAdmin:      (filters)                        => dbGetBuildsForAdmin(filters),
    scanProjectFiles:       (projectId)                      => dbScanProjectFiles(projectId),
    getVersionSnapshot:     (projectId)                      => dbGetVersionSnapshot(projectId),
    storeVersionSnapshot:   (buildId, snapshot)              => dbStoreVersionSnapshot(buildId, snapshot),
    storeExternalFileCache: (buildId, files)                 => dbStoreExternalFileCache(buildId, files),
    getPriorPlanAnchor:     (jobId)                          => dbGetPriorPlanAnchor(jobId),
    setPlanAnchor:          (jobId, nodeId)                  => dbSetPlanAnchor(jobId, nodeId),
  }
}

export function createBuilderAi(): IAiAdapter {
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

export function createBuilderExecutor(): IExecutor {
  return {
    run: (job) => runExecution(job),
  }
}

export function createBuilderOutput(): IOutputWriter {
  return {
    writeFiles: async (jobId, files: FileEntry[]) => {
      const outputFiles = files.map(f => ({
        path:     f.path,
        content:  f.content,
        encoding: f.encoding,
      }))
      const result = await writeOutputFiles(
        jobId as Parameters<typeof writeOutputFiles>[0],
        outputFiles,
      )
      return result
    },
  }
}

// ─── End ──────────────────────────────────────────────────────────────────────
