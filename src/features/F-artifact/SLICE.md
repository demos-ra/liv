# F-artifact Slice

**Artifact Standard v2.2 · LIV-Standard v1.5.1**

## Declaration

| Property | Value |
|---|---|
| Slice | F-artifact |
| Layers | R0, R1, R2, R3 |
| Owner | F-artifact exclusively |
| Purpose | Runtime for Artifact Standard v2.2. Composes the `createArtifact(input, port)` entry and mechanically evaluates ArA1–ArA8 against the assembled emission. Standalone at Phase 4b landing — F-multi-instance is the first consumer via HR-MI3. |

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
- Port interface `ArtifactGraphPort` — R4 runtime dependency surface for
  anchor/companion/content node-create, mode-node + prior-anchor lookups,
  registry, and edge persistence
- Typed error surface `ArtifactError` with 4 codes:
  `ARTIFACT_INPUT_INVALID`, `ARTIFACT_COMPOSITION_FAILED`,
  `ARTIFACT_GATE_FAILED`, `ARTIFACT_EMISSION_REJECTED`

## What This Slice Does NOT Own

- Graph primitives (node/edge create, lookup) → F-memory (R3 contract, Phase 4b.x)
  F-artifact defines the port interface; F-memory will implement it post-4b.
- Payload schema / semantics → content frameworks (Plan v2.2, Multi-Instance v2.3, etc.)
- Cognitive classification (primitive + confidence + classificationNodeId) → Cognitive
  Standard (F-codec) — F-artifact consumes this verbatim via input fields
- Event emission / subscriptions → F-event-system (4b does not wire events)
- Codec orchestration → F-codec (4b: F-artifact is NOT called from codec-orchestrate)

## Public Contract (R3)

```typescript
// F-artifact/contract/artifact-contract.ts

export async function createArtifact(
  input: CreateArtifactInput,
  port:  ArtifactGraphPort,
): Promise<CreateArtifactResult>

export type ArtifactGraphPort = { /* 8 port methods — see artifact-emit.ts */ }

// Plus re-exports of: CreateArtifactInput, ArtifactEmission, ArtifactPayload,
// ArtifactEdge, ArtifactEdgeKind, ArtifactWriteA4, ArtifactWriteA7,
// CreateArtifactResult, ArtifactError.
```

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
│   └── artifact-emit.ts          createArtifact S1→S2→S3 + ArtifactGraphPort
│
├── contract/                     R3 — public surface
│   └── artifact-contract.ts      export createArtifact, ArtifactGraphPort, types
│
└── SLICE.md                      This file
```

## Integration (§7 handoff)

**HR-MI3 (Multi-Instance → Artifact):** M-I calls `createArtifact()` at S3 with
RunReportContent rising as `payload.content`. F-artifact evaluates ArA1–ArA8;
on pass, returns ArtifactEmission to M-I. M-I maps the emission into
`MIEmissionResult` (AS v2.2 emission verbatim on success).

**Future content frameworks:** any framework emitting through AS calls
`createArtifact()` with its own payload schema (domain + domainVersion + schemaRef).
F-artifact is payload-agnostic (G-Ar7 enforces verbatim, not schema conformance).

## Integration Rules (Phase 4b)

- F-artifact is STANDALONE in 4b — does NOT import from codec-planning / verify /
  discovery / artifact-legacy.
- NO wire into codec-orchestrate.ts at 4b landing.
- F-memory graph primitives (node/edge create, lookups, registry, persistence)
  land post-4b; port interface is the stable boundary.

## Guardrails

| ID | Rule |
|----|------|
| G1 | `createArtifact` is the only R3 export that produces a graph mutation. |
| G2 | S1/S2/S3 strictly sequential; no parallel port calls across stages. |
| G3 | G-Ar8 collision check occurs inside S2 gate batch; registration at S3. |
| G4 | Payload is passed verbatim through S1/S2/S3. No slice ever inspects `payload.content`. |
| G5 | Port errors surface as `ARTIFACT_COMPOSITION_FAILED` (S1) or `ARTIFACT_EMISSION_REJECTED` (S3). |
