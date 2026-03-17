// @liv-standard v1.3
// [src/app/page.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b1-layout-restore
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-HOOK  useWorkspace  @/features/F-dashboard/contract/dashboard-hook
//   W-HOOK  useAuth       @/features/F-identity/contract/auth-hooks
//   W-ATOM  Brand         @/features/F-design-system/contract/primitives
//   W-ATOM  DashboardUI   @/features/F-dashboard/contract/dashboard-ui
//   W-ATOM  ChatUI        @/features/F-chat/contract/chat-ui
//   W-ATOM  AuthPage      @/features/F-identity/contract/auth-pages
// wires-out:  none  (mount point — top of render tree)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-hook   (A5)
//   R3  @/features/F-dashboard/contract/dashboard-ui     (A5)
//   R3  @/features/F-chat/contract/chat-ui               (A5)
//   R3  @/features/F-identity/contract/auth-hooks        (A5)
//   R3  @/features/F-identity/contract/auth-pages        (A5)
//   R3  @/features/F-design-system/contract/primitives   (A5)
//   R5  react
// validated:  pending
//
// step4b1 (A1, A2, A3, A5):
//   page.tsx is the layout owner. Three independent children — header,
//   DashboardUI, ChatUI — are siblings in a flex column, not nested.
//   Header: .chat-header class from mockup. Brand glow from design system.
//   username button calls openAccountRef.current() — fn registered by ChatUI
//   on mount via onOpenAccount prop. accountOpen state stays in ChatUI (A1).
//   DashboardUI: receives WorkspaceHook spread. dashboardSection atom carries
//   collapse state — no raw booleans cross the boundary (A3).
//   ChatUI: receives email + signOut from useAuth() directly — no ChatSurface
//   intermediary. F-dashboard has zero chat imports (A2, A5, A7).
//   useWorkspace() called unconditionally (Rules of Hooks). No args — chat
//   identity no longer threads through F-dashboard (A1 clean break).
//   Axiom cite:
//     A1 — page.tsx is layout owner. Header, dashboard, chat each own their surface.
//     A2 — no cross-slice imports. ChatUI imported at F-chat contract only.
//     A3 — DashboardSectionState typed atom crosses boundary. No raw state.
//     A5 — all imports via declared contract surfaces only.

'use client'

import { useRef, useCallback } from 'react'
import { useAuth }       from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }      from '@/features/F-identity/contract/auth-pages'
import { useWorkspace }  from '@/features/F-dashboard/contract/dashboard-hook'
import { DashboardUI }   from '@/features/F-dashboard/contract/dashboard-ui'
import { ChatUI }        from '@/features/F-chat/contract/chat-ui'
import { Brand }         from '@/features/F-design-system/contract/primitives'

export default function Home() {
  const { state, signOut } = useAuth()

  // ── Workspace — no args. Chat identity is independent (A1). ──────────────
  // Called unconditionally to satisfy Rules of Hooks.
  const workspace = useWorkspace()

  // ── Account panel bridge ──────────────────────────────────────────────────
  // ChatUI registers its internal setAccountOpen(true) here on mount.
  // Header username button calls openAccountRef.current?.() — no state lifted,
  // accountOpen stays in ChatUI (A1). Typed boundary: (openFn: () => void) => void (A3).
  const openAccountRef = useRef<(() => void) | null>(null)
  const handleRegisterOpen = useCallback((openFn: () => void) => {
    openAccountRef.current = openFn
  }, [])

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  const email    = state.user?.email ?? ''
  const userName = email.includes('@') ? email.split('@')[0] : email

  return (
    // .chat-page: display:flex flex-direction:column height:100dvh — from mockup/globals.css
    <div className="chat-page">

      {/* ── HEADER — .chat-header from mockup ── */}
      {/* Brand glow, username button. Matches mockup exactly. */}
      <header className="chat-header">
        <div className="col chat-header-inner">
          <Brand variant="header" />
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

      {/* ── DASHBOARD — collapsible, collapsed by default ── */}
      {/* DashboardSectionState atom (isExpanded, toggleExpanded) lives in   */}
      {/* workspace.dashboardSection — no raw booleans cross the boundary.   */}
      {/* flex-shrink:0 — dashboard takes only its intrinsic height.          */}
      {/* When expanded, chat-main below shrinks via flex layout naturally.   */}
      <div style={{ flexShrink: 0 }}>
        <DashboardUI {...workspace} />
      </div>

      {/* ── CHAT — flex:1, fills all remaining vertical space ── */}
      {/* ChatUI renders chat-main (flex:1 overflow:auto) + chat-footer.      */}
      {/* display:flex flex-direction:column so main + footer stack cleanly.  */}
      {/* overflow:hidden clips ChatUI within its flex cell.                   */}
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
