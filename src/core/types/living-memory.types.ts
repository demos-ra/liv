// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: lm-v2-2-shot2, lm-v2-2-shot3, lm-v2-2-shot4, lm-v2-2-shot5-fix-2, lm-v2-3-shot1, lm-v2-3-shot2
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId              ← core/R5 primitives
//   W-ATOM Semver              ← core/R5 primitives
//   W-ATOM Result              ← core/R5 primitives
//   W-ATOM AppError            ← core/R5 primitives
//   W-ATOM ArtifactEmission    ← core/R5 ./artifact-standard.types
// wires-out:
//   W-ATOM Modality                → F-codec, F-memory, F-chat (LMA22 lm-v2-3-shot1)
//   W-ATOM SourceAuthority         → F-codec, F-memory, F-chat (LMA23 lm-v2-3-shot1)
//   W-ATOM Confidence              → F-codec, F-memory, F-chat (LMA24 lm-v2-3-shot1)
//   W-ATOM ArrivalMetadata         → F-codec, F-memory, F-chat (LMA22+LMA23+LMA24 bundle, lm-v2-3-shot1)
//   W-ATOM ScopeKey                → all graph-aware consumers (AK-REF branded)
//   W-ATOM NodeRef                 → all graph-aware consumers
//   W-ATOM EdgeRef                 → all graph-aware consumers
//   W-ATOM MLayer                  → F-codec, M-I runtime
//   W-ATOM EdgePrimitiveType       → F-codec routing, AS v2.2 edge-kind roles
//   W-ATOM EdgeKind                → all graph-aware consumers
//   W-ATOM MemNode                 → F-codec, AS v2.2 (anchor/companion/content role carrier)
//   W-ATOM MemEdge                 → F-codec, AS v2.2 (edge-kind role carrier)
//   W-ATOM ActivationMap           → LM internal
//   W-ATOM SubstancePositional     → LM internal, framework-audit
//   W-ATOM SubstanceDecision       → LM internal (LMA7)
//   W-ATOM SubstanceDynamicsPhase  → LM internal, framework-audit
//   W-ATOM TraversalState          → LM internal, framework-audit
//   W-ATOM MutationCommitRef       → LM internal
//   W-ATOM BindingResult           → LM internal
//   W-ATOM GraphMutation           → LM internal
//   W-ATOM DerivationKind          → LM internal, framework-audit
//   W-ATOM GraphThresholds         → LM internal
//   W-ATOM DominanceEntry          → LM internal
//   W-ATOM MemArm                  → F-codec
//   W-ATOM ArmMembership           → LM internal
//   W-ATOM LayerRef                → LM internal
//   W-ATOM ConfidenceTier          → (deleted in shot4 with v2.2 PresentState body swap)
//   W-ATOM PresentStateStatement   → (deleted in shot4 with v2.2 PresentState body swap)
//   W-ATOM MemGraph                → F-codec (getGraph read surface)
//   W-ATOM TraversalOptions        → F-chat, F-codec (traverse callers)
//   W-ATOM TraverseInput           → F-chat, F-codec (traverse callers)
//   W-ATOM PresentStateInput       → F-chat (present-state callers)
//   W-ATOM GraphReadInput          → F-chat, F-codec
//   W-ATOM DirectInsertInput       → F-codec admin (authorized callers)
//   W-ATOM DirectInsertBatchInput  → F-codec admin
//   W-ATOM GraphReadRef            → LM internal
//   W-ATOM TraversalResult         → F-chat, F-codec
//   W-ATOM PresentState            → F-chat (lm-v2-3-shot2: +conflictGroups annotation per LMA27)
//   W-ATOM ScopeFilter             → F-memory/R3 (Present, Lineage entry shape per LM v2.2 §C, §D)
//   W-ATOM ScopeTagSet             → F-memory/* (per-node stamped scope tags per LMA21, lm-v2-2-shot3)
//   W-ATOM AxisId                  → F-memory/R3 (Present axes per LM v2.2 §E)
//   W-ATOM AxisConfig              → F-memory/* (per-axis config; F-memory authors shape in Shot 4)
//   W-ATOM AxisSet                 → F-memory/R3 (Present axis-set per LM v2.2 §D)
//   W-ATOM EdgeKindSet             → F-memory/R3 (Lineage edge filter per LM v2.2 §F)
//   W-ATOM LineageGraph            → F-memory/R3 (Lineage return atom per LM v2.2 §F)
//   W-ATOM MemoryVitalSigns        → dashboard (R3 hook)
//   W-ATOM LMHandoffRuleInstance   → framework-audit
//   W-ATOM LMGateResult            → framework-audit
//   W-ATOM LMDimensionResult       → framework-audit
//   W-ATOM LMCustodyRow            → framework-audit
//   W-ATOM LivingMemoryError       → LM callers (error surface)
//   W-ATOM TraverseResult          → LM callers (Result-wrapped)
//   W-ATOM DirectInsertResult      → LM callers (Result-wrapped)
//   W-ATOM DirectInsertBatchResult → LM callers (Result-wrapped)
//   W-ATOM PresentStateResult      → F-chat
//   W-ATOM GraphReadResult         → F-codec
//   W-ATOM ArmsReadResult          → F-codec
//   W-ATOM VitalSignsResult        → dashboard
//   W-ATOM BootResult              → boot lifecycle
// deps:
//   R5 ./primitives
//   R5 ./artifact-standard.types
//   R5 ../constants/living-memory
// validated: pending

// ═══════════════════════════════════════════════════════════════
// LIVING MEMORY v2.1 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Living Memory v2.1 landing: regenerated against metaframework-v3-1
// (cycle-5 audit pass-all). 20 axioms (LMA1..LMA19 with LMA13 split).
// Mode = generative; carrier = self; scope-parameterized single-graph.
// Canonical spec: src/core/standards/living-memory.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// living-memory.types.ts
// R5 type atoms for Living Memory v2.1
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2 / Plan Standard v2.2 / Multi-Instance Standard v2.3 (frozen inputs)
//
// Consumes: primitives.ts (NodeId, Semver, Result, AppError)
//           artifact-standard.types.ts (ArtifactEmission — AS write payload lands as MemNode+MemEdge records)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in living-memory-v2-1.md §6.5 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per brief §Constraints).

import type {
  NodeId,
  Semver,
  Result,
  AppError,
  UserId,
  ProjectId,
} from './primitives'

import type {
  ArtifactEmission,
} from './artifact-standard.types'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * Scope identifier — non-empty ownerId string (LMA2). One independent living
 * graph per distinct ScopeKey value.
 */
export type ScopeKey = string & { readonly _brand: 'ScopeKey' }

/**
 * Node reference alias — same as primitives.NodeId for clarity at LM's boundary.
 */
export type NodeRef = NodeId

/**
 * Edge reference — (fromId, toId) pair identifying one MemEdge instance.
 */
export type EdgeRef = {
  fromId: NodeRef
  toId:   NodeRef
}

// ─── M-layer and edge-primitive-type enums (§3.5 leaves) ─────────────────────

/**
 * M-layer — computed position derived from topology (LMA14–LMA17).
 * Integer enum M0..M4 (M4 = input, M0 = identity).
 * Distinct from LIV-Standard R-layers.
 */
export type MLayer = 0 | 1 | 2 | 3 | 4

export const M4_INPUT = 4 as const
export const M3_CONTEXT = 3 as const
export const M2_KNOWLEDGE = 2 as const
export const M1_MEANING = 1 as const
export const M0_IDENTITY = 0 as const

/**
 * Edge primitive type — Cognitive Standard v1.2 primitive tagging.
 * Distinct from metaframework "primitive" (which for LM = 'living graph').
 */
export type EdgePrimitiveType =
  | 'anchor'
  | 'relate'
  | 'restructure'
  | 'reinforce'
  | 'suppress'

/**
 * Edge kind — EdgePrimitiveType or null (null for unbound / system-tagged edges).
 * Used in the Substance axis Categorical universal-variable cell.
 */
export type EdgeKind = EdgePrimitiveType | null

// ─── Arrival-metadata atoms (Substance/arrival-metadata sub-axis) ────────────
// lm-v2-3-shot1 (LMA22, LMA23, LMA24): perimeter-supplied stamps preserved by
// the substrate for the life of the node. Cognitive Standard authors values;
// LM holds them. §H wildcard pattern — enums extend without amending LMA22/23.

/**
 * Modality — kind of arrival per LMA22. v2.3 declared set; open per §H.
 *   'perception'      — ambient observation entering memory
 *   'assertion'       — claim made into memory
 *   'typing-failure'  — perimeter could not classify; still recorded
 */
export type Modality =
  | 'perception'
  | 'assertion'
  | 'typing-failure'

/**
 * SourceAuthority — origin authority of the write per LMA23. v2.3 declared set;
 * open per §H. Drives LMA28 trust-weighted accumulation at Shot 2.
 */
export type SourceAuthority =
  | 'wearer-utterance'
  | 'tool-reply'
  | 'scheduled-trigger'
  | 'external-integration'
  | 'program-emission'

/**
 * Confidence — perimeter-supplied scalar in (0, 1] per LMA24. Type is `number`;
 * range invariant enforced at the LM seam (V3) — non-null, 0 < c ≤ 1. Produced
 * at Cognitive Standard (`ClassifyResult.confidence`); LM preserves only.
 */
export type Confidence = number

/**
 * ArrivalMetadata — bundle of LMA22+LMA23+LMA24 stamps. Required input to
 * `runTraversal`; stamped onto every MemNode in the produced commit set.
 * Bundled at the seam matching the standard's `Substance/arrival-metadata`
 * sub-axis composition (LM v2.3 §A subAxisDelta). Same W-ATOM bundle precedent
 * as ScopeFilter / AxisSet.
 */
export type ArrivalMetadata = {
  modality:        Modality
  sourceAuthority: SourceAuthority
  confidence:      Confidence
}

// ─── Substance axis atoms (§3.4 Substance sub-axes) ──────────────────────────

/**
 * MemNode — the held atomic unit. Scope-partitioned by ownerId per LMA2 + LMA3.
 * Cached layer/closure/asymmetry fields are derived per LMA14..LMA16 + LMA18.
 *
 * lm-v2-2-shot3 (LMA21): scope tags stamped at persistence per LM v2.2 §C.
 * Total stamping — no node persists without a non-empty scope tag set. Token
 * format per D-SCOPE-TAG-FORMAT: 'user:<userId>' | 'project:<projectId>' |
 * 'global'. Lockstep with F-memory R0 per E4.
 */
export type MemNode = {
  id:              NodeRef
  ownerId:         ScopeKey              // LMA2
  scope:           ScopeTagSet           // LMA21 — lm-v2-2-shot3
  content:         string
  embedding:       number[]              // LIV-Standard R4 encode() output
  sourceText:      string | null         // LMA1 lifecycle: null iff cachedLayer <= M2_KNOWLEDGE
  createdAt:       number                // epoch ms
  lastTraversed:   number                // epoch ms; updated per touch
  cachedLayer:     MLayer                // LMA14 = M4_INPUT at creation; LMA16 equivalence
  cachedClosure:   number                // derived per LMA18
  cachedAsymmetry: number                // derived per LMA18
  // lm-v2-3-shot1 (LMA22, LMA23, LMA24): arrival-metadata stamps.
  // Non-null at write; preserved for the life of the node. Cognitive Standard
  // authors values at the perimeter; LM seam validates (V1, V2, V3) and stamps.
  // Confidence range invariant (0, 1] enforced at the seam, not in the type.
  modality:        Modality              // LMA22 — non-null at write
  sourceAuthority: SourceAuthority       // LMA23 — non-null at write
  confidence:      Confidence            // LMA24 — non-null at write, 0 < c ≤ 1
}

/**
 * ScopeTagSet — set of scope tag tokens carried on a MemNode per LMA21.
 * Token format per D-SCOPE-TAG-FORMAT (lm-v2-2-shot3):
 *   'user:<userId>' | 'project:<projectId>' | 'global'
 * Lockstep with F-memory R0 declaration.
 */
export type ScopeTagSet = Set<string>

/**
 * MemEdge — directed weighted relation between MemNodes in the same scope (LMA3).
 */
export type MemEdge = {
  fromId:        NodeRef
  toId:          NodeRef
  weight:        number
  primitiveType: EdgeKind
  createdAt:     number                  // epoch ms
  ownerId:       ScopeKey                // LMA2
}

/**
 * Conserved energy scalar (LMA4): Σ values = 1 invariant per-traversal-step.
 * Runtime representation of the Substance/energy leaf.
 */
export type ActivationMap = Map<NodeRef, number>

/**
 * Positional state for Substance axis (universal-variables table §3.8).
 */
export type SubstancePositional = 'declared' | 'persisted'

// ─── Dynamics axis atoms (§3.4 Dynamics sub-axes) ────────────────────────────

/**
 * Substance decision tag — per LMA7, one decision per runTraversal invocation.
 * Non-null at commit (G-LM7).
 */
export type SubstanceDecision = 'create' | 'reinforce'

/**
 * Dynamics phase enum — Categorical universal-variable cell for Dynamics axis.
 */
export type SubstanceDynamicsPhase =
  | 'reception'
  | 'redistribution'
  | 'reinforcement'
  | 'pruning'
  | 'commit'

/**
 * Traversal state — Positional universal-variable cell for Dynamics axis.
 */
export type TraversalState =
  | 'pending'
  | 'binding'
  | 'propagating'
  | 'committed'
  | 'aborted'

/**
 * Mutation commit reference — Relational universal-variable cell for Dynamics.
 * Points to a single committed GraphMutation with its substanceDecision tag.
 */
export type MutationCommitRef = {
  mutationId:        string
  committedAt:       number                // epoch ms
  scope:             ScopeKey
  substanceDecision: SubstanceDecision
}

/**
 * BindingResult — output of Dynamics/reception's bind step.
 */
export type BindingResult = {
  matched:    boolean
  nodeId:     NodeRef | null              // non-null iff matched
  similarity: number                      // 0..1; threshold compared to LABEL_REUSE_THRESHOLD per LMA7
}

/**
 * GraphMutation — aggregated write payload, committed atomically per LMA11.
 * substanceDecision is non-null at commit per LMA7.
 */
export type GraphMutation = {
  nodeCreates:       MemNode[]
  edgeUpserts:       MemEdge[]
  edgeDeletes:       Array<{ fromId: NodeRef; toId: NodeRef }>
  nodeDeletes:       NodeRef[]
  sourcePrunes:      NodeRef[]            // M3 -> M2 transitions (LMA19 event)
  layerUpdates:      Array<{
    nodeId:    NodeRef
    layer:     MLayer
    closure:   number
    asymmetry: number
  }>
  substanceDecision: SubstanceDecision    // LMA7 non-null at commit
  ownerId:           ScopeKey             // LMA2
}

// ─── Derivation axis atoms (§3.4 Derivation sub-axes) ────────────────────────

/**
 * Derivation kind — Categorical universal-variable cell for Derivation axis.
 */
export type DerivationKind =
  | 'metric'
  | 'layer'
  | 'dominance'
  | 'arm'
  | 'present-state'

/**
 * Graph-relative thresholds — derived from graph statistics (μ + kσ).
 * No absolute numeric thresholds per §3.9 Vocabulary graph-relative-threshold.
 */
export type GraphThresholds = {
  bind:  number
  dom:   number
  prune: number
  close: number
}

/**
 * DominanceEntry — random-walk convergence score per LMA13a.
 * computedAt produced exclusively by recomputeDominance (LMA13a G-LM13a).
 */
export type DominanceEntry = {
  nodeId:      NodeRef
  ownerId:     ScopeKey                   // LMA2
  convergence: number
  computedAt:  number
}

/**
 * MemArm — emergent subgraph from community-structure detection (LMA18 reconstructible).
 */
export type MemArm = {
  id:        string
  ownerId:   ScopeKey                     // LMA2
  label:     string | null
  nodeIds:   NodeRef[]
  depth:     number                       // M-layer span of arm (1-5)
  updatedAt: number                       // epoch ms
}

/**
 * Arm membership — Relational universal-variable cell for Derivation axis.
 */
export type ArmMembership = {
  armId:  string
  nodeId: NodeRef
}

/**
 * Layer reference — Relational universal-variable cell for Derivation axis.
 */
export type LayerRef = {
  nodeId: NodeRef
  layer:  MLayer
}

// lm-v2-2-shot4 (D-PRESENTSTATEMENT-RETAIN — delete):
// ConfidenceTier + PresentStateStatement deleted with the v2.1 PresentState
// body swap. No consumer post-rewrite.

// ─── Runtime in-memory graph representation (§2.2 output W-ATOM) ─────────────

/**
 * MemGraph — runtime representation of one scope's living graph.
 */
export type MemGraph = {
  nodes: Map<NodeRef, MemNode>
  edges: Map<NodeRef, MemEdge[]>          // fromId -> outgoing edges
}

// ─── Input W-ATOMs (schema.input per MA-S1; §2.1) ────────────────────────────

export type TraversalOptions = {
  returnActivation?: boolean              // true = read path; false/undefined = write-only
  primitiveType?:    EdgePrimitiveType   // edge tag for this traversal
}

export type TraverseInput = {
  text:    string
  ownerId: ScopeKey                       // non-empty (LMA2)
  options?: TraversalOptions
}

export type PresentStateInput = {
  ownerId: ScopeKey                       // non-empty (LMA2)
}

export type GraphReadInput = {
  ownerId: ScopeKey                       // non-empty (LMA2)
}

export type DirectInsertInput = {
  ownerId: ScopeKey                       // non-empty (LMA2)
  // lm-v2-3-shot1 (LMA22, LMA23, LMA24): arrival-metadata fields optional at
  // declarative R5 input shape; admin seed seam at R2 default-fills missing
  // values from SYSTEM_DEFAULT_ARRIVAL. Same pattern as LMA21 scope at R5.
  node:    Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry' | 'modality' | 'sourceAuthority' | 'confidence'>
         & Partial<Pick<MemNode, 'modality' | 'sourceAuthority' | 'confidence'>>
  edges:   MemEdge[]                      // all edges must satisfy LMA3 (same ownerId)
}

export type DirectInsertBatchInput = {
  ownerId: ScopeKey                       // non-empty (LMA2)
  nodes:   DirectInsertInput[]            // each item references same ownerId
}

/**
 * Graph read reference — Relational universal-variable cell for Substance axis
 * when observing read-path invocations against the graph.
 */
export type GraphReadRef = {
  scope:    ScopeKey
  consumer: 'traversal' | 'present-state' | 'vital-signs' | 'admin-read'
}

// ─── Output W-ATOMs (§2.2) ───────────────────────────────────────────────────

export type TraversalResult = {
  activation: ActivationMap               // Σ = 1 per LMA4
  topNodes:   Array<{
    nodeId:  NodeRef
    content: string
    score:   number
    layer:   MLayer
  }>
}

// lm-v2-2-shot4 (D-PRESENTSTATE-BODY-V21 close): PresentState body swapped
// to LM v2.2 §D shape per natural-deferral closure at the seam where
// 8-axis algorithms exist. Lockstep with F-memory R0.
//
// lm-v2-3-shot2 (LMA27): conflictGroups annotation field added. Pairs
// (n, n') where both n and n' appear in `projected` AND a `suppress`-typed
// edge (n → n') exists in the candidate edge set. Annotation only — does
// not filter, score, or rank. Both members remain visible to consumers.
// LMA20 eight-axis closure preserved: conflictGroups is annotation, not axis.
// Deterministic ordering: pairs sorted lexicographically by NodeId (first
// element ascending, then second element ascending) for stable output.
export type PresentState = {
  projected:      NodeId[]
  axisScores:     Map<NodeId, Map<AxisId, number>>
  scopeContext:   ScopeFilter
  conflictGroups: Array<[NodeId, NodeId]>
}

export type MemoryVitalSigns = {
  activationEntropy:    number
  top1ActivationRatio:  number
  meanDegree:           number
  layerDistribution:    Record<string, number>   // key: `"0"` .. `"4"` serialization of MLayer
  closureMean:          number
  asymmetryMean:        number
  attractorStability:   number
  armCount:             number
  armDepthDistribution: number[]
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ───────────────────

/**
 * LM-local handoff rule instance. Consumed by framework-audit X3 C5 captureShape check.
 * Shape conforms to substrate §8.2 HandoffRulePrimitive amended.
 */
export type LMHandoffRuleInstance = {
  id:                     string          // e.g., 'HR-LM1'
  direction: {
    from: { id: string; version: Semver } // FrameworkRef shape
    to:   { id: string; version: Semver }
  }
  carrierApplicability:   Array<'self' | 'named' | 'none'>
  invariant:              string          // declared invariant text
  captureShape?: {
    capturedFields: string[]
    captureTarget:  'registry' | 'audit-trail' | 'custom'
    queryInterface?: string
  }
  diagnosticSignificance: boolean
}

// ─── Gate / dimension / custody result shapes (framework-audit consumption) ──

/**
 * GateResult consumed by framework-audit SelfAuditRecord shape.
 * Shape mirrors framework-audit-v1-3 §8.1 GateResult.
 */
export type LMGateResult = {
  gateId:    string                        // e.g., 'G-LM1', 'PG1', 'G-U5'
  result:    'passed' | 'failed' | 'pending'
  timestamp: string                        // ISO 8601
  evidence?: string                        // optional, populated for failed gates
}

/**
 * DimensionResult consumed by framework-audit when evaluating LM.
 * Shape mirrors framework-audit-v1-3 §8.1 DimensionResult.
 */
export type LMDimensionResult = {
  dimensionId: string                      // 'X1'..'X10'
  result:      'pass' | 'fail' | 'n/a'
  basis?:      string                      // required for 'n/a'
  details:     string
}

/**
 * Framework-local custody row. Consumed by framework-audit custody-check.
 * Shape mirrors substrate §4 A-04 CustodyRow.
 */
export type LMCustodyRow = {
  atomId:           string
  ownerFrameworkId: string
  layer:            string
  consumers:        string[]
}

// ─── Error payload (emission surface) ────────────────────────────────────────

/**
 * LivingMemoryError — error payload returned by LM R3 surface.
 * Extends canonical AppError from primitives.ts.
 */
export type LivingMemoryError = AppError & {
  code:
    | 'LM_INPUT_INVALID'                  // schema violation on input W-ATOM
    | 'LM_BIND_INFRASTRUCTURE_FAILED'     // encode() R4 dependency failure
    | 'LM_VALIDITY_FAILED'                // G-LM1..G-LM12 failure at commit-time (S5)
    | 'LM_COMMIT_FAILED'                  // persistMutations DB transaction failure
    | 'LM_SCOPE_NOT_FOUND'                // ownerId does not resolve to a known scope
    | 'LM_PERMISSION_DENIED'              // caller lacks permission (enforced above LM)
  failedAxiom?: string                    // e.g., 'LMA4', 'LMA7' — populated for LM_VALIDITY_FAILED
  ownerId?:     ScopeKey                  // scope context when available
}

// ─── Operation result types (R3 emission surface per §6.8 operator interface) ─

export type TraverseResult       = Result<TraversalResult | null, LivingMemoryError>
export type DirectInsertResult   = Result<void,                   LivingMemoryError>
export type DirectInsertBatchResult = Result<
  { inserted: number; traversed: number },
  LivingMemoryError
>
export type PresentStateResult   = Result<PresentState,           LivingMemoryError>
export type GraphReadResult      = Result<MemGraph,               LivingMemoryError>
export type ArmsReadResult       = Result<MemArm[],               LivingMemoryError>
export type VitalSignsResult     = Result<MemoryVitalSigns,       LivingMemoryError>
export type BootResult           = Result<void,                   LivingMemoryError>

// ─── AS v2.2 cross-framework re-exports (declarative, for type-resolution clarity) ──
// Declared by AS, consumed by LM at §6.11 emission-chain calibration.
// Not re-owned; custody remains with artifact-standard (see §6.5 custody table).

export type { ArtifactEmission }

// ─── LM v2.2 atoms (lm-v2-2-shot2) ────────────────────────────────────────────
// Net-new atoms per LM v2.2 §C, §D, §E, §F. Mirrored at F-memory/R0
// (memory-types.ts) per E4: lockstep declaration across both type sites.
//
// Per option (γ) / D-PRESENTSTATE-BODY-V21: PresentState body retained at v2.1
// shape (line ~413). The v2.2 §D return body lands in Shot 4 alongside axis
// algorithms; canonical name preserved across the seam.

// ─── ScopeFilter (LM v2.2 §C) ────────────────────────────────────────────────
// Projection-side scope filter. Persistence-side scope-stamping (LMA21)
// wires in Shot 3.

export type ScopeFilter = {
  user?:    UserId
  project?: ProjectId
  // open for additional scope dimensions per LMA21
}

// ─── Axes (LM v2.2 §D, §E) ───────────────────────────────────────────────────
// Eight axes per LM v2.2 §E. Declarations of what each axis projects;
// algorithms land in F-memory at Shot 4.

export type AxisId =
  | 'topology'
  | 'recency'
  | 'chronology'
  | 'projectAffinity'
  | 'modeAffinity'
  | 'programAffinity'
  | 'lineageProximity'
  | 'energy'

export type AxisConfig = Record<string, unknown>

export type AxisSet = {
  active:  AxisId[]
  weights: Map<AxisId, number>
  configs: Map<AxisId, AxisConfig>
}

// ─── Lineage atoms (LM v2.2 §F) ──────────────────────────────────────────────
// EdgeKindSet excludes null per D-EDGEKIND-NULL-EXCLUDE — null = "learning
// sub-op" or pre-v1.1, not a directly traversable kind.

export type EdgeKindSet = Set<EdgePrimitiveType>

export type LineageGraph = {
  start:             NodeId
  nodes:             NodeId[]
  edges:             EdgeRef[]
  terminationReason: 'depth-reached' | 'no-more-edges' | 'cycle-truncated' | 'scope-boundary'
}

// ─── End of living-memory.types.ts ──────────────────────────────────────────
