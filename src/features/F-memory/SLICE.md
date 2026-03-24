# F-memory Slice

**Living Memory v1.0 · LIV-Standard v1.3**

## Declaration

| Property | Value |
|---|---|
| Slice | F-memory |
| Layers | R0, R1, R2, R3, R4 |
| Owner | F-memory exclusively |
| Purpose | Living memory engine. One operation: traversal. Single graph where connectivity determines what matters, what surfaces, and what fades. |

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

## What This Slice Owns
- Weighted directed graph (nodes + edges in Postgres via mem_node, mem_edge)
- Layer computation (M0–M4) from connectivity depth
- Traversal: binding, propagation, inline learning, sparsification
- Arms: community detection, affinity, merge detection
- Present State Layer: derived computation for LLM context injection
- Background dominance recomputation (M1→M0 transitions)
- Vital signs: 9 graph-relative metrics

## What This Slice Does NOT Own
- Chat session management → F-chat
- Event bus wiring → F-event-system
- DB connection → core/db/client

## Public Contract (§20)

```typescript
traverse(text: string, options?: { returnActivation?: boolean }): Promise<Result<TraversalResult | null>>
getPresentState(): PresentState
onBoot(): Promise<void>
```

## File Constitution

```
F-memory/
├── config/                     R0
│   ├── memory-types.ts         MemNode, MemEdge, MemGraph, PresentState, MLayer, GraphMutation, all atoms
│   ├── memory-events.ts        MEMORY_EVENTS (7 events)
│   └── memory-wires.ts         Wire contract declarations (17 wires)
│
├── domain/                     R1 — pure functions, zero I/O
│   ├── memory-bind.ts          bind(), cosine(), computeThresholds()
│   ├── memory-traverse.ts      propagate(), learn() — inline reinforcement
│   ├── memory-sparsify.ts      sparsify() — edge prune + isolate removal
│   ├── memory-layer.ts         computeLayer(), updateLayersLocally(), computeClosure(), computeAsymmetry()
│   ├── memory-arm.ts           detectArms(), armAffinity(), sharedArmWeight(), detectArmMerges()
│   └── memory-present.ts       computePresentState() — Present State Layer (G1 graceful fallback)
│
├── app/                        R2
│   ├── memory-service.ts       runTraversal(), onBoot(), getPresentState() — single entry point
│   └── memory-background.ts    recomputeDominance() — async M1→M0 detection
│
├── contract/                   R3
│   ├── memory-contract.ts      traverse(), getPresentState(), onBoot() — public surface
│   └── memory-hook.ts          useMemoryStatus() — vital signs for dashboard
│
├── exec/                       R4 — I/O only
│   ├── memory-repository.ts    All Postgres CRUD (13 functions, all Result<T>)
│   ├── memory-graph-io.ts      loadGraph(), persistMutations() (G3 atomic), persistArms(), persistDominance()
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
1. `getPresentState()` → inject as system context (who is this person)
2. `traverse(userMessage, { returnActivation: true })` → query-specific context
3. Both injected into LLM context
4. LLM responds
5. `traverse(llmResponse)` → write path, no activation returned

## What Dies from v0.6

NodeType, BACKBONE_CONCEPTS, decayStructure(), STRUCTURAL_DECAY, applyEvent(), diffuse(), remember()/recall(), PERSISTENCE_HIGH/MED/LOW, extractConcepts(), computeUtility(), derivePersistence(), session boundary decay, concept candidates/vocab/cooccurrences tables.

## Database

Tables: mem_node, mem_edge, mem_arm, mem_dominance.
Migration: 010-living-memory-v1.sql.
Requires: pgvector extension.
