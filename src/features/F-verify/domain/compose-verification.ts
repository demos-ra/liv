// @liv-standard v1.5.1
// [F-verify/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-4-vs (slice introduction)
// slice:      F-verify
// layer:      R1
// wires-in:
//   W-ATOM  VerificationInput, VerificationArtifactContent  ←  F-verify/R0
//   W-ATOM  VerificationPredicate, PredicateResultMap       ←  F-verify/R0
//   W-ATOM  PredicateGroundClass, VerificationVerdict       ←  F-verify/R0
//   W-ATOM  Semver, generateId                              ←  core/R5 primitives
// wires-out:
//   W-FN    composeVerification  →  F-verify/R2 execute-verification
//   W-FN    resolveEvidencePath  →  F-verify/R1 run-verification-gates (intra-layer)
//   W-FN    evaluatePredicate    →  F-verify/R1 run-verification-gates (intra-layer)
// deps:
//   R0 ../config/f-verify-types
//   R5 ../../../core/types/primitives
// validated:  pending
//
// F-verify R1 — pure verification composer.
//
// A4: zero I/O. Pure function. Domain logic only.
// Input  : { verificationInput, classification, runtimeNow }
// Output : composed VerificationArtifactContent (pre-gate; gates run separately at R1).
//
// Discipline (parallel to F-plan/domain/plan-compose.ts):
//   - composeVerification is total: never throws. Composes the full content
//     including predicateResults (mechanical evaluation of binding.predicateSet
//     against evidence) and the derived verdict per VA5.
//   - Mechanical predicate evaluation per substrate §6.3 six-class taxonomy.
//     Each VerificationPredicate evaluated in isolation; results land in
//     PredicateResultMap. No predicate's evaluation depends on another's.
//   - Verdict derivation is mechanical per VA5 (§3.6 + §2.2 atomicity note).
//   - Validity gating (G-VS1..G-VS9) is the caller's R1 sibling concern
//     (run-verification-gates.ts) — composeVerification produces; run gates
//     verifies. Separation of concerns.

import { generateId } from '@/core/types/primitives'
import type { Semver } from '@/core/types/primitives'
import type {
  VerificationInput,
  VerificationArtifactContent,
  VerificationPredicate,
  PredicateResultEntry,
  PredicateResultMap,
  VerificationVerdict,
  PredicateGroundClass,
  VerificationId,
  EpochMs,
  PredicateId,
} from '../config/f-verify-types'

// ─── Compose deps (injected at R2) ───────────────────────────────────────────

/**
 * Runtime time source. Injected at R2 to keep R1 pure.
 * Declared here so R1 has no I/O imports.
 */
export type ComposeDeps = {
  /** Returns current epoch ms. R2 supplies; R1 calls deterministically per evaluation. */
  epochNow: () => EpochMs
  /** Mints a fresh VerificationId. R2 supplies; R1 calls once per composition. */
  mintVerificationId: () => VerificationId
}

// ─── Aggregation rule label (singleton at v1.0 per VA5 + spec §3.9) ──────────

const AGGREGATION_BASIS_V1: VerificationAggregationKindLiteral =
  'all-must-pass-with-vacuous-pass-on-empty'

type VerificationAggregationKindLiteral = 'all-must-pass-with-vacuous-pass-on-empty'

// ─── Verification version (authoring-program-computed per spec §2.2) ────────
// At Sprint 4 close: every fresh emission stamps version '1.0.0' (no
// re-verification chain yet). Re-verification version logic lands when the
// first downstream amend cycle requires it (parallel to F-plan
// nextPlanVersion which is L0-pending per D-PA5-VERSIONING).

const INITIAL_VERIFICATION_VERSION = '1.0.0' as Semver

// ─── Evidence-path resolver (mechanical, per substrate §6.3) ─────────────────

/**
 * Resolve a dot-separated evidence path against the evidence W-ATOM.
 *
 * Mechanical per substrate §6.3 reference-resolution class:
 *   - empty path (length === 0) returns the whole evidence value
 *   - each segment is read as a property name on the current value
 *   - any segment that misses (undefined parent, non-object parent, missing key)
 *     returns the symbolic UNRESOLVED marker
 *
 * Discipline: never throws. Returns either the resolved value or UNRESOLVED.
 * Symbol used as marker so undefined evidence values can be distinguished from
 * unresolvable paths.
 */
export const UNRESOLVED: unique symbol = Symbol('VS_UNRESOLVED_EVIDENCE_PATH')
export type Unresolved = typeof UNRESOLVED

export function resolveEvidencePath(path: string, evidence: unknown): unknown | Unresolved {
  if (path.length === 0) return evidence

  const segments = path.split('.')
  let cursor: unknown = evidence

  for (const segment of segments) {
    if (cursor === null || cursor === undefined) return UNRESOLVED
    if (typeof cursor !== 'object') return UNRESOLVED

    // Object property read. Index signature accepts arbitrary keys at type level;
    // runtime check above guards against null/undefined/primitive.
    const next = (cursor as Record<string, unknown>)[segment]
    if (next === undefined && !(segment in (cursor as Record<string, unknown>))) {
      return UNRESOLVED
    }
    cursor = next
  }

  return cursor
}

// ─── Predicate evaluation (mechanical, per substrate §6.3 + VA2) ─────────────

/**
 * Evaluate one predicate against the evidence W-ATOM.
 *
 * Returns a PredicateResultEntry with executionState='executed'.
 * Mechanical per substrate §6.3 six-class taxonomy:
 *   - 'type-check'                    → typeof resolved === expectedValue (string literal)
 *   - 'enum-membership'               → expectedValue (unknown[]) includes resolved
 *   - 'reference-resolution'          → resolved !== UNRESOLVED (path resolves)
 *                                       expectedValue is the resolver descriptor
 *                                       (compared by identity to resolved when
 *                                        non-symbol-string at expectedValue site)
 *   - 'structural-property'           → deep-strict-equal(resolved, expectedValue)
 *   - 'cardinality'                   → length(resolved) === expectedValue (number)
 *   - 'deterministic-function-result' → deep-strict-equal(resolved, expectedValue)
 *
 * No predicate's evaluation depends on another's. Composition order is
 * irrelevant. PredicateGroundClass not in the six-class enum → fail with
 * basis citing VA2.
 */
export function evaluatePredicate(
  predicate: VerificationPredicate,
  evidence:  unknown,
  evaluatedAt: EpochMs,
): PredicateResultEntry {
  const resolved = resolveEvidencePath(predicate.evidencePath, evidence)

  // Reference-resolution check first: if the path doesn't resolve, that is the
  // failure for any groundClass that depends on the resolved value.
  // 'reference-resolution' class: success IS path resolution.
  if (predicate.groundClass === 'reference-resolution') {
    if (resolved === UNRESOLVED) {
      return {
        predicateRef:   predicate.predicateId,
        truthValue:     'failed',
        executionState: 'executed',
        applicability:  'applicable',
        basis:          null,
        failureDetail:  `evidencePath '${predicate.evidencePath}' did not resolve in evidence W-ATOM`,
        evaluatedAt,
      }
    }
    // Path resolves. If expectedValue is a string descriptor, compare by
    // identity to resolved value (substrate §6.3 reference-resolution semantics).
    // If expectedValue is not a string, treat path-resolution-only as success.
    const ok = typeof predicate.expectedValue !== 'string'
      ? true
      : resolved === predicate.expectedValue
    return makeEvaluated(predicate, resolved, ok, evaluatedAt)
  }

  // For all other classes: UNRESOLVED is a fail.
  if (resolved === UNRESOLVED) {
    return {
      predicateRef:   predicate.predicateId,
      truthValue:     'failed',
      executionState: 'executed',
      applicability:  'applicable',
      basis:          null,
      failureDetail:  `evidencePath '${predicate.evidencePath}' did not resolve in evidence W-ATOM`,
      evaluatedAt,
    }
  }

  switch (predicate.groundClass) {
    case 'type-check': {
      // expectedValue : string typeof literal (e.g., 'string', 'number', 'object')
      const expected = predicate.expectedValue
      if (typeof expected !== 'string') {
        return makeEvaluated(predicate, resolved, false, evaluatedAt,
          `expectedValue must be a typeof literal string for groundClass='type-check'; got ${typeof expected}`)
      }
      const ok = typeof resolved === expected
      return makeEvaluated(predicate, resolved, ok, evaluatedAt)
    }

    case 'enum-membership': {
      // expectedValue : unknown[] of allowed values
      const expected = predicate.expectedValue
      if (!Array.isArray(expected)) {
        return makeEvaluated(predicate, resolved, false, evaluatedAt,
          `expectedValue must be an array of allowed values for groundClass='enum-membership'`)
      }
      const ok = expected.some(v => deepStrictEqual(v, resolved))
      return makeEvaluated(predicate, resolved, ok, evaluatedAt)
    }

    case 'structural-property': {
      // expectedValue : property-shape descriptor or literal value
      const ok = deepStrictEqual(resolved, predicate.expectedValue)
      return makeEvaluated(predicate, resolved, ok, evaluatedAt)
    }

    case 'cardinality': {
      // expectedValue : number (expected length / count)
      const expected = predicate.expectedValue
      if (typeof expected !== 'number') {
        return makeEvaluated(predicate, resolved, false, evaluatedAt,
          `expectedValue must be a number for groundClass='cardinality'; got ${typeof expected}`)
      }
      // Length resolved on Array, string, or object-with-length / object-key-count.
      const len = lengthOf(resolved)
      if (len === null) {
        return makeEvaluated(predicate, resolved, false, evaluatedAt,
          `resolved evidence has no measurable length for groundClass='cardinality'`)
      }
      const ok = len === expected
      return makeEvaluated(predicate, resolved, ok, evaluatedAt)
    }

    case 'deterministic-function-result': {
      // expectedValue : expected return value; resolved is the produced value.
      const ok = deepStrictEqual(resolved, predicate.expectedValue)
      return makeEvaluated(predicate, resolved, ok, evaluatedAt)
    }

    default: {
      // Exhaustive: PredicateGroundClass enum closed at substrate §6.3.
      // Reaching here means binding declared an out-of-enum groundClass —
      // VA2/G-VS2 will catch this at gate time. We mark the entry failed with
      // a basis pointing at VA2.
      const _exhaustive: never = predicate.groundClass
      void _exhaustive
      return makeEvaluated(
        predicate,
        resolved,
        false,
        evaluatedAt,
        `groundClass not in substrate §6.3 six-class enum (VA2 violation): '${String(predicate.groundClass)}'`,
      )
    }
  }
}

function makeEvaluated(
  predicate: VerificationPredicate,
  _resolved: unknown,
  ok: boolean,
  evaluatedAt: EpochMs,
  failureDetailOverride?: string,
): PredicateResultEntry {
  if (ok) {
    return {
      predicateRef:   predicate.predicateId,
      truthValue:     'passed',
      executionState: 'executed',
      applicability:  'applicable',
      basis:          null,
      failureDetail:  null,
      evaluatedAt,
    }
  }
  return {
    predicateRef:   predicate.predicateId,
    truthValue:     'failed',
    executionState: 'executed',
    applicability:  'applicable',
    basis:          null,
    failureDetail:  failureDetailOverride ?? predicate.failureSurface,
    evaluatedAt,
  }
}

// ─── Verdict derivation (per VA5) ────────────────────────────────────────────

/**
 * Derive verdict from predicateResults per VA5 all-must-pass rule.
 *
 * §3.6 VA5 mechanical condition:
 *   - 'verified' iff (results empty AND aggregationBasis declares vacuous-pass)
 *     OR (∀ pid: results[pid].truthValue === 'passed'
 *         AND results[pid].applicability === 'applicable')
 *   - 'failed' iff ∃ pid: results[pid].truthValue === 'failed';
 *     failedPredicateIds populated as that subset
 *   - null iff ∃ pid: results[pid].executionState === 'not-yet-run'
 */
export function deriveVerdict(predicateResults: PredicateResultMap): VerificationVerdict {
  const ids = Object.keys(predicateResults) as PredicateId[]

  // Empty set: vacuous-pass per substrate §6.3 cardinality semantics.
  if (ids.length === 0) {
    return {
      truthValue:         'verified',
      aggregationBasis:   AGGREGATION_BASIS_V1,
      failedPredicateIds: [],
    }
  }

  const failedIds: PredicateId[] = []
  let anyNotYetRun = false

  for (const id of ids) {
    const r = predicateResults[id]
    if (r.executionState === 'not-yet-run') {
      anyNotYetRun = true
      continue
    }
    if (r.truthValue === 'failed') {
      failedIds.push(id)
      continue
    }
  }

  if (failedIds.length > 0) {
    return {
      truthValue:         'failed',
      aggregationBasis:   AGGREGATION_BASIS_V1,
      failedPredicateIds: failedIds,
    }
  }

  if (anyNotYetRun) {
    return {
      truthValue:         null,
      aggregationBasis:   AGGREGATION_BASIS_V1,
      failedPredicateIds: [],
    }
  }

  // All executed, none failed: verified iff every entry is applicable + passed.
  const allApplicableAndPassed = ids.every(id => {
    const r = predicateResults[id]
    return r.executionState === 'executed'
        && r.applicability === 'applicable'
        && r.truthValue === 'passed'
  })

  if (allApplicableAndPassed) {
    return {
      truthValue:         'verified',
      aggregationBasis:   AGGREGATION_BASIS_V1,
      failedPredicateIds: [],
    }
  }

  // Edge: every entry executed + non-failing, but some non-applicable. v1.0
  // ruling: applicability='n/a' entries are not counted toward the
  // all-must-pass test — they vacuous-pass. If we got here with no failures
  // and no not-yet-run, the verdict is verified. Treat as such.
  return {
    truthValue:         'verified',
    aggregationBasis:   AGGREGATION_BASIS_V1,
    failedPredicateIds: [],
  }
}

// ─── Compose (pure) ──────────────────────────────────────────────────────────

/**
 * composeVerification — pure transformation VerificationInput → VerificationArtifactContent.
 *
 * Steps (mechanical, no I/O):
 *   1. Mint verificationId (caller-injected mintVerificationId).
 *   2. Capture producedAt + per-predicate evaluatedAt timestamps (caller-injected epochNow).
 *   3. Verbatim-carry binding, target.artifactRef, target.artifactKind, evidence
 *      (per VA3, VA6, VA7).
 *   4. Evaluate every predicate in binding.predicateSet against evidence per VA2.
 *      One result entry per predicate (VA4 set-equality).
 *   5. Derive verdict per VA5 all-must-pass rule.
 *
 * Output is a candidate VerificationArtifactContent — caller applies G-VS1..G-VS9
 * before AS emission (run-verification-gates.ts).
 *
 * Determinism: same input + same deps (same epochNow / same mintVerificationId
 * outputs) produce the same content. Time + id sources are caller-injected to
 * keep R1 pure.
 */
export function composeVerification(
  verificationInput: VerificationInput,
  deps:              ComposeDeps,
  authoringProgramVersion: Semver,
): VerificationArtifactContent {
  const verificationId = deps.mintVerificationId()
  const producedAt     = deps.epochNow()
  const targetCapturedAt = deps.epochNow()

  // VA4 mechanical decomposition: one entry per predicate in binding.predicateSet.
  const predicateResults: PredicateResultMap = {}
  for (const predicate of verificationInput.binding.predicateSet) {
    const evaluatedAt = deps.epochNow()
    predicateResults[predicate.predicateId] = evaluatePredicate(
      predicate,
      verificationInput.evidence,
      evaluatedAt,
    )
  }

  // VA5 derivation.
  const verdict = deriveVerdict(predicateResults)

  return {
    verificationId,
    verificationVersion: INITIAL_VERIFICATION_VERSION,
    producedBy: {
      programId:      verificationInput.authoringProgram.programId,
      programVersion: authoringProgramVersion,
    },
    producedAt,
    binding:  verificationInput.binding,                  // VA6 verbatim
    target: {
      artifactRef:  verificationInput.target.artifactRef,  // VA7 verbatim
      artifactKind: verificationInput.target.artifactKind, // VA7 verbatim
      capturedAt:   targetCapturedAt,                      // VA7 emission-time snapshot
    },
    evidence: verificationInput.evidence,                  // VA3 verbatim
    predicateResults,
    verdict,
  }
}

// ─── Helpers (pure, file-local) ──────────────────────────────────────────────

/**
 * Length of a value for cardinality predicate evaluation.
 * Returns null if the value has no defined length.
 *   - Array      → .length
 *   - string     → .length
 *   - object     → Object.keys(o).length
 *   - other      → null
 */
function lengthOf(v: unknown): number | null {
  if (Array.isArray(v))            return v.length
  if (typeof v === 'string')       return v.length
  if (v !== null && typeof v === 'object') return Object.keys(v as Record<string, unknown>).length
  return null
}

/**
 * Deep strict equality. Total over JSON-shaped values; does not handle
 * Date / Map / Set / RegExp / class instances at v1.0 (binding evidence
 * schemas are JSON-shaped per substrate §6.3 mechanical-criterion convention).
 */
function deepStrictEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepStrictEqual(a[i], b[i])) return false
    }
    return true
  }
  if (Array.isArray(b)) return false

  const ao = a as Record<string, unknown>
  const bo = b as Record<string, unknown>
  const ak = Object.keys(ao)
  const bk = Object.keys(bo)
  if (ak.length !== bk.length) return false
  for (const k of ak) {
    if (!Object.prototype.hasOwnProperty.call(bo, k)) return false
    if (!deepStrictEqual(ao[k], bo[k])) return false
  }
  return true
}

// ─── ID generation helper (default mintVerificationId; R2 may override) ──────
// Exposed for default DI at R2; R0 depends on primitives.ts which is core/R5.

import type { VerificationId as VerificationIdAtom } from '../config/f-verify-types'
export function defaultMintVerificationId(): VerificationIdAtom {
  return generateId('verif') as VerificationIdAtom
}

// ─── End of compose-verification.ts ─────────────────────────────────────────
