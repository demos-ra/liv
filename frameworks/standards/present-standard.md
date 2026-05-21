---
kind: framework
placement: frameworks/standards/
---

# present-standard-v2-0

**Kind:** Framework
**Level:** L2
**Mode:** epistemic (unknown → known)
**Version:** v2.0
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1
**Predecessor:** `present-standard.md` v1.0.1 (B3-lineage; the resident `frameworks/standards/present-standard.md` at repo HEAD `7f57ae1`). v2.0 is a major version bump per MA-L1 — the wearer-callable surface changes (the five-arm operation set is breaking-replaced by one parameterized operation).
**Cross-framework input:** substrate-v1-1 v1.8.3 (consumes A-24 ContentClass), Living Memory v3.5 (consumes LMA9 with the v3.5 `asOfPosition?` position-ceiling clarification + LMA13 + ThreadQueryInput.contentClass?/asOfPosition? optional filters), Perimeter Standard v1.2.1 (delegation per PS PA-IR3 for scope+userId access authority), Manual SPEC-v13.4 (Part I phantom-layer addendum + Canonical naming ContentClass row), LIV-Standard v1.5.2, Placement Standard v1.0
**Authority:** L0 ratification occurs AFTER build + build-tier audit (see §9 change log). v2.0 is built and build-audited before ratification — this document is a build artifact pending L0 confirmation.

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus self-audit results and change log per v3-1-spec §4.4 file-specific placement).

Present Standard is the L2 epistemic-mode framework governing F-present at L3. F-present is the runtime program that composes typed views over substrate state. **v2.0 re-derivation:** the wearer-callable surface is **one parameterized operation** — `present(standpoint, focus, ordering) → PresentView`. The v1.0.1 five operations (search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory) survive as **presets** — named configurations of the one operation — not as a typed five-arm enum. PresentView is a composed-view atom consumer-renderable without further composition (Manual L158 honored); Modality renders, F-ai-adapter passes, Generators consume — none re-compose.

Present Standard is **distinct from F-present (the L3 program it governs)**: Present Standard declares the typed shape that F-present produces — the contract and discipline; F-present at L3 executes against the contract. Present Standard is **distinct from Living Memory v3.5** (substrate-tier governance of state-change writes and read primitives at LMA9): LM declares the substrate-side primitives F-present consumes; Present Standard declares F-present's composition discipline + persistence-emission discipline over those primitives.

**v2.0 derivation basis.** This Standard is the build-tier conformance target for the re-derivation in `STEP-1-derive-corrected-rev2.md` (derive-tier audit PASS). That derivation re-declared F-present's domain as **wearer intent** (Phase two) rather than substrate primitive, derived the three independent dimensions of wearer-intent space (Phase three — D1 standpoint, D2 focus, D3 ordering), and ran a nine-cell grid (Phase four) that collapsed the operation set to one parameterized operation. The v1.0.1 five-operation closure (PrA5) was a closure over the substrate-primitive domain; it is not carried as a v2.0 premise. The re-derivation also identified an LM amendment dependency — the `asOfPosition?` position ceiling on the three LMA9 thread primitives (LM v3.4 → v3.5) — for Reading-A snapshot composition; the v2.0 standpoint dimension reads against that amended floor.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Present Standard` |
| `kind` | `Framework` (per substrate §4 A-10 Kind enum; consumed by reference; string-typed) |
| `mode` | `epistemic` (per substrate §2 Mode enum; `unknown → known`) |
| `level` | `L2` (per substrate §5 AuthorityLevel; governs L3 F-present program) |
| `version` | `2.0` (per substrate §7 Semver; v1.0.1 → v2.0 major per MA-L1 — the wearer-callable surface changes: the five-arm `WearerOperation` / `OperationParameter` unions are breaking-replaced by `PresentIntent` carrying three dimensions. A major bump because existing callers constructing the five-arm shape no longer type-check; the change is not field-additive. Predecessor `present-standard.md` v1.0.1 at `7f57ae1`, B3-lineage.) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `applied` (preserved from v1.0.1 `applied`; v2.0 is a contract re-derivation of an already-applied L3 program, not a re-genesis — F-present remains a live registered slice) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `sliceCategory` | `Tool` (per substrate §1.5 SliceCategory enum at six-value closure post-Manual SPEC-v13.3; F-surface sibling-precedent per Manual L287) |
| `carrier` | `self` (Present Standard's program F-present emits `PresentView` directly to consumer and `PresentViewEmission` directly to substrate per HR-PR-* set; no enclosing carrier framework per §6.1 + Builder Standard v1.0 §6.1 carrier=self precedent) |
| `primitive` | `view-composition` (framework-local atomic unit; defined §3.9 Vocabulary; one act of composing a typed view from substrate state at-read against a wearer-stated intent) |
| `consumes` | substrate-v1-1 v1.8.3 (A-09 Timestamp, A-12 FrameworkRef, A-17 P3/P4/P5 closure rules, A-18 StateChangeRecord + ReferentCitation + StateChangeId, A-24 ContentClass), Living Memory v3.5 (LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA9, LMA10, LMA12, LMA13; SubstrateWriteInput shape; SourceRef.channel/contentClass/scope fields; ThreadQueryInput.contentClass? + asOfPosition? optional filters; three LMA9 thread primitives identity-recurrence/role-pattern/adjacency), Perimeter Standard v1.2.1 (PA-IR3 scope+userId authority delegation), Manual SPEC-v13.4 (canonical-naming ContentClass row + Part I phantom-layer addendum + Operations Tool slot for F-present), metaframework-v3-1 v3.3.1 (GeneratedFrameworkTemplate output schema), generation-procedure-v1-0 v1.1.7 (S1–S12 generation procedure), LIV-Standard v1.5.2, Placement Standard v1.0 (P-A6 R5 placement for consumed atoms by reference) |
| `produces` | `PresentView` (W-ATOM; consumer-renderable composed-view atom; emitted to Modality/Generator/Tool consumers via HR-PR-Modality/HR-PR-Generator/HR-PR-AIAdapter) + `PresentViewEmission` (substrate state-change record; emitted via HR-PR-Substrate-Write per PrA3) |
| `consumedBy` | Modalities (F-chat, F-output, F-dashboard — render `PresentView` per Manual L158 without further composition); Generators (F-discover, F-plan, F-builder, F-verify — consume `PresentView` for generator-cycle inputs); Tools (F-ai-adapter — passes `PresentView` to LLM-using tool without further composition); observability, replay, audit consumers via `PresentViewEmission` substrate trail |
| `referentCitations` | RC array populated at v2.0 with 9 RCs. See §2.3 and §3.11 below for the full array. The v1.0.1 array's `PresentReadIntent`-citing RCs are re-cited against `PresentIntent`; no RC is dropped or added at v2.0 (the citing atoms re-name but the cited substrate/LM ground is unchanged). |
| `scopeOut` | `['runtime execution of view composition (owned by L3 F-present program; Present Standard declares the contract, not the executor)', 'substrate write mechanics and read-primitive implementation (owned by Living Memory v3.5)', 'scope/userId access authorization (owned by Perimeter Standard v1.2.1 per PA-IR3 delegation; Present Standard declares carry-through mechanics only per PrA4)', 'consumer-side session continuity / view-trail navigation logic (owned by consumer; Present Standard exposes one operation + persistent view-witness trail, not a continuity API)', 'view-rendering / surface concerns (owned by Modality per Manual L158)', 'LLM prompt composition (owned by F-ai-adapter)', 'framework-declaration audit (owned by framework-audit at L2)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.3.1' },
  generationSession: 'present-standard-rederivation-v2-0 (STEP-1-derive-corrected-rev2 → builder dispatch)',
  ratifiedAt: 'pending — L0 ratification occurs after build-tier audit',
  ratifiedBy: 'pending — L0:Demos'
}
```

### §1.2 Identity-axiom satisfaction

Per substrate §4 A-17 Identity-axis empty-declaration: Identity fields are mechanical declarations per substrate §4 (atom-typed value assignments); no jurisdictional commitment is carried at the Identity axis at Standard scope. G-I8 governsRuntimeCode = `true` (governs F-present at L3 runtime).

---

## §2 Schema

### §2.1 Own atom inventory

**PresentIntent** — the one wearer-call envelope (v2.0; replaces PresentReadIntent):

```
PresentIntent = {
  intentId:    IntentIdRef,
  consumerRef: FrameworkRef,           // F-chat | F-output | F-discover | F-plan | F-builder | F-verify | F-ai-adapter | ...
  userId:      UserIdRef,              // LMA12
  scopeRef:    ScopeRef,               // LMA6
  standpoint:  PositionRef | null,     // D1 — FROM WHERE. null = the live present (head); non-null = a Reading-A snapshot ceilinged at that chain position
  focus:       FocusSelector,          // D2 — LOOKING AT WHAT
  ordering:    OrderingSelector,       // D3 — ARRANGED HOW
  bound:       ViewBound,              // max records, walk budget — envelope parameter, not an intent dimension
  provenance:  OriginProvenance        // consumer-stamped origin
}

FocusSelector =
  | { kind: 'identity';      identity: IdentityRef                          }
  | { kind: 'identity-role'; identity: IdentityRef;  role: RoleRef          }
  | { kind: 'density';       rule?: 'identity-density' | 'position-density' }
// Three-arm discriminated union — D2 of wearer-intent space (rev2 derivation Phase three).

OrderingSelector = {
  axis:       'time' | 'identity' | 'role',
  direction?: 'forward' | 'backward'
}
// D3 of wearer-intent space. Structurally identical to PerspectiveDeclaration —
// the ordering dimension IS the view's perspective.

ViewBound = {
  maxNodes:    number,
  maxThreads:  number,
  walkBudget:  number
}
```

**Operation collapse (v2.0).** The v1.0.1 `WearerOperation` and `OperationParameter` five-arm discriminated unions are **removed**. The wearer-callable surface is one parameterized operation `present(standpoint, focus, ordering) → PresentView` — the function D1 × D2 × D3 → PresentView. The five v1.0.1 operations survive as **presets** (named configurations of the one operation), documented in §3.7 below. The preset relationship is recorded as supersession documentation per the residue-sweep discipline; no five-arm typed enum exists at v2.0.

**PresentView** — composed-view atom (consumer-renderable without further composition):

```
PresentView = {
  viewId:              ViewIdRef,
  derivedFromIntent:   PresentIntent,                  // v2.0: retyped from PresentReadIntent
  emittedAt:           Timestamp,

  composition: {
    nodes:        ViewNode[],
    threads:      ViewThread[],
    focus:        ViewNodeRef,
    perspective:  PerspectiveDeclaration
  },

  provenance: {
    sourceStateChangeIds:  StateChangeId[],
    readPrimitivesUsed:    ReadPrimitiveTrace[],
    anchorDerived:         AnchorTrace,
    weightingApplied:      WeightingTrace
  },

  reversibility: {
    appealCourtIs:       'substrate-state-change-table',
    replayDiscipline:    'invoke F-present with same PresentIntent → equivalent PresentView per PrA8'
  }
}
```

**PresentView structural note (v2.0).** PresentView's skeleton — composition / provenance / reversibility sub-shapes, and the ViewNode / ViewThread / PerspectiveDeclaration shapes — is preserved from v1.0.1. Two field-level changes are a structural consequence of the operation-set collapse: (1) `derivedFromIntent` is retyped `PresentReadIntent → PresentIntent`; (2) `provenance.operationApplied` (typed `WearerOperation` at v1.0.1) is **removed**. The v1.0.1 field recorded which of five operations ran; under v2.0 the verb layer has exactly one member (`present`), so the field would record a dimension with nothing behind it. Each dimension of wearer intent is recorded inside the shape via its own slot — standpoint via provenance (`ReadPrimitiveTrace.asOfPosition`) + the snapshot ceiling, focus via `provenance.anchorDerived`, ordering via `composition.perspective` — leaving no slot for `operation`. The v1.0.1 statement "PresentView shape unchanged" referred to structural invariance; under the operation collapse, referential invariance of the two operation-typed fields is not possible, and the corrected v2.0 statement is the one given here.

```
ViewNode = {
  identity:             IdentityRef,
  dominantSurfaceForm:  string,
  weight:               number,        // ∈ [0, 1]
  sourceCount:          number
}

ViewThread = {
  source:               IdentityRef,
  target:               IdentityRef,
  relationType:         IdentityRef,
  thickness:            number,        // ∈ [0, 1]
  sourceStateChangeIds: StateChangeId[]
}

PerspectiveDeclaration = {
  axis:       'time' | 'identity' | 'role',
  direction?: 'forward' | 'backward'
}

AnchorTrace = {
  source:      'wearer-content' | 'current-position' | 'system-derived',
  derivedAs:   { identity?: IdentityRef; role?: RoleRef; position?: PositionRef },
  rule?:       'identity-density' | 'position-density'   // populated iff source = 'system-derived'
}

ReadPrimitiveTrace = {
  primitive:    'identity-recurrence' | 'role-pattern' | 'adjacency' | 'iterate-axis',
  parameters:   <kind-specific per LMA9 primitive signatures>,
  recordCount:  number,
  contentClassFilter?: ContentClass,   // declared when ThreadQueryInput.contentClass? filter applied per LM LMA13
  asOfPosition?:       PositionRef     // v2.0: declared when the standpoint ceiling is applied per LM v3.5 LMA9 clarification
}

WeightingTrace = {
  weightMap:            { [ViewNodeRef]: number; [ViewThreadRef]: number },
  weightingBasis:       'option-C-v1.0',
  thresholdsApplied: {
    w_recur:  number,
    w_density: number,
    w_adj:    number
  }
}
```

**PresentViewEmission** — the substrate write F-present produces after view composition. Per PrA3 + §6.4: this is *not* a Present-local atom — it is a `SubstrateWriteInput` per LM v3.5 §2.1 with these specific population rules:

```
PresentViewEmission ≡ SubstrateWriteInput where:
  userId      = intent.userId
  identities  = [ viewId, intent.intentId, intent.consumerRef, intent.focus.kind ]
                // [3] is the focus kind as identity label — v2.0 replaces the v1.0.1
                // operation.kind label; the verb is now always `present`, so the focus
                // dimension is the stable identity label for what was emitted.
  relations   = []   // the emission is a presence record; structural information is
                     // encoded in identities + metadata.source
  time        = emittedAt
  source      = SourceRef {
    channel:       'internal-derivation',
    contentClass:  'system-introspection',   // per substrate v1.8.3 §4.2 A-24 + LM LMA13:
                                             // PresentViewEmissions are apparatus operational
                                             // metadata, excluded from LMA7 anchor-candidate set
    scope:         intent.scopeRef
  }
```

The emission is queryable by the one operation: a `present` call with `focus: {kind:'identity', identity: viewId}` or with the `consumerRef` as focus returns the view trail; per LMA13, queries wanting only the wearer-life record set pass `ThreadQueryInput.contentClass: 'wearer-life'`.

### §2.2 Consumed atoms (by reference)

All consumed atoms are substrate or LM atoms — no Present-local typing required for them. Per Placement Standard P-A6 + R5 placement, references-only.

| atom | source | role |
|---|---|---|
| `StateChangeRecord` | LM v3.5 §2.1 / substrate v1.8.3 §4 A-18 | substrate read return type |
| `SubstrateWriteInput` | LM v3.5 §2.1 | persistence emission shape |
| `IdentityRef`, `RoleRef`, `ScopeRef`, `UserIdRef`, `PositionRef` | LM v3.5 §3.12 + LMA5 | reference primitives |
| `Relation`, `IdentityWithRole`, `Modality` | LM v3.5 §2.1 LMA3 | typed relation shape |
| `SourceRef` | LM v3.5 §2.1 (channel + contentClass + scope three-field shape) | source metadata for persistence emission |
| `ContentClass` | substrate v1.8.3 §4.2 A-24 (canonical declaration) + LM v3.5 §3.12 vocabulary | closed two-value classification: `'wearer-life' \| 'system-introspection'` |
| `ThreadQueryInput` | LM v3.5 §2.1 (carries the `contentClass?` and `asOfPosition?` optional read-side filters) | substrate read primitive input shape |
| `FrameworkRef` | substrate v1.8.3 §4 A-12 | consumerRef typing |
| `Timestamp` | substrate v1.8.3 §4 A-09 | emittedAt typing |

### §2.3 ReferentCitation array (nine RCs)

9 RCs declared per substrate §4 A-18 schema. v2.0 re-cites the four `PresentReadIntent`-citing RCs (RC-01, RC-02, RC-04 — and RC-03, formerly citing `PresentReadIntent.currentPosition`, now cites `PresentIntent.standpoint`) against `PresentIntent`; the cited substrate/LM ground is unchanged. No RC is added or dropped — the count holds at 9.

| RC | citingAtom | referentKind | path |
|---|---|---|---|
| RC-01 | PresentIntent.userId | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 + LM v3.5 §2.1 (UserIdRef) |
| RC-02 | PresentIntent.scopeRef | `substrate-atom-ref` | LM v3.5 §2.1 (ScopeRef) |
| RC-03 | PresentIntent.standpoint | `substrate-atom-ref` | LM v3.5 §2.1 PositionRef (v2.0: re-cited from the v1.0.1 `currentPosition` field; same PositionRef ground) |
| RC-04 | PresentIntent.consumerRef | `substrate-atom-ref` | substrate v1.8.3 §4 A-12 FrameworkRef |
| RC-05 | PresentView.composition.nodes[].identity | `substrate-atom-ref` | LM v3.5 §3.12 IdentityRef |
| RC-06 | PresentView.provenance.sourceStateChangeIds | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 StateChangeId |
| RC-07 | PresentViewEmission.source.channel | `l0-ratified-ref` | LM v3.5 §2.1 SourceChannel union (`'internal-derivation'` member); ratified usage per the v2.0 derivation §closeout |
| RC-08 | PresentView.composition (full sub-shape) | `l0-ratified-ref` | the v2.0 derivation Phase four ratified composed-view atom shape (rev2 derivation §four output; PresentView confirmed one invariant shape) |
| RC-09 | PresentViewEmission.source.contentClass | `substrate-atom-ref` | substrate v1.8.3 §4.2 A-24 ContentClass closed-union + LM LMA13 |

**Citation hygiene (FLAG-2 carried from the derivation).** `present-spec-v4` is **not** cited as a resident repo artifact — it does not exist in the `7f57ae1` tree; the v1.0.1 Standard's `spec v4 §x` citations are not carried into v2.0. The parent dispatch brief `side-quest-present-rederive-brief.md` is likewise not cited as resident repo ground (it is a dispatch brief, not a committed file). RC-08, which at v1.0.1 cited `spec v4 §6.3`, is re-grounded on the rev2 derivation's Phase-four output — a resident, audit-PASSED artifact in the side-quest record. No v2.0 RC depends on a non-resident artifact.

### §2.4 Own atoms declared at point of use in §3 (vocabulary)

Framework-local terms declared at point of use per PR1 (substrate §10.2):

- `IntentIdRef` — declared §2.1 as PresentIntent.intentId; UUID-tagged ref to a wearer-stated intent
- `ViewIdRef` — declared §2.1 as PresentView.viewId; UUID-tagged ref to a composed view
- `ViewNodeRef` — declared §2.1 as PresentView.composition.focus; reference to a ViewNode by identity within composition.nodes
- `ViewThreadRef` — declared §2.1; reference to a ViewThread within composition.threads
- `PresentIntent` — declared §2.1 as the one wearer-call envelope carrying the three dimensions of wearer-intent space
- `FocusSelector` — declared §2.1 as the D2 focal-selector three-arm discriminated union
- `OrderingSelector` — declared §2.1 as the D3 ordering selector
- `ViewBound` — declared §2.1 as max-records + walk-budget shape
- `OriginProvenance` — declared §2.1 as consumer-stamped origin metadata
- `AnchorTrace`, `ReadPrimitiveTrace`, `WeightingTrace`, `PerspectiveDeclaration` — all declared §2.1 inline

---

## §3 Structure

### §3.1 Axes (inherited from metaframework-v3-1 §3.1.1 FrameworkConcernSpace)

Seven axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment.

Present Standard binds Standard-local axioms to five of seven axes; Identity and Judgment are empty-declared per substrate §4 A-17 with positive basis (§3.6.1 below).

### §3.2 Primitive instance counts

| Primitive (substrate §8.3) | Count | Basis |
|---|---|---|
| P1 P1-axis | 0 (empty-declared) | inherited axis set from metaframework §3.1.1 sufficient |
| P2 Sub-axis | 0 (empty-declared) | no Present-local sub-axis required |
| P3 Leaf | 1 (PresentViewEmission) | one substrate persistence emission shape declared §2.1 |
| P4 Axiom | 8 (PrA1–PrA8) | declared §3.6 |
| P5 Judgment template | 1 (J-intent-binding) | declared §7.1 (v2.0: renamed from J-operation-binding) |
| P6 Handoff rule | 6 (HR-PR-LM, HR-PR-Substrate-Write, HR-PR-PS, HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter) | declared §6.2 |
| P7 Gate | 8 (PrG1–PrG8) | declared §4.1 (1:1 with axioms per G-M1) |
| P8 Procedure step | 8 (PR1–PR8) | declared §3.7 |

Counts are preserved from v1.0.1 at every primitive. The v2.0 re-derivation changes the *content* of P4 (PrA5 re-derived), P5 (J-template re-derived), and P8 (PR1/PR3/PR4/PR5 re-derived); it changes no count. The operation collapse is a collapse of an enum *inside* the Structure axis, not a change to the axiom or procedure-step inventory.

### §3.3 P1 Axis instances

Empty-declared with positive basis per substrate §8.6: Present Standard inherits the seven-axis metaframework concern space. No Present-local axis decomposition required at v2.0.

### §3.4 P2 Sub-axis instances

Empty-declared with positive basis: no sub-axis decomposition required at v2.0.

### §3.5 P3 Leaf instances

One leaf: `PresentViewEmission` declared §2.1 — the substrate persistence emission shape that F-present produces after view composition (PR6). The emission is itself a `SubstrateWriteInput` per LM v3.5 §2.1 with Present-specific population rules.

### §3.6 P4 Axiom instances (PrA1–PrA8)

Eight axioms. Six are carried from v1.0.1 unchanged in substance (PrA1, PrA2, PrA3, PrA4, PrA7, PrA8). **PrA5 is re-derived** (the five-operation closure becomes the one-operation closure). **PrA6 is restated** against the LM v3.5 floor (three thread primitives + raw axis scan; `asOfPosition?` is a parameter on them, not a fourth primitive).

**PrA1 — Content-shape identity at composed-view-atom level (Schema axis).**

> Every wearer/LLM consumer of F-present reads the same composed-view atom shape (PresentView). PresentView.composition is consumer-ready: Modality renders without further composition (Manual L158); F-ai-adapter passes without further composition. No transformation layer exists between PresentView and consumer.

Standalone-evidence: declares the consumer-level shape commitment. Earn-its-place: removing it permits a future Modality to compose a different view-shape. Collapse: answers "what shape is the view?" definitively.

**PrA2 — Provenance-to-substrate completeness (Schema axis).**

> Every PresentView carries `provenance.sourceStateChangeIds` enumerating every substrate StateChangeId whose content contributed to any ViewNode or ViewThread. `provenance.readPrimitivesUsed` enumerates every substrate read primitive call made during composition. Replay against identical substrate snapshot produces field-equivalent PresentView per PrA8.

Standalone-evidence: declares auditability. Earn-its-place: removing permits views whose origin is not traceable to substrate. Collapse: distinct from PrA8 — PrA8 governs reproducibility, PrA2 governs traceability.

**PrA3 — Substrate-write closure at view-emission only (Coupling axis).**

> F-present writes to substrate exclusively as PresentViewEmissions via `source.channel: 'internal-derivation'` per LM v3.5 §2.1. F-present never modifies, supersedes, or revokes any source state-change. F-present writes no other channel.
>
> Every PresentViewEmission carries `source.contentClass: 'system-introspection'` per substrate v1.8.3 §4.2 A-24 + LM LMA13 — PresentViewEmissions are apparatus operational metadata, excluded from LMA7 anchor-derivation candidate-set by LMA13 construction.

Standalone-evidence: declares the only write F-present makes and its content-kind classification. Earn-its-place: both halves load-bearing — the channel clause prevents source-record revision; the contentClass clause prevents view-emission pollution of the LMA7 anchor-candidate set. Collapse: does not collapse into LMA1.

**PrA4 — Scope and userId carry-through (Coupling axis).**

> Every substrate read F-present invokes carries the intent's `userId` (LMA12) and `scopeRef` (LMA6). Every PresentViewEmission F-present writes carries the same userId and scopeRef. F-present applies these as read-filter and write-stamp mechanics; F-present does not authorize — Perimeter Standard v1.2.1 enforces (per PS PA-IR3 delegation).

Standalone-evidence: declares access-discipline mechanics. Earn-its-place: removing permits cross-user or cross-scope leakage. Collapse: PS enforces access at intake; PrA4 declares F-present's read/write-side conformance.

**PrA5 — Operation closure at one parameterized operation (Structure axis). — RE-DERIVED v2.0.**

> F-present's procedure exposes exactly **one wearer-callable operation**: `present(standpoint, focus, ordering) → PresentView`, the function over the three independent dimensions of wearer-intent space (D1 standpoint `PositionRef | null`, D2 focus `FocusSelector`, D3 ordering `OrderingSelector`). The procedure has zero callable paths exposing a wearer operation outside this one. The operation ranges over the full D1 × D2 × D3 product; every point in that product is a valid wearer intent and produces a PresentView.
>
> The five v1.0.1 operations (search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory) are **presets** — named configurations of the one operation, enumerated points in the parameter product — not callable operations and not a typed enum. The preset table is §3.7.

Standalone-evidence: declares the wearer-callable surface closure at one. Earn-its-place: removing it permits exposing arbitrary compositions of substrate primitives as separate wearer operations — which is exactly the v1.0.1 mis-domained surface the rev2 derivation eliminated (the v1.0.1 PrA5 closed the operation set over the *substrate-primitive* domain, never over wearer intent; four of the five operations were 1:1 with an LMA9 primitive). Collapse: distinct from PrA6 — PrA6 governs the substrate-read floor, PrA5 governs the wearer-callable surface. The v1.0.1 PrA5 "operation closure at five" is **not** carried as a v2.0 premise (rev2 derivation Phase four, guardrail 3 discharge).

**PrA6 — Substrate-read closure (Schema axis). — RESTATED v2.0.**

> F-present reads substrate exclusively via the LM v3.5 read primitives: the three LMA9 thread primitives (identity-recurrence, role-pattern, adjacency — each via `threadQuery` with the matching `threadKind`) and raw axis scan (`iterate_axis`). F-present does not introduce a substrate read primitive outside this set (LMA9 three-primitive closure). The `asOfPosition?` position ceiling F-present passes for a Reading-A snapshot (non-null standpoint) is a **parameter on the existing thread primitives** per the LM v3.5 LMA9 mechanical clarification — not a new primitive; PrA6's substrate-read closure is unchanged by the standpoint dimension.

Standalone-evidence: declares the read floor. Earn-its-place: removing permits ad-hoc substrate reads outside LMA9. Collapse: distinct from PrA5.

**PrA7 — Geometry-non-persistence with view-witness disambiguation (Lifecycle axis).**

> F-present stores no derived geometry between invocations. F-present's runtime is stateless: each PresentView is composed at-read against substrate state at the read snapshot. The PresentViewEmission F-present writes is *not* stored geometry — it is a first-class typed state-change. Future PresentView compositions read PresentViewEmission state-changes via the same LMA9 primitives as any other substrate content; no special cache, no special index.

Standalone-evidence: declares the no-cache discipline and the witness-vs-geometry distinction. Earn-its-place: both halves load-bearing. Collapse: distinct from PrA3 — PrA7 governs between-invocation state, PrA3 governs what writes happen.

**PrA8 — Anchor-and-weighting determinism (Validity axis).**

> For identical `PresentIntent` against identical substrate state at the read snapshot, F-present produces field-equivalent `PresentView` across composition.nodes, composition.threads, composition.focus, provenance.anchorDerived, provenance.weightingApplied, and (modulo distinct viewId + emittedAt) the PresentViewEmission content. Anchor derivation, weighting computation, and the focus/ordering/standpoint dispatch are pure functions of (intent, substrate state, declared thresholds).

Standalone-evidence: declares replay-discipline. Earn-its-place: removing permits non-deterministic view composition. Collapse: viewId + emittedAt are operationally non-deterministic by design; axiom scope excludes them.

### §3.6.1 Axiom-axis distribution per MFv3 §3.1.1 FrameworkConcernSpace

| axis | bound axioms | count |
|---|---|---|
| Schema | PrA1, PrA2, PrA6 | 3 |
| Structure | PrA5 | 1 |
| Validity | PrA8 | 1 |
| Lifecycle | PrA7 | 1 |
| Coupling | PrA3, PrA4 | 2 |
| Identity | — (empty-declared per substrate §4 A-17) | 0 |
| Judgment | — (empty-declared; J-intent-binding §7.1 governs incoming intent validation; J-axis-mece + J-axiom-dist consumed by reference) | 0 |
| **Total** | | **8** |

8 axioms across 5 active axes; distribution 3-1-1-1-2-0-0 preserved from v1.0.1. The PrA5 re-derivation re-states the one Structure-axis axiom; it does not move any axiom between axes. G-U3 axis-coverage gate satisfied.

### §3.7 P8 Procedure step instances (PR1–PR8)

Eight steps. The v2.0 re-derivation re-states PR1 (J-intent-binding over three dimensions), PR3 (anchor from focus + standpoint), PR4 (focus/ordering/standpoint dispatch + Reading-A ceiling), and PR5 (perspective from ordering); PR2/PR6/PR7/PR8 are unchanged in substance.

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **PR1** | 1 | 1 | `judgment-input` | PresentIntent | validated intent | `judgmentInputRef = 'J-intent-binding'` (§7.1) |
| **PR2** | 2 | 2 | `mechanical` | validated intent | authorized intent | `derivation = "PS handshake: confirm consumer-stamped userId + scopeRef per PrA4. Per PrA4: F-present applies mechanics, does not authorize — Perimeter Standard v1.2.1 PA-IR3 owns access enforcement."` |
| **PR3** | 3 | 2 | `mechanical` | authorized intent | anchor + AnchorTrace | `derivation = "per LMA7 + PrA8: derive the anchor from focus + standpoint. focus 'identity' → AnchorTrace{source:'wearer-content', derivedAs:{identity: focus.identity}}. focus 'identity-role' → AnchorTrace{source:'wearer-content', derivedAs:{identity, role}}. focus 'density' → seed AnchorTrace{source:'system-derived', derivedAs:{identity: userId}, rule: focus.rule ?? 'identity-density'}; the densest identity is crystallized at PR4 after the read. The standpoint dimension is carried for PR4 ceiling wiring; it does not change the anchor shape."` |
| **PR4** | 4 | 2 | `mechanical` | authorized intent + anchor | StateChangeRecord[] + ReadPrimitiveTrace[] | `derivation = "per PrA5 + PrA6 + LM v3.5 LMA9: dispatch keyed on the three dimensions. focus selects the read primitive — focus 'identity' → identity-recurrence(anchor.identity, scope, contentClass='wearer-life'); focus 'identity-role' → role-pattern(anchor.identity, anchor.role, scope, contentClass='wearer-life'); focus 'density' → identity-recurrence(userId seed, scope, contentClass='wearer-life') then crystallize the densest identity. READING-A WIRING: when intent.standpoint is non-null, every thread read this dispatch issues passes asOfPosition: standpoint — ceiling the read to the snapshot position (the substrate as it actually stood at that chain position); when intent.standpoint is null, no asOfPosition is passed — the live present. asOfPosition? is a parameter on the LMA9 thread primitives per LM v3.5; PrA6's substrate-read closure is unchanged. Log invocations as ReadPrimitiveTrace[] including contentClassFilter and asOfPosition per §2.1."` |
| **PR5** | 5 | 2 | `mechanical` | StateChangeRecord[] + traces | PresentView composition draft | `derivation = "per PrA1 + PrA8: compose ViewNode[] (identity-cluster per LMA5 cluster-at-read), ViewThread[] (typed relations per LMA3 between nodes), apply Option C weighting (w_recur=0.4, w_density=0.2, w_adj=0.4). Select focus per anchor. The composition.perspective IS the ordering dimension — PerspectiveDeclaration and OrderingSelector are structurally identical (axis + optional direction); no operation.kind dispatch. Emit WeightingTrace into PresentView.provenance."` |
| **PR6** | 6 | 2 | `mechanical` | composition draft | PresentView candidate + PresentViewEmission | `derivation = "per PrA3: write PresentViewEmission to substrate via writeStateChange (LM v3.5 §3.10 required operation). Populate per §2.1 PresentViewEmission shape: identities [viewId, intentId, consumerRef, focus.kind]; relations []; source = {channel:'internal-derivation', contentClass:'system-introspection', scope: intent.scopeRef}. Write atomic per LMA4. Stamp PresentView.provenance.sourceStateChangeIds with resulting StateChangeId."` |
| **PR7** | 7 | 3 | `gate-execution` | PresentView + PresentViewEmission | per-gate results PrG1–PrG8 + overall | `gates = [PrG1, PrG2, PrG3, PrG4, PrG5, PrG6, PrG7, PrG8]` (§4.1) |
| **PR8** | 8 | 5 | `mechanical` | gate-passed PresentView | emitted PresentView to consumer | `derivation = "per PrA1: emit PresentView via HR-PR-Consumer (one of HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter per consumerRef). Bound enforcement (ViewBound.maxNodes, ViewBound.maxThreads) applied at emission if not earlier."` |

Stage monotonicity: 1→2→2→2→2→2→3→5. Stage 4 absent (empty-declared per substrate §8.6). Stage-kind alignment: PR1 stage 1 judgment-input ✓; PR2–PR6 stage 2 mechanical ✓; PR7 stage 3 gate-execution ✓; PR8 stage 5 mechanical ✓.

**§3.7.1 Preset table — the five v1.0.1 operations as configurations of `present`.**

The five v1.0.1 operations survive as named presets — fixed configurations of `present(standpoint, focus, ordering)`. This table is supersession documentation per the v2.0 derivation (Phase four output: "the five v1.0.1 operations become presets (named configurations)"). The presets are not a typed enum and not callable surface; they are documented for migration and consumer guidance.

| v1.0.1 operation | v2.0 preset configuration of `present` |
|---|---|
| search-by-identity | `standpoint: null`, `focus: {kind:'identity', identity}`, `ordering: {axis:'identity'}` |
| search-by-role | `standpoint: null`, `focus: {kind:'identity-role', identity, role}`, `ordering: {axis:'role'}` |
| default-entry | `standpoint: null`, `focus: {kind:'density', rule}`, `ordering: {axis:'identity'}` |
| move-neighborhood | `standpoint: <position>`, `focus: {kind:'identity', identity}`, `ordering: {axis:'time'}` — position-anchored navigation is now the standpoint dimension, not a focus arm |
| move-trajectory | `standpoint: <position>`, `focus: {kind:'identity', identity}`, `ordering: {axis:'time', direction}` |

The v1.0.1 `move-*` operations used position-anchored substrate reads (adjacency, iterate-axis). Under v2.0, position-anchored navigation is expressed through the **standpoint** dimension (D1) — a `move` is a `present` call with a non-null standpoint — not through a separate focus arm. The focus-keyed read path (§3.7 PR4) issues the thread primitives ceilinged by standpoint; this is the rev2 derivation's Phase-three result that D1 (standpoint) and D2 (focus) are independent dimensions, with position-navigation belonging to D1.

### §3.8 Universal-variables table (per substrate §3.5)

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Schema` | PrA1 + PrA2 + PrA6 v2.0 (consumes substrate v1.8.3 + LM v3.5) | composed-view-atom kind + read-primitive enum + RC kind enum (RC-01..RC-09) | binds PresentView to PresentIntent + ReadPrimitiveTrace; binds RC-09 to substrate A-24 | atoms placed per Placement Standard R3+R5 |
| `Structure` | PrA5 v2.0 (operation set is one parameterized operation; five v1.0.1 operations are presets) | one-operation closure + three-dimension parameter product + procedure step kind enum | binds PR1–PR8 ordering + focus/ordering/standpoint dispatch | procedure steps positioned 1–8 |
| `Validity` | PrA8 v2.0 | determinism property kind | binds PresentIntent → PresentView function | PrG8 gate position in PR7 |
| `Lifecycle` | PrA7 v2.0 | between-invocation-state declaration + state transitions | binds runtime statelessness; binds PresentViewEmission as first-class state-change | F-present runtime placed at PR1–PR8 only |
| `Coupling` | PrA3 + PrA4 v2.0 | write-channel + access-discipline + contentClass kinds | binds F-present to substrate (write side per PrA3) + PS (auth per PrA4) + consumers (read side per HRs) | HRs declared §6.2 |

### §3.9 Vocabulary

- `view-composition` — primitive atomic unit (§1); one act of composing a typed view from substrate state at-read against a wearer-stated intent
- `composed-view-atom` — class of atoms with composition + provenance + reversibility sub-shapes (PresentView is the v2.0 instance)
- `view-emission` / `view-witness` — substrate state-change recording that F-present emitted a view; PresentViewEmission is the v2.0 instance
- `wearer intent` — a point in the D1 × D2 × D3 product (standpoint × focus × ordering); the one operation `present` ranges over the full product
- `preset` — a named fixed configuration of `present` (§3.7.1); the five v1.0.1 operations are the v2.0 presets
- `standpoint` — D1; the chain position a view is composed FROM. null = the live present; non-null = a Reading-A snapshot ceiling
- `Reading-A snapshot` — a view composed of the substrate as it actually stood at a chain position (state after that position excluded); served by the LM v3.5 `asOfPosition?` thread-read ceiling
- `anchor` — derived per PR3 from focus + standpoint; never stored (PrA7)
- `weighting` — Option C weighting (w_recur, w_density, w_adj thresholds)
- `view-trail` — sequence of PresentViewEmission state-changes for a given userId+scope; queryable via identity-recurrence on viewId / consumerRef identities

### §3.10 jurisdictionClaim

| axis | temporal | categorical | relational | positional |
|---|---|---|---|---|
| Schema | PrA1+PrA2+PrA6 v2.0 | composed-view-atom kind + read-primitive enum + ContentClass enum (via RC-09) | binds PresentView ↔ PresentIntent ↔ ReadPrimitiveTrace ↔ PresentViewEmission | atoms placed per Placement R3+R5 |
| Structure | PrA5 v2.0 | one-operation closure + three-dimension parameter product | binds PR1–PR8 ordering + focus/ordering/standpoint dispatch | procedure steps 1–8 |
| Validity | PrA8 v2.0 | determinism property kind | binds PresentIntent → PresentView function | PrG8 in PR7 |
| Lifecycle | PrA7 v2.0 | between-invocation-state + view-witness-as-state-change | binds runtime statelessness | F-present runtime at PR1–PR8 only |
| Coupling | PrA3+PrA4 v2.0 | write-channel + access-discipline + contentClass | binds F-present to substrate + PS + consumers | HRs §6.2 |

### §3.11 RC array axis-binding (re-stated from §2.3)

Each of the 9 RCs binds to the Schema axis (atom-typing references). Axis-coverage at RC-level: Schema dominant.

| RC | citingAtom | axis | referentKind |
|---|---|---|---|
| RC-01..RC-06 | substrate/LM atom refs (userId, scopeRef, standpoint, consumerRef, IdentityRef, StateChangeId) | Schema | substrate-atom-ref |
| RC-07 | PresentViewEmission.source.channel | Schema | l0-ratified-ref |
| RC-08 | PresentView.composition (full sub-shape) | Schema | l0-ratified-ref |
| RC-09 | PresentViewEmission.source.contentClass | Schema | substrate-atom-ref (A-24) |

### §3.12 MA-V10 part B jurisdiction coverage declaration

At v2.0: jurisdiction coverage = 8 axiom-jurisdictionClaim paths × 9 RC entries = 72 cells. RC coverage is Schema-axis-dominant (all 9 RCs on Schema). Structure/Validity/Lifecycle/Coupling axes carry axiom-level declarations resolved via §3.6 axiom prose + §3.10 jurisdictionClaim entries.

---

## §4 Validity

### §4.1 Gate count

8 Standard-own gates (PrG1–PrG8), 1:1 with PrA1–PrA8 per G-M1. Plus the 87 inherited framework-tier gates.

### §4.2 Standard-own gate set (PrG1–PrG8, 1:1 with PrA1–PrA8 per G-M1)

| gate | tests | ground class (substrate §6.3) |
|---|---|---|
| **PrG1** | composition.nodes and composition.threads typed per atom inventory §2.1; consumer reads PresentView without further composition step | type-check + reference-resolution |
| **PrG2** | `provenance.sourceStateChangeIds.length` ≥ count of distinct StateChangeIds composed; `provenance.readPrimitivesUsed.length` ≥ 1 | cardinality + type-check |
| **PrG3** | F-present write log shows only `source.channel: 'internal-derivation'` writes; zero modifications to existing StateChangeRecord rows; every PresentViewEmission carries `source.contentClass: 'system-introspection'` | enum-membership + cardinality + type-check |
| **PrG4** | every substrate read carries the intent's userId + scopeRef; every PresentViewEmission carries same | type-check |
| **PrG5** | the one operation's three-dimension parameter space on `view.derivedFromIntent` is valid: `standpoint ∈ PositionRef \| null`, `focus.kind ∈ {'identity','identity-role','density'}`, `ordering.axis ∈ {'time','identity','role'}` | type-check + enum-membership |
| **PrG6** | F-present's substrate-read call sites use exactly {identity-recurrence, role-pattern, adjacency, iterate-axis}; when `ThreadQueryInput.contentClass` is passed, value ∈ {'wearer-life','system-introspection'} per LM LMA13; when `ThreadQueryInput.asOfPosition` is passed, value is a PositionRef per LM v3.5 | enum-membership + type-check |
| **PrG7** | between-invocation: no F-present heap state references prior invocations' StateChangeIds; PresentViewEmissions queryable via LMA9 primitives like any state-change | deterministic-function-result + reference-resolution |
| **PrG8** | replay test: two invocations of F-present with identical PresentIntent against identical substrate snapshot produce field-equivalent PresentView across composition.nodes, composition.threads, composition.focus, provenance.anchorDerived, provenance.weightingApplied | deterministic-function-result |

**PrG5 re-derivation (v2.0).** The v1.0.1 PrG5 tested `F-present's callable operation-dispatcher path set = {search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory}` — a runtime gate asserting membership in a five-kind set. Under v2.0 there is no `operation.kind` and no five-kind enum; the operation set collapsed to one parameterized operation (PrA5 re-derived). A gate asserting "kind ∈ 5 valid" asserts against a structure that no longer exists — the five-operation model surfacing in the gate harness, the same residue class as the removed `operationApplied` field. PrG5 is **re-derived**, not dissolved: dissolution was considered (does PrG2's provenance/cardinality check cover it?) and rejected — PrG2 tests provenance cardinality, not dimension validity, and the PR7 harness independently confirms at runtime what PR1 validated. v2.0 PrG5 gates the three independent dimensions of the one operation's parameter space — the 1:1 PrG5↔PrA5 binding is preserved (PrG5 still gates the Structure-axis axiom; PrA5 is now the one-operation closure, and PrG5 now tests the one operation's parameter space).

All 8 gates resolve to substrate §6.3 ground classes — mechanical per MA-V11.

### §4.3 Gate execution order

E1 Identity → E2 Schema → E3 Structure → E4 Validity → E5 Lifecycle → E6 Coupling → E7 Judgment → E8 Universal+Meta.

### §4.4 Backward-invalidation policy

Per substrate §6.4: failure at any Ei invalidates Ei+1..E8 results from this run; deriver re-enters at failed Ei after correction.

### §4.5 Failure modes

| code | trigger | recovery |
|---|---|---|
| `PRESENT_INTENT_INVALID` | PR1 J-intent-binding gate fails (any C1–C6 criterion) | return Result.err with structured error naming failed criterion; no PR2..PR8 execution |
| `PRESENT_AUTH_REJECTED` | PR2 PS handshake rejects userId+scopeRef | return Result.err; no read/write performed |
| `PRESENT_READ_FAILED` | PR4 substrate-read primitive returns error from LM | return Result.err; no PR5..PR8 |
| `PRESENT_EMISSION_REJECTED` | PR6 writeStateChange rejects | return Result.err with substrate gate code; no PR7..PR8 |
| `PRESENT_GATE_FAILED` | PR7 any of PrG1–PrG8 fails | return Result.err with failing gate id |

The five failure-mode codes are preserved from v1.0.1 (the `PresentErrorCode` union is unchanged); the C1–C6 criteria and PrG1–PrG8 gates they reference are re-derived in content per §7.1 and §4.2 but keep their identifiers.

---

## §5 Lifecycle

- **versionTransition:** v1.0.1 → v2.0 (major per MA-L1 — the wearer-callable surface is breaking-replaced; the five-arm operation enum is removed, `PresentIntent` replaces `PresentReadIntent`). `stateApplied` preserved at `applied` — v2.0 is a contract re-derivation of an already-applied L3 program; F-present remains a live registered slice across the transition.
- **amendmentTrigger:** substrate amendment affecting consumed atoms (A-09/A-12/A-17/A-18/A-24), LM amendment affecting the LMA9 thread primitives or LMA13 ContentClass discipline or the v3.5 `asOfPosition?` ceiling, Manual SPEC bump affecting Tool definition or canonical naming, L0-ratified change to the wearer-intent dimension set, or PS amendment affecting PA-IR3 auth delegation.
- **deprecations:** the v1.0.1 `WearerOperation` / `OperationParameter` / `PresentReadIntent` atoms are removed at v2.0 (superseded by `PresentIntent` / `FocusSelector` / `OrderingSelector`). The five v1.0.1 operations are not deprecated as *capabilities* — every one survives as a preset configuration of `present` (§3.7.1); only the five-arm typed surface is removed.
- **activationFlow:** v2.0 is built and build-tier audited, then L0-ratified, then deployed. This document is the build artifact; ratification is pending.
- **bootstrap:** non-re-entrant per substrate §13.5 registry-lock.
- **firstRunExecution:** F-present is already first-run-executed (v1.0 S12, 2026-05-18); v2.0 preserves first-run-executed state — a contract re-derivation, not a re-genesis.
- **escalation:** `none` at v2.0 build close. The build-tier flags B1–B6 (six spec-under-naming corrections caught at build by mechanical verification) were dispositioned by the manager dispatch before build; none escalated to a derivation re-open.

---

## §6 Coupling

### §6.1 Carrier

Present Standard's carrier = `self`. F-present emits `PresentView` directly to consumers via HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter, and `PresentViewEmission` directly to substrate via HR-PR-Substrate-Write. No enclosing carrier framework. **MA-C1 satisfaction:** carrier = `self` declared with rationale per substrate §9 Carrier enum. Precedent: Builder Standard v1.0 §6.1 carrier=self idiom.

### §6.2 Handoff rules

Six framework-local HR instances.

| HR | direction | endpoints | carrier applicability | diagnostic significance | captureShape |
|---|---|---|---|---|---|
| HR-PR-LM | F-present → Living Memory v3.5 | Tool → Standard | `['self']` | `true` | substrate-read invocations (3 LMA9 thread primitives + iterate_axis); `parameters` includes `contentClass?` and `asOfPosition?` optional filters |
| HR-PR-Substrate-Write | F-present → Substrate v1.8.3 | Tool → Store | `['self']` | `true` | `internal-derivation` channel writes (PresentViewEmissions); every emission stamps `source.contentClass: 'system-introspection'` per PrA3 |
| HR-PR-PS | F-present ↔ Perimeter Standard v1.2.1 | Tool ↔ Standard | `['self']` | `true` | scope + userId handshake at PR2 per PA-IR3 delegation |
| HR-PR-Modality | F-present → Modality (F-chat, F-output, F-dashboard) | Tool → Modality | `['self']` | `true` | PresentView emission to renderer; Manual L158 honored |
| HR-PR-Generator | F-present → Generator (F-discover, F-plan, F-builder, F-verify) | Tool → Generator | `['self']` | `true` | PresentView consumption by generator cycle |
| HR-PR-AIAdapter | F-present → F-ai-adapter | Tool → Tool | `['self']` | `true` | PresentView passed to LLM-using tool without further composition |

### §6.3 Adjacent-framework declarations

**Consumes:** substrate-v1-1 v1.8.3 (A-24 ContentClass + atoms A-09/A-12/A-17/A-18); living-memory v3.5 (LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA9, LMA10, LMA12, LMA13; SourceRef three-field shape; ThreadQueryInput.contentClass? + asOfPosition? optional filters; three LMA9 thread primitives + iterate_axis); perimeter-standard v1.2.1 (PA-IR3 auth delegation); metaframework-v3-1 v3.3.1; generation-procedure-v1-0 v1.1.7; Manual SPEC-v13.4; LIV-Standard v1.5.2; Placement Standard v1.0.

**Consumed by:** F-chat, F-output, F-dashboard (Modalities), F-discover, F-plan, F-builder, F-verify (Generators), F-ai-adapter (Tool).

### §6.4 OperatorInterface (per substrate §4 A-13 + V5 verification)

`runtimeState: 'declared'`.

```
operatorInterface = {
  runtimeState: 'declared',
  invokeShape: '(PresentIntent) → Result<PresentView, PresentError>',
  sideEffect: 'PR6 substrate-write (PresentViewEmission via internal-derivation channel + contentClass system-introspection)',
  observability: 'every invocation produces PresentView with full provenance + a substrate state-change witness queryable via LMA9'
}
```

### §6.5 Substrate-version-pin

substrate-v1-1 v1.8.3. Uniform across all atom references.

### §6.6 Capture shapes (per substrate §8.2 amended P6)

| HR | captureShape |
|---|---|
| HR-PR-LM | `{ readKind: 'identity-recurrence' \| 'role-pattern' \| 'adjacency' \| 'iterate-axis', parameters: <kind-specific>, contentClassFilter?: ContentClass, asOfPosition?: PositionRef, recordCount: number, atTime: Timestamp }` |
| HR-PR-Substrate-Write | `{ writeKind: 'present-view-emission', viewId: ViewIdRef, channel: 'internal-derivation', contentClass: 'system-introspection', scope: ScopeRef, userId: UserIdRef, atTime: Timestamp }` |
| HR-PR-PS | `{ direction: 'request' \| 'response', userId: UserIdRef, scopeRef: ScopeRef, authority: PSAuthorityDecision, atTime: Timestamp }` |
| HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter | `{ consumerRef: FrameworkRef, viewId: ViewIdRef, emittedView: PresentView, atTime: Timestamp }` |

### §6.7 Provenance contract

Every PresentView carries `provenance.sourceStateChangeIds` + `provenance.readPrimitivesUsed` + `provenance.anchorDerived` + `provenance.weightingApplied` per §2.1 PresentView shape + PrA2. (v2.0: `provenance.operationApplied` is removed — see §2.1 PresentView structural note.) The provenance is the load-bearing reversibility surface per §6.3 `appealCourtIs: substrate-state-change-table`.

### §6.8 Cross-framework handoff contracts

- **HR-PR-LM:** F-present consumes LM v3.5's R3 `threadQuery(ThreadQueryInput)` and `iterate_axis(start, direction, count)` primitives. `ThreadQueryInput.contentClass?` and `asOfPosition?` optional filters used per PR4 derivation.
- **HR-PR-Substrate-Write:** F-present consumes LM v3.5's R3 `writeStateChange(SubstrateWriteInput)` primitive.
- **HR-PR-PS:** F-present consults PS v1.2.1 PA-IR3 at PR2 for scope+userId authorization.
- **HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter:** Present emits PresentView consumer-renderable per PrA1.

---

## §7 Judgment

### §7.1 J-intent-binding (Standard-local judgment template)

Validates the incoming `PresentIntent` at PR1. **v2.0 re-derivation:** the v1.0.1 J-operation-binding validated a five-arm operation/parameter pair; J-intent-binding validates the three independent dimensions of `PresentIntent`.

```
J-intent-binding:
  kind: validation
  consumedBy: present-standard-v2-0 §3.7 PR1 (judgmentInputRef at every F-present invocation)
  shape: Judgment per substrate §6.2
  input:    PresentIntent
  criteria:
    C1: intent.standpoint is null OR a non-negative integer PositionRef
        Mechanical: type-check + cardinality on the D1 dimension.
    C2: intent.focus.kind ∈ {'identity', 'identity-role', 'density'}
        Mechanical: enum-membership check on the D2 discriminated-union tag.
    C3: intent.focus conforms to the FocusSelector arm for its kind
        ('identity' requires identity; 'identity-role' requires identity + role;
         'density' requires nothing beyond kind)
        Mechanical: type-check against §2.1 FocusSelector declaration.
    C4: intent.ordering.axis ∈ {'time', 'identity', 'role'}
        Mechanical: enum-membership check on the D3 axis.
    C5: intent.ordering.direction, if present, ∈ {'forward', 'backward'}
        Mechanical: type-check + enum-membership on the optional field.
    C6: for focus.kind 'density', focus.rule (if present) ∈ {'identity-density', 'position-density'}
        Mechanical: type-check + enum-membership.
  output: {ok: true, validatedIntent: PresentIntent} | {ok: false, code: 'PRESENT_INTENT_INVALID', failedCriterion: 'C1'..'C6'}
```

All six criteria reduce to substrate §6.3 ground classes — mechanical per MA-V11. The criterion identifiers C1–C6 are preserved from v1.0.1 (the `PresentError.failedCriterion` union is unchanged); the criteria are re-derived in content to validate the three dimensions rather than the five-arm operation pair.

### §7.2 Consumed judgments (by reference)

- `J-axis-mece` from MFv3 §7
- `J-axiom-dist` from MFv3 §7

Both consumed by reference per substrate §1.3 S-03; no redeclaration.

---

## §8 Self-audit results

### §8.1 Gate results (v2.0)

All 87 framework-tier gates: state = `executed` at the v1.0.1 emission. v2.0 re-derives the *content* of the Structure axis (PrA5), the Judgment template (J-intent-binding), and four procedure steps (PR1/PR3/PR4/PR5); it preserves every primitive count (8 axioms, 8 gates, 8 procedure steps, 6 HRs, 1 leaf, 1 judgment template) and the axiom-axis distribution (3-1-1-1-2-0-0). The gate re-run is a build-tier-audit concern — this document is the build artifact; final gate execution is performed by the fresh build-tier auditor and L0 ratification follows.

**v2.0 gate re-run expectation (deriver/builder-asserted; awaiting build-tier-audit first-execution):**

| Bundle | Gates | v1.0.1 result | v2.0 amendment surface | Expected v2.0 result |
|---|---|---|---|---|
| E1 Identity | 9 | 9/9 PASS | Version v1.0.1 → v2.0 (major); predecessor named; consumed-versions pin LM v3.4 → v3.5 | 9/9 PASS |
| E2 Schema | 9 | 9/9 PASS | `PresentIntent`/`FocusSelector`/`OrderingSelector` replace `WearerOperation`/`OperationParameter`/`PresentReadIntent`; `PresentView` two fields change (derivedFromIntent retyped, operationApplied removed); RC count held at 9 (re-cited) | 9/9 PASS (the atom inventory is internally consistent; RC A-18 conformance preserved) |
| E3 Structure | 18 | 18/18 PASS | PrA5 re-derived (one-operation closure); PR1/PR3/PR4/PR5 re-derived; axiom count 8, procedure-step count 8, axis distribution 3-1-1-1-2-0-0 all preserved | 18/18 PASS (the re-derivation re-states content within the existing axiom/procedure structure) |
| E4 Validity | 12 | 12/12 PASS | PrG5 re-derived (three-dimension parameter check); PrG6 extended with `asOfPosition?` clause; 1:1 axiom-gate bijection preserved per G-M1 | 12/12 PASS |
| E5 Lifecycle | 12 | 12/12 PASS | versionTransition v1.0.1 → v2.0; deprecations row records the removed v1 atoms; escalation = `none` | 12/12 PASS |
| E6 Coupling | 11 | 11/11 PASS | substrate-version-pin held at v1.8.3; LM pin v3.4 → v3.5; HR captureShapes extended with `asOfPosition?`; carrier=self preserved | 11/11 PASS |
| E7 Judgment | 6 | 6/6 PASS | J-operation-binding → J-intent-binding (re-derived to validate the three dimensions); C1–C6 identifiers preserved | 6/6 PASS |
| E8 Universal+Meta | 10 | 10/10 PASS | G-U3 axis-coverage preserved (5 axes carry ≥1 PrA); G-M1 1:1 preserved at 8↔8 | 10/10 PASS |
| **Total** | **87** | **87/87 PASS** | **(major-version re-derivation; counts and distribution preserved)** | **87/87 PASS expected — confirmed by build-tier audit** |

### §8.2 validity.overallResult

`PASS expected` — final result is the build-tier auditor's call. This document is the build artifact; L0 ratification follows the build-tier audit per the dispatch sequence (§9).

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-18 (Sprint B3 S12 emission) | Initial declaration. Eight PrA axioms, eight PrG gates, six HRs, eight PR procedure steps. Five-operation closure at the `WearerOperation` discriminated union. PresentView composed-view atom shape. PresentViewEmission substrate persistence shape. Carrier = `self`. Eight RCs. J-operation-binding. E1–E8 87/87 PASS at S2-revalidation. | L0 (Sprint B3 S12 emission) |
| v1.0.1 | 2026-05-19 (Side-Quest Shot 5) | ContentClass apparatus alignment. Substrate-version-pin v1.8.2 → v1.8.3; LM v3.3 → v3.4; PresentViewEmission gains `source.contentClass: 'system-introspection'`; RC array 8 → 9 (RC-09 for ContentClass); PR4 read-side ContentClass filter usage; PrG3/PrG6 contentClass clauses. Additive minor. | L0 (Side-Quest Shot 5) |
| **v2.0** | **2026-05-21 (Present Standard re-derivation — build close)** | **Major re-derivation of the wearer-callable surface.** Predecessor: `present-standard.md` v1.0.1 at repo HEAD `7f57ae1`, B3-lineage (FLAG-1 — the parent brief's named predecessor `e9285d7` is a memory artifact; the real predecessor is the resident v1.0.1 file). Built from `STEP-1-derive-corrected-rev2.md` (derive-tier audit PASS). **Δ-operation-collapse.** The v1.0.1 five operations (search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory) — carried as the five-arm `WearerOperation` / `OperationParameter` discriminated unions — are re-derived over the **wearer-intent domain** (derivation Phase two) rather than the substrate-primitive domain. The nine-cell grid (Phase four) collapsed the operation set to **one parameterized operation** `present(standpoint, focus, ordering) → PresentView`. The five operations survive as **presets** (§3.7.1), not a typed enum. `WearerOperation`, `OperationParameter`, `PresentReadIntent` are removed; `PresentIntent` (carrying D1 standpoint / D2 focus / D3 ordering), `FocusSelector` (3-arm), and `OrderingSelector` replace them. **Δ-PrA5.** Re-derived from "operation closure at five" (substrate-primitive domain) to "operation closure at one parameterized operation" (wearer-intent domain). **Δ-PresentView.** Structural skeleton preserved; `derivedFromIntent` retyped `PresentReadIntent → PresentIntent`; `provenance.operationApplied` removed (the verb layer has one member — the field recorded a dimension with nothing behind it). The v1.0.1 "PresentView shape unchanged" statement is corrected: it referred to structural invariance; referential invariance of the two operation-typed fields is not possible under the collapse. **Δ-procedure.** PR1 re-derived (J-intent-binding over three dimensions); PR3 (anchor from focus + standpoint); PR4 (focus/ordering/standpoint dispatch + Reading-A `asOfPosition` ceiling wiring); PR5 (perspective IS the ordering dimension). **Δ-LM-coupling.** LM pin v3.4 → v3.5 — the re-derivation's Phase-one dependency: an `asOfPosition?` position-ceiling parameter on the three LMA9 thread primitives (open-ended `AND position <= $n` conjunct), required for Reading-A snapshot composition (a snapshot is the substrate as it actually stood at a chain position). The v3.5 amendment also lands the v3.4-deferred `contentClass?` repository plumbing. **Δ-PrG5.** Re-derived: the v1.0.1 PrG5 (`operation.kind ∈ 5 valid kinds`) is the five-operation model surfacing in the gate harness; v2.0 PrG5 gates the three-dimension parameter space of the one operation. **Δ-J-template.** J-operation-binding → J-intent-binding (validates the three dimensions; C1–C6 identifiers preserved). **Citation hygiene (FLAG-2).** v2.0 cites neither `present-spec-v4` (confirmed non-resident in the `7f57ae1` tree) nor the parent dispatch brief (a non-resident dispatch artifact) as resident repo ground; RC-08, formerly citing `spec v4 §6.3`, is re-grounded on the rev2 derivation's audit-PASSED Phase-four output. **Build-tier flags B1–B6.** During the build, mechanical verification against `7f57ae1` found the dispatch spec under-named the true extent of six changes (PresentView's operationApplied removal; `present-trpc.ts` Shot-2 scope; `ThreadQueryValidated` forced fields; decision-(a) config+service+repo extent; `dispatch-read.ts` pre-existing contentClass activation; `run-gates.ts` PrG5 residue). All six were manager-dispositioned before build; none re-opened the derivation. Primitive counts and axiom-axis distribution preserved (8/8/8/6/1/1; 3-1-1-1-2-0-0). authorityClaim: {level:'L0', confirmedBy:'pending — ratification follows build-tier audit', timestamp:'present-rederive-build-close-pending'} | L0 pending — ratification occurs after build-tier audit |

---

**End of present-standard-v2-0. Built against repo HEAD `7f57ae1`; pending build-tier audit and L0 ratification.**
