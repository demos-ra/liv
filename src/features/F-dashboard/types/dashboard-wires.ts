// @liv-standard v1.3
// [F-dashboard/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry)
// deps:       none
// validated:  2026-03-12

// @wire
// type:    W-ATOM
// id:      W-ATOM-dashboard-view
// payload: DashboardView
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-dashboard-panel
// payload: DashboardPanel
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-dashboard
// payload: DashboardHook (see contract/dashboard-hook.ts)
//          consumed: app/page.tsx (F-workspace shell)
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

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-output  (consumed — declared at F-output)
// payload: OutputHook
// version: 1
// status:  active

export {}
