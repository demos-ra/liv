---
kind: framework
placement: frameworks/slices/
---

# F-router Slice

**Sprint 8 Shot 2 · Pure routing infrastructure**

## Declaration

| Property | Value |
|---|---|
| Slice | F-router |
| Layers | R0, R1, R2, R3 |
| Owner | F-router exclusively |
| Purpose | Message routing infrastructure. Given a `RouterMessage` + `RouterSessionContext`, return a `Destination` (slice + optional programId). Pure routing logic; no framework, no I/O, no DB. |
| Framework | None — F-router is infrastructure, not a governed program (Decision-D-S2-1, L0-confirmed). |

## What This Slice Owns

- The `Destination` shape (slice + programId)
- The `RouterMessage` and `RouterSessionContext` shapes (R0)
- The destination registry (in-memory, module-singleton state at R2)
- The `route(message, context) → Destination` function (R3 surface)
- Registration/unregistration of destinations (R3 surface)
- Pure rule evaluation engine (R1)
- First-match-wins routing protocol with priority + stable-tiebreak ordering

## What This Slice Does NOT Own

- The source-of-truth shape of inbound messages (each upstream slice projects to `RouterMessage` at the call site)
- Session state (F-chat / F-identity / Sprint 9 wiring)
- Substrate reads for routing context (Sprint 9 — F-router currently has zero substrate dependency per Decision-D-S2-5)
- Domain registrations (registry is empty at Shot 2; Sprint 9 wires F-chat / F-plan / F-verify / F-discover)
- Event bus wiring (R2 stubs events as console.log JSON-line; Sprint 9 wires F-event-system)

## Public Contract

```typescript
route(message: RouterMessage, context: RouterSessionContext): RouteResult
registerDestination(reg: DestinationRegistration): Result<RouterRegistrationKey>
unregisterDestination(key: RouterRegistrationKey): Result<void>
listDestinations(): Result<RouterRule[]>
resetRegistry(): void                  // boot/test path
onBoot(): Promise<Result<{ ruleCount: number }>>
```

All R3 imports flow through `contract/router-contract.ts`. Other slices never import from `app/`, `domain/`, or `config/`.

## Routing Protocol

First-match-wins with priority ordering:

1. `route()` validates input shape — `ROUTER_INVALID_INPUT` on malformed input.
2. If registry is empty → `ROUTER_REGISTRY_EMPTY` (Sprint 8 Shot 2 always returns this — no registrations yet).
3. Rules sorted by `priority` descending; ties broken by registration order (stable sort).
4. For each rule in order, invoke `rule.match(message, context)`. First true wins.
5. Predicate exceptions are caught and treated as non-match (defensive; routing call must not crash on misbehaving rule).
6. If no rule matches → `ROUTER_NO_MATCH`.
7. On match: emit `router.route-matched`, return `Destination`.

## File Constitution

```
F-router/
├── config/                       R0
│   ├── router-types.ts           Destination, RouterMessage, RouterSessionContext,
│   │                             DestinationRegistration, RouterRule, RouterRegistrationKey,
│   │                             RouterError, RouteResult, ROUTER_ERROR_CODES
│   ├── router-events.ts          ROUTER_EVENTS (5 events) + RouterEventType
│   └── router-wires.ts           Wire contract registry (5 hooks, 5 atoms, 5 events)
│
├── domain/                       R1 — pure functions, zero I/O
│   └── router-rules.ts           sortRulesByPriority(), evaluateRule(), matchFirst(),
│                                 evaluateRules() — first-match-wins with stable tiebreak
│
├── app/                          R2
│   └── router-service.ts         route(), registerDestination(), unregisterDestination(),
│                                 listDestinations(), resetRegistry(), onBoot() — registry
│                                 state lives here as module-singleton
│
├── contract/                     R3
│   └── router-contract.ts        Public contract surface; re-exports R2 functions + R0 atoms
│
└── SLICE.md                      This file
```

R4 (exec) is intentionally absent — F-router has zero I/O. Decision-D-S2-9: omitting R4 is correct per LIV-Standard A4 (R4 isolates I/O; with no I/O there is nothing to isolate). Future sub-millisecond observability hooks or persistence-backed registry would land at R4.

## Events (5)

| Event | Trigger |
|---|---|
| `router.registration-added`    | `registerDestination` succeeded |
| `router.registration-removed`  | `unregisterDestination` succeeded |
| `router.route-matched`         | `route()` returned a destination |
| `router.route-unmatched`       | `route()` returned NO_MATCH or REGISTRY_EMPTY |
| `router.boot-complete`         | `onBoot()` ran |

Sprint 8 Shot 2: events emit via `console.log` JSON-line (Decision-D-S2-8). Sprint 9 wires F-event-system.

## Wires (15 total)

5 W-HOOK (route, register, unregister, list, onBoot), 5 W-ATOM (RouterMessage, RouterSessionContext, Destination, DestinationRegistration, RouterRule), 5 W-EVENT (the 5 events above). Declared in `config/router-wires.ts`.

## Guardrails

| ID | Rule |
|---|---|
| G1 | Predicate exceptions in `match()` callbacks are caught and treated as non-match. A misbehaving rule must not crash the routing call. |
| G2 | `route()` is synchronous. No async I/O, no DB, no network. (R2 service-tier discipline; prevents any caller from accidentally awaiting routing.) |
| G3 | Registry mutation through `registerDestination` / `unregisterDestination` only. Direct registry manipulation from outside R2 is a layering violation. |

## Integration (Sprint 9 — out of scope for Shot 2)

Sprint 9 wiring will:
1. F-chat input handler calls `route(message, context) → Destination`, then dispatches to `destination.slice` (and `destination.programId` if present).
2. F-chat, F-plan, F-verify, F-discover register their destinations at boot via `registerDestination(reg)`.
3. F-event-system startup invokes `F-router.onBoot()` and binds the 5 router events to the event bus.
4. Substrate consumers (if any) read thread queries to inform routing rules.

## Sprint 8 Shot 2 close conditions

- F-router slice authored at R0–R3.
- Registry initializes empty.
- `route()` returns `REGISTRY_EMPTY` for any input (correct — no registrations yet).
- F-chat does NOT yet call F-router (Sprint 9 wiring).
- F-router has zero imports from F-memory (Decision-D-S2-5: substrate independence at this shot).
- Build clean against composed tree.

## Decision-Ds (recorded in DECISIONS-shot2.md)

S2-1 through S2-9. All within pre-authorized scope per L0 ruling at sprint open.
