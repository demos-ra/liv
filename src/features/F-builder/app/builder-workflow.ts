// @liv-standard v1.5.1 amended sprint-11-shot-5 sprint-11-shot-6 sprint-11-shot-6b sprint-12-shot-2 sprint-12-shot-3
// [F-builder/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — F-builder spin-out)
//             sprint-12-shot-3 (F-planner dissolution — imports redirected to builder-pipeline)
// slice:      F-builder
// layer:      R2
// wires-in:
//   W-ATOM    BuildDirective  F-builder/R0 builder-types
//   W-ATOM    BuildEmission   F-builder/R0 builder-types
//   W-ATOM    BUILDER_CONFIG  F-builder/R0 builder-config
//   W-FN      runPipeline     F-builder/domain/builder-pipeline  (post-dissolution)
//   W-INJECT  BuilderPipelineDeps  F-builder/domain/builder-pipeline
//   W-FN      writeStateChange  F-memory/contract/substrate-contract  (BuildEmission write)
//   W-ATOM    SubstrateWriteInput, IdentityRef, ScopeRef, RoleRef  core/types/substrate.types
// wires-out:
//   W-FN  runBuild  →  F-builder/R3 builder-contract
// deps:
//   R0  ../config/builder-types
//   R0  ../config/builder-config
//   R2  ../domain/builder-pipeline
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/types/substrate.types
// validated:  pending

import type {
  BuilderPipelineDeps,
} from '../domain/builder-pipeline'
import { runPipeline } from '../domain/builder-pipeline'
import type { PlannerJobId } from '@/features/F-plan/types/pipeline-types'
import type { BuildDirective, BuildEmission, BuildStatus } from '../config/builder-types'
import { writeStateChange }  from '@/features/F-memory/contract/substrate-contract'
import type {
  SubstrateWriteInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                            from '@/core/types/substrate.types'

export type BuilderDeps = BuilderPipelineDeps

function writeBuildEmission(emission: BuildEmission): void {
  const write: SubstrateWriteInput = {
    userId: emission.userId,
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
// Delegates to runPipeline (F-builder/domain/builder-pipeline — sprint-12-shot-3).
// Writes BuildEmission to substrate on completion (fire-and-forget, CA4).
// Returns Promise<void> — matches fire-and-forget contract of handleBuildRequest.

export async function runBuild(
  deps:      BuilderPipelineDeps,
  directive: BuildDirective,
): Promise<void> {
  let status: BuildStatus = 'failed'

  try {
    await runPipeline(deps, directive.jobId as PlannerJobId, null)
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
    deps.db.failPipeline(directive.jobId as PlannerJobId).catch(() => {})
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
