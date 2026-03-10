// [F-chat/contract/chat-contract.ts]
// R3 — HTTP contract for chat. Thin wire only.
// R3 rule: never imports exec/. Delegates all logic to R2 chat-workflow.

import { NextRequest, NextResponse } from 'next/server'
import { sendMessage, getMessages } from '../app/chat-workflow'
import { SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { validateSession } from '@/features/F-identity/contract/auth-contract'
import { CHAT_CONFIG, DEMO_MODE, DEMO_SESSION } from '../config/chat-config'
import { validateMessageContent } from '../domain/chat-logic'

// --- POST /api/chat/[projectId]/message ---

export async function POST_message(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {

  let session: { sessionId: string; userId: string } | null = DEMO_MODE ? DEMO_SESSION : null

  if (!DEMO_MODE) {
    const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
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

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      try {
        // R3 calls R2 — all DB, memory, and AI logic lives in sendMessage()
        for await (const chunk of sendMessage({
          projectId,
          content,
          modelId,
          userId: session!.userId,
        })) {
          send({ chunk })
        }
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
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection:      'keep-alive',
    },
  })
}

// --- GET /api/chat/[projectId]/messages ---

export async function GET_messages(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  if (!DEMO_MODE) {
    const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    const session = await validateSession(accessToken)
    if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const { projectId } = params
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? String(CHAT_CONFIG.pageSize))
  const messages = await getMessages(projectId, null, limit).catch(() => [])

  return NextResponse.json({ messages })
}

export { useChat, useChatStream } from './chat-hook'
