// @liv-standard v1.3
// [F-dashboard/contract/dashboard-hook.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b3-dashboard
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook         ../types/dashboard-types
//   W-ATOM  ActiveProgram         ../types/dashboard-types
//   W-ATOM  PipelineView          ../types/dashboard-types
//   W-ATOM  PlannerActions        ../types/dashboard-types
//   W-ATOM  OutputActions         ../types/dashboard-types
//   W-ATOM  ProjectActions        ../types/dashboard-types
//   W-ATOM  OutputState           ../types/dashboard-types
//   W-ATOM  DashboardSectionState ../types/dashboard-types
//   W-HOOK  usePlanner            @/features/F-planner/contract/planner-hook
//   W-HOOK  useProject            @/features/F-project/contract/project-hook
//   W-HOOK  useOutput             @/features/F-output/contract/output-hook
// wires-out:
//   W-HOOK  useWorkspace  →  F-dashboard/R3 (dashboard-ui.tsx), src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R0  @/features/F-planner/types/planner-types  (PlannerJobId — A5)
//   R3  @/features/F-planner/contract/planner-hook  (A5)
//   R3  @/features/F-project/contract/project-hook  (A5)
//   R3  @/features/F-output/contract/output-hook    (A5)
//   R5  react
// validated:  pending
//
// step4b1 (A1, A3, A6): (unchanged in substance)
//
// step4b3-dashboard (A7):
//   Removed: activePanel, setActivePanel, goToPanel, DashboardPanel import.
//   Removed: deriveActivePanel import and re-export (dashboard-logic.ts deleted).
//   Auto-advance panel useEffect removed — no panels to advance to.
//   WorkspaceHook return slimmed to match new type definition.
//   Status strip state is derived purely in dashboard-ui.tsx from
//   program.pipelineStatus + pipelineView.currentStage — no hook state needed.
//   Axiom cite: A7 — removed all dead code with zero consumers.

'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlanner }   from '@/features/F-planner/contract/planner-hook'
import { useProject }   from '@/features/F-project/contract/project-hook'
import { useOutput }    from '@/features/F-output/contract/output-hook'
import type {
  WorkspaceHook,
  ActiveProgram,
  PipelineView,
  DashboardSectionState,
  PlannerActions,
  OutputActions,
  ProjectActions,
  OutputState,
} from '../types/dashboard-types'
import type { PlannerJobId } from '@/features/F-planner/types/planner-types'

export function useWorkspace(): WorkspaceHook {
  const [jobId,      setJobId]      = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

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

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // ── ActiveProgram (A3) ────────────────────────────────────────────────────
  const program: ActiveProgram = project.activeProject
    ? {
        projectId:      project.activeProject.projectId,
        projectName:    project.activeProject.name,
        jobId,
        pipelineStatus: planner.job?.pipelineStatus ?? null,
        isPipelineDone,
      }
    : null

  // ── PipelineView (A3) ─────────────────────────────────────────────────────
  const pipelineView: PipelineView = planner.job
    ? {
        jobId:        planner.job.jobId,
        currentStage: planner.job.currentStage,
        stageStatus:  planner.job.stageStatus,
        pipelineLog:  planner.job.pipelineLog,
      }
    : null

  // ── OutputState (A3) ─────────────────────────────────────────────────────
  const outputState: OutputState = {
    files:       output.files,
    filesStatus: output.filesStatus,
    filesError:  output.filesError,
    pushStatus:  output.pushStatus,
    pushResult:  output.pushResult,
    pushError:   output.pushError,
  }

  // ── Action surfaces (A3) ──────────────────────────────────────────────────
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

  // ── DashboardSectionState (A3) ────────────────────────────────────────────
  const dashboardSection: DashboardSectionState = {
    isExpanded,
    toggleExpanded,
  }

  return {
    program,
    pipelineView,
    outputState,
    plannerActions,
    outputActions,
    projectActions,
    projects:         project.projects,
    dashboardSection,
  }
}
