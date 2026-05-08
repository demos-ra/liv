---
kind: framework
placement: frameworks/standards/
---

# research-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** epistemic (unknown → known)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Artifact Standard v2.2 (frozen carrier), Verification Standard v1.0 (verificative-mode L3 sibling, structural symmetry reference), Plan Standard v2.2 (structural-mode L3 sibling)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Research Standard is the L3 epistemic-mode framework owning runtime-research authoring — the W-ATOM equivalent of VS's verificative-mode role and Plan's structural-mode role. Plan structures `known → structured` work into `PlanArtifactContent`; VS verifies `produced → verified` work into `VerificationArtifactContent`; Research Standard moves `unknown → known` work into `ResearchArtifactContent`. The three are mode-symmetric L3 framework siblings, all parameterized by domain bindings, all carriered through Artifact Standard v2.2.

Research Standard is **distinct from F-discover slice (L4)**: F-discover (L4 authoring program) composes RA1..RA10 against RS atoms and emits via AS at HR-RS3. Research Standard (L3 framework template) declares the typed shape that authoring programs produce — the contract, not the executor. Different tier, different concern, non-overlapping (see §1 scopeOut).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Research Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `epistemic` (per substrate §2 Mode enum; `unknown → known`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first emission via HR-RS3 post-L0-confirmation; F-discover Sprint 5 deployed at HEAD `9862092` and first emission deferred to Sprint 8 per F-discover SLICE.md close criteria) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `artifact-standard` v2.2 (per substrate §9 Carrier enum; applied §6.1; structural symmetry with VS v1.0 + Plan v2.2 — all three mode-primitive L3 siblings carriered through AS at the same version) |
| `primitive` | `investigation-step` (framework-local atomic unit; defined §3.9 Vocabulary; distinct from VS `predicate-evaluation` and Plan `declaration`) |
| `consumes` | authoring-program research request + ResearchBinding instance + KnowledgeContext + investigation method set |
| `produces` | `ResearchArtifactContent` (W-ATOM; rides as `ArtifactPayload.content` inside AS v2.2 emission) |
| `consumedBy` | observability, replay, audit consumers, downstream RS chains (RS researching prior RS emissions per RA8), L4 programs requiring runtime-research authoring (F-discover at v1.0; future research-authoring programs) |
| `adjacentFrameworks` | Artifact Standard v2.2 (carrier), Verification Standard v1.0 (verificative-mode sibling at L3, structural symmetry reference), Plan Standard v2.2 (structural-mode sibling at L3), domain standards (binding suppliers — F-discover slice supplies LIV-architecture smoke binding at Sprint 5 close per F-discover SLICE.md D-RS-BINDING-V1; full domain bindings deferred to natural-defer cycles), Living Memory (through AS carrier), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Verification Standard v1.0 §1 Identity + Cognitive Standard v1.2.2 §1 Identity** establish the pattern for new L3 frameworks at first ratification with zero code referents. At v1.0 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at first L4 tenant cycle when F-discover slice supplies LIV-architecture binding and code referents emerge — Sprint 5 already deployed (HEAD 9862092), promotion scheduled at next RS amendment.' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['runtime execution of research authoring (owned by L4 programs invoking RS at boundary — F-discover slice at v1.0)', 'domain-specific investigation-method semantics (owned by domain standard via ResearchBinding instance — investigationMethod evaluation is a contract, not an RS-side concern)', 'artifact emission mechanics (owned by Artifact Standard v2.2 carrier)', 'graph physics (owned by Living Memory)', 'authoring-program pre-research composition (owned by authoring program — F-discover and future research-authoring programs)', 'recursive research descent beyond one-step closure (owned by consumer; RS guarantees one-step RA8 closure only — see §3.6 RA8 + §6.11 boundary notes)', 'multi-level decomposition Q → Q′ → Q″ (owned by consumer; RS guarantees one-step decomposition tree only per RA2)', 'framework-declaration audit (owned by framework-audit-v1-2 at L2; RS produces runtime artifacts, not framework files)', 'verdict/verification of research findings (owned by VS v1.0 — RS produces a research artifact; VS v1.0 may verify a ResearchArtifactContent via VA9 self-application targeting it)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-5-5-shot-1-RS-v1-0-genesis',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (RS v1.0 is a fresh L3 framework, not a v0 lift; no predecessor). R5 atom file `core/types/research-standard.types.ts` (680 lines, 47 RA-references) was deployed at Sprint 5 HEAD `9862092` ahead of the spec md. Per Playbook §1.20 strict-functional rule, this spec md closes the missing-canonical-spec gap surfaced by the types.ts line 73 `// Canonical spec: src/core/standards/research-standard.md` marker.

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `epistemic` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: epistemic-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry). |

---

## §2 Schema

### §2.1 Input — `ResearchInput`

Per MA-S1 (input is W-ATOM). Shape (verbatim from `core/types/research-standard.types.ts`):

```
ResearchInput = {
  authoringProgram: AuthoringProgramRef        // caller R0 — { programId, programVersion: Semver }
  userId:           UserId                     // F-identity session
  turnId:           string                     // caller turn context
  binding:          ResearchBinding            // by-value instance from domain standard (zero instances at v1.0)
  question:         ResearchQuestionInput      // caller-supplied unknown to investigate
  priorKnowledge:   KnowledgeContext           // forward-carried known surface; verbatim per RA10
}
```

`ResearchQuestionInput` shape (input form per types.ts §Question shapes):

```
ResearchQuestionInput = {
  questionId:           QuestionId             // unique within one ResearchArtifactContent
  questionText:         string                 // length ≥ 1 per RA1
  decompositionPolicy:  DecompositionPolicyRef // resolves into binding.investigationMethods[*].methodId
}
```

`KnowledgeContext` shape (input prior-knowledge surface):

```
KnowledgeContext = {
  artifactRefs:  NodeId[]
  scopeBoundary: { kind: string, ref: NodeId } | null   // null permitted per A-17 (positive empty-shape) for first investigation in a chain
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `research-standard.types.ts` (R5).

### §2.2 Output — `ResearchArtifactContent`

Per MA-S2 (output is W-ATOM). RS carrier = `named` → `artifact-standard` v2.2: RS's `ResearchArtifactContent` W-ATOM rides as `ArtifactPayload.content` inside AS's `ArtifactEmission` (AS v2.2 `ArtifactPayload.content: unknown` accepts this opaquely per ArA7 verbatim-carry).

Shape (verbatim from `core/types/research-standard.types.ts`):

```
ResearchArtifactContent = {
  researchId:       ResearchId                  // runtime-generated at emission (pins to AS anchor node identity per §6.11)
  researchVersion:  Semver                      // authoring-program-computed (new semver per re-research per RA7)
  producedBy:       AuthoringProgramRef         // verbatim from input.authoringProgram per RA6 producedBy invariant — { programId, programVersion: Semver }
  producedAt:       EpochMs                     // runtime-captured at emission

  binding:          ResearchBinding             // verbatim from input.binding (frozen per RA6 + RA7)

  question:         ResearchQuestionContent     // verbatim from input.question per RA9 + emission-time capturedAt

  priorKnowledge:   KnowledgeContext            // verbatim from input.priorKnowledge per RA10 (byte-identical)

  decomposition:    DecompositionTree           // RA2 one-step structural transformation

  findings:         FindingResultMap            // RA3 one-to-one decomposition (over subQuestions ∪ rootSet)

  openQuestions:    QuestionId[]                // unresolved-or-not-yet-investigated leaves; populated from findings per RA5

  sources:          SourceCitationMap           // RA4 multi-source grounding closure

  closure:          ResearchClosure             // RA5 aggregation closure
}
```

`ResearchQuestionContent` shape (content form, RA9 verbatim-carry triple + capturedAt at emission):

```
ResearchQuestionContent = {
  questionId:           QuestionId
  questionText:         string                  // verbatim from input per RA9
  decompositionPolicy:  DecompositionPolicyRef  // verbatim from input per RA9
  capturedAt:           EpochMs                 // emission-time snapshot per A-20 reference-default discipline
}
```

`DecompositionTree` shape (depth = 1 at v1.0 per RA2):

```
DecompositionTree = {
  rootQuestionId:  QuestionId
  subQuestions:    { [parentId: string]: QuestionId[] }   // at most one entry, keyed by rootQuestionId
}
```

`FindingResultEntry` shape (one entry per leaf-question per RA3):

```
FindingResultEntry = {
  findingRef:      QuestionId                          // resolves into leaves(decomposition) per RA3
  truthValue:      'resolved' | 'unresolved' | null    // null only when executionState='not-yet-investigated' per S4
  executionState:  'not-yet-investigated' | 'investigated'  // per F-cycle-1-3 first-run discipline
  applicability:   'applicable' | 'n/a'                // per F-cycle-1-3 GateResult/DimensionResult decomposition
  basis:           string | null                       // populated when applicability='n/a' per MA-V11
  resolvedContent: unknown | null                      // non-null when truthValue='resolved'; conforms to binding.knowledgeSchema
  sourceRefs:      SourceRef[]                         // non-empty when truthValue='resolved' (resolved findings grounded per RA4)
  failureDetail:   string | null                       // populated when truthValue='unresolved'
  investigatedAt:  EpochMs                             // runtime-captured per investigation
}

FindingResultMap = { [leafQuestionId: string]: FindingResultEntry }
```

`SourceCitation` + `SourceCitationMap` shapes (RA4 multi-source grounding):

```
SourceCitation = {
  citationId:  CitationId
  sourceKind:  'graph-node' | 'external-uri' | 'authoring-input'
  reference:   string                              // shape per sourceKind; opaque at type surface
  capturedAt:  EpochMs
}

SourceCitationMap = { [citationId: string]: SourceCitation }
```

`ResearchClosure` shape (aggregation result per RA5):

```
ResearchClosure = {
  truthValue:            'closed' | 'open' | 'partial' | null   // null permitted for pre-execution per S4
  aggregationBasis:      string                                  // declared aggregation rule applied (v1.0: 'all-resolved-with-vacuous-closure-on-empty-leaves')
  unresolvedQuestionIds: QuestionId[]                            // populated when truthValue ∈ {'open', 'partial'}
}
```

**Atomicity note (per RA5):** closure aggregation is derived from `findings` + `openQuestions` per the all-resolved rule declared at §3.6 RA5 — `closure.truthValue = 'closed'` iff `(findings empty AND aggregationBasis declares vacuous-closure AND openQuestions = []) OR (∀ lid ∈ keys(findings): findings[lid].truthValue === 'resolved' AND findings[lid].applicability === 'applicable' AND openQuestions = [])`; `'open'` iff every leaf is unresolved or not-yet-investigated; `'partial'` iff some leaf is resolved AND some is unresolved or not-yet-investigated; `null` iff any `findings[lid].executionState === 'not-yet-investigated'` AND no leaf has `truthValue === 'resolved'`. Closure is a derived field — RS gate G-RS5 verifies derivation correctness.

Typed shapes declared in `research-standard.types.ts` (R5). Every field traces to §6.5 custody.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 SI-01 single-source-via-reference; string-typed:

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
| `Stage` | substrate §8.3 (consumed for declaration-only P8 empty basis; no P8 instance consumes — RS is non-generative) |
| `StageContentKind` | substrate §8.3 (same as Stage) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same as Judgment) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (consumed by §3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate §4 A-18 (consumed via metaframework §2.2 referentCitations slot at §1 Identity referentCitations row, declared empty at v1.0) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `NodeId` | primitives.ts | §2.2 researchAnchorNodeId via AS emission §6.11; §2.1 KnowledgeContext.artifactRefs + scopeBoundary.ref; §6.5 custody |
| `UserId` | primitives.ts | §2.1 ResearchInput.userId |
| `Semver` | primitives.ts | §1 version, §2 producedBy.programVersion, §2 binding.domainVersion, §2 researchVersion |
| `EpochMs` | primitives.ts (per spec citation) — declared locally in `research-standard.types.ts` per VS+Plan precedent (D-RS-EPOCHMS-LOCATION; see §10) | §2.2 producedAt + question.capturedAt + findings[].investigatedAt + sources[].capturedAt |
| `Result<T, E>` | primitives.ts | §2.2 ResearchEmissionResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 ResearchValidityError (types file), §6.5 custody |
| `CognitivePrimitive` | primitives.ts | not directly consumed by RS fields; referenced at §2.5 cross-framework notes re: AS CreateArtifactInput.primitive field populated by authoring program via Cognitive Standard encodeLLM |

### §2.5 Consumed types (from artifact-standard-v2-2, by reference)

Cross-framework calibration per spec §Cross-framework calibration. RS consumes AS v2.2 types at the carrier boundary; AS is frozen input to this v1.0 cycle (parallel to VS v1.0 + Plan v2.2 AS consumption pattern).

| Type | Home | Consumed at |
|---|---|---|
| `ArtifactPayload` | artifact-standard-v2-2.md §2.2 | §2.2 ResearchArtifactContent rides as `ArtifactPayload.content` (unknown per AS v2.2 ArA7) |
| `ArtifactEmission` | artifact-standard-v2-2.md §2.2 | §6.11 RS-to-AS carrier emission produces this W-ATOM; §2.2 ResearchEmissionResult success value |
| `CreateArtifactInput` | artifact-standard-v2-2.md §2.1 | §6.11 authoring program constructs this at RS→AS boundary (cross-framework calibration point) |
| `ArtifactEdgeKind` | artifact-standard-v2-2.md §2 | referenced at §6.11 dependency-edge semantics (one `'dependency'` edge per `priorKnowledge.artifactRefs` entry per ArA4d) |
| `ArtifactRef` | artifact-standard-v2-2.md §2 (NodeId reference shape) | §2.1 KnowledgeContext.artifactRefs (NodeId-shaped) |

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 (referenced from metaframework §6.5) | §8.2 dimension results schema reference |

### §2.7 RS-local atoms (declared at point of use in §3)

Atoms owned by RS (custody row per atom in §6.5):

`QuestionId`, `ResearchId`, `CitationId`, `EpochMs` (RS-local declaration per A-08 + D-RS-EPOCHMS-LOCATION), `SourceKind`, `GroundingClass`, `ResearchTruthValue`, `ResearchExecutionState`, `ResearchApplicability`, `ResearchClosureTruthValue`, `InvestigationMethodKind`, `ResearchShapePositional`, `ResearchQuestionPositional`, `ResearchFindingPositional`, `ResearchSourcePositional`, `ResearchClosurePositional`, `ResearchSelfApplicationPositional`, `ResearchAggregationKind`, `SourceRef`, `DecompositionPolicyRef`, `ResearchTypedAtomSchema`, `ResearchFailsafeRule`, `SourceCriterion`, `InvestigationMethod`, `ResearchBinding`, `ResearchQuestionInput`, `ResearchQuestionContent`, `KnowledgeContext`, `DecompositionTree`, `FindingResultEntry`, `FindingResultMap`, `SourceCitation`, `SourceCitationMap`, `ResearchClosure`, `AuthoringProgramRef`, `ResearchArtifactContent`, `ResearchInput`, `ResearchHandoffRuleInstance`, `ResearchGateResult`, `ResearchDimensionResult`, `ResearchCustodyRow`, `ResearchValidityError`, `ResearchEmissionResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling) per S1 single-source declaration. Typed shapes in `research-standard.types.ts`.

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to RS:

- **ScR1** (input is W-ATOM): `ResearchInput` declared §2.1 as typed shape.
- **ScR2** (output is W-ATOM): `ResearchArtifactContent` declared §2.2 as typed shape; rides inside AS `ArtifactPayload.content`.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

RS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. RS does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, RS's own structural content populates §3.3–§3.9 below: six RS-local P1 Axis instances (Input, Question, Finding, Source, Closure, Self-application) with Decomposition declared as cross-axis shared with Question (parallel to VS Aggregation cross-axis-shared with Verdict per §3.8 MA-St3 self-check), sub-axis instances, leaves, axioms (RA1..RA10), and the empty P7 + P8 declarations.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 6 | `{primitiveKind: 'P1', instanceCount: 6, basis: "RS-local domain axes declared at §3.3: Input, Question, Finding, Source, Closure, Self-application. Decomposition is declared cross-axis-shared with Question per §3.8 MA-St3 (parallel to VS Aggregation cross-axis-shared with Verdict; same shape, same discipline). The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; RS-local P1 instances populate §3 Structure under the inherited shell under A3 Structure. Axis names derive from types.ts Positional enum prefixes per D-RS-AXES-FROM-TYPES (see §10): ResearchShapePositional → Input; ResearchQuestionPositional (cross-axis shared with Decomposition) → Question; ResearchFindingPositional → Finding; ResearchSourcePositional → Source; ResearchClosurePositional → Closure; ResearchSelfApplicationPositional → Self-application."}` |
| P2 Sub-axis | 18 | Input: 3; Question: 3; Finding: 3; Source: 3; Closure: 2; Self-application: 3; plus Decomposition (cross-axis with Question): 1 — declared §3.4. |
| P3 Leaf | 10 | One leaf per axiom condition per MA-St2 leaf atomicity: RA1 (1) + RA2 (1) + RA3 (1) + RA4 (1) + RA5 (1) + RA6 (1) + RA7 (1) + RA8 (1) + RA9 (1) + RA10 (1) = 10. Declared §3.5. |
| P4 Axiom | 10 | RA1, RA2, RA3, RA4, RA5, RA6, RA7, RA8, RA9, RA10. Declared §3.6. |
| P5 Gate | 10 | G-RS1, G-RS2, G-RS3, G-RS4, G-RS5, G-RS6, G-RS7, G-RS8, G-RS9, G-RS10. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-RS1 (authoring-program → RS), HR-RS2 (domain-standard → RS), HR-RS3 (RS → artifact-standard v2.2), HR-RS4 (RS → consumer/observability/replay/downstream RS for RA8). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "RS's research-artifact composition is fully mechanical per §10 convention inherited from VS v1.0 + Plan v2.2 + AS v2.2: invalid research artifact is not emitted; emission is rejected with a structured error naming the failed axiom. Every RA1..RA10 condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (RA1, RA3, RA4, RA6, RA8, RA10), structural property (RA2, RA5, RA7, RA9), cardinality + reference resolution (RA3 cardinality clause + RA4 multi-source closure + RA6 failsafe-key resolution). No judgment inputs consumed at validity time. Investigation-method semantics within binding.investigationMethods are per-method mechanical: each InvestigationMethod declares methodKind ∈ enum {'decomposition', 'lookup', 'derivation', 'synthesis'} (RA2/RA3 binding), which is mechanical by construction (a method that cannot reduce to one of these kinds fails RA2/RA3 and is rejected before evaluation). Source-grounding semantics within binding.sourceCriteria are per-criterion mechanical: each SourceCriterion declares groundingClass ∈ substrate §6.3 six-class taxonomy (RA4 binding), mechanical by construction. Authoring program's pre-research composition (which produces ResearchArtifactContent from question + binding + priorKnowledge) is upstream of RS schema.input and outside RS judgment scope. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 0 | `{primitiveKind: 'P8', instanceCount: 0, basis: "RS Mode = epistemic per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only (line 662: 'P8 — Procedure step. Mode = generative only.'; line 674: 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). RS therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. RS's research-composition pipeline is owned upstream by the authoring program (pre-schema.input, not an intra-RS procedure — F-discover SLICE.md 'Composition Path' section declares the runtime pipeline at the L4 slice level: G-RS1 input gate → mechanical compose per RA1..RA10 → G-RS1..G-RS10 fail-fast → AS v2.2 createArtifact emission; this entire pipeline is L4 slice work, not RS's P8); RS's emission-time validity enforced mechanically by the RA1..RA10 gate bundle at the AS v2.2 carrier invocation site (§6.11), outside RS's P8 scope. Spec's permissive 'P8 declaration permitted but not required' is resolved under substrate §8.3 Mode binding precedence: P8 is structurally absent for RS (parallel to VS v1.0 §3.7 P8 empty-declaration pattern + Plan v2.2 §3.7 P8 empty-declaration pattern, substituting epistemic for verificative/structural). See D-RS-P8-EMPTY in §10 for the build-time resolution against brief §4 directive."}` |

Positive empty-declaration markers for P7 and P8 conform to substrate §4 A-17 `EmptyPrimitiveDeclaration` typed shape: `{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`. No implicit absence.

### §3.3 P1 Axis instances (RS-local)

Six domain axes. MECE over RS's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Input` | Input | Reception of the research request | What is being researched, by whom, against what binding, with what prior knowledge? |
| `Question` | Question | The unknown to investigate (input + content forms with RA9 capturedAt) | What is the question and how should it be decomposed? |
| `Finding` | Finding | Per-leaf investigation outcomes | Did each leaf-question resolve, fail to resolve, or remain not-yet-investigated — and why? |
| `Source` | Source | Source citations grounding resolved findings | Where does the resolved knowledge come from, and is each citation admissible per the binding? |
| `Closure` | Closure | Composition of per-leaf findings into one artifact-level closure | Did this research close, taken as a whole? |
| `Self-application` | Self-application | One-step closure of RS over its own emissions | Can this research artifact itself be input to another RS invocation, and does the closure terminate? |

**Decomposition (cross-axis shared with Question per §3.8 MA-St3 self-check):** the structural transformation `Question → DecompositionTree` is owned at the Question axis (input form — `decompositionPolicy` field — drives the transformation at content time per RA2). Decomposition's positional state is shared with Question per the cross-axis discipline declared §3.8 (parallel to VS Aggregation sharing positional with Verdict). Sub-axis declared at §3.4 under Question.

**MECE verification:**
- Orthogonality: Input governs request reception (boundary inbound); Question governs the typed unknown + decomposition policy + emission-time capturedAt (input content + freeze-time snapshot); Finding governs per-leaf investigation outcomes (per-leaf truthValue + executionState + applicability + basis + sourceRefs); Source governs the citation set + admissibility (per-citation sourceKind + binding-criterion intersection); Closure governs the artifact-level aggregation derivation (how per-leaf findings + openQuestions compose); Self-application governs the closure idempotence (one-step recursion bound). No pair-overlap.
- Exhaustiveness: every `ResearchArtifactContent` field traces to exactly one RS-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.
- Cross-axis shared positional (Question ↔ Decomposition; declared per types.ts `ResearchQuestionPositional` comment "shared cross-axis with Decomposition per §3.8 MA-St3 self-check"): Decomposition's positional state is derived from Question completeness — declared cross-axis invariant per substrate §9 cross-axis-invariant rule, not duplication.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Input sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Input/authoringProgram` | Caller identity | `leaf-RA1-input-receipt` (covered by RA1) |
| `Input/binding` | ResearchBinding instance | `leaf-RA1-input-receipt` (covered by RA1) |
| `Input/priorKnowledge` | Forward-carried known surface | `leaf-RA1-input-receipt` (covered by RA1) — RA10 verbatim-carry verifies at content (Question/Finding/Closure axis flow); input-receipt verified at Input |

**Question sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Question/questionShape` | Input + content question form (RA9 verbatim + capturedAt) | `leaf-RA9-emission-freeze` (covered by RA9) |
| `Question/decomposition` | One-step Question → DecompositionTree per RA2 (cross-axis shared positional with Decomposition) | `leaf-RA2-decomposition` (covered by RA2) |
| `Question/decompositionPolicy` | Reference into binding.investigationMethods per RA6 | `leaf-RA6-binding-resolution` (covered by RA6) |

**Finding sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Finding/findings` | Per-leaf investigation entries | `leaf-RA3-finding-decomposition` |
| `Finding/oneToOne` | Cardinality match between leaves(decomposition) and findings | `leaf-RA3-finding-decomposition` (covered by RA3) |
| `Finding/decomposed-shape` | Each entry carries truthValue + executionState + applicability + basis + sourceRefs per F-cycle-1-3 | `leaf-RA3-finding-decomposition` (covered by RA3) |

**Source sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Source/citations` | Citations supplied per finding | `leaf-RA4-source-grounding` |
| `Source/admissibility` | Per-citation sourceKind ∈ binding.sourceCriteria.sourceKindAllowed | `leaf-RA4-source-grounding` (covered by RA4) |
| `Source/groundingClass` | Substrate §6.3 mechanical-criterion class binding per criterion | `leaf-RA4-source-grounding` (covered by RA4) |

**Closure sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Closure/all-resolved` | All-resolved derivation rule (RA5) | `leaf-RA5-closure-aggregation` |
| `Closure/vacuous-closure` | Empty findings vacuous-closure-on-empty-leaves per substrate §6.3 cardinality | `leaf-RA5-closure-aggregation` (covered by RA5) |

**Self-application sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Self-application/closure` | One-step closure of RS over ResearchArtifactContent | `leaf-RA8-self-application` |
| `Self-application/well-formedness` | ResearchArtifactContent satisfies ResearchInput shape under RA1 when re-input to RS (priorKnowledge.artifactRefs ⊇ [ref(R)]) | `leaf-RA8-self-application` (covered by RA8) |
| `Self-application/recursion-bound` | One-step descent only; deeper recursion is consumer-owned (per §1 scopeOut) | `leaf-RA8-self-application` (covered by RA8) |

**Question ↔ priorKnowledge cross-axis (RA10 binding):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Question/priorKnowledge` | priorKnowledge KnowledgeContext verbatim from input per RA10 (cross-axis: bridges Input/priorKnowledge inbound to content emission) | `leaf-RA10-priorKnowledge-verbatim` (covered by RA10) |

**Closure ↔ binding cross-axis (RA7 binding):**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Closure/immutability` | Post-emission re-research produces new researchVersion + new researchId; full content immutability propagated from AS v2.2 ArA5 | `leaf-RA7-immutability` (covered by RA7) |

**Sub-axis attachment note:** Several sub-axes share the same axiom-anchored leaf because the axiom condition is unitary at the axis level (e.g., RA1 covers Input/authoringProgram + Input/binding + Input/priorKnowledge jointly via input shape conformance; RA3 covers Finding/findings + Finding/oneToOne + Finding/decomposed-shape jointly via finding decomposition). This is the same pattern VS §3.6 establishes (VA1 covers Input/authoringProgram + Input/binding + Input/target jointly) and Plan v2.2 §3.6 establishes (PA3 covers Intent/inputContract + Intent/outputContract jointly; PA8 covers Intent/role + Intent/tierHint + Capacity/tierLimit + Limit/perSet/domainFailsafes jointly). MA-St2 leaf-atomicity satisfied: one leaf per axiom condition; sub-axes provide the structural decomposition for §3.8 universal-variables purposes; axiom binding is at the axiom-condition level per G-M1.

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-RA1-input-receipt` | `axiom` | `ResearchInput shape conformance: input has authoringProgram (programId + programVersion: Semver), userId, turnId, binding (ResearchBinding shape), question (ResearchQuestionInput shape with questionId + questionText length ≥ 1 + decompositionPolicy), priorKnowledge (KnowledgeContext shape with artifactRefs: NodeId[] + scopeBoundary nullable) — per RA1 structural property predicate` |
| `leaf-RA2-decomposition` | `axiom` | `Decomposition tree depth = 1 at v1.0: content.decomposition.rootQuestionId === content.question.questionId; subQuestions has at most one entry keyed by rootQuestionId; when binding.investigationMethods[input.question.decompositionPolicy].methodKind === 'decomposition', subQuestions[rootQuestionId] is non-empty; when methodKind ∈ {'lookup', 'derivation', 'synthesis'}, subQuestions[rootQuestionId] may be [] (root-as-leaf per RA3) — per RA2 structural property` |
| `leaf-RA3-finding-decomposition` | `axiom` | `keys(content.findings) === leaves(content.decomposition) ∪ rootSet(methodKind) (set equality, one-to-one) where leaves(decomposition) = subQuestions[rootQuestionId] when non-empty AND rootSet(methodKind) = {rootQuestionId} when methodKind ∈ {'lookup', 'derivation', 'synthesis'} else ∅ AND ∀ lid: content.findings[lid] has populated {findingRef, truthValue, executionState, applicability, basis (non-null when applicability='n/a' per MA-V11), resolvedContent (non-null when truthValue='resolved' per binding.knowledgeSchema), sourceRefs (non-empty when truthValue='resolved' per RA4), failureDetail (non-null when truthValue='unresolved'), investigatedAt} per F-cycle-1-3 decomposition + S4 binary truth-value — per RA3 cardinality + structural property` |
| `leaf-RA4-source-grounding` | `axiom` | `For every leaf finding with truthValue='resolved': finding.sourceRefs is non-empty AND for every ref ∈ finding.sourceRefs: ref.citationId resolves to an entry in content.sources AND content.sources[ref.citationId].sourceKind ∈ binding.sourceCriteria.flatMap(c => c.sourceKindAllowed) AND ∃ criterion ∈ binding.sourceCriteria: content.sources[ref.citationId].sourceKind ∈ criterion.sourceKindAllowed AND criterion.groundingClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'} (substrate §6.3 six-class enum) — per RA4 reference resolution + structural property` |
| `leaf-RA5-closure-aggregation` | `axiom` | `content.closure.truthValue derivation: 'closed' iff (content.findings empty AND content.closure.aggregationBasis declares vacuous-closure AND content.openQuestions = []) OR (∀ lid ∈ keys(content.findings): findings[lid].truthValue === 'resolved' AND findings[lid].applicability === 'applicable' AND content.openQuestions = []); 'open' iff every lid satisfies findings[lid].truthValue === 'unresolved' OR findings[lid].executionState === 'not-yet-investigated'; 'partial' iff some leaf is resolved AND some is unresolved or not-yet-investigated; null iff any findings[lid].executionState === 'not-yet-investigated' AND no lid has truthValue === 'resolved'; content.closure.unresolvedQuestionIds populated when truthValue ∈ {'open', 'partial'} as the subset of leaves with truthValue !== 'resolved' — per RA5 structural property (derived-field correctness predicate)` |
| `leaf-RA6-binding-resolution` | `axiom` | `content.binding === input.binding (verbatim, byte-identical) AND content.producedBy === input.authoringProgram (verbatim) AND input.question.decompositionPolicy resolves to a method in content.binding.investigationMethods[*].methodId AND every failsafe key referenced in binding.failsafes resolves within binding.failsafes AND every SourceCriterion in binding.sourceCriteria has groundingClass ∈ substrate §6.3 six-class enum — per RA6 reference resolution (multi-source closure)` |
| `leaf-RA7-immutability` | `axiom` | `Once a ResearchArtifactContent R is emitted (captured as AS companion data), R is immutable. Re-research produces a new ResearchArtifactContent with a new researchId and new researchVersion. Mutation attempts on R's fields (binding, question, priorKnowledge, decomposition, findings, openQuestions, sources, closure, researchId, researchVersion, producedBy, producedAt) are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). — per RA7 structural property (mutation-rejection predicate on persisted content; propagated from AS v2.2 ArA5)` |
| `leaf-RA8-self-application` | `axiom` | `ResearchArtifactContent satisfies ResearchInput when its own shape is wrapped: a well-formed ResearchArtifactContent R is a valid ResearchInput source for a subsequent RS invocation where R'.priorKnowledge.artifactRefs ⊇ [ref(R)] AND R'.question is some new ResearchQuestionInput (caller-supplied) AND R'.binding satisfies RA1 ResearchBinding shape. The re-invocation produces R'' whose findings investigate against R as part of priorKnowledge. Recursion bound: RS guarantees one-step closure (R → R'') only; descent R'' → R''' is consumer-owned per §1 scopeOut — per RA8 reference resolution + structural property. F-discover D-RS-RA8-SYNTHESIS resolution: G-RS8 synthesizes a notional re-input from content (priorKnowledge.artifactRefs ⊇ [ref(R)]), runs G-RS1 over it, returns OK iff structurally valid; does NOT actually re-invoke RS (one-step closure is structural, not procedural).` |
| `leaf-RA9-emission-freeze` | `axiom` | `content.question.questionId === input.question.questionId (verbatim) AND content.question.questionText === input.question.questionText (verbatim, byte-identical) AND content.question.decompositionPolicy === input.question.decompositionPolicy (verbatim) AND content.question.capturedAt is a non-null EpochMs populated at emission (question snapshot timestamp present) — per RA9 structural property (verbatim-carry triple + non-null timestamp)` |
| `leaf-RA10-priorKnowledge-verbatim` | `axiom` | `content.priorKnowledge === input.priorKnowledge (byte-identical) AND content.priorKnowledge conforms to KnowledgeContext typed shape (artifactRefs: NodeId[]; scopeBoundary nullable per A-17 positive empty-shape) — per RA10 structural property (forward-carried known surface; verbatim-carry parallel to AS ArA7 payload-verbatim and VS VA3 evidence-verbatim)` |

### §3.6 P4 Axiom instances (RA1..RA10)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). One axiom per RS-local axis (1:1 base mapping), with RA8 closing self-application as the epistemic-mode-specific invariant + RA10 binding cross-axis through Question/priorKnowledge to close the input verbatim-carry symmetric to RA9 question-freeze.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **RA1** | `Input` / `leaf-RA1-input-receipt` | Every `ResearchInput` consumed by RS conforms to the typed shape declared at §2.1: `authoringProgram.{programId, programVersion}`, `userId`, `turnId`, `binding: ResearchBinding`, `question: ResearchQuestionInput` with `questionText.length ≥ 1`, `priorKnowledge: KnowledgeContext` — all populated. | structural property (field presence per §2.1 schema; cardinality on questionText length) |
| **RA2** | `Question` (via `Question/decomposition` sub-axis; cross-axis shared positional with `Decomposition` per §3.8 MA-St3) / `leaf-RA2-decomposition` | `content.decomposition.rootQuestionId === content.question.questionId`. `content.decomposition.subQuestions` has at most one entry, keyed by `rootQuestionId`. When `binding.investigationMethods[input.question.decompositionPolicy].methodKind === 'decomposition'`, `subQuestions[rootQuestionId]` is non-empty (length ≥ 1). When `methodKind ∈ {'lookup', 'derivation', 'synthesis'}`, `subQuestions[rootQuestionId]` may be `[]` and `rootQuestionId` is itself the leaf per RA3 root-as-leaf rule. Multi-level decomposition (Q → Q′ → Q″) is consumer-owned per §1 scopeOut. | structural property (cardinality at top-level + reference resolution to binding methodKind) |
| **RA3** | `Finding` / `leaf-RA3-finding-decomposition` | `keys(content.findings)` equals `leaves(content.decomposition) ∪ rootSet(methodKind)` (one-to-one set equality), where `leaves(decomposition) = subQuestions[rootQuestionId]` when non-empty AND `rootSet(methodKind) = {rootQuestionId}` when `methodKind ∈ {'lookup', 'derivation', 'synthesis'}` else `∅`. For every `lid` in keys: `content.findings[lid]` has populated fields `{findingRef, truthValue ∈ {'resolved', 'unresolved', null}, executionState ∈ {'not-yet-investigated', 'investigated'}, applicability ∈ {'applicable', 'n/a'}, basis (non-null when applicability='n/a' per MA-V11), resolvedContent (non-null when truthValue='resolved'; conforms to binding.knowledgeSchema), sourceRefs (non-empty when truthValue='resolved' per RA4), failureDetail (non-null when truthValue='unresolved'), investigatedAt}` per substrate §10.1 S4 + cycle-1 F-cycle-1-3 decomposition. | cardinality + structural property (set equality + per-entry field presence) |
| **RA4** | `Source` (cross-axis with `Finding` for grounding closure) / `leaf-RA4-source-grounding` | For every leaf finding `f` with `f.truthValue === 'resolved'`: `f.sourceRefs` is non-empty AND for every `ref ∈ f.sourceRefs`: `ref.citationId` resolves to an entry in `content.sources` AND `content.sources[ref.citationId].sourceKind ∈ binding.sourceCriteria.flatMap(c => c.sourceKindAllowed)` AND there exists `criterion ∈ binding.sourceCriteria` such that `content.sources[ref.citationId].sourceKind ∈ criterion.sourceKindAllowed` AND `criterion.groundingClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'}` (substrate §6.3 six-class enum). | reference resolution (groundingClass enum + sourceKind-criterion intersection + citationId resolution) + structural property (sourceRefs cardinality on resolved findings) |
| **RA5** | `Closure` / `leaf-RA5-closure-aggregation` | `content.closure.truthValue` is derived from `content.findings` + `content.openQuestions` per the all-resolved rule: `'closed'` iff (`content.findings` is empty AND `content.closure.aggregationBasis` declares vacuous-closure per substrate §6.3 cardinality semantics AND `content.openQuestions = []`) OR (every `lid` in keys satisfies `findings[lid].truthValue === 'resolved'` AND `findings[lid].applicability === 'applicable'` AND `content.openQuestions = []`); `'open'` iff every `lid` satisfies `findings[lid].truthValue === 'unresolved'` OR `findings[lid].executionState === 'not-yet-investigated'`; `'partial'` iff some leaf is resolved AND some is unresolved or not-yet-investigated; `null` iff any `findings[lid].executionState === 'not-yet-investigated'` AND no `lid` has `truthValue === 'resolved'`. `content.closure.unresolvedQuestionIds` populated when `truthValue ∈ {'open', 'partial'}` as the subset of leaves with `truthValue !== 'resolved'`. `content.openQuestions` cardinality matches `unresolvedQuestionIds`. | structural property (derived-field correctness predicate) |
| **RA6** | `Question` (cross-axis with `Source` + `Closure` for binding-resolution closure) / `leaf-RA6-binding-resolution` | `content.binding === input.binding` (verbatim, byte-identical), AND `content.producedBy === input.authoringProgram` (verbatim — producedBy invariant), AND `input.question.decompositionPolicy` resolves to `methodId` of some method in `content.binding.investigationMethods`, AND every failsafe key referenced in `binding.failsafes` resolves within `binding.failsafes`, AND every `SourceCriterion` in `binding.sourceCriteria` has `groundingClass ∈ substrate §6.3 six-class enum`. | reference resolution (multi-source closure) |
| **RA7** | `Closure` (immutability scope spans full content per AS ArA5 propagation) / `leaf-RA7-immutability` | Once a `ResearchArtifactContent R` is emitted (captured as AS companion data), `R` is immutable. Re-research produces a new `ResearchArtifactContent` with a new `researchId` and new `researchVersion`. Mutation attempts on `R`'s fields (`binding`, `question`, `priorKnowledge`, `decomposition`, `findings`, `openQuestions`, `sources`, `closure`, `researchId`, `researchVersion`, `producedBy`, `producedAt`) are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). | structural property (mutation-rejection predicate on persisted content; propagated from AS v2.2 ArA5) |
| **RA8** | `Self-application` / `leaf-RA8-self-application` | A well-formed `ResearchArtifactContent R` is a valid `ResearchInput` source for a subsequent RS invocation: RS invoked with `input.priorKnowledge.artifactRefs ⊇ [ref(R)]` AND `input.question` a caller-supplied `ResearchQuestionInput` (new question; the re-invocation investigates a new unknown against R as part of prior knowledge) AND `input.binding` satisfies the `ResearchBinding` shape under RA1. The closure is one-step: R → R''. Deeper descent (R'' → R''') is consumer-owned per §1 scopeOut and is not an RS invariant. F-discover D-RS-RA8-SYNTHESIS implementation pattern: G-RS8 synthesizes a notional re-input from content, runs G-RS1 over it, returns OK iff structurally valid; does NOT actually re-invoke RS (closure is structural, not procedural — parallel to F-verify D-VA9-SYNTHESIS pattern at the VS-side). | reference resolution (R structurally reachable as input.priorKnowledge.artifactRefs entry under RA1) + structural property (one-step closure termination) |
| **RA9** | `Question` / `leaf-RA9-emission-freeze` | `content.question.questionId === input.question.questionId` (verbatim reference carry), `content.question.questionText === input.question.questionText` (verbatim, byte-identical), `content.question.decompositionPolicy === input.question.decompositionPolicy` (verbatim), AND `content.question.capturedAt` is a non-null `EpochMs` populated at emission (question snapshot timestamp present). | structural property (verbatim-carry triple + non-null timestamp) |
| **RA10** | `Input` (cross-axis with `Question/priorKnowledge` for content-side binding) / `leaf-RA10-priorKnowledge-verbatim` | `content.priorKnowledge === input.priorKnowledge` (byte-identical, verbatim carry; parallel to AS v2.2 ArA7 payload-verbatim and VS v1.0 VA3 evidence-verbatim), AND `content.priorKnowledge` conforms to the typed shape `KnowledgeContext = {artifactRefs: NodeId[], scopeBoundary: {kind: string, ref: NodeId} | null}`. `scopeBoundary: null` permitted per A-17 positive empty-shape for the first investigation in a chain. | structural property (identity over input.priorKnowledge + typed-shape conformance) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. RA2 attaches at `Question` with cross-axis shared positional declared at Decomposition (parallel to VS VA5 cross-axis derivation note); RA4 attaches at `Source` with cross-axis closure note at `Finding` (resolved findings grounded); RA6 attaches at `Question` with cross-axis closure to `Source` + `Closure` (binding resolution scope); RA7 attaches at `Closure` (immutability scopes the persisted content under that closure — parallel to VS VA8 attaching at Verdict); RA10 attaches at `Input` with cross-axis to `Question/priorKnowledge` (content-side verbatim verification). MA-St11 cross-axis-invariant declared at substrate §9 permits this; G-G13 cross-axis universal at metaframework §3.2.1 governs. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set is the v1.0 baseline (no predecessor — RS v1.0 is fresh L3 framework per §1.1 GenesisDeclaration). RA1..RA10 declared once; future versions amend additively per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "RS Mode = epistemic per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). RS has zero P8 instances per substrate §8.6 empty-declaration derivation.

   Scope note: RS's research-composition pipeline is owned upstream by the authoring program (pre-schema.input). RS declares the typed shape that pipeline produces (ResearchArtifactContent); it does not declare the procedure that produces it. F-discover SLICE.md 'Composition Path' section declares the runtime pipeline at the L4 slice level (G-RS1 input gate → mechanical compose per RA1..RA10 → G-RS1..G-RS10 fail-fast → AS v2.2 createArtifact emission); this entire pipeline is L4 slice work, not RS's P8. RS's emission-time validity is enforced mechanically by the RA1..RA10 gate bundle at the AS v2.2 carrier invocation site (§6.11) — that gate execution is AS's P8 S2, not RS's P8.

   Spec §Constraints language ('P8 declaration permitted but not required; if declared, justify per PR4/PR5') is resolved under substrate precedence: P8 is structurally absent for RS. PR4 (stage monotonicity) and PR5 (stage-content-kind alignment) do not apply to an empty set. This pattern parallels VS v1.0 §3.7 P8 empty-declaration (verificative) + Plan v2.2 §3.7 P8 empty-declaration (structural), substituting epistemic for verificative/structural.

   Build-time decision (D-RS-P8-EMPTY, see §10): brief §4 lists three procedure-step S1/S2/S3 candidates (input validation; investigation execution; emission via AS). Substrate §8.3 Mode=generative-only binding overrides that directive; the three steps brief §4 names are L4 slice work owned by F-discover, not RS P8."
}
```

PR4 / PR5 self-checks vacuous (empty P8 set).


### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four universal variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Input` | `Semver` (bound to `ResearchArtifactContent.researchVersion` — input shape stamped at emission per RA9 + RA10) | `string` enum (extensible) `'F-discover' \| <future-research-authoring-program>` (bound to `ResearchInput.authoringProgram.programId`) | `ResearchInput.binding: ResearchBinding` paired with `ResearchInput.priorKnowledge: KnowledgeContext` (dual reference per input — binding identifies the verifier-contract, priorKnowledge identifies the forward-carried known surface) | `ResearchShapePositional` enum `'pending' \| 'received' \| 'rejected'` (declared §3.9 vocabulary) |
| `Question` | `EpochMs` (bound to `ResearchArtifactContent.question.capturedAt` — question snapshot timestamp at emission per RA9) | `DecompositionPolicyRef` (string identifier resolving into `binding.investigationMethods[*].methodId` per RA6; reference-resolution by RA6 binding + RA2 methodKind enum branch determines tree shape) | `ResearchQuestionInput` paired with `ResearchQuestionContent` (input-form to content-form pair via RA9 verbatim-carry triple; `ResearchQuestionInput.questionId === ResearchQuestionContent.questionId`) | `ResearchQuestionPositional` enum `'declared' \| 'decomposing' \| 'decomposed'` (declared §3.9; **shared cross-axis with Decomposition** per types.ts line 228 + §3.3 cross-axis shared positional declaration) |
| `Finding` | `EpochMs` (bound to `findings[].investigatedAt` per entry — per-leaf investigation timestamp) | `'resolved' \| 'unresolved' \| null` (per-leaf truthValue per substrate §10.1 S4 binary; null only when executionState='not-yet-investigated' per F-cycle-1-3 decomposition) | `QuestionId` (key into `findings`) paired with `QuestionId` (in `subQuestions[rootQuestionId] ∪ rootSet(methodKind)` — leaves(decomposition); RA3 one-to-one set equality) | `ResearchFindingPositional` enum `'declared' \| 'investigating' \| 'investigated'` (declared §3.9; complete iff every finding executionState='investigated') |
| `Source` | `EpochMs` (bound to `sources[].capturedAt` per entry — per-citation timestamp) | `SourceKind` enum `'graph-node' \| 'external-uri' \| 'authoring-input'` (per-citation source-kind taxonomy; intersection with `binding.sourceCriteria.sourceKindAllowed` is the per-binding admissibility scope per RA4) | `CitationId` (key into `content.sources`) paired with `SourceCriterion` (resolves into `binding.sourceCriteria` per RA4 admissibility intersection) | `ResearchSourcePositional` enum `'declared' \| 'captured'` (declared §3.9) |
| `Closure` | `Semver` (bound to `ResearchArtifactContent.researchVersion` — aggregation rule version-stamped at emission) | `ResearchAggregationKind` enum `'all-resolved-with-vacuous-closure-on-empty-leaves'` (single member at v1.0; additive per S3 — future kinds enter via amendment when first L4 tenant requires) | `ResearchArtifactContent.findings: FindingResultMap` paired with `ResearchArtifactContent.closure.truthValue: 'closed' \| 'open' \| 'partial' \| null` (input-pair derivation: findings + openQuestions aggregates into closure per RA5 derivation predicate) | `ResearchClosurePositional` enum `'pending' \| 'partial' \| 'complete'` (declared §3.9; complete iff every finding executionState='investigated') |
| `Self-application` | `Semver` (bound to `ResearchArtifactContent.researchVersion` of the inner R; outer R'' carries its own version) | `string` (sourceKind branch `'graph-node'` for the synthesized inner-R reference at `priorKnowledge.artifactRefs[i] = ref(R)` — the self-application is structurally a graph-node reference into the prior R) | `ResearchArtifactContent R` paired with `ResearchArtifactContent R''` where `R''.priorKnowledge.artifactRefs ⊇ [ref(R)]` (input-output structural pair per RA8 one-step closure) | `ResearchSelfApplicationPositional` enum `'base' \| 'self-applied' \| 'recursive-deferred'` (declared §3.9; `base` for first-tier research; `self-applied` for one-step closure; `recursive-deferred` for descent beyond one step, owned by consumer per §1 scopeOut) |

Every cell is a named type, an enum literal set, an inlined type shape, or a declared type-to-type paired reference. No prose cells. No arrow notation at the content level (relational column uses named-type-to-named-type declarations via explicit field references).

**MA-St3 self-check:** no content appears under more than one axis. Question and Decomposition share `ResearchQuestionPositional` as Positional declaration with explicit cross-axis reuse note (Decomposition's positional state is derived from Question completeness — declared cross-axis invariant per substrate §9 cross-axis-invariant rule, not duplication; types.ts line 228 declares this cross-axis sharing at the type-level comment authoritatively). Cross-axis bindings: RA10 attaches at Input axis with cross-axis verification at Question/priorKnowledge (content side); RA4 attaches at Source axis with cross-axis closure at Finding (resolved findings grounded); RA6 attaches at Question with cross-axis closure to Source + Closure (binding resolution scope); RA7 attaches at Closure with cross-axis scope across full content (immutability propagates). All cross-axis attachments declared, none duplicate content. Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `investigation-step` | §1 primitive | atomic unit of work in RS: one investigation against one leaf-question producing one FindingResultEntry; framework-local atomic operation analogous to VS's `predicate-evaluation` and Plan's `declaration` |
| `research` | §2.2 output | act of receiving a question + binding + prior knowledge, decomposing per RA2 (one-step), producing a FindingResultMap per RA3, grounding resolved findings per RA4, and aggregating per RA5 into a closure; emitted as one `ResearchArtifactContent` |
| `ResearchBinding` | §2.2 + `research-standard.types.ts` | RS-defined type shape; domain standard fills instance values; captured verbatim at emission per RA6 |
| `InvestigationMethod` | §2.7 + `research-standard.types.ts` | typed shape per RA2 + RA6: `{methodId, methodKind, decompositionRule}`; one entry per method in `binding.investigationMethods` |
| `investigation method set` | §3.3 `Question/decompositionPolicy` | array of `InvestigationMethod` instances supplied by `ResearchBinding`; cardinality unbounded; methodIds unique within set |
| `decomposition` | §3.3 `Question/decomposition` | one-step Question → DecompositionTree structural transformation per RA2; depth = 1 at v1.0 (consumer owns multi-level descent per §1 scopeOut) |
| `prior knowledge` | §3.3 `Input/priorKnowledge` (cross-axis to Question) | data forward-carried from upstream investigation chains; typed per `KnowledgeContext`; verbatim-carried per RA10 (parallel to AS ArA7 payload-verbatim and VS VA3 evidence-verbatim) |
| `finding` | §3.3 `Finding/findings` | per-leaf investigation outcome: `{findingRef, truthValue, executionState, applicability, basis, resolvedContent, sourceRefs, failureDetail, investigatedAt}` per RA3 cycle-1-decomposed shape |
| `source citation` | §3.3 `Source/citations` | per-citation grounding entry: `{citationId, sourceKind, reference, capturedAt}` per RA4; admissibility verified by RA4 intersection with `binding.sourceCriteria.sourceKindAllowed` |
| `closure` | §3.3 `Closure` | artifact-level aggregation: `{truthValue ∈ {'closed', 'open', 'partial', null}, aggregationBasis, unresolvedQuestionIds}` derived from `findings + openQuestions` per RA5 |
| `aggregation rule` | §3.3 `Closure/all-resolved` | derivation procedure mapping `findings + openQuestions` → `closure.truthValue` per RA5; v1.0 declares one rule (`'all-resolved-with-vacuous-closure-on-empty-leaves'`); enum extensible per S3 |
| `re-research` | §3.6 RA7 | production of a new `ResearchArtifactContent` with new `researchId` + new `researchVersion` in response to upstream change (e.g., new question against same priorKnowledge chain, binding amended); old content remains immutable per RA7 |
| `self-application closure` | §3.6 RA8 | one-step idempotence of RS over `ResearchArtifactContent`: R → R'' where R'' investigates a new question with R as part of priorKnowledge; recursion bound at one step (consumer owns descent) |
| `priorKnowledge` | §2.1 `ResearchInput.priorKnowledge` field + §2.2 `ResearchArtifactContent.priorKnowledge` field | reference set + scope boundary describing the forward-carried known surface; required at input; verbatim-carried into content per RA10 |
| `decompositionPolicy` | §2.1 + §2.2 `question.decompositionPolicy` field | string identifier resolving into `binding.investigationMethods[*].methodId` per RA6; mechanical: deterministic lookup per substrate §6.3 reference-resolution |
| `ResearchShapePositional` | §3.8 | enum `'pending' \| 'received' \| 'rejected'` — Input axis lifecycle position; RA1 input-shape gate determines transition |
| `ResearchQuestionPositional` | §3.8 | enum `'declared' \| 'decomposing' \| 'decomposed'` — Question axis lifecycle position (shared cross-axis with Decomposition per types.ts line 228 + §3.3 cross-axis declaration) |
| `ResearchFindingPositional` | §3.8 | enum `'declared' \| 'investigating' \| 'investigated'` — Finding axis lifecycle position; complete iff every leaf executionState='investigated' |
| `ResearchSourcePositional` | §3.8 | enum `'declared' \| 'captured'` — Source axis lifecycle position |
| `ResearchClosurePositional` | §3.8 | enum `'pending' \| 'partial' \| 'complete'` — Closure axis lifecycle position |
| `ResearchSelfApplicationPositional` | §3.8 | enum `'base' \| 'self-applied' \| 'recursive-deferred'` — Self-application axis lifecycle position |
| `ResearchAggregationKind` | §3.8 | enum `'all-resolved-with-vacuous-closure-on-empty-leaves'` (singleton at v1.0; additive per S3) |
| `SourceKind` | §3.8 + §2.7 + types.ts | enum `'graph-node' \| 'external-uri' \| 'authoring-input'` — per-citation source-kind taxonomy; bound to `SourceCitation.sourceKind` per RA4; intersection with `binding.sourceCriteria.sourceKindAllowed` is the per-binding admissibility scope |
| `GroundingClass` | §3.8 + §2.7 + types.ts | enum binding `SourceCriterion.groundingClass` to substrate §6.3 six-class taxonomy: `'type-check' \| 'enum-membership' \| 'reference-resolution' \| 'structural-property' \| 'cardinality' \| 'deterministic-function-result'`; identical shape to VS `PredicateGroundClass` per substrate §6.3 single authoritative enum (declared per-framework per A-08 discipline) |
| `InvestigationMethodKind` | §3.8 + §2.7 + types.ts | enum `'decomposition' \| 'lookup' \| 'derivation' \| 'synthesis'`; determines RA3 root-set membership: `methodKind === 'decomposition'` → `rootSet = ∅` (sub-questions are the leaves); `methodKind ∈ {'lookup', 'derivation', 'synthesis'}` → `rootSet = {rootQuestionId}` (root-as-leaf) |

---

## §4 Validity

### §4.1 Gate count

RS declares **10 own primary gates** (G-RS1 .. G-RS10, 1:1 with RA1..RA10 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates including cycle-1 G-S7+G-V11 and cycle-2 G-V10+G-S8+G-L11 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when RS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| RS-own axiom gates (G-RS*) | 10 | this §4.2 | framework-audit applies RA1..RA10 suite per MA-V1; emission-time on each ResearchArtifactContent |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test RS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **10 + 85 = 95** | | |

RS's own 10 gates are executed in addition to the 85 inherited — same pattern as VS v1.0 §4.1 + AS v2.2 §4.1 + Plan v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite). RS adds one more own gate than VS (10 vs 9) because RS has one more axiom (RA1..RA10 vs VA1..VA9) — RA10 closes the priorKnowledge verbatim-carry symmetric to RA9 question-freeze, an epistemic-mode-specific input-side invariant absent from verificative mode.

### §4.2 RS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 10 axioms → 10 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-RS1** | RA1 | `typeof input.authoringProgram.programId === 'string' AND typeof input.authoringProgram.programVersion === 'string' AND matches(input.authoringProgram.programVersion, semverRegex) AND typeof input.userId === 'string' AND typeof input.turnId === 'string' AND input.binding satisfies ResearchBinding shape AND input.question satisfies ResearchQuestionInput shape AND typeof input.question.questionId === 'string' AND typeof input.question.questionText === 'string' AND input.question.questionText.length >= 1 AND typeof input.question.decompositionPolicy === 'string' AND input.priorKnowledge satisfies KnowledgeContext shape AND Array.isArray(input.priorKnowledge.artifactRefs) AND (input.priorKnowledge.scopeBoundary === null OR (typeof input.priorKnowledge.scopeBoundary === 'object' AND typeof input.priorKnowledge.scopeBoundary.kind === 'string' AND typeof input.priorKnowledge.scopeBoundary.ref === 'string'))` | structural property (field presence + typed-shape conformance per §2.1; cardinality on questionText length) |
| **G-RS2** | RA2 | `content.decomposition.rootQuestionId === content.question.questionId AND typeof content.decomposition.subQuestions === 'object' AND keys(content.decomposition.subQuestions).length <= 1 AND (keys(content.decomposition.subQuestions).length === 0 OR keys(content.decomposition.subQuestions)[0] === content.decomposition.rootQuestionId) AND let m = content.binding.investigationMethods.find(im => im.methodId === input.question.decompositionPolicy); m !== undefined AND ((m.methodKind === 'decomposition' AND content.decomposition.subQuestions[content.decomposition.rootQuestionId] !== undefined AND content.decomposition.subQuestions[content.decomposition.rootQuestionId].length >= 1) OR (m.methodKind ∈ {'lookup', 'derivation', 'synthesis'}))` | structural property (cardinality + reference resolution to binding methodKind) |
| **G-RS3** | RA3 | `let leaves = computeLeaves(content.decomposition); let rootSet = (let m = content.binding.investigationMethods.find(im => im.methodId === input.question.decompositionPolicy); m.methodKind ∈ {'lookup', 'derivation', 'synthesis'} ? {content.decomposition.rootQuestionId} : ∅); setEqual(keys(content.findings), leaves ∪ rootSet) === true AND forall lid ∈ keys(content.findings): let f = content.findings[lid]; f.findingRef === lid AND f.truthValue ∈ {'resolved', 'unresolved', null} AND f.executionState ∈ {'not-yet-investigated', 'investigated'} AND f.applicability ∈ {'applicable', 'n/a'} AND (f.applicability === 'n/a' implies f.basis !== null AND f.basis.length >= 1) AND (f.truthValue === 'resolved' implies f.resolvedContent !== null) AND (f.truthValue === 'resolved' implies Array.isArray(f.sourceRefs) AND f.sourceRefs.length >= 1) AND (f.truthValue === 'unresolved' implies f.failureDetail !== null) AND ((f.executionState === 'not-yet-investigated') === (f.truthValue === null)) AND typeof f.investigatedAt === 'number'` | cardinality + structural property (set equality + per-entry field presence + S4 + MA-V11 invariants) |
| **G-RS4** | RA4 | `forall lid ∈ keys(content.findings): let f = content.findings[lid]; (f.truthValue !== 'resolved') OR (Array.isArray(f.sourceRefs) AND f.sourceRefs.length >= 1 AND forall ref ∈ f.sourceRefs: typeof ref.citationId === 'string' AND content.sources[ref.citationId] !== undefined AND content.sources[ref.citationId].sourceKind ∈ {'graph-node', 'external-uri', 'authoring-input'} AND (let admittedKinds = content.binding.sourceCriteria.flatMap(c => c.sourceKindAllowed); content.sources[ref.citationId].sourceKind ∈ admittedKinds) AND exists criterion ∈ content.binding.sourceCriteria: content.sources[ref.citationId].sourceKind ∈ criterion.sourceKindAllowed AND criterion.groundingClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'})` | reference resolution (citationId resolution + sourceKind enum-criterion intersection + groundingClass enum) + structural property (sourceRefs cardinality on resolved findings) |
| **G-RS5** | RA5 | `let allFindings = content.findings; let allKeys = keys(allFindings); let isEmpty = allKeys.length === 0; let allInvestigated = forall lid: allFindings[lid].executionState === 'investigated'; let allResolved = allInvestigated AND forall lid: allFindings[lid].truthValue === 'resolved' AND allFindings[lid].applicability === 'applicable'; let allUnresolvedOrPending = forall lid: allFindings[lid].truthValue === 'unresolved' OR allFindings[lid].executionState === 'not-yet-investigated'; let someResolvedSomeNot = (exists lid: allFindings[lid].truthValue === 'resolved') AND (exists lid: allFindings[lid].truthValue !== 'resolved'); let anyPendingNoResolved = (exists lid: allFindings[lid].executionState === 'not-yet-investigated') AND NOT(exists lid: allFindings[lid].truthValue === 'resolved'); let unresolvedSubset = allKeys.filter(lid => allFindings[lid].truthValue !== 'resolved'); let derivedTruthValue = isEmpty ? (content.closure.aggregationBasis declares vacuous-closure AND content.openQuestions.length === 0 ? 'closed' : null) : (allResolved AND content.openQuestions.length === 0 ? 'closed' : (anyPendingNoResolved ? null : (allUnresolvedOrPending ? 'open' : (someResolvedSomeNot ? 'partial' : null)))); content.closure.truthValue === derivedTruthValue AND ((content.closure.truthValue ∈ {'open', 'partial'}) implies setEqual(content.closure.unresolvedQuestionIds, unresolvedSubset)) AND setEqual(content.openQuestions, unresolvedSubset) AND typeof content.closure.aggregationBasis === 'string' AND content.closure.aggregationBasis.length >= 1` | structural property (derived-field correctness predicate) |
| **G-RS6** | RA6 | `byteIdentical(content.binding, input.binding) === true AND byteIdentical(content.producedBy, input.authoringProgram) === true AND exists m ∈ content.binding.investigationMethods: m.methodId === input.question.decompositionPolicy AND forall fk ∈ keys(content.binding.failsafes): typeof content.binding.failsafes[fk] === 'object' AND typeof content.binding.failsafes[fk].kind === 'string' AND typeof content.binding.failsafes[fk].predicate === 'string' AND forall c ∈ content.binding.sourceCriteria: c.groundingClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'}` | reference resolution (verbatim equality + multi-source closure + groundingClass enum) |
| **G-RS7** | RA7 | For persisted `ResearchArtifactContent` R: Living Memory mutation attempts on `R.binding`, `R.question`, `R.priorKnowledge`, `R.decomposition`, `R.findings`, `R.openQuestions`, `R.sources`, `R.closure`, `R.researchId`, `R.researchVersion`, `R.producedBy`, `R.producedAt` properties are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). At pre-emission validation time G-RS7 is **vacuous-pass** per F-discover D-RS-RA7-PREEMISSION (mirrors VS D-VA8-PREEMISSION + Plan PA9): the post-emission mutation-rejection invariant is enforced by AS v2.2 ArA5 at the companion node, which only exists post-emission; pre-emission there is no persisted R to mutate, so the universal quantification is vacuously satisfied per substrate §6.3 cardinality semantics with applicability='applicable' AND truthValue='passed' AND basis citing 'AS v2.2 ArA5 enforces post-emission; vacuous-pass at pre-emission per D-RS-RA7-PREEMISSION'. | structural property (mutation-rejection propagated from AS v2.2 ArA5; vacuous at pre-emission per §6.3 cardinality) |
| **G-RS8** | RA8 | `let R = content; let Rprime_input = synthesizeResearchInput(R); Rprime_input.priorKnowledge.artifactRefs.includes(ref(R)) === true AND validateInputShape(Rprime_input) === true (per RA1 / G-RS1) AND oneStepClosureTerminates(R, Rprime_input) === true (mechanical: re-invocation of RS on Rprime_input produces a finite ResearchArtifactContent R'' without re-entering R''')`. F-discover D-RS-RA8-SYNTHESIS implementation: synthesize a notional re-input from content (priorKnowledge.artifactRefs ⊇ [ref(R)]), run gateRS1 over it, return OK iff structurally valid; does NOT actually re-invoke RS (one-step closure is structural, not procedural — parallel to F-verify D-VA9-SYNTHESIS). | reference resolution (R structurally reachable as priorKnowledge.artifactRefs entry under RA1) + structural property (one-step closure termination predicate) |
| **G-RS9** | RA9 | `content.question.questionId === input.question.questionId AND content.question.questionText === input.question.questionText AND content.question.decompositionPolicy === input.question.decompositionPolicy AND typeof content.question.capturedAt === 'number' AND content.question.capturedAt > 0` | structural property (verbatim-carry triple + non-null timestamp) |
| **G-RS10** | RA10 | `byteIdentical(content.priorKnowledge, input.priorKnowledge) === true AND typeof content.priorKnowledge === 'object' AND Array.isArray(content.priorKnowledge.artifactRefs) AND forall r ∈ content.priorKnowledge.artifactRefs: typeof r === 'string' AND (content.priorKnowledge.scopeBoundary === null OR (typeof content.priorKnowledge.scopeBoundary === 'object' AND typeof content.priorKnowledge.scopeBoundary.kind === 'string' AND typeof content.priorKnowledge.scopeBoundary.ref === 'string'))` | structural property (identity over input.priorKnowledge + typed-shape conformance) |

**G-M1 self-check:** 10 axioms → 10 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Input has 2 gates (G-RS1, G-RS10 — RA10 attaches at Input cross-axis); Question has 3 gates (G-RS2, G-RS6, G-RS9 — RA2/RA6/RA9 all attach at Question with cross-axis to Decomposition/Source/Closure); Finding has 1 gate (G-RS3); Source has 1 gate (G-RS4); Closure has 2 gates (G-RS5, G-RS7 — RA7 attaches at Closure cross-axis with full content scope); Self-application has 1 gate (G-RS8). Every RS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs RS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests RS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests RS's §2 Schema conformance to MA-S1..MA-S8 (cycle-2 G-S8 ReferentCitation declaration shape conformance — RS declares `referentCitations: []` per §1; G-S8 vacuous-pass).
- **E3 Structure (PG3 + G-St1..G-St16):** tests RS's §3 Structure conformance to MA-St1..MA-St16.
- **E4 Validity (PG4 + G-V1..G-V11):** tests RS's §4 Validity conformance to MA-V1..MA-V11 (cycle-2 G-V10 spec↔referent + cycle-1 G-V11 applicability-basis vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests RS's §5 Lifecycle conformance to MA-L1..MA-L11 (cycle-2 G-L11 audit-run snapshot stamping vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests RS's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests RS's §7 Judgment conformance to MA-J1..MA-J5 (P7=0 empty-declared per §3.2 + §7.1).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests RS's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus RS's own 10 G-RS* gates execute against the emitted `ResearchArtifactContent` at emission time (and at framework-audit re-verification). Total per-audit framework-tier gates when RS is target: 95 (85 + 10).

**Disambiguation note on gate execution scope:**
The 85 inherited gates test RS's **framework declaration conformance** (does RS's §1–§7 structure match metaframework's axioms?). The 10 G-RS* gates test **individual ResearchArtifactContent instance conformance** (does a given emitted research artifact satisfy RA1..RA10?). Different scopes, different execution sites — the 85 run at framework-audit time against this file; the 10 run at emission-time on each ResearchArtifactContent the authoring program produces.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover RS's validity surfaces:

| Dimension | RS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=0 empty-declared mechanical); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (10 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-RS3 to AS v2.2 |
| X10 (Stage-declaration extended predicate) | §3.7 empty-P8 declaration + its basis traversal per substrate §10.2 PR4/PR5 vacuous |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 10 RS-own (G-RS*) = 79.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to RS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 95 framework-tier gates (85 inherited + 10 RS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0-confirmation (§5.3). Per F-discover SLICE.md "Sprint 5 Close Criteria Coverage": "First end-to-end emission" + "G-RS1..G-RS10 first-run" + "L0 confirmation of first-run" all deferred to Sprint 8 per L0 directive (RS spec §5.4). When RS's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7) per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11). RS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

Gate IDs enumerated:

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

RS-own (10): `G-RS1, G-RS2, G-RS3, G-RS4, G-RS5, G-RS6, G-RS7, G-RS8, G-RS9, G-RS10`.

Substrate-tier gates (SG1–SG5) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). RS is a fresh L3 framework with no predecessor (per §1.1 GenesisDeclaration `predecessorVersion: null`). Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: ten axioms (RA1..RA10) declared; ResearchBinding shape declared with zero domain instances at v1.0 deployed-spec level (F-discover slice supplies LIV-architecture smoke binding at Sprint 5 close per F-discover SLICE.md D-RS-BINDING-V1; full domain bindings deferred per natural-defer rule (Playbook §1.21)); `referentCitations: []` declared with basis per VS v1.0 + Cognitive v1.2.2 precedent; carrier pinned to Artifact Standard v2.2 (structural symmetry with VS v1.0 + Plan v2.2 — all three mode-primitive L3 siblings carriered through AS at the same version). Generation path: generation-procedure-v1-0 v1.1.6 S1–E8 template-generation under metaframework-v3-1 v3.2.7. R5 atom file (`research-standard.types.ts`, 680 lines, 47 RA-references) deployed at Sprint 5 HEAD `9862092` ahead of this spec md; spec md authored at Sprint 5.5 Shot 1 closes the strict-functional-rule gap surfaced by types.ts line 73 canonical-spec marker.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 5.5 pre-Sprint-6 standards completion per Sprint 5.5 Shot 1 dispatch brief. Driving findings: (i) Sprint 5 HEAD `9862092` deployed F-discover slice + R5 atom file but never authored the spec md, leaving the `// Canonical spec: src/core/standards/research-standard.md` marker pointing at a non-existent file (Playbook §1.20 strict-functional-rule violation surfaced at sprint-5 close audit); (ii) VS v1.0 + Plan v2.2 + M-I v2.3 + Cognitive v1.2.2 all closed at prior cycles establishing the L3 mode-primitive triad (verificative + structural + generative-equivalents); the epistemic-mode L3 sibling completes the four-mode framework set (epistemic + structural + generative + verificative per metaframework §1 four-mode taxonomy); (iii) cycle-2 spec↔referent infrastructure (substrate v1.6 atoms A-18/A-19/A-20 + MF v3.2.7 axioms MA-V10/MA-S8/MA-L11) is available — RS authored against it consumes the slot from inception rather than retrofitting; (iv) F-discover slice is the first L4 tenant of RS v1.0 and its Composition Path declares the runtime pipeline that this spec md formalizes the contract for.

### §5.3 Confirmation gate

Pending L0 at v1.0 closure. Monotonic per MA-L3. Sprint 5.5 Shot 1 dispatch brief §10 declares: "L0 reviews Shot 1 output. Confirms or returns with amendments. Sprint 5.5 Shot 2 (Design Standard authoring) does not dispatch until L0 confirms RS spec md."

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery. D-rows recorded in §10 cover build-time decisions resolved against substrate / types.ts / VS+Plan precedent without escalation.

### §5.5 Judgment deprecations

Empty at delivery. RS declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| Input receipt (HR-RS1 / HR-RS2) | Schema violation on `ResearchInput` or `ResearchBinding` shape | authoring program returns `Result { ok: false, error: ResearchValidityError { code: 'RESEARCH_INPUT_INVALID' } }`; no AS emission invoked |
| Emission-time validity (G-RS1..G-RS10) | Any G-RS* gate fails on proposed `ResearchArtifactContent` | authoring program returns `Result { ok: false, error: ResearchValidityError { code: 'RESEARCH_VALIDITY_FAILED', failedAxiom: 'RA<n>' } }`; no AS emission invoked |
| Carrier emission (HR-RS3 → AS v2.2) | AS v2.2 gate failure (G-Ar*, PG*, G-U*, G-M*) | AS returns `ArtifactError`; authoring program surfaces as `ResearchValidityError { code: 'RESEARCH_EMISSION_REJECTED' }` |
| Post-emission read (HR-RS4) | Living Memory one-hop query returns `null` for `researchAnchorNodeId` | consumer (observability/replay/audit) surfaces as read failure per their own framework's error discipline; RS has no further recovery |
| Self-application closure failure (RA8 / G-RS8) | One-step closure does not terminate (R'' produces R''' invocation within the same operation) | authoring program returns `ResearchValidityError { code: 'RESEARCH_VALIDITY_FAILED', failedAxiom: 'RA8' }`; descent beyond one step is consumer-owned per §1 scopeOut and is not RS's recovery surface |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-research finding count: bounded by authoring program's scale policy (no RS-framework hard cap; binding declares the methodKind, decomposition tree at depth = 1 caps leaves at `subQuestions[rootQuestionId].length` for `methodKind === 'decomposition'` or 1 for root-as-leaf `methodKind ∈ {'lookup', 'derivation', 'synthesis'}`).
- Per-research source-citation count: bounded by authoring program's source-resolution scale policy (no RS-framework hard cap; multi-source closure verified linear in citation count per RA4).
- Per-research priorKnowledge size: bounded by `KnowledgeContext.artifactRefs[]` length (domain-declared; RS shape permits arbitrary opaque artifactRefs cardinality).
- Per-emission gate execution: O(|findings| + |sources|) — one G-RS3 entry per finding, one G-RS4 entry per resolved-finding sourceRef, one G-RS5 aggregation pass; linear in finding + source count.
- Self-application closure: O(1) at the RS axiom level (one-step bound); deeper recursion is consumer-owned per §1 scopeOut and is not in RS's scale envelope.
- Decomposition depth: O(1) at v1.0 (depth = 1 per RA2); multi-level Q → Q′ → Q″ is consumer-owned per §1 scopeOut.

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations`:

- RS composition (authoring program ownership): non-atomic; authoring program owns transaction boundary (F-discover R1+R2 layers per F-discover SLICE.md User-facing Protocol).
- RS validity gate execution (G-RS1..G-RS10): atomic per-research (all-or-nothing validation; no partial-pass emission).
- AS carrier emission (HR-RS3): atomicity inherited from AS v2.2 atomicity declaration (AS emission is atomic per substrate §13.4).
- Post-emission immutability (RA7): enforced by AS v2.2 ArA5 at the companion node (which holds the full `ResearchArtifactContent` payload).
- Self-application closure (RA8): atomic per-R; closure invocation is one operation producing one R''.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-05-02 (Sprint 5.5 Shot 1; types.ts deployed at Sprint 5 HEAD `9862092` ahead of spec md) | Initial declaration. Six RS-local P1 axes (Input, Question, Finding, Source, Closure, Self-application) with Decomposition cross-axis-shared positional with Question per types.ts authoritative declaration. Ten axioms RA1..RA10: RA1 input shape; RA2 decomposition (one-step Q→Q′ tree); RA3 finding decomposition (one-to-one over leaves(decomposition) ∪ rootSet); RA4 source-grounding closure; RA5 closure aggregation (all-resolved-with-vacuous-closure); RA6 binding immutability + multi-source closure; RA7 post-emission immutability (mirrors VS VA8 + Plan PA9); RA8 one-step self-application closure; RA9 question emission-freeze (verbatim-carry triple + capturedAt); RA10 priorKnowledge verbatim-carry (forward-carried known surface). Ten paired gates G-RS1..G-RS10 (1:1 per G-M1). Four HRs (HR-RS1..HR-RS4) with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) + P8=0 (Mode=epistemic, substrate §8.3 binding) positive empty-declarations. Carrier = named → Artifact Standard v2.2 (structural symmetry with VS v1.0 + Plan v2.2). ResearchBinding shape declared with zero domain instances at v1.0 deployed-spec level (F-discover Sprint 5 supplies LIV-architecture smoke binding per D-RS-BINDING-V1). `referentCitations: []` per VS v1.0 + Cognitive v1.2.2 precedent. Provenance reference-default per A-20. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. R5 types file `research-standard.types.ts` (680 lines, 47 RA-references) deployed Sprint 5 ahead of spec md; spec md authored Sprint 5.5 Shot 1 closes Playbook §1.20 strict-functional-rule gap. Six D-rows recorded §10. | L0 (pending v1.0 confirmation per §10 dispatch brief gate) |

---

## §6 Coupling

### §6.1 Carrier

Research Standard carrier = `named` → `artifact-standard` v2.2. RS declares payload content only (`ResearchArtifactContent`); does not emit carrier mechanics. Emission call pattern: authoring program invokes AS v2.2 `createArtifact` with `framework = { id: 'research', version: '1.0' }` and `payload = { domain: 'research', domainVersion: '1.0', schemaRef: 'ResearchArtifactContent', content: <ResearchArtifactContent> }` and receives `ArtifactEmission`. See §6.11 carrier relation.

**Cross-framework calibration:** Carrier version bound to Artifact Standard v2.2. This is the cross-framework calibration point per spec §Cross-framework calibration. Structural symmetry with VS v1.0 + Plan v2.2: RS, VS, and Plan are the epistemic + verificative + structural L3 mode-primitive triple, all carriered through AS v2.2.

### §6.2 Handoff rules

Four framework-local HR instances. All RS-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-RS4 where `diagnosticSignificance = false` → captured via HR-RS3 + HR-Ar2 Living Memory write).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-RS1** | authoring-program → research-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-RS2** | domain-standard → research-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-RS3** | research-standard → artifact-standard (v2.2) | `['named']` (RS's own carrier = named) | `true` | declared §6.3 |
| **HR-RS4** | research-standard → consumer (observability / replay / audit / downstream RS for RA8) | `['named']` | `false` | n/a (consumer reads via AS `researchAnchorNodeId`; capture via HR-RS3 + AS-v2.2 HR-Ar2) |

**Inherited HRs referencing RS:**

| HR | Owning declaration | RS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → RS type consumption; RS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; RS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records RS's framework declaration per provenance contract (see §6.6) |
| HR-Ar3 | artifact-standard-v2-2 §6.2 | content-framework → artifact-standard; RS is one content framework invoking AS v2.2 `createArtifact` at HR-RS3 |
| HR-Ar4 | artifact-standard-v2-2 §6.2 | artifact-standard → content-framework; RS receives `ArtifactEmission` receipt after AS emits RS's carrier |

Per substrate §1.3 SI-03: these HRs are referenced, not redeclared, by RS.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-RS1 — authoring program → RS (ResearchInput receipt):**
```
captureShape = {
  capturedFields: ['authoringProgram.programId', 'authoringProgram.programVersion', 'userId', 'turnId', 'researchId', 'question.questionId', 'question.decompositionPolicy', 'priorKnowledge.artifactRefs.length', 'priorKnowledge.scopeBoundary.kind', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-RS2 — domain standard → RS (ResearchBinding consumption):**
```
captureShape = {
  capturedFields: ['domainId', 'domainVersion', 'bindingHash', 'investigationMethodCardinality', 'sourceCriteriaCardinality', 'consumedAtResearchId', 'turnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; binding resolution by (domainId, domainVersion, bindingHash)'
}
```

**HR-RS3 — RS → Artifact Standard v2.2 (carrier emission invocation):**
```
captureShape = {
  capturedFields: ['researchId', 'researchVersion', 'framework.id', 'framework.version', 'payload.domain', 'payload.domainVersion', 'asEmissionId', 'question.questionId', 'closure.truthValue', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; research anchor resolved via AS v2.2 ArtifactEmission.writes.a7.artifactAnchorNodeId → researchAnchorNodeId'
}
```

**HR-RS4:** no captureShape declared (`diagnosticSignificance: false`); receipt-only contract; diagnostic data captured at HR-RS3 invocation and via AS v2.2 HR-Ar2 Living Memory write.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'named'` with bound framework ref `artifact-standard` v2.2.
- **MA-C2** (custody per atom): §6.5 enumerates every RS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-RS1..HR-RS4 send/receive shapes matched by construction; captureShape contracts symmetric with HR-Ar3 (receive-side at AS v2.2).
- **MA-C4** (provenance per output field): §2.2 every `ResearchArtifactContent` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'named'` → output rides inside named carrier's artifact per MA-S2; §2.2 `ResearchArtifactContent` populates `ArtifactPayload.content` at HR-RS3.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; AS v2.2 atoms referenced at §2.5 are not re-owned (custody remains with artifact-standard); substrate / primitives.ts / metaframework atoms referenced at §2.3, §2.4, §2.6 not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | research-standard (researchAnchorNodeId via AS emission; KnowledgeContext.artifactRefs entries; KnowledgeContext.scopeBoundary.ref), every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | research-standard (§2.1 ResearchInput.userId), every session-aware framework |
| `Semver` | primitives.ts | core/R5 | research-standard (§1 version, §2 producedBy.programVersion, §2 binding.domainVersion, §2 researchVersion), every versioned framework |
| `Result<T, E>` | primitives.ts | core/R5 | research-standard (§2.2 ResearchEmissionResult), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | research-standard (§2.2 ResearchValidityError extends), every error-carrying framework |
| `CognitivePrimitive` | primitives.ts | core/R5 | research-standard (referenced at §2.5 cross-framework notes re: AS CreateArtifactInput.primitive field populated by authoring program via Cognitive Standard encodeLLM) |
| `EpochMs` | research-standard (RS-local declaration per A-08 + D-RS-EPOCHMS-LOCATION; spec §2.4 cites primitives.ts for typing intent — primitives.ts does not export EpochMs; declaration mirrored from VS+Plan precedent) | L3 (this file §2 + core/R5 `research-standard.types.ts` line 146) | research-standard (§2.2 producedAt + question.capturedAt + findings[].investigatedAt + sources[].capturedAt) |
| `Mode` | substrate | L1 (substrate §2) | research-standard (§1 Identity `Mode = epistemic`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | research-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | research-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | research-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | research-standard (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | research-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | research-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed) | research-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed) | research-standard (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | research-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed) | research-standard (inherited via HR-RS1 authoring-program invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed) | research-standard (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed) | research-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | research-standard (§3.7 P8 empty-declaration basis; Mode-binding rule cited) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | research-standard (§3.7 same basis) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | research-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | research-standard (not directly consumed; declared empty per §3.2 P7=0; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | research-standard (empty-declaration basis per MA-J4) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | research-standard (§3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | research-standard (§1 Identity referentCitations row declared empty at v1.0) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | research-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | research-standard (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | research-standard (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | research-standard (§8.2 dimension results schema reference) |
| `ArtifactPayload` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | research-standard (§2.2 ResearchArtifactContent rides as `ArtifactPayload.content`) |
| `ArtifactEmission` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | research-standard (§6.11 carrier emission produces this W-ATOM; §2.2 ResearchEmissionResult success value) |
| `CreateArtifactInput` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | research-standard (§6.11 authoring program constructs at RS→AS boundary) |
| `ArtifactEdgeKind` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | research-standard (§6.11 dependency-edge reference: RS anchor → priorKnowledge.artifactRefs[] entries per ArA4d) |
| `QuestionId` | research-standard | L3 (this file §2 + core/R5) | research-standard (internal — keys of findings + content.openQuestions + decomposition.rootQuestionId), domain standards (declare question IDs in caller-supplied ResearchQuestionInput) |
| `ResearchId` | research-standard | L3 (this file §2 + core/R5) | research-standard (internal), framework-audit (audit trail), observability/replay |
| `CitationId` | research-standard | L3 (this file §2 + core/R5) | research-standard (internal — keys of content.sources + values of SourceRef.citationId) |
| `SourceKind` | research-standard | L3 (this file §3.8 + §2.7 + core/R5) | research-standard (internal), domain standards (declare per-criterion sourceKindAllowed values) |
| `GroundingClass` | research-standard | L3 (this file §3.8 + §2.7 + core/R5) | research-standard (internal), domain standards (declare per-criterion groundingClass values); identical shape to VS PredicateGroundClass per substrate §6.3 single authoritative enum |
| `ResearchTruthValue` / `ResearchExecutionState` / `ResearchApplicability` / `ResearchClosureTruthValue` | research-standard | L3 (this file §3 + §2 + core/R5) | research-standard (internal — finding + closure result fields) |
| `InvestigationMethodKind` | research-standard | L3 (this file §3.8 + §2.7 + core/R5) | research-standard (internal); domain standards (declare per-method methodKind value) |
| `ResearchShapePositional` / `ResearchQuestionPositional` / `ResearchFindingPositional` / `ResearchSourcePositional` / `ResearchClosurePositional` / `ResearchSelfApplicationPositional` | research-standard | L3 (this file §3.8 + core/R5) | research-standard (internal), framework-audit |
| `ResearchAggregationKind` | research-standard | L3 (this file §3.8 + core/R5) | research-standard (internal); future amendments may extend per S3 |
| `SourceRef` | research-standard | L3 (this file §2.7 + core/R5) | research-standard (internal — Finding.sourceRefs entries) |
| `DecompositionPolicyRef` | research-standard | L3 (this file §2.7 + core/R5) | research-standard (internal), authoring programs (caller supplies at ResearchInput.question.decompositionPolicy) |
| `ResearchTypedAtomSchema` | research-standard | L3 (this file §2.7 + core/R5) | research-standard (shape owner — binding.questionSchema + binding.knowledgeSchema); domain standards (declare instance values) |
| `ResearchFailsafeRule` | research-standard | L3 (this file §2.7 + core/R5) | research-standard (shape owner — binding.failsafes values); domain standards (declare instance values) |
| `SourceCriterion` | research-standard | L3 (this file §2.7 + core/R5) | research-standard (shape owner — binding.sourceCriteria entries); domain standards (declare instance values) |
| `InvestigationMethod` | research-standard | L3 (this file §2.7 + §3.6 + core/R5) | research-standard (shape owner — binding.investigationMethods entries); domain standards (declare instance values) |
| `ResearchBinding` | research-standard | L3 (this file §2 + core/R5) | research-standard (shape owner); instance values owned per-domain by domain standard (LIV-architecture smoke binding at Sprint 5 close per F-discover D-RS-BINDING-V1; full domain bindings deferred); captured verbatim in ResearchArtifactContent per RA6 + RA7 |
| `ResearchQuestionInput` | research-standard | L3 (this file §2.1 + core/R5) | research-standard (internal — ResearchInput.question), authoring programs (caller-construct: F-discover and future research-authoring programs) |
| `ResearchQuestionContent` | research-standard | L3 (this file §2.2 + core/R5) | research-standard (internal — ResearchArtifactContent.question; RA9 verbatim-carry triple + capturedAt) |
| `KnowledgeContext` | research-standard | L3 (this file §2 + core/R5) | research-standard (internal — input + content priorKnowledge field); authoring programs (caller-construct at ResearchInput.priorKnowledge); RA10 verbatim-carry |
| `DecompositionTree` | research-standard | L3 (this file §2.2 + §3.6 + core/R5) | research-standard (internal — content.decomposition; RA2 one-step structural transformation) |
| `FindingResultEntry` / `FindingResultMap` | research-standard | L3 (this file §2.2 + §3.6 + core/R5) | research-standard (internal — content.findings entries + map shape) |
| `SourceCitation` / `SourceCitationMap` | research-standard | L3 (this file §2.2 + §3.6 + core/R5) | research-standard (internal — content.sources entries + map shape) |
| `ResearchClosure` | research-standard | L3 (this file §2.2 + core/R5) | research-standard (internal — content.closure field shape; RA5 derivation) |
| `AuthoringProgramRef` | research-standard | L3 (this file §2 + core/R5) | research-standard (internal — input.authoringProgram + content.producedBy; per A-08 per-framework declaration shape parallel to VS + Plan AuthoringProgramRef) |
| `ResearchInput` | research-standard | L3 (this file §2.1 + core/R5) | research-standard (internal), authoring programs (construct at caller site: F-discover at v1.0; future research-authoring programs) |
| `ResearchArtifactContent` | research-standard | L3 (this file §2.2 + core/R5) | research-standard (internal), artifact-standard (carries as `ArtifactPayload.content`), observability / replay / audit / downstream RS instances (RA8 self-application input via priorKnowledge.artifactRefs) |
| `ResearchHandoffRuleInstance` | research-standard | L3 (this file §6.2 + core/R5) | research-standard (internal), framework-audit (X3 C5 captureShape check) |
| `ResearchGateResult` | research-standard | L3 (§4 + core/R5) | research-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `ResearchDimensionResult` | research-standard | L3 (§4.4 + core/R5) | research-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `ResearchCustodyRow` | research-standard | L3 (§6.5 + core/R5) | research-standard (internal), framework-audit (custody-check X2/X5) |
| `ResearchValidityError` | research-standard | L3 (§2 + core/R5) | research-standard (internal); extends primitives.ts `AppError` |
| `ResearchEmissionResult` | research-standard | L3 (§2 + core/R5) | research-standard (emission surface), authoring programs (consume at HR-RS3 return) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-05-02T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput
  sourceInputValue:         undefined                       // by-value opt-in flag not set
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in. Not opted in at this cycle.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

RS carrier = `named` → `artifact-standard` v2.2. Applicability enforcement at handoff time:

- HR-RS1 carrier applicability `['self', 'named']`: authoring program's own carrier (typically `named` for F-discover and future research-authoring programs) ∈ set → applicable; all authoring-program carriers supported.
- HR-RS2 carrier applicability `['self', 'named']`: domain standard's own carrier (typically `self` or `named`) ∈ set → applicable.
- HR-RS3 carrier applicability `['named']`: RS's own carrier is `named`; applies exactly; RS cannot invoke HR-RS3 when carrier is `self` or `none` (not applicable by declaration — this is RS's only carrier-emission path).
- HR-RS4 carrier applicability `['named']`: consumer reads via AS `researchAnchorNodeId`; requires RS carrier = `named` (satisfied by §6.1).


### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

RS's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoint: 'authoring-program composes ResearchInput → validates RA1..RA10 → invokes AS v2.2 createArtifact at HR-RS3',
  configurationInputs:  ['ResearchBinding (per-domain)', 'authoringProgram.programId + programVersion', 'userId + turnId', 'question (ResearchQuestionInput shape: questionId + questionText + decompositionPolicy)', 'priorKnowledge (KnowledgeContext shape: artifactRefs + scopeBoundary)'],
  observableOutputs:    ['ResearchEmissionResult (success: ArtifactEmission with researchAnchorNodeId; failure: ResearchValidityError with failedAxiom)'],
  errorContract:        'ResearchValidityError codes: RESEARCH_INPUT_INVALID | RESEARCH_VALIDITY_FAILED | RESEARCH_EMISSION_REJECTED',
  extensibility:        'ResearchBinding shape is RS-owned; instance values per-domain; new domains added by declaring new ResearchBinding instances — no RS amendment required. InvestigationMethodKind enum is RS-owned (current set: decomposition, lookup, derivation, synthesis); additive at RS per S3 if new method kinds emerge. GroundingClass enum is substrate §6.3 six-class taxonomy — additive at substrate, not at RS.'
}
```

V5 verification: this operator interface is declaratively complete at v1.0 (every invocation path + configuration input + observable + error listed).

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | RS consumes | RS emits | HR binding |
|---|---|---|---|
| authoring program (F-discover at v1.0; future research-authoring programs) | pre-research inputs (question, priorKnowledge) + ResearchBinding instance + caller session context | `ResearchArtifactContent` via AS v2.2 emission | HR-RS1 (inbound); HR-RS3 (outbound) |
| domain standard (LIV-architecture binding at Sprint 5 per D-RS-BINDING-V1; future domain standards) | `ResearchBinding` instance values (investigationMethods, sourceCriteria, questionSchema, knowledgeSchema, failsafes) | — | HR-RS2 (inbound ResearchBinding) |
| Artifact Standard v2.2 | AS's `ArtifactEmission` receipt after createArtifact invocation | `ResearchArtifactContent` as `ArtifactPayload.content`; `framework.id = 'research'`, `framework.version = '1.0'` | HR-RS3 (outbound) + HR-Ar3 (AS receive-side) + HR-Ar4 (AS receipt) |
| consumer (observability / replay / audit / downstream RS for RA8) | — | consumed via `researchAnchorNodeId` (= `ArtifactEmission.writes.a7.artifactAnchorNodeId`) after AS emission lands in graph | HR-RS4 (outbound) |
| Living Memory | — | ResearchArtifact anchor + companion land in graph via AS v2.2's commit pipeline (RS does not invoke Living Memory directly) | (via AS v2.2 HR-Ar2) |
| Verification Standard v1.0 | (no direct handoff — VS may consume RS-emitted ResearchArtifactContent as VerificationInput.target.artifactRef of kind 'research'; this is VS schema.input semantics, not an RS handoff) | (no direct emission — verdict on a research artifact is observable via Living Memory traversal of (verification anchor → research anchor) edge per ArA4d) | (consumer-mediated; no HR) |
| Plan Standard v2.2 | (no direct handoff — sibling at L3, structural-mode pattern reference; Plan-emitted PlanArtifactContent may participate in priorKnowledge surfaces but RS treats it as opaque NodeId per KnowledgeContext.artifactRefs) | — | (consumer-mediated; no HR) |
| framework-audit v1.3.6 | (distinct concern; RS does not consume framework-audit, framework-audit does not consume RS — see §1 scopeOut) | — | (no HR; non-overlapping scopes) |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| `ResearchInput` | authoring-program constructs → HR-RS1 inbound → RS validates |
| `ResearchBinding` | domain-standard instance → `ResearchInput.binding` via HR-RS2 inbound (LIV-architecture smoke binding at Sprint 5; full domain bindings deferred) |
| `ResearchArtifactContent` | RS composes + validates → wrapped in `ArtifactPayload` → HR-RS3 outbound to AS |
| `CreateArtifactInput` (AS v2.2) | authoring-program constructs at RS→AS boundary with `payload.content = ResearchArtifactContent` → AS v2.2 `createArtifact` receives |
| `ArtifactEmission` (AS v2.2) | AS emits → RS's HR-RS3 captures receipt → authoring-program receives `ResearchEmissionResult { ok: true, data: ArtifactEmission }` |
| `researchAnchorNodeId` | alias for `ArtifactEmission.writes.a7.artifactAnchorNodeId`; consumer consumes via HR-RS4 outbound-contract |

### §6.11 Carrier relation (H5) and boundary notes

RS `carrier = named → artifact-standard v2.2`. RS declares **content only** (`ResearchArtifactContent`). RS does **not** emit carrier mechanics. Emission call pattern (parallel to VS v1.0 §6.11 + Plan v2.2 §6.11):

```
// authoring-program code (not RS code):
const researchContent: ResearchArtifactContent = composeResearch(researchInput)        // authoring program's work (F-discover R1 layer)
const validityResult = runResearchGates(researchContent)                                // G-RS1..G-RS10 pre-emission (F-discover R1 layer)
if (!validityResult.ok) return validityResult                                           // return ResearchValidityError; no AS invocation

const asInput: CreateArtifactInput = {                                                  // AS v2.2 type
  framework: { id: 'research', version: '1.0' },                                        // RS's framework ref
  turnId:    researchInput.turnId,                                                      // verbatim from ResearchInput
  userId:    researchInput.userId,                                                      // verbatim from ResearchInput
  payload: {
    domain:        'research',
    domainVersion: '1.0',
    schemaRef:     'ResearchArtifactContent',
    content:       researchContent                                                      // RS's ResearchArtifactContent rides here
  },
  classificationNodeId: <from Cognitive Standard encodeLLM, same turn>,
  primitive:            <from Cognitive Standard encodeLLM, same turn>,
  confidence:           <from Cognitive Standard encodeLLM, same turn>,
  dependsOn:            researchInput.priorKnowledge.artifactRefs                       // RS depends on every priorKnowledge entry per ArA4d (one dependency edge per artifactRef; per F-discover SLICE.md User-facing Protocol step 6)
}

const emissionResult: CreateArtifactResult = createArtifact(asInput)                    // AS v2.2 call
// emissionResult.ok ? data.writes.a7.artifactAnchorNodeId = researchAnchorNodeId : map to ResearchValidityError
```

**Cross-framework calibration points (spec §Cross-framework calibration requirement):**

| RS reference site | AS v2.2 atom | Cycle-cross notes |
|---|---|---|
| §2.2 output ride-along | `ArtifactPayload.content: unknown` | AS v2.2 ArA7 verbatim-carry preserves `ResearchArtifactContent` byte-identically |
| §2.5 consumed types | `ArtifactPayload`, `ArtifactEmission`, `CreateArtifactInput`, `ArtifactEdgeKind` | all four from `artifact-standard.types.ts` |
| §6.11 `CreateArtifactInput.framework.version = '1.0'` | AS v2.2 framework version | v1.0 carrier pin to AS v2.2 |
| §6.11 `CreateArtifactInput.dependsOn: priorKnowledge.artifactRefs` | AS v2.2 input.dependsOn[] | aligns with AS v2.2 ArA4d (dependency-edge-per-entry); RS produces N dependency edges where N = priorKnowledge.artifactRefs.length |
| §6.5 custody row `researchAnchorNodeId` | AS v2.2 `ArtifactEmission.writes.a7.artifactAnchorNodeId` | structural alias; RS names the AS field at its RS-facing consumer surface |
| §3.6 RA7 immutability propagation | AS v2.2 ArA5 mutation-rejection | RS's RA7 is enforced via AS v2.2 ArA5 at the companion node (which holds full ResearchArtifactContent payload) |
| §6.2 HR-Ar3 receive-side | AS v2.2 §6.2 HR-Ar3 | AS captures `payload.domain + payload.domainVersion + framework.id + framework.version`; RS populates with `'research' + '1.0' + 'research' + '1.0'` |
| §6.2 HR-Ar4 receipt | AS v2.2 §6.2 HR-Ar4 | receipt-only; no captureShape either side |
| §5.6 failure mode `RESEARCH_EMISSION_REJECTED` | AS v2.2 `ArtifactError.code: 'ARTIFACT_*'` | RS maps AS error codes to `ResearchValidityError.code = 'RESEARCH_EMISSION_REJECTED'` |

**Boundary notes:**

- **Re-research semantics** (RA7): re-researching produces a new `ResearchArtifactContent` with a new `researchId` and new `researchVersion`. The new research emits through AS v2.2 as a separate `createArtifact` invocation; AS v2.2 ArA4c creates a `kind: 'version'` edge from new research anchor → prior research anchor iff the tuple `(framework.id='research', userId)` matches (which it does for re-research by the same user). Re-research version lineage is thus tracked at AS v2.2 graph level, not inside RS.

- **Binding immutability** (RA7 + RA6): AS v2.2 companion node holds the full `ResearchArtifactContent` payload including `binding`, `question`, `priorKnowledge`, `decomposition`, `findings`, `openQuestions`, `sources`, `closure`. AS v2.2 ArA5 forbids post-emission mutation of companion node content. Therefore all ResearchArtifactContent fields are immutable post-emission without an RS-framework-specific axiom layer — AS v2.2 ArA5 is the enforcer. RA7 is still declared at RS level because it scopes the invariant at RS's domain (full-content immutability post-emission), even though mechanical enforcement is at AS. (Pattern parallel to VS v1.0 VA8 + Plan v2.2 PA9.)

- **Self-application closure boundary** (RA8): RS guarantees one-step closure (R → R'') only. The closure is structurally well-defined: R'' investigates a new question against R as part of `priorKnowledge.artifactRefs`. A consumer can choose to invoke RS again on R'' producing R''', but R''' is not an RS invariant — recursive descent is consumer-owned per §1 scopeOut. RS's RA8 axiom + G-RS8 gate scope exactly one step; deeper descent is structurally permitted (R'' satisfies RA1 by construction when wrapped as a new ResearchInput, so it is itself a valid prior-knowledge surface entry) but not invariant. F-discover D-RS-RA8-SYNTHESIS pattern: G-RS8 synthesizes a notional re-input from content (priorKnowledge.artifactRefs ⊇ [ref(R)]), runs G-RS1 over it, returns OK iff structurally valid; does NOT actually re-invoke RS (parallel to F-verify D-VA9-SYNTHESIS).

- **Prior-knowledge dependency edges** (§6.11 dependsOn): every ResearchArtifactContent has `priorKnowledge.artifactRefs.length` entries in `CreateArtifactInput.dependsOn[]` — one per priorKnowledge artifactRef. This produces `priorKnowledge.artifactRefs.length` `kind: 'dependency'` edges per AS v2.2 ArA4d, from research anchor → each priorKnowledge anchor. The graph thus carries the structural relationship "this research consumed those prior artifacts" at the AS edge layer, queryable via Living Memory traversal. No RS-local axiom needed; AS v2.2 ArA4d is the enforcer. Distinct from VS dependency model (VS has exactly one dependency edge per emission to `target.artifactRef`); RS has 0..N dependency edges per emission to `priorKnowledge.artifactRefs`.

- **RS researching RS** (RA8 graph topology): when RS is invoked on a prior ResearchArtifactContent R as part of priorKnowledge, the resulting R'' has one of its `priorKnowledge.artifactRefs[i] = ref(R)`. The dependency edge R'' → R at AS layer creates a research-of-research chain in the graph. Chain depth is observable via Living Memory traversal of `kind: 'dependency'` edges where `framework.id = 'research'` at both endpoints. RS does not bound chain depth (consumer-owned per §1 scopeOut); the graph topology is the audit trail.

- **Framework-audit boundary** (§1 scopeOut): RS produces *runtime artifacts* (W-ATOMs flowing through L4 programs at runtime). Framework-audit verifies *framework declarations* (X1–X10 against framework files). VS may verify a `ResearchArtifactContent` via VA9 self-application targeting it (target.artifactKind = 'research'); framework-audit may audit RS's framework-declaration file. These are non-overlapping concerns at non-overlapping tiers (L3 runtime vs L2 declaration). MA-G13 four-property test verifies RS does not contain framework-audit as sub-element and vice versa: confirmed — distinct frameworks at distinct levels with distinct schemas.

- **VS-on-RS verification topology** (§1 scopeOut): VS v1.0 may verify a ResearchArtifactContent via VA9 self-application — VS accepts `target.artifactKind = 'research'` (per VS §1 Identity `target.artifactKind: extensible string` discipline; VS §3.8 Categorical column declares the enum extensible). The verification produces a VerificationArtifactContent V whose target is the ResearchArtifactContent R; V's verdict reports R's structural well-formedness against the VerificationBinding.predicateSet supplied by the caller. This is a consumer-mediated relationship — RS does not invoke VS, VS does not invoke RS; both are L4-program-mediated. The graph topology shows V → R as an AS-layer dependency edge, queryable via Living Memory traversal.

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "RS's research-artifact composition check is fully mechanical per §10 convention inherited from VS v1.0 + Plan v2.2 + AS v2.2: invalid research artifact is not emitted; emission is rejected with a structured error naming the failed axiom. Every RA1..RA10 condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (RA1, RA3, RA4, RA6, RA8, RA10), structural property (RA2, RA5, RA7, RA9), cardinality + reference resolution (RA3 cardinality clause + RA4 multi-source closure + RA6 failsafe-key resolution). No judgment inputs consumed at validity time. Investigation-method semantics within binding.investigationMethods are per-method mechanical: each InvestigationMethod declares methodKind ∈ enum {'decomposition', 'lookup', 'derivation', 'synthesis'} (RA2/RA3 binding), which is mechanical by construction (a method that cannot reduce to one of these kinds fails RA2/RA3 and is rejected before evaluation). Source-grounding semantics within binding.sourceCriteria are per-criterion mechanical: each SourceCriterion declares groundingClass ∈ substrate §6.3 six-class taxonomy (RA4 binding), mechanical by construction. Authoring program's pre-research composition (which produces ResearchArtifactContent from question + binding + priorKnowledge) is upstream of RS schema.input and thus outside RS judgment scope. MA-J4 emptyDeclared satisfied with positive basis."
}
```

### §7.2 Axis status

`A7 Judgment` axis status: `emptyDeclared: true` with positive basis above. Gate coverage:

- **G-J1** (J-input-typing): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J2** (mechanical-criterion ground): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J3** (provenance for J-input): vacuous per §7.1 empty set.
- **G-J4** (J-axis emptyDeclared or non-empty): passes via `emptyDeclared: true` with declared basis.
- **G-J5** (mechanicalGround field resolution): vacuous per §7.1 empty set.

### §7.3 Judgment provenance

Per metaframework §7.4: empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 95 framework-tier gates (85 inherited + 10 RS-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation post-v1.0-confirmation. Per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11): when RS's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7). RS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline. Per F-discover SLICE.md "Sprint 5 Close Criteria Coverage": first end-to-end emission + G-RS1..G-RS10 first-run + L0 confirmation of first-run all deferred to Sprint 8 per L0 directive.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle section declares state transitions; §5.9 version history present |
| X2 Determinism / reproducibility | declared-complete | §3.6 axiom mechanical-criterion ground per substrate §6.3 (every RA-axiom reducible to one of six classes); §3.7 P8=0 mechanical empty-declaration; §7.1 P7=0 mechanical empty-declaration |
| X3 Observability / introspection | declared-complete | §6.2 HRs with captureShape per MA-C3; §6.3 captureShape table populated for HR-RS1..HR-RS3 (HR-RS4 explicitly null per diagnosticSignificance: false) |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut row with 10 entries (runtime execution, domain investigation-method semantics, AS emission mechanics, Living Memory, authoring-program composition, recursion bound, multi-level decomposition bound, framework-audit boundary, VS verification of research, B-direction post-beta) |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared (per-research finding count, source-citation count, priorKnowledge size, gate execution complexity, self-application closure, decomposition depth) |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared with all required fields |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated |
| X9 Integration point | declared-complete | §6 cross-framework + HR-RS3 AS v2.2 carrier; §6.9 adjacent-framework call patterns |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=0 positive empty-declaration with basis citing substrate §8.3 Mode=epistemic ≠ generative-only binding |

All ten audit dimensions declaratively complete at delivery. Framework-audit first-run ratifies at post-v1.0-confirmation.

### §8.3 Last audit event

Not yet run. v1.0 delivery is the first compilation of Research Standard; framework-audit X1..X10 execution scheduled after L0 confirmation per §10 dispatch brief gate. F-discover SLICE.md Sprint 5 Close Criteria deferred first-run + L0 confirmation of first-run to Sprint 8.

### §8.4 Self-application basis

RS does self-apply at the runtime-artifact tier per RA8 (one-step closure: R → R''). This is **distinct** from G-U1 framework-self-application (which runs the gate suite against the framework declaration itself; G-U1 is inherited from metaframework and applies at framework-audit time). The two self-applications operate at different tiers:

- **G-U1 self-application** (framework-tier): RS's gate suite (G-RS1..G-RS10 + 85 inherited) audits RS's own framework declaration file. Inherited from metaframework §11.3. Applies at framework-audit invocation.
- **RA8 self-application** (runtime-artifact-tier): RS's research semantics applied to a `ResearchArtifactContent` produces a research-of-research artifact (R'' investigates a new question against R as part of priorKnowledge). Declared at RS §3.6. Applies at every runtime RS invocation where `priorKnowledge.artifactRefs` contains a prior ResearchArtifactContent reference.

These are non-overlapping by scope. RS satisfies both: framework-audit-style (G-U1 inherited) and runtime-self-application (RA8 declared).

### §8.5 MA-G13 four-property self-check (framework classification)

| Property | Satisfied by |
|---|---|
| Own state | axiom set (RA1..RA10) + gate results (G-RS1..G-RS10) + lifecycle state (per §1, §4, §5, §8) |
| Own I/O | `ResearchInput` → `ResearchArtifactContent` (per §2.1, §2.2) |
| Own invariants | 10 axis-bound structural-transformation axioms (RA1..RA10) + 85 inherited framework-tier gates |
| Own discipline | mechanical RA1..RA10 evaluation (P8=0 empty per substrate §8.3 Mode binding; pipeline owned by L4 authoring program — F-discover at v1.0) + framework-audit gate suite (§4) + amendment propagation via standard AP flow |

All four properties declared. MA-G13 passes. RS is classified as framework (not state store; not authoring program — F-discover is the authoring program at the L4 tier).

### §8.6 Cross-framework consistency check

| Check | Status | Basis |
|---|---|---|
| Carrier alignment with AS v2.2 | pass | §6.1 + §6.11 cross-framework calibration table; AS v2.2 frozen input to this v1.0 cycle |
| Type alignment with research-standard.types.ts | pass | §2.1 + §2.2 + §2.7 atom names verbatim from types.ts; D-RS-EPOCHMS-LOCATION resolution (§10) reconciles spec §2.4 EpochMs-from-primitives.ts citation against types.ts local declaration |
| Axis derivation from types.ts Positional enums | pass | §3.3 axes [Input, Question, Finding, Source, Closure, Self-application] derive from types.ts Positional enum prefixes per D-RS-AXES-FROM-TYPES (§10); Decomposition cross-axis-shared with Question per types.ts line 228 comment |
| Axiom mapping to types.ts RA references | pass | §3.6 RA1..RA10 mapping derives from 47 RA-references in types.ts; D-RS-RA10-PRIORKNOWLEDGE + D-RS-RA-SEMANTICS-MAP (§10) reconcile brief §4 ambiguity and typo against types.ts authoritative annotations |
| P8 absence per substrate Mode binding | pass | §3.7 P8=0 empty-declaration with Mode=epistemic basis citing substrate §8.3 line 662 + line 674; D-RS-P8-EMPTY (§10) reconciles brief §4 directive against substrate higher-precedence binding |
| referentCitations vacuous-pass | pass | §1 Identity referentCitations row declared `[]` with explicit basis; G-V10 + G-S8 + G-L11 vacuous-pass per MA-V11 + substrate §10.1 S4; precedent VS v1.0 + Cognitive v1.2.2 |
| F-discover slice runtime-referent alignment | pass | F-discover SLICE.md "Composition Path" describes runtime pipeline; spec §3.7 P8 empty-declaration basis names F-discover as the L4 owner; spec §6.11 emission call pattern matches F-discover SLICE.md User-facing Protocol step 6 (dependsOn = priorKnowledge.artifactRefs); D-RS-RA7-PREEMISSION + D-RS-RA8-SYNTHESIS resolutions cite F-discover D-row precedents directly |
| Custody coverage (ScR3) | pass | §6.5 custody table maps every R5 atom in research-standard.types.ts to declaration site; primitives.ts atoms + substrate atoms + metaframework atoms + AS v2.2 atoms all consumed-by-reference with custody rows |

All cross-framework consistency checks pass. No findings.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-02 | Initial declaration. Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 under substrate-v1-1 v1.6. Six RS-local P1 axes (Input, Question, Finding, Source, Closure, Self-application) with Decomposition cross-axis-shared positional with Question per types.ts authoritative declaration (line 228 comment); axis names derived from types.ts Positional enum prefixes per D-RS-AXES-FROM-TYPES (§10). Ten axioms RA1..RA10 with 1:1 axis-axiom binding (RA2 attached at Question/decomposition cross-axis; RA4 cross-axis Source ↔ Finding; RA6 cross-axis Question ↔ Source ↔ Closure; RA7 cross-axis Closure ↔ full content; RA10 cross-axis Input ↔ Question/priorKnowledge). RA8 closing self-application as the epistemic-mode-specific invariant; RA10 closing priorKnowledge verbatim-carry as the input-side symmetric to RA9 question-freeze (epistemic-mode-specific input verbatim invariant absent from VS). Ten paired gates G-RS1..G-RS10 (1:1 per G-M1). Four HRs HR-RS1..HR-RS4 with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) and P8=0 (Mode=epistemic + substrate §8.3 generative-only binding) positive empty-declarations per A-17. Carrier = named → Artifact Standard v2.2 (structural symmetry with VS v1.0 + Plan v2.2 — all three L3 mode-primitive frameworks carriered through AS at the same version). ResearchBinding shape declared with zero domain instances at v1.0 deployed-spec level (frozen shape; F-discover slice supplies LIV-architecture smoke binding at Sprint 5 close per F-discover D-RS-BINDING-V1; full domain bindings deferred per natural-defer). `referentCitations: []` declared with basis per VS v1.0 + Cognitive v1.2.2 precedent. Provenance reference-default per A-20. Cycle-2 referent infrastructure (G-V10 + G-S8 + G-L11) inherited and vacuous-pass per zero-citation declaration. R5 types file `research-standard.types.ts` (680 lines, 47 RA-references) deployed Sprint 5 HEAD `9862092` ahead of spec md; spec md authored Sprint 5.5 Shot 1 closes Playbook §1.20 strict-functional-rule gap surfaced by types.ts line 73 canonical-spec marker. Distinct from F-discover (L4 authoring program) by tier and concern: RS declares the contract; F-discover composes against it. Six D-rows recorded §10 (D-RS-AXES-FROM-TYPES, D-RS-P8-EMPTY, D-RS-RA10-PRIORKNOWLEDGE, D-RS-RA-SEMANTICS-MAP, D-RS-EPOCHMS-LOCATION, D-RS-AUTHORING-CHANNEL). | Sprint 5.5 Shot 1 dispatch brief (Sprint 5.5 pre-Sprint-6 standards completion) |

---

## §10 Decision-D table

Per Playbook §1.8 Decision-D license. Builder records D-rows when (a) brief structure conflicts with authoritative source (substrate / types.ts / VS+Plan precedent), (b) RA axiom condition is ambiguous from types.ts and spec md must declare a definite version, (c) atom name or enum value would need to differ from types.ts (route to manager per §1.16; types.ts wins absent L0 vocabulary expansion).

| ID | Issue | Sources consulted | Resolution | Authority |
|---|---|---|---|---|
| **D-RS-AXES-FROM-TYPES** | Brief §4 lists six P1 axes: [Question, Investigation, Knowledge, Source, Finding, Self-application]. types.ts authoritatively declares six Positional enums (lines 222–264): `ResearchShapePositional` (Input axis), `ResearchQuestionPositional` (Question axis, comment line 228 declares "shared cross-axis with **Decomposition**"), `ResearchFindingPositional` (Finding), `ResearchSourcePositional` (Source), `ResearchClosurePositional` (Closure), `ResearchSelfApplicationPositional` (Self-application). Brief's "Investigation" and "Knowledge" do not appear as Positional enums in types.ts; types.ts's "Input" and "Closure" do. Brief §4 also mandates: "RS axis names per types.ts atom prefixes" + brief §8 D-license trigger: "A specific atom name or enum value would need to differ from types.ts (route back to manager per §1.16 convention-precedence — types.ts wins absent L0 vocabulary expansion)." | Brief §4, §8; types.ts lines 219–265; brief §1.16 convention-precedence; VS §3.3 six-axis pattern; Plan v2.2 §3.3 four-axis pattern (axis count is per-framework concern-derived, not template). | Six axes derived from types.ts Positional enum prefixes: [Input, Question, Finding, Source, Closure, Self-application]. Decomposition declared cross-axis-shared with Question (parallel to VS Aggregation cross-axis-shared with Verdict). Brief's "Investigation" concern subsumed under Question's `decompositionPolicy` sub-axis (RA6 binding) + Question/decomposition sub-axis (RA2). Brief's "Knowledge" concern subsumed under Input/priorKnowledge sub-axis (RA1) + Question/priorKnowledge cross-axis (RA10 verbatim-carry). MECE preserved. types.ts wins on naming per brief §1.16; no L0 vocabulary expansion required. | Builder, mechanical resolution per types.ts authoritative declaration. |
| **D-RS-P8-EMPTY** | Brief §4 directs three procedure-step S1/S2/S3 declarations in §3.7 (input validation; investigation execution; emission via AS). Substrate §8.3 line 662 binds: "P8 — Procedure step. Mode = generative only." Substrate §8.3 line 674 binds: "Non-generative frameworks have no P8 instances. P8 is absent, not empty." RS Mode = epistemic per brief §4 + spec §1. Epistemic ≠ generative. Substrate §8.3 binding is L1 — higher precedence than brief. | Brief §4; substrate-v1-1 §8.3 lines 662–674; substrate §8.6 empty-declaration derivation; A-17 EmptyPrimitiveDeclaration shape; VS v1.0 §3.7 P8=0 empty-declaration precedent (Mode=verificative); Plan v2.2 §3.7 P8=0 empty-declaration precedent (Mode=structural); F-discover SLICE.md "Composition Path" section (declares the runtime pipeline at L4 slice level — owned by F-discover, not RS). | §3.7 P8=0 positive empty-declaration with basis citing substrate §8.3 Mode=generative-only binding. Three steps brief §4 names are L4 authoring-program work owned by F-discover, not RS framework P8. Pattern parallels VS+Plan precedent, substituting epistemic for verificative/structural. PR4/PR5 self-checks vacuous (empty P8 set). Substrate §8.3 binding wins on precedence. | Builder, mechanical resolution per substrate §8.3 Mode-binding precedence. |
| **D-RS-RA10-PRIORKNOWLEDGE** | Brief §4 marks RA10 as ambiguous: "**RA10** — cross-axis coherence or aggregation closure (resolve from types.ts ResearchAggregationKind semantics)." This phrasing suggests RA10 is closure-aggregation related. types.ts authoritatively binds RA10 to KnowledgeContext verbatim-carry: line 376 "Forward-carried prior-knowledge surface. Verbatim from input per RA10"; line 556 "priorKnowledge: KnowledgeContext // verbatim from input.priorKnowledge per RA10 (byte-identical)"; line 581 "priorKnowledge: KnowledgeContext // forward-carried known surface; verbatim per RA10". Closure-aggregation is bound to RA5 (line 200, 503, 507, 562). Brief acknowledged ambiguity by saying "resolve from types.ts." | Brief §4 (axiom hint section); types.ts lines 200, 376, 503, 507, 556, 562, 581; brief §8 D-license trigger "An RA axiom condition is ambiguous from types.ts and spec md must declare a definite version" — but in this case types.ts is unambiguous (brief misread). | RA10 = priorKnowledge KnowledgeContext verbatim-carry (byte-identical from input to content; forward-carried known surface). Mirrors VS VA3 evidence-verbatim and AS ArA7 payload-verbatim — RA10 is the epistemic-mode-specific input verbatim invariant. RA5 separately covers closure aggregation. types.ts authoritative — no contradiction once read carefully. | Builder, mechanical resolution per types.ts authoritative annotation. |
| **D-RS-RA-SEMANTICS-MAP** | Brief §4 hints "**RA7** — binding immutability (mirrors VS VA7)." VS's binding-immutability axiom is **VA8** (per VS v1.0 §3.6 line 357). VS VA7 is target-capture (per VS §3.6 line 356). types.ts evidence: line 548 `researchVersion: ... new semver per re-research per RA7`; line 552 `binding: verbatim from input.binding (frozen per RA6 + RA7)`. RA7 is post-emission immutability (mirroring VS VA8 + Plan PA9), not target-capture (RS has no `target` field — the shape parallel to VS target-capture would be RA9 question emission-freeze, which is the input-form-to-content-form verbatim with capturedAt). | Brief §4 (axiom hint section); VS v1.0 §3.6 lines 350–358 (axiom table); Plan v2.2 PA9 immutability precedent; types.ts lines 548, 552; types.ts line 656 error semantics (`RESEARCH_INPUT_INVALID | RESEARCH_VALIDITY_FAILED | RESEARCH_EMISSION_REJECTED`). | RA7 = post-emission immutability + re-research version discipline (mirrors VS VA8 + Plan PA9). Mutation-rejection propagated from AS v2.2 ArA5 at companion node. RA9 separately covers question emission-freeze (verbatim-carry triple + capturedAt; analogous to VS VA7 target-capture but applied to question-form). Brief's "(mirrors VS VA7)" annotation reads as a typo for "VS VA8." Resolution does not contradict types.ts; resolves brief annotation. | Builder, mechanical resolution per VS axiom-table reading + types.ts annotations. |
| **D-RS-EPOCHMS-LOCATION** | Spec §2.4 cites EpochMs as consumed from primitives.ts. primitives.ts (read at this build) does NOT declare/export EpochMs (verified `grep -n "EpochMs" src/core/types/primitives.ts` returns no exports). VS v1.0 + Plan v2.2 each declare EpochMs locally per A-08 per-framework single-source-via-reference discipline (verified at VS types.ts:106 + Plan types.ts:136). research-standard.types.ts line 146 declares EpochMs locally per same precedent. F-discover SLICE.md D-RS5-EPOCHMS-LOCATION row already documents this resolution as Sprint 5 build cycle work. | Spec §2.4 row text; primitives.ts contents; VS verification-standard.types.ts EpochMs declaration; Plan plan-standard.types.ts EpochMs declaration; research-standard.types.ts line 88–146 (D-RS5-EPOCHMS-LOCATION note + local declaration); F-discover SLICE.md Decision-D Rows table. | EpochMs declared locally in `research-standard.types.ts` per VS+Plan precedent (A-08 per-framework single-source-via-reference). Spec §2.4 row cites primitives.ts for *typing intent* (EpochMs is structurally a `number & {readonly _brand: 'EpochMs'}` parallel to `NodeId`/`Semver` brands which DO live in primitives.ts); the type per se is RS-local. §6.5 custody row updated to record RS as owner with note explaining the citation reconciliation. Primitives consolidation tracked in backlog (per types.ts comment line 88–94), not in scope for Sprint 5.5 Shot 1. | Builder, mechanical resolution per VS+Plan precedent + F-discover Sprint 5 D-row continuity. |
| **D-RS-AUTHORING-CHANNEL** | Sprint 5.5 Shot 1 dispatch brief §10 declares: "Manager dispatches to L0 for spec authoring (Shot 1 is L0-authored generative work; subsequent shots that build code dispatch to builder)." User dispatch message identifies recipient as "u r builder, to build RS" (User → Builder). Builder authored to dispatch instructions per brief §0 dispatch-flow + Work Protocol Layer 0 ("Authority: no framework is valid or modified until explicitly confirmed by Demos. Inference is not confirmation.") | Brief §10; user dispatch text; Work Protocol Layer 0 + Layer 3 Execution. | Builder authors per dispatch as received; manager + L0 review per §10 confirmation gate. Spec md output remains subject to L0 confirmation per §5.3 + §10 dispatch brief gate (no framework valid until L0 confirms). Channel ambiguity flagged here for L0 awareness; L0 may direct re-author at L0 if Shot 1 brief §10 directive is intended to be hard rule. Spec md content does not change based on channel. | Builder, dispatch-conformance with explicit flag. L0 to confirm or redirect per §5.3. |

---

**End of research-standard-v1-0. Pending L0 confirmation at v1.0 closure.**
