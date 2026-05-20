// @liv-standard v1.5.2
// [F-artifact/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    4b-f-artifact-slice
//             sprint-b2-unified-close (Point 6: LIV-Standard v1.5.1 → v1.5.2; AS v2.2 → v2.3 references in header swept; F-009 paired-write framing closure declared at this amendment; artifact emission is Path B to Store via internal-derivation channel — confirmed at body level)
//             sprint-b1-shot-1 (dual-write: createArtifact writes substrate record)
//             sprint-b1-shot-3 (scope corrected: input.turnId → input.projectId)
//             sprint-b1-shot-3b (projectId threaded from MIInput)
//             b1-final-shot-3 (S3 rewrite: substrate is the store; port dissolved;
//                              art_* tables dropped; ArtifactGraphPort removed;
//                              createArtifact signature: port param removed;
//                              G-Ar8 formally removed from AS v2.2 gate set —
//                              emissionId is a UUID minted per call; structural
//                              collision is impossible; gate carried no real predicate.
//                              Amendment: AS v2.2 operates on 7 gates G-Ar1..G-Ar7.)
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
//   W-FN    writeStateChange     F-memory/contract/substrate-contract
//   W-FN    threadQuery          F-memory/contract/substrate-contract  (prior anchor lookup)
//   W-ATOM  SubstrateWriteInput, IdentityRef, ScopeRef, RoleRef  core/types/substrate.types
// wires-out:  consumed by F-artifact/R3 artifact-contract
// deps:
//   R0  ../types/artifact-types
//   R1  ../domain/artifact-edges
//   R1  ../domain/artifact-gates
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  @/core/types/substrate.types
// validated:  pending

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
import { writeStateChange, threadQuery } from '@/features/F-memory/contract/substrate-contract'
import type { SubstrateWriteInput, IdentityRef, ScopeRef, RoleRef } from '@/core/types/substrate.types'

// ─── Content identity prefix ──────────────────────────────────────────────────
// Payload content is serialized to JSON and stored as an IdentityRef with this
// prefix. threadQuery identity-recurrence on emissionId returns the record;
// the content identity is extracted by prefix match and JSON-parsed.
// This is the substrate-native payload persistence path.
const CONTENT_PREFIX = 'artifact-content:'

export function encodePayloadContent(content: unknown): IdentityRef {
  return `${CONTENT_PREFIX}${JSON.stringify(content)}` as IdentityRef
}

export function decodePayloadContent(identity: IdentityRef): unknown {
  const str = identity as string
  if (!str.startsWith(CONTENT_PREFIX)) return null
  try { return JSON.parse(str.slice(CONTENT_PREFIX.length)) } catch { return null }
}

// ─── Error helpers ───────────────────────────────────────────────────────────

function gateFailError(gateId: string, evidence: string): ArtifactError {
  return { code: 'ARTIFACT_GATE_FAILED', message: `Gate ${gateId} failed: ${evidence}`, context: { gateId, evidence } }
}
function inputInvalidError(evidence: string): ArtifactError {
  return { code: 'ARTIFACT_INPUT_INVALID', message: `Input invalid: ${evidence}`, context: { evidence } }
}
function compositionFailedError(evidence: string): ArtifactError {
  return { code: 'ARTIFACT_COMPOSITION_FAILED', message: `Composition failed: ${evidence}`, context: { evidence } }
}
function emissionRejectedError(evidence: string): ArtifactError {
  return { code: 'ARTIFACT_EMISSION_REJECTED', message: `Emission rejected: ${evidence}`, context: { evidence } }
}

// ─── S1: resolve ─────────────────────────────────────────────────────────────

type S1Resolved = {
  emissionId:          string
  timestamp:           string
  anchorNodeId:        NodeId
  companionDataNodeId: NodeId
  contentNodeIds:      NodeId[]
  modeNodeId:          NodeId
  priorAnchorNodeId:   NodeId | null
  edges:               ArtifactEdge[]
}

async function runS1(
  input: CreateArtifactInput,
): Promise<{ ok: true; data: S1Resolved } | { ok: false; error: ArtifactError }> {
  if (!input.framework?.id || !input.framework?.version)
    return { ok: false, error: inputInvalidError('framework.id/version missing') }
  if (!input.payload?.domain || !input.payload?.domainVersion || !input.payload?.schemaRef)
    return { ok: false, error: inputInvalidError('payload.domain/domainVersion/schemaRef missing') }
  if (input.confidence < 0 || input.confidence > 1)
    return { ok: false, error: inputInvalidError(`confidence=${input.confidence} out of [0,1]`) }

  const emissionId = generateId('emission')
  const timestamp  = new Date().toISOString()

  try {
    // b1-final-shot-3: port dissolved. NodeIds minted via generateId.
    // Substrate record IS the durable store for these identifiers.
    const anchorNodeId:        NodeId   = generateId('anchor')    as NodeId
    const companionDataNodeId: NodeId   = generateId('companion')  as NodeId
    const contentNodeIds:      NodeId[] = [generateId('content')  as NodeId]
    const modeNodeId:          NodeId   = generateId(`mode-${String(input.primitive)}`) as NodeId

    // Prior anchor lookup via substrate threadQuery on the chain key identity.
    // Chain key includes projectId so chain is per-project (consistent with scope filter).
    // No limit — fetch all records ordered ASC, take last = latest emission for this chain.
    const priorAnchorKey = `prior-anchor:${input.framework.id}:${input.userId}:${input.projectId}:${input.payload.domain}:${input.payload.schemaRef}` as IdentityRef
    let priorAnchorNodeId: NodeId | null = null
    try {
      const threadResult = await threadQuery({
        threadKind: 'identity-recurrence',
        anchor:     priorAnchorKey,
        scope:      input.projectId as ScopeRef,
      })
      if (threadResult.ok && threadResult.data.records.length > 0) {
        const last = threadResult.data.records[threadResult.data.records.length - 1]
        // Anchor identity stored with 'anchor' role in the artifact-emitted relation
        const anchorEntry = last.content.relations
          .find(r => r.type === ('artifact-emitted' as IdentityRef))
          ?.identitiesWithRoles
          .find(iwr => (iwr.role as string) === 'anchor')
        if (anchorEntry) priorAnchorNodeId = anchorEntry.identity as unknown as NodeId
      }
    } catch { /* no prior — first emission for this chain key */ }

    const edges = deriveAllEdges({
      anchorNodeId,
      classificationNodeId: input.classificationNodeId,
      modeNodeId,
      priorAnchorNodeId,
      dependsOn:            input.dependsOn ?? [],
    })

    return { ok: true, data: { emissionId, timestamp, anchorNodeId, companionDataNodeId, contentNodeIds, modeNodeId, priorAnchorNodeId, edges } }
  } catch (err) {
    return { ok: false, error: compositionFailedError(err instanceof Error ? err.message : String(err)) }
  }
}

// ─── S2: assemble + gate ─────────────────────────────────────────────────────

function assembleEmission(input: CreateArtifactInput, resolved: S1Resolved): ArtifactEmission {
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

// G-Ar8 dissolved at AS v2.3 (Sprint B2 Shot 2c): emissionId is a UUID minted
// per call via generateId — structural collision is impossible. Gate carried
// no real predicate (constant-false stub previously bridged the gap). Fully
// removed from AS v2.3 axiom + gate set.

// ─── S3: write to substrate ──────────────────────────────────────────────────
// b1-final-shot-3: substrate is the single store.
//
// Substrate write encodes:
//   identities:
//     - emissionId             (recovery key)
//     - anchorNodeId           (anchor identity)
//     - companionDataNodeId    (companion identity)
//     - framework.id           (framework identity)
//     - userId                 (author identity)
//     - projectId              (scope identity)
//     - payload.domain         (domain identity)
//     - payload.schemaRef      (schema identity)
//     - prior-anchor chain key (for priorAnchorNodeId lookup on next emission)
//     - artifact-content:{JSON}  (FULL serialized payload.content — recovery path)
//
//   relations:
//     - artifact-emitted: subject=emissionId, framework=framework.id,
//                         anchor=anchorNodeId, author=userId
//     - artifact-payload: emission=emissionId, domain=payload.domain,
//                         schema=payload.schemaRef
//
// Recovery (threadQuery identity-recurrence on anchorNodeId):
//   1. Query returns the state_change record for this emission.
//   2. Find identity starting with CONTENT_PREFIX → JSON.parse → payload.content
//   3. Full ArtifactPayload reconstructed from domain/schemaRef identities + content.

async function runS3(
  emission: ArtifactEmission,
  input:    CreateArtifactInput,
): Promise<{ ok: true } | { ok: false; error: ArtifactError }> {
  const projectId     = input.projectId
  const priorAnchorKey = `prior-anchor:${input.framework.id}:${input.userId}:${input.projectId}:${input.payload.domain}:${input.payload.schemaRef}` as IdentityRef
  const contentIdentity = encodePayloadContent(input.payload.content)

  const write: SubstrateWriteInput = {
    userId: input.userId,
    content: {
      identities: [
        emission.emissionId                                     as IdentityRef,
        emission.writes.a7.artifactAnchorNodeId                 as unknown as IdentityRef,
        emission.writes.a7.companionDataNodeId                  as unknown as IdentityRef,
        input.framework.id                                      as IdentityRef,
        input.userId                                            as IdentityRef,
        projectId                                               as IdentityRef,
        input.payload.domain                                    as IdentityRef,
        input.payload.schemaRef                                 as IdentityRef,
        priorAnchorKey,
        contentIdentity,                                        // full payload.content serialized
      ],
      relations: [
        {
          type:                'artifact-emitted' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: emission.emissionId                                 as IdentityRef, role: 'subject'   as RoleRef },
            { identity: input.framework.id                                  as IdentityRef, role: 'framework' as RoleRef },
            { identity: emission.writes.a7.artifactAnchorNodeId as unknown  as IdentityRef, role: 'anchor'    as RoleRef },
            { identity: input.userId                                        as IdentityRef, role: 'author'    as RoleRef },
          ],
          negation: false,
        },
        {
          type:                'artifact-payload' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: emission.emissionId     as IdentityRef, role: 'emission' as RoleRef },
            { identity: input.payload.domain    as IdentityRef, role: 'domain'   as RoleRef },
            { identity: input.payload.schemaRef as IdentityRef, role: 'schema'   as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   Date.now(),
      // Side-Quest Shot 4 (Phase D, AS v2.5): F-artifact emits via 'internal-derivation'
      // with contentClass: 'wearer-life'. Basis: artifact-emitted records carry
      // `author: userId` + name `payload.domain` / `payload.schemaRef` — records of
      // wearer's emission being materialized as durable artifact (records of wearer
      // cognition participating in the cognition LIV extends per LM v3.4 LMA13).
      // Replaces Shot 1 Phase A provisional 'system-introspection' stamp.
      source: { channel: 'internal-derivation', contentClass: 'wearer-life', scope: projectId as ScopeRef },
    },
  }

  try {
    await writeStateChange(write)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: emissionRejectedError(err instanceof Error ? err.message : String(err)) }
  }
}

// ─── Entry point: createArtifact ─────────────────────────────────────────────

/**
 * createArtifact — F-artifact R2 orchestration entry.
 *
 * b1-final-shot-3: `port` parameter removed. Substrate is the store.
 * S1 mints NodeIds via generateId. S3 writes full payload to substrate.
 * Sprint B2 Shot 2c: G-Ar8 fully dissolved at AS v2.3 — UUID emissionId
 * collision is structurally impossible.
 */
export async function createArtifact(
  input: CreateArtifactInput,
): Promise<CreateArtifactResult> {
  const s1 = await runS1(input)
  if (!s1.ok) return s1

  const emission = assembleEmission(input, s1.data)

  const batch = evaluateAllGates(emission, input, false)
  if (!batch.allPassed) {
    const first = batch.firstFail!
    return { ok: false, error: gateFailError(first.gateId, first.evidence ?? 'no evidence') }
  }

  const s3 = await runS3(emission, input)
  if (!s3.ok) return s3

  return { ok: true, data: emission }
}
