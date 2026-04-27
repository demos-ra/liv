// @liv-standard v1.5.1
// [F-plan/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), lm-v2-2-shot2, lm-v2-2-shot4
// slice:      F-plan
// layer:      R2
// wires-in:
//   W-ATOM    Result, NodeId, UserId, CognitivePrimitive  ←  core/R5 primitives
//   W-ATOM    EpochMs                                      ←  core/R5 plan-standard.types
//   W-ATOM    PlanArtifactContent, PlanValidityError       ←  core/R5 plan-standard.types
//   W-ATOM    PlanDraftId, PlanDraftState, PlanDraftSummary ← F-plan/R0 plan-types
//   W-ATOM    PlanComposerInput, PlanRejectError           ← F-plan/R0 plan-types
//   W-ATOM    PLAN_PROGRAM_ID, PLAN_AUTHORING_PROGRAM_VERSION, PLAN_DOMAIN_BINDING ← F-plan/R0 plan-const
//   W-HOOK    compose                                       ← F-plan/R1 plan-compose
//   W-INJECT  IPlanDb, IPlanGraph                           ← F-plan/R3 plan-inject (type-only)
// wires-out:
//   W-HOOK    createDraft           →  F-plan/R3 plan-contract
//   W-HOOK    amendDraft            →  F-plan/R3 plan-contract
//   W-HOOK    getDraftSummary       →  F-plan/R3 plan-contract
//   W-HOOK    buildComposerInput    →  F-plan/R2 plan-emit (shared util)
// deps:
//   R0  ../types/plan-types
//   R0  ../types/plan-const
//   R1  ../domain/plan-compose
//   R3  ../contract/plan-inject (type import only)
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
// validated:  pending
//
// F-plan R2 — draft lifecycle orchestration.
// A2: imports R1 (compose), R0 (atoms, const), R3 (port types only). NO direct
//     imports from exec/, NO sibling app/ imports (plan-emit imports util from
//     here; reverse direction is forbidden).
// A4: epochNow + generateId injected via deps. No Date.now / Math.random / DB.

import type { Result, NodeId, CognitivePrimitive } from '@/core/types/primitives'
import type {
  EpochMs,
} from '@/core/types/plan-standard.types'
import type {
  PlanDraftId,
  PlanDraftState,
  PlanDraftSummary,
  PlanComposerInput,
  PlanComposerStatement,
  PlanRejectError,
} from '../types/plan-types'
import {
  PLAN_PROGRAM_ID,
  PLAN_AUTHORING_PROGRAM_VERSION,
  PLAN_DOMAIN_BINDING,
} from '../types/plan-const'
import { compose } from '../domain/plan-compose'
import type { IPlanDb, IPlanGraph } from '../contract/plan-inject'

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL ATOMS — consumed at R2/R3 only
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input shape for createDraft / amendDraft / confirmAndEmit. Built at R3
 * executePlan from caller args. Carries the turnId per Decision-D row D-TURNID
 * (caller-supplied; Sprint B threads codec's turnId; smoke harness generates).
 */
export type ExecutePlanInput = {
  content:    string
  userId:     string
  projectId:  string
  turnId:     string
  modelId?:   string
}

/**
 * Deps injected into R2 functions. Keeps R2 free of ambient I/O (A4).
 */
export type R2Deps = {
  generateId: (prefix?: string) => string
  epochNow:   () => EpochMs
}

// ─── ARTIFACT_PREFIX ────────────────────────────────────────────────────────
// Per spec §3.3.2: F-plan does not introduce new F-memory queries this sprint.
// The prefix string is owned by F-codec/R0 codec-artifact-types — but importing
// across slices for a single string constant would create a coupling that
// outlives the actual semantic dependency. F-plan declares it locally as a
// match string against present-state values, with a doc-comment cite.
//
// Coupling note: if F-codec ever changes the prefix, F-plan's findingsRefs
// filter silently drops to empty. Acceptable risk Sprint A — auditor flags
// at review if cross-slice constant alignment is needed (next-iteration via
// R5 atom or shared core constant).

const ARTIFACT_PREFIX = '[artifact:'

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSER INPUT BUILDER (shared util — also consumed by plan-emit.ts)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Assemble PlanComposerInput from raw user content + F-memory present-state.
 *
 * Per spec §3.3.2: graphContext uses Present (LM v2.2 §D, was v2.1
 * getPresentState) + ARTIFACT_PREFIX filter
 * for findingsRefs. F-plan reads typed cognitive output
 * F-codec already deposited — never re-encodes.
 *
 * D-TURNID note: turnId flows through input.turnId (caller-supplied).
 *
 * Classification stub: post-A6 cognitive output isn't directly readable from
 * present-state (PresentStateStatement carries { arm, value, source, layer,
 * confidence, recency } — none of which is F-codec's classificationNodeId /
 * primitive / numeric-confidence). Sprint A returns a synthetic classification
 * keyed off the user message; Sprint B's registry-pointer wire threads
 * F-codec's actual encodeLLM result through. Audit point: this is intentional
 * Sprint A scaffolding, not a final wiring.
 *
 *   classificationNodeId  := generated F-plan-local id (will be replaced by
 *                            F-codec's actual classificationNodeId at Sprint B)
 *   primitive             := 'restructure' (structural-mode default — codec-
 *                            planning route classification maps structural mode
 *                            to restructure / anchor depending on graph state;
 *                            Sprint A picks restructure as the conservative
 *                            stand-in for "user is structuring intent")
 *   confidence            := 0.5 (neutral; will be replaced)
 */
export function buildComposerInput(
  userMessage: string,
  graph:       IPlanGraph,
  userId:      string,
  deps:        R2Deps,
): PlanComposerInput {
  // lm-v2-2-shot2: graph.present({scope: {user: userId}}) per LM v2.2 §D.
  const presentState = graph.present({ scope: { user: userId } })
  void presentState  // currently unused — see D-PLAN-DEAD-BOOKKEEPING below

  // lm-v2-2-shot4 (D-PLAN-DEAD-BOOKKEEPING): pre-flight identified that
  // graphContext.statements + graphContext.findingsRefs flow into
  // PlanComposerInput but are never read by compose() — the composer body
  // (plan-compose.ts:284) reads only input.userMessage, input.classification,
  // and input.authoring. The Shot 2 carry-forward populated these fields
  // from presentState.statements (v2.1 shape). Per Shot 4 PresentState body
  // swap, the v2.1 shape no longer exists; rather than re-architect the
  // dead-bookkeeping path through new accessors at the IPlanGraph port,
  // we drop the population and emit empty arrays. PlanComposerInput.shape
  // is preserved (no plan-types.ts touch) for cross-slice stability.
  // When a live composer consumer surfaces (Shot 5+), this populates from
  // presentState.projected via a graph accessor extension on IPlanGraph.
  const statements: PlanComposerStatement[] = []
  const findingsRefs: string[] = []

  // Sprint A synthetic classification — see doc above.
  const classificationNodeId = deps.generateId('plan-classify') as NodeId
  const primitive: CognitivePrimitive = 'restructure'
  const confidence = 0.5

  return {
    userMessage,
    classification: {
      classificationNodeId,
      primitive,
      confidence,
    },
    graphContext: {
      statements,
      findingsRefs,
    },
    authoring: {
      programId:      PLAN_PROGRAM_ID,
      programVersion: PLAN_AUTHORING_PROGRAM_VERSION,
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DRAFT LIFECYCLE — public R3 surface
// ═══════════════════════════════════════════════════════════════════════════

// ─── createDraft ─────────────────────────────────────────────────────────────

/**
 * Compose a fresh draft from graph state and persist it.
 *
 *   1. buildComposerInput from graph state.
 *   2. compose() — pure, returns Result<PlanArtifactContent, PlanValidityError>.
 *   3. Persist as PlanDraftState (status='draft' or null content + errors on fail).
 *   4. Return persisted state.
 *
 * On compose failure: still persist a draft row (status='draft', composedContent=null,
 * validityErrors populated) so the user can amend without losing the lane slot.
 * Caller (R3 executePlan) decides whether to surface the validity error to
 * the user or just show the empty draft summary.
 *
 * D-PROJECT enforcement: handled at R3 executePlan before reaching here.
 * createDraft assumes projectId is non-empty.
 */
export async function createDraft(
  input: ExecutePlanInput,
  db:    IPlanDb,
  graph: IPlanGraph,
  deps:  R2Deps,
): Promise<Result<PlanDraftState, PlanRejectError>> {
  // Step 1–2: build composer input + compose.
  const composerInput = buildComposerInput(input.content, graph, input.userId, deps)
  const composeResult = compose(composerInput, PLAN_DOMAIN_BINDING, deps)

  // Step 3: persist draft. status='draft' regardless of compose success —
  // failure persists with validityErrors populated, success persists with
  // composedContent populated.
  // F006: persist input.content as originalUserMessage so the confirm path
  // composes the emitted artifact against actual intent rather than the
  // confirm keyword.
  const now      = deps.epochNow()
  const draftId  = deps.generateId('plan-draft') as PlanDraftId
  const state: PlanDraftState = {
    draftId,
    userId:               input.userId,
    projectId:            input.projectId,
    turnId:               input.turnId,
    status:               'draft',
    composedContent:      composeResult.ok ? composeResult.data : null,
    validityErrors:       composeResult.ok ? null : [composeResult.error],
    originalUserMessage:  input.content,
    createdAt:            now,
    updatedAt:            now,
    emittedAnchorNodeId:  null,
    priorAnchorNodeId:    null,
  }

  const insertResult = await db.insert(state)
  if (!insertResult.ok) {
    // DB error — surface as PLAN_VALIDITY_FAILED carrying DB cause. Caller
    // (executePlan) maps to top-level error.
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to persist draft',
        context: { cause: insertResult.error },
      },
    }
  }

  return { ok: true, data: state }
}

// ─── amendDraft ──────────────────────────────────────────────────────────────

/**
 * Re-compose against latest graph state and update existing draft row.
 *
 *   1. buildComposerInput from graph state (fresh read).
 *   2. compose().
 *   3. db.updateComposition(draftId, content, errors, originalUserMessage, now).
 *   4. Return refreshed PlanDraftState.
 *
 * The "amendment" semantics here is in-place update of the draft row, not
 * re-emission. Re-emission with PA5 chain happens via confirmAndEmit when the
 * user finally confirms; amendDraft is just the iterative-revision path.
 *
 * F006: each amend refreshes originalUserMessage to input.content. Each amend
 * is a new intent expression — the latest one is what the user wants emitted
 * when they finally confirm.
 */
export async function amendDraft(
  existingDraft: PlanDraftState,
  input:         ExecutePlanInput,
  db:            IPlanDb,
  graph:         IPlanGraph,
  deps:          R2Deps,
): Promise<Result<PlanDraftState, PlanRejectError>> {
  const composerInput = buildComposerInput(input.content, graph, input.userId, deps)
  const composeResult = compose(composerInput, PLAN_DOMAIN_BINDING, deps)

  const now: EpochMs = deps.epochNow()
  const composedContent = composeResult.ok ? composeResult.data : null
  const validityErrors  = composeResult.ok ? null : [composeResult.error]

  const updateResult = await db.updateComposition(
    existingDraft.draftId,
    composedContent,
    validityErrors,
    input.content,    // F006: refresh originalUserMessage with latest intent
    now,
  )
  if (!updateResult.ok) {
    if (updateResult.error.code === 'NOT_FOUND') {
      return {
        ok: false,
        error: {
          code:    'PLAN_DRAFT_NOT_FOUND',
          message: 'Draft no longer in draft status',
          context: { draftId: existingDraft.draftId },
        },
      }
    }
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to update draft composition',
        context: { cause: updateResult.error },
      },
    }
  }

  // Return refreshed state — in-memory reconstruction (avoids second DB read).
  // Matches what dbGetDraftById would return after the update.
  return {
    ok: true,
    data: {
      ...existingDraft,
      composedContent,
      validityErrors,
      originalUserMessage: input.content,    // F006: matches DB UPDATE
      updatedAt: now,
    },
  }
}

// ─── getDraftSummary ─────────────────────────────────────────────────────────

/**
 * Pure formatter: PlanDraftState → PlanDraftSummary. Used by executePlan to
 * shape the chat-render surface returned alongside { kind: 'draft' | 'amended' }.
 *
 * Body shape is chat-renderable text following the
 * ModuleExecutionResult.response convention. Sprint A keeps it minimal:
 * objective count + echo + brief next-step hint.
 *
 * Pure: no I/O. Caller may invoke synchronously.
 */
export function getDraftSummary(draft: PlanDraftState): PlanDraftSummary {
  const objectiveCount = draft.composedContent?.shape.declarations.length ?? 0
  const echo           = pickEcho(draft)

  const body = draft.composedContent === null
    ? `Draft created (no objectives extracted yet — please refine your message).`
    : `Draft plan: ${objectiveCount} objective${objectiveCount === 1 ? '' : 's'}. Reply 'yes' to confirm, or revise your message to amend.`

  return {
    draftId:        draft.draftId,
    body,
    objectiveCount,
    echo,
    status:         draft.status,
  }
}

// ─── Internal helper — extract user message echo from draft ──────────────────
// Best-effort echo: composedContent doesn't carry the original message, so we
// reconstruct from validity error context if present, or fall back to a
// generic notice. Sprint A: simplest defensible echo. Auditor confirms the
// summary is informative without being misleading.

function pickEcho(draft: PlanDraftState): string {
  if (draft.validityErrors !== null && draft.validityErrors.length > 0) {
    const firstErr = draft.validityErrors[0]
    if (firstErr.failedAxiom !== undefined) {
      return `(validation: ${firstErr.failedAxiom})`
    }
  }
  return ''
}

// ─── End of plan-draft.ts ────────────────────────────────────────────────────
