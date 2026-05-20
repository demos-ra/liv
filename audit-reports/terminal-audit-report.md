---
kind: terminal-audit-report
shot: Side-Quest Shot 6 — Terminal harmony audit
auditor: convergence-checking posture; backlog closures mechanical-only
authority: L0 (Demos) ratification pending at terminal close
date: 2026-05-19
side-quest: ContentClass apparatus alignment (Shots 1-6 complete)
---

# Terminal audit report — Side-Quest Shot 6

## Audit posture and method

**Mode: Verificative.** The auditor's job is to check convergence across 8 independent dimensions, not to re-derive. Single-dimension dissonance returns to manager for routing to the relevant phase deriver. Backlog items closed opportunistically are mechanical-only (no axiom/gate/schema changes; version-ref hygiene + display-only banner alignment + audit-table truth-sync only).

**L0 discipline reminder absorbed:** LIV is multidimensional structure with independent axial projections that unify coherently. Each dimension reads on its own axis — no axis collapses into another. Convergence is the test.

**Convergence requirement:** all 8 dimensions converge on apparatus-harmony finding.

---

## Per-dimension findings

### D1 — Cross-shot basis chain integrity

**Chain:** substrate v1.8.3 §4.2 A-24 → LM v3.4 LMA13 → Manual SPEC-v13.4 phantom-layer addendum → 5 Standards Phase D classification → Present Standard v1.0.1.

**Verification method:** count predecessor citations at each tier.

| Tier | Cites predecessor? | Citation locus |
|---|---|---|
| LM v3.4 LMA13 | Yes — "per substrate v1.8.3 A-24" | §3.2 LMA13 row, §2.1 SourceRef shape, §3.12 vocabulary, §3.13.7 typed-shapes row, §1 RC array |
| Manual SPEC-v13.4 | Yes — "substrate atom A-24 v1.8.3" + "LM v3.4 LMA13" | Canonical naming row, Part I phantom-layer addendum, §10 v13.4 changelog row |
| Artifact Standard v2.5 | Yes — both predecessors cited | §3.7 S3 derivation, §9 v2.5 changelog row |
| Research Standard v1.1 | Yes — both predecessors cited | §6.12 subsection, §9 v1.1 changelog row |
| Verification Standard v1.1 | Yes — both predecessors cited | §6.12 subsection, §9 v1.1 changelog row |
| Plan Standard v2.3 | Yes — both predecessors cited | §6.12 subsection, §9 v2.3 changelog row |
| Builder Standard v1.1 | Yes — both predecessors cited | §6.11 subsection, §9 v1.1 changelog row |
| Present Standard v1.0.1 | Yes — all 4 prior tiers + Phase D siblings cited | §1 Cross-framework input, §2.2 consumed atoms, §2.3 RC array (incl. RC-09), §3.6 PrA3 prose, §3.7 PR4 + PR6 derivations, §6.3 Adjacent-framework, §9 v1.0.1 changelog row |

**Result: D1 CONVERGES.** All chain links cite predecessors. No orphan references. No skipped tiers.

### D2 — Anchor-derivation invariant verification

**Discrimination predicate (per Plan Standard §6.12 canonical declaration):** presence of `{role: 'agent', identity: userId}` in identitiesWithRoles.

**7 callsites enumerated:**

| Site | identitiesWithRoles content | Wearer-as-agent present? | Stamped classification | LMA7 candidacy |
|---|---|---|---|---|
| F-artifact :265 | subject:emissionId, framework:input.framework.id, anchor:anchorNodeId, **author:input.userId** | YES (author≡agent semantically) | `'wearer-life'` | ENTERS |
| F-builder :70 | subject:jobId, result:status | NO | `'system-introspection'` | EXCLUDED |
| F-discover :158 | **agent:userId** | YES | `'wearer-life'` | ENTERS |
| F-plan-pipeline :464 | pipeline:jobId, project:projectId, outcome:outcome (conditional) | NO | `'system-introspection'` | EXCLUDED |
| F-plan-contract :181 | **agent:userId** | YES | `'wearer-life'` | ENTERS |
| F-verify :161 | **agent:userId** | YES | `'wearer-life'` | ENTERS |
| F-present-view-emission (Standard-declared; runtime post-build) | view, intent, operation, scope, focus | NO | `'system-introspection'` | EXCLUDED |

**Counts:** 4 enter LMA7 anchor-candidate set; 3 excluded by LMA13.

**Predicate-prose precision item (PRECISION-D2-1):** F-artifact uses `'author'` role. Plan §6.12 predicate literal cites `'agent'` only. Strict-literal reading would exclude F-artifact from wearer-life classification (no 'agent' role). However, the load-bearing semantic (wearer-as-cognitive-agent) holds at F-artifact — `'author'` is semantically equivalent in the discrimination axis sense.

- **Convergence holds** at the load-bearing axis (wearer-as-cognitive-agent in record content).
- **Mechanical-prose gap** at Plan §6.12: predicate literal cites only `'agent'`; should cite `'agent' (or role-semantic equivalents: 'author', 'creator')` for predicate completeness.
- **Surface to L0** as a recommendation. Not closed at Shot 6 because it modifies axiom-declaration prose at Plan §6.12 — beyond auditor's mechanical-only closure mandate. The classification decision at F-artifact is correct on load-bearing semantics; only the literal-prose-completeness in Plan §6.12 is incomplete.

**Result: D2 CONVERGES with surfaced precision item.** Anchor-derivation invariant holds at every callsite. The precision item is prose-completeness, not classification-correctness.

### D3 — Cross-axis projection orthogonality

**SubstrateSourceRef structural placement (substrate v1.8.3):**
```
SubstrateSourceRef = {
  channel:      SourceChannel
  contentClass: ContentClass
  scope:        ScopeRef
}
```

Three sibling fields. Each independent.

**ThreadQueryInput optional-filter shape (LM v3.4):**
```
ThreadQueryInput = {
  threadKind:    ThreadKind
  anchor:        IdentityRef | PositionRef
  roleFilter?:   RoleRef
  scope?:        ScopeRef
  contentClass?: ContentClass
  window?:       number
  limit?:        number
}
```

Each optional filter independent of others. TQ3 applies filters by AND.

| Classification axis | Carried at write-time on | Carried at read-time on | Independent of |
|---|---|---|---|
| Channel | SubstrateSourceRef.channel | (n/a; not a query primitive) | ContentClass, scope, userId |
| **ContentClass** | SubstrateSourceRef.contentClass | ThreadQueryInput.contentClass? | channel, scope, userId |
| Scope | SubstrateSourceRef.scope | ThreadQueryInput.scope? | channel, ContentClass, userId |
| userId | SubstrateWriteInput.userId (top-level, separate from source) | scope filter implicit | channel, ContentClass, scope |

**Result: D3 CONVERGES.** No axis-conflation. Orthogonality holds at both write-time and read-time.

### D4 — ContentClass propagation completeness

**Enumeration of all `'internal-derivation'` emission paths:**

| Path | ContentClass declaration | Source |
|---|---|---|
| F-artifact artifact-emit.ts:271 | `'wearer-life'` literal | AS v2.5 §3.7 S3 |
| F-builder builder-workflow.ts:78 | `'system-introspection'` literal | Builder v1.1 §6.11 |
| F-discover discover-contract.ts:165 | `'wearer-life'` literal | RS v1.1 §6.12 |
| F-plan-pipeline plan-pipeline.ts:474 | `'system-introspection'` literal | Plan v2.3 §6.12 |
| F-plan-contract plan-contract.ts:189 | `'wearer-life'` literal | Plan v2.3 §6.12 |
| F-verify verify-contract.ts:169 | `'wearer-life'` literal | VS v1.1 §6.12 |

**6 static internal-derivation callsites, all classified.**

| Path | ContentClass declaration | Source |
|---|---|---|
| F-chat chat-contract.ts:546 | `deriveContentClassFromChannel(ch)` | substrate v1.8.3 A-24 default-derivation rule |
| F-identity perimeter-consultation.ts:261 | `deriveContentClassFromChannel(ch)` | same |
| proxy.ts:410 | `deriveContentClassFromChannel(ch)` | same |

**3 variable-channel helper-derived callsites, all classified at runtime per default-derivation rule.**

| Path | ContentClass declaration | Source |
|---|---|---|
| F-chat chat-contract.ts:706 (static `'ai'`) | `'wearer-life'` (deterministic from channel) | substrate v1.8.3 A-24 |
| F-memory substrate-repository.ts:78 (read-side) | `source_content_class` column from DB | LM v3.4 §3.11 + substrate v1.8.3 |

**+2 additional classified emission/read paths.**

**Standard-tier-declared (runtime to follow F-present build sprint):**
- F-present view-emission: `'system-introspection'` (Present Standard v1.0.1 §2.1 PresentViewEmission shape)

**Total: 11 active classified paths + 1 declared (runtime post-build). Zero unclassified emission sites. ContentClass propagation is complete.**

**Result: D4 CONVERGES.**

### D5 — Snowball protection

**Three structural-enforcement layers:**
1. **Substrate type system** — SubstrateSourceRef requires `contentClass: ContentClass` (not optional). `tsc --noEmit` rejects any emission site that omits the field.
2. **LMA13 apparatus-tier axiom** — operates on the ContentClass field at LMA7 candidate-set restriction. Discipline is automatic at the substrate read-path; doesn't matter which program emits the record.
3. **Phase D pattern (mechanical template)** — Standards declare ContentClass classification at §6.x subsection per content-kind discipline; runtime stamps the declared ContentClass at the substrate-write site.

**Test: a hypothetical new Tool (F-newtool) wanting to emit via internal-derivation:**
- Required step 1: Standard amendment with §6.X "Phase D ContentClass classification" subsection (mechanical, per Phase D pattern).
- Required step 2: Runtime callsite stamps the declared ContentClass.
- NOT required: any apparatus-tier (substrate / LM / Manual / metaframework) amendment.
- NOT required: any per-Tool exclusion clause (L3-B style); the apparatus already excludes apparatus-operational records (any record with `contentClass='system-introspection'`) from LMA7 anchor-candidate set by LMA13 construction.

LMA13 carries the discipline at apparatus tier. Per-Tool clauses are not required (L3-B is subsumed; Shot 5 W5 dissolution).

**Result: D5 CONVERGES.**

### D6 — Manual drift-check D1–D7

Manual's own drift-check sweep against side-quest cumulative Manual amendments (v13.4 + Shot 6 backlog closures):

| Manual D-check | Verification | Result |
|---|---|---|
| D1 Part-boundary integrity | Substrate concepts → Part I ✓ (phantom-layer addendum at Part I); Memory loop → Part II ✓; Domain loop → Part III ✓; Governance loop → Part IV ✓; ContentClass canonical-name row → `## Canonical naming` ✓ | PASS |
| D2 Store/substrate conflation | Phantom-layer prose: "ContentClass is an attribute of substrate content, parallel to scope (LMA6); Store remains the program governing substrate mechanics" — distinction preserved | PASS |
| D3 Generator closure violation | No Generator amendment in side-quest | PASS (vacuous) |
| D4 Domain enumeration | No Domain amendment in side-quest | PASS (vacuous) |
| D5 Vision drift | Root claim L28 byte-identical ("LIV extends a wearer's cognition across time"); three-loops byte-identical; six-category program model byte-identical; Path A/B framing byte-identical; Single-store prose at System-L0 §Scope byte-identical | PASS |
| D6 Governance gap | Manual operations slot-status table version-ref hygiene synced at Shot 6 (LM v3.3→v3.4; AS v2.3→v2.5; Plan/RS/VS/Builder v1.0/v2.2 → v1.1/v2.3); F-present row added to Filled slots + Tool inhabitants per Sprint B3 S12 Manual delta (recovered finding at Shot 6) | PASS (after Shot 6 closures) |
| D7 Category conflation | ContentClass is content-classification attribute (vocabulary tier), not program category (program tier); no conflation reintroduced | PASS |

**Result: D6 CONVERGES** (after Shot 6 mechanical closures — three line-level version-ref updates + F-present row additions per Sprint B3 S12 emission delta recovery).

**Finding recovered at Shot 6 (FINDING-D6-1):** The Sprint B3 S12 emission's Manual delta (F-present row in Operations table + F-present row in Tool inhabitants list) was ratified at S12 but never applied to the Manual file between Sprint B3 close and the side-quest. Discovered at D6 audit. **Resolution:** opportunistic-close at Shot 6 via Manual delta application. Without this closure, D6 would have dissonated (Manual not reflecting ratified apparatus state — F-present governed by Present Standard v1.0.1 but absent from Operations table; Tool inhabitants list missing F-present).

### D7 — Substrate single-store invariant

**LMA6 prose byte-identical at LM v3.4** (vs LM v3.3.1):
> "Scope is carried in SourceRef.scope on every state-change. Scope is an open-vocabulary attribute — new scope kinds (user, global, team, project) are new ScopeRef values, not new infrastructure. The substrate stores all state-changes in one physical store."

**Manual single-store prose byte-identical at SPEC-v13.4** (vs SPEC-v13.3 line 132):
> "The substrate is single-store. Scope is an attribute on every persisted state. Per-wearer and shared content live in the same store, distinguished by the scope attribute."

**Phantom-layer addendum claim:** "ContentClass is an additional attribute on contents within the single store, parallel to scope. Per-wearer and shared content live in the same store distinguished by scope; wearer-life and system-introspection content live in the same store distinguished by ContentClass. There is no parallel store, no second substrate, no fork."

**Structural verification:** SubstrateSourceRef carries channel + contentClass + scope as three siblings on one shape, on every state-change record, in one physical store. Not "two stores"; one store with multi-axis classification.

**Result: D7 CONVERGES.**

### D8 — Authority chain integrity

**AmendmentProvenance + L0 traces per shot:**

| Shot | Locus | L0 trace |
|---|---|---|
| Shot 1 | substrate v1.8.3 §16 changelog | `authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot1-pending'}` |
| Shot 2 | LM v3.4 §8 changelog | `authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot2-pending'}` |
| Shot 3 | Manual v13.4 §10 changelog | same Shot-3 timestamp |
| Shot 4 | 5 Standards §9 changelog (each) | Shot-4-pending across all 5 |
| Shot 5 | Present Standard §9 changelog | Shot-5-pending |
| Shot 6 | This MANIFEST + terminal audit report | Shot-6-pending |

**MANIFEST chronicle:** v3.3.1 → v3.3.7 = 6 cycle blocks, each with L0 authority cite per shot.

**Result: D8 CONVERGES.** No unsanctioned amendments. Every version-bump traces to a shot-dispatch + L0 ratification cycle.

---

## Convergence summary

**All 8 dimensions CONVERGE. Apparatus-harmony achieved.**

The wearer-life vs system-introspection distinction holds across:
- Substrate (typed atom A-24 + required field on SubstrateSourceRef)
- LM (LMA13 anchor-derivation candidate-set restriction + LMA9 optional filter)
- Manual (canonical naming + Part I phantom-layer addendum)
- 5 Standards (Phase D ContentClass classification at §6.x or §3.7 S3 inline)
- Present Standard (PresentViewEmission classified as system-introspection)
- Runtime (11 active classified emission/read paths; 0 unclassified)

The brief's convergence test:
> *"The wearer-life vs system-introspection distinction either holds across the entire apparatus or it doesn't; if it doesn't, that's the finding and the work continues until it does."*

**It holds. The work converges.**

---

## Backlog closures (opportunistic, mechanical-only)

| Item | Disposition | Rationale |
|---|---|---|
| 4 of 5 Standard H1 stamps lag | **CLOSED** | 4 single-line edits in scope per Shot 5 dispatch flag; mechanical (display-only banner) |
| LM §4.1 E2 G-S8 stale "vacuous" wording | **CLOSED** | Single-line audit-table truth-sync; the file's §1 RC array has been populated since Sprint B2 Shot 5 (and extended at Shot 2 with LMA13 entry); G-S8 row updated to reflect actual state |
| Manual operations slot-status table version-ref hygiene | **CLOSED** | 3 line-level version updates + Filled-slots table expansion: LM v3.3→v3.4 (L227, L404), AS v2.3→v2.5 (L410), Plan v2.2→v2.3 (L406), Verification v1.0→v1.1 (L407), Research v1.0→v1.1 (L408), Builder v1.0→v1.1 (L409); all mechanical version-ref hygiene |
| Manual S12 emission delta not previously applied (recovered at D6 audit) | **CLOSED** | F-present row added to Filled slots table (Operations) + F-present row added to Tool inhabitants list (Part III) per Sprint B3 S12 Manual delta spec; recovers D6 part-boundary integrity |
| RC kind `'discipline-axiom-governance'` name | **KEPT** with surface-recommendation | Name precisely describes governance-relationship semantic (LMA13 governs file paths from discipline-axiom-tier; not a typed-function-set kind). Renaming to `'typed-function-set'` would conflate file-shape kinds with governance-relation kinds. L0 confirms or renames at next cycle if preferred. |
| v3.3.1 MANIFEST substrate-v1-1 line shows v1.8.1 | **CARRIED** | Predates side-quest (Sprint B2 Shot 5 carry); out of scope per dispatch posture |
| Spec section-number drift carry-overs from Shots 1-5 | **CARRIED** (informational) | Not for closure; informational only per dispatch |

**6 closures applied. 2 carries.**

---

## LM §3.11 index promotion decision

**Decision: DEFER to F-present build sprint.**

**Evidence at terminal audit:**

| Promotion criterion | Status |
|---|---|
| Phase B (LMA13 anchor-derivation filter usage patterns) | **Declared** at substrate-repository.ts TQ3-applies-optional-filter pattern. **Not yet executed** in runtime code (deferred per Shot 2 "Out of scope (Phase B)" — F-present build sprint owns implementation). |
| Phase D (per-Standard internal-derivation classification density) | 6 callsites stamp ContentClass at write-time. Zero query paths *filter by* ContentClass currently. F-present's PR4 is the only declared filter-query path. F-present not yet built. |

**Theoretical vs empirical promotion:** auditor recommends empirical. The index stays optional; F-present build sprint owns the decision when runtime query-mix evidence becomes measurable.

**Surface for L0 awareness:** promotion could be made on theoretical grounds (PR4 derivation explicitly designed for filter usage) — L0 may approve theoretical-grounds promotion now if preferred. Either decision is mechanically additive (optional → required is a discipline change, not a schema change).

---

## Surface to L0 at terminal close

Three precision items recorded for L0 ratification:

1. **PRECISION-D2-1: Plan §6.12 predicate-prose completeness.** F-artifact uses `'author'` role; Plan §6.12 predicate literal cites `'agent'` only. Semantic equivalence holds; classification at F-artifact is correct on load-bearing semantics (wearer-as-cognitive-agent). Mechanical-prose gap: Plan §6.12 should cite `'agent' (or role-semantic equivalents: 'author', 'creator')`. Not closed at Shot 6 because it modifies axiom-declaration prose at Plan §6.12, beyond auditor's mechanical-only closure mandate. Recommendation: open as a one-line edit at next sprint touching Plan Standard.

2. **PRECISION-D5-1: RC kind `'discipline-axiom-governance'`.** Introduced at Shot 2 LM v3.4 LMA13 RC entry block. Precise governance-relationship semantic. L0 confirms or renames at next cycle.

3. **PRECISION-LM-INDEX-1: §3.11 source_content_class index promotion.** Deferred to F-present build sprint per empirical-evidence criterion. L0 may approve theoretical-grounds promotion now if preferred.

**Recovered finding at Shot 6 (FINDING-D6-1):** Sprint B3 S12 emission Manual delta not previously applied. Resolved via opportunistic-close at Shot 6 (2 Manual row additions). D6 part-boundary integrity now holds. No further action needed.

---

## Side-quest closure

Side-quest closes at Shot 6 with apparatus-harmony achieved across all 8 audit dimensions. Final MANIFEST stamp: **v3.3.7 — SIDE-QUEST CLOSURE**.

Apparatus handoff to F-present implementation cycle (post-side-quest build sprint).

End of terminal audit report.
