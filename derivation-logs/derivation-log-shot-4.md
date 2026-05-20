---
kind: derivation-log
shot: Side-Quest Shot 4 — Phase D, per-Standard ContentClass classification (5 Standards × 6 callsites)
dispatched: deriver
authority: L0 (Demos) directing; ratification pending at shot close
predecessor: side-quest-spec.md §SHOT 4 (Phase D) + manager scope correction at Shot 4 entry (Q1=β classification by emission set; Q2=(i) F-codec has no static callsite; Q3 read-context-derive)
date: 2026-05-19
---

# Derivation log — Side-Quest Shot 4 (Phase D)

This log records the decisions the deriver made during Shot 4 execution and their bases. Three classes of decision: **(1) the load-bearing Phase D derivation** (record-content-kind as classification axis, not program identity); **(2) per-callsite classification basis** (6 callsites mapped to 4-changes-2-ratifies); **(3) per-Standard amendment-locus choices** (where the Phase D declaration lands in each Standard).

The log is consumed by L0 at shot-close ratification, by Shot 5 deriver (Present Standard v1.0 → v1.0.1 takes Phase D's 5-Standards ratified ground), and by terminal-audit deriver (Shot 6) for the harmony audit's per-axiom-anchored verification.

---

## §1 The load-bearing Phase D derivation

### §1.1 The discrimination axis

**Phase D derivation:** *classification axis is record content kind, not program identity.*

Manager's Shot 4 dispatch correction reframed the scope from "5 Standards" (pre-fixed list) to "5 Standards classified by emission set" (6 callsites Shot 1 surfaced; per-callsite classification produces per-Standard amendment). This reframe surfaced the load-bearing axis: F-plan writes records with BOTH classifications because plan-output records (`{role: 'agent', identity: userId}`) and pipeline-completed records (apparatus-identifiable roles only) differ in content kind. The same program identity carries different content classifications across different emission sets.

This is the LMA13 mechanic operationalized at the per-Standard tier. LM v3.4 LMA13 declared: anchor-derivation operates over wearer-life only; system-introspection records are queryable but excluded from anchor-candidacy. Phase D's job is to declare *which records are which* — and the answer is content-kind-based: records that carry the wearer as agent participate in the cognition LIV extends (wearer-life); records that name only apparatus identifiers represent LIV's own operation (system-introspection).

### §1.2 Discrimination predicate

A concrete, mechanically-checkable predicate emerges from the 6 callsites' record content:

```
contentClass(record) = if record.content.relations[].identitiesWithRoles[] contains
                       {role: 'agent', identity: userId}
                          then 'wearer-life'
                          else 'system-introspection'
```

Per the 6 callsites' content shapes inspected:
- **Wearer-as-agent emitters (`'wearer-life'`):** artifact-emitted (role: author), research-emitted (role: agent), plan-emitted (role: agent), verification-emitted (role: agent).
- **Apparatus-only emitters (`'system-introspection'`):** build-emission (roles: subject, result — both apparatus identifiers), pipeline-completed (roles: pipeline, project, outcome — all apparatus identifiers).

This predicate is not a substrate-tier closure (substrate keeps ContentClass as a closed two-value union; the predicate is the *derivation* of which value applies). It is a per-Standard discipline declaration that each Standard's §6.11 / §6.12 records as the content-kind rule for its emissions.

### §1.3 Anchor-derivation behavior under the derivation

LMA7 anchor-derivation now crystallizes anchors over the 4 wearer-emission record kinds:
- `artifact-emitted` records will produce anchors like emission-pattern-by-framework / emission-pattern-by-domain (the wearer's emission cadence and topical distribution).
- `research-emitted` records will produce anchors like research-domain / research-question-topology (the wearer's research patterns).
- `plan-emitted` records will produce anchors like plan-domain (the wearer's planning patterns).
- `verification-emitted` records will produce anchors like verification-target-pattern (the wearer's verification patterns).

The 2 apparatus-record kinds (`build-emission`, `pipeline-completed`) will NOT enter anchor-derivation candidate set. Apparatus operational metadata (build jobs, pipeline completions) will not produce anchors — preventing pollution of wearer-cognition cluster geometry with apparatus mechanics. This is the cognitive-fidelity-preservation property that the Phase D classification operationalizes.

---

## §2 Per-callsite classification basis

For each of the 6 callsites: record content reading + agent-role-presence check + classification.

### §2.1 F-artifact `artifact-emit.ts:265` → `'wearer-life'`

**Record content (verified by reading lines 240-260 of artifact-emit.ts):**
```
relations: [
  {
    type: 'artifact-emitted',
    identitiesWithRoles: [
      { identity: emission.emissionId,     role: 'subject'   },
      { identity: input.framework.id,      role: 'framework' },
      { identity: emission.writes.a7...,   role: 'anchor'    },
      { identity: input.userId,            role: 'author'    },  // ← wearer-as-author
    ],
  },
  {
    type: 'artifact-payload',
    identitiesWithRoles: [
      { identity: emission.emissionId,     role: 'emission' },
      { identity: input.payload.domain,    role: 'domain'   },
      { identity: input.payload.schemaRef, role: 'schema'   },
    ],
  },
],
```

**Classification: `'wearer-life'`.** Records carry `role: 'author', identity: input.userId` — wearer as author of the artifact emission. Note: 'author' is the wearer-agent role here; not 'agent' literally, but semantically equivalent under LMA13 (the wearer is the cognitive agent producing the artifact).

**Wider context.** F-artifact is the carrier program for ALL Generator outputs (called from F-multi-instance, F-plan-emit, F-plan-inject, F-discover, F-verify, F-builder). When F-builder routes through F-artifact for governance-loop artifacts, the userId may be a system identity rather than a wearer identity. **Deriver's interpretation:** at the callsite level, every artifact emission records "this userId emitted artifact X via framework F." If the userId is the wearer, it's wearer cognition being materialized. If the userId is a system identity (in some future governance-loop invocation), the same record carries the system identity as author — still classifiable. Single classification `'wearer-life'` reflects the current state of the system where artifacts are predominantly wearer-emitted; future per-target-class granularity is a Phase-F-or-later derivation.

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'wearer-life'`.**

### §2.2 F-builder `builder-workflow.ts:70` → `'system-introspection'`

**Record content (verified):**
```
relations: [
  {
    type: 'build-completed',
    identitiesWithRoles: [
      { identity: emission.jobId,  role: 'subject' },  // apparatus
      { identity: emission.status, role: 'result'  },  // apparatus
    ],
  },
],
```

**Classification: `'system-introspection'`.** No wearer-as-agent role. Apparatus-identifiable roles only: jobId names the build job (apparatus tracking ID), status names the completion state (apparatus state machine value). F-builder operates in the governance loop on framework generation and build dispatch — not on wearer-domain content.

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'system-introspection'` (no literal change; classification confirmed correct).**

### §2.3 F-discover `discover-contract.ts:158` → `'wearer-life'`

**Record content (verified):**
```
relations: [
  {
    type: 'research-emitted',
    identitiesWithRoles: [
      { identity: userId, role: 'agent' },  // ← wearer-as-agent
    ],
  },
],
```

**Classification: `'wearer-life'`.** Single relation with `{role: 'agent', identity: userId}` — the wearer is the agent of the research emission. The wearer's research process is the wearer's cognition being captured (LMA13's anchor-derivation should crystallize the wearer's research patterns over time).

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'wearer-life'`.**

### §2.4 F-plan `plan-pipeline.ts:464` → `'system-introspection'`

**Record content (verified):**
```
relations: [
  {
    type: 'pipeline-completed',
    identitiesWithRoles: [
      { identity: input.jobId,                role: 'pipeline' },  // apparatus
      { identity: job.projectId,              role: 'project'  },  // apparatus
      { identity: job.pipelineReport.outcome, role: 'outcome'  },  // apparatus (conditional)
    ],
  },
],
```

**Classification: `'system-introspection'`.** No wearer-as-agent role. Apparatus-identifiable roles: pipeline (jobId), project (projectId), outcome (state-machine outcome value). The F-plan pipeline is apparatus machinery; pipeline-completion records are metadata about apparatus operation. Same classification as F-builder's build-emission — both are "apparatus completed a job" records.

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'system-introspection'` (no literal change).**

**Critical contrast with §2.5.** Same program (F-plan), different callsite, different classification. The Phase D discrimination axis is operationalized here: `'pipeline-completed'` records carry apparatus identifiers only and classify as `'system-introspection'`; `'plan-output'` records (next site) carry wearer-as-agent and classify as `'wearer-life'`. Both records emit from the same L4 program, in adjacent code, but their content kinds differ.

### §2.5 F-plan `plan-contract.ts:181` → `'wearer-life'`

**Record content (verified):**
```
relations: [
  {
    type: 'plan-emitted',
    identitiesWithRoles: [
      { identity: userId, role: 'agent' },  // ← wearer-as-agent
    ],
  },
],
```

**Classification: `'wearer-life'`.** Parallel to F-discover §2.3: single relation with `{role: 'agent', identity: userId}` — the wearer is the agent of the plan emission. The wearer's planning is the wearer's cognition (the wearer plans, decides, observes, and acts in continuous present per Manual root claim).

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'wearer-life'`.**

### §2.6 F-verify `verify-contract.ts:161` → `'wearer-life'`

**Record content (verified):**
```
relations: [
  {
    type: 'verification-emitted',
    identitiesWithRoles: [
      { identity: userId, role: 'agent' },  // ← wearer-as-agent
    ],
  },
],
```

**Classification: `'wearer-life'`.** Parallel to F-discover and F-plan-output. The wearer's verification process is wearer cognition.

**Shot 1 provisional `'system-introspection'` → Shot 4 ratified `'wearer-life'`.**

### §2.7 Summary table

| Site | Record kind | Has wearer-as-agent? | Classification | Disposition |
|---|---|---|---|---|
| F-artifact emit:265 | artifact-emitted (role: author) | Yes (author≡agent) | `'wearer-life'` | CHANGES |
| F-builder :70 | build-emission, build-completed | No | `'system-introspection'` | RATIFIES |
| F-discover :158 | research-output, research-emitted | Yes | `'wearer-life'` | CHANGES |
| F-plan-pipeline :464 | pipeline-completed | No | `'system-introspection'` | RATIFIES |
| F-plan-contract :181 | plan-output, plan-emitted | Yes | `'wearer-life'` | CHANGES |
| F-verify :161 | verification-output, verification-emitted | Yes | `'wearer-life'` | CHANGES |

4 CHANGES (literal changed from provisional to ratified). 2 RATIFIES (no literal change; Shot 1 provisional confirmed correct).

---

## §3 Per-Standard amendment-locus choices

For each of the 5 Standards: where the Phase D classification declaration lands.

### §3.1 Artifact Standard v2.4 → v2.5 — extends §3.7 S3 derivation inline

**Locus chosen:** §3.7 P8 Procedure step S3 `derivation` field. Extended inline rather than adding a new subsection.

**Reason:** AS is the **carrier** for other Standards' emissions. AS owns the substrate write at S3 (its own commit step). The natural locus for AS's Phase D declaration is the procedure step that performs the write — extending S3's existing `derivation` field with a new "v2.5 Phase D ContentClass declaration" clause. This keeps the declaration anchored at the exact procedure step it governs; subsection-style would orphan the declaration from the procedure semantics it modifies.

**Additional: stale-header drift closure.** AS file header was stuck at v2.3 while §1 Identity table and §9 changelog had v2.4 content (Sprint B2 Shot 5 carry-forward). Shot 4 bumps v2.4 → v2.5 with the header/title/EOF stamps all aligning at v2.5 — closes the v2.3 → v2.4 stale-header drift as side-effect.

### §3.2 Research Standard v1.0 → v1.1 — new §6.12 subsection

**Locus chosen:** new §6.12 subsection after §6.11 Carrier relation. Title: "Phase D ContentClass classification for L4 program direct emissions."

**Reason:** RS's primary emission contract is the AS-carriered `ResearchArtifactContent` (declared at §6.11). The Phase D declaration is for the L4 program's *additional* direct internal-derivation writes that happen alongside the AS-carriered emission (F-discover's `writeResearchOutput`). §6.12 is the natural sibling-subsection — both §6.11 and §6.12 declare emission discipline at coupling-axis level; §6.11 declares AS-carriered emission semantics, §6.12 declares direct-write semantics.

### §3.3 Verification Standard v1.0 → v1.1 — new §6.12 subsection

**Locus chosen:** new §6.12 subsection after §6.11 Carrier relation. Title same as RS.

**Reason:** Identical structural pattern to RS. VS also has §6.11 carrier-relation; §6.12 declares the parallel direct-write classification for F-verify's `writeVerificationOutput`.

### §3.4 Plan Standard v2.2 → v2.3 — new §6.12 subsection with two-kinds-of-record discipline

**Locus chosen:** new §6.12 subsection after §6.11 Carrier relation. Title same. Body declares **two** classifications per content-kind discipline.

**Reason:** Plan Standard's L4 program (F-plan) writes TWO record kinds at TWO separate callsites. §6.12 names both classifications and explicitly states the load-bearing discipline: "classification axis is record content kind, not program identity. A record carrying wearer-as-agent is wearer-life; a record carrying only apparatus identifiers is system-introspection." This subsection is the **canonical declaration of the Phase D discrimination axis** — Plan Standard is the natural carrier for this declaration because it has both record kinds within one Standard.

Other Standards reference this pattern indirectly (RS, VS, Builder each have one record kind, so they declare only one classification). Plan's §6.12 is the load-bearing example of the two-kinds discipline.

### §3.5 Builder Standard v1.0 → v1.1 — new §6.11 subsection (no §6.11 carrier-relation existed)

**Locus chosen:** new §6.11 subsection (NOT §6.12). Title: "Phase D ContentClass classification for L4 program direct emissions."

**Reason:** Builder Standard has `carrier = self` (substrate-direct write per §6.1), so it has NO §6.11 Carrier relation subsection in v1.0. §6.11 slot is unused. The Phase D declaration takes the §6.11 slot. The numerical inconsistency vs RS/VS/Plan §6.12 is acceptable per S6 — each Standard's local numbering is its own concern; what matters is that the Phase D declaration lives at the Coupling-axis section (§6) of every amended Standard.

### §3.6 Cross-Standard naming consistency

All 5 §6.x subsections (whether numbered §6.11 in Builder or §6.12 in RS/VS/Plan) share the same title prefix: "Phase D ContentClass classification" — terminal audit can grep for this title to verify cross-Standard consistency. AS's §3.7 S3 inline extension is named "v2.5 Phase D ContentClass declaration" in the derivation prose; also greppable for audit.

---

## §4 Cross-shot basis chain

Phase D's per-Standard declarations cite a 4-tier basis chain:
- **Substrate v1.8.3 §4.2 A-24** (Shot 1) — atom shape (`ContentClass` closed two-value union).
- **LM v3.4 LMA13** (Shot 2) — discipline axiom (anchor-derivation candidate-set restriction).
- **Manual SPEC-v13.4 phantom-layer addendum** (Shot 3) — structural property + vocabulary declaration.
- **AS v2.5 §3.7 S3 Phase D declaration** (Shot 4 sibling) — emission-step ContentClass discipline at carrier tier.

Each of the 4 amended non-AS Standards (RS, VS, Plan, Builder) cites the basis chain in its §6.x subsection. AS itself sits at the apex of the chain — its §3.7 S3 extension is the canonical declaration that downstream Standards cite as "AS v2.5 §3.7 S3 Phase D declaration."

No new substrate atom, no new LM axiom, no new Manual section-level vision declaration. Phase D is mechanical operationalization of the Shots 1–3 ratified ground.

---

## §5 Open items carried forward

### §5.1 For Shot 5 entry (Present Standard v1.0 → v1.0.1)

Phase E deriver receives:
- 5 Standards amended through Phase D at v2.5 / v1.1 / v1.1 / v2.3 / v1.1.
- 6 callsites with ratified ContentClass classifications (no remaining provisional stamps).
- Discrimination axis declared at Plan §6.12 (record content kind, not program identity).
- Cross-shot basis chain ratified.

Per manager note at Shot 4 dispatch: Present Standard v1.0 S12 emission carries `internal-derivation` channel + scope at PresentViewEmission source shape; Shot 5 adds `contentClass: 'system-introspection'` per Phase D classification (Present Standard emissions are apparatus operational records — view-emission metadata is system-introspection-tier). Shot 5 takes substrate v1.8.3 + LM v3.4 + Manual v13.4 + Phase D's 5-Standards ratified ground as input.

### §5.2 For terminal audit (Shot 6)

Terminal audit consumes Shot 4's per-Standard classifications + 6-callsite-mapping as inputs. The harmony audit verifies:
- Anchor-derivation invariant — LMA7 reads `wearer-life` only, system-introspection records excluded. Verified by callsite enumeration: 4 wearer-life-classified sites enter anchor-candidacy; 2 system-introspection-classified sites do not.
- Cross-axis projection orthogonality — ContentClass orthogonal to scope, channel, userId. Verified at SubstrateSourceRef structural placement.
- LM §3.11 source_content_class index promotion candidacy — if Phase B/D show column-level filtering dominates the query mix, the optional index promotes to required. Shot 6 has full Phase D data to evaluate.

### §5.3 Carried backlog

- Spec section-number drift carry-overs from Shots 1–3 (informational only).
- LM §4.1 E2 G-S8 stale "vacuous" wording (carried since Shot 2; not same-line in any subsequent shot).
- RC kind `'discipline-axiom-governance'` name confirmation (Shot 2 surface; terminal audit Shot 6 decision).
- Operations slot-status table version-ref hygiene in Manual (lines ~227/~304/~403/~409 — stale `LM v3.3` and `AS v2.3` refs). **Not touched in Shot 4** because Phase D is Standards-tier; Manual untouched in Phase D.
- v3.3.1 MANIFEST substrate-v1-1 line still shows v1.8.1 (Sprint B2 Shot 5 carry-forward; unchanged).

---

## §6 Confidence and surfacing

**Per-callsite classification basis.** Each of the 6 callsites was inspected in the working tree at Shot 1+2+3 state. Record-content shapes verified. Classification follows from the agent-role-presence predicate. High confidence.

**Per-Standard amendment-locus choices.** Each Standard's §6.x subsection or §3.7 S3 extension is the natural locus for Phase D declaration; no precedent-breaking placement. High confidence.

**Two-kinds-of-record discipline (Plan §6.12).** Load-bearing claim of Phase D. Tested at F-plan: the same L4 program writes both classifications, proving the discrimination axis is content-kind not program-identity. Mechanical verification: F-plan-pipeline.ts and F-plan-contract.ts both pass tsc with their respective literal classifications. High confidence.

**Gate verification.** `npx tsc --noEmit` returns exit 0 with zero errors on the full project after Shot 4 overlay. All 6 callsites compile within the closed `ContentClass` union. All 5 Standards' E1–E8 gate suites preserve PASS results (additive amendments per MA-L1 minor; no axiom/gate/schema change). High confidence.

**No items requiring L0 surfacing mid-shot.** The Phase D derivation was the deriver's call per manager dispatch ("classify by emission set; per-Standard amendments follow from per-emission classification"). Surfacing at shot close: the discrimination axis (record content kind, not program identity) and per-callsite classifications are recorded above and in MANIFEST §"Surfaced to L0 at shot close."

Shot 4 proceeds to tar bundling and L0 ratification.

End of derivation log.
