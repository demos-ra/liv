// @liv-standard v1.5.1 amended sprint-11-shot-4a sprint-11-shot-6 sprint-11-shot-6a sprint-11-shot-6b sprint-12-shot-2
// [F-discover/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
//             sprint-11-shot-4 (substrate threadQuery on entry + writeStateChange on completion)
//             sprint-11-shot-4a (projectId added to ResearchExecuteInput; substrate scope now (userId, projectId))
//             sprint-11-shot-6 (permission gate rationale recorded)
//             sprint-11-shot-6a (S11-B1: projectId added to completion write identity array)
//             sprint-11-shot-6b (source.scope corrected: userId → projectId at writeStateChange callsite)
// slice:      F-discover
// layer:      R3
// wires-in:
//   W-FN     executeResearch                ←  F-discover/R2 execute-research
//   W-FN     loadResearchBinding            ←  F-discover/R4 discover-binding-loader
//   W-FN     createArtifact                 ←  F-artifact/R3 artifact-contract
//   W-FN     createArtifactGraphPort        ←  F-artifact/R3 artifact-graph-port
//   W-ATOM   ResearchExecuteInput, ResearchEmissionResult  ←  F-discover/R0
//   W-FN     threadQuery                    ←  F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   W-FN     writeStateChange               ←  F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   W-ATOM   SubstrateWriteInput, ThreadQueryInput, IdentityRef, ScopeRef, RoleRef ← core/types/substrate.types
// wires-out:
//   [DISSOLVED sprint-8-shot-3a] W-ATOM DISCOVER_FRAMEWORK_MODULE  →  F-codec/R2 (F-codec dissolved; wire dead)
//   W-FN     executeResearchFromInput        →  F-discover external callers
//   W-ATOM   discoverRouter                  →  F-app api/router (tRPC, placeholder at v1.0)
// deps:
//   R0 ../config/f-discover-types
//   R2 ../app/execute-research
//   R4 ../exec/discover-binding-loader
//   R3 ../../F-artifact/contract/artifact-contract
//   R3 ../../F-artifact/contract/artifact-graph-port
//   R3 @/features/F-memory/contract/substrate-contract
//   [DISSOLVED sprint-8-shot-3a] R0 F-codec/config/codec-module-types (F-codec dissolved)
//   R5 @/core/types/substrate.types
// validated:  pending
//
// F-discover R3 — public boundary.
//
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// sprint-8-shot-3a: F-codec dissolved. DISCOVER_FRAMEWORK_MODULE + executor removed.
//
// sprint-11-shot-4 substrate wiring:
//   Decision-D (F-discover): Identity/relation shape.
//     Entry threadQuery: identity-recurrence on userId, scope=userId only.
//     Gap closed (sprint-11-shot-4a): ResearchExecuteInput now carries projectId.
//     Previously: ResearchExecuteInput carried no projectId at any level
//     (ResearchInput.userId present; no projectId field). Scope narrows to
//     userId-only until ResearchExecuteInput is extended with projectId
//     (deferred — no input-shape change in this shot per scope constraint).
//     Completion write identities: ['research-output', userId, turnId, projectId].
//     sprint-11-shot-6a (S11-B1): projectId added for consistent graph anchoring with F-plan.
//     turnId sourced from input.researchInput.turnId.
//     Relation: { type: 'research-emitted', modality: 'declarative',
//       identitiesWithRoles: [{ identity: userId, role: 'agent' }], negation: false }.
//     Source: { channel: 'internal-derivation', scope: userId }.
//     Fire-and-forget on completion write per CA4 independence.
//     Substrate read failure → empty context, program continues (parallel to §5.6).

//
// sprint-11-shot-6 (permission gate rationale):
//   writeStateChange callsites in this file are downstream of authenticated
//   entry points (F-chat session-gated for F-plan; F-router dispatch gated
//   by F-chat session for F-discover/F-verify). requirePermission() gates
//   for substrate_write and program_invoke_* are Sprint 9 scope per Perimeter
//   Standard scopeOut (F-009). Perimeter session auth is the active gate.
import type {
  ResearchExecuteInput,
  ResearchEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-discover-types'
// sprint-8-shot-3a: F-codec dissolved.
import { executeResearch } from '../app/execute-research'
import type { DiscoverServiceContainer } from '../app/execute-research'
import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import type { EpochMs } from '../config/f-discover-types'
import { threadQuery, writeStateChange }    from '@/features/F-memory/contract/substrate-contract'
import type {
  SubstrateWriteInput,
  ThreadQueryInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                                           from '@/core/types/substrate.types'

// ─── Default service container (real wiring) ─────────────────────────────────

function defaultServices(): DiscoverServiceContainer {
  return {
    createArtifact: async (input: CreateArtifactInput) => {
      const result = await createArtifact(input)
      if (result.ok) {
        return { ok: true, data: result.data }
      }
      return {
        ok: false,
        error: {
          code:    result.error.code,
          message: result.error.message,
          context: result.error.context as Record<string, unknown> | undefined,
        },
      }
    },
    epochNow: () => Date.now() as unknown as EpochMs,
  }
}

// ─── Substrate helpers ────────────────────────────────────────────────────────

async function readDiscoverContext(userId: string, projectId: string): Promise<string> {
  // sprint-11-shot-4a: scope is now (userId, projectId) — gap closed.
  try {
    const queryInput: ThreadQueryInput = {
      threadKind: 'identity-recurrence',
      anchor:     userId as IdentityRef,
      scope:      projectId as ScopeRef,
      limit:      20,
    }
    const result = await threadQuery(queryInput, userId)
    if (result.ok && result.data.records.length > 0) {
      return result.data.records
        .map(r => r.content.identities.join(' | '))
        .join('\n')
    }
  } catch (err) {
    console.error('[F-discover] threadQuery failed', err instanceof Error ? err.message : err)
  }
  return ''
}

function writeResearchOutput(userId: string, turnId: string, projectId: string): void {
  const write: SubstrateWriteInput = {
    userId,
    content: {
      identities: [
        'research-output' as IdentityRef,
        userId            as IdentityRef,
        turnId            as IdentityRef,
        projectId         as IdentityRef,
      ],
      relations: [
        {
          type:                'research-emitted' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: userId as IdentityRef, role: 'agent' as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   Date.now(),
      // Side-Quest Shot 4 (Phase D, Research Standard v1.1): F-discover emits via
      // 'internal-derivation' with contentClass: 'wearer-life'. Basis:
      // research-output / research-emitted records carry `{role: 'agent', identity: userId}`
      // — the wearer as agent of the research emission. Records of wearer
      // cognition (the wearer's research) participating in the cognition LIV
      // extends per LM v3.4 LMA13.
      // Replaces Shot 1 Phase A provisional 'system-introspection' stamp.
      source: { channel: 'internal-derivation', contentClass: 'wearer-life', scope: projectId as ScopeRef },
    },
  }
  writeStateChange(write).catch((err: unknown) => {
    console.error('[F-discover] writeStateChange failed', err instanceof Error ? err.message : err)
  })
}

// ─── executeResearchFromInput — primary programmatic entry ───────────────────

export async function executeResearchFromInput(
  input: ResearchExecuteInput,
): Promise<ResearchEmissionResult> {
  const userId = input.researchInput.userId
  const turnId = input.researchInput.turnId

  // Substrate context read on entry — failure → empty context, program continues.
  const _substrateContext = await readDiscoverContext(userId, input.projectId)

  const result = await executeResearch(input, defaultServices())

  // Substrate write on completion — fire-and-forget per CA4 independence.
  if (result.ok) {
    writeResearchOutput(userId, turnId, input.projectId)
  }

  return result
}

export async function executeResearchFromInputWithServices(
  input:    ResearchExecuteInput,
  services: DiscoverServiceContainer,
): Promise<ResearchEmissionResult> {
  return executeResearch(input, services)
}

// sprint-8-shot-3a: DISCOVER_FRAMEWORK_MODULE + livDiscoveryStubExecutor removed.

// ─── discoverRouter — tRPC placeholder at v1.0 ───────────────────────────────

export const discoverRouter = {
  __sprint_5_status: 'programmatic-only',
} as const

// ─── Type re-exports ─────────────────────────────────────────────────────────

export type {
  ResearchExecuteInput,
  ResearchEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-discover-types'

// ─── End of discover-contract.ts ────────────────────────────────────────────
