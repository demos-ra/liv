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
//   W-ATOM  InstanceResult, SetViolation, Aggregation,
//           PartialSuccessRecord, RunOutcome,
//           PlanArtifactContent, PlanTopology, TypedAtom  ←  F-multi-instance/R0 mi-types
// wires-out:  consumed by F-multi-instance/R2 mi-execute (S2 stage)
// deps:
//   R0  ../types/mi-types
// validated:  pending
//
// F-multi-instance R1 — aggregation.
// Pure. Given the final InstanceResult[] + SetViolation[] + PlanArtifactContent,
// computes the RunReportContent.outcome + aggregation section per §3.4.a.
//
// Aggregation table (§3.4.a):
//
//   topology     | partialSuccess | outcome rule
//   -------------+----------------+--------------------------------------------------
//   singleton    | n/a            | instance.status, reflected onto outcome verbatim
//   sequence     | n/a            | fail/escalate on first non-complete; else complete
//   tier         | allowed=false  | any instance non-complete → failed
//   tier         | allowed=true   | >= minSuccesses completed → partial, else failed
//   loop         | n/a            | terminal when all complete or reentry cap exhausted

import type {
  InstanceResult,
  SetViolation,
  Aggregation,
  PartialSuccessRecord,
  RunOutcome,
  PlanArtifactContent,
  PlanTopology,
  TypedAtom,
} from '../types/mi-types'

// ─── Final output selection ──────────────────────────────────────────────────

/**
 * Select a representative final output atom for the run.
 * singleton → single instance's output.
 * sequence  → last completed instance's output.
 * tier/loop → undefined (consumers don't expect a single atom here).
 */
function pickFinalOutput(
  topology: PlanTopology,
  instanceResults: InstanceResult[],
): TypedAtom | undefined {
  if (topology === 'singleton') {
    return instanceResults[0]?.output
  }
  if (topology === 'sequence') {
    // Walk in reverse; return the last successful output.
    for (let i = instanceResults.length - 1; i >= 0; i--) {
      const r = instanceResults[i]
      if (r.status === 'complete' && r.output !== undefined) return r.output
    }
    return undefined
  }
  return undefined
}

// ─── Outcome computation ─────────────────────────────────────────────────────

export type AggregationResult = {
  outcome:     RunOutcome
  aggregation: Aggregation
}

export function aggregateRun(
  plan:            PlanArtifactContent,
  instanceResults: InstanceResult[],
  setViolations:   SetViolation[],
): AggregationResult {
  const topology  = plan.shape.topology
  const perSet    = plan.limit.perSet

  // Breach short-circuit: any set-level violation forces non-complete outcome.
  if (setViolations.length > 0) {
    // Match the escalation action if declared; default to 'failed'.
    // Escalation semantics live in domain bindings; here we only honor terminality.
    const anyEscalated = instanceResults.some(r => r.status === 'escalated')
    const outcome: RunOutcome = anyEscalated ? 'escalated' : 'failed'
    return {
      outcome,
      aggregation: {
        topology,
      },
    }
  }

  const allComplete = instanceResults.every(r => r.status === 'complete')
  const anyEscalated = instanceResults.some(r => r.status === 'escalated')
  const anyFailed    = instanceResults.some(r => r.status === 'failed')

  let outcome: RunOutcome
  let partialSuccess: PartialSuccessRecord | undefined

  switch (topology) {
    case 'singleton': {
      const only = instanceResults[0]
      outcome = only ? only.status : 'failed'
      break
    }
    case 'sequence': {
      if (allComplete) outcome = 'complete'
      else if (anyEscalated) outcome = 'escalated'
      else outcome = 'failed'
      break
    }
    case 'tier': {
      if (allComplete) {
        outcome = 'complete'
      } else if (perSet.partialSuccess.allowed) {
        const required  = perSet.partialSuccess.minSuccesses ?? 0
        const achieved  = instanceResults.filter(r => r.status === 'complete').length
        const satisfied = achieved >= required
        partialSuccess = { required, achieved, satisfied }
        outcome = satisfied
          ? 'partial'
          : (anyEscalated ? 'escalated' : 'failed')
      } else {
        outcome = anyEscalated ? 'escalated' : 'failed'
      }
      break
    }
    case 'loop': {
      if (allComplete) outcome = 'complete'
      else if (anyEscalated) outcome = 'escalated'
      else outcome = 'failed'
      break
    }
  }

  return {
    outcome,
    aggregation: {
      topology,
      finalOutput: pickFinalOutput(topology, instanceResults),
      partialSuccess,
    },
  }
}
