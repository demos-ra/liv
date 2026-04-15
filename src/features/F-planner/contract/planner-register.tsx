// @liv-standard v1.5
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5
// amended:    step5b-phaseC, phase-5.4
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  @/features/F-dashboard/contract/dashboard-registry
//   W-ATOM  BuilderStatusCard   ./planner-ui  (dynamic import — deferred)
// wires-out:
//   W-ATOM  PlannerRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-registry  (A5 — R3 surface)
//   R3  ./planner-ui                                        (intra-slice — A5 compliant)
//   R5  react
//   R5  next/dynamic
// validated: pending
//
// step5b-phaseC (A3):
//   Added: label: 'Builder' to registration intent.
//   ProgramRenderIntent now requires label (step5b-phaseA type change).
//   Menu displays this label as the clickable card text.
//   Axiom cite: A3 — typed atom at boundary; label is declared by the owning program.
//
// phase-5.4 (A1, A7):
//   BuilderStatusCard converted to next/dynamic lazy import.
//   ssr: false — program components use client-only APIs (polling, fetch).
//   .then(m => ({ default: m.BuilderStatusCard })) — named export wrapper.
//   next/dynamic returns ComponentType — ProgramRenderIntent contract unchanged.
//   Axiom cite: A1 — F-planner owns its registration. A7 — lazy loading transparent.

'use client'

import dynamic from 'next/dynamic'
import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'

const BuilderStatusCard = dynamic(
  () => import('./planner-ui').then(m => ({ default: m.BuilderStatusCard })),
  { ssr: false }
)

export function PlannerRegister() {
  useRegisterProgram({ programId: 'builder', label: 'Builder', component: BuilderStatusCard })
  return null
}
