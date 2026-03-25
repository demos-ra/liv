// @liv-standard v1.3
// [F-planner/contract/planner-inject.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e
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
//   R4  @/features/F-output/exec/output-db  (A2-r3-output-write amendment)
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
import { dbReplaceOutputFiles } from '@/features/F-output/exec/output-db'
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
  }
}

export function createAiAdapter(): IAiAdapter {
  return {
    streamCompletion: async (opts) => {
      const provider = providerForModel(opts.modelId)
      const apiKey   = await getApiKey(opts.userId, provider).catch(() => null)
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
// Wraps dbReplaceOutputFiles (F-output/R4) into IOutputWriter.
// FileEntry[] → OutputFile[] shape conversion: encoding always 'utf8' for
// AI-generated source files. OutputJobId branded string — cast from plain string.

export function createOutputWriter(): IOutputWriter {
  return {
    writeFiles: async (jobId, files: FileEntry[]) => {
      const outputFiles = files.map(f => ({
        path:     f.path,
        content:  f.content,
        encoding: f.encoding,
      }))
      const result = await dbReplaceOutputFiles(
        jobId as Parameters<typeof dbReplaceOutputFiles>[0],
        outputFiles
      )
      return result
    },
  }
}
