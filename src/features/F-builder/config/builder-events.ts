// @liv-standard v1.5.1
// [F-builder/config/builder-events.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-3 (moved from F-planner/types/planner-events — dissolution)
// slice:      F-builder
// layer:      R0
// wires-in:   none
// wires-out:
//   W-EVENT  pipeline.started    →  F-event-system/R0
//   W-EVENT  pipeline.completed  →  F-event-system/R0
//   W-EVENT  pipeline.failed     →  F-event-system/R0
//   W-EVENT  stage.completed     →  F-event-system/R0
//   W-EVENT  stage.failed        →  F-event-system/R0
// deps:       none
// validated:  pending

// A6: declared at R0 of emitting slice (F-builder post-dissolution). Consumed via event-schema.ts barrel only.
// A5: no slice imports these directly — only through the event bus.
export const PLANNER_EVENTS = {
  PIPELINE_STARTED:   'pipeline.started',
  PIPELINE_COMPLETED: 'pipeline.completed',
  PIPELINE_FAILED:    'pipeline.failed',
  STAGE_COMPLETED:    'stage.completed',
  STAGE_FAILED:       'stage.failed',
} as const

export type PlannerEventName = typeof PLANNER_EVENTS[keyof typeof PLANNER_EVENTS]

// ── AK-PAY — event payload types ──────────────────────────────────────────────
export type PipelineStartedPayload = {
  jobId:     string
  projectId: string
  userId:    string
  source:    'CONTINUOUS' | 'REENTRY'
}

export type PipelineCompletedPayload = {
  jobId:         string
  projectId:     string
  userId:        string
  featureIntent: string | null   // from IfContract.featureIntent — what the build was for
  outcome:       string | null   // from PipelineReport.outcome — 'complete' | 'failed' | 'escalated' | null
}

export type PipelineFailedPayload = {
  jobId:      string
  projectId:  string
  stage:      string
  reason:     string
  axiomCite:  string | null
}

export type StageCompletedPayload = {
  jobId:   string
  stage:   string
  message: string | null
}

export type StageFailedPayload = {
  jobId:      string
  stage:      string
  reason:     string
  axiomCite:  string | null
  retryCount: number
}
