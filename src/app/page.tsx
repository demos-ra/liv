// @liv-standard v1.3
// [F-workspace/R3]
// Built with LIV · livai.dev
//
// Step 3 — wire F-workspace to render F-dashboard.
// F-workspace remains the authenticated shell/provider layer.
// F-dashboard owns all visible UI inside the authenticated surface.
// F-chat stub replaced by DashboardUI.
// Axiom cite: A1 — F-workspace is shell owner; F-dashboard is UI owner.

'use client'

import { useAuth }     from '@/features/F-identity/contract/auth-hooks'
import { AuthPage }    from '@/features/F-identity/contract/auth-pages'
import { DashboardUI } from '@/features/F-dashboard/contract/dashboard-ui'

export default function Home() {
  const { state, signOut } = useAuth()

  if (state.status === 'loading')       return null
  if (state.status !== 'authenticated') return <AuthPage />

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100vh',
      overflow:      'hidden',
      background:    'var(--bg)',
    }}>
      {/* Minimal header shell — F-workspace layer */}
      <header style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        height:         'var(--header-h)',
        padding:        '0 var(--u4)',
        borderBottom:   '1px solid var(--border)',
        background:     'var(--surface)',
        flexShrink:     0,
      }}>
        <span style={{
          fontFamily:    'var(--font-brand)',
          fontWeight:    600,
          fontSize:      16,
          color:         'var(--text)',
          letterSpacing: '-0.01em',
        }}>
          LIV
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u2)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-sec)', fontFamily: 'var(--font-mono)' }}>
            {state.user?.email ?? ''}
          </span>
          <button
            onClick={signOut}
            style={{
              padding:      'var(--u05) var(--u15)',
              background:   'transparent',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color:        'var(--text-sec)',
              fontSize:     12,
              fontFamily:   'var(--font-ui)',
              cursor:       'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Dashboard — owns all build flow UI */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <DashboardUI />
      </div>
    </div>
  )
}
