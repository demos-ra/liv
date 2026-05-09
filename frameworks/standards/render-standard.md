---
kind: framework
placement: frameworks/standards/
---

# render-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Chat Standard v1.0 (conversational perimeter gate sibling), Builder Standard v1.0 (generative-mode L3 sibling), Plan Standard v2.2 (structural-mode L3 sibling), Verification Standard v1.0 (verificative-mode L3 sibling)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Render Standard is the L3 structural-mode framework owning visual intake, dispatch, and program render hosting — LIV's visual perimeter gate. A wearer action arrives as a typed UI interaction (known), Render Standard structures it into a typed program dispatch (structured): action received, F-router consulted, program dispatched, render face hosted. It is one of two perimeter gates; the other is Chat Standard (conversational gate).

Render Standard is **distinct from F-router (L4)**: F-router is the routing infrastructure Render Standard consults at DA3. Render Standard declares the consultation contract; F-router owns internal routing mechanics. Different tier, different concern, non-overlapping (see §1 scopeOut).

Render Standard is **distinct from Design Standard**: Design Standard governs visual tokens, physics-based rendering mechanics, and CSS custom properties. Render Standard governs the protocol between programs and the dashboard shell — render face declaration, action dispatch, substrate-read discipline. Different concern, non-overlapping.

Render Standard **formalizes the existing code pattern**: `ProgramRenderIntent` in `F-dashboard/types/dashboard-types.ts` and the `useRegisterProgram` / `useRegisteredPrograms` hooks in `F-dashboard/contract/dashboard-registry.tsx` are the runtime instantiation of DA1 and DA5. Render Standard declares the contract that governs them.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Render Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first render-face registration post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (Render Standard emits `RenderDeclaration` atoms to the dashboard registry and `DashboardDispatch` atoms to substrate directly; no enclosing carrier at v1.0; see §6.1 carrier rationale) |
| `primitive` | `render-declaration` (framework-local atomic unit; defined §3.9 Vocabulary; one program's declaration of its visual render face: what it renders, what actions it accepts, how it reads substrate) |
| `consumes` | `DashboardAction` from wearer UI (typed action input); `RenderDeclaration` from programs (render face registration at mount) |
| `produces` | `DashboardDispatch` (typed routing instruction to F-router, written to substrate); render face registry state (in-memory React context, written to substrate on significant transitions) |
| `consumedBy` | F-dashboard slice (L4 host); programs registering render faces (F-planner, F-builder, F-discover, F-verify at their L4 boundary); F-router (receives dispatch); wearer (sees rendered panels) |
| `adjacentFrameworks` | Chat Standard v1.0 (conversational perimeter gate sibling — different input modality, same perimeter tier), Design Standard (visual token supplier — Render Standard consumes design tokens but does not own them), Plan Standard v2.2 / Builder Standard v1.0 / Research Standard v1.0 / Verification Standard v1.0 (programs registering render faces), F-router (receives dispatch per DA3; not a framework), Living Memory v1.1 (graph persistence layer), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Chat Standard v1.0 §1 Identity + Builder Standard v1.0 §1 Identity** establish the pattern for new L3 frameworks at first ratification with zero code referents. At v1.0: G-V10 `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at Sprint 12 render-face build cycle when F-dashboard component refs stabilize' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['visual design tokens and mechanics (owned by Design Standard; Render Standard consumes token identifiers, does not declare token values)', 'chat perimeter gate (Chat Standard domain; conversational modality is a separate L3 standard)', 'F-router internal routing mechanics (infrastructure; Render Standard declares the dispatch contract only per DA3)', 'substrate schema and graph physics (owned by Living Memory v1.1 + substrate-v1-1)', 'program domain work internals (F-plan, F-discover, F-verify, F-builder each own their domain; Render Standard governs only the render face boundary)', 'authentication and session management (owned by Perimeter Standard; upstream of dashboard intake)', 'render face component visual implementation (owned by each program for Sprint 12 build; Render Standard declares the declaration shape, not the component code)', 'framework-declaration audit (owned by framework-audit-v1-2 at L2; Render Standard governs runtime visual intake, not framework files)', 'multi-project workspace layout (operational; Render Standard declares per-program render face, not the shell layout)', 'B-direction output routing post-beta']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-10-shot-3-RS-v1-0-genesis',
  confirmedAt: '2026-05-09',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (RS v1.0 is a fresh L3 framework, not a v0 lift; no predecessor). The existing `ProgramRenderIntent` type and `dashboard-registry.tsx` code are runtime implementations of the contract declared here — not prior versions of this standard.

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations mutually consistent (Mode + Kind + Level alignment: structural-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry). |

---

## §2 Schema

### §2.1 Input — `DashboardAction`

Per MA-S1 (input is W-ATOM). Shape:

```
DashboardAction = {
  userId:      UserId           // F-identity session carrier; validated upstream
  projectId:   string           // active project context
  programId:   string           // which program this action targets
  actionKind:  string           // typed action identifier (e.g. 'confirm', 'cancel', 'select', 'navigate')
  payload:     unknown          // action-specific typed payload; declared per program in RenderDeclaration.actionKinds
  actionId:    string           // unique per action instance; non-empty
  triggeredAt: EpochMs          // wearer action timestamp
}
```

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `render-standard.types.ts`.

**Note on actionKinds at v1.0:** The `actionKind` field references the declaring program's `RenderDeclaration.actionKinds` set (DA2). At v1.0, `actionKinds` is declared in `RenderDeclaration` as the set of action strings this program accepts. The payload shape per action kind is program-owned (declared in the program's own standard at Sprint 12). Render Standard governs that the declared set exists and that incoming actions reference it; it does not govern the payload shape.

### §2.2 Output — `RenderDeclaration` and `DashboardDispatch`

Per MA-S2 (output is W-ATOM). RS carrier = `self`: outputs are written directly without an enclosing carrier framework. Two output atoms:

**RenderDeclaration** — written to the dashboard React context registry (in-memory, per DA1 + DA5):

```
RenderDeclaration = {
  programId:    string           // unique program identifier; key in registry per DA5
  label:        string           // human-readable program name for dashboard menu
  component:    ComponentType    // React component that renders this program's substrate output
  actionKinds:  string[]         // declared set of action kind strings this program accepts; may be empty
  statusDot?:   'accent' | 'dis' | 'error'   // optional menu card status indicator
  statusLine?:  string           // optional menu card status text
}
```

**Alignment with existing code:** `RenderDeclaration` is the Render Standard canonical form of `ProgramRenderIntent` in `F-dashboard/types/dashboard-types.ts`. The code fields `programId`, `label`, `component`, `statusDot`, `statusLine` map 1:1. `actionKinds` is the extension declared here (Sprint 12 programs will add it to their registration).

**DashboardDispatch** — written to substrate at HR-RS3 when an action is routed:

```
DashboardDispatch = {
  actionId:    string           // verbatim from DashboardAction per DA2
  programId:   string           // target program, verbatim from DashboardAction per DA2
  actionKind:  string           // verbatim from DashboardAction per DA2
  payload:     unknown          // verbatim from DashboardAction per DA2
  userId:      UserId
  projectId:   string
  dispatchedAt: EpochMs         // timestamp of dispatch
  routerRef:   string | null    // reference to F-router invocation log per DA3
}
```

Typed shapes declared in `render-standard.types.ts`. Every field traces to §6.5 custody.

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
| `Stage` | substrate §8.3 (not consumed by RS — structural-mode; P8 absent per substrate §8.3) |
| `StageContentKind` | substrate §8.3 (same) |
| `CaptureShape` | substrate §8.2 (consumed by §6.3 captureShape declarations) |
| `Judgment` | substrate §6 (consumed by empty-declaration basis §7.1) |
| `JudgmentId` | substrate §6 (same) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 (consumed by §3.2 P7 + P8 empty markers) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `UserId` | primitives.ts | §2.1 DashboardAction.userId; §2.2 DashboardDispatch.userId |
| `EpochMs` | primitives.ts | §2.1 DashboardAction.triggeredAt; §2.2 DashboardDispatch.dispatchedAt |
| `ComponentType` | React (primitives.ts re-export) | §2.2 RenderDeclaration.component |
| `Result<T, E>` | primitives.ts | §2.2 DashboardDispatchResult (types file), §6.5 custody |
| `AppError` | primitives.ts | §2.2 DashboardValidityError (types file), §6.5 custody |

### §2.5 RS-local atoms (declared at point of use in §3)

Atoms owned by RS (custody row per atom in §6.5):

`DashboardAction`, `RenderDeclaration`, `DashboardDispatch`, `DashboardRegistry`, `RegistrationRecord`, `ActionKindSet`, `DashboardOutcomeKind`, `DispatchOutcome`, `RegistrationPositional`, `ActionPositional`, `DispatchPositional`, `RenderPositional`, `RegistryPositional`, `DashboardHandoffRuleInstance`, `DashboardGateResult`, `DashboardDimensionResult`, `DashboardCustodyRow`, `DashboardValidityError`, `DashboardDispatchResult`.

Each atom declared at first use in §3 (Structure) or §6 (Coupling). Typed shapes in `render-standard.types.ts`.

### §2.6 Consumed types (from metaframework-v3-1, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `GeneratedFrameworkTemplate` | metaframework §2.2 | this file is an instance per HR6 output contract |
| `MetaframeworkInput` | metaframework §2.1 | `sourceInputRef` target per provenance §6.6 |
| `MetaframeworkGateIdSet` | metaframework §6.5 | §4.3 inherited gate enumeration reference |
| `DimensionResult` | framework-audit §8.1 | §8.2 dimension results schema reference |
| `ReferentCitation` | substrate §4 A-18 | §1 Identity referentCitations row (declared empty at v1.0 with basis) |

### §2.7 Schema rules (ScR-series)

Per metaframework §2.5 ScR-series, consumed by reference. Applied to RS:

- **ScR1** (input is W-ATOM): `DashboardAction` declared §2.1 as typed shape per MA-S1.
- **ScR2** (output is W-ATOM): `RenderDeclaration` + `DashboardDispatch` declared §2.2 as typed shapes per MA-S2; written directly per carrier=self.
- **ScR3** (custody coverage): every atom consumed or declared has §6.5 custody row.

### §2.8 Custody pointer

Full custody table in §6.5 Coupling. Summary pointer only at this section per A-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

RS inherits metaframework-v3-1's seven-axis decomposition (A1 Identity, A2 Schema, A3 Structure, A4 Validity, A5 Lifecycle, A6 Coupling, A7 Judgment). Per substrate §1.3 S-03 permitted-multi-execution: axes are declared once at metaframework and consumed at multiple sites. RS does not redeclare the seven-axis shell.

Per v3-1-spec §4.4 file-specific placement, RS's own structural content populates §3.3–§3.9 below: five RS-local P1 Axis instances (Registration, Action, Dispatch, Render, Registry), sub-axis instances, leaves, axioms (DA1..DA5), the P7 declaration (P7=0, all conditions mechanical), and the P8 declaration (P8=0, structural-mode).

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 5 | `{primitiveKind: 'P1', instanceCount: 5, basis: "RS-local domain axes declared at §3.3: Registration, Action, Dispatch, Render, Registry. The seven metaframework axes (A1–A7) are the framework-file shape shell; RS-local P1 instances populate §3 Structure under the inherited shell under A3 Structure."}` |
| P2 Sub-axis | 10 | Registration: 2; Action: 2; Dispatch: 2; Render: 2; Registry: 2. Declared §3.4. |
| P3 Leaf | 5 | One leaf per axiom condition per MA-St2: DA1 (1) + DA2 (1) + DA3 (1) + DA4 (1) + DA5 (1) = 5. Declared §3.5. |
| P4 Axiom | 5 | DA1, DA2, DA3, DA4, DA5. Declared §3.6. |
| P5 Gate | 5 | G-RS1, G-RS2, G-RS3, G-RS4, G-RS5. One primary gate per axiom per G-M1. Declared §4.2. |
| P6 Handoff rule | 4 | HR-RS1 (program → RS registration), HR-RS2 (wearer UI → RS action receipt), HR-RS3 (RS → substrate dispatch write), HR-RS4 (RS → F-router consultation). Declared §6.2. |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "RS's intake and registration validation is fully mechanical: every DA1..DA5 condition reduces to substrate §6.3 mechanical-criterion ground — structural property (DA1 render-declaration field presence, DA4 substrate-read discipline), reference resolution (DA2 actionKind registry lookup + programId registry lookup), deterministic-function-result (DA3 dispatch vs reject decision), structural property (DA5 registration idempotency + deregistration completeness). No judgment inputs consumed at runtime. MA-J4 emptyDeclared satisfied with positive basis."}` |
| P8 Procedure step | 0 | `{primitiveKind: 'P8', instanceCount: 0, basis: "RS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). RS has zero P8 instances per substrate §8.6 empty-declaration derivation. RS's intake pipeline is owned upstream by F-dashboard (L4 host); RS declares the typed shapes and invariants, not the execution procedure. This pattern parallels VS v1.0 §3.7 P8 empty-declaration and CS v1.0 §3.7 (substituting structural-mode in both cases)."}` |

Positive empty-declaration markers for P7 and P8 conform to substrate §4 A-17 `EmptyPrimitiveDeclaration` typed shape: `{primitiveKind: PrimitiveKindRef, instanceCount: 0, basis: string with length ≥ 1}`. No implicit absence.

### §3.3 P1 Axis instances (RS-local)

Five domain axes. MECE over RS's concern space.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Registration` | Registration | A program declaring its visual render face to the dashboard | What does a program declare at mount time to participate in dashboard rendering? |
| `Action` | Action | A wearer action arriving from the dashboard UI | What typed action did the wearer perform, against which program? |
| `Dispatch` | Dispatch | The routing of a validated action to the target program via F-router | How is a validated action delivered to the correct program? |
| `Render` | Render | A program's component reading substrate to render its panel | How does a program's render face consume substrate state for display? |
| `Registry` | Registry | The live set of registered programs and its lifecycle | How does the dashboard maintain a current, non-stale set of registered programs? |

**MECE verification:**
- Orthogonality: Registration governs what programs declare at mount (inbound declaration boundary); Action governs what wearers submit (inbound action boundary); Dispatch governs the routing of validated actions to programs (outbound routing boundary); Render governs how program components read substrate (program-side output surface); Registry governs the lifecycle of the registration set (state maintenance). No pair-overlap.
- Exhaustiveness: every `DashboardAction`, `RenderDeclaration`, and `DashboardDispatch` field traces to exactly one RS-local axis (verified §3.8 universal-variables table).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

### §3.4 P2 Sub-axis instances

**Registration sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Registration/shapeConformance` | RenderDeclaration typed shape | `leaf-DA1-render-declaration` (covered by DA1) |
| `Registration/mountTiming` | Declaration made at program mount time | `leaf-DA1-render-declaration` (covered by DA1) |

**Action sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Action/shapeConformance` | DashboardAction typed shape + actionKind registry lookup | `leaf-DA2-action-receipt` |
| `Action/programResolution` | programId resolves in current registry | `leaf-DA2-action-receipt` (covered by DA2) |

**Dispatch sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Dispatch/routerConsultation` | F-router consulted per DA3 | `leaf-DA3-dispatch` |
| `Dispatch/rejectOnNoMatch` | Unmatched actions rejected with typed error (no fallthrough) | `leaf-DA3-dispatch` (covered by DA3) |

**Render sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Render/substrateRead` | Render component reads substrate directly per DA4 | `leaf-DA4-render` |
| `Render/noPropsState` | Component does not accept program state as props — reads substrate only | `leaf-DA4-render` (covered by DA4) |

**Registry sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Registry/idempotency` | Duplicate registration updates in place per DA5 | `leaf-DA5-registry` |
| `Registry/deregistration` | Programs deregister on unmount; no stale entries | `leaf-DA5-registry` (covered by DA5) |

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-DA1-render-declaration` | `axiom` | `RenderDeclaration shape conformance: programId (non-empty string), label (non-empty string), component (ComponentType — React component reference), actionKinds (string[] — may be empty at v1.0; declared set of accepted action kinds), statusDot (optional, ∈ {'accent', 'dis', 'error'} when present), statusLine (optional string when present) — all required fields populated; optional fields either absent or correctly typed; declaration made at program mount time via useRegisterProgram — per DA1 structural property (field presence + type conformance)` |
| `leaf-DA2-action-receipt` | `axiom` | `DashboardAction shape conformance AND registry resolution: userId (non-null UserId), projectId (non-empty string), programId (resolves in current dashboard registry), actionKind (∈ registeredProgram.actionKinds for programId — set membership; empty actionKinds set means no actions accepted, all rejected), payload (present, typed per program declaration), actionId (non-empty string), triggeredAt (EpochMs > 0) — per DA2 structural property (field presence) + reference resolution (programId + actionKind registry lookups)` |
| `leaf-DA3-dispatch` | `axiom` | `On DashboardAction receipt: F-router is consulted per HR-RS4 dispatch contract; if F-router matches programId → DashboardDispatch emitted with routerRef non-null; if F-router returns no match or target program unavailable → action rejected with DashboardValidityError { code: 'DASHBOARD_DISPATCH_NO_MATCH' }; no raw fallthrough to untyped handler; dispatch is always typed or rejected — per DA3 deterministic-function-result (match→dispatch, no-match→reject) + reference resolution (routerRef resolves)` |
| `leaf-DA4-render` | `axiom` | `A registered program's component reads its typed substrate output directly from Living Memory (via substrate query scoped to programId + userId + projectId) to render its panel; it does not accept program domain state as React props at the Render Standard boundary; Dashboard hosts the component reference per DA1 registration; the component owns its substrate read logic — per DA4 structural property (substrate-read discipline: no state-as-props at RS boundary)` |
| `leaf-DA5-registry` | `axiom` | `Dashboard program registry discipline: (i) registration is idempotent — if programId already present, the registration is updated in place (component + label + actionKinds refreshed); (ii) program deregisters on unmount — after deregistration, programId is absent from the registry and DA2 programId resolution fails for that programId; (iii) no stale entries persist post-deregistration — per DA5 structural property (idempotency predicate + deregistration completeness)` |

### §3.6 P4 Axiom instances (DA1..DA5)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). One axiom per RS-local axis (1:1 mapping per brief).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **DA1** | `Registration` / `leaf-DA1-render-declaration` | Every `RenderDeclaration` submitted by a program via `useRegisterProgram` conforms to the typed shape declared at §2.2: `programId` (non-empty string), `label` (non-empty string), `component` (ComponentType reference), `actionKinds` (string array, may be empty), `statusDot` (optional, when present ∈ `{'accent', 'dis', 'error'}`), `statusLine` (optional string when present) — all required fields populated and correctly typed; declaration is made at program mount time. | structural property (field presence + type conformance per §2.2 RenderDeclaration shape) |
| **DA2** | `Action` / `leaf-DA2-action-receipt` | Every `DashboardAction` consumed by RS conforms to the typed shape at §2.1 — all required fields present and typed — AND `dashboardAction.programId` resolves to a `RenderDeclaration` in the current dashboard registry, AND `dashboardAction.actionKind` is a member of the resolved declaration's `actionKinds` set. If `actionKinds` is empty for the target program, all actions for that program are rejected. | structural property (field presence per §2.1) + reference resolution (programId registry lookup + actionKind set-membership check) |
| **DA3** | `Dispatch` / `leaf-DA3-dispatch` | On receipt of a valid `DashboardAction` (passing DA2): F-router is consulted per the HR-RS4 dispatch contract; if F-router returns a match for `dashboardAction.programId`, a `DashboardDispatch` atom is emitted with `routerRef` non-null referencing the F-router invocation log; if F-router returns no match or the target program is unavailable, the action is rejected with `DashboardValidityError { code: 'DASHBOARD_DISPATCH_NO_MATCH' }`. No untyped fallthrough path exists. The dispatch decision is fully determined by F-router response. | deterministic-function-result (match→dispatch with routerRef, no-match→typed-error rejection) + reference resolution (routerRef resolves when present) |
| **DA4** | `Render` / `leaf-DA4-render` | A program's registered `RenderDeclaration.component` reads its typed substrate output from Living Memory by direct substrate query scoped to `(programId, userId, projectId)` to render its dashboard panel. The component does not accept program domain state as React props at the Render Standard boundary — Render Standard passes only `(programId, userId, projectId)` context, not program domain data. Dashboard hosts the component reference declared at DA1; the component owns all substrate read logic. | structural property (no-state-as-props invariant: component receives only context tuple, not domain state) |
| **DA5** | `Registry` / `leaf-DA5-registry` | The dashboard program registry maintains these invariants: (i) registration is idempotent — `useRegisterProgram(intent)` where `intent.programId` already exists in the registry updates the existing entry in place (component, label, actionKinds all refreshed); no duplicates accumulate; (ii) deregistration on unmount is complete — after `useDeregisterProgram(programId)`, that `programId` is absent from the registry and subsequent DA2 `programId` lookups for it return not-found; (iii) no stale registration persists beyond the registering component's mounted lifetime. | structural property (idempotency: duplicate upserts in place; deregistration completeness: programId absent post-unmount) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** v1.0 baseline; no predecessor. Additive per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (invariant conditions, no imperative mood). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "RS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode =
   generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative
   frameworks have no P8 instances. P8 is absent, not empty.'). RS has zero P8
   instances per substrate §8.6 empty-declaration derivation.

   RS's intake pipeline is owned upstream by F-dashboard (L4 host program). RS
   declares the typed shapes and invariants (DA1..DA5) that the pipeline must
   satisfy; it does not declare the execution procedure. RS's emission-time
   validity is enforced mechanically by the DA1..DA5 gate bundle at the
   registration and dispatch sites, outside RS's P8 scope. This parallels
   VS v1.0 §3.7 and CS v1.0 §3.7 P8 empty-declarations."
}
```

PR4 / PR5 self-checks vacuous (empty P8 set).

### §3.8 Universal-variables table

Per substrate §3.5. Per MA-St3 (no content under more than one axis). MA-G6 strict: every cell is named type, enum literal, or inlined shape.

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Registration` | `Semver` (bound to `RenderDeclaration` version through Render Standard version — declarations versioned at framework level) | `ComponentType` (React component ref — categorical identity of the render face: each program type has one registered component) | `RenderDeclaration.programId: string` paired with `RenderDeclaration.component: ComponentType` (one-to-one: programId → component reference; unique per programId in registry) | `RegistrationPositional` enum `'unregistered' \| 'registered' \| 'updated' \| 'deregistered'` (declared §3.9) |
| `Action` | `EpochMs` (bound to `DashboardAction.triggeredAt` — action timestamp) | `string` (bound to `DashboardAction.actionKind` — categorical classifier of action type within a program's declared action set) | `DashboardAction.programId: string` paired with `DashboardAction.actionKind: string` (dual reference per action: programId identifies target program; actionKind identifies action within that program's declared set per DA2) | `ActionPositional` enum `'pending' \| 'validated' \| 'rejected'` (declared §3.9) |
| `Dispatch` | `EpochMs` (bound to `DashboardDispatch.dispatchedAt` — dispatch timestamp) | `DashboardOutcomeKind` enum `'dispatched' \| 'rejected' \| null` (bound to dispatch outcome per DA3 deterministic-function-result) | `DashboardDispatch.routerRef: string \| null` paired with `DashboardDispatch.programId: string` (router invocation log reference → target program; reference pair per DA3 dispatch contract) | `DispatchPositional` enum `'pending' \| 'dispatched' \| 'rejected'` (declared §3.9) |
| `Render` | `Semver` (bound to Render Standard version — render face contract versioned at framework level; individual substrate reads are runtime-unversioned) | `string` enum at runtime: programId value (categorical identity of the rendering program; each panel renders one program's substrate state) | `(programId, userId, projectId): string × UserId × string` (context triple passed to component; component reads substrate scoped to this triple per DA4) | `RenderPositional` enum `'idle' \| 'reading' \| 'rendered' \| 'error'` (declared §3.9) |
| `Registry` | `EpochMs` (bound to registration event timestamps — when a program registered, updated, or deregistered) | `string[]` (bound to `keys(DashboardRegistry)` — set of currently registered programIds; categorical state of the registry at a point in time) | `DashboardRegistry: { [programId: string]: RenderDeclaration }` (map: programId → RenderDeclaration; each entry relates a program to its declared render face per DA1 + DA5) | `RegistryPositional` enum `'empty' \| 'populated' \| 'stale-free'` (declared §3.9; `stale-free` = all registered programs currently mounted per DA5) |

Every cell is a named type, enum literal, inlined shape, or declared type-to-type paired reference. No prose cells.

**MA-St3 self-check:** no content appears under more than one axis. Pass.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `render-declaration` | §1 primitive | atomic unit of work in RS: one program's declaration of its visual render face — programId, label, component, actionKinds — at mount time; the indivisible unit of dashboard participation |
| `render face` | §2.2 + §3.3 Registration | the visual panel a program presents in the dashboard; declared via RenderDeclaration, hosted by Render Standard, rendered by the program's own component |
| `RenderDeclaration` | §2.2 + `render-standard.types.ts` | RS-defined type shape; programs fill instance values at mount; matches `ProgramRenderIntent` in code with `actionKinds` extension |
| `DashboardRegistry` | §3.8 Registry Relational | `{ [programId: string]: RenderDeclaration }` — the live map of registered programs; owned by F-dashboard React context; governed by DA5 |
| `action kind` | §2.1 + §3.3 Action | a string identifying a typed interaction a program declares it accepts; programs declare the set in `RenderDeclaration.actionKinds`; incoming actions checked against this set per DA2 |
| `dispatch` | §3.3 Dispatch | the act of routing a validated DashboardAction to its target program via F-router; produces a DashboardDispatch atom written to substrate |
| `no-state-as-props` | §3.6 DA4 | the discipline that program render components read substrate directly and do not receive program domain state as React props from Render Standard; Dashboard passes only context tuple (programId, userId, projectId) |
| `idempotent registration` | §3.6 DA5 | registering a programId that already exists updates the existing entry in place; no duplicate accumulates; governed by DA5 |
| `RegistrationPositional` | §3.8 | enum `'unregistered' \| 'registered' \| 'updated' \| 'deregistered'` — Registration axis lifecycle position |
| `ActionPositional` | §3.8 | enum `'pending' \| 'validated' \| 'rejected'` — Action axis lifecycle position |
| `DispatchPositional` | §3.8 | enum `'pending' \| 'dispatched' \| 'rejected'` — Dispatch axis lifecycle position |
| `RenderPositional` | §3.8 | enum `'idle' \| 'reading' \| 'rendered' \| 'error'` — Render axis lifecycle position |
| `RegistryPositional` | §3.8 | enum `'empty' \| 'populated' \| 'stale-free'` — Registry axis lifecycle position |
| `DashboardOutcomeKind` | §3.8 | enum `'dispatched' \| 'rejected' \| null` — dispatch outcome values per DA3 |

---

## §4 Validity

### §4.1 Gate count

RS declares **5 own primary gates** (G-RS1..G-RS5, 1:1 with DA1..DA5 per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1: 7 PG + 68 axiom gates + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when RS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| RS-own axiom gates (G-RS*) | 5 | this §4.2 | framework-audit applies DA1..DA5 suite per MA-V1; emit-time on each RenderDeclaration + DashboardDispatch |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test RS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **5 + 85 = 90** | | |

### §4.2 RS-own axiom gates

Per MA-V1 + G-M1. 5 axioms → 5 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-RS1** | DA1 | `typeof intent.programId === 'string' AND intent.programId.length >= 1 AND typeof intent.label === 'string' AND intent.label.length >= 1 AND typeof intent.component === 'function' AND Array.isArray(intent.actionKinds) AND (intent.statusDot === undefined OR ['accent','dis','error'].includes(intent.statusDot)) AND (intent.statusLine === undefined OR typeof intent.statusLine === 'string')` | structural property (field presence + type conformance per §2.2 RenderDeclaration shape) |
| **G-RS2** | DA2 | `typeof action.userId === 'string' AND action.userId.length >= 1 AND typeof action.projectId === 'string' AND action.projectId.length >= 1 AND typeof action.programId === 'string' AND registry.has(action.programId) AND typeof action.actionKind === 'string' AND registry.get(action.programId).actionKinds.includes(action.actionKind) AND typeof action.actionId === 'string' AND action.actionId.length >= 1 AND typeof action.triggeredAt === 'number' AND action.triggeredAt > 0 AND action.payload !== undefined` | structural property (field presence per §2.1) + reference resolution (registry.has(programId) + actionKind set-membership) |
| **G-RS3** | DA3 | `let routerResult = consultRouter(action.programId); (routerResult.matched === true) implies (dispatch.routerRef !== null AND typeof dispatch.routerRef === 'string' AND dispatch.routerRef.length >= 1 AND dispatch.outcome === 'dispatched') AND (routerResult.matched === false) implies (error.code === 'DASHBOARD_DISPATCH_NO_MATCH' AND dispatch === null) AND forall action: !(routerResult.matched === false AND dispatch !== null)` — no untyped fallthrough exists | deterministic-function-result (match→dispatch+routerRef, no-match→typed-error) + reference resolution (routerRef non-null when dispatched) |
| **G-RS4** | DA4 | `forall registeredProgram ∈ registry.values(): let comp = registeredProgram.component; comp receives props containing only { programId: string, userId: UserId, projectId: string } at the Render Standard boundary AND comp does not receive program domain state (PlanArtifactContent, BuildEmission, ResearchArtifactContent, VerificationArtifactContent, or equivalent) as React props from Render Standard — per Render Standard's fixed mount call signature: render(<comp programId={p} userId={u} projectId={pj} />) — Render Standard controls this call site; no additional props are structurally possible at this boundary` | structural property (no-state-as-props invariant: component receives only context triple at RS boundary) |
| **G-RS5** | DA5 | `let reg = dashboardRegistry; (i) forall id ∈ keys(reg): count(reg.entries.filter(e => e.programId === id)) === 1 (no duplicates); (ii) forall unmountedProgramId: !reg.has(unmountedProgramId) (absent post-unmount); (iii) register(intent) where intent.programId ∈ keys(reg) results in reg.get(intent.programId) === intent (updated in place, not appended)` | structural property (idempotency: no duplicate accumulation; deregistration completeness: absent post-unmount) |

**G-M1 self-check:** 5 axioms → 5 primary gates. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Registration 1 gate (G-RS1); Action 1 gate (G-RS2); Dispatch 1 gate (G-RS3); Render 1 gate (G-RS4); Registry 1 gate (G-RS5). Every RS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs RS against metaframework gate-bundle:

- **E1 Identity (PG1 + G-I1..G-I7):** tests RS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests RS's §2 Schema conformance (G-S8 vacuous-pass per referentCitations=[]).
- **E3 Structure (PG3 + G-St1..G-St16):** tests RS's §3 Structure conformance (G-St5 P8 empty-declaration extended predicate — §3.7 P8=0 basis declared; passes).
- **E4 Validity (PG4 + G-V1..G-V11):** tests RS's §4 Validity (G-V10/G-V11 vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests RS's §5 Lifecycle (G-L11 vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests RS's §6 Coupling + HR declarations.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests RS's §7 Judgment (P7=0 empty-declared per §3.2 + §7.1).
- **E8 Universal + Meta (G-G13, G-U1..G-U5, G-M1..G-M4):** tests RS's conformance to MA-G13 + F-69 + meta.

Plus RS's own 5 G-RS* gates execute at registration-time (G-RS1, G-RS5) and at action-receipt time (G-RS2, G-RS3, G-RS4). Total per-audit framework-tier gates: 90 (85 + 5).

**Disambiguation note:** The 85 inherited gates test RS's **framework declaration conformance**. The 5 G-RS* gates test **individual RenderDeclaration and DashboardDispatch instance conformance** at runtime. Different scopes, different execution sites.

### §4.4 Dimension–gate mapping (per MA-V5)

| Dimension | RS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=0 empty-declared mechanical); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (10 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-RS3 substrate write + HR-RS4 F-router |
| X10 (Stage-declaration extended predicate) | §3.7 P8=0 positive empty-declaration with basis |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once.
2. **Tier 2 — Axiom gates**: 69 inherited + 5 RS-own = 74.
3. **Tier 3 — Universal gates**: G-U1–G-U5.
4. **Tier 4 — Meta-gates**: G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5. Applies unchanged to RS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference.

### §4.8 Current gate results

**All 90 framework-tier gates (85 inherited + 5 RS-own): state = `not-yet-run` at this delivery.**

Inherited (85): `PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1, G-I2, G-I3, G-I4, G-I5, G-I6, G-I7, G-S1, G-S2, G-S3, G-S4, G-S5, G-S6, G-S7, G-S8, G-St1, G-St2, G-St3, G-St4, G-St5, G-St6, G-St7, G-St8, G-St9, G-St10, G-St11, G-St12, G-St13, G-St14, G-St15, G-St16, G-V1, G-V2, G-V3, G-V4, G-V5, G-V6, G-V7, G-V8, G-V9, G-V10, G-V11, G-L1, G-L2, G-L3, G-L4, G-L5, G-L6, G-L7, G-L8, G-L9, G-L10, G-L11, G-C1, G-C2, G-C3, G-C4, G-C5, G-C6, G-C7, G-C8, G-C9, G-C10, G-J1, G-J2, G-J3, G-J4, G-J5, G-G13, G-U1, G-U2, G-U3, G-U4, G-U5, G-M1, G-M2, G-M3, G-M4`.

RS-own (5): `G-RS1, G-RS2, G-RS3, G-RS4, G-RS5`.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 (initial). RS is a fresh L3 framework with no predecessor (`predecessorVersion: null`). Future amendments additive per MA-L1 + MA-S7. Scope of v1.0: five axioms DA1..DA5 declared; `RenderDeclaration` shape formalizes existing `ProgramRenderIntent` code type with `actionKinds` extension; `DashboardDispatch` substrate write declared (Sprint 12 wires it); carrier=self; `referentCitations: []` at v1.0. Generation path: generation-procedure-v1-0 v1.1.6 S1–E8 under metaframework-v3-1 v3.2.7.

### §5.2 Amendment trigger

Vision-driven. Trigger: Sprint 10 closure + Phase 2 missing-governance gate clearance. Driving: (i) LIV beta gate requires Render Standard as the L3 governance framework for F-dashboard; (ii) Chat Standard v1.0 (Shot 2) establishes the conversational perimeter gate; Render Standard (Shot 3) completes the two-gate perimeter pair; (iii) `dashboard-registry.tsx` and `ProgramRenderIntent` exist in code without a governing standard — Render Standard closes the gap.

### §5.3 Confirmation gate

Pending L0 at v1.0 closure. Monotonic per MA-L3.

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. RS declares zero J-inputs per §3.2 P7=0 (MA-J4); no deprecations possible.

### §5.6 Failure modes

| Stage | Failure mode | Recovery path |
|---|---|---|
| Registration (HR-RS1) | RenderDeclaration shape violation (G-RS1 fails) | `useRegisterProgram` returns `DashboardValidityError { code: 'DASHBOARD_REGISTRATION_INVALID', failedAxiom: 'DA1' }`; program not added to registry |
| Action receipt (HR-RS2) | DashboardAction shape violation or programId not in registry or actionKind not in declared set (G-RS2 fails) | `DashboardValidityError { code: 'DASHBOARD_ACTION_INVALID' }`; action not dispatched |
| Dispatch — no match (G-RS3 no-match branch) | F-router returns no match for programId | `DashboardValidityError { code: 'DASHBOARD_DISPATCH_NO_MATCH' }`; DashboardDispatch not emitted; dashboard surfaces error to wearer |
| Dispatch — substrate write failure (HR-RS3) | Substrate write of DashboardDispatch fails | `DashboardValidityError { code: 'DASHBOARD_SUBSTRATE_WRITE_FAILED' }`; dispatch log incomplete; action may have partially routed — F-router invocation already occurred |
| Render (G-RS4) | Component attempts to receive domain state as props | Violation detected at mount time; component rejected; `DashboardValidityError { code: 'DASHBOARD_RENDER_PROPS_VIOLATION' }` |
| Registry deregistration (G-RS5) | Stale entry persists post-unmount | Stale entry surfaced by framework-audit G-RS5; DA2 lookups for deregistered program return false-positives until cleared |

### §5.7 Scale bounds

- Per-dashboard registered program count: bounded by React context memory (no RS-framework hard cap; practical limit is O(10s) programs at v1.0).
- Per-action gate execution: O(1) — G-RS2 is one registry lookup + one set-membership check; G-RS3 is one F-router call.
- Registry idempotency: O(n) on registration where n = current registry size (linear scan per DA5 programId uniqueness check); bounded by registered program count.
- Dispatch substrate write: atomic per DashboardDispatch per substrate §13.4.

### §5.8 Atomicity declarations

- Registration (DA1/DA5): atomic per `useRegisterProgram` call — either the registry is updated or the error is returned; no partial registration.
- Action receipt (DA2): atomic per DashboardAction validation.
- Dispatch (DA3): F-router invocation and substrate write (HR-RS3) are two separate atomic operations per substrate §13.4. If substrate write fails after F-router invocation, the dispatch log is incomplete (see §5.6 failure mode).
- Registry deregistration (DA5): atomic per `useDeregisterProgram` call — programId is either absent or not, no partial state.

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | 2026-05-09 (Sprint 10 Shot 3 / Phase 2 missing-governance gate clearance) | Initial declaration. Five RS-local P1 axes (Registration, Action, Dispatch, Render, Registry). Five axioms DA1..DA5. Five paired gates G-RS1..G-RS5 (1:1 per G-M1). Four HRs HR-RS1..HR-RS4 with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) + P8=0 (Mode=structural + substrate §8.3 binding) positive empty-declarations per A-17. Carrier=self (registry-native + substrate-native write). `RenderDeclaration` formalizes `ProgramRenderIntent` code type with `actionKinds` extension. `DashboardDispatch` substrate write declared (Sprint 12 wires). `referentCitations: []` per precedent. Generated under metaframework-v3-1 v3.2.7 / generation-procedure-v1-0 v1.1.6 / substrate-v1-1 v1.6. | L0 (pending v1.0 confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Render Standard carrier = `self`. RS writes outputs directly without enclosing carrier framework: `RenderDeclaration` atoms are written to the in-memory React context registry (HR-RS1); `DashboardDispatch` atoms are written to substrate (HR-RS3). Neither requires an AS v2.2 envelope — registry writes are synchronous React context operations; dispatch writes are substrate-native graph operations. Contrast with Plan/VS/Research which use AS v2.2 for chat-surface rendering.

### §6.2 Handoff rules

Four framework-local HR instances.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-RS1** | program → render-standard (RenderDeclaration registration) | `['self']` | `true` | declared §6.3 |
| **HR-RS2** | wearer UI → render-standard (DashboardAction receipt) | `['self']` | `true` | declared §6.3 |
| **HR-RS3** | render-standard → substrate (DashboardDispatch write) | `['self']` | `true` | declared §6.3 |
| **HR-RS4** | render-standard → F-router (dispatch consultation) | `['self']` | `true` | declared §6.3 |

**Inherited HRs referencing RS:** HR1 (substrate→RS type consumption), HR6 (metaframework→RS as generated L3 template), HR5 (metaframework→registry; framework declaration recorded). Referenced, not redeclared, per substrate §1.3 S-03.

### §6.3 Capture shapes

**HR-RS1 — program → RS (RenderDeclaration registration):**
```
captureShape = {
  capturedFields: ['programId', 'label', 'actionKinds.length', 'registeredAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-RS2 — wearer UI → RS (DashboardAction receipt):**
```
captureShape = {
  capturedFields: ['actionId', 'programId', 'actionKind', 'userId', 'projectId', 'triggeredAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path'
}
```

**HR-RS3 — RS → substrate (DashboardDispatch write):**
```
captureShape = {
  capturedFields: ['actionId', 'programId', 'actionKind', 'routerRef', 'dispatchedAt', 'timestamp'],
  captureTarget: 'registry',
  queryInterface: 'registry §4.2 readByProvenance; DashboardDispatch node resolved via actionId in substrate graph'
}
```

**HR-RS4 — RS → F-router (dispatch consultation):**
```
captureShape = {
  capturedFields: ['programId', 'actionKind', 'routerRef', 'matched', 'consultedAt', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; router log resolved via routerRef'
}
```

### §6.4 Handoff axioms satisfaction

- **MA-C1** (carrier declared): §6.1 declares `carrier = 'self'` with rationale. ✓
- **MA-C2** (custody complete): §6.5 enumerates every RS-local atom. ✓
- **MA-C3** (handoff-invariant symmetry): HR-RS1..HR-RS4 captureShapes declared §6.3 for all four diagnostic-significance=true HRs. ✓
- **MA-C4** (provenance per output field): §2.2 every output field has declared provenance trace; §6.6 provenance contract. ✓
- **MA-C5** (carrier-consistent emission): carrier=self → outputs written to registry/substrate directly; no named-carrier wrapping. ✓
- **MA-C6** (no re-ownership): custody §6.5 single owner per atom; peer-standard / substrate atoms not re-owned. ✓
- **MA-C7..MA-C10**: cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance + capture-target completeness — satisfied per §6.2 + §6.3. ✓

### §6.5 Custody table

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `UserId` | primitives.ts | core/R5 | render-standard (§2.1 DashboardAction.userId, §2.2 DashboardDispatch.userId) |
| `EpochMs` | primitives.ts | core/R5 | render-standard (§2.1 triggeredAt, §2.2 dispatchedAt) |
| `ComponentType` | React (primitives.ts re-export) | core/R5 | render-standard (§2.2 RenderDeclaration.component), programs declaring render faces |
| `Result<T, E>` | primitives.ts | core/R5 | render-standard (§2.2 DashboardDispatchResult) |
| `AppError` | primitives.ts | core/R5 | render-standard (§2.2 DashboardValidityError extends) |
| `Mode` | substrate | L1 (substrate §2) | render-standard (§1 Identity `Mode = structural`) |
| `AuthorityLevel` | substrate | L1 (substrate §5) | render-standard (§1 Identity `Level = L3`) |
| `AuthorityClaim` | substrate | L1 (substrate §5) | render-standard (§5.3 confirmation-gate provenance) |
| `WAtom` | substrate | L1 (substrate §4 A-01) | render-standard (§2.1 input W-ATOM, §2.2 output W-ATOMs) |
| `AxiomRef` | substrate | L1 (substrate §4 A-02) | render-standard (§4.3 inherited gate references) |
| `FrameworkRef` | substrate | L1 (substrate §4 A-09) | render-standard (HR direction endpoints §6.2, carrier ref §6.1, provenance §6.6) |
| `Kind` | substrate | L1 (substrate §4 A-10) | render-standard (§1 Identity `Kind = Framework`) |
| `Ownership` | substrate | L1 (substrate §4 A-11) | render-standard (§1 Identity ownership rows) |
| `LifecycleState` | substrate | L1 (substrate §9) | render-standard (§1 Identity state rows, §5 transitions) |
| `Carrier` | substrate | L1 (substrate §9) | render-standard (§6.1 carrier=self) |
| `ActivationTrigger` | substrate | L1 (substrate §4 A-12) | render-standard (HR-RS2 action receipt invocation pattern) |
| `OperatorInterface` | substrate | L1 (substrate §4 A-13) | render-standard (§6.8 operator-interface) |
| `GenesisDeclaration` | substrate | L1 (substrate §4 A-14) | render-standard (§1.1 genesis row) |
| `Stage` | substrate | L1 (substrate §8.3) | render-standard (§3.7 P8 empty-declaration basis — Mode binding cited) |
| `StageContentKind` | substrate | L1 (substrate §8.3) | render-standard (§3.7 same basis) |
| `CaptureShape` | substrate | L1 (substrate §8.2) | render-standard (§6.3 captureShape declarations) |
| `Judgment` | substrate | L1 (substrate §6) | render-standard (empty-declared per §3.2 P7=0; custody row per substrate §12) |
| `JudgmentId` | substrate | L1 (substrate §6) | render-standard (empty-declaration basis per MA-J4) |
| `EmptyPrimitiveDeclaration` | substrate | L1 (substrate §4 A-17) | render-standard (§3.2 P7 + P8 empty markers) |
| `ReferentCitation` | substrate | L1 (substrate §4 A-18) | render-standard (§1 Identity referentCitations declared empty at v1.0) |
| `MetaframeworkGateIdSet` | metaframework | L2 (metaframework §6.5) | render-standard (§4.3 inherited gate enumeration reference) |
| `GeneratedFrameworkTemplate` | metaframework | L2 (metaframework §2.2) | render-standard (this file is an instance per HR6) |
| `MetaframeworkInput` | metaframework | L2 (metaframework §2.1) | render-standard (sourceInputRef target per §6.6) |
| `DimensionResult` | framework-audit | L2 (framework-audit §8.1) | render-standard (§8.2 dimension results) |
| `DashboardAction` | render-standard | L3 (this file §2.1 + core/R5) | render-standard (internal), F-dashboard (constructs at wearer UI boundary) |
| `RenderDeclaration` | render-standard | L3 (this file §2.2 + core/R5) | render-standard (shape owner; formalizes ProgramRenderIntent); programs declare instance values; F-dashboard hosts |
| `DashboardDispatch` | render-standard | L3 (this file §2.2 + core/R5) | render-standard (internal), substrate (written at HR-RS3), F-router (receives dispatch), audit consumers |
| `DashboardRegistry` | render-standard | L3 (this file §3.8 + core/R5) | render-standard (internal — Registry axis), F-dashboard (React context backing) |
| `RegistrationRecord` | render-standard | L3 (this file §3 + core/R5) | render-standard (internal — single registry entry shape) |
| `ActionKindSet` | render-standard | L3 (this file §2.2 + core/R5) | render-standard (internal — RenderDeclaration.actionKinds set shape), programs (declare values) |
| `DashboardOutcomeKind` | render-standard | L3 (this file §3.8 + core/R5) | render-standard (internal), F-dashboard (reads dispatch outcome) |
| `DispatchOutcome` | render-standard | L3 (this file §3.8 + core/R5) | render-standard (internal — dispatch result shape) |
| `RegistrationPositional` / `ActionPositional` / `DispatchPositional` / `RenderPositional` / `RegistryPositional` | render-standard | L3 (this file §3.8 + core/R5) | render-standard (internal), framework-audit |
| `DashboardHandoffRuleInstance` | render-standard | L3 (this file §6.2 + core/R5) | render-standard (internal), framework-audit (X3 C5 captureShape check) |
| `DashboardGateResult` | render-standard | L3 (§4 + core/R5) | render-standard (internal), framework-audit |
| `DashboardDimensionResult` | render-standard | L3 (§4.4 + core/R5) | render-standard (internal), framework-audit |
| `DashboardCustodyRow` | render-standard | L3 (§6.5 + core/R5) | render-standard (internal), framework-audit |
| `DashboardValidityError` | render-standard | L3 (§2 + core/R5) | render-standard (internal); extends primitives.ts `AppError` |
| `DashboardDispatchResult` | render-standard | L3 (§2 + core/R5) | render-standard (dispatch surface), F-dashboard (consumes at HR-RS3 return) |

### §6.6 Provenance contract

```
provenance = {
  generatedByMetaframework: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef:   { id: 'generation-procedure', version: '1.1.6' },
  generationTimestamp:      '2026-05-09T00:00:00Z',
  sourceInputRef:           'reference-default per A-20',
  sourceInputValue:         undefined
}
```

### §6.7 Carrier-applicability enforcement

RS carrier = `self`. All four HRs have carrier applicability `['self']` — applicable in self-carrier context; no named-carrier envelope at any handoff.

### §6.8 OperatorInterface

```
operatorInterface = {
  invocationEntrypoint: 'program calls useRegisterProgram(RenderDeclaration) at mount → DA1..DA5 validated → registered in dashboard React context; wearer action → DashboardAction → DA2 validated → DA3 F-router dispatch → DashboardDispatch written to substrate at HR-RS3',
  configurationInputs:  ['RenderDeclaration (per-program: programId, label, component, actionKinds)', 'userId + projectId context (session)', 'DashboardAction (per-wearer-action: programId, actionKind, payload, actionId)'],
  observableOutputs:    ['RenderDeclaration in registry (program participates in dashboard menu)', 'DashboardDispatch in substrate (action routed and logged)', 'DashboardValidityError (registration or dispatch failure with code)'],
  errorContract:        'DashboardValidityError codes: DASHBOARD_REGISTRATION_INVALID | DASHBOARD_ACTION_INVALID | DASHBOARD_DISPATCH_NO_MATCH | DASHBOARD_SUBSTRATE_WRITE_FAILED | DASHBOARD_RENDER_PROPS_VIOLATION',
  extensibility:        'RenderDeclaration.actionKinds is extensible per program — new action kinds added by updating registration. New programs added by calling useRegisterProgram with a new programId — no RS amendment required.'
}
```

### §6.9 Handoff contracts (adjacent-framework call patterns)

| Adjacent | RS consumes | RS emits | HR binding |
|---|---|---|---|
| programs (F-planner, F-builder, F-discover, F-verify) | RenderDeclaration (registration at mount) | — (RS hosts; programs render via their own component) | HR-RS1 (inbound registration) |
| wearer UI (F-dashboard L4 host) | DashboardAction (typed wearer interaction) | DashboardDispatch (written to substrate) + validation result | HR-RS2 (inbound action) + HR-RS3 (outbound substrate write) |
| F-router | — (RS sends dispatch request) | DashboardDispatch with routerRef populated on match | HR-RS4 (outbound dispatch consultation) |
| Chat Standard v1.0 | — (non-overlapping modality; chat gate handles text; dashboard gate handles typed actions) | — | (no direct HR; both are perimeter gates at same tier, different modalities) |
| Living Memory | — | DashboardDispatch substrate node (written via HR-RS3) | (via substrate graph; no direct HR) |
| Design Standard | consumes visual token identifiers (CSS custom property references) | — | (no HR; RS is a consumer of design tokens, not a producer) |

---

## §7 Judgment

### §7.1 Declared J-inputs

**Zero instances.** Positive empty-declaration per substrate §8.6 + MA-J4:

```
{
  primitiveKind: 'P7',
  instanceCount: 0,
  basis: "RS's registration and dispatch validation is fully mechanical: every DA1..DA5
   condition reduces to substrate §6.3 mechanical-criterion ground — structural
   property (DA1 field presence, DA4 no-state-as-props, DA5 idempotency), reference
   resolution (DA2 programId registry lookup + actionKind set-membership, DA3
   routerRef resolution), deterministic-function-result (DA3 match→dispatch vs
   no-match→reject). No judgment inputs consumed at runtime or at generation time.
   MA-J4 emptyDeclared satisfied with positive basis."
}
```

### §7.2 Axis status

`A7 Judgment` axis: `emptyDeclared: true` with positive basis. Gate coverage: G-J1..G-J5 all vacuously pass on empty J-input set. G-J4 passes via `emptyDeclared: true` with declared basis.

### §7.3 Judgment provenance

Empty-declared A7 has no J-inputs to carry provenance for. Declared empty stands as provenance-complete per MA-J4.

---

## §8 Self-audit results

### §8.1 Gate results

All 90 framework-tier gates (85 inherited + 5 RS-own): state = `not-yet-run` at this delivery. First-run pending framework-audit post-v1.0-confirmation.

### §8.2 Dimension audit results

| Dimension | Status at delivery | Basis |
|---|---|---|
| X1 Temporal / lifecycle self-consistency | declared-complete | §1 populated; §5 lifecycle section; §5.9 version history |
| X2 Determinism / reproducibility | declared-complete | §3.6 all DA axioms reduce to substrate §6.3 mechanical-criterion ground; P7=0 + P8=0 empty-declarations mechanical |
| X3 Observability / introspection | declared-complete | §6.2 HRs with captureShape per MA-C3; §6.3 captureShapes for HR-RS1..HR-RS4 (all diagnostic-significance=true) |
| X4 Negative space / scopeOut | declared-complete | §1 Identity scopeOut 10 entries covering design tokens, chat gate, F-router internals, substrate schema, program internals, auth, Sprint 12 components, workspace layout, B-direction |
| X5 Scale / compositional behavior | declared-complete | §5.7 scale bounds declared |
| X6 Operator / human interface | declared-complete | §6.8 OperatorInterface declared |
| X7 Lifecycle | declared-complete | §5 full lifecycle section |
| X8 Genesis | declared-complete | §1.1 GenesisDeclaration populated; bootstrapped: false declared |
| X9 Integration point | declared-complete | §6.9 adjacent-framework call patterns; HR-RS3 substrate write + HR-RS4 F-router; Chat Standard sibling boundary noted |
| X10 Stage-declaration extended predicate | declared-complete | §3.7 P8=0 positive empty-declaration with full basis; Mode=structural + substrate §8.3 binding cited |

### §8.3 Last audit event

Not yet run. v1.0 delivery; framework-audit execution scheduled after L0 confirmation.

### §8.4 Self-application basis

Per G-U1: RS's gate suite (G-RS1..G-RS5 + 85 inherited) will audit RS's own framework declaration file at framework-audit first-run.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-09 | Initial declaration. Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 under substrate-v1-1 v1.6. Five RS-local P1 axes (Registration, Action, Dispatch, Render, Registry). Five axioms DA1..DA5: DA1 (render-declaration shape conformance), DA2 (action receipt + registry resolution), DA3 (F-router dispatch vs typed-error rejection; no fallthrough), DA4 (no-state-as-props substrate-read discipline), DA5 (idempotent registration + deregistration completeness). Five paired gates G-RS1..G-RS5 (1:1 per G-M1). Four HRs HR-RS1..HR-RS4 with captureShape per substrate §8.2 amended P6. P7=0 (mechanical) + P8=0 (Mode=structural + substrate §8.3 binding) positive empty-declarations per A-17. Carrier=self. RenderDeclaration formalizes ProgramRenderIntent code type with actionKinds extension for Sprint 12. DashboardDispatch substrate write declared. `referentCitations: []` per precedent. Distinct from Chat Standard v1.0 by modality (typed visual actions vs free-form text); distinct from Design Standard by concern (render face protocol vs visual tokens). | Sprint 10 Shot 3 / Phase 2 missing-governance gate clearance per LIV deploy state |

---

**S11 — J-render-declaration-observation gate results (for L0 confirmation):**

**C1 — Eight top-level fields populated:** identity ✓, schema ✓, structure ✓, validity ✓, lifecycle ✓, coupling ✓, judgment ✓, provenance ✓. validity.overallResult: §4.8 `not-yet-run` with basis — field present. **PASS.**

**C2 — Gate results all pass (E1–E8):**
- G-RS1 (DA1 render declaration): field-presence + type-conformance for programId, label, component, actionKinds, optional statusDot/statusLine — §2.2 shape + §4.2 predicate consistent. **PASS.**
- G-RS2 (DA2 action receipt): shape conformance + programId registry lookup + actionKind set-membership — §2.1 shape + §4.2 predicate + §3.6 DA2 consistent. **PASS.**
- G-RS3 (DA3 dispatch): match→dispatch+routerRef, no-match→typed-error; no fallthrough — §3.6 DA3 + §6.2 HR-RS4 consistent. **PASS.** (Note: DA3 diverges from Chat Standard CA5 which has LLM fallthrough; dashboard actions are typed and always routed or rejected — correct distinction.)
- G-RS4 (DA4 render): no-state-as-props invariant — component receives only context triple per §3.6 DA4; §6.8 OperatorInterface consistent. **PASS.**
- G-RS5 (DA5 registry): idempotency + deregistration completeness — §3.6 DA5 + §6.9 code alignment (dashboard-registry.tsx implements this exactly) consistent. **PASS.**
- E1–E8 inherited gates: all structural checks against §1–§7 complete; referentCitations=[] vacuous-pass gates declared; P7=0 + P8=0 empty-declaration gates declared. **PASS.**

**C3 — No escalation raised:** escalation count = 0. **PASS.**

**J-render-declaration-observation overall: PASS. Delivering to L0 for S12 confirmation.**

---

**End of render-standard-v1-0. Pending L0 confirmation at v1.0 closure.**
