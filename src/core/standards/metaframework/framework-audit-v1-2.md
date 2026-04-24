# framework-audit-v1-2

**Kind:** Framework
**Mode:** verificative
**Level:** L2
**Version:** v1.3.1
**Authority:** L0 confirmed (Phase 1.2-fix-trail hygiene delivery)
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
| Version | v1.3.1 |
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
| `Stage`, `StageContentKind` | substrate §8.3 (used in X10 extended predicate per §3.3) |
| `CaptureShape` | substrate §8.2 (used in X3 C5 per §3.3) |
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

### §3.3 Dimension declarations

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

### §3.4 Per-dimension relationship table (per brief §3.2)

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

### §3.5 Dimension-set as judgment input

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

### §3.6 Primitive instances

Per substrate §8 + §8.6 empty-declaration derivation. New in v1-2.

| Primitive | Count | Notes / basis |
|---|---|---|
| P1 Axis | 7 (inherited) | per metaframework-v3-1 §3.1 universal seven-axis decomposition |
| P2 Sub-axis | 0 | `{primitiveKind: P2, instanceCount: 0, basis: "flat axis structure; no sub-axes declared at framework-audit level"}` |
| P3 Leaf | inherited via axes | per metaframework-v3-1 |
| P4 Axiom | 0 own + 36 inherited | audit-dimension-completeness invariant expressed via X1–X10 coverage at §3.3 + dimension-set integrity via own gates G-FA1–G-FA3 at §4, not as new axiom |
| P5 Gate | 3 own (G-FA1–G-FA3, declared §4) + 52 inherited framework-tier from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` atom) | own gates test framework-audit's own integrity surface (dimension-set declaration completeness, dimension-test mechanicality declaration, per-framework audit completion); not duplicative of inherited G-U1/G-M1/G-M2 per §4 |
| P6 Handoff rule | 2 own | HR-FA1 (receive HR3 from metaframework), HR-FA2 (emit audit result via HR5 to registry); declared §6 |
| P7 Judgment input | 3 own | J-audit-dim-set (existing §3.5), J-audit-trace-format (per X3 criteria-block at §3.3), J-failure-taxonomy (per X7 criteria-block at §3.3); enumerated at §7 by reference |
| P8 Procedure step | 0 | `{primitiveKind: P8, instanceCount: 0, basis: "verificative mode — audit procedure expressed via dimension-set execution (§3.3), not P8-step-declared. Alternate decomposition (P8 steps per dimension) deferrable amendment if runtime surfaces need."}` |

Positive empty-declaration markers per substrate §8.6 for P2 and P8 zero counts. Implicit-absence disallowed.

### §3.7 Vocabulary (framework-audit-local)

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

Framework-audit declares **3 own gates** (G-FA1, G-FA2, G-FA3) plus inherits **52 framework-tier gates** from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` atom).

| Category | Count | IDs |
|---|---|---|
| Own gates (framework-audit-specific) | 3 | G-FA1, G-FA2, G-FA3 |
| Inherited framework-tier gates | 52 | per metaframework-v3-1 §4.1 + `MetaframeworkGateIdSet` atom (§6.5): PG1–PG7, axiom gates G-I1..G-J4, G-G13, G-U1–G-U5, G-M1–G-M4. Substrate gates SG1–SG4 excluded per substrate §11.5 tier-1. |
| **Total applicable to framework-audit itself** | **48** | |

Per L0 ruling on Q1 (Phase 9f spec §8 Q-9f-1): three own gates declared. G-U1 self-application covers running existing inherited gates against framework-audit itself, but does NOT verify (a) the 10-dimension set exists as declared, (b) AuditDimensionTest fields are populated per §3.2 shape, or (c) per-framework audit produces a complete SelfAuditRecord across all 10 dimensions + framework-tier gates. G-FA1–G-FA3 close those gaps.

### §4.2 Own gates

#### §4.2.1 G-FA1 — Dimension-set coverage

*Claim:* All ten audit dimensions (X1–X10) are declared at §3.3 with complete `AuditDimension` shape per §3.2.

*Test (mechanical):*
- Enumerate dimension declarations in §3.3.
- Verify count = 10.
- Verify each declaration has all five fields per `AuditDimension` shape: id ∈ {X1..X10}, name (non-empty), concern (one-sentence), test (AuditDimensionTest with valid kind), reportingSchema (with result enum + basis-when-n/a clause).

*Reporting:* pass if 10 complete dimension declarations; fail with specific dimension ID + missing field; n/a not applicable.

*Tests:* §3.3 dimension-declaration completeness invariant.

*Escalation path:* G-FA1 failure → MA-L4 amendment trigger (dimension declaration block must be repaired before next audit).

#### §4.2.2 G-FA2 — Dimension-test mechanicality declared

*Claim:* Each `AuditDimensionTest` declares `kind` ∈ {'mechanical', 'criteria-bounded'} with kind-specific fields populated per §3.2 union shape.

*Test (mechanical):*
- For each AuditDimensionTest at §3.3:
  - If `kind: 'mechanical'` → declared `predicate` (non-empty string).
  - If `kind: 'criteria-bounded'` → declared `judgmentId` (resolves to declared J-input at §7) AND declared `criteria: Criterion[]` (non-empty array).
- Test fails if any dimension declares neither variant or declares the variant with missing kind-specific field.

*Reporting:* pass if all 10 tests well-typed; fail with specific dimension + missing field; n/a not applicable.

*Tests:* §3.3 + §3.2 dimension-test type-completeness invariant.

*Escalation path:* G-FA2 failure → MA-L4 amendment trigger.

#### §4.2.3 G-FA3 — Per-framework audit completion

*Claim:* Every accepted `AuditRequest` produces a `SelfAuditRecord` populated with results across all 10 dimensions + all framework-tier gates declared for the target framework.

*Test (mechanical):*
- For each accepted `AuditRequest` (per §5 lifecycle):
  - Resolve to corresponding `SelfAuditRecord`.
  - Verify `dimensionResults: DimensionResult[]` has length = 10 with one entry per X1..X10.
  - Verify `gateResults: GateResult[]` has length ≥ N where N = framework-tier gate count per `MetaframeworkGateIdSet` (52 gates per metaframework §6.5 atom declaration).
  - Verify `overallResult` ∈ {'pass', 'fail', 'pending'}.

*Reporting:* pass if every accepted request produces complete record; fail with specific request ID + missing dimension/gate; n/a not applicable.

*Tests:* §5 lifecycle audit-completion invariant + §8.1 SelfAuditRecord shape.

*Escalation path:* G-FA3 failure → MA-L4 amendment trigger; incomplete audit results invalidated; re-run required.

### §4.3 Inherited framework-tier gates

Inherited per metaframework-v3-1 §4.1. Applied to framework-audit itself when framework-audit performs its own self-audit (per G-U1 self-application + §8.3 closure).

Gate ID enumeration matches metaframework §4.7:

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I5, G-S1..G-S3, G-St1..G-St5, G-V1..G-V5, G-L1..G-L7, G-C1..G-C6, G-J1..G-J4, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §4.4 Gate execution

- **Self-application:** framework-audit executes inherited framework-tier gates + own G-FA1–G-FA3 against framework-audit itself per G-U1 self-application + §8.3 closure.
- **Audit of other frameworks:** per HR-FA1 receive (§6.2). Framework-audit runs the requesting framework's own gate set + executes X1–X10 dimension tests against the framework's content.
- **MULTI-EXEC per substrate §1.3 S-03:** generation-procedure declares Stage-3 gate-reference checkpoints (E1–E8); framework-audit invokes those checkpoints per F-69 distribution table at metaframework §4.3.

### §4.5 Meta-gate compliance

When audited (by self-application or by another instance), framework-audit is subject to metaframework's meta-gates G-M1–G-M4 (axiom-gate 1:1 mapping, gate-set exhaustive, execution order, escalation path declared). Per §3.6 row P4: framework-audit declares zero own axioms, so G-M1/G-M2 reduce to inherited-axiom mapping coverage. G-M3/G-M4 apply to framework-audit's own gates G-FA1–G-FA3 (each declared escalation path at §4.2 sub-sections).

### §4.6 Backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run; substrate-tier failure terminal. Applies to framework-audit's audit results when framework-audit itself fails its own self-audit.

### §4.7 Current gate results

**All 3 own gates + 52 inherited framework-tier gates: state = `not-yet-run`.** First-run pending post-9g (when amendment-propagation framework completes the six-file system and L0 confirms first system-wide audit cycle).

Compact summary per sprint-mode + metaframework §4.7 pattern.

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

Empty at delivery. J-audit-dim-set (§3.5), J-audit-trace-format (per X3), J-failure-taxonomy (per X7) all active.

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
- Per-audit cost: O(D + G) where D = dimension count (10) and G = framework-tier gate count applicable to target (52 for any L2 framework per `MetaframeworkGateIdSet`; potentially fewer for non-framework artifacts per declared exemption).
- Total state grows O(F × R) where F = framework count and R = retention depth.

Bounds declared, not measured. Runtime measurement deferred post-9g.

### §5.8 Atomicity declarations

- **Per-dimension test execution:** atomic per dimension (one DimensionResult per atomic test invocation).
- **Per-gate execution:** atomic per gate (one GateResult per atomic gate invocation).
- **Full audit run:** interruptible at dimension boundary AND gate-tier boundary per substrate §13.4 owned-framework-execution row ("interruptible with per-step checkpoint"). Recovery point = last-completed dimension + last-completed gate-tier.
- **Audit-result emission via HR-FA2:** atomic per substrate §13.4 outcome-emission row (atomic with recovery point = pre-emission state in framework-audit).

### §5.9 Audit-trail format

Per X3 criteria C3 + C4 + C5 (§3.3) requirement. Framework-audit's own audit-trail format declared as `AuditRunRecord`:

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
| `AuditDimension` | framework-audit | L2 | framework-audit internal (§3.2 + §3.3) |
| `AuditDimensionTest` | framework-audit | L2 | framework-audit internal |
| `AuditRequest` | framework-audit | L2 | framework-audit (HR-FA1 receive) |
| `AuditRunRecord` | framework-audit | L2 | framework-audit (audit-trail), registry (via HR-FA2) |
| `SelfAuditRecord` | framework-audit | L2 | all audited frameworks (their §8 result), registry (via HR-FA2) |
| `GateResult`, `DimensionResult` | framework-audit | L2 | framework-audit internal (within SelfAuditRecord) |
| `J-audit-dim-set` | framework-audit | L2 | framework-audit §3.5 |
| `J-audit-trace-format` | framework-audit | L2 | framework-audit §3.3 X3 |
| `J-failure-taxonomy` | framework-audit | L2 | framework-audit §3.3 X7 |
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

Per L0 ruling Q3: §7 lists top-level J-inputs with §3.3 / §3.5 pointers per A-08 single-source-via-reference. No duplication of criteria text. Per L0 ruling Q4: exactly three J-inputs enumerated (J-audit-dim-set, J-audit-trace-format, J-failure-taxonomy). J-identity-coverage from spec draft §3.2 dropped per Q4 — no §3.3 anchor; spec-draft speculation. Logged as audit note.

### §7.1 J-audit-dim-set

**Authoritative declaration:** §3.5 (preserved verbatim from v1-1).

Reference-only at this section. See §3.5 for full criteria block (C1–C4, all mechanical), provenance, amendability per MA-L5.

Consumed by: framework-audit §3.2 dimension-set declaration.

### §7.2 J-audit-trace-format

**Authoritative declaration:** §3.3 X3 criteria block (preserved verbatim from v1-1, with Phase 1.2 C5 extension).

Reference-only at this section. See §3.3 X3 for full criteria (C1–C5, criteria-bounded).

Consumed by: framework-audit §3.3 X3 dimension test.

Per L0 ruling Q6: X3's inline criteria block at §3.3 is authoritative; §7 references by pointer. No re-stated criteria.

### §7.3 J-failure-taxonomy

**Authoritative declaration:** §3.3 X7 criteria block (preserved verbatim from v1-1).

Reference-only at this section. See §3.3 X7 for full criteria (C1–C4, criteria-bounded).

Consumed by: framework-audit §3.3 X7 dimension test.

Per L0 ruling Q6: same single-source-via-reference pattern as J-audit-trace-format.

### §7.4 Axis status

Populated (not empty). Three top-level J-inputs declared: J-audit-dim-set + J-audit-trace-format + J-failure-taxonomy. Empty-declaration rule (substrate §8.6) does not apply.

Mechanical dimensions (X1, X2, X4, X5, X6, X8, X9, X10) consume no J-inputs per their declared `kind: 'mechanical'` test variant at §3.3 (per §3.2 AuditDimensionTest union).

### §7.5 Judgment provenance

Per MA-J4 provenance-completeness:

- **J-audit-dim-set provenance** declared at §3.5 (instanceId: `builder-phase-1-1`, cycleId: `phase-1-1`, consumingFrameworkRef: `framework-audit-v1-3`, consumingStepId: `§3.2 dimension declaration`).
- **J-audit-trace-format provenance:** L0 confirmation at Phase 1.1 (initial declaration) + Phase 1.2 (C5 extension confirmation). Consumed at §3.3 X3 dimension test.
- **J-failure-taxonomy provenance:** L0 confirmation at Phase 1.1 (initial declaration). Consumed at §3.3 X7 dimension test.

All three J-inputs trace to L0 confirmation events with declared phase + cycle ID. MA-J4 satisfied.

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

**Self-application basis at this delivery:** Framework-audit-v1-3 declares its own gate set (G-FA1–G-FA3) + inherits 52 framework-tier gates from metaframework (per `MetaframeworkGateIdSet` atom). G-U1 self-application verifies these run against framework-audit itself. At Phase 1.2-fix delivery, self-audit is declared-placeholder state per §8.2; no gate has executed; first execution post-9g ratifies initial state.

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

---

## End of framework-audit-v1-2
