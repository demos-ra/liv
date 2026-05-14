---
kind: framework
placement: frameworks/metaframework/frameworks/
---

# metaframework-v3-1

**Kind:** Framework
**Mode:** generative
**Level:** L2
**Version:** v3.3.1
**Authority:** L0 confirmed (Sprint B1 Shot 2 — MA-St17, MA-I8, MA-V10 part B, L3 binding apparatus delivery)
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
| Version | v3.3.1 |
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
| Own invariants | 65 axis-bound structural-transformation axioms + MA-G13 universal (per §3) |
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

  // Coupling input
  carrierPreference: Carrier,

  // Activation-flow input (per V5 verification)
  activationTrigger: {
    initiator: AuthorityClaim,         // L0 or escalated authority
    concurrencyPolicy: 'wait' | 'reject',
    operationName: string
  },

  // Judgment inputs
  judgment: Record<JudgmentId, Judgment>,

  // Provenance — reference-default per R-phase-1-1-resolution-20
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
  schema: { input: WAtom, output: WAtom | AxiomRef[],
            referentCitations: ReferentCitation[]   // cycle-2; defaults to [] (zero-citation frameworks vacuous-pass per MA-L11)
          },
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

  // Provenance — reference-based default per R-phase-1-1-resolution-20
  provenance: {
    generatedByMetaframework: FrameworkRef,
    generationProcedureRef: FrameworkRef,
    generationTimestamp: string,
    sourceInputRef: AtomRef,           // REFERENCE to MetaframeworkInput stored in registry
    sourceInputValue?: MetaframeworkInput  // optional by-value; opt-in via declared flag
  }
}
```

`sourceInput` reference-default (per R-phase-1-1-resolution-20): provenance stores reference to registry-archived input; by-value retention is opt-in.

`referentCitations` (cycle-2): canonical declaration site for substrate↔referent claims at the template-generation tier. Each citation conforms to substrate §4 A-18 ReferentCitation typed shape. Empty array permitted and is the default for frameworks declaring zero spec↔referent citations (vacuously satisfies MA-V10/MA-S8/MA-L11 per substrate §10.1 S4 + MA-V11). Site rationale: `schema:` block already houses typed I/O shapes — citations describe schema-tier referent claims; semantic fit. Per cycle-2 spec §7 row 4 + L0 ratification.

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
| `ReferentCitation` | substrate §4 A-18 (with inline `ExpectedShape` sub-shape, citation form `A-18.ExpectedShape`) |
| `ReferentAlignmentState` | substrate §4 A-19 |
| `ReferentSnapshot` | substrate §4 A-20 |
| `StateOrdering` | substrate §4 A-21 (consumed via §2.2 Mode position-pair indexing; cascade from substrate v1.7) |
| `AxisBasis` | substrate §4 A-22 (consumed by MA-St17 predicate over L2 declaration kinds; cascade from substrate v1.8) |

### §2.4 Metaframework-local atoms (declared at point of use in §3)

Metaframework-local atoms:
`AxisInstance`, `AxiomInstance`, `GateInstance`, `HandoffRuleInstance`, `JudgmentInputDeclaration`, `ProcedureStepInstance`, `DimensionResult`, `EscalationState`, `JudgmentDeprecation`, `MetaframeworkGateIdSet`, `VocabularyEntry`.

Substrate-referenced atoms (consumed from substrate per S1 single-source declaration):
`Kind` (substrate §4 A-10), `Ownership` (substrate §4 A-11), `ActivationTrigger` (substrate §4 A-12), `OperatorInterface` (substrate §4 A-13), `GenesisDeclaration` (substrate §4 A-14), `State` (substrate §9 LifecycleState), `Carrier` (substrate §9).

Each metaframework-local atom declared at first use in §3 Structure with shape block. Substrate-referenced atoms consumed by identifier per S1.

### §2.5 Schema rules (ScR-series)

Per v3-1-spec §3.3, unchanged from original spec. Declared here by reference to v3-1-spec §3.3; full text consumed from that source.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only at this section per single-source-via-reference (R-phase-1-1-resolution-08).

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

### §3.1.1 FrameworkConcernSpace

*(Added Sprint B1 Shot 1 per brief Δ-2. Declares the closed concern-space over which J-axis-mece C2 exhaustiveness is tested. Closure rule: additive per MA-S7 recursive scope.)*

The seven axes partition the following declared concern-space. Each entry names the axis and the concern it covers. J-axis-mece C2 tests exhaustiveness by checking the seven-axis set against this declared table.

| Axis | Concern covered |
|---|---|
| A1 Identity | What a framework is: its name, kind, mode, level, version, ownership, and genesis. |
| A2 Schema | Typed input/output: the declared shapes crossing framework boundaries. |
| A3 Structure | Internal decomposition: axes, sub-axes, leaves, axioms, primitives, and vocabulary. |
| A4 Validity | Gates verifying the framework: the mechanical tests that determine conformance. |
| A5 Lifecycle | Versioning, amendment, and transition: how a framework changes over time. |
| A6 Coupling | Cross-framework concerns: carrier semantics, custody, provenance, and handoff contracts. |
| A7 Judgment | Non-mechanical inputs: declared, criteria-bounded, provenance-tracked human inputs. |

**Closure rule:** the seven entries enumerate the concerns covering frameworks produced by the metaframework at v3.3.0-shot1 baseline. The concern-space is additive per MA-S7 recursive scope; new concerns enter via metaframework amendment when a new framework concern is identified that the seven-axis set does not cover.

### §3.2 Axioms distributed

**Count: 68 axis-bound + 1 universal = 69 axioms.** Rendered from v3-1-spec §3.2.

| Axis | Count | IDs |
|---|---|---|
| Identity | **8** | MA-I1, MA-I2, MA-I3, MA-I4, MA-I5, MA-I6, MA-I7, **MA-I8** |
| Schema | 8 | MA-S1, MA-S2, MA-S3, MA-S4, MA-S5, MA-S6, MA-S7, MA-S8 |
| Structure | **17** | MA-St1, MA-St2, MA-St3, MA-St4, MA-St5, MA-St6, MA-St7, MA-St8, MA-St9, MA-St10, MA-St11, MA-St12, MA-St13, MA-St14, MA-St15, MA-St16, **MA-St17** |
| Validity | 11 | MA-V1, MA-V2, MA-V3, MA-V4, MA-V5, MA-V6, MA-V7, MA-V8, MA-V9, MA-V10, MA-V11 |
| Lifecycle | 11 | MA-L1, MA-L2, MA-L3, MA-L4, MA-L5, MA-L6, MA-L7, MA-L8, MA-L9, MA-L10, MA-L11 |
| Coupling | 10 | MA-C1, MA-C2, MA-C3, MA-C4, MA-C5, MA-C6, MA-C7, MA-C8, MA-C9, MA-C10 |
| Judgment | 5 | MA-J1, MA-J2, MA-J3, MA-J4, MA-J5 |
| Universal | 1 | MA-G13 |

**Cycle-1 additions (v3.2.4):** MA-S7 (Schema axis, F-cycle-1-2/Q-cycle-1-2) and MA-V11 (Validity axis, F-cycle-1-8). Validity numbered MA-V11 (not MA-V10) per cycle-1 reservation; MA-V10 reserved for cycle-2 referent-shape conformance.

**Cycle-2 additions (v3.2.7):** MA-V10 (Validity axis, spec↔referent Categorical alignment), MA-S8 (Schema axis, ReferentCitation declaration shape conformance), MA-L11 (Lifecycle axis, audit-run snapshot stamping). MA-S7 predicate tightened in-place to recursive `≼` relation governing discriminated-union sub-shapes (cycle-2 introduces the first such sub-shape via A-18.ExpectedShape); cycle-1 atom set re-validated zero-regression.

**Sprint B1 Shot 2 additions (v3.3.0):** MA-St17 (Structure axis, content-basis over L2 declaration kinds), MA-I8 (Identity axis, governsRuntimeCode declaration). MA-V10 amended in-place (part B: jurisdiction-coverage predicate when governsRuntimeCode = true). Total axioms 69 → 71.

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

**MA-S7 — Schema-axis additive amendment** (added cycle-1 v3.2.4 per F-cycle-1-2/Q-cycle-1-2; binds to Schema axis. Predicate tightened cycle-2 v3.2.7 to recursive `≼` relation governing discriminated-union sub-shapes; cycle-2 introduces the first such sub-shape via A-18.ExpectedShape.)
Typed-atom schema amendments at version transitions are field-additive recursively. For every typed atom T in substrate §4 atom enumeration:
1. `prior.fields(T) ⊆ current.fields(T)` (top-level field-set subset).
2. `∀f ∈ prior.fields(T). typeOf(prior.T.f) ≼ typeOf(current.T.f)` where `≼` is the recursive shape-stability relation defined as:
   - For primitive types (string, number, boolean, null literals, string literals): `t ≼ t` iff `t = t` (equality).
   - For typed-shape references (atoms, sub-shape names): `t ≼ t` iff resolved shape of `t` satisfies recursive `≼` against resolved shape of the other.
   - For object shapes `{f1: t1, ..., fn: tn}`: `prior ≼ current` iff `prior.fieldNames ⊆ current.fieldNames` AND `∀f ∈ prior.fieldNames. prior.f.type ≼ current.f.type`.
   - For discriminated-union shapes `{ kind: 'k1' | ... | 'kn'; arm-specific fields per kind }`: `prior ≼ current` iff `prior.kindEnum ⊆ current.kindEnum` AND `∀k ∈ prior.kindEnum. prior.armShape(k) ≼ current.armShape(k)` (per-arm recursive stability for retained kinds; new kinds may be added).

Tested by G-S7 (framework-audit §4), predicate amended to evaluate the recursive `≼` relation per atom shape. *Testability: mechanical — recursive structural comparison across version transitions per substrate §4 atom enumeration.* AxR conformance: AxR1 binds Schema ✓, AxR2 one mechanical condition ✓ (the recursive `≼` relation is one predicate evaluated structurally; the recursive case is part of the same predicate, not a separate condition), AxR3 additive ✓ (tightening accepts strict superset of prior-passing artifacts when no discriminated-union sub-shapes are present, which is the cycle-1 case; cycle-2 introductions pass the tightened predicate constructively per spec §3.2 re-validation), AxR4 declarative ✓.

**MA-S8 — ReferentCitation declaration shape conformance** (added cycle-2 v3.2.7; binds to Schema axis.)
Every ReferentCitation declared in any framework's vocabulary or atom-inventory table conforms to substrate §4 A-18 typed shape: required fields populated (citationId, citingFrameworkRef, atomName, referentKind, path, expectedShape); referentKind value is in the declared enum; expectedShape value is one of the four declared ExpectedShape kinds with kind-required fields populated. *Testability: mechanical — type-check + cardinality + enum-membership classes per substrate §6.3.* Distinction from MA-S7: MA-S7 governs typed-atom shape evolution across version transitions (does the atom shape itself stay additive?). MA-S8 governs citation instance conformance to atom shape at any single point in time (does this citation match A-18?). Different concerns; orthogonal. AxR conformance: AxR1 binds Schema ✓, AxR2 single predicate over ReferentCitation shape conformance ✓, AxR3 additive ✓, AxR4 declarative ✓.

**MA-L11 — Audit-run snapshot stamping** (added cycle-2 v3.2.7; binds to Lifecycle axis.)
Every audit run against a framework declaring ≥1 ReferentCitation produces an AuditRunRecord with `referentSnapshotRef` populated and resolving to a registered ReferentSnapshot (substrate §4 A-20). Frameworks declaring zero ReferentCitations may produce AuditRunRecords with `referentSnapshotRef = null` (vacuously satisfied per substrate §6.3 cardinality semantics, parallel to MA-V11 vacuous-pass discipline). *Testability: mechanical — null-check + reference-resolution classes per substrate §6.3.* AxR conformance: AxR1 binds Lifecycle ✓, AxR2 single condition (snapshot ref populated when citations present) ✓, AxR3 additive ✓, AxR4 declarative ✓.

**MA-St17 — Content-basis over L2 declaration kinds** (added Sprint B1 Shot 2 v3.3.0 per brief Δ-3; binds to Structure axis.)
Every L2 declaration of a kind in the enumerated set that crosses boundary 2 (MFv3 → standards) and is not already grounded by another declared mechanism must declare a basis conforming to substrate §4 A-22 AxisBasis. Enumerated kind set (closed at this rev; additive per MA-S7 recursive scope): axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums. Each such declaration carries a basis resolving to one of: a substrate atom (A-22 `substrate-atom-ref` arm — `atomId` resolves to substrate §4.2 declaration), a substrate amendment (A-22 `substrate-amendment-ref` arm — `amendmentId` resolves to §16 version history entry), or an L0 ratification (A-22 `l0-ratified-ref` arm — `ratification.level = 'L0'`, `basis` non-empty). "Already grounded by another declared mechanism" means the declaration is an instance of a primitive kind (P1–P8) whose grounding is declared by PR1; axiom grounding is handled by the axiom's own derivation; gate grounding is handled by the gate's `tests` binding. These kinds are excluded from the MA-St17 quantifier. *Testability: mechanical — enumeration of declaration kinds in §3 + reference-resolution per A-22 arm discriminant per substrate §6.3 classes.* AxR conformance: AxR1 binds Structure ✓, AxR2 one predicate (basis-resolution check over enumerated kinds) ✓, AxR3 additive ✓ (kind-set extensible per MA-S7), AxR4 declarative ✓.

**MA-I8 — governsRuntimeCode declaration** (added Sprint B1 Shot 2 v3.3.0 per brief Δ-4; binds to Identity axis.)
Every framework declares `governsRuntimeCode: boolean` in its Identity section. The field is present and carries a declared value (not inferred). `true` means the framework's axis structure and closure rules are intended to govern source code in the L3 runtime; `false` means the framework governs declarations only. Closure rule: value is declared at generation time and may be amended via declared MA-L2 trigger. *Testability: mechanical — field-presence + boolean-type check per substrate §6.3 type-check class.* AxR conformance: AxR1 binds Identity ✓, AxR2 one condition (presence + type) ✓, AxR3 additive ✓, AxR4 declarative ✓.

**MA-V10 — Spec↔referent alignment (amended Sprint B1 Shot 2; part B added)** (originally added cycle-2 v3.2.7 per MF-Cycle-2 spec↔referent column closure; amended in-place Sprint B1 Shot 2 per brief Δ-4 to add part B jurisdiction-coverage predicate. Part A unchanged.)

*Part A (unchanged from v3.2.7):* For every ReferentCitation `rc` declared in framework's vocabulary or atom-inventory tables: when applicability='applicable' and executionState='executed', the referent at `rc.path` (resolved per ReferentResolver under the audit's ReferentSnapshot) parses, and its declaration structurally matches `rc.expectedShape` per the kind-specific comparison rules in substrate §4 A-18 ExpectedShape kind enum. Applicability='n/a' with basis when resolver returns null OR parser unregistered, per substrate §10.1 S4 + MA-V11 vacuous-pass clause.

*Part B (added Sprint B1 Shot 2):* When `framework.governsRuntimeCode = true` (per MA-I8), every source-governing axis must have jurisdiction coverage: for every axis `ax` in the framework where `ax.jurisdictionClaim` is declared (non-null), the set of ReferentCitations bound to `ax` covers every source path under `ax.jurisdictionClaim` — there is no path `p ∈ ax.jurisdictionClaim` for which zero ReferentCitations bind (i.e., for which `rc.path` would not subsume `p`). "Covers" means every declared source path is bound by at least one citation; gaps in coverage are G-V10 part B failures.

*Amendment trigger:* G-V10 (both parts) re-fires on L2 amendment. When a standard amends, affected ReferentCitations must be re-declared or re-verified; the re-fire requirement is declared here so amendment-propagation routes re-audit at G-V10 on every L2 amendment event that touches a framework with `governsRuntimeCode = true`.

*Testability:* Part A: mechanical when ReferentResolver returns non-null AND parser registered for referentKind. Part B: mechanical — set-coverage check over axis jurisdictionClaim paths vs. bound ReferentCitation path set; applicability='n/a' with basis when `governsRuntimeCode = false` or when no jurisdictionClaim is declared on any axis (vacuous per MA-V11 discipline). AxR conformance: AxR1 binds Validity ✓, AxR2 — note: MA-V10 now states two conjunct conditions (A+B); these are not independent axioms because they both govern the same concern (spec↔referent alignment at different granularities — part A per-citation, part B per-axis-jurisdiction). The conjunction is the single predicate governing spec↔referent alignment completeness. This is consistent with AxR2 applied to compound predicates over the same concern; the distinction from multi-axiom violations (F-phase-1-1-04) is that A+B address the same entity (spec↔referent alignment) at two levels of resolution. AxR3 additive ✓ (part B is a strengthening of an existing axiom; prior-passing zero-citation frameworks remain vacuously passing), AxR4 declarative ✓.

**MA-V11 — Applicability-basis required** (added cycle-1 v3.2.4 per F-cycle-1-8; binds to Validity axis).
For every produced gate result `gr` with `gr.applicability = 'n/a'`, `gr.basis` is non-null and `length(gr.basis) ≥ 1`. The same invariant applies to every produced dimension result with `applicability = 'n/a'`. Tested by G-V11 (§4): enumerates GateResult and DimensionResult instances across all SelfAuditRecords; verifies invariant. Result class: binary truthValue per substrate §10.1 S4 (passed iff invariant holds across all instances; failed iff any instance violates). When the enumerated set of `applicability = 'n/a'` instances is empty, the universal quantification is vacuously satisfied per substrate §6.3 cardinality semantics — `truthValue = 'passed'` with explicit basis recording the empty enumeration (parallel to G-U4 empty-declaration discipline per A-17). *Testability: mechanical — type-check + cardinality per substrate §6.3.* AxR conformance: AxR1 binds Validity ✓, AxR2 one mechanical condition ✓, AxR3 additive ✓, AxR4 declarative ✓.

#### §3.2.2 Axioms declared by ID + axis binding only (verbatim text not in v3-1-spec §3.2)

The remaining 60 axioms are declared in v3-1-spec §3.2 by ID and axis binding only (32 inherited from earlier cycles + 28 added at v3.2.3). Canonical axiom text for inherited axioms was authored at earlier Phase 3/4 cycles and is present in prior metaframework revisions (v2.5, v3.0 original); v3.2.3 axiom text authored at Phase 5 of cycle and rendered at v3-1-spec §3.2.6 (added at v3.2.3 cascade). Phase 9d renders inherited spec; axiom text source for inherited remains flagged as audit note (see phase-9d-delivery-report.md §4.5).

Axioms rendered by ID + axis binding per v3-1-spec §3.2:

- **Identity (A1):** MA-I1, MA-I2, MA-I3, MA-I4, MA-I5, MA-I6, MA-I7, MA-I8 — each binds to Identity axis per AxR1; each states one mechanical condition directly per AxR2. (MA-I6 is criteria-bounded per J-authority-source-classification declared at framework-audit §7; MA-I7 mechanical; MA-I8 full text declared §3.2.1, Sprint B1 Shot 2 v3.3.0 addition.)
- **Schema (A2):** MA-S1, MA-S2, MA-S3, MA-S4, MA-S5, MA-S6, MA-S7, MA-S8 — each binds to Schema axis per AxR1. All mechanical. (MA-S7 full text declared §3.2.1; cycle-1 v3.2.4 addition + cycle-2 v3.2.7 predicate tightening to recursive `≼`. MA-S8 full text declared §3.2.1; cycle-2 v3.2.7 addition.)
- **Structure (A3):** MA-St1, MA-St2, MA-St3, MA-St4, MA-St5, MA-St6, MA-St7, MA-St8, MA-St9, MA-St10, MA-St11, MA-St12, MA-St13, MA-St14, MA-St15, MA-St16, MA-St17 — each binds to Structure axis per AxR1. (MA-St11 criteria-bounded per J-axis-concern-coverage; MA-St14 criteria-bounded per J-axiom-text-declarative; MA-St17 full text declared §3.2.1, Sprint B1 Shot 2 v3.3.0 addition; remaining mechanical.)
- **Validity (A4):** MA-V1, MA-V2, MA-V3, MA-V4, MA-V6, MA-V7, MA-V8, MA-V9, MA-V10, MA-V11 — each binds to Validity axis per AxR1. (MA-V5 full text declared §3.2.1; MA-V6 mechanical with declared edge-case audit-note caveat; MA-V9 tests gate-rule conformance against GR-1..GR-6 declared at framework-audit §4.6.1; MA-V10 full text declared §3.2.1, cycle-2 v3.2.7 addition + Sprint B1 Shot 2 v3.3.0 part B amendment; MA-V11 full text declared §3.2.1, cycle-1 v3.2.4 addition.)
- **Lifecycle (A5):** MA-L1, MA-L2, MA-L3, MA-L4, MA-L5, MA-L8, MA-L9, MA-L10, MA-L11 — each binds to Lifecycle axis per AxR1. (MA-L6, MA-L7 full text declared §3.2.1; MA-L8 criteria-bounded per J-amendment-trigger-context; MA-L9, MA-L10 mechanical; MA-L11 full text declared §3.2.1, cycle-2 v3.2.7 addition.)
- **Coupling (A6):** MA-C1, MA-C2, MA-C3, MA-C4, MA-C5, MA-C6, MA-C7, MA-C8, MA-C9, MA-C10 — each binds to Coupling axis per AxR1. All mechanical. (MA-C9 tests cross-framework ID coherence; MA-C10 tests substrate-version-pin uniformity across active frameworks.)
- **Judgment (A7):** MA-J1, MA-J2, MA-J3, MA-J4, MA-J5 — each binds to Judgment axis per AxR1. (MA-J5 tests mechanicalGround field resolution per substrate §6.3.)

### §3.3 Axiom rules (AxR-series)

Per v3-1-spec §3.2.

- **AxR1:** Every axiom binds to exactly one axis or is universal/substrate-declared.
- **AxR2:** Every axiom states one mechanical condition directly. (No axiom-as-test-reference per R-phase-1-1-resolution-24 / F-phase-1-1-04 / F-phase-1-1-41 / F-phase-1-1-D-1.)
- **AxR3:** Axioms additively versioned.
- **AxR4:** Axiom text is declarative.

### §3.4 Primitive instances

Per substrate §8.

| Primitive | Count | Instances |
|---|---|---|
| P1 Axis | 7 | A1–A7 |
| P2 Sub-axis | 0 | no sub-axes declared at metaframework level; declare per-axis as MECE requires in derived L3 frameworks |
| P3 Leaf | **71** | one per axiom (each axiom is a property-atomicity leaf under its bound axis); 69 at v3.2.7 + 2 at v3.3.0 (MA-St17 + MA-I8) |
| P4 Axiom | **71** | MA-I1..MA-I8, MA-S1..MA-S8, MA-St1..MA-St17, MA-V1..MA-V11, MA-L1..MA-L11, MA-C1..MA-C10, MA-J1..MA-J5, MA-G13 |
| P5 Gate | **93** | see §4 Validity (87 framework-tier + 6 substrate SG1–SG6; +2 framework-tier from G-St17 + G-I8 at Sprint B1 Shot 2) |
| P6 Handoff rule | 7 | HR0–HR6 (see §6 Coupling) |
| P7 Judgment input | 2 | J-axis-mece, J-axiom-dist (see §7 Judgment). 4 additional P7 instances declared at framework-audit §7 per closure item 2: J-authority-source-classification, J-axis-concern-coverage, J-axiom-text-declarative, J-amendment-trigger-context. |
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
| `MetaframeworkGateIdSet` | substrate §4 A-15 (lifted cycle-1 per F-cycle-1-14; renders the metaframework framework-tier gate set as a derived consumer instance of the generic `GateIdSet` substrate atom) | `string[]` enumerating all framework-tier gate IDs (85 entries post-cycle-2); see §4.7 |
| `VocabularyEntry` | this table | framework-local term declaration |
| `Kind` | substrate §4 A-10 | substrate-declared enum; consumed by reference |
| `Ownership` | substrate §4 A-11 | substrate-declared typed shape; consumed by reference |
| `ActivationTrigger` | substrate §4 A-12 | substrate-declared typed shape; consumed by reference |
| `OperatorInterface` | substrate §4 A-13 | substrate-declared typed shape; consumed by reference |
| `GenesisDeclaration` | substrate §4 A-14 | substrate-declared typed shape; consumed by reference |
| `State` | substrate §9 | LifecycleState enum consumed by reference |
| `Carrier` | substrate §9 | substrate-declared enum; consumed by reference |

### §3.6 L3 binding apparatus

*(Added Sprint B1 Shot 2 per brief. Declaration of what exists — not new structure. Cross-references resolve to existing substrate atoms and audit machinery. Closure rule: apparatus is closed at this rev; extension via substrate amendment that adds new binding-tier atoms.)*

The L3 binding apparatus is the boundary-3 infrastructure (MFv3 → L3 standards boundary) that audit operates against to verify that L2-declared structure is realized in L3 runtime code. Four components:

| Component | Declared at | Role |
|---|---|---|
| `ReferentCitation` (A-18) | substrate §4.2 A-18 | Declares a citation from a framework's typed-shape declaration to a referent at a resolvable runtime path. Carries `referentKind`, `path`, and `expectedShape`. This is the mechanism by which an L2 axis claims coverage of a source code path. |
| `ReferentAlignmentState` (A-19) | substrate §4.2 A-19 | Truth-value/applicability/executionState record produced per citation per audit run. Captures whether the referent at `path` structurally matches `expectedShape` at the snapshot. |
| `ReferentSnapshot` (A-20) | substrate §4.2 A-20 | Typed identifier for a point-in-time snapshot of the runtime codebase (git commit, md5-set, or version tag). Decouples snapshot identity from audit-run state. |
| Parser registry | substrate §4.2 A-18 ReferentResolver interface | Declared at substrate as `ReferentResolver = (citation, snapshotRef) => string \| null`. Each consumer framework declares its own implementation. Framework-audit executes registered parsers at G-V10. |

**Apparatus closure rule:** the four components enumerate the boundary-3 binding infrastructure at v3.3.0 baseline. New binding-tier components enter via substrate amendment that adds a new atom to §4.2 and a new row to this table. No component may be removed without explicit substrate amendment and migration path.

**Relationship to MA-V10:** G-V10 (paired with MA-V10) is the gate that exercises this apparatus. G-V10 part A verifies per-citation alignment; G-V10 part B (added Sprint B1 Shot 2) verifies jurisdiction coverage when `governsRuntimeCode = true`. The apparatus is the machinery; MA-V10 is the axiom; G-V10 is the test.

---

## §4 Validity

### §4.1 Gate count

**93 total gates** at v3.3.0 (91 from Shot 1 + 2 new at Shot 2 — G-St17, G-I8. Substrate gate SG6 added Shot 1 and counted in Shot 1 total of 91).

| Category | Count | ID range |
|---|---|---|
| Substrate gates (run once, not per framework) | **6** | SG1, SG2, SG3, SG4, SG5, SG6 |
| Primitive gates (per framework) | 7 | PG1, PG2, PG3, PG4, PG5, PG6, PG7 |
| Axiom gates (1 per axis-bound axiom) | **70** | G-I1–G-I8, G-S1–G-S8, G-St1–G-St17, G-V1–G-V11, G-L1–G-L11, G-C1–G-C10, G-J1–G-J5 |
| Universal MA-G13 gate | 1 | G-G13 |
| F-phase-1-1-69 universal gates | 5 | G-U1, G-U2, G-U3, G-U4, G-U5 |
| Meta-gates | 4 | G-M1, G-M2, G-M3, G-M4 |
| **Total** | **93** | |

**Framework-tier gates (run per framework): 87** at v3.3.0 (sum of 7 PG + 70 axiom + 1 MA-G13 + 5 F-phase-1-1-69 + 4 meta. Substrate gates SG1–SG6 excluded per substrate §11.5 tier-1. Shot 2 framework-tier addition: 85 → 87, +2 from G-St17/G-I8.)

**Shot 1 additions (v3.3.0-shot1):** SG6 at substrate (Mode-count gate). No framework-tier additions at Shot 1.

**Shot 2 additions (v3.3.0):** G-St17 (paired with MA-St17, Δ-3 content-basis) + G-I8 (paired with MA-I8, Δ-4 governsRuntimeCode). MA-V10 amended in-place (part B jurisdiction-coverage predicate); no count change for in-place amendment.

**G-St17 — Content-basis for L2 declaration kinds.**
*Claim:* every L2 declaration of a kind in MA-St17's enumerated set declares a basis resolving per substrate §4 A-22 AxisBasis.
*Test (mechanical):* enumerate every declaration in framework §3 Structure belonging to the MA-St17 kind-set (axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums). For each: verify `basis` field present; verify `basis.kind ∈ {'substrate-atom-ref','substrate-amendment-ref','l0-ratified-ref'}`; resolve basis per arm discriminant (reference-resolution + type-check classes per substrate §6.3). Declarations with no basis field fail. Basis with unresolvable reference fails.
*Amendment trigger:* G-St17 re-fires on substrate amendment. When substrate atoms or amendments change, basis references may become stale; re-verification required at next audit run on every framework that declares a basis of kind `substrate-atom-ref` or `substrate-amendment-ref`.
*Result class:* binary truthValue per substrate §10.1 S4. Failure logs first failing declaration (axis/kind/path).

**G-I8 — governsRuntimeCode presence.**
*Claim:* every framework's Identity section carries `governsRuntimeCode: boolean` with a declared value.
*Test (mechanical):* type-check + field-presence per substrate §6.3 type-check class; verify `typeof governsRuntimeCode === 'boolean'` and field is not null/undefined.
*Result class:* binary truthValue per substrate §10.1 S4.

### §4.2 Meta-gates (G-M1–G-M4)

Per v3-1-spec §3.4.

- **G-M1 — Axiom-gate 1:1 mapping integrity.** Every declared axiom has exactly one primary gate (multi-axiom gates permitted only with declared justification per P5). Mechanical: enumerate axioms, verify each has gate binding; verify no axiom has >1 primary gate without justification.

- **G-M2 — Gate set exhaustive over declared axioms.** Every declared axiom has ≥1 executing gate. Mechanical: reverse mapping check — every axiom reachable from some gate.

- **G-M3 — Gate execution order respected.** Gate execution follows topological order at substrate §11.5 (substrate → axiom → universal → meta). Mechanical: parse execution log, verify tier-order preserved.

- **G-M4 — Gate failure escalation path declared.** Every gate declares failure escalation path (which lifecycle event triggers on failure, per MA-L4). Mechanical: enumerate gates, verify escalationPath field present.

### §4.3 F-phase-1-1-69 universal gates

Per v3-1-spec §3.4.

| Gate | Declared in | Executed by | Mechanical test body |
|---|---|---|---|
| G-U1 Self-application | metaframework | framework-audit | framework-audit runs its own gate suite (G-FA1–G-FA3 + inherited framework-tier) against framework-audit itself; every result populated in self-audit record |
| G-U2 Propagation completeness | metaframework | amendment-propagation | per-framework propagation state = `'propagated'` across all `impactedFrameworkSet` entries in `PropagationTrace`; zero entries in `'pending'` or `'failed'` state at AmendmentEvent closure |
| G-U3 Axiom-axis coverage | metaframework | framework-audit | every declared axiom attaches to exactly one declared axis (AxR1); reverse coverage: every axis has ≥1 bound axiom or declares `emptyDeclared: true` |
| G-U4 Primitive declaration | substrate | framework-audit | every primitive P1–P8 declared at substrate §8 has ≥1 instance in framework or `emptyDeclared: true` with basis |
| G-U5 Provenance completeness | metaframework | framework-audit AND amendment-propagation | every `GeneratedFrameworkTemplate` field with non-null `generationProvenance` resolves to registered generation-procedure step ref; every `amendmentLog` entry resolves to registered `AmendmentEvent` ref |

**G-U5 co-execution semantics** (per R-phase-1-2-0021 resolution): framework-audit and amendment-propagation execute G-U5 independently on disjoint surfaces — framework-audit per-audit-run against delivered `GeneratedFrameworkTemplate.provenance` + registry provenance-index (at §3.3 X2/X3 dimension slice); amendment-propagation per-AmendmentEvent against `PropagationTrace.amendmentLog` (at §3.3 AP5-E2 propagation-slice). Surfaces never overlap; no coordination protocol required. Both executors surface results to audit-record / propagation-result respectively; per-cycle reconciliation is observational, not blocking.

### §4.4 Gate execution order

Per substrate §11.5 + v3-1-spec §3.4:

1. **Tier 1 — Substrate gates** (SG1–SG6): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 70 + G-G13 = 71.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework, gate-set integrity last): G-M1–G-M4.

### §4.5 Meta-gate backward-invalidation rule

Per v3-1-spec §3.4 (R-phase-1-1-resolution-24):

- G-M failure → universal gates re-run. If they pass, axiom gates re-verified (no invalidation beyond tier boundary unless universal gate failure surfaces).
- Substrate-tier failure (tier 1) is **non-recoverable at audit level**. Escalates to L0 per bootstrap procedure (substrate §14.6 restore).
- Tier 1 failure is declared terminal invalidation.

### §4.6 Gate rules (GR-series)

Per v3-1-spec §3.4. Unchanged from original spec. Consumed by reference.

### §4.7 Current gate results

**All 87 framework-tier gates: state = `not-yet-run`** (85 from v3.2.7 + 2 new at v3.3.0: G-St17 + G-I8). First-run pending framework-audit per §8 deferrals.

Gate IDs enumerated (traceable; canonical set — referenced as `MetaframeworkGateIdSet` per §3.5 vocab + substrate §4 A-15):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-I8, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-St17, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4.`

Total enumerated: 87 (7 PG + 70 axiom + 1 MA-G13 + 5 F-phase-1-1-69 + 4 meta). The 6 substrate gates (SG1–SG6) excluded per tier-1 "run once, not per framework" semantics (substrate §11.5).

---

## §5 Lifecycle

### §5.1 Version transition

v3.0 → v3.1 → v3.2 → v3.2.1 → v3.2.3 → v3.2.4 → v3.2.5 → v3.2.6 → v3.2.7. Additive per MA-L1. Phase 1.2 amendments add MA-L6 + MA-L7 axioms (added in Phase 1.1 per V4 pre-declared outcome; ratified to spec at Phase 1.2 closure) and extend P8/P6 primitive shapes per substrate v1-1. Phase 1.2-fix amendments (v3.2): vocabulary cleanup (5 atom promotions reference substrate A-10..A-14 + LifecycleState reference resolves), gate count alignment (45 → 52), F-phase-1-1-69 mechanical test bodies, MetaframeworkGateIdSet atom declaration (later lifted to substrate A-15 per cycle-1 F-cycle-1-14), provenance ISO timestamps. Phase 1.2-fix-trail hygiene (v3.2.1): §6.5 DimensionResult custody flip per R-phase-1-2-fix-trail-01; §8.1 framework-audit version-ref refresh (v1-1 → v1-3) per R-phase-1-2-fix-trail-04. Patch-level bump per hygiene discipline — no axioms, gates, HRs, primitives amended. v3.2.3 amendments: 28 additive axioms across 7 axes (2 Identity + 3 Schema + 11 Structure + 4 Validity + 3 Lifecycle + 4 Coupling + 1 Judgment) + 28 paired gates; gate count 52 → 80; axiom count 36 → 64; 4 J-inputs declared at framework-audit §7 + 1 GR-series rule set declared at framework-audit §4.6.1. Cycle skips "v3.2.2" — no intervening cycle exists in canonical state. v3.2.4 (MF-Cycle-1 Foundation Closure) amendments: MA-S7 + G-S7 (Schema-axis additive amendment, F-cycle-1-2/Q-cycle-1-2); MA-V11 + G-V11 (applicability-basis required, F-cycle-1-8); §3.5 vocabulary `MetaframeworkGateIdSet` row updated to substrate §4 A-15 derived consumer (F-cycle-1-14); §6.5 custody table updated for substrate-tier rows (F-cycle-1-12, F-cycle-1-14, F-cycle-1-7); §5 first-run-execution lifecycle event declared (F-cycle-1-11, see §5.X below). Counts at v3.2.4: axiom 64 → 66; framework-tier gate 80 → 82; total all-gates 84 → 86. v3.2.7 (MF-Cycle-2 Spec↔Referent Alignment Closure) amendments: substrate v1.5 → v1.6 cascade introduces atoms A-18 ReferentCitation + A-19 ReferentAlignmentState + A-20 ReferentSnapshot. MA-S7 predicate tightened in-place at §3.2.1 to recursive `≼` relation (governs discriminated-union sub-shapes; A-18.ExpectedShape is the first such sub-shape). MA-V10 + G-V10 (Validity, spec↔referent Categorical alignment); MA-S8 + G-S8 (Schema, ReferentCitation declaration shape conformance); MA-L11 + G-L11 (Lifecycle, audit-run snapshot stamping). G-S7 predicate amended in-place to evaluate recursive `≼`. §2.2 GeneratedFrameworkTemplate `schema:` block extended with `referentCitations: ReferentCitation[]` field (canonical declaration site for referent claims). Counts at v3.2.7: axiom 66 → 69 (Schema 7→8, Validity 10→11, Lifecycle 10→11); framework-tier gate 82 → 85; total all-gates 87 → 90.

### §5.X First-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11)

When a framework's gate set transitions from any gate having `executionState = 'not-yet-run'` to all gates `executionState = 'executed'`, an AmendmentEvent of kind `'first-run'` is logged.

**Prerequisites:** framework declared and ratified per §5.1; gates declared per §4. Triggered: by L0 directly via HR0 at first system-wide audit, OR by amendment-propagation post-AP7 closure when ratification was the triggering AmendmentEvent.

**Locked decisions per F-cycle-1-6 audit fix on F-cycle-1-11:**
- First-run propagates as **AmendmentEvent of kind `'first-run'`** through standard amendment-propagation flow (AP1–AP7). Not a parallel lifecycle channel.
- `amendmentTrigger` enum extended at amendment-propagation §2.1 from `'vision' | 'gap' | 'L0-directive'` to `'vision' | 'gap' | 'L0-directive' | 'first-run'`. Extension authored under MA-S7 (additive); G-S7 verifies enum extension conformance.
- AmendmentProvenance shape (substrate §4 A-16) carries the extended enum; first-run events log via standard provenance pipeline.
- For MA-L1 additivity: first-run is a non-amending lifecycle event (no axiom/gate/atom shape changes). It produces an AmendmentLogEntry (alias of AmendmentProvenance) but the AmendmentEvent does not amend the framework — it stamps execution. Per MA-L1, additivity is preserved (zero shape change).

Resolves the not-yet-run obligation declaratively. First-run executions can now be scheduled, tracked, and audited like any other lifecycle event.

### §5.2 Amendment trigger

Gap-driven. Phase 1.2 findings F-phase-1-2-01 (flow-gap) + F-phase-1-2-02 (capture-gap) drove Phase 1.2 amendments. No amendment active at Phase 9d delivery.

### §5.3 Confirmation gate

Confirmed by L0 at Phase 1.2 closure. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. No MA-L5 events since Phase 1.1 (J-axis-mece + J-axiom-dist both active, neither deprecated).

### §5.6 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v3.0 | Phase 1.1 delivery (re-open output) | Initial metaframework declaration: 7 axes, 33 axis-bound + 1 universal = 34 axioms, 54 gates, 6 handoffs (HR1–HR6). Single-batched cycle from v2.5 baseline. | L0 |
| v3.1 | Phase 9d delivery (rendered against v3-1-spec) | MA-L6 + MA-L7 added to Lifecycle axis (+2 axioms, total 36); HR0 added for L0 activation (+1 HR, total 7); 2 new gates added for MA-L6 + MA-L7 (total 56); ternary kind on P8 (`'mechanical' | 'judgment-input' | 'gate-execution'`); +captureShape +diagnosticSignificance on P6 per substrate v1-1 Phase 1.2 amendments. | L0 |
| v3.2 | Phase 1.2-fix delivery | §3.5 vocabulary cleanup (5 atom promotions A-10..A-14 reference substrate); LifecycleState reference resolves; MetaframeworkGateIdSet atom declared (later lifted to substrate A-15 per cycle-1 F-cycle-1-14); §4.1 + §4.7 + §8.1 gate count alignment 45 → 52 per R-phase-1-2-0020; §4.3 F-phase-1-1-69 mechanical test bodies authored for G-U2 + G-U5; §6.5 custody table refreshed; §7.1 + §7.2 ISO 8601 timestamps. | L0 |
| v3.2.1 | Phase 1.2-fix-trail hygiene delivery | §6.5 DimensionResult custody flip per R-phase-1-2-fix-trail-01; §8.1 framework-audit version-ref refresh per R-phase-1-2-fix-trail-04. Patch-level — no structural amendment. | L0 |
| v3.2.3 | Phase v3.2.3 delivery (2026-04-27) | 28 axioms added across 7 axes (per axis: I+2, S+3, St+11, V+4, L+3, C+4, J+1); 28 paired gates added; 4 J-inputs added (declared at framework-audit §7); 1 GR-series rule set added (declared at framework-audit §4.6.1). Counts: axiom 36→64; framework-tier gate 52→80; total all-gates 56→84. P3, P4, P5, P7 row totals updated at §3.4. Single-batched cycle per Phase 6. | L0 |
| v3.2.4 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cluster D atom dependencies tracked through substrate v1.3 lift: §3.5 vocabulary `MetaframeworkGateIdSet` row updated to substrate §4 A-15 derived consumer (F-cycle-1-14); §6.5 custody table — `MetaframeworkGateIdSet` ownership lifted to substrate §4 A-15, new rows added for OriginProvenance (A-05 in-place rename), AmendmentProvenance (A-16), EmptyPrimitiveDeclaration (A-17). Cluster D axioms: MA-S7 (Schema-axis additive amendment, F-cycle-1-2/Q-cycle-1-2) + G-S7 paired gate; MA-V11 (applicability-basis required, F-cycle-1-8) + G-V11 paired gate. §3.2 axiom count 64→66 (Schema 6→7, Validity 9→10 with V11 numbering); §3.2.1 MA-S7 + MA-V11 full text declared; §3.2.2 Schema + Validity bindings extended; §3.4 P3 64→66, P4 64→66, P5 84→86; §4.1 framework-tier gate 80→82 (total all-gates 84→86); §4.4 tier-2 axiom-gates 64→66; §4.7 + §8.1 enumeration extended with G-S7 + G-V11. Cluster C: §5.X first-run-execution lifecycle event declared (F-cycle-1-11; AmendmentEvent kind `'first-run'`, see §5.X). MF-Cycle-1 Foundation Closure spec rev-2 ratified by L0 2026-04-29 with no preserved MF-amendment-1 carry text (carries close-by-rebuild per Q-cycle-1-1). All amendments additive per MA-L1 + MA-S7. | L0 |
| v3.2.5 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) | Substrate v1.3 → v1.4 cascade. Substrate added S6 (identifier naming function) + SG5 (naming-function conformance gate) + §1.5 canonical kind registry. Counts: substrate gate count 4 → 5; total all-gates 86 → 87 (framework-tier 82 unchanged — substrate gates excluded per substrate §11.5 tier-1). MA-S7 single-mechanical-condition tightening (subset-with-type-stability predicate per AxR2). MA-V11 vacuous-pass clause added (empty `applicability='n/a'` set vacuously satisfied per substrate §6.3 cardinality semantics). Identifier sweep applied: every multi-locus identifier in canonical S6 form (declarations and citations alike). All amendments additive per MA-L1 + MA-S7. | L0 |
| v3.3.1 | Sprint B1 Shot 5 (2026-05-13) | §2.1 MetaframeworkInput: removed `adjacentFrameworks: FrameworkRef[]` field — non-load-bearing residue declared at v3.0 with zero downstream consumers (no axiom, gate, or output field populates from it). generation-procedure §2.1 input-field enumeration swept in lockstep. Patch-level removes-residue per S3; no axioms / gates / HRs / primitives amended. Full rationale at §9 v3.3.1 row. | L0 |

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
| `MetaframeworkGateIdSet` | substrate §4 A-15 (lifted cycle-1 per F-cycle-1-14; derived consumer instance of `GateIdSet` rendering metaframework framework-tier gate enumeration) | L1 | framework-audit, generation-procedure, amendment-propagation |
| `OriginProvenance` | substrate §4 A-05 (in-place rename from `ProvenanceRow` cycle-1 per F-cycle-1-12) | L1 | metaframework, framework-audit, amendment-propagation, registry |
| `AmendmentProvenance` | substrate §4 A-16 (added cycle-1 per F-cycle-1-12) | L1 | registry (RegistryEntry.amendmentProvenance + AmendmentLogEntry alias), framework-audit (G-U5), amendment-propagation (PropagationTrace) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (added cycle-1 per F-cycle-1-7) | L1 | all frameworks declaring empty primitive markers; framework-audit (G-U4 executor) |
| `RegistryEntry` | registry | L2 | metaframework (via HR5), amendment-propagation, framework-audit |

### §6.6 Provenance contract

Every output `GeneratedFrameworkTemplate` field traces to either:
- a generation-procedure step (P8 instance), or
- a declared judgment input (J-axis-mece, J-axiom-dist, or template-consumer-declared J-inputs).

Provenance field schema: reference-default per R-phase-1-1-resolution-20 (`sourceInputRef` → registry-archived input); by-value opt-in via declared flag.

### §6.7 Carrier-applicability enforcement

Per v3-1-spec §3.5 + substrate §9 (R-phase-1-1-resolution-13):

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
    C2: Seven-axis set is collectively exhaustive over framework concerns (mechanical: enumeration check against §3.1.1 FrameworkConcernSpace — amended Sprint B1 Shot 1 to replace prior implicit reference).
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
    axioms: [MA-I1..MA-I7, MA-S1..MA-S6, MA-St1..MA-St16, MA-V1..MA-V9,
             MA-L1..MA-L10, MA-C1..MA-C10, MA-J1..MA-J5]
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

**All 87 framework-tier gates: state = `not-yet-run`** (85 from v3.2.7 + 2 new at v3.3.0: G-St17 + G-I8). First-run pending framework-audit per §8 deferrals.

Gate ID enumeration (traceable; matches §4.7):
`PG1–PG7, G-I1–G-I8, G-S1–G-S8, G-St1–G-St17, G-V1–G-V11, G-L1–G-L11, G-C1–G-C10, G-J1–G-J5, G-G13, G-U1–G-U5, G-M1–G-M4`.

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
| v3.2 | Phase 1.2-fix delivery | §2.3 Consumed types: 7 substrate-referenced atoms added (Kind, Ownership, ActivationTrigger, OperatorInterface, GenesisDeclaration, LifecycleState, Carrier). §2.4 local atoms list split into metaframework-local + substrate-referenced categories. §3.5 Vocabulary cleanup: 5 promoted atoms (Kind, Ownership, ActivationTrigger, OperatorInterface, GenesisDeclaration) now reference substrate A-10..A-14 per R-phase-1-2-0015; State row resolves to substrate §9 LifecycleState per R-phase-1-2-0004+R-phase-1-2-0016; MetaframeworkGateIdSet added. §4.1 + §4.7 + §8.1 gate count alignment (45 → 52) per R-phase-1-2-0020 + R-phase-1-2-0017 + R-phase-1-2-0019. §4.3 F-phase-1-1-69 mechanical test bodies declared for G-U2 + G-U5 per R-phase-1-2-0022; G-U5 co-execution semantics note added per R-phase-1-2-0021. §6.5 custody table: MetaframeworkGateIdSet row added per R-phase-1-2-0026; 5 promoted-atom custody rows updated to substrate origin. §7.1 + §7.2 ISO 8601 timestamps per R-phase-1-2-0027. §1 Identity: scopeOut row added per R-phase-1-2-0042. | L0 |
| v3.2.1 | Phase 1.2-fix-trail hygiene delivery | §6.5 DimensionResult custody row flipped to framework-audit-owned with metaframework as schema-reference consumer (per R-phase-1-2-fix-trail-01, closing v1-F-05 sub-item). §8.1 Dimension ID enumeration reference `per framework-audit-v1-1 §3.3` → `per framework-audit-v1-3 §3.3` (per R-phase-1-2-fix-trail-04, same class as F-cycle-1-15 / R-phase-1-2-0047 version-ref drift missed by KA-GATE1-1 cascade). Patch-level bump; no axioms, gates, HRs, primitives amended. | L0 |
| v3.2.3 | Phase v3.2.3 delivery (2026-04-27) | 28 axioms (I+2, S+3, St+11, V+4, L+3, C+4, J+1) + 28 paired gates added per single-batched cycle. Counts: §3.2 36→64; §3.4 P3 36→64, P4 36→64, P5 56→84; §4.1 framework-tier 52→80; §4.7 + §8.1 enumeration extended; §3.2.2 binding lines extended for all 7 axes; §3.5 vocabulary MetaframeworkGateIdSet 52→80; §4.4 tier-2 axiom-gates 35+G-G13=36 → 63+G-G13=64; §7.2 J-axiom-dist input enumeration extended; §5.1 + §5.6 transition log updated. 4 J-inputs declared at framework-audit §7 (J-authority-source-classification, J-axis-concern-coverage, J-axiom-text-declarative, J-amendment-trigger-context). 1 GR-series rule set declared at framework-audit §4.6.1. Source: v3-1-spec §3.2.6 + Phase 5 axiom authoring. | L0 |
| v3.2.4 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cycle-1 cluster B/A/D/C dispatch. Schema axis: MA-S7 + G-S7 added (F-cycle-1-2/Q-cycle-1-2 — Schema-axis additive amendment governance; tests typed-atom additive evolution). Validity axis: MA-V11 + G-V11 added (F-cycle-1-8 — applicability-basis required; tests every gate result with applicability='n/a' carries non-null basis). Counts: axiom 64→66 (Schema 6→7, Validity 9→10 with V11 numbering — V10 reserved for cycle-2); framework-tier gate 80→82; total all-gates 84→86. §3.2.1 MA-S7 + MA-V11 full text declared; §3.2.2 Schema + Validity bindings extended; §3.4 P3 64→66, P4 64→66, P5 84→86; §4.1 + §4.4 + §4.7 + §8.1 enumerations extended. Substrate-tier consumption: §3.5 vocabulary MetaframeworkGateIdSet row updated to substrate §4 A-15 derived consumer (F-cycle-1-14 lift); §6.5 custody — MetaframeworkGateIdSet ownership lifted to substrate; new rows for OriginProvenance (A-05 in-place rename per F-cycle-1-12), AmendmentProvenance (A-16 per F-cycle-1-12), EmptyPrimitiveDeclaration (A-17 per F-cycle-1-7). §5.X first-run-execution lifecycle event declared (F-cycle-1-11; AmendmentEvent kind `'first-run'`, propagates via standard AP1–AP7 flow under MA-S7 enum extension). §5.6 historical rows updated for v3.0 + v3.1 + v3.2 + v3.2.1 hygiene per spec §3.16 Cluster E. All amendments additive per MA-L1 + MA-S7. | L0 |
| v3.2.5 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29; row added at cycle-1.6 — closes cycle-1.5 §9 self-amendment gap) | Substrate v1.3 → v1.4 cascade. Substrate added S6 (identifier naming function) + SG5 (naming-function conformance gate) + §1.5 canonical kind registry. Counts: substrate gate count 4 → 5; total all-gates 86 → 87 (framework-tier 82 unchanged — substrate gates excluded per substrate §11.5 tier-1). §4.1 substrate-gate row count 4 → 5 (deferred at cycle-1.5 delivery; closed by cycle-1.6 cascade). MA-S7 single-mechanical-condition tightening (subset-with-type-stability predicate per AxR2). MA-V11 vacuous-pass clause added (empty `applicability='n/a'` set vacuously satisfied per substrate §6.3 cardinality semantics). Identifier sweep applied: every multi-locus identifier in canonical S6 form (declarations and citations alike). All amendments additive per MA-L1 + MA-S7. | L0 |
| v3.2.6 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | Substrate v1.4 → v1.5 cascade. §4.1 substrate-gate count corrected 4 → 5 (cycle-1.5 omission); §4.1 Total 86 → 87. §4.7 unchanged (framework-tier 82). No axiom / gate / HR / primitive amendments — corrective-cycle scope. Identifier-sweep companion: 8 metaframework body sites swept per substrate §1.5 amended (Phase 1.1 references reclassified — atom shape A-NN bare, finding F-phase-1-1-A-NN kept, resolution R-phase-1-1-resolution-NN). All amendments additive per MA-L1 + MA-S7 (terminology disambiguation, no shape changes). | L0 |
| v3.2.7 | MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30) | Substrate v1.5 → v1.6 cascade (3 new atoms A-18 ReferentCitation + A-19 ReferentAlignmentState + A-20 ReferentSnapshot). §3.2.1 MA-S7 predicate tightened in-place to recursive `≼` relation (governs discriminated-union sub-shapes; cycle-2 introduces the first such sub-shape via A-18.ExpectedShape). §3.2.1 MA-V10 + MA-S8 + MA-L11 full text declared (3 new axioms; MA-V10 Validity spec↔referent Categorical alignment, MA-S8 Schema ReferentCitation declaration shape conformance, MA-L11 Lifecycle audit-run snapshot stamping). §3.2 axiom counts: Schema 7→8, Validity 10→11, Lifecycle 10→11; total 66→69. §3.2.2 Schema + Validity + Lifecycle bindings extended. §2.2 GeneratedFrameworkTemplate `schema:` block extended with `referentCitations: ReferentCitation[]` field (canonical declaration site per cycle-2 spec §7 row 4 + L0 ratification on extend-`schema:` placement). §2.3 consumed-types table: A-18, A-19, A-20 rows added. §3.5 vocabulary MetaframeworkGateIdSet count 82→85. §4.1 framework-tier gate count 82→85 (G-V10 + G-S8 + G-L11 paired gates added; G-S7 predicate amended in-place to evaluate recursive `≼`, no count change for the amendment); total all-gates 87→90; substrate gates SG1–SG5 unchanged at 5. §4.4 tier-2 count 65+G-G13=66 → 68+G-G13=69. §4.7 + §8.1 enumeration extended. All amendments additive per MA-L1 + MA-S7 (recursive scope per §3.2.1 amendment); MA-S7 tightening verified zero-regression on cycle-1 atom set (A-01..A-17 carry zero discriminated-union sub-shapes; recursive `≼` reduces to prior subset-with-type-stability predicate). | L0 |
| v3.3.0-shot1 | Sprint B1 Shot 1 — FrameworkConcernSpace + StateOrdering (2026-05-13) | Δ-2 per brief. §3.1.1 FrameworkConcernSpace added: declares seven-entry concern-space table (one entry per axis: Identity→what-a-framework-is, Schema→typed-I/O, Structure→internal-decomposition, Validity→conformance-gates, Lifecycle→versioning-amendment-transition, Coupling→cross-framework-concerns, Judgment→non-mechanical-inputs); closure rule additive per MA-S7 recursive scope. §7.1 J-axis-mece C2 criterion amended in-place: replaces prior implicit reference to "declared concern-space" with explicit reference to §3.1.1 FrameworkConcernSpace (concern: exhaustiveness test now has a declared target). Substrate v1.6 → v1.7 cascade: A-21 StateOrdering (closed five-state tuple) + SG6 (Mode-count gate) declared at substrate; §2.3 consumed-types table receives A-21 row; §4.1 substrate gate count 5 → 6; total all-gates 90 → 91. No axiom adds, no gate adds at framework-tier (SG6 is substrate-tier). §3.4 P5 count: 90 → 91 (substrate gate SG6 added; framework-tier 85 unchanged). All amendments additive per MA-L1. | L0 |
| v3.3.0 | Sprint B1 Shot 2 — MA-St17, MA-I8, MA-V10 part B, L3 binding apparatus (2026-05-13) | Substrate v1.7 → v1.8 cascade: A-22 AxisBasis (three-arm discriminated union: substrate-atom-ref \| substrate-amendment-ref \| l0-ratified-ref) added at substrate §4.2; §2.3 ModeSignature amended in-place (StateOrderingIndex type alias + typed position fields). Four MFv3 amendments: (1) MA-St17 (Structure axis, Δ-3) + G-St17 paired gate — content-basis predicate over L2 declaration kinds; G-St17 re-fires on substrate amendment. (2) MA-I8 (Identity axis, Δ-4) + G-I8 paired gate — every framework declares governsRuntimeCode: boolean. (3) MA-V10 amended in-place (part B added): jurisdiction-coverage predicate when governsRuntimeCode = true; G-V10 re-fires on L2 amendment. (4) §3.6 L3 binding apparatus section: declares four components (A-18, A-19, A-20, parser-registry/ReferentResolver) as boundary-3 infrastructure; closure rule additive via substrate amendment; relationship to MA-V10/G-V10 declared. §3.2 axiom counts: Identity 7→8, Structure 16→17; total 69→71. §3.2.2 Identity + Structure binding lines extended. §3.4 P3 69→71, P4 69→71, P5 91→93 (SG6 from Shot 1 counted in total). §4.1 framework-tier gate count 85→87; total all-gates 91→93; SG6 in tier-1 (6 substrate gates). §4.4 tier-2 axiom-gates 69→71. §4.7 + §8.1 enumeration extended. §2.3 consumed-types: A-22 row added. All amendments additive per MA-L1 + MA-S7. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot2'} | L0 |
| v3.3.1 | Sprint B1 Shot 5 (2026-05-13) | §2.1 MetaframeworkInput: removed `adjacentFrameworks: FrameworkRef[]` field. Field declared at v3.0 as "Coupling input" but no axiom, gate, or output field consumes it; S2 derivation populates coupling output from `carrierPreference` + structural inputs only. Removal is residue cleanup per natural-derivation discipline (no consumer, no requirement, no downstream binding). generation-procedure §2.1 input-field enumeration swept in lockstep. Patch-level; additive per MA-L1 in the deletion-of-unused sense (S3 removes-residue clause). No axioms / gates / HRs / primitives amended. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot5'} | L0 |

---

## End of metaframework-v3-1
