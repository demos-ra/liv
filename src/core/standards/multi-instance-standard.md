# Multi-Instance Standard v1.0

## Change log

| From | Change | Source |
|---|---|---|
| draft-2 | §2 scope tightened: Multi-Instance consumes a PlanArtifact by graph identity; it reads content from the companion data node per Artifact Standard | Artifact Standard integration |
| draft-2 | §6 domain parameterization reworded: `renderContract` / `validateContract` accessed via `content.binding` inside the companion data node | Carrier/content separation |
| draft-2 | §8 RunReport: pins to PlanArtifact by graph identity (`planAnchorNodeId`) in addition to `planId`; RunReport itself is emitted as an artifact per Artifact Standard | RunReport-as-artifact |
| draft-2 | §9 consumption contract reworded: engine receives anchor node id, reads content, returns RunReport-as-artifact | Consistent with §8 |
| draft-2 | §10 validity extended: RunReport emission validity includes Artifact Standard ArA1–ArA5 | Carrier compliance |
| draft-2 | IA1–IA7 unchanged in substance; wording tightened to reference "declaration in the PlanArtifact content" | Readability |
| draft-3 | §7 IA6 "Engine deletability" removed; renumbered IA7→IA6, IA8→IA7. Deletability concern reframed as consumer-responsibility note — does not satisfy LIV-Standard A7 on behalf of consumers. | Semantic drift correction |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Multi-Instance Standard |
| Level | L3 (Framework) |
| Version | v1.0 |
| Mode | generative (structured → produced) |
| Primitive | instance |
| Consumes | PlanArtifact (per Plan Standard v1.0) located by graph identity |
| Produces | RunReport (carried on an Artifact Standard emission) |
| Consumed by | programs that dispatch 1..N instances (Builder, Plan, Research, etc.) |
| Carried by | Artifact Standard v1.0 (both the consumed input and the produced output are artifact emissions) |

## 2. Scope

Governs the execution of PlanArtifacts: the dispatch of 1..N instances, per-instance invocation, retry and error handling, aggregation of results, and termination under declared bounds. Multi-Instance executes declarations; it does not author them. It does not embed domain logic — domain behavior is supplied by the `DomainBinding` captured inside the PlanArtifact content (PA9).

**Content vs. carrier.** Multi-Instance Standard declares the **execution semantics** and the **RunReport payload schema**. It does **not** govern emission mechanics of the RunReport artifact — those are Artifact Standard's concern (ArA1–ArA5). Multi-Instance reads inputs as artifacts, produces outputs as artifacts, and relies on Artifact Standard to govern the carrier.

## 3. Primitive

**Instance** — one execution of one declared role against its typed input contract, producing a typed output or a terminal failure. Cardinality N derives from the declaration count in the consumed PlanArtifact content. N=1 is the singleton case and is not structurally distinct.

## 4. Axes (3)

| Axis | Governs | Atomic question |
|---|---|---|
| **Shape** | Structure of the execution set at runtime | How do instances relate during dispatch? |
| **Execution** | Inside one instance | What happens in one invocation? |
| **Bounds** | Termination | When does an instance or set stop? |

### 4.1 Shape

| Sub-axis | Content |
|---|---|
| Execution topology | Interpreted from `content.shape.topology`: `sequence → serial`, `tier → parallel-within-tier`, `loop → iterative`, `singleton → single call` |
| Data propagation | Carries outputs along edges declared in `content.shape.declarations[].dataFlow` |
| Aggregation rule | Per-topology, stated below |

**Aggregation rules (definitive):**

| Topology | `finalOutput` | Outcome on partial failure |
|---|---|---|
| `sequence` | Output of the last *completed* instance. If any non-final instance fails, `outcome = failed`; later declarations are not dispatched. | `failed` |
| `tier` | Collection of all tier outputs, keyed by declId. Partial tier failures are governed by the partial-success policy (§4.3). | `complete` \| `partial` \| `failed` |
| `loop` | Output of the terminal iteration (loop exit). | `complete` \| `failed` \| `escalated` |
| `singleton` | Output of the sole instance. | `complete` \| `failed` \| `escalated` |

### 4.2 Execution

| Sub-axis | Content |
|---|---|
| Invocation | Materialize input contract via `content.binding.renderContract` → invoke AI adapter → capture raw output |
| Handoff validation | Output conforms to declared output contract via `content.binding.validateContract`. Invalid output = instance not complete; retry applies. |
| Result capture | Typed output + metadata (tokens, duration, retry count, terminal state) |

### 4.3 Bounds

| Sub-axis | Content |
|---|---|
| Error classification | Two classes: CLASS_2 (output-quality / validation / capacity-breach per IA7) → retry-with-context; CLASS_3 (infrastructure) → infra-retry then escalate |
| Retry policy | Per-declaration budget from `content.limit.perDecl`. Exhaustion is terminal for that instance. |
| Failsafe policy | Per-set limits from `content.limit.perSet` checked pre-transition. Breach is terminal for the set (overrides retry budgets per IA4). |
| Instance terminal states | `complete \| failed \| escalated` |
| Set terminal states | `complete \| failed \| escalated \| partial`. The `partial` state is reachable only if `content.limit.perSet.partialSuccess.allowed === true` **and** `achieved >= minSuccesses` (when `minSuccesses` is declared). Absent explicit policy allowance, `partial` is never emitted — any instance failure propagates to `failed` per topology rules. |

## 5. Universal variables

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Shape | engine version | topology type | edge realization | dispatched / settled |
| Execution | adapter version | role class | input/output atoms | pending / running / complete / failed |
| Bounds | policy version | error class | scope (inst vs set) | within / breached |

## 6. Domain parameterization

Multi-Instance reads domain behavior from `content.binding` (IA6), where `content` is the PlanArtifact payload retrieved from the companion data node of the consumed artifact. Two function slots consumed:

| Slot | Consumed from | Purpose |
|---|---|---|
| `renderContract` | `content.binding.renderContract` | Materializes a declaration's input into the concrete prompt / message payload for the AI adapter |
| `validateContract` | `content.binding.validateContract` | Checks an instance's output against its declared output contract |

No other domain-specific logic lives inside the engine. The engine does not know what a "file", "finding", "bundle", or "probe" is — it only knows declarations, invocations, handoffs, and bounds.

## 7. Axioms (IA1–IA7)

| ID | Rule |
|---|---|
| IA1 | **Conservation of progress.** Every dispatched instance reaches a terminal state (`complete \| failed \| escalated`). No silent drops. |
| IA2 | **Declaration fidelity.** An instance executes exactly the declaration it was given in the PlanArtifact content. The engine does not rewrite intent, decompose, or substitute content. Any decomposition lives upstream in Plan (PA7). |
| IA3 | **Handoff integrity.** An instance's output is validated against its declared output contract (via `content.binding.validateContract`) before propagation. Invalid output does not propagate; it triggers retry within budget or terminal failure. |
| IA4 | **Bounds supremacy.** Set-level failsafes override per-declaration retry budgets. Failsafe breach is terminal for the set and cannot be retried. |
| IA5 | **Topology isolation.** Per-instance failure does not cascade to siblings unless the topology's aggregation rule + partial-success policy declare it. Cascade is Shape-level, not Execution-level. |
| IA6 | **Binding-driven execution.** All domain-specific materialization and validation resolves through `content.binding`. The engine contains no domain-specific code paths. |
| IA7 | **Runtime capacity breach.** When an instance's materialized invocation exceeds runtime capacity (context overflow, token budget breach, domain-declared limit), the engine emits CLASS_2 failure with reason `capacity-breach`. The breach consumes one retry budget unit per `content.limit.perDecl`. Budget exhaustion is terminal for the instance; the producing program may re-plan on receipt of RunReport. The engine does not split, resize, or rewrite the declaration. |

**Consumer responsibility note.** Removing the Multi-Instance engine does not leave consumers in a working state by default: each consumer must implement a singleton fallback path that invokes the AI adapter + render + validate directly, bypassing the engine. Plan Standard emission of a singleton PlanArtifact remains valid input to the engine when present; removing the engine means consumers bypass Plan entirely for N=1. This is a consumer-side responsibility, not a framework guarantee — it does not satisfy LIV-Standard A7 (deletability) on behalf of Multi-Instance consumers.

## 8. Payload schema — RunReport content

RunReport is itself emitted as an artifact per Artifact Standard. This schema is the **payload** carried inside the Artifact Standard emission's `payload.content` field. It is not a free-standing artifact shape.

```
RunReportContent {
  planId:               string                      // PlanArtifact identity, immutable pin
  planAnchorNodeId:     NodeId                      // pins to the PlanArtifact anchor node in graph
  planVersion:          semver
  bindingDomainId:      string                      // replay/audit without full PlanArtifact read
  bindingDomainVersion: semver

  runId:                string
  startedAt:            epochMs
  completedAt:          epochMs

  outcome:              'complete' | 'failed' | 'escalated' | 'partial'

  instanceResults: Array<{
    declId:       DeclId                            // pins to content.shape.declarations[].id
    status:       'complete' | 'failed' | 'escalated'
    output?:      TypedAtom                         // typed per declaration's outputContract; absent on failure
    tokenCount:   number
    durationMs:   number
    retries:      number
    errors:       Array<{
                    class:      2 | 3
                    reason:     string              // e.g., 'capacity-breach' per IA7
                    message:    string
                    resolution: 'retried' | 'escalated' | 'terminal'
                  }>
  }>

  setViolations: Array<{
    failsafe:   'maxTime' | 'maxTransitions' | 'maxReentries' | string
    breachedAt: epochMs
    reason:     string
  }>

  aggregation: {
    topology:     'sequence' | 'tier' | 'loop' | 'singleton'
    finalOutput?: TypedAtom                         // per §4.1 aggregation rule; absent if outcome = failed
    partialSuccess?: {
      required:  number
      achieved:  number
      satisfied: boolean
    }
  }
}
```

### 8.1 Carrier envelope

When the engine completes a run, it emits a RunReport per Artifact Standard §8 `ArtifactEmission`:

- An **artifact anchor node** with category `artifact`, domain `multi-instance`, schema `RunReportContent`.
- A **companion data node** holding `RunReportContent` verbatim as JSON.
- **Content nodes** traversed from `RunReportContent.instanceResults` per ArA3 (allows per-instance output to surface as queryable graph content).
- **Edges** per ArA4 — including a **dependency edge** to the consumed PlanArtifact anchor node (`planAnchorNodeId`), binding RunReport to its source plan in the graph.

This means the `(PlanArtifact, RunReport)` pair is natively joinable via graph traversal — no separate index or pointer table required. Observability and audit queries follow the dependency edge.

## 9. Consumption contract

Multi-Instance accepts exactly one input shape: a reference to a valid PlanArtifact emission by graph identity (anchor node id or `planId`). The engine:

1. Reads the companion data node to obtain `PlanArtifactContent`.
2. Verifies the content passed Plan Standard validity at its own emission (trusts producer; does not re-validate PA axioms).
3. Resolves all declarations against `content.binding`.
4. Executes per IA1–IA7.
5. Emits a RunReport as an artifact per Artifact Standard, with `planAnchorNodeId` set to the input's anchor node.

The engine **never mutates** the consumed PlanArtifact content or its graph representation.

## 10. Validity

A Multi-Instance run is valid iff:
- IA1–IA7 all hold across the run (execution semantics).
- The produced RunReport emission satisfies Artifact Standard ArA1–ArA5 (carrier compliance).

Execution validity is a runtime property; carrier validity is an emission property. Both are required. A run that violates any IA axiom is a defect in engine implementation. A RunReport that violates any ArA axiom is a defect in emission implementation. These are separable failure modes.

## 11. Open questions (Layer 0)

1. **Axiom prefix IA.** Flagged as a future Rule 7 extension. Not blocking.
2. **Handoff Brief v10 / Playbook v2.** Names align. No conflict observed. (Prior draft-2 referenced IA6 deletability matching LIV-Standard A7; that claim withdrawn — see draft-3 change log.)
3. **Backlog J.6.** Superseded by this draft. Confirm J.6 rewrites to reference Multi-Instance Standard v1.0 as execution layer and Artifact Standard v1.0 as carrier.
4. **Phase 4 active-status conflict.** Brief vs. Spec V.Active disagree. Not blocking draft; blocking dispatch.
5. **Registration.** Multi-Instance registers as L3 at runtime. Deploy State III.4 standards table to add row.
6. **R5 constants file.** Implementation artifact: `src/core/constants/multi-instance-standard.ts` for IA1–IA7 IDs, topology enum, error-class enum, terminal-state enum. Matches LIV-Standard's existing `src/core/constants/` convention (R5 per T1.1 layer model).
7. **IN-DIAGNOSE modeling.** Flagged to LIV-Standard DomainBinding design; foreign to this draft's scope.
