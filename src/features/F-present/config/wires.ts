// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/wires.ts]
// Sprint 2 — Shot 1; present-rederive — Shot 2 (v2.0 outbound: PresentReadIntent → PresentIntent) + Shot 5 / build-tier-audit F-4 (inbound: iterateAxis dropped; wire-for-wire verified against v2.0 source)
// R0 — boundary declaration (manifest only; no runtime logic)
//
// F-present is a Tool slice (read-time composition). Carrier = self.
// Governed by: Present Standard v2.0

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
// Verified wire-for-wire against the v2.0 overlaid F-present source
// (present-rederive Shot 5 / build-tier-audit F-4): every row below corresponds
// to a real import in an F-present R1/R2/R3/R4 file at the overlaid state.
//   W-FN    threadQuery()          ←  F-memory/contract/substrate-contract (LMA9)   [domain/dispatch-read.ts]
//   W-FN    writeStateChange()     ←  F-memory/contract/substrate-contract (LMA4)   [domain/emit-view.ts]
//   W-FN    generateId()           ←  core/types/primitives                        [app/present-service.ts, contract/present-trpc.ts]
//   W-FN    createTRPCRouter()     ←  F-identity/contract/trpc-procedures           [contract/present-trpc.ts]
//   W-FN    protectedProcedure     ←  F-identity/contract/trpc-procedures           [contract/present-trpc.ts]
//   W-TYPE  SubstrateWriteInput    ←  F-memory/contract/substrate-contract          [config/present-types.ts]
//   W-TYPE  ThreadQueryInput       ←  core/types/substrate.types                    [domain/dispatch-read.ts]
//   W-TYPE  StateChangeRecord      ←  core/types/substrate.types                    [config/present-types.ts, domain/compose-view.ts, domain/dispatch-read.ts]
//   W-TYPE  StateChangeId          ←  core/types/substrate.types                    [config/present-types.ts, domain/emit-view.ts, domain/run-gates.ts]
//   W-TYPE  IdentityRef            ←  core/types/substrate.types                    [config/present-types.ts, domain/*]
//   W-TYPE  ScopeRef               ←  core/types/substrate.types                    [config/present-types.ts, contract/present-trpc.ts]
//   W-TYPE  PositionRef            ←  core/types/substrate.types                    [config/present-types.ts, domain/dispatch-read.ts, contract/present-trpc.ts]
//   W-TYPE  RoleRef                ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  ContentClass           ←  core/types/substrate.types                    [config/present-types.ts, domain/dispatch-read.ts]
//   W-TYPE  SubstrateSourceRef     ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  Relation               ←  core/types/substrate.types                    [config/present-types.ts, domain/compose-view.ts]
//   W-TYPE  RelationModality       ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  IdentityWithRole       ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  UserId                 ←  core/types/primitives (substrate A-09 UserIdRef alias)  [config/present-types.ts]
//
// Removed at present-rederive Shot 3 / build-tier-audit F-4:
//   W-FN  iterateAxis()  ←  F-memory/contract/substrate-contract — the v1.0.1
//   move-trajectory / move-neighborhood read primitive. Under v2.0 the operation
//   set collapsed to one parameterized operation; no v2.0 focus path calls
//   iterateAxis (verified: dispatch-read.ts at the overlaid state imports only
//   threadQuery). Vestige of the collapsed five-operation model — dropped from
//   the inbound boundary so wires.ts matches the v2.0 code.
//
// Note: substrate W-TYPE rows resolve via core/types/substrate.types — the
// F-present v2.0 code imports them from there directly (the substrate-contract
// R3 surface re-exports the same atoms; the path shown is the actual import path
// in the v2.0 source, per the wire-for-wire verification).

// ─── Outbound (exported from this slice) ───────────────────────────────────────
// Principal consumer-facing exports, verified against contract/present-contract.ts
// (the R3 boundary) at the v2.0 overlaid state (build-tier-audit F-4).
//   W-FN    present()              →  F-chat/contract/chat-contract              [present-contract: re-export of app/present-service.presentService]
//   W-TRPC  presentRouter          →  F-identity/contract/router.ts              [present-contract: re-export of contract/present-trpc.presentRouter]
//   W-ROUTE /api/present           →  external REST consumers                    [app/api/present/route.ts POST handler]
//   W-TYPE  PresentIntent          →  consumers (F-chat, future: F-discover, F-plan, F-builder, F-verify)
//   W-TYPE  FocusSelector          →  consumers (present-rederive Shot 2 — v2.0 contract)
//   W-TYPE  OrderingSelector       →  consumers (present-rederive Shot 2 — v2.0 contract)
//   W-TYPE  PresentView            →  consumers
//   W-TYPE  PresentViewEmission    →  substrate-trail / audit / replay consumers
//   W-TYPE  PresentError           →  consumers
//   W-TYPE  PresentResult<T>       →  consumers
//
// Completeness note: contract/present-contract.ts additionally re-exports the
// supporting atom set for consumer typing (ViewNode, ViewThread, ViewBound,
// AnchorTrace, ReadPrimitiveTrace, WeightingTrace, PerspectiveDeclaration,
// IntentIdRef, ViewIdRef, ViewNodeRef, ViewThreadRef, OriginProvenance,
// FrameworkRef, Timestamp, PresentErrorCode). These are sub-shapes of the
// principal W-TYPE rows above; the rows above are the boundary-significant
// manifest entries per the wires.ts convention. Every re-exported symbol is a
// real export of present-contract.ts — verified at the overlaid state.

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none — F-present does not participate in event bus; operates via direct call)
