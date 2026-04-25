// @liv-standard v1.5.1
// [F-plan/R2]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction)
// slice:      F-plan
// layer:      R2
// wires-in:
//   W-ATOM    Result, NodeId, Semver                       ← core/R5 primitives
//   W-ATOM    EpochMs, PlanArtifactContent                 ← core/R5 plan-standard.types
//   W-ATOM    CreateArtifactInput, ArtifactPayload         ← core/R5 artifact-standard.types
//   W-ATOM    PlanDraftState, PlanArtifactSummary, PlanRejectError ← F-plan/R0 plan-types
//   W-ATOM    PLAN_STANDARD_ID, PLAN_STANDARD_VERSION, PLAN_SCHEMA_REF, PLAN_DOMAIN_BINDING, PLAN_CONFIRM_KEYWORDS ← F-plan/R0 plan-const
//   W-HOOK    compose                                       ← F-plan/R1 plan-compose
//   W-HOOK    buildComposerInput                            ← F-plan/R2 plan-draft (shared util)
//   W-INJECT  IPlanDb, IPlanGraph                           ← F-plan/R3 plan-inject (type-only)
// wires-out:
//   W-HOOK    isConfirmKeyword     →  F-plan/R3 plan-contract
//   W-HOOK    confirmAndEmit       →  F-plan/R3 plan-contract
// deps:
//   R0  ../types/plan-types
//   R0  ../types/plan-const
//   R1  ../domain/plan-compose
//   R2  ../app/plan-draft (sibling — shared util buildComposerInput)
//   R3  ../contract/plan-inject (type import only)
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
// validated:  pending
//
// F-plan R2 — confirmation gate + AS v2.3 emission orchestration.
// A2: imports R1 (compose), R0 (atoms), R2 sibling (plan-draft buildComposerInput),
//     R3 (port types). NO direct exec/ imports. NO cross-slice imports outside R3.
// A4: epochNow + generateId injected. No ambient I/O.
//
// Sprint A note: plan-emit lives at app/ (mirroring plan-draft.ts location). Spec
// §3.2 lists workflow/plan-emit.ts; project precedent (F-codec, F-memory) puts
// orchestration files under app/. Decision-D D-FILES-LAYOUT folded into D-FILES:
// kept at app/ for consistency with sibling plan-draft.ts and project precedent.

import type { Result, NodeId, Semver } from '@/core/types/primitives'
import type {
  EpochMs,
  PlanArtifactContent,
} from '@/core/types/plan-standard.types'
import type {
  CreateArtifactInput,
  ArtifactPayload,
} from '@/core/types/artifact-standard.types'
import type {
  PlanDraftState,
  PlanArtifactSummary,
  PlanRejectError,
} from '../types/plan-types'
import {
  PLAN_STANDARD_ID,
  PLAN_STANDARD_VERSION,
  PLAN_SCHEMA_REF,
  PLAN_DOMAIN_BINDING,
  PLAN_CONFIRM_KEYWORDS,
} from '../types/plan-const'
import { compose } from '../domain/plan-compose'
import {
  buildComposerInput,
  type ExecutePlanInput,
  type R2Deps,
} from './plan-draft'
import type { IPlanDb, IPlanGraph } from '../contract/plan-inject'

// ═══════════════════════════════════════════════════════════════════════════
// D-CONFIRM-PATTERN — confirmation keyword matcher
// ═══════════════════════════════════════════════════════════════════════════

/**
 * D-CONFIRM-PATTERN: case-insensitive, exact-token, whole-message-after-trim.
 *
 *   `content.trim().toLowerCase() ∈ PLAN_CONFIRM_KEYWORDS`
 *
 * Substring matches DO NOT count. "yes please" → false. "Yes" → true.
 *
 * Pure. Deterministic. No I/O.
 */
export function isConfirmKeyword(content: string): boolean {
  if (typeof content !== 'string') return false
  const normalized = content.trim().toLowerCase()
  return PLAN_CONFIRM_KEYWORDS.includes(normalized)
}

// ═══════════════════════════════════════════════════════════════════════════
// AS v2.3 EMISSION — confirmAndEmit
// ═══════════════════════════════════════════════════════════════════════════

// ─── PA5 chain semver bump helper ────────────────────────────────────────────
// When amending an emitted plan (existingDraft.priorAnchorNodeId is set), we
// bump the planVersion. Sprint A: simple major-bump '1.0.0' → '2.0.0' for any
// re-emission. Refined version-stepping (patch/minor) deferred to next iteration.
//
// Pure. The bump rule lives at R2 (orchestration policy), not R0 (atom decl).
// If next-iteration introduces semver-stepping policy as binding-level constant,
// it migrates to R0 PLAN_CONST.

function nextPlanVersion(priorAnchorNodeId: NodeId | null): Semver {
  if (priorAnchorNodeId === null) return '1.0.0' as Semver
  // Sprint A simple bump — major increments per re-emission.
  // Reading prior planVersion from the prior anchor would require a graph read
  // here; deferred to next iteration. For Sprint A, every re-emission lands at
  // '2.0.0'. Auditor confirms this is acceptable Sprint A scaffolding.
  return '2.0.0' as Semver
}

// ─── confirmAndEmit ──────────────────────────────────────────────────────────

/**
 * Confirmation gate + AS v2.3 emission.
 *
 * F006: composes against existingDraft.originalUserMessage (last actual
 * intent), NOT input.content (the confirm keyword). Confirm is a control
 * signal; the emitted artifact must represent the user's actual plan.
 *
 * F005 three-state lifecycle:
 *   1. db.markEmitting(draftId, now)            draft → emitting
 *   2. graph.createArtifact(input, port)        durable graph deposit
 *   3. db.markEmitted(draftId, anchor, now)     emitting → emitted
 *
 *   Step 1 fail: lane was raced or already terminal → PLAN_DRAFT_NOT_FOUND.
 *   Step 2 fail: lane stays at 'emitting' → PLAN_EMISSION_REJECTED. Operator
 *                can retry from existing 'emitting' row (admin tooling, out
 *                of scope here).
 *   Step 3 fail: graph already has the plan → PLAN_EMITTED_BUT_NOT_RECORDED
 *                carrying planAnchorNodeId for admin reconciliation. Lane
 *                stays at 'emitting'.
 *
 * Graph state is re-read fresh per spec §3.6 ("captures whatever's in graph
 * at confirm-time"). Only the userMessage source changes from input.content
 * to existingDraft.originalUserMessage (F006).
 *
 * Identity layering at AS site (Plan Standard v2.2 §6.11 + §10):
 *   AS carrier identity (Plan Standard) → 'plan' / '2.2'
 *     framework.id           = PLAN_STANDARD_ID
 *     framework.version      = PLAN_STANDARD_VERSION
 *     payload.domain         = PLAN_STANDARD_ID
 *     payload.domainVersion  = PLAN_STANDARD_VERSION
 *     payload.schemaRef      = PLAN_SCHEMA_REF
 *   Authoring identity (F-plan) → 'F-plan' / '1.0.0' (lives at producedBy
 *     inside payload.content, set by compose() — never at AS carrier)
 *
 * AS v2.3 shape: CreateArtifactInput carries projectId per ArA4c chain key
 * (framework.id, userId, projectId). Cast through unknown is overlay-tolerant.
 */
export async function confirmAndEmit(
  existingDraft: PlanDraftState,
  input:         ExecutePlanInput,
  db:            IPlanDb,
  graph:         IPlanGraph,
  deps:          R2Deps,
): Promise<Result<{ planAnchorNodeId: NodeId; summary: PlanArtifactSummary }, PlanRejectError>> {
  // F006: compose against the prior draft's original user message, not the
  // confirm keyword. confirm is a control signal — input.content is 'yes' /
  // 'confirm' / 'go' / 'proceed' (per D-CONFIRM-PATTERN). The emitted
  // artifact must represent actual user intent, which is the last amend (or
  // initial draft) content captured in originalUserMessage.
  //
  // Graph state still re-read fresh per spec §3.6 ("captures whatever's in
  // graph at confirm-time") — only the userMessage field of PlanComposerInput
  // changes from input.content to existingDraft.originalUserMessage.
  const composerInput = buildComposerInput(
    existingDraft.originalUserMessage,
    graph,
    input.userId,
    deps,
  )
  const composeResult = compose(composerInput, PLAN_DOMAIN_BINDING, deps)

  // Compose failure → validity error pass-through. Don't transition the
  // draft — user can amend.
  if (!composeResult.ok) {
    return {
      ok: false,
      error: {
        code:        'PLAN_VALIDITY_FAILED',
        message:     composeResult.error.message,
        failedAxiom: composeResult.error.failedAxiom,
        context:     { ...(composeResult.error.context ?? {}) },
      },
    }
  }

  // PA5: when amending, bump planVersion off the prior anchor.
  const composedContent: PlanArtifactContent = {
    ...composeResult.data,
    planVersion: nextPlanVersion(existingDraft.priorAnchorNodeId),
  }

  // F005: three-state lifecycle. Mark draft 'emitting' BEFORE graph write.
  // Guards against:
  //   (a) double-confirm races — second markEmitting fails on lane already
  //       transitioned (WHERE status='draft' returns zero rows).
  //   (b) silent half-state on crash mid-emission — lane stays at 'emitting'
  //       for explicit admin reconciliation rather than disappearing into a
  //       'draft' state that suggests no emit was attempted.
  const markEmittingNow: EpochMs = deps.epochNow()
  const emittingResult = await db.markEmitting(existingDraft.draftId, markEmittingNow)
  if (!emittingResult.ok) {
    if (emittingResult.error.code === 'NOT_FOUND') {
      // Lane no longer in 'draft' — concurrent confirm raced ahead, or draft
      // already terminal. Surface as DRAFT_NOT_FOUND for caller to retry.
      return {
        ok: false,
        error: {
          code:    'PLAN_DRAFT_NOT_FOUND',
          message: 'Draft no longer in draft status (concurrent confirm or terminal lane)',
          context: { draftId: existingDraft.draftId },
        },
      }
    }
    return {
      ok: false,
      error: {
        code:    'PLAN_VALIDITY_FAILED',
        message: 'Failed to mark draft emitting',
        context: { cause: emittingResult.error },
      },
    }
  }

  // Build CreateArtifactInput (AS v2.3 shape).
  // Carrier identity = Plan Standard (content framework that defines the
  // artifact's structural contract). NOT F-plan's authoring identity.
  const payload: ArtifactPayload = {
    domain:        PLAN_STANDARD_ID,
    domainVersion: PLAN_STANDARD_VERSION,
    schemaRef:     PLAN_SCHEMA_REF,
    content:       composedContent,
  }

  // F001: PA5 chain edge auto-derived by AS via lookupPriorAnchor — do NOT
  // thread priorAnchor here. AS resolves the kind:'version' edge against
  // the chain key (framework.id, userId, projectId). Manually threading
  // existingDraft.priorAnchorNodeId would produce a double-edge (one
  // auto-derived + one manual-derived). dependsOn stays empty for plan
  // emissions.
  const dependsOn: NodeId[] = []

  // AS v2.3: CreateArtifactInput carries projectId per ArA4c chain key.
  // Cast through unknown keeps source tolerant of v2.2 (current tar) and
  // v2.3 (post-overlay) — projectId lands as excess property at v2.2.
  const createInput: CreateArtifactInput = {
    framework: {
      id:      PLAN_STANDARD_ID,
      version: PLAN_STANDARD_VERSION,
    },
    turnId:               input.turnId,
    userId:               input.userId,
    projectId:            input.projectId,
    payload,
    classificationNodeId: composerInput.classification.classificationNodeId,
    primitive:            composerInput.classification.primitive,
    confidence:           composerInput.classification.confidence,
    dependsOn,
  } as unknown as CreateArtifactInput

  // AS emission. Lane is at 'emitting'; graph write is the durable step.
  const port = graph.createArtifactGraphPort()
  const emitResult = await graph.createArtifact(createInput, port)
  if (!emitResult.ok) {
    // Graph write failed. Lane stays at 'emitting' (NOT rolled back to
    // 'draft') — F005 audit point: the user's confirm intent was captured;
    // if the failure is transient (e.g. AS pipeline temporarily down), an
    // operator can retry the emission against the existing 'emitting' row.
    // Sprint A scope: surface the rejection; admin tooling for explicit
    // retry-from-emitting is downstream work.
    return {
      ok: false,
      error: {
        code:    'PLAN_EMISSION_REJECTED',
        message: 'F-artifact rejected createArtifact (lane in emitting state)',
        context: { cause: emitResult.error, draftId: existingDraft.draftId },
      },
    }
  }

  const planAnchorNodeId = emitResult.data.writes.a7.artifactAnchorNodeId

  // F005: terminal transition emitting → emitted. Sets emittedAnchorNodeId.
  const markEmittedNow: EpochMs = deps.epochNow()
  const markEmittedResult = await db.markEmitted(existingDraft.draftId, planAnchorNodeId, markEmittedNow)
  if (!markEmittedResult.ok) {
    // F005: graph write succeeded; DB markEmitted failed. Plan IS in graph;
    // local draft tracking inconsistent. Lane stays at 'emitting' until
    // admin reconciliation. Explicit named error code so caller can
    // distinguish from the more common PLAN_EMISSION_REJECTED case.
    return {
      ok: false,
      error: {
        code:    'PLAN_EMITTED_BUT_NOT_RECORDED',
        message: 'Plan emitted to graph; failed to mark draft emitted in DB (lane stays at emitting)',
        context: { planAnchorNodeId, draftId: existingDraft.draftId, cause: markEmittedResult.error },
      },
    }
  }

  // Build summary.
  const objectiveCount = composedContent.shape.declarations.length
  const summary: PlanArtifactSummary = {
    planAnchorNodeId,
    body:           `Plan emitted with ${objectiveCount} objective${objectiveCount === 1 ? '' : 's'}.`,
    objectiveCount,
    planVersion:    composedContent.planVersion,
  }

  return { ok: true, data: { planAnchorNodeId, summary } }
}

// ─── End of plan-emit.ts ─────────────────────────────────────────────────────
