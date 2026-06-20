// @liv-standard v1.5.1 amended sprint-11-shot-4a
// [F-discover/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
//             sprint-11-shot-4a (projectId added to ResearchExecuteInput for substrate scope)
// slice:      F-discover
// layer:      R0
// wires-in:
//   W-ATOM  (Research Standard atom set)  ←  core/R5 research-standard.types
//   W-ATOM  ArtifactGraphPort              ←  F-artifact/R3 artifact-contract
//   W-ATOM  CognitivePrimitive, NodeId     ←  core/R5 primitives
// wires-out:
//   W-ATOM  ResearchBindingRegistry  →  F-discover/R4 (discover-binding-loader), F-discover/R2
//   W-ATOM  ResearchExecuteInput     →  F-discover/R2, F-discover/R3
//   W-ATOM  ClassificationTriple     →  F-discover/R2 (createArtifact boundary)
//   (re-export) RS atom set          →  F-discover slice consumers
// deps:
//   R5 ../../core/types/research-standard.types
//   R5 ../../core/types/primitives
//   R3 ../../F-artifact/contract/artifact-contract  (type-only)
// validated:  pending
//
// F-discover R0 — RS atom re-exports + slice-internal types.
//
// A1: F-discover owns this file. Research Standard atoms are NOT redeclared —
//     they belong to core/R5 research-standard.types and only flow through
//     F-discover as imports. This file's own declarations are slice-internal:
//     ClassificationTriple, ResearchExecuteInput, ResearchBindingRegistry.
// A6: declared at R0 of the defining slice.

// ─── RS atom re-exports (from core/R5) ───────────────────────────────────────
// Re-export discipline: F-discover slice consumers import RS atoms via this R0
// boundary. Cross-slice imports of core/R5 research-standard.types are permitted
// by LIV-Standard CC.01 (cross-slice via R0 atom / W-ATOM) + T1.1 (R5 core exports
// to any slice); re-export here keeps F-discover's surface uniform.

export type {
  // Identifiers
  QuestionId,
  ResearchId,
  CitationId,
  EpochMs,

  // Enums
  SourceKind,
  GroundingClass,
  ResearchTruthValue,
  ResearchExecutionState,
  ResearchApplicability,
  ResearchClosureTruthValue,
  InvestigationMethodKind,
  ResearchShapePositional,
  ResearchQuestionPositional,
  ResearchFindingPositional,
  ResearchSourcePositional,
  ResearchClosurePositional,
  ResearchSelfApplicationPositional,
  ResearchAggregationKind,

  // Reference shapes
  SourceRef,
  DecompositionPolicyRef,

  // Domain-side declared shapes
  ResearchTypedAtomSchema,
  ResearchFailsafeRule,
  SourceCriterion,
  InvestigationMethod,
  ResearchBinding,

  // Content components
  KnowledgeContext,
  ResearchQuestionInput,
  ResearchQuestionContent,
  DecompositionTree,
  FindingResultEntry,
  FindingResultMap,
  SourceCitation,
  SourceCitationMap,
  ResearchClosure,
  AuthoringProgramRef,

  // Content + input + emission
  ResearchArtifactContent,
  ResearchInput,

  // Framework-audit consumption shapes
  ResearchHandoffRuleInstance,
  ResearchGateResult,
  ResearchDimensionResult,
  ResearchCustodyRow,

  // Emission surface
  ResearchValidityError,
  ResearchEmissionResult,

  // AS v2.2 cross-framework re-exports
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '@/core/types/research-standard.types'

// ─── Slice-internal types ────────────────────────────────────────────────────

import type { CognitivePrimitive, NodeId } from '@/core/types/primitives'
import type { ResearchInput, ResearchBinding } from '@/core/types/research-standard.types'

/**
 * Classification triple supplied by the caller at the RS→AS boundary site.
 *
 * Per spec §6.11: AS v2.2 createArtifact requires `classificationNodeId`,
 * `primitive`, `confidence` from Cognitive Standard's R3 encodeLLM result for
 * the same turn. RS's schema.input (§2.1) does NOT carry these — they are
 * caller-supplied at the emission site (parallel to VS v1.0 §6.11 + Plan v2.2's
 * composerInput pattern in F-plan/app/plan-emit.ts).
 *
 * This bundle is a slice-internal type: F-discover R2 receives it alongside the
 * ResearchInput W-ATOM at execute-research's signature.
 */
export type ClassificationTriple = {
  classificationNodeId: NodeId
  primitive:            CognitivePrimitive
  confidence:           number       // range [0, 1]
}

/**
 * Composite input to F-discover R2 execute-research.
 *
 * Wraps the RS schema.input W-ATOM with caller-supplied AS calibration
 * (ClassificationTriple). Pattern parallel to F-verify VerificationExecuteInput
 * + F-plan ExecutePlanInput which thread composer-supplied classification
 * fields outside the W-ATOM schema.
 */
export type ResearchExecuteInput = {
  researchInput:  ResearchInput
  projectId:      string          // sprint-11-shot-4a: substrate scope requires projectId
  classification: ClassificationTriple
}

/**
 * Per-domain ResearchBinding registry shape.
 *
 * Maps domainId (e.g., 'liv-architecture', future research domains) →
 * ResearchBinding instance. Loaded at F-discover R4 (discover-binding-loader);
 * consumed at R2 for ResearchInput.binding population on a per-domain basis.
 *
 * v1.0 scope: smoke binding only (LIV-architecture lookup against substrate §2
 * mode enumeration). Full domain bindings deferred per natural-defer rule
 * (Playbook §1.21).
 */
export type ResearchBindingRegistry = {
  [domainId: string]: ResearchBinding
}

// ─── End of f-discover-types.ts ─────────────────────────────────────────────
