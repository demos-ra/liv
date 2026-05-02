// @liv-standard v1.5.1
// [F-discover/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
// slice:      F-discover
// layer:      R1
// wires-in:
//   W-ATOM  ResearchInput, ResearchArtifactContent  ←  F-discover/R0
//   W-ATOM  ResearchBinding, FindingResultMap       ←  F-discover/R0
//   W-ATOM  ResearchClosure, InvestigationMethodKind ←  F-discover/R0
//   W-ATOM  Semver, generateId                      ←  core/R5 primitives
// wires-out:
//   W-FN    composeResearch        →  F-discover/R2 execute-research
//   W-FN    deriveClosure          →  F-discover/R1 run-research-gates (intra-layer)
//   W-FN    leafQuestionIds        →  F-discover/R1 run-research-gates (intra-layer)
//   W-FN    defaultMintResearchId  →  F-discover/R2 execute-research (default DI)
// deps:
//   R0 ../config/f-discover-types
//   R5 ../../../core/types/primitives
// validated:  pending
//
// F-discover R1 — pure research composer.
//
// A4: zero I/O. Pure function. Domain logic only.
// Input  : { researchInput, deps (epochNow, mintResearchId), authoringProgramVersion }
// Output : composed ResearchArtifactContent (pre-gate; gates run separately at R1).
//
// Discipline (parallel to F-verify/domain/compose-verification.ts +
//             F-plan/domain/plan-compose.ts):
//   - composeResearch is total: never throws. Composes the full content
//     including a placeholder findings map (one not-yet-investigated entry
//     per leaf-question per RA3 rootSet rule) and the derived closure per RA5.
//   - Findings investigation is upstream of RS schema.input (authoring-program
//     pre-research composition is owned by F-discover's caller per spec §1
//     scopeOut row 6). At v1.0, F-discover's R1 composer produces a
//     STRUCTURALLY VALID ResearchArtifactContent assuming the caller has
//     already populated findings via the input boundary or has accepted the
//     not-yet-investigated default.
//
//     ARCHITECTURE NOTE: Spec §2.1 ResearchInput does NOT carry a findings
//     surface — findings are RS-output-side per §2.2. The smoke harness
//     (Sprint 8 first-run) constructs ResearchArtifactContent directly with
//     populated findings, bypassing the default not-yet-investigated path
//     which is the open-research-state representation. composeResearch
//     produces the not-yet-investigated default; callers that need a
//     resolved-content harness construct the artifact content directly and
//     call run-research-gates against it. This mirrors F-verify's pattern
//     where evidence is caller-supplied and predicate evaluation produces
//     'executed' results — F-discover's findings are the analogous
//     caller-supplied surface, sourced upstream of schema.input.
//
//   - Closure derivation is mechanical per RA5 (§3.6 + §2.2 atomicity note).
//   - Validity gating (G-RS1..G-RS10) is the caller's R1 sibling concern
//     (run-research-gates.ts) — composeResearch produces; run gates verifies.
//     Separation of concerns.

import { generateId } from '@/core/types/primitives'
import type { Semver } from '@/core/types/primitives'
import type {
  ResearchInput,
  ResearchArtifactContent,
  ResearchBinding,
  ResearchQuestionContent,
  DecompositionTree,
  FindingResultEntry,
  FindingResultMap,
  ResearchClosure,
  ResearchClosureTruthValue,
  InvestigationMethodKind,
  QuestionId,
  ResearchId,
  EpochMs,
} from '../config/f-discover-types'

// ─── Compose deps (injected at R2) ───────────────────────────────────────────

/**
 * Runtime dependency surface. Injected at R2 to keep R1 pure.
 * Declared here so R1 has no I/O imports.
 */
export type ComposeDeps = {
  /** Returns current epoch ms. R2 supplies; R1 calls deterministically per evaluation. */
  epochNow: () => EpochMs
  /** Mints a fresh ResearchId. R2 supplies; R1 calls once per composition. */
  mintResearchId: () => ResearchId
}

// ─── Aggregation rule label (singleton at v1.0 per RA5 + spec §3.9) ──────────

const AGGREGATION_BASIS_V1: ResearchAggregationKindLiteral =
  'all-resolved-with-vacuous-closure-on-empty-leaves'

type ResearchAggregationKindLiteral =
  'all-resolved-with-vacuous-closure-on-empty-leaves'

// ─── Research version (authoring-program-computed per spec §2.2) ─────────────
// At Sprint 5 close: every fresh emission stamps version '1.0.0' (no
// re-research chain yet). Re-research version logic lands when the first
// downstream amend cycle requires it (parallel to F-verify
// INITIAL_VERIFICATION_VERSION + F-plan nextPlanVersion which is L0-pending
// per D-PA5-VERSIONING).

const INITIAL_RESEARCH_VERSION = '1.0.0' as Semver

// ─── Leaf-question id resolution (RA3 rootSet rule) ──────────────────────────

/**
 * Compute leaf-question id set per RA3:
 *   leafQuestionIds = subQuestions[rootQuestionId] ∪ rootSet(methodKind)
 *
 * where rootSet(methodKind) = {rootQuestionId} when methodKind ∈
 * {'lookup', 'derivation', 'synthesis'}, else ∅.
 *
 * Pure. Mechanical. Used by composeResearch + run-research-gates.
 */
export function leafQuestionIds(
  rootQuestionId: QuestionId,
  subQuestions:   { [parentId: string]: QuestionId[] },
  methodKind:     InvestigationMethodKind,
): QuestionId[] {
  const subs = subQuestions[rootQuestionId as string] ?? []
  if (
    methodKind === 'lookup' ||
    methodKind === 'derivation' ||
    methodKind === 'synthesis'
  ) {
    // Root-as-leaf: rootSet = {rootQuestionId}.
    // Union with subs (preserve order: root first, then subs minus duplicates).
    const seen = new Set<string>()
    const out: QuestionId[] = []
    seen.add(rootQuestionId as string)
    out.push(rootQuestionId)
    for (const q of subs) {
      const key = q as string
      if (!seen.has(key)) {
        seen.add(key)
        out.push(q)
      }
    }
    return out
  }
  // methodKind === 'decomposition': rootSet = ∅. Only sub-questions are leaves.
  // De-duplicate while preserving order.
  const seen = new Set<string>()
  const out: QuestionId[] = []
  for (const q of subs) {
    const key = q as string
    if (!seen.has(key)) {
      seen.add(key)
      out.push(q)
    }
  }
  return out
}

// ─── Closure derivation (RA5 mechanical) ─────────────────────────────────────

/**
 * Derive closure aggregation per RA5 (§3.6).
 *
 * RA5 mechanical:
 *   - 'closed' iff (findings empty AND aggregationBasis declares
 *     vacuous-closure AND openQuestions = []) OR
 *     (every lid in keys(findings) satisfies findings[lid].truthValue ===
 *     'resolved' AND findings[lid].applicability === 'applicable' AND
 *     openQuestions = [])
 *   - 'open' iff every lid satisfies findings[lid].truthValue === 'unresolved'
 *     OR findings[lid].executionState === 'not-yet-investigated'
 *   - 'partial' iff some leaf is resolved AND some is unresolved or
 *     not-yet-investigated
 *   - null iff any findings[lid].executionState === 'not-yet-investigated'
 *     AND no lid has truthValue === 'resolved'
 *
 * `unresolvedQuestionIds` is the subset of leaf-question ids whose
 * truthValue !== 'resolved'.
 *
 * Pure. Total. Used by composeResearch + gateRS5.
 */
export function deriveClosure(findings: FindingResultMap): ResearchClosure {
  const ids = Object.keys(findings) as QuestionId[]

  // Empty findings: vacuous-closure per substrate §6.3 cardinality semantics.
  if (ids.length === 0) {
    return {
      truthValue:            'closed',
      aggregationBasis:      AGGREGATION_BASIS_V1,
      unresolvedQuestionIds: [],
    }
  }

  let anyResolved = false
  let anyUnresolved = false
  let anyNotYetInvestigated = false
  const unresolvedQuestionIds: QuestionId[] = []
  let allResolvedAndApplicable = true

  for (const id of ids) {
    const f = findings[id as string]
    if (f.executionState === 'not-yet-investigated') {
      anyNotYetInvestigated = true
      unresolvedQuestionIds.push(id)
      allResolvedAndApplicable = false
      continue
    }
    if (f.truthValue === 'resolved') {
      anyResolved = true
      if (f.applicability !== 'applicable') {
        // Resolved but n/a — counts as resolved for unresolvedQuestionIds
        // membership, but breaks the 'all-resolved-AND-applicable' branch.
        // RA5's all-resolved branch requires applicability='applicable'.
        allResolvedAndApplicable = false
      }
      continue
    }
    if (f.truthValue === 'unresolved') {
      anyUnresolved = true
      unresolvedQuestionIds.push(id)
      allResolvedAndApplicable = false
      continue
    }
    // Other shapes (truthValue === null with executionState !== 'not-yet-investigated')
    // are gate violations — composer treats as unresolved for closure purposes;
    // gateRS3 will catch the shape error.
    unresolvedQuestionIds.push(id)
    allResolvedAndApplicable = false
  }

  // 'closed' branch: every leaf resolved-and-applicable AND no unresolved set.
  if (allResolvedAndApplicable && unresolvedQuestionIds.length === 0) {
    return {
      truthValue:            'closed',
      aggregationBasis:      AGGREGATION_BASIS_V1,
      unresolvedQuestionIds: [],
    }
  }

  // 'null' branch: all-pre-execution AND none resolved.
  if (anyNotYetInvestigated && !anyResolved && !anyUnresolved) {
    // Every leaf is not-yet-investigated.
    return {
      truthValue:            null,
      aggregationBasis:      AGGREGATION_BASIS_V1,
      unresolvedQuestionIds,
    }
  }

  // 'open' branch: every leaf unresolved OR not-yet-investigated; none
  // resolved.
  if (!anyResolved && (anyUnresolved || anyNotYetInvestigated)) {
    return {
      truthValue:            'open',
      aggregationBasis:      AGGREGATION_BASIS_V1,
      unresolvedQuestionIds,
    }
  }

  // 'partial' branch: some resolved AND some not.
  return {
    truthValue:            'partial',
    aggregationBasis:      AGGREGATION_BASIS_V1,
    unresolvedQuestionIds,
  }
}

// ─── openQuestions derivation (RA5 supports) ─────────────────────────────────

/**
 * Compute openQuestions list — leaf ids whose truthValue !== 'resolved' OR
 * executionState === 'not-yet-investigated'. Pure helper for composer.
 *
 * Used to populate ResearchArtifactContent.openQuestions which RA5 references
 * at the closure derivation predicate.
 */
function deriveOpenQuestions(findings: FindingResultMap): QuestionId[] {
  const out: QuestionId[] = []
  for (const id of Object.keys(findings)) {
    const f = findings[id]
    if (
      f.executionState === 'not-yet-investigated' ||
      f.truthValue !== 'resolved'
    ) {
      out.push(id as QuestionId)
    }
  }
  return out
}

// ─── Compose (pure) ──────────────────────────────────────────────────────────

/**
 * composeResearch — pure transformation ResearchInput → ResearchArtifactContent.
 *
 * Steps (mechanical, no I/O):
 *   1. Mint researchId (caller-injected mintResearchId).
 *   2. Capture producedAt + per-question capturedAt + per-finding investigatedAt
 *      timestamps (caller-injected epochNow).
 *   3. Verbatim-carry binding (RA6), question (RA9), priorKnowledge (RA10),
 *      authoringProgram (RA6).
 *   4. Build a one-step decomposition tree per RA2:
 *        - rootQuestionId = input.question.questionId
 *        - subQuestions = { [rootQuestionId]: [] } at the composer default
 *          (consumer-owned recursive descent per §1 scopeOut)
 *      Authoring programs that supply a non-empty subQuestions tree must
 *      construct ResearchArtifactContent directly, bypassing this composer
 *      default.
 *   5. Resolve methodKind from input.binding.investigationMethods via
 *      input.question.decompositionPolicy lookup (RA6 reference resolution).
 *   6. Compute leafQuestionIds per RA3 rootSet rule.
 *   7. Build a placeholder FindingResultMap with one not-yet-investigated
 *      entry per leaf id. Resolved-content findings are caller-supplied —
 *      authoring programs that produce 'resolved' findings construct
 *      ResearchArtifactContent directly, mirroring F-verify's caller-supplied
 *      evidence pattern.
 *   8. Derive closure per RA5 → 'open' or null per the not-yet-investigated
 *      default; openQuestions populated accordingly.
 *
 * Output is a candidate ResearchArtifactContent — caller applies G-RS1..G-RS10
 * before AS emission (run-research-gates.ts).
 *
 * Determinism: same input + same deps (same epochNow / same mintResearchId
 * outputs) produce the same content. Time + id sources are caller-injected to
 * keep R1 pure.
 *
 * If the input.question.decompositionPolicy does not resolve in
 * binding.investigationMethods, composer emits with methodKind='decomposition'
 * default; gateRS6 catches the resolution miss with RA6 reference-resolution
 * failure.
 */
export function composeResearch(
  researchInput:           ResearchInput,
  deps:                    ComposeDeps,
  authoringProgramVersion: Semver,
): ResearchArtifactContent {
  const researchId       = deps.mintResearchId()
  const producedAt       = deps.epochNow()
  const questionCapturedAt = deps.epochNow()

  // RA9 verbatim-carry triple + capturedAt emission-time snapshot.
  const question: ResearchQuestionContent = {
    questionId:          researchInput.question.questionId,
    questionText:        researchInput.question.questionText,
    decompositionPolicy: researchInput.question.decompositionPolicy,
    capturedAt:          questionCapturedAt,
  }

  // RA2 one-step decomposition tree.
  // Composer default: empty subQuestions for the root. Callers needing
  // populated sub-questions construct ResearchArtifactContent directly per
  // the architecture note above.
  const decomposition: DecompositionTree = {
    rootQuestionId: researchInput.question.questionId,
    subQuestions: {
      [researchInput.question.questionId as string]: [],
    },
  }

  // RA6 reference resolution: methodKind from binding.investigationMethods.
  // If decompositionPolicy does not resolve, default to 'decomposition'
  // methodKind for leafQuestionIds computation; gateRS6 will catch the
  // unresolved policy.
  const methodKind = resolveMethodKind(
    researchInput.binding,
    researchInput.question.decompositionPolicy,
  )

  // RA3 leaf id set.
  const leafIds = leafQuestionIds(
    researchInput.question.questionId,
    decomposition.subQuestions,
    methodKind,
  )

  // RA3 placeholder findings: one not-yet-investigated entry per leaf.
  const findings: FindingResultMap = {}
  for (const leafId of leafIds) {
    const investigatedAt = deps.epochNow()
    const entry: FindingResultEntry = {
      findingRef:      leafId,
      truthValue:      null,
      executionState:  'not-yet-investigated',
      applicability:   'applicable',
      basis:           null,
      resolvedContent: null,
      sourceRefs:      [],
      failureDetail:   null,
      investigatedAt,
    }
    findings[leafId as string] = entry
  }

  // RA5 supports.
  const openQuestions = deriveOpenQuestions(findings)
  const closure       = deriveClosure(findings)

  return {
    researchId,
    researchVersion: INITIAL_RESEARCH_VERSION,
    producedBy: {
      programId:      researchInput.authoringProgram.programId,
      programVersion: authoringProgramVersion,
    },
    producedAt,
    binding:         researchInput.binding,                        // RA6 verbatim
    question,                                                      // RA9 verbatim + capturedAt
    priorKnowledge:  researchInput.priorKnowledge,                 // RA10 verbatim (byte-identical reference)
    decomposition,                                                 // RA2 one-step
    findings,                                                      // RA3 one-to-one with rootSet ∪ subs
    openQuestions,                                                 // RA5 support
    sources: {},                                                   // RA4 empty at composer default; resolved-content callers populate
    closure,                                                       // RA5 derived
  }
}

// ─── Helpers (pure, file-local) ──────────────────────────────────────────────

/**
 * Resolve methodKind from binding.investigationMethods via decompositionPolicy.
 * Returns 'decomposition' as the safe default if no method matches — this
 * keeps composer total (never throws) while allowing gateRS6 to catch the
 * RA6 reference-resolution failure at the validity boundary.
 */
function resolveMethodKind(
  binding: ResearchBinding,
  policy:  string,
): InvestigationMethodKind {
  for (const m of binding.investigationMethods) {
    if (m.methodId === policy) return m.methodKind
  }
  return 'decomposition'
}

// ─── ID generation helper (default mintResearchId; R2 may override) ──────────
// Exposed for default DI at R2; R0 depends on primitives.ts which is core/R5.

import type { ResearchId as ResearchIdAtom } from '../config/f-discover-types'
export function defaultMintResearchId(): ResearchIdAtom {
  return generateId('rs') as ResearchIdAtom
}

// ─── End of compose-research.ts ─────────────────────────────────────────────
