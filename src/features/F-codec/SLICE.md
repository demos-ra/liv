# F-codec

**Identity:** Cognitive Standard v1.2.1 implementation (v1.3 amendment block — Symmetry axis, CA6–CA7) — the encode/route/decode layer between natural language and typed graph operations.

**Ownership:** F-codec tells the graph what to do. F-memory executes without knowing why. (A1)

## Full Pipeline (processMessage)

Single entry point: `processMessage(content, userId)` → `CodecPipelineResult`.

1. **Encode** — classify primitive + extract label + traverse graph (LLM-assisted or mechanical)
2. **Classify domain** — topological: where did bind() land? Build subgraph or conversational?
3. **Determine route** — (primitive, domain) → action: dispatch-planner, chat-response, or reference-only
4. **Decode** — classify graph structures into entities, relations, claims, sequences, tensions
5. **Render** — produce structured text for system prompt injection (token-budgeted)
6. **Dispatch** — if build domain, emit `codec.route-build` event for F-planner (A5)

F-chat's future integration: replace current `traverse()` + `getPresentState()` calls with a single `processMessage()` call. The response includes `decodedContext.systemPromptBlock` for LLM context and `route` for action dispatch.

## Encode (#16)

Two input modes, same output: a typed primitive that F-memory stamps on graph edges.

### LLM-Assisted (Conversation)

Pipeline per message:
1. Get present state from F-memory (graph context)
2. Single LLM call: classify primitive + extract label
3. Parse response (R1 pure functions)
4. If Reference: return immediately (read-only, no mutation)
5. If mutating: call `traverse(label, userId, { primitiveType })` on F-memory
6. Emit `codec.encode-complete`

Fallbacks: classify failure → anchor (safest); label failure → normalized content slice.

### Mechanical (System Events)

Structured data with known primitive mappings. No LLM. Subscribes to planner events via event bus (A5):
- `pipeline.started` → anchor
- `pipeline.completed` → reinforce
- `pipeline.failed` → suppress
- `stage.completed` → reinforce
- `stage.failed` → suppress

## Routing (#17)

**`action = f(primitive, binding_region)`** — no authored routing table.

### Domain Classification

Topological. Where bind() landed determines domain:
- Build subgraph (arm label or node labels contain build signals) → `'build'`
- Conversational subgraph → `'conversational'`
- New/unclassifiable → `'unknown'`

Bootstrap heuristic: `BUILD_DOMAIN_SIGNALS` keyword list. Once graph densifies, arm membership alone determines domain.

### Route Determination

| Primitive | Domain = build | Domain = conversational/unknown |
|-----------|---------------|-------------------------------|
| Anchor | dispatch-planner | chat-response |
| Relate | dispatch-planner | chat-response |
| Restructure | dispatch-planner | chat-response |
| Reinforce | dispatch-planner | chat-response |
| Suppress | dispatch-planner | chat-response |
| Reference | reference-only | reference-only |

Reference is always reference-only regardless of domain — read-only by definition.

Build domain dispatch uses event bus (A5): `codec.route-build` event, F-planner subscribes. The codec never imports F-planner.

## Decode (#18)

Graph state → classified structures → system prompt text.

Five classification passes (all pure, deterministic, no LLM):
1. **Entities** — nodes at M0–M2 with degree ≥ 2
2. **Relations** — edges between entity pairs, typed by primitive
3. **Claims** — entities with incoming energy > μ + 1σ
4. **Sequences** — chronological chains within same arm
5. **Tensions** — contradictory primitives or high-energy nodes with weak bridge

Rendering: structured text ordered by layer (M0 first) then energy. Token-budgeted (DECODE_MAX_TOKENS), lowest-energy items truncated.

## Six Cognitive Primitives

| # | Name | Binding | Structural | Weight | Mutating |
|---|------|---------|-----------|--------|----------|
| 1 | Anchor | UNBOUND | ADD | NONE | Yes |
| 2 | Relate | BOUND | ADD | NONE | Yes |
| 3 | Restructure | BOUND | REORGANIZE | NONE | Yes |
| 4 | Reinforce | BOUND | NONE | INCREASE | Yes |
| 5 | Suppress | BOUND | NONE | DECREASE | Yes |
| 6 | Reference | BOUND | NONE | NONE | No (read-only) |

## Dependencies

- **F-memory** R0 atoms + R3 contract: `traverse()`, `getPresentState()`, `getGlobalGraph()`, `getUserGraph()`, `getGlobalArms()`, `getUserArms()`
- **F-event-system** R3: `emitEvent()`, `subscribeToEvent()`
- **F-user-profile** R3: `getApiKey()` (for LLM calls)

## Public Contract

**Encode + pipeline (#16–18):**
- `processMessage(content, userId, projectId?, modelId?)` — full codec pipeline (encode → route → decode → dispatch)
- `encode(content, userId)` — conversation encode only (retained for backward compat)
- `registerSubscriptions()` — wire mechanical encode to event bus

**Decode (Cognitive v1.3 §10 symmetric output):**
- `decodeWorkOutput(output, mode)` — pure structural decode of module work-output to `WorkOutputDecodeResult` per CA6 + CA7
- `classifyGraph(graphSet)` — graph topology → `DecodeOutput` (v1.2 path, unchanged)

**M-I cognitive port (Cognitive v1.2.1 §7.1 J-classify):**
- `classifyRunReport({runReport, userId, runTurnId})` — implements `CognitiveClassificationPort`; replaces the Phase 5/8 stub

**OperatorInterface (Cognitive v1.2.1 §5.3 + §6.5 — Review + Discovery sub-interfaces):**
- `getCognitiveAuditTrail({frameworkRef?, eventType?, timeRange?})` — query in-memory audit-trail ring buffer
- `getCognitiveRuntimeState()` — `{standardVersion, lifecycleState, lastConfirmedAt}`

**Memory + admin actions (w3-19 / w3-20):**
- `executeMemoryAction()`, `getDecodedState()`, `getArtifactsForMode()`
- `seedGlobalNode()`, `ingestExternal()`, `removeNode()`, `batchSeedAndTraverse()`, `getModulesForClient()`

**Module registry symmetric deregistration (4b-discovery-unregister):**
- `unregisterDiscovery()`, `unregisterModule()`, `clearRegistry()`

## Events

| Event | Trigger |
|---|---|
| `codec.encode-complete` | Encode pipeline committed |
| `codec.encode-failed` | Encode pipeline error |
| `codec.route-build` | Build domain detected, dispatching to F-planner |
| `codec.route-complete` | Full pipeline complete |

## Future Builds

- **Memory program** (#19) — graph visualization UI using decode's `renderForUI()`
- **Global graph admin** (#20) — admin tooling for graph inspection
- **Audit-trail persistent store** (post-Sprint-3) — ring buffer is first-pass; backing-store design owned by F-codec ops layer

## File Structure

```
F-codec/
├── config/                         R0
│   ├── codec-types.ts              Primitives, ClassifyResult, EncodeResult, config, mappings, FALLBACK_CONFIDENCE
│   ├── codec-events.ts             CODEC_EVENTS (encode events)
│   ├── codec-routing-types.ts      BindingDomain, RouteAction, CodecPipelineResult, routing config+events
│   ├── codec-decode-types.ts       DecodeOutput, DecodedContext, DecodedStructure, WorkOutputDecodeResult, WorkOutputShapeRegistry
│   ├── codec-module-types.ts       FrameworkMode, module-execution atom shapes
│   ├── codec-memory-types.ts       Memory-action atoms (decode → memory navigation)
│   ├── codec-admin-types.ts        Admin-action atoms (global graph seed/ingest)
│   ├── codec-artifact-types.ts     Artifact atoms + ARTIFACT_PREFIX / ARTIFACT_DATA_PREFIX
│   ├── codec-audit-types.ts        AuditTrailEntry, AuditTrailFilter, CognitiveRuntimeState, CognitiveLifecycleState (cog-v1.2.1 §5.3 + §6.5)
│   └── codec-wires.ts              Wire contract declarations
├── domain/                         R1 — pure functions, zero I/O
│   ├── codec-classify.ts           buildClassifyPrompt(), parseClassifyResponse()
│   ├── codec-label.ts              normalizeLabel(), parseLabelResponse()
│   ├── codec-routing.ts            classifyDomain(), determineRoute()
│   ├── codec-decode.ts             classifyGraph(), decodeWorkOutput() (cog-v1.3 §10)
│   ├── codec-decode-render.ts      renderForSystemPrompt(), renderForUI()
│   └── codec-mode-classify.ts      Mode-specific classification helpers
├── app/                            R2 — orchestration
│   ├── codec-encode.ts             encodeLLM(), encodeMechanical()
│   ├── codec-orchestrate.ts        processMessage() — full pipeline
│   ├── codec-mi-adapter.ts         classifyRunReport() — M-I port adapter (cog-v1.2.1 §7.1)
│   ├── codec-audit.ts              getCognitiveAuditTrail(), getCognitiveRuntimeState() (cog-v1.2.1 §5.3 + §6.5)
│   ├── codec-subscribe.ts          registerCodecSubscriptions()
│   ├── codec-read.ts               getDecodedState(), getArtifactsForMode()
│   ├── codec-memory-actions.ts     executeMemoryAction()
│   ├── codec-admin-actions.ts      seedGlobalNode(), ingestExternal(), removeNode(), batchSeedAndTraverse(), getModulesForClient()
│   ├── codec-discovery.ts          Module discovery + unregisterDiscovery()
│   ├── codec-registry.ts           Module registry + unregisterModule(), clearRegistry()
│   ├── codec-artifact.ts           Artifact orchestration
│   └── codec-verify.ts             Verification helpers
├── contract/                       R3 — public surface
│   └── codec-contract.ts           Public surface — see Public Contract section above
├── exec/                           R4 — I/O
│   └── codec-ai-io.ts              classifyAndLabel() — LLM call
└── SLICE.md
```
