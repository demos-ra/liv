---
kind: framework
placement: frameworks/metaframework/frameworks/
---

# amendment-propagation-v1-0

**Kind:** Framework
**Mode:** structural
**Level:** L2
**Version:** v1.3.3
**Authority:** L0 confirmed (MF-Cycle-2 Spec↔Referent Alignment Closure delivery)
**Consumes:** substrate-v1-1 (HR1), metaframework-v3-1 (HR4 receive-side), framework-registry-v1-0 (HR5 bidirectional — amendment-log reads + propagation-state writes)
**Consumed by:** registry (HR5 emit at propagation-result emission), framework-audit (co-executes G-U5 per F-phase-1-1-69)
**Dependencies:** substrate-v1-1, metaframework-v3-1, framework-registry-v1-0
**Versioning discipline:** additive only (per MA-L1)

Amendment-propagation is the L2 structural-mode framework that consumes amendment events and verifies propagation completeness across the 6-file system. Per v3-1-spec §4.4: "structural-mode framework; consumes amendment events; verifies propagation completeness." Per metaframework §4.3 F-phase-1-1-69 distribution: sole executor of G-U2 (propagation completeness); co-executor of G-U5 (provenance completeness) with framework-audit. This delivery closes the 6-file system; terminal cross-file gate follows per Phase 9g spec §7. Cycle-1 v1.3 (MF-Cycle-1 Foundation Closure) extends the procedure to 8 steps with AP6.5 cross-framework consistency check per F-cycle-1-10.

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Amendment Propagation |
| Kind | Framework |
| Mode | structural (substrate §2) |
| Level | L2 |
| Version | v1.3 |
| Ownership (template) | L0 |
| v1.3.1 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) | Cycle-1.5 cascade only: count restatements (substrate gate count 4→5; total all-gates 86→87; framework-tier 82 unchanged). Identifier sweep applied: every multi-locus identifier in canonical S6 form. No procedure-step changes; no axiom changes. Additive per MA-L1. | L0 |
| Ownership (applied) | System (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` on first HR-AP1 invocation) |
| Carrier | self (emits propagation-result artifacts) |
| Consumes | substrate-v1-1 (HR1), metaframework-v3-1 (HR4 receive-side), framework-registry-v1-0 (HR5 bidirectional — amendment-log reads via HR-AP2 + propagation-state writes via HR-AP3) |
| Consumed by | registry (HR5 emit at HR-AP3), framework-audit (co-executes G-U5 per F-phase-1-1-69) |
| Authority | L0 confirmed (MF-Cycle-1 Foundation Closure delivery) |
| Genesis | generated-at-bootstrap per substrate §14 (grandfathered at first registry write) |
| scopeOut | `['runtime execution engine (post-9g)', 'self-amendment recursion formalization (post-9g)', 'concurrent multi-amendment coordination (post-beta)']` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | amendment-event queue, propagation-trace state, per-amendment completion status (§3 Structure + §5 Lifecycle) |
| Own I/O | input: `AmendmentEvent` (§2.1); output: `PropagationResult` (§2.2) |
| Own invariants | 69 axioms inherited from metaframework-v3-1 + propagation-completeness invariant (expressed via G-U2 execution at Stage 3 E1 + G-U5 co-execution at Stage 3 E2) + cross-framework consistency invariant (expressed via AP6.5 added cycle-1 per F-cycle-1-10) + drift-disposition routing (expressed via §3.X added cycle-2 per spec §3.6); no own-axiom declarations |
| Own discipline | 8-step P8 procedure (AP1–AP7 + AP6.5) executing G-U2 + G-U5 + cross-framework consistency check across impacted frameworks per §3 + §4; L0 confirmation-gate at AP6 observation per substrate §13 |

All four properties declared. MA-G13 passes. Amendment-propagation classified as framework (not state store, not protocol, not substrate).

---

## §2 Schema

### §2.1 Input — `AmendmentEvent`

Declared local atom.

```
AmendmentEvent = {
  amendmentId: string,
  sourceFrameworkRef: FrameworkRef,
  versionFrom: Semver,
  versionTo: Semver,
  amendmentTrigger: 'vision' | 'gap' | 'L0-directive' | 'first-run',
                                                       // Cycle-1 enum extension per F-cycle-1-6/F-cycle-1-11.
                                                       // 'first-run' triggers AmendmentEvent for metaframework
                                                       // §5.X first-run-execution lifecycle event.
                                                       // Extension authored under MA-S7 (additive Schema-axis amendment);
                                                       // G-S7 verifies enum extension conformance.
  changedElements: AmendmentChange[],
  authorityClaim: AuthorityClaim,
  timestamp: string
}

AmendmentChange = {
  elementKind: 'axiom' | 'gate' | 'primitive-shape' | 'handoff-rule' | 'axis' | 'section',
  elementRef: string,
  changeType: 'added' | 'amended' | 'removed' | 'deprecated'
}
```

### §2.2 Output — `PropagationResult`

Declared local atom.

```
PropagationResult = {
  amendmentId: string,
  impactedFrameworks: FrameworkRef[],
  perFrameworkStatus: PerFrameworkStatus[],
  overallResult: 'complete' | 'partial' | 'blocked',
  gateResults: GateResult[],           // G-U2 + G-U5 executions
  timestamp: string
}

PerFrameworkStatus = {
  frameworkRef: FrameworkRef,
  propagationState: 'propagated' | 'pending' | 'blocked',
  registryUpdateRef?: string,          // registry AmendmentLogEntry ref
  escalation?: EscalationState
}
```

### §2.3 Consumed types (by reference)

| Type | Home |
|---|---|
| `FrameworkRef` | substrate §4 |
| `AuthorityClaim` | substrate §5 |
| `Semver` | substrate §7 |
| `AxiomRef` | substrate §4 |
| `WAtom` | substrate §4 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |
| `Stage`, `StageContentKind` | substrate §8.3 |
| `CaptureShape` | substrate §8.2 |
| `GateResult`, `DimensionResult` | framework-audit-v1-2 §8.1 |
| `RegistryEntry`, `AmendmentLogEntry`, `LifecycleState` | framework-registry-v1-0 §2 |
| `EscalationState` | metaframework-v3-1 §3.5 Vocabulary |

### §2.4 Local atoms

Declared at point of use:

- `AmendmentEvent` — §2.1.
- `AmendmentChange` — §2.1.
- `PropagationResult` — §2.2.
- `PerFrameworkStatus` — §2.2.
- `PropagationTrace` — shape declared inline below (previously deferred; R-phase-1-2-0055 resolution).
- `ImpactedFrameworkSet` — §3.3 vocabulary table (intermediate output of AP2).

**PropagationTrace** (R-phase-1-2-0055 resolution; typed shape per substrate §4.1 typed-shape requirement):
```
PropagationTrace = {
  propagationRunId: string,
  perStepRecords: StepRecord[],
  startTimestamp: string,
  endTimestamp: string
}

StepRecord = {
  stepId: string,
  stage: Stage,
  completedAt: string,
  producedArtifactRef: string
}
```

Referenced by §6.5 Provenance contract. Consumed by framework-audit (G-U5 co-execution via AP5-E2 slice per metaframework §4.3 F-phase-1-1-69 table). `Stage` consumed by reference from substrate §8.3.

### §2.5 Schema rules (ScR-series)

Inherited from metaframework-v3-1 §2.5 by reference. No amendment-propagation-local ScR additions.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only at this section per R-phase-1-1-resolution-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes

Amendment-propagation inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. Amendment-propagation does not redeclare.

Per v3-1-spec §4.4 file-specific placement, amendment-propagation's own structural content is the seven-step P8 procedure declared at §3.3 below.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | `{primitiveKind: P1, instanceCount: 0, basis: "axes inherited from metaframework-v3-1 §3.1; amendment-propagation declares no own axes"}` |
| P2 Sub-axis | 0 | `{primitiveKind: P2, instanceCount: 0, basis: "flat axis structure inherited from metaframework; no sub-axes declared at amendment-propagation level"}` |
| P3 Leaf | 0 | `{primitiveKind: P3, instanceCount: 0, basis: "leaves inherited via axes from metaframework"}` |
| P4 Axiom | 0 | `{primitiveKind: P4, instanceCount: 0, basis: "69 axioms inherited from metaframework-v3-1 §3.2 (post-cycle-2 v3.2.7); propagation-completeness invariant expressed via G-U2 execution path (Stage 3 AP4-E1) + cross-framework consistency invariant expressed via AP6.5 (added cycle-1 per F-cycle-1-10) + drift-disposition routing expressed via §3.X drift-disposition flow (added cycle-2 per spec §3.6 closing outer loop on cycle-1 G9 finding), not as new axioms"}` |
| P5 Gate | 0 | `{primitiveKind: P5, instanceCount: 0, basis: "85 framework-tier gates inherited from metaframework-v3-1 §4.1 (per MetaframeworkGateIdSet derived from substrate §4 A-15, post-cycle-2 v3.2.7); G-U2 (propagation completeness) and G-U5 (provenance completeness) executed by amendment-propagation per F-phase-1-1-69 distribution but declared at metaframework per substrate §1.3 SI-03 permitted-multi-execution; AP6.5 cross-framework consistency check + §3.X drift-disposition flow execute inline within propagation procedure (not new gate declarations); no own gates per L0 Q-cycle-1-1 sprint-optimized ruling"}` |
| P6 Handoff rule | 3 | HR-AP1 (receive HR4 from metaframework), HR-AP2 (read amendment log from registry), HR-AP3 (emit propagation result to registry via HR5) — declared §6.2 |
| P7 Judgment input | 2 own | J-AP1-event-validation (consumed at AP1), J-AP6-propagation-verification (consumed at AP6) — declared §7 |
| P8 Procedure step | **8** | AP1, AP2, AP3, AP4-E1, AP5-E2, AP6, AP6.5, AP7 — declared §3.3 (cycle-1 v1.3 added AP6.5 cross-framework consistency check per F-cycle-1-10) |

Positive empty-declaration markers per substrate §8.6 for P1–P5 zero counts. Implicit-absence disallowed.

### §3.3 Eight-step procedure (AP1–AP7 + AP6.5)

Distributed across substrate-v1-1 Stages 1–5 per PR5 stage-content-kind alignment. Cycle-1 (v1.3) adds AP6.5 cross-framework consistency check per F-cycle-1-10 (runs after AP6 judgment observation, before AP7 closure; mechanical reference-resolution check across all RegistryEntries to verify cross-framework references resolve). Every step declares the amended P8 shape per substrate §8.3: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}` where the kind-specific field is populated per PG6 amended (substrate §11.2).

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **AP1** | 1 | 1 | judgment-input | `AmendmentEvent` | classified-event (validated `AmendmentEvent` + intake annotations) | `judgmentInputRef = J-AP1-event-validation` (declared §7.1) |
| **AP2** | 2 | 2 | mechanical | classified-event | `ImpactedFrameworkSet` (FrameworkRef[] of frameworks requiring propagation) | `derivation = "query registry §6 provenance index for frameworks referencing sourceFrameworkRef; enumerate via registry §4.2 readByProvenance(metaframeworkRef=source, procedureRef=source); filter by changedElements.elementKind to narrow impact surface per amendment-type"` |
| **AP3** | 3 | 2 | mechanical | `ImpactedFrameworkSet` + classified-event | per-framework-propagation-plan (one entry per impacted framework with declared propagation-type) | `derivation = "for each impacted framework F in ImpactedFrameworkSet: determine propagation-type per changeType (added → additive-verify; amended → re-verify; removed → migration-required; deprecated → mark-deprecated); emit plan entry with F.frameworkRef + propagation-type + registry lookup refs"` |
| **AP4-E1** | 4 | 3 | gate-execution | per-framework-propagation-plan | G-U2 gate result per impacted framework + overall G-U2 pass/fail | `gates = [G-U2]` (propagation completeness, sole-executor per F-phase-1-1-69) |
| **AP5-E2** | 5 | 3 | gate-execution | G-U2 gate results + plan | G-U5 gate result per impacted framework + overall G-U5 pass/fail | `gates = [G-U5]` (provenance completeness, co-executor with framework-audit per F-phase-1-1-69) |
| **AP6** | 6 | 4 | judgment-input | G-U2 + G-U5 gate results + per-framework-propagation-plan | outcome-review (L0 confirmation-gate input per §5.3) | `judgmentInputRef = J-AP6-propagation-verification` (declared §7.2) |
| **AP6.5** | 7 | 5 | mechanical | outcome-review (post-L0-confirm) + RegistryEntry[] (via registry §4 readSystemState) | cross-framework consistency report (per-reference resolution status; binary overall pass/fail) | `derivation = "enumerate all RegistryEntries via registry §4 readSystemState (added registry v1.1 per F-cycle-1-9/Q-cycle-1-3); for each entry, parse declared cross-framework references (consumed-atom IDs, cited axiom IDs, cited gate IDs); verify each reference resolves to an existing declaration in the owning framework's RegistryEntry. Mechanical (reference-resolution class per substrate §6.3). On fail: populate per-framework consistency report with first-failing reference; aggregate to blocked status; escalate to L0. Added cycle-1 v1.3 per F-cycle-1-10 cross-framework consistency check; resolves prior gap (no batch-audit / cross-framework consistency surface)."` |
| **AP7** | 8 | 5 | mechanical | outcome-review + AP6.5 consistency report | `PropagationResult` emitted + HR-AP3 invoked with `(amendmentId, impactedFrameworks, perFrameworkStatus, overallResult, gateResults, timestamp)` payload | `derivation = "assemble PropagationResult per §2.2 output schema; populate perFrameworkStatus with propagationState + registryUpdateRef per framework; compute overallResult ∈ {complete, partial, blocked} from aggregate per-framework status + AP6.5 consistency report; invoke HR-AP3 toward registry per metaframework-v3-1 §6.2 HR5 contract; registry write is separate atomic operation per substrate §13.4 with IG1–IG5 discipline per framework-registry-v1-0 §8"` |

**E1–E2 shorthand.** AP4 and AP5 are the two Stage-3 gate-execution P8 instances referenced as E1 and E2 respectively. E1 = G-U2 (propagation completeness, amendment-propagation sole executor). E2 = G-U5 (provenance completeness, co-executor with framework-audit). Per v3-1-spec §3.4 F-phase-1-1-69 distribution. Per 9e E-step precedent: gate-reference-by-ID at declaration tier; per-gate mechanical test body lives where the gate is declared (metaframework §4.3 F-phase-1-1-69 table for G-U2, G-U5) and execution engine is post-9g concern per L0 Q5 ruling.

**Per-row notes:**

- **AP1.** Consumes `AmendmentEvent` per §2.1 input schema. J-AP1-event-validation (declared §7.1) validates sourceFrameworkRef resolution, Semver validity, amendmentTrigger enum, AuthorityClaim well-formedness (C1–C4 mechanical), plus coherence of changedElements (C5 judgment).

- **AP2.** Queries registry provenance index per HR-AP2 read path. Per framework-registry-v1-0 §6 Provenance Index + §4.1 readByProvenance, the registry exposes per-metaframework + per-procedure grouping of RegistryEntry records. AP2's derivation enumerates frameworks that depend on or reference sourceFrameworkRef, filtering by changedElements.elementKind.

- **AP3.** Per-framework planning. Each impacted framework receives a propagation-type based on AmendmentChange.changeType enum. This is a pure mechanical step (no judgment required at plan-level); runtime classification.

- **AP4-E1, AP5-E2.** Stage-3 gate-execution per substrate §8.3 ternary kind + PG6 amended. Per L0 Q5 ruling: declaration is gate-reference-by-ID; execution occurs via MULTI-EXEC per substrate §1.3 SI-03. Co-execution with framework-audit for G-U5 follows F-phase-1-1-69 "AND" semantics — both execute independently on their respective paths when applicable (logged as audit note #4 for post-9g clarification).

- **AP6.** Judgment observation step. J-AP6-propagation-verification (declared §7.2) checks gate-result pass state + per-framework status coherence + fitness for registry emission. L0 confirmation decision is enabled by the observation result; L0 confirmation itself is a substrate §13.6 event, not a P8 output field.

- **AP7.** Terminal P8 — emit + HR-AP3 invocation per 9e precedent. `PropagationResult` emission and registry write are two separate atomic operations per substrate §13.4. AP7 output completes when HR-AP3 invocation returns; registry commit enforced by IG1–IG5 separately.

### §3.4 Stage monotonicity and kind-alignment self-check

Per substrate §10.2 PR4 (stage monotonicity) and PR5 (stage-content-kind alignment), applied to the eight-step procedure (cycle-1 v1.3 added AP6.5 per F-cycle-1-10):

**PR4 — stage monotonicity across order.**

| order | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| stage | 1 | 2 | 2 | 3 | 3 | 4 | 5 | 5 |

Non-decreasing across order. PR4 passes.

**PR5 — stage-content-kind alignment per P8 instance.**

| id | stage | kind | PR5-required kind | aligned |
|---|---|---|---|---|
| AP1 | 1 | judgment-input | judgment-input | ✓ |
| AP2 | 2 | mechanical | mechanical | ✓ |
| AP3 | 2 | mechanical | mechanical | ✓ |
| AP4-E1 | 3 | gate-execution | gate-execution | ✓ |
| AP5-E2 | 3 | gate-execution | gate-execution | ✓ |
| AP6 | 4 | judgment-input | judgment-input | ✓ |
| AP6.5 | 5 | mechanical | mechanical | ✓ |
| AP7 | 5 | mechanical | mechanical | ✓ |

All eight aligned. PR5 passes.

**PG6 amended (substrate §11.2) — kind-specific field requirement:**

- AP1, AP6 (kind=judgment-input) → `judgmentInputRef` declared. ✓
- AP2, AP3, AP6.5, AP7 (kind=mechanical) → `derivation` declared. ✓
- AP4-E1, AP5-E2 (kind=gate-execution) → `gates` populated with tested axiom/invariant refs. ✓

All eight satisfy PG6 amended.

Self-check applied at declaration time; independent re-verification at framework-audit X10 extended predicate post-9g terminal cross-file gate.

### §3.5 Drift-disposition flow (added cycle-2 per spec §3.6; closes outer loop on cycle-1 G9 finding)

Drift-disposition declares the propagation path for ReferentAlignmentState records produced by G-V10 (framework-audit §4.8.4.6) when `truthValue='drifted'`. Closes outer loop per cycle-1 G9 finding (drift detected without disposition path = unaddressed signal).

**Trigger:** G-V10 emits a ReferentAlignmentState (substrate §4 A-19) with `truthValue='drifted'` into AuditRunRecord.referentAlignmentStatesRef (framework-audit §5.9) AND updates SelfAuditRecord.referentAlignmentStates (framework-audit §8.1).

**Five-step disposition flow:**

1. **Detection.** Drift state lands in audit records per the G-V10 emission contract above. No amendment-propagation action yet.

2. **Trigger conversion.** Drift state propagates as AmendmentEvent (§2.1) of kind `amendmentTrigger='gap'` (existing enum at §2.1 — no enum extension required). The drifted framework's referent target is the AmendmentEvent's `sourceFrameworkRef`. AmendmentEvent enters AP1 entry per standard receive path (HR-AP1).

3. **Disposition routing — patch-cycle ownership.** Per L0 ratification on cycle-2 spec §13 item 1: amendment-propagation routes patch-cycle ownership to the framework owning the cited referent (per Living Architecture custody rules), **not** to the framework that declared the citation. Rationale: drift is a property of the referent's state, not the citation's correctness; the referent owner has authority to patch.

   **Citation-update fallback.** When G-S8 (framework-audit §4.8.2.5; ReferentCitation declaration shape conformance) has failed for the same citation, the citation is malformed — drift-disposition routes patch-cycle ownership to the **citing** framework instead. G-S8 is the prerequisite Schema-axis check; if G-S8 fails, the disposition assumption (drift = referent state issue) does not hold.

   Routing decision is mechanical: read G-S8 status for the citation from the same SelfAuditRecord that produced the drifted ReferentAlignmentState. G-S8 passed → referent-owner routing. G-S8 failed → citing-framework routing.

4. **Patch cycle.** Owning framework (per step 3 routing) runs its own amendment cycle (standard MF-Cycle pattern via metaframework + framework-audit). Spec citation updated OR referent patched per investigation outcome.

5. **Re-audit.** Post-patch G-V10 re-execution against new ReferentSnapshot (substrate §4 A-20, captured per MA-L11 stamping). PASS verdict closes the disposition. Failure re-enters at step 1.

**Outer loop closure.** No drift remains detected-but-unaddressed: every G-V10 drift signal has a declared propagation path. Mechanical at every step except the patch cycle's own internal judgment surfaces (which are governed by the receiving framework's own cycle).

**Schema impact at AP:** zero new atoms, zero new own-axioms, zero new own-gates. Drift-disposition is a routing rule expressed as procedural prose — consumes existing AmendmentEvent shape, produces existing PropagationResult shape, executes within existing AP1–AP7+AP6.5 flow. P8 procedure step count unchanged at 8.

### §3.6 Vocabulary (amendment-propagation-local)

Framework-local terms declared inline at point of use per PR1 (substrate §10.2). Substrate, metaframework, registry, and framework-audit terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `AmendmentEvent`, `AmendmentChange` | §2.1 | input atom shapes |
| `PropagationResult`, `PerFrameworkStatus` | §2.2 | output atom shapes |
| `PropagationTrace` | this table | per-step trace record for amendment propagation run (schema deferred per audit note #2) |
| `ImpactedFrameworkSet` | this table | intermediate output of AP2; `FrameworkRef[]` of frameworks identified as requiring propagation |
| `E1, E2` | §3.3 | Stage-3 gate-execution P8 subset shorthand; E1 = AP4 (G-U2), E2 = AP5 (G-U5) |
| `ProcedureStepInstance` | §3.3 | instantiated P8 per substrate §8.3 amended shape |
| `GateReferenceList` | §3.3 row | populated `gates` field at Stage-3 E-step referencing metaframework gate IDs |

---

## §4 Validity

### §4.1 Gate declaration

Amendment-propagation declares **zero own gates** per L0 Q-cycle-1-1 ruling (sprint-optimized default). Gate coverage:

- **Inherited framework-tier gates:** 85 from metaframework-v3-1 §4.1 per `MetaframeworkGateIdSet` derived from substrate §4 A-15, post-cycle-2 v3.2.7 (applied to amendment-propagation itself when audited by framework-audit).
- **Gates executed by amendment-propagation (not owned):** G-U2 (propagation completeness, sole executor per F-phase-1-1-69) at AP4-E1; G-U5 (provenance completeness, co-executor with framework-audit per F-phase-1-1-69) at AP5-E2. Declarations at metaframework §4.3; execution occurs here per substrate §1.3 SI-03 permitted-multi-execution.

Positive empty-declaration per §3.2 row P5. Basis: "85 framework-tier gates inherited from metaframework-v3-1 §4.1 per `MetaframeworkGateIdSet` derived from substrate §4 A-15 (post-cycle-2 v3.2.7); G-U2 and G-U5 executed by amendment-propagation per F-phase-1-1-69 distribution but declared at metaframework per substrate §1.3 SI-03 permitted-multi-execution; AP6.5 cross-framework consistency check + §3.5 drift-disposition flow execute inline within propagation procedure (mechanical reference-resolution per substrate §6.3, not new gate declarations); no own gates per L0 Q-cycle-1-1 sprint-optimized ruling (amendment-propagation's own integrity surface covered by G-U1 self-application + G-M1/M2 axiom-gate mapping + inherited framework-tier gates)."

### §4.2 Gate execution boundary

Per 9e Q-cycle-1-2 + 9f Q5 precedent + L0 Q5 ruling at Phase 9g:

- **Declaration tier.** AP4-E1 and AP5-E2 declare `gates: [G-U2]` and `gates: [G-U5]` respectively per substrate §8.3 amended P8 + PG6 amended (ternary `kind = 'gate-execution'`).
- **Execution tier.** Per substrate §1.3 SI-03 permitted-multi-execution: gate *specification* declared once (at metaframework §4.3); gate *execution* occurs at the framework that claims executor role per F-phase-1-1-69 distribution. Amendment-propagation is sole executor of G-U2 and co-executor of G-U5. Mechanical test body for each gate is inherited-by-reference; runtime execution engine is post-9g concern.

No cross-framework ownership violation. Declaration ≠ execution per MULTI-EXEC.

### §4.3 Inherited framework-tier gates

Enumerated per metaframework-v3-1 §4.7 (85 framework-tier applicable post-cycle-2 v3.2.7, per `MetaframeworkGateIdSet`):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S8, G-St1..G-St16, G-V1..G-V11, G-L1..G-L11, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode + metaframework §4.7 pattern.

### §4.4 Gate execution coverage

- **G-U2 (propagation completeness):** executed at AP4-E1 per per-framework-propagation-plan. Sole executor per metaframework §4.3 F-phase-1-1-69 table.
- **G-U5 (provenance completeness):** executed at AP5-E2 per G-U2 results + plan. Co-executor with framework-audit per metaframework §4.3 F-phase-1-1-69 "AND" semantics — both frameworks execute independently on their respective paths when applicable (framework-audit on per-framework audit path via HR-FA1; amendment-propagation on per-amendment propagation path via HR-AP1). See audit note #4.
- **AP6.5 cross-framework consistency check** (added cycle-1 v1.3 per F-cycle-1-10): executed inline within procedure at order=7, stage=5; mechanical reference-resolution check across all RegistryEntries via registry §4 readSystemState. Not a gate declaration; a propagation-procedure step.

### §4.5 Meta-gate compliance

When audited (by self-application or by another instance), amendment-propagation is subject to metaframework's meta-gates G-M1–G-M4 (axiom-gate 1:1 mapping, gate-set exhaustive, execution order, escalation path declared). Per §3.2 row P4: amendment-propagation declares zero own axioms, so G-M1/G-M2 reduce to inherited-axiom mapping coverage. G-M3/G-M4 apply to the P8 gate-execution steps AP4-E1 and AP5-E2 (each references metaframework-declared G-U2/G-U5 whose escalation paths are declared at metaframework §4.2 per G-M4 requirement).

### §4.6 Backward-invalidation

Per metaframework-v3-1 §4.5: G-M failure → universal gates re-run; substrate-tier failure terminal. Applies to amendment-propagation's propagation results when amendment-propagation itself fails self-audit post-9g terminal cross-file gate.

### §4.7 Current gate results

**All 85 inherited framework-tier gates: state = `not-yet-run`.** (52 from v3.2.1 inherited, 28 added at v3.2.3 cycle, 2 added at cycle-1 v3.2.4: G-S7 + G-V11; 3 added at cycle-2 v3.2.7: G-V10 + G-S8 + G-L11.) First-run pending post-9g terminal cross-file gate (when L0 confirms first system-wide audit cycle per Phase 9g spec §7 step 6); cycle-2-added gates first-run scheduled at first system-wide audit cycle post-cycle-2 ratification per metaframework §5.X first-run-execution lifecycle event.

**G-U2 and G-U5 execution state at delivery: `not-yet-invoked`** (no AmendmentEvent processed yet; first run occurs when first AmendmentEvent arrives via HR-AP1 post-9g).

Compact summary per sprint-mode.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 → v1.1 → v1.2 → v1.3 → v1.3.1 → v1.3.2 → v1.3.3. Additive per MA-L1. v1.1 (Phase 1.2-fix delivery) amendments: §2.4 PropagationTrace inline shape declared (per R-phase-1-2-0055); §3.2 + §4.1 + §4.3 + §4.7 + §8 gate count 45→52 (per R-phase-1-2-0020 KA-Build-2 cascade). v1.2 (v3.2.3 cascade): §1 + §3.2 + §4.1 + §4.3 + §4.7 + §8 axiom count restatements 36→64 and gate count restatements 52→80 per MA-S5 cross-file restatement consistency (the very axiom added that cycle); inherited gate ID enumeration extended for 28 v3.2.3 axiom-gates. v1.3 (MF-Cycle-1 Foundation Closure): §2.1 `amendmentTrigger` enum extended to include `'first-run'` per F-cycle-1-6/F-cycle-1-11 (extension authored under MA-S7 additive Schema-axis amendment; G-S7 verifies); §3.2 + §4.1 + §4.3 + §4.7 + §8 axiom count restatements 64→66 and gate count restatements 80→82 per metaframework v3.2.4 cycle-1 cascade; §3.2 P8 row 7→8 with AP6.5 added; §3.3 procedure expanded to eight steps with AP6.5 cross-framework consistency check (added cycle-1 per F-cycle-1-10; runs after AP6, before AP7; mechanical reference-resolution check across all RegistryEntries via registry §4 readSystemState added registry v1.1 per F-cycle-1-9/Q-cycle-1-3); §3.4 self-check tables updated to 8 rows; §1 own-discipline restated 7-step → 8-step. Per MA-L1 additive — no procedural change to existing 7 steps; AP6.5 inserted between AP6 and AP7. v1.3.3 (MF-Cycle-2 Spec↔Referent Alignment Closure): §3.5 drift-disposition flow declared per spec §3.6 (five-step flow; closes outer loop on cycle-1 G9 finding; routing decision is mechanical via G-S8 status read from same SelfAuditRecord); §3.2 P4 inherited 66→69, P5 inherited 82→85; §4.1 + §4.3 + §4.7 + §8 inherited gate count restatements 82→85 with G-V10 + G-S8 + G-L11 enumeration; §1 MA-G13 own-invariants restated 66→69 + drift-disposition routing invariant added. P8 procedure step count unchanged at 8 (drift-disposition is a routing rule expressed as procedural prose within existing AP1–AP7+AP6.5 flow, not a new step). AmendmentEvent.amendmentTrigger enum unchanged (drift uses existing `'gap'` value).

**Meta-note:** amendment-propagation is the framework that handles amendments to other frameworks. Its own amendments loop through itself per bootstrap-recursion handling — see §5.7 below.

### §5.2 Amendment trigger

Gap-driven per MA-L4 OR L0-directive. Amendment paths to amendment-propagation:
- New failure mode for propagation procedure → MA-L4 amendment + version bump.
- Addition of new gate to F-phase-1-1-69 distribution requiring amendment-propagation execution → MA-L4 amendment + AP4/AP5 step extension.
- Schema amendment to AmendmentEvent, PropagationResult → MA-L4 amendment + version bump.
- Modification to the 7-step P8 procedure → MA-L4 amendment + PR4/PR5 re-verification.

All amendments require:
- Amendment rationale (gap or L0 directive).
- v3-1-spec §1.3 ledger row.
- Re-run of G-spec-1 through G-spec-8 against amended file.
- Registry amendment log entry per framework-registry-v1-0 §2.4.
- Per bootstrap-recursion (§5.7): fresh amendment-propagation invocation using pre-amendment version to process its own amendment.

### §5.3 Confirmation gate

L0 confirms at Phase 9g delivery. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation cycle).

AP6 is the per-propagation confirmation-gate input edge. L0 receives J-AP6-propagation-verification output + G-U2/G-U5 gate results via substrate §13 activation flow; decision is substrate §13.6 event.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` at delivery.

### §5.5 Judgment deprecations

Empty at delivery. J-AP1-event-validation and J-AP6-propagation-verification both active.

### §5.6 Failure modes

Per v3-1-spec §3.3 output-schema `lifecycle` field (V5-verification additions):

- **AP1** `AmendmentEvent` with invalid `sourceFrameworkRef` (unregistered framework) → reject at J-AP1 C1; emit blocked `PropagationResult` with `overallResult: 'blocked'` + escalate to L0 per MA-J1 + triggerEvent.
- **AP1** `versionFrom`/`versionTo` Semver invalid → reject at J-AP1 C2; blocked PropagationResult.
- **AP1** `amendmentTrigger` out-of-enum (i.e., not in `{'vision', 'gap', 'L0-directive', 'first-run'}` per cycle-1 enum extension) → reject at J-AP1 C3; blocked PropagationResult.
- **AP1** `authorityClaim` malformed → reject at J-AP1 C4; escalate to L0 per substrate §5.
- **AP2** registry provenance-index read failure (HR-AP2 path) → suspend per substrate §13.6; retry on registry availability; no PropagationResult emitted until read succeeds.
- **AP4-E1** G-U2 fail on framework F → populate `PerFrameworkStatus.propagationState = 'blocked'` with `escalation: EscalationState{status: 'blocked', gap: 'G-U2 propagation incomplete for framework F', requiredMode: 'verificative'}`; continue to AP5 for remaining frameworks; aggregate `overallResult` to 'partial' or 'blocked' at AP7 per remaining-framework status.
- **AP5-E2** G-U5 fail on framework F → same pattern as AP4-E1 with `gap: 'G-U5 provenance incomplete for framework F'` and `requiredMode: 'verificative'`.
- **AP6** L0 withholds confirmation OR L0 unavailable → suspend per substrate §13.6 L0-unavailability response; state persists in registry; resume idempotently on L0 return.
- **AP6.5** cross-framework reference fails to resolve (consumed-atom ID, cited axiom ID, or cited gate ID does not exist in owning framework's RegistryEntry) → populate consistency report with first-failing reference + owning-framework-ref; aggregate to blocked status; escalate to L0 per substrate §13.6; PropagationResult marked `overallResult: 'blocked'` at AP7.
- **AP7** HR-AP3 invocation rejected by registry (IG1 AuthorityClaim missing, IG3 uniqueness violation, IG4 provenance missing, IG5 lifecycle state out-of-enum) → PropagationResult not persisted; escalate to L0; amendment-propagation activation rolls back per substrate §13.4 "atomic with recovery point: pre-emission state in owned framework."
- **First-run AmendmentEvent** (cycle-1 enum extension): treated identically to other AmendmentEvent kinds at AP1–AP7; no axiom/gate/atom shape changes (per MA-L1 additivity preserved); produces standard AmendmentLogEntry (alias of AmendmentProvenance per substrate §4 A-16) but the AmendmentEvent does not amend the framework — it stamps execution per metaframework §5.X first-run-execution lifecycle event.
- **Registry-lock contention** per substrate §13.5 → wait-policy per activationTrigger.concurrencyPolicy ('wait' or 'reject').

### §5.7 Self-amendment bootstrap handling

When amendment-propagation amends itself (meta-recursion), the amendment event is processed by a **fresh invocation using the pre-amendment version**. Post-amendment state replaces pre-amendment state atomically per registry discipline (IG1–IG5 + W4 atomicity). Bootstrap non-re-entrancy per MA-L7 + substrate §14.5 governs the first-version case (no amendment-propagation exists pre-bootstrap to self-amend; first version is L0 hand-authored at bootstrap event per substrate §14).

Sprint-mode declaration depth per L0 Q-cycle-1-3 ruling. Formalization of self-amendment procedure deferred to post-9g terminal cross-file gate.

### §5.8 Scale bounds

Per V5 verification:

- Per-propagation cost: O(F × (log R + C)) where F = impacted framework count, R = registry size (for provenance lookup), C = changedElements count (for per-framework plan generation).
- Registry interaction: 1 read per framework at AP2 (provenance index lookup) + 1 write per framework at AP7 (amendment log entry).
- Total state: bounded by registry size + amendment log depth per framework per framework-registry-v1-0 §2.4.

Bounds declared, not measured. Runtime measurement deferred post-9g terminal cross-file gate.

### §5.9 Atomicity declarations

Per substrate §13.4 row "Owned framework execution: interruptible" with per-step checkpoint:

- **Per-P8-step:** atomic per P8 instance completion (one output emitted per atomic step invocation). Recovery point = step `order` value. Recovery procedure: re-enter from failed step's order with upstream state reloaded from registry (registry-lock per substrate §13.5 held across suspension).
- **Full propagation run:** interruptible at step boundary per substrate §13.4.
- **Per-framework registry update (AP7 via HR-AP3):** individual atomic write per framework-registry-v1-0 IG1–IG5 + W4. Multi-framework propagation = sequence of atomic writes per registry W4 (no cross-framework transactional semantics; each framework independent).
- **Result emission via HR-AP3:** atomic per substrate §13.4 outcome-emission row (atomic with recovery point = pre-emission state in amendment-propagation).

### §5.10 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9g delivery | Initial amendment-propagation-v1-0 artifact. Seven P8 steps (AP1–AP7) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. AP4-E1 executes G-U2 (propagation completeness, sole executor per F-phase-1-1-69). AP5-E2 executes G-U5 (provenance completeness, co-executor with framework-audit per F-phase-1-1-69). HR-AP1 receive + HR-AP2 registry-read + HR-AP3 emit declared with captureShapes. J-AP1-event-validation + J-AP6-propagation-verification declared. Zero own gates per sprint-optimized default. Closes 6-file system. | L0 |
| v1.1 | Phase 1.2-fix delivery | §2.4 PropagationTrace inline shape + StepRecord shape declared (per R-phase-1-2-0055); §3.2 + §4.1 + §4.3 + §4.7 + §8 gate count restatements updated 45→52 with `MetaframeworkGateIdSet` atom reference (per R-phase-1-2-0020 KA-Build-2 cascade). §1 Identity: scopeOut row added per R-phase-1-2-0042. v1.0 content otherwise preserved verbatim. | L0 |
| v1.2 | Phase v3.2.3 delivery (2026-04-27) | §1 + §3.2 + §4.1 + §4.3 + §4.7 + §8 axiom-count restatements 36→64; gate-count restatements 52→80; inherited gate ID enumeration extended for v3.2.3 axiom-gates. Per MA-S5 cross-file restatement consistency. v1.1 content otherwise preserved verbatim. | L0 |
| v1.3 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cluster C closure-class amendments: §3.3 procedure expanded to **8 steps** with new step **AP6.5** (cross-framework consistency check, F-cycle-1-10/§3.13). Runs Stage 5, kind=mechanical, between AP6 and AP7. Mechanical reference-resolution check across all RegistryEntries via registry §4 readSystemState (added registry v1.1 cycle-1 per F-cycle-1-9/Q-cycle-1-3). §3.4 self-check tables updated to 8 rows; PR4 monotonicity holds (stage 5/5 at order 7/8); PR5 kind alignment holds (AP6.5 mechanical, AP7 mechanical). §1 own-discipline restated 7-step → 8-step; own-invariants extended with cross-framework consistency invariant. §3.2 P4 64→66 (axiom inheritance), P5 80→82, P8 7→8. §2.1 `amendmentTrigger` enum extended from `'vision' \| 'gap' \| 'L0-directive'` to `'vision' \| 'gap' \| 'L0-directive' \| 'first-run'` per F-cycle-1-6 audit fix on F-cycle-1-11 (extension authored under MA-S7 additive Schema-axis amendment; G-S7 verifies). §7.1 J-AP1 C3 enum-membership predicate updated to match. §5.6 failure modes extended with AP6.5 reference-resolution failure + first-run AmendmentEvent handling note (treats identically per MA-L1 additivity). Inherited gate count + ID enumeration cascade per metaframework v3.2.4 (80→82 incl. G-S7 + G-V11). v1.2 content otherwise preserved verbatim. | L0 |
| v1.3.1 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29; row added at cycle-1.6 — closes cycle-1.5 §9 self-amendment gap) | Substrate v1.3 → v1.4 cascade. Count restatements: substrate-gate count 4→5; total all-gates 86→87 (framework-tier 82 unchanged — substrate gates excluded per substrate §11.5 tier-1). Identifier sweep applied: every multi-locus identifier in canonical S6 form per substrate §1.5. No procedure-step changes; no axiom changes. Additive per MA-L1 + MA-S7. | L0 |
| v1.3.2 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | Substrate v1.4 → v1.5 cascade. Identifier-sweep companion: AP body sites swept per substrate §1.5 amended (Phase 1.1 references reclassified — atom shape A-NN bare, finding F-phase-1-1-A-NN kept, resolution R-phase-1-1-resolution-NN). No structural counts changed. Corrective-cycle scope. | L0 |
| v1.3.3 | MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30) | Substrate v1.5 → v1.6 + metaframework v3.2.6 → v3.2.7 cascade. **Drift-disposition flow declared** at new §3.5 per spec §3.6 (closes outer loop on cycle-1 G9 finding): five-step flow Detection → Trigger conversion (drift state propagates as AmendmentEvent of kind `'gap'`; existing enum, no extension required) → Disposition routing (patch-cycle ownership routes to referent owner per Living Architecture custody + L0 ratification on cycle-2 §13 item 1; citation-update fallback when G-S8 fails routes to citing framework instead) → Patch cycle (owning framework runs standard MF-Cycle pattern) → Re-audit (post-patch G-V10 against new ReferentSnapshot). Zero new atoms, zero new own-axioms, zero new own-gates; routing rule expressed as procedural prose within existing AP1–AP7+AP6.5 flow. P8 procedure step count unchanged at 8. **Count cascade:** §3.2 P4 inherited 66→69, P5 inherited 82→85; §1 MA-G13 own-invariants 66→69 + drift-disposition routing invariant added; §4.1 inherited gate count 82→85 with G-V10 + G-S8 + G-L11 enumeration; §4.3 + §4.7 enumeration extended; §5.6 failure modes extended with drift-disposition-routing failure note. AmendmentEvent.amendmentTrigger enum unchanged (drift uses existing `'gap'` value). All amendments additive per MA-L1 + MA-S7 (recursive scope per metaframework v3.2.7 §3.2.1 amendment). v1.3.2 content otherwise preserved verbatim. | L0 |

---

## §6 Coupling

### §6.1 Carrier

Amendment-propagation carrier = `self`. Emits `PropagationResult` artifacts at AP7 per HR-AP3 invocation.

### §6.2 Handoff rules

Three framework-local HR instances.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| HR-AP1 | metaframework → amendment-propagation (receives HR4) | `['self', 'named', 'none']` (matches metaframework-v3-1 §6.2 HR4) | true | declared §6.3 |
| HR-AP2 | amendment-propagation → registry (reads amendment log + provenance index) | `['self', 'named', 'none']` | false (read-only path) | n/a (per substrate §8.2 conditional captureShape — optional when diagnosticSignificance=false) |
| HR-AP3 | amendment-propagation → registry (emits propagation result via HR5 path) | `['self', 'named', 'none']` | true | declared §6.3 |

**HR-AP1 receive-side mirrors metaframework-v3-1 §6.2 HR4** by construction per MA-C3 handoff-invariant symmetry. Carrier applicability matches HR4 send-side.

**HR-AP2 read-only path** is not a send-side HR declared at metaframework; it's a read operation against registry's §4.2 query interface (readByProvenance, readByFrameworkRef). Declared as P6 instance here for custody completeness per PR1 primitive traceability. Non-diagnostic because read-only; captureShape empty per substrate §8.2 conditional.

**HR-AP3 emit-side** uses registry's HR5 receive path (metaframework §6.2 HR5). Amendment-propagation invokes HR5; registry performs write per IG1–IG5 (framework-registry-v1-0 §8). Two atomic operations per substrate §13.4.

### §6.3 Capture shapes

Per substrate §8.2 amended P6 shape + metaframework-v3-1 §6.3 pattern.

**HR-AP1 (receive):**
```
captureShape = {
  capturedFields: ['amendmentEventId', 'sourceFrameworkRef', 'amendmentTrigger',
                   'initiator', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit-v1-2 §5.9 AuditRunRecord queryByFrameworkRef'
}
```

**HR-AP2 (read-only path):** n/a — diagnosticSignificance=false per substrate §8.2 conditional. Captured data lives on registry side per registry §4 read discipline.

**HR-AP3 (emit):**
```
captureShape = {
  capturedFields: ['propagationRunId', 'amendmentId', 'impactedFrameworks',
                   'overallResult', 'timestamp', 'authorityClaim'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByFrameworkRef + propagation-result lookup'
}
```

### §6.4 Custody table

Every atom owned or consumed, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `Mode` | substrate | L1 | amendment-propagation (via HR1) |
| `AuthorityClaim` | substrate | L1 | amendment-propagation (AP1 validation, AP7 emission) |
| `FrameworkRef` | substrate | L1 | amendment-propagation (per-framework addressing) |
| `AxiomRef` | substrate | L1 | amendment-propagation (AmendmentChange.elementRef resolution) |
| `WAtom` | substrate | L1 | amendment-propagation (via HR1) |
| `Judgment`, `JudgmentId` | substrate | L1 | amendment-propagation (J-input typing) |
| `Semver` | substrate | L1 | amendment-propagation (versionFrom/versionTo validation) |
| `Stage`, `StageContentKind` | substrate | L1 | amendment-propagation (all P8 instances) |
| `CaptureShape` | substrate | L1 | amendment-propagation (HR-AP1/HR-AP3 captureShapes §6.3) |
| `OriginProvenance` | substrate §4 A-05 (in-place rename cycle-1 per F-cycle-1-12) | L1 | amendment-propagation (PropagationTrace per-step provenance origin) |
| `AmendmentProvenance` | substrate §4 A-16 (added cycle-1 per F-cycle-1-12) | L1 | amendment-propagation (per-amendment provenance records via PropagationTrace + PropagationResult); registry (AmendmentLogEntry alias) |
| `GateIdSet` | substrate §4 A-15 (added cycle-1 per F-cycle-1-14; consumed via metaframework's `MetaframeworkGateIdSet` derived consumer instance) | L1 | amendment-propagation (§4.1 inherited-gate basis, §4.3 inherited gate enumeration) |
| `MetaframeworkInput`, `GeneratedFrameworkTemplate` | metaframework | L2 | amendment-propagation (impact analysis input read) |
| `EscalationState` | metaframework | L2 | amendment-propagation (PerFrameworkStatus.escalation field per §2.2) |
| `GateResult`, `DimensionResult` | framework-audit | L2 | amendment-propagation (PropagationResult.gateResults field per §2.2) |
| `RegistryEntry`, `AmendmentLogEntry`, `LifecycleState` | registry | L2 | amendment-propagation (AP2 read via HR-AP2; AP7 write via HR-AP3) |
| `AmendmentEvent` | amendment-propagation | L2 | amendment-propagation (HR-AP1 receive, AP1 consume) |
| `AmendmentChange` | amendment-propagation | L2 | amendment-propagation (AmendmentEvent.changedElements) |
| `PropagationResult` | amendment-propagation | L2 | amendment-propagation (AP7 emit); registry (via HR-AP3); framework-audit (SelfAuditRecord.gateResults consumers) |
| `PerFrameworkStatus` | amendment-propagation | L2 | amendment-propagation (PropagationResult.perFrameworkStatus) |
| `PropagationTrace` | amendment-propagation | L2 | amendment-propagation (per-step trace; schema deferred per audit note #2) |
| `ImpactedFrameworkSet` | amendment-propagation | L2 | amendment-propagation (AP2 output, AP3 input) |
| `J-AP1-event-validation` | amendment-propagation | L2 | amendment-propagation AP1 only |
| `J-AP6-propagation-verification` | amendment-propagation | L2 | amendment-propagation AP6 only |
| `HR-AP1`, `HR-AP2`, `HR-AP3` | amendment-propagation | L2 | amendment-propagation §6.2 |

Substrate, metaframework, framework-audit, and registry atoms consumed by reference. Amendment-propagation-declared atoms produced here and consumed by registry (PropagationResult persistence) and framework-audit (gate result consumers).

### §6.5 Provenance contract

Per MA-C5 + R-phase-1-1-resolution-20 reference-default. Every emitted `PropagationResult` at AP7 traces to:

- declared `AmendmentEvent` (the triggering amendment, referenced by amendmentId),
- per-step P8 outputs (classified-event from AP1, ImpactedFrameworkSet from AP2, per-framework-propagation-plan from AP3, G-U2 results from AP4-E1, G-U5 results from AP5-E2, outcome-review from AP6),
- per-framework registry update refs (populated in `PerFrameworkStatus.registryUpdateRef`).

`PropagationTrace` captures the per-step provenance chain per run (schema deferred per audit note #2). Reference-default per R-phase-1-1-resolution-20: provenance fields store FrameworkRefs and registry-archived references where possible; by-value retention is opt-in.

### §6.6 OperatorInterface

Per V5 verification.

- **Invocation entry:** via HR-AP1 receive-side. Not directly invocable by L0; L0 activates metaframework (HR0), metaframework dispatches to amendment-propagation per Mode=structural when amendment event requires propagation.
- **Output emission:** via AP7 HR-AP3 invocation toward registry.
- **Audit query:** via framework-audit HR-FA1 path; framework-audit reads amendment-propagation's P8 declarations + PropagationResult history for X-dimension evaluation.
- **Review interface:** L0 reviews propagation outcomes via registry query path per §5.10 version history + framework-registry-v1-0 §4.2.

Runtime implementation deferred post-9g. Declarations only at this delivery.

### §6.7 MA-C1–MA-C6 satisfaction

All six Coupling axioms satisfied at handoff tier per metaframework-v3-1 §3.2 inheritance + §3.5 declarations:

- **MA-C1** (carrier declared) — §6.1 declares carrier=self.
- **MA-C2** (custody complete) — §6.4 enumerates every atom (22 rows).
- **MA-C3** (handoff-invariant symmetry) — HR-AP1 receive matches metaframework §6.2 HR4 send by construction; HR-AP3 emit uses registry HR5 receive contract.
- **MA-C4** (provenance populated) — §6.5 declares.
- **MA-C5** (provenance contract) — §6.5 declares.
- **MA-C6** (carrier-applicability enforced) — HR-AP1 applicability `['self','named','none']` matches HR4 send-side; HR-AP3 applicability `['self','named','none']` matches HR5 receive-side; HR-AP2 applicability `['self','named','none']` for read path applies regardless of carrier per substrate §9 shorthand `'all'`.

---

## §7 Judgment

Two amendment-propagation-local J-inputs declared at point of use (per 9e Q6 pattern).

### §7.1 J-AP1-event-validation

Consumed at AP1.

```
J-AP1-event-validation:
  kind: classification
  consumedBy: amendment-propagation-v1-0 §3.3 AP1
  shape: Judgment per substrate §6.2
  input: { AmendmentEvent }
  criteria:
    C1: sourceFrameworkRef resolves to registered framework
        (mechanical — registry §4.2 readByFrameworkRef lookup; non-null RegistryEntry required).
    C2: versionFrom, versionTo are valid Semver per substrate §7
        (mechanical — Semver regex validation per substrate §7 declaration).
    C3: amendmentTrigger ∈ {'vision', 'gap', 'L0-directive', 'first-run'}
        (mechanical — enum membership check; cycle-1 enum extension per F-cycle-1-6/F-cycle-1-11 covers first-run-execution lifecycle event from metaframework §5.X).
    C4: authorityClaim is well-formed per substrate §5
        (mechanical — type-shape check + level/confirmedBy/timestamp presence).
    C5: event is coherent — changedElements internally consistent with versionFrom → versionTo transition
        (judgment — non-mechanical coherence: for each AmendmentChange, verify changeType is valid
         against source framework's state at versionFrom; e.g., 'removed' requires the element
         existed at versionFrom).
  provenance:
    instanceId: <runtime per invocation>
    cycleId: <runtime per invocation>
    timestamp: <runtime>
    consumingFrameworkRef: amendment-propagation-v1-0
    consumingStepId: AP1
```

C1–C4 mechanical per substrate §6.3 mechanical-criterion ground classes (enumeration, lookup, type-shape). C5 is judgment per MA-J2 mechanical-criterion ground — coherence of changedElements against source-framework state-at-versionFrom requires non-mechanical assessment.

### §7.2 J-AP6-propagation-verification

Consumed at AP6.

```
J-AP6-propagation-verification:
  kind: classification
  consumedBy: amendment-propagation-v1-0 §3.3 AP6
  shape: Judgment per substrate §6.2
  input: {
    gateResults: GateResult[],                          // G-U2 + G-U5 results from AP4-E1 + AP5-E2
    perFrameworkPropagationPlan: per-framework-propagation-plan   // from AP3
  }
  criteria:
    C1: all G-U2 executions state ∈ {'pass', 'n/a-with-basis'}
        (mechanical — aggregation over gateResults filtered by gateId='G-U2').
    C2: all G-U5 executions state ∈ {'pass', 'n/a-with-basis'}
        (mechanical — aggregation over gateResults filtered by gateId='G-U5').
    C3: no PerFrameworkStatus in 'blocked' state without declared escalation
        (mechanical — for each PerFrameworkStatus where propagationState='blocked',
         verify escalation field populated per substrate §13.6 EscalationState shape).
    C4: outcome is fit for registry emission
        (judgment — non-mechanical fitness: overall propagation result integrity,
         alignment of per-framework status with aggregate result).
  provenance:
    instanceId: <runtime per invocation>
    cycleId: <runtime per invocation>
    timestamp: <runtime>
    consumingFrameworkRef: amendment-propagation-v1-0
    consumingStepId: AP6
```

C1–C3 mechanical per substrate §6.3 ground classes (aggregation, field-presence check). C4 is judgment per MA-J2 — fitness for registry emission requires non-mechanical assessment at runtime.

### §7.3 Axis status

Populated (not empty). Two amendment-propagation-local J-inputs declared. Empty-declaration rule (substrate §8.6) does not apply.

### §7.4 Judgment provenance

Both J-inputs ratified at Phase 9g L0 confirmation. Runtime provenance populated per invocation per MA-J4 provenance-completeness: every judgment consumption at AP1 and AP6 produces a provenance record with instanceId + cycleId + timestamp + consumingFrameworkRef + consumingStepId.

---

## §8 Self-audit results

Per metaframework-v3-1 §8 pattern (compact sprint-mode placeholder per L0 Q-cycle-1-4 sprint-mode directive).

### §8.1 Gate results

No amendment-propagation-declared gates (per §4.1 zero own gates). Framework-tier gates inherited from metaframework-v3-1 §4.1 (85 applicable post-cycle-2 v3.2.7, per `MetaframeworkGateIdSet` derived from substrate §4 A-15). State = `not-yet-run` for framework-audit first-run against amendment-propagation, post-9g terminal cross-file gate.

Inherited gate ID enumeration matches metaframework §4.7 (85 framework-tier):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S8, G-St1..G-St16, G-V1..G-V11, G-L1..G-L11, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §8.2 Dimension audit results

All 10 framework-audit dimensions (X1–X10) against amendment-propagation: state = `pending-first-run`. Uniform state; compact summary per sprint-mode.

Dimension IDs enumerated: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-2 §3.3.

**X10 extended predicate relevance.** Phase 1.2 extended X10 with three bullets (stage declaration per substrate §8.3, PR4 monotonicity, PR5 kind alignment). X10 applies directly to amendment-propagation's seven P8 instances. Self-check already applied at §3.4 (all seven pass); framework-audit first-run verifies independently.

**X3 extended criterion C5 relevance.** Phase 1.2 extended X3 with C5 (captureShape required per P6 instance with diagnosticSignificance=true). Amendment-propagation declares three HRs: HR-AP1 + HR-AP3 diagnosticSignificance=true with populated captureShape at §6.3 (satisfies C5); HR-AP2 diagnosticSignificance=false (C5 n/a per substrate §8.2 conditional).

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application) at metaframework-v3-1 §4.3: framework-audit runs X1–X10 against amendment-propagation post-9g terminal cross-file gate. At Phase 9g delivery, self-audit is declared-placeholder state. No dimension has evaluated independently; §3.4 stage/kind self-check and §8.2 X10/X3 self-checks are author-side pre-verifications, not framework-audit first-run execution.

Terminal cross-file gate post-9g ratifies initial state per Phase 9g spec §7 step 6.

**Bootstrap recursion note:** amendment-propagation-v1-0 cannot self-audit itself at genesis (no framework-audit-v1-2 exists pre-bootstrap to audit anything; no amendment-propagation pre-bootstrap to propagate its own amendments). First self-audit + first self-amendment occur post-bootstrap when all six files (substrate-v1-1, framework-registry-v1-0, metaframework-v3-1, generation-procedure-v1-0, framework-audit-v1-2, amendment-propagation-v1-0) coexist. L0 records first self-audit confirmation in registry bootstrap event per substrate §14.

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9g delivery | Initial amendment-propagation-v1-0 artifact. Seven P8 steps (AP1–AP7) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. AP4-E1 executes G-U2 (propagation completeness, sole executor per metaframework §4.3 F-phase-1-1-69). AP5-E2 executes G-U5 (provenance completeness, co-executor with framework-audit per F-phase-1-1-69). HR-AP1 receive-side (mirrors metaframework §6.2 HR4) + HR-AP2 registry-read (diagnosticSignificance=false) + HR-AP3 emit (mirrors metaframework §6.2 HR5 receive) declared with captureShapes. J-AP1-event-validation (consumed at AP1) + J-AP6-propagation-verification (consumed at AP6) declared with mixed mechanical + judgment criteria per MA-J2. Zero own gates per L0 Q-cycle-1-1 sprint-optimized ruling. PropagationResult emission and registry write are two separate atomic operations per substrate §13.4 + registry IG1–IG5. Self-amendment bootstrap handling declared at high-level depth per L0 Q-cycle-1-3 ruling; formalization deferred to post-9g terminal cross-file gate. Closes 6-file system. | L0 |
| v1.1 | Phase 1.2-fix delivery | §2.4 PropagationTrace inline shape + StepRecord shape declared (per R-phase-1-2-0055); §3.2 + §4.1 + §4.3 + §4.7 + §8 gate count restatements updated 45→52 with `MetaframeworkGateIdSet` atom reference (per R-phase-1-2-0020 KA-Build-2 cascade). §1 Identity: scopeOut row added per R-phase-1-2-0042. v1.0 content otherwise preserved verbatim. | L0 |
| v1.2 | Phase v3.2.3 delivery (2026-04-27) | §1 Own-invariants + §3.2 P4/P5 + §4.1 basis + §4.3 + §4.7 + §8 count restatements: axiom 36→64, framework-tier gate 52→80; inherited gate ID enumeration extended for 28 v3.2.3 axiom-gates. Per MA-S5 cross-file restatement consistency (the new axiom added this cycle). v1.1 content otherwise preserved verbatim. | L0 |
| v1.3 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cluster C closure-class amendments per spec §3.13 + §3.14: AP6.5 cross-framework consistency check added (F-cycle-1-10) — new mechanical P8 step at Stage 5 between AP6 and AP7 (8-step procedure); §3.3 procedure table extended; §3.4 PR4/PR5 self-check tables expanded to 8 rows (all pass). §2.1 `amendmentTrigger` enum extended with `'first-run'` per F-cycle-1-6 audit fix on F-cycle-1-11 — extension authored under MA-S7 additive Schema-axis amendment (G-S7 verifies); §7.1 J-AP1 C3 enum predicate updated. §1 own-discipline restated 7-step → 8-step; §1 own-invariants extended with cross-framework consistency invariant. §3.2 P4 64→66, P5 80→82, P8 7→8. §4.1 + §4.3 + §4.7 + §8.1 inherited count + ID enumeration cascade per metaframework v3.2.4 (G-S7 + G-V11 added). §5.6 failure modes extended: AP6.5 reference-resolution failure pattern + first-run AmendmentEvent handling note. §5.10 history v1.1 row added (closes Cluster E v1.1-row-absence per spec §3.16). §6.4 custody table — new rows for OriginProvenance (A-05 cycle-1 rename), AmendmentProvenance (A-16 cycle-1), GateIdSet (A-15 cycle-1). v1.2 content otherwise preserved verbatim. | L0 |
| v1.3.1 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29; row added at cycle-1.6 — closes cycle-1.5 §9 self-amendment gap) | Substrate v1.3 → v1.4 cascade. Identifier sweep applied across §1–§9 body: every multi-locus identifier in canonical S6 form per substrate §1.5. No procedural change (AP1–AP7 + AP6.5 unchanged); no axiom / J-input amendments — corrective patch-level to cycle-1 v1.3. v1.3 content otherwise preserved verbatim. | L0 |
| v1.3.2 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | Substrate v1.4 → v1.5 cascade. Identifier-sweep companion: 3 amendment-propagation body sites swept per substrate §1.5 amended (Phase 1.1 references reclassified — atom shape A-NN bare, finding F-phase-1-1-A-NN kept, resolution R-phase-1-1-resolution-NN). No procedural change; no axiom / gate / HR / primitive / J-input amendments — corrective-cycle scope. v1.3.1 content otherwise preserved verbatim. | L0 |

---

## End of amendment-propagation-v1-0
