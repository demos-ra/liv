// @liv-standard v1.3
// [src/app/page.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5d-phase2
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-HOOK  useWorkspace    @/features/F-dashboard/contract/dashboard-hook
//   W-HOOK  useAuth         @/features/F-identity/contract/auth-hooks
//   W-ATOM  Brand           @/features/F-design-system/contract/primitives
//   W-ATOM  DashboardUI     @/features/F-dashboard/contract/dashboard-ui
//   W-ATOM  ChatUI          @/features/F-chat/contract/chat-ui
//   W-ATOM  AuthPage        @/features/F-identity/contract/auth-pages
//   W-ATOM  PlannerRegister @/features/F-planner/contract/planner-register
// wires-out:  none  (mount point)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-hook  (A5)
//   R3  @/features/F-dashboard/contract/dashboard-ui    (A5)
//   R3  @/features/F-chat/contract/chat-ui              (A5)
//   R3  @/features/F-identity/contract/auth-hooks       (A5)
//   R3  @/features/F-identity/contract/auth-pages       (A5)
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R3  @/features/F-planner/contract/planner-register  (A5 — composition root)
//   R5  react
// validated:  pending
//
// step4b1 (A1, A2, A3, A5): (see prior history)
//
// step4b3-dashboard (A1, A3, A7):
//   Removed: second header row, ToggleBar component, grid+chevron SVG (A7).
//   Added: single dashboard icon button in .chat-header-inner between Brand
//   and username. Uses .btn-icon class.
//   Axiom cite: A1 — header owns the toggle icon. A7 — ToggleBar deleted.
//
// step5d-phase2 (A1, A5):
//   Added: <PlannerRegister /> in render tree — mounts builder program into the
//   dashboard registry on mount, deregisters on unmount. Composition root is the
//   correct location for wiring slices together (A1: one place, clear ownership).
//   F-planner import here is expected — page.tsx is the composition root, not
//   a feature slice. A7 test: removing F-planner from src/ leaves F-dashboard
//   files clean; only page.tsx errors on the PlannerRegister import (correct).
//   Axiom cite:
//     A1 — composition root owns wiring. Not F-dashboard's responsibility.
//     A5 — PlannerRegister imported from F-planner/contract (R3 surface).

'use client'

import { useRef, useCallback } from 'react'
import { useAuth }          from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }         from '@/features/F-identity/contract/auth-pages'
import { useWorkspace }     from '@/features/F-dashboard/contract/dashboard-hook'
import { DashboardUI }      from '@/features/F-dashboard/contract/dashboard-ui'
import { ChatUI }           from '@/features/F-chat/contract/chat-ui'
import { Brand }            from '@/features/F-design-system/contract/primitives'
import { PlannerRegister }  from '@/features/F-planner/contract/planner-register'

// ── DashboardIcon — 14×14 horizontal lines glyph ─────────────────────────────
function DashboardIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="1" y1="3.5"  x2="13" y2="3.5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="7"    x2="13" y2="7"    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Home() {
  const { state, signOut } = useAuth()
  const workspace = useWorkspace()

  // ── Account panel bridge ──────────────────────────────────────────────────
  const openAccountRef = useRef<(() => void) | null>(null)
  const handleRegisterOpen = useCallback((openFn: () => void) => {
    openAccountRef.current = openFn
  }, [])

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  const email    = state.user?.email ?? ''
  const userName = email.includes('@') ? email.split('@')[0] : email
  const { isExpanded, toggleExpanded } = workspace.dashboardSection

  return (
    <div className="chat-page">

      {/* ── PlannerRegister — mounts builder into the dashboard registry ── */}
      {/* Renders null. Registration side-effect only. A1: composition root wires slices. */}
      <PlannerRegister />

      {/* ── HEADER ── */}
      <header className="chat-header">
        <div className="col chat-header-inner">
          <Brand variant="header" />

          {/* Dashboard toggle icon — between Brand and username */}
          <button
            type="button"
            className="btn-icon"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Collapse dashboard' : 'Expand dashboard'}
            style={{
              color:       isExpanded ? 'var(--text-sec)' : 'var(--text-dis)',
              transition:  `color var(--dur-fast)`,
              marginLeft:  'auto',
              marginRight: 'var(--u2)',
            }}
          >
            <DashboardIcon />
          </button>

          <button
            type="button"
            className="header-username"
            onClick={() => openAccountRef.current?.()}
            aria-label="Open account settings"
          >
            {userName}
          </button>
        </div>
      </header>

      {/* ── DASHBOARD — flexShrink:0, renders null when collapsed ── */}
      <div style={{ flexShrink: 0 }}>
        <DashboardUI {...workspace} />
      </div>

      {/* ── CHAT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <ChatUI
          email={email}
          signOut={signOut}
          onOpenAccount={handleRegisterOpen}
        />
      </div>

    </div>
  )
}
