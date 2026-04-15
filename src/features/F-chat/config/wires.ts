// @liv-standard v1.4
// [F-chat/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-chat.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    streamAIResponse()     ←  F-ai-adapter/R3 (ai-contract)
//   W-ATOM  providerForModel       ←  F-ai-adapter/R0 (ai-adapter-config)
//   W-ATOM  MODELS                 ←  F-ai-adapter/R0 (ai-adapter-config)
//   W-FN    traverse()             ←  F-memory/R3 (memory-contract)
//   W-FN    getPresentState()      ←  F-memory/R3 (memory-contract)
//   W-FN    getApiKey()            ←  F-user-profile/R3 (user-profile-contract)
//   W-ATOM  PROVIDERS              ←  F-user-profile/R0 (provider-keys-config)
//   W-ATOM  ProviderId             ←  F-user-profile/R0 (provider-keys-config)
//   W-ATOM  PROVIDER_ORDER         ←  F-user-profile/R0 (provider-keys-config)
//   W-FN    validateSession()      ←  F-identity/R3 (auth-contract)
//   W-ATOM  SESSION_COOKIE_NAME    ←  F-identity/R3 (auth-contract)
//   W-FN    processMessage()       ←  F-codec/R3 (codec-contract)
//   W-ATOM  CodecPipelineResult    ←  F-codec/R0 (codec-routing-types)
//   W-FN    isPipelineActive()     ←  F-planner/R3 (planner-contract)
//   W-FN    useNamespace()         ←  F-la-config/R3 (registry-hook)
//   W-ATOM  Surface, InputContainer, SendIcon, Spinner ← F-design-system/R3 (primitives)

// ─── Outbound (exported from this slice) ───────────────────────────────────────

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  CHAT_EVENTS           →  F-event-system/R0 (event-schema)
