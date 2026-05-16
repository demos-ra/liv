// @liv-standard v1.5.2
// [F-admin/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    step5b-phaseD, phase-5.4; sprint-b2-unified-close (category retagged Modality → Tool per Manual v13.3 reclassification — F-admin is an L0-tier operational utility, not a wearer-facing Modality channel); sprint-b2-unified-close-fix-round (LIV-Standard pin sweep → v1.5.2 per cascade discipline)
// slice:      F-admin
// category:   Tool
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  @/features/F-surface/contract/surface-registry
//   W-ATOM  AdminDashboard      ./admin-ui  (dynamic import — deferred)
// wires-out:
//   W-ATOM  AdminRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  @/features/F-surface/contract/surface-registry  (A5 — R3 surface)
//   R3  ./admin-ui                                          (intra-slice — A5 compliant)
//   R5  react
//   R5  next/dynamic
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
//     A5 — useRegisterProgram imported from F-surface/contract (R3 surface only).
//
// phase-5.4 (A1, A7):
//   AdminDashboard converted to next/dynamic lazy import.
//   ssr: false — program components use client-only APIs.
//   .then(m => ({ default: m.AdminDashboard })) — named export wrapper.
//   Axiom cite: A1 — F-admin owns its registration. A7 — deletable.

'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useRegisterProgram } from '@/features/F-surface/contract/surface-registry'

const AdminDashboard = dynamic(
  () => import('./admin-ui').then(m => ({ default: m.AdminDashboard })),
  { ssr: false }
)

import type { ProgramProps } from '@/features/F-surface/types/surface-types'

export function AdminRegister() {
  useRegisterProgram({
    programId:   'admin',
    label:       'Admin',
    component:   AdminDashboard as React.ComponentType<ProgramProps>,
    actionKinds: [],
  })
  return null
}
