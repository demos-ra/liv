// @liv-standard v1.0
// [F-identity/R3]
// Built with LIV · livai.dev

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from './auth-hooks'

const AUTH_CSS = `
  @font-face {
    font-family: 'Geist';
    src: url('/fonts/geist-regular.otf') format('opentype');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Geist';
    src: url('/fonts/geist-medium.otf') format('opentype');
    font-weight: 500; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Montserrat';
    src: url('/fonts/montserrat-semibold.ttf') format('truetype');
    font-weight: 600; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'CommitMono';
    src: url('/fonts/commitmono-regular.otf') format('opentype');
    font-weight: 400; font-style: normal; font-display: swap;
  }

  :root {
    --bg:        #151517;
    --surface:   #1F1F22;
    --border:    #3C3C42;
    --text:      #E5E5E3;
    --text-sec:  #81818A;
    --text-dis:  #6A6A73;
    --accent:    #8EA4FF;
    --error:     #F2766D;
    --font-ui:   'Geist', system-ui, sans-serif;
    --font-mono: 'CommitMono', monospace;
    --font-brand:'Montserrat', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: var(--bg); color: var(--text); }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .fade-in  { animation: fadeIn 0.2s ease forwards; }
  .error-in { opacity: 0; animation: fadeIn 0.15s ease forwards; }
`

function StyleInjector() {
  useEffect(() => {
    const id = 'liv-auth-styles'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = AUTH_CSS
    document.head.appendChild(el)
  }, [])
  return null
}

export function AuthPage() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { requestMagicLink, state } = useAuth()
  const router   = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.status === 'authenticated') router.replace('/')
  }, [state.status, router])

  const handleSubmit = async () => {
    if (!email.trim() || isLoading || submitted) return
    setIsLoading(true)
    setError(null)
    const result = await requestMagicLink(email.trim())
    setIsLoading(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'something went wrong')
      inputRef.current?.focus()
    }
  }

  const handleResend = async () => {
    setSubmitted(false)
    setError(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <>
      <StyleInjector />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10vh',
        fontFamily: 'var(--font-ui)',
        background: 'var(--bg)',
      }}>
        <div style={{ width: '100%', maxWidth: 360, padding: '0 20px' }}>

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

          <div style={{
            background: 'var(--surface)',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 8,
          }}>
            {!submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  ref={inputRef}
                  autoFocus
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null) }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                  disabled={isLoading}
                  autoComplete="email"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    fontWeight: 400,
                    color: 'var(--text)',
                    caretColor: 'var(--accent)',
                    opacity: isLoading ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                  }}
                />
                {email.trim() && !isLoading && (
                  <button
                    onClick={handleSubmit}
                    className="fade-in"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      color: 'var(--text-dis)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                      flexShrink: 0,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dis)')}
                  >
                    →
                  </button>
                )}
                {isLoading && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-dis)',
                    flexShrink: 0,
                    letterSpacing: '0.1em',
                  }}>
                    ···
                  </span>
                )}
              </div>
            ) : (
              <div className="fade-in" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                minHeight: 24,
              }}>
                <span style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'var(--text-sec)',
                }}>
                  {email}
                </span>
                <button
                  onClick={handleResend}
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    color: 'var(--text-dis)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'color 0.15s',
                    textDecoration: 'underline',
                    textDecorationColor: 'transparent',
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

          {submitted && !error && (
            <div className="fade-in" style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              color: 'var(--text-dis)',
              paddingLeft: 2,
            }}>
              check your inbox
            </div>
          )}

          {error && (
            <div key={error} className="error-in" style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              color: 'var(--error)',
              paddingLeft: 2,
            }}>
              {error}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export function AuthVerifyPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError]   = useState<string | null>(null)
  const { verifyMagicLink } = useAuth()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const called       = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    if (!token || !email) {
      setStatus('error')
      setError('invalid link')
      return
    }
    verifyMagicLink(token, email).then(result => {
      if (result.success) {
        setStatus('success')
        window.location.href = '/'
      } else {
        setStatus('error')
        setError(result.error ?? 'link expired')
      }
    })
  }, [])

  return (
    <>
      <StyleInjector />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10vh',
        fontFamily: 'var(--font-ui)',
        background: 'var(--bg)',
      }}>
        <div style={{ width: '100%', maxWidth: 360, padding: '0 20px' }}>

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

          <div style={{
            background: 'var(--surface)',
            borderRadius: 6,
            padding: '10px 14px',
            marginBottom: 8,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
          }}>
            {status === 'verifying' && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dis)', letterSpacing: '0.1em' }}>
                ···
              </span>
            )}
            {status === 'success' && (
              <span className="fade-in" style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-sec)' }}>
                signing in
              </span>
            )}
            {status === 'error' && (
              <span className="fade-in" style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-sec)' }}>
                —
              </span>
            )}
          </div>

          {status === 'error' && (
            <div className="fade-in">
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--error)', marginBottom: 10, paddingLeft: 2 }}>
                {error}
              </div>
              <button
                onClick={() => router.push('/auth/login')}
                style={{
                  fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-dis)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: 0, paddingLeft: 2, transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-sec)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dis)')}
              >
                request new link →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
