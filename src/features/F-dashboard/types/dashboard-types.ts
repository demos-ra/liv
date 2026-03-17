// @liv-standard v1.3
// [F-dashboard/types/dashboard-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b1-layout-restore
// slice:      F-dashboard
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  DashboardPanel        →  F-dashboard/R1, F-dashboard/R3
//   W-ATOM  ActiveProgram         →  F-dashboard/R3 (panel components via prop)
//   W-ATOM  PipelineView          →  F-dashboard/R3 (PipelinePanel prop)
//   W-ATOM  PlannerActions        →  F-dashboard/R3
//   W-ATOM  OutputActions         →  F-dashboard/R3
//   W-ATOM  ProjectActions        →  F-dashboard/R3
//   W-ATOM  OutputState           →  F-dashboard/R3
//   W-ATOM  DashboardSectionState →  F-dashboard/R3, src/app/page.tsx
//   W-ATOM  WorkspaceHook         →  F-dashboard/R3, src/app/page.tsx
// deps:
//   R0  @/features/F-planner/types/planner-types   (R0 atoms only — A5)
//   R0  @/features/F-project/types/project-types   (R0 atoms only — A5)
//   R0  @/features/F-output/types/output-types     (R0 atoms only — A5)
// validated:  pending
//
// step4b1 (A1, A3, A6, A7):
//   ChatSurface removed — F-dashboard no longer threads chat identity.
//   chat field removed from WorkspaceHook — clean break, zero consumers remain.
//   DashboardSectionState added as typed boundary atom (A3) for collapsible
//   dashboard section. isExpanded + toggle declared here at R0 (A6) so the
//   atom can grow (panel size, active program ID) without reshaping WorkspaceHook.
//   Axiom cite:
//     A1 — one owner per construct. ChatSurface owned by F-chat, not F-dashboard.
//     A3 — DashboardSectionState is the typed boundary; raw boolean never crosses.
//     A6 — declared at R0 of F-dashboard, the owning slice.
//     A7 — ChatSurface deletion breaks nothing outside F-dashboard.

import type {
  PipelineStatus,
  PipelineStage,
  StageStatus,
  StageLogEntry,
  PlannerJobId,
  IfContract,
} from '@/features/F-planner/types/planner-types'
import type {
  ProjectSummary,
  CreateProjectPayload,
  ProjectDelta,
  ProjectId,
} from '@/features/F-project/types/project-types'
import type { PushPayload, PushResult, OutputFiles } from '@/features/F-output/types/output-types'

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
export type DashboardPanel =
  | 'intake'
  | 'pipeline'
  | 'output'

// ── ActiveProgram — core readable state atom (A3) ─────────────────────────────
// Derived once in useWorkspace. Passed as prop to every panel component.
// null until a project is selected.
export type ActiveProgram = {
  projectId:      string
  projectName:    string
  jobId:          string | null
  pipelineStatus: PipelineStatus | null
  isPipelineDone: boolean
} | null

// ── PipelineView — PipelinePanel-specific read state (A3) ─────────────────────
// Carries fields PipelinePanel needs beyond ActiveProgram.
// Sourced from planner.job in useWorkspace — panel never touches hook directly.
// null when no pipeline has started.
export type PipelineView = {
  jobId:        string
  currentStage: PipelineStage | null
  stageStatus:  StageStatus
  pipelineLog:  StageLogEntry[]
} | null

// ── Action surfaces — callable fns only, no state fields (A3) ────────────────
export type PlannerActions = {
  startPipeline:  (buildId: string, projectId: string, source: 'CONTINUOUS' | 'REENTRY') => void
  advanceStage:   (jobId: PlannerJobId, message?: string) => void
  failStage:      (jobId: PlannerJobId, reason: string, axiomCite?: string) => void
  freezeContract: (jobId: PlannerJobId, ifContract: IfContract) => void
}

export type OutputActions = {
  loadFiles:  (jobId: string) => void
  download:   (jobId: string) => void
  push:       (jobId: string, opts: Omit<PushPayload, 'jobId'>) => void
  resetPush:  () => void
}

export type ProjectActions = {
  create:    (input: CreateProjectPayload) => void
  update:    (projectId: ProjectId, delta: ProjectDelta) => void
  remove:    (projectId: ProjectId) => void
  setActive: (projectId: ProjectId) => void
}

// ── OutputState — output panel read state ────────────────────────────────────
export type OutputState = {
  files:       OutputFiles | null
  filesStatus: 'idle' | 'loading' | 'error' | 'success'
  filesError:  { code: string; message: string } | null
  pushStatus:  'idle' | 'loading' | 'error' | 'success'
  pushResult:  PushResult | null
  pushError:   { code: string; message: string } | null
}

// ── DashboardSectionState — typed boundary atom for collapsible section (A3) ──
// Owns the expand/collapse state of the dashboard panel above chat.
// Declared here at R0 (A6) so the atom can grow without reshaping WorkspaceHook.
// Candidate future fields: activeProgramId, panelHeight, pinnedPanel.
// Axiom cite: A3 — typed boundary atom. A6 — declared at R0 of owning slice.
export type DashboardSectionState = {
  isExpanded:     boolean
  toggleExpanded: () => void
}

// ── WorkspaceHook — full return type of useWorkspace() ───────────────────────
// program null until project selected.
// projects kept separate — UI list concern, not program identity.
// dashboardSection carries collapse state as typed atom (A3).
export type WorkspaceHook = {
  program:          ActiveProgram
  pipelineView:     PipelineView
  outputState:      OutputState
  plannerActions:   PlannerActions
  outputActions:    OutputActions
  projectActions:   ProjectActions
  projects:         ProjectSummary[]
  activePanel:      DashboardPanel
  goToPanel:        (panel: DashboardPanel) => void
  dashboardSection: DashboardSectionState
}
