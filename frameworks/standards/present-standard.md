---
kind: framework
placement: frameworks/standards/
---

# present-standard-v6-0

**Kind:** Framework
**Level:** L2
**Mode:** epistemic (unknown → known)
**Version:** v6.0
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1
**Predecessor:** `present-standard.md` v5.0 — the Sprint B3 present-structure re-derivation, carried in the held `sprint-b3-present-v5` package. v5.0 is the R3-confirmed amendment base. v6.0 is the **tree-of-stacks re-derivation** (Sprint B3 — present v5.0 → v6.0): the present's *internal model* is re-derived. The present is **one connected tree of stacks** — every node (identity) and every edge (relation) is an append-only stack of state-changes, latest = surface, the rest = depth; identity and relation are symmetric carriers. A present is read through **the grid** — four questions (WHERE, HOW MUCH, WHAT STATE, WHEN) over two carriers — with WHAT STATE and WHEN collapsing to one cell (the stack read at a depth). F-present is operated through **three controls** — camera (anchor), lens (granularity), temporal dial (history) — and **every action opens a window**; windows accumulate. The present carries **authorship** per state-change (the user's vs the LLM's). v5.0's *outer* model — the loop, the non-emitter property, the per-user archive, scrub-back as an archive lookup, the substrate/present split, the LLM as gravity — is correct and is **carried unchanged in substance**. v5.0 was derived against a §16 that modelled the present's internals as a flat-node/flat-edge snapshot; that §16 is superseded by the tree-of-stacks §16, and v5.0 is **superseded**. v6.0 is a MAJOR version that moves **no P-primitive count** (only RC 8→9) — the re-derivation re-shapes schema atoms and the content of axioms/gates/steps, it does not move the framework skeleton.
**Cross-framework input:** substrate-v1-1 v1.8.3 (consumes A-09/A-12/A-17/A-18; A-24 ContentClass consumption dropped — F-present is a non-emitter, [R1]; `SourceRef.channel` is read for per-state-change **authorship**, [R14]), Living Memory v3.5 (consumes LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA8, LMA9, LMA10, LMA12, LMA13; ThreadQueryInput.contentClass? optional read-side filter; scrub-back is an archive lookup, [R16]), Perimeter Standard v1.2.1 (delegation per PS PA-IR3 for scope+userId access authority), Manual SPEC-v13.4 (Part I phantom-layer addendum; the per-user snapshot-archive store named at v5.0 — carried unchanged at v6.0), LIV-Standard v1.5.2, Placement Standard v1.0
**Authority:** L0 ratification occurs AFTER derive + derive-tier audit + build + build-tier audit (see §9 change log). This document is a derive artifact pending L0 confirmation.

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus self-audit results and change log per v3-1-spec §4.4 file-specific placement).

Present Standard is the L2 epistemic-mode framework governing F-present at L3. F-present is the runtime program that resolves substrate state into a typed present.

**v6.0 re-derivation — the present is one tree of stacks.** F-present is the **read side**. The substrate is the **write side** — a flat, append-only ledger of typed state-changes (MA1–MA6, frozen) that carries the append index, so *time* is already in the substrate (working-record §16.1, [R1]). F-present does exactly one transformation: it reads that flat ledger and resolves it into the **present** — and the present is **one connected tree of stacks** ([R3]/[R4]). One tree rooted on the user. Every **node** is an identity; every **edge** is a relation; and every node and every edge **is a stack** — an append-only sequence of state-changes ordered by the substrate append index, the latest being the **surface**, the rest the **depth**. The tree extends two ways: **outward** — structure, identities connected to identities; and **backward** — history, each stack's depth. These are the two axes the substrate has, and the present has exactly these two. Identity and relation are **symmetric carriers** ([R5]) — the same shape, a stack with a surface and a depth. F-present **holds the live present** as working state, **archives every resolved present** to its own per-user store in the LIV database, and **writes nothing to the substrate** — it is a **non-emitter** ([R1]). The governing discipline: anything F-present appears to do that the substrate already does, or that a caller must hardcode to a constant, is **residue** and is deleted ([R2]).

v5.0 corrected the *query* residue (`focus`, `ordering`, the one-level bound). v6.0 re-derives the present's **internal model** — what a node, an edge, the projection, and the operation's controls *are*. v5.0 modelled a node as a flat value and an edge as a flat `{parent, child, thickness}` triple; v6.0 re-derives both to **stacks** ([R4]) — the substrate accumulates state-changes and never deletes (MA3 supersession), so any carrier is inherently a stack, not a flat value; the flat edge in particular under-modelled a relation, dropping its history ([R5]). A present is read through **the grid** — four questions over two carriers ([R6]) — and F-present is operated through **three controls** with **every action opening a window** ([R9]/[R12]). The residue this re-derivation deletes: the `recency` field (a frozen pre-computed motion substitute — motion is the temporal dial run across a span, [R11]) and the `resolvedAt` field (redundant — `standpoint` plus frame identity already position a frame, [R11]). v5.0's *outer* model is carried unchanged in substance — the loop, the non-emitter property, the per-user archive, scrub-back as an archive lookup, the substrate/present split, the LLM as gravity ([R1]/[R15]/[R16]/[R17]/[R18]). LMA8 is honored throughout: LMA8 forbids *the substrate* storing derived geometry; the tree of stacks F-present holds and archives is F-present's own — held state and a per-user LIV-database store, never the substrate ([R1]).

Present Standard is **distinct from F-present (the L3 program it governs)**: Present Standard declares the typed shape F-present produces and holds — the contract and discipline; F-present at L3 executes against the contract. Present Standard is **distinct from Living Memory v3.5** (substrate-tier governance of state-change writes and read primitives at LMA9): LM declares the substrate-side primitives F-present consumes; Present Standard declares F-present's resolution-and-hold discipline over those primitives.

**v6.0 derivation basis.** This Standard is derived from **§16 + §16-REF + §16-HIST of `substrate-present-rederivation-working-record.md`**, L0-confirmed — §16 the tree-of-stacks structure, §16-REF ([R1]–[R20]) the mechanism layer behind each marked claim, §16-HIST the rework trail. This §16 supersedes the prior snapshot-internals §16 *whole* — the supersession is total. v5.0's engine — the dependency walk, chain-ping summation, the gate harness — is carried; the re-derivation re-shapes what the walk *produces* (a tree of stacks, not a flat snapshot) and the present's read- and control-model, not the framework skeleton. The derive-and-build spec `b3-present-v6` is the L0-issued structural translation of §16 into this Standard and the F-present slice. Every structural move below carries its §16-REF marker.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Present Standard` |
| `kind` | `Framework` (per substrate §4 A-10 Kind enum; consumed by reference; string-typed) |
| `mode` | `epistemic` (per substrate §2 Mode enum; `unknown → known`) |
| `level` | `L2` (per substrate §5 AuthorityLevel; governs L3 F-present program) |
| `version` | `6.0` (per substrate §7 Semver; predecessor v5.0 → **v6.0, major**. Per MA-L1 a breaking, wearer-facing-contract change classifies **major**. v6.0 re-derives the present's internal model: the node atom and `FrameEdge` are re-shaped to stack-carrying, the projection atom carries structure at the granularity-cutoff extent, the intent envelope is re-stated against the three-control model, and the `recency`/`resolvedAt` fields are deleted. It moves **no P-primitive count** — the only count move is RC 8→9 (see §3.2). Predecessor `present-standard.md` v5.0 — the held `sprint-b3-present-v5` package, R3 amendment base.) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `applied` (preserved across v5.0→v6.0; v6.0 is an internal-model re-derivation of an already-applied L3 program, not a re-genesis — F-present remains a live registered slice) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `sliceCategory` | `Tool` (per substrate §1.5 SliceCategory enum at six-value closure post-Manual SPEC-v13.3; F-surface sibling-precedent per Manual L287) |
| `carrier` | `self` (F-present projects the present directly to consumers via HR-PR-Modality/HR-PR-Generator/HR-PR-AIAdapter; no enclosing carrier framework per §6.1 + Builder Standard v1.0 §6.1 carrier=self precedent. F-present makes no substrate write — non-emitter, [R1]) |
| `primitive` | `present-resolution` (framework-local atomic unit; defined §3.9 Vocabulary; one act of resolving the substrate ledger into the **present** — the one connected tree of stacks — at-read. v6.0: renamed from v5.0 `frame-resolution`; the resolved present is a tree of stacks ([R3]/[R4]), held live and archived) |
| `consumes` | substrate-v1-1 v1.8.3 (A-09 Timestamp, A-12 FrameworkRef, A-17 P3/P4/P5 closure rules, A-18 StateChangeRecord + ReferentCitation + StateChangeId — **A-24 ContentClass consumption dropped — F-present is a non-emitter**, [R1]), Living Memory v3.5 (LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA8, LMA9, LMA10, LMA12, LMA13; SourceRef.channel read on records — the Path A external-arrival / Path B internal-derivation distinction the present surfaces as **authorship**, [R14]; SourceRef.contentClass/scope read on records; ThreadQueryInput.contentClass? optional read-side filter; three LMA9 thread primitives identity-recurrence/role-pattern/adjacency + iterate_axis), Perimeter Standard v1.2.1 (PA-IR3 scope+userId authority delegation), Manual SPEC-v13.4 (Operations Tool slot for F-present; Part I phantom-layer addendum; the per-user snapshot-archive store named at v5.0 — carried unchanged at v6.0), metaframework-v3-1 v3.3.1 (GeneratedFrameworkTemplate output schema), generation-procedure-v1-0 v1.1.7 (S1–S12 generation procedure), LIV-Standard v1.5.2, Placement Standard v1.0 (P-A6 R5 placement for consumed atoms by reference) |
| `produces` | `PresentFrame` (W-ATOM; the **tree of stacks** — the present — F-present resolves, **holds** as its live state, and **archives** to its own per-user store; nodes and edges are stack-carrying per [R4]; NOT a substrate write; declared §2.1) + `PresentView` (W-ATOM; the consumer-renderable atom **projected from** the held `PresentFrame`, carrying the tree's **structure** — nodes with weight/stack-surface/substitute-values/authorship, edges with thickness and their stack, the connectivity — at the granularity-cutoff extent per [R19]/[R20]; declared §2.1) + `SnapshotArchiveEntry` (W-ATOM; the archived-present record written to F-present's per-user LIV-database store, [R15]; declared §2.1). F-present produces no substrate write — non-emitter ([R1]). |
| `consumedBy` | Modalities (F-chat, F-output, F-dashboard — render the `PresentView` projection per Manual L158 without further composition); Generators (F-discover, F-plan, F-builder, F-verify — consume `PresentView` for generator-cycle inputs); Tools (F-ai-adapter — passes `PresentView` to LLM-using tool without further composition). v4.0: the v3.0 `consumedBy` clause "observability, replay, audit consumers via `PresentViewEmission` substrate trail" is **deleted** — there is no emission and no trail. |
| `referentCitations` | RC array populated at v6.0 with **9 RCs**. v5.0 carried 8; RC-09 is added at v6.0 — a `substrate-atom-ref` citing the substrate `SourceRef.channel` Path A / Path B distinction, which the present surfaces as per-state-change **authorship** ([R14]). The node-stack and edge-stack re-shapes stay under RC-07 (the held-present atom shape). See §2.3 and §3.11. |
| `scopeOut` | `['runtime execution of frame resolution (owned by L3 F-present program; Present Standard declares the contract, not the executor)', 'substrate write mechanics and read-primitive implementation (owned by Living Memory v3.5)', 'scope/userId access authorization (owned by Perimeter Standard v1.2.1 per PA-IR3 delegation; Present Standard declares carry-through mechanics only per PrA4)', 'consumer-side session continuity / view navigation logic (owned by consumer; Present Standard exposes one operation producing a held frame and its projection, not a continuity API)', 'view-rendering / surface concerns (owned by Modality per Manual L158)', 'the dashboard render of the PresentView projection (a downstream P-sprint; Present Standard declares the projection, not its render)', 'LLM prompt composition (owned by F-ai-adapter)', 'framework-declaration audit (owned by framework-audit at L2)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.3.1' },
  generationSession: 'present-standard-v6-0 (b3-present-v6 spec → derive → build dispatch)',
  ratifiedAt: 'pending — L0 ratification occurs after build-tier audit',
  ratifiedBy: 'pending — L0:Demos'
}
```

### §1.2 Identity-axiom satisfaction

Per substrate §4 A-17 Identity-axis empty-declaration: Identity fields are mechanical declarations per substrate §4 (atom-typed value assignments); no jurisdictional commitment is carried at the Identity axis at Standard scope. G-I8 governsRuntimeCode = `true` (governs F-present at L3 runtime).

---

## §2 Schema

### §2.1 Own atom inventory

**PresentIntent** — the call envelope, **re-stated at v6.0 against the three-control model** ([R9]/§2 of the spec):

```
PresentIntent = {
  intentId:    IntentIdRef,
  consumerRef: FrameworkRef,           // F-chat | F-output | F-discover | F-plan | F-builder | F-verify | F-ai-adapter | ...
  userId:      UserIdRef,              // LMA12
  scopeRef:    ScopeRef,               // LMA6

  // ── the three controls (§16.4, [R9]) ─────────────────────────────────────
  camera:      CameraSetting,          // WHERE the tree is centred. On the user-driven path the camera is
                                       //   DERIVED (null below) — it points at the identity the user's latest
                                       //   state-change touches ([R9]). On an LLM-initiated look it is SET to a
                                       //   real identity the LLM located in a present it was already given.
  // lens (granularity) is NOT carried here — it is stored dial state, read at
  //   resolve time ([R10]); a caller does not hardcode it. See GranularityDial.
  // temporal dial is NOT carried here as a standing field — see TemporalSetting
  //   below and the §16.10 parked note on standing-vs-per-look.

  temporal:    TemporalSetting,        // HOW MUCH of each stack is in view ([R10]/[R11]) — surface only (a
                                       //   still) or a span (history/motion). Per-look on this envelope; the
                                       //   standing-vs-per-look question is L0-parked (§16.10) and not
                                       //   decided here.
  standpoint:  PositionRef | null,     // WHICH POSITION. null = the live present; non-null = a past position,
                                       //   resolved by archive lookup ([R16]) — scrub-back. standpoint and the
                                       //   temporal dial are one mechanism (the playhead — [R16]); standpoint
                                       //   selects which archived present, temporal selects how much stack.

  bound:       ViewBound,              // resource ceiling — caps a large resolved region ([R20]); NOT a control
  provenance:  OriginProvenance        // consumer-stamped origin
}

CameraSetting =
  | { mode: 'derived' }                        // user-driven path — the camera points at the user's latest
                                               //   state-change; F-present derives it, the caller states nothing
  | { mode: 'set'; anchor: IdentityRef }       // LLM-initiated look — the camera is set to a located identity

TemporalSetting =
  | { depth: 'surface' }                       // the stack surface only — the latest state-change, a still
  | { depth: 'span'; from?: PositionRef; to?: PositionRef }   // a span of the stack — history, and motion

ViewBound = {
  maxNodes:    number,
  maxEdges:    number,
  walkBudget:  number
}
```

**v6.0 — the control surface is the camera, the lens, the temporal dial ([R9], §2 of the spec).** v5.0's `PresentIntent` carried `standpoint` + `zoomAnchor`. v6.0 re-states the envelope against the three controls, applying the residue rule [R2] — anything a caller would hardcode to a constant is not an intent field:

- **The camera ([R9])** replaces `zoomAnchor`. v5.0's `zoomAnchor` was the LLM-set anchor; the camera generalizes it: on the user-driven path the camera is **derived** (`{mode:'derived'}` — F-present points it at the user's latest state-change, the caller states nothing — a `zoomAnchor`-style hardcoded anchor on this path would be residue), and on an LLM-initiated look it is **set** (`{mode:'set', anchor}` — a real identity the LLM located in a present it was given). The camera *is* an intent field because the *mode* is a genuine caller distinction; the anchor identity, when set, is a located reference, not a hardcoded constant.
- **The lens ([R10]) is NOT an intent field.** The lens (granularity) is a mass-fraction cutoff with a **persistent stored position** — `GranularityDial` below — read at resolve time. A caller does not supply it; it is dialled and persists. Putting it in `PresentIntent` would make every caller hardcode a cutoff — residue ([R2]).
- **The temporal dial ([R10]/[R11])** is carried as `temporal: TemporalSetting` — per-look on this envelope. Whether it instead has a **standing stored position** like the lens is **L0-parked** (§16.10); v6.0 carries it per-look and does not decide the parked question. `standpoint` and the temporal dial are one mechanism — the playhead ([R16]): `standpoint` selects *which* present (live, or an archived past one), `temporal` selects *how much* of each stack within it.

**`zoomAnchor` is superseded by `CameraSetting`.** It is not "deleted as residue" — it was correct at v5.0; it is *generalized*: the camera carries the v5.0 LLM-set-anchor case as its `'set'` mode and adds the `'derived'` mode for the user path explicitly. `FocusSelector`/`OrderingSelector` remain deleted (v5.0, [R6]/[R7]) — the camera is not a re-introduction of `focus` (a `focus` was a hardcoded caller constant; the camera's `'set'` anchor is a located reference and its `'derived'` mode hardcodes nothing).

**The callable surface — one operation.** F-present exposes exactly one operation, `present(camera, temporal, standpoint) → PresentView`. The lens is read from stored dial state. Every call to `present()` **opens a window** (§16.5, [R12]) — the window is the operation's output unit, not a fourth argument.

**PresentFrame** — the present: F-present's own held-and-archived **tree of stacks** (§16.2, [R3]/[R4]).

`PresentFrame` is the **one connected tree** F-present resolves from the substrate ledger and **holds** as its own live state. It is **NOT a substrate leaf, NOT a substrate state-change of any kind** — it is the weighted tree of stacks the substrate's flat ledger cannot hold (LMA8: the substrate does not store derived geometry), manufactured by F-present's resolution walk, living in F-present's own hold keyed `(userId, scopeRef)`.

```
PresentFrame = {
  frameId:    FrameIdRef,             // identifies this resolved present
  userId:     UserIdRef,              // the present's owner — the root identity (LMA12)
  scopeRef:   ScopeRef,               // the scope the present was resolved within (LMA6)
  standpoint: PositionRef | null,     // the append-index position resolved at; null = the live edge.
                                      //   v6.0: standpoint + frameId position the present — no resolvedAt ([R11])

  root:       ViewNodeRef,            // the root — the user identity, the convergence point ([R3])

  nodes:      FrameNode[],            // the tree's nodes — each an identity carrying a stack ([R4])
  edges:      FrameEdge[],            // the tree's edges — each a relation carrying a stack ([R4]/[R5])

  weighting:  WeightingTrace,         // the chain-ping summed mass per node/edge (the manufactured weight)
  provenance: FrameProvenance         // the substrate state-changes and read primitives the resolution consumed
}
```

**v6.0 — `resolvedAt` is deleted ([R11]).** v5.0's `PresentFrame` carried `resolvedAt: Timestamp`. [R11] flags it redundant: `standpoint` (the append-index position) plus `frameId` already position a present — `resolvedAt` is a second positioning field doing no load-bearing work the two already do. It is deleted. (The archive entry keeps its own `archivedAt` — that timestamps the *archival act*, a distinct fact; see `SnapshotArchiveEntry`.)

**FrameNode — an identity is a stack ([R4]).** v5.0's `FrameNode` carried a flat `dominantSurfaceForm` value and a `recency` field. v6.0 re-derives the node to **carry its stack**: the identity is an append-only sequence of state-changes, the latest the surface, the rest the depth.

```
StackEntry = {                        // v6.0 NEW ([R4]) — one state-change in a carrier's stack
  stateChangeId: StateChangeId,       // the substrate state-change this entry is
  position:      PositionRef,         // the substrate append index — orders the stack
  surfaceForm:   string,              // the value/condition this state-change asserts
  authorship:    'user' | 'llm'       // v6.0 NEW ([R14]) — whose state-change: Path A external arrival
                                      //   (user) or Path B internal-derivation emission (llm). Read from
                                      //   the substrate SourceRef.channel; the present SURFACES it.
}

FrameNode = {
  identity:         IdentityRef,
  stack:            StackEntry[],     // v6.0 ([R4]) — the identity's append-only stack, ordered by position;
                                      //   stack[last] is the surface (the current condition — WHAT STATE),
                                      //   the whole sequence is the history (WHEN). ONE mechanism, read at depth.
  substituteValues: string[],         // the folded within-node value collapse (e.g. demos folds {demos, l0})
  weight:           number,           // ∈ [0, 1] — chain-ping summed mass, normalized (HOW MUCH)
  sourceCount:      number            // distinct substrate records contributing to the node
  // v6.0: dominantSurfaceForm DELETED — it is stack[last].surfaceForm (the surface), not a separate field.
  // v6.0: recency DELETED ([R11]) — a frozen pre-computed motion substitute; motion is the temporal dial
  //   run across stack span, not a stored number.
}
```

**FrameEdge — a relation is a stack ([R4]/[R5], M7).** v5.0's `FrameEdge` was a flat `{parent, child, thickness}` triple. [R4] flags it under-modelled: a relation accumulates state-changes (re-asserted, revised) exactly as an identity does — it is a stack. v6.0 re-derives `FrameEdge` to **carry the relation's stack**, the same shape `FrameNode` carries — the carriers are **symmetric** ([R5]).

```
FrameEdge = {
  parent:    IdentityRef,             // the more-rootward (denser) identity
  child:     IdentityRef,             // the identity reached through the parent
                                      //   direction parent→child computed from weight; NO containment ([R3])
  relationType: IdentityRef,          // the relation's type identity
  stack:     StackEntry[],            // v6.0 ([R4]/[R5]) — the relation's append-only stack, ordered by
                                      //   position; surface = the relation's current condition, depth = its
                                      //   history. SAME shape as FrameNode.stack — symmetric carriers ([R5]).
  thickness: number                   // ∈ [0, 1] — chain-ping summed mass of the relation (HOW MUCH)
}
```

**Carrier symmetry ([R5]).** `FrameNode` and `FrameEdge` are the **same shape**: each carries a `stack: StackEntry[]` (surface + depth) and a magnitude (`weight` for a node, `thickness` for an edge). A relation is not a lesser thing hung off an identity — it is a stack, exactly as a node is. Any reading mechanism — the temporal dial, authorship — applies identically to both.

```
FrameProvenance = {
  sourceStateChangeIds: StateChangeId[],
  readPrimitivesUsed:   ReadPrimitiveTrace[],
  cameraDerived:        CameraTrace
}
```

The `PresentFrame` is the **present** — the one connected tree of stacks resolving the whole relationally-significant structure ([R3]). F-present **holds the live present** as working state and **archives every resolved present** to its per-user store ([R15], `SnapshotArchiveEntry` below). A past present is retrieved by archive lookup ([R16]) — *not* a recompute. The substrate remains the complete write-side history; the present is F-present's resolved structure over it, held and archived in F-present's own stores, never the substrate ([R1]).

**PresentView** — the consumer-renderable atom, **projected from** `PresentFrame`, carrying the tree's structure (§16.9, [R19]/[R20]).

`PresentView` is **not** the held present. It is the projection of the held `PresentFrame` into a consumer-renderable tree — what F-chat, F-dashboard, F-ai-adapter and the Generators consume and render. The projection carries the tree's **structure** ([R19]): nodes with weight, stack-surface, substitute-values, and authorship; edges with thickness and their own stack; the connectivity. A projection flattened to identity names is forbidden — it destroys what the consumer needs to navigate and forces the LLM to reconstruct structure by guesswork. The projection's **extent is the granularity cutoff** ([R20]) — what the lens resolved, the active region at standing granularity — **not** a hardcoded one-level neighbourhood (a fixed "anchor + children + parent" is the one-level-bound residue reappearing one layer down, and it is deleted; a resource ceiling caps a large region, there is no separate neighbourhood rule).

```
PresentView = {
  viewId:             ViewIdRef,
  projectedFromFrame: FrameIdRef,                      // the held PresentFrame this view projects
  derivedFromIntent:  PresentIntent,
  window:             WindowRef,                       // v6.0 ([R12]) — the window this projection is; every
                                                       //   present() call opens one. See Window below.
  emittedAt:          Timestamp,

  composition: {
    nodes:       ViewNode[],
    edges:       ViewEdge[],                           // directed parent→child edges, each carrying its stack
    root:        ViewNodeRef,                          // the user identity, the convergence point
    camera:      ViewNodeRef,                          // the centred identity — what the camera points at
    extent:      'granularity-cutoff'                  // v6.0 ([R20]) — the projection carries what the lens
                                                       //   resolved; NOT a one-level neighbourhood
  },

  provenance: {
    sourceStateChangeIds: StateChangeId[],
    readPrimitivesUsed:   ReadPrimitiveTrace[],
    cameraDerived:        CameraTrace,
    weightingApplied:     WeightingTrace
  },

  reversibility: {
    appealCourtIs:    'substrate-state-change-table',
    replayDiscipline: 'invoke F-present with same PresentIntent → equivalent PresentFrame and PresentView per PrA8'
  }
}

ViewNode = {
  identity:         IdentityRef,
  stack:            StackEntry[],     // the identity's stack — surface + depth, each entry carrying authorship
  substituteValues: string[],
  weight:           number,           // ∈ [0, 1]
  parent:           ViewNodeRef | null,   // the more-rootward identity (null at root)
  children:         ViewNodeRef[],    // the identities reached through this node
  sourceCount:      number
  // v6.0: the v5.0 flat `dominantSurfaceForm` + `status` fields are subsumed by `stack` — the surface
  //   (stack[last]) IS the dominant value and the current status; one mechanism ([R7]).
}

ViewEdge = {
  parent:       IdentityRef,
  child:        IdentityRef,
  relationType: IdentityRef,
  stack:        StackEntry[],         // v6.0 ([R4]/[R5]) — the relation's stack; symmetric with ViewNode.stack
  thickness:    number                // ∈ [0, 1]
  // v6.0: the v5.0 flat ViewEdge {weight, sourceStateChangeIds} is re-shaped — the edge carries its stack
  //   ([R4]); sourceStateChangeIds are the stack entries' stateChangeIds, not a separate flat array.
}

CameraTrace = {                       // v6.0 — replaces v5.0 AnchorTrace; records how the camera was set
  mode:       'derived' | 'set',      // 'derived' = user-driven (latest state-change); 'set' = LLM look
  anchor:     IdentityRef,            // the identity the camera points at — derived or set
  derivedFrom?: StateChangeId         // populated iff mode = 'derived' — the latest state-change the camera
                                      //   was derived from
}

ReadPrimitiveTrace = {
  primitive:           'identity-recurrence' | 'role-pattern' | 'adjacency' | 'iterate-axis',
  parameters:          <kind-specific per LMA9 primitive signatures>,
  recordCount:         number,
  contentClassFilter?: ContentClass   // read-side filter on what EMITTERS declared (LMA13); F-present is a
                                      //   non-emitter and declares no class ([R1])
}

WeightingTrace = {
  weightMap:      { [ViewNodeRef]: number; [ViewEdgeRef]: number },
  weightingBasis: 'chain-ping-summation-v1.0',
  thresholdApplied: {
    loadBearingTheta: number          // the single load-bearing threshold θ — Sprint-tuning per PrA8
  }
}

Window = {                            // v6.0 NEW ([R12]/[R13], §16.5) — the unit every control-action yields
  windowId:    WindowRef,
  openedBy:    'user' | 'llm',         // whose action opened it — the authorship seam ([R14])
  camera:      CameraSetting,          // the camera setting this window was opened at
  lensCutoff:  number,                 // the lens (granularity cutoff) this window was opened at
  temporal:    TemporalSetting,        // the temporal-dial setting this window was opened at
  standpoint:  PositionRef | null,     // the position this window was opened at (live, or an archived past)
  openedAt:    Timestamp
}
// A window is the one tree at one camera/lens/temporal/standpoint setting. Windows ACCUMULATE — they do not
// replace ([R12]). The accumulating window-set is the session: the look-trail, the simultaneous holding of
// multiple regions, and the authorship seam (user windows vs llm windows — [R13]/[R14]). v5.0's "zoom" — which
// REPLACED the prior view — is deleted as the rejected alternative ([R12]).

GranularityDial = {                   // the lens — the adjustable granularity dial ([R10], §16.4)
  cutoff:      number,                // ∈ [0, 1] — the mass-fraction cutoff over normalized node weight.
                                      //   A node expands as its own node iff its weight clears the cutoff;
                                      //   below it the node is collapsed, its mass folded into its parent
                                      //   (chain-ping summation already deposited it — the fold costs nothing).
  setBy:       'user' | 'llm',
  updatedAt:   Timestamp
}
// The lens dials the STRUCTURE axis — more or fewer identities ([R10]). It has a PERSISTENT stored position,
// one per (userId, scopeRef), customizable by the user and the LLM, read at resolve time — NOT a PresentIntent
// field ([R2]: a caller does not hardcode a cutoff). Turning the lens does NOT recompute — it reads the held
// present at a different cutoff. Recompute occurs only on a substrate change. Stored in F-present's own state.

SnapshotArchiveEntry = {              // the archived-present record ([R15], §16.7)
  archiveKey:  SnapshotArchiveKey,
  present:     PresentFrame,          // the resolved present, archived whole — same atom (see note)
  archivedAt:  Timestamp              // when this present was written to the archive — the archival act
}

SnapshotArchiveKey = {
  userId:      UserIdRef,             // one archive per user — partitions the store ([R15])
  scopeRef:    ScopeRef,
  position:    PositionRef            // the append-index position the present was resolved at — the
                                      //   scrub-back lookup key ([R16])
}
```

**`StackEntry` — the unit M1, M5, and the grid all turn on.** A `StackEntry` is one state-change in a carrier's stack. It carries `position` (the substrate append index — what orders the stack), `surfaceForm` (the value/condition that state-change asserts), and `authorship` ([R14] — whose state-change). The stack's *last* entry is the **surface** — the carrier's current condition (the grid's WHAT STATE cell). The *whole sequence* is the **history** and, run across a span, the **motion** (the grid's WHEN cell). WHAT STATE and WHEN are therefore **one cell over one mechanism** ([R7]): the stack, read shallow (surface) or deep (span). This is why v5.0's separate flat `dominantSurfaceForm`/`status`/`recency` fields are all subsumed — they were three flat substitutes for one mechanism, the stack read at a depth.

**Authorship ([R14], M5).** Every `StackEntry` carries `authorship: 'user' | 'llm'`. The substrate already holds this — `SourceRef.channel` distinguishes Path A external arrival (the user) from Path B `internal-derivation` emission (the LLM). The present **surfaces** it: without it, over a long collaboration the tree fills with the LLM's own outputs and the LLM reads its own contributions as the user's cognition. Authorship is also surfaced at window granularity — `Window.openedBy` — the user's windows and the LLM's windows are distinct ([R13]).

**The `SnapshotArchiveEntry` shape — the `PresentFrame`, archived ([R15]).** `SnapshotArchiveEntry` wraps a whole `PresentFrame` with a retrieval key and an `archivedAt` timestamp — nothing added to or removed from the present itself. Scrub-back ([R16]) must return *the present as it was actually resolved* — the real frame of the movie — so the archived object is the resolved `PresentFrame`, not a reduction. `archivedAt` survives the `resolvedAt` deletion because it timestamps a different fact: `resolvedAt` redundantly re-stated the present's position (`standpoint` + `frameId` already do that); `archivedAt` records *when the archival act occurred*, which nothing else carries.

**Three F-present stores, one substrate ([R1]).** (1) the **substrate** — the open write-side flat ledger, MA1–MA6 frozen — F-present only *reads* it; (2) F-present's **held live present** — working state, one live `PresentFrame` per `(userId, scopeRef)`, plus the `GranularityDial` (lens) position and the accumulating `Window` set; (3) the **per-user present archive** — `SnapshotArchiveEntry` records in F-present's own store in the LIV database. F-present writes to (2) and (3); nothing to (1). "Delete F-present and the substrate stands" holds ([R1]).

**v6.0 — atoms deleted, re-shaped, added.** *Deleted:* `FrameNode.dominantSurfaceForm` and `FrameNode.recency` and `PresentFrame.resolvedAt` ([R11] — `recency` a frozen motion substitute, `resolvedAt` redundant); `AnchorTrace` (superseded by `CameraTrace`); `PerspectiveDeclaration` (the v5.0 projection-side axis record — the present has the two fixed axes structure/history, not a caller-or-projection-selected axis; the projection always presents the tree, [R3]). *Re-shaped:* `FrameNode` and `FrameEdge` carry a `stack` ([R4]); `ViewNode`/`ViewEdge` carry a `stack`; `PresentIntent` re-stated against the three controls; `PresentView.composition` carries `extent` + `camera`. *Added:* `StackEntry` ([R4]/[R14]), `Window` ([R12]), `CameraSetting`/`TemporalSetting`/`CameraTrace` ([R9]). (`FocusSelector`/`OrderingSelector` were already deleted at v5.0; `zoomAnchor` is superseded by `CameraSetting`, not deleted as residue.)

### §2.2 Consumed atoms (by reference)

All consumed atoms are substrate or LM atoms — no Present-local typing required for them. Per Placement Standard P-A6 + R5 placement, references-only.

| atom | source | role |
|---|---|---|
| `StateChangeRecord` | LM v3.5 §2.1 / substrate v1.8.3 §4 A-18 | substrate read return type |
| `IdentityRef`, `RoleRef`, `ScopeRef`, `UserIdRef`, `PositionRef` | LM v3.5 §3.12 + LMA5 | reference primitives |
| `Relation`, `IdentityWithRole`, `Modality` | LM v3.5 §2.1 LMA3 | typed relation shape |
| `SourceRef` | LM v3.5 §2.1 (channel + contentClass + scope three-field shape) | read on records — `SourceRef.channel` (Path A external-arrival / Path B internal-derivation) is the substrate ground for per-state-change **authorship** ([R14]); F-present reads it and surfaces it on every `StackEntry`. F-present produces no SourceRef (non-emitter) |
| `ContentClass` | program-declared emission-contract property — referenced by concept on the **read side only**: F-present's PR4 anchor-candidate read filters on the content classification emitters declared (§3.7 PR4). F-present itself declares NO ContentClass — it is a non-emitter ([R1]). |
| `ThreadQueryInput` | LM v3.5 §2.1 (F-present uses the `contentClass?` optional read-side filter; `asOfPosition?` is not used — scrub-back is an archive lookup, [R16]) | substrate read primitive input shape |
| `FrameworkRef` | substrate v1.8.3 §4 A-12 | consumerRef typing |
| `Timestamp` | substrate v1.8.3 §4 A-09 | emittedAt / archivedAt / openedAt typing (v6.0: `resolvedAt` deleted, [R11]) |

v6.0: F-present consumes no substrate write-input shape (non-emitter, [R1] — unchanged). v6.0 adds no consumed atom — the v6.0 re-shapes (`StackEntry`, `Window`, `CameraSetting`, the stack-carrying node/edge) are all own-atoms declared §2.1. The one new RC (RC-09, §2.3) cites an *already-consumed* atom — `SourceRef.channel` — at a newly load-bearing point (authorship); it does not add a consumed atom.

### §2.3 ReferentCitation array (nine RCs)

9 RCs declared per substrate §4 A-18 schema. v5.0 carried 8; v6.0 **adds RC-09** — a `substrate-atom-ref` citing the substrate `SourceRef.channel` Path A / Path B distinction, which v6.0 surfaces as per-state-change **authorship** on every `StackEntry` ([R14]). No RC is deleted at v6.0: the node-stack and edge-stack re-shapes ([R4]) re-shape atoms already cited by RC-07 (the held-present atom shape); the `recency`/`resolvedAt` deletions removed fields that carried no separate referent. RC-01..RC-08 are carried unchanged; RC-09 is appended contiguous.

| RC | citingAtom | referentKind | path |
|---|---|---|---|
| RC-01 | PresentIntent.userId | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 + LM v3.5 §2.1 (UserIdRef) |
| RC-02 | PresentIntent.scopeRef | `substrate-atom-ref` | LM v3.5 §2.1 (ScopeRef) |
| RC-03 | PresentIntent.standpoint | `substrate-atom-ref` | LM v3.5 §2.1 PositionRef |
| RC-04 | PresentIntent.consumerRef | `substrate-atom-ref` | substrate v1.8.3 §4 A-12 FrameworkRef |
| RC-05 | PresentFrame.nodes[].identity / PresentView.composition.nodes[].identity | `substrate-atom-ref` | LM v3.5 §3.12 IdentityRef |
| RC-06 | PresentFrame.provenance.sourceStateChangeIds / PresentView.provenance.sourceStateChangeIds | `substrate-atom-ref` | substrate v1.8.3 §4 A-18 StateChangeId |
| RC-07 | PresentView.composition (full sub-shape) + PresentFrame (the held-frame atom shape) | `l0-ratified-ref` | the v4.0 §16-derived held-frame atom shape — `PresentFrame` and its `PresentView` projection, L0-confirmed via the reconciliation spec |
| RC-08 | SnapshotArchiveEntry (the archive-store record shape) + SnapshotArchiveKey | `l0-ratified-ref` | the §16.7/§16-REF [R15]-derived per-user present-archive store schema; the archived shape is `PresentFrame` whole, plus the retrieval key |
| RC-09 | StackEntry.authorship (on every node-stack and edge-stack entry) | `substrate-atom-ref` | v6.0 NEW — substrate v1.8.3 `SourceRef.channel` (Path A external-arrival / Path B internal-derivation); the present surfaces the substrate's source distinction as authorship ([R14]) |

**RC trace (v6.0).** v6.0 adds exactly one RC — **RC-09**, the only count move in the whole v6.0 re-derivation (§3.2). RC-09 cites `SourceRef.channel`: the substrate already records, per state-change, whether it arrived on Path A (external — the user) or Path B (`internal-derivation` — the LLM); v6.0's `StackEntry.authorship` field surfaces that distinction, so every `StackEntry` is a new citing-atom citing a substrate-grounded referent — a `substrate-atom-ref`, the same referentKind as RC-01..RC-06. The node-stack/edge-stack re-shapes ([R4]) add no RC: they re-shape `FrameNode`/`FrameEdge`, atoms already under RC-07's held-present citation. The `recency` and `resolvedAt` deletions ([R11]) remove no RC: neither field carried a separate referent. RC-01..RC-08 carry unchanged. RC array 8 → 9.

### §2.4 Own atoms declared at point of use in §3 (vocabulary)

Framework-local terms declared at point of use per PR1 (substrate §10.2):

- `IntentIdRef` — declared §2.1 as PresentIntent.intentId; UUID-tagged ref to a stated intent
- `FrameIdRef` — declared §2.1 as PresentFrame.frameId; UUID-tagged ref to a resolved present
- `ViewIdRef` — declared §2.1 as PresentView.viewId; UUID-tagged ref to a projected view
- `WindowRef` — declared §2.1 as Window.windowId / PresentView.window; UUID-tagged ref to an opened window (v6.0, NEW; [R12])
- `ViewNodeRef` — declared §2.1; reference to a node by identity within a present or composition
- `ViewEdgeRef` — declared §2.1; reference to a `ViewEdge` within composition.edges
- `PresentIntent` — declared §2.1 as the call envelope; v6.0 re-stated against the three controls — carries `camera`, `temporal`, `standpoint` ([R9])
- `PresentFrame` — declared §2.1 as the present: F-present's own **tree of stacks**, held live and archived ([R3]/[R4])
- `StackEntry` — declared §2.1 inline; one state-change in a carrier's stack — `position` + `surfaceForm` + `authorship` (v6.0, NEW; [R4]/[R14])
- `FrameNode`, `FrameEdge`, `FrameProvenance` — declared §2.1 inline as PresentFrame sub-shapes; v6.0 `FrameNode` and `FrameEdge` each carry a `stack: StackEntry[]` — symmetric carriers ([R4]/[R5])
- `ViewNode`, `ViewEdge` — declared §2.1 inline as PresentView projection sub-shapes; v6.0 each carries a `stack` ([R4])
- `CameraSetting`, `TemporalSetting` — declared §2.1 inline as the camera and temporal-dial control values (v6.0, NEW; [R9]/[R10])
- `CameraTrace` — declared §2.1 inline; records how the camera was derived or set (v6.0 — supersedes v5.0 `AnchorTrace`)
- `Window` — declared §2.1 inline; the one tree at one camera/lens/temporal/standpoint setting — the unit every control-action yields (v6.0, NEW; [R12]/[R13])
- `GranularityDial` — declared §2.1 as the lens: the adjustable mass-fraction granularity dial; persistent stored state, not an intent field ([R10])
- `SnapshotArchiveEntry`, `SnapshotArchiveKey` — declared §2.1 inline as the per-user present-archive store record + key ([R15])
- `ViewBound` — declared §2.1 as the resource ceiling (max nodes/edges, walk budget) — not a control
- `OriginProvenance` — declared §2.1 as consumer-stamped origin metadata
- `ReadPrimitiveTrace`, `WeightingTrace` — all declared §2.1 inline

v6.0: the v5.0 vocabulary entries `AnchorTrace` (superseded by `CameraTrace`) and `PerspectiveDeclaration` (the present has the two fixed axes — structure and history; the projection always presents the tree, there is no caller-or-projection-selected axis — [R3]) are **deleted**. `WindowRef`, `StackEntry`, `CameraSetting`, `TemporalSetting`, `CameraTrace`, `Window` are added; `PresentFrame`/`FrameNode`/`FrameEdge`/`ViewNode`/`ViewEdge`/`PresentIntent` are re-shaped (entries above re-stated).

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
| P3 Leaf | **0** (v5.0: 0) | F-present is a non-emitter ([R1]) — no substrate-persistence leaf. The per-user present-archive holds `PresentFrame` in F-present's own LIV-DB store ([R15]), NOT a substrate leaf. Unchanged |
| P4 Axiom | **7** (PrA1, PrA2, PrA4, PrA5, PrA6, PrA7, PrA8) | v5.0: 7. The seven v6.0 moves re-derive *content* inside surviving axioms — M1/M2/M7 re-shape what PrA5's walk produces (a tree of stacks); M4 windows is the operation-invocation discipline inside PrA5; M5 authorship is a provenance fact inside PrA2; M3 deletes schema fields, not axioms. No axiom orphaned, none forced. PrA2, PrA5, PrA7, PrA8 re-derived in content (§3.6) |
| P5 Judgment template | 1 (J-intent-binding) | declared §7.1; v6.0 re-derives its *criteria* against the three-control envelope — the template survives, count unchanged |
| P6 Handoff rule | **5** (HR-PR-LM, HR-PR-PS, HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter) | v5.0: 5. Windows and the structure-carrying projection still go out the existing consumer HRs; no new cross-framework endpoint. Declared §6.2 |
| P7 Gate | **7** (PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8) | v5.0: 7. 1:1 with the 7 axioms per G-M1; axioms hold at 7 → gates hold at 7. PrG1 (structure-carrying / stack-carrying checks), PrG2 (authorship), PrG5 (three-control envelope) re-derived in content. No gate deleted, none added. Declared §4.1 |
| P8 Procedure step | 8 (PR1–PR8) | declared §3.7. A window is the *output unit* of one `present()` invocation — PR8 already produces the projection; "every action opens a window" ([R12]) does not add a step. v6.0 re-derives the content of PR3/PR4/PR5/PR6/PR8; deletes no step. Count unchanged at 8 |

**Count moves — v6.0 moves NO P-primitive count.** Leaf 0→0, Axiom 7→7, Judgment 1→1, HR 5→5, Gate 7→7, PR 8→8. The **only** count move is **RC 8→9** (§2.3 — RC-09, the `SourceRef.channel` authorship citation). This is the v6.0 headline, and it is the same shape as the v5.0 headline for the same structural reason: **v6.0 re-derives the present's *internal model*** — what a node, an edge, the projection, the operation's controls *are* — and an internal-model re-derivation re-shapes **schema atoms** and the **content** of axioms / gates / procedure steps; it does not move the framework skeleton. The seven moves land as follows: M1 (tree of stacks) and M7 (`FrameEdge` stack-carrying) re-shape the node and edge **own-atoms**; M2 (the grid) is the §3 structure *stated* — the read-model the existing PrA5 walk already produces; M3 (three controls) deletes two **schema fields** (`recency`, `resolvedAt`) and re-shapes the **intent own-atom**; M4 (windows) re-derives PrA5's operation-invocation **content** and adds the `Window` **own-atom**; M5 (authorship) adds a **field** to the `StackEntry` own-atom and one **RC**; M6 (structure-carrying projection) re-shapes the `PresentView` **own-atom**. Not one of the seven is a standalone primitive — every one is an own-atom re-shape or a re-derivation inside a surviving primitive. The own-atom inventory changes substantially; own-atom inventory is not a P-primitive count.

**G-M1 — clean 1:1 at 7↔7, unchanged in cardinality.** v5.0 ran a clean 1:1 PrA↔PrG bijection over 7 axioms and 7 gates. v6.0 **deletes no axiom and no gate** — the bijection is carried at 7↔7. Pairs re-derived *in content*: PrA1↔PrG1 (the resolution produces a tree of stacks; PrG1 checks the stack-carrying nodes/edges and the structure-carrying projection), PrA2↔PrG2 (provenance now surfaces authorship; PrG2 checks it), PrA5↔PrG5 (the operation re-stated against the three controls + windows; PrG5 checks the three-control envelope). No pair added, none deleted, none rescued for symmetry, none smeared. §4.1 carries the G-M1 re-derivation.

**RC 8→9 — the one count move ([R14]).** RC-09 cites `SourceRef.channel`. The substrate already records, per state-change, Path A (external arrival — the user) vs Path B (`internal-derivation` — the LLM); v6.0's M5 surfaces that as `StackEntry.authorship`. Every `StackEntry` is therefore a new citing-atom citing a substrate-grounded referent — a `substrate-atom-ref`. This is the one place a v6.0 move reaches a referent not already cited. The node-stack/edge-stack re-shapes ([R4]) add no RC — they re-shape atoms RC-07 already cites; the `recency`/`resolvedAt` deletions remove no RC — neither field carried a separate referent.

**`zoomAnchor` → `CameraSetting` is a generalization, not a count move.** v5.0's `zoomAnchor` becomes the camera's `'set'` mode; the camera adds a `'derived'` mode. This re-shapes the `PresentIntent` own-atom (M3/Shot 7) — an own-atom change, not a primitive-count move and not an RC move (`CameraSetting.anchor` resolves to `IdentityRef`, already cited at RC-05).

### §3.3 P1 Axis instances

Empty-declared with positive basis per substrate §8.6: Present Standard inherits the seven-axis metaframework concern space. No Present-local axis decomposition required at v6.0.

### §3.4 P2 Sub-axis instances

Empty-declared with positive basis: no sub-axis decomposition required at v6.0.

### §3.5 P3 Leaf instances

**Zero leaves (v5.0: zero).** F-present is a non-emitter ([R1]): it writes nothing to the substrate, so it declares no substrate-persistence leaf. F-present's output is the **`PresentFrame`** — the tree of stacks (§2.1) — held live and archived to F-present's own per-user LIV-database store ([R15]), neither of which is a substrate leaf. The leaf inventory is empty-declared with positive basis: a non-emitter has no substrate-persistence leaf by construction. Unchanged from v5.0.

### §3.6 P4 Axiom instances (PrA1, PrA2, PrA4, PrA5, PrA6, PrA7, PrA8)

Seven axioms — unchanged in count from v5.0. The v6.0 re-derivation moves no axiom and adds none (§3.2). Of the seven: PrA4 and PrA6 carry from v5.0 unchanged in substance; **PrA1** is re-derived (the projection carries the tree's structure — Shot 6); **PrA2** is re-derived (provenance surfaces authorship — Shot 5); **PrA5** is re-derived (the walk produces a tree of stacks, every action opens a window — Shots 1/2/4); **PrA7** carries the v5.0 held-present + archive content, re-stated to the tree-of-stacks vocabulary; **PrA8** is re-stated (the determinism dispatch quantifies over the three-control envelope).

**PrA1 — Content-shape identity at projected-view-atom level (Schema axis).**

> Every wearer/LLM consumer of F-present reads the same consumer-renderable atom shape — the `PresentView` projected from F-present's held `PresentFrame`. PresentView.composition is consumer-ready: Modality renders without further composition (Manual L158); F-ai-adapter passes without further composition. No transformation layer exists between PresentView and consumer. The LLM and the wearer-facing consumer read the same projection — one frame resolution serves both (§16.3).

Standalone-evidence: declares the consumer-level shape commitment. Earn-its-place: removing it permits a future Modality to compose a different view-shape. Collapse: answers "what shape does a consumer read?" definitively. **v6.0 change (Shot 6, [R19]/[R20]):** the `PresentView` the axiom names is re-derived to **carry the tree's structure** — nodes with weight, stack-surface, substitute-values, and authorship; edges with thickness and their own stack; the connectivity — at the **granularity-cutoff extent** ([R20]), not a hardcoded one-level neighbourhood. A projection flattened to identity names is forbidden ([R19]). The substance of the axiom — one consumer-renderable shape, no transformation layer — is unchanged; v6.0 strengthens *what that shape must carry*.

**PrA2 — Provenance-to-substrate completeness (Schema axis).**

> Every PresentFrame and every PresentView projected from it carries `provenance.sourceStateChangeIds` enumerating every substrate StateChangeId whose content contributed to any node or edge. `provenance.readPrimitivesUsed` enumerates every substrate read primitive call made during resolution. **Every `StackEntry` — on every node-stack and every edge-stack — carries `authorship` ([R14]):** whether that state-change is the user's (Path A external arrival) or the LLM's (Path B `internal-derivation` emission), read from the substrate `SourceRef.channel`. Replay against an identical substrate state produces a field-equivalent PresentFrame and PresentView per PrA8.

Standalone-evidence: declares auditability **and authorship-traceability**. Earn-its-place: removing the sourceStateChangeIds clause permits presents whose origin is not traceable to substrate; removing the authorship clause permits the LLM to read its own Path B outputs as the user's cognition — mistaking its reflection for the signal it must carry ([R14]). Collapse: distinct from PrA8 — PrA8 governs reproducibility, PrA2 governs traceability. **v6.0 change (Shot 5, [R14]):** the authorship clause is **added** — the present must *surface* the Path A / Path B distinction the substrate already holds. It lands on PrA2 because authorship is a provenance fact (whose state-change is whose); it is the same axiom's subject — traceability — extended from "traces to *which* substrate record" to "traces to *whose* substrate record." No new axiom; a second axiom for one traceability subject would be the AuthorityClaim drift class.

**PrA4 — Scope and userId carry-through (Coupling axis).**

> Every substrate read F-present invokes carries the intent's `userId` (LMA12) and `scopeRef` (LMA6). F-present applies these as read-filter mechanics; F-present does not authorize — Perimeter Standard v1.2.1 enforces (per PS PA-IR3 delegation). The held `PresentFrame` is keyed by `(userId, scopeRef)` — the frame is partitioned by the same userId+scope discipline.

Standalone-evidence: declares access-discipline mechanics. Earn-its-place: removing permits cross-user or cross-scope leakage in either the read or the held present. Collapse: PS enforces access at intake; PrA4 declares F-present's read-side conformance. **v6.0: carried unchanged in substance.** Every substrate read carries userId+scopeRef; the held `PresentFrame`, the per-user archive, the lens-dial state, and the accumulating `Window` set are all keyed `(userId, scopeRef)` — the same access discipline over F-present's v6.0 retained state. No clause moves at v6.0.

**PrA5 — Operation closure at one operation; the walk resolves a tree of stacks; every action opens a window (Structure axis). — re-derived at v6.0 (Shots 1 / 2 / 4).**

> F-present's procedure exposes exactly **one callable operation**: `present(camera, temporal, standpoint) → PresentView`. The operation carries the **camera** (`CameraSetting` — derived on the user path, set on an LLM look, [R9]), the **temporal dial** (`TemporalSetting` — surface or span, [R10]/[R11]), and the **standpoint** (`PositionRef | null` — the live present, or a past position resolved by archive lookup, [R16]). The **lens** (granularity) is not an operation argument — it is read from stored dial state ([R10]). The procedure has zero callable paths exposing an operation outside this one.
>
> **Every action opens a window ([R12]/[R13] — Shot 4).** Every invocation of `present()` — by the user or the LLM — **opens a new `Window`**: the one tree at that call's camera / lens / temporal / standpoint setting. Windows **accumulate** — they do not replace. The accumulating window-set is the working session: the look-trail, the simultaneous holding of multiple regions, and the authorship seam (`Window.openedBy` — user windows vs LLM windows). v5.0's "zoom" — which *replaced* the prior view — is the rejected alternative ([R12]): replacing loses the previous look; adding never does. A window is not a fourth control — it is the *grammar*, the unit every control-use yields ([R13]).
>
> **The walk resolves a tree of stacks ([R3]/[R4] — Shots 1/2).** The one operation's *internal computation* — what the procedure does between authorized intent and the resolved `PresentFrame` — is the **dependency walk**, and what it produces is **one connected tree of stacks** ([R3]): one tree rooted on the user, every node an identity carrying a stack, every edge a relation carrying a stack ([R4]). PR5 (§3.7) realizes this step-for-step. Four sub-derivations:
>
> (1) **Dependency is read-computed, never stored** (LMA8, PrA7). For identities A, B in the present, a directed dependency edge `B → A` ("B depends on A") exists iff A is **load-bearing** for B's identity-coherence and A is **more rootward** than B (A's accumulated chain-ping weight ≥ B's). Dependency is **not** a relation `type` and there is **no `switch` on type** — it is decided type-blind by load-bearing-ness (R1). The directed edge set is acyclic toward the user core. There is **no containment construct** — hierarchy is purely the artifact of where summation mass lands ([R3]).
>
> (2) **Load-bearing scoring is one type-blind function.** `loadBearing(relation, identity) → score` scores any LMA3 relation, type-blind, from properties available in LMA3 — relation recurrence across the identity's thread, modality weight (asserted vs negated), adjacency density (LMA9 `adjacency`). A relation is load-bearing iff `score ≥ θ`. θ is the single declared load-bearing threshold — Sprint-tuning, not logic; covered by PrA8's "declared thresholds" clause.
>
> (3) **Chain-ping summation — facet model ([R8]-class).** Naming any identity pings its dependency chain rootward; each ping deposits along the **facets it actually routes through** — the sub-identities on its routing path — and the deposits **sum, never average**. A ping does **not** deposit into every identity on a more-rootward ring. Every identity *between* the camera's anchor and the core is fractal — a downstream reaches a **facet** of an upstream identity, not the whole. Accumulated sum at a node = its weight = its dependency strength; the same summation over a relation's incidence = its edge thickness.
>
> (4) **Each node and each edge is resolved as a stack ([R4]/[R5] — Shot 1).** A node is not a flat value and an edge is not a flat triple. For each identity and each relation in the tree, the walk assembles the **stack** — the append-only sequence of that carrier's state-changes, ordered by the substrate append index; the latest is the **surface**, the rest the **depth**. The carriers are **symmetric** ([R5]): the node-stack and the edge-stack are the same shape, assembled by the same mechanism. The walk's *extent* — how much tree resolves — is the **granularity cutoff** ([R20]): an identity expands as its own node iff its normalized weight clears the lens cutoff; below it the node is collapsed, its mass folded into its parent (chain-ping summation already deposited it). v5.0's one-level bound is already deleted; v6.0 deletes the projection's one-level neighbourhood residue too (PrA1, [R20]) — the lens decides extent, a resource ceiling caps a large region, there is no separate neighbourhood rule.
>
> **Noted consequence — the user identity is the densest node.** A *consequence* of (1) and (3) with userId scoping (LMA12), **not an axiom**: within a userId-scoped read every dependency chain terminates at the user core, the core has no facets to partition a deposit, so the user identity accumulates maximum summed mass — densest by structural necessity. Recorded here carrying its proof; declaring it a separate axiom would be the AuthorityClaim drift class.

Standalone-evidence: declares the callable-surface closure at one, the window grammar, and the procedure's internal computation (a tree of stacks) to axiom grade. Earn-its-place: removing the closure permits arbitrary substrate-primitive compositions as separate operations; removing the window clause returns operating to v5.0's replacing "zoom" which loses the trail; removing the walk clause returns the procedure to the v2.0 Option-C average. Collapse: distinct from PrA6 — PrA6 governs the substrate-read floor, PrA5 governs the callable surface, the window grammar, and the internal computation. **v6.0 change (Shots 1/2/4):** the operation signature is re-stated against the three controls (`present(camera, temporal, standpoint)`); the window grammar ([R12]/[R13]) is added — every action opens an accumulating `Window`; sub-derivation (4) is re-derived — the walk resolves each node and edge as a **stack** ([R4]), the carriers symmetric ([R5]). Sub-derivations (1)–(3) — read-computed dependency, type-blind load-bearing scoring, facet-model chain-ping summation — are **carried unchanged** from v5.0; the walk *engine* is correct. The axiom stays one axiom on the Structure axis; no axiom count moves (the window grammar and the stack re-derivation are clauses within this axiom, §3.2).

**PrA6 — Substrate-read closure (Schema axis).**

> F-present reads substrate exclusively via the LM v3.5 read primitives: the three LMA9 thread primitives (identity-recurrence, role-pattern, adjacency — each via `threadQuery` with the matching `threadKind`) and raw axis scan (`iterate_axis`). F-present does not introduce a substrate read primitive outside this set (LMA9 three-primitive closure).

Standalone-evidence: declares the read floor. Earn-its-place: removing permits ad-hoc substrate reads outside LMA9. Collapse: distinct from PrA5. **v6.0: carried unchanged in substance.** The LMA9 three-primitive read closure is the live-resolve read floor; scrub-back remains an archive lookup ([R16]), not a substrate read — PrA6 carries no scrub-back read clause. (The v6.0 stack assembly reads the same LMA9 primitives — a carrier's stack is the substrate records about that carrier, returned by the existing thread primitives; no new read primitive.)

**PrA7 — F-present holds the live present and archives every present (Lifecycle axis). — carried from v5.0, re-stated to tree-of-stacks vocabulary.**

> F-present is **stateful**. It holds the live `PresentFrame` — the present, F-present's own resolved tree of stacks, keyed `(userId, scopeRef)`. F-present is **not** stateless; it does **not** recompute the whole present from raw substrate on every call. It holds the current present and the present advances by being inherited forward.
>
> **F-present has three storage facts, and the substrate is none of them ([R1]).** (a) F-present *reads* the **substrate** — the open foundation, the flat append-only write-side ledger; it writes nothing to it (non-emitter). (b) F-present **holds the live present** as working state — one live `PresentFrame` per `(userId, scopeRef)`, plus the `GranularityDial` (lens) position and the accumulating `Window` set. (c) F-present **archives every resolved present** to its **per-user store in the LIV database** — F-present's own store. LMA8 is honored: LMA8 forbids *the substrate* storing derived geometry; the held present and the archived presents are trees of stacks (derived geometry) in F-present's own stores (b) and (c), never written to the substrate. "Delete F-present and the substrate stands" holds.
>
> **Presents are archived; the archive is the movie ([R15]).** Every present F-present resolves is written to the per-user archive store as a `SnapshotArchiveEntry` (§2.1), keyed by `(userId, scopeRef, position)`. Played back in order, the archive is the movie — the record of how the present moved. The archive write is the *same act* as resolving the present into the hold (§3.7 PR6) — one `PresentFrame`, held live and archived; F-present does not compute a present twice.
>
> **The loop, and the LLM as gravity ([R17]/[R18]).** The core loop is the Manual's memory loop; F-present is the **Tool** reached for at the "Store is read" beat. A writer acts → the substrate accumulates → F-present resolves the present → it is projected to the consumer → the consumer acts → that act is the next write. Continuous, no turn. The **LLM is the gravity**: a resolved present is inert structure; the LLM reading it and responding *in its inheritance* is what carries it forward and makes a sequence of presents a continuous cognition. The LLM is the user's complement — the user supplies the moment, the LLM the carry-forward. This is also why the present must reach the LLM with structure intact (PrA1, [R19]): the LLM has no standing vision; the present it is handed each turn is its continuity.
>
> **Scrub-back is an archive lookup ([R16]).** A scrub-back ("show me Tuesday") is a **lookup** of the past present from the per-user archive store — *not* a recompute. The retrieved present is the present as it was actually resolved at that position — the real frame of the movie, faithful, not a re-derivation that could drift. Scrub-back and the temporal dial are one mechanism — the playhead: a past *point* is a still, a *span* across past positions is the movie playing.
>
> The held live present, the `GranularityDial` position, the accumulating `Window` set, and the per-user archive store are F-present's retained state, all keyed by user/scope, with no stale cross-invocation leakage.

Standalone-evidence: declares the stateful held-present discipline, the non-emitter property at lifecycle grade, the archive-store fact, the archive-lookup scrub-back, and the loop/gravity *why*. Earn-its-place: removing the held-present statement returns F-present to a stateless recompute; removing the archive statement loses the movie. Collapse: distinct from PrA5 — PrA5 governs the callable surface, the window grammar, and the resolution walk; PrA7 governs F-present's retained state between invocations and the loop it sits in. **v6.0: carried from v5.0 in substance** — the held live present, the per-user archive, scrub-back as an archive lookup, the non-emitter property are v5.0's outer model, correct and carried. Re-stated to the tree-of-stacks vocabulary (the held object is the present, a tree of stacks; the retained state additionally names the accumulating `Window` set, §16.5) and the loop/gravity *why* ([R17]/[R18]) is made explicit. PrA7 stays **one axiom on the Lifecycle axis**. No axiom count moves.

**PrA8 — Frame-resolution determinism (Validity axis).**

> For identical `PresentIntent` against identical substrate state, identical lens-dial position, and identical temporal setting, F-present resolves a field-equivalent `PresentFrame` and projects a field-equivalent `PresentView` across nodes, edges, their stacks, camera/root, provenance.cameraDerived, and weighting. Camera derivation, weighting computation, the dependency walk, stack assembly, and the camera/temporal/standpoint dispatch are pure functions of (intent, substrate state, the lens-dial position, declared thresholds).

Standalone-evidence: declares replay-discipline. Earn-its-place: removing permits non-deterministic present resolution. Collapse: viewId/frameId/windowId + emittedAt/openedAt are operationally non-deterministic by design; axiom scope excludes them. **v6.0 change:** the dispatch the determinism statement quantifies over is re-stated against the three-control envelope — camera / temporal / standpoint replace `standpoint`/`zoomAnchor`; the lens-dial position is a determinism input; stack assembly is added as a deterministic step. Substance — determinism of the resolution — unchanged; a scrub-back is a deterministic archive lookup ([R16]).

### §3.6.1 Axiom-axis distribution per MFv3 §3.1.1 FrameworkConcernSpace

| axis | bound axioms | count |
|---|---|---|
| Schema | PrA1, PrA2, PrA6 | 3 |
| Structure | PrA5 | 1 |
| Validity | PrA8 | 1 |
| Lifecycle | PrA7 | 1 |
| Coupling | PrA4 | 1 |
| Identity | — (empty-declared per substrate §4 A-17) | 0 |
| Judgment | — (empty-declared; J-intent-binding §7.1 governs incoming intent validation) | 0 |
| **Total** | | **7** |

7 axioms across 5 active axes; distribution **3-1-1-1-1-0-0** — **unchanged from v5.0**. v6.0 deletes no axiom and adds none (§3.2 — the seven moves land inside surviving axioms or as own-atom re-shapes); PrA1, PrA2, PrA5, PrA8 are re-derived in content, PrA7 re-stated. No axiom moves between axes. G-U3 axis-coverage gate: five axes carry ≥1 axiom — satisfied.


### §3.7 P8 Procedure step instances (PR1–PR8)

Eight steps. v6.0 re-derives the *content* of **PR3** (the camera — derived on the user path, set on an LLM look — [R9]), **PR4** (the live-resolve read; scrub-back routing carried from v5.0), **PR5** (the walk resolves a **tree of stacks** — per-node and per-edge stack assembly; the granularity cutoff bounds extent — [R3]/[R4]/[R20]), **PR6** (hold + archive — carried from v5.0; the archived object is the present), and **PR8** (projects a structure-carrying `PresentView` at the granularity-cutoff extent, and the projection opens a `Window` — [R12]/[R19]/[R20]). PR1 (J-intent-binding against the three-control envelope) and PR2 and PR7 are re-stated to v6.0 vocabulary. The step count is unchanged at 8 — every action opening a window adds no step (a window is the *output unit* of PR8, not a procedure step, §3.2).

| id | order | stage | kind | input | output | kind-specific field |
|---|---|---|---|---|---|---|
| **PR1** | 1 | 1 | `judgment-input` | PresentIntent | validated intent | `judgmentInputRef = 'J-intent-binding'` (§7.1 — v6.0: criteria re-stated against the three-control envelope — camera mode, temporal setting, standpoint) |
| **PR2** | 2 | 2 | `mechanical` | validated intent | authorized intent | `derivation = "PS handshake: confirm consumer-stamped userId + scopeRef per PrA4. Per PrA4: F-present applies mechanics, does not authorize — Perimeter Standard v1.2.1 PA-IR3 owns access enforcement."` |
| **PR3** | 3 | 2 | `mechanical` | authorized intent | camera anchor + CameraTrace | `derivation = "per LMA7 + PrA8 + [R9]: resolve the CAMERA — where the tree is centred. The camera is one of two modes (CameraSetting). DERIVED (camera.mode = 'derived' — the user-driven path): the camera points at the identity the user's latest state-change touches; PR3 emits CameraTrace{mode:'derived', anchor:<seed>} and the highest-mass identity is crystallized at PR4 after the latest-state-change read (the latest-state-change's identity set is carried as anchor candidates; if it touches several, the highest-mass cluster at its main value is the anchor). SET (camera.mode = 'set' — an LLM-initiated look): the camera anchor is camera.anchor directly — a real identity the LLM located in a present it was already given; CameraTrace{mode:'set', anchor: camera.anchor}, no re-derivation. The standpoint is carried for PR4 (live-vs-archive routing) and the temporal setting for PR5 (stack depth); neither changes the camera."` |
| **PR4** | 4 | 2 | `mechanical` | authorized intent + camera anchor | StateChangeRecord[] + ReadPrimitiveTrace[] | `derivation = "per PrA5 + PrA6 + LM v3.5 LMA9. SCRUB-BACK ROUTING ([R16]) — checked FIRST: if intent.standpoint is non-null, PR4 does NOT read the substrate — the past present is retrieved by archive lookup (PR5/PR6 skipped, the retrieved present is the result). The substrate-read path runs ONLY for a live resolve (standpoint is null). LIVE RESOLVE: dispatch the LMA9 reads to resolve the tree. The camera anchor (PR3) seeds the read: identity-recurrence(anchor, scope) for the anchor's thread, then adjacency + role-pattern reads to reach the relationally-significant tree — the records also carry, per identity and per relation, the full sequence of state-changes about it (the carrier's STACK — [R4]; the stack is the substrate records about a carrier, returned by the existing thread primitives, no new read primitive). CAMERA CRYSTALLIZATION: if PR3 carried multiple anchor candidates (derived mode), identity-recurrence over the candidate set crystallizes the highest-mass identity ([R9]). DENSITY-ON-EMPTY TERMINAL CASE: if the read yields no identity beyond the user seed, the anchor is the seed and the present is the anchor node with zero children — a determinate terminal case. READ-SIDE CONTENTCLASS FILTER: anchor-candidate reads restricted to wearer-cognition content via ThreadQueryInput.contentClass? — filtering on what EMITTING programs declared (LMA13); F-present declares no ContentClass (non-emitter, [R1]). Log invocations as ReadPrimitiveTrace[] per §2.1."` |
| **PR5** | 5 | 2 | `mechanical` | StateChangeRecord[] + traces + lens-dial | PresentFrame (tree of stacks) | `derivation = "per PrA1 + PrA5 dependency-walk clause + PrA8: resolve the PresentFrame — one connected TREE OF STACKS — by the dependency walk. (1) CLUSTER: form candidate FrameNode[] by LMA5 identity-cluster-at-read; fold within-node substitute-values; form candidate FrameEdge[] from LMA3 relations between clustered identities. Clustering is RELATIONAL co-location surfaced by the walk — never a string merge; a token with no recorded clustering resolves as its own thin node. (2) SCORE LOAD-BEARING: for each relation, loadBearing(relation, identity) type-blind from LMA3 properties (relation recurrence, modality weight, LMA9 adjacency density); load-bearing iff score >= θ. NO switch on relation type (R1). (3) CHAIN-PING SUM — FACET MODEL: name the camera anchor; ping its dependency chain rootward; each ping deposits along the FACETS it routes through; deposits SUM, never average; accumulated sum at each node is its weight, the same summation over a relation's incidence is its edge thickness. The core has no facets — densest by structural necessity. (4) STACK ASSEMBLY ([R4]/[R5], Shot 1): for EACH node (identity) and EACH edge (relation), assemble the carrier's STACK — the append-only sequence of state-changes about it, ordered by substrate append index; stack[last] is the surface, the rest is depth. Each StackEntry carries stateChangeId, position, surfaceForm, and authorship ('user' if the state-change's SourceRef.channel is Path A external-arrival, 'llm' if Path B internal-derivation — [R14], Shot 5). Node-stack and edge-stack are the SAME assembly — symmetric carriers ([R5]). (5) GRANULARITY CUTOFF ([R20], Shot 4 — bounds the tree's EXTENT): normalize node weight to a fraction; read the lens-dial cutoff (GranularityDial — persistent stored state, NOT an intent field); a node resolves EXPANDED iff its normalized weight clears the cutoff; below it the node is COLLAPSED — not its own node, its mass folded into its parent (chain-ping in step 3 ALREADY deposited it — the fold costs nothing). The tree is bounded by standing mass clearing the cutoff, not by a hop count; v5.0's status-as-latest+recency step is GONE — the surface IS stack[last], one mechanism ([R7]); there is no separate recency. (6) BREADCRUMB: the rootward arm; walk real parent→child FrameEdge dependency edges to the user core, terminating there because rootward edges converge. NO containment construct ([R3]). The resolved PresentFrame: nodes (FrameNode[], each carrying its stack), edges (FrameEdge[], parent→child by weight, each carrying its stack), root = the user identity, weighting (WeightingTrace), provenance (cameraDerived = CameraTrace). Emit WeightingTrace with weightingBasis='chain-ping-summation-v1.0', thresholdApplied.loadBearingTheta = θ."` |
| **PR6** | 6 | 2 | `mechanical` | PresentFrame (tree of stacks) | PresentFrame held live + archived | `derivation = "per PrA7 ([R1]/[R15]): F-present is a non-emitter — PR6 does NOT write to the substrate. PR6 does TWO writes, both to F-present's OWN stores: (a) HOLD — install the PresentFrame as F-present's live held present, keyed (userId:scopeRef); it becomes the present the LLM's next response inherits. (b) ARCHIVE — write the SAME PresentFrame to F-present's per-user archive store as a SnapshotArchiveEntry, keyed (userId, scopeRef, position) where position is the substrate append-index the present was resolved at. (a) and (b) are ONE act on one object — F-present resolves the present once (PR5) and PR6 places it in both stores; no second resolution, no PR9. There is NO writeStateChange call and NO substrate write of any kind — the archive store is F-present's own store in the LIV database, NOT the substrate ([R1]). The present stamps frameId, standpoint, root — NOT resolvedAt (deleted, [R11] — standpoint + frameId already position it). provenance.sourceStateChangeIds is stamped from the records read at PR4. SCRUB-BACK: when standpoint was non-null, PR4 already retrieved the archived present by lookup and PR5/PR6 were skipped — PR6 runs only on a live resolve."` |
| **PR7** | 7 | 3 | `gate-execution` | PresentFrame + PresentView projection | per-gate results PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8 + overall | `gates = [PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8]` (§4.1) — 7 gates, 1:1 with the 7 axioms per G-M1 |
| **PR8** | 8 | 5 | `mechanical` | gate-passed PresentFrame | PresentView projection (a Window) emitted to consumer | `derivation = "per PrA1 + [R19]/[R20]: project the held PresentFrame into a PresentView and emit it via HR-PR-Consumer (HR-PR-Modality, HR-PR-Generator, or HR-PR-AIAdapter per consumerRef). projectedFromFrame = the present's frameId. STRUCTURE-CARRYING ([R19]): the projection MUST carry the tree's structure — composition.nodes as ViewNode[] each carrying its stack (StackEntry[] with authorship) + substituteValues + weight + parent + children; composition.edges as ViewEdge[] (directed parent→child, each carrying its stack + thickness); composition.root and composition.camera as ViewNodeRefs. A projection flattened to a list of identity names is forbidden. EXTENT = GRANULARITY CUTOFF ([R20]): composition.extent = 'granularity-cutoff' — the projection carries what the lens resolved, NOT a hardcoded one-level neighbourhood; a fixed anchor+children+parent is the one-level-bound residue reappearing and is deleted. ViewBound (maxNodes, maxEdges) is a resource ceiling capping a large resolved region — not a neighbourhood rule. WINDOW ([R12]): the PR8 projection OPENS a Window — PresentView.window = the WindowRef; Window records openedBy (user/llm — the authorship seam), the camera/lens/temporal/standpoint setting; windows accumulate, they do not replace. The PresentView is emitted to the consumer — a consumer handoff, NOT a substrate write."` |

Stage monotonicity: 1→2→2→2→2→2→3→5. Stage 4 absent (empty-declared per substrate §8.6). Stage-kind alignment: PR1 stage 1 judgment-input ✓; PR2–PR6 stage 2 mechanical ✓; PR7 stage 3 gate-execution ✓; PR8 stage 5 mechanical ✓.

**§3.7.1 The v1.0.1 presets — retired (carried from v5.0).**

The five named presets (`search-by-identity`, `search-by-role`, `default-entry`, `move-neighborhood`, `move-trajectory`) were retired at v5.0 — they were hardcoded configurations of the deleted `focus`/`ordering` parameters, residue of exactly the kind [R2] names. v6.0 carries the retirement: the operation is `present(camera, temporal, standpoint)` and has no presets.

What the five presets *did* is now structural, not a configuration:
- `search-by-identity` / `search-by-role` / `default-entry` — all selected what to centre on. The centre is now the camera ([R9]) — derived on the user path, set on an LLM look; there is nothing to preset.
- `move-neighborhood` / `move-trajectory` — both were a non-null standpoint (a scrub-back). Scrub-back is now `present(standpoint=<position>)` — a single position argument resolved by archive lookup ([R16]); there is nothing to preset.

The one operation `present(camera, temporal, standpoint)` has no presets — the camera is derived or set, the temporal dial and the lens are dial positions, the standpoint is a single position value. The retirement is not a capability loss (every preset's behaviour is reachable through the three controls).

### §3.8 Universal-variables table (per substrate §3.5)

| Axis (P1) | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| `Schema` | PrA1 + PrA2 + PrA6 (consumes substrate v1.8.3 + LM v3.5) | tree-of-stacks atom kind + stack-carrying node/edge + StackEntry (with authorship) + projected-view atom kind + read-primitive enum + RC kind enum (RC-01..RC-09) | binds PresentFrame and PresentView to PresentIntent + ReadPrimitiveTrace + the StackEntry authorship to SourceRef.channel (RC-09) | atoms placed per Placement Standard R3+R5 |
| `Structure` | PrA5 (one-operation closure + the window grammar + the dependency-walk clause: read-computed dependency edge, type-blind load-bearing scoring, facet-model chain-ping summation, per-node/per-edge stack assembly, full-tree resolution bounded by the granularity cutoff) | one-operation closure + the camera/temporal/standpoint control surface + the Window unit + procedure step kind enum | binds PR1–PR8 ordering + camera/temporal/standpoint dispatch + every action → a Window | procedure steps positioned 1–8 |
| `Validity` | PrA8 | determinism property kind | binds PresentIntent → PresentFrame/PresentView function | PrG8 gate position in PR7 |
| `Lifecycle` | PrA7 (held live present; the per-user archive; non-emitter; the loop and the LLM as gravity) | held-present-state declaration + the per-user archive + the accumulating Window set + the memory loop | binds runtime statefulness; binds the held present + archive + windows as F-present's own state, not a substrate write | F-present runtime placed at PR1–PR8 only; the held present keyed (userId,scopeRef) |
| `Coupling` | PrA4 | access-discipline kinds (userId/scope on reads + on the held frame) | binds F-present to substrate (read side per PrA6) + PS (auth per PrA4) + consumers (projection emit per HRs) | HRs declared §6.2 (5 HRs) |

v6.0: the Structure-axis row carries the three-control surface and the Window unit; the Schema-axis row carries the stack-carrying node/edge atoms and RC-09 (authorship → SourceRef.channel); the Lifecycle-axis row carries the accumulating Window set and the loop/gravity *why*. No axis loses or gains an axiom — distribution 3-1-1-1-1-0-0 unchanged.

### §3.9 Vocabulary

- `present-resolution` — primitive atomic unit (§1); one act of resolving the substrate ledger into the `PresentFrame` — the one connected tree of stacks — at-read (v6.0: renamed from v5.0 `frame-resolution`)
- `the present` / `PresentFrame` — F-present's own atom: **one connected tree of stacks** rooted on the user ([R3]/[R4]); resolved from the substrate, held live and archived; keyed (userId,scopeRef); NOT a substrate write
- `tree of stacks` — the present's internal model ([R3]/[R4]): one connected tree, every node an identity and every edge a relation, and every node and edge a **stack** — an append-only sequence of state-changes, latest = surface, the rest = depth
- `stack` — the carrier shape ([R4]): an append-only sequence of a carrier's state-changes ordered by the substrate append index; `stack[last]` is the surface (the current condition — WHAT STATE), the whole sequence is the history (WHEN); read shallow or deep by the temporal dial
- `surface` / `depth` — `surface` = a stack's latest entry (the carrier's current value/condition); `depth` = the rest of the stack (its history)
- `carrier` — the thing a question is asked of: an identity or a relation ([R6]); the two carriers are **symmetric** ([R5]) — both stacks with a surface and a depth, read by the same mechanisms
- `the grid` — the present's read-model ([R6]): four questions (WHERE, HOW MUCH, WHAT STATE, WHEN) asked of the two carriers; WHAT STATE and WHEN collapse to one cell — the stack read at a depth ([R7]); absence is the negative space of WHERE and HOW MUCH, not a question ([R8])
- `live present` — the current `PresentFrame` F-present holds for a (userId,scopeRef); inherited forward per the loop ([R17])
- `archive` / `present archive` — the per-user store in the LIV database holding every resolved present as a `SnapshotArchiveEntry` ([R15]); F-present's own store, NOT the substrate; played back in order, the archive is the movie
- `the movie` — the loop ([R17]): a writer acts -> the substrate accumulates -> F-present resolves the present -> it is projected -> the consumer acts -> that act is the next write; no turn. The archived presents played in order ARE the movie. The **LLM is the gravity** ([R18]) — what carries the sequence forward into a continuous cognition
- `the three controls` — camera, lens, temporal dial ([R9]): the camera is the anchor (where the tree is centred), the lens is granularity (how much tree), the temporal dial is how much stack
- `camera` — the control that centres the tree ([R9]); `derived` on the user-driven path (it points at the user's latest state-change) or `set` on an LLM-initiated look (to a located identity); realized as `CameraSetting`
- `lens` — the granularity control ([R10]): a mass-fraction cutoff over normalized node weight; persistent stored state (`GranularityDial`), read at resolve time, NOT an intent field; dials the **structure axis**
- `temporal dial` — the control for how much of a stack is in view ([R10]/[R11]): surface = a still, span = history/motion; dials the **history axis**; one mechanism with scrub-back — the playhead ([R16])
- `motion` — the temporal dial run across a *span* of a stack ([R11]); NOT a control and NOT a stored field — a span is motion, a point is a still. (The v5.0 `recency` field, a frozen pre-computed motion substitute, is deleted — [R11].)
- `window` — the one tree at one camera/lens/temporal/standpoint setting ([R12]); every action — user or LLM — opens a new window; windows **accumulate**, they do not replace; realized as `Window`
- `the window-set` / `the session` — the accumulating set of windows ([R13]): the look-trail, the simultaneous holding of multiple regions, and the authorship seam (user windows vs LLM windows)
- `authorship` — per state-change in a stack, whose it is ([R14]): the user's (Path A external arrival) or the LLM's (Path B `internal-derivation` emission); read from substrate `SourceRef.channel`, surfaced on every `StackEntry` and via `Window.openedBy`
- `PresentView` — the consumer-renderable atom projected from the held `PresentFrame`, carrying the tree's **structure** — nodes with weight/stack-surface/substitute-values/authorship, edges with thickness and their stack, the connectivity — at the granularity-cutoff extent ([R19]/[R20]); the projection, not the held state
- `projection` — the derivation of `PresentView` from the held `PresentFrame`; carries structure ([R19]); extent = the granularity cutoff ([R20])
- `extent` — what the projection carries: the active region the lens resolved ([R20]); NOT a hardcoded one-level neighbourhood (that residue is deleted); a resource ceiling caps a large region
- `standpoint` — the position argument of `present`; the append-index position a present is resolved at. null = the live present; non-null = a past position resolved by archive lookup ([R16])
- `scrub-back` — a present retrieval at a past position: an **archive lookup** of the past present from the per-user store ([R16]); the real frame of the movie, faithful — NOT a recompute
- `weighting` — chain-ping summation: accumulated rootward deposits, summed never averaged; one declared threshold theta; deposits land on the **facets** a ping routes through (facet model)
- `dependency edge` — read-computed directed edge `B -> A`: A is load-bearing for B's identity-coherence and more rootward (higher chain-ping weight). Never stored (LMA8, PrA7); realized as `FrameEdge` (parent->child, carrying the relation's stack — [R4])
- `load-bearing` — a relation is load-bearing for an identity iff `loadBearing(relation, identity) >= theta`; the score is type-blind (R1 — no `switch` on relation type)
- `facet` — a sub-identity of an upstream identity, on a downstream's routing path; a ping reaches the facet of an upstream identity, not the whole; the core is the one identity with no facets
- `collapse-to-mass` — a node below the granularity cutoff is not expanded as its own node; its mass is folded into its parent — chain-ping summation already deposited it there, so the fold is free
- `clustering` — relational co-location of identities sharing relational structure, surfaced by the walk; never a string merge; a token with no recorded clustering resolves as its own thin node
- `non-emitter` — a program that writes nothing to the substrate. F-present is a non-emitter ([R1]): it reads the substrate, holds its own present, and archives to its own store; it produces no substrate state-change

v6.0: the v5.0 vocabulary entries `snapshot` (the present is now named `the present` — a tree of stacks; "snapshot" implied a flat still), `status` as a separate entry (subsumed by `surface` — the stack's surface IS the status, [R7]), `zoomAnchor` (superseded by `camera`), `frame-resolution` (renamed `present-resolution`), and `breadcrumb` (the rootward walk is the tree's structure, not a named substitute) are **deleted or subsumed**. `tree of stacks`, `stack`, `surface`/`depth`, `carrier`, `the grid`, `the three controls`, `camera`, `lens`, `temporal dial`, `motion`, `window`, `the window-set`, `authorship`, `extent` are added. `composed-view-atom` is carried (`PresentView` remains the instance).

### §3.10 jurisdictionClaim

| axis | temporal | categorical | relational | positional |
|---|---|---|---|---|
| Schema | PrA1+PrA2+PrA6 | tree-of-stacks atom kind + stack-carrying node/edge + StackEntry + projected-view-atom kind + read-primitive enum | binds PresentFrame ↔ PresentView ↔ PresentIntent ↔ ReadPrimitiveTrace ↔ (StackEntry.authorship → SourceRef.channel) | atoms placed per Placement R3+R5 |
| Structure | PrA5 (one-operation closure + window grammar + dependency-walk clause: facet model, per-node/per-edge stack assembly, full-tree resolution at the granularity cutoff) | one-operation closure + the camera/temporal/standpoint control surface + the Window unit | binds PR1–PR8 ordering + camera/temporal/standpoint dispatch + every action → a Window | procedure steps 1–8 |
| Validity | PrA8 | determinism property kind | binds PresentIntent → PresentFrame/PresentView function | PrG8 in PR7 |
| Lifecycle | PrA7 (held live present; the per-user archive; non-emitter; the loop, the LLM as gravity) | held-present-state + the archive store + the accumulating Window set + the memory loop | binds runtime statefulness; binds the held present + archive + windows as F-present's own stores | F-present runtime at PR1–PR8 only |
| Coupling | PrA4 | access-discipline (userId/scope on reads + held present) | binds F-present to substrate (read side) + PS + consumers | HRs §6.2 (5) |

### §3.11 RC array axis-binding (re-stated from §2.3)

Each of the 9 RCs binds to the Schema axis (atom-typing references). Axis-coverage at RC-level: Schema dominant.

| RC | citingAtom | axis | referentKind |
|---|---|---|---|
| RC-01..RC-06 | substrate/LM atom refs (userId, scopeRef, standpoint, consumerRef, IdentityRef, StateChangeId) | Schema | substrate-atom-ref |
| RC-07 | PresentView.composition (full sub-shape) + PresentFrame held-present atom shape | Schema | l0-ratified-ref |
| RC-08 | SnapshotArchiveEntry + SnapshotArchiveKey archive-store schema | Schema | l0-ratified-ref |
| RC-09 | StackEntry.authorship → substrate SourceRef.channel (Path A / Path B) | Schema | substrate-atom-ref |

### §3.12 MA-V10 part B jurisdiction coverage declaration

At v6.0: jurisdiction coverage = 7 axiom-jurisdictionClaim paths × 9 RC entries = **63 cells** (v5.0: 56; +7 from RC-09). RC coverage is Schema-axis-dominant (all 9 RCs on Schema — RC-09 the new `SourceRef.channel` authorship citation). Structure/Validity/Lifecycle/Coupling axes carry axiom-level declarations resolved via §3.6 axiom prose + §3.10 jurisdictionClaim entries.


## §4 Validity

### §4.1 Gate count

**7 Standard-own gates** (PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8), 1:1 with the 7 axioms per G-M1. Plus the 87 inherited framework-tier gates.

**G-M1 re-derivation (v6.0).** v5.0 ran a clean 1:1 PrA↔PrG bijection over 7 axioms and 7 gates. v6.0 **deletes no axiom and no gate** — the bijection is carried at 7↔7, unchanged in cardinality. Three pairs are re-derived *in content*: PrA1↔PrG1 (the projection is re-derived to carry the tree's structure at the granularity-cutoff extent; PrG1 checks the stack-carrying nodes/edges and the structure-carrying composition), PrA2↔PrG2 (provenance now surfaces authorship; PrG2 checks every `StackEntry` carries `authorship`), PrA5↔PrG5 (the operation is re-stated against the three controls and the window grammar; PrG5 checks the three-control envelope).

| axiom | gate | axis |
|---|---|---|
| PrA1 | PrG1 (re-derived — stack-carrying nodes/edges + structure-carrying projection) | Schema |
| PrA2 | PrG2 (re-derived — authorship on every StackEntry) | Schema |
| PrA4 | PrG4 | Coupling |
| PrA5 | PrG5 (re-derived — the three-control envelope) | Structure |
| PrA6 | PrG6 | Schema |
| PrA7 | PrG7 | Lifecycle |
| PrA8 | PrG8 | Validity |

G-M1 holds at **7↔7, exact 1:1** — unchanged in cardinality from v5.0. No gate is deleted, none added, none rescued for symmetry, none smeared. v6.0 moves no gate count (§3.2); the three re-derivations are content changes inside the surviving PrG1, PrG2, PrG5.

### §4.2 Standard-own gate set (PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8 — 1:1 with the 7 axioms per G-M1)

| gate | tests | ground class (substrate §6.3) |
|---|---|---|
| **PrG1** | PresentFrame.nodes / PresentFrame.edges and PresentView.composition.nodes / .edges typed per atom inventory §2.1; **every FrameNode and FrameEdge, and every ViewNode and ViewEdge, carries a `stack: StackEntry[]`** ([R4] — the carriers are stack-carrying); PresentView.composition carries `root` + `camera` ViewNodeRefs and `extent = 'granularity-cutoff'` ([R20]); the projection carries the tree's structure ([R19] — not a flat name list); consumer reads PresentView without further composition step; PresentView.projectedFromFrame is a well-formed FrameIdRef and PresentView.window is a well-formed WindowRef | type-check + reference-resolution |
| **PrG2** | `provenance.sourceStateChangeIds.length` ≥ count of distinct StateChangeIds composed (on both PresentFrame and the PresentView projection); `provenance.readPrimitivesUsed.length` ≥ 1; **every `StackEntry` on every node-stack and edge-stack carries `authorship ∈ {'user','llm'}`** ([R14]) | cardinality + type-check |
| **PrG4** | every substrate **read** F-present invokes carries the intent's userId + scopeRef; the held PresentFrame is keyed (userId, scopeRef) matching the intent; every `SnapshotArchiveEntry` written to the archive carries the same userId + scopeRef in its `SnapshotArchiveKey` | type-check |
| **PrG5** | the operation's control envelope on `view.derivedFromIntent` is valid: `camera` is a well-formed `CameraSetting` (`{mode:'derived'}` or `{mode:'set', anchor: IdentityRef}`); `temporal` is a well-formed `TemporalSetting` (`{depth:'surface'}` or `{depth:'span', ...}`); `standpoint ∈ PositionRef \| null`. (v6.0 re-derived — the v5.0 `standpoint`/`zoomAnchor` checks are re-stated against the three-control envelope: `zoomAnchor` is generalized into `CameraSetting`, `temporal` is added — §3.2.) | type-check + reference-resolution |
| **PrG6** | F-present's substrate-read call sites use exactly {identity-recurrence, role-pattern, adjacency, iterate-axis}; when `ThreadQueryInput.contentClass` is passed, the value is a well-formed read-side content-classification filter (filtering on what emitters declared per LMA13 — F-present is a non-emitter and declares none) | type-check + enum-membership on the read primitive set |
| **PrG7** | F-present's retained state is exactly: the live PresentFrame (one per userId:scopeRef), the GranularityDial (lens) position (one per userId:scopeRef), the accumulating Window set, and the per-user present archive — all correctly keyed, no stale cross-invocation leakage; F-present makes zero **substrate** writes (non-emitter — verified: no writeStateChange call site in the slice); the archive write targets F-present's own LIV-database store, never the substrate | reference-resolution + cardinality (zero substrate-write call sites) |
| **PrG8** | replay test: two invocations of F-present with identical PresentIntent against identical substrate state (and identical lens-dial position) resolve a field-equivalent PresentFrame and project a field-equivalent PresentView across nodes, edges, their stacks, camera/root, provenance.cameraDerived, weighting; a scrub-back with identical standpoint returns the identical archived present | deterministic-function-result |

**PrG1 re-derivation (v6.0 — Shot 1/6).** v5.0 PrG1 checked the structure-carrying projection (`root`/`anchor`, ViewNode parent/children/status/substituteValues). v6.0 re-derives PrG1's content: it now checks that every node and every edge — on both `PresentFrame` and the `PresentView` projection — carries a `stack: StackEntry[]` ([R4]); that the composition carries `extent = 'granularity-cutoff'` ([R20]); and that `PresentView.window` is a well-formed `WindowRef`. PrG1 stays one gate, 1:1 with PrA1; gate count holds.

**PrG2 re-derivation (v6.0 — Shot 5).** v5.0 PrG2 checked provenance cardinality. v6.0 adds the authorship check: every `StackEntry` carries `authorship` ([R14]). It lands on PrG2 because authorship is a provenance fact (PrA2); the gate's subject — traceability — is extended, not replaced. PrG2 stays one gate, 1:1 with PrA2.

**PrG5 re-derivation (v6.0 — Shot 7).** v5.0 PrG5 checked `standpoint` + `zoomAnchor` validity. v6.0 re-states it against the three-control envelope: `camera` (a `CameraSetting` — `zoomAnchor` generalized into the `'set'` mode), `temporal` (a `TemporalSetting` — new), `standpoint` (carried). This is a content re-derivation of the same gate subject — intent-parameter validity — not a split-subject deletion: nothing is orphaned, the v5.0 checks are re-stated and one (`temporal`) is added. PrG5 stays one gate, 1:1 with PrA5; gate count holds at 7.

All 7 gates resolve to substrate §6.3 ground classes — mechanical per MA-V11.

### §4.3 Gate execution order

E1 Identity → E2 Schema → E3 Structure → E4 Validity → E5 Lifecycle → E6 Coupling → E7 Judgment → E8 Universal+Meta.

### §4.4 Backward-invalidation policy

Per substrate §6.4: failure at any Ei invalidates Ei+1..E8 results from this run; deriver re-enters at failed Ei after correction.

### §4.5 Failure modes

| code | trigger | recovery |
|---|---|---|
| `PRESENT_INTENT_INVALID` | PR1 J-intent-binding gate fails (any criterion — v6.0: the three-control-envelope criteria, §7.1) | return Result.err with structured error naming failed criterion; no PR2..PR8 execution |
| `PRESENT_AUTH_REJECTED` | PR2 PS handshake rejects userId+scopeRef | return Result.err; no read performed |
| `PRESENT_READ_FAILED` | PR4 substrate-read primitive returns error from LM, OR a scrub-back archive lookup finds no present at the requested position ([R16]) | return Result.err; no PR5..PR8 |
| `PRESENT_GATE_FAILED` | PR7 any of PrG1, PrG2, PrG4, PrG5, PrG6, PrG7, PrG8 fails | return Result.err with failing gate id |

**Four failure-mode codes — unchanged at v6.0.** No error code is camera/lens/temporal-specific: `PRESENT_INTENT_INVALID` fires on *any* failed J-intent criterion (its trigger text is re-stated for the three-control envelope, §7.1, but the code is the same code); `PRESENT_AUTH_REJECTED`, `PRESENT_READ_FAILED`, `PRESENT_GATE_FAILED` are untouched. Error code count holds at 4. Scrub-back failure — an archive lookup that finds no present at a position — is reported through `PRESENT_READ_FAILED` (the lookup is a read). v6.0 moves no error-code count.

---

## §5 Lifecycle

- **versionTransition:** v5.0 -> v6.0 (major per MA-L1 — the present's internal model is re-derived: the `PresentFrame` node and edge atoms re-shaped to stack-carrying, the `PresentView` projection re-shaped, the `PresentIntent` envelope re-stated against the three controls, two schema fields deleted). v6.0 moves **no P-primitive count** (§3.2) — the only count move is RC 8->9; every structural move is a re-derivation inside a surviving primitive or an own-atom re-shape. `stateApplied` preserved at `applied` — v6.0 is an internal-model re-derivation of an already-applied L3 program; F-present remains a live registered slice across the transition.
- **amendmentTrigger:** substrate amendment affecting consumed atoms (A-09/A-12/A-17/A-18) or `SourceRef.channel`, LM amendment affecting the LMA9 thread primitives, Manual SPEC bump affecting the Tool definition or the per-user archive-store slot, L0-ratified change to the three-control intent contract (camera/lens/temporal), L0-ratified change to the tree-of-stacks model, the window grammar, the held-present/archive model, or the lens-dial mechanics, or PS amendment affecting PA-IR3 auth delegation.
- **deprecations:** the v5.0 schema fields `FrameNode.dominantSurfaceForm` (subsumed — the dominant value is the stack surface, `stack[last].surfaceForm`), `FrameNode.recency` ([R11] — a frozen pre-computed motion substitute; motion is the temporal dial run across a span), and `PresentFrame.resolvedAt` ([R11] — redundant; `standpoint` + `frameId` already position a present) are **removed**. The own-atoms `AnchorTrace` (superseded by `CameraTrace`) and `PerspectiveDeclaration` (the present has the two fixed axes — structure and history; the projection always presents the tree, there is no caller-or-projection-selected axis) are **removed**. The v5.0 "zoom" operating model — a control-use that *replaced* the prior view — is **superseded** by the window grammar (every action opens an accumulating window, [R12]). No *capability* is deprecated — the present still resolves, the past is still scrub-backable, granularity still dials; the deletions remove residue (a frozen motion field, a redundant position field, a superseded trace atom) and the window grammar is strictly more (it never loses a look). (`FocusSelector`/`OrderingSelector` were already removed at v5.0; `PresentViewEmission`/PrA3/PrG3/HR-PR-Substrate-Write at v4.0.)
- **additions:** the `StackEntry` atom ([R4]/[R14]) carrying `position` + `surfaceForm` + `authorship`; the `Window` atom ([R12]/[R13]) and `WindowRef`; `CameraSetting` / `TemporalSetting` / `CameraTrace` ([R9]/[R10]); the stack-carrying re-shape of `FrameNode`/`FrameEdge`/`ViewNode`/`ViewEdge` ([R4]/[R5]); the three-control `PresentIntent` envelope; `PresentView.composition.extent` + `.window`; RC-09 (the `SourceRef.channel` authorship citation, [R14]).
- **activationFlow:** v6.0 is derived, derive-tier audited, built, build-tier audited, then L0-ratified, then deployed. This document is the derive artifact; ratification is pending.
- **bootstrap:** non-re-entrant per substrate §13.5 registry-lock.
- **firstRunExecution:** F-present is already first-run-executed (v1.0 S12, 2026-05-18); v6.0 preserves first-run-executed state — an internal-model re-derivation, not a re-genesis.
- **escalation — none raised at v6.0.** The spec named one genuine stop-point: the M1/M3 coupling — M1 (tree of stacks) and M3 (three controls) both touch PrA5, and M2 (the grid) is the read-model the PrA5 walk produces. Checked for separability before the derive and closed cleanly. PrA5 has structurally distinct parts: the **operation-closure signature** (the callable surface — Shot 7 re-states it against the three controls), the **window grammar** (Shot 4 — the operation-invocation discipline), and the **dependency-walk sub-derivations (1)–(4)** (the internal computation — Shot 1 re-derives sub-derivation (4) to stack assembly). Each shot touches one part; PrA5 is internally consistent at the close of each. The grid (M2/Shot 2) is the §3 structure *stated* — it adds no primitive and contradicts no clause; it is the read-model name for what PrA5 already produces. No L0 disposition was required; the shots were cleanly separable as the spec sequenced them. No other escalation. None of the §16.10 parked items (the temporal dial's standing-vs-per-look setting, the windows-wall spec, the tool/connector surface) was needed to derive any shot — `TemporalSetting` carries the temporal dial per-look and explicitly does not decide the parked standing-vs-per-look question. The held `sprint-b3-present-v5` package is superseded by v6.0 and does not deploy.

---

## §6 Coupling

### §6.1 Carrier

Present Standard's carrier = `self`. F-present projects `PresentView` directly to consumers via HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter. No enclosing carrier framework. **MA-C1 satisfaction:** carrier = `self` declared with rationale per substrate §9 Carrier enum. Precedent: Builder Standard v1.0 §6.1 carrier=self idiom.

v6.0: carrier = `self` is unchanged. F-present projects `PresentView` to consumers via the three consumer HRs; it makes no substrate write (non-emitter, [R1]). The archive write ([R15]) targets F-present's own LIV-database store — an internal write, not a cross-framework handoff. The v6.0 re-derivation re-shapes what the projection *carries* (the tree's structure) and adds the `Window` unit, but the consumer handoff endpoints are unchanged — no HR is added.

### §6.2 Handoff rules

**Five framework-local HR instances — unchanged at v6.0.** The v6.0 re-derivation re-shapes the atoms a handoff carries (the structure-carrying projection, the `Window`) but moves no endpoint — every HR's endpoint pair is unchanged. No HR is orphaned, none added. HR count holds at 5. (The archive write is internal to F-present's own store, not a handoff; HR-PR-Substrate-Write was deleted at v4.0 — F-present is a non-emitter.)

| HR | direction | endpoints | carrier applicability | diagnostic significance | captureShape |
|---|---|---|---|---|---|
| HR-PR-LM | F-present -> Living Memory v3.5 | Tool -> Standard | `['self']` | `true` | substrate-**read** invocations (3 LMA9 thread primitives + iterate_axis); records carry `SourceRef.channel` — read for per-state-change authorship ([R14]); `parameters` includes the `contentClass?` optional read-side filter |
| HR-PR-PS | F-present ↔ Perimeter Standard v1.2.1 | Tool ↔ Standard | `['self']` | `true` | scope + userId handshake at PR2 per PA-IR3 delegation |
| HR-PR-Modality | F-present → Modality (F-chat, F-output, F-dashboard) | Tool → Modality | `['self']` | `true` | PresentView projection emitted to renderer; Manual L158 honored |
| HR-PR-Generator | F-present → Generator (F-discover, F-plan, F-builder, F-verify) | Tool → Generator | `['self']` | `true` | PresentView projection consumed by generator cycle |
| HR-PR-AIAdapter | F-present → F-ai-adapter | Tool → Tool | `['self']` | `true` | PresentView projection passed to LLM-using tool without further composition |

**The archive write is not a handoff (v6.0 — carried).** F-present's archive write ([R15]) goes to its own per-user store in the LIV database. A program writing to its own store is not a cross-framework handoff — a handoff crosses a framework boundary; this does not. The archive write declares no HR. F-present's only cross-framework couplings remain the five HRs above: one substrate read, one PS handshake, three consumer projections.

**`HR-PR-Consumer` — collective alias.** `HR-PR-Consumer`, used in PR8 (§3.7), is a **collective alias** for the three PresentView-projecting HRs — HR-PR-Modality, HR-PR-Generator, HR-PR-AIAdapter — selected per `consumerRef`. It is **not a sixth HR**: it declares no new endpoint, carrier, or captureShape of its own. The HR count remains **5**.

### §6.3 Adjacent-framework declarations

**Consumes:** substrate-v1-1 v1.8.3 (atoms A-09/A-12/A-17/A-18, `SourceRef.channel` read for authorship — A-24 ContentClass consumption dropped at v4.0); living-memory v3.5 (LMA1, LMA3, LMA4, LMA5, LMA6, LMA7, LMA8, LMA9, LMA10, LMA12, LMA13; ThreadQueryInput.contentClass? optional read-side filter; three LMA9 thread primitives + iterate_axis); perimeter-standard v1.2.1 (PA-IR3 auth delegation); metaframework-v3-1 v3.3.1; generation-procedure-v1-0 v1.1.7; Manual SPEC-v13.4; LIV-Standard v1.5.2; Placement Standard v1.0.

**Consumed by:** F-chat, F-output, F-dashboard (Modalities), F-discover, F-plan, F-builder, F-verify (Generators), F-ai-adapter (Tool).

### §6.4 OperatorInterface (per substrate §4 A-13 + V5 verification)

`runtimeState: 'declared'`.

```
operatorInterface = {
  runtimeState: 'declared',
  invokeShape: '(PresentIntent) → Result<PresentView, PresentError>',
  sideEffect: 'no substrate write — F-present is a non-emitter ([R1]). PR6 holds the PresentFrame as F-present\'s live state and archives it to F-present\'s own per-user LIV-database store ([R15]); both are F-present\'s internal stores, not external side effects on the substrate.',
  observability: 'every invocation resolves a PresentFrame with full provenance and projects a PresentView; the held frame is inspectable as F-present\'s state'
}
```

v6.0: F-present has no substrate side effect. PR6 writes to F-present's own stores — the held live present and the per-user archive ([R15]) — neither of which is the substrate.

### §6.5 Substrate-version-pin

substrate-v1-1 v1.8.3. Uniform across all atom references. (v6.0 reads substrate atoms — including `SourceRef.channel` for authorship, RC-09; it writes none — the held present, the lens dial, the window-set, and the archive are F-present's own stores.)

### §6.6 Capture shapes (per substrate §8.2 amended P6)

| HR | captureShape |
|---|---|
| HR-PR-LM | `{ readKind: 'identity-recurrence' \| 'role-pattern' \| 'adjacency' \| 'iterate-axis', parameters: <kind-specific>, contentClassFilter?: ContentClass, recordCount: number, atTime: Timestamp }` |
| HR-PR-PS | `{ direction: 'request' \| 'response', userId: UserIdRef, scopeRef: ScopeRef, authority: PSAuthorityDecision, atTime: Timestamp }` |
| HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter | `{ consumerRef: FrameworkRef, viewId: ViewIdRef, projectedFromFrame: FrameIdRef, emittedView: PresentView, atTime: Timestamp }` |

v6.0: the HR capture shapes are unchanged — the consumer-HR shape already carries `projectedFromFrame: FrameIdRef`; the v6.0 structure-carrying projection rides inside the `emittedView: PresentView` field.

### §6.7 Provenance contract

Every PresentFrame carries `provenance.sourceStateChangeIds` + `provenance.readPrimitivesUsed` + `provenance.cameraDerived`; every PresentView projected from it carries the same plus `weightingApplied` per §2.1 + PrA2. Every `StackEntry` additionally carries `authorship` ([R14]) — the per-state-change Path A / Path B provenance. The provenance is the load-bearing reversibility surface per §6.3 `appealCourtIs: substrate-state-change-table` — the substrate ledger is the appeal court, and F-present's provenance traces every node, every edge, and every stack entry back to it.

### §6.8 Cross-framework handoff contracts

- **HR-PR-LM:** F-present consumes LM v3.5's R3 `threadQuery(ThreadQueryInput)` and `iterate_axis(start, direction, count)` **read** primitives; records carry `SourceRef.channel`, read for per-state-change authorship ([R14]). The `ThreadQueryInput.contentClass?` optional read-side filter is used per PR4.
- **HR-PR-PS:** F-present consults PS v1.2.1 PA-IR3 at PR2 for scope+userId authorization.
- **HR-PR-Modality / HR-PR-Generator / HR-PR-AIAdapter:** F-present projects the held `PresentFrame` into a `PresentView` and emits it consumer-renderable per PrA1.

v6.0: F-present consumes no LM write primitive — it is a non-emitter ([R1]). The archive write is to F-present's own LIV-database store, not via any LM substrate primitive.

---


## §7 Judgment

### §7.1 J-intent-binding (Standard-local judgment template)

Validates the incoming `PresentIntent` at PR1. **Re-derived at v6.0** — the intent envelope is re-stated against the three-control model ([R9]), so the criteria are re-stated against `camera` / `temporal` / `standpoint`. The template itself survives — J-intent-binding still validates `PresentIntent` at PR1 — so the P5 judgment-template count holds at 1 (§3.2).

```
J-intent-binding:
  kind: validation
  consumedBy: present-standard-v6-0 §3.7 PR1 (judgmentInputRef at every F-present invocation)
  shape: Judgment per substrate §6.2
  input:    PresentIntent
  criteria:
    C1: intent.standpoint is null OR a non-negative integer PositionRef
        Mechanical: type-check + cardinality on the standpoint parameter.
    C2: intent.camera is a well-formed CameraSetting —
          { mode: 'derived' }                       OR
          { mode: 'set', anchor: <well-formed IdentityRef> }
        Mechanical: discriminated-union tag check + (for 'set') reference-resolution
        on the anchor. The criterion checks SHAPE only — that a 'set' anchor is a
        resolvable IdentityRef; it does NOT check the identity exists in any present,
        which is the LLM's responsibility, not a validation gate's.
    C3: intent.temporal is a well-formed TemporalSetting —
          { depth: 'surface' }                      OR
          { depth: 'span', from?: PositionRef, to?: PositionRef }
        Mechanical: discriminated-union tag check + (for 'span') type-check on the
        optional from/to PositionRefs.
  output: {ok: true, validatedIntent: PresentIntent} | {ok: false, code: 'PRESENT_INTENT_INVALID', failedCriterion: 'C1' | 'C2' | 'C3'}
```

**Criteria re-stated against the three controls (v6.0).** v5.0 carried two criteria — C1 (standpoint) and C2 (zoomAnchor). v6.0 re-states the criteria set against the three-control envelope: **C1 (standpoint)** is carried unchanged; **C2** is re-derived from a flat `zoomAnchor` check to a `CameraSetting` discriminated-union check (the `zoomAnchor` validity is now the `'set'` arm of C2 — `zoomAnchor` is generalized into `CameraSetting`, not deleted); **C3 is added**, validating the new `temporal: TemporalSetting`. The lens is not a criterion — it is stored dial state, not a `PresentIntent` field ([R10]/[R2]). The criterion set goes from two to three; the `failedCriterion` union widens to `'C1' | 'C2' | 'C3'`. All three reduce to substrate §6.3 ground classes — mechanical per MA-V11. The template count holds at 1: J-intent-binding survives as the PR1 intent validator; only its criteria are re-derived. This is a content re-derivation of the same gate subject — intent-parameter validity — not a split-subject deletion: nothing is orphaned (v5.0's `standpoint` and `zoomAnchor` checks are both carried, the latter as C2's `'set'` arm), and one criterion (`temporal`) is added.

### §7.2 Consumed judgments (by reference)

- `J-axis-mece` from MFv3 §7
- `J-axiom-dist` from MFv3 §7

Both consumed by reference per substrate §1.3 S-03; no redeclaration.

---

## §8 Self-audit results

### §8.1 Gate results (current)

v6.0 is a MAJOR revision that moves **no P-primitive count** (§3.2 — the only count move is RC 8->9). The E1–E8 framework-tier suite is re-run against v6.0 and the results are **reported, not asserted-pass** — the deriver does not force-pass. The deriver's report:

| Bundle | Gates | v5.0 result | v6.0 amendment surface | v6.0 reported result |
|---|---|---|---|---|
| E1 Identity | 9 | 9/9 PASS | version v5.0 -> v6.0 (major); predecessor = held v5.0 package; substrate-pin v1.8.3 unchanged; LM-pin v3.5 unchanged; `primitive` renamed `frame-resolution` -> `present-resolution`; `produces` set descriptions re-stated (tree of stacks); referentCitations 8 -> 9 | **9/9 PASS** — Identity fields are mechanical declarations; the version bump, predecessor naming, the primitive rename, and the produces-set re-statement are well-formed; the RC-count field tracks §2.3 (8->9). |
| E2 Schema | 9 | 9/9 PASS | `FrameNode`/`FrameEdge`/`ViewNode`/`ViewEdge` re-shaped to stack-carrying ([R4]); `StackEntry`/`Window`/`CameraSetting`/`TemporalSetting`/`CameraTrace` added; `FrameNode.dominantSurfaceForm`/`recency` + `PresentFrame.resolvedAt` deleted; `AnchorTrace`/`PerspectiveDeclaration` deleted; `PresentIntent` re-stated against the three controls; `PresentView.composition` carries `extent`+`window`; RC 8 -> 9 (RC-09 added) | **9/9 PASS** — the atom inventory is internally consistent: every declared atom is reachable, every RC cites a live atom, the deleted fields/atoms leave no dangling reference (verified by the §2/§3.9 sweep — `PresentIntent` no longer names `zoomAnchor`, the §2.4 vocabulary drops `AnchorTrace`/`PerspectiveDeclaration`/`status`-as-entry). RC-09 cites `SourceRef.channel`. The own-atom inventory changes substantially (4 re-shapes, 5 additions, 5 deletions) — within E2's tolerance: E2 gates inventory *consistency*, not a fixed atom count; and **no P-primitive count moves**. |
| E3 Structure | 18 | 18/18 PASS | PrA1 re-derived (structure-carrying projection — Shot 6); PrA2 re-derived (authorship — Shot 5); PrA5 re-derived (tree of stacks + window grammar — Shots 1/2/4); PrA7 re-stated; PrA8 re-stated; PR1/PR3/PR4/PR5/PR6/PR8 re-derived; **axiom count 7->7, procedure-step 8->8, axis distribution 3-1-1-1-1-0-0 unchanged** | **18/18 PASS** — no count delta. The axiom count holds at 7 (the seven moves land inside surviving axioms or as own-atom re-shapes — §3.2; no axiom is orphaned, none forced); the procedure-step count holds at 8 (a window is the output unit of PR8, not a new step); the axis distribution is unchanged. Every axiom earns its place (§3.6); five axes carry ≥1 axiom (G-U3). The re-derivations are content changes inside surviving primitives — exactly what E3 expects of an internal-model re-derivation that moves no count. |
| E4 Validity | 12 | 12/12 PASS | PrG1 re-derived (stack-carrying nodes/edges + structure-carrying projection); PrG2 re-derived (authorship on every StackEntry); PrG5 re-derived (three-control envelope); G-M1 re-derived 1:1 at 7<->7; error-code count 4->4 | **12/12 PASS** — no count delta. G-M1 holds exactly at 7<->7 — unchanged cardinality from v5.0; no gate deleted, none added. PrG1/PrG2/PrG5 are content re-derivations of surviving gates (not split-subject deletions — nothing orphaned). Error-code count holds at 4 (no code is camera/lens/temporal-specific). E4 gates the bijection's exactness, which holds. |
| E5 Lifecycle | 12 | 12/12 PASS | versionTransition v5.0 -> v6.0; deprecations row records the `dominantSurfaceForm`/`recency`/`resolvedAt` field deletions, `AnchorTrace`/`PerspectiveDeclaration`, and the "zoom" model superseded by the window grammar; additions row records `StackEntry`/`Window`/`CameraSetting`/`TemporalSetting`/`CameraTrace`/RC-09; escalation = none raised (the M1/M3 PrA5 coupling checked and closed cleanly) | **12/12 PASS** — versionTransition is well-formed; the deprecations and additions rows are complete; the escalation field correctly records the checked-and-closed M1/M3 coupling as *not* an escalation. The axiom content re-derivations are valid major-version lifecycle changes. |
| E6 Coupling | 11 | 11/11 PASS | HR count 5->5 (v6.0 adds no cross-framework endpoint — windows + projection go out the existing HRs, the authorship read is on the existing HR-PR-LM); carrier=self unchanged; operatorInterface sideEffect carried | **11/11 PASS** — no count delta. The HR set holds at 5; carrier=self holds; every HR has a live endpoint. v6.0 re-derives the present's internal model; it touches no coupling endpoint. E6 confirms the archive write and the authorship read declare no new HR. |
| E7 Judgment | 6 | 6/6 PASS | J-intent-binding re-derived — criteria re-stated against the three-control envelope (C1 standpoint carried; C2 re-derived flat-`zoomAnchor` -> `CameraSetting`; C3 `temporal` added); template count unchanged at 1 | **6/6 PASS** — the judgment-template count holds at 1: J-intent-binding survives as the PR1 intent validator; only its criteria are re-derived (the criteria-set size is not a P-primitive count). All three criteria reduce to substrate §6.3 ground classes. |
| E8 Universal+Meta | 10 | 10/10 PASS | G-U3 axis-coverage preserved (5 axes carry ≥1 PrA); G-M1 1:1 HOLDS at 7<->7; MA-V10 part B coverage re-stated (7×9 = 63 cells) | **10/10 PASS** — G-U3 holds (5 axes covered); G-M1 holds exactly (7<->7); the jurisdiction-coverage declaration is re-stated for the RC 8->9 move (56->63 cells — the only universal-tier number that moves, tracking the single RC addition). |
| **Total** | **87** | **87/87 PASS** | **(v6.0 MAJOR revision — tree-of-stacks re-derivation; zero P-primitive-count movement)** | **87/87 PASS reported** — every framework-tier gate passes. v6.0 moves **no P-primitive count** — the only audit-visible numbers that move are RC 8->9 (and the derived 56->63 jurisdiction-cell count), the new `SourceRef.channel` authorship citation. There are **no count-delta regression notes**: v6.0 deletes no axiom, no gate, no HR, no leaf, no procedure step; an auditor running against memorized v5.0 counts sees agreement everywhere except the one expected RC addition. The own-atom inventory changes substantially — an internal-model re-derivation re-shapes schema atoms — but own-atom inventory is not a P-primitive count and E2 gates consistency, which holds. No gate is force-passed; each PASS is the deriver's honest assessment. Final result is the build-tier auditor's call. |

### §8.2 validity.overallResult

`PASS reported` — final result is the build-tier auditor's call. This document is the derive artifact; L0 ratification follows the build-tier audit per the dispatch sequence (§9). The deriver's honest position: all 87 framework-tier gates pass against v6.0; v6.0 moves no P-primitive count, so there are no count-delta regressions to flag — the only audit-visible movement is the single RC addition (RC-09, the `SourceRef.channel` authorship citation) and the derived jurisdiction-cell count 56->63. The headline the count table surfaced — a MAJOR version with zero P-primitive-count movement — is confirmed by the E1–E8 sweep: §16 re-derives the present's *internal model*, which re-shapes schema atoms and the content of axioms / gates / procedure steps, not the framework skeleton.

---

## §9 Change log

| Version | Date | Change | Source |
|---|---|---|---|
| **v6.0** | **2026-05-23 (Sprint B3 — present v5.0 -> v6.0: the tree-of-stacks re-derivation)** | **The tree-of-stacks re-derivation.** Predecessor: `present-standard.md` v5.0 (the held `sprint-b3-present-v5` package, R3 amendment base). Mode: structural. Derived from **§16 + §16-REF + §16-HIST** of `substrate-present-rederivation-working-record.md`, L0-confirmed — §16 the tree-of-stacks structure, §16-REF [R1]-[R20] the mechanism layer, §16-HIST the rework trail. This §16 supersedes the prior snapshot-internals §16 *whole*. The derive-and-build spec `b3-present-v6` is the L0-issued structural translation. v5.0's *outer* model — the loop, the non-emitter property, the per-user archive, scrub-back as an archive lookup, the substrate/present split, the LLM as gravity — is correct and is **carried unchanged in substance** ([R1]/[R15]/[R16]/[R17]/[R18]); v6.0 re-derives the present's **internal model**. Seven moves, seven shots: **Shot 1 — tree of stacks (M1+M7, [R3]/[R4]/[R5]).** The present is re-derived as **one connected tree of stacks**: every node (identity) and every edge (relation) is an append-only stack of state-changes, latest = surface, the rest = depth; identity and relation are **symmetric carriers**. `FrameNode` and `FrameEdge` re-shaped to carry `stack: StackEntry[]`; `StackEntry` atom added; the v5.0 flat `dominantSurfaceForm` value and flat `{parent,child,thickness}` edge re-derived. **Shot 2 — the grid (M2, [R6]/[R7]/[R8]).** The present's read-model stated as the grid — four questions (WHERE/HOW MUCH/WHAT STATE/WHEN) over two carriers; WHAT STATE and WHEN collapse to one cell (the stack read at a depth); absence is the negative space of WHERE/HOW MUCH, no atom. **Shot 3 — three controls (M3, [R9]/[R10]/[R11]).** The control surface re-derived to three — camera (anchor), lens (granularity), temporal dial (history); lens and temporal dial are the same kind of control on the two axes; motion is the temporal dial run across a span. The `recency` field **deleted** ([R11] — a frozen pre-computed motion substitute); the `resolvedAt` field **deleted** ([R11] — redundant: `standpoint` + `frameId` already position a present). **Shot 4 — windows (M4, [R12]/[R13]).** Every action — user or LLM — opens a new `Window`; windows accumulate, they do not replace. v5.0's "zoom" (which replaced the prior view) superseded. The `Window` atom added; windows are the grammar, not a fourth control. **Shot 5 — authorship (M5, [R14]).** Every `StackEntry` carries `authorship` — Path A external arrival (the user) or Path B `internal-derivation` (the LLM), read from substrate `SourceRef.channel`. PrA2 re-derived; RC-09 added. **Shot 6 — the projection (M6, [R19]/[R20]).** `PresentView` re-derived to carry the tree's structure — nodes with weight/stack/substitute-values/authorship, edges with thickness and their stack, the connectivity — at the **granularity-cutoff extent**; the v5.0 one-level neighbourhood deleted as residue. PrA1 re-derived. **Shot 7 — intent + control surface (M3/§2).** `PresentIntent` re-stated against the three-control model — `camera: CameraSetting`, `temporal: TemporalSetting`, `standpoint`; the lens is stored dial state, not an intent field ([R2]); `zoomAnchor` generalized into `CameraSetting`. The operation signature: `present(camera, temporal, standpoint)`. J-intent-binding criteria re-stated (C1 standpoint, C2 camera, C3 temporal). **G-M1.** Re-derived: clean 1:1 over the **same 7** axiom/gate pairs — unchanged cardinality from v5.0; PrA1<->PrG1, PrA2<->PrG2, PrA5<->PrG5 re-derived in content; no pair added, none deleted, none split-subject. **Version (MA-L1).** Predecessor v5.0 -> **v6.0, MAJOR** — the present's internal model is re-derived: node and edge atoms re-shaped to stack-carrying, the projection atom re-shaped, the intent envelope re-stated, two schema fields deleted. **Counts — v6.0 moves NO P-primitive count.** Leaf 0->0, Axiom 7->7, Judgment 1->1, HR 5->5, Gate 7->7, Procedure-step 8->8, Error-code 4->4; axiom-axis distribution 3-1-1-1-1-0-0 unchanged. **RC 8->9** (RC-09, the `SourceRef.channel` authorship citation) — the one count move. Own-atom inventory: 4 re-shapes (`FrameNode`/`FrameEdge`/`ViewNode`/`ViewEdge` stack-carrying; `PresentIntent`/`PresentView` re-stated), 5 additions (`StackEntry`, `Window`, `CameraSetting`, `TemporalSetting`, `CameraTrace`), 5 deletions (`FrameNode.dominantSurfaceForm`, `FrameNode.recency`, `PresentFrame.resolvedAt`, `AnchorTrace`, `PerspectiveDeclaration`). LM pin v3.5, substrate pin v1.8.3 — unchanged. **The headline:** a MAJOR version that moves no P-primitive count — v6.0 re-derives the present's *internal model*, which re-shapes schema atoms and the content of axioms/gates/steps; it does not move the framework skeleton. **E1-E8:** 87/87 PASS reported (§8.1) — no count-delta regression notes; the only audit-visible movement is RC 8->9 (and the derived 56->63 jurisdiction-cell count). **Escalation — none raised.** The M1/M3 coupling — M1/M3/M2 all touching PrA5 — was checked before the derive and closed cleanly: PrA5's operation-closure signature (Shot 7), window grammar (Shot 4), and dependency-walk sub-derivations (Shot 1) are structurally separable; PrA5 is internally consistent at the close of each shot; the grid (Shot 2) is the read-model name for what PrA5 already produces. None of the §16.10 parked items was needed. Recorded as checked-and-closed, not an escalation (§5). **Δ-Manual.** v6.0 re-derives the present's internal model; it does **not** touch the Manual's single-store / loop / memory-loop-placement claims — F-present remains a non-emitter Tool with its own held present and archive (the v13.4-A1/A2 amendments stand unchanged). No new Manual amendment is in scope; the delivery report states this explicitly. **Deploy.** The held `sprint-b3-present-v5` package is superseded by v6.0 and does NOT deploy; v6.0 deploys in its place. authorityClaim: {level:'L0', confirmedBy:'pending — ratification follows derive-tier audit + fix-round + build + build-tier audit + fix-round', timestamp:'sprint-b3-present-v6-derive-close-pending'} | L0 pending — ratification occurs after the audit chain |
| **v5.0** | **2026-05-23 (Sprint B3 — present v4.0 → v5.0: the present-structure re-derivation)** | **The present-structure re-derivation.** Predecessor: `present-standard.md` v4.0 (the held `sprint-b3-present-v4` package, R3 amendment base). Mode: structural. Derived from **§16 + §16-REF** of `substrate-present-rederivation-working-record.md`, L0-confirmed — §16 the structure, §16-REF [R1]–[R17] the reference layer. The derive-and-build spec `b3-present-v5` is the L0-issued structural translation. v4.0's *engine* — the dependency walk, chain-ping summation, the gate harness — is correct and carried; §16 corrects what F-present *holds*, not its skeleton. Five shots: **Shot 1 — intent collapse ([R6]/[R7]/[R16]).** `FocusSelector` and `OrderingSelector` deleted; `PresentIntent.focus` and `.ordering` removed — the anchor is derived from the human's latest state-change ([R6]), the dependency arrangement is what the resolution *is* ([R7]). `PresentIntent.zoomAnchor: IdentityRef|null` added — the one legitimate identity-input, present only on an LLM-initiated look ([R16]). The operation signature collapses `present(standpoint, focus, ordering)` → `present(standpoint, zoomAnchor)`. PrA5's operation-closure re-derived; PrA8's dispatch determinism re-stated; PR3 re-derived (anchor from the latest state-change, not a `focus` input); J-intent-binding criteria 6→2 (C2–C6 deleted, C1 kept, new C2 = zoom-anchor); the §3.7.1 five-preset table retired (the presets were fixed configurations of the deleted `focus`/`ordering` — [R3] residue). **Shot 2 — full-snapshot resolution ([R11]).** PrA5 sub-derivation (4) — the "focus + exactly one level of children, child-of-child is a re-focus" bound — deleted as residue; the snapshot is the **whole relationally-significant tree**. PR5's build step re-derived to full-tree resolution, depth bounded by the granularity cutoff (Shot 4), not a hop limit. **Shot 3 — hold + archive store ([R12]/[R13]).** F-present holds the live snapshot AND archives every resolved snapshot to a **new per-user store in the LIV database** — F-present's own store, NOT the substrate; the non-emitter property ([R4]) is unbroken. New atoms: `SnapshotArchiveEntry` (the archived-snapshot record — wraps a whole `PresentFrame`, the default-and-correct shape: a scrub-back must return the snapshot as actually resolved, [R14]) + `SnapshotArchiveKey` (`userId` + `scopeRef` + `position`). PrA7 re-derived (the v4.0 "no frame archive" clause inverted to the archive model); PR6 re-derived to hold + archive. RC-08 added (`l0-ratified-ref`, the archive-store schema). **Shot 4 — granularity dial ([R15]).** `GranularityDial` atom added — a mass-fraction cutoff over normalized node weight; persistent stored state keyed `(userId, scopeRef)`; read at resolve time; **not** a `PresentIntent` field. A node clears the cutoff → expanded; below → collapsed, its mass folded into the parent (chain-ping summation already deposited it — collapse-to-mass is free). Turning the dial does not recompute; recompute occurs only on a substrate change. PR5 step (4b) applies the cutoff. **Shot 5 — scrub-back + projection ([R14]/[R17]).** Scrub-back re-derived to an **archive lookup** — `present(standpoint=<position>)` retrieves the archived snapshot from the per-user store; the v4.0 `asOfPosition` ceilinged-recompute path deleted (PrA6 clause, PR4 routing, the HR-PR-LM `asOfPosition` capture-shape field, PrG6 `asOfPosition` clause all removed). The `PresentView` projection re-derived to **carry structure** ([R17]): `composition` gains `edges: ViewEdge[]` + `root`; `composition.focus` renamed `anchor`; `ViewNode` gains `parent`/`children`/`status`/`substituteValues`; `ViewThread` renamed `ViewEdge` and carries `weight`. **Δ-G-M1.** G-M1 re-derived: clean 1:1 over the **same 7** axiom/gate pairs — unchanged cardinality from v4.0; PrA5↔PrG5 and PrA7↔PrG7 re-derived in place. PrG5 is split-subject (focus/ordering enum-membership half deleted, standpoint+zoomAnchor half kept), per the standing rule from the v4.0 PrG4 disposition. **Version (MA-L1).** Predecessor v4.0 → **v5.0, MAJOR** — the `PresentIntent` contract breaks, a new per-user store is added, two own-atoms are deleted, the projection atom is re-shaped. **Counts — v5.0 moves NO primitive count.** Leaf 0→0, Axiom 7→7, Judgment 1→1, HR 5→5, Gate 7→7, Procedure-step 8→8 (PR6 absorbs the archive write — no PR9); axiom-axis distribution 3-1-1-1-1-0-0 unchanged. RC 7→8 (RC-08, the archive-store schema). Own-atom inventory: −2 (`FocusSelector`, `OrderingSelector`) +1 (`SnapshotArchiveEntry`), two atoms re-shaped (`PresentIntent` collapsed, `PresentView` projection corrected). Error-code 4→4. LM pin v3.5, substrate pin v1.8.3 — unchanged. **The headline:** every structural move is a re-derivation *inside* a surviving primitive or an own-atom schema change — the residue v5.0 removes (`focus`, `ordering`, the one-level bound) lived as clauses and parameters inside PrA5/PR3/PR5/J-intent-binding, not as standalone primitives. **E1–E8:** 87/87 PASS reported (§8.1) — no count-delta regressions to flag (v5.0 moves no primitive count); the only audit-visible movement is the single RC addition. **Escalation — none raised.** The M1/M3 coupling in PrA5 (anchor re-derivation + walk re-derivation both landing in PrA5) was checked before the derive and closed cleanly: PrA5's operation-closure signature (Shot 1) and its dependency-walk sub-derivations (Shot 2) are structurally separable; Shot 1 closes the signature collapse without touching the walk, Shot 2 deletes sub-derivation (4) without touching the signature. Recorded as checked-and-closed, not an escalation (§5). **Δ-Manual.** A new per-user snapshot-archive store is added; the Manual phantom-layer addendum / Operations slot is amended for v5.0 — delivered as `liv-manual-amendment-v13.4-A2.md` in the v5.0 package. **Deploy.** v5.0 is **superseded by v6.0** — it was derived against the snapshot-internals §16, which §16 (tree-of-stacks) supersedes whole; v5.0 does NOT deploy. authorityClaim: {level:'L0', confirmedBy:'superseded by v6.0 before ratification', timestamp:'sprint-b3-present-v5-superseded'} | L0 — superseded by v6.0, not deployed |
| **v4.0** | **2026-05-23 (Sprint B3 — Present Standard v3.0 → v4.0 reconciliation: the present-as-continuous-frame model)** | **The present-as-continuous-frame re-derivation.** Predecessor: `present-standard.md` v3.0 (the held `sprint-b3-present-joint` package, R3 amendment base). Mode: structural — the phantom layer is known (§16 of `substrate-present-rederivation-working-record.md`, L0-confirmed); it was filed on the wrong axis in v3.0 and is re-structured. Derived from §16; the reconciliation spec `spec-present-v4-reconciliation.md` is the L0-issued structural translation. The v3.0 engine — the dependency walk, chain-ping summation, the `{dependency,temporal}` ordering enum, the gates and contracts on the walk — is correct and is carried; ONE architectural fact inverts and every count moves because of it. **Δ-PrA7 (Shot 1 — §16.1/3/6).** PrA7 re-derived: v3.0 declared F-present stateless and recompute-every-call; v4.0 declares F-present **stateful** — it holds the live `PresentFrame`, F-present's own resolved present keyed `(userId,scopeRef)`. LMA8 honored: LMA8 forbids the *substrate* storing derived geometry; the held frame is F-present's own, not the substrate's. The continuous-present loop (§16.3): substrate accumulates → F-present resolves the frame → the LLM responds according to it → the response IS the new present → it writes to substrate → returns as the last frame; no turn. Scrub-back (§16.6) is a ceilinged recompute (`asOfPosition`), not a frame-archive lookup — F-present holds the live frame only. PrA7 stays one Lifecycle-axis axiom; its content inverts. **Δ-non-emitter / orphan deletion (Shot 2 — §16.2).** F-present writes nothing to the substrate. Deleted exhaustively, each traced to an orphan the non-emitter model genuinely produces: `PresentViewEmission` (P3 Leaf 1→0); **PrA3** (the substrate-write axiom — deleted whole; its apparent live half, the channel/no-modify clause, is vacuous under the non-emitter property, recorded with that basis; axiom 8→7); **PrG3** (PrA3's 1:1 gate; gate 8→7); **HR-PR-Substrate-Write** (the F-present→Substrate handoff — no such handoff exists; HR 6→5; the §6.6 capture-shape row, §6.8 contract line, §6.1 carrier prose all struck); **RC-07, RC-09** (the emission's substrate-citation rows; RC 9→7, array re-numbered contiguous); **`PRESENT_EMISSION_REJECTED`** (the error code for a write rejection — no write; error-code 5→4; the v3.0 "five codes preserved" line retired); the `view-emission`/`view-witness`/`view-trail` vocabulary entries. **PrG4 — split-subject, L0-dispositioned (A).** v3.0 PrG4 gated TWO subjects: (a) reads carry userId+scopeRef, (b) emissions carry userId+scopeRef. The non-emitter model orphans only (b). Per L0 disposition and the standing rule — split-subject elements have the live half re-derived and kept, the orphaned half deleted, never delete-whole for symmetry, never smear — **PrG4 is re-derived and KEPT** gating the read-side carry only; gate count is 8→7 (only PrG3 deletes whole). PrA4's read-side userId/scope carry stays gated. **PrG7 re-derived.** v3.0 PrG7 gated statelessness; statelessness is inverted by Shot 1; PrG7's subject (between-invocation state) is live and is re-derived to gate the held-frame discipline (the live frame is the only retained state, keyed (userId:scopeRef), zero substrate writes). **Δ-G-M1.** G-M1 re-derived: clean 1:1 over 7 surviving axiom/gate pairs (PrA1↔PrG1, PrA2↔PrG2, PrA4↔PrG4, PrA5↔PrG5, PrA6↔PrG6, PrA7↔PrG7, PrA8↔PrG8); the bijection is *cleaner* at v4.0 (v3.0's PrG4↔PrA4 pairing was loose; the emission deletion removes the looseness). **Δ-PresentFrame / PresentView projection (Shot 3 — §16.1/3).** `PresentFrame` declared as F-present's own held atom — the weighted rooted tree (resolved nodes with folded substitute-values, directed parent/child FrameEdges computed from weight, per-node weight/status/recency, the user-identity root, the standpoint). `PresentView` re-derived as the **projection** of `PresentFrame` (not the same atom) — what consumers render; it gains `projectedFromFrame: FrameIdRef`. PR6 re-derived: from "write `PresentViewEmission` to substrate via `writeStateChange`" to "resolve the `PresentFrame` into F-present's own hold" — no substrate write; procedure-step count unchanged at 8 (PR6 keeps a real terminal job). PR8 projects the held frame into the emitted `PresentView`. **Δ-PrA5 facet correction (Shot 4 — §16.4).** The chain-ping summation deposit rule re-derived to the facet model: a ping deposits along the **facets it actually routes through** — the sub-identities on its routing path — NOT into every identity on a more-rootward ring. Rings are positional only (relative jump-distance to core). Overlap = two downstreams through the same facet of an upstream identity; read from weight, not separately detected. The core has no facets — every chain terminates at the core whole; the user is densest by structural necessity (the one identity with no facets to partition the deposit) — the v3.0 noted-consequence block re-derived to this basis (superseding "every pass pings the core"). "Sum, never average," "summed relational mass = weight," the single θ — unchanged; the correction is to WHERE deposits land. `compose-view.ts` step 3 `depositChainPing` is corrected to the facet model in the build phase. **Δ-containment dropped (Shot 5 — §16.5).** No containment primitive, no containment relation. The substrate holds identities, relations, summation mass — nothing else; hierarchy is purely the artifact of where summation mass lands. The v3.0 OPEN-1-derived prose is removed (OPEN-1 dissolves with containment). **Δ-ContentClass (Shot 5 — §16.7).** ContentClass is a program-side emission-contract property — a property an EMITTING program declares on what it writes. F-present is a non-emitter; it carries **no ContentClass at all**. The v3.0 `Δ-ContentClass by-concept` treatment of `PresentViewEmission` (`program-operation` by concept) is void with the emission; A-24 ContentClass consumption is dropped from the consumed-atom set. PR4's read-side anchor-candidate filter — which filters on the content classification *emitters* declared — survives (reading-on-a-class and emitting-a-class are different acts); only F-present-emits-ContentClass dies. **Δ-Manual SPEC-v13.4 (Shot 5 — §16.7).** The Part I phantom-layer addendum is reopened — the phantom layer is not ContentClass content, it is F-present's held `PresentFrame`; the Manual addendum is re-derived (F-present declared a non-emitter; substrate stays single-axis; the phantom layer is off the content axis). Delivered as part of the v4.0 package. **Version (MA-L1).** Predecessor v3.0 → **v4.0, MAJOR** — PrA7 inverted, axiom/gate/leaf/HR/RC/error-code counts moved, a wearer-facing lifecycle contract (the operation's terminal output) changed. **Counts.** Leaf 1→0, Axiom 8→7, Gate 8→7, HR 6→5, RC 9→7, Error-code 5→4, Procedure-step 8 (unchanged — no step orphaned), Judgment-template 1 (unchanged); axiom-axis distribution 3-1-1-1-2-0-0 → 3-1-1-1-1-0-0 (Coupling 2→1, PrA3 deleted). LM pin v3.5, substrate pin v1.8.3 — unchanged. **E1–E8:** 87/87 PASS reported (§8.1) — the count deltas are designed consequences, reported transparently, not force-passed; four reported notes mark where an auditor running against memorized v3.0 counts will see an expected delta. **Discipline.** Every deletion traces to an orphan the non-emitter/stateful model genuinely produces; no slot rescued for symmetry; no axiom invented to re-home a deleted one; the one split-subject element (PrG4) had its live half kept and orphaned half deleted per L0 disposition. **Deploy.** v4.0 is **superseded by v5.0** before ratification — it was derived against a §16 that still carried `focus`, `ordering`, and the one-level bound; it does NOT deploy. authorityClaim: {level:'L0', confirmedBy:'superseded by v5.0 before ratification', timestamp:'sprint-b3-present-v4-superseded'} | L0 — superseded by v5.0, not deployed |
| v3.0 | 2026-05-22 (Sprint B3 — Sprint 1, present-tier dependency derivation) | Present-tier dependency derivation. Predecessor: resident `present-standard.md` v2.0. PrA5 dependency-walk clause; chain-ping summation replacing Option-C; `{dependency,temporal}` ordering enum; ContentClass by-concept; the noted-consequence block (`sprint-b3-user-core-consequence`). Counts: axiom 8, gate 8, procedure-step 8, HR 6, leaf 1. Carried in the `sprint-b3-present-joint` package — superseded by v4.0, not deployed. | L0 (Sprint B3 Sprint 1 — held, then superseded) |
| v2.0 | 2026-05-21 (Present Standard re-derivation) | Major re-derivation of the wearer-callable surface: five operations collapsed to one parameterized operation `present(standpoint, focus, ordering)`; `PresentIntent`/`FocusSelector`/`OrderingSelector` replace `WearerOperation`/`OperationParameter`/`PresentReadIntent`. | L0 (Present re-derivation build close) |
| v1.0.1 | 2026-05-19 (Side-Quest Shot 5) | ContentClass apparatus alignment. Substrate-pin v1.8.2 → v1.8.3; LM v3.3 → v3.4; `PresentViewEmission` gains `source.contentClass`; RC array 8 → 9. Additive minor. | L0 (Side-Quest Shot 5) |
| v1.0 | 2026-05-18 (Sprint B3 S12 emission) | Initial declaration. Eight PrA axioms, eight PrG gates, six HRs, eight PR procedure steps, five-operation closure, `PresentView` + `PresentViewEmission`, carrier = self, eight RCs, J-operation-binding. | L0 (Sprint B3 S12 emission) |

---

**End of present-standard-v6-0. Derived from v5.0 (the held `sprint-b3-present-v5` package, R3 base) for the Sprint B3 tree-of-stacks re-derivation — §16 + §16-REF + §16-HIST of the substrate-present re-derivation working record. v6.0 supersedes v5.0. Pending derive-tier audit, build, build-tier audit, and L0 ratification.**
