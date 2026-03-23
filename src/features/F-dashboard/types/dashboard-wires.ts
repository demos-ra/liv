// @liv-standard v1.3
// [F-dashboard/types/dashboard-wires.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase1
// slice:      F-dashboard
// layer:      R0
// wires-in:   none
// wires-out:  (registry only — no runtime exports)
// deps:       none
// validated:  pending
//
// Wire registry for F-dashboard R0 atoms.
// Every W-ATOM declared in dashboard-types.ts is registered here.
// Rule: a wire is declared the same commit it is created. No undeclared wires.
// Axiom cite: A6 — declare at origin. A1 — F-dashboard owns these declarations.
//
// step5d-phase1 (A1, A7):
//   W-DASH-001 (DashboardPanel): retired — tab system deleted in step4b3. Stale entry.
//   W-DASH-003 (PlannerActions): retired — F-planner owns its own action surface.
//   W-DASH-008 (PipelineView): retired — F-planner owns pipeline view state.
//   W-DASH-009 (ProgramRenderIntent): added — program registry atom.
//   Axiom cite: A1 — F-dashboard owns its own wires, not F-planner's. A7 — retired wires removed.

export const DASHBOARD_WIRES = [
  {
    wireId:   'W-DASH-002',
    atom:     'ActiveProgram',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Core readable state atom. null until project selected. projectId + projectName only.',
  },
  {
    wireId:   'W-DASH-004',
    atom:     'OutputActions',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Callable fns only. No state fields.',
  },
  {
    wireId:   'W-DASH-005',
    atom:     'ProjectActions',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Callable fns only. No state fields.',
  },
  {
    wireId:   'W-DASH-006',
    atom:     'OutputState',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Output panel read state. Separate from ActiveProgram — conditional on pipeline completion.',
  },
  {
    wireId:   'W-DASH-007',
    atom:     'WorkspaceHook',
    emitsTo:  ['F-dashboard/R3', 'src/app/page.tsx'],
    status:   'active',
    notes:    'Full return type of useWorkspace(). page.tsx spreads this to DashboardUI.',
  },
  {
    wireId:   'W-DASH-009',
    atom:     'ProgramRenderIntent',
    emitsTo:  ['F-dashboard/R3 (dashboard-registry.tsx)'],
    status:   'active',
    notes:    'Program declares programId + component. Dashboard renders component autonomously.',
  },
] as const

export type DashboardWireId = typeof DASHBOARD_WIRES[number]['wireId']
