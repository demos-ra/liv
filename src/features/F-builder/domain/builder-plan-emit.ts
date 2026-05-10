// @liv-standard v1.5.1
// [F-builder/domain/builder-plan-emit.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-3 (NEW — moved from F-planner/workflow/planner-plan-emit — dissolution)
// slice:      F-builder
// layer:      R2
// wires-in:
//   W-ATOM  NodeId                        ← core/R5 primitives
//   W-ATOM  Semver                        ← core/R5 primitives
//   W-ATOM  UserId                        ← core/R5 primitives
//   W-ATOM  Result                        ← core/R5 primitives
//   W-ATOM  IfContract                    ← core/R0 liv-standard.types
//   W-ATOM  WireEntry                     ← core/R0 liv-standard.types
//   W-ATOM  ArtifactEmission              ← core/R5 artifact-standard.types
//   W-ATOM  CreateArtifactInput           ← core/R5 artifact-standard.types
//   W-ATOM  ArtifactPayload               ← core/R5 artifact-standard.types
//   W-ATOM  CognitivePrimitive            ← core/R5 primitives
//   W-ATOM  PlanInput                     ← core/R5 plan-standard.types
//   W-ATOM  PlanArtifactContent           ← core/R5 plan-standard.types
//   W-ATOM  PlanValidityError             ← core/R5 plan-standard.types
//   W-ATOM  PlanShape                     ← core/R5 plan-standard.types
//   W-ATOM  PlanIntent                    ← core/R5 plan-standard.types
//   W-ATOM  PlanCapacity                  ← core/R5 plan-standard.types
//   W-ATOM  PlanLimit                     ← core/R5 plan-standard.types
//   W-ATOM  Declaration                   ← core/R5 plan-standard.types
//   W-ATOM  IntentEntry                   ← core/R5 plan-standard.types
//   W-ATOM  AuthoringProgramRef           ← core/R5 plan-standard.types
//   W-ATOM  DeclId                        ← core/R5 plan-standard.types
//   W-ATOM  PlanId                        ← core/R5 plan-standard.types
//   W-ATOM  EpochMs                       ← core/R5 plan-standard.types
//   W-ATOM  Milliseconds                  ← core/R5 plan-standard.types
//   W-ATOM  RoleClassId                   ← core/R5 plan-standard.types
//   W-ATOM  TypedAtomRef                  ← core/R5 plan-standard.types
//   W-ATOM  TierClass                     ← core/R5 plan-standard.types
//   W-ATOM  LIV_STANDARD_DOMAIN_BINDING   ← F-plan/R3 liv-standard-binding
//   W-HOOK  createArtifact                ← F-artifact/R3 artifact-contract
//   W-ATOM  ArtifactGraphPort             ← F-artifact/R3 artifact-contract
//   W-ATOM  PLANNER_CONST                 ← F-planner/R0 planner-const
// wires-out:
//   W-HOOK  emitPlanForContract           → F-planner/R2 planner-workflow (Build #3)
// deps:
//   R5 @/core/types/primitives
//   R5 @/core/types/plan-standard.types
//   R5 @/core/types/artifact-standard.types
//   R0 @/core/constants/liv-standard.types
//   R3 @/features/F-artifact/contract/artifact-contract
//   R3 @/features/F-plan/contract/liv-standard-binding
//   R0 @/features/F-builder/config/builder-const
// validated:  pending
//
// Phase 5 — Build #2:
//   Plan emission path. Composes PlanArtifactContent per Plan v2.2 §9 schema and
//   emits via F-artifact createArtifact. Returns planAnchorNodeId (= AS emission's
//   writes.a7.artifactAnchorNodeId) on success.
//
//   PA2b acyclicity check runs pre-emission on contract.wireMap — cycles fail with
//   PlanValidityError { code: 'PLAN_VALIDITY_FAILED', failedAxiom: 'PA2b' } before
//   PlanInput is constructed. No silent re-route, no wire pruning.
//
//   This module coexists with runPipeline's legacy path until Build #3. It is not
//   yet wired into runPipeline — composition/gate available, dispatch unchanged.
//
//   Axiom cite:
//     A5 — cross-slice calls via R3 contract only (F-artifact/R3 createArtifact,
//          F-plan/R3 binding).
//     PA1 (Plan) — at-least-one-declaration: enforced by IN-MAIN presence.
//     PA2b (Plan) — declaration dependsOn closure is acyclic: checked on
//          contract.wireMap before composition; failure returns PlanValidityError.
//     PA3 (Plan) — IntentEntry contracts resolve against binding.roleClasses.
//     PA4a/PA4b (Plan) — perDecl.retryBudget + perSet failsafes populated.
//     PA5 (Plan) — re-plan emits new plan with fresh planVersion (caller bumps semver
//          and re-invokes this function; this module never mutates prior plans).
//     PA8 (Plan) — role/tierHint are keys of binding (RoleClassId/TierClass).
//     PA9 (Plan) — binding captured verbatim from input.domainBinding.

import type { NodeId, Semver, UserId, Result, CognitivePrimitive } from '@/core/types/primitives'
import type {
  IfContract,
  WireEntry,
} from '@/core/constants/liv-standard.types'
import type {
  ArtifactEmission,
  CreateArtifactInput,
  ArtifactPayload,
} from '@/core/types/artifact-standard.types'
import type {
  PlanInput,
  PlanArtifactContent,
  PlanValidityError,
  PlanShape,
  PlanIntent,
  PlanCapacity,
  PlanLimit,
  Declaration,
  IntentEntry,
  AuthoringProgramRef,
  DeclId,
  PlanId,
  EpochMs,
  Milliseconds,
  RoleClassId,
  TypedAtomRef,
  TierClass,
  DomainBinding,
} from '@/core/types/plan-standard.types'
import type { ArtifactGraphPort } from '@/features/F-artifact/contract/artifact-contract'

import { createArtifact } from '@/features/F-artifact/contract/artifact-contract'
import { LIV_STANDARD_DOMAIN_BINDING } from '@/features/F-plan/contract/liv-standard-binding'
import { PLANNER_CONST } from '@/features/F-builder/config/builder-const'
import { generateId } from '@/core/types/primitives'

// ─── Authoring program identity (Plan v2.2 §6 custody: caller R0) ────────────

const AUTHORING_PROGRAM: AuthoringProgramRef = {
  programId:      'F-builder',
  programVersion: 'v1.5.1' as Semver,
}

// ─── Plan's canonical LIV-Standard declaration chain ─────────────────────────
// Sequence: IN-MAIN → IN-BUILD → IN-RESOLVE → IN-AUDIT → IN-COMPILE → IN-QA.
// IN-COMPILE carries a nested loop topology declaration (main→diagnose→main).
// DeclIds are plan-local identifiers; resolved against binding.roleClasses per PA8.

const DECL_ORDER: ReadonlyArray<RoleClassId> = [
  'IN-MAIN'      as RoleClassId,
  'IN-BUILD'     as RoleClassId,
  'IN-RESOLVE'   as RoleClassId,
  'IN-AUDIT'     as RoleClassId,
  'IN-COMPILE'   as RoleClassId,
  'IN-QA'        as RoleClassId,
]

// Wire atom refs — resolved against binding.roleClasses[role].inputType/outputType.
// Canonical W-ATOM for instance I/O per LIV-Standard v1.5.1.
const INSTANCE_INPUT_REF:  TypedAtomRef = 'InstanceInput'  as TypedAtomRef
const INSTANCE_OUTPUT_REF: TypedAtomRef = 'InstanceOutput' as TypedAtomRef

// ─── PA2b — acyclicity check on contract.wireMap ─────────────────────────────
// Iterative DFS with white/grey/black coloring. Any back-edge → cycle.
// Runs pre-composition; failure returns PlanValidityError before PlanInput assembly.

function hasCycleInWireMap(wireMap: ReadonlyArray<WireEntry>): boolean {
  // Build adjacency from W-ATOM / W-INJECT / W-HOOK / W-EVENT edges.
  // All wire variants carry { from: string, to: string } — collapse to node graph.
  const adj = new Map<string, Set<string>>()
  for (const w of wireMap) {
    const s = adj.get(w.from) ?? new Set<string>()
    s.add(w.to)
    adj.set(w.from, s)
  }

  const WHITE = 0, GREY = 1, BLACK = 2
  const color = new Map<string, number>()
  for (const node of adj.keys()) color.set(node, WHITE)
  for (const targets of adj.values()) {
    for (const t of targets) if (!color.has(t)) color.set(t, WHITE)
  }

  // Iterative DFS with explicit stack; avoids recursion limits on large graphs.
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
      if (c === GREY)  return true        // back-edge → cycle
      if (c === BLACK) continue            // already resolved subtree
      color.set(next, GREY)
      stack.push({ node: next, iter: (adj.get(next) ?? new Set<string>()).values() })
    }
  }

  return false
}

// ─── Composition helpers ─────────────────────────────────────────────────────

/**
 * Compose PlanShape.
 * Topology: 'sequence' for the six-role chain (IN-MAIN → ... → IN-QA).
 * Plan v2.2 PlanShape carries a single top-level topology; nested topologies
 * are not part of the schema. IN-COMPILE's loop semantics (main→diagnose→main)
 * are expressed plan-globally via PlanLimit.perSet.maxReentries (see composeLimit).
 *
 * Declarations: one per role in DECL_ORDER. dependsOn[i] = [DECL_ORDER[i-1]].
 * dataFlow[i] = [{ from: prevDeclId, wire: INSTANCE_OUTPUT_REF }] (PA11 + PA12).
 */
function composeShape(): PlanShape {
  const declarations: Declaration[] = DECL_ORDER.map((role, i) => {
    const id         = role as unknown as DeclId
    const dependsOn: DeclId[] = i === 0 ? [] : [DECL_ORDER[i - 1] as unknown as DeclId]
    const dataFlow            = i === 0
      ? []
      : [{ from: DECL_ORDER[i - 1] as unknown as DeclId, wire: INSTANCE_OUTPUT_REF }]
    return { id, dependsOn, dataFlow }
  })

  return { topology: 'sequence', declarations }
}

/**
 * Compose PlanIntent — keyed by DeclId.
 * Each entry: role (= DeclId string), input/output contract refs, tierHint from
 * binding.roleClasses[role].tierHint (PA8).
 */
function composeIntent(binding: DomainBinding): PlanIntent {
  const intent: PlanIntent = {}
  for (const role of DECL_ORDER) {
    const declId = role as unknown as string
    const roleInstance = binding.roleClasses[role as unknown as string]
    if (!roleInstance) {
      // PA8 violation surfaces at validity gate, not here. Skip the entry —
      // the missing key is fail-evidence the gate layer reports. Binding is
      // frozen at module load and known complete → this branch is unreachable
      // in Phase 5.
      continue
    }
    const entry: IntentEntry = {
      role:           role,
      inputContract:  roleInstance.inputType.ref,
      outputContract: roleInstance.outputType.ref,
      tierHint:       roleInstance.tierHint,
    }
    intent[declId] = entry
  }
  return intent
}

/**
 * Compose PlanCapacity — per-declaration estimated cost.
 * Phase 5: uniform estimate per tier class from binding.tierLimits.
 * Post-Phase 5: read contract.bundleScope token estimates and split large
 * declarations via binding.splitAxis (carries splitLineage).
 */
function composeCapacity(binding: DomainBinding): PlanCapacity {
  const capacity: PlanCapacity = {}
  for (const role of DECL_ORDER) {
    const declId       = role as unknown as string
    const roleInstance = binding.roleClasses[role as unknown as string]
    if (!roleInstance) continue
    const tierBudget   = binding.tierLimits[roleInstance.tierHint as unknown as string]
    // Default estimate = full tier budget (conservative; IN-AUDIT can reject).
    const estimatedCost = tierBudget?.budget ?? 0
    capacity[declId] = { estimatedCost }
  }
  return capacity
}

/**
 * Compose PlanLimit — per-declaration retry budget + per-set failsafes.
 * perDecl.retryBudget sourced from PLANNER_CONST.RETRY_LIMITS (PA4a).
 * perSet derived from PLANNER_CONST.FAILSAFE (PA4b).
 * maxReentries is plan-global per Plan v2.2 PerSetLimit; it expresses the
 * IN-COMPILE diagnose→retry loop without an additional PlanShape record.
 */
function composeLimit(binding: DomainBinding): PlanLimit {
  const perDecl: { [declId: string]: { retryBudget: number } } = {}
  for (const role of DECL_ORDER) {
    const declId = role as unknown as string
    // Map RoleClassId → PLANNER_CONST.RETRY_LIMITS key. Only stages with explicit
    // retry budgets are keyed; IN-MAIN has no retries (0).
    const retryBudget = lookupRetryBudget(role)
    perDecl[declId] = { retryBudget }
  }

  const perSet = {
    maxTime:        PLANNER_CONST.FAILSAFE.MAX_BUILD_TIME_MS as Milliseconds,
    maxTransitions: PLANNER_CONST.FAILSAFE.MAX_TRANSITIONS,
    maxReentries:   PLANNER_CONST.FAILSAFE.MAX_REENTRIES,
    partialSuccess: { allowed: false },
    domainFailsafes: binding.domainFailsafes,
  }

  return { perDecl, perSet }
}

function lookupRetryBudget(role: RoleClassId): number {
  const key = role as unknown as string
  // RETRY_LIMITS is a const with specific keys; coerce via switch for type safety.
  switch (key) {
    case 'IN-BUILD':    return PLANNER_CONST.RETRY_LIMITS.IN_BUILD
    case 'IN-RESOLVE':  return PLANNER_CONST.RETRY_LIMITS.IN_RESOLVE
    case 'IN-AUDIT':    return PLANNER_CONST.RETRY_LIMITS.IN_AUDIT
    case 'IN-QA':       return PLANNER_CONST.RETRY_LIMITS.IN_QA
    case 'IN-COMPILE':  return PLANNER_CONST.RETRY_LIMITS.IN_COMPILE_LOOP
    case 'IN-MAIN':     return 0   // terminal-only; no retries
    case 'IN-DIAGNOSE': return 0   // side-routed; no retries of its own
    default:            return 0
  }
}

// ─── Error factory ───────────────────────────────────────────────────────────

function planValidityError(failedAxiom: string, message: string): PlanValidityError {
  return {
    code:         'PLAN_VALIDITY_FAILED',
    message,
    failedAxiom,
    context:      { failedAxiom },
  }
}

function planEmissionRejected(message: string, cause?: unknown): PlanValidityError {
  return {
    code:    'PLAN_EMISSION_REJECTED',
    message,
    context: { cause: cause ?? null },
  }
}

// ─── emitPlanForContract — public entry point ────────────────────────────────

/**
 * Compose a PlanArtifactContent from an IfContract and emit it via F-artifact.
 *
 * Steps:
 *   1. PA2b acyclicity check on contract.wireMap.
 *   2. Compose PlanShape (sequence, IN-MAIN → ... → IN-QA).
 *   3. Compose PlanIntent (per-role entries from binding.roleClasses, PA3/PA8).
 *   4. Compose PlanCapacity (per-role estimates from binding.tierLimits).
 *   5. Compose PlanLimit (perDecl retry budgets + perSet failsafes, PA4a/PA4b).
 *   6. Construct PlanInput; derive PlanArtifactContent; wrap in ArtifactPayload.
 *   7. Invoke F-artifact createArtifact; return writes.a7.artifactAnchorNodeId.
 *
 * Return:
 *   Result.ok({ planAnchorNodeId })        — on successful AS emission
 *   Result.err(PlanValidityError)          — on PA2b cycle / AS rejection
 */
export async function emitPlanForContract(
  contract: IfContract,
  deps: {
    graph: ArtifactGraphPort
    userId: UserId
    turnId: string
    /** Cognitive classification for A4 writes; supplied by caller (codec result). */
    classificationNodeId: NodeId
    primitive:            CognitivePrimitive
    confidence:           number
    /** Optional previous plan anchor for ArA4c version edge (re-plan per PA5). */
    priorPlanAnchorNodeId?: NodeId
    /** Semver for this plan emission. Caller bumps on re-plan (PA5). */
    planVersion: Semver
  },
): Promise<Result<{ planAnchorNodeId: NodeId }, PlanValidityError>> {
  // Step 1 — PA2b acyclicity
  if (hasCycleInWireMap(contract.wireMap)) {
    return {
      ok: false,
      error: planValidityError('PA2b', 'contract.wireMap contains a cycle'),
    }
  }

  // Step 2–5 — Compose plan sections
  const binding  = LIV_STANDARD_DOMAIN_BINDING
  const shape    = composeShape()
  const intent   = composeIntent(binding)
  const capacity = composeCapacity(binding)
  const limit    = composeLimit(binding)

  // Step 6 — Construct PlanInput and PlanArtifactContent
  const planInput: PlanInput = {
    authoringProgram: AUTHORING_PROGRAM,
    userId:           deps.userId,
    turnId:           deps.turnId,
    domainBinding:    binding,        // PA9: captured verbatim
    preplanInputs:    contract,       // domain-typed: LIV-Standard IfContract
  }

  const planId: PlanId = generateId('plan') as PlanId
  const producedAt: EpochMs = Date.now() as EpochMs

  const planContent: PlanArtifactContent = {
    planId,
    planVersion: deps.planVersion,
    producedBy:  planInput.authoringProgram,
    producedAt,
    binding:     planInput.domainBinding,    // PA9: verbatim
    shape,
    intent,
    capacity,
    limit,
  }

  // ArtifactPayload — AS carries PlanArtifactContent verbatim as content.
  const payload: ArtifactPayload = {
    domain:        'plan',
    domainVersion: 'v2.2' as Semver,
    schemaRef:     'PlanArtifactContent',
    content:       planContent,
  }

  // Step 7 — Emit via F-artifact.
  // dependsOn carries priorPlanAnchorNodeId when present (PA5 re-plan → ArA4c version edge).
  const createInput: CreateArtifactInput = {
    framework: {
      id:      AUTHORING_PROGRAM.programId,
      version: AUTHORING_PROGRAM.programVersion,
    },
    turnId:               deps.turnId,
    userId:               deps.userId,
    payload,
    classificationNodeId: deps.classificationNodeId,
    primitive:            deps.primitive,
    confidence:           deps.confidence,
    dependsOn:            deps.priorPlanAnchorNodeId ? [deps.priorPlanAnchorNodeId] : undefined,
  }

  const emissionResult = await createArtifact(createInput, deps.graph)
  if (!emissionResult.ok) {
    return {
      ok: false,
      error: planEmissionRejected(
        `F-artifact rejected plan emission: ${emissionResult.error.code}`,
        emissionResult.error,
      ),
    }
  }

  const emission: ArtifactEmission = emissionResult.data
  return {
    ok: true,
    data: { planAnchorNodeId: emission.writes.a7.artifactAnchorNodeId },
  }
}
