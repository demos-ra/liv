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
//   W-ATOM  ResearchValidityError                   ←  F-discover/R0
//   W-ATOM  Result                                  ←  core/R5 primitives
//   W-FN    leafQuestionIds, deriveClosure          ←  F-discover/R1 compose-research (intra-layer)
// wires-out:
//   W-FN    runResearchGates  →  F-discover/R2 execute-research
//   W-FN    gateRS1           →  F-discover/R2 (pre-compose short-circuit)
// deps:
//   R0 ../config/f-discover-types
//   R1 ./compose-research
//   R5 ../../../core/types/primitives
// validated:  pending
//
// F-discover R1 — pure gate evaluator.
//
// A4: zero I/O. Pure function. Domain logic only.
//
// Input  : { researchInput, content (composed) }
// Output : Result<void, ResearchValidityError> with code RESEARCH_VALIDITY_FAILED
//          + failedAxiom on first gate fail (fail-fast, mechanical).
//
// Evaluates G-RS1..G-RS10 (spec §4.2) in 1:1 correspondence with RA1..RA10.
// Fail-fast on first gate fail. Pre-AS-emission validity gating, parallel to
// F-verify/domain/run-verification-gates.ts pattern.
//
// Gate execution order per spec §4.5:
//   1. G-RS1  (input shape — must precede content-derived gates)
//   2. G-RS2  (decomposition shape — depends on content)
//   3. G-RS3  (findings decomposition — depends on content.decomposition + content.findings)
//   4. G-RS9  (question capture — depends on content.question + input.question)
//   5. G-RS10 (priorKnowledge capture — depends on content.priorKnowledge + input.priorKnowledge)
//   6. G-RS4  (source grounding — depends on content.findings + content.sources + binding.sourceCriteria)
//   7. G-RS5  (closure aggregation — depends on G-RS3 result well-formedness + findings)
//   8. G-RS6  (binding resolution — depends on content.binding + content.question.decompositionPolicy)
//   9. G-RS7  (immutability — vacuous pre-emission per AS v2.2 ArA5 boundary)
//  10. G-RS8  (self-application — depends on full content well-formedness)

import type { Result } from '@/core/types/primitives'
import type {
  ResearchInput,
  ResearchArtifactContent,
  ResearchValidityError,
  GroundingClass,
  SourceKind,
  InvestigationMethodKind,
  QuestionId,
} from '../config/f-discover-types'
import { leafQuestionIds, deriveClosure } from './compose-research'

// ─── Ground-class enum (substrate §6.3 six-class taxonomy) ───────────────────

const GROUND_CLASSES: ReadonlySet<GroundingClass> = new Set<GroundingClass>([
  'type-check',
  'enum-membership',
  'reference-resolution',
  'structural-property',
  'cardinality',
  'deterministic-function-result',
])

const SOURCE_KINDS: ReadonlySet<SourceKind> = new Set<SourceKind>([
  'graph-node',
  'external-uri',
  'authoring-input',
])

const METHOD_KINDS: ReadonlySet<InvestigationMethodKind> = new Set<InvestigationMethodKind>([
  'decomposition',
  'lookup',
  'derivation',
  'synthesis',
])

// ─── Semver shape check ──────────────────────────────────────────────────────

const SEMVER_RE = /^\d+\.\d+\.\d+([-+][0-9A-Za-z.-]+)?$/

function isSemver(v: unknown): boolean {
  return typeof v === 'string' && SEMVER_RE.test(v)
}

// ─── Gate result error builder ───────────────────────────────────────────────

function gateFail(
  failedAxiom: string,
  detail:      string,
): Result<void, ResearchValidityError> {
  return {
    ok: false,
    error: {
      code:    'RESEARCH_VALIDITY_FAILED',
      message: `[${failedAxiom}] ${detail}`,
      failedAxiom,
      context: { failedAxiom, detail },
    },
  }
}

const OK: Result<void, ResearchValidityError> = { ok: true, data: undefined }

// ─── G-RS1 (RA1: input shape conformance) ────────────────────────────────────

export function gateRS1(input: ResearchInput): Result<void, ResearchValidityError> {
  if (typeof input !== 'object' || input === null)              return gateFail('RA1', 'input is not an object')
  if (typeof input.authoringProgram !== 'object' || input.authoringProgram === null) return gateFail('RA1', 'input.authoringProgram missing')
  if (typeof input.authoringProgram.programId !== 'string')     return gateFail('RA1', 'input.authoringProgram.programId not a string')
  if (!isSemver(input.authoringProgram.programVersion))         return gateFail('RA1', 'input.authoringProgram.programVersion not a Semver')
  if (typeof input.userId !== 'string')                         return gateFail('RA1', 'input.userId not a string')
  if (typeof input.turnId !== 'string')                         return gateFail('RA1', 'input.turnId not a string')

  // binding shape
  if (typeof input.binding !== 'object' || input.binding === null) return gateFail('RA1', 'input.binding missing')
  if (typeof input.binding.domainId !== 'string')               return gateFail('RA1', 'input.binding.domainId not a string')
  if (!isSemver(input.binding.domainVersion))                   return gateFail('RA1', 'input.binding.domainVersion not a Semver')
  if (!Array.isArray(input.binding.investigationMethods))       return gateFail('RA1', 'input.binding.investigationMethods not an array')
  if (typeof input.binding.questionSchema !== 'object' || input.binding.questionSchema === null) return gateFail('RA1', 'input.binding.questionSchema missing')
  if (typeof input.binding.knowledgeSchema !== 'object' || input.binding.knowledgeSchema === null) return gateFail('RA1', 'input.binding.knowledgeSchema missing')
  if (!Array.isArray(input.binding.sourceCriteria))             return gateFail('RA1', 'input.binding.sourceCriteria not an array')
  if (typeof input.binding.failsafes !== 'object' || input.binding.failsafes === null) return gateFail('RA1', 'input.binding.failsafes missing')

  // question shape
  if (typeof input.question !== 'object' || input.question === null) return gateFail('RA1', 'input.question missing')
  if (typeof input.question.questionId !== 'string')            return gateFail('RA1', 'input.question.questionId not a string')
  if (typeof input.question.questionText !== 'string')          return gateFail('RA1', 'input.question.questionText not a string')
  if (input.question.questionText.length < 1)                   return gateFail('RA1', 'input.question.questionText must have length ≥ 1')
  if (typeof input.question.decompositionPolicy !== 'string')   return gateFail('RA1', 'input.question.decompositionPolicy not a string')

  // priorKnowledge shape (RA10 typed-shape conformance also validated at gateRS10)
  if (typeof input.priorKnowledge !== 'object' || input.priorKnowledge === null) return gateFail('RA1', 'input.priorKnowledge missing')
  if (!Array.isArray(input.priorKnowledge.artifactRefs))        return gateFail('RA1', 'input.priorKnowledge.artifactRefs not an array')
  for (const ref of input.priorKnowledge.artifactRefs) {
    if (typeof ref !== 'string')                                return gateFail('RA1', 'input.priorKnowledge.artifactRefs contains non-string entry')
  }
  if (input.priorKnowledge.scopeBoundary !== null) {
    if (typeof input.priorKnowledge.scopeBoundary !== 'object' || input.priorKnowledge.scopeBoundary === null) {
      return gateFail('RA1', 'input.priorKnowledge.scopeBoundary not null and not an object')
    }
    if (typeof input.priorKnowledge.scopeBoundary.kind !== 'string') return gateFail('RA1', 'input.priorKnowledge.scopeBoundary.kind not a string')
    if (typeof input.priorKnowledge.scopeBoundary.ref !== 'string')  return gateFail('RA1', 'input.priorKnowledge.scopeBoundary.ref not a string')
  }
  return OK
}

// ─── G-RS2 (RA2: decomposition shape) ────────────────────────────────────────

export function gateRS2(content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  if (typeof content.decomposition !== 'object' || content.decomposition === null) return gateFail('RA2', 'content.decomposition missing')
  if (typeof content.decomposition.rootQuestionId !== 'string') return gateFail('RA2', 'content.decomposition.rootQuestionId not a string')
  if (typeof content.decomposition.subQuestions !== 'object' || content.decomposition.subQuestions === null) {
    return gateFail('RA2', 'content.decomposition.subQuestions missing')
  }

  // Tree depth = 1 at v1.0: subQuestions has at most one entry, keyed by rootQuestionId.
  const subKeys = Object.keys(content.decomposition.subQuestions)
  if (subKeys.length > 1) {
    return gateFail('RA2', `decomposition.subQuestions has ${subKeys.length} keys; depth=1 invariant requires at most one entry keyed by rootQuestionId`)
  }
  if (subKeys.length === 1 && subKeys[0] !== content.decomposition.rootQuestionId) {
    return gateFail('RA2', `decomposition.subQuestions sole key '${subKeys[0]}' !== rootQuestionId '${content.decomposition.rootQuestionId}'`)
  }

  // Resolve methodKind from binding.investigationMethods via decompositionPolicy.
  const policy = content.question.decompositionPolicy
  const method = content.binding.investigationMethods.find(m => m.methodId === policy)
  // gateRS6 owns RA6 reference-resolution; if unresolved here, defer to gateRS6.
  // For RA2 we need the methodKind only when present.
  if (method !== undefined) {
    if (!METHOD_KINDS.has(method.methodKind)) {
      return gateFail('RA2', `investigationMethod '${method.methodId}' methodKind='${String(method.methodKind)}' not in {decomposition, lookup, derivation, synthesis}`)
    }
    // When methodKind === 'decomposition': subQuestions[rootQuestionId] must be non-empty.
    if (method.methodKind === 'decomposition') {
      const subs = content.decomposition.subQuestions[content.decomposition.rootQuestionId as string]
      if (!Array.isArray(subs) || subs.length === 0) {
        return gateFail('RA2', `methodKind='decomposition' requires non-empty subQuestions[rootQuestionId]`)
      }
    }
  }

  // Pairwise unique sub-question ids within the tree.
  const seen = new Set<string>()
  for (const k of subKeys) {
    const subs = content.decomposition.subQuestions[k]
    if (!Array.isArray(subs)) return gateFail('RA2', `decomposition.subQuestions['${k}'] not an array`)
    for (const sq of subs) {
      if (typeof sq !== 'string') return gateFail('RA2', `decomposition.subQuestions['${k}'] contains non-string entry`)
      if (seen.has(sq as string)) return gateFail('RA2', `decomposition contains duplicate sub-question id '${sq}'`)
      seen.add(sq as string)
    }
  }

  // Each sub-question conforms to typed shape per binding.questionSchema:
  // shapeRef opaque to RS at type surface; v1.0 mechanical check is shapeRef is
  // a non-empty string.
  if (typeof content.binding.questionSchema.shapeRef !== 'string') return gateFail('RA2', 'binding.questionSchema.shapeRef not a string')
  if (content.binding.questionSchema.shapeRef.length === 0)        return gateFail('RA2', 'binding.questionSchema.shapeRef empty')

  return OK
}

// ─── G-RS3 (RA3: findings decomposition + per-entry shape) ───────────────────

export function gateRS3(content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  // Resolve methodKind for rootSet rule.
  const policy = content.question.decompositionPolicy
  const method = content.binding.investigationMethods.find(m => m.methodId === policy)
  // If unresolved, gateRS6 owns the failure; here we cannot compute leaves.
  // Skip with a deferred OK; gateRS6 will catch RA6 violation.
  if (method === undefined) return OK

  const expected = leafQuestionIds(
    content.decomposition.rootQuestionId,
    content.decomposition.subQuestions,
    method.methodKind,
  )
  const expectedSet = new Set(expected.map(x => x as string))
  const actualSet   = new Set(Object.keys(content.findings))

  if (expectedSet.size !== actualSet.size) {
    return gateFail('RA3', `findings cardinality (${actualSet.size}) != leaf-id cardinality (${expectedSet.size}) per rootSet ∪ subQuestions[rootQuestionId]`)
  }
  for (const id of expectedSet) {
    if (!actualSet.has(id)) return gateFail('RA3', `findings missing entry for leaf-question id '${id}'`)
  }
  for (const id of actualSet) {
    if (!expectedSet.has(id)) return gateFail('RA3', `findings has extraneous entry for id '${id}' (not in rootSet ∪ subQuestions)`)
  }

  // Per-entry shape.
  for (const id of actualSet) {
    const f = content.findings[id]
    if (typeof f !== 'object' || f === null)                      return gateFail('RA3', `findings['${id}'] not an object`)
    if (f.findingRef !== id)                                      return gateFail('RA3', `findings['${id}'].findingRef !== '${id}'`)
    if (!(f.truthValue === 'resolved' || f.truthValue === 'unresolved' || f.truthValue === null)) {
      return gateFail('RA3', `findings['${id}'].truthValue not in {'resolved','unresolved',null}`)
    }
    if (!(f.executionState === 'not-yet-investigated' || f.executionState === 'investigated')) {
      return gateFail('RA3', `findings['${id}'].executionState not in {'not-yet-investigated','investigated'}`)
    }
    if (!(f.applicability === 'applicable' || f.applicability === 'n/a')) {
      return gateFail('RA3', `findings['${id}'].applicability not in {'applicable','n/a'}`)
    }
    // (executionState === 'not-yet-investigated') === (truthValue === null) per S4.
    if ((f.executionState === 'not-yet-investigated') !== (f.truthValue === null)) {
      return gateFail('RA3', `findings['${id}']: (executionState==='not-yet-investigated') must equal (truthValue===null) per substrate §10.1 S4`)
    }
    // basis non-null when applicability='n/a' per MA-V11.
    if (f.applicability === 'n/a' && (f.basis === null || f.basis.length === 0)) {
      return gateFail('RA3', `findings['${id}'] applicability='n/a' but basis null/empty (MA-V11)`)
    }
    // resolvedContent non-null when truthValue='resolved'.
    if (f.truthValue === 'resolved' && f.resolvedContent === null) {
      return gateFail('RA3', `findings['${id}'] truthValue='resolved' but resolvedContent null`)
    }
    // sourceRefs non-empty when truthValue='resolved'.
    if (f.truthValue === 'resolved' && (!Array.isArray(f.sourceRefs) || f.sourceRefs.length === 0)) {
      return gateFail('RA3', `findings['${id}'] truthValue='resolved' but sourceRefs empty (resolved findings must be grounded per RA4)`)
    }
    if (!Array.isArray(f.sourceRefs)) return gateFail('RA3', `findings['${id}'].sourceRefs not an array`)
    for (const sr of f.sourceRefs) {
      if (typeof sr !== 'object' || sr === null)                  return gateFail('RA3', `findings['${id}'].sourceRefs contains non-object entry`)
      if (typeof sr.citationId !== 'string')                      return gateFail('RA3', `findings['${id}'].sourceRefs entry.citationId not a string`)
    }
    // failureDetail non-null when truthValue='unresolved'.
    if (f.truthValue === 'unresolved' && f.failureDetail === null) {
      return gateFail('RA3', `findings['${id}'] truthValue='unresolved' but failureDetail null`)
    }
    if (typeof f.investigatedAt !== 'number')                     return gateFail('RA3', `findings['${id}'].investigatedAt not a number`)
  }
  return OK
}

// ─── G-RS4 (RA4: source grounding + multi-source closure) ────────────────────

export function gateRS4(content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  // Every sourceRefs[*].citationId resolves to an entry in content.sources.
  const citationIds = new Set(Object.keys(content.sources))
  for (const lid of Object.keys(content.findings)) {
    const f = content.findings[lid]
    for (const sr of f.sourceRefs) {
      if (!citationIds.has(sr.citationId as string)) {
        return gateFail('RA4', `findings['${lid}'].sourceRefs citationId '${sr.citationId}' does not resolve into content.sources`)
      }
    }
  }

  // Every entry in content.sources has populated fields per §2.2.
  // Pre-compute admitted source kinds intersection (binding.sourceCriteria.sourceKindAllowed union).
  const admittedKinds = new Set<SourceKind>()
  for (const sc of content.binding.sourceCriteria) {
    for (const k of sc.sourceKindAllowed) {
      admittedKinds.add(k)
    }
  }

  for (const cid of citationIds) {
    const c = content.sources[cid]
    if (typeof c !== 'object' || c === null)                      return gateFail('RA4', `sources['${cid}'] not an object`)
    if (c.citationId !== cid)                                     return gateFail('RA4', `sources['${cid}'].citationId !== '${cid}'`)
    if (!SOURCE_KINDS.has(c.sourceKind))                          return gateFail('RA4', `sources['${cid}'].sourceKind='${String(c.sourceKind)}' not in {graph-node, external-uri, authoring-input}`)
    if (!admittedKinds.has(c.sourceKind))                         return gateFail('RA4', `sources['${cid}'].sourceKind='${c.sourceKind}' not admitted by any binding.sourceCriteria.sourceKindAllowed`)
    if (typeof c.reference !== 'string')                          return gateFail('RA4', `sources['${cid}'].reference not a string`)
    if (typeof c.capturedAt !== 'number')                         return gateFail('RA4', `sources['${cid}'].capturedAt not a number`)
  }

  // Every binding.sourceCriteria[c].groundingClass ∈ substrate §6.3 six-class enum.
  for (const sc of content.binding.sourceCriteria) {
    if (!GROUND_CLASSES.has(sc.groundingClass)) {
      return gateFail('RA4', `binding.sourceCriteria '${sc.criterionId}' groundingClass='${String(sc.groundingClass)}' not in substrate §6.3 six-class enum`)
    }
    for (const k of sc.sourceKindAllowed) {
      if (!SOURCE_KINDS.has(k)) {
        return gateFail('RA4', `binding.sourceCriteria '${sc.criterionId}' sourceKindAllowed contains '${String(k)}' not in {graph-node, external-uri, authoring-input}`)
      }
    }
  }

  // Every resolved finding has ≥1 sourceRef (covered by gateRS3, retained for
  // RA4 surface coherence — fast-path returns OK because gateRS3 already
  // guarantees this when reached).
  return OK
}

// ─── G-RS5 (RA5: closure derivation correctness) ─────────────────────────────

export function gateRS5(content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  const derived = deriveClosure(content.findings)

  if (content.closure.truthValue !== derived.truthValue) {
    return gateFail('RA5', `closure.truthValue ('${String(content.closure.truthValue)}') does not match derived ('${String(derived.truthValue)}')`)
  }
  if (typeof content.closure.aggregationBasis !== 'string' || content.closure.aggregationBasis.length === 0) {
    return gateFail('RA5', 'closure.aggregationBasis missing or empty')
  }

  // unresolvedQuestionIds: equal-set with derived.
  const a = new Set(content.closure.unresolvedQuestionIds.map(x => x as string))
  const b = new Set(derived.unresolvedQuestionIds.map(x => x as string))
  if (a.size !== b.size) return gateFail('RA5', `closure.unresolvedQuestionIds size (${a.size}) != derived (${b.size})`)
  for (const id of a) if (!b.has(id)) return gateFail('RA5', `closure.unresolvedQuestionIds has extraneous '${id}'`)
  for (const id of b) if (!a.has(id)) return gateFail('RA5', `closure.unresolvedQuestionIds missing '${id}'`)

  // openQuestions consistency: equal-set with unresolvedQuestionIds (same
  // semantics — leaves not yet resolved).
  const oq = new Set(content.openQuestions.map(x => x as string))
  if (oq.size !== a.size) return gateFail('RA5', `openQuestions size (${oq.size}) != unresolvedQuestionIds (${a.size})`)
  for (const id of oq) if (!a.has(id)) return gateFail('RA5', `openQuestions has extraneous '${id}' (not in unresolvedQuestionIds)`)

  return OK
}

// ─── G-RS6 (RA6: binding verbatim + decompositionPolicy resolution + closure) ─

export function gateRS6(
  input:   ResearchInput,
  content: ResearchArtifactContent,
): Result<void, ResearchValidityError> {
  // Verbatim equality: reference-equal is mechanical proxy at v1.0.
  if (content.binding !== input.binding) return gateFail('RA6', 'content.binding not byte-identical to input.binding (verbatim-carry violation)')

  // decompositionPolicy resolves into binding.investigationMethods.
  const policy = content.question.decompositionPolicy
  const method = content.binding.investigationMethods.find(m => m.methodId === policy)
  if (method === undefined) {
    return gateFail('RA6', `content.question.decompositionPolicy '${policy}' does not resolve into binding.investigationMethods`)
  }

  // Every binding.sourceCriteria[c].sourceKindAllowed[*] ∈ admitted enum.
  for (const sc of content.binding.sourceCriteria) {
    for (const k of sc.sourceKindAllowed) {
      if (!SOURCE_KINDS.has(k)) {
        return gateFail('RA6', `binding.sourceCriteria '${sc.criterionId}' sourceKindAllowed contains '${String(k)}' not in {graph-node, external-uri, authoring-input}`)
      }
    }
  }

  // Every failsafe value is an object (multi-source closure scope: failsafe
  // keys reference within binding.failsafes; v1.0 mechanical check is
  // structural shape).
  for (const k of Object.keys(content.binding.failsafes)) {
    const v = content.binding.failsafes[k]
    if (typeof v !== 'object' || v === null) return gateFail('RA6', `binding.failsafes['${k}'] is not an object`)
  }
  return OK
}

// ─── G-RS7 (RA7: immutability propagated from AS v2.2 ArA5) ──────────────────
//
// Spec §3.6 RA7 + §6.11 boundary note: RA7 immutability is enforced at AS v2.2
// ArA5 at the companion node (which holds the full ResearchArtifactContent
// payload). AS v2.2 ArA5 is the mechanical enforcer; RA7 is declared at RS
// level because it scopes the invariant at RS's domain.
//
// At pre-AS-emission (where this gate runs), there is no persisted content
// yet — mutation rejection cannot be exercised. Gate semantics at v1.0:
// vacuous-pass at pre-emission, with the invariant carrier flagged for the
// runtime caller.
//
// Pattern parallel: F-verify gateVS8 + F-plan PA9 (immutability post-emission,
// AS v2.2 ArA5 enforcer).

export function gateRS7(_content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  // Vacuous-pass at pre-emission. AS v2.2 ArA5 is the mechanical enforcer
  // post-emission. See spec §6.11 boundary note + Sprint 5 D-RS-RA7-PREEMISSION.
  return OK
}

// ─── G-RS8 (RA8: one-step self-application closure) ──────────────────────────
//
// Spec §3.6 RA8 + §6.11 boundary note: RA8 declares one-step closure. A
// well-formed ResearchArtifactContent R is a valid ResearchInput
// priorKnowledge.artifactRefs source for re-research with
// priorKnowledge.artifactRefs ⊇ [ref(R)]; R'' may reference R-derived findings
// as priorKnowledge inputs.
//
// Mechanical check at v1.0:
//   - Re-input synthesis: V'_input.priorKnowledge.artifactRefs = [content.researchId-as-NodeId-cast].
//     researchId is a branded string; the cast to NodeId is the mechanical
//     placeholder for "well-formed reference into priorKnowledge surface."
//   - V'_input must satisfy RA1 / G-RS1 (re-input-shape conformance). If R is
//     well-formed, this holds by construction.
//   - One-step closure terminates: gateRS8 is never invoked recursively at v1.0
//     (consumer-owned descent per §1 scopeOut).

export function gateRS8(content: ResearchArtifactContent): Result<void, ResearchValidityError> {
  // Synthesize a notional re-input shape from content. Mechanical: the inner
  // content R serves as a priorKnowledge artifactRef source for its
  // re-research; the question is a synthesized follow-up.
  //
  // We do NOT actually invoke RS again here (one-step closure is structural,
  // not procedural) — we just confirm a re-input with priorKnowledge
  // referencing R is shape-valid as an RS input source per RA1.
  const reinputCandidate: ResearchInput = {
    authoringProgram: { programId: content.producedBy.programId, programVersion: content.producedBy.programVersion },
    userId:           '__reinput_synthesis__',
    turnId:           '__reinput_synthesis__',
    binding:          content.binding,
    question: {
      questionId:          ('q-reinput-' + (content.researchId as string)) as QuestionId,
      questionText:        '__reinput_synthesis_followup__',
      decompositionPolicy: content.question.decompositionPolicy,
    },
    priorKnowledge: {
      artifactRefs:  [content.researchId as unknown as ResearchInput['priorKnowledge']['artifactRefs'][number]],
      scopeBoundary: null,
    },
  }

  const r = gateRS1(reinputCandidate)
  if (!r.ok) {
    return gateFail('RA8', `synthesized re-input fails RA1: ${r.error.message}`)
  }
  return OK
}

// ─── G-RS9 (RA9: question verbatim-carry triple + non-null capturedAt) ───────

export function gateRS9(
  input:   ResearchInput,
  content: ResearchArtifactContent,
): Result<void, ResearchValidityError> {
  if (content.question.questionId !== input.question.questionId)             return gateFail('RA9', 'content.question.questionId !== input.question.questionId (verbatim-carry)')
  if (content.question.questionText !== input.question.questionText)         return gateFail('RA9', 'content.question.questionText !== input.question.questionText (verbatim-carry)')
  if (content.question.decompositionPolicy !== input.question.decompositionPolicy) return gateFail('RA9', 'content.question.decompositionPolicy !== input.question.decompositionPolicy (verbatim-carry)')
  if (typeof content.question.capturedAt !== 'number')                       return gateFail('RA9', 'content.question.capturedAt not a number')
  if (content.question.capturedAt <= 0)                                       return gateFail('RA9', 'content.question.capturedAt must be > 0')
  return OK
}

// ─── G-RS10 (RA10: priorKnowledge byte-identity verbatim-carry + typed shape) ─

export function gateRS10(
  input:   ResearchInput,
  content: ResearchArtifactContent,
): Result<void, ResearchValidityError> {
  // Byte-identity: reference-equal is mechanical proxy at v1.0.
  if (content.priorKnowledge !== input.priorKnowledge) return gateFail('RA10', 'content.priorKnowledge not byte-identical to input.priorKnowledge (verbatim-carry violation)')

  // Typed shape conformance.
  if (!Array.isArray(content.priorKnowledge.artifactRefs)) return gateFail('RA10', 'content.priorKnowledge.artifactRefs not an array')
  for (const ref of content.priorKnowledge.artifactRefs) {
    if (typeof ref !== 'string') return gateFail('RA10', 'content.priorKnowledge.artifactRefs contains non-string entry')
  }
  if (content.priorKnowledge.scopeBoundary !== null) {
    if (typeof content.priorKnowledge.scopeBoundary !== 'object' || content.priorKnowledge.scopeBoundary === null) {
      return gateFail('RA10', 'content.priorKnowledge.scopeBoundary not null and not an object')
    }
    if (typeof content.priorKnowledge.scopeBoundary.kind !== 'string') return gateFail('RA10', 'content.priorKnowledge.scopeBoundary.kind not a string')
    if (typeof content.priorKnowledge.scopeBoundary.ref !== 'string')  return gateFail('RA10', 'content.priorKnowledge.scopeBoundary.ref not a string')
  }
  return OK
}

// ─── runResearchGates — fail-fast G-RS1..G-RS10 over (input, content) ────────

/**
 * Run G-RS1..G-RS10 in order per spec §4.5. Fail-fast. First gate fail
 * short-circuits and returns ResearchValidityError with code=
 * 'RESEARCH_VALIDITY_FAILED' + failedAxiom set to the failing RA-id.
 *
 * Order rationale (spec §4.5):
 *   - G-RS1  input-shape (must precede content-derived gates)
 *   - G-RS2  decomposition-shape (depends on content + binding)
 *   - G-RS3  findings-shape (depends on content.decomposition + content.findings)
 *   - G-RS9  question-capture (depends on content.question + input.question)
 *   - G-RS10 priorKnowledge-capture (depends on content.priorKnowledge + input.priorKnowledge)
 *   - G-RS4  source-grounding (depends on content.findings + content.sources + binding.sourceCriteria)
 *   - G-RS5  closure-aggregation (depends on G-RS3 result well-formedness + findings)
 *   - G-RS6  binding-resolution (depends on content.binding + content.question.decompositionPolicy)
 *   - G-RS7  immutability (vacuous pre-emission per spec §6.11 note)
 *   - G-RS8  self-application (depends on full content well-formedness)
 *
 * Caller (R2) maps Result.error to ResearchEmissionResult.
 */
export function runResearchGates(
  input:   ResearchInput,
  content: ResearchArtifactContent,
): Result<void, ResearchValidityError> {
  const r1  = gateRS1(input);                  if (!r1.ok)  return r1
  const r2  = gateRS2(content);                if (!r2.ok)  return r2
  const r3  = gateRS3(content);                if (!r3.ok)  return r3
  const r9  = gateRS9(input, content);         if (!r9.ok)  return r9
  const r10 = gateRS10(input, content);        if (!r10.ok) return r10
  const r4  = gateRS4(content);                if (!r4.ok)  return r4
  const r5  = gateRS5(content);                if (!r5.ok)  return r5
  const r6  = gateRS6(input, content);         if (!r6.ok)  return r6
  const r7  = gateRS7(content);                if (!r7.ok)  return r7
  const r8  = gateRS8(content);                if (!r8.ok)  return r8
  return OK
}

// ─── End of run-research-gates.ts ───────────────────────────────────────────
