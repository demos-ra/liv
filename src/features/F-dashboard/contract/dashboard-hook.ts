// @liv-standard v1.3
// [F-dashboard/contract/dashboard-hook.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step2-chat-dashboard
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook    ../types/dashboard-types
//   W-ATOM  ActiveProgram    ../types/dashboard-types
//   W-ATOM  PipelineView     ../types/dashboard-types
//   W-ATOM  PlannerActions   ../types/dashboard-types
//   W-ATOM  OutputActions    ../types/dashboard-types
//   W-ATOM  ProjectActions   ../types/dashboard-types
//   W-ATOM  OutputState      ../types/dashboard-types
//   W-ATOM  ChatSurface      ../types/dashboard-types
//   W-ATOM  DashboardPanel   ../types/dashboard-types
//   W-FN    deriveActivePanel ../domain/dashboard-logic
//   W-HOOK  usePlanner       @/features/F-planner/contract/planner-hook
//   W-HOOK  useProject       @/features/F-project/contract/project-hook
//   W-HOOK  useOutput        @/features/F-output/contract/output-hook
// wires-out:
//   W-HOOK  useWorkspace      →  F-dashboard/R3 (dashboard-ui.tsx), src/app/page.tsx
//   W-FN    deriveActivePanel →  re-exported at contract surface (A5)
// deps:
//   R0  ../types/dashboard-types
//   R1  ../domain/dashboard-logic
//   R3  @/features/F-planner/contract/planner-hook   (A5: contract surface)
//   R3  @/features/F-project/contract/project-hook   (A5: contract surface)
//   R3  @/features/F-output/contract/output-hook     (A5: contract surface)
//   R5  react
// validated:  2026-03-13
//
// Step 2 (A1, A3, A5, A6):
//   useWorkspace() now accepts ChatSurface props (email, signOut) from page.tsx
//   and threads them through as workspace.chat. F-dashboard does not call any
//   F-chat hooks — identity props only. This keeps F-chat's state fully internal
//   while satisfying the typed boundary requirement at DashboardUI.
//   Axiom cite:
//     A1 — F-dashboard is sole orchestration + render surface owner.
//     A3 — ChatSurface enforces typed boundary; no F-chat internals leak.
//     A5 — F-chat accessed only via declared contract surfaces.
//     A6 — ChatSurface declared at R0 (dashboard-types.ts).

'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlanner }        from '@/features/F-planner/contract/planner-hook'
import { useProject }        from '@/features/F-project/contract/project-hook'
import { useOutput }         from '@/features/F-output/contract/output-hook'
import { deriveActivePanel } from '../domain/dashboard-logic'
import type {
  WorkspaceHook,
  ActiveProgram,
  PipelineView,
  DashboardPanel,
  PlannerActions,
  OutputActions,
  ProjectActions,
  OutputState,
  ChatSurface,
} from '../types/dashboard-types'
import type { PlannerJobId } from '@/features/F-planner/types/planner-types'

export function useWorkspace(chat: ChatSurface): WorkspaceHook {
  const [jobId,       setJobId]       = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<DashboardPanel>('intake')

  // ── Slice hooks (A5: via contract only) ───────────────────────────────────
  const project        = useProject()
  const planner        = usePlanner(jobId as PlannerJobId | undefined)
  const isPipelineDone = planner.job?.pipelineStatus === 'complete'
  const output         = useOutput(jobId ?? undefined, isPipelineDone)

  // ── Capture jobId when first pipeline job lands ───────────────────────────
  useEffect(() => {
    if (planner.job?.jobId && !jobId) {
      setJobId(planner.job.jobId)
    }
  }, [planner.job?.jobId, jobId])

  // ── Auto-advance panel from pipeline state (R1 pure fn) ──────────────────
  const derivedPanel = deriveActivePanel(jobId, planner.job?.pipelineStatus ?? null)
  useEffect(() => {
    if (derivedPanel !== activePanel) {
      setActivePanel(derivedPanel)
    }
  }, [derivedPanel, activePanel])

  const goToPanel = useCallback((panel: DashboardPanel) => {
    setActivePanel(panel)
  }, [])

  // ── ActiveProgram — core readable state atom (A3) ─────────────────────────
  const program: ActiveProgram = project.activeProject
    ? {
        projectId:      project.activeProject.projectId,
        projectName:    project.activeProject.name,
        jobId,
        pipelineStatus: planner.job?.pipelineStatus ?? null,
        isPipelineDone,
      }
    : null

  // ── PipelineView — PipelinePanel read state (A3) ──────────────────────────
  const pipelineView: PipelineView = planner.job
    ? {
        jobId:        planner.job.jobId,
        currentStage: planner.job.currentStage,
        stageStatus:  planner.job.stageStatus,
        pipelineLog:  planner.job.pipelineLog,
      }
    : null

  // ── OutputState — output panel read state (A3) ────────────────────────────
  const outputState: OutputState = {
    files:       output.files,
    filesStatus: output.filesStatus,
    filesError:  output.filesError,
    pushStatus:  output.pushStatus,
    pushResult:  output.pushResult,
    pushError:   output.pushError,
  }

  // ── Action surfaces — callable fns only, no state (A3) ───────────────────
  const plannerActions: PlannerActions = {
    startPipeline:  planner.startPipeline,
    advanceStage:   planner.advanceStage,
    failStage:      planner.failStage,
    freezeContract: planner.freezeContract,
  }

  const outputActions: OutputActions = {
    loadFiles:  output.loadFiles,
    download:   output.download,
    push:       output.push,
    resetPush:  output.resetPush,
  }

  const projectActions: ProjectActions = {
    create:    project.create,
    update:    project.update,
    remove:    project.remove,
    setActive: project.setActive,
  }

  return {
    program,
    pipelineView,
    outputState,
    plannerActions,
    outputActions,
    projectActions,
    projects:    project.projects,
    activePanel,
    goToPanel,
    chat,
  }
}

export { deriveActivePanel } from '../domain/dashboard-logic'
