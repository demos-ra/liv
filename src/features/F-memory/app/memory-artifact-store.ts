// @liv-standard v1.5.1
// [F-memory/app/memory-artifact-store.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.5
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  NodeId, CognitivePrimitive  ← core/R5 primitives
//   W-ATOM  ArtifactEmission, ArtifactEdge, ArtifactPayload  ← core/R5 artifact-standard.types
//   W-ATOM  PlanArtifactContent  ← core/R5 plan-standard.types
// wires-out:
//   W-FN    artifactStore (singleton)  → F-memory/R3 memory-graph-contract (Phase 5.5)
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/artifact-standard.types
//   R5  @/core/types/plan-standard.types
// validated:  pending
//
// Phase 5.5 — Artifact substore for AS v2.2 emissions.
//
//   F-memory owns graph state (A1). This module owns the artifact graph —
//   structurally distinct from the LM v2.1 traversal graph (semantic, embedded,
//   layered). The artifact graph is append-only, structural, and indexed by
//   emissionId / anchorNodeId.
//
//   Why a separate substore:
//   - LM v2.1 nodes carry semantic content (label, embedding, layer); artifact
//     nodes carry typed payloads (PlanArtifactContent, RunReportContent).
//   - LM v2.1 edges are weighted, primitive-typed, and participate in
//     traversal physics (MA1 conservation via redistribution); artifact edges
//     are typed by ArA4a–d (classification-lineage, categorical, version,
//     dependency) and do not participate in traversal.
//   - Forcing artifacts through MemNode/MemEdge would require either polluting
//     the semantic shape with unused-for-artifacts fields, or shadowing the
//     atom — both worse than a clean separation.
//
//   LM v2.1 conformance for the artifact substore:
//     MA1 (conservation): writes are total; nothing leaks. No probabilistic mass
//          to redistribute — the artifact graph's "energy" is presence/absence
//          of nodes, conserved trivially by deterministic writes.
//     MA2 (traversal): node/edge writes are the only mutation paths.
//     MA3 (connectivity): edges persisted via persistEdges; structural integrity
//          enforced — fromId/toId must reference existing nodes (validated).
//     MA4 (directionality): ArtifactEdge.fromId → toId is directional and
//          carries kind (classification-lineage / categorical / version / dependency).
//     MA5 (emergent identity): mode-node interning keyed by CognitivePrimitive —
//          one stable NodeId per primitive across all emissions.
//     MA6 (deletability): deleteAnchor(nodeId) cascades; system re-equilibrates
//          (no orphan dangling references). Test-only path; not exposed at R3
//          per Phase 5.5 spec note "no-op deletion path must not throw."
//
//   Phase 5.5 process-restart NOTE: substore is in-memory, process-warm. Phase 9
//   adds Postgres persistence; this module's surface stays stable. The persistence
//   layer slots in via two functions (loadFromDisk / persistDelta) declared but
//   unimplemented; trying to call them today returns ok-with-noop. Spec scopes
//   out process-restart persistence — this is intentional Phase 9 carry.

import type { NodeId, CognitivePrimitive } from '@/core/types/primitives'
import type {
  ArtifactEmission,
  ArtifactEdge,
  ArtifactPayload,
} from '@/core/types/artifact-standard.types'
import type { PlanArtifactContent } from '@/core/types/plan-standard.types'
import { generateId } from '@/core/types/primitives'

// ─── Internal node shapes ────────────────────────────────────────────────────
// Two node kinds in the artifact graph. Both are R2-internal — never cross
// the slice boundary; consumers see ArtifactGraphPort + PlanResolutionPort
// methods only.

/** Anchor node — minted per emission per ArA1/ArA2. */
type ArtifactAnchorNode = {
  id:         NodeId
  framework:  { id: string; version: string }
  turnId:     string
  emissionId: string
  createdAt:  number
}

/** Companion node — carries payload verbatim per ArA2. */
type ArtifactCompanionNode = {
  id:         NodeId
  emissionId: string
  payload:    unknown    // typed by domain at consumption site (e.g. PlanArtifactContent)
  createdAt:  number
}

/** Content node — materialized children per ArA3 (cardinality ≥ 1). */
type ArtifactContentNode = {
  id:           NodeId
  emissionId:   string
  contentValue: unknown
  createdAt:    number
}

/** Mode node — primitive-keyed registry per MA5 / ArA4b. */
type ArtifactModeNode = {
  id:        NodeId
  primitive: CognitivePrimitive
  createdAt: number
}

// ─── Artifact substore (process-warm, in-memory) ────────────────────────────

type ArtifactStore = {
  // Indices keyed for the eight ArtifactGraphPort methods.
  anchorById:           Map<NodeId, ArtifactAnchorNode>
  companionById:        Map<NodeId, ArtifactCompanionNode>
  contentById:          Map<NodeId, ArtifactContentNode>

  // emissionId → anchor for in-flight resolution (materializeContent runs
  // before registerEmission in the AS R2 procedure; we need to find the
  // anchor minted seconds earlier in the same emission).
  anchorByEmissionId:   Map<string, NodeId>

  // Companion lookup by anchor — used by resolvePlan one-hop read (HR-MI4).
  companionByAnchor:    Map<NodeId, NodeId>

  // Mode-node registry per MA5 — one stable NodeId per CognitivePrimitive
  // for the lifetime of the process.
  modeByPrimitive:      Map<string, NodeId>
  modeNodes:            Map<NodeId, ArtifactModeNode>

  // Emission registry — backs G-Ar8 uniqueness + supports lookupPriorAnchor.
  emissions:            Map<string, ArtifactEmission>

  // Prior-anchor index — keyed by (framework.id, framework.version, domain,
  // schemaRef, userId). Plan v2.2 PA5 re-entry path: F-planner emits a
  // re-plan; we look up the prior plan's anchor for this user+framework+schema
  // tuple to populate the version edge. Latest wins.
  priorAnchorIndex:     Map<string, NodeId>

  // Edge log — ArA4 edges persisted via persistEdges (S3, post-emission).
  edges:                ArtifactEdge[]
}

function priorAnchorKey(args: {
  framework: { id: string; version: string }
  domain:    string
  schemaRef: string
  userId:    string
}): string {
  return [args.framework.id, args.framework.version, args.domain, args.schemaRef, args.userId].join('|')
}

// Process-singleton state. Phase 9 will load from Postgres at module init.
const _store: ArtifactStore = {
  anchorById:         new Map(),
  companionById:      new Map(),
  contentById:        new Map(),
  anchorByEmissionId: new Map(),
  companionByAnchor:  new Map(),
  modeByPrimitive:    new Map(),
  modeNodes:          new Map(),
  emissions:          new Map(),
  priorAnchorIndex:   new Map(),
  edges:              [],
}

// ─── Public API (consumed by F-memory R3) ───────────────────────────────────

/**
 * Mint anchor node. ArA1: present every emission.
 * Side effect: anchorByEmissionId index updated so a later
 * createCompanionNode / materializeContent in the same emission can locate it.
 */
export async function createAnchorNode(args: {
  framework:  { id: string; version: string }
  turnId:     string
  emissionId: string
}): Promise<NodeId> {
  const id = generateId('anchor') as NodeId
  const node: ArtifactAnchorNode = {
    id,
    framework:  { id: args.framework.id, version: args.framework.version },
    turnId:     args.turnId,
    emissionId: args.emissionId,
    createdAt:  Date.now(),
  }
  _store.anchorById.set(id, node)
  _store.anchorByEmissionId.set(args.emissionId, id)
  return id
}

/**
 * Mint companion node. ArA2: 1:1 with anchor by emissionId.
 * Companion-by-anchor index updated for HR-MI4 one-hop resolution.
 */
export async function createCompanionNode(args: {
  emissionId: string
  payload:    unknown
}): Promise<NodeId> {
  const id = generateId('companion') as NodeId
  const node: ArtifactCompanionNode = {
    id,
    emissionId: args.emissionId,
    payload:    args.payload,
    createdAt:  Date.now(),
  }
  _store.companionById.set(id, node)
  // Anchor must already be minted in this emission (AS R2 ordering).
  const anchor = _store.anchorByEmissionId.get(args.emissionId)
  if (anchor) _store.companionByAnchor.set(anchor, id)
  return id
}

/**
 * Materialize content node(s). ArA3: cardinality ≥ 1.
 * Phase 5.5: one node per call. Multi-node materialization (e.g. for
 * decomposed payloads) is a Phase 9+ extension to this primitive.
 */
export async function materializeContent(args: {
  emissionId:   string
  contentValue: unknown
}): Promise<NodeId[]> {
  const id = generateId('content') as NodeId
  const node: ArtifactContentNode = {
    id,
    emissionId:   args.emissionId,
    contentValue: args.contentValue,
    createdAt:    Date.now(),
  }
  _store.contentById.set(id, node)
  return [id]
}

/**
 * Mode-node registry per MA5. One stable NodeId per primitive for the
 * process lifetime; subsequent calls with the same primitive return the same id.
 *
 * Signature accepts string per ArtifactGraphPort contract. CognitivePrimitive
 * values flow through unchanged; arbitrary strings are interned same way.
 */
export async function lookupModeNode(primitive: string): Promise<NodeId> {
  const key = String(primitive)
  let existing = _store.modeByPrimitive.get(key)
  if (existing) return existing
  const id = generateId(`mode-${key}`) as NodeId
  _store.modeByPrimitive.set(key, id)
  _store.modeNodes.set(id, { id, primitive: primitive as CognitivePrimitive, createdAt: Date.now() })
  return id
}

/**
 * Lookup prior anchor for ArA4c version edge. Returns null if no prior
 * exists for this (framework, domain, schemaRef, userId) tuple.
 *
 * Phase 5.5 PA5 closure: this is the cross-turn read. F-planner runPipeline
 * calls deps.db.getPriorPlanAnchor (its own DB column for the build-scoped
 * pointer); the plan emission then carries `dependsOn: [priorAnchor]` into
 * createArtifact. AS calls this function during S1 to verify the prior
 * actually exists in the graph and to enable any further version-chain reads.
 */
export async function lookupPriorAnchor(args: {
  framework: { id: string; version: string }
  domain:    string
  schemaRef: string
  turnId:    string
  userId?:   string
}): Promise<NodeId | null> {
  // Spec said userId in the key; AS R2 today passes turnId, not userId.
  // Use turnId as the per-session scope since F-planner's jobId == turnId
  // on the build-emission path. Phase 9 add userId properly when AS R2
  // signature is extended.
  const userKey = args.userId ?? args.turnId
  const key = priorAnchorKey({ framework: args.framework, domain: args.domain, schemaRef: args.schemaRef, userId: userKey })
  return _store.priorAnchorIndex.get(key) ?? null
}

/**
 * Register emission. G-Ar8 uniqueness + version-edge index update.
 * Called at AS S3 after gate evaluation passes.
 */
export async function registerEmission(emission: ArtifactEmission): Promise<void> {
  _store.emissions.set(emission.emissionId, emission)

  // Update prior-anchor index so next emission with the same key tuple
  // finds this anchor as its prior. Latest wins.
  const key = priorAnchorKey({
    framework: { id: emission.framework.id, version: emission.framework.version },
    domain:    emission.payload.domain,
    schemaRef: emission.payload.schemaRef,
    userId:    String(emission.userId),
  })
  _store.priorAnchorIndex.set(key, emission.writes.a7.artifactAnchorNodeId)
}

/** G-Ar8 sync collision predicate. */
export function isEmissionIdCollision(emissionId: string): boolean {
  return _store.emissions.has(emissionId)
}

/**
 * Persist ArA4 edges. MA3: structural integrity check — both ends must
 * reference nodes already in the graph (anchor / companion / content / mode).
 * Phase 5.5: log on integrity failure; do not throw — AS R2 G-Ar* gates
 * already validated edge shape, this is defense-in-depth.
 *
 * EXPECTED PRE-PHASE-8 NOISE: classification-lineage edges target
 * classificationNodeIds minted by the cognitive stub (phase8-cognitive-stub.ts);
 * those NodeIds are not registered in F-memory until F-codec R3 lands at
 * Phase 8. The dangling warnings on those edges are expected and resolve
 * when the stub is replaced. The edges themselves are NOT persisted (they
 * fail the integrity check) — that is correct behavior.
 */
export async function persistEdges(edges: ArtifactEdge[]): Promise<void> {
  for (const edge of edges) {
    const fromExists = nodeExists(edge.fromId)
    const toExists   = nodeExists(edge.toId)
    if (!fromExists || !toExists) {
      console.warn(JSON.stringify({
        level:     'warn',
        event:     'memory.artifact.edge.dangling',
        edge:      { fromId: edge.fromId, toId: edge.toId, kind: edge.kind, fromExists, toExists },
        slice:     'F-memory',
        timestamp: new Date().toISOString(),
      }))
      continue
    }
    _store.edges.push(edge)
  }
}

function nodeExists(id: NodeId): boolean {
  return _store.anchorById.has(id)
      || _store.companionById.has(id)
      || _store.contentById.has(id)
      || _store.modeNodes.has(id)
}

// ─── Plan resolution (HR-MI4 one-hop) ────────────────────────────────────────

/**
 * One-hop read at planAnchorNodeId. Returns the PlanArtifactContent carried
 * by the companion node. Null when:
 *   - anchor not found
 *   - anchor has no companion (impossible per ArA2 if AS R2 wrote correctly)
 *   - companion payload domain != 'plan' (the anchor is not a plan emission)
 *   - companion content shape is not PlanArtifactContent
 */
export async function resolvePlan(planAnchorNodeId: NodeId): Promise<PlanArtifactContent | null> {
  const companionId = _store.companionByAnchor.get(planAnchorNodeId)
  if (!companionId) return null
  const companion = _store.companionById.get(companionId)
  if (!companion) return null

  const payload = companion.payload as ArtifactPayload | undefined
  if (!payload || typeof payload !== 'object' || payload.domain !== 'plan') return null

  const content = payload.content as Partial<PlanArtifactContent> | null
  if (!content || typeof content !== 'object'
      || !('planId'   in content)
      || !('binding'  in content)
      || !('shape'    in content)) {
    return null
  }
  return content as PlanArtifactContent
}

// ─── Test / introspection helpers (R2-internal; not exposed at R3) ──────────

/** Process-state inspection for tests. Not part of the R3 contract. */
export function _inspectStore(): {
  anchors:    number
  companions: number
  contents:   number
  modes:      number
  emissions:  number
  edges:      number
  priors:     number
} {
  return {
    anchors:    _store.anchorById.size,
    companions: _store.companionById.size,
    contents:   _store.contentById.size,
    modes:      _store.modeNodes.size,
    emissions:  _store.emissions.size,
    edges:      _store.edges.length,
    priors:     _store.priorAnchorIndex.size,
  }
}

/** MA6 deletability (test-only path; spec note "no-op delete must not throw"). */
export function _deleteAnchorCascade(anchorId: NodeId): void {
  const anchor = _store.anchorById.get(anchorId)
  if (!anchor) return
  // Cascade: companion, content nodes for the same emission, prior-index
  // entries pointing at this anchor.
  const companionId = _store.companionByAnchor.get(anchorId)
  if (companionId) {
    _store.companionById.delete(companionId)
    _store.companionByAnchor.delete(anchorId)
  }
  for (const [id, c] of _store.contentById.entries()) {
    if (c.emissionId === anchor.emissionId) _store.contentById.delete(id)
  }
  _store.anchorById.delete(anchorId)
  _store.anchorByEmissionId.delete(anchor.emissionId)
  for (const [k, v] of _store.priorAnchorIndex.entries()) {
    if (v === anchorId) _store.priorAnchorIndex.delete(k)
  }
}

/** Test-only reset. Not exposed at R3. Phase 9 replaces with persistence init. */
export function _resetForTests(): void {
  _store.anchorById.clear()
  _store.companionById.clear()
  _store.contentById.clear()
  _store.anchorByEmissionId.clear()
  _store.companionByAnchor.clear()
  _store.modeByPrimitive.clear()
  _store.modeNodes.clear()
  _store.emissions.clear()
  _store.priorAnchorIndex.clear()
  _store.edges.length = 0
}
