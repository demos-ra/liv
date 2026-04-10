# F-memory Slice

**Living Memory v1.1 · LIV-Standard v1.3**

## Declaration

| Property | Value |
|---|---|
| Slice | F-memory |
| Layers | R0, R1, R2, R3, R4 |
| Owner | F-memory exclusively |
| Purpose | Living memory engine. One operation: traversal. Single graph where connectivity determines what matters, what surfaces, and what fades. v1.1: scoped per-user graphs with global fallthrough. |

## Axioms (MA1–MA6)

| ID | Name | Invariant |
|----|------|-----------|
| MA1 | Conservation | Total energy is constant. Traversal redistributes, never creates or destroys. |
| MA2 | One action | Traversal is the only primitive operation. Read, write, and learning are one pass. |
| MA3 | Connectivity is persistence | A node survives iff its connectivity sustains its energy share. Isolation is the only death. |
| MA4 | Directional dependency | Lower layers never import from higher. Energy enters at M4, sinks toward M0. |
| MA5 | Emergent identity | M0 is computed, never declared. The highest-density attractor basin. |
| MA6 | Deletability | Any node can be removed and the system re-equilibrates. No node is structurally required. |

## Five M-Layers

| Layer | Name | Invariant |
|-------|------|-----------|
| M0 | Identity | Global attractor. System reconverges through this region after perturbation. |
| M1 | Purpose | Directional field. Non-reciprocal traversal bias across contexts. |
| M2 | Knowledge | Self-sustaining structure. Persists without energy input. Source text pruned. |
| M3 | Context | Energy-dependent. Active threads. Requires ongoing energy to persist. |
| M4 | Input | Pre-integration. Zero connections. May not survive. |

## v1.1 Amendments

| # | Amendment | Summary |
|---|-----------|---------|
| 1 | Edge schema | `primitiveType` (5-value enum) + `createdAt` on MemEdge. Gives edges semantic meaning. |
| 2 | Canonical labels | `normalizeLabel()` pure function. Bind-before-create: skip node creation if top match ≥ LABEL_REUSE_THRESHOLD (0.92 cosine). Reduces graph noise. |
| 3 | Scoped binding | `userId` on all tables (node, edge, arm, dominance). Two-graph model: per-user workspace + global read-only. Fallthrough bind: user graph first, global if no resonance. |
| 4 | Traversal param | `primitiveType` on TraversalOptions. Caller can tag edges created by a traversal. |

## What This Slice Owns
- Weighted directed graph (nodes + edges in Postgres via mem_node, mem_edge)
- Layer computation (M0–M4) from connectivity depth
- Traversal: binding, propagation, inline learning, sparsification
- Scoped binding: per-user graphs with global fallthrough (v1.1)
- Canonical label normalization and bind-before-create dedup (v1.1)
- Edge primitive types: anchor, relate, restructure, reinforce, suppress (v1.1)
- Arms: community detection, affinity, merge detection
- Present State Layer: derived computation for LLM context injection (scoped merge of user + global)
- Background dominance recomputation (M1→M0 transitions, scoped)
- Vital signs: 9 graph-relative metrics

## What This Slice Does NOT Own
- Chat session management → F-chat
- Event bus wiring → F-event-system
- DB connection → core/db/client
- Codec (giving traversal operations meaning) → F-codec

## Public Contract (§20)

```typescript
traverse(text: string, userId: string, options?: TraversalOptions): Promise<Result<TraversalResult | null>>
getPresentState(userId: string): PresentState
onBoot(): Promise<void>
```

Note: v1.0→v1.1 is a breaking change to traverse() and getPresentState() signatures (+userId). F-chat must be updated to pass userId through. This is intentional and tracked as a follow-on task.

## File Constitution

```
F-memory/
├── config/                     R0
│   ├── memory-types.ts         MemNode, MemEdge (+6 fields), MemGraph, EdgePrimitiveType, GraphScope,
│   │                           ScopedGraphSet, PresentState, MLayer, GraphMutation, TraversalOptions, all atoms
│   ├── memory-events.ts        MEMORY_EVENTS (7 events)
│   └── memory-wires.ts         Wire contract declarations (17 wires, 3 bumped to v2)
│
├── domain/                     R1 — pure functions, zero I/O
│   ├── memory-bind.ts          bind(), cosine(), computeThresholds()
│   ├── memory-label.ts         normalizeLabel() — canonical label normalization (v1.1 Amendment 2)
│   ├── memory-traverse.ts      propagate(), learn() — inline reinforcement (6-field edges)
│   ├── memory-sparsify.ts      sparsify() — edge prune + isolate removal
│   ├── memory-layer.ts         computeLayer(), updateLayersLocally(), computeClosure(), computeAsymmetry()
│   ├── memory-arm.ts           detectArms(), armAffinity(), sharedArmWeight(), detectArmMerges()
│   └── memory-present.ts       computePresentState(ScopedGraphSet) — scoped merge with dedup (v1.1)
│
├── app/                        R2
│   ├── memory-service.ts       runTraversal(text, userId, options), onBoot(), getPresentState(userId),
│   │                           getUserGraph(userId) — global+per-user state, fallthrough, bind-before-create
│   └── memory-background.ts    recomputeDominance(userId) — async M1→M0 detection, scoped
│
├── contract/                   R3
│   ├── memory-contract.ts      traverse(text, userId, options?), getPresentState(userId), onBoot()
│   └── memory-hook.ts          useMemoryStatus() — vital signs for dashboard
│
├── exec/                       R4 — I/O only
│   ├── memory-repository.ts    All Postgres CRUD (13 functions, all Result<T>, all scoped by userId)
│   ├── memory-graph-io.ts      loadGraph(userId), loadScopedGraphs(userId), persistMutations(mutation, userId),
│   │                           persistArms(arms, userId), persistDominance(entries, userId) — G3 atomic
│   └── embedding-service.ts    encode(text) → Result<number[]>
│
└── SLICE.md                    This file
```

## Events (§19)

| Event | Trigger |
|---|---|
| memory.traversal-complete | runTraversal() committed |
| memory.node-created | New node entered graph |
| memory.layer-changed | Node transitioned between layers |
| memory.source-pruned | Source text cleared on M3→M2 transition |
| memory.arm-detected | New community structure found |
| memory.arm-merged | Two arms became indistinguishable |
| memory.dominance-updated | Background recompute complete |

## Guardrails

| ID | Rule |
|----|------|
| G1 | computePresentState() produces useful output even with no arm structure. Never returns empty. |
| G2 | getPresentState() reads cached values only — never blocks on computation. |
| G3 | persistMutations() commits all mutations atomically in one transaction. |

## Integration (§20)

F-chat calls F-memory contract. Flow per LLM call:
1. `getPresentState(userId)` → inject as system context (who is this person)
2. `traverse(userMessage, userId, { returnActivation: true })` → query-specific context
3. Both injected into LLM context
4. LLM responds
5. `traverse(llmResponse, userId)` → write path, no activation returned

## Database

Tables: mem_node, mem_edge, mem_arm, mem_dominance.
All tables have `user_id TEXT` column (v1.1): NULL = global, string = per-user.
Edge uniqueness: `(from_id, to_id, COALESCE(user_id, '__global__'))`.
Edge columns (v1.1): `primitive_type edge_primitive_type`, `created_at TIMESTAMPTZ`.
Migrations: 010-living-memory-v1.sql, 013-memory-v1.1.sql.
Requires: pgvector extension.

## What Dies from v0.6

NodeType, BACKBONE_CONCEPTS, decayStructure(), STRUCTURAL_DECAY, applyEvent(), diffuse(), remember()/recall(), PERSISTENCE_HIGH/MED/LOW, extractConcepts(), computeUtility(), derivePersistence(), session boundary decay, concept candidates/vocab/cooccurrences tables.
