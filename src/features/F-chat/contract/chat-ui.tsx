// @liv-standard v1.0
// [F-chat/R3]
// Built with LIV · livai.dev

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStream } from './chat-hook'

const PROJECT_ID = 'demo'
const MODEL_ID   = 'deepseek-chat'

// Liv's opening message — renders on mount, no streaming
const LIV_OPENING: Msg = {
  id:   'liv-opening',
  role: 'assistant',
  content: 'What are we working on?',
}

type Msg = {
  id:         string
  role:       'user' | 'assistant'
  content:    string
  streaming?: boolean
}

// ── Dashboard — 7 vitals ──────────────────────────────────────────────────────

const VITALS = [
  { glyph: '◆', label: 'entropy'    },
  { glyph: '○', label: 'activation' },
  { glyph: '◈', label: 'degree'     },
  { glyph: '◉', label: 'p95'        },
  { glyph: '□', label: 'saturation' },
  { glyph: '▲', label: 'identity'   },
  { glyph: '◌', label: 'utility'    },
]

function Dashboard() {
  return (
    <div style={{
      background: 'var(--elevated)',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {VITALS.map((v, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            animation: `pulse 3s ease-in-out ${i * 0.3}s infinite`,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 13,
              color: 'var(--accent)', lineHeight: 1, userSelect: 'none',
            }}>
              {v.glyph}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-dis)', letterSpacing: '0.06em', userSelect: 'none',
            }}>
              {v.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Account panel ─────────────────────────────────────────────────────────────

function AccountPanel({
  open, email, onClose, onSignOut, theme, onToggleTheme,
}: {
  open: boolean; email: string; onClose: () => void; onSignOut: () => void
  theme: 'dark' | 'light'; onToggleTheme: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <>
      <div
        className={`liv-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`liv-account-panel ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Account settings"
        tabIndex={-1}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 500,
              color: 'var(--text)', marginBottom: 4,
            }}>
              {email === 'demo' ? 'demo' : email.split('@')[0]}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--text-dis)', wordBreak: 'break-all',
            }}>
              {email}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-sec)', letterSpacing: '0.1em',
            }}>
              {theme === 'dark' ? 'DARK' : 'LIGHT'}
            </span>
            <button
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width: 32, height: 16,
                background: theme === 'dark' ? 'var(--accent)' : 'var(--border)',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                position: 'relative', transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: theme === 'dark' ? 18 : 2,
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--bg)', transition: 'left 0.15s',
              }} />
            </button>
          </div>
        </div>

        <button
          onClick={onSignOut}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
            color: 'var(--error)', background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 0, textAlign: 'left',
          }}
        >
          SIGN OUT
        </button>
      </div>
    </>
  )
}

// ── Centered column ───────────────────────────────────────────────────────────

function Col({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      maxWidth: 'var(--col)', width: '100%',
      margin: '0 auto', padding: '0 var(--col-pad)',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Name label — below last message of each consecutive block ─────────────────

function MsgLabel({ label, align }: { label: string; align: 'left' | 'right' }) {
  return (
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.05em',
      color: 'var(--text-dis)',
      marginTop: 8,
      textAlign: align,
      userSelect: 'none',
    }}>
      {label}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function ChatUI({ email, signOut }: { email: string; signOut: () => void }) {
  const [messages, setMessages]       = useState<Msg[]>([LIV_OPENING])
  const [input, setInput]             = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [theme, setTheme]             = useState<'dark' | 'light'>('dark')
  const [dashOpen, setDashOpen]       = useState(false)

  const asstIdRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const userName = email === 'demo' ? 'demo' : email.split('@')[0]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.background = 'var(--bg)'
  }, [theme])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && accountOpen) setAccountOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [accountOpen])

  const handleChunk = useCallback((chunk: string) => {
    const id = asstIdRef.current
    if (!id) return
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, content: m.content + chunk } : m
    ))
  }, [])

  const { streaming, error, send } = useChatStream(PROJECT_ID, handleChunk)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!streaming && asstIdRef.current) {
      setMessages(prev => prev.map(m =>
        m.id === asstIdRef.current ? { ...m, streaming: false } : m
      ))
      asstIdRef.current = null
      inputRef.current?.focus()
    }
  }, [streaming])

  const handleSend = useCallback(async () => {
    const content = input.trim()
    if (!content || streaming) return
    setInput('')
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content }
    const newAsstId    = crypto.randomUUID()
    const asstMsg: Msg = { id: newAsstId, role: 'assistant', content: '', streaming: true }
    asstIdRef.current  = newAsstId
    setMessages(prev => [...prev, userMsg, asstMsg])
    await send(content, MODEL_ID)
  }, [input, streaming, send])

  const isLastInBlock = (i: number) =>
    i === messages.length - 1 || messages[i].role !== messages[i + 1].role

  const gapAfter = (i: number) => {
    if (i === messages.length - 1) return 0
    return messages[i].role !== messages[i + 1].role ? 32 : 8
  }

  const hasInput = input.trim().length > 0

  return (
    <>
      <AccountPanel
        open={accountOpen} email={email}
        onClose={() => setAccountOpen(false)} onSignOut={signOut}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh',
        background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-ui)',
      }}>

        {/* ── HEADER ── 48px, column-aligned, no border */}
        <header style={{ height: 'var(--header-h)', flexShrink: 0 }}>
          <Col style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

            {/* Left — LIV brand mark */}
            <span style={{
              fontFamily: 'var(--font-brand)',
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.3em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}>
              LIV
            </span>

            {/* Right — username then ▤ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => setAccountOpen(true)}
                aria-label="Open account settings"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-sec)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0,
                  letterSpacing: '0.04em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-sec)')}
              >
                {userName}
              </button>

              {/* ▤ — paddingLeft 4px optical correction for glyph right-bias */}
              <button
                onClick={() => setDashOpen(o => !o)}
                aria-label="Toggle dashboard"
                aria-pressed={dashOpen}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  color: dashOpen ? 'var(--accent)' : 'var(--text-dis)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0,
                  paddingLeft: 4,             // optical correction — glyph sits right-biased
                  lineHeight: 1,
                  transition: 'color 0.15s',
                }}
              >
                ▤
              </button>
            </div>
          </Col>
        </header>

        {/* ── DASHBOARD ── elevated rounded rect, no border lines */}
        {dashOpen && (
          <div style={{ flexShrink: 0, padding: '0 0 16px' }}>
            <Col><Dashboard /></Col>
          </div>
        )}

        {/* ── CHAT ── */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Col style={{ paddingTop: 32, paddingBottom: 16 }}>

            {messages.map((m, i) => (
              <div
                key={m.id}
                className={m.id === 'liv-opening' ? undefined : 'liv-fade-up'}
                style={{ marginBottom: gapAfter(i) }}
              >
                {m.role === 'user' ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius)',
                      padding: '12px 16px',
                      maxWidth: '75%',
                      fontSize: 16,
                      lineHeight: 1.45,
                      color: 'var(--text)',
                      fontWeight: 400,
                      wordBreak: 'break-word',
                    }}>
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    fontSize: 16,
                    lineHeight: 1.45,
                    color: 'var(--text)',
                    fontWeight: 400,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {m.content}
                    {m.streaming && m.content === '' && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-dis)',
                        letterSpacing: '0.1em',
                      }}>
                        ···
                      </span>
                    )}
                  </div>
                )}

                {isLastInBlock(i) && (
                  <MsgLabel
                    label={m.role === 'assistant' ? 'Liv' : userName}
                    align={m.role === 'user' ? 'right' : 'left'}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="liv-fade-in" style={{
                fontFamily: 'var(--font-ui)', fontSize: 12,
                color: 'var(--error)', marginTop: 8,
              }}>
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </Col>
        </main>

        {/* ── INPUT ── */}
        <footer style={{
          flexShrink: 0,
          padding: '16px 0 24px',
          background: 'var(--bg)',
        }}>
          <Col>
            <div
              role="group"
              aria-label="Message input"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                minHeight: 48,
              }}
            >
              <input
                ref={inputRef}
                autoFocus
                aria-label="Type a message"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                }}
                disabled={streaming}
                style={{
                  flex: 1, background: 'transparent',
                  border: 'none', outline: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 400,
                  height: '24px', lineHeight: '24px',
                  color: 'var(--text)', caretColor: 'var(--accent)',
                  opacity: streaming ? 0.4 : 1, transition: 'opacity 0.2s',
                  minWidth: 0,
                }}
              />

              <button
                onClick={handleSend}
                disabled={streaming || !hasInput}
                aria-label="Send message"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 16,
                  color: hasInput && !streaming ? 'var(--accent)' : 'var(--text-dis)',
                  background: 'transparent', border: 'none',
                  cursor: hasInput && !streaming ? 'pointer' : 'default',
                  padding: 0, lineHeight: 1, flexShrink: 0,
                  transition: 'color 0.15s',
                }}
              >
                ↑
              </button>
            </div>
          </Col>
        </footer>

      </div>
    </>
  )
}
