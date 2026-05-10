// @liv-standard v1.5.1 amended sprint-11-shot-5 sprint-11-shot-6 sprint-12-micro sprint-13-shot-2
// [F-builder/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — F-builder spin-out)
//             sprint-12-micro  (F-S12-K: add createBuilderExecutor + dbCountActiveBuildsForUser
//                               pass-throughs so F-plan/R3 can import from R3, not R4 directly)
// slice:      F-builder
// layer:      R3
// wires-in:
//   W-FN      runBuild           F-builder/R2 builder-workflow
//   W-INJECT  createBuilderDb    F-builder/R4 builder-inject
//   W-INJECT  createBuilderAi    F-builder/R4 builder-inject
//   W-INJECT  createBuilderExecutor  F-builder/R4 builder-inject
//   W-INJECT  createBuilderOutput    F-builder/R4 builder-inject
//   W-FN      dbCountActiveBuildsForUser  F-builder/R4 planner-db
//   W-ATOM    BuildDirective     F-builder/R0 builder-types
//   W-ATOM    BuildEmission      F-builder/R0 builder-types
// wires-out:
//   W-HOOK  executeBuild            →  F-plan/R3 plan-contract (handleBuildRequest)
//   W-INJECT createBuilderExecutor  →  F-plan/R3 plan-contract (handleAdvanceStage)
//   W-FN    dbCountActiveBuildsForUser → F-plan/R3 plan-contract (handleStartPipeline)
//   W-ATOM  BuildDirective          →  F-plan/R3 plan-contract (type import)
//   W-ATOM  BuildEmission           →  substrate consumers (via substrate writes)
// deps:
//   R0  ../config/builder-types
//   R2  ../app/builder-workflow
//   R4  ../exec/builder-inject
//   R4  ../exec/planner-db
// validated:  pending
//
// F-builder R3 — public contract. A5: all cross-slice calls enter here only.
// sprint-12-micro: F-plan/R3 was reaching into F-builder/R4 directly for
//   createBuilderExecutor (builder-inject) and dbCountActiveBuildsForUser
//   (planner-db). Both are now re-exported here at R3 per A2/A5.
//   Axiom cite: A2 — R4 not imported cross-slice. A5 — cross-slice via R3 only.
//   A6 — declared at R3 of owning slice.

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

// ─── R4 pass-throughs (F-S12-K, sprint-13-shot-2) ────────────────────────────
// F-plan/R3 consumes these. Declared here so R4 is never imported cross-slice.
// sprint-13-shot-2: createBuilderDb added — F-plan/plan-inject was importing
// it directly from R4 (exec/builder-inject), an A2 violation. Now surfaced here.

export { createBuilderExecutor }        from '../exec/builder-inject'
export { createBuilderDb }              from '../exec/builder-inject'
export { dbCountActiveBuildsForUser }   from '../exec/planner-db'

// ─── End ──────────────────────────────────────────────────────────────────────
