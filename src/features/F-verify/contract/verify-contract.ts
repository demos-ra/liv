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
//   W-FN     createArtifactGraphPort       ←  F-artifact/R3 artifact-graph-port (relocated from F-memory at Sprint 8 Shot 3b)
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
//   R3 ../../F-artifact/contract/artifact-graph-port
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
// sprint-8-shot-3a: F-codec dissolved.
//   FrameworkModule + ModuleExecutor imports removed; VERIFY_FRAMEWORK_MODULE
//   and liVerificationStubExecutor exports removed (codec registry no longer exists).
//   F-verify remains reachable programmatically via executeVerificationFromInput
//   (the LIV-Standard mechanical predicate-verification path). Sprint 9 wires
//   F-router rules pointing verificative-mode messages at this entry point directly.
import { executeVerification } from '../app/execute-verification'
import type { VerifyServiceContainer, ArtifactGraphPort } from '../app/execute-verification'
import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import { createArtifactGraphPort } from '@/features/F-artifact/contract/artifact-graph-port'
import type { EpochMs } from '../config/f-verify-types'

// ─── Default service container (real wiring) ─────────────────────────────────

/**
 * Default service container — wires F-artifact real implementations.
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

// sprint-8-shot-3a: VERIFY_FRAMEWORK_MODULE + liVerificationStubExecutor
// removed (F-codec dissolved). F-verify is reached programmatically via
// executeVerificationFromInput. Sprint 9 wires F-router rules pointing
// verificative-mode messages at this entry point directly.

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
