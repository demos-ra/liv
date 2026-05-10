// @liv-standard v1.5.1
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    w2-item-13b, phase-5.2, phase-5.3
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  CHAT_NAMESPACE  ../config/chat-config
//   W-ATOM  ChatThread      ../config/chat-config
//   W-ATOM  ChatError       ../config/chat-config
//   W-ATOM  ChatErrorCode   ../config/chat-config
//   W-HOOK  useNamespace    @/features/F-verify/contract/registry-hook
// wires-out:
//   W-HOOK  useChatStream        →  F-chat/R3 (chat-ui.tsx)
//   W-HOOK  useChat              →  F-chat/R3 (chat-ui.tsx)
//   W-HOOK  useViewportKeyboard  →  F-chat/R3 (chat-ui.tsx)
// deps:
//   R0  ../config/chat-config
//   R3  @/features/F-verify/contract/registry-hook
//   R5  react
// validated:  pending
//
// w2-item-13b (A1, A3):
//   Error classification added to useChatStream. Five error codes differentiated
//   by detection path:
//     NETWORK_UNREACHABLE — fetch TypeError
//     RATE_LIMITED — HTTP 429 (LIV rate limiter, pre-stream)
//     API_KEY_MISSING — HTTP 401/403 (AI provider key issue)
//     PROVIDER_UNREACHABLE — any other non-ok HTTP status (pre-stream)
//     STREAM_INTERRUPTED — reader throws mid-stream after chunks received
//   SSE { error: '...' } events from server also classified as PROVIDER_UNREACHABLE.
//   Partial stream failure: chunksReceived flag tracks whether content was delivered.
//   On mid-stream error, onStreamError callback appends inline indicator to message.
//   StreamState.error changed from string | null to ChatError | null (A3).
//   Axiom cite:
//     A1 — F-chat owns all chat error classification.
//     A3 — ChatError typed atom crosses hook/UI boundary.

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useNamespace } from '@/features/F-verify/contract/registry-hook'
import { CHAT_NAMESPACE, ChatThread } from '../config/chat-config'
import type { ChatError, ChatErrorCode } from '../config/chat-config'

const INITIAL_THREAD: ChatThread = {
  projectId: '',
  messages: [],
  hasMore: false,
  oldestCursor: null,
}

export function useChat(projectId: string): {
  thread: ChatThread
  isLoading: boolean
} {
  const thread = useNamespace<ChatThread>(`${CHAT_NAMESPACE}:${projectId}`)
  return {
    thread: thread ?? { ...INITIAL_THREAD, projectId },
    isLoading: thread === undefined,
  }
}

type StreamState = {
  streaming: boolean
  error: ChatError | null
}

// ── Error classification ──────────────────────────────────────────────────────
// Classifies fetch/stream errors into ChatError codes.
// Two paths: HTTP response errors (pre-stream) and stream errors (mid-stream).

function classifyHttpError(status: number, body: string | null): ChatError {
  if (status === 429) {
    return { code: 'RATE_LIMITED', message: 'You\'re sending messages too quickly. Wait a moment.' }
  }
  if (status === 401 || status === 403) {
    // Try to extract provider name from error body
    return { code: 'API_KEY_MISSING', message: 'No API key configured. Add one in Account settings.' }
  }
  return { code: 'PROVIDER_UNREACHABLE', message: 'Couldn\'t reach the AI provider. Try again or switch models.' }
}

function classifyFetchError(err: unknown): ChatError {
  // TypeError is the standard signal for network unreachable
  if (err instanceof TypeError) {
    return { code: 'NETWORK_UNREACHABLE', message: 'Connection lost. Check your internet and try again.' }
  }
  return { code: 'PROVIDER_UNREACHABLE', message: 'Couldn\'t reach the AI provider. Try again or switch models.' }
}

// ── useChatStream ─────────────────────────────────────────────────────────────

export function useChatStream(
  projectId: string,
  onChunk: (chunk: string) => void,
  onStreamError?: (indicator: string) => void,
  onJobId?: (jobId: string) => void,
) {
  const [state, setState] = useState<StreamState>({ streaming: false, error: null })
  const abortRef   = useRef<AbortController | null>(null)
  const onChunkRef = useRef(onChunk)
  const onStreamErrorRef = useRef(onStreamError)
  const onJobIdRef = useRef(onJobId)

  // Keep refs current — never stale inside async send
  useEffect(() => { onChunkRef.current = onChunk }, [onChunk])
  useEffect(() => { onStreamErrorRef.current = onStreamError }, [onStreamError])
  useEffect(() => { onJobIdRef.current = onJobId }, [onJobId])

  const streamingRef = useRef(false)

  const send = useCallback(
    async (content: string, modelId: string) => {
      if (streamingRef.current) return

      streamingRef.current = true
      abortRef.current = new AbortController()
      setState({ streaming: true, error: null })

      let chunksReceived = false

      try {
        let res: Response
        try {
          res = await fetch(`/api/chat/${projectId}/message`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ content, modelId }),
            signal:  abortRef.current.signal,
          })
        } catch (fetchErr) {
          if ((fetchErr as Error).name === 'AbortError') return
          setState(s => ({ ...s, error: classifyFetchError(fetchErr) }))
          return
        }

        // ── Pre-stream HTTP errors ──────────────────────────────────────────
        if (!res.ok) {
          let body: string | null = null
          try { body = await res.text() } catch {}
          setState(s => ({ ...s, error: classifyHttpError(res.status, body) }))
          return
        }

        // ── Stream processing ───────────────────────────────────────────────
        const reader  = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer    = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              try {
                const data = JSON.parse(line.slice(6))
                if (data.chunk) {
                  chunksReceived = true
                  onChunkRef.current(data.chunk)
                }
                // phase-5.2: jobId for dashboard binding (sent before LLM stream)
                if (data.jobId) {
                  onJobIdRef.current?.(data.jobId)
                }
                // SSE error event from server (provider error mid-stream)
                if (data.error) {
                  const serverError: ChatError = {
                    code: 'PROVIDER_UNREACHABLE',
                    message: typeof data.error === 'string'
                      ? data.error
                      : 'Couldn\'t reach the AI provider. Try again or switch models.',
                  }
                  if (chunksReceived) {
                    // Partial content exists — append inline indicator, don't overwrite
                    onStreamErrorRef.current?.('[Response interrupted. Try sending again.]')
                  } else {
                    setState(s => ({ ...s, error: serverError }))
                  }
                }
              } catch {}
            }
          }
        } catch (streamErr) {
          // Reader threw mid-stream
          if ((streamErr as Error).name === 'AbortError') return
          if (chunksReceived) {
            // Partial stream failure — preserve existing content, append indicator
            onStreamErrorRef.current?.('[Response interrupted. Try sending again.]')
          } else {
            setState(s => ({
              ...s,
              error: { code: 'STREAM_INTERRUPTED', message: 'Couldn\'t reach the AI provider. Try again or switch models.' },
            }))
          }
        }
      } finally {
        streamingRef.current = false
        setState(s => ({ ...s, streaming: false }))
        abortRef.current = null
      }
    },
    [projectId]
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { ...state, send, cancel }
}

// ── useViewportKeyboard ──────────────────────────────────────────────────────
// Returns virtual keyboard height in px via visualViewport API.
// CSS cannot detect keyboard — this is the one JS-only responsive concern.
// Returns 0 on desktop or when keyboard is closed.

export function useViewportKeyboard(): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    function onResize() {
      const kh = window.innerHeight - (vv?.height ?? window.innerHeight)
      setKeyboardHeight(Math.max(0, kh))
    }

    vv.addEventListener('resize', onResize, { passive: true })
    return () => vv.removeEventListener('resize', onResize)
  }, [])

  return keyboardHeight
}
