---
kind: derivation-log
shot: Side-Quest Shot 1 — Phase A, Substrate v1.8.2 → v1.8.3
dispatched: deriver
authority: L0 (Demos) directing; ratification pending at shot close
predecessor: side-quest-spec.md §SHOT 1 (Phase A) + manager Layer-0 confirmations on Q1/Q2/Q3
date: 2026-05-19
---

# Derivation log — Side-Quest Shot 1 (Phase A)

This log records the decisions the deriver made during Shot 1 execution and their bases. Three classes of decision are recorded: **(1) locus derivation** (spec W2 — the deriver's primary derivation responsibility this shot); **(2) channel-literal correction** (spec W3 — deriver mandated to correct spec channel names if they differ from code-tier SourceChannel union); **(3) minor placement decisions** (consumer-registry row position; provisional-stamp framing in §16).

The log is consumed by L0 at shot-close ratification and by Phase B deriver as ground for LMA13 amendment.

---

## §1 Locus derivation — `contentClass` field on `StateChangeRecord`

### §1.1 Decision

**Ratified locus: `StateChangeRecord.metadata.source.contentClass`** — sibling field on `SubstrateSourceRef`, peer to `channel` and `scope`.

### §1.2 Candidates considered

Per side-quest spec §SHOT 1 W2:

- **(a)** `StateChangeRecord.metadata.contentClass` — top-level metadata field, peer to `time` / `source` / `position`.
- **(b)** `StateChangeRecord.metadata.source.contentClass` — sibling on `SubstrateSourceRef`, peer to `channel` / `scope`.

### §1.3 Evaluation axes

Per side-quest spec §SHOT 1 W2: substrate S1 (single-source declaration), S2 (typed shape integrity), S6 (naming-function conformance), and Manual Part II §Boundary stamp semantics (Manual L178–L196). The deriver added one further axis: **cross-axis projection orthogonality** — implicit because Phase B Shot 2 multidimensional audit explicitly tests "ContentClass as filter axis projects orthogonally to scope (LMA6) and userId (LMA12) axes." Locus choice should not pre-contradict an audit downstream depends on.

### §1.4 Per-axis evaluation

**S1 (single-source declaration) — tie.** Either locus satisfies S1: ContentClass is declared once at substrate §4.2 as A-24; the field at the chosen locus references that atom by reference. Locus choice does not affect single-source declaration.

**S2 (typed shape integrity) — (b) wins.** S2 asks whether the chosen field belongs to the shape that owns its semantic territory.

Locus (a) places ContentClass as a peer of `time`, `source`, `position` — the four boundary-stamped properties enumerated at Manual L178–189. These four are: source authority, time of crossing, act/reference, scope. ContentClass is **not** in that enumerated set. The four enumerated properties share a stamping origin (each is independently stamped at the Boundary by a distinct concern: temporal anchor, jurisdictional check, governance-level determination, channel classification). ContentClass is the deterministic projection of one of those concerns (channel classification) for five of six channels, and a per-emitter declaration for the sixth. It is **not** a fifth independently-stamped property — it is a second projection of an existing stamping concern. Placing it at the same level as the four would conflate two different stamping origins.

Locus (b) places ContentClass on `SubstrateSourceRef`, the same shape that already carries `channel` (the source-authority enumeration of Manual L180) and `scope` (the jurisdiction property of Manual L189). The default-derivation rule runs `channel → ContentClass`; placing ContentClass on the same shape as its derivation source means the derivation rule projects within one shape, not across two. Type-shape integrity is maximized: `SubstrateSourceRef` becomes the shape that carries everything-about-origin.

There is a counter-pressure to weigh: ContentClass classifies the *content* of a record, not its *origin* in the literal sense. The deriver considered this and concluded it does not flip the analysis — ContentClass is origin-derived (channel-derived for 5/6 channels, emitter-declared for the 6th), not content-inspected. The classification is determined at the Boundary from the source-axis input, never from inspection of `content.identities` or `content.relations`. It is therefore an origin-classification property, not a content-inspection property. Origin-classification properties cluster on `SubstrateSourceRef`.

**S6 (naming-function conformance) — tie.** Both candidates produce single-locus deterministic citation forms. Locus (a) canonical citation: `StateChangeRecord.metadata.contentClass`. Locus (b) canonical citation: `StateChangeRecord.metadata.source.contentClass` (or shorter `SubstrateSourceRef.contentClass`). Both conform to S6's `<kind>-<locus>-<ordinal>` discipline for field references. Neither introduces naming ambiguity; both are single-locus.

**Manual Part II §Boundary stamp semantics — (b) wins.** Manual L178: "Every typed signal carries four properties stamped at the Boundary and preserved by Store." Manual L196 lists Boundary mechanics, including: "Channel classification — assigning source authority per channel." This is the act that stamps `source.channel`.

The locus derivation hinges on a precise reading: channel classification at the Boundary produces (i) the channel literal stamp on `source.channel`, and (ii) the deterministic ContentClass projection for 5 of 6 channels. These are two outputs of one act at one locus. The Manual locates the act at the Boundary, and the canonical record-side artifact of that act is `SubstrateSourceRef`. ContentClass — produced in the same act, from the same input, at the same locus — belongs on the same record-side shape.

For the polymorphic case (`internal-derivation`), ContentClass is declared at emission by the program (Phase D per-Standard rule), not at the Boundary. But the locus on the record shape does not change: `internal-derivation` writes follow Path B (programs writing directly to Store per Manual L204), and the program populates `source.contentClass` directly at the write site. The shape locus is the same — only the producer (Boundary vs program) differs. This consistency is itself an argument for (b): one record-side locus served by two producers (Path A: Boundary classification; Path B: program declaration), rather than splitting the shape locus by producer.

**Cross-axis projection orthogonality — (b) wins.** Phase B Shot 2 multidimensional audit tests "ContentClass as filter axis projects orthogonally to scope (LMA6) and userId (LMA12) axes — verified no axis-conflation."

Locus (b) preserves orthogonality cleanly at the structural level: `source.channel` (origin authority axis), `source.contentClass` (content classification axis), `source.scope` (jurisdiction axis). Three orthogonal axes on one shape, each independently filterable, each at the same shape depth. This is the structural signature of orthogonal axes.

Locus (a) creates a depth mismatch: `scope` is inside `source`, but `contentClass` sits *next to* `source`. The orthogonality can still be confirmed semantically at audit, but the structure visually suggests `contentClass` is *not* a sibling of scope — when in fact LMA13 will treat them as siblings (both filter axes over the same record set). The depth mismatch is a small structural cost (a) imposes that (b) avoids.

### §1.5 Tally

| Axis | (a) `metadata.contentClass` | (b) `metadata.source.contentClass` |
|---|---|---|
| S1 single-source | pass | pass |
| S2 typed-shape integrity | weak | **strong** |
| S6 naming-function | pass | pass |
| Manual Part II Boundary stamp semantics | weak | **strong** |
| Cross-axis projection orthogonality | weak | **strong** |

Locus (b) wins on three axes, ties on two. No axis favors (a).

### §1.6 Decision basis recorded against AxisBasis (A-22) categories

Per substrate v1.8.2 §4.2 A-22 AxisBasis discriminated union:
- **Strongest available grounding:** `substrate-amendment-ref` — the locus is established by this very amendment to substrate v1.8.3 (the field declaration becomes a substrate-tier reference once ratified).
- **Pre-ratification grounding:** `l0-ratified-ref` against side-quest spec §SHOT 1 W2 (Demos-ratified at side-quest entry, May 2026), `manualLocus: "side-quest-spec.md §SHOT 1 W2"`, `basis: "deriver autonomously decides locus per S1/S2/S6 + Manual Part II; selection becomes the ratified locus."`

### §1.7 Surfacing posture

Per manager confirmation on Q1: deriver decides autonomously; L0 ratifies at shot close; no mid-shot surfacing for locus selection unless evaluation produces genuine derivation contradiction (both candidates fail all axes, or both pass and the deriver cannot distinguish on principled basis). Neither contradiction occurred. Decision proceeds to shot tar without mid-shot surfacing.

---

## §2 Channel-literal correction (spec W3 → code-tier authoritative)

### §2.1 Drift inventory

Side-quest spec §SHOT 1 W3 enumerates six channel literals:

| Spec literal | Code-tier literal (v1.8.2 SourceChannel union) | Disposition |
|---|---|---|
| `wearer-l0` | `wearer` | **mismatch — corrected to `wearer`** |
| `ai` | `ai` | match |
| `integration-event` | `integration-event` | match |
| `scheduled-trigger` | `cron` | **mismatch — corrected to `cron`** |
| `system-l0` | `system-l0` | match |
| `internal-derivation` | `internal-derivation` | match |

### §2.2 Authority basis for correction

Substrate S1 (single-source declaration) and the spec itself: spec W3 mandates the deriver to "verify channel literal names against Manual L180 + src/core/types/substrate.types.ts SourceChannel union (post-B2-Shot-5 with `'system-l0'` added). Deriver corrects channel names in spec if literals differ." Code-tier (`src/core/types/substrate.types.ts`) is the authoritative SourceChannel declaration; the spec's `wearer-l0` and `scheduled-trigger` are spec-side approximations that did not match the v1.8.2-ratified code-tier literals.

Manual L180 describes the channels in prose (`Wearer-L0, System-L0, AI response, scheduled trigger, integration event, internal derivation`). The Manual prose uses descriptive form; the canonical machine literals are in `substrate.types.ts`. The deriver respects the Manual's descriptive intent (six channels with the described semantics) while using the code-tier literals as canonical strings.

### §2.3 Where the correction lands

The default-derivation table in substrate v1.8.3 §4.2 A-24 declaration body uses the corrected literals (`wearer`, `ai`, `integration-event`, `cron`, `system-l0`, `internal-derivation`). The correction is recorded inline at the A-24 body and explicitly here.

No correction is made to the Manual L180 prose in Shot 1 — Manual amendments are owned by Phase C (Shot 3). If the Manual prose carries any machine-literal references (it does not per current text — it is descriptive prose), Phase C would normalize them.

---

## §3 Minor placement decisions

### §3.1 §12 consumer registry — A-24 row position

A-24 row inserted immediately after the existing A-22 row, before the §5 Authority levels block. Rationale: §12 ordering follows §4.2 atom-ID order (A-01..A-22 by ascending ID, then §5/§6/§7/§8/§9/§10/§11/§13/§14 by ascending section number). A-23 does not have a `§4 Atom A-23` row in §12 — at the v1.8.2 amendment, A-23 was tracked at the `§5.6 Atom AuthorityAssertion` row because its structural declaration body lives at §5.6 (with §4.2 being a duplicate enumeration entry). A-24, by contrast, lives entirely at §4.2 with no separate §5.x or §6.x declaration block — it follows the A-21 / A-22 precedent of receiving a `§4 Atom A-NN` row in §12. Placement immediately after A-22 preserves ordinal order.

### §3.2 §16 — provisional-stamp framing

Per manager Q2 confirmation: the substrate-tier default-derivation table at A-24 lists `internal-derivation` as **"declared per emitting Standard at Phase D (no substrate-level default; declaration deferred, not omitted)"** — this is a declared property of the rule, not an absent row. The boot-time backfill provisional stamp (`system-introspection` for legacy `internal-derivation` rows) is named explicitly as a **backfill default**, distinct from the substrate-tier channel default. The A-24 body distinguishes these two defaults explicitly to keep table semantics clean for Phase D consumers.

### §3.3 Custody clause — forward-references to Phases B/C/D/E

A-24's Custody clause names downstream consumers that do not yet exist as ratified artifacts at v1.8.3 (LMA13 is Phase B, per-Standard declarations are Phase D, Present Standard v1.0.1 is Phase E, Manual canonical-naming row is Phase C). The deriver included these as **declared expected consumers** consistent with the side-quest spec's predeclared shot sequence. This is permissible per substrate §12 "Consumer registry updated additively per S3" — declared consumers are recorded at declaration time; if a downstream phase deviates, that phase's amendment updates the row.

### §3.4 Branch (α) ratification — scope expansion beyond W6 "one runtime-code touch"

After initial overlay (substrate spec + substrate.types.ts + MANIFEST + derivation log), gate verification `npx tsc --noEmit` surfaced **11 callsite errors** at SubstrateSourceRef construction sites across F-artifact / F-builder / F-chat (×2) / F-discover / F-identity / F-memory / F-plan (×2) / F-verify / proxy.ts. Required-field discipline (W4) and zero-error gate were mechanically incompatible with W6's "one runtime-code touch" framing.

Three branches surfaced for L0 selection:
- **(α)** Type-level required + helper + callsite sweep + migration + LM §3.11 index entry (deriver-recommended).
- **(β)** Type-level optional + runtime-enforced required.
- **(γ)** File-isolated tsc gate interpretation.

**L0 ratified (α)** with the framing: *"None of this is scope expansion — it's the additive consequence of declaring a typed row-stamped Categorical classification. ContentClass persists on the row per MA2 (every state-change typed at crossing) and Categorical-axis consistency with channel and kind."* The W6 "one runtime-code touch" line was reclassified as a manager-side miscount; adding a required field to a typed shape propagates structurally to every construction site, and that propagation is the mechanical consequence of W4, not a scope expansion beyond it.

Phase A scope as ratified: atom add + field on SubstrateSourceRef + helper + 11 callsite sweep + 1 migration + LM §3.11 index entry + F-memory `substrate-repository.ts` column read/write update.

### §3.5 Helper design — `deriveContentClassFromChannel`

Exported as a named value function from `src/core/types/substrate.types.ts` (sibling to types). Signature:

```
deriveContentClassFromChannel(channel: SourceChannel): ContentClass
```

Three design decisions, surfaced for record:

**Decision §3.5-D1 — `internal-derivation` returns `system-introspection` (does not throw).** Considered throwing on `internal-derivation` to force callers to declare directly. Rejected because the helper is also consumed at the boot-time backfill / Path A boundary stamping site (proxy.ts) where the channel may be `internal-derivation` at runtime for legacy or programmatic intake paths. Throwing would propagate runtime errors into Path A intake — a worse failure mode than the provisional stamp. The helper's docstring explicitly directs static `internal-derivation` callers to declare the literal at the construction site (which is what the 6 static-`internal-derivation` callsites do); the helper's runtime fallback for `internal-derivation` exists solely for variable-channel callers in Path A.

**Decision §3.5-D2 — switch with explicit cases per literal, no `default:` branch.** Exhaustive enumeration over the SourceChannel union. Adding a new channel to the union forces a compile-time check at the helper. This is a structural lock against silent channel additions evading ContentClass classification.

**Decision §3.5-D3 — named export, value (function), not type.** Required separate value import at each consumer (`import { deriveContentClassFromChannel } from '@/core/types/substrate.types'`). The three variable-channel callsites each got this import added alongside the existing type imports.

### §3.6 Callsite sweep — 11 sites mapped to default-derivation rule

| Site | File:Line | Channel | Resolution |
|---|---|---|---|
| 1 | `F-artifact/app/artifact-emit.ts:265` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D AS supersedes per emission target class) |
| 2 | `F-builder/app/builder-workflow.ts:70` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D Builder/AS supersedes) |
| 3 | `F-chat/contract/chat-contract.ts:541` | variable via `channelKindToSourceChannel(...)` | helper-derived |
| 4 | `F-chat/contract/chat-contract.ts:706` | static `'ai'` | literal `'wearer-life'` (deterministic) |
| 5 | `F-discover/contract/discover-contract.ts:158` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D Research supersedes) |
| 6 | `F-identity/contract/perimeter-consultation.ts:252` | variable via `toSourceChannel(...)` | helper-derived |
| 7 | `F-memory/exec/substrate-repository.ts:78` | DB row `row.source_channel` (read-side) | DB column `row.source_content_class` populated to record |
| 8 | `F-plan/app/plan-pipeline.ts:464` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D Plan supersedes) |
| 9 | `F-plan/contract/plan-contract.ts:181` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D Plan supersedes) |
| 10 | `F-verify/contract/verify-contract.ts:161` | static `'internal-derivation'` | literal `'system-introspection'` (provisional; Phase D Verify supersedes) |
| 11 | `proxy.ts:401` | variable via `toSourceChannel(...)` | helper-derived (Path A canonical Boundary stamping site) |

**Pattern.** Static channel literal → ContentClass literal at site. Variable channel via mapping function → helper invocation at site. DB row → DB column flowed to record. Each site receives a 3-line comment explaining the Phase A stamp and (where applicable) which Phase D Standard owns the future supersession.

**Phase D mechanical handoff (record).** Six sites carry `'system-introspection'` provisional literals that Phase D per-Standard amendments will revisit:
- AS amendment will declare F-artifact's per-target-class rule (sites 1, possibly 2 — depending on Builder/AS ownership split).
- Builder Standard or AS amendment will declare F-builder's classification (site 2 — TBD per Phase D coordination).
- Research Standard amendment will declare F-discover's classification (site 5).
- Plan Standard amendment will declare F-plan's classification (sites 8, 9).
- Verification Standard amendment will declare F-verify's classification (site 10).

The mechanical edit for Phase D at these sites is: replace `'system-introspection'` literal with the Standard-declared value. No re-derivation required.

### §3.7 F-memory R4 — column placement and read/write wiring

**Decision §3.7-D1 — `source_content_class` column placement in SQL column list.** Placed immediately after `source_channel` and before `source_scope` in INSERT and all 5 SELECT statements. Rationale: matches the Categorical-axis clustering derived at §1 — origin-classification properties (`channel`, `contentClass`, `scope`) cluster together in column order, mirroring how they cluster in the SubstrateSourceRef type shape. Schema diff visible at one boundary in the migration.

**Decision §3.7-D2 — `StateChangeRow.source_content_class: string` typed at config layer.** Not typed as `ContentClass` at the row level because `StateChangeRow` represents raw DB columns (per existing convention: `source_channel: string`, not `SourceChannel`). The branded cast `row.source_content_class as SubstrateSourceRef['contentClass']` happens in `rowToRecord` at R4. Mirrors the existing `source_channel` pattern exactly.

**Decision §3.7-D3 — `substrate-repository.ts` amended trail extended.** Banner `amended:` line gains `side-quest-shot-1 (substrate v1.8.3: source_content_class column read/written; row→record populates contentClass per A-24)`. Trail-hygiene consistency with sprint-12-shot-2 and sprint-b2-shot-3 entries.

### §3.8 LM §3.11 amendment — naming ambiguity surfaced

**Surface.** L0 directed "substrate §3.11 index entry for content_class." Substrate spec §3 ends at §3.5 — there is no substrate §3.11. The only mechanically valid §3.11 in the apparatus is **Living Memory §3.11 Required indices**. Phrasing "Categorical-axis consistency with channel and kind" aligned with the LM-tier index table (which sits in the Categorical-axis space of LM's structural decomposition).

**Interpretation applied (silent confirmation at continuation).** L0's directive read as **LM §3.11**. If incorrect, ratification at shot close can request correction; the row added to LM §3.11 is mechanically additive and trivially reversible.

**Row added.** `source_content_class → positions` declared as **optional optimization** (parallel to `scope → positions`, not required like `userId → positions`). Basis: the substrate v1.8.3 §4.2 A-24 default-derivation rule maps 5 of 6 channels deterministically — `WHERE source_content_class = 'wearer-life'` equates to `WHERE source_channel IN ('wearer','ai','integration-event') OR (source_channel = 'internal-derivation' AND <emitter-specific>)` at the row-set level. Only `internal-derivation` rows materially benefit from a column-level index (because their classification is polymorphic per emitting Standard). The row's prose includes a promote-to-required clause triggered by Phase B (LMA13 anchor-derivation filter usage patterns) or Phase D (per-Standard internal-derivation classification density).

**Cross-row consistency check.** The LM §3.11 row references substrate v1.8.3 §4.2 A-24 by version. Phase B will further amend LM §3.11 (or adjacent sections) if LMA13 mechanics require additional index commitments; no commitment beyond the optional index is made here.

### §3.9 Migration 020 — backfill discipline

**Decision §3.9-D1 — three explicit UPDATE statements, not one with CASE.** Per default-derivation rule: separate UPDATEs for (a) `wearer/ai/integration-event` → `'wearer-life'`; (b) `cron/system-l0` → `'system-introspection'`; (c) `internal-derivation` → `'system-introspection'` (provisional). Three separate statements rather than a single CASE expression so that the provisional-stamp basis is visually distinct in the migration script — a future post-Phase-D reclassification migration can target Step 2c by SQL diff.

**Decision §3.9-D2 — DO $$ block validates zero NULL rows post-backfill.** Defensive check: any row with `source_content_class IS NULL` after the three UPDATEs implies an unrecognized `source_channel` value (outside the v1.8.2 ratified six-channel union). Raises EXCEPTION rather than silently succeeding with NOT NULL constraint failure. Surfaces channel-union drift if present.

**Decision §3.9-D3 — index created in same transaction as column add.** Departs from migration 018 precedent (018 also creates index in the same BEGIN/COMMIT block). Atomic addition: post-COMMIT state has column + backfill + NOT NULL + index all present, or none of them (on ROLLBACK).

---

## §4 Alternatives considered and explicitly rejected

### §4.1 Top-level locus (a) — rejected per §1

Considered as a candidate per spec W2; rejected on S2 + Manual Part II + cross-axis grounds per §1.4 above.

### §4.2 Adding ContentClass as a new top-level shape (not considered by spec; surfaced and rejected)

The deriver considered briefly whether ContentClass might warrant a new typed atom shape (not a closed union but a record `{ classification: 'wearer-life' | 'system-introspection', basis: ... }`). Rejected on three grounds: (1) spec W1 explicitly declares the shape as a closed two-value union, not a record — derivation operates within that scope; (2) any basis or provenance for the classification belongs on `OriginProvenance` (A-05) and is already accommodated by the existing two-tier provenance discipline; (3) A-23 AuthorityAssertion is the closest precedent in shape complexity, but ContentClass has no analogous multi-field structural need — the closure-union pattern of A-21 StateOrdering is the better precedent.

### §4.3 Splitting the value set (e.g., `wearer-life` → `wearer-input` + `wearer-output`) — not considered

Out of scope. Spec W1 declares the two-value union; the deriver does not propose value-set extensions in Shot 1. The closure rule (additive per S3) permits future substrate amendment to extend the value set if a Standard surfaces a need; that is downstream work, not Phase A.

---

## §5 Open items carried forward

None for Phase B entry. Phase B deriver receives v1.8.3 as ratified ground with:

- A-24 declared at substrate §4.2 (closed two-value union, default-derivation table, required-field discipline, boot-time backfill rule).
- Field at locus `StateChangeRecord.metadata.source.contentClass` (sibling on SubstrateSourceRef).
- Channel literals corrected to match v1.8.2 SourceChannel union.
- Runtime type `ContentClass` exported from `src/core/types/substrate.types.ts`; field added to `SubstrateSourceRef` shape.
- Runtime helper `deriveContentClassFromChannel(channel: SourceChannel): ContentClass` exported from same module.
- 11 callsites swept: contentClass populated at every SubstrateSourceRef construction site (6 static `internal-derivation` provisional, 1 static `ai` deterministic, 3 variable via helper, 1 read-side from DB column).
- DB column `source_content_class TEXT NOT NULL` added to `state_change` table via migration 020; backfill applied per default-derivation rule; optional index declared at LM §3.11.
- F-memory R4 wired: INSERT writes the column, 5 SELECT statements read it, `rowToRecord` populates `metadata.source.contentClass` per A-24.

Phase B work (LMA13 axiom + LMA9 filter parameter + LMA7 amendment to reference LMA13) consumes A-24 by reference per substrate §4.3 atom usage discipline. No re-derivation of locus required.

**Phase D mechanical handoff:** six callsites carry `'system-introspection'` provisional literals that Phase D per-Standard amendments will revisit per §3.6 table above. Mechanical edit only — no re-derivation.

**LM §3.11 row promotion path:** the `source_content_class → positions` row is declared optional pending Phase B / Phase D usage evidence; promote to required at the relevant downstream amendment if column-level filtering dominates the query mix.

---

## §6 Confidence and surfacing

Locus derivation: high confidence per §1 tally (three axes for (b), zero for (a)).

Channel-literal correction: mechanical per code-tier source of truth (spec W3 explicitly delegates correction authority to the deriver).

Provisional-stamp framing: per manager Q2 confirmation.

Branch (α) scope expansion: ratified by L0 with MA2 + Categorical-axis-consistency framing. The 11-callsite sweep, helper, migration, and LM §3.11 index entry are mechanical consequences of W4 + the substrate v1.8.3 typed shape, not scope expansion.

LM §3.11 naming ambiguity ("substrate §3.11" → interpreted as LM §3.11): surfaced per §3.8; awaiting confirmation or correction at shot-close ratification. Mechanically additive and trivially reversible if interpretation is wrong.

Gate verification: `npx tsc --noEmit` returns exit 0 with zero errors on the full project after overlay. SG1–SG6 substrate self-audit pass per amended §15 table.

No items requiring L0 surfacing mid-shot beyond the §3.8 naming ambiguity, which is surfaced here for shot-close attention rather than mid-shot pause. Shot 1 proceeds to tar bundling and L0 ratification.

End of derivation log.
