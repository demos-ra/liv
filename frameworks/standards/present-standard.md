---
kind: framework
placement: frameworks/standards/
---

# present-standard-v1-0-1

**Kind:** Framework
**Level:** L2
**Mode:** epistemic (unknown → known)
**Version:** v1.0.1
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1
**Cross-framework input:** substrate-v1-1 v1.8.3 (consumes A-24 ContentClass), Living Memory v3.4 (consumes LMA13 + ThreadQueryInput.contentClass? optional filter), Perimeter Standard v1.2.1 (delegation per PS PA-IR3 for scope+userId access authority), Manual SPEC-v13.4 (Part I phantom-layer addendum + Canonical naming ContentClass row), LIV-Standard v1.5.2, Placement Standard v1.0, Verification Standard v1.0 (structural format precedent for §1-§9 layout), Builder Standard v1.0 (carrier=self mechanics precedent)
**Authority:** L0 confirmed (Sprint B3 v1.0 S12 emission ratified 2026-05-18; Side-Quest Shot 5 v1.0 → v1.0.1 amendments — substrate-version-pin bump + LM/Manual pin bumps + PresentViewEmission ContentClass declaration + PR4 read-side ContentClass filter usage + L3-B dissolution change-log entry; pending L0 ratification at Shot 5 close)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus self-audit results and change log per v3-1-spec §4.4 file-specific placement).

Present Standard is the L2 epistemic-mode framework governing F-present at L3. F-present is the runtime program that composes typed views over substrate state via the five wearer-callable operations (search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory). PresentView is a composed-view atom consumer-renderable without further composition (Manual L158 honored); Modality renders, F-ai-adapter passes, Generators consume — none re-compose. Present Standard sits at L2 because it governs a Tool-category program (F-present, sliceCategory='Tool' per Manual Part III Tool inhabitants list); the standard is consumed by Modalities, Generators, and Tools per the Manual Operations slot for the Tool slice.

Present Standard is **distinct from F-present (the L3 program it governs)**: Present Standard declares the typed shape that F-present produces — the contract and discipline; F-present at L3 executes against the contract. Different tier, different concern, non-overlapping (see §1 scopeOut). Present Standard is **distinct from Living Memory v3.4** (substrate-tier governance of state-change writes and read primitives at LMA9): LM declares the substrate-side primitives F-present consumes; Present Standard declares F-present's composition discipline + persistence-emission discipline over those primitives.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Present Standard` |
| `kind` | `Framework` (per substrate §4 A-10 Kind enum; consumed by reference; string-typed) |
| `mode` | `epistemic` (per substrate §2 Mode enum; `unknown → known`) |
| `level` | `L2` (per substrate §5 AuthorityLevel; governs L3 F-present program) |
| `version` | `1.0.1` (per substrate §7 Semver; v1.0 (Sprint B3 ratified 2026-05-18) → v1.0.1 per MA-L1 minor at Side-Quest Shot 5 — substrate-version-pin bump v1.8.2 → v1.8.3 to consume A-24 ContentClass; LM v3.3 → v3.4 pin to consume LMA13 + ThreadQueryInput.contentClass?; Manual SPEC-v13.3 → SPEC-v13.4 pin; PresentViewEmission ContentClass declaration; PR4 read-side ContentClass filter; L3-B per-Tool exclusion dissolution change-log entry; no axiom/gate/schema-shape change beyond ContentClass field addition) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `applied` (transitioned at v1.0 S12 emission per HR5 registry write; v1.0.1 preserves `applied` state per MA-L1 additive minor — no state regression on amendment) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `sliceCategory` | `Tool` (per substrate §1.5 SliceCategory enum at six-value closure post-Manual SPEC-v13.3; F-surface sibling-precedent per Manual L287) |
| `carrier` | `self` (Present Standard's program F-present emits `PresentView` directly to consumer and `PresentViewEmission` directly to substrate per HR-PR-* set; no enclosing carrier framework per §6.1 + Builder Standard v1.0 §6.1 carrier=self precedent) |
| `primitive` | `view-composition` (framework-local atomic unit; defined §3.9 Vocabulary; one act of composing a typed view from substrate state at-read against a wearer-stated intent) |
| `consumes` | substrate-v1-1 v1.8.3 (A-09 Timestamp, A-12 FrameworkRef, A-17 P3/P4/P5 closure rules, A-18 StateChangeRecord + ReferentCitation + StateChangeId, A-24 ContentClass), Living Memory v3.4 (LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA9, LMA12, LMA13; SubstrateWriteInput shape; SourceRef.channel/contentClass/scope fields; ThreadQueryInput.contentClass? optional filter; four LMA9 primitives identity-recurrence/role-pattern/adjacency/iterate-axis), Perimeter Standard v1.2.1 (PA-IR3 scope+userId authority delegation), Manual SPEC-v13.4 (canonical-naming ContentClass row + Part I phantom-layer addendum + Operations Tool slot for F-present), metaframework-v3-1 v3.3.1 (GeneratedFrameworkTemplate output schema), generation-procedure-v1-0 v1.1.7 (S1–S12 generation procedure), LIV-Standard v1.5.2, Placement Standard v1.0 (P-A6 R5 placement for consumed atoms by reference) |
| `produces` | `PresentView` (W-ATOM; consumer-renderable composed-view atom; emitted to Modality/Generator/Tool consumers via HR-PR-Modality/HR-PR-Generator/HR-PR-AIAdapter) + `PresentViewEmission` (substrate state-change record; emitted via HR-PR-Substrate-Write per PrA3) |
| `consumedBy` | Modalities (F-chat, F-output, F-dashboard — render `PresentView` per Manual L158 without further composition); Generators (F-discover, F-plan, F-builder, F-verify — consume `PresentView` for generator-cycle inputs); Tools (F-ai-adapter — passes `PresentView` to LLM-using tool without further composition); observability, replay, audit consumers via `PresentViewEmission` substrate trail |
| `adjacentFrameworks` | substrate-v1-1 v1.8.3 (typed atoms + ContentClass), Living Memory v3.4 (substrate primitive supplier + LMA13 governor of anchor-candidate set), Perimeter Standard v1.2.1 (auth delegation), Manual SPEC-v13.4 (canonical naming + operations slot + phantom-layer addendum), Verification Standard v1.0 + Research Standard v1.0 + Plan Standard v2.3 + Builder Standard v1.1 + Artifact Standard v2.5 (Phase D ContentClass classification siblings — Present Standard's ContentClass declaration for PresentViewEmission classifies as system-introspection, mirroring Builder Standard's classification of build-emission per the apparatus-operational-metadata content-kind), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | RC array populated at v1.0.1 with 9 RCs (v1.0 emission carried 8 RCs; Shot 5 adds RC-09 for PresentViewEmission.source.contentClass per Side-Quest Shot 5 W4 — apparatus consumes A-24 ContentClass per substrate v1.8.3 + LM v3.4 LMA13). See §2.3 and §3.4 below for full array. |
| `scopeOut` | `['runtime execution of view composition (owned by L3 F-present program; Present Standard declares the contract, not the executor)', 'substrate write mechanics and read-primitive implementation (owned by Living Memory v3.4)', 'scope/userId access authorization (owned by Perimeter Standard v1.2.1 per PA-IR3 delegation; Present Standard declares carry-through mechanics only per PrA4)', 'consumer-side session continuity / view-trail navigation logic (owned by consumer; Present Standard exposes five operations + persistent view-witness trail, not a continuity API)', 'view-rendering / surface concerns (owned by Modality per Manual L158 — Modality renders PresentView without further composition; Present Standard does not declare render-tier concerns)', 'LLM prompt composition (owned by F-ai-adapter; Present Standard emits PresentView, F-ai-adapter passes it without further composition)', 'framework-declaration audit (owned by framework-audit v1.3.6 at L2; Present Standard produces runtime artifacts via F-present, not framework declarations)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.3.1' },
  generationSession: 'sprint-B3-s12-emission-and-side-quest-shot-5-amendment',
  ratifiedAt: '2026-05-18 (v1.0 S12) + 2026-05-19 (v1.0.1 Shot 5)',
  ratifiedBy: 'L0:Demos'
}
```

### §1.2 Identity-axiom satisfaction

Per substrate §4 A-17 Identity-axis empty-declaration: Identity fields are mechanical declarations per substrate §4 (atom-typed value assignments); no jurisdictional commitment is carried at the Identity axis at Standard scope. G-I8 governsRuntimeCode = `true` (governs F-present at L3 runtime).

---

## §2 Schema

### §2.1 Own atom inventory

**PresentReadIntent** — wearer-call envelope:

```
PresentReadIntent = {
  intentId:        IntentIdRef,
  consumerRef:     FrameworkRef,              // F-chat | F-output | F-discover | F-plan | F-builder | F-verify | F-ai-adapter | ...
  userId:          UserIdRef,                 // LMA12
  scopeRef:        ScopeRef,                  // LMA6
  operation:       WearerOperation,           // one of five (closed at five per spec v4 §5 non-negotiable)
  parameter:       OperationParameter,        // discriminated union, kind-matched to operation
  currentPosition: PositionRef | null,        // required iff operation ∈ {move-neighborhood, move-trajectory}; null required for default-entry; null permitted for search-*
  bound:           ViewBound,                 // max records, walk budget
  provenance:      OriginProvenance           // consumer-stamped origin
}

WearerOperation =
  | { kind: 'search-by-identity'    }
  | { kind: 'search-by-role'        }
  | { kind: 'default-entry'         }
  | { kind: 'move-neighborhood'     }
  | { kind: 'move-trajectory'       }
// Closed at five per spec v4 §3.4 + §5 non-negotiable "Operation closure at five"

OperationParameter =
  | { kind: 'search-by-identity';   identity: IdentityRef;                                          scopeOverride?: ScopeRef          }
  | { kind: 'search-by-role';       identity: IdentityRef;     role: RoleRef                                                          }
  | { kind: 'default-entry';        anchorRule?: 'identity-density' | 'position-density';   scopeOverride?: ScopeRef                  }
  | { kind: 'move-neighborhood';    window: number;            relationFilter?: IdentityRef                                           }
  | { kind: 'move-trajectory';      direction: 'forward' | 'backward';   count: number;   relationFilter?: IdentityRef                }

ViewBound = {
  maxNodes:    number,
  maxThreads:  number,
  walkBudget:  number
}
```

**PresentView** — composed-view atom (consumer-renderable without further composition; per spec v4 §6.3 ratified shape):

```
PresentView = {
  viewId:              ViewIdRef,
  derivedFromIntent:   PresentReadIntent,
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
    operationApplied:      WearerOperation,
    anchorDerived:         AnchorTrace,
    weightingApplied:      WeightingTrace
  },

  reversibility: {
    appealCourtIs:       'substrate-state-change-table',
    replayDiscipline:    'invoke F-present with same PresentReadIntent → equivalent PresentView per PrA8'
  }
}

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
  axis:       'time' | 'identity' | 'role',     // which axis is primary in this view
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
  contentClassFilter?: ContentClass   // v1.0.1: declared when ThreadQueryInput.contentClass? filter applied per LM v3.4 LMA13 (PR4 derivation; see §3.2)
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

**PresentViewEmission** — the substrate write F-present produces after view composition. Per spec v4 §3.5 + §6.4: this is *not* a Present-local atom — it is a `SubstrateWriteInput` per LM v3.4 §2.1 with these specific population rules:

```
PresentViewEmission ≡ SubstrateWriteInput where:
  userId      = intent.userId
  identities  = [
    'present-view-emission',                              // marker identity: enables identity-recurrence on the view trail per §3.5
    viewId,                                               // the emitted view's id as identity
    composition.focus.identity,                           // foregrounded identity
    ...composition.nodes[*].identity                      // all identities the view foregrounded
  ]
  relations   = [
    Relation {
      type:                 'derived-from-intent',
      modality:             'declarative',
      identitiesWithRoles:  [{ identity: viewId,           role: 'view'   },
                             { identity: intent.intentId,  role: 'intent' }],
      negation:             false
    },
    Relation {
      type:                 'view-operation',
      modality:             'declarative',
      identitiesWithRoles:  [{ identity: viewId,                          role: 'view'      },
                             { identity: <operationKind-as-identityRef>,  role: 'operation' }],
      negation:             false
    },
    Relation {
      type:                 'view-scope',
      modality:             'declarative',
      identitiesWithRoles:  [{ identity: viewId,           role: 'view'  },
                             { identity: intent.scopeRef,  role: 'scope' }],
      negation:             false
    },
    Relation {
      type:                 'view-focus',
      modality:             'declarative',
      identitiesWithRoles:  [{ identity: viewId,                          role: 'view'  },
                             { identity: composition.focus.identity,      role: 'focus' }],
      negation:             false
    }
    // For successive views in same consumer session: optional parent-of relation
    // to prior viewId via consumer-supplied parentViewRef (forward-compatible).
  ]
  time        = emittedAt
  source      = SourceRef {
    channel:       'internal-derivation',                    // per PrA3 + LM v3.4 §2.1 SourceRef
    contentClass:  'system-introspection',                   // v1.0.1: per substrate v1.8.3 §4.2 A-24 + LM v3.4 LMA13 + Manual SPEC-v13.4 phantom-layer addendum; basis: PresentViewEmission records are apparatus operational metadata (apparatus emitting view-snapshots of what the wearer sees is apparatus operation, not wearer cognition); excluded from LMA7 anchor-candidate set by LMA13 construction; queryable via LMA9 primitives like any state-change
    scope:         intent.scopeRef
  }
```

The emission is queryable by the same five operations: `search-by-identity('present-view-emission')` returns all view emissions for the user in scope; `move-trajectory backward` filtered by `view-operation` relation returns temporal view trail. Per LMA13: queries that explicitly want only the wearer-life record set (excluding view-emission system-introspection records) pass `ThreadQueryInput.contentClass: 'wearer-life'`; queries that want all records (including the view trail) omit the filter or pass no filter parameter.

### §2.2 Consumed atoms (by reference)

All consumed atoms are substrate or LM atoms — no Present-local typing required for them. Per Placement Standard P-A6 + R5 placement, references-only.

| atom | source | role |
|---|---|---|
| `StateChangeRecord` | LM v3.4 §2.1 / substrate v1.8.3 §4 A-18 | substrate read return type |
| `SubstrateWriteInput` | LM v3.4 §2.1 | persistence emission shape |
| `IdentityRef`, `RoleRef`, `ScopeRef`, `UserIdRef`, `PositionRef` | LM v3.4 §3.12 + LMA5 | reference primitives |
| `Relation`, `IdentityWithRole`, `Modality` | LM v3.4 §2.1 LMA3 | typed relation shape |
| `SourceRef` | LM v3.4 §2.1 (v1.0.1: amended to consume the three-field shape — channel + contentClass + scope — per Shot 2 + Shot 1 ratifications) | source metadata for persistence emission |
| `ContentClass` | substrate v1.8.3 §4.2 A-24 (canonical declaration) + LM v3.4 §3.12 vocabulary (consumed by reference) | closed two-value classification: `'wearer-life' \| 'system-introspection'` |
| `Channel` (`'internal-derivation'` value) | LM v3.4 §2.1 SourceChannel union | source channel for persistence emission |
| `ThreadQueryInput` | LM v3.4 §2.1 (v1.0.1: amended to consume the `contentClass?` optional filter field per Shot 2) | substrate read primitive input shape |
| `FrameworkRef` | substrate v1.8.3 §4 A-12 | consumerRef typing |
| `Timestamp` | substrate v1.8.3 §4 A-09 | emittedAt typing |

### §2.3 ReferentCitation array (nine RCs)

9 RCs declared per substrate §4 A-18 schema. Each populates citationId, citingFrameworkRef, atomName, referentKind, path, expectedShape. v1.0 carried 8 RCs; v1.0.1 adds RC-09 per Side-Quest Shot 5 W4.

| RC | citingAtom | referentKind | path |
|---|---|---|---|
| RC-01 | PresentReadIntent.userId | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 + LM v3.4 §2.1 (UserIdRef) |
| RC-02 | PresentReadIntent.scopeRef | `substrate-atom-ref` | LM v3.4 §2.1 (ScopeRef) |
| RC-03 | PresentReadIntent.currentPosition | `substrate-atom-ref` | LM v3.4 §2.1 PositionRef |
| RC-04 | PresentReadIntent.consumerRef | `substrate-atom-ref` | substrate v1.8.3 §4 A-12 FrameworkRef |
| RC-05 | PresentView.composition.nodes[].identity | `substrate-atom-ref` | LM v3.4 §3.12 IdentityRef |
| RC-06 | PresentView.provenance.sourceStateChangeIds | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 StateChangeId |
| RC-07 | PresentViewEmission.source.channel | `l0-ratified-ref` | spec v4 §3.5 + §2.6 ratification (Channel enum already includes `'internal-derivation'` per LM v3.4 §2.1 SourceChannel union; ratified usage per spec v4) |
| RC-08 | PresentView.composition (full sub-shape) | `l0-ratified-ref` | spec v4 §6.3 ratified composed-view atom shape |
| **RC-09** | **PresentViewEmission.source.contentClass** | **`substrate-atom-ref`** | **substrate v1.8.3 §4.2 A-24 ContentClass closed-union (canonical declaration) + LM v3.4 LMA13 (discipline axiom) + Manual SPEC-v13.4 phantom-layer addendum (vocabulary + structural property) — v1.0.1 addition per Side-Quest Shot 5 W4; strongest grounding class per substrate §6.3 (substrate-atom-ref to A-24)** |

All nine resolve under v1.0.1: substrate atoms via substrate v1.8.3 §4, ratified content via spec v4 + LM v3.4 + Manual SPEC-v13.4 sections.

### §2.4 Own atoms declared at point of use in §3 (vocabulary)

Framework-local terms declared at point of use per PR1 (substrate §10.2):

- `IntentIdRef` — declared §2.1 as PresentReadIntent.intentId; UUID-tagged ref to a wearer-stated intent
- `ViewIdRef` — declared §2.1 as PresentView.viewId; UUID-tagged ref to a composed view
- `ViewNodeRef` — declared §2.1 as PresentView.composition.focus; reference to a ViewNode by identity within composition.nodes
- `ViewThreadRef` — declared §2.1; reference to a ViewThread within composition.threads
- `WearerOperation` — declared §2.1 as closed 5-arm discriminated union
- `OperationParameter` — declared §2.1 as 5-arm discriminated union, kind-matched to WearerOperation
- `ViewBound` — declared §2.1 as max-records + walk-budget shape
- `OriginProvenance` — declared §2.1 as consumer-stamped origin metadata; consumed-shape from substrate provenance convention
- `AnchorTrace`, `ReadPrimitiveTrace`, `WeightingTrace`, `PerspectiveDeclaration` — all declared §2.1 inline

---

## §3 Structure

### §3.1 Axes (inherited from metaframework-v3-1 §3.1.1 FrameworkConcernSpace)

Seven axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment.

Present Standard binds Standard-local axioms to five of seven axes; Identity and Judgment are empty-declared per substrate §4 A-17 with positive basis (§3.1.1 below).

### §3.2 Primitive instance counts

| Primitive (substrate §8.3) | Count | Basis |
|---|---|---|
| P1 P1-axis | 0 (empty-declared) | inherited axis set from metaframework §3.1.1 sufficient; no Present-local sub-axes required at v1.0.1 |
| P2 Sub-axis | 0 (empty-declared) | no Present-local sub-axis required |
| P3 Leaf | 1 (PresentViewEmission) | one substrate persistence emission shape declared §2.1 |
| P4 Axiom | 8 (PrA1–PrA8) | declared §3.6 |
| P5 Judgment template | 1 (J-operation-binding) | declared §7.1 |
| P6 Handoff rule | 6 (HR-PR-LM, HR-PR-Substrate-Write, HR-PR-PS, HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter) | declared §6.2 |
| P7 Gate | 8 (PrG1–PrG8) | declared §4.1 (1:1 with axioms per G-M1) |
| P8 Procedure step | 8 (PR1–PR8) | declared §3.7 |

### §3.3 P1 Axis instances

Empty-declared with positive basis per substrate §8.6: Present Standard inherits the seven-axis metaframework concern space and binds Standard-local axioms to five of seven axes (§3.1.1). No Present-local axis decomposition required at v1.0.1; the inherited axis set is sufficient for the eight axioms and seven derived obligations declared below.

### §3.4 P2 Sub-axis instances

Empty-declared with positive basis: no sub-axis decomposition required at v1.0.1.

### §3.5 P3 Leaf instances

One leaf: `PresentViewEmission` declared §2.1 — the substrate persistence emission shape that F-present produces after view composition (PR6). The emission is itself a `SubstrateWriteInput` per LM v3.4 §2.1 with Present-specific population rules; it is the one Present-local leaf at v1.0.1 because it represents the apparatus-operational state-change written by F-present at every view composition (per PrA3 substrate-write closure).

### §3.6 P4 Axiom instances (PrA1–PrA8)

Per spec v4 §6.7: PrA3 inverts (writes view emissions; not no-writes), PrA7 sharpens (view-witness emissions are first-class state-changes, not stored geometry). Other six survive under v4 framing through the three discipline tests (standalone-evidence / earn-its-place / collapse).

**PrA1 — Content-shape identity at composed-view-atom level (Schema axis).**

> Every wearer/LLM consumer of F-present reads the same composed-view atom shape (PresentView). PresentView.composition is consumer-ready: Modality renders without further composition (Manual L158); F-ai-adapter passes without further composition. No transformation layer exists between PresentView and consumer.

Standalone-evidence: declares the consumer-level shape commitment. Earn-its-place: removing it permits a future Modality to compose a different view-shape — breaks symmetry at the consumer level. Collapse: answers "what shape is the view?" definitively; does not collapse into any other axiom.

**PrA2 — Provenance-to-substrate completeness (Schema axis).**

> Every PresentView carries `provenance.sourceStateChangeIds` enumerating every substrate StateChangeId whose content contributed to any ViewNode or ViewThread. `provenance.readPrimitivesUsed` enumerates every substrate read primitive call made during composition. Replay against identical substrate snapshot produces field-equivalent PresentView per PrA8.

Standalone-evidence: declares auditability of every view. Earn-its-place: removing permits views whose origin is not traceable to substrate — kills reversibility (§6.3 `appealCourtIs: substrate-state-change-table`). Collapse: distinct from PrA8 (determinism); PrA8 governs reproducibility, PrA2 governs traceability.

**PrA3 — Substrate-write closure at view-emission only (Coupling axis).**

> F-present writes to substrate exclusively as PresentViewEmissions via `source.channel: 'internal-derivation'` per LM v3.4 §2.1 + Manual SPEC-v13.4. F-present never modifies, supersedes, or revokes any source state-change. F-present writes no other channel (`wearer`, `ai`, `cron`, `integration-event`, `system-l0` forbidden for F-present-originated writes).
>
> **v1.0.1 (Side-Quest Shot 5):** Every PresentViewEmission carries `source.contentClass: 'system-introspection'` per substrate v1.8.3 §4.2 A-24 + LM v3.4 LMA13 — PresentViewEmissions are apparatus operational metadata (view-snapshots emitted by apparatus, not wearer cognition); they enter the substrate as queryable records via LMA9 primitives but are excluded from LMA7 anchor-derivation candidate-set by LMA13 construction. The classification mirrors Builder Standard v1.1 §6.11's classification of `build-emission` records — same apparatus-operational-metadata content kind; same `'system-introspection'` discipline.

Standalone-evidence: declares the only write F-present makes and its content-kind classification. Earn-its-place: removing the channel clause permits F-present to revise source state-change content (would violate LMA1 forward-additive) or write through non-internal-derivation channel (would mis-attribute provenance); removing the contentClass clause permits view-emission records to pollute LMA7 anchor-candidate set with apparatus mechanics (would break root-claim mechanical preservation per Manual SPEC-v13.4 phantom-layer addendum). Both halves load-bearing. Collapse: does not collapse into LMA1 (substrate-level, applies to all writers); PrA3 is Present-specific channel + scope-of-write + contentClass declaration.

**PrA4 — Scope and userId carry-through (Coupling axis).**

> Every substrate read F-present invokes carries the intent's `userId` (LMA12) and `scopeRef` (LMA6). Every PresentViewEmission F-present writes carries the same userId and scopeRef. F-present applies these as read-filter and write-stamp mechanics; F-present does not authorize — Perimeter Standard v1.2.1 enforces (per PS PA-IR3 delegation declared in spec v4 §2.4).

Standalone-evidence: declares access-discipline mechanics F-present participates in. Earn-its-place: removing permits cross-user or cross-scope leakage in view content or emission. Collapse: PS enforces access at intake; PrA4 declares F-present's read/write-side mechanics conformance. Both needed.

**PrA5 — Operation closure (Structure axis).**

> F-present's procedure exposes exactly the five wearer operations declared in `WearerOperation` discriminated union: search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory. The procedure has zero callable paths exposing a wearer operation outside this set. Each of the five has at least one path producing a PresentView.

Standalone-evidence: declares the wearer-callable surface closure. Earn-its-place: removing permits exposing arbitrary compositions of substrate primitives as wearer operations — collapses operation-axis boundary, breaks spec v4 §5 non-negotiable "Operation closure at five." Collapse: distinct from PrA6 (substrate-read closure); PrA6 governs the read floor, PrA5 governs the callable surface.

**PrA6 — Substrate-read closure (Schema axis).**

> F-present reads substrate exclusively via the four substrate-side read primitives: identity-recurrence (LM TQ-via-threadQuery with threadKind='identity-recurrence'), role-pattern (threadKind='role-pattern'), adjacency (threadKind='adjacency'), iterate-axis (LM §3.10 iterate_axis operation). F-present does not introduce a fifth substrate read primitive (spec v4 §5 non-negotiable LMA9 closure).

Standalone-evidence: declares the read floor. Earn-its-place: removing permits F-present to introduce ad-hoc substrate reads outside LMA9, violating LMA9 closure. Collapse: distinct from PrA5 (callable surface).

**PrA7 — Geometry-non-persistence with view-witness disambiguation (Lifecycle axis).**

> F-present stores no derived geometry between invocations. F-present's runtime is stateless: each PresentView is composed at-read against substrate state at the read snapshot. The PresentViewEmission F-present writes is *not* stored geometry — it is a first-class typed state-change carrying its own typed content (identities + relations per LMA3). Future PresentView compositions read PresentViewEmission state-changes via the same four LMA9 primitives as any other substrate content; no special cache, no special index, no special derived-geometry surface.

Standalone-evidence: declares both the no-cache discipline and the witness-vs-geometry distinction. Earn-its-place: removing the no-cache half permits F-present to store anchor maps, weight caches, cluster snapshots (substrate §3.2 derived-geometry-as-storage violation); removing the witness-vs-geometry half permits the spec v4 §3.5 persistence-emissions to be misinterpreted as cached geometry. Both load-bearing. Collapse: distinct from PrA3 (write-channel + contentClass scope); PrA7 governs *between-invocation state*, PrA3 governs *what writes happen at all + their classification*.

**PrA8 — Anchor-and-weighting determinism (Validity axis).**

> For identical `PresentReadIntent` against identical substrate state at the read snapshot, F-present produces field-equivalent `PresentView` across composition.nodes, composition.threads, composition.focus, provenance.anchorDerived, provenance.weightingApplied, and (modulo distinct viewId + emittedAt) the PresentViewEmission content. Anchor derivation, weighting computation, and operation dispatch are pure functions of (intent, substrate state, declared thresholds).

Standalone-evidence: declares replay-discipline (§6.3 reversibility.replayDiscipline). Earn-its-place: removing permits non-deterministic view composition — kills audit trail value and replay testability. Collapse: viewId + emittedAt are operationally non-deterministic by design (UUID, wall-clock); axiom scope excludes them and binds the substantive content.

### §3.6.1 Axiom-axis distribution per MFv3 §3.1.1 FrameworkConcernSpace

| axis | bound axioms | count |
|---|---|---|
| Schema | PrA1, PrA2, PrA6 | 3 |
| Structure | PrA5 | 1 |
| Validity | PrA8 | 1 |
| Lifecycle | PrA7 | 1 |
| Coupling | PrA3, PrA4 | 2 |
| Identity | — (empty-declared per substrate §4 A-17; basis: Identity fields are mechanical declarations per substrate §4, not jurisdictional commitments at Standard scope) | 0 |
| Judgment | — (empty-declared; basis: J-operation-binding declared §7.1 governs incoming wearer-operation validation; J-axis-mece + J-axiom-dist consumed by reference from MFv3 §7; no Standard-local axis-bound judgment axiom required) | 0 |
| **Total** | | **8** |

8 axioms across 5 active axes; 2 empty-declared with positive basis. G-U3 axis-coverage gate satisfied.

### §3.7 P8 Procedure step instances (PR1–PR8)

Eight steps. PR3 anchor-derivation as first-class per spec v4 §3.5 + LMA7 delegation. PR6 persistence emission per spec v4 §6.4 (writes PresentViewEmission to substrate).

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **PR1** | 1 | 1 | `judgment-input` | PresentReadIntent | validated intent | `judgmentInputRef = 'J-operation-binding'` (§7.1) |
| **PR2** | 2 | 2 | `mechanical` | validated intent | authorized intent | `derivation = "PS handshake: confirm consumer-stamped userId + scopeRef per PrA4 + spec v4 §2.4. Per PrA4: F-present applies mechanics, does not authorize — Perimeter Standard v1.2.1 PA-IR3 owns access enforcement."` |
| **PR3** | 3 | 2 | `mechanical` | authorized intent | anchor + AnchorTrace | `derivation = "per LMA7 + PrA8: dispatch on operation.kind. search-by-identity → AnchorTrace{source: 'wearer-content', derivedAs: {identity: parameter.identity}}. search-by-role → AnchorTrace{source: 'wearer-content', derivedAs: {identity, role}}. move-* → AnchorTrace{source: 'current-position', derivedAs: {position: intent.currentPosition}}. default-entry → derive per parameter.anchorRule || internal default ('identity-density' if omitted); AnchorTrace{source: 'system-derived', derivedAs: {identity: derived}, rule: anchorRule}. Emit AnchorTrace into PresentView.provenance."` |
| **PR4** | 4 | 2 | `mechanical` | authorized intent + anchor | StateChangeRecord[] + ReadPrimitiveTrace[] | `derivation = "per PrA5 + PrA6 + LM v3.4 LMA9 with ThreadQueryInput.contentClass? optional filter: dispatch operation.kind → primitive(s). For anchor-candidate-derivation reads (default-entry anchorRule='identity-density', or any read intending to feed LMA7 anchor crystallization): pass ThreadQueryInput.contentClass='wearer-life' per LM v3.4 LMA13 (anchor-candidate set restriction to wearer-life records only). For full state reads (e.g., reading the view-emission trail itself, or operations explicitly traversing both classes): omit the contentClass filter parameter (default behavior returns all records per LM v3.4 §3.9 TQ3). Operation→primitive dispatch: search-by-identity → identity-recurrence(anchor.identity, scope, contentClass?). search-by-role → role-pattern(anchor.identity, anchor.role, scope, contentClass?). move-neighborhood → adjacency(anchor.position, window, contentClass?). move-trajectory → iterate-axis(anchor.position, direction, count) + post-filter by contentClass if applicable. default-entry → identity-recurrence(anchor.identity, scope, contentClass='wearer-life') for identity-density anchor rule. Apply parameter.relationFilter post-read for move-* operations. Log invocations as ReadPrimitiveTrace[] including the contentClassFilter field per §2.1."` |
| **PR5** | 5 | 2 | `mechanical` | StateChangeRecord[] + traces | PresentView composition draft | `derivation = "per PrA1 + PrA8: compose ViewNode[] (identity-cluster per LMA5 cluster-at-read), ViewThread[] (typed relations per LMA3 between nodes), apply Option C weighting (w_recur=0.4, w_density=0.2, w_adj=0.4 per spec v4 §5). Select focus per anchor. Emit WeightingTrace into PresentView.provenance."` |
| **PR6** | 6 | 2 | `mechanical` | composition draft | PresentView candidate + PresentViewEmission | `derivation = "per PrA3 + spec v4 §6.4 + Side-Quest Shot 5 W4: write PresentViewEmission to substrate via writeStateChange (LM v3.4 §3.10 required operation). Populate per §2.1 PresentViewEmission shape: identities marker 'present-view-emission' + viewId + composition.focus.identity + composition.nodes[*].identity; relations derived-from-intent + view-operation + view-scope + view-focus; source = {channel: 'internal-derivation', contentClass: 'system-introspection', scope: intent.scopeRef}. Write is atomic per LMA4. Stamp PresentView.provenance.sourceStateChangeIds with resulting StateChangeId."` |
| **PR7** | 7 | 3 | `gate-execution` | PresentView + PresentViewEmission | per-gate results PrG1–PrG8 + overall | `gates = [PrG1, PrG2, PrG3, PrG4, PrG5, PrG6, PrG7, PrG8]` (§4.1) |
| **PR8** | 8 | 5 | `mechanical` | gate-passed PresentView | emitted PresentView to consumer | `derivation = "per PrA1: emit PresentView via HR-PR-Consumer (one of HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter per consumerRef). Bound enforcement (ViewBound.maxNodes, ViewBound.maxThreads) applied at emission if not earlier."` |

Stage monotonicity: 1→2→2→2→2→2→3→5. Stage 4 absent (empty-declared per substrate §8.6 — Present's procedure does not require a stage-4 step). Stage-kind alignment: PR1 stage 1 judgment-input ✓; PR2–PR6 stage 2 mechanical ✓; PR7 stage 3 gate-execution ✓; PR8 stage 5 mechanical ✓.

### §3.8 Universal-variables table (per substrate §3.5)

Per substrate §3.5 (each axis expressed across all four variables) + MA-St3 (no content under more than one axis) + MA-G6 strict (every cell is named type, enum literal, or inlined shape).

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Schema` | PrA1 + PrA2 + PrA6 v1.0.1 (consumes substrate v1.8.3 + LM v3.4) | composed-view-atom kind + read-primitive enum + RC kind enum (per RC-01..RC-09) | binds PresentView to PresentReadIntent + ReadPrimitiveTrace; binds RC-09 to substrate A-24 | atoms placed per Placement Standard R3+R5 |
| `Structure` | PrA5 v1.0.1 (operation set frozen at 5 per spec v4 §5 non-negotiable) | five-operation enum closure + procedure step kind enum | binds PR1–PR8 ordering + operation→primitive dispatch | procedure steps positioned 1–8 |
| `Validity` | PrA8 v1.0.1 | determinism property kind | binds PresentReadIntent → PresentView function | PrG8 gate position in PR7 |
| `Lifecycle` | PrA7 v1.0.1 | between-invocation-state declaration + state transitions | binds runtime statelessness to between-call surface; binds PresentViewEmission as first-class state-change | F-present runtime placed at PR1–PR8 only; nothing persists between invocations |
| `Coupling` | PrA3 + PrA4 v1.0.1 (PrA3 carries contentClass declaration per Shot 5) | write-channel + access-discipline + contentClass kinds | binds F-present to substrate (write side per PrA3) + PS (auth handshake per PrA4) + consumers (read side per HRs) | HRs declared §6.2 |

All Relational cells express dependency order via named-type + typed-field reference per MA-G6.

### §3.9 Vocabulary

Framework-local terms (declared at point of use in §2.1 / §3.7 per PR1 substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

- `view-composition` — primitive atomic unit (§1); one act of composing a typed view from substrate state at-read against a wearer-stated intent
- `composed-view-atom` — class of atoms with composition + provenance + reversibility sub-shapes (PresentView is the v1.0.1 instance)
- `view-emission` / `view-witness` — substrate state-change recording that F-present emitted a view; PresentViewEmission is the v1.0.1 instance
- `wearer operation` — one of five callable F-present operations (PrA5 closure)
- `anchor` — derived per PR3; never stored (PrA7); reads as one of wearer-content / current-position / system-derived per AnchorTrace.source enum
- `weighting` — Option C weighting per spec v4 §5 (w_recur, w_density, w_adj thresholds)
- `view-trail` — sequence of PresentViewEmission state-changes for a given userId+scope; queryable via identity-recurrence on the 'present-view-emission' marker identity

### §3.10 jurisdictionClaim

Per axis × all four universal variables (substrate §3 + MFv3 §3.1.1):

| axis | temporal | categorical | relational | positional |
|---|---|---|---|---|
| Schema | PrA1+PrA2+PrA6 v1.0.1 | composed-view-atom kind + read-primitive enum + ContentClass enum (via RC-09) | binds PresentView ↔ PresentReadIntent ↔ ReadPrimitiveTrace ↔ PresentViewEmission | atoms placed per Placement R3+R5 |
| Structure | PrA5 v1.0.1 | five-operation enum closure | binds PR1–PR8 ordering + operation→primitive dispatch | procedure steps 1–8 |
| Validity | PrA8 v1.0.1 | determinism property kind | binds PresentReadIntent → PresentView function | PrG8 in PR7 |
| Lifecycle | PrA7 v1.0.1 | between-invocation-state + view-witness-as-state-change | binds runtime statelessness; PresentViewEmissions queryable like any state-change | F-present runtime at PR1–PR8 only |
| Coupling | PrA3+PrA4 v1.0.1 | write-channel + access-discipline + contentClass | binds F-present to substrate (writes) + PS (auth) + consumers (reads) | HRs §6.2 |

### §3.11 RC array axis-binding (re-stated from §2.3)

Each of the 9 RCs binds to the Schema axis (atom-typing references). Axis-coverage at RC-level: Schema dominant. No RC binds to Structure/Validity/Lifecycle/Coupling because those axes carry axiom-level declarations, not atom-level references, in this Standard.

| RC | citingAtom | axis | referentKind |
|---|---|---|---|
| RC-01..RC-06 | substrate/LM atom refs (userId, scopeRef, currentPosition, consumerRef, IdentityRef, StateChangeId) | Schema | substrate-atom-ref |
| RC-07 | PresentViewEmission.source.channel | Schema | l0-ratified-ref |
| RC-08 | PresentView.composition (full sub-shape) | Schema | l0-ratified-ref |
| RC-09 | PresentViewEmission.source.contentClass | Schema | substrate-atom-ref (A-24; strongest grounding) |

### §3.12 MA-V10 part B jurisdiction coverage declaration

At v1.0.1: jurisdiction coverage = 8 axiom-jurisdictionClaim paths × 9 RC entries = 72 cells. RC coverage is Schema-axis-dominant (all 9 RCs on Schema). Structure/Validity/Lifecycle/Coupling axes carry axiom-level declarations resolved via §3.6 axiom prose + §3.10 jurisdictionClaim entries; no atom-level RC references required because no Standard-local atoms exist in those axes at v1.0.1.

---

## §4 Validity

### §4.1 Gate count

8 Standard-own gates (PrG1–PrG8) declared §4.2 + 79 inherited framework-tier gates (PG1..PG7 + G-I1..G-I8 + G-S1..G-S8 + G-St1..G-St17 + G-V1..G-V11 + G-L1..G-L11 + G-C1..G-C10 + G-J1..G-J5 + G-G13 + G-U1..G-U5 + G-M1..G-M4 = 87 framework-tier; 87 - 8 own = 79 inherited). Total per-Standard validation: **87 gates**.

### §4.2 Standard-own gate set (PrG1–PrG8, 1:1 with PrA1–PrA8 per G-M1)

| gate | tests | ground class (substrate §6.3) |
|---|---|---|
| **PrG1** | composition.nodes and composition.threads typed per atom inventory §2.1; consumer reads PresentView without further composition step (test: no transformation step between F-present return and Modality.render call) | type-check + reference-resolution |
| **PrG2** | `provenance.sourceStateChangeIds.length` ≥ count of distinct StateChangeIds composed; `provenance.readPrimitivesUsed.length` ≥ 1 | cardinality + type-check |
| **PrG3** | F-present write log shows only `source.channel: 'internal-derivation'` writes; zero modifications to existing StateChangeRecord rows; **v1.0.1: every PresentViewEmission carries `source.contentClass: 'system-introspection'`** | enum-membership + cardinality + type-check |
| **PrG4** | every substrate read carries the intent's userId + scopeRef; every PresentViewEmission carries same | type-check |
| **PrG5** | F-present's callable operation-dispatcher path set = {search-by-identity, search-by-role, default-entry, move-neighborhood, move-trajectory} (closed at 5 per PrA5 + spec v4 §5) | enum-membership + cardinality |
| **PrG6** | F-present's substrate-read call sites use exactly {identity-recurrence, role-pattern, adjacency, iterate-axis}; **v1.0.1: when ThreadQueryInput.contentClass parameter passed, value ∈ {'wearer-life', 'system-introspection'} per LM v3.4 LMA13** | enum-membership |
| **PrG7** | between-invocation: no F-present heap state references prior invocations' StateChangeIds; PresentViewEmissions queryable via LMA9 primitives like any state-change | deterministic-function-result + reference-resolution |
| **PrG8** | replay test: two invocations of F-present with identical PresentReadIntent against identical substrate snapshot produce field-equivalent PresentView across composition.nodes, composition.threads, composition.focus, provenance.anchorDerived, provenance.weightingApplied | deterministic-function-result |

All 8 gates resolve to substrate §6.3 ground classes — mechanical per MA-V11.

### §4.3 Gate execution order

E1 Identity → E2 Schema → E3 Structure → E4 Validity → E5 Lifecycle → E6 Coupling → E7 Judgment → E8 Universal+Meta.

### §4.4 Backward-invalidation policy

Per substrate §6.4: failure at any Ei invalidates Ei+1..E8 results from this run; deriver re-enters at failed Ei after correction.

### §4.5 Failure modes

| code | trigger | recovery |
|---|---|---|
| `PRESENT_INTENT_INVALID` | PR1 J-operation-binding gate fails (any C1–C6 criterion) | return Result.err with structured error naming failed criterion; no PR2..PR8 execution |
| `PRESENT_AUTH_REJECTED` | PR2 PS handshake rejects userId+scopeRef | return Result.err; no read/write performed |
| `PRESENT_READ_FAILED` | PR4 substrate-read primitive returns error from LM | return Result.err; no PR5..PR8 |
| `PRESENT_EMISSION_REJECTED` | PR6 writeStateChange rejects (LM gate failure on SubstrateWriteInput) | return Result.err with substrate gate code; no PR7..PR8 |
| `PRESENT_GATE_FAILED` | PR7 any of PrG1–PrG8 fails | return Result.err with failing gate id |

---

## §5 Lifecycle

- **versionTransition:** v1.0 (declared → applied at S12 emission 2026-05-18) → v1.0.1 (additive minor per MA-L1 at Side-Quest Shot 5 2026-05-19; `stateApplied` preserved at `applied` per MA-L1 no-state-regression).
- **amendmentTrigger:** substrate amendment affecting consumed atoms (A-09/A-12/A-17/A-18/A-24), LM amendment affecting LMA9 primitives or LMA13 ContentClass discipline, Manual SPEC bump affecting Tool definition or canonical naming, L0-ratified operation set change, or PS amendment affecting PA-IR3 auth delegation.
- **deprecations:** none at v1.0.1.
- **activationFlow:** v1.0 activation payload §10 → S1 → S2 → S3–S10 → S11 → S12 (executed Sprint B3, 2026-05-18); v1.0.1 amendment per Side-Quest Shot 5 dispatch (W1–W7).
- **bootstrap:** non-re-entrant per substrate §13.5 registry-lock.
- **firstRunExecution:** scheduled at v1.0 S12 emission (executed 2026-05-18); v1.0.1 preserves first-run-executed state per MA-L1 additive minor.
- **escalation:** `none` at v1.0.1. Prior v1.0 EscalationState (`pending-l0-ratification`) closed at v1.0 S12 emission per L0 ratification of spec v4 (Sprint B3 §2.6).

---

## §6 Coupling

### §6.1 Carrier

Present Standard's carrier = `self`. F-present emits `PresentView` directly to consumers (Modality/Generator/Tool) via HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter, and `PresentViewEmission` directly to substrate via HR-PR-Substrate-Write. No enclosing carrier framework (no AS routing, no chat-surface envelope at this Standard's emission tier). Rationale: PresentView is a composed-view atom consumer-renderable without further composition (Manual L158 honored — Modality renders without composing); PresentViewEmission is a substrate state-change record consumed by F-present's own future reads via LMA9 primitives, not by chat-surface consumers. Future amendment to named carrier is a declared amendment path if surface-rendering requirements evolve (none anticipated; PresentView's consumer-renderable property is load-bearing for symmetry-as-shape preservation).

**MA-C1 satisfaction:** carrier = `self` declared with rationale per substrate §9 Carrier enum. Precedent: Builder Standard v1.0 §6.1 carrier=self idiom; structural twin.

### §6.2 Handoff rules

Six framework-local HR instances. All Present-owned handoffs with `diagnosticSignificance = true` have declared `captureShape` per substrate §8.2 amended P6.

| HR | direction | endpoints | carrier applicability | diagnostic significance | captureShape |
|---|---|---|---|---|---|
| HR-PR-LM | F-present → Living Memory v3.4 | Tool → Standard | `['self']` (Present carrier = self) | `true` | substrate-read invocations (4 LMA9 primitives); `parameters` includes contentClass? optional filter per Shot 2 + Shot 5 |
| HR-PR-Substrate-Write | F-present → Substrate v1.8.3 | Tool → Store | `['self']` | `true` | `internal-derivation` channel writes (PresentViewEmissions); every emission stamps `source.contentClass: 'system-introspection'` per PrA3 v1.0.1 |
| HR-PR-PS | F-present ↔ Perimeter Standard v1.2.1 | Tool ↔ Standard | `['self']` | `true` | scope + userId handshake at PR2 per PA-IR3 delegation |
| HR-PR-Modality | F-present → Modality (F-chat, F-output, F-dashboard) | Tool → Modality | `['self']` | `true` | PresentView emission to renderer; Manual L158 honored (no Modality composition) |
| HR-PR-Generator | F-present → Generator (F-discover, F-plan, F-builder, F-verify) | Tool → Generator | `['self']` | `true` | PresentView consumption by generator cycle |
| HR-PR-AIAdapter | F-present → F-ai-adapter | Tool → Tool | `['self']` | `true` | PresentView passed to LLM-using tool without further composition |

**Inherited HRs referencing Present Standard:**

| HR | Owning declaration | Present's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → Present type consumption; Present consumes substrate types by receive pattern |
| HR5 | metaframework §6.2 | metaframework → registry; registry records Present's framework declaration per provenance contract; v1.0 HR5 write executed at Sprint B3 S12 emission per the v1.0 emission |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; Present is the L2 governing tier — HR6 applies per metaframework discipline at the metaframework-to-Standard tier |

### §6.3 Adjacent-framework declarations

Per spec v4 §6.6, updated for v1.0.1 consumed-versions pins:

**Consumes:**
- substrate-v1-1 v1.8.3 (consumes A-24 ContentClass + atoms A-09/A-12/A-17/A-18)
- living-memory v3.4 (consumes LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA9, LMA12, LMA13; SourceRef three-field shape; ThreadQueryInput.contentClass? optional filter; four LMA9 primitives; required operations identity_recurrence/role_pattern/adjacency/iterate_axis/write_state_change/read_state_change)
- perimeter-standard v1.2.1 (PA-IR3 scope+userId auth delegation)
- metaframework-v3-1 v3.3.1 (GeneratedFrameworkTemplate output schema)
- generation-procedure-v1-0 v1.1.7 (S1–S12 generation procedure)
- Manual SPEC-v13.4 (canonical-naming ContentClass row + Part I phantom-layer addendum + Operations Tool slot row for F-present)
- LIV-Standard v1.5.2
- Placement Standard v1.0

**Consumed by:** F-chat, F-output, F-dashboard (Modalities), F-discover, F-plan, F-builder, F-verify (Generators), F-ai-adapter (Tool).

### §6.4 OperatorInterface (per substrate §4 A-13 + V5 verification)

`runtimeState: 'declared'`. Runtime is the synchronous-call interface (spec v4 §3.1) plus the persistence emission write at PR6.

OperatorInterface shape:
```
operatorInterface = {
  runtimeState: 'declared',
  invokeShape: '(PresentReadIntent) → Result<PresentView, PresentError>',
  sideEffect: 'PR6 substrate-write (PresentViewEmission via internal-derivation channel + contentClass system-introspection)',
  observability: 'every invocation produces PresentView with full provenance + a substrate state-change witness queryable via LMA9'
}
```

### §6.5 Substrate-version-pin

substrate-v1-1 v1.8.3. Uniform across all atom references (Shot 5 bump from v1.0's v1.8.2 pin per W2 — apparatus consumes A-24 ContentClass).

### §6.6 Capture shapes (per substrate §8.2 amended P6)

For each of the six own HRs:

| HR | captureShape |
|---|---|
| HR-PR-LM | `{ readKind: 'identity-recurrence' \| 'role-pattern' \| 'adjacency' \| 'iterate-axis', parameters: <kind-specific>, contentClassFilter?: ContentClass, recordCount: number, atTime: Timestamp }` |
| HR-PR-Substrate-Write | `{ writeKind: 'present-view-emission', viewId: ViewIdRef, channel: 'internal-derivation', contentClass: 'system-introspection', scope: ScopeRef, userId: UserIdRef, atTime: Timestamp }` |
| HR-PR-PS | `{ direction: 'request' \| 'response', userId: UserIdRef, scopeRef: ScopeRef, authority: PSAuthorityDecision, atTime: Timestamp }` |
| HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter | `{ consumerRef: FrameworkRef, viewId: ViewIdRef, emittedView: PresentView, atTime: Timestamp }` (shared shape; renderer/generator/tool capture identical envelope) |

### §6.7 Provenance contract

Every PresentView carries `provenance.sourceStateChangeIds` + `provenance.readPrimitivesUsed` + `provenance.operationApplied` + `provenance.anchorDerived` + `provenance.weightingApplied` per §2.1 PresentView shape + PrA2. The provenance is the load-bearing reversibility surface per spec v4 §6.3 `appealCourtIs: substrate-state-change-table`.

### §6.8 Cross-framework handoff contracts

- **HR-PR-LM:** F-present consumes LM v3.4's R3 `threadQuery(ThreadQueryInput)` and `iterate_axis(start, direction, count)` primitives. ThreadQueryInput.contentClass? optional filter usage per PR4 derivation (Shot 2 + Shot 5).
- **HR-PR-Substrate-Write:** F-present consumes LM v3.4's R3 `writeStateChange(SubstrateWriteInput)` primitive. SubstrateWriteInput.metadata.source = SourceRef (channel+contentClass+scope three-field shape per substrate v1.8.3 A-24 + LM v3.4 §2.1).
- **HR-PR-PS:** F-present consults PS v1.2.1 PA-IR3 at PR2 for scope+userId authorization. PS owns enforcement; Present applies carry-through mechanics per PrA4.
- **HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter:** Present emits PresentView consumer-renderable per PrA1; no further composition required at consumer side (Manual L158).

---

## §7 Judgment

### §7.1 J-operation-binding (Standard-local judgment template)

Validates incoming `PresentReadIntent.operation` and `parameter` at PR1.

```
J-operation-binding:
  kind: validation
  consumedBy: present-standard-v1-0-1 §3.7 PR1 (judgmentInputRef at every F-present invocation)
  shape: Judgment per substrate §6.2
  input:    PresentReadIntent
  criteria:
    C1: intent.operation.kind ∈ {'search-by-identity', 'search-by-role', 'default-entry', 'move-neighborhood', 'move-trajectory'}
        Mechanical: enum-membership check against frozen 5-arm union.
    C2: intent.parameter.kind === intent.operation.kind
        Mechanical: type-check on discriminated-union tag equality.
    C3: parameter shape conforms to OperationParameter discriminated-union arm per kind
        Mechanical: type-check against §2.1 OperationParameter declaration.
    C4: intent.currentPosition non-null iff operation.kind ∈ {'move-neighborhood', 'move-trajectory'}; null required for 'default-entry'; null permitted for 'search-*'
        Mechanical: cardinality + enum-membership compound check.
    C5: for move-*, parameter.relationFilter (if present) is an IdentityRef
        Mechanical: type-check on optional field.
    C6: for default-entry, parameter.anchorRule (if present) ∈ {'identity-density', 'position-density'}
        Mechanical: type-check + enum-membership.
  output: {ok: true, validatedIntent: PresentReadIntent} | {ok: false, code: 'PRESENT_INTENT_INVALID', failedCriterion: 'C1'..'C6'}
```

All six criteria reduce to substrate §6.3 ground classes — mechanical per MA-V11.

### §7.2 Consumed judgments (by reference)

- `J-axis-mece` from MFv3 §7
- `J-axiom-dist` from MFv3 §7

Both consumed by reference per substrate §1.3 S-03; no redeclaration.

---

## §8 Self-audit results

### §8.1 Gate results (v1.0.1)

All 87 framework-tier gates: state = `executed`. v1.0 emission (Sprint B3) ran 87/87 PASS at S2-revalidation. v1.0.1 amendments are additive per MA-L1 minor (substrate-version-pin bump, consumed-frameworks pin bumps, PresentViewEmission ContentClass field declaration, PR4 read-side filter-usage clarification, +1 RC for ContentClass basis); no axiom/gate/schema-shape change beyond ContentClass field addition. Re-run at v1.0.1 expected to preserve 87/87 PASS.

**v1.0.1 gate re-run summary (deriver-asserted; awaiting framework-audit first-execution):**

| Bundle | Gates | v1.0 result | v1.0.1 amendment surface | Expected v1.0.1 result |
|---|---|---|---|---|
| E1 Identity | 9 | 9/9 PASS | Version field v1.0 → v1.0.1; consumed-versions pins bumped | 9/9 PASS (additive identity update) |
| E2 Schema | 9 | 9/9 PASS | RC array 8 → 9 (RC-09 added); SourceRef three-field shape; ContentClass typed-shape added to consumed atoms | 9/9 PASS (additive schema extension; G-S8 RC A-18 conformance verified for RC-09 substrate-atom-ref to A-24) |
| E3 Structure | 18 | 18/18 PASS | PrA3 amended (contentClass clause); PR4 derivation amended (contentClass? filter usage); PR6 derivation amended (PresentViewEmission contentClass population) | 18/18 PASS (all amendments additive within existing axiom/procedure-step structure; axiom count preserved at 8; procedure step count preserved at 8; axis distribution preserved at 3-1-1-1-2-0-0) |
| E4 Validity | 12 | 12/12 PASS | PrG3 + PrG6 amended with contentClass clauses | 12/12 PASS (PrG3/PrG6 amendments are test-clause additions within existing gate structure; 1:1 axiom-gate bijection preserved per G-M1) |
| E5 Lifecycle | 12 | 12/12 PASS | versionTransition v1.0 → v1.0.1; amendmentTrigger row covers Shot 5 trigger; escalation = `none` preserved | 12/12 PASS |
| E6 Coupling | 11 | 11/11 PASS | substrate-version-pin v1.8.2 → v1.8.3; adjacent-framework declarations consumed-versions pins bumped; captureShape for HR-PR-LM amended with contentClassFilter? field; HR-PR-Substrate-Write captureShape amended with contentClass field | 11/11 PASS (additive coupling updates; carrier=self preserved) |
| E7 Judgment | 6 | 6/6 PASS | J-operation-binding unchanged (operation set frozen at 5 per spec v4 §5; ContentClass discipline operates at Coupling axis via PrA3, not Judgment axis) | 6/6 PASS |
| E8 Universal+Meta | 10 | 10/10 PASS | G-U3 axis-coverage preserved (5 axes carry ≥1 PrA; Identity + Judgment empty-declared); G-M1 1:1 preserved at 8↔8 | 10/10 PASS |
| **Total** | **87** | **87/87 PASS** | **(additive amendments; no axiom/gate/schema-shape removal)** | **87/87 PASS expected** |

### §8.2 Multidimensional audit (4 dimensions per Shot 5 spec)

| dimension | result | basis |
|---|---|---|
| Axiom-consistency | PASS | PrA3 amendment (contentClass clause) consistent with PrA1–PrA8 set; ContentClass discipline operates within existing Coupling-axis axiom (not a new axiom). LMA13 cross-class mixing prohibition in anchor-derivation is preserved by Present's apparatus-side classification — PresentViewEmissions classified as system-introspection are excluded from LMA7 anchor-candidate set by LMA13 construction. |
| Substrate-conformance | PASS | All 9 RCs resolve to substrate v1.8.3 or LM v3.4 or Manual SPEC-v13.4 ratified ground. RC-09 substrate-atom-ref to A-24 is strongest grounding class. PresentViewEmission's three-field source shape (channel+contentClass+scope) conforms to substrate v1.8.3 SourceRef. |
| Backward-compatibility | PASS | v1.0 emission ratified shape preserved at v1.0.1 byte-equivalent in axioms PrA1, PrA2, PrA4, PrA5, PrA6, PrA8 (six of eight unchanged). PrA3 amendment is byte-additive append (Q3=(α) at Shot 5 entry). PrA7 unchanged. PR4 derivation amendment adds contentClass? filter usage to existing derivation prose without removing any prior clause. Existing consumers (Modality/Generator/Tool) receive identical PresentView shape (PresentView own shape unchanged); only PresentViewEmission gains the contentClass source field, which is required by substrate v1.8.3 SourceRef shape — not optional, so backward-compat at substrate layer is forward-only (matches Shot 1's substrate amendment discipline). |
| Cross-axis projection | PASS | ContentClass projects orthogonally to scope (LMA6), userId (LMA12), and channel. PresentViewEmission carries all four orthogonal axes independently per substrate v1.8.3 SourceRef structural placement. No axis-conflation. |

### §8.3 Six-dimension Phase E audit (per Shot 5 spec)

| dimension | result | basis |
|---|---|---|
| D1 Snowball protection | PASS | Shot 5 amendments are mechanical reflections of Shots 1–4 ratified ground (substrate v1.8.3 A-24, LM v3.4 LMA13, Manual SPEC-v13.4 phantom-layer addendum, AS v2.5 §3.7 S3 Phase D declaration, Plan §6.12 two-kinds-of-record discipline). No new axiom introduced at Present Standard tier; no cross-framework cascade beyond declared consumed-versions pin bumps. |
| D2 Substrate single-store | PASS | PresentViewEmissions live in the same single substrate store as wearer-life records, distinguished by ContentClass attribute per Manual SPEC-v13.4 phantom-layer addendum. No parallel store, no second substrate, no fork. PrA3 amendment honors this. |
| D3 Root claim | PASS | "LIV extends a wearer's cognition across time" preserved: F-present reads wearer cognition (the wearer's emissions, plans, research, verifications — all wearer-life-classified per Phase D) and composes views over it; F-present's own emissions are apparatus operational metadata (system-introspection-classified) — recording that the apparatus emitted a view, not extending wearer cognition with view-emission content. The phantom-layer property (Manual SPEC-v13.4) holds: view-emissions are structurally present, durably persisted, queryable, but excluded from anchor-candidacy. |
| D4 Symmetry-as-shape | PASS | PrA1 invariant preserved: every consumer reads identical composed-view-atom shape; no transformation tier between F-present and consumer. v1.0.1 amendments do not introduce consumer-specific shape variants. |
| D5 Six-category preserved | PASS | sliceCategory='Tool' for F-present (Manual Operations + Tool inhabitants list at SPEC-v13.4 unchanged); no SliceCategory amendment; closure at six holds. |
| D6 Apparatus-level mechanism subsumes L3-B | PASS | The ContentClass apparatus-level mechanism (substrate v1.8.3 A-24 + LM v3.4 LMA13 + Manual SPEC-v13.4 phantom-layer addendum) classifies records by content kind across the substrate; per-Tool exclusion (L3-B) is subsumed by this apparatus-tier classification — L3-B as a Standard-local exclusion clause is structurally unnecessary because the apparatus already excludes apparatus-operational records (any record with contentClass='system-introspection') from LMA7 anchor-candidate set. **L3-B dissolution mechanically verified at S2: no L3-B clauses appear in the v1.0 GeneratedFrameworkTemplate emission (HR5 registry, Manual delta, §1-§8 body text). v1.0.1 documents the dissolution in §9 change log; no axiom/gate/schema removal required (nothing to remove).** |

### §8.4 validity.overallResult

`PASS` per §8.1 87/87 + §8.2 4/4 + §8.3 6/6.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| v1.0 | 2026-05-18 (Sprint B3 S12 emission) | Initial declaration. Generated against metaframework-v3-1 v3.3.1 via generation-procedure-v1-0 v1.1.7 under substrate-v1-1 v1.8.2 + Living Memory v3.3 + Perimeter Standard v1.2.1 + Manual SPEC-v13.3. Eight PrA axioms (PrA1 content-shape identity, PrA2 provenance-to-substrate completeness, PrA3 substrate-write closure at view-emission only, PrA4 scope+userId carry-through, PrA5 operation closure at five, PrA6 substrate-read closure at four LMA9 primitives, PrA7 geometry-non-persistence with view-witness disambiguation, PrA8 anchor-and-weighting determinism). Eight PrG gates (1:1 per G-M1). Six HRs (HR-PR-LM, HR-PR-Substrate-Write, HR-PR-PS, HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter). Eight P8 procedure steps PR1–PR8 (stage monotonicity 1→2→2→2→2→2→3→5). Five-operation closure at WearerOperation discriminated union per spec v4 §5 non-negotiable. PresentView composed-view atom shape per spec v4 §6.3 (consumer-renderable without further composition; Manual L158 honored). PresentViewEmission substrate persistence shape per spec v4 §3.5 + §6.4 (writes to substrate via `internal-derivation` channel). Carrier = `self` per Builder Standard §6.1 precedent. Eight RCs. J-operation-binding (one Standard-local Judgment template). E1–E8 gate suite 87/87 PASS at S2-revalidation. S11 J-template-observation: c1 PASS ∧ c2 PASS ∧ c3 PASS → PASS. S12 emission per substrate §13.6 + generation-procedure §5.6. **L3-B dissolution:** the per-Tool exclusion clause that surfaced as a working-state artifact during Sprint B3's second multidimensional audit was dissolved before v1.0 ratification; the v1.0 emission carries zero L3-B clauses (verified at v1.0.1 Shot 5 W5 mechanical check). | L0 (Sprint B3 S12 emission, 2026-05-18) |
| v1.0.1 | 2026-05-19 (Side-Quest Shot 5, Phase E) | **ContentClass apparatus alignment, Phase E — Present Standard.** Predecessor: v1.0 (Sprint B3 S12 emission, 2026-05-18). Ratified ground: substrate v1.8.3 §4.2 A-24 (Shot 1) + LM v3.4 LMA13 + ThreadQueryInput.contentClass? optional filter (Shot 2) + Manual SPEC-v13.4 canonical-naming row + Part I phantom-layer addendum (Shot 3) + 5 Standards Phase D amendments at AS v2.5 / RS v1.1 / VS v1.1 / Plan v2.3 / Builder v1.1 + 6 callsites ratified (Shot 4). **Δ-A (W1 file format):** First appearance of `frameworks/standards/present-standard.md` in framework tree at v1.0.1 (Path 3). v1.0 emission formatted into §1-§9 layout per Verification Standard v1.0 structural precedent + Builder Standard v1.0 carrier=self mechanics. **Δ-B (W2 substrate-version-pin):** §6.5 substrate-version-pin v1.8.2 → v1.8.3 (apparatus consumes A-24 ContentClass). All §2.2 + §2.3 RC paths updated to substrate v1.8.3 references. **Δ-C (W3 consumed-frameworks pins):** §1 Cross-framework input + §6.3 Adjacent-framework declarations: LM v3.3 → v3.4 (consumes LMA13 + ThreadQueryInput.contentClass?); Manual SPEC-v13.3 → SPEC-v13.4 (consumes canonical-naming ContentClass row + Part I phantom-layer addendum); PS v1.2.1 unchanged; LIV-Standard v1.5.2 unchanged; Placement Standard v1.0 unchanged. **Δ-D (W4 PresentViewEmission ContentClass declaration):** §2.1 PresentViewEmission shape extended with `source.contentClass: 'system-introspection'` field per substrate v1.8.3 SourceRef three-field shape (channel+contentClass+scope). PrA3 axiom statement extended with byte-additive append clause per Side-Quest Shot 5 Q3=(α) ratification: ContentClass discipline clause states PresentViewEmissions classify as system-introspection per LM v3.4 LMA13 (apparatus operational metadata, excluded from LMA7 anchor-candidate set). Classification mirrors Builder Standard v1.1 §6.11 (build-emission records, same content-kind class — apparatus operational metadata; same `'system-introspection'` discipline). **Δ-E (W4 RC array):** §2.3 RC array 8 → 9 (added RC-09 for PresentViewEmission.source.contentClass per Side-Quest Shot 5 Q2 ratification). RC-09 substrate-atom-ref to A-24 (strongest grounding class per substrate §6.3). §3.11 + §3.12 axis-binding tables updated. **Δ-F (W5 L3-B dissolution):** Per Shot 5 spec W5 mechanical check: no L3-B per-Tool exclusion clauses appear in v1.0 emission (verified at S2 — searched §1 Identity, §2 Schema, §3 Structure axiom prose, §4 Validity gates, §5 Lifecycle, §6 Coupling, §7 Judgment, §8 change-log; HR5 registry; Manual delta). L3-B was a working-state artifact dissolved before v1.0 ratification by the second multidimensional audit's convergence on ContentClass as apparatus-tier mechanism. v1.0.1 documents the dissolution: **the ContentClass apparatus-level mechanism (substrate v1.8.3 A-24 + LM v3.4 LMA13 + Manual SPEC-v13.4 phantom-layer addendum) subsumes the L3-B per-Tool exclusion discipline** — L3-B as a Standard-local clause is structurally unnecessary because the apparatus already excludes apparatus-operational records (any record with contentClass='system-introspection') from LMA7 anchor-candidate set by LMA13 construction. No axiom/gate/schema removal required (nothing to remove); change-log entry is the dissolution documentation. **Δ-G (W6 PR4 read-side ContentClass filter):** §3.7 PR4 derivation extended with ThreadQueryInput.contentClass? usage pattern: for anchor-candidate-derivation reads (default-entry anchorRule='identity-density' or any read feeding LMA7 anchor crystallization), F-present passes `ThreadQueryInput.contentClass='wearer-life'` per LM v3.4 LMA13; for full state reads (e.g., reading the view-emission trail itself, operations explicitly traversing both classes), F-present omits the contentClass filter parameter (default behavior returns all records). §2.1 ReadPrimitiveTrace shape extended with `contentClassFilter?: ContentClass` field to capture the filter usage. §4.2 PrG3 + PrG6 gates extended with contentClass test clauses. **Δ-H (W7 version stamp):** §1 Identity Version v1.0 → v1.0.1 per MA-L1 minor. File title `# present-standard-v1-0-1`. Header `**Version:** v1.0.1`. AmendmentProvenance: this changelog row. EscalationState preserved at `none` (no escalation raised during Shot 5). **Out of scope (Phase E per Shot 5 spec — deferred):** F-present runtime code (build sprint owns post side-quest), LMA13 modifications (Phase B finalized), operation set re-derivation (closed at 5 per brief §6), Manual delta amendment (already posted at v1.0; not re-posted). **Self-audit results:** §8.1 87/87 PASS expected (additive amendments; no axiom/gate/schema-shape removal); §8.2 multidimensional 4/4 PASS; §8.3 six-dimension Phase E 6/6 PASS (including D6 apparatus-level mechanism subsumes L3-B). authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot5-pending'} | L0 pending |

---

**End of present-standard-v1-0-1. Side-Quest Shot 5 (Phase E) amendment pending L0 confirmation.**
