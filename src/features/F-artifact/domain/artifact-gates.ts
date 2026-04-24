// @liv-standard v1.5.1
// [F-artifact/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice
// slice:      F-artifact
// layer:      R1
// wires-in:
//   W-ATOM  NodeId, ArtifactEdge, ArtifactEdgeKind,
//           ArtifactEmission, CreateArtifactInput,
//           ArtifactGateResult                         ←  F-artifact/R0 types/artifact-types
// wires-out:  consumed by F-artifact/R2 artifact-emit (S2 stage)
// deps:
//   R0  ../types/artifact-types
// validated:  pending
//
// F-artifact R1 — gate predicates.
// Pure. No I/O. Evaluates ArA1–ArA8 against a candidate emission assembled
// by S2. Every gate returns an ArtifactGateResult with gateId, result, and
// evidence (populated on fail).
//
// Gate definitions (artifact-standard.md §4.2 G-Ar1..G-Ar8):
//
//   G-Ar1 (ArA1 — both write blocks present)
//     writes.a4 is non-null AND writes.a7 is non-null
//
//   G-Ar2 (ArA2 — anchor/companion 1:1 by emissionId)
//     writes.a7.artifactAnchorNodeId !== writes.a7.companionDataNodeId
//     Cardinality witness: one anchor + one companion, both emitted this call.
//
//   G-Ar3 (ArA3 — content cardinality >= 1)
//     writes.a7.contentNodeIds.length >= 1
//
//   G-Ar4a (ArA4a — exactly 1 classification-lineage edge; fromId=anchor, toId=classificationNodeId)
//     edges.filter(k==='classification-lineage').length === 1
//     AND that edge's fromId === writes.a7.artifactAnchorNodeId
//     AND that edge's toId   === writes.a4.classificationNodeId
//
//   G-Ar4b (ArA4b — exactly 1 categorical edge; fromId=anchor, toId=resolved mode-node)
//     edges.filter(k==='categorical').length === 1
//     AND that edge's fromId === writes.a7.artifactAnchorNodeId
//
//   G-Ar4c (ArA4c — version edge 0 or 1; conditional on prior-anchor lookup)
//     edges.filter(k==='version').length ∈ {0, 1}
//     if 1: fromId === writes.a7.artifactAnchorNodeId
//     prior-anchor semantics owned by lookup site (S1); gate checks cardinality.
//
//   G-Ar4d (ArA4d — dependency edge count === input.dependsOn.length)
//     edges.filter(k==='dependency').length === input.dependsOn.length
//     AND every dependency edge's fromId === writes.a7.artifactAnchorNodeId
//     AND every dependency edge's toId ∈ input.dependsOn
//
//   G-Ar5 (ArA5 — mutation rejection on persisted anchors)
//     S2-invariant: engine did not rewrite a pre-persisted anchor.
//     Gate verifies the engine's no-mutation log entry was emitted.
//     At this build, G-Ar5 is modeled by the absence of a mutation flag
//     passed through the S2 evaluation context (see evaluateGar5).
//
//   G-Ar6 (ArA6 — every edge.kind ∈ ArtifactEdgeKind enum)
//     For every edge: edge.kind ∈ {'classification-lineage','categorical','version','dependency'}
//
//   G-Ar7 (ArA7 — payload deep-equal to input.payload)
//     emission.payload === input.payload by deep structural equality.
//
//   G-Ar8 (ArA8 — emissionId uniqueness)
//     emission.emissionId not previously seen. Gate receives the registry
//     predicate from S2; the registry owns storage, gate owns the predicate call.

import type {
  NodeId,
  ArtifactEdge,
  ArtifactEdgeKind,
  ArtifactEmission,
  CreateArtifactInput,
  ArtifactGateResult,
} from '../types/artifact-types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_EDGE_KINDS: ReadonlySet<ArtifactEdgeKind> = new Set<ArtifactEdgeKind>([
  'classification-lineage',
  'categorical',
  'version',
  'dependency',
])

function pass(gateId: string): ArtifactGateResult {
  return {
    gateId,
    result:    'passed',
    timestamp: new Date().toISOString(),
  }
}

function fail(gateId: string, evidence: string): ArtifactGateResult {
  return {
    gateId,
    result:    'failed',
    timestamp: new Date().toISOString(),
    evidence,
  }
}

/**
 * Deep structural equality for JSON-shaped values.
 * Used by G-Ar7 (payload verbatim) only. Not exported.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }

  if (Array.isArray(b)) return false

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const aKeys = Object.keys(aObj)
  const bKeys = Object.keys(bObj)
  if (aKeys.length !== bKeys.length) return false
  for (const k of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, k)) return false
    if (!deepEqual(aObj[k], bObj[k])) return false
  }
  return true
}

// ─── G-Ar1 ───────────────────────────────────────────────────────────────────

export function evaluateGar1(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar1'
  // TypeScript guarantees both fields are present by the type shape; runtime
  // check defends against upstream shape violation from untyped wire.
  const a4Present = emission.writes?.a4 !== undefined && emission.writes?.a4 !== null
  const a7Present = emission.writes?.a7 !== undefined && emission.writes?.a7 !== null
  if (a4Present && a7Present) return pass(gateId)
  return fail(gateId, `a4Present=${a4Present} a7Present=${a7Present}`)
}

// ─── G-Ar2 ───────────────────────────────────────────────────────────────────

export function evaluateGar2(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar2'
  const { artifactAnchorNodeId, companionDataNodeId } = emission.writes.a7
  if (artifactAnchorNodeId !== companionDataNodeId) return pass(gateId)
  return fail(gateId, `anchor === companion (${artifactAnchorNodeId})`)
}

// ─── G-Ar3 ───────────────────────────────────────────────────────────────────

export function evaluateGar3(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar3'
  const n = emission.writes.a7.contentNodeIds.length
  if (n >= 1) return pass(gateId)
  return fail(gateId, `contentNodeIds.length=${n}`)
}

// ─── G-Ar4a ──────────────────────────────────────────────────────────────────

export function evaluateGar4a(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar4a'
  const lineageEdges = emission.edges.filter(e => e.kind === 'classification-lineage')
  if (lineageEdges.length !== 1) {
    return fail(gateId, `classification-lineage count=${lineageEdges.length}, want 1`)
  }
  const edge = lineageEdges[0]
  const anchor         = emission.writes.a7.artifactAnchorNodeId
  const classification = emission.writes.a4.classificationNodeId
  if (edge.fromId !== anchor) {
    return fail(gateId, `edge.fromId=${edge.fromId} !== anchor=${anchor}`)
  }
  if (edge.toId !== classification) {
    return fail(gateId, `edge.toId=${edge.toId} !== classificationNodeId=${classification}`)
  }
  return pass(gateId)
}

// ─── G-Ar4b ──────────────────────────────────────────────────────────────────

export function evaluateGar4b(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar4b'
  const categoricalEdges = emission.edges.filter(e => e.kind === 'categorical')
  if (categoricalEdges.length !== 1) {
    return fail(gateId, `categorical count=${categoricalEdges.length}, want 1`)
  }
  const edge   = categoricalEdges[0]
  const anchor = emission.writes.a7.artifactAnchorNodeId
  if (edge.fromId !== anchor) {
    return fail(gateId, `edge.fromId=${edge.fromId} !== anchor=${anchor}`)
  }
  return pass(gateId)
}

// ─── G-Ar4c ──────────────────────────────────────────────────────────────────

export function evaluateGar4c(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar4c'
  const versionEdges = emission.edges.filter(e => e.kind === 'version')
  if (versionEdges.length > 1) {
    return fail(gateId, `version edge count=${versionEdges.length}, want 0 or 1`)
  }
  if (versionEdges.length === 1) {
    const edge   = versionEdges[0]
    const anchor = emission.writes.a7.artifactAnchorNodeId
    if (edge.fromId !== anchor) {
      return fail(gateId, `version edge.fromId=${edge.fromId} !== anchor=${anchor}`)
    }
  }
  return pass(gateId)
}

// ─── G-Ar4d ──────────────────────────────────────────────────────────────────

export function evaluateGar4d(
  emission: ArtifactEmission,
  input:    CreateArtifactInput,
): ArtifactGateResult {
  const gateId = 'G-Ar4d'
  const declaredDeps = input.dependsOn ?? []
  const depEdges = emission.edges.filter(e => e.kind === 'dependency')
  if (depEdges.length !== declaredDeps.length) {
    return fail(gateId, `dependency count=${depEdges.length}, want ${declaredDeps.length}`)
  }
  const anchor = emission.writes.a7.artifactAnchorNodeId
  const declaredSet = new Set<NodeId>(declaredDeps)
  for (const e of depEdges) {
    if (e.fromId !== anchor) {
      return fail(gateId, `dependency edge.fromId=${e.fromId} !== anchor=${anchor}`)
    }
    if (!declaredSet.has(e.toId)) {
      return fail(gateId, `dependency edge.toId=${e.toId} not in input.dependsOn`)
    }
  }
  return pass(gateId)
}

// ─── G-Ar5 ───────────────────────────────────────────────────────────────────

/**
 * G-Ar5 — mutation rejection on persisted anchors.
 * Engine must not rewrite a pre-persisted anchor. S2 passes an explicit flag
 * when it detected an attempted mutation; absence of such flag → pass.
 */
export function evaluateGar5(mutationAttempted: boolean): ArtifactGateResult {
  const gateId = 'G-Ar5'
  if (!mutationAttempted) return pass(gateId)
  return fail(gateId, 'anchor mutation attempted on persisted emission')
}

// ─── G-Ar6 ───────────────────────────────────────────────────────────────────

export function evaluateGar6(emission: ArtifactEmission): ArtifactGateResult {
  const gateId = 'G-Ar6'
  for (const e of emission.edges) {
    if (!VALID_EDGE_KINDS.has(e.kind)) {
      return fail(gateId, `edge.kind=${String(e.kind)} not in ArtifactEdgeKind enum`)
    }
  }
  return pass(gateId)
}

// ─── G-Ar7 ───────────────────────────────────────────────────────────────────

export function evaluateGar7(
  emission: ArtifactEmission,
  input:    CreateArtifactInput,
): ArtifactGateResult {
  const gateId = 'G-Ar7'
  if (deepEqual(emission.payload, input.payload)) return pass(gateId)
  return fail(gateId, 'emission.payload !== input.payload (deep inequality)')
}

// ─── G-Ar8 ───────────────────────────────────────────────────────────────────

/**
 * G-Ar8 — emissionId uniqueness.
 * Registry predicate is injected: `(id: string) => boolean` returns true when
 * the id has been seen before (collision). R2 owns the registry; R1 only
 * evaluates the predicate.
 */
export function evaluateGar8(
  emission:     ArtifactEmission,
  isCollision:  (emissionId: string) => boolean,
): ArtifactGateResult {
  const gateId = 'G-Ar8'
  if (isCollision(emission.emissionId)) {
    return fail(gateId, `emissionId=${emission.emissionId} already seen`)
  }
  return pass(gateId)
}

// ─── Composite: evaluate all gates ───────────────────────────────────────────

export type GateBatch = {
  gar1:  ArtifactGateResult
  gar2:  ArtifactGateResult
  gar3:  ArtifactGateResult
  gar4a: ArtifactGateResult
  gar4b: ArtifactGateResult
  gar4c: ArtifactGateResult
  gar4d: ArtifactGateResult
  gar5:  ArtifactGateResult
  gar6:  ArtifactGateResult
  gar7:  ArtifactGateResult
  gar8:  ArtifactGateResult
  allPassed: boolean
  firstFail: ArtifactGateResult | null
}

export function evaluateAllGates(
  emission:           ArtifactEmission,
  input:              CreateArtifactInput,
  mutationAttempted:  boolean,
  isCollision:        (emissionId: string) => boolean,
): GateBatch {
  const gar1  = evaluateGar1(emission)
  const gar2  = evaluateGar2(emission)
  const gar3  = evaluateGar3(emission)
  const gar4a = evaluateGar4a(emission)
  const gar4b = evaluateGar4b(emission)
  const gar4c = evaluateGar4c(emission)
  const gar4d = evaluateGar4d(emission, input)
  const gar5  = evaluateGar5(mutationAttempted)
  const gar6  = evaluateGar6(emission)
  const gar7  = evaluateGar7(emission, input)
  const gar8  = evaluateGar8(emission, isCollision)

  const ordered = [gar1, gar2, gar3, gar4a, gar4b, gar4c, gar4d, gar5, gar6, gar7, gar8]
  const firstFail = ordered.find(g => g.result === 'failed') ?? null
  const allPassed = firstFail === null

  return {
    gar1, gar2, gar3, gar4a, gar4b, gar4c, gar4d, gar5, gar6, gar7, gar8,
    allPassed,
    firstFail,
  }
}
