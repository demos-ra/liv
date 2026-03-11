// @liv-standard v1.0
// [F-chat/contract/chat-ui.tsx]
// Built with LIV · livai.dev
// R3: UI contract. Depends R0 + R1 + R2 contracts only. No direct exec imports.
// Phase 6 changes:
//   - AccountPanel: display name field + per-provider API key fields (from PROVIDER_ORDER)
//   - Onboarding: on first send, if no keys set, Liv responds with key prompt instead of calling AI
//   - Key save/delete wired to /api/profile/api-key endpoint
//   - Display name save wired to PATCH /api/profile

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStream } from './chat-hook'
import { PROVIDER_ORDER, PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'

const PROJECT_ID = 'demo'
const MODEL_ID   = 'deepseek-chat'

// Liv's opening message — renders on mount, no streaming
const LIV_OPENING: Msg = {
  id:      'liv-opening',
  role:    'assistant',
  content: 'What are we working on?',
}

const LIV_KEY_PROMPT: Msg = {
  id:      'liv-key-prompt',
  role:    'assistant',
  content: `To get started, paste your API key in account settings — click your name in the top right.\n\nYou can add an Anthropic or DeepSeek key (or both). Once saved, just send your message again.`,
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

// ── Section label — reused in account panel ───────────────────────────────────

function PanelLabel({ children }: { children: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10,
      color: 'var(--text-dis)', letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}>
      {children}
    </span>
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

  // ── Display name state ─────────────────────────────────────────────────────
  const defaultName = email.includes('@') ? email.split('@')[0] : email
  const [displayName, setDisplayName] = useState(defaultName)
  const [nameSaving, setNameSaving]   = useState(false)

  // ── API key state (one entry per provider) ────────────────────────────────
  const [keyInputs, setKeyInputs]   = useState<Record<ProviderId, string>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, ''])) as Record<ProviderId, string>
  )
  const [keySet, setKeySet]         = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )
  const [keySaving, setKeySaving]   = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )

  // Check which keys are already set on open
  useEffect(() => {
    if (!open) return
    PROVIDER_ORDER.forEach(async (provider) => {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) return
        // hasApiKey check via profile endpoint — we check key presence from a lightweight endpoint
        const check = await fetch(`/api/profile/api-key?provider=${provider}`, { method: 'GET' })
        if (check.ok) {
          const data = await check.json()
          setKeySet(prev => ({ ...prev, [provider]: data.hasKey ?? false }))
        }
      } catch {}
    })
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  // ── Save display name ──────────────────────────────────────────────────────
  const saveDisplayName = async () => {
    if (!displayName.trim()) return
    setNameSaving(true)
    try {
      await fetch('/api/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ displayName: displayName.trim() }),
      })
    } catch {} finally {
      setNameSaving(false)
    }
  }

  // ── Save API key ───────────────────────────────────────────────────────────
  const saveKey = async (provider: ProviderId) => {
    const key = keyInputs[provider].trim()
    if (!key) return
    setKeySaving(prev => ({ ...prev, [provider]: true }))
    try {
      const res = await fetch('/api/profile/api-key', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider, key }),
      })
      if (res.ok) {
        setKeySet(prev => ({ ...prev, [provider]: true }))
        setKeyInputs(prev => ({ ...prev, [provider]: '' }))
      }
    } catch {} finally {
      setKeySaving(prev => ({ ...prev, [provider]: false }))
    }
  }

  // ── Remove API key ─────────────────────────────────────────────────────────
  const removeKey = async (provider: ProviderId) => {
    try {
      await fetch('/api/profile/api-key', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ provider }),
      })
      setKeySet(prev => ({ ...prev, [provider]: false }))
    } catch {}
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 6, padding: '7px 10px',
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'var(--text)', outline: 'none',
  }

  const btnStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em',
    background: 'transparent', border: 'none',
    cursor: 'pointer', padding: 0,
  }

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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto' }}>

          {/* ── Identity ── */}
          <div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500,
              color: 'var(--text)', marginBottom: 2,
            }}>
              {defaultName}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--text-dis)', wordBreak: 'break-all',
            }}>
              {email}
            </div>
          </div>

          {/* ── Display name ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PanelLabel>Display name</PanelLabel>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveDisplayName() }}
                placeholder={defaultName}
                aria-label="Display name"
              />
              <button
                style={{ ...btnStyle, color: nameSaving ? 'var(--text-dis)' : 'var(--accent)' }}
                onClick={saveDisplayName}
                disabled={nameSaving}
              >
                {nameSaving ? '···' : 'SAVE'}
              </button>
            </div>
          </div>

          {/* ── Theme ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PanelLabel>{theme === 'dark' ? 'DARK' : 'LIGHT'}</PanelLabel>
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

          {/* ── API keys — one section per provider ── */}
          {PROVIDER_ORDER.map(provider => (
            <div key={provider} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <PanelLabel>{`${PROVIDERS[provider].label} API key`}</PanelLabel>
                {keySet[provider] && (
                  <button
                    style={{ ...btnStyle, color: 'var(--error)', fontSize: 9 }}
                    onClick={() => removeKey(provider)}
                  >
                    REMOVE
                  </button>
                )}
              </div>

              {keySet[provider] ? (
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--text-dis)', letterSpacing: '0.05em',
                }}>
                  ••••••••••••••••
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    type="password"
                    value={keyInputs[provider]}
                    onChange={e => setKeyInputs(prev => ({ ...prev, [provider]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') saveKey(provider) }}
                    placeholder={PROVIDERS[provider].placeholder}
                    aria-label={`${PROVIDERS[provider].label} API key`}
                  />
                  <button
                    style={{ ...btnStyle, color: keySaving[provider] ? 'var(--text-dis)' : 'var(--accent)' }}
                    onClick={() => saveKey(provider)}
                    disabled={keySaving[provider] || !keyInputs[provider].trim()}
                  >
                    {keySaving[provider] ? '···' : 'SAVE'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onSignOut}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em',
            color: 'var(--error)', background: 'transparent', border: 'none',
            cursor: 'pointer', padding: 0, textAlign: 'left', marginTop: 8,
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

// ── Name label ────────────────────────────────────────────────────────────────

function MsgLabel({ label, align }: { label: string; align: 'left' | 'right' }) {
  return (
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 12, fontWeight: 500, letterSpacing: '0.05em',
      color: 'var(--text-dis)', marginTop: 8,
      textAlign: align, userSelect: 'none',
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
  const [dashOpen, setDashOpen]       = useState(false)
  const [hasAnyKey, setHasAnyKey]     = useState<boolean | null>(null) // null = unchecked

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  const asstIdRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const userName = email.includes('@') ? email.split('@')[0] : email

  // Check if user has at least one key on mount
  useEffect(() => {
    let mounted = true
    async function checkKeys() {
      try {
        const checks = await Promise.all(
          PROVIDER_ORDER.map(p =>
            fetch(`/api/profile/api-key?provider=${p}`)
              .then(r => r.ok ? r.json() : { hasKey: false })
              .then(d => d.hasKey === true)
              .catch(() => false)
          )
        )
        if (mounted) setHasAnyKey(checks.some(Boolean))
      } catch {
        if (mounted) setHasAnyKey(false)
      }
    }
    checkKeys()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.background = 'var(--bg)'
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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

    // Onboarding gate: if key status unknown or no keys, show Liv prompt instead
    if (hasAnyKey === false) {
      setMessages(prev => [...prev, userMsg, { ...LIV_KEY_PROMPT, id: crypto.randomUUID() }])
      setAccountOpen(true) // open panel so they can paste key immediately
      return
    }

    const newAsstId    = crypto.randomUUID()
    const asstMsg: Msg = { id: newAsstId, role: 'assistant', content: '', streaming: true }
    asstIdRef.current  = newAsstId
    setMessages(prev => [...prev, userMsg, asstMsg])
    await send(content, MODEL_ID)
  }, [input, streaming, send, hasAnyKey])

  // After account panel closes, re-check key status
  const handleClosePanel = useCallback(() => {
    setAccountOpen(false)
    // Re-check in case user just saved a key
    Promise.all(
      PROVIDER_ORDER.map(p =>
        fetch(`/api/profile/api-key?provider=${p}`)
          .then(r => r.ok ? r.json() : { hasKey: false })
          .then(d => d.hasKey === true)
          .catch(() => false)
      )
    ).then(checks => setHasAnyKey(checks.some(Boolean))).catch(() => {})
  }, [])

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
        onClose={handleClosePanel} onSignOut={signOut}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh',
        background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-ui)',
      }}>

        {/* ── HEADER ── */}
        <header style={{ height: 'var(--header-h)', flexShrink: 0 }}>
          <Col style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <span style={{
              fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: 11,
              letterSpacing: '0.3em', color: 'var(--accent)',
              textTransform: 'uppercase', userSelect: 'none',
            }}>
              LIV
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => setAccountOpen(true)}
                aria-label="Open account settings"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: 'var(--text-sec)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0, letterSpacing: '0.04em',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-sec)')}
              >
                {userName}
              </button>

              <button
                onClick={() => setDashOpen(o => !o)}
                aria-label="Toggle dashboard"
                aria-pressed={dashOpen}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 14,
                  color: dashOpen ? 'var(--accent)' : 'var(--text-dis)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: 0, paddingLeft: 4,
                  lineHeight: 1, transition: 'color 0.15s',
                }}
              >
                ▤
              </button>
            </div>
          </Col>
        </header>

        {/* ── DASHBOARD ── */}
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
                      background: 'var(--surface)', borderRadius: 'var(--radius)',
                      padding: '12px 16px', maxWidth: '75%',
                      fontSize: 16, lineHeight: 1.45,
                      color: 'var(--text)', fontWeight: 400, wordBreak: 'break-word',
                    }}>
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    fontSize: 16, lineHeight: 1.45,
                    color: 'var(--text)', fontWeight: 400,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {m.content}
                    {m.streaming && m.content === '' && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 12,
                        color: 'var(--text-dis)', letterSpacing: '0.1em',
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
        <footer style={{ flexShrink: 0, padding: '16px 0 24px', background: 'var(--bg)' }}>
          <Col>
            <div
              role="group"
              aria-label="Message input"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'var(--surface)', borderRadius: 'var(--radius)',
                padding: '12px 16px', minHeight: 48,
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
                  padding: 0, lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
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
