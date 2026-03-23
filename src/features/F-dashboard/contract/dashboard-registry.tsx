// @liv-standard v1.3
// [F-dashboard/contract/dashboard-registry.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase1
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-ATOM  ProgramRenderIntent  ../types/dashboard-types
// wires-out:
//   W-HOOK  useRegisterProgram     →  F-planner/R3 (planner-register.tsx)
//   W-HOOK  useRegisteredPrograms  →  F-dashboard/R3 (dashboard-hook.ts, dashboard-ui.tsx)
//   W-ATOM  ProgramRegistryProvider →  F-dashboard/R3 (providers.tsx)
// deps:
//   R0  ../types/dashboard-types
//   R5  react
// validated:  pending
//
// step5d-phase1 (A1, A3, A5, A6):
//   New file. React context registry — programs declare into dashboard via
//   useRegisterProgram(). Dashboard reads via useRegisteredPrograms().
//   F-dashboard has zero knowledge of which programs exist — pure protocol.
//   useRegisterProgram: mounts registration, deregisters on unmount. Idempotent
//   by programId — duplicate registration updates in place (same component ref).
//   React context chosen over event bus: registration is synchronous mount-time
//   React lifecycle, not a runtime event. No cross-slice async needed.
//   Axiom cite:
//     A1 — F-dashboard owns the registry. Programs are consumers, not owners.
//     A3 — ProgramRenderIntent is the typed atom at the boundary.
//     A5 — F-planner imports only from F-dashboard/contract (R3 surface) — A5 compliant.
//     A6 — ProgramRegistryContext declared at R3 of owning slice.

'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import type { ProgramRenderIntent } from '../types/dashboard-types'

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
