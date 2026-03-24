// @liv-standard v1.3
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  MemNode           →  F-memory/*
//   W-ATOM  MemEdge           →  F-memory/*
//   W-ATOM  MemGraph          →  F-memory/*
//   W-ATOM  MLayer            →  F-memory/*
//   W-ATOM  PresentState      →  F-chat/R4 (lm-io)
//   W-ATOM  GraphMutation     →  F-memory/*
//   W-ATOM  TraversalResult   →  F-memory/*
//   W-ATOM  MemArm            →  F-memory/*
//   W-ATOM  DominanceEntry    →  F-memory/*
//   W-ATOM  MemoryVitalSigns  →  F-memory/R3
// deps:       none
// validated:  pending

// Living Memory v1.0 — all domain types.
// A6: declared at R0. Zero dependencies. Everything else imports from here.
// MA5: no NodeType — layer is computed from connectivity, never assigned.
// MA1: no decay constants — conservation + rebalancing.
// MA2: one action (traversal) — no separate read/write types.

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

// ─── Node ─────────────────────────────────────────────────────────────────────
// A unit of memory. No type tag. Layer computed from connectivity depth.
// source_text: original input text. Populated at M4/M3, pruned on M3→M2 transition.

export type MemNode = {
  id:              string
  content:         string           // semantic label or summary
  embedding:       number[] | null  // VECTOR(1536), null until encoded
  sourceText:      string | null    // original input, pruned at M3→M2. MA3: structural position carries meaning.
  createdAt:       number           // unix ms
  lastTraversed:   number | null    // unix ms, updated on each traversal touch
  cachedLayer:     MLayer           // cache of computeLayer() result
  cachedClosure:   number           // cycle participation ratio, updated incrementally
  cachedAsymmetry: number           // non-reciprocal weight differential
}

// ─── Edge ─────────────────────────────────────────────────────────────────────
// Directed weighted edge. Weight ∈ (0, 1].
// MA1: weights redistributed by traversal, never created or destroyed arbitrarily.

export type MemEdge = {
  fromId: string
  toId:   string
  weight: number
}

// ─── Graph ────────────────────────────────────────────────────────────────────
// In-memory representation. Loaded from Postgres on boot, kept warm.
// Single source of truth during runtime.

export type MemGraph = {
  nodes: Map<string, MemNode>
  edges: Map<string, MemEdge[]>  // fromId → outgoing edges
}

// ─── Arms (Horizontal Structure) ──────────────────────────────────────────────
// Overlapping subgraphs detected by community structure (modularity).
// Not separate from the graph — soft constraints on traversal.

export type MemArm = {
  id:        string
  label:     string | null    // semantic label, null until detectable
  nodeIds:   string[]         // nodes in this arm
  depth:     number           // how many M-layers this arm spans (1–5)
  updatedAt: number           // unix ms
}

// ─── Dominance (Background Process) ──────────────────────────────────────────
// Async random walk convergence analysis for M1→M0 transitions.

export type DominanceEntry = {
  nodeId:     string
  convergence: number         // random walk convergence score
  computedAt: number          // unix ms
}

// ─── Activation ───────────────────────────────────────────────────────────────
// MA1: Σ activations = 1. Conserved throughout propagation.

export type ActivationMap = Map<string, number>

// ─── Graph Mutation ───────────────────────────────────────────────────────────
// G3: a single runTraversal() produces one mutation set.
// persistMutations() commits all atomically in one transaction.
// MA2: one traversal = one mutation set = one transaction.

export type GraphMutation = {
  nodeCreates:    MemNode[]
  edgeUpserts:    MemEdge[]
  edgeDeletes:    Array<{ fromId: string; toId: string }>
  nodeDeletes:    string[]          // node ids removed by sparsify (isolate removal)
  sourcePrunes:   string[]          // node ids whose source_text is set to NULL (M3→M2)
  layerUpdates:   Array<{ nodeId: string; layer: MLayer; closure: number; asymmetry: number }>
}

// ─── Traversal Result ─────────────────────────────────────────────────────────
// Returned by runTraversal when returnActivation is true.

export type TraversalResult = {
  activation: ActivationMap
  topNodes:   Array<{ nodeId: string; content: string; score: number; layer: MLayer }>
}

// ─── Traversal Options ────────────────────────────────────────────────────────

export type TraversalOptions = {
  returnActivation?: boolean   // true = read path (return activated nodes). false = write-only.
}

// ─── Present State ────────────────────────────────────────────────────────────
// §18: the bridge between living process and immediate usability.
// G2: getPresentState() reads precomputed values only — never triggers recomputation.
// Recomputed as side effect of runTraversal().

export type ConfidenceTier = 'identity' | 'purpose' | 'consolidated' | 'recent' | 'new'

export type PresentStateStatement = {
  arm:        string | null   // semantic label, null if arms not yet formed (G1)
  value:      string          // resolved value
  source:     string | null   // original text if M3. Pruned at M2. MA3.
  layer:      MLayer
  confidence: ConfidenceTier
  recency:    number          // EMA-weighted traversal recency
}

export type PresentState = {
  statements: PresentStateStatement[]
}

// ─── Binding Result ───────────────────────────────────────────────────────────
// Output of bind() — resonant nodes found in the graph.

export type BindingResult = {
  score:    number
  nodes:    Array<{ nodeId: string; similarity: number }>
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

// ─── Config Constants ─────────────────────────────────────────────────────────
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
