// @liv-standard v1.5.1 amended sprint-11-shot-5 sprint-11-shot-6
// [F-builder/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — F-builder spin-out)
// slice:      F-builder
// layer:      R3
// wires-in:
//   W-FN      runBuild           F-builder/R2 builder-workflow
//   W-INJECT  createBuilderDb    F-builder/R4 builder-inject
//   W-INJECT  createBuilderAi    F-builder/R4 builder-inject
//   W-INJECT  createBuilderExecutor  F-builder/R4 builder-inject
//   W-INJECT  createBuilderOutput    F-builder/R4 builder-inject
//   W-ATOM    BuildDirective     F-builder/R0 builder-types
//   W-ATOM    BuildEmission      F-builder/R0 builder-types
// wires-out:
//   W-HOOK  executeBuild  →  F-planner/R3 planner-contract (handleBuildRequest — fire-and-forget)
//   W-ATOM  BuildDirective  →  F-planner/R3 planner-contract (type import)
//   W-ATOM  BuildEmission   →  substrate consumers (via substrate writes)
// deps:
//   R0  ../config/builder-types
//   R2  ../app/builder-workflow
//   R4  ../exec/builder-inject
// validated:  pending
//
// F-builder R3 — public contract.
// A5: all cross-slice calls enter here only. R2 and R4 are slice-internal.
//
// Decision-D-S5-OUTPUT: F-output fold vs stay-separate.
//   F-output has three independent consumers outside F-planner:
//     - app/api/output/[jobId]/files/route.ts  (handleGetFiles)
//     - app/api/output/[jobId]/download/route.ts  (handleDownload)
//     - app/api/output/[jobId]/push/route.ts  (handlePush)
//   F-output is a slice with HTTP route surface, independent consumers, and
//   its own R-layer structure. Stay-separate is the correct boundary.
//   F-builder imports writeOutputFiles from F-output R3 (same pattern as
//   F-planner currently does). F-output is not folded into F-builder.

import { runBuild }  from '../app/builder-workflow'
import {
  createBuilderDb,
  createBuilderAi,
  createBuilderExecutor,
  createBuilderOutput,
}                    from '../exec/builder-inject'
import type { BuildDirective } from '../config/builder-types'

// ─── executeBuild — primary public entry ──────────────────────────────────────
// Called by F-planner R3 (handleBuildRequest) on confirmation, fire-and-forget.
// Constructs full deps object from inject factories, then calls runBuild.
// Returns Promise<void> — caller uses .catch() for last-resort error handling.

export async function executeBuild(directive: BuildDirective): Promise<void> {
  const deps = {
    db:       createBuilderDb(),
    ai:       createBuilderAi(),
    executor: createBuilderExecutor(),
    output:   createBuilderOutput(),
  }
  return runBuild(deps, directive)
}

// ─── Type re-exports — consumers pull everything from R3 ─────────────────────

export type { BuildDirective, BuildEmission, BuildStatus } from '../config/builder-types'

// ─── End ──────────────────────────────────────────────────────────────────────
