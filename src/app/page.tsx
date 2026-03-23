// @liv-standard v1.3
// [src/app/page.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseF
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
//   W-ATOM  AdminRegister   @/features/F-admin/contract/admin-register
// wires-out:  none  (mount point)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-hook  (A5)
//   R3  @/features/F-dashboard/contract/dashboard-ui    (A5)
//   R3  @/features/F-chat/contract/chat-ui              (A5)
//   R3  @/features/F-identity/contract/auth-hooks       (A5)
//   R3  @/features/F-identity/contract/auth-pages       (A5)
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R3  @/features/F-planner/contract/planner-register  (A5 — composition root)
//   R3  @/features/F-admin/contract/admin-register      (A5 — composition root)
//   R5  react
// validated: pending
//
// step4b1, step4b3-dashboard, step5d-phase2: (see prior history)
//
// step5b-phaseF (A1, A5):
//   Added: <AdminRegister /> — mounted conditionally on state.isAdmin.
//     AdminRegister registers 'admin' program into dashboard registry on mount,
//     deregisters on unmount. If user is not admin, program never registers
//     (not visible in menu, not accessible via chat intent).
//   Added: setActiveProgram passed to ChatUI as onSetActiveProgram prop.
//     Allows chat intent routing to activate programs without cross-slice imports.
//     page.tsx (composition root) owns this wiring (A1).
//   Axiom cite:
//     A1 — composition root owns all slice wiring. isAdmin gate lives here, not in F-admin.
//     A5 — AdminRegister imported from F-admin/contract (R3 surface only).

'use client'

import { useRef, useCallback } from 'react'
import { useAuth }          from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }         from '@/features/F-identity/contract/auth-pages'
import { useWorkspace }     from '@/features/F-dashboard/contract/dashboard-hook'
import { DashboardUI }      from '@/features/F-dashboard/contract/dashboard-ui'
import { ChatUI }           from '@/features/F-chat/contract/chat-ui'
import { Brand }            from '@/features/F-design-system/contract/primitives'
import { PlannerRegister }  from '@/features/F-planner/contract/planner-register'
import { AdminRegister }    from '@/features/F-admin/contract/admin-register'

// ── DashboardIcon ─────────────────────────────────────────────────────────────
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

      {/* ── Program registrations (composition root — A1) ── */}
      {/* Renders null. Registration side-effect only. */}
      <PlannerRegister />
      {/* AdminRegister: only mounts when user is admin — gate controls registration */}
      {state.isAdmin && <AdminRegister />}

      {/* ── HEADER ── */}
      <header className="chat-header">
        <div className="col chat-header-inner">
          <Brand variant="header" />

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

      {/* ── DASHBOARD ── */}
      <div style={{ flexShrink: 0 }}>
        <DashboardUI {...workspace} />
      </div>

      {/* ── CHAT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <ChatUI
          email={email}
          signOut={signOut}
          onOpenAccount={handleRegisterOpen}
          onSetActiveProgram={workspace.setActiveProgram}
        />
      </div>

    </div>
  )
}
