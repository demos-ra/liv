# Multi-Instance Standard v2.2

**Level:** L3 · **Kind:** Framework · **Mode:** generative · **Carrier:** Artifact Standard v2.1 · **Authority:** L1 Protocol via L2 metaframework v2.4 · **Confirmed by:** L0

## Change log

| From | Change | Source |
|---|---|---|
| v2.1 | `aiAdapter: AIAdapter` removed from `MIInput`. It was a function-handle misclassification — a runtime dependency, not a signal W-ATOM. Corrected per the metaframework's W-ATOM definition ("typed shape a signal takes when crossing a framework's boundary"). | L0 gap ruling — author execution error; signal vs dependency boundary. |
| v2.1 | §8 adds non-normative note: AI adapter is an LIV-Standard R4 runtime dependency, injected when F-M-I slice is wired; not a spec concern. | Boundary clarity. |
| v2.1 | §5 Execution.Temporal resolved to `adapterVersion: string` (runtime-captured). Removed `AIAdapter` type reference. | E5 atomic descriptor. |
| v2.1 | §7.2 caller-program row: adapter handle removed from M-I's consumption list; replaced with signal W-ATOMs. | Boundary clarity. |
| v2.1 | Author dry-run updated: dummy `MIInput` = `{planAnchorNodeId, userId}`. | §12. |
| v2.0 | Regenerated against metaframework v2.4 (adds MA-G5c custody, MA-G5d provenance as required axioms). | Metaframework v2.4 binary-audit requirement. |
| v2.0 | §9 output schema — per-field provenance added for every `RunReportContent` and `InstanceResult` field. Three source types: verbatim-from-PlanArtifact, runtime-generated, adjacent-framework-sourced. | MA-G5d (output-field provenance). |
| v2.0 | Carrier updated to `Artifact Standard v2.1`. | AS version bump. |
| v1.0 | Regenerated under metaframework v2.1. Full re-derivation through 12-step generation procedure. | Same generator gaps as AS v1.1 likely latent in v1.0. |
| v1.0 | Carrier declared `Artifact Standard v2.0` (was "Carried by Artifact Standard v1.0" prose-only). | metaframework §4.2 Carrier sub-axis; H5 carrier exclusivity. |
| v1.0 | IA4 decomposed → IA4a (override) + IA4b (terminal). | E6 axiom atomicity. |
| v1.0 | IA7 decomposed → IA7a (emit CLASS_2) + IA7b (budget consumption) + IA7c (no engine-side mutation). | E6 axiom atomicity. |
| v1.0 | Input W-ATOM declared: reference to PlanArtifact by `planAnchorNodeId`. | E4 schema closure. |
| v1.0 | Custody table explicit. | E2 orthogonality. |
| v1.0 | Universal-variable cells resolved to atomic descriptors. | E5 variable resolution. |
| v1.0 | Consumer responsibility note (engine deletability, LIV-Standard A7) kept as non-normative — does not introduce a new axiom. | LIV-Standard A7 is already declared elsewhere; re-declaring here violates E2 orthogonality. |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Multi-Instance Standard |
| Level | L3 |
| Kind | Framework |
| Mode | generative (structured → produced) |
| Primitive | instance |
| Version | v2.2 |
| Ownership (template) | Human (L0) |
| Ownership (applied) | System under L0 |
| State (template) | declared |
| State (applied) | runtime |
| Carrier | Artifact Standard v2.1 |
| Consumes | PlanArtifact (per Plan Standard) located by `planAnchorNodeId` |
| Produces | RunReport (payload inside AS emission) |
| Consumed by | programs that dispatch 1..N instances (Builder, Research, Verify, etc.) |
| Adjacent frameworks | Plan Standard, Artifact Standard, Living Memory |

## 2. Scope

| In scope | Out of scope |
|---|---|
| Dispatch semantics for 1..N instances | Plan authoring (Plan Standard) |
| Per-instance invocation + retry + validation | Emission mechanics (Artifact Standard) |
| Aggregation rule per topology | Domain behavior (owned by per-domain framework, resolved via DomainBinding) |
| Termination under declared bounds | Graph physics (Living Memory) |
| RunReport payload schema | Code structure (LIV-Standard) |

## 3. Primitive

**Instance** — one execution of one declaration from a consumed PlanArtifact against its typed input contract, producing a typed output or a terminal failure. Cardinality N derives from declaration count in the PlanArtifact. N=1 is not structurally distinct.

## 4. Axes (3)

| Axis | Governs | Atomic question |
|---|---|---|
| **Shape** | Structure of the execution set at runtime | How do instances relate during dispatch? |
| **Execution** | Inside one instance | What happens in one invocation? |
| **Bounds** | Termination | When does an instance or set stop? |

### 4.1 Shape

| Sub-axis | Leaf |
|---|---|
| Topology | `sequence \| tier \| loop \| singleton` (from `PlanArtifactContent.shape.topology`) |
| Dispatch pattern per topology | sequence → serial; tier → parallel-within-tier; loop → iterative; singleton → single call |
| Data propagation | edges from `PlanArtifactContent.shape.declarations[].dataFlow` |
| Aggregation rule | per topology (table 4.1.a) |

**4.1.a Aggregation table**

| Topology | `finalOutput` | Set outcome on partial failure |
|---|---|---|
| `sequence` | output of last completed instance; if any non-final fails, set = `failed`; later declarations not dispatched | `failed` |
| `tier` | dict keyed by `declId`, value = each tier output | `complete \| partial \| failed` per partial-success policy |
| `loop` | output of terminal iteration (loop exit) | `complete \| failed \| escalated` |
| `singleton` | output of sole instance | `complete \| failed \| escalated` |

### 4.2 Execution

| Sub-axis | Leaf |
|---|---|
| Invocation | materialize input via `content.binding.renderContract(decl, upstreamOutputs)` → invoke AI adapter → capture raw output |
| Handoff validation | `content.binding.validateContract(decl, output)` → boolean. Invalid → retry (IA3) |
| Result capture | `InstanceResult { declId, status, output?, tokenCount, durationMs, retries, errors[] }` |

### 4.3 Bounds

| Sub-axis | Leaf |
|---|---|
| Error class | `CLASS_2` (output-quality / validation / capacity-breach) → retry-with-context; `CLASS_3` (infrastructure) → infra-retry then escalate |
| Retry policy | per-declaration budget from `content.limit.perDecl[declId].retryBudget`. Exhaustion terminal for instance. |
| Failsafe policy | per-set limits from `content.limit.perSet` checked pre-transition. Breach terminal for set (IA4a). |
| Instance terminal states | `complete \| failed \| escalated` |
| Set terminal states | `complete \| failed \| escalated \| partial`. `partial` reachable iff `content.limit.perSet.partialSuccess.allowed === true` AND `achieved >= minSuccesses`. |

## 5. Universal variables per axis

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Shape | `PlanArtifactContent.planVersion` | topology enum `sequence \| tier \| loop \| singleton` | `declaration → declaration` (via dataFlow edges) | `dispatched \| settled` |
| Execution | `adapterVersion: string` (runtime-captured per invocation) | role class from `content.intent[declId].role` (enum resolved at binding) | `input atom → output atom` (typed by `inputContract`/`outputContract`) | `pending \| running \| complete \| failed \| escalated` |
| Bounds | `RunReport.runId` (per run) | error class enum `CLASS_2 \| CLASS_3` | scope enum `instance \| set` | `within \| breached` |

## 6. Axioms (IA1–IA10)

One mechanical condition per axiom. E6 atomicity enforced.

| ID | Condition |
|---|---|
| **IA1** | Every dispatched instance reaches one of `complete \| failed \| escalated`. |
| **IA2** | The engine executes the declaration as given; no engine-side mutation of `decl.role`, `decl.inputContract`, `decl.outputContract`, `decl.dataFlow`, or `decl.dependsOn`. |
| **IA3** | Every instance's output is validated via `content.binding.validateContract` before propagation to downstream declarations; validation failure blocks propagation. |
| **IA4a** | Set-level failsafe breach overrides per-declaration retry budgets: on breach, no further per-declaration retry attempts are dispatched. |
| **IA4b** | Set-level failsafe breach transitions the set to `failed` or `escalated` (non-retryable). |
| **IA5** | Per-instance failure does not cascade to sibling instances unless the active topology's aggregation rule (per 4.1.a) or a declared partial-success policy calls for it. |
| **IA6** | All domain-specific materialization and validation resolves through `content.binding`; the engine contains no domain-specific code paths. |
| **IA7a** | When materialized invocation exceeds runtime capacity (context overflow, token budget, domain-declared limit), the engine emits a CLASS_2 failure with `reason = 'capacity-breach'`. |
| **IA7b** | A capacity-breach failure consumes exactly one retry budget unit from `content.limit.perDecl[declId].retryBudget`. |
| **IA7c** | On capacity breach, the engine does not split, resize, or rewrite the declaration; re-planning is the producer program's responsibility upon RunReport receipt. |

## 7. Cross-framework handoff

### 7.1 Custody table

| Atom | Owner | Consumers |
|---|---|---|
| `PlanArtifactContent` | Plan Standard | M-I (input, by reference) |
| `DeclId`, `TypedAtomRef`, `RoleClassId`, `TierClass`, `DomainBinding` | Plan Standard | M-I (consumes from `content`) |
| `NodeId` | Living Memory | M-I (references `planAnchorNodeId`) |
| `Semver`, `UserId` | LIV-Standard / F-identity | M-I |
| `ArtifactEmission`, `ArtifactPayload` | Artifact Standard | M-I (output rides inside) |
| `RunReportContent` | M-I (this framework) | AS (as payload), Verify (as input), dashboard |
| `InstanceResult` | M-I | M-I only (internal composition) |
| Error-class enum `CLASS_2 \| CLASS_3` | M-I | M-I |
| Terminal-state enums | M-I | M-I; read by consumers from `RunReportContent.outcome` |

### 7.2 Handoff contracts

| Adjacent | M-I consumes | M-I emits |
|---|---|---|
| Plan Standard | `planAnchorNodeId` reference; reads `PlanArtifactContent` via F-memory R3 | — |
| Artifact Standard | — | `RunReportContent` as `ArtifactPayload.content`; `framework.id = 'multi-instance'`; dependency edge to PlanArtifact anchor (via AS ArA4d on `dependsOn = [planAnchorNodeId]`) |
| Living Memory | F-memory R3 read of companion data node at `planAnchorNodeId` | — |
| caller program (Builder, Verify, etc.) | `planAnchorNodeId`, `userId` (signal W-ATOMs) | `RunReport` (AS emission receipt) |

### 7.3 Carrier relation (H5)

M-I `carrier = Artifact Standard v2.1`. M-I declares **content only** (`RunReportContent`). M-I does **not** emit carrier mechanics (no anchor, no companion, no edges from M-I's own code). Those are Artifact Standard's concern. M-I invokes `createArtifact({ framework: {id:'multi-instance', version}, payload: {domain:'multi-instance', content: RunReportContent}, dependsOn: [planAnchorNodeId], ... })` and receives an `ArtifactEmission`.

## 8. Input schema — consumption contract

M-I accepts exactly one input W-ATOM:

```
MIInput {
  planAnchorNodeId: NodeId      // provenance: caller (content framework — Builder, etc.)
  userId:           UserId      // provenance: F-identity session
}
```

**Resolution path:**
1. Read `PlanArtifactContent` via F-memory R3 one-hop from `planAnchorNodeId` → companion data node.
2. Trust Plan Standard validity (PA1–PA12 enforced at Plan emission, not re-validated here).
3. Resolve declarations through `content.binding`.
4. Execute per IA1–IA10.
5. Emit RunReport via AS with `dependsOn = [planAnchorNodeId]`.

**Note on runtime dependencies (non-normative, LIV-Standard concern).** The F-M-I implementation slice requires an AI adapter to invoke declarations. The adapter handle is not a field of `MIInput` — it is a runtime dependency injected at LIV-Standard's R4 layer when the slice is wired. Naming which adapter provider/model to use (if M-I needs that metadata) would be a signal (e.g., `AIAdapterDescriptor = { providerId, modelId }`) — not a function handle. Current M-I does not require this metadata at the boundary; the adapter selection is fully a consuming-program + LIV-Standard concern.

## 9. Output schema — RunReportContent (payload inside AS emission)

```
RunReportContent {
  planId:               string          // provenance: consumed PlanArtifactContent.planId (verbatim)
  planAnchorNodeId:     NodeId          // provenance: input.planAnchorNodeId (verbatim)
  planVersion:          Semver          // provenance: consumed PlanArtifactContent.planVersion (verbatim)
  bindingDomainId:      string          // provenance: consumed PlanArtifactContent.binding.domainId (verbatim)
  bindingDomainVersion: Semver          // provenance: consumed PlanArtifactContent.binding.domainVersion (verbatim)

  runId:                string          // provenance: runtime-generated (UUID v4 per run)
  startedAt:            epochMs         // provenance: runtime-captured at dispatch start
  completedAt:          epochMs         // provenance: runtime-captured at set terminal state

  outcome:              'complete' | 'failed' | 'escalated' | 'partial'
                                        // provenance: runtime-derived per §4.1.a aggregation rule

  instanceResults: InstanceResult[]     // provenance: runtime-accumulated; one entry per dispatched declaration

  setViolations: Array<{                // provenance: runtime-captured on failsafe breach (IA4a/IA4b)
    failsafe:   'maxTime' | 'maxTransitions' | 'maxReentries' | string
    breachedAt: epochMs
    reason:     string
  }>

  aggregation: {                        // provenance: runtime-computed per topology aggregation rule
    topology:        'sequence' | 'tier' | 'loop' | 'singleton'
                                        // provenance: consumed PlanArtifactContent.shape.topology (verbatim)
    finalOutput?:    TypedAtom          // provenance: last terminal instance output per §4.1.a
    partialSuccess?: {                  // provenance: runtime-computed vs content.limit.perSet.partialSuccess
      required:  number
      achieved:  number
      satisfied: boolean
    }
  }
}

InstanceResult {
  declId:     DeclId                    // provenance: consumed PlanArtifactContent.shape.declarations[].id (verbatim)
  status:     'complete' | 'failed' | 'escalated'
                                        // provenance: runtime-derived per instance terminal state (IA1)
  output?:    TypedAtom                 // provenance: AI adapter invocation output, validated by binding.validateContract (IA3)
  tokenCount: number                    // provenance: AI adapter response metadata
  durationMs: number                    // provenance: runtime-measured around adapter invocation
  retries:    number                    // provenance: runtime-accumulated per retry budget consumption
  errors: Array<{                       // provenance: runtime-captured per failure
    class:      2 | 3                   // provenance: runtime-classified per IA7a (capacity) or infrastructure
    reason:     string
    message:    string
    resolution: 'retried' | 'escalated' | 'terminal'
  }>
}
```

**Provenance summary — three distinct source types across output fields:**
1. **Verbatim from consumed PlanArtifactContent** — `planId`, `planAnchorNodeId`, `planVersion`, `bindingDomainId`, `bindingDomainVersion`, `aggregation.topology`, `InstanceResult.declId`
2. **Runtime-generated / runtime-captured** — `runId`, `startedAt`, `completedAt`, `outcome`, `aggregation.finalOutput`, `aggregation.partialSuccess`, `setViolations`, `InstanceResult.{status, durationMs, retries}`, `errors`
3. **Adjacent-framework-sourced** — `InstanceResult.output` (via AI adapter + `binding.validateContract`), `InstanceResult.tokenCount` (AI adapter metadata)

No output field has ambiguous or undeclared source.

### 9.1 Carrier envelope (AS provides, M-I consumes)

Per Artifact Standard v2.1:
- Anchor node: `framework.id = 'multi-instance'`, `framework.version = '2.0'`
- Companion data node: holds `RunReportContent` verbatim
- Content nodes: ≥ 1, traversed from `RunReportContent.instanceResults`
- Edges: classification-lineage + categorical always; dependency to `planAnchorNodeId` (from `dependsOn`); version edge iff prior run exists for same `(framework.id, userId)`

## 10. Validity

A Multi-Instance run is valid iff:
1. IA1–IA10 all hold across execution (execution validity).
2. The emitted RunReport satisfies Artifact Standard ArA1–ArA7 (carrier validity, AS's responsibility).

Execution validity and carrier validity are separable failure modes.

## 11. Validity tests (metaframework v2.4 gates)

| Gate | Pass/fail | Evidence |
|---|---|---|
| E1 Completeness | pass | Leaves in §4.1–§4.3 captureable in one function signature each. |
| E2 Orthogonality | pass | §7.1 declares every cross-standard atom; no re-ownership; LIV-Standard A7 not re-declared. |
| E3 Terminology | pass | "instance", "declaration", "set" consistent across axis + implementation levels. |
| E4 Schema closure | pass | §8 input declared (with provenance); §9 output declared (with per-field provenance — MA-G5d); §7.1 custody declared (MA-G5c); §7.2 handoff declared; §1 carrier declared. |
| E5 Variable resolution | pass | §5 cells are W-ATOM references or enum values. |
| E6 Axiom atomicity | pass | §6 IA1–IA10 single-condition each. IA4 → IA4a+IA4b; IA7 → IA7a+IA7b+IA7c. |
| E7 Dry-run (author) | pass (§12) | Walkthrough below. |
| E8 Dry-run (L0) | pending | Awaiting L0. |

## 12. Author dry-run (E7)

Dummy input:
```
MIInput {
  planAnchorNodeId: 'node_plan_123',
  userId:           'user_demo'
}
```

(AI adapter injected at runtime via LIV-Standard R4 wiring; not a spec input field.)

Plan content retrieved (tier topology, 3 declarations, no partial-success policy).

Walk axiom-by-axiom:

| Axiom | Field / behavior | Provenance | Outcome |
|---|---|---|---|
| IA1 | every instance transitions to terminal state | self | all 3 instances complete |
| IA2 | engine does not mutate decl.role/inputContract/etc. | self | no mutation path in R2/R3 code |
| IA3 | validateContract called per instance output | Plan `content.binding` | passes; output propagates |
| IA4a | no failsafe breach → rule not exercised | self | N/A in this run |
| IA4b | same | self | N/A |
| IA5 | one instance fails mid-tier; non-partial-success policy | self + Plan | per 4.1.a: outcome = `failed` |
| IA6 | all materialization through `content.binding.renderContract` | Plan | passes |
| IA7a | no capacity breach in this run | self | N/A |
| IA7b | same | self | N/A |
| IA7c | same | self | N/A |

RunReport emitted via AS v2.1 `createArtifact` with:
- `framework = { id: 'multi-instance', version: '2.0' }`
- `payload.content = RunReportContent` (as above, outcome=`failed`)
- `dependsOn = ['node_plan_123']` → AS emits dependency edge (ArA4d)

All fields trace. RunReportContent schema matches §9. Dry-run passes.

## 13. Consumer responsibility note (non-normative)

Removing the Multi-Instance engine does not leave consumers in a working state by default. Each consumer must implement a singleton fallback path that invokes the AI adapter + renderContract + validateContract directly, bypassing the engine. This is a consumer-side responsibility, not an M-I axiom. LIV-Standard A7 (slice deletability) applies to consumer slices, not to M-I — M-I does not guarantee A7 compliance on behalf of its consumers.

## 14. Vocabulary

| Term | Meaning |
|---|---|
| instance | one execution of one declaration; produces typed output or terminal failure |
| declaration | atomic statement in a PlanArtifact: `{ id, role, inputContract, outputContract, ... }` |
| set | the group of instances from one PlanArtifact run |
| dispatch | act of starting an instance |
| capacity breach | materialized invocation exceeds runtime limit (context, token, domain-declared) |
| DomainBinding | Plan-authored slot for domain-specific `renderContract` + `validateContract` |
| run | one full invocation of M-I on one PlanArtifact; identified by `runId` |

## 15. Implementation pointers (non-normative)

| Artifact | Path |
|---|---|
| R0 types | `src/core/types/multi-instance-standard.types.ts` |
| R5 constants | `src/core/constants/multi-instance-standard.ts` (IA IDs, topology enum, error classes, terminal states) |
| Runtime slice | TBD Phase 4b (engine slice) |
| Plan content types | `src/core/types/plan-standard.types.ts` |
| AS emission types | `src/core/types/artifact-standard.types.ts` |

---

**End of Multi-Instance Standard v2.2. L0 dry-run (E8) required before runtime build.**
