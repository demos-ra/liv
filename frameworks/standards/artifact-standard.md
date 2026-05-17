---
kind: framework
placement: frameworks/standards/
---

# artifact-standard-v2-3

**Kind:** Framework
**Mode:** generative
**Level:** L3
**Version:** v2.3
**Authority:** L0 confirmed (Sprint B2 unified close — fix-round ratification per manager soundness-check; ArA8 dissolution = MA-L1 removal-is-additive of vacuously-true gate per §3.6 self-check L307)
**Consumes:** substrate-v1-1, metaframework-v3-1, primitives.ts (core/R5)
**Consumed by:** Plan Standard, Multi-Instance Standard, and every content framework declaring `carrier = 'artifact-standard'`
**Dependencies:** substrate-v1-1 (by reference, per HR1 inherited), metaframework-v3-1 (via HR6 receive-side output contract), generation-procedure-v1-0 (generator)
**Versioning discipline:** additive only (per MA-L1)
**Adjacent frameworks:** Cognitive Standard (upstream at A4), Living Memory (write carrier), LIV-Standard (Semver custodian)

Artifact Standard is the L3 generative-mode framework governing emission mechanics at chain link A7. Its content is rendered from metaframework-v3-1 §3 structural template via generation-procedure-v1-0 S1–S3 (AS-specific three-step P8 procedure; distinct from generation-procedure's own S1–S12 which generates framework templates). This file is the `GeneratedFrameworkTemplate` emission per metaframework-v3-1 §2.2 output schema.

**Generator provenance:**
- `generatedByMetaframework`: `{id: 'metaframework', version: 'v3.2.1'}`
- `generationProcedureRef`: `{id: 'generation-procedure', version: 'v1.1.1'}`
- `sourceInputRef`: registry-archived `MetaframeworkInput` (reference-default per A-20)
- `generationTimestamp`: 2026-04-23T00:00:00Z

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Artifact Standard |
| Kind | `Framework` |
| Mode | `generative` |
| Level | `L3` |
| Version | `v2.4` (v2.3 → v2.4 per MA-L1 patch at Sprint B2 Shot 5 — MA-I8 governsRuntimeCode declared; MA-V10pB RC apparatus added at §3.13; partial-drift dissolved; no axiom/gate/schema change) |
| Ownership (template) | `L0` |
| Ownership (applied) | `System` (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` on first `createArtifact` invocation) |
| Carrier | `self` (emits `ArtifactEmission` W-ATOM directly per MA-S2) |
| Consumes | substrate-v1-1 (via inherited HR1), metaframework-v3-1 (via HR6 receive-side), primitives.ts core/R5 |
| Consumed by | Plan Standard, Multi-Instance Standard, any content framework declaring `carrier = 'artifact-standard'` |
| Authority | L0 confirmed (Sprint B2 unified close — fix-round ratification per manager soundness-check; ArA8 dissolution = MA-L1 removal-is-additive of vacuously-true gate per §3.6 self-check L307) |
| Genesis | `{bootstrapped: false, genesisEvent: 'generation-procedure-v1-0 S3 emission at L3 regen wave cycle 1'}` |
| scopeOut | `['domain payload content (owned by content framework — Plan, M-I, etc.)', 'codec classification at A4 (owned by Cognitive Standard)', 'graph physics — node/energy/traversal (owned by Living Memory)', 'code structure (owned by LIV-Standard)', 'framework registry dispatch runtime (owned by each framework)', 'B-direction symmetric re-encoding at B3 (post-beta)']` |
| `governsRuntimeCode` | `true` (per MA-I8). Basis: Artifact Standard governs F-artifact slice runtime code — `src/features/F-artifact/app/artifact-emit.ts` (S1→S2→S3 procedure), `src/features/F-artifact/domain/artifact-gates.ts` (G-Ar1..G-Ar7 gate evaluations), `src/features/F-artifact/domain/artifact-edges.ts` (ArA4a–ArA4d edge construction), `src/features/F-artifact/contract/artifact-contract.ts` (R3 public surface). The axiom set ArA1–ArA7, procedure S1–S3, and gate set G-Ar1–G-Ar7 govern these paths. jurisdictionClaim declared below. |
| `referentCitations` | RC array populated Sprint B2 Shot 5: `[{path:'src/features/F-artifact/app/artifact-emit.ts',expectedShape:'exports createArtifact(CreateArtifactInput)→Promise<CreateArtifactResult> composing S1 (anchor+companion+content+edges construction per ArA1–ArA4d) → S2 (gate-execution per G-Ar1..G-Ar7) → S3 (emit ArtifactEmission to LM via AS carrier); emissionId generated via generateId per ArA1; anchor/companion NodeIds resolved via LM node-create per ArA2; contentNodeIds via LM traverse per ArA3; edges per ArA4a–ArA4d; ArA8 isEmissionIdCollisionNeverTrue stub removed at v2.3',kind:'typed-function-set'},{path:'src/features/F-artifact/domain/artifact-gates.ts',expectedShape:'exports evaluateAllGates(GateBatch)→GateBatchResult; evaluates G-Ar1..G-Ar7 gate conditions (ArA1 chain-position, ArA2 cardinality, ArA3 content-cardinality, ArA4a–ArA4d edge-set, ArA5 emission-identity, ArA6 edge-set-exhaustive, ArA7 payload-verbatim); gar8/isCollision removed at v2.3',kind:'typed-function-set'},{path:'src/features/F-artifact/domain/artifact-edges.ts',expectedShape:'exports buildEdges(input)→ArtifactEdge[] computing ArA4a classification-lineage + ArA4b categorical + ArA4c version (conditional) + ArA4d dependency edges; edge-kind enum exhaustive per ArA6',kind:'typed-function-set'},{path:'src/features/F-artifact/contract/artifact-contract.ts',expectedShape:'R3 public surface — sole cross-slice import path per A5/LIV-Standard; re-exports createArtifact; per HR-Ar3 receive-side contract',kind:'typed-contract'},{path:'src/features/F-artifact/types/artifact-types.ts',expectedShape:'declares CreateArtifactInput/ArtifactEmission/ArtifactEdge/ArtifactEdgeKind typed atoms per MA-S1/MA-S2; ArtifactChainPosition enum (A4/A7/B3) governs leaf-chain-A4/A7/B3 per ArA1',kind:'typed-types-module'}]` |
| `governsRuntimeCode` | `true` (per MA-I8, Sprint B2 Shot 5). Basis: AS governs F-artifact slice runtime code at `src/features/F-artifact/**` — domain (artifact-gates.ts, artifact-edges.ts), app (artifact-emit.ts), types (wires.ts, artifact-types.ts), contract (artifact-contract.ts). The axiom set (ArA1–ArA7), procedure (S1–S3), and gate set (G-Ar1–G-Ar7) govern createArtifact emission mechanics, edge-set construction, and payload-verbatim invariant at these paths. jurisdictionClaim per axis declared at §3.13 below. |
| `referentCitations` | Sprint B2 Shot 5 RC closure — partial-drift dissolved. `[{path:'src/features/F-artifact/app/artifact-emit.ts',expectedShape:'exports createArtifact(CreateArtifactInput)→CreateArtifactResult; realizes S1 (emissionId generation, anchor/companion NodeId resolution, content traversal, edge construction per ArA4a–ArA4d), S2 (gate execution G-Ar1..G-Ar7), S3 (ArtifactEmission output)',kind:'typed-function-set'},{path:'src/features/F-artifact/domain/artifact-gates.ts',expectedShape:'exports evaluateAllGates(GateBatch)→GateBatch; per-axiom gate predicates G-Ar1..G-Ar7 (ArA8/G-Ar8 dissolved at v2.3); GateBatch typed shape per ArA1..ArA7',kind:'typed-function-set'},{path:'src/features/F-artifact/domain/artifact-edges.ts',expectedShape:'exports edge construction helpers realizing ArA4a (classification-lineage), ArA4b (categorical), ArA4c (version, conditional), ArA4d (dependency per dependsOn[]); ArtifactEdgeKind enum membership per ArA5',kind:'typed-function-set'},{path:'src/features/F-artifact/types/artifact-types.ts',expectedShape:'exports CreateArtifactInput{framework,turnId,userId,payload,dependsOn?}; ArtifactEmission{emissionId,writes:{a4,a7}}; ArtifactEdge{kind:ArtifactEdgeKind,fromId,toId}; all AS schema atoms typed here',kind:'typed-types-module'},{path:'src/features/F-artifact/contract/artifact-contract.ts',expectedShape:'exports createArtifact as R3 single-import surface; no logic; thin wire per LIV-Standard A5',kind:'typed-contract'}]` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | `{stateTemplate, stateApplied}` ∈ substrate §9 `LifecycleState` enum; `{declared, applied, terminated, deprecated}` transitions declared at §5.1 |
| Own I/O | input: `CreateArtifactInput` (§2.1); output: `ArtifactEmission` (§2.2) |
| Own invariants | 10 axis-bound structural-transformation axioms (ArA1–ArA7 with ArA4a–ArA4d) per §3.3 — ArA8 dissolved at v2.3 per Sprint B2 Shot 2c; + 35 axis-bound + 1 universal MA-G13 inherited from metaframework-v3-1 §3.2 |
| Own discipline | three P8 step procedure (§3.4 S1–S3 under Stages {2, 3, 5}); axiom gates G-Ar1–G-Ar7 at §4.2 (G-Ar8 dissolved at v2.3); handoff rules HR-Ar1–HR-Ar4 at §6.2 |

All four properties declared. MA-G13 passes. Artifact Standard is classified as framework (not state store; not protocol; not substrate).

---

## §2 Schema

### §2.1 Input — `CreateArtifactInput`

Per MA-S1 (schema.input declared as typed atom) + carrier-applicability rule for carrier=self.

```
CreateArtifactInput = {
  framework: {
    id:      string,              // caller (content framework) identifier
    version: Semver               // caller version
  },
  turnId:               string,               // caller turn context
  userId:               UserId,               // F-identity session
  payload:              ArtifactPayload,      // caller output, verbatim carry
  classificationNodeId: NodeId,               // Cognitive Standard R3 encodeLLM() result, same turn
  primitive:            CognitivePrimitive,   // Cognitive Standard R3 encodeLLM() result
  confidence:           number,               // Cognitive Standard R3 encodeLLM() result; range [0, 1]
  dependsOn?:           NodeId[]              // caller-declared prior-artifact references
}

ArtifactPayload = {
  domain:        string,        // content framework id (e.g., 'plan', 'multi-instance')
  domainVersion: Semver,        // content framework version
  schemaRef:     string,        // payload schema identifier (content-framework-owned)
  content:       unknown        // typed per domain schema; opaque to AS
}
```

### §2.2 Output — `ArtifactEmission`

Per MA-S2 (carrier=self → output is W-ATOM).

```
ArtifactEmission = {
  emissionId: string,                           // runtime-generated UUID v4 per call
  framework: {
    id:      string,
    version: Semver
  },
  turnId:    string,
  userId:    UserId,

  writes: {
    a4: ArtifactWriteA4,                        // always populated per ArA1
    a7: ArtifactWriteA7                         // always populated per ArA1
  },

  edges:     ArtifactEdge[],                    // per ArA4a–ArA4d + ArA6
  payload:   ArtifactPayload,                   // verbatim from input.payload per ArA7

  timestamp: string                             // ISO 8601; runtime-generated
}

ArtifactWriteA4 = {
  classificationNodeId: NodeId,
  primitive:            CognitivePrimitive,
  confidence:           number
}

ArtifactWriteA7 = {
  artifactAnchorNodeId: NodeId,                 // per ArA2
  companionDataNodeId:  NodeId,                 // per ArA2 (1:1 with artifactAnchorNodeId by emissionId)
  contentNodeIds:       NodeId[]                // per ArA3 (cardinality >= 1)
}

ArtifactEdge = {
  fromId: NodeId,
  toId:   NodeId,
  kind:   ArtifactEdgeKind                      // enum exhaustive per §3.5
}

ArtifactEdgeKind = 'classification-lineage' | 'categorical' | 'version' | 'dependency'
```

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityLevel` | substrate §5 |
| `AuthorityClaim` | substrate §5 |
| `WAtom` | substrate §4 A-01 |
| `AxiomRef` | substrate §4 A-02 |
| `FrameworkRef` | substrate §4 A-09 |
| `Semver` | substrate §7 |
| `Kind` | substrate §4 A-10 (string-typed at this regen per spec-as-regen-v3-1 §Constraints; no R5 typed substrate atoms cycle) |
| `Ownership` | substrate §4 A-11 (string-typed this regen) |
| `LifecycleState` | substrate §9 (string-typed this regen) |
| `Carrier` | substrate §9 (string-typed this regen) |
| `ActivationTrigger` | substrate §4 A-12 (string-typed this regen) |
| `OperatorInterface` | substrate §4 A-13 (string-typed this regen) |
| `GenesisDeclaration` | substrate §4 A-14 (string-typed this regen) |
| `Stage` | substrate §8.3 |
| `StageContentKind` | substrate §8.3 |
| `CaptureShape` | substrate §8.2 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home |
|---|---|
| `NodeId` | primitives.ts core/R5 (branded string) |
| `UserId` | primitives.ts core/R5 |
| `Semver` | primitives.ts core/R5 (branded string) |
| `CognitivePrimitive` | primitives.ts core/R5 (cross-standard enum, Cognitive Standard owns semantics) |
| `Result<T, E>` | primitives.ts core/R5 |
| `AppError` | primitives.ts core/R5 |

Custody verification per spec-as-regen-v3-1 inputs clause: these five atoms are declared at primitives.ts; AS consumes by reference; AS does not regenerate primitives.ts.

### §2.5 Consumed types (from metaframework-v3-1, by reference)

| Type | Home |
|---|---|
| `GeneratedFrameworkTemplate` | metaframework-v3-1 §2.2 (this file is an emitted instance) |
| `MetaframeworkInput` | metaframework-v3-1 §2.1 (sourceInputRef target) |
| `DimensionResult` | framework-audit-v1-2 §8.1 (by reference via metaframework schema) |

### §2.6 AS-local atoms (declared at point of use in §3)

Declared inline at first use per PR1 (substrate §10.2) + MA-St5 (every term has declared home):

`ArtifactChainPosition`, `ArtifactEdgeKind`, `ArtifactCompositionProduct`, `ArtifactEmissionPositional`, `ArtifactCompositionPositional`, `ArtifactLineagePositional`, `ArtifactPayload`, `CreateArtifactInput`, `ArtifactEmission`, `ArtifactEdge`, `ArtifactWriteA4`, `ArtifactWriteA7`, `ArtifactProcedureStage`, `ArtifactProcedureKind`, `ArtifactProcedureStepId`, `ArtifactProcedureStepInstance`, `ArtifactGateResult`, `ArtifactDimensionResult`, `ArtifactCustodyRow`, `ArtifactHandoffRuleInstance`, `ArtifactError`, `CreateArtifactResult`.

All atoms have R5 type declaration in `artifact-standard.types.ts` and custody row in §6.5.

### §2.7 Schema rules (ScR-series)

Inherited from metaframework-v3-1 §2.5 (by reference to v3-1-spec §3.3). No AS-local ScR additions.

### §2.8 Custody pointer

Full custody table in §6.5. Pointer-only reference per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

AS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. AS does not redeclare.

Per v3-1-spec §4.4 file-specific placement, AS's own structural content populates §3.3–§3.8 below: three P1 Axis instances (AS-local), sub-axis instances, leaves, axioms (ArA1–ArA7), and the three-step P8 procedure. ArA8 dissolved at v2.3 per Sprint B2 Shot 2c.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 3 | `{primitiveKind: P1, instanceCount: 3, basis: "AS-local domain axes declared at §3.3: Emission, Composition, Lineage. Seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; AS-local P1 instances populate §3 Structure under the inherited shell."}` |
| P2 Sub-axis | 5 | Emission: `chainPositionA` + `chainPositionB`; Composition: `products` + `cardinality`; Lineage: `edgeSet`. Declared §3.4. |
| P3 Leaf | 10 | One leaf per axiom condition per MA-St2 leaf atomicity; ArA1..ArA7 with ArA4a-d split → 10 leaves (post-Sprint-B2-Shot-2c ArA8 dissolution). Declared §3.5. |
| P4 Axiom | 10 | ArA1, ArA2, ArA3, ArA4a, ArA4b, ArA4c, ArA4d, ArA5, ArA6, ArA7. Declared §3.6. ArA8 dissolved at v2.3 per Sprint B2 Shot 2c. |
| P5 Gate | 10 | G-Ar1..G-Ar7 with G-Ar4a..G-Ar4d. One primary gate per axiom per G-M1. Declared §4.2. G-Ar8 dissolved at v2.3. |
| P6 Handoff rule | 4 | HR-Ar1 (Cognitive Standard receive), HR-Ar2 (Living Memory write), HR-Ar3 (content framework receive), HR-Ar4 (content framework emit receipt). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: P7, instanceCount: 0, basis: "AS's createArtifact procedure is fully mechanical per MA-J4 emptyDeclared; every axiom condition reduces to substrate §6.3 mechanical-criterion ground (cardinality + reference resolution + structural property). No judgment inputs consumed at S1–S3."}` |
| P8 Procedure step | 3 | S1 (compose), S2 (gate-execute), S3 (emit). Declared §3.7. |

Positive empty-declaration marker for P7 per substrate §8.6. No implicit absence.

### §3.3 P1 Axis instances (AS-local)

Three domain axes. MECE over AS's concern space (emission mechanics at A7).

| id | Axis | Concern |
|---|---|---|
| `Emission` | Emission | Where in transfer chain writes occur; what atom is deposited at each chain position |
| `Composition` | Composition | What nodes and edges result from one emission; product cardinality |
| `Lineage` | Lineage | How emitted artifact connects to classification, predecessor, and declared inputs |

**MECE verification:**
- Orthogonality: Emission governs "where + what atom" (chain-link concern); Composition governs "what-products + cardinality" (output-shape concern); Lineage governs "edges-connecting-to-prior-state" (cross-artifact concern). No pair-overlap.
- Exhaustiveness: every `ArtifactEmission` field traces to exactly one AS-local axis (verified §3.8 traceability table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Emission sub-axes:**

| id | Sub-axis | Leaf set (P3 refs) |
|---|---|---|
| `Emission/chainPositionA` | A-direction chain position | `leaf-chain-A4`, `leaf-chain-A7` |
| `Emission/chainPositionB` | B-direction chain position (post-beta scope-out) | `leaf-chain-B3` |

**Composition sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Composition/products` | Product kinds produced per emission | `leaf-anchor`, `leaf-companion`, `leaf-content`, `leaf-edge` |
| `Composition/cardinality` | Cardinality rules per product | `leaf-anchor-card`, `leaf-companion-card`, `leaf-content-card`, `leaf-edge-card` |

**Lineage sub-axis:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Lineage/edgeSet` | Edge kinds emitted per ArA4a–ArA4d | `leaf-edge-classification`, `leaf-edge-categorical`, `leaf-edge-version`, `leaf-edge-dependency` |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-chain-A4` | `property` | `ArtifactChainPosition` enum literal `'A4'` |
| `leaf-chain-A7` | `property` | `ArtifactChainPosition` enum literal `'A7'` |
| `leaf-chain-B3` | `property` | `ArtifactChainPosition` enum literal `'B3'` |
| `leaf-anchor` | `descriptor` | `NodeId` (carries `framework.id`, `framework.version`, `turnId`, `emissionId` as node properties) |
| `leaf-companion` | `descriptor` | `NodeId` (holds `payload` as JSON verbatim per ArA7) |
| `leaf-content` | `descriptor` | `NodeId[]` (produced by traversal of `payload.content` via Living Memory) |
| `leaf-edge` | `descriptor` | `ArtifactEdge[]` |
| `leaf-anchor-card` | `property` | `1` (cardinality literal per ArA2) |
| `leaf-companion-card` | `property` | `1` (cardinality literal per ArA2) |
| `leaf-content-card` | `property` | `number` with predicate `>= 1` per ArA3 |
| `leaf-edge-card` | `property` | `number` with predicate `>= 2` (classification-lineage + categorical always present per ArA4a + ArA4b) |
| `leaf-edge-classification` | `axiom` | `ArtifactEdgeKind` literal `'classification-lineage'` |
| `leaf-edge-categorical` | `axiom` | `ArtifactEdgeKind` literal `'categorical'` |
| `leaf-edge-version` | `axiom` | `ArtifactEdgeKind` literal `'version'` |
| `leaf-edge-dependency` | `axiom` | `ArtifactEdgeKind` literal `'dependency'` |

**Leaf-count reconciliation note (§3.2 counts P3 = 10 per MA-St2 one-leaf-per-axiom-condition, post-ArA8 dissolution at v2.3):**

Axiom conditions are 10 (ArA1..ArA7 with ArA4a–ArA4d split; ArA8 dissolved at Sprint B2 Shot 2c). The 15 leaf rows above decompose finer than axiom conditions in some cases: ArA2 yields two cardinality leaves (`leaf-anchor-card`, `leaf-companion-card`); ArA4a–ArA4d each yield one edge-kind leaf plus the shared `leaf-edge` descriptor; ArA1 yields three chain-position leaves. Per MA-St2, "one leaf per axiom condition" is the canonical binding; additional leaf rows carry sub-field shape declarations that aggregate into one axiom-condition leaf at the axiom-attachment level (§3.6). The canonical P3 count reported in §3.2 is 10 (the axiom-condition-anchored leaf count used by MA-St2 + G-M1 mechanics); the table above lists 15 shape-declaration rows including sub-field descriptors. This is an audit-trail observation, not a count violation: axiom gates bind 1:1 to axiom conditions per G-M1 (§4.2), and leaf attachment in §3.6 uses the axiom-condition-anchored set.

### §3.6 P4 Axiom instances (ArA1–ArA7)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **ArA1** | `Emission/chainPositionA` | Every `createArtifact` invocation produces an `ArtifactEmission` with `writes.a4` populated AND `writes.a7` populated. Both blocks non-null. | structural property (field presence) |
| **ArA2** | `Composition/cardinality` / `leaf-anchor-card` + `leaf-companion-card` | Every emission has `writes.a7.artifactAnchorNodeId` and `writes.a7.companionDataNodeId` bound 1:1 by `emissionId`. Cardinality: exactly one anchor and exactly one companion per emission. | cardinality |
| **ArA3** | `Composition/cardinality` / `leaf-content-card` | Every emission has `writes.a7.contentNodeIds.length >= 1`. | cardinality |
| **ArA4a** | `Lineage/edgeSet` / `leaf-edge-classification` | Every emission has exactly one edge with `kind = 'classification-lineage'` where `fromId = writes.a7.artifactAnchorNodeId` AND `toId = writes.a4.classificationNodeId`. | cardinality + reference resolution |
| **ArA4b** | `Lineage/edgeSet` / `leaf-edge-categorical` | Every emission has exactly one edge with `kind = 'categorical'` where `fromId = writes.a7.artifactAnchorNodeId` AND `toId = modeNode` resolved by `framework.id → modeNodeId` lookup via Living Memory one-hop query. | cardinality + reference resolution |
| **ArA4c** | `Lineage/edgeSet` / `leaf-edge-version` | Every emission has one edge with `kind = 'version'` IFF a prior anchor exists for the tuple `(input.framework.id, input.userId)`. Prior defined as most-recent anchor with matching tuple per Living Memory one-hop query. Absent IFF no prior. No null-pointing edge. | cardinality (0 or 1) + reference resolution |
| **ArA4d** | `Lineage/edgeSet` / `leaf-edge-dependency` | Every emission has one edge with `kind = 'dependency'` per entry of `input.dependsOn[]`. Edge count equals `input.dependsOn.length`. Absent iff `dependsOn` empty or undefined. | cardinality (= input.dependsOn.length) |
| **ArA5** | `Emission/chainPositionA` / `leaf-chain-A7` | Post-emission mutation of `writes.a7.artifactAnchorNodeId` or `writes.a7.companionDataNodeId` content is forbidden. State changes produce a new emission with a `kind: 'version'` edge to the prior anchor per ArA4c. | structural property (mutation-rejection predicate on persisted node) |
| **ArA6** | `Lineage/edgeSet` | `ArtifactEmission.edges` contains only entries with `kind ∈ ArtifactEdgeKind` enum. Enum exhaustive: `{'classification-lineage', 'categorical', 'version', 'dependency'}`. No out-of-enum kinds permitted. | enum membership |
| **ArA7** | `Composition/products` / `leaf-companion` | `ArtifactEmission.payload` is the verbatim, byte-identical value of `input.payload`. AS does not inspect or transform `payload.content`. | deterministic-function result (identity function over input.payload) |

*Sprint B2 Shot 2c: ArA8 (emissionId-uniqueness) dissolved. Rationale: emissionId is a UUID v4 minted per call via `generateId` — structural collision is impossible. The gate carried no real predicate (the runtime stub at `src/features/F-artifact/app/artifact-emit.ts` evaluated a constant-false function, indicating the gate was already operationally vacuous). Removed from axiom set, leaf set, gate set, P3/P4/P5 counts, S2 gate-execution bundle, X2 Determinism dimension mapping.*

**AxR1 self-check:** each axiom binds to exactly one axis/sub-axis/leaf per attachment column. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set additively versioned from v2.1 (v2.1 had ArA1–ArA5 with ArA4 split into ArA4a–ArA4d; v2.2 added ArA6, ArA7, ArA8 to close edge-set-exhaustive / payload-verbatim / emissionId-uniqueness gaps). v2.3 dissolves ArA8 — removal is additive per MA-L1 *removal-is-additive* clause (ArA8's predicate was vacuously satisfied per UUID v4 generation; no behavior change for prior-passing artifacts). Pass.
**AxR4 self-check:** all axiom text declarative. Pass.

### §3.7 P8 Procedure step instances

Three steps. PR4 stage monotonicity + PR5 stage-content-kind alignment enforced.

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **S1** | 1 | 2 | `mechanical` | `CreateArtifactInput` | composed `(anchor, companion, content, edges)` tuple with `emissionId` generated | `derivation = "generate emissionId via UUID v4; resolve anchor NodeId via Living Memory node-create with properties {framework.id, framework.version, turnId, emissionId}; resolve companion NodeId via Living Memory node-create with payload = input.payload verbatim; traverse input.payload.content via Living Memory traverse() producing contentNodeIds[] with cardinality >= 1; compute edges[] per ArA4a (classification-lineage), ArA4b (categorical via mode-node lookup), ArA4c (version via prior-anchor lookup, conditional), ArA4d (dependency per input.dependsOn[])"` |
| **S2** | 2 | 3 | `gate-execution` | composed tuple from S1 + framework-tier gate bundle | per-gate results + overall pass/fail | `gates = [PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-Ar1, G-Ar2, G-Ar3, G-Ar4a, G-Ar4b, G-Ar4c, G-Ar4d, G-Ar5, G-Ar6, G-Ar7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4]` (52 framework-tier gates: 7 PG + 35 axiom inherited + 1 MA-G13 + 5 F-69 + 4 meta; NB: AS-own axiom gates G-Ar1..G-Ar7 with ArA4 split = 10 gates at v2.3 — G-Ar8 dissolved per Sprint B2 Shot 2c) |
| **S3** | 3 | 5 | `mechanical` | validated composed tuple | `ArtifactEmission` W-ATOM emitted to caller; Living Memory node+edge writes committed via Living Memory transaction | `derivation = "construct ArtifactEmission per §2.2 output schema from composed tuple; invoke Living Memory commit for anchor + companion + content nodes and edge set atomically per Living Memory transaction contract; return ArtifactEmission W-ATOM to caller; on Living Memory commit rejection, return Result { ok: false, error: ArtifactError { code: 'ARTIFACT_EMISSION_REJECTED' } } per Result<T, E> shape from primitives.ts"` |

**Disambiguation note on S2 gates field:** AS's S2 gate-execution step declares the full 52 framework-tier gate bundle per metaframework `MetaframeworkGateIdSet` atom (metaframework §6.5), PLUS AS's own 10 axiom gates (G-Ar1..G-Ar7 with ArA4 split — post-Sprint-B2-Shot-2c ArA8 dissolution). The inherited axiom gates (G-I1..G-J4, 35 entries) test metaframework's own 35 axis-bound axioms when AS is the target framework — i.e., they test AS's conformance to metaframework axioms (MA-I1..MA-J4). AS's own axiom gates (G-Ar1..G-Ar7) test AS's own 10 axioms (ArA1..ArA7). Total per-invocation gate count at S2: 52 metaframework-tier + 10 AS-own = 62 gates. Substrate-tier gates (SG1–SG4) excluded per substrate §11.5 tier-1 "run once, not per framework" semantics.

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Emission` | `Semver` (bound to `input.framework.version`) | `ArtifactChainPosition` enum `'A4' \| 'A7' \| 'B3'` | `ArtifactEmission.writes.a4: ArtifactWriteA4` paired with `ArtifactEmission.writes.a7: ArtifactWriteA7` (dual typed-field reference within one emission; `writes.a4` sourced from Cognitive Standard, `writes.a7` sourced from AS, both co-emitted per ArA1) | `ArtifactEmissionPositional` enum `'unwritten' \| 'written'` |
| `Composition` | `string` (bound to `emissionId`; UUID v4 per invocation) | `ArtifactCompositionProduct` enum `'anchor' \| 'companion' \| 'content' \| 'edge'` | `artifactAnchorNodeId` 1:1 `companionDataNodeId`; `artifactAnchorNodeId` 1:N `contentNodeIds`; `artifactAnchorNodeId` 1:M `edges` | `ArtifactCompositionPositional` enum `'unassembled' \| 'assembled' \| 'persisted'` |
| `Lineage` | `number` (version-lineage chain depth; integer; traversal count via ArA4c) | `ArtifactEdgeKind` enum `'classification-lineage' \| 'categorical' \| 'version' \| 'dependency'` | `ArtifactEdge.fromId: NodeId` paired with `ArtifactEdge.toId: NodeId` (directional dual typed-field reference per edge; `fromId` pinned to `ArtifactEmission.writes.a7.artifactAnchorNodeId` per ArA4a–d) | `ArtifactLineagePositional` enum `'unlinked' \| 'linked'` |

All Relational cells express dependency order via named-type + typed-field reference per MA-G6.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `ArtifactChainPosition` | §2 Schema + `artifact-standard.types.ts` | enum `'A4' \| 'A7' \| 'B3'` |
| `ArtifactEdgeKind` | §2 Schema + `artifact-standard.types.ts` | enum `'classification-lineage' \| 'categorical' \| 'version' \| 'dependency'` |
| `ArtifactCompositionProduct` | §3.8 + `artifact-standard.types.ts` | enum `'anchor' \| 'companion' \| 'content' \| 'edge'` |
| `ArtifactEmissionPositional` | §3.8 + `artifact-standard.types.ts` | enum `'unwritten' \| 'written'` |
| `ArtifactCompositionPositional` | §3.8 + `artifact-standard.types.ts` | enum `'unassembled' \| 'assembled' \| 'persisted'` |
| `ArtifactLineagePositional` | §3.8 + `artifact-standard.types.ts` | enum `'unlinked' \| 'linked'` |
| `ArtifactPayload` | §2.1 | typed shape per §2.1 block |
| `CreateArtifactInput` | §2.1 | W-ATOM input typed shape |
| `ArtifactEmission` | §2.2 | W-ATOM output typed shape |
| `ArtifactEdge` | §2.2 | typed shape per §2.2 block |
| `ArtifactWriteA4` | §2.2 | typed shape per §2.2 block |
| `ArtifactWriteA7` | §2.2 | typed shape per §2.2 block |
| `ArtifactProcedureStepInstance` | §3.7 + `artifact-standard.types.ts` | P8 instance shape per substrate §8.3 amended |
| `mode node` (`modeNode`) | §3.6 ArA4b | Living Memory graph node representing one of the four substrate §2 Mode values; resolved by `framework.id → modeNodeId` lookup via Living Memory one-hop query. One per Mode, globally scoped. |
| `prior anchor` | §3.6 ArA4c | most-recent anchor in Living Memory graph with matching tuple `(framework.id, userId)`. |
| `NodeId`, `UserId`, `Semver`, `CognitivePrimitive`, `Result`, `AppError` | primitives.ts core/R5 | consumed by reference |

---

### §3.13 MA-V10 part B jurisdiction coverage declaration

Per MA-V10 part B (metaframework v3.3.1 §3.2.1): when `governsRuntimeCode = true`, every source-governing axis with declared `jurisdictionClaim` must have ReferentCitations covering its claim.

AS's source-governing intent is concentrated at the **Structure axis** (ArA1–ArA7 govern the createArtifact procedure's emission mechanics, edge-set structure, and payload-verbatim invariant) and the **Schema axis** (CreateArtifactInput / ArtifactEmission / ArtifactEdge govern the typed I/O shapes that runtime code must produce and consume). Remaining inherited axes (Identity, Validity, Lifecycle, Coupling, Judgment) are declarative-tier concerns at AS; no jurisdictionClaim declared (applicability='n/a').

| Axis | `jurisdictionClaim` | RC coverage at v2.4 | Status |
|---|---|---|---|
| **Structure** | `['src/features/F-artifact/app/artifact-emit.ts', 'src/features/F-artifact/domain/artifact-gates.ts', 'src/features/F-artifact/domain/artifact-edges.ts']` (ArA1–ArA7 govern emission procedure, gate evaluation, and edge-set construction at these paths) | 3 ReferentCitations: artifact-emit.ts (S1 procedure, ArA2 cardinality, ArA3 content-card, ArA6 edge-exhaustive, ArA7 payload-verbatim), artifact-gates.ts (G-Ar1..G-Ar7 gate predicates per ArA1..ArA7), artifact-edges.ts (ArA4a–ArA4d edge kind realizations, ArA5 enum-membership). Full coverage: every ArA1–ArA7 has ≥1 citation path. | RC coverage complete. Partial-drift dissolved. |
| **Schema** | `['src/features/F-artifact/types/artifact-types.ts', 'src/features/F-artifact/contract/artifact-contract.ts']` (CreateArtifactInput / ArtifactEmission / ArtifactEdge typed shapes declared and exported at these paths) | 2 ReferentCitations: artifact-types.ts (all AS schema atoms typed per MA-S1/MA-S2 — CreateArtifactInput, ArtifactEmission, ArtifactEdge, ArtifactEdgeKind), artifact-contract.ts (re-exports createArtifact as R3 single-import surface — typed boundary per LIV-Standard A3/A5). Full coverage: all schema shapes resolvable at cited paths. | RC coverage complete. Partial-drift dissolved. |
| Identity | not declared (declarative-tier — §1 header is framework's own identity, not source-governing) | n/a | applicability='n/a' |
| Validity | not declared (declarative-tier — gate predicates are declarative governance; execution is framework-audit concern) | n/a | applicability='n/a' |
| Lifecycle | not declared (declarative-tier — version history and transition declarations are not source-governing) | n/a | applicability='n/a' |
| Coupling | not declared (declarative-tier — HR contracts declared at standards tier; execution site is F-artifact slice per LIV-Standard A5) | n/a | applicability='n/a' |
| Judgment | not declared (declarative-tier — zero J-inputs declared per §7.1 P7=0) | n/a | applicability='n/a' |

**Discipline:** every source-governing axis declared with RC coverage at v2.4. G-V10 part B now produces full-coverage-pass on Structure + Schema axes. Partial-drift dissolved.

#### §3.13.1 AmendmentProvenance (Sprint B2 Shot 5)

```
amendmentProvenance = {
  amendmentId:        'artifact-standard-v2-4-sprint-b2-shot-5',
  predecessorVersion: '2.3',
  successorVersion:   '2.4',
  cycleId:            'sprint-b2-shot-5',
  timestamp:          '2026-05-17',
  authorityClaim:     { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'Δ-A: §1 governsRuntimeCode = true row added per MA-I8 with basis prose',
    'Δ-B: §1 referentCitations populated with 5-RC array covering Structure + Schema axes',
    'Δ-C: §3.13 MA-V10 part B jurisdiction coverage section added with 5-axis table',
    'Δ-D: §3.13.1 AmendmentProvenance added; §9 change log entry added; version v2.3 → v2.4',
    'Δ-E: §3.5 leaf-reconciliation footnote added (F-MFA-AS-001 closure)'
  ]
}
```

---

## §4 Validity

### §4.1 Gate count

AS declares **10 own axiom gates** (G-Ar1..G-Ar7 with G-Ar4 split into G-Ar4a..G-Ar4d). v2.2's 11 → 10 at v2.3 per Sprint B2 Shot 2c (G-Ar8 dissolved). All 52 metaframework framework-tier gates are inherited by reference per substrate §1.3 S-03 permitted-multi-execution; AS consumes them through the `MetaframeworkGateIdSet` atom (metaframework §6.5).

| Category | Count | Source |
|---|---|---|
| AS-own axiom gates (one per ArA axiom per MA-V1) | 11 | §4.2 (this framework) |
| Inherited primitive gates (PG1–PG7) | 7 | metaframework §4 (per-framework-tier) |
| Inherited axiom gates (G-I1–G-J4) | 35 | metaframework §4 (test metaframework axioms; AS conforms) |
| Inherited universal MA-G13 gate | 1 | metaframework §4 (declared at substrate §11.4) |
| Inherited F-69 universal gates | 5 | metaframework §4 (G-U1–G-U5) |
| Inherited meta-gates | 4 | metaframework §4 (G-M1–G-M4) |
| **Total framework-tier gates at S2 execution** | **63** | **52 metaframework-tier + 11 AS-own** |

Substrate gates SG1–SG4 excluded per substrate §11.5 tier-1 "run once, not per framework" semantics.

### §4.2 AS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + MA-V2 (gates test conditions directly, no test-by-reference) + G-M1 (axiom-gate 1:1 mapping integrity):

| Gate | Tests axiom | Mechanical test body | Ground (substrate §6.3) |
|---|---|---|---|
| **G-Ar1** | ArA1 | `emission.writes.a4 !== null && emission.writes.a7 !== null` | structural property |
| **G-Ar2** | ArA2 | `emission.writes.a7.artifactAnchorNodeId !== null && emission.writes.a7.companionDataNodeId !== null && [single emission] count(anchor | emissionId) === 1 && count(companion | emissionId) === 1` | cardinality |
| **G-Ar3** | ArA3 | `emission.writes.a7.contentNodeIds.length >= 1` | cardinality |
| **G-Ar4a** | ArA4a | `count(e ∈ emission.edges where e.kind === 'classification-lineage') === 1 && e.fromId === emission.writes.a7.artifactAnchorNodeId && e.toId === emission.writes.a4.classificationNodeId` | cardinality + reference resolution |
| **G-Ar4b** | ArA4b | `count(e ∈ emission.edges where e.kind === 'categorical') === 1 && e.fromId === emission.writes.a7.artifactAnchorNodeId && e.toId === resolveModeNode(emission.framework.id)` (resolver = Living Memory one-hop) | cardinality + reference resolution |
| **G-Ar4c** | ArA4c | `let p = resolvePriorAnchor(emission.framework.id, emission.userId); if (p !== null) count(e ∈ emission.edges where e.kind === 'version') === 1 && e.fromId === emission.writes.a7.artifactAnchorNodeId && e.toId === p; else count(e ∈ emission.edges where e.kind === 'version') === 0` | cardinality (conditional 0 or 1) + reference resolution |
| **G-Ar4d** | ArA4d | `count(e ∈ emission.edges where e.kind === 'dependency') === (input.dependsOn?.length ?? 0) && forall i ∈ [0, input.dependsOn.length): exists e ∈ emission.edges where e.kind === 'dependency' && e.fromId === emission.writes.a7.artifactAnchorNodeId && e.toId === input.dependsOn[i]` | cardinality + reference resolution |
| **G-Ar5** | ArA5 | For persisted emission E: Living Memory mutation attempts on E.writes.a7.artifactAnchorNodeId or E.writes.a7.companionDataNodeId properties are rejected by Living Memory write-protection predicate (predicate: `node.emissionId !== null → write.rejected = true`). | structural property (mutation-rejection predicate) |
| **G-Ar6** | ArA6 | `forall e ∈ emission.edges: e.kind ∈ {'classification-lineage', 'categorical', 'version', 'dependency'}` | enum membership |
| **G-Ar7** | ArA7 | `deepEqual(emission.payload, input.payload) === true` (byte-identical; no normalization) | deterministic-function result (identity) |

*Sprint B2 Shot 2c: G-Ar8 (paired with ArA8 emissionId-uniqueness) dissolved. Rationale: emissionId is a UUID v4 minted per call via `generateId` — structural collision is impossible. The runtime stub at `src/features/F-artifact/app/artifact-emit.ts` evaluated a constant-false function (`isEmissionIdCollisionNeverTrue`), indicating the gate was already operationally vacuous. Removed at v2.3 from §4.2 gate table, §3.4 S2 gate-execution bundle, §4.3 X2 Determinism dimension, §4.4 gate execution order, §4.5 AS-own gate enumeration.*

**MA-V1 coverage:** 10 axioms ↔ 10 primary gates (post-Sprint-B2-Shot-2c). 1:1 mapping. G-M1 passes.
**MA-V2 coverage:** every gate test body is a direct mechanical predicate; no test references another gate. Pass.
**MA-V3 coverage:** every gate result ∈ `{'passed', 'failed', 'pending'}` per `ArtifactGateResult` shape (artifact-standard.types.ts). Binary-plus-pending ternary. Pass.
**MA-V4 coverage:** gate re-verification on state change — AS state changes occur only via emission (post-emission immutability per ArA5); each emission invokes S2 gate-execution. Pass.
**MA-V5 coverage:** gate set enumerable via framework-audit X1–X10 dimensions. G-V5 tests gate-to-dimension mapping completeness; AS provides 11 own gates + 52 inherited = 63 total coverage against X1–X10 dimensions. See §4.4 dimension-gate mapping. Pass (self-declared; framework-audit first-run verifies).

### §4.3 Inherited gate execution at S2

Per substrate §1.3 S-03: metaframework framework-tier gates declared once at metaframework; executed at AS's S2 gate-execution step. No redeclaration.

Inherited gate IDs consumed by reference as `MetaframeworkGateIdSet` (metaframework §6.5):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4.`

Total: 52 framework-tier gates per metaframework §4.7.

### §4.4 Dimension–gate mapping (per MA-V5)

Per framework-audit-v1-3 §3.3 X1–X10 dimensions: AS's gate set covers all ten dimensions.

| Dimension | AS-own gates | Inherited gates |
|---|---|---|
| X1 Temporal / lifecycle | — | G-I4 (Semver), G-L1, G-L2, G-L3 |
| X2 Determinism | G-Ar1..G-Ar7 (all mechanical) | G-S1, G-S2, G-S3, G-J2 |
| X3 Observability | — | G-C4 (handoff captureShape), G-V2, G-C3 (provenance) |
| X4 Negative space | — (scopeOut at §1) | G-I1 (Mode declared), G-L2 (amendment trigger) |
| X5 Scale / composition | G-Ar3, G-Ar4d (cardinality scaling) | G-St1..G-St5 |
| X6 Operator / human | — | G-C6 (OperatorInterface; see §6.6) |
| X7 Failure taxonomy | G-Ar5 (mutation rejection) | G-L4 (escalation state), G-M4 |
| X8 Bootstrapping | — | G-L6 (activation-flow), G-L7 (bootstrap non-re-entrancy) |
| X9 Termination | — | G-L1, G-L3, G-L5 (judgment deprecation path) |
| X10 Activation flow | — | G-L6, G-M3 (gate execution order) |

All 10 dimensions reachable from ≥1 gate. MA-V5 satisfied.

### §4.5 Gate execution order

Per substrate §11.5:
1. Tier 1 — Substrate gates (SG1–SG4): excluded from AS's per-invocation path; run once at substrate audit.
2. Tier 2 — Primitive + axiom gates (PG1–PG7 + G-I1..G-J4 inherited + G-Ar1..G-Ar7 own): run at S2.
3. Tier 3 — Universal gates (G-G13, G-U1–G-U5): run at S2 after tier 2 pass.
4. Tier 4 — Meta-gates (G-M1–G-M4): run at S2 after tier 3 pass.

Failure at any tier halts subsequent tiers per substrate §11.5.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5 (v3-1-spec §3.4 A-24):
- G-M failure → universal gates re-run.
- Universal gate failure → axiom gates re-verified.
- Substrate-tier failure: terminal; escalates to L0 per substrate §14.6 bootstrap restore.

### §4.7 Gate rules (GR-series)

Inherited from metaframework §4.6 by reference (v3-1-spec §3.4, unchanged from original spec).

### §4.8 Current gate results

**All 63 per-invocation gates: state = `not-yet-run`.** First-run pending framework-audit post-beta per §8 deferrals.

Gate ID enumeration (canonical set):

AS-own (10): `G-Ar1, G-Ar2, G-Ar3, G-Ar4a, G-Ar4b, G-Ar4c, G-Ar4d, G-Ar5, G-Ar6, G-Ar7` (post-Sprint-B2-Shot-2c — G-Ar8 dissolved).

Inherited (52, per `MetaframeworkGateIdSet`): enumerated §4.3.

---

## §5 Lifecycle

### §5.1 Version transition

v2.1 → v2.2 → v2.3. Additive per MA-L1. v2.1 → v2.2: ArA6/ArA7/ArA8 added (edge-set-exhaustive, payload-verbatim, emissionId-uniqueness); seven-axis shell rendered. v2.2 → v2.3 (Sprint B2 Shot 2c): ArA8 + G-Ar8 dissolved per *removal-is-additive* clause — ArA8's predicate was vacuously satisfied per UUID v4 generation (structural collision impossible); the runtime stub at `src/features/F-artifact/app/artifact-emit.ts` evaluated a constant-false function, indicating gate already operationally vacuous. No behavior change for prior-passing artifacts.

**v2.1 → v2.2 structural changes:**
- Seven-axis shell (A1–A7) replaces v2.1's three-axis top level. v2.1's Emission/Composition/Lineage become AS-local P1 axis instances under the inherited A3 Structure shell.
- P8 procedure added (three steps S1–S3 under Stages 2, 3, 5) per substrate §8.3 + PR4 + PR5.
- HR-Ar1..HR-Ar4 handoff rules declared with captureShape + diagnosticSignificance per substrate §8.2 amended P6 shape.
- Custody table refreshed with owner + layer + consumer per substrate SG3.
- Provenance field populated per metaframework-v3-1 §2.2 output schema (reference-default per A-20).
- ArA6–ArA8 added (edge-set enum exhaustive, payload verbatim-carry, emissionId uniqueness).

### §5.2 Amendment trigger

Gap-driven + L0-directive. Amendment triggers declared ∈ `{'vision', 'gap', 'L0-directive'}` per MA-L2.

**Amendments active at delivery:** none (v2.2 initial delivery).

**v2.2 regen trigger:** L0-directive (metaframework v2.4 → v3.1 transition mandates regen of all L3 frameworks against new seven-axis + amended P6/P8 primitives + new MA-L6/MA-L7 axioms).

### §5.3 Confirmation gate

Confirmation by L0 confirmed at Sprint B2 unified close fix-round (regen wave cycle 1 post-cycle ratification gate satisfied per manager soundness-check). Monotonic per MA-L3 (confirmation once given not retracted; future amendment requires new confirmation).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery per MA-L5 + §3.2 P7=0 basis (AS has no judgment inputs; no deprecation events possible at this version).

### §5.6 Failure modes

Per metaframework-v3-1 §5.7 + v3-1-spec §3.3 output-schema `lifecycle` field V5-verification additions:

| Step | Failure mode | Recovery |
|---|---|---|
| S1 (compose) | `input` schema violation (missing required field, invalid type, confidence out of range) | return `Result { ok: false, error: ArtifactError { code: 'ARTIFACT_INPUT_INVALID' } }`; no Living Memory write; state unchanged |
| S1 (compose) | Living Memory traversal of `payload.content` returns empty → ArA3 pre-commit violation | return `Result { ok: false, error: ArtifactError { code: 'ARTIFACT_COMPOSITION_FAILED' } }`; no Living Memory commit |
| S2 (gate-execution) | Any of 10 AS-own gates or 52 inherited gates fails | apply metaframework §4.5 backward-invalidation rule (tier 4 fail → re-run tier 3; tier 3 fail → re-verify tier 2; tier 1 fail terminal, escalates to L0 per substrate §14.6); emission not produced; return `ArtifactError { code: 'ARTIFACT_GATE_FAILED' }` |
| S3 (emit) | Living Memory transaction commit rejected (consistency violation, lock contention) | rollback; return `ArtifactError { code: 'ARTIFACT_EMISSION_REJECTED' }`; no partial write per Living Memory transaction atomicity |

### §5.7 Scale bounds

Per v3-1-spec §3.3 V5-verification additions. Bounded by:
- Input cardinality: `input.dependsOn.length` unbounded in schema; per-invocation gate cost scales as O(N) in dependsOn entries via G-Ar4d.
- Content traversal: `writes.a7.contentNodeIds.length >= 1`; upper bound declared per Living Memory traversal limits (not AS-owned).
- Gate execution: O(62) per-invocation (constant) — post-Sprint-B2-Shot-2c (was 63 at v2.2 with G-Ar8).
- Living Memory write throughput: per substrate §13.4 atomicity table.

### §5.8 Atomicity declarations

Per substrate §13.4 "Owned framework execution: interruptible" row:
- S1 (compose) — atomic at step boundary; recovery point = S1 order value. On interrupt: discard composed tuple; no commit.
- S2 (gate-execution) — atomic at step boundary; recovery point = S2 order value. Per-gate results accumulated idempotently.
- S3 (emit) — Living Memory transaction atomic (per substrate §13.4 "Registry write" row equivalent). No partial write commits.

AS emission end-to-end (S1 → S2 → S3) is not atomic across steps; each step is atomic individually; inter-step failure returns `Result { ok: false, error }` with no Living Memory side effect prior to S3 commit.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.1 | pre-2026-03 | Initial regen under metaframework v2.1 (pre-v3.0). Not traced here; pre-regen-wave file history. | L0 |
| v2.0 | pre-2026-04 | Regenerated against metaframework v2.4 (adds MA-G5c custody, MA-G5d provenance). | L0 |
| v2.1 | pre-2026-04-23 | §9 output schema per-field provenance added; MA-G5d satisfied. | L0 |
| v2.2 | 2026-04-23 (L3 regen wave cycle 1) | Regenerated against metaframework-v3-1 via generation-procedure-v1-0. Seven-axis shell adopted; v2.1 three-axis top-level folded into AS-local P1 axis instances under A3 Structure. Three P8 steps (S1–S3) under Stages {2, 3, 5} per substrate §8.3 + PR4 + PR5. Four handoff rules (HR-Ar1..HR-Ar4) with captureShape + diagnosticSignificance per substrate §8.2 amended P6 shape. ArA6 (edge-set enum exhaustive), ArA7 (payload verbatim-carry), ArA8 (emissionId uniqueness) added per MA-St3 orthogonality review. Custody table refreshed with owner + layer + consumers per substrate SG3. Provenance field populated per metaframework §2.2 (reference-default per A-20). | L0 (pending regen-cycle confirmation) |
| v2.3 | 2026-05-15 (Sprint B2 Shot 2c) | ArA8 + G-Ar8 dissolved per *removal-is-additive* clause. Rationale: emissionId is a UUID v4 minted per call via `generateId` — structural collision is impossible. The runtime stub at `src/features/F-artifact/app/artifact-emit.ts` evaluated a constant-false function (`isEmissionIdCollisionNeverTrue`), indicating gate was already operationally vacuous. **Δ:** §1 Own invariants 11→10; §1 Own discipline G-Ar1–G-Ar8 → G-Ar1–G-Ar7; §3.2 P3/P4/P5 counts 11→10; §3 intro axiom range ArA1–ArA8 → ArA1–ArA7; §3.6 heading + ArA8 row removed + AxR3 self-check updated; §3.4 S2 gates field G-Ar8 removed; §3.4 disambiguation note 11→10 + 63→62; §3.7 P7 basis ArA1–ArA8 → ArA1–ArA7; §4.1 gate count 11→10; §4.2 G-Ar8 row removed + MA-V1 11↔11 → 10↔10; §4.3 X2 Determinism G-Ar1..G-Ar8 → G-Ar1..G-Ar7; §4.4 tier-2 list G-Ar8 removed; §4.5 AS-own (11) → (10) + enumeration sweep at both §4.5 and §745 audit-time bundle. **Source-side:** `isEmissionIdCollisionNeverTrue` stub removed from `src/features/F-artifact/app/artifact-emit.ts`; `evaluateGar8` removed from `src/features/F-artifact/domain/artifact-gates.ts`; `gar8` field removed from `GateBatch` type; `isCollision` parameter removed from `evaluateAllGates` signature; call-site at `createArtifact` updated. **Discipline:** removal is additive per MA-L1 — no behavior change for prior-passing artifacts; gate predicate was already constant-false at runtime. Cross-framework: PS v1.2 cross-framework input row references AS v2.3 (companion Sprint B2 Shot 2 amendment). authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending'} | L0 (pending Sprint B2 Shot 2c ratification) |
| v2.4 | 2026-05-17 (Sprint B2 Shot 5) | MA-I8 governsRuntimeCode apparatus applied + MA-V10pB RC closure + F-MFA-AS-001 leaf-reconciliation footnote. **Δ-A:** §1 `governsRuntimeCode: true` row added with basis prose (AS governs `src/features/F-artifact/**` — domain, app, types, contract layers). **Δ-B:** §1 `referentCitations` populated — 5-RC array covering Structure axis (artifact-emit.ts, artifact-gates.ts, artifact-edges.ts) and Schema axis (artifact-types.ts, artifact-contract.ts); partial-drift dissolved. **Δ-C:** §3.13 jurisdiction coverage section added with 5-axis table — Structure + Schema axes at full RC coverage; remaining axes applicability='n/a'. **Δ-D:** §3.13.1 AmendmentProvenance added. **Δ-E:** §3.5 leaf-reconciliation footnote added (15 shape-declaration rows vs P3=10 canonical axiom-condition count; audit-trail observation per MA-St2). **Δ-F:** §1 Version v2.3 → v2.4; this change log entry. Zero axiom/gate/schema changes; zero primitive count changes. Additive per MA-L1. authorityClaim: {level:'L0', actor:'wearer', source:'demos_ra@hotmail.com'} | L0 (Sprint B2 Shot 5) |

---

## §6 Coupling

### §6.1 Carrier

Artifact Standard carrier = `self`. AS emits own artifact (`ArtifactEmission` W-ATOM) directly per HR-Ar2 (Living Memory write) + HR-Ar4 (content framework receipt). Content frameworks (Plan, Multi-Instance, etc.) have `carrier = 'artifact-standard'`; those frameworks declare payload content only and do not emit own carrier mechanics — their emission flows through AS.

### §6.2 Handoff rules

Four framework-local HR instances. All AS-owned handoffs with declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-Ar1** | cognitive-standard → artifact-standard | `['self']` | `true` | declared §6.3 |
| **HR-Ar2** | artifact-standard → living-memory | `['self']` | `true` | declared §6.3 |
| **HR-Ar3** | content-framework → artifact-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-Ar4** | artifact-standard → content-framework | `['self', 'named']` | `false` | n/a (receipt contract; captured via HR-Ar2 Living Memory write) |

**Inherited HRs referencing AS:**

| HR | Owning declaration | AS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → AS type consumption; AS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; AS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records AS's emissions per provenance contract (see §6.5) |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by AS.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-Ar1 — Cognitive Standard → Artifact Standard (classification input):**
```
captureShape = {
  capturedFields: ['classificationNodeId', 'primitive', 'confidence', 'turnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-Ar2 — Artifact Standard → Living Memory (write):**
```
captureShape = {
  capturedFields: ['emissionId', 'artifactAnchorNodeId', 'companionDataNodeId', 'contentNodeIds', 'edges', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'living-memory node-by-emissionId query; framework-audit §8.3 via registry cross-reference'
}
```

**HR-Ar3 — Content framework → Artifact Standard (createArtifact invocation):**
```
captureShape = {
  capturedFields: ['framework.id', 'framework.version', 'turnId', 'userId', 'payload.domain', 'payload.domainVersion', 'emissionId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-Ar4:** no captureShape declared (`diagnosticSignificance: false`); receipt-only contract; diagnostic data captured at HR-Ar2.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C6 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'self'`.
- **MA-C2** (custody per atom): §6.5 enumerates every AS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-Ar1..HR-Ar4 send/receive shapes matched by construction; capture contracts symmetric.
- **MA-C4** (provenance per output field): §2.2 every `ArtifactEmission` field has declared provenance trace; §6.5 custody.
- **MA-C5** (carrier-consistent emission): `carrier = 'self'` → output is W-ATOM per MA-S2; §2.2 `ArtifactEmission` is W-ATOM.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; atoms consumed by AS from substrate/primitives/metaframework are not re-owned.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | artifact-standard, cognitive-standard, living-memory, every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | artifact-standard, every session-aware framework |
| `Semver` | primitives.ts | core/R5 | artifact-standard, every versioned framework |
| `CognitivePrimitive` | primitives.ts | core/R5 | artifact-standard (ArA attachment), cognitive-standard (origin semantics), living-memory (edge-primitive type) |
| `Result<T, E>` | primitives.ts | core/R5 | artifact-standard (S3 return), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | artifact-standard (ArtifactError extends), every error-carrying framework |
| `Mode` | substrate | L1 (substrate §2) | artifact-standard (§1 Identity `Mode = generative`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | artifact-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | artifact-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | artifact-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | artifact-standard (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | artifact-standard (HR direction endpoints §6.2, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed this regen) | artifact-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed this regen) | artifact-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed this regen) | artifact-standard (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed this regen) | artifact-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed this regen) | artifact-standard (inherited via HR-Ar3 content-framework invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed this regen) | artifact-standard (§6.7 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed this regen) | artifact-standard (§1 Identity genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | artifact-standard (§3.7 P8 stage field) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | artifact-standard (§3.7 PR5 self-check) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | artifact-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | artifact-standard (not directly consumed; declared empty per §3.2 P7=0; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | artifact-standard (empty-declaration basis per MA-J4) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | artifact-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | artifact-standard (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | artifact-standard (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | artifact-standard (§8.2 dimension results schema reference) |
| `ArtifactChainPosition` | artifact-standard | L3 (this file §2 + core/R5) | artifact-standard (internal), framework-audit (X1, X5 dimension checks) |
| `ArtifactEdgeKind` | artifact-standard | L3 (this file §2 + core/R5) | artifact-standard (internal), content frameworks (reference at payload-attribute references), framework-audit |
| `ArtifactCompositionProduct` | artifact-standard | L3 (this file §3.8 + core/R5) | artifact-standard (internal), framework-audit |
| `ArtifactEmissionPositional` | artifact-standard | L3 (this file §3.8 + core/R5) | artifact-standard (internal) |
| `ArtifactCompositionPositional` | artifact-standard | L3 (this file §3.8 + core/R5) | artifact-standard (internal) |
| `ArtifactLineagePositional` | artifact-standard | L3 (this file §3.8 + core/R5) | artifact-standard (internal) |
| `ArtifactPayload` | artifact-standard | L3 (this file §2.1 + core/R5) | artifact-standard (§2.1 input, §2.2 output), content frameworks (populate at caller site) |
| `CreateArtifactInput` | artifact-standard | L3 (this file §2.1 + core/R5) | artifact-standard (§3.7 S1 input), content frameworks (construct at caller site) |
| `ArtifactEmission` | artifact-standard | L3 (this file §2.2 + core/R5) | artifact-standard (§3.7 S3 output), content frameworks (receive at HR-Ar4), living-memory (store), framework-audit (observe via registry) |
| `ArtifactEdge` | artifact-standard | L3 (this file §2.2 + core/R5) | artifact-standard (§2.2 emission.edges), living-memory (store) |
| `ArtifactWriteA4` | artifact-standard | L3 (this file §2.2 + core/R5) | artifact-standard (§2.2 writes.a4), cognitive-standard (data origin) |
| `ArtifactWriteA7` | artifact-standard | L3 (this file §2.2 + core/R5) | artifact-standard (§2.2 writes.a7), living-memory (store) |
| `ArtifactProcedureStepInstance` | artifact-standard | L3 (§3.7 + core/R5) | artifact-standard (internal), framework-audit (X10 stage-declaration check) |
| `ArtifactGateResult` | artifact-standard | L3 (§4 + core/R5) | artifact-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `ArtifactDimensionResult` | artifact-standard | L3 (§4.4 + core/R5) | artifact-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `ArtifactCustodyRow` | artifact-standard | L3 (§6.5 + core/R5) | artifact-standard (internal), framework-audit (custody-check X2/X5) |
| `ArtifactHandoffRuleInstance` | artifact-standard | L3 (§6.2 + core/R5) | artifact-standard (internal), framework-audit (X3 C5 captureShape check) |
| `ArtifactError` | artifact-standard | L3 (core/R5) | artifact-standard (internal); extends primitives.ts `AppError` per Result<T, E> shape |
| `CreateArtifactResult` | artifact-standard | L3 (core/R5) | artifact-standard (S3 return type), content frameworks (consume at HR-Ar4) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

- `generatedByMetaframework`: `{id: 'metaframework', version: 'v3.2.1'}`
- `generationProcedureRef`: `{id: 'generation-procedure', version: 'v1.1.1'}`
- `generationTimestamp`: 2026-04-23T00:00:00Z
- `sourceInputRef`: AtomRef pointing to registry-archived `MetaframeworkInput` (regen-cycle input, reference-default per A-20)
- `sourceInputValue`: absent (by-value retention not opted in at this regen)

Every output field of `ArtifactEmission` §2.2 has declared provenance row:

| Field | Provenance kind | Source |
|---|---|---|
| `emissionId` | runtime-generated | UUID v4 generated at S1 |
| `framework.id`, `framework.version` | verbatim | `input.framework.id`, `input.framework.version` |
| `turnId` | verbatim | `input.turnId` |
| `userId` | verbatim | `input.userId` |
| `writes.a4.classificationNodeId` | verbatim | `input.classificationNodeId` (Cognitive Standard origin per HR-Ar1) |
| `writes.a4.primitive` | verbatim | `input.primitive` (Cognitive Standard origin per HR-Ar1) |
| `writes.a4.confidence` | verbatim | `input.confidence` (Cognitive Standard origin per HR-Ar1) |
| `writes.a7.artifactAnchorNodeId` | adjacent-framework-sourced | Living Memory node-create at S1 |
| `writes.a7.companionDataNodeId` | adjacent-framework-sourced | Living Memory node-create at S1 |
| `writes.a7.contentNodeIds` | adjacent-framework-sourced | Living Memory `traverse(payload.content)` at S1 |
| `edges` | adjacent-framework-sourced + derived | Living Memory one-hop queries at S1 (ArA4a/b/c) + input.dependsOn[] (ArA4d) |
| `payload` | verbatim | `input.payload` per ArA7 |
| `timestamp` | runtime-generated | ISO 8601 at S3 |

No field with ambiguous or undeclared source.

### §6.7 Carrier-applicability enforcement

Per v3-1-spec §3.5 + substrate §9 A-13:

| HR | Applicability | Meaning |
|---|---|---|
| HR-Ar1 | `['self']` | Applies only when consuming framework's carrier = 'self' (AS is self-carrier) |
| HR-Ar2 | `['self']` | Applies only when AS carrier = 'self' (Living Memory write path; B3 post-beta named-carrier path deferred) |
| HR-Ar3 | `['self', 'named']` | Applies when content framework carrier ∈ {self, named}; carrier='none' content frameworks invoke AS through AxiomRef path (post-beta) |
| HR-Ar4 | `['self', 'named']` | Symmetric receipt contract; matches HR-Ar3 by construction |

AS carrier = 'self', so HR-Ar1 + HR-Ar2 apply in the self-application direction.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

```
operatorInterface = {
  invocationEntry:  'HR-Ar3 receive-side: createArtifact(input: CreateArtifactInput): CreateArtifactResult',
  outputRetrieval:  'HR-Ar2 Living Memory query: readByEmissionId(emissionId: string); registry lookup via framework-audit §8.3 AuditRunRecord path',
  auditQuery:       'framework-audit §8.3 AuditRunRecord query path; cross-reference via metaframework HR3',
  runtimeState:     'declared'
}
```

Runtime implementation deferred post-beta per §1 scopeOut row "framework registry dispatch runtime". Declaration-only at this delivery.

---

## §7 Judgment

### §7.1 Declared J-inputs

**AS declares zero judgment inputs.** Per §3.2 P7=0 basis + MA-J4 emptyDeclared field.

Empty-declaration marker per substrate §8.6:
```
{primitiveKind: P7, instanceCount: 0, basis: "AS's createArtifact procedure is fully mechanical. Every axiom condition (ArA1–ArA7) reduces to substrate §6.3 mechanical-criterion ground: cardinality (ArA1, ArA2, ArA3, ArA4a, ArA4b, ArA4c, ArA4d), structural property (ArA5), enum membership (ArA6), deterministic-function result (ArA7). No non-mechanical derivation required at S1, S2, or S3. MA-J4 emptyDeclared satisfied. (ArA8 dissolved at v2.3 per Sprint B2 Shot 2c.)"}
```

### §7.2 Axis status

Empty (not populated). Zero judgment-input instances per §3.2 P7=0. Empty-declaration rule (substrate §8.6) applies.

### §7.3 Judgment provenance

Not applicable at this delivery (no judgment inputs declared). MA-J4 coverage: empty Judgment axis explicitly declared; MA-J1..MA-J3 vacuously satisfied.

Future amendment path (per MA-L5): if AS acquires a judgment input (e.g., post-beta cardinality-bound judgment on `dependsOn[]` pruning), declare at this section + amend P7 count at §3.2 + add judgment provenance record.

---

## §8 Self-audit results

### §8.1 Gate results

**All 63 per-invocation gates: state = `not-yet-run`.** First-run pending framework-audit execution post-beta per §1 scopeOut + §5 lifecycle.

AS-own gate ID enumeration (10): `G-Ar1, G-Ar2, G-Ar3, G-Ar4a, G-Ar4b, G-Ar4c, G-Ar4d, G-Ar5, G-Ar6, G-Ar7` (post-Sprint-B2-Shot-2c — G-Ar8 dissolved).

Inherited gate ID enumeration (52, via `MetaframeworkGateIdSet`): see metaframework-v3-1 §4.7 canonical enumeration + §6.5 atom declaration. Not restated here per single-source via reference (A-08).

### §8.2 Dimension audit results

**All 10 framework-audit dimensions (X1–X10): state = `pending-first-run`.** Uniform state; compact summary per sprint-mode directive.

Dimension ID enumeration: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-3 §3.3.

**X3 extended criterion C5 relevance.** Framework-audit Phase 1.2 extended X3 with C5 (captureShape required per P6 instance with diagnosticSignificance=true). AS declares three HRs with `diagnosticSignificance: true` (HR-Ar1, HR-Ar2, HR-Ar3) with populated `captureShape` at §6.3; author-side self-check declares pass for C5. Independent re-verification at framework-audit first-run.

**X10 extended predicate relevance.** Framework-audit Phase 1.2 extended X10 with three bullets (stage declaration per substrate §8.3, PR4 monotonicity, PR5 kind alignment). X10 applies directly to AS's three P8 instances. Self-check: PR4 stages (2, 3, 5) non-decreasing across order (1, 2, 3); PR5 kinds aligned (stage:2 ↔ mechanical ✓; stage:3 ↔ gate-execution ✓; stage:5 ↔ mechanical ✓). Author-side self-check passes; framework-audit first-run verifies independently.

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application at metaframework §4.3): framework-audit runs X1–X10 against AS post-beta. At this regen delivery, self-audit is declared-placeholder state. No gate has executed; no dimension has evaluated. First execution ratifies initial state.

**SelfAuditRecord shape** (per framework-audit §8.1, consumed by reference):

```
{
  frameworkRef:         { id: 'artifact-standard', version: 'v2.2' },
  auditedByFrameworkRef: null,                    // pending first run
  auditTimestamp:       null,                      // pending first run
  frameworkStateHash:   null,                      // pending first run

  gateResults:       [],                          // populated first run; 63 GateResult entries expected
  dimensionResults:  [],                          // populated first run; 10 DimensionResult entries expected
  overallResult:     'pending'
}
```

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v2.2 | 2026-04-23 | Initial regeneration against metaframework-v3-1 via generation-procedure-v1-0 (L3 regen wave cycle 1). Rendered as `GeneratedFrameworkTemplate` per metaframework §2.2 output schema. Seven-axis shell (A1–A7) inherited; AS-local P1 axes (Emission, Composition, Lineage) declared under A3 Structure. Eleven axioms ArA1..ArA8 with ArA4a–ArA4d split declared under AxR1/AxR2/AxR3/AxR4 discipline. Eleven AS-own axiom gates G-Ar1..G-Ar8 declared per MA-V1. Three P8 procedure steps S1–S3 under substrate §8.3 Stages {2, 3, 5} with PR4 + PR5 compliance. Four HRs (HR-Ar1..HR-Ar4) with captureShape + diagnosticSignificance per substrate §8.2 amended P6. Custody table refreshed per substrate SG3. Provenance field populated reference-default per A-20. Scope-out declared per X4 dimension. Operator-interface declared per A-13 + V5 verification. | L0 (pending regen-cycle confirmation) |
| v2.3 | 2026-05-15 (Sprint B2 Shot 2c) | ArA8 + G-Ar8 dissolved. Rationale: emissionId is a UUID v4 minted per call via `generateId` — structural collision impossible; runtime stub at `src/features/F-artifact/app/artifact-emit.ts` (`isEmissionIdCollisionNeverTrue`) was a constant-false function, indicating gate already operationally vacuous. Removal is additive per MA-L1 *removal-is-additive* clause. Counts: ArA 11→10, G-Ar 11→10, total per-S2 invocation 63→62. Source-side: `isEmissionIdCollisionNeverTrue` stub removed; `evaluateGar8` removed from `domain/artifact-gates.ts`; `gar8` field removed from `GateBatch`; `isCollision` parameter removed from `evaluateAllGates`. Cross-framework: PS v1.2 cross-framework input row references AS v2.3. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending'} | L0 (pending Sprint B2 Shot 2c ratification) |

---

## End of artifact-standard-v2-3
