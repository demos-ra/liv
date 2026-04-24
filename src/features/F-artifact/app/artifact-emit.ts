// @liv-standard v1.5.1
// [F-artifact/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice
// slice:      F-artifact
// layer:      R2
// wires-in:
//   W-ATOM  NodeId, UserId, Semver,
//           CreateArtifactInput, ArtifactEmission,
//           ArtifactEdge, ArtifactError,
//           CreateArtifactResult, ArtifactWriteA4, ArtifactWriteA7,
//           ArtifactGateResult, CognitivePrimitive          ←  F-artifact/R0
//   W-INJECT deriveAllEdges                                 ←  F-artifact/R1 artifact-edges
//   W-INJECT evaluateAllGates                               ←  F-artifact/R1 artifact-gates
//   W-INJECT ArtifactGraphPort (R4 node/edge primitives)    ←  F-artifact/R2 (port interface)
// wires-out:  consumed by F-artifact/R3 artifact-contract
// deps:
//   R0  ../types/artifact-types
//   R1  ../domain/artifact-edges
//   R1  ../domain/artifact-gates
// validated:  pending
//
// F-artifact R2 — createArtifact S1→S2→S3 orchestration.
//
// Procedure per artifact-standard.md §3.7:
//
//   S1 (stage 2, mechanical):
//     - Generate emissionId (UUID v4)
//     - Capture timestamp
//     - Resolve anchor NodeId via port.createAnchorNode({framework, turnId, emissionId})
//     - Resolve companion NodeId via port.createCompanionNode(payload, emissionId)
//     - Derive contentNodeIds via port.materializeContent(payload.content, emissionId)
//     - Look up modeNodeId (primitive → mode-node) via port.lookupModeNode(primitive)
//     - Look up priorAnchorNodeId via port.lookupPriorAnchor({framework, domain, schemaRef, ...})
//     - Derive ArA4 edges via R1 deriveAllEdges
//
//   S2 (stage 3, gate-execution):
//     - Assemble candidate ArtifactEmission
//     - Evaluate G-Ar1..G-Ar8 via R1 evaluateAllGates
//     - On any fail → return ArtifactError code ARTIFACT_GATE_FAILED with gateId + evidence
//
//   S3 (stage 5, mechanical):
//     - Register emission in port.registerEmission(emission) — backs G-Ar8 uniqueness
//     - Persist ArA4 edges via port.persistEdges(emission.edges)
//     - Return Result.ok(emission)
//
// Slice boundary note: F-memory primitives for node/edge creation land in a
// later phase. Until then, F-artifact defines the port interface locally
// (ArtifactGraphPort below) and callers may supply a stub impl. This keeps
// F-artifact standalone per brief's "4b standalone" requirement.

import type {
  NodeId,
  CreateArtifactInput,
  ArtifactEmission,
  ArtifactEdge,
  ArtifactError,
  CreateArtifactResult,
  ArtifactWriteA4,
  ArtifactWriteA7,
} from '../types/artifact-types'
import { deriveAllEdges } from '../domain/artifact-edges'
import { evaluateAllGates } from '../domain/artifact-gates'
import { generateId } from '@/core/types/primitives'

// ─── Port interface (R4 runtime dependency surface) ──────────────────────────

/**
 * R4 runtime dependency surface consumed by F-artifact R2.
 * Caller injects a concrete implementation (F-memory-backed at deploy,
 * in-memory stub for tests/beta).
 *
 * A5: R4 dependencies enter at slice boundary, never module globals.
 */
export type ArtifactGraphPort = {
  /** Mint anchor node. Returns the NodeId to be stamped as artifactAnchorNodeId. */
  createAnchorNode: (args: {
    framework: { id: string; version: string }
    turnId:    string
    emissionId: string
  }) => Promise<NodeId>

  /** Mint companion data node. Returns the NodeId carrying the payload verbatim. */
  createCompanionNode: (args: {
    emissionId: string
    payload:    unknown
  }) => Promise<NodeId>

  /** Materialize content nodes from payload.content. Returns length >= 1 per ArA3. */
  materializeContent: (args: {
    emissionId:   string
    contentValue: unknown
  }) => Promise<NodeId[]>

  /** Lookup mode-node for a primitive (for ArA4b categorical edge). */
  lookupModeNode: (primitive: string) => Promise<NodeId>

  /** Lookup prior anchor (for ArA4c version edge). null when none exists. */
  lookupPriorAnchor: (args: {
    framework: { id: string; version: string }
    domain:    string
    schemaRef: string
    turnId:    string
  }) => Promise<NodeId | null>

  /** Register emission; G-Ar8 uses isEmissionIdCollision against this registry. */
  registerEmission: (emission: ArtifactEmission) => Promise<void>

  /** G-Ar8 collision predicate. Called during S2 gate evaluation. */
  isEmissionIdCollision: (emissionId: string) => boolean

  /** Persist the ArA4 edges. S3 ordering: after registerEmission. */
  persistEdges: (edges: ArtifactEdge[]) => Promise<void>
}

// ─── Error helpers ───────────────────────────────────────────────────────────

function gateFailError(
  gateId:    string,
  evidence:  string,
): ArtifactError {
  return {
    code:    'ARTIFACT_GATE_FAILED',
    message: `Gate ${gateId} failed: ${evidence}`,
    context: { gateId, evidence },
  }
}

function inputInvalidError(evidence: string): ArtifactError {
  return {
    code:    'ARTIFACT_INPUT_INVALID',
    message: `Input invalid: ${evidence}`,
    context: { evidence },
  }
}

function compositionFailedError(evidence: string): ArtifactError {
  return {
    code:    'ARTIFACT_COMPOSITION_FAILED',
    message: `Composition failed: ${evidence}`,
    context: { evidence },
  }
}

function emissionRejectedError(evidence: string): ArtifactError {
  return {
    code:    'ARTIFACT_EMISSION_REJECTED',
    message: `Emission rejected: ${evidence}`,
    context: { evidence },
  }
}

// ─── S1: resolve ─────────────────────────────────────────────────────────────

type S1Resolved = {
  emissionId:           string
  timestamp:            string
  anchorNodeId:         NodeId
  companionDataNodeId:  NodeId
  contentNodeIds:       NodeId[]
  modeNodeId:           NodeId
  priorAnchorNodeId:    NodeId | null
  edges:                ArtifactEdge[]
}

async function runS1(
  input: CreateArtifactInput,
  port:  ArtifactGraphPort,
): Promise<{ ok: true; data: S1Resolved } | { ok: false; error: ArtifactError }> {
  // Input schema check (light — the type system handles most of this)
  if (!input.framework?.id || !input.framework?.version) {
    return { ok: false, error: inputInvalidError('framework.id/version missing') }
  }
  if (!input.payload?.domain || !input.payload?.domainVersion || !input.payload?.schemaRef) {
    return { ok: false, error: inputInvalidError('payload.domain/domainVersion/schemaRef missing') }
  }
  if (input.confidence < 0 || input.confidence > 1) {
    return { ok: false, error: inputInvalidError(`confidence=${input.confidence} out of [0,1]`) }
  }

  const emissionId = generateId('emission')
  const timestamp  = new Date().toISOString()

  try {
    const anchorNodeId = await port.createAnchorNode({
      framework:  { id: input.framework.id, version: String(input.framework.version) },
      turnId:     input.turnId,
      emissionId,
    })

    const companionDataNodeId = await port.createCompanionNode({
      emissionId,
      payload: input.payload,
    })

    const contentNodeIds = await port.materializeContent({
      emissionId,
      contentValue: input.payload.content,
    })
    if (contentNodeIds.length < 1) {
      return { ok: false, error: compositionFailedError('materializeContent produced 0 nodes; ArA3 requires >= 1') }
    }

    const modeNodeId = await port.lookupModeNode(input.primitive)

    const priorAnchorNodeId = await port.lookupPriorAnchor({
      framework: { id: input.framework.id, version: String(input.framework.version) },
      domain:    input.payload.domain,
      schemaRef: input.payload.schemaRef,
      turnId:    input.turnId,
    })

    const edges = deriveAllEdges({
      anchorNodeId,
      classificationNodeId: input.classificationNodeId,
      modeNodeId,
      priorAnchorNodeId,
      dependsOn:           input.dependsOn ?? [],
    })

    return {
      ok: true,
      data: {
        emissionId,
        timestamp,
        anchorNodeId,
        companionDataNodeId,
        contentNodeIds,
        modeNodeId,
        priorAnchorNodeId,
        edges,
      },
    }
  } catch (err) {
    return {
      ok: false,
      error: compositionFailedError(
        err instanceof Error ? err.message : String(err),
      ),
    }
  }
}

// ─── S2: assemble + gate ─────────────────────────────────────────────────────

function assembleEmission(
  input:      CreateArtifactInput,
  resolved:   S1Resolved,
): ArtifactEmission {
  const a4: ArtifactWriteA4 = {
    classificationNodeId: input.classificationNodeId,
    primitive:            input.primitive,
    confidence:           input.confidence,
  }

  const a7: ArtifactWriteA7 = {
    artifactAnchorNodeId: resolved.anchorNodeId,
    companionDataNodeId:  resolved.companionDataNodeId,
    contentNodeIds:       resolved.contentNodeIds,
  }

  return {
    emissionId: resolved.emissionId,
    framework:  input.framework,
    turnId:     input.turnId,
    userId:     input.userId,
    writes:     { a4, a7 },
    edges:      resolved.edges,
    payload:    input.payload,
    timestamp:  resolved.timestamp,
  }
}

// ─── S3: emit ────────────────────────────────────────────────────────────────

async function runS3(
  emission: ArtifactEmission,
  port:     ArtifactGraphPort,
): Promise<{ ok: true } | { ok: false; error: ArtifactError }> {
  try {
    await port.registerEmission(emission)
    await port.persistEdges(emission.edges)
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: emissionRejectedError(
        err instanceof Error ? err.message : String(err),
      ),
    }
  }
}

// ─── Entry point: createArtifact ─────────────────────────────────────────────

/**
 * createArtifact — F-artifact R2 orchestration entry.
 *
 * Contract per artifact-standard.md §3.7:
 *   S1 → S2 → S3 strictly sequential
 *   Any S1/S2/S3 failure short-circuits with typed ArtifactError
 *   ArA1–ArA8 all pass iff return is Result.ok
 *   HR-MI3 compliant: M-I calls this directly with a RunReportContent payload
 */
export async function createArtifact(
  input: CreateArtifactInput,
  port:  ArtifactGraphPort,
): Promise<CreateArtifactResult> {
  // S1
  const s1 = await runS1(input, port)
  if (!s1.ok) return s1

  // S2 assemble
  const emission = assembleEmission(input, s1.data)

  // S2 gates
  const batch = evaluateAllGates(
    emission,
    input,
    /* mutationAttempted */ false, // S2 is mechanical; no mutation in this path
    port.isEmissionIdCollision,
  )
  if (!batch.allPassed) {
    const first = batch.firstFail!
    return {
      ok: false,
      error: gateFailError(first.gateId, first.evidence ?? 'no evidence'),
    }
  }

  // S3
  const s3 = await runS3(emission, port)
  if (!s3.ok) return s3

  return { ok: true, data: emission }
}
