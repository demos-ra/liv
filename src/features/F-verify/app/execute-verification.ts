// @liv-standard v1.5.1
// [F-verify/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
// slice:      F-verify
// layer:      R2
// wires-in:
//   W-ATOM   VerificationInput, VerificationArtifactContent  ←  F-verify/R0
//   W-ATOM   VerificationExecuteInput, ClassificationTriple   ←  F-verify/R0
//   W-ATOM   VerificationEmissionResult                       ←  F-verify/R0
//   W-ATOM   ArtifactPayload, CreateArtifactInput             ←  F-verify/R0 (re-export from AS)
//   W-ATOM   NodeId, EpochMs                                  ←  core/R5 primitives (typed via R0)
//   W-FN     composeVerification, defaultMintVerificationId   ←  F-verify/R1 compose-verification
//   W-FN     runVerificationGates                             ←  F-verify/R1 run-verification-gates
//   W-INJECT createArtifact                                   ←  F-artifact/R3 (via inject)
//   W-INJECT ArtifactGraphPort                                ←  F-artifact/R3 (via inject)
// wires-out:
//   W-FN     executeVerification  →  F-verify/R3 verify-contract
// deps:
//   R0 ../config/f-verify-types
//   R1 ../domain/compose-verification
//   R1 ../domain/run-verification-gates
//   R3 ../../F-artifact/contract/artifact-contract  (type-only)
// validated:  pending
//
// F-verify R2 — orchestration. Composes one VerificationArtifactContent and
// emits via AS v2.2 createArtifact at HR-VS3.
//
// A4: I/O is restricted to the ArtifactGraphPort dependency surface (and the
//     epoch-time clock). Both are caller-injected at R2 boundary per A5.
//
// Pipeline (1:1 with spec §6.11 + Sprint 4 brief D2):
//   1. HR-VS1 receive: validate VerificationInput shape via gateVS1 (G-VS1).
//      Reject with VERIFICATION_INPUT_INVALID on shape failure (pre-compose
//      short-circuit; spec §6.8 errorContract).
//   2. HR-VS2 binding consumption: input.binding is by-value (zero registry
//      lookup at v1.0 — caller threads binding into VerificationInput). The
//      verify-binding-loader (R4) is the registry lookup helper; R2 leaves
//      callers free to construct VerificationInput.binding directly OR to
//      resolve from the registry.
//   3. Compose: composeVerification (pure R1) → candidate content.
//   4. Gate: runVerificationGates (pure R1) → G-VS1..G-VS9 fail-fast.
//      Reject with VERIFICATION_VALIDITY_FAILED + failedAxiom on gate fail.
//   5. HR-VS3 emit: createArtifact (AS v2.2 R3) with framework = {id:
//      'verification', version: '1.0'}, payload.domain = 'verification',
//      content = candidate. dependsOn: [target.artifactRef] per spec §6.11
//      ArA4d dependency-edge requirement.
//      AS rejection → VERIFICATION_EMISSION_REJECTED.
//
// Pattern parallel: F-plan/app/plan-emit.ts confirmAndEmit. F-verify is
// stateless (no draft/lane DB) — pure passthrough at v1.0.

import type { Result, NodeId, Semver, CognitivePrimitive } from '@/core/types/primitives'
import type {
  VerificationInput,
  VerificationArtifactContent,
  VerificationEmissionResult,
  VerificationValidityError,
  ArtifactEmission,
  ArtifactPayload,
  CreateArtifactInput,
  EpochMs,
} from '../config/f-verify-types'
import type { VerificationExecuteInput } from '../config/f-verify-types'
import { composeVerification, defaultMintVerificationId } from '../domain/compose-verification'
import { runVerificationGates, gateVS1 } from '../domain/run-verification-gates'

// ─── Inject surface (R3 wires real implementations) ──────────────────────────

/**
 * R4 dependency surface consumed by F-verify R2. Caller (R3) injects concrete
 * implementations at slice boundary per A5.
 *
 * Mirror of F-plan's plan-inject ServiceContainer:
 *   - createArtifact: AS v2.2 R3 entry (createArtifact from F-artifact/R3)
 *   - createArtifact: AS v2.2 R3 entry (single-arg — port dissolved b1-final-shot-3)
 *   - epochNow: time source
 *   - mintVerificationId: optional override (default: generateId('verif'))
 */
export type VerifyServiceContainer = {
  createArtifact: (
    input: CreateArtifactInput,
  ) => Promise<{ ok: true; data: ArtifactEmission } | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }>
  epochNow: () => EpochMs
  mintVerificationId?: () => ReturnType<typeof defaultMintVerificationId>
}

// ─── Constants (carrier identity) ────────────────────────────────────────────

const VS_FRAMEWORK_ID      = 'verification'
const VS_FRAMEWORK_VERSION = '1.0' as Semver
const VS_PAYLOAD_DOMAIN    = 'verification'
const VS_PAYLOAD_DOMAIN_VERSION = '1.0' as Semver
const VS_SCHEMA_REF        = 'VerificationArtifactContent'

// ─── Authoring program identity (caller-default) ─────────────────────────────
// F-verify is the v1.0 authoring program. The `programVersion` here pins to
// F-verify slice version; callers (e.g., F-research-verify, future) will pin
// to their own version. The composer reads input.authoringProgram.programId
// verbatim; this constant is the slice-default for the F-verify-internal
// caller path.

const F_VERIFY_PROGRAM_VERSION = '1.0.0' as Semver

// ─── executeVerification (R2 orchestration) ──────────────────────────────────

export async function executeVerification(
  executeInput: VerificationExecuteInput,
  services:     VerifyServiceContainer,
): Promise<VerificationEmissionResult> {
  const { verificationInput, classification, projectId } = executeInput

  // Step 1 — HR-VS1 receive: G-VS1 input-shape gate.
  // Pre-compose short-circuit per spec §6.8 errorContract VERIFICATION_INPUT_INVALID.
  const inputGate = gateVS1(verificationInput)
  if (!inputGate.ok) {
    return {
      ok: false,
      error: {
        code:    'VERIFICATION_INPUT_INVALID',
        message: inputGate.error.message,
        failedAxiom: inputGate.error.failedAxiom,
        context: { ...inputGate.error.context, stage: 'pre-compose-input-gate' },
      },
    }
  }

  // Step 2 — HR-VS2 binding consumption.
  // v1.0: caller threads input.binding directly. R4 verify-binding-loader is
  // the registry helper for callers that prefer registry lookup. Either path
  // arrives here with a populated input.binding.

  // Step 3 — Compose (pure R1).
  const content: VerificationArtifactContent = composeVerification(
    verificationInput,
    {
      epochNow: services.epochNow,
      mintVerificationId: services.mintVerificationId ?? defaultMintVerificationId,
    },
    F_VERIFY_PROGRAM_VERSION,
  )

  // Step 4 — Gate (pure R1) G-VS1..G-VS9.
  const gateResult = runVerificationGates(verificationInput, content)
  if (!gateResult.ok) {
    return {
      ok: false,
      error: {
        ...gateResult.error,
        // gateResult.error already carries code='VERIFICATION_VALIDITY_FAILED' + failedAxiom.
      },
    }
  }

  // Step 5 — HR-VS3 emit: AS v2.2 createArtifact.
  const payload: ArtifactPayload = {
    domain:        VS_PAYLOAD_DOMAIN,
    domainVersion: VS_PAYLOAD_DOMAIN_VERSION,
    schemaRef:     VS_SCHEMA_REF,
    content,
  }

  const dependsOn: NodeId[] = [verificationInput.target.artifactRef]

  const createInput: CreateArtifactInput = {
    framework: {
      id:      VS_FRAMEWORK_ID,
      version: VS_FRAMEWORK_VERSION,
    },
    turnId:               verificationInput.turnId,
    userId:               verificationInput.userId,
    projectId,
    payload,
    classificationNodeId: classification.classificationNodeId,
    primitive:            classification.primitive as CognitivePrimitive,
    confidence:           classification.confidence,
    dependsOn,
  }

  const emit = await services.createArtifact(createInput)
  if (!emit.ok) {
    const validityError: VerificationValidityError = {
      code:    'VERIFICATION_EMISSION_REJECTED',
      message: `AS v2.2 rejected createArtifact carrier emission: ${emit.error.message}`,
      context: { cause: emit.error, stage: 'as-emission' },
    }
    return { ok: false, error: validityError }
  }

  return { ok: true, data: emit.data }
}

// ─── End of execute-verification.ts ─────────────────────────────────────────
