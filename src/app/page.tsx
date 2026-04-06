// @liv-standard v1.3
// [src/app/page.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-planet, phase4-page-transitions, phase5-remediation
// slice:      core/app
// layer:      R4
// wires-in:
//   W-HOOK  useWorkspace       @/features/F-dashboard/contract/dashboard-hook
//   W-HOOK  useAuth            @/features/F-identity/contract/auth-hooks
//   W-HOOK  usePlanet          @/features/F-design-system/exec/use-planet
//   W-HOOK  usePageTransition  @/features/F-design-system/exec/use-page-transition
//   W-ATOM  Brand              @/features/F-design-system/contract/primitives
//   W-ATOM  StatusDot          @/features/F-design-system/contract/primitives
//   W-ATOM  DashboardUI        @/features/F-dashboard/contract/dashboard-ui
//   W-ATOM  ChatUI             @/features/F-chat/contract/chat-ui
//   W-ATOM  AuthPage           @/features/F-identity/contract/auth-pages
//   W-ATOM  AccountPage        @/features/F-user-profile/contract/account-page
//   W-ATOM  PlannerRegister    @/features/F-planner/contract/planner-register
//   W-ATOM  AdminRegister      @/features/F-admin/contract/admin-register
// wires-out:  none  (mount point)
// deps:
//   R4  @/features/F-design-system/exec/use-planet          (A4 — DOM I/O)
//   R4  @/features/F-design-system/exec/use-page-transition (A4 — DOM I/O)
//   R3  @/features/F-dashboard/contract/dashboard-hook  (A5)
//   R3  @/features/F-dashboard/contract/dashboard-ui    (A5)
//   R3  @/features/F-chat/contract/chat-ui              (A5)
//   R3  @/features/F-identity/contract/auth-hooks       (A5)
//   R3  @/features/F-identity/contract/auth-pages       (A5)
//   R3  @/features/F-design-system/contract/primitives  (A5)
//   R3  @/features/F-user-profile/contract/account-page (A5)
//   R3  @/features/F-planner/contract/planner-register  (A5 — composition root)
//   R3  @/features/F-admin/contract/admin-register      (A5 — composition root)
//   R5  react
// validated: pending
//
// phase2-account-extraction (A1, A5):
//   activePage state: 'chat' | 'account'. Both pages always mounted in DOM,
//   visibility toggled via .page.visible / .page.hidden classes.
//   ChatUI stays mounted when account is visible — preserves messages,
//   input, streaming state. Sets up Phase 4 dissolve/form transitions.
//   Theme state lifted from ChatUI to composition root (A1 — app-level concern).
//   page.tsx sets data-theme and calls _livRecalc.
//   openAccountRef bridge removed — username click sets activePage directly.
//   onOpenAccount callback retained for ChatUI's no-API-key flow only.
//   AccountPage imported from F-user-profile (A1 — single ownership).
//
// phase3-planet (A1, A5):
//   Added: usePlanet hook from F-design-system/contract.
//   Dashboard toggle button wired to planet state machine via ref + handlers.
//   Hook manages all planet-* CSS classes imperatively — no inline style.
//   Axiom cite:
//     A1 — composition root owns ref and handler wiring.
//     A5 — usePlanet imported from F-design-system/contract (R3 barrel).
//
// phase4-page-transitions (A1, A5):
//   Replaced direct class toggling with usePageTransition hook.
//   showPage() choreographs dissolve/form with overlap and CSS custom
//   property injection. data-page attributes on wrapper divs for DOM query.
//   headerRef passed to hook for future login boundary animation.
//   AccountPage receives pageClass string instead of visible boolean.
//   activePage state removed — currentPage sourced from hook.

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth }          from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }         from '@/features/F-identity/contract/auth-pages'
import { useWorkspace }     from '@/features/F-dashboard/contract/dashboard-hook'
import { DashboardUI }      from '@/features/F-dashboard/contract/dashboard-ui'
import { ChatUI }           from '@/features/F-chat/contract/chat-ui'
import { AccountPage }      from '@/features/F-user-profile/contract/account-page'
import { Brand, StatusDot } from '@/features/F-design-system/contract/primitives'
import { usePlanet } from '@/features/F-design-system/exec/use-planet'
import { usePageTransition } from '@/features/F-design-system/exec/use-page-transition'
import { PlannerRegister }  from '@/features/F-planner/contract/planner-register'
import { AdminRegister }    from '@/features/F-admin/contract/admin-register'

// ── DashboardIcon ─────────────────────────────────────────────────────────────
function DashboardIcon() {
  return (
    <svg
      className="icon-planet"
      viewBox="0 0 256 256"
      fill="currentColor"
      width="16" height="16"
      aria-hidden="true"
    >
      <path d="M245.11,60.68c-7.65-13.19-27.84-16.16-58.5-8.66A95.93,95.93,0,0,0,32,128a98,98,0,0,0,.78,12.31C5.09,169,5.49,186,10.9,195.32,16,204.16,26.64,208,40.64,208a124.11,124.11,0,0,0,28.79-4A95.93,95.93,0,0,0,224,128a97.08,97.08,0,0,0-.77-12.25c12.5-13,20.82-25.35,23.65-35.92C248.83,72.51,248.24,66.07,245.11,60.68ZM128,48a80.11,80.11,0,0,1,78,62.2c-17.06,16.06-40.15,32.53-62.07,45.13C116.38,171.14,92.48,181,73.42,186.4A79.94,79.94,0,0,1,128,48ZM24.74,187.29c-1.46-2.51-.65-7.24,2.22-13a79.05,79.05,0,0,1,10.29-15.05,96,96,0,0,0,18,31.32C38,193.46,27.24,191.61,24.74,187.29ZM128,208a79.45,79.45,0,0,1-38.56-9.94,370,370,0,0,0,62.43-28.86c21.58-12.39,40.68-25.82,56.07-39.08A80.07,80.07,0,0,1,128,208ZM231.42,75.69c-1.7,6.31-6.19,13.53-12.63,21.13a95.69,95.69,0,0,0-18-31.35c14.21-2.35,27.37-2.17,30.5,3.24C232.19,70.28,232.24,72.63,231.42,75.69Z"/>
    </svg>
  )
}

export default function Home() {
  const { state, signOut } = useAuth()
  const workspace = useWorkspace()

  // ── Page transitions ─────────────────────────────────────────────────────
  // headerRef: Deferred — login boundary transitions (Phase 4+).
  // .form classes on header children pre-wire formIn participation.
  const headerRef = useRef<HTMLElement | null>(null)
  const { showPage, pageClass, currentPage } = usePageTransition(headerRef)

  // ── Planet state machine ────────────────────────────────────────────────
  const planetRef = useRef<HTMLButtonElement>(null)
  const planet = usePlanet(workspace.dashboardSection.isExpanded, planetRef)

  // ── Theme (lifted from ChatUI — app-level concern, A1) ────────────────────
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    ;(window as any)._livRecalc?.()
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  // ── Callbacks ─────────────────────────────────────────────────────────────
  const openAccount = useCallback(() => showPage('account'), [showPage])
  const closeAccount = useCallback(() => showPage('chat'), [showPage])

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  const email    = state.user?.email ?? ''
  const userName = email.includes('@') ? email.split('@')[0] : email
  const { isExpanded, toggleExpanded } = workspace.dashboardSection

  return (
    <>
      {/* ── Program registrations (composition root — A1) ── */}
      <PlannerRegister />
      {state.isAdmin && <AdminRegister />}

      {/* ── HEADER (persistent — outside all pages) ── */}
      <header ref={headerRef} className="chat-header">
        <div className="col chat-header-inner">
          <div className="chat-header-left">
            <Brand variant="header" className="form" />
          </div>
          <div className="chat-header-right">
            <button
              ref={planetRef}
              type="button"
              className="dashboard-toggle form"
              onClick={toggleExpanded}
              aria-label={isExpanded ? 'Collapse dashboard' : 'Expand dashboard'}
              {...planet.handlers}
            >
              <DashboardIcon />
            </button>
            <StatusDot status="accent" className="form" />
            <button
              type="button"
              className="header-username form"
              onClick={currentPage === 'account' ? closeAccount : openAccount}
              aria-label={currentPage === 'account' ? 'Return to chat' : 'Open account settings'}
            >
              {userName}
            </button>
          </div>
        </div>
      </header>

      {/* ── DASHBOARD ── */}
      <div className="dashboard-area">
        <DashboardUI {...workspace} />
      </div>

      {/* ── CHAT (always mounted, transition via hook) ── */}
      <div className={`${pageClass('chat')} page-main`} data-page="chat">
        <ChatUI
          email={email}
          signOut={signOut}
          onOpenAccount={openAccount}
          onSetActiveProgram={workspace.setActiveProgram}
        />
      </div>

      {/* ── ACCOUNT (always mounted, transition via hook) ── */}
      <AccountPage
        pageClass={`${pageClass('account')} page-main`}
        email={email}
        onClose={closeAccount}
        onSignOut={signOut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  )
}
