// @liv-standard v1.5
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5
// amended:    w2-item10, w2-item-12, phase-b-item2, phase-5.1-r1, phase-5.2, phase-5-audit
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  SESSION_COOKIE_NAME  F-identity/contract/auth-contract
//   W-ATOM  validateSession      F-identity/contract/auth-contract
//   W-ATOM  MODELS               F-ai-adapter/config/ai-adapter-config
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
//   W-ATOM  CHAT_RATE_LIMIT      ../config/chat-config
//   W-ATOM  BuildConfirmation    F-codec/config/codec-routing-types
//   W-HOOK  processMessage       F-codec/contract/codec-contract  (R3→R3, A5)
//   W-HOOK  isPipelineActive     F-planner/contract/planner-contract  (R3→R3, read-only query)
// wires-out:  none  (route handler — external surface)
// deps:
//   R0  ../config/chat-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R0  @/features/F-codec/config/codec-routing-types
//   R1  ../domain/chat-logic
//   R1  @/core/domain/rate-limiter
//   R2  ../app/chat-workflow
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-planner/contract/planner-contract
//   R5  next/server
// validated:  pending
//
// phase-b-item2 (A1, A2, A5):
//   Full rewire. All F-planner imports removed:
//     - handleBuildRequest (was R3→R3 cross-slice command — A5 violation)
//     - dbGetActiveJobForProject (was R3→R4 cross-slice — A2 + T1.1 violation)
//     - BuildRequestPayload type (no longer needed)
//   Replaced with:
//     - processMessage from F-codec/R3 (codec pipeline: encode→route→decode)
//     - isPipelineActive from F-planner/R3 (read-only query, Option B)
//   New flow:
//     1. Auth + rate limit (unchanged)
//     2. isPipelineActive(projectId) — read-only R3 query (A3: boolean atom)
//     3. If running → block with informational message (unchanged behavior)
//     4. codec.processMessage(content, userId, projectId, modelId)
//     5. Route dispatch based on route.type:
//        - dispatch-planner → stream confirmation via LLM (phase-5.1-r1)
//        - chat-response / reference-only → sendMessage with decodedContext
//   Build dispatch now goes through codec events (A5 compliant).
//   Axiom cite: A1 — POST_message owns fork. A2 — no R4 imports.
//   A5 — cross-slice via R3 contracts and event bus only.
//
// phase-5.1-r1 (A1, A3):
//   dispatch-planner branch now streams planner's confirmation response
//   through sendMessage with plan injected as system context. Replaces
//   hardcoded "Build request received." dead string. Liv presents the plan
//   naturally and asks for user confirmation.
//   BuildConfirmation type import added (W-ATOM from F-codec/R0).
//   Axiom cite: A3 — typed boundary via BuildConfirmation atom.
//   A1 — chat-contract owns the SSE stream fork.

import { NextRequest, NextResponse }            from 'next/server'
import { sendMessage, getMessages }             from '../app/chat-workflow'
import { SESSION_COOKIE_NAME, validateSession } from '@/features/F-identity/contract/auth-contract'
import { CHAT_CONFIG, CHAT_RATE_LIMIT }         from '../config/chat-config'
import { validateMessageContent }               from '../domain/chat-logic'
import { MODELS }                               from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                    from '@/core/domain/rate-limiter'
import { processMessage }                       from '@/features/F-codec/contract/codec-contract'
import { isPipelineActive }                     from '@/features/F-planner/contract/planner-contract'
import type { BuildConfirmation }               from '@/features/F-codec/config/codec-routing-types'

// ── Rate limiter (lazy init — Turbopack rule) ─────────────────────────────────
let chatLimiter: ReturnType<typeof createRateLimiter> | null = null
function getChatLimiter() {
  if (!chatLimiter) chatLimiter = createRateLimiter()
  return chatLimiter
}

// ── POST /api/chat/[projectId]/message ────────────────────────────────────────
// phase-b-item2: rewired. Chat → Codec → route dispatch.
// phase-5.1-r1: dispatch-planner streams confirmation via LLM.
// Build dispatch via codec W-HOOK (A5). Pipeline guard via R3 query.

export async function POST_message(
  req:    NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return new Response('Unauthenticated', { status: 401 })
  const session = await validateSession(accessToken)
  if (!session) return new Response('Unauthenticated', { status: 401 })

  // ── Rate limit (w2-item-12) ─────────────────────────────────────────────────
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

  // A3: validate modelId against MODELS allowlist at contract surface.
  if (!MODELS[modelId]) return new Response('Invalid model', { status: 400 })

  const validation = validateMessageContent(content)
  if (!validation.valid) return new Response(validation.error, { status: 400 })

  const encoder = new TextEncoder()

  // ── 2. Pipeline guard — read-only R3 query (Option B) ──────────────────────
  const pipelineState = await isPipelineActive(projectId)

  if (pipelineState.active && pipelineState.status === 'running') {
    // Stream "build in progress" message (existing behavior, unchanged)
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

  // ── 3. Codec pipeline ──────────────────────────────────────────────────────
  const codecResult = await processMessage(content, session.userId, projectId, modelId)
  if (!codecResult.ok) {
    const stream = new ReadableStream({
      start(controller) {
        const send = (data: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        send({ error: codecResult.error })
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

  const { route, decodedContext } = codecResult.data

  // ── 4. Route dispatch ──────────────────────────────────────────────────────

  // phase-5.1-r1: dispatch-planner streams confirmation through LLM.
  // Codec already called handleBuildRequest (W-HOOK) — confirmation is on route.
  // Inject plan into LLM system context so Liv presents it naturally.
  if (route.type === 'dispatch-planner') {
    const confirmation = route.confirmation
    if (!confirmation) {
      // Safety: codec-orchestrate always attaches confirmation on dispatch-planner.
      // This guard satisfies the optional type — should never execute at runtime.
      return new Response('Internal error: missing confirmation', { status: 500 })
    }
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

        // phase-5.2: send jobId for dashboard binding (before LLM stream)
        if (confirmation.jobId) {
          send({ jobId: confirmation.jobId })
        }

        try {
          for await (const chunk of sendMessage({
            projectId,
            content,
            modelId,
            userId: session.userId,
            systemContext: [
              decodedContext.systemPromptBlock,
              `Build plan:\n${confirmation.response}`,
              confirmation.isConfirmation
                ? 'Present this plan to the user and ask for confirmation to proceed.'
                : 'Acknowledge the build status to the user.',
            ].filter(Boolean).join('\n\n'),
          })) {
            send({ chunk })
          }
          send({ done: true })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'unknown_error'
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

  // ── 5. Default: AI chat with decoded context ───────────────────────────────
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
          systemContext: decodedContext.systemPromptBlock,
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

// ── GET /api/chat/[projectId]/messages ────────────────────────────────────────
export async function GET_messages(
  req:    NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  const session = await validateSession(accessToken)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = params
  const limit    = parseInt(req.nextUrl.searchParams.get('limit') ?? String(CHAT_CONFIG.pageSize))
  const messages = await getMessages(projectId, null, limit).catch(() => [])

  return NextResponse.json({ messages })
}

export { useChat, useChatStream } from './chat-hook'
