# amendment-propagation-v1-0

**Kind:** Framework
**Mode:** structural
**Level:** L2
**Version:** v1.2.2
**Authority:** L0 confirmed (Phase v3.2.3 delivery)
**Consumes:** substrate-v1-1 (HR1), metaframework-v3-1 (HR4 receive-side), framework-registry-v1-0 (HR5 bidirectional — amendment-log reads + propagation-state writes)
**Consumed by:** registry (HR5 emit at propagation-result emission), framework-audit (co-executes G-U5 per F-69)
**Dependencies:** substrate-v1-1, metaframework-v3-1, framework-registry-v1-0
**Versioning discipline:** additive only (per MA-L1)

Amendment-propagation is the L2 structural-mode framework that consumes amendment events and verifies propagation completeness across the 6-file system. Per v3-1-spec §4.4: "structural-mode framework; consumes amendment events; verifies propagation completeness." Per metaframework §4.3 F-69 distribution: sole executor of G-U2 (propagation completeness); co-executor of G-U5 (provenance completeness) with framework-audit. This delivery closes the 6-file system; terminal cross-file gate follows per Phase 9g spec §7.

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Amendment Propagation |
| Kind | Framework |
| Mode | structural (substrate §2) |
| Level | L2 |
| Version | v1.2.2 |
| Ownership (template) | L0 |
| Ownership (applied) | System (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` on first HR-AP1 invocation) |
| Carrier | self (emits propagation-result artifacts) |
| Consumes | substrate-v1-1 (HR1), metaframework-v3-1 (HR4 receive-side), framework-registry-v1-0 (HR5 bidirectional — amendment-log reads via HR-AP2 + propagation-state writes via HR-AP3) |
| Consumed by | registry (HR5 emit at HR-AP3), framework-audit (co-executes G-U5 per F-69) |
| Authority | L0 confirmed (Phase 9g delivery) |
| Genesis | generated-at-bootstrap per substrate §14 (grandfathered at first registry write) |
| scopeOut | `['runtime execution engine (post-9g)', 'self-amendment recursion formalization (post-9g)', 'concurrent multi-amendment coordination (post-beta)']` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | amendment-event queue, propagation-trace state, per-amendment completion status (§3 Structure + §5 Lifecycle) |
| Own I/O | input: `AmendmentEvent` (§2.1); output: `PropagationResult` (§2.2) |
| Own invariants | 64 axioms inherited from metaframework-v3-1 + propagation-completeness invariant (expressed via G-U2 execution at Stage 3 E1 + G-U5 co-execution at Stage 3 E2); no own-axiom declarations |
| Own discipline | 7-step P8 procedure (AP1–AP7) executing G-U2 + G-U5 across impacted frameworks per §3 + §4; L0 confirmation-gate at AP6 observation per substrate §13 |

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
  amendmentTrigger: 'vision' | 'gap' | 'L0-directive',
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
- `PropagationTrace` — shape declared inline below (previously deferred; R-0055 resolution).
- `ImpactedFrameworkSet` — §3.3 vocabulary table (intermediate output of AP2).

**PropagationTrace** (R-0055 resolution; typed shape per substrate §4.1 typed-shape requirement):
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

Referenced by §6.5 Provenance contract. Consumed by framework-audit (G-U5 co-execution via AP5-E2 slice per metaframework §4.3 F-69 table). `Stage` consumed by reference from substrate §8.3.

### §2.5 Schema rules (ScR-series)

Inherited from metaframework-v3-1 §2.5 by reference. No amendment-propagation-local ScR additions.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes

Amendment-propagation inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. Amendment-propagation does not redeclare.

Per v3-1-spec §4.4 file-specific placement, amendment-propagation's own structural content is the seven-step P8 procedure declared at §3.3 below.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | `{primitiveKind: P1, instanceCount: 0, basis: "axes inherited from metaframework-v3-1 §3.1; amendment-propagation declares no own axes"}` |
| P2 Sub-axis | 0 | `{primitiveKind: P2, instanceCount: 0, basis: "flat axis structure inherited from metaframework; no sub-axes declared at amendment-propagation level"}` |
| P3 Leaf | 0 | `{primitiveKind: P3, instanceCount: 0, basis: "leaves inherited via axes from metaframework"}` |
| P4 Axiom | 0 | `{primitiveKind: P4, instanceCount: 0, basis: "64 axioms inherited from metaframework-v3-1 §3.2; propagation-completeness invariant expressed via G-U2 execution path (Stage 3 AP4-E1), not as new axiom"}` |
| P5 Gate | 0 | `{primitiveKind: P5, instanceCount: 0, basis: "80 framework-tier gates inherited from metaframework-v3-1 §4.1 (per MetaframeworkGateIdSet atom §6.5); G-U2 (propagation completeness) and G-U5 (provenance completeness) executed by amendment-propagation per F-69 distribution but declared at metaframework per substrate §1.3 S-03 permitted-multi-execution; no own gates per L0 Q1 sprint-optimized ruling"}` |
| P6 Handoff rule | 3 | HR-AP1 (receive HR4 from metaframework), HR-AP2 (read amendment log from registry), HR-AP3 (emit propagation result to registry via HR5) — declared §6.2 |
| P7 Judgment input | 2 own | J-AP1-event-validation (consumed at AP1), J-AP6-propagation-verification (consumed at AP6) — declared §7 |
| P8 Procedure step | **7** | AP1–AP7, declared §3.3 |

Positive empty-declaration markers per substrate §8.6 for P1–P5 zero counts. Implicit-absence disallowed.

### §3.3 Seven-step procedure (AP1–AP7)

Distributed across substrate-v1-1 Stages 1–5 per PR5 stage-content-kind alignment. Every step declares the amended P8 shape per substrate §8.3: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}` where the kind-specific field is populated per PG6 amended (substrate §11.2).

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **AP1** | 1 | 1 | judgment-input | `AmendmentEvent` | classified-event (validated `AmendmentEvent` + intake annotations) | `judgmentInputRef = J-AP1-event-validation` (declared §7.1) |
| **AP2** | 2 | 2 | mechanical | classified-event | `ImpactedFrameworkSet` (FrameworkRef[] of frameworks requiring propagation) | `derivation = "query registry §6 provenance index for frameworks referencing sourceFrameworkRef; enumerate via registry §4.2 readByProvenance(metaframeworkRef=source, procedureRef=source); filter by changedElements.elementKind to narrow impact surface per amendment-type"` |
| **AP3** | 3 | 2 | mechanical | `ImpactedFrameworkSet` + classified-event | per-framework-propagation-plan (one entry per impacted framework with declared propagation-type) | `derivation = "for each impacted framework F in ImpactedFrameworkSet: determine propagation-type per changeType (added → additive-verify; amended → re-verify; removed → migration-required; deprecated → mark-deprecated); emit plan entry with F.frameworkRef + propagation-type + registry lookup refs"` |
| **AP4-E1** | 4 | 3 | gate-execution | per-framework-propagation-plan | G-U2 gate result per impacted framework + overall G-U2 pass/fail | `gates = [G-U2]` (propagation completeness, sole-executor per F-69) |
| **AP5-E2** | 5 | 3 | gate-execution | G-U2 gate results + plan | G-U5 gate result per impacted framework + overall G-U5 pass/fail | `gates = [G-U5]` (provenance completeness, co-executor with framework-audit per F-69) |
| **AP6** | 6 | 4 | judgment-input | G-U2 + G-U5 gate results + per-framework-propagation-plan | outcome-review (L0 confirmation-gate input per §5.3) | `judgmentInputRef = J-AP6-propagation-verification` (declared §7.2) |
| **AP7** | 7 | 5 | mechanical | outcome-review (post-L0-confirm) | `PropagationResult` emitted + HR-AP3 invoked with `(amendmentId, impactedFrameworks, perFrameworkStatus, overallResult, gateResults, timestamp)` payload | `derivation = "assemble PropagationResult per §2.2 output schema; populate perFrameworkStatus with propagationState + registryUpdateRef per framework; compute overallResult ∈ {complete, partial, blocked} from aggregate per-framework status; invoke HR-AP3 toward registry per metaframework-v3-1 §6.2 HR5 contract; registry write is separate atomic operation per substrate §13.4 with IG1–IG5 discipline per framework-registry-v1-0 §8"` |

**E1–E2 shorthand.** AP4 and AP5 are the two Stage-3 gate-execution P8 instances referenced as E1 and E2 respectively. E1 = G-U2 (propagation completeness, amendment-propagation sole executor). E2 = G-U5 (provenance completeness, co-executor with framework-audit). Per v3-1-spec §3.4 F-69 distribution. Per 9e E-step precedent: gate-reference-by-ID at declaration tier; per-gate mechanical test body lives where the gate is declared (metaframework §4.3 F-69 table for G-U2, G-U5) and execution engine is post-9g concern per L0 Q5 ruling.

**Per-row notes:**

- **AP1.** Consumes `AmendmentEvent` per §2.1 input schema. J-AP1-event-validation (declared §7.1) validates sourceFrameworkRef resolution, Semver validity, amendmentTrigger enum, AuthorityClaim well-formedness (C1–C4 mechanical), plus coherence of changedElements (C5 judgment).

- **AP2.** Queries registry provenance index per HR-AP2 read path. Per framework-registry-v1-0 §6 Provenance Index + §4.1 readByProvenance, the registry exposes per-metaframework + per-procedure grouping of RegistryEntry records. AP2's derivation enumerates frameworks that depend on or reference sourceFrameworkRef, filtering by changedElements.elementKind.

- **AP3.** Per-framework planning. Each impacted framework receives a propagation-type based on AmendmentChange.changeType enum. This is a pure mechanical step (no judgment required at plan-level); runtime classification.

- **AP4-E1, AP5-E2.** Stage-3 gate-execution per substrate §8.3 ternary kind + PG6 amended. Per L0 Q5 ruling: declaration is gate-reference-by-ID; execution occurs via MULTI-EXEC per substrate §1.3 S-03. Co-execution with framework-audit for G-U5 follows F-69 "AND" semantics — both execute independently on their respective paths when applicable (logged as audit note #4 for post-9g clarification).

- **AP6.** Judgment observation step. J-AP6-propagation-verification (declared §7.2) checks gate-result pass state + per-framework status coherence + fitness for registry emission. L0 confirmation decision is enabled by the observation result; L0 confirmation itself is a substrate §13.6 event, not a P8 output field.

- **AP7.** Terminal P8 — emit + HR-AP3 invocation per 9e precedent. `PropagationResult` emission and registry write are two separate atomic operations per substrate §13.4. AP7 output completes when HR-AP3 invocation returns; registry commit enforced by IG1–IG5 separately.

### §3.4 Stage monotonicity and kind-alignment self-check

Per substrate §10.2 PR4 (stage monotonicity) and PR5 (stage-content-kind alignment), applied to the seven-step procedure:

**PR4 — stage monotonicity across order.**

| order | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| stage | 1 | 2 | 2 | 3 | 3 | 4 | 5 |

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
| AP7 | 5 | mechanical | mechanical | ✓ |

All seven aligned. PR5 passes.

**PG6 amended (substrate §11.2) — kind-specific field requirement:**

- AP1, AP6 (kind=judgment-input) → `judgmentInputRef` declared. ✓
- AP2, AP3, AP7 (kind=mechanical) → `derivation` declared. ✓
- AP4-E1, AP5-E2 (kind=gate-execution) → `gates` populated with tested axiom/invariant refs. ✓

All seven satisfy PG6 amended.

Self-check applied at declaration time; independent re-verification at framework-audit X10 extended predicate post-9g terminal cross-file gate.

### §3.5 Vocabulary (amendment-propagation-local)

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

Amendment-propagation declares **zero own gates** per L0 Q1 ruling (sprint-optimized default). Gate coverage:

- **Inherited framework-tier gates:** 80 from metaframework-v3-1 §4.1 per `MetaframeworkGateIdSet` atom (applied to amendment-propagation itself when audited by framework-audit).
- **Gates executed by amendment-propagation (not owned):** G-U2 (propagation completeness, sole executor per F-69) at AP4-E1; G-U5 (provenance completeness, co-executor with framework-audit per F-69) at AP5-E2. Declarations at metaframework §4.3; execution occurs here per substrate §1.3 S-03 permitted-multi-execution.

Positive empty-declaration per §3.2 row P5. Basis: "80 framework-tier gates inherited from metaframework-v3-1 §4.1 per `MetaframeworkGateIdSet` atom; G-U2 and G-U5 executed by amendment-propagation per F-69 distribution but declared at metaframework per substrate §1.3 S-03 permitted-multi-execution; no own gates per L0 Q1 sprint-optimized ruling (amendment-propagation's own integrity surface covered by G-U1 self-application + G-M1/M2 axiom-gate mapping + inherited framework-tier gates)."

### §4.2 Gate execution boundary

Per 9e Q2 + 9f Q5 precedent + L0 Q5 ruling at Phase 9g:

- **Declaration tier.** AP4-E1 and AP5-E2 declare `gates: [G-U2]` and `gates: [G-U5]` respectively per substrate §8.3 amended P8 + PG6 amended (ternary `kind = 'gate-execution'`).
- **Execution tier.** Per substrate §1.3 S-03 permitted-multi-execution: gate *specification* declared once (at metaframework §4.3); gate *execution* occurs at the framework that claims executor role per F-69 distribution. Amendment-propagation is sole executor of G-U2 and co-executor of G-U5. Mechanical test body for each gate is inherited-by-reference; runtime execution engine is post-9g concern.

No cross-framework ownership violation. Declaration ≠ execution per MULTI-EXEC.

### §4.3 Inherited framework-tier gates

Enumerated per metaframework-v3-1 §4.7 (80 framework-tier applicable, per `MetaframeworkGateIdSet`):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I5, G-S1..G-S3, G-St1..G-St5, G-V1..G-V5, G-L1..G-L7, G-C1..G-C6, G-J1..G-J4, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode + metaframework §4.7 pattern.

### §4.4 Gate execution coverage

- **G-U2 (propagation completeness):** executed at AP4-E1 per per-framework-propagation-plan. Sole executor per metaframework §4.3 F-69 table.
- **G-U5 (provenance completeness):** executed at AP5-E2 per G-U2 results + plan. Co-executor with framework-audit per metaframework §4.3 F-69 "AND" semantics — both frameworks execute independently on their respective paths when applicable (framework-audit on per-framework audit path via HR-FA1; amendment-propagation on per-amendment propagation path via HR-AP1). See audit note #4.

### §4.5 Meta-gate compliance

When audited (by self-application or by another instance), amendment-propagation is subject to metaframework's meta-gates G-M1–G-M4 (axiom-gate 1:1 mapping, gate-set exhaustive, execution order, escalation path declared). Per §3.2 row P4: amendment-propagation declares zero own axioms, so G-M1/G-M2 reduce to inherited-axiom mapping coverage. G-M3/G-M4 apply to the P8 gate-execution steps AP4-E1 and AP5-E2 (each references metaframework-declared G-U2/G-U5 whose escalation paths are declared at metaframework §4.2 per G-M4 requirement).

### §4.6 Backward-invalidation

Per metaframework-v3-1 §4.5: G-M failure → universal gates re-run; substrate-tier failure terminal. Applies to amendment-propagation's propagation results when amendment-propagation itself fails self-audit post-9g terminal cross-file gate.

### §4.7 Current gate results

**All 80 inherited framework-tier gates: state = `not-yet-run`.** (52 from v3.2.1 inherited, 28 added at v3.2.3 cycle.) First-run pending post-9g terminal cross-file gate (when L0 confirms first system-wide audit cycle per Phase 9g spec §7 step 6); 28 v3.2.3-added gates first-run deferred to next audit cycle.

**G-U2 and G-U5 execution state at delivery: `not-yet-invoked`** (no AmendmentEvent processed yet; first run occurs when first AmendmentEvent arrives via HR-AP1 post-9g).

Compact summary per sprint-mode.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 → v1.1 → v1.2 → v1.2.1. Additive per MA-L1. v1.1 (Phase 1.2-fix delivery) amendments: §2.4 PropagationTrace inline shape declared (per R-0055); §3.2 + §4.1 + §4.3 + §4.7 + §8 gate count 45→52 (per R-0020 KA-Build-2 cascade). v1.2 (v3.2.3 cascade): §1 + §3.2 + §4.1 + §4.3 + §4.7 + §8 axiom count restatements 36→64 and gate count restatements 52→80 per MA-S5 cross-file restatement consistency (the very axiom added this cycle); inherited gate ID enumeration extended for 28 v3.2.3 axiom-gates. Per MA-L1 additive — no procedural change. **v1.2.1 (MF-patch-1 cascade): §5.10 v1.1 row added per F-MFA-F9-008 closure (v1.1 was substantive AP edit-target cycle per §5.1, MA-S5 requires the row). §5.10 v1.2.1 row added. No P8 step changes; no count changes (axiom 64, gate 80 unchanged); no inherited-gate-enumeration change. Per MA-L1 additive — no procedural change. v1.2 content otherwise preserved verbatim.**

**Meta-note:** amendment-propagation is the framework that handles amendments to other frameworks. Its own amendments loop through itself per bootstrap-recursion handling — see §5.7 below.

### §5.2 Amendment trigger

Gap-driven per MA-L4 OR L0-directive. Amendment paths to amendment-propagation:
- New failure mode for propagation procedure → MA-L4 amendment + version bump.
- Addition of new gate to F-69 distribution requiring amendment-propagation execution → MA-L4 amendment + AP4/AP5 step extension.
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
- **AP1** `amendmentTrigger` out-of-enum → reject at J-AP1 C3; blocked PropagationResult.
- **AP1** `authorityClaim` malformed → reject at J-AP1 C4; escalate to L0 per substrate §5.
- **AP2** registry provenance-index read failure (HR-AP2 path) → suspend per substrate §13.6; retry on registry availability; no PropagationResult emitted until read succeeds.
- **AP4-E1** G-U2 fail on framework F → populate `PerFrameworkStatus.propagationState = 'blocked'` with `escalation: EscalationState{status: 'blocked', gap: 'G-U2 propagation incomplete for framework F', requiredMode: 'verificative'}`; continue to AP5 for remaining frameworks; aggregate `overallResult` to 'partial' or 'blocked' at AP7 per remaining-framework status.
- **AP5-E2** G-U5 fail on framework F → same pattern as AP4-E1 with `gap: 'G-U5 provenance incomplete for framework F'` and `requiredMode: 'verificative'`.
- **AP6** L0 withholds confirmation OR L0 unavailable → suspend per substrate §13.6 L0-unavailability response; state persists in registry; resume idempotently on L0 return.
- **AP7** HR-AP3 invocation rejected by registry (IG1 AuthorityClaim missing, IG3 uniqueness violation, IG4 provenance missing, IG5 lifecycle state out-of-enum) → PropagationResult not persisted; escalate to L0; amendment-propagation activation rolls back per substrate §13.4 "atomic with recovery point: pre-emission state in owned framework."
- **Registry-lock contention** per substrate §13.5 → wait-policy per activationTrigger.concurrencyPolicy ('wait' or 'reject').

### §5.7 Self-amendment bootstrap handling

When amendment-propagation amends itself (meta-recursion), the amendment event is processed by a **fresh invocation using the pre-amendment version**. Post-amendment state replaces pre-amendment state atomically per registry discipline (IG1–IG5 + W4 atomicity). Bootstrap non-re-entrancy per MA-L7 + substrate §14.5 governs the first-version case (no amendment-propagation exists pre-bootstrap to self-amend; first version is L0 hand-authored at bootstrap event per substrate §14).

Sprint-mode declaration depth per L0 Q3 ruling. Formalization of self-amendment procedure deferred to post-9g terminal cross-file gate.

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
| v1.0 | Phase 9g delivery | Initial amendment-propagation-v1-0 artifact. Seven P8 steps (AP1–AP7) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. AP4-E1 executes G-U2 (propagation completeness, sole executor per F-69). AP5-E2 executes G-U5 (provenance completeness, co-executor with framework-audit per F-69). HR-AP1 receive + HR-AP2 registry-read + HR-AP3 emit declared with captureShapes. J-AP1-event-validation + J-AP6-propagation-verification declared. Zero own gates per sprint-optimized default. Closes 6-file system. | L0 |
| v1.1 | Phase 1.2-fix delivery | §2.4 PropagationTrace inline shape declared per R-0055 (was a referenced atom; now inlined for single-source per A-08). §3.2 + §4.1 + §4.3 + §4.7 + §8 inherited framework-tier gate count restatements 45→52 per R-0020 KA-Build-2 cascade. Per MA-L1 additive — no procedural change. (Row added at MF-patch-1 per F-MFA-F9-008 closure: §5.10 was missing this row at v1.2 despite §5.1 declaring v1.1 as substantive AP edit-target cycle; MA-S5 cross-file restatement consistency required the row.) | L0 |
| v1.2 | Phase v3.2.3 delivery (2026-04-27) | §1 + §3.2 + §4.1 + §4.3 + §4.7 + §8 axiom-count restatements 36→64; gate-count restatements 52→80; inherited gate ID enumeration extended for v3.2.3 axiom-gates. Per MA-S5 cross-file restatement consistency. v1.1 content otherwise preserved verbatim. | L0 |
| v1.2.1 | MF-patch-1 delivery (2026-04-28) | Restatement only. §1 header version + §1 Identity Version row v1.2 → v1.2.1. §5.1 transition log extended with v1.2.1 entry. §5.10 v1.1 row added per F-MFA-F9-008 closure (closes MA-S5 missing-row finding). §5.10 v1.2.1 row added (this row). §9 changelog row added. No P8 step changes; no count changes (axiom 64, gate 80 unchanged); no inherited-gate-enumeration change. Per MA-L1 additive. v1.2 content otherwise preserved verbatim. | L0 |
| v1.2.2 | MF-amendment-1 delivery (2026-04-28) | Cascade pointer update. §8.2 Dimension IDs enumerated reference framework-audit-v1-2 → framework-audit-v1-4 (version-ref bump) and §3.3 → §3.4 (post-Shot-2 framework-audit dimension-declarations renumber). §1 header version + §1 Identity Version row v1.2.1 → v1.2.2. §5.10 v1.2.2 row added (this row). §9 changelog row added. No P8 step changes; no count changes (axiom 64, gate 80, P8 own count 7 unchanged); no inherited-gate-enumeration change. Per MA-L1 additive. **Note:** §8.4 self-application basis line `§3.4 stage/kind self-check` self-references AP's own §3.4 (stage-monotonicity-and-kind-alignment self-check section); not framework-audit's §3.4. Preserved untouched per D1 disposition (logged as F-MFA1-AP-001 for next-cycle hygiene: spec §4.5 row line 630 misidentified the reference). v1.2.1 content otherwise preserved verbatim. | L0 |

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

Per MA-C5 + A-20 reference-default. Every emitted `PropagationResult` at AP7 traces to:

- declared `AmendmentEvent` (the triggering amendment, referenced by amendmentId),
- per-step P8 outputs (classified-event from AP1, ImpactedFrameworkSet from AP2, per-framework-propagation-plan from AP3, G-U2 results from AP4-E1, G-U5 results from AP5-E2, outcome-review from AP6),
- per-framework registry update refs (populated in `PerFrameworkStatus.registryUpdateRef`).

`PropagationTrace` captures the per-step provenance chain per run (schema deferred per audit note #2). Reference-default per A-20: provenance fields store FrameworkRefs and registry-archived references where possible; by-value retention is opt-in.

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
    C3: amendmentTrigger ∈ {'vision', 'gap', 'L0-directive'}
        (mechanical — enum membership check).
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

Per metaframework-v3-1 §8 pattern (compact sprint-mode placeholder per L0 Q4 sprint-mode directive).

### §8.1 Gate results

No amendment-propagation-declared gates (per §4.1 zero own gates). Framework-tier gates inherited from metaframework-v3-1 §4.1 (80 applicable, per `MetaframeworkGateIdSet`). State = `not-yet-run` for framework-audit first-run against amendment-propagation, post-9g terminal cross-file gate.

Inherited gate ID enumeration matches metaframework §4.7 (80 framework-tier):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S6, G-St1..G-St16, G-V1..G-V9, G-L1..G-L10, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §8.2 Dimension audit results

All 10 framework-audit dimensions (X1–X10) against amendment-propagation: state = `pending-first-run`. Uniform state; compact summary per sprint-mode.

Dimension IDs enumerated: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-4 §3.4.

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
| v1.0 | Phase 9g delivery | Initial amendment-propagation-v1-0 artifact. Seven P8 steps (AP1–AP7) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. AP4-E1 executes G-U2 (propagation completeness, sole executor per metaframework §4.3 F-69). AP5-E2 executes G-U5 (provenance completeness, co-executor with framework-audit per F-69). HR-AP1 receive-side (mirrors metaframework §6.2 HR4) + HR-AP2 registry-read (diagnosticSignificance=false) + HR-AP3 emit (mirrors metaframework §6.2 HR5 receive) declared with captureShapes. J-AP1-event-validation (consumed at AP1) + J-AP6-propagation-verification (consumed at AP6) declared with mixed mechanical + judgment criteria per MA-J2. Zero own gates per L0 Q1 sprint-optimized ruling. PropagationResult emission and registry write are two separate atomic operations per substrate §13.4 + registry IG1–IG5. Self-amendment bootstrap handling declared at high-level depth per L0 Q3 ruling; formalization deferred to post-9g terminal cross-file gate. Closes 6-file system. | L0 |
| v1.1 | Phase 1.2-fix delivery | §2.4 PropagationTrace inline shape + StepRecord shape declared (per R-0055); §3.2 + §4.1 + §4.3 + §4.7 + §8 gate count restatements updated 45→52 with `MetaframeworkGateIdSet` atom reference (per R-0020 KA-Build-2 cascade). §1 Identity: scopeOut row added per R-0042. v1.0 content otherwise preserved verbatim. | L0 |
| v1.2 | Phase v3.2.3 delivery (2026-04-27) | §1 Own-invariants + §3.2 P4/P5 + §4.1 basis + §4.3 + §4.7 + §8 count restatements: axiom 36→64, framework-tier gate 52→80; inherited gate ID enumeration extended for 28 v3.2.3 axiom-gates. Per MA-S5 cross-file restatement consistency (the new axiom added this cycle). v1.1 content otherwise preserved verbatim. | L0 |
| v1.2.1 | MF-patch-1 delivery (2026-04-28) | Restatement only. §1 header version + §1 Identity Version row v1.2 → v1.2.1. §5.1 transition log extended. §5.10 v1.1 row added per F-MFA-F9-008 closure (v1.1 was substantive AP edit-target cycle per §5.1 + §9; MA-S5 required the §5.10 row). §5.10 v1.2.1 row added. §9 v1.2.1 row added (this row). No P8 step changes; no count changes (axiom 64, gate 80 unchanged); no inherited-gate-enumeration change. Per MA-L1 additive. v1.2 content otherwise preserved verbatim. Closes MF-audit-1 finding F-MFA-F9-008. | L0 |
| v1.2.2 | MF-amendment-1 delivery (2026-04-28) | Cascade pointer update. §8.2 Dimension IDs reference framework-audit-v1-2 → framework-audit-v1-4 (version-ref bump) and §3.3 → §3.4 (framework-audit dimension-declarations renumbered post-Shot-2). §1 header version + §1 Identity Version row v1.2.1 → v1.2.2. §5.10 + §9 v1.2.2 rows added. No P8 step changes; no count changes (axiom 64, gate 80, AP own P8 count 7 unchanged); no inherited-gate-enumeration change. Per MA-L1 additive. AP own §3.4 self-references (line 630 §8.4 self-application basis) preserved untouched per D1 disposition (spec §4.5 row line 630 misidentified the reference target as framework-audit's §3.4 when it actually self-references AP's §3.4 stage/kind self-check; logged as F-MFA1-AP-001 for next-cycle hygiene). v1.2.1 content otherwise preserved verbatim. | L0 |

---

## End of amendment-propagation-v1-0
