// @liv-standard v1.3
// [F-admin/contract/admin-register.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseD
// slice:      F-admin
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  @/features/F-dashboard/contract/dashboard-registry
//   W-ATOM  AdminDashboard      ./admin-ui
// wires-out:
//   W-ATOM  AdminRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-registry  (A5 — R3 surface)
//   R3  ./admin-ui                                          (intra-slice — A5 compliant)
//   R5  react
// validated: pending
//
// step5b-phaseD (A1, A5):
//   Same pattern as planner-register.tsx. Renders null — registration only.
//   page.tsx mounts <AdminRegister /> conditionally (state.isAdmin guard).
//   programId: 'admin', label: 'Admin'.
//   A7 test: rm -rf src/features/F-admin → page.tsx errors on AdminRegister
//   import only. F-dashboard files produce zero errors (A7 verified).
//   Axiom cite:
//     A1 — F-admin owns its own registration. F-dashboard owns the registry protocol.
//     A5 — useRegisterProgram imported from F-dashboard/contract (R3 surface only).

'use client'

import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'
import { AdminDashboard }     from './admin-ui'

export function AdminRegister() {
  useRegisterProgram({ programId: 'admin', label: 'Admin', component: AdminDashboard })
  return null
}
