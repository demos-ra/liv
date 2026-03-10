// @liv-standard v1.0
// [F-identity/R3]
// Built with LIV · livai.dev

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './auth-hooks'

// ── Shared layout ─────────────────────────────────────────────────────────────

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '10vh',
      fontFamily: 'var(--font-ui)',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 20px' }}>

        {/*
          LIV brand mark — Montserrat 600, 11px, 0.3em tracking, accent, uppercase.
          Intentionally 11px at 16px base — it is a stamp, not body text.
          This is the door. Inside the app the header LIV mark takes over.
        */}
        <div style={{
          fontFamily: 'var(--font-brand)',
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: '0.3em',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          marginBottom: 32,
          userSelect: 'none',
        }}>
          LIV
        </div>

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
      <div style={{ position: 'relative' }}>

        {/* Input container — identical dimensions to chat input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          minHeight: 48,
        }}>
          {!submitted ? (
            <>
              <input
                ref={inputRef}
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
                style={{
                  flex: 1, background: 'transparent',
                  border: 'none', outline: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 400,
                  height: '24px', lineHeight: '24px',
                  color: 'var(--text)', caretColor: 'var(--accent)',
                  opacity: status === 'loading' ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                  minWidth: 0,
                }}
              />

              {/* → always visible, accent when ready */}
              <button
                onClick={handleSubmit}
                disabled={!hasInput || status === 'loading'}
                aria-label="Send sign-in link"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 16,
                  color: hasInput && status !== 'loading' ? 'var(--accent)' : 'var(--text-dis)',
                  background: 'transparent', border: 'none',
                  cursor: hasInput && status !== 'loading' ? 'pointer' : 'default',
                  padding: 0, lineHeight: 1, flexShrink: 0,
                  transition: 'color 0.15s',
                }}
              >
                {status === 'loading' ? (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    letterSpacing: '0.1em', color: 'var(--text-dis)',
                  }}>
                    ···
                  </span>
                ) : '→'}
              </button>
            </>
          ) : (
            /* Sent — container settles, no layout shift */
            <div className="liv-fade-in" style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 12, width: '100%',
            }}>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 400,
                color: 'var(--text-sec)', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {email}
              </span>
              <button
                onClick={handleResend}
                style={{
                  fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400,
                  color: 'var(--text-dis)', background: 'transparent',
                  border: 'none', cursor: 'pointer', padding: 0,
                  flexShrink: 0, transition: 'color 0.15s',
                  textDecoration: 'underline', textDecorationColor: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--text-sec)'
                  e.currentTarget.style.textDecorationColor = 'var(--border)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-dis)'
                  e.currentTarget.style.textDecorationColor = 'transparent'
                }}
              >
                resend
              </button>
            </div>
          )}
        </div>

        {/* Fixed status slot — 24px reserved, no layout shift */}
        <div style={{ height: 24, paddingTop: 8, paddingLeft: 2 }}>
          {status === 'sent' && (
            <span className="liv-fade-in" style={{
              fontFamily: 'var(--font-ui)', fontSize: 12,
              color: 'var(--text-dis)',
            }}>
              check your inbox
            </span>
          )}
          {status === 'error' && errorMsg && (
            <span key={errorMsg} className="liv-fade-in" style={{
              fontFamily: 'var(--font-ui)', fontSize: 12,
              color: 'var(--error)',
            }}>
              {errorMsg}
            </span>
          )}
        </div>

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
        router.replace("/")
      } else {
        setStatus('error')
        setErrorMsg(result.error ?? 'link expired')
      }
    })
  }, [])

  return (
    <AuthShell>
      {/* Container — identical dimensions to login input */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '12px 16px',
        minHeight: 48,
      }}>
        {status === 'verifying' && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-dis)', letterSpacing: '0.1em',
          }}>
            ···
          </span>
        )}
        {status === 'success' && (
          <span className="liv-fade-in" style={{
            fontFamily: 'var(--font-ui)', fontSize: 16,
            color: 'var(--text-sec)',
          }}>
            signing in
          </span>
        )}
        {status === 'error' && (
          <span className="liv-fade-in" style={{
            fontFamily: 'var(--font-ui)', fontSize: 16,
            color: 'var(--text-sec)',
          }}>
            —
          </span>
        )}
      </div>

      {/* Fixed status slot */}
      <div style={{ height: 24, paddingTop: 8, paddingLeft: 2 }}>
        {status === 'error' && errorMsg && (
          <span className="liv-fade-in" style={{
            fontFamily: 'var(--font-ui)', fontSize: 12,
            color: 'var(--error)',
          }}>
            {errorMsg}
          </span>
        )}
      </div>

      {/* Request new link — only on error */}
      {status === 'error' && (
        <button
          className="liv-fade-in"
          onClick={() => router.push('/auth/login')}
          style={{
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 400,
            color: 'var(--text-dis)', background: 'transparent',
            border: 'none', cursor: 'pointer', padding: 0,
            paddingLeft: 2, transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-sec)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dis)')}
        >
          request new link →
        </button>
      )}
    </AuthShell>
  )
}
