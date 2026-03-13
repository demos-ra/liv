// @liv-standard v1.3
// [F-dashboard/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  DashboardView  →  F-dashboard/R1, F-dashboard/R3
//   W-ATOM  DashboardPanel →  F-dashboard/R1, F-dashboard/R3
// deps:       none
// validated:  2026-03-12

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
// The three sequential panels the dashboard renders left→right.
export type DashboardPanel =
  | 'intake'    // F-intake form — requires input
  | 'pipeline'  // F-planner status — visible once pipeline started
  | 'output'    // F-output controls — visible once pipeline complete

// ── AK-ENT ────────────────────────────────────────────────────────────────────
export type DashboardView = {
  activePanel:   DashboardPanel
  pipelineJobId: string | null   // null until first pipeline started
}
