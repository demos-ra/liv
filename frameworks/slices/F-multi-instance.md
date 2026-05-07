# F-multi-instance Slice

**Multi-Instance Standard v2.3 · LIV-Standard v1.5.1**

## Declaration

| Property | Value |
|---|---|
| Slice | F-multi-instance |
| Layers | R0, R1, R2, R3 |
| Owner | F-multi-instance exclusively |
| Purpose | Runtime for Multi-Instance Standard v2.3. Composes the `executeRun(input, ports)` entry, dispatches plan declarations, aggregates results, evaluates IA1–IA7c, and emits RunReportContent via AS v2.2. Standalone at Phase 4b landing — authoring programs (Builder, Verify) are the first consumers. |

## Axioms Implemented (IA1–IA7c)

| ID | Name | Gate |
|----|------|------|
| IA1 | Instance-terminality | G-MI1 |
| IA2 | Binding immutability | G-MI2 |
| IA3 | validateContract invariant | G-MI3 |
| IA4a | Post-breach retry suppression | G-MI4a |
| IA4b | Breach → failed/escalated | G-MI4b |
| IA5 | No cascade failures (outside topology/partialSuccess) | G-MI5 |
| IA6 | Binding-resolved callsites | G-MI6 |
| IA7a | Capacity-breach class = CLASS_2 | G-MI7a |
| IA7b | Retry budget consumption on breach | G-MI7b |
| IA7c | No declaration rewrite post-breach | G-MI7c |

## Procedure (§3.7)

```
S1 (mechanical)       →  S2 (gate-execution + runtime)     →  S3 (mechanical)
──────────────────       ──────────────────────────────       ──────────────
resolve plan (HR-MI4)    dispatch per topology                emit via createArtifact (HR-MI3)
generate runId           collect InstanceResult[]              domain='multi-instance'
capture startedAt        collect SetViolation[]                schemaRef='RunReportContent'
bind DomainBinding       aggregate per §3.4.a                  dependsOn=[planAnchorNodeId]
build DispatchPlan       assemble RunReportContent             return MIEmissionResult
                         evaluate G-MI1..G-MI7c
                         first-fail → MIValidityError
```

## What This Slice Owns

- `executeRun(input, ports)` — R3 entry per §3.7
- DispatchPlan construction (R1, pure) — `buildDispatchPlan()` + topology linearization
- Aggregation (R1, pure) — `aggregateRun()` per §3.4.a aggregation table
- IA1–IA7c gate predicates (R1, pure) — `evaluateAllMIGates()`
- Per-declaration invocation (R2) — `runInstance()` with role resolution, tier budget,
  validateContract application
- Port interfaces:
  - `PlanResolutionPort` — F-memory read primitive
  - `AIAdapterPort` — F-ai-adapter invocation surface
  - `CognitiveClassificationPort` — F-ai-adapter llm-classify-io supply for AS emission (F-codec dissolved Sprint 8 Shot 3a; salvaged classifier lives at F-ai-adapter/exec/llm-classify-io.ts)
  - `ArtifactGraphPort` (re-exported from F-artifact)

## What This Slice Does NOT Own

- Artifact emission mechanics (ArA1–ArA8, edge derivation) → F-artifact
- Plan composition / validity (PA1–PA12) → Plan authoring programs (not yet a slice in 4b)
- LLM streaming → F-ai-adapter
- Graph primitives → F-memory
- Cognitive classification → F-ai-adapter (post Sprint 8 Shot 3a salvage; F-codec dissolved)
- DomainBinding instance content → domain standards (F-la-config for LIV-Standard)

## Public Contract (R3)

```typescript
// F-multi-instance/contract/mi-contract.ts

export async function executeRun(
  input: MIInput,
  ports: MultiInstancePorts,
): Promise<MIEmissionResult>

export type MultiInstancePorts = {
  plan:      PlanResolutionPort
  adapter:   AIAdapterPort
  cognitive: CognitiveClassificationPort
  graph:     ArtifactGraphPort
}
```

## File Constitution

```
F-multi-instance/
├── types/                        R0 — declarations, no logic
│   ├── mi-types.ts               Re-export barrel from core/R5 M-I / Plan / AS atoms
│   └── wires.ts                  W-ATOM / W-INJECT / W-HOOK declarations
│
├── domain/                       R1 — pure functions, zero I/O
│   ├── mi-gates.ts               evaluateAllMIGates() + G-MI1..G-MI7c predicates
│   ├── mi-dispatch-plan.ts       buildDispatchPlan() + topology linearization
│   └── mi-aggregate.ts           aggregateRun() per §3.4.a
│
├── app/                          R2 — orchestration
│   ├── mi-execute.ts             executeRun S1→S2→S3 + MultiInstancePorts aggregate
│   └── mi-instance.ts            runInstance() + AIAdapterPort + input composition
│
├── contract/                     R3 — public surface
│   └── mi-contract.ts            export executeRun, ports, MIInput, MIEmissionResult
│
└── SLICE.md                      This file
```

## Integration (§7 handoff)

**HR-MI3 (Multi-Instance → Artifact):** S3 wires `createArtifact()` with
`framework={id:'multi-instance', version:'2.3'}`,
`payload={domain:'multi-instance', domainVersion:'2.3', schemaRef:'RunReportContent', content:runReport}`,
`dependsOn=[planAnchorNodeId]`. M-I does not bypass AS — every run emission is
an AS emission.

**HR-MI4 (Multi-Instance → Living Memory):** S1 reads PlanArtifactContent via
one-hop graph read at `input.planAnchorNodeId`. No multi-hop traversal.

**HR-MI2 (Multi-Instance → Plan):** Binding consumed verbatim at S1; engine
never rewrites `plan.shape.declarations` or `plan.binding`. Enforced by G-MI2.

**HR-MI1 (Multi-Instance ← Authoring programs):** authoring program supplies
MIInput containing planAnchorNodeId + userId + runTurnId. Builder, Verify,
and future M-I consumers each thread their own runTurnId.

## Integration Rules (Phase 4b)

- F-multi-instance is STANDALONE in 4b — no wire into codec-orchestrate.
- Imports F-artifact at S3 (createArtifact) + F-la-config DomainBinding at port wiring.
- F-ai-adapter injected via AIAdapterPort (W-INJECT), NOT in MIInput schema.
- Embedding / retry loop / cascade detection deferred post-4b (ports accept the
  witnesses; engine feeds defaults at beta).

## Guardrails

| ID | Rule |
|----|------|
| G1 | `executeRun` is the only R3 export that dispatches instances or emits. |
| G2 | S1/S2/S3 strictly sequential; S3 runs iff all S2 gates pass. |
| G3 | Binding captured by reference-identity at S1; engine never mutates it. |
| G4 | Per-declaration adapter invocation goes through AIAdapterPort exclusively (IA6). |
| G5 | RunReportContent assembled only after all instances reach terminal state (IA1). |
| G6 | F-artifact handles all graph mutation; F-multi-instance holds no node/edge writes. |
