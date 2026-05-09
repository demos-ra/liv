// @liv-standard v1.5.1
// [F-dashboard/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    step5b-phaseA, phase-5.2, phase-5-audit, sprint-12-shot-4 (actionKinds + userId)
// slice:      F-dashboard
// layer:      R0
// wires-in:
//   W-ATOM  ProjectSummary, CreateProjectPayload, ProjectDelta, ProjectId  F-project/R0
//   W-ATOM  PushPayload, PushResult, OutputFiles  F-output/R0
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
//   R5  react
// validated: pending
//
// sprint-12-shot-4 (A1, A3, A6):
//   ProgramRenderIntent: added actionKinds: string[] per Render Standard v1.0 DA1.
//     Programs declare action kinds at v1.0 as [] (no typed dashboard actions yet).
//   WorkspaceHook: added userId: string — threaded from authenticated session so
//     the dashboard shell can pass the context triple (programId, userId, projectId)
//     to each mounted program component per G-RS4.

import type { ComponentType } from 'react'
import type {
  ProjectSummary,
  CreateProjectPayload,
  ProjectDelta,
  ProjectId,
} from '@/features/F-project/types/project-types'
import type { PushPayload, PushResult, OutputFiles } from '@/features/F-output/types/output-types'

export type ProgramProps = {
  programId:  string
  userId:     string
  projectId:  string
}

// ── ProgramRenderIntent (A3) ──────────────────────────────────────────────────
// sprint-12-shot-4: added actionKinds per Render Standard v1.0 DA1.
export type ProgramRenderIntent = {
  programId:   string
  label:       string
  component:   ComponentType<ProgramProps>
  actionKinds: string[]           // v1.0: empty; DA2/DA3 dispatch wired post-beta
  statusDot?:  'accent' | 'dis' | 'error'
  statusLine?: string
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
  userId:           string           // sprint-12-shot-4: G-RS4 context triple thread
  outputState:      OutputState
  outputActions:    OutputActions
  projectActions:   ProjectActions
  projects:         ProjectSummary[]
  dashboardSection: DashboardSectionState
}
