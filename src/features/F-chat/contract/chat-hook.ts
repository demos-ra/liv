// [F-chat/R3/C2] useChat + useChatStream hooks
// R3: client-side contract

'use client'

import { useState, useCallback, useRef } from 'react'
import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { CHAT_NAMESPACE, ChatMessage, ChatThread } from '../config/chat-config'

// --- useChat: reads thread from chat:: namespace ---

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

// --- useChatStream: manages SSE connection for sending messages ---

type StreamState = {
  streaming: boolean
  error: string | null
}

export function useChatStream(projectId: string) {
  const [state, setState] = useState<StreamState>({ streaming: false, error: null })
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (content: string, modelId: string) => {
      if (state.streaming) return

      abortRef.current = new AbortController()
      setState({ streaming: true, error: null })

      try {
        const res = await fetch(`/api/chat/${projectId}/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, modelId }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          // SSE chunks are handled by F-state-registry subscriber
          // which updates chat:: namespace in real time
          decoder.decode(value) // consume stream
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setState((s) => ({ ...s, error: (err as Error).message }))
        }
      } finally {
        setState((s) => ({ ...s, streaming: false }))
        abortRef.current = null
      }
    },
    [projectId, state.streaming]
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { ...state, send, cancel }
}
