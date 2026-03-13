// @liv-standard v1.3
// [src/app/page.tsx]
// Built with LIV · livai.dev
// F-dashboard/R3 — authenticated shell + composition root mount point.

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step2-chat-dashboard
// slice:      F-dashboard
// layer:      R3
// wires-in:
//   W-HOOK  useWorkspace  @/features/F-dashboard/contract/dashboard-hook
//   W-HOOK  useAuth       @/features/F-identity/contract/auth-hooks
//   W-ATOM  WorkspaceHook @/features/F-dashboard/types/dashboard-types
//   W-ATOM  ChatSurface   @/features/F-dashboard/types/dashboard-types
// wires-out:  none  (mount point — top of render tree)
// deps:
//   R3  @/features/F-dashboard/contract/dashboard-hook   (A5)
//   R3  @/features/F-dashboard/contract/dashboard-ui     (A5)
//   R3  @/features/F-identity/contract/auth-hooks        (A5)
//   R3  @/features/F-identity/contract/auth-pages        (A5)
// validated:  2026-03-13
//
// Step 2 (A1, A3, A5):
//   page.tsx now constructs a ChatSurface atom from auth state and passes it
//   to useWorkspace(). This is the only place where identity props (email,
//   signOut) enter the chat surface — they flow downward through the typed
//   WorkspaceHook boundary and are never re-imported elsewhere.
//   F-chat has zero imports in page.tsx — contact surface is F-dashboard only.
//   Axiom cite:
//     A1 — useWorkspace is sole orchestration owner; page.tsx is mount point.
//     A3 — ChatSurface is the typed boundary atom threading identity to chat.
//     A5 — all imports via declared contract surfaces only.

'use client'

import { useAuth }      from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }     from '@/features/F-identity/contract/auth-pages'
import { useWorkspace } from '@/features/F-dashboard/contract/dashboard-hook'
import { DashboardUI }  from '@/features/F-dashboard/contract/dashboard-ui'

export default function Home() {
  const { state, signOut } = useAuth()

  // Construct ChatSurface atom from identity — passed as input to useWorkspace.
  // email falls back to empty string pre-auth; useWorkspace is called
  // unconditionally to satisfy Rules of Hooks.
  const chatSurface = {
    email:   state.status === 'authenticated' ? (state.user?.email ?? '') : '',
    signOut,
  }

  // Composition root — always called unconditionally (Rules of Hooks).
  // WorkspaceHook assembled here; DashboardUI only renders it.
  const workspace = useWorkspace(chatSurface)

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', background: 'var(--bg)',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 'var(--header-h)', padding: '0 var(--u4)',
        borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          LIV
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u2)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
            {state.user?.email ?? ''}
          </span>
          <button
            onClick={signOut}
            style={{ padding: 'var(--u05) var(--u15)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-sec)', fontSize: 12, fontFamily: 'var(--font-ui)', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <DashboardUI {...workspace} />
      </div>
    </div>
  )
}
