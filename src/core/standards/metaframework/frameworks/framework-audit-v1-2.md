# framework-audit-v1-2

**Kind:** Framework
**Mode:** verificative
**Level:** L2
**Version:** v1.4
**Authority:** L0 confirmed (Phase v3.2.3 delivery)
**Consumes:** substrate-v1-1 (HR1), metaframework-v3-1 (HR3 receive-side), framework-registry-v1-0 (HR5 provenance lookup)
**Consumed by:** registry (HR5 at audit-result emission), all audited frameworks (audit result consumption)
**Dependencies:** substrate-v1-1, metaframework-v3-1, framework-registry-v1-0
**Versioning discipline:** additive only (per MA-L1)

Framework-audit is the L2 verificative-mode framework that runs the ten-dimension audit (X1–X10) plus all framework-tier gates against any target framework. v1-1 declared §3 Structure (dimensional declarations, with Phase 1.2 X3 C5 + X10 stage-extension) and §8 Self-audit schema. v1-2 (this delivery) populates the remaining sections — §1 Identity, §2 Schema, §4 Validity, §5 Lifecycle, §6 Coupling, §7 Judgment — and populates §8 content beyond schema. v1-1 content preserved verbatim per Phase 9f spec §1.2.

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Framework Audit |
| Kind | Framework |
| Mode | verificative (substrate §2) |
| Level | L2 |
| Version | v1.4 |
| Ownership (template) | L0 |
| Ownership (applied) | System (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` on first invocation via HR3) |
| Carrier | self (emits audit records as own artifacts) |
| Consumes | substrate-v1-1 (HR1), metaframework-v3-1 (HR3 receive-side), framework-registry-v1-0 (HR5 provenance lookup) |
| Consumed by | registry (HR5 at audit-result emission), all audited frameworks (audit result consumption) |
| Authority | L0 confirmed (Phase 9f delivery) |
| Genesis | generated-at-bootstrap per substrate §14 (grandfathered at first registry write) |
| scopeOut | `['runtime execution engine (post-9g)', 'audit-trail retention policy (post-beta)', 'cross-framework coordinated audit (post-9g)']` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | audit dimension set (§3 Structure), audit record history (§8.2 SelfAuditRecord per audited framework) |
| Own I/O | input: `AuditRequest` (§2.1); output: `SelfAuditRecord` (§8.1 schema) |
| Own invariants | axiom set inherited from metaframework-v3-1 + audit-dimension-completeness invariant (expressed via X1–X10 declared coverage at §3 + dimension-set integrity via own gates G-FA1–G-FA3 at §4) |
| Own discipline | per-framework audit procedure (run X1–X10 dimension tests + execute all framework-tier gates per metaframework §4.1, report per §8.1 SelfAuditRecord shape) — see §3 + §4 |

All four properties declared. MA-G13 passes. Framework-audit classified as framework (not state store, not protocol, not substrate).

---

## §2 Schema

### §2.1 Input — `AuditRequest`

Declared local atom.

```
AuditRequest = {
  targetFrameworkRef: FrameworkRef,
  auditScope: 'full' | 'dimensions-only' | 'gates-only',
  triggerEvent: 'on-registration' | 'on-amendment' | 'scheduled' | 'L0-initiated',
  initiator: AuthorityClaim,
  timestamp: string
}
```

### §2.2 Output — `SelfAuditRecord`

Schema home at §8.1 (preserved from v1-1). Referenced from §2 by pointer per A-08 single-source-via-reference.

### §2.3 Consumed types (from substrate-v1-1, metaframework-v3-1, registry, by reference)

| Type | Home |
|---|---|
| `FrameworkRef` | substrate §4 |
| `AuthorityClaim` | substrate §5 |
| `AxiomRef` | substrate §4 |
| `WAtom` | substrate §4 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |
| `Semver` | substrate §7 |
| `Stage`, `StageContentKind` | substrate §8.3 (used in X10 extended predicate per §3.4) |
| `CaptureShape` | substrate §8.2 (used in X3 C5 per §3.4) |
| `AxisInstance`, `AxiomInstance`, `GateInstance`, `HandoffRuleInstance`, `ProcedureStepInstance` | metaframework-v3-1 §3 |
| `MetaframeworkInput`, `GeneratedFrameworkTemplate` | metaframework-v3-1 §2 |
| `RegistryEntry`, `LifecycleState`, `AmendmentLogEntry` | framework-registry-v1-0 §2 |

### §2.4 Local atoms

Declared at point of use:

- `AuditDimension` — §3.2 (existing v1-1 content).
- `AuditDimensionTest` — §3.2 (existing v1-1 content).
- `AuditRequest` — §2.1 (new).
- `AuditRunRecord` — §5 Lifecycle (new; declared in §5 audit-trail format block).
- `SelfAuditRecord` — §8.1 (existing v1-1 schema).
- `GateResult`, `DimensionResult` — §8.1 (existing v1-1 schema).

### §2.5 Schema rules (ScR-series)

Inherited from metaframework-v3-1 §2.5 by reference. No framework-audit-local ScR additions.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only at this section per A-08.

---

## §3 Structure

### §3.1 Axes

Framework-audit carries the universal seven axes (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). This draft populates Structure only.

### §3.2 Audit dimensions (10)

Framework-audit declares ten audit dimensions. Every framework this audit operates on is evaluated across all ten. Dimensional-set authority: declared as judgment input `J-audit-dim-set` per Escalation 3. Amendable per MA-L5.

**Per-dimension shape:**
```
AuditDimension = {
  id: string,                  // X1–X10
  name: string,
  concern: string,             // one-sentence declaration
  test: AuditDimensionTest,    // mechanical test or criteria-bounded judgment
  reportingSchema: {
    result: 'pass' | 'fail' | 'n/a',
    basis?: string             // required for n/a; declared reason for non-applicability
  }
}

AuditDimensionTest =
  | { kind: 'mechanical', predicate: string }
  | { kind: 'criteria-bounded', judgmentId: JudgmentId, criteria: Criterion[] }
```

### §3.3 Five-step audit-cycle procedure (P0–P4)

Distributed across substrate-v1-1 Stages 1–5 per PR5 stage-content-kind alignment. Every step declares the amended P8 shape per substrate §8.3: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}` where the kind-specific field is populated per PG6 amended (substrate §11.2).

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **P0** | 1 | 1 | judgment-input | `AuditRequest` (per §2.1) | validated request + scope binding | `judgmentInputRef = J-audit-request-validation` (declared §7.10) |
| **P1** | 2 | 2 | mechanical | validated request + canonical tree at HEAD | cores anchor matrix (in-scope frameworks × {Identity / Schema / Axiom-Gate / Custody-Wiring}) + D1–D4 lens findings; substrate md5 entry attestation | `derivation = "for each in-scope framework F: read identity / schema / axiom / gate / custody cores per §3.4 dimensions; apply D1 declaration-integrity, D2 self-application, D3 cross-framework-flow, D4 dimensional-coverage lenses; record substrate md5 ENTRY value; halt on Kind A finding"` |
| **P2** | 3 | 3 | gate-execution | cores cleared (no Kind A) + in-scope gate set per cycle scope | per-cell gate results table (frameworks × gates) with cascade-effect column populated at row creation | `gates = [in-scope framework-tier gates per cycle scope; populated at audit-spec time per cycle's §2.2-class decision]` |
| **P3** | 4 | 4 | judgment-input | cells populated (from P2) + closing-flow specs (cycle-context) | flow verification results (typically 3 flows: self-application count-arithmetic, cross-framework propagation, prior-finding fold-in closure); findings register populated | `judgmentInputRef = J-audit-outcome-review` (declared §7.11) |
| **P4** | 5 | 5 | mechanical | flow results + entry attestation + populated findings register | `SelfAuditRecord` emitted per §8.1; substrate md5 EXIT attestation; HR-FA2 invoked with audit result payload | `derivation = "verify substrate md5 EXIT == ENTRY (or expected delta for substrate-amendment cycles); recompute frozen-input invariants (axiom count, framework-tier gate count, J-input count, HR count); assemble cascade-ordered findings register; emit SelfAuditRecord per §8.1; invoke HR-FA2 per §6.2 contract"` |

**Per-step notes.** P0 validates the audit request before any tree read — invalid scope or unresolved framework refs halt before any I/O. P1 is the cores-first cascade (anchor identification + D1–D4 lens application); Kind A findings at P1 halt the cycle before gate execution to prevent cascading failures. P2 executes the cycle-scoped gate set; gate selection is declared at audit-spec time, not partitioned across a fixed set the way gen-proc's E1–E8 partition the 80 framework-tier gates. P3 verifies closing flows (typically self-application count-arithmetic, cross-framework propagation, prior-finding fold-in closure); criterion-bounded judgment per MA-J2. P4 assembles the SelfAuditRecord and invokes HR-FA2 per §6.2 with audit-result payload; substrate md5 EXIT attestation is universal (cycles that intend to change substrate declare the expected delta in their spec; cycles that don't require EXIT == ENTRY).

**E-step shorthand.** P2 is the single Stage-3 gate-execution P8 instance. Gate set is cycle-scoped (not partitioning a fixed set). The cycle's spec declares which gates run; framework-audit invokes execution per substrate §1.3 S-03 multi-execution.

**Stage-monotonicity-and-kind-alignment self-check** (parallel to gen-proc §3.4 and AP §3.4):

| P-step | order | stage | declared kind | required kind per PR5 | aligned |
|---|---|---|---|---|---|
| P0 | 1 | 1 | judgment-input | judgment-input | ✓ |
| P1 | 2 | 2 | mechanical | mechanical | ✓ |
| P2 | 3 | 3 | gate-execution | gate-execution | ✓ |
| P3 | 4 | 4 | judgment-input | judgment-input | ✓ |
| P4 | 5 | 5 | mechanical | mechanical | ✓ |

Stage monotonicity (PR4): 1 < 2 < 3 < 4 < 5 ✓.

### §3.4 Dimension declarations

**X1 — Temporal / lifecycle self-consistency**

*Concern:* framework declares own version, own state transitions, and amendment propagation path.

*Test (mechanical):*
- Framework §1 Identity declares `version: Semver`.
- Framework §5 Lifecycle declares state transition rules (MA-L1, MA-L2, MA-L3, MA-L4, MA-L5).
- Framework §5 Lifecycle declares amendment propagation reference (to amendment-propagation framework).

*Reporting:* pass if all three present; fail with specific missing element named; n/a only if framework is declared-stateless (rare — requires declared basis).

*Closes:* B-01, B-02, B-03.

---

**X2 — Determinism / reproducibility**

*Concern:* framework's derivation operations are either fully mechanical OR declare judgment inputs per Escalation 3.

*Test (mechanical):*
- Every P8 procedure step (if generative) has kind ∈ {mechanical, judgment-input}.
- Every step with kind=`mechanical` has declared derivation.
- Every step with kind=`judgment-input` has declared judgmentInputRef resolving to a declared judgment input in framework §7.
- Every non-P8 derivation invoked in framework axiom conditions is either (a) reducible to substrate §6.3 mechanical-criterion ground OR (b) declared as judgment input.

*Reporting:* pass if all derivations have declared kind and complete specification; fail with specific non-deterministic derivation named; n/a only for purely-declarative frameworks with zero derivations (declared basis required).

*Closes:* B-04, B-05.

---

**X3 — Observability / introspection**

*Concern:* framework declares per-rule phase-source trace and audit-trail query interface.

*Test (criteria-bounded, judgment `J-audit-trace-format`):*
Criteria:
- C1: Every axiom in framework Structure §3 declares attachedTo reference (resolvable to axis/sub-axis/leaf).
- C2: Every gate in framework Validity §4 declares tests reference (resolvable to axiom).
- C3: Framework §5 Lifecycle declares audit-trail format (what gets logged when framework-audit runs — minimum: gate ID, timestamp, result, framework state hash).
- C4: Framework §5 declares query interface for past audit runs (reference to registry query path or equivalent).
- C5: Every HandoffRulePrimitive instance in framework Coupling axis with diagnosticSignificance: true declares populated `captureShape` per substrate §8.2 (P6 amended shape).

*Reporting:* pass if all five criteria met; fail with specific criterion named; n/a only if framework is exempt per declared basis (rare).

*Closes:* B-07, B-08, B-09.

---

**X4 — Negative space / declared out-of-scope**

*Concern:* framework declares what it does NOT do.

*Test (mechanical):*
- Framework §1 Identity or §2 Schema declares `scopeOut` list: enumerated concerns explicitly out of scope.
- `scopeOut` list has ≥1 entry (zero entries requires declared basis: "framework claims complete scope over its domain").
- Each `scopeOut` entry references either another framework that owns the concern OR declares "not addressed by any framework."

*Reporting:* pass if scopeOut present with entries; fail if absent or empty without basis; n/a only with declared exemption.

*Closes:* B-13.

---

**X5 — Scale / compositional behavior**

*Concern:* framework declares scaling behavior bounds for its operations.

*Test (mechanical):*
- Framework declares `scaleBounds` in §5 Lifecycle or §3 Structure:
  - Per-operation time complexity (O notation or explicit bound).
  - Per-operation space complexity.
  - Known compositional costs (e.g., "amendment-propagation cost O(N) per consumer framework").
- Bounds are declared, not measured. Measurement occurs at runtime; declaration is the contract.

*Reporting:* pass if scaleBounds declared for all framework operations; fail if operations without declared bounds; n/a for frameworks with single-operation surface and no composition (declared basis).

*Closes:* B-14, B-16.

---

**X6 — Operator / human interface**

*Concern:* framework declares interfaces for L0 (and other human operators) to invoke, review, confirm, and query the framework.

*Test (mechanical):*
- Framework Coupling axis declares `operatorInterface`:
  - Activation interface (how L0 triggers framework operations — for generative/verificative/structural frameworks).
  - Review interface (how L0 reads framework state — gate results, audit trails, outcomes).
  - Confirmation interface (how L0 confirms or escalates — AuthorityClaim format + confirmation record path).
  - Discovery interface (how L0 queries what this framework produces/consumes — reference to registry query).
- Each interface has declared format (structured — not prose).

*Reporting:* pass if all four declared; fail with specific interface missing; n/a only for frameworks with no L0 interaction (e.g., fully-automated internal frameworks — declared basis required).

*Closes:* B-19, B-20, B-21, B-22.

---

**X7 — Failure mode taxonomy**

*Concern:* framework declares expected failure modes and declared responses.

*Test (criteria-bounded, judgment `J-failure-taxonomy`):*
Criteria:
- C1: Framework §5 Lifecycle declares `failureModes` list covering: state corruption, state loss, cross-framework version disagreement (if applicable), post-deployment MA-G13 discovery, L0 unavailability (reference to substrate §13.6), judgment provenance unverifiable, phase-order violation during amendment.
- C2: Each declared failure mode has declared detection mechanism (gate, lifecycle event, or external signal).
- C3: Each declared failure mode has declared response (remediation procedure reference or escalation path).
- C4: Registry integration declared: failure events logged.

*Reporting:* pass if all criteria met; fail with specific criterion named; n/a for stateless frameworks with declared basis.

*Closes:* B-24, B-25, B-26, B-27, B-29, B-30.

---

**X8 — Bootstrapping / genesis**

*Concern:* framework declares its relationship to bootstrap — whether it exists at bootstrap, derives post-bootstrap, and how restore applies.

*Test (mechanical):*
- Framework §1 Identity declares `genesis`:
  - `bootstrapArtifact: boolean` — whether framework is part of bootstrap minimum set (true for substrate, metaframework; false for all others).
  - `genesisProvenance`: if bootstrapArtifact, declares "L0 hand-authored at bootstrap event"; otherwise references generation-procedure version that produced it.
  - `restoreMinimum: boolean` — whether this framework is required for system restore.

*Reporting:* pass if genesis declared; fail with specific missing field; n/a not applicable (every framework has a genesis).

*Closes:* B-31, B-32, B-33.

---

**X9 — Termination / closure**

*Concern:* framework declares lifecycle end states (terminated, deprecated) and retirement procedure; any framework-specific extensions to the canonical enum declared explicitly.

*Test (mechanical):*
- Framework §5 Lifecycle declares state ∈ substrate §9 `LifecycleState` enum (`{declared, applied, terminated, deprecated}`), or declares framework-specific extension (e.g., `{draft, canonical, retired}` or equivalent) with explicit extension basis per substrate S1+S3 (additive, no substitution).
- Framework §5 declares transition rules for reaching each declared state.
- Framework §5 declares retirement procedure: what happens to dependent frameworks, whether framework content is preserved or purged, registry record disposition.

*Reporting:* pass if state value ∈ canonical LifecycleState OR framework-specific extension declared + transitions + retirement procedure declared; fail with specific missing element (state not in canonical, no extension basis, missing transitions, or missing retirement procedure); n/a for in-perpetuity frameworks with declared basis.

*Closes:* B-34, B-36. Also closes R-0045 (state-enum mismatch) via canonical reference to substrate §9.

---

**X10 — Activation flow / end-to-end trace**

*Concern:* framework's operations trace cleanly into substrate §13 activation flow.

*Test (mechanical):*
- Framework Coupling axis declares handoff rule(s) that reference substrate §13 edges.
- Framework §5 Lifecycle declares atomicity per operation (atomic | interruptible, with recovery point) matching substrate §13.4 format.
- Framework participates in registry-lock protocol (substrate §13.5) — declared by Lifecycle rule binding operations to registry lock acquisition.
- Framework declares L0-unavailability behavior — inheritable from substrate §13.6 by reference, or overridden with declared basis.
- Every P8 procedure step in the framework declares `stage` per substrate §8.3 (P8 amended shape).
- Stage monotonicity holds across P8 steps (substrate §10.2 PR4).
- Stage-content-kind alignment holds for every P8 step (substrate §10.2 PR5).

*Reporting:* pass if all four declared; fail with specific missing element; n/a for frameworks entirely internal to another framework (declared basis required — rare).

*Closes:* B-37, B-38, B-39.

---

### §3.5 Per-dimension relationship table (per brief §3.2)

Dimensions are declared-not-MECE. Overlaps explicit:

| Dimension | Relationship |
|---|---|
| X6 Operator | Sub-concern of X4 Negative space for operator-domain scope declarations |
| X10 Activation flow | Cross-references X7 Failure taxonomy for failure-flow paths |
| X1 Temporal | Cross-references X9 Termination for state-enum transitions |
| X2 Determinism | Cross-references X8 Bootstrapping (bootstrap event is by-construction non-deterministic; post-bootstrap is deterministic) |
| X5 Scale | Cross-references X9 Termination (retired frameworks reduce scale surface) |
| No further dimension relationships declared | X1–X10 relationship table complete at Phase 1.2 canonical. |

Overlap is permitted and declared. Dimensions are not orthogonal axes — they are audit surfaces. A framework may pass on X6 but fail on X4 (operator-domain declared, but other domains not); treatment is per-dimension, not collective.

### §3.6 Dimension-set as judgment input

**Judgment input `J-audit-dim-set`:**
```
id: 'J-audit-dim-set'
kind: 'enumeration'
consumedBy: framework-audit-v1-3 §3 Structure
criteria: [
  {
    id: 'C1',
    predicate: 'Every dimension has declared ID, name, concern, test, reportingSchema',
    mechanical: true  // type-check + structural property per §6.3
  },
  {
    id: 'C2',
    predicate: 'Every dimension test is either mechanical or criteria-bounded per §6.3',
    mechanical: true
  },
  {
    id: 'C3',
    predicate: 'Dimension set covers the ten declared audit axes (X1–X10)',
    mechanical: true  // cardinality + enumeration check
  },
  {
    id: 'C4',
    predicate: 'No two dimensions declare identical concern',
    mechanical: true  // structural property
  }
]
provenance: {
  instanceId: 'builder-phase-1-1',
  cycleId: 'phase-1-1',
  timestamp: '<recorded at framework-audit finalization>',
  consumingFrameworkRef: framework-audit-v1-3,
  consumingStepId: '§3.2 dimension declaration'
}
```

Dimension set amendable per MA-L5: future L0 amendment may add dimensions (additive — existing dimensions not removed without migration).

### §3.7 Primitive instances

Per substrate §8 + §8.6 empty-declaration derivation. New in v1-2.

| Primitive | Count | Notes / basis |
|---|---|---|
| P1 Axis | 7 (inherited) | per metaframework-v3-1 §3.1 universal seven-axis decomposition |
| P2 Sub-axis | 0 | `{primitiveKind: P2, instanceCount: 0, basis: "flat axis structure; no sub-axes declared at framework-audit level"}` |
| P3 Leaf | inherited via axes | per metaframework-v3-1 |
| P4 Axiom | 0 own + 64 inherited | audit-dimension-completeness invariant expressed via X1–X10 coverage at §3.4 + dimension-set integrity via own gates G-FA1–G-FA3 at §4, not as new axiom |
| P5 Gate | 3 own (G-FA1–G-FA3, declared §4) + 80 inherited framework-tier from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` atom) | own gates test framework-audit's own integrity surface (dimension-set declaration completeness, dimension-test mechanicality declaration, per-framework audit completion); not duplicative of inherited G-U1/G-M1/G-M2 per §4 |
| P6 Handoff rule | 2 own | HR-FA1 (receive HR3 from metaframework), HR-FA2 (emit audit result via HR5 to registry); declared §6 |
| P7 Judgment input | 9 own | J-audit-dim-set (existing §3.6), J-audit-trace-format (per X3 criteria-block at §3.4), J-failure-taxonomy (per X7 criteria-block at §3.4); 4 added at v3.2.3: J-authority-source-classification (consumed by G-I6), J-axis-concern-coverage (consumed by G-St11), J-axiom-text-declarative (consumed by G-St14), J-amendment-trigger-context (consumed by G-L8); 2 added at MF-amendment-1: J-audit-request-validation (consumed at P0 per §3.3), J-audit-outcome-review (consumed at P3 per §3.3); all 9 enumerated at §7 |
| P8 Procedure step | 5 | P0–P4 declared §3.3 (five-step audit-cycle procedure: Stage 1 P0 judgment-input → Stage 2 P1 mechanical → Stage 3 P2 gate-execution → Stage 4 P3 judgment-input → Stage 5 P4 mechanical); declared per substrate §8.3 P8 shape with PR4 stage monotonicity + PR5 stage-content-kind alignment satisfied per self-check at §3.3 |

Positive empty-declaration markers per substrate §8.6 for P2 and P8 zero counts. Implicit-absence disallowed.

### §3.8 Vocabulary (framework-audit-local)

Framework-local terms declared inline at point of use per PR1 (substrate §10.2). Substrate, metaframework, and registry terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `AuditDimension` | §3.2 | per-dimension shape (id, name, concern, test, reportingSchema) |
| `AuditDimensionTest` | §3.2 | union: mechanical predicate OR criteria-bounded judgment |
| `AuditRequest` | §2.1 | input atom (targetFrameworkRef, auditScope, triggerEvent, initiator, timestamp) |
| `AuditRunRecord` | §5 (audit-trail format) | per-run record (runId, auditRequestRef, timestamps, results, captureShape) |
| `SelfAuditRecord` | §8.1 | output atom (per-framework gate + dimension results) |
| `GateResult`, `DimensionResult` | §8.1 | per-gate / per-dimension result entries within SelfAuditRecord |

---

## §4 Validity

### §4.1 Gate count

Framework-audit declares **3 own gates** (G-FA1, G-FA2, G-FA3) plus inherits **80 framework-tier gates** from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` atom).

| Category | Count | IDs |
|---|---|---|
| Own gates (framework-audit-specific) | 3 | G-FA1, G-FA2, G-FA3 |
| Inherited framework-tier gates | 80 | per metaframework-v3-1 §4.1 + `MetaframeworkGateIdSet` atom (§6.5): PG1–PG7, axiom gates G-I1..G-I7, G-S1..G-S6, G-St1..G-St16, G-V1..G-V9, G-L1..G-L10, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1–G-U5, G-M1–G-M4. Substrate gates SG1–SG4 excluded per substrate §11.5 tier-1. |
| **Total applicable to framework-audit itself** | **83** (3 own + 80 inherited) | derived sum |

Total is mechanically derived from the two rows above: 3 + 80 = 83. No literal carried; row updates automatically when either source count changes per MA-S5.

Note on inherited gates that apply trivially: framework-audit declares zero own axioms (per §3.7 P4 row + §4.5). The 35 inherited axiom-gates that test MA-axiom conformance still execute against framework-audit but are vacuous-pass over the empty axiom set. Vacuous-pass remains a `pass` per MA-V3 ternary; no exclusion-set semantics apply. All 80 inherited gates are applicable; all 3 own gates are applicable; total 83.

Per L0 ruling on Q1 (Phase 9f spec §8 Q-9f-1): three own gates declared. G-U1 self-application covers running existing inherited gates against framework-audit itself, but does NOT verify (a) the 10-dimension set exists as declared, (b) AuditDimensionTest fields are populated per §3.2 shape, or (c) per-framework audit produces a complete SelfAuditRecord across all 10 dimensions + framework-tier gates. G-FA1–G-FA3 close those gaps.

### §4.2 Own gates

#### §4.2.1 G-FA1 — Dimension-set coverage

*Claim:* All ten audit dimensions (X1–X10) are declared at §3.4 with complete `AuditDimension` shape per §3.2.

*Test (mechanical):*
- Enumerate dimension declarations in §3.4.
- Verify count = 10.
- Verify each declaration has all five fields per `AuditDimension` shape: id ∈ {X1..X10}, name (non-empty), concern (one-sentence), test (AuditDimensionTest with valid kind), reportingSchema (with result enum + basis-when-n/a clause).

*Reporting:* pass if 10 complete dimension declarations; fail with specific dimension ID + missing field; n/a not applicable.

*Tests:* §3.4 dimension-declaration completeness invariant.

*Escalation path:* G-FA1 failure → MA-L4 amendment trigger (dimension declaration block must be repaired before next audit).

#### §4.2.2 G-FA2 — Dimension-test mechanicality declared

*Claim:* Each `AuditDimensionTest` declares `kind` ∈ {'mechanical', 'criteria-bounded'} with kind-specific fields populated per §3.2 union shape.

*Test (mechanical):*
- For each AuditDimensionTest at §3.4:
  - If `kind: 'mechanical'` → declared `predicate` (non-empty string).
  - If `kind: 'criteria-bounded'` → declared `judgmentId` (resolves to declared J-input at §7) AND declared `criteria: Criterion[]` (non-empty array).
- Test fails if any dimension declares neither variant or declares the variant with missing kind-specific field.

*Reporting:* pass if all 10 tests well-typed; fail with specific dimension + missing field; n/a not applicable.

*Tests:* §3.4 + §3.2 dimension-test type-completeness invariant.

*Escalation path:* G-FA2 failure → MA-L4 amendment trigger.

#### §4.2.3 G-FA3 — Per-framework audit completion

*Claim:* Every accepted `AuditRequest` produces a `SelfAuditRecord` populated with results across all 10 dimensions + all framework-tier gates declared for the target framework.

*Test (mechanical):*
- For each accepted `AuditRequest` (per §5 lifecycle):
  - Resolve to corresponding `SelfAuditRecord`.
  - Verify `dimensionResults: DimensionResult[]` has length = 10 with one entry per X1..X10.
  - Verify `gateResults: GateResult[]` has length ≥ N where N = framework-tier gate count per `MetaframeworkGateIdSet` (80 gates per metaframework §6.5 atom declaration).
  - Verify `overallResult` ∈ {'pass', 'fail', 'pending'}.

*Reporting:* pass if every accepted request produces complete record; fail with specific request ID + missing dimension/gate; n/a not applicable.

*Tests:* §5 lifecycle audit-completion invariant + §8.1 SelfAuditRecord shape.

*Escalation path:* G-FA3 failure → MA-L4 amendment trigger; incomplete audit results invalidated; re-run required.

### §4.3 Inherited framework-tier gates

Inherited per metaframework-v3-1 §4.1. Applied to framework-audit itself when framework-audit performs its own self-audit (per G-U1 self-application + §8.3 closure).

Gate ID enumeration matches metaframework §4.7:

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S6, G-St1..G-St16, G-V1..G-V9, G-L1..G-L10, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §4.4 Gate execution

- **Self-application:** framework-audit executes inherited framework-tier gates + own G-FA1–G-FA3 against framework-audit itself per G-U1 self-application + §8.3 closure.
- **Audit of other frameworks:** per HR-FA1 receive (§6.2). Framework-audit runs the requesting framework's own gate set + executes X1–X10 dimension tests against the framework's content.
- **MULTI-EXEC per substrate §1.3 S-03:** generation-procedure declares Stage-3 gate-reference checkpoints (E1–E8); framework-audit invokes those checkpoints per F-69 distribution table at metaframework §4.3.

### §4.5 Meta-gate compliance

When audited (by self-application or by another instance), framework-audit is subject to metaframework's meta-gates G-M1–G-M4 (axiom-gate 1:1 mapping, gate-set exhaustive, execution order, escalation path declared). Per §3.7 row P4: framework-audit declares zero own axioms, so G-M1/G-M2 reduce to inherited-axiom mapping coverage. G-M3/G-M4 apply to framework-audit's own gates G-FA1–G-FA3 (each declared escalation path at §4.2 sub-sections).

### §4.6 Backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run; substrate-tier failure terminal. Applies to framework-audit's audit results when framework-audit itself fails its own self-audit.

#### §4.6.1 GR-series rule set declared

GR-series extracted from existing canonical gate-execution sections (G-FA1, G-FA2, G-FA3; substrate §11 PG/SG; metaframework §4.2 G-M1–G-M4) per Phase 4 §6.0.1 of v3.2.3 cycle. Authoritative declaration site (closure item 1; metaframework §4.6 references GR-series; v3-1-spec §3.4 references GR-series; this section is the authoritative source).

- **GR-1 — Claim declared.** Every gate declares a *Claim* statement (the assertion the gate verifies). Source basis: G-FA1/G-FA2/G-FA3 explicit Claim fields (§4.2.1–§4.2.3); substrate §11 PG/SG declarations; metaframework §4.2 G-M1–G-M4 explicit.
- **GR-2 — Test kind enumerated.** Every gate declares *Test (mechanical)* OR *Test (criteria-bounded, judgment {J-id})*. Source basis: substrate §11.6 ("Every substrate gate is mechanical"); framework-audit §3.2 AuditDimensionTest discriminated union; framework-audit §4.2 own gates.
- **GR-3 — Reporting declared.** Every gate declares *Reporting* with `result ∈ {pass, fail, n/a}` and `basis-when-n/a`. Source basis: framework-audit §3.2 AuditDimension shape; G-FA1–G-FA3 explicit reporting fields.
- **GR-4 — Tests-axiom binding declared.** Every gate declares *Tests:* citing ≥1 axiom or invariant ref. Source basis: substrate §11.2 PG4 ("every gate tests ≥1 axiom"); metaframework §4.2 G-M1 (1:1 mapping with multi-axiom-gate justification).
- **GR-5 — Escalation path declared.** Every gate declares *Escalation path* (which lifecycle event triggers on failure, per MA-L4). Source basis: metaframework §4.2 G-M4; framework-audit §4.2 G-FA1–G-FA3 explicit.
- **GR-6 — Result is binary.** Every gate's result is binary (pass/fail; n/a is non-applicability declaration, not a third truth value). Source basis: substrate §11.6 ("Gate results binary").

**Conformance test (recoverability, not field-label parse):** every declared gate (substrate-tier + framework-tier + own framework gates) carries the GR-1..GR-6 substance. The substance is *recoverable* from the gate's own declaration, from the framework's framework-level declarations (result enum at §4, escalation at §5 failure modes, axiom set at §3), or from any combination thereof. Layout is not declared by GR-1..GR-6; substance is. Frameworks may render gates in expanded per-gate Claim/Test/Reporting/Tests/Escalation blocks (G-FA1–G-FA3 use this shape) or in compact tabular form (gate-id, axiom-binding, predicate, ground-class — used by L3 frameworks and by the inherited 80 framework-tier gates declared as a compact ID enumeration at metaframework §4.7); both forms satisfy GR-1..GR-6 by recoverability of substance. MA-V9 (declared at v3.2.3 cycle, metaframework §3.2 + spec §3.2.6) tests this conformance per-gate; G-V9 is the corresponding gate predicate (declared §4.8.4 below).

### §4.7 Current gate results

**All 3 own gates + 80 inherited framework-tier gates: state = `not-yet-run`.** First-run pending post-9g (when amendment-propagation framework completes the six-file system and L0 confirms first system-wide audit cycle); 28 v3.2.3-added gates first-run deferred to next audit cycle per cycle scope §1.5.

Compact summary per sprint-mode + metaframework §4.7 pattern.

### §4.8 v3.2.3 axiom-gate predicate authorship

Authoritative declaration site for the 28 v3.2.3 axiom-gate predicates per Phase 5 + Phase 7 cascade (closure item 1; metaframework §4.6 + spec §3.4 reference GR-series declared §4.6.1; this §4.8 declares per-gate Claim/Test/Reporting/Tests/Escalation per GR-1..GR-6 conformance). Per-axis sub-sections §4.8.1–§4.8.7.

**Common reporting + escalation pattern** (per GR-3 + GR-5 + GR-6, applies to all 28 gates below unless overridden):

- *Reporting:* `result ∈ {pass, fail, n/a}`. Mechanical gates: `pass` if test predicate holds for all enumerated targets; `fail` with first-failing-target-id; `n/a` only when target set is empty per declared applicability rule. Criteria-bounded gates: `pass` post-judgment binary outcome from referenced J-input; `fail` with cited criterion(s) failing; `n/a` per applicability rule.
- *Escalation path:* gate failure → MA-L4 amendment trigger; tested axiom flagged `fail` until remediation; remediation re-runs at next audit cycle.

#### §4.8.1 Identity gate predicates (G-I6, G-I7)

##### §4.8.1.1 G-I6 — Authority-source classification per audit-trail entry

*Claim:* For every (operation o, AuthorityClaim ac) pair recorded in framework's audit trail, ac.level ∈ classify(ac.source) per J-authority-source-classification.

*Test (criteria-bounded, judgment J-authority-source-classification):* Enumerate (o, ac) pairs from audit trail; per pair, invoke J-authority-source-classification on ac.source; verify ac.level matches classification output.

*Tests:* MA-I6.

##### §4.8.1.2 G-I7 — Four-property MA-G13 declaration completeness

*Claim:* For every framework F in registry, F's §1 Identity declares all four MA-G13 properties: ownState (ref §5), ownIO (ref §2), ownInvariants (ref §3 axiom set), ownDiscipline (ref §3 axis decomposition + §4 gates).

*Test (mechanical):* Enumerate frameworks via registry §5; per F, grep §1 for explicit declarations of ownState / ownIO / ownInvariants / ownDiscipline; verify each resolves to populated section.

*Tests:* MA-I7.

#### §4.8.2 Schema gate predicates (G-S4, G-S5, G-S6)

##### §4.8.2.1 G-S4 — Typed-shape reference resolution

*Claim:* For every reference r in framework prose to a typed-shape element (atom, enum-value, vocabulary-term), there exists declared instance d such that r resolves to d (atoms → §2.4; enums → substrate §9 / framework-local §3; vocabulary → §3.5 + substrate §9).

*Test (mechanical):* Enumerate reference tokens by type-class via grep; per reference, verify resolution into declared set.

*Tests:* MA-S4.

##### §4.8.2.2 G-S5 — Cross-file atom-instance value consistency

*Claim:* For every cross-file restatement of an atom-instance value (cardinality, count, or other declared atom-instance scalar), all restatements across canonical-package files resolve to the same value.

*Test (mechanical):* Per atom-instance, collect all sites referencing it across canonical files (grep over canonical package); compare values; verify all equal.

*Tests:* MA-S5.

##### §4.8.2.3 G-S6 — ID-set cardinality + resolution

*Claim:* For every gate-set or other ID-set atom in framework's local atom set with `cardinality: N` property, the enumerated ID list has length N; every ID resolves to a declared instance.

*Test (mechanical):* Per ID-set atom, parse cardinality declaration, count enumerated IDs, compare; verify each ID resolution.

*Tests:* MA-S6.

#### §4.8.3 Structure gate predicates (G-St6 .. G-St16)

##### §4.8.3.1 G-St6 — Empty-declaration zero-children

*Claim:* For every primitive-instance site x in framework where `emptyDeclared:true` is declared, x has zero child element declarations (no nested sub-axes, leaves, axioms, gates, HRs, or other instances).

*Test (mechanical):* Enumerate emptyDeclared sites; per site, scan child-element declarations within lexical scope; verify count = 0.

*Tests:* MA-St6.

##### §4.8.3.2 G-St7 — Primitive prose-claim signature coverage

*Claim:* For every primitive P with declared signature, and for every prose-claim about P, the dimension d named in the prose-claim ∈ S(P) ∪ R(P), where S(P) = signature parameters and R(P) = explicitly-declared external resolution references. Prose-claim extraction rule: a prose-claim about P is any sentence in framework §3 (Structure) or §2 (Schema) that (a) names P (by primitive-id or substrate-§8-declared-name), (b) followed within the same sentence or paragraph by a property descriptor — words "has", "with", "carries", "owns", "declares", "covers", "exposes" — and (c) is not inside a code block.

*Test (mechanical):* Per primitive P, enumerate prose-claims via the extraction rule; enumerate S(P) (parse signature) and R(P) (parse declared resolution refs); per prose-claim d, verify d ∈ S(P) ∪ R(P).

*Tests:* MA-St7.

##### §4.8.3.3 G-St8 — External-resolution dimension coverage

*Claim:* For every primitive P, every dimension d ∈ R(P) has a declared resolution mechanism (named axiom, named gate, named handoff).

*Test (mechanical):* Per P, enumerate R(P); per d ∈ R(P), grep framework axiom/gate/HR declarations for surface-coverage of d; verify ≥1 match.

*Tests:* MA-St8.

##### §4.8.3.4 G-St9 — P8 reference resolution by kind

*Claim:* For every P8 procedure-step instance ps: if ps.kind = `judgment-input`, ps.judgmentInputRef resolves to declared P7 in framework §7; if ps.kind = `gate-execution`, every entry in ps.gates resolves to declared P5 in framework §4.

*Test (mechanical):* Enumerate P8 instances; per instance, branch on kind; verify ref resolution into appropriate section.

*Tests:* MA-St9.

##### §4.8.3.5 G-St10 — P7 instance field completeness

*Claim:* For every P7 instance ji declared in framework §7, ji has populated fields: `criteria` (non-empty list), `judgmentId` (resolvable identifier), `mechanicalGround` (resolvable per MA-J5).

*Test (mechanical):* Enumerate P7 instances; per instance, verify each field populated; mechanicalGround resolution checked via MA-J5 / G-J5.

*Tests:* MA-St10.

##### §4.8.3.6 G-St11 — Axis concern-coverage by axiom set

*Claim:* For every axis or sub-axis x with concern-statement c, the collective axiom set bound to x covers c — every subclaim s in concern-decomposition(c) is tested by ≥1 axiom bound to x.

*Test (criteria-bounded, judgment J-axis-concern-coverage):* Per axis, invoke J-axis-concern-coverage to decompose concern into subclaim list; per subclaim, enumerate axioms bound to axis and verify ≥1 covers subclaim.

*Tests:* MA-St11.

##### §4.8.3.7 G-St12 — P8 order injection

*Claim:* For every framework procedure (P8 instances belonging to one operation, identified by shared operation-identifier), the `order` field is a total injection — no two instances share the same order value.

*Test (mechanical):* Group P8 instances by operation-id; per group, enumerate order values; verify no duplicates.

*Tests:* MA-St12.

##### §4.8.3.8 G-St13 — Single-condition + no-axiom-as-test-reference

*Claim:* For every axiom a, a.text states exactly one mechanical condition (a.text contains exactly one assertion clause, identifiable by single declarative verb-phrase) AND a.text contains no axiom-as-test-reference shape (no clause matching pattern "tests <gate-id>" or "is verified by <gate-id>" embedded in axiom statement).

*Test (mechanical):* Per axiom, parse a.text; count assertion clauses; scan for test-reference shape via regex on gate-id pattern.

*Tests:* MA-St13.

##### §4.8.3.9 G-St14 — Axiom text declarative-form

*Claim:* For every axiom a, a.text is in declarative form per AxR4.

*Test (criteria-bounded, judgment J-axiom-text-declarative):* Per axiom, invoke J-axiom-text-declarative on a.text; criteria-bounded judgment outputs pass/fail.

*Tests:* MA-St14.

##### §4.8.3.10 G-St15 — Cardinality declared-vs-enumerated

*Claim:* For every primitive cardinality declaration c in framework §3.4, c.declaredCount = count(c.enumeratedInstances); cross-primitive cardinality assertions (e.g., "P3 count = P4 count" if "one leaf per axiom" declared) hold.

*Test (mechanical):* Parse §3.4 table; per row, count enumerated IDs and compare to declared count; parse cross-primitive assertions and verify.

*Tests:* MA-St15.

##### §4.8.3.11 G-St16 — Axiom testability classification

*Claim:* For every axiom a in framework F, a's testability ∈ {`mechanical`, `criteria-bounded`} is recoverable from a's relationship to F's declared J-input set (P7 instances per §3.6); criteria-bounded axioms reference a J-input declared at F's §7 with `mechanicalGround` field populated.

*Test (mechanical):*
- Let J = F's declared J-input set (P7 instances, per F's §7). When P7 = 0 with positive emptyDeclared basis (substrate §8.6), J = ∅.
- For each axiom a in F's axiom set:
  - Compute `a.references_J` = (a's mechanical condition references any j ∈ J).
  - If `a.references_J`: classify `testability(a) = 'criteria-bounded'`; verify the referenced J-input is declared at F's §7 with `mechanicalGround` field populated.
  - Else: classify `testability(a) = 'mechanical'`; verify a's mechanical condition reduces to a substrate §6.3 mechanical-criterion ground class (recoverable from F's per-axiom Ground-class column or equivalent).
- Cross-check: `count({a : testability(a) = 'criteria-bounded'}) === |J consumed by axioms|`.
- Test passes iff every axiom is classifiable + cross-check holds.
- Test fails iff any axiom is unclassifiable, or any criteria-bounded axiom's J-input ref is unresolvable, or cross-check fails.

*Reporting:* pass if classifiable + cross-check holds; fail with specific axiom + reason; n/a not applicable.

*Tests:* MA-St16.

*Escalation path:* G-St16 failure → MA-L4 amendment trigger; framework's axiom set or §7 J-input declarations must be repaired.

*Rationale:* testability is derivable from P7-membership rather than declared as a separate field. Per substrate §1.3 S-03 single-source: an explicit `testability` field on each axiom would duplicate information already carried by P7-membership at F's §7. The Ground-class column in F's §3.6 axiom table is the surface where the mechanical case is visible; J-input reference is the surface where the criteria-bounded case is visible. G-St16 derives from these surfaces rather than requiring a new declared field.

#### §4.8.4 Validity gate predicates (G-V6 .. G-V9)

##### §4.8.4.1 G-V6 — Predicate-condition implication for axiom-gate pairs

*Claim:* For every (axiom a, gate g) pair where g.tests includes a, g.predicate's mechanical conditions imply a.condition (1:1 mapping per G-M1: equivalence required; multi-axiom-gate per A-24: conjunction of g.predicate conditions over g.tests entries collectively cover each tested axiom's condition). Implication test grounds via substrate §6.3 mechanical-criterion ground; non-trivial implication cases that cannot be reduced to substrate §6.3 are surfaced as audit-note for L0 review (does NOT escalate to J-input — predicate remains mechanical with declared edge-case caveat).

*Test (mechanical, with declared edge-case audit-note caveat):* Enumerate (a, g) pairs; per pair, parse predicate and condition; verify implication via mechanical predicate-condition comparison referencing substrate §6.3. Record edge-cases as audit-notes per audit-trail format.

*Tests:* MA-V6.

##### §4.8.4.2 G-V7 — Gate-tests reference resolution

*Claim:* For every gate g, every reference in g.tests resolves to a declared axiom in framework's axiom set (§3.2).

*Test (mechanical):* Enumerate gates; per gate, enumerate g.tests entries; verify each ref resolves into §3.2.

*Tests:* MA-V7.

##### §4.8.4.3 G-V8 — Authority-required ≤ AuthorityClaim under enum order

*Claim:* For every (operation o, triggering AuthorityClaim ac) pair recorded in framework's audit trail, o.requiredAuthority ≤ ac.level under substrate §5 authority-enum partial order.

*Test (mechanical):* Enumerate (o, ac) pairs; per pair, verify required ≤ claim under enum order.

*Tests:* MA-V8.

##### §4.8.4.4 G-V9 — Gate-rule (GR-1..GR-6) conformance

*Claim:* For every declared gate g in framework F, the six properties named by GR-1..GR-6 (declared §4.6.1) are *recoverable* from g's declaration. Layout is not declared; substance is required.

*Test (mechanical):* For each gate g, verify each of the six properties is recoverable from g's declaration block, from F's framework-level result enum or escalation table, or from any combination thereof:

- **GR-1 (claim recoverable):** g declares what it tests — via axiom binding, declared predicate, or claim text. Either form satisfies.
- **GR-2 (test recoverable):** g declares a mechanical predicate or test body, with kind ∈ {`mechanical`, `criteria-bounded`} resolvable from the predicate form (criteria-bounded iff the predicate references a J-input declared at F's §7).
- **GR-3 (reporting recoverable):** g's result type ∈ {`pass`, `fail`, `n/a`} is recoverable from F's framework-level result enum (typically declared at the §4 result-shape block or equivalent) or per-gate. Either form satisfies.
- **GR-4 (axiom binding recoverable):** g declares its bound axiom (1:1 per G-M1; or ≥1 per A-24 multi-axiom-gate). Recoverable from gate's `tests`/`testedAxiomId` field or equivalent table column.
- **GR-5 (escalation recoverable):** g's failure path is resolvable to F's framework-level §5 failure-modes table or per-gate escalation declaration. Either form satisfies.
- **GR-6 (binary result recoverable):** g's result reduces to {`pass`, `fail`} ∪ {`n/a` as vacuous-pass}. Recoverable from F's result enum or per-gate.

Pass iff all six properties recoverable for every gate. Fail iff any of the six is absent from both per-gate and framework-level declaration for any gate.

*Reporting:* pass if all gates recoverable; fail with specific gate ID + missing property; n/a not applicable.

*Tests:* MA-V9.

*Escalation path:* G-V9 failure → MA-L4 amendment trigger; the framework's gate declarations or framework-level result/escalation tables must be repaired so that the missing property is recoverable.

*Rationale:* GR-1..GR-6 declare what every gate must satisfy in substance; they do not declare a layout. Frameworks may render gates in expanded per-gate Claim/Test/Reporting/Tests/Escalation blocks (framework-audit's own G-FA gates use this shape), in compact tabular form (gate-id, axiom-binding, predicate, ground-class — used by L3 frameworks and by the inherited framework-tier gates declared at metaframework §4.7 as a compact list), or any combination. G-V9 tests recoverability of substance, not layout. The inherited 80 framework-tier gates declared as a compact ID enumeration at metaframework §4.7 satisfy GR-1..GR-6 by construction: the substance lives in the metaframework axiom-table + result-enum + framework-level escalation discipline; G-V9 recovers it from those sources.

#### §4.8.5 Lifecycle gate predicates (G-L8, G-L9, G-L10)

##### §4.8.5.1 G-L8 — Amendment-trigger context classification

*Claim:* For every amendment cycle c in framework's amendment log, c.declaredTrigger ∈ {`vision`, `gap`, `L0-directive`} matches actual surfacing-context classification per J-amendment-trigger-context.

*Test (criteria-bounded, judgment J-amendment-trigger-context):* Enumerate amendment cycles; per cycle, invoke J-amendment-trigger-context on cycle's surfacing context; compare classification to declared trigger.

*Tests:* MA-L8.

##### §4.8.5.2 G-L9 — Version-transition no-removal

*Claim:* For every version transition F.vN → F.vN+1, diff(vN, vN+1) contains no removal of declared elements (axioms, gates, primitives, HRs, atoms, J-inputs, P8 steps); only additions and modifications-of-non-removable-fields permitted.

*Test (mechanical):* Compute diff between successive versions; scan for removal patterns over enumerated element classes; verify zero removals.

*Tests:* MA-L9.

##### §4.8.5.3 G-L10 — Confirmation-log monotonicity

*Claim:* For every confirmation log (ordered by timestamp), state transitions are monotonic: no entry transitions a state from `confirmed` back to `unconfirmed` or `pending`.

*Test (mechanical):* Parse confirmation log; per state, verify transition history monotonic per substrate §9 LifecycleState ordering.

*Tests:* MA-L10.

#### §4.8.6 Coupling gate predicates (G-C7 .. G-C10)

##### §4.8.6.1 G-C7 — Custody cross-boundary HR coverage

*Claim:* For every cross-framework data-flow declared in framework's custody table — atom row with cross-boundary direction or cross-framework consumer — there exists a declared HR in §6.2 whose direction and endpoints match.

*Test (mechanical):* Parse custody table; per cross-boundary row, parse declared (direction, endpoints); enumerate HRs and verify one HR matches.

*Tests:* MA-C7.

##### §4.8.6.2 G-C8 — HR endpoint registry resolution

*Claim:* For every HR h in framework §6.2, h.endpoints (FrameworkRef values) resolve to registry-registered frameworks OR h declares bootstrap-exemption basis.

*Test (mechanical):* Enumerate HRs; per HR, lookup endpoints in registry; if not registered, verify exemption basis declared.

*Tests:* MA-C8.

##### §4.8.6.3 G-C9 — Cross-framework ID-content coherence

*Claim:* For every pair of frameworks F1, F2 in registry.activeFrameworks, for every ID-bearing element e (axiom, gate, J-input, HR, primitive instance) declared by F1 with same ID as e' declared by F2, content(e) = content(e') OR registry declares the cross-framework ID-overlap as exempt with basis.

*Test (mechanical):* Cross-framework grep over ID-bearing element classes; per ID collision, compare content for equality; if mismatch, verify registry exemption row.

*Tests:* MA-C9.

##### §4.8.6.4 G-C10 — Substrate-version pin uniformity

*Claim:* For every pair of frameworks F1, F2 in registry.activeFrameworks, F1.substrateVersion = F2.substrateVersion OR one declares cross-framework substrate-version exemption with basis.

*Test (mechanical):* Enumerate active frameworks; per pair, compare substrateVersion field; if mismatch, verify exemption.

*Tests:* MA-C10.

#### §4.8.7 Judgment gate predicates (G-J5)

##### §4.8.7.1 G-J5 — J-input mechanicalGround field resolution

*Claim:* For every J-input declaration ji in framework §7 with `mechanicalGround: g` field, g resolves to a declared substrate or framework reference (substrate § ref or framework F.§ ref where F is registry-registered).

*Test (mechanical):* Enumerate J-inputs; per J-input with mechanicalGround field, parse ground ref; verify resolution into declared substrate/framework reference.

*Tests:* MA-J5.

---

## §5 Lifecycle

### §5.1 Version transition

v1-1 → v1-2 → v1-3 → v1.3.1. Additive per MA-L1. v1-3 (Phase 1.2-fix delivery) amendments: §3.3 X9 state-enum references substrate §9 LifecycleState per R-0045; §4.2.3 G-FA3 test body references MetaframeworkGateIdSet atom per R-0049; §3.5 + §7.5 provenance consumingFrameworkRef refreshed v1-0 → v1-3 per R-0047; §3.4 placeholder replaced with explicit closure text per R-0046; §3.6 + §4.1 + §4.7 + §5.7 + §8.3 gate count 45→52 per R-0020 cascade; §9 change log row added. v1.3.1 (Phase 1.2-fix-trail hygiene): §8.2 SelfAuditRecord inline example + heading text updated to reflect canonical self-version v1-3 per RF-02. Patch-level bump; no structural amendment.

### §5.2 Amendment trigger

Gap-driven per MA-L4. Amendment paths to framework-audit:
- New audit dimension (X11+) → MA-L5 amendment to dimension set + J-audit-dim-set re-confirmation.
- Modification to existing X-dimension test → MA-L4 amendment + version bump.
- Addition of own gates beyond G-FA1–G-FA3 → MA-L4 amendment + version bump.
- Schema amendment to AuditRequest, SelfAuditRecord, AuditRunRecord → MA-L4 amendment.

All amendments require:
- Amendment rationale (gap or L0 directive).
- v3-1-spec §1.3 ledger row.
- Re-run of G-spec-1 through G-spec-8 against amended file.
- Registry amendment log entry per framework-registry-v1-0 §2.4.

### §5.3 Confirmation gate

L0 confirms at Phase 9f delivery (this delivery = v1-2). Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` at delivery.

### §5.5 Judgment deprecations

Empty at delivery. J-audit-dim-set (§3.6), J-audit-trace-format (per X3), J-failure-taxonomy (per X7) all active.

### §5.6 Failure modes

Per v3-1-spec §3.3 output-schema `lifecycle` field (V5-verification additions):

- **AuditRequest with invalid `targetFrameworkRef`** → reject with declared-error code; no SelfAuditRecord produced; escalate to L0 if `triggerEvent = 'L0-initiated'`.
- **Dimension test failure (any of X1–X10)** → populate corresponding `DimensionResult.result = 'fail'` with `details` field; proceed with remaining dimensions per §4.4 (per-dimension audit is independent).
- **Framework-tier gate failure (any inherited gate)** → populate `GateResult.result = 'failed'` with optional `evidence`; aggregate `SelfAuditRecord.overallResult = 'fail'` if any required gate failed.
- **Own gate failure (G-FA1, G-FA2, G-FA3)** → framework-audit's own integrity violated; escalate to L0 immediately per G-FA{n} escalation path at §4.2; suspend audit acceptance until repair confirmed.
- **Meta-gate backward-invalidation** → per metaframework §4.5 rule (tier-4 failure → re-run tier-3, etc.).
- **L0 unavailability during audit** → suspend per substrate §13.6; state persists in registry; resume idempotently on L0 return.
- **HR-FA2 invocation rejected by registry (IG1–IG5 violation)** → audit result not persisted; escalate to L0; framework-audit retains result in own audit-trail until registry write succeeds.

### §5.7 Scale bounds

Per V5 verification:

- Bounded by audited-framework count (one SelfAuditRecord per audit per framework).
- Retention-policy history depth (default: last 10 SelfAuditRecords per framework per §8.2).
- Per-audit cost: O(D + G) where D = dimension count (10) and G = framework-tier gate count applicable to target (80 for any L2 framework per `MetaframeworkGateIdSet`; potentially fewer for non-framework artifacts per declared exemption).
- Total state grows O(F × R) where F = framework count and R = retention depth.

Bounds declared, not measured. Runtime measurement deferred post-9g.

### §5.8 Atomicity declarations

- **Per-dimension test execution:** atomic per dimension (one DimensionResult per atomic test invocation).
- **Per-gate execution:** atomic per gate (one GateResult per atomic gate invocation).
- **Full audit run:** interruptible at dimension boundary AND gate-tier boundary per substrate §13.4 owned-framework-execution row ("interruptible with per-step checkpoint"). Recovery point = last-completed dimension + last-completed gate-tier.
- **Audit-result emission via HR-FA2:** atomic per substrate §13.4 outcome-emission row (atomic with recovery point = pre-emission state in framework-audit).

### §5.9 Audit-trail format

Per X3 criteria C3 + C4 + C5 (§3.4) requirement. Framework-audit's own audit-trail format declared as `AuditRunRecord`:

```
AuditRunRecord = {
  runId: string,
  auditRequestRef: AuditRequest,
  startTimestamp: string,
  endTimestamp: string,
  gateResultsRef: GateResult[],
  dimensionResultsRef: DimensionResult[],
  authorityClaim: AuthorityClaim,
  captureShape: CaptureShape   // per HR-FA1 + HR-FA2 captureShapes (§6.3)
}
```

Distinction from `SelfAuditRecord` (§8.1): `AuditRunRecord` is the lifecycle/audit-trail record (per-run provenance); `SelfAuditRecord` is the per-framework state record (latest result + history). One AuditRunRecord per run; one SelfAuditRecord per framework, updated on each run.

### §5.10 Query interface

Declaration only; runtime deferred post-9g.

```
queryByFrameworkRef(ref: FrameworkRef): AuditRunRecord[]
   // returns audit-run history for the named framework

queryLatest(ref: FrameworkRef): SelfAuditRecord | null
   // returns the most-recent SelfAuditRecord for the named framework

queryByResult(result: 'pass' | 'fail', since: string): AuditRunRecord[]
   // filters by overall result + timestamp
```

### §5.11 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1-0 | Phase 1.1 delivery | Initial §3 + §8 partial scope. | L0 |
| v1-1 | Phase 1.2 delivery | X10 predicate extended (stage ordering + stage-content-kind alignment); X3 criteria extended (C5 captureShape per diagnosticSignificance). | L0 |
| v1-2 | Phase 9f delivery | §1, §2, §4, §5, §6, §7 populated. §8 content populated beyond schema. §9 extended. Three own gates (G-FA1, G-FA2, G-FA3) declared. HR-FA1, HR-FA2 declared with captureShapes. Sprint-mode completion of verificative framework. | L0 |
| v1.3.2 | Phase v3.2.3 delivery (2026-04-27) | §3.6 P4 inherited 36→64; P5 inherited 52→80; P7 own 3→7. §4.1 inherited 52→80; §4.3 ID enumeration extended for v3.2.3 axiom-gates; §4.7 count restated 52→80 with 28-gate first-run-deferred note. §4.2.3 G-FA3 test body 52→80. §5.7 Scale bounds 52→80. §8 self-application basis 52→80. New §4.6.1 GR-series rule set declared (closure item 1; authoritative source for metaframework §4.6 + spec §3.4 references). New §4.8 v3.2.3 axiom-gate predicate authorship (28 gate bodies, per-axis sub-sections §4.8.1–§4.8.7) — Claim/Test/Reporting/Tests/Escalation populated per Phase 5 + GR-1..GR-6 conformance. New §7.6–§7.9: 4 v3.2.3 J-input declarations (J-authority-source-classification, J-axis-concern-coverage, J-axiom-text-declarative, J-amendment-trigger-context). §7.4 Axis status three→seven. §7.5 provenance extended for v3.2.3 J-inputs. v1.3.1 content otherwise preserved verbatim. | L0 |
| v1.3.3 | MF-patch-1 delivery (2026-04-28) | §4.1 stale literal "48" replaced with derived "83" (3 own + 80 inherited; mechanically derivable from row sums). §4.6.1 conformance test paragraph refined: GR-1..GR-6 require substance recoverability, not field-label parse; both expanded per-gate blocks and compact tabular form satisfy. §4.8.3.11 G-St16 predicate refined: testability derived from axiom's relationship to F's P7 set (criteria-bounded iff axiom references a J-input declared at F's §7); per substrate §1.3 S-03 single-source no separate `testability` field declared. §4.8.4.4 G-V9 predicate refined: substance recoverability semantics replace field-label parse. Closes MF-audit-1 findings F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007. No new axioms / gates / HRs / primitives / J-inputs. No count changes. v1.3.2 content otherwise preserved verbatim. | L0 |
| v1.4 | MF-amendment-1 delivery (2026-04-28) | New §3.3 declared: five-step audit-cycle procedure (P0–P4) per substrate §8.3 P8 shape with PR4 stage-monotonicity and PR5 stage-content-kind alignment satisfied; per-step notes + E-step shorthand + stage-monotonicity-and-kind-alignment self-check populated. Existing §3.3–§3.7 renumbered +1: dimension declarations §3.3 → §3.4; per-dimension relationship table §3.4 → §3.5; dimension-set as judgment input §3.5 → §3.6; primitive instances §3.6 → §3.7; vocabulary §3.7 → §3.8. §3.7 P7 own 7 → 9 with 2 added: J-audit-request-validation (consumed at P0) and J-audit-outcome-review (consumed at P3). §3.7 P8 row 0 → 5 with full P0–P4 declaration replacing prior verificative-mode-no-P8 basis text. §7.10 J-audit-request-validation declared (mechanical C1–C3 + criteria-bounded C4 per MA-J2). §7.11 J-audit-outcome-review declared (mechanical C1–C3 + criteria-bounded C4 per MA-J2). 28-edit internal sweep: live §3.3 references bumped to §3.4, live §3.5 references to §3.6, live §3.6 references to §3.7; frozen rows preserved (§5.11 prior version-history rows; §9 prior change-log rows); generic predicate prose preserved (G-S4 vocabulary template, G-St cardinality template, G-St16 P7-membership prose); external references preserved (spec §3.3 / §3.4, metaframework §3.2 / §3.5). Closes MF-audit-2 finding F-MFA2-META-002 (Pattern A citation gap — no canonical declaration of audit-cycle procedure); extends F-1.2-01 closure to verificative mode (operation flow now declared at framework-audit §3.3 P0–P4). No new axioms / gates / HRs declared. P7 own count 7 → 9 (additive per AxR3); P8 instance count 0 → 5 (additive — moves from positive-empty-basis to populated, permissible per MA-L1 since basis text framing was open to amendment). Per MA-L1 additive (no rule weakened; no axiom condition removed; mode taxonomy unchanged). v1.3.3 content otherwise preserved verbatim. | L0 |

---

## §6 Coupling

### §6.1 Carrier

Framework-audit carrier = `self`. Emits audit records (`SelfAuditRecord`, `AuditRunRecord`) as own artifacts.

### §6.2 Handoff rules

Two framework-local HR instances.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| HR-FA1 | metaframework → framework-audit (receive HR3) | `['self', 'named']` (matches metaframework §6.2 HR3) | true | declared §6.3 |
| HR-FA2 | framework-audit → registry (emit audit record via HR5 path) | `['self', 'named', 'none']` | true | declared §6.3 |

**HR-FA1 receive-side mirrors metaframework-v3-1 §6.2 HR3** by construction per MA-C3 handoff-invariant symmetry. Carrier applicability `['self', 'named']` per metaframework §6.2 HR3 row.

**HR-FA2 emit-side** uses the registry HR5 path (metaframework §6.2 HR5) to persist audit results. Framework-audit invokes HR5; registry performs write per IG1–IG5 (framework-registry-v1-0 §8). Two atomic operations per substrate §13.4.

### §6.3 Capture shapes

Per substrate §8.2 amended P6 shape + metaframework-v3-1 §6.3 pattern.

**HR-FA1 (receive):**
```
captureShape = {
  capturedFields: ['auditRequestId', 'targetFrameworkRef', 'triggerEvent',
                   'initiator', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §5.10 queryByFrameworkRef → AuditRunRecord lookup'
}
```

**HR-FA2 (emit):**
```
captureShape = {
  capturedFields: ['runId', 'targetFrameworkRef', 'auditResultRef',
                   'overallResult', 'timestamp', 'authorityClaim'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByFrameworkRef + audit-result lookup'
}
```

### §6.4 Custody table

Every atom owned or consumed, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `FrameworkRef` | substrate | L1 | framework-audit (audit targeting) |
| `AuthorityClaim` | substrate | L1 | framework-audit (request validation, emission) |
| `AxiomRef` | substrate | L1 | framework-audit (gate-axiom mapping verification) |
| `WAtom` | substrate | L1 | framework-audit (via HR1) |
| `Judgment`, `JudgmentId` | substrate | L1 | framework-audit (J-input typing) |
| `Stage`, `StageContentKind` | substrate | L1 | framework-audit (X10 extended predicate) |
| `CaptureShape` | substrate | L1 | framework-audit (X3 C5 + own HR-FA1/HR-FA2 §6.3) |
| `MetaframeworkInput`, `GeneratedFrameworkTemplate` | metaframework | L2 | framework-audit (audit target inputs/outputs) |
| `AxisInstance`, `AxiomInstance`, `GateInstance`, `HandoffRuleInstance`, `ProcedureStepInstance` | metaframework | L2 | framework-audit (per-X-dimension introspection) |
| `RegistryEntry`, `LifecycleState`, `AmendmentLogEntry` | registry | L2 | framework-audit (X1 lifecycle check, X8 genesis check, provenance lookup) |
| `AuditDimension` | framework-audit | L2 | framework-audit internal (§3.2 + §3.4) |
| `AuditDimensionTest` | framework-audit | L2 | framework-audit internal |
| `AuditRequest` | framework-audit | L2 | framework-audit (HR-FA1 receive) |
| `AuditRunRecord` | framework-audit | L2 | framework-audit (audit-trail), registry (via HR-FA2) |
| `SelfAuditRecord` | framework-audit | L2 | all audited frameworks (their §8 result), registry (via HR-FA2) |
| `GateResult`, `DimensionResult` | framework-audit | L2 | framework-audit internal (within SelfAuditRecord) |
| `J-audit-dim-set` | framework-audit | L2 | framework-audit §3.6 |
| `J-audit-trace-format` | framework-audit | L2 | framework-audit §3.4 X3 |
| `J-failure-taxonomy` | framework-audit | L2 | framework-audit §3.4 X7 |
| `HR-FA1`, `HR-FA2` | framework-audit | L2 | framework-audit §6.2 |

Substrate, metaframework, and registry atoms consumed by reference; framework-audit-declared atoms produced here and consumed by audited frameworks (their §8 result population) and registry (via HR-FA2 persistence).

### §6.5 Provenance contract

Per MA-C5 + A-20 reference-default. Every emitted `SelfAuditRecord` traces to:
- declared `AuditRequest` (the triggering request),
- audited-framework-state hash (`frameworkStateHash` per §8.1 schema),
- per-dimension results (one DimensionResult per X1–X10),
- per-gate results (one GateResult per executed gate).

`AuditRunRecord` (§5.9) captures the full provenance chain per run. Reference-default per A-20: provenance fields store FrameworkRefs and registry-archived references where possible; by-value retention is opt-in.

### §6.6 OperatorInterface

Per V5 verification + X6 dimension self-application.

- **Activation interface:** L0 may directly initiate audit via `AuditRequest` with `triggerEvent: 'L0-initiated'` + L0 AuthorityClaim. Indirect activation via metaframework HR3 dispatch on framework registration or amendment.
- **Review interface:** `queryByFrameworkRef`, `queryLatest`, `queryByResult` per §5.10.
- **Confirmation interface:** L0 confirms framework-audit's own version and dimension-set amendments via standard L0 confirmation per substrate §13. AuditRunRecord captures L0 confirmation events at audit-result acceptance.
- **Discovery interface:** registry query per HR5 receive-side; framework-audit's own SelfAuditRecord queryable via §5.10 query interface.

Runtime implementation deferred post-9g. Declarations only at delivery.

### §6.7 MA-C1–MA-C6 satisfaction

All six Coupling axioms satisfied at handoff tier per metaframework-v3-1 §3.2 inheritance + §3.5 declarations:

- **MA-C1** (carrier declared) — §6.1 declares carrier=self.
- **MA-C2** (custody complete) — §6.4 enumerates every atom.
- **MA-C3** (handoff-invariant symmetry) — HR-FA1 receive matches metaframework §6.2 HR3 send by construction; HR-FA2 emit uses registry HR5 receive contract.
- **MA-C4** (provenance populated) — §6.5 declares.
- **MA-C5** (provenance contract) — §6.5 declares.
- **MA-C6** (carrier-applicability enforced) — HR-FA1 applicability `['self','named']` matches HR3 send-side; HR-FA2 applicability `['self','named','none']` matches HR5 receive-side.

---

## §7 Judgment

Per L0 ruling Q3: §7 lists top-level J-inputs with §3.4 / §3.6 pointers per A-08 single-source-via-reference. No duplication of criteria text. Per L0 ruling Q4: exactly three J-inputs enumerated (J-audit-dim-set, J-audit-trace-format, J-failure-taxonomy). J-identity-coverage from spec draft §3.2 dropped per Q4 — no §3.4 anchor; spec-draft speculation. Logged as audit note.

### §7.1 J-audit-dim-set

**Authoritative declaration:** §3.6 (preserved verbatim from v1-1).

Reference-only at this section. See §3.6 for full criteria block (C1–C4, all mechanical), provenance, amendability per MA-L5.

Consumed by: framework-audit §3.2 dimension-set declaration.

### §7.2 J-audit-trace-format

**Authoritative declaration:** §3.4 X3 criteria block (preserved verbatim from v1-1, with Phase 1.2 C5 extension).

Reference-only at this section. See §3.4 X3 for full criteria (C1–C5, criteria-bounded).

Consumed by: framework-audit §3.4 X3 dimension test.

Per L0 ruling Q6: X3's inline criteria block at §3.4 is authoritative; §7 references by pointer. No re-stated criteria.

### §7.3 J-failure-taxonomy

**Authoritative declaration:** §3.4 X7 criteria block (preserved verbatim from v1-1).

Reference-only at this section. See §3.4 X7 for full criteria (C1–C4, criteria-bounded).

Consumed by: framework-audit §3.4 X7 dimension test.

Per L0 ruling Q6: same single-source-via-reference pattern as J-audit-trace-format.

### §7.4 Axis status

Populated (not empty). Seven top-level J-inputs declared: J-audit-dim-set + J-audit-trace-format + J-failure-taxonomy (Phase 9f) + J-authority-source-classification + J-axis-concern-coverage + J-axiom-text-declarative + J-amendment-trigger-context (v3.2.3). Empty-declaration rule (substrate §8.6) does not apply.

Mechanical dimensions (X1, X2, X4, X5, X6, X8, X9, X10) consume no J-inputs per their declared `kind: 'mechanical'` test variant at §3.4 (per §3.2 AuditDimensionTest union). The four v3.2.3 J-inputs (§7.6–§7.9) are consumed by criteria-bounded axiom-gates (G-I6, G-St11, G-St14, G-L8) authored at §4.8.

### §7.5 Judgment provenance

Per MA-J4 provenance-completeness:

- **J-audit-dim-set provenance** declared at §3.6 (instanceId: `builder-phase-1-1`, cycleId: `phase-1-1`, consumingFrameworkRef: `framework-audit-v1-3`, consumingStepId: `§3.2 dimension declaration`).
- **J-audit-trace-format provenance:** L0 confirmation at Phase 1.1 (initial declaration) + Phase 1.2 (C5 extension confirmation). Consumed at §3.4 X3 dimension test.
- **J-failure-taxonomy provenance:** L0 confirmation at Phase 1.1 (initial declaration). Consumed at §3.4 X7 dimension test.

All three Phase 9f J-inputs trace to L0 confirmation events with declared phase + cycle ID. The four v3.2.3 J-inputs (§7.6–§7.9) trace to L0 confirmation at v3.2.3 cycle (2026-04-27); consumingFrameworkRef = framework-audit-v1.3.2; consumingStepId per each declaration. MA-J4 satisfied for all seven.

### §7.6 J-authority-source-classification

**Authoritative declaration site:** §7 (this section, per closure item 2; substrate §6.3 governs mechanicalGround per MA-J5).

```
id: 'J-authority-source-classification'
kind: 'classification'
consumedBy: framework-audit-v1.3.2 §4.8.1.1 G-I6
criteria: [
  {
    id: 'C1',
    predicate: 'For every (operation o, AuthorityClaim ac) input pair, classify(ac.source) returns a level value drawn from substrate §5 authority-enum',
    mechanical: true
  },
  {
    id: 'C2',
    predicate: 'classify(ac.source) is total over the substrate §5 source-classification enum (every declared source value receives a level mapping)',
    mechanical: true
  },
  {
    id: 'C3',
    predicate: 'For every input ac, the returned level equals the level declared in substrate §5 source-to-level mapping table',
    mechanical: true
  }
]
mechanicalGround: substrate §5 authority-source-classification table
provenance: {
  instanceId: 'builder-v3.2.3',
  cycleId: 'v3.2.3',
  timestamp: '2026-04-27T00:00:00Z',
  consumingFrameworkRef: framework-audit-v1.3.2,
  consumingStepId: '§4.8.1.1 G-I6 predicate'
}
```

Consumed by: framework-audit §4.8.1.1 G-I6 (tests MA-I6).

### §7.7 J-axis-concern-coverage

**Authoritative declaration site:** §7 (per closure item 2).

```
id: 'J-axis-concern-coverage'
kind: 'decomposition'
consumedBy: framework-audit-v1.3.2 §4.8.3.6 G-St11
criteria: [
  {
    id: 'C1',
    predicate: 'For input axis x with concern-statement c, decompose(c) returns a non-empty subclaim list',
    mechanical: true
  },
  {
    id: 'C2',
    predicate: 'Every subclaim s in decompose(c) is testable — phrased as a condition admitting a binary mechanical or criteria-bounded outcome',
    mechanical: true
  },
  {
    id: 'C3',
    predicate: 'decompose(c) is collectively exhaustive over c — c holds iff every s in decompose(c) holds',
    mechanical: true
  }
]
mechanicalGround: framework-audit §3.4 X-dimension decomposition pattern (X1–X10 axes-to-subclaim decomposition)
provenance: {
  instanceId: 'builder-v3.2.3',
  cycleId: 'v3.2.3',
  timestamp: '2026-04-27T00:00:00Z',
  consumingFrameworkRef: framework-audit-v1.3.2,
  consumingStepId: '§4.8.3.6 G-St11 predicate'
}
```

Consumed by: framework-audit §4.8.3.6 G-St11 (tests MA-St11).

### §7.8 J-axiom-text-declarative

**Authoritative declaration site:** §7 (per closure item 2).

```
id: 'J-axiom-text-declarative'
kind: 'classification'
consumedBy: framework-audit-v1.3.2 §4.8.3.9 G-St14
criteria: [
  {
    id: 'C1',
    predicate: 'Input a.text contains exactly one assertion clause (single declarative verb-phrase pattern)',
    mechanical: true
  },
  {
    id: 'C2',
    predicate: 'Input a.text is in declarative form (subject + state-predicate, not imperative or interrogative or test-reference)',
    mechanical: true
  },
  {
    id: 'C3',
    predicate: 'Input a.text contains no axiom-as-test-reference shape (no clause matching pattern "tests <gate-id>" or "is verified by <gate-id>" embedded in axiom statement)',
    mechanical: true
  }
]
mechanicalGround: v3-1-spec §3.2 AxR4 declarative-form requirement
provenance: {
  instanceId: 'builder-v3.2.3',
  cycleId: 'v3.2.3',
  timestamp: '2026-04-27T00:00:00Z',
  consumingFrameworkRef: framework-audit-v1.3.2,
  consumingStepId: '§4.8.3.9 G-St14 predicate'
}
```

Consumed by: framework-audit §4.8.3.9 G-St14 (tests MA-St14).

### §7.9 J-amendment-trigger-context

**Authoritative declaration site:** §7 (per closure item 2).

```
id: 'J-amendment-trigger-context'
kind: 'classification'
consumedBy: framework-audit-v1.3.2 §4.8.5.1 G-L8
criteria: [
  {
    id: 'C1',
    predicate: 'For input amendment cycle c with surfacing-context record, classify(c.context) returns one of {`vision`, `gap`, `L0-directive`}',
    mechanical: true
  },
  {
    id: 'C2',
    predicate: 'classify(c.context) is total over declared surfacing-context shapes per metaframework §5.2 amendment-trigger enumeration',
    mechanical: true
  },
  {
    id: 'C3',
    predicate: 'For ambiguous contexts (multi-trigger surfacing), classify returns the dominant trigger per declared precedence: L0-directive > gap > vision',
    mechanical: true
  }
]
mechanicalGround: metaframework §5.2 amendment-trigger taxonomy + MA-L4
provenance: {
  instanceId: 'builder-v3.2.3',
  cycleId: 'v3.2.3',
  timestamp: '2026-04-27T00:00:00Z',
  consumingFrameworkRef: framework-audit-v1.3.2,
  consumingStepId: '§4.8.5.1 G-L8 predicate'
}
```

Consumed by: framework-audit §4.8.5.1 G-L8 (tests MA-L8).

### §7.10 J-audit-request-validation

Consumed at P0 (Stage 1 entry of the audit-cycle procedure declared §3.3). Validates `AuditRequest` per §2.1 input schema.

**Mechanical criteria:**
- C1: `AuditRequest.targetFrameworkRefs` resolves (each `FrameworkRef` registered in registry).
- C2: `AuditRequest.scope` declares in-scope gate set per cycle convention (cycle spec §2.2-class decision).
- C3: `AuditRequest.authorityClaim` well-formed at L0 level.

**Judgment criterion:**
- C4: scope coherence — declared gate set is sufficient for declared cycle objective. Criteria-bounded judgment per MA-J2.

**Provenance:** L0 confirmation at MF-amendment-1 cycle entry (initial declaration). Consumed at §3.3 P0 step.

Consumed by: framework-audit §3.3 P0 (audit-cycle procedure entry).

### §7.11 J-audit-outcome-review

Consumed at P3 (Stage 4 closing of the audit-cycle procedure declared §3.3). Reviews flow-verification results + findings register for L0 confirmation-gate input.

**Mechanical criteria:**
- C1: per-flow result populated (one row per flow declared in cycle spec).
- C2: findings register populated with ID + Kind classification + cascade-effect column.
- C3: substrate md5 ENTRY recorded (P1 attestation).

**Judgment criterion:**
- C4: outcome posture — cycle closes clean / closes with disposition / halts. Criteria-bounded judgment per MA-J2; L0 confirmation decision is enabled by this output but is itself a substrate §13.6 event, not a P8 output field.

**Provenance:** L0 confirmation at MF-amendment-1 cycle entry (initial declaration). Consumed at §3.3 P3 step.

Consumed by: framework-audit §3.3 P3 (audit-cycle procedure closing-flow review).

---

## §8 Self-audit results

Schema declared at §8.1 (preserved verbatim from v1-1). §8.2 + §8.3 populated in v1-2.

### §8.1 Self-audit record shape

```
SelfAuditRecord = {
  frameworkRef: FrameworkRef,              // the framework being audited
  auditedByFrameworkRef: FrameworkRef,     // framework-audit-v1-0
  auditTimestamp: string,                  // ISO 8601
  frameworkStateHash: string,              // state at audit time

  gateResults: GateResult[],               // per-gate results
  dimensionResults: DimensionResult[],     // per-dimension results (X1–X10)
  overallResult: 'pass' | 'fail' | 'pending'
}

GateResult = {
  gateId: string,                          // e.g., 'G-I1', 'G-U5'
  result: 'passed' | 'failed' | 'pending',
  timestamp: string,
  evidence?: string                        // optional, for failed gates
}

DimensionResult = {
  dimensionId: string,                     // 'X1'–'X10'
  result: 'pass' | 'fail' | 'n/a',
  basis?: string,                          // required for n/a
  details: string                          // test execution details
}
```

### §8.2 Self-audit results per framework

Every framework's §8 Self-audit populated with:
- Latest SelfAuditRecord
- History of prior SelfAuditRecords (bounded by declared retention policy — default: last 10)

**Framework-audit-v1-3's own latest SelfAuditRecord at this delivery:**

```
{
  frameworkRef: 'framework-audit-v1-3',
  auditedByFrameworkRef: 'framework-audit-v1-3',  // self-audit
  auditTimestamp: null,                            // pending first run
  frameworkStateHash: null,                        // pending first run
  gateResults: [],                                 // pending first run
  dimensionResults: [],                            // pending first run
  overallResult: 'pending'
}
```

**History:** empty. First audit will be first entry.

State: `pending-first-run`. First system-wide audit cycle scheduled post-9g (after amendment-propagation framework completes the six-file system per Phase 9g + L0 confirms first audit cycle).

Compact placeholder per sprint-mode + metaframework-v3-1 §8 pattern.

### §8.3 Self-application closure

Per metaframework §4.3 universal gate G-U1 (self-application): framework-audit runs its own gates against framework-audit itself. Self-audit record for framework-audit exists in framework-audit's own §8.2 above.

**Bootstrap recursion note** (preserved from v1-1): framework-audit-v1-0 cannot audit itself at genesis (no framework-audit exists pre-bootstrap to audit anything). First self-audit occurs post-bootstrap when metaframework-v3-1 + substrate-v1-1 + framework-audit-v1-2 all exist (and at v1-2 maturity, also generation-procedure-v1-0 + framework-registry-v1-0 + amendment-propagation per Phase 9g). L0 records first self-audit confirmation in registry bootstrap event per substrate §14.

**Self-application basis at this delivery:** Framework-audit-v1-3 declares its own gate set (G-FA1–G-FA3) + inherits 80 framework-tier gates from metaframework (per `MetaframeworkGateIdSet` atom). G-U1 self-application verifies these run against framework-audit itself. At v3.2.3 delivery, self-audit is declared-placeholder state per §8.2; no gate has executed; first execution post-9g ratifies initial state.

**Last audit event:**
```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1-0 | Phase 1.1 delivery | Initial §3 + §8 partial scope. | L0 |
| v1-1 | Phase 1.2 delivery | X10 predicate extended (stage ordering + stage-content-kind alignment per substrate §8.3 + §10.2 PR4/PR5); X3 criteria extended (C5 captureShape per diagnosticSignificance per substrate §8.2 amended P6). | L0 |
| v1-2 | Phase 9f delivery | §1 Identity, §2 Schema, §4 Validity (G-FA1–G-FA3 own gates), §5 Lifecycle (incl. AuditRunRecord audit-trail format + query interface declarations), §6 Coupling (HR-FA1 receive + HR-FA2 emit, captureShapes, custody table, MA-C1–C6 satisfaction), §7 Judgment (three J-inputs enumerated by reference per A-08) populated. §8 content populated beyond schema (§8.2 own pending-first-run record + §8.3 self-application basis). §3 Structure §3.6 primitive-instance counts added (P1=7 inherited, P2=0 with basis, P5=3 own + inherited count as stated at v1-2, P6=2 own, P7=3 own, P8=0 with basis; inherited count corrected from 45 to 52 in v1-3 per R-0020 cascade). §3.7 vocabulary added. v1-1 content (§3.1–§3.5 + §8.1) preserved verbatim. | L0 |
| v1-3 | Phase 1.2-fix delivery | §3.3 X9 state-enum references substrate §9 LifecycleState (per R-0045); §4.2.3 G-FA3 references MetaframeworkGateIdSet atom (per R-0049); §3.5 + §7.5 provenance consumingFrameworkRef refreshed to framework-audit-v1-3 (per R-0047); §3.4 per-dimension relationship table placeholder replaced with explicit closure (per R-0046); §3.6 + §4.1 + §4.7 + §5.7 + §8.3 gate count restatements updated 45→52 (per R-0020 KA-Build-2 cascade). §1 Identity: scopeOut row added per R-0042. v1-2 content otherwise preserved verbatim. | L0 |
| v1.3.1 | Phase 1.2-fix-trail hygiene delivery | §8.2 SelfAuditRecord inline example `frameworkRef` + `auditedByFrameworkRef` updated to `framework-audit-v1-3`; §8.2 heading text updated to "Framework-audit-v1-3's own latest SelfAuditRecord" (per RF-02). Patch-level bump per hygiene discipline; no structural amendment. Allowlisted sites preserved: §8.1 schema comment `// framework-audit-v1-0`, §8.3 bootstrap-recursion historical narrative. | L0 |
| v1.3.2 | Phase v3.2.3 delivery (2026-04-27) | §3.6 primitive-instance count restatements (P4 36→64, P5 52→80 inherited, P7 3→7 own with 4 added at §7.6–§7.9). §4.1 + §4.3 + §4.7 inherited gate count restatements 52→80 with v3.2.3 axiom-gate ID enumerations. §4.2.3 G-FA3 test body 52→80. §5.7 Scale bounds 52→80. §8 self-application basis 52→80. New §4.6.1 GR-series rule set declared (closure item 1, extracted at Phase 4 §6.0.1; authoritative source for metaframework §4.6 + spec §3.4 GR-series references). New §4.8 v3.2.3 axiom-gate predicate authorship (28 gate bodies, per-axis sub-sections §4.8.1–§4.8.7) — Claim/Test/Reporting/Tests/Escalation populated per Phase 5 + GR-1..GR-6 conformance. New §7.6–§7.9: 4 v3.2.3 J-input declarations (J-authority-source-classification consumed by G-I6; J-axis-concern-coverage consumed by G-St11; J-axiom-text-declarative consumed by G-St14; J-amendment-trigger-context consumed by G-L8). §7.4 Axis status restated three→seven. §7.5 provenance extended for v3.2.3 J-inputs. v1.3.1 content otherwise preserved verbatim. | L0 |
| v1.3.3 | MF-patch-1 delivery (2026-04-28) | Predicate refinement cycle. Substantive edits at four sites — §4.1 stale literal "48" replaced with derived "83" (3 own + 80 inherited; mechanically derivable per row sums above; framework-audit declares zero own axioms per §3.6 + §4.5, so 35 inherited axiom-gates are vacuous-pass over the empty axiom set but still applicable; no exclusion-set semantics; total 83 gates applicable when framework-audit is the audit target). §4.6.1 conformance test paragraph refined: GR-1..GR-6 require recoverability of substance, not field-label parse; both expanded per-gate Claim/Test/Reporting/Tests/Escalation blocks (G-FA1–G-FA3 shape) and compact tabular form (L3 framework + metaframework §4.7 enumeration shape) satisfy GR-1..GR-6 by recoverability. §4.8.3.11 G-St16 predicate refined: testability classification derived from axiom's relationship to framework's P7 set (criteria-bounded iff axiom's mechanical condition references a J-input declared at framework's §7); per substrate §1.3 S-03 single-source no separate `testability` field declared on axioms (would duplicate P7-membership). §4.8.4.4 G-V9 predicate refined: substance recoverability semantics replace field-label parse; explicit recovery rules per GR-1..GR-6 declared. Closes MF-audit-1 findings F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007. No new axioms / gates / HRs / primitives / J-inputs declared. No count changes (axiom 64 unchanged; framework-tier gate 80 unchanged). Per MA-L1 additive (predicate refinement is permissible additive amendment per AxR3; no axiom condition weakened). v1.3.2 content otherwise preserved verbatim. | L0 |
| v1.4 | MF-amendment-1 delivery (2026-04-28) | Audit-cycle procedure cycle. New §3.3 declares five-step audit-cycle procedure (P0–P4) per substrate §8.3 P8 shape: P0 judgment-input (Stage 1 entry, J-audit-request-validation) → P1 mechanical (Stage 2 cores anchor matrix + D1–D4 lens findings + substrate md5 ENTRY attestation) → P2 gate-execution (Stage 3 cycle-scoped gate set) → P3 judgment-input (Stage 4 closing-flow review, J-audit-outcome-review) → P4 mechanical (Stage 5 SelfAuditRecord emission + substrate md5 EXIT attestation + HR-FA2 invocation). PR4 stage-monotonicity (1<2<3<4<5) and PR5 stage-content-kind alignment satisfied per inline self-check table. Sections renumbered +1: §3.3 dimension declarations → §3.4; §3.4 per-dimension relationship table → §3.5; §3.5 dimension-set as judgment input → §3.6; §3.6 primitive instances → §3.7; §3.7 vocabulary → §3.8. §3.7 P7 own count 7 → 9 with 2 added: J-audit-request-validation (consumed at P0), J-audit-outcome-review (consumed at P3); both declared at new §7.10 + §7.11. §3.7 P8 row 0 → 5 with full P0–P4 declaration replacing prior verificative-mode-no-P8 basis text. 28-edit internal §3.x reference sweep (live refs only): §3.3 → §3.4 (25 sites), §3.5 → §3.6 (4 sites), §3.6 → §3.7 (2 sites). Frozen rows preserved (§5.11 v1-0/v1-1/v1-2/v1-3/v1.3.1/v1.3.2/v1.3.3 transition log; §9 prior changelog rows). Generic predicate prose preserved (G-S4 vocabulary template, G-St cardinality template, G-St16 P7-membership prose, mechanical-test-variant prose). External references preserved (spec §3.3 / §3.4, metaframework §3.2 / §3.5). New §7.10 + §7.11 J-input declarations added with mechanical C1–C3 + criteria-bounded C4 per MA-J2 and provenance attestation. Closes MF-audit-2 finding F-MFA2-META-002 (Pattern A citation gap — audit-cycle procedure now canonically declared at §3.3); extends F-1.2-01 closure to verificative mode (operation flow declared at §3.3 P0–P4 with stage discipline). No new axioms / gates / HRs declared. P7 own 7 → 9 (additive per AxR3); P8 instance count 0 → 5 (additive — populated from prior positive-empty-basis declaration; permissible per MA-L1 since basis text was open to amendment when own discipline declared as ordered procedure per amended substrate §8.3). Per MA-L1 additive (no rule weakened; no axiom condition removed; mode taxonomy unchanged at 4 modes). v1.3.3 content otherwise preserved verbatim. | L0 |

---

## End of framework-audit-v1-2
