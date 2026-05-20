---
kind: derivation-log
shot: Side-Quest Shot 2 — Phase B, LM v3.3.1 → v3.4
dispatched: deriver
authority: L0 (Demos) directing; ratification pending at shot close
predecessor: side-quest-spec.md §SHOT 2 (Phase B) + L0 confirmations on Q1=(i), Q2=(β), Q3=(I) at Shot 2 entry
date: 2026-05-19
---

# Derivation log — Side-Quest Shot 2 (Phase B)

This log records the decisions the deriver made during Shot 2 execution and their bases. Four classes of decision are recorded: **(1) spec section-number drift corrections** (mechanical resolution against actual LM file structure); **(2) ratified branch executions** (Q1/Q2/Q3 at Shot 2 entry); **(3) opportunistic same-line drift closures** (SourceRef channel union); **(4) precision items** (RC array structure interpretation, MA-St17 grounding for new typed shape).

The log is consumed by L0 at shot-close ratification and by Phase C deriver (Manual SPEC-v13.4 amendment) as ground for canonical-naming row + Part I vision note.

---

## §1 Spec section-number drift corrections

### §1.1 Drift inventory

Side-quest spec §SHOT 2 references LM section numbers that do not match the current LM file structure:

| Spec reference | Spec phrasing | Actual LM section |
|---|---|---|
| LM §3.2 axiom table | "Locus: LM §3.2 axiom table, row after LMA12" | §3.2 (confirmed match) |
| LM §3.4 vocabulary | "Update LM §3.4 vocabulary. Add ContentClass row" | **§3.12** (LM file vocab is at §3.12) |
| LM §3.5 P3 leaf count | "Update LM §3.5 (P3 leaf count)" | **§3.3** (primitive instance counts is at §3.3; P3 leaf count = 0 unchanged at v3.4) |
| LM §3.6 count restatements | "Update LM §3.6 (count restatements)" | **§3.3** (primitive instance counts is the count-restatement table); §1.3 own-invariants count is also restated |
| LM §3.2 P4 axiom count | "Update §3.2 P4 axiom count" | **§3.3** (P4 axiom count is in §3.3 primitive instance counts table — §3.2 declares the axiom set itself, §3.3 declares the count) |
| LM §6 referentCitations | "Update LM §6 referentCitations. LMA13 RC entry" | **§1 Identity table referentCitations row + §3.13 AxisBasis declarations** (RC arrays are embedded in §1 Identity table at row `referentCitations`; §6 is Coupling, not RC) |
| LM §3.16 change log | "AmendmentProvenance row at LM §3.16 change log" | **§8** (change log is at §8) |

### §1.2 Resolution

Deriver executed against actual file section numbers. This is the same drift class as Shot 1's channel-literal correction (spec authored before mechanical validation against current file structure). The spec's *intent* is unambiguous in every case (which artifact to amend, what content); only the section numbers are off. The mechanical resolution preserves spec intent at all touched loci.

No content was added, removed, or modified beyond the spec-declared intent. Section-number corrections are recorded here for L0 attention and for Phase C deriver's awareness — Phase C may want to spot-check its own section-number citations against the LM file.

### §1.3 Surfacing posture

Section-number drift is **informational, not blocking**. Surfaced in MANIFEST §"Surfaced to L0 at shot close." No mid-shot pause required — the mechanical resolution is unambiguous.

---

## §2 Ratified branch executions (Q1, Q2, Q3)

### §2.1 Q1 — LMA7 amendment style: (i) in-place clause amendment

**Ratified at Shot 2 entry.** L0 affirmed: "Brief and spec both phrase it as body-level restriction. Note-style hides the load-bearing property behind a footnote."

**Execution.** LMA7 §3.2 row body extended with clause:

> "Over the candidate set of records where LMA13 ContentClass filter selects (v3.4 mechanical clarification — anchor-candidacy operates over `contentClass === 'wearer-life'` records only; cross-class mixing in anchor-derivation is forbidden by LMA13)"

Inserted between "Anchors are derived, never stored." and "an anchor is an IdentityRef…" The clause restricts the candidate set; the existing identity-density × position-density predicate is unchanged.

**Cross-reference completeness.** §3.7 Anchor derivation expansion already states the anchor-derivation mechanics; Phase B does not amend §3.7 (no spec instruction; §3.7's prose remains a parallel-text expansion of LMA7's §3.2 row). Future amendment may align §3.7 prose with LMA13 — out of scope for Shot 2.

### §2.2 Q2 — ThreadQueryInput.contentClass? addition: (β) type-level field add at substrate.types.ts

**Ratified at Shot 2 entry.** L0 affirmed: "Optional field is backward-compatible by definition, no callsite sweep. RC array already declares LMA13 governs those code paths — type matches declaration. Path (α)'s 'declarative until F-present consumes' misreads the out-of-scope clause: that excludes implementation amendment (the read-path logic in F-memory), not type-shape additions on input."

**Execution.** `src/core/types/substrate.types.ts` `ThreadQueryInput` extended:

```
export type ThreadQueryInput = {
  threadKind:    ThreadKind
  anchor:        IdentityRef | PositionRef
  roleFilter?:   RoleRef
  scope?:        ScopeRef
  contentClass?: ContentClass    // v3.4: optional read-time ContentClass filter (LM v3.4 LMA13)
  window?:       number
  limit?:        number
}
```

**Field placement.** Between `scope?` and `window?`. Rationale: `scope?` and `contentClass?` are both read-time filter axes; they cluster. `window?` is a kind-specific param (required for `'adjacency'`); `limit?` is a result-cardinality cap. The ordering reflects the semantic grouping (read-time filters → kind-specific params → result cap). Same logic as Shot 1's SubstrateSourceRef field ordering (channel/contentClass/scope cluster origin-classification axes).

**Backward-compatibility gate.** `npx tsc --noEmit` returns exit 0 on full project after the addition. No callsite breakage — verified at amendment time.

**LM-side reflection.** LM §2.1 schema documentation extended to mirror the substrate.types.ts shape. §3.13.7 typed-shapes table already covers ThreadQueryInput by `substrate-atom-ref` to A-01 (WAtom — input atom shape); the optional sub-shape `contentClass?` inherits that grounding (no new typed-shape row required for the optional field itself; ContentClass typed-shape gets its own row separately).

### §2.3 Q3 — §3.11 row folded into v3.4 changelog: (I)

**Ratified at Shot 2 entry.** L0 affirmed: "Shot 1's row landed pre-version-bump under α ratification; v3.4 is its first home. Clean version history."

**Execution.** §8 change log v3.4 row enumerates §3.11 amendment ("§3.11 amended: `source_content_class → positions` row added as optional optimization — folded from Side-Quest Shot 1 Phase A under L0 branch-α ratification — Shot 1's row was pre-version-bump amendment; v3.4 is its first formal version home per Q3=(I) at Shot 2 entry"). §3.13.6 Required-indices closure-rule basis also updated to reflect the six-row indices set with explicit Shot-1-to-v3.4 fold annotation.

**Count consistency.** §3.11 row count itself is unchanged from end of Shot 1 (already 6 rows; Shot 1 added the source_content_class row). What changes at v3.4 is the **formal version attribution** for the row — Shot 1 added it under ad-hoc branch-α ratification with no LM version bump; v3.4 owns it cleanly.

---

## §3 Opportunistic same-line drift closures

### §3.1 SourceRef channel union extended with `'system-l0'`

**Pre-existing drift.** Sprint B2 Shot 5 added `'system-l0'` to the SourceChannel union at `src/core/types/substrate.types.ts` line 104 — but the LM §2.1 SourceRef shape declaration omitted it (carried the pre-B2-Shot-5 five-channel union). This is a Sprint B2 Shot 5 carry-forward drift at LM standard tier.

**Same-line touch.** Shot 2 amends §2.1 SourceRef block to add `contentClass: 'wearer-life' | 'system-introspection'` field. Same line group. Per Shot 1 precedent ("opportunistic during this phase if same lines are touched, otherwise carry as backlog"), the channel-union drift is closed at the same edit.

**Authority.** No additional L0 ratification needed — same precedent as Shot 1's `'wearer-l0' → 'wearer'` and `'scheduled-trigger' → 'cron'` corrections. Same-line opportunistic closures fall within the deriver's authority per S1 (substrate code is single source of truth; LM standard documentation reflects substrate). Recorded here.

### §3.2 §1 RC array Schema-axis substrate.types.ts entry's expectedShape sync

**Pre-existing drift.** Sprint B2 Shot 5 populated the Schema-axis RC array entry for `substrate.types.ts` with a ThreadQueryInput shape string that read `ThreadQueryInput{threadKind:ThreadKind,anchor:IdentityRef|PositionRef,scope?:ScopeRef,...}` — missing the full optional-parameter set even at v3.3.1 (`roleFilter?`/`window?`/`limit?` omitted from the doc string).

**Same-line touch.** Shot 2 amends the same expectedShape string to add `contentClass?:ContentClass`. Opportunistic same-line correction: replaced the truncated `...` with the full shape `roleFilter?:RoleRef,scope?:ScopeRef,contentClass?:ContentClass,window?:number,limit?:number`. Truth-sync with the actual substrate.types.ts file at v3.4.

**Authority.** Same precedent (same-line opportunistic). Recorded here.

---

## §4 Precision items

### §4.1 RC array Structure-axis +1 entry block — discipline-axiom-governance kind

**Spec W6 says:** "RC entry for LMA13 cites LMA7 + LMA9 read paths (substrate-repository.ts readByPosition + iterateAxisRows + readIdentityRecurrence + readAdjacency) where ContentClass filter applies. Structure axis RC array gets +1 entry block citing LMA13."

**Tension.** LMA13 governs no new runtime function (W6 explicitly states "LMA13 governs no new runtime path on its own — it's a discipline axiom over LMA7 read-set"). But spec mandates +1 entry block. Two readings considered:

- **(a)** Annotate existing substrate-repository.ts entry's expectedShape with `[LMA13]` tags inline at the four read paths. Mechanical-clarification style; mirrors the existing `[LMA1/LMA4]`, `[LMA2]`, `[LMA9]` per-function axiom-tag pattern.
- **(b)** Add a sibling 6th entry block in the array targeting the same file but specifically declaring LMA13 governance (discipline-axiom kind).

**Decision: both (a) and (b).** (a) is mechanically richer: the existing substrate-repository.ts entry's expectedShape gains the line `every row carries source.contentClass field [LMA13 via SubstrateSourceRef substrate v1.8.3 A-24]` — analogous to the existing `every row carries userId field [LMA12]` line. (b) is the +1 entry block spec W6 mandates: a new entry with `kind:'discipline-axiom-governance'` (a kind I added — see §4.2 below for kind-class justification) describing LMA13's role as governance-over-LMA7-candidate-set + LMA9-optional-filter.

The pair is non-redundant: (a) annotates which function carries the column; (b) declares the discipline that governs the read primitives. Spec W6 satisfied by (b); semantic completeness gained by (a).

### §4.2 New RC `kind` value: `'discipline-axiom-governance'`

**Concern.** Existing RC entries use `kind:'typed-function-set' | 'typed-contract' | 'typed-types-module' | 'route-handler'`. The +1 entry block I added uses `kind:'discipline-axiom-governance'`. This is a new kind value.

**Authority basis.** Substrate §4.2 A-18 ReferentCitation carries an inline `ExpectedShape` discriminated union per A-17/PrimitiveKindRef sub-shape precedent. The `kind` field is extensible per the same substrate amendment discipline (closure rule additive per S3 + MA-S7 recursive). New kinds are not gates that block ratification — they extend the discriminator.

**Surfacing.** If L0 prefers a different kind value (e.g., `'governance-discipline'` or reusing `'typed-function-set'`), the entry's kind is trivially editable. Mechanically additive; safe to defer kind-name finalization to terminal audit (Shot 6) if desired.

**Alternative considered.** Reusing `'typed-function-set'` for the LMA13 entry — rejected because the entry cites no new function; it declares discipline-axiom governance. Using `'typed-function-set'` would conflate the discipline declaration with the function-set declaration at the same file path.

### §4.3 ContentClass typed-shape basis at §3.13.7 — `substrate-atom-ref` to A-24

**Decision.** ContentClass typed-shape row in §3.13.7 grounded via `substrate-atom-ref` with `atomId: 'A-24'`. Strongest grounding class per substrate §6.3 type-check classes.

**Basis.** ContentClass is declared at substrate v1.8.3 §4.2 A-24 as a closed two-value union — the canonical typed-shape declaration site at substrate tier. LM consumes by reference per substrate §4.3 atom usage discipline ("Every atom referenced by any framework is consumed by reference through the atom's ID. Redeclaration violates S1"). The typed-shape row at §3.13.7 grounds at the substrate atom; no further basis required.

**Comparison to SourceRef row.** §3.13.7 SourceRef row was originally `l0-ratified-ref` to Manual Part II Boundary loci (because SourceRef is LM-local synthesis, declared at LM §2.1, not at substrate). v3.4 amends the SourceRef row prose to mention contentClass sub-field, but the SourceRef row's basis kind remains `l0-ratified-ref` (the shape is still LM-local; only one of its three sub-fields is substrate-atom-ref-grounded — the substrate-ref is for ContentClass at its own typed-shape row, not for SourceRef itself).

### §4.4 G-St16 axiom-coverage — LMA13 not in SW2/TQ2 gate lists

**Concern.** §3.8 SW2 `gates = [LMA1, LMA3, LMA10, LMA11]` and §3.9 TQ2 `gates = [LMA9]` enumerate axioms tested at substrate-write step 2 and thread-query step 2 respectively. LMA13 does not appear in either.

**Resolution.** LMA13 is a **discipline axiom** — it constrains the candidate set over which LMA7 operates (via the in-place clause amendment) and authorizes the optional contentClass filter on LMA9 primitives. It is not enforced at SW2 (substrate-write does not validate ContentClass beyond shape conformance — TQ1 enum check applies to read-side queries, not writes) nor at TQ2 (gate-execution step tests threadKind enum membership; ContentClass enum membership is tested at TQ1 validation, not TQ2 gate).

LMA13's enforcement points:
- **Write-side:** SW1 shape validation (ContentClass enum is part of SourceRef shape per substrate v1.8.3 A-24 closed-union typed-shape integrity check at SW1)
- **Read-side, TQ1:** ContentClass optional parameter enum validation
- **Read-side, TQ3:** filter application at execution

LMA13 is structurally verified, not gate-listed in SW2/TQ2. Same pattern as LMA2 (revocation), LMA4 (atomic commit), LMA5–LMA8 (read-side semantic invariants), LMA12 (userId) — these are also not in SW2 gate list but are structurally enforced. G-St16 prose was updated to note this explicitly for LMA13.

---

## §5 Open items carried forward

None for Phase C entry. Phase C deriver receives v3.4 as ratified ground with:

- **LMA13 ContentClass discipline** declared at LM §3.2 (Structure axis, axiom 13). LMA7 anchor-derivation candidate-set restricted to `wearer-life`. LMA9 optional contentClass filter parameter authorized.
- **§3.12 vocabulary** includes ContentClass row pointing to substrate v1.8.3 A-24 as canonical declaration site.
- **§2.1 schema** documents SourceRef.contentClass required field + ThreadQueryInput.contentClass? optional field.
- **§3.11 indices** includes source_content_class → positions optional row (folded from Shot 1).
- **MA-St17 basis coverage:** §3.13.7 +1 ContentClass row (substrate-atom-ref to A-24). G-St17 declaration count 38.
- **Runtime:** substrate.types.ts ThreadQueryInput.contentClass? optional field added; tsc clean.

Phase C work (Manual SPEC-v13.4 canonical-naming row + Part I vision note + change-log row) consumes LM v3.4 by reference. The Manual canonical-naming row will cite both substrate v1.8.3 §4.2 A-24 (declaration site) and LM v3.4 (axiom site for LMA13) as basis loci.

---

## §6 Confidence and surfacing

**LMA13 axiom statement.** Verbatim from spec §W1. High confidence.

**LMA7 in-place clause amendment.** Per Q1=(i) ratified at Shot 2 entry. Body-level restriction text added; existing identity-density × position-density mechanics preserved byte-equivalent (only the candidate-set scope clause is new). High confidence.

**LMA9 mechanical clarification.** Per spec §W3 + Q2=(β) ratification on ThreadQueryInput field add. Backward-compatibility verified at tsc gate.

**Spec section-number drift.** Mechanically resolved against actual LM file. Surfaced informationally in MANIFEST §"Surfaced to L0 at shot close." No blocking.

**RC array +1 entry block kind value `'discipline-axiom-governance'`.** New kind value; surfaced in §4.2 above. Trivially editable at terminal audit (Shot 6) if L0 prefers a different name.

**Gate verification:** `npx tsc --noEmit` returns exit 0 with zero errors on the full project after Shot 2 overlay. MFv3 §3.3 E1–E8 gate suite pass per amended §4.1 audit table. Multidimensional audit (axiom-consistency / substrate-conformance / backward-compatibility / cross-axis projection) all PASS.

**No items requiring L0 surfacing mid-shot.** Shot 2 proceeds to tar bundling and L0 ratification.

End of derivation log.
