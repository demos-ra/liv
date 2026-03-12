// @liv-standard v1.3
// [F-planner/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  2026-03-12

// Wire contract registry for F-planner.
// A1: F-planner owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.

// @wire
// type:    W-ATOM
// id:      W-ATOM-planner-job
// payload: PlannerJob
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-if-contract
// payload: IfContract
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-pipeline-stage
// payload: PipelineStage
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-planner
// payload: PlannerHook (see contract/planner-hook.ts)
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-planner-db
// payload: IPlannerDb (see workflow/planner-workflow.ts)
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-ai-adapter
// payload: IAiAdapter (see workflow/planner-workflow.ts)
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-pipeline-started
// payload: PipelineStartedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-pipeline-completed
// payload: PipelineCompletedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-pipeline-failed
// payload: PipelineFailedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-stage-completed
// payload: StageCompletedPayload
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-stage-failed
// payload: StageFailedPayload
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
