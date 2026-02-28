// [F-chat/R3/C2] Chat contract — API routes
// R3: thin wire. All logic in domain. All config in R0. All I/O in R4.

import { NextRequest, NextResponse } from 'next/server'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { validateSession } from '@/features/F-identity/contract/auth-contract'
import { CHAT_CONFIG, DEMO_MODE, DEMO_SESSION } from '../config/chat-config'
import {
  buildUserMessage,
  buildAssistantMessage,
  completeAssistantMessage,
  validateMessageContent,
  buildMessageContext,
} from '../domain/chat-logic'
import { persistMessage, updateMessage, getMessages } from '../exec/chat-db'
import { lmWriteEvent, lmRecall, lmRemember } from '../exec/lm-io'

// --- POST /api/chat/[projectId]/message ---

export async function POST_message(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {

  let session = DEMO_MODE ? DEMO_SESSION : null

  if (!DEMO_MODE) {
    const accessToken = req.cookies.get(SESSION_CONFIG.cookieName)?.value
    if (!accessToken) return new Response('Unauthenticated', { status: 401 })
    session = await validateSession(accessToken)
    if (!session) return new Response('Unauthenticated', { status: 401 })
  }

  const { projectId } = params
  const body = await req.json()
  const { content, modelId } = body
  if (!content || !modelId) return new Response('Missing params', { status: 400 })

  const validation = validateMessageContent(content)
  if (!validation.valid) return new Response(validation.error, { status: 400 })

  const sessionId = session!.sessionId
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        const userMsg = buildUserMessage(projectId, sessionId, session!.userId, content)
        await persistMessage(userMsg).catch((e) => console.error('[chat] persistMessage user failed', e))

        const assistantMsg = buildAssistantMessage(projectId, sessionId, session!.userId, modelId, userMsg.messageId)
        await persistMessage(assistantMsg).catch((e) => console.error('[chat] persistMessage assistant failed', e))

        // ── F-memory: write incoming event, recall context ──────────────────
        await lmWriteEvent(content, 'episodic', sessionId)
        const memoryContext = await lmRecall(content, content.startsWith('/recall'))
        // ───────────────────────────────────────────────────────────────────

        const history = DEMO_MODE
          ? []
          : (await getMessages(projectId, null, CHAT_CONFIG.pageSize).catch(() => ({ messages: [] }))).messages

        // Memory context injected into system prompt via buildMessageContext
        const messages = buildMessageContext(content, history, memoryContext || undefined)

        let fullContent = ''
        let tokenCount = 0

        for await (const chunk of streamAIResponse(messages, modelId)) {
          if (chunk.content) {
            fullContent += chunk.content
            send({ chunk: chunk.content })
          }
          if (chunk.totalTokens) tokenCount = chunk.totalTokens
        }

        await updateMessage(completeAssistantMessage(assistantMsg, fullContent, tokenCount))
          .catch((e) => console.error('[chat] updateMessage failed', e))

        // ── F-memory: write assistant response ──────────────────────────────
        await lmRemember('chat', 'liv', 'said', fullContent.slice(0, 200), sessionId)
        // ───────────────────────────────────────────────────────────────────

        send({ done: true })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown_error'
        console.error('[chat] stream error', message)
        send({ error: message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// --- GET /api/chat/[projectId]/messages ---

export async function GET_messages(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  if (!DEMO_MODE) {
    const accessToken = req.cookies.get(SESSION_CONFIG.cookieName)?.value
    if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    const session = await validateSession(accessToken)
    if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const { projectId } = params
  const cursor = req.nextUrl.searchParams.get('cursor') ?? null
  const thread = await getMessages(projectId, cursor, CHAT_CONFIG.pageSize)
    .catch(() => ({ messages: [], hasMore: false, nextCursor: null }))

  return NextResponse.json(thread)
}

export { useChat, useChatStream } from './chat-hook'
