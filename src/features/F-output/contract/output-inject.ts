// @liv-standard v1.3
// [F-output/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-w-inject-bridge
// slice:      F-output
// category:   Modality
// layer:      R3
// wires-in:
//   W-INJECT  IOutputDb  ../workflow/output-workflow  (R2 interface — type import only)
//   W-INJECT  IGitPush   ../workflow/output-workflow  (R2 interface — type import only)
// wires-out:
//   W-INJECT  createOutputDb  →  F-output/R3 (output-contract.ts)
//   W-INJECT  createGitPush   →  F-output/R3 (output-contract.ts)
// deps:
//   R2  ../workflow/output-workflow  (type import only)
//   R4  ../exec/output-db            (A2-w-inject-bridge — see below)
//   R4  ../exec/git-push-io          (A2-w-inject-bridge — see below)
// validated:  2026-03-12
//
// A2-w-inject-bridge amendment:
//   Sole job: assemble concrete IOutputDb / IGitPush from R4 raw functions.
//   R3 may not normally import R4. This file is the structural exception.
//   No R4 function is re-exported. No R4 type crosses the boundary.
//   All other R3 files (contract, hook) are clean — they never import R4.
//   Pattern identical to F-planner planner-inject.ts.

import type { IOutputDb, IGitPush } from '../workflow/output-workflow'
import {
  dbGetOutputFiles,
  dbIsPipelineComplete,
} from '../exec/output-db'
import {
  ioPushToGitHub,
  ioPushToGitLab,
} from '../exec/git-push-io'

export function createOutputDb(): IOutputDb {
  return {
    getOutputFiles:     (jobId)  => dbGetOutputFiles(jobId),
    isPipelineComplete: (jobId)  => dbIsPipelineComplete(jobId),
  }
}

export function createGitPush(): IGitPush {
  return {
    pushToGitHub: (slug, files, branch, token, message) =>
      ioPushToGitHub(slug, files, branch, token, message),
    pushToGitLab: (encodedPath, files, branch, token, message) =>
      ioPushToGitLab(encodedPath, files, branch, token, message),
  }
}
