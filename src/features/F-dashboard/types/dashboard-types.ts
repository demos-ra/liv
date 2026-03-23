// @liv-standard v1.3
// [F-dashboard/types/dashboard-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase1
// slice:      F-dashboard
// layer:      R0
// wires-in:
//   R0  @/features/F-project/types/project-types
//   R0  @/features/F-output/types/output-types
// wires-out:
//   W-ATOM  ActiveProgram           →  F-dashboard/R3, src/app/page.tsx
//   W-ATOM  ProgramRenderIntent     →  F-dashboard/R3 (dashboard-registry.tsx)
//   W-ATOM  OutputActions           →  F-dashboard/R3
//   W-ATOM  ProjectActions          →  F-dashboard/R3
//   W-ATOM  OutputState             →  F-dashboard/R3
//   W-ATOM  DashboardSectionState   →  F-dashboard/R3, src/app/page.tsx
//   W-ATOM  WorkspaceHook           →  F-dashboard/R3, src/app/page.tsx
// deps:
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
//
// step5d-phase1 (A1, A3, A7):
//   Removed all imports from @/features/F-planner — A7: F-planner types had
//   no business crossing into F-dashboard now that the registry protocol exists.
//   Removed: PipelineStatus, PipelineStage, StageStatus, StageLogEntry,
//   PlannerJobId, IfContract imports.
//   Removed: PipelineView type — F-planner owns its own pipeline view internally.
//   Removed: PlannerActions type — F-planner owns its own action surface.
//   ActiveProgram: removed pipelineStatus, isPipelineDone, jobId — all builder-
//   specific. Dashboard knows only projectId + projectName (universe-layer state).
//   WorkspaceHook: removed pipelineView, plannerActions. Added programs: ProgramRenderIntent[].
//   ProgramRenderIntent: minimal — programId + component. No slots, no priority.
//   Extend when second program exists.
//   Axiom cite: A1 — F-dashboard owns dashboard surface only; F-planner owns
//   pipeline state. A3 — typed atoms at boundary. A7 — remove unused types.

import type { ComponentType } from 'react'
import type {
  ProjectSummary,
  CreateProjectPayload,
  ProjectDelta,
  ProjectId,
} from '@/features/F-project/types/project-types'
import type { PushPayload, PushResult, OutputFiles } from '@/features/F-output/types/output-types'

// ── ProgramRenderIntent (A3) ──────────────────────────────────────────────────
// Minimal contract for programs declaring into the dashboard registry.
// programId: stable identifier. component: self-contained React component.
// Dashboard renders component with zero props — component is autonomous.
// Axiom cite: A3 — typed atom at slice boundary.
export type ProgramRenderIntent = {
  programId: string
  component: ComponentType
}

// ── ActiveProgram (A3) ────────────────────────────────────────────────────────
// step5d: removed jobId, pipelineStatus, isPipelineDone — builder-specific.
// Dashboard knows only universe-layer project state.
export type ActiveProgram = {
  projectId:   string
  projectName: string
} | null

// ── Action surfaces (A3) ──────────────────────────────────────────────────────
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
// step5d: pipelineView, plannerActions removed (A7 — owned by F-planner now).
//         programs: ProgramRenderIntent[] added — registry-driven render.
export type WorkspaceHook = {
  program:          ActiveProgram
  programs:         ProgramRenderIntent[]
  outputState:      OutputState
  outputActions:    OutputActions
  projectActions:   ProjectActions
  projects:         ProjectSummary[]
  dashboardSection: DashboardSectionState
}
