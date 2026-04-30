# cognitive-standard-v1-2

**Kind:** Framework
**Mode:** generative
**Level:** L3
**Version:** v1.2.2 (MF-Cycle-2 cascade — pin sweep + cycle-1 + cycle-2 inheritance absorption; v1.3 amendment block at §10 carries forward)
**Authority:** L0 pending (MF-Cycle-2 cascade, post-cognitive-audit-against-mf-v3-2-7 patch)
**Consumes:** substrate-v1-1 (v1.6), metaframework-v3-1 (v3.2.7), primitives.ts (core/R5), Living Memory v2.2 (graph atoms + traverse + Present)
**Consumed by:** Artifact Standard (HR-Ar1 receive-side: classificationNodeId + primitive + confidence at A4), Multi-Instance Standard (CognitiveClassificationPort R3 surface), F-chat (post-integration: processMessage entry point), F-codec slice implementation
**Dependencies:** substrate-v1-1 v1.6 (by reference, per HR1 inherited), metaframework-v3-1 v3.2.7 (via HR6 receive-side output contract), generation-procedure-v1-0 v1.1.6 (generator), framework-audit-v1-2 v1.3.6 (audit surface)
**Versioning discipline:** additive only (per MA-L1)
**Adjacent frameworks:** Artifact Standard (downstream consumer at A4), Living Memory (graph read/write substrate), LIV-Standard (code-structure custodian), Plan / Multi-Instance / Verification / Research Standards (downstream domain frameworks consuming codec classification at A4)

Cognitive Standard is the L3 generative-mode framework governing the encode/route/decode layer between natural language and typed graph operations. It owns chain links A4 (classification) and B-direction lift (structured graph state → text). Its content is rendered from metaframework-v3-1 §3 structural template via generation-procedure-v1-0 S1–S3. This file is the `GeneratedFrameworkTemplate` emission per metaframework-v3-1 §2.2 output schema.

**Generator provenance:**
- `generatedByMetaframework`: `{id: 'metaframework', version: 'v3.2.7'}`
- `generationProcedureRef`: `{id: 'generation-procedure', version: 'v1.1.6'}`
- `sourceInputRef`: registry-archived `MetaframeworkInput` (reference-default per R-phase-1-1-resolution-20)
- `generationTimestamp`: 2026-04-30T00:00:00Z (MF-Cycle-2 cascade — pin-sweep + cycle-1+cycle-2 inheritance absorption)
- `genesisEvent`: `'lift-into-canonical-form during Sprint 3 cycle, post-MF-amendment-1 — distributed declaration across F-codec/SLICE.md + R0 atoms (codec-types.ts, codec-decode-types.ts) + R1/R2 implementation comments lifted into single-file MFv3 v3.2.5 conformant render; v1.2.2 absorbs MF-Cycle-1 (v3.2.4) + MF-Cycle-2 (v3.2.7) deltas via additive pin-sweep + inheritance enumeration extension'`

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Cognitive Standard |
| Kind | `Framework` |
| Mode | `generative` |
| Level | `L3` |
| Version | `v1.2.2` |
| Ownership (template) | `L0` |
| Ownership (applied) | `System` (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `applied` (F-codec slice live since Phase 5+; Cognitive Standard lifts existing implementation into canonical form) |
| Carrier | `self` (emits `EncodeResult` and `CodecPipelineResult` W-ATOMs directly per MA-S2; payload class has no separate emission carrier — Cognitive output IS the carrier atom) |
| Consumes | substrate-v1-1 v1.6 (via inherited HR1), metaframework-v3-1 v3.2.7 (via HR6 receive-side), primitives.ts core/R5, Living Memory v2.2 (graph atoms + traverse + Present + scope-stamping per LMA21) |
| Consumed by | Artifact Standard (A4 classification triple at HR-Ar1), Multi-Instance Standard (CognitiveClassificationPort), F-chat (processMessage entry point), F-codec slice implementation |
| Authority | L0 pending (MF-Cycle-2 cascade; ratified at v1.2.2 confirmation gate per §5.3 — supersedes Sprint 3 entry / cognitive-lift-audit-1 closure at v1.2.1) |
| Genesis | `{bootstrapped: false, genesisEvent: 'lift cycle Sprint 3 entry, post-MF-amendment-1 — F-codec implementation precedes canonical authoring'}` |
| scopeOut | `['domain payload content (owned by content framework — Plan, M-I, Verification, Research)', 'artifact emission mechanics at A7 (owned by Artifact Standard)', 'graph physics — node/energy/traversal (owned by Living Memory)', 'code structure (owned by LIV-Standard)', 'framework module registry runtime (owned by F-codec/codec-registry — implementation, not standard)', 'B-direction symmetric output re-encoding pre-v1.3 (becomes in-scope at v1.3 amendment §10)']` |
| referentCitations | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause). **v1.2.3 upgrade flag:** F-codec referent paths declared in §2.3 atom-inventory + §6.4 custody table (path strings of form `F-codec/R0/codec-types.ts`, `F-codec/R0/codec-routing-types.ts`, `F-codec/R0/codec-decode-types.ts`) qualify as `referentKind='code'` referents per cycle-2 spec §3.7 citation scope; promotion of these path entries to typed `ReferentCitation` records (per substrate §4 A-18 typed shape `{citationId, citingFrameworkRef, atomName, referentKind, path, expectedShape}`) is scheduled at v1.2.3 once a `ReferentResolver` for `referentKind='code'` is registered at framework-audit's R-layer per cycle-2 spec §3.8 parser surface. At v1.2.2 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.2.2; promotion scheduled at v1.2.3' (vacuous-pass per MA-V11). G-S8 / G-L11 likewise vacuous-pass (zero citations to type-check; zero-citation audit run permits null `referentSnapshotRef`). |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | `{stateTemplate, stateApplied}` ∈ substrate §9 `LifecycleState` enum; `{declared, applied, terminated, deprecated}` transitions declared at §5.1 |
| Own I/O | input: `EncodeInput` (§2.1); output: `CodecPipelineResult` (§2.2; full-pipeline output) and `EncodeResult` (§2.2; conversation-only short path) |
| Own invariants | 5 axis-bound structural-transformation axioms (CA1–CA5) per §3.6; + 68 axis-bound + 1 universal MA-G13 inherited from metaframework-v3-1 §3.2 (per MFv3 v3.2.7 §4.1: G-I1..G-I7=7 + G-S1..G-S8=8 + G-St1..G-St16=16 + G-V1..G-V11=11 + G-L1..G-L11=11 + G-C1..G-C10=10 + G-J1..G-J5=5 = 68; cycle-1 additions G-S7 + G-V11 paired with MA-S7 + MA-V11; cycle-2 additions G-V10 + G-S8 + G-L11 paired with MA-V10 + MA-S8 + MA-L11) |
| Own discipline | six P8 step procedure (§3.7 S1–S6 under Stages {2, 2, 2, 2, 2, 5}); axiom gates G-CA1–G-CA5 at §4.2; handoff rules HR-Cog1–HR-Cog4 at §6.2 |

All four properties declared. MA-G13 passes. Cognitive Standard is classified as framework (not state store; not protocol; not substrate).

---

## §2 Schema

### §2.1 Inputs

Cognitive Standard accepts two input shapes corresponding to its two encode modes (LLM-assisted and mechanical) plus one input shape for full-pipeline invocation.

**`EncodeInput`** — conversation encode (LLM-assisted path):

```
EncodeInput = {
  content:    string,              // natural-language input from user turn
  userId:     UserId,              // F-identity session
  projectId?: string,              // optional project scope per LMA21
  modelId?:   string               // optional override of CODEC_CONFIG.CLASSIFY_MODEL
}
```

**`MechanicalEncodeInput`** — system-event encode (no LLM):

```
MechanicalEncodeInput = {
  eventType: keyof MECHANICAL_MAPPINGS,   // 'pipeline.started' | 'pipeline.completed' | 'pipeline.failed' | 'stage.completed' | 'stage.failed'
  label:     string,                       // event-derived label
  userId:    UserId
}
```

**`PipelineInput`** — full-pipeline invocation (encode + classify-domain + route + decode + render + dispatch):

```
PipelineInput = EncodeInput   // pipeline takes the same shape as conversation encode at entry
```

Per MA-S1 (every framework declares typed input atom): `EncodeInput` is the canonical input atom. `MechanicalEncodeInput` is a sibling atom for the structured-event path (CA4 observable-transition class). `PipelineInput` is a type alias capturing pipeline-entry semantics.

### §2.2 Outputs

Cognitive Standard emits two output atoms corresponding to short-path encode vs full-pipeline invocation.

**`EncodeResult`** — conversation encode short-path output:

```
EncodeResult = {
  primitive:     CognitivePrimitive,         // 'anchor' | 'relate' | 'restructure' | 'reinforce' | 'suppress' | 'reference'
  label:         string | null,              // normalized label; null for Reference (read-only)
  boundToNodeId: NodeId | null,              // existing node if bind hit; null if new
  userId:        UserId,
  source:        'llm' | 'mechanical'
}
```

**`CodecPipelineResult`** — full-pipeline output (encode → classify-domain → route → decode → render → dispatch):

```
CodecPipelineResult = {
  encode:           EncodeResult,                  // §3.7 S1 output, carried verbatim
  bindingDomain:    BindingDomain,                 // 'build' | 'conversational' | 'unknown'
  route:            RouteAction,                   // 'dispatch-planner' | 'chat-response' | 'reference-only'
  decodedContext:   DecodedContext,                // {systemPromptBlock, structureCount}
  decodeOutput:     DecodeOutput,                  // {entities[], relations[], claims[], sequences[], tensions[], artifacts[]}
  classificationNodeId: NodeId,                    // identity-stamp at A4 for downstream AS HR-Ar1 receive-side
  confidence:       number                         // [0, 1] from ClassifyResult
}
```

**`ClassifyResult`** — internal cycle output from classification step (consumed by §3.7 S1 derivation):

```
ClassifyResult = {
  primitive:  CognitivePrimitive,
  confidence: number,                              // [0, 1] from LLM self-assessment
  reasoning:  string                               // one-line explanation; debug only
}
```

**`DecodeOutput`** — internal product of §3.7 S4 (graph classification step):

```
DecodeOutput = {
  entities:   DecodedStructure[]                   // category = 'entity'
  relations:  DecodedStructure[]                   // category = 'relation'
  claims:     DecodedStructure[]                   // category = 'claim'
  sequences:  DecodedStructure[]                   // category = 'sequence'
  tensions:   DecodedStructure[]                   // category = 'tension'
  artifacts:  DecodedStructure[]                   // category = 'artifact'
}

DecodedStructure =
  | { category: 'entity';   nodeId, name, layer, energy }
  | { category: 'relation'; fromNodeId, toNodeId, relationType, weight, primitiveType }
  | { category: 'claim';    nodeId, name, confidence, supportCount, energy }
  | { category: 'sequence'; nodeIds[], labels[], direction, armId }
  | { category: 'tension';  nodeIdA, nodeIdB, nameA, nameB, bridgeWeight }
  | { category: 'artifact'; nodeId, moduleId, version, title, mode, fields, energy }
```

**`DecodedContext`** — rendered output of §3.7 S5 (token-budgeted text for LLM system prompt injection):

```
DecodedContext = {
  systemPromptBlock: string,                       // structured text (not prose) for system prompt assembly
  structureCount:    number                        // total classified structures rendered
}
```

Per MA-S2 (carrier=self → output is W-ATOM): both `EncodeResult` and `CodecPipelineResult` are emitted directly to caller. `ClassifyResult`, `DecodeOutput`, `DecodedContext` are internal cycle outputs consumed by §3.7 procedure steps; emitted to caller only as nested fields of `CodecPipelineResult`.

### §2.3 Atom inventory

Per MA-G6 (every cell named type, enum literal, or inlined shape):

| Atom | Declared at | Declaration shape |
|---|---|---|
| `CognitivePrimitive` | F-codec/R0/codec-types.ts | string-literal union of 6 |
| `MutatingPrimitive` | F-codec/R0/codec-types.ts | `Exclude<CognitivePrimitive, 'reference'>` (5) |
| `EncodeInput` | this §2.1 + F-codec/R0 (consumed via codec-encode signature) | typed shape |
| `MechanicalEncodeInput` | this §2.1 + F-codec/R0 (consumed via codec-encode signature) | typed shape |
| `EncodeResult` | F-codec/R0/codec-types.ts | typed shape |
| `ClassifyResult` | F-codec/R0/codec-types.ts | typed shape |
| `BindingDomain` | F-codec/R0/codec-routing-types.ts | enum `'build' \| 'conversational' \| 'unknown'` |
| `RouteAction` | F-codec/R0/codec-routing-types.ts | enum `'dispatch-planner' \| 'chat-response' \| 'reference-only'` |
| `CodecPipelineResult` | F-codec/R0/codec-routing-types.ts | typed shape |
| `DecodeCategory` | F-codec/R0/codec-decode-types.ts | enum `'entity' \| 'relation' \| 'claim' \| 'sequence' \| 'tension' \| 'artifact'` |
| `RelationType` | F-codec/R0/codec-decode-types.ts | enum `'depends-on' \| 'derived-from' \| 'contradicts' \| 'supports' \| 'associated'` |
| `DecodedStructure` | F-codec/R0/codec-decode-types.ts | discriminated union over `DecodeCategory` |
| `DecodeOutput` | F-codec/R0/codec-decode-types.ts | typed shape |
| `DecodedContext` | F-codec/R0/codec-decode-types.ts | typed shape |

All atoms consumed by code by reference per A-08.

---

## §3 Structure

### §3.1 Axes (inherited)

Cognitive inherits metaframework-v3-1 v3.2.7's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. Cognitive does not redeclare.

Per v3-1-spec §4.4 file-specific placement, Cognitive's own structural content populates §3.3–§3.9 below: three P1 Axis instances at v1.2 (Encode, Route, Decode); the v1.3 amendment block at §10 declares a fourth P1 Axis (Symmetry).

### §3.2 Primitive instance counts (v1.2 baseline)

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 3 | `{primitiveKind: P1, instanceCount: 3, basis: "Cognitive-local domain axes declared at §3.3: Encode (A-direction), Route, Decode (B-direction). Seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9; Cognitive-local P1 instances populate §3 Structure under the inherited shell."}` |
| P2 Sub-axis | 8 | Encode: `classification` + `labeling` + `binding`; Route: `domainClassification` + `routeDetermination`; Decode: `graphClassification` + `render` + `parseFailure`. Declared §3.4. |
| P3 Leaf | 5 | One leaf per axiom per MA-St2 leaf atomicity; CA1..CA5 → 5 leaves. Declared §3.5. |
| P4 Axiom | 5 | CA1, CA2, CA3, CA4, CA5. Declared §3.6. |
| P5 Gate | 5 | G-CA1..G-CA5. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-Cog1 (Living Memory traverse + Present + write — read/write substrate), HR-Cog2 (Artifact Standard receive-side at HR-Ar1 — supplies classificationNodeId + primitive + confidence), HR-Cog3 (F-multi-instance CognitiveClassificationPort — supplies classifyRunReport at runReport classification), HR-Cog4 (F-event-system mechanical-encode subscription + dispatch — codec.route-build emission). Declared §6.2. |
| P7 Judgment input | 2 | J-classify (LLM classification call), J-label (LLM label extraction call). Cognitive is NOT fully mechanical: classification + labeling depend on LLM judgment per CA2 axis-derivation (six-from-three-axes: classification of input into one of 6 primitives is judgment-bound, not mechanical). Declared §7. |
| P8 Procedure step | 6 | S1 (encode), S2 (classify-domain), S3 (route), S4 (decode), S5 (render), S6 (dispatch). Declared §3.7. |

Per substrate §8.6: counts are positive declarations. No implicit absence.

### §3.3 P1 Axis instances (Cognitive-local, v1.2 baseline)

Three domain axes. MECE over Cognitive's concern space (encode/route/decode pipeline at A4 + B-direction lift).

| id | Axis | Concern |
|---|---|---|
| `Encode` | Encode (A-direction) | Natural-language input → typed cognitive primitive + label + binding (existing-vs-new node). Owns CA2 axis-derivation, CA3 mutation-uniqueness, CA4 observable-transition for the input direction of the codec. |
| `Route` | Route | (primitive, binding domain) → action. Owns CA1 cycle-shape (intent → state → delta as one pipeline pass — manifests at routing where one primitive cycle resolves to one route). |
| `Decode` | Decode (B-direction) | Typed graph state → classified structures → rendered text. Owns CA5 topology-derivation and the CA4 observable-transition for the output direction of the codec. |

**MECE verification:**

- Orthogonality: Encode governs "input → typed primitive" (A-direction concern); Route governs "(primitive, domain) → action" (decision concern); Decode governs "graph → text" (B-direction concern). No pair-overlap; each axis's concern is structurally distinct.
- Exhaustiveness: every `EncodeResult` field traces to Encode; every `RouteAction` value traces to Route; every `DecodeOutput` field and `DecodedContext` field traces to Decode (verified §3.9 traceability table).
- No axis exceeds boundary: Encode does not classify graph state (Decode owns); Decode does not produce primitive cycles (Encode owns); Route does not write or read graph (it is purely (primitive, domain) → action).

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Encode sub-axes:**

| id | Sub-axis | Leaf set (P3 refs) |
|---|---|---|
| `Encode/classification` | Classification of input content into one of 6 primitives | `leaf-CA2`, `leaf-CA3` (axiom-bound axis-derivation + mutation-signature-uniqueness) |
| `Encode/labeling` | Normalized label extraction from content | `leaf-CA4` (observable-transition; LLM call output is deterministic given (content, graph state) under fixed temperature) |
| `Encode/binding` | Bind result to existing node (via Living Memory traverse) or null for new | (no own leaf at v1.2; binding semantics derive from CA2 axis 1 BOUND/UNBOUND axiom; encoded into `EncodeResult.boundToNodeId` field directly) |

**Route sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Route/domainClassification` | Topological classification of binding domain (build vs conversational vs unknown) per CA5 graph-derivation discipline | (no own leaf; consumes CA5 leaf via Decode/graphClassification cross-reference per substrate §1.3 S-03) |
| `Route/routeDetermination` | Mapping (primitive, binding domain) → `RouteAction` per declared CA1 cycle-shape | `leaf-CA1` |

**Decode sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Decode/graphClassification` | Classification of graph topology into 6 `DecodeCategory` forms (entity, relation, claim, sequence, tension, artifact) | `leaf-CA5` |
| `Decode/render` | Token-budgeted rendering of classified structures into systemPromptBlock | (no own leaf; rendering semantics derive from CA5 observable-transition under deterministic projection) |
| `Decode/parseFailure` | Fallback semantics when classify or label LLM calls fail (anchor-fallback, normalized-content-slice fallback) | (no own leaf at v1.2; covered by CA5 observable-transition with declared fallback values) |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-CA1` | `axiom` | `OnePrimitivePerCycle: every encode invocation produces exactly one CognitivePrimitive output and resolves to exactly one RouteAction` |
| `leaf-CA2` | `axiom` | `SixFromThreeAxes: CognitivePrimitive enum cardinality = 6, derived from {binding ∈ {BOUND, UNBOUND}} × {structural ∈ {ADD, REORGANIZE, NONE}} × {weight ∈ {INCREASE, DECREASE, NONE}} subject to declared exclusion set` |
| `leaf-CA3` | `axiom` | `UniqueMutationSignature: each MutatingPrimitive has unique (binding, structural, weight) tuple; reference is the single non-mutating primitive` |
| `leaf-CA4` | `axiom` | `ObservableTransition: every classification, labeling, decode classification, and render output is deterministic given declared inputs (content + graph state for encode; graph state alone for decode); LLM calls operate at temperature 0` |
| `leaf-CA5` | `axiom` | `TopologyDerivation: decode classifications are derived from graph topology alone (node/edge/energy/layer state); no LLM inference, no authored heuristic table` |

### §3.6 P4 Axiom instances (CA1–CA5, v1.2 baseline)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **CA1** | `Route/routeDetermination` / `leaf-CA1` | Every full-pipeline invocation produces `CodecPipelineResult` with exactly one `encode.primitive` value drawn from `COGNITIVE_PRIMITIVES` AND exactly one `route` value drawn from `RouteAction` enum. One primitive in, one route out, per pipeline pass. | cardinality (= 1 each) |
| **CA2** | `Encode/classification` / `leaf-CA2` | `COGNITIVE_PRIMITIVES.length === 6`. The six primitives are exactly `{anchor, relate, restructure, reinforce, suppress, reference}`. Derived from declared 3-axis space {binding × structural × weight}; exclusion set governs which 3-tuple combinations are not enumerated as standalone primitives. | enum-cardinality + structural-derivation |
| **CA3** | `Encode/classification` / `leaf-CA3` | For every pair `(p1, p2)` in `MutatingPrimitives × MutatingPrimitives` with `p1 ≠ p2`: the (binding, structural, weight) signature of `p1` differs from `p2` in at least one axis. Reference primitive has `(BOUND, NONE, NONE)` mutation signature with `mutating = false`; this signature is unique to reference. | structural property (signature-uniqueness predicate) |
| **CA4** | `Encode/labeling` / `leaf-CA4` | For LLM-assisted encode: classify-call temperature = `CODEC_CONFIG.CLASSIFY_TEMPERATURE` = 0; same `(content, presentState)` input pair under the same model produces the same `ClassifyResult.primitive` and same normalized `label`. For mechanical encode: `MECHANICAL_MAPPINGS[eventType]` is a deterministic constant lookup. Every encode is deterministic given declared inputs. | deterministic-function result + reference resolution (config constant) |
| **CA5** | `Decode/graphClassification` / `leaf-CA5` | Every `DecodedStructure` instance in `DecodeOutput.{entities, relations, claims, sequences, tensions, artifacts}` is computed from `MemGraph` topology alone — node fields (`id, layer, energy`), edge fields (`fromId, toId, weight, primitiveType`), arm fields (`armId`), without LLM call invocation in the decode classifier path. `classifyGraph(graph)` is a pure function over `MemGraph`. | structural property (purity predicate; absence of LLM call site in `codec-decode.ts`) |

**AxR1 self-check:** each axiom binds to exactly one axis/sub-axis/leaf per attachment column. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set additively versioned — v1.2 is baseline lift of pre-existing F-codec implementation; renumber from informal CA1, CA3, CA4, CA5, CA8 (in code comments) to canonical CA1–CA5 is a v1.2 authoring decision, not an axiom-set change. v1.3 amendment (§10) adds CA6 + CA7 additively per MA-L1. Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

**v1.0/v1.1 → v1.2 renumber note:** Pre-v1.2 code comments in F-codec cite CA1, CA3, CA4, CA5, CA8 — these were informal references in implementation comments, never frozen as a contract. v1.2 baseline canonicalizes the axiom set as CA1–CA5 by mapping (axioms + paired leaves both renumbered for surface-naming consistency):

- old axiom `CA1` → new `CA1` (cycle-shape, attached to Route); leaf-CA1 unchanged
- old axiom `CA3` → new `CA2` (six-from-three-axes, attached to Encode/classification); leaf-CA3 → leaf-CA2
- old axiom `CA4` → new `CA3` (mutation-signature-uniqueness, attached to Encode/classification); leaf-CA4 → leaf-CA3
- old axiom `CA5` → new `CA4` (observable-transition, attached to Encode/labeling); leaf-CA5 → leaf-CA4
- old axiom `CA8` → new `CA5` (topology-derivation, attached to Decode/graphClassification); leaf-CA8 → leaf-CA5

Sprint 3 builder will sweep F-codec implementation comments to bump informal CA1–CA8 cites to canonical CA1–CA5 cites with v1.2 reference. No semantic change; cleanup-class only.

### §3.7 P8 Procedure step instances

Six steps. PR4 stage monotonicity + PR5 stage-content-kind alignment enforced.

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **S1** | 1 | 2 | `judgment-input` | `EncodeInput` (LLM-assisted) OR `MechanicalEncodeInput` (mechanical) | `EncodeResult` | `judgmentInputRef = "J-classify (§7.1)"` for LLM-assisted path; for mechanical path: `derivation = "lookup MECHANICAL_MAPPINGS[input.eventType]; primitive = lookup result; label = normalized input.label; boundToNodeId = traverse(label, userId).topNodes[0] ?? null; source = 'mechanical'"` (kind shifts to `mechanical` for mechanical-encode invocation; declared as polymorphic-step per substrate §8.3 P8 amended) |
| **S2** | 2 | 2 | `mechanical` | `EncodeResult` from S1 + `presentState` from Living Memory `Present()` call | `BindingDomain` | `derivation = "topological classify: if encode.boundToNodeId resolves to node in build-arm subgraph (per Living Memory arm membership) → 'build'; else if encode.label or content matches BUILD_DOMAIN_SIGNALS keyword list → 'build' (bootstrap heuristic until graph densifies); else if boundToNodeId resolves to conversational arm → 'conversational'; else → 'unknown'"` |
| **S3** | 3 | 2 | `mechanical` | `EncodeResult.primitive` + `BindingDomain` from S2 | `RouteAction` | `derivation = "lookup route table — primitive='reference' → 'reference-only' (always, regardless of domain); else if domain='build' → 'dispatch-planner'; else → 'chat-response'. Routing function: action = f(primitive, binding_region) per CA1; no authored routing table beyond this 3-cell discrimination"` |
| **S4** | 4 | 2 | `mechanical` | `MemGraph` resolved from `Present(userId, axes, limit)` + `getUserGraph(userId)` + `getGlobalGraph()` (scope-stamp per LMA21) | `DecodeOutput` | `derivation = "invoke classifyGraph(graph) per F-codec/R1/codec-decode.ts pure function; produces 6-bucket DecodeOutput; CA5 governs purity (no LLM call)"` |
| **S5** | 5 | 2 | `mechanical` | `DecodeOutput` from S4 + `DECODE_MAX_TOKENS` budget config | `DecodedContext` | `derivation = "invoke renderForSystemPrompt(decodeOutput, budget) per F-codec/R1/codec-decode-render.ts pure function; structures ordered by layer (M0 first) then energy descending; lowest-energy items truncated to fit DECODE_MAX_TOKENS budget"` |
| **S6** | 6 | 5 | `mechanical` | `RouteAction` from S3 + `EncodeResult` from S1 + `DecodedContext` from S5 | `CodecPipelineResult` W-ATOM emitted to caller; `codec.route-build` event emitted to F-event-system iff `route = 'dispatch-planner'` | `derivation = "construct CodecPipelineResult per §2.2 output schema from S1+S2+S3+S4+S5 outputs; if route = 'dispatch-planner', invoke emitEvent('codec.route-build', {...}) per F-event-system R3 contract; return CodecPipelineResult W-ATOM to caller. CA1 cycle-closure: one input message → one CodecPipelineResult emission"` |

**Stage monotonicity (PR4 self-check):** S1 stage 2 → S2 stage 2 → S3 stage 2 → S4 stage 2 → S5 stage 2 → S6 stage 5. Stages non-decreasing. No stage 3 (gate-execution) declared at procedure level — gates execute at framework-tier independently per substrate §11.5; Cognitive's own gates G-CA1..G-CA5 (§4.2) execute against pipeline output as a closing-tier sweep, not as an in-procedure step. Pass.

**Stage-content-kind alignment (PR5 self-check):** S1 stage 2 with `kind: judgment-input` (or `mechanical` for mechanical-encode polymorph) per substrate §8.3 amended (`StageContentKind[2] = 'mechanical'` baseline; `judgment-input` permitted at stage 2 when consuming declared P7 J-input per substrate §8.3 P0–P4 procedure shape declared at framework-audit v1.3.6 §3.3 — mechanical and judgment-input are both permitted at stage 2 under MF-amendment-1 substrate v1.3 P8 shape). S2–S5 stage 2 with `kind: mechanical`. S6 stage 5 with `kind: mechanical`. Pass.

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Encode` | `string` (bound to `turnId`; encode invocation per turn; UUID v4 per call) | `CognitivePrimitive` enum `'anchor' \| 'relate' \| 'restructure' \| 'reinforce' \| 'suppress' \| 'reference'` | `EncodeResult.primitive: CognitivePrimitive` paired with `EncodeResult.boundToNodeId: NodeId \| null` (typed-field reference within one EncodeResult; `primitive` sourced from CA2 derivation, `boundToNodeId` sourced from Living Memory traverse) | `EncodePositional` enum `'pre-classify' \| 'classified' \| 'bound'` |
| `Route` | (no temporal carry — routing is synchronous within one pipeline pass) | `RouteAction` enum `'dispatch-planner' \| 'chat-response' \| 'reference-only'` | `EncodeResult.primitive: CognitivePrimitive` paired with `BindingDomain: 'build' \| 'conversational' \| 'unknown'` (typed-field-pair input to route-determination per CA1) | `RoutePositional` enum `'pre-decision' \| 'decided'` |
| `Decode` | `MemGraph` snapshot via `Present()` at invocation timestamp (Living Memory provides graph version via traverse cache) | `DecodeCategory` enum `'entity' \| 'relation' \| 'claim' \| 'sequence' \| 'tension' \| 'artifact'` | `DecodedStructure.fromNodeId: NodeId` paired with `DecodedStructure.toNodeId: NodeId` (relation category); `DecodedStructure.nodeIds: NodeId[]` (sequence category traversal chain); typed-field references per CA5 graph-purity | `DecodePositional` enum `'pre-classify' \| 'classified' \| 'rendered'` |

All Relational cells express dependency order via named-type + typed-field reference per MA-G6.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `CognitivePrimitive` | §2.3 + `F-codec/config/codec-types.ts` | enum `'anchor' \| 'relate' \| 'restructure' \| 'reinforce' \| 'suppress' \| 'reference'` |
| `MutatingPrimitive` | §2.3 + `F-codec/config/codec-types.ts` | `Exclude<CognitivePrimitive, 'reference'>` (5 values) |
| `BindingDomain` | §2.3 + `F-codec/config/codec-routing-types.ts` | enum `'build' \| 'conversational' \| 'unknown'` |
| `RouteAction` | §2.3 + `F-codec/config/codec-routing-types.ts` | enum `'dispatch-planner' \| 'chat-response' \| 'reference-only'` |
| `DecodeCategory` | §2.3 + `F-codec/config/codec-decode-types.ts` | enum `'entity' \| 'relation' \| 'claim' \| 'sequence' \| 'tension' \| 'artifact'` |
| `RelationType` | §2.3 + `F-codec/config/codec-decode-types.ts` | enum `'depends-on' \| 'derived-from' \| 'contradicts' \| 'supports' \| 'associated'` |
| `EncodePositional` | §3.8 (this) | enum `'pre-classify' \| 'classified' \| 'bound'` |
| `RoutePositional` | §3.8 (this) | enum `'pre-decision' \| 'decided'` |
| `DecodePositional` | §3.8 (this) | enum `'pre-classify' \| 'classified' \| 'rendered'` |
| `EncodeInput`, `MechanicalEncodeInput`, `EncodeResult`, `ClassifyResult`, `CodecPipelineResult`, `DecodeOutput`, `DecodedStructure`, `DecodedContext` | §2.1 + §2.2 + corresponding F-codec R0 atoms | typed shapes per §2 |
| `BUILD_DOMAIN_SIGNALS` | F-codec/R0/codec-routing-types.ts | string literal keyword list; bootstrap heuristic until arm membership densifies |
| `CODEC_CONFIG` | F-codec/R0/codec-types.ts | config record `{CLASSIFY_MODEL, CLASSIFY_MAX_TOKENS, CLASSIFY_TEMPERATURE = 0, LABEL_MAX_LENGTH, MODULE_EXEC_MAX_TOKENS, MODULE_EXEC_TEMPERATURE = 0}` |
| `MECHANICAL_MAPPINGS` | F-codec/R0/codec-types.ts | `Record<eventType, MutatingPrimitive>` lookup table; 5 mappings per CA4 deterministic-via-constant rule |
| `DECODE_MAX_TOKENS` | F-codec/R0/codec-decode-types.ts | numeric constant (token budget for §3.7 S5 render) |
| `present state` | §3.7 S1, S2 + Living Memory v2.2 §D | result of `Present({scope, axes, limit})` invocation per LM v2.2 §D parameter shape |
| `graph snapshot` | §3.7 S4 | result of `getUserGraph(userId)` + `getGlobalGraph()` invocations, stamped per LMA21 scope discipline |
| `NodeId`, `UserId`, `Result`, `AppError`, `Semver` | primitives.ts core/R5 | consumed by reference |

---

## §4 Validity

### §4.1 Gate count

Cognitive declares **5 own axiom gates** (G-CA1..G-CA5). All 85 metaframework framework-tier gates (per MFv3 v3.2.7 §4.1: 7 PG + 5 F-69 + 1 G-G13 + 68 axiom + 4 meta) are inherited by reference per substrate §1.3 S-03 permitted-multi-execution; Cognitive consumes them through the `MetaframeworkGateIdSet` atom (substrate §4 A-15, derived consumer per MFv3 v3.2.7 §3.5).

| Category | Count | Source |
|---|---|---|
| Cognitive-own axiom gates (P5) | 5 | G-CA1..G-CA5 (this §4.2) |
| Substrate primitive gates (PG1–PG7) | 7 | substrate §11.2; inherited by reference |
| F-69 universal gates | 5 | G-U1, G-U2, G-U3, G-U4, G-U5 (MFv3 §4.3); inherited by reference. G-U1 self-application runs against framework-audit itself; G-U2 propagation completeness runs at amendment-propagation against PropagationTrace; G-U3 axiom-axis coverage + G-U4 primitive declaration + G-U5 provenance completeness run per-framework at framework-audit invocation. |
| Substrate G-G13 gate | 1 | substrate §11.4; inherited by reference |
| Metaframework framework-tier gates (axiom inherited) | 68 | G-I1..G-I7=7 + G-S1..G-S8=8 + G-St1..G-St16=16 + G-V1..G-V11=11 + G-L1..G-L11=11 + G-C1..G-C10=10 + G-J1..G-J5=5 (per MFv3 v3.2.7 §4.1; tests Cognitive's conformance to MA-I1..MA-J5 metaframework axioms. Cycle-1 additions: G-S7 paired with MA-S7 (Schema-axis additive amendment, predicate tightened cycle-2 to recursive `≼`); G-V11 paired with MA-V11 (applicability-basis required). Cycle-2 additions: G-V10 paired with MA-V10 (spec↔referent Categorical alignment); G-S8 paired with MA-S8 (ReferentCitation declaration shape conformance); G-L11 paired with MA-L11 (audit-run snapshot stamping). Inherited axioms paired 1:1 with these gates per substrate §1.3 SI-03.) |
| Metaframework meta-gates | 4 | G-M1..G-M4 |
| **Cognitive-own total at framework execution** | **5** | gates declared in this file |
| **Inherited total at framework execution** | **85** | 7 PG + 5 F-69 + 1 G-G13 + 68 axiom + 4 meta = 85 (substrate-tier excluded per substrate §11.5; SG1–SG5 run once at substrate boundary, not per framework). Matches MFv3 v3.2.7 §4.1 framework-tier total of 85. |
| **Per-invocation framework-tier gate count** | **90** | (85 inherited + 5 own); declared in §3.7 S2-equivalent gate-bundle for closing sweep |

Note: Cognitive's S2 step in §3.7 is `mechanical` (binding-domain classify), not `gate-execution`. Gate execution is declared as a closing-tier sweep at framework boundary, not as an in-procedure step.

### §4.2 Cognitive-own axiom gate definitions (G-CA1–G-CA5)

Per MA-V1 (every axiom has ≥1 gate) + MA-V2 (gate is mechanical predicate over framework state).

| Gate | Tests | Mechanical predicate | Result class |
|---|---|---|---|
| **G-CA1** | CA1 | For every `CodecPipelineResult` instance: `result.encode.primitive ∈ COGNITIVE_PRIMITIVES` AND `result.route ∈ {'dispatch-planner', 'chat-response', 'reference-only'}`. One primitive value, one route value, no nullables on these fields. | binary (pass/fail per result instance) |
| **G-CA2** | CA2 | `COGNITIVE_PRIMITIVES.length === 6` AND `COGNITIVE_PRIMITIVES` deeply-equals `['anchor', 'relate', 'restructure', 'reinforce', 'suppress', 'reference']` (set equality with declared canonical order). | binary (single static check) |
| **G-CA3** | CA3 | For every pair `(p1, p2)` ∈ `MUTATING_PRIMITIVES × MUTATING_PRIMITIVES` with `p1 ≠ p2`: structural-mutation-signature lookup table differs in at least one of {binding, structural, weight}. (Implementation: §3.6 CA3 condition encoded as static signature table; gate validates table is static + complete + signature-unique.) | binary (single static check at signature table) |
| **G-CA4** | CA4 | `CODEC_CONFIG.CLASSIFY_TEMPERATURE === 0` AND `CODEC_CONFIG.MODULE_EXEC_TEMPERATURE === 0`. AND for every entry in `MECHANICAL_MAPPINGS`: value ∈ `MUTATING_PRIMITIVES`. AND `MECHANICAL_MAPPINGS` is exported as a `const` record (immutable at module scope). | binary (multi-clause static check; all clauses pass = pass) |
| **G-CA5** | CA5 | `classifyGraph` exported from `F-codec/domain/codec-decode.ts` accepts `MemGraph` and returns `DecodeOutput` with no LLM call site in its transitive dependency closure (verified by static dependency analysis: no import path from `codec-decode.ts` resolves to `codec-ai-io.ts` or any LLM-invoking module). | binary (static dependency analysis) |

All gates mechanical per substrate §11.6 (no criteria-bounded gates at v1.2 baseline). Gate failure logs timestamp, instance tested, failure reason per substrate §11.6.

### §4.3 Inherited gate execution

Per substrate §1.3 S-03 permitted-multi-execution: G-I1..G-J5 + G-G13 + G-U1..G-U5 + PG1..PG7 + G-M1..G-M4 are declared once at metaframework / substrate and executed against Cognitive at framework-audit invocation. Cognitive does not redeclare these gates; consumes by reference per `MetaframeworkGateIdSet` atom (MFv3 §6.5).

### §4.4 Gate execution order

Per substrate §11.5:

1. Substrate-tier (SG1–SG5) — runs once at substrate boundary, not per framework.
2. Primitive integrity (PG1–PG7) — per-framework, run against Cognitive at audit.
3. Framework universal (G-U1..G-U5, G-G13) — per-framework, run against Cognitive at audit (G-U1 self-application: only framework-audit itself executes; for Cognitive, G-U1 inherited by reference but not executed-on by audit run targeting Cognitive).
4. Cognitive-own (G-CA1..G-CA5) — per-invocation closing sweep against `CodecPipelineResult` instance OR static against config/atoms.
5. Metaframework framework-tier (G-I1..G-J5, G-M1–G-M4) — per-framework conformance run at audit.

Failure at any tier halts subsequent tiers per substrate §11.5.

### §4.5 Verifies

Per Playbook §1.14 (verifies test variables, not application). Variable-bound only:

| Verify | Tests |
|---|---|
| V1 | `COGNITIVE_PRIMITIVES` cardinality = 6 AND set-equality with canonical enum |
| V2 | `MUTATING_PRIMITIVES = COGNITIVE_PRIMITIVES \ {reference}`; cardinality = 5 |
| V3 | Every `EncodeResult` instance has `primitive ∈ COGNITIVE_PRIMITIVES` AND (`source = 'llm'` ∨ `source = 'mechanical'`) AND (`label === null` IFF `primitive = 'reference'`) |
| V4 | Every `CodecPipelineResult` instance has all S1–S6 outputs populated; `route ∈ RouteAction` enum |
| V5 | `CODEC_CONFIG.CLASSIFY_TEMPERATURE = 0` AND `CODEC_CONFIG.MODULE_EXEC_TEMPERATURE = 0` |
| V6 | `classifyGraph` is pure (no LLM call in transitive deps); decode path never invokes `codec-ai-io` |
| V7 | `MECHANICAL_MAPPINGS` is a `const` record; every value ∈ `MUTATING_PRIMITIVES`; cardinality matches declared event-type set |
| V8 | Every classification at S1 returns `ClassifyResult` with `confidence ∈ [0, 1]` |

---

## §5 Lifecycle

Per MFv3 v3.2.7 §2.2 `GeneratedFrameworkTemplate.lifecycle` slot schema: `{versionTransition, amendmentTrigger, confirmationGate, escalationState, judgmentDeprecations, failureModes, scaleBounds, atomicityDeclarations}`. All 8 sub-fields populated below per MFv3 §5 declaration pattern.

### §5.1 Version transition

Per substrate §9 `LifecycleState` enum: `{declared, applied, terminated, deprecated}`. Per MA-L1 additive-only versioning.

**State-transition rules:**

- `declared` → `applied`: on first invocation of `encodeLLM()` or `processMessage()` against a real userId in F-codec slice; transition logged at invocation site.
- `applied` → `deprecated`: on declaration of successor Cognitive Standard version with `deprecates: 'cognitive-standard-v1-2'` field set in successor's §1 Identity.
- `applied` → `terminated`: on hard-stop directive at L0 authority (no termination declared in foreseeable scope; transition reserved per substrate §9 enum exhaustiveness).

**Version trajectory:** v1.0 (Phase 5 initial F-codec ship) → v1.1 (Phase 5+ distributed amendments) → v1.2 (Sprint 3 entry — first canonical authoring) → v1.2.1 (Cognitive lift cycle audit-remediation patch) → **v1.2.2 (MF-Cycle-2 cascade — pin sweep + cycle-1 + cycle-2 inheritance absorption; current)** → v1.3 (Sprint 3 — A7 + 8.9 amendment, additive per MA-L1; declared at §10).

### §5.2 Amendment trigger

Per MFv3 §5.2 pattern (gap-driven):

- **v1.2 trigger:** Sprint 3 entry — Cognitive lift cycle. F-codec slice deployed since Phase 5+ without canonical standard file; lift driven by Sprint 3 dependency on frozen Cognitive standard for v1.3 amendment authoring + Sprint 3 spec drafting. Closure gap, not finding-driven.
- **v1.3 trigger:** Brief v16.1 §8 Sprint 3 scope bundles A7 (decode work-output contract extension) + 8.9 (symmetric output typing). Amendment scope-positive at §10.
- **No active amendment** beyond v1.3 declared at delivery.

### §5.3 Confirmation gate

L0 ratification gate at end of MF-Cycle-2 cascade. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation). Gate criterion: substrate v1.6 + metaframework v3.2.7 + framework-audit v1.3.6 + generation-procedure v1.1.6 conformance verified; CA1–CA5 axioms grounded in F-codec implementation; v1.3 amendment block declares additive scope per MA-L1; cycle-1 + cycle-2 inheritance enumeration declared (G-S7, G-V11, G-V10, G-S8, G-L11 with paired axioms per MFv3 v3.2.7 §3.2.1); `referentCitations` field declared on the GeneratedFrameworkTemplate emission per MF v3.2.7 §2.2.

**Audit-trail format** (per X3 dimension): every gate-execution result + every state-transition event logged with shape `{eventId: UUID, frameworkRef: 'cognitive-standard-v1-2', eventType: 'gate-execution' | 'state-transition' | 'amendment-event', timestamp: ISO8601, sourceFrameworkRef, payload}`. Logs persist to F-codec slice's standard logging surface (instrumentation.ts boot-side hook); query interface is `getCognitiveAuditTrail({frameworkRef?, eventType?, timeRange?})` per F-codec/R3 contract surface (declared at v1.2; runtime implementation deferred to Sprint 3 build). Note: `frameworkRef` carries the family identifier `'cognitive-standard-v1-2'`; patch-level (v1.2.1 → v1.2.2) lives in §1 Identity Version field. Family-ref bumps only on `deprecates` transition per §5.10.

### §5.4 Escalation state

Per MFv3 §5.4 shape `{status, gap, requiredMode}`:

```
escalationState = {
  status: 'none',
  gap: null,
  requiredMode: null
}
```

No active escalation at v1.2 baseline delivery. Escalation re-evaluated at v1.3 amendment closure.

### §5.5 Judgment deprecations

Per MFv3 §5.5 pattern. Empty at v1.2 delivery — both J-classify + J-label declared as active P7 instances at §7; neither deprecated. No MA-L5 events since v1.0 initial declaration (J-classify + J-label have been active across v1.0 → v1.2 cycle with no shape change).

### §5.6 Frozen-input invariant

Cognitive Standard md5 baseline declared post-confirmation per MF-amendment-1 process learning (substrate-touching cycles canonicalize at post-fix EXIT md5). Initial baseline value captured in §9 v1.2 row at L0 confirmation timestamp.

### §5.7 Failure modes

Per MFv3 §5.7 pattern (enumerated per axiom-gate tier; recovery path declared).

| Failure mode | Detection | Response |
|---|---|---|
| Classify LLM call timeout/error (J-classify failure) | Promise rejection from `classifyAndLabel()` at F-codec/R4 (codec-ai-io); structured AppError with code `CLASSIFY_LLM_FAILURE` | Fall back to primitive=`anchor` + confidence=0.0 (per §7.1 J-classify fallbackOnFailure); log fallback at observability layer with `parse_failure: true` flag; no pipeline halt |
| Label parse failure (J-label failure) | `parseLabelResponse()` returns null at F-codec/R1/codec-label | Fall back to first `CODEC_CONFIG.LABEL_MAX_LENGTH` chars of normalized content (per §7.2 J-label fallbackOnFailure); pipeline continues |
| Living Memory `Present()` / `traverse()` failure | Result.ok = false from F-memory R3 | Pipeline halts; `processMessage` returns Result.ok=false with AppError code `CODEC_GRAPH_READ_FAILURE`; F-chat receives error |
| F-event-system event emission failure (HR-Cog4 path) | Event bus subscribe failure at boot | Boot blocks (mechanical-encode subscribers must register at startup per `registerCodecSubscriptions()`); admin alert per F-event-system ops protocol |
| `decodeWorkOutput` parse failure (v1.3 path) | Per CA7 — `parseFailureFlag = true` with declared `fallbackBasis` | Fall back to `WorkOutputShapeRegistry[mode].expectedFields` defaults; result emitted with parseFailureFlag set; no pipeline halt |
| Gate execution failure (any G-CA*) | Mechanical predicate evaluates false | Audit-trail entry logged; framework-audit surfaces via `AuditRunRecord`; remediation per audit cycle, not in-pipeline |

Recovery escalation path: J-class failures → mechanical fallback per §7. Graph-class failures → caller error response. Gate-class failures → audit trail, remediation in next cycle.

### §5.8 Scale bounds

Per MFv3 §5.7 pattern (bounded by substrate atom cardinality + downstream throughput):

- **Encode invocation rate:** bounded by `CODEC_CONFIG.CLASSIFY_MODEL` provider rate limits (per-userId; F-user-profile owns API key); no Cognitive-internal throttle.
- **Graph read scale:** bounded by Living Memory `Present()` + `traverse()` complexity per LM v2.2 §D parameter shape (LM owns scale discipline; Cognitive consumes by reference).
- **Decode complexity:** O(|nodes| + |edges|) per `classifyGraph()` pass per CA5 purity (no LLM); bounded by `DECODE_MAX_TOKENS` budget at S5 render.
- **Concurrent-pipeline cardinality:** unbounded at Cognitive level; F-multi-instance owns concurrency discipline at `executeRun` invocation.

### §5.9 Atomicity declarations

Per MFv3 §5.7 pattern (per-operation atomicity per substrate §13.4):

- **`encodeLLM()` / `encodeMechanical()`:** atomic at single-LLM-call level (or single MECHANICAL_MAPPINGS lookup); on failure, no graph mutation occurs. F-memory `traverse()` invocation is downstream of encode result and fails atomically per LM v2.2 transaction contract.
- **`processMessage()` (full pipeline):** non-atomic across S1–S6; partial results possible if S4 (decode) or S5 (render) fail after S1 (encode) committed graph mutation. Recovery: pipeline re-invocation is idempotent at encode-resolution layer (re-encoding the same `(content, presentState)` pair under temperature 0 produces same result; bind to existing node via traverse).
- **`decodeWorkOutput()` (v1.3):** atomic per call; pure function over (output, mode, registry); no side effects.

### §5.10 Retirement procedure

Per X9 dimension. Cognitive Standard retirement (state `applied` → `terminated` or `deprecated`) procedure:

1. **Successor declaration:** new Cognitive Standard version (e.g., v2.0) declares `deprecates: 'cognitive-standard-v1-2'` in §1 Identity.
2. **Dependent-framework notification:** amendment-propagation invokes G-U2 propagation completeness against `impactedFrameworkSet` = {Artifact Standard (HR-Cog2 receive-side at HR-Ar1), Multi-Instance Standard (HR-Cog3 CognitiveClassificationPort consumer), F-codec slice implementation, F-chat (post-integration consumer of `processMessage()`)}. Each dependent receives propagation event with new version + amendment scope.
3. **Content preservation:** v1.2 declaration file preserved in repo at `src/core/standards/cognitive-standard.md` with deprecation banner; not deleted. Sister-version files (v2.0, v3.0, etc.) co-exist; resolution via `Consumes` version cite at consumer's §1 Identity.
4. **Registry record:** registry entry `{frameworkRef: 'cognitive-standard-v1-2', state: 'deprecated', deprecationTimestamp: ISO8601, supersededBy: 'cognitive-standard-v2-0'}` written via HR5 path.
5. **L0-unavailability behavior** (per substrate §13.6 inheritance): retirement proceeds asynchronously; if L0 unavailable for confirmation gate, deprecated-state holds at `pending-confirmation` until L0 available. No automatic retirement without L0 confirmation.

`terminated` state reserved for hard-stop scenarios (substrate-tier breakage) — declared but not procedurally elaborated; substrate §14.6 restore procedure governs.

### §5.11 Substrate §13.5/§13.6 inheritance

Per X10 dimension:

- **§13.5 Concurrent-activation registry-lock:** Cognitive participates in registry-lock protocol via HR-Cog2 (AS receive-side at HR-Ar1) and HR-Cog3 (M-I CognitiveClassificationPort) — both serialize at registry-lock per substrate §13.5 when activation events overlap. F-codec slice implementation honors per-userId serialization at `processMessage()` invocation; cross-userId concurrent invocation permitted (per-userId scope per LMA21).
- **§13.6 L0-unavailability response:** Cognitive declarations + amendments require L0 confirmation per §5.3; if L0 unavailable, gate-state holds at `pending-confirmation`; runtime operations (encode/decode/route) continue against last-confirmed standard version (v1.2 at delivery).

---

## §6 Coupling

### §6.1 Adjacency map

| Adjacent framework | Direction | Custody |
|---|---|---|
| Living Memory v2.2 | bidirectional (read via Present + traverse + getUserGraph + getGlobalGraph; write via traverse-with-stamp) | LM owns graph physics; Cognitive consumes graph state and emits write primitives. Cognitive does NOT manage graph node identity, scope-stamping, or layer-transition rules — those are LM's. |
| Artifact Standard v2.2 | downstream (Cognitive emits classification triple; AS receives at HR-Ar1) | Cognitive emits `classificationNodeId + primitive + confidence` at every encode invocation that becomes input to AS `createArtifact` call. Cognitive does NOT emit ArtifactEmission — AS owns emission mechanics. |
| Multi-Instance Standard v2.3 | downstream (Cognitive supplies CognitiveClassificationPort.classifyRunReport) | F-multi-instance/R3 declares `CognitiveClassificationPort` shape; Cognitive's R3 surface (post-Sprint-3 A3) implements `classifyRunReport(args) → {classificationNodeId, primitive, confidence}`. Cognitive does NOT execute multi-instance dispatch — M-I owns runReport classification consumption. |
| F-event-system | downstream (Cognitive emits `codec.route-build` event when `route = 'dispatch-planner'`); upstream (Cognitive subscribes to planner events for mechanical-encode path per MECHANICAL_MAPPINGS) | F-event-system owns event bus mechanics; Cognitive emits + subscribes only. |
| LIV-Standard v1.5.1 | structural-substrate (governs F-codec slice file structure: R0 atoms, R1 pure functions, R2 orchestration, R3 contract, R4 I/O) | LIV-Standard governs code-structure layer; Cognitive Standard governs runtime-semantics layer. No semantic coupling beyond R-layer compliance. |

### §6.2 Handoff rules (HR-Cog1–HR-Cog4)

Per AxR1 + substrate §8.2 P6 + MA-V1.

**HR-Cog1 — Living Memory read/write substrate:**

```
HandoffRulePrimitive {
  id: 'HR-Cog1',
  direction: 'bidirectional',
  endpoints: { local: 'cognitive-standard-v1-2', adjacent: 'living-memory-v2-2' },
  carrierApplicability: 'shared-substrate',  // graph atoms cross slice boundary by reference per A-08
  invariant: 'every traverse() and Present() invocation from Cognitive carries scope per LMA21 (userId stamped at invocation; null userId stamps as "global"); every write primitive (anchor, relate, restructure, reinforce, suppress) emitted by Cognitive resolves to a Living Memory edge with declared primitiveType field',
  captureShape: {
    capturedFields: ['userId', 'scope', 'primitiveType', 'turnId'],
    captureTarget: 'audit-trail',
    queryInterface: 'Living Memory traverse logs'
  },
  diagnosticSignificance: true
}
```

**HR-Cog2 — Artifact Standard receive-side at HR-Ar1:**

```
HandoffRulePrimitive {
  id: 'HR-Cog2',
  direction: 'a-to-b',
  endpoints: { local: 'cognitive-standard-v1-2', adjacent: 'artifact-standard-v2-2' },
  carrierApplicability: 'cross-framework-atom',
  invariant: 'every CodecPipelineResult emission carries classificationNodeId + primitive + confidence as a triple; AS receive-side at HR-Ar1 consumes the triple verbatim into CreateArtifactInput; Cognitive does not transform the triple post-emission',
  captureShape: {
    capturedFields: ['classificationNodeId', 'primitive', 'confidence', 'turnId', 'userId'],
    captureTarget: 'registry',
    queryInterface: 'AS HR-Ar1 receive-side log'
  },
  diagnosticSignificance: true
}
```

**HR-Cog3 — Multi-Instance CognitiveClassificationPort:**

```
HandoffRulePrimitive {
  id: 'HR-Cog3',
  direction: 'a-to-b',
  endpoints: { local: 'cognitive-standard-v1-2', adjacent: 'multi-instance-standard-v2-3' },
  carrierApplicability: 'cross-framework-port',
  invariant: 'F-multi-instance/R3 declares CognitiveClassificationPort with classifyRunReport({runReport, userId, runTurnId}) signature; Cognitive R3 surface (post-Sprint-3 A3) implements function matching this signature returning {classificationNodeId, primitive, confidence}; port shape is fixed contract — Cognitive cannot change return shape without M-I amendment cycle',
  captureShape: {
    capturedFields: ['runReport', 'userId', 'runTurnId', 'classificationNodeId', 'primitive', 'confidence'],
    captureTarget: 'registry',
    queryInterface: 'M-I executeRun logs'
  },
  diagnosticSignificance: true
}
```

**HR-Cog4 — F-event-system mechanical encode + dispatch:**

```
HandoffRulePrimitive {
  id: 'HR-Cog4',
  direction: 'bidirectional',
  endpoints: { local: 'cognitive-standard-v1-2', adjacent: 'F-event-system' },
  carrierApplicability: 'event-bus',
  invariant: 'Cognitive subscribes to planner events {pipeline.started, pipeline.completed, pipeline.failed, stage.completed, stage.failed} per MECHANICAL_MAPPINGS lookup table; emits codec.encode-complete + codec.encode-failed + codec.route-build + codec.route-complete events per declared event vocabulary; subscription registration via registerCodecSubscriptions() at startup',
  captureShape: {
    capturedFields: ['eventType', 'turnId', 'userId', 'primitive', 'route'],
    captureTarget: 'audit-trail',
    queryInterface: 'F-event-system event log'
  },
  diagnosticSignificance: false
}
```

### §6.3 Wire types declared (per LIV-Standard v1.5.1 wire vocabulary)

| Wire kind | Symbol | Cognitive usage |
|---|---|---|
| W-ATOM | typed atom crosses slice boundary | `EncodeResult`, `CodecPipelineResult`, `CognitivePrimitive` enum, `RouteAction` enum, `DecodedContext`, `ClassifyResult`, `BindingDomain`, `DecodeCategory`, `RelationType`, `DecodedStructure`, `DecodeOutput` |
| W-FN | function exported across slice boundary | `processMessage()`, `encode()`, `registerSubscriptions()`, `seedGlobalNode()`, `ingestExternal()`, `removeNode()`, `batchSeedAndTraverse()`, `executeMemoryAction()`, `getDecodedState()`, `unregisterDiscovery()`, `unregisterModule()`, `classifyGraph()` (post-Sprint-3 A3: also `classifyRunReport()` per HR-Cog3) |
| W-INJECT | injection from R3 contract into R2 implementation (intra-slice) | per F-codec/contract/codec-contract.ts wires-in declarations |
| W-HOOK | event-bus subscription | per CODEC_EVENTS subscription registry |

### §6.4 Custody table

Per MFv3 §6.5 pattern: every Cognitive-declared or Cognitive-consumed atom enumerated with Owner / Layer / Consumers.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `CognitivePrimitive` | Cognitive Standard (declared §2.3 + F-codec/R0/codec-types.ts) | L3 | F-codec all R-layers, F-multi-instance (CognitiveClassificationPort), Artifact Standard (CreateArtifactInput.primitive field), F-memory (EdgePrimitiveType subset) |
| `MutatingPrimitive` | Cognitive Standard (declared §2.3) | L3 | F-codec encode + mechanical paths, F-memory (edge primitive_type stamp) |
| `EncodeInput` | Cognitive Standard (declared §2.1) | L3 | F-codec/R3 codec-contract `encode()`, F-chat post-integration |
| `MechanicalEncodeInput` | Cognitive Standard (declared §2.1) | L3 | F-codec subscribers via codec-subscribe `registerCodecSubscriptions()` |
| `PipelineInput` | Cognitive Standard (declared §2.1) | L3 | F-codec/R3 codec-contract `processMessage()`, F-chat post-integration |
| `EncodeResult` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-types.ts) | L3 | F-codec orchestrate (consumed at S2–S6), F-chat post-integration, M-I CognitiveClassificationPort caller |
| `ClassifyResult` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-types.ts) | L3 | F-codec encode (internal cycle output, consumed at S1 → S2 transition); not externally exported |
| `CodecPipelineResult` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-routing-types.ts) | L3 | F-codec/R3 codec-contract (return value of `processMessage()`), F-chat post-integration, AS receive-side at HR-Ar1 (classificationNodeId + primitive + confidence triple per HR-Cog2) |
| `BindingDomain` | Cognitive Standard (declared §2.3 + F-codec/R0/codec-routing-types.ts) | L3 | F-codec routing (S2 → S3 transition); not externally exported |
| `RouteAction` | Cognitive Standard (declared §2.3 + F-codec/R0/codec-routing-types.ts) | L3 | F-codec orchestrate (S3 → S6 transition), F-event-system (codec.route-build event payload), F-planner (downstream of dispatch-planner route) |
| `DecodeCategory` | Cognitive Standard (declared §2.3 + F-codec/R0/codec-decode-types.ts) | L3 | F-codec decode (consumed at S4 classifyGraph), F-codec render (S5 ordering by category) |
| `RelationType` | Cognitive Standard (declared §2.3 + F-codec/R0/codec-decode-types.ts) | L3 | F-codec decode (DecodedStructure relation field), F-codec render |
| `DecodedStructure` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-decode-types.ts) | L3 | F-codec decode (S4 output element), F-codec render (S5 input) |
| `DecodeOutput` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-decode-types.ts) | L3 | F-codec decode (S4 W-ATOM output), F-codec render (S5 input), CodecPipelineResult.decodeOutput field |
| `DecodedContext` | Cognitive Standard (declared §2.2 + F-codec/R0/codec-decode-types.ts) | L3 | F-codec render (S5 W-ATOM output), CodecPipelineResult.decodedContext field, F-chat (system prompt assembly) |
| `WorkOutputDecodeResult` (v1.3) | Cognitive Standard (declared §10.1) | L3 | F-codec decode work-output path (S5 polymorphic), AS receive-side (carries decoded payload), downstream domain frameworks (Verification Std v1.0, Research Std v1.0 — Sprints 4/5) |
| `WorkOutputShapeRegistry` (v1.3) | Cognitive Standard (declared §10.1) | L3 | F-codec decode work-output path; per-mode shape resolution at S5 |
| `MutatingPrimitive` (re-listed for inheritance trace; consumed by F-memory as `EdgePrimitiveType` subset) | Cognitive Standard (writes); F-memory (reads) | L3 | F-memory edge stamp at write time |
| `Mode` (substrate §2 enum) | substrate (consumed by reference) | L1 | Cognitive §10 WorkOutputShapeRegistry per-mode entries; framework-audit X1 dimension |
| `CognitiveClassificationPort` (declared at F-multi-instance/app/mi-execute.ts:118) | Multi-Instance Standard (declared) | L3 | Cognitive R3 surface (post-Sprint-3 A3 implements `classifyRunReport`); F-multi-instance executeRun |
| `NodeId`, `UserId`, `Result`, `AppError`, `Semver` | core/R5 primitives.ts | L0 | all frameworks; consumed by reference |

### §6.5 OperatorInterface

Per MFv3 v3.2.7 §6.8 + framework-audit v1.3.6 §3.4 X6 dimension. Four sub-interfaces declared per X6 requirement (Activation / Review / Confirmation / Discovery). Runtime implementation per A-13 substrate atom: declarations only at v1.2 delivery; F-codec slice implements at runtime per codec-contract.ts surface.

```
operatorInterface = {
  // Activation interface — how L0 (or other operators) trigger Cognitive operations
  activation: {
    invocationEntry: 'F-codec/R3 codec-contract: processMessage(content, userId, projectId?, modelId?) → CodecPipelineResult',
    triggerEvent: 'L0-initiated invocation via test harness OR user-turn invocation via F-chat (post-integration)',
    authorityClaim: 'L0 AuthorityClaim required for direct invocation; user-turn invocation derives authority from F-identity session',
    concurrencyPolicy: 'wait per LMA21 per-userId scope; cross-userId concurrent permitted'
  },

  // Review interface — how operators read Cognitive state
  review: {
    queryByEncode: 'F-codec/R3 codec-contract: getDecodedState(userId) → DecodedContext (post-Sprint-3 build)',
    queryAuditTrail: 'F-codec/R3 codec-contract: getCognitiveAuditTrail({frameworkRef?, eventType?, timeRange?}) → AuditTrailEntry[] (declared §5.3; runtime impl Sprint 3)',
    queryConfig: 'F-codec/R0 codec-types.ts: CODEC_CONFIG export; immutable runtime constant'
  },

  // Confirmation interface — how L0 confirms or escalates
  confirmation: {
    confirmationFormat: 'AuthorityClaim per substrate §5.3: {level: L0, confirmedBy, timestamp}',
    confirmationRecordPath: 'registry HR5 write (per amendment-propagation HR4 capture); written at v1.2 baseline confirmation + at every subsequent amendment confirmation gate per §5.3',
    escalationPath: 'L0 escalation per substrate §5.5; framework-audit raises G-CA* gate failures via AuditRunRecord per framework-audit v1.3.6 §8.3'
  },

  // Discovery interface — how operators query what Cognitive produces/consumes
  discovery: {
    registryQuery: 'registry §4.2 readByFrameworkRef("cognitive-standard-v1-2") returns RegistryEntry with state + confirmedAt + supersededBy?',
    consumesQuery: 'this file §1 Identity Consumes field + §6.1 Adjacency map + §6.4 Custody table; structured per atom',
    producesQuery: 'this file §2.2 Outputs + §6.4 Custody table (atoms with Owner = Cognitive Standard)',
    runtimeStateQuery: 'F-codec/R3 codec-contract: getCognitiveRuntimeState() → {standardVersion, lifecycleState, lastConfirmedAt} (declared §5.1; runtime impl Sprint 3)'
  },

  runtimeState: 'declared'   // per A-13: 'declared' at v1.2 delivery; transitions to 'implemented' on Sprint 3 build close
}
```

---

## §7 Judgment

Per substrate §8.6 empty-declaration rule: this section declares P7 instance count = 2, with positive-declaration of each instance.

### §7.1 J-classify — LLM classification call

```
JudgmentInputPrimitive {
  id: 'J-classify',
  consumedBy: '§3.7 S1 (encode step) — LLM-assisted path',
  shape: Judgment {
    inputs: { content: string, presentState: PresentResult },
    judgmentMechanism: 'LLM call to CODEC_CONFIG.CLASSIFY_MODEL with buildClassifyPrompt(content, presentState) at temperature 0',
    outputShape: ClassifyResult,
    validityClass: 'criteria-bounded — output ClassifyResult.primitive must ∈ COGNITIVE_PRIMITIVES; ClassifyResult.confidence ∈ [0, 1]; ClassifyResult.reasoning is one-line string (length ≤ CODEC_CONFIG.LABEL_MAX_LENGTH * 2 as soft bound)',
    fallbackOnFailure: 'classify failure → primitive = "anchor" (safest fallback per CA4 deterministic-via-fallback discipline); confidence = CODEC_CONFIG.FALLBACK_CONFIDENCE (declared if fallback fires); source = "llm" with parse_failure flag set in observability layer'
  },
  provenanceRecord: {
    instanceId: 'cognitive-lift-cycle-J-classify',
    cycleId: 'sprint-3-entry-cognitive-lift',
    timestamp: '2026-04-28T00:00:00Z',
    consumingFrameworkRef: 'cognitive-standard-v1-2',
    consumingStepId: '§3.7 S1'
  }
}
```

### §7.2 J-label — LLM label extraction call

```
JudgmentInputPrimitive {
  id: 'J-label',
  consumedBy: '§3.7 S1 (encode step) — labeling sub-step within LLM-assisted path',
  shape: Judgment {
    inputs: { content: string, classifyResult: ClassifyResult, presentState: PresentResult },
    judgmentMechanism: 'LLM call (combined with J-classify in single round per CODEC_CONFIG.CLASSIFY_MAX_TOKENS budget at temperature 0; parsed via parseLabelResponse() at F-codec/R1)',
    outputShape: 'string | null (null only for primitive = reference per CA1 cycle-shape)',
    validityClass: 'criteria-bounded — output label length ≤ CODEC_CONFIG.LABEL_MAX_LENGTH; null permitted iff primitive = reference; normalized via normalizeLabel() at F-codec/R1',
    fallbackOnFailure: 'label parse failure → label = first CODEC_CONFIG.LABEL_MAX_LENGTH chars of normalized content (deterministic fallback per CA4)'
  },
  provenanceRecord: {
    instanceId: 'cognitive-lift-cycle-J-label',
    cycleId: 'sprint-3-entry-cognitive-lift',
    timestamp: '2026-04-28T00:00:00Z',
    consumingFrameworkRef: 'cognitive-standard-v1-2',
    consumingStepId: '§3.7 S1'
  }
}
```

### §7.3 Judgment-input cardinality

P7 instance count = 2 (J-classify + J-label). Both consumed at §3.7 S1 within LLM-assisted path. Mechanical-encode path consumes zero judgment inputs (S1 polymorphic kind = `mechanical` for that path — `MECHANICAL_MAPPINGS[eventType]` lookup is constant-deterministic).

Per substrate §8.6: P7 = 2 with positive declaration. Not empty; not "fully mechanical" basis (Cognitive is partially-mechanical: encode mode is judgment-driven, decode is fully mechanical, route is fully mechanical).

---

## §8 Self-audit results

Self-audit run at v1.2 baseline render time (Sprint 3 entry, post-MF-amendment-1).

### §8.1 MA-G13 four-property test

| Property | Result | Evidence |
|---|---|---|
| Own state | Pass | §1 Identity declares `stateTemplate, stateApplied`; §5.1 declares state transitions |
| Own I/O | Pass | §2.1 `EncodeInput` + `MechanicalEncodeInput` + `PipelineInput`; §2.2 `EncodeResult` + `CodecPipelineResult` |
| Own invariants | Pass | §3.6 declares 5 own structural-transformation axioms (CA1–CA5); inherits 68 axis-bound + 1 universal MA-G13 from metaframework v3.2.7 §4.1 (cycle-1 G-S7 + G-V11 + cycle-2 G-V10 + G-S8 + G-L11 enumerated at §4.1) |
| Own discipline | Pass | §3.7 declares 6-step P8 procedure; §4.2 declares own gates G-CA1–G-CA5; §6.2 declares own HRs HR-Cog1–HR-Cog4 |

MA-G13 passes. Cognitive Standard is framework-classified.

### §8.2 PG1–PG7 substrate primitive gates

| Gate | Test | Result |
|---|---|---|
| PG1 | ≥1 P1 instance | Pass (3 declared at §3.3) |
| PG2 | every axis has ≥1 leaf directly or via sub-axes | Pass — Encode (3 leaves via sub-axes), Route (1 leaf via routeDetermination), Decode (1 leaf via graphClassification) |
| PG3 | every axiom attaches to declared axis/sub-axis/leaf | Pass (CA1–CA5 attachment column at §3.6) |
| PG4 | every gate tests ≥1 axiom | Pass (G-CA1–G-CA5 1:1 with CA1–CA5 at §4.2) |
| PG5 | every P8 instance declares kind | Pass (S1 polymorphic `judgment-input \| mechanical`; S2–S6 `mechanical`) |
| PG6 | P8 kind-specific field requirement | Pass — S1 path-A `judgmentInputRef = J-classify`, path-B `derivation` declared; S2–S6 `derivation` declared |
| PG7 | every HR declares direction with FrameworkRef endpoints | Pass (HR-Cog1–HR-Cog4 declare direction + endpoints at §6.2) |

### §8.3 G-G13 sub-element scan

No sub-element of Cognitive Standard has all four MA-G13 properties. Internal sub-elements (axes, sub-axes, axioms, gates, HRs, P8 steps, P7 J-inputs) lack own state and own I/O at sub-element level — they are primitive instances within Cognitive's framework boundary, not nested frameworks. G-G13 passes.

### §8.4 Cross-framework consistency check

| Adjacent framework | Cited version | Citation site | Verified consistent |
|---|---|---|---|
| substrate-v1-1 | v1.6 | §1 header + §3.1 + §3.2 §8.6 ref + §4.4 §11.5 ref | Pass — current canonical post-MF-Cycle-2 (v1.6 cycle-2 cascade introduces A-18 ReferentCitation + A-19 ReferentAlignmentState + A-20 ReferentSnapshot) |
| metaframework-v3-1 | v3.2.7 | §1 header + §3.1 + §4.1 MetaframeworkGateIdSet ref + §4.4 + §5 + §6.5 | Pass — current canonical post-MF-Cycle-2 (cycle-2 axioms MA-V10/MA-S8/MA-L11 + paired gates G-V10/G-S8/G-L11 + `referentCitations` schema-block field) |
| generation-procedure-v1-0 | v1.1.6 | §1 generator provenance | Pass — current canonical post-MF-Cycle-2 |
| framework-audit-v1-2 | v1.3.6 | §1 Dependencies + §6.5 OperatorInterface + §6.5 escalationPath + §3.7 PR5 footnote | Pass — current canonical post-MF-Cycle-2 (G-V10 + G-S8 + G-L11 predicate bodies declared at FA §4.8.X) |
| Living Memory v2.2 | v2.2 | §1 + §6.1 + §6.2 HR-Cog1 + §3.7 S2 §3.7 S4 §3.7 S5 | Pass — frozen + deployed Sprint 2 |
| Artifact Standard v2.2 | v2.2 | §1 + §6.1 + §6.2 HR-Cog2 (cites HR-Ar1 receive-side) | Pass — frozen Sprint 2 |
| Multi-Instance Standard v2.3 | v2.3 | §1 + §6.1 + §6.2 HR-Cog3 | Pass — frozen Sprint 2 |
| LIV-Standard v1.5.1 | v1.5.1 | §1 + §6.1 + §6.3 wire-vocabulary | Pass — frozen |

### §8.5 Findings

**Self-audit at v1.2 baseline reported "No Kind A. No Kind B." — incorrect.** Reconciliation against MFv3 v3.2.5 (cognitive-lift-audit-1) surfaced 5 Kind A + 9 Kind B findings. 11 patch operations applied at v1.2.1 close 14 of them; 3 audit findings rejected against canonical sources (B-01, B-08, X8 — see §9 v1.2.1 row for source-derivation).

**v1.2.2 reconciliation against MFv3 v3.2.7 (cognitive-audit-against-mf-v3-2-7):** surfaced 14 cycle-2 findings (F-cycle-2-01..15, with F-cycle-2-15 surfaced at builder-side execution of op 2 — substrate-tier SG1–SG4 → SG1–SG5 stale prose) plus 1 audit-scope note (F-cycle-2-14). Kind A: 11 (pin sweep + count restatement + cycle-1 + cycle-2 inheritance + GeneratedFrameworkTemplate `referentCitations` field + SG-series count). Kind B: 3 (citation hygiene + free-form path → typed `ReferentCitation` upgrade flag + self-audit grid extension). 7 patch operations close all 14 findings additively per MA-L1 + MA-S7 (recursive scope per MFv3 v3.2.7 §3.2.1). Drift class: citing-framework-owned (Cognitive owns the patch cycle); referent stable.

**Process learning (v1.2 → v1.2.1):** v1.2 self-audit pattern was insufficient — it counted primitive cardinalities but did not check (a) MFv3 §2.2 GeneratedFrameworkTemplate schema-slot completeness at §5 + §6, (b) MFv3 §4.1 inherited axiom-gate count, (c) MFv3 §6.5 per-atom custody table, (d) MFv3 §7.1/§7.2 J-input provenanceRecord shape, (e) substrate §3.5 / MA-St3 universal-variables-per-axis on v1.3-added Symmetry. Stronger self-audit pattern surfaced at audit; folded into post-v1.2.1 self-audit grid going forward.

**Process learning (v1.2.1 → v1.2.2):** the v1.2.1 self-audit pattern was canonical against MFv3 v3.2.5 but did not surface drift introduced by upstream cascades (cycle-1 v3.2.4, cycle-1.5 v3.2.5-substrate, cycle-1.6 v3.2.6, cycle-2 v3.2.7). MFv3 v3.2.7 introduces three further canonical checks the v3.2.5 self-audit pattern could not have reached: (f) `referentCitations` field declared on the GeneratedFrameworkTemplate emission per MFv3 v3.2.7 §2.2; (g) cycle-1 + cycle-2 inheritance enumerated (G-S7 + G-V11 cycle-1; G-V10 + G-S8 + G-L11 cycle-2; with paired axioms MA-S7/MA-V11/MA-V10/MA-S8/MA-L11 declared inherited per substrate §1.3 SI-03); (h) all version pins canonical and uniform across §1 header, §1 Identity table, generator provenance block, §3.7 PR5 footnote, §4.1, §5.1, §5.3, §6.5, §8.4 (G-C10 substrate-version-pin uniformity). v1.2.2 self-audit grid extends with rows (f), (g), (h) plus restated row (b) with cycle-2 axiom-gate counts (axiom 63→68; framework-tier inherited 80→85; per-invocation 85→90). Folded forward at v1.2.2 close.

**v1.2.2 self-audit grid (post-cycle-2 extension):**

| Check | Result | Evidence |
|---|---|---|
| (a) MFv3 §2.2 GeneratedFrameworkTemplate schema-slot completeness | Pass | §1 Identity + §2 Schema + §5 + §6 populate identity / schema / structure / validity / lifecycle / coupling / judgment / provenance slots |
| (b) MFv3 v3.2.7 §4.1 inherited axiom-gate count (cycle-2) | Pass | §1 Own invariants + §4.1 + §8.1 declare 68 axiom + 1 MA-G13; framework-tier inherited 85; per-invocation 90 |
| (c) MFv3 §6.5 per-atom custody table | Pass | §6.4 enumerates 21 atoms with Owner / Layer / Consumers |
| (d) MFv3 §7.1/§7.2 J-input provenanceRecord shape | Pass | §7.1 + §7.2 populate `{instanceId, cycleId, timestamp, consumingFrameworkRef, consumingStepId}` |
| (e) substrate §3.5 / MA-St3 universal-variables per axis | Pass | §3.8 (Encode, Route, Decode at v1.2) + §10.8 (Symmetry at v1.3) cover all 4 axes × 4 variables |
| (f) MFv3 v3.2.7 §2.2 `referentCitations` field declared on emission | Pass | §1 Identity table `referentCitations` row declares `[]` per MA-V11 vacuous-pass; v1.2.3 upgrade flag for typed ReferentCitation promotion of §2.3 + §6.4 free-form F-codec path entries |
| (g) Cycle-1 + cycle-2 inheritance enumerated | Pass | §1 Own invariants + §4.1 axiom-gate row + §8.1 own-invariants row enumerate G-S7, G-V11, G-V10, G-S8, G-L11 with paired MA-S7, MA-V11, MA-V10, MA-S8, MA-L11 per substrate §1.3 SI-03 |
| (h) Version pins canonical (G-C10 substrate-version-pin uniformity) | Pass | §1 header + §1 Identity (Consumes / Authority / Own invariants / referentCitations) + provenance block + §3.7 PR5 footnote + §4.1 + §5 + §5.1 + §5.3 + §6.5 OperatorInterface heading + §6.5 escalationPath + §8.1 + §8.4 — all sites cite substrate v1.6 / MFv3 v3.2.7 / GP v1.1.6 / FA v1.3.6 |

**Post-v1.2.2 self-audit state:**
- Cycle-2 audit findings: 14 of 14 valid findings closed via patch operations 1–7 (op 2 absorbs F-cycle-2-15); 0 rejections.
- F-cycle-2-11 partially addressed at v1.2.2: the `referentCitations` field is declared per MF v3.2.7 §2.2 with empty default; promotion of §2.3 + §6.4 free-form F-codec path entries to typed `ReferentCitation` records scheduled at v1.2.3 cycle once `ReferentResolver` for `referentKind='code'` is registered at framework-audit's R-layer per cycle-2 spec §3.8 parser surface. Resolution disposition: deferred to v1.2.3.
- F-cycle-2-14 is audit-scope clarification (v1.2.2 = v1.2.1 + cycle-2 closures); resolved by this version.
- Carry-forward Kind C from v1.2 baseline (cleanup-class, Sprint 3 builder scope):
  - **Kind C-1:** Code comments in F-codec slice cite informal CA1, CA3, CA4, CA5, CA8 (pre-v1.2 numbering). Sprint 3 builder will sweep these to canonical CA1–CA5 cites with v1.2 reference. Cleanup-class.
  - **Kind C-2:** `CODEC_CONFIG.FALLBACK_CONFIDENCE` referenced in §7.1 J-classify fallbackOnFailure shape but not yet declared in `codec-types.ts`. Sprint 3 builder declares constant at value 0.0 (anchor primitive at fallback resolves to lowest confidence) per CA4 deterministic-via-fallback discipline.
  - **Kind C-3:** F-codec SLICE.md cites `CA1–CA8` framing; Sprint 3 builder updates to cite `CA1–CA7` (post-v1.3) with explicit v1.2/v1.3 amendment-block reference.
  - **Kind C-4 (v1.2.2 add):** §2.3 atom-inventory + §6.4 custody-table free-form path strings (`F-codec/R0/codec-types.ts`, etc.) promoted to typed `ReferentCitation` records at v1.2.3 once `ReferentResolver` for `referentKind='code'` registers at framework-audit R-layer. v1.2.2 leaves field empty (vacuous-pass per MA-V11). Cleanup-class.

**G-V10 first-run staging:** per cycle-2 spec §11.1 / §13.5 + canonical bundle MANIFEST scheduled-events row, G-V10 first-run target is Cognitive Standard v1.2.2 (this version). At v1.2.2 the `referentCitations` field is empty; G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.2.2; promotion scheduled at v1.2.3' per MA-V11 vacuous-pass clause. The first-run event itself (audit-run record stamping per MA-L11) executes when framework-audit is invoked against v1.2.2 post-L0 ratification.

---

## §9 Change log

| Version | Cycle / Date | Substantive changes | Authority |
|---|---|---|---|
| v1.0 | Phase 5 (pre-2026) | Initial F-codec slice ship: 6 primitives, encode/decode/route pipeline, mechanical mappings. No canonical standard file authored at this version — implementation cited "Cognitive Standard v1.0" in code comments as informal reference. | L0 |
| v1.1 | Phase 5+ amendments | Distributed amendments to F-codec slice: discovery module landing, codec-orchestrate processMessage entry point, artifact emission integration with AS, scope-stamping per LMA21 integration. No canonical standard file at this version. | L0 |
| v1.2 | Sprint 3 entry — Cognitive lift cycle (2026-04-28) | **First canonical authoring.** Lift distributed F-codec slice declaration into single-file MFv3 v3.2.5 conformant render at `src/core/standards/cognitive-standard.md`. Renumber informal CA1, CA3, CA4, CA5, CA8 (code-comment cites) to canonical CA1–CA5 (axioms + paired leaves both renumbered). Declare 3 P1 axes (Encode, Route, Decode), 8 sub-axes, 5 leaves, 5 axioms, 5 gates, 4 HRs, 2 P7 judgment inputs (J-classify + J-label), 6-step P8 procedure. No semantic change to F-codec implementation; pure lift. | L0 pending |
| v1.2.1 | Cognitive lift cycle — audit remediation patch (2026-04-28) | **MFv3 v3.2.5 conformance patch sweep.** 11 patch operations remediating cognitive-lift-audit-1 findings (audit report at `src/core/governance/cognitive-lift-cycle/cognitive-lift-audit-1-report.md`): (1) inherited axiom-gate count corrected 35 → 63 at §1, §4.1 (cascade B-02/B-05); (2) F-69 inheritance completed G-U4 → {G-U1, G-U2, G-U3, G-U4, G-U5} at §4.1 + §4.3 + §4.4 (A-02); (3) §4.1 totals recomputed: 80 inherited + 5 own = 85 framework-tier per invocation (A-03); (4) §3.3 axis-ownership prose canonicalized to CA2/CA3/CA4/CA5 (B-03); (5) §3.4 + §3.5 leaf IDs renumbered to leaf-CA1..leaf-CA5 (B-04); (6) §5 Lifecycle expanded with 7 new sub-sections covering all 8 MFv3 §2.2 lifecycle slots + retirement procedure (X9) + substrate §13.5/§13.6 inheritance (X10) (A-04); (7) §6.4 per-atom custody table added (B-06); (8) §6.5 OperatorInterface block added with 4 sub-interfaces (Activation/Review/Confirmation/Discovery) per framework-audit X6 (A-05); (9) §7.1 + §7.2 J-input provenanceRecord blocks added per MFv3 §7.1 pattern (B-07); (10) §10.8 §3.8 universal-variables Symmetry row added (A-01); (11) §10.9 + §10.10 vocabulary extension + restated v1.3 self-audit (B-09 cascade + audit-trail format X3 + composed cleanup). All operations additive per MA-L1 (no axiom / axis / leaf / gate modified — count-corrections, structured-field additions, leaf-ID renumber, prose renumber). 3 audit findings rejected against canonical sources: B-01 (Genesis field shape — substrate v1.3 §4 A-14 declares `{bootstrapped, genesisEvent}` matching Cognitive's declaration); B-08 (amendmentLog at top-level provenance — MFv3 §2.2 provenance schema does not include amendmentLog; lives in PropagationTrace per MFv3 §4.3 G-U5 second predicate); X8 (cascades from B-01). Audit reconciliation logged at audit report disposition. | L0 pending |
| v1.2.2 | MF-Cycle-2 cascade (2026-04-30) | **MFv3 v3.2.7 conformance patch sweep — closes F-cycle-2-01..15 (F-cycle-2-15 surfaced at builder-side execution of op 2: substrate-tier SG1–SG4 → SG1–SG5 stale prose, cycle-1.5 cascade gap absorbed within cycle-2 patch turn).** 7 patch operations remediating cognitive-audit-against-mf-v3-2-7 findings: (1) **pin sweep** substrate v1.3→v1.6, MFv3 v3.2.5→v3.2.7, GP v1.1.4→v1.1.6, FA v1.4→v1.3.6 — applied at §1 header `Consumes`/`Dependencies` + §1 Identity table (Version, Consumes, Authority rows) + generator provenance block + §3.7 PR5 footnote + §4.1 prose + §5 Lifecycle preamble + §5.1 trajectory + §5.3 confirmation gate criterion + §6.5 OperatorInterface heading + §6.5 escalationPath + §8.4 cross-framework consistency table (closes F-cycle-2-01, F-cycle-2-02, F-cycle-2-03, F-cycle-2-04); (2) **count restatement sweep** axiom 63→68, framework-tier inherited 80→85, per-invocation 85→90, substrate-tier SG1–SG4→SG1–SG5 — applied at §1 Identity Own invariants + §4.1 axiom-gate row + §4.1 inherited total + §4.1 per-invocation row + §4.4 gate execution order + §8.1 Own invariants self-audit row (closes F-cycle-2-05, F-cycle-2-06, F-cycle-2-15); (3) **cycle-1 + cycle-2 inheritance enumeration extension** added G-S7, G-V11, G-V10, G-S8, G-L11 + paired axioms MA-S7, MA-V11, MA-V10, MA-S8, MA-L11 — applied at §1 Identity Own invariants + §4.1 axiom-gate row + §5.3 confirmation gate criterion + §8.1 self-audit row (closes F-cycle-2-07, F-cycle-2-08, F-cycle-2-09); (4) **`referentCitations` field declared** per MFv3 v3.2.7 §2.2 GeneratedFrameworkTemplate `schema:` block at §1 Identity table — empty array default per MA-V11 vacuous-pass + v1.2.3 upgrade flag for typed `ReferentCitation` promotion of §2.3 + §6.4 free-form F-codec path entries once ReferentResolver for `referentKind='code'` registers at framework-audit R-layer (closes F-cycle-2-10; partially addresses F-cycle-2-11, full resolution scheduled v1.2.3); (5) **stale citation fix** generator provenance line `A-20` → `R-phase-1-1-resolution-20` (A-20 at substrate v1.6 binds to ReferentSnapshot — semantically unrelated to provenance reference-default; canonical cite per MFv3 v3.2.7 §2.2 + spec §3.3 + substrate §16) (closes F-cycle-2-12); (6) **§8 self-audit grid extension** added rows (f) `referentCitations` field declared, (g) cycle-1 + cycle-2 inheritance enumerated, (h) version pins canonical (G-C10 substrate-version-pin uniformity); v1.2.1 process-learning preserved + v1.2.2 process-learning row added (closes F-cycle-2-13); (7) **§9 change-log v1.2.2 row** (this row). All operations additive per MA-L1 + MA-S7 (recursive scope per MFv3 v3.2.7 §3.2.1) — no axiom / axis / leaf / gate / HR / P7 / P8 modified; counts that change are restatements of inherited (upstream) values; F-cycle-2-15 closes a cycle-1.5 cascade gap pre-existing in v1.2.1 prose, absorbed within the cycle-2 patch turn since SG-series is one of the inherited counts being restated. Drift class: citing-framework-owned (Cognitive owns the patch cycle); referent (canonical v3.2.7 bundle) stable. F-cycle-2-14 (audit-scope note: v1.2.2 = v1.2.1 + cycle-2 closures) resolved by this version per cycle-2 spec §11.1 / §13.5 + canonical bundle MANIFEST scheduled-events row (G-V10 first-run target). G-V10 first-run on v1.2.2: `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.2.2; promotion scheduled at v1.2.3' per MA-V11 vacuous-pass clause. | L0 pending |
| v1.3 | Sprint 3 — A7 + 8.9 amendment (per Brief v16.1 §8 Sprint 3 scope) | **Additive amendment per MA-L1.** Adds 4th P1 axis (Symmetry); adds 2 axioms (CA6 decode-work-output + CA7 output-typing-symmetry); adds 2 sub-axes (Symmetry/inputOutputPairing + Symmetry/parseFailureSemantics); adds 2 gates (G-CA6 + G-CA7); adds 2 leaves (leaf-CA6 + leaf-CA7); adds new W-ATOM `WorkOutputDecodeResult` and per-mode shape registry; extends P8 procedure S5 with polymorphic-input clause for work-output shapes; extends §3.8 universal-variables table with Symmetry row (§10.8); extends §3.9 vocabulary with v1.3 terms (§10.9). No existing axiom modified, no existing axis modified, no count decreased. See §10. | L0 pending |

---

## §10 Amendment block — v1.3 (additive per MA-L1)

**Cycle:** Sprint 3 (Cold-start + boundary symmetry + beta-gate items). Bundles A7 (decode work-output) + 8.9 (symmetric output typing).

**Scope-positive:**
- Add 4th P1 Axis: `Symmetry` (declares pairing invariant between A-direction encode and B-direction decode).
- Add 2 sub-axes under Symmetry: `inputOutputPairing` + `parseFailureSemantics`.
- Add 2 axioms: CA6 (decode-work-output covers all module modes) + CA7 (output-typing-symmetry across encode/decode pairs).
- Add 2 leaves: leaf-CA6, leaf-CA7.
- Add 2 gates: G-CA6, G-CA7.
- Add 1 new W-ATOM: `WorkOutputDecodeResult` (with per-mode shape registry).
- Extend §3.7 S5 render step to handle work-output shapes (additive sub-clause; existing graph-context render path unchanged).
- Extend §3.8 universal-variables table with Symmetry row (per substrate §3.5 + MA-St3; declared at §10.8).
- Extend §3.9 vocabulary with v1.3 terms (declared at §10.9).

**Scope-negative (out-of-scope under MA-L1):**
- No modification of CA1–CA5.
- No modification of existing P1 axes (Encode, Route, Decode boundaries unchanged).
- No modification of existing sub-axes.
- No modification of existing P8 procedure step count (remains 6 — work-output decode handled within S5 polymorphic-input clause).
- No modification of existing HRs (HR-Cog2 with AS already carries work-output via CodecPipelineResult.decodeOutput.artifacts; v1.3 makes this typing explicit and symmetric, not new).

### §10.1 New atoms

**`WorkOutputDecodeResult`** — output of decode-work-output sub-step:

```
WorkOutputDecodeResult = {
  mode:             FrameworkMode,              // 'epistemic' | 'structural' | 'generative' | 'verificative'
  moduleId:         string,                     // source module identifier
  decodedFields:    Record<string, string>,     // structured key→value extraction per mode-specific shape registry
  symmetricToInput: { inputAtomRef: string, pairValid: boolean },   // pairing invariant: every output shape pairs with an input shape
  parseFailureFlag: boolean,                    // true iff parse fell back to default per CA4-extended fallback
  fallbackBasis:    string | null               // declared basis if parseFailureFlag = true; null otherwise
}
```

**Per-mode shape registry** (consumed by S5 work-output decode path):

```
WorkOutputShapeRegistry = {
  epistemic: {
    expectedFields: ['question', 'decomposition', 'findings', 'openQuestions', 'sources'],
    pairingInputAtom: 'EpistemicQueryInput'
  },
  structural: {
    expectedFields: ['decomposition', 'mapping', 'invariants', 'gaps'],
    pairingInputAtom: 'StructuralQueryInput'
  },
  generative: {
    expectedFields: ['plan', 'steps', 'dependencies', 'artifacts'],
    pairingInputAtom: 'GenerativeQueryInput'
  },
  verificative: {
    expectedFields: ['claim', 'evidence', 'gates', 'verdict'],
    pairingInputAtom: 'VerificativeQueryInput'
  }
}
```

Per-mode `expectedFields` carry declared shape; module instances consume by reference per A-08. Pairing input atoms (`EpistemicQueryInput`, `StructuralQueryInput`, etc.) are forward-declared placeholders; concrete declarations land at downstream domain-standard amendment cycles (Verification Standard v1.0 at Sprint 4, Research Standard v1.0 at Sprint 5; Plan v2.2 + M-I v2.3 already declare their input atoms — `PlanInput`, `RunReportContent` — and v1.3 maps these to `pairingInputAtom: 'GenerativeQueryInput'` and `pairingInputAtom: 'VerificativeQueryInput'` respectively as derived adjacency).

### §10.2 New axis (P1)

| id | Axis | Concern |
|---|---|---|
| `Symmetry` | Symmetry | A-direction ↔ B-direction pairing invariants. Every typed input atom has a typed output atom; every encode mode has a paired decode mode; parse failures on the B-direction declare fallback semantics symmetric to encode CA4 fallback discipline. |

MECE verification (post-v1.3): Encode (A-direction concern), Route (decision concern), Decode (B-direction concern), Symmetry (pairing-invariant concern). No pair-overlap; Symmetry's concern is the *invariant across the pair*, structurally distinct from each individual direction.

### §10.3 New sub-axes

| id | Sub-axis | Leaf set |
|---|---|---|
| `Symmetry/inputOutputPairing` | Every input atom declared by Cognitive (or any consuming framework's input atom routed through Cognitive) has a paired output atom, and the pairing is registered in `WorkOutputShapeRegistry` | `leaf-CA6` |
| `Symmetry/parseFailureSemantics` | Parse failures on B-direction (decode-work-output) declare fallback semantics symmetric to encode CA4 fallback (fallback value declared, not undefined; deterministic given fallback trigger) | `leaf-CA7` |

### §10.4 New axioms (CA6 + CA7)

| Axiom | Attached to | Mechanical condition | Ground class |
|---|---|---|---|
| **CA6** | `Symmetry/inputOutputPairing` / `leaf-CA6` | For every module execution work-output: `decodeWorkOutput(output, mode) → WorkOutputDecodeResult` such that `result.mode = mode` AND `result.decodedFields` keys ⊇ `WorkOutputShapeRegistry[mode].expectedFields` (every expected field is decoded; superset permits mode-extension in downstream amendments) AND `result.symmetricToInput.inputAtomRef = WorkOutputShapeRegistry[mode].pairingInputAtom`. Coverage: every mode in `FrameworkMode` enum has a registry entry; no mode unhandled. | structural property + reference resolution (registry lookup) |
| **CA7** | `Symmetry/parseFailureSemantics` / `leaf-CA7` | For every `WorkOutputDecodeResult` instance: if `parseFailureFlag = true`, then `fallbackBasis !== null` AND `fallbackBasis` is a declared string (length ≥ 1) describing the fallback path taken (e.g., `'mode-specific empty default applied'`, `'partial-parse with missing fields filled by registry default'`); if `parseFailureFlag = false`, then `fallbackBasis === null`. Symmetric to CA4 encode fallback (anchor on classify failure / normalized-content-slice on label failure): every fallback declares its basis; undefined fallback prohibited. | structural property (predicate on flag-and-basis pairing) |

**AxR1 self-check (v1.3):** CA6 binds to Symmetry/inputOutputPairing/leaf-CA6; CA7 binds to Symmetry/parseFailureSemantics/leaf-CA7. Pass.
**AxR2 self-check (v1.3):** Each condition is one mechanical predicate stated directly. Pass.
**AxR3 self-check (v1.3):** Additive only — CA1–CA5 unchanged; CA6 + CA7 new instances. Pass.
**AxR4 self-check (v1.3):** Declarative, no imperative mood. Pass.

### §10.5 New leaves

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-CA6` | `axiom` | `WorkOutputCoverage: every mode ∈ FrameworkMode has a WorkOutputShapeRegistry entry with declared expectedFields + pairingInputAtom; decodeWorkOutput produces WorkOutputDecodeResult with decodedFields covering registry expectedFields` |
| `leaf-CA7` | `axiom` | `ParseFailureSymmetry: WorkOutputDecodeResult.parseFailureFlag is paired 1:1 with WorkOutputDecodeResult.fallbackBasis (true iff non-null basis declared; false iff null); symmetric to CA4 encode fallback discipline` |

### §10.6 New gates

| Gate | Tests | Mechanical predicate |
|---|---|---|
| **G-CA6** | CA6 | `decodeWorkOutput` exported from F-codec/R3 surface (post-Sprint-3 build); for every `mode ∈ FrameworkMode` enum: `WorkOutputShapeRegistry[mode]` resolves to a declared object with `expectedFields: string[]` (length ≥ 1) AND `pairingInputAtom: string` (length ≥ 1). For every produced `WorkOutputDecodeResult`: keys of `decodedFields` ⊇ registry's `expectedFields` for declared `result.mode`. |
| **G-CA7** | CA7 | For every produced `WorkOutputDecodeResult`: `(parseFailureFlag === true ∧ fallbackBasis !== null ∧ typeof fallbackBasis === 'string' ∧ fallbackBasis.length ≥ 1) ∨ (parseFailureFlag === false ∧ fallbackBasis === null)`. Predicate logic: XOR over flag-basis pairing. |

### §10.7 P8 procedure extension

§3.7 S5 (render step) extended at v1.3 with polymorphic-input clause:

- **S5 input variants:**
  - `(DecodeOutput, DECODE_MAX_TOKENS)` → existing graph-context render path → `DecodedContext` (v1.2 baseline; unchanged).
  - `(WorkOutput, mode, registry)` → new work-output decode path → `WorkOutputDecodeResult` (v1.3 additive).

S5 stage remains 2; kind remains `mechanical`. Polymorphic input is the only change; output type is dispatch-discriminated by input variant. PR4 + PR5 still pass under v1.3 because stage-content-kind alignment is variant-by-variant deterministic (each variant's mapping declared).

### §10.8 §3.8 universal-variables extension (Symmetry row)

Per substrate §3.5 + MA-St3 (every axis expresses all four universal variables). v1.3 adds Symmetry as 4th P1 axis; this section extends §3.8 universal-variables table with the Symmetry row. Per MA-L1 additive: §3.8 v1.2 rows (Encode, Route, Decode) preserved unchanged; this row adds at v1.3.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Symmetry` (v1.3) | `Semver` (bound to `WorkOutputShapeRegistry` version; per-mode entries are version-stamped at registry update; symmetry invariant is evaluated at decode-time against current registry version) | `FrameworkMode` enum `'epistemic' \| 'structural' \| 'generative' \| 'verificative'` (every mode has a registry entry per CA6) | `WorkOutputDecodeResult.symmetricToInput.inputAtomRef: string` paired with `WorkOutputShapeRegistry[mode].pairingInputAtom: string` (typed-string-pair: pairing valid IFF both fields resolve to declared atom IDs and refer to the same atom; per-mode pairing established at registry declaration) | `SymmetryPositional` enum `'unpaired' \| 'paired-valid' \| 'paired-failure'` (declared §10.10 vocabulary extension below) |

**Symmetry MECE re-verification (post-v1.3, full 4-axis check):**

- Orthogonality (4-axis pairwise): Encode×Route (no overlap — A-direction vs decision); Encode×Decode (no overlap — A-direction vs B-direction); Encode×Symmetry (no overlap — Encode is one direction, Symmetry is the *invariant across* both directions); Route×Decode (no overlap — decision vs B-direction); Route×Symmetry (no overlap — routing is in-pipeline, symmetry is cross-direction invariant); Decode×Symmetry (no overlap — Decode produces output, Symmetry verifies pairing). All 6 pairs orthogonal. Pass.
- Exhaustiveness: every Cognitive concern traces to exactly one of {Encode, Route, Decode, Symmetry}. Pairing-invariant concern owned by Symmetry (no other axis covers it). Pass.

### §10.9 §3.9 vocabulary extension (v1.3)

Per MA-L1 additive. Adds vocabulary terms surfaced by v1.3 amendment.

| Term | Declared | Definition |
|---|---|---|
| `WorkOutputDecodeResult` | §10.1 | typed shape per §10.1 block (mode, moduleId, decodedFields, symmetricToInput, parseFailureFlag, fallbackBasis) |
| `WorkOutputShapeRegistry` | §10.1 | `Record<FrameworkMode, {expectedFields: string[], pairingInputAtom: string}>` |
| `FrameworkMode` | substrate §2 enum (consumed by reference) | enum `'epistemic' \| 'structural' \| 'generative' \| 'verificative'` |
| `SymmetryPositional` | §10.8 (this) | enum `'unpaired' \| 'paired-valid' \| 'paired-failure'` |
| `EpistemicQueryInput`, `StructuralQueryInput`, `GenerativeQueryInput`, `VerificativeQueryInput` | forward-declared placeholders (§10.1) | concrete shape declarations land at downstream domain-standard amendment cycles (Verification Std v1.0 Sprint 4 + Research Std v1.0 Sprint 5; Plan v2.2 + M-I v2.3 already-declared input atoms map to GenerativeQueryInput + VerificativeQueryInput as derived adjacency) |

### §10.10 v1.3 self-audit

| Property | Result |
|---|---|
| MA-L1 additive-only | Pass — no existing axiom/axis/sub-axis/leaf/gate/HR/P7/P8 modified; only additions (1 axis, 2 sub-axes, 2 axioms, 2 leaves, 2 gates, 1 atom, 1 registry, 1 polymorphic-input clause on existing S5, 1 universal-variables row, 1 vocabulary extension) |
| Count restatement (v1.2 → v1.3) | P1: 3 → 4; P2: 8 → 10; P3: 5 → 7; P4: 5 → 7; P5: 5 → 7; P6: 4 → 4 (unchanged); P7: 2 → 2 (unchanged); P8: 6 → 6 (unchanged; S5 polymorphic-input within existing step) |
| Cross-framework adjacency consistency | Pass — pairing input atoms forward-declared with declared resolution path (downstream domain-standard amendment cycles); no broken adjacency at v1.3 land |
| MA-G13 four-property test (v1.3 state) | Pass — own state, own I/O, own invariants (now 7 axioms own + 68 axis-bound + 1 universal MA-G13 inherited per MFv3 v3.2.7 §4.1; cycle-1 G-S7/MA-S7 + G-V11/MA-V11 + cycle-2 G-V10/MA-V10 + G-S8/MA-S8 + G-L11/MA-L11 absorbed at v1.2.2 — see §1 + §4.1 + §8.5), own discipline all preserved/extended |
| MA-St3 four-variable expression per axis (post-v1.3) | Pass — §3.8 covers Encode/Route/Decode at v1.2; §10.8 covers Symmetry at v1.3; all 4 axes have full Temporal/Categorical/Relational/Positional row |
| Vocabulary completeness | Pass — every v1.3 atom declared in §10.9; cross-references resolve to §10.1 / substrate §2 / forward-declared placeholders |

---

## §11 Closure declaration

This file is the canonical declaration of Cognitive Standard at v1.2.2 (MF-Cycle-2 cascade — pin sweep + cycle-1 + cycle-2 inheritance absorption) + v1.3 amendment block. F-codec slice implementation conforms to this declaration; conflicts resolve in favor of this file per substrate §10 standard-as-source-of-truth rule. Cleanup of pre-v1.2 informal axiom citations (CA1, CA3, CA4, CA5, CA8 in code comments) sweeps to canonical CA1–CA5 cites in Sprint 3 builder pass.

L0 confirmation gate: ratification of this v1.2.2 baseline + v1.3 amendment block locks Cognitive Standard at the post-confirmation md5 baseline for downstream cycles. Sprint 3 spec drafts against frozen v1.3 (semantic content unchanged from v1.2.1; v1.2.2 is purely the cycle-1 + cycle-2 cascade absorption, additive per MA-L1 + MA-S7 recursive).

Audit reconciliation:
- cognitive-lift-audit-1 (v1.2 → v1.2.1) report archived at `src/core/governance/cognitive-lift-cycle/cognitive-lift-audit-1-report.md`. 14 valid findings closed via patch operations 1–11. 3 audit findings rejected with source-derivation logged at §9 v1.2.1 row.
- cognitive-audit-against-mf-v3-2-7 (v1.2.1 → v1.2.2) report archived at `src/core/governance/cognitive-audit-against-mf-v3-2-7.md`. 14 cycle-2 findings (F-cycle-2-01..15; F-cycle-2-15 surfaced builder-side at op 2 execution) closed via patch operations 1–7. 1 audit-scope note (F-cycle-2-14) resolved by version increment per cycle-2 spec §11.1 / §13.5 G-V10 first-run target. 0 rejections. F-cycle-2-11 partially addressed; full resolution via typed `ReferentCitation` promotion scheduled at v1.2.3 once `ReferentResolver` for `referentKind='code'` registers at framework-audit R-layer per cycle-2 spec §3.8 parser surface.

G-V10 first-run on v1.2.2: `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.2.2; promotion scheduled at v1.2.3' per substrate §10.1 S4 + MA-V11 vacuous-pass clause. Audit-run record stamped per MA-L11 with `referentSnapshotRef = null` permitted (zero-citation framework).

End of file.
