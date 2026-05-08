---
kind: framework
placement: frameworks/slices/
---

# F-discover

> **Doc-lag acknowledgment (Structure-Tightening Sprint close, F-004 closure):** the body of this SLICE.md references F-codec encoding (codec-discovery.ts) for epistemic-mode routing. **F-codec was dissolved at Sprint 8 Shot 3a.** F-discover remains reachable via direct programmatic invocation (`executeResearchFromInput()` from R3); the codec-mediated dispatch path is presently inactive. Substantive SLICE.md rewrite for the post-F-codec dispatch path is queued for Sprint 9.

**Identity:** Research Standard v1.0 authoring program — composes RA1–RA10 research artifact from a `ResearchInput` + per-domain `ResearchBinding` and emits via AS v2.2.

**Ownership:** F-discover owns the orchestration logic that turns a research request into a structurally valid `ResearchArtifactContent`. F-discover does **not** own encoding (F-codec), graph reads (F-memory R3), AS emission mechanics (F-artifact), or Research Standard atom declarations (core/R5). (A1)

**Current scope:** epistemic-mode authoring program. Sprint 5 v1.0 close: programmatic invocation only — codec routes epistemic-mode user messages to `narrative-discovery` (LLM, F-codec/codec-discovery.ts, renamed in Shot 2). F-discover is reachable via `executeResearchFromInput()` from R3 directly. First L4 tenant of Research Standard.

## Composition Path

F-discover does **not** call the LLM. RA1..RA10 evaluation is mechanical per substrate §6.3 six-class taxonomy. By the time `executeResearch` runs, the caller has already constructed a `ResearchInput` carrying the question, prior knowledge surface, and `ResearchBinding` instance.

F-discover composes the research artifact algorithmically (pure, deterministic) per RA1..RA10 and emits via F-artifact's `createArtifact` at HR-RS3.

RA8 self-application closure is one-step structural — RS guarantees `R → R''` only; recursive descent `R'' → R'''` is consumer-owned per spec §1 scopeOut.

## Identity Layers

Three identifiers, three concerns. Disambiguation matters at audit:

| Layer | Identifier | Carrier site | Purpose |
|---|---|---|---|
| F-codec module-id | `'liv-discovery'` | `DISCOVER_FRAMEWORK_MODULE.id` (FrameworkModule) | Registry lookup key + dashboard surfacing |
| AS framework-id | `'research'` (Research Standard) | `CreateArtifactInput.framework.id`, `payload.domain` | Content framework that defines the artifact's structural contract — Research Standard v1.0 |
| F-discover authoring-program-id | `'F-discover'` (caller-supplied at `ResearchInput.authoringProgram.programId`) | `ResearchArtifactContent.producedBy.programId` | Who built the research — distinct from what the research IS structurally |

Sprint 5 D-RS-MODULE-ID + Shot 2 namespace cohabitation: codec-discovery.ts retains its module under the renamed id `'narrative-discovery'` (LLM narrative discovery, distinct concern). F-discover takes `'liv-discovery'`. Both modules persist; names match function. Mirror of Sprint 4 D5 codec-verify rename.

## User-facing Protocol

At Sprint 5 close: programmatic only.

1. Caller constructs `ResearchExecuteInput` = `{ researchInput, classification }`:
   - `researchInput`: question + binding + priorKnowledge + caller session context.
   - `classification`: `{ classificationNodeId, primitive, confidence }` — Cognitive Standard R3 `encodeLLM()` result for the same turn (caller threads at boundary; not in RS schema.input).
2. Caller invokes `executeResearchFromInput(input)`.
3. F-discover R2 runs G-RS1 input gate (pre-compose short-circuit). Fail → `RESEARCH_INPUT_INVALID`.
4. F-discover R1 composes `ResearchArtifactContent` (mechanical per RA1..RA10).
5. F-discover R1 runs G-RS1..G-RS10 fail-fast. Fail → `RESEARCH_VALIDITY_FAILED` + `failedAxiom`.
6. F-discover R2 calls AS v2.2 `createArtifact` with `framework.id='research'`, `payload.domain='research'`, `dependsOn=input.priorKnowledge.artifactRefs` per spec §6.11 ArA4d dependency-edge requirement. Fail → `RESEARCH_EMISSION_REJECTED`.
7. Returns `ResearchEmissionResult { ok: true, data: ArtifactEmission }` — researchAnchorNodeId at `data.writes.a7.artifactAnchorNodeId`.

## Decision-D Rows

| Row | Value |
|---|---|
| D-RS5-EPOCHMS-LOCATION | RS spec §2.4 cites `EpochMs` as primitives.ts; primitives does not declare it. Resolution: declare locally in `research-standard.types.ts` per VS+Plan precedent (verification-standard.types.ts:106 + plan-standard.types.ts:136 line-for-line). Mechanically derived. (Sprint 5 build cycle.) |
| D-RS-MODULE-ID | F-discover FrameworkModule id = `'liv-discovery'` (Sprint 5 build cycle, Demos confirmed). codec-discovery.ts retains its module renamed `'discovery' → 'narrative-discovery'` in Shot 2. Both persist. Mirror of Sprint 4 D5 (`'verification' → 'narrative-audit'` + `VERIFY_FRAMEWORK_MODULE.id = 'liv-verification'`). |
| D-RS-BINDING-V1 | Sprint 5 ships LIV-architecture **smoke binding** (1 InvestigationMethod methodKind='lookup', 1 SourceCriterion groundingClass='reference-resolution'). Smoke evidence: lookup against substrate §2 mode enumeration → 1 finding for the root question (root-as-leaf per RA3 rootSet rule), `truthValue='resolved'`, `resolvedContent` = 4-mode enumeration, 1 sourceRef. Exercises RA1 + RA3 (cardinality + enum-membership over methodKind) + RA4 (resolved finding has ≥1 sourceRef + groundingClass per substrate §6.3) + RA5 (all-resolved branch). Vacuous-closure branch covered by gate logic alone, not exercised in smoke. (Sprint 5 build cycle, Demos confirmed; mechanically derived from Sprint 4 D3 γ precedent + RS R1 patch enabling `methodKind: 'lookup'` non-decomposing single-finding smoke.) |
| D-RS-VERSION-INITIAL | `INITIAL_RESEARCH_VERSION = '1.0.0'`. Re-research version logic lands when first amend cycle requires (parallel to F-verify D-VERSION-INITIAL + F-plan D-PA5-VERSIONING). |
| D-RS-EXECUTOR-STUB | F-discover's `DISCOVER_FRAMEWORK_MODULE.executor` is a stub at v1.0. Codec does not route epistemic-mode mechanical messages to F-discover yet — programmatic invocation is the active path (`executeResearchFromInput`). Stub returns `LIV_DISCOVERY_EXECUTOR_UNREACHABLE` if reached. Mirror of F-verify D-EXECUTOR-STUB. |
| D-RS-RA7-PREEMISSION | G-RS7 immutability gate: vacuous-pass at pre-emission. AS v2.2 ArA5 is the mechanical enforcer post-emission per spec §6.11 boundary note. Pattern parallel to F-verify D-VA8-PREEMISSION + F-plan PA9. |
| D-RS-RA8-SYNTHESIS | G-RS8 one-step closure: synthesize a notional re-input from content (priorKnowledge.artifactRefs ⊇ [ref(R)]), run gateRS1 over it, return OK iff structurally valid. Does NOT actually re-invoke RS (one-step closure is structural, not procedural). Mirror of F-verify D-VA9-SYNTHESIS. |
| D-RS-PROJECT-SCOPE | At v1.0, F-discover does not require projectId. Caller threads `ResearchInput.userId + turnId` only. AS v2.2 is the carrier (not v2.3); ArA4c chain key on `(framework.id, userId)` is sufficient. When AS v2.3 lands, F-discover amends to thread projectId. Mirror of F-verify D-PROJECT-SCOPE. |

## Standards Bound

- **Research Standard v1.0** (consumed): F-discover composes RA1..RA10 against atoms declared at `core/R5/research-standard.types`. F-discover does not redeclare any RS atom (A1).
- **Artifact Standard v2.2** (carrier): F-discover emits via `createArtifact()` from `@/features/F-artifact/contract/artifact-contract`. F-discover does not implement AS axioms — it consumes AS as carrier.
- **LIV-Standard v1.5.1** (mechanical): A1–A7 enforced by IN-AUDIT pipeline at sprint close.
- **Cognitive Standard v1.2** (upstream chain): F-discover consumes caller-supplied classification triple (`classificationNodeId`, `primitive`, `confidence`) at the AS boundary; never invokes Cognitive primitives directly.
- **Verification Standard v1.0** (sibling at L3): verificative-mode mode-primitive sibling. Pattern precedent throughout F-discover (F-verify slice).
- **Plan Standard v2.2** (sibling at L3): structural-mode mode-primitive sibling.

## Sprint 5 Close Criteria Coverage

- [x] **D1** `core/R5` types file `research-standard.types.ts`. Every spec §6.5 Custody "L3 (this file §X + core/R5)" row resolves.
- [x] **D2** F-discover slice with all 5 layers (config, domain, app, contract, exec). Build + lint will be confirmed at deploy.
- [x] **D3** LIV-architecture smoke binding instance (1 InvestigationMethod methodKind='lookup', 1 SourceCriterion groundingClass='reference-resolution', 1 resolved finding exercising RA5 all-resolved branch).
- [ ] **D4** `f-tags.json` declared_slices += `F-discover` (Shot 2).
- [ ] **D5** namespace migration applied — codec-discovery.ts `id: 'discovery' → 'narrative-discovery'`, F-discover takes `'liv-discovery'`, both registered at codec-orchestrate (Shot 2).
- [ ] **First end-to-end emission** — exercised by smoke harness post-deploy. `executeResearchFromInput()` against a `LivArchitectureSubstrateProbe` priorKnowledge surface returns `ResearchEmissionResult { ok: true, data: ArtifactEmission }`. RS `stateApplied: 'declared' → 'applied'`, AmendmentEvent kind `'first-run'` logged per spec §8.1. Deferred to Sprint 8 per L0 directive (RS spec §5.4).
- [ ] **G-RS1..G-RS10 first-run** — all `executed` + all `passed` on smoke priorKnowledge. Deferred to Sprint 8.
- [ ] **L0 confirmation of first-run** — pending post-deploy. Deferred to Sprint 8.
