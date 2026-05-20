// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-contract.ts]
// Sprint 2 — Shot 1
// amended: sprint-2-shot-5 (adds present() callable + tRPC router export)
//          sprint-2-shot-6 (F-chat migration consumer)
//
// Public R3 boundary for F-present.
// External consumers MUST import from this surface only.
// Do NOT reach into F-present R0/R1/R2/R4 directly.

export type {
  PresentReadIntent,
  PresentView,
  PresentViewEmission,
  ViewNode,
  ViewThread,
  WearerOperation,
  OperationParameter,
  ViewBound,
  AnchorTrace,
  ReadPrimitiveTrace,
  WeightingTrace,
  PerspectiveDeclaration,
  IntentIdRef,
  ViewIdRef,
  ViewNodeRef,
  ViewThreadRef,
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
