# Plan Standard v2.1

**Level:** L3 · **Kind:** Framework · **Mode:** structural · **Carrier:** Artifact Standard v2.1 · **Authority:** L1 Protocol via L2 metaframework v2.4 · **Confirmed by:** L0

## Change log

| From | Change | Source |
|---|---|---|
| v2.0 | Regenerated against metaframework v2.4 (adds MA-G5c custody, MA-G5d provenance as required axioms). | Metaframework v2.4 binary-audit requirement. |
| v2.0 | §9 output schema — per-field provenance added for every `PlanArtifactContent`, `Declaration`, and `DomainBinding` field. Four source types: runtime-generated, verbatim-from-input, authoring-program-computed, binding-derived. | MA-G5d (output-field provenance). |
| v2.0 | Carrier updated to `Artifact Standard v2.1`. | AS version bump. |
| v1.0 | Regenerated under metaframework v2.1. Full re-derivation through 12-step generation procedure. | Same generator gaps as AS v1.1 likely latent in v1.0. |
| v1.0 | Carrier declared `Artifact Standard v2.0` (was "Carried by Artifact Standard v1.0" prose-only). | metaframework §4.2 Carrier sub-axis; H5 carrier exclusivity. |
| v1.0 | PA2 decomposed → PA2a (reference closure) + PA2b (acyclicity). | E6 axiom atomicity. |
| v1.0 | PA4 decomposed → PA4a (per-decl retry present) + PA4b (per-set failsafes present). | E6 axiom atomicity. |
| v1.0 | PA7 tightened: "no runtime split" clause moved to §7.3 handoff (belongs to M-I boundary, not Plan axiom). | E2 orthogonality. |
| v1.0 | PA10 decomposed → PA10a (parent-replacement on split) + PA10b (splitLineage is provenance-not-dependency). | E6 axiom atomicity. |
| v1.0 | Input W-ATOM declared: `PlanInput`. | E4 schema closure. |
| v1.0 | Custody table explicit; Plan owns DomainBinding shape + Plan-specific types; domain standards own binding instances; M-I owns render/validate semantics. | E2 orthogonality. |
| v1.0 | Universal-variable cells resolved to atomic descriptors. | E5 variable resolution. |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Plan Standard |
| Level | L3 |
| Kind | Framework |
| Mode | structural (known → structured) |
| Primitive | declaration |
| Version | v2.1 |
| Ownership (template) | Human (L0) |
| Ownership (applied) | System under L0 |
| State (template) | declared |
| State (applied) | runtime |
| Carrier | Artifact Standard v2.1 |
| Consumes | authoring program's pre-plan inputs + DomainBinding |
| Produces | PlanArtifactContent (payload inside AS emission) |
| Consumed by | Multi-Instance Standard, observability, replay, audit |
| Adjacent frameworks | Artifact Standard, Multi-Instance Standard, domain standards (LIV-Standard, Research, etc.), Living Memory |

## 2. Scope

| In scope | Out of scope |
|---|---|
| PlanArtifactContent payload schema | Execution of plans (Multi-Instance Standard) |
| Declaration structure + dependency topology | Emission mechanics (Artifact Standard) |
| DomainBinding shape (type scaffold) | DomainBinding instance content (domain standard's concern) |
| Emission-time axiomatic constraints (PA1–PA12) | Runtime constraints (M-I's concern) |
| Re-planning immutability guarantee | Re-planning orchestration (authoring program's concern) |
| Split-replacement rule (pre-emission) | Runtime splitting (IA7c — forbidden in M-I) |

## 3. Primitive

**Declaration** — an atomic statement describing exactly one instance and its relations to sibling declarations in the same plan. Properties: `id`, `role`, `inputContract`, `outputContract`, `dependsOn`, `dataFlow`, `tierHint`. A plan is a set of declarations; N=1 is the singleton case, not structurally distinct.

## 4. Axes (4)

| Axis | Governs | Atomic question |
|---|---|---|
| **Shape** | Structure of the declaration set | What depends on what? |
| **Intent** | What each declaration asks for | What does each instance produce and consume? |
| **Capacity** | Sizing per declaration vs tier | Does each declaration fit its declared tier's budget? |
| **Limit** | Thresholds for termination | When is enough, enough? |

### 4.1 Shape

| Sub-axis | Leaf |
|---|---|
| Topology | `sequence \| tier \| loop \| singleton` |
| Declaration set | `Declaration[]`, length ≥ 1 |
| Dependency edges | `Declaration.dependsOn: DeclId[]` — pointers to same-plan declarations |
| Data-flow edges | `Declaration.dataFlow: { from: DeclId, wire: TypedAtomRef }[]` — typed carriers |

### 4.2 Intent

| Sub-axis | Leaf |
|---|---|
| Role | `RoleClassId` — resolved against `DomainBinding.roleClasses` |
| Input contract | `TypedAtomRef` — resolved against `DomainBinding.roleClasses[role].inputType` |
| Output contract | `TypedAtomRef` — resolved against `DomainBinding.roleClasses[role].outputType` |
| Tier hint | `TierClass` — domain-declared enum in `DomainBinding.tierLimits` |

### 4.3 Capacity

| Sub-axis | Leaf |
|---|---|
| Estimated cost | `number` per declaration; unit domain-defined |
| Tier limit | `DomainBinding.tierLimits[tierHint]: CapacityBudget` |
| Split rule | if `estimatedCost > tierLimit`, decompose via `DomainBinding.splitAxis` **before emission** |
| Split lineage | `splitLineage: { parentDeclId: DeclId, splitAxis: string }` — provenance only |

### 4.4 Limit

| Sub-axis | Leaf |
|---|---|
| Per-declaration retry | `retryBudget: number` per `declId` |
| Per-set failsafes (general) | `maxTime: ms`, `maxTransitions: number`, `maxReentries: number` |
| Per-set failsafes (domain) | `DomainBinding.domainFailsafes: { [key: string]: FailsafeRule }` |
| Partial-success policy | `{ allowed: boolean, minSuccesses?: number }` per-set |

## 5. Universal variables per axis

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Shape | `PlanArtifactContent.planVersion` (Semver) | topology enum `sequence \| tier \| loop \| singleton` | `declaration → declaration` (via `dependsOn`, `dataFlow`) | `pending \| emitted \| superseded` |
| Intent | `DomainBinding.domainVersion` | role-class enum (from `DomainBinding.roleClasses`) | `input TypedAtomRef → output TypedAtomRef` | `unbound \| bound` |
| Capacity | `DomainBinding.domainVersion` | tier enum (from `DomainBinding.tierLimits`) | `estimatedCost → tierLimit[tierHint]` | `within-budget \| over-budget \| split` |
| Limit | `PlanArtifactContent.planVersion` | limit enum `retry \| maxTime \| maxTransitions \| maxReentries \| domainFailsafe \| partialSuccess` | scope enum `declaration \| set` | `unconsumed \| consumed \| breached` |

## 6. Axioms (PA1–PA12)

One mechanical condition per axiom. E6 atomicity enforced.

| ID | Condition |
|---|---|
| **PA1** | Each declaration describes exactly one instance; no declaration encodes more than one role invocation. |
| **PA2a** | Every `Declaration.dependsOn[*]` references a `DeclId` present in the same plan's `shape.declarations`. |
| **PA2b** | The directed graph formed by `dependsOn` edges has no cycles. |
| **PA3** | Every `Declaration.inputContract` and `Declaration.outputContract` resolves to a `TypedAtomRef` registered in the captured `DomainBinding.roleClasses[role]`. |
| **PA4a** | Every declaration has a `retryBudget` entry in `content.limit.perDecl[declId]`. |
| **PA4b** | Every plan has `maxTime`, `maxTransitions`, `maxReentries` declared in `content.limit.perSet`. |
| **PA5** | Once a PlanArtifactContent is emitted (captured as AS companion data), it is immutable; re-planning produces a new PlanArtifactContent with a new `planId` and new `planVersion`. |
| **PA6** | Removing any single declaration from a plan produces either (i) a valid smaller plan satisfying PA1–PA12 or (ii) a structured emission failure; no silent corruption. |
| **PA7** | Every declaration's `estimatedCost ≤ tierLimits[tierHint]` at emission, or was replaced by split children per PA10a before emission. |
| **PA8** | Every `RoleClassId`, `TypedAtomRef`, `TierClass`, and domain-failsafe key referenced in the plan content resolves within the captured `DomainBinding`. |
| **PA9** | The `DomainBinding` instance captured at emission is immutable alongside the plan content; post-emission reads observe the emission-time binding. |
| **PA10a** | When a declaration is split via `DomainBinding.splitAxis` before emission, the parent declaration is absent from `shape.declarations` and its children are present. |
| **PA10b** | `splitLineage.parentDeclId` is a provenance reference; the referenced `parentDeclId` is never an element of `shape.declarations` in the emitted plan. |
| **PA11** | Every `Declaration.dataFlow[*].from` references a `DeclId` present in the same plan's `shape.declarations`. (Data-flow analog of PA2a, separated because data-flow edges and dependency edges are distinct relations.) |
| **PA12** | Every `Declaration.dataFlow[*].wire` resolves to a `TypedAtomRef` matching the source declaration's `outputContract` and the target declaration's `inputContract`. |

**Note:** PA11 and PA12 were implicit in v1.0 PA3 prose. Separated here per E6 atomicity — reference closure and wire typing are independent conditions.

## 7. Cross-framework handoff

### 7.1 Custody table

| Atom | Owner | Consumers |
|---|---|---|
| `DeclId`, `TypedAtomRef` | Plan Standard (this framework) | Plan, M-I, domain standards |
| `DomainBinding` (shape) | Plan Standard | domain standards (fill instance); M-I (reads) |
| `RoleClassId`, `TierClass`, `CapacityBudget`, `FailsafeRule`, `SplitAxisDescriptor` | Plan Standard (shape) | domain standards (declare values), M-I (reads) |
| `RenderContractDescriptor`, `ValidateContractDescriptor` | Plan Standard (slot shape); M-I (runtime semantics — IA6) | M-I invokes; Plan holds pass-through |
| `DomainBinding` (instance values) | domain standard (per-domain: LIV-Standard, Research, etc.) | Plan captures at emission; M-I consumes |
| `PlanArtifactContent` | Plan Standard | M-I (reads as input), AS (carries as payload) |
| `NodeId`, `Semver`, `UserId` | Living Memory / LIV-Standard / F-identity (core R5) | Plan |
| `ArtifactEmission`, `ArtifactPayload` | Artifact Standard v2.1 | Plan (output rides inside) |
| `CognitivePrimitive` | Cognitive Standard (canonical at core R5) | Plan (referenced indirectly via AS input) |

### 7.2 Handoff contracts

| Adjacent | Plan consumes | Plan emits |
|---|---|---|
| authoring program (Builder, Research, etc.) | pre-plan inputs (user intent, DomainBinding instance, turn context) | `PlanArtifactContent` via AS emission |
| domain standard (LIV-Standard, Research, etc.) | `DomainBinding` instance values (role classes, tier limits, split-axis, failsafes, render/validate descriptors) | — |
| Artifact Standard v2.1 | — | `PlanArtifactContent` as `ArtifactPayload.content`; `framework.id = 'plan'` |
| Multi-Instance Standard | — | consumed by M-I via `planAnchorNodeId` after AS emission lands in graph |
| Living Memory | — | PlanArtifact anchor + companion land in graph via AS's `traverse()` calls |

### 7.3 Carrier relation (H5) and boundary notes

Plan `carrier = Artifact Standard v2.1`. Plan declares **content only** (`PlanArtifactContent`). Plan does **not** emit carrier mechanics. Emission call pattern: authoring program invokes `createArtifact({ framework: {id:'plan', version:'2.1'}, payload: {domain:'plan', content: PlanArtifactContent}, ... })` and receives `ArtifactEmission`.

**Runtime-split prohibition** (v1.0 PA7 second clause): M-I does not split declarations at runtime (M-I IA7c). This is an M-I axiom, not a Plan axiom; removed from Plan's PA7 in v2.0. Boundary: Plan guarantees split-at-emission (PA7 + PA10a); M-I guarantees no-split-at-runtime (IA7c). Together, splits never occur outside Plan's pre-emission phase.

## 8. Input schema — PlanInput

W-ATOM consumed by Plan's emission entry point at R3:

```
PlanInput {
  authoringProgram: {
    programId:      string                   // provenance: caller R0
    programVersion: Semver                   // provenance: caller R0
  }
  userId:           UserId                   // provenance: F-identity session
  turnId:           string                   // provenance: caller turn context
  domainBinding:    DomainBinding            // provenance: domain standard (by-value instance)
  preplanInputs:    unknown                  // provenance: authoring program; typed per domain
}
```

**Provenance rule (E4):** every field traces to a named owning framework or external source.

## 9. Output schema — PlanArtifactContent (payload inside AS emission)

```
PlanArtifactContent {
  planId:         string                           // provenance: runtime-generated at emission (pins to AS anchor node identity)
  planVersion:    Semver                           // provenance: authoring program (new semver per re-plan per PA5)
  producedBy:     {                                // provenance: input.authoringProgram (verbatim)
    programId:      string
    programVersion: Semver
  }
  producedAt:     epochMs                          // provenance: runtime-captured at emission

  binding:        DomainBinding                    // provenance: input.domainBinding (verbatim, frozen per PA9)

  shape: {                                         // provenance: authoring-program-computed from input.preplanInputs
    topology:     'sequence' | 'tier' | 'loop' | 'singleton'
    declarations: Declaration[]                    // length ≥ 1
  }

  intent: {                                        // provenance: authoring-program-computed, resolved against binding.roleClasses (PA3, PA8)
    [declId: DeclId]: {
      role:           RoleClassId                  // provenance: authoring; keys of binding.roleClasses
      inputContract:  TypedAtomRef                 // provenance: binding.roleClasses[role].inputType (derived)
      outputContract: TypedAtomRef                 // provenance: binding.roleClasses[role].outputType (derived)
      tierHint:       TierClass                    // provenance: authoring; keys of binding.tierLimits
    }
  }

  capacity: {                                      // provenance: authoring-program-computed + binding.splitAxis for splits
    [declId: DeclId]: {
      estimatedCost: number                        // provenance: authoring (domain-defined unit)
      splitLineage?: {                             // provenance: binding.splitAxis invocation (PA10b)
        parentDeclId: DeclId                       // NOT present in shape.declarations
        splitAxis:    string                       // provenance: binding.splitAxis identifier
      }
    }
  }

  limit: {
    perDecl: {
      [declId: DeclId]: { retryBudget: number }    // provenance: authoring-program-computed (PA4a)
    }
    perSet: {                                       // provenance: input-sourced + binding-sourced (PA4b)
      maxTime:          ms                         // provenance: authoring
      maxTransitions:   number                     // provenance: authoring
      maxReentries:     number                     // provenance: authoring
      partialSuccess:   { allowed: boolean; minSuccesses?: number }   // provenance: authoring
      domainFailsafes?: { [key: string]: FailsafeRule }               // provenance: binding.domainFailsafes (verbatim)
    }
  }
}

Declaration {                                      // provenance: authoring-program-computed
  id:        DeclId                                // provenance: authoring (unique within plan)
  dependsOn: DeclId[]                              // provenance: authoring; satisfies PA2a, PA2b
  dataFlow:  Array<{ from: DeclId, wire: TypedAtomRef }>   // provenance: authoring; satisfies PA11, PA12
}

DomainBinding {                                    // provenance: domain standard (by-value instance from input.domainBinding)
  domainId:          string                        // provenance: domain standard
  domainVersion:     Semver                        // provenance: domain standard
  roleClasses:       { [id: RoleClassId]: {
                         inputType:  TypedAtomSchema
                         outputType: TypedAtomSchema
                         tierHint:   TierClass
                     } }                           // provenance: domain standard
  tierLimits:        { [tier: TierClass]: CapacityBudget }       // provenance: domain standard
  splitAxis:         SplitAxisDescriptor           // provenance: domain standard
  domainFailsafes:   { [key: string]: FailsafeRule }             // provenance: domain standard
  renderContract:    RenderContractDescriptor     // provenance: domain standard (M-I slot, pass-through)
  validateContract:  ValidateContractDescriptor   // provenance: domain standard (M-I slot, pass-through)
}
```

**Provenance summary — four distinct source types across output fields:**
1. **Runtime-generated** — `planId`, `producedAt`
2. **Verbatim from input** — `producedBy`, `binding` (and all DomainBinding sub-fields trace to domain standard)
3. **Authoring-program-computed** (derived from `input.preplanInputs` + `input.domainBinding`) — `planVersion`, `shape`, `intent.*.role`, `capacity.*.estimatedCost`, `limit.*`, `Declaration` (except derived fields)
4. **Binding-derived** — `intent.*.inputContract`, `intent.*.outputContract`, `capacity.*.splitLineage`, `limit.perSet.domainFailsafes`

No output field has ambiguous or undeclared source.

### 9.1 Carrier envelope (AS provides; Plan consumes)

Per Artifact Standard v2.1:
- Anchor node: `framework.id = 'plan'`, `framework.version = '2.1'`
- Companion data node: holds `PlanArtifactContent` verbatim
- Content nodes: ≥ 1, traversed from `shape.declarations` and `intent` entries
- Edges: classification-lineage + categorical always; version edge iff prior plan exists for same `(framework.id, userId)`

## 10. Validity

A PlanArtifactContent is valid iff PA1–PA12 all hold at emission. Validity is checked at emission time by the authoring program. An invalid plan is not emitted; emission is rejected with a structured error naming the failed axiom. AS emission proceeds only on Plan validity.

## 11. Validity tests (metaframework v2.4 gates)

| Gate | Pass/fail | Evidence |
|---|---|---|
| E1 Completeness | pass | Leaves in §4.1–§4.4 captureable in one function signature each. |
| E2 Orthogonality | pass | §7.1 declares every cross-standard atom; Plan owns DomainBinding *shape* + Plan-specific types; domain standards own instance values; M-I owns render/validate semantics; runtime-split is M-I concern. |
| E3 Terminology | pass | "declaration" / "plan" / "DomainBinding" consistent; axis-level vs implementation-level distinctions preserved. |
| E4 Schema closure | pass | §8 input declared (with provenance); §9 output declared (with per-field provenance — MA-G5d); §7.1 custody declared (MA-G5c); §7.2 handoff declared; §1 carrier declared. |
| E5 Variable resolution | pass | §5 cells are W-ATOM references or enum values. |
| E6 Axiom atomicity | pass | §6 PA1–PA12 single-condition each. PA2→a+b; PA4→a+b; PA10→a+b; PA7 tightened; PA11, PA12 separated from PA3. |
| E7 Dry-run (author) | pass (§12) | Walkthrough below. |
| E8 Dry-run (L0) | pending | Awaiting L0. |

## 12. Author dry-run (E7)

Dummy input:
```
PlanInput {
  authoringProgram: { programId: 'f-planner', programVersion: '1.0.0' },
  userId:           'user_demo',
  turnId:           'msg_abc123',
  domainBinding:    {
    domainId: 'liv-standard', domainVersion: '1.5.1',
    roleClasses: { 'IN-MAIN': {...}, 'IN-QA': {...} },
    tierLimits:  { 'largest': {...}, 'medium': {...}, 'smallest': {...} },
    splitAxis:   {...},
    domainFailsafes: {...},
    renderContract: {...}, validateContract: {...}
  },
  preplanInputs: { user_request: '...', files: [...] }
}
```

Authoring program produces 3 declarations, tier topology, dataFlow from decl_1 → decl_2, no splits needed.

Walk axiom-by-axiom:

| Axiom | Field / behavior | Provenance | Outcome |
|---|---|---|---|
| PA1 | each decl describes one instance | self | 3/3 pass |
| PA2a | every `dependsOn` points to same-plan `DeclId` | self + authoring | pass |
| PA2b | no cycles in `dependsOn` | self | pass |
| PA3 | input/output contracts resolve against `binding.roleClasses[role]` | Plan + domain binding | pass |
| PA4a | every decl has `retryBudget` in `limit.perDecl` | self | pass |
| PA4b | plan has `maxTime`, `maxTransitions`, `maxReentries` | self | pass |
| PA5 | content frozen after emission (immutability) | self | pass (no mutation path in R3) |
| PA6 | hypothetical decl removal → valid smaller plan or structured failure | self | pass (test: removing decl_2 leaves valid 2-decl plan) |
| PA7 | `estimatedCost ≤ tierLimit[tierHint]` for every decl | self + binding | pass (no split needed) |
| PA8 | all referenced role classes / contracts / tier / failsafes resolve in binding | self + binding | pass |
| PA9 | binding captured verbatim at emission | self | pass |
| PA10a | no splits this run → rule not exercised | self | N/A |
| PA10b | no `splitLineage` entries → trivially pass | self | N/A |
| PA11 | every `dataFlow.from` points to same-plan `DeclId` | self + authoring | pass |
| PA12 | every `dataFlow.wire` TypedAtomRef matches source output + target input contracts | self + binding | pass |

PlanArtifactContent emitted via AS v2.1 `createArtifact` with:
- `framework = { id: 'plan', version: '2.0' }`
- `payload.content = PlanArtifactContent` (as above)
- `dependsOn = []` (no prior artifacts this plan depends on)

All fields trace. PlanArtifactContent schema matches §9. Dry-run passes.

## 13. Consumer contract

| Consumer | Call pattern |
|---|---|
| Multi-Instance Standard | receives `planAnchorNodeId` (from AS emission); reads `PlanArtifactContent` via F-memory R3 one-hop; resolves all declarations through `content.binding`; never mutates |
| authoring program (Builder, Research) | owns re-plan decision; re-plan = new PlanInput → new PlanArtifactContent → new AS emission (PA5) |
| observability, replay, audit | read `(PlanArtifact, RunReport)` pair via graph; joined via AS dependency edge from RunReport anchor → PlanArtifact anchor |
| Verify | consumes PlanArtifact + RunReport pair as input |

## 14. Vocabulary

| Term | Meaning |
|---|---|
| declaration | atomic statement describing one instance; properties: id, role, contracts, dependsOn, dataFlow, tierHint |
| plan | set of declarations emitted as one PlanArtifactContent |
| DomainBinding | Plan-defined type shape; domain standard fills instance values; captured verbatim at emission |
| role class | category of execution role (e.g., IN-MAIN, IN-QA); enum declared in binding |
| tier class | capacity category (e.g., smallest / medium / largest); enum declared in binding |
| split | pre-emission decomposition of one declaration into children per `DomainBinding.splitAxis`; parent is replaced, not retained |
| split lineage | provenance reference from a child declaration to its pre-split parent; not a `dependsOn` edge |
| wire | typed atom carried between declarations on a dataFlow edge |

## 15. Implementation pointers (non-normative)

| Artifact | Path |
|---|---|
| R0 types | `src/core/types/plan-standard.types.ts` |
| R5 constants | `src/core/constants/plan-standard.ts` (PA IDs, topology enum, tier enum) |
| Runtime slice | TBD Phase 6 (F-plan) |
| AS emission types | `src/core/types/artifact-standard.types.ts` |
| M-I consumption types | `src/core/types/multi-instance-standard.types.ts` |

---

**End of Plan Standard v2.1. L0 dry-run (E8) required before runtime build.**
