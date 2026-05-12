// @liv-standard v1.5.1
// [F-discover/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
// slice:      F-discover
// layer:      R2
// wires-in:
//   W-ATOM   ResearchInput, ResearchArtifactContent  ←  F-discover/R0
//   W-ATOM   ResearchExecuteInput, ClassificationTriple ←  F-discover/R0
//   W-ATOM   ResearchEmissionResult                 ←  F-discover/R0
//   W-ATOM   ArtifactPayload, CreateArtifactInput   ←  F-discover/R0 (re-export from AS)
//   W-ATOM   NodeId, EpochMs                        ←  core/R5 primitives (typed via R0)
//   W-FN     composeResearch, defaultMintResearchId ←  F-discover/R1 compose-research
//   W-FN     runResearchGates, gateRS1              ←  F-discover/R1 run-research-gates
//   W-INJECT createArtifact                         ←  F-artifact/R3 (via inject)
//   W-INJECT ArtifactGraphPort                      ←  F-artifact/R3 (via inject)
// wires-out:
//   W-FN     executeResearch  →  F-discover/R3 discover-contract
// deps:
//   R0 ../config/f-discover-types
//   R1 ../domain/compose-research
//   R1 ../domain/run-research-gates
// validated:  pending
//
// F-discover R2 — orchestration. Composes one ResearchArtifactContent and
// emits via AS v2.2 createArtifact at HR-RS3.
//
// A4: I/O is restricted to the ArtifactGraphPort dependency surface (and the
//     epoch-time clock). Both are caller-injected at R2 boundary per A5.
//
// Pipeline (1:1 with spec §6.11 + Sprint 5 brief):
//   1. HR-RS1 receive: validate ResearchInput shape via gateRS1 (G-RS1).
//      Reject with RESEARCH_INPUT_INVALID on shape failure (pre-compose
//      short-circuit; spec §6.8 errorContract).
//   2. HR-RS2 binding consumption: input.binding is by-value (zero registry
//      lookup at v1.0 — caller threads binding into ResearchInput). The
//      discover-binding-loader (R4) is the registry lookup helper; R2 leaves
//      callers free to construct ResearchInput.binding directly OR to
//      resolve from the registry.
//   3. Compose: composeResearch (pure R1) → candidate content.
//   4. Gate: runResearchGates (pure R1) → G-RS1..G-RS10 fail-fast.
//      Reject with RESEARCH_VALIDITY_FAILED + failedAxiom on gate fail.
//   5. HR-RS3 emit: createArtifact (AS v2.2 R3) with framework = {id:
//      'research', version: '1.0'}, payload.domain = 'research',
//      content = candidate. dependsOn: input.priorKnowledge.artifactRefs per
//      spec §6.11 ArA4d dependency-edge requirement.
//      AS rejection → RESEARCH_EMISSION_REJECTED.
//
// Pattern parallel: F-verify/app/execute-verification.ts. F-discover is
// stateless (no draft/lane DB) — pure passthrough at v1.0.

import type { Result, NodeId, Semver, CognitivePrimitive } from '@/core/types/primitives'
import type {
  ResearchInput,
  ResearchArtifactContent,
  ResearchEmissionResult,
  ResearchValidityError,
  ArtifactEmission,
  ArtifactPayload,
  CreateArtifactInput,
  EpochMs,
} from '../config/f-discover-types'
import type { ResearchExecuteInput } from '../config/f-discover-types'
import { composeResearch, defaultMintResearchId } from '../domain/compose-research'
import { runResearchGates, gateRS1 } from '../domain/run-research-gates'

// ─── Inject surface (R3 wires real implementations) ──────────────────────────

/**
 * R4 dependency surface consumed by F-discover R2. Caller (R3) injects
 * concrete implementations at slice boundary per A5.
 *
 * Mirror of F-verify's VerifyServiceContainer:
 *   - createArtifact: AS v2.2 R3 entry (createArtifact from F-artifact/R3)
 *   - createArtifact: AS v2.2 R3 entry (single-arg — port dissolved b1-final-shot-3)
 *   - epochNow: time source
 *   - mintResearchId: optional override (default: generateId('rs'))
 */
export type DiscoverServiceContainer = {
  createArtifact: (
    input: CreateArtifactInput,
  ) => Promise<{ ok: true; data: ArtifactEmission } | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }>
  epochNow: () => EpochMs
  mintResearchId?: () => ReturnType<typeof defaultMintResearchId>
}

// ─── Constants (carrier identity) ────────────────────────────────────────────

const RS_FRAMEWORK_ID            = 'research'
const RS_FRAMEWORK_VERSION       = '1.0' as Semver
const RS_PAYLOAD_DOMAIN          = 'research'
const RS_PAYLOAD_DOMAIN_VERSION  = '1.0' as Semver
const RS_SCHEMA_REF              = 'ResearchArtifactContent'

// ─── Authoring program identity (caller-default) ─────────────────────────────
// F-discover is the v1.0 authoring program. The `programVersion` here pins to
// F-discover slice version; callers (e.g., future research-authoring-programs)
// will pin to their own version. The composer reads input.authoringProgram.programId
// verbatim; this constant is the slice-default for the F-discover-internal
// caller path.
//
// D-RS-VERSION-INITIAL (Sprint 5 build cycle): '1.0.0' per F-verify
// F_VERIFY_PROGRAM_VERSION line-for-line precedent. Re-research version
// logic deferred to first downstream amend cycle.

const F_DISCOVER_PROGRAM_VERSION = '1.0.0' as Semver

// ─── executeResearch (R2 orchestration) ──────────────────────────────────────

export async function executeResearch(
  executeInput: ResearchExecuteInput,
  services:     DiscoverServiceContainer,
): Promise<ResearchEmissionResult> {
  const { researchInput, classification, projectId } = executeInput

  // Step 1 — HR-RS1 receive: G-RS1 input-shape gate.
  // Pre-compose short-circuit per spec §6.8 errorContract RESEARCH_INPUT_INVALID.
  const inputGate = gateRS1(researchInput)
  if (!inputGate.ok) {
    return {
      ok: false,
      error: {
        code:    'RESEARCH_INPUT_INVALID',
        message: inputGate.error.message,
        failedAxiom: inputGate.error.failedAxiom,
        context: { ...inputGate.error.context, stage: 'pre-compose-input-gate' },
      },
    }
  }

  // Step 2 — HR-RS2 binding consumption.
  // v1.0: caller threads input.binding directly. R4 discover-binding-loader is
  // the registry helper for callers that prefer registry lookup. Either path
  // arrives here with a populated input.binding.

  // Step 3 — Compose (pure R1).
  const content: ResearchArtifactContent = composeResearch(
    researchInput,
    {
      epochNow:       services.epochNow,
      mintResearchId: services.mintResearchId ?? defaultMintResearchId,
    },
    F_DISCOVER_PROGRAM_VERSION,
  )

  // Step 4 — Gate (pure R1) G-RS1..G-RS10.
  const gateResult = runResearchGates(researchInput, content)
  if (!gateResult.ok) {
    return {
      ok: false,
      error: {
        ...gateResult.error,
        // gateResult.error already carries code='RESEARCH_VALIDITY_FAILED' + failedAxiom.
      },
    }
  }

  // Step 5 — HR-RS3 emit: AS v2.2 createArtifact.
  const payload: ArtifactPayload = {
    domain:        RS_PAYLOAD_DOMAIN,
    domainVersion: RS_PAYLOAD_DOMAIN_VERSION,
    schemaRef:     RS_SCHEMA_REF,
    content,
  }

  // dependsOn: priorKnowledge.artifactRefs per spec §6.11 ArA4d.
  const dependsOn: NodeId[] = researchInput.priorKnowledge.artifactRefs

  const createInput: CreateArtifactInput = {
    framework: {
      id:      RS_FRAMEWORK_ID,
      version: RS_FRAMEWORK_VERSION,
    },
    turnId:               researchInput.turnId,
    userId:               researchInput.userId,
    projectId,
    payload,
    classificationNodeId: classification.classificationNodeId,
    primitive:            classification.primitive as CognitivePrimitive,
    confidence:           classification.confidence,
    dependsOn,
  }

  const emit = await services.createArtifact(createInput)
  if (!emit.ok) {
    const validityError: ResearchValidityError = {
      code:    'RESEARCH_EMISSION_REJECTED',
      message: `AS v2.2 rejected createArtifact carrier emission: ${emit.error.message}`,
      context: { cause: emit.error, stage: 'as-emission' },
    }
    return { ok: false, error: validityError }
  }

  return { ok: true, data: emit.data }
}

// ─── End of execute-research.ts ─────────────────────────────────────────────
