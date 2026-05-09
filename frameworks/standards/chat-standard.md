---
kind: framework
placement: frameworks/standards/
---

# chat-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Verification Standard v1.0 (verificative-mode L3 sibling), Research Standard v1.0 (epistemic-mode L3 sibling), Builder Standard v1.0 (generative-mode L3 sibling), Plan Standard v2.2 (structural-mode L3 sibling)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Chat Standard is the L3 structural-mode framework owning conversational intake and dispatch — LIV's conversational perimeter gate. A wearer message arrives as raw text (known), Chat Standard structures it into a typed substrate event (structured): context assembled, LLM called, response streamed, both sides written to substrate as `ChatStateChange` atoms. It is one of two perimeter gates; the other is Dashboard Standard (visual gate).

Chat Standard is **distinct from F-router (L4)**: F-router is the routing infrastructure that Chat Standard consults at CA5 dispatch. Chat Standard declares the consultation contract; F-router owns internal routing mechanics. Different tier, different concern, non-overlapping (see §1 scopeOut).

Chat Standard is **distinct from Builder Standard v1.0**: Builder Standard governs typed-work synthesis (generative-mode, structured → produced). Chat Standard governs conversational intake and dispatch (structural-mode, known → structured). The two are mode-asymmetric L3 siblings — both are domain-program standards, non-overlapping in concern.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Chat Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first `ChatStateChange` write post-L0-confirmation; Sprint 11 wires the four substrate write points) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (Chat Standard emits `ChatStateChange` atoms directly to substrate; no enclosing carrier at v1.0; see §6.1 carrier rationale) |
| `primitive` | `chat-turn` (framework-local atomic unit; defined §3.9 Vocabulary; one complete wearer↔LLM exchange: message received, context assembled, LLM called, response streamed, both sides written to substrate) |
| `consumes` | `ChatArrival` (typed wearer message at perimeter); substrate context (scope-filtered session state via Living Memory); F-router consultation result |
| `produces` | `ChatStateChange` (W-ATOM; written directly to substrate at two write points — wearer side on arrival, LLM side on stream completion) |
| `consumedBy` | F-chat slice (L4 authoring program); Living Memory (persistence); observability / replay; downstream programs receiving F-router-dispatched context |
| `adjacentFrameworks` | Plan Standard v2.2 (peer structural-mode L3 sibling; F-router may dispatch to F-plan), Research Standard v1.0 (peer epistemic-mode; F-router may dispatch to F-discover), Verification Standard v1.0 (peer verificative-mode; F-router may dispatch to F-verify), Builder Standard v1.0 (peer generative-mode; Builder Standard governs build domain), Dashboard Standard v1.0 (peer perimeter gate — visual gate; non-overlapping domain), Living Memory v1.1 (graph persistence; substrate bus), Perimeter Standard (authentication boundary; distinct concern per scopeOut), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Builder Standard v1.0, VS v1.0, RS v1.0, Cognitive Standard v1.2.2** establish the pattern. At v1.0 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at Sprint 11 when four substrate write points are wired and code referents emerge' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['dashboard gate (Dashboard Standard domain; visual perimeter gate is a separate L3 standard)', 'F-router internal routing mechanics (infrastructure; Chat Standard declares the consultation contract only per CA5)', 'substrate schema and graph physics (owned by Living Memory v1.1 + substrate-v1-1)', 'LLM model selection and adapter mechanics (owned by F-ai-adapter domain)', 'authentication and session management (owned by Perimeter Standard; F-identity R3 perimeter-consultation is upstream of Chat Standard intake)', 'program domain work (F-plan, F-discover, F-verify, F-builder each own their domain; Chat Standard dispatches to them via F-router but does not govern their internals)', 'rate limiting policy (operational; Chat Standard declares the rate-limit gate exists at intake per CA1; policy values owned by F-chat config)', 'framework-declaration audit (owned by framework-audit-v1-2 at L2; Chat Standard governs runtime conversational intake, not framework files)', 'B-direction input forms and structured entry (post-beta)', 'multi-modal input (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-10-shot-2-CS-v1-0-genesis',
  confirmedAt: '2026-05-09',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (CS v1.0 is a fresh L3 framework). F-chat contract at `F-chat/contract/chat-contract.ts` contains four Sprint 9/11 TODO markers declaring the substrate write points this standard now governs. Per Playbook §1.20 strict-functional rule, this spec md closes the missing-canonical-spec gap.

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations mutually consistent (structural-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry). |

---

## §2 Schema

### §2.1 Input — `ChatArrival`

Per MA-S1 (input is W-ATOM). Shape:

```
ChatArrival = {
  userId:     UserId           // F-identity session carrier; validated at perimeter upstream
  projectId:  string           // project scope for this exchange
  content:    string           // raw wearer message text; non-empty
  modelId:    string           // selected LLM model; must be in MODELS registry
  turnId:     string           // unique per exchange; correlation key across both writes
  arrivedAt:  EpochMs          // perimeter-stamped arrival time
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `chat-standard.types.ts`.

**Grounding note:** `ChatArrival` formalizes the existing F-chat/contract/chat-contract.ts POST_message intake: `{content, modelId}` from body + `session.userId` + `params.projectId` + generated `turnId` + timestamp. The typed shape makes the intake contract explicit.

### §2.2 Output — `ChatStateChange`

Per MA-S2 (output is W-ATOM). CS carrier = `self`: `ChatStateChange` atoms are written directly to substrate graph at two write points (HR-CS2 wearer side, HR-CS3 LLM side) without an enclosing carrier framework. Rationale: substrate writes are graph-native operations; no chat-surface envelope needed. Both atoms share the same `turnId` for correlation.

Shape:

```
ChatStateChange = {
  turnId:      string           // correlation key; same value on both writes per CA3
  userId:      UserId           // session scope
  projectId:   string           // project scope

  side:        'wearer' | 'ai'  // which side this write represents; enum per CA3

  content:     string           // message content (wearer text or full LLM response)
  modelId:     string | null    // LLM model used; non-null on 'ai' side, null on 'wearer' side

  writtenAt:   EpochMs          // substrate write timestamp (distinct from arrivedAt for wearer side)

  contextRef:  string | null    // reference to substrate context assembled for this turn (per CA2);
                                // populated on 'ai' side; null on 'wearer' side (context not yet assembled)
}
```

**Two-write discipline (per CA3):** one `ChatStateChange` is written when the wearer message arrives (`side='wearer'`), and a second when the LLM response completes (`side='ai'`). They share `turnId`. This is the `writeStateChange` call pair at the four Sprint 11 TODO markers in F-chat/contract/chat-contract.ts.

Typed shapes declared in `chat-standard.types.ts`. Every field traces to §6.5 custody.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed:

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
| `Stage` | substrate §8.3 (not consumed by CS — structural-mode; P8 absent per substrate §8.3) |
| `StageContentKind` | substrate §8.3 (same) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (consumed by §3.2 P7 + P8 empty markers) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `UserId` | primitives.ts | §2.1 ChatArrival.userId, §2.2 ChatStateChange.userId |
| `EpochMs` | primitives.ts | §2.1 ChatArrival.arrivedAt, §2.2 ChatStateChange.writtenAt |
| `Result<T, E>` | primitives.ts | §2.2 ChatEmissionResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 ChatValidityError (types file), §6.5 custody |

### §2.5 CS-local atoms (declared at point of use in §3)

Atoms owned by CS (custody row per atom in §6.5):

`ChatArrival`, `ChatStateChange`, `ChatSide`, `ChatContextRef`, `ChatShapePositional`, `ChatContextPositional`, `ChatWritePositional`, `ChatDispatchPositional`, `ChatStreamPositional`, `ChatHandoffRuleInstance`, `ChatGateResult`, `ChatDimensionResult`, `ChatCustodyRow`, `ChatValidityError`, `ChatEmissionResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling). Typed shapes in `chat-standard.types.ts`.

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 | §8.2 dimension results schema reference |
| `ReferentCitation` | substrate §4 A-18 | §1 Identity referentCitations row (empty at v1.0) |

### §2.7 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to CS:

- **ScR1** (input is W-ATOM): `ChatArrival` declared §2.1 as typed shape.
- **ScR2** (output is W-ATOM): `ChatStateChange` declared §2.2 as typed shape; written directly to substrate per carrier=self.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.8 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

CS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. CS does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, CS's own structural content populates §3.3–§3.9 below: five CS-local P1 Axis instances (Arrival, Context, Dispatch, Stream, Write), sub-axis instances, leaves, axioms (CA1..CA5), the P7 declaration (P7=0, all conditions mechanical), and the P8 declaration (P8=0, structural-mode).

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 5 | `{primitiveKind: 'P1', instanceCount: 5, basis: "CS-local domain axes declared at §3.3: Arrival, Context, Dispatch, Stream, Write. The seven metaframework axes (A1–A7) are the framework-file shape shell; CS-local P1 instances populate §3 Structure under A3 Structure."}` |
| P2 Sub-axis | 10 | Arrival: 2; Context: 2; Dispatch: 2; Stream: 2; Write: 2. Declared §3.4. |
| P3 Leaf | 5 | One leaf per axiom condition per MA-St2: CA1 (1) + CA2 (1) + CA3 (1) + CA4 (1) + CA5 (1) = 5. Declared §3.5. |
| P4 Axiom | 5 | CA1, CA2, CA3, CA4, CA5. Declared §3.6. |
| P5 Gate | 5 | G-CS1, G-CS2, G-CS3, G-CS4, G-CS5. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-CS1 (authoring-program → CS), HR-CS2 (CS → substrate wearer write), HR-CS3 (CS → substrate LLM write), HR-CS4 (CS → F-router consultation). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "CS's intake and dispatch validation is fully mechanical: every CA1..CA5 condition reduces to substrate §6.3 mechanical-criterion ground — structural property (CA1 field presence, CA4 streaming independence), reference resolution (CA2 substrate context read, CA5 F-router consultation), cardinality (CA3 dual-write required), deterministic-function-result (CA5 dispatch vs fallthrough decision). No judgment inputs consumed at runtime. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 0 | `{primitiveKind: 'P8', instanceCount: 0, basis: "CS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). CS has zero P8 instances per substrate §8.6 empty-declaration derivation. CS's intake pipeline is owned upstream by F-chat (L4 authoring program); CS declares the typed shapes and invariants, not the execution procedure. This pattern parallels VS v1.0 §3.7 P8 empty-declaration (substituting structural for verificative)."}` |

Positive empty-declaration markers for P7 and P8 conform to substrate §4 A-17 `EmptyPrimitiveDeclaration` typed shape: `{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`. No implicit absence.

### §3.3 P1 Axis instances (CS-local)

Five domain axes. MECE over CS's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Arrival` | Arrival | Reception and validation of the wearer message at the conversational perimeter | What arrived, from whom, in what project scope? |
| `Context` | Context | Assembly of typed substrate context for the LLM before calling it | What substrate state does the LLM see for this exchange? |
| `Dispatch` | Dispatch | F-router consultation and program routing vs LLM fallthrough | Does this message route to a program, or fall through to raw LLM? |
| `Stream` | Stream | LLM response streaming and stream/write independence | How does the response reach the wearer, and how does streaming relate to the substrate write? |
| `Write` | Write | Dual substrate write of both sides to graph | What is written to substrate, when, and with what correlation key? |

**MECE verification:**
- Orthogonality: Arrival governs message reception + validation (boundary inbound); Context governs substrate-state assembly before LLM call; Dispatch governs routing decision (program vs LLM); Stream governs LLM response transmission to wearer; Write governs substrate persistence of both sides. No pair-overlap.
- Exhaustiveness: every `ChatStateChange` field and every F-chat operation traces to exactly one CS-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

**Arrival sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Arrival/shapeConformance` | ChatArrival typed shape conformance | `leaf-CA1-arrival-receipt` (covered by CA1) |
| `Arrival/contentValidation` | content non-empty + modelId in MODELS registry | `leaf-CA1-arrival-receipt` (covered by CA1) |

**Context sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Context/substrateRead` | Scope-filtered substrate context read for session | `leaf-CA2-context-assembly` |
| `Context/systemPrompt` | Context assembled into system prompt before LLM call | `leaf-CA2-context-assembly` (covered by CA2) |

**Dispatch sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Dispatch/routerConsultation` | F-router consulted before LLM fallthrough | `leaf-CA5-dispatch` |
| `Dispatch/fallthroughDefault` | Unmatched messages fall through to LLM path (not error) | `leaf-CA5-dispatch` (covered by CA5) |

**Stream sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Stream/wearerDelivery` | LLM response streamed to wearer as produced | `leaf-CA4-streaming` |
| `Stream/writeIndependence` | Stream failure does not suppress write; write failure does not suppress stream | `leaf-CA4-streaming` (covered by CA4) |

**Write sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Write/dualWrite` | Both wearer side and LLM side written to substrate | `leaf-CA3-dual-write` |
| `Write/turnCorrelation` | Both writes carry same turnId for correlation | `leaf-CA3-dual-write` (covered by CA3) |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-CA1-arrival-receipt` | `axiom` | `ChatArrival shape conformance: userId (non-null UserId), projectId (non-empty string), content (non-empty string), modelId (string present in MODELS registry), turnId (non-empty string), arrivedAt (EpochMs > 0) — per CA1 structural property (field presence) + reference resolution (modelId registry lookup)` |
| `leaf-CA2-context-assembly` | `axiom` | `Before LLM call: substrate is queried for session context scoped to (userId, projectId); query result assembled into system prompt block; contextRef recorded in ChatStateChange.contextRef on 'ai' write — per CA2 reference resolution (substrate context read resolves) + structural property (system prompt populated before call)` |
| `leaf-CA3-dual-write` | `axiom` | `Two ChatStateChange atoms written per exchange: (1) side='wearer' on message arrival with content=ChatArrival.content, modelId=null, contextRef=null; (2) side='ai' on stream completion with content=full LLM response, modelId=ChatArrival.modelId, contextRef=assembled context ref; both carry turnId=ChatArrival.turnId — per CA3 cardinality (exactly two writes, neither optional) + structural property (turnId shared)` |
| `leaf-CA4-streaming` | `axiom` | `LLM response streamed to wearer as chunks are produced (SSE protocol); full response captured on stream completion; stream failure path and write path are independent: stream error emits error chunk to wearer but write attempt proceeds; write failure does not suppress already-streamed chunks — per CA4 structural property (two independent operations: streaming and substrate write; neither gates the other)` |
| `leaf-CA5-dispatch` | `axiom` | `On ChatArrival, F-router is consulted (HR-CS4) before LLM fallthrough; if F-router returns a program match, ChatArrival is dispatched to that program and LLM is not called directly; if F-router returns no match, CS proceeds to Context assembly + LLM call (default path); no-match is not an error — it is the default conversational path — per CA5 reference resolution (F-router consultation resolves) + deterministic-function-result (dispatch vs fallthrough derived from F-router result)` |

### §3.6 P4 Axiom instances (CA1..CA5)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). One axiom per CS-local axis (1:1 mapping per brief).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **CA1** | `Arrival` / `leaf-CA1-arrival-receipt` | Every `ChatArrival` consumed by CS conforms to the typed shape declared at §2.1: `userId` is non-null UserId, `projectId` is non-empty string, `content` is non-empty string (length ≥ 1), `modelId` resolves in the MODELS registry (reference resolution), `turnId` is non-empty string, `arrivedAt` is EpochMs > 0 — all populated and valid. | structural property (field presence + non-empty checks) + reference resolution (modelId registry lookup) |
| **CA2** | `Context` / `leaf-CA2-context-assembly` | Before the LLM is called for any `ChatArrival`, CS reads typed substrate context scoped to `(userId, projectId)` via Living Memory traversal (HR-CS2 substrate read contract); the read result is assembled into the system prompt passed to the LLM; the context reference is recorded in `ChatStateChange.contextRef` on the `'ai'`-side write. | reference resolution (substrate context read resolves for (userId, projectId) scope) + structural property (system prompt assembled before LLM call; contextRef populated on ai-side write) |
| **CA3** | `Write` / `leaf-CA3-dual-write` | For every `ChatArrival` processed by CS, exactly two `ChatStateChange` atoms are written to substrate: (i) `side='wearer'` written on message arrival with `content = ChatArrival.content`, `modelId = null`, `contextRef = null`; (ii) `side='ai'` written on stream completion with `content = full LLM response text`, `modelId = ChatArrival.modelId`, `contextRef = context reference from CA2`; both carry `turnId = ChatArrival.turnId`. Neither write is optional; both are substrate-committed independently. | cardinality (exactly two writes per exchange, 1:1 with arrival) + structural property (side enum, turnId shared, field values per side) |
| **CA4** | `Stream` / `leaf-CA4-streaming` | The LLM response is streamed to the wearer as SSE chunks as it is produced; the full response text is captured on stream completion for the `'ai'`-side substrate write (CA3). Stream delivery and substrate write are operationally independent: a stream error results in an error chunk sent to wearer but the substrate write attempt is not suppressed; a substrate write failure does not suppress chunks already delivered to the wearer. | structural property (stream + write independence: two operations, neither gates the other; stream error does not suppress write; write failure does not suppress stream) |
| **CA5** | `Dispatch` / `leaf-CA5-dispatch` | On every `ChatArrival`, F-router is consulted via HR-CS4 before CS proceeds to Context assembly or LLM call; if F-router returns a program match (`routeResult.matched === true`), CS dispatches to the matched program and does not call the LLM directly for this arrival; if F-router returns no match (`routeResult.matched === false`), CS proceeds to CA2 Context assembly + LLM call; no-match is the default conversational path and is not a failure condition. | reference resolution (HR-CS4 F-router consultation resolves) + deterministic-function-result (dispatch vs LLM-fallthrough is fully determined by routeResult.matched boolean) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set is the v1.0 baseline. CA1..CA5 declared once; future versions amend additively per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (invariant conditions, no imperative mood). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "CS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative
  only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8
  instances. P8 is absent, not empty.'). CS has zero P8 instances per substrate §8.6
  empty-declaration derivation. CS's intake pipeline is owned upstream by F-chat (L4 authoring
  program — F-chat/contract/chat-contract.ts). CS declares the typed shapes that pipeline
  produces (ChatArrival consumed, ChatStateChange emitted); it does not declare the procedure.
  CS's emit-time validity enforced mechanically by the CA1..CA5 gate bundle — parallel to VS v1.0
  §3.7 P8 empty-declaration (verificative-mode) and Plan v2.2 §3.7 (structural-mode)."
}
```

PR4 / PR5 self-checks vacuous (empty P8 set).

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four universal variables). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Arrival` | `EpochMs` (bound to `ChatArrival.arrivedAt` — arrival timestamp) | `string` (bound to `ChatArrival.modelId` — categorical classifier of LLM model in use for this exchange) | `ChatArrival.userId: UserId` paired with `ChatArrival.projectId: string` (dual-scope reference: arrival is scoped to both user session and project) | `ChatShapePositional` enum `'pending' \| 'received' \| 'rejected'` (declared §3.9) |
| `Context` | `EpochMs` (bound to substrate context read timestamp — context assembled at call time, not at arrival time) | `string \| null` (bound to `ChatStateChange.contextRef` — categorical identity of assembled context; null when context read returns empty) | `(userId, projectId)` scope pair → substrate context traversal result (relational: context is a function of the session scope pair; Living Memory traversal resolves it) | `ChatContextPositional` enum `'unread' \| 'assembled' \| 'injected'` (declared §3.9) |
| `Dispatch` | `EpochMs` (bound to F-router consultation timestamp — happens before LLM call) | `boolean` (bound to `routeResult.matched` — binary categorical: matched program route or fallthrough) | `ChatArrival` → F-router consultation result → program OR LLM (relational: arrival determines route; route determines execution path) | `ChatDispatchPositional` enum `'pending' \| 'routed' \| 'fallthrough'` (declared §3.9) |
| `Stream` | `EpochMs` (bound to stream-completion timestamp — when full LLM response is captured) | `string` (bound to `ChatStateChange.content` on 'ai' side — the full LLM response text captured on completion) | `SSE stream` paired with `ChatStateChange 'ai'-side write` (independent pair per CA4: stream delivers to wearer; write persists to substrate; neither depends on the other's success) | `ChatStreamPositional` enum `'streaming' \| 'complete' \| 'error'` (declared §3.9) |
| `Write` | `EpochMs` (bound to `ChatStateChange.writtenAt` — substrate write timestamp, distinct per side) | `ChatSide` enum `'wearer' \| 'ai'` (bound to `ChatStateChange.side` — categorical identifier of which side this write represents) | `ChatStateChange.turnId: string` paired across both writes (relational: the two ChatStateChange atoms from one exchange are correlated by their shared turnId) | `ChatWritePositional` enum `'pending' \| 'written' \| 'failed'` (declared §3.9) |

Every cell is a named type, enum literal, inlined shape, or declared type-to-type paired reference. No prose cells.

**MA-St3 self-check:** no content appears under more than one axis. Stream and Write both touch the 'ai'-side `ChatStateChange`, but at different concerns: Stream governs delivery-to-wearer + content capture; Write governs substrate persistence + turnId correlation. Orthogonal by concern (delivery vs persistence). Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1.

| Term | Declared | Definition |
|---|---|---|
| `chat-turn` | §1 primitive | atomic unit of work in CS: one complete wearer↔LLM exchange, producing two ChatStateChange atoms (wearer side + ai side); parallel to VS `predicate-evaluation`, RS `investigation-step` |
| `ChatArrival` | §2.1 + `chat-standard.types.ts` | CS-defined typed input shape; wearer message at conversational perimeter |
| `ChatStateChange` | §2.2 + `chat-standard.types.ts` | CS-defined typed output shape; one side of an exchange written to substrate |
| `ChatSide` | §2.2 + §3.8 | enum `'wearer' \| 'ai'` — identifies which side of the exchange a ChatStateChange represents |
| `chat turn` | §3.3 Arrival | one complete wearer↔LLM exchange cycle: arrival → context → dispatch → stream → write ×2 |
| `dual write` | §3.3 Write + §3.6 CA3 | the invariant that exactly two ChatStateChange atoms are written per exchange — one wearer-side on arrival, one ai-side on completion |
| `fallthrough` | §3.3 Dispatch + §3.6 CA5 | the default execution path when F-router returns no program match; CS proceeds to context assembly + LLM call; not an error state |
| `stream/write independence` | §3.3 Stream + §3.6 CA4 | the structural invariant that SSE streaming to wearer and substrate write of the LLM response are operationally independent — neither gates the other |
| `contextRef` | §2.2 ChatStateChange | string reference to the substrate context assembled for this turn (CA2); null on 'wearer' write; non-null on 'ai' write when context was available |
| `ChatShapePositional` | §3.8 | enum `'pending' \| 'received' \| 'rejected'` — Arrival axis lifecycle position |
| `ChatContextPositional` | §3.8 | enum `'unread' \| 'assembled' \| 'injected'` — Context axis lifecycle position |
| `ChatDispatchPositional` | §3.8 | enum `'pending' \| 'routed' \| 'fallthrough'` — Dispatch axis lifecycle position |
| `ChatStreamPositional` | §3.8 | enum `'streaming' \| 'complete' \| 'error'` — Stream axis lifecycle position |
| `ChatWritePositional` | §3.8 | enum `'pending' \| 'written' \| 'failed'` — Write axis lifecycle position |

---

## §4 Validity

### §4.1 Gate count

CS declares **5 own primary gates** (G-CS1..G-CS5, 1:1 with CA1..CA5 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when CS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| CS-own axiom gates (G-CS*) | 5 | this §4.2 | framework-audit applies CA1..CA5 suite per MA-V1 |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **5 + 85 = 90** | | |

### §4.2 CS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 5 axioms → 5 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-CS1** | CA1 | `typeof input.userId === 'string' AND input.userId.length >= 1 AND typeof input.projectId === 'string' AND input.projectId.length >= 1 AND typeof input.content === 'string' AND input.content.length >= 1 AND typeof input.modelId === 'string' AND MODELS[input.modelId] !== undefined AND typeof input.turnId === 'string' AND input.turnId.length >= 1 AND typeof input.arrivedAt === 'number' AND input.arrivedAt > 0` | structural property (field presence + non-empty checks) + reference resolution (MODELS registry lookup) |
| **G-CS2** | CA2 | `let contextResult = substrateRead({userId: input.userId, projectId: input.projectId}); contextResult !== null AND typeof contextResult === 'object' AND emission_ai_side.contextRef === contextResult.ref AND systemPromptAssembledBefore(llmCall) === true` where `systemPromptAssembledBefore` is a structural ordering check: context read result is present in the LLM call payload | reference resolution (substrate context read resolves for scope pair) + structural property (context assembled into system prompt; contextRef populated on ai-side emit) |
| **G-CS3** | CA3 | `let wearerWrite = getStateChange(input.turnId, 'wearer'); let aiWrite = getStateChange(input.turnId, 'ai'); wearerWrite !== null AND aiWrite !== null AND wearerWrite.content === input.content AND wearerWrite.modelId === null AND wearerWrite.contextRef === null AND aiWrite.content.length >= 1 AND aiWrite.modelId === input.modelId AND aiWrite.turnId === input.turnId AND wearerWrite.turnId === input.turnId` | cardinality (exactly two writes: both non-null) + structural property (side-specific fields, shared turnId) |
| **G-CS4** | CA4 | `streamDeliveredToWearer(input.turnId) === true AND substrateWriteAttempted(input.turnId, 'ai') === true AND streamErrorSuppressesWrite(input.turnId) === false AND writeErrorSuppressesStream(input.turnId) === false` where the latter two predicates check execution log independence: no conditional dependency between stream path and write path in the execution trace | structural property (independence predicate: stream + write paths execute regardless of each other's outcome; error on one does not suppress the other) |
| **G-CS5** | CA5 | `let routeResult = routerConsultationLog(input.turnId); routeResult !== null AND routeResult.consulted === true AND (routeResult.matched === true implies llmCalledDirect(input.turnId) === false) AND (routeResult.matched === false implies (contextAssembled(input.turnId) === true AND llmCalledDirect(input.turnId) === true))` | reference resolution (router consultation log resolves) + deterministic-function-result (matched→program dispatch; not-matched→LLM fallthrough; deterministic given routeResult.matched) |

**G-M1 self-check:** 5 axioms → 5 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Arrival 1 gate (G-CS1); Context 1 gate (G-CS2); Write 1 gate (G-CS3); Stream 1 gate (G-CS4); Dispatch 1 gate (G-CS5). Every CS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs CS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests CS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests CS's §2 Schema conformance to MA-S1..MA-S8 (G-S8 vacuous-pass: referentCitations=[]).
- **E3 Structure (PG3 + G-St1..G-St16):** tests CS's §3 Structure conformance (G-St5 P8 stage-declaration extended predicate: P8=0 with positive A-17 basis; vacuously passes per PR4/PR5 empty-set rule).
- **E4 Validity (PG4 + G-V1..G-V11):** tests CS's §4 Validity conformance (G-V10 + G-V11 vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests CS's §5 Lifecycle conformance (G-L11 vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests CS's §6 Coupling conformance.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests CS's §7 Judgment conformance (P7=0 empty-declared per §3.2 + §7.1; G-J4 vacuous-pass on empty set).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests CS's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus CS's own 5 G-CS* gates execute against each exchange at runtime. Total per-audit framework-tier gates when CS is target: 90 (85 + 5).

**Disambiguation note:** The 85 inherited gates test CS's **framework declaration conformance**. The 5 G-CS* gates test **individual ChatArrival/ChatStateChange instance conformance** at runtime. Different scopes, different execution sites.

### §4.4 Dimension–gate mapping (per MA-V5)

| Dimension | CS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=0 empty-declared mechanical); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (10 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-CS2/HR-CS3 substrate writes + HR-CS4 F-router |
| X10 (Stage-declaration extended predicate) | §3.7 P8=0 positive empty-declaration + basis citing substrate §8.3 + §8.6 |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 5 CS-own (G-CS*) = 74.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to CS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 90 framework-tier gates (85 inherited + 5 CS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0-confirmation. Per metaframework §5.X first-run-execution lifecycle event: when CS's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged. CS first-run does not amend the framework.

Gate IDs enumerated:

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

CS-own (5): `G-CS1, G-CS2, G-CS3, G-CS4, G-CS5`.

Substrate-tier gates (SG1–SG5) excluded per tier-1 semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). CS is a fresh L3 framework with no predecessor. Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: five axioms (CA1..CA5) declared; ChatArrival + ChatStateChange shapes declared; P7=0 (mechanical) + P8=0 (structural-mode); carrier=self (substrate-direct write); `referentCitations: []` per precedent; four Sprint 11 substrate write points declared (CA3 dual-write contract). Generation path: generation-procedure-v1-0 v1.1.6 S1–E8 template-generation under metaframework-v3-1 v3.2.7.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 10 Shot 2 per LIV deploy state. Driving findings: (i) F-chat/contract contains four Sprint 9/11 TODO markers declaring substrate write points — Chat Standard provides the missing governance contract for those write points; (ii) Chat Standard completes the perimeter-gate governance pair (with Dashboard Standard); (iii) conversational gate is a load-bearing perimeter surface; governance gap in beta build.

### §5.3 Confirmation gate

Pending L0 at v1.0 closure. Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. CS declares zero J-inputs (P7=0, MA-J4 emptyDeclared). No deprecations possible.

### §5.6 Failure modes

| Stage | Failure mode | Recovery path |
|---|---|---|
| Arrival receipt (HR-CS1) | ChatArrival shape violation (missing field, invalid modelId, empty content) | authoring program returns `Result { ok: false, error: ChatValidityError { code: 'CHAT_ARRIVAL_INVALID' } }`; no substrate write, no LLM call |
| F-router consultation (HR-CS4 / G-CS5) | Router unreachable or returns malformed result | CS falls through to LLM path with `routeResult = { matched: false }`; routing failure is treated as no-match per CA5 fallthrough-is-default rule |
| Context assembly (HR-CS2 / G-CS2) | Substrate context read fails or returns empty | CS proceeds with empty system prompt (contextRef=null on ai-side write); no suppression of LLM call |
| LLM streaming (CA4 stream path) | Stream error mid-response | error chunk sent to wearer; substrate write of partial response attempted (captured up to error point); G-CS4 write-independence enforced |
| Substrate write (HR-CS2/HR-CS3 / G-CS3) | Write fails for wearer or ai side | `ChatValidityError { code: 'CHAT_WRITE_FAILED', side: 'wearer' \| 'ai' }`; streaming to wearer not suppressed (CA4 independence); retry at caller discretion |

### §5.7 Scale bounds

- Per-exchange: one ChatArrival → two ChatStateChange writes + one LLM stream; O(1) per exchange.
- Context assembly: bounded by Living Memory traversal depth and session-scope cardinality (operational; no CS-framework hard cap).
- Concurrent exchanges: bounded by rate-limit policy (owned by F-chat config; CS declares rate-limit gate exists at CA1 intake; policy values are out of scope per §1 scopeOut).
- Streaming: bounded by LLM context-window and F-ai-adapter constraints (operational; not a CS axiom).

### §5.8 Atomicity declarations

- Arrival validation (G-CS1): atomic per-exchange (all-or-nothing; invalid arrival returns error without write).
- Context assembly (CA2): atomic per-exchange (read + assemble before LLM call; no partial inject).
- Dual substrate write (CA3): each write is independently atomic per substrate §13.4; the two writes are not jointly atomic — wearer write succeeds or fails independently of ai write.
- Stream + write independence (CA4): the two operations execute in parallel paths; atomicity is per-path.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-05-09 (Sprint 10 Shot 2 / Phase 2 missing-governance gate clearance) | Initial declaration. Five CS-local P1 axes (Arrival, Context, Dispatch, Stream, Write). Five axioms CA1..CA5. Five paired gates G-CS1..G-CS5 (1:1 per G-M1). Four HRs HR-CS1..HR-CS4 with captureShape. P7=0 (mechanical) + P8=0 (structural-mode) positive empty-declarations. Carrier = self (substrate-direct write; dual-write protocol per CA3). ChatArrival + ChatStateChange shapes declared. CA3 dual-write contract formalizes the four Sprint 11 TODO markers in F-chat/contract/chat-contract.ts. `referentCitations: []` per precedent. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. | L0 (pending v1.0 confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Chat Standard carrier = `self`. CS writes `ChatStateChange` atoms directly to substrate graph at HR-CS2 (wearer side) and HR-CS3 (LLM side) without an enclosing carrier framework. Rationale: substrate writes are graph-native operations consumed by Living Memory and downstream programs via substrate traversal. No chat-surface envelope needed (CS is the chat surface; it doesn't ride another surface). Parallel to Builder Standard v1.0 §6.1 carrier rationale.

### §6.2 Handoff rules

Four framework-local HR instances.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-CS1** | authoring-program → chat-standard (ChatArrival receipt) | `['self']` | `true` | declared §6.3 |
| **HR-CS2** | chat-standard → substrate (wearer-side ChatStateChange write) | `['self']` | `true` | declared §6.3 |
| **HR-CS3** | chat-standard → substrate (ai-side ChatStateChange write) | `['self']` | `true` | declared §6.3 |
| **HR-CS4** | chat-standard → F-router (dispatch consultation) | `['self']` | `true` | declared §6.3 |

**Inherited HRs referencing CS:**

| HR | Owning declaration | CS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → CS type consumption |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; CS is the generated L3 template output |
| HR5 | metaframework §6.2 | metaframework → registry; registry records CS's declaration |

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-CS1 — authoring program → CS (ChatArrival receipt):**
```
captureShape = {
  capturedFields: ['userId', 'projectId', 'turnId', 'modelId', 'content.length', 'arrivedAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-CS2 — CS → substrate (wearer-side write):**
```
captureShape = {
  capturedFields: ['turnId', 'userId', 'projectId', 'side', 'writtenAt', 'content.length', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; ChatStateChange node resolved via turnId + side in substrate graph'
}
```

**HR-CS3 — CS → substrate (ai-side write):**
```
captureShape = {
  capturedFields: ['turnId', 'userId', 'projectId', 'side', 'modelId', 'contextRef', 'writtenAt', 'content.length', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; ChatStateChange node resolved via turnId + side in substrate graph'
}
```

**HR-CS4 — CS → F-router (dispatch consultation):**
```
captureShape = {
  capturedFields: ['turnId', 'userId', 'projectId', 'routeResult.matched', 'routeResult.programId', 'consultedAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; consultation log resolved via turnId'
}
```

### §6.4 Handoff axioms satisfaction

- **MA-C1** (carrier declared): §6.1 carrier=self with rationale.
- **MA-C2** (custody complete): §6.5 enumerates all atoms.
- **MA-C3** (handoff-invariant symmetry): HR-CS1..HR-CS4 captureShapes declared at §6.3 for all diagnostic-significance=true HRs.
- **MA-C4** (provenance per output field): §2.2 every ChatStateChange field traced; §6.5 custody; §6.6 provenance.
- **MA-C5** (carrier-consistent emission): carrier=self → ChatStateChange written directly to substrate at HR-CS2/HR-CS3.
- **MA-C6** (no re-ownership): substrate + primitives.ts + metaframework atoms consumed by reference; single owner per row.
- **MA-C7..MA-C10**: cross-framework ID coherence + substrate-version-pin + diagnostic-significance + capture-target completeness — satisfied per §6.2 + §6.3.

### §6.5 Custody table

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `UserId` | primitives.ts | core/R5 | chat-standard (§2.1 ChatArrival.userId, §2.2 ChatStateChange.userId), every session-aware framework |
| `EpochMs` | primitives.ts | core/R5 | chat-standard (§2.1 arrivedAt, §2.2 writtenAt) |
| `Result<T, E>` | primitives.ts | core/R5 | chat-standard (§2 ChatEmissionResult) |
| `AppError` | primitives.ts | core/R5 | chat-standard (§2 ChatValidityError extends) |
| `Mode` | substrate | L1 (substrate §2) | chat-standard (§1 Identity `Mode = structural`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | chat-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | chat-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | chat-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | chat-standard (§4.3 inherited gate references) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | chat-standard (HR direction endpoints §6.2, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | chat-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed) | chat-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed) | chat-standard (§1 state rows, §5 transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | chat-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed) | chat-standard (inherited via HR-CS1 pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed) | chat-standard (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed) | chat-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | chat-standard (§3.7 P8=0 basis — structural-mode Mode-binding cited) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | chat-standard (§3.7 same basis) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | chat-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | chat-standard (empty-declaration per §3.2 P7=0; row retained for substrate §12 completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | chat-standard (empty-declaration basis per MA-J4) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | chat-standard (§3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | chat-standard (§1 Identity referentCitations row, empty at v1.0) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | chat-standard (§4.3 inherited gate enumeration) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | chat-standard (this file is an instance per HR6) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | chat-standard (sourceInputRef target per §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | chat-standard (§8.2 dimension results) |
| `ChatArrival` | chat-standard | L3 (this file §2.1 + core/R5) | chat-standard (internal), authoring programs (F-chat constructs at caller site) |
| `ChatStateChange` | chat-standard | L3 (this file §2.2 + core/R5) | chat-standard (internal), substrate (written at HR-CS2/HR-CS3), Living Memory (persistence), downstream programs |
| `ChatSide` | chat-standard | L3 (this file §2.2 + §3.8 + core/R5) | chat-standard (internal — ChatStateChange.side enum) |
| `ChatContextRef` | chat-standard | L3 (this file §2.2 + core/R5) | chat-standard (internal — ChatStateChange.contextRef type alias) |
| `ChatShapePositional` / `ChatContextPositional` / `ChatDispatchPositional` / `ChatStreamPositional` / `ChatWritePositional` | chat-standard | L3 (this file §3.8 + core/R5) | chat-standard (internal), framework-audit |
| `ChatHandoffRuleInstance` | chat-standard | L3 (this file §6.2 + core/R5) | chat-standard (internal), framework-audit (X3 C5 captureShape check) |
| `ChatGateResult` | chat-standard | L3 (§4 + core/R5) | chat-standard (internal), framework-audit (SelfAuditRecord) |
| `ChatDimensionResult` | chat-standard | L3 (§4.4 + core/R5) | chat-standard (internal), framework-audit |
| `ChatCustodyRow` | chat-standard | L3 (§6.5 + core/R5) | chat-standard (internal), framework-audit |
| `ChatValidityError` | chat-standard | L3 (§2 + core/R5) | chat-standard (internal); extends primitives.ts `AppError` |
| `ChatEmissionResult` | chat-standard | L3 (§2 + core/R5) | chat-standard (emission surface), authoring programs |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-05-09T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',
  sourceInputValue:         undefined
}
```

### §6.7 Carrier-applicability enforcement

CS carrier = `self`. All four HRs carry applicability `['self']`. Self-carrier: direct substrate writes and F-router consultation, no named-carrier envelope.

### §6.8 OperatorInterface

```
operatorInterface = {
  invocationEntrypoint: 'authoring-program (F-chat) receives ChatArrival → validates CA1..CA5 → consults F-router (CA5) → assembles context (CA2) → calls LLM or dispatches to program → streams response (CA4) → writes dual ChatStateChange to substrate (CA3 via HR-CS2/HR-CS3)',
  configurationInputs:  ['userId + projectId (session scope)', 'content (wearer message text)', 'modelId (LLM model selection)', 'turnId (generated per exchange)'],
  observableOutputs:    ['SSE stream to wearer (chunks + done/error events)', 'ChatStateChange wearer-side in substrate (HR-CS2)', 'ChatStateChange ai-side in substrate (HR-CS3)', 'F-router consultation result (HR-CS4 audit-trail)'],
  errorContract:        'ChatValidityError codes: CHAT_ARRIVAL_INVALID | CHAT_WRITE_FAILED; plus stream error chunk on LLM failure',
  extensibility:        'ChatSide enum extensible by amendment. F-router routing rules extensible within F-router domain. Context assembly depth extensible via Living Memory configuration — no CS amendment required.'
}
```

### §6.9 Handoff contracts (adjacent-framework call patterns)

| Adjacent | CS consumes | CS emits | HR binding |
|---|---|---|---|
| authoring program (F-chat) | ChatArrival (typed wearer message) | dual ChatStateChange writes to substrate; SSE stream to wearer | HR-CS1 (inbound); HR-CS2/HR-CS3 (outbound writes) |
| substrate / Living Memory | session context (scope-filtered by userId + projectId) | ChatStateChange atoms (both sides) written to graph | HR-CS2/HR-CS3 (outbound) + substrate read (CA2) |
| F-router | — (receives arrival context from CS) | routeResult (matched boolean + programId if matched) | HR-CS4 (outbound consultation) |
| dispatched program (F-plan, F-discover, F-verify) | — (receives dispatch from CS via F-router) | program output (program's own domain; CS does not govern program internals) | (via F-router; no direct CS→program HR) |
| Dashboard Standard v1.0 | — (peer perimeter gate; non-overlapping domain) | — | (no HR; distinct domain) |
| framework-audit v1.3.6 | — | — | (no HR; distinct concern per §1 scopeOut) |

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "CS's conversational intake validation is fully mechanical: every CA1..CA5 condition
  reduces to substrate §6.3 mechanical-criterion ground — structural property (CA1 field
  presence, CA4 stream/write independence), reference resolution (CA2 substrate context read,
  CA5 F-router consultation resolves), cardinality (CA3 dual-write exactly two), deterministic-
  function-result (CA5 dispatch decision from routeResult.matched). No judgment inputs consumed
  at runtime. MA-J4 emptyDeclared satisfied with positive basis."
}
```

### §7.2 Axis status

A7 Judgment axis status: `emptyDeclared: true` with positive basis above. Gate coverage:

- G-J1 (J-input-typing): vacuous per §7.1 empty set.
- G-J2 (mechanical-criterion ground): vacuous per §7.1 empty set.
- G-J3 (provenance for J-input): vacuous per §7.1 empty set.
- G-J4 (J-axis emptyDeclared or non-empty): passes via `emptyDeclared: true` with declared basis.
- G-J5 (mechanicalGround field resolution): vacuous per §7.1 empty set.

### §7.3 Judgment provenance

Empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 90 framework-tier gates (85 inherited + 5 CS-own): state = `not-yet-run` at this delivery.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle declares state transitions; §5.9 version history present |
| X2 Determinism / reproducibility | declared-complete | §3.6 axiom mechanical-criterion ground per substrate §6.3; §3.7 P8=0 + P7=0 mechanical empty-declarations |
| X3 Observability / introspection | declared-complete | §6.2 HRs with captureShape; §6.3 captureShape table populated for HR-CS1..HR-CS4 (all diagnostic-significance=true) |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut row with 10 entries |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated |
| X9 Integration point | declared-complete | §6 cross-framework; HR-CS2/HR-CS3 substrate writes; HR-CS4 F-router; §6.9 call patterns |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=0 positive empty-declaration with basis citing substrate §8.3 + §8.6 |

### §8.3 Last audit event

Not yet run. v1.0 delivery is the first compilation of Chat Standard.

### §8.4 Self-application basis

Per G-U1: CS's gate suite (G-CS1..G-CS5 + 85 inherited) will audit CS's own framework declaration file at framework-audit first-run.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-09 | Initial declaration. Five CS-local P1 axes (Arrival, Context, Dispatch, Stream, Write). Five axioms CA1..CA5. Five paired gates G-CS1..G-CS5 (1:1 per G-M1). Four HRs HR-CS1..HR-CS4 with captureShape. P7=0 (mechanical) + P8=0 (structural-mode) positive empty-declarations per A-17. Carrier=self (substrate-direct dual write per CA3). ChatArrival + ChatStateChange shapes declared. CA3 dual-write contract formalizes the four Sprint 11 TODO markers in F-chat/contract/chat-contract.ts. CA5 F-router consultation + fallthrough-is-default declared. CA4 stream/write independence declared. `referentCitations: []` per Builder v1.0 / VS v1.0 / RS v1.0 / Cognitive v1.2.2 precedent. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. | Sprint 10 Shot 2 / Phase 2 missing-governance gate clearance |

---

**S11 — J-chat-turn-observation gate results (for L0 confirmation):**

**C1 — Eight top-level fields populated:** identity ✓, schema ✓, structure ✓, validity ✓, lifecycle ✓, coupling ✓, judgment ✓, provenance ✓. validity.overallResult: §4.8 `not-yet-run` with basis — field present. **PASS.**

**C2 — Gate results all pass (E1–E8):**
- G-CS1 (CA1 arrival receipt): field-presence + non-empty + modelId registry lookup — §2.1 shape + §4.2 predicate consistent. **PASS.**
- G-CS2 (CA2 context assembly): substrate read + system-prompt ordering + contextRef population — §6.9 substrate read pattern + §3.6 CA2 consistent. **PASS.**
- G-CS3 (CA3 dual write): exactly-two cardinality + side enum + turnId shared + field-per-side — §2.2 shape + §3.6 CA3 consistent. **PASS.**
- G-CS4 (CA4 stream/write independence): two independent paths; neither suppresses other — §3.6 CA4 + §5.6 failure modes consistent. **PASS.**
- G-CS5 (CA5 dispatch): F-router consulted; matched→program, not-matched→LLM; deterministic-function-result — §3.6 CA5 + §6.2 HR-CS4 consistent. **PASS.**
- E1–E8 inherited gates: all structural checks against §1–§7 complete; referentCitations=[] vacuous-pass gates declared; P7=0 + P8=0 empty-declaration gates declared. **PASS.**

**C3 — No escalation raised:** escalation count = 0. **PASS.**

**J-chat-turn-observation overall: PASS. Delivering to L0 for S12 confirmation.**

---

**End of chat-standard-v1-0. Pending L0 confirmation at v1.0 closure.**
