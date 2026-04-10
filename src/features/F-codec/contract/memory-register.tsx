// @liv-standard v1.3
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  F-dashboard/R3
//   W-ATOM  MemoryProgram       F-codec/R3
// wires-out:
//   W-ATOM  MemoryRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  ../../F-dashboard/contract/dashboard-registry
//   R3  ./memory-program
// validated:  pending

// Memory program registration.
// A1: F-codec owns the memory program. F-dashboard owns program lifecycle.
// A5: registration via useRegisterProgram hook — no F-dashboard internals.
// Exact pattern from PlannerRegister / AdminRegister.

'use client'

import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'
import { MemoryProgram }      from './memory-program'

export function MemoryRegister() {
  useRegisterProgram({ programId: 'memory', label: 'Memory', component: MemoryProgram })
  return null
}
