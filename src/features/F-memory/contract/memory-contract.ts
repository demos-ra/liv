// @liv-standard v1.5.1
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, w3-17-contract-ext, w3-20-admin-write, 6.1-global-seed, 4b-nodeid-propagation, lm-v2-2-shot2, lm-v2-2-shot3, lm-v2-2-shot5-fix-2
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-ATOM   GlobalSeedNode    F-memory/R0 (memory-seed-data)
//   W-ATOM   ScopeFilter       F-memory/R0 (memory-types) — LM v2.2 §C
//   W-ATOM   AxisSet           F-memory/R0 (memory-types) — LM v2.2 §D
//   W-ATOM   LineageGraph      F-memory/R0 (memory-types) — LM v2.2 §F
//   W-ATOM   EdgeKindSet       F-memory/R0 (memory-types) — LM v2.2 §F
//   W-ATOM   PRESENT_DEFAULTS  F-memory/R2 (memory-service) — LM v2.2 §D
//   W-ATOM   PRESENT_LIMIT_MAX F-memory/R0 (memory-types)   — LM v2.2 §D
//   W-ATOM   ScopeTagSet       F-memory/R0 (memory-types) — LMA21, lm-v2-2-shot3
//   W-FN     stampScope        F-memory/R2 (memory-service) — LMA21 helper, re-exported for cross-slice
// wires-out:
//   W-HOOK  traverse           →  F-chat/R4 (lm-io)
//   W-HOOK  Present            →  F-chat, F-codec, F-plan, app/admin (LM v2.2 §D parameter-recovered; replaces v2.1 getPresentState)
//   W-HOOK  Lineage            →  F-memory R2 real impl (LM v2.2 §F; D-LINEAGE-STUB closed in shot3)
//   W-HOOK  onBoot             →  F-event-system/R2 (startup)
//   W-HOOK  reloadGlobalGraph  →  app/R4 (seed route)
//   W-HOOK  getGlobalGraph     →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getUserGraph       →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getGlobalArms      →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  getUserArms        →  F-codec/R2 (codec-orchestrate)
//   W-HOOK  seedGlobalNode     →  F-codec/R2 (codec-admin-actions)
//   W-HOOK  removeGlobalNode   →  F-codec/R2 (codec-admin-actions)
//   W-HOOK  seedAndTraverseGlobal → F-codec/R2 (codec-admin-actions)
// deps:
//   R0  ../config/memory-types
//   R0  ../config/memory-seed-data
//   R2  ../app/memory-service
//   R2  ../app/memory-admin-service
// validated:  pending

// Living Memory v1.1 — public contract.
// R3: thin wire. No logic. No DB. No physics.
// §20: two surfaces for F-chat integration:
//   traverse(text, userId, options?) — real-time traversal for specific query context
//   Present({scope, axes, limit})    — projection per LM v2.2 §D (replaces v2.1 getPresentState)
// All other slices import from here — never from app/, domain/, exec/.
//
// lm-v1.1 changes (Amendment 3):
//   traverse: +userId param (A6: scoped traversal)
//   getPresentState: +userId param (A6: per-user present state)
//   F-chat will break at compile — intentional. F-chat must pass userId through.
//
// w3-17-contract-ext:
//   A3: typed boundary — graph read surface for cross-slice consumption (F-codec decode/routing).
//   getGlobalGraph(), getUserGraph(), getGlobalArms(), getUserArms() — thin wrappers over R2 accessors.
//
// w3-20-admin-write:
//   A3: typed boundary — admin write surface for global graph management.
//   seedGlobalNode() — thin wrapper over R2 admin service (userId: null).
//   removeGlobalNode() — thin wrapper over R2 admin service (cascade delete).
//
// lm-v2-2-shot2 (LM v2.2):
//   §D parameter recovery: getPresentState(userId) → Present({scope, axes, limit}). Same primitive,
//   surfaced parameters. PresentState return body unchanged this shot per option (γ) /
//   D-PRESENTSTATE-BODY-V21; Shot 4 lands the §D body alongside axis algorithms.
//   §F net-new: Lineage(start, direction, depth, edgeFilter) → LineageGraph. R2 stub this
//   shot per D-LINEAGE-STUB; full traversal Shot 3/4.
//   D-INTERNAL-RENAME: R2 export `present` imported here as `_present` (alias-rename, no
//   separate internal function).
//
// lm-v2-2-shot3 (LMA21 wiring + Lineage real impl):
//   LMA21 stamp+filter contract live: persistence-side stamping at every node-write;
//   projection-side filter at present() and lineage(). Cache invalidation conservative
//   per D-CACHE-INVALIDATION-CONSERVATIVE — degenerate user-only scope hits cache;
//   non-degenerate scope recomputes from filtered nodes. D-LMA21-DEFER closes.
//   Lineage R2 stub replaced by real BFS traversal honoring direction/depth/edgeFilter,
//   cycle termination, and scope filter. D-LINEAGE-STUB closes. D-LINEAGE-PRECEDENCE
//   records terminationReason precedence: scope-boundary > cycle-truncated > depth-reached
//   > no-more-edges. D-LIAISON-STRIKE closes (R4 liaisons replaced by R3 cross-slice
//   re-exports of R0 atoms). stampScope re-exported from R3 for F-codec admin sites.

import type {
  TraversalResult,
  TraversalOptions,
  PresentState,
  MemGraph,
  MemArm,
  MemNode,
  MemEdge,
  // lm-v2-2-shot2: LM v2.2 atoms at the R3 surface
  ScopeFilter,
  AxisSet,
  LineageGraph,
  EdgeKindSet,
} from '../config/memory-types'
import { PRESENT_LIMIT_MAX } from '../config/memory-types'
import type { Result, NodeId } from '@/core/types/primitives'

import {
  runTraversal,
  // lm-v2-2-shot2 (D-INTERNAL-RENAME): R2 export `present` imported as `_present`.
  // Alias-rename per option (γ) / D-INTERNAL-RENAME — single internal, two
  // names across the R2/R3 boundary. v2.1 `getPresentState as _getPresentState`
  // retired.
  present as _present,
  lineage as _lineage,
  PRESENT_DEFAULTS,
  onBoot as _onBoot,
  reloadGlobalGraph as _reloadGlobalGraph,
  getGraph as _getGraph,
  getUserGraph as _getUserGraph,
  getArms as _getArms,
  getUserArms as _getUserArms,
} from '../app/memory-service'

import {
  seedGlobalNode as _seedGlobalNode,
  removeGlobalNode as _removeGlobalNode,
  seedAndTraverseGlobal as _seedAndTraverseGlobal,
} from '../app/memory-admin-service'

import type { GlobalSeedNode } from '../config/memory-seed-data'

// ─── traverse ─────────────────────────────────────────────────────────────────
// §20: real-time traversal for specific query context.
// Also recomputes Present State as side effect.
// Amendment 3: +userId — scoped to per-user graph (A6).
//
// Usage per §20 flow:
//   1. Present({scope: {user: userId}, axes: PRESENT_DEFAULTS, limit: PRESENT_LIMIT_MAX}) → inject as system context
//   2. traverse(userMessage, userId, { returnActivation: true })  → query-specific context
//   3. Both injected into LLM context
//   4. LLM responds
//   5. traverse(llmResponse, userId)        → write path, no activation returned

export async function traverse(
  text: string,
  userId: string,
  options?: TraversalOptions,
): Promise<Result<TraversalResult | null>> {
  return runTraversal(text, userId, options)
}

// ─── Present (LM v2.2 §D) ─────────────────────────────────────────────────────
// §20: project graph state for cross-slice consumption (system prompts,
// codec context, plan composition).
// G2: reads precomputed values only — never triggers recomputation.
//
// lm-v2-2-shot2 — D-PRESENT-OPTIONAL-PARAMS:
// R3 exposes Present with one optional-params signature. R3 owns canonical-
// defaults binding (PRESENT_DEFAULTS + PRESENT_LIMIT_MAX from R0). Callers
// pass any subset of params; R3 fills the rest:
//   Present()                                   canonical zero-arg form;
//                                               v2.1 degenerate parameterization
//                                               survives as the literal zero-
//                                               arg call.
//   Present({scope: {user: U}})                 partial — scope only.
//   Present({scope: ..., axes: ..., limit: ...}) full-param form.
//
// Default-resolution lives at R3 (the contract layer that owns the
// PRESENT_DEFAULTS + PRESENT_LIMIT_MAX binding). R4 sites pass any subset
// they have in scope (typically `{scope: {user: deps.userId}}`); R3 fills
// axes + limit. Constants are not duplicated across R-layer boundaries.
//
// Per option (γ) / D-PRESENTSTATE-BODY-V21: PresentState return body is the
// v2.1 shape this shot. v2.2 §D body lands in Shot 4 with axis algorithms;
// canonical name preserved.

export function Present(): PresentState
export function Present(params: {
  scope?: ScopeFilter
  axes?:  AxisSet
  limit?: number
}): PresentState
export function Present(
  params?: { scope?: ScopeFilter; axes?: AxisSet; limit?: number },
): PresentState {
  return _present({
    scope: params?.scope ?? {},   // empty ScopeFilter — open per LM v2.2 §C
    axes:  params?.axes  ?? PRESENT_DEFAULTS,
    limit: params?.limit ?? PRESENT_LIMIT_MAX,
  })
}

// ─── Lineage (LM v2.2 §F — real impl per shot3) ──────────────────────────────
// lm-v2-2-shot3: D-LINEAGE-STUB closes — R2 lineage() is the real BFS impl
// honoring direction/depth/edgeFilter, cycle termination (V5), and scope
// filter (V6). terminationReason precedence per D-LINEAGE-PRECEDENCE:
// scope-boundary > cycle-truncated > depth-reached > no-more-edges.

export function Lineage(
  start:      NodeId,
  direction:  'ancestor' | 'descendant' | 'both',
  depth:      number,
  edgeFilter: EdgeKindSet,
): LineageGraph {
  return _lineage(start, direction, depth, edgeFilter)
}

// ─── onBoot ───────────────────────────────────────────────────────────────────
// Called by F-event-system/app/startup.ts on server start.
// Loads global graph only. Per-user graphs lazy-loaded on first traversal.

export async function onBoot(): Promise<void> {
  return _onBoot()
}

// ─── reloadGlobalGraph ────────────────────────────────────────────────────────
// 6.1-global-seed: force-reload global graph from DB after batch seed.
// Bypasses onBoot() idempotency guard. Admin-only.
export async function reloadGlobalGraph(): Promise<void> {
  return _reloadGlobalGraph()
}

// ─── Graph Read Surface (w3-17-contract-ext) ──────────────────────────────────
// A3: typed boundary — exposing graph read surface for cross-slice consumption.
// F-codec decode needs the full graph (ScopedGraphSet) and arms to classify
// structures. These are thin R3 wrappers over existing R2 accessors.
// No mutations — read-only by design.

// Global graph — loaded at boot, shared read-only.
export function getGlobalGraph(): MemGraph {
  return _getGraph()
}

// Per-user graph — lazy-loaded on first traversal.
export function getUserGraph(userId: string): MemGraph {
  return _getUserGraph(userId)
}

// Global arms — community structure across all users.
export function getGlobalArms(): MemArm[] {
  return _getArms()
}

// Per-user arms — community structure within user's graph.
export function getUserArms(userId: string): MemArm[] {
  return _getUserArms(userId)
}

// ─── Admin Write Surface (w3-20-admin-write) ──────────────────────────────────
// A3: typed boundary — admin-only write path for global graph management.
// Thin R3 wrappers over R2 admin service. Same pattern as traverse → runTraversal.

// Seed a global node with optional edges. Admin-authored knowledge.
export async function seedGlobalNode(
  node: Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry'>,
  edges: MemEdge[],
): Promise<Result<void>> {
  return _seedGlobalNode(node, edges)
}

// Remove a global node and all connected edges. Cascade delete.
// 4b-nodeid-propagation: scalar nodeId typed NodeId. Upstream callers
// (HTTP route handlers) brand raw body strings `as NodeId` at the external-origin
// ingress site per amended Confirm 3 — this R3 signature receives NodeId and
// passes through.
export async function removeGlobalNode(nodeId: NodeId): Promise<Result<void>> {
  return _removeGlobalNode(nodeId)
}

// Batch seed + self-traversal. Phase 6.1.
// Caller must call reloadGlobalGraph() after completion to reload global graph.
export async function seedAndTraverseGlobal(
  nodes: GlobalSeedNode[],
): Promise<Result<{ seeded: number; traversed: number }>> {
  return _seedAndTraverseGlobal(nodes)
}

// ─── Re-exports for consumers ─────────────────────────────────────────────────
// A3: atoms only cross slice boundaries.
export type {
  MemGraph,
  MemArm,
  MemNode,
  MemEdge,
  ScopedGraphSet,
  PresentState,
  TraversalResult,
  TraversalOptions,
  MLayer,
  EdgePrimitiveType,
  // lm-v2-2-shot2: LM v2.2 atoms re-exported for cross-slice consumption
  ScopeFilter,
  AxisSet,
  AxisId,
  AxisConfig,
  LineageGraph,
  EdgeKindSet,
} from '../config/memory-types'

// lm-v2-2-shot2: PRESENT_DEFAULTS + PRESENT_LIMIT_MAX re-exported as values
// (consumers update v2.1 getPresentState(userId) call sites to
// Present({scope: {user: userId}, axes: PRESENT_DEFAULTS, limit: PRESENT_LIMIT_MAX})).
export { PRESENT_DEFAULTS } from '../app/memory-service'
export { PRESENT_LIMIT_MAX } from '../config/memory-types'

// lm-v2-2-shot3: stampScope helper re-exported for cross-slice node-construction
// sites (F-codec admin actions). Keeps the LMA21 token-format ('user:'+id,
// 'project:'+id, 'global') as a single source of truth at F-memory R2.
export { stampScope } from '../app/memory-service'

export type { GlobalSeedNode, GlobalSeedEdge } from '../config/memory-seed-data'

// lm-v2-2-shot5-fix-2 (F3 closure): re-export R0 values consumed cross-slice
// per LIV-Standard A2 (R3 is the public surface; cross-slice access via R3 only).
// GLOBAL_SEED_NODES — global graph seed dataset, consumed by app/api/admin/global-graph/verify route.
// MEMORY_EVENTS — F-memory event-name constants, consumed by F-event-system/config/event-schema.ts barrel.
export { GLOBAL_SEED_NODES } from '../config/memory-seed-data'
export { MEMORY_EVENTS } from '../config/memory-events'
