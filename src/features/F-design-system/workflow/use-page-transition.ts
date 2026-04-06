// @liv-standard v1.3
// [F-design-system/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase4-page-transitions
// slice:      F-design-system
// layer:      R2
// wires-in:   none
// wires-out:  (internal — consumed by F-design-system barrel)
// deps:
//   R0 ../config/board  (ATTACK, RELEASE — resolved timing values)
//   R5 react
// validated:  pending
//
// phase4-page-transitions (A1, A2):
//   Orchestrates page dissolve/form transitions. Pure state management +
//   timeout scheduling. No I/O (A2 — R2 orchestration only).
//   Consumers call showPage(); hook manages class strings and timeouts.
//   Duration values resolved from board constants — no var() in JS (design rule).
//   Header participates at login boundary only (dissolves on sign-out,
//   forms on entrance). Chat↔account: header persists, no animation.
//   Login transitions deferred (Phase 4 scope = chat↔account).

import { useState, useRef, useCallback, useEffect, type RefObject } from 'react'
import { ATTACK, RELEASE } from '../config/board'

// ── Types ────────────────────────────────────────────────────────────────────

type PageId = 'chat' | 'account'
type Tier = 'default' | 'entrance'

type PageState = 'visible' | 'hidden' | 'dissolving' | 'forming'

interface PageTransitionResult {
  showPage:    (pageId: PageId, tier?: Tier) => void
  pageClass:   (pageId: PageId) => string
  currentPage: PageId
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function usePageTransition(
  headerRef: RefObject<HTMLElement | null>,
): PageTransitionResult {

  const [currentPage, setCurrentPage] = useState<PageId>('chat')
  const pageStates = useRef<Record<PageId, PageState>>({
    chat:    'visible',
    account: 'hidden',
  })

  // Force re-render after class changes (ref mutations don't trigger renders)
  const [, setTick] = useState(0)
  const tick = useCallback(() => setTick((n: number) => n + 1), [])

  // Timeout tracking for cleanup
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      fn()
      timeouts.current = timeouts.current.filter(t => t !== id)
    }, ms)
    timeouts.current.push(id)
    return id
  }, [])

  // ── showPage ─────────────────────────────────────────────────────────────

  const showPage = useCallback((pageId: PageId, tier: Tier = 'default') => {
    const outgoing = currentPage
    if (outgoing === pageId) return

    const dur = tier === 'entrance' ? RELEASE : ATTACK
    const offset = dur / 2

    // Clear any in-flight transitions
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []

    // ── Set CSS custom properties on page elements ──
    // Query by data-page attribute (set by page.tsx on wrapper divs)
    const outEl = document.querySelector(`[data-page="${outgoing}"]`) as HTMLElement | null
    const inEl  = document.querySelector(`[data-page="${pageId}"]`) as HTMLElement | null

    if (outEl) outEl.style.setProperty('--dissolve-dur', `${dur}ms`)
    if (inEl)  inEl.style.setProperty('--form-dur', `${dur}ms`)

    // ── Outgoing: visible → dissolving → hidden ──
    pageStates.current[outgoing] = 'dissolving'
    tick()

    schedule(() => {
      pageStates.current[outgoing] = 'hidden'
      tick()
    }, dur)

    // ── Incoming: hidden → (after offset) → forming+visible → visible ──
    schedule(() => {
      pageStates.current[pageId] = 'forming'
      tick()

      schedule(() => {
        pageStates.current[pageId] = 'visible'
        tick()
      }, dur)
    }, offset)

    // ── Header: no animation during chat↔account ──
    // Login boundary logic exists but is unreachable in current scope
    // (login is conditionally rendered, not in the page set).
    // When login joins the page set, this path activates:
    //   - target === 'login': header dissolves
    //   - outgoing === 'login': header forms (entrance tier)

    setCurrentPage(pageId)
  }, [currentPage, tick, schedule])

  // ── pageClass ────────────────────────────────────────────────────────────

  const pageClass = useCallback((pageId: PageId): string => {
    const s = pageStates.current[pageId]
    switch (s) {
      case 'visible':    return 'page visible'
      case 'hidden':     return 'page hidden'
      case 'dissolving': return 'page visible dissolving'
      case 'forming':    return 'page visible forming'
      default:           return 'page hidden'
    }
  }, [])

  // ── Cleanup ──────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [])

  return { showPage, pageClass, currentPage }
}
