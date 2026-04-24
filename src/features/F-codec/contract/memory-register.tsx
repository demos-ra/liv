// @liv-standard v1.5.1
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.4
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-HOOK  useRegisterProgram  F-dashboard/R3
//   W-ATOM  MemoryProgram       F-codec/R3  (dynamic import — deferred)
// wires-out:
//   W-ATOM  MemoryRegister  →  src/app/page.tsx (composition root)
// deps:
//   R3  ../../F-dashboard/contract/dashboard-registry
//   R3  ./memory-program
//   R5  next/dynamic
// validated:  pending

// Memory program registration.
// A1: F-codec owns the memory program. F-dashboard owns program lifecycle.
// A5: registration via useRegisterProgram hook — no F-dashboard internals.
// Exact pattern from PlannerRegister / AdminRegister.
//
// phase-5.4 (A1):
//   MemoryProgram converted to next/dynamic lazy import.
//   ssr: false — program components use client-only APIs.
//   .then(m => ({ default: m.MemoryProgram })) — named export wrapper.
//   Axiom cite: A1 — F-codec owns its registration.

'use client'

import dynamic from 'next/dynamic'
import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'

const MemoryProgram = dynamic(
  () => import('./memory-program').then(m => ({ default: m.MemoryProgram })),
  { ssr: false }
)

export function MemoryRegister() {
  useRegisterProgram({ programId: 'memory', label: 'Memory', component: MemoryProgram })
  return null
}
