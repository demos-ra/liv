// @liv-standard v1.3
// [F-identity/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-form-classes, phase5-remediation, w2-oauth-buttons, w2-suspense-fix
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM  Brand           @/features/F-design-system/contract/primitives
//   W-ATOM  InputContainer  @/features/F-design-system/contract/primitives
//   W-ATOM  SendIcon        @/features/F-design-system/contract/primitives
//   W-ATOM  Spinner         @/features/F-design-system/contract/primitives
//   W-HOOK  useAuth         ./auth-hooks
// wires-out:
//   W-ATOM  AuthPage        → core/app (Next.js route consumer)
//   W-ATOM  AuthVerifyPage  → core/app (Next.js route consumer)
// deps:
//   R3  ./auth-hooks
//   R5  react
//   R5  next/navigation
// validated: pending
//
// phase3-form-classes (A3):
//   Added .form className to Brand, InputContainer, and login-status elements
//   on login page. Required for dissolve/form entrance animation participation
//   at the login boundary (Phase 4+ scope).
//
// phase5-remediation (A3):
//   InputContainer: disabled → readOnly in sent/verify display states.
//   Preserves visual identity (no opacity dim, no stop-sign cursor).
//   Loading guards (disabled during API calls) unchanged.
//
// w2-oauth-buttons (A1, A3, A5):
//   Added: OAuth provider buttons (Google, GitHub) below magic link form.
//   Fetches /api/auth/providers on mount to determine which buttons to show.
//   Reads ?error query param for OAuth callback error display.
//   A1: F-identity owns all auth UI. A3: typed fetch response.
//   A5: no direct import from oauth-contract — uses HTTP endpoint.
//
// w2-suspense-fix (A1, A7):
//   useSearchParams() requires Suspense boundary in Next.js App Router.
//   Suspense ownership moved INTO exported components (inner/outer pattern)
//   so every consumer automatically works — no page-level Suspense required.
//   A1: F-identity owns its own Suspense requirement. No consumer coordination.
//   A7: consumers can render AuthPage/AuthVerifyPage without knowing about
//   useSearchParams — deletability of the implementation detail.

'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './auth-hooks'
import {
  Brand,
  InputContainer,
  SendIcon,
  Spinner,
} from '@/features/F-design-system/contract/primitives'

// ── OAuth error messages ──────────────────────────────────────────────────────
// Maps ?error query param values from OAuth callback redirects to user-friendly text.

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_state:      'Sign-in failed. Please try again.',
  oauth_failed:       'Could not complete sign-in with provider. Please try again.',
  email_unavailable:  'Could not retrieve your email. Please try again.',
  email_not_verified: 'Your email is not verified with this provider. Please verify it first.',
  server_error:       'Something went wrong. Please try again.',
}

// ── Provider availability hook ────────────────────────────────────────────────
// Fetches /api/auth/providers on mount. No NEXT_PUBLIC_ env vars needed.

function useOAuthProviders(): { google: boolean; github: boolean; loaded: boolean } {
  const [providers, setProviders] = useState<{ google: boolean; github: boolean; loaded: boolean }>({
    google: false, github: false, loaded: false,
  })

  useEffect(() => {
    fetch('/api/auth/providers')
      .then(res => res.ok ? res.json() : { google: false, github: false })
      .then((data: { google: boolean; github: boolean }) => {
        setProviders({ google: data.google, github: data.github, loaded: true })
      })
      .catch(() => {
        setProviders({ google: false, github: false, loaded: true })
      })
  }, [])

  return providers
}

// ── Shared layout ─────────────────────────────────────────────────────────────

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page login-page">
      <div className="login-content">
        <Brand variant="login" className="form" />
        {children}
      </div>
    </div>
  )
}

// ── Suspense fallback ─────────────────────────────────────────────────────────
// Pre-engine static fallback. Matches layout structure without hooks or engine deps.
// Used by both AuthPage and AuthVerifyPage Suspense wrappers.

function AuthFallback({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(18,17,14,0.25)', /* exception: pre-engine fallback, matches --text-dis light */
      fontFamily: 'system-ui, sans-serif',
    }}>
      {message}
    </div>
  )
}

// ── Login (inner) ─────────────────────────────────────────────────────────────

function AuthPageInner() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus]       = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg]   = useState<string | null>(null)
  const { requestMagicLink, state } = useAuth()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const inputRef     = useRef<HTMLInputElement>(null)
  const providers    = useOAuthProviders()

  // Read ?error query param from OAuth callback redirects
  const oauthError = searchParams.get('error')

  useEffect(() => {
    if (state.status === 'authenticated') router.replace('/')
  }, [state.status, router])

  // Show OAuth error on mount if present, then clear from URL
  useEffect(() => {
    if (oauthError && OAUTH_ERROR_MESSAGES[oauthError]) {
      setStatus('error')
      setErrorMsg(OAUTH_ERROR_MESSAGES[oauthError])
      // Clean URL without triggering navigation
      router.replace('/auth/login', { scroll: false })
    }
  }, [oauthError, router])

  const handleSubmit = async () => {
    if (!email.trim() || status === 'loading' || status === 'sent') return
    setStatus('loading')
    setErrorMsg(null)
    const result = await requestMagicLink(email.trim())
    if (result.success) {
      setStatus('sent')
      setSubmitted(true)
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'something went wrong')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleResend = () => {
    setStatus('idle')
    setSubmitted(false)
    setErrorMsg(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const hasInput = email.trim().length > 0

  return (
    <AuthShell>

      {/* Monoform pill — login input */}
      {!submitted ? (
        <InputContainer
          className="form"
          inputRef={inputRef}
          autoFocus
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          disabled={status === 'loading'}
          autoComplete="email"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Email address"
          placeholder="email"
          icon={
            status === 'loading' ? (
              <Spinner size="sm" />
            ) : (
              <button
                type="button"
                className="send-key"
                onClick={handleSubmit}
                disabled={!hasInput}
                aria-label="Send sign-in link"
              >
                <SendIcon />
              </button>
            )
          }
        />
      ) : (
        /* Sent state — container settles, email shown, resend available */
        <InputContainer
          className="form"
          placeholder=""
          icon={
            <button
              type="button"
              className="btn-resend"
              onClick={handleResend}
            >
              resend
            </button>
          }
          value={email}
          readOnly
        />
      )}

      {/* Fixed status slot — height reserved, no layout shift */}
      <div className="login-status form">
        {status === 'sent' && (
          <span className="login-status-text fade-in">
            check your inbox
          </span>
        )}
        {status === 'error' && errorMsg && (
          <span key={errorMsg} className="text-error fade-in">
            {errorMsg}
          </span>
        )}
      </div>

      {/* OAuth providers — shown only when configured. A1: F-identity owns auth UI. */}
      {providers.loaded && (providers.google || providers.github) && (
        <div className="login-oauth form">
          {providers.google && (
            <button
              type="button"
              className="btn-oauth"
              onClick={() => { window.location.href = '/api/auth/google' }}
            >
              sign in with google
            </button>
          )}
          {providers.github && (
            <button
              type="button"
              className="btn-oauth"
              onClick={() => { window.location.href = '/api/auth/github' }}
            >
              sign in with github
            </button>
          )}
        </div>
      )}

    </AuthShell>
  )
}

// ── Login (exported — self-contained Suspense) ────────────────────────────────

export function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback message="Loading…" />}>
      <AuthPageInner />
    </Suspense>
  )
}

// ── Verify (inner) ────────────────────────────────────────────────────────────

function AuthVerifyPageInner() {
  const [status, setStatus]     = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { verifyMagicLink }     = useAuth()
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const called                  = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    if (!token || !email) {
      setStatus('error')
      setErrorMsg('invalid link')
      return
    }
    verifyMagicLink(token, email).then(result => {
      if (result.success) {
        setStatus('success')
        router.replace('/')
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? 'link expired')
      }
    })
  }, [])

  return (
    <AuthShell>

      {/* State-dependent pill content */}
      {status === 'verifying' && (
        <InputContainer
          className="form"
          placeholder="···"
          readOnly
          icon={<Spinner size="sm" />}
        />
      )}
      {status === 'success' && (
        <InputContainer
          className="form"
          placeholder="signing in"
          readOnly
          icon={<Spinner size="sm" />}
        />
      )}
      {status === 'error' && (
        <InputContainer
          className="form"
          placeholder="—"
          readOnly
        />
      )}

      {/* Fixed status slot */}
      <div className="login-status form">
        {status === 'error' && errorMsg && (
          <span className="text-error fade-in">
            {errorMsg}
          </span>
        )}
      </div>

      {/* Request new link — only on error, delayed appearance */}
      {status === 'error' && (
        <button
          type="button"
          className="btn-resend fade-in"
          onClick={() => router.push('/auth/login')}
        >
          request new link →
        </button>
      )}

    </AuthShell>
  )
}

// ── Verify (exported — self-contained Suspense) ───────────────────────────────

export function AuthVerifyPage() {
  return (
    <Suspense fallback={<AuthFallback message="Signing you in…" />}>
      <AuthVerifyPageInner />
    </Suspense>
  )
}
