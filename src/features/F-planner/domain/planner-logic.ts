// @liv-standard v1.3
// [F-planner/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R1
// wires-in:
//   W-ATOM  PipelineStage  ../types/planner-types
//   W-ATOM  StageStatus    ../types/planner-types
//   W-ATOM  PlannerJob     ../types/planner-types
//   W-ATOM  IfContract     ../types/planner-types
//   W-ATOM  StageLogEntry  ../types/planner-types
//   W-ATOM  PLANNER_CONST  ../types/planner-const
// wires-out:  none  (R1 logic consumed intra-slice by R2 only — A2)
// deps:
//   R0  ../types/planner-types
//   R0  ../types/planner-const
// validated:  2026-03-12

// A4: pure — no I/O, no throws. All functions return typed values.
// R1 never logs — pure functions have no side effects. (T5.2)

import type { PipelineStage, StageStatus, PlannerJob, IfContract, StageLogEntry } from '../types/planner-types'
import { PLANNER_CONST } from '../types/planner-const'

// ── Stage sequencing ──────────────────────────────────────────────────────────

export function nextStage(current: PipelineStage): PipelineStage | null {
  const order = PLANNER_CONST.STAGE_ORDER
  const idx   = order.indexOf(current)
  if (idx === -1 || idx === order.length - 1) return null
  return order[idx + 1]
}

export function isTerminalStatus(status: StageStatus): boolean {
  return status === 'failed' || status === 'complete' || status === 'skipped'
}

export function isPipelineComplete(job: PlannerJob): boolean {
  return job.currentStage === 'IN_QA' && job.stageStatus === 'complete'
}

export function isPipelineFailed(job: PlannerJob): boolean {
  return job.pipelineStatus === 'failed'
}

// ── Retry logic ───────────────────────────────────────────────────────────────

export function canRetry(stage: PipelineStage, retryCount: number): boolean {
  return retryCount < PLANNER_CONST.MAX_RETRIES_PER_STAGE[stage]
}

// ── Stage log construction ─────────────────────────────────────────────────────
// R1 builds the entry shape. R2 appends to the log and passes to R4.

export function buildStageLogEntry(opts: {
  stage:       PipelineStage
  status:      StageStatus
  startedAt:   number
  completedAt: number | null
  message:     string | null
  axiomCite:   string | null
  retryCount:  number
}): StageLogEntry {
  return {
    stage:       opts.stage,
    status:      opts.status,
    startedAt:   opts.startedAt,
    completedAt: opts.completedAt,
    message:     opts.message,
    axiomCite:   opts.axiomCite,
    retryCount:  opts.retryCount,
  }
}

// ── IF Contract validation ────────────────────────────────────────────────────
// Returns null on valid, error object on invalid.

export function validateIfContract(
  contract: unknown
): { code: string; message: string } | null {
  if (!contract || typeof contract !== 'object') {
    return { code: 'VALIDATION_FAILED', message: 'IF contract must be an object' }
  }

  const c = contract as Record<string, unknown>

  const requiredStrings: (keyof IfContract)[] = [
    'featureIntent',
    'standardVersion',
    'procedureVersion',
  ]

  for (const field of requiredStrings) {
    if (!c[field] || typeof c[field] !== 'string' || !(c[field] as string).trim()) {
      return { code: 'VALIDATION_FAILED', message: `IF contract field '${field}' is required` }
    }
  }

  const requiredArrays: (keyof IfContract)[] = [
    'atomDeclarations',
    'bundleScope',
    'flowIds',
    'wireMap',
    'eventContracts',
    'acceptanceCriteria',
  ]

  for (const field of requiredArrays) {
    if (!Array.isArray(c[field])) {
      return { code: 'VALIDATION_FAILED', message: `IF contract field '${field}' must be an array` }
    }
  }

  if (typeof c['frozenAt'] !== 'number') {
    return { code: 'VALIDATION_FAILED', message: "IF contract 'frozenAt' must be a number" }
  }

  if (!c['frozenBy'] || typeof c['frozenBy'] !== 'string') {
    return { code: 'VALIDATION_FAILED', message: "IF contract 'frozenBy' is required" }
  }

  return null
}

// ── Summary projection ────────────────────────────────────────────────────────

export function getStageSummary(job: PlannerJob): {
  currentStage: PipelineStage | null
  stageStatus:  StageStatus
  completedStages: PipelineStage[]
  failedStage:     PipelineStage | null
} {
  const completedStages = job.pipelineLog
    .filter(e => e.status === 'complete')
    .map(e => e.stage)

  const failedEntry = job.pipelineLog.find(e => e.status === 'failed')

  return {
    currentStage:    job.currentStage,
    stageStatus:     job.stageStatus,
    completedStages,
    failedStage:     failedEntry?.stage ?? null,
  }
}
