// @liv-standard v1.5.1
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, A2-event-bus-r3, w3-17-contract-ext, 6.1-global-seed, 4b-nodeid-propagation, lm-v2-2-shot2, lm-v2-2-shot3, lm-v2-2-shot4, lm-v2-2-shot5, lm-v2-2-shot5-fix-2, lm-v2-3-shot1, lm-v2-3-shot2
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  MemGraph          F-memory/R0
//   W-ATOM  MemNode           F-memory/R0
//   W-ATOM  MemEdge           F-memory/R0
//   W-ATOM  GraphMutation     F-memory/R0
//   W-ATOM  PresentState      F-memory/R0
//   W-ATOM  TraversalResult   F-memory/R0
//   W-ATOM  TraversalOptions  F-memory/R0
//   W-ATOM  MemArm            F-memory/R0
//   W-ATOM  DominanceEntry    F-memory/R0
//   W-ATOM  GraphThresholds   F-memory/R0
//   W-ATOM  MLayer            F-memory/R0
//   W-ATOM  MEMORY_CONFIG     F-memory/R0
//   W-ATOM  MEMORY_EVENTS     F-memory/R0
//   W-ATOM  ScopedGraphSet    F-memory/R0
//   W-INJECT bind, computeThresholds         F-memory/R1 (memory-bind)
//   W-INJECT propagate                       F-memory/R1 (memory-traverse)
//   W-INJECT sparsify                        F-memory/R1 (memory-sparsify)
//   W-INJECT computeLayer, updateLayersLocally F-memory/R1 (memory-layer)
//   W-INJECT detectArms, detectArmMerges     F-memory/R1 (memory-arm)
//   W-INJECT computePresentState             F-memory/R1 (memory-present)
//   W-INJECT normalizeLabel                  F-memory/R1 (memory-label)
//   W-INJECT loadGraph, persistMutations, persistArms, touchTraversedNodes F-memory/R4 (memory-graph-io)
//   W-INJECT encode                          F-memory/R4 (embedding-service)
//   W-INJECT emitEvent                       F-event-system/R3
// wires-out:  none (consumed by R3 contract)
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-events
//   R1  ../domain/memory-bind
//   R1  ../domain/memory-traverse
//   R1  ../domain/memory-sparsify
//   R1  ../domain/memory-layer
//   R1  ../domain/memory-arm
//   R1  ../domain/memory-present
//   R1  ../domain/memory-label
//   R4  ../exec/memory-graph-io
//   R4  ../exec/embedding-service
//   R3  @/features/F-event-system/contract/event-bus (A2-event-bus-r3)
// validated:  pending

// Living Memory v1.1 — orchestration service.
// R2: wires R1 pure functions + R4 I/O. The brain.
//
// §6: one operation — runTraversal(text, userId, options).
// MA2: read, write, and learning are one pass.
// G2: present() reads _userStates cache. Recomputed only inside runTraversal().
// G3: all mutations committed atomically via persistMutations().
//
// lm-v1.1 changes:
//   Module state: split to global (boot once) + per-user (lazy-loaded, keyed by userId)
//   onBoot(): loads global graph only (userId=null)
//   ensureUserLoaded(userId): lazy per-user graph load
//   runTraversal(text, userId, options):
//     - Fallthrough bind: user graph first, global graph if no resonance (Amendment 3)
//     - Bind-before-create: skip node creation if top match ≥ LABEL_REUSE_THRESHOLD (Amendment 2)
//     - normalizeLabel() on new node content (Amendment 2)
//     - 6-field edges: primitiveType + createdAt + userId (Amendments 1+3)
//     - Scoped persist: userId passed to all R4 calls
//   getPresentState(userId): per-user present state
//   (lm-v2-2-shot2: getPresentState replaced by present({scope, axes, limit}); cache lookup body reused per brief §B)
//   getUserGraph(userId): per-user graph for vital signs

import type {
  MemGraph,
  MemNode,
  MemNodeRow,
  MemEdge,
  MemArm,
  DominanceEntry,
  GraphMutation,
  GraphThresholds,
  PresentState,
  TraversalResult,
  TraversalOptions,
  ActivationMap,
  MLayer,
  // lm-v2-2-shot2: LM v2.2 atoms consumed at the new R2 surface (present, lineage)
  ScopeFilter,
  AxisSet,
  AxisId,
  AxisConfig,
  LineageGraph,
  EdgeKindSet,
  // lm-v2-2-shot3: LMA21 scope-tag set for persistence stamping
  ScopeTagSet,
  EdgePrimitiveType,
  // lm-v2-3-shot1 (LMA22, LMA23, LMA24): arrival-metadata bundle + leaf enums
  ArrivalMetadata,
  Modality,
  SourceAuthority,
  // lm-v2-3-shot2 (LMA28): trust-weight map type
  TrustWeightMap,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M3_CONTEXT,
  M4_INPUT,
  // lm-v2-2-shot4: cache-callsite computePresentState invocations need limit cap.
  PRESENT_LIMIT_MAX,
  // lm-v2-3-shot1: default-fill bundle for system-tagged writes (boot hydration,
  // test scaffolding, admin pings). Real perimeter callers thread their own.
  SYSTEM_DEFAULT_ARRIVAL,
  // lm-v2-3-shot2 (LMA26, LMA28): suppress-edge default weight + τ-derivation
  // default table.
  SUPPRESS_EDGE_DEFAULT_WEIGHT,
  DEFAULT_TRUST_WEIGHT,
} from '../config/memory-types'
import { MEMORY_EVENTS } from '../config/memory-events'

// R1 — pure functions
import { bind, computeThresholds } from '../domain/memory-bind'
import { propagate } from '../domain/memory-traverse'
import { sparsify } from '../domain/memory-sparsify'
import { updateLayersLocally } from '../domain/memory-layer'
import { detectArms, detectArmMerges } from '../domain/memory-arm'
import { computePresentState } from '../domain/memory-present'
import { normalizeLabel } from '../domain/memory-label'

// R4 — I/O
import { loadGraph, persistMutations, persistArms, touchTraversedNodes } from '../exec/memory-graph-io'
import { encode } from '../exec/embedding-service'

// R3 — event bus (A2-event-bus-r3: documented amendment, same as F-planner/F-output)
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// lm-v2-2-shot5: artifact substore hydration peer-import (R2 → R2 same slice).
// hydrateArtifactStore loads all rows from mem_artifact_* tables into the
// in-memory cache so AS R3 hooks answer correctly from first call.
import { hydrateArtifactStore } from './memory-artifact-store'

import type { Result, NodeId } from '@/core/types/primitives'
import { generateId } from '@/core/types/primitives'

// ─── Module-level state ───────────────────────────────────────────────────────
// Amendment 3: split to global (boot once, shared read-only) + per-user (lazy).

// Global graph — loaded once on boot, shared read-only
let _globalGraph: MemGraph = { nodes: new Map(), edges: new Map() }
let _globalArms: MemArm[] = []
let _globalDominanceMap: Map<NodeId, DominanceEntry> = new Map()
let _globalThresholds: GraphThresholds = { bind: 0, close: 0.5, stable: 0.3, asym: 0.2, dom: 0.5 }
let _booted = false

// Per-user state — lazy-loaded, keyed by userId
type UserGraphState = {
  graph:        MemGraph
  arms:         MemArm[]
  dominanceMap: Map<NodeId, DominanceEntry>
  thresholds:   GraphThresholds
  presentState: PresentState
  loaded:       boolean
}
const _userStates = new Map<string, UserGraphState>()

// ─── LMA21 scope-stamp helpers (lm-v2-2-shot3) ────────────────────────────────
// Per LM v2.2 §C + LMA21: every node-write stamps active scope tags. Total
// stamping — no node persists without scope tags. Default = {'global'} when
// no scope context active.
//
// Token format per D-SCOPE-TAG-FORMAT:
//   'user:<userId>'      — per-user scope
//   'project:<projectId>' — per-project scope (open per LMA21)
//   'global'              — default scope when no other context active

/**
 * Build the active ScopeTagSet from the writing context. Used at every
 * node-construction site in F-memory.
 *
 * @param userId  per-user context (null = global write)
 * @param projectId optional project context
 * @returns ScopeTagSet — non-empty per LMA21 (defaults to {'global'} when both null)
 */
export function stampScope(
  userId:    string | null,
  projectId?: string | null,
): ScopeTagSet {
  const tags = new Set<string>()
  if (userId) tags.add('user:' + userId)
  if (projectId) tags.add('project:' + projectId)
  if (tags.size === 0) tags.add('global')
  return tags
}

/**
 * Boot-time backward-compat per D-MEMNODE-MIGRATION. Nodes loaded from DB
 * without a stamped scope field derive one from the legacy userId column:
 *   userId === null  →  {'global'}
 *   userId !== null  →  {'user:'+userId}
 * lm-v2-2-shot5-fix-2 (G1 Move-to-R2): input changed from MemNode to MemNodeRow.
 * R4 returns row shapes; this R2 helper produces the full domain atom by adding
 * the LMA21 scope field. Always stamps (no idempotent short-circuit needed —
 * MemNodeRow lacks scope by construction).
 *
 * lm-v2-3-shot1 (LMA22, LMA23, LMA24): arrival-metadata default-fill at the
 * same hydration boundary. MemNodeRow lacks the three fields by construction
 * (DB schema unchanged this shot — D-MEMNODE-ARRIVAL-DEFER); boot-loaded rows
 * get SYSTEM_DEFAULT_ARRIVAL — modality='perception',
 * sourceAuthority='wearer-utterance', confidence=1.0 — preserving the
 * implicit pre-v2.3 reading. New writes carry their own values per
 * runTraversal's required `arrival` parameter.
 */
export function ensureNodeScopeStamped(row: MemNodeRow): MemNode {
  return {
    ...row,
    scope: stampScope(row.userId),
    // lm-v2-3-shot1 (LMA22, LMA23, LMA24): boot-time default-fill.
    modality:        SYSTEM_DEFAULT_ARRIVAL.modality,
    sourceAuthority: SYSTEM_DEFAULT_ARRIVAL.sourceAuthority,
    confidence:      SYSTEM_DEFAULT_ARRIVAL.confidence,
  }
}

/**
 * lm-v2-3-shot1 (LMA22, LMA23, LMA24): runtime validator for the arrival-metadata
 * bundle at the LM seam. Throws LivingMemoryError(LM_INPUT_INVALID) on V1/V2/V3
 * violation. Called from runTraversal before any node construction.
 *
 * V1 (LMA22): non-null modality ∈ ModalityEnum
 * V2 (LMA23): non-null sourceAuthority ∈ SourceAuthorityEnum
 * V3 (LMA24): non-null confidence ∈ (0, 1]
 *
 * Enums are TypeScript string-literal unions; runtime check uses Set lookups
 * declared once below to keep the seam allocation-free.
 */
const MODALITY_ENUM: ReadonlySet<Modality> = new Set<Modality>([
  'perception',
  'assertion',
  'typing-failure',
])

const SOURCE_AUTHORITY_ENUM: ReadonlySet<SourceAuthority> = new Set<SourceAuthority>([
  'wearer-utterance',
  'tool-reply',
  'scheduled-trigger',
  'external-integration',
  'program-emission',
])

export function validateArrival(arrival: ArrivalMetadata): void {
  // V1 — modality
  if (arrival.modality === null || arrival.modality === undefined) {
    throw new Error('LM_INPUT_INVALID: arrival.modality is null/undefined (LMA22 V1)')
  }
  if (!MODALITY_ENUM.has(arrival.modality)) {
    throw new Error(`LM_INPUT_INVALID: arrival.modality not in ModalityEnum (LMA22 V1): ${String(arrival.modality)}`)
  }
  // V2 — sourceAuthority
  if (arrival.sourceAuthority === null || arrival.sourceAuthority === undefined) {
    throw new Error('LM_INPUT_INVALID: arrival.sourceAuthority is null/undefined (LMA23 V2)')
  }
  if (!SOURCE_AUTHORITY_ENUM.has(arrival.sourceAuthority)) {
    throw new Error(`LM_INPUT_INVALID: arrival.sourceAuthority not in SourceAuthorityEnum (LMA23 V2): ${String(arrival.sourceAuthority)}`)
  }
  // V3 — confidence ∈ (0, 1]
  const c = arrival.confidence
  if (c === null || c === undefined || typeof c !== 'number' || !Number.isFinite(c)) {
    throw new Error('LM_INPUT_INVALID: arrival.confidence is null/non-finite (LMA24 V3)')
  }
  if (!(c > 0 && c <= 1)) {
    throw new Error(`LM_INPUT_INVALID: arrival.confidence out of range (0, 1] (LMA24 V3): ${c}`)
  }
}

/**
 * LMA21 projection-side filter predicate. Returns true if the node's stamped
 * scope tags satisfy the ScopeFilter.
 *
 * Match rules:
 *  - A node tagged 'global' is in scope for any filter (universal global
 *    knowledge — the moral principle that no user's personal context becomes
 *    truth for other users does not apply in reverse: global knowledge is
 *    visible across all user projections).
 *  - Otherwise: every non-undefined dimension in the filter must match at
 *    least one of the node's stamped tags ('user:'+id, 'project:'+id).
 *
 * Empty ScopeFilter (no fields set) — handled at the caller site (caller
 * decides empty-means-nothing vs empty-means-all). nodeInScope treats empty
 * as "all dimensions ignored, accept anything", which combined with the
 * 'global' rule means an empty filter accepts every node.
 */
export function nodeInScope(node: MemNode, filter: ScopeFilter): boolean {
  if (node.scope.has('global')) return true
  if (filter.user !== undefined) {
    if (!node.scope.has('user:' + filter.user)) return false
  }
  if (filter.project !== undefined) {
    if (!node.scope.has('project:' + filter.project)) return false
  }
  return true
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
// Called once at server start by F-event-system/startup.ts.
// Amendment 3: loads global graph only (userId=null). Per-user graphs lazy-loaded.
// Idempotent: safe to call multiple times (early-exit if already booted).

export async function onBoot(): Promise<void> {
  if (_booted) return

  const loadResult = await loadGraph(null)
  if (!loadResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.boot.load-failed',
      error: loadResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — start with empty global graph
    _globalGraph = { nodes: new Map(), edges: new Map() }
    _globalArms = []
    _globalDominanceMap = new Map()
    _booted = true
    return
  }

  // lm-v2-2-shot3 (D-MEMNODE-MIGRATION): stamp scope on legacy nodes loaded
  // from DB. Total LMA21 stamping invariant restored across boot.
  // lm-v2-2-shot5-fix-2 (G1 Move-to-R2): R4 returns MemNodeRow (no scope);
  // R2 hydrates via ensureNodeScopeStamped to produce the full MemNode atom.
  const stampedNodes = new Map<NodeId, MemNode>()
  for (const [id, row] of loadResult.data.graph.nodes) {
    stampedNodes.set(id, ensureNodeScopeStamped(row))
  }
  _globalGraph = { nodes: stampedNodes, edges: loadResult.data.graph.edges }
  _globalArms = loadResult.data.arms
  _globalDominanceMap = loadResult.data.dominanceMap

  // Compute initial thresholds from global graph
  _globalThresholds = computeThresholds(_globalGraph)

  // lm-v2-2-shot5: hydrate artifact substore from Postgres (migration 015).
  // D-A4-HYDRATION-POLICY: eager — all rows loaded into in-memory cache so
  // that isEmissionIdCollision (sync) and lookupModeNode/lookupPriorAnchor
  // (cache-first) answer correctly from first call. MA1 conservation across
  // pm2 restart depends on this — the artifact graph rehydrates intact.
  // Failure here is non-fatal (matches LM v2.2 graph-load failure handling):
  // log + continue with empty cache; emissions during the boot window will
  // collide-check against an empty registry but still write through to
  // Postgres.
  try {
    await hydrateArtifactStore()
  } catch (err) {
    console.error(JSON.stringify({
      level:     'error',
      event:     'memory.boot.artifact-hydrate-failed',
      error:     err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    }))
  }

  _booted = true

  console.log(JSON.stringify({
    level: 'info', event: 'memory.boot.complete',
    nodeCount: _globalGraph.nodes.size,
    edgeCount: Array.from(_globalGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: _globalArms.length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── Reload Global Graph ──────────────────────────────────────────────────────
// 6.1-global-seed: force-reload global graph from DB after batch seed.
// Unlike onBoot(), this bypasses the _booted idempotency guard.
// Admin-only. Called via R3 contract after seedAndTraverseGlobal completes.

export async function reloadGlobalGraph(): Promise<void> {
  const loadResult = await loadGraph(null)
  if (!loadResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.reload.load-failed',
      error: loadResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  // lm-v2-2-shot3 (D-MEMNODE-MIGRATION): stamp scope on reloaded nodes.
  // lm-v2-2-shot5-fix-2 (G1 Move-to-R2): hydrate row → MemNode at R2.
  const reloadStampedNodes = new Map<NodeId, MemNode>()
  for (const [id, row] of loadResult.data.graph.nodes) {
    reloadStampedNodes.set(id, ensureNodeScopeStamped(row))
  }
  _globalGraph = { nodes: reloadStampedNodes, edges: loadResult.data.graph.edges }
  _globalArms = loadResult.data.arms
  _globalDominanceMap = loadResult.data.dominanceMap
  _globalThresholds = computeThresholds(_globalGraph)

  // Invalidate all per-user present state caches so they recompute
  // with the updated global graph on next access.
  // lm-v2-2-shot4: signature now (graphs, userArms, globalArms, scope, axes, limit).
  for (const [userId, state] of _userStates) {
    state.presentState = computePresentState(
      { user: state.graph, global: _globalGraph },
      state.arms,
      _globalArms,
      { user: userId },
      PRESENT_DEFAULTS,
      PRESENT_LIMIT_MAX,
    )
  }

  console.log(JSON.stringify({
    level: 'info', event: 'memory.reload.complete',
    nodeCount: _globalGraph.nodes.size,
    edgeCount: Array.from(_globalGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    armCount: _globalArms.length,
    timestamp: new Date().toISOString(),
  }))
}

// ─── Ensure User Loaded ───────────────────────────────────────────────────────
// Amendment 3: lazy per-user graph load. Returns UserGraphState, creates empty on failure.

async function ensureUserLoaded(userId: string): Promise<UserGraphState> {
  let state = _userStates.get(userId)
  if (state?.loaded) return state

  const result = await loadGraph(userId)

  if (!result.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.user-load.failed',
      userId,
      error: result.error.message,
      timestamp: new Date().toISOString(),
    }))
    // Non-fatal — start with empty user graph
    state = {
      graph:        { nodes: new Map(), edges: new Map() },
      arms:         [],
      dominanceMap: new Map(),
      thresholds:   { bind: 0, close: 0.5, stable: 0.3, asym: 0.2, dom: 0.5 },
      // lm-v2-2-shot4: v2.2 §D empty shape
      // lm-v2-3-shot2 (LMA27): conflictGroups annotation initialized empty
      presentState: { projected: [], axisScores: new Map(), scopeContext: { user: userId }, conflictGroups: [] },
      loaded:       true,
    }
    _userStates.set(userId, state)
    return state
  }

  const arms = result.data.arms
  const dominanceMap = result.data.dominanceMap
  // lm-v2-2-shot3 (D-MEMNODE-MIGRATION): stamp scope on legacy per-user nodes.
  // lm-v2-2-shot5-fix-2 (G1 Move-to-R2): hydrate row → MemNode at R2.
  const stampedUserNodes = new Map<NodeId, MemNode>()
  for (const [id, row] of result.data.graph.nodes) {
    stampedUserNodes.set(id, ensureNodeScopeStamped(row))
  }
  const graph: MemGraph = { nodes: stampedUserNodes, edges: result.data.graph.edges }
  const thresholds = computeThresholds(graph)

  // Compute initial present state with scoped graph set
  // lm-v2-2-shot4: signature now (graphs, userArms, globalArms, scope, axes, limit).
  const presentState = computePresentState(
    { user: graph, global: _globalGraph },
    arms,
    _globalArms,
    { user: userId },
    PRESENT_DEFAULTS,
    PRESENT_LIMIT_MAX,
  )

  state = {
    graph,
    arms,
    dominanceMap,
    thresholds,
    presentState,
    loaded: true,
  }
  _userStates.set(userId, state)
  return state
}

// ─── Run Traversal ────────────────────────────────────────────────────────────
// §6: the one operation. Handles read, write, and learning in one pass (MA2).
// Amendment 3: +userId param. All operations use per-user graph state.
//
// Pipeline per §6 runTraversal(text, userId, options):
//   1. encode(text) → embedding vector
//   2. bind(embedding, userGraph, userThresholds) → find resonant nodes
//   2a. FALLTHROUGH: if no resonance → bind(embedding, _globalGraph, _globalThresholds)
//   2b. BIND-BEFORE-CREATE: if top match ≥ LABEL_REUSE_THRESHOLD → reinforce, skip create
//   3. if no binding → create new M4 node (normalizeLabel), return empty
//   4. connect → create edges to bound nodes (6-field, scoped)
//   5. propagate → spread activation, inline learning
//   6. sparsify → top-K competition + edge prune + isolate removal
//   7. update_layers_locally → recompute layer for changed nodes
//   8. persist atomically (G3, scoped)
//   9. recompute Present State (G2: side effect of traversal only)
//  10. return → if read: return top-K activated nodes

export async function runTraversal(
  text:    string,
  userId:  string,
  options: TraversalOptions = {},
  arrival: ArrivalMetadata,
  // lm-v2-3-shot2 (LMA26): optional caller-supplied suppress-edge declarations.
  // Each entry persists a MemEdge with primitiveType='suppress' as part of
  // this traversal's atomic commit set. Validated for same-scope endpoints
  // (LMA3) before persistence.
  suppressEdges?: Array<{ from: NodeId; to: NodeId }>,
): Promise<Result<TraversalResult | null>> {
  // lm-v2-3-shot1 (LMA22, LMA23, LMA24): seam validation. V1/V2/V3 fail-fast
  // before any node construction or graph mutation. Throws are caught by the
  // outer try-equivalent (we surface them as LM_INPUT_INVALID Result errors so
  // the contract surface stays Result-shaped).
  try {
    validateArrival(arrival)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'LM_INPUT_INVALID', message } }
  }

  // lm-v2-3-shot2 (LMA28): τ derivation. One traversal, one τ. Constant
  // throughout this invocation; multiplies every weight change in the commit
  // set (new edges, inline learn() Δw, suppress-edge weight). LMA12 preserved
  // — τ derived at write, applied at write; not a function of elapsed time.
  // Default trust map yields τ = 1.0 across all authorities (identity).
  const trustMap: TrustWeightMap = DEFAULT_TRUST_WEIGHT
  const tau = trustMap[arrival.sourceAuthority]

  // Turbopack module isolation: lazy-boot if needed
  if (!_booted) {
    await onBoot()
    if (!_booted) {
      return { ok: false, error: { code: 'NOT_BOOTED', message: 'Memory service not initialized' } }
    }
  }

  // Amendment 3: load per-user graph state
  const userState = await ensureUserLoaded(userId)
  const userGraph = userState.graph
  const userThresholds = userState.thresholds

  const now = Date.now()

  // ── Step 1: encode ──────────────────────────────────────────────────────────
  const encodeResult = await encode(text)
  if (!encodeResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.encode-failed',
      error: encodeResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return { ok: true, data: null }
  }
  const embedding = encodeResult.data

  // ── Step 2: bind ────────────────────────────────────────────────────────────
  let binding = bind(embedding, userGraph, userThresholds)

  // Amendment 3: FALLTHROUGH — if no resonance in user graph, try global graph
  // Fallthrough is read-only: global graph never mutated by user traversals (A6)
  let fallthroughUsed = false
  if (binding.nodes.length === 0) {
    binding = bind(embedding, _globalGraph, _globalThresholds)
    fallthroughUsed = binding.nodes.length > 0
  }

  // Track all changed nodes for layer recomputation
  const changedNodeIds = new Set<NodeId>()

  // Initialize mutation
  const mutation: GraphMutation = {
    nodeCreates:  [],
    edgeUpserts:  [],
    edgeDeletes:  [],
    nodeDeletes:  [],
    sourcePrunes: [],
    layerUpdates: [],
  }

  // ── Step 2b: bind-before-create (Amendment 2) ──────────────────────────────
  // If top match similarity ≥ LABEL_REUSE_THRESHOLD, skip node creation.
  // Reinforce existing node instead of creating a duplicate.
  const topMatch = binding.nodes.length > 0 ? binding.nodes[0] : null
  const skipCreate = topMatch !== null && topMatch.similarity >= MEMORY_CONFIG.LABEL_REUSE_THRESHOLD

  let activeNodeId: NodeId

  if (skipCreate && topMatch) {
    // Amendment 2: reuse existing node — reinforce instead of create
    activeNodeId = topMatch.nodeId
    changedNodeIds.add(activeNodeId)

    // Touch the reused node in the user graph
    // MA1: clone before mutation — global graph energy is independent.
    // A user traversal must not alter global state, even in-memory.
    const sourceNode = userGraph.nodes.get(activeNodeId) ?? _globalGraph.nodes.get(activeNodeId)
    const existingNode = sourceNode ? { ...sourceNode } : null
    if (existingNode) {
      existingNode.lastTraversed = now
      userGraph.nodes.set(activeNodeId, existingNode)
    }
  } else {
    // ── Step 3: create new M4 node ────────────────────────────────────────────
    // Amendment 2: normalizeLabel() on content (A6)
    // brand: locally minted — synthesized inside F-memory via generateId('mem')
    activeNodeId = generateId('mem') as NodeId
    const newNode: MemNode = {
      id:              activeNodeId,
      userId,                                  // Amendment 3: scoped to user (A6)
      // lm-v2-2-shot3 (LMA21): stamp active scope tags at construction.
      // runTraversal context: per-user write — userId is non-null here.
      // projectId not yet threaded into runTraversal signature (Shot 4+
      // may extend); current writes carry user scope only. D-LMA21-DEFER
      // (Shot 2) closes for the user dimension.
      scope:           stampScope(userId),
      content:         normalizeLabel(text.slice(0, 500)),  // Amendment 2: canonical label
      embedding,
      sourceText:      text,
      createdAt:       now,
      lastTraversed:   now,
      cachedLayer:     M4_INPUT,
      cachedClosure:   0,
      cachedAsymmetry: 0,
      // lm-v2-3-shot1 (LMA22, LMA23, LMA24): stamp perimeter-supplied
      // arrival metadata at construction. Validated above (V1/V2/V3 hold).
      // Substrate preserves these for the life of the node.
      modality:        arrival.modality,
      sourceAuthority: arrival.sourceAuthority,
      confidence:      arrival.confidence,
    }
    mutation.nodeCreates.push(newNode)
    changedNodeIds.add(activeNodeId)

    // Apply to in-memory user graph immediately (needed for propagation)
    userGraph.nodes.set(activeNodeId, newNode)
  }

  if (binding.nodes.length === 0) {
    // No resonance — persist the isolated node and return
    await commitAndUpdate(mutation, changedNodeIds, now, userId, userGraph)

    await emitEvent({
      type: MEMORY_EVENTS.NODE_CREATED,
      payload: { nodeId: activeNodeId },
      slice: 'F-memory',
    })

    return { ok: true, data: null }
  }

  // ── Step 4: connect → create edges to bound nodes ───────────────────────────
  // Amendment 1+3: 6-field edges with primitiveType, createdAt, userId (A6)
  // Fallthrough: edges point to global node IDs but stored with userId in per-user graph
  // lm-v2-3-shot2 (LMA28): connect-edge base weight × τ — one of the three
  // weight-change paths covered by V7. Base = max(0.01, similarity).
  for (const bound of binding.nodes) {
    const baseWeight = Math.max(0.01, bound.similarity)
    const edge: MemEdge = {
      fromId:        activeNodeId,
      toId:          bound.nodeId,
      weight:        baseWeight * tau,
      primitiveType: options.primitiveType ?? null,  // Amendment 4: caller-specified or null (A6)
      createdAt:     now,                            // Amendment 1 (A6)
      userId,                                        // Amendment 3: scoped (A6)
    }
    mutation.edgeUpserts.push(edge)
    changedNodeIds.add(bound.nodeId)

    // Apply to in-memory user graph
    const outEdges = userGraph.edges.get(activeNodeId) ?? []
    outEdges.push(edge)
    userGraph.edges.set(activeNodeId, outEdges)
  }

  // Active node now has edges → at least M3
  const activeNode = userGraph.nodes.get(activeNodeId)
  if (activeNode && activeNode.cachedLayer === M4_INPUT) {
    activeNode.cachedLayer = M3_CONTEXT
    userGraph.nodes.set(activeNodeId, activeNode)
  }

  // ── Step 5: propagate → spread activation + inline learning ─────────────────
  // lm-v2-3-shot2 (LMA28): pass τ through to learn(); inline reinforcement Δw
  // is multiplied by τ before the new edge weight is computed.
  const seed: ActivationMap = new Map()
  for (const bound of binding.nodes) {
    seed.set(bound.nodeId, bound.similarity)
  }
  seed.set(activeNodeId, binding.score)

  const { activation, edgeMutations } = propagate(seed, userGraph, tau)

  for (const learnedEdge of edgeMutations) {
    mutation.edgeUpserts.push(learnedEdge)
    changedNodeIds.add(learnedEdge.fromId)
    changedNodeIds.add(learnedEdge.toId)

    // Apply to in-memory user graph
    const outEdges = userGraph.edges.get(learnedEdge.fromId) ?? []
    const idx = outEdges.findIndex(e => e.toId === learnedEdge.toId)
    if (idx >= 0) outEdges[idx] = learnedEdge
    else outEdges.push(learnedEdge)
    userGraph.edges.set(learnedEdge.fromId, outEdges)
  }

  // ── Step 5b: lm-v2-3-shot2 (LMA26) suppress-edge persistence ────────────────
  // Caller-supplied conflict declarations land as `suppress`-typed MemEdges in
  // this traversal's commit set. Validation:
  //   - Both endpoints must resolve to nodes visible from this user's view
  //     (userGraph or fallthrough _globalGraph) — same-scope predicate per
  //     LMA3. Cross-scope or unresolved-endpoint references → reject the
  //     traversal with LM_VALIDITY_FAILED before committing anything (LMA11
  //     atomic commit invariant).
  //   - Endpoints are not validated against any peer-relation predicate
  //     beyond same-scope: LM does not classify which pairs *should* be in
  //     tension; perimeter (Cognitive Standard) declares the tension; LM
  //     records it (per LM v2.3 §F).
  // Weight: SUPPRESS_EDGE_DEFAULT_WEIGHT × τ. τ multiplication aligns with
  // LMA28 §5.3 first bullet — final MemEdge.weight = baseWeight × τ for new
  // edges produced by this traversal. Default base = 1.0; default τ = 1.0;
  // identity in the v2.2 baseline.
  // Suppress edges are persisted AFTER propagate runs so they do not act as
  // activation conduits during the current traversal's flow step. They do
  // participate in subsequent reads (LMA27 projection annotation; future
  // traversals' propagate may cross them).
  if (suppressEdges && suppressEdges.length > 0) {
    for (const decl of suppressEdges) {
      const fromInUser   = userGraph.nodes.has(decl.from)
      const fromInGlobal = _globalGraph.nodes.has(decl.from)
      const toInUser     = userGraph.nodes.has(decl.to)
      const toInGlobal   = _globalGraph.nodes.has(decl.to)
      if (!(fromInUser || fromInGlobal) || !(toInUser || toInGlobal)) {
        return {
          ok: false,
          error: {
            code: 'LM_VALIDITY_FAILED',
            message: `LMA26: suppress-edge endpoint not in scope (from=${decl.from}, to=${decl.to})`,
          },
        }
      }
      const suppressEdge: MemEdge = {
        fromId:        decl.from,
        toId:          decl.to,
        weight:        SUPPRESS_EDGE_DEFAULT_WEIGHT * tau,
        primitiveType: 'suppress',
        createdAt:     now,
        userId,
      }
      mutation.edgeUpserts.push(suppressEdge)
      changedNodeIds.add(decl.from)
      changedNodeIds.add(decl.to)

      // Apply to in-memory user graph for immediate visibility in subsequent
      // present-state recomputation at Step 9.
      const outEdges = userGraph.edges.get(decl.from) ?? []
      const existingIdx = outEdges.findIndex(e =>
        e.toId === decl.to && e.primitiveType === 'suppress',
      )
      if (existingIdx >= 0) outEdges[existingIdx] = suppressEdge
      else outEdges.push(suppressEdge)
      userGraph.edges.set(decl.from, outEdges)
    }
  }

  // ── Step 6: sparsify → edge prune + isolate removal ─────────────────────────
  const sparsifyResult = sparsify(userGraph)

  for (const edgeDel of sparsifyResult.edgeDeletes) {
    mutation.edgeDeletes.push(edgeDel)
    changedNodeIds.add(edgeDel.fromId)
    changedNodeIds.add(edgeDel.toId)

    const outEdges = userGraph.edges.get(edgeDel.fromId) ?? []
    userGraph.edges.set(edgeDel.fromId, outEdges.filter(e => e.toId !== edgeDel.toId))
  }

  for (const nodeId of sparsifyResult.nodeDeletes) {
    mutation.nodeDeletes.push(nodeId)
    userGraph.nodes.delete(nodeId)
    userGraph.edges.delete(nodeId)
  }

  // ── Step 7: update_layers_locally → recompute changed nodes ─────────────────
  const layerUpdates = updateLayersLocally(changedNodeIds, userGraph, userThresholds, userState.dominanceMap)

  for (const update of layerUpdates) {
    const node = userGraph.nodes.get(update.nodeId)
    if (!node) continue

    const oldLayer = node.cachedLayer

    if (oldLayer >= M3_CONTEXT && update.layer <= 2) {
      mutation.sourcePrunes.push(update.nodeId)
      node.sourceText = null
    }

    mutation.layerUpdates.push(update)

    node.cachedLayer = update.layer
    node.cachedClosure = update.closure
    node.cachedAsymmetry = update.asymmetry
    userGraph.nodes.set(update.nodeId, node)

    if (oldLayer !== update.layer) {
      await emitEvent({
        type: MEMORY_EVENTS.LAYER_CHANGED,
        payload: { nodeId: update.nodeId, from: oldLayer, to: update.layer },
        slice: 'F-memory',
      })
    }
  }

  // ── Step 8: persist atomically (G3, scoped) ─────────────────────────────────
  await commitAndUpdate(mutation, changedNodeIds, now, userId, userGraph)

  // ── Step 9: recompute Present State (G2) ────────────────────────────────────
  userState.thresholds = computeThresholds(userGraph)

  // Detect arms periodically (every traversal for now; optimize later)
  const newArms = detectArms(userGraph)

  // Amendment 3+#5: stamp userId onto detected arms before persist (memory-arm.ts stays pure)
  for (const arm of newArms) {
    arm.userId = userId
  }

  if (newArms.length !== userState.arms.length) {
    const merges = detectArmMerges(newArms, userGraph)
    for (const merge of merges) {
      await emitEvent({
        type: MEMORY_EVENTS.ARM_MERGED,
        payload: {
          armIdA: newArms[merge.armIdxA]?.id,
          armIdB: newArms[merge.armIdxB]?.id,
          mergedId: newArms[merge.armIdxA]?.id,
        },
        slice: 'F-memory',
      })
    }

    for (const arm of newArms) {
      const existed = userState.arms.some(a => a.id === arm.id)
      if (!existed) {
        await emitEvent({
          type: MEMORY_EVENTS.ARM_DETECTED,
          payload: { armId: arm.id, nodeCount: arm.nodeIds.length },
          slice: 'F-memory',
        })
      }
    }

    userState.arms = newArms
    await persistArms(newArms, userId)
  }

  // Recompute present state with scoped graph set
  // lm-v2-2-shot4: signature now (graphs, userArms, globalArms, scope, axes, limit).
  userState.presentState = computePresentState(
    { user: userGraph, global: _globalGraph },
    userState.arms,
    _globalArms,
    { user: userId },
    PRESENT_DEFAULTS,
    PRESENT_LIMIT_MAX,
  )

  // Emit traversal complete
  await emitEvent({
    type: MEMORY_EVENTS.TRAVERSAL_COMPLETE,
    payload: {
      nodeCount: userGraph.nodes.size,
      edgeCount: Array.from(userGraph.edges.values()).reduce((s, e) => s + e.length, 0),
    },
    slice: 'F-memory',
  })

  // ── Step 10: return ─────────────────────────────────────────────────────────
  if (!options.returnActivation) {
    return { ok: true, data: null }
  }

  const topNodes = Array.from(activation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MEMORY_CONFIG.TOP_K_ACTIVATION)
    .map(([nodeId, score]) => {
      const node = userGraph.nodes.get(nodeId) ?? _globalGraph.nodes.get(nodeId)
      return {
        nodeId,
        content: node?.content ?? nodeId,
        score,
        layer: (node?.cachedLayer ?? M4_INPUT) as MLayer,
      }
    })

  return {
    ok: true,
    data: { activation, topNodes },
  }
}

// ─── Present (LM v2.2 §D — parameter-recovered) ──────────────────────────────
// G2: reads precomputed values only when scope is degenerate; recomputes
// projection on filtered node set when scope is non-degenerate.
//
// lm-v2-2-shot2: parameter recovery per LM v2.2 §D. v2.1 single-arg
// `getPresentState(userId)` is the degenerate parameterization
// `present({scope: {user: userId}, axes: PRESENT_DEFAULTS, limit: PRESENT_LIMIT_MAX})`.
// Same primitive, same owner, same projection contract — the entry shape is
// surfaced; the v2.1 cache lookup body is reused per brief §B.
//
// lm-v2-2-shot3 (LMA21 projection-side filter):
//   * Degenerate scope `{user: U}` (with no other dimensions): cache hits the
//     precomputed _userStates[U].presentState — V4 degenerate-equivalence
//     preserved.
//   * Non-degenerate scope (project set, multi-dimension): D-CACHE-INVALIDATION-
//     CONSERVATIVE — recompute projection from filtered node set every call.
//     Cache structure (keyed by userId) is preserved; non-degenerate calls
//     bypass the cache. Optimization deferred until usage warrants it.
//   * Empty scope `{}`: returns empty projection (no scope = no candidates).
//     Future expansion may interpret empty as "all in scope" (universal); the
//     conservative empty-projection rule preserves the safe-default semantics
//     that a missing scope returns nothing rather than everything.
//
// Filter precedes scoring per LM v2.2 §C — out-of-scope nodes are excluded
// from the candidate set BEFORE computePresentState runs.
//
// Per D-PRESENTSTATE-BODY-V21: PresentState return body remains v2.1 shape
// (`{statements: PresentStateStatement[]}`). v2.2 §D body lands in Shot 4
// alongside the 8-axis algorithms.
//
// Per D-INTERNAL-RENAME: R3 contract imports this as `_present` (alias only;
// no separate internal function — replacement, not duplication).

// lm-v2-2-shot4 (D-AXIS-DEFAULT-WEIGHTS): default weights distributed
// graph-balanced — topology + energy weighted higher (stable structural
// signals); affinity axes weighted lower (depend on caller context that may
// be sparse); recency + chronology weighted moderate. All sum to 1.0 for
// stable ranked-score interpretation. Seed values; empirical tuning post-shot4.
//
// Default configs declare the per-axis tuning surface — recency carries
// halfLifeMs (override of MEMORY_CONFIG.RECENCY_HALF_LIFE); other axes carry
// empty configs that callers populate (modeAffinity.activeMode,
// programAffinity.activeProgram, lineageProximity.activeChain).

export const PRESENT_DEFAULTS: AxisSet = {
  active: [
    'topology', 'recency', 'chronology', 'projectAffinity',
    'modeAffinity', 'programAffinity', 'lineageProximity', 'energy',
  ],
  weights: new Map<AxisId, number>([
    ['topology',         0.20],
    ['recency',          0.15],
    ['chronology',       0.10],
    ['projectAffinity',  0.10],
    ['modeAffinity',     0.10],
    ['programAffinity',  0.05],
    ['lineageProximity', 0.10],
    ['energy',           0.20],
    // sum = 1.00
  ]),
  configs: new Map<AxisId, AxisConfig>([
    ['topology',         {}],
    ['recency',          { halfLifeMs: MEMORY_CONFIG.RECENCY_HALF_LIFE }],
    ['chronology',       {}],
    ['projectAffinity',  {}],
    ['modeAffinity',     {}],   // populated by caller — { activeMode: <FrameworkMode> }
    ['programAffinity',  {}],   // populated by caller — { activeProgram: <id> }
    ['lineageProximity', {}],   // populated by caller — { activeChain: NodeId[], maxHops: number }
    ['energy',           {}],
  ]),
}

export function present(params: {
  scope: ScopeFilter
  axes:  AxisSet
  limit: number
}): PresentState {
  const userId = params.scope.user
  const otherScope = params.scope.project !== undefined

  // Degenerate path: scope has user only (project not set). Cache hit.
  // V4 (LM v2.2 §G): degenerate parameterization equivalent to v2.1 getPresentState(U).
  if (userId && !otherScope) {
    const state = _userStates.get(userId)
    // lm-v2-2-shot4: v2.2 §D empty shape on cache miss.
    // lm-v2-3-shot2 (LMA27): conflictGroups annotation initialized empty.
    return state?.presentState ?? {
      projected:      [],
      axisScores:     new Map(),
      scopeContext:   params.scope,
      conflictGroups: [],
    }
  }

  // Non-degenerate path: scope has multiple dimensions, project-only, or is
  // empty (universal per nodeInScope). D-CACHE-INVALIDATION-CONSERVATIVE:
  // recompute on every non-degenerate call. Filter precedes scoring per
  // LM v2.2 §C.
  const filteredUserGraph: MemGraph = { nodes: new Map(), edges: new Map() }
  const userStatesToScan = userId
    ? (_userStates.has(userId) ? [_userStates.get(userId)!] : [])
    : Array.from(_userStates.values())
  for (const state of userStatesToScan) {
    for (const [id, node] of state.graph.nodes) {
      if (nodeInScope(node, params.scope)) {
        filteredUserGraph.nodes.set(id, node)
        const out = state.graph.edges.get(id)
        if (out) filteredUserGraph.edges.set(id, out)
      }
    }
  }

  // Global graph also subject to scope filter. Global nodes carry 'global'
  // and pass any filter per nodeInScope universal-global rule.
  const filteredGlobalGraph: MemGraph = { nodes: new Map(), edges: new Map() }
  for (const [id, node] of _globalGraph.nodes) {
    if (nodeInScope(node, params.scope)) {
      filteredGlobalGraph.nodes.set(id, node)
      const out = _globalGraph.edges.get(id)
      if (out) filteredGlobalGraph.edges.set(id, out)
    }
  }

  // Recompute projection from filtered node set.
  // Note: arms inputs are not scope-filtered this shot — arm membership is a
  // derivation over nodes (LMA18 reconstructibility); scope-aware arms are
  // recomputable but deferred until 8-axis algorithms formalize the
  // dependency in Shot 4.
  // lm-v2-2-shot4: pass through scope + axes + limit from caller params.
  const userArms = userId ? (_userStates.get(userId)?.arms ?? []) : []
  return computePresentState(
    { user: filteredUserGraph, global: filteredGlobalGraph },
    userArms,
    _globalArms,
    params.scope,
    params.axes,
    params.limit,
  )
}

// ─── Lineage (LM v2.2 §F — real impl) ────────────────────────────────────────
// lm-v2-2-shot3: replaces D-LINEAGE-STUB with real traversal.
//
// Strategy: BFS (D-TRAVERSAL-STRATEGY). BFS chosen over DFS for `depth-reached`
// precision under depth bounds — BFS expands the frontier level-by-level so
// the depth-bound cutoff is a clean termination criterion; DFS would require
// path-depth tracking and re-entry handling that complicates the cycle-vs-
// depth termination accounting. Cleaner BFS body offsets the lack of
// pre-existing traversal helper (memory-traverse.ts is propagation-shaped, not
// pure graph traversal — building the BFS inline is small + readable).
//
// Direction:
//   'descendant' — follow MemEdge where edge.fromId == currentNode.id
//                  (graph.edges keyed by fromId; outgoing edges natural).
//   'ancestor'   — follow MemEdge where edge.toId == currentNode.id
//                  (no reverse-index in MemGraph; build inline ancestor lookup
//                  by sweeping all edges once).
//   'both'       — union of ancestor + descendant from start.
//
// Depth: max edge-hops from start. Nodes at exactly depth are included; edges
//        crossing into depth+1 are not followed.
//
// edgeFilter: only edges with edge.primitiveType ∈ edgeFilter are traversed.
//             Empty set ⇒ traverse no edges (returns {start, [start], [], 'no-more-edges'}).
//             Note: edge.primitiveType is `EdgePrimitiveType | null`; null-typed
//             edges are never in edgeFilter (D-EDGEKIND-NULL-EXCLUDE).
//
// Cycle termination: visited set tracks NodeIds already in result graph; a
//                    candidate already in visited terminates that branch with
//                    'cycle-truncated'.
//
// Scope termination: candidate node fails nodeInScope(node, scope) → branch
//                    terminates with 'scope-boundary'. LMA21 scope filter at
//                    projection per LM v2.2 §F.
//
// terminationReason precedence (D-LINEAGE-PRECEDENCE):
//   'scope-boundary' > 'cycle-truncated' > 'depth-reached' > 'no-more-edges'
// Rationale: scope is structural (LMA21 invariant); a scope cut indicates the
// caller's filter constrained the result more than the structural traversal
// did, so it's the most informative cause. Cycle next — structural property
// of the graph (LMA10 + V5). Depth next — caller-supplied bound that
// terminated otherwise-walkable branches. 'no-more-edges' last — the trivial
// "ran out of work" terminator. Multi-branch traversals report the
// highest-precedence cause that occurred at any branch.
//
// Lineage scope filter requires a ScopeFilter parameter — not in the current
// signature. Per LM v2.2 §F: "Scope-filtering applies per LMA21: out-of-scope
// nodes never enter the LineageGraph." This shot derives scope from the start
// node's stamped scope tags — lineage is anchored to start, so the start's
// scope is the natural projection scope. R3 may later thread an explicit
// scope param if multi-anchor lineage is needed.

export function lineage(
  start:      NodeId,
  direction:  'ancestor' | 'descendant' | 'both',
  depth:      number,
  edgeFilter: EdgeKindSet,
): LineageGraph {
  // Locate start node — search user states then global graph.
  let startNode: MemNode | undefined
  for (const state of _userStates.values()) {
    const found = state.graph.nodes.get(start)
    if (found) { startNode = found; break }
  }
  if (!startNode) startNode = _globalGraph.nodes.get(start)
  if (!startNode) {
    // Start not found — return graph containing only the requested start id
    // with empty traversal. Conservative: caller asked for lineage anchored
    // at a node we don't have in memory.
    return { start, nodes: [start], edges: [], terminationReason: 'no-more-edges' }
  }

  // Derive scope filter from start node's stamped scope tags. Honors LMA21:
  // every node's scope is filterable. Build a predicate that accepts:
  //   - any node tagged 'global' (universal global rule, per nodeInScope)
  //   - any node sharing at least one tag with start
  const startTags = startNode.scope
  const scopeAccepts = (n: MemNode): boolean => {
    if (n.scope.has('global')) return true
    if (startTags.has('global')) return true  // start is global → all accepted
    for (const t of n.scope) if (startTags.has(t)) return true
    return false
  }

  // Collect candidate graph(s) — start's scope determines whether we walk user
  // graph(s), global graph, or both. Walk every loaded graph; scopeAccepts is
  // the gate.
  const allGraphs: MemGraph[] = []
  for (const state of _userStates.values()) allGraphs.push(state.graph)
  allGraphs.push(_globalGraph)

  // Build candidate node lookup + descendant edges + ancestor edges.
  const allNodes = new Map<NodeId, MemNode>()
  const outgoing = new Map<NodeId, MemEdge[]>()
  const incoming = new Map<NodeId, MemEdge[]>()
  for (const g of allGraphs) {
    for (const [id, n] of g.nodes) {
      if (!allNodes.has(id)) allNodes.set(id, n)
    }
    for (const [fromId, edges] of g.edges) {
      const accumOut = outgoing.get(fromId) ?? []
      accumOut.push(...edges)
      outgoing.set(fromId, accumOut)
      for (const e of edges) {
        const accumIn = incoming.get(e.toId) ?? []
        accumIn.push(e)
        incoming.set(e.toId, accumIn)
      }
    }
  }

  // edgeFilter: empty set ⇒ no traversal. Return start-only.
  if (edgeFilter.size === 0) {
    return { start, nodes: [start], edges: [], terminationReason: 'no-more-edges' }
  }

  // BFS frontier: queue of {nodeId, depthFromStart}. visited set tracks
  // already-emitted node ids. Edges accumulate per emitted node (deduped by
  // (fromId, toId) pair).
  type Frontier = { nodeId: NodeId; depthFromStart: number }
  const visited = new Set<NodeId>()
  const resultNodes: NodeId[] = []
  const resultEdges: { fromId: NodeId; toId: NodeId }[] = []
  const queue: Frontier[] = [{ nodeId: start, depthFromStart: 0 }]
  visited.add(start)
  resultNodes.push(start)

  // Termination tracking — record every cause that fires across branches.
  // Per D-LINEAGE-PRECEDENCE, dominant cause is highest-precedence one fired.
  let scopeBoundaryFired = false
  let cycleTruncatedFired = false
  let depthReachedFired = false

  while (queue.length > 0) {
    const cur = queue.shift()!

    // Depth bound: edges from a node at depth=D would land neighbors at D+1.
    // If cur.depthFromStart === depth, we don't expand (record depth-reached).
    if (cur.depthFromStart >= depth) {
      depthReachedFired = true
      continue
    }

    // Collect candidate edges per direction.
    const candidates: { edge: MemEdge; nextId: NodeId }[] = []
    if (direction === 'descendant' || direction === 'both') {
      const out = outgoing.get(cur.nodeId) ?? []
      for (const e of out) candidates.push({ edge: e, nextId: e.toId })
    }
    if (direction === 'ancestor' || direction === 'both') {
      const inb = incoming.get(cur.nodeId) ?? []
      for (const e of inb) candidates.push({ edge: e, nextId: e.fromId })
    }

    for (const { edge, nextId } of candidates) {
      // edgeFilter: only follow edges whose primitiveType is in the set.
      // null-typed edges (learning sub-ops) are never in EdgeKindSet
      // (D-EDGEKIND-NULL-EXCLUDE).
      if (edge.primitiveType === null) continue
      if (!edgeFilter.has(edge.primitiveType as EdgePrimitiveType)) continue

      // Cycle: nextId already visited.
      if (visited.has(nextId)) {
        cycleTruncatedFired = true
        continue
      }

      // Scope filter (LMA21 §F): out-of-scope nodes never enter LineageGraph.
      const nextNode = allNodes.get(nextId)
      if (!nextNode || !scopeAccepts(nextNode)) {
        scopeBoundaryFired = true
        continue
      }

      visited.add(nextId)
      resultNodes.push(nextId)
      resultEdges.push({ fromId: edge.fromId, toId: edge.toId })
      queue.push({ nodeId: nextId, depthFromStart: cur.depthFromStart + 1 })
    }
  }

  // terminationReason precedence per D-LINEAGE-PRECEDENCE.
  let terminationReason: LineageGraph['terminationReason']
  if (scopeBoundaryFired)        terminationReason = 'scope-boundary'
  else if (cycleTruncatedFired)  terminationReason = 'cycle-truncated'
  else if (depthReachedFired)    terminationReason = 'depth-reached'
  else                            terminationReason = 'no-more-edges'

  return {
    start,
    nodes: resultNodes,
    edges: resultEdges,
    terminationReason,
  }
}

// ─── Get graph stats (for vital signs) ────────────────────────────────────────
// getGraph(): returns global graph (boot-time, shared read-only)
// getUserGraph(): returns per-user graph for vital signs (Amendment 3)

export function getGraph(): MemGraph {
  return _globalGraph
}

export function getUserGraph(userId: string): MemGraph {
  const state = _userStates.get(userId)
  return state?.graph ?? { nodes: new Map(), edges: new Map() }
}

export function getArms(): MemArm[] {
  return _globalArms
}

// A3: typed boundary — per-user arms for cross-slice graph read surface.
// w3-17-contract-ext: new accessor, mirrors getUserGraph pattern.
export function getUserArms(userId: string): MemArm[] {
  const state = _userStates.get(userId)
  return state?.arms ?? []
}

export function getDominanceMap(): Map<NodeId, DominanceEntry> {
  return _globalDominanceMap
}

export function setDominanceMap(map: Map<NodeId, DominanceEntry>): void {
  _globalDominanceMap = map
}

// ─── Internal: commit mutation + touch traversed nodes ────────────────────────
// Amendment 3: +userId param, passed to all R4 persist calls (A4).

async function commitAndUpdate(
  mutation: GraphMutation,
  changedNodeIds: Set<NodeId>,
  timestamp: number,
  userId: string,
  userGraph: MemGraph,
): Promise<void> {
  const persistResult = await persistMutations(mutation, userId)
  if (!persistResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.persist-failed',
      error: persistResult.error.message,
      timestamp: new Date().toISOString(),
    }))
    return
  }

  const touchResult = await touchTraversedNodes(Array.from(changedNodeIds), timestamp, userId)
  if (!touchResult.ok) {
    console.error(JSON.stringify({
      level: 'error', event: 'memory.traversal.touch-failed',
      error: touchResult.error.message,
      timestamp: new Date().toISOString(),
    }))
  }

  // Update in-memory last_traversed
  for (const nodeId of changedNodeIds) {
    const node = userGraph.nodes.get(nodeId)
    if (node) {
      node.lastTraversed = timestamp
      userGraph.nodes.set(nodeId, node)
    }
  }

  // Emit node-created events for new nodes
  for (const newNode of mutation.nodeCreates) {
    await emitEvent({
      type: MEMORY_EVENTS.NODE_CREATED,
      payload: { nodeId: newNode.id },
      slice: 'F-memory',
    })
  }

  // Emit source-pruned events
  for (const nodeId of mutation.sourcePrunes) {
    await emitEvent({
      type: MEMORY_EVENTS.SOURCE_PRUNED,
      payload: { nodeId },
      slice: 'F-memory',
    })
  }
}
