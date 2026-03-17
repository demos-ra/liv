// @liv-standard v1.3
// [F-dashboard/types/dashboard-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b3-dashboard
// slice:      F-dashboard
// layer:      R0
// wires-in:
//   R0  @/features/F-planner/types/planner-types
//   R0  @/features/F-project/types/project-types
//   R0  @/features/F-output/types/output-types
// wires-out:
//   W-ATOM  ActiveProgram         →  F-dashboard/R3, src/app/page.tsx
//   W-ATOM  PipelineView          →  F-dashboard/R3
//   W-ATOM  PlannerActions        →  F-dashboard/R3
//   W-ATOM  OutputActions         →  F-dashboard/R3
//   W-ATOM  ProjectActions        →  F-dashboard/R3
//   W-ATOM  OutputState           →  F-dashboard/R3
//   W-ATOM  DashboardSectionState →  F-dashboard/R3, src/app/page.tsx
//   W-ATOM  WorkspaceHook         →  F-dashboard/R3, src/app/page.tsx
// deps:
//   R0  @/features/F-planner/types/planner-types  (R0 atoms only — A5)
//   R0  @/features/F-project/types/project-types  (R0 atoms only — A5)
//   R0  @/features/F-output/types/output-types    (R0 atoms only — A5)
// validated:  pending
//
// step4b3-dashboard (A7):
//   DashboardPanel removed — tab system deleted. No consumers remain (A7).
//   goToPanel + activePanel removed from WorkspaceHook — dead with the tabs.
//   dashboard-logic.ts deleted entirely (A7): deriveActivePanel, panelVisible,
//   panelLabel, panelIndex all had zero consumers after tab removal.
//   Axiom cite: A7 — remove what has no consumers. Empty stubs are debt.

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

// ── ActiveProgram (A3) ────────────────────────────────────────────────────────
export type ActiveProgram = {
  projectId:      string
  projectName:    string
  jobId:          string | null
  pipelineStatus: PipelineStatus | null
  isPipelineDone: boolean
} | null

// ── PipelineView (A3) ─────────────────────────────────────────────────────────
export type PipelineView = {
  jobId:        string
  currentStage: PipelineStage | null
  stageStatus:  StageStatus
  pipelineLog:  StageLogEntry[]
} | null

// ── Action surfaces (A3) ──────────────────────────────────────────────────────
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

// ── OutputState (A3) ─────────────────────────────────────────────────────────
export type OutputState = {
  files:       OutputFiles | null
  filesStatus: 'idle' | 'loading' | 'error' | 'success'
  filesError:  { code: string; message: string } | null
  pushStatus:  'idle' | 'loading' | 'error' | 'success'
  pushResult:  PushResult | null
  pushError:   { code: string; message: string } | null
}

// ── DashboardSectionState (A3) ────────────────────────────────────────────────
export type DashboardSectionState = {
  isExpanded:     boolean
  toggleExpanded: () => void
}

// ── WorkspaceHook — full return type of useWorkspace() ───────────────────────
// step4b3: DashboardPanel, activePanel, goToPanel removed (A7).
export type WorkspaceHook = {
  program:          ActiveProgram
  pipelineView:     PipelineView
  outputState:      OutputState
  plannerActions:   PlannerActions
  outputActions:    OutputActions
  projectActions:   ProjectActions
  projects:         ProjectSummary[]
  dashboardSection: DashboardSectionState
}
