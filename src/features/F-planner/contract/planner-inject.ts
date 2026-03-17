// @liv-standard v1.3
// [F-planner/contract/planner-inject.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-d
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-INJECT  IPlannerDb    ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IAiAdapter    ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IExecutor     ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IOutputWriter ../workflow/planner-workflow  (R2 interface — type import only)
//   W-ATOM    getApiKey     F-user-profile/contract/user-profile-contract  (R3→R3 — permitted)
//   W-ATOM    providerForModel  F-ai-adapter/config/ai-adapter-config      (R0 — permitted)
// wires-out:
//   W-INJECT  createPlannerDb   →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createAiAdapter   →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createExecutor    →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createOutputWriter →  F-planner/R3 (planner-contract.ts)
// deps:
//   R2  ../workflow/planner-workflow  (type import only)
//   R4  ../exec/planner-db
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
//
// step4b2-phase-c (A3, A5):
//   dbIncrementReentry added to createPlannerDb() — binds IPlannerDb.incrementReentry().
//   Direct passthrough — R3 adds no logic.

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
import { ioStreamCompletion } from '../exec/ai-adapter-io'
import { runExecution }       from '@/features/F-executor/contract/executor-contract'
import { getApiKey }          from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel }   from '@/features/F-ai-adapter/config/ai-adapter-config'
import { dbReplaceOutputFiles } from '@/features/F-output/exec/output-db'
import type { FileEntry }     from '../types/planner-types'

export function createPlannerDb(): IPlannerDb {
  return {
    getJob:                 (jobId)                 => dbGetJob(jobId),
    getActiveJobForProject: (projectId)             => dbGetActiveJobForProject(projectId),
    createJob:              (jobId, pId, uId, src)  => dbCreateJob(jobId, pId, uId, src),
    updateStage:            (jobId, stage, status)  => dbUpdateStage(jobId, stage, status),
    appendLogEntry:         (jobId, entry)          => dbAppendLogEntry(jobId, entry),
    freezeContract:         (jobId, contract)       => dbFreezeContract(jobId, contract),
    completePipeline:       (jobId)                 => dbCompletePipeline(jobId),
    failPipeline:           (jobId)                 => dbFailPipeline(jobId),
    setPipelineStatus:      (jobId, status)         => dbSetPipelineStatus(jobId, status),
    incrementTransition:    (jobId)                 => dbIncrementTransition(jobId),
    writePipelineReport:    (jobId, report)         => dbWritePipelineReport(jobId, report),
    updateIfContract:       (jobId, contract)       => dbUpdateIfContract(jobId, contract),
    getAvailableProviders:  (userId)                => dbGetAvailableProviders(userId),
    incrementReentry:       (jobId)                 => dbIncrementReentry(jobId),   // step4b2-phase-c
    getModelPreferences:    (userId)                => dbGetModelPreferences(userId), // step4b2-phase-d
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
