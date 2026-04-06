// @liv-standard v1.3
// [F-design-system/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    reclassified R3→R4 (DOM I/O — A4 requires R4)
// slice:      F-design-system
// layer:      R4
// wires-in:   none
// wires-out:  (sets CSS vars on :root, exposes window._livTiming + window._livRecalc)
// deps:
//   R0 ../config/board
//   R1 ../domain/light-engine
//   R1 ../domain/type-engine
//   R1 ../domain/space-engine
//   R1 ../domain/motion
// validated:  pending
// note:       ONLY file in F-design-system that accesses DOM.
//             Type and space run once (masters don't change at runtime).
//             Light re-derives on theme change. Motion doesn't change.

'use client'

import { type ReactNode, useEffect } from 'react'
import { I_LIGHT, I_DARK } from '../config/board'
import { deriveLight } from '../domain/light-engine'
import { deriveType } from '../domain/type-engine'
import { deriveSpace } from '../domain/space-engine'
import { deriveMotion, TIMING } from '../domain/motion'

// ── Helpers (private) ──────────────────────────────────────────────────────

function getBaseI(): number {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? I_DARK
    : I_LIGHT
}

function setVars(vars: Record<string, string>): void {
  const style = document.documentElement.style
  for (const key in vars) {
    style.setProperty(key, vars[key])
  }
}

function recalcLight(): void {
  setVars(deriveLight(getBaseI()))
}

// ── Provider ───────────────────────────────────────────────────────────────

export function DesignSystemProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Type + space: run once — masters don't change at runtime
    setVars(deriveType())
    setVars(deriveSpace())

    // Motion: run once — timing and curves are constants
    setVars(deriveMotion())

    // Light: run on mount, re-derives on theme change
    setVars(deriveLight(getBaseI()))

    // Expose timing constants for JS modules (Planet, CRT, Toast, etc.)
    ;(window as any)._livTiming = {
      attack: TIMING.attack,
      release: TIMING.release,
      bloom: TIMING.bloom,
    }

    // Expose recalc for theme change — engine recomputes all 60 light vars
    ;(window as any)._livRecalc = recalcLight

    // Observe data-theme attribute for theme changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          recalcLight()
        }
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return <>{children}</>
}
