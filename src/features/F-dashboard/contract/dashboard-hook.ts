// @liv-standard v1.3
// [F-dashboard/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  DashboardView   ../types/dashboard-types
//   W-ATOM  DashboardPanel  ../types/dashboard-types
//   W-HOOK  usePlanner      @/features/F-planner/contract/planner-hook
//   W-HOOK  useProject      @/features/F-project/contract/project-hook
//   W-HOOK  useOutput       @/features/F-output/contract/output-hook
// wires-out:
//   W-HOOK  useDashboard  →  F-dashboard/R3 (dashboard-ui.tsx)
// deps:
//   R0  ../types/dashboard-types
//   R1  ../domain/dashboard-logic
//   R3  @/features/F-planner/contract/planner-hook
//   R3  @/features/F-project/contract/project-hook
//   R3  @/features/F-output/contract/output-hook
//   R5  react
// validated:  2026-03-12

'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlanner }  from '@/features/F-planner/contract/planner-hook'
import { useProject }  from '@/features/F-project/contract/project-hook'
import { useOutput }   from '@/features/F-output/contract/output-hook'
import { deriveActivePanel } from '../domain/dashboard-logic'
import type { DashboardView, DashboardPanel } from '../types/dashboard-types'
import type { PlannerJobId } from '@/features/F-planner/types/planner-types'

// ── Hook shape ─────────────────────────────────────────────────────────────────
export type DashboardHook = {
  // Project
  project:        ReturnType<typeof useProject>
  // Planner
  planner:        ReturnType<typeof usePlanner>
  // Output
  output:         ReturnType<typeof useOutput>
  // Navigation
  activePanel:    DashboardPanel
  goToPanel:      (panel: DashboardPanel) => void
  // Derived
  isPipelineDone: boolean
  jobId:          string | null
}

export function useDashboard(): DashboardHook {
  const [view, setView] = useState<DashboardView>({
    activePanel:   'intake',
    pipelineJobId: null,
  })

  const project = useProject()
  const planner = usePlanner(view.pipelineJobId as PlannerJobId | undefined)
  const isPipelineDone = planner.job?.pipelineStatus === 'complete'
  const output  = useOutput(view.pipelineJobId ?? undefined, isPipelineDone)

  // Derive active panel from pipeline state — auto-advance through steps
  const derivedPanel = deriveActivePanel(view, planner.job?.pipelineStatus ?? null)

  // Sync derived panel into view when pipeline state changes
  useEffect(() => {
    if (derivedPanel !== view.activePanel) {
      setView(v => ({ ...v, activePanel: derivedPanel }))
    }
  }, [derivedPanel, view.activePanel])

  // Capture jobId when pipeline starts
  useEffect(() => {
    if (planner.job?.jobId && !view.pipelineJobId) {
      setView(v => ({ ...v, pipelineJobId: planner.job!.jobId }))
    }
  }, [planner.job?.jobId, view.pipelineJobId])

  const goToPanel = useCallback((panel: DashboardPanel) => {
    setView(v => ({ ...v, activePanel: panel }))
  }, [])

  return {
    project,
    planner,
    output,
    activePanel:    view.activePanel,
    goToPanel,
    isPipelineDone,
    jobId:          view.pipelineJobId,
  }
}
