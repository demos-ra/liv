# v3.2.4 metaframework system — CANONICAL AT DECLARATION-TIER

**Packaged:** 2026-04-28
**Status:** v3.2.4 canonical at declaration-tier. MF-patch-1 cycle landed (predicate refinement, restatement-only).
**Authority:** L0 (MF-patch-1 delivery, atop v3.2.3 confirmation).
**Predecessor state:** v3.2.3 canonical at declaration-tier (2026-04-27).
**Cycle scope:** MF-patch-1 — surgical fix cycle. Closes 4 of 12 MF-audit-1 findings (F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007, F-MFA-F9-008). Substantive edits localized to framework-audit (3 predicate refinements + 1 stale-literal correction) + amendment-propagation (1 missing version-history row). Other 5 files restatement-updated per MA-S5 cascade. Substrate v1.2 unchanged. No axioms / gates / HRs / primitives / J-inputs added or removed. No count changes (axiom 64 unchanged; framework-tier gate 80 unchanged). All version bumps patch-level.

---

## Contents

### `frameworks/` — 6 canonical files

| # | File (filename slug per L0 Q3) | Internal version | Kind | Post-MF-patch-1 state |
|---|---|---|---|---|
| 1 | `substrate-v1-1.md` | v1.2 | non-framework (substrate) | unchanged (frozen this cycle, as every cycle since v3.2) |
| 2 | `framework-registry-v1-0.md` | v1.0 | non-framework (state store) | unchanged (no L3 entries written this cycle; L3 bootstrap-write deferred to separate cycle per F-MFA-C8-001) |
| 3 | `metaframework-v3-1.md` | v3.2.4 | framework (generative, L2) | restatement only — header version + §1 Identity Version row + §5.1 transition log + §5.6 history row + §9 changelog row |
| 4 | `generation-procedure-v1-0.md` | v1.1.3 | framework (generative, L2) | restatement only — header version + §1 Identity Version row + §5.1 transition log + §8.2 framework-audit version-ref `v1-3` → `v1-3.3` + §5.7 history row + §9 changelog row |
| 5 | `framework-audit-v1-2.md` | v1.3.3 | framework (verificative, L2) | **substantive cycle edits (4 sites):** §4.1 stale literal "48" → derived "83" with derivation note; §4.6.1 conformance test paragraph refined to recoverability semantics; §4.8.3.11 G-St16 predicate refined (P7-derivation per substrate §1.3 S-03 single-source); §4.8.4.4 G-V9 predicate refined (substance-recoverability replaces field-label parse). Header version + §1 Identity Version row + §5.11 + §9 history rows. |
| 6 | `amendment-propagation-v1-0.md` | v1.2.1 | framework (structural, L2) | **substantive cycle edit (1 site):** §5.10 v1.1 row added per F-MFA-F9-008 closure (was missing despite §5.1 declaring v1.1 substantive AP edit-target cycle; MA-S5 required the row). Header version + §1 Identity Version row + §5.1 transition log + §5.10 v1.2.1 row + §9 changelog row. |

### `spec/`

- `v3-1-spec.md` — v3.2.4. Governing spec. Header version + §5.8 NEW finding-closure section authored (4 MF-audit-1 findings closed at MF-patch-1: F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007, F-MFA-F9-008). End-of-spec status block updated for MF-patch-1 delivery.

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
| **MF-patch-1 (this cycle)** | MF-patch-1-delivery-report.md (to be authored at B10) |

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
| **MF-patch-1 (this cycle)** | **surgical fix cycle — predicate refinement + missing-row addition** | **closes 4 MF-audit-1 findings (F-MFA-V9-001, F-MFA-ST16-001, F-MFA-F9-007, F-MFA-F9-008); metaframework→v3.2.4, framework-audit→v1.3.3, gen-procedure→v1.1.3, amendment-propagation→v1.2.1, spec→v3.2.4** |

---

## What changed in MF-patch-1

**Cycle inputs (frozen):**
- Substrate v1.2 — frozen, not edited (md5 = `284faa137fef3b48aa2a3817b1d4d6a4`).
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
- `substrate-v1-1.md` (internal v1.2)
- `framework-registry-v1-0.md` (internal v1.0)
- `metaframework-v3-1.md` (internal v3.2.4)
- `generation-procedure-v1-0.md` (internal v1.1.3)
- `framework-audit-v1-2.md` (internal v1.3.3)
- `amendment-propagation-v1-0.md` (internal v1.2.1)
- `v3-1-spec.md` (internal v3.2.4)

---

## Post-MF-patch-1 cascade (out of scope for this phase)

- **L3 framework alignment work:** F-MFA-LM-001 + F-MFA-PL-001 + F-MFA-AS-001/PL-002 + F-MFA-LM-002/003 — separate cycle when convenient. L3s remain canonical at HEAD per Path B.
- **Registry §5 L3 bootstrap-write:** F-MFA-C8-001 + F-MFA-D3-001 — separate cycle, optionally batched with MF-audit-2 (after LIV-Standard / Cognitive / Design canonical declarations exist).
- **First-run of 28 v3.2.3-added gates against L3 frameworks:** the audit cycle is MF-audit-1; this MF-patch-1 cycle closes 4 of its findings; the remaining 5 deferred per disposition above.

---

## Canonical attestation

**v3.2.4 metaframework system is canonical at declaration-tier as of 2026-04-28.**

- Declared: 6 frameworks/ files + 1 spec + 1 manifest.
- Cycle additions: zero (no axioms, gates, HRs, primitives, J-inputs added or removed).
- Cycle predicate refinements: 2 (G-V9, G-St16 — substance-bearing, substrate-derivable).
- Cycle stale-literal correction: 1 (framework-audit §4.1 "48" → "83").
- Cycle missing-row addition: 1 (AP §5.10 v1.1 row).
- Cycle restatement updates: 5 files (header + version-history rows + version-ref refresh).
- Substrate v1.2: untouched (frozen). md5 = `284faa137fef3b48aa2a3817b1d4d6a4` at entry and exit.
- Frozen-input invariants: substrate untouched; axioms unchanged; gates unchanged; HRs unchanged; primitives unchanged; J-inputs unchanged; §2.2 schema unchanged; L3 frameworks untouched. ✓
- All version bumps patch-level. ✓
- Per MA-L1 additive: predicate refinement permitted (no axiom condition weakened); literal correction permitted (stale literal not authoritative); missing-row addition permitted (MA-S5 cross-file restatement consistency requires it). ✓
- MA-V9 + MA-St16 axiom text unchanged at v3-1-spec §3.2.6. ✓
- Eighth-edit-target moment held: amendment-propagation is edit-target this cycle (§5.10 v1.1 row + v1.2.1 row added). ✓

---

## End of manifest
