// @liv-standard v1.4
// [F-chat/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.4
// amended:    none
// slice:      F-chat
// category:   Modality
// layer:      R0
// wires-in:   none (R0 — pure declarations; wire sources documented inline below)
// wires-out:  none (R0 — boundary declaration only)
// deps:       none
// validated:  pending

// Boundary declaration for F-chat.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    streamAIResponse()     ←  F-ai-adapter/R3 (ai-contract)
//   W-ATOM  providerForModel       ←  F-ai-adapter/R0 (ai-adapter-config)
//   W-ATOM  MODELS                 ←  F-ai-adapter/R0 (ai-adapter-config)
//   W-FN    traverse()             ←  F-memory/R3 (memory-contract)
//   W-FN    Present()              ←  F-memory/R3 (memory-contract; LM v2.2 §D, replaces v2.1 getPresentState)
//   W-FN    getApiKey()            ←  F-user-profile/R3 (user-profile-contract)
//   W-ATOM  PROVIDERS              ←  F-user-profile/R0 (provider-keys-config)
//   W-ATOM  ProviderId             ←  F-user-profile/R0 (provider-keys-config)
//   W-ATOM  PROVIDER_ORDER         ←  F-user-profile/R0 (provider-keys-config)
//   W-FN    getPerimeterSession()  ←  F-identity/R3 (perimeter-consultation; replaces validateSession+SESSION_COOKIE_NAME pattern per Sprint 6 Shot 3 / Perimeter Standard v1.0)
//   W-FN    processMessage()       ←  (formerly F-codec/R3 codec-contract; F-codec dissolved Sprint 8 Shot 3a — wire presently inactive pending Sprint 9 reauthor)
//   W-ATOM  CodecPipelineResult    ←  (formerly F-codec/R0 codec-routing-types; F-codec dissolved Sprint 8 Shot 3a — type presently unused pending Sprint 9 reauthor)
//   W-FN    isPipelineActive()     ←  F-plan/R3 (plan-contract) — sprint-12-shot-4 (F-S12-D closed)
//   W-FN    useNamespace()         ←  F-verify/R3 (registry-hook)
//   W-ATOM  Surface, InputContainer, SendIcon, Spinner ← F-design-system/R3 (primitives)

// ─── Outbound (exported from this slice) ───────────────────────────────────────

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  CHAT_EVENTS           →  F-event-system/R0 (event-schema)
