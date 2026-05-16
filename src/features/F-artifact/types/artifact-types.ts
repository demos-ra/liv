// @liv-standard v1.5.2
// [F-artifact/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    4b-f-artifact-slice
//             sprint-b2-unified-close (Point 6: LIV-Standard v1.5.1 → v1.5.2; AS v2.2 → v2.3 references in header swept; F-009 paired-write framing closure declared at this amendment; artifact emission is Path B to Store via internal-derivation channel — confirmed at body level)
// slice:      F-artifact
// layer:      R0
// wires-in:
//   W-ATOM  NodeId, UserId, Semver, Result, AppError  ←  core/R5 primitives
//   W-ATOM  CreateArtifactInput, ArtifactEmission     ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactEdge, ArtifactEdgeKind            ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactWriteA4, ArtifactWriteA7          ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactPayload                           ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactError, CreateArtifactResult       ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactProcedureStepInstance             ←  core/R5 artifact-standard.types
//   W-ATOM  ArtifactGateResult                        ←  core/R5 artifact-standard.types
// wires-out:  re-export surface consumed by F-artifact/R1, R2, R3
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/artifact-standard.types
// validated:  pending
//
// F-artifact R0 — re-export barrel from core/R5 AS v2.3 atoms.
// A1: the atoms live once, at core/R5. This file surfaces them inside the
// slice so R1/R2/R3 can import from '../types/artifact-types' instead of
// reaching into core/R5 directly. No new declarations.
// A6: atoms declared at origin; this module only forwards them.
//
// Phase 4b mapping to spec:
//   CreateArtifactInput      → S1 schema.input (§3.7)
//   ArtifactEmission         → S3 schema.output carrier='self' (§3.7)
//   ArtifactEdge{,Kind}      → ArA4a–ArA4d derivation output (§3.6)
//   ArtifactWriteA4/A7       → ArA1 (every emission has both blocks)
//   ArtifactGateResult       → G-Ar1..G-Ar8 evaluation output (§4.2)

export type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
  CognitivePrimitive,
} from '@/core/types/primitives'

export type {
  // Input / output
  CreateArtifactInput,
  ArtifactEmission,
  CreateArtifactResult,
  ArtifactError,

  // Sub-structures
  ArtifactPayload,
  ArtifactEdge,
  ArtifactEdgeKind,
  ArtifactWriteA4,
  ArtifactWriteA7,

  // Procedure + gates
  ArtifactProcedureStepInstance,
  ArtifactProcedureStepId,
  ArtifactProcedureStage,
  ArtifactProcedureKind,
  ArtifactGateResult,

  // Positional enums
  ArtifactChainPosition,
  ArtifactCompositionProduct,
  ArtifactEmissionPositional,
  ArtifactCompositionPositional,
  ArtifactLineagePositional,
} from '@/core/types/artifact-standard.types'
