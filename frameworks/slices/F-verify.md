---
kind: framework
placement: frameworks/slices/
---

# F-verify

> **Doc-lag acknowledgment (Structure-Tightening Sprint close, F-004 closure):** the body of this SLICE.md references F-codec encoding (codec-verify.ts) for verificative-mode routing. **F-codec was dissolved at Sprint 8 Shot 3a.** F-verify remains reachable via direct programmatic invocation (`executeVerificationFromInput()` from R3); the codec-mediated dispatch path is presently inactive. Substantive SLICE.md rewrite for the post-F-codec dispatch path is queued for Sprint 9.

**Identity:** Verification Standard v1.0 authoring program — composes VA1–VA9 verification artifact from a `VerificationInput` + per-domain `VerificationBinding` and emits via AS v2.2.

**Ownership:** F-verify owns the orchestration logic that turns a verification request into a structurally valid `VerificationArtifactContent`. F-verify does **not** own encoding (F-codec), graph reads (F-memory R3), AS emission mechanics (F-artifact), or Verification Standard atom declarations (core/R5). (A1)

**Current scope:** verificative-mode authoring program. Sprint 4 v1.0 close: programmatic invocation only — codec routes verificative-mode user messages to `narrative-audit` (LLM, F-codec/codec-verify.ts). F-verify is reachable via `executeVerificationFromInput()` from R3 directly. First L4 tenant.

## Composition Path

F-verify does **not** call the LLM. Predicate evaluation is mechanical per substrate §6.3 six-class taxonomy. By the time `executeVerification` runs, the caller has already constructed a `VerificationInput` carrying the target reference, evidence W-ATOM, and `VerificationBinding` instance.

F-verify composes the verification artifact algorithmically (pure, deterministic) per VA1..VA9 and emits via F-artifact's `createArtifact` at HR-VS3.

VA9 self-application closure is one-step structural — VS guarantees `V → V''` only; recursive descent `V'' → V'''` is consumer-owned per spec §1 scopeOut.

## Identity Layers

Three identifiers, three concerns. Disambiguation matters at audit:

| Layer | Identifier | Carrier site | Purpose |
|---|---|---|---|
| F-codec module-id | `'liv-verification'` | `VERIFY_FRAMEWORK_MODULE.id` (FrameworkModule) | Registry lookup key + dashboard surfacing |
| AS framework-id | `'verification'` (Verification Standard) | `CreateArtifactInput.framework.id`, `payload.domain` | Content framework that defines the artifact's structural contract — Verification Standard v1.0 |
| F-verify authoring-program-id | `'F-verify'` (caller-supplied at `VerificationInput.authoringProgram.programId`) | `VerificationArtifactContent.producedBy.programId` | Who built the verification — distinct from what the verification IS structurally |

Sprint 4 D5 namespace cohabitation: codec-verify.ts retains its module under the renamed id `'narrative-audit'` (LLM narrative audit, distinct concern). F-verify takes `'liv-verification'`. Both modules persist; names match function.

## User-facing Protocol

At Sprint 4 close: programmatic only.

1. Caller constructs `VerificationExecuteInput` = `{ verificationInput, classification }`:
   - `verificationInput`: target ref + binding + evidence + caller session context.
   - `classification`: `{ classificationNodeId, primitive, confidence }` — Cognitive Standard R3 `encodeLLM()` result for the same turn (caller threads at boundary; not in VS schema.input).
2. Caller invokes `executeVerificationFromInput(input)`.
3. F-verify R2 runs G-VS1 input gate (pre-compose short-circuit). Fail → `VERIFICATION_INPUT_INVALID`.
4. F-verify R1 composes `VerificationArtifactContent` (mechanical per VA1..VA9).
5. F-verify R1 runs G-VS1..G-VS9 fail-fast. Fail → `VERIFICATION_VALIDITY_FAILED` + `failedAxiom`.
6. F-verify R2 calls AS v2.2 `createArtifact` with `framework.id='verification'`, `payload.domain='verification'`, `dependsOn=[target.artifactRef]`. Fail → `VERIFICATION_EMISSION_REJECTED`.
7. Returns `VerificationEmissionResult { ok: true, data: ArtifactEmission }` — verificationAnchorNodeId at `data.writes.a7.artifactAnchorNodeId`.

## Decision-D Rows

| Row | Value |
|---|---|
| D-MODULE-ID | F-verify FrameworkModule id = `'liv-verification'` (Sprint 4 D5, Demos confirmed). codec-verify.ts retains its module renamed `'verification' → 'narrative-audit'`. Both persist. |
| D-BINDING-V1 | Sprint 4 ships LIV-Standard **smoke binding** (3 structural-property predicates against a known target shape). Full 153-predicate binding deferred to Sprint 4.x post pre-pass classification work. (Sprint 4 D3 γ, Demos confirmed.) |
| D-VERSION-INITIAL | `INITIAL_VERIFICATION_VERSION = '1.0.0'`. Re-verification version logic lands when first amend cycle requires (parallel to F-plan D-PA5-VERSIONING). |
| D-EXECUTOR-STUB | F-verify's `VERIFY_FRAMEWORK_MODULE.executor` is a stub at v1.0. Codec does not route mechanical verificative-mode messages to F-verify yet — programmatic invocation is the active path (`executeVerificationFromInput`). Stub returns `LIV_VERIFICATION_EXECUTOR_UNREACHABLE` if reached. |
| D-VA8-PREEMISSION | G-VS8 immutability gate: vacuous-pass at pre-emission. AS v2.2 ArA5 is the mechanical enforcer post-emission per spec §6.11 boundary note. Pattern parallel to F-plan PA9. |
| D-VA9-SYNTHESIS | G-VS9 one-step closure: synthesize a notional re-input from content, run gateVS1 over it, return OK iff structurally valid. Does NOT actually re-invoke VS (one-step closure is structural, not procedural). |
| D-PROJECT-SCOPE | At v1.0, F-verify does not require projectId. Caller threads `VerificationInput.userId + turnId` only. AS v2.2 is the carrier (not v2.3); ArA4c chain key on `(framework.id, userId)` is sufficient. When AS v2.3 lands, F-verify amends to thread projectId. |
| D-EVIDENCE-PATH-GRAMMAR | Dot-separated property names (e.g. `'foo.bar.baz'`). Domain-extensible: a binding may declare a richer path grammar so long as resolution remains mechanical per substrate §6.3. v1.0 resolver: `resolveEvidencePath` in compose-verification.ts. |

## Standards Bound

- **Verification Standard v1.0** (consumed): F-verify composes VA1..VA9 against atoms declared at `core/R5/verification-standard.types`. F-verify does not redeclare any VS atom (A1).
- **Artifact Standard v2.2** (carrier): F-verify emits via `createArtifact()` from `@/features/F-artifact/contract/artifact-contract`. F-verify does not implement AS axioms — it consumes AS as carrier.
- **LIV-Standard v1.5.1** (mechanical): A1–A7 enforced by IN-AUDIT pipeline at sprint close.
- **Cognitive Standard v1.2** (upstream chain): F-verify consumes caller-supplied classification triple (`classificationNodeId`, `primitive`, `confidence`) at the AS boundary; never invokes Cognitive primitives directly.
- **Plan Standard v2.2** (sibling at L3): structural-mode mode-primitive sibling. Pattern precedent throughout F-verify (F-plan slice).

## Sprint 4 Close Criteria Coverage

- [x] **D1** `core/R5` types file `verification-standard.types.ts`. Every spec §6.5 Custody "L3 (this file §X + core/R5)" row resolves.
- [x] **D2** F-verify slice with all 5 layers (config, domain, app, contract, exec). Build + lint will be confirmed at deploy.
- [x] **D3** LIV-Standard smoke binding instance (3 structural-property predicates, all `groundClass ∈ §6.3`).
- [x] **D4** `f-tags.json` declared_slices += `F-verify`.
- [x] **D5** namespace migration applied — codec-verify.ts `id: 'verification' → 'narrative-audit'`, F-verify takes `'liv-verification'`, both registered at codec-orchestrate.
- [ ] **First end-to-end emission** — exercised by smoke harness post-deploy. `executeVerificationFromInput()` against a `LivFrameworkDeclarationProbe` evidence W-ATOM matching VS's own identity returns `VerificationEmissionResult { ok: true, data: ArtifactEmission }`. VS `stateApplied: 'declared' → 'applied'`, AmendmentEvent kind `'first-run'` logged per spec §8.1.
- [ ] **G-VS1..G-VS9 first-run** — all `executed` + all `passed` on smoke evidence.
- [ ] **L0 confirmation of first-run** — pending post-deploy.
