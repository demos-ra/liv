// @liv-standard v1.3
// [F-chat/contract/chat-ui.tsx]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b1-layout-restore
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  InputContainer  @/features/F-design-system/contract/primitives
//   W-ATOM  Input           @/features/F-design-system/contract/primitives
//   W-ATOM  SendIcon        @/features/F-design-system/contract/primitives
//   W-ATOM  Overlay         @/features/F-design-system/contract/primitives
//   W-ATOM  SlidePanel      @/features/F-design-system/contract/primitives
//   W-ATOM  Spinner         @/features/F-design-system/contract/primitives
//   W-ATOM  Label           @/features/F-design-system/contract/primitives
//   W-ATOM  ButtonText      @/features/F-design-system/contract/primitives
//   W-ATOM  ProviderId      @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  PROVIDERS       @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  PROVIDER_ORDER  @/features/F-user-profile/config/provider-keys-config
//   W-HOOK  useChatStream   ./chat-hook
// wires-out:
//   W-ATOM  ChatUI          → src/app/page.tsx
// deps:
//   R3  ./chat-hook
//   R3  @/features/F-design-system/contract/primitives
//   R3  @/features/F-user-profile/config/provider-keys-config
//   R5  react
// validated:  pending
//
// step4b1 (A1, A3):
//   Internal <header className="chat-header"> removed — header is now owned
//   by page.tsx (A1: one owner per construct).
//   ChatUI renders messages + footer only. AccountPanel remains fully internal
//   (API keys, display name, theme — chat concerns).
//   onOpenAccount prop pattern: ChatUI accepts onOpenAccount as a prop and calls
//   it on mount to register its internal setAccountOpen(true) with page.tsx.
//   page.tsx stores the registration via useRef and calls it from the header
//   username button. accountOpen state never leaves ChatUI (A1). The typed prop
//   boundary is the registration callback (A3).
//   Axiom cite:
//     A1 — header ownership moved to page.tsx. ChatUI owns messages + panel only.
//     A3 — onOpenAccount is the typed prop boundary; no accountOpen state crosses.

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStream } from './chat-hook'
import { PROVIDER_ORDER, PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'
import {
  InputContainer,
  Input,
  SendIcon,
  Overlay,
  SlidePanel,
  Spinner,
  Label,
  ButtonText,
} from '@/features/F-design-system/contract/primitives'

const PROJECT_ID = 'demo'
const MODEL_ID   = 'deepseek-chat'

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

// ── Account panel ─────────────────────────────────────────────────────────────

function AccountPanel({
  open, email, onClose, onSignOut, theme, onToggleTheme,
}: {
  open: boolean; email: string; onClose: () => void; onSignOut: () => void
  theme: 'dark' | 'light'; onToggleTheme: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  const defaultName = email.includes('@') ? email.split('@')[0] : email
  const [displayName, setDisplayName] = useState(defaultName)
  const [nameSaving, setNameSaving]   = useState(false)

  const [keyInputs, setKeyInputs] = useState<Record<ProviderId, string>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, ''])) as Record<ProviderId, string>
  )
  const [keySet, setKeySet]       = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )
  const [keySaving, setKeySaving] = useState<Record<ProviderId, boolean>>(() =>
    Object.fromEntries(PROVIDER_ORDER.map(p => [p, false])) as Record<ProviderId, boolean>
  )

  useEffect(() => {
    if (!open) return
    PROVIDER_ORDER.forEach(async (provider) => {
      try {
        const res = await fetch('/api/profile')
        if (!res.ok) return
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

  return (
    <>
      <Overlay open={open} onClose={onClose} />
      <SlidePanel open={open} panelRef={panelRef}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u05)', marginBottom: 'var(--u3)' }}>
          <span className="account-name">{defaultName}</span>
          <span className="account-email">{email}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u1)', marginBottom: 'var(--u3)' }}>
          <Label>Display name</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
            <Input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveDisplayName() }}
              placeholder={defaultName}
              disabled={nameSaving}
              style={{ flex: 1 }}
            />
            <ButtonText variant="accent" onClick={saveDisplayName} disabled={nameSaving}>
              {nameSaving ? '···' : 'SAVE'}
            </ButtonText>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u3)' }}>
          {PROVIDER_ORDER.map(provider => (
            <div key={provider} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Label>{`${PROVIDERS[provider].label} API key`}</Label>
                {keySet[provider] && (
                  <ButtonText variant="danger" onClick={() => removeKey(provider)}>REMOVE</ButtonText>
                )}
              </div>
              {keySet[provider] ? (
                <span className="key-dots">••••••••••••••••</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--u1)' }}>
                  <Input
                    type="password"
                    value={keyInputs[provider]}
                    onChange={e => setKeyInputs(prev => ({ ...prev, [provider]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') saveKey(provider) }}
                    placeholder={PROVIDERS[provider].placeholder}
                    disabled={keySaving[provider]}
                    style={{ flex: 1 }}
                  />
                  <ButtonText
                    variant="accent"
                    onClick={() => saveKey(provider)}
                    disabled={keySaving[provider] || !keyInputs[provider].trim()}
                  >
                    {keySaving[provider] ? '···' : 'SAVE'}
                  </ButtonText>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--u3)', paddingTop: 'var(--u4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>{theme === 'dark' ? 'DARK' : 'LIGHT'}</Label>
            <button
              type="button"
              className="toggle-track"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--text-dis)' }}
            >
              <div className="toggle-thumb" style={{ left: theme === 'dark' ? 18 : 2 }} />
            </button>
          </div>
          <ButtonText variant="danger" onClick={onSignOut}>SIGN OUT</ButtonText>
        </div>

      </SlidePanel>
    </>
  )
}

// ── ChatUI — messages + footer only. Header owned by page.tsx (A1). ───────────
//
// onOpenAccount prop: page.tsx passes a registration callback. ChatUI calls it
// on mount with () => setAccountOpen(true). page.tsx stores the registered fn
// in a ref and calls it when the header username button is clicked.
// accountOpen state never leaves ChatUI — A1 preserved. A3: typed boundary
// is the () => void signature of the registration callback.

export function ChatUI({
  email,
  signOut,
  onOpenAccount,
}: {
  email:         string
  signOut:       () => void
  onOpenAccount: (openFn: () => void) => void
}) {
  const [messages, setMessages]       = useState<Msg[]>([LIV_OPENING])
  const [input, setInput]             = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [hasAnyKey, setHasAnyKey]     = useState<boolean | null>(null)

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

  // ── Register open fn with page.tsx on mount ───────────────────────────────
  // Called once. page.tsx stores the fn; header button calls it directly.
  // No state leaves ChatUI — accountOpen is private (A1, A3).
  useEffect(() => {
    onOpenAccount(() => setAccountOpen(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    if (hasAnyKey === false) {
      setMessages(prev => [...prev, userMsg, { ...LIV_KEY_PROMPT, id: crypto.randomUUID() }])
      setAccountOpen(true)
      return
    }

    const newAsstId    = crypto.randomUUID()
    const asstMsg: Msg = { id: newAsstId, role: 'assistant', content: '', streaming: true }
    asstIdRef.current  = newAsstId
    setMessages(prev => [...prev, userMsg, asstMsg])
    await send(content, MODEL_ID)
  }, [input, streaming, send, hasAnyKey])

  const handleClosePanel = useCallback(() => {
    setAccountOpen(false)
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
    return messages[i].role !== messages[i + 1].role ? 'var(--u4)' : 'var(--u1)'
  }

  const hasInput = input.trim().length > 0

  return (
    <>
      <AccountPanel
        open={accountOpen} email={email}
        onClose={handleClosePanel} onSignOut={signOut}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* ── MESSAGES ── */}
      <main className="chat-main">
        <div className="col chat-messages">

          {messages.map((m, i) => (
            <div
              key={m.id}
              className={m.id === 'liv-opening' ? undefined : 'fade-up'}
              style={{ marginBottom: gapAfter(i) }}
            >
              {m.role === 'user' ? (
                <div className="msg-user">
                  <div className="msg-user-bubble">{m.content}</div>
                </div>
              ) : (
                <div className="msg-asst">
                  {m.content}
                  {m.streaming && m.content === '' && (
                    <span className="msg-streaming">···</span>
                  )}
                </div>
              )}

              {isLastInBlock(i) && (
                <div
                  className="msg-label"
                  style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}
                >
                  {m.role === 'assistant' ? 'Liv' : userName}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="text-error fade-in" style={{ marginTop: 'var(--u1)' }}>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="chat-footer">
        <div className="col">
          <InputContainer
            inputRef={inputRef}
            autoFocus
            aria-label="Type a message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
            disabled={streaming}
            placeholder="Message"
            icon={
              streaming ? (
                <Spinner size="sm" />
              ) : (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={handleSend}
                  disabled={!hasInput}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              )
            }
          />
        </div>
      </footer>
    </>
  )
}
