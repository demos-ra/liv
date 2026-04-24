// @liv-standard v1.5.1
// [F-planner/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.12-payload-enrichment
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-EVENT  pipeline.started    →  F-event-system/R0
//   W-EVENT  pipeline.completed  →  F-event-system/R0
//   W-EVENT  pipeline.failed     →  F-event-system/R0
//   W-EVENT  stage.completed     →  F-event-system/R0
//   W-EVENT  stage.failed        →  F-event-system/R0
// deps:       none
// validated:  2026-03-12

// A6: declared at R0 of emitting slice. Consumed via event-schema.ts barrel only.
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
