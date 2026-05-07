// @liv-standard v1.5.1
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-3a (F-codec dissolved; codec pipeline removed)
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-FN    getPerimeterSession  F-identity/contract/perimeter-consultation
//   W-ATOM  MODELS               F-ai-adapter/config/ai-adapter-config
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
//   W-ATOM  CHAT_RATE_LIMIT      ../config/chat-config
//   W-HOOK  isPipelineActive     F-planner/contract/planner-contract  (R3→R3, read-only query)
// wires-out:  none  (route handler — external surface)
// deps:
//   R0  ../config/chat-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R1  ../domain/chat-logic
//   R1  @/core/domain/rate-limiter
//   R2  ../app/chat-workflow
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R3  @/features/F-planner/contract/planner-contract
//   R5  next/server
// validated:  pending
//
// sprint-8-shot-3a (F-codec dissolved):
//   Removed:
//     - processMessage from F-codec/R3 (codec pipeline: encode→route→decode)
//     - BuildConfirmation type (F-codec/R0)
//     - dispatch-planner branch (codec-mediated build dispatch)
//     - dispatch-module branch (codec-mediated framework module execution)
//     - decodedContext systemPromptBlock injection (codec decode output)
//   Surviving flow:
//     1. Auth + rate limit (unchanged)
//     2. Pipeline guard via isPipelineActive (F-planner R3)
//     3. If running → block with informational message
//     4. Default: streamed AI chat (no system context block at this shot)
//   Sprint 9 will reauthor:
//     - Substrate write at message arrival (HR-LM1 — perimeter→substrate write surface)
//     - Substrate read for system context assembly (thread query)
//     - F-router-mediated dispatch to F-plan / F-discover / F-verify

import { NextRequest, NextResponse }            from 'next/server'
import { sendMessage, getMessages }             from '../app/chat-workflow'
import { getPerimeterSession }                  from '@/features/F-identity/contract/perimeter-consultation'
import { CHAT_CONFIG, CHAT_RATE_LIMIT }         from '../config/chat-config'
import { validateMessageContent }               from '../domain/chat-logic'
import { MODELS }                               from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                    from '@/core/domain/rate-limiter'
import { isPipelineActive }                     from '@/features/F-planner/contract/planner-contract'

// ── Rate limiter (lazy init — Turbopack rule) ─────────────────────────────────
let chatLimiter: ReturnType<typeof createRateLimiter> | null = null
function getChatLimiter() {
  if (!chatLimiter) chatLimiter = createRateLimiter()
  return chatLimiter
}

// ── POST /api/chat/[projectId]/message ────────────────────────────────────────
// sprint-8-shot-3a: codec pipeline removed. Direct chat with no decoded context.
// Sprint 9 wires substrate write + thread query + F-router dispatch.

export async function POST_message(
  req:    NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {
  // Sprint 6 Shot 3: perimeter validates at unitary site; R3 reads via getPerimeterSession.
  const session = getPerimeterSession(req)
  if (!session) return new Response('Unauthenticated', { status: 401 })

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const limit = getChatLimiter().check(session.userId, CHAT_RATE_LIMIT)
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait.' } }),
      {
        status: 429,
        headers: {
          'Content-Type':  'application/json',
          'Retry-After':   String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      }
    )
  }

  const { projectId } = params
  const body = await req.json()
  const { content, modelId } = body
  if (!content || !modelId) return new Response('Missing params', { status: 400 })

  if (!MODELS[modelId]) return new Response('Invalid model', { status: 400 })

  const validation = validateMessageContent(content)
  if (!validation.valid) return new Response(validation.error, { status: 400 })

  const encoder = new TextEncoder()

  // TODO Sprint 9: wire substrate write here (HR-LM1).
  //   On user-message arrival, perimeter calls writeStateChange against
  //   F-memory/substrate-contract with channel='wearer', scope=userId,
  //   identities + relations derived from the message.

  // ── Pipeline guard — read-only R3 query ────────────────────────────────────
  const pipelineState = await isPipelineActive(projectId)

  if (pipelineState.active && pipelineState.status === 'running') {
    const stream = new ReadableStream({
      start(controller) {
        const send = (data: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        send({ chunk: 'A build is currently in progress. Track it in the dashboard.' })
        send({ done: true })
        controller.close()
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

  // TODO Sprint 9: thread-query substrate for system context assembly.
  //   Identity-recurrence on session-relevant identities, scope-filtered
  //   to userId, replaces the codec-decoded systemPromptBlock injection.

  // TODO Sprint 9: F-router dispatch.
  //   Before falling through to default chat, call F-router.route() with
  //   {message, sessionContext}. If destination matches F-plan/F-discover/F-verify,
  //   dispatch directly to that slice's executePlan/executeResearchFromInput/
  //   executeVerificationFromInput. Default chat is the fallback for unmatched
  //   messages.

  // ── Default: AI chat (no decoded context until Sprint 9) ───────────────────
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

  // TODO Sprint 9: substrate write of LLM response.
  //   After stream completes, perimeter calls writeStateChange for the AI turn
  //   (channel='ai', scope=userId).

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection:      'keep-alive',
    },
  })
}

// ── GET /api/chat/[projectId]/messages ────────────────────────────────────────
export async function GET_messages(
  req:    NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  // Sprint 6 Shot 3: perimeter validates at unitary site; R3 reads via getPerimeterSession.
  const session = getPerimeterSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = params
  const limit    = parseInt(req.nextUrl.searchParams.get('limit') ?? String(CHAT_CONFIG.pageSize))
  const messages = await getMessages(projectId, null, limit).catch(() => [])

  return NextResponse.json({ messages })
}

export { useChat, useChatStream } from './chat-hook'
