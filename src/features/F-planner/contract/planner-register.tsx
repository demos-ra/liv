// @liv-standard v1.3
// [F-planner/contract/planner-register.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase2
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
// validated:  pending
//
// step5d-phase2 (A1, A5, A7):
//   New file. Thin registration component. Calls useRegisterProgram() with
//   programId: 'builder' and component: BuilderStatusCard.
//   Renders null — registration only. No UI.
//   page.tsx mounts <PlannerRegister /> in the composition root so it registers
//   on mount and deregisters on unmount. One import of this component in page.tsx
//   is expected and correct — composition root is where slices wire together.
//   A7 test: rm -rf src/features/F-planner → page.tsx errors on PlannerRegister
//   import (expected — page.tsx is the composition root, not F-dashboard).
//   F-dashboard files produce zero errors — A7 verified.
//   Axiom cite:
//     A1 — F-planner owns builder registration. F-dashboard owns the registry protocol.
//     A5 — useRegisterProgram imported from F-dashboard/contract (R3 surface only).

'use client'

import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'
import { BuilderStatusCard }  from './planner-ui'

export function PlannerRegister() {
  useRegisterProgram({ programId: 'builder', component: BuilderStatusCard })
  return null
}
