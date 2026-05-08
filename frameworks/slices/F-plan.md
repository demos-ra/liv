---
kind: framework
placement: frameworks/slices/
---

# F-plan

> **Doc-lag acknowledgment (Structure-Tightening Sprint close, F-004 closure):** the body of this SLICE.md describes the pre-Sprint-8-Shot-3a wire path through F-codec (codec-orchestrate dispatch, PLAN_MODULE registry, post-A6 typed output reads). **F-codec was dissolved at Sprint 8 Shot 3a.** The salvaged classifier lives at `F-ai-adapter/exec/llm-classify-io.ts`; the dispatch surfaces (`/api/modules/*`, `/api/memory/*`) currently return HTTP 501 pending Sprint 9 reauthor against substrate. F-plan's own composition logic and Plan Standard v2.2 contract remain valid; the *runtime entry path* is staged for Sprint 9 wire-in. The per-section claims below are preserved verbatim as historical record of the Sprint B wire-up; substantive SLICE.md rewrite for the post-F-codec dispatch path is queued for the same Sprint 9 cycle that wires the BCR-emission scaffold.

**Identity:** Plan Standard v2.2 authoring program — composes PA1–PA12 declaration set from typed cognitive output and emits via AS v2.3.

**Ownership:** F-plan owns the composition logic that turns user intent into a structurally valid `PlanArtifactContent`. F-plan does **not** own encoding (F-codec), graph reads (F-memory R3), execution (M-I), or Plan Standard atom declarations (core/R5). (A1)

**Current scope:** structural-mode authoring program. F-codec dispatch wire-up live (Sprint B). PLAN_MODULE registered at codec-orchestrate; structural-mode messages route to F-plan via executor pointer.

## Composition Path

F-plan does **not** call the LLM. Encoding is F-codec's job (A3–A6, Cognitive Standard CA1–CA8). By the time a structural-mode message reaches F-plan's executor (post-A6), F-codec has already encoded the user's intent and deposited typed cognitive output to the graph.

F-plan reads that typed output via F-memory's R3 surface, composes declarations algorithmically (pure, deterministic), and emits via F-artifact's `createArtifact`. Re-encoding inside F-plan would duplicate F-codec's chain ownership (LIV-Standard A1).

On user revision: each turn re-enters the chain at A1. F-codec re-encodes, deposits delta. F-plan re-reads updated graph state and re-composes. The feedback loop **is** the bidirectional chain operating normally — not F-plan looping its own LLM calls.

## Identity Layers (F013)

Three identifiers, three concerns. Disambiguation matters at audit:

| Layer | Identifier | Carrier site | Purpose |
|---|---|---|---|
| F-codec module-id | `'plan'` | `PLAN_MODULE.id` (FrameworkModule) | Registry lookup key + dashboard surfacing |
| AS framework-id | `'plan'` (Plan Standard) | `CreateArtifactInput.framework.id`, `payload.domain` | Content framework that defines the artifact's structural contract — Plan Standard v2.2 |
| F-plan authoring-program-id | `'F-plan'` | `PlanArtifactContent.producedBy.programId` | Who built the plan — distinct from what the plan IS structurally |

The F-codec module-id and AS framework-id share the string `'plan'` by design — both reference Plan Standard. The authoring-program-id is `'F-plan'` (the slice that built it) and lives only inside the artifact payload, never at AS carrier.

## User-facing Protocol

1. User sends structural-mode message (e.g., "plan a launch").
2. Routing: codec-orchestrate dispatchModule → PLAN_MODULE.executor → planExecutorAdapter → executePlan.
3. F-plan composes a draft `PlanArtifactContent` against typed graph reads. Persists as draft (`status='draft'`, no graph emission yet). `originalUserMessage` captures the user's intent for the eventual confirm-time compose (F006).
4. F-plan returns a draft summary for user review. No `planAnchorNodeId` exists yet.
5. User confirms via structural-mode message matching D-CONFIRM-PATTERN (`['yes','confirm','go','proceed']`, case-insensitive, exact-token, whole-message-after-trim). F-plan re-composes against `existingDraft.originalUserMessage` (NOT the confirm keyword) and emits via `createArtifact` (AS v2.3). Three-state lifecycle: `draft → emitting → emitted` (F005). Returns `planAnchorNodeId`.
6. User amends: each amend overwrites `originalUserMessage` (each amend is a new intent expression). Re-emission with `priorPlanAnchor` chain happens via PA5 — AS auto-derives the version edge via `lookupPriorAnchor` against the chain key (F-plan does NOT thread priorAnchor; F001).

## Decision-D Rows

| Row | Value |
|---|---|
| D-BINDING | `PLAN_DOMAIN_BINDING` — OBJECTIVE-only role class, sequence topology, `tierLimits.objective.budget=2048 tokens`. Multi-role binding deferred. |
| D-DECOMPOSE | Pure split: sentence terminators (`. ? !`) + standalone ` and ` + numbered markers (`/^\d+\.\s/`). Trim, drop empty. Deterministic, no LLM. |
| D-CONFIRM-PATTERN | `['yes','confirm','go','proceed']`, case-insensitive, exact-token whole-message-after-trim. |
| D-PROJECT | Empty/undefined `projectId` → `PLAN_REJECTED_NO_PROJECT_SCOPE`. No DB write. No emission. No fallback to user scope. |
| D-FILES | 11 TS files + SLICE.md + 2 SQL migrations. `plan-validate.ts` kept separate (250 LOC). `plan-emit.ts` placed in `app/` for project precedent consistency. |
| D-MIGRATION-NUM | Migrations `002-add-plan-drafts.sql` + `003-cleanup.sql` shipped per spec; L0 confirms numbering at integration. |
| D-TURNID | `turnId` is a required positional parameter on `executePlan(content, userId, projectId, turnId, modelId?)`. Sprint B threads codec's actual turnId via planExecutorAdapter. Mechanical from AS carrier requirement (`CreateArtifactInput.turnId`). |
| D-PLANNING-UNHOOK | Sprint B: `registerModule(PLANNING_MODULE)` removed from codec-orchestrate. PLANNING_MODULE constant + executePlanning function retained intact for T-CODEC-01 retirement. |
| D-PA5-VERSIONING | **Pending L0 confirmation.** `nextPlanVersion()` currently bumps `'1.0.0' → '2.0.0'` on any re-emission (Sprint A simple major-bump). L0 to confirm whether amend semantics warrant patch/minor/major granularity. |
| D-EMITTING-LANE-POLICY | F015 (cycle 4): when `dbGetOpenDraft` returns a `status='emitting'` row, `executePlan` and `confirmDraft` return typed reject `PLAN_LANE_EMITTING` carrying `draftId` for caller retry. `getOpenDraftSummary` returns the row's summary (read-only pass-through; `status` field surfaces lane state). Derived mechanically from MFv3.0 directional symmetry + Cognitive Standard intent preservation + LIV-Standard A1 — not L0-pending. |

## Standards Bound

- **Plan Standard v2.2** (consumed): F-plan composes PA1–PA12 against atoms declared at `core/R5/plan-standard.types`. F-plan does not redeclare any Plan atom (A1).
- **Artifact Standard v2.3** (carrier): F-plan emits via `createArtifact()` from `@/features/F-artifact/contract/artifact-contract`. F-plan does not implement AS axioms — it consumes AS as carrier. ArA4c chain key is `(framework.id, userId, projectId)`; F-plan threads `projectId` into every `CreateArtifactInput`.
- **LIV-Standard v1.5.1** (mechanical): A1–A7 enforced by IN-AUDIT pipeline at sprint close.
- **Cognitive Standard v1.2** (upstream chain): F-plan consumes F-codec post-A6 outputs; never invokes Cognitive primitives directly.

## Plan Standard PA-Row Coverage

| Axiom | Where enforced |
|---|---|
| PA1  | R1 `compose()` — empty input → typed `PLAN_REJECTED_EMPTY_INPUT` before persist |
| PA2a | R1 `validate()` — `dependsOn` references closed under `shape.declarations` |
| PA2b | R1 `validate()` — DFS acyclicity check (mirror `planner-plan-emit.ts` pattern) |
| PA3  | R1 `compose()` — `IntentEntry.inputContract`/`outputContract` resolve against `binding.roleClasses` only |
| PA4a | R1 `compose()` — every declaration gets `perDecl.retryBudget` from `PLAN_CONST.RETRY_LIMITS` |
| PA4b | R1 `compose()` — `perSet` populated from `PLAN_CONST.FAILSAFE` |
| PA5  | R2 `plan-emit` — re-plan emits new plan with fresh `planVersion`; AS auto-derives ArA4c version edge via `lookupPriorAnchor` against chain key — F-plan does NOT thread priorAnchor (F001 fix). |
| PA8  | R1 `compose()` — `role` and `tierHint` keyed from `binding.roleClasses` / `binding.tierLimits` only |
| PA9  | R1 `compose()` — `PlanArtifactContent.binding := PLAN_DOMAIN_BINDING` verbatim |
| PA10a/b | Defensive non-emission — composer never emits `splitLineage` |
| PA11/PA12 | R1 `compose()` — `dataFlow` only between declared `declId` pairs; wire `TypedAtomRef` resolves against binding |

## Lane Invariant (F005 + F015)

Lane = at most one non-terminal (`'draft'` or `'emitting'`) row per `(user_id, project_id)`. Migration 003 widened the partial index to span both states. `dbGetOpenDraft` matches the same state set; consumers (`executePlan`, `confirmDraft`, `getOpenDraftSummary`) discriminate on `status`:

- `status='draft'` — confirm/amend/read as normal.
- `status='emitting'` — in-flight emission. New `executePlan` / `confirmDraft` calls reject with `PLAN_LANE_EMITTING` carrying `draftId` in `context`. `getOpenDraftSummary` returns the row's summary (status pass-through). Caller retries after the in-flight emission resolves to terminal (`'emitted'` on success, stays at `'emitting'` for admin reconciliation on partial failure per F005).

Policy derivation: MFv3.0 directional symmetry (typed return) + Cognitive Standard intent preservation (don't destructively supersede) + LIV-Standard A1 (don't merge into in-flight composition). Recorded as **D-EMITTING-LANE-POLICY**.

## R-layer Map

```
F-plan/
├── types/                           R0 — atoms, constants, binding instance
│   ├── plan-types.ts                F-plan-local atoms (PlanDraftId, PlanDraftState
│   │                                w/ originalUserMessage, PlanComposerInput,
│   │                                PlanExecuteResult, PlanRejectCode incl.
│   │                                PLAN_EMITTED_BUT_NOT_RECORDED, summaries)
│   ├── plan-const.ts                PLAN_CONST (retry/failsafe), PLAN_DOMAIN_BINDING
│   │                                (D-BINDING), PLAN_CONFIRM_KEYWORDS (D-CONFIRM-PATTERN),
│   │                                PLAN_PROGRAM_ID, PLAN_AUTHORING_PROGRAM_VERSION,
│   │                                PLAN_STANDARD_ID, PLAN_STANDARD_VERSION, PLAN_SCHEMA_REF
│   └── wires.ts                     Wire contract registry (W-ATOM, W-HOOK, W-INJECT)
├── domain/                          R1 — pure composition + validity
│   ├── plan-compose.ts              compose(input, binding, deps) → Result<PlanArtifactContent, PlanValidityError>
│   │                                D-DECOMPOSE rule. PA1, PA3, PA4a, PA4b, PA8, PA9,
│   │                                PA11, PA12 enforced here. No I/O. No Date.now().
│   └── plan-validate.ts             PA2a/PA2b gates. DFS acyclicity.
├── app/                             R2 — workflow orchestration
│   ├── plan-draft.ts                Draft lifecycle: createDraft (persists originalUserMessage),
│   │                                amendDraft (refreshes originalUserMessage), getDraftSummary
│   └── plan-emit.ts                 D-CONFIRM-PATTERN + three-state emission (F005 markEmitting →
│                                    graph write → markEmitted). F006: composes against
│                                    existingDraft.originalUserMessage.
├── contract/                        R3 — public surface
│   ├── plan-contract.ts             executePlan(content, userId, projectId, turnId, modelId?),
│   │                                getOpenDraftSummary, confirmDraft
│   ├── plan-inject.ts               IPlanDb port shape (incl. markEmitting, F005)
│   └── plan-module.ts               Sprint B integration surface — PLAN_MODULE
│                                    (FrameworkModule instance) + planExecutorAdapter.
├── exec/                            R4 — I/O
│   └── plan-db.ts                   plan_drafts persist/read/update/mark-emitting/mark-emitted.
│                                    Postgres only.
├── smoke/                           Test scaffold (A7-deletable, not R-discipline)
│   └── plan-smoke.ts                Six-test smoke harness for direct R3 verification.
└── SLICE.md                         this file
```

Migrations:
- `002-add-plan-drafts.sql` — table + partial index (Sprint A).
- `003-cleanup.sql` — F006 `original_user_message` column + F005 status CHECK rebuild + partial-index expansion to `IN ('draft','emitting')` (Phase 6 Cleanup).

## Dependencies

- **core/R5 primitives** — `NodeId`, `UserId`, `ProjectId`, `Semver`, `AppError`, `Result`, `CognitivePrimitive`, `generateId`
- **core/R5 plan-standard.types** — `PlanArtifactContent`, `DomainBinding`, `Declaration`, `DataFlowEdge`, `PlanShape`, `PlanIntent`, `PlanCapacity`, `PlanLimit`, `PlanValidityError`, `EpochMs`, `Milliseconds`, `DeclId`, `PlanId`
- **core/R5 artifact-standard.types** — `CreateArtifactInput`, `ArtifactEmission`, `ArtifactPayload` (consumed via F-artifact R3 re-export)
- **F-artifact R3** — `createArtifact()`, `ArtifactGraphPort` type
- **F-memory R3** — `getPresentState(userId)`, `createArtifactGraphPort()`
- **F-codec R0** — `FrameworkModule`, `ModuleExecutionResult`, `ModuleExecutor` (consumed at `plan-module.ts` for Sprint B integration)
- **DB client** — Postgres (R4 only)

## Public Contract

- `executePlan(content, userId, projectId, turnId, modelId?)` — entry point. Three-mode dispatch: new draft / confirm-and-emit / amend.
- `getOpenDraftSummary(userId, projectId)` — read open draft, format as `PlanDraftSummary | null`. (Rename of spec's `getDraftSummary` to disambiguate from the pure formatter `formatDraftSummary` re-exported from `plan-draft.ts`.)
- `confirmDraft(userId, projectId, turnId, content, modelId?)` — separate confirmation path. Looks up open draft by lane (no draftId arg).
- `PLAN_MODULE` — F-codec FrameworkModule instance (Sprint B integration surface). Imported by `codec-orchestrate.ts` for `registerModule(PLAN_MODULE)`.

## Non-goals (Phase 6)

- Codec-planning retire (T-CODEC-01 — separate codec-hygiene cycle; PLANNING_MODULE unhooked but file retained intact per D-PLANNING-UNHOOK).
- M-I dispatch on plan emission (Phase 11).
- Multi-role `DomainBinding` (next iteration).
- Inter-objective dependency inference (next iteration).
- Postgres-backed cross-restart draft survival (T-MEM-01 territory).
- F-planner `emitPlanForContract` reuse — F-plan owns its own composition path (doctrine-aligned to keep separate).
- Branded `TurnId` atom at `core/R5` (T-TURNID-ATOM — Sprint B uses `string` per existing convention).
- Admin tooling for `'emitting'` half-state reconciliation (F005 surfaces the state explicitly; admin retry-from-emitting is downstream work).
