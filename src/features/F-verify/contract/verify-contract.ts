// @liv-standard v1.5.1 amended sprint-11-shot-4a sprint-11-shot-6 sprint-11-shot-6a sprint-11-shot-6b sprint-12-shot-2 sprint-13-shot-3
// [F-verify/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
//             sprint-11-shot-4 (substrate threadQuery on entry + writeStateChange on completion)
//             sprint-11-shot-4a (projectId added to VerificationExecuteInput; substrate scope now (userId, projectId))
//             sprint-11-shot-6 (permission gate rationale recorded)
//             sprint-11-shot-6a (S11-B1: projectId added to completion write identity array)
//             sprint-11-shot-6b (source.scope corrected: userId → projectId at writeStateChange callsite)
// slice:      F-verify
// layer:      R3
// wires-in:
//   W-FN     executeVerification           ←  F-verify/R2 execute-verification
//   W-FN     loadVerificationBinding       ←  F-verify/R4 verify-binding-loader
//   W-FN     createArtifact                ←  F-artifact/R3 artifact-contract
//   W-FN     createArtifactGraphPort       ←  F-artifact/R3 artifact-graph-port
//   W-ATOM   VerificationExecuteInput, VerificationEmissionResult  ←  F-verify/R0
//   W-FN     threadQuery                   ←  F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   [absorbed sprint-13-shot-3 from F-la-config]
//   W-FN     la-validator (internal)        ←  F-verify/R4 la-validator (CLI only)
//   W-FN     useNamespace, StateRegistryProvider ← F-verify/R3 registry-hook (→ consumers)
//   W-FN     writeStateChange              ←  F-memory/contract/substrate-contract  (sprint-11-shot-4)
//   W-ATOM   SubstrateWriteInput, ThreadQueryInput, IdentityRef, ScopeRef, RoleRef ← core/types/substrate.types
// wires-out:
//   [DISSOLVED sprint-8-shot-3a] W-ATOM VERIFY_FRAMEWORK_MODULE  →  F-codec/R2 (F-codec dissolved; wire dead)
//   W-FN     executeVerificationFromInput   →  F-verify external callers
//   W-ATOM   verifyRouter                  →  F-app api/router (tRPC)
// deps:
//   R0 ../config/f-verify-types
//   R2 ../app/execute-verification
//   R4 ../exec/verify-binding-loader
//   R3 ../../F-artifact/contract/artifact-contract
//   R3 ../../F-artifact/contract/artifact-graph-port
//   R3 @/features/F-memory/contract/substrate-contract
//   [DISSOLVED sprint-8-shot-3a] R0 F-codec/config/codec-module-types (F-codec dissolved)
//   R5 @/core/types/substrate.types
// validated:  pending
//
// F-verify R3 — public boundary.
//
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// sprint-8-shot-3a: F-codec dissolved. VERIFY_FRAMEWORK_MODULE + executor removed.
//
// sprint-11-shot-4 substrate wiring:
//   Decision-D (F-verify): Identity/relation shape.
//     Entry threadQuery: identity-recurrence on userId, scope=userId only.
//     Gap closed (sprint-11-shot-4a): VerificationExecuteInput now carries projectId.
//     Previously: VerificationExecuteInput carried no projectId at any level
//     (VerificationInput.userId present; no projectId field). Scope narrows to
//     userId-only until VerificationExecuteInput is extended with projectId
//     (deferred — no input-shape change in this shot per scope constraint).
//     Completion write identities: ['verification-output', userId, turnId, projectId].
//     sprint-11-shot-6a (S11-B1): projectId added for consistent graph anchoring with F-plan.
//     turnId sourced from input.verificationInput.turnId.
//     Relation: { type: 'verification-emitted', modality: 'declarative',
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
  VerificationExecuteInput,
  VerificationEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-verify-types'
// sprint-8-shot-3a: F-codec dissolved.
import { executeVerification } from '../app/execute-verification'
import type { VerifyServiceContainer, ArtifactGraphPort } from '../app/execute-verification'
import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import { createArtifactGraphPort } from '@/features/F-artifact/contract/artifact-graph-port'
import type { EpochMs } from '../config/f-verify-types'
import { threadQuery, writeStateChange }    from '@/features/F-memory/contract/substrate-contract'
import type {
  SubstrateWriteInput,
  ThreadQueryInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                                           from '@/core/types/substrate.types'

// ─── Default service container (real wiring) ─────────────────────────────────

function defaultServices(): VerifyServiceContainer {
  return {
    createArtifact: async (input: CreateArtifactInput, port: ArtifactGraphPort) => {
      const result = await createArtifact(
        input as unknown as Parameters<typeof createArtifact>[0],
        port  as unknown as Parameters<typeof createArtifact>[1],
      )
      if (result.ok) {
        return { ok: true, data: result.data as unknown as ArtifactEmission }
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
    createArtifactGraphPort: () => createArtifactGraphPort() as unknown as ArtifactGraphPort,
    epochNow: () => Date.now() as unknown as EpochMs,
  }
}

// ─── Substrate helpers ────────────────────────────────────────────────────────

async function readVerifyContext(userId: string, projectId: string): Promise<string> {
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
    console.error('[F-verify] threadQuery failed', err instanceof Error ? err.message : err)
  }
  return ''
}

function writeVerificationOutput(userId: string, turnId: string, projectId: string): void {
  const write: SubstrateWriteInput = {
    userId,
    content: {
      identities: [
        'verification-output' as IdentityRef,
        userId                as IdentityRef,
        turnId                as IdentityRef,
        projectId             as IdentityRef,
      ],
      relations: [
        {
          type:                'verification-emitted' as IdentityRef,
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
      source: { channel: 'internal-derivation', scope: projectId as ScopeRef },
    },
  }
  writeStateChange(write).catch((err: unknown) => {
    console.error('[F-verify] writeStateChange failed', err instanceof Error ? err.message : err)
  })
}

// ─── executeVerificationFromInput — primary programmatic entry ───────────────

export async function executeVerificationFromInput(
  input: VerificationExecuteInput,
): Promise<VerificationEmissionResult> {
  const userId = input.verificationInput.userId
  const turnId = input.verificationInput.turnId

  // Substrate context read on entry — failure → empty context, program continues.
  const _substrateContext = await readVerifyContext(userId, input.projectId)

  const result = await executeVerification(input, defaultServices())

  // Substrate write on completion — fire-and-forget per CA4 independence.
  if (result.ok) {
    writeVerificationOutput(userId, turnId, input.projectId)
  }

  return result
}

export async function executeVerificationFromInputWithServices(
  input:    VerificationExecuteInput,
  services: VerifyServiceContainer,
): Promise<VerificationEmissionResult> {
  return executeVerification(input, services)
}

// sprint-8-shot-3a: VERIFY_FRAMEWORK_MODULE + liVerificationStubExecutor removed.

// ─── verifyRouter — tRPC placeholder at v1.0 ─────────────────────────────────

export const verifyRouter = {
  __sprint_4_status: 'programmatic-only',
} as const

// ─── Type re-exports ─────────────────────────────────────────────────────────

export type {
  VerificationExecuteInput,
  VerificationEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-verify-types'

// ─── End of verify-contract.ts ──────────────────────────────────────────────
