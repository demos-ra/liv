// @liv-standard v1.3
// [F-output/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry)
// deps:       none
// validated:  2026-03-12

// @wire
// type:    W-ATOM
// id:      W-ATOM-output-file
// payload: OutputFile
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-output-files
// payload: OutputFiles
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-push-payload
// payload: PushPayload
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-output-result
// payload: OutputResult<T>
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-output
// payload: OutputHook (see contract/output-hook.ts)
//          accepts: isPipelineDone?: boolean — prop, not cross-slice import
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-output-db
// interface: IOutputDb (R2)
// impl:      output-db.ts (R4)
// binding:   output-inject.ts (R3)
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-git-push
// interface: IGitPush (R2)
// impl:      git-push-io.ts (R4)
// binding:   output-inject.ts (R3)
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-output-download-ready
// event:   output.download.ready
// payload: OutputDownloadReadyPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-output-push-complete
// event:   output.push.complete
// payload: OutputPushCompletePayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-output-push-failed
// event:   output.push.failed
// payload: OutputPushFailedPayload
// version: 1
// status:  active

export {}
