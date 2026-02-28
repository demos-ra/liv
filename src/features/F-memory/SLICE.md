# F-memory Slice

**LIV Build Bible — Integration Phase**

## Declaration

| Property | Value |
|---|---|
| Slice | F-memory |
| Layers | R0, R1, R2, R3, R4 |
| State Namespace | `memory` |
| Owner | F-memory exclusively |
| Purpose | Associative memory engine. Two primitives: applyEvent() (write), diffuse() (read). |

## What This Slice Owns
- Weighted associative graph (nodes + edges in Postgres)
- Concept extraction, promotion, and embedding
- Activation diffusion and recall
- Session lifecycle (onBoot, onSessionEnd)
- Vital signs computation

## What This Slice Does NOT Own
- Chat session rotation logic → F-chat (already correct)
- Event bus wiring → F-event-system/app/event-subscriptions
- DB connection → src/core/db/client (shared infrastructure)

## File Constitution
F-memory/
├── config/                   R0
│   ├── memory-config.ts      All physics constants, BACKBONE_CONCEPTS, STOPWORDS, VITAL_RANGES
│   ├── memory-types.ts       MemNode, MemEdge, MemGraph, MemEvent, GraphMutation, MemoryVitalSigns
│   └── memory-events.ts      MEMORY_EVENTS — imports from canonical event-schema only
│
├── domain/                   R1 — pure functions, zero I/O
│   ├── memory-concepts.ts    extractConcepts(), derivePersistence(), computeUtility(), cosine()
│   ├── memory-event.ts       applyEvent() — only mutation primitive
│   ├── memory-diffusion.ts   diffuse() — only read primitive
│   └── memory-decay.ts       decayStructure()
│
├── app/                      R2
│   └── memory-service.ts     remember(), recall(), onSessionEnd(), onBoot(), computeVitalSigns()
│
├── contract/                 R3
│   ├── memory-contract.ts    Thin wire — public surface only
│   └── memory-hook.ts        useMemoryStatus(): MemoryVitalSigns
│
├── exec/                     R4 — I/O only, imports R0 only
│   ├── memory-repository.ts  All Postgres CRUD
│   ├── embedding-service.ts  embed(), similarity()
│   └── graph-persistence.ts  loadGraph(), saveEdges()
│
└── SLICE.md                  This file

## Events (T-Axis)
| Event | Trigger |
|---|---|
| memory.node-written | applyEvent() committed |
| memory.concept-promoted | concept reached CONCEPT_PROMOTE_AT threshold |
| memory.session-started | onBoot() complete |
| memory.session-ended | onSessionEnd() complete |
| memory.recall-fired | diffuse() returned results |

## Integration Points
- startup.ts → calls onBoot() after DB verified
- event-subscriptions.ts → SESSION_EXPIRED → onSessionEnd()
- F-chat/exec/lm-io.ts → adapts chat-workflow calls to F-memory contract
