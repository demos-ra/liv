// @liv-standard v1.3
// [F-ai-adapter/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-ai-adapter.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-ATOM  ProviderId             ←  F-user-profile/R0 (provider-keys-config)
//   W-ATOM  PROVIDERS              ←  F-user-profile/R0 (provider-keys-config)
//   W-FN    emitEvent()            ←  F-event-system/R3 (event-bus)
//   W-ATOM  EVENTS                 ←  F-event-system/R0 (event-schema)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    streamAIResponse()     →  F-chat/R2 (via ai-contract R3), F-planner/R4 (ai-adapter-io)
//   W-ATOM  providerForModel       →  F-chat/R2 (chat-workflow), F-planner/R3 (planner-inject)
//   W-ATOM  MODELS                 →  F-chat/R3 (chat-contract)
//   W-ATOM  ChatMessage            →  F-planner/R4 (ai-adapter-io)
//   W-ATOM  StreamChunk            →  (internal re-export from ai-io)

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  AI_EVENTS             →  F-event-system/R0 (event-schema)
