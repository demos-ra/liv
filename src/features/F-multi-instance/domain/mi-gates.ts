// @liv-standard v1.5.1
// [F-multi-instance/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R1
// wires-in:
//   W-ATOM  InstanceResult, SetViolation, RunReportContent,
//           MIGateResult, ErrorClass, InstanceTerminalState,
//           PlanArtifactContent, DomainBinding,
//           DeclId, TypedAtom                      ←  F-multi-instance/R0 mi-types
// wires-out:  consumed by F-multi-instance/R2 mi-execute (S2 stage)
// deps:
//   R0  ../types/mi-types
// validated:  pending
//
// F-multi-instance R1 — gate predicates.
// Pure. No I/O. Evaluates IA1–IA7c against an assembled RunReportContent +
// SetViolation[] + post-run state collected by S2.
//
// Gate definitions (multi-instance-standard.md §4.2 G-MI1..G-MI7c):
//
//   G-MI1 (IA1 — instance-terminality)
//     every instance has status ∈ {complete, failed, escalated}
//
//   G-MI2 (IA2 — binding immutability)
//     engine did not mutate plan.shape.declarations or plan.binding
//     S2 passes explicit mutation flag (see evaluateGmi2)
//
//   G-MI3 (IA3 — validateContract invariant)
//     for every instance with an output, validateContract(decl, output) === true
//     S2 passes pre-collected validation results (see evaluateGmi3)
//
//   G-MI4a (IA4a — post-breach retry suppression)
//     setViolations.length > 0 implies no retries attempted after breach
//
//   G-MI4b (IA4b — breach → failed/escalated)
//     setViolations.length > 0 implies outcome ∈ {failed, escalated}
//
//   G-MI5 (IA5 — no cascade failures)
//     unless topology/partialSuccess permits, downstream-of-failed not failed
//     by cascade. S2 passes cascade flag.
//
//   G-MI6 (IA6 — binding-resolved callsites)
//     every call routed through binding.* or engine-native; no external resolution.
//     S2 passes witness flag.
//
//   G-MI7a (IA7a — capacity-breach class is CLASS_2)
//     all capacity-breach errors have class === 'CLASS_2'
//
//   G-MI7b (IA7b — retry budget consumption)
//     per capacity breach: retry count increments by exactly 1
//     S2 passes per-breach retry deltas
//
//   G-MI7c (IA7c — no declaration rewrite post-breach)
//     engine did not rewrite any declaration after a capacity breach

import type {
  InstanceResult,
  SetViolation,
  RunReportContent,
  MIGateResult,
  InstanceTerminalState,
  DeclId,
} from '../types/mi-types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TERMINAL_STATES: ReadonlySet<InstanceTerminalState> = new Set<InstanceTerminalState>([
  'complete',
  'failed',
  'escalated',
])

function pass(gateId: MIGateResult['gateId'], testedAxiomId: MIGateResult['testedAxiomId']): MIGateResult {
  return {
    gateId,
    testedAxiomId,
    result:         'pass',
    escalationPath: 'G-MI-retry',
  }
}

function fail(gateId: MIGateResult['gateId'], testedAxiomId: MIGateResult['testedAxiomId']): MIGateResult {
  return {
    gateId,
    testedAxiomId,
    result:         'fail',
    escalationPath: 'G-MI-escalate-to-L0',
  }
}

// ─── G-MI1 ───────────────────────────────────────────────────────────────────

export function evaluateGmi1(instanceResults: InstanceResult[]): MIGateResult {
  for (const r of instanceResults) {
    if (!TERMINAL_STATES.has(r.status)) {
      return fail('G-MI1', 'IA1')
    }
  }
  return pass('G-MI1', 'IA1')
}

// ─── G-MI2 ───────────────────────────────────────────────────────────────────

/**
 * G-MI2 — binding + shape.declarations untouched by engine.
 * S2 passes a flag witnessed during execution: true iff the engine attempted
 * to write into plan.shape.declarations or plan.binding.
 */
export function evaluateGmi2(engineMutatedPlan: boolean): MIGateResult {
  if (engineMutatedPlan) return fail('G-MI2', 'IA2')
  return pass('G-MI2', 'IA2')
}

// ─── G-MI3 ───────────────────────────────────────────────────────────────────

/**
 * G-MI3 — validateContract passed for every instance with an output.
 * S2 pre-collects per-instance validation results keyed by DeclId.
 * Instances without output (failed / escalated) are exempt.
 */
export function evaluateGmi3(
  instanceResults:    InstanceResult[],
  validationByDecl:   Map<DeclId, boolean>,
): MIGateResult {
  for (const r of instanceResults) {
    if (r.output === undefined) continue
    const ok = validationByDecl.get(r.declId)
    if (ok !== true) return fail('G-MI3', 'IA3')
  }
  return pass('G-MI3', 'IA3')
}

// ─── G-MI4a ──────────────────────────────────────────────────────────────────

/**
 * G-MI4a — after a set-level failsafe breach, no further retries attempted.
 * S2 passes a count of post-breach retry attempts; 0 ⇒ pass.
 */
export function evaluateGmi4a(
  setViolations:          SetViolation[],
  postBreachRetryCount:   number,
): MIGateResult {
  if (setViolations.length === 0) return pass('G-MI4a', 'IA4a')
  if (postBreachRetryCount === 0)  return pass('G-MI4a', 'IA4a')
  return fail('G-MI4a', 'IA4a')
}

// ─── G-MI4b ──────────────────────────────────────────────────────────────────

export function evaluateGmi4b(report: RunReportContent): MIGateResult {
  if (report.setViolations.length === 0) return pass('G-MI4b', 'IA4b')
  if (report.outcome === 'failed' || report.outcome === 'escalated') return pass('G-MI4b', 'IA4b')
  return fail('G-MI4b', 'IA4b')
}

// ─── G-MI5 ───────────────────────────────────────────────────────────────────

/**
 * G-MI5 — no cascade failures outside topology/partialSuccess rules.
 * S2 passes a flag asserted during cascade analysis. False = no unsanctioned cascade.
 */
export function evaluateGmi5(unsanctionedCascade: boolean): MIGateResult {
  if (unsanctionedCascade) return fail('G-MI5', 'IA5')
  return pass('G-MI5', 'IA5')
}

// ─── G-MI6 ───────────────────────────────────────────────────────────────────

/**
 * G-MI6 — every call routed through binding.* or engine-native.
 * S2 passes a witness: true iff any call escaped binding/engine resolution.
 */
export function evaluateGmi6(nonBindingCallDetected: boolean): MIGateResult {
  if (nonBindingCallDetected) return fail('G-MI6', 'IA6')
  return pass('G-MI6', 'IA6')
}

// ─── G-MI7a ──────────────────────────────────────────────────────────────────

/**
 * G-MI7a — all capacity-breach errors have class === CLASS_2.
 * InstanceError.reason starting with 'capacity-breach:' is treated as a
 * capacity-breach error for this gate's scope.
 */
export function evaluateGmi7a(instanceResults: InstanceResult[]): MIGateResult {
  for (const r of instanceResults) {
    for (const e of r.errors) {
      if (e.reason.startsWith('capacity-breach:')) {
        if (e.class !== 'CLASS_2') return fail('G-MI7a', 'IA7a')
      }
    }
  }
  return pass('G-MI7a', 'IA7a')
}

// ─── G-MI7b ──────────────────────────────────────────────────────────────────

/**
 * G-MI7b — per capacity-breach event: retry count increments by exactly 1.
 * S2 passes per-instance capacity-breach counts + per-instance retry deltas.
 * Pass iff for every instance: retriesDelta === breachCount.
 */
export function evaluateGmi7b(
  retriesDeltaByDecl: Map<DeclId, number>,
  breachesByDecl:     Map<DeclId, number>,
): MIGateResult {
  const declIds = new Set<DeclId>([
    ...retriesDeltaByDecl.keys(),
    ...breachesByDecl.keys(),
  ])
  for (const d of declIds) {
    const retries  = retriesDeltaByDecl.get(d) ?? 0
    const breaches = breachesByDecl.get(d) ?? 0
    if (retries !== breaches) return fail('G-MI7b', 'IA7b')
  }
  return pass('G-MI7b', 'IA7b')
}

// ─── G-MI7c ──────────────────────────────────────────────────────────────────

/**
 * G-MI7c — no declaration rewrite after a capacity breach.
 * S2 passes a witness flag asserted by the dispatch plan.
 */
export function evaluateGmi7c(postBreachDeclRewriteDetected: boolean): MIGateResult {
  if (postBreachDeclRewriteDetected) return fail('G-MI7c', 'IA7c')
  return pass('G-MI7c', 'IA7c')
}

// ─── Composite: evaluate all gates ───────────────────────────────────────────

export type MIGateContext = {
  report:                        RunReportContent
  engineMutatedPlan:             boolean
  validationByDecl:              Map<DeclId, boolean>
  postBreachRetryCount:          number
  unsanctionedCascade:           boolean
  nonBindingCallDetected:        boolean
  retriesDeltaByDecl:            Map<DeclId, number>
  breachesByDecl:                Map<DeclId, number>
  postBreachDeclRewriteDetected: boolean
}

export type MIGateBatch = {
  gmi1:  MIGateResult
  gmi2:  MIGateResult
  gmi3:  MIGateResult
  gmi4a: MIGateResult
  gmi4b: MIGateResult
  gmi5:  MIGateResult
  gmi6:  MIGateResult
  gmi7a: MIGateResult
  gmi7b: MIGateResult
  gmi7c: MIGateResult
  allPassed: boolean
  firstFail: MIGateResult | null
}

export function evaluateAllMIGates(ctx: MIGateContext): MIGateBatch {
  const gmi1  = evaluateGmi1(ctx.report.instanceResults)
  const gmi2  = evaluateGmi2(ctx.engineMutatedPlan)
  const gmi3  = evaluateGmi3(ctx.report.instanceResults, ctx.validationByDecl)
  const gmi4a = evaluateGmi4a(ctx.report.setViolations, ctx.postBreachRetryCount)
  const gmi4b = evaluateGmi4b(ctx.report)
  const gmi5  = evaluateGmi5(ctx.unsanctionedCascade)
  const gmi6  = evaluateGmi6(ctx.nonBindingCallDetected)
  const gmi7a = evaluateGmi7a(ctx.report.instanceResults)
  const gmi7b = evaluateGmi7b(ctx.retriesDeltaByDecl, ctx.breachesByDecl)
  const gmi7c = evaluateGmi7c(ctx.postBreachDeclRewriteDetected)

  const ordered = [gmi1, gmi2, gmi3, gmi4a, gmi4b, gmi5, gmi6, gmi7a, gmi7b, gmi7c]
  const firstFail = ordered.find(g => g.result === 'fail') ?? null
  const allPassed = firstFail === null

  return {
    gmi1, gmi2, gmi3, gmi4a, gmi4b, gmi5, gmi6, gmi7a, gmi7b, gmi7c,
    allPassed,
    firstFail,
  }
}
