// @liv-standard v1.5.1
// [F-plan/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction)
// slice:      F-plan
// layer:      R1
// wires-in:
//   W-ATOM  PlanArtifactContent  ←  core/R5 plan-standard.types
//   W-ATOM  PlanValidityError    ←  core/R5 plan-standard.types
//   W-ATOM  Declaration          ←  core/R5 plan-standard.types
//   W-ATOM  DeclId               ←  core/R5 plan-standard.types
//   W-ATOM  Result               ←  core/R5 primitives
// wires-out:
//   W-HOOK  validate              →  F-plan/R1 plan-compose
//   W-HOOK  planValidityError     →  F-plan/R1 plan-compose (error factory)
// deps:
//   R0  core/R5 primitives
//   R0  core/R5 plan-standard.types
// validated:  pending
//
// F-plan R1 — pure validity gates.
// PA1, PA2a, PA2b, PA3, PA8 enforced here.
// PA4a, PA4b, PA9 enforced at composition site (always populated, structural).
// PA10a/b enforced by defensive non-emission in compose (no splitLineage emitted).
// PA11/PA12 vacuously satisfied Sprint A (no inter-objective dataFlow).
//
// A4: pure. No Date.now(), Math.random(), console, fetch, DB. Imports only
//     from types/ and core/. No app/, contract/, exec/.
// A6: validation thresholds and gate IDs are inline string literals tied to the
//     PA-axiom registry (which lives in plan-standard.md, not as TS values).

import type { Result } from '@/core/types/primitives'
import type {
  PlanArtifactContent,
  PlanValidityError,
  Declaration,
  DeclId,
} from '@/core/types/plan-standard.types'

// ─── Error factory (slice-local; mirrors F-planner pattern) ──────────────────
// Public so plan-compose can construct typed errors with consistent shape.

/**
 * Construct a PlanValidityError tagged with the failed PA axiom.
 * `failedAxiom` is duplicated into both top-level and context per F-planner's
 * pattern — keeps shape uniform for callers reading either field.
 */
export function planValidityError(
  failedAxiom: string,
  message: string,
  extra?: Record<string, unknown>,
): PlanValidityError {
  return {
    code:         'PLAN_VALIDITY_FAILED',
    message,
    failedAxiom,
    context:      { failedAxiom, ...(extra ?? {}) },
  }
}

// ─── PA2b — acyclicity DFS (iterative, white/grey/black) ─────────────────────
// Mirror of F-planner's hasCycleInWireMap pattern, adapted for Declaration[]
// adjacency (dependsOn arrays instead of WireEntry edges).
//
// Sprint A: Sprint A composer always emits dependsOn=[] per declaration, so
// this function returns false trivially. Implemented and called mechanically
// per spec §2.1 PA2b: "trivially true with empty dependsOn but enforce
// mechanically" — defensive against future inter-objective inference.

function findCycle(
  declarations: ReadonlyArray<Declaration>,
): { cycleAt: DeclId } | null {
  // Build adjacency: declId → set of declIds it depends on.
  // Edge semantics: A.dependsOn = [B] means A → B (A depends on B).
  // A cycle exists iff following dependsOn returns to the start.
  const adj = new Map<string, Set<string>>()
  for (const d of declarations) {
    const s = new Set<string>()
    for (const t of d.dependsOn) s.add(t)
    adj.set(d.id, s)
  }
  // Include any dangling targets (PA2a may not have run yet — defensive).
  for (const targets of adj.values()) {
    for (const t of targets) if (!adj.has(t)) adj.set(t, new Set<string>())
  }

  const WHITE = 0, GREY = 1, BLACK = 2
  const color = new Map<string, number>()
  for (const node of adj.keys()) color.set(node, WHITE)

  for (const start of color.keys()) {
    if (color.get(start) !== WHITE) continue
    const stack: Array<{ node: string; iter: Iterator<string> }> = [
      { node: start, iter: (adj.get(start) ?? new Set<string>()).values() },
    ]
    color.set(start, GREY)

    while (stack.length > 0) {
      const frame = stack[stack.length - 1]
      const step  = frame.iter.next()
      if (step.done) {
        color.set(frame.node, BLACK)
        stack.pop()
        continue
      }
      const next = step.value
      const c    = color.get(next) ?? WHITE
      if (c === GREY)  return { cycleAt: next as DeclId }
      if (c === BLACK) continue
      color.set(next, GREY)
      stack.push({ node: next, iter: (adj.get(next) ?? new Set<string>()).values() })
    }
  }

  return null
}

// ─── validate — PA1, PA2a, PA2b, PA3, PA8 ────────────────────────────────────

/**
 * Validate a composed PlanArtifactContent against PA1, PA2a, PA2b, PA3, PA8.
 *
 * Returns Result.ok(content) on pass, Result.err(PlanValidityError) on fail.
 * Pass-through on success — caller assembles emission from the same content.
 *
 * Gate ordering (fail-fast):
 *   PA1   structural (need declarations to check anything else)
 *   PA8   role/tier keyed (needed before PA3 contract resolution)
 *   PA3   contract resolution against binding
 *   PA2a  dependsOn closure (needed before cycle check is meaningful)
 *   PA2b  acyclicity (defensive Sprint A; mechanical per spec)
 */
export function validate(
  content: PlanArtifactContent,
): Result<PlanArtifactContent, PlanValidityError> {
  const { shape, intent, binding } = content

  // PA1 — at least one declaration.
  if (shape.declarations.length < 1) {
    return {
      ok: false,
      error: planValidityError('PA1', 'shape.declarations is empty'),
    }
  }

  const declIds = new Set<string>(shape.declarations.map(d => d.id))

  // PA8 — every intent.role is a key of binding.roleClasses; every tierHint
  // is a key of binding.tierLimits.
  for (const declId of declIds) {
    const entry = intent[declId]
    if (entry === undefined) {
      return {
        ok: false,
        error: planValidityError(
          'PA8',
          `intent missing entry for declaration ${declId}`,
          { declId },
        ),
      }
    }
    if (binding.roleClasses[entry.role] === undefined) {
      return {
        ok: false,
        error: planValidityError(
          'PA8',
          `intent[${declId}].role '${entry.role}' is not a key of binding.roleClasses`,
          { declId, role: entry.role },
        ),
      }
    }
    if (binding.tierLimits[entry.tierHint] === undefined) {
      return {
        ok: false,
        error: planValidityError(
          'PA8',
          `intent[${declId}].tierHint '${entry.tierHint}' is not a key of binding.tierLimits`,
          { declId, tierHint: entry.tierHint },
        ),
      }
    }
  }

  // PA3 — every intent contract resolves against binding.roleClasses[role].
  // Sprint A's only role is OBJECTIVE; contracts pulled directly from
  // binding.roleClasses.OBJECTIVE.inputType.ref / .outputType.ref. Mechanical
  // string-equality check against the role's declared TypedAtomRefs.
  for (const declId of declIds) {
    const entry = intent[declId]
    const roleDef = binding.roleClasses[entry.role]
    if (entry.inputContract !== roleDef.inputType.ref) {
      return {
        ok: false,
        error: planValidityError(
          'PA3',
          `intent[${declId}].inputContract does not resolve against binding.roleClasses[${entry.role}].inputType`,
          { declId, expected: roleDef.inputType.ref, got: entry.inputContract },
        ),
      }
    }
    if (entry.outputContract !== roleDef.outputType.ref) {
      return {
        ok: false,
        error: planValidityError(
          'PA3',
          `intent[${declId}].outputContract does not resolve against binding.roleClasses[${entry.role}].outputType`,
          { declId, expected: roleDef.outputType.ref, got: entry.outputContract },
        ),
      }
    }
  }

  // PA2a — every dependsOn entry resolves to a declId in shape.declarations.
  // Sprint A: dependsOn is empty per declaration; loop is a no-op. Enforced
  // mechanically (defensive against future inter-objective inference).
  for (const decl of shape.declarations) {
    for (const target of decl.dependsOn) {
      if (!declIds.has(target)) {
        return {
          ok: false,
          error: planValidityError(
            'PA2a',
            `declaration ${decl.id} depends on '${target}' which is not in shape.declarations`,
            { declId: decl.id, missingTarget: target },
          ),
        }
      }
    }
  }

  // PA2b — acyclicity. DFS via findCycle. Empty dependsOn → trivially acyclic.
  const cycle = findCycle(shape.declarations)
  if (cycle !== null) {
    return {
      ok: false,
      error: planValidityError(
        'PA2b',
        `shape.declarations.dependsOn forms a cycle reaching ${cycle.cycleAt}`,
        { cycleAt: cycle.cycleAt },
      ),
    }
  }

  return { ok: true, data: content }
}

// ─── End of plan-validate.ts ─────────────────────────────────────────────────
