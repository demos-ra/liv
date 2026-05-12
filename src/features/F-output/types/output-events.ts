// @liv-standard v1.3
// [F-output/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// category:   Modality
// layer:      R0
// wires-in:   none
// wires-out:
//   W-EVENT  OUTPUT_EVENTS  →  F-output/R4 (emitter), F-event-system (consumer)
// deps:       none
// validated:  2026-03-12

// F-output emits two events — both after terminal operations.
// Consumers (F-notifications, F-commit-log) subscribe via event bus.
// Events are declared here and re-exported from event-schema.ts barrel.

export const OUTPUT_EVENTS = {
  DOWNLOAD_READY: 'output.download.ready',  // zip assembled successfully
  PUSH_COMPLETE:  'output.push.complete',   // git push committed
  PUSH_FAILED:    'output.push.failed',     // git push returned error
} as const

export type OutputDownloadReadyPayload = {
  jobId:      string
  filesCount: number
  totalBytes: number
}

export type OutputPushCompletePayload = {
  jobId:      string
  remoteUrl:  string
  branch:     string
  commitSha:  string
  filesCount: number
}

export type OutputPushFailedPayload = {
  jobId:      string
  remoteUrl:  string
  code:       string
  message:    string
}
