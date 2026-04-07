// @liv-standard v1.3
// [core/app/error.tsx]
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
//   Root error boundary. Catches any unhandled React rendering error in the app.
//   'use client' required by Next.js error.tsx convention.
//   Zero external imports beyond React — must render even if DesignSystemProvider
//   or any other provider has thrown. Inline styles match design system aesthetics
//   (overcast daylight, mono type, minimal).
//   Axiom cite:
//     A1 — core/app owns root-level error UI. No feature slice owns this.
//     A7 — self-contained. Deletable without affecting any slice.

'use client'

import { useEffect } from 'react'

// ── Inline fallback styles ─────────────────────────────────────────────────────
// These duplicate design system values intentionally — this component must render
// when the design system provider has failed. Values match board.ts defaults.

const FALLBACK = {
  bg:       '#0e0e10',
  surface:  '#16161a',
  text:     'rgba(255,255,255,0.87)',
  textSec:  'rgba(255,255,255,0.55)',
  textDis:  'rgba(255,255,255,0.28)',
  accent:   '#6fa3f7',
  mono:     "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
  radius:   '8px',
} as const

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(JSON.stringify({
      level: 'error',
      event: 'app.root-error-boundary',
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
      {/* Brand — matches login variant aesthetics */}
      <span style={{
        fontSize:      '28px',
        fontWeight:    600,
        letterSpacing: '0.12em',
        color:         FALLBACK.text,
      }}>
        LIV
      </span>

      {/* Error message */}
      <div style={{
        textAlign:  'center',
        display:    'flex',
        flexDirection: 'column',
        gap:        '8px',
      }}>
        <span style={{ fontSize: '14px', color: FALLBACK.text }}>
          Something went wrong.
        </span>
        <span style={{ fontSize: '12px', color: FALLBACK.textDis }}>
          The error has been logged.
        </span>
      </div>

      {/* Actions */}
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
            borderRadius:  FALLBACK.radius,
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            fontFamily:    FALLBACK.mono,
            fontSize:      '12px',
            letterSpacing: '0.04em',
            color:         FALLBACK.textSec,
            textDecoration: 'none',
          }}
        >
          Return to chat
        </a>
      </div>
    </div>
  )
}
