---
kind: framework
placement: frameworks/slices/
---

# F-builder Slice

**Sprint 11 Shot 5 · Build execution slice (F-planner spin-out)**

## Declaration

| Property | Value |
|---|---|
| Slice | F-builder |
| Layers | R0, R2, R3, R4 |
| Owner | F-builder exclusively |
| Purpose | Build execution surface. Receives a `BuildDirective` (jobId + userId + projectId), orchestrates `runPipeline`, writes `BuildEmission` to substrate on completion. Owns the build-execution public contract. |
| Framework | Builder Standard v1.0 |

## Decision-Ds (Sprint 11 Shot 5)

**D-S5-EXTRACTION — invocation pattern.**
F-builder R2 calls `runPipeline()` from F-planner R2 (declared structural exception).
Rationale: F-planner's pipeline logic (394 lines) is deeply coupled to F-planner R0/R1 types.
Physical relocation requires moving all transitive type dependencies — Sprint 12 scope.
At Sprint 11: F-builder R3 is the public surface; F-planner R3 delegates to F-builder R3.
Sprint 12 moves F-planner types to F-builder R0 and dissolves the cross-slice R2→R2 import.

**D-S5-HANDOFF — F-plan → F-builder handoff mechanism.**
F-plan triggers a build by creating a PlannerJob (DB-native). The confirmed `jobId` is the handoff token.
F-builder receives `jobId` as `BuildDirective.jobId`; reads job from DB via `IPlannerDb.getJob`.
No substrate write/read required for the handoff itself — the DB record is the authoritative pipeline state.
Substrate writes occur at build *completion* (BuildEmission). Both layers used at their natural roles.

**D-S5-OUTPUT — F-output fold vs stay-separate.**
Stay-separate. F-output has three independent HTTP route consumers outside F-planner/F-builder:
`handleGetFiles`, `handleDownload`, `handlePush` (app/api/output routes).
F-output is a slice with its own HTTP surface and independent consumers.
F-builder imports `writeOutputFiles` from F-output R3 (A5 — cross-slice via contract only).

## What This Slice Owns

- `BuildDirective` type (R0) — input token: jobId + userId + projectId
- `BuildEmission` type (R0) — output atom written to substrate on completion
- `executeBuild(directive)` R3 public entry — constructs deps, calls `runBuild`
- `runBuild(deps, directive)` R2 — orchestrates `runPipeline`, writes substrate emission
- Port factories at R4 (`createBuilderDb`, `createBuilderAi`, `createBuilderExecutor`, `createBuilderOutput`)
- F-router registration (priority 90 — highest; build intent takes precedence)

## What This Slice Does NOT Own

- Pipeline state DB table (`builds`) — F-planner owns this (A1)
- `runPipeline` logic — resides in F-planner R2 until Sprint 12 physical relocation
- `isPipelineActive` — stays in F-planner R3 (F-chat consumer, unchanged import path)
- F-output HTTP routes — F-output owns its own HTTP surface
- `handleInMainTurn`, `startPipeline`, `advanceStage`, `failStage`, `freezeContract`, `getPipelineStatus` — all remain in F-planner

## Public Contract

```typescript
executeBuild(directive: BuildDirective): Promise<void>
// Type re-exports:
type BuildDirective = { jobId: string; userId: string; projectId: string }
type BuildEmission  = { jobId, userId, projectId, status: BuildStatus, completedAt: number }
type BuildStatus    = 'completed' | 'failed' | 'escalated'
```

All R3 imports flow through `contract/builder-contract.ts`.

## File Constitution

```
F-builder/
├── config/                       R0
│   ├── builder-types.ts          BuildDirective, BuildEmission, BuildStatus, BuilderDeps
│   └── builder-config.ts         BUILDER_CONFIG (constants)
│
├── app/                          R2
│   └── builder-workflow.ts       runBuild() — delegates to runPipeline (Sprint 11),
│                                 writeBuildEmission() — substrate write on completion
│
├── contract/                     R3
│   └── builder-contract.ts       executeBuild() — public entry; port construction
│
└── exec/                         R4
    └── builder-inject.ts         createBuilderDb/Ai/Executor/Output — port factories
                                  (bound to same R4 implementations as F-planner)
```

R1 (domain) absent — F-builder has no pure domain logic at Sprint 11. Pipeline domain lives in F-planner R1 until Sprint 12.

## Sprint 12 Migration Plan

1. Move F-planner types (`IPlannerDb`, `IAiAdapter`, `IExecutor`, `IOutputWriter`, pipeline types) to `F-builder/config/builder-types.ts` (R0).
2. Move `runPipeline` body to `F-builder/app/builder-workflow.ts` (R2).
3. Remove F-builder's cross-slice import of F-planner R2.
4. F-planner becomes a thin HTTP adapter shell (or dissolves entirely into F-plan).

## Substrate Integration

BuildEmission write pattern (Decision-D same as Shot 2/4 CA4 pattern):
- identities: `['build-emission', jobId, userId, projectId, status]`
- relation: `{ type: 'build-completed', modality: 'declarative', identitiesWithRoles: [{identity: jobId, role: 'subject'}, {identity: status, role: 'result'}] }`
- source: `{ channel: 'internal-derivation', scope: userId }`
- fire-and-forget — write failure never suppresses build result

## F-router Registration

Priority 90 (highest — build intent is most specific). Keywords: `build`, `run build`, `deploy`, `pipeline`, `ship`, `release`, `compile`, `execute`, `trigger build`, `run pipeline`, `start build`.
