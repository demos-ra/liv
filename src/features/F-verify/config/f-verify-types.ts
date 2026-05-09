// @liv-standard v1.5.1 amended sprint-11-shot-4a
// [F-verify/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
//             sprint-11-shot-4a (projectId added to VerificationExecuteInput for substrate scope)
// slice:      F-verify
// layer:      R0
// wires-in:
//   W-ATOM  (Verification Standard atom set)  ←  core/R5 verification-standard.types
//   W-ATOM  ArtifactGraphPort                  ←  F-artifact/R3 artifact-contract
//   W-ATOM  CognitivePrimitive, NodeId         ←  core/R5 primitives
// wires-out:
//   W-ATOM  VerificationBindingRegistry  →  F-verify/R4 (verify-binding-loader), F-verify/R2
//   W-ATOM  VerificationExecuteInput     →  F-verify/R2, F-verify/R3
//   W-ATOM  ClassificationTriple         →  F-verify/R2 (createArtifact boundary)
//   (re-export) VS atom set              →  F-verify slice consumers
// deps:
//   R5 ../../core/types/verification-standard.types
//   R5 ../../core/types/primitives
//   R3 ../../F-artifact/contract/artifact-contract  (type-only)
// validated:  pending
//
// F-verify R0 — VS atom re-exports + slice-internal types.
//
// A1: F-verify owns this file. Verification Standard atoms are NOT redeclared —
//     they belong to core/R5 verification-standard.types and only flow through
//     F-verify as imports. This file's own declarations are slice-internal:
//     ClassificationTriple, VerificationExecuteInput, VerificationBindingRegistry.
// A6: declared at R0 of the defining slice.

// ─── VS atom re-exports (from core/R5) ───────────────────────────────────────
// Re-export discipline: F-verify slice consumers import VS atoms via this R0
// boundary. Cross-slice imports of core/R5 verification-standard.types are
// permitted by r-layers.json ("R0 may import from core/types and other slices
// R0 only"); re-export here keeps F-verify's surface uniform.

export type {
  // Identifiers
  PredicateId,
  VerificationId,
  EpochMs,
  ArtifactRef,

  // Enums
  PredicateGroundClass,
  VerificationShapePositional,
  VerificationPredicatePositional,
  VerificationEvidencePositional,
  VerificationVerdictPositional,
  VerificationSelfApplicationPositional,
  VerificationAggregationKind,

  // Domain-side declared shapes
  VerificationPredicate,
  VerificationTypedAtomSchema,
  VerificationFailsafeRule,
  VerificationBinding,

  // Content + input + output
  VerificationTarget,
  PredicateResultEntry,
  PredicateResultMap,
  VerificationVerdict,
  AuthoringProgramRef,
  VerificationArtifactContent,
  VerificationInput,

  // Framework-audit consumption shapes
  VerificationHandoffRuleInstance,
  VerificationGateResult,
  VerificationDimensionResult,
  VerificationCustodyRow,

  // Emission surface
  VerificationValidityError,
  VerificationEmissionResult,

  // AS v2.2 cross-framework re-exports
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from '@/core/types/verification-standard.types'

// ─── Slice-internal types ────────────────────────────────────────────────────

import type { CognitivePrimitive, NodeId } from '@/core/types/primitives'
import type { VerificationInput, VerificationBinding } from '@/core/types/verification-standard.types'

/**
 * Classification triple supplied by the caller at the VS→AS boundary site.
 *
 * Per spec §6.11: AS v2.2 createArtifact requires `classificationNodeId`,
 * `primitive`, `confidence` from Cognitive Standard's R3 encodeLLM result for
 * the same turn. VS's schema.input (§2.1) does NOT carry these — they are
 * caller-supplied at the emission site (parallel to Plan v2.2's composerInput
 * pattern in F-plan/app/plan-emit.ts).
 *
 * This bundle is a slice-internal type: F-verify R2 receives it alongside the
 * VerificationInput W-ATOM at execute-verification's signature.
 */
export type ClassificationTriple = {
  classificationNodeId: NodeId
  primitive:            CognitivePrimitive
  confidence:           number       // range [0, 1]
}

/**
 * Composite input to F-verify R2 execute-verification.
 *
 * Wraps the VS schema.input W-ATOM with caller-supplied AS calibration
 * (ClassificationTriple). Pattern parallel to F-plan ExecutePlanInput which
 * threads composer-supplied classification fields outside the Plan W-ATOM
 * schema.
 */
export type VerificationExecuteInput = {
  verificationInput: VerificationInput
  projectId:         string          // sprint-11-shot-4a: substrate scope requires projectId
  classification:    ClassificationTriple
}

/**
 * Per-domain VerificationBinding registry shape.
 *
 * Maps domainId (e.g., 'liv-standard', 'research') → VerificationBinding
 * instance. Loaded at F-verify R4 (verify-binding-loader); consumed at R2 for
 * VerificationInput.binding population on a per-target-domain basis.
 *
 * v1.0 scope: smoke binding only (LIV-Standard structural-property smoke set).
 * Full LIV-Standard 153-predicate binding lands in subsequent cycle (Sprint 4.x)
 * post pre-pass classification work.
 */
export type VerificationBindingRegistry = {
  [domainId: string]: VerificationBinding
}

// ─── End of f-verify-types.ts ───────────────────────────────────────────────
