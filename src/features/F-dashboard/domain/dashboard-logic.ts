// @liv-standard v1.3
// [F-dashboard/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R1
// wires-in:
//   W-ATOM  DashboardView   ../types/dashboard-types
//   W-ATOM  DashboardPanel  ../types/dashboard-types
//   W-ATOM  PipelineStatus  @/features/F-planner/types/planner-types
// wires-out:
//   W-ATOM  activePanel     →  F-dashboard/R3
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-planner/types/planner-types (R0 atom only — A5 compliant)
// validated:  2026-03-12

import type { DashboardView, DashboardPanel } from '../types/dashboard-types'
import type { PipelineStatus }                from '@/features/F-planner/types/planner-types'

// ── Panel progression logic ───────────────────────────────────────────────────
// Pure: given current state, derive which panel should be shown.
// Called by dashboard-hook to compute activePanel on each render.

export function deriveActivePanel(
  view:           DashboardView,
  pipelineStatus: PipelineStatus | null,
): DashboardPanel {
  // No job started → always intake
  if (!view.pipelineJobId) return 'intake'

  // Pipeline complete → output
  if (pipelineStatus === 'complete') return 'output'

  // Pipeline running or pending → pipeline status view
  if (pipelineStatus === 'running' || pipelineStatus === 'pending') return 'pipeline'

  // Pipeline failed → stay on pipeline (shows error)
  if (pipelineStatus === 'failed' || pipelineStatus === 'cancelled') return 'pipeline'

  // Default — intake
  return 'intake'
}

// ── Panel visibility ──────────────────────────────────────────────────────────
// Which panels should render vs be hidden. Panels mount eagerly to preserve
// state; visibility is toggled via CSS not unmounting.

export function panelVisible(panel: DashboardPanel, activePanel: DashboardPanel): boolean {
  return panel === activePanel
}

// ── Step indicator label ──────────────────────────────────────────────────────
// Returns the human label for each panel step.

export function panelLabel(panel: DashboardPanel): string {
  switch (panel) {
    case 'intake':   return 'Intake'
    case 'pipeline': return 'Pipeline'
    case 'output':   return 'Output'
  }
}

// ── Step index (0-based) ──────────────────────────────────────────────────────

export function panelIndex(panel: DashboardPanel): number {
  const order: DashboardPanel[] = ['intake', 'pipeline', 'output']
  return order.indexOf(panel)
}
