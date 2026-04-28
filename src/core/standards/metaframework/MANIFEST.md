# v3.2.5 metaframework system — CANONICAL AT DECLARATION-TIER

**Packaged:** 2026-04-28
**Status:** v3.2.5 canonical at declaration-tier. MF-amendment-1 cycle landed (substrate-touching amendment; P8 mode-restriction lifted).
**Authority:** L0 (MF-amendment-1 sprint close, atop MF-patch-1 + v3.2.3 confirmation).
**Predecessor state:** v3.2.4 canonical at declaration-tier (2026-04-28; MF-patch-1).
**Cycle scope:** MF-amendment-1 — substrate-touching amendment cycle (two-shot sprint). Substrate v1.2 → v1.3: P8 mode-restriction lifted (mode-binding restated, primitive count restated, P8 declaration restated to own-procedure criterion per MA-G13, non-generative basis prose restated, consumer registry P8 row enumerates all three P8-bearing frameworks). Framework-audit v1.3.3 → v1.4: new §3.3 declares five-step audit-cycle procedure (P0–P4); existing §3.x renumbered +1; P7 own count 7 → 9 (J-audit-request-validation + J-audit-outcome-review added at §7.10/§7.11); P8 own count 0 → 5 (replaces prior verificative-mode-no-P8 basis text); 28-edit internal §3.x reference sweep with frozen-row exclusions. Metaframework v3.2.4 → v3.2.5: 7-site vocab + custody restatement (P8 row delegated → 0-with-basis; ProcedureStepInstance vocab restated; Stage/StageContentKind custody rows generative-mode → P8-bearing; cascade pointers framework-audit §3.3 → §3.4). AP v1.2.1 → v1.2.2 + gen-proc v1.1.3 → v1.1.4: cascade pointer updates (each 1 substantive site after D1 disposition; spec misidentified self-§3.4 references in both files at MF-amendment-1 spec §4.5/§4.6 — logged as F-MFA1-AP-001 + F-MFA1-GP-001 for next-cycle hygiene). Spec v3.2.4 → v3.2.5: Shot 1 §4.4 placement convention amendment + Shot 2 4-site cascade pointer updates + §5.9 closure record + Status block restated. Closes F-MFA2-META-002 + F-1.2-01 (verificative-mode closure extension). No new axioms / gates / HRs declared. Counts unchanged: axiom 64; framework-tier gate 80; HR 7; mode enum 4. Substrate v1.3 → v1.4 framework-audit minor; v3.2.4 → v3.2.5 metaframework patch; v1.2.1 → v1.2.2 AP patch; v1.1.3 → v1.1.4 gen-proc patch; v3.2.4 → v3.2.5 spec minor.

---

## Contents

### `frameworks/` — 6 canonical files

| # | File (filename slug per L0 Q3) | Internal version | Kind | Post-MF-amendment-1 state |
|---|---|---|---|---|
| 1 | `substrate-v1-1.md` | v1.3 | non-framework (substrate) | **substantive cycle edits (5 sites + §16 v1.3 row):** §2.4 Mode-binding restated (mode does not gate P8 declaration); §8.1 primitive count restated (P8 conditional on own-procedure declaration, mode-agnostic); §8.3 P8 declaration restated with own-procedure criterion per MA-G13; §8.3 non-generative basis prose restated (frameworks without own procedure declare P8 = 0 with positive empty basis per §8.6); §12 consumer registry P8 row enumerates gen-proc (S1–S12), AP (AP1–AP7), framework-audit (P0–P4). Substrate md5 ENTRY `284faa137fef3b48aa2a3817b1d4d6a4` → EXIT logged in delivery report (md5 changes per §4.9 substrate-amendment-cycle expectation). |
| 2 | `framework-registry-v1-0.md` | v1.0 | non-framework (state store) | unchanged (no L3 entries written this cycle; L3 bootstrap-write deferred to separate cycle per F-MFA-C8-001) |
| 3 | `metaframework-v3-1.md` | v3.2.5 | framework (axiomatic-tier, L2) | **vocab + custody restatement (7 sites):** §3.4 P8 row `delegated` → `0 with basis` (metaframework reclassified from generative to axiomatic-tier; own discipline composes into gen-proc per HR2; positive empty basis per substrate §8.6); §3.5 ProcedureStepInstance vocab restated (substrate §8.3 P8 shape; declared at gen-proc/AP/framework-audit §3.3); §3.5 DimensionResult vocab framework-audit §3.3 → §3.4; §6.5 Stage and StageContentKind custody rows generative-mode → P8-bearing frameworks; §6.5 ProcedureStepInstance custody row restated (substrate-shape with multi-framework consumers); §3.3 MA-L6 scope clarification framework-audit §3.3 → §3.4 X10 extended predicate; §3.3 G-U5 co-execution semantics framework-audit §3.3 → §3.4 (X2/X3 dimension slice; AP self-§3.3 reference preserved); §8.2 Dimension ID enumeration framework-audit-v1-3 → framework-audit-v1-4 §3.3 → §3.4. Header version + §1 Identity Version row + §5.6 v3.2.5 row. |
| 4 | `generation-procedure-v1-0.md` | v1.1.4 | framework (generative, L2) | **cascade pointer update (1 site, D1-adjusted):** §8.2 Dimension ID enumeration `framework-audit-v1-3.3 §3.3` → `framework-audit-v1-4 §3.4` (version-ref bump + section bump). Spec §4.6 row line 508 misidentified gen-proc self-§3.4 reference as framework-audit's §3.4 — preserved untouched per D1 disposition; logged as F-MFA1-GP-001. Header version + §1 Identity Version row + §5.7 v1.1.4 row + §9 changelog row. |
| 5 | `framework-audit-v1-2.md` | v1.4 | framework (verificative, L2) | **substantive cycle edits (primary substantive):** New §3.3 declares five-step audit-cycle procedure (P0–P4) per substrate §8.3 P8 shape (P0 judgment-input → P1 mechanical → P2 gate-execution → P3 judgment-input → P4 mechanical; PR4 stage-monotonicity + PR5 stage-content-kind alignment satisfied per inline self-check). Sections §3.3–§3.7 renumbered +1: dimension declarations §3.3 → §3.4; per-dimension relationship table §3.4 → §3.5; dimension-set as judgment input §3.5 → §3.6; primitive instances §3.6 → §3.7; vocabulary §3.7 → §3.8. §3.7 P7 own count 7 → 9 (J-audit-request-validation consumed at P0 + J-audit-outcome-review consumed at P3). §3.7 P8 own count 0 → 5 (replaces prior verificative-mode-no-P8 basis text with full P0–P4 declaration). §7.10 + §7.11 J-input declarations added (mechanical C1–C3 + criteria-bounded C4 per MA-J2). 28-edit internal §3.x reference sweep: live §3.3 → §3.4 (25 sites), §3.5 → §3.6 (4 sites), §3.6 → §3.7 (2 sites); frozen rows preserved (§5.11 v1-0/v1-1/v1-2/v1-3/v1.3.1/v1.3.2/v1.3.3 transition log; §9 prior changelog rows); generic predicate prose preserved (G-S4 vocabulary template, G-St cardinality template, G-St16 P7-membership prose); external references preserved (spec §3.3/§3.4, metaframework §3.2/§3.5). Header version + §1 Identity Version row + §5.11 v1.4 row + §9 v1.4 changelog row. Closes F-MFA2-META-002 + extends F-1.2-01 closure to verificative mode. |
| 6 | `amendment-propagation-v1-0.md` | v1.2.2 | framework (structural, L2) | **cascade pointer update (1 site, D1-adjusted):** §8.2 Dimension IDs enumerated `framework-audit-v1-2 §3.3` → `framework-audit-v1-4 §3.4`. Spec §4.5 row line 630 misidentified AP self-§3.4 reference as framework-audit's §3.4 — preserved untouched per D1 disposition; logged as F-MFA1-AP-001. Header version + §1 Identity Version row + §5.10 v1.2.2 row + §9 changelog row. |

### `spec/`

- `v3-1-spec.md` — v3.2.5. Governing spec. **Shot 1:** §4.4 placement convention amendment (3 per-file summary restatements at lines 646/647/648 + new procedure-declaration placement convention paragraph after registry bullet; declares §3.3 as procedure-declaration locus regardless of mode). §1.3 Checkpoint ledger Shot 1 row appended. New §5.9 cycle-entry section authored (Shot 1 with open findings; Shot 2 extends with closure record). Header version v3.2.4 → v3.2.5 (line 4 only at Shot 1; lines 1/3/7 frozen Shot-2-territory per R-a). **Shot 2:** Lines 1/3/7 finalized to MF-amendment-1 sprint-close framing; line 272 + 833 + 834 + 1011 cascade pointers framework-audit §3.3 → §3.4 (line 1002 frozen historical per spec §4.7); §1.3 Shot 2 row appended; §5.9 extended with sprint-close closure record (F-MFA2-META-002 + F-1.2-01 closed; F-MFA1-AP-001 + F-MFA1-GP-001 logged for next cycle); end-of-spec Status / On-confirmation / On-auditor-sprint-close-run blocks restated to cycle-close canonical state.

### `reports/` — cumulative delivery reports

| Phase | Report |
|---|---|
| 1.2-fix-trail hygiene (prior) | phase-1-2-fix-trail-hygiene-delivery-report.md |
| 9h Work Item 1 | phase-9h-G-U1-first-run-report.md |
| 9h Work Item 2 | phase-9h-cross-file-consistency-report.md |
| 9h Work Item 3 | phase-9h-ap-self-recursion-report.md |
| 9h terminal | phase-9h-terminal-delivery-report.md |
| v3.2.3 delivery | v3-2-3-delivery-report.md |
| MF-audit-1 | MF-audit-1-report.md (staged at /mnt/user-data/outputs/) |
| MF-patch-1 (prior) | MF-patch-1-delivery-report.md |
| **MF-amendment-1 (this cycle)** | MF-amendment-1-delivery-report.md (Shot 1 + Shot 2; auditor sprint-close run pending) |

Earlier phase reports (1.2, 9c, 9d, 9e, 9f, 9g, 1.2-fix) present in prior-cycle packages; not re-bundled here.

---

## Phase history

| Phase | Delivery | Key outputs |
|---|---|---|
| 1.2 | initial substrate + metaframework draft | v1.1 substrate, v3.1 metaframework, v3.1 spec |
| 9c | registry | v1.0 registry |
| 9d | metaframework | v3.1 metaframework populated |
| 9e | generation-procedure | v1.0 gen-procedure |
| 9f | framework-audit | v1.2 framework-audit |
| 9g | amendment-propagation | v1.0 amendment-propagation; 6-file set complete (declaration-tier) |
| 1.2-fix | anchor-cascade audit resolution | 31 edits across 7 briefs; substrate→v1.2, metaframework→v3.2, framework-audit→v1.3, gen-procedure→v1.1, amendment-propagation→v1.1, spec→v3.2 |
| 1.2-fix-trail hygiene | v2 re-audit residue closure | 5 edits + 1 Q3 attestation; metaframework→v3.2.1, framework-audit→v1.3.1, gen-procedure→v1.1.1, spec→v3.2.1 |
| 9h (terminal exec) | terminal cross-file gate | G-U1 first-run ✓ + CFC-1..4 ✓ + AP self-recursion ✓ + registry bootstrap write ✓; canonical at execution-tier |
| v3.2.3 | declaration-tier additive cycle | 28 axioms + 28 gates + 4 J-inputs + 1 GR-series; metaframework→v3.2.3, framework-audit→v1.3.2, gen-procedure→v1.1.2, amendment-propagation→v1.2, spec→v3.2.3 |
| MF-audit-1 | first-run audit of v3.2.3 against L3 frameworks (Path B partial cycle, 4 frameworks) | 12 findings (0 Kind A, 6 Kind B, 6 Kind C, 2 Decision-D); zero hard failures; substrate md5 held; report at MF-audit-1-report.md |
| MF-patch-1 (prior) | surgical fix cycle — predicate refinement + missing-row addition | closes 4 MF-audit-1 findings (F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007, F-MFA-F9-008); metaframework→v3.2.4, framework-audit→v1.3.3, gen-procedure→v1.1.3, amendment-propagation→v1.2.1, spec→v3.2.4 |
| **MF-amendment-1 (this cycle)** | **substrate-touching amendment (two-shot sprint) — P8 mode-restriction lifted; audit-cycle procedure declared** | **closes F-MFA2-META-002 (Pattern A citation gap) + F-1.2-01 closure extension to verificative mode; substrate→v1.3, metaframework→v3.2.5, framework-audit→v1.4 (P0–P4 audit-cycle procedure at new §3.3 + §3.4–§3.8 renumber + P7 7→9 + P8 0→5 + §7.10/§7.11), gen-procedure→v1.1.4, amendment-propagation→v1.2.2, spec→v3.2.5; opens F-MFA1-AP-001 + F-MFA1-GP-001 for next cycle (D1 disposition: spec misidentified self-§3.4 references in AP and gen-proc)** |

---

## What changed in MF-amendment-1

**Cycle inputs (frozen at entry; non-substrate frozen invariants hold ENTRY = EXIT):**
- Substrate v1.2 — md5 ENTRY `284faa137fef3b48aa2a3817b1d4d6a4` (substrate IS edit-target this cycle; md5 EXIT logged in delivery report — different from ENTRY per §4.9 substrate-amendment-cycle expectation).
- Axes A1–A7 — frozen, no axis added/removed.
- AxR1–AxR3, MA-S5, MA-L1 — frozen, no rule changes.
- 64 axioms — frozen, no axiom added/removed (MA-G13 own-discipline criterion exists pre-cycle and is referenced; not amended).
- 80 framework-tier gates — frozen, no gate added/removed.
- 7 HRs — frozen, no HR added/removed.
- 4 modes (epistemic / structural / generative / verificative) — frozen, mode enum unchanged.
- L3 frameworks (artifact-standard, plan-standard, multi-instance-standard, living-memory) — untouched.

**Substantive cycle edits (substrate + framework-audit primary; cascade pointer updates elsewhere):**

| File | Site / Category | Edit |
|---|---|---|
| substrate-v1-1.md | §2.4 Mode-binding | "Every procedure step in a generative-mode framework operates under the framework's declared Mode" → "Every procedure step (P8 instance) operates under the framework's declared Mode. Mode does not restrict P8 declaration; mode classifies the framework's transformation kind." |
| substrate-v1-1.md | §8.1 Primitive count | "Seven universal + one conditional (Mode = generative)" → "Seven universal + one conditional (P8 conditional on framework declaring own procedure; mode-agnostic)" |
| substrate-v1-1.md | §8.3 P8 declaration | "**P8 — Procedure step.** Mode = generative only." → P8 declaration restated with own-procedure criterion per MA-G13: generative + structural + verificative all declare P8 when own discipline is ordered procedure; frameworks without own procedure (axiomatic-tier or state-store) declare P8 = 0 with positive empty basis per §8.6 |
| substrate-v1-1.md | §8.3 non-generative basis | "Non-generative frameworks have no P8 instances. P8 is absent, not empty." → "Frameworks with no own procedure declare P8 = 0 with positive empty basis per §8.6 (e.g., metaframework declares zero P8 instances; its discipline composes into generation-procedure's P8 set). Frameworks with own procedure declare P8 instances per their procedure shape, regardless of mode." |
| substrate-v1-1.md | §12 Consumer registry P8 row | "generation-procedure, any generative-mode framework" → "generation-procedure (S1–S12), amendment-propagation (AP1–AP7), framework-audit (P0–P4)" |
| substrate-v1-1.md | §16 v1.3 row | New version-history sub-entry mirroring v1.2 shape; records all 5 site amendments above. |
| framework-audit-v1-2.md | New §3.3 audit-cycle procedure | Five P8 instances declared (P0 judgment-input → P1 mechanical → P2 gate-execution → P3 judgment-input → P4 mechanical) distributed across substrate §8.3 Stages 1–5; per-step notes + E-step shorthand + stage-monotonicity-and-kind-alignment self-check (PR4 + PR5 satisfied). |
| framework-audit-v1-2.md | §3.x renumber | Existing §3.3 → §3.4 (dimension declarations); §3.4 → §3.5 (per-dimension relationship table); §3.5 → §3.6 (dimension-set as judgment input); §3.6 → §3.7 (primitive instances); §3.7 → §3.8 (vocabulary). |
| framework-audit-v1-2.md | §3.7 P7 + P8 row updates | P7 own count 7 → 9 (J-audit-request-validation + J-audit-outcome-review added); P8 own count 0 → 5 (full P0–P4 declaration replaces prior verificative-mode-no-P8 basis text). |
| framework-audit-v1-2.md | §7.10 + §7.11 J-input declarations | J-audit-request-validation (consumed at P0, mechanical C1–C3 + criteria-bounded C4 per MA-J2) + J-audit-outcome-review (consumed at P3, mechanical C1–C3 + criteria-bounded C4 per MA-J2). |
| framework-audit-v1-2.md | 28-edit internal §3.x ref sweep | Live §3.3 → §3.4 (25 sites); live §3.5 → §3.6 (4 sites); live §3.6 → §3.7 (2 sites). Frozen rows preserved (§5.11 v1-0/v1-1/v1-2/v1-3/v1.3.1/v1.3.2/v1.3.3 transition log; §9 prior changelog rows). Generic predicate prose preserved (G-S4 vocabulary template, G-St cardinality template, G-St16 P7-membership prose, mechanical-test-variant prose). External references preserved (spec §3.3/§3.4, metaframework §3.2/§3.5). |
| metaframework-v3-1.md | §3.4 P8 row | "delegated" → "0 with basis" (metaframework reclassified from generative to axiomatic-tier; own discipline composes into gen-proc's P8 set per HR2 dispatch; positive empty basis per substrate §8.6). |
| metaframework-v3-1.md | §3.5 ProcedureStepInstance vocab | "instantiated P8 (delegated to generation-procedure)" → "instantiated P8 (per substrate §8.3; declared at gen-proc §3.3, AP §3.3, framework-audit §3.3)". |
| metaframework-v3-1.md | §3.5 DimensionResult vocab | framework-audit §3.3 → §3.4 (post-renumber dimension declarations). |
| metaframework-v3-1.md | §6.5 custody table | Stage and StageContentKind rows generative-mode → P8-bearing frameworks; ProcedureStepInstance row restated from generation-procedure-delegated to substrate-shape with multi-framework consumers. |
| metaframework-v3-1.md | §3.3 cascade pointers | MA-L6 scope clarification framework-audit §3.3 → §3.4 X10; G-U5 co-execution semantics framework-audit §3.3 → §3.4 X2/X3 (AP self-§3.3 reference preserved); §8.2 Dimension ID enumeration framework-audit-v1-3 → framework-audit-v1-4 §3.3 → §3.4. |
| amendment-propagation-v1-0.md | §8.2 cascade pointer (D1-adjusted) | Dimension IDs `framework-audit-v1-2 §3.3` → `framework-audit-v1-4 §3.4`. Spec §4.5 row line 630 misidentified AP self-§3.4 reference; preserved untouched (F-MFA1-AP-001 logged for next cycle). |
| generation-procedure-v1-0.md | §8.2 cascade pointer (D1-adjusted) | Dimension IDs `framework-audit-v1-3.3 §3.3` → `framework-audit-v1-4 §3.4`. Spec §4.6 row line 508 misidentified gen-proc self-§3.4 reference; preserved untouched (F-MFA1-GP-001 logged for next cycle). |
| v3-1-spec.md | Shot 1 — §4.4 placement convention | Lines 646/647/648 per-file content summaries restated to drop generative-only P8 implication; new procedure-declaration placement convention paragraph inserted (declares §3.3 as procedure-declaration locus regardless of mode); §1.3 ledger Shot 1 row appended; new §5.9 cycle-entry section authored; line 4 header version v3.2.4 → v3.2.5 (lines 1/3/7 + Status block frozen Shot-2-territory per R-a). |
| v3-1-spec.md | Shot 2 — sprint close cascade | Lines 1/3/7 finalized; lines 272/833/834/1011 cascade pointers framework-audit §3.3 → §3.4 (line 1002 frozen historical per spec §4.7); §1.3 Shot 2 row appended; §5.9 extended with sprint-close closure record; end-of-spec Status / On-confirmation / On-auditor-sprint-close-run blocks restated to cycle-close canonical state. |
| MANIFEST.md | this file | Header + Contents version table + Phase history + Reports table + this section + Filename discipline + Canonical attestation all updated to MF-amendment-1 post-state. |

**Counts (post-cycle):**
- Axiom count: **64** (unchanged from MF-patch-1).
- Framework-tier gate count: **80** (unchanged).
- Axiom-gates count: **63** (unchanged).
- Total all-gates count (incl. SG): **84** (unchanged).
- Framework-audit own J-input count: **9** (was 7; +2 added at §7.10/§7.11).
- Framework-audit own P8 instance count: **5** (was 0 with basis; +5 added at §3.3 P0–P4).
- Framework-audit own gates: **3** (G-FA1, G-FA2, G-FA3 unchanged).
- Framework-audit total applicable to itself: **83** (unchanged: 3 own + 80 inherited).
- HRs: **7** (unchanged).
- Modes: **4** (unchanged).

**Findings closed at MF-amendment-1 (2):**
- F-MFA2-META-002 — closed at framework-audit-v1-4 §3.3 (Pattern A citation gap closed by canonical declaration of audit-cycle procedure).
- F-1.2-01 (closure extension) — closed at framework-audit-v1-4 §3.3 (verificative-mode operation flow now declared with stage discipline).

**Findings opened at MF-amendment-1 (2; D1 disposition for next cycle):**
- F-MFA1-AP-001 — MF-amendment-1 spec §4.5 row line 630 misidentified AP self-§3.4 reference as framework-audit's §3.4. AP §3.4 (stage-monotonicity-and-kind-alignment self-check) is not part of framework-audit's renumber set; bumping it would corrupt AP's self-reference. Preserved untouched.
- F-MFA1-GP-001 — MF-amendment-1 spec §4.6 row line 508 misidentified gen-proc self-§3.4 reference as framework-audit's §3.4. Same root cause: spec authoring assumed shape-parallel renumber across all P8-bearing frameworks (gen-proc/AP/framework-audit each have §3.4 named "Stage monotonicity and kind-alignment self-check"); only framework-audit renumbers this cycle.

**MF-audit-1 partial findings remaining (downstream cycles, unchanged from MF-patch-1):**
- F-MFA-LM-001 (full LM regen), F-MFA-LM-002 (SLICE banner), F-MFA-LM-003 (closes with LM-001), F-MFA-PL-001 (Plan §1 MA-G13 block), F-MFA-AS-001 + F-MFA-PL-002 (§3.5 leaf footnotes), F-MFA-C8-001 (registry §5 L3 bootstrap-write), F-MFA-D3-001 (MF-audit-2), F-MFA-FLOW2-001 (closes with C8-001), F-MFA-SPEC-001 (next MFv3 patch convenience).

---

## What changed in MF-patch-1

**Cycle inputs (frozen):**
- Substrate v1.2 — frozen at MF-patch-1, not edited (md5 ENTRY = EXIT = `284faa137fef3b48aa2a3817b1d4d6a4`; substrate held entry-to-exit during MF-patch-1; subsequently amended at MF-amendment-1 to v1.3 with EXIT md5 `a122f46b323dc90da3b4a4fca038e301`).
- Axes A1–A7 — frozen, no axis added/removed.
- AxR1–AxR3, G-M1, MA-S5, MA-L1 — frozen, no rule changes.
- 64 axioms — frozen, no axiom added/removed.
- 80 framework-tier gates — frozen, no gate added/removed.
- 7 J-inputs at framework-audit §7 — frozen, no J-input added/removed.
- GR-1..GR-6 at framework-audit §4.6.1 — frozen, rule text unchanged (only conformance-test paragraph refined to recoverability semantics).
- §2.2 GeneratedFrameworkTemplate output schema (metaframework) — frozen, schema unchanged.
- L3 frameworks (artifact-standard, plan-standard, multi-instance-standard, living-memory) — untouched.

**Substantive cycle edits (5 sites across 2 files):**

| File | Site | Edit |
|---|---|---|
| framework-audit-v1-2.md | §4.1 | Stale literal "48" (v1.2-era when inherited count was 45) replaced with derived "83" (3 own + 80 inherited; mechanically derivable per row sums above). Derivation note added explaining vacuous-pass over zero own axioms. Closes F-MFA-F9-007. |
| framework-audit-v1-2.md | §4.6.1 | Conformance test paragraph refined to recoverability semantics: GR-1..GR-6 require substance recoverability, not field-label parse. Both expanded per-gate Claim/Test/Reporting/Tests/Escalation blocks (G-FA gate shape) and compact tabular form (L3 framework + metaframework §4.7 enumeration shape) satisfy. Cascades to G-V9 predicate. |
| framework-audit-v1-2.md | §4.8.3.11 G-St16 | Predicate refined: testability classification derived from axiom's relationship to framework's P7 set (criteria-bounded iff axiom references a J-input declared at framework's §7); per substrate §1.3 S-03 single-source no separate `testability` field declared. Closes F-MFA-ST16-001. |
| framework-audit-v1-2.md | §4.8.4.4 G-V9 | Predicate refined: substance-recoverability semantics replace field-label parse; explicit recovery rules per GR-1..GR-6 declared. Closes F-MFA-V9-001. |
| amendment-propagation-v1-0.md | §5.10 | Missing v1.1 row added per F-MFA-F9-008 closure. Row content drawn verbatim from §5.1 v1.1 amendment description (PropagationTrace inline shape per R-0055; gate count 45→52 per R-0020 KA-Build-2 cascade). MA-S5 cross-file restatement consistency satisfied. |

**Restatement-only edits (per MA-S5 cascade, 5 files × header + version-history rows):**
- metaframework-v3-1.md (v3.2.3 → v3.2.4): header + §1 Identity + §5.1 + §5.6 + §9.
- generation-procedure-v1-0.md (v1.1.2 → v1.1.3): header + §1 Identity + §5.1 + §8.2 framework-audit version-ref `v1-3` → `v1-3.3` + §5.7 + §9.
- amendment-propagation-v1-0.md (v1.2 → v1.2.1): header + §1 Identity + §5.1 + §5.10 v1.2.1 row + §9 (substantive §5.10 v1.1 row addition above counts as the substantive AP edit).
- v3-1-spec.md (v3.2.3 → v3.2.4): header + §5.8 NEW MF-audit-1 finding-closure section + end-of-spec status.
- MANIFEST.md: this file.

**Counts (all unchanged from v3.2.3):**
- Axiom count: **64** (35 axis-bound + 28 v3.2.3-added + 1 universal MA-G13).
- Framework-tier gate count: **80** (52 v3.2.1-era + 28 v3.2.3-added).
- Axiom-gates count: **63**.
- Total all-gates count (incl. SG): **84**.
- Framework-audit own J-input count: **7**.
- Framework-audit own gates: **3** (G-FA1, G-FA2, G-FA3).
- Framework-audit total applicable to itself: **83** (3 own + 80 inherited; previously stale at 48).

**Findings closed at MF-patch-1 (4):**
- F-MFA-V9-001 — closed at framework-audit §4.6.1 + §4.8.4.4
- F-MFA-ST16-001 — closed at framework-audit §4.8.3.11
- F-MFA-F9-007 — closed at framework-audit §4.1
- F-MFA-F9-008 — closed at amendment-propagation §5.10

**Findings not closed by this cycle (downstream):**
- F-MFA-LM-001 (full LM regen) → separate cycle
- F-MFA-LM-002 (F-memory SLICE banner) → hygiene cycle
- F-MFA-LM-003 (closes mechanically with F-MFA-LM-001)
- F-MFA-PL-001 (Plan §1 MA-G13 block) → Plan amendment cycle
- F-MFA-AS-001, F-MFA-PL-002 (§3.5 leaf-reconciliation footnotes) → hygiene cycle
- F-MFA-C8-001 (registry §5 L3 bootstrap-write) → separate cycle
- F-MFA-D3-001 (out-of-cycle adjacent custody) → MF-audit-2
- F-MFA-FLOW2-001 (closes when V9-001 + ST16-001 + C8-001 close — V9 + ST16 close this cycle; C8-001 remains)
- F-MFA-SPEC-001 (spec §3.5 clarifying language) → next MFv3 patch convenience

---

## Filename discipline

Per L0 Q3: filenames retain v-N slugs across all version bumps. Disk filenames unchanged from prior delivery:
- `substrate-v1-1.md` (internal v1.3)
- `framework-registry-v1-0.md` (internal v1.0)
- `metaframework-v3-1.md` (internal v3.2.5)
- `generation-procedure-v1-0.md` (internal v1.1.4)
- `framework-audit-v1-2.md` (internal v1.4)
- `amendment-propagation-v1-0.md` (internal v1.2.2)
- `v3-1-spec.md` (internal v3.2.5)

---

## Post-MF-patch-1 cascade (out of scope for this phase)

- **L3 framework alignment work:** F-MFA-LM-001 + F-MFA-PL-001 + F-MFA-AS-001/PL-002 + F-MFA-LM-002/003 — separate cycle when convenient. L3s remain canonical at HEAD per Path B.
- **Registry §5 L3 bootstrap-write:** F-MFA-C8-001 + F-MFA-D3-001 — separate cycle, optionally batched with MF-audit-2 (after LIV-Standard / Cognitive / Design canonical declarations exist).
- **First-run of 28 v3.2.3-added gates against L3 frameworks:** the audit cycle is MF-audit-1; this MF-patch-1 cycle closes 4 of its findings; the remaining 5 deferred per disposition above.

---

## Canonical attestation

**v3.2.5 metaframework system is canonical at declaration-tier as of 2026-04-28.**

- Declared: 6 frameworks/ files + 1 spec + 1 manifest.
- Cycle additions: 2 J-inputs (J-audit-request-validation + J-audit-outcome-review at framework-audit §7.10/§7.11); 5 P8 instances (P0–P4 at framework-audit §3.3); 1 substrate version-history sub-entry (§16 v1.3); 1 spec finding-closure section (§5.9 extended at Shot 2 from Shot-1 entry-record state to Shot-2 sprint-close state).
- Cycle subtractions: zero (no axioms / gates / HRs / primitives / J-inputs / P8 steps / modes removed; per MA-L1 + MA-L9 no-removal additive discipline).
- Cycle semantic restatements: substrate §2.4 + §8.1 + §8.3 (×2) + §12 P8 row (mode-restriction lift, 5 sites); metaframework §3.4 P8 row + §3.5 ProcedureStepInstance/DimensionResult + §6.5 Stage/StageContentKind/ProcedureStepInstance custody (vocab/custody restatement, 7 sites).
- Cycle cascade pointer updates: framework-audit 28-edit internal §3.x ref sweep; metaframework cascade pointers §3.3 → §3.4 (3 sites); AP + gen-proc each 1 framework-audit version+section pointer; spec 4 cascade pointers (line 1002 frozen historical).
- Cycle section renumbers: framework-audit §3.3 → §3.4, §3.4 → §3.5, §3.5 → §3.6, §3.6 → §3.7, §3.7 → §3.8 (5 section header bumps; corresponding internal references swept).
- Substrate v1.2 → v1.3: ENTRY md5 `284faa137fef3b48aa2a3817b1d4d6a4`, EXIT md5 logged in delivery report (different from ENTRY per §4.9 substrate-amendment-cycle expectation).
- Frozen-input invariants ENTRY = EXIT: axiom count 64; framework-tier gate count 80; HR count 7; mode enum 4; framework-audit own gate count 3 (G-FA1, G-FA2, G-FA3). ✓
- Counts that changed (declared at cycle close): substrate md5 ENTRY → EXIT; framework-audit P7 own count 7 → 9; framework-audit P8 own count 0 → 5; framework-audit P7+P8 total 7 → 14.
- Version bump classes per §2 of MF-amendment-1 spec: substrate minor (v1.2 → v1.3); framework-audit minor (v1.3.3 → v1.4); metaframework patch (v3.2.4 → v3.2.5); gen-proc patch (v1.1.3 → v1.1.4); AP patch (v1.2.1 → v1.2.2); spec minor (v3.2.4 → v3.2.5); MANIFEST tracks above.
- Per MA-L1 additive: P7 7 → 9 (additive J-input declarations); P8 0 → 5 (additive — moves from positive-empty-basis to populated; permissible since basis text framing was open to amendment when own discipline declared as ordered procedure per amended substrate §8.3); semantic restatements at substrate + metaframework (no rule weakened; mode taxonomy unchanged at 4 modes; mode-binding clarified that mode does not gate P8 declaration). ✓
- MA-V9 + MA-St16 axiom text unchanged at v3-1-spec §3.2.6. ✓
- D1 disposition observed: spec §4.5 row line 630 + §4.6 row line 508 misidentified self-§3.4 references in AP and gen-proc; preserved untouched per builder D1 escalation; logged as F-MFA1-AP-001 + F-MFA1-GP-001 for next-cycle hygiene. ✓
- Auditor sprint-close run pending: P0–P4 cores-first cascade per the very procedure declared this cycle (self-application discipline). In-scope: framework-audit-v1-4 (target of own new §3.3 declarations); cascade against substrate-v1-3, metaframework-v3.2.5, gen-proc-v1.1.4, AP-v1.2.2, spec-v3.2.5.

---

## End of manifest
