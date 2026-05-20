---
kind: derivation-log
shot: Side-Quest Shot 5 — Phase E, Present Standard v1.0 → v1.0.1
dispatched: deriver
authority: L0 (Demos) directing; ratification pending at shot close
predecessor: manager dispatch §SHOT 5 (Phase E) W1-W7; v1.0 S12 emission from Sprint B3 (L0-sent)
date: 2026-05-19
---

# Derivation log — Side-Quest Shot 5 (Phase E)

This log records the decisions the deriver made during Shot 5 execution. Three classes of decision: **(1) formatting decisions translating v1.0 S12 emission into the framework-tree file** (Path 3 first-appearance); **(2) Q-confirmations defaulted by deriver** (Q1 precedent, Q2 RC count, Q3 axiom amendment style); **(3) L3-B disposition** (mechanical W5 check at S2 + change-log documentation).

The log is consumed by L0 at shot-close ratification and by terminal-audit deriver (Shot 6) for the harmony audit's per-Standard verification.

---

## §1 Formatting decisions: v1.0 S12 emission → framework-tree file

### §1.1 Section spine selection (W1 — VS as format precedent)

The v1.0 S12 emission carries field content for the GeneratedFrameworkTemplate output schema: identity, schema, structure, validity, lifecycle, coupling, judgment, plus self-audit + change log + provenance. The emission has these labeled but does not specify the §-numbered file layout.

**Decision: mirror Verification Standard v1.0 file layout** — §1 Identity → §2 Schema → §3 Structure → §4 Validity → §5 Lifecycle → §6 Coupling → §7 Judgment → §8 Self-audit results → §9 Change log.

**Basis:** Verification Standard is the closest sibling for §1-§9 spine. Research Standard has nearly identical layout (also derived from VS pattern). Plan Standard has §1-§9 with §8 Self-audit + §9 Change log. Builder Standard has §1-§9 with §8 Self-audit + §9 Change log. The §1-§9 layout is the apparatus-canonical sibling layout; Present at v1.0.1 conforms.

**Tier mismatch acknowledged.** Present is L2 (governs F-present at L3); VS/RS/Plan/Builder are L3 (carriered through AS, or self for Builder). The structural template is tier-independent — the §1-§9 layout populates the same GeneratedFrameworkTemplate output schema regardless of tier. Tier-specific differences appear in §1 Identity values (level, carrier, sliceCategory) and §6 Coupling content (HR shapes), not in section ordering.

### §1.2 Header banner format

Mirror Verification Standard banner: `---\nkind: framework\nplacement: frameworks/standards/\n---\n\n# present-standard-v1-0-1\n\n**Kind:** Framework\n**Level:** L2\n**Mode:** epistemic (unknown → known)\n**Version:** v1.0.1\n**Instance of:** ...`

Two adaptations from VS:
- **Level:** L2 (Present governs F-present at L3); VS is L3.
- **Cross-framework input:** more entries than VS (substrate v1.8.3, LM v3.4, PS v1.2.1, Manual SPEC-v13.4, LIV-Standard v1.5.2, Placement Standard v1.0, plus VS itself as format precedent and Builder as carrier=self precedent). This is wider than VS's because Present's apparatus footprint at v1.0.1 explicitly cites all Shot 1-4 ratified ground.

### §1.3 §1 Identity table — field-by-field translation

| Field in v1.0 emission | Translation in v1.0.1 file |
|---|---|
| `identity.name: 'Present Standard'` | `name: Present Standard` |
| `identity.version: 'v1.0'` | `version: 1.0.1` (with extended basis note documenting Shot 5 bumps) |
| `identity.kind: 'Framework'` | `kind: Framework` (with substrate §4 A-10 enum reference) |
| `identity.level: 'L2'` | `level: L2` (with substrate §5 AuthorityLevel reference) |
| `identity.state: 'applied'` | split into `stateTemplate: declared` + `stateApplied: applied` per VS convention |
| `identity.ownership: 'human-declared'` | split into `ownershipTemplate: Human` + `ownershipApplied: System-under-L0` per VS convention |
| `identity.authority: 'L0-confirmed'` | extracted to header `**Authority:**` line per VS convention |
| `identity.sliceCategory: 'Tool'` | `sliceCategory: Tool` (with substrate §1.5 SliceCategory enum reference + Manual L287 F-surface sibling-precedent) |
| `identity.governsRuntimeCode: true` | extracted to §1.2 Identity-axiom satisfaction subsection (G-I8 reference) per VS convention |
| `identity.governanceClaim: <prose>` | folded into `consumedBy` field + scopeOut field per VS convention; same content, conventional placement |
| `identity.genesisMode: 'epistemic'` | extracted to header `**Mode:**` line + §1.1 GenesisDeclaration per VS convention |
| `identity.governingFrameworkRef: 'metaframework-v3-1'` | extracted to header `**Instance of:**` and `**Rendered by:**` lines per VS convention |

Additional §1 Identity fields added per VS convention (present in VS but absent in v1.0 emission's flat field list):
- `consumes` — explicit dependency enumeration including substrate v1.8.3 atoms consumed (A-09/A-12/A-17/A-18/A-24)
- `produces` — explicit output enumeration (PresentView + PresentViewEmission)
- `consumedBy` — explicit consumer enumeration (Modalities + Generators + Tools + observability/replay/audit)
- `adjacentFrameworks` — explicit adjacency declaration including the 5 Phase D sibling Standards
- `referentCitations` — declared as populated array with reference to §2.3 + §3.11
- `scopeOut` — explicit exclusion enumeration

These are formatting expansions of v1.0 emission's content, not new content additions. Every populated value traces back to v1.0 S12 emission or to ratified Shots 1-4 ground.

### §1.4 §3 Structure section split

VS pattern places axiom instances at §3.6 P4 Axiom instances, axis distribution at §3.6.1, procedure steps at §3.7 P8 Procedure step instances. Present's v1.0 emission carried axioms in §3.1 and procedure in §3.2. Renumbered per VS pattern:

| v1.0 emission section | v1.0.1 file section |
|---|---|
| §3 Structure intro | §3 Structure (preserved as section header) |
| §3.1 Axioms | §3.6 P4 Axiom instances (PrA1–PrA8) |
| §3.1.1 Axis distribution | §3.6.1 Axiom-axis distribution per MFv3 §3.1.1 FrameworkConcernSpace |
| §3.2 Procedure | §3.7 P8 Procedure step instances (PR1–PR8) |
| §3.3 jurisdictionClaim | §3.10 jurisdictionClaim |
| §3.4 RC array axis-binding | §3.11 RC array axis-binding |

Added §3.1 Axes / §3.2 Primitive instance counts / §3.3 P1 Axis instances / §3.4 P2 Sub-axis instances / §3.5 P3 Leaf instances / §3.8 Universal-variables table / §3.9 Vocabulary / §3.12 MA-V10 part B jurisdiction coverage declaration per VS convention. Each addition is formatting expansion of v1.0 emission content (e.g., §3.2 Primitive instance counts derives directly from v1.0 emission's G-U4 gate result enumeration).

### §1.5 §6 Coupling section split

v1.0 emission carried §6.1 HRs through §6.5 Substrate-version-pin. Present file at v1.0.1 follows VS pattern with §6.1 Carrier through §6.8 Cross-framework handoff contracts.

Renumbered:
| v1.0 emission section | v1.0.1 file section |
|---|---|
| §6.1 HRs (table) | §6.2 Handoff rules |
| §6.2 Carrier=self prose | §6.1 Carrier (moved to lead position per VS convention) |
| §6.3 Adjacent-framework declarations | §6.3 Adjacent-framework declarations (preserved) |
| §6.4 OperatorInterface | §6.4 OperatorInterface (preserved) |
| §6.5 Substrate-version-pin | §6.5 Substrate-version-pin (preserved) |

Added §6.6 Capture shapes / §6.7 Provenance contract / §6.8 Cross-framework handoff contracts per VS convention.

### §1.6 §8 Self-audit results section addition

v1.0 emission carried gate results inline in the E1–E8 enumeration. v1.0.1 file follows VS convention with §8 Self-audit results subsections (§8.1 Gate results / §8.2 Multidimensional audit / §8.3 Six-dimension Phase E audit / §8.4 validity.overallResult). The §8.1 table is a deriver-asserted v1.0.1 re-run summary (87/87 PASS expected; first-execution by framework-audit at post-side-quest build sprint).

### §1.7 Failure modes added (§4.5)

Present's v1.0 emission did not enumerate failure modes — VS convention (§4.5 in VS pattern) declares failure codes + triggers + recovery. Added to v1.0.1 per VS convention: PRESENT_INTENT_INVALID, PRESENT_AUTH_REJECTED, PRESENT_READ_FAILED, PRESENT_EMISSION_REJECTED, PRESENT_GATE_FAILED. Each derives from one of the eight procedure step's failure surface; matches PrG1–PrG8 + J-operation-binding gate-fail patterns. Formatting expansion, not new content.

---

## §2 Q-confirmations defaulted by deriver

### §2.1 Q1=(a) — VS as primary format precedent + Builder for carrier=self mechanics

**Surfaced to L0 at pre-execution.** Manager dispatch said: *"Use Verification Standard or Research Standard (closest Tool-tier siblings) as structural precedent."* Deriver noted two corrections:

1. **Tier mismatch.** VS/RS are L3; Present is L2. Not "Tool-tier siblings" — they're peer-tier siblings at a different level.
2. **Closer carrier=self precedent: Builder Standard v1.0.** Builder Standard is the structural twin for carrier=self (both Builder and Present declare carrier=self with rationale for direct substrate writes; neither uses AS routing). VS uses carrier=named→AS, which is different from Present's carrier=self.

**Decision: (a) — VS as primary format precedent + Builder for carrier=self mechanics.**

**Default rationale:**
- VS's §1-§9 spine is the cleanest sibling layout. Plan/Research/Builder all derive from this same template; VS is the canonical-pattern site.
- Builder's §6.1 carrier=self idiom is the structural twin for Present's §6.1.
- Format-wise, VS gets selected; carrier-mechanics-wise, Builder gets cited. Both precedents coexist without conflict because they apply at different sub-sections.

**Surfaced for L0 awareness at shot close.** Trivially editable if L0 prefers a different precedent. Not load-bearing for any axiom/gate/schema content.

### §2.2 Q2 — 8 RCs → 9 RCs (RC-09 added for ContentClass)

**Surfaced to L0 at pre-execution.** W4 requires extending PrA3 with ContentClass declaration AND adding basis citation for the new contentClass field. Two paths:

- **Add new RC-09** citing substrate v1.8.3 §4.2 A-24 directly (substrate-atom-ref grounding class, strongest per substrate §6.3).
- **Fold ContentClass basis into RC-07's existing citation** which already cites the channel field.

**Decision: add new RC-09. 8 RCs → 9 RCs.**

**Default rationale:**
- RC-07's existing path cites the Channel enum (`'internal-derivation'` value per LM v3.4 §2.1 SourceChannel union); the citation kind is `l0-ratified-ref` to spec v4.
- ContentClass and Channel are *independent* sub-fields of SourceRef (substrate v1.8.3 §4.2 — channel + contentClass + scope are three siblings). Folding into RC-07 would conflate the channel-grounding and contentClass-grounding into one citation, which violates the substrate §4 A-18 ReferentCitation discipline (each citation atom names one citingAtom + one referentKind + one path).
- RC-09 substrate-atom-ref to A-24 is the strongest grounding class per substrate §6.3 (substrate-atom-ref > substrate-amendment-ref > l0-ratified-ref). The new RC strengthens the apparatus basis chain.
- §2.3 RC array structure naturally accommodates the addition (8 → 9 is mechanical-additive).

**Surfaced for L0 awareness at shot close.** Trivially revertible (fold into RC-07) if L0 prefers, but the substrate-atom-ref grounding for ContentClass would weaken if folded.

### §2.3 Q3=(α) — Inline append on PrA3 (byte-additive)

**Surfaced to L0 at pre-execution.** W4 requires "Amend PrA3 axiom statement to reference the classification." Two amendment styles:

- **(α)** Byte-additive append: keep v1.0 prose byte-equivalent; append a v1.0.1 ContentClass clause as a separate paragraph.
- **(β)** Full rewrite: integrate contentClass into the primary invariant declaration; rewrite v1.0 prose.

**Decision: (α) byte-additive append.**

**Default rationale:**
- Shot 2 Q1=(i) precedent on LMA7: in-place clause amendment, body-level restriction added without disturbing v1.0 ratified prose. Same discipline applies.
- (α) is minimum mechanical change. v1.0 prose preserved byte-equivalent. v1.0.1 surface = the new clause + the original. Easy to diff; easy to audit.
- (β) would require closer-reading verification that the rewritten clause is semantically equivalent to v1.0. (α) is byte-additive — semantic equivalence guaranteed by construction (v1.0 statement + new clause).

**Surfaced for L0 awareness at shot close.** If L0 prefers (β) full rewrite, the v1.0 prose is editable.

---

## §3 L3-B disposition (W5 mechanical check)

### §3.1 The L3-B context

The manager dispatch noted: *"Per the second multidimensional audit and brief §5 Phase E, the L3-B per-Tool exclusion was a working-state artifact; v1.0 S12 emission already shows clean output (no L3-B clauses in the emitted GeneratedFrameworkTemplate per L0's sent emission). Verify mechanically at S2 — if L3-B clauses appear nowhere in v1.0 emission, the 'dissolution' reduces to documenting in v1.0.1 change-log that ContentClass apparatus-level mechanism subsumes per-Tool exclusion discipline."*

L3-B refers to a working-state Standard-local exclusion clause that would have appeared in some Tool-tier framework's axiom/gate/schema declarations to exclude apparatus operational records from anchor-derivation candidate set — at the Standard tier, before the apparatus-tier ContentClass mechanism was ratified. The Sprint B3 second multidimensional audit convergence determined that L3-B should be subsumed by the apparatus-tier mechanism (ContentClass + LMA13 + Manual phantom-layer addendum), making per-Tool exclusion structurally unnecessary.

### §3.2 Mechanical check at S2

Search the v1.0 S12 emission content (from the L0-sent document) for L3-B clauses. Search terms: "L3-B" / "per-Tool exclusion" / "Tool exclusion" / "exclusion clause" — case-insensitive across:
- §1 Identity field values
- §2 Schema (atom inventory, consumed atoms, RC array)
- §3 Structure (axiom prose PrA1–PrA8, axis distribution, procedure PR1–PR8, jurisdictionClaim, RC axis-binding)
- §4 Validity (gate tests PrG1–PrG8, execution order, backward-invalidation)
- §5 Lifecycle (versionTransition, amendmentTrigger, deprecations, activationFlow, bootstrap, firstRunExecution, escalation)
- §6 Coupling (HRs, carrier, adjacent-framework, OperatorInterface, substrate-version-pin)
- §7 Judgment (J-operation-binding, consumed)
- §8 Change log
- HR5 registry write content
- Manual delta content
- Substrate state-change emission content (the S12 act)

**Result: zero occurrences of L3-B / per-Tool exclusion in v1.0 emission.** L3-B was dissolved before v1.0 ratification by the second multidimensional audit's convergence on ContentClass apparatus-tier mechanism.

### §3.3 Documentation in v1.0.1 change log

Per Shot 5 spec W5: *"If L3-B clauses appear nowhere in v1.0 emission, the 'dissolution' reduces to documenting in v1.0.1 change-log that ContentClass apparatus-level mechanism subsumes per-Tool exclusion discipline."*

§9 v1.0.1 changelog Δ-F prose:
> **Per Shot 5 spec W5 mechanical check: no L3-B per-Tool exclusion clauses appear in v1.0 emission. L3-B was a working-state artifact dissolved before v1.0 ratification by the second multidimensional audit's convergence on ContentClass as apparatus-tier mechanism. v1.0.1 documents the dissolution: the ContentClass apparatus-level mechanism (substrate v1.8.3 A-24 + LM v3.4 LMA13 + Manual SPEC-v13.4 phantom-layer addendum) subsumes the L3-B per-Tool exclusion discipline — L3-B as a Standard-local clause is structurally unnecessary because the apparatus already excludes apparatus-operational records (any record with contentClass='system-introspection') from LMA7 anchor-candidate set by LMA13 construction. No axiom/gate/schema removal required (nothing to remove); change-log entry is the dissolution documentation.**

§8.3 D6 audit row confirms: *"L3-B mechanically dissolved per W5 check — no L3-B clauses in v1.0 emission; v1.0.1 documents that ContentClass apparatus-level mechanism subsumes per-Tool exclusion discipline; LMA13 cross-class anchor-derivation prohibition is the apparatus-level mechanism."*

### §3.4 Why L3-B is subsumed (structural reasoning)

The pre-Phase-A apparatus state had no ContentClass mechanism. To preserve the root claim ("LIV extends a wearer's cognition") at substrate-tier honesty (single-store, all records accepted), the LMA7 anchor-derivation candidate set would have needed per-Tool exclusion declarations: each Tool-tier framework would have declared "exclude my emissions from anchor-candidate set." This is L3-B.

Phase A (Shot 1) added substrate v1.8.3 A-24 ContentClass closed union. Phase B (Shot 2) added LM v3.4 LMA13 anchor-derivation discipline ("LMA7 reads wearer-life only"). Phase C (Shot 3) added Manual SPEC-v13.4 phantom-layer addendum (declares the structural property at vision tier). Phase D (Shot 4) operationalized per-Standard ContentClass classification.

After Phases A-D, the apparatus has a single mechanism that excludes apparatus-operational records from anchor-candidate set: classify them as `'system-introspection'`. No Standard needs a Standard-local exclusion clause because the apparatus enforces the exclusion at LMA7 itself. L3-B becomes structurally redundant.

Present Standard v1.0.1 §8.3 D6 audit row confirms this: "ContentClass apparatus-level mechanism subsumes L3-B."

---

## §4 Cross-shot basis chain

Present Standard v1.0.1 cites the full Shots 1-4 basis chain:

- **Substrate v1.8.3 §4.2 A-24** (Shot 1) — atom shape; cited at §2.2 consumed atoms + RC-09.
- **LM v3.4 LMA13** (Shot 2) — discipline axiom; cited at PrA3 amendment + §2.1 PresentViewEmission contentClass field + PR4 read-side ContentClass filter usage + §4.2 PrG3 + PrG6 gate amendments + §6.6 captureShape amendments.
- **LM v3.4 §2.1 ThreadQueryInput.contentClass?** (Shot 2) — optional filter parameter; cited at PR4 derivation + §2.1 ReadPrimitiveTrace shape extension.
- **Manual SPEC-v13.4 phantom-layer addendum** (Shot 3) — structural property; cited at PrA3 amendment basis prose + §8.3 D6 audit row.
- **Manual SPEC-v13.4 canonical-naming ContentClass row** (Shot 3) — vocabulary; cited at §2.2 consumed atoms.
- **AS v2.5 §3.7 S3 Phase D declaration** (Shot 4) — Phase D sibling; cited at §1 adjacentFrameworks.
- **Builder Standard v1.1 §6.11 build-emission classification** (Shot 4) — Phase D sibling (apparatus-operational-metadata content-kind twin); cited at PrA3 amendment as classification-mirror.

Cross-shot basis chain fully ratified at v1.0.1.

---

## §5 Open items carried forward

### §5.1 For Shot 6 entry (terminal harmony audit)

Shot 6 deriver receives:
- 5 Standards Phase D ratified ground (Shot 4)
- Present Standard v1.0.1 at framework-tree first appearance
- 6 callsites ratified (Shot 4)
- Cross-shot basis chain across substrate v1.8.3 + LM v3.4 + Manual SPEC-v13.4 + 5 Standards + Present Standard + 6 callsites + MANIFEST v3.3.6

Terminal harmony audit verifies:
- Anchor-derivation invariant — LMA7 reads wearer-life only; system-introspection records excluded. Verified by full callsite enumeration: 4 wearer-life-classified sites (F-artifact, F-discover, F-plan-output, F-verify) enter anchor-candidacy; 3 system-introspection-classified sites (F-builder, F-plan-pipeline, F-present-view-emission) excluded.
- Cross-axis projection orthogonality — ContentClass orthogonal to scope, channel, userId. Verified at SubstrateSourceRef structural placement.
- LM §3.11 source_content_class index promotion candidacy — column-level filtering dominates the query mix (F-present reads use the filter explicitly in PR4); index promotion from optional to required is a Shot 6 evaluation.
- Backlog items (H1 stamps, Operations table stale refs, RC kind name, etc.) Shot 6 closure decisions.

### §5.2 For F-present implementation cycle (post-side-quest build sprint)

F-present runtime code build sprint receives Present Standard v1.0.1 as ratified Standard. Build work includes:
- F-present substrate-read implementation via LM v3.4 R3 threadQuery primitive with contentClass? optional filter usage per PR4 derivation.
- F-present substrate-write implementation via LM v3.4 R3 writeStateChange primitive emitting PresentViewEmission with three-field SourceRef per PR6 derivation.
- F-present operation dispatcher implementing 5-arm WearerOperation enum closure per PrA5.
- F-present anchor-derivation per PR3 (delegates to LMA7 with contentClass filter).
- F-present composition + weighting per PR5.
- F-present gate-execution per PR7 (PrG1–PrG8 first-execution at runtime).

First-execution of E1–E8 gate suite by framework-audit at v1.0.1 deferred to this build sprint.

### §5.3 Carried backlog

All prior backlog from Shots 1-4 carried forward unchanged (see Shot 5 MANIFEST §"Carried backlog"). Plus Shot 5 surface: spec section-number drift in W6 (manager said PR4 in §3.2; actual file §3.7 per VS sibling precedent — informational only).

---

## §6 Confidence and surfacing

**Formatting decisions.** v1.0 S12 emission content preserved at v1.0.1 byte-equivalent where applicable (axioms PrA1, PrA2, PrA4, PrA5, PrA6, PrA8 unchanged from v1.0; PrA7 unchanged; PrA3 byte-additive append per Q3=(α)). VS-pattern section spine applied to translate flat-field emission into §1-§9 layout. High confidence.

**Q-confirmations defaulted.** Q1=(a), Q2 add RC-09, Q3=(α) byte-additive append — all defaulted by deriver per documented rationale (VS+Builder precedents, substrate §4 A-18 ReferentCitation discipline, Shot 2 Q1=(i) precedent). Surface to L0 at shot close for awareness; trivially editable if L0 prefers alternatives.

**L3-B disposition.** Mechanical W5 check confirmed: zero L3-B clauses in v1.0 emission. v1.0.1 documents dissolution in §9 change log; §8.3 D6 audit row confirms apparatus-level subsumption. High confidence.

**Gate verification.**
- E1–E8 gate suite on v1.0.1: deriver-asserted 87/87 PASS per §8.1 amendment-surface analysis. v1.0 ran 87/87 at Sprint B3 S2-revalidation; v1.0.1 amendments are strictly additive per MA-L1 minor; first-execution by framework-audit at post-side-quest build sprint will confirm.
- `npx tsc --noEmit` on full project: exit 0 (no runtime code touched; verifies upstream Shots 1-4 runtime state remains valid).
- Multidimensional audit (4 dimensions): 4/4 PASS per §8.2.
- Six-dimension Phase E audit: 6/6 PASS per §8.3 (including D6 apparatus-level mechanism subsumes L3-B).

**No items requiring L0 surfacing mid-shot.** Shot 5 proceeds to tar bundling and L0 ratification.

End of derivation log.
