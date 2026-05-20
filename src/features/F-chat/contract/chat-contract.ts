// @liv-standard v1.5.1 amended sprint-11-shot-2 sprint-11-shot-6 sprint-11-shot-6a sprint-11-shot-6b sprint-12-shot-2 sprint-12-shot-4 sprint-13-shot-1 sprint-b1-shot-1 sprint-13c-shot-1 sprint-2-shot-6
// [F-chat/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-3a (F-codec dissolved; codec pipeline removed)
//             sprint-11-shot-2 (substrate write + thread query + F-router wired)
//             sprint-11-shot-6 (permission gate rationale; stale manifest entries cleaned)
//             sprint-11-shot-6a (S11-C1: Decision-D terminology aligned — side= → source.channel=)
//             sprint-11-shot-6b (source.scope corrected: userId → projectId at all writeStateChange callsites)
//             sprint-12-shot-4 (F-S12-D closed: stale F-planner refs removed; CS v1.0 alignment declared)
//             sprint-13-shot-1 (dispatch wire: routeResult.ok branch dispatches to cycle program contract entries)
//             sprint-b1-shot-1 (wearer write channel: 'wearer' → Decision-D-CHANNEL mapped from session.resolvedChannel)
//             sprint-13c-shot-1 (dispatchCrossing: fire-and-forget at all F-chat outbound emission sites; memory loop dispatch direction live)
//             sprint-2-shot-6 (context assembly migrated: threadQuery → present(); contextRef ThreadResult → PresentView)
// slice:      F-chat
// category:   Modality
// layer:      R3
// wires-in:
//   W-FN    getPerimeterSession  F-identity/contract/perimeter-consultation
//   W-ATOM  MODELS               F-ai-adapter/config/ai-adapter-config
//   W-ATOM  CHAT_CONFIG          ../config/chat-config
//   W-ATOM  CHAT_RATE_LIMIT      ../config/chat-config
//   W-HOOK  isPipelineActive     F-plan/contract/plan-contract  (R3→R3, read-only query)
//   W-FN    writeStateChange     F-memory/contract/substrate-contract  (HR-LM1 write surface)
//   W-FN    present              F-present/contract/present-contract   (sprint-2-shot-6: replaces threadQuery at context assembly)
//   W-FN    route                F-router/contract/router-contract     (message routing)
//   W-FN    generateId           core/types/primitives                 (turnId generation)
//   W-ATOM  SubstrateWriteInput  core/types/substrate.types
//   W-ATOM  PresentView          F-present/contract/present-contract   (sprint-2-shot-6: replaces ThreadResult as contextRef type)
//   W-ATOM  PresentReadIntent    F-present/contract/present-contract   (sprint-2-shot-6)
//   W-ATOM  ChannelKind          core/types/perimeter-standard.types  (sprint-b1-shot-1: Decision-D-CHANNEL mapping)
//   W-ATOM  RouterMessage        F-router/config/router-types
//   W-ATOM  RouterSessionContext F-router/config/router-types
//   W-ATOM  ROUTER_ERROR_CODES   F-router/config/router-types
//   W-FN    executePlan          F-plan/contract/plan-contract         (sprint-13-shot-1 dispatch)
//   W-FN    executeResearchFromInput   F-discover/contract/discover-contract  (sprint-13-shot-1 dispatch)
//   W-FN    executeVerificationFromInput F-verify/contract/verify-contract    (sprint-13-shot-1 dispatch)
//   W-FN    dispatchCrossing             F-identity/contract/perimeter-consultation  (sprint-13c-shot-1)
//   W-ATOM  DispatchId                   core/types/perimeter-standard.types          (sprint-13c-shot-1)
//   W-ATOM  EpochMs                      core/types/perimeter-standard.types          (sprint-13c-shot-1)
// wires-out:
//   W-FN    executePlan              F-plan/contract/plan-contract          (sprint-13-shot-1 dispatch)
//   W-FN    executeResearchFromInput F-discover/contract/discover-contract  (sprint-13-shot-1 dispatch)
//   W-FN    executeVerificationFromInput F-verify/contract/verify-contract  (sprint-13-shot-1 dispatch)
//   (F-builder dispatch deferred — typed rejection only, no entry call)
// deps:
//   R0  ../config/chat-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R1  ../domain/chat-logic
//   R1  @/core/domain/rate-limiter
//   R2  ../app/chat-workflow
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R3  @/features/F-plan/contract/plan-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R3  @/features/F-router/contract/router-contract
//   R3  @/features/F-discover/contract/discover-contract  (sprint-13-shot-1)
//   R3  @/features/F-verify/contract/verify-contract      (sprint-13-shot-1)
//   R5  core/types/primitives
//   R5  next/server
// validated:  pending
//
// Chat Standard v1.0 alignment:
//   CA1 — arrival validated at perimeter (shape + rate-limit gate, lines ~113–150)
//   CA2 — present() assembles context before LLM call (lines ~591–625; sprint-2-shot-6 migration)
//   CA3 — dual write: wearer side (line ~162) + AI side (line ~312); same turnId variable
//   CA4 — stream and write are independent; write failure non-fatal to stream (.catch pattern)
//   CA5 — F-router consulted; fallthrough to LLM on no-match (lines ~240–280, REGISTRY_EMPTY/NO_MATCH)
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
//     2. Pipeline guard via isPipelineActive (F-plan R3)
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
//
// sprint-13-shot-1 (dispatch wire):
//   routeResult.ok branch replaced: instead of log-only fallthrough, dispatches
//   to matched cycle program via dispatchToProgram(). Each arm calls the program's
//   contract entry function, awaits the result, and returns a typed SSE Response.
//   Decision-D:
//     D1 — SSE chunk shape: { result: T } then { done: true } — matches AI chat path.
//     D2 — defaultClassification(): primitive='anchor', confidence=1.0,
//           classificationNodeId=generateId('cls'). Smoke invocation per brief.
//     D3 — F-builder rejection: { chunk: '...' } conversational message + { done: true }.
//   F-builder dispatch deferred (no jobId available from bare chat message); typed
//   rejection returned — not a fallthrough to LLM.
//   Unhandled destination slices log a warning and fall through to LLM (default arm).

import { NextRequest, NextResponse }             from 'next/server'
import { sendMessage, getMessages }              from '../app/chat-workflow'
import { getPerimeterSession, dispatchCrossing } from '@/features/F-identity/contract/perimeter-consultation'
import type { DispatchId, EpochMs }              from '@/core/types/perimeter-standard.types'
import { CHAT_CONFIG, CHAT_RATE_LIMIT }          from '../config/chat-config'
import { validateMessageContent }                from '../domain/chat-logic'
import { MODELS }                                from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                     from '@/core/domain/rate-limiter'
import { isPipelineActive }                      from '@/features/F-plan/contract/plan-contract'
import { writeStateChange }                       from '@/features/F-memory/contract/substrate-contract'
import { present }                                from '@/features/F-present/contract/present-contract'
import type { PresentView, PresentReadIntent, IntentIdRef, FrameworkRef } from '@/features/F-present/contract/present-contract'
import { route, ROUTER_ERROR_CODES }             from '@/features/F-router/contract/router-contract'
import { generateId }                            from '@/core/types/primitives'
import type { Semver, NodeId }                   from '@/core/types/primitives'
import type { ChannelKind }                      from '@/core/types/perimeter-standard.types'
import type {
  SubstrateWriteInput,
  IdentityRef,
  ScopeRef,
  RoleRef,
  SourceChannel,
}                                                from '@/core/types/substrate.types'
import { deriveContentClassFromChannel }         from '@/core/types/substrate.types'
import type {
  RouterMessage,
  RouterSessionContext,
}                                                from '@/features/F-router/contract/router-contract'

// ── Cycle program imports — sprint-13-shot-1 ─────────────────────────────────
import { executePlan }                           from '@/features/F-plan/contract/plan-contract'
import { executeResearchFromInput }              from '@/features/F-discover/contract/discover-contract'
import { executeVerificationFromInput }          from '@/features/F-verify/contract/verify-contract'
import type { ResearchExecuteInput }             from '@/features/F-discover/contract/discover-contract'
import type { VerificationExecuteInput }         from '@/features/F-verify/contract/verify-contract'
import type { Destination }                      from '@/features/F-router/config/router-types'
// Sub-types for smoke input construction — imported from core/R5 per A2
// (F-chat R3 → core R5 is permitted; R0 re-exports these from the same source)
import type {
  ResearchInput,
  ResearchBinding,
  ResearchTypedAtomSchema,
  KnowledgeContext,
  ResearchQuestionInput,
  AuthoringProgramRef as ResearchAuthoringProgramRef,
  DecompositionPolicyRef,
}                                                from '@/core/types/research-standard.types'
import type {
  VerificationInput,
  VerificationBinding,
  VerificationTypedAtomSchema,
  AuthoringProgramRef as VerifyAuthoringProgramRef,
}                                                from '@/core/types/verification-standard.types'

// ── Cycle program dispatch — sprint-13-shot-1 ─────────────────────────────────
// dispatchToProgram: maps Destination.slice to the matched cycle program's
// contract entry. Returns Response | null.
// null = unhandled destination slice — caller falls through to default LLM path.
// Chat Standard CA5 compliance: only reached when routeResult.ok is true.
//
// Decision-D:
//   D1 — SSE chunk shape: { result: T } then { done: true }. Matches AI chat
//        path stream shape for client compatibility.
//   D2 — defaultClassification(): primitive='anchor', confidence=1.0,
//        classificationNodeId=generateId('cls') as NodeId. Smoke invocation
//        per brief; full AS-calibrated classification is Sprint B work.
//   D3 — F-builder rejection: conversational SSE message + { done: true }.
//        Not a fallthrough — typed rejection from dispatch layer.
//   D4 — Smoke binding version strings: '1.0.0' cast as Semver. The isSemver
//        runtime check validates /^\d+\.\d+\.\d+/ regex — '1.0.0' passes.
//        Cast is safe; no `as any` used.
//   D5 — QuestionId / NodeId / ArtifactRef (= NodeId) are branded strings.
//        generateId() returns string; cast via `as QuestionId` / `as NodeId`.
//        Same pattern used throughout existing contracts (e.g. plan-contract.ts).

type DispatchContext = {
  content:   string
  userId:    string
  projectId: string
  turnId:    string
  modelId:   string
  encoder:   TextEncoder
}

// D1 — SSE stream wrapping typed program result.
function programResultStream(result: unknown, encoder: TextEncoder, dispatchCtx: { projectId: string }): Response {
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      send({ result })
      send({ done: true })
      // Dispatch crossing — reference disposition (rendering accumulated content to wearer).
      // dispatchCrossing is fire-and-forget internally (returns void; substrate write is .catch'd inside).
      dispatchCrossing({
        dispatchId:       generateId('dx') as DispatchId,
        source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
        payload:          result,
        channelTarget:    'wearer-message',
        dispositionClaim: 'reference',
        scopeContext:     dispatchCtx.projectId,
        authorityContext: { level: 'L0', actor: 'wearer', source: null },
        correlationRef:   null,
        reversibility:    'n/a',
        requestedAt:      Date.now() as EpochMs,
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

// D3 — F-builder typed rejection.
function builderNoJobResponse(encoder: TextEncoder, dispatchCtx: { projectId: string }): Response {
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      send({
        chunk: 'Building requires an active plan. Use F-plan first — describe what you want to build, then confirm to emit a plan artifact. F-builder can proceed once a plan artifact exists.',
      })
      send({ done: true })
      // Dispatch crossing — act disposition (rejection produces effect on wearer request).
      dispatchCrossing({
        dispatchId:       generateId('dx') as DispatchId,
        source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
        payload:          { rejection: 'builder-no-job' },
        channelTarget:    'wearer-message',
        dispositionClaim: 'act',
        scopeContext:     dispatchCtx.projectId,
        authorityContext: { level: 'L0', actor: 'wearer', source: null },
        correlationRef:   null,
        reversibility:    'irreversible',
        requestedAt:      Date.now() as EpochMs,
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

// D2 — Smoke classification. Sprint B will replace with real CS calibration.
function defaultClassification() {
  return {
    classificationNodeId: generateId('cls') as NodeId,
    primitive:            'anchor'  as const,
    confidence:           1.0,
  }
}

async function dispatchToProgram(
  destination: Destination,
  ctx:         DispatchContext,
): Promise<Response | null> {
  const { content, userId, projectId, turnId, modelId, encoder } = ctx

  switch (destination.slice) {

    // ── F-plan ──────────────────────────────────────────────────────────────
    case 'F-plan': {
      const result = await executePlan(content, userId, projectId, turnId, modelId)
      return programResultStream(result, encoder, { projectId: ctx.projectId })
    }

    // ── F-discover ──────────────────────────────────────────────────────────
    // Smoke ResearchInput: minimal shape satisfying gateRS1.
    // All checked fields: authoringProgram (programId: string, programVersion: Semver),
    // userId: string, turnId: string, binding (domainId: string, domainVersion: Semver,
    // investigationMethods: [], questionSchema: { shapeRef: string },
    // knowledgeSchema: { shapeRef: string }, sourceCriteria: [], failsafes: {}),
    // question (questionId: string, questionText: string ≥1 char, decompositionPolicy: string),
    // priorKnowledge (artifactRefs: [], scopeBoundary: null).
    case 'F-discover': {
      const smokeResearchSchema: ResearchTypedAtomSchema = { shapeRef: 'smoke-v1' }
      const smokeBinding: ResearchBinding = {
        domainId:             'smoke',
        domainVersion:        '1.0.0' as Semver,
        investigationMethods: [],
        questionSchema:       smokeResearchSchema,
        knowledgeSchema:      smokeResearchSchema,
        sourceCriteria:       [],
        failsafes:            {},
      }
      const smokeAuthoringProgram: ResearchAuthoringProgramRef = {
        programId:      'F-discover',
        programVersion: '1.0.0' as Semver,
      }
      const smokeQuestion: ResearchQuestionInput = {
        questionId:          generateId('q') as unknown as ResearchQuestionInput['questionId'],
        questionText:        content,
        decompositionPolicy: 'none' as DecompositionPolicyRef,
      }
      const smokePriorKnowledge: KnowledgeContext = {
        artifactRefs:  [],
        scopeBoundary: null,
      }
      const smokeResearchInput: ResearchInput = {
        authoringProgram: smokeAuthoringProgram,
        userId,
        turnId,
        binding:          smokeBinding,
        question:         smokeQuestion,
        priorKnowledge:   smokePriorKnowledge,
      }
      const input: ResearchExecuteInput = {
        researchInput:  smokeResearchInput,
        projectId,
        classification: defaultClassification(),
      }
      const result = await executeResearchFromInput(input)
      return programResultStream(result, encoder, { projectId: ctx.projectId })
    }

    // ── F-verify ────────────────────────────────────────────────────────────
    // Smoke VerificationInput: minimal shape satisfying gateVS1.
    // All checked fields: authoringProgram (programId: string, programVersion: Semver),
    // userId: string, turnId: string, binding (domainId: string, domainVersion: Semver,
    // predicateSet: [], evidenceSchema: { shapeRef: string }, failsafes: {}),
    // target (artifactRef: string (NodeId), artifactKind: string),
    // evidence: null (typed unknown — null satisfies unknown),
    // preverifyInputs: null (same).
    case 'F-verify': {
      const smokeVerifySchema: VerificationTypedAtomSchema = { shapeRef: 'smoke-v1' }
      const smokeVerifyBinding: VerificationBinding = {
        domainId:       'smoke',
        domainVersion:  '1.0.0' as Semver,
        predicateSet:   [],
        evidenceSchema: smokeVerifySchema,
        failsafes:      {},
      }
      const smokeVerifyAuthoringProgram: VerifyAuthoringProgramRef = {
        programId:      'F-verify',
        programVersion: '1.0.0' as Semver,
      }
      const smokeVerifyInput: VerificationInput = {
        authoringProgram: smokeVerifyAuthoringProgram,
        userId,
        turnId,
        binding:          smokeVerifyBinding,
        target: {
          artifactRef:  generateId('art') as NodeId,
          artifactKind: 'smoke',
        },
        evidence:         null,
        preverifyInputs:  null,
      }
      const input: VerificationExecuteInput = {
        verificationInput: smokeVerifyInput,
        projectId,
        classification:    defaultClassification(),
      }
      const result = await executeVerificationFromInput(input)
      return programResultStream(result, encoder, { projectId: ctx.projectId })
    }

    // ── F-builder ───────────────────────────────────────────────────────────
    // executeBuild requires a jobId from a prior F-plan artifact.
    // No jobId available from a bare chat message. Typed rejection — D3.
    case 'F-builder': {
      return builderNoJobResponse(encoder, { projectId: ctx.projectId })
    }

    // ── Default ─────────────────────────────────────────────────────────────
    // Unhandled destination slice: log warn, return null → caller falls through to LLM.
    default: {
      console.warn(JSON.stringify({
        level: 'warn',
        event: 'chat.dispatch_unhandled',
        slice:  destination.slice,
        turnId,
      }))
      return null
    }
  }
}

// ── Decision-D-CHANNEL: ChannelKind → SourceChannel mapping ──────────────────
// ChannelKind (perimeter-standard.types) is the PS-level channel classification.
// SourceChannel (substrate.types) is the substrate write enum.
// These are distinct vocabularies at different abstraction layers.
// sprint-b1-shot-1: explicit map; mirrors toSourceChannel() in src/middleware.ts.
function channelKindToSourceChannel(channel: ChannelKind): SourceChannel {
  switch (channel) {
    case 'wearer-message':
    case 'wearer-query':
      return 'wearer'
    case 'ai-reply':
      return 'ai'
    case 'system-trigger':
    case 'scheduled-trigger':
      return 'cron'
    case 'integration-event':
      return 'integration-event'
    case 'internal-derivation':
      return 'internal-derivation'
    default:
      return 'wearer'
  }
}

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
  if (!session) {
    // Dispatch crossing — act disposition (auth rejection produces effect on wearer request).
    dispatchCrossing({
      dispatchId:       generateId('dx') as DispatchId,
      source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
      payload:          { rejection: 'unauthenticated' },
      channelTarget:    'wearer-message',
      dispositionClaim: 'act',
      scopeContext:     params.projectId,
      authorityContext: { level: 'L0', actor: 'wearer', source: null },
      correlationRef:   null,
      reversibility:    'irreversible',
      requestedAt:      Date.now() as EpochMs,
    })
    return new Response('Unauthenticated', { status: 401 })
  }

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const limit = getChatLimiter().check(session.userId, CHAT_RATE_LIMIT)
  if (!limit.allowed) {
    // Dispatch crossing — act disposition (rate-limit rejection produces effect on wearer request).
    dispatchCrossing({
      dispatchId:       generateId('dx') as DispatchId,
      source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
      payload:          { rejection: 'rate-limited' },
      channelTarget:    'wearer-message',
      dispositionClaim: 'act',
      scopeContext:     params.projectId,
      authorityContext: { level: 'L0', actor: 'wearer', source: null },
      correlationRef:   null,
      reversibility:    'irreversible',
      requestedAt:      Date.now() as EpochMs,
    })
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
  // CA3: wearer-side write (turnId shared with ai-side write below)
  // Generate turnId once per exchange; shared with ai-side write below.
  // Decision-D mapping applied: identities anchor userId + projectId + turnId.
  // Fire-and-forget: CA4 independence — write failure must not affect response path.
  const turnId    = generateId('turn')
  const arrivedAt = Date.now()

  const wearerWrite: SubstrateWriteInput = {
    userId: session.userId,
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
      // Decision-D-CHANNEL (sprint-b1-shot-1): ChannelKind (PS-level) ≠ SourceChannel (substrate-level).
      // session.resolvedChannel is ChannelKind ('wearer-message'); SubstrateWriteInput.source.channel
      // expects SourceChannel. Explicit map: 'wearer-message' → 'wearer'. Not a silent coerce.
      // Mapping mirrors src/middleware.ts toSourceChannel(). AI write remains 'ai' — correct, unaffected.
      // Side-Quest Shot 1 (Phase A): contentClass per substrate v1.8.3 A-24 default-derivation
      // rule applied at runtime via deriveContentClassFromChannel(channel).
      source: (() => {
        const ch = channelKindToSourceChannel(session.resolvedChannel)
        return { channel: ch, contentClass: deriveContentClassFromChannel(ch), scope: projectId as ScopeRef }
      })(),
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
        // Dispatch crossing — reference disposition (pipeline status rendered to wearer; sprint-13c-shot-1).
        dispatchCrossing({
          dispatchId:       generateId('dx') as DispatchId,
          source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
          payload:          { pipelineStatus: 'running' },
          channelTarget:    'wearer-message',
          dispositionClaim: 'reference',
          scopeContext:     projectId,
          authorityContext: { level: 'L0', actor: 'wearer', source: null },
          correlationRef:   null,
          reversibility:    'n/a',
          requestedAt:      Date.now() as EpochMs,
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

  // ── F-present context assembly — sprint-2-shot-6 ────────────────────────────
  // Migrated from direct threadQuery (sprint-11-shot-2) to present() service call.
  // operation: search-by-identity on session.userId, scope-filtered to projectId.
  // Chat Standard §5.6: substrate read failure → empty system prompt; LLM call not suppressed.
  // bound: maxNodes=20, maxThreads=40, walkBudget=100 (conservative starting values per spec §7 note 2).
  let contextRef: PresentView | null = null
  let systemPrompt = ''

  try {
    const presentIntent: PresentReadIntent = {
      intentId:        generateId('intent') as unknown as IntentIdRef,
      consumerRef:     'F-chat' as unknown as FrameworkRef,
      userId:          session.userId,
      scopeRef:        projectId as unknown as ScopeRef,
      operation:       { kind: 'search-by-identity' },
      parameter:       { kind: 'search-by-identity', identity: session.userId as IdentityRef },
      currentPosition: null,
      bound:           { maxNodes: 20, maxThreads: 40, walkBudget: 100 },
      provenance:      { consumerSlice: 'F-chat' as unknown as FrameworkRef, stampedAt: Date.now() },
    }
    const viewResult = await present(presentIntent)
    if (viewResult.ok && viewResult.data.composition.nodes.length > 0) {
      contextRef   = viewResult.data
      // System prompt assembly from PresentView: dominantSurfaceForm per node (identity string as fallback).
      // Equivalent to prior identity-join per record; richer when dominantSurfaceForm is distinct.
      const lines  = viewResult.data.composition.nodes.map(n => n.dominantSurfaceForm || n.identity)
      systemPrompt = lines.join('\n')
    }
  } catch (err) {
    // §5.6: substrate read failure — proceed with empty system prompt.
    console.error('[chat] present() context assembly failed', err instanceof Error ? err.message : err)
  }

  // ── F-router dispatch — sprint-11-shot-2 / sprint-13-shot-1 ─────────────────
  // Consult F-router before falling through to default LLM path.
  // Chat Standard CA5: REGISTRY_EMPTY and NO_MATCH both treated as no-match → fallthrough.
  // sprint-13-shot-1: matched destination dispatches to cycle program via dispatchToProgram().
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
    // Matched destination — sprint-13-shot-1: dispatch to cycle program.
    const dispatched = await dispatchToProgram(routeResult.data, {
      content,
      userId:    session.userId,
      projectId,
      turnId,
      modelId,
      encoder,
    })
    // null means unhandled destination slice — fall through to LLM.
    if (dispatched !== null) return dispatched
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
      // CA3: ai-side write (turnId matches wearer-side write above)
      // Fires after stream completes (full or partial on error).
      // CA4: fire-and-forget — write failure must not suppress already-streamed chunks.
      // Same turnId as wearer write; source.channel='ai'.
      const aiWrite: SubstrateWriteInput = {
        userId: session.userId,
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
          // Side-Quest Shot 1 (Phase A): contentClass per substrate v1.8.3 A-24.
          // 'ai' channel deterministically → 'wearer-life' per default-derivation rule.
          source: { channel: 'ai', contentClass: 'wearer-life', scope: projectId as ScopeRef },
        },
      }

      writeStateChange(aiWrite).catch((err: unknown) => {
        console.error(
          '[chat] ai substrate write failed',
          err instanceof Error ? err.message : err,
          streamErr ? { partial: true } : {}
        )
      })

      // Dispatch crossing — reference disposition (LLM response rendered to wearer).
      // Sprint-13c-shot-1: dispatch direction, memory loop complete.
      // dispatchCrossing is fire-and-forget internally (returns void).
      dispatchCrossing({
        dispatchId:       generateId('dx') as DispatchId,
        source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
        payload:          { responseLength: fullResponse.length },
        channelTarget:    'wearer-message',
        dispositionClaim: 'reference',
        scopeContext:     projectId,
        authorityContext: { level: 'L0', actor: 'wearer', source: null },
        correlationRef:   null,
        reversibility:    'n/a',
        requestedAt:      Date.now() as EpochMs,
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
