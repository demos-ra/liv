// @liv-standard v1.3
// [F-chat/contract/chat-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-corrective-2, w2-item10, w2-item-12
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-ATOM  SESSION_COOKIE_NAME  F-identity/contract/auth-contract
//   W-ATOM  validateSession      F-identity/contract/auth-contract
//   W-ATOM  MODELS               F-ai-adapter/config/ai-adapter-config
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
//   W-ATOM  CHAT_RATE_LIMIT      ../config/chat-config
//   W-FN    createRateLimiter    ../domain/rate-limiter
//   W-FN    handleBuildRequest   F-planner/contract/planner-contract  (R3→R3, A5)
//   W-FN    dbGetActiveJobForProject  F-planner/exec/planner-db  (R4 — see amendment below)
// wires-out:  none  (route handler — external surface)
// deps:
//   R0  ../config/chat-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R0  @/features/F-planner/types/planner-types
//   R1  ../domain/chat-logic
//   R1  ../domain/rate-limiter
//   R2  ../app/chat-workflow
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-planner/contract/planner-contract
//   R4  @/features/F-planner/exec/planner-db
//   R5  next/server
// validated:  pending
//
// step4b2-phase-a (A1, A3, A5): (unchanged)
//
// step4b2-corrective-2 D3 (A1):
//   Fork upgraded from boolean to status-aware.
//   'running' → pipeline executing autonomously; return "build in progress" SSE.
//   'pending'/'confirmed' → route to handleBuildRequest (IN-MAIN gate).
//   This prevents user messages from entering the IN-MAIN loop during autonomous
//   pipeline execution, which would corrupt the pipeline state.
//   Axiom cite: A1 — POST_message owns the fork decision for all active build states.
//
//   R4 import amendment (A2-r3-active-build-check):
//   This file imports dbGetActiveJobForProject directly from F-planner/exec/planner-db
//   (R4). This is a structural exception, justified as follows:
//     - The check is a pure read with no side effects.
//     - No F-planner R2/R1 logic is imported — only a single R4 query function.
//     - Adding an R3 contract surface on F-planner solely for this read would
//       create an HTTP handler wrapper for a non-HTTP operation, which violates A1
//       (the http handler wrapper would have no ownership of this concern).
//     - The alternative — threading projectId through sendMessage() to check inside
//       chat-workflow — would pollute F-chat/R2 with planner concerns (A1 violation).
//     - This is the minimal, least-invasive boundary crossing. It will be
//       refactored in Phase B when F-planner exposes a proper query surface.
//   Axiom cite:
//     A1 — POST_message owns the fork decision. No other layer is appropriate.
//     A3 — BuildRequestPayload is the typed boundary to F-planner (A3).
//     A5 — handleBuildRequest is called via F-planner's R3 contract surface.
//
// w2-item-12 (A4):
//   Per-user rate limit check added to POST_message. Inserted after session
//   validation, before body parsing — rejected users don't burn req.json() cost.
//   createRateLimiter() with lazy init (Turbopack rule). Returns 429 with
//   Retry-After header. Independent store from planner rate limiter.
//   Axiom cite: A4 — rate limit is a pre-I/O gate. No I/O consumed on rejection.

import { NextRequest, NextResponse }            from 'next/server'
import { sendMessage, getMessages }             from '../app/chat-workflow'
import { SESSION_COOKIE_NAME, validateSession } from '@/features/F-identity/contract/auth-contract'
import { CHAT_CONFIG, CHAT_RATE_LIMIT }         from '../config/chat-config'
import { validateMessageContent }               from '../domain/chat-logic'
import { MODELS }                               from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                    from '../domain/rate-limiter'
import { handleBuildRequest }                   from '@/features/F-planner/contract/planner-contract'
import { dbGetActiveJobForProject }             from '@/features/F-planner/exec/planner-db'
import type { BuildRequestPayload }             from '@/features/F-planner/types/planner-types'

// ── Rate limiter (lazy init — Turbopack rule) ─────────────────────────────────
let chatLimiter: ReturnType<typeof createRateLimiter> | null = null
function getChatLimiter() {
  if (!chatLimiter) chatLimiter = createRateLimiter()
  return chatLimiter
}

// ── POST /api/chat/[projectId]/message ────────────────────────────────────────
// Fork point: active build → IN-MAIN loop via F-planner/R3.
//             no active build → normal sendMessage() via F-chat/R2.
// SSE format is identical in both paths — client renders chunks identically.

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
  // Rejects unknown model strings before they reach the AI adapter.
  if (!MODELS[modelId]) return new Response('Invalid model', { status: 400 })

  const validation = validateMessageContent(content)
  if (!validation.valid) return new Response(validation.error, { status: 400 })

  // ── Active build check ─────────────────────────────────────────────────────
  // Query planner DB for an active job on this project.
  // Status routing (D3 corrective):
  //   'pending' / 'confirmed' → route to IN-MAIN loop via handleBuildRequest
  //   'running'               → pipeline executing autonomously; block chat input
  //   anything else / error   → fall through to normal AI chat
  let activeJobStatus: string | null = null
  try {
    const activeJobResult = await dbGetActiveJobForProject(projectId)
    activeJobStatus = (activeJobResult.ok && activeJobResult.data)
      ? activeJobResult.data.pipelineStatus
      : null
  } catch {
    activeJobStatus = null
  }

  const encoder = new TextEncoder()

  // ── Fork: running pipeline → block with informational message ─────────────
  if (activeJobStatus === 'running') {
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

  // ── Fork: pending/confirmed build → F-planner IN-MAIN ─────────────────────
  if (activeJobStatus === 'pending' || activeJobStatus === 'confirmed') {
    const input: BuildRequestPayload = {
      projectId,
      userId:  session.userId,
      message: content,
      modelId,
    }

    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) =>
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

        try {
          const result = await handleBuildRequest(input)

          if (!result.ok) {
            send({ error: result.error })
            send({ done: true })
            return
          }

          // Stream the planner response as SSE chunks.
          // Split on word boundaries to simulate streaming — client behaviour
          // is identical to real AI streaming. Full response is already in memory.
          const words = result.response.split(/(\s+)/)
          for (const word of words) {
            if (word) send({ chunk: word })
          }

          send({ done: true })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'unknown_error'
          console.error('[chat] planner stream error', message)
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

  // ── Default path: normal AI chat via F-chat/R2 ────────────────────────────
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
