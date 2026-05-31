// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-contract.ts]
// Sprint 2 — Shot 1
// amended: sprint-2-shot-5 (adds present() callable + tRPC router export)
//          sprint-2-shot-6 (F-chat migration consumer)
//          present-rederive-shot-2 (v2.0 contract: PresentReadIntent → PresentIntent;
//            FocusSelector + OrderingSelector surfaced; WearerOperation +
//            OperationParameter removed)
//          sprint-b3-present-build (v3.0: re-exports the v3.0 OrderingSelector /
//            PerspectiveDeclaration / WeightingTrace shapes — re-export only,
//            no boundary signature change)
//          b3-v4-reconciliation (v4.0: PresentFrame / FrameNode / FrameEdge /
//            FrameProvenance / FrameIdRef added; PresentViewEmission removed)
//          sprint-b3-present-v5 (v5.0: intent collapse; archive shapes added)
//          sprint-b3-present-v6 (v6.0: tree-of-stacks re-derivation —
//            StackEntry / Window / CameraSetting / TemporalSetting / CameraTrace
//            / WindowRef added to the re-export set; AnchorTrace /
//            PerspectiveDeclaration removed)
//
// Public R3 boundary for F-present.
// External consumers MUST import from this surface only.
// Do NOT reach into F-present R0/R1/R2/R4 directly.
//
// v6.0: the tree-of-stacks re-derivation surfaces StackEntry, Window,
// CameraSetting, TemporalSetting, CameraTrace, WindowRef; AnchorTrace
// (superseded by CameraTrace) and PerspectiveDeclaration are removed. The
// PresentView projection carries the tree's structure at the granularity-cutoff
// extent ([R19]/[R20]).

export type {
  PresentIntent,
  PresentView,
  PresentFrame,
  FrameNode,
  FrameEdge,
  FrameProvenance,
  StackEntry,
  CameraSetting,
  TemporalSetting,
  CameraTrace,
  Window,
  GranularityDial,
  SnapshotArchiveEntry,
  SnapshotArchiveKey,
  ViewNode,
  ViewEdge,
  ViewBound,
  ReadPrimitiveTrace,
  WeightingTrace,
  IntentIdRef,
  ViewIdRef,
  ViewNodeRef,
  ViewEdgeRef,
  WindowRef,
  FrameIdRef,
  OriginProvenance,
  FrameworkRef,
  Timestamp,
} from '../config/present-types'

export type {
  PresentError,
  PresentErrorCode,
  PresentResult,
} from '../config/present-errors'

// Shot 5: callable surface + tRPC router
export { presentService as present } from '../app/present-service'
export { presentRouter }             from './present-trpc'

// sprint-COIN-I1: the cognition composition wire. F-event-system bootstrap() calls
// this once to register F-present's write-compose + read-front upgraders into the
// core cognition seam (mirroring registerDomainPrograms). It is the single removable
// wire: drop the bootstrap call + this slice and the core loop runs its baseline.
export { registerCognitionUpgrades } from '../app/cognition-orchestrator'
