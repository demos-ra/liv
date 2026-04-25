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
//   W-ATOM  Result                ←  core/R5 primitives
//   W-ATOM  Semver                ←  core/R5 primitives
//   W-ATOM  PlanArtifactContent   ←  core/R5 plan-standard.types
//   W-ATOM  PlanValidityError     ←  core/R5 plan-standard.types
//   W-ATOM  Declaration           ←  core/R5 plan-standard.types
//   W-ATOM  DeclId                ←  core/R5 plan-standard.types
//   W-ATOM  PlanShape             ←  core/R5 plan-standard.types
//   W-ATOM  PlanIntent            ←  core/R5 plan-standard.types
//   W-ATOM  IntentEntry           ←  core/R5 plan-standard.types
//   W-ATOM  PlanCapacity          ←  core/R5 plan-standard.types
//   W-ATOM  PlanLimit             ←  core/R5 plan-standard.types
//   W-ATOM  RoleClassId           ←  core/R5 plan-standard.types
//   W-ATOM  TierClass             ←  core/R5 plan-standard.types
//   W-ATOM  PlanId                ←  core/R5 plan-standard.types
//   W-ATOM  EpochMs               ←  core/R5 plan-standard.types
//   W-ATOM  DomainBinding         ←  core/R5 plan-standard.types
//   W-ATOM  PlanComposerInput     ←  F-plan/R0 plan-types
//   W-ATOM  PLAN_CONST            ←  F-plan/R0 plan-const
//   W-HOOK  validate              ←  F-plan/R1 plan-validate
//   W-HOOK  planValidityError     ←  F-plan/R1 plan-validate
// wires-out:
//   W-HOOK  compose                →  F-plan/R2 plan-draft, plan-emit
//   W-HOOK  decomposeObjectives    →  F-plan/R1 (internal); exported for unit smoke at Shot 5
// deps:
//   R0  core/R5 primitives
//   R0  core/R5 plan-standard.types
//   R0  ../../types/plan-types
//   R0  ../../types/plan-const
//   R1  ./plan-validate
// validated:  pending
//
// F-plan R1 — pure composition.
// PA-axiom map for this file:
//   PA1   compose() rejects empty input pre-validate via PLAN_REJECTED_EMPTY_INPUT;
//         validate() also enforces PA1 as a structural backstop.
//   PA3   inputContract / outputContract pulled from binding.roleClasses[role]
//         only. Verified by validate().
//   PA4a  every Declaration gets perDecl.retryBudget from PLAN_CONST.RETRY_LIMITS.
//   PA4b  perSet populated from PLAN_CONST.FAILSAFE.
//   PA8   role and tierHint keyed from binding.roleClasses / tierLimits only.
//   PA9   binding := PLAN_DOMAIN_BINDING (input.binding) verbatim.
//   PA10a/b  defensive non-emission — composer never emits splitLineage.
//   PA11/PA12  vacuously satisfied — Sprint A composer emits dataFlow=[] per decl.
//
// A4 (purity discipline): no Date.now(), Math.random(), console, fetch, DB.
//   epochNow and generateId injected via deps. All branching deterministic
//   on inputs.

import type { Result, Semver } from '@/core/types/primitives'
import type {
  PlanArtifactContent,
  PlanValidityError,
  Declaration,
  DeclId,
  PlanShape,
  PlanIntent,
  IntentEntry,
  PlanCapacity,
  PlanLimit,
  RoleClassId,
  TierClass,
  PlanId,
  EpochMs,
  DomainBinding,
} from '@/core/types/plan-standard.types'

import type { PlanComposerInput } from '../types/plan-types'
import { PLAN_CONST } from '../types/plan-const'
import { validate, planValidityError } from './plan-validate'

// ─── compose() error type — distinct from PlanValidityError ──────────────────
// compose() can fail in two ways pre-validation:
//   - empty input (D-DECOMPOSE produces zero objectives) — PLAN_REJECTED_EMPTY_INPUT
//   - validate() returns err — PlanValidityError pass-through
//
// Both surface as PlanValidityError to caller for uniform handling. The empty-
// input case maps to PA1 since "no declarations" is the same condition validate
// would reject. Distinguished from validate's PA1 only by location: compose
// short-circuits before assembly when D-DECOMPOSE yields zero objectives.

const PLAN_INITIAL_VERSION = '1.0.0' as Semver

// ─── deps interface (injection per A4 purity) ────────────────────────────────

/**
 * Dependencies injected into compose(). Keeps R1 pure: no ambient I/O.
 *   generateId(prefix)  — UUID generator (core/R5 generateId at runtime)
 *   epochNow()          — current epoch ms (Date.now wrapped at R2/R4 site)
 */
export type ComposeDeps = {
  generateId: (prefix?: string) => string
  epochNow:   () => EpochMs
}

// ─── D-DECOMPOSE: pure user-message → objective fragment splitter ────────────
// Per spec §3.4 step 1 + Manager dispatch:
//   - Split on sentence terminators: . ? !
//   - Split on standalone " and " conjunctions (whitespace-bounded, lowercase
//     match — preserves "brand and identity" inside larger clauses only when
//     surrounded by whitespace as a coordinator, which the regex enforces).
//   - Split on numbered list markers at line starts: /^\d+\.\s/m
//   - Trim every fragment, drop empty.
//   - Empty result → caller maps to PLAN_REJECTED_EMPTY_INPUT.
//
// Deterministic. Pure. No LLM. Same input → same fragments, every time.
//
// Exported for direct smoke-test inspection at Shot 5 (per spec §9 Shot 5
// guidance — verifiable independently of full compose()).

export function decomposeObjectives(userMessage: string): string[] {
  if (typeof userMessage !== 'string') return []

  // Phase 1: split numbered-marker prefixes line-wise. Each numbered line
  // becomes its own segment regardless of internal punctuation.
  const lineSegments = userMessage
    .split(/\n+/)
    .flatMap((line) => {
      // /^\s*\d+\.\s+/ at line start → strip the marker; treat as standalone segment.
      const numberedMatch = /^\s*\d+\.\s+(.*)$/.exec(line)
      return numberedMatch !== null ? [numberedMatch[1]] : [line]
    })

  // Phase 2: within each segment, split on sentence terminators and " and ".
  // Terminator chars are dropped; the regex captures separators we discard.
  // " and " is matched case-insensitively, whitespace-bounded both sides.
  const fragments = lineSegments.flatMap((seg) =>
    seg
      .split(/[.?!]+|\s+and\s+/i),
  )

  // Phase 3: trim, drop empty.
  return fragments
    .map((f) => f.trim())
    .filter((f) => f.length > 0)
}

// ─── Composition helpers (each enforces specific PA axioms) ──────────────────

/**
 * PlanShape composition — topology + Declaration set.
 * Sprint A: topology='sequence' (default). One declaration per objective.
 *   id        = 'OBJ-' + index
 *   dependsOn = []        (Sprint A non-goal: inter-objective inference deferred)
 *   dataFlow  = []        (no inter-objective wires; PA11/PA12 vacuous)
 */
function composeShape(objectives: ReadonlyArray<string>): PlanShape {
  const declarations: Declaration[] = objectives.map((_, index) => ({
    id:        ('OBJ-' + index) as DeclId,
    dependsOn: [],
    dataFlow:  [],
  }))
  return {
    topology:     'sequence',
    declarations,
  }
}

/**
 * PlanIntent composition — keyed by DeclId.
 * PA3: inputContract / outputContract pulled directly from
 *      binding.roleClasses[role].inputType.ref / .outputType.ref.
 * PA8: role and tierHint are binding-keyed by construction (the only role
 *      Sprint A composes is OBJECTIVE, which is a key of PLAN_DOMAIN_BINDING.roleClasses).
 */
function composeIntent(
  declarations: ReadonlyArray<Declaration>,
  binding:      DomainBinding,
): PlanIntent {
  const roleId = 'OBJECTIVE' as RoleClassId
  const role   = binding.roleClasses[roleId]
  // role is guaranteed to exist: PLAN_DOMAIN_BINDING declares OBJECTIVE.
  // validate() will catch any caller passing a binding that omits it.

  const intent: PlanIntent = {}
  for (const decl of declarations) {
    const entry: IntentEntry = {
      role:           roleId,
      inputContract:  role.inputType.ref,
      outputContract: role.outputType.ref,
      tierHint:       role.tierHint as TierClass,
    }
    intent[decl.id] = entry
  }
  return intent
}

/**
 * PlanCapacity composition — keyed by DeclId.
 * estimatedCost = binding.tierLimits[tierHint].budget.
 * PA10a/b defensive: splitLineage is never emitted (Sprint A composes uniform
 * declarations; no splits).
 */
function composeCapacity(
  declarations: ReadonlyArray<Declaration>,
  binding:      DomainBinding,
): PlanCapacity {
  const tierBudget = binding.tierLimits['objective']?.budget ?? 0
  // tierLimits.objective is guaranteed present in PLAN_DOMAIN_BINDING; the ?? 0
  // fallback is defensive against malformed bindings (validate-side check
  // happens at PA8, so any missing tier is caught there before this runs in
  // practice — but compose stays total).

  const capacity: PlanCapacity = {}
  for (const decl of declarations) {
    capacity[decl.id] = {
      estimatedCost: tierBudget,
      // splitLineage intentionally omitted — PA10a/b defensive non-emission.
    }
  }
  return capacity
}

/**
 * PlanLimit composition.
 * PA4a: perDecl populated for every declaration with retryBudget from
 *       PLAN_CONST.RETRY_LIMITS.OBJECTIVE.
 * PA4b: perSet carries maxTime, maxTransitions, maxReentries from
 *       PLAN_CONST.FAILSAFE. partialSuccess from PLAN_CONST.FAILSAFE.PARTIAL_SUCCESS.
 *       domainFailsafes := binding.domainFailsafes (Sprint A: empty {}; allowed
 *       per Plan Standard v2.2).
 */
function composeLimit(
  declarations: ReadonlyArray<Declaration>,
  binding:      DomainBinding,
): PlanLimit {
  const perDecl: { [declId: string]: { retryBudget: number } } = {}
  for (const decl of declarations) {
    perDecl[decl.id] = { retryBudget: PLAN_CONST.RETRY_LIMITS.OBJECTIVE }
  }

  return {
    perDecl,
    perSet: {
      maxTime:        PLAN_CONST.FAILSAFE.MAX_TIME,
      maxTransitions: PLAN_CONST.FAILSAFE.MAX_TRANSITIONS,
      maxReentries:   PLAN_CONST.FAILSAFE.MAX_REENTRIES,
      partialSuccess: { allowed: PLAN_CONST.FAILSAFE.PARTIAL_SUCCESS.allowed },
      domainFailsafes: binding.domainFailsafes,
    },
  }
}

// ─── compose() — public entry point ──────────────────────────────────────────

/**
 * Compose a PlanArtifactContent from typed F-codec output and F-plan binding.
 *
 * Pure: no Date.now / Math.random / I/O. epochNow + generateId injected.
 * Returns Result<PlanArtifactContent, PlanValidityError>:
 *   Result.ok(content)  — composition succeeded AND validate() passed
 *   Result.err(error)   — empty objective decomposition (mapped to PA1) OR
 *                         any PA gate failed
 *
 * Pipeline:
 *   1. D-DECOMPOSE: split userMessage → objective fragments.
 *      Empty → Result.err(planValidityError('PA1', 'no objectives extracted from input')).
 *   2. composeShape   → declarations[]
 *   3. composeIntent  → intent (PA3, PA8 by construction)
 *   4. composeCapacity → capacity (PA10a/b defensive non-emission)
 *   5. composeLimit   → limit (PA4a, PA4b)
 *   6. Assemble PlanArtifactContent — binding verbatim (PA9), planId generated,
 *      planVersion='1.0.0' for first emission, producedBy from input.authoring,
 *      producedAt from epochNow().
 *   7. validate() — PA1, PA2a, PA2b, PA3, PA8 mechanical pass.
 *
 * Caller (R2 plan-draft) maps PA1-empty to PLAN_REJECTED_EMPTY_INPUT at the
 * R3 surface; from R1's perspective, "empty input" and "PA1 violation" are the
 * same condition, surfaced uniformly as PlanValidityError.
 */
export function compose(
  input:   PlanComposerInput,
  binding: DomainBinding,
  deps:    ComposeDeps,
): Result<PlanArtifactContent, PlanValidityError> {
  // Step 1 — D-DECOMPOSE.
  const objectives = decomposeObjectives(input.userMessage)
  if (objectives.length === 0) {
    return {
      ok: false,
      error: planValidityError(
        'PA1',
        'no objectives extracted from user message (D-DECOMPOSE produced empty fragment list)',
        { userMessageLength: input.userMessage.length },
      ),
    }
  }

  // Steps 2–5 — composition.
  const shape    = composeShape(objectives)
  const intent   = composeIntent(shape.declarations, binding)
  const capacity = composeCapacity(shape.declarations, binding)
  const limit    = composeLimit(shape.declarations, binding)

  // Step 6 — assemble.
  const content: PlanArtifactContent = {
    planId:      deps.generateId('plan') as PlanId,
    planVersion: PLAN_INITIAL_VERSION,
    producedBy:  {
      programId:      input.authoring.programId,
      programVersion: input.authoring.programVersion,
    },
    producedAt:  deps.epochNow(),
    binding,                                     // PA9 — verbatim
    shape,
    intent,
    capacity,
    limit,
  }

  // Step 7 — validate. Result pass-through.
  return validate(content)
}

// ─── End of plan-compose.ts ──────────────────────────────────────────────────
