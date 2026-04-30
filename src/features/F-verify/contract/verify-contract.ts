// @liv-standard v1.5.1
// [F-verify/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
// slice:      F-verify
// layer:      R3
// wires-in:
//   W-FN     executeVerification           ←  F-verify/R2 execute-verification
//   W-FN     loadVerificationBinding       ←  F-verify/R4 verify-binding-loader
//   W-FN     createArtifact                ←  F-artifact/R3 artifact-contract
//   W-FN     createArtifactGraphPort       ←  F-memory/R3 memory-graph-contract
//   W-ATOM   VerificationExecuteInput,
//            VerificationEmissionResult,
//            FrameworkModule,
//            ModuleExecutor               ←  F-verify/R0 + F-codec/R0
// wires-out:
//   W-ATOM   VERIFY_FRAMEWORK_MODULE       →  F-codec/R2 codec-orchestrate (registry)
//   W-FN     executeVerificationFromInput   →  F-verify external callers
//   W-ATOM   verifyRouter                  →  F-app api/router (tRPC)
// deps:
//   R0 ../config/f-verify-types
//   R2 ../app/execute-verification
//   R4 ../exec/verify-binding-loader
//   R3 ../../F-artifact/contract/artifact-contract
//   R3 ../../F-memory/contract/memory-graph-contract
//   R0 ../../F-codec/config/codec-module-types
// validated:  pending
//
// F-verify R3 — public boundary.
//
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// Three exports:
//   1. executeVerificationFromInput — direct programmatic entry (preferred).
//      Takes VerificationExecuteInput, returns VerificationEmissionResult.
//   2. VERIFY_FRAMEWORK_MODULE — codec-orchestrate registry registration.
//      id = 'liv-verification' (per Sprint 4 D5 decision: 'verification'
//      module-id retained by codec-verify.ts as 'narrative-audit').
//      Executor stub: codec routes verificative-mode user messages to
//      narrative-audit (LLM-backed); F-verify is reachable only via
//      programmatic invocation (executeVerificationFromInput) at v1.0.
//   3. verifyRouter — tRPC router (placeholder at v1.0; programmatic surface
//      is the active path for first emission per Sprint 4 close criteria).

import type {
  VerificationExecuteInput,
  VerificationEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-verify-types'
import type {
  FrameworkModule,
  ModuleExecutor,
} from '@/features/F-codec/config/codec-module-types'
import { executeVerification } from '../app/execute-verification'
import type { VerifyServiceContainer, ArtifactGraphPort } from '../app/execute-verification'
import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import { createArtifactGraphPort } from '@/features/F-memory/contract/memory-graph-contract'
import type { EpochMs } from '../config/f-verify-types'

// ─── Default service container (real wiring) ─────────────────────────────────

/**
 * Default service container — wires F-artifact + F-memory real implementations.
 * Test paths construct alternate containers (in-memory port, fake clock).
 *
 * Mirrors F-plan/contract/plan-inject.ts pattern.
 */
function defaultServices(): VerifyServiceContainer {
  return {
    createArtifact: async (input: CreateArtifactInput, port: ArtifactGraphPort) => {
      // Cast through unknown: F-artifact's CreateArtifactResult shape matches
      // VerifyServiceContainer.createArtifact return shape structurally.
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

// ─── executeVerificationFromInput — primary programmatic entry ───────────────

/**
 * Direct programmatic entry point for VS emission.
 * Callers (F-verify-internal admin, future F-research-verify, framework-audit
 * runtime probes) construct VerificationExecuteInput and invoke this. Returns
 * VerificationEmissionResult with success → ArtifactEmission containing the
 * verificationAnchorNodeId at writes.a7.artifactAnchorNodeId.
 */
export async function executeVerificationFromInput(
  input: VerificationExecuteInput,
): Promise<VerificationEmissionResult> {
  return executeVerification(input, defaultServices())
}

/**
 * Allow callers to inject a custom service container (test paths, alternate
 * graph backends, deterministic clock).
 */
export async function executeVerificationFromInputWithServices(
  input:    VerificationExecuteInput,
  services: VerifyServiceContainer,
): Promise<VerificationEmissionResult> {
  return executeVerification(input, services)
}

// ─── VERIFY_FRAMEWORK_MODULE — codec-orchestrate registration ────────────────
//
// Sprint 4 D5 decision (Demos confirmed):
//   - codec-verify.ts retains its module but renames id 'verification' →
//     'narrative-audit'. F-verify takes id 'liv-verification'.
//   - Both modules persist; names match function (LIV-Standard mechanical
//     predicate-verification ≠ LLM narrative audit).
//
// F-verify's executor is a STUB at v1.0 — codec does NOT route user messages
// to F-verify mechanically. Programmatic invocation is the active path
// (executeVerificationFromInput). Stub mirrors F-plan's BUILD_MODULE pattern:
// registry visibility + typed unreachable error if reached.
//
// When the first F-codec routing-rule lands that points verificative-mode
// mechanical messages at F-verify, the executor will replace the stub with a
// real adapter (parallel to F-plan/contract/plan-module planExecutorAdapter).

const liVerificationStubExecutor: ModuleExecutor = async () => ({
  ok: false,
  error: {
    code:    'LIV_VERIFICATION_EXECUTOR_UNREACHABLE',
    message: 'VERIFY_FRAMEWORK_MODULE.executor is a stub at v1.0 — F-verify is reached programmatically via executeVerificationFromInput, not via codec dispatch. Reaching this code indicates a routing bug.',
  },
})

export const VERIFY_FRAMEWORK_MODULE: FrameworkModule = {
  id:    'liv-verification',
  mode:  'verificative',
  label: 'LIV Verification',
  artifactSchema: {
    name:   'verification-artifact',
    fields: [
      { key: 'verificationId',      label: 'Verification ID',                   required: true  },
      { key: 'targetArtifactRef',   label: 'Target artifact reference',         required: true  },
      { key: 'targetArtifactKind',  label: 'Target artifact kind',              required: true  },
      { key: 'verdictTruthValue',   label: 'Verdict (verified | failed | null)', required: true  },
      { key: 'aggregationBasis',    label: 'Aggregation basis',                 required: true  },
      { key: 'failedPredicateIds',  label: 'Failed predicate IDs',              required: false },
      { key: 'predicateCount',      label: 'Predicate cardinality',             required: true  },
      { key: 'bindingDomain',       label: 'Binding domain (domainId)',         required: true  },
    ],
  },
  executor: liVerificationStubExecutor,
}

// ─── verifyRouter — tRPC placeholder at v1.0 ─────────────────────────────────
//
// At Sprint 4 close, programmatic invocation is the active path. The tRPC
// surface is declared as a placeholder for HTTP-bound consumers (admin probes,
// future client-side audit triggers). When the first HTTP-bound caller lands,
// this slot is filled with a real tRPC router (mirroring F-plan/contract/plan-contract).

export const verifyRouter = {
  // Placeholder. Populated when first HTTP consumer lands.
  __sprint_4_status: 'programmatic-only',
} as const

// ─── Type re-exports — consumers can pull everything from R3 ─────────────────

export type {
  VerificationExecuteInput,
  VerificationEmissionResult,
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '../config/f-verify-types'

// ─── End of verify-contract.ts ──────────────────────────────────────────────
