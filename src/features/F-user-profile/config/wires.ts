// @liv-standard v1.3
// [F-user-profile/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-user-profile.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    useNamespace()         ←  F-la-config/R3 (registry-hook)
//   W-FN    validateSession()      ←  F-identity/R3 (auth-contract)
//   W-ATOM  SESSION_COOKIE_NAME    ←  F-identity/R3 (auth-contract)
//   W-ATOM  Surface, Button, ButtonText, Text, Heading, Label, Divider, Toast
//                                  ←  F-design-system/R3 (primitives)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    getApiKey()            →  F-chat/R2 (chat-workflow), F-planner/R3 (planner-inject)
//   W-FN    hasApiKey()            →  (re-exported via user-profile-contract R3)
//   W-FN    upsertProfileForUser() →  F-event-system/R2 (event-subscriptions)
//   W-ATOM  ProviderId             →  F-ai-adapter/R0 (ai-adapter-config), F-ai-adapter/R4 (ai-io)
//   W-ATOM  PROVIDERS              →  F-ai-adapter/R4 (ai-io), F-chat/R2 (chat-workflow)
//   W-ATOM  PROVIDER_ORDER         →  F-chat/R3 (chat-ui)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
