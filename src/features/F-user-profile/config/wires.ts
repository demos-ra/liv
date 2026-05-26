// @liv-standard v1.3
// [F-user-profile/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-user-profile.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    useNamespace()         ←  F-verify/R3 (registry-hook)
//   W-FN    getPerimeterSession()  ←  F-identity/R3 (perimeter-consultation; replaces validateSession+SESSION_COOKIE_NAME pattern per Sprint 6 Shot 3)
//   W-ATOM  Surface, Button, ButtonText, Text, Heading, Label, Divider, Toast
//                                  ←  F-design-system/R3 (primitives)
//   W-ATOM  PROVIDER_DEFAULT_MODEL ←  F-ai-adapter/R0 (ai-adapter-config; PUT /api/profile/models resolves provider→model — sprint-beta-addon-shot-2)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    getApiKey()            →  F-chat/R2 (chat-workflow), F-builder/R3 (builder-contract)
//   W-FN    hasApiKey()            →  (re-exported via user-profile-contract R3)
//   W-FN    upsertProfileForUser() →  F-event-system/R2 (event-subscriptions)
//   W-ATOM  ProviderId             →  F-ai-adapter/R0 (ai-adapter-config), F-ai-adapter/R4 (ai-io)
//   W-ATOM  PROVIDERS              →  F-ai-adapter/R4 (ai-io), F-chat/R2 (chat-workflow)
//   W-ATOM  PROVIDER_ORDER         →  F-chat/R3 (chat-ui)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none)
