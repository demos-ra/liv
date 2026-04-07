// @liv-standard v1.3
// [core/app/auth/error.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    w2-item-13a
// slice:      core/app
// layer:      R4
// wires-in:   none
// wires-out:  none (Next.js error.tsx convention — auto-mounted by framework)
// deps:
//   R5  react
// validated:  pending
//
// w2-item-13a (A1, A7):
//   Auth-specific error boundary. Catches React rendering errors in /auth/* routes.
//   Same constraints as root error.tsx: 'use client', zero external imports,
//   inline fallback styles. Does NOT handle OAuth callback errors — those are
//   already handled by AuthPage reading useSearchParams (deployed in #14).
//   Axiom cite:
//     A1 — core/app owns route-level error boundaries. F-identity does not own
//           app-level error UI.
//     A7 — self-contained. Deletable without affecting any slice.

'use client'

import { useEffect } from 'react'

const FALLBACK = {
  bg:       '#0e0e10',
  text:     'rgba(255,255,255,0.87)',
  textSec:  'rgba(255,255,255,0.55)',
  accent:   '#6fa3f7',
  mono:     "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
} as const

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(JSON.stringify({
      level: 'error',
      event: 'app.auth-error-boundary',
      message: error.message,
      digest: error.digest ?? null,
      timestamp: new Date().toISOString(),
    }))
  }, [error])

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      background:     FALLBACK.bg,
      color:          FALLBACK.text,
      fontFamily:     FALLBACK.mono,
      padding:        '24px',
      gap:            '24px',
    }}>
      <span style={{
        fontSize:      '28px',
        fontWeight:    600,
        letterSpacing: '0.12em',
      }}>
        LIV
      </span>

      <span style={{ fontSize: '14px', color: FALLBACK.text }}>
        Unable to sign in. Please try again.
      </span>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            fontFamily:    FALLBACK.mono,
            fontSize:      '12px',
            letterSpacing: '0.04em',
            color:         FALLBACK.accent,
            background:    'transparent',
            border:        'none',
            cursor:        'pointer',
            padding:       '6px 12px',
          }}
        >
          Try again
        </button>
        <a
          href="/auth/login"
          style={{
            fontFamily:    FALLBACK.mono,
            fontSize:      '12px',
            letterSpacing: '0.04em',
            color:         FALLBACK.textSec,
            textDecoration: 'none',
          }}
        >
          Back to sign in
        </a>
      </div>
    </div>
  )
}
