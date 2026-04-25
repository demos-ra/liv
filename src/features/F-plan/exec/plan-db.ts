// @liv-standard v1.5.1
// [F-plan/R4]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction), phase-6-cleanup-cycle-4 (F015 lane-emitting symmetry)
// slice:      F-plan
// layer:      R4
// wires-in:
//   W-ATOM  Result               ←  core/R5 primitives
//   W-ATOM  NodeId               ←  core/R5 primitives
//   W-ATOM  AppError             ←  core/R5 primitives
//   W-ATOM  EpochMs              ←  core/R5 plan-standard.types
//   W-ATOM  PlanArtifactContent  ←  core/R5 plan-standard.types
//   W-ATOM  PlanValidityError    ←  core/R5 plan-standard.types
//   W-ATOM  PlanDraftId          ←  F-plan/R0 plan-types
//   W-ATOM  PlanDraftState       ←  F-plan/R0 plan-types
//   W-ATOM  PlanDraftStatus      ←  F-plan/R0 plan-types
//   W-FN    db                   ←  core/R5 db/client
// wires-out:
//   W-FN  dbInsertPlanDraft           →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
//   W-FN  dbGetOpenDraft              →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
//   W-FN  dbGetDraftById              →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
//   W-FN  dbUpdateDraftComposition    →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
//   W-FN  dbMarkDraftEmitting         →  F-plan/R2, F-plan/R3 (Phase 6 cleanup F005)
//   W-FN  dbMarkDraftEmitted          →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
//   W-FN  dbMarkDraftSuperseded       →  F-plan/R2, F-plan/R3 (wired Shot 4 via IPlanDb port)
// deps:
//   R0  ../types/plan-types
//   R5  @/core/types/primitives
//   R5  @/core/types/plan-standard.types
//   R5  @/core/db/client
// validated:  pending
//
// F-plan R4 — DB I/O only. Mirror F-planner planner-db.ts pattern.
// A1: F-plan owns plan_drafts table. No other slice writes/reads it.
// A2: R4 imports R0 (atoms) and R5 (db client). Never imports R1, R2, R3.
//     R3's IPlanDb port (Shot 4) wraps these functions for injection.
// A3: PlanDraftRow is the typed DB boundary. mapDraftRow() casts row → atom.
//     No raw DB types escape this file.
// A4: ALL Postgres calls live here. Parameterized queries only — no string
//     interpolation into SQL. catch-and-wrap errors into typed AppError.
//     No business logic. No PA validation. No keyword matching.

import { db } from '@/core/db/client'

import type { Result, NodeId } from '@/core/types/primitives'
import type {
  EpochMs,
  PlanArtifactContent,
  PlanValidityError,
} from '@/core/types/plan-standard.types'
import type {
  PlanDraftId,
  PlanDraftState,
  PlanDraftStatus,
} from '../types/plan-types'

// ─── Row type — typed R4 boundary (A3) ───────────────────────────────────────
// Mirrors plan_drafts schema after migration 002-add-plan-drafts.sql.
// JSONB columns typed as `unknown` per A3 — narrowed in mapDraftRow().

type PlanDraftRow = {
  draft_id:                 string
  user_id:                  string
  project_id:               string
  turn_id:                  string
  status:                   string                          // narrowed at map site
  composed_content:         unknown                         // jsonb: PlanArtifactContent | null
  validity_errors:          unknown                         // jsonb: PlanValidityError[] | null
  original_user_message:    string                          // F006: last intent expression
  created_at:               string | number                 // BIGINT — node-postgres returns string for >2^53; coerce
  updated_at:               string | number
  emitted_anchor_node_id:   string | null
  prior_anchor_node_id:     string | null
}

// ─── Row mapper ──────────────────────────────────────────────────────────────
// Cast DB row → PlanDraftState atom. JSONB columns parse via type cast
// (Postgres jsonb returns deserialized JS objects; just narrow type).
//
// EpochMs branding via cast — node-pg returns BIGINT as string when value
// exceeds JS safe integer; epoch ms in this decade is comfortably within
// safe-integer range, but we coerce defensively.

function mapDraftRow(r: PlanDraftRow): PlanDraftState {
  // Status narrowing: DB CHECK constraint guarantees one of the four values.
  // Cast is sound; runtime divergence (manual DB edit) would be a bug elsewhere.
  const status = r.status as PlanDraftStatus

  const createdAt = (typeof r.created_at === 'string' ? Number(r.created_at) : r.created_at) as EpochMs
  const updatedAt = (typeof r.updated_at === 'string' ? Number(r.updated_at) : r.updated_at) as EpochMs

  return {
    draftId:              r.draft_id as PlanDraftId,
    userId:               r.user_id,
    projectId:            r.project_id,
    turnId:               r.turn_id,
    status,
    composedContent:      (r.composed_content ?? null) as PlanArtifactContent | null,
    validityErrors:       (r.validity_errors ?? null) as PlanValidityError[] | null,
    originalUserMessage:  r.original_user_message,
    createdAt,
    updatedAt,
    emittedAnchorNodeId:  r.emitted_anchor_node_id === null ? null : (r.emitted_anchor_node_id as NodeId),
    priorAnchorNodeId:    r.prior_anchor_node_id   === null ? null : (r.prior_anchor_node_id   as NodeId),
  }
}

// ─── SELECT column list (DRY) ────────────────────────────────────────────────
// Single source of truth for the column list — keeps SELECTs aligned with
// PlanDraftRow. RETURNING uses the same columns post-mutation.

const COLS = `
  draft_id, user_id, project_id, turn_id, status,
  composed_content, validity_errors, original_user_message,
  created_at, updated_at,
  emitted_anchor_node_id, prior_anchor_node_id
`.trim()

// ─── Error helpers ───────────────────────────────────────────────────────────

function dbError(message: string, cause: unknown): { ok: false; error: { code: 'DB_ERROR'; message: string; context: { cause: string } } } {
  return {
    ok: false,
    error: { code: 'DB_ERROR', message, context: { cause: String(cause) } },
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC SURFACE — ports wrapped at R3 plan-inject.ts (Shot 4)
// ═══════════════════════════════════════════════════════════════════════════

// ─── INSERT ──────────────────────────────────────────────────────────────────
// Persists a new draft row. Caller (R2 plan-draft.createDraft) constructs the
// PlanDraftState with status='draft' and null composedContent/emittedAnchor/prior.

export async function dbInsertPlanDraft(
  state: PlanDraftState,
): Promise<Result<void>> {
  try {
    await db.query(
      `INSERT INTO plan_drafts (
         draft_id, user_id, project_id, turn_id, status,
         composed_content, validity_errors, original_user_message,
         created_at, updated_at,
         emitted_anchor_node_id, prior_anchor_node_id
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        state.draftId,
        state.userId,
        state.projectId,
        state.turnId,
        state.status,
        state.composedContent === null ? null : JSON.stringify(state.composedContent),
        state.validityErrors  === null ? null : JSON.stringify(state.validityErrors),
        state.originalUserMessage,
        state.createdAt,
        state.updatedAt,
        state.emittedAnchorNodeId,
        state.priorAnchorNodeId,
      ],
    )
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('Failed to insert plan draft', e)
  }
}

// ─── SELECT open draft (lane lookup) ─────────────────────────────────────────
// Lane spans non-terminal states: 'draft' OR 'emitting'. Migration 003
// rebuilt idx_plan_drafts_open over both states; this query matches.
// At most one row by lane invariant (logical; backstopped by the partial
// index). Returns null when lane is empty.
// LIMIT 1 + ORDER BY created_at DESC defends against rare invariant violations
// — we always pick the newest draft if the index ever holds duplicates.
// F015: caller (executePlan / confirmDraft / getOpenDraftSummary) discriminates
// on result.status to handle 'emitting' rows distinctly from 'draft' rows.

export async function dbGetOpenDraft(
  userId:    string,
  projectId: string,
): Promise<Result<PlanDraftState | null>> {
  try {
    const result = await db.query<PlanDraftRow>(
      `SELECT ${COLS}
       FROM plan_drafts
       WHERE user_id = $1
         AND project_id = $2
         AND status IN ('draft', 'emitting')
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId, projectId],
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapDraftRow(result.rows[0]) }
  } catch (e) {
    return dbError('Failed to read open plan draft', e)
  }
}

// ─── SELECT by id (with tenancy enforcement) ─────────────────────────────────
// userId + projectId enforced at query — prevents cross-tenant draft reads
// even if a caller leaks draftId. Returns null when (draftId, userId, projectId)
// triple does not match a row.

export async function dbGetDraftById(
  draftId:   PlanDraftId,
  userId:    string,
  projectId: string,
): Promise<Result<PlanDraftState | null>> {
  try {
    const result = await db.query<PlanDraftRow>(
      `SELECT ${COLS}
       FROM plan_drafts
       WHERE draft_id = $1
         AND user_id = $2
         AND project_id = $3
       LIMIT 1`,
      [draftId, userId, projectId],
    )
    if (!result.rows[0]) return { ok: true, data: null }
    return { ok: true, data: mapDraftRow(result.rows[0]) }
  } catch (e) {
    return dbError('Failed to read plan draft by id', e)
  }
}

// ─── UPDATE composition ──────────────────────────────────────────────────────
// Used on amend path: re-compose updates composedContent (and validityErrors
// on failure). Status stays 'draft'. updatedAt bumped at call site (R2 supplies
// epochNow()).
// F006: amend also refreshes originalUserMessage — each amend is a new intent
// expression. confirmAndEmit reads originalUserMessage to compose the emitted
// artifact against actual intent rather than the confirm keyword.
// NOT_FOUND if zero rows affected — R2 surfaces as PLAN_DRAFT_NOT_FOUND at R3.
// Pattern: `RETURNING draft_id` so we can detect zero-row updates via the
// existing { rows: T[] } surface (mirrors F-planner planner-db).

export async function dbUpdateDraftComposition(
  draftId:             PlanDraftId,
  composedContent:     PlanArtifactContent | null,
  validityErrors:      PlanValidityError[] | null,
  originalUserMessage: string,
  updatedAt:           EpochMs,
): Promise<Result<void>> {
  try {
    const result = await db.query<{ draft_id: string }>(
      `UPDATE plan_drafts
       SET composed_content       = $2,
           validity_errors        = $3,
           original_user_message  = $4,
           updated_at             = $5
       WHERE draft_id = $1
         AND status = 'draft'
       RETURNING draft_id`,
      [
        draftId,
        composedContent === null ? null : JSON.stringify(composedContent),
        validityErrors  === null ? null : JSON.stringify(validityErrors),
        originalUserMessage,
        updatedAt,
      ],
    )
    if (!result.rows[0]) {
      return {
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Plan draft not found or not in draft status' },
      }
    }
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('Failed to update plan draft composition', e)
  }
}

// ─── UPDATE mark emitting (F005, three-state lifecycle) ─────────────────────
// Mid-flight transition: status='draft' → 'emitting'. Set BEFORE graph write.
// Guarded by status='draft' in WHERE — prevents two concurrent confirms from
// both winning the lane.
// Half-state semantics: if process dies between markEmitting and the
// subsequent createArtifact + markEmitted, lane stays at 'emitting'. Admin
// reconciliation tooling (out of scope this cleanup) inspects 'emitting' rows.

export async function dbMarkDraftEmitting(
  draftId:   PlanDraftId,
  updatedAt: EpochMs,
): Promise<Result<void>> {
  try {
    const result = await db.query<{ draft_id: string }>(
      `UPDATE plan_drafts
       SET status     = 'emitting',
           updated_at = $2
       WHERE draft_id = $1
         AND status = 'draft'
       RETURNING draft_id`,
      [draftId, updatedAt],
    )
    if (!result.rows[0]) {
      return {
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Plan draft not found or not in draft status' },
      }
    }
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('Failed to mark plan draft emitting', e)
  }
}

// ─── UPDATE mark emitted ─────────────────────────────────────────────────────
// Terminal transition: status='emitting' → 'emitted'. Sets emittedAnchorNodeId.
// F005: WHERE clause now status='emitting' (was 'draft'). Two-phase lifecycle:
//   1. dbMarkDraftEmitting:  draft → emitting    (before graph write)
//   2. createArtifact:       graph deposit
//   3. dbMarkDraftEmitted:   emitting → emitted  (after graph success)
// Failure between 2 and 3 leaves the lane at 'emitting' with the plan
// committed in graph — surfaced as PLAN_EMITTED_BUT_NOT_RECORDED at R3.

export async function dbMarkDraftEmitted(
  draftId:              PlanDraftId,
  emittedAnchorNodeId:  NodeId,
  updatedAt:            EpochMs,
): Promise<Result<void>> {
  try {
    const result = await db.query<{ draft_id: string }>(
      `UPDATE plan_drafts
       SET status                  = 'emitted',
           emitted_anchor_node_id  = $2,
           updated_at              = $3
       WHERE draft_id = $1
         AND status = 'emitting'
       RETURNING draft_id`,
      [draftId, emittedAnchorNodeId, updatedAt],
    )
    if (!result.rows[0]) {
      return {
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Plan draft not found or not in emitting status' },
      }
    }
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('Failed to mark plan draft emitted', e)
  }
}

// ─── UPDATE mark superseded ──────────────────────────────────────────────────
// Used by amendment path bookkeeping: closes the prior open-draft lane when
// a fresh draft replaces it. Guarded by status='draft' to avoid clobbering
// 'emitted' rows.

export async function dbMarkDraftSuperseded(
  draftId:   PlanDraftId,
  updatedAt: EpochMs,
): Promise<Result<void>> {
  try {
    const result = await db.query<{ draft_id: string }>(
      `UPDATE plan_drafts
       SET status     = 'superseded',
           updated_at = $2
       WHERE draft_id = $1
         AND status = 'draft'
       RETURNING draft_id`,
      [draftId, updatedAt],
    )
    if (!result.rows[0]) {
      return {
        ok: false,
        error: { code: 'NOT_FOUND', message: 'Plan draft not found or not in draft status' },
      }
    }
    return { ok: true, data: undefined }
  } catch (e) {
    return dbError('Failed to mark plan draft superseded', e)
  }
}

// ─── End of plan-db.ts ───────────────────────────────────────────────────────
