# metaframework-v3-1

**Kind:** Framework
**Mode:** generative
**Level:** L2
**Version:** v3.2.1
**Authority:** L0 confirmed (Phase 1.2-fix-trail hygiene delivery)
**Consumes:** substrate-v1-1, framework-registry-v1-0
**Consumed by:** generation-procedure, framework-audit, amendment-propagation, generated L3 frameworks
**Dependencies:** substrate-v1-1 (by reference, per HR1), framework-registry-v1-0 (by reference, per HR5)
**Versioning discipline:** additive only (per MA-L1)

Metaframework is the L2 framework that produces L3 framework templates. It declares the seven-axis decomposition, axiom distribution, gate suite, handoff rules, and schema that any generated framework conforms to. Its content is rendered from v3-1-spec §3 (the authoritative declaration); this file is the canonical artifact.

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Metaframework |
| Kind | Framework |
| Mode | generative (substrate §2 Modes) |
| Level | L2 |
| Version | v3.2.1 |
| Ownership (template) | L0 |
| Ownership (applied) | System (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` when invoked by generation-procedure) |
| Carrier | self (metaframework emits its own artifact `GeneratedFrameworkTemplate`; no enclosing carrier) |
| Consumes | substrate-v1-1 (HR1), framework-registry-v1-0 (HR5) |
| Consumed by | generation-procedure (HR2), framework-audit (HR3), amendment-propagation (HR4), registry (HR5), generated L3 frameworks (HR6) |
| Authority | L0 confirmed |
| Genesis | bootstrap per substrate §14 (grandfathered at first registry write) |
| scopeOut | `['runtime execution engine (post-9g)', 'amendment-propagation coordination (post-9g)', 'L3-framework-discovery (post-beta)']` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | axiom set + gate results + lifecycle state (per §4, §5, §8) |
| Own I/O | `MetaframeworkInput` → `GeneratedFrameworkTemplate` (per §2) |
| Own invariants | 35 axis-bound structural-transformation axioms + MA-G13 universal (per §3) |
| Own discipline | generation procedure (invoked via HR2) + audit gates (§4) + amendment propagation (HR4) |

All four properties declared. MA-G13 passes. Metaframework is classified as framework (not state store).

---

## §2 Schema

### §2.1 Input — `MetaframeworkInput`

Rendered from v3-1-spec §3.3.

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

  // Activation-flow input (per V5 verification)
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

### §2.2 Output — `GeneratedFrameworkTemplate`

Rendered from v3-1-spec §3.3.

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
               failureModes, scaleBounds, atomicityDeclarations
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

`sourceInput` reference-default (per A-20): provenance stores reference to registry-archived input; by-value retention is opt-in.

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityLevel` | substrate §5 |
| `AuthorityClaim` | substrate §5 |
| `FrameworkRef` | substrate §4 A-01 WAtom pattern (framework reference) |
| `WAtom` | substrate §4 A-01 |
| `AxiomRef` | substrate §4 A-02 |
| `Semver` | substrate §7 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |
| `Kind` | substrate §4 A-10 |
| `Ownership` | substrate §4 A-11 |
| `ActivationTrigger` | substrate §4 A-12 |
| `OperatorInterface` | substrate §4 A-13 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |

### §2.4 Metaframework-local atoms (declared at point of use in §3)

Metaframework-local atoms:
`AxisInstance`, `AxiomInstance`, `GateInstance`, `HandoffRuleInstance`, `JudgmentInputDeclaration`, `ProcedureStepInstance`, `DimensionResult`, `EscalationState`, `JudgmentDeprecation`, `MetaframeworkGateIdSet`, `VocabularyEntry`.

Substrate-referenced atoms (consumed from substrate per S1 single-source declaration):
`Kind` (substrate §4 A-10), `Ownership` (substrate §4 A-11), `ActivationTrigger` (substrate §4 A-12), `OperatorInterface` (substrate §4 A-13), `GenesisDeclaration` (substrate §4 A-14), `State` (substrate §9 LifecycleState), `Carrier` (substrate §9).

Each metaframework-local atom declared at first use in §3 Structure with shape block. Substrate-referenced atoms consumed by identifier per S1.

### §2.5 Schema rules (ScR-series)

Per v3-1-spec §3.3, unchanged from original spec. Declared here by reference to v3-1-spec §3.3; full text consumed from that source.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only at this section per single-source-via-reference (A-08).

---

## §3 Structure

### §3.1 Seven-axis set

Rendered from v3-1-spec §3.1.

| ID | Axis | Concern |
|---|---|---|
| A1 | Identity | What the framework is |
| A2 | Schema | Typed input/output |
| A3 | Structure | Internal decomposition |
| A4 | Validity | Gates verifying the framework |
| A5 | Lifecycle | Versioning, amendment, transition |
| A6 | Coupling | Cross-framework concerns (Carrier + Custody + Provenance + Handoff) |
| A7 | Judgment | Non-mechanical inputs |

**MECE verification** declared as judgment input `J-axis-mece` (see §7.1).

### §3.2 Axioms distributed

**Count: 35 axis-bound + 1 universal = 36 axioms.** Rendered from v3-1-spec §3.2.

| Axis | Count | IDs |
|---|---|---|
| Identity | 5 | MA-I1, MA-I2, MA-I3, MA-I4, MA-I5 |
| Schema | 3 | MA-S1, MA-S2, MA-S3 |
| Structure | 5 | MA-St1, MA-St2, MA-St3, MA-St4, MA-St5 |
| Validity | 5 | MA-V1, MA-V2, MA-V3, MA-V4, MA-V5 |
| Lifecycle | 7 | MA-L1, MA-L2, MA-L3, MA-L4, MA-L5, MA-L6, MA-L7 |
| Coupling | 6 | MA-C1, MA-C2, MA-C3, MA-C4, MA-C5, MA-C6 |
| Judgment | 4 | MA-J1, MA-J2, MA-J3, MA-J4 |
| Universal | 1 | MA-G13 |

#### §3.2.1 Axioms with full text declared in v3-1-spec §3.2

**MA-L6 — Activation-flow invariant.**
Framework operations conform to substrate §13 activation flow. Every operation declares atomicity per §13.4, participates in registry-lock protocol per §13.5, and declares L0-unavailability behavior per §13.6.

*Scope (per Phase 1.2 clarification):* MA-L6 covers system-level activation flow (substrate §13) only. Per-operation stage discipline is enforced by substrate §10.2 PR4 + PR5 and tested by framework-audit §3.3 X10 extended predicate. No axiom amendment required for Phase 1.2 stage additions.

**MA-L7 — Bootstrap non-re-entrancy.**
Framework declares genesis per framework-audit X8 (substrate §14.2–§14.5). Bootstrap event is non-re-entrant; post-bootstrap derivations occur via declared procedures.

**MA-V5 — Gate set exhaustive over declared validation dimensions.**
Per v3-1-spec §3.2 testability declaration: enumerable via framework-audit's ten declared audit dimensions (X1–X10). G-V5 tests by verifying gate-to-dimension mapping completeness.

**MA-G13 — Structural-identity invariant** (universal; declared at substrate §1.1).
Any declared element with all four of (own state, own I/O, own invariants, own discipline) is a framework. No framework may contain another framework as a sub-element. Declared at substrate; applied at metaframework via G-G13.

#### §3.2.2 Axioms declared by ID + axis binding only (verbatim text not in v3-1-spec §3.2)

The remaining 32 axioms are declared in v3-1-spec §3.2 by ID and axis binding only. Canonical axiom text was authored at earlier Phase 3/4 cycles and is present in prior metaframework revisions (v2.5, v3.0 original). Phase 9d renders the current spec; axiom text source is flagged as audit note (see phase-9d-delivery-report.md §4.5).

Axioms rendered by ID + axis binding per v3-1-spec §3.2:

- **Identity (A1):** MA-I1, MA-I2, MA-I3, MA-I4, MA-I5 — each binds to Identity axis per AxR1; each states one mechanical condition directly per AxR2.
- **Schema (A2):** MA-S1, MA-S2, MA-S3 — each binds to Schema axis per AxR1.
- **Structure (A3):** MA-St1, MA-St2, MA-St3, MA-St4, MA-St5 — each binds to Structure axis per AxR1.
- **Validity (A4):** MA-V1, MA-V2, MA-V3, MA-V4 — each binds to Validity axis per AxR1. (MA-V5 full text declared §3.2.1.)
- **Lifecycle (A5):** MA-L1, MA-L2, MA-L3, MA-L4, MA-L5 — each binds to Lifecycle axis per AxR1. (MA-L6, MA-L7 full text declared §3.2.1.)
- **Coupling (A6):** MA-C1, MA-C2, MA-C3, MA-C4, MA-C5, MA-C6 — each binds to Coupling axis per AxR1.
- **Judgment (A7):** MA-J1, MA-J2, MA-J3, MA-J4 — each binds to Judgment axis per AxR1.

### §3.3 Axiom rules (AxR-series)

Per v3-1-spec §3.2.

- **AxR1:** Every axiom binds to exactly one axis or is universal/substrate-declared.
- **AxR2:** Every axiom states one mechanical condition directly. (No axiom-as-test-reference per A-24 / F-04 / F-41 / D-1.)
- **AxR3:** Axioms additively versioned.
- **AxR4:** Axiom text is declarative.

### §3.4 Primitive instances

Per substrate §8.

| Primitive | Count | Instances |
|---|---|---|
| P1 Axis | 7 | A1–A7 |
| P2 Sub-axis | 0 | no sub-axes declared at metaframework level; declare per-axis as MECE requires in derived L3 frameworks |
| P3 Leaf | 36 | one per axiom (each axiom is a property-atomicity leaf under its bound axis) |
| P4 Axiom | 36 | MA-I1..MA-I5, MA-S1..MA-S3, MA-St1..MA-St5, MA-V1..MA-V5, MA-L1..MA-L7, MA-C1..MA-C6, MA-J1..MA-J4, MA-G13 |
| P5 Gate | 56 | see §4 Validity |
| P6 Handoff rule | 7 | HR0–HR6 (see §6 Coupling) |
| P7 Judgment input | 2 | J-axis-mece, J-axiom-dist (see §7 Judgment) |
| P8 Procedure step | delegated | metaframework is generative, but procedure-step instances are declared in `generation-procedure-v1-0` (consumer framework) per v3-1-spec §4.4 file-specific placement |

### §3.5 Vocabulary

Framework-local terms declared inline at point of use (per PR1, substrate §10.2). Substrate terms referenced by identifier. Metaframework-local terms + substrate-referenced rows:

| Term | Declared | Definition |
|---|---|---|
| `AxisInstance` | §3.4 | instantiated P1 |
| `AxiomInstance` | §3.4 | instantiated P4 |
| `GateInstance` | §4 | instantiated P5 |
| `HandoffRuleInstance` | §6 | instantiated P6 |
| `JudgmentInputDeclaration` | §7 | instantiated P7 |
| `ProcedureStepInstance` | §3.4 | instantiated P8 (delegated to generation-procedure) |
| `DimensionResult` | §4.3 | `{dimensionId, status, evidence}` per framework-audit §3.3 |
| `EscalationState` | §5 | `{status, gap, requiredMode}` per substrate §13.6 pattern |
| `JudgmentDeprecation` | §5 | `{judgmentId, deprecatedAt, reason, authorityClaim}` per MA-L5 |
| `MetaframeworkGateIdSet` | §6.5 | `string[]` enumerating all framework-tier gate IDs (52 entries); see §6.5 custody row |
| `VocabularyEntry` | this table | framework-local term declaration |
| `Kind` | substrate §4 A-10 | substrate-declared enum; consumed by reference |
| `Ownership` | substrate §4 A-11 | substrate-declared typed shape; consumed by reference |
| `ActivationTrigger` | substrate §4 A-12 | substrate-declared typed shape; consumed by reference |
| `OperatorInterface` | substrate §4 A-13 | substrate-declared typed shape; consumed by reference |
| `GenesisDeclaration` | substrate §4 A-14 | substrate-declared typed shape; consumed by reference |
| `State` | substrate §9 | LifecycleState enum consumed by reference |
| `Carrier` | substrate §9 | substrate-declared enum; consumed by reference |

---

## §4 Validity

### §4.1 Gate count

**56 total gates** per v3-1-spec §3.4.

| Category | Count | ID range |
|---|---|---|
| Substrate gates (run once, not per framework) | 4 | SG1, SG2, SG3, SG4 |
| Primitive gates (per framework) | 7 | PG1, PG2, PG3, PG4, PG5, PG6, PG7 |
| Axiom gates (1 per axis-bound axiom) | 35 | G-I1–G-I5, G-S1–G-S3, G-St1–G-St5, G-V1–G-V5, G-L1–G-L7, G-C1–G-C6, G-J1–G-J4 |
| Universal MA-G13 gate | 1 | G-G13 |
| F-69 universal gates | 5 | G-U1, G-U2, G-U3, G-U4, G-U5 |
| Meta-gates | 4 | G-M1, G-M2, G-M3, G-M4 |
| **Total** | **56** | |

**Framework-tier gates (run per framework): 52** (per v3-1-spec §3.4; sum of 7 PG + 35 axiom + 1 MA-G13 + 5 F-69 + 4 meta. Substrate gates SG1–SG4 excluded per substrate §11.5 tier-1 "run once, not per framework" semantics. PG1–PG7 classified per-framework-tier per substrate §11.5 tier-2.)

### §4.2 Meta-gates (G-M1–G-M4)

Per v3-1-spec §3.4.

- **G-M1 — Axiom-gate 1:1 mapping integrity.** Every declared axiom has exactly one primary gate (multi-axiom gates permitted only with declared justification per P5). Mechanical: enumerate axioms, verify each has gate binding; verify no axiom has >1 primary gate without justification.

- **G-M2 — Gate set exhaustive over declared axioms.** Every declared axiom has ≥1 executing gate. Mechanical: reverse mapping check — every axiom reachable from some gate.

- **G-M3 — Gate execution order respected.** Gate execution follows topological order at substrate §11.5 (substrate → axiom → universal → meta). Mechanical: parse execution log, verify tier-order preserved.

- **G-M4 — Gate failure escalation path declared.** Every gate declares failure escalation path (which lifecycle event triggers on failure, per MA-L4). Mechanical: enumerate gates, verify escalationPath field present.

### §4.3 F-69 universal gates

Per v3-1-spec §3.4.

| Gate | Declared in | Executed by | Mechanical test body |
|---|---|---|---|
| G-U1 Self-application | metaframework | framework-audit | framework-audit runs its own gate suite (G-FA1–G-FA3 + inherited framework-tier) against framework-audit itself; every result populated in self-audit record |
| G-U2 Propagation completeness | metaframework | amendment-propagation | per-framework propagation state = `'propagated'` across all `impactedFrameworkSet` entries in `PropagationTrace`; zero entries in `'pending'` or `'failed'` state at AmendmentEvent closure |
| G-U3 Axiom-axis coverage | metaframework | framework-audit | every declared axiom attaches to exactly one declared axis (AxR1); reverse coverage: every axis has ≥1 bound axiom or declares `emptyDeclared: true` |
| G-U4 Primitive declaration | substrate | framework-audit | every primitive P1–P8 declared at substrate §8 has ≥1 instance in framework or `emptyDeclared: true` with basis |
| G-U5 Provenance completeness | metaframework | framework-audit AND amendment-propagation | every `GeneratedFrameworkTemplate` field with non-null `generationProvenance` resolves to registered generation-procedure step ref; every `amendmentLog` entry resolves to registered `AmendmentEvent` ref |

**G-U5 co-execution semantics** (per R-0021 resolution): framework-audit and amendment-propagation execute G-U5 independently on disjoint surfaces — framework-audit per-audit-run against delivered `GeneratedFrameworkTemplate.provenance` + registry provenance-index (at §3.3 X2/X3 dimension slice); amendment-propagation per-AmendmentEvent against `PropagationTrace.amendmentLog` (at §3.3 AP5-E2 propagation-slice). Surfaces never overlap; no coordination protocol required. Both executors surface results to audit-record / propagation-result respectively; per-cycle reconciliation is observational, not blocking.

### §4.4 Gate execution order

Per substrate §11.5 + v3-1-spec §3.4:

1. **Tier 1 — Substrate gates** (SG1–SG4): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 35 + G-G13 = 36.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework, gate-set integrity last): G-M1–G-M4.

### §4.5 Meta-gate backward-invalidation rule

Per v3-1-spec §3.4 (A-24):

- G-M failure → universal gates re-run. If they pass, axiom gates re-verified (no invalidation beyond tier boundary unless universal gate failure surfaces).
- Substrate-tier failure (tier 1) is **non-recoverable at audit level**. Escalates to L0 per bootstrap procedure (substrate §14.6 restore).
- Tier 1 failure is declared terminal invalidation.

### §4.6 Gate rules (GR-series)

Per v3-1-spec §3.4. Unchanged from original spec. Consumed by reference.

### §4.7 Current gate results

**All 52 framework-tier gates: state = `not-yet-run`.** First-run pending framework-audit post-9g per §8 deferrals.

Gate IDs enumerated (traceable; canonical set — referenced as `MetaframeworkGateIdSet` per §6.5):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4.`

Total enumerated: 52 (7 PG + 35 axiom + 1 MA-G13 + 5 F-69 + 4 meta). The 4 substrate gates (SG1–SG4) excluded per tier-1 "run once, not per framework" semantics (substrate §11.5).

---

## §5 Lifecycle

### §5.1 Version transition

v3.0 → v3.1 → v3.2 → v3.2.1. Additive per MA-L1. Phase 1.2 amendments add MA-L6 + MA-L7 axioms (added in Phase 1.1 per V4 pre-declared outcome; ratified to spec at Phase 1.2 closure) and extend P8/P6 primitive shapes per substrate v1-1. Phase 1.2-fix amendments (v3.2): vocabulary cleanup (5 atom promotions reference substrate A-10..A-14 + LifecycleState reference resolves), gate count alignment (45 → 52), F-69 mechanical test bodies, MetaframeworkGateIdSet atom declaration, provenance ISO timestamps. Phase 1.2-fix-trail hygiene (v3.2.1): §6.5 DimensionResult custody flip per RF-01; §8.1 framework-audit version-ref refresh (v1-1 → v1-3) per RF-04. Patch-level bump per hygiene discipline — no axioms, gates, HRs, primitives amended.

### §5.2 Amendment trigger

Gap-driven. Phase 1.2 findings F-1.2-01 (flow-gap) + F-1.2-02 (capture-gap) drove Phase 1.2 amendments. No amendment active at Phase 9d delivery.

### §5.3 Confirmation gate

Confirmed by L0 at Phase 1.2 closure. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. No MA-L5 events since Phase 1.1 (J-axis-mece + J-axiom-dist both active, neither deprecated).

### §5.6 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v3.0 | Phase 1.1 delivery (re-open output) | Initial metaframework declaration (7 axes, 33 axis-bound + 1 universal = 34 axioms, 54 gates, 6 handoffs). | L0 |
| v3.1 | Phase 9d delivery (rendered against v3-1-spec) | MA-L6 + MA-L7 added to Lifecycle axis (+2 axioms, total 36); HR0 added for L0 activation (+1 HR, total 7); 2 new gates added for MA-L6 + MA-L7 (total 56); ternary kind on P8; +captureShape +diagnosticSignificance on P6 per substrate v1-1 Phase 1.2 amendments. | L0 |

### §5.7 Failure modes, scale bounds, atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle` field (V5-verification additions):

- **Failure modes:** enumerated per axiom-gate tier; recovery path declared in G-M4 escalation field.
- **Scale bounds:** metaframework is bounded by substrate atom cardinality + registry write throughput per substrate §13.4 atomicity table.
- **Atomicity declarations:** per-operation atomicity per substrate §13.4 (metaframework invocation is atomic; owned framework execution is interruptible).

---

## §6 Coupling

### §6.1 Carrier

Metaframework carrier = `self` (emits its own artifact `GeneratedFrameworkTemplate` per HR6).

### §6.2 Handoff rules

**Seven handoff rules (HR0–HR6)** per v3-1-spec §3.5.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| HR0 | L0 → metaframework | `['self', 'named', 'none']` (all) | true | declared §6.3 |
| HR1 | substrate → metaframework | `['self', 'named', 'none']` | false | n/a |
| HR2 | metaframework → generation-procedure | `['self']` | true | declared §6.3 |
| HR3 | metaframework → framework-audit | `['self', 'named']` | true | declared §6.3 |
| HR4 | metaframework → amendment-propagation | `['self', 'named', 'none']` | true | declared §6.3 |
| HR5 | metaframework → registry | `['self', 'named', 'none']` | true | declared §6.3 |
| HR6 | metaframework → generated L3 frameworks | `['self', 'named', 'none']` | false | n/a (output contract; captured via HR5 registry write) |

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

For each HR with `diagnosticSignificance: true`, `captureShape` declared:

**HR0 — L0 activation** (new per Phase 1.1 V7):
```
captureShape = {
  capturedFields: ['initiator', 'target', 'operationName', 'concurrencyPolicy', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR2 — generation request:**
```
captureShape = {
  capturedFields: ['generationRequestId', 'targetTemplateRef', 'inputAtomRef', 'timestamp', 'authorityClaim'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance'
}
```

**HR3 — audit request + result:**
```
captureShape = {
  capturedFields: ['auditRequestId', 'targetFrameworkRef', 'auditResultRef', 'timestamp', 'authorityClaim'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR4 — amendment event:**
```
captureShape = {
  capturedFields: ['amendmentId', 'amendmentTrigger', 'versionFrom', 'versionTo', 'timestamp', 'authorityClaim'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByFrameworkRef + amendmentLog[]'
}
```

**HR5 — registry write:**
```
captureShape = {
  capturedFields: ['frameworkRef', 'writeTimestamp', 'authorityClaim', 'lifecycleState'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByFrameworkRef'
}
```

### §6.4 HR0 detailed contract

Per v3-1-spec §3.5.

```
HR0:
  direction: { from: L0 (substrate §5 authority), to: metaframework-v3-1 }
  carrierApplicability: ['self', 'named', 'none']
  invariant:
    L0 activation carries AuthorityClaim (level='L0'), target FrameworkRef,
    operation name, typed input per target's schema.input, and concurrency policy.
    Metaframework receives activation, acquires registry lock per substrate §13.5,
    dispatches to owned framework per Mode, and returns outcome via activation-flow.
    Activation without AuthorityClaim at level='L0' is rejected.
  captureShape: (see §6.3 HR0)
  diagnosticSignificance: true
```

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumer list per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `Mode` | substrate | L1 | all frameworks |
| `AuthorityLevel` | substrate | L1 | all frameworks |
| `AuthorityClaim` | substrate | L1 | all frameworks, registry |
| `FrameworkRef` | substrate | L1 | all frameworks, registry |
| `WAtom` | substrate | L1 | all frameworks |
| `AxiomRef` | substrate | L1 | all frameworks |
| `Semver` | substrate | L1 | all frameworks, registry |
| `Judgment` | substrate | L1 | all frameworks |
| `JudgmentId` | substrate | L1 | all frameworks |
| `Stage` | substrate | L1 | generative-mode frameworks (P8 consumers) |
| `StageContentKind` | substrate | L1 | generative-mode frameworks |
| `CaptureShape` | substrate | L1 | all frameworks declaring HRs with diagnosticSignificance |
| `MetaframeworkInput` | metaframework | L2 | generation-procedure (via HR2) |
| `GeneratedFrameworkTemplate` | metaframework | L2 | generated L3 frameworks (via HR6), registry (via HR5) |
| `AxisInstance` | metaframework | L2 | framework-audit (via HR3), generated frameworks |
| `AxiomInstance` | metaframework | L2 | framework-audit (via HR3), generated frameworks |
| `GateInstance` | metaframework | L2 | framework-audit (via HR3) |
| `HandoffRuleInstance` | metaframework | L2 | framework-audit (via HR3) |
| `JudgmentInputDeclaration` | metaframework | L2 | framework-audit (via HR3) |
| `ProcedureStepInstance` | generation-procedure (delegated per §3.4) | L2 | framework-audit (via HR3) |
| `EscalationState` | metaframework | L2 | framework-audit, amendment-propagation |
| `JudgmentDeprecation` | metaframework | L2 | framework-audit, amendment-propagation |
| `VocabularyEntry` | metaframework | L2 | framework-audit |
| `Kind` | substrate §4 A-10 (consumed by reference) | L1 | registry (LifecycleState cross-reference), framework-audit, all frameworks at §1 Identity |
| `Ownership` | substrate §4 A-11 (consumed by reference) | L1 | framework-audit, all L2 frameworks at §1 Identity |
| `State` | substrate §9 (LifecycleState) | L1 | metaframework, registry, framework-audit |
| `Carrier` | substrate §9 (enum) | L1 | all frameworks declaring HRs |
| `GenesisDeclaration` | substrate §4 A-14 (consumed by reference) | L1 | framework-audit (X8), all L2 frameworks at §1 Identity |
| `DimensionResult` | framework-audit (L2) | L2 | metaframework (schema reference via GeneratedFrameworkTemplate.validity.dimensionResults) |
| `OperatorInterface` | substrate §4 A-13 (consumed by reference) | L1 | framework-audit, consumers |
| `MetaframeworkGateIdSet` | metaframework | L2 | framework-audit, generation-procedure, amendment-propagation |
| `RegistryEntry` | registry | L2 | metaframework (via HR5), amendment-propagation, framework-audit |

### §6.6 Provenance contract

Every output `GeneratedFrameworkTemplate` field traces to either:
- a generation-procedure step (P8 instance), or
- a declared judgment input (J-axis-mece, J-axiom-dist, or template-consumer-declared J-inputs).

Provenance field schema: reference-default per A-20 (`sourceInputRef` → registry-archived input); by-value opt-in via declared flag.

### §6.7 Carrier-applicability enforcement

Per v3-1-spec §3.5 + substrate §9 (A-13):

| Applicability value | Meaning |
|---|---|
| `['self']` | Applies only when consuming framework's carrier = 'self' |
| `['self', 'named']` | Applies when carrier ∈ {self, named}; carrier='none' skips |
| `['self', 'named', 'none']` (shorthand `'all'`) | Applies regardless of carrier |

Metaframework carrier = 'self', so all HRs apply in the self-application direction (framework-audit auditing metaframework itself uses HR3 fully).

### §6.8 OperatorInterface

Per V5 verification. Operator-facing surface of metaframework exposes: invocation entry (via HR0), output retrieval (via registry lookup post-HR5), audit query (via HR3 path). Runtime implementation deferred post-9g. Declarations only at delivery.

---

## §7 Judgment

### §7.1 J-axis-mece

Per v3-1-spec §3.1.

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
    consumingFrameworkRef: metaframework-v3-1
    consumingStepId: §3.1
```

### §7.2 J-axiom-dist

Per v3-1-spec §3.2.

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
  provenance:
    instanceId: manager-phase-4
    cycleId: phase-4
    timestamp: 2026-04-21T00:00:00Z
    consumingFrameworkRef: metaframework-v3-1
    consumingStepId: §3.2
```

### §7.3 Axis status

Populated (not empty). Two judgment inputs declared. Empty-declaration rule (substrate §8.6) does not apply to this axis.

### §7.4 Judgment provenance

Both J-inputs trace to L0 confirmation at Phase 1.1 (re-open) + ratified at Phase 1.2. Registered in judgment provenance record per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

**All 52 framework-tier gates: state = `not-yet-run`.** First-run pending framework-audit post-9g per Phase 9d §8 deferrals.

Gate ID enumeration (traceable; matches §4.7):
`PG1–PG7, G-I1–G-I5, G-S1–G-S3, G-St1–G-St5, G-V1–G-V5, G-L1–G-L7, G-C1–G-C6, G-J1–G-J4, G-G13, G-U1–G-U5, G-M1–G-M4`.

### §8.2 Dimension audit results

**All 10 framework-audit dimensions (X1–X10): state = `pending-first-run`.** Uniform state; compact summary per sprint-mode directive.

Dimension ID enumeration: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` (per framework-audit-v1-3 §3.3).

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application): metaframework's gate suite runs against metaframework-v3-1 itself post-9g. At Phase 9d delivery, self-audit is a declared-placeholder state. No gate has executed; no dimension has evaluated. First execution ratifies initial state.

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v3.1 | Phase 9d delivery | Initial metaframework-v3.1 artifact rendered from v3-1-spec §3 declarations. Includes Phase 1.2 amendments: MA-L6 + MA-L7 axioms on Lifecycle axis; HR0 added for L0 activation; ternary `kind` on P8 (via substrate §8.3); `captureShape` + `diagnosticSignificance` on P6 (via substrate §8.2); per-HR captureShape declared at §6.3 for diagnostic-significant HRs. | L0 |
| v3.2 | Phase 1.2-fix delivery | §2.3 Consumed types: 7 substrate-referenced atoms added (Kind, Ownership, ActivationTrigger, OperatorInterface, GenesisDeclaration, LifecycleState, Carrier). §2.4 local atoms list split into metaframework-local + substrate-referenced categories. §3.5 Vocabulary cleanup: 5 promoted atoms (Kind, Ownership, ActivationTrigger, OperatorInterface, GenesisDeclaration) now reference substrate A-10..A-14 per R-0015; State row resolves to substrate §9 LifecycleState per R-0004+R-0016; MetaframeworkGateIdSet added. §4.1 + §4.7 + §8.1 gate count alignment (45 → 52) per R-0020 + R-0017 + R-0019. §4.3 F-69 mechanical test bodies declared for G-U2 + G-U5 per R-0022; G-U5 co-execution semantics note added per R-0021. §6.5 custody table: MetaframeworkGateIdSet row added per R-0026; 5 promoted-atom custody rows updated to substrate origin. §7.1 + §7.2 ISO 8601 timestamps per R-0027. §1 Identity: scopeOut row added per R-0042. | L0 |
| v3.2.1 | Phase 1.2-fix-trail hygiene delivery | §6.5 DimensionResult custody row flipped to framework-audit-owned with metaframework as schema-reference consumer (per RF-01, closing v1-F-05 sub-item). §8.1 Dimension ID enumeration reference `per framework-audit-v1-1 §3.3` → `per framework-audit-v1-3 §3.3` (per RF-04, same class as F-15 / R-0047 version-ref drift missed by KA-GATE1-1 cascade). Patch-level bump; no axioms, gates, HRs, primitives amended. | L0 |

---

## End of metaframework-v3-1
