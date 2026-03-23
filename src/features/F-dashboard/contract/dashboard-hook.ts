// @liv-standard v1.3
// [F-dashboard/contract/dashboard-hook.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase1
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  WorkspaceHook         ../types/dashboard-types
//   W-ATOM  ActiveProgram         ../types/dashboard-types
//   W-ATOM  ProgramRenderIntent   ../types/dashboard-types
//   W-ATOM  OutputActions         ../types/dashboard-types
//   W-ATOM  ProjectActions        ../types/dashboard-types
//   W-ATOM  OutputState           ../types/dashboard-types
//   W-ATOM  DashboardSectionState ../types/dashboard-types
//   W-HOOK  useRegisteredPrograms @/features/F-dashboard/contract/dashboard-registry
//   W-HOOK  useProject            @/features/F-project/contract/project-hook
//   W-HOOK  useOutput             @/features/F-output/contract/output-hook
// wires-out:
//   W-HOOK  useWorkspace  →  F-dashboard/R3 (dashboard-ui.tsx), src/app/page.tsx
// deps:
//   R0  ../types/dashboard-types
//   R3  ./dashboard-registry         (intra-slice — A5 compliant)
//   R3  @/features/F-project/contract/project-hook   (A5)
//   R3  @/features/F-output/contract/output-hook     (A5)
//   R5  react
// validated:  pending
//
// step4b3-dashboard (A7):
//   Removed: activePanel, setActivePanel, goToPanel, DashboardPanel import.
//   Removed: deriveActivePanel import and re-export (dashboard-logic.ts deleted).
//   Auto-advance panel useEffect removed — no panels to advance to.
//   Axiom cite: A7 — removed all dead code with zero consumers.
//
// !! INTEGRATION REQUIRED — manual delete before tsc:
//   rm src/features/F-dashboard/domain/dashboard-logic.ts
//   This file still exists on disk and imports from F-planner. Tar cannot express
//   deletions. The grep gate (grep -r "F-planner" src/features/F-dashboard/) will
//   fail until it is removed. No file in the deliverable imports it — safe to delete.
//
// step5d-phase1 (A1, A3, A7):
//   Removed: usePlanner import and all usePlanner() usage — A7 (F-planner decoupled).
//   Removed: PlannerJobId import from F-planner — A7.
//   Removed: jobId state, jobId capture effect — builder-specific, owned by F-planner.
//   Removed: pipelineView, plannerActions from return — no longer part of WorkspaceHook.
//   Removed: pipelineStatus, isPipelineDone from ActiveProgram — builder-specific.
//   Removed: useOutput isPipelineDone arg — replaced with always-enabled poll.
//   Added: useRegisteredPrograms() — reads registry for programs to render.
//   useOutput: polling now unconditional (no longer gated on isPipelineDone).
//   Dashboard knows: project state + output state + registered programs.
//   Axiom cite:
//     A1 — dashboard owns dashboard state only; pipeline state lives in F-planner.
//     A3 — typed atoms at boundary. A7 — dead fields removed.

'use client'

import { useState, useCallback } from 'react'
import { useProject }           from '@/features/F-project/contract/project-hook'
import { useOutput }            from '@/features/F-output/contract/output-hook'
import { useRegisteredPrograms } from './dashboard-registry'
import type {
  WorkspaceHook,
  ActiveProgram,
  DashboardSectionState,
  OutputActions,
  ProjectActions,
  OutputState,
} from '../types/dashboard-types'

export function useWorkspace(): WorkspaceHook {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  // ── Slice hooks (A5: via contract only) ───────────────────────────────────
  const project  = useProject()
  // Output polling is unconditional — dashboard always shows latest output state.
  // F-planner drives jobId internally via its own hook; dashboard no longer tracks it.
  const output   = useOutput(undefined, false)
  const programs = useRegisteredPrograms()

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // ── ActiveProgram (A3) ────────────────────────────────────────────────────
  const program: ActiveProgram = project.activeProject
    ? {
        projectId:   project.activeProject.projectId,
        projectName: project.activeProject.name,
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
    programs,
    outputState,
    outputActions,
    projectActions,
    projects:         project.projects,
    dashboardSection,
  }
}
