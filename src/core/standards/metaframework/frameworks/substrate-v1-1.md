# substrate-v1-1

**Kind:** non-framework (universal declarations)
**Version:** v1.6
**Authority:** L0 confirmed (MF-Cycle-2 Spec↔Referent Alignment Closure delivery)
**Consumed by:** metaframework-v3-1, framework-registry-v1-0, generation-procedure-v1-0, framework-audit-v1-2, amendment-propagation-v1-0, all generated L3 frameworks
**Dependencies:** none (upstream of all frameworks)
**Versioning discipline:** additive only (per S3)

Substrate is the universal declared content consumed by every framework. It declares what exists at the tier above any single framework: structural-identity rules, transformation kinds, decomposition variables, typed atoms, authority levels, judgment mechanics, version coordinates, primitives, terminology, activation flow, and bootstrap.

Substrate consumes no framework. Dependency direction is strictly frameworks → substrate. Circular reference is a structural violation.

---

## §1 Structural-identity declarations

Four distinct substrate items. Each declared with own ID. Previously bundled at v2.5 metaframework §6; split per Phase 1.1 finding F-phase-1-1-A-01.

### §1.1 Item SI-01 — MA-G13 structural-identity invariant

Any declared element with all four of the following is a framework:

1. **Own state** — declared mutable values with declared transitions.
2. **Own I/O** — declared typed input schema and declared typed output schema.
3. **Own invariants** — declared structural-transformation axioms binding state transitions (see §1.2).
4. **Own discipline** — declared procedure or protocol governing operation.

A candidate fails MA-G13 if any of the four is absent or inherited-only.

No framework may contain another framework as a sub-element. Any such sub-element extracts.

### §1.2 Item SI-02 — Kind-of-invariants distinction

"Own invariants" under MA-G13 refers specifically to **structural-transformation invariants** — axioms governing how state, schema, or content change under declared rules.

**Data-integrity invariants** — write-once, consistency, uniqueness, referential integrity — do not qualify as "own invariants" for MA-G13 purposes. They govern data correctness, not transformation structure.

This distinction determines framework-vs-state-store classification:

- A declared element with structural-transformation invariants (plus the other three MA-G13 properties) is a **framework**.
- A declared element with only data-integrity invariants is a **state store**, regardless of whether it has own state, own I/O, and own discipline.

The registry (`framework-registry-v1-0`) is classified as state store by this distinction.

If a state store later gains structural-transformation invariants, it flips to framework classification under this declared rule. Boundary is declarative, not case-law.

### §1.3 Item SI-03 — Permitted-multi-execution rule

A gate is declared once (single source of truth) and may be executed by multiple consumers.

Single declaration preserves: versioning coherence, meaning-ownership, audit trail.
Multiple execution permits: cross-framework validation at distinct touchpoints.

Canonical case: G-U5 provenance completeness is declared in the metaframework and executed by both `framework-audit` (at framework validation) and `amendment-propagation` (at propagation verification).

Multi-execution requires no duplication of the gate declaration. Each execution site references the declaration and logs its execution with timestamp, framework state hash, and result.

### §1.4 Item SI-04 — Four-property criteria

The four properties under MA-G13 are declared as mechanically-testable criteria:

- **Own state criterion:** element declares ≥1 mutable-value field AND ≥1 declared transition rule for each mutable value.
- **Own I/O criterion:** element declares typed input atom (referencing §4) AND typed output atom (referencing §4).
- **Own invariants criterion:** element declares ≥1 structural-transformation axiom binding its state transitions (§1.2 kind-of-invariants applies).
- **Own discipline criterion:** element declares ≥1 procedure, protocol, or ordered step sequence governing operation.

G-G13 (§10) tests all four criteria mechanically per candidate element.

### §1.5 Canonical kind registry

*(Added cycle-1.5 per S6 — Identifier naming function. Declares each element kind, its prefix, its declaration locus, and ordinal-assignment rule. Bare-form citations are canonical only for single-locus kinds; multi-locus kinds carry locus-qualified canonical form everywhere — declarations and citations alike.)*

Every declared element in the metaframework system has canonical ID `<kind>-<locus>-<ordinal>`. `<locus>` is omitted when the kind has exactly one locus.

| Kind prefix | Element kind | Declaration locus | Ordinal rule | Single-locus? |
|---|---|---|---|---|
| `A-` | atom (typed shape) | substrate §4.2 | monotonic at declaration; zero-padded two digits (`A-01..A-09`, `A-10..A-NN`) | yes (locus: `substrate`) |
| `S-` | substrate rule | substrate §10.1 | monotonic (`S1..S6..SN`) | yes (`substrate`) |
| `SI-` | substrate item | substrate §1.1–§1.4 | zero-padded two digits (`SI-01..SI-04`) | yes (`substrate`) |
| `PR-` | primitive rule | substrate §10.2 | monotonic (`PR1..PR5..PRN`) | yes (`substrate`) |
| `P-` | primitive | substrate §8 | monotonic (`P1..P8..PN`) | yes (`substrate`) |
| `SG-` | substrate gate | substrate §11.1 | monotonic (`SG1..SG5..SGN`) | yes (`substrate`) |
| `MA-` | metaframework axiom | spec §3.2 (rendered to metaframework §3.2) | axis-grouped (`MA-I*`, `MA-S*`, `MA-St*`, `MA-V*`, `MA-L*`, `MA-C*`, `MA-J*`, `MA-G13`) | yes (`spec`) |
| `G-` | gate | spec §3.4 (rendered to metaframework §4 + framework-audit §4) | axis-grouped (`G-I*`, `G-S*`, etc.) + universal (`G-U*`) + meta (`G-M*`) + framework-audit-own (`G-FA*`) | yes (`spec`) |
| `PG-` | metaframework procedure gate | metaframework §4 / spec §3.4 | monotonic (`PG1..PG7`) | yes (`metaframework`) |
| `J-` | judgment input | per framework consuming judgment (`J-AP1` at AP §7; `J-FA1..J-FA4` at framework-audit §7) | per-framework + descriptive suffix | no (multi-locus by framework) |
| `HR-` | handoff rule | spec §3.5 (`HR0..HR6`) + framework-internal (`HR-AP3` at AP §3.4) | monotonic per-locus | no (multi-locus by framework) |
| `X-` | framework-audit dimension | framework-audit §3.3 | monotonic (`X1..X10`) | yes (`framework-audit`) |
| `GR-` | gate-rule conformance | framework-audit §4.6.1 | monotonic (`GR-1..GR-6`) | yes (`framework-audit`) |
| `AP-` | amendment-propagation procedure step | AP §3.3 | monotonic (`AP1..AP7`, `AP6.5`) | yes (`amendment-propagation`) |
| `E-` | generation-procedure step | gen-procedure §3.3 | monotonic (`E1..E8`) | yes (`generation-procedure`) |
| `W-` | registry write discipline | registry §4 | monotonic (`W1..W4`) | yes (`framework-registry`) |
| `IG-` | registry data-integrity invariant | registry §8 | monotonic (`IG1..IG5`) | yes (`framework-registry`) |
| `RE-` | RegistryEntry invariant | registry §2.1 | monotonic (`RE1..REN`) | yes (`framework-registry`) |
| `F-` | finding | per audit cycle | monotonic per-cycle (sub-sequence prefix permitted: `F-phase-1-1-A-NN`, `F-phase-1-1-B-NN`, `F-phase-1-1-D-N`, `F-phase-1-1-NN`) | no (loci: `phase-1-1`, `phase-1-2`, `cycle-1`, `cycle-1-5`, `cycle-1-6`, `cycle-2`, future cycles) |
| `R-` | resolution | per derivation cycle | monotonic per-cycle (4-digit ordinal preserved for `phase-1-2`) | no (loci: `phase-1-1-resolution`, `phase-1-2`, `phase-1-2-fix`, `phase-1-2-fix-trail`) |
| `Q-` | cycle question | per cycle | monotonic per-cycle (`Q-cycle-1-1..Q-cycle-1-4`) | no |
| `CFC-` | cross-file-consistency check | reports/phase-9h-cross-file-consistency-report.md | monotonic | yes (`phase-9h`) |

**Locus identifiers (canonical):**

| Locus ID | Refers to |
|---|---|
| `substrate` | substrate-v1-1 |
| `metaframework` | metaframework-v3-1 |
| `spec` | v3-1-spec.md (cycle-agnostic spec content: axioms, gates, judgment-input declarations, handoff rules) |
| `framework-audit` | framework-audit-v1-2 |
| `framework-registry` / `registry` | framework-registry-v1-0 |
| `amendment-propagation` / `ap` | amendment-propagation-v1-0 |
| `generation-procedure` / `gp` | generation-procedure-v1-0 |
| `phase-1-1` | Phase 1.1 audit cycle (v2.5 → v3.0; produced findings in three sub-sequences: numbered Layer 1, A-NN Layer 1 resolution-IDs, B-NN Layer 2, D-N dimension findings) |
| `phase-1-1-resolution` | Phase 1.1 resolution pass (2026-04-21 escalation-resolution-proposal between L0 and manager instance); produced 24 resolution-IDs that closed Phase 1.1 findings |
| `phase-1-2` | Phase 1.2 cycle (substrate v1.0→v1.1; produced R-NNNN resolutions) |
| `phase-1-2-fix` | Phase 1.2-fix delivery |
| `phase-1-2-fix-trail` | Phase 1.2-fix-trail hygiene |
| `phase-9h` | Phase 9h terminal cross-file gate cycle |
| `cycle-1` | MF-Cycle-1 Foundation Closure |
| `cycle-1-5` | MF-Cycle-1.5 Identifier Discipline Closure |
| `cycle-1-6` | MF-Cycle-1.6 Identifier Discipline Corrective (this cycle) |
| `cycle-2` | MF-Cycle-2 Spec↔Referent Alignment Closure |

Locus IDs are stable. Adding a new audit cycle, framework, or derivation cycle adds one row to this registry. Locus IDs do not coincide with filenames (per S5 filename opacity).

**Bare-form vs locus-qualified rule.** For single-locus kinds, the canonical identifier is bare (`A-12`, `MA-S7`, `SG3`, `SI-03`, `PR4`, `X10`, `AP6.5`). For multi-locus kinds, the canonical identifier is locus-qualified (`F-cycle-1-12`, `F-phase-1-1-12`, `R-phase-1-2-0015`, `R-phase-1-1-resolution-12`, `Q-cycle-1-2`). The canonical form is the same in declarations and citations; identifiers do not change form by context. Pre-cycle-1.5 canonical rendered Phase 1.1 resolutions and substrate atoms with the same bare `A-NN` form due to historical convention; the cycle-1.6 sweep separates them per kind, with substrate atoms (`A-NN`) and Phase 1.1 resolutions (`R-phase-1-1-resolution-NN`) carrying their distinct canonical forms. SG5 (§11.1) tests every identifier instance in every file against this rule.

---

## §2 Modes

### §2.1 Declaration

A Mode is an input → output transformation kind. It classifies any unit of work.

Four Modes exist. No others permitted under v1.0.

### §2.2 Mode enumeration

| Mode | Signature | Description |
|---|---|---|
| `epistemic` | unknown → known | Discovery, identification, investigation. Produces knowledge where none existed. |
| `structural` | known → structured | Organization, decomposition, classification. Produces ordered representation of known content. |
| `generative` | structured → produced | Production, construction, synthesis. Produces artifacts from structured inputs. |
| `verificative` | produced → verified | Validation, audit, conformance checking. Produces validity judgments on produced artifacts. |

### §2.3 Shape

```
Mode = 'epistemic' | 'structural' | 'generative' | 'verificative'

ModeSignature = {
  inputKind: string,   // what kind of content this Mode consumes
  outputKind: string   // what kind of content this Mode produces
}
```

### §2.4 Mode binding

Every framework declares exactly one Mode in its Identity axis (per metaframework axiom MA-I1). Every procedure step in a generative-mode framework operates under the framework's declared Mode.

### §2.5 Mode applicability to work

Every unit of work classifies into exactly one Mode. Multi-Mode classification is a violation; compound work decomposes into Mode-classified components.

---

## §3 Universal Variables

### §3.1 Declaration

Universal Variables are the four orthogonal properties every unit of work expresses.

Four variables exist. No others permitted under v1.0.

### §3.2 Variable enumeration

| Variable | Captures |
|---|---|
| `Temporal` | Identity across time (versioning). When this thing exists and how it changes across versions. |
| `Categorical` | Identity across axes (classification). What kind of thing this is. |
| `Relational` | Dependency order between units (sequencing). What this depends on and what depends on it. |
| `Positional` | Current state of a unit (status). Where this thing currently sits in its lifecycle. |

### §3.3 Shape

```
UniversalVariable = 'Temporal' | 'Categorical' | 'Relational' | 'Positional'
```

### §3.4 Orthogonality

The four variables are orthogonal. No variable captures content another variable captures. Every unit of work expresses all four independently.

### §3.5 Consumption pattern

Frameworks decompose axes using Universal Variables. An axis expressed across all four variables produces a four-cell row. Individual frameworks declare their per-axis variable content in their Structure section.

---

## §4 Atoms

### §4.1 Declaration

Atoms are typed shapes referenced by any framework's schema. Declared once at substrate. Consumed by reference. Never redeclared.

Nine atoms exist in v1.0. Five additional atoms added in v1.2 (A-10..A-14 per R-phase-1-2-0015 type-promotion resolution). Three additional atoms added in v1.3 (cycle-1: A-15 GateIdSet per F-cycle-1-14, A-16 AmendmentProvenance per F-cycle-1-12, A-17 EmptyPrimitiveDeclaration per F-cycle-1-7) plus A-05 in-place rename (`ProvenanceRow` → `OriginProvenance` per F-cycle-1-12; semantic clarification only). v1.4 (cycle-1.5): A-17 `primitiveKind` field genericized to `PrimitiveKindRef` reference type — shape-preserving per MA-S7 (no atom add, no atom remove). Three additional atoms added in v1.6 (cycle-2: A-18 ReferentCitation, A-19 ReferentAlignmentState, A-20 ReferentSnapshot per spec↔referent alignment closure; A-18 carries inline `ExpectedShape` discriminated-union sub-shape per A-17/PrimitiveKindRef sub-shape precedent). Total: 20 atoms at v1.6. New atoms added additively per S3.

### §4.2 Atom enumeration

**A-01 — WAtom**
A wire-atom: a typed shape crossing a framework boundary.
```
WAtom = {
  id: string,          // stable identifier, unique in substrate consumer registry
  kind: string,        // atom kind (e.g., 'MetaframeworkInput', 'GeneratedFrameworkTemplate')
  shape: unknown,      // typed shape declared by owning framework
  version: Semver
}
```

**A-02 — AxiomRef**
```
AxiomRef = {
  frameworkId: string,
  axiomId: string,     // e.g., 'MA-I1'
  version: Semver
}
```

**A-03 — HandoffContract**
```
HandoffContract = {
  from: FrameworkRef,
  to: FrameworkRef,
  carrier: Carrier,
  contract: string     // declared invariant text
}
```

**A-04 — CustodyRow**
```
CustodyRow = {
  atomId: string,
  ownerFrameworkId: string,
  layer: string        // e.g., 'substrate/§4', 'metaframework/Structure'
}
```

**A-05 — OriginProvenance** (in-place rename from `ProvenanceRow` per cycle-1 F-cycle-1-12; semantic clarification only — shape unchanged. Distinguishes origin-time provenance from amendment-time provenance per A-16 below.)
```
OriginProvenance = {
  fieldPath: string,
  derivedFromStep?: string,
  judgmentId?: JudgmentId,
  derivedFromSubstrate?: string
}
```
Exactly one of the three `derivedFrom*` fields populated per row. Null permitted only for grandfathered pre-MF artifacts with explicit grandfathering basis.

**A-06 — AxisRef**
```
AxisRef = {
  frameworkId: string,
  axisId: string,
  version: Semver
}
```

**A-07 — SubAxisRef**
```
SubAxisRef = {
  frameworkId: string,
  axisId: string,
  subAxisId: string
}
```

**A-08 — LeafRef**
```
LeafRef = {
  frameworkId: string,
  axisId: string,
  subAxisId?: string,
  leafId: string
}
```

**A-09 — FrameworkRef**
```
FrameworkRef = {
  id: string,
  version: Semver
}
```

**A-10 — Kind** (promoted Phase 1.2 per R-phase-1-2-0015 resolution; previously inline at metaframework §3.5)
```
Kind = 'Framework' | 'State-store' | 'Protocol' | 'Substrate'
```
Declared at substrate tier because Kind is consumed by metaframework (§1 Identity + MA-G13 classification), framework-audit (§3.3 X1 identity dimension), framework-registry (§2.1 RegistryEntry), and all frameworks at §1 Identity. Single-source declaration per S1.

**A-11 — Ownership** (promoted Phase 1.2 per R-phase-1-2-0015 resolution; previously inline at metaframework §3.5)
```
Ownership = {
  template: 'L0' | 'Human',
  applied: 'System' | 'L0'
}
```
Template ownership governs who authors; applied ownership governs who operates. Consumed by metaframework (§1 Identity), all L2 frameworks (§1 Identity), and framework-audit (§3.3 X1 identity dimension tests ownership presence).

**A-12 — ActivationTrigger** (promoted Phase 1.2 per R-phase-1-2-0015 resolution; previously inline at metaframework §2.1 + spec §3.3)
```
ActivationTrigger = {
  initiator: AuthorityClaim,         // L0 or escalated authority
  concurrencyPolicy: 'wait' | 'reject',
  operationName: string
}
```
Declared at substrate tier because activation triggers cross the metaframework / generation-procedure / framework-audit boundary via HR2/HR3/HR4. Consumed by metaframework (§2.1 MetaframeworkInput), generation-procedure (§2.1 input), framework-audit (§2.1 AuditRequest pattern), amendment-propagation (§2.1 AmendmentEvent pattern).

**A-13 — OperatorInterface** (promoted Phase 1.2 per R-phase-1-2-0015 resolution; previously inline at metaframework §3.5)
```
OperatorInterface = {
  invocationEntry: string,           // declared entry point (e.g., 'HR0', 'HR2-receive')
  outputRetrieval: string,           // declared retrieval path (e.g., 'registry lookup post-HR5')
  auditQuery: string,                // declared audit surface (e.g., 'HR3 path')
  runtimeState: 'declared' | 'implemented'
}
```
Per V5 verification. Operator-facing surface contract. Consumed by all L2 frameworks (§6.8 OperatorInterface declaration). Runtime implementation deferred post-9g per §7 P4 runtime open items; declaration-only at delivery.

**A-14 — GenesisDeclaration** (promoted Phase 1.2 per R-phase-1-2-0015 resolution; previously inline at metaframework §3.5)
```
GenesisDeclaration = {
  bootstrapped: boolean,
  genesisEvent: string              // substrate §14 reference or generation-procedure version ref
}
```
Declared at substrate tier because MA-L7 bootstrap non-re-entrancy references GenesisDeclaration across all frameworks. Consumed by metaframework (§1 Identity), all L2 frameworks (§1 Identity), framework-audit (§3.3 X8 bootstrapping dimension).

**A-15 — GateIdSet** (lifted to substrate cycle-1 per F-cycle-1-14; previously declared at metaframework §6.5 as `MetaframeworkGateIdSet`. Renamed to generic `GateIdSet` to reflect framework-agnostic consumption.)
```
GateIdSet = string[]      // enumerated gate IDs for any framework
```
Declared at substrate tier because the gate-ID-enumeration shape is consumed by metaframework (§4.7 framework-tier gate set), framework-audit (§4.3 inherited-gate enumeration), amendment-propagation (§4.3 inherited-gate enumeration), and generation-procedure (§4.1 gate basis). Single-source declaration per S1. Metaframework's `MetaframeworkGateIdSet` becomes a derived consumer-instance of this atom (renders the metaframework framework-tier gate enumeration).

**A-16 — AmendmentProvenance** (new cycle-1 per F-cycle-1-12; companion to A-05 OriginProvenance.)
```
AmendmentProvenance = {
  amendmentId: string,                                                     // links to AmendmentEvent
  fieldPath: string,                                                       // which field was amended
  amendedAt: string,                                                       // ISO timestamp
  prevValueRef?: string,                                                   // optional reference to prior state
  basis: string,                                                           // structural justification for amendment
  amendmentTrigger: 'vision' | 'gap' | 'L0-directive' | 'first-run'        // extended enum per F-cycle-1-6 audit fix
}
```
Two-tier provenance separation: A-05 OriginProvenance captures origin-time derivation (one row per field, populated at first generation). A-16 AmendmentProvenance captures per-amendment delta records (list, empty at origin, appended on each amendment). Consumers (registry RegistryEntry, framework-audit G-U5, amendment-propagation PropagationTrace) read both atoms per concern. The `'first-run'` trigger extension supports the first-run-execution lifecycle event (F-cycle-1-11 / metaframework §5).

`AmendmentLogEntry` (declared at framework-registry-v1-0 §2.4) is a typedef alias of A-16 AmendmentProvenance per cycle-1 F-cycle-1-3 audit fix — single-source-declared at substrate, alias resolves transparently. Existing AmendmentLogEntry citations remain valid.

**A-17 — EmptyPrimitiveDeclaration** (new cycle-1 per F-cycle-1-7; tightens substrate §8.6 empty-declaration marker shape. Genericized cycle-1.5: `primitiveKind` typed as `PrimitiveKindRef` reference type instead of hardcoded enum, per S6 + MA-S7 — adding a new primitive kind via PR2 additive versioning must not force shape edit on A-17.)
```
EmptyPrimitiveDeclaration = {
  primitiveKind: PrimitiveKindRef,  // reference to a primitive kind declared at substrate §8; enum extends additively per PR2
  instanceCount: 0,
  basis: string                     // length ≥ 1; structural justification for empty
}

PrimitiveKindRef = string            // value resolves to a primitive-kind identifier declared at substrate §8 (currently 'P1'..'P8'); reference-resolution class per §6.3
```
Substrate §8.6 amended to reference A-17 as the declared shape for empty-primitive markers. G-U4 predicate amended (substrate §11.3): for each primitive Pn declared empty, marker conforms to A-17 typed shape with `primitiveKind` resolving to a §8-declared kind (not arbitrary `{emptyDeclared: true}` object). Type-check + cardinality + reference-resolution classes per substrate §6.3 cover this mechanically.

**A-18 — ReferentCitation** (new cycle-2 per F-cycle-2 spec↔referent Categorical alignment closure; declares a citation from a framework's typed shape declaration to a referent at a resolvable path. Carries inline `ExpectedShape` discriminated-union sub-shape per A-17/PrimitiveKindRef sub-shape precedent — sub-shape declared in parent atom's body, named separately for citation as `A-18.ExpectedShape`, not promoted to its own A-NN entry.)
```
ReferentCitation = {
  citationId: string,                 // stable identifier within citing framework
  citingFrameworkRef: FrameworkRef,
  atomName: string,                   // name of the typed shape declared in citing framework
  referentKind: 'code' | 'data' | 'spec',
  path: string,                       // resolvable referent path (slice-relative; resolver consumes)
  expectedShape: ExpectedShape        // typed shape claim per kind
}

ExpectedShape =
  | { kind: 'union-string-literal'; values: string[] }
  | { kind: 'union-discriminated-object'; discriminantField: string; arms: { discriminantValue: string; fieldNames: string[] }[] }
  | { kind: 'object'; fieldNames: string[] }
  | { kind: 'enum-const'; values: (string | number | boolean)[] }
```
**ExpectedShape closure rule:** the four shape kinds enumerate the cases observed across MF + L3 vocabulary tables at v3.2.6 baseline. Kind set is additive per S3 + MA-S7 (recursive scope per metaframework §3.2.1 amendment); new kinds enter via substrate amendment when an L3 framework declares a citation that doesn't fit. Adding a new kind = adding an arm to the discriminated union, which the recursive MA-S7 predicate accepts as additive.

**ReferentResolver interface** (declared as part of A-18 usage contract; substrate declares the interface, not the implementation):
```
ReferentResolver = (citation: ReferentCitation, snapshotRef: ReferentSnapshot) => string | null
```
Returns absolute path to referent within the snapshot, or `null` if unresolvable. Consumer-framework-declared (each consumer declares its own per its R-layer rules).

Custody: substrate (declared once; consumed by reference per §4.3). Consumed by all frameworks declaring referent citations; consumed by framework-audit at G-V10 execution surface.

**A-19 — ReferentAlignmentState** (new cycle-2; truth-value/applicability/execution split per cycle-1 F-cycle-1-3 + F-cycle-1-8 discipline.)
```
ReferentAlignmentState = {
  citationRef: ReferentCitation,
  truthValue: 'aligned' | 'drifted' | null,    // null when applicability='n/a' or executionState='not-yet-run'
  applicability: 'applicable' | 'n/a',
  executionState: 'not-yet-run' | 'executed',
  evaluatedAt: string,                         // ISO timestamp
  snapshotRef: ReferentSnapshot,
  driftDetail: string | null,                  // populated when truthValue='drifted'
  basis: string | null                         // populated when applicability='n/a' (per S4 + MA-V11)
}
```
Conformance with cycle-1 truth-value/applicability/execution discipline: truth-value field is binary (`aligned | drifted`) per §10.1 S4 (gate truth-value binary; null only when not applicable or not executed); applicability split from truth-value per F-cycle-1-3 GateResult/DimensionResult decomposition; basis required when applicability='n/a' per MA-V11; executionState typed lifecycle field per F-cycle-1-11 first-run-execution event.

State semantics:
- `applicability='applicable' ∧ executionState='executed' ∧ truthValue='aligned'` — referent at cited path resolves and structurally matches expectedShape.
- `applicability='applicable' ∧ executionState='executed' ∧ truthValue='drifted'` — referent resolves but does not structurally match. driftDetail populated.
- `applicability='n/a'` — referent does not resolve at cited path, OR no parser registered for referentKind. Basis populated.
- `executionState='not-yet-run'` — alignment not yet evaluated for this audit run.

Custody: substrate. Produced by framework-audit G-V10 per audit run; consumed by lifecycle queries answering "is this spec aligned with its referent."

**A-20 — ReferentSnapshot** (new cycle-2; typed-atom decoupling of snapshot identity from audit-run state per cycle-1 G5 no-conflation.)
```
ReferentSnapshot = {
  snapshotId: string,                                    // stable identifier
  snapshotKind: 'git-commit' | 'file-md5-set' | 'version-tag',
  identifier: string,                                    // commit hash | md5 manifest | version tag string
  timestamp: string                                      // ISO; when snapshot was captured
}
```
**snapshotKind closure rule:** three kinds enumerated at cycle-2 baseline. Additive per S3 + MA-S7 (recursive); new snapshot kinds enter via substrate amendment when needed. The opaque `identifier` field carries kind-specific resolution semantics (git-commit identifier resolves via git; file-md5-set identifier resolves via md5 manifest; version-tag identifier resolves via registry version lookup).

Custody: substrate. Consumed by framework-audit (audit runs stamp snapshot ref); consumed by A-19 ReferentAlignmentState (each alignment evaluation tied to a snapshot).

### §4.3 Atom usage

Every atom referenced by any framework is consumed by reference through the atom's ID. Redeclaration violates S1 and triggers SG2/SG3 failure.

Every atom has declared custody in the owning framework's Coupling axis or in §11 consumer registry.

---

## §5 Authority levels

### §5.1 Declaration

Authority levels declare who can confirm what. Four levels exist. L-hierarchy is strict: higher levels confirm lower-level claims; lower cannot override higher.

### §5.2 Level enumeration

| Level | Identity | Scope |
|---|---|---|
| **L0** | Root declarative authority (human founder). | Confirms all structural decisions. Source of L1 instructions. |
| **L1** | Declared instruction from L0 codified as protocol. | Work Protocol, meta-framework generation protocol. Universal within declared scope. |
| **L2** | Metaframework-tier content. | The metaframework, substrate, adjacent L2 frameworks. Governs framework production and validation. |
| **L3** | Framework-tier content. | Domain-specific frameworks produced by or conforming to L2. |

### §5.3 Shape

```
AuthorityLevel = 'L0' | 'L1' | 'L2' | 'L3'

AuthorityClaim = {
  level: AuthorityLevel,
  confirmedBy: string,
  timestamp: string
}
```

### §5.4 Authority binding

Every framework declares its Level in Identity axis (per MA-I3). Every confirmation event carries an AuthorityClaim.

### §5.5 Escalation to L0

Escalation paths declared in lifecycle (per MA-L4) terminate at L0 when no lower authority can resolve.

---

## §6 Judgment shape

### §6.1 Declaration

Judgment is a typed, ID'd, criteria-bounded input used where mechanical derivation is not declared.

Universal: any framework with non-mechanizable steps or derivations declares judgment inputs at the point of non-determinism. Judgment does not license arbitrariness — it scopes non-determinism with declared criteria and records provenance.

### §6.2 Shape

```
JudgmentId = `J-${string}`
// Format convention: J-{step-number}-{short-name}

JudgmentKind =
  | 'enumeration'
  | 'decomposition'
  | 'derivation'
  | 'classification'
  | 'selection'

Criterion = {
  id: string,
  predicate: string,    // mechanically-testable condition — see §6.3 ground
  mechanical: true      // invariant
}

Judgment = {
  id: JudgmentId,
  kind: JudgmentKind,
  input: unknown,
  criteria: Criterion[],
  provenance: JudgmentProvenance
}

JudgmentProvenance = {
  instanceId: string,
  cycleId: string,
  timestamp: string,
  consumingFrameworkRef: FrameworkRef,
  consumingStepId: string
}
```

### §6.3 Mechanical-criterion ground (per R-phase-1-1-resolution-12)

A criterion is **mechanical** iff its predicate is expressible as one of:

- **Type-check:** `typeof x === T` or `x instanceof T` against a declared atom shape.
- **Enum membership:** `x ∈ S` where S is a declared enum literal set.
- **Reference resolution:** `x` is an ID that resolves to a declared element in substrate or named framework (deterministic lookup with yes/no result).
- **Structural property:** declared predicate over an atom's shape (e.g., "every field of atom A has declared custody in §11") where the predicate reduces to the above three via finite traversal.
- **Cardinality:** `|S| op N` where op ∈ {=, ≤, ≥, <, >} and N is a declared constant.
- **Deterministic-function result:** evaluation of a declared pure function with declared signature producing a typed result. Where the function tests a gate-tier predicate, the result expresses binary truth-value with orthogonal applicability/lifecycle fields per framework-audit-v1-2 §8.1 GateResult schema (per §10.1 S4). Ternary collapsing of orthogonal result fields into a single enum is prohibited.

Criteria not reducible to the above classes are **not mechanical** under §6.3 and are themselves judgment requiring own declaration.

G-J2 (tests MA-J2 "criteria are mechanical") runs by checking every declared criterion against the six-class taxonomy. Criteria outside the taxonomy fail G-J2.

### §6.4 Judgment lifecycle

When a step's kind flips from `judgment-input` to `mechanical`:

- Judgment ID marked deprecated (not removed — additive per S3).
- Former criteria become the mechanical derivation rule.
- Framework lifecycle records the flip with timestamp and replacing-derivation reference.
- Prior frameworks that consumed the judgment are re-audited against the new mechanical derivation.

### §6.5 Provenance completeness

Every judgment instance carries JudgmentProvenance. Anonymous judgment fails G-J3 (MA-J3).

---

## §7 Semver

External reference. Substrate pins conformance pattern, does not define semantics.

```
Semver = string  // matches /^v\d+\.\d+(\.\d+)?$/
SemverAuthority = 'external:semver.org'
```

Version strings conform to the regex. Every versioned element carries a Semver. Transitions additive per S3 at substrate tier and MA-L1 at framework tier.

---

## §8 Primitives (P1–P8)

### §8.1 Declaration

Primitives are the structural elements every framework is built from. Seven universal + one conditional (Mode = generative).

### §8.2 Universal primitives (P1–P7)

**P1 — Axis.** Top-level concern; MECE over "what this framework is about."
```
AxisPrimitive = {
  id, name, concern,
  subAxes?: SubAxisPrimitive[],
  leaves: LeafPrimitive[]
}
```

**P2 — Sub-axis.**
```
SubAxisPrimitive = { id, name, concern, leaves: LeafPrimitive[] }
```

**P3 — Leaf.** Atomic property captured by one function signature.
```
LeafPrimitive = {
  id, name,
  atomicity: 'property' | 'descriptor' | 'axiom',
  shape: unknown
}
```

**P4 — Axiom.** Declared invariant, one mechanical condition stated directly.
```
AxiomPrimitive = {
  id, attachedTo, condition, governedBy: Mode
}
```

**P5 — Gate.** Mechanical test of declared axiom.
```
GatePrimitive = {
  id, tests, mechanical, criteria?
}
```

**P6 — Handoff rule.**
```
HandoffRulePrimitive = {
  id, direction, carrierApplicability, invariant,
  captureShape?: CaptureShape,
  diagnosticSignificance: boolean
}

CaptureShape = {
  capturedFields: string[],       // declared field names captured at handoff
  captureTarget: 'registry' | 'audit-trail' | 'custom',
  queryInterface?: string         // reference to declared query mechanism
}
```

`captureShape` optional; null/absent means no capture declared at this handoff. `diagnosticSignificance` required; framework declares whether the handoff is diagnosis-load-bearing.

**P7 — Judgment input.**
```
JudgmentInputPrimitive = {
  id: JudgmentId,
  consumedBy,
  shape: Judgment
}
```

### §8.3 Conditional primitive (P8)

**Stage enum (consumed by P8.stage).**
```
Stage =
  | 1  // judgment intake — judgment inputs declared and bound to consuming steps
  | 2  // mechanical derivation — steps of kind 'mechanical' execute against substrate + judgment inputs
  | 3  // mechanical validation — gates execute against produced state
  | 4  // judgment observation — judgments depending on produced state evaluate
  | 5  // handoff — output handed to next operation per declared handoff rule

StageContentKind = {
  1: 'judgment-input',
  2: 'mechanical',
  3: 'gate-execution',
  4: 'judgment-input',
  5: 'mechanical'
}
```

Ordering semantics: Stage N precedes Stage N+1 within a single operation. Steps within a stage retain `order` for fine-grained sequencing.

**P8 — Procedure step.** Mode = generative only.
```
ProcedureStepPrimitive = {
  id, order, stage: Stage,
  kind: 'mechanical' | 'judgment-input' | 'gate-execution',
  input, output,
  derivation?,       // required if kind = 'mechanical'
  judgmentInputRef?, // required if kind = 'judgment-input'
  gates              // required if kind = 'gate-execution' (populated with tested axiom/invariant refs)
}
```

Non-generative frameworks have no P8 instances. P8 is absent, not empty.

### §8.4 Primitive relationships

- Axis contains Sub-axes (optional) and Leaves (required).
- Axiom governs Axis, Sub-axis, or Leaf.
- Gate tests Axiom.
- Handoff rule governs cross-framework atom consumption or carrier semantics.
- Judgment input populates Procedure step or Axiom derivation.

### §8.5 Primitive instantiation

Substrate declares **what primitive kinds exist**.
Each framework declares **its instances** of each primitive kind.

### §8.6 Empty-declaration derivation (per R-phase-1-1-resolution-23, tightened cycle-1 per F-cycle-1-7)

A framework's primitive-instance set may be empty for certain primitives. Empty is permitted; implicit-absence is not. Derivation:

- Primitive kind P exists at substrate §8.
- Framework F may declare **zero instances** of P.
- Zero-instance state is captured by a positive-declaration marker conforming to atom A-17 (`EmptyPrimitiveDeclaration`, declared §4.2).
- Marker shape: `{primitiveKind: P, instanceCount: 0, basis: string}` per A-17 — basis is the declared structural reason (e.g., "fully mechanical — no P7 instances required"); basis length ≥ 1 mechanically enforced.

Empty-declaration rule is thereby derived from primitive-instance cardinality plus typed-shape positive-declaration marker. Not a separate hand-written rule — a consequence of PR1 (primitive traceability) requiring every primitive kind's instance count be declared, not inferred. G-U4 (§11.3) tests A-17 typed-shape conformance per empty marker.

Framework files that apply this rule:
- §7 Judgment in every framework: zero-instance state declared as "No judgment inputs. This framework is fully mechanical."
- Any axis with zero Sub-axis instances: declared as "No sub-axes."

Rule declared once at substrate; framework files consume by reference.

---

## §9 Terminology

### §9.1 Declaration

Every term used across frameworks has declared home. This section declares substrate-tier terms; framework-tier terms are declared in their owning framework's Structure section.

### §9.2 Substrate-declared terms

**Carrier** (per R-phase-1-1-resolution-04)
```
Carrier = 'self' | 'named' | 'none'
```
Declared at substrate tier because Carrier is universal across all frameworks (every framework has carrier value in its Coupling axis).

- **self**: framework emits own artifact; owns emission mechanics.
- **named**: framework emits via named external carrier; emission contract declared in handoff.
- **none**: framework emits AxiomRef[] only; no emission mechanics.

**Carrier applicability semantics** (per R-phase-1-1-resolution-13, R-phase-1-1-resolution-17)
Carrier applicability in handoff rules is declared per-handoff as one of:

| Applicability value | Meaning |
|---|---|
| `['self']` | Handoff applies only when consuming framework's carrier = 'self' |
| `['self', 'named']` | Handoff applies when carrier ∈ {self, named}; carrier=none skips |
| `['self', 'named', 'none']` (= `all`) | Handoff applies regardless of carrier |
| `['none']` | Handoff applies only when carrier = 'none' |
| (other combinations as declared) | Explicit enumeration |

Shorthand `'all'` is declared equivalent to `['self', 'named', 'none']`.

Carrier=none handoff is a declared table-row case, not a prose note: for any handoff with `['self', 'named', 'none']`, the carrier=none execution skips handoffs requiring artifact emission (HR2 procedure invocation, HR3 audit invocation) and executes handoffs governing declaration relationships (HR1 substrate, HR4 propagation, HR5 registry).

**Cross-axis invariant** (per R-phase-1-1-resolution-05)
A rule declared at substrate or framework tier that binds content across two or more declared axes. Distinct from axis-bound axioms (which attach to one axis per PG3).

Canonical cases:
- MA-G13 (cross-axis at framework tier — governs Identity + Structure + Schema + Lifecycle jointly).
- G-U1 through G-U5 (cross-axis universal gates — test invariants spanning multiple axes).

Cross-axis invariants are declared either at substrate (universal) or at framework's Validity axis (framework-specific). Never attached to a single axis.

**Non-framework file** (per R-phase-1-1-resolution-19)
A file declared at substrate tier with non-framework kind. Non-framework files (substrate, registry) have:

- Own content (declarations or state).
- Own invariants (data-integrity or universal-declaration kind per §1.2).
- No framework-kind axes (no Identity/Schema/.../Judgment seven-axis structure).
- May have own gates; gates test content integrity, not framework-kind axioms.

Substrate gates (SG1–SG5) and registry gates (declared at registry §8) are permitted under this rule. Non-framework file having gates is not an ambiguity — gates test non-framework content per non-framework rules.

**File-shape applicability rule** (per R-phase-1-1-resolution-18)
File shapes are governed by file kind declared at substrate:

- **Framework files** (Mode = any, Kind = Framework): universal framework-file shape (nine sections: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment, Self-audit, Change log).
- **Non-framework files** (Kind = non-framework): content-specific shape declared at the file's substrate declaration or at the file itself.

File kind is itself a declared field; no file is shape-less.

**LifecycleState** (per Phase 1.2 closure R-phase-1-2-0004 resolution)
```
LifecycleState = 'declared' | 'applied' | 'terminated' | 'deprecated'
```
Declared at substrate tier because LifecycleState is consumed by framework-registry (§2.3), metaframework (§1 Identity + §3.5 Vocabulary), framework-audit (§3.3 X9), and v3-1-spec (§7.4 spec-lifecycle mapping). Unifies 4 extant enum shapes pre-Phase-1.2 into single canonical declaration per S1.

- **declared**: element registered; not yet invoked / applied.
- **applied**: element in active use (post first invocation / post confirmation gate).
- **terminated**: element retired from active use with declared basis; historical state retained.
- **deprecated**: element flagged for removal; successor declared or migration path documented.

Framework-specific lifecycle extensions (e.g., `{draft, canonical, retired}` nomenclature at framework-audit §3.3 X9) declared as extensions to this canonical enum per S1+S3 (additive per-consumer, no substitution). Extension declaration sites are tested by X9 per framework-audit §3.3.

---

## §10 Substrate rules

### §10.1 S-series

- **S1.** Substrate declares once. Consumers reference by identifier.
- **S2.** Substrate references no framework. Dependency direction strictly frameworks → substrate.
- **S3.** Substrate is additively versioned. Removal without migration forbidden.
- **S4.** *Gate truth-value binary* (added v1.3, cycle-1 F-cycle-1-4). For every gate (substrate-tier, framework-tier, or framework-local), `truthValue ∈ {'passed', 'failed', null}` where null indicates not-yet-executed. Applicability and lifecycle are expressed via orthogonal fields per framework-audit-v1-2 §8.1 GateResult schema (decomposed cycle-1). Ternary collapsing of orthogonal fields (truth × applicability × lifecycle into a single enum) is prohibited.
- **S5.** *Filename opacity* (added v1.3, cycle-1 F-cycle-1-5). Filename slugs (e.g., `metaframework-v3-1.md`, `substrate-v1-1.md`) are opaque labels for filesystem addressing. The Identity-declared Semver in each file's §1 Identity is the canonical version for version arithmetic, comparison, and amendment. Filename slugs are not updated when internal Semver changes; renames are governed separately and require AmendmentEvent per MA-L4.
- **S6.** *Identifier naming function* (added v1.4, cycle-1.5). Every declared element in the metaframework system has canonical ID `<kind>-<locus>-<ordinal>`, where:
  - `<kind>` is a kind-prefix declared in the canonical kind registry (§1.5).
  - `<locus>` is the declaration-locus identifier from §1.5 locus table. `<locus>` is omitted in the canonical ID when the kind has exactly one locus (single-locus kinds in §1.5). `<locus>` is part of the canonical ID when the kind has multiple loci (multi-locus kinds in §1.5: `F-`, `R-`, `J-`, `HR-`, `Q-`).
  - `<ordinal>` is the position-in-kind-and-locus assigned at declaration time, monotonic.

  Kind-prefix overloading is prohibited: two element kinds may not share a prefix. Locus-overloading within a kind is permitted by construction (the naming function disambiguates). The canonical identifier is the same in declarations and citations — identifiers do not change form by context. Tested by SG5 (§11.1).

### §10.2 PR-series

- **PR1.** Every framework content traces to a primitive kind. Prose carrying structural content violates.
- **PR2.** Primitive kinds are additively versioned.
- **PR3.** Each primitive kind has declared shape at §8.
- **PR4.** Stage monotonicity. For any procedure (set of P8 instances belonging to one operation), `stage` values across ordered steps (by `order`) are non-decreasing. A step with stage N+1 cannot precede a step with stage N in the same procedure.
- **PR5.** Stage-content-kind alignment. For any P8 instance, `stage` and `kind` satisfy:
  - `stage: 1` ↔ `kind: 'judgment-input'`
  - `stage: 2` ↔ `kind: 'mechanical'`
  - `stage: 3` ↔ `kind: 'gate-execution'`
  - `stage: 4` ↔ `kind: 'judgment-input'`
  - `stage: 5` ↔ `kind: 'mechanical'`

  Steps violating alignment are malformed.

### §10.3 Rule precedence

Substrate-tier rules take precedence over any apparent framework-tier rule conflict; such apparent conflicts are resolved by recognizing that framework rules cannot override substrate rules (per S2 consequence).

---

## §11 Substrate gates

### §11.1 SG-series

**SG1 — Element declaration completeness.** Every substrate element has declared ID and shape. Mechanical.

**SG2 — No framework references.** No substrate element references a framework. Mechanical.

**SG3 — Consumer registry completeness (per R-phase-1-1-resolution-02).**
Every substrate element has ≥1 declared consumer in §14.
Enumeration discipline: per-element rows with explicit consumer list (by framework ID). Aggregate "all frameworks" shorthand permitted only when paired with declared exhaustive framework enumeration in §14 header. Implicit "all frameworks" without enumeration fails SG3.
Mechanical test: for each element in §1–§9, verify ≥1 row in §14 referencing it; verify each referenced consumer resolves to a declared framework ID.

**SG4 — Additive versioning.** Every substrate version transition is additive. Mechanical (version-diff check).

**SG5 — Naming-function conformance** (added v1.4, cycle-1.5; paired with S6).
For every declared element in any consumer framework or in substrate, the canonical ID conforms to S6: `<kind>` ∈ kind-prefix set declared at §1.5; `<locus>` ∈ locus-ID set declared at §1.5 and is present iff §1.5 marks the kind multi-locus; `<ordinal>` is the unique position-in-kind-and-locus assigned at declaration. For every citation across all consumer files, the cited identifier resolves to exactly one declared element. Bare-form citation of a multi-locus kind is a SG5 violation. Kind-prefix overloading at the registry is a SG5 violation.

Mechanical: per substrate §6.3 enum-membership + reference-resolution classes. Test enumerates every identifier instance in every file, verifies kind-prefix is registered at §1.5, verifies form (bare for single-locus kinds, locus-qualified for multi-locus kinds). Failure logs first-failing instance (file + line + ID). Result: binary truthValue per §10.1 S4.

### §11.2 PG-series

**PG1.** Every framework declares ≥1 P1 instance.
**PG2.** Every axis has ≥1 leaf directly or through sub-axes.
**PG3.** Every axiom attaches to declared axis/sub-axis/leaf.
**PG4.** Every gate tests ≥1 axiom.
**PG5.** Every P8 instance declares kind.
**PG6.** P8 instances satisfy kind-specific field requirement per ternary kind:
- `kind: 'mechanical'` → declared `derivation`.
- `kind: 'judgment-input'` → declared `judgmentInputRef`.
- `kind: 'gate-execution'` → declared `gates` populated with tested axiom or invariant refs.
**PG7.** Every handoff rule declares direction with FrameworkRef endpoints.

All mechanical.

### §11.3 F-phase-1-1-69 universal gate at substrate

**G-U4 — Primitive declaration.** Every framework content element traces to a declared substrate primitive (P1–P8). For any primitive Pn declared empty by a framework, the empty marker conforms to atom A-17 `EmptyPrimitiveDeclaration` typed shape (`{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`) per §8.6 (cycle-1 tightened per F-cycle-1-7; cycle-1.5 genericized `primitiveKind` to `PrimitiveKindRef` per S6 + MA-S7 to preserve PR2 additive primitive versioning).
*Declared at:* substrate §11 (this section).
*Executed by:* framework-audit-v1-3.
Mechanical (type-check + cardinality + reference-resolution classes per §6.3).

### §11.4 MA-G13 gate

**G-G13 — Structural-identity test.** No sub-element of framework has all four MA-G13 properties (§1.4 criteria).
*Declared at:* substrate §11.
*Executed by:* framework-audit-v1-3.
Mechanical (four-property presence scan per sub-element).

### §11.5 Gate execution order at substrate

1. SG1 → SG2 → SG3 → SG4 → SG5 (substrate integrity, including naming-function conformance).
2. PG1–PG7 (primitive integrity, per framework).
3. G-U4, G-G13 (executed by framework-audit).

Failure at any tier halts subsequent tiers.

### §11.6 Gate rules at substrate

- Every substrate gate is mechanical (no criteria-bounded gates at substrate).
- Gate truth-value is binary per §10.1 S4 (truth-value field on result-shape ∈ {passed, failed, null}); applicability and lifecycle are orthogonal fields per framework-audit-v1-2 §8.1 GateResult schema, not collapsed into a ternary truth-value enum. Substrate gate results are synchronous (executionState = 'executed' on completion).
- Gate failure logs timestamp, element tested, failure reason.

---

## §12 Consumer registry

Declared consumers per substrate element. Enforces SG3.

**Framework ID enumeration (header):** known frameworks in this system — metaframework-v3-1, framework-registry-v1-0, generation-procedure-v1-0, framework-audit-v1-2, amendment-propagation-v1-0, plus any declared L3 framework in registry. "All frameworks" shorthand below refers to this enumerated set.

| Substrate element | Consumers |
|---|---|
| §1.1 SI-01 MA-G13 | all frameworks (universal) |
| §1.2 SI-02 Kind-of-invariants | metaframework, framework-audit, framework-registry |
| §1.3 SI-03 Permitted-multi-execution | metaframework, framework-audit, amendment-propagation |
| §1.4 SI-04 Four-property criteria | framework-audit (executor), metaframework (declarer) |
| §2 Modes | all frameworks (universal via Identity axis) |
| §3 Universal Variables | all frameworks (universal via Structure axis) |
| §4 Atom A-01 WAtom | metaframework, all frameworks with typed I/O |
| §4 Atom A-02 AxiomRef | metaframework, framework-audit, amendment-propagation |
| §4 Atom A-03 HandoffContract | metaframework, all frameworks with coupling |
| §4 Atom A-04 CustodyRow | metaframework, all frameworks with atom consumption |
| §4 Atom A-05 OriginProvenance | metaframework, framework-audit, amendment-propagation, registry |
| §4 Atom A-06 AxisRef | metaframework, framework-audit |
| §4 Atom A-07 SubAxisRef | metaframework, framework-audit |
| §4 Atom A-08 LeafRef | metaframework, framework-audit |
| §4 Atom A-09 FrameworkRef | all frameworks + registry |
| §4 Atom A-10 Kind | metaframework, framework-audit, framework-registry, all frameworks at §1 Identity |
| §4 Atom A-11 Ownership | metaframework, framework-audit, all L2 frameworks at §1 Identity |
| §4 Atom A-12 ActivationTrigger | metaframework, generation-procedure, framework-audit, amendment-propagation |
| §4 Atom A-13 OperatorInterface | all L2 frameworks (§6.8), framework-audit (§3.3 X6 operator dimension) |
| §4 Atom A-14 GenesisDeclaration | metaframework, all L2 frameworks (§1 Identity), framework-audit (§3.3 X8) |
| §4 Atom A-15 GateIdSet | metaframework (renders `MetaframeworkGateIdSet` consumer instance per §6.5), framework-audit, amendment-propagation, generation-procedure |
| §4 Atom A-16 AmendmentProvenance | registry (RegistryEntry.amendmentProvenance), amendment-propagation (PropagationTrace), framework-audit (G-U5), framework-registry (AmendmentLogEntry alias declared at registry §2.4) |
| §4 Atom A-17 EmptyPrimitiveDeclaration | all frameworks declaring empty primitive markers; framework-audit (G-U4 executor) |
| §4 Atom A-18 ReferentCitation | all frameworks declaring referent citations in vocabulary/atom-inventory tables; framework-audit (G-V10 + G-S8 executors); metaframework (GeneratedFrameworkTemplate `referentCitations` field at §2.2) |
| §4 Atom A-19 ReferentAlignmentState | framework-audit (G-V10 producer; AuditRunRecord.referentAlignmentStatesRef + SelfAuditRecord.referentAlignmentStates consumer) |
| §4 Atom A-20 ReferentSnapshot | framework-audit (AuditRequest.referentSnapshotRef + AuditRunRecord.referentSnapshotRef + G-L11 executor); A-19 ReferentAlignmentState (snapshotRef field) |
| §5 Authority levels | all frameworks (universal via Identity axis) |
| §6 Judgment shape | generation-procedure (primary), any framework with judgment inputs |
| §6.3 Mechanical-criterion ground | framework-audit (executor) |
| §7 Semver | all frameworks (universal via Identity axis) |
| §8 Primitives P1–P7 | all frameworks (universal) |
| §8 Primitive P8 | generation-procedure, any generative-mode framework |
| §8.6 Empty-declaration derivation | all frameworks |
| §9 Carrier | metaframework, all frameworks with Coupling axis |
| §9 Carrier applicability semantics | metaframework, amendment-propagation |
| §9 Cross-axis invariant | metaframework, framework-audit |
| §9 Non-framework file | substrate (self), framework-registry |
| §9 File-shape applicability rule | all consumers |
| §9 LifecycleState | framework-registry (§2.3), metaframework (§1 Identity, §3.5 Vocabulary), framework-audit (§3.3 X9), v3-1-spec (§7.4 spec-lifecycle) |
| §10 Rules S1–S5, PR1–PR5 | all consumers (self-governing) |
| §11 Gates SG1–SG5, PG1–PG7 | framework-audit (primary executor) |
| §11 G-U4, G-G13 | framework-audit (execution) |
| §13 Activation flow | metaframework, generation-procedure, framework-audit, amendment-propagation, registry |
| §14 Bootstrap | metaframework (declarer), registry (records bootstrap event) |

Consumer registry updated additively per S3.

---

## §13 Activation flow

### §13.1 Declaration

Top-level invariant declared at substrate. Single trace from L0 activation to outcome disposition. Applies universally across the six-file system.

### §13.2 Six-node flow

```
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │   L0  ──activate──►  Metaframework                  │
    │                           │                         │
    │                           │ invoke-per-Mode         │
    │                           ▼                         │
    │                      Owned Framework                │
    │                      (generation-procedure,         │
    │                       framework-audit, or           │
    │                       amendment-propagation)        │
    │                           │                         │
    │                           │ execute within          │
    │                           │ declared dimensional    │
    │                           │ ownership               │
    │                           ▼                         │
    │                        Outcome                      │
    │                           │                         │
    │                           │ return-path             │
    │                           ▼                         │
    │                       Registry                      │
    │                    (records state)                  │
    │                           │                         │
    │                           │ state available         │
    │                           ▼                         │
    │                    L0 confirm | escalate            │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

### §13.3 Per-edge contract reference

| Edge | Contract |
|---|---|
| L0 → Metaframework | HR0 (new): L0 activation interface |
| Metaframework → Owned framework | HR2 (generation-procedure), HR3 (framework-audit), HR4 (amendment-propagation) |
| Owned framework → Outcome | declared in each owned framework's schema.output |
| Outcome → Registry | HR5 (registry recording) |
| Registry → L0 | declared L0 query/confirmation interface (see §13.5) |

HR0 declared at metaframework Coupling axis (per V7 verification expectation).

### §13.4 Per-operation atomicity

Each operation in the flow declares atomicity:

| Operation | Atomicity | Recovery point |
|---|---|---|
| L0 activation | atomic | N/A (event source) |
| Metaframework invocation of owned framework | atomic | pre-invocation state |
| Owned framework execution | **interruptible** | per-step checkpoint (declared in owned framework's Lifecycle) |
| Outcome emission | atomic | pre-emission state in owned framework |
| Registry write | atomic (per data-integrity invariants) | registry transaction log |
| L0 confirm/escalate | atomic | N/A (event sink) |

Owned framework execution is interruptible by design — long-running procedures (generation-procedure 12+ steps) need checkpointing. Each owned framework declares its own step-level recovery points in its Lifecycle axis.

### §13.5 Concurrent-activation resolution

**Rule:** activation operations serialize via registry-lock.

- Registry exposes declared lock on per-framework-ID basis.
- L0 activation attempts lock acquisition before flow begins.
- If lock held: activation waits (declared wait-policy) OR rejects with declared rejection code.
- Wait vs. reject is per-activation parameter declared in activation interface.
- Lock released on outcome emission + registry write, OR on L0 escalation confirmation.

Closes F-phase-1-1-B-40.

### §13.6 L0-unavailability response

**Rule:** operation suspends; state persists; resumes on L0 return.

- Operation reaching L0-confirmation edge without L0 available enters `suspended` lifecycle state.
- Registry records suspension with timestamp, framework-ID, pending-confirmation payload.
- Registry lock remains held during suspension (no other activation proceeds for that framework).
- On L0 return: registry surfaces pending suspensions; L0 processes in declared order (FIFO per framework-ID).
- Resume is idempotent — L0 confirming a resumed operation produces identical result to synchronous confirmation.

Closes F-phase-1-1-B-28.

### §13.7 L0 activation interface (declared)

Activation carries:
- `target`: FrameworkRef (which owned framework to invoke)
- `operation`: declared operation name within owned framework
- `input`: typed per owned framework's schema.input
- `authority`: AuthorityClaim (level='L0', confirmedBy, timestamp)
- `concurrencyPolicy`: 'wait' | 'reject' (for concurrent-activation handling)

Full interface declared at metaframework Coupling axis (HR0).

### §13.8 Outcome disposition

Outcomes return through declared return paths per HR5 (registry) and reach L0 via registry query. L0's disposition options:

- **Confirm:** outcome accepted; framework state updated; lock released.
- **Escalate:** outcome rejected; lifecycle escalation state populated; declared remediation per MA-L4; lock remains held until remediation confirmed.

Both dispositions logged with AuthorityClaim and timestamp.

---

## §14 Bootstrap

### §14.1 Declaration

System bootstrap is a declared one-time privileged L0 event. Non-re-entrant. Produces the minimum artifact set required for all subsequent derivation.

### §14.2 Bootstrap artifacts

Bootstrap produces:
- `substrate-v1-0.md` (this file)
- `metaframework-v3-0.md` (first metaframework)

These two artifacts constitute the restore minimum. All other files derive from these.

### §14.3 Bootstrap authoring

Bootstrap uses **L0 hand-authored content**. Post-bootstrap derivation uses declared procedures (generation-procedure, amendment-propagation). The distinction:

- Pre-bootstrap: no procedures declared yet. L0 authors directly.
- Post-bootstrap: procedures declared in bootstrap artifacts. All subsequent artifacts derive via procedures.

### §14.4 Bootstrap recursion acknowledged

Spec v3.0 derivation uses rules that v3.0 declares. This is recursive. Resolution:

- Bootstrap is the declared one-time privileged event where this recursion is permitted.
- Bootstrap event is non-re-entrant: once substrate-v1-0 and metaframework-v3-0 exist, no subsequent operation may invoke bootstrap.
- Post-bootstrap, all derivation proceeds through declared procedures — no further recursion.
- Bootstrap is recorded in registry as the genesis event with L0 AuthorityClaim.

### §14.5 Bootstrap non-re-entrancy rule

- Registry records whether bootstrap has occurred (`bootstrapped: boolean`).
- Bootstrap invocation attempted while `bootstrapped === true` fails with declared rejection.
- `bootstrapped` field is set once (on initial bootstrap confirmation by L0) and never reset.

### §14.6 Post-bootstrap restore procedure

If all artifacts except git history + registry are lost:

1. Restore substrate-v1-0.md from git history (last confirmed version).
2. Restore metaframework-v3-0.md from git history (last confirmed version).
3. Verify substrate and metaframework against their declared gates (G-G13, SG1–SG5, PG1–PG7).
4. Registry re-derives per-framework state by scanning git history for confirmed versions.
5. Remaining artifacts (generation-procedure, framework-audit, amendment-propagation, generated L3 frameworks) restore from git history at their last-confirmed versions.
6. Any artifact absent from git history re-derives via generation-procedure invoked by L0.

Restore does not invoke bootstrap — it is a restore-from-state operation, not genesis.

---

## §15 Substrate self-audit

Non-framework file. Self-audit at declaration time:

| Gate | Result |
|---|---|
| SG1 (element declaration completeness) | ✓ — all elements in §1–§14 declared with ID and shape |
| SG2 (no framework references) | ✓ — §12 consumer registry entries are declared consumer references, not framework dependencies |
| SG3 (consumer registry completeness) | ✓ — every element in §1–§14 has ≥1 row in §12 |
| SG4 (additive versioning) | ✓ — v1.6 transition from v1.5 is additive per S3 + MA-S7 (recursive). Three new atoms (A-18 ReferentCitation, A-19 ReferentAlignmentState, A-20 ReferentSnapshot); §1.5 locus-ID table adds `cycle-2`; §1.5 F-row Loci extended with `cycle-2`. No removal. A-18 introduces the first canonical discriminated-union sub-shape (`ExpectedShape`); MA-S7 tightening at metaframework v3.2.7 §3.2.1 governs this case (cycle-2 baseline atom; vacuously satisfies recursive predicate). Cycle-1 atom set (A-01..A-17) re-validated zero-regression against tightened predicate. |
| SG5 (naming-function conformance) | ✓ — every identifier instance in §1–§16 conforms to S6: single-locus kinds (substrate atoms `A-NN` including new A-18..A-20, rules `S1..S6`, items `SI-01..SI-04`, primitive rules `PR1..PR5`, primitives `P1..P8`, substrate gates `SG1..SG5`) carry bare canonical form; multi-locus kinds carry locus-qualified canonical form. Sub-shape citation form `A-18.ExpectedShape` per A-17/PrimitiveKindRef precedent (parent-atom-qualified). Cycle-2 SG5 first-run scheduled at Turn 5 of cycle-2 delivery. |

Ongoing verification occurs at framework-audit execution per consumer invocation.

---

## §16 Version history

### v1.0 — Initial declaration (Phase 1.1 re-open output)

- Four structural-identity items split (§1.1–§1.4, per R-phase-1-1-resolution-01).
- Modes (4), Universal Variables (4), Atoms (9), Authority levels (4), Judgment shape declared.
- Judgment mechanical-criterion ground declared (§6.3, per R-phase-1-1-resolution-12).
- Primitives (P1–P7 universal + P8 conditional) declared.
- Empty-declaration rule derived from primitive discipline (§8.6, per R-phase-1-1-resolution-23).
- Terminology: Carrier (per R-phase-1-1-resolution-04), carrier applicability semantics (per R-phase-1-1-resolution-13, R-phase-1-1-resolution-17), cross-axis invariant (per R-phase-1-1-resolution-05), non-framework file (per R-phase-1-1-resolution-19), file-shape applicability (per R-phase-1-1-resolution-18) declared at §9.
- Consumer registry (§12) with per-element enumeration + aggregate shorthand (per R-phase-1-1-resolution-02).
- Activation flow declared (§13, per F-phase-1-1-B-28, F-phase-1-1-B-37, F-phase-1-1-B-38, F-phase-1-1-B-39, F-phase-1-1-B-40).
- Bootstrap declared (§14, per F-phase-1-1-B-31, F-phase-1-1-B-32, F-phase-1-1-B-33).

### v1.1 — Phase 1.2 delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.1 | Phase 1.2 delivery | Stage enum + P8 amended (§8.3, +stage field, kind ternary with 'gate-execution'); P6 +captureShape +diagnosticSignificance (§8.2); PR4 stage monotonicity + PR5 stage-content-kind alignment (§10.2); PG6 amended for ternary kind (§11.2) | L0 |

### v1.2 — Phase 1.2-fix delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.2 | Phase 1.2-fix delivery | LifecycleState enum declared at §9 (per R-phase-1-2-0004 resolution); five atom promotions A-10 Kind, A-11 Ownership, A-12 ActivationTrigger, A-13 OperatorInterface, A-14 GenesisDeclaration (per R-phase-1-2-0015 resolution); consumer registry refreshed (§12 header versions + new atom consumer rows + LifecycleState row per R-phase-1-2-0003 resolution); §11.3 G-U4 + §11.4 G-G13 executed-by refreshed framework-audit-v1-0 → framework-audit-v1-3 (per R-phase-1-2-0003 KA-GATE1-1 cascade extension). | L0 |

### v1.3 — MF-Cycle-1 Foundation Closure delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.3 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cluster B (type discipline): §10.1 S4 added (gate truth-value binary, per F-cycle-1-4); §11.6 amended to remove "binary or ternary" wording, references S4 (per F-cycle-1-4); §6.3 line 382 deterministic-function result wording amended to reference orthogonal field decomposition per framework-audit §8.1 (per F-cycle-1-3 cascade); §11.3 G-U4 predicate tightened to reference A-17 typed shape (per F-cycle-1-7); §8.6 empty-declaration derivation amended to reference A-17 (per F-cycle-1-7). Cluster A (naming): §1.1–§1.4 items renamed S-01..S-04 → SI-01..SI-04 (per F-cycle-1-1); §10.1 S5 added (filename opacity, per F-cycle-1-5); citation sweep across substrate consistent with renames. Cluster D (atoms): A-05 in-place rename `ProvenanceRow` → `OriginProvenance` (shape unchanged, per F-cycle-1-12); A-15 GateIdSet added (lifted from metaframework §6.5 `MetaframeworkGateIdSet`, per F-cycle-1-14); A-16 AmendmentProvenance added (two-tier provenance per F-cycle-1-12; carries extended `amendmentTrigger` enum including `'first-run'` per F-cycle-1-6 audit fix on F-cycle-1-11); A-17 EmptyPrimitiveDeclaration added (per F-cycle-1-7); §4.1 atom count 14 → 17; §12 consumer registry rows updated for atom renames + additions; §10 rule list updated (S1–S5, PR1–PR5). All amendments additive per S3 + MA-S7 (Schema-axis additive amendment, declared this cycle at metaframework). | L0 |
| v1.4 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) | New structural rule + paired gate + canonical kind registry. §1.5 Canonical kind registry added (declares every kind-prefix used across the metaframework system, its declaration locus, ordinal rule, and single-locus-vs-multi-locus classification; locus-ID table). §10.1 S6 added (Identifier naming function: every element has canonical ID `<kind>-<locus>-<ordinal>` with `<locus>` omitted for single-locus kinds, included for multi-locus kinds; canonical form is the same in declarations and citations). §11.1 SG5 added (paired with S6; tests every identifier instance against §1.5). §11.5 gate execution order extended (SG1→SG2→SG3→SG4→SG5). §15 self-audit table extended with SG5 row. §4.2 A-17 EmptyPrimitiveDeclaration: `primitiveKind` field genericized from hardcoded enum to typed reference `PrimitiveKindRef` (shape-preserving per MA-S7; preserves PR2 additive primitive versioning). §11.3 G-U4 predicate updated to reference `PrimitiveKindRef`. Identifier sweep applied across §1–§16 substrate body: every multi-locus identifier rendered in canonical locus-qualified form (declarations and citations alike — no carve-outs). Substrate gate count 4 → 5 (cascades to all-gates 86 → 87; framework-tier 82 unchanged — substrate gates excluded per §11.5 tier-1 — propagated to consumer files via Shot 3 amendments under MA-S7 + MA-S5). All amendments additive per S3 + MA-S7. | L0 |
| v1.5 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | §1.5 amended: R-row Loci adds `phase-1-1-resolution` locus (24 resolutions produced 2026-04-21 between L0 and manager instance; distinct from substrate atoms and Phase 1.1 findings); F-row Loci extended with `phase-1-2`, `cycle-1-6`, future cycles; locus-ID table additions (`phase-1-1-resolution`, `cycle-1-6`); bare-form rule prose clarified (pre-cycle-1.5 conflation of A-NN substrate atoms and Phase 1.1 resolutions separated per kind via cycle-1.6 sweep). Substrate body 116-occurrence sweep classified per spec §4.1 rule (16 substrate-atom shape refs to bare A-NN; 14 Phase 1.1 finding refs kept F-phase-1-1-A-NN; 86 Phase 1.1 resolution refs to R-phase-1-1-resolution-NN). All amendments additive per S3 + MA-S7 (terminology disambiguation, no shape changes). No structural counts changed (atoms 17, rules S6, substrate gates SG1–SG5, all-gates 87 unchanged from cycle-1.5). | L0 |

### v1.6 — MF-Cycle-2 Spec↔Referent Alignment Closure delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.6 | MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30) | Three new atoms added to §4.2: A-18 ReferentCitation (with inline `ExpectedShape` discriminated-union sub-shape per A-17/PrimitiveKindRef sub-shape precedent + inline ReferentResolver interface declaration), A-19 ReferentAlignmentState (truthValue/applicability/executionState split per cycle-1 F-cycle-1-3 + F-cycle-1-8 discipline; basis required when applicability='n/a' per MA-V11), A-20 ReferentSnapshot (typed atom decoupling snapshot identity from audit-run state per cycle-1 G5). §1.5 locus-ID table: `cycle-2` row added (required by S6 + SG5 for first cycle-2 finding identifier emission). §1.5 F-row Loci extended with `cycle-2`. §4.1 atom count 17 → 20. §12 consumer registry: A-18, A-19, A-20 rows added. ExpectedShape sub-shape declared inline within A-18 body (citation form `A-18.ExpectedShape`, parent-atom-qualified per A-17/PrimitiveKindRef precedent). All amendments additive per S3 + MA-S7 (recursive scope per metaframework v3.2.7 §3.2.1 amendment). A-18 introduces the first canonical discriminated-union sub-shape; cycle-2 baseline (no prior version) — vacuously satisfies recursive predicate. Cycle-1 atom set (A-01..A-17) re-validated zero-regression against tightened predicate. | L0 |

---

## End of substrate-v1-1
