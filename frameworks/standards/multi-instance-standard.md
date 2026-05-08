---
kind: framework
placement: frameworks/standards/
---

# multi-instance-standard-v2-3

**Kind:** Framework
**Mode:** generative
**Level:** L3
**Version:** v2.3
**Authority:** L0 pending (Phase: L3 regen wave cycle 3)
**Consumes:** substrate-v1-1, metaframework-v3-1, primitives.ts (core/R5), artifact-standard-v2-2, plan-standard-v2-2
**Consumed by:** programs that dispatch 1..N instances against a PlanArtifact (Builder, Research, Verify, dashboard), audit surfaces, replay systems
**Dependencies:** substrate-v1-1 (by reference, per HR1 inherited), metaframework-v3-1 (via HR6 receive-side output contract), generation-procedure-v1-0 (generator), artifact-standard-v2-2 (carrier — HR-MI3), plan-standard-v2-2 (consumed-by-reference — HR-MI2)
**Versioning discipline:** additive only (per MA-L1)
**Adjacent frameworks:** Plan Standard v2.2 (upstream; PlanArtifactContent consumer), Artifact Standard v2.2 (carrier), Living Memory (read path at HR-MI4), LIV-Standard (Semver custodian)

Multi-Instance Standard is the L3 generative-mode framework governing dispatch, execution, and aggregation of 1..N instances against a consumed `PlanArtifactContent`. Its content is rendered from metaframework-v3-1 §3 structural template via generation-procedure-v1-0 S1–S3 (M-I-specific three-step P8 procedure; distinct from generation-procedure's own S1–S12 which generates framework templates). This file is the `GeneratedFrameworkTemplate` emission per metaframework-v3-1 §2.2 output schema.

**Generator provenance:**
- `generatedByMetaframework`: `{id: 'metaframework', version: 'v3.2.1'}`
- `generationProcedureRef`: `{id: 'generation-procedure', version: 'v1.1.1'}`
- `sourceInputRef`: registry-archived `MetaframeworkInput` (reference-default per A-20)
- `generationTimestamp`: 2026-04-23T00:00:00Z

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Multi-Instance Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed this regen) |
| `mode` | `generative` (per substrate §2 Mode enum; `structured → produced`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `2.3` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference; string-typed this regen) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first `executeRun` invocation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `artifact-standard` v2.2 (per substrate §9 Carrier enum; applied §6.1; cross-framework calibration point) |
| `primitive` | `instance` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | `PlanArtifactContent` (via reference to `planAnchorNodeId`) per HR-MI2 |
| `produces` | `RunReportContent` (W-ATOM; rides as `ArtifactPayload.content` inside AS v2.2 emission per HR-MI3) |
| `consumedBy` | authoring programs (Builder, Research, Verify), observability, audit, replay |
| `adjacentFrameworks` | Plan Standard v2.2 (upstream), Artifact Standard v2.2 (carrier), Living Memory (R3 read), LIV-Standard (Semver custodian) |
| `scopeOut` | `['plan authoring (owned by Plan Standard)', 'emission mechanics (owned by Artifact Standard)', 'domain behavior — renderContract / validateContract body (owned by per-domain framework via DomainBinding)', 'graph physics — node/energy/traversal (owned by Living Memory)', 'code structure / runtime slice wiring (owned by LIV-Standard)', 'AI adapter selection and provisioning (LIV-Standard R4 runtime concern)', 'B-direction symmetric re-encoding (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed this regen):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.1' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.1' },
  generationCycle: 'L3-regen-wave-cycle-3',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: { id: 'multi-instance-standard', version: '2.2' }
}
```

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I5:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `generative` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named. |

### §1.3 MA-G13 four-property test (framework classification)

| Property | Satisfied by |
|---|---|
| Own state | `{stateTemplate, stateApplied}` ∈ substrate §9 `LifecycleState` enum; `{declared, applied, terminated, deprecated}` transitions declared at §5.1; per-run state `InstanceResult.status` + `RunReportContent.outcome` |
| Own I/O | input: `MIInput` (§2.1); output: `RunReportContent` (§2.2; rides inside AS `ArtifactEmission` per HR-MI3) |
| Own invariants | 10 axis-bound structural-transformation axioms (IA1..IA7 with IA4/IA7 decomposed: IA1, IA2, IA3, IA4a, IA4b, IA5, IA6, IA7a, IA7b, IA7c) per §3.6; + 35 axis-bound + 1 universal MA-G13 inherited from metaframework-v3-1 §3.2 |
| Own discipline | three P8 step procedure (§3.7 S1–S3 under Stages {2, 3, 5}); axiom gates G-MI1–G-MI7c at §4.2; handoff rules HR-MI1–HR-MI4 at §6.2 |

All four properties declared. MA-G13 passes. Multi-Instance Standard is classified as framework (not state store; not protocol; not substrate).

### §1.4 Hidden-sibling MA-G13 re-application (per spec §Constraints)

Per generation-time self-referential MA-G13 application: M-I's candidate sub-concerns tested for independent four-property satisfaction (would hoist to sibling framework if all four satisfied independently at sub-scope):

| Candidate | Own state | Own I/O | Own invariants | Own discipline | Hoist? |
|---|---|---|---|---|---|
| Per-instance execution | no (always a field of `RunReportContent`; no independent lifecycle) | no (per-instance input derives from `PlanArtifactContent.shape.declarations[i]`; no standalone schema.input) | no (IA1–IA3, IA6, IA7a–c scope M-I broadly; not a separable axiom cluster at per-instance tier) | no (retry + validate disciplines shared with set-level) | no |
| Set-level aggregation | no (`aggregation` is a section of `RunReportContent`; no independent state) | no (aggregation output is a field of M-I's own output) | no (IA1, IA4a, IA4b, IA5 scope set-level; but bound to M-I axes not separable) | no (shares dispatch + termination discipline with per-instance) | no |

Neither candidate satisfies all four. No hoist. No sibling framework concealed. MA-G13 self-application passes at M-I scope. (Finding also logged in delivery-report.md §A.)

---

## §2 Schema

### §2.1 Input — `MIInput`

Per MA-S1 (schema.input declared as typed atom) + carrier-applicability rule for carrier=`named`.

```
MIInput = {
  planAnchorNodeId: NodeId                    // reference to Plan emission anchor; resolves to PlanArtifactContent via F-memory R3
  userId:           UserId                    // F-identity session
  runTurnId:        string                    // caller turn context (distinct from Plan's turnId)
}
```

**Note on runtime dependencies (non-normative, LIV-Standard R4 concern).** The M-I implementation slice requires an AI adapter to invoke declarations materialized via `DomainBinding.renderContract`. The adapter handle is not a field of `MIInput` — it is a runtime dependency injected at LIV-Standard's R4 layer when the slice is wired. Adapter selection is fully a consuming-program + LIV-Standard concern; signaling at the boundary (if M-I needs adapter metadata) would appear as a W-ATOM (e.g., `AIAdapterDescriptor = { providerId, modelId }`), not a function handle. Current M-I v2.3 does not require adapter metadata at the boundary — the adapter is resolved entirely R4-side.

### §2.2 Output — `RunReportContent` (W-ATOM inside AS payload)

Per MA-S2 (carrier=`named` → output is W-ATOM riding inside carrier's `ArtifactPayload.content`). M-I produces `RunReportContent` which becomes `ArtifactPayload.content` in the AS v2.2 `createArtifact` invocation at S3 (HR-MI3 send path).

```
RunReportContent = {
  planId:               PlanId                // verbatim from consumed PlanArtifactContent.planId
  planAnchorNodeId:     NodeId                // verbatim from MIInput.planAnchorNodeId
  planVersion:          Semver                // verbatim from consumed PlanArtifactContent.planVersion
  bindingDomainId:      string                // verbatim from consumed PlanArtifactContent.binding.domainId
  bindingDomainVersion: Semver                // verbatim from consumed PlanArtifactContent.binding.domainVersion

  runId:                string                // runtime-generated (UUID v4 per run)
  startedAt:            EpochMs               // runtime-captured at dispatch start
  completedAt:          EpochMs               // runtime-captured at set terminal state

  outcome:              RunOutcome            // enum; per §3.5 positional

  instanceResults:      InstanceResult[]      // runtime-accumulated; one entry per dispatched declaration

  setViolations:        SetViolation[]        // runtime-captured on failsafe breach (IA4a / IA4b)

  aggregation:          Aggregation           // runtime-computed per topology aggregation rule (§3.4.a)
}

InstanceResult = {
  declId:     DeclId                          // verbatim from consumed PlanArtifactContent.shape.declarations[].id
  status:     InstanceTerminalState           // enum; per §3.5 positional (IA1)
  output?:    TypedAtom                       // AI adapter invocation output, validated by binding.validateContract (IA3)
  tokenCount: number                          // AI adapter response metadata
  durationMs: number                          // runtime-measured around adapter invocation
  retries:    number                          // runtime-accumulated per retry budget consumption
  errors:     InstanceError[]                 // runtime-captured per failure
}

InstanceError = {
  class:      ErrorClass                      // enum; CLASS_2 per IA7a capacity, or CLASS_3 infrastructure
  reason:     string
  message:    string
  resolution: ErrorResolution                 // enum
}

SetViolation = {
  failsafe:   string                          // identifier from PlanArtifactContent.limit.perSet keys
  breachedAt: EpochMs
  reason:     string
}

Aggregation = {
  topology:        PlanTopology               // verbatim from consumed PlanArtifactContent.shape.topology
  finalOutput?:    TypedAtom                  // per §3.4.a aggregation rule
  partialSuccess?: PartialSuccessRecord       // populated when PlanArtifactContent.limit.perSet.partialSuccess.allowed === true
}

PartialSuccessRecord = {
  required:  number                           // verbatim from consumed PlanArtifactContent.limit.perSet.partialSuccess.minSuccesses
  achieved:  number                           // runtime-counted complete instances
  satisfied: boolean                          // achieved >= required
}

TypedAtom = {
  typeRef: TypedAtomRef                       // consumed from PlanArtifactContent.intent[declId].outputContract
  value:   unknown                            // validated by binding.validateContract; opaque to M-I
}
```

**Provenance summary — three distinct source types across output fields:**

1. **Verbatim from consumed PlanArtifactContent** — `planId`, `planAnchorNodeId`, `planVersion`, `bindingDomainId`, `bindingDomainVersion`, `aggregation.topology`, `InstanceResult.declId`, `PartialSuccessRecord.required`.
2. **Runtime-generated / runtime-captured** — `runId`, `startedAt`, `completedAt`, `outcome`, `aggregation.finalOutput`, `PartialSuccessRecord.achieved`, `PartialSuccessRecord.satisfied`, `setViolations`, `InstanceResult.status`, `InstanceResult.durationMs`, `InstanceResult.retries`, `InstanceResult.errors`.
3. **Adjacent-framework-sourced** — `InstanceResult.output` (via AI adapter invocation + `DomainBinding.validateContract`; AI adapter is LIV-Standard R4 runtime, `validateContract` body is domain-standard-owned), `InstanceResult.tokenCount` (AI adapter response metadata).

No output field has ambiguous or undeclared source. MA-C4 + MA-C5 provenance-completeness satisfied at field granularity.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed this regen per spec §Constraints:

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `Kind` | substrate §4 A-10 |
| `Ownership` | substrate §4 A-11 |
| `AuthorityLevel` | substrate §5 |
| `AuthorityClaim` | substrate §5 |
| `Semver` | substrate §7 |
| `Stage` | substrate §8.3 |
| `StageContentKind` | substrate §8.3 |
| `CaptureShape` | substrate §8.2 |
| `LifecycleState` | substrate §9 |
| `Carrier` | substrate §9 |
| `GenesisDeclaration` | substrate §4 A-14 |
| `OperatorInterface` | substrate §4 A-13 |
| `FrameworkRef` | substrate §4 |
| `WAtom` | substrate §4 |
| `AxiomRef` | substrate §4 |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home |
|---|---|
| `NodeId` | primitives.ts (core/R5) |
| `UserId` | primitives.ts (core/R5) |
| `Semver` | primitives.ts (core/R5) — identical shape to substrate §7; R5 export is the canonical typed form |
| `Result` | primitives.ts (core/R5) |
| `AppError` | primitives.ts (core/R5) |

### §2.5 Consumed types (from artifact-standard-v2-2, by reference — cross-framework calibration point)

Per HR-MI3 (M-I → AS) + MA-C2 custody alignment + MA-C3 symmetry:

| Type | Home | Consumed at |
|---|---|---|
| `ArtifactEmission` | artifact-standard-v2-2 §2.2 | HR-MI3 return value; surfaced as `MIEmissionResult` success branch |
| `ArtifactPayload` | artifact-standard-v2-2 §2.2 | constructed at S3 with `content = RunReportContent` |
| `CreateArtifactInput` | artifact-standard-v2-2 §2.1 | constructed at S3 boundary with `payload: ArtifactPayload`, `dependsOn: [planAnchorNodeId]` |
| `ArtifactEdgeKind` | artifact-standard-v2-2 §3.5 | reference-only; M-I does not construct edges (ArA4a–d emit-time is AS's responsibility) |

### §2.6 Consumed types (from plan-standard-v2-2, by reference — cross-framework calibration point)

Per HR-MI2 (Plan → M-I) + MA-C2 custody alignment + MA-C3 symmetry:

| Type | Home | Consumed at |
|---|---|---|
| `PlanArtifactContent` | plan-standard-v2-2 §2.2 | resolved at S1 via F-memory R3 read of companion node at `planAnchorNodeId` |
| `Declaration` | plan-standard-v2-2 §2.2 | iterated at S2 per-declaration dispatch |
| `DeclId` | plan-standard-v2-2 §2.7 | `InstanceResult.declId`, `Aggregation` keying |
| `DomainBinding` | plan-standard-v2-2 §2.2 | consumed at S2 for `renderContract` + `validateContract` dispatch (IA6) |
| `RenderContractDescriptor` | plan-standard-v2-2 types | resolved against DomainBinding for instance materialization |
| `ValidateContractDescriptor` | plan-standard-v2-2 types | resolved against DomainBinding for handoff validation (IA3) |
| `RoleClassId` | plan-standard-v2-2 §2.7 | reference via `PlanArtifactContent.intent[declId].role` |
| `TierClass` | plan-standard-v2-2 §2.7 | reference via `PlanArtifactContent.intent[declId].tierHint` |
| `TypedAtomRef` | plan-standard-v2-2 §2.7 | `TypedAtom.typeRef` typing |
| `PlanTopology` | plan-standard-v2-2 §2.7 | `Aggregation.topology` enum reference |
| `PlanId` | plan-standard-v2-2 §2.7 | `RunReportContent.planId` |
| `EpochMs` | plan-standard-v2-2 §2.7 | `RunReportContent.startedAt`, `completedAt` |
| `Milliseconds` | plan-standard-v2-2 §2.7 | `PerSetLimit.maxTime` comparisons at IA4 |
| `DataFlowEdge` | plan-standard-v2-2 §2.7 | reference via `Declaration.dataFlow` for input materialization |

### §2.7 Consumed types (from metaframework-v3-1, by reference)

| Type | Home |
|---|---|
| `MetaframeworkInput` | metaframework-v3-1 §2.1 (consumed at regen time; not at M-I runtime) |
| `GeneratedFrameworkTemplate` | metaframework-v3-1 §2.2 (this file is an instance of this shape) |

### §2.8 M-I-local atoms (declared at point of use in §3)

Declared at point of use per PR1:

- `InstanceTerminalState` (enum) — declared §3.5.
- `SetTerminalState` (enum) — declared §3.5; alias `RunOutcome`.
- `ErrorClass` (enum) — declared §3.5.
- `ErrorResolution` (enum) — declared §3.5.
- `InstanceResult` (typed shape) — declared §2.2.
- `InstanceError` (typed shape) — declared §2.2.
- `SetViolation` (typed shape) — declared §2.2.
- `Aggregation` (typed shape) — declared §2.2.
- `PartialSuccessRecord` (typed shape) — declared §2.2.
- `TypedAtom` (typed shape) — declared §2.2.
- `MIHandoffRuleInstance` (per substrate §8.2 P6 amended) — declared §6.2.
- `MIGateResult` (typed shape) — declared §4.2.
- `MIDimensionResult` (typed shape) — declared §4.4.
- `MICustodyRow` (typed shape) — declared §6.5.
- `MIValidityError` (AppError subtype) — declared §2.1 error channel.
- `MIEmissionResult` (Result<ArtifactEmission, MIValidityError>) — declared §2.1 return channel.

### §2.9 Schema rules (ScR-series)

Per metaframework-v3-1 §2.5 (by reference to v3-1-spec §3.3). No M-I-local ScR additions.

### §2.10 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only here per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

M-I inherits metaframework-v3-1 §3.1 seven-axis set (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes declared once (metaframework) and consumed at multiple sites. M-I does not redeclare.

Per v3-1-spec §4.4 file-specific placement, M-I's own structural content populates §3.3–§3.7 below: three P1 Axis instances (M-I-local under A3 Structure), sub-axis instances, leaves, axioms (IA1–IA7c with decomposed forms), and the three-step P8 procedure.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 3 | M-I-local P1 axes under A3 Structure (rendering v2.2 three-axis shell into the seven-axis shell): `Shape`, `Execution`, `Bounds`. Declared §3.3. Per metaframework §3.4 row "declare per-axis as MECE requires in derived L3 frameworks." |
| P2 Sub-axis | 11 | Declared §3.4. One sub-axis per atomic concern inside each M-I-local P1 axis. |
| P3 Leaf | 11 | One leaf per axiom condition per MA-St2 leaf atomicity; IA1..IA7 with IA4a–b + IA7a–c splits → 10 leaves. Plus one structural leaf for `Bounds/terminal-states` (IA1 + aggregation-state field surface) = 11. Declared §3.5. |
| P4 Axiom | 10 | IA1, IA2, IA3, IA4a, IA4b, IA5, IA6, IA7a, IA7b, IA7c. Declared §3.6. |
| P5 Gate | 10 | M-I-own axiom gates G-MI1..G-MI7c per MA-V1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-MI1 (authoring-program → M-I), HR-MI2 (Plan → M-I), HR-MI3 (M-I → AS v2.2), HR-MI4 (M-I → Living Memory). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: P7, instanceCount: 0, basis: "M-I's executeRun procedure is fully mechanical. Every axiom condition (IA1–IA7c) reduces to substrate §6.3 mechanical-criterion ground: structural property (IA1, IA2, IA4b), deterministic-function result (IA3, IA6, IA7c), cardinality (IA4a, IA5, IA7b), enum membership (IA7a error class). No non-mechanical derivation required at S1, S2, or S3. MA-J4 emptyDeclared satisfied."}` |
| P8 Procedure step | 3 | S1 compose, S2 gate-execute, S3 emit. Declared §3.7 under substrate §8.3 Stages {2, 3, 5}. PR4 monotonic + PR5 kind-aligned. |

Positive empty-declaration marker per substrate §8.6 for P7 zero count. Implicit-absence disallowed; zero-state declared.

### §3.3 P1 Axis instances (M-I-local under A3 Structure)

Per MA-St1 (axis MECE over concern space).

| Axis | Governs | Atomic question | Content source |
|---|---|---|---|
| **Shape** | structure of the execution set at runtime | how do instances relate during dispatch? | consumed `PlanArtifactContent.shape` |
| **Execution** | inside one instance invocation | what happens in one invocation? | runtime-computed per `DomainBinding` (IA6) |
| **Bounds** | termination across instance and set scopes | when does an instance or set stop? | consumed `PlanArtifactContent.limit` + runtime-observed |

**MECE self-check (MA-St1):** pairwise orthogonal — Shape scopes cross-instance structure; Execution scopes intra-instance behavior; Bounds scopes termination predicates. No pair overlaps concern. Collectively exhaustive — every M-I runtime concern reduces to one of: how instances relate (Shape), what one instance does (Execution), when to stop (Bounds). No concern escapes; no concern doubles.

### §3.4 P2 Sub-axis instances

Per MA-St3 (orthogonality within axis).

**Under `Shape`:**

| Sub-axis | Atomic concern |
|---|---|
| `topology` | which cross-instance pattern governs (sequence / tier / loop / singleton) |
| `dispatch-pattern` | per-topology dispatch schedule (serial / parallel-within-tier / iterative / single-call) |
| `data-propagation` | typed wires between declarations (per `Declaration.dataFlow`) |
| `aggregation-rule` | per-topology final-output rule (table §3.4.a) |

**Under `Execution`:**

| Sub-axis | Atomic concern |
|---|---|
| `invocation` | instance input materialization via `DomainBinding.renderContract` and adapter invocation |
| `handoff-validation` | output validation via `DomainBinding.validateContract` |
| `result-capture` | `InstanceResult` assembly per invocation |
| `engine-neutrality` | domain-specific logic stays in `DomainBinding`, not in engine code (IA6) |

**Under `Bounds`:**

| Sub-axis | Atomic concern |
|---|---|
| `error-class` | classification of failure source (CLASS_2 output/capacity, CLASS_3 infrastructure) |
| `retry-policy` | per-declaration retry-budget consumption against `limit.perDecl.retryBudget` |
| `failsafe-policy` | per-set failsafe breach detection against `limit.perSet` |

Total P2 instances: 4 + 4 + 3 = 11.

#### §3.4.a Aggregation table

Per `Shape/aggregation-rule` sub-axis leaf:

| Topology | `finalOutput` | Set outcome on partial failure |
|---|---|---|
| `sequence` | output of last complete instance; if any non-final instance fails, set outcome is `failed` and later declarations are not dispatched | `failed` |
| `tier` | record keyed by `declId` with value = per-declaration output | `complete` `\|` `partial` `\|` `failed` per `partialSuccess` policy |
| `loop` | output of terminal iteration (loop exit condition) | `complete` `\|` `failed` `\|` `escalated` |
| `singleton` | output of sole instance | `complete` `\|` `failed` `\|` `escalated` |

**Note on notation (per Pattern 1 spec constraint).** Topology names and outcome values are enum literals (substrate §9 terminology + M-I-local `RunOutcome` enum §3.5). No arrow-notation; this table's left-to-right read is tabular, not causal — each row is a predicate body.

### §3.5 P3 Leaf instances + enum literals

Leaves mapped to axioms per MA-St2 leaf atomicity:

| Leaf | Sub-axis | Axiom tested | Mechanical literal or type |
|---|---|---|---|
| `leaf-topology-enum` | `Shape/topology` | — (structural property, baseline) | `PlanTopology = 'sequence' \| 'tier' \| 'loop' \| 'singleton'` (consumed from Plan) |
| `leaf-aggregation-rule` | `Shape/aggregation-rule` | IA5 | per §3.4.a table rows; literal predicate per row |
| `leaf-data-propagation` | `Shape/data-propagation` | IA3 (validation gates propagation) | `DataFlowEdge[]` from `Declaration.dataFlow` |
| `leaf-invocation` | `Execution/invocation` | IA6 (engine neutrality) | `renderContract(decl, upstreamOutputs): TypedAtom` |
| `leaf-handoff-validation` | `Execution/handoff-validation` | IA3 | `validateContract(decl, output): boolean` |
| `leaf-result-capture` | `Execution/result-capture` | IA1 (terminal state) | `InstanceResult` shape from §2.2 |
| `leaf-engine-neutrality` | `Execution/engine-neutrality` | IA2 (no engine mutation) + IA6 | `readonly` discipline on `Declaration` fields + `DomainBinding` call indirection |
| `leaf-error-class` | `Bounds/error-class` | IA7a | `ErrorClass = 'CLASS_2' \| 'CLASS_3'` enum |
| `leaf-retry-policy` | `Bounds/retry-policy` | IA7b | numeric budget: `retries < limit.perDecl[declId].retryBudget` |
| `leaf-failsafe-policy` | `Bounds/failsafe-policy` | IA4a + IA4b | predicate bundle against `limit.perSet.{maxTime, maxTransitions, maxReentries, domainFailsafes}` |
| `leaf-terminal-states` | `Bounds` (axis-scope) | IA1 | enum literals below |

**M-I-local enum literals:**

```
InstanceTerminalState = 'complete' | 'failed' | 'escalated'

SetTerminalState = 'complete' | 'failed' | 'escalated' | 'partial'
// alias: RunOutcome = SetTerminalState

ErrorClass = 'CLASS_2' | 'CLASS_3'

ErrorResolution = 'retried' | 'escalated' | 'terminal'
```

Total P3 leaves: 11 (matching §3.2).

### §3.6 P4 Axiom instances (IA1–IA7c)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate).

**No-text-drift rule applied:** IA1..IA7c axiom condition text preserved verbatim from v2.2 reference §6. Attachment columns updated to seven-axis shell per regen against MF v3.1; mechanical condition text unchanged.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **IA1** | `Bounds/leaf-terminal-states` | Every dispatched instance reaches one of `complete \| failed \| escalated`. | structural property (terminal-state reachability) |
| **IA2** | `Execution/engine-neutrality` / `leaf-engine-neutrality` | The engine executes the declaration as given; no engine-side mutation of `decl.role`, `decl.inputContract`, `decl.outputContract`, `decl.dataFlow`, or `decl.dependsOn`. | structural property (mutation-rejection predicate on `Declaration` fields) |
| **IA3** | `Execution/handoff-validation` / `leaf-handoff-validation` | Every instance's output is validated via `content.binding.validateContract` before propagation to downstream declarations; validation failure blocks propagation. | deterministic-function result (boolean predicate on output) |
| **IA4a** | `Bounds/failsafe-policy` / `leaf-failsafe-policy` | Set-level failsafe breach overrides per-declaration retry budgets: on breach, no further per-declaration retry attempts are dispatched. | cardinality (retry-attempt count bounded post-breach) |
| **IA4b** | `Bounds/failsafe-policy` / `leaf-failsafe-policy` | Set-level failsafe breach transitions the set to `failed` or `escalated` (non-retryable). | structural property (set terminal-state post-breach) |
| **IA5** | `Shape/aggregation-rule` / `leaf-aggregation-rule` | Per-instance failure does not cascade to sibling instances unless the active topology's aggregation rule (per §3.4.a) or a declared partial-success policy calls for it. | cardinality (cascaded-failure count bounded by rule) |
| **IA6** | `Execution/engine-neutrality` / `leaf-engine-neutrality` | All domain-specific materialization and validation resolves through `content.binding`; the engine contains no domain-specific code paths. | deterministic-function result (dispatch indirection predicate) |
| **IA7a** | `Bounds/error-class` / `leaf-error-class` | When materialized invocation exceeds runtime capacity (context overflow, token budget, domain-declared limit), the engine emits a CLASS_2 failure with `reason = 'capacity-breach'`. | enum membership (failure class ∈ {CLASS_2}) |
| **IA7b** | `Bounds/retry-policy` / `leaf-retry-policy` | A capacity-breach failure consumes exactly one retry budget unit from `content.limit.perDecl[declId].retryBudget`. | cardinality (budget-consumption count = 1 per breach) |
| **IA7c** | `Execution/engine-neutrality` / `leaf-engine-neutrality` | On capacity breach, the engine does not split, resize, or rewrite the declaration; re-planning is the producer program's responsibility upon RunReport receipt. | deterministic-function result (identity function over Declaration post-breach) |

**AxR1 self-check:** each axiom binds to exactly one axis/sub-axis/leaf per attachment column. IA6 and IA2 both attach to `engine-neutrality` but via distinct leaves — IA2 tests non-mutation of specific `Declaration` fields; IA6 tests dispatch-indirection topology. Different mechanical conditions, same sub-axis scope; per AxR1 "one axis" — both bind to `Execution` axis without overlap at the leaf-attachment layer. IA7c binds to `engine-neutrality` at a third distinct leaf-semantic: identity-function constraint on Declaration post-breach (no rewrite). Three distinct leaf attachments permitted per MA-St4 (primitive-atomicity: each leaf tests one primitive condition). Pass.

**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.

**AxR3 self-check:** axiom set additively versioned from v2.2 (v2.2 had IA1..IA7 with IA4 split into IA4a–b and IA7 split into IA7a–b–c; v2.3 preserves the 10-axiom set verbatim; regeneration against MF v3.1 seven-axis shell updates *attachment* columns but not *condition text* per no-text-drift constraint). Pass.

**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances

Per substrate §8.3 amended P8 shape: `{id, order, stage, kind, input, output, derivation? | judgmentInputRef? | gates}`. M-I's own three-step procedure (distinct from generation-procedure's twelve-step framework-template-generation procedure). M-I Mode = generative; P8 required.

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **S1** | 1 | 2 | `mechanical` | `MIInput` + (resolved) `PlanArtifactContent` via HR-MI4 read | composed `RunContext` = `{plan, binding, declarationSet, limitSet, runId, startedAt, userId}` with per-declaration dispatch plan per `topology` | `derivation = "resolve PlanArtifactContent via F-memory R3 read at planAnchorNodeId (HR-MI4 one-hop); generate runId via UUID v4; capture startedAt via runtime clock; bind DomainBinding from PlanArtifactContent.binding verbatim (IA2 no mutation); construct dispatch plan per PlanArtifactContent.shape.topology using aggregation rule §3.4.a; initialize InstanceResult[] with status='pending' per declaration; initialize SetViolation[] empty"` |
| **S2** | 2 | 3 | `gate-execution` | `RunContext` from S1 + per-invocation instance results + framework-tier gate bundle | per-gate results + overall pass/fail; `InstanceResult[]` populated with terminal states per IA1; `SetViolation[]` populated on failsafe breach per IA4a/b; `aggregation` computed per §3.4.a | `gates = [PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-MI1, G-MI2, G-MI3, G-MI4a, G-MI4b, G-MI5, G-MI6, G-MI7a, G-MI7b, G-MI7c, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4]` (52 framework-tier gates inherited from metaframework §4.7 canonical enumeration per `MetaframeworkGateIdSet` + 10 M-I-own axiom gates G-MI1..G-MI7c; total per-invocation S2 gate count: 62) |
| **S3** | 3 | 5 | `mechanical` | `RunContext` + populated `InstanceResult[]` + `SetViolation[]` + `aggregation` from S2 | `MIEmissionResult = Result<ArtifactEmission, MIValidityError>` (AS v2.2 emission receipt on success branch, or typed validity error on failure branch) | `derivation = "assemble RunReportContent from RunContext + InstanceResult[] + SetViolation[] + aggregation (provenance per §2.2 three-source classification); construct CreateArtifactInput with framework = {id: 'multi-instance', version: '2.3'}, turnId = input.runTurnId, userId = input.userId, payload = ArtifactPayload{domain: 'multi-instance', domainVersion: '2.3', schemaRef: 'RunReportContent', content: RunReportContent}, classificationNodeId + primitive + confidence = Cognitive Standard R3 encodeLLM(RunReportContent) same-turn result, dependsOn = [input.planAnchorNodeId]; invoke AS v2.2 createArtifact per HR-MI3 send path; return ArtifactEmission on success or MIValidityError on failure per MA-L4 escalation path"` |

**Disambiguation note on S2 gates field:** M-I's S2 gate-execution step declares the full 52 framework-tier gate bundle per metaframework `MetaframeworkGateIdSet` atom (metaframework §6.5), PLUS M-I's own 10 axiom gates (G-MI1..G-MI7c). The inherited axiom gates (G-I1..G-J4, 35 entries) test metaframework's own 35 axis-bound axioms when M-I is the audit target — i.e., they test M-I's conformance to metaframework axioms (MA-I1..MA-J4). M-I's own axiom gates (G-MI1..G-MI7c) test M-I's own 10 axioms (IA1..IA7c). Total per-invocation gate count at S2: 52 metaframework-tier + 10 M-I-own = 62 gates. Substrate-tier gates (SG1–SG4) excluded per substrate §11.5 tier-1 "run once, not per framework" semantics.

**PR4 stage monotonicity self-check:** stages across order `[1→2, 2→3, 3→5]` are non-decreasing. Stage 4 is skipped positively — P7 = 0 empty-declared per §3.2; no judgment observation step required at M-I runtime. Skipping Stage 4 is permitted under PR4 when the intermediate stage has no required kind per PR5 (Stage 4 kind = `judgment-input`, and M-I declares zero P7 instances per §3.2). PR4 passes.

**PR5 stage-content-kind alignment self-check:**
- S1 stage=2, kind=`mechanical` ✓ (required: `mechanical` per StageContentKind[2])
- S2 stage=3, kind=`gate-execution` ✓ (required: `gate-execution` per StageContentKind[3])
- S3 stage=5, kind=`mechanical` ✓ (required: `mechanical` per StageContentKind[5])

All three aligned. PR5 passes.

**PG6 amended kind-specific field requirement:**
- S1 (kind=`mechanical`) → `derivation` declared ✓
- S2 (kind=`gate-execution`) → `gates` populated with axiom + invariant refs ✓
- S3 (kind=`mechanical`) → `derivation` declared ✓

All three satisfy PG6 amended.

### §3.8 Universal-variables table

Per metaframework §3.1 + substrate §3.2 four universal variables (Temporal, Categorical, Relational, Positional) applied per M-I-local axis:

| M-I Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Shape | `PlanArtifactContent.planVersion` (consumed Semver) | `PlanTopology` enum (`'sequence' \| 'tier' \| 'loop' \| 'singleton'`) | `Declaration.dependsOn: DeclId[]` (same-plan sibling references); `Declaration.dataFlow: DataFlowEdge[]` (typed-wire graph, DeclId-keyed) | `ShapePositional = 'dispatched' \| 'settled'` (runtime) |
| Execution | `adapterVersion: Semver` (runtime-captured per invocation; LIV-Standard R4 provides) | `role: RoleClassId` from `PlanArtifactContent.intent[declId].role` | `IntentEntry.inputContract: TypedAtomRef` paired with `IntentEntry.outputContract: TypedAtomRef` (dual typed-field reference per declaration) | `InstanceTerminalState = 'pending' \| 'running' \| 'complete' \| 'failed' \| 'escalated'` |
| Bounds | `runId: string` (per run identity) | `ErrorClass` enum (`'CLASS_2' \| 'CLASS_3'`) | `scope: 'instance' \| 'set'` (bound-check scope) | `BoundsPositional = 'within' \| 'breached'` |

All Relational cells express dependency order via named-type + typed-field reference per MA-G6.

### §3.9 Vocabulary

Framework-local terms declared inline at point of use per PR1 (substrate §10.2). Substrate + metaframework + adjacent-framework terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `instance` | this table | one execution of one declaration from a consumed `PlanArtifactContent.shape.declarations[]`; produces typed output or terminal failure; cardinality N derives from declaration count |
| `set` | this table | the group of instances produced by one run of M-I against one `PlanArtifactContent`; aggregated per §3.4.a |
| `dispatch` | this table | the act of starting an instance per `Shape/dispatch-pattern` |
| `run` | this table | one full invocation of M-I against one `PlanArtifactContent`; identified by `runId` |
| `capacity breach` | this table | materialized invocation exceeds runtime limit (context, token, or domain-declared); produces CLASS_2 failure per IA7a |
| `DomainBinding` | plan-standard-v2-2 §2.2 | consumed by reference; Plan-authored slot holding `renderContract` + `validateContract` + role classes + tier limits + failsafes |
| `RunContext` | §3.7 S1 output | composed intermediate atom held during S2 execution; not emitted |
| `MIInput` | §2.1 | consumed W-ATOM |
| `RunReportContent` | §2.2 | produced W-ATOM (rides as AS payload content) |
| `InstanceResult` | §2.2 | per-instance terminal result atom |
| `SetViolation` | §2.2 | per-failsafe-breach record atom |
| `Aggregation` | §2.2 | per-run aggregation atom per §3.4.a |
| `PartialSuccessRecord` | §2.2 | partial-success satisfaction record |
| `TypedAtom` | §2.2 | typed output atom with `TypedAtomRef` typing |
| `InstanceTerminalState` | §3.5 | enum |
| `SetTerminalState` / `RunOutcome` | §3.5 | enum |
| `ErrorClass` | §3.5 | enum |
| `ErrorResolution` | §3.5 | enum |
| `MIEmissionResult` | §2.1 | `Result<ArtifactEmission, MIValidityError>` typed return |
| `MIValidityError` | §2.1 | `AppError` subtype per primitives.ts R5 |

---

## §4 Validity

### §4.1 Gate count

**62 total gates executed against M-I per invocation at S2** (composed of 52 framework-tier gates inherited from metaframework-v3-1 + 10 M-I-own axiom gates). Per substrate §11.5 tier classification:

| Gate tier | Count | Source | Executed against |
|---|---|---|---|
| Tier 1 — Substrate gates (run once, not per framework) | 4 | substrate §11 SG1–SG4 | substrate integrity; NOT per-framework |
| Tier 2a — Primitive gates (per framework) | 7 | metaframework §4.1 PG1–PG7 | M-I primitive discipline |
| Tier 2b — Inherited axiom gates (per framework) | 35 | metaframework §4.1 G-I1–G-J4 | M-I conformance to MA-I1–MA-J4 |
| Tier 2c — MA-G13 universal gate | 1 | metaframework §4.1 G-G13 | M-I structural identity |
| Tier 3 — F-69 universal gates | 5 | metaframework §4.3 G-U1–G-U5 | M-I self-application + propagation + coverage |
| Tier 4 — Meta-gates | 4 | metaframework §4.2 G-M1–G-M4 | M-I gate-set integrity |
| M-I-own axiom gates (per framework) | 10 | this framework §4.2 | M-I's own 10 axioms IA1..IA7c |
| **Total per-invocation** | **62** | | |

M-I-own gates declared here at §4.2. Inherited gate IDs consumed by reference per metaframework `MetaframeworkGateIdSet` atom — canonical enumeration in metaframework §4.7.

### §4.2 M-I-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate).

**Gate result shape (M-I-local atom):**

```
MIGateResult = {
  gateId:         'G-MI1' | 'G-MI2' | 'G-MI3' | 'G-MI4a' | 'G-MI4b' | 'G-MI5' | 'G-MI6' | 'G-MI7a' | 'G-MI7b' | 'G-MI7c'
  testedAxiomId:  'IA1' | 'IA2' | 'IA3' | 'IA4a' | 'IA4b' | 'IA5' | 'IA6' | 'IA7a' | 'IA7b' | 'IA7c'
  result:         'pass' | 'fail'
  escalationPath: 'G-MI-retry' | 'G-MI-escalate-to-L0'
}
```

**Gates:**

| Gate | Tests axiom | Mechanical predicate | Ground class |
|---|---|---|---|
| **G-MI1** | IA1 | `forall i ∈ instanceResults: i.status ∈ {'complete', 'failed', 'escalated'}` (enum membership over terminal states) | structural property |
| **G-MI2** | IA2 | `deepEqual(runContext.plan.shape.declarations, postRunSnapshot(plan.shape.declarations)) === true && deepEqual(runContext.plan.binding, postRunSnapshot(plan.binding)) === true` (no engine-side mutation predicate) | structural property (mutation-rejection) |
| **G-MI3** | IA3 | `forall i ∈ instanceResults where i.output !== undefined: binding.validateContract(decl[i.declId], i.output) === true` (validation predicate invariant) | deterministic-function result |
| **G-MI4a** | IA4a | `let b = breachTime(setViolations); let r = count(retry-attempts after b); r === 0` (post-breach retry count predicate) | cardinality |
| **G-MI4b** | IA4b | `setViolations.length > 0 → aggregation.outcome ∈ {'failed', 'escalated'}` (conditional set-state predicate) | structural property |
| **G-MI5** | IA5 | `forall i ∈ instanceResults where i.status === 'failed': siblings(i).status ∉ {'failed-by-cascade'} UNLESS aggregationRuleRequiresCascade(runContext.plan.shape.topology, runContext.plan.limit.perSet.partialSuccess)` (cascade-bounded predicate per §3.4.a) | cardinality |
| **G-MI6** | IA6 | `forall callsite ∈ engineCode: callsite.target ∈ {binding.renderContract, binding.validateContract, binding.tierLimits, binding.domainFailsafes, binding.splitAxis} OR callsite.isEngineNative === true` (dispatch-indirection predicate) | deterministic-function result |
| **G-MI7a** | IA7a | `forall e ∈ instanceResults.flatMap(i => i.errors) where e.reason === 'capacity-breach': e.class === 'CLASS_2'` (enum-membership conditional predicate) | enum membership |
| **G-MI7b** | IA7b | `forall e ∈ capacityBreachEvents: budgetConsumedByEvent(e) === 1` (cardinality = 1 per breach) | cardinality |
| **G-MI7c** | IA7c | `forall e ∈ capacityBreachEvents: deepEqual(runContext.plan.shape.declarations[e.declId], preBreachSnapshot[e.declId]) === true` (identity-function predicate on Declaration post-breach) | deterministic-function result (identity) |

**MA-V1 check:** 10 axioms → 10 gates. Pass.
**G-M1 check:** 10:10 1:1. Each axiom has exactly one primary gate. Pass.
**MA-V2 check:** each gate tests its bound axiom's mechanical predicate; no cross-axiom testing. Pass.
**MA-V3 check:** gate predicates stated as directly-executable boolean predicates over runtime state. No "gate passes iff another gate passes" indirection. Pass.
**MA-V4 check:** gate re-verification on state change — M-I state changes occur only via `executeRun` invocation; each invocation invokes S2 gate-execution. Re-verification is the invocation itself. Pass.
**MA-V5 check:** gate set exhaustive over declared axioms (G-M2 reverse coverage); every axiom has ≥1 executing gate. Pass.

### §4.3 Inherited gate execution at audit time

Inherited 52 framework-tier gates execute against M-I during framework-audit's first-run per G-U1 self-application and at runtime S2 per §3.7. State at delivery: `not-yet-run` uniform across all 52 inherited gates. Enumeration consumed by reference via `MetaframeworkGateIdSet`; no restatement here per R-0026 / R-0041 single-source-via-reference.

### §4.4 Dimension–gate mapping (per MA-V5)

Per framework-audit-v1-3 §3.3 ten audit dimensions (X1–X10). M-I dimension results atom:

```
MIDimensionResult = {
  dimensionId:  'X1' | 'X2' | 'X3' | 'X4' | 'X5' | 'X6' | 'X7' | 'X8' | 'X9' | 'X10'
  status:       'pending-first-run' | 'pass' | 'fail'
  evidence:     string
}
```

All 10 dimensions: status = `pending-first-run` at delivery. Uniform state; compact summary per sprint-mode Q4. Dimension IDs enumerated: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-3 §3.3.

**X10 extended predicate relevance.** Phase 1.2 extended X10 with three bullets (stage declaration per substrate §8.3, PR4 monotonicity, PR5 kind alignment). X10 applies directly to M-I's three P8 instances. Self-check already applied at §3.7 above (all three pass); framework-audit first-run verifies independently.

**X3 extended criterion C5 relevance.** Phase 1.2 extended X3 with C5 (captureShape required per P6 instance with diagnosticSignificance=true). M-I declares four HRs (three with diagnosticSignificance=true, one without) and populates captureShape at §6.3 for the three; self-check declares pass for C5.

### §4.5 Gate execution order

Per metaframework §4.4 topological tier order:

1. **Tier 1** — Substrate gates SG1–SG4: run once, not per framework (substrate §11.5).
2. **Tier 2** — Primitive gates PG1–PG7 + axiom gates G-MI1..G-MI7c + inherited axiom gates G-I1..G-J4 + G-G13: 7 + 10 + 35 + 1 = 53.
3. **Tier 3** — Universal gates G-U1..G-U5: 5.
4. **Tier 4** — Meta-gates G-M1..G-M4: 4.

Per-framework total (tiers 2–4): 53 + 5 + 4 = 62. Matches §4.1 row "Total per-invocation."

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5 (A-24): G-M failure → universal gates re-run; universal pass → axiom gates re-verified; axiom failure within tier bound. Tier 1 (substrate) failure terminal, escalates to L0 per bootstrap restore.

### §4.7 Gate rules (GR-series)

Per metaframework §4.6 (unchanged from original spec). Consumed by reference.

### §4.8 Current gate results

All 62 per-invocation gates: state = `not-yet-run`. First-run pending framework-audit + runtime S2 execution. Gate ID enumeration per §4.1 composition (52 inherited + 10 M-I-own per §4.2).

---

## §5 Lifecycle

### §5.1 Version transition

v2.2 → v2.3. Additive per MA-L1 (v2.2's 10-axiom set preserved verbatim per no-text-drift constraint; seven-axis shell rendered per metaframework-v3-1 §3.1; carrier bumped AS v2.1 → AS v2.2 per spec §Cross-framework calibration; HRs refreshed with captureShape + diagnosticSignificance per substrate §8.2 amended P6). No v2.2 axiom text removed; no axiom condition weakened; no primitive dropped.

### §5.2 Amendment trigger

Gap-driven. Current regen driven by spec-mi-regen-v3-1 cycle directive (L0 activation at cycle 3 of L3 regen wave). No amendment active post-delivery.

### §5.3 Confirmation gate

L0 confirms at cycle 3 closure. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation cycle).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` at delivery. No Kind A escalation raised during generation.

### §5.5 Judgment deprecations

Empty at delivery. M-I declares zero P7 judgment inputs per §3.2; no MA-L5 events possible.

### §5.6 Failure modes

Per v3-1-spec §3.3 output-schema `lifecycle` field (V5-verification additions):

| Failure mode | Detection | Recovery path |
|---|---|---|
| S1 — `MIInput.planAnchorNodeId` resolves to absent or non-Plan-Standard node via HR-MI4 | resolution returns null or mismatched `framework.id` | fail-at-intake; return `MIValidityError {code: 'MI_PLAN_NOT_FOUND', ...}`; no S2 entry |
| S1 — consumed `PlanArtifactContent` violates Plan Standard validity (PA1–PA12 breach) | Plan is trusted per HR-MI2 contract; if breach surfaces during resolution, it is a cascade-upstream structural finding | fail-at-intake; return `MIValidityError {code: 'MI_PLAN_INVALID', ...}`; escalate to L0 as Plan-standard-root finding (not M-I-root) |
| S2 — any G-MI* axiom gate fails | per-gate `result === 'fail'` | apply metaframework §4.5 backward-invalidation; retry per IA7b budget OR escalate per G-M4 path; on terminal failure, return `MIValidityError {code: 'MI_AXIOM_VIOLATION', gateId: ...}` |
| S2 — any inherited framework-tier gate fails | per-gate `result === 'fail'` | apply metaframework §4.5 backward-invalidation; escalate to L0 on tier-1 (non-reachable here; filtered at framework-audit) or tier-2+ fail |
| S2 — set-level failsafe breach (IA4a/b) | `setViolations.length > 0` | transition set outcome to `failed` or `escalated` (IA4b); suppress further retries (IA4a); S2 proceeds to S3 with failed/escalated outcome |
| S3 — AS v2.2 `createArtifact` returns failure | `Result.ok === false` from HR-MI3 invocation | return `MIValidityError {code: 'MI_AS_EMISSION_FAILED', underlyingError: ...}`; M-I's run is not persisted via AS carrier; escalate to L0 per MA-L4 |

### §5.7 Scale bounds

Bounded by:
- consumed `PlanArtifactContent.shape.declarations.length` (per Plan's PA1/PA2 bounds)
- `PlanArtifactContent.limit.perSet.maxTime` / `maxTransitions` / `maxReentries` failsafes (IA4a/b)
- AS v2.2 registry write throughput per substrate §13.4 (emission side)
- adapter throughput (LIV-Standard R4 concern, non-normative at M-I boundary)

No M-I-declared upper bound on cardinality within these adjacent-framework-declared bounds.

### §5.8 Atomicity declarations

Per substrate §13.4 atomicity row "Owned framework execution: interruptible":
- S1 atomic at step boundary; recovery point = fresh re-dispatch with same `MIInput` (idempotent on `planAnchorNodeId`).
- S2 per-instance atomic at per-invocation boundary; partial progress recorded in `InstanceResult[]` with `status = 'running'` until terminal; recovery re-enters S2 at per-instance granularity, honoring IA4a suppression.
- S3 atomic at emission boundary per AS v2.2 ArA5 immutability; emission either commits fully (ArtifactEmission returned) or fails entirely (MIValidityError returned with no partial AS emission).

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v2.0 | pre-v3.0 metaframework delivery | Regenerated against metaframework v2.4 (per v2.2 change log). | L0 |
| v2.1 | pre-v3.0 | Decomposition: IA4 → IA4a+IA4b; IA7 → IA7a+IA7b+IA7c. | L0 |
| v2.2 | pre-v3.0 | `aiAdapter` removed from `MIInput` (runtime dependency, not signal); carrier held at AS v2.1; §5 Execution.Temporal resolved to `adapterVersion: string`. | L0 |
| v2.3 | 2026-04-23 (L3 regen wave cycle 3) | Regenerated against metaframework-v3-1 via generation-procedure-v1-0. Seven-axis shell adopted (A1–A7 inherited); v2.2 three-axis shape (`Shape`/`Execution`/`Bounds`) rendered as M-I-local P1 axes under A3 Structure. Three P8 steps (S1–S3) under substrate §8.3 Stages {2, 3, 5} with PR4 + PR5 compliance and Stage 4 positively skipped (P7=0 empty-declared). Four handoff rules (HR-MI1..HR-MI4) with captureShape + diagnosticSignificance per substrate §8.2 amended P6. Carrier bumped AS v2.1 → AS v2.2 per spec cross-framework calibration. Custody table refreshed with owner + layer + consumers per substrate SG3 and cross-framework rows for AS v2.2 + Plan v2.2. Provenance field populated reference-default per A-20. IA1–IA7c axiom condition text preserved verbatim from v2.2 per no-text-drift constraint; attachment columns refreshed to seven-axis shell. Hidden-sibling MA-G13 self-check applied §1.4; no hoist. | L0 (pending cycle-3 confirmation) |

---

## §6 Coupling

### §6.1 Carrier

M-I carrier = `named` → `artifact-standard` v2.2.

**Reasoning:** M-I produces `RunReportContent` which must ride inside an AS emission to reach Living Memory via AS's ArA2 anchor + ArA4a–d edges. M-I does not emit its own anchors or edges. M-I constructs `CreateArtifactInput` at S3 with `payload.content = RunReportContent` and invokes AS v2.2's `createArtifact` per HR-MI3 send path. Per substrate §9 Carrier enum: `named` applies when the producing framework's output rides inside a different named framework's W-ATOM (AS's `ArtifactEmission` here).

**Bump from v2.2 (AS v2.1 → AS v2.2):** M-I v2.2 pinned carrier to AS v2.1. AS v2.2 (cycle-1 output this L3 regen wave) is the current valid AS. M-I v2.3 updates the carrier pin to AS v2.2. Since M-I does not touch AS internals (only calls `createArtifact` per HR-MI3), the bump is a custody pin refresh — no semantic change to M-I's emission mechanics.

### §6.2 Handoff rules

Four M-I-local HR instances per substrate §8.2 P6 amended shape:

```
MIHandoffRuleInstance = {
  id:                     'HR-MI1' | 'HR-MI2' | 'HR-MI3' | 'HR-MI4'
  direction:              { from: FrameworkRef; to: FrameworkRef }
  carrierApplicability:   Array<'self' | 'named' | 'none'>
  diagnosticSignificance: boolean
  captureShape?:          CaptureShape   // required iff diagnosticSignificance === true
  invariant:              string
}
```

**Four HRs:**

| ID | Direction | Carrier applicability | Diagnostic significance | Invariant |
|---|---|---|---|---|
| **HR-MI1** | authoring-program (Builder/Research/Verify/etc.) → M-I | `['self', 'named', 'none']` | true | Authoring program invokes M-I's `executeRun(MIInput)` entry point. `MIInput` conforms to §2.1 shape: `planAnchorNodeId` resolves to a Plan Standard v2.2 emission anchor via F-memory R3; `userId` is an F-identity session; `runTurnId` is the caller's turn identifier (distinct from Plan's turnId). Adapter handle is NOT transmitted at this boundary — it is LIV-Standard R4 runtime concern. |
| **HR-MI2** | Plan Standard v2.2 → M-I (read-path) | `['self', 'named']` | true | M-I reads `PlanArtifactContent` via F-memory R3 one-hop from `MIInput.planAnchorNodeId`. Plan Standard validity (PA1–PA12) is trusted per Plan's emission discipline (enforced at Plan emission time, not re-validated by M-I). M-I consumes `PlanArtifactContent` verbatim; IA2 prohibits mutation of `decl.role`, `decl.inputContract`, `decl.outputContract`, `decl.dataFlow`, `decl.dependsOn`. |
| **HR-MI3** | M-I → Artifact Standard v2.2 (emission-path) | `['named']` | true | At S3, M-I invokes AS v2.2 `createArtifact(CreateArtifactInput)` with `framework.id = 'multi-instance'`, `framework.version = '2.3'`, `payload.domain = 'multi-instance'`, `payload.domainVersion = '2.3'`, `payload.schemaRef = 'RunReportContent'`, `payload.content = RunReportContent`, `dependsOn = [MIInput.planAnchorNodeId]`. AS emits anchor + companion + content nodes per ArA2 + ArA3; edges per ArA4a–d (classification-lineage, categorical, version-if-prior, dependency = planAnchor). AS's ArA7 verbatim-carry guarantees `RunReportContent` is not mutated at the carrier boundary. |
| **HR-MI4** | Living Memory → M-I (read-path via AS anchor) | `['self', 'named']` | false | M-I performs F-memory R3 one-hop read at `planAnchorNodeId` to resolve companion node holding `PlanArtifactContent`. Read-only; M-I does not mutate Living Memory. Diagnostic significance false because this handoff is a pure read-indirection with no state change captured. |

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

For each HR with `diagnosticSignificance: true`, `captureShape` declared:

**HR-MI1 — authoring-program → M-I invocation:**

```
captureShape = {
  capturedFields: ['callerProgramId', 'callerProgramVersion', 'planAnchorNodeId', 'userId', 'runTurnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path by runTurnId'
}
```

**HR-MI2 — Plan → M-I consumption:**

```
captureShape = {
  capturedFields: ['planAnchorNodeId', 'planId', 'planVersion', 'bindingDomainId', 'bindingDomainVersion', 'resolutionTimestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path by planAnchorNodeId'
}
```

**HR-MI3 — M-I → AS emission:**

```
captureShape = {
  capturedFields: ['runId', 'planAnchorNodeId', 'emissionTimestamp', 'artifactAnchorNodeId', 'emissionResult', 'frameworkRef'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance + framework-audit §8.3 by runId'
}
```

HR-MI4 has `diagnosticSignificance: false` — no captureShape required per substrate §8.2 amended P6.

### §6.4 Handoff axioms satisfaction

Per metaframework-v3-1 §3.2 Coupling-axis axioms MA-C1..MA-C6:

- **MA-C1** (carrier declared) — §6.1 declares `named` → AS v2.2.
- **MA-C2** (custody complete) — §6.5 enumerates every atom with owner + layer + consumer list.
- **MA-C3** (handoff-invariant symmetry) — HR-MI2 receive-side matches Plan Standard v2.2's upstream-consumer handoff (Plan §7 consumer row "Multi-Instance Standard" by construction); HR-MI3 send-side matches AS v2.2's HR-Ar2 (caller → AS) receive contract by construction.
- **MA-C4** (provenance populated) — §6.6 declares.
- **MA-C5** (provenance contract) — §6.6 declares reference-default per A-20.
- **MA-C6** (carrier-applicability enforced) — HR-MI3 applicability `['named']` matches M-I's own carrier=`named` by construction. HR-MI1/HR-MI4 applicability `['self', 'named']` or `['self', 'named', 'none']` per role; no carrier-mode violation.

### §6.5 Custody table

Per substrate SG3 custody-table completeness. Columns: atom, owner, layer, consumers.

```
MICustodyRow = {
  atom:      string      // atom or type identifier
  owner:     string      // framework or substrate identifier
  layer:     'L1' | 'L2' | 'L3' | 'core/R5'
  consumers: string[]    // framework identifiers that consume this atom
}
```

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `Mode` | substrate-v1-1 | L1 | metaframework, generation-procedure, all L3 frameworks incl. M-I |
| `Kind` | substrate-v1-1 §4 A-10 | L1 | all frameworks at §1 Identity |
| `Ownership` | substrate-v1-1 §4 A-11 | L1 | all L2/L3 frameworks at §1 Identity |
| `AuthorityLevel` | substrate-v1-1 §5 | L1 | all frameworks |
| `AuthorityClaim` | substrate-v1-1 §5 | L1 | all frameworks, registry |
| `Semver` (substrate declaration) | substrate-v1-1 §7 | L1 | all frameworks, registry — M-I consumes the typed form from primitives.ts |
| `Stage` | substrate-v1-1 §8.3 | L1 | generative-mode frameworks (P8 consumers) incl. AS, M-I |
| `StageContentKind` | substrate-v1-1 §8.3 | L1 | generative-mode frameworks |
| `CaptureShape` | substrate-v1-1 §8.2 | L1 | all frameworks declaring HRs with diagnosticSignificance |
| `LifecycleState` | substrate-v1-1 §9 | L1 | all frameworks |
| `Carrier` | substrate-v1-1 §9 | L1 | all frameworks declaring HRs |
| `GenesisDeclaration` | substrate-v1-1 §4 A-14 | L1 | all L2/L3 frameworks at §1 Identity |
| `OperatorInterface` | substrate-v1-1 §4 A-13 | L1 | consumers per V5 verification |
| `FrameworkRef` | substrate-v1-1 §4 | L1 | all frameworks |
| `WAtom` | substrate-v1-1 §4 | L1 | all frameworks |
| `AxiomRef` | substrate-v1-1 §4 | L1 | all frameworks |
| `NodeId` | primitives.ts | core/R5 | Living Memory, AS v2.2, Plan v2.2, M-I v2.3 |
| `UserId` | primitives.ts | core/R5 | F-identity, AS v2.2, Plan v2.2, M-I v2.3 |
| `Semver` (typed form) | primitives.ts | core/R5 | AS v2.2, Plan v2.2, M-I v2.3, framework version pins |
| `Result<T, E>` | primitives.ts | core/R5 | all fallible-operation return channels incl. M-I `MIEmissionResult` |
| `AppError` | primitives.ts | core/R5 | all error subtypes incl. M-I `MIValidityError` |
| `MetaframeworkInput` | metaframework-v3-1 | L2 | generation-procedure (consumed at regen time; not at M-I runtime) |
| `GeneratedFrameworkTemplate` | metaframework-v3-1 | L2 | generated L3 frameworks incl. M-I v2.3 (this file is an instance) |
| `MetaframeworkGateIdSet` | metaframework-v3-1 | L2 | framework-audit, generation-procedure, M-I v2.3 (S2 gates field) |
| `ArtifactEmission` | artifact-standard-v2-2 | L3 | M-I v2.3 (HR-MI3 return) |
| `ArtifactPayload` | artifact-standard-v2-2 | L3 | M-I v2.3 (S3 constructs at boundary) |
| `CreateArtifactInput` | artifact-standard-v2-2 | L3 | M-I v2.3 (S3 constructs at boundary) |
| `ArtifactEdgeKind` | artifact-standard-v2-2 | L3 | M-I v2.3 (reference-only; no M-I-side edge construction) |
| `PlanArtifactContent` | plan-standard-v2-2 | L3 | M-I v2.3 (HR-MI2 resolution) |
| `Declaration` | plan-standard-v2-2 | L3 | M-I v2.3 (per-declaration dispatch at S2) |
| `DeclId` | plan-standard-v2-2 | L3 | M-I v2.3 (`InstanceResult.declId`, `Aggregation` keying) |
| `DomainBinding` | plan-standard-v2-2 | L3 | M-I v2.3 (renderContract + validateContract dispatch at S2) |
| `RenderContractDescriptor` | plan-standard-v2-2 | L3 | M-I v2.3 (IA6) |
| `ValidateContractDescriptor` | plan-standard-v2-2 | L3 | M-I v2.3 (IA3) |
| `RoleClassId` | plan-standard-v2-2 | L3 | M-I v2.3 (reference via `PlanArtifactContent.intent[].role`) |
| `TierClass` | plan-standard-v2-2 | L3 | M-I v2.3 (reference via `PlanArtifactContent.intent[].tierHint`) |
| `TypedAtomRef` | plan-standard-v2-2 | L3 | M-I v2.3 (`TypedAtom.typeRef` typing) |
| `PlanTopology` | plan-standard-v2-2 | L3 | M-I v2.3 (`Aggregation.topology` enum reference) |
| `PlanId` | plan-standard-v2-2 | L3 | M-I v2.3 (`RunReportContent.planId`) |
| `EpochMs` | plan-standard-v2-2 | L3 | M-I v2.3 (`RunReportContent.startedAt/completedAt`) |
| `Milliseconds` | plan-standard-v2-2 | L3 | M-I v2.3 (IA4 time-limit predicate) |
| `DataFlowEdge` | plan-standard-v2-2 | L3 | M-I v2.3 (reference via `Declaration.dataFlow`) |
| `MIInput` | multi-instance-standard-v2-3 (this framework) | L3 | authoring programs (caller) |
| `RunReportContent` | multi-instance-standard-v2-3 | L3 | AS v2.2 (as ArtifactPayload.content), Verify (downstream), dashboard |
| `InstanceResult` | multi-instance-standard-v2-3 | L3 | M-I only (internal composition), Verify (via RunReportContent) |
| `InstanceError` | multi-instance-standard-v2-3 | L3 | M-I only, Verify |
| `SetViolation` | multi-instance-standard-v2-3 | L3 | M-I only, Verify |
| `Aggregation` | multi-instance-standard-v2-3 | L3 | M-I only, Verify |
| `PartialSuccessRecord` | multi-instance-standard-v2-3 | L3 | M-I only, Verify |
| `TypedAtom` | multi-instance-standard-v2-3 | L3 | M-I only, Verify |
| `InstanceTerminalState` | multi-instance-standard-v2-3 | L3 | M-I, consumers of `RunReportContent` |
| `SetTerminalState` / `RunOutcome` | multi-instance-standard-v2-3 | L3 | M-I, consumers of `RunReportContent` |
| `ErrorClass` | multi-instance-standard-v2-3 | L3 | M-I, Verify |
| `ErrorResolution` | multi-instance-standard-v2-3 | L3 | M-I |
| `MIGateResult` | multi-instance-standard-v2-3 | L3 | M-I, framework-audit |
| `MIDimensionResult` | multi-instance-standard-v2-3 | L3 | framework-audit |
| `MICustodyRow` | multi-instance-standard-v2-3 | L3 | framework-audit |
| `MIHandoffRuleInstance` | multi-instance-standard-v2-3 | L3 | framework-audit X3 (captureShape check) |
| `MIValidityError` | multi-instance-standard-v2-3 | L3 | M-I (return channel) |
| `MIEmissionResult` | multi-instance-standard-v2-3 | L3 | M-I (return channel), caller programs |

### §6.6 Provenance contract

Per MA-C5 + A-20 reference-default declaration: every `RunReportContent` emission populates the provenance chain via two paths:
- Intra-M-I: per-field provenance captured at §2.2 (three-source classification: verbatim / runtime / adjacent-framework-sourced).
- Cross-framework: AS v2.2 emission attaches `ArtifactEmission.writes.a4.classificationNodeId + primitive + confidence` from Cognitive Standard R3 encode at S3; `ArtifactEmission.edges` includes dependency edge to `planAnchorNodeId` per ArA4d (AS side) from `dependsOn = [planAnchorNodeId]` (M-I side).

Reference-default applies to the generation-time provenance (`sourceInputRef` in this file's header) per A-20; by-value retention opt-in via declared flag.

### §6.7 Carrier-applicability enforcement

Per v3-1-spec §3.5 + substrate §9 (A-13) + metaframework §6.7:

| HR | Applicability | Check against M-I's carrier (`named`) |
|---|---|---|
| HR-MI1 | `['self', 'named', 'none']` | `'named'` ∈ set ✓ — applies |
| HR-MI2 | `['self', 'named']` | `'named'` ∈ set ✓ — applies |
| HR-MI3 | `['named']` | `'named'` ∈ set ✓ — applies (tightened applicability per spec — HR-MI3 is carrier-path-specific) |
| HR-MI4 | `['self', 'named']` | `'named'` ∈ set ✓ — applies |

All four HRs apply at M-I's declared carrier. MA-C6 satisfied.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

Operator-facing surface of M-I exposes: invocation entry (via HR-MI1 `executeRun(MIInput)` call), output retrieval (via registry lookup post-HR-MI3 AS emission, by `runId` or `artifactAnchorNodeId`), audit query (via HR3 framework-audit path). Runtime implementation deferred post-9g per phase-9d deferral pattern. Declarations only at this delivery.

---

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

Summary of M-I's cross-framework contract edges (full HR definitions §6.2):

| Adjacent | M-I consumes | M-I emits |
|---|---|---|
| authoring program (Builder, Research, Verify) | `MIInput` invocation signal (HR-MI1) | `MIEmissionResult` return (HR-MI1 reply edge) |
| Plan Standard v2.2 | `PlanArtifactContent` via reference at `planAnchorNodeId` (HR-MI2) | — (read-only) |
| Artifact Standard v2.2 | `ArtifactEmission` return (HR-MI3 reply) | `CreateArtifactInput` with `payload.content = RunReportContent`, `dependsOn = [planAnchorNodeId]` (HR-MI3 send) |
| Living Memory | companion data node read at `planAnchorNodeId` (HR-MI4) | — (read-only; write path is via AS ArA2+ArA3+ArA4) |

### §6.10 Cross-framework atom flow

| Atom | Owner | Crosses via | Direction |
|---|---|---|---|
| `MIInput` | M-I (§2.1) | HR-MI1 | authoring program → M-I |
| `PlanArtifactContent` | Plan v2.2 §2.2 | HR-MI2 + HR-MI4 | Plan → M-I (by reference through Living Memory companion node resolution) |
| `DomainBinding` | Plan v2.2 §2.2 | HR-MI2 | Plan → M-I (verbatim via `PlanArtifactContent.binding`, frozen per PA9) |
| `CreateArtifactInput` | AS v2.2 §2.1 | HR-MI3 | M-I → AS v2.2 |
| `RunReportContent` | M-I (§2.2) | HR-MI3 (rides inside `CreateArtifactInput.payload.content`) | M-I → AS v2.2 → Living Memory (via ArA2/ArA3) |
| `ArtifactEmission` | AS v2.2 §2.2 | HR-MI3 reply | AS v2.2 → M-I |
| `MIEmissionResult` | M-I (§2.1) | HR-MI1 reply | M-I → authoring program |

### §6.11 Carrier relation (H5) and boundary notes

M-I carrier = `named` → AS v2.2. M-I declares content-only (`RunReportContent`). M-I does not emit carrier mechanics: no anchor construction, no companion construction, no edge construction from M-I's own code. Those are AS v2.2's concern per ArA1..ArA8 at AS's S1–S3.

**Immutability enforcement (analogous to Plan PA5/PA9 mechanical enforcement):** M-I's `RunReportContent` immutability is mechanically enforced by AS v2.2 **ArA5** at the companion node (which holds `ArtifactPayload.content = RunReportContent` by ArA7 verbatim-carry). Once M-I emits at S3 and AS v2.2 commits, post-emission mutation of the companion-node content is forbidden per ArA5 mutation-rejection predicate. Any state change produces a new emission with a version edge to the prior anchor per ArA4c. M-I does not redundantly declare this invariant — it is AS v2.2's responsibility at the carrier boundary.

**Consumer responsibility note (non-normative, same class as v2.2 §13).** Removing the M-I engine does not leave consumers in a working state by default. Each consumer dispatching against a PlanArtifact independently must implement a singleton fallback path that invokes `DomainBinding.renderContract` + `DomainBinding.validateContract` directly, bypassing the engine. This is a consumer-side responsibility, not an M-I axiom. LIV-Standard A7 (slice deletability) applies to consumer slices, not to M-I — M-I does not guarantee A7 compliance on behalf of its consumers.

---

## §7 Judgment

### §7.1 Declared J-inputs

Zero. Per §3.2 P7 = 0:

```
{
  primitiveKind: P7,
  instanceCount: 0,
  basis: "M-I's executeRun procedure is fully mechanical. Every axiom condition (IA1–IA7c) reduces to substrate §6.3 mechanical-criterion ground: structural property (IA1, IA2, IA4b), deterministic-function result (IA3, IA6, IA7c), cardinality (IA4a, IA5, IA7b), enum membership (IA7a error class). No non-mechanical derivation required at S1, S2, or S3. MA-J4 emptyDeclared satisfied."
}
```

### §7.2 Axis status

Empty per empty-declaration derivation (substrate §8.6). Positive empty-declaration marker §8.1 above. Implicit-absence disallowed; zero-state explicitly declared.

### §7.3 Judgment provenance

MA-J4 provenance-completeness satisfied by positive empty-declaration: zero judgment consumptions at runtime, zero provenance records required. Empty-declaration marker itself satisfies the audit requirement per MA-J4 + substrate §8.6.

---

## §8 Self-audit results

### §8.1 Gate results

All 62 per-invocation gates: state = `not-yet-run`. First-run pending framework-audit + runtime S2 execution. Per §4.1 composition (52 inherited framework-tier + 10 M-I-own axiom gates).

### §8.2 Dimension audit results

All 10 framework-audit dimensions (X1–X10) against M-I: state = `pending-first-run`. Uniform state; compact summary per sprint-mode Q4. Dimension ID enumeration: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-3 §3.3.

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application) at metaframework-v3-1 §4.3: framework-audit runs X1–X10 against M-I v2.3 post-9g. At cycle-3 delivery, self-audit is a declared-placeholder state. No gate has executed; no dimension has evaluated independently. Author-side self-checks applied at §3.6 (AxR1–AxR4), §3.7 (PR4 monotonicity + PR5 kind alignment + PG6 kind-specific field), §4.2 (MA-V1..MA-V5), §6.4 (MA-C1..MA-C6), §1.4 (MA-G13 self-referential + hidden-sibling test) — these are pre-verifications, not framework-audit first-run execution. First framework-audit first-run post-9g ratifies initial state.

---

## §9 Change log

Per A-18 strict nine-section framework-file shape (substrate-v1-1 §9): top-level Change log. Per-version rows summarize amendment records. §5.9 Version history retains the same data nested under Lifecycle axis as per-version lifecycle transition record; this §9 Change log is the A-18-required top-level change surface.

| From | Change | Source |
|---|---|---|
| v2.2 | Regenerated against metaframework-v3-1 via generation-procedure-v1-0 (L3 regen wave cycle 3 of 4). Seven-axis shell (A1–A7) adopted; v2.2's three-axis shape (Shape, Execution, Bounds) folded as M-I-local P1 axes under A3 Structure. Ten axioms IA1..IA7c preserved verbatim from v2.2 per no-text-drift constraint; attachment columns refreshed to seven-axis shell. Ten M-I-own axiom gates G-MI1..G-MI7c declared 1:1 per G-M1. Three P8 steps (S1–S3) under substrate §8.3 Stages {2, 3, 5} with PR4 + PR5 compliance; Stage 4 positively skipped with basis constant. Four HRs (HR-MI1..HR-MI4) with captureShape per substrate §8.2 amended P6. Carrier bumped AS v2.1 → AS v2.2. Custody table refreshed with AS v2.2 + Plan v2.2 consumed-type rows. Provenance field populated reference-default per A-20. | spec-mi-regen-v3-1 (cycle 3 brief) |
| v2.3 (fix-round-1) | fix-round-1: closes Phase 1 findings Ph1-01 + Ph1-04; file-shape + Relational-cell conformance. §3.8 Shape + Execution Relational cells arrow-notation removed, replaced with named-type + typed-field references mirroring Plan §3.8 pattern; §3.8 footer rewritten per spec. §7 Cross-framework handoff folded into §6 Coupling as §6.9/§6.10/§6.11. §10 Implementation pointers externalized to `multi-instance-standard-v2-3/delivery-report.md` §I per A-18 nine-section strict ruling. §8 Judgment → §7; §9 Self-audit → §8. §9 Change log authored (A-18 required top-level section was absent from v2.3 delivery — authoring is A-18 compliance, not semantic amendment). No axiom, gate, primitive, HR, custody, carrier, Mode, or P8 changes. | spec-l3-fix-round-1 AM-02 + AM-04 + substrate-a18-excerpt.md §4 ruling |

---

**End of multi-instance-standard-v2-3. L0 confirmation at cycle-3 closure required before runtime build.**
