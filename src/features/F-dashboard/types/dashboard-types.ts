// @liv-standard v1.3
// [F-dashboard/types/dashboard-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
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
// validated: pending
//
// step5d-phase1 (A1, A3, A7): (see prior history)
//
// step5b-phaseA (A1, A3, A6):
//   ProgramRenderIntent: added label field. Menu needs human-readable names.
//     Every program declares its label alongside programId + component.
//   WorkspaceHook: added activeProgramId (string | null) and setActiveProgram.
//     null = menu. string = that programId is active and rendered.
//     isExpanded and activeProgramId are independent axes (spec locked).
//   Axiom cite: A3 — typed atoms at boundary. A6 — declared at R0.

import type { ComponentType } from 'react'
import type {
  ProjectSummary,
  CreateProjectPayload,
  ProjectDelta,
  ProjectId,
} from '@/features/F-project/types/project-types'
import type { PushPayload, PushResult, OutputFiles } from '@/features/F-output/types/output-types'

// ── ProgramRenderIntent (A3) ──────────────────────────────────────────────────
// step5b-phaseA: added label — human-readable program name for the menu.
export type ProgramRenderIntent = {
  programId: string
  label:     string
  component: ComponentType
}

// ── ActiveProgram (A3) ────────────────────────────────────────────────────────
export type ActiveProgram = {
  projectId:   string
  projectName: string
} | null

// ── Action surfaces (A3) ──────────────────────────────────────────────────────
export type OutputActions = {
  loadFiles: (jobId: string) => void
  download:  (jobId: string) => void
  push:      (jobId: string, opts: Omit<PushPayload, 'jobId'>) => void
  resetPush: () => void
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
// step5b-phaseA: added activeProgramId + setActiveProgram.
//   activeProgramId: null = menu view. string = render that program's component.
//   setActiveProgram: callable from chat intent (via page.tsx prop) and menu clicks.
//   Independent of isExpanded — minimize does not reset active program (spec locked).
export type WorkspaceHook = {
  program:          ActiveProgram
  programs:         ProgramRenderIntent[]
  activeProgramId:  string | null
  setActiveProgram: (programId: string | null) => void
  outputState:      OutputState
  outputActions:    OutputActions
  projectActions:   ProjectActions
  projects:         ProjectSummary[]
  dashboardSection: DashboardSectionState
}
