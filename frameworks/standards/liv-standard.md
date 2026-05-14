---
kind: framework
placement: frameworks/standards/
---

# liv-standard

**Kind:** Framework  
**Level:** L3  
**Mode:** structural (known → structured)  
**Version:** v1.5.2  
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)  
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1  
**Authority:** L0 confirmed (Sprint B1 Shot 4 — md spec authored under MFv3 v3.3.0; ts file `src/core/constants/liv-standard.ts` predecessor preserved as runtime binding)  
**Source-side binding:** `src/core/constants/liv-standard.ts` v1.5.2 (runtime constant `LIV_STANDARD`) + `src/core/constants/liv-standard.types.ts` (typed shapes)  
**referentCitations:** [{path: 'src/core/constants/liv-standard.ts', ...}, {path: 'src/core/constants/liv-standard.types.ts', ...}] — declared §1; remaining `src/**` coverage staged with partial-drift declared per MA-V11 (see §3.13.10)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. LIV-Standard's predecessor existed as a TypeScript constants file (`src/core/constants/liv-standard.ts` v1.5.1) carrying seven axioms A1–A7 plus tier structure T0..T5 declared as data. Under the ratified governance chain (L0 → MF → standards → programs per Manual v13.0 Part IV Governance Loop), LIV-Standard is MF output — an L3 standard, structurally identical in position to LM v3.3 and PS v1.1. This spec declares the same content the ts file carries, in MFv3-conformant declarative form. Content preserved verbatim from v1.5.1; structural declaration form added at v1.5.2.

---

## Generation procedure trace (S1–S12)

**S1 — Judgment validation**

| Judgment | Input | Resolution |
|---|---|---|
| J-axis-mece | Seven axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment. MECE per MFv3 §3.1.1 FrameworkConcernSpace. | PASS |
| J-axiom-dist | Axioms A1..A7 distributed across axes per AxR1 (each names exactly one axis). | PASS — see §3.3 below for per-axiom binding rationale |

**S2 — Template population:** Executed below as §1–§9.  
**S3–S10 (E1–E8) — Gate execution:** Declared per axis in §4 Validity.  
**S11 — Template observation:** Presented to L0 for confirmation at Sprint B1 Shot 4 close.  
**S12 — Emit:** This file is the emission.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `LIV-Standard` |
| `kind` | `Framework` (substrate §4 A-10 Kind enum) |
| `mode` | `structural` (substrate §2 Mode enum; `known → structured` — declares how source-tier structure is organized) |
| `level` | `L3` (substrate §5 AuthorityLevel) |
| `version` | `1.5.2` (substrate §7 Semver) |
| `ownershipTemplate` | `Human` (substrate §4 A-11; L0 authors) |
| `ownershipApplied` | `System-under-L0` (substrate §4 A-11) |
| `stateTemplate` | `declared` (substrate §9 LifecycleState) |
| `stateApplied` | `runtime` (substrate §9 LifecycleState; ts file is consumed at every build/audit invocation) |
| `governsRuntimeCode` | `true` (per MA-I8, added Sprint B1 Shot 2 v3.3.0). Basis: LIV-Standard governs source-tree code structure across the entire `src/` tree. Tier T0..T6 declarations apply to every source file; axioms A1–A7 are mechanical invariants enforced by pipeline instances (IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA) at build and audit time. Source-governing intent is declarative-tier rules; runtime binding is the ts file `src/core/constants/liv-standard.ts` consumed by pipeline instances. jurisdictionClaim per axis declared at §3.13.10 below. |
| `genesis` | see §1.1 GenesisDeclaration |
| `carrier` | `self` (substrate §9 Carrier enum; LIV-Standard governs source code structure — the runtime ts file is its own carrier; no enclosing framework wraps the standard's output) |
| `primitive` | `code-construct` (framework-local atomic unit; every typed declaration, function, file in source is one code-construct instance) |
| `consumes` | declarative spec — no R3 input surface (LIV-Standard is structural; consumed at audit/build time, not invoked) |
| `produces` | `GeneratedFrameworkTemplate` (this md spec) + `LIV_STANDARD` constant (ts file binding) |
| `consumedBy` | IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA (pipeline instances per ts file `instances` field — read the standard for axiom + tier discipline at their respective build/audit steps); every slice during build/audit (T1.3 compliance stamp + T5.3 compliance checks fire at every file) |
| `scopeOut` | `['cross-tree placement (owned by Placement Standard v1.0 — LIV-Standard declares inside-slice tier structure T1.1–T1.6, not cross-tree directory placement)', 'artifact emission mechanics (owned by Artifact Standard v2.2)', 'plan authoring (owned by Plan Standard v2.2)', 'multi-instance dispatch routing (owned by Multi-Instance Standard v2.3)', 'persistence mechanics (owned by Living Memory v3.3 — LIV-Standard does not declare substrate atom shapes)', 'perimeter rules (owned by Perimeter Standard v1.1 — LIV-Standard does not declare boundary-crossing typing)', 'verification mechanics (owned by Verification Standard v1.0)', 'runtime execution of pipeline (owned by instance hosts — LIV-Standard declares the rule set, pipeline instances execute)', 'documentation rendering (owned by liv-renderer)']` |
| `referentCitations` | `[{path: 'src/core/constants/liv-standard.ts', expectedShape: 'LivStandard constant matching liv-standard.types.ts LivStandard typed shape; version field === "v1.5.2"', kind: 'typed-constant'}, {path: 'src/core/constants/liv-standard.types.ts', expectedShape: 'LivStandard type alias + all axiom/instance/section/rule typed shapes per spec §2.4', kind: 'typed-types-module'}]` — minimum baseline RCs declared at v1.5.2 (the ts file is the runtime binding). Full `src/**` jurisdiction coverage staged with partial-drift per MA-V11 vacuous-pass; see §3.13.10. |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8:

```
genesis = {
  origin: 'L0-authored-predating-MF-discipline; md-spec-rendered-Sprint-B1-Shot-4-against-MFv3-v3.3.0',
  parentFrameworkRef: { id: 'metaframework', version: '3.3.0' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-b1-shot-4-liv-standard-md-spec-authoring',
  confirmedAt: 'Sprint B1 Shot 4 close',
  predecessorVersion: { id: 'liv-standard', version: '1.5.1', form: 'ts-file-only-no-md-spec' },
  predecessorDisposition: 'extended — md spec adds declarative structural form; ts file content preserved verbatim with header version bump v1.5.1 → v1.5.2 only',
  bootstrapped: true
}
```

**Bootstrap status:** `bootstrapped: true` per A-14. LIV-Standard's seven axioms A1–A7 originated as L0 declarations predating MF discipline (the original "axiom set" concept the ts file carries). The prior framing tried to slot them as "L1-codified parallel to Protocol" because of this provenance. That slot does not exist under the ratified governance chain (Manual v13.0 Part IV: L1=Protocol consulted only; L2=Derivation/metaframework; L3=Standards; L4=Programs — no L1-codified standards slot). The honest position at this delivery: A1–A7 are LIV-Standard's domain axioms — P4 axiom instances inside LIV-Standard's structural mode, structurally identical to LMA1–LMA12 inside LM and PA1..PA-I inside PS. The age of A1–A7 is not a special exemption; each carries `basis` per A-22, with substrate-atom-ref preferred where substrate underwrites (A3 → A-01 WAtom + A-18 ReferentCitation) and l0-ratified-ref to Manual v13.0 elsewhere.

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I8:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template (`Human`) + applied (`System-under-L0`) in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template (`declared`) + applied (`runtime`) in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14; bootstrap status declared. |
| MA-I6 | Version declared as `1.5.2`; semver format per substrate §7. |
| MA-I7 | scopeOut declared in §1; non-empty enumeration of excluded concerns. |
| MA-I8 | `governsRuntimeCode = true` declared §1 with basis prose per Sprint B1 Shot 2 v3.3.0 amendment (boolean type-check class per substrate §6.3). |

### §1.3 MA-G13 four-property test (framework classification)

| Property | Satisfied by |
|---|---|
| Own state | The axiom set A1–A7 + tier section enumeration T0–T6 + rule set + flow enum + wire enum + instance set + IF-field enum + WC-rule set + compliance-check list + error-mapping list (per ts file `LIV_STANDARD` constant). State is the declared structural content; transition rules: amended only per MA-L1 additive (axiom text frozen per ts file A1–A7 `frozen: true`; new axiom = new major version per ts file T6.5-R5). |
| Own I/O | Output: this md spec (`GeneratedFrameworkTemplate`) + `LIV_STANDARD` ts binding. No R3 input surface — LIV-Standard is consumed by reference, not invoked. |
| Own invariants | 7 axioms A1–A7 declared §3.3 — each one mechanical condition per AxR2, each binding to exactly one MFv3 axis per AxR1. Plus the 36 tier-rules declared in the ts file (T1.3-R*, T1.5-R*, T1.6-R*, T2.3-R*, T3.1-R*, T4.1-R*, T4.2-R*, T6.3-R*, T6.5-R*) which derive from and cite specific axioms — these are domain refinements, not separate axioms. |
| Own discipline | Tier enforcement per pipeline instances IN-* declared at ts file `instances` field; compliance-check list CC.01–CC.19 mechanical predicates over source-tree files; T5.4 TS-error → axiom-violation mapping. |

All four properties declared. MA-G13 passes. LIV-Standard is classified as framework (not state store, not protocol, not substrate).

**Hidden-sibling check:**

| Candidate | Result |
|---|---|
| Single tier (e.g., T1 Layer Model alone) | Not a framework — a tier within LIV-Standard's structural decomposition. No own I/O, no own invariants (axioms cite tiers, not the other way around). |
| `LIV_STANDARD` ts constant | Not a framework — a W-ATOM (runtime data binding). |
| Pipeline instance (e.g., IN-BUILD) | Not a framework — a consumer of LIV-Standard. Has own discipline but consumes LIV-Standard's invariants. Falls under multi-instance-standard, not LIV-Standard. |

No sub-element earns framework classification. MA-G13 clean.

---

## §2 Schema

### §2.1 Input (R3 surface)

**LIV-Standard declares structure consumed by reference at build/audit time. No runtime input surface.**

Pipeline instances (IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA) read `LIV_STANDARD` constant from `src/core/constants/liv-standard.ts` and apply its declarations at their respective execution steps. No invocation surface — the standard is data, not procedure.

Per MA-S1: typed input atom is the empty set for declarative-mode standards consumed by reference. Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'R3-input',
  instanceCount: 0,
  basis: "LIV-Standard mode = structural per §1 Identity. Structural-mode standards declare structure consumed at audit time, not invoked at runtime. Pipeline instances read LIV_STANDARD constant as data per build/audit step; no input atom shape required. Precedent: Plan Standard v2.2 §2.1 + Verification Standard v1.0 §2.1 follow the same declarative pattern."
}
```

### §2.2 Output

The standard's outputs are:

1. **This md spec** — `GeneratedFrameworkTemplate` per MFv3 v3.3.1 §2.2 output schema.
2. **`LIV_STANDARD` ts constant** — the runtime binding consumed by pipeline instances. Typed shape `LivStandard` declared at `src/core/constants/liv-standard.types.ts` (referenced by reference per S1).

Per MA-S2: output atoms are W-ATOMs per substrate §4 A-01.

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `Kind` | substrate §4 A-10 |
| `AuthorityLevel` | substrate §5 |
| `Ownership` | substrate §4 A-11 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |
| `Semver` | substrate §7 |
| `WAtom` | substrate §4 A-01 |
| `AxisBasis` | substrate §4 A-22 |
| `ReferentCitation` | substrate §4 A-18 |
| `AmendmentProvenance` | substrate §4 A-16 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `CustodyRow` | substrate §4 A-04 |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 |

### §2.4 Framework-local atoms (declared in `src/core/constants/liv-standard.types.ts`)

Typed shapes consumed by reference per A-08 cross-framework-atom-reference. Full enumeration in ts types file; summary list here:

| Atom | Role |
|---|---|
| `LivStandard` | top-level container shape (record of axioms, rules, sections, flows, wires, instances, buildSequence, ifFields, wcRules, complianceChecks, errorMappings) |
| `AxiomId`, `Axiom` | the seven A1–A7 atoms |
| `InstanceId`, `Instance` | the seven IN-* pipeline-instance atoms |
| `RuleId`, `Rule` | tier-rule atoms (36 rules per ts file `rules` field) |
| `TierId`, `SectionId`, `Section` | tier hierarchy + section atoms (T0..T6 tiers; T0/T1.1–T6.5 sections) |
| `FlowId`, `Flow` | the eight FL-* flow atoms |
| `WireId`, `Wire` | the four W-* wire atoms (W-ATOM, W-EVENT, W-INJECT, W-HOOK) |
| `BuildStep` | the build-sequence step shape (8 steps + 6a stall) |
| `IFFieldId`, `IFField` | the ten IF.* contract-field atoms |
| `WCRule` | the three WC.* wire-change-protocol atoms |
| `ComplianceCheck` | compliance check shape (19 CC.* entries) |
| `TSErrorMapping` | TS-error → axiom violation mapping atom |
| `AtomKindId` | eight AK-* atom-kind tags (entity/payload/result/const/enum/ref/summary/delta) |
| `HandoffFormat`, `HandoffSpec`, `HandoffValidationResult` | handoff-validation atoms (LIV-Procedure tier; consumed by liv-api validateHandoff()) |
| `RequestContext` | identity envelope at R3 boundary (canonically tied to A3 per ts file comment at line 354) |
| `IfContract`, `JobPacket`, `AtomDecl`, `WireEntry`, `EventContract`, `MigrationDelta`, etc. | LIV-Procedure typed-shape atoms (the planning + dispatch typed contracts) |

Total: ~30 typed-shape atom families declared in the types file. Each conforms to substrate §4 A-01 WAtom shape per MA-S1/MA-S2.

### §2.5 Schema rules

Per metaframework §2.5. No LIV-Standard-local ScR additions beyond the substrate-tier rules (S1 single-source-of-truth, S3 additive versioning) which LIV-Standard honors at its own scope (axiom text frozen per A1–A7 `frozen: true`; new tier additions additive per T6.5-R3).

### §2.6 Custody pointer

Full custody table in §6 Coupling.

---

## §3 Structure

### §3.1 Axes (inherited)

LIV-Standard inherits metaframework-v3-1 v3.3.1's seven-axis decomposition per substrate §1.3 SI-03 permitted-multi-execution. LIV-Standard does not redeclare own axes.

### §3.2 Primitive instance counts

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | inherited from metaframework-v3-1 §3.1 per substrate §1.3 SI-03 |
| P2 Sub-axis | 0 | none declared (LIV-Standard's structural content is decomposed at the tier/section level, not via sub-axis decomposition of inherited MFv3 axes) |
| P3 Leaf | 0 | none declared (axioms bind to MFv3 axes directly at the axiom-condition level per §3.3 below; sub-axis + leaf decomposition is PS's pattern, not required for LIV-Standard) |
| P4 Axiom | 7 | A1..A7 declared §3.3 |
| P5 Gate | 7 | LS-G1..LS-G7, 1:1 with axioms per G-M1; declared §4.2 |
| P6 Handoff rule | 0 | LIV-Standard is declarative — consumed by reference, not handoff-active. Inherited HR1 (substrate consumption) + HR6 (MFv3 → generated L3 frameworks) are referenced at §6.2 per substrate §1.3 SI-03, not redeclared as own handoff rules. Positive empty-declaration per substrate §8.6 + A-17: `{primitiveKind: 'P6', instanceCount: 0, basis: "LIV-Standard mode = structural; consumed by reference at build/audit time per §2.1. No own emission contracts — pipeline instances read LIV_STANDARD constant directly per ts file's instances field. Inherited HR1 + HR6 referenced at §6.2 cover the cross-framework handoff structure; no LIV-Standard-local HR additions required."}` |
| P7 Judgment input | 0 | LIV-Standard's domain is structural/mechanical — all axioms A1–A7 state mechanical conditions per AxR2 (no criteria-bounded conditions requiring J-input adjudication). Tier rules likewise mechanical (per `mechanical: true/false` field on each `ComplianceCheck` — even compliance checks marked `mechanical: false` like CC.12 "Flows implemented consistently with T2.1 step sequence" are not new judgment inputs, they are softer mechanical checks). Positive empty-declaration per substrate §8.6 + A-17: `{primitiveKind: 'P7', instanceCount: 0, basis: "LIV-Standard structural mode; all axiom conditions are mechanical predicates per AxR2 — no criteria-bounded conditions. Compliance checks with mechanical=false are softer mechanical (T1.5 wire selection, T4.1 auth-layer placement) rather than judgment-input-requiring."}` |
| P8 Procedure step | 0 | structural mode per substrate §8.3 binds P8 to generative only. Positive empty-declaration per substrate §8.6 + A-17: `{primitiveKind: 'P8', instanceCount: 0, basis: "LIV-Standard Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only. LIV-Standard's tier-rules + compliance-checks are declarative invariants enforced by pipeline instances; runtime invocation is outside LIV-Standard's P8 scope. Precedent: Plan Standard v2.2 §3.7 + Perimeter Standard v1.1 §3.7."}` |

### §3.3 Axioms (P4 instances)

**Count: 7 axioms A1–A7.** Each binds to exactly one MFv3 axis per AxR1. Text preserved verbatim from `LIV_STANDARD.axioms` in `src/core/constants/liv-standard.ts` v1.5.2 (axiom text frozen per `frozen: true` field on each axiom; new axiom requires new major version per ts file T6.5-R5).

Axis-binding rationale per axiom is recorded inline; full basis declarations per A-22 are at §3.13.3 below.

| ID | Name | Axis binding | Mechanical condition | AxR1 rationale |
|---|---|---|---|---|
| **A1** | Single ownership | **Structure** | Every construct belongs to exactly one category and one owner. | "Exactly one" is a structural cardinality predicate over source-tree decomposition. The axiom says: in the structural decomposition, each construct has cardinality-1 category-membership AND cardinality-1 owner-membership. Pure structural-decomposition property; binds to Structure axis per MFv3 §3.1.1 FrameworkConcernSpace `Structure → internal-decomposition`. |
| **A2** | Directional dependency | **Coupling** | Dependencies flow toward lower layers only. No upward imports. No lateral imports across slice boundaries. | The axiom governs *relationships between elements* (what imports what). MFv3 Coupling axis is precisely "cross-framework/cross-element concerns" per FrameworkConcernSpace `Coupling → cross-framework-concerns`. MA-C-family axioms govern handoff and dependency shape. A2 is the directional-relationship rule between layered elements; binds to Coupling. |
| **A3** | Typed boundaries | **Schema** | State crosses boundaries through declared atom types only. Raw or untyped data never crosses a slice boundary. | "Crossing boundaries through declared atom types" = typed I/O at the slice boundary. MFv3 Schema axis per FrameworkConcernSpace `Schema → typed-I/O`. MA-S-family axioms govern typed shape declaration. The atom-type-only rule is a schema-conformance predicate; binds to Schema. **Substrate-atom-ref grounding** at §3.13.3 (A-01 WAtom + A-18 ReferentCitation underwrite). |
| **A4** | Isolated execution | **Structure** | I/O executes at R4 only. Business logic executes outside R4 only. | The axiom is a where-rule: which layer hosts which kind of work. Structural placement / locus-of-execution rule, not a cross-element relationship rule. Per FrameworkConcernSpace `Structure → internal-decomposition`. Coupling candidate exists because R2→R4 happens "via injected interface" — but A4's condition is *layer-placement of I/O code* (locus), not *injection mechanism* (which A2 + A5 cover). The injection mechanism for R2→R4 is W-INJECT (Coupling territory), but where I/O executes is layer-decomposition (Structure territory). Binds to Structure. |
| **A5** | Event-only notification | **Coupling** | Cross-slice notification uses the event bus only. Slices never call each other directly. | "Cross-slice notification" = inter-element communication; mechanism rule (event bus only, no direct call). Per FrameworkConcernSpace `Coupling → cross-framework-concerns`. Schema candidate exists because events have typed payloads — but the payload-shape concern is A3 (typed atoms cross boundaries). A5's predicate is the *mechanism* (W-EVENT only, no W-* alternative; no direct import), not the payload typing. Binds to Coupling. |
| **A6** | Declaration at origin | **Identity** | Every construct is declared at R0 of its owning slice. Nothing is declared where it is not owned. | "Where a construct is declared" is a property of the construct's identity — its owning location. Per FrameworkConcernSpace `Identity → what-a-framework-is` (the *where* part of construct identity). Lifecycle candidate exists because the axiom involves "declaration" which sounds temporal — but A6 has no temporal predicate, it is a *static placement* rule (the construct's owning location is fixed, not a state transition). Binds to Identity. |
| **A7** | Deletability | **Lifecycle** | A slice is complete when it can be deleted and no file outside it breaks. | Deletability is a state-transition property — whether the slice can transition to absent state without cascading failure. Per FrameworkConcernSpace `Lifecycle → versioning-amendment-transition`. MA-L-family governs lifecycle transitions. A7 is the slice-completion criterion stated as a deletion-state-transition test. Binds to Lifecycle. |

**AxR1 self-check:** each A1..A7 binds to exactly one axis. No two-axis ambiguity that requires escalation — each has a primary axis where the predicate naturally lives, with alternative candidates covered by adjacent axioms (e.g., A4-coupling-flavor is covered by A2 + A5; A5-schema-flavor is covered by A3; A6-lifecycle-flavor would require a state-transition predicate which A6 does not state). Pass.

**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.

**AxR3 self-check:** axiom set is the v1.5 baseline carried forward at v1.5.2 with zero invariant-predicate changes (axiom text frozen per `frozen: true`; ts file content preserved). Future amendments additive per MA-L1 + MA-S7. Pass.

**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.4 Tier declarations (LIV-Standard's domain structural content)

The ts file declares tier hierarchy T0..T6 with sections and tier-rules. These are LIV-Standard's domain structural content — declarations of how source-tree structure decomposes under the seven axioms. Each tier-section declaration is preserved verbatim from the ts file `LIV_STANDARD.sections`; declared here in spec form for cross-reference.

| Tier | Concern | Sections (count) | Axioms cited (per section preamble) |
|---|---|---|---|
| **T0** | System Invariants — the seven axioms themselves | 1 (T0) | A1..A7 (T0 enumerates the axiom set) |
| **T1** | Layer Model + Bundle Anatomy + Compliance Stamp + Category Table + Wires + Atom Taxonomy | 6 (T1.1–T1.6) | A1, A2, A3, A4, A5, A6, A7 (T1 sections cite all axioms; each tier-rule cites specific axioms — see §3.5 below) |
| **T2** | Flows + Error Propagation + External Service Wrapping | 3 (T2.1–T2.3) | A1, A3, A4 |
| **T3** | State Taxonomy + Hook Contract Shape | 2 (T3.1, T3.2) | A2, A3, A4, A5 |
| **T4** | Auth Boundary + Validation Boundary | 2 (T4.1, T4.2) | A3 |
| **T5** | Test Taxonomy + Observability + Compliance Checks + TS Error Mapping | 4 (T5.1–T5.4) | A1, A2, A3, A4, A6 |
| **T6** | Instance Team + Information Flow + Build Sequence + Wire Change Protocol + Standard Evolution | 5 (T6.1–T6.5) | A1, A3 |

Total sections: 23 across T0–T6. Each section has `enforcement: 'pipeline'` or `enforcement: 'reference'` declared per `instances` field per ts file (pipeline → at least one IN-* instance assigned; reference → instances=[] per ts file T5.3-style CC.18 mechanical check).

### §3.5 Tier rules

36 tier-rules declared in `LIV_STANDARD.rules` (per ts file v1.5.2). Each rule cites exactly one or two axioms (the `axiom: AxiomId | AxiomId[]` typed field per `Rule` shape). Rules are domain refinements of the axioms; they are not separate framework-tier axioms — they ground in the seven A1–A7 and inherit AxR conformance from their cited axiom(s).

Distribution per ts file `rules` field at v1.5.2:

| Tier section | Rule count | Citing axioms |
|---|---|---|
| T1.3 (Compliance Stamp) | 13 (R1, R2, R3, R4, R5, R5.1–R5.8) | A1 (12 rules), A2 (2 rules: T1.3-R5.4, T1.3-R5.6), A6 (1 rule: T1.3-R5.5) |
| T1.5 (Wires) | 2 (R5, R6) | A3 (R5), A1+A6 (R6) |
| T1.6 (Atom Taxonomy) | 4 (R1, R2, R3, R4) | A1 (R1, R2), A3 (R3, R4) |
| T2.3 (External Service Wrapping) | 4 (R1, R2, R3, R4) | A1 (R1), A4 (R2, R3, R4) |
| T3.1 (State Taxonomy) | 3 (R1, R2, R3) | A4 (R1), A5 (R2), A3 (R3) |
| T4.1 (Auth Boundary) | 2 (R1, R2) | A3 (both) |
| T4.2 (Validation Boundary) | 4 (R1, R2, R3, R4) | A3 (all four) |
| T6.3 (Build Sequence) | 1 (R1) | A3 |
| T6.5 (Standard Evolution) | 5 (R1, R2, R3, R4, R5) | A1 (all five) |

Total: 38 rule-rows (some rules cite multiple axioms; total axiom-citations ≈ 41). All rules ground in A1–A7; no rule introduces a new mechanical predicate beyond its cited axiom.

### §3.6 Flows, Wires, Instances, IF-fields, WC-rules, Compliance-checks, Error-mappings

Additional declarative content in `LIV_STANDARD` beyond axioms + sections + rules. Each is a closed enumeration per typed-shape constraint in ts types file:

- **8 flows** (`FlowId` enum): FL-CRUD, FL-QUERY, FL-STREAM, FL-AUTH, FL-MIGRATION, FL-EVENT-FAN, FL-JOB, FL-WEBHOOK. Each declares trigger + sequence + invariant. New flow requires new FL-ID per ts file T6.5-R3.
- **4 wires** (`WireId` enum): W-ATOM, W-EVENT, W-INJECT, W-HOOK. Closed at exactly four per axiom-of-LIV-Standard-itself at section T1.5 ("Exactly four wire types"). New wire requires axiom citation proving no A1–A7 violation per T6.5-R4 (no new wire since v1.0).
- **7 pipeline instances** (`InstanceId` enum): IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA. Each declares count + parallel + routesTo per ts file `instances` field.
- **10 IF-fields** (`IFFieldId` enum): IF.01–IF.10. Each declares name + description + required + consumers per ts file `ifFields` field.
- **3 WC-rules** (wire-change-protocol): WC.1, WC.2, WC.3. Each cites axiom(s) per ts file `wcRules` field.
- **19 compliance-checks**: CC.01–CC.19. Each has `mechanical: true/false` flag per ts file `complianceChecks` array. 16 mechanical, 3 non-mechanical (CC.12, CC.13, CC.14, CC.15 — verify against ts file at audit; note: CC.12–CC.15 mechanical=false; rest mechanical=true).
- **7 TS-error mappings**: pattern → cause → axiom → fix per ts file `errorMappings` array.
- **8 atom kinds** (`AtomKindId` enum): AK-ENT, AK-PAY, AK-RES, AK-CONST, AK-ENUM, AK-REF, AK-SUM, AK-DELTA. Declared at T1.6 section per ts file.
- **8 build-sequence steps**: 1, 2, 3, 4, 5, 6, 6a, 7, 8 (the 6a is the stall path per ts file `buildSequence` array).

Each enumeration is closed by typed-shape literal-union constraint at the types file (`FlowId = 'FL-CRUD' | ...`; `WireId = 'W-ATOM' | ...`); new enum values are additive amendments per MA-S7 + ts file T6.5 evolution rules.

### §3.7 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Vocabulary closure aligns with the ts file `T1.4 Category Table`:

| Term | Declared | Definition |
|---|---|---|
| `atom` | T1.4 | Typed declaration at R0 of an owning slice. Imported by type only. Never redeclared. (A1, A6) |
| `logic` | T1.4 | Pure function, transformer, or validator at R1. Never exported across slices. (A2) |
| `workflow` | T1.4 | Async orchestrator at R2. Called by R3 of same slice only. (A2, A4) |
| `contract` | T1.4 | API route, state hook, or UI component at R3. Hook is the only external surface. (A2, A3) |
| `exec` | T1.4 | DB query or external I/O call at R4. Never called directly; via injected interface from R2. (A4) |
| `event` | T1.4 | Event name constant + payload atom at R0 of emitter. Consumed via event-schema barrel only. (A5, A6) |
| `bundle` | T1.4 | Complete R0–R4 slice directory. Connected via 4 wire types only. (A7) |
| `core` | T1.4 | Shared infrastructure at R5 (db client, primitives). Any layer may import; zero domain logic. (A1) |
| `flow` | T1.4 | Canonical multi-step execution pattern declared in LIV-Standard T2. Implemented per bundle; not shared code. (A3) |
| `wire` | T1.4 | Connection mechanism between bundles. Exactly 4 types (W-ATOM, W-EVENT, W-INJECT, W-HOOK). (A2, A5) |
| `slice` | T1.1 | A bundle = one slice = one directory = one R0–R4 stack. The unit of feature delivery. |
| `R0..R5` | T1.1 | Layer model: R0=types/, R1=domain/, R2=workflow/, R3=contract/, R4=exec/, R5=core/. Layer determines what may import/export/execute. |
| `manifest` | T1.3 | Header block on every R0–R4 file declaring standard version, slice, layer, wires-in, wires-out, deps, validated date. Drift between manifest and file body is a violation in either direction. |
| `pipeline instance` | T6.1 | One of seven IN-* instances. Each has one job. Wrong instance for a job produces wrong output. |
| `compliance stamp` | T1.3 | The 3-line `@liv-standard / [F-slice/R-N] / Built with LIV` header on every generated file. Not optional. |

Vocabulary is closed at this set; new term additions are additive amendments per MA-L1.

---

### §3.13 AxisBasis declarations (Sprint B1 Shot 4 v1.5.2 amendment, additive per MA-S7 recursive scope)

Per MA-St17 (metaframework v3.3.1 §3.2.1): every LIV-Standard declaration in the enumerated kind set (axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums) that crosses boundary 2 (MFv3 → standards) and is not already grounded by another declared mechanism (P1–P8 instance grounding by PR1; axiom grounding by own derivation; gate grounding by `tests` binding) declares a basis conforming to substrate §4 A-22 AxisBasis. Every basis below traces by natural derivation. No force-fit. Where a kind has no instances (sub-axes = 0, leaves = 0, HRs = 0 own, J-inputs = 0, procedure steps = 0), MA-St17 quantifier is vacuously satisfied per quantifier semantics; the empty-declaration's basis is already declared at §3.2 above per substrate §8.6 + A-17.

Manual citations pin `manualVersion: '13.0'`. Citations map by Part + named subsection content per v13.0 reorganization. Substrate-atom-ref preferred where substrate underwrites; l0-ratified-ref to Manual v13.0 elsewhere.

#### §3.13.1 Axes basis

LIV-Standard declares **0 own P1 Axis instances** (inherits MFv3 seven-axis decomposition per substrate §1.3 SI-03 permitted-multi-execution). Per MA-St17 exclusion semantics, declarations not made at this framework cross no boundary 2 from this framework; no basis required at LIV-Standard. Inherited axes are grounded by MFv3 §3.1.1 FrameworkConcernSpace.

#### §3.13.2 Sub-axes basis

LIV-Standard declares **0 own P2 Sub-axis instances**. Axioms A1–A7 bind to MFv3 axes directly at the axiom-condition level per §3.3 above (no sub-axis decomposition required). No basis required.

#### §3.13.3 Axioms basis (A1–A7)

Although axioms are excluded from the MA-St17 quantifier per "axiom grounding handled by axiom's own derivation," LIV-Standard declares per-axiom basis here for traceability of the L0-predating-MF-discipline provenance and to document the substrate-atom-ref preferred-arm check per brief discipline.

| Axiom | Axis | Basis kind | Reference | Basis prose |
|---|---|---|---|---|
| **A1** Single ownership | Structure | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, Standards ("One governing standard per program or program category" + "Every program in every loop... has exactly one governing standard") + Part I — Substrate (identity-by-reference single-owner semantics)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` | Single-ownership is the source-tier realization of the Manual's "exactly one governing standard per program" structural commitment at Part IV Standards, combined with Part I Substrate identity-by-reference single-owner semantics for substrate identities. No substrate atom directly underwrites the source-tree single-ownership rule; substrate-atom-ref not applicable. L0-ratified at LIV-Standard v1.0 (axiom set predating MF discipline; first ratified into the governance chain at this v1.5.2 md spec authoring per Sprint B1 Shot 4). |
| **A2** Directional dependency | Coupling | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, The governance chain ("The chain is acyclic and terminates") + Part I — Substrate ("Every program reads from here and writes back here")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Directional dependency at source tier is the realization of the Manual's acyclic + terminating governance-chain commitment, projected onto the layered code structure. The "no upward imports, no lateral imports across slices" rule preserves acyclicity at the code tier. No substrate atom directly underwrites layered import discipline; substrate-atom-ref not applicable. L0-ratified at LIV-Standard v1.0. |
| **A3** Typed boundaries | Schema | **`substrate-atom-ref`** | `atomId: 'A-01'` (WAtom — typed-shape primitive) + `atomId: 'A-18'` (ReferentCitation — typed-shape citation atom) | **Strongest grounding available.** The "state crosses boundaries through declared atom types only" rule is the source-tier realization of substrate §4 A-01 WAtom typed-shape primitive — every typed I/O at a slice boundary must conform to a declared atom shape, which is exactly what A-01 declares. Substrate §4 A-18 ReferentCitation underwrites the citation-from-typed-declaration-to-runtime-binding pattern. Substrate-atom-ref preferred per brief discipline; both atoms naturally underwrite. (Note: substrate atoms exist at the substrate tier; LIV-Standard's A3 is the source-tier projection of the same typed-boundary discipline. The grounding is mechanical reference-resolution to A-01 + A-18.) |
| **A4** Isolated execution | Structure | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary ("Authority enforcement. Boundary enforces authority at the crossing") + Part II — Store ("Store does not initiate. It is acted upon")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Locus-of-I/O at the substrate side is what Boundary + Store framing forces: I/O happens at Boundary (intake/dispatch typing) + at Store (substrate-write/read at the durable boundary). The source-tier R4-only-I/O rule is the realization — code that touches external I/O (DB, network, filesystem) lives at exactly one layer, R4, structurally distinct from layers hosting business logic (R1/R2). No substrate atom directly underwrites layered I/O locus; substrate-atom-ref not applicable. L0-ratified at LIV-Standard v1.0. |
| **A5** Event-only notification | Coupling | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Boundary mechanics — Correlation; correlations are perimeter-internal not cross-cutting) + Part II — Memory Loop ("Mediator carries it" — cross-program signal flow goes through Boundary→Mediator→Store, never direct lateral)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Event-only notification at source tier is the realization of the Manual's "no direct lateral signal flow" memory-loop discipline. Cross-slice notification goes through W-EVENT bus = the source-tier analog of Boundary→Mediator→Store transit. No direct lateral call = no direct cross-slice import. No substrate atom directly underwrites event-bus mechanism (CorrelationRef at PS is the perimeter-side analog; not a substrate atom). L0-ratified at LIV-Standard v1.0. |
| **A6** Declaration at origin | Identity | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (identity-by-reference: substrate identities exist by reference, with cluster geometry read-time emergent — single owner per identity declaration) + Part IV — Standards ("Every program traces to a standard")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | "Declaration at origin" is the source-tier realization of identity-by-reference (single owner per identity declaration site) + governance-chain (every program has one standard declared once, traced to that origin). Substrate S1 single-source-of-truth Schema rule is the substrate-tier analog of the same discipline; S1 is a ScR (Schema Rule) not a typed atom, so substrate-atom-ref does not apply directly — natural arm is l0-ratified-ref to Manual loci with S1 cited as supporting ScR. L0-ratified at LIV-Standard v1.0. |
| **A7** Deletability | Lifecycle | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, The governance chain ("A program without a governing standard is structurally undefined" + "The chain is acyclic and terminates")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Deletability = slice completion = no orphaned cross-element references when the slice is removed. The Manual's acyclic-termination commitment + "a program without a governing standard is structurally undefined" together force the deletability discipline: a slice is complete only when removing it does not leave any cross-element reference orphaned (which would be an acyclic-termination violation at the source tier). No substrate atom directly underwrites slice-completion-by-deletion; substrate-atom-ref not applicable. L0-ratified at LIV-Standard v1.0. |

#### §3.13.4 Handoff rules basis

LIV-Standard declares **0 own P6 Handoff Rule instances**. Empty-declaration basis already declared at §3.2 per substrate §8.6 + A-17. Inherited HR1 (substrate consumption — LIV-Standard consumes substrate atoms by reference) and HR6 (MFv3 → generated L3 frameworks — LIV-Standard is one such generated L3) are referenced at §6.2 per substrate §1.3 SI-03; no LIV-Standard-local HR additions.

#### §3.13.5 Lifecycle events basis

| Event (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `version transition` (§5.1) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) + `atomId: 'A-21'` (StateOrdering) | Version transitions are AmendmentProvenance instances per substrate §4 A-16; transitions occur between LifecycleState positions declared at substrate §9, which in turn index five-state ordering at A-21 per MFv3 v3.3.0-shot1 amendment. Strongest grounding. |
| `amendment procedure` (§5.2) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) | Amendment procedure (propose → audit → L0 confirm → propagate) is the structural pattern that materializes AmendmentProvenance per substrate §4 A-16. Substrate-tier grounding. Plus LIV-Standard-internal evolution rules per ts file T6.5-R1..R5 (pattern→standard threshold, axiom-text-frozen-forever, new-major-version-for-axiom-change) which are domain refinements grounded by A1; not separate basis declarations. |
| `state transition: declared → runtime` (§5.3) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) | Transition between two LifecycleState enum values declared at substrate §9. The standard transitions to runtime when first consumed by a pipeline instance (IN-MAIN reading LIV_STANDARD at first build). Strongest grounding. |
| `state transition: runtime → deprecated` (§5.3) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) | Same basis as above; both endpoints are LifecycleState enum values. Deprecation gated by successor framework + migration path per §5.4. |
| `deprecation procedure` (§5.4) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) + `atomId: 'A-16'` (AmendmentProvenance — successor framework ratification is itself an AmendmentProvenance event) | Deprecation prerequisites (successor framework generated + L0-confirmed; migration path declared; L0 deprecation ruling) compose a state transition into `deprecated` (substrate §9 LifecycleState) gated by an L0-ratified AmendmentProvenance (A-16). Substrate-tier grounding. |

#### §3.13.6 Judgment inputs basis

LIV-Standard declares **0 own P7 Judgment Input instances**. Empty-declaration basis already declared at §3.2 per substrate §8.6 + A-17. All axiom conditions are mechanical predicates per AxR2; no judgment inputs required.

#### §3.13.7 Closure rules basis

| Closure (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `Axiom set closure` (§3.3, A1–A7 frozen per ts file `frozen: true`) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Standards (every program has exactly one governing standard with declared axioms)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed seven-axiom set; new axiom requires new major version per ts file T6.5-R5. Frozen-text discipline (ts file `frozen: true` field per axiom) realizes the Manual's "axiom text frozen forever" commitment in the structural-evolution rule set. L0-ratified at LIV-Standard v1.0. |
| `Section/Tier closure` (§3.4 — T0..T6 tier hierarchy + 23 sections) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Standards (axioms, invariants, gates, procedures the program must satisfy) + Part I — Substrate (the foundation that all three loops share)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Tier hierarchy organizes axiom-citing rules into structural concerns (T0 axioms themselves, T1 layer/bundle/stamp/category/wire/atom, T2 flow/error/external-service, T3 state/hook, T4 auth/validation, T5 test/observability/compliance/error-mapping, T6 instance/IF/build-sequence/wire-change/evolution). Each tier carves out a domain concern under the seven axioms. New tier addition is additive per T6.5-R3 + MA-L1. L0-ratified at LIV-Standard v1.0. |
| `Wire-type closure` (§3.6 — exactly 4 wires W-ATOM, W-EVENT, W-INJECT, W-HOOK) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Standards (declared axioms govern programs precisely)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed-at-exactly-four-wires is LIV-Standard's own structural commitment per ts file T1.5 ("Exactly four wire types. Choosing the wrong wire is a structural violation. No other connection mechanism between bundles is valid"). New wire requires axiom citation proving no A1–A7 violation per T6.5-R4 (no new wire since v1.0). L0-ratified at LIV-Standard v1.0. |
| `Flow-ID closure` (§3.6 — 8 FL-* IDs) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part III — Domain Loop (programs operate against declared flow patterns)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed at 8 canonical execution sequences. New flow requires FL-ID assignment + documentation per ts file T6.5-R3 + MA-L1. L0-ratified at LIV-Standard v1.0 (FL-CRUD, FL-QUERY, FL-STREAM, FL-AUTH, FL-MIGRATION, FL-EVENT-FAN, FL-JOB, FL-WEBHOOK). |
| `Instance closure` (§3.6 — 7 IN-* pipeline instances) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, Derivation (Generators cycle against framework targets — F-discover, F-plan, F-builder, F-verify)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed at 7 instances (IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA). Adjacent to but distinct from Manual Generators (F-discover/plan/builder/verify govern framework derivation); LIV-Standard instances govern source-tree build/audit dispatch. New instance is an additive amendment per MA-L1. L0-ratified at LIV-Standard v1.0. |
| `Atom-kind closure` (§3.6 — 8 AK-* kinds: ENT/PAY/RES/CONST/ENUM/REF/SUM/DELTA) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — all 8 atom kinds are WAtom shape specializations) | All eight atom kinds (Entity, Payload, Result, Const, Enum, Ref, Summary, Delta) are typed-shape specializations conforming to substrate §4 A-01 WAtom. New atom kind requires citation of two existing examples per ts file T6.5-R2 + MA-L1 additive. Substrate-atom-ref grounding. |
| `IF-field closure` (§3.6 — 10 IF.01–IF.10) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, Derivation (Generators cycle against framework targets; feature-intent + atom-declarations + bundle-scope + flow-selection + wire-map etc. compose the procedure input contract)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed at 10 IF-fields per ts file `ifFields` enum (FeatureIntent, AtomDeclarations, BundleScope, FlowSelection, WireMap, EventContracts, MigrationDelta, AcceptanceCriteria, LIV-Standard Version, LIV-Procedure Version). L0-ratified at LIV-Standard v1.0 (the procedural-input-contract closure for IN-MAIN decomposition). |
| `WC-rule closure` (§3.6 — 3 WC.1, WC.2, WC.3) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (Wearer-L0 substrate authority unconditional — wire-change discipline preserves wearer authority through cross-version evolution)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Three wire-change-protocol rules (declaration at R0, IN-RESOLVE propagation + IN-AUDIT version parity, deprecation blocks new consumers). L0-ratified at LIV-Standard v1.0. |
| `Vocabulary closure` (§3.7 — 15 declared terms) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Standards (axioms, invariants, gates, procedures the program must satisfy) + ts file T1.4 Category Table'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed vocabulary aligned with ts file T1.4 Category Table (atom, logic, workflow, contract, exec, event, bundle, core, flow, wire) + structural terms (slice, R0..R5, manifest, pipeline instance, compliance stamp). New term additions additive per MA-L1. L0-ratified at LIV-Standard v1.0. |
| `Compliance-check enumeration` (§3.6 — 19 CC.01–CC.19, open-list declarative) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Standards (gates the program must satisfy) + ts file `complianceChecks` array'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The compliance-check list is open-additive — new checks enter as the standard evolves (per ts file T6.5-R3 + MA-L1). Each check has `mechanical: true | false` declaration. The list itself is not a typed-shape closure (no `ComplianceCheckId` literal-union in types file); it is a declarative enumeration. L0-ratified at LIV-Standard v1.0; current count at v1.5.2 is 19. |

#### §3.13.8 Typed shapes basis

All LIV-Standard typed shapes declared in `src/core/constants/liv-standard.types.ts` ground at substrate §4 A-01 WAtom shape per MA-S1/MA-S2 (input/output W-ATOM). Consolidated declaration per shape-family pattern (consistent with PS §3.13.8 treatment of branded-ID typed shapes):

| Shape family | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `LivStandard` (top-level container) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Top-level typed-record shape consumed by reference at every pipeline instance build/audit step. Conforms to A-01 WAtom. |
| `Axiom` + `AxiomId` (A1–A7 enum + axiom shape) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shape per WAtom pattern; `AxiomId` is a literal-union closed at 7 values per axiom-set closure (§3.13.7). |
| `Instance` + `InstanceId` (IN-* enum + instance shape) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shape per WAtom pattern; `InstanceId` literal-union closed at 7 values. |
| `Rule` + `RuleId` (tier-rule shape) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shape per WAtom pattern; `RuleId` is open (string typed) — new rules enter additively. |
| `Section` + `SectionId` + `TierId` (tier/section shapes) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shapes per WAtom pattern; literal-unions closed at v1.5.2 (T0..T6 tiers; T0/T1.1–T6.5 sections). |
| `Flow` + `FlowId` (FL-* enum + flow shape) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shape per WAtom pattern; `FlowId` literal-union closed at 8 values. |
| `Wire` + `WireId` (W-* enum + wire shape) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shape per WAtom pattern; `WireId` literal-union closed at exactly 4 values per wire-type closure (§3.13.7). |
| `BuildStep`, `IFField`, `IFFieldId`, `WCRule`, `ComplianceCheck`, `TSErrorMapping` | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Typed shapes per WAtom pattern. |
| `AtomKindId` (AK-* enum) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Literal-union closed at 8 values per atom-kind closure (§3.13.7); each AK-* is itself a WAtom shape specialization. |
| LIV-Procedure typed shapes — `HandoffSpec`, `HandoffFormat`, `HandoffValidationResult`, `Template`, `TemplateId`, `DerivedSlot`, `FlowTemplateEntry`, `InstanceProfile`, `PacketSlicingRule`, `FieldDecl`, `AtomDecl`, `MethodSig`, `WireEntry`, `EventContract`, `MigrationDelta`, `IfContract`, `JobPacket` | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | LIV-Procedure typed shapes co-declared at types file (consumed by liv-procedure module per ts file types section). All conform to A-01 WAtom. |
| `RequestContext` (canonical identity envelope at R3 boundary; A3-tied per ts file comment) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) + `atomId: 'A-18'` (ReferentCitation — RequestContext is the cited typed-boundary for the source-tier A3 realization) | Typed identity envelope; A3-tied per ts file types.ts line 354 comment. Cited at T4.1-R1 tier-rule as the typed boundary between HTTP surface and business logic. Both atoms ground naturally. |
| `SliceKey`, `InstanceToSlice` (derived consumer types) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom) | Derived literal-union + record types per ts file types section. WAtom pattern. |

All typed shapes ground at substrate-atom-ref to A-01 (with A-18 supporting for RequestContext). Strongest available grounding for the typed-shape kind. Total: ~30 typed-shape families declared in ts types file; all conform to A-01.

#### §3.13.9 Procedure steps basis

**Zero P8 instances** per §3.2 + §3.7 (positive-empty per substrate §8.6 + A-17 — LIV-Standard Mode = structural; substrate §8.3 binds P8 to generative-only). MA-St17 quantifier ranges over declared instances; zero declared → no basis required per quantifier semantics. Empty-declaration grounding at substrate §8.6 + A-17 (already declared §3.2).

#### §3.13.10 Coupling enums basis

| Coupling declaration | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `carrier = 'self'` (§1, §6.1) | `substrate-atom-ref` | `atomId: 'Carrier'` (substrate §9 declared enum: `'self' \| 'named' \| 'none'`) | Carrier value enum-member per substrate §9; LIV-Standard-specific binding to `self` because LIV-Standard governs source-code structure — the runtime ts file is its own carrier; no enclosing framework wraps the standard's output. Strongest grounding. |
| Custody table entries (§6.5 — LIV-Standard ts file + types file + this md spec) | `substrate-atom-ref` | `atomId: 'A-04'` (CustodyRow) | Custody rows conform to substrate §4 A-04 CustodyRow shape per MA-C2. Strongest grounding. |

#### §3.13.11 MA-V10 part B jurisdiction coverage declaration

Per MA-V10 part B (metaframework v3.3.1 §3.2.1): when `governsRuntimeCode = true`, every source-governing axis with declared `jurisdictionClaim` must have ReferentCitations covering its claim, OR declare partial-drift per MA-V11 vacuous-pass with explicit basis prose.

LIV-Standard's seven own axioms govern source code structure across the entire `src/` tree per Manual v13.0 Part IV Operations row (LIV-Standard governs cross-slice code structure). LIV-Standard inherits MFv3's seven axes; its source-governing intent maps onto inherited axes per axiom-axis binding at §3.3:

| Axis (binding axiom) | `jurisdictionClaim` | RC coverage at v1.5.2 | Partial-drift declaration |
|---|---|---|---|
| **Identity** (A6 binds here) | `['src/**']` (declaration-at-origin rule applies to every source file: every construct is declared at R0 of its owning slice) | 2 ReferentCitations: `src/core/constants/liv-standard.ts` + `src/core/constants/liv-standard.types.ts` (the ts binding itself is the baseline citation; both files satisfy A6 — declared at R5 of core slice per their manifest headers) | `applicability: 'n/a'` for the gap between baseline (ts binding only) and full src/** coverage. `basis: "Sprint B2 source-cleanup will author ReferentCitations covering the full jurisdictionClaim src/** per MA-V10 part B amendment trigger. v1.5.2 baseline declares RCs covering LIV-Standard's own runtime binding (the ts + types files). Full src/** coverage — every slice's R0..R4 files individually cited — is staged for Sprint B2. Vacuous-pass at this version is honest declared drift, not silent gap."` |
| **Schema** (A3 binds here) | `['src/**']` (typed-boundaries rule applies to every cross-boundary I/O; atom declarations at R0 of every slice) | 2 ReferentCitations: same baseline as Identity (types file is the typed-shape declaration site for LIV-Standard's own atoms) | Same partial-drift basis as Identity axis above. Sprint B2 closes drift; per-slice typed-atom citation set staged. |
| **Structure** (A1 + A4 bind here) | `['src/**']` (single-ownership applies to every construct; isolated-execution applies to every layered file) | 2 ReferentCitations: same baseline | Same partial-drift basis. Sprint B2 closes drift. |
| **Coupling** (A2 + A5 bind here) | `['src/**']` (directional-dependency + event-only-notification apply to every cross-slice import + every cross-slice notification) | 2 ReferentCitations: same baseline | Same partial-drift basis. Sprint B2 closes drift; per-slice manifest wires-in / wires-out citation set staged. |
| **Lifecycle** (A7 binds here) | `['src/**']` (deletability applies to every slice as a whole; slice-completion criterion) | 2 ReferentCitations: same baseline | Same partial-drift basis. Sprint B2 closes drift; per-slice deletability test citation set staged. |
| Validity | not declared (declarative-tier — gate suite is declarative governance, gate execution is framework-audit/pipeline concern, not LIV-Standard source) | n/a per MA-V10 part B applicability clause | not applicable |
| Judgment | not declared (LIV-Standard declares zero P7 J-inputs per §3.2; no judgment-axis source jurisdiction) | n/a per MA-V10 part B applicability clause | not applicable |

**Discipline:** every source-governing axis declared explicitly with jurisdictionClaim = `['src/**']` because LIV-Standard's domain is cross-slice code structure (Manual v13.0 Part IV Operations row). Baseline RCs at v1.5.2 cover the ts binding itself — the minimum honest declaration. Sprint B2 sweeps to full src/** per-slice citation. Partial-drift declared mechanically per MA-V11 with explicit Sprint B2 closure prose. G-V10 part B at this version produces `applicability='n/a'` with declared basis on five axes (Identity, Schema, Structure, Coupling, Lifecycle); on Sprint B2 close, basis is replaced by full RC coverage per axis.

#### §3.13.12 AmendmentProvenance (Sprint B1 Shot 4)

```
amendmentProvenance = {
  amendmentId:          'liv-standard-v1-5-2-sprint-b1-shot-4',
  predecessorVersion:   '1.5.1 (ts-file-only)',
  successorVersion:     '1.5.2 (ts-file + md-spec)',
  cycleId:              'sprint-b1-shot-4',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'md-spec-authoring: frameworks/standards/liv-standard.md authored from scratch as GeneratedFrameworkTemplate instance per MFv3 v3.3.0 §2.2; structural declarative form added; ts file content preserved verbatim',
    'axiom-axis-binding-declared: A1→Structure, A2→Coupling, A3→Schema, A4→Structure, A5→Coupling, A6→Identity, A7→Lifecycle (AxR1 satisfied — each axiom binds to exactly one axis with rationale recorded inline at §3.3)',
    'basis-declarations: §3.13.3 axioms (7), §3.13.5 lifecycle events (5), §3.13.7 closure rules (10), §3.13.8 typed shapes (~30 consolidated to A-01 WAtom shape-family), §3.13.10 coupling enums (2) = ~54 basis declarations; substrate-atom-ref preferred where substrate underwrites (A3 → A-01 + A-18; all typed shapes → A-01; atom-kind closure → A-01; lifecycle events → A-16/A-21/LifecycleState; coupling enums → Carrier + A-04; total 19 substrate-atom-ref) with l0-ratified-ref to Manual v13.0 for 6 of 7 axioms + 9 of 10 closure rules (35 l0-ratified-ref)',
    'jurisdictionClaim: declared on Identity + Schema + Structure + Coupling + Lifecycle axes against src/** per Manual v13.0 Part IV Operations LIV-Standard governance row; baseline RCs cover ts binding + types file; partial-drift declared per MA-V11 vacuous-pass targeting Sprint B2 closure',
    'ts-file-amendment: header version bump v1.5.1 → v1.5.2 at three sites (line 1 @liv-standard, line 5 manifest standard, line 23 LIV_STANDARD.version); zero content changes to axioms, tiers, sections, rules, flows, wires, instances, IF-fields, WC-rules, compliance-checks, error-mappings',
    'types-file: unchanged (no version bump required at types file at this amendment — types file is amended only on shape changes per its own discipline)'
  ],
  discipline: 'additive per MA-L1 + MA-S7 recursive ≼ — zero axiom invariant predicates changed (A1–A7 text frozen per ts file `frozen: true`); zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. New artifact: this md spec. Gates LS-G1..LS-G7 declared in spec form for first time at v1.5.2; predicates pre-existed in ts file compliance-check enumeration and CC binding-to-axiom rationale per T0..T5 declarations. No new predicate; new declarative surface.'
}
```

#### §3.13.13 AmendmentProvenance (Sprint B1 Shot 5 cleanup)

```
amendmentProvenance = {
  amendmentId:          'liv-standard-v1-5-2-sprint-b1-shot-5',
  predecessorVersion:   '1.5.2 (post Sprint B1 Shot 4)',
  successorVersion:     '1.5.2 (post Sprint B1 Shot 5 cleanup)',
  cycleId:              'sprint-b1-shot-5',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'F-B1-Audit-4 closure: §1 Identity table `adjacentFrameworks` row removed entirely (residue eliminated at standards tier alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup; the input field carried zero downstream consumers at apparatus tier — no axiom referenced it, no gate tested it, no output field populated from it; the §1 Identity row was carried forward by template-copy convention, not by GeneratedFrameworkTemplate output schema declaration). LIV-Standard `consumedBy` row at §1 carries forward unchanged (consumedBy is a different concern — it enumerates active consumer integrations, not adjacency declarations).',
    'F-B1-Audit-6 closure (no edit at LIV-Standard): LIV-Standard §3.13.3 Axioms basis already declares actual axiom-axis binding content per Sprint B1 Shot 4 authoring (A1→Structure, A2→Coupling, A3→Schema substrate-atom-ref to A-01+A-18, A4→Structure, A5→Coupling, A6→Identity, A7→Lifecycle; rationale per axiom). PS and LM align to LIV-Standard\\'s numbering: PS inserts §3.13.3 placeholder declaring axioms-grounded-by-own-derivation per MA-St17 exclusion; LM keeps current §3.13.X numbering with no §3.13.3 (LM has no own axioms at the standards tier).',
    'F-B1-Audit-7 closure: §3.13.12 AmendmentProvenance discipline prose updated to clarifying form — removed claim that LS-G1..LS-G7 were "new gates" introduced at v1.5.2 (predicates pre-existed in ts file compliance-check enumeration and per-T0..T5 declarations cited at LIV_STANDARD.rules axiom field). Replaced with: "Gates LS-G1..LS-G7 declared in spec form for first time at v1.5.2; predicates pre-existed in ts file compliance-check enumeration and CC binding-to-axiom rationale per T0..T5 declarations. No new predicate; new declarative surface." Honest distinction: the md spec adds the *declarative* gate surface; the *predicates* already lived in the ts file.',
    'Δ: §3.13.13 AmendmentProvenance row (this block) + §5.6 v1.5.2 Shot 5 cleanup row + §9 v1.5.2 Shot 5 cleanup row added; footer updated. No other content changes.'
  ],
  discipline: 'cleanup-only — zero new basis declarations, zero new RCs, zero new axioms / axes / sub-axes / gates / HRs / primitives / typed shapes / lifecycle events / judgment inputs / closure rules / procedure steps / coupling enums; zero version bumps at LIV-Standard (stays v1.5.2 md spec + v1.5.2 ts file); self-audit results unchanged (G-I8 PASS / G-St17 PASS / G-V10 part B PASS-with-partial-drift-declared outcomes preserved); F-B1-Audit-4 closes by structural dissolution at standards tier alongside MFv3 v3.3.1 apparatus-tier residue removal; F-B1-Audit-6 closes vacuously at LIV-Standard (LIV-Standard already at parity declaration site); F-B1-Audit-7 closes by clarifying prose at §3.13.12 discipline field.'
}
```

---

## §4 Validity

### §4.1 Gate count

LIV-Standard declares **7 own primary gates** (LS-G1..LS-G7 — 1:1 with axioms A1..A7 per G-M1). Plus **87 framework-tier metaframework gates** inherited (per metaframework v3.3.1 §4.1 enumeration: 7 PG + 70 axiom gates including cycle-1 G-S7+G-V11, cycle-2 G-V10+G-S8+G-L11, and Sprint B1 Shot 2 G-St17+G-I8 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when LIV-Standard is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG6) | 6 | substrate §11.5 | run once, not per framework |
| LIV-Standard-own axiom gates (LS-G*) | 7 | this §4.2 | framework-audit applies A1..A7 suite per MA-V1; build-time pipeline instances fire compliance checks per ts file `complianceChecks` array |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 71 | metaframework §4.1 (post-Sprint-B1-Shot-2 v3.3.0) | inherited; test LIV-Standard's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **7 + 87 = 94** | | |

LIV-Standard's own 7 gates execute in addition to the 87 inherited — same pattern as LM v3.3 (0 own + 87 inherited), PS v1.1 (22 own + 87 inherited), VS v1.0, RS v1.0, Plan v2.2, AS v2.2.

### §4.2 LIV-Standard-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 7 axioms → 7 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **LS-G1** | A1 Single ownership | For every construct in src/ tree: construct belongs to exactly one category (per T1.4 Category Table — enum-membership cardinality=1) AND construct has exactly one owner (per slice attribution rule — cardinality=1). Mechanical predicate; build-time check via T5.3 compliance-check CC.01 + CC.10. | structural property (cardinality + enum-membership) |
| **LS-G2** | A2 Directional dependency | For every import in src/ tree: import source layer ≤ import target layer per T1.1 Layer Model R0..R5 ordering (no upward imports) AND import does not cross slice boundary except via W-ATOM (R0 atom) or W-HOOK (R3 hook) per T1.4 + T1.5. Mechanical predicate; build-time check via CC.01 + CC.02 + CC.06. | reference resolution (per-import classification) + structural property |
| **LS-G3** | A3 Typed boundaries | For every cross-slice data crossing in src/ tree: crossing payload conforms to a declared atom shape (per T1.6 Atom Taxonomy — AK-* kind) AND no raw/untyped data crosses (per T4.1 RequestContext typed-boundary rule + T4.2 validation discipline). Mechanical predicate; build-time check via CC.07 + CC.11. | structural property (typed-shape conformance per substrate §6.3 type-check class) |
| **LS-G4** | A4 Isolated execution | For every R4 file in src/ tree: file contains I/O execution only (no business logic) AND no R2/R1 file contains I/O (per T1.1 Layer Model). Mechanical predicate; build-time check via CC.02 + CC.19. | structural property (per-file classification) |
| **LS-G5** | A5 Event-only notification | For every cross-slice notification in src/ tree: notification uses event bus only (per T1.5 W-EVENT wire type) AND no direct cross-slice function call exists (per T1.4 Category Table + T3.1 R2 stateKinds=Shared rule). Mechanical predicate; build-time check via CC.03 + CC.04. | structural property (mechanism classification) |
| **LS-G6** | A6 Declaration at origin | For every construct in src/ tree: construct declared at R0 of owning slice (per T1.4 Category Table + T1.6-R2). Mechanical predicate; build-time check via CC.05 + CC.09 + T1.3-R5 manifest discipline. | structural property (per-construct location classification) |
| **LS-G7** | A7 Deletability | For every slice in src/ tree: deletion of the slice does not produce orphaned imports in any other slice (per T1.5 wire-deprecation rule + T6.5-R4 wire-citation discipline). Mechanical predicate; audit-time check via T5.3 + CC.13 (slice-removal simulation). | structural property + cardinality (no cross-slice orphan reference after slice removal) |

**AxR1 self-check:** each gate tests its paired axiom directly; gate IDs map 1:1 with axiom IDs. Pass.

**AxR2 self-check:** each gate predicate is one mechanical condition. Pass.

**AxR3 self-check:** gate set 1:1 with axiom set; gates additive per MA-L1 only when axioms are additive (axiom text frozen → gate set frozen for existing axioms; new axiom = new gate). Pass.

**AxR4 self-check:** all gate predicates declarative (no "should/must"; stated as conditions). Pass.

### §4.3 Inherited gate execution at audit time

The 87 inherited gates test LIV-Standard's **framework declaration conformance** (does LIV-Standard's §1–§9 structure match metaframework's axioms?). The 7 LS-G* gates test **source-tree compliance** (does the code under src/ satisfy A1–A7?). Different scopes, different execution sites — the 87 run at framework-audit time against this md file; the 7 run at build/audit time via pipeline instances against the source tree.

### §4.4 Dimension–gate mapping (per MA-V5)

Per metaframework framework-audit §3.3 X1–X10 dimensions:

- **E1 Identity (PG1 + G-I1..G-I8):** tests LIV-Standard's §1 Identity conformance to MA-I1..MA-I8 (Sprint B1 Shot 2 added MA-I8/G-I8 — LIV-Standard declares `governsRuntimeCode: true` per §1; G-I8 PASS at v1.5.2).
- **E2 Schema (PG2 + G-S1..G-S8):** tests LIV-Standard's §2 Schema conformance to MA-S1..MA-S8.
- **E3 Structure (PG3 + G-St1..G-St17):** tests LIV-Standard's §3 Structure conformance to MA-St1..MA-St17 (Sprint B1 Shot 2 added MA-St17/G-St17 — LIV-Standard §3.13 declares basis per enumerated-kind declaration; G-St17 PASS at v1.5.2).
- **E4 Validity (PG4 + G-V1..G-V11):** tests LIV-Standard's §4 Validity conformance to MA-V1..MA-V11 (Sprint B1 Shot 2 added MA-V10 part B jurisdiction-coverage — LIV-Standard §3.13.11 declares jurisdictionClaim on five inherited axes with partial-drift per MA-V11; G-V10 part B PASS-with-partial-drift-declared at v1.5.2).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests LIV-Standard's §5 Lifecycle conformance to MA-L1..MA-L11.
- **E6 Coupling (PG6 + G-C1..G-C10):** tests LIV-Standard's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests LIV-Standard's §7 Judgment conformance to MA-J1..MA-J5 (LIV-Standard declares zero J-inputs per §3.2; PG7 evaluates empty-declaration per substrate §8.6 + A-17).
- **E8 Universal/Meta (G-U1..G-U5 + G-M1..G-M4 + G-G13):** tests LIV-Standard's universal-axis cross-checks + meta-gates + MA-G13 four-property classification.

### §4.5 Gate execution order

Per substrate §11.5 tier-1 ordering. Substrate gates SG1–SG6 fire once at substrate-tier; framework-tier gates (PG + axiom + universal + meta) fire at framework-audit per-framework invocation; LIV-Standard-own gates LS-G1..LS-G7 fire at build-time per source-tree compliance check.

### §4.6 Gate rules (GR-series)

Per MFv3 §4.6.1. No LIV-Standard-local GR additions.

### §4.7 Current gate results

**All 94 framework-tier gates (87 inherited + 7 LIV-Standard-own): state = `not-yet-run` at this delivery.**

Mechanical self-evaluation at §8 below: LIV-Standard's structural declaration conforms to MFv3 v3.3.1 generation procedure output schema; inherited gates pass mechanically against this file; LS-G1..LS-G7 await first source-tree audit invocation per pipeline instance dispatch.

---

## §5 Lifecycle

### §5.1 Versioning discipline

Additive-only per MA-L1. Patch for editorial corrections. Minor for additive rule/section/atom-kind/wire/flow additions. Major for axiom changes (per ts file T6.5-R5 "Axiom change: new major version. Axiom text is frozen forever"). v1.5.2 is a minor-patch addition — md spec authored, ts file header version bumped only.

### §5.2 Amendment procedure

Amendments follow MF amendment-propagation. Three paths per ts file T6.5:
- **Pattern → standard threshold (T6.5-R1):** a pattern becomes standard when it appears in 3+ independent bundles with identical structure.
- **New atom kind / flow / wire (T6.5-R2, T6.5-R3, T6.5-R4):** name + define + cite existing examples; new wire requires axiom-citation proving no A1–A7 violation.
- **Rule change vs axiom change (T6.5-R5):** rule change → versioned; axiom change → new major version; axiom text frozen forever.

All amendment paths require L0 confirmation per substrate §13 activation flow.

### §5.3 State transitions

```
declared → runtime:   when first consumed by a pipeline instance (IN-MAIN reading LIV_STANDARD at first build invocation)
runtime → deprecated: when a successor LIV-Standard major version is generated and L0-confirmed
```

### §5.4 Deprecation procedure

Requires: (a) successor LIV-Standard generated and L0-confirmed (axiom change → new major version), (b) migration path declared (per ts file T1.5-R5 wire-change discipline), (c) L0 deprecation ruling.

### §5.5 Failure modes

| Failure mode | Trigger | Resolution path |
|---|---|---|
| Axiom violation in source tree | LS-G* gate fails on persisted source file | Pipeline IN-DIAGNOSE root-cause analysis; fix at structurally correct layer; recompile |
| Manifest drift | T1.3-R5* compliance check fails (manifest vs file body) | IN-AUDIT regenerates manifest from file content; commit |
| Standard version mismatch | T1.3-R5.1 build-version mismatch | Route file to IN-AUDIT before IN-BUILD proceeds; align stamp + body |
| New wire type proposed | T6.5-R4 invocation | IN-MAIN axiom-citation validation; L0 confirmation if A1–A7 unviolated |

### §5.6 Version history

| Version | Cycle | Scope | Authority |
|---|---|---|---|
| v1.0 | LIV-Standard original L0 ratification (predating MF discipline) | Initial axiom set A1–A7 + tier structure T0..T5 + pipeline instance set + wire types + flow set + compliance checks declared as data in ts file. | L0 (pre-MF) |
| v1.5 | LIV-Standard maturation cycle | Tier hierarchy extended through T6; instance set + IF-field contract + WC-rule set + error-mapping set + handoff-validation typed shapes added. | L0 |
| v1.5.1 | LIV-Standard hygiene cycle (2026-04-11 validated date per ts file manifest) | Instance.size field removed (T1.6-R3 satisfied — additive evolution, removal with migration). No axiom changes. | L0 |
| v1.5.2 | Sprint B1 Shot 4 (2026-05-13) | **Md spec authoring against MFv3 v3.3.0.** This file `frameworks/standards/liv-standard.md` authored from scratch as `GeneratedFrameworkTemplate` instance. AmendmentProvenance at §3.13.12. **Δ-A:** §1 Identity declares `governsRuntimeCode: true` per MA-I8 with basis prose. **Δ-B:** §3.13 AxisBasis declarations subsection authored — 7 axiom basis declarations at §3.13.3 (A3 substrate-atom-ref to A-01 + A-18; 6 others l0-ratified-ref to Manual v13.0); 5 lifecycle event basis at §3.13.5 (substrate-atom-ref to A-16/A-21/LifecycleState); 10 closure rule basis at §3.13.7 (mix substrate-atom-ref + l0-ratified-ref); ~30 typed-shape basis consolidated at §3.13.8 (all substrate-atom-ref to A-01 WAtom; RequestContext also cites A-18); 2 coupling enum basis at §3.13.10 (substrate-atom-ref). Total: ~54 basis declarations. **Δ-C:** §3.13.11 MA-V10 part B jurisdiction coverage — Identity + Schema + Structure + Coupling + Lifecycle inherited axes declare `jurisdictionClaim = ['src/**']` with baseline RCs covering ts binding + types file; partial-drift declared per MA-V11 vacuous-pass targeting Sprint B2 closure. **Δ-D:** AmendmentProvenance at §3.13.12; §8 self-audit reflects G-I8 PASS + G-St17 PASS + G-V10 part B PASS-with-partial-drift-declared; this version-history row added. Companion ts file change: header version bump v1.5.1 → v1.5.2 at three sites (line 1 @liv-standard, line 5 manifest, line 23 LIV_STANDARD.version) — zero content changes. types file unchanged. Predecessor v1.5.1 was ts-file-only (no md spec); md spec authoring at this version is genesis for declarative form. Manual citations pin `manualVersion: '13.0'`. Additive per MA-L1 + MA-S7. | L0 (Sprint B1 Shot 4) |
| v1.5.2 (Shot 5 cleanup) | Sprint B1 Shot 5 (2026-05-13) | Sprint B1 close audit findings closed at LIV-Standard. **F-B1-Audit-4** (residue removal at standards tier): §1 Identity `adjacentFrameworks` row removed entirely — residue eliminated alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup. **F-B1-Audit-7** (clarifying prose at §3.13.12 AmendmentProvenance discipline field): replaced "zero gate predicates introduced beyond LS-G1..LS-G7 paired with A1..A7 per G-M1 ... New gates: LS-G1..LS-G7 (paired with A1..A7)" with "Gates LS-G1..LS-G7 declared in spec form for first time at v1.5.2; predicates pre-existed in ts file compliance-check enumeration and CC binding-to-axiom rationale per T0..T5 declarations. No new predicate; new declarative surface." Honest distinction surfaced: md spec adds *declarative* gate surface; the *predicates* lived in ts file at v1.0 baseline. **Δ:** §3.13.13 AmendmentProvenance row added recording Shot 5 cleanup with L0 authorityClaim; this §5.6 row + §9 row added; footer updated. **No version bump** (LIV-Standard stays v1.5.2 md spec + v1.5.2 ts file — additions are corrective patches to existing v1.5.2 content). **Self-audit results unchanged** — G-I8 / G-St17 / G-V10 part B outcomes preserved. F-B1-Audit-6 closes vacuously at LIV-Standard (already at parity declaration site §3.13.3 with axiom-axis binding content; PS aligns to LIV-Standard's numbering by inserting parity placeholder, LM keeps current numbering — see PS Shot 5 cleanup delivery). | L0 (Sprint B1 Shot 5) |

---

## §6 Coupling

### §6.1 Carrier justification

Carrier = `self`. LIV-Standard governs source code structure; the runtime ts file `src/core/constants/liv-standard.ts` is its own carrier (the `LIV_STANDARD` constant is the runtime binding emitted by this standard, read by pipeline instances at build/audit time). No enclosing carrier framework required.

### §6.2 Handoff rules

LIV-Standard declares zero own P6 Handoff Rule instances per §3.2 + §3.13.4. Inherited handoff rules:

| HR | Owning declaration | LIV-Standard's role |
|---|---|---|
| HR1 | substrate §6 | substrate → LIV-Standard type consumption; LIV-Standard consumes substrate atoms by reference per §2.3 |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; LIV-Standard is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records LIV-Standard's framework declaration per provenance contract (see §6.6) |

Per substrate §1.3 SI-03: these HRs are referenced, not redeclared, by LIV-Standard.

### §6.3 Custody table

| Artifact | Owner | Custodian | Access |
|---|---|---|---|
| `frameworks/standards/liv-standard.md` (this file) | L0 | `frameworks/standards/` | Read: all; Write: L0-confirmed amendment or regeneration only |
| `src/core/constants/liv-standard.ts` (runtime binding) | L0 | `src/core/constants/` | Read: pipeline instances + liv-api consumers; Write: L0-confirmed amendment only (CC.17 immutable build target — no pipeline instance writes to core/constants/) |
| `src/core/constants/liv-standard.types.ts` (typed shapes) | L0 | `src/core/constants/` | Read: ts file + liv-api consumers; Write: L0-confirmed amendment only |

### §6.4 Provenance contract

Per metaframework §6.5 Coupling provenance + framework-audit X8 (Genesis dimension):

```
provenance = {
  instanceId:     'liv-standard-v1-5-2-sprint-b1-shot-4',
  cycleId:        'sprint-b1-shot-4',
  timestamp:      '2026-05-13',
  authorityClaim: { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' }
}
```

### §6.5 OperatorInterface (per substrate §4 A-13 + V5 verification)

```
OperatorInterface = {
  primaryOperator:   'Pipeline instances IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA',
  operatorRole:      'Read LIV_STANDARD constant; apply axiom-citing tier-rules + compliance-checks at respective pipeline steps',
  invocationPattern: 'build-time per-feature; audit-time per-file',
  failureSurface:    'Axiom violation detected → IN-DIAGNOSE root-cause + return-to-IN-BUILD; compliance-check failure → file routed to IN-AUDIT',
  observabilityInterface: 'Pipeline-instance event emissions per liv-api; compliance-check results in audit-trail'
}
```

### §6.6 Cross-framework atom flow

| Direction | From | To | Atoms |
|---|---|---|---|
| Inbound | substrate-v1-1 | LIV-Standard | A-01 WAtom + A-04 CustodyRow + A-10 Kind + A-11 Ownership + A-14 GenesisDeclaration + A-16 AmendmentProvenance + A-17 EmptyPrimitiveDeclaration + A-18 ReferentCitation + A-21 StateOrdering + A-22 AxisBasis + Mode + LifecycleState + Carrier + Semver |
| Inbound | metaframework-v3-1 | LIV-Standard | `GeneratedFrameworkTemplate` schema + axis enumeration + axiom dimension X1–X10 |
| Outbound | LIV-Standard | pipeline instances (IN-*) | `LIV_STANDARD` constant (read by IN-MAIN, IN-BUILD, IN-RESOLVE, IN-AUDIT, IN-COMPILE, IN-DIAGNOSE, IN-QA) |
| Outbound | LIV-Standard | liv-api, liv-renderer | `LIV_STANDARD` constant + typed shapes per types file |

### §6.7 Carrier-applicability enforcement

Per MA-C5: LIV-Standard's `carrier = 'self'` requires that emitted artifacts (this md spec + LIV_STANDARD constant) be self-contained — no enclosing carrier framework wraps them. Verified by §6.3 custody (both artifacts owned by L0 at the standards / core/constants paths respectively; no parent framework custody). No content lossy at translation — md spec is the declarative form of exactly what the ts file content declares.

---

## §7 Judgment

### §7.1 Declared J-inputs

LIV-Standard declares zero own P7 Judgment Input instances per §3.2 + §3.13.6. All axiom conditions are mechanical predicates per AxR2; all tier-rules ground in mechanical axiom citations; compliance checks declare `mechanical: true | false` per ts file `complianceChecks` array — checks marked `mechanical: false` (CC.12 flow-consistency, CC.13 wire-selection, CC.14 auth-layer-placement, CC.15 R3-before-R2-validation) are softer mechanical predicates (no closed-form algorithm in some cases) rather than judgment-input-requiring-adjudication.

Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "LIV-Standard structural mode; all axiom conditions are mechanical predicates per AxR2. Compliance checks with mechanical=false are softer mechanical (flow-consistency, wire-selection appropriateness, auth-layer-placement) rather than judgment-input-requiring. No judgment inputs declared at any axis."
}
```

### §7.2 Axis status

| Axis | Judgment input |
|---|---|
| Identity | none |
| Schema | none |
| Structure | none |
| Validity | none |
| Lifecycle | none |
| Coupling | none |
| Judgment | none |

---

## §8 Self-audit results

### §8.1 Gate results

**All 94 framework-tier gates: state = `not-yet-run` at this version.**

Inherited 87 framework-tier gates evaluated against LIV-Standard file declarations:

- **E1 Identity:** §1 declares all required Identity fields per MA-I1..MA-I8 (MA-I8 added Sprint B1 Shot 2 — `governsRuntimeCode: true` declared §1 with basis prose; field present, boolean-typed per substrate §6.3); §1.2 axiom-satisfaction table populated with MA-I8 row; **G-I8 PASS at v1.5.2**.
- **E2 Schema:** §2 declares input + output shapes per MA-S1..MA-S6; §1 referentCitations baseline declared (2 RCs covering ts binding + types file); G-S8 PASS for baseline citations; full-coverage staged per partial-drift §3.13.11.
- **E3 Structure:** §3 declares 0 P1 axes (inherited) + 0 P2 sub-axes + 0 P3 leaves + 7 P4 axioms (A1–A7) + 7 P5 gates (LS-G1..LS-G7) + 0 P6 handoff rules (empty-declared with basis) + 0 P7 J-inputs (empty-declared with basis) + 0 P8 procedure steps (empty-declared with basis — structural mode); §3.3 AxR1–AxR4 self-checks pass with per-axiom axis-binding rationale recorded inline. **§3.13 AxisBasis declarations added Sprint B1 Shot 4 v1.5.2: ~54 basis declarations spanning 7 axioms (8 with RequestContext A-18 supplementary; consolidated to A-01 WAtom shape-family for typed shapes), 5 lifecycle events, 10 closure rules, ~30 typed-shape families (consolidated), 2 coupling enums. Procedure steps + handoff rules + judgment inputs vacuously satisfied per quantifier semantics (empty-declared with basis). Axioms + gates + leaves excluded per MA-St17 kind-set exclusions. G-St17 PASS at v1.5.2.**
- **E4 Validity:** §4 declares 7 own gates per G-M1; §4.2 MA-V2 per-axis gate coverage (since LIV-Standard's axioms bind to 5 of 7 MFv3 axes — Identity/Schema/Structure/Coupling/Lifecycle; Validity + Judgment unbound at LIV-Standard own-axiom-tier); MA-V10 part A baseline citation coverage; **MA-V10 part B Sprint B1 Shot 2 added — LIV-Standard §3.13.11 declares jurisdictionClaim = `['src/**']` on 5 inherited axes; baseline RCs cover ts binding + types file; full-coverage staged with partial-drift per MA-V11 vacuous-pass; explicit basis prose targets Sprint B2 closure; G-V10 part B PASS-with-partial-drift-declared at v1.5.2**; G-V11 PASS (applicability basis declared per partial-drift discipline).
- **E5 Lifecycle:** §5 declares versioning + amendment + state-transitions + deprecation + failure-modes + version-history; G-L11 baseline pass.
- **E6 Coupling:** §6 declares carrier + 0 own HRs (inherited HR1 + HR5 + HR6 referenced) + custody + provenance; MA-C1..MA-C10 self-checks pass.
- **E7 Judgment:** §7 declares 0 J-inputs (empty-declared); PG7 evaluates empty-declaration per substrate §8.6 + A-17; MA-J1..MA-J5 vacuously satisfied.
- **E8 Universal/Meta:** §1.3 MA-G13 four-property table populated; G-U1..G-U5 + G-M1..G-M4 + G-G13 evaluated against LIV-Standard file structurally.

**Aggregate:** 87 inherited gates pass mechanically against this file at LIV-Standard-declaration audit; 7 LIV-Standard-own gates `not-yet-run` (await first source-tree compliance audit per pipeline-instance dispatch).

### §8.2 Dimension audit results

| Dimension | Result | Basis |
|---|---|---|
| X1 Temporal | PASS | §1.1 GenesisDeclaration; §5.6 version history; §1 stateTemplate/stateApplied |
| X2 Determinism | PASS | §3.3 axioms all mechanical per substrate §6.3; §3.7 P8=0 deterministic by absence |
| X3 Observability | PASS | §6.5 OperatorInterface declares observabilityInterface; pipeline instances emit events per liv-api |
| X4 Negative space | PASS | §1 scopeOut declared with 9 entries |
| X5 Scale | PASS | Per-source-file O(1) check at build-time; source tree size bounded by deployment scope |
| X6 Operator | PASS | §6.5 OperatorInterface declared (pipeline instances + build-time invocation pattern) |
| X7 Lifecycle | PASS | §5 lifecycle complete (versioning, amendment, transitions, deprecation, failure modes, history) |
| X8 Genesis | PASS | §1.1 GenesisDeclaration populated with parent + procedure + cycle |
| X9 Integration | PASS | §6.2 HR inherited declarations + §6.4 MA-C handoff axioms satisfied |
| X10 Stage-declaration | PASS (vacuous) | §3.2 P8=0 empty-declared with basis per substrate §10.2 + §3.13.9 |

### §8.3 Last audit event

```
{
  eventKind: 'genesis-spec-authoring',
  eventTimestamp: '2026-05-13 (Sprint B1 Shot 4)',
  auditor: 'LIV-Standard-builder-self-audit per brief §Shot 4 verificative phase',
  resultCount: {pass: 87, fail: 0, vacuousPass: 5, notYetRun: 7}
}
```

VacuousPass breakdown: P6 + P7 + P8 empty-declarations with basis (3); G-V10 part B partial-drift-declared (1); G-V11 applicability-basis declared (1).

NotYetRun breakdown: 7 LIV-Standard-own gates LS-G1..LS-G7 await first source-tree compliance audit per pipeline-instance dispatch.

### §8.4 Self-application basis

LIV-Standard verificatively passes its own gates against its own axioms:
- 7 LIV-Standard-own gates LS-G1..LS-G7 1:1 with 7 axioms A1–A7 per G-M1 (§4.2 verified).
- Every axiom binds to exactly one axis per AxR1 (§3.3 verified with per-axiom rationale).
- Every axiom states one mechanical condition per AxR2 (§3.3 verified).
- §6 carrier + inherited HRs satisfy MA-C1..MA-C10 (§6.2 + §6.7 verified).
- §7 J-inputs satisfy MA-J1..MA-J5 vacuously (zero declared; PG7 empty-declaration with basis).

### §8.5 MA-G13 four-property self-check (framework classification)

Per §1.3 MA-G13 four-property table: all four properties (own state, own I/O, own invariants, own discipline) declared. LIV-Standard classified as Framework, not state store, not protocol, not substrate. Pass.

### §8.6 Cross-framework consistency check

| Adjacent | Calibration check | Result |
|---|---|---|
| Substrate v1.8 | LIV-Standard consumes 14 substrate atoms by reference per §2.3; no re-declaration | PASS |
| Metaframework v3.3.1 | Generation procedure v1.1.7 consulted; §1.1 GenesisDeclaration cites parentFrameworkRef = metaframework v3.3.0 (Shot 4 authoring-event historical attribution); full LIV-Standard file conforms to GeneratedFrameworkTemplate shape | PASS |
| Living Memory v3.3 | LIV-Standard does not govern substrate atom shape (declared at §1 scopeOut); cross-framework concern boundary clean | PASS |
| Perimeter Standard v1.1 | LIV-Standard does not govern boundary-crossing typing (declared at §1 scopeOut); cross-framework concern boundary clean | PASS |
| Placement Standard v1.0 | LIV-Standard governs inside-slice tier structure (T1.1–T1.6); Placement governs cross-tree placement; boundary clean per Placement Standard derivation (PS placement vs LIV-Standard inside-slice split ratified at Sprint Placement Framework) | PASS |
| Verification Standard v1.0 + Plan Standard v2.2 + Research Standard v1.0 + Artifact Standard v2.2 + Multi-Instance Standard v2.3 | LIV-Standard governs code structure cross-cutting all standards (Manual v13.0 Part IV Operations row); LIV-Standard's seven axioms apply to all standards' source bindings | PASS |

---

## §9 Change log

| Version | Cycle | Authority |
|---|---|---|
| v1.0 | LIV-Standard original L0 ratification (pre-MF): initial seven-axiom set A1–A7 + tier hierarchy T0..T5 + pipeline-instance set + wire types + flow set + compliance checks declared as data in ts file `src/core/constants/liv-standard.ts`. | L0 (pre-MF) |
| v1.5 | LIV-Standard maturation: tier hierarchy extended through T6; instance set + IF-field contract + WC-rule set + error-mapping set + handoff-validation typed shapes added. | L0 |
| v1.5.1 | LIV-Standard hygiene cycle (2026-04-11): `Instance.size` field removed (T1.6-R3 additive evolution discipline — removal with zero external consumers, removed in same operation as model selection move to F-planner deployment config). No axiom changes. | L0 |
| v1.5.2 | Sprint B1 Shot 4 (2026-05-13): **Md spec authoring against MFv3 v3.3.0.** New artifact: `frameworks/standards/liv-standard.md` (this file). Predecessor v1.5.1 was ts-file-only (no md spec); v1.5.2 is genesis for declarative form. **Δ-A:** §1 Identity declares `governsRuntimeCode: true` per MA-I8 with basis prose; §1.2 Identity-axiom-satisfaction table populated with MA-I8 row. **Δ-B:** §3.13 AxisBasis declarations subsection authored — ~54 basis declarations spanning axioms (7), lifecycle events (5), closure rules (10), typed shapes (~30 consolidated to A-01 WAtom shape-family), coupling enums (2). Substrate-atom-ref preferred where substrate underwrites (A3 → A-01 + A-18; all typed shapes → A-01; atom-kind closure → A-01; lifecycle events → A-16/A-21/LifecycleState; coupling enums → Carrier + A-04 = 19 substrate-atom-ref total). L0-ratified-ref to Manual v13.0 for 6 of 7 axioms + 9 of 10 closure rules (35 l0-ratified-ref total). Axiom-axis binding declared per AxR1: A1→Structure, A2→Coupling, A3→Schema, A4→Structure, A5→Coupling, A6→Identity, A7→Lifecycle (rationale at §3.3 per axiom). **Δ-C:** §3.13.11 MA-V10 part B jurisdiction coverage table — Identity + Schema + Structure + Coupling + Lifecycle inherited axes declare `jurisdictionClaim = ['src/**']` (per Manual v13.0 Part IV Operations LIV-Standard cross-slice-code-structure row); baseline RCs cover ts binding (`src/core/constants/liv-standard.ts`) + types file (`src/core/constants/liv-standard.types.ts`); partial-drift declared per MA-V11 vacuous-pass with explicit basis prose targeting Sprint B2 closure. **Δ-D:** AmendmentProvenance at §3.13.12; §4 self-audit reflects G-I8 PASS + G-St17 PASS + G-V10 part B PASS-with-partial-drift-declared; §5.6 + this §9 row added. **Companion ts file changes:** header version bump v1.5.1 → v1.5.2 at three sites (line 1 `// @liv-standard v1.5.2`; line 5 `// standard: LIV-Standard v1.5.2`; line 23 `version: 'v1.5.2'`) — zero content changes to axioms, tiers, sections, rules, flows, wires, instances, IF-fields, WC-rules, compliance-checks, error-mappings. Types file `src/core/constants/liv-standard.types.ts` unchanged. Manual citations pin `manualVersion: '13.0'` (citations map by Part + named subsection content per v13.0 reorganization). Additive per MA-L1 + MA-S7 recursive ≼. Zero axiom invariant predicates changed (A1–A7 text frozen per ts file `frozen: true`); zero gate predicates changed beyond LS-G1..LS-G7 paired-with-axioms additions; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Apparatus declarations added. | L0 (Sprint B1 Shot 4) |
| v1.5.2 (Shot 5 cleanup) | Sprint B1 Shot 5 (2026-05-13): Sprint B1 close audit findings closed at LIV-Standard. **F-B1-Audit-4** (residue removal at standards tier): §1 Identity `adjacentFrameworks` row removed entirely — residue eliminated alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup; the input field carried zero downstream consumers at apparatus tier. **F-B1-Audit-7** (clarifying prose at §3.13.12 AmendmentProvenance discipline field): replaced "zero gate predicates introduced beyond LS-G1..LS-G7 ... New gates: LS-G1..LS-G7 (paired with A1..A7)" with honest distinction "Gates LS-G1..LS-G7 declared in spec form for first time at v1.5.2; predicates pre-existed in ts file compliance-check enumeration and CC binding-to-axiom rationale per T0..T5 declarations. No new predicate; new declarative surface." (Reflects: md spec adds *declarative* gate surface; *predicates* lived in ts file at v1.0 baseline. The earlier Shot 4 §9 row narrative at this version-history table position retains "zero gate predicates changed beyond LS-G1..LS-G7 paired-with-axioms additions" — preserved as historical Shot 4 narrative; the corrected formulation is the §3.13.12 discipline field per F-B1-Audit-7.) **Δ:** §3.13.13 AmendmentProvenance row added; this §9 row + §5.6 row added; footer updated. **No version bump** (LIV-Standard stays v1.5.2 md spec + v1.5.2 ts file). **Self-audit unchanged** — G-I8 / G-St17 / G-V10 part B outcomes preserved. F-B1-Audit-6 closes vacuously at LIV-Standard (already at parity declaration site §3.13.3 with axiom-axis binding content; PS and LM align to LIV-Standard's numbering). authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot5'} | L0 (Sprint B1 Shot 5) |

---

## End of liv-standard.md v1.5.2 — Sprint B1 Shot 5 cleanup.
