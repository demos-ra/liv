// @liv-standard v1.3
// [F-event-system/R0]
// Built with LIV · livai.dev

// Boundary declaration for F-event-system.
// A3: only atoms cross slice boundaries.
// A5: cross-slice communication via event bus or R3 contracts.

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-ATOM  IDENTITY_EVENTS        ←  F-identity/R0 (auth-events)
//   W-ATOM  SESSION_EVENTS         ←  F-identity/R0 (auth-events)
//   W-ATOM  PERMISSIONS_EVENTS     ←  F-permissions/R0 (permissions-events)
//   W-ATOM  AI_EVENTS              ←  F-ai-adapter/R0 (ai-events)
//   W-ATOM  CHAT_EVENTS            ←  F-chat/R0 (chat-events)
//   W-ATOM  MEMORY_EVENTS          ←  F-memory/R0 (memory-events)
//   W-ATOM  PROJECT_EVENTS         ←  F-project/R0 (project-events)
//   W-ATOM  PLANNER_EVENTS         ←  F-planner/R0 (planner-events)
//   W-ATOM  OUTPUT_EVENTS          ←  F-output/R0 (output-events)
//   W-FN    destroySessionForUser()  ←  F-identity/R3 (auth-contract)
//   W-FN    assignDefaultRole()     ←  F-permissions/R3 (permissions-contract)
//   W-FN    upsertProfileForUser()  ←  F-user-profile/R3 (user-profile-contract)
//   W-FN    onBoot() as memoryOnBoot  ←  F-memory/R3 (memory-contract)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    emitEvent()            →  F-ai-adapter/R2, F-permissions/R2, F-project/R2,
//                                     F-memory/R2, F-planner/R2, F-codec/R2, F-output/R2
//   W-ATOM  EVENTS                 →  F-ai-adapter/R2, F-permissions/R2
//   W-FN    subscribeToEvent()     →  F-codec/R2 (codec-subscribe)

// ─── Events ───────────────────────────────────────────────────────────────────
//   W-EVENT  (hub — aggregates all slice events into EVENTS schema)
