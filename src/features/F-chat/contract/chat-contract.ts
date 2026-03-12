// @liv-standard v1.3
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  SESSION_COOKIE_NAME  F-identity/contract/auth-contract
//   W-ATOM  validateSession      F-identity/contract/auth-contract
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
// wires-out:  none  (route handler — external surface)
// deps:
//   R0  ../config/chat-config
//   R1  ../domain/chat-logic
//   R2  ../app/chat-workflow
// validated:  2026-03-12

import { NextRequest, NextResponse } from 'next/server'
import { sendMessage, getMessages } from '../app/chat-workflow'
import { SESSION_COOKIE_NAME, validateSession } from '@/features/F-identity/contract/auth-contract'
import { CHAT_CONFIG } from '../config/chat-config'
import { validateMessageContent } from '../domain/chat-logic'

// --- POST /api/chat/[projectId]/message ---
// params is already resolved by the route handler before calling here.
// Route boundary owns the await — contract handlers receive plain strings only.

export async function POST_message(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return new Response('Unauthenticated', { status: 401 })
  const session = await validateSession(accessToken)
  if (!session) return new Response('Unauthenticated', { status: 401 })

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
        for await (const chunk of sendMessage({
          projectId,
          content,
          modelId,
          userId: session.userId,
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
// params is already resolved by the route handler before calling here.

export async function GET_messages(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  const session = await validateSession(accessToken)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = params
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? String(CHAT_CONFIG.pageSize))
  const messages = await getMessages(projectId, null, limit).catch(() => [])

  return NextResponse.json({ messages })
}

export { useChat, useChatStream } from './chat-hook'
