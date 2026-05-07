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
//   W-ATOM QuestionId                                 → all RS consumers, domain bindings (AK-REF branded)
//   W-ATOM ResearchId                                 → all RS consumers (AK-REF branded)
//   W-ATOM CitationId                                 → all RS consumers, domain bindings (AK-REF branded)
//   W-ATOM EpochMs                                    → all RS consumers (AK-REF branded; RS-local declaration paralleling VS+Plan precedent)
//   W-ATOM SourceKind                                 → all RS consumers, domain bindings
//   W-ATOM GroundingClass                             → all RS consumers, domain bindings
//   W-ATOM ResearchTruthValue                         → all RS consumers
//   W-ATOM ResearchExecutionState                     → all RS consumers
//   W-ATOM ResearchApplicability                      → all RS consumers
//   W-ATOM ResearchClosureTruthValue                  → all RS consumers
//   W-ATOM InvestigationMethodKind                    → all RS consumers, domain bindings
//   W-ATOM ResearchShapePositional                    → all RS consumers
//   W-ATOM ResearchQuestionPositional                 → all RS consumers
//   W-ATOM ResearchFindingPositional                  → all RS consumers
//   W-ATOM ResearchSourcePositional                   → all RS consumers
//   W-ATOM ResearchClosurePositional                  → all RS consumers
//   W-ATOM ResearchSelfApplicationPositional          → all RS consumers
//   W-ATOM ResearchAggregationKind                    → all RS consumers
//   W-ATOM SourceRef                                  → all RS consumers
//   W-ATOM DecompositionPolicyRef                     → all RS consumers, domain bindings
//   W-ATOM ResearchTypedAtomSchema                    → domain binding authors
//   W-ATOM ResearchFailsafeRule                       → domain binding authors
//   W-ATOM SourceCriterion                            → domain binding authors
//   W-ATOM InvestigationMethod                        → domain binding authors
//   W-ATOM ResearchBinding                            → domain binding authors, framework registry
//   W-ATOM ResearchQuestionInput                      → all RS consumers
//   W-ATOM ResearchQuestionContent                    → all RS consumers
//   W-ATOM KnowledgeContext                           → all RS consumers
//   W-ATOM DecompositionTree                          → all RS consumers
//   W-ATOM FindingResultEntry                         → all RS consumers
//   W-ATOM FindingResultMap                           → all RS consumers
//   W-ATOM SourceCitation                             → all RS consumers
//   W-ATOM SourceCitationMap                          → all RS consumers
//   W-ATOM ResearchClosure                            → all RS consumers
//   W-ATOM AuthoringProgramRef                        → all RS consumers
//   W-ATOM ResearchArtifactContent                    → AS carriers, downstream RS (RA8 self-application)
//   W-ATOM ResearchInput                              → any RS authoring program (F-discover, future research-authoring-programs)
//   W-ATOM ResearchHandoffRuleInstance                → framework-audit
//   W-ATOM ResearchGateResult                         → framework-audit
//   W-ATOM ResearchDimensionResult                    → framework-audit
//   W-ATOM ResearchCustodyRow                         → framework-audit
//   W-ATOM ResearchValidityError                      → RS callers (error surface)
//   W-ATOM ResearchEmissionResult                     → RS callers (Result-wrapped)
// deps:
//   R5 ./primitives
//   R5 ./artifact-standard.types
// validated: pending

// ═══════════════════════════════════════════════════════════════
// RESEARCH STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// RS v1.0 landing: generated against metaframework-v3-1 v3.2.7 via
// generation-procedure-v1-0 v1.1.6. Mode-symmetric L3 sibling of VS v1.0
// (verificative) and Plan v2.2 (structural). Mode = epistemic (unknown → known).
// Canonical spec: PLACEMENT_REGISTRY.research_standard
// A1: declared once, at R5 core. Slices import — never redeclare.

// research-standard.types.ts
// R5 type atoms for Research Standard v1.0
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2 (frozen carrier input)
//
// Consumes: primitives.ts (NodeId, UserId, Semver, Result, AppError)
//           artifact-standard.types.ts (ArtifactPayload, ArtifactEmission, CreateArtifactInput)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in research-standard.md §6.5 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per spec §Constraints).
//
// EpochMs note (D-RS5-EPOCHMS-LOCATION, Sprint 5 build cycle):
// RS spec §2.4 cites EpochMs as consumed from primitives.ts. primitives.ts does
// NOT declare EpochMs; VS v1.0 and Plan v2.2 each declare EpochMs locally per
// per-framework single-source-via-reference discipline (A-08). RS follows the
// same precedent: declared locally below per VS+Plan pattern. Spec §2.4 row
// resolves to this declaration; primitives consolidation tracked in backlog,
// not in scope for Sprint 5.

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
 * Question identifier — unique within a single research artifact's
 * decomposition tree + findings map.
 * Scope: one ResearchArtifactContent instance.
 */
export type QuestionId = string & { readonly _brand: 'QuestionId' }

/**
 * RS-local identifier for one emitted ResearchArtifactContent.
 * Scope: all research artifacts in registry (pins to AS anchor node identity per §6.11).
 */
export type ResearchId = string & { readonly _brand: 'ResearchId' }

/**
 * Citation identifier — unique within one ResearchArtifactContent's
 * `sources` map.
 * Scope: one ResearchArtifactContent instance.
 */
export type CitationId = string & { readonly _brand: 'CitationId' }

/**
 * Epoch milliseconds.
 * RS-local declaration paralleling verification-standard.types.ts EpochMs and
 * plan-standard.types.ts EpochMs (same shape, declared at this framework's R5
 * boundary per A-08 single-source-via-reference per-framework declaration
 * discipline). Cross-framework atom flow uses the primitive number type at
 * runtime; the brand serves type-resolution clarity.
 *
 * D-RS5-EPOCHMS-LOCATION resolution (Sprint 5 build cycle):
 * Spec §2.4 mis-cites primitives.ts as the EpochMs source (same drift VS spec
 * silently absorbed). Mechanical resolution per VS+Plan precedent: declare
 * locally here.
 */
export type EpochMs = number & { readonly _brand: 'EpochMs' }

// ─── Source-kind enum (substrate §6.3 reference-resolution × binding.sourceCriteria) ──

/**
 * SourceKind — per-citation source-kind taxonomy declared at spec §2.2.
 * Bound to `SourceCitation.sourceKind` per RA4. Intersection with
 * `binding.sourceCriteria.sourceKindAllowed` is the per-binding admissibility
 * scope.
 */
export type SourceKind =
  | 'graph-node'
  | 'external-uri'
  | 'authoring-input'

// ─── Grounding-class enum (substrate §6.3 six-class taxonomy) ────────────────

/**
 * GroundingClass — substrate §6.3 six-class mechanical-criterion taxonomy.
 * Bound to `SourceCriterion.groundingClass` per RA4.
 * Additive at substrate, not at RS (per §6.8 OperatorInterface.extensibility).
 *
 * Identical shape to VS PredicateGroundClass per substrate §6.3 single
 * authoritative enum; declared per-framework per A-08 discipline.
 */
export type GroundingClass =
  | 'type-check'
  | 'enum-membership'
  | 'reference-resolution'
  | 'structural-property'
  | 'cardinality'
  | 'deterministic-function-result'

// ─── Per-finding outcome enums (spec §2.2) ───────────────────────────────────

/**
 * Per-leaf finding truth value per §2.2.
 * `null` only when executionState='not-yet-investigated' per substrate §10.1 S4
 * + F-cycle-1-3 GateResult/DimensionResult decomposition.
 */
export type ResearchTruthValue = 'resolved' | 'unresolved' | null

/**
 * Per-leaf finding execution state per §2.2 + F-cycle-1-3 first-run discipline.
 */
export type ResearchExecutionState = 'not-yet-investigated' | 'investigated'

/**
 * Per-leaf finding applicability per §2.2 + F-cycle-1-3 decomposition.
 * `'n/a'` requires non-null `basis` per MA-V11.
 */
export type ResearchApplicability = 'applicable' | 'n/a'

/**
 * Closure truth value per §2.2 RA5 derivation.
 * `null` permitted for pre-execution per substrate §10.1 S4.
 */
export type ResearchClosureTruthValue = 'closed' | 'open' | 'partial' | null

// ─── Investigation-method-kind enum (spec §6.9) ──────────────────────────────

/**
 * Investigation method kind per spec §6.9 ResearchBinding.
 * Determines RA3 root-set membership: methodKind ∈ {'lookup', 'derivation',
 * 'synthesis'} → rootSet = {rootQuestionId}; methodKind === 'decomposition' →
 * rootSet = ∅ (sub-questions are the leaves).
 */
export type InvestigationMethodKind =
  | 'decomposition'
  | 'lookup'
  | 'derivation'
  | 'synthesis'

// ─── Positional enums (Universal-variables §3.8 Positional column) ───────────

/**
 * Input-axis Positional — ResearchShapePositional per §3.8.
 * RA1 input-shape gate determines transition.
 */
export type ResearchShapePositional = 'pending' | 'received' | 'rejected'

/**
 * Question-axis Positional (shared cross-axis with Decomposition per §3.8
 * MA-St3 self-check) — ResearchQuestionPositional per §3.8.
 */
export type ResearchQuestionPositional =
  | 'declared'
  | 'decomposing'
  | 'decomposed'

/**
 * Finding-axis Positional per §3.8.
 * `complete` semantics: every leaf executionState='investigated'.
 */
export type ResearchFindingPositional =
  | 'declared'
  | 'investigating'
  | 'investigated'

/**
 * Source-axis Positional per §3.8.
 */
export type ResearchSourcePositional = 'declared' | 'captured'

/**
 * Closure-axis Positional per §3.8.
 * `complete` iff every finding executionState='investigated'.
 */
export type ResearchClosurePositional = 'pending' | 'partial' | 'complete'

/**
 * Self-application-axis Positional per §3.8.
 * `recursive-deferred` is consumer-owned descent beyond the one-step closure
 * RS guarantees (per §1 scopeOut + §6.11 boundary note).
 */
export type ResearchSelfApplicationPositional =
  | 'base'
  | 'self-applied'
  | 'recursive-deferred'

// ─── Aggregation kind (Categorical universal-variable for Closure axis) ──────

/**
 * ResearchAggregationKind — declared aggregation rule.
 * Singleton at v1.0; additive per S3 (future kinds enter via amendment when
 * first L4 tenant requires).
 */
export type ResearchAggregationKind =
  'all-resolved-with-vacuous-closure-on-empty-leaves'

// ─── Decomposition-policy reference (spec §2.7) ──────────────────────────────

/**
 * String identifier resolving into `binding.investigationMethods[*].methodId`.
 * Mechanical: deterministic lookup per substrate §6.3 reference-resolution.
 */
export type DecompositionPolicyRef = string

// ─── SourceRef (spec §2.7) ───────────────────────────────────────────────────

/**
 * Per-finding reference into the citation set. Finding-axis structural element
 * with content owned at Source axis per substrate §9 cross-axis-invariant
 * (declared §3.3 Source-axis orthogonality basis row).
 */
export type SourceRef = {
  citationId: CitationId
}

// ─── Domain-binding shape components (spec §6.9) ─────────────────────────────

/**
 * Typed-atom schema descriptor — shape of `ResearchBinding.questionSchema` and
 * `ResearchBinding.knowledgeSchema`. Instance content owned by domain
 * standard's R5 type declarations.
 *
 * Shape parallel to VS VerificationTypedAtomSchema and Plan v2.2 TypedAtomSchema
 * (declared per-framework per A-08 single-source-via-reference declaration
 * discipline; neither re-owns the other).
 */
export type ResearchTypedAtomSchema = {
  shapeRef: string   // domain-declared schema identifier
}

/**
 * Failsafe rule shape — domain-declared key + predicate descriptor.
 * Instance content owned by domain standard; shape owned by RS.
 * Resolved by RA6 multi-source closure (every failsafe key referenced in
 * binding.failsafes resolves within binding.failsafes).
 *
 * Shape consumed-by-reference from VS pattern (spec §6.9). RS declares its
 * own shape per A-08 per-framework declaration discipline.
 */
export type ResearchFailsafeRule = {
  kind:      string
  predicate: string
}

/**
 * Source-admissibility criterion. RA4 multi-source closure scope.
 *
 *   - sourceKindAllowed: subset of SourceKind admitted per this binding
 *   - groundingClass:    substrate §6.3 ground class associated with this
 *                        criterion (one of the six-class enum)
 */
export type SourceCriterion = {
  criterionId:       string
  sourceKindAllowed: SourceKind[]
  groundingClass:    GroundingClass
}

/**
 * One investigation method declared by the domain binding. Resolved per
 * `ResearchInput.question.decompositionPolicy` (RA6) into
 * `ResearchBinding.investigationMethods[*]`.
 *
 * Per RA2: when methodKind === 'decomposition', subQuestions[rootQuestionId]
 * must be non-empty; per RA3, rootSet(methodKind) = {rootQuestionId} when
 * methodKind ∈ {'lookup', 'derivation', 'synthesis'} (root-as-leaf),
 * else ∅.
 */
export type InvestigationMethod = {
  methodId:           string
  methodKind:         InvestigationMethodKind
  decompositionRule:  string                       // declarative descriptor; resolution mechanical per substrate §6.3
}

// ─── ResearchBinding (shape; instance filled by domain standard) ─────────────

/**
 * ResearchBinding — RS declares shape; domain standard fills instance values.
 * Captured verbatim at emission per RA6. Resolved closure verified by RA6.
 *
 * Zero instances at v1.0 (frozen shape; F-discover slice supplies LIV-architecture
 * smoke binding at Sprint 5 close per cycle brief). Full domain bindings deferred
 * per natural-defer rule (Playbook §1.21).
 */
export type ResearchBinding = {
  domainId:              string                                          // provenance: domain standard
  domainVersion:         Semver                                          // provenance: domain standard
  investigationMethods:  InvestigationMethod[]                            // RA2 + RA6 source-of-truth
  questionSchema:        ResearchTypedAtomSchema                          // RA1 typed-conformance reference (questionText shape)
  knowledgeSchema:       ResearchTypedAtomSchema                          // RA3 typed-conformance reference (resolvedContent shape)
  sourceCriteria:        SourceCriterion[]                                // RA4 grounding constraint
  failsafes:             { [key: string]: ResearchFailsafeRule }          // RA6 multi-source closure scope
}

// ─── Knowledge context (input-side prior knowledge surface) ──────────────────

/**
 * Forward-carried prior-knowledge surface. Verbatim from input per RA10.
 * `scopeBoundary: null` permitted (positive empty-shape per A-17) for the
 * first investigation in a chain.
 */
export type KnowledgeContext = {
  artifactRefs: NodeId[]
  scopeBoundary: {
    kind: string
    ref:  NodeId
  } | null
}

// ─── Question shapes (input form vs content form per spec §2.7) ──────────────

/**
 * Input form of ResearchQuestion (consumed at ResearchInput.question per §2.1).
 * No `capturedAt` — that field is added at emission per RA9.
 */
export type ResearchQuestionInput = {
  questionId:           QuestionId
  questionText:         string                  // length ≥ 1 per RA1
  decompositionPolicy:  DecompositionPolicyRef
}

/**
 * Content form of ResearchQuestion (produced at ResearchArtifactContent.question
 * per §2.2). Adds `capturedAt: EpochMs` at emission per RA9 verbatim-carry
 * triple + emission-time snapshot.
 *
 * Shape divergence is shape-additive at content side per MA-S7 recursive `≼`
 * discipline (no input-shape edit).
 */
export type ResearchQuestionContent = {
  questionId:           QuestionId
  questionText:         string
  decompositionPolicy:  DecompositionPolicyRef
  capturedAt:           EpochMs
}

// ─── Decomposition (one-step Question → sub-Question tree per RA2) ───────────

/**
 * Decomposition tree per spec §2.2.
 *
 * Depth = 1 at v1.0 per RA2. `subQuestions` has at most one entry, keyed by
 * `rootQuestionId`. Multi-level decomposition (Q → Q' → Q'') is consumer-owned
 * per §1 scopeOut.
 *
 * When `binding.investigationMethods[decompositionPolicy].methodKind ∈
 * {'lookup', 'derivation', 'synthesis'}`, `subQuestions[rootQuestionId]` may
 * be `[]` and the rootQuestionId is itself the leaf per RA3 root-as-leaf rule.
 */
export type DecompositionTree = {
  rootQuestionId:  QuestionId
  subQuestions:    { [parentId: string]: QuestionId[] }
}

// ─── Per-leaf finding entry (spec §2.2) ──────────────────────────────────────

/**
 * One finding entry per leaf-question per RA3.
 *
 * Field semantics (§2.2 + §3.5 leaf-RA3):
 *   - findingRef: resolves into leaves(decomposition) per RA3
 *   - truthValue ∈ {'resolved', 'unresolved', null} (null only when
 *     executionState='not-yet-investigated' per S4)
 *   - executionState ∈ {'not-yet-investigated', 'investigated'} (cycle-1
 *     first-run discipline)
 *   - applicability ∈ {'applicable', 'n/a'} (cycle-1 GateResult/DimensionResult
 *     decomposition)
 *   - basis: non-null when applicability='n/a' per MA-V11
 *   - resolvedContent: non-null when truthValue='resolved'; conforms to
 *     binding.knowledgeSchema (opaque to RS at type surface per RA3)
 *   - sourceRefs: non-empty when truthValue='resolved' (resolved findings
 *     must be grounded per RA4)
 *   - failureDetail: non-null when truthValue='unresolved'
 *   - investigatedAt: per-leaf timestamp
 */
export type FindingResultEntry = {
  findingRef:      QuestionId
  truthValue:      ResearchTruthValue
  executionState:  ResearchExecutionState
  applicability:   ResearchApplicability
  basis:           string | null
  resolvedContent: unknown | null
  sourceRefs:      SourceRef[]
  failureDetail:   string | null
  investigatedAt:  EpochMs
}

/**
 * FindingResultMap — keyed by QuestionId (cast string at type surface).
 * Set equality with `subQuestions[rootQuestionId] ∪ rootSet(methodKind)` per RA3.
 */
export type FindingResultMap = {
  [leafQuestionId: string]: FindingResultEntry
}

// ─── Source citations (spec §2.2) ────────────────────────────────────────────

/**
 * One citation entry. RA4 mechanical: every populated field per shape;
 * `sourceKind` ∈ admitted enum × intersection with
 * `binding.sourceCriteria.sourceKindAllowed`.
 *
 * `reference` shape is per-`sourceKind`:
 *   - 'graph-node'      → NodeId-shaped string (graph ref)
 *   - 'external-uri'    → URI string
 *   - 'authoring-input' → opaque string (caller-bounded reference)
 */
export type SourceCitation = {
  citationId:  CitationId
  sourceKind:  SourceKind
  reference:   string                              // shape per sourceKind; opaque at type surface
  capturedAt:  EpochMs
}

/**
 * SourceCitationMap — keyed by CitationId (cast string at type surface).
 */
export type SourceCitationMap = {
  [citationId: string]: SourceCitation
}

// ─── Closure (Aggregation result per RA5) ────────────────────────────────────

/**
 * Aggregation result per RA5. Derived field — `content.closure.truthValue` is
 * derived from `content.findings + content.openQuestions` per the all-resolved
 * rule.
 *
 * RA5 derivation (§3.6):
 *   - 'closed' iff (findings empty AND aggregationBasis declares vacuous-closure
 *     AND openQuestions = []) OR
 *     (every lid in keys(findings) satisfies findings[lid].truthValue ===
 *     'resolved' AND findings[lid].applicability === 'applicable' AND
 *     openQuestions = [])
 *   - 'open' iff every lid satisfies findings[lid].truthValue === 'unresolved'
 *     OR findings[lid].executionState === 'not-yet-investigated'
 *   - 'partial' iff some leaf is resolved AND some is unresolved or
 *     not-yet-investigated
 *   - null iff any findings[lid].executionState === 'not-yet-investigated' AND
 *     no lid has truthValue === 'resolved'
 */
export type ResearchClosure = {
  truthValue:            ResearchClosureTruthValue
  aggregationBasis:      string                      // declared aggregation rule applied (v1.0: ResearchAggregationKind value)
  unresolvedQuestionIds: QuestionId[]                // populated when truthValue ∈ {'open', 'partial'}
}

// ─── Authoring program reference ─────────────────────────────────────────────

/**
 * Authoring-program identity — declared by caller.
 * Shape parallel to VS AuthoringProgramRef and Plan v2.2 AuthoringProgramRef
 * (no cross-framework re-ownership; each L3 framework declares its own per
 * A-08 per-framework single-source-via-reference declaration discipline).
 */
export type AuthoringProgramRef = {
  programId:      string
  programVersion: Semver
}

// ─── ResearchArtifactContent (output W-ATOM; rides as AS payload.content) ────

/**
 * W-ATOM emitted by RS's emission entry point.
 * Rides inside ArtifactPayload.content when AS v2.2 carries it.
 * Every field traces to declared provenance in §6.5 custody table.
 */
export type ResearchArtifactContent = {
  researchId:      ResearchId         // runtime-generated at emission (pins to AS anchor node identity)
  researchVersion: Semver              // authoring-program-computed (new semver per re-research per RA7)
  producedBy:      AuthoringProgramRef // verbatim from input.authoringProgram per RA6 producedBy invariant
  producedAt:      EpochMs             // runtime-captured at emission

  binding:         ResearchBinding     // verbatim from input.binding (frozen per RA6 + RA7)

  question:        ResearchQuestionContent // verbatim from input.question per RA9 + emission-time capturedAt

  priorKnowledge:  KnowledgeContext    // verbatim from input.priorKnowledge per RA10 (byte-identical)

  decomposition:   DecompositionTree   // RA2 one-step structural transformation

  findings:        FindingResultMap    // RA3 one-to-one decomposition (over subQuestions ∪ rootSet)

  openQuestions:   QuestionId[]        // unresolved-or-not-yet-investigated leaves; populated from findings per RA5

  sources:         SourceCitationMap   // RA4 multi-source grounding closure

  closure:         ResearchClosure     // RA5 aggregation closure
}

// ─── Input W-ATOM (schema.input per MA-S1) ───────────────────────────────────

/**
 * W-ATOM consumed by RS's emission entry point.
 * Every field traces to declared source in §6.5 custody table.
 */
export type ResearchInput = {
  authoringProgram: AuthoringProgramRef        // caller R0
  userId:           UserId                     // F-identity session
  turnId:           string                     // caller turn context
  binding:          ResearchBinding            // domain standard (by-value instance; zero instances at v1.0)
  question:         ResearchQuestionInput      // caller-supplied unknown to investigate
  priorKnowledge:   KnowledgeContext           // forward-carried known surface; verbatim per RA10
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ───────────────────

/**
 * RS-local handoff rule instance. Consumed by framework-audit X3 C5
 * captureShape check. Shape conforms to substrate §8.2 HandoffRulePrimitive
 * amended (parallel to VS VerificationHandoffRuleInstance and
 * plan-standard.types PlanHandoffRuleInstance).
 */
export type ResearchHandoffRuleInstance = {
  id:                     string             // e.g., 'HR-RS1'
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
export type ResearchGateResult = {
  gateId:    string                                   // e.g., 'G-RS1', 'PG1', 'G-U5'
  result:    'passed' | 'failed' | 'pending'
  timestamp: string                                    // ISO 8601
  evidence?: string                                    // optional, populated for failed gates
}

/**
 * DimensionResult consumed by framework-audit when evaluating RS.
 * Shape mirrors framework-audit-v1-2 §8.1 DimensionResult.
 */
export type ResearchDimensionResult = {
  dimensionId: string           // 'X1'–'X10'
  result:      'pass' | 'fail' | 'n/a'
  basis?:      string           // required for 'n/a'
  details:     string
}

/**
 * Framework-local custody row. Consumed by framework-audit custody-check.
 * Shape mirrors substrate §4 A-04 CustodyRow.
 */
export type ResearchCustodyRow = {
  atomId:           string
  ownerFrameworkId: string
  layer:            string
  consumers:        string[]
}

// ─── Operation result (emission surface) ─────────────────────────────────────

/**
 * ResearchArtifact composition error payload. Uses canonical Result<T>/AppError
 * from primitives.ts.
 *
 * Emitted by the authoring program when validity fails pre-AS-emission, OR
 * when AS v2.2 emission itself rejects the carrier invocation.
 *
 * Error code semantics (per §6.8 OperatorInterface.errorContract):
 *   - RESEARCH_INPUT_INVALID         → schema violation on ResearchInput (G-RS1)
 *   - RESEARCH_VALIDITY_FAILED       → RA1..RA10 failure at emission-time validation (G-RS1..G-RS10)
 *   - RESEARCH_EMISSION_REJECTED     → AS v2.2 rejected createArtifact carrier emission
 */
export type ResearchValidityError = AppError & {
  code:
    | 'RESEARCH_INPUT_INVALID'
    | 'RESEARCH_VALIDITY_FAILED'
    | 'RESEARCH_EMISSION_REJECTED'
  failedAxiom?: string                // e.g., 'RA1', 'RA3', 'RA8' — populated for RESEARCH_VALIDITY_FAILED
}

/**
 * Terminal Result type for research composition + emission (authoring program
 * invokes). On success, the AS emission W-ATOM is returned (research anchor
 * node id lives at ArtifactEmission.writes.a7.artifactAnchorNodeId, which
 * becomes the researchAnchorNodeId consumed at HR-RS4 by
 * observability/replay/audit consumers).
 */
export type ResearchEmissionResult = Result<ArtifactEmission, ResearchValidityError>

// ─── AS v2.2 cross-framework re-exports (declarative, for type-resolution clarity) ──
// Declared by AS, consumed by RS at §6 Cross-framework handoff.
// Not re-owned; custody remains with artifact-standard (see §6.5 custody table).

export type { ArtifactPayload, ArtifactEmission, CreateArtifactInput }

// ─── End of research-standard.types.ts ──────────────────────────────────────
