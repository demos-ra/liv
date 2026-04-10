// @liv-standard v1.3
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  CodecPipelineResult, CODEC_ROUTING_EVENTS, RouteBuildPayload  ←  F-codec/R0
//   W-ATOM  ScopedGraphSet  ←  F-memory/R0
//   W-FN    encodeLLM()                   ←  F-codec/R2 (codec-encode)
//   W-FN    classifyDomain()              ←  F-codec/R1 (codec-routing)
//   W-FN    determineRoute()              ←  F-codec/R1 (codec-routing)
//   W-FN    classifyGraph()               ←  F-codec/R1 (codec-decode)
//   W-FN    renderForSystemPrompt()       ←  F-codec/R1 (codec-decode-render)
//   W-FN    getPresentState()             ←  F-memory/R3
//   W-FN    getGlobalGraph()              ←  F-memory/R3
//   W-FN    getUserGraph()                ←  F-memory/R3
//   W-FN    getGlobalArms()               ←  F-memory/R3
//   W-FN    getUserArms()                 ←  F-memory/R3
//   W-FN    emitEvent()                   ←  F-event-system/R3
// wires-out:
//   W-FN  processMessage()  →  F-codec/R3
// deps:
//   R0  ../config/codec-routing-types
//   R1  ../domain/codec-routing
//   R1  ../domain/codec-decode
//   R1  ../domain/codec-decode-render
//   R2  ./codec-encode
// validated:  pending

// R2: orchestration. The full codec pipeline.
// encode → classify domain → determine route → decode → dispatch.
// CA1: intent → state → delta. One message = one pipeline pass.
// A5: build dispatch via event bus — never imports F-planner.

import type { Result } from '@/core/types/primitives'
import type { ScopedGraphSet } from '@/features/F-memory/config/memory-types'
import type { CodecPipelineResult, RouteBuildPayload } from '../config/codec-routing-types'
import { CODEC_ROUTING_EVENTS } from '../config/codec-routing-types'
import { encodeLLM } from './codec-encode'
import { classifyDomain, determineRoute } from '../domain/codec-routing'
import { classifyGraph } from '../domain/codec-decode'
import { renderForSystemPrompt } from '../domain/codec-decode-render'
import {
  getPresentState,
  getGlobalGraph,
  getUserGraph,
  getGlobalArms,
  getUserArms,
} from '@/features/F-memory/contract/memory-contract'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Process Message ─────────────────────────────────────────────────────────
// The full codec pipeline for one user message.
// Single entry point — F-chat calls this instead of individual encode/traverse/getPresentState.
//
// Pipeline:
// 1. Encode: encodeLLM(content, userId) → EncodeResult
// 2. Get graph context: getPresentState(userId) for routing classification
// 3. Assemble scoped graphs + arms from F-memory contract
// 4. Classify domain: classifyDomain(encodeResult, presentState, allArms)
// 5. Determine route: determineRoute(encodeResult, domain)
// 6. Decode: classifyGraph(scopedGraphs, userArms, globalArms) → renderForSystemPrompt()
// 7. Dispatch: if route is dispatch-planner, emit codec.route-build event (A5)
// 8. Emit codec.route-complete
// 9. Return CodecPipelineResult

export async function processMessage(
  content: string,
  userId:  string,
): Promise<Result<CodecPipelineResult>> {
  try {
    // 1. Encode — classify primitive + label + traverse graph
    const encodeResult = await encodeLLM(content, userId)
    if (!encodeResult.ok) {
      return { ok: false, error: { code: 'CODEC_ENCODE_FAILED', message: encodeResult.error.message } }
    }

    // 2. Get present state — graph context for domain classification
    const presentState = getPresentState(userId)

    // 3. Assemble scoped graphs and arms from F-memory R3 contract
    // A3: typed boundary — ScopedGraphSet is an atom from F-memory/R0.
    const scopedGraphs: ScopedGraphSet = {
      user:   getUserGraph(userId),
      global: getGlobalGraph(),
    }
    const userArms   = getUserArms(userId)
    const globalArms = getGlobalArms()

    // Merge arms for domain classification — user arms take priority
    // but we check all arms for domain detection
    const allArms = [...userArms, ...globalArms]

    // 4. Classify domain — topological classification of where bind() landed
    // CA8: derived from graph structure, not authored table.
    const domain = classifyDomain(encodeResult.data, presentState, allArms)

    // 5. Determine route — (primitive, domain) → action
    // CA5: deterministic mapping, observable transition.
    const route = determineRoute(encodeResult.data, domain)

    // 6. Decode — classify graph structures + render for system prompt
    // CA8: graph topology → classified structures → structured text.
    const decoded = classifyGraph(scopedGraphs, userArms, globalArms)
    const decodedContext = renderForSystemPrompt(decoded)

    // 7. Dispatch — if build domain, emit event for F-planner subscription
    // A5: event bus only. F-codec never imports F-planner.
    if (route.type === 'dispatch-planner') {
      const payload: RouteBuildPayload = {
        primitive: route.primitive,
        label:     route.label,
        userId:    route.userId,
      }
      await emitEvent({
        type:    CODEC_ROUTING_EVENTS.ROUTE_BUILD,
        payload,
        slice:   'F-codec',
      })
    }

    // 8. Emit route-complete for observability
    await emitEvent({
      type:    CODEC_ROUTING_EVENTS.ROUTE_COMPLETE,
      payload: {
        primitive: encodeResult.data.primitive,
        domain,
        routeType: route.type,
        userId,
      },
      slice: 'F-codec',
    })

    // 9. Return full pipeline result
    return {
      ok: true,
      data: {
        encode:         encodeResult.data,
        route,
        decodedContext,
        domain,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] processMessage error:', message)
    return { ok: false, error: { code: 'CODEC_PIPELINE_FAILED', message } }
  }
}
