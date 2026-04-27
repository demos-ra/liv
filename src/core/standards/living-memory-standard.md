# Living Memory Standard v2.2

**Derives-from:** v2.1
**Status:** pending L0 confirm
**Date:** 2026-04-26
**Mode:** additive amendment (per Metaframework v3.1 AxR3)
**Scope:** authoring track only — no F-memory code, no AS modification, no deployed L3 standard altered at runtime

This file is a slim additive amendment to Living Memory v2.1. It declares two new axioms (LMA20, LMA21), recovers `Present` as a parameterized primitive, declares `Lineage` as a new primitive, enumerates `Present`'s eight projection axes, and authors variable-bound verifies. No section of v2.1 is rewritten; v2.1 remains the base instance and continues to govern F-memory at HEAD until L0 confirms v2.2.

---

## §A Version block

| Field | Value |
|---|---|
| `name` | `Living Memory` |
| `version` | `2.2` |
| `derivesFrom` | `2.1` |
| `kind` | additive amendment |
| `status` | pending L0 confirm |
| `axiomDelta` | +LMA20, +LMA21 (no removals, no rewrites) |
| `primitiveDelta` | `Present` parameter-recovered; `Lineage` net-new |
| `axisDelta` | none — v2.1 axis shell preserved |
| `asImpact` | none — Artifact Standard v2.2 untouched |

---

## §B LMA20 — Present axes orthogonal

> *Present's axes are orthogonal; no axis derives from another. New axes require derivation against this invariant.*

**Declaration.** The eight axes enumerated in §E project a node set along eight independent dimensions. At projection time, no axis's score is a function of any other axis's score for the same node.

**Orthogonality (LM-physics sense).** For any two axes Aᵢ and Aⱼ in the active `AxisSet` and any node n in the candidate set, the score Aᵢ(n) is computed without reading the score Aⱼ(n). Axes may share inputs from the graph (topology, timestamps, scope tags, lineage edges), but no axis consumes another axis's score as an input. Composition of axis scores into a final ranking is a downstream operation (weighting, aggregation) and is not in scope for this invariant.

**Gate.** Adding a ninth axis to `Present` is an amendment of LMA20, not a configuration change to `AxisSet`. Any candidate axis must be derived against this invariant — i.e., it must be shown that its score is not a function of any of the eight existing axes' scores at projection time. If derivation fails, the candidate is not an axis; it is a re-projection or a composite and belongs downstream.

---

## §C LMA21 — Scope-stamp at persistence; scope-filter at projection

> *Persistence stamps active scope tags on every node write. `Present` and `Lineage` filter by scope axis at projection.*

**Scope as tag-set, not type.** Scope is a set of tags carried on a node. It is not a separate atom kind, not a discriminated union, not a partition of the graph. A node carries the scope tags active in the writing context at the moment of its persistence; it remains in the same graph as all other nodes.

**Persistence-side rule (stamp).** Every node write stamps the active scope tags from the writing context. Stamping is total: no node persists without scope tags. When no scope is active in the writing context, the default scope is `global`. Scope tags written are immutable for the life of the node — re-scoping a node is a new write, not a mutation of an existing record.

**Projection-side rule (filter).** `Present` and `Lineage` accept a `scope` parameter of type `ScopeFilter`. Out-of-scope nodes never enter the projection set; the scope filter precedes scoring. A node n is in scope iff its stamped scope tags satisfy the `ScopeFilter` predicate.

**AS untouched.** This is the projection model only. Artifact Standard v2.2 is not modified. The chain key declared by ArA4c (`framework.id`, `userId`) at the AS layer is unchanged. Scope tags are LM-side metadata stamped at the LM write boundary, downstream of the AS commit pipeline.

---

## §D Present primitive — parameter shape

```
Present({
  scope: ScopeFilter,
  axes:  AxisSet,         // 8 axes per §E
  limit: number,
}): PresentState
```

**Parameter recovery.** v2.1 declared `Present(userId)` as a single-argument primitive over the per-user graph. v2.2 surfaces what was implicit: the v2.1 form is the degenerate parameterization

```
Present({ scope: { user: userId }, axes: PRESENT_DEFAULTS, limit: MAX })
```

Same primitive, same owner (LM), same projection contract. v2.2 makes the scope dimension and the axis set explicit at the call boundary. No second function, no overload, no migration of semantics — only the parameter shape is surfaced.

**`ScopeFilter` shape.**

```
ScopeFilter = {
  user?:    UserId
  project?: ProjectId
  // open for additional scope dimensions per LMA21
}
```

Minimum two scope dimensions declared at v2.2: `user`, `project`. The shape is open: additional scope dimensions may be added in future amendments without modifying LMA21 (LMA21 is independent of which dimensions exist; it governs the stamp+filter contract over whatever dimensions are declared). A `ScopeFilter` with no fields set matches all scopes including `global`.

**`AxisSet` shape.**

```
AxisSet = {
  active:  AxisId[]              // subset of the 8 axes per §E
  weights: Map<AxisId, number>   // per-axis weight
  configs: Map<AxisId, AxisConfig>  // per-axis configuration; AxisConfig owned by F-memory
}
```

`AxisSet` declares which of the eight axes are active in this projection and how each is parameterized. `PRESENT_DEFAULTS` is the named default — a constant of type `AxisSet` whose concrete contents (which axes are on by default, default weights, default configs) are owned and declared by F-memory. The standard declares the contract; F-memory declares the values.

**`limit`.** Maximum number of nodes returned in `PresentState.projected`. Required parameter; no implicit default.

**`PresentState` return shape.**

```
PresentState = {
  projected:    NodeId[]                   // length ≤ limit
  axisScores:   Map<NodeId, Map<AxisId, number>>
  scopeContext: ScopeFilter                // echoes the scope filter applied
}
```

The standard declares the contract: a projected node list bounded by `limit`, per-node per-axis scores, and the scope context that was filtered against. Concrete TypeScript shape, score normalization, ordering, and tie-break rules live in F-memory. The standard declares what `PresentState` is; F-memory declares how it is computed.

---

## §E Eight Present axes

| # | Axis | Projects |
|---|---|---|
| 1 | `topology` | graph-structural position of the node — degree, closure, asymmetry as observed in the current graph |
| 2 | `recency` | time-since-touch — distance from now to the node's most recent traversal or write |
| 3 | `chronology` | write-order position — the node's rank in the persistence sequence |
| 4 | `projectAffinity` | alignment between the node's stamped project scope and the active project context |
| 5 | `modeAffinity` | alignment between the node's prior mode contexts and the active mode (plan / verify / discover / build) |
| 6 | `programAffinity` | alignment between the node's prior program contexts and the active program (L4 surface) |
| 7 | `lineageProximity` | distance, along edges, from the node to the active lineage chain |
| 8 | `energy` | activation and concentration in the node's local subgraph |

Each row is a declaration of what the axis projects, not how it computes. Algorithms — score formulas, normalization, time-decay shapes, distance metrics, threshold constants — live in F-memory. The standard's authority over each axis is the projection statement; F-memory's authority is the computation.

The set of eight is closed at v2.2 per LMA20. Adding a ninth requires amendment.

---

## §F Lineage primitive

```
Lineage(
  start:      NodeId,
  direction:  'ancestor' | 'descendant' | 'both',
  depth:      number,
  edgeFilter: EdgeKindSet,
): LineageGraph
```

**Net-new at v2.2.** `Lineage` has no v2.1 caller — there is no recovery framing. It is a new R3-surface primitive owned by LM. F-memory authors the implementation in Shot 2+.

**Parameters.**
- `start` — the node from which lineage is traced. Must be in scope of the active `ScopeFilter` (passed implicitly via the projection context per LMA21).
- `direction` — `'ancestor'` traces edges into `start`; `'descendant'` traces edges out of `start`; `'both'` traces in both directions from `start`.
- `depth` — maximum edge-hops from `start`. The returned `LineageGraph` contains no node further than `depth` edges from `start`.
- `edgeFilter` — set of `EdgeKind` values; only edges whose kind is in the set are traversed. An empty set traverses no edges (returns a `LineageGraph` containing `start` only); a full set traverses all kinds.

**`LineageGraph` atom shape.**

```
LineageGraph = {
  start:             NodeId
  nodes:             NodeId[]              // includes start
  edges:             EdgeRef[]             // every edge has both endpoints in nodes
  terminationReason: 'depth-reached' | 'no-more-edges' | 'cycle-truncated' | 'scope-boundary'
}
```

The standard declares the contract. Concrete TypeScript shape, traversal order, and the encoding of `terminationReason` per branch live in F-memory.

**Cycle termination.** `Lineage` terminates on cycle. Variable: no node appears twice in `nodes`. When traversal would revisit a node already in `nodes`, that branch terminates and contributes `'cycle-truncated'` to `terminationReason` for that branch. The overall `terminationReason` reflects the dominant cause across branches; F-memory authors the precedence rule.

**Scope filter.** Out-of-scope nodes never enter `LineageGraph.nodes` per LMA21. When traversal would cross a scope boundary, that branch terminates and contributes `'scope-boundary'` to `terminationReason`.

---

## §G Verifies — variable-bound

Each row tests a contract shape, axis property, or scope predicate as a variable that holds at projection or persistence time. No row references a file path, function name, or line number.

| id | Tests | Variable |
|---|---|---|
| **V1** | LMA20 — axes orthogonal | For any axis pair (Aᵢ, Aⱼ) in the active `AxisSet` and any node n in the candidate set, Aᵢ(n) is not a function of Aⱼ(n) at projection time. |
| **V2** | LMA21 persistence — total scope-stamping | For every node persisted in any write set, the node's stamped scope-tag set is non-empty. The default `global` tag satisfies non-emptiness. |
| **V3** | LMA21 projection — scope filter precedes scoring | For any `Present` or `Lineage` invocation, the projection set is a subset of the in-scope candidate set: projection ∩ out-of-scope = ∅. |
| **V4** | Present recovery — degenerate equivalence | For any user U with no other scope active, `Present({ scope: { user: U }, axes: PRESENT_DEFAULTS, limit: MAX })` returns the same projection set as v2.1's `Present(U)` would have returned over the same graph state. |
| **V5** | Lineage cycle termination | For any `Lineage` invocation, no node appears twice in `LineageGraph.nodes`. |
| **V6** | Lineage scope filter | For any `Lineage` invocation, `LineageGraph.nodes ⊆ in-scope-set` under the active `ScopeFilter`. |

---

## §H Migration note

v2.1 → v2.2 is parameter recovery for `Present`, addition of `Lineage`, and authoring of LMA20 + LMA21. Old call sites of `Present(userId)` update once to `Present({ scope: { user: userId }, axes: PRESENT_DEFAULTS, limit: MAX })`. Projection semantics at degenerate parameterization are unchanged — the same nodes are returned in the same order under the same graph state. Artifact Standard v2.2 is not modified; the AS chain key (`framework.id`, `userId`) per ArA4c is preserved. F-memory implementation — concrete `AxisSet` defaults, scope-stamp wiring, `Lineage` traversal, and call-site updates at the nine v2.1 invocation sites enumerated in Brief v15.1 §8 — is Shot 2+ scope of Sprint 2.

---

## Decision-D

| id | Field | Decision | Basis |
|---|---|---|---|
| **D1** | LMA20 / LMA21 Kind + Attached-to columns | Omitted in this amendment. v2.1 §3.6 carries Kind (`Invariant \| Producer \| Mechanism \| Absence`) and `Attached to` (axis/sub-axis/leaf) per AxR1 + MA-V1. Brief §A–§H authoring requirements do not include these columns; slim amendment authors axiom text + gate only. v2.1-style metadata can be added when LMA20/LMA21 fold into §3.6 of a future full LM regen against the metaframework. | Brief gate 2; Brief §B/§C authoring requirements; v2.1 §3.6 column shape |

---

**End of Living Memory Standard v2.2. Pending L0 confirm.**
