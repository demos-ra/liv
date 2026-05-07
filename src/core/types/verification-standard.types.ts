// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId              ← core/R5 primitives
//   W-ATOM UserId              ← core/R5 primitives
//   W-ATOM Semver              ← core/R5 primitives
//   W-ATOM Result              ← core/R5 primitives
//   W-ATOM AppError            ← core/R5 primitives
//   W-ATOM ArtifactPayload     ← core/R5 ./artifact-standard.types
//   W-ATOM ArtifactEmission    ← core/R5 ./artifact-standard.types
//   W-ATOM CreateArtifactInput ← core/R5 ./artifact-standard.types
// wires-out:
//   W-ATOM PredicateId                          → all VS consumers, domain bindings (AK-REF branded)
//   W-ATOM VerificationId                       → all VS consumers (AK-REF branded)
//   W-ATOM EpochMs                              → all VS consumers (AK-REF branded)
//   W-ATOM ArtifactRef                          → VS-side calibrated alias of NodeId
//   W-ATOM PredicateGroundClass                 → all VS consumers, domain bindings
//   W-ATOM VerificationShapePositional          → all VS consumers
//   W-ATOM VerificationPredicatePositional      → all VS consumers
//   W-ATOM VerificationEvidencePositional       → all VS consumers
//   W-ATOM VerificationVerdictPositional        → all VS consumers
//   W-ATOM VerificationSelfApplicationPositional → all VS consumers
//   W-ATOM VerificationAggregationKind          → all VS consumers
//   W-ATOM VerificationPredicate                → domain binding authors
//   W-ATOM VerificationBinding                  → domain binding authors, framework registry
//   W-ATOM VerificationTarget                   → all VS consumers
//   W-ATOM PredicateResultEntry                 → all VS consumers
//   W-ATOM PredicateResultMap                   → all VS consumers
//   W-ATOM VerificationVerdict                  → all VS consumers
//   W-ATOM AuthoringProgramRef                  → all VS consumers
//   W-ATOM VerificationArtifactContent          → AS carriers, downstream VS (VA9 self-application)
//   W-ATOM VerificationInput                    → any VS authoring program (F-verify, F-research-verify, etc.)
//   W-ATOM VerificationHandoffRuleInstance      → framework-audit
//   W-ATOM VerificationGateResult               → framework-audit
//   W-ATOM VerificationDimensionResult          → framework-audit
//   W-ATOM VerificationCustodyRow               → framework-audit
//   W-ATOM VerificationValidityError            → VS callers (error surface)
//   W-ATOM VerificationEmissionResult           → VS callers (Result-wrapped)
// deps:
//   R5 ./primitives
//   R5 ./artifact-standard.types
// validated: pending

// ═══════════════════════════════════════════════════════════════
// VERIFICATION STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// VS v1.0 landing: generated against metaframework-v3-1 v3.2.7 via
// generation-procedure-v1-0 v1.1.6. Mode-symmetric L3 sibling of Plan v2.2.
// Canonical spec: PLACEMENT_REGISTRY.verification_standard
// A1: declared once, at R5 core. Slices import — never redeclare.

// verification-standard.types.ts
// R5 type atoms for Verification Standard v1.0
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2 (frozen carrier input)
//
// Consumes: primitives.ts (NodeId, UserId, Semver, Result, AppError)
//           artifact-standard.types.ts (ArtifactPayload, ArtifactEmission, CreateArtifactInput)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in verification-standard.md §6.5 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per spec §Constraints).

import type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
} from './primitives'

import type {
  ArtifactPayload,
  ArtifactEmission,
  CreateArtifactInput,
} from './artifact-standard.types'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * Predicate identifier — unique within one VerificationBinding's `predicateSet`.
 * Scope: one VerificationBinding instance.
 */
export type PredicateId = string & { readonly _brand: 'PredicateId' }

/**
 * VS-local identifier for one emitted VerificationArtifactContent.
 * Scope: all verifications in registry (pins to AS anchor node identity per §6.11).
 */
export type VerificationId = string & { readonly _brand: 'VerificationId' }

/**
 * Epoch milliseconds.
 * VS-local declaration paralleling plan-standard.types.ts EpochMs (same shape,
 * declared at this framework's R5 boundary per A-08 single-source-via-reference
 * per-framework declaration discipline). Cross-framework atom flow uses the
 * primitive number type at runtime; the brand serves type-resolution clarity.
 */
export type EpochMs = number & { readonly _brand: 'EpochMs' }

/**
 * Artifact reference — calibrated alias of NodeId per spec §2.5 cross-framework
 * calibration boundary. AS v2.2 treats prior-artifact references as `NodeId`
 * (see CreateArtifactInput.dependsOn: NodeId[]). VS names the shape at its own
 * surface for spec readability; underlying type lives at primitives.ts via AS.
 *
 * Custody remains with artifact-standard per MA-C6 (no re-ownership).
 */
export type ArtifactRef = NodeId

// ─── Ground-class enum (substrate §6.3 six-class taxonomy) ───────────────────

/**
 * PredicateGroundClass — substrate §6.3 six-class mechanical-criterion taxonomy.
 * Bound to `VerificationPredicate.groundClass` per VA2.
 * Additive at substrate, not at VS (per §6.8 OperatorInterface.extensibility).
 */
export type PredicateGroundClass =
  | 'type-check'
  | 'enum-membership'
  | 'reference-resolution'
  | 'structural-property'
  | 'cardinality'
  | 'deterministic-function-result'

// ─── Positional enums (Universal-variables §3.8 Positional column) ───────────

/**
 * Input axis Positional — VerificationShapePositional per §3.8.
 */
export type VerificationShapePositional = 'pending' | 'received' | 'rejected'

/**
 * Predicate axis Positional — VerificationPredicatePositional per §3.8.
 */
export type VerificationPredicatePositional =
  | 'declared'
  | 'evaluating'
  | 'evaluated'

/**
 * Evidence axis Positional — VerificationEvidencePositional per §3.8.
 */
export type VerificationEvidencePositional = 'received' | 'persisted'

/**
 * Verdict axis Positional (shared with Aggregation per §3.8 declared
 * cross-axis reuse note) — VerificationVerdictPositional per §3.8.
 * `complete` iff every PredicateResultEntry.executionState === 'executed'.
 */
export type VerificationVerdictPositional =
  | 'pending'
  | 'partial'
  | 'complete'

/**
 * Self-application axis Positional — VerificationSelfApplicationPositional per §3.8.
 * `recursive-deferred` is consumer-owned descent beyond the one-step closure
 * VS guarantees (per §1 scopeOut + §6.11 boundary note).
 */
export type VerificationSelfApplicationPositional =
  | 'base'
  | 'self-applied'
  | 'recursive-deferred'

// ─── Aggregation kind (Categorical universal-variable for Aggregation axis) ──

/**
 * VerificationAggregationKind — declared aggregation rule.
 * Singleton at v1.0; additive per S3 (future kinds enter via amendment when
 * first L4 tenant requires).
 */
export type VerificationAggregationKind = 'all-must-pass-with-vacuous-pass-on-empty'

// ─── VerificationPredicate (shape; instance values filled by domain standard) ─

/**
 * Per-predicate evidence path. Resolved against `VerificationInput.evidence`
 * (typed per `binding.evidenceSchema`) at evaluation time per VA2.
 *
 * Path syntax: dot-separated property names (e.g., 'foo.bar.baz').
 * Domain-extensible: a domain binding may declare a richer path grammar so long
 * as resolution is mechanical per substrate §6.3.
 */
export type EvidencePath = string

/**
 * Single predicate declaration. Domain standard declares instances inside
 * `VerificationBinding.predicateSet`. Captured verbatim at emission per VA8.
 *
 * VA2 mechanical condition (§3.6):
 *   - groundClass ∈ PredicateGroundClass enum
 *   - evidencePath resolves against evidence W-ATOM
 *   - expectedValue conforms to groundClass-specific shape
 *   - failureSurface is non-empty
 */
export type VerificationPredicate = {
  predicateId:    PredicateId
  groundClass:    PredicateGroundClass
  evidencePath:   EvidencePath
  /**
   * Expected value compared against the resolved evidencePath at evaluation
   * time. Per-groundClass conformance:
   *   - 'type-check'                    → string (typeof literal)
   *   - 'enum-membership'               → unknown[] (allowed values)
   *   - 'reference-resolution'          → string (resolver descriptor / target id)
   *   - 'structural-property'           → unknown (property-shape descriptor or
   *                                       literal value to compare)
   *   - 'cardinality'                   → number (expected length / count)
   *   - 'deterministic-function-result' → unknown (expected return value)
   * Each entry's actual shape is groundClass-specific; opaque to VS at the type
   * surface (validated mechanically at evaluation time).
   */
  expectedValue:  unknown
  failureSurface: string
}

// ─── TypedAtomSchema (shape parallel to Plan v2.2) ───────────────────────────

/**
 * Typed-atom schema descriptor — shape of `VerificationBinding.evidenceSchema`.
 * Instance content owned by domain standard's R5 type declarations.
 *
 * Shape parallel to Plan v2.2 TypedAtomSchema (declared at plan-standard.types
 * for Plan; declared here for VS per A-08 per-framework single-source-via-reference
 * declaration discipline — both frameworks reference the same conceptual
 * "domain-declared schema identifier" pattern, neither re-owns the other).
 */
export type VerificationTypedAtomSchema = {
  shapeRef: string   // domain-declared schema identifier
}

/**
 * Failsafe rule shape — domain-declared threshold + action descriptor.
 * Instance content owned by domain standard; shape owned by VS.
 * Resolved by VA6 multi-source closure (every failsafe key referenced in
 * binding.failsafes resolves within binding.failsafes).
 */
export type VerificationFailsafeRule = {
  thresholdKind:  string   // domain-declared kind label
  thresholdValue: number
  actionRef:      string   // domain-declared action identifier
}

// ─── VerificationBinding (shape; instance filled by domain standard) ─────────

/**
 * VerificationBinding — VS declares shape; domain standard fills instance values.
 * Captured verbatim at emission per VA8. Resolved closure verified by VA6.
 *
 * Zero instances at v1.0 (frozen shape; F-verify slice supplies LIV-Standard
 * smoke binding at Sprint 4 close per cycle brief). Full LIV-Standard
 * 153-predicate binding lands in subsequent cycle (Sprint 4.x) post pre-pass.
 */
export type VerificationBinding = {
  domainId:       string                                    // provenance: domain standard
  domainVersion:  Semver                                    // provenance: domain standard
  predicateSet:   VerificationPredicate[]                   // VA2 + VA4 source-of-truth
  evidenceSchema: VerificationTypedAtomSchema               // VA3 typed-conformance reference
  failsafes:      { [key: string]: VerificationFailsafeRule } // VA6 multi-source closure scope
}

// ─── VerificationTarget (shape) ──────────────────────────────────────────────

/**
 * Target of verification — reference to the artifact under verification.
 * Verbatim from VerificationInput.target per VA7; capturedAt populated at
 * emission for replay + VA9 self-application.
 */
export type VerificationTarget = {
  artifactRef:  ArtifactRef
  artifactKind: string         // 'plan' | 'run-report' | 'verification' | <domain>
  capturedAt:   EpochMs        // emission-time snapshot
}

// ─── PredicateResult (per-predicate evaluation outcome) ──────────────────────

/**
 * Per-predicate evaluation entry. VA4 mechanical condition: keys of
 * predicateResults are set-equal to predicateIds(binding.predicateSet).
 *
 * Field semantics (§2.2 + §3.5 leaf-VA4):
 *   - truthValue: 'passed' | 'failed' | null  (null only when executionState='not-yet-run' per S4)
 *   - executionState: 'not-yet-run' | 'executed'  (cycle-1 first-run discipline)
 *   - applicability: 'applicable' | 'n/a'    (cycle-1 GateResult/DimensionResult decomposition)
 *   - basis: populated when applicability='n/a' per MA-V11
 *   - failureDetail: populated when truthValue='failed'; declared error text
 */
export type PredicateResultEntry = {
  predicateRef:   PredicateId
  truthValue:     'passed' | 'failed' | null
  executionState: 'not-yet-run' | 'executed'
  applicability:  'applicable' | 'n/a'
  basis:          string | null
  failureDetail:  string | null
  evaluatedAt:    EpochMs
}

/**
 * PredicateResultMap — keyed by PredicateId.
 * Set equality with predicateIds(binding.predicateSet) per VA4.
 */
export type PredicateResultMap = {
  [predicateId: string]: PredicateResultEntry
}

// ─── VerificationVerdict (Aggregation closure) ───────────────────────────────

/**
 * Aggregation result per VA5. Derived field — content.verdict.truthValue is
 * derived from content.predicateResults per the all-must-pass rule.
 *
 * VA5 derivation (§3.6):
 *   - 'verified' iff (predicateResults empty AND aggregationBasis declares
 *     vacuous-pass) OR (∀ pid: predicateResults[pid].truthValue === 'passed'
 *     AND predicateResults[pid].applicability === 'applicable')
 *   - 'failed' iff ∃ pid: predicateResults[pid].truthValue === 'failed';
 *     content.verdict.failedPredicateIds populated with that subset
 *   - null iff ∃ pid: predicateResults[pid].executionState === 'not-yet-run'
 */
export type VerificationVerdict = {
  truthValue:         'verified' | 'failed' | null
  aggregationBasis:   string                       // declared aggregation rule applied
  failedPredicateIds: PredicateId[]                // populated when truthValue='failed'
}

// ─── Authoring program reference ─────────────────────────────────────────────

/**
 * Authoring-program identity — declared by caller.
 * Shape parallel to plan-standard.types AuthoringProgramRef (no cross-framework
 * re-ownership; each L3 framework declares its own per A-08 per-framework
 * single-source-via-reference declaration discipline).
 */
export type AuthoringProgramRef = {
  programId:      string
  programVersion: Semver
}

// ─── VerificationArtifactContent (output W-ATOM; rides as AS payload.content) ─

/**
 * W-ATOM emitted by VS's emission entry point.
 * Rides inside ArtifactPayload.content when AS v2.2 carries it.
 * Every field traces to declared provenance in §6.5 custody table.
 */
export type VerificationArtifactContent = {
  verificationId:      VerificationId         // runtime-generated at emission (pins to AS anchor node identity)
  verificationVersion: Semver                  // authoring-program-computed (new semver per re-verification per VA8)
  producedBy:          AuthoringProgramRef     // verbatim from input.authoringProgram per VA3 producedBy invariant
  producedAt:          EpochMs                 // runtime-captured at emission

  binding:             VerificationBinding     // verbatim from input.binding (frozen per VA6 + VA8)

  target:              VerificationTarget      // verbatim from input.target per VA7 + emission-time capturedAt

  evidence:            unknown                 // typed per binding.evidenceSchema; verbatim from input.evidence per VA3

  predicateResults:    PredicateResultMap      // VA4 one-to-one decomposition

  verdict:             VerificationVerdict     // VA5 aggregation closure
}

// ─── Input W-ATOM (schema.input per MA-S1) ───────────────────────────────────

/**
 * W-ATOM consumed by VS's emission entry point.
 * Every field traces to declared source in §6.5 custody table.
 */
export type VerificationInput = {
  authoringProgram: AuthoringProgramRef        // caller R0
  userId:           UserId                     // F-identity session
  turnId:           string                     // caller turn context
  binding:          VerificationBinding        // domain standard (by-value instance; zero instances at v1.0)
  target: {
    artifactRef:  ArtifactRef
    artifactKind: string
  }
  evidence:         unknown                    // typed per binding.evidenceSchema; verbatim-carried per VA3
  preverifyInputs:  unknown                    // caller-typed per domain
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ───────────────────

/**
 * VS-local handoff rule instance. Consumed by framework-audit X3 C5
 * captureShape check. Shape conforms to substrate §8.2 HandoffRulePrimitive
 * amended (parallel to plan-standard.types PlanHandoffRuleInstance).
 */
export type VerificationHandoffRuleInstance = {
  id:                     string             // e.g., 'HR-VS1'
  direction: {
    from: { id: string; version: Semver }    // FrameworkRef shape
    to:   { id: string; version: Semver }
  }
  carrierApplicability:   ('self' | 'named' | 'none')[]
  invariant:              string              // declared invariant text
  captureShape?: {
    capturedFields:  string[]
    captureTarget:   'registry' | 'audit-trail' | 'custom'
    queryInterface?: string
  }
  diagnosticSignificance: boolean
}

// ─── Gate / dimension / custody result shapes (framework-audit consumption) ──

/**
 * GateResult consumed by framework-audit SelfAuditRecord shape.
 * Shape mirrors framework-audit-v1-2 §8.1 GateResult.
 */
export type VerificationGateResult = {
  gateId:    string                                   // e.g., 'G-VS1', 'PG1', 'G-U5'
  result:    'passed' | 'failed' | 'pending'
  timestamp: string                                    // ISO 8601
  evidence?: string                                    // optional, populated for failed gates
}

/**
 * DimensionResult consumed by framework-audit when evaluating VS.
 * Shape mirrors framework-audit-v1-2 §8.1 DimensionResult.
 */
export type VerificationDimensionResult = {
  dimensionId: string           // 'X1'–'X10'
  result:      'pass' | 'fail' | 'n/a'
  basis?:      string           // required for 'n/a'
  details:     string
}

/**
 * Framework-local custody row. Consumed by framework-audit custody-check.
 * Shape mirrors substrate §4 A-04 CustodyRow.
 */
export type VerificationCustodyRow = {
  atomId:           string
  ownerFrameworkId: string
  layer:            string
  consumers:        string[]
}

// ─── Operation result (emission surface) ─────────────────────────────────────

/**
 * VerificationArtifact composition error payload. Uses canonical
 * Result<T>/AppError from primitives.ts.
 *
 * Emitted by the authoring program when validity fails pre-AS-emission, OR
 * when AS v2.2 emission itself rejects the carrier invocation.
 *
 * Error code semantics (per §6.8 OperatorInterface.errorContract):
 *   - VERIFICATION_INPUT_INVALID            → schema violation on VerificationInput (G-VS1)
 *   - VERIFICATION_VALIDITY_FAILED          → VA1..VA9 failure at emission-time validation (G-VS2..G-VS9)
 *   - VERIFICATION_EMISSION_REJECTED        → AS v2.2 rejected createArtifact carrier emission
 *   - VERIFICATION_SELF_APPLICATION_NONTERMINATING → VA9 one-step closure failed (recursion bound exceeded)
 */
export type VerificationValidityError = AppError & {
  code:
    | 'VERIFICATION_INPUT_INVALID'
    | 'VERIFICATION_VALIDITY_FAILED'
    | 'VERIFICATION_EMISSION_REJECTED'
    | 'VERIFICATION_SELF_APPLICATION_NONTERMINATING'
  failedAxiom?: string                // e.g., 'VA2', 'VA5', 'VA9' — populated for VERIFICATION_VALIDITY_FAILED
}

/**
 * Terminal Result type for verification composition + emission (authoring
 * program invokes). On success, the AS emission W-ATOM is returned
 * (verification anchor node id lives at
 * ArtifactEmission.writes.a7.artifactAnchorNodeId, which becomes the
 * verificationAnchorNodeId consumed at HR-VS4 by observability/replay/audit
 * consumers).
 */
export type VerificationEmissionResult = Result<ArtifactEmission, VerificationValidityError>

// ─── AS v2.2 cross-framework re-exports (declarative, for type-resolution clarity) ──
// Declared by AS, consumed by VS at §6 Cross-framework handoff.
// Not re-owned; custody remains with artifact-standard (see §6.5 custody table).

export type { ArtifactPayload, ArtifactEmission, CreateArtifactInput }

// ─── End of verification-standard.types.ts ──────────────────────────────────
