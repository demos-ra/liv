// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/wires.ts]
// Sprint 2 — Shot 1; present-rederive — Shot 2/5; sprint-b3-present-build (v3.0);
//   b3-v4-reconciliation (v4.0 — non-emitter); sprint-b3-present-v5 (v5.0);
//   sprint-b3-present-v6 (v6.0 — tree-of-stacks: outbound atom rows re-stated —
//     StackEntry / Window / CameraSetting / TemporalSetting / CameraTrace /
//     WindowRef added; AnchorTrace / PerspectiveDeclaration removed)
// R0 — boundary declaration (manifest only; no runtime logic)
//
// F-present is a Tool slice (read-time resolution). Carrier = self.
// F-present holds the live PresentFrame (a tree of stacks), the lens-dial
// position, the accumulating Window set, and a per-user present archive — all
// its own stores in the LIV database — and writes NOTHING to the substrate; it
// is a non-emitter (Present Standard v6.0 §16, [R1]).
// Governed by: Present Standard v6.0

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
// Verified wire-for-wire against the v6.0 F-present source.
//   W-FN    threadQuery()          ←  F-memory/contract/substrate-contract (LMA9)   [domain/dispatch-read.ts]
//   W-FN    iterateAxis()          ←  F-memory/contract/substrate-contract (LMA9)   [domain/dispatch-read.ts]
//   W-FN    generateId()           ←  core/types/primitives                        [app/present-service.ts, contract/present-trpc.ts]
//   W-FN    createTRPCRouter()     ←  F-identity/contract/trpc-procedures           [contract/present-trpc.ts]
//   W-FN    protectedProcedure     ←  F-identity/contract/trpc-procedures           [contract/present-trpc.ts]
//   W-TYPE  ThreadQueryInput       ←  core/types/substrate.types                    [domain/dispatch-read.ts]
//   W-TYPE  StateChangeRecord      ←  core/types/substrate.types                    [config/present-types.ts, domain/compose-view.ts, domain/dispatch-read.ts]
//   W-TYPE  StateChangeId          ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  IdentityRef            ←  core/types/substrate.types                    [config/present-types.ts, domain/*]
//   W-TYPE  ScopeRef               ←  core/types/substrate.types                    [config/present-types.ts, contract/present-trpc.ts]
//   W-TYPE  PositionRef            ←  core/types/substrate.types                    [config/present-types.ts, domain/dispatch-read.ts, contract/present-trpc.ts]
//   W-TYPE  RoleRef                ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  ContentClass           ←  core/types/substrate.types                    [config/present-types.ts, domain/dispatch-read.ts]
//   W-TYPE  SubstrateSourceRef     ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  Relation               ←  core/types/substrate.types                    [config/present-types.ts, domain/compose-view.ts]
//   W-TYPE  RelationModality       ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  IdentityWithRole       ←  core/types/substrate.types                    [config/present-types.ts]
//   W-TYPE  UserId                 ←  core/types/primitives                         [config/present-types.ts]
//
// Re-added at sprint-b3-present-v5 (v5.0 — [R6]):
//   W-FN  iterateAxis()  ←  F-memory/contract/substrate-contract — the LMA9 raw
//   axis-scan primitive. v5.0 PR3/PR4 derive the anchor from the human's LATEST
//   state-change ([R6]); dispatch-read.ts reads it via iterateAxis(backward, 1).
//   The v4.0 wires.ts had iterateAxis dropped (the v2.0 focus model did not use
//   it); the v5.0 anchor derivation re-introduces the call, so the inbound wire
//   is restored to match the v5.0 code.
//
// Still removed (v4.0 — non-emitter, §16, [R4]):
//   W-FN  writeStateChange()  ←  F-memory/contract/substrate-contract. F-present
//   writes nothing to the substrate. The held snapshot and the per-user archive
//   are F-present's OWN stores ([R13]); the archive write does not go through any
//   substrate write primitive. No F-present file imports writeStateChange (verified).

// ─── Outbound (exported from this slice) ───────────────────────────────────────
// Principal consumer-facing exports, verified against contract/present-contract.ts
// (the R3 boundary) at the v5.0 state.
//   W-FN    present()              →  F-chat/contract/chat-contract              [present-contract: re-export of app/present-service.presentService]
//   W-TRPC  presentRouter          →  F-identity/contract/router.ts              [present-contract: re-export of contract/present-trpc.presentRouter]
//   W-ROUTE /api/present           →  external REST consumers                    [app/api/present/route.ts POST handler]
//   W-TYPE  PresentIntent          →  consumers (v6.0 — the three controls: camera + temporal + standpoint)
//   W-TYPE  PresentFrame           →  consumers (the present — F-present's held-and-archived tree of stacks)
//   W-TYPE  PresentView            →  consumers (the structure-carrying read-time projection, [R19]/[R20])
//   W-TYPE  StackEntry             →  consumers (v6.0 NEW — one state-change in a carrier's stack, [R4]/[R14])
//   W-TYPE  Window                 →  consumers (v6.0 NEW — the unit every action yields, [R12])
//   W-TYPE  CameraSetting          →  consumers (v6.0 NEW — the camera control value, [R9])
//   W-TYPE  TemporalSetting        →  consumers (v6.0 NEW — the temporal-dial control value, [R10])
//   W-TYPE  GranularityDial        →  consumers (the lens — the adjustable granularity dial, [R10])
//   W-TYPE  SnapshotArchiveEntry   →  consumers (the per-user present-archive store record, [R15])
//   W-TYPE  SnapshotArchiveKey     →  consumers (the archive retrieval key)
//   W-TYPE  PresentError           →  consumers
//   W-TYPE  PresentResult<T>       →  consumers
//
// Re-stated at sprint-b3-present-v6 (v6.0 — tree-of-stacks re-derivation):
//   AnchorTrace and PerspectiveDeclaration are removed from the re-export set
//   (AnchorTrace superseded by CameraTrace; PerspectiveDeclaration deleted —
//   the present has the two fixed axes). StackEntry / Window / CameraSetting /
//   TemporalSetting / CameraTrace / WindowRef are added.
//
// Completeness note: contract/present-contract.ts additionally re-exports the
// supporting atom set for consumer typing (ViewNode, ViewEdge, ViewBound,
// CameraTrace, ReadPrimitiveTrace, WeightingTrace, FrameNode, FrameEdge,
// FrameProvenance, IntentIdRef, ViewIdRef, ViewNodeRef, ViewEdgeRef, WindowRef,
// FrameIdRef, OriginProvenance, FrameworkRef, Timestamp, PresentErrorCode).
// These are sub-shapes of the principal W-TYPE rows above.

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none — F-present does not participate in event bus; operates via direct call)
