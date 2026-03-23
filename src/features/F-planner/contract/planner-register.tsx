// @liv-standard v1.3
// [F-planner/contract/planner-register.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseC
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  @/features/F-dashboard/contract/dashboard-registry
//   W-ATOM  BuilderStatusCard   ./planner-ui
// wires-out:
//   W-ATOM  PlannerRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-registry  (A5 — R3 surface)
//   R3  ./planner-ui                                        (intra-slice — A5 compliant)
//   R5  react
// validated: pending
//
// step5d-phase2 (A1, A5, A7): (see prior history)
//
// step5b-phaseC (A3):
//   Added: label: 'Builder' to registration intent.
//   ProgramRenderIntent now requires label (step5b-phaseA type change).
//   Menu displays this label as the clickable card text.
//   Axiom cite: A3 — typed atom at boundary; label is declared by the owning program.

'use client'

import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'
import { BuilderStatusCard }  from './planner-ui'

export function PlannerRegister() {
  useRegisterProgram({ programId: 'builder', label: 'Builder', component: BuilderStatusCard })
  return null
}
