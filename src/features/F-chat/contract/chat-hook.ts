// @liv-standard v1.3
// [F-chat/R3]
// Built with LIV · livai.dev
// [F-chat/R3/C2] useChat + useChatStream hooks
// R3: client-side contract. Owns all stream logic.

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useNamespace } from '@/features/F-la-config/contract/registry-hook'
import { CHAT_NAMESPACE, ChatThread } from '../config/chat-config'

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
  error: string | null
}

export function useChatStream(projectId: string, onChunk: (chunk: string) => void) {
  const [state, setState] = useState<StreamState>({ streaming: false, error: null })
  const abortRef   = useRef<AbortController | null>(null)
  const onChunkRef = useRef(onChunk)

  // Keep ref current — never stale inside async send
  useEffect(() => { onChunkRef.current = onChunk }, [onChunk])

  const streamingRef = useRef(false)

  const send = useCallback(
    async (content: string, modelId: string) => {
      if (streamingRef.current) return

      streamingRef.current = true
      abortRef.current = new AbortController()
      setState({ streaming: true, error: null })

      try {
        const res = await fetch(`/api/chat/${projectId}/message`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ content, modelId }),
          signal:  abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader  = res.body!.getReader()
        const decoder = new TextDecoder()
        let buffer    = ''

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
              if (data.chunk) onChunkRef.current(data.chunk)
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setState(s => ({ ...s, error: (err as Error).message }))
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
