// @liv-standard v1.5.1 amended sprint-11-shot-5 sprint-11-shot-6 sprint-11-shot-6b
// [F-builder/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — F-builder spin-out)
// slice:      F-builder
// layer:      R2
// wires-in:
//   W-ATOM    BuildDirective  F-builder/R0 builder-types
//   W-ATOM    BuildEmission   F-builder/R0 builder-types
//   W-ATOM    BUILDER_CONFIG  F-builder/R0 builder-config
//   W-FN      runPipeline     F-planner/R2 planner-workflow  (Sprint 12 exception — see Decision-D-S5-EXTRACTION)
//   W-FN      writeStateChange  F-memory/contract/substrate-contract  (BuildEmission write)
//   W-ATOM    SubstrateWriteInput, IdentityRef, ScopeRef, RoleRef  core/types/substrate.types
// wires-out:
//   W-FN  runBuild  →  F-builder/R3 builder-contract
// deps:
//   R0  ../config/builder-types
//   R0  ../config/builder-config
//   R2  @/features/F-planner/workflow/planner-workflow   (runPipeline — Sprint 12 exception)
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/types/substrate.types
// validated:  pending
//
// Decision-D-S5-EXTRACTION: F-builder invocation pattern.
//   F-builder R2 calls runPipeline() from F-planner R2.
//   This is a declared Sprint 11 structural exception. F-planner's pipeline
//   logic (394 lines, deeply coupled to F-planner R0/R1 types) cannot be
//   physically moved in this shot without pulling all transitive F-planner
//   type dependencies. Sprint 12 will move types to F-builder R0 and the
//   function body to F-builder R2, dissolving the cross-slice R2→R2 import.
//   At Sprint 11: F-builder R3 is the public surface; F-planner R3
//   delegates to F-builder R3. The Sprint 11 extract delivers the public
//   contract boundary; Sprint 12 completes the physical relocation.
//
// BuildEmission substrate write (CA4):
//   After runPipeline resolves (success, failure, or escalation), F-builder
//   writes a BuildEmission typed atom to substrate. Fire-and-forget —
//   write failure must not suppress the build result. channel='internal-derivation'.

import type {
  IPlannerDb,
  IAiAdapter,
  IExecutor,
  IOutputWriter,
} from '@/features/F-planner/workflow/planner-workflow'
// SPRINT-11-STRUCTURAL-EXCEPTION: cross-slice R2→R2 import from F-planner.
// Resolved at Sprint 12 when F-planner dissolves under F-plan refactor.
// Declared: D-S5-EXTRACTION. Auditor: treat as known debt, not axiom violation.
import { runPipeline } from '@/features/F-planner/workflow/planner-workflow'
import type { BuildDirective, BuildEmission, BuildStatus } from '../config/builder-types'
import { writeStateChange }  from '@/features/F-memory/contract/substrate-contract'
import type {
  SubstrateWriteInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                            from '@/core/types/substrate.types'

export type BuilderDeps = {
  db:       IPlannerDb
  ai:       IAiAdapter
  executor: IExecutor
  output:   IOutputWriter
}

function writeBuildEmission(emission: BuildEmission): void {
  const write: SubstrateWriteInput = {
    content: {
      identities: [
        'build-emission'    as IdentityRef,
        emission.jobId      as IdentityRef,
        emission.userId     as IdentityRef,
        emission.projectId  as IdentityRef,
        emission.status     as IdentityRef,
      ],
      relations: [
        {
          type:                'build-completed' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: emission.jobId as IdentityRef, role: 'subject' as RoleRef },
            { identity: emission.status as IdentityRef, role: 'result' as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   emission.completedAt,
      source: { channel: 'internal-derivation', scope: emission.projectId as ScopeRef },
    },
  }
  writeStateChange(write).catch((err: unknown) => {
    console.error(JSON.stringify({
      level:   'error',
      event:   'builder.emission.write-failed',
      jobId:   emission.jobId,
      message: err instanceof Error ? err.message : String(err),
    }))
  })
}

// ─── runBuild() ───────────────────────────────────────────────────────────────
// F-builder R2 — primary build orchestration entry.
// Delegates to runPipeline (F-planner R2, Sprint 11 exception).
// Writes BuildEmission to substrate on completion (fire-and-forget, CA4).
// Returns Promise<void> — matches fire-and-forget contract of handleBuildRequest.

export async function runBuild(
  deps:      BuilderDeps,
  directive: BuildDirective,
): Promise<void> {
  let status: BuildStatus = 'failed'

  try {
    await runPipeline(deps, directive.jobId as import('@/features/F-planner/types/planner-types').PlannerJobId, null)
    // runPipeline manages its own pipeline_status writes.
    // It does not return a status — check job state from DB if needed.
    // For BuildEmission: treat successful resolution (no throw) as 'completed'.
    status = 'completed'
  } catch (err) {
    console.error(JSON.stringify({
      level:   'error',
      event:   'builder.runBuild.unhandled-error',
      jobId:   directive.jobId,
      message: err instanceof Error ? err.message : String(err),
      slice:   'F-builder',
      layer:   'R2',
    }))
    status = 'failed'
    // Attempt DB fail as last resort (runPipeline normally handles this internally)
    deps.db.failPipeline(directive.jobId as import('@/features/F-planner/types/planner-types').PlannerJobId).catch(() => {})
  }

  writeBuildEmission({
    jobId:       directive.jobId,
    userId:      directive.userId,
    projectId:   directive.projectId,
    status,
    completedAt: Date.now(),
  })
}

// ─── End ──────────────────────────────────────────────────────────────────────
