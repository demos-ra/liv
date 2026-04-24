# living-memory-v2-1

**Kind:** Framework
**Level:** L3
**Mode:** generative (structured → produced)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.1 under metaframework-v3-1 v3.2.1
**Cross-framework inputs:** Artifact Standard v2.2 (frozen), Plan Standard v2.2 (frozen), Multi-Instance Standard v2.3 (frozen)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus self-audit and change log per v3-1-spec §4.4 file-specific placement).

LM v2.1 regenerates LM v2.0 (unshipped draft; authored against metaframework v2.4) against metaframework-v3-1 per spec-lm-regen-v3-1 (cycle-4 audit outcome #3). Portable content is carried forward per §9 Change log row 1; authored-fresh content per the authoring list in the same row.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Living Memory` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed this regen) |
| `mode` | `generative` (per substrate §2 Mode enum; `structured → produced`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `2.1` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference; string-typed this regen) |
| `stateApplied` | `runtime` (per substrate §9 LifecycleState; string-typed this regen) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (per substrate §9 Carrier enum; LM emits its own artifact — the living graph state transition — via `traverse` → `persistMutations` pipeline; applied §6.1) |
| `primitive` | `living graph` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | `TraverseInput`, `PresentStateInput`, `GraphReadInput`, `DirectInsertInput`, `DirectInsertBatchInput` at R3 surface |
| `produces` | `TraversalResult`, `PresentState`, `MemGraph`, `MemArm[]`, `MemoryVitalSigns`; persisted `GraphMutation` across `mem_node`, `mem_edge`, `mem_arm`, `mem_dominance` |
| `consumedBy` | Artifact Standard v2.2 (as emission target via AS commit pipeline — nodes/edges land in the living graph); Plan Standard v2.2 (indirectly via AS carrier); Multi-Instance Standard v2.3 (indirectly via AS carrier + plan anchor reads); Cognitive Standard v1.2 (F-codec graph read surface for routing + admin direct-insert); F-chat (traverse + present state injection); dashboard (vital signs) |
| `adjacentFrameworks` | Artifact Standard v2.2, Plan Standard v2.2, Multi-Instance Standard v2.3, Cognitive Standard v1.2, LIV-Standard v1.5.1, F-identity |
| `scopeOut` | `['classification / encoding of input (owned by Cognitive Standard, F-codec)', 'artifact emission mechanics above the graph-write layer (owned by Artifact Standard v2.2 carrier)', 'plan authoring (owned by Plan Standard v2.2)', 'multi-instance runtime dispatch (owned by Multi-Instance Standard v2.3)', 'chat session management (owned by F-chat)', 'event bus wiring (LM emits events; bus owned by F-event-system)', 'embedding generation (owned by LIV-Standard R4 infrastructure)', 'code structure / R4 runtime wiring (owned by LIV-Standard)', 'DB connection management (owned by core/db/client)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed this regen):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.1' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.1' },
  generationCycle: 'LM-regen-cycle (post-L3-regen-wave; cycle-4 audit outcome #3 remediation)',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: { id: 'living-memory', version: '2.0' }
}
```

Predecessor note: v2.0 was an unshipped draft authored against metaframework v2.4; v2.1 is the first LM artifact rendered under metaframework v3.1. Prior shipped ancestor is v1.1 (github.com/demos-ra/living-memory).

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I5:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `generative` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named. |

### §1.3 MA-G13 four-property test (framework classification)

Per substrate §1.1 + §1.4 four-property criteria. Tested for `Living Memory`:

| Property | Satisfied by |
|---|---|
| Own state | the living graph substrate — per-scope `MemGraph` (`{nodes: Map<NodeId, MemNode>, edges: Map<NodeId, MemEdge[]>}`); `ActivationMap` during traversal; per-scope dominance cache; arm membership set. Transition rules per §5.1 + LMA5/LMA6/LMA11. |
| Own I/O | input atoms `TraverseInput`, `PresentStateInput`, `GraphReadInput`, `DirectInsertInput`, `DirectInsertBatchInput` per §2.1; output atoms `TraversalResult`, `PresentState`, `MemGraph`, `MemArm[]`, `MemoryVitalSigns`, `GraphMutation` per §2.2. |
| Own invariants | 20 structural-transformation axioms LMA1–LMA19 (LMA13 split 13a/13b) per §3.6; each one mechanical condition directly per AxR2. |
| Own discipline | eight P8 procedure steps S1–S8 per §3.7 (traversal pipeline: receive → validate-scope → gate-execute → emit) with PR4 monotonicity + PR5 stage-kind alignment; `persistMutations` atomic-commit discipline (LMA11). |

All four properties declared. MA-G13 passes. Living Memory is classified as framework (not state store, not protocol).

**Hidden-sibling re-application check** (per MA-G13 "no framework contains another framework as sub-element"):

| Candidate sub-element | Property check | Classification |
|---|---|---|
| per-`ownerId` `GraphState` instance | own state ✓ / own I/O ✗ (LM R3 surface owns I/O, not per-scope instance) / own invariants ✗ (LMA1–LMA19 are LM-owned; per-scope instance inherits) / own discipline ✗ (runtime mutex is operational, not axiomatic) | not a framework — scope-parameterized instance of LM |
| `runTraversal` invocation | own state ✗ (transient per-invocation) / own I/O ✗ (LM owns R3 contract) / own invariants ✗ (inherits) / own discipline ✗ (LMA6 declares pipeline) | not a framework — procedure step under LM |
| M-layer sub-graph (M0/M1/M2/M3/M4 partition) | own state ✗ (derived from graph topology per LMA15/LMA16) / own I/O ✗ / own invariants ✗ / own discipline ✗ | not a framework — derivation over graph state |
| `MemArm` community structure | own state ✗ (derived per LMA18) / own I/O ✗ / own invariants ✗ / own discipline ✗ | not a framework — derivation over graph state |

No candidate sub-element earns framework classification under MA-G13. The scope-parameterized single-graph decision (change-log row 5) holds unchanged under v3.1 MA-G13 (confirmed by cycle-4 audit Anchor 5 PASS).

---

## §2 Schema

### §2.1 Inputs (R3 surface)

LM consumes several distinct input W-ATOMs at its R3 surface. Each listed explicitly per MA-S1 (input is W-ATOM); no forced union. Shapes declared here; typed shapes in `living-memory.types.ts` (R5).

```
TraverseInput = {
  text:    string
  ownerId: string                       // non-empty (LMA2)
  options: TraversalOptions | undefined
}

TraversalOptions = {
  returnActivation: boolean | undefined // true = read path; false/undefined = write-only
  primitiveType:    EdgePrimitiveType | undefined  // edge tag for this traversal
}

PresentStateInput = {
  ownerId: string                       // non-empty
}

GraphReadInput = {
  ownerId: string                       // non-empty
}
// getArms(ownerId) and getGraph(ownerId) consume GraphReadInput by convention.

DirectInsertInput = {
  ownerId: string                       // non-empty
  node:    Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry'>
  edges:   MemEdge[]                    // all edges must satisfy LMA3 (same ownerId)
}

DirectInsertBatchInput = {
  ownerId: string                       // non-empty
  nodes:   DirectInsertInput[]          // each item references same ownerId
}
```

Every field traces to declared source in §6.5 Custody table.

### §2.2 Outputs

Per MA-S2 (output is W-ATOM; LM carrier = `self`, so each output is a W-ATOM — not AxiomRef[]). LM emits multiple distinct outputs; each declared as a named W-ATOM.

```
TraversalResult = {
  activation: ActivationMap             // Map<NodeId, number>, Σ = 1 (LMA4)
  topNodes:   Array<{
    nodeId:  NodeId
    content: string
    score:   number
    layer:   MLayer
  }>
}
// runTraversal returns Result<TraversalResult | null>; null indicates no binding found.

PresentState = {
  statements: PresentStateStatement[]
}

PresentStateStatement = {
  arm:        string | null             // null per G1 fallback when arms weak
  value:      string
  source:     string | null             // sourceText if cachedLayer >= M3; null at M2+ (LMA1)
  layer:      MLayer
  confidence: ConfidenceTier            // 'identity' | 'purpose' | 'consolidated' | 'recent' | 'new'
  recency:    number                    // EMA-weighted
}

MemGraph = {
  nodes: Map<NodeId, MemNode>
  edges: Map<NodeId, MemEdge[]>         // fromId → outgoing
}

MemArm = {
  id:        string
  ownerId:   string                     // LMA2
  label:     string | null
  nodeIds:   NodeId[]
  depth:     number                     // M-layer span of arm (1–5)
  updatedAt: number
}

GraphMutation = {
  nodeCreates:       MemNode[]
  edgeUpserts:       MemEdge[]
  edgeDeletes:       Array<{fromId: NodeId, toId: NodeId}>
  nodeDeletes:       NodeId[]
  sourcePrunes:      NodeId[]
  layerUpdates:      Array<{nodeId: NodeId, layer: MLayer, closure: number, asymmetry: number}>
  substanceDecision: 'create' | 'reinforce'   // LMA7, non-null at commit
  ownerId:           string                   // LMA2
}

MemoryVitalSigns = {
  activationEntropy:    number
  top1ActivationRatio:  number
  meanDegree:           number
  layerDistribution:    Record<MLayer, number>
  closureMean:          number
  asymmetryMean:        number
  attractorStability:   number
  armCount:             number
  armDepthDistribution: number[]
}

DominanceEntry = {
  nodeId:      NodeId
  ownerId:     string                   // LMA2
  convergence: number
  computedAt:  number
}
```

Typed shapes declared in `living-memory.types.ts` (R5). Every field traces to §6.5 custody.

### §2.2.1 Per-field provenance (carried forward from v2.0 §9.1)

Three source categories: `caller` (from input atom), `runtime-computed` (derived within LM), `consumed-atom-verbatim` (F-identity-owned `ownerId` carried through).

- `MemNode`: `id` runtime-generated (UUID); `ownerId` consumed-verbatim; `content` runtime-computed (`normalizeLabel`) or caller-verbatim (direct insert); `embedding` runtime-computed via `encode()`; `sourceText` caller-verbatim at M4/M3 creation, runtime-set to `null` on M3→M2 transition; `createdAt` runtime-generated; `lastTraversed` runtime-generated per touch; `cachedLayer`/`cachedClosure`/`cachedAsymmetry` runtime-computed per LMA15/LMA16.
- `MemEdge`: `fromId`/`toId` runtime-computed (bind, learn, admin spec); `weight` runtime-computed; `primitiveType` caller-supplied via `TraversalOptions` or `null` for learning sub-op, or caller-verbatim (direct insert); `createdAt` runtime-generated; `ownerId` consumed-verbatim.
- `MemArm`: `id` runtime-generated; `ownerId` consumed-verbatim; `label`/`nodeIds`/`depth` runtime-computed via `detectArms`; `updatedAt` runtime-generated.
- `TraversalResult`: `activation` from `propagate`; `topNodes` top-K filter over activation.
- `PresentState`: `statements` from `computePresentState`; `arm`/`value`/`layer`/`confidence`/`recency` runtime-computed; `source` consumed-verbatim from `MemNode.sourceText`.
- `GraphMutation`: all fields runtime-computed; `substanceDecision` runtime-set by `runTraversal` per LMA7; `ownerId` consumed-verbatim.
- `MemoryVitalSigns`: all 9 fields runtime-computed from graph state.
- `DominanceEntry`: runtime-computed by `recomputeDominance`; `ownerId` consumed-verbatim.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed this regen per spec §Constraints:

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityLevel` | substrate §5 |
| `AuthorityClaim` | substrate §5 |
| `WAtom` | substrate §4 A-01 |
| `AxiomRef` | substrate §4 A-02 |
| `FrameworkRef` | substrate §4 A-09 |
| `Kind` | substrate §4 A-10 |
| `Ownership` | substrate §4 A-11 |
| `ActivationTrigger` | substrate §4 A-12 |
| `OperatorInterface` | substrate §4 A-13 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |
| `Stage` | substrate §8.3 (consumed by §3.7 P8 instances S1–S8) |
| `StageContentKind` | substrate §8.3 (consumed by §3.7 + PR5 self-check) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

Per brief §Constraints: "Custody version pins. All cross-framework references cite AS v2.2 / Plan v2.2 / M-I v2.3. Custody of existing `primitives.ts` not regenerated — verified only."

| Type | Home | Consumed at |
|---|---|---|
| `NodeId` | primitives.ts | §2.1 inputs (edges), §2.2 outputs (every MemNode/MemEdge/MemArm) |
| `Semver` | primitives.ts | §1 version |
| `Result<T, E>` | primitives.ts | return wrapper on R3 async functions (§6.8 operator interface) |
| `AppError` | primitives.ts | §2.2 `LivingMemoryError` extends; error return path |

### §2.5 Consumed types (from adjacent frameworks, by reference)

Cross-framework calibration per spec §Constraints. LM is the emission target for AS v2.2's write pipeline; Plan v2.2 and M-I v2.3 reach LM indirectly via AS. LM does not consume Plan/M-I types directly at its R3 surface. AS v2.2 types consumed at the AS→LM write boundary are shape-compatible by construction (AS's `writes.a7` payload lands as `MemNode` + `MemEdge` records):

| Type | Home | Consumed at |
|---|---|---|
| `ArtifactEmission.writes.a7` | artifact-standard-v2-2.md §2.2 | AS produces; LM records the MemNode+MemEdge set. Atoms are LM-owned (MemNode/MemEdge); AS wraps its commit pipeline around an LM `directInsert` or `traverse` invocation per AS v2.2 §6 coupling. |

Per substrate-vs-role pattern (§6.11 below): LM owns the substrate atoms (MemNode, MemEdge); AS v2.2 / Plan v2.2 / M-I v2.3 declare *roles* that ride on these records. No re-ownership per MA-C6.

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 (referenced from metaframework §6.5) | §8.2 dimension results schema reference |

### §2.7 LM-local atoms (declared at point of use in §3)

Atoms owned by LM (custody row per atom in §6.5):

`MemNode`, `MemEdge`, `EdgePrimitiveType`, `MemGraph`, `ActivationMap`, `MLayer`, `MemArm`, `DominanceEntry`, `GraphMutation`, `GraphThresholds`, `BindingResult`, `TraversalResult`, `TraversalOptions`, `TraverseInput`, `PresentState`, `PresentStateStatement`, `ConfidenceTier`, `MemoryVitalSigns`, `DirectInsertInput`, `DirectInsertBatchInput`, `PresentStateInput`, `GraphReadInput`, `LMHandoffRuleInstance`, `LMGateResult`, `LMDimensionResult`, `LMCustodyRow`, `LivingMemoryError`, `SubstanceDecision`, `SubstanceDynamicsPhase`, `TraversalState`, `DerivationKind`, `SubstancePositional`, `EdgeRef`, `NodeRef`, `ScopeKey`, `ArmMembership`, `LayerRef`, `MutationCommitRef`, `GraphReadRef`, `EdgeKind`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling) per S1 single-source declaration. Typed shapes in `living-memory.types.ts`.

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to LM:

- **ScR1** (input is W-ATOM): inputs declared §2.1 as typed shapes (five distinct W-ATOMs — not a union; LM exposes five R3 entry points).
- **ScR2** (output is W-ATOM): outputs declared §2.2 as typed shapes; carrier = `self` → each output is a W-ATOM (not AxiomRef[]).
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

LM inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. LM does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, LM's own structural content populates §3.3–§3.9 below: three LM-local P1 Axis instances (Substance, Dynamics, Derivation) nested under A3 Structure, with sub-axes, leaves, axioms (LMA1..LMA19 with LMA13 split = 20 atomic conditions), and the P8 procedure declarations (S1–S8).

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 3 | `{primitiveKind: P1, instanceCount: 3, basis: "LM-local domain axes declared at §3.3: Substance, Dynamics, Derivation. The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; LM-local P1 instances populate §3 Structure under the inherited shell under A3 Structure. First-principles decomposition per cycle-4 audit §5 carry-forward: Substance without Dynamics = fossil; Dynamics without Substance = nothing to change; Substance + Dynamics without Derivation = held and changing but reveals nothing about itself. Each axis fails the memory concept distinctly if removed."}` |
| P2 Sub-axis | 15 | Substance: 5; Dynamics: 5; Derivation: 5. Declared §3.4. |
| P3 Leaf | 20 | One leaf per axiom condition per MA-St2 leaf atomicity: LMA1..LMA12 (12) + LMA13a + LMA13b (2) + LMA14..LMA19 (6) = 20. Declared §3.5. |
| P4 Axiom | 20 | LMA1, LMA2, LMA3, LMA4, LMA5, LMA6, LMA7, LMA8, LMA9, LMA10, LMA11, LMA12, LMA13a, LMA13b, LMA14, LMA15, LMA16, LMA17, LMA18, LMA19. Declared §3.6. |
| P5 Gate | 20 | G-LM1..G-LM12, G-LM13a, G-LM13b, G-LM14..G-LM19. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 6 | HR-LM1 (caller → LM at R3: traverse), HR-LM2 (caller → LM at R3: direct-insert), HR-LM3 (caller → LM at R3: read surface — present state / graph / arms), HR-LM4 (LM → F-event-system: event emission), HR-LM5 (LM → AS v2.2: emission-target receive-side), HR-LM6 (LM → framework-audit: audit-query receive-side). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: P7, instanceCount: 0, basis: "LM's runtime decisions (M-layer assignment via computeLayer, survives threshold check via connectivity ≥ graphThresholds.bind, substance-decision via bind-before-create outcome) are all mechanical predicates reducible to substrate §6.3 mechanical-criterion ground (reference resolution, numeric comparison, structural property). computeLayer purity is asserted by LMA15 (pure function of inputs; no historical cachedLayer influence). M0_IDENTITY assignment is produced exclusively by computeLayer per LMA17; no other code path produces M0 status. graphThresholds derived from graph statistics (μ + kσ per §3.9 Vocabulary), not from judgment. No judgment inputs consumed. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 8 | S1–S8: R3-receive → scope-validate → bind → propagate+learn+sparsify → commit (atomic) → layer-update → emit → post-commit-derivations. Declared §3.7. |

Positive empty-declaration marker for P7 per substrate §8.6. No implicit absence.

### §3.3 P1 Axis instances (LM-local)

Three domain axes. MECE over LM's concern space. Rendered against the v3.1 seven-axis shell at §3.1.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Substance` | Substance | What persists — the held atoms and their primary fields | What exists to be held? |
| `Dynamics` | Dynamics | How substance changes over time | What happens when input arrives, and what invariants hold across change? |
| `Derivation` | Derivation | What the graph computes about itself from its own structure | What does the graph reveal about itself without being declared? |

**MECE verification:**
- Orthogonality: Substance governs held atoms + primary fields (what exists); Dynamics governs change operations + per-traversal invariants (how things change); Derivation governs self-computed structural readouts (what's revealed). No pair-overlap. Leaf-level orthogonality against shipped `memory-types.ts` + `memory-service.ts` + `memory-layer.ts` (carry-forward from v2.0 §4).
- Exhaustiveness: every LM-owned field or operation traces to exactly one LM-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern. Scope (`ownerId`) lives under Substance because it is a primary field on every held atom; the partitioning invariant LMA3 governs substance identity per-graph.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Substance sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Substance/unit` | Held atomic unit | `leaf-mem-node` |
| `Substance/relation` | Relation between units | `leaf-mem-edge`, `leaf-edge-primitive-type` |
| `Substance/energy` | Conserved scalar over units | `leaf-activation-map` |
| `Substance/scope` | Scope partition identity | `leaf-scope` |
| `Substance/source-continuity` | Source-text lifecycle field | `leaf-source-text` |

**Dynamics sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Dynamics/reception` | Input reception + binding | `leaf-reception` |
| `Dynamics/redistribution` | Energy redistribution | `leaf-redistribution` |
| `Dynamics/reinforcement` | Inline learning | `leaf-reinforcement` |
| `Dynamics/pruning` | Sparsification + removal | `leaf-pruning` |
| `Dynamics/commit` | Atomic commit + substance decision | `leaf-commit`, `leaf-substance-decision` |

**Derivation sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Derivation/structural-metrics` | Per-node structural metrics | `leaf-structural-metrics` |
| `Derivation/layer-assignment` | M-layer assignment | `leaf-layer-assignment`, `leaf-layer-purity`, `leaf-layer-observable-equivalence` |
| `Derivation/identity-convergence` | Dominance / attractor convergence | `leaf-dominance-producer`, `leaf-dominance-nonblocking`, `leaf-m0-producer` |
| `Derivation/community-structure` | Arms / emergent subgraphs | `leaf-reconstructibility` |
| `Derivation/present-projection` | Present-state derivation | `leaf-present-state`, `leaf-source-pruned-event` |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-mem-node` | `descriptor` | `MemNode` record `{id, ownerId, content, embedding, sourceText, createdAt, lastTraversed, cachedLayer, cachedClosure, cachedAsymmetry}` |
| `leaf-mem-edge` | `descriptor` | `MemEdge` record `{fromId, toId, weight, primitiveType, createdAt, ownerId}` |
| `leaf-edge-primitive-type` | `property` | `EdgePrimitiveType = 'anchor' \| 'relate' \| 'restructure' \| 'reinforce' \| 'suppress'` enum |
| `leaf-activation-map` | `descriptor` | `ActivationMap = Map<NodeId, number>` with Σ = 1 invariant predicate |
| `leaf-scope` | `property` | `ownerId: string` non-empty; identity-per-graph predicate (same-scope closure) |
| `leaf-source-text` | `property` | `sourceText: string \| null` on `MemNode`; lifecycle predicate: populated at M4/M3, `null` at `cachedLayer ≤ M2_KNOWLEDGE` |
| `leaf-reception` | `axiom` | `bind(embedding, graph) → BindingResult` (within scope only) + `normalizeLabel(content)` dedup gate |
| `leaf-redistribution` | `axiom` | `propagate(seed, graph) → ActivationMap` with conservation invariant (Σ = 1) + M1 bias via `effectiveWeight` + top-K competition + lateral inhibition |
| `leaf-reinforcement` | `axiom` | inline `learn(activation, graph) → edgeMutations[]` with `Δw = lr × flow × (1 − w / Σ_out)` |
| `leaf-pruning` | `axiom` | `sparsify(graph) → GraphMutation` + `survives(n) === (connectivity(n) ≥ graphThresholds.bind)` |
| `leaf-commit` | `axiom` | `persistMutations(mutation) → Result<void>` as single DB transaction |
| `leaf-substance-decision` | `property` | `substanceDecision: 'create' \| 'reinforce'` on `GraphMutation`; non-null at commit predicate |
| `leaf-structural-metrics` | `descriptor` | `degree(nodeId, graph)`, `closure(nodeId, graph)`, `asymmetry(nodeId, graph)` + `GraphThresholds` derived from graph statistics |
| `leaf-layer-assignment` | `axiom` | new-node creation predicate: `cachedLayer === M4_INPUT` at creation |
| `leaf-layer-purity` | `axiom` | `computeLayer(node, graph, thresholds, dominanceMap) → MLayer` purity predicate: no historical `cachedLayer` influence |
| `leaf-layer-observable-equivalence` | `axiom` | `cachedLayer === computeLayer(node, graph, thresholds, dominanceMap)` equivalence predicate at any observable moment |
| `leaf-dominance-producer` | `axiom` | `DominanceEntry.computedAt` produced exclusively by `recomputeDominance` |
| `leaf-dominance-nonblocking` | `axiom` | `runTraversal` does not block on dominance updates; reads from cache only |
| `leaf-m0-producer` | `axiom` | `M0_IDENTITY` assignment produced exclusively by `computeLayer` reading `DominanceEntry.convergence ≥ graphThresholds.dom` |
| `leaf-reconstructibility` | `axiom` | derived-tables + derived-fields reconstructible from base rows + topology predicate |
| `leaf-present-state` | `descriptor` | `computePresentState(graph) → PresentState` with `PresentStateStatement[]`, `ConfidenceTier` tiers, G1 graceful fallback |
| `leaf-source-pruned-event` | `axiom` | `memory.source-pruned` event emitted on `cachedLayer` transition `> M2_KNOWLEDGE → ≤ M2_KNOWLEDGE` |

Leaf-count reconciliation: 22 leaf rows above map to 20 axiom conditions per MA-St2 canonical binding (LMA1..LMA12, LMA13a, LMA13b, LMA14..LMA19). Two leaves (`leaf-activation-map` carries LMA4 predicate; `leaf-mem-node` + `leaf-mem-edge` + `leaf-scope` + `leaf-source-text` distribute LMA1/LMA2/LMA3 predicates across sub-axes). §3.2 reports P3 = 20 for the axiom-condition-anchored count used by MA-St2 + G-M1; table lists 22 shape-declaration rows including the non-axiom descriptors (`leaf-mem-node`, `leaf-mem-edge`, `leaf-activation-map`, `leaf-structural-metrics`, `leaf-present-state`). Axiom-gate binding at §3.6 uses the axiom-condition-anchored set.


### §3.6 P4 Axiom instances (LMA1..LMA19 with LMA13 split = 20 atomic)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). Preserved verbatim from v2.0 §6 per carry-forward discipline (no text drift). `attachedTo` column added per metaframework v3.1 structural axiom-attachment requirement.

| Axiom | Kind | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|---|
| **LMA1** | Invariant | `Substance/source-continuity` / `leaf-source-text` | For every `MemNode`, `sourceText === null` iff `cachedLayer ≤ M2_KNOWLEDGE`. | structural property (biconditional predicate) |
| **LMA2** | Invariant | `Substance/scope` / `leaf-scope` | For every `MemNode` and every `MemEdge`, `ownerId` is a non-empty string. | structural property (predicate) |
| **LMA3** | Invariant | `Substance/scope` / `leaf-scope` | For every `MemEdge`, the node resolved from `fromId` and the node resolved from `toId` satisfy `fromNode.ownerId === toNode.ownerId`. | reference resolution (dual-source equality) |
| **LMA4** | Invariant | `Substance/energy` / `leaf-activation-map` | For every `ActivationMap` produced at any step of a single traversal, Σ activations = 1. | structural property (aggregation predicate) |
| **LMA5** | Producer | `Dynamics/commit` / `leaf-commit` | Every graph mutation originating from input reception, read query, or learning is produced by exactly one `runTraversal` invocation. | structural property (exclusive producer predicate) |
| **LMA6** | Mechanism | `Dynamics/commit` / `leaf-commit` | Within one `runTraversal` invocation, binding, propagation, learning, sparsification, and local layer update execute as a single uninterrupted pipeline; no external read or write occurs between these steps. | structural property (pipeline-atomicity predicate) |
| **LMA7** | Invariant | `Dynamics/commit` / `leaf-substance-decision` | Every `runTraversal` invocation commits exactly one substance decision in `{create, reinforce}`. `GraphMutation.substanceDecision` is non-null at commit. All edge formations, weight updates, inline learning outputs, and layer recomputations produced by the traversal are side effects of that one decision. | structural property (cardinality + predicate) |
| **LMA8** | Invariant | `Dynamics/pruning` / `leaf-pruning` | `survives(n) === true` iff `connectivity(n) ≥ graphThresholds.bind`. | structural property (biconditional predicate) |
| **LMA9** | Mechanism | `Dynamics/pruning` / `leaf-pruning` | Nodes with `survives(n) === false` are removed by `sparsify()`. | structural property (implication predicate) |
| **LMA10** | Invariant | `Dynamics/pruning` / `leaf-pruning` | `removeNode(nodeId)` always produces a valid `MemGraph` state: no dangling edges, no partial persistence, derived tables either updated or invalidated for regeneration per `LMA18`. | structural property (total-decomposition predicate) |
| **LMA11** | Mechanism | `Dynamics/commit` / `leaf-commit` | For every write path (`persistMutations`, `persistArms`, `persistDominance`), commit is executed as exactly one database transaction per invocation. | structural property (cardinality predicate over commit paths) |
| **LMA12** | Absence | `Dynamics/reinforcement` / `leaf-reinforcement` | No code path in Living Memory mutates `MemEdge.weight` or node energy-share as a function of elapsed wall-clock time independent of a `runTraversal` invocation. | structural property (absence predicate; enumerated code-path check) |
| **LMA13a** | Producer | `Derivation/identity-convergence` / `leaf-dominance-producer` | `DominanceEntry.computedAt` values are produced exclusively by the background process (`recomputeDominance`). | structural property (exclusive producer predicate) |
| **LMA13b** | Mechanism | `Derivation/identity-convergence` / `leaf-dominance-nonblocking` | `runTraversal` does not block on nor produce `DominanceEntry` updates; dominance values are read from cache only during traversal. | structural property (non-blocking predicate) |
| **LMA14** | Invariant | `Derivation/layer-assignment` / `leaf-layer-assignment` | Every new `MemNode` created by `runTraversal` has `cachedLayer === M4_INPUT` at creation. | structural property (initial-value predicate) |
| **LMA15** | Invariant | `Derivation/layer-assignment` / `leaf-layer-purity` | `computeLayer(node, graph, thresholds, dominanceMap)` is a pure function of its inputs; no historical `cachedLayer` value influences its return. | structural property (purity predicate) |
| **LMA16** | Invariant | `Derivation/layer-assignment` / `leaf-layer-observable-equivalence` | For every `MemNode` at any observable moment, `cachedLayer === computeLayer(node, graph, thresholds, dominanceMap)` evaluated against the current graph state. (Implementation may inline or memoize the evaluation when the result is provably constant; correctness is measured by this equivalence, not by which code path writes the field.) | structural property (equivalence predicate) |
| **LMA17** | Producer | `Derivation/identity-convergence` / `leaf-m0-producer` | `M0_IDENTITY` assignment is produced exclusively by `computeLayer()` reading `DominanceEntry.convergence ≥ graphThresholds.dom`; no other code path, field, or input produces M0 status. | structural property (exclusive producer predicate) |
| **LMA18** | Invariant | `Derivation/community-structure` / `leaf-reconstructibility` | For any scope, the full system state is recoverable by dropping derived tables (`mem_arm`, `mem_dominance`) and derived fields on `mem_node` (`cachedLayer`, `cachedClosure`, `cachedAsymmetry`), then regenerating them from the base rows of `mem_node` and `mem_edge` within that scope. Base rows — including input-origin fields (`sourceText`, `embedding`, `content`, `createdAt`, `lastTraversed`) — are not claimed derivable; they are persisted because they cannot be recomputed. | structural property (reconstructibility predicate) |
| **LMA19** | Mechanism | `Derivation/present-projection` / `leaf-source-pruned-event` | Every `cachedLayer` transition from `> M2_KNOWLEDGE` to `≤ M2_KNOWLEDGE` emits event `memory.source-pruned`. | structural property (event-emission predicate) |

**AxR1 self-check:** each axiom binds to exactly one axis/sub-axis/leaf per attachment column. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set additively versioned from v2.0 (v2.0 declared LMA1..LMA19 with LMA13 split — 20 atomic conditions; v2.1 preserves set identity — no additions, no deletions, no condition re-writes; `attachedTo` column added per v3.1 structural requirement). Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood; stated as invariant/producer/mechanism/absence conditions). Pass.

**Kind distribution** (carry-forward from v2.0 §6.4):

| Axis | Invariant | Producer | Mechanism | Absence | Total |
|---|---|---|---|---|---|
| Substance | 4 | 0 | 0 | 0 | 4 |
| Dynamics | 3 | 1 | 3 | 1 | 8 |
| Derivation | 4 | 2 | 2 | 0 | 8 |
| **Total** | **11** | **3** | **5** | **1** | **20** |

(Note: Substance count here = 4 because LMA1–LMA4 are counted under the sub-axes they attach to at `Substance/*`; v2.0 §6.4 reported 3 Invariants for Substance because LMA4 was counted under Dynamics in its `ActivationMap` usage. In v2.1, LMA4 attaches to `Substance/energy` per the table above — ActivationMap is a held-unit state, not a dynamics mechanism, even though it is observed during traversal. Kind tags are descriptive metadata per v2.0 carry-forward; not an E6 gate.)

### §3.7 P8 Procedure step instances

**Eight instances (S1–S8).** LM Mode = `generative`; per substrate §8.3 (P8 Mode=generative-only) P8 declaration is required. Decomposition follows AS v2.2 P8 pattern referenced in brief §Authoring list: minimal decomposition of LM's canonical operation. The canonical operation is `runTraversal` (the generative pipeline per LMA6); LM's other R3 entry points (`directInsert`, `getPresentState`, `getGraph`, `getArms`) are receive-path specializations that land in the same commit pipeline or are read-only (no generative P8 chain).

The eight P8 instances describe the generative pipeline of one `runTraversal` invocation. Every step declares the amended P8 shape per substrate §8.3: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}` where the kind-specific field is populated per PG6 amended.

| id | order | stage | kind | input | output | kind-specific field | gates (LM+metaframework refs) |
|---|---|---|---|---|---|---|---|
| **S1** | 1 | 1 | judgment-input | `TraverseInput` (or `DirectInsertInput`/`PresentStateInput`/`GraphReadInput` for non-traverse entries) + scope validation of `ownerId` | validated input | `judgmentInputRef = {}` (empty set; validation is mechanical — non-empty string check per LMA2) | — |
| **S2** | 2 | 2 | mechanical | validated input + current `MemGraph` for scope | seed `ActivationMap` post-bind (`BindingResult` if match; substance decision `'create' \| 'reinforce'` resolved per `LABEL_REUSE_THRESHOLD`) | `derivation = "per Dynamics/reception: encode(text) if traversal; bind(embedding, graph) within ownerId scope; normalizeLabel(content) dedup gate; resolve substanceDecision per LMA7 (bind-before-create outcome)"` | — |
| **S3** | 3 | 2 | mechanical | seed `ActivationMap` + graph | post-propagation `ActivationMap` (Σ = 1 conserved per LMA4) + learning edge mutations | `derivation = "per Dynamics/redistribution + Dynamics/reinforcement: propagate(seed, graph) with normalize() at each step (LMA4); learn(activation, graph) inline (Δw = lr × flow × (1 − w / Σ_out)); top-K competition + lateral inhibition. Within one runTraversal per LMA6 no external I/O."` | — |
| **S4** | 4 | 2 | mechanical | post-propagation `ActivationMap` + graph + learning edge mutations | `GraphMutation` draft (all fields populated including `substanceDecision` per LMA7) | `derivation = "per Dynamics/pruning + Dynamics/commit: sparsify(graph) with survives(n) threshold per LMA8; aggregate nodeCreates ∪ edgeUpserts ∪ edgeDeletes ∪ nodeDeletes ∪ sourcePrunes ∪ layerUpdates into one GraphMutation draft; substanceDecision tagged non-null per LMA7."` | — |
| **S5** | 5 | 3 | gate-execution | `GraphMutation` draft + graph pre-state | per-gate results for LM-own axiom gates + overall pass/fail | — | `gates = [G-LM1, G-LM2, G-LM3, G-LM4, G-LM5, G-LM6, G-LM7, G-LM8, G-LM9, G-LM10, G-LM11, G-LM12]` (LM-own invariants at commit-time per MA-V1; LMA13a..LMA19 tested post-commit in later stages) |
| **S6** | 6 | 3 | gate-execution | `GraphMutation` draft + metaframework coupling state | per-gate results for metaframework framework-tier bundle applicable at emission + overall | — | `gates = [PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4]` (52 inherited framework-tier gates; executed by framework-audit — not at every runTraversal; declared here for PG6 coverage per substrate §1.3 S-03 permitted-multi-execution) |
| **S7** | 7 | 5 | mechanical | validated `GraphMutation` + graph pre-state | committed state; `persistMutations(mutation) → Result<void>` as single DB transaction; emitted `TraversalResult`/`PresentState`/etc per entry point | `derivation = "per LMA11: commit as exactly one database transaction per invocation. Emit HR-LM4 events (memory.traversal-complete, memory.node-created, memory.layer-changed, memory.source-pruned per LMA19, memory.arm-detected, memory.arm-merged, memory.dominance-updated). Return Result<TraversalResult | null> per entry point."` | — |
| **S8** | 8 | 5 | mechanical | committed graph state + scope context | updated derivations: `cachedLayer` per LMA14/LMA15/LMA16 via `updateLayersLocally`; arm membership via `detectArms` (async/debounced per brief §13 item 9); dominance via `recomputeDominance` (async per LMA13a/LMA13b) | `derivation = "per Derivation/layer-assignment + Derivation/community-structure + Derivation/identity-convergence: updateLayersLocally reruns computeLayer on changed nodes (LMA16 equivalence held); detectArms async; recomputeDominance async; all reconstructible per LMA18. Post-commit — does not block S7's Result return."` | — |

**E1–E2 shorthand.** S5 executes LM-own axiom gates at commit-time (G-LM1..G-LM12 — invariants checkable against the GraphMutation draft + pre-state). S6 references the 52 inherited framework-tier gates that framework-audit executes when auditing LM as a framework (not per-traversal); declaring the gate-field here satisfies PG6 coverage per substrate §1.3 S-03 permitted-multi-execution. G-LM13a..G-LM19 (post-commit invariants on async derivations) are referenced in S8 via the derivation field — they test the derivations S8 produces.

**Per-row notes:**

- **S1.** Consumes whatever input atom was sent to the R3 entry point. Scope validation (non-empty `ownerId`) is the validation gate per LMA2. Empty `judgmentInputRef` set per PG6 amended: S1 is classified `judgment-input` by Stage 1 / PR5 alignment, but LM's actual J-input set is empty (§7.1 P7=0). The field is populated with empty set, which is PG6-amended-compliant ("declared `judgmentInputRef`" — the empty set is a valid declaration). Alternate interpretation: mechanical validation lifted into its own mechanical step; retained as judgment-input per PR5 strict alignment for Stage 1.
- **S2–S4.** Three Stage-2 mechanical steps decompose the `runTraversal` pipeline (reception → propagation+learning → pruning+aggregate). Sub-step sequencing within each is internal to the derivation. Per MA-St4 primitive-atomicity, each distinct pipeline phase is its own P8 instance.
- **S5–S6.** Stage-3 gate-execution. S5 executes LM-own gates at commit-time (cheap invariant checks against the mutation draft). S6 declares the inherited framework-tier gate bundle (per G-M1/G-M2/G-U3/etc) — this is a declared touchpoint, not a per-traversal execution; framework-audit is the executor per F-69 distribution table.
- **S7.** Terminal commit + emit. Two concerns — atomic commit per LMA11 and event emission per LMA19 + HR-LM4 — collapse into one P8 under MA-St4 atomicity (commit and post-commit emission share the same transaction boundary).
- **S8.** Stage-5 post-commit derivations. LMA13a/LMA13b specify async/non-blocking semantics; LMA18 reconstructibility makes derivations recoverable. Post-commit — does not block S7's Result return; sequencing retained for PR4 stage monotonicity.

### §3.7.1 Stage monotonicity and kind-alignment self-check

Per substrate §10.2 PR4 + PR5, applied to the eight-step procedure:

**PR4 — stage monotonicity across order.**

| order | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| stage | 1 | 2 | 2 | 2 | 3 | 3 | 5 | 5 |

Non-decreasing across order (Stage 4 is skipped — no judgment-observation step; LM has no P7 instances per §3.2, so no Stage-4 judgment-input step). PR4 passes (skipping a stage without back-tracking is monotonicity-compliant; monotonicity requires `stage(n+1) ≥ stage(n)`, not dense coverage).

**PR5 — stage-content-kind alignment per P8 instance.**

| id | stage | kind | PR5-required kind | aligned |
|---|---|---|---|---|
| S1 | 1 | judgment-input | judgment-input | ✓ |
| S2 | 2 | mechanical | mechanical | ✓ |
| S3 | 2 | mechanical | mechanical | ✓ |
| S4 | 2 | mechanical | mechanical | ✓ |
| S5 | 3 | gate-execution | gate-execution | ✓ |
| S6 | 3 | gate-execution | gate-execution | ✓ |
| S7 | 5 | mechanical | mechanical | ✓ |
| S8 | 5 | mechanical | mechanical | ✓ |

All eight aligned. PR5 passes.

**PG6 amended (substrate §11.2) — kind-specific field requirement:**

- S1 (kind=judgment-input) → `judgmentInputRef` declared (empty set per §3.2 P7=0 basis). ✓
- S2, S3, S4, S7, S8 (kind=mechanical) → `derivation` declared. ✓
- S5, S6 (kind=gate-execution) → `gates` populated with tested axiom/invariant refs. ✓

All eight satisfy PG6 amended.

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). Per G-St strict: every cell is named type, enum literal, or structured reference — no prose cells, no arrow notation. Carry-forward from v2.0 §5.1 (cycle-4 audit Anchor 1 PASS: 0-arrow, G-St-clean; directly portable).

**Named types consumed by this table** (declared in `living-memory.types.ts`):

```
NodeRef           = NodeId                                     // MemNode.id
EdgeRef           = {fromId: NodeId, toId: NodeId}
ScopeKey          = string                                     // ownerId, non-empty
ArmMembership     = {armId: string, nodeId: NodeRef}
MutationCommitRef = {mutationId: string, committedAt: number, scope: ScopeKey, substanceDecision: 'create' | 'reinforce'}
GraphReadRef      = {scope: ScopeKey, consumer: 'traversal' | 'present-state' | 'vital-signs' | 'admin-read'}
EdgeKind          = EdgePrimitiveType | null
LayerRef          = {nodeId: NodeRef, layer: MLayer}
SubstancePositional        = 'declared' | 'persisted'
SubstanceDynamicsPhase     = 'reception' | 'redistribution' | 'reinforcement' | 'pruning' | 'commit'
TraversalState             = 'pending' | 'binding' | 'propagating' | 'committed' | 'aborted'
DerivationKind             = 'metric' | 'layer' | 'dominance' | 'arm' | 'present-state'
MLayer                     = 0 | 1 | 2 | 3 | 4
```

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Substance` | `MemNode.createdAt: number` | `EdgeKind` | `EdgeRef` | `SubstancePositional` enum `'declared' \| 'persisted'` |
| `Dynamics` | `MutationCommitRef.committedAt: number` | `SubstanceDynamicsPhase` enum `'reception' \| 'redistribution' \| 'reinforcement' \| 'pruning' \| 'commit'` | `MutationCommitRef` | `TraversalState` enum `'pending' \| 'binding' \| 'propagating' \| 'committed' \| 'aborted'` |
| `Derivation` | `DominanceEntry.computedAt: number` | `DerivationKind` enum `'metric' \| 'layer' \| 'dominance' \| 'arm' \| 'present-state'` | `ArmMembership` paired with `LayerRef` (`{nodeId: NodeRef, layer: MLayer}`) | `MLayer` (`0 \| 1 \| 2 \| 3 \| 4`) |

Every cell is a named type, enum literal set, or declared structured reference. No prose cells. No arrow notation.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `living graph` | §1 primitive | the persistent substrate LM governs; the primitive. Nodes, edges, conserved energy, scope-partitioned (one graph per `ownerId`). |
| `graph` (kind) | §3.9 (disambiguation) | L0 Protocol kind orthogonal to the level axis. Not an LM-level concept; referenced only to disambiguate from `MemGraph`. |
| `MemGraph` | §2.2 output | R0 TypeScript record (`{nodes, edges}`) — runtime in-memory representation of one scope's living graph. |
| `node` (LM) | §3.5 leaf | A `MemNode` record — unit of memory; M-layer computed from topology, never assigned. |
| `role` (on a node) | §6.11 substrate-vs-role | A semantic position a node plays under an adjacent framework's axioms. Adjacent-owned; the underlying record is LM-owned. |
| `edge` (LM) | §3.5 leaf | A `MemEdge` record — directed weighted relation. |
| `edge primitive type` | §3.5 leaf | `EdgePrimitiveType` enum `'anchor' \| 'relate' \| 'restructure' \| 'reinforce' \| 'suppress'`. Distinct from metaframework "primitive". |
| `primitive` (metaframework sense) | §3.2 | The indivisible concept LM's axes reason about — "living graph". |
| `energy` | §3.5 leaf | LMA4 conserved scalar. `ActivationMap` is the runtime representation. Never casual/metaphorical. |
| `ActivationMap` | §3.5 leaf | `Map<NodeId, number>` with Σ = 1 invariant per LMA4. |
| `traversal` (the operation) | §3.7 P8 pipeline | single LM generative operation (LMA6 pipeline). Read, write, inline learning are one pass. |
| `traverse()` / `runTraversal()` | §6.8 operator interface | R3 / R2 entry points that invoke the traversal operation. |
| `M-layer` | §3.5 leaf | Computed position `M0 \| M1 \| M2 \| M3 \| M4` derived from topology (LMA14–LMA17). Distinct from LIV-Standard R-layers. |
| `R-layer` | §3.9 (disambiguation) | LIV-Standard code-structure axis (R0–R5). Referenced for implementation pointers only. |
| `arm` | §3.5 leaf | Emergent subgraph detected by community structure. `MemArm` record. |
| `scope` | §3.5 leaf | `ownerId: string` non-empty. One independent graph per distinct value. |
| `binding` | §3.7 S2 | Resonance-detection step within traversal. `BindingResult` record. |
| `present state` | §3.5 leaf | Derived read of current graph state for LLM context injection, per-scope. `PresentState` record. |
| `dominance` | §3.7 S8 | Random-walk convergence score. `DominanceEntry` record. Drives M0 decision (LMA17). |
| `graph-relative threshold` | §3.5 leaf | Threshold derived from graph statistics (μ + kσ). No absolute numeric thresholds. `GraphThresholds` record. |
| `re-equilibration` | §3.6 LMA10 | LMA10 invariant: after removal, graph reaches valid state without structural rebuild. |
| `substance decision` | §3.5 leaf | `'create' \| 'reinforce'` tag on `GraphMutation` per LMA7. One decision per traversal. |
| `axiom kind` | §3.6 | Descriptive metadata: `Invariant \| Producer \| Mechanism \| Absence`. Not an E6 gate. |
| `base vs derived` | §3.6 LMA18 | Base columns persisted because input-origin. Derived columns/tables reconstructible from base + topology. |

**Retired terms (v2.0 → v2.1):** none — vocabulary carries forward unchanged. v2.0 retired `userId`, `fallthrough binding`, `two-graph model`, `field` (as one of three primitives); those remain retired in v2.1.

---

## §4 Validity

### §4.1 Gate count

LM declares **20 own primary gates** (G-LM1..G-LM12 + G-LM13a + G-LM13b + G-LM14..G-LM19, 1:1 with axioms per G-M1). Plus **52 framework-tier metaframework gates** inherited (per metaframework §4.1 enumeration).

| Tier | Count | Source | Executed when LM is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG4) | 4 | substrate §11.5 | run once, not per framework |
| LM-own axiom gates (G-LM*) | 20 | this §4.2 | framework-audit applies LMA1..LMA19 decomposed-axiom suite per MA-V1; LM executes G-LM1..G-LM12 at commit-time per S5 |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J4, G-G13) | 36 | metaframework §4.1 | inherited; test LM's conformance to MA-I1..MA-J4 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **20 + 52 = 72** | | |

LM's own 20 gates are executed in addition to the 52 inherited — same pattern as AS v2.2 / Plan v2.2 (framework-own gates supplement, do not replace, the inherited framework-tier suite).

### §4.2 LM-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 20 axioms → 20 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-LM1** | LMA1 | `forall n ∈ graph.nodes: (n.sourceText === null) === (n.cachedLayer <= M2_KNOWLEDGE)` | structural property (biconditional) |
| **G-LM2** | LMA2 | `forall n ∈ graph.nodes: typeof n.ownerId === 'string' && n.ownerId.length > 0; forall e ∈ graph.edges: typeof e.ownerId === 'string' && e.ownerId.length > 0` | structural property |
| **G-LM3** | LMA3 | `forall e ∈ graph.edges: let fromNode = graph.nodes.get(e.fromId); let toNode = graph.nodes.get(e.toId); fromNode.ownerId === toNode.ownerId === e.ownerId` | reference resolution (dual-source equality) |
| **G-LM4** | LMA4 | `forall activationMap produced at any step of a single traversal: abs(sum(activationMap.values()) - 1.0) < ε` (where ε is a numerical tolerance for floating-point accumulation; default ε = 1e-9) | structural property (aggregation) |
| **G-LM5** | LMA5 | `forall mutation m in commit log: m.sourceInvocationId references exactly one runTraversal invocation id; no mutation outside runTraversal path produces graph mutation records` | structural property (exclusive producer) |
| **G-LM6** | LMA6 | within one runTraversal: trace [bind, propagate, learn, sparsify, updateLayersLocally] executes with no interleaved external I/O (inspected via execution log; count of external calls between these steps === 0) | structural property (pipeline-atomicity) |
| **G-LM7** | LMA7 | `forall mutation m produced by runTraversal: m.substanceDecision ∈ {'create', 'reinforce'} && m.substanceDecision !== null at commit`; `forall side-effect-class ∈ {edgeFormation, weightUpdate, inlineLearning, layerRecomputation} produced in same invocation: tagged with same substanceDecision` | structural property (cardinality + predicate) |
| **G-LM8** | LMA8 | `forall n ∈ graph.nodes: survives(n, graph) === (connectivity(n, graph) >= graphThresholds.bind)` | structural property (biconditional) |
| **G-LM9** | LMA9 | `forall n ∈ graph.nodes where survives(n, graph) === false: n ∈ sparsify(graph).nodeDeletes` | structural property (implication) |
| **G-LM10** | LMA10 | `forall nodeId executed by removeNode: post-state graph G': (forall e ∈ G'.edges: graph.nodes.has(e.fromId) && graph.nodes.has(e.toId)) && (no partial commit artifacts) && (mem_arm + mem_dominance for that scope either updated or invalidated-for-regeneration)` | structural property (total-decomposition) |
| **G-LM11** | LMA11 | for each write path ∈ `{persistMutations, persistArms, persistDominance}`: each invocation wraps its writes in exactly one `BEGIN`/`COMMIT` boundary (inspected via DB transaction log; transaction count per invocation === 1) | structural property (cardinality) |
| **G-LM12** | LMA12 | static code analysis: enumerate mutation sites of `MemEdge.weight` and node energy-share; verify each site's call stack traces to a `runTraversal` invocation (no wall-clock-triggered mutation outside traversal; no scheduled decay task) | structural property (absence; enumerated check) |
| **G-LM13a** | LMA13a | `forall entry ∈ mem_dominance: entry.producerPath === 'recomputeDominance'` (inspected via producer-tag in commit log); no other producer path writes `DominanceEntry.computedAt` | structural property (exclusive producer) |
| **G-LM13b** | LMA13b | within runTraversal trace: zero blocking calls into `recomputeDominance` (inspected via execution log); zero writes to `mem_dominance` from runTraversal path | structural property (non-blocking) |
| **G-LM14** | LMA14 | `forall new MemNode n produced by runTraversal: n.cachedLayer === M4_INPUT at creation timestamp (pre-updateLayersLocally)` | structural property (initial-value) |
| **G-LM15** | LMA15 | static purity check on `computeLayer`: function body references only its four formal parameters `(node, graph, thresholds, dominanceMap)` + pure helper functions; zero reads of `node.cachedLayer` from within computeLayer | structural property (purity) |
| **G-LM16** | LMA16 | `forall n ∈ graph.nodes at any observable moment t: n.cachedLayer === computeLayer(n, graph_at_t, thresholds_at_t, dominanceMap_at_t)` (sampled at commit boundaries + post-updateLayersLocally; implementation memoization permitted iff memoized result equal to re-evaluated result) | structural property (equivalence) |
| **G-LM17** | LMA17 | `forall n ∈ graph.nodes where n.cachedLayer === M0_IDENTITY: the write producing that value traces to computeLayer(...) AND the dominance value read satisfied DominanceEntry.convergence >= graphThresholds.dom` (inspected via producer-tag); no other code path produces M0 status | structural property (exclusive producer) |
| **G-LM18** | LMA18 | empirical test: drop `mem_arm`, `mem_dominance`, and `cachedLayer`/`cachedClosure`/`cachedAsymmetry` on `mem_node` for a scope; re-run `detectArms`, `recomputeDominance`, `updateLayersLocally` from base rows of `mem_node` + `mem_edge` within that scope; assert reconstructed state equals pre-drop state (modulo ordering of async reconstructions) | structural property (reconstructibility) |
| **G-LM19** | LMA19 | `forall transition t where n.cachedLayer transitions from (> M2_KNOWLEDGE) to (<= M2_KNOWLEDGE): exactly one memory.source-pruned event emitted with payload {nodeId: n.id, fromLayer, toLayer, scope}` (inspected via event-bus log) | structural property (event-emission) |

**G-M1 self-check:** 20 axioms → 20 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Substance 4 gates (G-LM1, G-LM2, G-LM3, G-LM4 attaches at Substance/energy). Dynamics 8 gates (G-LM5, G-LM6, G-LM7, G-LM8, G-LM9, G-LM10, G-LM11, G-LM12). Derivation 8 gates (G-LM13a, G-LM13b, G-LM14, G-LM15, G-LM16, G-LM17, G-LM18, G-LM19). Every LM-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs LM against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I5):** tests LM's §1 Identity conformance to MA-I1..MA-I5.
- **E2 Schema (PG2 + G-S1..G-S3):** tests LM's §2 Schema conformance to MA-S1..MA-S3.
- **E3 Structure (PG3 + G-St1..G-St5):** tests LM's §3 Structure — primitive declaration completeness per MA-St1..MA-St5.
- **E4 Validity (PG4 + G-V1..G-V5):** tests LM's §4 Validity — every axiom has gate (MA-V1); gate tests condition directly (MA-V2); result binary/ternary (MA-V3); re-verification on state change (MA-V4); gate set exhaustive over X1–X10 (MA-V5).
- **E5 Lifecycle (PG5 + G-L1..G-L7):** tests LM's §5 Lifecycle — transitions additive (MA-L1); amendment trigger declared (MA-L2); confirmation monotonic (MA-L3); escalation typed (MA-L4); judgment deprecations declared (MA-L5); activation flow (MA-L6); bootstrap non-re-entrancy (MA-L7).
- **E6 Coupling (PG6 + G-C1..G-C6):** tests LM's §6 Coupling — carrier (MA-C1); custody per atom (MA-C2); provenance per output field (MA-C3); handoff rules (MA-C4); carrier-consistent emission (MA-C5); no re-ownership (MA-C6).
- **E7 Judgment (PG7 + G-J1..G-J4):** tests LM's §7 Judgment — declared or empty-declared per MA-J1..MA-J4.
- **E8 Universal + Meta (G-G13 + G-U1..G-U5 + G-M1..G-M4):** structural-identity test; self-application; propagation completeness; axiom-axis coverage; primitive declaration (via substrate); provenance completeness; axiom-gate 1:1 + exhaustive + execution-order + failure-escalation.

### §4.4 MA-V5 dimension coverage

Per metaframework §3.2 MA-V5 + framework-audit X1–X10:

| Dimension | Covered by gate |
|---|---|
| X1 (Identity) | E1 bundle; §1.2 MA-I1..MA-I5 satisfaction table |
| X2 (Custody) | E6 + §6.5 custody table |
| X3 (Coupling) | E6 + §6.2 HRs with captureShape |
| X4 (Scope) | §1 scopeOut; audited by E1 Identity check |
| X5 (Atom-ownership) | E6 + §6.5 custody single-owner-per-atom |
| X6 (Provenance) | E6 + G-U5 + §6.6 provenance |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration |
| X9 (Integration point) | E6 coupling gates + HR-LM5 (AS v2.2 emission-target receive-side) |
| X10 (Stage-declaration extended predicate) | §3.7.1 PR4/PR5 self-check + §3.7 P8 declarations |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG4): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 36 inherited (35 MA-axis-bound + G-G13) + 20 LM-own (G-LM*) = 56.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to LM.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 72 framework-tier gates (52 inherited + 20 LM-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-regen-cycle confirmation (§5.3). Gate IDs enumerated:

Inherited (52): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

LM-own (20): `G-LM1, G-LM2, G-LM3, G-LM4, G-LM5, G-LM6, G-LM7, G-LM8, G-LM9, G-LM10, G-LM11, G-LM12, G-LM13a, G-LM13b, G-LM14, G-LM15, G-LM16, G-LM17, G-LM18, G-LM19`.

Substrate-tier gates (SG1–SG4) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v2.0 (unshipped draft) → v2.1. Per MA-L1 additive: v2.0's axiom set (LMA1..LMA19 with LMA13 split = 20 atomic) preserved verbatim; `attachedTo` column added per v3.1 structural requirement. No axiom text drift, no axiom additions/deletions.

Scope of change (regen-shape-only; no semantic amendment):

- (a) A-18 nine-section file shape adopted (v2.0's 15-section v2.4 shape → v3.1 canonical `{Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment, Self-audit results, Change log}`).
- (b) Seven-axis shell (A1–A7) adopted per metaframework-v3-1 §3.1; v2.0's three domain axes (Substance/Dynamics/Derivation) preserved as LM-local P1 Axis instances nested under A3 Structure.
- (c) §3.2 Primitive declarations table authored per substrate §8 + §8.6 empty-declaration (P1=3, P2=15, P3=20, P4=20, P5=20, P6=6, P7=0 positive-empty, P8=8).
- (d) §3.7 P8 instances S1–S8 declared (LM Mode=generative requires P8 per substrate §8.3; decomposition minimal per AS P8 pattern per brief).
- (e) §4.2 LM-own gate suite G-LM1..G-LM19 (with LMA13 decomposed to G-LM13a + G-LM13b = 20 gates) authored 1:1 with axioms per G-M1.
- (f) §5 Lifecycle (this section) + §6.8 OperatorInterface + §1.1 GenesisDeclaration + §1 scopeOut row + §1.3 MA-G13 four-property test table + §7 Judgment + §8 Self-audit results authored fresh per authoring list.
- (g) §6.2 HR shape updated to substrate §8.2 amended P6 (id, direction, carrierApplicability, diagnosticSignificance, captureShape, invariant); six HRs (HR-LM1..HR-LM6) declared with captureShape per substrate §8.2.
- (h) Output-schema `provenance` field populated per metaframework §2.2 (reference-default per A-20); v2.0 §9.1 per-field provenance retained as §2.2.1.
- (i) §6.5 custody table refreshed: AS v2.2 / Plan v2.2 / M-I v2.3 version pins applied; v2.0 §7.1 + §7.2 + §7.3 content folded into §6.5 + §6.9 + §6.11.
- (j) R5 types file `living-memory.types.ts` consumes primitives.ts (custody verified, not regenerated per brief); R5 constants file `living-memory.ts` declares framework identity + axiom/gate/HR ID sets.

Regen path: generation-procedure-v1-0 S1–S12 template-generation under metaframework-v3-1.

### §5.2 Amendment trigger

Gap-driven per MA-L2 enum `{vision, gap, L0-directive}`. Trigger: cycle-4 audit outcome #3 (structural-regen-required) against LM v2.0 draft, per spec-lm-regen-v3-1. Driving findings (from audit-findings-table.md §1, LM-F1..LM-F15):

- (i) A-18 file-shape violation (LM-F1): 15 sections vs v3.1 canonical 9.
- (ii) Gate system absence (LM-F2 + LM-F15): no LM-own per-axiom gates; no 52 framework-tier surface.
- (iii) Primitive declarations table absent (LM-F5): P1–P8 declarations not in v3.1 shape.
- (iv) HR shape mismatch (LM-F6): v2.4 three-column shape vs substrate §8.2 amended P6.
- (v) §5 Lifecycle, §7 Judgment, §8 Self-audit absent as sections (LM-F7, LM-F8, LM-F9).
- (vi) GenesisDeclaration, OperatorInterface, output-schema provenance, scopeOut, MA-G13 four-property test absent (LM-F10, LM-F11, LM-F12, LM-F13, LM-F3).
- (vii) Custody version pins stale (LM-F4): cited AS v2.1 / Plan v2.1 / M-I v2.2; v2.1 pins to AS v2.2 / Plan v2.2 / M-I v2.3.
- (viii) Authority drift (LM-F14): self-identified as v2.4 regen; v2.1 regen is against v3.2.1.

### §5.3 Confirmation gate

Pending L0 at cycle closure. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery. No Kind A escalations raised during regen; every finding from audit-findings-table.md root was in LM v2.0 file (no upstream cascade to substrate / metaframework / registry / generation-procedure / framework-audit / amendment-propagation).

### §5.5 Judgment deprecations

Empty at delivery. LM declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

v2.0 → v2.1 did not flip any judgment step to mechanical (LM's validity was already fully mechanical in v2.0; P7=0 was implicit under v2.4 shape, now explicitly positive-empty-declared under v3.1).

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| S1 Input receipt (HR-LM1/HR-LM2/HR-LM3) | Schema violation on input atom (e.g., empty `ownerId`, malformed `DirectInsertInput.edges`) | Return `Result { ok: false, error: LivingMemoryError { code: 'LM_INPUT_INVALID' } }` before S2; no graph mutation. |
| S2 Bind phase | `encode(text)` infrastructure failure (LIV-Standard R4 dependency) | Return `Result { ok: false, error: LivingMemoryError { code: 'LM_BIND_INFRASTRUCTURE_FAILED' } }`; no mutation. |
| S3 Propagation | `normalize()` failure (Σ = 1 not reachable — degenerate seed) | Abort traversal; `substanceDecision: null`; return `Result { ok: true, data: null }` (LMA-compliant null TraversalResult). |
| S5 LM-own gate failure at commit-time | Any G-LM1..G-LM12 fails against `GraphMutation` draft | Return `Result { ok: false, error: LivingMemoryError { code: 'LM_VALIDITY_FAILED', failedAxiom: 'LMA<n>' } }`; no commit. |
| S7 Commit | `persistMutations` DB transaction fails (e.g., constraint violation, connection lost) | Transaction rolls back per LMA11; in-memory graph state rebuilt from Postgres per brief §13 item 7 truth contract; return `Result { ok: false, error: LivingMemoryError { code: 'LM_COMMIT_FAILED' } }`. |
| S8 Post-commit derivations | `detectArms` / `recomputeDominance` failure | Async: next traversal re-runs derivations per LMA18 reconstructibility; log event `memory.derivation-rerun-scheduled`; graph stays at post-S7 state (unchanged derivation caches acceptable per LMA18). |
| HR-LM4 Event emission | Event bus (F-event-system) unavailable | Best-effort emit; LM's commit discipline (LMA11) does not block on bus availability; downstream observability degrades gracefully. |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-scope graph size: bounded by caller program's scale policy (no LM hard cap; PG1's primitive completeness + LMA3 scope-partitioning keep per-scope graphs finite).
- Per-traversal propagation depth: `O(graph)` worst case; mitigated by top-K competition + lateral inhibition in `propagate` (brief §13 item 9: `detectArms` moved async for O(n³) removal from critical path).
- Per-scope dominance recomputation: `O(graph × walks)` where walks is a configured constant; async per LMA13a.
- Active-traversal concurrency: one `runTraversal` per `ownerId` serialized via per-scope mutex (brief §13 item 6); cross-scope traversals run concurrently.

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations` (substrate §13.4 reference):

- **Traversal pipeline (LMA6):** atomic in the sense of "no external I/O between bind/propagate/learn/sparsify/updateLayers." Substrate §13.4 "owned framework execution: interruptible" applies — per-step checkpoint = P8 `order` value; recovery via re-entry from failed step with upstream state reloaded.
- **Graph mutation commit (LMA11):** atomic — exactly one DB transaction per `persistMutations` / `persistArms` / `persistDominance` invocation. Single BEGIN/COMMIT boundary.
- **Post-commit derivations (S8):** eventually consistent; not atomic with commit. Reconstructible per LMA18 (atomicity relaxed for derivations by design — brief §13 item 8).
- **Direct-insert path:** atomic at the same LMA11 boundary; `directInsert(ownerId, node, edges)` executes its mutation in a single transaction.
- **Event emission (HR-LM4):** best-effort (not atomic with commit); downstream observability degrades gracefully per §5.6.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.1 | (pre-cycle, shipped) | Reference ancestor; MA1..MA6 compound axiom set; fallthrough binding permitted; `userId: string \| null` (null = global). github.com/demos-ra/living-memory archive. | L0 |
| v2.0 | (unshipped draft) | Authored against metaframework v2.4. Regen from v1.1: axes introduced (Substance/Dynamics/Derivation); axioms decomposed to LMA1..LMA19 with LMA13 split = 20 atomic; MA4 demoted to descriptive; fallthrough binding repealed (one scope-parameterized graph); `userId` → `ownerId`; admin collapsed into `directInsert`; `substanceDecision` field; LMA18 reconstructibility. Failed cycle-4 audit (outcome #3 — structural-regen-required) against metaframework v3.1 HEAD. | L0 (draft, unshipped) |
| v2.1 | 2026-04-24 (LM regen cycle) | Regenerated against metaframework-v3-1 via generation-procedure-v1-0. v2.0 portable content carried forward (~60% per audit §5 estimate); authored-fresh content per authoring list. No axiom additions, deletions, or re-writes (AxR3 additive; LMA1..LMA19 with LMA13 split preserved verbatim). Structural regen — shape adopts v3.1 nine-section file shape + seven-axis shell + primitive declarations table + G-LM1..G-LM19 (20 with LMA13 decomposed) + §5 Lifecycle + §7 Judgment + §8 Self-audit + §6.8 OperatorInterface + §1.1 GenesisDeclaration + §1 scopeOut + §1.3 MA-G13 four-property test + output-schema provenance. Custody pinned to AS v2.2 / Plan v2.2 / M-I v2.3. | L0 (pending regen-cycle confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Living Memory carrier = `self`. LM emits its own artifact — the persisted living-graph state transition — via the `traverse` → `persistMutations` pipeline ending at S7 commit. No enclosing framework wraps LM's output at the graph-write layer; adjacent frameworks (AS v2.2, Plan v2.2, M-I v2.3) declare roles that ride on LM's substrate atoms (substrate-vs-role pattern, §6.11) but do not assume carrier ownership.

**Cross-framework calibration:** AS v2.2 is the upstream adjacent framework whose `ArtifactEmission.writes.a7` content lands as `MemNode` + `MemEdge` records in the living graph. AS's emission mechanics invoke LM's R3 surface (either `traverse` or `directInsert`); LM's `self` carrier is invoked from within AS's emission pipeline. Plan v2.2 and M-I v2.3 reach LM indirectly through AS's carrier. This is the carrier-chain calibration point per spec §Constraints.

### §6.2 Handoff rules

Six framework-local HR instances. All LM-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-LM3 and HR-LM4 where diagnostic capture is consolidated at HR-LM1/HR-LM2 commit-time).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-LM1** | caller → living-memory (traverse) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-LM2** | caller → living-memory (direct-insert) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-LM3** | caller → living-memory (read surface: present-state / graph / arms) | `['self', 'named', 'none']` | `false` | n/a (read-only; no state mutation; capture is at commit-time via HR-LM1 / HR-LM2) |
| **HR-LM4** | living-memory → F-event-system (event bus emission) | `['self', 'named', 'none']` | `false` | n/a (best-effort emission; LMA11 does not block on bus; events are diagnostic not contract) |
| **HR-LM5** | living-memory → artifact-standard v2.2 (emission-target receive-side) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-LM6** | living-memory → framework-audit (audit-query receive-side) | `['self', 'named']` | `true` | declared §6.3 |

**Inherited HRs referencing LM:**

| HR | Owning declaration | LM's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → LM type consumption; LM consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; LM is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records LM's framework declaration per provenance contract (see §6.6) |
| HR-Ar1 / HR-Ar2 | artifact-standard-v2-2 §6 | AS → content-framework; LM is AS's emission target — AS invokes LM's R3 surface at HR-LM1 or HR-LM2 to land `writes.a7` content; LM's `self` carrier is invoked from within AS's emission pipeline |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by LM.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-LM1 — caller → LM (traverse invocation):**
```
captureShape = {
  capturedFields: ['callerFrameworkRef', 'callerVersion', 'ownerId', 'traverseInputHash', 'mutationId', 'substanceDecision', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; per-scope mutation resolved via (ownerId, mutationId)'
}
```

**HR-LM2 — caller → LM (direct-insert invocation):**
```
captureShape = {
  capturedFields: ['callerFrameworkRef', 'callerVersion', 'ownerId', 'insertNodeId', 'insertEdgeCount', 'mutationId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-LM3:** no captureShape declared (`diagnosticSignificance: false`); read-only contract; diagnostic data captured at HR-LM1 / HR-LM2 commit-time.

**HR-LM4:** no captureShape declared (`diagnosticSignificance: false`); best-effort event emission; event payloads captured by F-event-system's own observability (not LM's concern).

**HR-LM5 — LM → AS v2.2 (emission-target receive-side):**
```
captureShape = {
  capturedFields: ['asEmissionId', 'asFrameworkVersion', 'ownerId', 'anchorNodeId', 'companionNodeId', 'writesA7Snapshot', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; AS emission resolved via ArtifactEmission.writes.a7.artifactAnchorNodeId'
}
```

Cross-framework calibration: AS v2.2's `ArtifactEmission.writes.a7` is the source of truth for the receive-side capture. Capture shape matches AS v2.2 HR-Ar1/HR-Ar2 receive-side contract by construction (MA-C3 handoff-invariant symmetry).

**HR-LM6 — LM → framework-audit (audit-query receive-side):**
```
captureShape = {
  capturedFields: ['auditRequestId', 'targetFrameworkRef', 'auditRunId', 'timestamp', 'authorityClaim'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C6 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'self'`.
- **MA-C2** (custody per atom): §6.5 enumerates every LM-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-LM1..HR-LM6 send/receive shapes matched by construction; captureShape contracts symmetric where applicable. HR-LM5 symmetric with AS v2.2 HR-Ar1/HR-Ar2.
- **MA-C4** (provenance per output field): §2.2.1 every output field has declared provenance category (caller / runtime-computed / consumed-verbatim); §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'self'` → LM emits its own W-ATOMs per MA-S2; §2.2 outputs are LM-owned W-ATOMs (not AxiomRef[]).
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; AS v2.2 / Plan v2.2 / M-I v2.3 atoms referenced at §2.5 are not re-owned (custody remains with respective owners). §6.11 substrate-vs-role pattern explicitly prevents re-ownership of LM-owned substrate atoms (`MemNode`, `MemEdge`) by consumer frameworks.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | living-memory (every MemNode/MemEdge/MemArm field), every graph-aware framework |
| `Semver` | primitives.ts | core/R5 | living-memory (§1 version), every versioned framework |
| `Result<T, E>` | primitives.ts | core/R5 | living-memory (R3 async return wrapper), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | living-memory (§2.2 `LivingMemoryError` extends), every error-carrying framework |
| `Mode` | substrate | L1 (substrate §2) | living-memory (§1 Identity `Mode = generative`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | living-memory (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | living-memory (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | living-memory (§2.1 input W-ATOMs, §2.2 output W-ATOMs) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | living-memory (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | living-memory (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | living-memory (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed) | living-memory (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed) | living-memory (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | living-memory (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed) | living-memory (inherited via HR-LM1/HR-LM2 invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed) | living-memory (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed) | living-memory (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | living-memory (§3.7 P8 instances S1–S8) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | living-memory (§3.7.1 PR5 self-check) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | living-memory (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | living-memory (empty-declaration basis §7.1; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | living-memory (empty-declaration basis per MA-J4) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | living-memory (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | living-memory (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | living-memory (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | living-memory (§8.2 dimension results schema reference) |
| `ArtifactEmission` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | living-memory (HR-LM5 receive-side; writes.a7 payload lands as MemNode/MemEdge records) |
| `MemNode` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec (graph read surface); artifact-standard v2.2 (anchor/companion/content roles ride on this record per §6.11 substrate-vs-role); plan-standard v2.2 (indirect via AS carrier); multi-instance-standard v2.3 (indirect via AS carrier); F-chat |
| `MemEdge` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec; artifact-standard v2.2 (four edge-kind roles ride on this record per §6.11 substrate-vs-role); plan-standard v2.2 (indirect); multi-instance-standard v2.3 (indirect) |
| `EdgePrimitiveType` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec (routing); artifact-standard v2.2 |
| `MemGraph` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec (`getGraph(ownerId)`) |
| `ActivationMap` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal) |
| `MLayer` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec |
| `MemArm` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-codec |
| `DominanceEntry` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal) |
| `GraphMutation` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal; includes `substanceDecision`) |
| `GraphThresholds` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal) |
| `BindingResult` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal) |
| `TraversalResult` | living-memory | L3 (this file §2 + core/R5) | living-memory (emission surface); F-chat; F-codec |
| `TraversalOptions` | living-memory | L3 (this file §2 + core/R5) | living-memory (input shape); F-chat; F-codec |
| `TraverseInput` | living-memory | L3 (this file §2 + core/R5) | living-memory (input W-ATOM); F-chat; F-codec |
| `PresentState` | living-memory | L3 (this file §2 + core/R5) | living-memory (output W-ATOM); F-chat |
| `PresentStateStatement` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal) |
| `ConfidenceTier` | living-memory | L3 (this file §2 + core/R5) | living-memory (internal); F-chat |
| `MemoryVitalSigns` | living-memory | L3 (this file §2 + core/R5) | living-memory (R3 hook → dashboard) |
| `DirectInsertInput` | living-memory | L3 (this file §2 + core/R5) | living-memory (input W-ATOM); F-codec (authorized callers) |
| `DirectInsertBatchInput` | living-memory | L3 (this file §2 + core/R5) | living-memory (input W-ATOM); F-codec (authorized callers) |
| `PresentStateInput` / `GraphReadInput` | living-memory | L3 (this file §2 + core/R5) | living-memory (input W-ATOMs); F-chat; F-codec |
| `LMHandoffRuleInstance` | living-memory | L3 (this file §6.2 + core/R5) | living-memory (internal); framework-audit (X3 C5 captureShape check) |
| `LMGateResult` | living-memory | L3 (§4 + core/R5) | living-memory (internal); framework-audit (SelfAuditRecord consumption) |
| `LMDimensionResult` | living-memory | L3 (§4.4 + core/R5) | living-memory (internal); framework-audit (SelfAuditRecord consumption) |
| `LMCustodyRow` | living-memory | L3 (§6.5 + core/R5) | living-memory (internal); framework-audit (custody-check X2/X5) |
| `LivingMemoryError` | living-memory | L3 (§2 + core/R5) | living-memory (internal); extends primitives.ts `AppError` |
| `SubstanceDecision` / `SubstanceDynamicsPhase` / `TraversalState` / `DerivationKind` / `SubstancePositional` | living-memory | L3 (§3.8 + core/R5) | living-memory (internal); framework-audit |
| `NodeRef` / `EdgeRef` / `ScopeKey` / `ArmMembership` / `MutationCommitRef` / `GraphReadRef` / `EdgeKind` / `LayerRef` | living-memory | L3 (§3.8 + core/R5) | living-memory (internal) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.1' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.1' },
  generationTimestamp:      '2026-04-24T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput
  sourceInputValue:         undefined                       // by-value opt-in flag not set
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in. Not opted in at this cycle.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

LM carrier = `self`. Applicability enforcement at handoff time:

- HR-LM1 `['self', 'named']`: caller carrier ∈ set → applicable; covers both self-carrier callers (AS v2.2) and named-carrier callers (F-chat invoking traverse directly).
- HR-LM2 `['self', 'named']`: same as HR-LM1 for direct-insert.
- HR-LM3 `['self', 'named', 'none']`: read surface applies regardless of caller carrier — reads are contract-free relative to carrier.
- HR-LM4 `['self', 'named', 'none']`: event emission applies regardless of subscriber carrier.
- HR-LM5 `['self', 'named']`: AS v2.2 carrier is `self` (AS owns its emission); LM's receive-side applies when upstream carrier ∈ {self, named}.
- HR-LM6 `['self', 'named']`: framework-audit carrier is `self`; LM's receive-side applies.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

LM's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoints: [
    'traverse(input: TraverseInput) -> Result<TraversalResult | null, LivingMemoryError>',
    'directInsert(input: DirectInsertInput) -> Result<void, LivingMemoryError>',
    'directInsertBatch(input: DirectInsertBatchInput) -> Result<{inserted: number; traversed: number}, LivingMemoryError>',
    'getPresentState(input: PresentStateInput) -> Result<PresentState, LivingMemoryError>',
    'getGraph(input: GraphReadInput) -> Result<MemGraph, LivingMemoryError>',
    'getArms(input: GraphReadInput) -> Result<MemArm[], LivingMemoryError>',
    'onBoot() -> Result<void, LivingMemoryError>',
    'reloadScope(ownerId: string) -> Result<void, LivingMemoryError>'
  ],
  configurationInputs: [
    'per-scope ownerId (input to every R3 entry)',
    'GraphThresholds (derived from graph statistics; no absolute numeric thresholds)',
    'LABEL_REUSE_THRESHOLD (substance-decision dedup gate; compile-time constant per brief §13)',
    'traversal pipeline constants (lr learning rate, top-K, propagation depth — compile-time per LIV-Standard R4 config)'
  ],
  observableOutputs: [
    'TraversalResult (activation + topNodes post-traverse)',
    'PresentState (LLM context injection per-scope)',
    'MemGraph / MemArm[] (read surface)',
    'MemoryVitalSigns (9 graph-relative metrics; R3 hook → dashboard)',
    'event emissions: memory.traversal-complete, memory.node-created, memory.layer-changed, memory.source-pruned, memory.arm-detected, memory.arm-merged, memory.dominance-updated (HR-LM4 via F-event-system)'
  ],
  errorContract: 'LivingMemoryError codes: LM_INPUT_INVALID | LM_BIND_INFRASTRUCTURE_FAILED | LM_VALIDITY_FAILED (with failedAxiom) | LM_COMMIT_FAILED | LM_SCOPE_NOT_FOUND | LM_PERMISSION_DENIED',
  extensibility: 'Per-scope graphs added by any new ownerId value (no LM amendment required); substance-decision enum extension or new edge-primitive-type requires axiom-set amendment per AxR3; new event types added via HR-LM4 without LM amendment (event schema not LM-owned)'
}
```

V5 verification: this operator interface is declaratively complete at v2.1 (every invocation path + configuration input + observable + error listed).

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | LM consumes | LM emits | HR binding |
|---|---|---|---|
| F-identity / LIV-Standard core/R5 | `ownerId`, `NodeId`, `Result<T>`, `Semver` | — | HR1 inherited (substrate type consumption) |
| Cognitive Standard v1.2 (F-codec R3) | `text` input at traversal boundary; classification outputs arrive as content that becomes `MemNode` records via substrate-vs-role pattern | `MemGraph`, `MemArm[]`, `MLayer`, `MemNode[]`, `MemEdge[]` (read surface); `TraversalResult` | HR-LM1 (inbound); HR-LM3 (read outbound) |
| Artifact Standard v2.2 (F-artifact R3) | `ArtifactEmission.writes.a7` at the AS→LM emission boundary (AS invokes LM's R3 traverse or directInsert within AS's commit pipeline) | `MemNode` records playing AS-declared roles (anchor, companion, content); `MemEdge` records playing AS-declared kinds | HR-LM5 (inbound from AS emission); HR-LM1/HR-LM2 (R3 invocation surface) |
| Plan Standard v2.2 | (indirect — no direct consumption; Plan's `PlanArtifactContent` rides inside AS's `ArtifactPayload.content`; lands in LM via AS's commit pipeline) | (indirect — LM's MemNode + MemEdge records become Plan's anchor + companion via AS's role mapping) | via AS (HR-LM5 + AS HR-Ar1/HR-Ar2) |
| Multi-Instance Standard v2.3 | (indirect — M-I reads plan anchor via AS's `planAnchorNodeId`; reads into LM via HR-LM3 read surface) | (indirect — LM's read surface provides plan anchor + companion + children data to M-I) | HR-LM3 (M-I consumes read surface) |
| F-chat (R4 `lm-io`) | `TraverseInput`, `ownerId` | `TraversalResult`, `PresentState` | HR-LM1 (traverse); HR-LM3 (present-state read) |
| F-event-system (R3 event bus) | — | `memory.traversal-complete`, `memory.node-created`, `memory.layer-changed`, `memory.source-pruned`, `memory.arm-detected`, `memory.arm-merged`, `memory.dominance-updated` | HR-LM4 (outbound event emission) |
| F-codec admin | `DirectInsertInput`, `DirectInsertBatchInput` (permissions enforced above LM) | `Result<void>`, `Result<{inserted, traversed}>` | HR-LM2 (direct-insert); permissions at caller layer |
| framework-audit | audit-query invocations (X1..X10 evaluation against LM's §§1–8) | `LMGateResult[]`, `LMDimensionResult[]` (via HR6 output contract) | HR-LM6 (audit-query receive-side); HR3 inherited |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| `TraverseInput` | caller constructs → HR-LM1 inbound → S1 validates |
| `TraversalResult` | S7 emits → caller receives `Result<TraversalResult \| null>` |
| `DirectInsertInput` | caller constructs (with permission) → HR-LM2 inbound → S1 validates |
| `PresentState` | caller invokes `getPresentState(ownerId)` → HR-LM3 outbound → computed via `computePresentState(graph)` |
| `MemNode` / `MemEdge` (AS writes) | AS v2.2 composes `ArtifactEmission.writes.a7` → AS invokes LM's traverse or directInsert → HR-LM5 receive-side → S1..S7 land records in graph |
| event emissions | S7 commit success → HR-LM4 outbound → F-event-system dispatches to subscribers |
| `MemoryVitalSigns` | R3 hook → dashboard (HR-LM3-class; read-only vital signs surface) |

### §6.11 Carrier relation (H5), substrate-vs-role, and boundary notes

LM `carrier = self`. LM owns the substrate atoms (`MemNode`, `MemEdge`) and emits its own artifact — the persisted living-graph state transition.

**Substrate-vs-role pattern** (carry-forward from v2.0 §7.3; MA-C6 no-re-ownership enforcement mechanism):

LM owns the substrate atoms `MemNode` and `MemEdge`. Adjacent frameworks declare *roles* that ride on these records. An AS v2.2 "artifact anchor node" is a `MemNode` playing an AS-defined role, not a new record type. This prevents re-ownership violations per MA-C6: substrate custody stays with LM; role semantics stay with the adjacent framework.

Cross-framework role bindings at v2.1:

| LM-owned substrate atom | Consumer framework | Role |
|---|---|---|
| `MemNode` | Artifact Standard v2.2 | artifact-anchor / companion / content node (per AS ArA1..ArA8 role typing) |
| `MemNode` | Plan Standard v2.2 | plan-anchor (alias for AS's `artifactAnchorNodeId` where `framework.id === 'plan'`) |
| `MemNode` | Multi-Instance Standard v2.3 | plan-anchor (read by M-I via AS's planAnchorNodeId; reads only, no mutation) |
| `MemNode` | Cognitive Standard v1.2 | classification-node (F-codec typing; LM records the classification as content on a MemNode) |
| `MemEdge` | Artifact Standard v2.2 | edge-kind: version / depends-on / companion-of / anchor-of (per AS ArA4* role typing) |

Candidate for metaframework H6 amendment upon second confirming case (carry-forward observation from v2.0; v2.1 preserves this as an architectural observation).

**Emission-chain calibration:**

```
// AS v2.2 emission pipeline (not LM code):
const asEmission = asCarrier.commit(artifactPayload)
  |--> AS constructs MemNode + MemEdge set per writes.a7
  |--> AS invokes LM.traverse(TraverseInput{text, ownerId, options: {primitiveType: 'anchor'}})
       OR
       AS invokes LM.directInsert(DirectInsertInput{ownerId, node, edges})
  |--> LM S1..S7 executes; S7 persistMutations lands records in mem_node + mem_edge
  |--> LM emits memory.node-created + memory.layer-changed events (HR-LM4)
  |--> LM returns Result<TraversalResult | null> or Result<void> to AS
  |--> AS emits ArtifactEmission with writes.a7 populated from LM's persisted state
```

**Cross-framework calibration points:**

| LM reference site | Adjacent framework atom | Cycle-cross notes |
|---|---|---|
| §2.5 consumed types | `ArtifactEmission.writes.a7` (AS v2.2) | AS v2.2 ArA1/ArA2 node typing preserved; LM records the writes.a7 payload as MemNode+MemEdge records atomically per LMA11 |
| §6.5 custody row `MemNode` / `MemEdge` (AS consumer column) | AS v2.2 §6.5 role-node custody rows | substrate-vs-role: AS declares role, LM owns substrate record |
| §6.5 custody row `MemNode` (Plan consumer column) | Plan v2.2 plan-anchor role | indirect via AS carrier; plan-anchor is a structural alias for AS's artifactAnchorNodeId when framework.id === 'plan' |
| §6.5 custody row `MemNode` (M-I consumer column) | M-I v2.3 plan-anchor read | indirect via AS carrier + LM read surface (HR-LM3) |
| §3.7 S7 (commit path) | AS v2.2 emission pipeline | LM's commit is invoked from within AS's emission pipeline; LM's carrier=self applies at the graph-write layer; AS's carrier=self applies at the artifact-emission layer (different abstraction levels; no carrier collision) |
| §5.6 failure mode `LM_COMMIT_FAILED` | AS v2.2 `ArtifactError.code: 'ARTIFACT_COMMIT_FAILED'` | AS maps LM commit failures to its own error taxonomy; LM does not see AS error codes |

**Boundary notes:**

- **Carrier non-collision.** AS v2.2 has `carrier=self` (owns artifact emission mechanics); LM has `carrier=self` (owns graph-write mechanics). Both are `self` because they operate at different abstraction levels: AS's emission is a sequence of LM operations (and other operations); LM owns the primitive graph-write operation. No enclosing framework wraps either at its own level.
- **No re-ownership.** Consumer frameworks (AS v2.2, Plan v2.2, M-I v2.3) declare roles that ride on LM's substrate atoms but do not re-own them. Custody table §6.5 has single owner per atom per MA-C6.
- **Scope partitioning.** `ownerId`-partitioning is a first-class invariant (LMA2 + LMA3). L0's scope is one `ownerId` value among many — no special-case "global" graph; the fallthrough-binding mechanism repealed in v2.0 remains repealed in v2.1.
- **Indirect consumers.** Plan v2.2 and M-I v2.3 appear in §6.5 custody consumer lists for `MemNode` and `MemEdge` because their structural declarations reference these atoms through AS v2.2's role mapping. The consumption is indirect through AS's carrier; neither Plan nor M-I invokes LM's R3 surface directly at v2.1/v2.2/v2.3.

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "LM's runtime decisions are all mechanical predicates reducible to substrate §6.3 mechanical-criterion ground:

    - M-layer assignment: computeLayer(node, graph, thresholds, dominanceMap) is a pure function of its inputs per LMA15 (no historical cachedLayer influence). LMA15 is itself a purity predicate verifiable by static code analysis (G-LM15 ground class: structural property).
    - M0_IDENTITY assignment: produced exclusively by computeLayer reading DominanceEntry.convergence >= graphThresholds.dom per LMA17. Exclusive-producer predicate (G-LM17 ground class: structural property).
    - Substance decision: runTraversal resolves 'create' vs 'reinforce' by comparing bind-before-create outcome (bind similarity >= LABEL_REUSE_THRESHOLD) to a compile-time constant. Numeric-comparison ground (G-LM7 ground class: structural property + cardinality).
    - survives(n) threshold check: LMA8 biconditional — survives(n) iff connectivity(n) >= graphThresholds.bind. Numeric-comparison ground (G-LM8 ground class: structural property).
    - graphThresholds derivation: μ + kσ over graph statistics — arithmetic aggregation over base graph state; mechanical per substrate §6.3 aggregation class.
    - sparsify prune-fraction + top-K + lateral-inhibition: arithmetic + top-K selection per graph state; mechanical.

   No LM decision consumes a non-mechanical judgment input. MA-J4 emptyDeclared satisfied with positive basis citing LMA15 purity + LMA17 mechanical-decision-tree + LMA8 threshold predicate + §3.9 vocabulary graph-relative-threshold derivation."
}
```

### §7.2 Axis status

`A7 Judgment` axis status: `emptyDeclared: true` with positive basis above. Gate coverage:

- **G-J1** (J-input-typing): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J2** (mechanical-criterion ground): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J3** (provenance for J-input): vacuous per §7.1 empty set.
- **G-J4** (J-axis emptyDeclared or non-empty): passes via `emptyDeclared: true` with declared basis.

### §7.3 Judgment provenance

Per metaframework §7.4: empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 72 framework-tier gates (52 inherited + 20 LM-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation post-regen-cycle confirmation.

Per framework-audit §8.2 canonical pattern: §8.1 is populated by framework-audit SelfAuditRecord after first-run execution. LM's delivery-time state is `pending-first-run`.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Identity | declared-complete | §1 populated; §1.1 GenesisDeclaration; §1.2 MA-I1..MA-I5 satisfaction; §1.3 MA-G13 four-property test with hidden-sibling check |
| X2 Custody | declared-complete | §6.5 every atom with owner + layer + consumers |
| X3 Coupling | declared-complete | §6.2 HRs with captureShape per substrate §8.2 amended P6; diagnosticSignificance declared per HR |
| X4 Scope | declared-complete | §1 scopeOut row with 10 entries (mirrors AS/M-I/Plan scopeOut pattern) |
| X5 Atom-ownership | declared-complete | §6.5 single owner per atom; no re-ownership per MA-C6; §6.11 substrate-vs-role pattern makes role-vs-substrate distinction explicit |
| X6 Provenance | declared-complete | §6.6 reference-default per A-20; §2.2.1 per-field provenance classification |
| X7 Lifecycle | declared-complete | §5 full lifecycle section (§5.1–§5.9) |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated per substrate §4 A-14 |
| X9 Integration point | declared-complete | §6.9 cross-framework handoff contracts; HR-LM5 AS v2.2 emission-target receive-side declared |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8 instances S1–S8 declared with stage + kind per substrate §8.3; §3.7.1 PR4 monotonicity + PR5 kind-alignment self-check both pass |

All ten audit dimensions declaratively complete at delivery. Framework-audit first-run ratifies at post-cycle confirmation.

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application) at metaframework-v3-1 §4.3: framework-audit runs X1–X10 against LM post-regen-cycle confirmation. At v2.1 delivery, self-audit is a declared-placeholder state — §3.7.1 PR4/PR5 self-check + §3.2 primitive-count self-check + §3.6 AxR1/AxR2/AxR3/AxR4 self-check are author-side pre-verifications, not framework-audit first-run execution.

LM does not self-apply its own gate suite at runtime (LM is Mode=generative, not verificative). LM's G-LM1..G-LM19 gates are executed in two distinct contexts:

1. **Commit-time (S5):** G-LM1..G-LM12 execute against each `GraphMutation` draft as part of the traversal pipeline. These are cheap invariant checks over the mutation + pre-state.
2. **Framework-audit-time (HR3 invocation):** framework-audit runs all 20 G-LM* gates + 52 inherited framework-tier gates against LM as the audit target. This is LM's "self-audit" in the G-U1 sense — not LM auditing LM, but framework-audit auditing LM.

First framework-audit first-run post-regen-cycle ratifies initial state.

---

## §9 Change log

| From | Change | Source |
|---|---|---|
| v2.0 (unshipped draft) | Regenerated against metaframework-v3-1 via generation-procedure-v1-0 (LM regen cycle; post-L3-regen-wave; cycle-4 audit outcome #3 remediation). v2.0 authored against metaframework v2.4 and failed cycle-4 audit (10 P1 structural findings + 4 P2 mechanical findings per audit-findings-table.md §1). | spec-lm-regen-v3-1 + cycle-4 audit-report.md §1 Outcome #3 |
| v2.0 | A-18 nine-section file shape adopted (v2.0's 15-section v2.4 shape → v3.1 canonical `{Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment, Self-audit results, Change log}`). Closes LM-F1. | v3-1-spec §4.2 + substrate §9 A-18 |
| v2.0 | Seven-axis shell (A1–A7) adopted per metaframework-v3-1 §3.1. v2.0's three domain axes — Substance, Dynamics, Derivation — preserved as LM-local P1 Axis instances nested under A3 Structure (carry-forward per audit §5). | metaframework §3.1 binding |
| v2.0 | §3.2 Primitive declarations table authored per substrate §8 + §8.6 empty-declaration. P1=3, P2=15, P3=20, P4=20, P5=20, P6=6, P7=0 positive-empty-declared, P8=8. Closes LM-F5. | substrate §8 + §8.6 |
| v2.0 | §3.7 P8 procedure step instances S1–S8 authored (LM Mode=generative; P8 required per substrate §8.3). Minimal decomposition per AS P8 pattern per brief §Authoring list: canonical operation `runTraversal` decomposes to receive → validate → bind → propagate+learn+sparsify → gate-execute → commit → post-commit-derivations. §3.7.1 PR4 monotonicity + PR5 stage-kind alignment self-check both pass. | substrate §8.3 + brief |
| v2.0 | §4.2 LM-own gate suite G-LM1..G-LM12 + G-LM13a + G-LM13b + G-LM14..G-LM19 = 20 gates authored 1:1 with axioms per G-M1. Closes LM-F2 + LM-F15. v2.0 §11 had only metaframework v2.4 E1–E8 gates; v2.1 replaces with LM-own axiom gates + 52 inherited framework-tier gates. | G-M1 + MA-V1 + brief §Authoring list |
| v2.0 | §5 Lifecycle authored (full) with §5.1 version transition, §5.2 amendment trigger, §5.3 confirmation gate, §5.4 escalation state, §5.5 judgment deprecations, §5.6 failure modes, §5.7 scale bounds, §5.8 atomicity declarations, §5.9 version history. Closes LM-F7. | MA-L1..MA-L7 + v3-1-spec §3.3 output schema lifecycle field |
| v2.0 | §7 Judgment authored with P7=0 positive-empty-declaration per MA-J4 (LM's runtime decisions all mechanical per substrate §6.3 — reducible grounds cited at §7.1 basis). Closes LM-F8. | MA-J4 + substrate §8.6 + §6.3 |
| v2.0 | §8 Self-audit results authored (full) with §8.1 gate results pending-first-run, §8.2 dimension audit results declared-complete, §8.3 last audit event, §8.4 self-application basis. Closes LM-F9. | framework-audit §8.2 canonical pattern |
| v2.0 | §6.8 OperatorInterface authored per substrate §4 A-13 + V5 verification. Closes LM-F12. | substrate §4 A-13 + V5 |
| v2.0 | §1.1 GenesisDeclaration authored per substrate §4 A-14 (parent = metaframework-v3-1 at v3.2.1; generationProcedure = generation-procedure-v1-0 at v1.1.1; predecessorVersion = v2.0). Closes LM-F10. | substrate §4 A-14 |
| v2.0 | §1 Identity scopeOut row added (10 entries enumerating concerns owned by adjacent frameworks: Cognitive Standard encoding, AS emission mechanics, Plan authoring, M-I runtime, F-chat session management, F-event-system bus, LIV-Standard embedding + R4 + DB, B3 re-derivation post-beta). Mirrors AS/Plan/M-I scopeOut shape. Closes LM-F13. | framework-audit X4 + spec |
| v2.0 | §1.3 MA-G13 four-property test table authored with own-state / own-I/O / own-invariants / own-discipline columns + hidden-sibling re-application check (per-ownerId GraphState, runTraversal invocation, M-layer sub-graph, MemArm — none earn Framework classification). Closes LM-F3. | substrate §1.1 + §1.4 + AS/M-I/Plan §1 pattern |
| v2.0 | §6.2 HR shape updated to substrate §8.2 amended P6 (id, direction, carrierApplicability, diagnosticSignificance, captureShape, invariant). Six HRs (HR-LM1..HR-LM6) declared with captureShape per substrate §8.2 for each HR with diagnosticSignificance=true (HR-LM1, HR-LM2, HR-LM5, HR-LM6). v2.0 §7.2 used v2.4 three-column shape (Adjacent / LM consumes / LM emits); v2.1 elevates to typed HR instances with captureShape. Closes LM-F6. | substrate §8.2 amended P6 + X3 C5 |
| v2.0 | Output-schema top-level `provenance` field populated per metaframework §2.2 (reference-default per A-20). v2.0 §9.1 per-field provenance classification retained as §2.2.1. Closes LM-F11. | metaframework §2.2 + A-20 + carry-forward |
| v2.0 | §6.5 custody table refreshed: AS v2.2 / Plan v2.2 / M-I v2.3 version pins applied; consumer columns updated to frozen versions. v2.0 §1 row 41 cited AS v2.1 / Plan v2.1 / M-I v2.2 (stale). v2.0 §7.1 + §7.2 + §7.3 content folded into §6.5 + §6.9 + §6.11. Closes LM-F4. | substrate SG3 + cross-framework calibration |
| v2.0 | Authority reference updated from `metaframework v2.4` to `metaframework-v3-1` at v3.2.1 (header line + §9 change log). Closes LM-F14. | manifest v3.0-canonical + audit-findings-table LM-F14 |
| v2.0 | R5 types file `living-memory.types.ts` declares framework-local W-ATOMs + HR instance shape + gate/dimension/custody row shapes. R5 constants file `living-memory.ts` declares LM_FRAMEWORK_ID + LM_AXIOM_IDS (20) + LM_AXIOM_GATE_IDS (20) + LM_HANDOFF_RULE_IDS (6) + enum literal sets + P7/P8 declaration. Custody of primitives.ts verified only, not regenerated. | brief §Constraints + Plan v2.2 R5 pattern |
| v2.0 | No axiom additions, deletions, or re-writes. LMA1..LMA19 with LMA13 split = 20 atomic preserved verbatim per AxR3 additive discipline + brief §Constraints carry-forward §9.1 rule. `attachedTo` column added to §3.6 axiom table per v3.1 structural requirement (not a text edit; a column addition). | AxR3 + brief |
| v2.0 | Cross-framework carry-forward from audit §5 non-remediation list: (a) §3.8 universal-variables table (v2.0 §5.1, 0-arrow G-St-clean) directly portable; (b) §6.11 substrate-vs-role pattern (v2.0 §7.3) carried forward as MA-C6 mechanism; (c) scope-parameterized single-graph decision (v2.0 change log row 14) attested in §1.3 MA-G13 hidden-sibling check — verified under v3.1 (cycle-4 audit Anchor 5 PASS); (d) §2.2.1 per-field provenance classification (v2.0 §9.1) carried forward; (e) §5.8 atomicity declarations cite LMA11 atomic-commit + LMA18 reconstructibility (v2.0 axioms carry forward). | audit-report.md §5 + brief §Carry-forward |

---

**End of living-memory-v2-1. Pending L0 confirmation at regen-cycle closure.**
