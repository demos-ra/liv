---
kind: framework
placement: frameworks/standards/
---

# plan-standard-v2-3

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.1 under metaframework-v3-1 v3.2.1
**Cross-framework input:** Artifact Standard v2.2 (frozen)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Plan Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed this regen) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `2.3` (per substrate §7 Semver; v2.2 → v2.3 per MA-L1 minor at Side-Quest Shot 4 — Phase D ContentClass classification §6.12 added; no axiom/gate/schema change) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference; string-typed this regen) |
| `stateApplied` | `runtime` (per substrate §9 LifecycleState; string-typed this regen) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `artifact-standard` v2.2 (per substrate §9 Carrier enum; applied §6.1; cross-framework calibration point) |
| `primitive` | `declaration` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | authoring-program pre-plan inputs + DomainBinding instance |
| `produces` | `PlanArtifactContent` (W-ATOM; rides as `ArtifactPayload.content` inside AS v2.2 emission) |
| `consumedBy` | Multi-Instance Standard, observability, replay, audit |
| `adjacentFrameworks` | Artifact Standard v2.2 (carrier), Multi-Instance Standard (downstream consumer), domain standards (binding suppliers: LIV-Standard, Research, etc.), Living Memory (through AS carrier) |
| `scopeOut` | `['domain-specific validity predicates (owned by domain standard via DomainBinding)', 'runtime execution (owned by Multi-Instance Standard consumers)', 'artifact emission mechanics (owned by Artifact Standard v2.2 carrier)', 'graph physics (owned by Living Memory)', 'authoring-program pre-plan composition (owned by authoring program — Builder, Research, etc.)', 'code structure / R4 runtime wiring (owned by LIV-Standard)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed this regen):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.1' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.1' },
  generationCycle: 'L3-regen-wave-cycle-2',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: { id: 'plan-standard', version: '2.1' }
}
```

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I5:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named. |

### §1.3 MA-G13 four-property test (framework classification)

Per MA-G13 (metaframework §3.2.1): a framework must declare all four properties.

| Property | Satisfied by |
|---|---|
| Own state | `{stateTemplate, stateApplied}` ∈ substrate §9 `LifecycleState` enum; `{declared, runtime, terminated, deprecated}` transitions declared at §5.1 |
| Own I/O | input: `PlanInput` (§2.1); output: `PlanArtifactContent` (§2.2) — rides as `ArtifactPayload.content` inside AS v2.2 emission |
| Own invariants | 15 axis-bound structural-integrity axioms (PA1..PA12 with PA2/PA4/PA10 atomicity-decomposed) per §3.6 + 36 axis-bound + 1 universal MA-G13 inherited from metaframework-v3-1 §3.2 |
| Own discipline | zero P8 procedure steps (Mode=structural per substrate §8.3 — P8 absent, not empty; see §3.7 positive empty-declaration); axiom gates G-Pl1..G-Pl15 at §4.2; handoff rules HR-PS1..HR-PS4 at §6.2 |

All four properties declared. MA-G13 passes. Plan Standard is classified as framework (not state store; not protocol; not substrate).

---

## §2 Schema

### §2.1 Input — `PlanInput`

Per MA-S1 (input is W-ATOM). Shape:

```
PlanInput = {
  authoringProgram: {
    programId:      string           // caller identifier (e.g., 'f-planner', 'f-research')
    programVersion: Semver           // caller version
  }
  userId:           UserId           // F-identity session carrier
  turnId:           string           // caller turn context
  domainBinding:    DomainBinding    // by-value instance from domain standard
  preplanInputs:    unknown          // caller-typed per domain
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `plan-standard.types.ts` (R5).

### §2.2 Output — `PlanArtifactContent`

Per MA-S2 (output is W-ATOM). Plan carrier = `named` → `artifact-standard` v2.2: Plan's `PlanArtifactContent` W-ATOM rides as `ArtifactPayload.content` inside AS's `ArtifactEmission` (AS v2.2 `ArtifactPayload.content: unknown` accepts this opaquely per ArA7 verbatim-carry).

Shape:

```
PlanArtifactContent = {
  planId:         PlanId                       // runtime-generated at emission (pins to AS anchor node identity per §6.11)
  planVersion:    Semver                       // authoring-program-computed (new semver per re-plan per PA5)
  producedBy: {                                // verbatim from input.authoringProgram
    programId:      string
    programVersion: Semver
  }
  producedAt:     EpochMs                      // runtime-captured at emission

  binding:        DomainBinding                // verbatim from input.domainBinding (frozen per PA9)

  shape: {                                     // authoring-program-computed from input.preplanInputs
    topology:     PlanTopology                 // enum 'sequence' | 'tier' | 'loop' | 'singleton'
    declarations: Declaration[]                // length >= 1 per PA1
  }

  intent: {                                    // authoring-program-computed, resolved against binding.roleClasses (PA3, PA8)
    [declId: DeclId]: {
      role:           RoleClassId              // keys of binding.roleClasses
      inputContract:  TypedAtomRef             // derived from binding.roleClasses[role].inputType
      outputContract: TypedAtomRef             // derived from binding.roleClasses[role].outputType
      tierHint:       TierClass                // keys of binding.tierLimits
    }
  }

  capacity: {                                  // authoring-program-computed + binding.splitAxis for splits
    [declId: DeclId]: {
      estimatedCost: number                    // domain-defined unit
      splitLineage?: {                         // provenance only per PA10b
        parentDeclId: DeclId                   // NOT present in shape.declarations (PA10a)
        splitAxis:    string                   // binding.splitAxis identifier
      }
    }
  }

  limit: {
    perDecl: {                                 // authoring-program-computed per PA4a
      [declId: DeclId]: { retryBudget: number }
    }
    perSet: {                                  // authoring-program-computed + binding-sourced per PA4b
      maxTime:          Milliseconds
      maxTransitions:   number
      maxReentries:     number
      partialSuccess:   { allowed: boolean; minSuccesses?: number }
      domainFailsafes?: { [key: string]: FailsafeRule }
    }
  }
}

Declaration = {
  id:        DeclId                            // unique within plan
  dependsOn: DeclId[]                          // PA2a + PA2b
  dataFlow:  { from: DeclId; wire: TypedAtomRef }[]   // PA11 + PA12
}

DomainBinding = {                              // shape owned by Plan; instance filled by domain standard
  domainId:          string
  domainVersion:     Semver
  roleClasses:       { [id: RoleClassId]: { inputType: TypedAtomSchema; outputType: TypedAtomSchema; tierHint: TierClass } }
  tierLimits:        { [tier: TierClass]: CapacityBudget }
  splitAxis:         SplitAxisDescriptor
  domainFailsafes:   { [key: string]: FailsafeRule }
  renderContract:    RenderContractDescriptor          // M-I slot; pass-through at Plan
  validateContract:  ValidateContractDescriptor        // M-I slot; pass-through at Plan
}
```

Typed shapes declared in `plan-standard.types.ts` (R5). Every field traces to §6.5 custody.

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 S-01 single-source-via-reference; string-typed this regen per spec §Constraints:

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
| `Stage` | substrate §8.3 (consumed for declaration-only P8 empty basis; no P8 instance consumes) |
| `StageContentKind` | substrate §8.3 (same as Stage) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same as Judgment) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `NodeId` | primitives.ts | §2.2 PlanArtifactContent (planAnchorNodeId via AS emission §6.11); §6.5 custody |
| `UserId` | primitives.ts | §2.1 PlanInput.userId |
| `Semver` | primitives.ts | §1 version, §2 producedBy.programVersion, §2 binding.domainVersion |
| `Result<T, E>` | primitives.ts | §2.2 PlanEmissionResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 PlanValidityError (types file), §6.5 custody |

### §2.5 Consumed types (from artifact-standard-v2-2, by reference)

Cross-framework calibration per spec §Cross-framework calibration. Plan consumes AS v2.2 types at the carrier boundary; AS is frozen input to this regen.

| Type | Home | Consumed at |
|---|---|---|
| `ArtifactPayload` | artifact-standard-v2-2.md §2.2 | §2.2 PlanArtifactContent rides as `ArtifactPayload.content` (unknown per AS v2.2 ArA7) |
| `ArtifactEmission` | artifact-standard-v2-2.md §2.2 | §6.11 Plan-to-AS carrier emission produces this W-ATOM; §2.2 PlanEmissionResult success value |
| `CreateArtifactInput` | artifact-standard-v2-2.md §2.1 | §6.11 authoring program constructs this at Plan→AS boundary (cross-framework calibration point) |
| `ArtifactEdgeKind` | artifact-standard-v2-2.md §2 | referenced at §6.11 dependency-edge semantics; not directly consumed by Plan fields |

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 (referenced from metaframework §6.5) | §8.2 dimension results schema reference |

### §2.7 Plan-local atoms (declared at point of use in §3)

Atoms owned by Plan (custody row per atom in §6.5):

`DeclId`, `TypedAtomRef`, `RoleClassId`, `TierClass`, `PlanId`, `EpochMs`, `Milliseconds`, `PlanTopology`, `PlanShapePositional`, `PlanIntentPositional`, `PlanCapacityPositional`, `PlanLimitScope`, `PlanLimitKind`, `PlanLimitPositional`, `CapacityBudget`, `FailsafeRule`, `SplitAxisDescriptor`, `TypedAtomSchema`, `RenderContractDescriptor`, `ValidateContractDescriptor`, `RoleClassInstance`, `DomainBinding`, `DataFlowEdge`, `Declaration`, `PlanShape`, `IntentEntry`, `PlanIntent`, `SplitLineage`, `CapacityEntry`, `PlanCapacity`, `PerDeclLimit`, `PerSetLimit`, `PlanLimit`, `AuthoringProgramRef`, `PlanArtifactContent`, `PlanInput`, `PlanHandoffRuleInstance`, `PlanGateResult`, `PlanDimensionResult`, `PlanCustodyRow`, `PlanValidityError`, `PlanEmissionResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling) per S1 single-source declaration. Typed shapes in `plan-standard.types.ts`.

### §2.8 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to Plan:

- **ScR1** (input is W-ATOM): `PlanInput` declared §2.1 as typed shape.
- **ScR2** (output is W-ATOM): `PlanArtifactContent` declared §2.2 as typed shape; rides inside AS `ArtifactPayload.content`.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.9 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

Plan inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. Plan does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, Plan's own structural content populates §3.3–§3.9 below: four Plan-local P1 Axis instances (Shape, Intent, Capacity, Limit), sub-axis instances, leaves, axioms (PA1..PA12 with PA2/PA4/PA10 atomicity-decomposed), and the empty P8 declaration.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 4 | `{primitiveKind: P1, instanceCount: 4, basis: "Plan-local domain axes declared at §3.3: Shape, Intent, Capacity, Limit. The seven metaframework axes (A1–A7) are the framework-file shape shell per substrate §9 File-shape applicability; Plan-local P1 instances populate §3 Structure under the inherited shell under A3 Structure."}` |
| P2 Sub-axis | 14 | Shape: 4; Intent: 4; Capacity: 4; Limit: 2. Declared §3.4. |
| P3 Leaf | 15 | One leaf per axiom condition per MA-St2 leaf atomicity: PA1 (1) + PA2a/PA2b (2) + PA3 (1) + PA4a/PA4b (2) + PA5 (1) + PA6 (1) + PA7 (1) + PA8 (1) + PA9 (1) + PA10a/PA10b (2) + PA11 (1) + PA12 (1) = 15. Declared §3.5. |
| P4 Axiom | 15 | PA1, PA2a, PA2b, PA3, PA4a, PA4b, PA5, PA6, PA7, PA8, PA9, PA10a, PA10b, PA11, PA12. Declared §3.6. |
| P5 Gate | 15 | G-Pl1, G-Pl2a, G-Pl2b, G-Pl3, G-Pl4a, G-Pl4b, G-Pl5, G-Pl6, G-Pl7, G-Pl8, G-Pl9, G-Pl10a, G-Pl10b, G-Pl11, G-Pl12. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-Pl1 (authoring-program → Plan), HR-Pl2 (domain-standard → Plan), HR-Pl3 (Plan → artifact-standard v2.2), HR-Pl4 (Plan → multi-instance-standard). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: P7, instanceCount: 0, basis: "Plan's validity check is fully mechanical per §10: invalid plan is not emitted; emission is rejected with a structured error naming the failed axiom. Every PA1..PA12 condition reduces to substrate §6.3 mechanical-criterion ground (reference resolution, acyclicity, cardinality, structural property). No judgment inputs consumed. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 0 | `{primitiveKind: P8, instanceCount: 0, basis: "Plan Mode = structural per §1 Identity. Substrate §8.3 line 509+521 binds P8 to Mode = generative only ('Mode = generative only'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty'). Plan therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. Plan's composition pipeline is owned upstream by the authoring program (pre-schema.input, not an intra-Plan procedure); Plan's emission-time validity enforced mechanically by the PA1..PA12 gate bundle at the AS v2.2 carrier invocation site (§6.11), outside Plan's P8 scope. Spec's permissive 'P8 declaration permitted but not required' is resolved by substrate §8.3's Mode binding: P8 is absent for Plan."}` |

Positive empty-declaration markers for P7 and P8 per substrate §8.6. No implicit absence.

### §3.3 P1 Axis instances (Plan-local)

Four domain axes. MECE over Plan's concern space. Preserved verbatim from v2.1 §4 axis descriptions (no text drift per spec §Constraints); rendered against the v3.1 seven-axis shell at §3.1.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Shape` | Shape | Structure of the declaration set | What depends on what? |
| `Intent` | Intent | What each declaration asks for | What does each instance produce and consume? |
| `Capacity` | Capacity | Sizing per declaration vs tier | Does each declaration fit its declared tier's budget? |
| `Limit` | Limit | Thresholds for termination | When is enough, enough? |

**MECE verification:**
- Orthogonality: Shape governs topology + dependency edges (relation among declarations); Intent governs per-declaration role + contracts (typed purpose of each declaration); Capacity governs per-declaration cost vs tier limit + pre-emission split (sizing); Limit governs per-set and per-declaration termination thresholds (stopping conditions). No pair-overlap.
- Exhaustiveness: every `PlanArtifactContent` field traces to exactly one Plan-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Shape sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Shape/topology` | Topology classifier | `leaf-topology` |
| `Shape/declarationSet` | Set of declarations | `leaf-declaration-set` |
| `Shape/dependencyEdges` | Dependency graph | `leaf-depends-on-ref`, `leaf-depends-on-acyclic` |
| `Shape/dataFlowEdges` | Typed-wire graph | `leaf-dataflow-from`, `leaf-dataflow-wire` |

**Intent sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Intent/role` | Role classifier | `leaf-role-binding` |
| `Intent/inputContract` | Input W-ATOM ref | `leaf-input-contract` |
| `Intent/outputContract` | Output W-ATOM ref | `leaf-output-contract` |
| `Intent/tierHint` | Tier classifier | `leaf-tier-hint` |

**Capacity sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Capacity/estimatedCost` | Per-declaration cost | `leaf-estimated-cost` |
| `Capacity/tierLimit` | Budget per tier | `leaf-tier-limit` |
| `Capacity/splitRule` | Pre-emission split decision | `leaf-split-rule` |
| `Capacity/splitLineage` | Provenance reference to parent | `leaf-split-lineage` |

**Limit sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Limit/perDeclaration` | Per-declaration retry budget | `leaf-retry-budget` |
| `Limit/perSet` | Per-set failsafes + partial-success | `leaf-max-time`, `leaf-max-transitions`, `leaf-max-reentries`, `leaf-partial-success`, `leaf-domain-failsafe` |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-topology` | `property` | `PlanTopology` enum `'sequence' \| 'tier' \| 'loop' \| 'singleton'` |
| `leaf-declaration-set` | `descriptor` | `Declaration[]` with cardinality predicate `>= 1` per PA1 |
| `leaf-depends-on-ref` | `property` | `DeclId[]` with same-plan closure predicate per PA2a |
| `leaf-depends-on-acyclic` | `property` | acyclic-directed-graph predicate per PA2b |
| `leaf-dataflow-from` | `property` | `DeclId` with same-plan closure predicate per PA11 |
| `leaf-dataflow-wire` | `property` | `TypedAtomRef` with source-output + target-input equality predicate per PA12 |
| `leaf-role-binding` | `property` | `RoleClassId` with key-in-binding predicate per PA8 |
| `leaf-input-contract` | `property` | `TypedAtomRef` with binding-resolution predicate per PA3 |
| `leaf-output-contract` | `property` | `TypedAtomRef` with binding-resolution predicate per PA3 |
| `leaf-tier-hint` | `property` | `TierClass` with key-in-binding predicate per PA8 |
| `leaf-estimated-cost` | `property` | `number` (domain-defined unit) |
| `leaf-tier-limit` | `descriptor` | `CapacityBudget` with key-in-binding predicate per PA8 |
| `leaf-split-rule` | `property` | emission-time predicate: `estimatedCost <= tierLimits[tierHint]` OR split-replacement per PA7 |
| `leaf-split-lineage` | `descriptor` | `SplitLineage` with parent-absent-from-set predicate per PA10a + PA10b |
| `leaf-retry-budget` | `property` | `number` (per-declaration presence predicate per PA4a) |
| `leaf-max-time` | `property` | `Milliseconds` (presence predicate per PA4b) |
| `leaf-max-transitions` | `property` | `number` (presence predicate per PA4b) |
| `leaf-max-reentries` | `property` | `number` (presence predicate per PA4b) |
| `leaf-partial-success` | `descriptor` | `{ allowed: boolean; minSuccesses?: number }` |
| `leaf-domain-failsafe` | `descriptor` | `{ [key: string]: FailsafeRule }` (optional) |

**Leaf-count reconciliation note (§3.2 counts P3 = 15 per MA-St2 one-leaf-per-axiom-condition):**

Axiom conditions are 15 (PA1..PA12 with PA2/PA4/PA10 atomicity-decomposed). The 20 leaves above decompose finer than axiom conditions in some cases (e.g., PA4b's three sub-conditions — maxTime, maxTransitions, maxReentries — surface as three leaves for typed-shape-declaration purposes in §3.4). Per MA-St2, "one leaf per axiom condition" is the canonical binding; additional leaf rows carry sub-field shape declarations that aggregate into one axiom-condition leaf at the axiom-attachment level (§3.6). The canonical P3 count reported in §3.2 is 15 (the axiom-condition-anchored leaf count used by MA-St2 + G-M1 mechanics); the table above lists 20 shape-declaration rows including sub-field descriptors. This is an audit-trail observation, not a count violation: axiom gates bind 1:1 to axiom conditions per G-M1 (§4.2), and leaf attachment in §3.6 uses the axiom-condition-anchored set.

### §3.6 P4 Axiom instances (PA1..PA12 with PA2/PA4/PA10 decomposed)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). Preserved verbatim from v2.1 §6 (no text drift, no hygiene edits per spec §Constraints). AxR3 additive versioning: v2.1 PA1..PA12 carried forward; carrier updated v2.1 → v2.2 at §6.1 reference sites only.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **PA1** | `Shape/declarationSet` / `leaf-declaration-set` | Each declaration describes exactly one instance; no declaration encodes more than one role invocation. | structural property (per-declaration cardinality 1) |
| **PA2a** | `Shape/dependencyEdges` / `leaf-depends-on-ref` | Every `Declaration.dependsOn[*]` references a `DeclId` present in the same plan's `shape.declarations`. | reference resolution |
| **PA2b** | `Shape/dependencyEdges` / `leaf-depends-on-acyclic` | The directed graph formed by `dependsOn` edges has no cycles. | structural property (acyclicity predicate) |
| **PA3** | `Intent/inputContract` + `Intent/outputContract` / `leaf-input-contract` + `leaf-output-contract` | Every `Declaration.inputContract` and `Declaration.outputContract` resolves to a `TypedAtomRef` registered in the captured `DomainBinding.roleClasses[role]`. | reference resolution |
| **PA4a** | `Limit/perDeclaration` / `leaf-retry-budget` | Every declaration has a `retryBudget` entry in `content.limit.perDecl[declId]`. | structural property (field presence per-decl) |
| **PA4b** | `Limit/perSet` / `leaf-max-time` + `leaf-max-transitions` + `leaf-max-reentries` | Every plan has `maxTime`, `maxTransitions`, `maxReentries` declared in `content.limit.perSet`. | structural property (field presence) |
| **PA5** | `Shape/declarationSet` | Once a `PlanArtifactContent` is emitted (captured as AS companion data), it is immutable; re-planning produces a new `PlanArtifactContent` with a new `planId` and new `planVersion`. | structural property (mutation-rejection predicate on persisted content) |
| **PA6** | `Shape/declarationSet` | Removing any single declaration from a plan produces either (i) a valid smaller plan satisfying PA1–PA12 or (ii) a structured emission failure; no silent corruption. | structural property (total decomposition predicate) |
| **PA7** | `Capacity/splitRule` / `leaf-split-rule` | Every declaration's `estimatedCost ≤ tierLimits[tierHint]` at emission, or was replaced by split children per PA10a before emission. | cardinality + reference resolution (`<=` numeric + tier key lookup) |
| **PA8** | `Intent/role` + `Intent/tierHint` + `Capacity/tierLimit` / `leaf-role-binding` + `leaf-tier-hint` + `leaf-tier-limit` + `leaf-domain-failsafe` | Every `RoleClassId`, `TypedAtomRef`, `TierClass`, and domain-failsafe key referenced in the plan content resolves within the captured `DomainBinding`. | reference resolution |
| **PA9** | `Shape/declarationSet` | The `DomainBinding` instance captured at emission is immutable alongside the plan content; post-emission reads observe the emission-time binding. | structural property (mutation-rejection predicate on captured binding) |
| **PA10a** | `Capacity/splitRule` + `Capacity/splitLineage` | When a declaration is split via `DomainBinding.splitAxis` before emission, the parent declaration is absent from `shape.declarations` and its children are present. | structural property (set membership predicate) |
| **PA10b** | `Capacity/splitLineage` / `leaf-split-lineage` | `splitLineage.parentDeclId` is a provenance reference; the referenced `parentDeclId` is never an element of `shape.declarations` in the emitted plan. | reference resolution + set non-membership |
| **PA11** | `Shape/dataFlowEdges` / `leaf-dataflow-from` | Every `Declaration.dataFlow[*].from` references a `DeclId` present in the same plan's `shape.declarations`. (Data-flow analog of PA2a, separated because data-flow edges and dependency edges are distinct relations.) | reference resolution |
| **PA12** | `Shape/dataFlowEdges` / `leaf-dataflow-wire` | Every `Declaration.dataFlow[*].wire` resolves to a `TypedAtomRef` matching the source declaration's `outputContract` and the target declaration's `inputContract`. | reference resolution (dual-source equality) |

**AxR1 self-check:** each axiom binds to exactly one axis/sub-axis/leaf per attachment column. PA2a/PA2b both under `Shape/dependencyEdges` (different leaves). PA4a on `Limit/perDeclaration`; PA4b on `Limit/perSet`. PA11/PA12 both under `Shape/dataFlowEdges` (different leaves). Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set additively versioned from v2.1 (v2.1 declared PA1, PA2a, PA2b, PA3, PA4a, PA4b, PA5, PA6, PA7, PA8, PA9, PA10a, PA10b, PA11, PA12 = 15 conditions; v2.2 preserves set identity — no additions, no deletions, no condition re-writes; only §6.1 Carrier updated v2.1 → v2.2). Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "Plan Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only (line 509: 'P8 — Procedure step. Mode = generative only.'; line 521: 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). Plan has zero P8 instances per substrate §8.6 empty-declaration derivation.

   Scope note: Plan's composition pipeline is owned upstream by the authoring program (pre-schema.input). Plan declares the typed shape that pipeline produces (PlanArtifactContent); it does not declare the procedure that produces it. Plan's emission-time validity is enforced mechanically by the PA1..PA12 gate bundle at the AS v2.2 carrier invocation site (§6.11) — that gate execution is AS's P8 S2, not Plan's P8.

   Spec §Constraints language ('P8 declaration permitted but not required; if declared, justify per PR4/PR5') is resolved under substrate precedence: P8 is structurally absent for Plan. PR4 (stage monotonicity) and PR5 (stage-content-kind alignment) do not apply to an empty set."
}
```

PR4 / PR5 self-checks vacuous (empty P8 set).

### §3.8 Universal-variables table

Per substrate §3.5 (each axis expressed across all four variables, producing a four-cell row). Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Shape` | `Semver` (bound to `PlanArtifactContent.planVersion`) | `PlanTopology` enum `'sequence' \| 'tier' \| 'loop' \| 'singleton'` | `Declaration.dependsOn: DeclId[]` (same-plan); `Declaration.dataFlow: DataFlowEdge[]` (typed-wire graph) | `PlanShapePositional` enum `'pending' \| 'emitted' \| 'superseded'` |
| `Intent` | `Semver` (bound to `DomainBinding.domainVersion`) | `RoleClassId` (keys of `DomainBinding.roleClasses`) | `IntentEntry.inputContract: TypedAtomRef` paired with `IntentEntry.outputContract: TypedAtomRef` (dual reference per declaration, both resolved against `DomainBinding.roleClasses[role]`) | `PlanIntentPositional` enum `'unbound' \| 'bound'` |
| `Capacity` | `Semver` (bound to `DomainBinding.domainVersion`) | `TierClass` (keys of `DomainBinding.tierLimits`) | `CapacityEntry.estimatedCost: number` paired with `DomainBinding.tierLimits[tierHint]: CapacityBudget` (per-declaration ≤ predicate per PA7) | `PlanCapacityPositional` enum `'within-budget' \| 'over-budget' \| 'split'` |
| `Limit` | `Semver` (bound to `PlanArtifactContent.planVersion`) | `PlanLimitKind` enum `'retry' \| 'maxTime' \| 'maxTransitions' \| 'maxReentries' \| 'domainFailsafe' \| 'partialSuccess'` | `PlanLimitScope` enum `'declaration' \| 'set'` (scope classifier per limit entry) | `PlanLimitPositional` enum `'unconsumed' \| 'consumed' \| 'breached'` |

Every cell is a named type, an enum literal set, an inlined type shape, or a declared type-to-type paired reference. No prose cells. No arrow notation at the content level (relational column uses named-type-to-named-type declarations via explicit field references).

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `declaration` | §3.3 primitive | atomic statement describing one instance; properties: `id`, `dependsOn`, `dataFlow`; intent/capacity/limit data lookup-keyed by `id` (not embedded) |
| `plan` | §2.2 output | set of declarations emitted as one `PlanArtifactContent` |
| `DomainBinding` | §2.2 + `plan-standard.types.ts` | Plan-defined type shape; domain standard fills instance values; captured verbatim at emission |
| `role class` | §3.4 `Intent/role` | category of execution role (e.g., IN-MAIN, IN-QA); enum declared in binding |
| `tier class` | §3.4 `Intent/tierHint` + `Capacity/tierLimit` | capacity category (e.g., smallest / medium / largest); enum declared in binding |
| `split` | §3.6 PA7 + PA10a | pre-emission decomposition of one declaration into children per `DomainBinding.splitAxis`; parent is replaced, not retained |
| `split lineage` | §3.6 PA10b + `plan-standard.types.ts` | provenance reference from a child declaration to its pre-split parent; not a `dependsOn` edge |
| `wire` | §3.4 `Shape/dataFlowEdges` + `plan-standard.types.ts` | typed atom carried between declarations on a dataFlow edge |
| `topology` | §3.4 `Shape/topology` + §3.5 leaf | `PlanTopology` enum literal |
| `re-plan` | §3.6 PA5 | production of a new `PlanArtifactContent` with new `planId` + new `planVersion` in response to upstream change; old content remains immutable |

---

## §4 Validity

### §4.1 Gate count

Plan declares **15 own primary gates** (G-Pl1 .. G-Pl12 with PA2/PA4/PA10 decomposed-axiom 1:1 gates). Plus **52 framework-tier metaframework gates** inherited (per metaframework §4.1 enumeration).

| Tier | Count | Source | Executed when Plan is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG4) | 4 | substrate §11.5 | run once, not per framework |
| Plan-own axiom gates (G-Pl*) | 15 | this §4.2 | framework-audit applies PA1..PA12 decomposed-axiom suite per MA-V1 |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J4, G-G13) | 36 | metaframework §4.1 | inherited; test Plan's conformance to MA-I1..MA-J4 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **15 + 52 = 67** | | |

Plan's own 15 gates are executed in addition to the 52 inherited — same pattern as AS v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite).

### §4.2 Plan-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 15 axioms → 15 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-Pl1** | PA1 | `forall d ∈ content.shape.declarations: d encodes exactly one role invocation at intent[d.id]` — tested via structural check: `intent[d.id]` is a singleton `IntentEntry` (not an array or multi-entry object) for every `d.id` in `shape.declarations` | structural property |
| **G-Pl2a** | PA2a | `forall d ∈ content.shape.declarations: forall depId ∈ d.dependsOn: depId ∈ declIdSet(content.shape.declarations)` where `declIdSet(xs) = {x.id : x ∈ xs}` | reference resolution |
| **G-Pl2b** | PA2b | topological-sort predicate on directed graph `G = (declIdSet, {(d.id, depId) : d ∈ declarations, depId ∈ d.dependsOn})` returns success (acyclic) | structural property (acyclicity) |
| **G-Pl3** | PA3 | `forall declId ∈ keys(content.intent): let ie = content.intent[declId]; let rc = content.binding.roleClasses[ie.role]; ie.inputContract resolves to rc.inputType.ref AND ie.outputContract resolves to rc.outputType.ref` | reference resolution (dual) |
| **G-Pl4a** | PA4a | `forall d ∈ content.shape.declarations: keys(content.limit.perDecl).includes(d.id) AND typeof content.limit.perDecl[d.id].retryBudget === 'number'` | structural property (presence) |
| **G-Pl4b** | PA4b | `content.limit.perSet.maxTime !== undefined AND content.limit.perSet.maxTransitions !== undefined AND content.limit.perSet.maxReentries !== undefined` (with type-matching checks per types file shapes) | structural property (presence triple) |
| **G-Pl5** | PA5 | For persisted `PlanArtifactContent` P: Living Memory mutation attempts on `P.shape`, `P.intent`, `P.capacity`, `P.limit`, `P.binding`, `P.planId`, `P.planVersion`, `P.producedBy`, `P.producedAt` properties are rejected by AS-v2.2-ArA5-grounded write-protection (AS companion node holds the payload; AS immutability propagates to payload at companion). | structural property (mutation-rejection propagated from AS v2.2 ArA5) |
| **G-Pl6** | PA6 | For every `d ∈ content.shape.declarations`: hypothetical removal of `d` produces plan' where `plan' = content` with `d` removed from `shape.declarations` AND `intent[d.id]` / `capacity[d.id]` / `limit.perDecl[d.id]` removed AND all `dependsOn`/`dataFlow.from` references to `d.id` removed from remaining declarations — plan' either satisfies PA1..PA12 OR emission returns structured `PlanValidityError` with populated `failedAxiom` field. No silent corruption. | structural property (total decomposition predicate) |
| **G-Pl7** | PA7 | `forall d ∈ content.shape.declarations: let tb = content.binding.tierLimits[content.intent[d.id].tierHint]; content.capacity[d.id].estimatedCost <= tb.budget` (split children already present if parent exceeded at composition; PA10a+PA10b carry split provenance) | cardinality + reference resolution |
| **G-Pl8** | PA8 | `forall d ∈ content.shape.declarations: content.intent[d.id].role ∈ keys(content.binding.roleClasses) AND content.intent[d.id].tierHint ∈ keys(content.binding.tierLimits) AND (if content.limit.perSet.domainFailsafes exists: forall k ∈ keys(content.limit.perSet.domainFailsafes): k ∈ keys(content.binding.domainFailsafes))` | reference resolution |
| **G-Pl9** | PA9 | For persisted plan emission: `content.binding === emission-time-captured-binding-snapshot`; verified via AS-v2.2-ArA5 immutability of companion node (which holds full `PlanArtifactContent` including `binding`). | structural property (mutation-rejection propagated from AS v2.2 ArA5) |
| **G-Pl10a** | PA10a | `forall declId ∈ keys(content.capacity) where content.capacity[declId].splitLineage !== undefined: content.capacity[declId].splitLineage.parentDeclId ∉ declIdSet(content.shape.declarations) AND declId ∈ declIdSet(content.shape.declarations)` | structural property (set-membership predicate) |
| **G-Pl10b** | PA10b | `forall declId ∈ keys(content.capacity) where content.capacity[declId].splitLineage !== undefined: content.capacity[declId].splitLineage.parentDeclId ∉ declIdSet(content.shape.declarations)` (set non-membership; provenance-not-dependency predicate; no `dependsOn` edge carries splitLineage) | reference resolution (non-membership) |
| **G-Pl11** | PA11 | `forall d ∈ content.shape.declarations: forall df ∈ d.dataFlow: df.from ∈ declIdSet(content.shape.declarations)` | reference resolution |
| **G-Pl12** | PA12 | `forall d ∈ content.shape.declarations: forall df ∈ d.dataFlow: df.wire === content.intent[df.from].outputContract AND df.wire === content.intent[d.id].inputContract` | reference resolution (dual-source equality) |

**G-M1 self-check:** 15 axioms → 15 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Shape 7 gates (G-Pl1, G-Pl2a, G-Pl2b, G-Pl5, G-Pl6, G-Pl9, G-Pl11, G-Pl12 — note G-Pl5 and G-Pl9 both attach at Shape/declarationSet because immutability invariants scope the whole content under that sub-axis); Intent 2 gates (G-Pl3 — PA3 spans both inputContract and outputContract sub-axes; G-Pl8 covers role + tierHint binding + Capacity/tierLimit); Capacity 3 gates (G-Pl7, G-Pl10a, G-Pl10b); Limit 2 gates (G-Pl4a, G-Pl4b). Every Plan-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs Plan against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I5):** tests Plan's §1 Identity conformance to MA-I1..MA-I5.
- **E2 Schema (PG2 + G-S1..G-S3):** tests Plan's §2 Schema conformance to MA-S1..MA-S3.
- **E3 Structure (PG3 + G-St1..G-St5):** tests Plan's §3 Structure conformance to MA-St1..MA-St5.
- **E4 Validity (PG4 + G-V1..G-V5):** tests Plan's §4 Validity conformance to MA-V1..MA-V5.
- **E5 Lifecycle (PG5 + G-L1..G-L7):** tests Plan's §5 Lifecycle conformance to MA-L1..MA-L7.
- **E6 Coupling (PG6 + G-C1..G-C6):** tests Plan's §6 Coupling conformance to MA-C1..MA-C6.
- **E7 Judgment (PG7 + G-J1..G-J4):** tests Plan's §7 Judgment conformance to MA-J1..MA-J4.
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests Plan's conformance to MA-G13 + F-69 + meta-gate axioms.

Plus Plan's own 15 G-Pl* gates execute against the emitted `PlanArtifactContent` at emission time (and at framework-audit re-verification). Total per-audit framework-tier gates when Plan is target: 67 (52 + 15).

**Disambiguation note on gate execution scope:**
The 52 inherited gates test Plan's **framework declaration conformance** (does Plan's §1–§7 structure match metaframework's axioms?). The 15 G-Pl* gates test **individual PlanArtifactContent instance conformance** (does a given emitted plan satisfy PA1..PA12?). Different scopes, different execution sites — the 52 run at framework-audit time against this file; the 15 run at emission-time on each PlanArtifactContent the authoring program produces.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover Plan's validity surfaces:

| Dimension | Plan gates consuming |
|---|---|
| X1 (Identity) | E1 bundle |
| X2 (Custody) | E6 bundle + SG3 |
| X3 (Coupling) | E6 bundle (HRs), G-C5 (captureShape) |
| X4 (Scope) | §2 scope rows; audited by E2 schema check |
| X5 (Atom-ownership) | E6 + §6.5 custody |
| X6 (Provenance) | E6 + G-U5 + §6.6 provenance |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration |
| X9 (Integration point) | E6 coupling gates + HR-Pl3 to AS v2.2 |
| X10 (Stage-declaration extended predicate) | §3.7 empty-P8 declaration + its basis traversal |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG4): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 36 inherited (35 MA-axis-bound + G-G13) + 15 Plan-own (G-Pl*) = 51.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to Plan.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 67 framework-tier gates (52 inherited + 15 Plan-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-regen-cycle confirmation (§5.3). Gate IDs enumerated:

Inherited (52): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-S1, G-S2, G-S3, G-St1, G-St2, G-St3, G-St4, G-St5, G-V1, G-V2, G-V3, G-V4, G-V5, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-J1, G-J2, G-J3, G-J4, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

Plan-own (15): `G-Pl1, G-Pl2a, G-Pl2b, G-Pl3, G-Pl4a, G-Pl4b, G-Pl5, G-Pl6, G-Pl7, G-Pl8, G-Pl9, G-Pl10a, G-Pl10b, G-Pl11, G-Pl12`.

Substrate-tier gates (SG1–SG4) excluded per tier-1 "run once, not per framework" semantics.

---

## §5 Lifecycle

### §5.1 Version transition

v2.1 → v2.2. Additive per MA-L1. Scope of change: (a) seven-axis shell adopted per metaframework-v3-1 §3.1 replacing v2.1's four-axis top-level shape (four-axis shape was the metaframework v2.4 shell; v2.1's four domain axes — Shape, Intent, Capacity, Limit — are preserved as Plan-local P1 Axis instances under A3 Structure per §3.3); (b) §6.1 Carrier pinned to Artifact Standard v2.2 (was v2.1); (c) R5 types file declares `plan-standard.types.ts` consuming `artifact-standard.types.ts` for cross-framework calibration at the carrier boundary; (d) §3.7 P8 empty-declaration basis authored per substrate §8.3 Mode-binding + §8.6; (e) §6.2 HR set made explicit with captureShape per substrate §8.2 amended P6. No axiom additions, deletions, or re-writes. Regen path: generation-procedure-v1-0 S1–S12 template-generation under metaframework-v3-1.

### §5.2 Amendment trigger

Gap-driven. Trigger: L3 regen wave cycle 2 of 4 per spec-plan-regen-v3-1. Driving findings: (i) v2.1 carrier pinned to AS v2.1 (stale after AS v2.2 deploy); (ii) v2.1 rendered under metaframework v2.4 four-axis shell (stale after metaframework v3.1 seven-axis shell); (iii) §3.7 P8 stance under v2.1 was silent (no positive empty-declaration per substrate §8.6).

### §5.3 Confirmation gate

Pending L0 at cycle closure. Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. Plan declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

### §5.6 Failure modes

Per v3-1-spec §3.3 output schema `lifecycle.failureModes`:

| Stage | Failure mode | Recovery path |
|---|---|---|
| Input receipt (HR-Pl1 / HR-Pl2) | Schema violation on `PlanInput` or `DomainBinding` shape | authoring program returns `Result { ok: false, error: PlanValidityError { code: 'PLAN_INPUT_INVALID' } }`; no AS emission invoked |
| Emission-time validity (G-Pl1..G-Pl12) | Any G-Pl* gate fails on proposed `PlanArtifactContent` | authoring program returns `Result { ok: false, error: PlanValidityError { code: 'PLAN_VALIDITY_FAILED', failedAxiom: 'PA<n>' } }`; no AS emission invoked |
| Carrier emission (HR-Pl3 → AS v2.2) | AS v2.2 gate failure (G-Ar*, PG*, G-U*, G-M*) | AS returns `ArtifactError`; authoring program surfaces as `PlanValidityError { code: 'PLAN_EMISSION_REJECTED' }` |
| Post-emission read (HR-Pl4) | Living Memory one-hop query returns `null` for `planAnchorNodeId` | consumer (M-I or observability) surfaces as read failure per their own framework's error discipline; Plan has no further recovery |

### §5.7 Scale bounds

Per v3-1-spec §3.3 output schema `lifecycle.scaleBounds`:

- Per-plan declaration count: bounded by authoring program's scale policy (no Plan-framework hard cap; PA1's "one instance per declaration" + PA2b's acyclicity keep graph finite).
- Per-plan dataFlow edge count: `O(declarations^2)` worst case; authoring program enforces per-domain cap via `DomainBinding`-declared limits (not a Plan axiom).
- Per-emission binding size: bounded by `DomainBinding` instance size (domain-declared; Plan shape permits arbitrary `roleClasses` / `tierLimits` map size).

### §5.8 Atomicity declarations

Per v3-1-spec §3.3 output schema `lifecycle.atomicityDeclarations`:

- Plan composition (authoring program ownership): non-atomic; authoring program owns transaction boundary.
- Plan validity gate execution (G-Pl1..G-Pl12): atomic per-plan (all-or-nothing validation; no partial-pass emission).
- AS carrier emission (HR-Pl3): atomicity inherited from AS v2.2 atomicity declaration (AS emission is atomic per substrate §13.4).
- Post-emission immutability (PA5, PA9): enforced by AS v2.2 ArA5 at the companion node (which holds the full `PlanArtifactContent` payload).

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | (pre-cycle) | Regenerated under metaframework v2.1; PA1..PA12 initial atomicity split (PA2/PA4/PA10 decomposed; PA11+PA12 separated from v1.0 PA3 prose); DomainBinding shape + custody table declared; carrier declared `Artifact Standard v2.0` (was prose-only in earlier revision). | L0 |
| v2.0 | (pre-cycle) | Regenerated against metaframework v2.4 (MA-G5c custody + MA-G5d provenance); per-field provenance on `PlanArtifactContent`, `Declaration`, `DomainBinding`; carrier pinned to `Artifact Standard v2.0`. | L0 |
| v2.1 | (pre-cycle) | Carrier updated to `Artifact Standard v2.1`. | L0 |
| v2.2 | 2026-04-23 (L3 regen wave cycle 2) | Regenerated against metaframework-v3-1 via generation-procedure-v1-0. Seven-axis shell adopted; v2.1 four-axis top-level folded into Plan-local P1 axis instances under A3 Structure. Zero P8 instances (positive empty-declaration per substrate §8.3 Mode=generative-only + §8.6). Four HRs (HR-Pl1..HR-Pl4) with captureShape per substrate §8.2 amended P6. R5 types file `plan-standard.types.ts` consumes `artifact-standard.types.ts` at §2.5 cross-framework calibration. Carrier pinned to Artifact Standard v2.2. Provenance field populated per metaframework §2.2 (reference-default per A-20). No axiom additions, deletions, or re-writes (AxR3 additive). | L0 (pending regen-cycle confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Plan Standard carrier = `named` → `artifact-standard` v2.2. Plan declares payload content only (`PlanArtifactContent`); does not emit carrier mechanics. Emission call pattern: authoring program invokes AS v2.2 `createArtifact` with `framework = { id: 'plan', version: '2.2' }` and `payload = { domain: 'plan', domainVersion: '2.2', schemaRef: 'PlanArtifactContent', content: <PlanArtifactContent> }` and receives `ArtifactEmission`. See §6.11 carrier relation.

**Cross-framework calibration:** Carrier version bound to Artifact Standard v2.2 (not v2.1). This is the cross-cycle calibration point required by spec §Cross-framework calibration.

### §6.2 Handoff rules

Four framework-local HR instances. All Plan-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-Pl4 where `diagnosticSignificance = false` → captured via HR-Pl3 + HR-Ar2 Living Memory write).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-Pl1** | authoring-program → plan-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-Pl2** | domain-standard → plan-standard | `['self', 'named']` | `true` | declared §6.3 |
| **HR-Pl3** | plan-standard → artifact-standard (v2.2) | `['named']` (Plan's own carrier = named) | `true` | declared §6.3 |
| **HR-Pl4** | plan-standard → multi-instance-standard | `['named']` | `false` | n/a (consumer reads via AS `planAnchorNodeId`; capture via HR-Pl3 + AS-v2.2 HR-Ar2) |

**Inherited HRs referencing Plan:**

| HR | Owning declaration | Plan's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → Plan type consumption; Plan consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; Plan is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records Plan's framework declaration per provenance contract (see §6.6) |
| HR-Ar3 | artifact-standard-v2-2 §6.2 | content-framework → artifact-standard; Plan is one content framework invoking AS v2.2 `createArtifact` at HR-Pl3 |
| HR-Ar4 | artifact-standard-v2-2 §6.2 | artifact-standard → content-framework; Plan receives `ArtifactEmission` receipt after AS emits Plan's carrier |

Per substrate §1.3 S-03: these HRs are referenced, not redeclared, by Plan.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-Pl1 — authoring program → Plan (PlanInput receipt):**
```
captureShape = {
  capturedFields: ['authoringProgram.programId', 'authoringProgram.programVersion', 'userId', 'turnId', 'planId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-Pl2 — domain standard → Plan (DomainBinding consumption):**
```
captureShape = {
  capturedFields: ['domainId', 'domainVersion', 'bindingHash', 'consumedAtPlanId', 'turnId', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; binding resolution by (domainId, domainVersion, bindingHash)'
}
```

**HR-Pl3 — Plan → Artifact Standard v2.2 (carrier emission invocation):**
```
captureShape = {
  capturedFields: ['planId', 'planVersion', 'framework.id', 'framework.version', 'payload.domain', 'payload.domainVersion', 'asEmissionId', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; plan anchor resolved via AS v2.2 ArtifactEmission.writes.a7.artifactAnchorNodeId → planAnchorNodeId'
}
```

**HR-Pl4:** no captureShape declared (`diagnosticSignificance: false`); receipt-only contract; diagnostic data captured at HR-Pl3 invocation and via AS v2.2 HR-Ar2 Living Memory write.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C6 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'named'` with bound framework ref `artifact-standard` v2.2.
- **MA-C2** (custody per atom): §6.5 enumerates every Plan-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-Pl1..HR-Pl4 send/receive shapes matched by construction; captureShape contracts symmetric with HR-Ar3 (receive-side at AS v2.2).
- **MA-C4** (provenance per output field): §2.2 every `PlanArtifactContent` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'named'` → output rides inside named carrier's artifact per MA-S2; §2.2 `PlanArtifactContent` populates `ArtifactPayload.content` at HR-Pl3.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; AS v2.2 atoms referenced at §2.5 are not re-owned (custody remains with artifact-standard); substrate / primitives.ts / metaframework atoms referenced at §2.3, §2.4, §2.6 not re-owned.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | plan-standard (planAnchorNodeId via AS emission), every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | plan-standard (§2.1 PlanInput.userId), every session-aware framework |
| `Semver` | primitives.ts | core/R5 | plan-standard (§1 version, §2 producedBy.programVersion, §2 binding.domainVersion), every versioned framework |
| `Result<T, E>` | primitives.ts | core/R5 | plan-standard (§2.2 PlanEmissionResult), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | plan-standard (§2.2 PlanValidityError extends), every error-carrying framework |
| `CognitivePrimitive` | primitives.ts | core/R5 | plan-standard (not directly consumed by Plan fields; referenced at §2.5 cross-framework notes re: AS CreateArtifactInput.primitive field populated by authoring program) |
| `Mode` | substrate | L1 (substrate §2) | plan-standard (§1 Identity `Mode = structural`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | plan-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | plan-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | plan-standard (§2.1 input W-ATOM, §2.2 output W-ATOM) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | plan-standard (§4.3 inherited gate references to metaframework axioms) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | plan-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10; string-typed this regen) | plan-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11; string-typed this regen) | plan-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9; string-typed this regen) | plan-standard (§1 Identity state rows, §5 Lifecycle transitions) |
| `Carrier` | substrate | L1 (substrate §9; string-typed this regen) | plan-standard (§6.1 carrier declaration) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12; string-typed this regen) | plan-standard (inherited via HR-Pl1 authoring-program invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13; string-typed this regen) | plan-standard (§6.8 operator-interface declaration) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14; string-typed this regen) | plan-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | plan-standard (§3.7 P8 empty-declaration basis; Mode-binding rule cited) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | plan-standard (§3.7 same basis) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | plan-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | plan-standard (not directly consumed; declared empty per §3.2 P7=0; custody row retained for substrate §12 consumer-registry completeness) |
| `JudgmentId` | substrate | L1 (substrate §6) | plan-standard (empty-declaration basis per MA-J4) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | plan-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | plan-standard (this file is an instance per HR6 output contract) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | plan-standard (sourceInputRef target per provenance §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | plan-standard (§8.2 dimension results schema reference) |
| `ArtifactPayload` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | plan-standard (§2.2 PlanArtifactContent rides as `ArtifactPayload.content`) |
| `ArtifactEmission` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | plan-standard (§6.11 carrier emission produces this W-ATOM; §2.2 PlanEmissionResult success value) |
| `CreateArtifactInput` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | plan-standard (§6.11 authoring program constructs at Plan→AS boundary) |
| `ArtifactEdgeKind` | artifact-standard | L3 (artifact-standard-v2-2 §2 + core/R5) | plan-standard (§6.11 dependency-edge reference note) |
| `DeclId` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), multi-instance-standard (IA1..IA* for per-declaration execution), framework-audit |
| `TypedAtomRef` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), domain standards (resolve against own R5 types), multi-instance-standard (wire-type check) |
| `RoleClassId` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), domain standards (declare role values), multi-instance-standard (read role) |
| `TierClass` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), domain standards (declare tier values), multi-instance-standard (read tier) |
| `PlanId` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), multi-instance-standard (reference planAnchorNodeId binding), framework-audit |
| `EpochMs` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal; producedAt timestamp) |
| `Milliseconds` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal; perSet.maxTime) |
| `PlanTopology` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), multi-instance-standard (runtime dispatch by topology) |
| `PlanShapePositional` / `PlanIntentPositional` / `PlanCapacityPositional` / `PlanLimitPositional` / `PlanLimitScope` / `PlanLimitKind` | plan-standard | L3 (this file §3.8 + core/R5) | plan-standard (internal), framework-audit |
| `CapacityBudget` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (shape), domain standards (declare values) |
| `FailsafeRule` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (shape), domain standards (declare values), multi-instance-standard (invoke at runtime) |
| `SplitAxisDescriptor` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (shape), domain standards (declare values) |
| `TypedAtomSchema` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (shape), domain standards (declare W-ATOM shapes) |
| `RenderContractDescriptor` | plan-standard | L3 (this file §2 + core/R5; pass-through slot) | plan-standard (shape declaration only), multi-instance-standard (runtime semantics, IA6), domain standards (fill instance) |
| `ValidateContractDescriptor` | plan-standard | L3 (this file §2 + core/R5; pass-through slot) | plan-standard (shape declaration only), multi-instance-standard (runtime semantics, IA6), domain standards (fill instance) |
| `RoleClassInstance` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal shape), domain standards (populate) |
| `DomainBinding` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (shape owner); instance values owned per-domain by domain standard (LIV-Standard, Research, etc.); multi-instance-standard (read at runtime); captured verbatim in PlanArtifactContent per PA9 |
| `DataFlowEdge` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), multi-instance-standard (runtime wire dispatch) |
| `Declaration` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal), multi-instance-standard (per-declaration execution) |
| `PlanShape` / `PlanIntent` / `PlanCapacity` / `PlanLimit` / `IntentEntry` / `CapacityEntry` / `SplitLineage` / `PerDeclLimit` / `PerSetLimit` / `AuthoringProgramRef` | plan-standard | L3 (this file §2 + core/R5) | plan-standard (internal) |
| `PlanArtifactContent` | plan-standard | L3 (this file §2.2 + core/R5) | plan-standard (internal), multi-instance-standard (reads via planAnchorNodeId), artifact-standard (carries as `ArtifactPayload.content`), observability / replay / audit |
| `PlanInput` | plan-standard | L3 (this file §2.1 + core/R5) | plan-standard (internal), authoring programs (construct at caller site: Builder, Research, etc.) |
| `PlanHandoffRuleInstance` | plan-standard | L3 (this file §6.2 + core/R5) | plan-standard (internal), framework-audit (X3 C5 captureShape check) |
| `PlanGateResult` | plan-standard | L3 (§4 + core/R5) | plan-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `PlanDimensionResult` | plan-standard | L3 (§4.4 + core/R5) | plan-standard (internal), framework-audit (SelfAuditRecord consumption) |
| `PlanCustodyRow` | plan-standard | L3 (§6.5 + core/R5) | plan-standard (internal), framework-audit (custody-check X2/X5) |
| `PlanValidityError` | plan-standard | L3 (§2 + core/R5) | plan-standard (internal); extends primitives.ts `AppError` |
| `PlanEmissionResult` | plan-standard | L3 (§2 + core/R5) | plan-standard (emission surface), authoring programs (consume at HR-Pl3 return) |

### §6.6 Provenance contract

Per MA-C4 + A-20 reference-default declaration: this file's `provenance` field (GeneratedFrameworkTemplate top-level) populates:

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.1' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.1' },
  generationTimestamp:      '2026-04-23T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',  // registry-archived MetaframeworkInput
  sourceInputValue:         undefined                       // by-value opt-in flag not set
}
```

Per A-20 reference-default: provenance stores reference to registry-archived input; by-value retention is opt-in. Not opted in at this cycle.

### §6.7 Carrier-applicability enforcement

Per substrate §9 (A-13) + v3-1-spec §3.5:

Plan carrier = `named` → `artifact-standard` v2.2. Applicability enforcement at handoff time:

- HR-Pl1 carrier applicability `['self', 'named']`: authoring program's own carrier (typically `named` for Builder/Research) ∈ set → applicable; all authoring-program carriers supported.
- HR-Pl2 carrier applicability `['self', 'named']`: domain standard's own carrier (typically `self` or `named`) ∈ set → applicable.
- HR-Pl3 carrier applicability `['named']`: Plan's own carrier is `named`; applies exactly; Plan cannot invoke HR-Pl3 when carrier is `self` or `none` (not applicable by declaration — this is Plan's only carrier-emission path).
- HR-Pl4 carrier applicability `['named']`: M-I consumer reads via AS `planAnchorNodeId`; requires Plan carrier = `named` (satisfied by §6.1).

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

Plan's operator-facing surface:

```
operatorInterface = {
  invocationEntrypoint: 'authoring-program composes PlanInput → validates PA1..PA12 → invokes AS v2.2 createArtifact at HR-Pl3',
  configurationInputs:  ['DomainBinding (per-domain)', 'authoringProgram.programId + programVersion', 'userId + turnId'],
  observableOutputs:    ['PlanEmissionResult (success: ArtifactEmission with planAnchorNodeId; failure: PlanValidityError with failedAxiom)'],
  errorContract:        'PlanValidityError codes: PLAN_INPUT_INVALID | PLAN_VALIDITY_FAILED | PLAN_EMISSION_REJECTED',
  extensibility:        'DomainBinding shape is Plan-owned; instance values per-domain; new domains added by declaring new DomainBinding instances — no Plan amendment required'
}
```

V5 verification: this operator interface is declaratively complete at v2.2 (every invocation path + configuration input + observable + error listed).

---

### §6.9 Handoff contracts (adjacent-framework call patterns)

Per metaframework-v3-1 §3.1 A6 Coupling axis: cross-framework handoff content resides here.

| Adjacent | Plan consumes | Plan emits | HR binding |
|---|---|---|---|
| authoring program (Builder, Research, etc.) | pre-plan inputs (user intent, turn context) + DomainBinding instance | `PlanArtifactContent` via AS v2.2 emission | HR-Pl1 (inbound); HR-Pl3 (outbound) |
| domain standard (LIV-Standard, Research, etc.) | `DomainBinding` instance values (role classes, tier limits, split-axis, failsafes, render/validate descriptors) | — | HR-Pl2 (inbound DomainBinding) |
| Artifact Standard v2.2 | AS's `ArtifactEmission` receipt after createArtifact invocation | `PlanArtifactContent` as `ArtifactPayload.content`; `framework.id = 'plan'`, `framework.version = '2.2'` | HR-Pl3 (outbound) + HR-Ar3 (AS receive-side) + HR-Ar4 (AS receipt) |
| Multi-Instance Standard | — | consumed by M-I via `planAnchorNodeId` (= `ArtifactEmission.writes.a7.artifactAnchorNodeId`) after AS emission lands in graph | HR-Pl4 (outbound) |
| Living Memory | — | PlanArtifact anchor + companion land in graph via AS v2.2's commit pipeline (Plan does not invoke Living Memory directly) | (via AS v2.2 HR-Ar2) |

### §6.10 Cross-framework atom flow

| Atom | Flow |
|---|---|
| `PlanInput` | authoring-program constructs → HR-Pl1 inbound → Plan validates |
| `DomainBinding` | domain-standard instance → `PlanInput.domainBinding` via HR-Pl2 inbound |
| `PlanArtifactContent` | Plan composes + validates → wrapped in `ArtifactPayload` → HR-Pl3 outbound to AS |
| `CreateArtifactInput` (AS v2.2) | authoring-program constructs at Plan→AS boundary with `payload.content = PlanArtifactContent` → AS v2.2 `createArtifact` receives |
| `ArtifactEmission` (AS v2.2) | AS emits → Plan's HR-Pl3 captures receipt → authoring-program receives `PlanEmissionResult { ok: true, data: ArtifactEmission }` |
| `planAnchorNodeId` | alias for `ArtifactEmission.writes.a7.artifactAnchorNodeId` | M-I consumes via HR-Pl4 outbound-contract |

### §6.11 Carrier relation (H5) and boundary notes

Plan `carrier = named → artifact-standard v2.2`. Plan declares **content only** (`PlanArtifactContent`). Plan does **not** emit carrier mechanics. Emission call pattern:

```
// authoring-program code (not Plan code):
const planContent: PlanArtifactContent = composePlan(planInput)      // authoring program's work
const validityResult = runPlanGates(planContent)                     // G-Pl1..G-Pl12 pre-emission
if (!validityResult.ok) return validityResult                         // return PlanValidityError; no AS invocation

const asInput: CreateArtifactInput = {                                // AS v2.2 type
  framework: { id: 'plan', version: '2.2' },                         // Plan's framework ref
  turnId:    planInput.turnId,                                        // verbatim from PlanInput
  userId:    planInput.userId,                                        // verbatim from PlanInput
  payload: {
    domain:        'plan',
    domainVersion: '2.2',
    schemaRef:     'PlanArtifactContent',
    content:       planContent                                        // Plan's PlanArtifactContent rides here
  },
  classificationNodeId: <from Cognitive Standard encodeLLM, same turn>,
  primitive:            <from Cognitive Standard encodeLLM, same turn>,
  confidence:           <from Cognitive Standard encodeLLM, same turn>,
  dependsOn:            planInput.preplanInputs.priorArtifactRefs ?? []
}

const emissionResult: CreateArtifactResult = createArtifact(asInput)  // AS v2.2 call
// emissionResult.ok ? data.writes.a7.artifactAnchorNodeId = planAnchorNodeId : map to PlanValidityError
```

**Cross-framework calibration points (spec §Cross-framework calibration requirement):**

| Plan reference site | AS v2.2 atom | Cycle-cross notes |
|---|---|---|
| §2.2 output ride-along | `ArtifactPayload.content: unknown` | AS v2.2 ArA7 verbatim-carry preserves `PlanArtifactContent` byte-identically |
| §2.5 consumed types | `ArtifactPayload`, `ArtifactEmission`, `CreateArtifactInput` | all three from `artifact-standard.types.ts` at cycle-1 output |
| §6.11 `CreateArtifactInput.framework.version = '2.2'` | AS v2.2 framework version | cycle-2 carrier pin (was `2.1` in v2.1) |
| §6.11 `CreateArtifactInput.dependsOn: NodeId[]` | AS v2.2 input.dependsOn[] | aligns with AS v2.2 ArA4d (dependency-edge-per-entry) |
| §6.5 custody row `planAnchorNodeId` | AS v2.2 `ArtifactEmission.writes.a7.artifactAnchorNodeId` | structural alias; Plan names the AS field at its Plan-facing consumer surface |
| §3.6 PA5 + PA9 immutability propagation | AS v2.2 ArA5 mutation-rejection | Plan's PA5 + PA9 are enforced via AS v2.2 ArA5 at the companion node (which holds full PlanArtifactContent payload) |
| §6.2 HR-Ar3 receive-side | AS v2.2 §6.2 HR-Ar3 | AS captures `payload.domain + payload.domainVersion + framework.id + framework.version`; Plan populates with `'plan' + '2.2' + 'plan' + '2.2'` |
| §6.2 HR-Ar4 receipt | AS v2.2 §6.2 HR-Ar4 | receipt-only; no captureShape either side |
| §5.6 failure mode `PLAN_EMISSION_REJECTED` | AS v2.2 `ArtifactError.code: 'ARTIFACT_*'` | Plan maps AS error codes to `PlanValidityError.code = 'PLAN_EMISSION_REJECTED'` |

**Boundary notes:**

- **Runtime-split prohibition** (v1.0 PA7 second clause, re-stated for audit trail): M-I does not split declarations at runtime (IA7c in Multi-Instance Standard). This is an M-I axiom, not a Plan axiom; not re-declared at Plan. Boundary: Plan guarantees split-at-emission (PA7 + PA10a); M-I guarantees no-split-at-runtime (IA7c). Together, splits never occur outside Plan's pre-emission phase.
- **Re-plan semantics** (PA5): re-planning produces a new `PlanArtifactContent` with a new `planId` and new `planVersion`. The new plan emits through AS v2.2 as a separate `createArtifact` invocation; AS v2.2 ArA4c creates a `kind: 'version'` edge from new plan anchor → prior plan anchor iff the tuple `(framework.id='plan', userId)` matches (which it does for re-plans by the same user). Re-plan version lineage is thus tracked at AS v2.2 graph level, not inside Plan.
- **Binding immutability** (PA9): AS v2.2 companion node holds the full `PlanArtifactContent` payload including `binding`. AS v2.2 ArA5 forbids post-emission mutation of companion node content. Therefore `content.binding` is immutable post-emission without a Plan-framework-specific axiom layer — AS v2.2 ArA5 is the enforcer. PA9 is still declared at Plan level because it scopes the invariant at Plan's domain (binding-captured-alongside-content), even though mechanical enforcement is at AS.

### §6.12 Phase D ContentClass classification for L4 program direct emissions

*Added Side-Quest Shot 4 (Phase D). Declares the ContentClass classification for L4 programs implementing Plan Standard when they emit substrate records via `'internal-derivation'` channel directly (outside the AS v2.2 carrier path declared in §6.11). Plan Standard's L4 implementation (F-plan slice) emits **two distinct record kinds** via `'internal-derivation'`, each receiving a different classification per content-kind discipline.*

**Classification — `plan-output` records: `'wearer-life'`.** F-plan emits `plan-output` / `plan-emitted` records carrying `identitiesWithRoles: [{role: 'agent', identity: userId}]` — the wearer as agent of the plan emission. These records participate in the cognition LIV extends per Manual SPEC-v13.4 Part I §"The phantom layer": records of wearer cognition (the wearer's planning) are `wearer-life` and enter LMA7 anchor-derivation candidate set.

**Classification — `pipeline-completed` records: `'system-introspection'`.** F-plan emits `pipeline-completed` records from `plan-pipeline.ts` carrying `identitiesWithRoles: [{role: 'pipeline', identity: jobId}, {role: 'project', identity: projectId}, {role: 'outcome', identity: outcome}]` — apparatus-identifiable roles only; no wearer-as-agent role. These records are apparatus pipeline-machinery completion metadata (the F-plan pipeline being a piece of apparatus); they belong to "records of LIV's own operation" per Manual SPEC-v13.4 phantom-layer addendum and are excluded from LMA7 anchor-candidacy by LMA13 construction.

**Two-kinds-of-record discipline.** The same L4 program (F-plan) writes both classes — the distinction is at the *record content kind*, not at the program identity. A record carrying wearer-as-agent is wearer-life; a record carrying only apparatus identifiers is system-introspection. This per-content-kind classification is the Phase D pattern that the per-Standard amendments operationalize.

**Distinguished from AS-carriered emissions.** Plan Standard's primary emission contract is the AS v2.2 carriered `PlanArtifactContent` (per §6.11) — that emission's ContentClass is owned by AS v2.5 §3.7 S3 derivation (declared `contentClass: 'wearer-life'`). The §6.12 declaration is for F-plan's direct internal-derivation writes that happen alongside the AS-carriered emission.

**Runtime callsites.**
- `src/features/F-plan/contract/plan-contract.ts` line ~181 (`writePlanOutput` function) — `plan-output` records → `'wearer-life'` (supersedes Shot 1 Phase A provisional `'system-introspection'`).
- `src/features/F-plan/app/plan-pipeline.ts` line ~464 (`pipeline-completed` write) — `pipeline-completed` records → `'system-introspection'` (ratifies Shot 1 Phase A provisional).

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "Plan's validity check is fully mechanical per §10 convention inherited from v2.1: invalid plan is not emitted; emission is rejected with a structured error naming the failed axiom. Every PA1..PA12 condition reduces to substrate §6.3 mechanical-criterion ground — reference resolution (PA2a, PA3, PA8, PA10b, PA11, PA12), structural property (PA1, PA2b, PA4a, PA4b, PA5, PA6, PA9, PA10a), cardinality + reference resolution (PA7). No judgment inputs consumed at validity time. Authoring-program's composition activity (which produces PlanArtifactContent from preplanInputs) is upstream of Plan's schema.input and thus outside Plan's judgment scope. MA-J4 emptyDeclared satisfied."
}
```

### §7.2 Axis status

`A7 Judgment` axis status: `emptyDeclared: true` with positive basis above. Gate coverage:

- **G-J1** (J-input-typing): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J2** (mechanical-criterion ground): vacuous per §7.1 empty set; passes as empty-set universal.
- **G-J3** (provenance for J-input): vacuous per §7.1 empty set.
- **G-J4** (J-axis emptyDeclared or non-empty): passes via `emptyDeclared: true` with declared basis.

### §7.3 Judgment provenance

Per metaframework §7.4: empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 67 framework-tier gates (52 inherited + 15 Plan-own): state = `not-yet-run` at this delivery.

First-run pending framework-audit invocation post-regen-cycle confirmation.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Identity | declared-complete | §1 populated; genesis §1.1 |
| X2 Custody | declared-complete | §6.5 every atom with owner + layer + consumers |
| X3 Coupling | declared-complete | §6.2 HRs with captureShape per MA-C3 |
| X4 Scope | declared-complete | §1 scope rows + §2 in/out |
| X5 Atom-ownership | declared-complete | §6.5 single owner per atom; no re-ownership |
| X6 Provenance | declared-complete | §6.6 reference-default per A-20 |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated |
| X9 Integration point | declared-complete | §7 cross-framework + HR-Pl3 AS v2.2 carrier |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=0 positive empty-declaration with basis citing substrate §8.3 |

All ten audit dimensions declaratively complete at delivery. Framework-audit first-run ratifies at post-cycle confirmation.

### §8.3 Last audit event

Not yet run. Regen-cycle-2 delivery is the first compilation of Plan v2.2; framework-audit X1..X10 execution scheduled after cycle confirmation.

### §8.4 Self-application basis

Plan does not self-apply (Plan's Mode is structural; it structures input into `PlanArtifactContent` output — it does not verify). Plan verification is external (framework-audit per HR3).

---

## §9 Change log

| From | Change | Source |
|---|---|---|
| v2.1 | Regenerated against metaframework-v3-1 via generation-procedure-v1-0 (L3 regen wave cycle 2 of 4). | spec-plan-regen-v3-1 (this cycle brief) |
| v2.1 | Seven-axis shell (A1–A7) adopted per metaframework-v3-1 §3.1 replacing v2.1's four-axis top-level shape (v2.1's four domain axes — Shape, Intent, Capacity, Limit — folded to Plan-local P1 Axis instances under A3 Structure per §3.3). | metaframework §3.1 binding |
| v2.1 | P8 empty-declaration with positive basis authored per substrate §8.3 (Mode = generative only) + §8.6 empty-declaration rule. v2.1 was silent on P8 status; v2.2 makes it explicit. | substrate §8.3 + §8.6 |
| v2.1 | Four HRs (HR-Pl1..HR-Pl4) declared with captureShape per substrate §8.2 amended P6. v2.1 declared handoff contracts in prose at §7.2; v2.2 elevates to declared HR instances with captureShape table. | substrate §8.2 amended + X3 C5 |
| v2.1 | R5 types file `plan-standard.types.ts` consumes `artifact-standard.types.ts` at §2.5 cross-framework calibration point (carrier pinned to AS v2.2). v2.1 referenced AS v2.1 at carrier declaration only; v2.2 adds explicit cross-framework type-import custody. | cycle calibration + AS v2.2 frozen input |
| v2.1 | Carrier pinned to Artifact Standard v2.2 (was v2.1). Cross-framework calibration point per spec. | AS v2.2 output of cycle 1 |
| v2.1 | Provenance field populated per metaframework §2.2 output schema (reference-default per A-20). v2.1 predated v3-1-spec schema. | metaframework §2.2 + A-20 |
| v2.1 | §6.5 custody table refreshed: added AS v2.2 consumed-types rows (ArtifactPayload, ArtifactEmission, CreateArtifactInput, ArtifactEdgeKind) + Plan-local R5 atom rows expanded to match types file declarations. | substrate SG3 |
| v2.1 | No axiom additions, deletions, or re-writes. PA1..PA12 (with PA2a/PA2b, PA4a/PA4b, PA10a/PA10b decomposed = 15 total) preserved verbatim per AxR3 additive discipline + spec §Constraints "no hygiene edits". | AxR3 + spec |
| v2.1 | No gate additions beyond 1:1 mapping from 15 axioms to G-Pl1..G-Pl12 (with PA2/PA4/PA10 decomposed gates per G-M1). v2.1 declared gate coverage at §11 prose; v2.2 elevates to typed G-Pl* suite with machine-form predicates per §4.2. | G-M1 + MA-V1 |
| v2.2 (fix-round-1) | fix-round-1: closes Phase 1 findings Ph1-03; file-shape conformance — A-18 nine-section compliance (§7 Cross-framework handoff folded into §6 Coupling as §6.9/§6.10/§6.11; §8 Judgment → §7; §9 Self-audit → §8; §10 Change log → §9; internal cross-references from §7.3 carrier content updated to §6.11). No axiom, gate, primitive, HR, custody, or semantic change. | spec-l3-fix-round-1 AM-03 + substrate-a18-excerpt.md §4 ruling |
| v2.2 (fix-round-2) | fix-round-2: closes Phase 2 finding Ph2-Plan-03; §1 Identity scopeOut row added (seven entries enumerating concerns owned by adjacent frameworks: domain-standard validity predicates, M-I runtime execution, AS emission mechanics, Living Memory graph physics, authoring-program pre-plan composition, LIV-Standard code/R4 wiring, B3 re-derivation post-beta). Mirrors AS §1 and M-I §1 scopeOut row shape. No axiom, gate, primitive, HR, custody, carrier, Mode, P8, or TypeScript change. Version unchanged (remains v2.2). | spec-l3-fix-round-2 AM-05 |
| v2.3 | 2026-05-19 (Side-Quest Shot 4, Phase D) | **ContentClass apparatus alignment, Phase D — Plan Standard.** Predecessor: v2.2 (fix-round-2). Ratified ground: substrate v1.8.3 §4.2 A-24 (Shot 1) + LM v3.4 LMA13 (Shot 2) + Manual SPEC-v13.4 phantom-layer addendum (Shot 3) + AS v2.5 §3.7 S3 Phase D declaration (Shot 4 sibling). **Δ-A:** §6.12 subsection added (Phase D ContentClass classification for L4 program direct emissions). Plan Standard's L4 implementation (F-plan slice) emits two distinct record kinds via `'internal-derivation'`, each receiving a different classification per content-kind discipline: `plan-output` records → `contentClass: 'wearer-life'` (records carry `{role: 'agent', identity: userId}` — wearer cognition); `pipeline-completed` records → `contentClass: 'system-introspection'` (records carry only apparatus identifiers — pipeline-machinery completion metadata). The two-kinds-of-record discipline is the load-bearing Phase D pattern: classification axis is record content kind, not program identity. **Δ-B:** §1 Identity version v2.2 → v2.3. **Δ-C:** Runtime sweep — two callsites: `src/features/F-plan/contract/plan-contract.ts:181` (`writePlanOutput`) changed from provisional `contentClass: 'system-introspection'` to ratified `contentClass: 'wearer-life'`; `src/features/F-plan/app/plan-pipeline.ts:464` (`pipeline-completed` write) ratified at `contentClass: 'system-introspection'` (no literal change; comment update only — Shot 1 provisional confirmed as correct classification by Phase D derivation). No axiom, gate, primitive, HR, custody, carrier, Mode, P7/P8, or TypeScript shape change. Additive per MA-L1 minor. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot4-pending'} | L0 pending |

---

**End of plan-standard-v2-3. Side-Quest Shot 4 (Phase D) amendment pending L0 confirmation.**
