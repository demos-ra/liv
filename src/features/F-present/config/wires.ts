// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/wires.ts]
// Sprint 2 — Shot 1
// R0 — boundary declaration (manifest only; no runtime logic)
//
// F-present is a Tool slice (read-time composition). Carrier = self.
// Governed by: Present Standard v1.0.1

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-FN    threadQuery()          ←  F-memory/contract/substrate-contract (LMA9)
//   W-FN    iterateAxis()          ←  F-memory/contract/substrate-contract (LMA9)
//   W-FN    writeStateChange()     ←  F-memory/contract/substrate-contract (LMA4)
//   W-TYPE  SubstrateWriteInput    ←  F-memory/contract/substrate-contract
//   W-TYPE  StateChangeRecord      ←  F-memory/contract/substrate-contract
//   W-TYPE  StateChangeId          ←  F-memory/contract/substrate-contract
//   W-TYPE  IdentityRef            ←  F-memory/contract/substrate-contract
//   W-TYPE  ScopeRef               ←  F-memory/contract/substrate-contract
//   W-TYPE  PositionRef            ←  F-memory/contract/substrate-contract
//   W-TYPE  RoleRef                ←  F-memory/contract/substrate-contract
//   W-TYPE  ContentClass           ←  F-memory/contract/substrate-contract
//   W-TYPE  SubstrateSourceRef     ←  F-memory/contract/substrate-contract
//   W-TYPE  Relation               ←  F-memory/contract/substrate-contract
//   W-TYPE  RelationModality       ←  F-memory/contract/substrate-contract
//   W-TYPE  IdentityWithRole       ←  F-memory/contract/substrate-contract
//   W-FN    generateId()           ←  core/types/primitives
//   W-TYPE  UserId                 ←  core/types/primitives (substrate A-09 UserIdRef alias)

// ─── Outbound (exported from this slice) ───────────────────────────────────────
//   W-FN    present()              →  F-chat/contract/chat-contract (Shot 6 migration)
//   W-TYPE  PresentReadIntent      →  consumers (F-chat, future: F-discover, F-plan, F-builder, F-verify)
//   W-TYPE  PresentView            →  consumers
//   W-TYPE  PresentError           →  consumers
//   W-TYPE  PresentResult<T>       →  consumers
//   W-ROUTE /api/present           →  external REST consumers (Shot 5)
//   W-TRPC  presentRouter          →  F-identity/contract/router.ts (Shot 5)

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none — F-present does not participate in event bus; operates via direct call)
