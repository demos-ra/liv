# substrate-v1-1

**Kind:** non-framework (universal declarations)
**Version:** v1.2
**Authority:** L0 confirmed (Phase 1.2-fix delivery)
**Consumed by:** metaframework-v3-1, framework-registry-v1-0, generation-procedure-v1-0, framework-audit-v1-2, amendment-propagation-v1-0, all generated L3 frameworks
**Dependencies:** none (upstream of all frameworks)
**Versioning discipline:** additive only (per S3)

Substrate is the universal declared content consumed by every framework. It declares what exists at the tier above any single framework: structural-identity rules, transformation kinds, decomposition variables, typed atoms, authority levels, judgment mechanics, version coordinates, primitives, terminology, activation flow, and bootstrap.

Substrate consumes no framework. Dependency direction is strictly frameworks → substrate. Circular reference is a structural violation.

---

## §1 Structural-identity declarations

Four distinct substrate items. Each declared with own ID. Previously bundled at v2.5 metaframework §6; split per Phase 1.1 finding A-01.

### §1.1 Item S-01 — MA-G13 structural-identity invariant

Any declared element with all four of the following is a framework:

1. **Own state** — declared mutable values with declared transitions.
2. **Own I/O** — declared typed input schema and declared typed output schema.
3. **Own invariants** — declared structural-transformation axioms binding state transitions (see §1.2).
4. **Own discipline** — declared procedure or protocol governing operation.

A candidate fails MA-G13 if any of the four is absent or inherited-only.

No framework may contain another framework as a sub-element. Any such sub-element extracts.

### §1.2 Item S-02 — Kind-of-invariants distinction

"Own invariants" under MA-G13 refers specifically to **structural-transformation invariants** — axioms governing how state, schema, or content change under declared rules.

**Data-integrity invariants** — write-once, consistency, uniqueness, referential integrity — do not qualify as "own invariants" for MA-G13 purposes. They govern data correctness, not transformation structure.

This distinction determines framework-vs-state-store classification:

- A declared element with structural-transformation invariants (plus the other three MA-G13 properties) is a **framework**.
- A declared element with only data-integrity invariants is a **state store**, regardless of whether it has own state, own I/O, and own discipline.

The registry (`framework-registry-v1-0`) is classified as state store by this distinction.

If a state store later gains structural-transformation invariants, it flips to framework classification under this declared rule. Boundary is declarative, not case-law.

### §1.3 Item S-03 — Permitted-multi-execution rule

A gate is declared once (single source of truth) and may be executed by multiple consumers.

Single declaration preserves: versioning coherence, meaning-ownership, audit trail.
Multiple execution permits: cross-framework validation at distinct touchpoints.

Canonical case: G-U5 provenance completeness is declared in the metaframework and executed by both `framework-audit` (at framework validation) and `amendment-propagation` (at propagation verification).

Multi-execution requires no duplication of the gate declaration. Each execution site references the declaration and logs its execution with timestamp, framework state hash, and result.

### §1.4 Item S-04 — Four-property criteria

The four properties under MA-G13 are declared as mechanically-testable criteria:

- **Own state criterion:** element declares ≥1 mutable-value field AND ≥1 declared transition rule for each mutable value.
- **Own I/O criterion:** element declares typed input atom (referencing §4) AND typed output atom (referencing §4).
- **Own invariants criterion:** element declares ≥1 structural-transformation axiom binding its state transitions (§1.2 kind-of-invariants applies).
- **Own discipline criterion:** element declares ≥1 procedure, protocol, or ordered step sequence governing operation.

G-G13 (§10) tests all four criteria mechanically per candidate element.

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

Nine atoms exist in v1.0. Five additional atoms added in v1.2 (A-10..A-14 per R-0015 type-promotion resolution). Total: 14 atoms at v1.2. New atoms added additively per S3.

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

**A-05 — ProvenanceRow**
```
ProvenanceRow = {
  fieldPath: string,
  derivedFromStep?: string,
  judgmentId?: JudgmentId,
  derivedFromSubstrate?: string
}
```
Exactly one of the three `derivedFrom*` fields populated per row.

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

**A-10 — Kind** (promoted Phase 1.2 per R-0015 resolution; previously inline at metaframework §3.5)
```
Kind = 'Framework' | 'State-store' | 'Protocol' | 'Substrate'
```
Declared at substrate tier because Kind is consumed by metaframework (§1 Identity + MA-G13 classification), framework-audit (§3.3 X1 identity dimension), framework-registry (§2.1 RegistryEntry), and all frameworks at §1 Identity. Single-source declaration per S1.

**A-11 — Ownership** (promoted Phase 1.2 per R-0015 resolution; previously inline at metaframework §3.5)
```
Ownership = {
  template: 'L0' | 'Human',
  applied: 'System' | 'L0'
}
```
Template ownership governs who authors; applied ownership governs who operates. Consumed by metaframework (§1 Identity), all L2 frameworks (§1 Identity), and framework-audit (§3.3 X1 identity dimension tests ownership presence).

**A-12 — ActivationTrigger** (promoted Phase 1.2 per R-0015 resolution; previously inline at metaframework §2.1 + spec §3.3)
```
ActivationTrigger = {
  initiator: AuthorityClaim,         // L0 or escalated authority
  concurrencyPolicy: 'wait' | 'reject',
  operationName: string
}
```
Declared at substrate tier because activation triggers cross the metaframework / generation-procedure / framework-audit boundary via HR2/HR3/HR4. Consumed by metaframework (§2.1 MetaframeworkInput), generation-procedure (§2.1 input), framework-audit (§2.1 AuditRequest pattern), amendment-propagation (§2.1 AmendmentEvent pattern).

**A-13 — OperatorInterface** (promoted Phase 1.2 per R-0015 resolution; previously inline at metaframework §3.5)
```
OperatorInterface = {
  invocationEntry: string,           // declared entry point (e.g., 'HR0', 'HR2-receive')
  outputRetrieval: string,           // declared retrieval path (e.g., 'registry lookup post-HR5')
  auditQuery: string,                // declared audit surface (e.g., 'HR3 path')
  runtimeState: 'declared' | 'implemented'
}
```
Per V5 verification. Operator-facing surface contract. Consumed by all L2 frameworks (§6.8 OperatorInterface declaration). Runtime implementation deferred post-9g per §7 P4 runtime open items; declaration-only at delivery.

**A-14 — GenesisDeclaration** (promoted Phase 1.2 per R-0015 resolution; previously inline at metaframework §3.5)
```
GenesisDeclaration = {
  bootstrapped: boolean,
  genesisEvent: string              // substrate §14 reference or generation-procedure version ref
}
```
Declared at substrate tier because MA-L7 bootstrap non-re-entrancy references GenesisDeclaration across all frameworks. Consumed by metaframework (§1 Identity), all L2 frameworks (§1 Identity), framework-audit (§3.3 X8 bootstrapping dimension).

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

### §6.3 Mechanical-criterion ground (per A-12)

A criterion is **mechanical** iff its predicate is expressible as one of:

- **Type-check:** `typeof x === T` or `x instanceof T` against a declared atom shape.
- **Enum membership:** `x ∈ S` where S is a declared enum literal set.
- **Reference resolution:** `x` is an ID that resolves to a declared element in substrate or named framework (deterministic lookup with yes/no result).
- **Structural property:** declared predicate over an atom's shape (e.g., "every field of atom A has declared custody in §11") where the predicate reduces to the above three via finite traversal.
- **Cardinality:** `|S| op N` where op ∈ {=, ≤, ≥, <, >} and N is a declared constant.
- **Deterministic-function result:** evaluation of a declared pure function with declared signature producing binary/ternary result.

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

### §8.6 Empty-declaration derivation (per A-23)

A framework's primitive-instance set may be empty for certain primitives. Empty is permitted; implicit-absence is not. Derivation:

- Primitive kind P exists at substrate §8.
- Framework F may declare **zero instances** of P.
- Zero-instance state is captured by a positive-declaration marker in F's relevant section.
- Marker format: `{primitiveKind: P, instanceCount: 0, basis: string}` where basis is the declared reason (e.g., "fully mechanical — no P7 instances required").

Empty-declaration rule is thereby derived from primitive-instance cardinality plus positive-declaration marker. Not a separate hand-written rule — a consequence of PR1 (primitive traceability) requiring every primitive kind's instance count be declared, not inferred.

Framework files that apply this rule:
- §7 Judgment in every framework: zero-instance state declared as "No judgment inputs. This framework is fully mechanical."
- Any axis with zero Sub-axis instances: declared as "No sub-axes."

Rule declared once at substrate; framework files consume by reference.

---

## §9 Terminology

### §9.1 Declaration

Every term used across frameworks has declared home. This section declares substrate-tier terms; framework-tier terms are declared in their owning framework's Structure section.

### §9.2 Substrate-declared terms

**Carrier** (per A-04)
```
Carrier = 'self' | 'named' | 'none'
```
Declared at substrate tier because Carrier is universal across all frameworks (every framework has carrier value in its Coupling axis).

- **self**: framework emits own artifact; owns emission mechanics.
- **named**: framework emits via named external carrier; emission contract declared in handoff.
- **none**: framework emits AxiomRef[] only; no emission mechanics.

**Carrier applicability semantics** (per A-13, A-17)
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

**Cross-axis invariant** (per A-05)
A rule declared at substrate or framework tier that binds content across two or more declared axes. Distinct from axis-bound axioms (which attach to one axis per PG3).

Canonical cases:
- MA-G13 (cross-axis at framework tier — governs Identity + Structure + Schema + Lifecycle jointly).
- G-U1 through G-U5 (cross-axis universal gates — test invariants spanning multiple axes).

Cross-axis invariants are declared either at substrate (universal) or at framework's Validity axis (framework-specific). Never attached to a single axis.

**Non-framework file** (per A-19)
A file declared at substrate tier with non-framework kind. Non-framework files (substrate, registry) have:

- Own content (declarations or state).
- Own invariants (data-integrity or universal-declaration kind per §1.2).
- No framework-kind axes (no Identity/Schema/.../Judgment seven-axis structure).
- May have own gates; gates test content integrity, not framework-kind axioms.

Substrate gates (SG1–SG4) and registry gates (declared at registry §8) are permitted under this rule. Non-framework file having gates is not an ambiguity — gates test non-framework content per non-framework rules.

**File-shape applicability rule** (per A-18)
File shapes are governed by file kind declared at substrate:

- **Framework files** (Mode = any, Kind = Framework): universal framework-file shape (nine sections: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment, Self-audit, Change log).
- **Non-framework files** (Kind = non-framework): content-specific shape declared at the file's substrate declaration or at the file itself.

File kind is itself a declared field; no file is shape-less.

**LifecycleState** (per Phase 1.2 closure R-0004 resolution)
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

**SG3 — Consumer registry completeness (per A-02).**
Every substrate element has ≥1 declared consumer in §14.
Enumeration discipline: per-element rows with explicit consumer list (by framework ID). Aggregate "all frameworks" shorthand permitted only when paired with declared exhaustive framework enumeration in §14 header. Implicit "all frameworks" without enumeration fails SG3.
Mechanical test: for each element in §1–§9, verify ≥1 row in §14 referencing it; verify each referenced consumer resolves to a declared framework ID.

**SG4 — Additive versioning.** Every substrate version transition is additive. Mechanical (version-diff check).

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

### §11.3 F-69 universal gate at substrate

**G-U4 — Primitive declaration.** Every framework content element traces to a declared substrate primitive (P1–P8).
*Declared at:* substrate §11 (this section).
*Executed by:* framework-audit-v1-3.
Mechanical.

### §11.4 MA-G13 gate

**G-G13 — Structural-identity test.** No sub-element of framework has all four MA-G13 properties (§1.4 criteria).
*Declared at:* substrate §11.
*Executed by:* framework-audit-v1-3.
Mechanical (four-property presence scan per sub-element).

### §11.5 Gate execution order at substrate

1. SG1 → SG2 → SG3 → SG4 (substrate integrity).
2. PG1–PG7 (primitive integrity, per framework).
3. G-U4, G-G13 (executed by framework-audit).

Failure at any tier halts subsequent tiers.

### §11.6 Gate rules at substrate

- Every substrate gate is mechanical (no criteria-bounded gates at substrate).
- Gate results binary (pending not used — substrate tests are synchronous).
- Gate failure logs timestamp, element tested, failure reason.

---

## §12 Consumer registry

Declared consumers per substrate element. Enforces SG3.

**Framework ID enumeration (header):** known frameworks in this system — metaframework-v3-1, framework-registry-v1-0, generation-procedure-v1-0, framework-audit-v1-2, amendment-propagation-v1-0, plus any declared L3 framework in registry. "All frameworks" shorthand below refers to this enumerated set.

| Substrate element | Consumers |
|---|---|
| §1.1 S-01 MA-G13 | all frameworks (universal) |
| §1.2 S-02 Kind-of-invariants | metaframework, framework-audit, framework-registry |
| §1.3 S-03 Permitted-multi-execution | metaframework, framework-audit, amendment-propagation |
| §1.4 S-04 Four-property criteria | framework-audit (executor), metaframework (declarer) |
| §2 Modes | all frameworks (universal via Identity axis) |
| §3 Universal Variables | all frameworks (universal via Structure axis) |
| §4 Atom A-01 WAtom | metaframework, all frameworks with typed I/O |
| §4 Atom A-02 AxiomRef | metaframework, framework-audit, amendment-propagation |
| §4 Atom A-03 HandoffContract | metaframework, all frameworks with coupling |
| §4 Atom A-04 CustodyRow | metaframework, all frameworks with atom consumption |
| §4 Atom A-05 ProvenanceRow | metaframework, framework-audit, amendment-propagation, registry |
| §4 Atom A-06 AxisRef | metaframework, framework-audit |
| §4 Atom A-07 SubAxisRef | metaframework, framework-audit |
| §4 Atom A-08 LeafRef | metaframework, framework-audit |
| §4 Atom A-09 FrameworkRef | all frameworks + registry |
| §4 Atom A-10 Kind | metaframework, framework-audit, framework-registry, all frameworks at §1 Identity |
| §4 Atom A-11 Ownership | metaframework, framework-audit, all L2 frameworks at §1 Identity |
| §4 Atom A-12 ActivationTrigger | metaframework, generation-procedure, framework-audit, amendment-propagation |
| §4 Atom A-13 OperatorInterface | all L2 frameworks (§6.8), framework-audit (§3.3 X6 operator dimension) |
| §4 Atom A-14 GenesisDeclaration | metaframework, all L2 frameworks (§1 Identity), framework-audit (§3.3 X8) |
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
| §10 Rules S1–S3, PR1–PR3 | all consumers (self-governing) |
| §11 Gates SG1–SG4, PG1–PG7 | framework-audit (primary executor) |
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

Closes B-40.

### §13.6 L0-unavailability response

**Rule:** operation suspends; state persists; resumes on L0 return.

- Operation reaching L0-confirmation edge without L0 available enters `suspended` lifecycle state.
- Registry records suspension with timestamp, framework-ID, pending-confirmation payload.
- Registry lock remains held during suspension (no other activation proceeds for that framework).
- On L0 return: registry surfaces pending suspensions; L0 processes in declared order (FIFO per framework-ID).
- Resume is idempotent — L0 confirming a resumed operation produces identical result to synchronous confirmation.

Closes B-28.

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
3. Verify substrate and metaframework against their declared gates (G-G13, SG1–SG4, PG1–PG7).
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
| SG4 (additive versioning) | ✓ — v1.0 initial declaration (no prior version to diff against) |

Ongoing verification occurs at framework-audit execution per consumer invocation.

---

## §16 Version history

### v1.0 — Initial declaration (Phase 1.1 re-open output)

- Four structural-identity items split (§1.1–§1.4, per A-01).
- Modes (4), Universal Variables (4), Atoms (9), Authority levels (4), Judgment shape declared.
- Judgment mechanical-criterion ground declared (§6.3, per A-12).
- Primitives (P1–P7 universal + P8 conditional) declared.
- Empty-declaration rule derived from primitive discipline (§8.6, per A-23).
- Terminology: Carrier (per A-04), carrier applicability semantics (per A-13, A-17), cross-axis invariant (per A-05), non-framework file (per A-19), file-shape applicability (per A-18) declared at §9.
- Consumer registry (§12) with per-element enumeration + aggregate shorthand (per A-02).
- Activation flow declared (§13, per B-28, B-37, B-38, B-39, B-40).
- Bootstrap declared (§14, per B-31, B-32, B-33).

### v1.1 — Phase 1.2 delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.1 | Phase 1.2 delivery | Stage enum + P8 amended (§8.3, +stage field, kind ternary with 'gate-execution'); P6 +captureShape +diagnosticSignificance (§8.2); PR4 stage monotonicity + PR5 stage-content-kind alignment (§10.2); PG6 amended for ternary kind (§11.2) | L0 |

### v1.2 — Phase 1.2-fix delivery

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.2 | Phase 1.2-fix delivery | LifecycleState enum declared at §9 (per R-0004 resolution); five atom promotions A-10 Kind, A-11 Ownership, A-12 ActivationTrigger, A-13 OperatorInterface, A-14 GenesisDeclaration (per R-0015 resolution); consumer registry refreshed (§12 header versions + new atom consumer rows + LifecycleState row per R-0003 resolution); §11.3 G-U4 + §11.4 G-G13 executed-by refreshed framework-audit-v1-0 → framework-audit-v1-3 (per R-0003 KA-GATE1-1 cascade extension). | L0 |

---

## End of substrate-v1-1
