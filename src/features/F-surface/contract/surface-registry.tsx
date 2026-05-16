// @liv-standard v1.5.2
// [F-surface/contract/surface-registry.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-b2-unified-close (extracted from F-dashboard/contract/dashboard-registry.tsx — registry concern relocated per Manual v13.3 program-registry projection ownership)
// slice:      F-surface
// category:   Tool
// layer:      R3
// wires-in:
//   W-ATOM  ProgramRenderIntent  ../types/surface-types
// wires-out:
//   W-HOOK  useRegisterProgram      →  F-plan/R3, F-discover/R3, F-builder/R3, F-admin/R3, F-memory/R3, F-verify/R3 (all Modality programs that mount themselves; cross-slice via A5)
//   W-HOOK  useRegisteredPrograms   →  F-dashboard/R3 (dashboard-hook.ts, dashboard-ui.tsx)
//   W-ATOM  ProgramRegistryProvider →  F-dashboard/R3 (providers.tsx mounts the provider in the tree)
// deps:
//   R0  ../types/surface-types
//   R5  react
// validated:  pending
//
// sprint-b2-unified-close:
//   Slice extracted from F-dashboard. Registry mechanics unchanged from
//   F-dashboard/contract/dashboard-registry.tsx pre-extraction — same React
//   context, same idempotency, same lifecycle. The structural change is
//   ownership: F-surface (Tool) owns the projection layer between Modality
//   programs and F-dashboard. F-dashboard becomes a pure render surface.
//   Axiom cite:
//     A1 — F-surface owns the program-registry projection. F-dashboard
//          consumes the projection (render side); registered programs
//          consume the registration hook (declare side).
//     A3 — ProgramRenderIntent atom typed at the F-surface boundary.
//     A5 — All external consumers import only from F-surface/R3 (this file)
//          and F-surface/R0 (atoms). No reaching into the file directly.
//     A6 — ProgramRegistryContext declared at R3 of owning slice (F-surface).

'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import type { ProgramRenderIntent } from '../types/surface-types'

// ── Context ───────────────────────────────────────────────────────────────────

type ProgramRegistryState = {
  programs:        ProgramRenderIntent[]
  register:        (intent: ProgramRenderIntent) => void
  deregister:      (programId: string) => void
}

const ProgramRegistryContext = createContext<ProgramRegistryState | null>(null)

// ── ProgramRegistryProvider ───────────────────────────────────────────────────

export function ProgramRegistryProvider({ children }: { children: React.ReactNode }) {
  const [programs, setPrograms] = useState<ProgramRenderIntent[]>([])

  const register = useCallback((intent: ProgramRenderIntent) => {
    setPrograms(prev => {
      const existing = prev.findIndex(p => p.programId === intent.programId)
      if (existing !== -1) {
        // Idempotent: update component ref if programId already registered
        const next = [...prev]
        next[existing] = intent
        return next
      }
      return [...prev, intent]
    })
  }, [])

  const deregister = useCallback((programId: string) => {
    setPrograms(prev => prev.filter(p => p.programId !== programId))
  }, [])

  return (
    <ProgramRegistryContext.Provider value={{ programs, register, deregister }}>
      {children}
    </ProgramRegistryContext.Provider>
  )
}

// ── useRegisterProgram (R3) ───────────────────────────────────────────────────
// Called by programs (e.g. PlannerRegister) on mount.
// Registers intent, deregisters on unmount.
// Stable: uses ref to avoid effect re-run on identity change of component prop.

export function useRegisterProgram(intent: ProgramRenderIntent): void {
  const ctx = useContext(ProgramRegistryContext)
  // Store latest intent in ref so effect closure is always current
  const intentRef = useRef(intent)
  intentRef.current = intent

  useEffect(() => {
    if (!ctx) return
    ctx.register(intentRef.current)
    const id = intentRef.current.programId
    return () => {
      ctx.deregister(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx])
}

// ── useRegisteredPrograms (R3) ────────────────────────────────────────────────
// Read side. Dashboard calls this to get the current list of registered programs.

export function useRegisteredPrograms(): ProgramRenderIntent[] {
  const ctx = useContext(ProgramRegistryContext)
  if (!ctx) return []
  return ctx.programs
}
