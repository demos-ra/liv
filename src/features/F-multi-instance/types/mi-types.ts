// @liv-standard v1.5.1
// [F-multi-instance/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R0
// wires-in:
//   W-ATOM  NodeId, UserId, Semver, Result, AppError  ←  core/R5 primitives
//   W-ATOM  MIInput, RunReportContent, InstanceResult,
//           SetViolation, Aggregation, TypedAtom,
//           InstanceError, InstanceTerminalState,
//           SetTerminalState, RunOutcome, ErrorClass,
//           ErrorResolution, MIValidityError,
//           MIEmissionResult, MIGateResult              ←  core/R5 multi-instance-standard.types
//   W-ATOM  DomainBinding, PlanArtifactContent,
//           Declaration, DeclId, PlanId, PlanTopology,
//           EpochMs, Milliseconds                        ←  core/R5 plan-standard.types
//   W-ATOM  ArtifactEmission, CreateArtifactInput,
//           ArtifactPayload                              ←  core/R5 artifact-standard.types
// wires-out:  re-export surface consumed by F-multi-instance/R1, R2, R3
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/multi-instance-standard.types
//   R5  @/core/types/plan-standard.types
//   R5  @/core/types/artifact-standard.types
// validated:  pending
//
// F-multi-instance R0 — re-export barrel from core/R5 M-I v2.3 / Plan v2.2 / AS v2.2 atoms.
// A1: atoms live once at core/R5; this module only forwards.
// A6: atoms declared at origin; slice surface is pass-through.

export type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
  CognitivePrimitive,
} from '@/core/types/primitives'

export type {
  MIInput,
  RunReportContent,
  InstanceResult,
  InstanceError,
  SetViolation,
  Aggregation,
  PartialSuccessRecord,
  TypedAtom,
  InstanceTerminalState,
  SetTerminalState,
  RunOutcome,
  ErrorClass,
  ErrorResolution,
  MIValidityError,
  MIEmissionResult,
  MIGateResult,
  ShapePositional,
  ExecutionPositional,
  BoundsPositional,
} from '@/core/types/multi-instance-standard.types'

export type {
  DomainBinding,
  PlanArtifactContent,
  Declaration,
  DeclId,
  PlanId,
  PlanTopology,
  EpochMs,
  Milliseconds,
  RoleClassId,
  TierClass,
  TypedAtomRef,
  DataFlowEdge,
  RoleClassInstance,
  CapacityBudget,
  FailsafeRule,
  RenderContractDescriptor,
  ValidateContractDescriptor,
} from '@/core/types/plan-standard.types'

export type {
  ArtifactEmission,
  ArtifactPayload,
  CreateArtifactInput,
} from '@/core/types/artifact-standard.types'
