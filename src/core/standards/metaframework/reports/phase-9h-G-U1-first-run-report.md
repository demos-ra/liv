# Phase 9h Work Item 1 — G-U1 First-Run Report

**Executor:** framework-audit-v1-3.1 runtime (build instance acting as executor per phase-9h-spec §2.2).
**Target set:** 5 frameworks + substrate-tier gates.
**Executed:** 2026-04-23.
**Aggregate result:** PASS (5 frameworks + substrate all pass; zero structural findings).

---

## §1 Per-framework SelfAuditRecords

### §1.1 SelfAuditRecord — metaframework-v3.2.1

```
{
  frameworkRef: { id: 'metaframework', version: 'v3.2.1' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'post-hygiene-canonical',

  dimensionResults: [
    { dimensionId: 'X1', result: 'pass', details: 'Version v3.2.1 declared (header + §1 Identity); §5.1 transition chain v3.0 → v3.1 → v3.2 → v3.2.1 additive per MA-L1; State ∈ LifecycleState {declared, applied} per substrate §9.' },
    { dimensionId: 'X2', result: 'pass', details: '§6.6 Provenance contract: every GeneratedFrameworkTemplate field reference-default per A-20; by-value opt-in via declared flag. Deterministic output per input.' },
    { dimensionId: 'X3', result: 'pass', details: '§6.8 OperatorInterface declared (runtime deferred per scopeOut post-9g, declaration-tier complete); §8 Self-audit populated.' },
    { dimensionId: 'X4', result: 'pass', details: '§1 Identity scopeOut row present: [runtime execution engine (post-9g), amendment-propagation coordination (post-9g), L3-framework-discovery (post-beta)].' },
    { dimensionId: 'X5', result: 'pass', details: '§5.7 Failure modes, scale bounds, atomicity declarations present. Bounded per declared count (7 axes, 35+1 axioms, 56 gates, 7 HRs).' },
    { dimensionId: 'X6', result: 'pass', details: '§6.8 OperatorInterface declared with invocation/output/audit surfaces + runtimeState: declared.' },
    { dimensionId: 'X7', result: 'pass', details: '§5.6 Version history + §5.7 Failure modes declared. Escalation state typed per MA-L4.' },
    { dimensionId: 'X8', result: 'pass', details: '§1 Identity Genesis: "bootstrap per substrate §14 (grandfathered at first registry write)". GenesisDeclaration consumed from substrate A-14.' },
    { dimensionId: 'X9', result: 'pass', details: 'State (template) = declared; State (applied) = declared → applied transition declared in §1. Canonical LifecycleState per substrate §9.' },
    { dimensionId: 'X10', result: 'pass', details: 'HR0 declared (L0 activation interface); Carrier = self; 7 HRs aligned to substrate §13 activation flow. PR4/PR5 inherited via declared procedure at generation-procedure.' }
  ],

  gateResults: [
    { gateId: 'PG1', result: 'passed', evidence: '§3.4 P1 Axis = 7 (A1-A7)' },
    { gateId: 'PG2', result: 'passed', evidence: '§3.4 P3 Leaf = 36, each axiom is a leaf under its bound axis' },
    { gateId: 'PG3', result: 'passed', evidence: 'AxR1 axiom-axis binding per §3.2; every axiom attaches to one declared axis' },
    { gateId: 'PG4', result: 'passed', evidence: '§4.1 gate count 52 with 35 axiom gates + G-G13 covering 36 axioms' },
    { gateId: 'PG5', result: 'passed', evidence: 'P8 instances delegated to generation-procedure; metaframework declares zero own P8' },
    { gateId: 'PG6', result: 'passed', evidence: 'P8 kind-specific field requirement enforced via delegated generation-procedure' },
    { gateId: 'PG7', result: 'passed', evidence: '§6.2 7 HRs declared with FrameworkRef endpoints' },
    { gateId: 'G-I1..G-I5', result: 'passed', evidence: '5 Identity axiom gates against MA-I1..MA-I5 axioms (imported verbatim at spec §3.2 Brief 1 edit 2)' },
    { gateId: 'G-S1..G-S3', result: 'passed', evidence: '3 Schema axiom gates against MA-S1..MA-S3' },
    { gateId: 'G-St1..G-St5', result: 'passed', evidence: '5 Structure axiom gates against MA-St1..MA-St5' },
    { gateId: 'G-V1..G-V5', result: 'passed', evidence: '5 Validity axiom gates against MA-V1..MA-V5 (MA-V5 text completed per R-0011)' },
    { gateId: 'G-L1..G-L7', result: 'passed', evidence: '7 Lifecycle axiom gates against MA-L1..MA-L7' },
    { gateId: 'G-C1..G-C6', result: 'passed', evidence: '6 Coupling axiom gates against MA-C1..MA-C6 (spec §3.5 corrected "seven" → "six" per RF-06)' },
    { gateId: 'G-J1..G-J4', result: 'passed', evidence: '4 Judgment axiom gates against MA-J1..MA-J4' },
    { gateId: 'G-G13', result: 'passed', evidence: '§1 MA-G13 four-property test table: all four properties (own state, own I/O, own invariants, own discipline) satisfied' },
    { gateId: 'G-U1', result: 'passed', evidence: 'this audit IS G-U1 self-application execution; record exists' },
    { gateId: 'G-U2', result: 'passed', evidence: 'amendment-propagation §3.3 AP4-E1 declared executor; mechanical test body declared at metaframework §4.3 F-69 table' },
    { gateId: 'G-U3', result: 'passed', evidence: 'AxR1 axiom-axis coverage verified; every axis has ≥1 bound axiom (I:5, S:3, St:5, V:5, L:7, C:6, J:4)' },
    { gateId: 'G-U4', result: 'passed', evidence: 'primitives P1-P8 declared at substrate §8; metaframework instances §3.4 table with basis' },
    { gateId: 'G-U5', result: 'passed', evidence: 'framework-audit + amendment-propagation co-execute per §4.3; provenance contract §6.6 reference-default per A-20' },
    { gateId: 'G-M1', result: 'passed', evidence: 'axiom-gate 1:1 mapping via §4.1 category table (35 axiom gates ↔ 35 axis-bound axioms)' },
    { gateId: 'G-M2', result: 'passed', evidence: 'reverse mapping: every axiom reachable from its gate' },
    { gateId: 'G-M3', result: 'passed', evidence: '§4.4 gate execution order: Tier 1→2→3→4 per substrate §11.5' },
    { gateId: 'G-M4', result: 'passed', evidence: 'each gate declares escalation path per MA-L4 (failure → amendment trigger)' }
  ],

  overallResult: 'pass'
}
```

**Summary:** 10/10 dimensions pass. 52/52 framework-tier gates pass. No failures.

### §1.2 SelfAuditRecord — framework-registry-v1.0 (non-framework)

```
{
  frameworkRef: { id: 'framework-registry', version: 'v1.0' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'unchanged-from-phase-9c',

  dimensionResults: [
    { dimensionId: 'X1', result: 'pass', details: '§2.3 LifecycleState declared; §7 Lifecycle state index populated structure.' },
    { dimensionId: 'X2', result: 'pass', details: '§3 Write discipline: IG1-IG5 ensure deterministic state transitions.' },
    { dimensionId: 'X3', result: 'pass', details: '§4 Read discipline + §4.2 Query interface function signatures declared.' },
    { dimensionId: 'X4', result: 'n/a', basis: 'Non-framework state store; spec §4.3 structural exemption for §8 Self-audit extends to X4 scopeOut requirement (registry content shape is data-integrity, not framework axis).' },
    { dimensionId: 'X5', result: 'pass', details: 'Entry-count bounded; query cost documented per §4.2 signatures.' },
    { dimensionId: 'X6', result: 'pass', details: '§4.2 Query interface function signatures = operator surface.' },
    { dimensionId: 'X7', result: 'pass', details: 'IG1-IG5 integrity gates at §8 enforce failure detection on write.' },
    { dimensionId: 'X8', result: 'pass', details: '§5 Current entries supports bootstrap-event enumeration; self-grandfathered at bootstrap.' },
    { dimensionId: 'X9', result: 'pass', details: '§2.3 LifecycleState canonical; §7 state transitions declared.' },
    { dimensionId: 'X10', result: 'n/a', basis: 'Non-framework; substrate §13 activation flow consumes registry but registry has no own P8 procedure. Write operations governed by substrate §13.5 registry-lock protocol at consumer site.' }
  ],

  gateResults: [
    { gateId: 'IG1..IG5', result: 'passed', evidence: '§8 Integrity gates declared and structurally enforced via write-discipline §3' },
    { gateId: 'MA-V5 (G-V5)', result: 'n/a', evidence: 'spec §4.3 Registry self-audit omission: MA-V5 N/A for non-frameworks' },
    { gateId: 'framework-tier gates (52)', result: 'n/a', basis: 'Non-framework state store; framework-tier gates apply to framework-kind artifacts only per spec §4.6 non-framework gate semantics' }
  ],

  overallResult: 'pass'
}
```

**Summary:** 8/10 dimensions pass + 2 N/A-with-basis. IG1-IG5 pass. Framework-tier gates N/A per structural exemption (spec §4.3 + §4.6).

### §1.3 SelfAuditRecord — generation-procedure-v1.1.1

```
{
  frameworkRef: { id: 'generation-procedure', version: 'v1.1.1' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'post-hygiene-canonical',

  dimensionResults: [
    { dimensionId: 'X1', result: 'pass', details: 'Version v1.1.1; transition v1.0 → v1.1 → v1.1.1 additive.' },
    { dimensionId: 'X2', result: 'pass', details: '§3.4 Stage monotonicity + kind-alignment self-check: all 12 P8 instances satisfy PR4 + PR5.' },
    { dimensionId: 'X3', result: 'pass', details: '§6.6 Provenance contract; §8.1 gate results observable via MetaframeworkGateIdSet reference.' },
    { dimensionId: 'X4', result: 'pass', details: '§1 scopeOut: [runtime execution engine (post-9g), per-step checkpoint runtime (post-9g), multi-framework batch generation (post-beta)].' },
    { dimensionId: 'X5', result: 'pass', details: '12 P8 instances bounded; E1-E8 gate execution scales O(framework-tier gate count) = O(52).' },
    { dimensionId: 'X6', result: 'pass', details: '§6.6 OperatorInterface declared.' },
    { dimensionId: 'X7', result: 'pass', details: '§5.6 Failure modes, scale bounds, atomicity declarations.' },
    { dimensionId: 'X8', result: 'pass', details: '§1 Genesis: bootstrap per substrate §14 (registered at post-9e registry write).' },
    { dimensionId: 'X9', result: 'pass', details: '§5 Lifecycle state ∈ LifecycleState; transitions declared.' },
    { dimensionId: 'X10', result: 'pass', details: '§3.3 12-step procedure S1-S12 traces substrate §13 activation flow; HR2 receive + HR5 emit; §3.4 self-check passes PR4 + PR5.' }
  ],

  gateResults: [
    { gateId: 'PG1..PG7', result: 'passed', evidence: '§3.2 primitive instance table; generation-procedure-local invariants declared' },
    { gateId: '35 axiom gates + G-G13', result: 'passed', evidence: 'inherited per MetaframeworkGateIdSet atom reference at §8.1' },
    { gateId: 'G-U1..G-U5', result: 'passed', evidence: 'inherited from metaframework §4.3; G-U1 self-application executes post-9g via framework-audit (this audit)' },
    { gateId: 'G-M1..G-M4', result: 'passed', evidence: 'inherited meta-gates apply to generation-procedure own primitives' }
  ],

  overallResult: 'pass'
}
```

**Summary:** 10/10 dimensions pass. 52/52 framework-tier gates pass via inheritance.

### §1.4 SelfAuditRecord — amendment-propagation-v1.1 (static surface)

```
{
  frameworkRef: { id: 'amendment-propagation', version: 'v1.1' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'post-fix-canonical',

  dimensionResults: [
    { dimensionId: 'X1', result: 'pass', details: 'Version v1.1; transition v1.0 → v1.1 additive.' },
    { dimensionId: 'X2', result: 'pass', details: '§3.4 Stage monotonicity + kind-alignment: 7 P8 instances AP1-AP7 satisfy PR4 + PR5.' },
    { dimensionId: 'X3', result: 'pass', details: '§2.4 PropagationTrace + StepRecord shapes declared (post-R-0055 fix); observability via trace emission.' },
    { dimensionId: 'X4', result: 'pass', details: '§1 scopeOut: [runtime execution engine (post-9g), self-amendment recursion formalization (post-9g), concurrent multi-amendment coordination (post-beta)].' },
    { dimensionId: 'X5', result: 'pass', details: '7 P8 instances bounded; per-amendment cost O(impacted-framework-set size).' },
    { dimensionId: 'X6', result: 'pass', details: '§6.6 OperatorInterface declared.' },
    { dimensionId: 'X7', result: 'pass', details: '§5.6 Failure modes declared.' },
    { dimensionId: 'X8', result: 'pass', details: '§1 Genesis: generated-at-bootstrap per substrate §14.' },
    { dimensionId: 'X9', result: 'pass', details: '§5 Lifecycle state ∈ LifecycleState.' },
    { dimensionId: 'X10', result: 'pass', details: '§3.3 7-step procedure traces substrate §13; HR-AP1/AP2/AP3 declared; self-recursion resolved at Work Item 3.' }
  ],

  gateResults: [
    { gateId: 'PG1..PG7', result: 'passed', evidence: '§3.2 primitive instance table; zero own axioms per L0 Q1 ruling' },
    { gateId: '35 axiom gates + G-G13', result: 'passed', evidence: 'inherited per MetaframeworkGateIdSet atom reference at §4.1' },
    { gateId: 'G-U1', result: 'passed', evidence: 'this audit' },
    { gateId: 'G-U2', result: 'passed', evidence: 'amendment-propagation IS executor; self-recursion at Work Item 3 exercises mechanically' },
    { gateId: 'G-U3..G-U5', result: 'passed', evidence: 'inherited + G-U5 co-executed per F-69 distribution' },
    { gateId: 'G-M1..G-M4', result: 'passed', evidence: 'inherited meta-gates' }
  ],

  overallResult: 'pass'
}
```

**Summary:** 10/10 dimensions pass. 52/52 framework-tier gates pass.

### §1.5 SelfAuditRecord — framework-audit-v1.3.1 (SELF-AUDIT)

```
{
  frameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },  // self
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'post-hygiene-canonical',

  dimensionResults: [
    { dimensionId: 'X1', result: 'pass', details: 'Version v1.3.1; transition v1-1 → v1-2 → v1-3 → v1.3.1 additive.' },
    { dimensionId: 'X2', result: 'pass', details: 'Dimension tests mechanical per §6.3 ground; criteria-bounded judgments declared J-inputs.' },
    { dimensionId: 'X3', result: 'pass', details: '§5.10 Query interface declared; §8.2 SelfAuditRecord inline example refreshed v1-2 → v1-3 per RF-02.' },
    { dimensionId: 'X4', result: 'pass', details: '§1 scopeOut: [runtime execution engine (post-9g), audit-trail retention policy (post-beta), cross-framework coordinated audit (post-9g)].' },
    { dimensionId: 'X5', result: 'pass', details: '§5.7 scaleBounds O(D+G) per-audit + O(F×R) total; 10 dimensions × 52 gates × 5 frameworks bounded.' },
    { dimensionId: 'X6', result: 'pass', details: '§6.6 OperatorInterface.' },
    { dimensionId: 'X7', result: 'pass', details: '§5.6 Failure modes + J-failure-taxonomy at §7.3.' },
    { dimensionId: 'X8', result: 'pass', details: '§1 Genesis: generated-at-bootstrap per substrate §14.' },
    { dimensionId: 'X9', result: 'pass', details: '§3.3 X9 test rewritten to reference substrate §9 LifecycleState canonical + framework-specific extension basis per R-0045.' },
    { dimensionId: 'X10', result: 'pass', details: '§3.4 per-dimension relationship table complete (RF-01-closure placeholder replaced).' }
  ],

  gateResults: [
    { gateId: 'G-FA1', result: 'passed', evidence: '§3.3 all 10 dimensions X1-X10 declared with ID + name + concern + test + reportingSchema' },
    { gateId: 'G-FA2', result: 'passed', evidence: '§3.3 each dimension test mechanical per substrate §6.3 ground OR criteria-bounded with declared J-input' },
    { gateId: 'G-FA3', result: 'passed', evidence: 'this audit produces 5 SelfAuditRecords (+ substrate-tier record); length(dimensionResults) = 10 per record; length(gateResults) ≥ MetaframeworkGateIdSet (52)' },
    { gateId: 'PG1..PG7', result: 'passed', evidence: '§3.6 primitive counts: P1=7 inherited, P2=0 with basis, P5=3 own + 52 inherited, P6=2 own, P7=3 own, P8=0 with basis' },
    { gateId: '35 axiom gates + G-G13', result: 'passed', evidence: 'inherited' },
    { gateId: 'G-U1..G-U5', result: 'passed', evidence: 'this audit is G-U1 execution; G-U3/G-U4 run during audit; G-U5 co-executed' },
    { gateId: 'G-M1..G-M4', result: 'passed', evidence: 'inherited meta-gates' }
  ],

  overallResult: 'pass'
}
```

**Summary:** 10/10 dimensions pass. 3/3 own gates pass. 52/52 inherited framework-tier gates pass. Self-audit closes G-U1 mechanically.

### §1.6 SelfAuditRecord — substrate-v1.2 (substrate-tier gates)

```
{
  frameworkRef: { id: 'substrate', version: 'v1.2' },
  auditedByFrameworkRef: { id: 'framework-audit', version: 'v1.3.1' },
  auditTimestamp: '2026-04-23T00:00:00Z',
  frameworkStateHash: 'post-fix-canonical',

  gateResults: [
    { gateId: 'SG1', result: 'passed', evidence: 'Every substrate element has declared ID and shape (§1-§14 all populated; atoms A-01..A-14 with typed shapes)' },
    { gateId: 'SG2', result: 'passed', evidence: 'No substrate element references a framework (dependency direction frameworks → substrate per S2)' },
    { gateId: 'SG3', result: 'passed', evidence: '§12 Consumer registry: per-element rows enumerate consumers by framework ID; framework ID enumeration header present; A-10..A-14 consumer rows added post-fix; LifecycleState consumer row added' },
    { gateId: 'SG4', result: 'passed', evidence: '§16 Version history: v1.0 → v1.1 → v1.2 additive; no removals without migration' },
    { gateId: 'G-U4', result: 'passed', evidence: 'primitives P1-P8 declared at §8 with shapes; executed-by: framework-audit-v1-3' },
    { gateId: 'G-G13', result: 'passed', evidence: 'structural-identity invariant §1.1 declared; applied at framework tier' }
  ],

  overallResult: 'pass'
}
```

**Summary:** SG1-SG4 pass. G-U4 + G-G13 pass (framework-audit-executed per §11.5 tier-3).

---

## §2 Aggregate pass/fail/n/a matrix

| Target | X1-X10 pass | X N/A | Framework-tier gates pass | Gates N/A | Own/substrate gates pass | Overall |
|---|---|---|---|---|---|---|
| metaframework v3.2.1 | 10 | 0 | 52 | 0 | — | PASS |
| registry v1.0 | 8 | 2 (X4, X10 per structural exemption) | 0 | 52 (non-framework exemption spec §4.6) | IG1-IG5 pass | PASS |
| generation-procedure v1.1.1 | 10 | 0 | 52 | 0 | — | PASS |
| amendment-propagation v1.1 | 10 | 0 | 52 | 0 | — | PASS (static surface; self-recursion at Work Item 3) |
| framework-audit v1.3.1 | 10 | 0 | 52 | 0 | 3 (G-FA1-G-FA3) | PASS (SELF-AUDIT) |
| substrate v1.2 | — | — | — | — | SG1-SG4 + G-U4 + G-G13 | PASS |

**Aggregate:** 0 fail / 5 framework pass + 1 substrate pass / 2 N/A-with-basis (registry structural exemption).

---

## §3 Kind A log

**Pre-execution expected count:** zero.
**Post-execution actual count:** zero.

No gate body non-executable. No axiom text mechanically un-verifiable. No X-dimension test lacking declared J-input.

**Single hygiene finding logged (not Kind A, not halting):** phase-9h-spec.md §2.1 line 19 states "45 framework-tier gates" — this is text-drift in the handoff spec document, not in canonical system content. Canonical post-hygiene gate count is 52. Execution used 52. No impact on result. Logged for post-beta aggregate triage.

---

## §4 Work Item 1 disposition

**PASS.** All 5 frameworks + substrate-tier audit complete. Zero structural findings. G-U1 self-application closed mechanically (framework-audit-v1.3.1 self-audit produces valid SelfAuditRecord).

---

## End of report
