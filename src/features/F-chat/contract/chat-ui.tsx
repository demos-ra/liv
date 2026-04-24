// @liv-standard v1.5.1
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase2-account-extraction, phase5-focus, w2-item-13b, phase-5.3
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  InputContainer  @/features/F-design-system/contract/primitives
//   W-ATOM  SendIcon        @/features/F-design-system/contract/primitives
//   W-ATOM  Spinner         @/features/F-design-system/contract/primitives
//   W-ATOM  ChatError       ../config/chat-config
//   W-HOOK  useChatStream        ./chat-hook
//   W-HOOK  useViewportKeyboard  ./chat-hook
// wires-out:
//   W-ATOM  ChatUI  → src/app/page.tsx
// deps:
//   R0  ../config/chat-config
//   R3  ./chat-hook
//   R3  @/features/F-design-system/contract/primitives
//   R3  @/features/F-user-profile/config/provider-keys-config
//   R5  react
// validated: pending
//
// phase2-account-extraction (A1):
//   AccountPanel deleted — extracted to F-user-profile/contract/account-page.tsx.
//   Overlay, SlidePanel, Label, ButtonText, StatusDot, Divider imports removed.
//   accountOpen state removed. Theme state lifted to page.tsx.
//   onOpenAccount simplified: () => void (was ref registration pattern).
//   No-API-key flow calls onOpenAccount() to navigate to account page.
//   Provider-keys import retained for hasAnyKey check only.
//
// step5b-phaseF (A1, A3):
//   Intent routing preserved — onSetActiveProgram, resolveIntent unchanged.
//
// phase5-focus (A3):
//   Added optional chatInputRef prop to typed boundary.
//   External ref synced to internal inputRef for composition-root
//   focus management. Internal inputRef usage unchanged.
//
// w2-item-13b (A1, A3):
//   Error rendering updated: ChatError typed atom replaces raw error string.
//   Renders error.message from ChatError (A3 — typed boundary from hook).
//   onStreamError callback wired to useChatStream — on partial stream failure,
//   appends '[Response interrupted. Try sending again.]' inline to assistant
//   message content rather than replacing it. Preserves partial content (A1).
//   Axiom cite: A1 — F-chat owns chat error rendering. A3 — ChatError atom.
//
// phase-5.3 (A1, A3):
//   onJobId callback wired to useChatStream 4th param — on jobId SSE event,
//   calls onSetActiveProgram('builder') to auto-expand dashboard.
//   useViewportKeyboard hook consumed for mobile chat input positioning.
//   send-touch-target className added for CSS-driven touch target enforcement.
//   Axiom cite: A1 — F-chat owns chat UI. A3 — typed imports.

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChatStream, useViewportKeyboard } from './chat-hook'
import { PROVIDER_ORDER } from '@/features/F-user-profile/config/provider-keys-config'
import type { ChatError } from '../config/chat-config'
import {
  InputContainer,
  SendIcon,
  Spinner,
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

// ── Intent routing constants (A3 — owned by F-chat, no cross-slice imports) ───
const INTENT_ADMIN   = '/admin'
const INTENT_MENU    = ['menu', 'switch', '/menu']

function resolveIntent(content: string): { programId: string | null; isCommand: boolean } | null {
  const trimmed = content.trim().toLowerCase()
  if (trimmed === INTENT_ADMIN) return { programId: 'admin', isCommand: true }
  if (INTENT_MENU.includes(trimmed)) return { programId: null, isCommand: true }
  // Any other message → builder intent (not a command, still sends to AI)
  return { programId: 'builder', isCommand: false }
}

// ── ChatUI ────────────────────────────────────────────────────────────────────

export function ChatUI({
  email,
  signOut,
  onOpenAccount,
  onSetActiveProgram,
  chatInputRef,
}: {
  email:               string
  signOut:             () => void
  onOpenAccount:       () => void
  onSetActiveProgram:  (programId: string | null) => void
  chatInputRef?:       React.RefObject<HTMLInputElement | null>
}) {
  const [messages, setMessages]       = useState<Msg[]>([LIV_OPENING])
  const [input, setInput]             = useState('')
  const [hasAnyKey, setHasAnyKey]     = useState<boolean | null>(null)

  const asstIdRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Sync external ref for composition-root focus management (B2)
  useEffect(() => {
    if (chatInputRef && inputRef.current) {
      (chatInputRef as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current
    }
  })

  const userName = email.includes('@') ? email.split('@')[0] : email

  // ── Check API keys on mount ─────────────────────────────────────────────
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

  const handleChunk = useCallback((chunk: string) => {
    const id = asstIdRef.current
    if (!id) return
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, content: m.content + chunk } : m
    ))
  }, [])

  // w2-item-13b: partial stream failure — append inline indicator to existing content
  const handleStreamError = useCallback((indicator: string) => {
    const id = asstIdRef.current
    if (!id) return
    setMessages(prev => prev.map(m =>
      m.id === id ? { ...m, content: m.content + '\n\n' + indicator, streaming: false } : m
    ))
  }, [])

  // phase-5.3: on jobId SSE event, auto-expand dashboard to builder program
  const handleJobId = useCallback((_jobId: string) => {
    onSetActiveProgram('builder')
  }, [onSetActiveProgram])

  const { streaming, error, send } = useChatStream(PROJECT_ID, handleChunk, handleStreamError, handleJobId)

  const keyboardHeight = useViewportKeyboard()

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

    // ── Intent routing (step5b-phaseF) ────────────────────────────────────
    const intent = resolveIntent(content)
    if (intent) {
      onSetActiveProgram(intent.programId)
      if (intent.isCommand) return
    }

    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content }

    if (hasAnyKey === false) {
      setMessages(prev => [...prev, userMsg, { ...LIV_KEY_PROMPT, id: crypto.randomUUID() }])
      onOpenAccount()
      return
    }

    const newAsstId    = crypto.randomUUID()
    const asstMsg: Msg = { id: newAsstId, role: 'assistant', content: '', streaming: true }
    asstIdRef.current  = newAsstId
    setMessages(prev => [...prev, userMsg, asstMsg])
    await send(content, MODEL_ID)
  }, [input, streaming, send, hasAnyKey, onSetActiveProgram, onOpenAccount])

  const isLastInBlock = (i: number) =>
    i === messages.length - 1 || messages[i].role !== messages[i + 1].role

  const gapAfter = (i: number) => {
    if (i === messages.length - 1) return 0
    return messages[i].role !== messages[i + 1].role ? 'var(--u4)' : 'var(--u1)'
  }

  const hasInput = input.trim().length > 0

  return (
    <>
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
                    <Spinner size="sm" />
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
              {error.message}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      <footer
        className="chat-footer"
        style={keyboardHeight > 0 ? { paddingBottom: `${keyboardHeight}px` } : undefined}
      >
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
                  className="send-key send-touch-target"
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
