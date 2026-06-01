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
//             registration-guard-ordering (W-HOOK resolve-at-read: registerCognitionUpgrades imported from F-present R3; ensureCognitionOnRequest() called at head of POST_message — mirrors route()→ensureDomainPrograms(); markCognitionEnsured from seam prevents double-registration when bootstrap also ran)
//             key-source-symmetry (providerForModel + getApiKey resolved at composer call site; apiKey threaded into CognitionInput → composeAndWrite → streamStructuredEmit; mirrors baseline chat-workflow key resolution; env fallback unchanged)
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
//   W-HOOK  registerCognitionUpgrades    F-present/contract/present-contract          (registration-guard-ordering: resolve-at-read, CC.01)
//   W-FN    providerForModel             F-ai-adapter/config/ai-adapter-config        (key-source-symmetry: model→provider resolution)
//   W-ATOM  ProviderId                   F-user-profile/config/provider-keys-config   (key-source-symmetry)
//   W-HOOK  getApiKey                    F-user-profile/contract/user-profile-contract (key-source-symmetry: wearer stored key, same source as baseline)
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
//   R3  @/features/F-present/contract/present-contract  (W-HOOK registerCognitionUpgrades)
//   R3  @/features/F-user-profile/contract/user-profile-contract  (W-HOOK getApiKey — key-source-symmetry)
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
import { writeRawTurn, tokenize }               from '@/features/F-memory/exec/raw-turn-write'
import { readTranscript }                        from '@/features/F-memory/exec/transcript-read'
import { getReplyComposer, getContextReader, markCognitionEnsured } from '@/core/domain/cognition-seam'
import type { CognitionResult }                  from '@/core/domain/cognition-seam'
import type { RawTurn }                          from '@/core/types/substrate-raw.types'
import { MODELS, providerForModel }               from '@/features/F-ai-adapter/config/ai-adapter-config'
import type { ProviderId }                         from '@/features/F-user-profile/config/provider-keys-config'
import { getApiKey }                               from '@/features/F-user-profile/contract/user-profile-contract'
import { createRateLimiter }                     from '@/core/domain/rate-limiter'
import { isPipelineActive }                      from '@/features/F-plan/contract/plan-contract'
import { route, ROUTER_ERROR_CODES }             from '@/features/F-router/contract/router-contract'
import { registerCognitionUpgrades }             from '@/features/F-present/contract/present-contract'
import { generateId }                            from '@/core/types/primitives'
import type { Semver, NodeId }                   from '@/core/types/primitives'
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

// ── Cognition ensure — resolve-at-read (registration-lifetime contract) ────────
// Chat-contract is the consumer of both F-router (route → ensureDomainPrograms)
// and F-present (registerCognitionUpgrades). Both registries follow the same
// ensure-on-read pattern: the consumer calls the provider's registration function
// once per module instance, before the first read. _cognitionEnsured is module-
// local (guards the call in this graph); markCognitionEnsured updates the seam's
// _ensureDone so duplicate calls from bootstrap in the same instance are no-ops.
let _cognitionEnsured = false
function ensureCognitionOnRequest(): void {
  if (_cognitionEnsured) return
  registerCognitionUpgrades()
  markCognitionEnsured()
  _cognitionEnsured = true
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

function serializeTranscript(turns: RawTurn[]): string {
  // COIN core-loop render: the cognition transcript as raw words in position order,
  // both sides visible. The substrate carries words only (structure is F-present
  // marks, not rendered into the loop's working context). Anchor/geometry derivation
  // does not run at this layer (that is coin-read, the F-present add-on surface).
  const lines = turns.map((t) => {
    const words = t.words.map(w => w.word).join(' ')
    return `[${t.sc}] (${t.who}): ${words}`
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

  // ── Cognition registration — resolve-at-read (W-HOOK, F-present R3) ────────
  // Ensures F-present's upgraders are registered in this module instance regardless
  // of whether bootstrap() ran here. _cognitionEnsured is module-local; the seam's
  // markCognitionEnsured sets _ensureDone to prevent duplicate registration if
  // bootstrap already ran in this instance. I1 intact: F-present absent → import
  // absent → call never reached → baseline. Mirror of route() → ensureDomainPrograms().
  ensureCognitionOnRequest()

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

  // COIN cognition rail (R2a): the wearer is a raw-word authoring channel. Their
  // message becomes a RawTurn — tokenize() → positioned verbatim words ('buidl' stays
  // 'buidl') — written by the core-owned raw-word write. No marks at the wearer turn:
  // marks are the LLM's structural reading, placed on its turn (and may point back at
  // these words). Structure → F-present, never the substrate. Authorship is NOT
  // hardcoded here — it is inherited from session.who (resolved once at the perimeter
  // from the channel), so the external-agent intake path authors as 'program', not
  // 'wearer'.
  const wearerWords = tokenize(content as string)

  // An empty wearer arrival is a 400 before any write — tokenize() synthesizes no
  // words where none were said.
  if (wearerWords.length === 0) {
    return new Response('Empty message', { status: 400 })
  }

  // sprint-beta-shot-1: awaited — sequences the commit before the substrate read.
  // F6: the intake write is the turn's purpose — if it did not land, the turn is a
  // lie (the transcript read would omit it). writeRawTurn throws only on a genuine
  // write failure (no assigned coordinate); fail the turn visibly rather than stream
  // a response against a substrate that never recorded the message.
  try {
    await writeRawTurn({ who: session.who, words: wearerWords, userId: session.userId, scope: projectId })
  } catch (err) {
    console.error('[chat] intake raw-word write failed', err instanceof Error ? err.message : err)
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

  // ── Core-loop read step — the read-front SEAM (I1) ─────────────────────────
  // BASELINE (F-present absent): read the words-bearing rows for this wearer as a
  // flat ordered transcript — userId-scoped (the substrate isolation floor), no tree,
  // no F-present. This is core-only and closes the loop on its own.
  // UPGRADE (F-present registered): the registered ContextReader supplies the
  // structured present (coin-read) as context instead. Resolved from the core seam —
  // chat-contract imports no F-present to do this.
  // Chat Standard §5.6: read failure → empty system prompt; LLM call not suppressed.
  let systemPrompt = ''

  try {
    const reader = getContextReader()
    if (reader) {
      systemPrompt = await reader(session.userId)
    } else {
      const scopeTurns = await readTranscript(session.userId)
      if (scopeTurns.length > 0) systemPrompt = serializeTranscript(scopeTurns)
    }
  } catch (err) {
    // §5.6: read failure — proceed with empty system prompt.
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

      // ── Cognition write — the write-compose SEAM (I1) ─────────────────────
      // BASELINE (F-present absent): get a plain reply (sendMessage), token-stream it
      // to the UI, and write it as raw words via R2a — words only, no marks. Core-only;
      // closes the loop on its own.
      // UPGRADE (F-present registered): the registered ReplyComposer runs the
      // structured emit → split → places marks → R2a and returns the same shape; its
      // reply is delivered on completion (the ratified Shot 1 stream:false consequence;
      // incremental surfacing deferred). Resolved from the core seam — chat-contract
      // imports no F-present. Either way the LLM response authors as 'llm' (the one
      // response-authorship site).
      let aiResult: CognitionResult | null = null
      let streamErr: string | null = null

      try {
        const composer = getReplyComposer()
        if (composer) {
          // Resolve wearer's stored provider key — mirrors chat-workflow's baseline key
          // resolution (providerForModel → getApiKey(userId, provider)). Same per-wearer,
          // per-provider DB source; reflects keys added/removed/changed automatically.
          // Passed as apiKey? on CognitionInput → composeAndWrite → streamStructuredEmit
          // 4th arg → resolveKey prefers it over the env fallback. If resolution fails,
          // apiKey stays undefined and transport falls back to env as today (graceful).
          const _provider = providerForModel(modelId) as ProviderId
          const _keyResult = await getApiKey(session.userId, _provider)
          const _apiKey = (_keyResult.ok && _keyResult.data) ? _keyResult.data : undefined

          aiResult = await composer({
            systemPrompt: systemPrompt || null,
            userContent:  content as string,
            modelId,
            who:          'llm',
            userId:       session.userId,
            scope:        projectId,
            apiKey:       _apiKey,
          })
          // upgrade path: not token-streamed — deliver the rendered reply once.
          if (aiResult.text.length > 0) send({ chunk: aiResult.text })
        } else {
          // baseline path: token-stream the plain reply, accumulate, then write R2a.
          let reply = ''
          for await (const chunk of sendMessage({
            projectId,
            content,
            modelId,
            userId:        session.userId,
            systemContext: systemPrompt || undefined,
          })) {
            reply += chunk
            send({ chunk })
          }
          const replyWords = tokenize(reply)
          const sc = replyWords.length > 0
            ? await writeRawTurn({ who: 'llm', words: replyWords, userId: session.userId, scope: projectId })
            : 0
          aiResult = { sc, markCount: 0, text: reply }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown_error'
        streamErr = message
        console.error('[chat] cognition write error', message)
        send({ error: message })
      }

      // F6 symmetry: the write (R2a, plus marks on the upgrade path) is inside the
      // composer/baseline above. A throw = the turn did not record its response →
      // terminal failure (done withheld, crossing suppressed). An empty-text result is
      // an honest non-write (no done, no crossing). Success with text → done + crossing.
      const aiCompleted = streamErr === null && aiResult !== null && aiResult.text.length > 0
      if (streamErr === null && aiResult !== null && aiResult.text.length === 0) {
        // honest non-write: nothing recorded, streamErr did not fire — no done.
      } else if (aiCompleted) {
        // Response delivered AND durably recorded (words + marks) — turn done.
        send({ done: true })
      }

      // Dispatch crossing — reference disposition (LLM response rendered to wearer).
      // Sprint-13c-shot-1: dispatch direction, memory loop complete. This is a
      // GOVERNANCE / system-introspection crossing — untouched by the cognition flip.
      // Suppressed when the turn did not complete (failed or empty).
      if (aiCompleted) {
        dispatchCrossing({
          dispatchId:       generateId('dx') as DispatchId,
          source:           { programId: 'F-chat', programVersion: '1.0.0' as Semver },
          payload:          { responseLength: aiResult?.text.length ?? 0 },
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
