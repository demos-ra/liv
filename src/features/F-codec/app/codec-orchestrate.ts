// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-b-item2, phase-5.1-r1, phase-5.2, phase-5-audit, 6.3-6.4-registry, 6.5-6.6-routing, 6.9-6.13-modules
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  CodecPipelineResult, BuildConfirmation, CODEC_ROUTING_EVENTS, RouteBuildPayload  ←  F-codec/R0
//   W-ATOM  ScopedGraphSet  ←  F-memory/R0
//   W-ATOM  FrameworkModule  ←  F-codec/R0
//   W-HOOK  getPresentState()             ←  F-memory/R3
//   W-HOOK  getGlobalGraph()              ←  F-memory/R3
//   W-HOOK  getUserGraph()                ←  F-memory/R3
//   W-HOOK  getGlobalArms()               ←  F-memory/R3
//   W-HOOK  getUserArms()                 ←  F-memory/R3
//   W-HOOK  emitEvent()                   ←  F-event-system/R3
//   W-HOOK  handleBuildRequest()          ←  F-planner/R3 (planner-contract)
//   W-INJECT registerModule              ←  F-codec/R2 (codec-registry)
//   W-INJECT hasModule                   ←  F-codec/R2 (codec-registry)
//   W-INJECT getModule                   ←  F-codec/R2 (codec-registry)
//   W-INJECT executeDiscovery            ←  F-codec/R2 (codec-discovery)
//   W-INJECT executePlanning             ←  F-codec/R2 (codec-planning)
//   W-INJECT executeVerification         ←  F-codec/R2 (codec-verify)
//   W-ATOM   DISCOVERY_MODULE            ←  F-codec/R2 (codec-discovery)
//   W-ATOM   PLANNING_MODULE             ←  F-codec/R2 (codec-planning)
//   W-ATOM   VERIFY_MODULE               ←  F-codec/R2 (codec-verify)
//   W-ATOM   ModuleExecutionResult       ←  F-codec/R0
// wires-out:
//   W-HOOK  processMessage()  →  F-codec/R3
// deps:
//   R0  ../config/codec-routing-types
//   R0  @/features/F-memory/config/memory-types
//   R1  ../domain/codec-routing
//   R1  ../domain/codec-decode
//   R1  ../domain/codec-decode-render
//   R2  ./codec-encode
//   R2  ./codec-registry
//   R2  ./codec-discovery
//   R2  ./codec-planning
//   R2  ./codec-verify
//   R3  @/features/F-memory/contract/memory-contract
//   R3  @/features/F-event-system/contract/event-bus
//   R3  @/features/F-planner/contract/planner-contract
//   R5  @/core/types/primitives
// validated:  pending

// R2: orchestration. The full codec pipeline.
// encode → classify mode → determine route → decode → dispatch.
// CA1: intent → state → delta. One message = one pipeline pass.
// 6.5: classifyDomain now delegates to classifyMode (mode-aware, registry-gated).
// 6.6: determineRoute uses registry lookup. dispatch-module stub for future modules.
// phase-5.1-r1: Build dispatch via synchronous W-HOOK to F-planner/R3.
//   Event retained for observability only — no longer triggers pipeline launch.
//   A2: F-codec depends on F-planner (lower layer consumer pattern).
//   A5: cross-slice via R3 contract only.

import type { Result } from '@/core/types/primitives'
import type { ScopedGraphSet } from '@/features/F-memory/config/memory-types'
import type { CodecPipelineResult, RouteBuildPayload } from '../config/codec-routing-types'
import type { BuildConfirmation } from '../config/codec-routing-types'
import type { ModuleExecutionResult } from '../config/codec-module-types'
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
import { handleBuildRequest } from '@/features/F-planner/contract/planner-contract'

// ─── Build Module Registration (6.3/6.4) ─────────────────────────────────────
// Register the existing build pipeline as the generative framework module.
// Module-level side effect — runs once on first import.
// 6.6: registry is now live — classifyDomain queries hasModule, determineRoute queries getModule.

import { registerModule, hasModule, getModule } from './codec-registry'
import type { FrameworkModule } from '../config/codec-module-types'
import { DISCOVERY_MODULE, executeDiscovery } from './codec-discovery'
import { PLANNING_MODULE, executePlanning } from './codec-planning'
import { VERIFY_MODULE, executeVerification } from './codec-verify'

const BUILD_MODULE: FrameworkModule = {
  id:    'build',
  mode:  'generative',
  label: 'Builder',
  artifactSchema: {
    name:   'build-report',
    fields: [
      { key: 'featureIntent',  label: 'Feature intent',  required: false },
      { key: 'pipelineStatus', label: 'Pipeline status', required: true },
      { key: 'outcome',        label: 'Outcome',         required: false },
    ],
  },
}

registerModule(BUILD_MODULE)
registerModule(DISCOVERY_MODULE)
registerModule(PLANNING_MODULE)
registerModule(VERIFY_MODULE)

// ─── Process Message ─────────────────────────────────────────────────────────
// The full codec pipeline for one user message.
// Single entry point — F-chat calls this instead of individual encode/traverse/getPresentState.
//
// Pipeline:
// 1. Encode: encodeLLM(content, userId) → EncodeResult
// 2. Get graph context: getPresentState(userId) for mode classification
// 3. Assemble scoped graphs + arms from F-memory contract
// 4. Classify domain: classifyDomain → classifyMode (6.5, registry-gated)
// 5. Determine route: determineRoute (6.6, registry lookup)
// 6. Decode: classifyGraph(scopedGraphs, userArms, globalArms) → renderForSystemPrompt()
// 7. Dispatch: dispatch-planner → handleBuildRequest (W-HOOK)
//             dispatch-module → observability stub (wired by 6.9+6.10)
// 8. Emit codec.route-complete
// 9. Return CodecPipelineResult

export async function processMessage(
  content:    string,
  userId:     string,
  projectId?: string,
  modelId?:   string,
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

    // 4. Classify domain — mode-aware classification (6.5)
    // classifyDomain delegates to classifyMode, which is registry-gated.
    // content passed as 5th arg for keyword-signal fallback when label is null.
    const domain = classifyDomain(encodeResult.data, presentState, allArms, { hasModule }, content)

    // 5. Determine route — registry-driven lookup (6.6)
    let route = determineRoute(encodeResult.data, domain, { getModule })

    // 6. Decode — classify graph structures + render for system prompt
    // CA8: graph topology → classified structures → structured text.
    const decoded = classifyGraph(scopedGraphs, userArms, globalArms)
    const decodedContext = renderForSystemPrompt(decoded)

    // 7. Dispatch — if build domain, call planner confirmation (W-HOOK)
    // phase-5.1-r1: synchronous W-HOOK replaces fire-and-forget event.
    // handleBuildRequest called directly via R3 contract (same pattern as isPipelineActive).
    // Event retained for observability only — no pipeline launch here.
    if (route.type === 'dispatch-planner') {
      // 7a. Call planner confirmation (W-HOOK — synchronous R3 query)
      const buildResult = await handleBuildRequest({
        projectId: projectId ?? '',
        userId:    userId,
        message:   content,
        modelId:   modelId ?? '',
      })

      const confirmation: BuildConfirmation = buildResult.ok
        ? { response: buildResult.response, isConfirmation: buildResult.isConfirmation, jobId: buildResult.jobId }
        : { response: buildResult.error, isConfirmation: false, jobId: '' }

      // Attach confirmation to route
      route = {
        ...route,
        confirmation,
      }

      // 7b. Emit for observability (W-EVENT — fire-and-forget, no pipeline launch here)
      await emitEvent({
        type:    CODEC_ROUTING_EVENTS.ROUTE_BUILD,
        payload: {
          primitive: route.primitive,
          label:     route.label,
          userId:    route.userId,
          projectId: projectId ?? '',
          message:   content,
          modelId:   modelId ?? '',
        } satisfies RouteBuildPayload,
        slice: 'F-codec',
      })
    }

    // 7c. Dispatch-module — execute framework modules (6.9–6.13).
    // Execution only. Observability emission happens at step 8 (unconditional ROUTE_COMPLETE).
    if (route.type === 'dispatch-module') {
      const execResult = await dispatchModule(route.module, content, userId, projectId, modelId)

      if (execResult.ok) {
        route = {
          ...route,
          moduleResult: execResult.data,
        }
      } else {
        console.error('[F-codec] module execution failed:', execResult.error.message)
      }
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

// ─── Module Dispatch ─────────────────────────────────────────────────────────

async function dispatchModule(
  module:     FrameworkModule,
  content:    string,
  userId:     string,
  projectId?: string,
  modelId?:   string,
): Promise<Result<ModuleExecutionResult>> {
  switch (module.id) {
    case 'discovery':     return executeDiscovery(content, userId, projectId, modelId)
    case 'planning':      return executePlanning(content, userId, projectId, modelId)
    case 'verification':  return executeVerification(content, userId, projectId, modelId)
    default:
      return { ok: false, error: { code: 'UNKNOWN_MODULE', message: `no executor for module: ${module.id}` } }
  }
}
