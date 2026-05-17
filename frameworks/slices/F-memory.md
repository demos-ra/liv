---
kind: framework
placement: frameworks/slices/
---

# F-memory Slice

**Living Memory v3.1 · Substrate-only**

## Declaration

| Property | Value |
|---|---|
| Slice | F-memory |
| Layers | R0, R2, R3, R4 |
| Owner | F-memory exclusively |
| Purpose | Living Memory v3.1 substrate. Pure event-store: two axes (position, identity threads), state-change records, scope as attribute. Forward-additive writes; revocation as in-band destructive exception. |

## Axioms (LMA1–LMA12)

Per `src/core/standards/living-memory.md` §3.2. Twelve axioms governing substrate write/read mechanics:

| ID | Concern |
|---|---|
| LMA1 | Forward-additive write — new state-change appended to Axis 1 |
| LMA2 | Revocation as sole destructive exception, in-band via RevokeRef |
| LMA3 | Relation structure — four peer components, ≥1 identitiesWithRoles |
| LMA4 | Atomic commit — content + metadata in one transaction |
| LMA5 | Identity-by-reference — IdentityRef strings, no canonical record |
| LMA6 | Scope as attribute — open-vocabulary `source.scope` |
| LMA7 | Anchor derivation — read-time, threshold-based |
| LMA8 | Geometry emerges from threads (read-time, never stored) |
| LMA9 | Three-and-only-three thread primitives — identity-recurrence, role-pattern, adjacency |
| LMA10 | Two-axis structure — position monotonic, identity threads as projection |
| LMA11 | Modality stored as recorded metadata, re-derived at execution |
| LMA12 | User ownership — every SubstrateWriteInput carries exactly one userId; every committed StateChangeRecord carries that userId unchanged |

## What This Slice Owns

- The `state_change` Postgres table (single physical store)
- R5 substrate atom set (declared at `core/types/substrate.types.ts`)
- Two procedures: SW1–SW3 (write), TQ1–TQ3 (thread query)
- Six required operations: `write_state_change`, `read_state_change`, `iterate_axis`, `identity_recurrence`, `role_pattern`, `adjacency`
- RevokeRef in-band detection at SW3 (LMA2)
- Position assignment (monotonic, transactional) — Axis 1 ordering

## What This Slice Does NOT Own

- Anchor derivation thresholds (read-time, owned by consumers)
- Geometry — emerges from how callers compose thread results (LMA8)
- Artifact graph — relocated to F-artifact at Sprint 8 Shot 3b (`F-artifact/app/artifact-store.ts` + `F-artifact/contract/artifact-graph-port.ts`)
- Chat session management → F-chat
- Event bus wiring → F-event-system
- DB connection → core/db/client

## Public Contract

All R3 imports flow through `contract/substrate-contract.ts`. Other slices never import from `app/`, `domain/`, `exec/`, or `config/`.

```typescript
writeStateChange(input: SubstrateWriteInput): Promise<Result<StateChangeRecord | { revoked: StateChangeId; position: PositionRef | null }>>
readStateChange(position: PositionRef): Promise<Result<StateChangeRecord | null>>
iterateAxis(start: PositionRef, direction: 'forward' | 'backward', count: number): Promise<Result<StateChangeRecord[]>>
identityRecurrence(anchor: IdentityRef, scope?: ScopeRef, limit?: number): Promise<Result<ThreadResult>>
rolePattern(anchor: IdentityRef, role: RoleRef, scope?: ScopeRef, limit?: number): Promise<Result<ThreadResult>>
adjacency(anchor: PositionRef, window: number, scope?: ScopeRef, limit?: number): Promise<Result<ThreadResult>>
threadQuery(input: ThreadQueryInput): Promise<Result<ThreadResult>>
onBoot(): Promise<Result<{ lastPosition: PositionRef | null }>>
```

## Procedures

**Substrate write (SW1–SW3, atomic per LMA4):**
1. SW1 — Validate shape; assign position, time
2. SW2 — Gates [LMA1, LMA3, LMA10, LMA11]
3. SW3 — Detect RevokeRef → delete; commit atomically

**Thread query (TQ1–TQ3, read-only):**
1. TQ1 — Validate threadKind, anchor, role/window
2. TQ2 — Gate [LMA9]
3. TQ3 — Execute against substrate

## File Constitution

```
F-memory/
├── config/                       R0
│   ├── substrate-config.ts       Slice-internal R0 atoms (StateChangeRow,
│   │                             SubstrateWriteValidated, SubstrateGateResult,
│   │                             ThreadQueryValidated) + DB constants +
│   │                             normalizeIdentityRef helper
│   ├── substrate-events.ts       SUBSTRATE_EVENTS (4 events) + SubstrateEventType
│   └── substrate-wires.ts        Wire contract registry (5 hooks, 4 atoms,
│                                 4 events)
│
├── app/                          R2
│   └── substrate-service.ts      SW1–SW3 + TQ1–TQ3 procedures, 6 operations,
│                                 onBoot
│
├── contract/                     R3
│   └── substrate-contract.ts     Public contract surface; re-exports R2
│                                 functions + R5 atoms
│
├── exec/                         R4
│   └── substrate-repository.ts   All Postgres CRUD; transactional commit;
│                                 row inflation; index-aware queries
│
└── SLICE.md                      This file
```

R1 (domain) is intentionally absent — substrate is event-store mechanics, not domain logic. All gate logic lives at R2 service tier per LM v3.1 §3.8/§3.9.

## Events (4)

| Event | Trigger |
|---|---|
| `substrate.state-change-written` | SW3 commit succeeded — new StateChangeRecord written |
| `substrate.state-change-revoked` | SW3 RevokeRef detected — target deleted in-band (LMA2) |
| `substrate.write-gate-failed`    | SW2 gate failed — write rejected |
| `substrate.boot-complete`        | onBoot() ran |

Sprint 8 Shot 3b: events emit via `console.log` JSON-line stub (Decision-D-S2-8 pattern). Sprint 9 wires F-event-system.

## Database

Single table: `state_change`.

Migration: `016-substrate.sql` (Sprint 8 Shot 1).

Indices per LM v3.1 §3.11:
- `state_change_pkey` (position) — Axis 1 ordering, adjacency, iterate_axis
- `state_change_identity_idx` (GIN on identities) — identity-recurrence, role-pattern prefilter
- `state_change_scope_idx` (source_scope, position) — scope-filtered scans

## Sprint 8 close conditions

- F-memory dissolved its LM v2.x engine entirely at Sprint 8 Shot 3b. Substrate-only at and beyond.
- Salvage map — Salvage-F5 (`memory-artifact-store.ts`) relocated to `F-artifact/app/artifact-store.ts`.
- Salvage map — Salvage-F6 (`codec-ai-io.ts`) relocated to `F-ai-adapter/exec/llm-classify-io.ts` at Sprint 8 Shot 3a (codec dissolved).
- All cross-slice consumers either rewired against F-artifact (artifact graph) or marked `// TODO Sprint 9` for substrate-thread-query rewire (LM v2.x reads).

## What Dies from LM v2.x (Sprint 8 Shot 3b)

Energy-graph engine (mem_node, mem_edge, mem_arm, mem_dominance tables — separate dissolution migration outside Shot 3b src tar). Five M-layers (M0–M4). Six axioms MA1–MA6. Connectivity-as-persistence semantics. Arm detection. Bind-before-create dedup. Edge primitive types as graph property. Present state computation. Vital signs. Dominance recomputation. Embedding-based binding. Cosine similarity at perimeter. Scoped/global graph fallthrough. Layer transitions. Source pruning. — All replaced by the substrate's two-axis event-store geometry per LM v3.1.
