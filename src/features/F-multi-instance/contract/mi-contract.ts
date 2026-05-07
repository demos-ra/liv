// @liv-standard v1.5.1
// [F-multi-instance/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R3
// wires-in:
//   W-HOOK  executeRun                                ←  F-multi-instance/R2 mi-execute
//   W-ATOM  MultiInstancePorts, PlanResolutionPort,
//           CognitiveClassificationPort               ←  F-multi-instance/R2 mi-execute
//   W-ATOM  AIAdapterPort                             ←  F-multi-instance/R2 mi-instance
// wires-out:
//   W-HOOK  executeRun                          →  authoring programs, Builder, Verify
//   W-ATOM  MIInput, MIEmissionResult           →  all M-I callers
//   W-ATOM  MultiInstancePorts + sub-ports      →  caller wiring sites
//   W-ATOM  RunReportContent                    →  callers inspecting AS emission payload
// deps:
//   R2  ../app/mi-execute
//   R2  ../app/mi-instance
//   R0  ../types/mi-types
// validated:  pending
//
// F-multi-instance R3 — public contract.
// A5: cross-slice calls enter here only.
//
// Primary export: executeRun(input, ports) → Promise<MIEmissionResult>
//
// Port wiring at deploy (post-4b):
//   ports.plan.resolvePlan         →  F-memory R3 (one-hop read)
//   ports.adapter.invokeRole       →  F-ai-adapter R3 streamAIResponse (via per-role wrapper)
//   ports.adapter.resolveValidateContract  →  F-la-config R3 (LIV-Standard contract registry)
//   ports.cognitive.classifyRunReport →  F-ai-adapter R3 llm-classify-io (post-beta integration; F-codec dissolved Sprint 8 Shot 3a)
//   ports.graph                    →  F-memory R3 primitives for F-artifact (shared impl)

export { executeRun } from '../app/mi-execute'

export type {
  MultiInstancePorts,
  PlanResolutionPort,
  CognitiveClassificationPort,
} from '../app/mi-execute'

export type { AIAdapterPort } from '../app/mi-instance'

// Type re-exports — callers pattern-match on MIEmissionResult etc.
export type {
  MIInput,
  MIEmissionResult,
  MIValidityError,
  RunReportContent,
  InstanceResult,
  InstanceError,
  SetViolation,
  Aggregation,
  RunOutcome,
  SetTerminalState,
  InstanceTerminalState,
  ArtifactEmission,
} from '../types/mi-types'
