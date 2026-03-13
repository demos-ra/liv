// @liv-standard v1.3
// [F-dashboard/types/dashboard-wires.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R0
// wires-in:   none
// wires-out:  (registry only — no runtime exports)
// deps:       none
// validated:  2026-03-13
//
// Wire registry for F-dashboard R0 atoms.
// Every W-ATOM declared in dashboard-types.ts is registered here.
// Rule: a wire is declared the same commit it is created. No undeclared wires.
// Axiom cite: A6 — declare at origin. A1 — F-dashboard owns these declarations.

export const DASHBOARD_WIRES = [
  {
    wireId:   'W-DASH-001',
    atom:     'DashboardPanel',
    emitsTo:  ['F-dashboard/R1', 'F-dashboard/R3'],
    status:   'active',
    notes:    'Panel enum: intake | pipeline | output.',
  },
  {
    wireId:   'W-DASH-002',
    atom:     'ActiveProgram',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Core readable state atom. null until project selected. Passed as prop to all panels.',
  },
  {
    wireId:   'W-DASH-003',
    atom:     'PlannerActions',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'Callable fns only. No state fields.',
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
    wireId:   'W-DASH-008',
    atom:     'PipelineView',
    emitsTo:  ['F-dashboard/R3'],
    status:   'active',
    notes:    'PipelinePanel-specific read state. currentStage, stageStatus, pipelineLog. null until pipeline started.',
  },
] as const

export type DashboardWireId = typeof DASHBOARD_WIRES[number]['wireId']
