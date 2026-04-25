// @liv-standard v1.5.1
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-cleanup
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-ATOM  FrameworkModuleSummary  F-codec/R0  (phase-6-cleanup F012)
//   W-HOOK  useRegisterProgram  F-dashboard/R3 (dashboard-registry)
// wires-out:
//   W-ATOM  FrameworkProgramRegister  → src/app/page.tsx (composition root)
// deps:
//   R0  ../config/codec-module-types
//   R3  ../../F-dashboard/contract/dashboard-registry
//   R3  ./framework-program
//   R5  next/dynamic
//   R5  react
// validated:  pending

// Bridge: fetches registered modules from server, registers each as a
// dashboard program via useRegisterProgram. Replaces PlannerRegister.
// Fetch failure fallback: BUILD_FALLBACK ensures the Builder card is
// always present — prevents regression vs unconditional PlannerRegister.
//
// phase-6-cleanup F012: FrameworkModule split into runtime + transport.
// Client side uses FrameworkModuleSummary (no executor field). The
// previous BUILD_FALLBACK executor stub is gone — the type no longer
// requires one. Closes T-MODULE-TRANSPORT.

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRegisterProgram } from '@/features/F-dashboard/contract/dashboard-registry'
import type { FrameworkModuleSummary } from '../config/codec-module-types'

const FrameworkProgram = dynamic(
  () => import('./framework-program').then(m => ({ default: m.FrameworkProgram })),
  { ssr: false }
)

// ─── Hardcoded fallback ─────────────────────────────────────────────────────
// If /api/modules fails, register at least the build module so the dashboard
// never loses the Builder card. This prevents a regression vs the unconditional
// PlannerRegister it replaces.

const BUILD_FALLBACK: FrameworkModuleSummary = {
  id:    'build',
  mode:  'generative',
  label: 'Builder',
  artifactSchema: {
    name:   'build-report',
    fields: [
      { key: 'featureIntent',  label: 'Feature intent',  required: false },
      { key: 'pipelineStatus', label: 'Pipeline status', required: true },
      { key: 'outcome',        label: 'Outcome',         required: false },
    ],
  },
}

export function FrameworkProgramRegister() {
  const [modules, setModules] = useState<FrameworkModuleSummary[]>([BUILD_FALLBACK])

  useEffect(() => {
    fetch('/api/modules')
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.data) && data.data.length > 0) {
          setModules(data.data)
        }
        // If fetch succeeds but returns empty/invalid, keep fallback
      })
      .catch(err => {
        console.error('[framework-register] fetch failed, using fallback:', err)
        // Keep BUILD_FALLBACK — already in state
      })
  }, [])

  return (
    <>
      {modules.map(mod => (
        <ModuleRegistration key={mod.id} module={mod} />
      ))}
    </>
  )
}

function ModuleRegistration({ module }: { module: FrameworkModuleSummary }) {
  const BoundProgram = useBoundProgram(module)
  useRegisterProgram({
    programId: module.id,
    label:     module.label,
    component: BoundProgram,
  })
  return null
}

// Memoize the bound component so React identity is stable across renders.
function useBoundProgram(module: FrameworkModuleSummary) {
  const [Component] = useState(() => {
    return function BoundFrameworkProgram() {
      return <FrameworkProgram module={module} />
    }
  })
  return Component
}
