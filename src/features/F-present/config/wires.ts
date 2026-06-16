// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/wires.ts]
// R0 — boundary declaration (manifest only; no runtime logic).
//
// F-present is the removable lens: a read engine over two frozen stores (the
// wearer's substrate + F-present's own mark store). It writes nothing to the
// substrate; take the lens off and the substrate is byte-unchanged. The v6.0
// frame/intent/archive surface is gone (read-engine re-derivation); geometry is
// computed on read (M2/M3), never stored.

// ─── Engine chain (internal; data path = dependency order) ────────────────────
//   R0  config/read-engine-types        atoms: FactRow·Thing·Dimension·Selection·PivotConfig·Grid·RenderSpec·PresentView
//   R1  domain/fact-table               buildFactTable        (join the two stores)
//   R1  domain/resolve-dimension        resolveDimension      (KEYSTONE; G1-G3)
//   R1  domain/chain-ping               weighDimension        (direct line; summed weight)
//   R1  domain/pivot                    pivot                 (one engine; three zone registries)
//   R1  domain/render-present           renderGrid/renderHeader (one branchless walker over a RenderSpec)
//   R2  app/cognition-orchestrator      presentContext (read-front) + composeAndWrite (write-compose)
//   R3  contract/read-surface           readPresent + presentRouter
//   R3  contract/present-contract       the public boundary (re-exports the above)

// ─── Inbound (consumed by this slice) ─────────────────────────────────────────
//   W-ATOM  Coord/Who/RawTurn/Transcript   ←  core/types/substrate-raw.types        [config/read-engine-types, domain/fact-table, domain/resolve-dimension, domain/pivot, domain/coin-score, app/cognition-orchestrator]
//   W-ATOM  Mark/Ref/PlacedMark/PresentStore/CLAIM_STATUS  ←  config/mark-types (intra-R0)  [domain/*, exec/present-mark-store-db]
//   W-FN    streamStructuredEmit          ←  F-ai-adapter/contract/ai-contract       [app/cognition-orchestrator]
//   W-ATOM  ChatMessage                   ←  F-ai-adapter/contract/ai-contract       [app/cognition-orchestrator]
//   W-TYPE  JsonSchema/StructuredEmitConfig  ←  F-ai-adapter/contract/ai-contract    [domain/coin-score]
//   W-FN    writeRawTurn/readTranscript   ←  F-memory/contract/substrate-contract    [app/cognition-orchestrator]
//   W-FN    registerReplyComposer/registerContextReader  ←  core/domain/cognition-seam   [app/cognition-orchestrator]
//   W-FN    createTRPCRouter/protectedProcedure  ←  F-identity/contract/trpc-procedures  [contract/read-surface]

// ─── Outbound (exported from the R3 boundary, present-contract) ────────────────
//   W-FN    readPresent                   →  external REST (/api/present)            [contract/read-surface]
//   W-TRPC  presentRouter                 →  F-identity/contract/router.ts           [contract/read-surface]
//   W-HOOK  registerCognitionUpgrades     →  F-chat, F-event-system                  [app/cognition-orchestrator]
//   W-ROUTE /api/present                  →  external REST consumers                 [src/app/api/present/route.ts]

// ─── Events ───────────────────────────────────────────────────────────────────
//   (none — F-present does not participate in the event bus; operates via direct call)
