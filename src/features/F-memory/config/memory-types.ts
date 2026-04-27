// @liv-standard v1.5.1
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, 4b-nodeid-propagation, lm-v2-2-shot2, lm-v2-2-shot3, lm-v2-2-shot4, lm-v2-2-shot5-fix-2
// slice:      F-memory
// layer:      R0
// wires-in:
//   W-ATOM  NodeId            core/R5 (primitives)
//   W-ATOM  UserId            core/R5 (primitives)
//   W-ATOM  ProjectId         core/R5 (primitives)
// wires-out:
//   W-ATOM  MemNode           →  F-memory/*
//   W-ATOM  MemEdge           →  F-memory/*
//   W-ATOM  MemGraph          →  F-memory/*
//   W-ATOM  MLayer            →  F-memory/*
//   W-ATOM  PresentState      →  F-chat/R4 (lm-io); body retained at v2.1 shape per LM v2.2 §D natural deferral (axis algorithms in Shot 4)
//   W-ATOM  GraphMutation     →  F-memory/*
//   W-ATOM  TraversalResult   →  F-memory/*
//   W-ATOM  MemArm            →  F-memory/*
//   W-ATOM  DominanceEntry    →  F-memory/*
//   W-ATOM  MemoryVitalSigns  →  F-memory/R3
//   W-ATOM  EdgePrimitiveType →  F-memory/*
//   W-ATOM  GraphScope        →  F-memory/*
//   W-ATOM  ScopedGraphSet    →  F-memory/*
//   W-ATOM  ScopeFilter       →  F-memory/R3 (Present, Lineage entry shape per LM v2.2 §C, §D)
//   W-ATOM  ScopeTagSet       →  F-memory/* (per-node stamped scope tags per LMA21, lm-v2-2-shot3)
//   W-ATOM  AxisId            →  F-memory/R3 (Present axes per LM v2.2 §E)
//   W-ATOM  AxisConfig        →  F-memory/* (per-axis config; F-memory authors shape in Shot 4)
//   W-ATOM  AxisSet           →  F-memory/R3 (Present axis-set per LM v2.2 §D)
//   W-ATOM  EdgeKindSet       →  F-memory/R3 (Lineage edge filter per LM v2.2 §F)
//   W-ATOM  LineageGraph      →  F-memory/R3 (Lineage return atom per LM v2.2 §F)
//   W-ATOM  MemNodeRow        →  F-memory/R4 (raw row shape returned by loadAllNodes; lm-v2-2-shot5-fix-2)
// deps:
//   R5  @/core/types/primitives
// validated:  pending
//
// lm-v2-2-shot2 (LM v2.2 §C, §D, §E, §F): atom-shape declarations.
//   Net-new atoms: ScopeFilter, AxisId, AxisConfig, AxisSet, EdgeKindSet, LineageGraph.
//   Net-new constants: PRESENT_LIMIT_MAX (reused from MEMORY_CONFIG.PRESENT_STATE_MAX = 20 per D-LIMIT-MAX).
//   PresentState body: unchanged this shot per D-PRESENTSTATE-BODY-V21 (option γ — natural
//   deferral; v2.2 §D return body lands in Shot 4 with axis algorithms; canonical name preserved).

// Living Memory v1.1 — all domain types.
// A6: declared at R0. Imports NodeId from core/R5 primitives (AK-REF brand).
// MA5: no NodeType — layer is computed from connectivity, never assigned.
// MA1: no decay constants — conservation + rebalancing.
// MA2: one action (traversal) — no separate read/write types.
//
// lm-v1.1 amendments:
//   Amendment 1: EdgePrimitiveType + MemEdge gains primitiveType, createdAt, userId
//   Amendment 3: userId on MemNode, MemArm; GraphScope, ScopedGraphSet
//   Amendment 4: primitiveType on TraversalOptions
//   Amendment 2: LABEL_REUSE_THRESHOLD in MEMORY_CONFIG
//
// 4b-nodeid-propagation:
//   All node-id-shaped fields (MemNode.id, MemEdge.fromId/toId, MemArm.nodeIds,
//   GraphMutation node-id carriers, DominanceEntry.nodeId, BindingResult,
//   TraversalResult.topNodes[].nodeId, ActivationMap, MemGraph.{nodes,edges})
//   typed as NodeId (AK-REF brand from core/R5 primitives). A3: typed boundary
//   at every R0 atom that carries a node identifier.

import type { NodeId, UserId, ProjectId } from '@/core/types/primitives'
import type { EdgeRef } from '@/core/types/living-memory.types'

// ─── M-Layer ──────────────────────────────────────────────────────────────────
// Five layers. Numeric for comparison: M0=0 (deepest) .. M4=4 (shallowest).
// Layer is always computed by computeLayer(), never stored as source of truth.
// cached_layer in DB is a cache only — recomputed on traversal.

export type MLayer = 0 | 1 | 2 | 3 | 4

export const M0_IDENTITY  = 0 as const satisfies MLayer
export const M1_PURPOSE   = 1 as const satisfies MLayer
export const M2_KNOWLEDGE = 2 as const satisfies MLayer
export const M3_CONTEXT   = 3 as const satisfies MLayer
export const M4_INPUT     = 4 as const satisfies MLayer

// ─── Edge Primitive Type (Amendment 1) ────────────────────────────────────────
// A6: declared at R0. Five traversal primitives that give edges semantic meaning.
// null = pre-v1.1 edge or learning sub-op (not a direct primitive).

export type EdgePrimitiveType = 'anchor' | 'relate' | 'restructure' | 'reinforce' | 'suppress'

// ─── Node ─────────────────────────────────────────────────────────────────────
// A unit of memory. No type tag. Layer computed from connectivity depth.
// source_text: original input text. Populated at M4/M3, pruned on M3→M2 transition.
// userId (Amendment 3): null = global graph, string = per-user graph. A6: scope at origin.

export type MemNode = {
  id:              NodeId
  userId:          string | null    // null = global, string = per-user (Amendment 3, A6)
  // lm-v2-2-shot3 (LMA21): scope tags stamped at persistence per LM v2.2 §C.
  // Token format per D-SCOPE-TAG-FORMAT: 'user:<userId>' | 'project:<projectId>' | 'global'.
  // Total stamping per LMA21: every node carries a non-empty scope tag set.
  // Boot-time backward-compat per D-MEMNODE-MIGRATION: nodes loaded without
  // the field derive {'global'} when userId === null, {'user:'+userId} when set.
  // userId field retained additively (v2.1 carry) — D-USERID-CARRY.
  scope:           ScopeTagSet
  content:         string           // semantic label or summary
  embedding:       number[] | null  // VECTOR(1536), null until encoded
  sourceText:      string | null    // original input, pruned at M3→M2. MA3: structural position carries meaning.
  createdAt:       number           // unix ms
  lastTraversed:   number | null    // unix ms, updated on each traversal touch
  cachedLayer:     MLayer           // cache of computeLayer() result
  cachedClosure:   number           // cycle participation ratio, updated incrementally
  cachedAsymmetry: number           // non-reciprocal weight differential
}

// ─── MemNodeRow (lm-v2-2-shot5-fix-2: G1 Move-to-R2) ─────────────────────────
// Raw DB-row shape for a node. Lacks the LMA21 scope field, which is a
// domain-derived projection added during R2 hydration (per LIV-Standard T1.1:
// R4 = "DB queries, external I/O only"; domain transformation lives at R2).
//
// R4 (memory-repository.loadAllNodes) returns Map<NodeId, MemNodeRow>. R2
// (memory-service boot-load paths) iterates rows through ensureNodeScopeStamped
// to produce the full MemNode atom. This keeps scope-stamping logic out of R4.
//
// Closes G1 (LMA21 V2 violation at memory-repository.ts) and D-G1-INLINE-STAMP
// (patch3 inline stamp at R4 — no longer needed once stamping moves to R2).

export type MemNodeRow = Omit<MemNode, 'scope'>

// ─── Scope tag set (LMA21, lm-v2-2-shot3) ─────────────────────────────────────
// Per LM v2.2 §C: scope is a set of tags carried on a node (not a separate type
// or partition of the graph). Each token is a string in one of the formats per
// D-SCOPE-TAG-FORMAT:
//   'user:<userId>'      — per-user scope (e.g. 'user:demos_ra@hotmail.com')
//   'project:<projectId>' — per-project scope (open at v2.2; honored by filter)
//   'global'              — default scope when no other context active
//
// Stamped at every node-write boundary per LMA21. Total stamping — no node
// persists without scope tags. Default = {'global'} when no scope active.

export type ScopeTagSet = Set<string>

// ─── Edge ─────────────────────────────────────────────────────────────────────
// Directed weighted edge. Weight ∈ (0, 1].
// MA1: weights redistributed by traversal, never created or destroyed arbitrarily.
// Amendment 1: primitiveType + createdAt. Amendment 3: userId for scope.

export type MemEdge = {
  fromId:         NodeId
  toId:           NodeId
  weight:         number
  primitiveType:  EdgePrimitiveType | null  // null = pre-v1.1 or learning sub-op (Amendment 1, A6)
  createdAt:      number                    // unix ms (Amendment 1, A6)
  userId:         string | null             // null = global, string = per-user (Amendment 3, A6)
}

// ─── Graph ────────────────────────────────────────────────────────────────────
// In-memory representation. Loaded from Postgres on boot, kept warm.
// Single source of truth during runtime.

export type MemGraph = {
  nodes: Map<NodeId, MemNode>
  edges: Map<NodeId, MemEdge[]>  // fromId → outgoing edges
}

// ─── Scope (Amendment 3) ──────────────────────────────────────────────────────
// A6: scope types declared at R0. Two-graph model: user + global with fallthrough.

export type GraphScope = {
  userId: string | null
}

export type ScopedGraphSet = {
  user:   MemGraph
  global: MemGraph
}

// ─── Arms (Horizontal Structure) ──────────────────────────────────────────────
// Overlapping subgraphs detected by community structure (modularity).
// Not separate from the graph — soft constraints on traversal.
// userId (Amendment 3): null = global, string = per-user. A6: scope at origin.

export type MemArm = {
  id:        string
  userId:    string | null    // null = global, string = per-user (Amendment 3, A6)
  label:     string | null    // semantic label, null until detectable
  nodeIds:   NodeId[]         // nodes in this arm
  depth:     number           // how many M-layers this arm spans (1–5)
  updatedAt: number           // unix ms
}

// ─── Dominance (Background Process) ──────────────────────────────────────────
// Async random walk convergence analysis for M1→M0 transitions.

export type DominanceEntry = {
  nodeId:     NodeId
  convergence: number         // random walk convergence score
  computedAt: number          // unix ms
}

// ─── Activation ───────────────────────────────────────────────────────────────
// MA1: Σ activations = 1. Conserved throughout propagation.

export type ActivationMap = Map<NodeId, number>

// ─── Graph Mutation ───────────────────────────────────────────────────────────
// G3: a single runTraversal() produces one mutation set.
// persistMutations() commits all atomically in one transaction.
// MA2: one traversal = one mutation set = one transaction.

export type GraphMutation = {
  nodeCreates:    MemNode[]
  edgeUpserts:    MemEdge[]
  edgeDeletes:    Array<{ fromId: NodeId; toId: NodeId }>
  nodeDeletes:    NodeId[]          // node ids removed by sparsify (isolate removal)
  sourcePrunes:   NodeId[]          // node ids whose source_text is set to NULL (M3→M2)
  layerUpdates:   Array<{ nodeId: NodeId; layer: MLayer; closure: number; asymmetry: number }>
}

// ─── Traversal Result ─────────────────────────────────────────────────────────
// Returned by runTraversal when returnActivation is true.

export type TraversalResult = {
  activation: ActivationMap
  topNodes:   Array<{ nodeId: NodeId; content: string; score: number; layer: MLayer }>
}

// ─── Traversal Options ────────────────────────────────────────────────────────
// Amendment 4: primitiveType allows caller to tag edges created by this traversal.

export type TraversalOptions = {
  returnActivation?: boolean        // true = read path (return activated nodes). false = write-only.
  primitiveType?:    EdgePrimitiveType  // edge tag for this traversal (Amendment 4, A6)
}

// ─── Present State (LM v2.2 §D — body landed in shot4) ──────────────────────
// §18: the bridge between living process and immediate usability.
// G2: present() reads precomputed values when scope is degenerate; recomputes
// over filtered node set on non-degenerate scope per LMA21 (wired Shot 3).
// Recomputed as side effect of runTraversal() at degenerate path.
//
// lm-v2-2-shot4: PresentState body swapped to LM v2.2 §D shape per
// D-PRESENTSTATE-BODY-V21 close. The v2.1 body
// `{statements: PresentStateStatement[]}` is replaced by:
//   {projected: NodeId[], axisScores: Map<NodeId, Map<AxisId, number>>, scopeContext: ScopeFilter}
// PresentStateStatement atom deleted per D-PRESENTSTATEMENT-RETAIN — no
// consumer post-rewrite. ConfidenceTier retired with it.

export type PresentState = {
  projected:    NodeId[]
  axisScores:   Map<NodeId, Map<AxisId, number>>
  scopeContext: ScopeFilter
}

// ─── Binding Result ───────────────────────────────────────────────────────────
// Output of bind() — resonant nodes found in the graph.

export type BindingResult = {
  score:    number
  nodes:    Array<{ nodeId: NodeId; similarity: number }>
}

// ─── Vital Signs ──────────────────────────────────────────────────────────────
// Observation, not structure. Extended from v0.6.
// All ranges graph-relative — no hardcoded safe ranges.

export type MemoryVitalSigns = {
  activationEntropy:    number   // spread of activation across nodes
  top1ActivationRatio:  number   // hub monopoly risk
  meanDegree:           number   // connectivity density
  layerDistribution:    Record<MLayer, number>  // % nodes at each M-layer
  closureMean:          number   // structural stability (M2+)
  asymmetryMean:        number   // directional bias strength (M1+)
  attractorStability:   number   // M0 reconvergence rate
  armCount:             number   // domain diversity
  armDepthDistribution: number[] // identity integration depth
}

// ─── Thresholds ───────────────────────────────────────────────────────────────
// §7: all thresholds are graph-relative. Derived from graph statistics.
// No hardcoded values — the graph defines its own noise floor.

export type GraphThresholds = {
  bind:    number   // μ + kσ of binding score distribution
  close:   number   // mean closure of existing M2 population
  stable:  number   // stability range of existing M2 population
  asym:    number   // mean weight asymmetry across graph
  dom:     number   // convergence distribution across graph
}

// ─── LM v2.2 atoms (lm-v2-2-shot2) ────────────────────────────────────────────
// Net-new atoms per LM v2.2 §C, §D, §E, §F. Declared at R0; consumed by R3
// Present + Lineage entry shapes. Atom shapes match the standard verbatim.
//
// Per option (γ) / D-PRESENTSTATE-BODY-V21: the v2.2 §D PresentState return
// body (`{projected, axisScores, scopeContext}`) is NOT declared at R0 this
// shot. The canonical PresentState identifier (declared above at line ~197)
// retains its v2.1 body. Shot 4 lands the §D body into PresentState directly,
// alongside the 8-axis algorithms that produce its fields.

// ─── ScopeFilter (LM v2.2 §C) ─────────────────────────────────────────────────
// Scope as projection-side filter. Persistence-side scope-stamping (LMA21)
// lands in Shot 3. This shot uses ScopeFilter at the Present + Lineage entry
// shape only; cache lookup remains keyed by user (D-LMA21-DEFER).

export type ScopeFilter = {
  user?:    UserId
  project?: ProjectId
  // open for additional scope dimensions per LMA21
}

// ─── Axes (LM v2.2 §D, §E) ────────────────────────────────────────────────────
// Eight axes per LM v2.2 §E. Each axis is a declaration of what it projects,
// not how it computes. Algorithms land in F-memory at Shot 4.

export type AxisId =
  | 'topology'         // graph-structural position
  | 'recency'          // time-since-touch
  | 'chronology'       // write-order position
  | 'projectAffinity'  // alignment to active project scope
  | 'modeAffinity'     // alignment to active mode (plan|verify|discover|build)
  | 'programAffinity'  // alignment to active program (L4 surface)
  | 'lineageProximity' // distance from active lineage chain
  | 'energy'           // activation/concentration in local subgraph

// AxisConfig: per-axis configuration shape. F-memory authors concrete shape
// per axis in Shot 4. `Record<string, unknown>` is the open contract.

export type AxisConfig = Record<string, unknown>

export type AxisSet = {
  active:  AxisId[]
  weights: Map<AxisId, number>
  configs: Map<AxisId, AxisConfig>
}

// ─── Lineage atoms (LM v2.2 §F) ───────────────────────────────────────────────
// EdgeKindSet: set keyed by EdgePrimitiveType. Excludes null per
// D-EDGEKIND-NULL-EXCLUDE — null = "learning sub-op" or "pre-v1.1", not a
// directly-traversable kind. EdgePrimitiveType is the directly-traversable
// kind set.

export type EdgeKindSet = Set<EdgePrimitiveType>

export type LineageGraph = {
  start:             NodeId
  nodes:             NodeId[]
  edges:             EdgeRef[]
  terminationReason: 'depth-reached' | 'no-more-edges' | 'cycle-truncated' | 'scope-boundary'
}

// ─── Present default cap (LM v2.2 §D) ─────────────────────────────────────────
// PRESENT_LIMIT_MAX: max nodes returned by Present projection. Reused from
// MEMORY_CONFIG.PRESENT_STATE_MAX (= 20) per D-LIMIT-MAX — that constant was
// the v2.1 implicit cap on PresentState.statements; v2.2 surfaces it as the
// `limit` parameter default ceiling. Shot 4 may revise when axes algorithms
// produce richer projection sets.

export const PRESENT_LIMIT_MAX = 20 as const


// Physics constants that survive from v0.6 + new graph-topology params.
// MA1: no decay constants. MA3: MAX_DEGREE preserved.

export const MEMORY_CONFIG = {
  // Propagation
  PROPAGATION_STEPS:   3,        // hops per traversal
  TOP_K_ACTIVATION:    20,       // nodes competing per propagation step
  COMPETITION_BETA:    0.1,      // lateral inhibition — prevents hub monopoly (v0.6 survivor)

  // Learning
  BASE_LEARNING_RATE:  0.2,      // scales inversely with node degree

  // Graph topology
  MAX_DEGREE:          50,       // degree cap per node (v0.6 survivor)
  EDGE_PRUNE_FRACTION: 0.1,     // prune edges below this fraction of mean outgoing weight

  // Binding
  BINDING_K_SIGMA:     1.0,     // bind if score > μ + kσ
  LABEL_REUSE_THRESHOLD: 0.92,  // cosine sim above which existing node is reused (Amendment 2, A6)

  // Arms
  ARM_AFFINITY_THRESHOLD: 0.3,  // minimum affinity to include node in arm
  SHARED_ARM_WEIGHT:      1.5,  // traversal amplification within same arm

  // Present State
  PRESENT_STATE_MAX:   20,      // max statements in present state
  RECENCY_HALF_LIFE:   7 * 24 * 60 * 60 * 1000, // 7 days in ms — EMA half-life

  // Background
  DOMINANCE_WALK_STEPS: 1000,   // random walk steps for convergence analysis
  DOMINANCE_WALKS:      50,     // number of walks per node
} as const
