// [F-chat/contract/chat-ui.tsx]
// R3 — Chat UI component. 'use client'.
// Owns render surface only. Zero fetch logic — delegates to useChatStream hook.

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStream } from './chat-hook'

const PROJECT_ID = 'demo'
const MODEL_ID   = 'deepseek-chat'

type Msg = {
  id:         string
  role:       'user' | 'assistant'
  content:    string
  streaming?: boolean
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  wrap: {
    display: 'flex', flexDirection: 'column' as const,
    height: '100vh', overflow: 'hidden',
    background: 'var(--bg)', color: 'var(--text)',
    fontFamily: 'var(--font-ui)',
  },
  topbar: {
    height: 48, flexShrink: 0,
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px',
  },
  topbarLeft:  { display: 'flex', alignItems: 'center', gap: 14 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 14 },
  wordmark: {
    fontFamily: 'var(--font-serif)', fontStyle: 'italic',
    fontSize: 18, color: 'var(--accent)', fontWeight: 400,
  },
  topbarSep: { width: 1, height: 14, background: 'var(--border)' },
  modeCurrent: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-dis)', letterSpacing: '0.08em',
  },
  alias: {
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--accent-hi)', letterSpacing: '0.08em',
  },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--success)', opacity: 0.7,
  },
  ctxbar: {
    height: 34, flexShrink: 0,
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center',
    padding: '0 24px', gap: 8,
    background: 'var(--surface)',
  },
  ctxArrow: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' },
  ctxTag:   { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sec)' },
  ctxSep:   { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--divider)' },
  ctxDate:  { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dis)' },
  main: {
    flex: 1, overflowY: 'auto' as const,
    padding: '36px 24px',
    display: 'flex', flexDirection: 'column' as const,
  },
  msgGroup: (role: 'user' | 'assistant', tight?: boolean) => ({
    display: 'flex', flexDirection: 'column' as const,
    maxWidth: 640,
    marginBottom: tight ? 5 : 22,
    alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
    alignItems: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  msgBody: (role: 'user' | 'assistant') => ({
    fontSize: 14, lineHeight: 1.65, fontWeight: 400,
    color: role === 'user' ? 'var(--text-sec)' : 'var(--text)',
  }),
  msgMeta:   { display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 },
  msgSender: {
    fontFamily: 'var(--font-mono)', fontSize: 10,
    color: 'var(--text-sec)', letterSpacing: '0.08em',
  },
  cursor: {
    display: 'inline-block', width: 2, height: 13,
    background: 'var(--accent)', verticalAlign: 'middle', marginLeft: 2,
    borderRadius: 1, animation: 'blink 1.1s step-end infinite',
  },
  dateDivider: {
    display: 'flex', alignItems: 'center', gap: 12,
    alignSelf: 'center', marginBottom: 28,
  },
  dateLine:  { height: 1, background: 'var(--border)', width: 72 },
  dateLabel: {
    fontFamily: 'var(--font-mono)', fontSize: 10,
    color: 'var(--text-dis)', letterSpacing: '0.08em',
  },
  inputbar: {
    flexShrink: 0,
    borderTop: '1px solid var(--border)',
    padding: '13px 24px',
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg)',
  },
  inputPrompt: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)' },
} as const

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatUI({ email, signOut }: { email: string; signOut: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput]       = useState('')
  const asstIdRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Chunk handler — reads ref at call time, never stale
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

  // Clear streaming flag on messages when stream ends
  useEffect(() => {
    if (!streaming && asstIdRef.current) {
      setMessages(prev => prev.map(m => m.id === asstIdRef.current ? { ...m, streaming: false } : m))
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

    asstIdRef.current = newAsstId  // set BEFORE send() so chunks see it
    setMessages(prev => [...prev, userMsg, asstMsg])

    // Hook owns the fetch + SSE — UI passes onChunk via closure
    await send(content, MODEL_ID)
  }, [input, streaming, send])

  const today    = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const initials = email.split('@')[0].slice(0, 1).toUpperCase()

  return (
    <div style={s.wrap}>
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <span style={s.wordmark}>Liv</span>
          <div style={s.topbarSep} />
          <span style={s.modeCurrent}>chat</span>
        </div>
        <div style={s.topbarRight}>
          <div style={s.statusDot} />
          <span
            style={{ ...s.alias, cursor: 'pointer' }}
            title={`${email} — click to sign out`}
            onClick={signOut}
          >
            {initials}
          </span>
        </div>
      </div>

      <div style={s.ctxbar}>
        <span style={s.ctxArrow}>↩</span>
        <span style={s.ctxTag}>demo</span>
        <span style={s.ctxSep}>·</span>
        <span style={s.ctxDate}>{today}</span>
      </div>

      <div style={s.main}>
        {messages.length === 0 && (
          <div style={s.dateDivider}>
            <div style={s.dateLine} />
            <span style={s.dateLabel}>{today}</span>
            <div style={s.dateLine} />
          </div>
        )}
        {messages.map((m, i) => {
          const isLast       = i === messages.length - 1
          const nextSameRole = messages[i + 1]?.role === m.role
          return (
            <div key={m.id} style={s.msgGroup(m.role, nextSameRole)}>
              <div style={s.msgBody(m.role)}>
                {m.content}
                {m.streaming && !m.content  && <span style={s.cursor} />}
                {m.streaming && m.content && isLast && <span style={s.cursor} />}
              </div>
              {!nextSameRole && (
                <div style={s.msgMeta}>
                  <span style={s.msgSender}>{m.role === 'user' ? initials : 'Liv'}</span>
                </div>
              )}
            </div>
          )
        })}
        {error && (
          <div style={{ color: 'var(--error)', fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 8 }}>
            stream error: {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputbar}>
        <span style={s.inputPrompt}>▸</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          disabled={streaming}
          placeholder="type anything or /build /recall /search"
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 300,
            color: 'var(--text)', caretColor: 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}
