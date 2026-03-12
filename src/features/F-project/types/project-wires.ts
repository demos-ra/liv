// @liv-standard v1.3
// [F-project/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  2026-03-12

// Wire contract registry for F-project.
// A1: F-project owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
// Consumer list is derived by IN-AUDIT from manifest wires-in scan — never authored here.

// @wire
// type:    W-ATOM
// id:      W-ATOM-project-id
// payload: ProjectId
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-project-summary
// payload: ProjectSummary
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-build-summary
// payload: BuildSummary
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-project-created
// payload: ProjectCreatedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-build-started
// payload: BuildStartedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-build-completed
// payload: BuildCompletedPayload
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-project
// payload: ProjectHook (see contract/project-hook.ts)
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
