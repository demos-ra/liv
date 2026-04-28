# v3.2.5 Spec — Metaframework System

**Status:** MF-amendment-1 delivery (sprint close: Shot 1 + Shot 2). Substrate-touching amendment cycle. Substrate v1.2 → v1.3 (P8 mode-restriction lifted; mode does not gate procedure-declaration). Framework-audit v1.3.3 → v1.4 (audit-cycle procedure P0–P4 declared at §3.3; existing §3.x renumbered +1; P7 7 → 9; P8 0 → 5). Metaframework v3.2.4 → v3.2.5 (vocab + custody restatement). AP v1.2.1 → v1.2.2 + gen-proc v1.1.3 → v1.1.4 (cascade pointer updates). Spec v3.2.4 → v3.2.5. No new axioms / gates / HRs. Counts unchanged: axiom 64; framework-tier gate 80; HR 7; mode enum 4 (epistemic / structural / generative / verificative).
**Version:** v3.2.5 (MF-amendment-1 sprint close; supersedes v3.2.4 → v3.2.3 → v3.2.1 → v3.2 → v3.1 → v3.0-r1 → v3.0 original).
**Scope:** Six-file metaframework system (substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation).
**Authority:** L0 confirmed through Phase 8 + Phase 1.1 + Phase 1.2 + Phase 1.2-fix + Phase 1.2-fix-trail hygiene + v3.2.3 + MF-patch-1.
**Prior artifact:** v3-0-spec.md (Phase 9a) → v3-1-spec.md (Phase 1.2) → v3.2 (Phase 1.2-fix) → v3.2.1 (hygiene) → v3.2.3 (28-axiom cycle) → v3.2.4 (MF-patch-1 predicate refinement) → this revision (MF-amendment-1 substrate-touching amendment).

---

## §1 Meta-state

### §1.1 Input finding set

**Combined audit: 64 findings across three layers.**

Disposition per Phase 1.1 brief:
- **50 accepted** for resolution in this revision (21 Layer 1 + 29 Layer 2).
- **7 rejected** (A-07, A-11, B-10, B-11, B-12, B-23, B-35).
- **7 downgraded to Hygiene-defer** (B-06, B-15, B-17, B-18 + 3 Layer 1 Hygiene).

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

**Escalation-presentation home (per A-16):** escalation resolutions originated from the escalation-resolution-proposal conversation between L0 and manager instance on 2026-04-21. Resolutions confirmed by L0 per checkpoint ledger row for Pre-Phase 1.

### §1.3 Checkpoint ledger

| Phase | Scope | Confirmed | Notes |
|---|---|---|---|
| 1 | Substrate derivation | ✓ | 7 contents, 9 atoms, 4 authority levels, 3 rules, 4 gates |
| 2 | Primitive set | ✓ | 7 universal + 1 conditional, shapes/rules/gates at substrate |
| 3 | Axis set resolution | ✓ (judgment-tagged) | 7 axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment. MECE verified as judgment input J-axis-mece per §3.1 |
| 4 | Axioms distributed | ✓ (judgment-tagged) | 33 axis-bound + 1 universal (MA-G13). Distribution as judgment input J-axiom-dist per §3.2 |
| 5 | Schema declaration | ✓ | MetaframeworkInput + GeneratedFrameworkTemplate + custody table |
| 6 | Gate set | ✓ | 54 total (substrate 11 + framework-tier 43). 5 universal gates close F-69 |
| 7 | Handoff rules | ✓ | 6 handoff rules (HR1–HR6) + HR0 pending per V7 |
| 8 | File set and shapes | ✓ | 6 files, universal framework-file shape (9 sections), non-framework shapes |
| Post-8a | §7 empty-declaration rule | ✓ | Now derived from substrate §8.6 per A-23 resolution |
| Post-8b | 9a/9b split + hard checkpoint | ✓ | Phase 9 split confirmed |
| Post-8c | F-69 gate distribution | ✓ | Per §4.5 in this spec |
| Post-8d | MA-G13 bundle (kind-of-invariants + multi-execution) | ✓ | Split into four items per A-01 resolution; now at substrate §1.1–§1.4 |
| Post-8e | Phase 1.1 re-open | ✓ | This revision; 50 findings accepted |
| 9a (original) | Spec consolidation | ✓ → superseded | Superseded by this revision |
| 9b | Substrate writing | halted | Resumes after terminal gate §7 passes |
| 1.2 | Flow + capture property-on-primitive amendments | ✓ | substrate v1-1, framework-audit v1-1, spec v3.1 |
| MF-amendment-1 (S1) | Spec §4.4 procedure-declaration placement convention | ✓ | line 646/647/648 file summaries restated; placement convention paragraph added; mode does not gate procedure-declaration |
| MF-amendment-1 (S2) | Substrate + framework-audit + metaframework + AP + gen-proc + spec cascade (sprint close) | ✓ | substrate v1.2 → v1.3 (P8 mode-restriction lifted, 5 sites); framework-audit v1.3.3 → v1.4 (new §3.3 P0–P4 + §3.4–§3.8 renumber + P7 7→9 + P8 0→5 + §7.10/§7.11 J-inputs + 28-edit ref sweep); metaframework v3.2.4 → v3.2.5 (7-site vocab/custody restatement); AP v1.2.1 → v1.2.2 + gen-proc v1.1.3 → v1.1.4 (cascade pointer updates); spec v3.2.4 → v3.2.5 (4-site cascade + Status block). Closes F-MFA2-META-002 + F-1.2-01 (verificative-mode extension). No axiom/gate/HR amendments; counts unchanged (64/80/7/4-mode). D1 disposition: F-MFA1-AP-001 + F-MFA1-GP-001 logged for next cycle (spec misidentified self-§3.4 references in AP and gen-proc) |

Post-Phase 8 additions enumerated per A-15.

### §1.4 Three-pass self-mapping audit procedure (per A-22)

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

### §2.1 Structural-identity declarations (four items, per A-01 split)

Previously bundled as single "MA-G13" content. Split into four distinct substrate items, each with own ID:

- **S-01 MA-G13** — structural-identity invariant (four-property definition).
- **S-02 Kind-of-invariants distinction** — structural-transformation vs. data-integrity.
- **S-03 Permitted-multi-execution rule** — single declaration, multiple execution sites.
- **S-04 Four-property criteria** — mechanical criteria per property (per A-01).

Full declarations at substrate-v1-0.md §1.1–§1.4.

### §2.2 Substrate contents (items §2–§14 of substrate file)

- **§2 Modes** (4): epistemic, structural, generative, verificative.
- **§3 Universal Variables** (4): Temporal, Categorical, Relational, Positional.
- **§4 Atoms** (9): A-01 WAtom, A-02 AxiomRef, A-03 HandoffContract, A-04 CustodyRow, A-05 ProvenanceRow, A-06 AxisRef, A-07 SubAxisRef, A-08 LeafRef, A-09 FrameworkRef.
- **§5 Authority levels** (4): L0, L1, L2, L3.
- **§6 Judgment shape**: JudgmentId, JudgmentKind, Criterion, Judgment, JudgmentProvenance + mechanical-criterion ground (§6.3) per A-12.
- **§7 Semver** (external reference).
- **§8 Primitives** (P1–P7 universal + P8 conditional) + empty-declaration derivation §8.6 per A-23.
- **§9 Terminology**: Carrier (per A-04), carrier applicability semantics (per A-13, A-17), cross-axis invariant (per A-05), non-framework file (per A-19), file-shape applicability rule (per A-18).
- **§10 Substrate rules** (S1–S3, PR1–PR3).
- **§11 Substrate gates** (SG1–SG4, PG1–PG7, G-U4, G-G13). SG3 rewritten per A-02.
- **§12 Consumer registry**.
- **§13 Activation flow** (new, per B-28/B-37–B-40).
- **§14 Bootstrap** (new, per B-31–B-33).

### §2.3 Mechanical-criterion ground (per A-12)

Substrate §6.3 declares six classes of mechanical predicates. Criteria reducible to these classes are mechanical; criteria outside the taxonomy are not mechanical and are themselves judgment.

MA-J2 gate (G-J2) executes by checking each criterion against the six-class taxonomy.

### §2.4 SG3 rewrite (per A-02)

SG3 rewritten: per-element consumer list with declared rows in §12. Aggregate "all frameworks" shorthand permitted only when paired with declared framework-ID enumeration in §12 header. Implicit "all" without enumeration fails SG3.

### §2.5 Empty-declaration rule derivation (per A-23)

Rule derived from substrate primitive discipline rather than hand-written at spec §4.2. Derivation:

- Primitive kind P exists at substrate §8.
- Framework may declare zero instances of P.
- Zero-instance state captured by positive-declaration marker: `{primitiveKind: P, instanceCount: 0, basis: string}`.
- Framework files consume rule by reference; rule not restated in each framework.

Applied at: framework §7 Judgment (when no judgment inputs); framework axes with zero sub-axes; elsewhere per primitive traceability (PR1).

### §2.6 Activation flow declaration (per §2.1 of brief)

Substrate §13 declares top-level invariant: single trace from L0 activation through owned framework execution to registry state and L0 disposition. Six-node flow with per-edge contract references, per-operation atomicity declarations, concurrent-activation resolution (registry-lock), L0-unavailability response (suspend-and-resume).

Closes B-28, B-37, B-38, B-39, B-40.

### §2.7 Bootstrap declaration (per §2.2 of brief)

Substrate §14 declares bootstrap as one-time privileged L0 event. Produces substrate + first metaframework as restore minimum. Post-bootstrap derivation uses declared procedures. Bootstrap recursion acknowledged and resolved: recursion permitted at bootstrap event only; non-re-entrant.

Closes B-31, B-32, B-33.

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

**MECE verification declared as judgment input** (per A-21):
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

**33 axis-bound axioms + 1 universal (MA-G13).**

**Distribution declared as judgment input** (per A-21):
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

**Axiom table with post-Phase-1.1 additions** (MA-L6, MA-L7 per V4 pre-declared outcome):

| Axis | Count | IDs |
|---|---|---|
| Identity | 7 | MA-I1 to MA-I5 + MA-I6, MA-I7 (v3.2.3) |
| Schema | 6 | MA-S1 to MA-S3 + MA-S4, MA-S5, MA-S6 (v3.2.3) |
| Structure | 16 | MA-St1 to MA-St5 + MA-St6 to MA-St16 (v3.2.3) |
| Validity | 9 | MA-V1 to MA-V5 + MA-V6, MA-V7, MA-V8, MA-V9 (v3.2.3) |
| Lifecycle | **10** | MA-L1 to MA-L5 + **MA-L6 + MA-L7** + MA-L8, MA-L9, MA-L10 (v3.2.3) |
| Coupling | 10 | MA-C1 to MA-C6 + MA-C7, MA-C8, MA-C9, MA-C10 (v3.2.3) |
| Judgment | 5 | MA-J1 to MA-J4 + MA-J5 (v3.2.3) |
| Universal | 1 | MA-G13 |

**Total: 63 axis-bound + 1 universal = 64 axioms** (previously 35 + 1 = 36; v3.2.3 adds 28 axioms across 7 axes per cycle §1.1).

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
- MA-C6: no re-ownership (transition constraint orthogonal to MA-C2 declaration — retained per A-07 rejection).

**Judgment (4):**
- MA-J1: every judgment input declared (ID, kind, criteria, consumer).
- MA-J2: criteria are mechanical (mechanicalGround declared per substrate §8).
- MA-J3: provenance complete per judgment instance.
- MA-J4: empty Judgment axis explicitly declared per substrate §10 emptyDeclared field.

**MA-L6 — Activation-flow invariant.**
Framework operations conform to substrate §13 activation flow. Every operation declares atomicity per §13.4, participates in registry-lock protocol per §13.5, and declares L0-unavailability behavior per §13.6.

*Scope (per Phase 1.2 clarification):* MA-L6 covers system-level activation flow (substrate §13) only. Per-operation stage discipline is enforced by substrate §10.2 PR4 + PR5 and tested by framework-audit §3.4 X10 extended predicate. No axiom amendment required for Phase 1.2 stage additions.

**MA-L7 — Bootstrap non-re-entrancy.**
Framework declares genesis per framework-audit X8 (substrate §14.2–§14.5). Bootstrap event is non-re-entrant; post-bootstrap derivations occur via declared procedures.

**Axiom rules (AxR-series):** unchanged from original spec.
- AxR1: every axiom binds to exactly one axis or is universal/substrate-declared.
- AxR2: every axiom states one mechanical condition directly.
- AxR3: axioms additively versioned.
- AxR4: axiom text is declarative.

**MA-V5 — Gate set exhaustive over declared validation dimensions.**
MA-V5: gate set exhaustive over framework-audit 10 audit dimensions (A-03 resolution — enumeration declared at framework-audit §3.2).

**MA-V5 testability** (per A-03): MA-V5 is enumerable via framework-audit's ten declared audit dimensions (X1–X10). G-V5 tests by verifying gate-to-dimension mapping completeness.

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
For every (axiom a, gate g) pair where g.tests includes a, g.predicate's mechanical conditions imply a.condition (1:1 mapping per G-M1: equivalence required; multi-axiom-gate per A-24: conjunction of g.predicate conditions over g.tests entries collectively cover each tested axiom's condition). Implication test grounds via substrate §6.3 mechanical-criterion ground; non-trivial implication cases that cannot be reduced to substrate §6.3 are surfaced as audit-note for L0 review (does NOT escalate to J-input — predicate remains mechanical with declared edge-case caveat).
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

  // Provenance — reference-default per A-20
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

  // Provenance — reference-based default per A-20
  provenance: {
    generatedByMetaframework: FrameworkRef,
    generationProcedureRef: FrameworkRef,
    generationTimestamp: string,
    sourceInputRef: AtomRef,           // REFERENCE to MetaframeworkInput stored in registry
    sourceInputValue?: MetaframeworkInput  // optional by-value; opt-in via declared flag
  }
}
```

**sourceInput reference-default** (per A-20): provenance stores reference to registry-archived input; by-value retention is opt-in with declared flag. Reduces propagation cost O(N) → O(1) per framework.

**Atom shapes specific to metaframework:** AxisInstance, AxiomInstance, GateInstance, HandoffRuleInstance, JudgmentInputDeclaration, ProcedureStepInstance, EscalationState, JudgmentDeprecation, VocabularyEntry, Kind enum, Ownership, State, GenesisDeclaration (new per V5), DimensionResult (new per V5), OperatorInterface (new per V5).

**Custody table:** full table in metaframework-v3-0.md §6 Coupling. Every atom has owner + layer. §4.4 of this spec references the table by pointer (per A-08 single-source via reference).

**Schema rules (ScR-series):** unchanged.

### §3.4 Gates

**84 total gates after v3.2.3** (was 56 at v3.2.1; v3.2.3 adds 28 paired gates for 28 new axioms).

| Category | Count |
|---|---|
| Substrate gates (SG1–SG4) | 4 |
| Primitive gates (PG1–PG7) | 7 |
| Axiom gates (1 per axiom) | **63** (was 35; v3.2.3 +28) |
| Universal MA-G13 gate | 1 |
| F-69 universal gates | 5 |
| Meta-gates | 4 |
| **Total** | **84** |

**Framework-tier gates (run per framework): 80** (was 52; per metaframework-v3-1 §4.7 enumeration: 7 PG + 63 axiom + 1 MA-G13 + 5 F-69 + 4 meta. Substrate gates SG1–SG4 excluded per substrate §11.5 tier-1 "run once, not per framework" semantics. PG1–PG7 are per-framework-tier per substrate §11.5 tier-2 classification.)

**Meta-gates specified** (per A-06):

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

**Meta-gate backward-invalidation rule** (per A-24):

Meta-gate failure invalidates passes at tier N-1, N-2, ... recursively. Execution tiers:
- Tier 4: Meta-gates (G-M1–G-M4).
- Tier 3: Universal gates (G-U1–G-U5, G-G13).
- Tier 2: Axiom gates.
- Tier 1: Substrate gates.

Backward-invalidation propagation:
- G-M failure → universal gates re-run → if they pass, axiom gates re-verified (no invalidation beyond tier boundary unless universal gate fail surfaces).
- Substrate-tier failure (tier 1) is **non-recoverable at audit level**. Substrate is foundational; its failure cannot be corrected by re-running downstream. Escalates to L0 per bootstrap procedure (substrate §14.6 restore).
- Tier 1 failure is thereby declared as terminal invalidation.

**F-69 universal gates (5):** unchanged from original spec.

**F-69 gate distribution:**

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

**Carrier applicability semantics declared per substrate §9** (per A-13):

| Applicability value | Meaning |
|---|---|
| `['self']` | Applies only when consuming framework's carrier = 'self' |
| `['self', 'named']` | Applies when carrier ∈ {self, named}; carrier=none skips |
| `['self', 'named', 'none']` (shorthand `'all'`) | Applies regardless of carrier |

Carrier=none handoff as table-row case (per A-17): explicit in substrate §9 table; no prose-only declarations.

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

**§7 empty-declaration rule** now derived from substrate §8.6 per A-23. Framework files reference substrate rule; do not restate.

**File-shape applicability rule** declared at substrate §9 per A-18.

### §4.3 Non-framework file shapes

**substrate-v1-0.md:** sixteen sections (§1–§14 content + §15 self-audit + §16 version history).

**framework-registry-v1-0.md:** as originally declared (9 sections, content-specific shape).

**Registry self-audit omission** (per R-0029 structural resolution): Non-framework state stores (registry) omit §8 Self-audit by structural decision. Data-integrity invariants (IG-series) test themselves via write-time checks, not axiom self-application. MA-V5 N/A for non-frameworks.

### §4.4 File-specific content placement

**Reference to metaframework-v3-0.md §3 Structure for axis content** (per A-08 single-source). This spec does not restate; §3 of the framework file owns the content.

Per-file content summaries:
- `metaframework-v3-0.md` per §3 of this spec.
- `generation-procedure-v1-0.md` — generative-mode framework producing GeneratedFrameworkTemplate; declares twelve-step P8 procedure (S1–S12, §3.3); declares J-IDs for non-mechanical steps.
- `framework-audit-v1-0.md` — verificative-mode framework; declares 10 audit dimensions (X1–X10, §3.4) and five-step audit-cycle procedure (P0–P4, §3.3); executes per-framework audit.
- `amendment-propagation-v1-0.md` — structural-mode framework; declares seven-step P8 procedure (AP1–AP7, §3.3); consumes amendment events; verifies propagation completeness.
- `framework-registry-v1-0.md` — state store; holds per-framework state, provenance, lifecycle index.

**Procedure-declaration placement convention.** Procedure-bearing frameworks (any framework with own discipline expressed as ordered P8 instances under substrate §8.3 stage discipline) declare the procedure at §3.3 of the framework file, regardless of mode. Generative-mode (gen-proc S1–S12), structural-mode (AP AP1–AP7), and verificative-mode (framework-audit P0–P4) all converge on §3.3 placement. Mode does not gate procedure-declaration.

### §4.5 F-69 gate distribution across files

Per §3.4 above.

### §4.6 Non-framework gate semantics (per A-19)

Non-framework files may declare gates per substrate §9 terminology. Gates test non-framework content per non-framework rules (content integrity, not framework-kind axioms). No ambiguity: gate presence does not force framework classification; kind is declared, not inferred from gate presence.

---

## §5 Finding closure map

Full 73-finding enumeration per A-10. Findings grouped by closure mechanism with individual IDs listed.

### §5.1 Layer 1 audit findings (v2.5 → v3.0) — 73 IDs enumerated

Original audit set from Pass 10 + Pass 11 + Pass 12. Enumerated here as single flat list with individual closure mechanism per ID.

**Pass 10 Dimension A — Concern (12 roots):**
- F-01 (leaf-cell bundling): closed by PR1 primitive traceability + primitive shape discipline (substrate §8).
- F-02 (identity-row bundling): closed by primitive shape discipline.
- F-03 (scope-cell bundling): closed by PR1.
- F-04 (axiom-as-test-reference): closed by AxR2 direct-condition rule; Pass 1.1 axioms all restated directly.
- F-05 (gate-spec multi-check): closed by P5 primitive shape (each gate tests one axiom unless declared multi-axiom per P5).
- F-06 (vocab entries bundling): closed by substrate §9 terminology splitting each term into own declaration.
- F-07 (back-compat row bundling): closed by §12/§13 split — rules → amendment-propagation, state → registry (§5.3 below).
- F-08 (self-audit row bundling): closed by framework-audit §8 schema — per-gate records, not prose bundles.
- F-09 (procedure-step bundling): closed by P8 primitive shape — each step declares fields explicitly.
- F-10 (propagation-item bundling): closed by amendment-propagation framework primitive instances.
- F-11 (prose-note multi-concern): closed by PR1 primitive traceability.
- F-12 (change-log bundling): closed by per-file §9 change log scoped to file only.

**Pass 10 Dimension B — Ownership (12 roots):**
- F-13 (B-1 atomicity co-ownership): closed by substrate §8 single declaration + substrate §10 PR-rules.
- F-14 (B-2 axiom-gate co-ownership): closed by AxR2 + AxR1 separation of axiom (condition) from gate (test).
- F-15 (B-3 schema-field co-ownership): closed by Coupling axis consolidating Carrier/Custody/Provenance/Handoff.
- F-16 (B-4 §4.4 ↔ §11 duplication): closed by AxR1 single-axis binding + gate-in-Validity single home.
- F-17 (B-5 handoff H4 redundancy): retained as declared orthogonal to H1 (no-re-ownership distinct from singly-owned custody).
- F-18 (B-6 dry-run site duplication): closed by framework-audit being separate framework (F-54).
- F-19 (B-7 validity-conjunction near-duplicate): closed by MA-V3 single result semantics + per-gate result records.
- F-20 (B-8 generation-step dual definition): closed by P8 single primitive definition at substrate.
- F-21 (B-9 VersionTransition duplication): closed by single EscalationState/VersionTransition atom at metaframework §3.
- F-22 (B-10 identity-field literal duplication): closed by FrameworkRef + LevelKindPair atom at substrate/metaframework.
- F-23 (B-11 governing-question triple-site): closed by single concern declaration per axis (P1 primitive shape).
- F-24 (B-12 escalation-state duplication): closed by single EscalationState atom.

**Pass 10 Dimension C(S1) — Forward-reference direction (6 roots):**
- F-25 through F-30 (C-S1-1 through C-S1-7, minus S1-6 which was skipped in original pass): closed by substrate-first-then-framework file ordering. Substrate declares shared vocabulary; framework-local vocabulary declared inline in §3 at point of use.

**Pass 10 Dimension C(S2) — Framework-hierarchy (4 roots):**
- F-31 (C-S2-1 Semver L2-consumes-L3): closed by substrate §7 declaring Semver as external reference (upstream of frameworks, not L3-owned).
- F-32 (C-S2-2 H2 L3 architecture): closed by substrate §1.3 permitted-multi-execution + substrate-declared atoms consumed by reference.
- F-33 (C-S2-3 §12 L3 state in L2): closed by §12 extraction — state → registry, rules → amendment-propagation.
- F-34 (C-S2-4 §15 dry-run uses L3): closed by framework-audit operating on AxiomRef references, not embedded framework content.

**Pass 10 Dimension C(S3) — Concept-definition orphans (6 roots):**
- F-35 (C-S3-1 internal type-shape orphans): closed by substrate §4 nine-atom declaration + Coupling axis custody per atom.
- F-36 (C-S3-2 authority-level orphans): closed by substrate §5 L-level declaration.
- F-37 (C-S3-3 external framework references): escalation resolved as Structural via bundled substrate external-reference treatment (Manual II.3 et al.).
- F-38 (C-S3-4 derivation-mechanism orphans): closed by Escalation 3 resolution — each step kind declared (mechanical/judgment-input) + judgment typed per substrate §6.
- F-39 (C-S3-5 gate-closure mechanism orphan): closed by MA-L4 typed escalation state + declared resume procedure.
- F-40 (C-S3-6 primitive concept implicit): closed by substrate §8 explicit P1–P8 declaration.

**Pass 10 Dimension D — Authorship kind (1 root):**
- F-41 (D-1 axiom-as-test-reference): closed by AxR2 + Pass 1.1 direct-condition restatement.

**Pass 11 findings (11 roots — self-application cluster):**
- F-42 (self-fail MA-G1 Mode): closed by substrate-tier Mode declaration + MA-I1 applied to self.
- F-43 (self-NA MA-G5b WAtom): closed by substrate §4 A-01 WAtom shape declaration.
- F-44 (self-fail MA-G5c custody): closed by metaframework Coupling axis custody table.
- F-45 (self-fail MA-G5d provenance): closed by GeneratedFrameworkTemplate.provenance reference-based structure.
- F-46 (self-coverage-gap MA-G8a carrier=self): closed by substrate §14 bootstrap explicitly declaring self-application as bootstrap event.
- F-47 (self-NA H2 substrate): closed by substrate §9 H2 equivalent via permitted-multi-execution + substrate-declared atoms.
- F-48 (self-fail H3 directional handoff): closed by HR0–HR6 all directional with FrameworkRef endpoints.
- F-49 (self-coverage-gap struct-granularity): closed by P3 Leaf primitive atomicity enum (property/descriptor/axiom) + PG2 coverage.
- F-50 (self-coverage-gap §16 propagation): closed by amendment-propagation framework with G-U2 universal gate.
- F-51 (self-coverage-gap L2-document spec): closed by universal framework-file shape declared at substrate §9.
- F-52 (MA-G13 hidden framework §10): closed by generation-procedure extraction + formalization of MA-G13 at substrate §1.1.

**Pass 12 findings (21 roots):**
- F-53, F-54, F-55 (hidden frameworks at §10, §11+§14+§15, §16): closed by six-file extraction.
- F-56 (§13 axiom-tier as vocabulary): closed by substrate §8.6 empty-declaration + PR1 primitive traceability.
- F-57 (§12 mixed kinds): closed by §12 split to amendment-propagation + registry.
- F-58 (Lifecycle axis no axioms): closed by MA-L1 through MA-L5 + MA-L6 + MA-L7 declared on Lifecycle.
- F-59 (axiom-to-axis binding undeclared): closed by MA-{axis-code}-{n} naming convention.
- F-60 (decision-ownership boundaries): closed by framework-audit X4 Negative space dimension.
- F-61 (post-E8-fail remediation): closed by substrate §13.6 L0-unavailability + §14.6 restore procedure + amendment-propagation framework.
- F-62 (judgment-as-input undeclared): closed by Escalation 3 resolution — substrate §6 Judgment + metaframework Judgment axis.
- F-63 (metaframework primitive set undeclared): closed by substrate §8 P1–P8.
- F-64 (Modes at wrong tier): closed by substrate §2 Modes.
- F-65 (UVs at wrong tier): closed by substrate §3 Universal Variables.
- F-66 (Coupling axis missing): closed by seven-axis set including Coupling.
- F-67 (Execution axis missing): closed by Escalation 2 resolution — generation-procedure extraction.
- F-68 (primitive declaration placement): closed by substrate §8 + Structure axis primitive-instance declaration.
- F-69 (E-gate set non-exhaustive): closed by G-U1 through G-U5 universal gates.
- F-70 (error-handling compound failures): closed by MA-L4 typed escalation + substrate §13.5 registry-lock resolution.
- F-71 (MA-G re-verification undeclared): closed by MA-V4 gate re-verification rule + meta-gate backward-invalidation (per A-24).
- F-72 (metaframework generation-provenance undeclared): closed by substrate §14 bootstrap declaration + GeneratedFrameworkTemplate.provenance.
- F-73 (generated framework provenance undeclared): closed by registry framework-by-framework provenance record + HR5.

**Total Layer 1: 73 findings, all closed.**

### §5.2 Combined-audit findings — Phase 1.1 50 accepted

**21 Layer 1 (from combined audit):**
- A-01 through A-06, A-08 through A-10, A-12 through A-14, A-15 through A-24: closures per §1.3 ledger resolution locus column.

**29 Layer 2 (from combined audit):**
- X1: B-01, B-02, B-03 — closed by framework-audit X1 dimension.
- X2: B-04, B-05 — closed by framework-audit X2 dimension.
- X3: B-07, B-08, B-09 — closed by framework-audit X3 dimension.
- X4: B-13 — closed by framework-audit X4 dimension.
- X5: B-14, B-16 — closed by framework-audit X5 dimension.
- X6: B-19, B-20, B-21, B-22 — closed by framework-audit X6 dimension.
- X7: B-24, B-25, B-26, B-27, B-29, B-30 — closed by framework-audit X7 dimension.
- X8: B-31, B-32, B-33 — closed by substrate §14 bootstrap + framework-audit X8 dimension.
- X9: B-34, B-36 — closed by framework-audit X9 dimension.
- X10: B-37, B-38, B-39 — closed by substrate §13 activation flow + framework-audit X10 dimension.

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
| Gate set expansion (F-69 + universal) | 2 | 0 | 0 |
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

- F-35 (orphan types): closed by substrate §4 atoms + Coupling custody + G-U4 primitive declaration gate.
- F-47 (H2 self-NA): closed by substrate §1.3 permitted-multi-execution + substrate §4 atoms + HR1 handoff rule.
- F-63 (primitive set orphan): closed by substrate §8 primitives + PR1 traceability + G-U4.
- A-01 (substrate bundling): closed by substrate §1.1–§1.4 four-item split + substrate §10 SG1 declaration gate.
- B-31, B-32, B-33 (bootstrap paradox): closed by substrate §14 bootstrap declaration + framework-audit X8 dimension + MA-L7 non-re-entrancy axiom.

### §5.5 Rejected findings (7)

Per brief §1.3. Rationale recorded in brief. Not re-litigated here.

### §5.6 Deferred findings (7)

Hygiene-defer: B-06, B-15, B-17, B-18 + 3 Layer 1 Hygiene. Tracked for 9b writing resolution.

### §5.7 Phase 1.2 findings (2)

Post-Phase-1.1 findings surfaced for Phase 1.2 cycle; registered here as amendments to the closed Phase 1.1 finding set per MA-L2 (gap trigger). Each finding assigned an ID.

| ID | Finding | Resolution locus |
|---|---|---|
| F-1.2-01 | Flow-gap (operation flow implicit) | substrate §8.3 Stage enum + P8 +stage +ternary kind; substrate §10.2 PR4 + PR5; substrate §11.2 PG6 amended; framework-audit §3.4 X10 extension |
| F-1.2-02 | Capture-gap (boundary capture undeclared) | substrate §8.2 P6 +captureShape +diagnosticSignificance; framework-audit §3.4 X3 criterion C5 |

G-spec-3 verification: F-1.2-01 and F-1.2-02 ∈ Phase 1.2 input finding set.

### §5.8 MF-audit-1 findings closed at MF-patch-1 (4)

Post-v3.2.3 findings surfaced by MF-audit-1 (first-run audit of v3.2.3 against L3 frameworks); registered here as amendments to the closed v3.2.3 finding set per MA-L2 (gap trigger). Each finding assigned an ID. Closed at MF-patch-1 (this revision = v3.2.4).

| ID | Finding | Resolution locus |
|---|---|---|
| F-MFA-V9-001 | G-V9 predicate parsed for explicit field labels rather than substance recoverability; L3 framework gates carry GR-1..GR-6 substance in compact tabular form (not field-labeled blocks) and failed strict parse despite carrying all six properties | framework-audit §4.6.1 conformance test paragraph + §4.8.4.4 G-V9 predicate body; both refined to recoverability semantics |
| F-MFA-ST16-001 | G-St16 predicate required explicit `testability` field per axiom; testability is derivable from axiom's relationship to framework's P7 set per substrate §1.3 S-03 single-source (an explicit field would duplicate P7-membership) | framework-audit §4.8.3.11 G-St16 predicate body; refined to derive testability from P7-membership |
| F-MFA-F9-007 | framework-audit §4.1 carried stale literal "48" from v1.2 era (when inherited count was 45 + 3 own = 48); count was not updated through R-0020 cascade (45 → 52) or v3.2.3 cascade (52 → 80); current canonical = 3 own + 80 inherited = 83 | framework-audit §4.1 row literal updated 48 → 83 with derivation note |
| F-MFA-F9-008 | amendment-propagation §5.10 missing v1.1 row despite §5.1 declaring v1.1 as substantive AP edit-target cycle (PropagationTrace inline shape declared per R-0055; gate count restatements per R-0020 cascade); MA-S5 cross-file restatement consistency requires the row | amendment-propagation §5.10 v1.1 row added |

G-spec-3 verification: F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007, F-MFA-F9-008 ∈ MF-patch-1 input finding set.

### §5.9 MF-amendment-1 findings closed (sprint close)

Post-MF-patch-1 findings surfaced by MF-audit-2 + Phase 1.2 closure-extension; registered here as amendments to the closed MF-patch-1 finding set per MA-L2 (gap trigger). Each finding assigned an ID. Cycle entry recorded at Shot 1 (§4.4 procedure-declaration placement convention amendment); closures recorded at Shot 2 close (substrate + metaframework + framework-audit + AP + gen-proc cascade).

| ID | Finding | Resolution locus |
|---|---|---|
| F-MFA2-META-002 | Pattern A citation gap — no canonical declaration of audit-cycle procedure; framework-audit declared dimension set + execution but not P8-step procedure | Closed at Shot 2 via framework-audit-v1-4 §3.3 P0–P4 declaration (five-step audit-cycle procedure: P0 judgment-input → P1 mechanical → P2 gate-execution → P3 judgment-input → P4 mechanical, distributed across substrate §8.3 Stages 1–5) |
| F-1.2-01 (closure extension) | Operation flow declared at Phase 1.2 for generative + structural modes only; verificative-mode operation flow undeclared | Closed at Shot 2 via framework-audit-v1-4 §3.3 P0–P4 (verificative-mode P8 instances declared with PR4 stage-monotonicity + PR5 stage-content-kind alignment satisfied) |

G-spec-3 verification: F-MFA2-META-002, F-1.2-01 (closure extension) ∈ MF-amendment-1 input finding set.

Substantive changes recorded:
- **Shot 1:** spec §4.4 per-file content summaries restated to drop generative-only P8 implication; placement convention paragraph added declaring §3.3 as procedure-declaration locus regardless of mode.
- **Shot 2:** substrate-v1-1 → substrate-v1-3 (5 sites: §2.4 mode-binding, §8.1 primitive count, §8.3 P8 declaration, §8.3 non-generative basis prose, §12 consumer registry P8 row + §16 v1.3 row); framework-audit-v1-3.3 → framework-audit-v1-4 (new §3.3 P0–P4 audit-cycle procedure + §3.4–§3.8 renumber + §3.7 P7 7→9 + §3.7 P8 0→5 + §7.10/§7.11 J-input declarations + 28-edit internal §3.x ref sweep + §5.11/§9 v1.4 rows); metaframework-v3.2.4 → metaframework-v3.2.5 (vocab + custody restatement at 7 sites: §3.4 P8 row, §3.5 ProcedureStepInstance/DimensionResult vocab rows, §6.5 Stage/StageContentKind/ProcedureStepInstance custody rows, §3.3 X10/G-U5 cascade pointers); amendment-propagation-v1.2.1 → amendment-propagation-v1.2.2 (1 cascade pointer + version stamps); generation-procedure-v1.1.3 → generation-procedure-v1.1.4 (1 cascade pointer + version stamps); v3-1-spec v3.2.4-Shot1 → v3.2.5 (4 cascade pointer updates at lines 272/833/834/1011; line 1002 frozen historical; §5.9 closure record extended; Status block updated to cycle-close canonical).

**Findings logged for next cycle (D1 disposition):**
- F-MFA1-AP-001 (open) — MF-amendment-1 spec §4.5 row line 630 misidentified AP self-§3.4 reference as framework-audit's §3.4. AP §3.4 (stage-monotonicity-and-kind-alignment self-check) is not part of framework-audit's §3.x renumber set; bumping it would corrupt AP's self-reference. Preserved untouched.
- F-MFA1-GP-001 (open) — MF-amendment-1 spec §4.6 row line 508 misidentified gen-proc self-§3.4 reference as framework-audit's §3.4. Same root cause: spec authoring assumed shape-parallel renumber across all P8-bearing frameworks (gen-proc/AP/framework-audit all have §3.4 named "Stage monotonicity and kind-alignment self-check"); only framework-audit renumbers this cycle.
- (Hygiene candidate) — Framework-audit §1 Identity "Own discipline" row preserved verbatim per Layer 4 fidelity (structure not requested is scope violation); current row text describes audit procedure as "run X1–X10 dimension tests + execute all framework-tier gates" without citing the now-declared §3.3 P0–P4 frame. Eligible for next-cycle hygiene update.

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

## §7 Spec self-audit (mechanical rewrite per A-14)

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

### §7.3 Spec MA-G13 exemption (declared basis per A-09)

This spec is classified as **non-framework artifact**. MA-G13 exemption granted on the following declared basis against substrate §1.4 four-property criteria:

- **Own state:** spec declares own version (v3.0-r1) and state transitions (§7.4) — criterion **satisfied**.
- **Own I/O:** spec has no typed input/output atoms. Consumes: confirmed-phase outputs (informal). Produces: this document (informal). Criterion **not satisfied** — no typed schemas declared.
- **Own invariants:** spec has declarations but **no structural-transformation invariants**. §7.4 lifecycle transitions are data-integrity kind (draft→confirmed is state-change, not structural transformation). Criterion **not satisfied** per §1.2 kind-of-invariants distinction.
- **Own discipline:** spec has §7 self-audit as declared discipline. Criterion **satisfied**.

**Two of four criteria unsatisfied.** Per MA-G13, spec fails framework test. Classified as non-framework artifact (specifically: design record / confirmation ledger).

Exemption declared, not inferred.

Basis note: spec's lifecycle is data-integrity kind rather than structural-transformation because state transitions (draft → confirmed → amended → historical) describe the spec's record status, not transformations applied to content. Content is fixed per revision; revisions are new records, not transformations of prior. This matches the registry's kind-of-invariants classification pattern.

### §7.4 Spec lifecycle declared (per B-01, B-02, B-03)

**Version:** v3.1 (v3.0 superseded by Phase 1.2 amendments; additive transition per MA-L1). Prior revisions: v3.0-r1 (Phase 1.1 re-open), v3.0 (superseded).

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

**Amendment propagation to downstream artifacts** (per B-03):
- Amendment to confirmed spec triggers re-verification of downstream artifacts (substrate, metaframework, etc.) against new spec.
- Amendment-propagation framework (post-bootstrap) handles propagation mechanically when amendment-propagation is operational.
- Pre-operational amendment-propagation (during Phase 9b–9g): amendments propagate manually via Cycle Brief with declared scope.
- Propagation completeness verified by G-U2 universal gate when amendment-propagation operational; pre-operational verification via L0 confirmation.

**Current state:** `draft` pending terminal gate and L0 confirmation of Phase 1.2 delivery.

### §7.5 Three-pass procedure named (per A-22, redundant with §1.4)

Cross-reference: Self-Mapping Audit Procedure declared at §1.4. Referenced by G-spec-8.

---

## §8 Runtime open items

**Post-canonical runtime deferrals.** Items logged at Phase 9c–9g delivery as declaration-only at delivery; full runtime resolution post-canonical via amendment-propagation per MA-L2 (amendment trigger = gap). Aggregated here for cross-cycle tracking per audit table §6 P4 residue and §9 in-cycle additions.

| ID | Owner framework | Fix-site | Item | Resolution path |
|---|---|---|---|---|
| R-0035 | generation-procedure-v1-0 | §3.3 S2 row | S2 mechanical step coarse-grained — single P8 instance for full template-population pipeline. Alternative: per-field split. Per MA-St4 primitive-atomicity collapse rule applied. | Additive v1.1 if runtime surfaces per-field checkpoint need. |
| R-0036 | generation-procedure-v1-0 | §3.3 / §4.2 | No explicit declaration that E1–E8 execution order is free within Stage 3. PR4 requires stage monotonicity across `order` but not within-stage order. | If parallel E-execution implemented: declare parallelism-permitted at §3.3. |
| R-0038 | generation-procedure-v1-0 | §5.6 atomicity | Per-step atomicity uses 'step boundary' semantics without precise boundary declaration. Inherited from substrate §13.4 by reference. | Make intra-step-vs-inter-step distinction explicit only if runtime ambiguity surfaces. |
| R-0050 | framework-audit-v1-4 | §5.7 vs §3.4 X5 | scaleBounds declared per-audit O(D+G) and total O(F×R). Sub-operation bounds derivable from substrate §13 but not explicitly broken out. | X5 first-run may surface need; amend at that time. |
| R-0059 | amendment-propagation-v1-0 | §5.7 | Self-amendment bootstrap handling declared at high-level depth per L0 Q3. Formalization of meta-recursion procedure deferred. | Terminal cross-file gate phase: formalize if runtime surfaces ambiguity. |

**Scope note:** items listed here are known-incomplete declarations accepted as sprint-mode-sufficient at delivery. Amendment path for each: generate amendment event → amendment-propagation runs → affected frameworks re-versioned additively per MA-L1. No item in this catalog blocks canonical confirmation.

**Items closed in this cycle (for traceability):**
- R-0029 (registry §8 omission) — closed via §4.3 structural declaration this spec.
- R-0046 (framework-audit §3.4 placeholder) — closed via framework-audit v1.3 §3.4 text replacement.

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

## End of spec (revised)

**Status:** v3.2.5 draft, awaiting L0 confirmation of MF-amendment-1 delivery (sprint close, post-Shot-2; auditor dispatch pending).

**On confirmation:** MF-amendment-1 closes. Substrate v1.3 canonical (P8 mode-restriction lifted; mode-agnostic with own-procedure criterion per MA-G13); framework-registry v1.0 canonical (unchanged); metaframework v3.2.5 canonical; framework-audit v1.4 canonical (audit-cycle procedure P0–P4 declared at §3.3; existing §3.x renumbered +1; P7 own count 9; P8 own count 5); generation-procedure v1.1.4 canonical (cascade pointers updated to framework-audit-v1-4 §3.4); amendment-propagation v1.2.2 canonical (cascade pointers updated to framework-audit-v1-4 §3.4). Spec v3.2.5 canonical. MF-amendment-1 finding closure complete (2 findings closed: F-MFA2-META-002 Pattern A citation gap; F-1.2-01 closure extension to verificative mode). Findings opened for next cycle (D1 disposition): F-MFA1-AP-001, F-MFA1-GP-001 (spec authoring errors at MF-amendment-1 spec §4.5/§4.6 misidentifying self-§3.4 references in AP and gen-proc). MF-audit-1 partial findings remaining (downstream cycles, unchanged): F-MFA-LM-001 (LM full regen), F-MFA-LM-002 (SLICE banner), F-MFA-LM-003 (closes with LM-001), F-MFA-PL-001 (Plan §1 MA-G13 block), F-MFA-AS-001 + F-MFA-PL-002 (§3.5 leaf footnotes), F-MFA-C8-001 (registry §5 L3 bootstrap-write), F-MFA-D3-001 (MF-audit-2), F-MFA-FLOW2-001 (closes with C8-001), F-MFA-SPEC-001 (next MFv3 patch convenience).

**On auditor sprint-close run:** P0–P4 cores-first cascade per the very procedure declared this cycle (self-application discipline). In-scope: framework-audit-v1-4 (target of own new §3.3 declarations); cascade against substrate-v1-3, metaframework-v3.2.5, gen-proc-v1.1.4, AP-v1.2.2, spec-v3.2.5. First-run of P0–P4 against framework-audit itself is the self-application closure — Kind A here is informative (indicates the procedure declaration has a structural gap) and gets disposed by L0; not a cycle-halt for amendment cycle.

**On specific finding regression:** same-delivery re-fix per Phase 1.1 precedent. Do not open new cycle.
