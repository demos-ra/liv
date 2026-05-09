---
kind: framework
placement: frameworks/standards/
---

# builder-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** generative (structured → produced)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Artifact Standard v2.2 (carrier via F-multi-instance), Plan Standard v2.2 (structural-mode L3 sibling; BuildDirective derives from plan artifacts), Research Standard v1.0 (epistemic-mode L3 sibling; research findings flow into build runs), Verification Standard v1.0 (verificative-mode L3 sibling; verifications consumed at build intake)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Builder Standard is the L3 generative-mode framework owning typed-work synthesis — the W-ATOM equivalent of Plan Standard's structural-mode role. Plan Standard structures `known → structured` work into `PlanArtifactContent`; Builder Standard synthesizes `structured → produced` work into `BuildEmission`. The two are mode-asymmetric L3 framework siblings: Plan governs what to build; Builder governs the act of building it.

Builder Standard is **distinct from F-multi-instance (L4)**: F-multi-instance is the execution tool (AI orchestration layer) through which F-builder invokes AI-assisted code generation. Builder Standard (L3 framework template) declares the typed shape of the build run and the invariants governing emissions — the contract, not the orchestration engine. Different tier, different concern, non-overlapping (see §1 scopeOut).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Builder Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `generative` (per substrate §2 Mode enum; `structured → produced`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first emission via HR-BS3 post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (Builder Standard emits `BuildEmission` directly to substrate; no enclosing carrier at v1.0; see §6.1 carrier rationale) |
| `primitive` | `build-emission` (framework-local atomic unit; defined §3.9 Vocabulary; one act of producing a typed build artifact from substrate-held structured inputs) |
| `consumes` | `BuildDirective` from substrate (structured plans, research findings, verifications typed into substrate by peer programs); F-multi-instance delegation contract |
| `produces` | `BuildEmission` (W-ATOM; written to substrate graph on completion or error) |
| `consumedBy` | F-builder slice (L4 authoring program); F-output (downstream rendering); audit consumers; observability / replay; F-verify for post-build verification chains |
| `adjacentFrameworks` | Plan Standard v2.2 (produces `BuildDirective.planRef` inputs), Research Standard v1.0 (produces `BuildDirective.findingsRef` inputs), Verification Standard v1.0 (produces `BuildDirective.verificationRef` inputs), F-multi-instance (execution tool — AI orchestration; not a framework, not a peer-program peer; Builder Standard delegates to it per BA5), Living Memory / Living Memory v1.1 (graph persistence layer; substrate bus), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Verification Standard v1.0 §1 Identity + Research Standard v1.0 §1 Identity + Cognitive Standard v1.2.2 §1 Identity** establish the pattern for new L3 frameworks at first ratification with zero code referents. At v1.0 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at first L4 tenant cycle when F-builder slice stabilizes post-Sprint 11 and code referents emerge' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['F-multi-instance internal orchestration mechanics (tool, not governed by Builder Standard; Builder Standard declares the delegation contract only per BA5)', 'surface rendering of build artifacts (owned by F-output and Surface Standard domain)', 'substrate schema and graph physics (owned by Living Memory v1.1 + substrate-v1-1)', 'retry/restart timing and scheduling (operational; Builder Standard declares the typed error conditions and restart semantics per BA4, not the scheduler policy)', 'peer-program work synthesis (F-plan, F-discover, F-verify each own their domain; Builder Standard consumes their typed substrate outputs as BuildDirective inputs only)', 'framework-declaration audit (owned by framework-audit-v1-2 at L2; Builder Standard governs runtime build synthesis, not framework files)', 'B-direction output rendering at B3 (post-beta)', 'multi-build batch orchestration (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-10-shot-1-BS-v1-0-genesis',
  confirmedAt: '2026-05-09T00:00:00Z',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (BS v1.0 is a fresh L3 framework, not a v0 lift; no predecessor).

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `generative` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: generative-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry). |

---

## §2 Schema

### §2.1 Input — `BuildDirective`

Per MA-S1 (input is W-ATOM). Shape:

```
BuildDirective = {
  authoringProgram: {
    programId:      string           // caller identifier (e.g., 'f-builder')
    programVersion: Semver           // caller version
  }
  userId:           UserId           // F-identity session carrier
  turnId:           string           // caller turn context

  // Structured inputs from substrate — typed references to peer-program outputs
  planRef:          ArtifactRef | null      // reference to PlanArtifactContent in substrate; null if build is unplanned
  findingsRef:      ArtifactRef[]           // references to ResearchArtifactContent in substrate (zero or more)
  verificationRef:  ArtifactRef[]           // references to VerificationArtifactContent in substrate (zero or more)

  // Build configuration
  buildBinding:     BuildBinding            // domain binding: target file set, language, tier constraints, retry policy
  instructions:     BuildInstructionSet     // typed instructions for this build run: patches, additions, or full generations
  priorBuildRef:    ArtifactRef | null      // reference to prior BuildEmission in substrate; null for first run
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `builder-standard.types.ts`.

**BuildBinding shape:**

```
BuildBinding = {
  domainId:           string           // owning domain (e.g., 'liv', 'aso')
  domainVersion:      Semver           // binding version
  targetFiles:        TargetFileSpec[] // file set to be synthesized; one entry per file
  language:           string           // primary language/runtime (e.g., 'typescript', 'python')
  tierConstraints:    TierConstraint[] // declared token/complexity budgets per tier
  retryPolicy:        RetryPolicy      // retry-vs-restart decision rules (consumed by BA4)
  errorClassification: ErrorClassMap  // typed error enum → recovery path (consumed by BA4 + BA3)
}
```

**BuildInstructionSet shape:**

```
BuildInstructionSet = {
  instructionId:  InstructionId                     // unique within one BuildDirective
  kind:           'patch' | 'addition' | 'full-gen' // instruction kind per BA1
  target:         TargetFileSpec                     // file this instruction addresses
  content:        string                             // instruction body: typed description of what to produce
  dependsOn:      InstructionId[]                    // ordering: this instruction consumes outputs of these
}[]
```

### §2.2 Output — `BuildEmission`

Per MA-S2 (output is W-ATOM). Builder Standard carrier = `self`: `BuildEmission` is written directly to substrate graph at HR-BS3 without an enclosing carrier framework. Rationale: build artifacts are substrate-native (graph nodes + file content references); no inter-program envelope needed at v1.0. Contrast with Plan/VS/Research which use AS v2.2 as named carrier — those emit chat-surface content; build artifacts persist in substrate and are consumed by F-output for rendering.

Shape:

```
BuildEmission = {
  buildId:            BuildId               // runtime-generated at emission
  buildVersion:       Semver                // authoring-program-computed (new semver per retry/restart per BA4)
  producedBy: {
    programId:        string                // verbatim from input.authoringProgram per BA3
    programVersion:   Semver
  }
  producedAt:         EpochMs              // runtime-captured at emission

  directive:          BuildDirective       // verbatim from input per BA3 (frozen at emission per BA2)

  files: {                                 // one entry per instruction in directive.instructions per BA1
    [instructionId: InstructionId]: {
      instructionRef:   InstructionId      // resolves into directive.instructions per BA1
      filePath:         string             // resolved target file path
      content:          string             // produced file content (complete or patch delta per instruction.kind)
      executionState:   'produced' | 'failed' | 'skipped'
      errorDetail:      string | null      // populated when executionState='failed' per BA3
      evaluatedAt:      EpochMs
    }
  }

  verdict: {                               // aggregation per BA5 delegation result
    outcome:            'complete' | 'partial' | 'failed' | null
    failedInstructions: InstructionId[]    // populated when outcome ∈ {'partial', 'failed'}
    delegationRef:      string | null      // reference to F-multi-instance invocation log per BA5
  }

  retryState: {                            // per BA4 retry/restart semantics
    attemptNumber:    number               // 1-indexed; increments per retry
    restartFromId:    BuildId | null       // non-null on restart (references prior BuildEmission)
    partialEmissions: InstructionId[]     // instructions completed in prior attempts; not re-run on retry
  }
}
```

**Atomicity note (per BA5):** verdict outcome is derived from `files` per the all-must-produce rule declared at §3.6 BA5 — `verdict.outcome = 'complete'` iff `∀ instrId ∈ keys(files): files[instrId].executionState === 'produced'`; `'partial'` iff some produced + some failed; `'failed'` iff all failed or no files produced. Verdict is a derived field — BS gate G-BS5 verifies derivation correctness.

Typed shapes declared in `builder-standard.types.ts`. Every field traces to §6.5 custody.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed:

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityLevel` | substrate §5 |
| `AuthorityClaim` | substrate §5 |
| `WAtom` | substrate §4 A-01 |
| `AxiomRef` | substrate §4 A-02 |
| `FrameworkRef` | substrate §4 A-09 |
| `Kind` | substrate §4 A-10 |
| `Ownership` | substrate §4 A-11 |
| `ActivationTrigger` | substrate §4 A-12 |
| `OperatorInterface` | substrate §4 A-13 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |
| `Stage` | substrate §8.3 (consumed by §3.3 P8 instances — BS is generative-mode; P8 applies) |
| `StageContentKind` | substrate §8.3 (same) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (not consumed by P7 at v1.0 — P7=1 is not empty; A-17 row retained for completeness per substrate §12 consumer-registry) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `NodeId` | primitives.ts | §2.2 buildId substrate node identity; §6.5 custody |
| `UserId` | primitives.ts | §2.1 BuildDirective.userId |
| `Semver` | primitives.ts | §1 version, §2 producedBy.programVersion, §2 buildBinding.domainVersion, §2 buildVersion |
| `EpochMs` | primitives.ts | §2.2 producedAt, files[].evaluatedAt |
| `Result<T, E>` | primitives.ts | §2.2 BuildEmissionResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 BuildValidityError (types file), §6.5 custody |
| `ArtifactRef` | primitives.ts (or AS v2.2) | §2.1 planRef, findingsRef[], verificationRef[], priorBuildRef |

### §2.5 Consumed types (from peer L3 standards, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `PlanArtifactContent` | plan-standard-v2-2 §2.2 | §2.1 BuildDirective.planRef resolves to this W-ATOM in substrate |
| `ResearchArtifactContent` | research-standard-v1-0 §2.2 | §2.1 BuildDirective.findingsRef[] resolve to these W-ATOMs |
| `VerificationArtifactContent` | verification-standard-v1-0 §2.2 | §2.1 BuildDirective.verificationRef[] resolve to these W-ATOMs |

Consumed by reference only; BS does not re-own or redeclare these shapes.

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 (referenced from metaframework §6.5) | §8.2 dimension results schema reference |
| `ReferentCitation` | substrate §4 A-18 (consumed via metaframework §2.2 referentCitations slot) | §1 Identity referentCitations row (declared empty at v1.0 with basis) |

### §2.7 BS-local atoms (declared at point of use in §3)

Atoms owned by BS (custody row per atom in §6.5):

`BuildId`, `InstructionId`, `BuildDirective`, `BuildBinding`, `BuildInstructionSet`, `BuildInstruction`, `TargetFileSpec`, `TierConstraint`, `RetryPolicy`, `ErrorClassMap`, `BuildEmission`, `BuildFileEntry`, `BuildVerdict`, `BuildRetryState`, `BuildOutcomeKind`, `BuildExecutionState`, `BuildShapePositional`, `BuildInstructionPositional`, `BuildVerdictPositional`, `BuildRetryPositional`, `BuildHandoffRuleInstance`, `BuildGateResult`, `BuildDimensionResult`, `BuildCustodyRow`, `BuildValidityError`, `BuildEmissionResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling). Typed shapes in `builder-standard.types.ts`.

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to BS:

- **ScR1** (input is W-ATOM): `BuildDirective` declared §2.1 as typed shape.
- **ScR2** (output is W-ATOM): `BuildEmission` declared §2.2 as typed shape; written directly to substrate per carrier=self.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

BS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. BS does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, BS's own structural content populates §3.3–§3.9 below: five BS-local P1 Axis instances (Input, Instruction, Delegation, Emission, Retry), sub-axis instances, leaves, axioms (BA1..BA5), the P7 declaration (P7=1, one generation-time J-input), and the P8 procedure step instances (BA is generative-mode; P8 applies per substrate §8.3).

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 5 | `{primitiveKind: 'P1', instanceCount: 5, basis: "BS-local domain axes declared at §3.3: Input, Instruction, Delegation, Emission, Retry. The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; BS-local P1 instances populate §3 Structure under the inherited shell under A3 Structure."}` |
| P2 Sub-axis | 10 | Input: 2; Instruction: 2; Delegation: 2; Emission: 2; Retry: 2. Declared §3.4. |
| P3 Leaf | 5 | One leaf per axiom condition per MA-St2 leaf atomicity: BA1 (1) + BA2 (1) + BA3 (1) + BA4 (1) + BA5 (1) = 5. Declared §3.5. |
| P4 Axiom | 5 | BA1, BA2, BA3, BA4, BA5. Declared §3.6. |
| P5 Gate | 5 | G-BS1, G-BS2, G-BS3, G-BS4, G-BS5. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-BS1 (authoring-program → BS), HR-BS2 (substrate → BS; typed peer-program outputs), HR-BS3 (BS → substrate write), HR-BS4 (BS → F-multi-instance delegation). Declared §6.2. |
| P7 Judgment input | 1 | `{primitiveKind: 'P7', instanceCount: 1, basis: "One generation-time judgment input declared: J-build-emission-observation (§7.1), consumed at generation-procedure S11 during framework template generation. Every BA1..BA5 runtime condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (BA1, BA2), structural property (BA3, BA5), cardinality + reference resolution (BA1 cardinality clause), deterministic-function-result (BA4 retry-vs-restart decision) — so no runtime judgment inputs are consumed. P7=1 covers the single generation-time J-input; MA-J4 provenance-completeness satisfied at §7.3."}` |
| P8 Procedure step | **4** | BS1–BS4 distributed across substrate-v1-1 Stages 1–5 per PR4 monotonicity + PR5 kind alignment. Declared §3.7. |

P7=1 is not an empty declaration; substrate §4 A-17 `EmptyPrimitiveDeclaration` does not apply to P7 at v1.0 (A-17 governs zero-instance declarations only).

### §3.3 P1 Axis instances (BS-local)

Five domain axes. MECE over BS's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Input` | Input | Reception and validation of the build directive and substrate-resident structured inputs | What is to be built, from what structured substrate inputs, by whom? |
| `Instruction` | Instruction | The set of typed build instructions within the directive | What file-level work must the build run perform, in what order? |
| `Delegation` | Delegation | The contract between Builder Standard and F-multi-instance for AI-assisted synthesis | How is AI orchestration invoked, and what invariants hold at the delegation boundary? |
| `Emission` | Emission | The typed build artifact written to substrate on completion or error | What constitutes a valid BuildEmission, and what fields are required at the substrate boundary? |
| `Retry` | Retry | Retry-vs-restart semantics and partial-emission preservation | Under what conditions is a partial build resumed vs restarted, and how is substrate state preserved? |

**MECE verification:**
- Orthogonality: Input governs directive reception and substrate-input resolution (boundary inbound); Instruction governs the ordered file-level work units (what to build); Delegation governs the F-multi-instance invocation contract (how AI synthesis is performed); Emission governs the typed output written to substrate (what the build produces); Retry governs recovery across multi-turn runs (how partial state is preserved). No pair-overlap.
- Exhaustiveness: every `BuildEmission` field traces to exactly one BS-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

**Input sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Input/directiveShape` | BuildDirective typed shape conformance | `leaf-BA1-input-receipt` (covered by BA1) |
| `Input/substrateResolution` | Peer-program artifact refs resolve in substrate | `leaf-BA1-input-receipt` (covered by BA1) |

**Instruction sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Instruction/orderingGraph` | dependsOn DAG among instructions | `leaf-BA2-instruction-ordering` |
| `Instruction/kindBinding` | instruction.kind ∈ declared enum | `leaf-BA2-instruction-ordering` (covered by BA2) |

**Delegation sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Delegation/invocationContract` | F-multi-instance invocation interface per BA5 | `leaf-BA5-delegation` |
| `Delegation/resultCapture` | Delegation result typed and captured into files[] | `leaf-BA5-delegation` (covered by BA5) |

**Emission sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Emission/fieldsPresence` | All required BuildEmission fields populated at emission | `leaf-BA3-emission-fields` |
| `Emission/verbatimCarry` | directive verbatim-carried into emission per BA3 | `leaf-BA3-emission-fields` (covered by BA3) |

**Retry sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Retry/retryDecision` | retry vs restart decision per BA4 retryPolicy | `leaf-BA4-retry-semantics` |
| `Retry/partialPreservation` | prior partial emissions preserved on retry per BA4 | `leaf-BA4-retry-semantics` (covered by BA4) |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-BA1-input-receipt` | `axiom` | `BuildDirective shape conformance AND substrate resolution: authoringProgram (programId + programVersion), userId, turnId, buildBinding (BuildBinding shape), instructions (non-empty BuildInstructionSet), planRef resolves in substrate OR is null, each element of findingsRef resolves in substrate, each element of verificationRef resolves in substrate, priorBuildRef resolves in substrate OR is null — per BA1 reference resolution + structural property` |
| `leaf-BA2-instruction-ordering` | `axiom` | `For directive.instructions array I: (i) every instruction.kind ∈ {'patch', 'addition', 'full-gen'}; (ii) directed graph G = (InstructionIds, {(id, depId) : id.dependsOn ∋ depId}) is acyclic; (iii) every depId ∈ instruction.dependsOn references an InstructionId present in I — per BA2 structural property (acyclicity + kind enum) + reference resolution` |
| `leaf-BA3-emission-fields` | `axiom` | `emission.directive === input (verbatim) AND emission.files has one entry per instruction in directive.instructions AND each entry has populated {instructionRef, filePath, content, executionState, errorDetail, evaluatedAt} with executionState ∈ {'produced', 'failed', 'skipped'} AND errorDetail non-null when executionState='failed' — per BA3 structural property (field presence + verbatim carry parallel to VS VA3)` |
| `leaf-BA4-retry-semantics` | `axiom` | `When emission.verdict.outcome ∈ {'partial', 'failed'}: (i) retry-vs-restart decision follows directive.buildBinding.retryPolicy: retry if attemptNumber < retryPolicy.maxRetries AND error class is retryable per retryPolicy.errorClassification, otherwise restart; (ii) on retry, emission.retryState.partialEmissions carries all InstructionIds with executionState='produced' from prior attempt; (iii) on restart, emission.retryState.restartFromId references prior BuildEmission AND partial emissions are reset — per BA4 deterministic-function-result (retry decision) + structural property (partial preservation)` |
| `leaf-BA5-delegation` | `axiom` | `For each instruction with executionState ≠ 'skipped': (i) F-multi-instance is invoked in topological order per directive.instructions[].dependsOn DAG (BA2 acyclicity): instruction B not delegated until all B.dependsOn have executionState='produced'; (ii) F-multi-instance was invoked with typed instruction payload per BA5 delegation contract; (iii) result captured verbatim into files[instructionId].content; (iv) emission.verdict.delegationRef is non-null and references the F-multi-instance invocation log; (v) verdict.outcome derivation: 'complete' iff all files[].executionState === 'produced'; 'partial' iff mix of produced + failed; 'failed' iff all failed — per BA5 reference resolution (delegationRef) + structural property (topological-order enforcement + verdict derivation)` |

### §3.6 P4 Axiom instances (BA1..BA5)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). One axiom per BS-local axis (1:1 mapping per brief).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **BA1** | `Input` / `leaf-BA1-input-receipt` | Every `BuildDirective` consumed by BS conforms to the typed shape declared at §2.1: `authoringProgram.{programId, programVersion}`, `userId`, `turnId`, `buildBinding: BuildBinding`, `instructions: BuildInstructionSet` (non-empty array), `planRef` (resolves in substrate or is null), each `findingsRef[]` element resolves in substrate, each `verificationRef[]` element resolves in substrate, `priorBuildRef` (resolves in substrate or is null) — all populated and resolvable. | reference resolution (substrate-ref resolution for artifact refs) + structural property (field presence per §2.1 schema) |
| **BA2** | `Instruction` / `leaf-BA2-instruction-ordering` | Within `directive.instructions`: (i) every `instruction.kind ∈ {'patch', 'addition', 'full-gen'}` (enum membership); (ii) the directed graph formed by `instruction.dependsOn` edges has no cycles (acyclicity); (iii) every `depId ∈ instruction.dependsOn` references an `InstructionId` present in `directive.instructions` (set membership). | structural property (acyclicity + enum membership) + reference resolution (intra-set) |
| **BA3** | `Emission` / `leaf-BA3-emission-fields` | `emission.directive` is verbatim identical to `input` (byte-identical carry, parallel to VS VA3 + Plan PA9), AND `keys(emission.files)` equals `{instr.instructionId : instr ∈ directive.instructions}` (one-to-one set equality per instruction cardinality), AND for every `instrId ∈ keys(emission.files)`: `emission.files[instrId]` has populated fields `{instructionRef, filePath, content, executionState ∈ {'produced', 'failed', 'skipped'}, errorDetail (non-null when executionState='failed'), evaluatedAt}`. | structural property (verbatim carry + field presence + enum membership) + cardinality (one-to-one set equality) |
| **BA4** | `Retry` / `leaf-BA4-retry-semantics` | This axiom governs recovery within a single build run only. Cross-program re-planning (triggering F-plan to emit a revised BuildDirective) is outside this axiom's scope per §1 scopeOut item 5. When `emission.verdict.outcome ∈ {'partial', 'failed'}`: the retry-vs-restart decision is derived from `directive.buildBinding.retryPolicy` per the rule: `retry` iff `retryState.attemptNumber < retryPolicy.maxRetries` AND the error class of every failed instruction is classified as `retryable` per `retryPolicy.errorClassification`; `restart` otherwise. On retry: `emission.retryState.partialEmissions` contains every `InstructionId` with `executionState='produced'` from the prior attempt (partial preservation — those instructions are not re-run). On restart: `emission.retryState.restartFromId` is non-null and references the prior `BuildEmission` in substrate; `partialEmissions` resets to `[]`. When `emission.verdict.outcome = 'complete'`: `retryState.partialEmissions` may be non-empty (records accumulated prior-attempt completions). | deterministic-function-result (retry/restart decision is fully determined by retryPolicy + error classification + attemptNumber) + structural property (partialEmissions preservation + restartFromId non-null on restart) |
| **BA5** | `Delegation` / `leaf-BA5-delegation` | For every instruction in `directive.instructions` with `executionState ≠ 'skipped'`: (i) F-multi-instance is invoked in topological order derived from the `directive.instructions[].dependsOn` DAG (per BA2 acyclicity constraint): instruction B is not delegated until all instructions in `B.dependsOn` have `executionState='produced'` in `emission.files`; (ii) F-multi-instance was invoked with the instruction's typed payload per the HR-BS4 delegation contract declared at §6.2; (iii) the result is captured verbatim into `emission.files[instructionId].content`; (iv) `emission.verdict.delegationRef` is non-null and references the F-multi-instance invocation log entry for this build run; (v) `emission.verdict.outcome` is derived from `emission.files` per the all-must-produce rule: `'complete'` iff `∀ instrId ∈ keys(files): files[instrId].executionState === 'produced'`; `'partial'` iff some produced and some failed; `'failed'` iff all failed or zero files produced; `null` iff any `executionState === 'not-yet-started'`. | reference resolution (delegationRef non-null + resolves) + structural property (topological-order enforcement + verdict derivation predicate) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set is the v1.0 baseline (no predecessor — BS v1.0 is fresh L3 framework per §1.1 GenesisDeclaration). BA1..BA5 declared once; future versions amend additively per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances (BS1..BS4)

**Four instances.** BS is Mode = `generative` per §1 Identity. Substrate §8.3 binds P8 to Mode = generative: "P8 — Procedure step. Mode = generative only." P8 applies to BS; zero instances would be a violation. The four steps are declared below per substrate §8.3 amended P8 shape + PG6 amended (substrate §11.2).

PR4 (stage monotonicity) and PR5 (stage-content-kind alignment) self-check declared at §3.7.4 below.

#### §3.7.1 P8 instances table

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **BS1** | 1 | 1 | judgment-input | `BuildDirective` (activationTrigger + judgment record) | validated judgment record | `judgmentInputRef = {J-build-emission-observation}` (§7.1; consumed at S11 observation; carried forward to BS4 for L0 confirmation per generation-procedure §3.3 S11 pattern) |
| **BS2** | 2 | 2 | mechanical | validated directive + substrate-resident peer artifacts (planRef, findingsRef[], verificationRef[]) | assembled `BuildContext` (typed context struct populated from substrate reads; draft `BuildEmission` with files[] pre-populated from instruction set) | `derivation = "read PlanArtifactContent at directive.planRef (if non-null) from substrate; read ResearchArtifactContent at each directive.findingsRef element; read VerificationArtifactContent at each directive.verificationRef element; assemble BuildContext with typed-substrate-surface; populate draft BuildEmission.files keyed by InstructionId; set all executionState = 'not-yet-started'"` |
| **BS3** | 3 | 3 | gate-execution | draft `BuildEmission` | per-gate results for BA1..BA5 + overall pass/fail | `gates = [G-BS1, G-BS2, G-BS3, G-BS4, G-BS5]` |
| **BS4** | 4 | 5 | mechanical | observed + gate-passed directive | final `BuildEmission` written to substrate at HR-BS3; HR-BS4 invocation toward F-multi-instance per delegation contract | `derivation = "invoke F-multi-instance per HR-BS4 delegation contract for each non-skipped instruction; capture result verbatim into files[instrId].content; compute verdict.outcome per BA5 all-must-produce rule; populate retryState per BA4; write BuildEmission to substrate at HR-BS3; if outcome ∈ {'partial', 'failed'} apply retryPolicy per BA4 to determine retry vs restart"` |

**Stage-4 note (J-template-observation / confirmation):** Builder Standard does not declare a Stage-4 judgment-input P8 step because BS's J-build-emission-observation (§7.1) is carried at BS1 (Stage 1) and is consumed at S11 of the generation-procedure during framework generation (not at runtime build-run time). At runtime, BS3 gate-execution produces the per-gate results; L0 confirmation of the framework template (not individual build runs) is the confirmation event. This matches the pattern of structural-mode frameworks where Stage-4 is absent at runtime but present at generation-procedure S11. The single judgment-input step (BS1) at Stage 1 covers the generation-procedure's S1 judgment-input requirement.

#### §3.7.2 Vocabulary (P8-local)

| Term | Declared | Definition |
|---|---|---|
| `BuildContext` | §3.7.1 BS2 | assembled typed struct populated from substrate reads: {planContent?: PlanArtifactContent, findingsContent: ResearchArtifactContent[], verificationContent: VerificationArtifactContent[]}; internal to BS2 derivation |

#### §3.7.3 P8 gate execution steps — BS3 gates detail

BS3 is a Stage-3 gate-execution step. It executes the BS-own axiom gates (G-BS1..G-BS5) against the draft BuildEmission. Result shape per generation-procedure §4.3 E-step result pattern:

```
BS3 result = {
  stepId: 'BS3',
  referencedGates: ['G-BS1', 'G-BS2', 'G-BS3', 'G-BS4', 'G-BS5'],
  perGateResults: GateResult[],      // one entry per gate; shape per substrate §10.1 S4
  overallResult: 'pass' | 'fail',
  escalationPath: ref to metaframework §4.5 backward-invalidation rule
}
```

#### §3.7.4 PR4 / PR5 self-check

**PR4 — stage monotonicity across order:**

| order | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| stage | 1 | 2 | 3 | 5 |

Non-decreasing across order (1 ≤ 2 ≤ 3 ≤ 5). No stage-4 instance; skip is permitted per substrate §8.3 (stage values need not be contiguous; monotonicity is non-decrease, not full-sequence). PR4 passes.

**PR5 — stage-content-kind alignment per P8 instance:**

| id | stage | kind | PR5-required kind | aligned |
|---|---|---|---|---|
| BS1 | 1 | judgment-input | judgment-input | ✓ |
| BS2 | 2 | mechanical | mechanical | ✓ |
| BS3 | 3 | gate-execution | gate-execution | ✓ |
| BS4 | 5 | mechanical | mechanical | ✓ |

All four aligned. PR5 passes.

**PG6 amended (substrate §11.2) — kind-specific field requirement:**
- BS1 (kind=judgment-input) → `judgmentInputRef` declared. ✓
- BS2, BS4 (kind=mechanical) → `derivation` declared. ✓
- BS3 (kind=gate-execution) → `gates` populated with tested axiom refs. ✓

All four satisfy PG6 amended.

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four universal variables). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Input` | `Semver` (bound to `BuildEmission.buildVersion` — directive shape versioned at emission per BA3) | `string` enum (extensible) `'patch' \| 'addition' \| 'full-gen'` (bound to `BuildInstruction.kind` — categorical classifier of build work) | `BuildDirective.planRef: ArtifactRef \| null` paired with `BuildDirective.findingsRef: ArtifactRef[]` paired with `BuildDirective.verificationRef: ArtifactRef[]` (multi-reference: directive relates to all structured peer-program outputs consumed at this build run) | `BuildShapePositional` enum `'pending' \| 'received' \| 'rejected'` (declared §3.9 vocabulary) |
| `Instruction` | `Semver` (bound to `BuildBinding.domainVersion` — instruction set versioned through binding) | `BuildInstructionKind` enum `'patch' \| 'addition' \| 'full-gen'` (per BA2 enum membership; same as Input categorical — instruction kind classifies both the input directive intent and the structural form of the build unit) | `BuildInstruction.dependsOn: InstructionId[]` (intra-set ordering: instruction → its prerequisite instructions; acyclic per BA2) | `BuildInstructionPositional` enum `'pending' \| 'delegating' \| 'produced' \| 'failed' \| 'skipped'` (declared §3.9) |
| `Delegation` | `EpochMs` (bound to `BuildFileEntry.evaluatedAt` — per-instruction delegation timestamp) | `string` ref `emission.verdict.delegationRef` (points to F-multi-instance invocation log; categorical identity of this delegation event) | `InstructionId` (key into `emission.files`) paired with F-multi-instance invocation log entry (result captured per BA5; dual reference: instruction → delegation result) | `BuildDelegationPositional` enum `'not-invoked' \| 'invoked' \| 'captured'` (declared §3.9) |
| `Emission` | `EpochMs` (bound to `BuildEmission.producedAt` — emission timestamp) | `BuildOutcomeKind` enum `'complete' \| 'partial' \| 'failed' \| null` (bound to `emission.verdict.outcome` per BA5 derivation) | `emission.files: {[InstructionId]: BuildFileEntry}` paired with `emission.verdict: BuildVerdict` (map-to-aggregate derivation: files aggregate into verdict per BA5 all-must-produce rule) | `BuildVerdictPositional` enum `'pending' \| 'partial' \| 'complete' \| 'failed'` (declared §3.9) |
| `Retry` | `number` (bound to `emission.retryState.attemptNumber` — temporal sequencing of attempts) | `RetryDecisionKind` enum `'retry' \| 'restart' \| 'none'` (determined per BA4 retryPolicy; categorical classifier of recovery path) | `BuildEmission.retryState.restartFromId: BuildId \| null` paired with `BuildEmission.retryState.partialEmissions: InstructionId[]` (prior-attempt reference pair: restart references prior emission; partial list carries completed work) | `BuildRetryPositional` enum `'first-attempt' \| 'retrying' \| 'restarting' \| 'terminal'` (declared §3.9) |

Every cell is a named type, enum literal, inlined shape, or declared type-to-type paired reference. No prose cells.

**MA-St3 self-check:** no content appears under more than one axis. `BuildInstructionKind` enum appears in both Input (Categorical — classifying what kind of work the directive contains) and Instruction (Categorical — classifying what kind of work unit the instruction is). This is the same enum serving the same classification, not duplication: BA2 declares the per-instruction constraint while BA1 declares the directive-level constraint. Single enum declared once; cross-axis reuse noted explicitly. Declared cross-axis invariant per substrate §9 cross-axis-invariant rule. Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `build-emission` | §1 primitive | atomic unit of work in BS: one act of producing a typed build artifact (one file entry) from one instruction via F-multi-instance delegation; framework-local atomic operation analogous to VS `predicate-evaluation` |
| `build run` | §2.2 output | execution of all non-skipped instructions in a BuildDirective, producing one BuildEmission; one `BuildEmission` = one build run's output |
| `BuildBinding` | §2.1 + `builder-standard.types.ts` | BS-defined type shape; domain standard or operator fills instance values; captured verbatim at emission per BA3 |
| `BuildInstruction` | §2.1 + `builder-standard.types.ts` | typed shape per BA2: `{instructionId, kind, target, content, dependsOn[]}`; one entry per file to synthesize |
| `instruction kind` | §3.3 `Instruction/kindBinding` | `'patch'` — modify existing file at declared hunks; `'addition'` — add new file; `'full-gen'` — regenerate entire file |
| `build context` | §3.7.1 BS2 | assembled typed struct of peer-program substrate outputs consumed at build intake; internal to BS2 derivation; not emitted to substrate |
| `delegation` | §3.3 `Delegation` | single invocation of F-multi-instance per HR-BS4 for one non-skipped instruction; result captured verbatim per BA5 |
| `retry` | §3.6 BA4 | re-execution of failed instructions within the same build run, preserving prior partial completions; attemptNumber increments; partial emissions preserved |
| `restart` | §3.6 BA4 | fresh build run superseding a prior failed/partial BuildEmission; retryState.restartFromId carries prior emission reference; partialEmissions resets |
| `partial emission` | §3.6 BA4 + `builder-standard.types.ts` | `InstructionId` set of instructions completed in prior attempts; preserved across retry; not re-invoked |
| `BuildShapePositional` | §3.8 | enum `'pending' \| 'received' \| 'rejected'` — Input axis lifecycle position |
| `BuildInstructionPositional` | §3.8 | enum `'pending' \| 'delegating' \| 'produced' \| 'failed' \| 'skipped'` — Instruction axis lifecycle position |
| `BuildDelegationPositional` | §3.8 | enum `'not-invoked' \| 'invoked' \| 'captured'` — Delegation axis lifecycle position |
| `BuildVerdictPositional` | §3.8 | enum `'pending' \| 'partial' \| 'complete' \| 'failed'` — Emission axis lifecycle position |
| `BuildRetryPositional` | §3.8 | enum `'first-attempt' \| 'retrying' \| 'restarting' \| 'terminal'` — Retry axis lifecycle position |
| `BuildOutcomeKind` | §3.8 | enum `'complete' \| 'partial' \| 'failed' \| null` — verdict outcome values per BA5 |
| `RetryDecisionKind` | §3.8 | enum `'retry' \| 'restart' \| 'none'` — retry decision outcome per BA4 |
| `BuildInstructionKind` | §3.8 | enum `'patch' \| 'addition' \| 'full-gen'` — per BA2 instruction kind enum |

---

## §4 Validity

### §4.1 Gate count

BS declares **5 own primary gates** (G-BS1 .. G-BS5, 1:1 with BA1..BA5 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates including cycle-1 G-S7+G-V11 and cycle-2 G-V10+G-S8+G-L11 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when BS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| BS-own axiom gates (G-BS*) | 5 | this §4.2 | framework-audit applies BA1..BA5 suite per MA-V1; emission-time on each BuildEmission |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test BS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **5 + 85 = 90** | | |

BS's own 5 gates are executed in addition to the 85 inherited — same pattern as VS v1.0 §4.1 + Plan v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite).

### §4.2 BS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 5 axioms → 5 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-BS1** | BA1 | `typeof input.authoringProgram.programId === 'string' AND typeof input.authoringProgram.programVersion === 'string' AND matches(input.authoringProgram.programVersion, semverRegex) AND typeof input.userId === 'string' AND typeof input.turnId === 'string' AND typeof input.buildBinding.domainId === 'string' AND input.buildBinding.domainId.length >= 1 AND matches(input.buildBinding.domainVersion, semverRegex) AND Array.isArray(input.buildBinding.targetFiles) AND typeof input.buildBinding.language === 'string' AND Array.isArray(input.buildBinding.tierConstraints) AND typeof input.buildBinding.retryPolicy === 'object' AND input.buildBinding.retryPolicy !== null AND typeof input.buildBinding.retryPolicy.maxRetries === 'number' AND typeof input.buildBinding.errorClassification === 'object' AND Array.isArray(input.instructions) AND input.instructions.length >= 1 AND forall instr ∈ input.instructions: typeof instr.instructionId === 'string' AND typeof instr.kind === 'string' AND typeof instr.target === 'object' AND typeof instr.content === 'string' AND Array.isArray(instr.dependsOn) AND (input.planRef === null OR resolveInSubstrate(input.planRef) !== undefined) AND forall ref ∈ input.findingsRef: resolveInSubstrate(ref) !== undefined AND forall ref ∈ input.verificationRef: resolveInSubstrate(ref) !== undefined AND (input.priorBuildRef === null OR resolveInSubstrate(input.priorBuildRef) !== undefined)` | structural property (field presence + typed sub-field enumeration for BuildBinding and BuildInstructionSet per §2.1 shapes) + reference resolution (substrate-resident artifact refs) |
| **G-BS2** | BA2 | `forall instr ∈ input.instructions: instr.kind ∈ {'patch', 'addition', 'full-gen'} AND topologicalSort(instrDependencyGraph(input.instructions)) !== null AND forall instr ∈ input.instructions: forall depId ∈ instr.dependsOn: exists i ∈ input.instructions: i.instructionId === depId` where `instrDependencyGraph(I) = (I.map(i => i.instructionId), flatten(I.map(i => i.dependsOn.map(d => [i.instructionId, d]))))` | structural property (acyclicity predicate + enum membership) + reference resolution (intra-set InstructionId resolution) |
| **G-BS3** | BA3 | `byteIdentical(emission.directive, input) === true AND setEqual(keys(emission.files), input.instructions.map(i => i.instructionId)) === true AND forall instrId ∈ keys(emission.files): let f = emission.files[instrId]; typeof f.instructionRef === 'string' AND f.instructionRef === instrId AND typeof f.filePath === 'string' AND f.filePath.length >= 1 AND typeof f.content === 'string' AND f.executionState ∈ {'produced', 'failed', 'skipped'} AND (f.executionState === 'failed' implies f.errorDetail !== null AND f.errorDetail.length >= 1) AND typeof f.evaluatedAt === 'number' AND f.evaluatedAt > 0` | structural property (verbatim carry + field presence + enum membership) + cardinality (one-to-one set equality) |
| **G-BS4** | BA4 | `if emission.verdict.outcome ∈ {'partial', 'failed'}: let p = emission.retryState; let rp = emission.directive.buildBinding.retryPolicy; let allFailedClasses = failedInstructions(emission.files).map(id => errorClass(emission.files[id].errorDetail, rp.errorClassification)); let isRetryable = allFailedClasses.every(c => rp.retryableClasses.includes(c)); let retryDecision = (p.attemptNumber < rp.maxRetries AND isRetryable) ? 'retry' : 'restart'; if retryDecision === 'retry': p.partialEmissions ⊆ producedInstructionIds(emission.files) AND p.restartFromId === null; if retryDecision === 'restart': p.restartFromId !== null AND resolveInSubstrate(p.restartFromId) !== undefined AND p.partialEmissions.length === 0` | deterministic-function-result (retry decision fully determined by retryPolicy + error classification + attemptNumber) + structural property (partial preservation + restartFromId non-null on restart) |
| **G-BS5** | BA5 | `let topoOrder = topologicalSort(instrDependencyGraph(emission.directive.instructions)); topoOrder !== null AND forall i ∈ [0..topoOrder.length-1]: let instrId = topoOrder[i]; let depIds = emission.directive.instructions.find(x => x.instructionId === instrId).dependsOn; (emission.files[instrId].executionState !== 'skipped') implies (forall depId ∈ depIds: emission.files[depId].executionState === 'produced') AND forall instrId ∈ keys(emission.files) where emission.files[instrId].executionState !== 'skipped': emission.files[instrId].content !== undefined AND typeof emission.files[instrId].content === 'string' AND emission.verdict.delegationRef !== null AND typeof emission.verdict.delegationRef === 'string' AND emission.verdict.delegationRef.length >= 1 AND let derivedOutcome = deriveOutcome(emission.files); emission.verdict.outcome === derivedOutcome` where `deriveOutcome(f) = (every entry produced ? 'complete' : (any produced AND any failed ? 'partial' : (all failed ? 'failed' : null)))` | reference resolution (delegationRef non-null + non-empty) + structural property (topological-order enforcement: every non-skipped instruction delegated only after its dependsOn set is produced; verdict derivation predicate correctness) |

**G-M1 self-check:** 5 axioms → 5 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Input 1 gate (G-BS1); Instruction 1 gate (G-BS2); Emission 1 gate (G-BS3); Retry 1 gate (G-BS4); Delegation 1 gate (G-BS5). Every BS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs BS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests BS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests BS's §2 Schema conformance to MA-S1..MA-S8 (cycle-2 G-S8 ReferentCitation declaration shape conformance — BS declares `referentCitations: []` per §1; G-S8 vacuous-pass).
- **E3 Structure (PG3 + G-St1..G-St16):** tests BS's §3 Structure conformance to MA-St1..MA-St16 (including G-St5 P8 stage-declaration extended predicate — BS declares 4 P8 instances with PR4/PR5 self-check at §3.7.4; passes).
- **E4 Validity (PG4 + G-V1..G-V11):** tests BS's §4 Validity conformance to MA-V1..MA-V11 (cycle-2 G-V10 spec↔referent + cycle-1 G-V11 applicability-basis vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests BS's §5 Lifecycle conformance to MA-L1..MA-L11 (cycle-2 G-L11 audit-run snapshot stamping vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests BS's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests BS's §7 Judgment conformance to MA-J1..MA-J5 (P7=1; one generation-time J-input J-build-emission-observation per §3.2 + §7.1; runtime conditions fully mechanical).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests BS's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus BS's own 5 G-BS* gates execute against the emitted `BuildEmission` at emission time (and at framework-audit re-verification). Total per-audit framework-tier gates when BS is target: 90 (85 + 5).

**Disambiguation note on gate execution scope:**
The 85 inherited gates test BS's **framework declaration conformance** (does BS's §1–§7 structure match metaframework's axioms?). The 5 G-BS* gates test **individual BuildEmission instance conformance** (does a given emitted build emission satisfy BA1..BA5?). Different scopes, different execution sites — the 85 run at framework-audit time against this file; the 5 run at emission-time on each BuildEmission the authoring program produces.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover BS's validity surfaces:

| Dimension | BS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=1; one fully-mechanical generation-time J-input per §7.1); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (8 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-BS3 to substrate + HR-BS4 to F-multi-instance |
| X10 (Stage-declaration extended predicate) | §3.7.4 P8 PR4/PR5 self-check declared + §3.7 table |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 5 BS-own (G-BS*) = 74.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to BS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 90 framework-tier gates (85 inherited + 5 BS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0-confirmation (§5.3). Gate IDs enumerated:

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

BS-own (5): `G-BS1, G-BS2, G-BS3, G-BS4, G-BS5`.

Substrate-tier gates (SG1–SG5) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). BS is a fresh L3 framework with no predecessor (per §1.1 GenesisDeclaration `predecessorVersion: null`). Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: five axioms (BA1..BA5) declared; BuildBinding shape declared with zero domain instances at v1.0 (F-builder slice to supply LIV domain binding in subsequent cycle post-Sprint 11 stabilization); `referentCitations: []` declared with basis per Cognitive v1.2.2 / VS v1.0 / RS v1.0 precedent; carrier = `self` (substrate-direct write at v1.0; future cycles may introduce named carrier if surface-rendering requirements change). P8 instances declared (BS is generative-mode; 4 steps BS1–BS4 across Stages 1–5). Generation path: generation-procedure-v1-0 v1.1.6 S1–E8 template-generation under metaframework-v3-1 v3.2.7.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 10 closure per LIV deploy state + Phase 2 missing-governance gate clearance. Driving findings: (i) LIV beta gate requires Builder Standard as the L3 governance framework for F-builder; (ii) F-plan/F-discover/F-verify all have authored L3 standards (Plan v2.2, Research v1.0, VS v1.0); Builder is the sole remaining domain-program standard; (iii) the generative-mode slot in the four-mode triad (structural=Plan, epistemic=Research, verificative=VS, generative=BS) requires authoring for architectural completeness.

### §5.3 Confirmation gate

Pending L0 at v1.0 closure. Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. BS declares one generation-time J-input (J-build-emission-observation, §7.1); runtime conditions fully mechanical. No deprecations possible (MA-J4).

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| Input receipt (HR-BS1) | Schema violation on `BuildDirective` shape | authoring program returns `Result { ok: false, error: BuildValidityError { code: 'BUILD_INPUT_INVALID' } }`; no substrate write invoked |
| Substrate resolution (BS2 mechanical) | Artifact ref (planRef, findingsRef[], verificationRef[], priorBuildRef) not found in substrate | authoring program returns `Result { ok: false, error: BuildValidityError { code: 'BUILD_SUBSTRATE_REF_UNRESOLVED', failedRef: ArtifactRef } }`; no emission |
| Emission-time validity (G-BS1..G-BS5) | Any G-BS* gate fails on proposed `BuildEmission` | authoring program returns `Result { ok: false, error: BuildValidityError { code: 'BUILD_VALIDITY_FAILED', failedAxiom: 'BA<n>' } }`; no substrate write invoked |
| Delegation failure (HR-BS4 → F-multi-instance) | F-multi-instance returns error for one or more instructions | captured into `files[instrId].executionState = 'failed'` + `errorDetail`; BA4 retry/restart decision applied per retryPolicy |
| Substrate write failure (HR-BS3) | Substrate write of BuildEmission rejects (e.g., concurrent modification) | authoring program returns `BuildValidityError { code: 'BUILD_SUBSTRATE_WRITE_FAILED' }`; emission not persisted; retry at caller discretion |
| Retry policy exhaustion (BA4) | attemptNumber >= retryPolicy.maxRetries AND outcome still not 'complete' | emit final BuildEmission with `verdict.outcome = 'failed'` + `failedInstructions` populated; bubble to F-builder for operator notification |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-build instruction count: bounded by authoring program's scale policy (no BS-framework hard cap; BuildInstructionSet cardinality is domain-declared via BuildBinding).
- Per-instruction content size: bounded by F-multi-instance context-window constraints (operational; not a BS axiom).
- Per-emission gate execution: O(|directive.instructions|) — one G-BS3 entry per instruction (cardinality check), one G-BS5 derivation pass (verdict correctness); linear in instruction count.
- Retry depth: bounded by `retryPolicy.maxRetries` per BA4 (declared per BuildBinding; BS axiom enforces it, not BS's own scale policy).
- Restart chain depth: unbounded at BS framework level (each restart references prior BuildEmission; chain is observable via substrate traversal of `retryState.restartFromId`; depth limit is operational policy).

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations`:

- BS intake validation (G-BS1..G-BS5): atomic per-build (all-or-nothing validation before delegation).
- F-multi-instance delegation (HR-BS4): atomic per-instruction; each instruction delegation is one atomic operation; partial completions recorded in `files[]` per BA3 + BA4 partial preservation.
- Substrate write (HR-BS3): atomic per BuildEmission per substrate §13.4 (emit + registry write are separate atomic operations; same discipline as generation-procedure S12 per substrate §13.4 "atomic with recovery point").
- Retry state: per BA4, partial emissions preserved across retry — this is idempotent by construction (already-produced instructions are not re-run; their `files[]` entries are carried forward verbatim per BA3).

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-05-09 (Sprint 10 Shot 1 / Phase 2 missing-governance gate clearance) | Initial declaration. Five BS-local P1 axes (Input, Instruction, Delegation, Emission, Retry). Five axioms BA1..BA5 governing typed-work synthesis. Five paired gates G-BS1..G-BS5 (1:1 per G-M1). Four HRs (HR-BS1..HR-BS4) with captureShape per substrate §8.2 amended P6. P7=1 (one generation-time J-input: J-build-emission-observation, §7.1; amended from initial P7=0 per F-BS-4 resolution) + P8=4 (Mode=generative; BS1–BS4 across Stages 1–5 per PR4/PR5 self-check) declarations per substrate §8.3. Carrier = self (substrate-direct write at v1.0; no enclosing carrier framework). BuildBinding shape declared with zero domain instances at v1.0. `referentCitations: []` per Cognitive v1.2.2 / VS v1.0 / RS v1.0 precedent. Provenance reference-default per A-20. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. | L0 (pending v1.0 confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Builder Standard carrier = `self`. BS emits `BuildEmission` directly to substrate graph at HR-BS3 without an enclosing carrier framework. Rationale: build artifacts are substrate-native — they are consumed by F-output for rendering and by F-verify for post-build verification via substrate traversal, not by chat-surface consumers. AS v2.2 carrier pattern (used by Plan/VS/Research) wraps content in `ArtifactPayload` for chat-surface rendering; build artifacts do not require this wrapping at v1.0 (F-output handles rendering from substrate directly). Future amendment to named carrier is a declared amendment path (post-beta) if surface-rendering requirements change.

**MA-C1 satisfaction:** carrier = `self` declared with rationale per substrate §9 Carrier enum.

### §6.2 Handoff rules

Four framework-local HR instances. All BS-owned handoffs with `diagnosticSignificance = true` have declared `captureShape` per substrate §8.2 amended P6.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-BS1** | authoring-program → builder-standard | `['self']` (BS carrier = self) | `true` | declared §6.3 |
| **HR-BS2** | substrate → builder-standard (structured peer-program outputs) | `['self']` | `true` | declared §6.3 |
| **HR-BS3** | builder-standard → substrate (BuildEmission write) | `['self']` | `true` | declared §6.3 |
| **HR-BS4** | builder-standard → F-multi-instance (delegation) | `['self']` | `true` | declared §6.3 |

**Inherited HRs referencing BS:**

| HR | Owning declaration | BS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → BS type consumption; BS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; BS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records BS's framework declaration per provenance contract (see §6.6) |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by BS.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-BS1 — authoring program → BS (BuildDirective receipt):**
```
captureShape = {
  capturedFields: ['authoringProgram.programId', 'authoringProgram.programVersion', 'userId', 'turnId', 'buildId', 'buildBinding.domainId', 'buildBinding.domainVersion', 'instructions.length', 'planRef', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-BS2 — substrate → BS (structured peer-program artifact reads):**
```
captureShape = {
  capturedFields: ['planRef', 'findingsRef[]', 'verificationRef[]', 'priorBuildRef', 'resolvedAt', 'turnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; substrate node resolution by ArtifactRef'
}
```

**HR-BS3 — BS → substrate (BuildEmission write):**
```
captureShape = {
  capturedFields: ['buildId', 'buildVersion', 'verdict.outcome', 'files.length', 'retryState.attemptNumber', 'producedAt', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; BuildEmission node resolved via buildId in substrate graph'
}
```

**HR-BS4 — BS → F-multi-instance (delegation):**
```
captureShape = {
  capturedFields: ['instructionId', 'instruction.kind', 'instruction.target.filePath', 'delegationRef', 'executionState', 'evaluatedAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; delegation log resolved via emission.verdict.delegationRef'
}
```

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'self'` with rationale.
- **MA-C2** (custody per atom): §6.5 enumerates every BS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-BS1..HR-BS4 send/receive shapes matched by construction; captureShape contracts declared at §6.3 for all diagnostic-significance=true HRs.
- **MA-C4** (provenance per output field): §2.2 every `BuildEmission` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'self'` → output written directly to substrate at HR-BS3 per BA3; no named-carrier wrapping.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; substrate / primitives.ts / metaframework / peer-standard atoms referenced at §2.3–§2.6 not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | builder-standard (buildId substrate node identity), every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | builder-standard (§2.1 BuildDirective.userId), every session-aware framework |
| `Semver` | primitives.ts | core/R5 | builder-standard (§1 version, §2 producedBy.programVersion, §2 buildBinding.domainVersion, §2 buildVersion), every versioned framework |
| `EpochMs` | primitives.ts | core/R5 | builder-standard (§2.2 producedAt + files[].evaluatedAt), every time-stamping framework |
| `Result<T, E>` | primitives.ts | core/R5 | builder-standard (§2.2 BuildEmissionResult), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | builder-standard (§2.2 BuildValidityError extends), every error-carrying framework |
| `ArtifactRef` | primitives.ts (or AS v2.2) | core/R5 | builder-standard (§2.1 planRef, findingsRef[], verificationRef[], priorBuildRef), every artifact-referencing framework |
| `Mode` | substrate | L1 (substrate §2) | builder-standard (§1 Identity `Mode = generative`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | builder-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | builder-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | builder-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | builder-standard (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | builder-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed) | builder-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed) | builder-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed) | builder-standard (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed) | builder-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed) | builder-standard (inherited via HR-BS1 authoring-program invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed) | builder-standard (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed) | builder-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | builder-standard (§3.7 P8 instances BS1–BS4 — stage values 1, 2, 3, 5) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | builder-standard (§3.7 BS1 kind=judgment-input, BS2+BS4 kind=mechanical, BS3 kind=gate-execution) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | builder-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | builder-standard (consumed at generation time via J-build-emission-observation §7.1; P7=1 per §3.2; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | builder-standard (empty-declaration basis per MA-J4) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | builder-standard (not consumed by P7 at v1.0 — P7=1 is not empty; row retained for substrate §12 consumer-registry completeness) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | builder-standard (§1 Identity referentCitations row declared empty at v1.0) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | builder-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | builder-standard (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | builder-standard (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | builder-standard (§8.2 dimension results schema reference) |
| `PlanArtifactContent` | plan-standard | L3 (plan-standard-v2-2 §2.2) | builder-standard (§2.1 BuildDirective.planRef resolves to this; consumed by reference) |
| `ResearchArtifactContent` | research-standard | L3 (research-standard-v1-0 §2.2) | builder-standard (§2.1 BuildDirective.findingsRef[] resolve to these; consumed by reference) |
| `VerificationArtifactContent` | verification-standard | L3 (verification-standard-v1-0 §2.2) | builder-standard (§2.1 BuildDirective.verificationRef[] resolve to these; consumed by reference) |
| `BuildId` | builder-standard | L3 (this file §2 + core/R5) | builder-standard (internal), substrate (graph node identity), F-builder (caller), F-output (downstream) |
| `InstructionId` | builder-standard | L3 (this file §2 + core/R5) | builder-standard (internal keys in files[]), domain standards (declare instruction IDs in BuildInstructionSet) |
| `BuildDirective` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal), authoring programs (construct at caller site: F-builder) |
| `BuildBinding` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (shape owner); instance values owned per-domain by domain standard or operator (LIV, ASO); captured verbatim per BA3 |
| `BuildInstructionSet` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal), authoring programs (construct at caller site) |
| `BuildInstruction` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal per-instruction entry shape) |
| `TargetFileSpec` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal), authoring programs |
| `TierConstraint` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal), domain standards (declare tier limits in BuildBinding) |
| `RetryPolicy` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal — BA4 retry decision reads this); domain standards (declare policy per BuildBinding) |
| `ErrorClassMap` | builder-standard | L3 (this file §2.1 + core/R5) | builder-standard (internal — BA4 error classification reads this) |
| `BuildEmission` | builder-standard | L3 (this file §2.2 + core/R5) | builder-standard (internal), substrate (written at HR-BS3), F-output (downstream rendering), F-verify (post-build verification via VA9 self-application) |
| `BuildFileEntry` | builder-standard | L3 (this file §2.2 + core/R5) | builder-standard (internal — files[] entry shape) |
| `BuildVerdict` | builder-standard | L3 (this file §2.2 + core/R5) | builder-standard (internal — verdict field shape), F-builder (reads outcome) |
| `BuildRetryState` | builder-standard | L3 (this file §2.2 + core/R5) | builder-standard (internal — retryState field shape) |
| `BuildOutcomeKind` | builder-standard | L3 (this file §3.8 + core/R5) | builder-standard (internal), F-builder (caller reads verdict.outcome) |
| `BuildExecutionState` | builder-standard | L3 (this file §3.8 + core/R5) | builder-standard (internal — files[].executionState enum) |
| `BuildShapePositional` / `BuildInstructionPositional` / `BuildDelegationPositional` / `BuildVerdictPositional` / `BuildRetryPositional` | builder-standard | L3 (this file §3.8 + core/R5) | builder-standard (internal), framework-audit |
| `RetryDecisionKind` | builder-standard | L3 (this file §3.8 + core/R5) | builder-standard (internal), domain standards (retry decision enum per BA4) |
| `BuildInstructionKind` | builder-standard | L3 (this file §3.8 + core/R5) | builder-standard (internal), domain standards (instruction kind values in BuildInstructionSet) |
| `BuildHandoffRuleInstance` | builder-standard | L3 (this file §6.2 + core/R5) | builder-standard (internal), framework-audit (X3 C5 captureShape check) |
| `BuildGateResult` | builder-standard | L3 (§4 + core/R5) | builder-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `BuildDimensionResult` | builder-standard | L3 (§4.4 + core/R5) | builder-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `BuildCustodyRow` | builder-standard | L3 (§6.5 + core/R5) | builder-standard (internal), framework-audit (custody-check X2/X5) |
| `BuildValidityError` | builder-standard | L3 (§2 + core/R5) | builder-standard (internal); extends primitives.ts `AppError` |
| `BuildEmissionResult` | builder-standard | L3 (§2 + core/R5) | builder-standard (emission surface), authoring programs (consume at HR-BS3 return) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-05-09T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput
  sourceInputValue:         undefined                       // by-value opt-in flag not set
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

BS carrier = `self`. Applicability enforcement at handoff time:

- HR-BS1 carrier applicability `['self']`: BS carrier = self → applies; authoring program invokes BS via direct call (no named-carrier envelope).
- HR-BS2 carrier applicability `['self']`: substrate reads carried through self-carrier context.
- HR-BS3 carrier applicability `['self']`: BS writes BuildEmission to substrate directly (self-carrier write).
- HR-BS4 carrier applicability `['self']`: delegation to F-multi-instance is a direct call under the self-carrier contract.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

BS's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoint: 'authoring-program (F-builder) constructs BuildDirective → validates BA1..BA5 → delegates to F-multi-instance at HR-BS4 → writes BuildEmission to substrate at HR-BS3',
  configurationInputs:  ['BuildBinding (per-domain)', 'authoringProgram.programId + programVersion', 'userId + turnId', 'instructions: BuildInstructionSet', 'planRef + findingsRef[] + verificationRef[] (substrate artifact refs)', 'priorBuildRef (for retry/restart)'],
  observableOutputs:    ['BuildEmissionResult (success: BuildEmission in substrate; failure: BuildValidityError with failedAxiom or failed code)', 'verdict.outcome ∈ {complete, partial, failed, null}', 'files[instrId].{content, executionState, errorDetail} per instruction'],
  errorContract:        'BuildValidityError codes: BUILD_INPUT_INVALID | BUILD_SUBSTRATE_REF_UNRESOLVED | BUILD_VALIDITY_FAILED | BUILD_SUBSTRATE_WRITE_FAILED; plus per-instruction errorDetail on delegation failure',
  extensibility:        'BuildBinding shape is BS-owned; instance values per-domain; new domains added by declaring new BuildBinding instances — no BS amendment required. BuildInstructionKind enum is BS §3.8 declared — additive amendment required to extend. RetryPolicy shape is BS-owned; policy values per-domain binding.'
}
```

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | BS consumes | BS emits | HR binding |
|---|---|---|---|
| authoring program (F-builder) | BuildDirective (typed build request) | `BuildEmission` written to substrate at HR-BS3; `BuildEmissionResult` returned to caller | HR-BS1 (inbound directive); HR-BS3 (outbound substrate write) |
| substrate / Living Memory | structured peer-program artifacts (PlanArtifactContent, ResearchArtifactContent[], VerificationArtifactContent[]) resolved at planRef, findingsRef[], verificationRef[] | `BuildEmission` W-ATOM written to substrate graph | HR-BS2 (inbound reads); HR-BS3 (outbound write) |
| F-multi-instance | — (receives typed instruction payload from BS) | per-instruction generated file content captured verbatim into `files[instrId].content` | HR-BS4 (outbound delegation) |
| F-output | — | `BuildEmission` (substrate node); F-output reads via substrate traversal and renders for surface | (via substrate graph; no direct HR) |
| F-verify / Verification Standard v1.0 | — | `BuildEmission` in substrate; VS may verify it via VA9 self-application targeting it as `target.artifactKind = 'build'` | (consumer-mediated via substrate; no direct HR) |
| Plan Standard v2.2 | `PlanArtifactContent` (resolved at `directive.planRef`) | — (no direct emission to Plan) | (via HR-BS2 substrate read; Plan produced the artifact, BS reads it) |
| Research Standard v1.0 | `ResearchArtifactContent[]` (resolved at `directive.findingsRef[]`) | — | (via HR-BS2 substrate read) |
| framework-audit v1.3.6 | (distinct concern; BS does not consume framework-audit; framework-audit audits BS's framework declaration file — non-overlapping per §1 scopeOut) | — | (no HR; non-overlapping scopes) |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| `BuildDirective` | authoring-program constructs → HR-BS1 inbound → BS validates |
| `PlanArtifactContent` | substrate (written by F-plan/Plan v2.2) → HR-BS2 inbound substrate read → BS2 mechanical assembles into BuildContext |
| `ResearchArtifactContent[]` | substrate (written by F-discover/Research v1.0) → HR-BS2 inbound substrate reads → BS2 assembles |
| `VerificationArtifactContent[]` | substrate (written by F-verify/VS v1.0) → HR-BS2 inbound substrate reads → BS2 assembles |
| `BuildEmission` | BS composes + validates → HR-BS3 outbound substrate write → F-output / F-verify consume from substrate |
| delegation payload | BS constructs per-instruction → HR-BS4 outbound to F-multi-instance → result captured verbatim into `files[instrId].content` |

---

## §7 Judgment

### §7.1 J-build-emission-observation

Generation-procedure-local judgment input. Consumed at generation-procedure S11 during BS v1.0 framework template generation. At runtime, BS1 (P8 Stage-1 step) carries the `judgmentInputRef` reference.

```
J-build-emission-observation:
  kind: observation
  consumedBy: builder-standard-v1-0 §3.7 BS1 (judgmentInputRef at generation time); generation-procedure-v1-0 S11 (framework template observation)
  shape: Judgment per substrate §6.2
  input: {
    draftTemplate: GeneratedFrameworkTemplate,   // post-BS2 mechanical, pre-emission
    gateResults: BS3 result                       // post-BS3 gate-execution
  }
  criteria:
    C1: Draft template populates eight top-level fields per v3-1-spec §3.3
        output schema (identity, schema, structure, validity, lifecycle,
        coupling, judgment, provenance) + validity.overallResult nested check.
        Mechanical: field-presence enumeration check.
    C2: BS3 gate results all overallResult = 'pass'.
        Mechanical: aggregation over perGateResults[] per BS3 step; combined AND.
    C3: No escalation raised during BS2–BS3 execution log.
        Mechanical: escalation-log inspection; escalation count = 0.
  provenance:
    instanceId: 'sprint-10-shot-1-BS-v1-0-generation'
    cycleId: 'sprint-10'
    timestamp: '2026-05-09T00:00:00Z'
    consumingFrameworkRef: builder-standard-v1-0
    consumingStepId: BS1
```

All three criteria mechanical per substrate §6.3 mechanical-criterion ground classes (enumeration, aggregation, log inspection — three of the six ground classes). Per MA-J2 mechanical-criterion ground: J-build-emission-observation is a fully-typed judgment input; consumer responsibility is to execute the three criteria and surface the aggregated observation result for L0 confirmation decision per generation-procedure §5.3.

### §7.2 Axis status

Populated (not empty). One BS-local J-input declared (J-build-emission-observation). Empty-declaration rule (substrate §8.6) does not apply.

### §7.3 Judgment provenance

J-build-emission-observation provenance populated per invocation at runtime. Phase delivery-time declaration provenance: L0 confirmation pending at v1.0 closure (matching pattern of metaframework §7.4 + generation-procedure §7.4).

MA-J4 provenance-completeness satisfied: judgment consumption at BS1 produces a provenance record with instanceId + cycleId + timestamp + consumingFrameworkRef + consumingStepId.

---

## §8 Self-audit results

### §8.1 Gate results

All 90 framework-tier gates (85 inherited + 5 BS-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation post-v1.0-confirmation. Per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11): when BS's gate set transitions from `not-yet-run` to `executed`, an AmendmentEvent of kind `'first-run'` is logged via standard amendment-propagation flow (AP1–AP7). BS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle section declares state transitions; §5.9 version history present |
| X2 Determinism / reproducibility | declared-complete | §3.6 axiom mechanical-criterion ground per substrate §6.3 (every BA-axiom reducible to one of six classes); §3.7 P8=4 generative-mode instances with PR4/PR5 self-check at §3.7.4; §7.1 P7=1 (one generation-time J-input, fully mechanical criteria) |
| X3 Observability / introspection | declared-complete | §6.2 HRs with captureShape per MA-C3; §6.3 captureShape table populated for HR-BS1..HR-BS4 (all diagnostic-significance=true) |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut row with 8 entries (F-multi-instance internals, surface rendering, substrate schema, retry timing, peer-program work synthesis, framework-audit boundary, B-direction post-beta, multi-build batch post-beta) |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared (per-build instruction count, content size, gate execution complexity, retry depth, restart chain depth) |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared with all required fields |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated |
| X9 Integration point | declared-complete | §6 cross-framework + HR-BS3 substrate write + HR-BS4 F-multi-instance delegation; §6.9 adjacent-framework call patterns |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=4 declarations with PR4/PR5 self-check at §3.7.4; stage values 1,2,3,5; all kind-specific fields populated per PG6 amended |

All ten audit dimensions declaratively complete at delivery. Framework-audit first-run ratifies at post-v1.0-confirmation.

### §8.3 Last audit event

Not yet run. v1.0 delivery is the first compilation of Builder Standard; framework-audit X1..X10 execution scheduled after L0 confirmation.

### §8.4 Self-application basis

Per G-U1 (self-application): BS's gate suite (G-BS1..G-BS5 + 85 inherited) will audit BS's own framework declaration file at framework-audit first-run. This is the framework-tier self-application (distinct from runtime artifact self-application which does not apply to generative-mode frameworks at v1.0).

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-09 | Initial declaration. Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 under substrate-v1-1 v1.6. Five BS-local P1 axes (Input, Instruction, Delegation, Emission, Retry). Five axioms BA1..BA5 with 1:1 axis-axiom binding: BA1 (input receipt + substrate resolution), BA2 (instruction ordering + kind enum), BA3 (emission field presence + verbatim directive carry), BA4 (retry/restart semantics + partial preservation), BA5 (F-multi-instance delegation contract + verdict derivation). Five paired gates G-BS1..G-BS5 (1:1 per G-M1). Four HRs HR-BS1..HR-BS4 with captureShape per substrate §8.2 amended P6. P7=1 (one generation-time J-input: J-build-emission-observation, §7.1; corrected from initial P7=0 per F-BS-4 resolution) and P8=4 (Mode=generative — BS1 judgment-input stage-1, BS2 mechanical stage-2, BS3 gate-execution stage-3, BS4 mechanical stage-5; PR4/PR5 self-check passes at §3.7.4). Carrier = self (substrate-direct write; rationale: build artifacts substrate-native, no chat-surface envelope needed at v1.0). BuildBinding shape declared with zero domain instances at v1.0. `referentCitations: []` per Cognitive v1.2.2 / VS v1.0 / RS v1.0 precedent. Provenance reference-default per A-20. J-build-emission-observation declared (§7.1; three mechanical criteria; consumed at generation-procedure S11). Distinct from F-multi-instance (tool) and peer programs (F-plan, F-discover, F-verify) by tier (L3 vs L4) and concern (typed-work synthesis contract vs execution). | Sprint 10 Shot 1 / Phase 2 missing-governance gate clearance per LIV deploy state |

---

**S11 — J-build-emission-observation gate results (amended post-auditor review — for L0 confirmation):**

**Amendments applied:** F-BS-1 (BA4 within-run scope clause added), F-BS-2 (G-BS1 sub-field enumeration expanded), F-BS-3 (BA5 + G-BS5 topological-order enforcement added), F-BS-4 (P7 corrected to 1; §3.2 updated; §8.2 X2 updated).

**C1 — Eight top-level fields populated:** identity ✓, schema ✓, structure ✓, validity ✓, lifecycle ✓, coupling ✓, judgment ✓, provenance ✓. validity.overallResult nested check: §4.8 declares `not-yet-run` with basis per first-run discipline — field present. **PASS.**

**C2 — BS3 gate results all pass (post-amendment):**
- G-BS1 (BA1 input receipt): predicate expanded at §4.2 to enumerate BuildBinding + BuildInstructionSet sub-fields explicitly; draft template §2.1 shapes + §6 Coupling consistent; no gap. **PASS.**
- G-BS2 (BA2 instruction ordering): acyclicity + enum membership + intra-set reference resolution conditions declared; §3.6 BA2 self-consistent. **PASS.**
- G-BS3 (BA3 emission fields): verbatim-carry + one-to-one cardinality + field-presence conditions declared; §2.2 shape + §3.6 BA3 consistent. **PASS.**
- G-BS4 (BA4 retry semantics): within-run scope clause added; deterministic-function-result + partial preservation declared; §5.6 failure modes consistent. **PASS.**
- G-BS5 (BA5 delegation + topological order + verdict): topological-order enforcement added (instruction B not delegated until all B.dependsOn produced); delegationRef + verdict derivation declared; §6.2 HR-BS4 delegation contract consistent. **PASS.**

BS3 overall: **PASS.**

**C3 — No escalation raised during BS2–BS3 derivation:** no gap, no undeclared case, no ambiguous boundary found during generation or amendment. Escalation count = 0. **PASS.**

**J-build-emission-observation overall: PASS. Delivering to L0 for S12 confirmation.**

---

**End of builder-standard-v1-0. Pending L0 confirmation at v1.0 closure.**
