// @liv-standard v1.3
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-w-inject-bridge, step3-executor
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-INJECT  IPlannerDb  ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IAiAdapter  ../workflow/planner-workflow  (R2 interface — type import only)
//   W-INJECT  IExecutor   ../workflow/planner-workflow  (R2 interface — type import only)
//   W-ATOM    getApiKey   F-user-profile/contract/user-profile-contract  (R3→R3 — permitted)
//   W-ATOM    providerForModel  F-ai-adapter/config/ai-adapter-config    (R0 — permitted)
// wires-out:
//   W-INJECT  createPlannerDb  →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createAiAdapter  →  F-planner/R3 (planner-contract.ts)
//   W-INJECT  createExecutor   →  F-planner/R3 (planner-contract.ts)
// deps:
//   R2  ../workflow/planner-workflow  (type import only)
//   R4  ../exec/planner-db            (A2-w-inject-bridge — see below)
//   R4  ../exec/ai-adapter-io         (A2-w-inject-bridge — see below)
//   R3  @/features/F-executor/contract/executor-contract  (A5 — contract surface only)
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
// validated:  2026-03-13
//
// A2-w-inject-bridge amendment:
//   R3 inject files are the W-INJECT binding layer — their sole job is to assemble
//   a concrete IPlannerDb / IAiAdapter from R4 raw functions.
//   R3 may not normally import R4. This file is the structural exception:
//   it imports R4 functions ONLY to wrap them into the R2 interface shape.
//   No R4 function is re-exported. No R4 type crosses the boundary.
//   All other R3 files (contract, hook) are clean — they never import R4.
//
// step3-executor amendment:
//   createExecutor() binds runExecution() from F-executor's declared R3 contract
//   surface into the IExecutor shape. This is the ONLY import of F-executor
//   anywhere in F-planner. Axiom cite: A5 — F-executor accessed only via
//   F-executor/contract/executor-contract.

import type { IPlannerDb, IAiAdapter, IExecutor } from '../workflow/planner-workflow'
import {
  dbGetJob,
  dbCreateJob,
  dbUpdateStage,
  dbAppendLogEntry,
  dbFreezeContract,
  dbCompletePipeline,
  dbFailPipeline,
} from '../exec/planner-db'
import { ioStreamCompletion }    from '../exec/ai-adapter-io'
import { runExecution }          from '@/features/F-executor/contract/executor-contract'
import { getApiKey }             from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel }      from '@/features/F-ai-adapter/config/ai-adapter-config'

export function createPlannerDb(): IPlannerDb {
  return {
    getJob:           (jobId)                     => dbGetJob(jobId),
    createJob:        (jobId, pId, uId, src)      => dbCreateJob(jobId, pId, uId, src),
    updateStage:      (jobId, stage, status)       => dbUpdateStage(jobId, stage, status),
    appendLogEntry:   (jobId, entry)              => dbAppendLogEntry(jobId, entry),
    freezeContract:   (jobId, contract)           => dbFreezeContract(jobId, contract),
    completePipeline: (jobId)                     => dbCompletePipeline(jobId),
    failPipeline:     (jobId)                     => dbFailPipeline(jobId),
  }
}

export function createAiAdapter(): IAiAdapter {
  return {
    // apiKey resolved here at R3 — R4 receives it pre-resolved, never looks it up itself
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

// ── createExecutor ─────────────────────────────────────────────────────────────
// Binds runExecution() from F-executor's R3 contract surface into IExecutor.
// This is the sole import of F-executor in all of F-planner (A5).
// Axiom cite: A5 — F-executor/contract/executor-contract is the declared surface.

export function createExecutor(): IExecutor {
  return {
    run: (job) => runExecution(job),
  }
}
