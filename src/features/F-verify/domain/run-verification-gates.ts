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
//   W-ATOM  VerificationValidityError, VerificationVerdict  ←  F-verify/R0
//   W-ATOM  Result                                          ←  core/R5 primitives
//   W-FN    resolveEvidencePath, deriveVerdict              ←  F-verify/R1 compose-verification (intra-layer)
// wires-out:
//   W-FN    runVerificationGates  →  F-verify/R2 execute-verification
// deps:
//   R0 ../config/f-verify-types
//   R1 ./compose-verification
//   R5 ../../../core/types/primitives
// validated:  pending
//
// F-verify R1 — pure gate evaluator.
//
// A4: zero I/O. Pure function. Domain logic only.
//
// Input  : { verificationInput, content (composed) }
// Output : Result<void, VerificationValidityError> with code VERIFICATION_VALIDITY_FAILED
//          + failedAxiom on first gate fail (fail-fast, mechanical).
//
// Evaluates G-VS1..G-VS9 (spec §4.2) in 1:1 correspondence with VA1..VA9.
// Fail-fast on first gate fail. Pre-AS-emission validity gating, parallel to
// F-plan/domain/plan-validate.ts pattern.

import type { Result } from '@/core/types/primitives'
import type {
  VerificationInput,
  VerificationArtifactContent,
  VerificationValidityError,
  PredicateGroundClass,
  VerificationPredicate,
} from '../config/f-verify-types'
import { resolveEvidencePath, UNRESOLVED, deriveVerdict } from './compose-verification'

// ─── Ground-class enum (substrate §6.3 six-class taxonomy) ───────────────────

const GROUND_CLASSES: ReadonlySet<PredicateGroundClass> = new Set<PredicateGroundClass>([
  'type-check',
  'enum-membership',
  'reference-resolution',
  'structural-property',
  'cardinality',
  'deterministic-function-result',
])

// ─── Semver shape check ──────────────────────────────────────────────────────
// Loose matcher: digits.digits.digits with optional pre-release tag. Sufficient
// for v1.0 mechanical class; substrate §6.3 structural-property class.

const SEMVER_RE = /^\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$/

function isSemver(v: unknown): boolean {
  return typeof v === 'string' && SEMVER_RE.test(v)
}

// ─── Gate result error builder ───────────────────────────────────────────────

function gateFail(
  failedAxiom: string,
  detail: string,
): Result<void, VerificationValidityError> {
  return {
    ok: false,
    error: {
      code:    'VERIFICATION_VALIDITY_FAILED',
      message: `[${failedAxiom}] ${detail}`,
      failedAxiom,
      context: { failedAxiom, detail },
    },
  }
}

const OK: Result<void, VerificationValidityError> = { ok: true, data: undefined }

// ─── G-VS1 (VA1: input shape conformance) ────────────────────────────────────

export function gateVS1(input: VerificationInput): Result<void, VerificationValidityError> {
  if (typeof input !== 'object' || input === null)              return gateFail('VA1', 'input is not an object')
  if (typeof input.authoringProgram !== 'object' || input.authoringProgram === null) return gateFail('VA1', 'input.authoringProgram missing')
  if (typeof input.authoringProgram.programId !== 'string')     return gateFail('VA1', 'input.authoringProgram.programId not a string')
  if (!isSemver(input.authoringProgram.programVersion))         return gateFail('VA1', 'input.authoringProgram.programVersion not a Semver')
  if (typeof input.userId !== 'string')                         return gateFail('VA1', 'input.userId not a string')
  if (typeof input.turnId !== 'string')                         return gateFail('VA1', 'input.turnId not a string')
  if (typeof input.binding !== 'object' || input.binding === null) return gateFail('VA1', 'input.binding missing')
  if (typeof input.binding.domainId !== 'string')               return gateFail('VA1', 'input.binding.domainId not a string')
  if (!isSemver(input.binding.domainVersion))                   return gateFail('VA1', 'input.binding.domainVersion not a Semver')
  if (!Array.isArray(input.binding.predicateSet))               return gateFail('VA1', 'input.binding.predicateSet not an array')
  if (typeof input.binding.evidenceSchema !== 'object' || input.binding.evidenceSchema === null) return gateFail('VA1', 'input.binding.evidenceSchema missing')
  if (typeof input.binding.failsafes !== 'object' || input.binding.failsafes === null) return gateFail('VA1', 'input.binding.failsafes missing')
  if (typeof input.target !== 'object' || input.target === null) return gateFail('VA1', 'input.target missing')
  if (typeof input.target.artifactRef !== 'string')             return gateFail('VA1', 'input.target.artifactRef not a string (NodeId)')
  if (typeof input.target.artifactKind !== 'string')            return gateFail('VA1', 'input.target.artifactKind not a string')
  if (input.evidence === undefined)                             return gateFail('VA1', 'input.evidence is undefined')
  if (input.preverifyInputs === undefined)                      return gateFail('VA1', 'input.preverifyInputs is undefined')
  return OK
}

// ─── G-VS2 (VA2: predicate set well-formedness) ──────────────────────────────

export function gateVS2(content: VerificationArtifactContent): Result<void, VerificationValidityError> {
  for (const p of content.binding.predicateSet) {
    if (typeof p !== 'object' || p === null)                   return gateFail('VA2', 'predicate is not an object')
    if (typeof p.predicateId !== 'string' || p.predicateId.length === 0) return gateFail('VA2', `predicate.predicateId missing or empty`)
    if (!GROUND_CLASSES.has(p.groundClass))                    return gateFail('VA2', `predicate '${p.predicateId}' groundClass='${String(p.groundClass)}' not in substrate §6.3 six-class enum`)
    if (typeof p.evidencePath !== 'string')                    return gateFail('VA2', `predicate '${p.predicateId}' evidencePath not a string`)

    // resolvePath check: evidencePath must resolve in evidence W-ATOM.
    const resolved = resolveEvidencePath(p.evidencePath, content.evidence)
    if (resolved === UNRESOLVED)                               return gateFail('VA2', `predicate '${p.predicateId}' evidencePath '${p.evidencePath}' does not resolve`)

    // expectedValue groundClass-specific shape.
    const shapeErr = validateExpectedShape(p)
    if (shapeErr !== null)                                     return gateFail('VA2', `predicate '${p.predicateId}' ${shapeErr}`)

    if (typeof p.failureSurface !== 'string' || p.failureSurface.length === 0) return gateFail('VA2', `predicate '${p.predicateId}' failureSurface missing or empty`)
  }
  return OK
}

function validateExpectedShape(p: VerificationPredicate): string | null {
  switch (p.groundClass) {
    case 'type-check':
      return typeof p.expectedValue === 'string'
        ? null
        : `expectedValue must be a typeof literal string for groundClass='type-check' (got ${typeof p.expectedValue})`
    case 'enum-membership':
      return Array.isArray(p.expectedValue)
        ? null
        : `expectedValue must be an array for groundClass='enum-membership'`
    case 'reference-resolution':
      // reference-resolution: any value at expectedValue is permitted; the
      // semantic check happens at evaluation time. Shape gate is permissive.
      return null
    case 'structural-property':
      // any value (the comparison target). Shape gate permissive.
      return null
    case 'cardinality':
      return typeof p.expectedValue === 'number'
        ? null
        : `expectedValue must be a number for groundClass='cardinality'`
    case 'deterministic-function-result':
      return null
    default: {
      const _exhaustive: never = p.groundClass
      void _exhaustive
      return `groundClass not in enum`
    }
  }
}

// ─── G-VS3 (VA3: evidence verbatim + schema conformance) ─────────────────────

export function gateVS3(
  input:   VerificationInput,
  content: VerificationArtifactContent,
): Result<void, VerificationValidityError> {
  // Verbatim carry: byte-identical (reference-equality is the in-memory mechanical proxy).
  if (content.evidence !== input.evidence) return gateFail('VA3', 'content.evidence not byte-identical to input.evidence (verbatim-carry violation)')

  // Schema conformance: at v1.0 evidenceSchema declares `shapeRef: string` only.
  // The schema itself is opaque to VS at the type surface; conformance is
  // domain-supplied. v1.0 mechanical check: evidenceSchema.shapeRef is a
  // non-empty string; richer per-shape conformance is the binding's failsafes
  // domain (VA6 closure).
  if (typeof content.binding.evidenceSchema.shapeRef !== 'string') return gateFail('VA3', 'content.binding.evidenceSchema.shapeRef not a string')
  if (content.binding.evidenceSchema.shapeRef.length === 0)        return gateFail('VA3', 'content.binding.evidenceSchema.shapeRef empty')
  return OK
}

// ─── G-VS4 (VA4: predicateResults set-equality + per-entry shape) ────────────

export function gateVS4(content: VerificationArtifactContent): Result<void, VerificationValidityError> {
  const predicateIds = new Set(content.binding.predicateSet.map(p => p.predicateId as string))
  const resultIds    = new Set(Object.keys(content.predicateResults))

  if (predicateIds.size !== resultIds.size)                return gateFail('VA4', `predicateResults cardinality (${resultIds.size}) != binding.predicateSet cardinality (${predicateIds.size})`)
  for (const id of predicateIds) {
    if (!resultIds.has(id))                                return gateFail('VA4', `predicateResults missing entry for predicateId '${id}'`)
  }
  for (const id of resultIds) {
    if (!predicateIds.has(id))                             return gateFail('VA4', `predicateResults has extraneous entry for predicateId '${id}' (not in binding.predicateSet)`)
  }

  for (const id of resultIds) {
    const r = content.predicateResults[id]
    if (r.predicateRef !== id)                             return gateFail('VA4', `predicateResults['${id}'].predicateRef !== '${id}'`)
    if (!(r.truthValue === 'passed' || r.truthValue === 'failed' || r.truthValue === null)) return gateFail('VA4', `predicateResults['${id}'].truthValue not in {'passed','failed',null}`)
    if (!(r.executionState === 'not-yet-run' || r.executionState === 'executed')) return gateFail('VA4', `predicateResults['${id}'].executionState not in {'not-yet-run','executed'}`)
    if (!(r.applicability === 'applicable' || r.applicability === 'n/a')) return gateFail('VA4', `predicateResults['${id}'].applicability not in {'applicable','n/a'}`)

    // (executionState === 'not-yet-run') === (truthValue === null) per S4 + MA-V11.
    if ((r.executionState === 'not-yet-run') !== (r.truthValue === null)) {
      return gateFail('VA4', `predicateResults['${id}']: (executionState==='not-yet-run') must equal (truthValue===null) per S4`)
    }

    // basis non-null when applicability='n/a' per MA-V11.
    if (r.applicability === 'n/a' && (r.basis === null || r.basis.length === 0)) {
      return gateFail('VA4', `predicateResults['${id}'] applicability='n/a' but basis null/empty (MA-V11)`)
    }

    // failureDetail non-null when truthValue='failed'.
    if (r.truthValue === 'failed' && r.failureDetail === null) {
      return gateFail('VA4', `predicateResults['${id}'] truthValue='failed' but failureDetail null`)
    }

    if (typeof r.evaluatedAt !== 'number')                 return gateFail('VA4', `predicateResults['${id}'].evaluatedAt not a number`)
  }
  return OK
}

// ─── G-VS5 (VA5: verdict derivation correctness) ─────────────────────────────

export function gateVS5(content: VerificationArtifactContent): Result<void, VerificationValidityError> {
  const derived = deriveVerdict(content.predicateResults)

  if (content.verdict.truthValue !== derived.truthValue) {
    return gateFail('VA5', `verdict.truthValue ('${String(content.verdict.truthValue)}') does not match derived ('${String(derived.truthValue)}')`)
  }
  if (typeof content.verdict.aggregationBasis !== 'string' || content.verdict.aggregationBasis.length === 0) {
    return gateFail('VA5', 'verdict.aggregationBasis missing or empty')
  }

  // failedPredicateIds: when truthValue='failed', equal-set with derived.
  if (content.verdict.truthValue === 'failed') {
    const a = new Set(content.verdict.failedPredicateIds.map(x => x as string))
    const b = new Set(derived.failedPredicateIds.map(x => x as string))
    if (a.size !== b.size) return gateFail('VA5', `verdict.failedPredicateIds size (${a.size}) != derived (${b.size})`)
    for (const id of a) if (!b.has(id)) return gateFail('VA5', `verdict.failedPredicateIds has extraneous '${id}'`)
    for (const id of b) if (!a.has(id)) return gateFail('VA5', `verdict.failedPredicateIds missing '${id}'`)
  } else {
    // when truthValue !== 'failed', failedPredicateIds must be empty.
    if (content.verdict.failedPredicateIds.length !== 0) {
      return gateFail('VA5', `verdict.failedPredicateIds non-empty but truthValue='${String(content.verdict.truthValue)}'`)
    }
  }
  return OK
}

// ─── G-VS6 (VA6: binding verbatim + multi-source closure) ────────────────────

export function gateVS6(
  input:   VerificationInput,
  content: VerificationArtifactContent,
): Result<void, VerificationValidityError> {
  // Verbatim equality: reference-equal is mechanical proxy at v1.0.
  if (content.binding !== input.binding) return gateFail('VA6', 'content.binding not byte-identical to input.binding (verbatim-carry violation)')

  // Every predicateResults id resolves into binding.predicateSet.
  const predicateIds = new Set(content.binding.predicateSet.map(p => p.predicateId as string))
  for (const id of Object.keys(content.predicateResults)) {
    if (!predicateIds.has(id)) return gateFail('VA6', `predicateResults['${id}'] does not resolve to a VerificationPredicate in binding.predicateSet`)
  }

  // Every binding.predicateSet[*].evidencePath resolves into content.evidence.
  for (const p of content.binding.predicateSet) {
    const resolved = resolveEvidencePath(p.evidencePath, content.evidence)
    if (resolved === UNRESOLVED) return gateFail('VA6', `binding.predicateSet predicate '${p.predicateId}' evidencePath '${p.evidencePath}' does not resolve in content.evidence`)
  }

  // Every failsafe value is an object (multi-source closure scope: failsafe
  // keys reference within binding.failsafes; v1.0 mechanical check is
  // structural shape).
  for (const k of Object.keys(content.binding.failsafes)) {
    const v = content.binding.failsafes[k]
    if (typeof v !== 'object' || v === null) return gateFail('VA6', `binding.failsafes['${k}'] is not an object`)
  }
  return OK
}

// ─── G-VS7 (VA7: target verbatim + non-null capturedAt) ──────────────────────

export function gateVS7(
  input:   VerificationInput,
  content: VerificationArtifactContent,
): Result<void, VerificationValidityError> {
  if (content.target.artifactRef !== input.target.artifactRef)   return gateFail('VA7', 'content.target.artifactRef !== input.target.artifactRef (verbatim-carry)')
  if (content.target.artifactKind !== input.target.artifactKind) return gateFail('VA7', 'content.target.artifactKind !== input.target.artifactKind (verbatim-carry)')
  if (typeof content.target.capturedAt !== 'number')             return gateFail('VA7', 'content.target.capturedAt not a number')
  if (content.target.capturedAt <= 0)                            return gateFail('VA7', 'content.target.capturedAt must be > 0')
  return OK
}

// ─── G-VS8 (VA8: immutability propagated from AS v2.2 ArA5) ──────────────────
//
// Spec §3.6 VA8 + §6.11 boundary note: VA8 immutability is enforced at AS v2.2
// ArA5 at the companion node (which holds the full VerificationArtifactContent
// payload). AS v2.2 ArA5 is the mechanical enforcer; VA8 is declared at VS
// level because it scopes the invariant at VS's domain.
//
// At pre-AS-emission (where this gate runs), there is no persisted content
// yet — mutation rejection cannot be exercised. Gate semantics at v1.0:
// vacuous-pass at pre-emission, with the invariant carrier flagged for the
// runtime caller.
//
// Pattern parallel: F-plan PA9 (immutability post-emission, AS v2.2 ArA5
// enforcer) — F-plan does not run a runtime mutation-rejection probe at
// pre-emission either.

export function gateVS8(_content: VerificationArtifactContent): Result<void, VerificationValidityError> {
  // Vacuous-pass at pre-emission. AS v2.2 ArA5 is the mechanical enforcer
  // post-emission. See spec §6.11 boundary note.
  return OK
}

// ─── G-VS9 (VA9: one-step self-application closure) ──────────────────────────
//
// Spec §3.6 VA9 + §6.11 boundary note: VA9 declares one-step closure. A
// well-formed VerificationArtifactContent V is a valid VerificationInput
// source for re-verification with target.artifactKind='verification' and
// evidence=V; the re-verification produces V'' verifying V's well-formedness.
//
// Mechanical check at v1.0:
//   - Re-input synthesis: V → V'_input where V'_input.target.artifactRef =
//     verificationId-as-NodeId-cast (mechanical placeholder), V'_input.evidence = V.
//   - V'_input must satisfy VA1 / G-VS1 (re-input-shape conformance). If V is
//     well-formed, this holds by construction.
//   - One-step closure terminates: gateVS9 is never invoked recursively at v1.0
//     (consumer-owned descent per §1 scopeOut).

export function gateVS9(content: VerificationArtifactContent): Result<void, VerificationValidityError> {
  // Synthesize a notional re-input shape from content. Mechanical: the inner
  // content V serves as evidence to its re-verification; the verification id
  // serves as artifactRef.
  //
  // We do NOT actually invoke VS again here (one-step closure is structural,
  // not procedural) — we just confirm V is shape-valid as a re-input source.
  const reinputCandidate: VerificationInput = {
    authoringProgram: { programId: content.producedBy.programId, programVersion: content.producedBy.programVersion },
    userId:           '__reinput_synthesis__',
    turnId:           '__reinput_synthesis__',
    binding:          content.binding,
    target: {
      artifactRef:    content.verificationId as unknown as VerificationInput['target']['artifactRef'],
      artifactKind:   'verification',
    },
    evidence:         content,
    preverifyInputs:  null,
  }

  const r = gateVS1(reinputCandidate)
  if (!r.ok) {
    return gateFail('VA9', `synthesized re-input fails VA1: ${r.error.message}`)
  }
  return OK
}

// ─── runVerificationGates — fail-fast G-VS1..G-VS9 over (input, content) ─────

/**
 * Run G-VS1..G-VS9 in order. Fail-fast. First gate fail short-circuits and
 * returns VerificationValidityError with code='VERIFICATION_VALIDITY_FAILED'
 * + failedAxiom set to the failing VA-id.
 *
 * Order rationale (spec §4.2):
 *   - G-VS1 input-shape (must precede content-derived gates)
 *   - G-VS2 predicate-set (depends on content.binding + content.evidence)
 *   - G-VS3 evidence-verbatim + schema (depends on content.evidence)
 *   - G-VS4 results-shape (depends on content.predicateResults)
 *   - G-VS5 verdict-derivation (depends on G-VS4 result well-formedness)
 *   - G-VS6 binding-verbatim + closure (depends on content.binding)
 *   - G-VS7 target-verbatim (depends on content.target)
 *   - G-VS8 immutability (vacuous pre-emission per spec §6.11 note)
 *   - G-VS9 self-application (depends on full content well-formedness)
 *
 * Caller (R2) maps Result.error to VerificationEmissionResult.
 */
export function runVerificationGates(
  input:   VerificationInput,
  content: VerificationArtifactContent,
): Result<void, VerificationValidityError> {
  const r1 = gateVS1(input);                      if (!r1.ok) return r1
  const r2 = gateVS2(content);                    if (!r2.ok) return r2
  const r3 = gateVS3(input, content);             if (!r3.ok) return r3
  const r4 = gateVS4(content);                    if (!r4.ok) return r4
  const r5 = gateVS5(content);                    if (!r5.ok) return r5
  const r6 = gateVS6(input, content);             if (!r6.ok) return r6
  const r7 = gateVS7(input, content);             if (!r7.ok) return r7
  const r8 = gateVS8(content);                    if (!r8.ok) return r8
  const r9 = gateVS9(content);                    if (!r9.ok) return r9
  return OK
}

// ─── End of run-verification-gates.ts ───────────────────────────────────────
