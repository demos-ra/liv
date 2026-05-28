// @liv-standard v1.5.1 amended sprint-11-shot-2 sprint-11-shot-6 sprint-11-shot-6a sprint-11-shot-6b sprint-12-shot-2 sprint-12-shot-4 sprint-13-shot-1 sprint-b1-shot-1 sprint-13c-shot-1  sprint-2-shot-6 present-rederive-shot-4 kind-a-v6 sprint-beta-shot-1 sprint-beta-shot-2 sweep-capture-gate
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
//             sprint-beta-shot-1 (race fix: wearer writeStateChange awaited so the turn's intent commits before the substrate read derives the context)
//             sprint-beta-fixround (F2: channelKindToSourceChannel gains the 'external-agent' case — connector-door chat-turn substrate writes now stamp source.channel='external-agent', agreeing with the Boundary crossing record)
//             fixround-substrate-write (F6: both substrate writes inspect the Result and are fatal — wearer write !ok → POST_message returns 500, the turn does not proceed; AI write !ok → terminal turn_failed event, done withheld, completion crossing suppressed; writeStateChange returns Result, never throws — no .catch())
//             fixround-core-loop-read-restore (F10: the core-loop read step reverted from present() to a direct substrate read — readScope(userId), serialized as a flat ordered transcript; present()/PresentView/serializePresentView removed from the core loop; F-present is an add-on surface, out of the loop)
//             sweep-capture-gate (substrate content gate, completed-structure.md v1.1: both substrate writes carry actual words via recognize() — the recognition floor (§5). Wearer write PRESERVED, content shape refined from envelope to neighbourhood. Envelope residue cleared — no 'chat-turn'/'chat-response' relation types, no 'agent' role, no userId/projectId/turnId/modelId in content.identities. serializeTranscript reauthored to word content. §2 finding closed: the wearer's meaning is no longer dropped.)
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
//   W-FN    readScope            F-memory/contract/substrate-contract  (F10: core-loop read step — replaces present())
//   W-FN    route                F-router/contract/router-contract     (message routing)
//   W-FN    generateId           core/types/primitives                 (turnId generation)
//   W-ATOM  SubstrateWriteInput  core/types/substrate.types
//   W-ATOM  StateChangeRecord    F-memory/contract/substrate-contract  (F10: substrate read record — serializeTranscript input)
//   W-ATOM  Relation             F-memory/contract/substrate-contract  (F10: transcript serialization)
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
//   CA1 — arrival validated at perimeter (auth ~498, rate-limit ~517, shape ~551)
//   CA2 — the substrate read assembles context before the LLM call (readScope, F10)
//   CA3 — dual write: wearer side (recognize+write ~582–615) + AI side (~759–773); same turnId variable
//   CA4 — both substrate writes inspect the Result and are fatal (F6 fixround):
//         wearer write awaited before the substrate read; !ok → POST_message 500, turn stops.
//         AI write awaited after stream; !ok → terminal turn_failed event, done withheld.
//         (sweep-capture-gate: empty-response AI write is skipped — null result,
//          not a failure; streamErr owns the failed turn, crossing suppressed.)
//   CA5 — F-router consulted; fallthrough to LLM on no-match (route ~693, REGISTRY_EMPTY/NO_MATCH ~682–708)
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
// sprint-11-shot-2 (substrate + router wired) — SUPERSEDED by sweep-capture-gate:
//   The original Decision-D mapping wrote envelope content (handles-only
//   identities + a hardcoded fixed-string relation type + 'agent' role) on
//   both sides. completed-structure.md v1.1 §6 verified this as identity-by-
//   itself: the substrate recorded that a turn crossed, not what was said.
//   That mapping is obsolete. The structural commitment it carried (dual
//   write, shared turnId addressing one exchange) is preserved.
//
// sweep-capture-gate (substrate content gate) — recognize()-based mapping:
//   Both writes carry actual words via recognize() (the recognition floor, §5).
//     Wearer write: content = recognize(content) — words become identities,
//       case-preserved, punctuation attached; one 'co-occurrence' relation
//       carries the within-utterance neighbourhood (IWRs = same words, role
//       'token'; modality 'declarative'; negation false). Empty arrival → 400
//       before the write. source.channel='wearer' (Decision-D-CHANNEL mapping,
//       unchanged), scope=projectId.
//     Ai write: content = recognize(fullResponse) — symmetric. Empty response
//       (stream errored, no text) → no write (null result), streamErr owns the
//       failed turn. source.channel='ai', contentClass='wearer-life',
//       scope=projectId (unchanged).
//     Routing/scoping (userId, projectId, turnId, modelId) is NOT in content —
//       it lives on first-class fields (SubstrateWriteInput.userId,
//       metadata.source.scope) and turn-local variables (turnId for dispatch
//       crossings; modelId for sendMessage / dispatch payload). The content
//       stream is pure content — no routing metadata in identity-recurrence reads.
//     Shared turnId still ensures both writes address the same exchange position.
//     The substrate read (readScope) is serialized directly into systemPrompt;
//     the context carried to the LLM is that string, not stored into SubstrateWriteInput.
//   CA4 (F6 fixround): both writes are awaited and inspected — wearer write
//     before the pipeline guard, ai write before the completion crossing.
//     A !ok on either fails the turn; neither is fire-and-forget.
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
import { recognize }                             from '../domain/recognize'
import { MODELS }                                from '@/features/F-ai-adapter/config/ai-adapter-config'
import { createRateLimiter }                     from '@/core/domain/rate-limiter'
import { isPipelineActive }                      from '@/features/F-plan/contract/plan-contract'
import { writeStateChange, readScope }            from '@/features/F-memory/contract/substrate-contract'
import type { StateChangeRecord }                 from '@/features/F-memory/contract/substrate-contract'
import { route, ROUTER_ERROR_CODES }             from '@/features/F-router/contract/router-contract'
import { generateId }                            from '@/core/types/primitives'
import type { Semver, NodeId }                   from '@/core/types/primitives'
import type { ChannelKind }                      from '@/core/types/perimeter-standard.types'
import type {
  SubstrateWriteInput,
  ScopeRef,
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
      // dispatchCrossing is async (returns Promise<void>); its internal substrate
      // write inspects the Result and logs on !ok (F6 fixround). Called as a
      // bare statement — fire-and-forget at this call site by design.
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
// sprint-b1-shot-1: explicit map; mirrors toSourceChannel() in src/proxy.ts.
// sprint-beta-fixround (F2): 'external-agent' case added — Beta Shot 3 added the
//   external-agent channel and updated proxy.ts toSourceChannel, but this
//   second mapper drifted. Without the case, a connector-door chat-turn write
//   hit default:'wearer' and mis-stamped channel provenance. The case mirrors
//   proxy.ts toSourceChannel exactly so the Boundary crossing record and the
//   chat-turn substrate write agree on 'external-agent'.
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
    case 'external-agent':
      return 'external-agent'
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

// ── StateChangeRecord[] → flat transcript — F10 ────────────────────────────
// The core loop reads the substrate (readScope) and renders its records as a
// plain ordered transcript for the LLM. The substrate is a flat ledger; this
// is a flat ordered rendering of it — each record in position order, tagged by
// source channel (wearer vs ai), showing its content (identities + relations).
// No tree, no stacks: that was F-present's PresentView shape. This renders the
// substrate's own records — fields are fields, not a borrowed structure.
//
// systemContext (chat-workflow.SendMessageInput) is typed `string` — the LLM
// API is text-in; the transcript is carried as text.
//
// Pure function: no I/O, no throw on well-formed input.

function serializeTranscript(records: StateChangeRecord[]): string {
  // sweep-capture-gate (§7.4): renderer reauthored for word content. Under
  // the one-co-occurrence-per-write floor, content.identities IS the
  // neighbourhood — the words said, in composition order. Relation rendering
  // is elided: the single co-occurrence relation's IWRs duplicate identities
  // verbatim, so the words list is the neighbourhood. This is the layer-1
  // (core loop) render — the LLM reads the conversation in order with both
  // sides' actual words visible. Anchor-derivation does not run at layer-1
  // (future-sprint scope, §10).
  const lines: string[] = records.map((rec) => {
    // source.channel distinguishes wearer turns from ai turns.
    const who   = rec.metadata.source.channel === 'ai' ? 'ai' : 'wearer'
    const words = rec.content.identities.join(' ')
    return `[${rec.metadata.position}] (${who}): ${words}`
  })

  return ['SUBSTRATE (turns in position order):', ...lines].join('\n')
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
  //
  // sprint-beta-shot-1 (race fix) + F6 fixround (fatality):
  //   The wearer write is awaited so the current turn's intent is durably in
  //   the substrate before the substrate read (below) assembles the context —
  //   the read must see this turn. F6 fixround: the Result is inspected and the write
  //   is fatal — on !ok, POST_message returns 500 and the turn does not
  //   proceed. A turn whose intent was not recorded must not stream a response
  //   against a substrate that never saw it. The ai-side write (below) is
  //   likewise awaited, inspected, and fatal — symmetric, the two halves of
  //   one turn share fatality.
  const turnId    = generateId('turn')
  const arrivedAt = Date.now()

  // sweep-capture-gate (§7.2): wearer write is PRESERVED — the wearer is an
  // authoring channel into the substrate equal in standing to the LLM. What
  // changes is content shape. The envelope ([userId, projectId, turnId] +
  // hardcoded 'chat-turn' relation) is replaced with recognize(content) —
  // the wearer's actual words, captured at highest fidelity, with one
  // co-occurrence relation carrying the within-utterance neighbourhood.
  // Routing/scoping (userId, projectId, turnId) is NOT in content: it lives
  // on first-class fields (SubstrateWriteInput.userId, metadata.source.scope)
  // and turn-local variables (turnId for dispatch crossings).
  const wearerContent = recognize(content)

  // SW1 rejects empty-identity writes; the caller handles it honestly. An
  // empty wearer arrival is a 400 before any write — recognize() does not
  // synthesize content where none was said.
  if (wearerContent.identities.length === 0) {
    return new Response('Empty message', { status: 400 })
  }

  const wearerWrite: SubstrateWriteInput = {
    userId: session.userId,
    content: wearerContent,
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

  // sprint-beta-shot-1: awaited — sequences the commit before the substrate read.
  // fixround-substrate-write (F6): the wearer write is the turn's purpose — if
  // it did not land, the turn is a lie (the substrate read would omit it). L0-ruled
  // fatal: inspect the Result, and on !ok fail the turn visibly rather than
  // proceeding to stream a response against a substrate that never recorded the
  // wearer's message.
  const wearerWriteResult = await writeStateChange(wearerWrite)
  if (!wearerWriteResult.ok) {
    console.error('[chat] wearer substrate write failed', wearerWriteResult.error.message)
    return new Response('Could not record your message — please try again.', { status: 500 })
  }

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

  // ── Core-loop read step — substrate read (F10) ─────────────────────────────
  // The core loop reads the substrate directly. F-present is an add-on surface,
  // not the loop's read step — sprint-2-shot-6 had hardwired present() in here,
  // which meant the LLM saw an empty PresentView and lost all prior turns.
  // readScope returns the substrate's own typed records (StateChangeRecord[]),
  // position-ascending, userId-scoped (the substrate isolation floor — not
  // projectId, not iterateAxis). The flat ledger is rendered as a flat ordered
  // transcript at this F-chat boundary — no tree, no stacks (that was
  // F-present's PresentView shape; this reads substrate records and renders
  // them).
  // Chat Standard §5.6: substrate read failure → empty system prompt; LLM call
  // not suppressed.
  let systemPrompt = ''

  try {
    // contentclass-coreloop: the core-loop read filters to 'wearer-life' —
    // cognition only. Apparatus crossing-records (now 'system-introspection',
    // declared at the Boundary) are excluded from the LLM's working context.
    const scopeResult = await readScope(session.userId, 'wearer-life')
    if (scopeResult.ok && scopeResult.data.length > 0) {
      systemPrompt = serializeTranscript(scopeResult.data)
    }
  } catch (err) {
    // §5.6: substrate read failure — proceed with empty system prompt.
    console.error('[chat] substrate read context assembly failed', err instanceof Error ? err.message : err)
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

      // Accumulate full response for the ai-side substrate write (F6 fixround:
      // the write is awaited, inspected, and fatal — see below).
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
        // fixround-substrate-write (F6): `done` is NOT sent here — it is sent
        // after the ai-side substrate write is confirmed below. The turn is
        // "done" only once the response is durably recorded.
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown_error'
        streamErr = message
        console.error('[chat] stream error', message)
        send({ error: message })
      }

      // ── Ai-side substrate write — sprint-11-shot-2 ─────────────────────────
      // CA3: ai-side write (turnId matches wearer-side write above).
      // fixround-substrate-write (F6): the AI response is Path B of the SAME
      // turn as the wearer write (Path A, fatal). If Path B is lost, the loop
      // half-writes — wearer message recorded, response not — and the next
      // turn's present is corrupt (a question with no answer). L0-ruled
      // symmetry: Path B is fatal too. The write is inspected; the `done`
      // event is sent only on ok; on !ok an error event is streamed so the
      // turn is visibly marked failed, not silently half-written.
      const aiContent = recognize(fullResponse)

      // sweep-capture-gate (§7.3): symmetric to the wearer write. The envelope
      // ([userId, projectId, turnId, modelId] + hardcoded 'chat-response'
      // relation) is replaced with recognize(fullResponse) — the LLM's actual
      // response words, with one co-occurrence relation carrying the
      // within-response neighbourhood. modelId is NOT in content (it is write
      // metadata, tracked via dispatch crossings' programVersion); turnId,
      // userId, projectId likewise live on first-class fields / turn-locals.
      //
      // Empty-response case (stream errored before any chunk, or no accumulated
      // text): no write. The existing streamErr path handles the failed turn.
      // The substrate never receives empty content — honest non-write for a
      // non-response. SW1 would reject it regardless.
      const aiWriteResult = aiContent.identities.length === 0
        ? null
        : await writeStateChange({
        userId: session.userId,
        content: aiContent,
        metadata: {
          time:   Date.now(),
          // Side-Quest Shot 1 (Phase A): contentClass per substrate v1.8.3 A-24.
          // 'ai' channel deterministically → 'wearer-life' per default-derivation rule.
          source: { channel: 'ai', contentClass: 'wearer-life', scope: projectId as ScopeRef },
        },
      })
      // fixround-substrate-write (F6, Item 1): the AI write is Path B of the
      // same turn as the wearer write (Path A, fatal) — ruled fatal, symmetric.
      // The response has already streamed; "fatal" cannot un-send it, so fatal
      // here means: the turn does not report success. On !ok a terminal
      // turn_failed event is sent (not an advisory one), `done` is withheld,
      // and the completion crossing is NOT dispatched — a turn that failed to
      // record its response did not complete, and emitting a normal
      // 'reference' crossing would re-assert success the turn does not have.
      // aiWriteResult is null in the empty-response case (no write attempted —
      // the stream errored before any text, streamErr owns the failed turn).
      // A null result is NOT a write failure: it is an honest non-write. The
      // dispatch crossing is still suppressed (no response completed), and no
      // turn_failed is emitted here — streamErr already streamed its error.
      const aiWriteFailed = aiWriteResult !== null && !aiWriteResult.ok
      if (aiWriteResult !== null && !aiWriteResult.ok) {
        console.error(
          '[chat] ai substrate write failed',
          aiWriteResult.error.message,
          streamErr ? { partial: true } : {},
        )
        if (!streamErr) {
          // Terminal failure — the turn failed, the stream closes on it.
          send({ error: 'turn_failed', reason: 'response_not_recorded' })
        }
      } else if (aiWriteResult !== null && !streamErr) {
        // Response streamed AND durably recorded — the turn is genuinely done.
        send({ done: true })
      }

      // Dispatch crossing — reference disposition (LLM response rendered to
      // wearer). Sprint-13c-shot-1: dispatch direction, memory loop complete.
      // fixround-substrate-write (F6, Item 1): suppressed when the AI write
      // failed OR was skipped (empty response) — the crossing records a
      // completed dispatch; a turn whose response was not recorded did not
      // complete.
      if (!aiWriteFailed && aiWriteResult !== null) {
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
      }

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
