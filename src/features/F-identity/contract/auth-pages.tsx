// @liv-standard v1.3
// [F-identity/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-form-classes
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

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './auth-hooks'
import {
  Brand,
  InputContainer,
  SendIcon,
  Spinner,
} from '@/features/F-design-system/contract/primitives'

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

// ── Login ─────────────────────────────────────────────────────────────────────

export function AuthPage() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus]       = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg]   = useState<string | null>(null)
  const { requestMagicLink, state } = useAuth()
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.status === 'authenticated') router.replace('/')
  }, [state.status, router])

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

    </AuthShell>
  )
}

// ── Verify ────────────────────────────────────────────────────────────────────

export function AuthVerifyPage() {
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
