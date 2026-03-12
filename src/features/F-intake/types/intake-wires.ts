// @liv-standard v1.3
// [F-intake/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-intake
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  2026-03-12

// @wire
// type:    W-ATOM
// id:      W-ATOM-intake-input
// payload: IntakeInput
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-intake-state
// payload: IntakeState
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-intake-result
// payload: IntakeResult
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-intake
// payload: IntakeHook (see contract/intake-hook.ts)
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-planner  (consumed — declared at F-planner)
// payload: PlannerHook
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-project  (consumed — declared at F-project)
// payload: ProjectHook
// version: 1
// status:  active

export {}
