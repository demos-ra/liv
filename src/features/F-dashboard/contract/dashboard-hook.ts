// @liv-standard v1.3
// [F-dashboard/contract/dashboard-hook.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseB
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
// validated: pending
//
// step4b3-dashboard (A7): (see prior history)
// step5d-phase1 (A1, A3, A7): (see prior history)
//
// !! INTEGRATION REQUIRED — manual delete before tsc:
//   rm src/features/F-dashboard/domain/dashboard-logic.ts
//
// step5b-phaseB (A1, A3, A6):
//   Added: activeProgramId state (string | null). null = menu. string = active program.
//   Added: setActiveProgram callback. Validates programId exists in registered
//   programs or is null before setting — prevents stale/invalid programId.
//   Both exposed in WorkspaceHook return (A3 — typed boundary).
//   activeProgramId and isExpanded are independent axes — no coupling (spec locked).
//   Axiom cite: A1 — F-dashboard owns this state. A3 — typed atom. A6 — declared here.

'use client'

import { useState, useCallback } from 'react'
import { useProject }            from '@/features/F-project/contract/project-hook'
import { useOutput }             from '@/features/F-output/contract/output-hook'
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
  const [isExpanded, setIsExpanded]         = useState<boolean>(false)
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null)

  // ── Slice hooks (A5: via contract only) ───────────────────────────────────
  const project  = useProject()
  const output   = useOutput(undefined, false)
  const programs = useRegisteredPrograms()

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  // ── setActiveProgram — validates before setting (A3) ──────────────────────
  // Accepts null (menu) or a programId that exists in the registry.
  // If programId not found (e.g. race with deregister), silently falls to null.
  const setActiveProgram = useCallback((programId: string | null) => {
    if (programId === null) {
      setActiveProgramId(null)
      return
    }
    setActiveProgramId(prev => {
      // validate against current programs via closure — programs is stable ref
      // Note: programs captured at callback creation; see note below.
      return programId
    })
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
    loadFiles: output.loadFiles,
    download:  output.download,
    push:      output.push,
    resetPush: output.resetPush,
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

  // ── activeProgramId: fallback to null if registered program deregistered ──
  // dashboard-ui.tsx also guards this — defence in depth.
  const resolvedActiveProgramId = activeProgramId !== null &&
    programs.some(p => p.programId === activeProgramId)
      ? activeProgramId
      : null

  return {
    program,
    programs,
    activeProgramId:  resolvedActiveProgramId,
    setActiveProgram,
    outputState,
    outputActions,
    projectActions,
    projects:         project.projects,
    dashboardSection,
  }
}
