---
kind: framework
placement: frameworks/slices/
---

# F-artifact Slice

**Artifact Standard v2.2 · LIV-Standard v1.5.1**

## Declaration

| Property | Value |
|---|---|
| Slice | F-artifact |
| Layers | R0, R1, R2, R3 |
| Owner | F-artifact exclusively |
| Purpose | Runtime for Artifact Standard v2.2. Composes the `createArtifact(input, port)` entry and mechanically evaluates ArA1–ArA8 against the assembled emission. Hosts the artifact-store substore (anchor / companion / content / mode / emission / edge tables) — relocated from F-memory at Sprint 8 Shot 3b when F-memory dissolved its LM v2.x engine and became substrate-only. |

## Axioms Implemented (ArA1–ArA8)

| ID | Name | Gate |
|----|------|------|
| ArA1 | Both write blocks present | G-Ar1 |
| ArA2 | Anchor/companion 1:1 by emissionId | G-Ar2 |
| ArA3 | Content cardinality ≥ 1 | G-Ar3 |
| ArA4a | classification-lineage edge (1) | G-Ar4a |
| ArA4b | categorical edge (1) | G-Ar4b |
| ArA4c | version edge (0 or 1; prior-anchor conditional) | G-Ar4c |
| ArA4d | dependency edges (n = input.dependsOn.length) | G-Ar4d |
| ArA5 | Mutation rejection on persisted anchors | G-Ar5 |
| ArA6 | edge.kind ∈ ArtifactEdgeKind enum | G-Ar6 |
| ArA7 | Payload verbatim (deep equal to input.payload) | G-Ar7 |
| ArA8 | emissionId uniqueness | G-Ar8 |

## Procedure (§3.7)

```
S1 (mechanical)       →  S2 (gate-execution)   →  S3 (mechanical)
──────────────────       ────────────────────      ──────────────
generate emissionId      assemble ArtifactEmission  registerEmission
resolve anchor           evaluate G-Ar1..G-Ar8      persistEdges
resolve companion        first-fail short-circuit   return Result.ok
materialize content      typed ArtifactError        (emission)
lookup mode-node
lookup prior-anchor
derive ArA4 edges
```

## What This Slice Owns

- `createArtifact(input, port)` — R3 entry per §3.7
- ArA4 edge derivation (R1, pure) — `deriveAllEdges()` + per-axiom helpers
- ArA1–ArA8 gate predicates (R1, pure) — `evaluateAllGates()`
- Port interface `ArtifactGraphPort` — R3 atom (consumers wire against this)
- The artifact-store substore (R2) — Postgres-backed (`art_anchor`, `art_companion`, `art_content`, `art_emission`, `art_mode`, `art_edge` tables) with in-memory write-through cache; relocated from F-memory at Sprint 8 Shot 3b
- Boot hook `hydrateArtifactStore()` — eager hydration of the cache from Postgres at server start; called by F-event-system/R2 startup
- Port factories (R3) — `createArtifactGraphPort()` (8-method ArtifactGraphPort) and `createPlanResolutionPort()` (1-method PlanResolutionPort), relocated from F-memory at Shot 3b
- Typed error surface `ArtifactError` with 4 codes:
  `ARTIFACT_INPUT_INVALID`, `ARTIFACT_COMPOSITION_FAILED`,
  `ARTIFACT_GATE_FAILED`, `ARTIFACT_EMISSION_REJECTED`

## What This Slice Does NOT Own

- Substrate (event-store, two-axis state-change persistence) → F-memory (LM v3.1)
- Cognitive classification (primitive + confidence + classificationNodeId) → consumer-supplied via `CreateArtifactInput.classificationNodeId / primitive / confidence`. At Sprint 8 Shot 3a F-codec dissolved; consumers now provide synthetic placeholders pending Sprint 9 substrate-driven classification.
- Payload schema / semantics → content frameworks (Plan v2.2, Multi-Instance v2.3, etc.)
- Event emission / subscriptions → F-event-system
- Routing → F-router (Sprint 8 Shot 2 — pure routing slice)

## Public Contract (R3)

```typescript
// F-artifact/contract/artifact-contract.ts

export async function createArtifact(
  input: CreateArtifactInput,
  port:  ArtifactGraphPort,
): Promise<CreateArtifactResult>

export type ArtifactGraphPort = { /* 8 port methods — see artifact-emit.ts */ }

// Boot wiring (Sprint 8 Shot 4):
export async function hydrateArtifactStore(): Promise<void>

// Plus re-exports of: CreateArtifactInput, ArtifactEmission, ArtifactPayload,
// ArtifactEdge, ArtifactEdgeKind, ArtifactWriteA4, ArtifactWriteA7,
// CreateArtifactResult, ArtifactError.
```

```typescript
// F-artifact/contract/artifact-graph-port.ts

export function createArtifactGraphPort(): ArtifactGraphPort
export function createPlanResolutionPort(): PlanResolutionPort
```

Consumers (F-planner, F-plan, F-discover, F-verify) import factories from
`artifact-graph-port`; consumers (M-I and content frameworks) import
`createArtifact` and types from `artifact-contract`.

## File Constitution

```
F-artifact/
├── types/                        R0 — declarations, no logic
│   ├── artifact-types.ts         Re-export barrel from core/R5 AS v2.2 atoms
│   └── wires.ts                  W-ATOM / W-INJECT / W-HOOK declarations
│
├── domain/                       R1 — pure functions, zero I/O
│   ├── artifact-edges.ts         deriveAllEdges() + ArA4a/b/c/d helpers
│   └── artifact-gates.ts         evaluateAllGates() + G-Ar1..G-Ar8 predicates
│
├── app/                          R2 — orchestration
│   ├── artifact-emit.ts          createArtifact S1→S2→S3 + ArtifactGraphPort
│   └── artifact-store.ts         Postgres-backed artifact substore + cache;
│                                 hydrateArtifactStore() boot hook
│                                 (relocated from F-memory at Shot 3b)
│
├── contract/                     R3 — public surface
│   ├── artifact-contract.ts      createArtifact, hydrateArtifactStore, types
│   └── artifact-graph-port.ts    createArtifactGraphPort, createPlanResolutionPort
│                                 (relocated from F-memory at Shot 3b)
│
└── SLICE.md                      This file
```

## Boot Sequence (Sprint 8 Shot 4)

F-event-system/R2 startup orchestrates the boot in this order:

1. `db.connected` — verify Postgres connectivity (`SELECT 1`)
2. `substrate.booted` — F-memory's LM v3.1 substrate `onBoot()` (sets last-position observability)
3. `artifact.hydrated` — F-artifact's `hydrateArtifactStore()` populates the in-memory cache from `art_*` Postgres tables
4. `subscriptions.registered` — cross-slice event subscriptions
5. `dispatch-loop.started` — event dispatch interval running
6. `complete` — bootstrap finished

Substrate boots **before** artifact hydration: substrate is the persistence ground for state-changes; artifact-store serves cached lookups for AS emissions. Both must be warm before subscriptions register so cross-slice handlers don't read empty caches.

## Integration (§7 handoff)

**HR-MI3 (Multi-Instance → Artifact):** M-I calls `createArtifact()` at S3 with
RunReportContent rising as `payload.content`. F-artifact evaluates ArA1–ArA8;
on pass, returns ArtifactEmission to M-I. M-I maps the emission into
`MIEmissionResult` (AS v2.2 emission verbatim on success).

**F-planner / F-plan / F-discover / F-verify:** consumers of `createArtifactGraphPort()` to obtain the 8-method port that `createArtifact` requires. The same factory is consumed across all four slices — all reach the same module-singleton store.

**Future content frameworks:** any framework emitting through AS calls
`createArtifact()` with its own payload schema (domain + domainVersion + schemaRef).
F-artifact is payload-agnostic (G-Ar7 enforces verbatim, not schema conformance).

## Guardrails

| ID | Rule |
|----|------|
| G1 | `createArtifact` is the only R3 export that produces a graph mutation. |
| G2 | S1/S2/S3 strictly sequential; no parallel port calls across stages. |
| G3 | G-Ar8 collision check occurs inside S2 gate batch; registration at S3. |
| G4 | Payload is passed verbatim through S1/S2/S3. No slice ever inspects `payload.content`. |
| G5 | Port errors surface as `ARTIFACT_COMPOSITION_FAILED` (S1) or `ARTIFACT_EMISSION_REJECTED` (S3). |
| G6 | `hydrateArtifactStore()` is idempotent — clears the cache before reading; safe to re-invoke. |
| G7 | `isEmissionIdCollision` (sync predicate) is correct only after `hydrateArtifactStore()` completes. F-event-system startup enforces this ordering. |

## Sprint History

- **Phase 4b** — F-artifact slice introduced, standalone (no F-memory imports). createArtifact + ArA1–ArA8 gates land. ArtifactGraphPort defined as port interface; F-memory implements post-4b.
- **lm-v2-2-shot5** — F-memory adds Postgres-backed implementation of ArtifactGraphPort via `memory-artifact-store.ts`; consumers wire through F-memory's R3 contract.
- **Sprint 8 Shot 3b** — F-memory dissolves its LM v2.x engine. `memory-artifact-store.ts` and `memory-graph-contract.ts` relocate to F-artifact (Salvage-F5). Public function names preserved; consumers repoint imports only.
- **Sprint 8 Shot 4** — `hydrateArtifactStore()` boot hook re-established at F-event-system/R2 startup as a dedicated boot step (was previously chained inside F-memory's onBoot before the dissolve).
