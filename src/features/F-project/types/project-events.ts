// @liv-standard v1.3
// [F-project/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R0
// wires-in:   none
// wires-out:
//   W-EVENT  project.created  →  F-event-system/R0
//   W-EVENT  build.started    →  F-event-system/R0
//   W-EVENT  build.completed  →  F-event-system/R0
// deps:       none
// validated:  2026-03-12

// ── Event name constants ───────────────────────────────────────────────────────
// A6: declared at R0 of emitting slice. Consumed via event-schema.ts barrel only.
// A5: no slice imports these directly — only through the event bus.
export const PROJECT_EVENTS = {
  PROJECT_CREATED:  'project.created',
  BUILD_STARTED:    'build.started',
  BUILD_COMPLETED:  'build.completed',
  BUILD_FAILED:     'build.failed',
} as const

export type ProjectEventName = typeof PROJECT_EVENTS[keyof typeof PROJECT_EVENTS]

// ── AK-PAY — event payload types ──────────────────────────────────────────────
export type ProjectCreatedPayload = {
  projectId: string
  userId:    string
  name:      string
}

export type BuildStartedPayload = {
  buildId:   string
  projectId: string
  userId:    string
  source:    'CONTINUOUS' | 'REENTRY'
}

export type BuildCompletedPayload = {
  buildId:   string
  projectId: string
  status:    'complete' | 'failed' | 'cancelled'
}
