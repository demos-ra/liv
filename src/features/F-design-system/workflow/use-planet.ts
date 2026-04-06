// @liv-standard v1.3
// [F-design-system/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-planet
// slice:      F-design-system
// layer:      R2
// wires-in:   none
// wires-out:  usePlanet → F-design-system/contract
// deps:
//   R1 ../domain/motion (TIMING, CURVES)
//   R5 react
// validated:  pending
//
// phase3-planet (A1, A3):
//   10-state planet state machine for dashboard toggle.
//   Imperative DOM — no re-renders on phase change.
//   Matches mockup v26 lines 887–1021.
//   Mouse events own full visual sequence on click.
//   isOn effect only handles programmatic/external toggles —
//   skips when phaseRef is a press state (mouse-driven).
//   Axiom cite:
//     A1 — single hook owns all planet visual state.
//     A3 — typed boundary: handlers record out, boolean + ref in.

import { useRef, useEffect, useCallback, type RefObject } from 'react'
import { TIMING, CURVES } from '../domain/motion'

// ── Constants ────────────────────────────────────────────────────────────────

type PlanetPhase =
  | 'off-rest' | 'off-hover' | 'off-press'
  | 'on-rest'  | 'on-hover'  | 'on-press'

const ALL_PLANET_CLASSES = [
  'planet-off-rest', 'planet-off-hover-in', 'planet-off-hover-out',
  'planet-off-press-in', 'planet-off-press-out',
  'planet-on-rest', 'planet-on-hover-in', 'planet-on-hover-out',
  'planet-on-press-in', 'planet-on-press-out',
] as const

const INK_CLASSES = new Set<string>(['planet-off-rest', 'planet-off-hover-out'])

// ── Transition builders ──────────────────────────────────────────────────────

function transitionGoodbye(): string {
  return `color ${TIMING.release}ms ${CURVES.G}, text-shadow ${TIMING.release}ms ${CURVES.G}`
}

function transitionMaterialSwitch(): string {
  return `color 0ms, text-shadow ${TIMING.attack}ms ${CURVES.S}`
}

function transitionStandard(isIn: boolean): string {
  const dur = isIn ? TIMING.attack : TIMING.release
  return `color ${dur}ms ${CURVES.S}, text-shadow ${dur}ms ${CURVES.S}`
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UsePlanetResult {
  handlers: {
    onMouseEnter: () => void
    onMouseLeave: () => void
    onMouseDown:  (e: React.MouseEvent) => void
    onMouseUp:    () => void
  }
}

export function usePlanet(
  isOn: boolean,
  ref: RefObject<HTMLElement | null>,
): UsePlanetResult {
  const phaseRef   = useRef<PlanetPhase>('off-rest')
  const classRef   = useRef<string>('planet-off-rest')
  const lockedRef  = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearTO = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const applyClass = useCallback((cls: string, isGoodbye?: boolean) => {
    const el = ref.current
    if (!el) return

    const prev = classRef.current
    const isIn = cls.includes('-hover-in') || cls.includes('-press-in')
    const materialSwitchIn =
      INK_CLASSES.has(prev) && !INK_CLASSES.has(cls) && isIn

    let transition: string
    if (isGoodbye) {
      transition = transitionGoodbye()
    } else if (materialSwitchIn) {
      transition = transitionMaterialSwitch()
    } else {
      transition = transitionStandard(isIn)
    }

    el.style.transition = transition
    for (const c of ALL_PLANET_CLASSES) el.classList.remove(c)
    el.classList.add(cls)
    classRef.current = cls
  }, [ref])

  // ── Sync isOn — external/programmatic only ───────────────────────────────
  // Skip when phase is a press state — mouseup owns that sequence.

  const prevOnRef = useRef(isOn)

  useEffect(() => {
    if (isOn === prevOnRef.current) return
    prevOnRef.current = isOn

    const phase = phaseRef.current
    if (phase === 'off-press' || phase === 'on-press') return

    clearTO()

    if (isOn) {
      phaseRef.current = 'on-rest'
      lockedRef.current = false
      applyClass('planet-on-rest')
    } else {
      lockedRef.current = true
      applyClass('planet-on-press-out')
      timeoutRef.current = setTimeout(() => {
        applyClass('planet-off-rest', true)
        timeoutRef.current = setTimeout(() => {
          phaseRef.current = 'off-rest'
          lockedRef.current = false
        }, TIMING.release)
      }, TIMING.release)
    }
  }, [isOn, clearTO, applyClass])

  // ── Initial class on mount ───────────────────────────────────────────────

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const initial = isOn ? 'planet-on-rest' : 'planet-off-rest'
    phaseRef.current = isOn ? 'on-rest' : 'off-rest'
    for (const c of ALL_PLANET_CLASSES) el.classList.remove(c)
    el.classList.add(initial)
    classRef.current = initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => clearTO, [clearTO])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const onMouseEnter = useCallback(() => {
    if (lockedRef.current) return
    clearTO()
    if (phaseRef.current.startsWith('on-')) {
      phaseRef.current = 'on-hover'
      applyClass('planet-on-hover-in')
    } else {
      phaseRef.current = 'off-hover'
      applyClass('planet-off-hover-in')
    }
  }, [clearTO, applyClass])

  const onMouseLeave = useCallback(() => {
    if (lockedRef.current) return
    clearTO()
    const phase = phaseRef.current
    if (phase === 'off-hover' || phase === 'off-press') {
      applyClass('planet-off-hover-out')
      timeoutRef.current = setTimeout(() => {
        applyClass('planet-off-rest')
        phaseRef.current = 'off-rest'
      }, TIMING.release)
    } else if (phase === 'on-hover' || phase === 'on-press') {
      applyClass('planet-on-hover-out')
      timeoutRef.current = setTimeout(() => {
        applyClass('planet-on-rest')
        phaseRef.current = 'on-rest'
      }, TIMING.release)
    }
  }, [clearTO, applyClass])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (lockedRef.current) return
    e.preventDefault()
    clearTO()
    const phase = phaseRef.current
    if (phase === 'off-hover' || phase === 'off-rest') {
      phaseRef.current = 'off-press'
      applyClass('planet-off-press-in')
    } else if (phase === 'on-hover' || phase === 'on-rest') {
      phaseRef.current = 'on-press'
      applyClass('planet-on-press-in')
    }
  }, [clearTO, applyClass])

  const onMouseUp = useCallback(() => {
    if (lockedRef.current) return
    clearTO()
    const phase = phaseRef.current

    if (phase === 'off-press') {
      // off→on: press-out, then arrive at on-rest
      applyClass('planet-off-press-out')
      timeoutRef.current = setTimeout(() => {
        phaseRef.current = 'on-rest'
        applyClass('planet-on-rest')
      }, TIMING.release)
    } else if (phase === 'on-press') {
      // on→off: press-out, goodbye to off-rest
      applyClass('planet-on-press-out')
      lockedRef.current = true
      timeoutRef.current = setTimeout(() => {
        applyClass('planet-off-rest', true)
        timeoutRef.current = setTimeout(() => {
          phaseRef.current = 'off-rest'
          lockedRef.current = false
        }, TIMING.release)
      }, TIMING.release)
    }
  }, [clearTO, applyClass])

  return {
    handlers: { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp },
  }
}
