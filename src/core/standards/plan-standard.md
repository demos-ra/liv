# Plan Standard v1.0

## Change log

| From | Change | Source |
|---|---|---|
| draft-2 | §6 reworked: DomainBinding now travels via Artifact Standard's payload envelope, not as standalone top-level field | Artifact Standard §6.3 |
| draft-2 | §8 reworked: **PlanArtifact content is the payload carried on an artifact emitted per Artifact Standard**. Schema is now the *payload shape*, not a free-standing artifact shape. | Artifact Standard integration |
| draft-2 | §2 scope tightened: Plan emits PlanArtifact *content*; emission mechanics (edges, companion data, traversal) are Artifact Standard's concern | Separation of content vs. carrier |
| draft-2 | §11 consumer contract extended: Multi-Instance consumes the *payload* and the artifact's graph-native identity separately | Clarity under layering |
| draft-2 | PA1–PA10 unchanged in substance; wording tightened to reference "PlanArtifact content" where applicable | Readability |
| draft-3 | §6.1 "Descriptor resolution" note added: descriptor fields are opaque data; concrete behavior lives in domain's L3 framework registration | Mechanism C — A1/A2/A3/A7 compliance |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Plan Standard |
| Level | L3 (Framework) |
| Version | v1.0 |
| Mode | structural (known → structured) |
| Primitive | declaration |
| Produced by | programs consuming a DomainBinding |
| Consumed by | Multi-Instance Standard |
| Carried by | Artifact Standard v1.0 (Plan's output is a payload on an Artifact Standard emission) |

## 2. Scope

Governs the *content* of **PlanArtifacts**: immutable, domain-parameterized specifications of 1..N instances to be dispatched. Plan declares *what* is to be executed, *how* it is structured, *at what size*, and *within what bounds*. Plan does not execute. Plan does not author itself — an authoring program (Builder, Research, etc.) provides the pre-plan inputs and domain binding.

**Content vs. carrier.** Plan Standard declares the **payload schema** that rides on an artifact node emitted per Artifact Standard. Plan Standard does **not** govern emission mechanics (chain writes, companion data, edges, traversal) — those are Artifact Standard's concern (ArA1–ArA5). Plan Standard declares only what goes *inside* the artifact's domain payload.

## 3. Primitive

**Declaration** — an atomic statement describing one instance and its relations to siblings. A plan is a set of declarations. Cardinality derives from the count; N=1 is the singleton case.

## 4. Axes (4)

| Axis | Governs | Atomic question |
|---|---|---|
| **Shape** | Structure of the declaration set | What is the dependency order? |
| **Intent** | What each declaration asks for | What does each instance produce? |
| **Capacity** | Sizing per declaration | Does each declaration fit instance capacity? |
| **Limit** | Thresholds | When is enough, enough? |

### 4.1 Shape

| Sub-axis | Content |
|---|---|
| Topology type | `sequence \| tier \| loop \| singleton` |
| Edges | Declaration → declaration dependency |
| Data flow | What output of A is input to B (carried on edge, typed) |

### 4.2 Intent

| Sub-axis | Content |
|---|---|
| Role | Role-class handle, resolved against DomainBinding.roleClasses |
| Input contract | Typed atom, resolved against DomainBinding |
| Output contract | Typed atom, resolved against DomainBinding |
| Tier hint | `smallest \| medium \| largest` or domain-declared class |

### 4.3 Capacity

| Sub-axis | Content |
|---|---|
| Per-declaration budget | Estimated cost vs. `DomainBinding.tierLimits[tier]` |
| Split rule | When budget exceeded, decompose via `DomainBinding.splitAxis` |
| Split-axis source | Domain-provided (not Plan-invented) |

### 4.4 Limit

| Sub-axis | Content |
|---|---|
| Per-declaration | Retry budget |
| Per-set failsafes | `maxTime`, `maxTransitions`, `maxReentries` (general) + `DomainBinding.domainFailsafes` |
| Partial-success policy | `{ allowed: boolean, minSuccesses?: number }` per-set |

## 5. Universal variables

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Shape | plan version | topology type | edge set | pending / frozen |
| Intent | schema version | role class | input/output wires | unbound / bound |
| Capacity | policy version | tier class | split-axis order | within-budget / over-budget |
| Limit | policy version | limit type | scope (decl vs set) | unconsumed / consumed |

## 6. Domain parameterization

Plan accepts a **DomainBinding** at emission. The binding is captured inside the PlanArtifact content and frozen alongside it (PA9).

### 6.1 DomainBinding shape

```
DomainBinding {
  domainId:          string                          // e.g., "liv-standard", "research-v1"
  domainVersion:     string                          // semver of the domain standard
  roleClasses:       { [id]: {
                         inputType:  TypedAtomSchema
                         outputType: TypedAtomSchema
                         tierHint:   TierClass
                     } }
  tierLimits:        { [tier: TierClass]: CapacityBudget }
  splitAxis:         SplitAxisDescriptor             // domain-declared decomposition spec
  domainFailsafes:   { [key: string]: FailsafeRule }
  renderContract:    RenderContractDescriptor        // Multi-Instance slot
  validateContract:  ValidateContractDescriptor      // Multi-Instance slot
}
```

**Non-axiom note.** `renderContract` and `validateContract` are Multi-Instance's function slots (M-I axiom IA6). Plan holds them pass-through only — Plan does not invoke them, does not reference them in PA1–PA10.

**Descriptor resolution.** Descriptor fields in the binding struct carry only `{ domainId, schemaRef }` identity. Concrete behavior lives in the domain's L3 framework registration, not in the binding. Plan does not invoke descriptors; resolution is Multi-Instance's concern via framework registry (IA6).

### 6.2 Plan declares shape; domain declares instances

Plan Standard declares the **shape** of DomainBinding. Domain standards (LIV-Standard, future Research Standard, etc.) declare their **instances** — their specific role classes, tier limits, split-axis implementations. Plan never embeds domain-specific logic.

## 7. Axioms (PA1–PA10)

| ID | Rule |
|---|---|
| PA1 | **Declaration atomicity.** Each declaration describes exactly one instance. Decomposition is Shape's or Capacity's job, not declaration's. |
| PA2 | **Shape closure + acyclicity.** Every `dependsOn` edge points to a declaration in the same plan. No cycles among structural edges. Violation at emission = invalid plan. |
| PA3 | **Contract typing.** Input and output contracts are typed atoms resolved against DomainBinding. No untyped data crosses a declaration boundary. |
| PA4 | **Limit totality.** Every declaration has a retry budget. Every plan has set-level failsafes. No unbounded execution is emittable. |
| PA5 | **Plan immutability.** Once emitted, a PlanArtifact content is immutable. Re-planning produces a new PlanArtifact content (carried on a new artifact emission per Artifact Standard) with a new id and version. The producing program decides when to re-plan; Plan Standard does not mutate. |
| PA6 | **Declaration deletability.** Removing any declaration must produce either a valid smaller plan (shape closure preserved) or a structured emission failure. No silent corruption. |
| PA7 | **Capacity sufficiency.** Every declaration fits within its declared tier's capacity, or has been split via `DomainBinding.splitAxis` before emission. No runtime splitting downstream of Plan. Capacity-breach at runtime is Multi-Instance Standard's concern (IA7). |
| PA8 | **Domain binding closure.** All role classes, contracts, capacity slots, and domain failsafes referenced in a PlanArtifact content resolve within the captured DomainBinding. No slot resolves outside the binding. |
| PA9 | **Binding immutability.** The DomainBinding used at emission is captured inside the PlanArtifact content and is immutable alongside the plan. Re-planning captures a fresh binding at re-emission. Binding version policy (upgrade, downgrade, pin) is the producing program's concern. |
| PA10 | **Split replacement.** When a declaration is split via `DomainBinding.splitAxis` before emission, the parent declaration is replaced by its children in the emitted plan. The parent is never emitted alongside children. `splitLineage.parentDeclId` is a provenance reference (not a `dependsOn` edge) and its target is not an element of `shape.declarations`. |

## 8. Payload schema — PlanArtifact content

This is the **payload** carried inside an Artifact Standard emission's `payload.content` field (per Artifact Standard §8). It is not a free-standing artifact shape; it is domain-typed content.

```
PlanArtifactContent {
  planId:         string                             // pins to artifact anchor node's identity
  planVersion:    semver
  producedBy:     { programId: string, programVersion: semver }
  producedAt:     epochMs

  binding:        DomainBinding                      // frozen per PA9

  shape: {
    topology:     'sequence' | 'tier' | 'loop' | 'singleton'
    declarations: Array<{
                    id:        DeclId
                    dependsOn: DeclId[]              // PA2
                    dataFlow:  Array<{
                                from: DeclId
                                wire: TypedAtomRef
                              }>
                  }>
  }

  intent: {
    [declId: DeclId]: {
      role:           RoleClassId                   // resolved against binding (PA8)
      inputContract:  TypedAtomRef
      outputContract: TypedAtomRef
      tierHint:       TierClass
    }
  }

  capacity: {
    [declId: DeclId]: {
      estimatedCost: number
      splitLineage?: {                              // PA10 provenance only
        parentDeclId: DeclId                        // not in shape.declarations
        splitAxis:    string
      }
    }
  }

  limit: {
    perDecl: {
      [declId: DeclId]: { retryBudget: number }
    }
    perSet: {
      maxTime:          ms
      maxTransitions:   number
      maxReentries:     number
      partialSuccess:   { allowed: boolean; minSuccesses?: number }
      domainFailsafes?: { [key: string]: number }
    }
  }
}
```

### 8.1 Carrier envelope

When a program emits a PlanArtifact, the emission produces (per Artifact Standard §8 `ArtifactEmission`):

- An **artifact anchor node** with category `artifact`, domain `plan`, schema `PlanArtifactContent`.
- A **companion data node** holding `PlanArtifactContent` verbatim as JSON.
- **Content nodes** traversed from `PlanArtifactContent.shape.declarations` and `PlanArtifactContent.intent` entries per ArA3.
- **Edges** per ArA4 (categorical, version, classification-lineage at minimum).

The `planId` pins to the artifact anchor node's graph identity. Multi-Instance reads `planId` to locate both the payload and the anchor node in the graph.

## 9. Validity

A PlanArtifact content is valid iff PA1–PA10 all hold at emission. Validity is checked at emission time by the producing program. An invalid plan is not emitted; emission is rejected with a structured error naming which axiom failed. The Artifact Standard emission event proceeds only if Plan's content passes Plan validity.

## 10. Open questions (Layer 0)

1. **Axiom prefix PA.** Flagged as a future Rule 7 extension. Not blocking.
2. **Handoff Brief v10 / Playbook v2.** Names align with this draft; no conflict observed.
3. **B.8 backlog placeholder.** Superseded by this draft. Confirm B.8 rewrites to reference Plan Standard v1.0 as content layer and Artifact Standard v1.0 as carrier.
4. **Registration.** Plan Standard registers as L3 at runtime. Deploy State III.4 standards table to add row.
5. **R5 constants file.** Implementation artifact: `src/core/constants/plan-standard.ts` for PA1–PA10 IDs, topology enum, tier enum. Matches LIV-Standard's existing `src/core/constants/` convention (R5 per T1.1 layer model).

## 11. Consumer contract

Plan Standard defines the following consumption handshake:

- Multi-Instance Standard **receives** a valid PlanArtifact by graph identity (`planId`). It reads the companion data node to obtain `PlanArtifactContent`. It resolves all declarations against `content.binding` (per its own axiom IA6). It returns a RunReport. It **never mutates** the PlanArtifact content.
- Other consumers (observability, replay, audit tooling) read the `(PlanArtifact, RunReport)` pair as a joined record. The PlanArtifact is the graph emission; the RunReport references it by `planId`. Neither member is mutated after emission.
- Re-planning produces a new PlanArtifact emission (new anchor node, new payload) per Artifact Standard mechanics. The prior emission is retained per graph retention (Living Memory energy decay applies).
