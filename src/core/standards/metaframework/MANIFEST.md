# v3.2.3 metaframework system — CANONICAL AT DECLARATION-TIER

**Packaged:** 2026-04-27
**Status:** v3.2.3 canonical at declaration-tier. Single-batched additive cycle landed.
**Authority:** L0 (Phase v3.2.3 delivery).
**Predecessor state:** v3.2.1 canonical at execution-tier (post-9h).
**Cycle scope:** declaration-tier additive cycle (28 axioms + 28 paired gates + 4 J-inputs + 1 GR-series rule set). Substrate v1.2 unchanged. Per spec §1.5 cycle scope: declaration-tier only; first-run of 28 added gates deferred to next audit cycle.

---

## Contents

### `frameworks/` — 6 canonical files

| # | File (filename slug per L0 Q3) | Internal version | Kind | Post-v3.2.3 state |
|---|---|---|---|---|
| 1 | `substrate-v1-1.md` | v1.2 | non-framework (substrate) | unchanged (frozen this cycle) |
| 2 | `framework-registry-v1-0.md` | v1.0 (schema unchanged; data-tier write) | non-framework (state store) | §5 entries refreshed: amendmentLog column added, 5 entries gain v3.2.3 cycle AmendmentLogEntry; §5.1 cycle entry rendered; §9 changelog row appended |
| 3 | `metaframework-v3-1.md` | v3.2.3 | framework (generative, L2) | 28 axioms + 28 gates added across 7 axes; §3.2 axiom table extended; §3.2.2 binding lines extended; §3.4 P3/P4/P5/P7 row counts updated; §3.5 vocabulary MetaframeworkGateIdSet 52→80; §4.1/§4.4/§4.7 gate counts + enumerations extended; §5.1/§5.6/§9 history extended; §7.2 J-axiom-dist input extended; §8.1 enumeration extended |
| 4 | `generation-procedure-v1-0.md` | v1.1.2 | framework (generative, L2) | §3.2 P4/P5 inherited counts updated; §3.3 E1–E7 gates lists extended (28 new gate IDs); §3.3 partition arithmetic 52→80; §4.1/§4.2 inherited counts + per-E-step coverage extended; §5.1/§5.6/§5.7/§9 updated; §8 inherited count 52→80 |
| 5 | `framework-audit-v1-2.md` | v1.3.2 | framework (verificative, L2) | §3.6 P4/P5/P7 row counts updated; §4.1/§4.2.3/§4.3/§4.7 inherited gate refs extended; **§4.6.1 NEW** GR-series rule set declared (closure item 1); **§4.8 NEW** 28 axiom-gate predicates authored (per-axis sub-sections §4.8.1–§4.8.7); §5.7 Scale bounds updated; §5.11/§9 history extended; **§7.6–§7.9 NEW** 4 v3.2.3 J-input declarations (J-authority-source-classification, J-axis-concern-coverage, J-axiom-text-declarative, J-amendment-trigger-context); §7.4 axis status three→seven; §7.5 provenance extended; §8 self-application basis 52→80 |
| 6 | `amendment-propagation-v1-0.md` | v1.2 | framework (structural, L2) | §1 Own-invariants 36→64; §3.2 P4/P5 inherited basis updated; §4.1/§4.3/§4.7/§8.1 inherited count + ID enumeration extended; §5.1/§5.10/§9 history extended (per Finding 1 disposition: 8th edit-target file added per MA-S5 cascade) |

### `spec/`

- `v3-1-spec.md` — v3.2.3. Governing spec. §1 Meta-state version field updated; §3.2 axiom table extended (7 rows + grand total 36→64); **§3.2.6 NEW** 28 axiom bodies authored (per Phase 5, organized by axis); §3.4 gate counts updated (axiom-gates 35→63, total 56→84, framework-tier 52→80); §3.4 GR-series reference updated to point to framework-audit §4.6.1 authoritative declaration; §7.1 G-spec-5 test 35→63; §7.2 G-spec-5 result 35+1→63+1.

### `reports/` — cumulative delivery reports

| Phase | Report |
|---|---|
| 1.2-fix-trail hygiene (prior) | phase-1-2-fix-trail-hygiene-delivery-report.md |
| 9h Work Item 1 | phase-9h-G-U1-first-run-report.md |
| 9h Work Item 2 | phase-9h-cross-file-consistency-report.md |
| 9h Work Item 3 | phase-9h-ap-self-recursion-report.md |
| 9h terminal | phase-9h-terminal-delivery-report.md |
| v3.2.3 delivery | v3-2-3-delivery-report.md (this cycle, generated Turn 3) |

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
| **v3.2.3 (this cycle)** | **declaration-tier additive cycle** | **28 axioms + 28 gates + 4 J-inputs + 1 GR-series; metaframework→v3.2.3, framework-audit→v1.3.2, gen-procedure→v1.1.2, amendment-propagation→v1.2, spec→v3.2.3** |

---

## What changed in v3.2.3

**Cycle inputs (frozen):**
- Substrate v1.2 — frozen, not edited.
- Axes A1–A7 — frozen, no axis added/removed.
- AxR1–AxR3, G-M1 — frozen, no rule changes.
- Source spec procedure — unchanged.
- Both prior audit verdicts (Phase 4-5 + Phase 6-7) — preserved.
- Deliverable v2 authored content (28 axioms + 28 gates + 4 J-inputs + GR-series) — applied verbatim per Phase 5 + Phase 4 §6.0.1 derivations.

**Structural amendments (additive only, per MA-L1):**
- 28 axioms added across 7 axes: I+2 (MA-I6, MA-I7), S+3 (MA-S4, MA-S5, MA-S6), St+11 (MA-St6..MA-St16), V+4 (MA-V6..MA-V9), L+3 (MA-L8, MA-L9, MA-L10), C+4 (MA-C7..MA-C10), J+1 (MA-J5).
- 28 paired gates added: G-I6, G-I7, G-S4..G-S6, G-St6..G-St16, G-V6..G-V9, G-L8..G-L10, G-C7..G-C10, G-J5. Per-gate Claim/Test/Reporting/Tests/Escalation authored at framework-audit §4.8 per GR-1..GR-6 conformance.
- 4 J-inputs declared at framework-audit §7.6–§7.9: J-authority-source-classification (consumed by G-I6); J-axis-concern-coverage (consumed by G-St11); J-axiom-text-declarative (consumed by G-St14); J-amendment-trigger-context (consumed by G-L8). Per spec §1.3: P7 instances under existing P7 primitive shape, not new primitive shapes.
- 1 GR-series rule set (GR-1..GR-6) extracted at Phase 4 §6.0.1 from existing canonical gate-execution sections; declared authoritatively at framework-audit §4.6.1 (closure item 1). Metaframework §4.6 + spec §3.4 reference this declaration.

**Counts:**
- Axiom count: 36 → **64** (35 axis-bound → 63; 1 universal MA-G13 unchanged).
- Framework-tier gate count: 52 → **80**.
- Axiom-gates count: 35 → **63**.
- Total all-gates count (incl. SG): 56 → **84**.
- Per-E-step gate counts (gen-procedure §3.3, §4.2): E1: 6→8, E2: 4→7, E3: 6→17, E4: 6→10, E5: 8→11, E6: 7→11, E7: 5→6, E8: 10 (unchanged).
- Framework-audit own J-input count: 3 → **7**.

**Cycle dispositions (Findings 1, 2, 3):**
- **Finding 1** (amendment-propagation MA-S5 cascade): disposition (a) — amendment-propagation added as 8th edit-target file. 14 edits applied; per-cycle row appended to §5.10 + §9; v1.1 → v1.2.
- **Finding 2** (registry §5 AmendmentLogEntry shape): Option 1 — per-entry append to `amendmentLog[]` field of impacted RegistryEntries. §5 table extended with `amendmentLog (recent)` column; §5.1 sub-section renders cycle AmendmentLogEntry once.
- **Finding 3** (pre-existing v3.2.1 drift): disposition (a) — left untouched. 7 sites flagged for MA-S5 first-run at next framework-audit cycle (spec line 51, line 187; metaframework §5.6 v3.0 + v3.1 historical rows; gen-procedure §5.7 + §9 v1.0 historical rows; framework-audit §4.1 line 401 "Total: 48"; amendment-propagation §5.10 v1.1-row absence).

**Turn 2 findings (L0-dispositioned (a)):**
- M-38: metaframework §3.4 P3 Leaf row 36→64 (Turn 1 grep under-specified — pipe-separated table cell slipped through).
- GP-26: gen-procedure §9 changelog v1.1.2 row append (Turn 1 conflated §5.7 with §9).

**Audit-note logged for next framework-audit cycle:**
- Cascade-enumeration sweep needs `\b{value}\b` per atom-instance plus reverse-direction cardinality verification, not keyword-substring grep.

---

## Filename discipline

Per L0 Q3: filenames retain v-N slugs across all version bumps. Disk filenames unchanged from prior delivery:
- `substrate-v1-1.md` (internal v1.2)
- `framework-registry-v1-0.md` (internal v1.0)
- `metaframework-v3-1.md` (internal v3.2.3)
- `generation-procedure-v1-0.md` (internal v1.1.2)
- `framework-audit-v1-2.md` (internal v1.3.2)
- `amendment-propagation-v1-0.md` (internal v1.2)
- `v3-1-spec.md` (internal v3.2.3)

---

## Post-v3.2.3 cascade (out of scope for this phase)

Per spec §1.5 cycle-scope:
- **First-run of 28 v3.2.3-added gates:** deferred to next framework-audit cycle. State `not-yet-run` recorded at metaframework §4.7 + §8.1, framework-audit §4.7, amendment-propagation §8.1.
- **Pre-existing drift (7 Finding-3-class sites):** flagged for MA-S5 first-run at next audit cycle.
- **L3 framework generation:** separate phase per beta-path roadmap.

---

## Canonical attestation

**v3.2.3 metaframework system is canonical at declaration-tier as of 2026-04-27.**

- Declared: 6 frameworks/ files + 1 spec.
- Cycle additions: 28 axioms + 28 gates + 4 J-inputs + 1 GR-series rule set, all authored verbatim per Phase 5 + Phase 4 §6.0.1.
- Substrate v1.2: untouched (frozen).
- Per-file edits: 122 enumerated edit rows (Turn 1 delta) + 2 Turn-2 supplementations (M-38, GP-26) = **124 applied edits**.
- Cycle arithmetic: 7+6+16+9+10+10+5 = 63 axis-bound + 1 universal = 64; 7 PG + 63 axiom + 1 MA-G13 + 5 F-69 + 4 meta = 80 framework-tier; 80 + 4 SG = 84 all-gates. ✓
- Per-E-step partition: 8+7+17+10+11+11+6+10 = 80 = E1..E8. ✓
- Cross-file MA-S5 reconciliation: every restated atom-instance (AC-AB, AC-T, GC-FT, GC-AX, GC-TOT, per-axis, per-E-step) consistent across all sites. ✓
- Frozen-input invariants: substrate untouched; deliverable verbatim; both prior audits preserved; cycle shape single-batched. ✓

Turn 3 will execute GATE-v3.2.3 §12 checks (6 checks against post-apply canonical), package `v3-2-3-canonical_tar.gz`, and produce `v3-2-3-delivery-report.md`.

---

## End of manifest
