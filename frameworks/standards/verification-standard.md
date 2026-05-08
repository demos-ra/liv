---
kind: framework
placement: frameworks/standards/
---

# verification-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** verificative (produced → verified)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Artifact Standard v2.2 (frozen carrier), Plan Standard v2.2 (structural-mode sibling, structural symmetry reference)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Verification Standard is the L3 verificative-mode framework owning runtime-artifact verification — the W-ATOM equivalent of Plan Standard's structural-mode role. Plan structures `known → structured` work into `PlanArtifactContent`; Verification Standard verifies `produced → verified` work into `VerificationArtifactContent`. The two are mode-symmetric L3 framework siblings, both parameterized by domain bindings, both carriered through Artifact Standard v2.2.

Verification Standard is **distinct from framework-audit-v1-2**: framework-audit (L2 verificative) audits framework declarations across the X1–X10 dimension grid. Verification Standard (L3 verificative) verifies runtime artifacts emitted by L4 programs against domain-supplied predicate sets. Different tier, different target, non-overlapping concerns (see §1 scopeOut).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Verification Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `verificative` (per substrate §2 Mode enum; `produced → verified`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first emission via HR-VS3 post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `artifact-standard` v2.2 (per substrate §9 Carrier enum; applied §6.1; structural symmetry with Plan v2.2) |
| `primitive` | `predicate-evaluation` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | authoring-program pre-verification inputs + VerificationBinding instance + target artifact reference + evidence W-ATOM |
| `produces` | `VerificationArtifactContent` (W-ATOM; rides as `ArtifactPayload.content` inside AS v2.2 emission) |
| `consumedBy` | observability, replay, audit consumers, downstream verification chains (VS verifying prior VS emissions per VA9), L4 programs requiring runtime-artifact verification |
| `adjacentFrameworks` | Artifact Standard v2.2 (carrier), Plan Standard v2.2 (structural-mode sibling at L3), domain standards (binding suppliers: LIV-Standard, Research, etc. — zero instances at v1.0; F-verify slice supplies smoke binding at Sprint 4 close; full LIV-Standard 153-predicate binding lands in subsequent cycle (Sprint 4.x) post pre-pass classification work), Living Memory (through AS carrier), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Cognitive Standard v1.2.2 §1 Identity** establishes the pattern for new L3 frameworks at first ratification with zero code referents. At v1.0 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at first L4 tenant cycle when F-verify slice supplies LIV-Standard binding and code referents emerge' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['framework-declaration audit (owned by framework-audit-v1-2 at L2; VS verifies runtime artifacts, not framework files)', 'domain-specific predicate semantics (owned by domain standard via VerificationBinding instance — predicateSet evaluation is a contract, not a Plan-side concern)', 'runtime execution of verification (owned by L4 programs invoking VS at boundary — F-verify slice in Sprint 4)', 'artifact emission mechanics (owned by Artifact Standard v2.2 carrier)', 'graph physics (owned by Living Memory)', 'authoring-program pre-verification composition (owned by authoring program — F-verify, F-research-verify, etc.)', 'recursive verification descent beyond one-step closure (owned by consumer; VS guarantees one-step VA9 closure only — see §3.6 VA9 + §6.11 boundary notes)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-3-VS-v1-0-genesis',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (VS v1.0 is a fresh L3 framework, not a v0 lift; no predecessor).

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `verificative` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: verificative-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry). |

---

## §2 Schema

### §2.1 Input — `VerificationInput`

Per MA-S1 (input is W-ATOM). Shape:

```
VerificationInput = {
  authoringProgram: {
    programId:      string           // caller identifier (e.g., 'f-verify', 'f-research-verify')
    programVersion: Semver           // caller version
  }
  userId:           UserId           // F-identity session carrier
  turnId:           string           // caller turn context
  binding:          VerificationBinding  // by-value instance from domain standard (zero instances at v1.0)
  target: {
    artifactRef:    ArtifactRef      // reference to the artifact under verification (Plan, RunReport, prior VS emission, etc.)
    artifactKind:   string           // 'plan' | 'run-report' | 'verification' | domain-extensible string
  }
  evidence:         unknown          // typed per binding.evidenceSchema; verbatim-carried into emission per VA3
  preverifyInputs:  unknown          // caller-typed per domain (analogous to Plan's preplanInputs)
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `verification-standard.types.ts` (R5).

### §2.2 Output — `VerificationArtifactContent`

Per MA-S2 (output is W-ATOM). VS carrier = `named` → `artifact-standard` v2.2: VS's `VerificationArtifactContent` W-ATOM rides as `ArtifactPayload.content` inside AS's `ArtifactEmission` (AS v2.2 `ArtifactPayload.content: unknown` accepts this opaquely per ArA7 verbatim-carry).

Shape:

```
VerificationArtifactContent = {
  verificationId:      VerificationId               // runtime-generated at emission (pins to AS anchor node identity per §6.11)
  verificationVersion: Semver                       // authoring-program-computed (new semver per re-verification per VA8)
  producedBy: {                                     // verbatim from input.authoringProgram per VA3
    programId:      string
    programVersion: Semver
  }
  producedAt:          EpochMs                      // runtime-captured at emission

  binding:             VerificationBinding          // verbatim from input.binding (frozen per VA8)

  target: {                                         // verbatim from input.target per VA3 (mechanically required for replay + VA9 self-application)
    artifactRef:        ArtifactRef
    artifactKind:       string
    capturedAt:         EpochMs                     // emission-time snapshot per A-20 reference-default discipline
  }

  evidence:            unknown                      // typed per binding.evidenceSchema; verbatim from input.evidence per VA3

  predicateResults: {                               // one entry per predicate in binding.predicateSet per VA4 (one-to-one decomposition)
    [predicateId: PredicateId]: {
      predicateRef:    PredicateId                  // resolves into binding.predicateSet per VA4
      truthValue:      'passed' | 'failed' | null   // null only when executionState='not-yet-run' per substrate §10.1 S4
      executionState:  'not-yet-run' | 'executed'   // per F-cycle-1-3 + F-cycle-1-11 first-run discipline
      applicability:   'applicable' | 'n/a'         // per F-cycle-1-3 GateResult/DimensionResult decomposition
      basis:           string | null                // populated when applicability='n/a' per MA-V11 cycle-1
      failureDetail:   string | null                // populated when truthValue='failed'; declared error text
      evaluatedAt:     EpochMs                      // runtime-captured per evaluation
    }
  }

  verdict: {                                        // aggregation result per VA5 (all-must-pass at v1.0)
    truthValue:           'verified' | 'failed' | null    // null permitted for vacuous-pass (zero-predicate verification per VA5 vacuous-satisfaction clause) or pre-execution
    aggregationBasis:     string                          // declared aggregation rule applied (v1.0: 'all-must-pass-with-vacuous-pass-on-empty')
    failedPredicateIds:   PredicateId[]                   // populated when truthValue='failed'; subset of keys(predicateResults)
  }
}
```

**Atomicity note (per VA5):** verdict aggregation is derived from `predicateResults` per the all-must-pass rule declared at §3.6 VA5 — `verdict.truthValue = 'verified'` iff `∀ pid ∈ keys(predicateResults): predicateResults[pid].truthValue === 'passed' AND predicateResults[pid].applicability === 'applicable'`, else `'failed'` with `failedPredicateIds` populated, with vacuous-pass on empty `predicateResults` per substrate §6.3 cardinality semantics. Verdict is a derived field — VS gate G-VS5 verifies derivation correctness.

Typed shapes declared in `verification-standard.types.ts` (R5). Every field traces to §6.5 custody.

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
| `Stage` | substrate §8.3 (consumed for declaration-only P8 empty basis; no P8 instance consumes — VS is non-generative) |
| `StageContentKind` | substrate §8.3 (same as Stage) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same as Judgment) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (consumed by §3.2 P7 + P8 empty markers) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `NodeId` | primitives.ts | §2.2 verificationAnchorNodeId via AS emission §6.11; §6.5 custody |
| `UserId` | primitives.ts | §2.1 VerificationInput.userId |
| `Semver` | primitives.ts | §1 version, §2 producedBy.programVersion, §2 binding.domainVersion, §2 verificationVersion |
| `EpochMs` | primitives.ts | §2.2 producedAt, target.capturedAt, predicateResults[].evaluatedAt |
| `Result<T, E>` | primitives.ts | §2.2 VerificationEmissionResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 VerificationValidityError (types file), §6.5 custody |
| `CognitivePrimitive` | primitives.ts | not directly consumed by VS fields; referenced at §2.5 cross-framework notes re: AS CreateArtifactInput.primitive field populated by authoring program via Cognitive Standard encodeLLM |

### §2.5 Consumed types (from artifact-standard-v2-2, by reference)

Cross-framework calibration per spec §Cross-framework calibration. VS consumes AS v2.2 types at the carrier boundary; AS is frozen input to this v1.0 cycle (parallel to Plan v2.2's AS consumption pattern).

| Type | Home | Consumed at |
|---|---|---|
| `ArtifactPayload` | artifact-standard-v2-2.md §2.2 | §2.2 VerificationArtifactContent rides as `ArtifactPayload.content` (unknown per AS v2.2 ArA7) |
| `ArtifactEmission` | artifact-standard-v2-2.md §2.2 | §6.11 VS-to-AS carrier emission produces this W-ATOM; §2.2 VerificationEmissionResult success value |
| `CreateArtifactInput` | artifact-standard-v2-2.md §2.1 | §6.11 authoring program constructs this at VS→AS boundary (cross-framework calibration point) |
| `ArtifactEdgeKind` | artifact-standard-v2-2.md §2 | referenced at §6.11 dependency-edge semantics (`'dependency'` edge from VS anchor → target.artifactRef per ArA4d) |
| `ArtifactRef` | artifact-standard-v2-2.md §2 (NodeId reference shape) | §2.1 VerificationInput.target.artifactRef + §2.2 VerificationArtifactContent.target.artifactRef |

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 (referenced from metaframework §6.5) | §8.2 dimension results schema reference |
| `ReferentCitation` | substrate §4 A-18 (consumed via metaframework §2.2 referentCitations slot) | §1 Identity referentCitations row (declared empty at v1.0 with basis) |

### §2.7 VS-local atoms (declared at point of use in §3)

Atoms owned by VS (custody row per atom in §6.5):

`PredicateId`, `VerificationId`, `VerificationPredicate`, `VerificationBinding`, `VerificationInput`, `VerificationArtifactContent`, `VerificationTarget`, `PredicateResultEntry`, `PredicateResultMap`, `VerificationVerdict`, `PredicateGroundClass`, `VerificationShapePositional`, `VerificationPredicatePositional`, `VerificationEvidencePositional`, `VerificationVerdictPositional`, `VerificationAggregationKind`, `VerificationSelfApplicationPositional`, `VerificationHandoffRuleInstance`, `VerificationGateResult`, `VerificationDimensionResult`, `VerificationCustodyRow`, `VerificationValidityError`, `VerificationEmissionResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling) per S1 single-source declaration. Typed shapes in `verification-standard.types.ts`.

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to VS:

- **ScR1** (input is W-ATOM): `VerificationInput` declared §2.1 as typed shape.
- **ScR2** (output is W-ATOM): `VerificationArtifactContent` declared §2.2 as typed shape; rides inside AS `ArtifactPayload.content`.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

VS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. VS does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, VS's own structural content populates §3.3–§3.9 below: six VS-local P1 Axis instances (Input, Predicate, Evidence, Verdict, Aggregation, Self-application), sub-axis instances, leaves, axioms (VA1..VA9), and the empty P7 + P8 declarations.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 6 | `{primitiveKind: 'P1', instanceCount: 6, basis: "VS-local domain axes declared at §3.3: Input, Predicate, Evidence, Verdict, Aggregation, Self-application. The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; VS-local P1 instances populate §3 Structure under the inherited shell under A3 Structure."}` |
| P2 Sub-axis | 17 | Input: 3; Predicate: 3; Evidence: 3; Verdict: 3; Aggregation: 2; Self-application: 3. Declared §3.4. |
| P3 Leaf | 9 | One leaf per axiom condition per MA-St2 leaf atomicity: VA1 (1) + VA2 (1) + VA3 (1) + VA4 (1) + VA5 (1) + VA6 (1) + VA7 (1) + VA8 (1) + VA9 (1) = 9. Declared §3.5. |
| P4 Axiom | 9 | VA1, VA2, VA3, VA4, VA5, VA6, VA7, VA8, VA9. Declared §3.6. |
| P5 Gate | 9 | G-VS1, G-VS2, G-VS3, G-VS4, G-VS5, G-VS6, G-VS7, G-VS8, G-VS9. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-VS1 (authoring-program → VS), HR-VS2 (domain-standard → VS), HR-VS3 (VS → artifact-standard v2.2), HR-VS4 (VS → consumer/observability/replay). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "VS's verification check is fully mechanical per §10 convention inherited from Plan v2.2 + AS v2.2: invalid verification artifact is not emitted; emission is rejected with a structured error naming the failed axiom. Every VA1..VA9 condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (VA1, VA2, VA3, VA6, VA9), structural property (VA4, VA5, VA7, VA8), cardinality + reference resolution (VA4 cardinality clause). No judgment inputs consumed at validity time. Predicate-evaluation semantics within binding.predicateSet are per-predicate mechanical (each VerificationPredicate declares groundClass ∈ substrate §6.3 six-class taxonomy by VA2, which is mechanical by construction). Authoring program's pre-verification composition is upstream of VS schema.input and outside VS judgment scope. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 0 | `{primitiveKind: 'P8', instanceCount: 0, basis: "VS Mode = verificative per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only (line 662: 'P8 — Procedure step. Mode = generative only.'; line 674: 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). VS therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. VS's verification pipeline is owned upstream by the authoring program (pre-schema.input, not an intra-VS procedure); VS's emission-time validity enforced mechanically by the VA1..VA9 gate bundle at the AS v2.2 carrier invocation site (§6.11), outside VS's P8 scope. Spec's permissive 'P8 declaration permitted but not required' is resolved under substrate §8.3 Mode binding precedence: P8 is structurally absent for VS (parallel to Plan v2.2 §3.7 P8 empty-declaration pattern, substituting verificative for structural)."}` |

Positive empty-declaration markers for P7 and P8 conform to substrate §4 A-17 `EmptyPrimitiveDeclaration` typed shape: `{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`. No implicit absence.

### §3.3 P1 Axis instances (VS-local)

Six domain axes. MECE over VS's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Input` | Input | Reception of the verification request | What is being verified, by whom, against what binding? |
| `Predicate` | Predicate | The set of testable conditions supplied by the binding | What conditions must hold for the artifact to verify? |
| `Evidence` | Evidence | The data the predicates evaluate against | What data does each predicate read to produce its truth-value? |
| `Verdict` | Verdict | Per-predicate evaluation results | Did each predicate pass, fail, or skip — and why? |
| `Aggregation` | Aggregation | Composition of per-predicate results into one artifact-level closure | Did this thing verify, taken as a whole? |
| `Self-application` | Self-application | One-step closure of VS over its own emissions | Can this verification artifact itself be input to another VS invocation, and does the closure terminate? |

**MECE verification:**
- Orthogonality: Input governs request reception (boundary inbound); Predicate governs the typed condition set (what to test); Evidence governs the data surface (what to read); Verdict governs per-predicate results (what truth-value each condition produced); Aggregation governs the artifact-level closure derivation (how per-predicate results compose); Self-application governs the closure idempotence (one-step recursion bound). No pair-overlap.
- Exhaustiveness: every `VerificationArtifactContent` field traces to exactly one VS-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Input sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Input/authoringProgram` | Caller identity | `leaf-VA1-input-receipt` (covered by VA1 leaf — input shape conformance) |
| `Input/binding` | VerificationBinding instance | `leaf-VA1-input-receipt` (covered by VA1) |
| `Input/target` | Target artifact reference | `leaf-VA1-input-receipt` (covered by VA1) |

**Predicate sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Predicate/predicateSet` | Predicates supplied by binding | `leaf-VA2-predicate-mechanical` |
| `Predicate/groundClass` | Substrate §6.3 mechanical-criterion class binding per predicate | `leaf-VA2-predicate-mechanical` (covered by VA2) |
| `Predicate/evidencePath` | Path into evidence W-ATOM resolved per predicate | `leaf-VA2-predicate-mechanical` (covered by VA2) |

**Evidence sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Evidence/evidenceSchema` | Typed shape supplied by binding | `leaf-VA3-evidence-verbatim` |
| `Evidence/verbatim-carry` | Byte-identical carry from input.evidence to content.evidence | `leaf-VA3-evidence-verbatim` (covered by VA3) |
| `Evidence/typed-conformance` | Evidence value conforms to binding.evidenceSchema | `leaf-VA3-evidence-verbatim` (covered by VA3) |

**Verdict sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Verdict/predicateResults` | Per-predicate evaluation entries | `leaf-VA4-result-decomposition` |
| `Verdict/oneToOne` | Cardinality match between binding.predicateSet and predicateResults | `leaf-VA4-result-decomposition` (covered by VA4) |
| `Verdict/decomposed-shape` | Each entry carries truthValue + executionState + applicability + basis per F-cycle-1-3 | `leaf-VA4-result-decomposition` (covered by VA4) |

**Aggregation sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Aggregation/all-must-pass` | All-must-pass derivation rule (VA5) | `leaf-VA5-aggregation` |
| `Aggregation/vacuous-pass` | Empty predicateSet vacuous-satisfaction per substrate §6.3 cardinality | `leaf-VA5-aggregation` (covered by VA5) |

**Self-application sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Self-application/closure` | One-step closure of VS over VerificationArtifactContent | `leaf-VA9-self-application` |
| `Self-application/well-formedness` | VerificationArtifactContent satisfies VerificationInput shape under VA1 when re-input to VS | `leaf-VA9-self-application` (covered by VA9) |
| `Self-application/recursion-bound` | One-step descent only; deeper recursion is consumer-owned (per §1 scopeOut) | `leaf-VA9-self-application` (covered by VA9) |

**Sub-axis attachment note:** Several sub-axes share the same axiom-anchored leaf because the axiom condition is unitary at the axis level (e.g., VA1 covers Input/authoringProgram + Input/binding + Input/target jointly via input shape conformance). This is the same pattern Plan v2.2 §3.6 establishes for PA3 (covers Intent/inputContract + Intent/outputContract jointly) and PA8 (covers Intent/role + Intent/tierHint + Capacity/tierLimit + Limit/perSet/domainFailsafes jointly). MA-St2 leaf-atomicity satisfied: one leaf per axiom condition; sub-axes provide the structural decomposition for §3.8 universal-variables purposes; axiom binding is at the axiom-condition level per G-M1.

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-VA1-input-receipt` | `axiom` | `VerificationInput shape conformance: input has authoringProgram (programId + programVersion), userId, turnId, binding (VerificationBinding shape), target (artifactRef + artifactKind), evidence (per binding.evidenceSchema), preverifyInputs — per VA1 structural property predicate` |
| `leaf-VA2-predicate-mechanical` | `axiom` | `Every VerificationPredicate p ∈ binding.predicateSet: p.groundClass ∈ substrate §6.3 six-class enum AND p.evidencePath resolves into evidence W-ATOM AND p.expectedValue conforms to groundClass-specific shape — per VA2 reference resolution + structural property` |
| `leaf-VA3-evidence-verbatim` | `axiom` | `content.evidence === input.evidence (byte-identical) AND content.evidence conforms to binding.evidenceSchema typed shape — per VA3 structural property (verbatim carry, parallel to AS ArA7)` |
| `leaf-VA4-result-decomposition` | `axiom` | `keys(content.predicateResults) === predicateIds(binding.predicateSet) (set equality, one-to-one) AND ∀ pid: content.predicateResults[pid] has populated {predicateRef, truthValue, executionState, applicability, basis, failureDetail, evaluatedAt} per F-cycle-1-3 decomposition + S4 binary truth-value — per VA4 cardinality + structural property` |
| `leaf-VA5-aggregation` | `axiom` | `content.verdict.truthValue derivation: 'verified' iff (predicateResults empty AND aggregationBasis declares vacuous-pass) OR (∀ pid: predicateResults[pid].truthValue === 'passed' AND predicateResults[pid].applicability === 'applicable'); 'failed' iff ∃ pid: predicateResults[pid].truthValue === 'failed' AND content.verdict.failedPredicateIds populated with that subset; null iff any predicateResults[pid].executionState === 'not-yet-run' — per VA5 structural property (derived field correctness)` |
| `leaf-VA6-binding-resolution` | `axiom` | `content.binding === input.binding (verbatim) AND every PredicateId, evidencePath reference, failsafe key in binding resolves within binding's own declarations — per VA6 reference resolution` |
| `leaf-VA7-target-capture` | `axiom` | `content.target.artifactRef === input.target.artifactRef AND content.target.artifactKind === input.target.artifactKind AND content.target.capturedAt is non-null EpochMs at emission — per VA7 structural property (target captured for replay + VA9 self-application)` |
| `leaf-VA8-immutability` | `axiom` | `For persisted VerificationArtifactContent V: AS-v2.2-ArA5-grounded mutation rejection on V.binding, V.target, V.evidence, V.predicateResults, V.verdict, V.verificationId, V.verificationVersion, V.producedBy, V.producedAt — per VA8 structural property (mutation-rejection propagated from AS v2.2 ArA5)` |
| `leaf-VA9-self-application` | `axiom` | `VerificationArtifactContent satisfies VerificationInput when its own shape is wrapped: a well-formed VerificationArtifactContent V can be the source of a VerificationInput V' where V'.target.artifactRef = ref(V) AND V'.target.artifactKind = 'verification' AND V'.evidence = V (the inner VerificationArtifactContent serving as evidence to its own re-verification). The re-verification produces V'' whose verdict reports V's well-formedness as a verification artifact. Recursion bound: VS guarantees one-step closure (V → V'') only; descent V'' → V''' is consumer-owned per §1 scopeOut — per VA9 reference resolution + structural property` |

### §3.6 P4 Axiom instances (VA1..VA9)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). One axiom per VS-local axis (1:1 mapping per brief), with VA9 closing self-application as the verificative-mode-specific invariant.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **VA1** | `Input` / `leaf-VA1-input-receipt` | Every `VerificationInput` consumed by VS conforms to the typed shape declared at §2.1: `authoringProgram.{programId, programVersion}`, `userId`, `turnId`, `binding: VerificationBinding`, `target: {artifactRef, artifactKind}`, `evidence` (typed per `binding.evidenceSchema`), `preverifyInputs` — all populated. | structural property (field presence per §2.1 schema) |
| **VA2** | `Predicate` / `leaf-VA2-predicate-mechanical` | Every `VerificationPredicate p ∈ binding.predicateSet` declares `p.groundClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'}` (substrate §6.3 six-class enum), `p.evidencePath` is a resolvable path into the evidence W-ATOM, `p.expectedValue` conforms to the groundClass-specific shape, and `p.failureSurface` is a non-empty string. | reference resolution (groundClass enum + path resolution + expectedValue shape conformance) |
| **VA3** | `Evidence` / `leaf-VA3-evidence-verbatim` | `content.evidence` is byte-identical to `input.evidence` (verbatim carry, parallel to AS v2.2 ArA7), AND `content.evidence` conforms to the typed shape declared at `content.binding.evidenceSchema`. | structural property (identity over input.evidence + typed-shape conformance) |
| **VA4** | `Verdict` / `leaf-VA4-result-decomposition` | `keys(content.predicateResults)` equals `{p.predicateId : p ∈ content.binding.predicateSet}` (one-to-one set equality), AND for every `pid` in keys: `content.predicateResults[pid]` has populated fields `{predicateRef, truthValue ∈ {'passed', 'failed', null}, executionState ∈ {'not-yet-run', 'executed'}, applicability ∈ {'applicable', 'n/a'}, basis (non-null when applicability='n/a' per MA-V11), failureDetail (non-null when truthValue='failed'), evaluatedAt}` per substrate §10.1 S4 + cycle-1 F-cycle-1-3 decomposition. | cardinality + structural property (set equality + per-entry field presence) |
| **VA5** | `Aggregation` / `leaf-VA5-aggregation` | `content.verdict.truthValue` is derived from `content.predicateResults` per the all-must-pass rule: `'verified'` iff (`content.predicateResults` is empty AND `content.verdict.aggregationBasis` declares vacuous-pass per substrate §6.3 cardinality semantics) OR (every `pid` in keys satisfies `predicateResults[pid].truthValue === 'passed'` AND `predicateResults[pid].applicability === 'applicable'`); `'failed'` iff some `pid` satisfies `predicateResults[pid].truthValue === 'failed'`, with `content.verdict.failedPredicateIds` populated as the subset of failing predicate IDs; `null` iff any `predicateResults[pid].executionState === 'not-yet-run'`. | structural property (derived-field correctness predicate) |
| **VA6** | `Predicate` (cross-axis with `Aggregation` for binding-resolution closure) / `leaf-VA6-binding-resolution` | `content.binding === input.binding` (verbatim), AND every `PredicateId` referenced in `content.predicateResults` resolves to a `VerificationPredicate` in `content.binding.predicateSet`, AND every `evidencePath` in `binding.predicateSet` resolves into `content.evidence`, AND every failsafe key referenced in `binding.failsafes` resolves within `binding.failsafes`. | reference resolution (multi-source closure) |
| **VA7** | `Input` (cross-axis with persisted shape via `target` capture) / `leaf-VA7-target-capture` | `content.target.artifactRef === input.target.artifactRef` (verbatim reference carry), `content.target.artifactKind === input.target.artifactKind`, AND `content.target.capturedAt` is a non-null `EpochMs` populated at emission (target snapshot timestamp present). | structural property (verbatim-carry triple + non-null timestamp) |
| **VA8** | `Verdict` (immutability scope spans full content per AS ArA5 propagation) / `leaf-VA8-immutability` | Once a `VerificationArtifactContent` V is emitted (captured as AS companion data), V is immutable. Re-verification produces a new `VerificationArtifactContent` with a new `verificationId` and new `verificationVersion`. Mutation attempts on V's fields (`binding`, `target`, `evidence`, `predicateResults`, `verdict`, `verificationId`, `verificationVersion`, `producedBy`, `producedAt`) are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). | structural property (mutation-rejection predicate on persisted content; propagated from AS v2.2 ArA5) |
| **VA9** | `Self-application` / `leaf-VA9-self-application` | A well-formed `VerificationArtifactContent V` is a valid `VerificationInput` source for a subsequent VS invocation: VS invoked with `input.target.artifactRef = ref(V)`, `input.target.artifactKind = 'verification'`, and `input.evidence = V` (the inner content) produces a `VerificationArtifactContent V''` whose verdict reports V's well-formedness as a verification artifact. The closure is one-step: V → V''. Deeper descent (V'' → V''') is consumer-owned per §1 scopeOut and is not a VS invariant. | reference resolution (V structurally reachable as input.evidence under VA1) + structural property (one-step closure termination) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. VA6 attaches at `Predicate` with cross-axis closure note; VA7 attaches at `Input` with capture-into-content note; VA8 attaches at `Verdict` (immutability scopes the persisted content under that closure). MA-St11 cross-axis-invariant declared at substrate §9 permits this; G-G13 cross-axis universal at metaframework §3.2.1 governs. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set is the v1.0 baseline (no predecessor — VS v1.0 is fresh L3 framework per §1.1 GenesisDeclaration). VA1..VA9 declared once; future versions amend additively per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "VS Mode = verificative per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). VS has zero P8 instances per substrate §8.6 empty-declaration derivation.

   Scope note: VS's verification pipeline is owned upstream by the authoring program (pre-schema.input). VS declares the typed shape that pipeline produces (VerificationArtifactContent); it does not declare the procedure that produces it. VS's emission-time validity is enforced mechanically by the VA1..VA9 gate bundle at the AS v2.2 carrier invocation site (§6.11) — that gate execution is AS's P8 S2, not VS's P8.

   Spec §Constraints language ('P8 declaration permitted but not required; if declared, justify per PR4/PR5') is resolved under substrate precedence: P8 is structurally absent for VS. PR4 (stage monotonicity) and PR5 (stage-content-kind alignment) do not apply to an empty set. This pattern parallels Plan v2.2 §3.7 P8 empty-declaration, substituting verificative for structural."
}
```

PR4 / PR5 self-checks vacuous (empty P8 set).

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four universal variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Input` | `Semver` (bound to `VerificationArtifactContent.verificationVersion` — input shape stamped at emission per VA7) | `string` enum (extensible) `'plan' \| 'run-report' \| 'verification' \| <domain>` (bound to `target.artifactKind`) | `VerificationInput.target.artifactRef: ArtifactRef` paired with `VerificationInput.binding: VerificationBinding` (dual reference per input — target identifies the verified, binding identifies the verifier-contract) | `VerificationShapePositional` enum `'pending' \| 'received' \| 'rejected'` (declared §3.9 vocabulary) |
| `Predicate` | `Semver` (bound to `VerificationBinding.domainVersion` — predicate set is binding-versioned) | `PredicateGroundClass` enum `'type-check' \| 'enum-membership' \| 'reference-resolution' \| 'structural-property' \| 'cardinality' \| 'deterministic-function-result'` (substrate §6.3 six-class taxonomy by VA2 binding) | `VerificationPredicate.evidencePath: string` paired with `VerificationBinding.evidenceSchema: TypedAtomSchema` (per-predicate evidence-path resolves against binding-declared evidence schema per VA2 + VA6) | `VerificationPredicatePositional` enum `'declared' \| 'evaluating' \| 'evaluated'` (declared §3.9) |
| `Evidence` | `Semver` (bound to `VerificationBinding.domainVersion` — evidence schema is binding-versioned) | `string` (typed-shape ref to `binding.evidenceSchema`; opaque to VS by VA3 verbatim-carry) | `VerificationInput.evidence: unknown` paired with `VerificationArtifactContent.evidence: unknown` (verbatim-carry pair per VA3, byte-identical) | `VerificationEvidencePositional` enum `'received' \| 'persisted'` (declared §3.9) |
| `Verdict` | `EpochMs` (bound to `predicateResults[].evaluatedAt` per entry — per-predicate result timestamp) | `'passed' \| 'failed' \| null` (per-predicate truthValue per substrate §10.1 S4 binary; null only when executionState='not-yet-run' per F-cycle-1-3 decomposition) | `PredicateId` (key into `predicateResults`) paired with `VerificationPredicate` (resolves into `binding.predicateSet` per VA4 one-to-one set equality) | `VerificationVerdictPositional` enum `'pending' \| 'partial' \| 'complete'` (declared §3.9; complete iff all predicateResults executionState='executed') |
| `Aggregation` | `Semver` (bound to `VerificationArtifactContent.verificationVersion` — aggregation rule version-stamped at emission) | `VerificationAggregationKind` enum `'all-must-pass-with-vacuous-pass-on-empty'` (single member at v1.0; additive per S3 — future kinds enter via amendment when first L4 tenant requires) | `VerificationArtifactContent.predicateResults: PredicateResultMap` paired with `VerificationArtifactContent.verdict.truthValue: 'verified' \| 'failed' \| null` (input-pair derivation: predicateResults aggregates into verdict per VA5 derivation predicate) | `VerificationVerdictPositional` (shared with Verdict axis — aggregation positional state mirrors Verdict completeness; aggregated verdict reachable only when Verdict is `'complete'`) |
| `Self-application` | `Semver` (bound to `VerificationArtifactContent.verificationVersion` of the inner V; outer V'' carries its own version) | `string` enum `'verification'` (singleton — `target.artifactKind = 'verification'` at the self-application boundary, distinguishing self-applied from base verification) | `VerificationArtifactContent V` paired with `VerificationArtifactContent V''` where `V''.target.artifactRef = ref(V)` AND `V''.evidence = V` (input-output structural pair per VA9 one-step closure) | `VerificationSelfApplicationPositional` enum `'base' \| 'self-applied' \| 'recursive-deferred'` (declared §3.9; `base` for first-tier verification; `self-applied` for one-step closure; `recursive-deferred` for descent beyond one step, owned by consumer per §1 scopeOut) |

Every cell is a named type, an enum literal set, an inlined type shape, or a declared type-to-type paired reference. No prose cells. No arrow notation at the content level (relational column uses named-type-to-named-type declarations via explicit field references).

**MA-St3 self-check:** no content appears under more than one axis. Verdict and Aggregation share `VerificationVerdictPositional` as Positional declaration with explicit cross-axis reuse note (Aggregation's positional state is derived from Verdict completeness — declared cross-axis invariant per substrate §9 cross-axis-invariant rule, not duplication). Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `predicate-evaluation` | §1 primitive | atomic unit of work in VS: one predicate evaluated against evidence producing one PredicateResultEntry; framework-local atomic operation analogous to Plan's `declaration` |
| `verification` | §2.2 output | act of running every predicate in `binding.predicateSet` against `evidence` and aggregating per VA5 into a verdict; emitted as one `VerificationArtifactContent` |
| `VerificationBinding` | §2.2 + `verification-standard.types.ts` | VS-defined type shape; domain standard fills instance values; captured verbatim at emission |
| `VerificationPredicate` | §2.7 + `verification-standard.types.ts` | typed shape per VA2: `{predicateId, groundClass, evidencePath, expectedValue, failureSurface}`; one entry per predicate in `binding.predicateSet` |
| `predicate set` | §3.3 `Predicate/predicateSet` | array of `VerificationPredicate` instances supplied by `VerificationBinding`; cardinality unbounded; predicate IDs unique within set |
| `evidence` | §3.3 `Evidence` | data that predicates evaluate against; typed per `binding.evidenceSchema`; verbatim-carried per VA3 (parallel to AS ArA7 payload-verbatim) |
| `predicate result` | §3.3 `Verdict/predicateResults` | per-predicate evaluation outcome: `{predicateRef, truthValue, executionState, applicability, basis, failureDetail, evaluatedAt}` per VA4 cycle-1-decomposed shape |
| `verdict` | §3.3 `Aggregation` | artifact-level closure: `{truthValue ∈ {'verified', 'failed', null}, aggregationBasis, failedPredicateIds}` derived from `predicateResults` per VA5 |
| `aggregation rule` | §3.3 `Aggregation/all-must-pass` | derivation procedure mapping `predicateResults` → `verdict.truthValue` per VA5; v1.0 declares one rule (`'all-must-pass-with-vacuous-pass-on-empty'`); enum extensible per S3 |
| `re-verification` | §3.6 VA8 | production of a new `VerificationArtifactContent` with new `verificationId` + new `verificationVersion` in response to upstream change (e.g., target re-emitted, predicate set amended); old content remains immutable per VA8 |
| `self-application closure` | §3.6 VA9 | one-step idempotence of VS over `VerificationArtifactContent`: V → V'' where V'' verifies V's well-formedness; recursion bound at one step (consumer owns descent) |
| `target` | §2.2 `target` field | reference to the artifact under verification: `{artifactRef, artifactKind, capturedAt}`; required for replay (per VA7) and self-application (per VA9) |
| `VerificationShapePositional` | §3.8 | enum `'pending' \| 'received' \| 'rejected'` — Input axis lifecycle position |
| `VerificationPredicatePositional` | §3.8 | enum `'declared' \| 'evaluating' \| 'evaluated'` — Predicate axis lifecycle position |
| `VerificationEvidencePositional` | §3.8 | enum `'received' \| 'persisted'` — Evidence axis lifecycle position |
| `VerificationVerdictPositional` | §3.8 | enum `'pending' \| 'partial' \| 'complete'` — Verdict + Aggregation axis lifecycle position (shared per declared cross-axis reuse) |
| `VerificationSelfApplicationPositional` | §3.8 | enum `'base' \| 'self-applied' \| 'recursive-deferred'` — Self-application axis lifecycle position |
| `VerificationAggregationKind` | §3.8 | enum `'all-must-pass-with-vacuous-pass-on-empty'` (singleton at v1.0; additive per S3) |
| `PredicateGroundClass` | §3.8 | enum binding `VerificationPredicate.groundClass` to substrate §6.3 six-class taxonomy: `'type-check' \| 'enum-membership' \| 'reference-resolution' \| 'structural-property' \| 'cardinality' \| 'deterministic-function-result'` |

---

## §4 Validity

### §4.1 Gate count

VS declares **9 own primary gates** (G-VS1 .. G-VS9, 1:1 with VA1..VA9 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates including cycle-1 G-S7+G-V11 and cycle-2 G-V10+G-S8+G-L11 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when VS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| VS-own axiom gates (G-VS*) | 9 | this §4.2 | framework-audit applies VA1..VA9 suite per MA-V1; emission-time on each VerificationArtifactContent |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test VS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **9 + 85 = 94** | | |

VS's own 9 gates are executed in addition to the 85 inherited — same pattern as AS v2.2 §4.1 + Plan v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite).

### §4.2 VS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 9 axioms → 9 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-VS1** | VA1 | `typeof input.authoringProgram.programId === 'string' AND typeof input.authoringProgram.programVersion === 'string' AND matches(input.authoringProgram.programVersion, semverRegex) AND typeof input.userId === 'string' AND typeof input.turnId === 'string' AND input.binding satisfies VerificationBinding shape AND input.target.artifactRef satisfies ArtifactRef shape AND typeof input.target.artifactKind === 'string' AND input.evidence !== undefined AND input.preverifyInputs !== undefined` | structural property (field presence + typed-shape conformance per §2.1) |
| **G-VS2** | VA2 | `forall p ∈ content.binding.predicateSet: p.groundClass ∈ {'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result'} AND resolvePath(p.evidencePath, content.evidence) !== undefined AND validateExpectedShape(p.expectedValue, p.groundClass) === true AND typeof p.failureSurface === 'string' AND p.failureSurface.length >= 1` | reference resolution (groundClass enum membership + evidencePath resolution + expectedValue shape conformance) |
| **G-VS3** | VA3 | `byteIdentical(content.evidence, input.evidence) === true AND validateAgainstSchema(content.evidence, content.binding.evidenceSchema) === true` | structural property (identity over input.evidence + typed-shape conformance) |
| **G-VS4** | VA4 | `setEqual(keys(content.predicateResults), {p.predicateId : p ∈ content.binding.predicateSet}) === true AND forall pid ∈ keys(content.predicateResults): let r = content.predicateResults[pid]; r.predicateRef === pid AND r.truthValue ∈ {'passed', 'failed', null} AND r.executionState ∈ {'not-yet-run', 'executed'} AND r.applicability ∈ {'applicable', 'n/a'} AND (r.applicability === 'n/a' implies r.basis !== null AND r.basis.length >= 1) AND (r.truthValue === 'failed' implies r.failureDetail !== null) AND typeof r.evaluatedAt === 'number' AND ((r.executionState === 'not-yet-run') === (r.truthValue === null))` | cardinality + structural property (set equality + per-entry field presence + S4 + MA-V11 invariants) |
| **G-VS5** | VA5 | `let allExecuted = forall pid ∈ keys(content.predicateResults): content.predicateResults[pid].executionState === 'executed'; let allPassed = allExecuted AND forall pid: content.predicateResults[pid].truthValue === 'passed' AND content.predicateResults[pid].applicability === 'applicable'; let anyFailed = exists pid: content.predicateResults[pid].truthValue === 'failed'; let isEmpty = keys(content.predicateResults).length === 0; let derivedTruthValue = isEmpty ? (content.verdict.aggregationBasis declares vacuous-pass ? 'verified' : null) : (anyFailed ? 'failed' : (allExecuted ? 'verified' : null)); content.verdict.truthValue === derivedTruthValue AND (content.verdict.truthValue === 'failed' implies setEqual(content.verdict.failedPredicateIds, {pid : content.predicateResults[pid].truthValue === 'failed'})) AND typeof content.verdict.aggregationBasis === 'string' AND content.verdict.aggregationBasis.length >= 1` | structural property (derived-field correctness predicate) |
| **G-VS6** | VA6 | `byteIdentical(content.binding, input.binding) === true AND forall pid ∈ keys(content.predicateResults): exists p ∈ content.binding.predicateSet: p.predicateId === pid AND forall p ∈ content.binding.predicateSet: resolvePath(p.evidencePath, content.evidence) !== undefined AND forall fk ∈ keys(content.binding.failsafes): typeof content.binding.failsafes[fk] === 'object'` | reference resolution (verbatim equality + multi-source closure) |
| **G-VS7** | VA7 | `byteIdentical(content.target.artifactRef, input.target.artifactRef) === true AND content.target.artifactKind === input.target.artifactKind AND typeof content.target.capturedAt === 'number' AND content.target.capturedAt > 0` | structural property (verbatim-carry + non-null timestamp) |
| **G-VS8** | VA8 | For persisted `VerificationArtifactContent` V: Living Memory mutation attempts on `V.binding`, `V.target`, `V.evidence`, `V.predicateResults`, `V.verdict`, `V.verificationId`, `V.verificationVersion`, `V.producedBy`, `V.producedAt` properties are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). | structural property (mutation-rejection propagated from AS v2.2 ArA5) |
| **G-VS9** | VA9 | `let V = content; let Vprime_input = synthesizeVerificationInput(V); Vprime_input.target.artifactRef === ref(V) AND Vprime_input.target.artifactKind === 'verification' AND byteIdentical(Vprime_input.evidence, V) === true AND validateInputShape(Vprime_input) === true (per VA1 / G-VS1) AND oneStepClosureTerminates(V, Vprime_input) === true (mechanical: re-invocation of VS on Vprime_input produces a finite VerificationArtifactContent V'' without re-entering V''')` | reference resolution (V structurally reachable as Vprime_input.evidence under VA1) + structural property (one-step closure termination predicate) |

**G-M1 self-check:** 9 axioms → 9 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Input has 2 gates (G-VS1, G-VS7 — VA7 attaches at Input cross-axis); Predicate has 2 gates (G-VS2, G-VS6 — VA6 attaches at Predicate cross-axis); Evidence has 1 gate (G-VS3); Verdict has 3 gates (G-VS4, G-VS5, G-VS8 — VA8 attaches at Verdict cross-axis); Aggregation has 1 gate (G-VS5 shared with Verdict per VA5 cross-axis derivation note); Self-application has 1 gate (G-VS9). Every VS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs VS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests VS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests VS's §2 Schema conformance to MA-S1..MA-S8 (cycle-2 G-S8 ReferentCitation declaration shape conformance — VS declares `referentCitations: []` per §1; G-S8 vacuous-pass).
- **E3 Structure (PG3 + G-St1..G-St16):** tests VS's §3 Structure conformance to MA-St1..MA-St16.
- **E4 Validity (PG4 + G-V1..G-V11):** tests VS's §4 Validity conformance to MA-V1..MA-V11 (cycle-2 G-V10 spec↔referent + cycle-1 G-V11 applicability-basis vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests VS's §5 Lifecycle conformance to MA-L1..MA-L11 (cycle-2 G-L11 audit-run snapshot stamping vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests VS's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests VS's §7 Judgment conformance to MA-J1..MA-J5 (P7=0 empty-declared per §3.2 + §7.1).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests VS's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus VS's own 9 G-VS* gates execute against the emitted `VerificationArtifactContent` at emission time (and at framework-audit re-verification). Total per-audit framework-tier gates when VS is target: 94 (85 + 9).

**Disambiguation note on gate execution scope:**
The 85 inherited gates test VS's **framework declaration conformance** (does VS's §1–§7 structure match metaframework's axioms?). The 9 G-VS* gates test **individual VerificationArtifactContent instance conformance** (does a given emitted verification artifact satisfy VA1..VA9?). Different scopes, different execution sites — the 85 run at framework-audit time against this file; the 9 run at emission-time on each VerificationArtifactContent the authoring program produces.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover VS's validity surfaces:

| Dimension | VS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=0 empty-declared mechanical); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (8 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-VS3 to AS v2.2 |
| X10 (Stage-declaration extended predicate) | §3.7 empty-P8 declaration + its basis traversal per substrate §10.2 PR4/PR5 vacuous |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 9 VS-own (G-VS*) = 78.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to VS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 94 framework-tier gates (85 inherited + 9 VS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0-confirmation (§5.3). Gate IDs enumerated:

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

VS-own (9): `G-VS1, G-VS2, G-VS3, G-VS4, G-VS5, G-VS6, G-VS7, G-VS8, G-VS9`.

Substrate-tier gates (SG1–SG5) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). VS is a fresh L3 framework with no predecessor (per §1.1 GenesisDeclaration `predecessorVersion: null`). Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: nine axioms (VA1..VA9) declared; VerificationBinding shape declared with zero domain instances at v1.0 (F-verify slice supplies smoke binding at Sprint 4 close; full LIV-Standard 153-predicate binding lands in subsequent cycle (Sprint 4.x) post pre-pass classification work); `referentCitations: []` declared with basis per Cognitive v1.2.2 precedent; carrier pinned to Artifact Standard v2.2 (structural symmetry with Plan v2.2). Generation path: generation-procedure-v1-0 v1.1.6 S1–E8 template-generation under metaframework-v3-1 v3.2.7.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 3 closure + Phase 7 critical-path gate clearance per LIV deploy state. Driving findings: (i) Phase 7 of LIV beta build gated on Verification Standard authoring (per Demos handoff brief 2026-04-30); (ii) Plan v2.2 + M-I v2.3 + Cognitive v1.2.2 closed at Sprint 3 establishing the L3 mode-primitive triad (structural + generative); the verificative-mode L3 sibling completes the triad-of-three (epistemic at L3 deferred post-beta per Cycle Brief deferrals); (iii) cycle-2 spec↔referent infrastructure (substrate v1.6 atoms A-18/A-19/A-20 + MF v3.2.7 axioms MA-V10/MA-S8/MA-L11) is now available — VS authored against it consumes the slot from inception rather than retrofitting.

### §5.3 Confirmation gate

Pending L0 at v1.0 closure. Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. VS declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| Input receipt (HR-VS1 / HR-VS2) | Schema violation on `VerificationInput` or `VerificationBinding` shape | authoring program returns `Result { ok: false, error: VerificationValidityError { code: 'VERIFICATION_INPUT_INVALID' } }`; no AS emission invoked |
| Emission-time validity (G-VS1..G-VS9) | Any G-VS* gate fails on proposed `VerificationArtifactContent` | authoring program returns `Result { ok: false, error: VerificationValidityError { code: 'VERIFICATION_VALIDITY_FAILED', failedAxiom: 'VA<n>' } }`; no AS emission invoked |
| Carrier emission (HR-VS3 → AS v2.2) | AS v2.2 gate failure (G-Ar*, PG*, G-U*, G-M*) | AS returns `ArtifactError`; authoring program surfaces as `VerificationValidityError { code: 'VERIFICATION_EMISSION_REJECTED' }` |
| Post-emission read (HR-VS4) | Living Memory one-hop query returns `null` for `verificationAnchorNodeId` | consumer (observability/replay/audit) surfaces as read failure per their own framework's error discipline; VS has no further recovery |
| Self-application closure failure (VA9 / G-VS9) | One-step closure does not terminate (V'' produces V''' invocation within the same operation) | authoring program returns `VerificationValidityError { code: 'VERIFICATION_SELF_APPLICATION_NONTERMINATING', failedAxiom: 'VA9' }`; descent beyond one step is consumer-owned per §1 scopeOut and is not VS's recovery surface |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-verification predicate count: bounded by authoring program's scale policy (no VS-framework hard cap; binding declares the predicate set, VS evaluates without splitting).
- Per-verification evidence size: bounded by `binding.evidenceSchema` instance size (domain-declared; VS shape permits arbitrary opaque evidence W-ATOM size).
- Per-emission gate execution: O(|binding.predicateSet|) — one G-VS4 entry per predicate, one G-VS5 aggregation pass; linear in predicate count.
- Self-application closure: O(1) at the VS axiom level (one-step bound); deeper recursion is consumer-owned per §1 scopeOut and is not in VS's scale envelope.

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations`:

- VS composition (authoring program ownership): non-atomic; authoring program owns transaction boundary.
- VS validity gate execution (G-VS1..G-VS9): atomic per-verification (all-or-nothing validation; no partial-pass emission).
- AS carrier emission (HR-VS3): atomicity inherited from AS v2.2 atomicity declaration (AS emission is atomic per substrate §13.4).
- Post-emission immutability (VA8): enforced by AS v2.2 ArA5 at the companion node (which holds the full `VerificationArtifactContent` payload).
- Self-application closure (VA9): atomic per-V; closure invocation is one operation producing one V''.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-04-30 (Sprint 3 closure / Phase 7 gate clearance) | Initial declaration. Six VS-local P1 axes (Input, Predicate, Evidence, Verdict, Aggregation, Self-application). Nine axioms VA1..VA9 with VA9 closing self-application. Nine paired gates G-VS1..G-VS9 (1:1 per G-M1). Four HRs (HR-VS1..HR-VS4) with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) + P8=0 (Mode=verificative, substrate §8.3 binding) positive empty-declarations. Carrier = named → Artifact Standard v2.2 (structural symmetry with Plan v2.2). VerificationBinding shape declared with zero domain instances at v1.0 (F-verify Sprint 4 supplies LIV-Standard binding). `referentCitations: []` per Cognitive v1.2.2 precedent. Provenance reference-default per A-20. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. | L0 (pending v1.0 confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Verification Standard carrier = `named` → `artifact-standard` v2.2. VS declares payload content only (`VerificationArtifactContent`); does not emit carrier mechanics. Emission call pattern: authoring program invokes AS v2.2 `createArtifact` with `framework = { id: 'verification', version: '1.0' }` and `payload = { domain: 'verification', domainVersion: '1.0', schemaRef: 'VerificationArtifactContent', content: <VerificationArtifactContent> }` and receives `ArtifactEmission`. See §6.11 carrier relation.

**Cross-framework calibration:** Carrier version bound to Artifact Standard v2.2. This is the cross-framework calibration point per spec §Cross-framework calibration. Structural symmetry with Plan v2.2: VS and Plan are the structural+verificative L3 mode-primitive pair, both carriered through AS v2.2.

### §6.2 Handoff rules

Four framework-local HR instances. All VS-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-VS4 where `diagnosticSignificance = false` → captured via HR-VS3 + HR-Ar2 Living Memory write).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-VS1** | authoring-program → verification-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-VS2** | domain-standard → verification-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-VS3** | verification-standard → artifact-standard (v2.2) | `['named']` (VS's own carrier = named) | `true` | declared §6.3 |
| **HR-VS4** | verification-standard → consumer (observability / replay / audit / downstream VS for VA9) | `['named']` | `false` | n/a (consumer reads via AS `verificationAnchorNodeId`; capture via HR-VS3 + AS-v2.2 HR-Ar2) |

**Inherited HRs referencing VS:**

| HR | Owning declaration | VS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → VS type consumption; VS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; VS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records VS's framework declaration per provenance contract (see §6.6) |
| HR-Ar3 | artifact-standard-v2-2 §6.2 | content-framework → artifact-standard; VS is one content framework invoking AS v2.2 `createArtifact` at HR-VS3 |
| HR-Ar4 | artifact-standard-v2-2 §6.2 | artifact-standard → content-framework; VS receives `ArtifactEmission` receipt after AS emits VS's carrier |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by VS.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-VS1 — authoring program → VS (VerificationInput receipt):**
```
captureShape = {
  capturedFields: ['authoringProgram.programId', 'authoringProgram.programVersion', 'userId', 'turnId', 'verificationId', 'target.artifactRef', 'target.artifactKind', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-VS2 — domain standard → VS (VerificationBinding consumption):**
```
captureShape = {
  capturedFields: ['domainId', 'domainVersion', 'bindingHash', 'predicateSetCardinality', 'consumedAtVerificationId', 'turnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; binding resolution by (domainId, domainVersion, bindingHash)'
}
```

**HR-VS3 — VS → Artifact Standard v2.2 (carrier emission invocation):**
```
captureShape = {
  capturedFields: ['verificationId', 'verificationVersion', 'framework.id', 'framework.version', 'payload.domain', 'payload.domainVersion', 'asEmissionId', 'target.artifactRef', 'verdict.truthValue', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; verification anchor resolved via AS v2.2 ArtifactEmission.writes.a7.artifactAnchorNodeId → verificationAnchorNodeId'
}
```

**HR-VS4:** no captureShape declared (`diagnosticSignificance: false`); receipt-only contract; diagnostic data captured at HR-VS3 invocation and via AS v2.2 HR-Ar2 Living Memory write.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'named'` with bound framework ref `artifact-standard` v2.2.
- **MA-C2** (custody per atom): §6.5 enumerates every VS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-VS1..HR-VS4 send/receive shapes matched by construction; captureShape contracts symmetric with HR-Ar3 (receive-side at AS v2.2).
- **MA-C4** (provenance per output field): §2.2 every `VerificationArtifactContent` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'named'` → output rides inside named carrier's artifact per MA-S2; §2.2 `VerificationArtifactContent` populates `ArtifactPayload.content` at HR-VS3.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; AS v2.2 atoms referenced at §2.5 are not re-owned (custody remains with artifact-standard); substrate / primitives.ts / metaframework atoms referenced at §2.3, §2.4, §2.6 not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | verification-standard (verificationAnchorNodeId via AS emission), every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | verification-standard (§2.1 VerificationInput.userId), every session-aware framework |
| `Semver` | primitives.ts | core/R5 | verification-standard (§1 version, §2 producedBy.programVersion, §2 binding.domainVersion, §2 verificationVersion), every versioned framework |
| `EpochMs` | primitives.ts | core/R5 | verification-standard (§2.2 producedAt + target.capturedAt + predicateResults[].evaluatedAt), every time-stamping framework |
| `Result<T, E>` | primitives.ts | core/R5 | verification-standard (§2.2 VerificationEmissionResult), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | verification-standard (§2.2 VerificationValidityError extends), every error-carrying framework |
| `CognitivePrimitive` | primitives.ts | core/R5 | verification-standard (referenced at §2.5 cross-framework notes re: AS CreateArtifactInput.primitive field populated by authoring program via Cognitive Standard encodeLLM) |
| `Mode` | substrate | L1 (substrate §2) | verification-standard (§1 Identity `Mode = verificative`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | verification-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | verification-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | verification-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | verification-standard (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | verification-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | verification-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed) | verification-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed) | verification-standard (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | verification-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed) | verification-standard (inherited via HR-VS1 authoring-program invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed) | verification-standard (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed) | verification-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | verification-standard (§3.7 P8 empty-declaration basis; Mode-binding rule cited) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | verification-standard (§3.7 same basis) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | verification-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | verification-standard (not directly consumed; declared empty per §3.2 P7=0; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | verification-standard (empty-declaration basis per MA-J4) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | verification-standard (§3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | verification-standard (§1 Identity referentCitations row declared empty at v1.0) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | verification-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | verification-standard (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | verification-standard (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | verification-standard (§8.2 dimension results schema reference) |
| `ArtifactPayload` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | verification-standard (§2.2 VerificationArtifactContent rides as `ArtifactPayload.content`) |
| `ArtifactEmission` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | verification-standard (§6.11 carrier emission produces this W-ATOM; §2.2 VerificationEmissionResult success value) |
| `CreateArtifactInput` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | verification-standard (§6.11 authoring program constructs at VS→AS boundary) |
| `ArtifactEdgeKind` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | verification-standard (§6.11 dependency-edge reference: VS anchor → target.artifactRef per ArA4d) |
| `ArtifactRef` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | verification-standard (§2.1 VerificationInput.target.artifactRef + §2.2 VerificationArtifactContent.target.artifactRef) |
| `PredicateId` | verification-standard | L3 (this file §2 + core/R5) | verification-standard (internal — keys of predicateResults), domain standards (declare predicate IDs in binding.predicateSet) |
| `VerificationId` | verification-standard | L3 (this file §2 + core/R5) | verification-standard (internal), framework-audit (audit trail), observability/replay |
| `VerificationPredicate` | verification-standard | L3 (this file §2 + §3.6 + core/R5) | verification-standard (internal), domain standards (instance values in binding.predicateSet) |
| `VerificationBinding` | verification-standard | L3 (this file §2 + core/R5) | verification-standard (shape owner); instance values owned per-domain by domain standard (LIV-Standard, Research, etc. — zero instances at v1.0); captured verbatim in VerificationArtifactContent per VA8 |
| `VerificationInput` | verification-standard | L3 (this file §2.1 + core/R5) | verification-standard (internal), authoring programs (construct at caller site: F-verify, F-research-verify, etc.) |
| `VerificationArtifactContent` | verification-standard | L3 (this file §2.2 + core/R5) | verification-standard (internal), artifact-standard (carries as `ArtifactPayload.content`), observability / replay / audit / downstream VS instances (VA9 self-application input) |
| `VerificationTarget` | verification-standard | L3 (this file §2.2 + core/R5) | verification-standard (internal — content.target field shape) |
| `PredicateResultEntry` | verification-standard | L3 (this file §2.2 + core/R5) | verification-standard (internal — content.predicateResults entry shape) |
| `PredicateResultMap` | verification-standard | L3 (this file §2.2 + core/R5) | verification-standard (internal — content.predicateResults map shape) |
| `VerificationVerdict` | verification-standard | L3 (this file §2.2 + core/R5) | verification-standard (internal — content.verdict field shape) |
| `PredicateGroundClass` | verification-standard | L3 (this file §3.8 + core/R5) | verification-standard (internal), domain standards (declare per-predicate groundClass values) |
| `VerificationShapePositional` / `VerificationPredicatePositional` / `VerificationEvidencePositional` / `VerificationVerdictPositional` / `VerificationSelfApplicationPositional` | verification-standard | L3 (this file §3.8 + core/R5) | verification-standard (internal), framework-audit |
| `VerificationAggregationKind` | verification-standard | L3 (this file §3.8 + core/R5) | verification-standard (internal); future amendments may extend per S3 |
| `VerificationHandoffRuleInstance` | verification-standard | L3 (this file §6.2 + core/R5) | verification-standard (internal), framework-audit (X3 C5 captureShape check) |
| `VerificationGateResult` | verification-standard | L3 (§4 + core/R5) | verification-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `VerificationDimensionResult` | verification-standard | L3 (§4.4 + core/R5) | verification-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `VerificationCustodyRow` | verification-standard | L3 (§6.5 + core/R5) | verification-standard (internal), framework-audit (custody-check X2/X5) |
| `VerificationValidityError` | verification-standard | L3 (§2 + core/R5) | verification-standard (internal); extends primitives.ts `AppError` |
| `VerificationEmissionResult` | verification-standard | L3 (§2 + core/R5) | verification-standard (emission surface), authoring programs (consume at HR-VS3 return) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-04-30T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput
  sourceInputValue:         undefined                       // by-value opt-in flag not set
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in. Not opted in at this cycle.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

VS carrier = `named` → `artifact-standard` v2.2. Applicability enforcement at handoff time:

- HR-VS1 carrier applicability `['self', 'named']`: authoring program's own carrier (typically `named` for F-verify/F-research-verify) ∈ set → applicable; all authoring-program carriers supported.
- HR-VS2 carrier applicability `['self', 'named']`: domain standard's own carrier (typically `self` or `named`) ∈ set → applicable.
- HR-VS3 carrier applicability `['named']`: VS's own carrier is `named`; applies exactly; VS cannot invoke HR-VS3 when carrier is `self` or `none` (not applicable by declaration — this is VS's only carrier-emission path).
- HR-VS4 carrier applicability `['named']`: consumer reads via AS `verificationAnchorNodeId`; requires VS carrier = `named` (satisfied by §6.1).

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

VS's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoint: 'authoring-program composes VerificationInput → validates VA1..VA9 → invokes AS v2.2 createArtifact at HR-VS3',
  configurationInputs:  ['VerificationBinding (per-domain)', 'authoringProgram.programId + programVersion', 'userId + turnId', 'target.artifactRef + target.artifactKind', 'evidence W-ATOM'],
  observableOutputs:    ['VerificationEmissionResult (success: ArtifactEmission with verificationAnchorNodeId; failure: VerificationValidityError with failedAxiom)'],
  errorContract:        'VerificationValidityError codes: VERIFICATION_INPUT_INVALID | VERIFICATION_VALIDITY_FAILED | VERIFICATION_EMISSION_REJECTED | VERIFICATION_SELF_APPLICATION_NONTERMINATING',
  extensibility:        'VerificationBinding shape is VS-owned; instance values per-domain; new domains added by declaring new VerificationBinding instances — no VS amendment required. PredicateGroundClass enum is substrate §6.3 six-class taxonomy — additive at substrate, not at VS.'
}
```

V5 verification: this operator interface is declaratively complete at v1.0 (every invocation path + configuration input + observable + error listed).

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | VS consumes | VS emits | HR binding |
|---|---|---|---|
| authoring program (F-verify, F-research-verify, etc.) | pre-verification inputs (target ref, evidence W-ATOM) + VerificationBinding instance + caller session context | `VerificationArtifactContent` via AS v2.2 emission | HR-VS1 (inbound); HR-VS3 (outbound) |
| domain standard (LIV-Standard, Research, etc. — zero instances at v1.0) | `VerificationBinding` instance values (predicateSet, evidenceSchema, failsafes) | — | HR-VS2 (inbound VerificationBinding) |
| Artifact Standard v2.2 | AS's `ArtifactEmission` receipt after createArtifact invocation | `VerificationArtifactContent` as `ArtifactPayload.content`; `framework.id = 'verification'`, `framework.version = '1.0'` | HR-VS3 (outbound) + HR-Ar3 (AS receive-side) + HR-Ar4 (AS receipt) |
| consumer (observability / replay / audit / downstream VS) | — | consumed via `verificationAnchorNodeId` (= `ArtifactEmission.writes.a7.artifactAnchorNodeId`) after AS emission lands in graph | HR-VS4 (outbound) |
| Living Memory | — | VerificationArtifact anchor + companion land in graph via AS v2.2's commit pipeline (VS does not invoke Living Memory directly) | (via AS v2.2 HR-Ar2) |
| Plan Standard v2.2 | (no direct handoff — VS may consume Plan-emitted PlanArtifactContent as target.artifactRef of kind 'plan'; this is `VerificationInput.target` semantics, not a VS handoff) | (no direct emission — verdict on a plan is observable via Living Memory traversal of (verification anchor → target.artifactRef) edge per ArA4d) | (consumer-mediated; no HR) |
| framework-audit v1.3.6 | (distinct concern; VS does not consume framework-audit, framework-audit does not consume VS — see §1 scopeOut) | — | (no HR; non-overlapping scopes) |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| `VerificationInput` | authoring-program constructs → HR-VS1 inbound → VS validates |
| `VerificationBinding` | domain-standard instance → `VerificationInput.binding` via HR-VS2 inbound (zero instances at v1.0) |
| `VerificationArtifactContent` | VS composes + validates → wrapped in `ArtifactPayload` → HR-VS3 outbound to AS |
| `CreateArtifactInput` (AS v2.2) | authoring-program constructs at VS→AS boundary with `payload.content = VerificationArtifactContent` → AS v2.2 `createArtifact` receives |
| `ArtifactEmission` (AS v2.2) | AS emits → VS's HR-VS3 captures receipt → authoring-program receives `VerificationEmissionResult { ok: true, data: ArtifactEmission }` |
| `verificationAnchorNodeId` | alias for `ArtifactEmission.writes.a7.artifactAnchorNodeId` | consumer consumes via HR-VS4 outbound-contract |

### §6.11 Carrier relation (H5) and boundary notes

VS `carrier = named → artifact-standard v2.2`. VS declares **content only** (`VerificationArtifactContent`). VS does **not** emit carrier mechanics. Emission call pattern (parallel to Plan v2.2 §6.11):

```
// authoring-program code (not VS code):
const verificationContent: VerificationArtifactContent = composeVerification(verificationInput)  // authoring program's work
const validityResult = runVerificationGates(verificationContent)                                  // G-VS1..G-VS9 pre-emission
if (!validityResult.ok) return validityResult                                                     // return VerificationValidityError; no AS invocation

const asInput: CreateArtifactInput = {                                                            // AS v2.2 type
  framework: { id: 'verification', version: '1.0' },                                              // VS's framework ref
  turnId:    verificationInput.turnId,                                                            // verbatim from VerificationInput
  userId:    verificationInput.userId,                                                            // verbatim from VerificationInput
  payload: {
    domain:        'verification',
    domainVersion: '1.0',
    schemaRef:     'VerificationArtifactContent',
    content:       verificationContent                                                            // VS's VerificationArtifactContent rides here
  },
  classificationNodeId: <from Cognitive Standard encodeLLM, same turn>,
  primitive:            <from Cognitive Standard encodeLLM, same turn>,
  confidence:           <from Cognitive Standard encodeLLM, same turn>,
  dependsOn:            [verificationInput.target.artifactRef]                                    // VS depends on the artifact under verification per ArA4d
}

const emissionResult: CreateArtifactResult = createArtifact(asInput)                              // AS v2.2 call
// emissionResult.ok ? data.writes.a7.artifactAnchorNodeId = verificationAnchorNodeId : map to VerificationValidityError
```

**Cross-framework calibration points (spec §Cross-framework calibration requirement):**

| VS reference site | AS v2.2 atom | Cycle-cross notes |
|---|---|---|
| §2.2 output ride-along | `ArtifactPayload.content: unknown` | AS v2.2 ArA7 verbatim-carry preserves `VerificationArtifactContent` byte-identically |
| §2.5 consumed types | `ArtifactPayload`, `ArtifactEmission`, `CreateArtifactInput`, `ArtifactRef` | all four from `artifact-standard.types.ts` |
| §6.11 `CreateArtifactInput.framework.version = '1.0'` | AS v2.2 framework version | v1.0 carrier pin to AS v2.2 |
| §6.11 `CreateArtifactInput.dependsOn: [target.artifactRef]` | AS v2.2 input.dependsOn[] | aligns with AS v2.2 ArA4d (dependency-edge-per-entry); VS always has exactly one dependency edge — to the artifact under verification |
| §6.5 custody row `verificationAnchorNodeId` | AS v2.2 `ArtifactEmission.writes.a7.artifactAnchorNodeId` | structural alias; VS names the AS field at its VS-facing consumer surface |
| §3.6 VA8 immutability propagation | AS v2.2 ArA5 mutation-rejection | VS's VA8 is enforced via AS v2.2 ArA5 at the companion node (which holds full VerificationArtifactContent payload) |
| §6.2 HR-Ar3 receive-side | AS v2.2 §6.2 HR-Ar3 | AS captures `payload.domain + payload.domainVersion + framework.id + framework.version`; VS populates with `'verification' + '1.0' + 'verification' + '1.0'` |
| §6.2 HR-Ar4 receipt | AS v2.2 §6.2 HR-Ar4 | receipt-only; no captureShape either side |
| §5.6 failure mode `VERIFICATION_EMISSION_REJECTED` | AS v2.2 `ArtifactError.code: 'ARTIFACT_*'` | VS maps AS error codes to `VerificationValidityError.code = 'VERIFICATION_EMISSION_REJECTED'` |

**Boundary notes:**

- **Re-verification semantics** (VA8): re-verifying produces a new `VerificationArtifactContent` with a new `verificationId` and new `verificationVersion`. The new verification emits through AS v2.2 as a separate `createArtifact` invocation; AS v2.2 ArA4c creates a `kind: 'version'` edge from new verification anchor → prior verification anchor iff the tuple `(framework.id='verification', userId)` matches (which it does for re-verifications by the same user). Re-verification version lineage is thus tracked at AS v2.2 graph level, not inside VS.

- **Binding immutability** (VA8): AS v2.2 companion node holds the full `VerificationArtifactContent` payload including `binding`, `target`, `evidence`, `predicateResults`, `verdict`. AS v2.2 ArA5 forbids post-emission mutation of companion node content. Therefore all VerificationArtifactContent fields are immutable post-emission without a VS-framework-specific axiom layer — AS v2.2 ArA5 is the enforcer. VA8 is still declared at VS level because it scopes the invariant at VS's domain (full-content immutability post-emission), even though mechanical enforcement is at AS. (Pattern parallel to Plan v2.2 PA9.)

- **Self-application closure boundary** (VA9): VS guarantees one-step closure (V → V'') only. The closure is structurally well-defined: V'' verifies V's well-formedness as a verification artifact. A consumer can choose to invoke VS again on V'' producing V''', but V''' is not a VS invariant — recursive descent is consumer-owned per §1 scopeOut. VS's VA9 axiom + G-VS9 gate scope exactly one step; deeper descent is structurally permitted (V'' satisfies VA1 by construction, so it is itself a valid VerificationInput.evidence) but not invariant.

- **Target dependency edge** (§6.11 dependsOn): every VerificationArtifactContent has exactly one entry in `CreateArtifactInput.dependsOn[]` — `target.artifactRef`. This produces exactly one `kind: 'dependency'` edge per AS v2.2 ArA4d, from verification anchor → target anchor. The graph thus carries the structural relationship "this verification verified that artifact" at the AS edge layer, queryable via Living Memory traversal. No VS-local axiom needed; AS v2.2 ArA4d is the enforcer.

- **VS verifying VS** (VA9 graph topology): when VS is invoked on a prior VerificationArtifactContent V, the resulting V'' has `target.artifactKind = 'verification'` and `target.artifactRef = ref(V)`. The dependency edge V'' → V at AS layer creates a verification-of-verification chain in the graph. Chain depth is observable via Living Memory traversal of `kind: 'dependency'` edges where `framework.id = 'verification'` at both endpoints. VS does not bound chain depth (consumer-owned per §1 scopeOut); the graph topology is the audit trail.

- **Framework-audit boundary** (§1 scopeOut): VS verifies *runtime artifacts* (W-ATOMs flowing through L4 programs at runtime). Framework-audit verifies *framework declarations* (X1–X10 against framework files). VS may verify a `VerificationArtifactContent` via VA9 self-application; framework-audit may audit VS's framework-declaration file. These are non-overlapping concerns at non-overlapping tiers (L3 runtime vs L2 declaration). MA-G13 four-property test verifies VS does not contain framework-audit as sub-element and vice versa: confirmed — distinct frameworks at distinct levels with distinct schemas.

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "VS's verification check is fully mechanical per §10 convention inherited from Plan v2.2 + AS v2.2: invalid verification artifact is not emitted; emission is rejected with a structured error naming the failed axiom. Every VA1..VA9 condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (VA1, VA2, VA3, VA6, VA9), structural property (VA4, VA5, VA7, VA8). No judgment inputs consumed at validity time. Predicate-evaluation semantics within binding.predicateSet are per-predicate mechanical: each VerificationPredicate declares groundClass ∈ substrate §6.3 six-class taxonomy by VA2, which is mechanical by construction (a predicate that cannot reduce to a §6.3 class fails VA2 / G-VS2 and is rejected before evaluation). Authoring program's pre-verification composition (which produces VerificationArtifactContent from preverifyInputs) is upstream of VS's schema.input and thus outside VS's judgment scope. MA-J4 emptyDeclared satisfied with positive basis."
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

All 94 framework-tier gates (85 inherited + 9 VS-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation post-v1.0-confirmation. Per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11): when VS's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7). VS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle section declares state transitions; §5.9 version history present |
| X2 Determinism / reproducibility | declared-complete | §3.6 axiom mechanical-criterion ground per substrate §6.3 (every VA-axiom reducible to one of six classes); §3.7 P8=0 mechanical empty-declaration; §7.1 P7=0 mechanical empty-declaration |
| X3 Observability / introspection | declared-complete | §6.2 HRs with captureShape per MA-C3; §6.3 captureShape table populated for HR-VS1..HR-VS3 (HR-VS4 explicitly null per diagnosticSignificance: false) |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut row with 8 entries (framework-audit boundary, domain predicate semantics, runtime execution, AS emission mechanics, Living Memory, authoring-program composition, recursion bound, B-direction post-beta) |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared (per-verification predicate count, evidence size, gate execution complexity, self-application closure) |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared with all required fields |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated |
| X9 Integration point | declared-complete | §6 cross-framework + HR-VS3 AS v2.2 carrier; §6.9 adjacent-framework call patterns |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=0 positive empty-declaration with basis citing substrate §8.3 + §8.6 |

All ten audit dimensions declaratively complete at delivery. Framework-audit first-run ratifies at post-v1.0-confirmation.

### §8.3 Last audit event

Not yet run. v1.0 delivery is the first compilation of Verification Standard; framework-audit X1..X10 execution scheduled after L0 confirmation.

### §8.4 Self-application basis

VS does self-apply at the runtime-artifact tier per VA9 (one-step closure: V → V''). This is **distinct** from G-U1 framework-self-application (which runs the gate suite against the framework declaration itself; G-U1 is inherited from metaframework and applies at framework-audit time). The two self-applications operate at different tiers:

- **G-U1 self-application** (framework-tier): VS's gate suite (G-VS1..G-VS9 + 85 inherited) audits VS's own framework declaration file. Inherited from metaframework §11.3. Applies at framework-audit invocation.
- **VA9 self-application** (runtime-artifact-tier): VS's verification semantics applied to a `VerificationArtifactContent` produces a verification-of-verification artifact. Declared at VS §3.6. Applies at every runtime VS invocation where `target.artifactKind = 'verification'`.

These are non-overlapping by scope. VS satisfies both: framework-audit-style (G-U1 inherited) and runtime-self-application (VA9 declared).

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-04-30 | Initial declaration. Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 under substrate-v1-1 v1.6. Six VS-local P1 axes (Input, Predicate, Evidence, Verdict, Aggregation, Self-application). Nine axioms VA1..VA9 with 1:1 axis-axiom binding plus VA9 closing self-application as the verificative-mode-specific invariant. Nine paired gates G-VS1..G-VS9 (1:1 per G-M1). Four HRs HR-VS1..HR-VS4 with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) and P8=0 (Mode=verificative + substrate §8.3 binding) positive empty-declarations per A-17. Carrier = named → Artifact Standard v2.2 (structural symmetry with Plan v2.2 — both L3 mode-primitive frameworks carriered through AS at the same version). VerificationBinding shape declared with zero domain instances at v1.0 (frozen shape; F-verify slice supplies smoke binding at Sprint 4 close per Cycle Brief; full LIV-Standard 153-predicate binding lands in subsequent cycle (Sprint 4.x) post pre-pass classification work — Demos confirmed 2026-04-30). `referentCitations: []` declared with basis per Cognitive v1.2.2 precedent. Provenance reference-default per A-20. Cycle-2 referent infrastructure (G-V10 + G-S8 + G-L11) inherited and vacuous-pass per zero-citation declaration. R5 types file `verification-standard.types.ts` consumes `artifact-standard.types.ts` at §2.5 cross-framework calibration. Distinct from framework-audit-v1-2 by tier (L3 vs L2) and target (runtime artifacts vs framework declarations) — declared in §1 scopeOut, audited in §6.11 framework-audit boundary note. | Sprint 3 closure / Phase 7 critical-path gate clearance per LIV deploy state (Demos handoff brief 2026-04-30) |

---

**End of verification-standard-v1-0. Pending L0 confirmation at v1.0 closure.**
