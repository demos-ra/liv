// @liv-standard v1.5.1 amended sprint-11-shot-2 sprint-11-shot-6 sprint-11-shot-6a sprint-11-shot-6b
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-3a (F-codec dissolved; codec pipeline removed)
//             sprint-11-shot-2 (substrate write + thread query + F-router wired)
//             sprint-11-shot-6 (permission gate rationale; stale manifest entries cleaned)
//             sprint-11-shot-6a (S11-C1: Decision-D terminology aligned — side= → source.channel=)
//             sprint-11-shot-6b (source.scope corrected: userId → projectId at all writeStateChange callsites)
// slice:      F-chat
// layer:      R3
// wires-in:
//   W-FN    getPerimeterSession  F-identity/contract/perimeter-consultation
//   W-ATOM  MODELS               F-ai-adapter/config/ai-adapter-config
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
//   W-ATOM  CHAT_RATE_LIMIT      ../config/chat-config
//   W-HOOK  isPipelineActive     F-planner/contract/planner-contract  (R3→R3, read-only query)
//   W-FN    writeStateChange     F-memory/contract/substrate-contract  (HR-LM1 write surface)
//   W-FN    threadQuery          F-memory/contract/substrate-contract  (thread read surface)
//   W-FN    route                F-router/contract/router-contract     (message routing)
//   W-FN    generateId           core/types/primitives                 (turnId generation)
//   W-ATOM  SubstrateWriteInput  core/types/substrate.types
//   W-ATOM  ThreadQueryInput     core/types/substrate.types
//   W-ATOM  ThreadResult         core/types/substrate.types
//   W-ATOM  RouterMessage        F-router/config/router-types
//   W-ATOM  RouterSessionContext F-router/config/router-types
//   W-ATOM  ROUTER_ERROR_CODES   F-router/config/router-types
// wires-out:  none  (route handler — external surface)
// deps:
//   R0  ../config/chat-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R1  ../domain/chat-logic
//   R1  @/core/domain/rate-limiter
//   R2  ../app/chat-workflow
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R3  @/features/F-planner/contract/planner-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R3  @/features/F-router/contract/router-contract
//   R5  core/types/primitives
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
//
// sprint-11-shot-2 (substrate + router wired):
//   Decision-D: ChatStateChange → SubstrateWriteInput mapping.
//     Wearer write: identities=[userId, projectId, turnId], relations=[{
//       type: 'chat-turn', modality: 'declarative',
//       identitiesWithRoles: [{ identity: userId, role: 'agent' }], negation: false }],
//       source.channel='wearer', scope=userId.
//     Ai write: identities=[userId, projectId, turnId, modelId], relations=[{
//       type: 'chat-response', modality: 'declarative',
//       identitiesWithRoles: [{ identity: modelId, role: 'agent' }], negation: false }],
//       source.channel='ai', scope=userId.
//     Shared turnId ensures both writes address same exchange position.
//     contextRef (ThreadResult | null) carried from assembly; used in system prompt
//     construction; not stored into SubstrateWriteInput (type has no meta field).
//   CA4 independence: wearer write fire-and-forget (no await at call site);
//     ai write fire-and-forget after send({ done: true }), before controller.close().
//     Stream error sends error chunk and attempts partial-content write — neither suppresses other.
//   F-router: REGISTRY_EMPTY and NO_MATCH both treated as fallthrough (Chat Standard CA5).
//
// sprint-11-shot-6 (permission gate rationale):
//   substrate_write and program_invoke_* actions: all callsites in this file
//   are downstream of getPerimeterSession() (line ~113). Unauthenticated
//   requests return 401 before reaching any substrate write or router dispatch.
//   requirePermission() gates are Sprint 9 scope per Perimeter Standard scopeOut
//   (F-009 implementation — substrate-write callers, thread-query callers,
//   F-router registration). Perimeter-gate (session auth) is the active gate
//   for Sprint 11; role-based requirePermission is deferred per F-009.

import { NextRequest, NextResponse }             from 'next/server'
import { sendMessage, getMessages }              from '../app/chat-workflow'
import { getPerimeterSession }                   from '@/features/F-identity/contract/perimeter-consultation'
import { CHAT_CONFIG, CHAT_RATE_LIMIT }          from '../config/chat-config'
import { validateMessageContent }                from '../domain/chat-logic'
import { MODELS }                                from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                     from '@/core/domain/rate-limiter'
import { isPipelineActive }                      from '@/features/F-planner/contract/planner-contract'
import { writeStateChange, threadQuery }         from '@/features/F-memory/contract/substrate-contract'
import { route, ROUTER_ERROR_CODES }             from '@/features/F-router/contract/router-contract'
import { generateId }                            from '@/core/types/primitives'
import type {
  SubstrateWriteInput,
  ThreadQueryInput,
  ThreadResult,
  IdentityRef,
  ScopeRef,
  RoleRef,
}                                                from '@/core/types/substrate.types'
import type {
  RouterMessage,
  RouterSessionContext,
}                                                from '@/features/F-router/contract/router-contract'

// ── Rate limiter (lazy init — Turbopack rule) ─────────────────────────────────
let chatLimiter: ReturnType<typeof createRateLimiter> | null = null
function getChatLimiter() {
  if (!chatLimiter) chatLimiter = createRateLimiter()
  return chatLimiter
}

// ── POST /api/chat/[projectId]/message ────────────────────────────────────────
// sprint-8-shot-3a: codec pipeline removed.
// sprint-11-shot-2: substrate write + thread query + F-router wired.

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

  // ── Wearer-side substrate write (HR-LM1) — sprint-11-shot-2 ───────────────
  // Generate turnId once per exchange; shared with ai-side write below.
  // Decision-D mapping applied: identities anchor userId + projectId + turnId.
  // Fire-and-forget: CA4 independence — write failure must not affect response path.
  const turnId    = generateId('turn')
  const arrivedAt = Date.now()

  const wearerWrite: SubstrateWriteInput = {
    content: {
      identities: [
        session.userId as IdentityRef,
        projectId      as IdentityRef,
        turnId         as IdentityRef,
      ],
      relations: [
        {
          type:                'chat-turn' as IdentityRef,
          modality:            'declarative',
          identitiesWithRoles: [
            { identity: session.userId as IdentityRef, role: 'agent' as RoleRef },
          ],
          negation: false,
        },
      ],
    },
    metadata: {
      time:   arrivedAt,
      source: { channel: 'wearer', scope: projectId as ScopeRef },
    },
  }

  writeStateChange(wearerWrite).catch((err: unknown) => {
    console.error('[chat] wearer substrate write failed', err instanceof Error ? err.message : err)
  })

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

  // ── Thread query — context assembly — sprint-11-shot-2 ────────────────────
  // Identity-recurrence on userId, scope-filtered to userId.
  // Replaces the codec-decoded systemPromptBlock injection (sprint-8-shot-3a removal).
  // Chat Standard §5.6: substrate read failure → empty system prompt; LLM call not suppressed.
  let contextRef: ThreadResult | null = null
  let systemPrompt = ''

  try {
    const queryInput: ThreadQueryInput = {
      threadKind: 'identity-recurrence',
      anchor:     session.userId as IdentityRef,
      scope:      projectId as ScopeRef,
      limit:      20,
    }
    const queryResult = await threadQuery(queryInput)
    if (queryResult.ok && queryResult.data.records.length > 0) {
      contextRef   = queryResult.data
      // Assemble system prompt from thread records: surface identity anchors as context lines.
      const lines  = queryResult.data.records.map(r =>
        r.content.identities.join(' | ')
      )
      systemPrompt = lines.join('\n')
    }
  } catch (err) {
    // §5.6: substrate read failure — proceed with empty system prompt.
    console.error('[chat] thread query failed', err instanceof Error ? err.message : err)
  }

  // ── F-router dispatch — sprint-11-shot-2 ──────────────────────────────────
  // Consult F-router before falling through to default LLM path.
  // Chat Standard CA5: REGISTRY_EMPTY and NO_MATCH both treated as no-match → fallthrough.
  // Matched destination dispatch wired at Shot 3; until then fall through always.
  const routerMessage: RouterMessage = {
    text: content as string,
    kind: 'user-turn',
  }
  const routerContext: RouterSessionContext = {
    userId: session.userId,
    scope:  projectId,
  }

  const routeResult = route(routerMessage, routerContext)

  if (routeResult.ok) {
    // Matched destination — Shot 3 will dispatch to slice.
    // Until destinations are registered, registry is empty and this branch is unreachable.
    // When reached: log only. Fall through to default LLM path until Shot 3 wires dispatch.
    console.log(JSON.stringify({
      level: 'info',
      event: 'chat.route_matched_pending_dispatch',
      slice:     routeResult.data.slice,
      programId: routeResult.data.programId,
      turnId,
    }))
    // Fall through — dispatch placeholder until Shot 3.
  } else {
    // REGISTRY_EMPTY or NO_MATCH → expected fallthrough per CA5.
    const isExpected =
      routeResult.error.code === ROUTER_ERROR_CODES.REGISTRY_EMPTY ||
      routeResult.error.code === ROUTER_ERROR_CODES.NO_MATCH
    if (!isExpected) {
      console.error('[chat] F-router unexpected error', routeResult.error.code, routeResult.error.message)
    }
    // Fall through to default LLM path.
  }

  // ── Default: AI chat ───────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

      // Accumulate full response for ai-side substrate write (CA4: fire-and-forget after stream).
      let fullResponse = ''
      let streamErr:   string | null = null

      try {
        for await (const chunk of sendMessage({
          projectId,
          content,
          modelId,
          userId:       session.userId,
          systemContext: systemPrompt || undefined,
        })) {
          fullResponse += chunk
          send({ chunk })
        }
        send({ done: true })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown_error'
        streamErr = message
        console.error('[chat] stream error', message)
        send({ error: message })
      }

      // ── Ai-side substrate write — sprint-11-shot-2 ─────────────────────────
      // Fires after stream completes (full or partial on error).
      // CA4: fire-and-forget — write failure must not suppress already-streamed chunks.
      // Same turnId as wearer write; source.channel='ai'.
      const aiWrite: SubstrateWriteInput = {
        content: {
          identities: [
            session.userId as IdentityRef,
            projectId      as IdentityRef,
            turnId         as IdentityRef,
            modelId        as IdentityRef,
          ],
          relations: [
            {
              type:                'chat-response' as IdentityRef,
              modality:            'declarative',
              identitiesWithRoles: [
                { identity: modelId as IdentityRef, role: 'agent' as RoleRef },
              ],
              negation: false,
            },
          ],
        },
        metadata: {
          time:   Date.now(),
          source: { channel: 'ai', scope: projectId as ScopeRef },
        },
      }

      writeStateChange(aiWrite).catch((err: unknown) => {
        console.error(
          '[chat] ai substrate write failed',
          err instanceof Error ? err.message : err,
          streamErr ? { partial: true } : {}
        )
      })

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
