---
kind: apparatus-state-summary
shot: Side-Quest Shot 6 — Terminal close
date: 2026-05-19
handoff: F-present implementation cycle (post-side-quest build sprint)
---

# Apparatus state summary — Side-quest close

## Final ratified versions (post-Shot-6)

| Component | Pre-side-quest | Post-side-quest (final) |
|---|---|---|
| Substrate | v1.8.2 | **v1.8.3** |
| Living Memory | v3.3.1 (file v3.3 stale-header) | **v3.4** |
| Manual SPEC | v13.3 | **v13.4** |
| Artifact Standard | v2.3 header (v2.4 §1+changelog) stale-header drift | **v2.5** (drift closed at Shot 4) |
| Research Standard | v1.0 | **v1.1** |
| Verification Standard | v1.0 | **v1.1** |
| Plan Standard | v2.2 | **v2.3** |
| Builder Standard | v1.0 | **v1.1** |
| Present Standard | (not in framework tree; v1.0 S12 emission ratified but unformatted) | **v1.0.1** (first appearance at Path 3) |
| Metaframework v3-1 | v3.3.1 | unchanged (no metaframework-tier amendments needed at side-quest) |
| Generation procedure | v1.1.7 | unchanged |
| LIV-Standard | v1.5.2 | unchanged |
| Placement Standard | v1.0 | unchanged |
| Perimeter Standard | v1.2.1 | unchanged |
| MANIFEST cycle | v3.3.1 | **v3.3.7 (SIDE-QUEST CLOSURE)** |

## What changed at each shot

### Shot 1 — Phase A (substrate)
- **Substrate v1.8.2 → v1.8.3.** A-24 ContentClass atom added (closed two-value union `'wearer-life' | 'system-introspection'`).
- **SubstrateSourceRef shape extended:** added required `contentClass: ContentClass` field, sibling to channel + scope.
- **Helper `deriveContentClassFromChannel(channel)`** exported from `src/core/types/substrate.types.ts` implementing the default-derivation rule (5 channels deterministic, 1 polymorphic).
- **11 runtime callsites swept** across 7 program areas. 6 static `'internal-derivation'` sites provisionally stamped `'system-introspection'` (superseded at Shot 4). 1 static `'ai'` site stamped `'wearer-life'`. 3 variable-channel sites use helper. 1 read-side reads DB column.
- **F-memory R4 wired:** `source_content_class TEXT NOT NULL` column added to `state_change` table via migration `020-content-class.sql`. INSERT writes column; 5 SELECT column lists extended; `rowToRecord` populates `metadata.source.contentClass`.
- **LM §3.11:** `source_content_class → positions` row added as optional optimization (folded into LM v3.4 changelog at Shot 2).
- **Gate:** `npx tsc --noEmit` exit 0 zero errors.

### Shot 2 — Phase B (Living Memory)
- **LM v3.3.1 → v3.4** (closes v3.3 stale-header drift as side-effect).
- **LMA13 ContentClass discipline axiom added** at §3.2 Structure axis (axiom count 12 → 13). Anchor-derivation (LMA7) operates over `wearer-life` records only; `system-introspection` excluded from anchor-candidacy.
- **LMA7 in-place clause amendment** at §3.2: body extended with candidate-set restriction clause referencing LMA13.
- **LMA9 mechanical clarification:** thread-kind primitives accept optional `contentClass?: ContentClass` filter parameter.
- **ThreadQueryInput.contentClass? optional field** added at substrate.types.ts (backward-compatible; zero callsite sweep needed).
- **§2.1 SourceRef shape** documents three-field shape (channel + contentClass + scope) reflecting substrate v1.8.3. Channel union opportunistically extended with `'system-l0'` (closes B2 Shot 5 stale-list).
- **§3.11 + §3.12 + §3.13.7** indices/vocabulary/typed-shapes tables extended with ContentClass entries.
- **§1 Structure-axis RC array +1 entry block** citing LMA13 read paths (new RC kind `'discipline-axiom-governance'` introduced).

### Shot 3 — Phase C (Manual)
- **Manual SPEC-v13.3 → SPEC-v13.4.**
- **Canonical naming +1 row:** `ContentClass` (closed two-value classification; substrate atom A-24 v1.8.3 canonical declaration; anchor-derivation reads `wearer-life` only).
- **Part I — Substrate end-of-part addendum:** new `### The phantom layer` subsection. Three structural claims declared:
  - Single-store preserved (ContentClass attribute parallel to scope; no parallel store).
  - Root claim mechanically preserved (LMA7 reads wearer-life only).
  - Phantom layer named (system-introspection content structurally present, queryable, but excluded from anchor-candidacy).
- **Vision NOT amended:** root claim L28 byte-identical, three-loops byte-identical, six-category byte-identical, Path A/B byte-identical, single-store prose byte-identical.

### Shot 4 — Phase D (5 Standards + 6 callsites)
- **5 Standards Phase D ContentClass classification:**
  - **Artifact Standard v2.4 → v2.5** (§3.7 S3 derivation inline extension; F-artifact records → `'wearer-life'`; closes v2.3 stale-header drift as side-effect).
  - **Research Standard v1.0 → v1.1** (§6.12 subsection; F-discover records → `'wearer-life'`).
  - **Verification Standard v1.0 → v1.1** (§6.12 subsection; F-verify records → `'wearer-life'`).
  - **Plan Standard v2.2 → v2.3** (§6.12 subsection; **canonical two-kinds-of-record discipline declaration site**; F-plan plan-output → `'wearer-life'`, F-plan pipeline-completed → `'system-introspection'`).
  - **Builder Standard v1.0 → v1.1** (§6.11 subsection — Builder has no §6.11 carrier-relation, slot reused; F-builder build-emission → `'system-introspection'`).
- **6 runtime callsites:**
  - 4 changed from provisional `'system-introspection'` to ratified `'wearer-life'` (F-artifact, F-discover, F-plan-contract, F-verify).
  - 2 ratified at `'system-introspection'` with comment update only (F-builder, F-plan-pipeline).
- **Load-bearing Phase D derivation:** classification axis is **record content kind**, not program identity. Discrimination predicate: presence of `{role: 'agent', identity: userId}` (or role-semantic equivalent) in identitiesWithRoles.

### Shot 5 — Phase E (Present Standard)
- **Present Standard v1.0 → v1.0.1** (Path 3 first appearance in framework tree).
- **File format** mirrors Verification Standard §1-§9 layout; carrier=self mechanics borrow from Builder Standard §6.1.
- **Substrate-version-pin v1.8.2 → v1.8.3.**
- **Consumed-frameworks pins:** LM v3.3 → v3.4, Manual SPEC-v13.3 → SPEC-v13.4.
- **PresentViewEmission.source.contentClass = `'system-introspection'`** declared at §2.1 PresentViewEmission shape. Classification mirror to Builder Standard v1.1 §6.11 (apparatus operational metadata content kind).
- **PrA3 byte-additive append** declaring ContentClass discipline for view-emission records.
- **PR4 derivation extended** with ThreadQueryInput.contentClass? filter usage pattern (anchor-candidate-derivation reads pass `'wearer-life'`; full state reads omit).
- **RC array 8 → 9** (RC-09 added for `PresentViewEmission.source.contentClass`; substrate-atom-ref to A-24, strongest grounding class).
- **L3-B dissolution** mechanically verified at S2 (zero L3-B clauses in v1.0 emission); documented in §9 v1.0.1 change log as apparatus-level mechanism subsuming per-Tool exclusion discipline.

### Shot 6 — Terminal audit + opportunistic backlog closure
- **8-dimension convergence audit:** all 8 dimensions PASS.
- **5 mechanical backlog closures:**
  - 4 of 5 Standard H1 stamps updated (research-standard.md v1-0→v1-1; verification-standard.md v1-0→v1-1; plan-standard.md v2-2→v2-3; builder-standard.md v1-0→v1-1).
  - LM §4.1 E2 G-S8 row truth-synced (removed "vacuous" wording; describes actual populated RC array).
  - Manual L227 LM v3.3 → v3.4.
  - Manual Operations Filled-slots table version-ref hygiene synced (LM v3.3→v3.4; AS v2.3→v2.5; Plan v2.2→v2.3; Verification v1.0→v1.1; Research v1.0→v1.1; Builder v1.0→v1.1).
  - F-present row added to Filled slots + F-present row added to Tool inhabitants list per Sprint B3 S12 Manual delta (recovered finding at D6).
- **MANIFEST v3.3.6 → v3.3.7** with terminal-audit-complete declaration and side-quest closure.

## Cumulative count deltas

| Item | Δ |
|---|---|
| Substrate atoms | +1 (A-24 ContentClass) |
| LM axioms | +1 (LMA13 ContentClass discipline) |
| LM §3.11 indices | +1 (source_content_class → positions, optional) |
| LM §3.12 vocabulary terms | +1 (ContentClass) |
| LM RC array entries (Structure axis) | +1 (LMA13 governance entry block) |
| Manual canonical-naming rows | +1 (ContentClass) |
| Manual Part I subsections | +1 (`### The phantom layer`) |
| Manual change-log rows | +1 (v13.4) |
| Standards amended (Phase D) | 5 minor bumps |
| Standards added to tree | +1 (Present Standard v1.0.1 first appearance) |
| Standard §6.x Phase D classification subsections | 4 new (RS/VS/Plan §6.12, Builder §6.11) + 1 inline extension (AS §3.7 S3) |
| Runtime callsites with ContentClass stamp | +11 (6 static internal-derivation + 1 static ai + 3 helper-derived + 1 read-side) |
| Helper functions added | +1 (deriveContentClassFromChannel) |
| DB migrations | +1 (020-content-class.sql) |
| MANIFEST cycle blocks | +6 (v3.3.2 through v3.3.7) |

## Apparatus state for F-present build sprint handoff

**Present Standard v1.0.1 declares:** F-present operates as the L3 Tool-category runtime program implementing the 5-operation wearer-callable surface over substrate state. The Standard is fully formatted in the framework tree.

**Runtime invariants F-present must implement at build time:**
- **8 axioms PrA1–PrA8** (§3.6) — content-shape identity, provenance-to-substrate completeness, substrate-write closure at view-emission only (with `contentClass: 'system-introspection'`), scope+userId carry-through, operation closure at five, substrate-read closure at four primitives, geometry-non-persistence with view-witness disambiguation, anchor-and-weighting determinism.
- **8 PR procedure steps PR1–PR8** (§3.7) — stage monotonicity 1→2×5→3→5; PR4 reads via ThreadQueryInput with `contentClass: 'wearer-life'` for anchor-candidate reads (omit for full state reads); PR6 writes PresentViewEmission via writeStateChange with three-field SourceRef (`internal-derivation` + `system-introspection` + scope).
- **8 PrG gates PrG1–PrG8** (§4.2) — 1:1 with axioms per G-M1; PrG3 + PrG6 carry contentClass test clauses.
- **6 HRs** (§6.2) — HR-PR-LM, HR-PR-Substrate-Write, HR-PR-PS, HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter.

**LM substrate-read implementations to complete during F-present build sprint** (deferred per Shot 2 "Out of scope (Phase B)"):
- `substrate-repository.ts` thread-query read paths (readByPosition, iterateAxisRows, readIdentityRecurrence, readAdjacency) to consume `ThreadQueryInput.contentClass` filter when present.

**LM §3.11 index promotion decision** owed to F-present build sprint:
- `source_content_class → positions` index currently optional. Promote to required if F-present runtime query-mix shows column-level filtering dominates (or accept theoretical-grounds promotion now if L0 prefers).

**framework-audit first-execution** owed:
- Present Standard v1.0.1 E1–E8 gate suite ran 87/87 PASS at S2-revalidation against v1.0 emission; v1.0.1 amendments are additive. Auditor-asserted 87/87 PASS for v1.0.1 expected. First runtime execution by framework-audit at F-present build sprint will confirm.

## Three precision items surfaced to L0 at terminal close

1. **PRECISION-D2-1** — Plan §6.12 predicate-prose completeness (cite `'agent' (or role-semantic equivalents: 'author', 'creator')`). One-line edit at next sprint touching Plan Standard.
2. **PRECISION-D5-1** — RC kind `'discipline-axiom-governance'` name confirmation. L0 confirms or renames at next cycle.
3. **PRECISION-LM-INDEX-1** — `source_content_class → positions` index promotion: empirical (defer to F-present build) or theoretical (now). Either path mechanically additive.

## Closure statement

**ContentClass apparatus alignment side-quest closes successfully at Shot 6.**

All 8 audit dimensions converge on apparatus-harmony. The wearer-life vs system-introspection distinction holds across the entire apparatus. The phantom layer is named, mechanically preserved, and apparatus-tier enforced via LMA13. The single-store invariant holds. The root claim is preserved. Snowball protection holds — future Tools inherit LMA13 automatically.

Handoff complete. F-present implementation cycle takes the ratified apparatus as ground.

End of apparatus state summary.
