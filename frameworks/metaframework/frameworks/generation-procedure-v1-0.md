---
kind: framework
placement: frameworks/metaframework/frameworks/
---

# generation-procedure-v1-0

**Kind:** Framework
**Mode:** generative
**Level:** L2
**Version:** v1.1.7
**Authority:** L0 confirmed (MF-Cycle-1 Foundation Closure delivery)
**Consumes:** substrate-v1-1, metaframework-v3-1
**Consumed by:** framework-audit (HR3), amendment-propagation (HR4)
**Dependencies:** substrate-v1-1 (by reference, per HR1), metaframework-v3-1 (via HR2 receive-side)
**Versioning discipline:** additive only (per MA-L1)

Generation-procedure is the L2 framework that declares *how* a `GeneratedFrameworkTemplate` is produced. Metaframework-v3-1 declares what a generated framework looks like (seven-axis shape, axioms, gates, HRs, schema); generation-procedure declares the twelve-step sequence through which a template is populated, gated, observed, and emitted. Its content is rendered from phase-9e-spec §3.

---

## §1 Identity

| Field | Value |
|---|---|
| Name | Generation Procedure |
| Kind | Framework |
| Mode | generative (substrate §2) |
| Level | L2 |
| Version | v1.1.3 |
| Ownership (template) | L0 |
| v1.1.4 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) | Cycle-1.5 cascade only: count restatements (substrate gate count 4→5; total all-gates 86→87; framework-tier 82 unchanged). Identifier sweep applied: every multi-locus identifier in canonical S6 form. No procedure-step changes. Additive per MA-L1. | L0 |
| Ownership (applied) | System (under L0 authority) |
| State (template) | `declared` |
| State (applied) | `declared` (initial; transitions to `applied` on first HR2 invocation) |
| Carrier | self (emits its own artifact — the generated framework template — at S12) |
| Consumes | substrate-v1-1 (HR1), metaframework-v3-1 (HR2 receive-side) |
| Consumed by | framework-audit (HR3), amendment-propagation (HR4) |
| Authority | L0 confirmed (MF-Cycle-1 Foundation Closure delivery) |
| Genesis | bootstrap per substrate §14 (registered at post-9e registry write) |
| scopeOut | `['runtime execution engine (post-9g)', 'per-step checkpoint runtime (post-9g)', 'multi-framework batch generation (post-beta)']` |

**MA-G13 four-property test (framework classification):**

| Property | Satisfied by |
|---|---|
| Own state | lifecycle state (declared → applied on invocation via HR2); step-level checkpoint per substrate §13.4 atomicity (owned-framework execution is interruptible with per-step recovery) |
| Own I/O | input: `MetaframeworkInput` (received via HR2); output: `GeneratedFrameworkTemplate` (emitted at S12 terminal P8) |
| Own invariants | axis/axiom/gate set inherited from metaframework; generation-procedure-local invariants: step ordering per PR4, step-kind alignment per PR5, E1–E8 coverage over metaframework axis/tier gate bundles |
| Own discipline | twelve P8 step procedure (§3.3); Stage-3 gate-execution at E1–E8; L0 confirmation-gate at S11 lifecycle transition; HR2 receive-side contract (§6.2) |

All four properties declared. MA-G13 passes. Generation-procedure is classified as framework (not state store, not protocol, not substrate).

---

## §2 Schema

### §2.1 Input

`MetaframeworkInput` per metaframework-v3-1 §2.1. Consumed by reference; no redeclaration here per R-phase-1-1-resolution-08 single-source-via-reference.

Required input fields relevant to generation-procedure's twelve-step execution:
- `domainDescription`, `domainInputState`, `proposedName`, `proposedKind`, `proposedLevel` — consumed by S2 for identity-axis population.
- `carrierPreference` — consumed by S2 for coupling-axis population.
- `activationTrigger` (initiator, concurrencyPolicy, operationName) — consumed by S1 for authority validation per substrate §13.7.
- `judgment` (Record<JudgmentId, Judgment>) — consumed by S1; must contain J-axis-mece and J-axiom-dist entries; may contain template-consumer-declared additional J-inputs.
- `provenance` (instanceId, cycleId, timestamp, authorityClaim) — consumed by S12 for provenance-contract population.

### §2.2 Output

`GeneratedFrameworkTemplate` per metaframework-v3-1 §2.2. Consumed by reference; no redeclaration. Emission performed at S12 (Stage 5 terminal P8 step).

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityClaim` | substrate §5 |
| `Stage` | substrate §8.3 |
| `StageContentKind` | substrate §8.3 |
| `CaptureShape` | substrate §8.2 |
| `FrameworkRef` | substrate §4 |
| `WAtom` | substrate §4 |
| `AxiomRef` | substrate §4 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |
| `Semver` | substrate §7 |

Plus `MetaframeworkInput` and `GeneratedFrameworkTemplate` from metaframework-v3-1 §2 by reference.

### §2.4 Generation-procedure-local atoms

Declared at point of use in §3:

- `ProcedureStepInstance` (P8 instance shape per substrate §8.3 amended) — declared §3.3.
- `StageDeclaration` (stage value + step cluster) — declared §3.3.
- `GateReferenceList` (populated `gates` field at Stage-3 E-steps per PG6 amended) — declared §3.3 per-row.
- `J-template-observation` — declared §7.

### §2.5 Schema rules (ScR-series)

Per metaframework-v3-1 §2.5 (by reference to v3-1-spec §3.3). No generation-procedure-local ScR additions.

### §2.6 Custody table

Full custody table in §6 Coupling. Summary pointer only here per R-phase-1-1-resolution-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes

Generation-procedure inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. Generation-procedure does not redeclare.

Per v3-1-spec §4.4 file-specific placement, generation-procedure's own structural content is the twelve-step P8 procedure declared at §3.3 below.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | `{primitiveKind: P1, instanceCount: 0, basis: "axes inherited from metaframework-v3-1 §3.1; generation-procedure declares no own axes"}` |
| P2 Sub-axis | 0 | `{primitiveKind: P2, instanceCount: 0, basis: "no sub-axes; axes inherited from metaframework"}` |
| P3 Leaf | 0 | `{primitiveKind: P3, instanceCount: 0, basis: "leaves inherited via axes from metaframework"}` |
| P4 Axiom | 0 | `{primitiveKind: P4, instanceCount: 0, basis: "69 axioms inherited from metaframework-v3-1 §3.2 (post-cycle-2 v3.2.7); generation-procedure declares no own axioms"}` |
| P5 Gate | 0 | `{primitiveKind: P5, instanceCount: 0, basis: "90 gates inherited from metaframework-v3-1 §4.1 (post-cycle-2 v3.2.7; 85 framework-tier + 5 substrate); E1–E8 reference metaframework framework-tier gates per PG6 amended + substrate §1.3 SI-03, but declare no new gates"}` |
| P6 Handoff rule | 1 | HR2 receive-side contract — declared §6.2 |
| P7 Judgment input | 1 | J-template-observation — declared §7.1 (generation-procedure-local, consumed at S11). J-axis-mece and J-axiom-dist consumed at S1 are metaframework-declared per metaframework §7, not redeclared here per R-phase-1-1-resolution-08. |
| P8 Procedure step | **12** | S1–S12, declared §3.3 |

Positive empty-declaration markers per substrate §8.6 for P1–P5 zero counts. Implicit-absence disallowed; zero-state declared.

### §3.3 Twelve-step procedure (S1–S12)

Distributed across substrate-v1-1 Stages 1–5 per PR5 stage-content-kind alignment. Every step declares the amended P8 shape per substrate §8.3: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}` where the kind-specific field is populated per PG6 amended (substrate §11.2).

| id | order | stage | kind | input | output | kind-specific field | gates (metaframework refs) |
|---|---|---|---|---|---|---|---|
| **S1** | 1 | 1 | judgment-input | `MetaframeworkInput` (activationTrigger + judgment record) | validated judgment record | `judgmentInputRef = {J-axis-mece, J-axiom-dist, + any template-consumer-declared J-inputs present in input.judgment}` | — |
| **S2** | 2 | 2 | mechanical | validated input + substrate-v1-1 + metaframework-v3-1 schema | draft `GeneratedFrameworkTemplate` with all eight top-level fields populated (identity + schema + structure with inherited axis/axiom/gate/HR refs + validity + lifecycle + coupling + judgment + provenance) | `derivation = "per v3-1-spec §3.3 output schema: populate each GeneratedFrameworkTemplate field by reading input.{field} OR deriving from metaframework-v3-1 §3 by reference; atom shapes per metaframework §2.3–§2.4; custody row per §6 target-framework-specific"` | — |
| **S3** | 3 | 3 | gate-execution | draft template | per-gate results for Identity-axis bundle + overall pass/fail | — | `gates = [PG1, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7]` (this is **E1**) |
| **S4** | 4 | 3 | gate-execution | draft template | per-gate results for Schema-axis bundle + overall | — | `gates = [PG2, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8]` (**E2**) |
| **S5** | 5 | 3 | gate-execution | draft template | per-gate results for Structure-axis bundle + overall | — | `gates = [PG3, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16]` (**E3**) |
| **S6** | 6 | 3 | gate-execution | draft template | per-gate results for Validity-axis bundle + overall | — | `gates = [PG4, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11]` (**E4**) |
| **S7** | 7 | 3 | gate-execution | draft template | per-gate results for Lifecycle-axis bundle + overall | — | `gates = [PG5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11]` (**E5**) |
| **S8** | 8 | 3 | gate-execution | draft template | per-gate results for Coupling-axis bundle + overall | — | `gates = [PG6, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10]` (**E6**) |
| **S9** | 9 | 3 | gate-execution | draft template | per-gate results for Judgment-axis bundle + overall | — | `gates = [PG7, G-J1, G-J2, G-J3, G-J4, G-J5]` (**E7**) |
| **S10** | 10 | 3 | gate-execution | draft template + tier-3/4 input | per-gate results for universal + meta tier + overall | — | `gates = [G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4]` (**E8**) |
| **S11** | 11 | 4 | judgment-input | draft template + E1–E8 gate results | observed template (L0 confirmation-gate input per §5.3) | `judgmentInputRef = J-template-observation` (generation-procedure-local; declared §7.1) | — |
| **S12** | 12 | 5 | mechanical | observed + confirmed template | `GeneratedFrameworkTemplate` emitted; HR5 invoked toward registry with `(frameworkRef, template, authorityClaim)` payload | `derivation = "emit template atom per metaframework §2.2 output schema; invoke HR5 per metaframework §6.2 HR5 contract; registry write is separate atomic operation per substrate §13.4 (IG1–IG5 discipline per registry §8)"` | — |

**E1–E8 shorthand.** Rows S3–S10 are the eight Stage-3 gate-execution P8 instances referenced collectively as E1–E8. E1–E8 partition metaframework's 85 framework-tier gates (post-cycle-2 v3.2.7) exhaustively with no overlap (8+9+17+12+12+11+6+10 = 85 per metaframework §4.1). E2 +G-S7 (8 gates → 9 with G-S8), E4 +G-V11 (11 gates → 12 with G-V10), E5 +G-L11 (11 gates → 12) per cycle-2 cascade. Substrate-tier gates (SG1–SG5) excluded per substrate §11.5 "run once, not per framework" semantics.

**Per-row notes:**

- **S1.** Consumes whatever J-IDs are present in `input.judgment`. The three named here (J-axis-mece, J-axiom-dist, and template-consumer-declared) are the only ones in scope at this v1.0 delivery per phase-9e-spec §1.4. Per MA-J1 judgment-typing: the J-ID set is extensible at template-consumer time; S1 validates presence-of-required + typed-shape-conformance but does not enumerate consumer-specific J-IDs here.

- **S2.** Single mechanical P8 whose derivation is the full template-population pipeline. Sub-step sequencing within S2 is internal to the derivation (axes → axioms → gates → HRs → custody → provenance); sub-steps share `kind = mechanical` and share gate exposure at Stage 3, so per MA-St4 primitive-atomicity they collapse to one P8 instance. Expansion into multiple mechanical P8 steps (one per output field) is an amendment path, not a v1.0 shape.

- **S3–S10 (E1–E8).** Declaration of `gates` reference per substrate §8.3 amended P8 + PG6 amended (ternary `kind = 'gate-execution'` → declared `gates` populated with tested axiom or invariant refs). Per phase-9e-spec Q-cycle-1-2 + substrate §1.3 SI-03 permitted-multi-execution: generation-procedure declares the checkpoint (gates field population); framework-audit invokes execution per v3-1-spec §3.4 F-phase-1-1-69 distribution table. No cross-framework ownership violation.

- **S11.** Judgment observation step. J-template-observation has three mechanical criteria (declared §7.1) per MA-J2 mechanical-criterion ground. L0 confirmation decision is enabled by the observation result but is itself a substrate §13.6 flow event, not a P8 output field.

- **S12.** Terminal P8 is "emit + HR5 invocation" per phase-9e-spec Q-cycle-1-3. Template emission and registry write are two separate atomic operations per substrate §13.4. S12 output completes when HR5 invocation returns — whether registry subsequently commits the write is enforced by registry's IG1–IG5 discipline (framework-registry-v1-0 §8) and is not S12's concern.

### §3.4 Stage monotonicity and kind-alignment self-check

Per substrate §10.2 PR4 (stage monotonicity) and PR5 (stage-content-kind alignment), applied to the twelve-step procedure:

**PR4 — stage monotonicity across order.**

| order | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| stage | 1 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 5 |

Non-decreasing across order. PR4 passes.

**PR5 — stage-content-kind alignment per P8 instance.**

| id | stage | kind | PR5-required kind | aligned |
|---|---|---|---|---|
| S1 | 1 | judgment-input | judgment-input | ✓ |
| S2 | 2 | mechanical | mechanical | ✓ |
| S3 | 3 | gate-execution | gate-execution | ✓ |
| S4 | 3 | gate-execution | gate-execution | ✓ |
| S5 | 3 | gate-execution | gate-execution | ✓ |
| S6 | 3 | gate-execution | gate-execution | ✓ |
| S7 | 3 | gate-execution | gate-execution | ✓ |
| S8 | 3 | gate-execution | gate-execution | ✓ |
| S9 | 3 | gate-execution | gate-execution | ✓ |
| S10 | 3 | gate-execution | gate-execution | ✓ |
| S11 | 4 | judgment-input | judgment-input | ✓ |
| S12 | 5 | mechanical | mechanical | ✓ |

All twelve aligned. PR5 passes.

**PG6 amended (substrate §11.2) — kind-specific field requirement:**

- S1, S11 (kind=judgment-input) → `judgmentInputRef` declared. ✓
- S2, S12 (kind=mechanical) → `derivation` declared. ✓
- S3–S10 (kind=gate-execution) → `gates` populated with tested axiom/invariant refs. ✓

All twelve satisfy PG6 amended.

Self-check applied at declaration time; independent re-verification at framework-audit X10 extended predicate post-9g.

### §3.5 Vocabulary (generation-procedure-local)

Framework-local terms declared inline at point of use per PR1 (substrate §10.2). Substrate and metaframework terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `ProcedureStepInstance` | §3.3 | instantiated P8 per substrate §8.3 amended shape |
| `StageDeclaration` | §3.3 | stage value + set of steps with that stage value (implicit; computed from S1–S12 `stage` fields) |
| `GateReferenceList` | §3.3 row | populated `gates` field at Stage-3 E-step referencing metaframework gate IDs |
| `E1..E8` | §3.3 | Stage-3 gate-execution P8 subset shorthand; each E is one P8 instance with `kind = 'gate-execution'` |
| `J-template-observation` | §7.1 | generation-procedure-local judgment input consumed at S11 |

---

## §4 Validity

### §4.1 Gate declaration

Generation-procedure declares **zero gates**. Gate coverage fully inherited from metaframework-v3-1 §4.1 (90 total gates across tiers post-cycle-2 v3.2.7). Per substrate §1.3 SI-03 permitted-multi-execution: gates are declared once (metaframework) and executed at multiple sites (framework-audit per framework-audit §3 X-dimensions, generation-procedure Stage-3 per E1–E8 reference).

Positive empty-declaration per §3.2 row P5. Basis: `"gates inherited from metaframework-v3-1 §4.1; Stage-3 E1–E8 (S3–S10) reference metaframework gates via populated gates field per substrate §8.3 amended + PG6 amended + substrate §1.3 SI-03"`.

### §4.2 Gate execution coverage

E1–E8 span all 85 framework-tier metaframework gates (post-cycle-2 v3.2.7) per §3.3 table. Coverage verification:

| E-step | axis/tier | gate count | IDs |
|---|---|---|---|
| E1 (S3) | Identity | 8 | PG1, G-I1–G-I7 |
| E2 (S4) | Schema | 9 | PG2, G-S1–G-S8 |
| E3 (S5) | Structure | 17 | PG3, G-St1–G-St16 |
| E4 (S6) | Validity | 12 | PG4, G-V1–G-V11 |
| E5 (S7) | Lifecycle | 12 | PG5, G-L1–G-L11 |
| E6 (S8) | Coupling | 11 | PG6, G-C1–G-C10 |
| E7 (S9) | Judgment | 6 | PG7, G-J1–G-J5 |
| E8 (S10) | Universal + Meta | 10 | G-G13, G-U1–G-U5, G-M1–G-M4 |
| **Total** | | **85** | (matches metaframework §4.7 enumeration of 85 framework-tier gates post-cycle-2) |

Substrate-tier gates (SG1–SG5) excluded per substrate §11.5 "run once, not per framework" semantics. No gate appears in more than one E-step bundle (MECE partition).

Cycle-1 v3.2.4 additions: E2 +G-S7 (Schema-axis additive amendment); E4 +G-V11 (applicability-basis required). Cycle-2 v3.2.7 additions: E2 +G-S8 (ReferentCitation declaration shape conformance, paired with MA-S8); E4 +G-V10 (spec↔referent Categorical alignment, paired with MA-V10); E5 +G-L11 (audit-run snapshot stamping, paired with MA-L11). G-S7 predicate amended in-place to evaluate recursive `≼` per metaframework v3.2.7 §3.2.1 — no E-bundle change for amendment.

### §4.3 Per-step gate execution result shape

At runtime, each Stage-3 E-step produces a result atom of shape:

```
E-step result = {
  stepId: 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9' | 'S10',
  referencedGates: GateId[],        // the gates field content per §3.3 row
  perGateResults: GateResult[],     // one entry per gate in referencedGates
  overallResult: 'pass' | 'fail',
  escalationPath: ref to metaframework §4.5 backward-invalidation rule
}
```

Runtime implementation deferred post-9g (framework-audit first-run ratifies execution semantics). Shape declared only at this delivery.

### §4.4 Current gate results

Not applicable — generation-procedure declares no own gates. Framework-audit results against generation-procedure declared at §8 below.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 → v1.1 → v1.1.1 → v1.1.2 → v1.1.3 → v1.1.4 → v1.1.5 → v1.1.6 → v1.1.7. Additive per MA-L1. v1.1 (Phase 1.2-fix delivery) amendments: §7.1 J-template-observation C1 text precision (nine → eight top-level + validity.overallResult nested) per R-phase-1-2-0040; §8.1 inherited-gate-enumeration replaced with `MetaframeworkGateIdSet` atom reference per R-phase-1-2-0026 + R-phase-1-2-0041. v1.1.1 (Phase 1.2-fix-trail hygiene): §3.3 S2 row "nine top-level" → "eight top-level" (per R-phase-1-2-fix-trail-05, same-class sweep residue as R-phase-1-2-0040); §8.2 framework-audit version-ref `v1-1` → `v1-3` (per R-phase-1-2-fix-trail-04, same-class as F-cycle-1-15 / R-phase-1-2-0047 cascade). Patch-level bump; no structural amendment. v1.1.2 (v3.2.3 cascade): §3.2 P4 inherited-axiom basis 36→64; P5 inherited-gate basis 56→84; §3.3 E1–E7 gates field extended with 28 v3.2.3 axiom-gates (E8 unchanged); §3.3 E1–E8 summary partition arithmetic updated 6+4+6+6+8+7+5+10=52 → 8+7+17+10+11+11+6+10=80; §4.1 inherited-gate basis 56→84; §4.2 paragraph 52→80 + per-E-step counts updated; §5.6 Scale bounds (36 axioms × 56 gates) → (64 × 84); §8 inherited gate count 52→80. v1.1.3 (MF-Cycle-1 Foundation Closure cascade): §3.2 P4 inherited-axiom basis 64→66; P5 inherited-gate basis 84→86; §3.3 E2 Schema bundle +G-S7 (7→8 gates); E4 Validity bundle +G-V11 (10→11 gates); §3.3 partition-arithmetic line restated 80→82 (8+8+17+11+11+11+6+10=82); §4.1 inherited count 84→86; §4.2 per-E-step coverage table updated; §5.6 Scale bounds (64 axioms × 84 gates) → (66 × 86); §8 inherited gate count 80→82. Substrate citations swept S-03 → SI-03 per F-cycle-1-1 cycle-1 rename. v1.1.6 (MF-Cycle-2 Spec↔Referent Alignment Closure cascade): §3.2 P4 inherited-axiom basis 66→69; P5 inherited-gate basis 86→90; §3.3 E2 Schema bundle +G-S8 (8→9 gates); E4 Validity bundle +G-V10 (11→12 gates); E5 Lifecycle bundle +G-L11 (11→12 gates); §3.3 partition-arithmetic line restated 82→85 (8+9+17+12+12+11+6+10=85); §4.1 inherited count 87→90; §4.2 per-E-step coverage table updated; §5.6 Scale bounds (66 axioms × 86 gates) → (69 × 85 framework-tier); §8 inherited gate count 82→85. G-S7 predicate amended in-place per metaframework v3.2.7 §3.2.1 (recursive `≼`); no E-bundle change for the amendment itself. v1.1.7 (Sprint B1 Shot 5 cascade): §2.1 input-field enumeration swept — `adjacentFrameworks` line removed in lockstep with MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup. Patch-level bump; no procedural change (S1–S12 + E1–E8 unchanged); no axiom / gate / J-input amendments. Per MA-L1 additive — no procedural change.

### §5.2 Amendment trigger

Gap-driven or L0-directed. Amendments to the twelve-step procedure — adding/removing steps, rebinding stages, changing gate references at E-steps, expanding S2 into multiple mechanical P8 instances — require:

- Amendment rationale (gap identified OR L0 directive).
- v3-1-spec §1.3 ledger row.
- PR4 + PR5 re-verification post-amendment (mandatory, per substrate §10.2).
- Re-run of G-spec-8 three-pass self-mapping against amended procedure (per v3-1-spec §1.4).
- Registry amendment log entry per framework-registry-v1-0 §2.4.

### §5.3 Confirmation gate

L0 confirms at Phase 9e closure. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation cycle).

S11 is the per-generation confirmation-gate input edge. L0 receives J-template-observation output + E1–E8 gate results via substrate §13 activation flow; decision is substrate §13.6 event, not a P8 output field.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` at delivery.

### §5.5 Judgment deprecations

Empty at delivery. No MA-L5 events. J-axis-mece, J-axiom-dist, J-template-observation all active.

### §5.6 Failure modes, scale bounds, atomicity declarations

Per v3-1-spec §3.3 output-schema `lifecycle` field (V5-verification additions):

**Failure modes:**
- **S1** required J-ID missing from `input.judgment` → fail-at-intake; escalate to L0 per MA-J1.
- **S1** J-input shape violates substrate §6.2 → fail-at-intake; escalate to L0.
- **S2** derivation encounters undeclared or malformed input field → fail-at-derivation; escalate to L0.
- **S3–S10 (E1–E8)** gate failure → apply metaframework §4.5 backward-invalidation rule (tier ordering: tier-4 failure → re-run tier-3; tier-3 failure → re-verify tier-2; tier-1 failure terminal, escalates to L0 per bootstrap restore).
- **S11** L0 withholds confirmation OR L0 unavailable → suspend per substrate §13.6 L0-unavailability response; state persists in registry; resume idempotently on L0 return.
- **S12** HR5 invocation rejected by registry (IG1 AuthorityClaim missing, IG3 FrameworkRef uniqueness violation, IG4 generation-provenance missing, IG5 lifecycle state out-of-enum) → escalate to L0; template not persisted; generation-procedure activation rolls back per substrate §13.4 "atomic with recovery point: pre-emission state in owned framework."

**Scale bounds:** bounded by metaframework-v3-1 atom cardinality (69 axioms × 85 framework-tier gates × 7 HRs × 7 axes post-cycle-2 v3.2.7) and registry write throughput per substrate §13.4. No declared upper bound on input template complexity within these substrate-level bounds.

**Atomicity declarations:** per-step atomicity per substrate §13.4 row "Owned framework execution: interruptible." Each P8 instance (S1–S12) is atomic at step boundary; recovery point on interruption = step `order` value. Recovery procedure: re-enter from failed step's order with upstream state reloaded from registry (registry-lock per substrate §13.5 held across suspension).

### §5.7 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9e delivery | Initial generation-procedure declaration. Twelve P8 steps (S1–S12) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. E1–E8 Stage-3 gate-execution steps reference metaframework gate bundles per axis (E1–E7) + universal/meta tier (E8). S11 consumes J-template-observation (generation-procedure-local). S12 emits `GeneratedFrameworkTemplate` + invokes HR5. HR2 receive-side contract declared with `carrierApplicability = ['self']`. | L0 |
| v1.1.2 | Phase v3.2.3 delivery (2026-04-27) | §3.2 P4 + P5 row basis text count updates (axiom 36→64, gate 56→84). §3.3 E1–E7 gate lists extended for 28 v3.2.3 axiom-gates (S3 +G-I6,G-I7; S4 +G-S4,G-S5,G-S6; S5 +G-St6..G-St16; S6 +G-V6..G-V9; S7 +G-L8,G-L9,G-L10; S8 +G-C7..G-C10; S9 +G-J5); §3.3 partition-arithmetic line restated 52→80; §4.1 inherited count 56→84; §4.2 per-E-step coverage table updated; §5.6 Scale bounds restated; §8 inherited gate count 52→80. v1.1.1 content otherwise preserved verbatim. | L0 |
| v1.1.3 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cluster D-cascade: §3.2 P4 64→66, P5 84→86. §3.3 E2 Schema bundle +G-S7 (Schema-axis additive amendment paired gate); E4 Validity bundle +G-V11 (applicability-basis required paired gate); partition arithmetic restated 80→82 (8+8+17+11+11+11+6+10=82). §4.1 inherited count 84→86; §4.2 per-E-step coverage table updated. §5.6 Scale bounds restated 64→66 axioms, 84→86 gates. §8 inherited gate count 80→82. Cluster E hygiene: §5.7 v1.0 historical row preserved; v1.1 + v1.1.1 historical rows folded into v1.1.2 narrative for cycle-1 sweep per spec §3.16 "v1.0 historical row drift" closure. Cluster A hygiene: substrate §1.3 S-03 → SI-03 swept across all sites (7 occurrences) per F-cycle-1-1 rename. Per MA-L1 additive — no procedural change. v1.1.2 content otherwise preserved verbatim. | L0 |
| v1.1.7 | Sprint B1 Shot 5 (2026-05-13) | §2.1 input-field enumeration sweep: removed `adjacentFrameworks` from "Required input fields relevant to generation-procedure's twelve-step execution" line in lockstep with MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup. Field declared at v3.0 carried zero downstream consumers (no S-step consumes it for output; no gate tests it; no axiom requires it). Patch-level bump; no procedural change (S1–S12 + E1–E8 unchanged); no axiom / gate / J-input amendments — corrective consequential edit per S3 removes-residue clause. v1.1.6 content otherwise preserved verbatim. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot5'} | L0 |

---

## §6 Coupling

### §6.1 Carrier

Generation-procedure carrier = `self`. Emits its own artifact (`GeneratedFrameworkTemplate`) at S12 per HR2 send-side (metaframework side) + HR5 invocation (to registry).

### §6.2 Handoff rules

One framework-local HR instance: **HR2 receive-side**.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| HR2 (receive-side) | metaframework → generation-procedure | `['self']` (per phase-9e-spec Q5: self-only at this delivery; named/none deferred to later frameworks) | true | declared §6.3 |

Per metaframework-v3-1 §6.2 HR2 row: `carrierApplicability = ['self']`. Receive-side contract matches send-side by construction per MA-C3 (handoff-invariant symmetry).

**Other HRs referencing generation-procedure:**

| HR | Owning declaration | Generation-procedure's role |
|---|---|---|
| HR0 | metaframework §6.4 | L0 → metaframework activation; generation-procedure reached indirectly via HR2 dispatch |
| HR1 | metaframework §6.2 | substrate → metaframework type consumption; generation-procedure consumes substrate types by the same receive pattern |
| HR3 | metaframework §6.2 | metaframework → framework-audit; framework-audit reads generation-procedure's P8 declarations for X-dimension evaluation |
| HR4 | metaframework §6.2 | metaframework → amendment-propagation; amendment events involving generation-procedure flow through |
| HR5 | metaframework §6.2 | metaframework → registry; generation-procedure invokes HR5 at S12 (contract declared at metaframework, invoked by generation-procedure per substrate §1.3 SI-03 permitted-multi-execution) |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; generation-procedure produces the generated L3 template at S12 (output contract) |

Per substrate §1.3 SI-03: these HRs are referenced, not declared, by generation-procedure. No redeclaration; no custody conflict.

### §6.3 CaptureShape for HR2 receive-side

Per substrate §8.2 amended P6 shape + metaframework-v3-1 §6.3 HR2 captureShape:

```
captureShape = {
  capturedFields: ['generationRequestId', 'targetTemplateRef', 'inputAtomRef',
                   'timestamp', 'authorityClaim'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance'
}
```

Same capture contract both sides of the HR (send from metaframework, receive at generation-procedure). Matched by construction per MA-C3 handoff-invariant symmetry. No side-specific divergence at this v1.0 delivery.

### §6.4 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `Mode` | substrate | L1 | generation-procedure (via HR1) |
| `AuthorityClaim` | substrate | L1 | generation-procedure (S1 validation, S12 emission) |
| `Stage` | substrate | L1 | generation-procedure (all P8 instances) |
| `StageContentKind` | substrate | L1 | generation-procedure (PR5 self-check) |
| `CaptureShape` | substrate | L1 | generation-procedure (HR2 receive-side §6.3) |
| `FrameworkRef` | substrate | L1 | generation-procedure (S12 emission payload) |
| `WAtom` | substrate | L1 | generation-procedure (via HR1) |
| `AxiomRef` | substrate | L1 | generation-procedure (E1–E8 gate reference field) |
| `Judgment` | substrate | L1 | generation-procedure (S1 J-input validation, S11 J-template-observation) |
| `JudgmentId` | substrate | L1 | generation-procedure (S1 J-input keying) |
| `Semver` | substrate | L1 | generation-procedure (S12 emission payload) |
| `MetaframeworkInput` | metaframework | L2 | generation-procedure (via HR2, consumed at S1) |
| `GeneratedFrameworkTemplate` | metaframework | L2 | generation-procedure (emits at S12); registry (via HR5); generated L3 frameworks (via HR6) |
| `ProcedureStepInstance` | generation-procedure | L2 | framework-audit (via HR3) |
| `StageDeclaration` | generation-procedure | L2 | framework-audit (via HR3, X10 stage-declaration check) |
| `GateReferenceList` | generation-procedure | L2 | framework-audit (via HR3, E-step coverage verification) |
| `J-template-observation` | generation-procedure | L2 | generation-procedure S11 only (no cross-framework consumption) |

Substrate and metaframework atoms consumed by reference; generation-procedure-declared atoms (bottom four rows) produced here and consumed by framework-audit via HR3.

### §6.5 Provenance contract

Per MA-C5 + R-phase-1-1-resolution-20 reference-default declaration: every emitted `GeneratedFrameworkTemplate` at S12 populates the output schema's `provenance` field with:

- `generatedByMetaframework: metaframework-v3-1` (FrameworkRef)
- `generationProcedureRef: generation-procedure-v1-0` (FrameworkRef)
- `generationTimestamp: <S12 invocation timestamp>`
- `sourceInputRef: AtomRef` pointing to registry-archived `MetaframeworkInput` (reference-default per R-phase-1-1-resolution-20)
- `sourceInputValue?: MetaframeworkInput` — populated only if by-value opt-in flag is set in `input.provenance`

Reference-default reduces per-framework propagation cost from O(N) to O(1) per v3-1-spec §3.3 R-phase-1-1-resolution-20.

### §6.6 OperatorInterface

Generation-procedure operator-facing surface (per V5 verification, metaframework §6.8 pattern):

- **Invocation entry:** via HR2 receive-side. Not directly invocable by L0; L0 activates metaframework (HR0), metaframework dispatches to generation-procedure per Mode=generative.
- **Output emission:** via S12 HR5 invocation toward registry.
- **Audit query:** via HR3 path; framework-audit reads generation-procedure's P8 declarations for X-dimension evaluation.

Runtime implementation deferred post-9g. Declarations only at this delivery.

### §6.7 Coupling axioms satisfaction

All six MA-C axioms satisfied at handoff tier per metaframework-v3-1 §3.2 (by inheritance) + §3.5 (Coupling axis axioms). Generation-procedure's specific satisfactions:

- **MA-C1** (carrier declared) — §6.1 declares carrier=self.
- **MA-C2** (custody complete) — §6.4 enumerates every atom.
- **MA-C3** (handoff-invariant symmetry) — HR2 receive-side matches metaframework §6.2 HR2 send-side by construction.
- **MA-C4** (provenance populated) — §6.5 declares.
- **MA-C5** (provenance contract) — §6.5 declares.
- **MA-C6** (carrier-applicability enforced) — HR2 applicability `['self']` matches generation-procedure's own carrier=self.

---

## §7 Judgment

### §7.1 J-template-observation

Generation-procedure-local judgment input. Consumed at S11.

```
J-template-observation:
  kind: observation
  consumedBy: generation-procedure-v1-0 §3.3 S11
  shape: Judgment per substrate §6.2
  input: {
    draftTemplate: GeneratedFrameworkTemplate,  // post-S2, pre-emission
    gateResults: E-step result[]                // post-S3..S10 E1..E8 outputs
  }
  criteria:
    C1: Draft template populates eight top-level fields per v3-1-spec §3.3
        output schema (identity, schema, structure, validity, lifecycle,
        coupling, judgment, provenance) + validity.overallResult nested check.
        Mechanical: field-presence enumeration check.
    C2: E1–E8 gate results all overallResult = 'pass'.
        Mechanical: aggregation over perGateResults[] per E-step; combined AND.
    C3: No escalation raised during S2–S10 execution log.
        Mechanical: escalation-log inspection; escalation count = 0.
  provenance:
    instanceId: <runtime per invocation>
    cycleId: <runtime per invocation>
    timestamp: <runtime>
    consumingFrameworkRef: generation-procedure-v1-0
    consumingStepId: S11
```

All three criteria mechanical per substrate §6.3 mechanical-criterion ground classes (enumeration, aggregation, log inspection — three of the six ground classes declared at substrate §6.3). Per MA-J2 mechanical-criterion ground: J-template-observation is a fully-typed judgment input; consumer responsibility is to execute the three criteria and surface the aggregated observation result for L0 confirmation decision at §5.3.

### §7.2 Metaframework-declared J-inputs consumed at S1

Per MA-J1 judgment-typing: J-axis-mece and J-axiom-dist are consumed at S1 but declared at metaframework-v3-1 §7.1 and §7.2. Not redeclared here per R-phase-1-1-resolution-08 single-source-via-reference. S1 validates their presence-of-required + typed-shape-conformance per substrate §6.2 Judgment shape.

Template-consumer-declared additional J-inputs (if any) consumed at S1 follow the same typing discipline but are declared at consumer-framework site per MA-J1, not at generation-procedure.

### §7.3 Axis status

Populated (not empty). One generation-procedure-local J-input declared (J-template-observation) + two consumed-by-reference from metaframework. Empty-declaration rule (substrate §8.6) does not apply.

### §7.4 Judgment provenance

J-template-observation provenance populated per invocation at runtime. Phase 9e delivery-time declaration provenance: L0 confirmation at Phase 9e closure (matching pattern of metaframework §7.4).

MA-J4 provenance-completeness satisfied: every judgment consumption at S1 and S11 produces a provenance record with instanceId + cycleId + timestamp + consumingFrameworkRef + consumingStepId.

---

## §8 Self-audit results

### §8.1 Gate results

**Generation-procedure declares no own gates.** Framework-tier gates inherited from metaframework-v3-1 §4.1 per `MetaframeworkGateIdSet` derived from substrate §4 A-15 (85 framework-tier gates post-cycle-2 v3.2.7). State = `not-yet-run` for framework-audit first-run against generation-procedure, post-9g per phase-9e-spec §4.3.2 deferrals; cycle-2-added gates G-V10 + G-S8 + G-L11 first-run scheduled at first system-wide audit cycle post-cycle-2 ratification per metaframework §5.X first-run-execution lifecycle event.

Inherited gate ID set consumed by reference as `MetaframeworkGateIdSet` — see metaframework §4.7 for canonical enumeration + §6.5 for atom declaration. Enumeration no longer restated here per R-phase-1-2-0026 + R-phase-1-2-0041 resolution (single-source via reference, R-phase-1-1-resolution-08).

### §8.2 Dimension audit results

All 10 framework-audit dimensions (X1–X10) against generation-procedure: state = `pending-first-run`. Uniform state; compact summary per sprint-mode Q-cycle-1-4.

Dimension ID enumeration: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-3 §3.3.

**X10 extended predicate relevance.** Phase 1.2 extended X10 with three bullets (stage declaration per substrate §8.3, PR4 monotonicity, PR5 kind alignment). X10 applies directly to generation-procedure's twelve P8 instances. Self-check already applied at §3.4 above (all twelve pass); framework-audit first-run verifies independently.

**X3 extended criterion C5 relevance.** Phase 1.2 extended X3 with C5 (captureShape required per P6 instance with diagnosticSignificance=true). Generation-procedure declares one HR (HR2 receive-side) with diagnosticSignificance=true and populated captureShape at §6.3; self-check declares pass for C5.

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application) at metaframework-v3-1 §4.3: framework-audit runs X1–X10 against generation-procedure post-9g. At Phase 9e delivery, self-audit is a declared-placeholder state. No dimension has evaluated independently; §3.4 stage/kind self-check and §8.2 X10/X3 self-checks are author-side pre-verifications, not framework-audit first-run execution.

First framework-audit first-run post-9g ratifies initial state.

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9e delivery | Initial generation-procedure declaration. Twelve P8 steps (S1–S12) distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. E1–E8 Stage-3 gate-execution steps reference metaframework gate bundles per axis (E1 Identity, E2 Schema, E3 Structure, E4 Validity, E5 Lifecycle, E6 Coupling, E7 Judgment) + tier-3/4 universal+meta (E8), covering all 52 metaframework framework-tier gates with MECE partition. S11 consumes J-template-observation (generation-procedure-local, three mechanical criteria per substrate §6.3 ground). S12 emits `GeneratedFrameworkTemplate` + invokes HR5; registry performs write separately per IG1–IG5. HR2 receive-side contract declared with `carrierApplicability = ['self']`; captureShape matched to metaframework-v3-1 §6.3 HR2 by construction per MA-C3. | L0 |
| v1.1 | Phase 1.2-fix delivery | §7.1 J-template-observation C1 text precision (eight top-level fields + validity.overallResult nested, per R-phase-1-2-0040). §8.1 inherited-gate-enumeration replaced with `MetaframeworkGateIdSet` atom reference (per R-phase-1-2-0026 + R-phase-1-2-0041; single-source via R-phase-1-1-resolution-08). §1 Identity: scopeOut row added per R-phase-1-2-0042. v1.0 content otherwise preserved verbatim. | L0 |
| v1.1.1 | Phase 1.2-fix-trail hygiene delivery | §3.3 S2 row "nine top-level" → "eight top-level" (per R-phase-1-2-fix-trail-05, same-class sweep residue as R-phase-1-2-0040 §7.1 C1 fix). §8.2 Dimension ID enumeration reference `per framework-audit-v1-1 §3.3` → `per framework-audit-v1-3 §3.3` (per R-phase-1-2-fix-trail-04, same-class as R-phase-1-2-0047 version-ref drift missed by KA-GATE1-1 cascade). Patch-level bump; no structural amendment. | L0 |
| v1.1.2 | Phase v3.2.3 delivery (2026-04-27) | §3.2 P4 inherited-axiom basis 36→64; P5 inherited-gate basis 56→84. §3.3 E1–E7 gates field extended with 28 v3.2.3 axiom-gates (E8 unchanged); §3.3 E1–E8 partition arithmetic restated 6+4+6+6+8+7+5+10=52 → 8+7+17+10+11+11+6+10=80. §4.1 inherited count 56→84. §4.2 paragraph 52→80; §4.2 per-E-step coverage table updated (E1: 6→8, E2: 4→7, E3: 6→17, E4: 6→10, E5: 8→11, E6: 7→11, E7: 5→6; total 52→80). §5.6 Scale bounds (36 axioms × 56 gates) → (64 × 84). §8 inherited gate count 52→80. v1.1.1 content otherwise preserved verbatim. Per MA-S5 cross-file restatement consistency. | L0 |
| v1.1.3 | MF-Cycle-1 Foundation Closure (2026-04-29) | Cycle-1 cascade (no procedural change; count restatements only per MA-S5 cross-file restatement consistency, the very axiom MA-S7 added this cycle authorizes additivity). §3.2 P4 inherited-axiom basis 64→66; P5 inherited-gate basis 84→86. §3.3 E2 Schema bundle +G-S7 (Schema-axis additive amendment paired gate per metaframework v3.2.4 F-cycle-1-2/Q-cycle-1-2); E4 Validity bundle +G-V11 (applicability-basis required paired gate per F-cycle-1-8); §3.3 partition arithmetic restated 80→82 (8+8+17+11+11+11+6+10=82). §4.1 inherited count 84→86; §4.2 paragraph 80→82; §4.2 per-E-step coverage table updated (E2: 7→8, E4: 10→11; total 80→82). §5.6 Scale bounds (64 axioms × 84 gates) → (66 × 86). §8 inherited gate count 80→82. Cluster A hygiene: substrate §1.3 S-03 → SI-03 swept (7 occurrences) per F-cycle-1-1 rename. v1.1.2 content otherwise preserved verbatim. | L0 |
| v1.1.4 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29; row added at cycle-1.6 — closes cycle-1.5 §9 self-amendment gap) | Substrate v1.3 → v1.4 cascade. Identifier sweep applied across §1–§9 body: every multi-locus identifier in canonical S6 form per substrate §1.5. No procedural change (S1–S12 + E1–E8 unchanged); no axiom / J-input amendments — corrective patch-level to cycle-1 v1.1.3. v1.1.3 content otherwise preserved verbatim. | L0 |
| v1.1.5 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | Substrate v1.4 → v1.5 cascade. §4.1 stale total "86 total gates across tiers post-cycle-1 v3.2.4" updated to "87 total gates across tiers post-cycle-1.5 v3.2.5" per cycle-1.6 cascade closure (cycle-1.5 omission). §3.3 + §4.2 "Substrate-tier gates (SG1–SG4) excluded" → "(SG1–SG5) excluded" (2 sites). Identifier-sweep companion: 9 generation-procedure body sites swept per substrate §1.5 amended (Phase 1.1 references reclassified — atom shape A-NN bare, finding F-phase-1-1-A-NN kept, resolution R-phase-1-1-resolution-NN). No procedural change; no axiom / gate / J-input amendments — corrective-cycle scope. v1.1.4 content otherwise preserved verbatim. | L0 |
| v1.1.6 | MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30) | Cycle-2 cascade (no procedural change; count restatements only per MA-S5 cross-file restatement consistency). §3.2 P4 inherited-axiom basis 66→69; P5 inherited-gate basis 86→90 (85 framework-tier + 5 substrate). §3.3 E2 Schema bundle +G-S8 (ReferentCitation declaration shape conformance, paired with MA-S8 per metaframework v3.2.7 §3.2.1; 8→9 gates); E4 Validity bundle +G-V10 (spec↔referent Categorical alignment, paired with MA-V10; 11→12 gates); E5 Lifecycle bundle +G-L11 (audit-run snapshot stamping, paired with MA-L11; 11→12 gates); §3.3 partition arithmetic restated 82→85 (8+9+17+12+12+11+6+10=85). G-S7 predicate amended in-place per metaframework v3.2.7 §3.2.1 (recursive `≼`); no E-bundle change for the amendment itself. §4.1 inherited total restated 87→90; §4.2 paragraph 82→85; §4.2 per-E-step coverage table updated (E2: 8→9, E4: 11→12, E5: 11→12; total 82→85). §5.6 Scale bounds (66 axioms × 86 gates) → (69 × 85 framework-tier). §8 inherited gate count 82→85. All amendments additive per MA-L1 + MA-S7 (recursive scope per metaframework v3.2.7 §3.2.1). v1.1.5 content otherwise preserved verbatim. | L0 |
| v1.1.7 | Sprint B1 Shot 5 — input-enumeration sweep (2026-05-13) | §2.1 input-field enumeration: `adjacentFrameworks` removed from "Required input fields" line in lockstep with MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup. The field carried zero downstream consumers (no S-step consumed it for output; no gate tested it; no axiom required it). Patch-level bump per consequential-edit convention; no procedural change (S1–S12 + E1–E8 unchanged); no axiom / gate / J-input amendments — corrective consequential edit per S3 removes-residue clause. v1.1.6 content otherwise preserved verbatim. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot5'} | L0 |

---

## End of generation-procedure-v1-0
