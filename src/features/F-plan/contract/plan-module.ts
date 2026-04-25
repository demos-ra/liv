// @liv-standard v1.5.1
// [F-plan/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-b (F-codec dispatch wire-up)
// slice:      F-plan
// layer:      R3
// wires-in:
//   W-ATOM    Result                 ←  core/R5 primitives
//   W-ATOM    FrameworkModule, ModuleExecutionResult, ModuleExecutor ← F-codec/R0 codec-module-types
//   W-ATOM    PlanExecuteResult      ← F-plan/R0 plan-types
//   W-HOOK    executePlan            ← F-plan/R3 plan-contract
// wires-out:
//   W-ATOM    PLAN_MODULE            →  F-codec/R2 codec-orchestrate (registration site)
//   W-HOOK    planExecutorAdapter    →  F-codec/R2 codec-orchestrate (via PLAN_MODULE.executor)
// deps:
//   R0  ../types/plan-types
//   R3  ./plan-contract
//   R3  @/features/F-codec/config/codec-module-types
//   R5  @/core/types/primitives
// validated:  pending
//
// F-plan R3 — Sprint B integration surface. Exposes PLAN_MODULE (FrameworkModule
// instance) for codec-orchestrate registration, and adapts PlanExecuteResult
// to ModuleExecutionResult for the unified module executor pattern.
//
// A2 (cross-slice imports): F-plan R3 imports F-codec R0 (codec-module-types)
//     for the FrameworkModule shape. R3→R0 cross-slice is permitted; this is
//     the integration boundary by design — the directional dependency is
//     F-plan → F-codec (F-plan declares conformance to F-codec's module
//     contract). F-codec depends on F-plan in turn at R2/R3 (orchestrate
//     registration site). Bidirectional via separate layers — neither slice
//     imports the other's R2/R3 from its own R0/R1.
// A3: PLAN_MODULE is a typed F-codec atom instance. mapResultToArtifactData
//     is the typed boundary between F-plan internal types and F-codec's
//     ModuleExecutionResult.artifactData.
// A4: pure adapter — no I/O. executePlan threading is async because
//     executePlan is async; adapter does not introduce new I/O.

import type { Result } from '@/core/types/primitives'
import type {
  FrameworkModule,
  ModuleExecutionResult,
  ModuleExecutor,
} from '@/features/F-codec/config/codec-module-types'
import type { PlanExecuteResult } from '../types/plan-types'
import { executePlan } from './plan-contract'

// ─── ArtifactData shape mapping ──────────────────────────────────────────────
// PlanExecuteResult is a three-kind discriminated union; ModuleExecutionResult
// .artifactData is Record<string, string>. The kind discriminator + payload
// id encode losslessly into two fields. Dashboard / chat-render consumers
// pattern-match on `kind` to reconstruct typed semantics.
//
//   kind:'draft'    → { kind: 'draft',   draftId }
//   kind:'amended'  → { kind: 'amended', draftId }
//   kind:'emitted'  → { kind: 'emitted', planAnchorNodeId }
//
// Sprint B keeps this minimal. Dashboard card surfacing (post-Sprint-B)
// extends with summary fields if the host renderer needs more.

function mapResultToArtifactData(r: PlanExecuteResult): Record<string, string> {
  switch (r.kind) {
    case 'draft':
      return { kind: 'draft', draftId: r.draftId as string }
    case 'amended':
      return { kind: 'amended', draftId: r.draftId as string }
    case 'emitted':
      return { kind: 'emitted', planAnchorNodeId: r.planAnchorNodeId as string }
  }
}

// ─── Plan executor adapter ───────────────────────────────────────────────────
// Conforms to F-codec's ModuleExecutor signature. Threads through to F-plan's
// executePlan, then maps PlanExecuteResult → ModuleExecutionResult.
//
// projectId handling: F-codec passes `string | undefined`. F-plan's
// executePlan owns the D-PROJECT gate (rejects empty/undefined explicitly
// with PLAN_REJECTED_NO_PROJECT_SCOPE). Adapter passes `projectId ?? ''`
// — the empty-string trips the same gate that an explicit empty would.
//
// turnId is required at executePlan signature; adapter forwards directly.
//
// On executePlan error: surface as ModuleExecutionResult-typed Result.err
// preserving the inner error code/message verbatim.

const planExecutorAdapter: ModuleExecutor = async (
  content,
  userId,
  projectId,
  turnId,
  modelId,
): Promise<Result<ModuleExecutionResult>> => {
  const result = await executePlan(content, userId, projectId ?? '', turnId, modelId)

  if (!result.ok) {
    return {
      ok:    false,
      error: {
        code:    result.error.code,
        message: result.error.message,
      },
    }
  }

  const r = result.data
  return {
    ok: true,
    data: {
      module:       PLAN_MODULE,
      artifactData: mapResultToArtifactData(r),
      response:     r.summary.body,
    },
  }
}

// ─── PLAN_MODULE — F-codec FrameworkModule instance ──────────────────────────
// Registered at codec-orchestrate startup. mode:'structural' competes with
// PLANNING_MODULE in the F-codec registry; per D-PLANNING-UNHOOK,
// PLANNING_MODULE registration is removed in Sprint B so structural-mode
// routes deterministically to PLAN_MODULE.
//
// artifactSchema describes the PlanArtifactContent shape projected into the
// dashboard card / chat-render surface — three fields covering the three
// PlanExecuteResult kinds.

export const PLAN_MODULE: FrameworkModule = {
  id:    'plan',
  mode:  'structural',
  label: 'Plan',
  artifactSchema: {
    name:   'plan',
    fields: [
      { key: 'kind',             label: 'Result kind',       required: true  },
      { key: 'draftId',          label: 'Draft id',          required: false },
      { key: 'planAnchorNodeId', label: 'Plan anchor node',  required: false },
    ],
  },
  executor: planExecutorAdapter,
}

// ─── End of plan-module.ts ───────────────────────────────────────────────────
