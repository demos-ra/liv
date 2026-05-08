---
kind: framework
placement: frameworks/metaframework/spec/
---

# v3.2.7 Spec — Metaframework System

**Status:** MF-Cycle-2 Spec↔Referent Alignment Closure delivery. Builds on cycle-1.6 baseline by closing the three uncovered cells (Categorical, Schema, Lifecycle) of the spec↔referent column with one column-coherent amendment: 3 new substrate atoms (A-18 ReferentCitation with inline ExpectedShape sub-shape + A-19 ReferentAlignmentState + A-20 ReferentSnapshot), 3 new metaframework axioms with paired gates (MA-V10/G-V10 Validity, MA-S8/G-S8 Schema, MA-L11/G-L11 Lifecycle), MA-S7 predicate tightened in-place to recursive `≼` (governs A-18.ExpectedShape discriminated-union sub-shape), 4-site framework-audit schema-field cluster, drift-disposition flow declared at amendment-propagation §3.5. Spec rev-4.
**Version:** v3.2.7 (MF-Cycle-2 Spec↔Referent Alignment Closure delivery; supersedes v3.2.6 → v3.2.5 → v3.2.4 → v3.2.3 → v3.2.1 → v3.2 → v3.1 → v3.0-r1 → v3.0 original).
**Scope:** Six-file metaframework system (substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation) + spec registered as 7th RegistryEntry per F-cycle-1-15/Q-cycle-1-4 (cycle-1 v1.1).
**Authority:** L0 confirmed through Phase 8 + Phase 1.1 + Phase 1.2 + Phase 1.2-fix + Phase 1.2-fix-trail hygiene + v3.2.3 + MF-Cycle-1 Foundation Closure (2026-04-29) + MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) + MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) + MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30).
**Prior artifact:** v3-0-spec.md (Phase 9a) → v3-1-spec.md (Phase 1.2) → v3.2 (Phase 1.2-fix) → v3.2.3 (Phase v3.2.3 delivery) → v3.2.4 (MF-Cycle-1) → v3.2.5 (MF-Cycle-1.5) → v3.2.6 (MF-Cycle-1.6) → this revision (MF-Cycle-2).

---

## §1 Meta-state

### §1.1 Input finding set

**Combined audit: 64 findings across three layers.**

Disposition per Phase 1.1 brief:
- **50 accepted** for resolution in this revision (21 Layer 1 + 29 Layer 2).
- **7 rejected** (F-phase-1-1-A-07, F-phase-1-1-A-11, F-phase-1-1-B-10, F-phase-1-1-B-11, F-phase-1-1-B-12, F-phase-1-1-B-23, F-phase-1-1-B-35).
- **7 downgraded to Hygiene-defer** (F-phase-1-1-B-06, F-phase-1-1-B-15, F-phase-1-1-B-17, F-phase-1-1-B-18 + 3 Layer 1 Hygiene).

Severity distribution of 50 accepted:
- Structural: see individual breakdown in §5.
- Consequential: per §5.
- Hygiene: per §5.

Finding set closed and frozen as input to this revision. No additions permitted during execution (per brief §8).

### §1.2 Escalation resolutions

Three escalations confirmed before Phase 1.

**Escalation 1 — MA-G13 formalization.**
Resolution: declare as substrate-tier universal structural invariant. Not a metaframework axiom. Applies to every framework by inheritance. Gate G-G13 executed per framework.

**Escalation 2 — Execution axis vs. extracted framework.**
Resolution: Execution is NOT a metaframework axis. §10 generation procedure extracts to its own framework (`generation-procedure-v1-0`) per MA-G13 four-property test. Mode (in Identity axis) discharges the concern of classifying generative-vs-declarative frameworks.

**Escalation 3 — Judgment-as-input vs. full mechanical derivation.**
Resolution: hybrid. Each procedure step declares kind = `mechanical` or `judgment-input`. Judgment is typed, ID'd, criteria-bounded, provenanced. Declared at substrate as universal shape. Anti-abuse mechanism: criteria must be mechanically testable per substrate §6.3 ground.

**Escalation-presentation home (per R-phase-1-1-resolution-16):** escalation resolutions originated from the escalation-resolution-proposal conversation between L0 and manager instance on 2026-04-21. Resolutions confirmed by L0 per checkpoint ledger row for Pre-Phase 1.

### §1.3 Checkpoint ledger

| Phase | Scope | Confirmed | Notes |
|---|---|---|---|
| 1 | Substrate derivation | ✓ | 7 contents, 9 atoms, 4 authority levels, 3 rules, 4 gates |
| 2 | Primitive set | ✓ | 7 universal + 1 conditional, shapes/rules/gates at substrate |
| 3 | Axis set resolution | ✓ (judgment-tagged) | 7 axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment. MECE verified as judgment input J-axis-mece per §3.1 |
| 4 | Axioms distributed | ✓ (judgment-tagged) | 68 axis-bound + 1 universal (MA-G13) at v3.2.7 (33+1=34 at v3.0; 36 at v3.1; 64 at v3.2.3; 66 at v3.2.4 with cycle-1 +MA-S7 +MA-V11; 69 at v3.2.7 with cycle-2 +MA-V10 +MA-S8 +MA-L11). Distribution as judgment input J-axiom-dist per §3.2 |
| 5 | Schema declaration | ✓ | MetaframeworkInput + GeneratedFrameworkTemplate + custody table |
| 6 | Gate set | ✓ | 54 total (substrate 11 + framework-tier 43). 5 universal gates close F-phase-1-1-69 |
| 7 | Handoff rules | ✓ | 6 handoff rules (HR1–HR6) + HR0 pending per V7 |
| 8 | File set and shapes | ✓ | 6 files, universal framework-file shape (9 sections), non-framework shapes |
| Post-8a | §7 empty-declaration rule | ✓ | Now derived from substrate §8.6 per R-phase-1-1-resolution-23 resolution |
| Post-8b | 9a/9b split + hard checkpoint | ✓ | Phase 9 split confirmed |
| Post-8c | F-phase-1-1-69 gate distribution | ✓ | Per §4.5 in this spec |
| Post-8d | MA-G13 bundle (kind-of-invariants + multi-execution) | ✓ | Split into four items per R-phase-1-1-resolution-01 resolution; now at substrate §1.1–§1.4 |
| Post-8e | Phase 1.1 re-open | ✓ | This revision; 50 findings accepted |
| 9a (original) | Spec consolidation | ✓ → superseded | Superseded by this revision |
| 9b | Substrate writing | halted | Resumes after terminal gate §7 passes |
| 1.2 | Flow + capture property-on-primitive amendments | ✓ | substrate v1-1, framework-audit v1-1, spec v3.1 |

Post-Phase 8 additions enumerated per R-phase-1-1-resolution-15.

### §1.4 Three-pass self-mapping audit procedure (per R-phase-1-1-resolution-22)

Declared by name: **Self-Mapping Audit Procedure.**

Three ordered passes:
1. **Rule inventory** — enumerate every rule the framework declares for outputs (axioms, gates, handoff rules, lifecycle rules).
2. **Self-application** — for each rule, determine applicability to self. Outcomes: self-pass, self-fail, self-NA-by-construction, self-coverage-gap.
3. **Coverage-gap analysis** — identify rules that should exist for self-application but do not.

Procedure declared here; executed by framework-audit when auditing any framework (including the spec itself and the metaframework). G-spec-8 (spec §7 terminal gate) tests that this procedure is declared by name.

---

## §2 Substrate specification

**File target:** `substrate-v1-0.md`
**Dependencies:** none
**Consumers:** all other files
**Versioning:** independent; additive only (per S3)

### §2.1 Structural-identity declarations (four items, per R-phase-1-1-resolution-01 split)

Previously bundled as single "MA-G13" content. Split into four distinct substrate items, each with own ID. Cycle-1 v3.2.4 rename per F-cycle-1-1: prefix `S-0n` → `SI-0n` to disambiguate from §10.1 substrate-rule namespace `S1..S5` (sequential numbering preserved, prefix changed).

- **SI-01 MA-G13** — structural-identity invariant (four-property definition).
- **SI-02 Kind-of-invariants distinction** — structural-transformation vs. data-integrity.
- **SI-03 Permitted-multi-execution rule** — single declaration, multiple execution sites.
- **SI-04 Four-property criteria** — mechanical criteria per property (per R-phase-1-1-resolution-01).

Full declarations at substrate-v1-1.md §1.1–§1.4 (post-cycle-1 v1.3).

### §2.2 Substrate contents (items §2–§14 of substrate file)

- **§2 Modes** (4): epistemic, structural, generative, verificative.
- **§3 Universal Variables** (4): Temporal, Categorical, Relational, Positional.
- **§4 Atoms** (17 at substrate v1.3 post-cycle-1; 9 at v1.0; 14 at v1.2; +A-05 in-place rename ProvenanceRow→OriginProvenance + A-15/A-16/A-17 adds at v1.3): A-01 WAtom, A-02 AxiomRef, A-03 HandoffContract, A-04 CustodyRow, A-05 OriginProvenance (in-place rename cycle-1 per F-cycle-1-12), A-06 AxisRef, A-07 SubAxisRef, A-08 LeafRef, A-09 FrameworkRef, A-10 Kind, A-11 Ownership, A-12 ActivationTrigger, A-13 OperatorInterface, A-14 GenesisDeclaration, A-15 GateIdSet (added cycle-1 per F-cycle-1-14), A-16 AmendmentProvenance (added cycle-1 per F-cycle-1-12), A-17 EmptyPrimitiveDeclaration (added cycle-1 per F-cycle-1-7).
- **§5 Authority levels** (4): L0, L1, L2, L3.
- **§6 Judgment shape**: JudgmentId, JudgmentKind, Criterion, Judgment, JudgmentProvenance + mechanical-criterion ground (§6.3) per R-phase-1-1-resolution-12.
- **§7 Semver** (external reference).
- **§8 Primitives** (P1–P7 universal + P8 conditional) + empty-declaration derivation §8.6 per R-phase-1-1-resolution-23.
- **§9 Terminology**: Carrier (per R-phase-1-1-resolution-04), carrier applicability semantics (per R-phase-1-1-resolution-13, R-phase-1-1-resolution-17), cross-axis invariant (per R-phase-1-1-resolution-05), non-framework file (per R-phase-1-1-resolution-19), file-shape applicability rule (per R-phase-1-1-resolution-18).
- **§10 Substrate rules** (S1–S5, PR1–PR5 at substrate v1.3 post-cycle-1; S4 binary truth-value + S5 filename opacity added cycle-1 per F-cycle-1-4 + F-cycle-1-5).
- **§11 Substrate gates** (SG1–SG5, PG1–PG7, G-U4, G-G13). SG3 rewritten per R-phase-1-1-resolution-02.
- **§12 Consumer registry**.
- **§13 Activation flow** (new, per F-phase-1-1-B-28/F-phase-1-1-B-37–F-phase-1-1-B-40).
- **§14 Bootstrap** (new, per F-phase-1-1-B-31–F-phase-1-1-B-33).

### §2.3 Mechanical-criterion ground (per R-phase-1-1-resolution-12)

Substrate §6.3 declares six classes of mechanical predicates. Criteria reducible to these classes are mechanical; criteria outside the taxonomy are not mechanical and are themselves judgment.

MA-J2 gate (G-J2) executes by checking each criterion against the six-class taxonomy.

### §2.4 SG3 rewrite (per R-phase-1-1-resolution-02)

SG3 rewritten: per-element consumer list with declared rows in §12. Aggregate "all frameworks" shorthand permitted only when paired with declared framework-ID enumeration in §12 header. Implicit "all" without enumeration fails SG3.

### §2.5 Empty-declaration rule derivation (per R-phase-1-1-resolution-23)

Rule derived from substrate primitive discipline rather than hand-written at spec §4.2. Derivation:

- Primitive kind P exists at substrate §8.
- Framework may declare zero instances of P.
- Zero-instance state captured by positive-declaration marker: `{primitiveKind: P, instanceCount: 0, basis: string}`.
- Framework files consume rule by reference; rule not restated in each framework.

Applied at: framework §7 Judgment (when no judgment inputs); framework axes with zero sub-axes; elsewhere per primitive traceability (PR1).

### §2.6 Activation flow declaration (per §2.1 of brief)

Substrate §13 declares top-level invariant: single trace from L0 activation through owned framework execution to registry state and L0 disposition. Six-node flow with per-edge contract references, per-operation atomicity declarations, concurrent-activation resolution (registry-lock), L0-unavailability response (suspend-and-resume).

Closes F-phase-1-1-B-28, F-phase-1-1-B-37, F-phase-1-1-B-38, F-phase-1-1-B-39, F-phase-1-1-B-40.

### §2.7 Bootstrap declaration (per §2.2 of brief)

Substrate §14 declares bootstrap as one-time privileged L0 event. Produces substrate + first metaframework as restore minimum. Post-bootstrap derivation uses declared procedures. Bootstrap recursion acknowledged and resolved: recursion permitted at bootstrap event only; non-re-entrant.

Closes F-phase-1-1-B-31, F-phase-1-1-B-32, F-phase-1-1-B-33.

---

## §3 Metaframework specification

**File target:** `metaframework-v3-0.md`
**Kind:** Framework
**Mode:** generative
**Level:** L2
**Carrier:** self
**Dependencies:** substrate-v1-0, framework-registry-v1-0 (via HR5)

### §3.1 Seven-axis set

**A1. Identity** — what the framework is.
**A2. Schema** — typed I/O.
**A3. Structure** — internal decomposition.
**A4. Validity** — gates verifying the framework.
**A5. Lifecycle** — versioning, amendment, transition.
**A6. Coupling** — cross-framework concerns (Carrier + Custody + Provenance + Handoff).
**A7. Judgment** — non-mechanical inputs.

**MECE verification declared as judgment input** (per R-phase-1-1-resolution-21):
```
J-axis-mece:
  kind: classification
  input: { axes: [Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment] }
  criteria:
    C1: Each pair of axes is orthogonal (mechanical: pairwise concern-comparison, no two axes cover same concern).
    C2: Seven-axis set is collectively exhaustive over framework concerns (mechanical: enumeration check against declared concern-space).
    C3: No axis exceeds its declared concern boundary (mechanical: content-attribution check).
  provenance:
    instanceId: manager-phase-3
    cycleId: phase-3
    timestamp: 2026-04-21T00:00:00Z
    consumingFrameworkRef: metaframework-v3-2
    consumingStepId: §3.1
```

### §3.2 Axioms distributed

**68 axis-bound axioms + 1 universal (MA-G13) at v3.2.7** (was 33+1=34 at v3.0; 36 at v3.1; 64 at v3.2.3; 66 at v3.2.4 with cycle-1 +MA-S7 +MA-V11; 69 at v3.2.7 with cycle-2 +MA-V10 +MA-S8 +MA-L11 + MA-S7 predicate tightening to recursive `≼`).

**Distribution declared as judgment input** (per R-phase-1-1-resolution-21):
```
J-axiom-dist:
  kind: classification
  input: {
    axioms: [MA-I1..MA-I5, MA-S1..MA-S3, MA-St1..MA-St5, MA-V1..MA-V5,
             MA-L1..MA-L5 + MA-L6 + MA-L7, MA-C1..MA-C6, MA-J1..MA-J4]
  }
  criteria:
    C1: Each axiom attaches to exactly one axis (per AxR1, mechanical).
    C2: Each axis has ≥1 attached axiom (mechanical: coverage check).
    C3: No axiom text duplicates across axes (mechanical: text-hash comparison).
    C4: Every axiom states direct mechanical condition (per AxR2, mechanical: pattern check excluding "X passes gate Y" form).
  provenance: as phase-4 confirmation
```

**Axiom table with post-cycle-2 v3.2.7 additions** (MA-S7 Schema axis per F-cycle-1-2/Q-cycle-1-2, predicate tightened cycle-2 to recursive `≼`; MA-V11 Validity axis per F-cycle-1-8; MA-V10 Validity axis per cycle-2 spec↔referent Categorical alignment; MA-S8 Schema axis per cycle-2 ReferentCitation declaration shape conformance; MA-L11 Lifecycle axis per cycle-2 audit-run snapshot stamping):

| Axis | Count | IDs |
|---|---|---|
| Identity | 7 | MA-I1 to MA-I5 + MA-I6, MA-I7 (v3.2.3) |
| Schema | **8** | MA-S1 to MA-S3 + MA-S4, MA-S5, MA-S6 (v3.2.3) + **MA-S7 (v3.2.4; predicate tightened cycle-2 v3.2.7)** + **MA-S8 (v3.2.7)** |
| Structure | 16 | MA-St1 to MA-St5 + MA-St6 to MA-St16 (v3.2.3) |
| Validity | **11** | MA-V1 to MA-V5 + MA-V6, MA-V7, MA-V8, MA-V9 (v3.2.3) + **MA-V10 (v3.2.7)** + **MA-V11 (v3.2.4)** |
| Lifecycle | **11** | MA-L1 to MA-L5 + **MA-L6 + MA-L7** + MA-L8, MA-L9, MA-L10 (v3.2.3) + **MA-L11 (v3.2.7)** |
| Coupling | 10 | MA-C1 to MA-C6 + MA-C7, MA-C8, MA-C9, MA-C10 (v3.2.3) |
| Judgment | 5 | MA-J1 to MA-J4 + MA-J5 (v3.2.3) |
| Universal | 1 | MA-G13 |

**Total: 68 axis-bound + 1 universal = 69 axioms** (was 66 at v3.2.4; cycle-2 v3.2.7 +3: MA-V10 + MA-S8 + MA-L11; MA-S7 predicate tightening is in-place predicate amendment, no count change).

**Axiom bodies** (imported verbatim from v3-0-spec §3.2 per Phase 1.2 closure; MA-V5, MA-L6, MA-L7, MA-G13 declared separately below with full contextual text):

**Identity (5):**
- MA-I1: Mode declared ∈ {epistemic, structural, generative, verificative}.
- MA-I2: Kind declared ∈ declared Kind enum.
- MA-I3: Level declared ∈ {L0, L1, L2, L3}.
- MA-I4: Version declared conforming to Semver.
- MA-I5: Name declared and unique across registry.

**Schema (3):**
- MA-S1: schema.input declared as typed atom.
- MA-S2: schema.output declared per carrier rule (W-ATOM if carrier ≠ none, AxiomRef[] if carrier = none).
- MA-S3: all atoms referenced at substrate or own Structure. No orphans.

**Structure (5):**
- MA-St1: every axis has ≥1 leaf or sub-axis, or declares `emptyDeclared: true` per substrate §10.
- MA-St2: every leaf atomic per substrate leaf primitive shape.
- MA-St3: orthogonality — no content under more than one axis.
- MA-St4: primitive declarations complete.
- MA-St5: every term has declared home.

**Validity (4, plus MA-V5 declared below):**
- MA-V1: every axiom has ≥1 gate.
- MA-V2: gates test conditions directly (no test-by-reference).
- MA-V3: gate results binary or ternary.
- MA-V4: gate re-verification on state change.

**Lifecycle (5, plus MA-L6 + MA-L7 declared below):**
- MA-L1: version transitions additive.
- MA-L2: amendment triggers declared ∈ {vision, gap, L0-directive}.
- MA-L3: confirmation gates monotonic.
- MA-L4: escalation state typed per substrate shape.
- MA-L5: judgment deprecation declared when step flips to mechanical.

**Coupling (6):**
- MA-C1: Carrier declared per substrate §5.
- MA-C2: custody per atom.
- MA-C3: provenance per output field.
- MA-C4: handoff rules declared for cross-framework contracts.
- MA-C5: carrier-consistent emission.
- MA-C6: no re-ownership (transition constraint orthogonal to MA-C2 declaration — retained per F-phase-1-1-A-07 rejection).

**Judgment (4):**
- MA-J1: every judgment input declared (ID, kind, criteria, consumer).
- MA-J2: criteria are mechanical (mechanicalGround declared per substrate §8).
- MA-J3: provenance complete per judgment instance.
- MA-J4: empty Judgment axis explicitly declared per substrate §10 emptyDeclared field.

**MA-L6 — Activation-flow invariant.**
Framework operations conform to substrate §13 activation flow. Every operation declares atomicity per §13.4, participates in registry-lock protocol per §13.5, and declares L0-unavailability behavior per §13.6.

*Scope (per Phase 1.2 clarification):* MA-L6 covers system-level activation flow (substrate §13) only. Per-operation stage discipline is enforced by substrate §10.2 PR4 + PR5 and tested by framework-audit §3.3 X10 extended predicate. No axiom amendment required for Phase 1.2 stage additions.

**MA-L7 — Bootstrap non-re-entrancy.**
Framework declares genesis per framework-audit X8 (substrate §14.2–§14.5). Bootstrap event is non-re-entrant; post-bootstrap derivations occur via declared procedures.

**Axiom rules (AxR-series):** unchanged from original spec.
- AxR1: every axiom binds to exactly one axis or is universal/substrate-declared.
- AxR2: every axiom states one mechanical condition directly.
- AxR3: axioms additively versioned.
- AxR4: axiom text is declarative.

**MA-V5 — Gate set exhaustive over declared validation dimensions.**
MA-V5: gate set exhaustive over framework-audit 10 audit dimensions (R-phase-1-1-resolution-03 resolution — enumeration declared at framework-audit §3.2).

**MA-V5 testability** (per R-phase-1-1-resolution-03): MA-V5 is enumerable via framework-audit's ten declared audit dimensions (X1–X10). G-V5 tests by verifying gate-to-dimension mapping completeness.

### §3.2.6 v3.2.3 axiom bodies

28 axioms added at v3.2.3 cycle. Per Phase 5 of cycle (predicate authorship + predicate-testability check 28/28 pass). Sub-section organized by axis. All testability classifications marked; criteria-bounded axioms cite consuming J-input declared at framework-audit §7.6–§7.9.

#### §3.2.6.1 Identity (2 axioms)

**MA-I6 — Authority-source classification per audit-trail entry.**
For every (operation o, AuthorityClaim ac) pair recorded in framework's audit trail, ac.level ∈ classify(ac.source) per J-input.
(Testability: criteria-bounded per J-authority-source-classification, declared at framework-audit §7.6.)

**MA-I7 — Four-property MA-G13 declaration completeness.**
For every framework F in registry, F's §1 Identity declares all four MA-G13 properties: ownState (ref §5), ownIO (ref §2), ownInvariants (ref §3 axiom set), ownDiscipline (ref §3 axis decomposition + §4 gates).
(Testability: mechanical.)

#### §3.2.6.2 Schema (3 axioms)

**MA-S4 — Typed-shape reference resolution.**
For every reference r in framework prose to a typed-shape element (atom, enum-value, vocabulary-term), there exists declared instance d such that r resolves to d (atoms → §2.4; enums → substrate §9 / framework-local §3; vocabulary → §3.5 + substrate §9).
(Testability: mechanical.)

**MA-S5 — Cross-file atom-instance value consistency.**
For every cross-file restatement of an atom-instance value (cardinality, count, or other declared atom-instance scalar), all restatements across canonical-package files resolve to the same value.
(Testability: mechanical.)

**MA-S6 — ID-set cardinality + resolution.**
For every gate-set or other ID-set atom in framework's local atom set with `cardinality: N` property, the enumerated ID list has length N; every ID resolves to a declared instance.
(Testability: mechanical.)

#### §3.2.6.3 Structure (11 axioms)

**MA-St6 — Empty-declaration zero-children.**
For every primitive-instance site x in framework where `emptyDeclared:true` is declared, x has zero child element declarations (no nested sub-axes, leaves, axioms, gates, HRs, or other instances).
(Testability: mechanical.)

**MA-St7 — Primitive prose-claim signature coverage.**
For every primitive P with declared signature, and for every prose-claim about P, the dimension d named in the prose-claim ∈ S(P) ∪ R(P), where S(P) = signature parameters and R(P) = explicitly-declared external resolution references. Prose-claim extraction rule: a prose-claim about P is any sentence in framework §3 (Structure) or §2 (Schema) that (a) names P (by primitive-id or substrate-§8-declared-name), (b) followed within the same sentence or paragraph by a property descriptor — words "has", "with", "carries", "owns", "declares", "covers", "exposes" — and (c) is not inside a code block.
(Testability: mechanical.)

**MA-St8 — External-resolution dimension coverage.**
For every primitive P, every dimension d ∈ R(P) has a declared resolution mechanism (named axiom, named gate, named handoff).
(Testability: mechanical.)

**MA-St9 — P8 reference resolution by kind.**
For every P8 procedure-step instance ps: if ps.kind = `judgment-input`, ps.judgmentInputRef resolves to declared P7 in framework §7; if ps.kind = `gate-execution`, every entry in ps.gates resolves to declared P5 in framework §4.
(Testability: mechanical.)

**MA-St10 — P7 instance field completeness.**
For every P7 instance ji declared in framework §7, ji has populated fields: `criteria` (non-empty list), `judgmentId` (resolvable identifier), `mechanicalGround` (resolvable per MA-J5).
(Testability: mechanical.)

**MA-St11 — Axis concern-coverage by axiom set.**
For every axis or sub-axis x with concern-statement c, the collective axiom set bound to x covers c — every subclaim s in concern-decomposition(c) is tested by ≥1 axiom bound to x.
(Testability: criteria-bounded per J-axis-concern-coverage, declared at framework-audit §7.7.)

**MA-St12 — P8 order injection.**
For every framework procedure (P8 instances belonging to one operation, identified by shared operation-identifier), the `order` field is a total injection — no two instances share the same order value.
(Testability: mechanical.)

**MA-St13 — Single-condition + no-axiom-as-test-reference.**
For every axiom a, a.text states exactly one mechanical condition (a.text contains exactly one assertion clause, identifiable by single declarative verb-phrase) AND a.text contains no axiom-as-test-reference shape (no clause matching pattern "tests <gate-id>" or "is verified by <gate-id>" embedded in axiom statement).
(Testability: mechanical.)

**MA-St14 — Axiom text declarative-form.**
For every axiom a, a.text is in declarative form per AxR4.
(Testability: criteria-bounded per J-axiom-text-declarative, declared at framework-audit §7.8.)

**MA-St15 — Cardinality declared-vs-enumerated.**
For every primitive cardinality declaration c in framework §3.4, c.declaredCount = count(c.enumeratedInstances); cross-primitive cardinality assertions (e.g., "P3 count = P4 count" if "one leaf per axiom" declared) hold.
(Testability: mechanical.)

**MA-St16 — Axiom testability classification.**
For every axiom a, a declares testability classification ∈ {`mechanical`, `criteria-bounded`}; criteria-bounded axioms declare bound-J-input ref.
(Testability: mechanical.)

#### §3.2.6.4 Validity (4 axioms)

**MA-V6 — Predicate-condition implication for axiom-gate pairs.**
For every (axiom a, gate g) pair where g.tests includes a, g.predicate's mechanical conditions imply a.condition (1:1 mapping per G-M1: equivalence required; multi-axiom-gate per R-phase-1-1-resolution-24: conjunction of g.predicate conditions over g.tests entries collectively cover each tested axiom's condition). Implication test grounds via substrate §6.3 mechanical-criterion ground; non-trivial implication cases that cannot be reduced to substrate §6.3 are surfaced as audit-note for L0 review (does NOT escalate to J-input — predicate remains mechanical with declared edge-case caveat).
(Testability: mechanical with declared edge-case audit-note caveat.)

**MA-V7 — Gate-tests reference resolution.**
For every gate g, every reference in g.tests resolves to a declared axiom in framework's axiom set (§3.2).
(Testability: mechanical.)

**MA-V8 — Authority-required ≤ AuthorityClaim under enum order.**
For every (operation o, triggering AuthorityClaim ac) pair recorded in framework's audit trail, o.requiredAuthority ≤ ac.level under substrate §5 authority-enum partial order.
(Testability: mechanical.)

**MA-V9 — Gate-rule (GR-1..GR-6) conformance.**
For every declared gate g in framework, g conforms to GR-1..GR-6 (declared at framework-audit §4.6.1): GR-1 Claim declared; GR-2 Test kind ∈ {mechanical, criteria-bounded} with kind-specific fields; GR-3 Reporting declared with `result ∈ {pass, fail, n/a}` and basis-when-n/a; GR-4 Tests-axiom binding declared (≥1 axiom ref); GR-5 Escalation path declared per MA-L4; GR-6 Result is binary.
(Testability: mechanical.)

#### §3.2.6.5 Lifecycle (3 axioms)

**MA-L8 — Amendment-trigger context classification.**
For every amendment cycle c in framework's amendment log, c.declaredTrigger ∈ {`vision`, `gap`, `L0-directive`} matches actual surfacing-context classification per J-amendment-trigger-context.
(Testability: criteria-bounded per J-amendment-trigger-context, declared at framework-audit §7.9.)

**MA-L9 — Version-transition no-removal.**
For every version transition F.vN → F.vN+1, diff(vN, vN+1) contains no removal of declared elements (axioms, gates, primitives, HRs, atoms, J-inputs, P8 steps); only additions and modifications-of-non-removable-fields permitted.
(Testability: mechanical.)

**MA-L10 — Confirmation-log monotonicity.**
For every confirmation log (ordered by timestamp), state transitions are monotonic: no entry transitions a state from `confirmed` back to `unconfirmed` or `pending`.
(Testability: mechanical.)

#### §3.2.6.6 Coupling (4 axioms)

**MA-C7 — Custody cross-boundary HR coverage.**
For every cross-framework data-flow declared in framework's custody table — atom row with cross-boundary direction or cross-framework consumer — there exists a declared HR in §6.2 whose direction and endpoints match.
(Testability: mechanical.)

**MA-C8 — HR endpoint registry resolution.**
For every HR h in framework §6.2, h.endpoints (FrameworkRef values) resolve to registry-registered frameworks OR h declares bootstrap-exemption basis.
(Testability: mechanical.)

**MA-C9 — Cross-framework ID-content coherence.**
For every pair of frameworks F1, F2 in registry.activeFrameworks, for every ID-bearing element e (axiom, gate, J-input, HR, primitive instance) declared by F1 with same ID as e' declared by F2, content(e) = content(e') OR registry declares the cross-framework ID-overlap as exempt with basis.
(Testability: mechanical.)

**MA-C10 — Substrate-version pin uniformity.**
For every pair of frameworks F1, F2 in registry.activeFrameworks, F1.substrateVersion = F2.substrateVersion OR one declares cross-framework substrate-version exemption with basis.
(Testability: mechanical.)

#### §3.2.6.7 Judgment (1 axiom)

**MA-J5 — J-input mechanicalGround field resolution.**
For every J-input declaration ji in framework §7 with `mechanicalGround: g` field, g resolves to a declared substrate or framework reference (substrate § ref or framework F.§ ref where F is registry-registered).
(Testability: mechanical.)

### §3.2.7 v3.2.4 cycle-1 axiom bodies (2 axioms; MF-Cycle-1 Foundation Closure)

Per Phase 5 of cycle (predicate authorship + predicate-testability check 2/2 pass). MA-S7 binds Schema axis (per F-cycle-1-2/Q-cycle-1-2). MA-V11 binds Validity axis (per F-cycle-1-8). Both authored under MA-S7 itself (the Schema-axis additive amendment governance MA-S7 declares); G-S7 verifies post-authoring. AxR conformance validated for both: AxR1 binds single axis ✓, AxR2 one mechanical condition ✓, AxR3 additive ✓, AxR4 declarative ✓.

#### §3.2.7.1 Schema (1 axiom)

**MA-S7 — Schema-axis additive amendment** (cycle-1 v3.2.4; predicate tightened cycle-2 v3.2.7 to recursive `≼` relation governing discriminated-union sub-shapes; cycle-2 introduces the first such sub-shape via A-18.ExpectedShape).
Typed-atom schema amendments at version transitions are field-additive recursively. For every typed atom T in substrate §4 atom enumeration:
1. `prior.fields(T) ⊆ current.fields(T)` (top-level field-set subset).
2. `∀f ∈ prior.fields(T). typeOf(prior.T.f) ≼ typeOf(current.T.f)` where `≼` is the recursive shape-stability relation defined as:
   - For primitive types (string, number, boolean, null literals, string literals): `t ≼ t` iff `t = t` (equality).
   - For typed-shape references (atoms, sub-shape names): `t ≼ t` iff resolved shape of `t` satisfies recursive `≼` against resolved shape of the other.
   - For object shapes `{f1: t1, ..., fn: tn}`: `prior ≼ current` iff `prior.fieldNames ⊆ current.fieldNames` AND `∀f ∈ prior.fieldNames. prior.f.type ≼ current.f.type`.
   - For discriminated-union shapes `{ kind: 'k1' | ... | 'kn'; arm-specific fields per kind }`: `prior ≼ current` iff `prior.kindEnum ⊆ current.kindEnum` AND `∀k ∈ prior.kindEnum. prior.armShape(k) ≼ current.armShape(k)` (per-arm recursive stability for retained kinds; new kinds may be added).

(Testability: mechanical — recursive structural comparison across version transitions per substrate §4 atom enumeration. Tested by G-S7 (predicate amended cycle-2 in-place to evaluate the recursive `≼` relation): for every typed atom, recursive shape-stability holds. Cycle-2 baseline atom set re-validated zero-regression: A-01..A-17 carry zero discriminated-union sub-shapes; recursive `≼` reduces to prior subset-with-type-stability predicate.)

#### §3.2.7.2 Validity (1 axiom)

**MA-V11 — Applicability-basis required.**
For every produced gate result `gr` with `gr.applicability = 'n/a'`, `gr.basis` is non-null and `length(gr.basis) ≥ 1`. Same invariant applies to every produced dimension result with `applicability = 'n/a'`. When the enumerated set of `applicability = 'n/a'` instances is empty, the universal quantification is vacuously satisfied per substrate §6.3 cardinality semantics — `truthValue = 'passed'` with explicit basis recording the empty enumeration.
(Testability: mechanical — type-check + cardinality per substrate §6.3. Tested by G-V11: enumerate GateResult and DimensionResult instances across SelfAuditRecords; verify invariant.)

**Numbering note:** Validity axiom numbered MA-V11 (not MA-V10) per cycle-1 reservation. MA-V10 added cycle-2 v3.2.7 per spec↔referent Categorical alignment closure.

### §3.2.8 v3.2.7 cycle-2 axiom bodies (3 axioms; MF-Cycle-2 Spec↔Referent Alignment Closure)

Per cycle-2 step 7 of cycle (predicate authorship + AxR-conformance verification 3/3 pass). MA-V10 binds Validity axis (cycle-2 spec↔referent Categorical alignment); MA-S8 binds Schema axis (cycle-2 ReferentCitation declaration shape conformance); MA-L11 binds Lifecycle axis (cycle-2 audit-run snapshot stamping). All three authored under tightened MA-S7 (recursive `≼` per §3.2.7.1 amendment); G-S7-amended verifies. AxR conformance validated for all three: AxR1 binds single axis ✓, AxR2 one mechanical condition ✓, AxR3 additive ✓, AxR4 declarative ✓.

#### §3.2.8.1 Validity (1 axiom)

**MA-V10 — Spec↔referent Categorical alignment.**
For every ReferentCitation `rc` declared in framework's vocabulary or atom-inventory tables: when applicability='applicable' and executionState='executed', the referent at `rc.path` (resolved per ReferentResolver under the audit's ReferentSnapshot) parses, and its declaration structurally matches `rc.expectedShape` per the kind-specific comparison rules in substrate §4 A-18 ExpectedShape kind enum.
(Testability: mechanical when ReferentResolver returns non-null AND parser registered for referentKind. Applicability='n/a' with basis when resolver returns null OR parser unregistered, per substrate §10.1 S4 + MA-V11 vacuous-pass clause. Tested by G-V10 at framework-audit §4.8.4.6.)

#### §3.2.8.2 Schema (1 axiom)

**MA-S8 — ReferentCitation declaration shape conformance.**
Every ReferentCitation declared in any framework's vocabulary or atom-inventory table conforms to substrate §4 A-18 typed shape: required fields populated (citationId, citingFrameworkRef, atomName, referentKind, path, expectedShape); referentKind value is in the declared enum; expectedShape value is one of the four declared ExpectedShape kinds with kind-required fields populated.
(Testability: mechanical — type-check + cardinality + enum-membership classes per substrate §6.3. Tested by G-S8 at framework-audit §4.8.2.5. Distinction from MA-S7: MA-S7 governs typed-atom shape evolution across version transitions; MA-S8 governs citation instance conformance to atom shape at any single point in time. Different concerns; orthogonal.)

#### §3.2.8.3 Lifecycle (1 axiom)

**MA-L11 — Audit-run snapshot stamping.**
Every audit run against a framework declaring ≥1 ReferentCitation produces an AuditRunRecord with `referentSnapshotRef` populated and resolving to a registered ReferentSnapshot (substrate §4 A-20). Frameworks declaring zero ReferentCitations may produce AuditRunRecords with `referentSnapshotRef = null` (vacuously satisfied per substrate §6.3 cardinality semantics, parallel to MA-V11 vacuous-pass discipline).
(Testability: mechanical — null-check + reference-resolution classes per substrate §6.3. Tested by G-L11 at framework-audit §4.8.5.4.)

### §3.3 Schema

**Input — MetaframeworkInput:**

Retained from original spec with two additions per Phase 1.1 verification:

```
MetaframeworkInput = {
  // Identity inputs
  domainDescription: string,
  domainInputState: Mode,
  proposedName: string,
  proposedKind: Kind,
  proposedLevel: AuthorityLevel,

  // Coupling inputs
  adjacentFrameworks: FrameworkRef[],
  carrierPreference: Carrier,

  // Activation-flow input (per V5 verification, new)
  activationTrigger: {
    initiator: AuthorityClaim,         // L0 or escalated authority
    concurrencyPolicy: 'wait' | 'reject',
    operationName: string
  },

  // Judgment inputs
  judgment: Record<JudgmentId, Judgment>,

  // Provenance — reference-default per R-phase-1-1-resolution-20
  provenance: {
    instanceId: string,
    cycleId: string,
    timestamp: string,
    authorityClaim: AuthorityClaim
  }
}
```

**Output — GeneratedFrameworkTemplate:**

```
GeneratedFrameworkTemplate = {
  identity: { name, kind, mode, level, version, ownershipTemplate, ownershipApplied,
              stateTemplate, stateApplied, genesis },
  schema: { input: WAtom, output: WAtom | AxiomRef[] },
  structure: { axes, primitiveInstances, vocabulary },
  validity: { gates: GateResult[], overallResult,
              dimensionResults: DimensionResult[]   // per framework-audit X1–X10
            },
  lifecycle: { versionTransition, amendmentTrigger, confirmationGate,
               escalationState, judgmentDeprecations,
               failureModes, scaleBounds, atomicityDeclarations  // per V5 verification
             },
  coupling: { carrier, custody, provenance, handoffRules, operatorInterface },
  judgment: { declaredInputs, provenanceRecord },

  // Provenance — reference-based default per R-phase-1-1-resolution-20
  provenance: {
    generatedByMetaframework: FrameworkRef,
    generationProcedureRef: FrameworkRef,
    generationTimestamp: string,
    sourceInputRef: AtomRef,           // REFERENCE to MetaframeworkInput stored in registry
    sourceInputValue?: MetaframeworkInput  // optional by-value; opt-in via declared flag
  }
}
```

**sourceInput reference-default** (per R-phase-1-1-resolution-20): provenance stores reference to registry-archived input; by-value retention is opt-in with declared flag. Reduces propagation cost O(N) → O(1) per framework.

**Atom shapes specific to metaframework:** AxisInstance, AxiomInstance, GateInstance, HandoffRuleInstance, JudgmentInputDeclaration, ProcedureStepInstance, EscalationState, JudgmentDeprecation, VocabularyEntry, Kind enum, Ownership, State, GenesisDeclaration (new per V5), DimensionResult (new per V5), OperatorInterface (new per V5).

**Custody table:** full table in metaframework-v3-0.md §6 Coupling. Every atom has owner + layer. §4.4 of this spec references the table by pointer (per R-phase-1-1-resolution-08 single-source via reference).

**Schema rules (ScR-series):** unchanged.

### §3.4 Gates

**90 total gates after cycle-2 v3.2.7** (was 87 at cycle-1.6; cycle-2 adds 3 framework-tier gates: G-V10 + G-S8 + G-L11; G-S7 predicate amended in-place — no count change for the amendment itself).

| Category | Count |
|---|---|
| Substrate gates (SG1–SG5) | 5 |
| Primitive gates (PG1–PG7) | 7 |
| Axiom gates (1 per axiom) | **68** (was 65; cycle-2 +3: G-V10 + G-S8 + G-L11) |
| Universal MA-G13 gate | 1 |
| F-phase-1-1-69 universal gates | 5 |
| Meta-gates | 4 |
| **Total** | **90** |

**Framework-tier gates (run per framework): 85** (was 82; per metaframework-v3-1 §4.7 enumeration: 7 PG + 68 axiom + 1 MA-G13 + 5 F-phase-1-1-69 + 4 meta. Substrate gates SG1–SG5 excluded per substrate §11.5 tier-1 "run once, not per framework" semantics. PG1–PG7 are per-framework-tier per substrate §11.5 tier-2 classification.)

**Meta-gates specified** (per R-phase-1-1-resolution-06):

- **G-M1 — Axiom-gate 1:1 mapping integrity.**
  Every declared axiom has exactly one primary gate (multi-axiom gates permitted only with declared justification per P5). Tests mapping table in framework Structure.
  Mechanical: enumerate axioms, verify each has gate binding; verify no axiom has >1 primary gate without justification.

- **G-M2 — Gate set exhaustive over declared axioms.**
  Every declared axiom has ≥1 executing gate. Tests gate-to-axiom coverage.
  Mechanical: reverse mapping check — every axiom reachable from some gate.

- **G-M3 — Gate execution order respected.**
  Gate execution follows topological order declared at substrate §11.5 (substrate → axiom → universal → meta). Tests execution log.
  Mechanical: parse execution log, verify tier-order preserved.

- **G-M4 — Gate failure escalation path declared.**
  Every gate declares its failure escalation path (which lifecycle event triggers on failure, per MA-L4). Tests per-gate escalation declaration.
  Mechanical: enumerate gates, verify escalationPath field present.

**Meta-gate backward-invalidation rule** (per R-phase-1-1-resolution-24):

Meta-gate failure invalidates passes at tier N-1, N-2, ... recursively. Execution tiers:
- Tier 4: Meta-gates (G-M1–G-M4).
- Tier 3: Universal gates (G-U1–G-U5, G-G13).
- Tier 2: Axiom gates.
- Tier 1: Substrate gates.

Backward-invalidation propagation:
- G-M failure → universal gates re-run → if they pass, axiom gates re-verified (no invalidation beyond tier boundary unless universal gate fail surfaces).
- Substrate-tier failure (tier 1) is **non-recoverable at audit level**. Substrate is foundational; its failure cannot be corrected by re-running downstream. Escalates to L0 per bootstrap procedure (substrate §14.6 restore).
- Tier 1 failure is thereby declared as terminal invalidation.

**F-phase-1-1-69 universal gates (5):** unchanged from original spec.

**F-phase-1-1-69 gate distribution:**

| Gate | Declared in | Executed by |
|---|---|---|
| G-U1 Self-application | metaframework | framework-audit |
| G-U2 Propagation completeness | metaframework | amendment-propagation |
| G-U3 Axiom-axis coverage | metaframework | framework-audit |
| G-U4 Primitive declaration | substrate | framework-audit |
| G-U5 Provenance completeness | metaframework | framework-audit AND amendment-propagation |

**Gate rules (GR-series):** GR-1..GR-6 declared authoritatively at framework-audit §4.6.1 (v3.2.3 cycle, closure item 1). Every declared gate (substrate-tier + framework-tier + framework-audit own) conforms to GR-1..GR-6; conformance tested by MA-V9 / G-V9 (added v3.2.3).

### §3.5 Handoff rules (HR0–HR6)

**Seven handoff rules after Phase 1.1** (was 6; added HR0 for L0 activation).

| ID | Direction | Carrier applicability |
|---|---|---|
| **HR0 (new)** | **L0 → metaframework** | **['self', 'named', 'none']** (all) |
| HR1 | substrate → metaframework | ['self', 'named', 'none'] |
| HR2 | metaframework → generation-procedure | ['self'] |
| HR3 | metaframework → framework-audit | ['self', 'named'] |
| HR4 | metaframework → amendment-propagation | ['self', 'named', 'none'] |
| HR5 | metaframework → registry | ['self', 'named', 'none'] |
| HR6 | metaframework → generated L3 frameworks | ['self', 'named', 'none'] |

**HR0 — L0 activation interface** (new per V7):

Contract: L0 triggers metaframework operations via declared AuthorityClaim + target operation structure.

```
HR0:
  direction: { from: L0 (substrate §5 authority), to: metaframework-v3-2 }
  carrierApplicability: ['self', 'named', 'none']
  invariant:
    L0 activation carries AuthorityClaim (level='L0'), target FrameworkRef,
    operation name, typed input per target's schema.input, and concurrency policy.
    Metaframework receives activation, acquires registry lock per substrate §13.5,
    dispatches to owned framework per Mode, and returns outcome via activation-flow.
    Activation without AuthorityClaim at level='L0' is rejected.
```

**Carrier applicability semantics declared per substrate §9** (per R-phase-1-1-resolution-13):

| Applicability value | Meaning |
|---|---|
| `['self']` | Applies only when consuming framework's carrier = 'self' |
| `['self', 'named']` | Applies when carrier ∈ {self, named}; carrier=none skips |
| `['self', 'named', 'none']` (shorthand `'all'`) | Applies regardless of carrier |

Carrier=none handoff as table-row case (per R-phase-1-1-resolution-17): explicit in substrate §9 table; no prose-only declarations.

**All six Coupling axioms (MA-C1 to MA-C6) satisfied** at handoff tier (unchanged from original spec verification).

---

## §4 File decomposition

### §4.1 Six-file set

Unchanged from original spec.

| # | File | Kind | Consumes |
|---|---|---|---|
| 1 | `substrate-v1-0.md` | non-framework | nothing |
| 2 | `framework-registry-v1-0.md` | non-framework (state store) | substrate |
| 3 | `metaframework-v3-0.md` | framework | substrate, registry |
| 4 | `generation-procedure-v1-0.md` | framework | substrate, metaframework |
| 5 | `framework-audit-v1-0.md` | framework | substrate, metaframework |
| 6 | `amendment-propagation-v1-0.md` | framework | substrate, metaframework, registry |

### §4.2 Universal framework-file shape

Nine sections — unchanged structure:
```
§1 Identity
§2 Schema
§3 Structure
§4 Validity
§5 Lifecycle
§6 Coupling
§7 Judgment (per substrate §8.6 empty-declaration derivation)
§8 Self-audit results (per framework-audit §8 schema)
§9 Change log
```

**§7 empty-declaration rule** now derived from substrate §8.6 per R-phase-1-1-resolution-23. Framework files reference substrate rule; do not restate.

**File-shape applicability rule** declared at substrate §9 per R-phase-1-1-resolution-18.

### §4.3 Non-framework file shapes

**substrate-v1-0.md:** sixteen sections (§1–§14 content + §15 self-audit + §16 version history).

**framework-registry-v1-0.md:** as originally declared (9 sections, content-specific shape).

**Registry self-audit omission** (per R-phase-1-2-0029 structural resolution): Non-framework state stores (registry) omit §8 Self-audit by structural decision. Data-integrity invariants (IG-series) test themselves via write-time checks, not axiom self-application. MA-V5 N/A for non-frameworks.

### §4.4 File-specific content placement

**Reference to metaframework-v3-0.md §3 Structure for axis content** (per R-phase-1-1-resolution-08 single-source). This spec does not restate; §3 of the framework file owns the content.

Per-file content summaries:
- `metaframework-v3-0.md` per §3 of this spec.
- `generation-procedure-v1-0.md` — generative-mode framework producing GeneratedFrameworkTemplate; carries P8 procedure steps with kind declarations; declares J-IDs for non-mechanical steps.
- `framework-audit-v1-0.md` — verificative-mode framework; declares 10 audit dimensions (per draft artifact §3); executes per-framework audit.
- `amendment-propagation-v1-0.md` — structural-mode framework; consumes amendment events; verifies propagation completeness.
- `framework-registry-v1-0.md` — state store; holds per-framework state, provenance, lifecycle index.

### §4.5 F-phase-1-1-69 gate distribution across files

Per §3.4 above.

### §4.6 Non-framework gate semantics (per R-phase-1-1-resolution-19)

Non-framework files may declare gates per substrate §9 terminology. Gates test non-framework content per non-framework rules (content integrity, not framework-kind axioms). No ambiguity: gate presence does not force framework classification; kind is declared, not inferred from gate presence.

---

## §5 Finding closure map

Full 73-finding enumeration per F-phase-1-1-A-10. Findings grouped by closure mechanism with individual IDs listed.

### §5.1 Layer 1 audit findings (v2.5 → v3.0) — 73 IDs enumerated

Original audit set from Pass 10 + Pass 11 + Pass 12. Enumerated here as single flat list with individual closure mechanism per ID.

**Pass 10 Dimension A — Concern (12 roots):**
- F-phase-1-1-01 (leaf-cell bundling): closed by PR1 primitive traceability + primitive shape discipline (substrate §8).
- F-phase-1-1-02 (identity-row bundling): closed by primitive shape discipline.
- F-phase-1-1-03 (scope-cell bundling): closed by PR1.
- F-phase-1-1-04 (axiom-as-test-reference): closed by AxR2 direct-condition rule; Pass 1.1 axioms all restated directly.
- F-phase-1-1-05 (gate-spec multi-check): closed by P5 primitive shape (each gate tests one axiom unless declared multi-axiom per P5).
- F-phase-1-1-06 (vocab entries bundling): closed by substrate §9 terminology splitting each term into own declaration.
- F-phase-1-1-07 (back-compat row bundling): closed by §12/§13 split — rules → amendment-propagation, state → registry (§5.3 below).
- F-phase-1-1-08 (self-audit row bundling): closed by framework-audit §8 schema — per-gate records, not prose bundles.
- F-phase-1-1-09 (procedure-step bundling): closed by P8 primitive shape — each step declares fields explicitly.
- F-phase-1-1-10 (propagation-item bundling): closed by amendment-propagation framework primitive instances.
- F-phase-1-1-11 (prose-note multi-concern): closed by PR1 primitive traceability.
- F-phase-1-1-12 (change-log bundling): closed by per-file §9 change log scoped to file only.

**Pass 10 Dimension B — Ownership (12 roots):**
- F-phase-1-1-13 (F-phase-1-1-B-1 atomicity co-ownership): closed by substrate §8 single declaration + substrate §10 PR-rules.
- F-phase-1-1-14 (F-phase-1-1-B-2 axiom-gate co-ownership): closed by AxR2 + AxR1 separation of axiom (condition) from gate (test).
- F-phase-1-1-15 (F-phase-1-1-B-3 schema-field co-ownership): closed by Coupling axis consolidating Carrier/Custody/Provenance/Handoff.
- F-phase-1-1-16 (F-phase-1-1-B-4 §4.4 ↔ §11 duplication): closed by AxR1 single-axis binding + gate-in-Validity single home.
- F-phase-1-1-17 (F-phase-1-1-B-5 handoff H4 redundancy): retained as declared orthogonal to H1 (no-re-ownership distinct from singly-owned custody).
- F-phase-1-1-18 (F-phase-1-1-B-6 dry-run site duplication): closed by framework-audit being separate framework (F-phase-1-1-54).
- F-phase-1-1-19 (F-phase-1-1-B-7 validity-conjunction near-duplicate): closed by MA-V3 single result semantics + per-gate result records.
- F-phase-1-1-20 (F-phase-1-1-B-8 generation-step dual definition): closed by P8 single primitive definition at substrate.
- F-phase-1-1-21 (F-phase-1-1-B-9 VersionTransition duplication): closed by single EscalationState/VersionTransition atom at metaframework §3.
- F-phase-1-1-22 (F-phase-1-1-B-10 identity-field literal duplication): closed by FrameworkRef + LevelKindPair atom at substrate/metaframework.
- F-phase-1-1-23 (F-phase-1-1-B-11 governing-question triple-site): closed by single concern declaration per axis (P1 primitive shape).
- F-phase-1-1-24 (F-phase-1-1-B-12 escalation-state duplication): closed by single EscalationState atom.

**Pass 10 Dimension C(S1) — Forward-reference direction (6 roots):**
- F-phase-1-1-25 through F-phase-1-1-30 (C-S1-1 through C-S1-7, minus S1-6 which was skipped in original pass): closed by substrate-first-then-framework file ordering. Substrate declares shared vocabulary; framework-local vocabulary declared inline in §3 at point of use.

**Pass 10 Dimension C(S2) — Framework-hierarchy (4 roots):**
- F-phase-1-1-31 (C-S2-1 Semver L2-consumes-L3): closed by substrate §7 declaring Semver as external reference (upstream of frameworks, not L3-owned).
- F-phase-1-1-32 (C-S2-2 H2 L3 architecture): closed by substrate §1.3 permitted-multi-execution + substrate-declared atoms consumed by reference.
- F-phase-1-1-33 (C-S2-3 §12 L3 state in L2): closed by §12 extraction — state → registry, rules → amendment-propagation.
- F-phase-1-1-34 (C-S2-4 §15 dry-run uses L3): closed by framework-audit operating on AxiomRef references, not embedded framework content.

**Pass 10 Dimension C(S3) — Concept-definition orphans (6 roots):**
- F-phase-1-1-35 (C-S3-1 internal type-shape orphans): closed by substrate §4 nine-atom declaration + Coupling axis custody per atom.
- F-phase-1-1-36 (C-S3-2 authority-level orphans): closed by substrate §5 L-level declaration.
- F-phase-1-1-37 (C-S3-3 external framework references): escalation resolved as Structural via bundled substrate external-reference treatment (Manual II.3 et al.).
- F-phase-1-1-38 (C-S3-4 derivation-mechanism orphans): closed by Escalation 3 resolution — each step kind declared (mechanical/judgment-input) + judgment typed per substrate §6.
- F-phase-1-1-39 (C-S3-5 gate-closure mechanism orphan): closed by MA-L4 typed escalation state + declared resume procedure.
- F-phase-1-1-40 (C-S3-6 primitive concept implicit): closed by substrate §8 explicit P1–P8 declaration.

**Pass 10 Dimension D — Authorship kind (1 root):**
- F-phase-1-1-41 (F-phase-1-1-D-1 axiom-as-test-reference): closed by AxR2 + Pass 1.1 direct-condition restatement.

**Pass 11 findings (11 roots — self-application cluster):**
- F-phase-1-1-42 (self-fail MA-G1 Mode): closed by substrate-tier Mode declaration + MA-I1 applied to self.
- F-phase-1-1-43 (self-NA MA-G5b WAtom): closed by substrate §4 A-01 WAtom shape declaration.
- F-phase-1-1-44 (self-fail MA-G5c custody): closed by metaframework Coupling axis custody table.
- F-phase-1-1-45 (self-fail MA-G5d provenance): closed by GeneratedFrameworkTemplate.provenance reference-based structure.
- F-phase-1-1-46 (self-coverage-gap MA-G8a carrier=self): closed by substrate §14 bootstrap explicitly declaring self-application as bootstrap event.
- F-phase-1-1-47 (self-NA H2 substrate): closed by substrate §9 H2 equivalent via permitted-multi-execution + substrate-declared atoms.
- F-phase-1-1-48 (self-fail H3 directional handoff): closed by HR0–HR6 all directional with FrameworkRef endpoints.
- F-phase-1-1-49 (self-coverage-gap struct-granularity): closed by P3 Leaf primitive atomicity enum (property/descriptor/axiom) + PG2 coverage.
- F-phase-1-1-50 (self-coverage-gap §16 propagation): closed by amendment-propagation framework with G-U2 universal gate.
- F-phase-1-1-51 (self-coverage-gap L2-document spec): closed by universal framework-file shape declared at substrate §9.
- F-phase-1-1-52 (MA-G13 hidden framework §10): closed by generation-procedure extraction + formalization of MA-G13 at substrate §1.1.

**Pass 12 findings (21 roots):**
- F-phase-1-1-53, F-phase-1-1-54, F-phase-1-1-55 (hidden frameworks at §10, §11+§14+§15, §16): closed by six-file extraction.
- F-phase-1-1-56 (§13 axiom-tier as vocabulary): closed by substrate §8.6 empty-declaration + PR1 primitive traceability.
- F-phase-1-1-57 (§12 mixed kinds): closed by §12 split to amendment-propagation + registry.
- F-phase-1-1-58 (Lifecycle axis no axioms): closed by MA-L1 through MA-L5 + MA-L6 + MA-L7 declared on Lifecycle.
- F-phase-1-1-59 (axiom-to-axis binding undeclared): closed by MA-{axis-code}-{n} naming convention.
- F-phase-1-1-60 (decision-ownership boundaries): closed by framework-audit X4 Negative space dimension.
- F-phase-1-1-61 (post-E8-fail remediation): closed by substrate §13.6 L0-unavailability + §14.6 restore procedure + amendment-propagation framework.
- F-phase-1-1-62 (judgment-as-input undeclared): closed by Escalation 3 resolution — substrate §6 Judgment + metaframework Judgment axis.
- F-phase-1-1-63 (metaframework primitive set undeclared): closed by substrate §8 P1–P8.
- F-phase-1-1-64 (Modes at wrong tier): closed by substrate §2 Modes.
- F-phase-1-1-65 (UVs at wrong tier): closed by substrate §3 Universal Variables.
- F-phase-1-1-66 (Coupling axis missing): closed by seven-axis set including Coupling.
- F-phase-1-1-67 (Execution axis missing): closed by Escalation 2 resolution — generation-procedure extraction.
- F-phase-1-1-68 (primitive declaration placement): closed by substrate §8 + Structure axis primitive-instance declaration.
- F-phase-1-1-69 (E-gate set non-exhaustive): closed by G-U1 through G-U5 universal gates.
- F-phase-1-1-70 (error-handling compound failures): closed by MA-L4 typed escalation + substrate §13.5 registry-lock resolution.
- F-phase-1-1-71 (MA-G re-verification undeclared): closed by MA-V4 gate re-verification rule + meta-gate backward-invalidation (per R-phase-1-1-resolution-24).
- F-phase-1-1-72 (metaframework generation-provenance undeclared): closed by substrate §14 bootstrap declaration + GeneratedFrameworkTemplate.provenance.
- F-phase-1-1-73 (generated framework provenance undeclared): closed by registry framework-by-framework provenance record + HR5.

**Total Layer 1: 73 findings, all closed.**

### §5.2 Combined-audit findings — Phase 1.1 50 accepted

**21 Layer 1 (from combined audit):**
- F-phase-1-1-A-01 through F-phase-1-1-A-06, F-phase-1-1-A-08 through F-phase-1-1-A-10, F-phase-1-1-A-12 through F-phase-1-1-A-14, F-phase-1-1-A-15 through F-phase-1-1-A-24: closures per §1.3 ledger resolution locus column.

**29 Layer 2 (from combined audit):**
- X1: F-phase-1-1-B-01, F-phase-1-1-B-02, F-phase-1-1-B-03 — closed by framework-audit X1 dimension.
- X2: F-phase-1-1-B-04, F-phase-1-1-B-05 — closed by framework-audit X2 dimension.
- X3: F-phase-1-1-B-07, F-phase-1-1-B-08, F-phase-1-1-B-09 — closed by framework-audit X3 dimension.
- X4: F-phase-1-1-B-13 — closed by framework-audit X4 dimension.
- X5: F-phase-1-1-B-14, F-phase-1-1-B-16 — closed by framework-audit X5 dimension.
- X6: F-phase-1-1-B-19, F-phase-1-1-B-20, F-phase-1-1-B-21, F-phase-1-1-B-22 — closed by framework-audit X6 dimension.
- X7: F-phase-1-1-B-24, F-phase-1-1-B-25, F-phase-1-1-B-26, F-phase-1-1-B-27, F-phase-1-1-B-29, F-phase-1-1-B-30 — closed by framework-audit X7 dimension.
- X8: F-phase-1-1-B-31, F-phase-1-1-B-32, F-phase-1-1-B-33 — closed by substrate §14 bootstrap + framework-audit X8 dimension.
- X9: F-phase-1-1-B-34, F-phase-1-1-B-36 — closed by framework-audit X9 dimension.
- X10: F-phase-1-1-B-37, F-phase-1-1-B-38, F-phase-1-1-B-39 — closed by substrate §13 activation flow + framework-audit X10 dimension.

**Total Layer 2: 29 findings accepted, all closed.**

### §5.3 Severity counts per closure group

| Closure group | Structural | Consequential | Hygiene |
|---|---|---|---|
| Substrate extraction (§5.1 Dimension C(S3)) | 3 | 2 | 1 |
| Framework extraction (MA-G13) | 4 | 0 | 0 |
| §12/§13 splitting | 2 | 1 | 0 |
| Coupling axis introduction | 1 | 1 | 0 |
| Judgment axis + typed judgment | 2 | 0 | 0 |
| Expanded axiom distribution | 1 | 1 | 0 |
| Direct-condition axiom rewriting | 3 | 0 | 0 |
| Gate set expansion (F-phase-1-1-69 + universal) | 2 | 0 | 0 |
| Forward-reference elimination | 0 | 1 | 5 |
| MA-V4 re-verification | 0 | 1 | 0 |
| Registry externalization | 1 | 1 | 0 |
| Universal framework-file shape | 2 | 0 | 0 |
| Self-audit externalization | 1 | 1 | 0 |
| MA-L2 + amendment-propagation | 1 | 0 | 2 |
| PR1 primitive traceability | 0 | 1 | 0 |
| Substrate §13 activation flow | 3 | 2 | 0 |
| Substrate §14 bootstrap | 3 | 0 | 0 |
| Framework-audit dimensions X1–X10 | 9 | 12 | 4 |
| Phase 1.1 Layer 1 resolutions | 8 | 8 | 5 |
| **Total accepted** | **46** | **32** | **17** |

(Note: some findings closed by multiple mechanisms per §5.4 below; totals sum greater than 73+50=123 because of multiple-closure; unique findings remain 73 + 50 = 123 total findings across all audits, not 95.)

Corrected unique count:
- Original v2.5 audit: 73 findings.
- Combined audit Phase 1.1: 50 accepted + 7 rejected + 7 deferred = 64 total.
- 50 accepted are resolved in this revision.
- 7 rejected declared reason in brief §1.3.
- 7 deferred tracked for 9b writing resolution.

### §5.4 Multi-closure robustness

Several findings closed by multiple mechanisms — redundancy preserves robustness if any single mechanism later identified as insufficient:

- F-phase-1-1-35 (orphan types): closed by substrate §4 atoms + Coupling custody + G-U4 primitive declaration gate.
- F-phase-1-1-47 (H2 self-NA): closed by substrate §1.3 permitted-multi-execution + substrate §4 atoms + HR1 handoff rule.
- F-phase-1-1-63 (primitive set orphan): closed by substrate §8 primitives + PR1 traceability + G-U4.
- F-phase-1-1-A-01 (substrate bundling): closed by substrate §1.1–§1.4 four-item split + substrate §10 SG1 declaration gate.
- F-phase-1-1-B-31, F-phase-1-1-B-32, F-phase-1-1-B-33 (bootstrap paradox): closed by substrate §14 bootstrap declaration + framework-audit X8 dimension + MA-L7 non-re-entrancy axiom.

### §5.5 Rejected findings (7)

Per brief §1.3. Rationale recorded in brief. Not re-litigated here.

### §5.6 Deferred findings (7)

Hygiene-defer: F-phase-1-1-B-06, F-phase-1-1-B-15, F-phase-1-1-B-17, F-phase-1-1-B-18 + 3 Layer 1 Hygiene. Tracked for 9b writing resolution.

### §5.7 Phase 1.2 findings (2)

Post-Phase-1.1 findings surfaced for Phase 1.2 cycle; registered here as amendments to the closed Phase 1.1 finding set per MA-L2 (gap trigger). Each finding assigned an ID.

| ID | Finding | Resolution locus |
|---|---|---|
| F-phase-1-2-01 | Flow-gap (operation flow implicit) | substrate §8.3 Stage enum + P8 +stage +ternary kind; substrate §10.2 PR4 + PR5; substrate §11.2 PG6 amended; framework-audit §3.3 X10 extension |
| F-phase-1-2-02 | Capture-gap (boundary capture undeclared) | substrate §8.2 P6 +captureShape +diagnosticSignificance; framework-audit §3.3 X3 criterion C5 |

G-spec-3 verification: F-phase-1-2-01 and F-phase-1-2-02 ∈ Phase 1.2 input finding set.

---

## §6 Sequencing declaration

### §6.1 Build order

Phase 9b onward, post-terminal-gate-pass:
1. `substrate-v1-0.md` (Phase 9b) — draft exists per Phase 1.1 delivery; finalizes at 9b.
2. `framework-registry-v1-0.md` (Phase 9c).
3. `metaframework-v3-0.md` (Phase 9d).
4. `generation-procedure-v1-0.md` (Phase 9e).
5. `framework-audit-v1-0.md` (Phase 9f) — draft §3+§8 exists; finalizes at 9f.
6. `amendment-propagation-v1-0.md` (Phase 9g).

### §6.2 Checkpoint locations

Unchanged from original spec except:
- Terminal gate at §7 now precedes 9b full writing.
- Phase 1.1 re-open brief's terminal gate replaces prior 9a→9b checkpoint.

### §6.3 Cycle boundary

Per LIV Manual Rule 5, each cycle gets own Cycle Brief.

---

## §7 Spec self-audit (mechanical rewrite per R-phase-1-1-resolution-14)

Replaces editorial self-audit with declared gate suite. Each gate has mechanical predicate or criteria-bounded test.

### §7.1 Spec gate suite

**G-spec-1 — Phase-trace integrity.**
*Claim:* every §1–§6 section claim traces to a confirmed phase output.
*Test (mechanical):* for each declarative statement in §1–§6, verify reference to ledger row in §1.3 OR reference to explicit phase source in brief §1.1. Statements without such reference fail.
*Expected result:* pass.

**G-spec-2 — Term home completeness.**
*Claim:* every term used has declared home (substrate, framework-specific vocab, or external reference).
*Test (mechanical):* extract term list from §1–§7; verify each term appears in substrate §9 terminology, named framework §3 Structure vocabulary, or declared external reference. Undeclared terms fail.
*Expected result:* pass. Known candidates for check: Carrier (substrate §9), Mode (substrate §2), MA-G13 (substrate §1.1), cross-axis invariant (substrate §9), non-framework file (substrate §9).

**G-spec-3 — Closure-map ID validity.**
*Claim:* every ID enumerated in §5 closure map exists in the input finding set.
*Test (mechanical):* compare §5 ID list to input set (73 Layer 1 + 50 Phase 1.1 accepted). IDs not in input fail; IDs in input but missing from §5 fail.
*Expected result:* pass. §5.1 enumerates all 73 Layer 1; §5.2 enumerates all 50 Phase 1.1 accepted.

**G-spec-4 — Meta-gate specification completeness.**
*Claim:* every meta-gate declared in §3.4 has specification (name, tests, mechanicality, expected result).
*Test (mechanical):* for G-M1, G-M2, G-M3, G-M4 — verify specification fields present per §3.4 declaration.
*Expected result:* pass. All four specified in §3.4.

**G-spec-5 — Axiom-axis binding completeness.**
*Claim:* every axiom in §3.2 has declared axis (per AxR1).
*Test (mechanical):* enumerate 63 axis-bound axioms + MA-G13; verify each has declared axis (MA-{axis-code}-{n} format) or universal marker.
*Expected result:* pass. §3.2 table enumerates all with axis assignment.

**G-spec-6 — Spec MA-G13 exemption basis.**
*Claim:* §7.3 exemption has declared basis.
*Test (mechanical):* verify §7.3 contains basis statement; verify basis references declared criterion from substrate §1.4 four-property.
*Expected result:* pass. §7.3 below declares basis.

**G-spec-7 — Spec lifecycle declared.**
*Claim:* §7.4 and §1.3 declare consistent spec lifecycle (version, state transitions, amendment propagation).
*Test (mechanical):*
- §7.4 references version (v3.0-r1).
- §7.4 declares state transitions (draft/confirmed/amended/historical or equivalent).
- §7.4 declares amendment propagation to downstream artifacts.
- §1.3 ledger includes rows consistent with §7.4 claims.
*Expected result:* pass. §7.4 below declares.

**G-spec-8 — Self-mapping procedure declared by name.**
*Claim:* three-pass self-mapping audit procedure declared with name.
*Test (mechanical):* verify §1.4 contains named procedure with three ordered passes.
*Expected result:* pass. §1.4 declares "Self-Mapping Audit Procedure" with three passes.

### §7.2 Gate execution log

Gates G-spec-1 through G-spec-8 executed at spec finalization. Results:

| Gate | Result | Evidence |
|---|---|---|
| G-spec-1 | pass | every §1–§6 claim references §1.3 ledger or §1.1 brief |
| G-spec-2 | pass | all candidate terms declared at substrate §9 or framework §3 |
| G-spec-3 | pass | §5.1 (73 Layer 1) + §5.2 (50 Phase 1.1) cover full input set |
| G-spec-4 | pass | G-M1–G-M4 specified in §3.4 |
| G-spec-5 | pass | 63+1 axioms with axis assignment in §3.2 table |
| G-spec-6 | pass | §7.3 declares exemption basis |
| G-spec-7 | pass | §7.4 version + state transitions + propagation declared |
| G-spec-8 | pass | §1.4 names "Self-Mapping Audit Procedure" with three passes |

Overall: pass. Terminal gate requirement (brief §6) satisfied.

### §7.3 Spec MA-G13 exemption (declared basis per R-phase-1-1-resolution-09)

This spec is classified as **non-framework artifact**. MA-G13 exemption granted on the following declared basis against substrate §1.4 four-property criteria:

- **Own state:** spec declares own version (v3.0-r1) and state transitions (§7.4) — criterion **satisfied**.
- **Own I/O:** spec has no typed input/output atoms. Consumes: confirmed-phase outputs (informal). Produces: this document (informal). Criterion **not satisfied** — no typed schemas declared.
- **Own invariants:** spec has declarations but **no structural-transformation invariants**. §7.4 lifecycle transitions are data-integrity kind (draft→confirmed is state-change, not structural transformation). Criterion **not satisfied** per §1.2 kind-of-invariants distinction.
- **Own discipline:** spec has §7 self-audit as declared discipline. Criterion **satisfied**.

**Two of four criteria unsatisfied.** Per MA-G13, spec fails framework test. Classified as non-framework artifact (specifically: design record / confirmation ledger).

Exemption declared, not inferred.

Basis note: spec's lifecycle is data-integrity kind rather than structural-transformation because state transitions (draft → confirmed → amended → historical) describe the spec's record status, not transformations applied to content. Content is fixed per revision; revisions are new records, not transformations of prior. This matches the registry's kind-of-invariants classification pattern.

### §7.4 Spec lifecycle declared (per F-phase-1-1-B-01, F-phase-1-1-B-02, F-phase-1-1-B-03)

**Version:** v3.2.4 (cycle-1 v3.2.4 supersedes v3.2.3 → v3.2.1 → v3.2 → v3.1 → v3.0; additive transition per MA-L1). Prior revisions retained in git history per S5 filename opacity (filename `v3-1-spec.md` is opaque label per substrate §10.1 S5; canonical version in §1 Identity).

**State enum:**
- `draft` — spec authored but not confirmed.
- `confirmed` — L0 confirmed; binds downstream artifact writing.
- `amended` — L0 authorized amendment; new revision replaces prior.
- `historical` — superseded by later revision; retained in git history.

**Transitions:**
- `draft → confirmed`: L0 reviews + confirms via terminal gate pass.
- `confirmed → amended`: L0 issues amendment directive; new revision authored; re-enters `draft`.
- `amended → confirmed`: terminal gate passes on new revision.
- `confirmed → historical`: on new revision confirmation, prior revision transitions to historical.

**Amendment propagation to downstream artifacts** (per F-phase-1-1-B-03):
- Amendment to confirmed spec triggers re-verification of downstream artifacts (substrate, metaframework, etc.) against new spec.
- Amendment-propagation framework (post-bootstrap) handles propagation mechanically when amendment-propagation is operational.
- Pre-operational amendment-propagation (during Phase 9b–9g): amendments propagate manually via Cycle Brief with declared scope.
- Propagation completeness verified by G-U2 universal gate when amendment-propagation operational; pre-operational verification via L0 confirmation.
- Cycle-1 v3.2.4 propagation: AmendmentEvent of `amendmentTrigger: 'gap'` per spec rev-2 cycle scope; processed via amendment-propagation v1.3 8-step procedure including new AP6.5 cross-framework consistency check (F-cycle-1-10).

**Spec as RegistryEntry (cycle-1 v3.2.4 per F-cycle-1-15/Q-cycle-1-4):**
Cycle-1 v3.2.4 closes the F-cycle-1-15 "spec is 7th tracked artifact but absent from RegistryEntry table" gap. Spec is registered as a 7th RegistryEntry at framework-registry-v1-1 §5 with `entryKind: 'spec'` and `kind: 'Protocol'`. Rationale: A-10 Kind enum is `'Framework' | 'State-store' | 'Protocol' | 'Substrate'`; spec is the canonical declared text from which metaframework renders (declared rule set, rendered via consumer) → fits Protocol semantics. `'Substrate'` would mis-classify spec as substrate-tier; new kinds would extend A-10, contradicting Q-cycle-1-4 (A-10 untouched). `entryKind` field added to RegistryEntry schema per Q-cycle-1-4 amended (additive per MA-S7; G-S7 verifies).

**Current state:** `confirmed` post-MF-Cycle-1 Foundation Closure ratification (L0 confirmed 2026-04-29 per spec rev-2 §12 closure: no preserved MF-amendment-1 carry text → carries close-by-rebuild per Q-cycle-1-1; sweep scope bounded to 7 canonical files; spec stamps v3.2.4 uniformly).

### §7.5 Three-pass procedure named (per R-phase-1-1-resolution-22, redundant with §1.4)

Cross-reference: Self-Mapping Audit Procedure declared at §1.4. Referenced by G-spec-8.

---

## §8 Runtime open items

**Post-canonical runtime deferrals.** Items logged at Phase 9c–9g delivery as declaration-only at delivery; full runtime resolution post-canonical via amendment-propagation per MA-L2 (amendment trigger = gap). Aggregated here for cross-cycle tracking per audit table §6 P4 residue and §9 in-cycle additions.

| ID | Owner framework | Fix-site | Item | Resolution path |
|---|---|---|---|---|
| R-phase-1-2-0035 | generation-procedure-v1-0 | §3.3 S2 row | S2 mechanical step coarse-grained — single P8 instance for full template-population pipeline. Alternative: per-field split. Per MA-St4 primitive-atomicity collapse rule applied. | Additive v1.1 if runtime surfaces per-field checkpoint need. |
| R-phase-1-2-0036 | generation-procedure-v1-0 | §3.3 / §4.2 | No explicit declaration that E1–E8 execution order is free within Stage 3. PR4 requires stage monotonicity across `order` but not within-stage order. | If parallel E-execution implemented: declare parallelism-permitted at §3.3. |
| R-phase-1-2-0038 | generation-procedure-v1-0 | §5.6 atomicity | Per-step atomicity uses 'step boundary' semantics without precise boundary declaration. Inherited from substrate §13.4 by reference. | Make intra-step-vs-inter-step distinction explicit only if runtime ambiguity surfaces. |
| R-phase-1-2-0050 | framework-audit-v1-2 | §5.7 vs §3.3 X5 | scaleBounds declared per-audit O(D+G) and total O(F×R). Sub-operation bounds derivable from substrate §13 but not explicitly broken out. | X5 first-run may surface need; amend at that time. |
| R-phase-1-2-0059 | amendment-propagation-v1-0 | §5.7 | Self-amendment bootstrap handling declared at high-level depth per L0 Q-cycle-1-3. Formalization of meta-recursion procedure deferred. | Terminal cross-file gate phase: formalize if runtime surfaces ambiguity. |

**Scope note:** items listed here are known-incomplete declarations accepted as sprint-mode-sufficient at delivery. Amendment path for each: generate amendment event → amendment-propagation runs → affected frameworks re-versioned additively per MA-L1. No item in this catalog blocks canonical confirmation.

**Items closed in this cycle (for traceability):**
- R-phase-1-2-0029 (registry §8 omission) — closed via §4.3 structural declaration this spec.
- R-phase-1-2-0046 (framework-audit §3.4 placeholder) — closed via framework-audit v1.3 §3.4 text replacement.

---

## §9 Scope guard

**Not in scope per brief §8:**
- New findings beyond 50 frozen set.
- New substrate additions beyond activation-flow + bootstrap.
- Re-derivation of Phases 2/3/4/5/7/8 (verification only; V4 pre-declared outcome realized: MA-L6 + MA-L7 added).
- New framework-audit dimensions beyond 10.
- 9b full substrate writing (resumes after terminal gate passes).

Scope guard enforced during revision. No out-of-scope content introduced.

---

## §10 MF-Cycle-1 v3.2.4 Foundation Closure summary

L0-confirmed delivery 2026-04-29 against spec rev-2 ratified by L0. Foundation friction closed before Cycle 2 (referent layer) entry. Per spec rev-2 §1.1 cycle scope.

### §10.1 Closures (15 friction findings + Cluster E + 3 carries + Q-cycle-1-1–Q-cycle-1-4)

| Finding | Resolution site |
|---|---|
| F-cycle-1-1 (S-rule namespace disambiguation) | substrate §1.1–§1.4 SI-01..SI-04 rename; spec §2.1 swept; framework-audit + AP + gen-procedure citations swept |
| F-cycle-1-2 (schema-amendment authority) | metaframework §3.2.1 MA-S7 + §4.8.2.4 G-S7 declared; spec §3.2.7.1 axiom body |
| F-cycle-1-3 (GateResult ternary conflation) | framework-audit §8.1 GateResult + DimensionResult decomposed into orthogonal fields (truthValue + executionState + applicability + basis) |
| F-cycle-1-4 (substrate ternary forbidden vs reportingSchema) | substrate §10.1 S4 added (binary truth-value); §11.6 + §6.3 line 382 amended |
| F-cycle-1-5 (filename/version skew) | substrate §10.1 S5 added (filename opacity) |
| F-cycle-1-6 (stage-discipline duplication) | framework-audit §3.3 X10 footnote per SI-03 |
| F-cycle-1-7 (empty-declaration marker untyped) | substrate §4.2 A-17 EmptyPrimitiveDeclaration + §8.6 + §11.3 G-U4 amended |
| F-cycle-1-8 (n/a basis runtime-unenforced) | metaframework §3.2.1 MA-V11 + §4.8.4.5 G-V11 declared; spec §3.2.7.2 axiom body |
| F-cycle-1-9 (no system-state query) | registry §2.5 SystemStateSnapshot + §4 readSystemState() declared |
| F-cycle-1-10 (no cross-framework consistency surface) | amendment-propagation §3.3 AP6.5 step added (8-step procedure) |
| F-cycle-1-11 (not-yet-run resolver) | resolved by F-cycle-1-3 fix (typed executionState field) + metaframework §5.X first-run-execution lifecycle event declared (AmendmentEvent kind 'first-run' per F-cycle-1-6 audit fix) |
| F-cycle-1-12 (grandfathered null-provenance) | substrate §4.2 A-05 in-place rename ProvenanceRow → OriginProvenance; A-16 AmendmentProvenance added; registry §2.1 RegistryEntry extended with amendmentProvenance field |
| F-cycle-1-13 (AuditRunRecord ↔ AmendmentEvent linkage) | framework-audit §2.1 AuditRequest extended with triggeringAmendmentId field |
| F-cycle-1-14 (MetaframeworkGateIdSet at metaframework, consumed by 3) | substrate §4.2 A-15 GateIdSet lifted; metaframework §3.5 + §6.5 derived consumer of A-15 |
| F-cycle-1-15 (spec absent from RegistryEntry) | registry §2.1 RegistryEntry extended with entryKind field; §5 spec entry added as 7th row |
| Cluster E hygiene (5 sites) | spec lines 51 + 187 swept to v3.2.4; metaframework §5.6 historical rows refreshed; gen-procedure §5.7 v1.0 row preserved + v1.1.x folded; framework-audit §4.1 line 401 count refreshed; AP §5.10 v1.1 row added |
| MF-amendment-1 carries (3) | F-MFA1-AP-001 superseded by F-cycle-1-12 fix; F-MFA1-GP-001 + F-MFA1-AUDIT-001 closed-by-rebuild per Q-cycle-1-1 (L0 confirmed 2026-04-29: no preserved carry text) |
| Q-cycle-1-1 (rebuild from v3.2.3) | confirmed; cycle 1 authored against canonical v3.2.3 directly |
| Q-cycle-1-2 (MA-S7 + G-S7) | confirmed; declared at metaframework §3.2.1 + §4.8.2.4 |
| Q-cycle-1-3 (registry readSystemState) | confirmed; declared at registry §4.2 |
| Q-cycle-1-4 (spec as RegistryEntry + entryKind) | confirmed; declared at registry §2.1 + §5 row 7 |

### §10.2 Counts after cycle-1

| Count | Pre-cycle-1 (v3.2.3) | Post-cycle-1 (v3.2.4) | Delta |
|---|---|---|---|
| Substrate atoms | 14 | 17 | +3 (A-15, A-16, A-17) + 1 in-place rename (A-05) |
| Substrate rules (S-series) | S1, S2, S3 | S1, S2, S3, S4, S5 | +2 |
| Substrate items (SI-series) | S-01..S-04 (renamed) | SI-01..SI-04 | rename (no count change) |
| Metaframework axioms | 64 | 66 | +2 (MA-S7 Schema, MA-V11 Validity) |
| Framework-tier gates | 80 | 82 | +2 (G-S7, G-V11) |
| Total all-gates | 84 | 86 | +2 |
| AP procedure steps | 7 | 8 | +1 (AP6.5) |
| RegistryEntry rows | 6 | 7 | +1 (spec entry per F-cycle-1-15) |
| RegistryEntry schema fields | per v1.0 | + entryKind, + amendmentProvenance | +2 |
| Registry read paths | 3 | 4 | +1 (readSystemState) |
| Lifecycle events declared | (per metaframework §5) | + first-run-execution | +1 |

### §10.3 File version transitions

| File | Pre-cycle-1 | Post-cycle-1 | Transition kind |
|---|---|---|---|
| substrate-v1-1.md | v1.2 | v1.3 | MA-L4 schema amendment (3 atom adds, 1 in-place rename) + 2 substrate-rule adds; additive per S3 + MA-S7 |
| metaframework-v3-1.md | v3.2.3 | v3.2.4 | MA-L1 axiom additions (MA-S7, MA-V11) + paired gates (G-S7, G-V11) + lifecycle event declared (first-run-execution); additive |
| framework-audit-v1-2.md | v1.3.2 | v1.3.3 | MA-L4 schema amendment (GateResult + DimensionResult decomposed; AuditRequest extended); additive shapes |
| amendment-propagation-v1-0.md | v1.2 | v1.3 | MA-L4 procedure step add (AP6.5) + amendmentTrigger enum extension; additive |
| generation-procedure-v1-0.md | v1.1.2 | v1.1.3 | Cycle-1 cascade only (count restatements + hygiene); additive |
| framework-registry-v1-0.md | v1.0 | v1.1 | MA-L4 schema amendment (entryKind field, amendmentProvenance field, readSystemState method, AmendmentLogEntry alias declaration, OriginProvenance rename); additive |
| v3-1-spec.md | v3.2.3 | v3.2.4 | Spec rendering of all above + spec registered as RegistryEntry per F-cycle-1-15/Q-cycle-1-4 |

---

## §11 MF-Cycle-1.5 v3.2.5 Identifier Discipline Closure summary

### §11.1 Closures (1 structural rule + 1 paired gate + canonical kind registry + 4 audit gaps)

| Closure | Mechanism |
|---|---|
| Identifier collision space (A-NN dual-use atom/finding; F-NN zero-padded vs unpadded; R-NNNN unscoped; RF-NN workaround prefix) | substrate §10.1 S6 (canonical naming function) + substrate §1.5 (kind registry: kind-prefix table + locus-ID table + bare-vs-locus-qualified rule) |
| Naming-function conformance enforcement | substrate §11.1 SG5 (paired with S6); §11.5 execution order extended SG1→SG2→SG3→SG4→SG5 |
| A-17 EmptyPrimitiveDeclaration over-specified to fixed P1..P8 enum | substrate §4.2 A-17 `primitiveKind` genericized to `PrimitiveKindRef` reference type (shape-preserving per MA-S7; preserves PR2 additive primitive versioning) |
| MA-S7 axiom body two-clause AxR2 question | spec §3.2.7.1 + metaframework §3.2.1: tightened to single subset-with-type-stability predicate `prior.fields ⊆ current.fields ∧ ∀f. typeOf-stable` |
| SelfAuditRecord envelope ternary residue | framework-audit §8.1 envelope decomposed: `aggregateExecutionState` + `aggregateTruthValue` (orthogonal fields, parallel to per-instance F-cycle-1-3 decomposition) |
| F-cycle-1-6 footnote conflating SI-03 with PR4/PR5 | framework-audit §3.3 X10 footnote disentangled: substrate §10.2 declares; SI-03 permits multi-site execution; X10 is the framework-audit execution site |
| MA-V11/G-V11 vacuous-pass discipline implicit | spec §3.2.7.2 + metaframework §3.2.1 + framework-audit §4.8.4.5: explicit empty-set vacuous-pass clause per substrate §6.3 cardinality semantics |

### §11.2 Counts after cycle-1.5

| Count | Pre-cycle-1.5 (v3.2.4) | Post-cycle-1.5 (v3.2.5) | Delta |
|---|---|---|---|
| Substrate atoms | 17 | 17 | 0 (A-17 `primitiveKind` genericized; shape-preserving per MA-S7) |
| Substrate rules (S-series) | S1..S5 | S1..S6 | +1 (S6 identifier naming function) |
| Substrate gates (SG-series) | SG1..SG4 | SG1..SG5 | +1 (SG5 naming-function conformance) |
| Metaframework axioms | 66 | 66 | 0 |
| Framework-tier gates | 82 | 82 | 0 (substrate gates excluded per §11.5 tier-1) |
| Total all-gates | 86 | 87 | +1 (SG5) |
| Substrate sections | §1.1–§1.4 + §2..§16 | + §1.5 (canonical kind registry) | +1 |

### §11.3 File version transitions

| File | Pre-cycle-1.5 | Post-cycle-1.5 | Transition kind |
|---|---|---|---|
| substrate-v1-1.md | v1.3 | v1.4 | MA-L4 + structural rule add (S6 + SG5 + §1.5 kind registry) + A-17 type genericization (shape-preserving per MA-S7); additive per S3 + MA-S7 |
| metaframework-v3-1.md | v3.2.4 | v3.2.5 | MA-S7 single-condition tightening + MA-V11 vacuous-pass clause + count cascade (86→87 all-gates); additive |
| framework-audit-v1-2.md | v1.3.3 | v1.3.4 | SelfAuditRecord envelope decomposition (parallel to per-instance F-cycle-1-3) + F-cycle-1-6 footnote disentanglement + GR-2/GR-3/GR-6 + G-V9 + common pattern aligned to S4-binary truth-value + G-V11 vacuous-pass clause; additive shapes |
| framework-registry-v1-0.md | v1.1 | v1.2 | RE1 (entryKind/grandfathered cross-field invariant) + RE2 (referential-integrity invariant) declared; additive |
| amendment-propagation-v1-0.md | v1.3 | v1.3.1 | Cycle-1.5 cascade only (count restatements); additive |
| generation-procedure-v1-0.md | v1.1.3 | v1.1.4 | Cycle-1.5 cascade only (count restatements); additive |
| v3-1-spec.md | v3.2.4 | v3.2.5 | Spec rendering of MA-S7 tightening + MA-V11 vacuous-pass + §11 cycle-1.5 summary; additive |

---

## §12 MF-Cycle-1.6 v3.2.6 Identifier Discipline Corrective summary

### §12.1 Closures (cycle-1.5 self-amendment gaps + identifier reclassification)

| Closure | Mechanism |
|---|---|
| Pre-cycle-1.5 conflation of substrate atoms (`A-NN` shapes) and Phase 1.1 resolutions under shared `F-phase-1-1-A-NN` rendering | substrate §1.5 amended: R-row Loci adds `phase-1-1-resolution` locus; bare-form rule prose declares historical conflation and cycle-1.6 separation per kind |
| 116-occurrence sweep across 7 canonical files (originally stated as 62 in spec rev-1; full enumeration superseded the reference figure per L0 directive) | §4.1 classification table produced (16 substrate-atom shape refs to bare A-NN; 14 Phase 1.1 finding refs kept F-phase-1-1-A-NN; 86 Phase 1.1 resolution refs to R-phase-1-1-resolution-NN); applied mechanically |
| F-1.2-NN renaming residue (4 sites; pre-cycle-1.5 hyphen-form) | §4.2 sweep applied; F-1.2-NN → F-phase-1-2-NN |
| Substrate gate count cascade (4→5) incomplete in cycle-1.5 (12 sites listed in spec; full grep surfaced 3 additional cycle-1.5 self-amendment gap sites: metaframework §4.1 gate-count table rows + generation-procedure §4.1 stale `86 total post-cycle-1 v3.2.4`) | §4.3 cascade extended to 15 sites per "no stale enumeration anywhere" directive (count is what falls out of the rule) |
| Registry self-amendment gap at cycle-1.5 (entries table + AmendmentLogEntry block) | §4.4: entries table advanced to cycle-1.6 versions (substrate v1.5, registry v1.3, metaframework v3.2.6, generation-procedure v1.1.5, framework-audit v1.3.5, amendment-propagation v1.3.2, spec v3.2.6); §5.1 v3.2.5 cycle-1.5 AmendmentLogEntry block added (RE2-grandfathered per amendment-event time pre-RE2-declaration); v3.2.6 cycle-1.6 block added (RE2-bound; targets resolve) |
| RE2 grandfathering ambiguity (write-time vs amendment-event time) | §4.4: RE2 amended in registry §2.1 — grandfathering keyed on amendment-event time, not block-write time; clarifying sentence added: "RE2 binds AmendmentLogEntry instances whose amendment event occurs post-cycle-1.5 v1.2" |
| Cycle-1.5 §9 change-log row absence in 4 of 7 canonical files (metaframework, framework-audit, amendment-propagation, generation-procedure) | §5 Cluster E hygiene: cycle-1.5 row written at cycle-1.6 with explicit "row added at cycle-1.6 — closes cycle-1.5 §9 self-amendment gap" annotation; cycle-1.6 row appended per standard |
| SG5 first-run as exit gate | §4.5 SG5 GateResult published in delivery report |

### §12.2 Counts after cycle-1.6

| Count | Pre-cycle-1.6 (v3.2.5) | Post-cycle-1.6 (v3.2.6) | Delta |
|---|---|---|---|
| Substrate atoms | 17 | 17 | 0 (corrective; no atom amendments) |
| Substrate rules (S-series) | S1..S6 | S1..S6 | 0 |
| Substrate gates (SG-series) | SG1..SG5 | SG1..SG5 | 0 |
| Metaframework axioms | 66 | 66 | 0 |
| Framework-tier gates | 82 | 82 | 0 |
| Total all-gates | 87 | 87 | 0 |
| RegistryEntry rows | 7 | 7 | 0 (versions advanced; no row adds) |
| Locus IDs (substrate §1.5) | 8 | 10 | +2 (phase-1-1-resolution, cycle-1-6) |
| Multi-locus identifier kinds (R-) loci | 3 (phase-1-2, phase-1-2-fix, phase-1-2-fix-trail) | 4 | +1 (phase-1-1-resolution) |
| Multi-locus identifier kinds (F-) loci | 4 (phase-1-1, cycle-1, cycle-1-5, future) | 6 | +2 (phase-1-2, cycle-1-6) |

### §12.3 File version transitions

| File | Pre-cycle-1.6 | Post-cycle-1.6 | Transition kind |
|---|---|---|---|
| substrate-v1-1.md | v1.4 | v1.5 | §1.5 amendment (terminology disambiguation) + 116-occurrence body sweep companion; additive per S3 + MA-S7 |
| metaframework-v3-1.md | v3.2.5 | v3.2.6 | §4.1 gate-count cascade closure (cycle-1.5 omission) + body sweep; additive per MA-S7 |
| framework-audit-v1-2.md | v1.3.4 | v1.3.5 | §4.1 inherited-row cascade closure + body sweep; additive |
| framework-registry-v1-0.md | v1.2 | v1.3 | RE2 amended (grandfathering clause); §5 entries table advanced; §5.1 v3.2.5 + v3.2.6 AmendmentLogEntry blocks; body sweep; additive per MA-S7 |
| amendment-propagation-v1-0.md | v1.3.1 | v1.3.2 | Cycle-1.6 cascade only (body sweep); additive |
| generation-procedure-v1-0.md | v1.1.4 | v1.1.5 | §4.1 stale-total closure + §3.3/§4.2 SG4→SG5 cascade + body sweep; additive |
| v3-1-spec.md | v3.2.5 | v3.2.6 | Spec rendering of all above + §12 cycle-1.6 summary; additive |

---

## §13 MF-Cycle-2 v3.2.7 Spec↔Referent Alignment Closure summary

### §13.1 Closures (3 uncovered cells of spec↔referent column + cycle-2 prerequisites)

| Closure | Mechanism |
|---|---|
| Spec↔referent Categorical cell uncovered (no gate tests typed-shape declarations against referent declarations at cited paths) | New axiom MA-V10 + paired gate G-V10 (Validity); produces ReferentAlignmentState per citation per audit run; mechanical when ReferentResolver returns non-null + parser registered for referentKind, applicability='n/a' otherwise per S4 + MA-V11 vacuous-pass |
| Spec↔referent Schema cell uncovered (no gate tests citation declaration shape conformance to A-18) | New axiom MA-S8 + paired gate G-S8 (Schema); type-check + cardinality + enum-membership classes per substrate §6.3 over ReferentCitation declarations |
| Spec↔referent Lifecycle cell uncovered (no gate tests audit-run snapshot stamping) | New axiom MA-L11 + paired gate G-L11 (Lifecycle); null-check + reference-resolution classes per substrate §6.3 over AuditRunRecord.referentSnapshotRef |
| MA-S7 predicate undefined for nested discriminated-union sub-shapes (cycle-2 introduces first such sub-shape via A-18.ExpectedShape) | MA-S7 predicate tightened in-place to recursive `≼` relation governing primitive types, typed-shape references, object shapes, and discriminated-union shapes; G-S7 predicate amended in-place to evaluate the recursive relation; cycle-1 atom set (A-01..A-17) re-validated zero-regression (carry zero discriminated-union sub-shapes) |
| Citation declarations have no canonical declaration site at the template-generation tier | metaframework §2.2 GeneratedFrameworkTemplate `schema:` block extended with `referentCitations: ReferentCitation[]` field (per L0 ratification on cycle-2 §13 item 3 — extend `schema:` placement; semantic fit with input/output typed shapes already there) |
| AuditRunRecord lacks per-run snapshot reference + per-run alignment-state output | framework-audit §5.9 AuditRunRecord extended with `referentSnapshotRef: ReferentSnapshot \| null` + `referentAlignmentStatesRef: ReferentAlignmentState[]` (*Ref pattern parallel to existing gateResultsRef + dimensionResultsRef) |
| AuditRequest lacks snapshot reference for citation-declaring frameworks | framework-audit §2.1 AuditRequest extended with `referentSnapshotRef?: ReferentSnapshot` (optional; populated when target declares ≥1 citation per MA-L11) |
| SelfAuditRecord lacks per-framework latest alignment-state field | framework-audit §8.1 SelfAuditRecord extended with `referentAlignmentStates: ReferentAlignmentState[]` (per-framework latest state; non-Ref pattern parallel to existing gateResults + dimensionResults; queryable via §5.10 queryLatest) |
| Drift detected without disposition path (cycle-1 G9 outer loop unclosed) | amendment-propagation §3.5 drift-disposition flow declared per spec §3.6: 5-step flow Detection → Trigger conversion (drift propagates as AmendmentEvent of kind `'gap'`; existing enum, no extension) → Disposition routing (patch-cycle ownership routes to referent owner per L0 ratification on cycle-2 §13 item 1; G-S8-fail fallback routes to citing framework) → Patch cycle → Re-audit |
| First cycle-2 finding identifier needs registered locus | substrate §1.5 cycle-2 locus row added (required by S6 + SG5) |

### §13.2 Counts after cycle-2

| Count | Pre-cycle-2 (v3.2.6) | Post-cycle-2 (v3.2.7) | Delta |
|---|---|---|---|
| Substrate atoms | 17 | 20 | +3 (A-18 ReferentCitation, A-19 ReferentAlignmentState, A-20 ReferentSnapshot) |
| Substrate rules (S-series) | S1..S6 | S1..S6 | 0 |
| Substrate gates (SG-series) | SG1..SG5 | SG1..SG5 | 0 (substrate gates unchanged) |
| Metaframework axioms — Schema | 7 | 8 | +1 (MA-S8); MA-S7 predicate tightened in-place (no count change) |
| Metaframework axioms — Validity | 10 | 11 | +1 (MA-V10) |
| Metaframework axioms — Lifecycle | 10 | 11 | +1 (MA-L11) |
| Metaframework axioms — total | 66 | 69 | +3 |
| Framework-tier gates | 82 | 85 | +3 (G-V10, G-S8, G-L11); G-S7 predicate amended in-place (no count change) |
| Total all-gates | 87 | 90 | +3 |
| RegistryEntry rows | 7 | 7 | 0 (versions advanced; no row adds) |
| Locus IDs (substrate §1.5) | 10 | 11 | +1 (cycle-2) |
| Multi-locus identifier kinds (F-) loci | 6 | 7 | +1 (cycle-2) |
| AP procedure steps | 8 | 8 | 0 (drift-disposition is routing rule expressed as procedural prose, not a new step) |
| AmendmentEvent.amendmentTrigger enum | `'vision' \| 'gap' \| 'L0-directive' \| 'first-run'` | (unchanged) | 0 (drift uses existing `'gap'` value) |

### §13.3 File version transitions

| File | Pre-cycle-2 | Post-cycle-2 | Transition kind |
|---|---|---|---|
| substrate-v1-1.md | v1.5 | v1.6 | MA-S7 (tightened) schema-additive amendment (3 atoms with inline ExpectedShape sub-shape + ReferentResolver interface) + §1.5 locus row addition; additive per S3 |
| metaframework-v3-1.md | v3.2.6 | v3.2.7 | MA-L1 axiom additions (MA-V10, MA-S8, MA-L11) + gate additions (G-V10, G-S8, G-L11) + GeneratedFrameworkTemplate schema-block field at §2.2 + MA-S7 §3.2.1 predicate tightening; additive (tightening verified zero-regression at cycle-2 spec §3.2 re-validation) |
| framework-audit-v1-2.md | v1.3.5 | v1.3.6 | MA-L4 schema amendment (AuditRequest §2.1 field, AuditRunRecord §5.9 2 fields, SelfAuditRecord §8.1 1 field) + G-S7 §4 predicate amendment + 3 new gate predicates (G-S8, G-V10, G-L11); additive |
| amendment-propagation-v1-0.md | v1.3.2 | v1.3.3 | Drift-disposition flow declaration at §3.5 + count restatements (66→69, 82→85, 87→90); additive |
| generation-procedure-v1-0.md | v1.1.5 | v1.1.6 | E-bundle additions (E2 +G-S8, E4 +G-V10, E5 +G-L11) + count restatements (66→69, 86→90, partition 82→85); additive |
| framework-registry-v1-0.md | v1.3 | v1.4 | Registry §5 versions advance + §5.1 v3.2.7 cycle-2 AmendmentLogEntry block; additive |
| v3-1-spec.md | v3.2.6 | v3.2.7 | Spec rendering of all above; cycle-2 closure summary at §13 |

### §13.4 Self-application result for MFv3 v3.2.7 / substrate v1.6 / framework-audit v1.3.6

**G-V10 result on MFv3 v3.2.7 / substrate v1.6 / framework-audit v1.3.6: applicability='n/a' with basis "MF tier declares zero ReferentCitations — MF cites itself, not code as referent."** Per substrate §10.1 S4 + MA-V11 vacuous-pass clause (binary truth-value with orthogonal applicability, not pre-cycle-1 ternary collapse). MFv3 v3.2.7's vocabulary/atom-inventory tables cite substrate atoms by spec-reference (substrate §4 A-XX), not by code path — these are spec↔spec citations, out of G-V10 scope per cycle-2 spec §3.7. This is the expected and correct result, not a coverage gap. Per cycle-2 spec §11.5 + §12 done criteria mapping item 8.

### §13.5 First-run validation events scheduled

- **G-V10 first-run target:** Cognitive Standard v1.2.2 (post-Cognitive-lift-cycle ratification). Cycle-2 spec §11.1.
- **G-V10 second-run validation target:** L0-selected at cycle-2 step 10 (recommended Plan v2.2 — most independently authored from Cognitive in current LIV state). Cycle-2 spec §11.2.
- **G-S7 (tightened) first-run target:** substrate v1.5 → v1.6 transition. Expected result PASS per cycle-2 spec §11.4 mechanical re-validation (A-01..A-17 reduce to prior subset-with-type-stability predicate; A-18 cycle-2 baseline vacuously satisfies recursive predicate; A-19, A-20 flat shapes reduce to prior predicate).

---

## End of spec (cycle-2 v3.2.7)

**Status:** v3.2.7 confirmed. MF-Cycle-2 Spec↔Referent Alignment Closure delivery (2026-04-30). L0 ratification: spec↔referent column closed across all four axes; framework system inherits typed-citation contract end-to-end; drift-disposition outer loop closed.

**Canonical post-cycle-2 file set:**
- substrate-v1-1.md → v1.6
- framework-registry-v1-0.md → v1.4
- metaframework-v3-1.md → v3.2.7
- generation-procedure-v1-0.md → v1.1.6
- framework-audit-v1-2.md → v1.3.6
- amendment-propagation-v1-0.md → v1.3.3
- v3-1-spec.md → v3.2.7

Filenames retained per substrate §10.1 S5 filename opacity (canonical version in §1 Identity of each file).

**L3 framework adoption proceeds on per-framework cycle pace.** Each L3 enters G-V10's surface when it first declares a ReferentCitation in vocabulary tables; cycle 2 declares forward, consumers adopt voluntarily. No top-down sweep mandated.

**On specific gate failure:** same-delivery re-fix per Phase 1.1 precedent. Do not open new cycle.
