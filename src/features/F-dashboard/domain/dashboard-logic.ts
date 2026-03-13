// @liv-standard v1.3
// [F-dashboard/domain/dashboard-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R1
// wires-in:
//   W-ATOM  DashboardPanel  ../types/dashboard-types
//   W-ATOM  PipelineStatus  @/features/F-planner/types/planner-types
// wires-out:
//   W-FN    deriveActivePanel  →  F-dashboard/contract/dashboard-hook (re-exported at R3)
//   W-FN    panelVisible       →  F-dashboard/R3 (internal)
//   W-FN    panelLabel         →  F-dashboard/R3 (internal)
//   W-FN    panelIndex         →  F-dashboard/R3 (internal)
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-planner/types/planner-types  (R0 atoms only — A5)
// validated:  2026-03-13
//
// Step 4: DashboardView removed from wires-in — no longer exists in dashboard-types.ts.
// deriveActivePanel now takes (jobId, pipelineStatus) directly — callers pass
// resolved scalar values rather than the old DashboardView struct.
// All other fns unchanged.

import type { DashboardPanel }  from '../types/dashboard-types'
import type { PipelineStatus }  from '@/features/F-planner/types/planner-types'

// ── Panel progression logic ───────────────────────────────────────────────────
// Pure: given current program state, derive which panel should show.
// Called by useWorkspace on each render — O(1), no side effects.

export function deriveActivePanel(
  jobId:          string | null,
  pipelineStatus: PipelineStatus | null,
): DashboardPanel {
  if (!jobId) return 'intake'

  if (pipelineStatus === 'complete')                                   return 'output'
  if (pipelineStatus === 'running' || pipelineStatus === 'pending')    return 'pipeline'
  if (pipelineStatus === 'failed'  || pipelineStatus === 'cancelled')  return 'pipeline'

  return 'intake'
}

// ── Panel visibility ──────────────────────────────────────────────────────────

export function panelVisible(panel: DashboardPanel, activePanel: DashboardPanel): boolean {
  return panel === activePanel
}

// ── Panel label ───────────────────────────────────────────────────────────────

export function panelLabel(panel: DashboardPanel): string {
  switch (panel) {
    case 'intake':   return 'Intake'
    case 'pipeline': return 'Pipeline'
    case 'output':   return 'Output'
  }
}

// ── Panel index (0-based) ─────────────────────────────────────────────────────

export function panelIndex(panel: DashboardPanel): number {
  const order: DashboardPanel[] = ['intake', 'pipeline', 'output']
  return order.indexOf(panel)
}
