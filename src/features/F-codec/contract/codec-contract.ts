// @liv-standard v1.5.1
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    w3-19-memory-exports, w3-20-admin-exports, phase-b-item2, 6.1-global-seed, 6.11-module-surface, 4b-discovery-unregister
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-INJECT encodeLLM()                   ←  F-codec/R2
//   W-INJECT registerCodecSubscriptions()  ←  F-codec/R2
//   W-INJECT processMessage()              ←  F-codec/R2 (codec-orchestrate)
//   W-INJECT executeMemoryAction()         ←  F-codec/R2 (codec-memory-actions)
//   W-INJECT getDecodedState()             ←  F-codec/R2 (codec-read)
//   W-INJECT seedGlobalNode()              ←  F-codec/R2 (codec-admin-actions)
//   W-INJECT ingestExternal()              ←  F-codec/R2 (codec-admin-actions)
//   W-INJECT removeNode()                  ←  F-codec/R2 (codec-admin-actions)
//   W-INJECT batchSeedAndTraverse()        ←  F-codec/R2 (codec-admin-actions)
//   W-INJECT unregisterDiscovery()         ←  F-codec/R2 (codec-discovery, 4b-discovery-unregister)
//   W-INJECT unregisterModule()            ←  F-codec/R2 (codec-registry, 4b-discovery-unregister)
// wires-out:
//   W-HOOK  encode()                →  F-chat (post-integration)
//   W-HOOK  processMessage()        →  F-chat (post-integration, replaces encode)
//   W-HOOK  registerSubscriptions() →  F-event-system/R2 (startup)
//   W-HOOK  unregisterDiscovery()   →  tests, controlled teardown (4b-discovery-unregister)
//   W-HOOK  unregisterModule()      →  tests, hot reload (4b-discovery-unregister)
// deps:
//   R2  ../app/codec-encode
//   R2  ../app/codec-subscribe
//   R2  ../app/codec-orchestrate
//   R2  ../app/codec-memory-actions
//   R2  ../app/codec-read
//   R2  ../app/codec-admin-actions
//   R2  ../app/codec-discovery
//   R2  ../app/codec-registry
// validated:  pending

// R3: thin wire. No logic. Public surface for F-codec.
// A3: typed boundaries — EncodeResult and CodecPipelineResult atoms are output types.
// F-chat will call processMessage() post-integration (replaces direct traverse+getPresentState).
// encode() retained for backward compatibility.
// registerSubscriptions() is called during startup for mechanical encode.

import type { Result } from '@/core/types/primitives'
import type { EncodeResult } from '../config/codec-types'
import type { CodecPipelineResult } from '../config/codec-routing-types'
import { encodeLLM } from '../app/codec-encode'
import { registerCodecSubscriptions } from '../app/codec-subscribe'
import { processMessage as _processMessage } from '../app/codec-orchestrate'

// ─── processMessage ──────────────────────────────────────────────────────────
// Full codec pipeline: encode → route → decode → dispatch.
// Single entry point for F-chat. Returns everything needed for LLM context
// injection (decodedContext.systemPromptBlock) and action dispatch (route).
// phase-b-item2: projectId/modelId added as optional pass-through for build routing.

export async function processMessage(
  content:    string,
  userId:     string,
  projectId?: string,
  modelId?:   string,
): Promise<Result<CodecPipelineResult>> {
  return _processMessage(content, userId, projectId, modelId)
}

// ─── encode ───────────────────────────────────────────────────────────────────
// Public entry point for conversation encode only (no routing/decode).
// Retained for backward compatibility. New consumers should use processMessage().

export async function encode(
  content: string,
  userId:  string,
): Promise<Result<EncodeResult>> {
  return encodeLLM(content, userId)
}

// ─── registerSubscriptions ────────────────────────────────────────────────────
// Wire mechanical encode to planner events via event bus.
// Called once during server startup.

export function registerSubscriptions(): void {
  registerCodecSubscriptions()
}

// ─── Re-exports for consumers ─────────────────────────────────────────────────
// A3: atoms only cross slice boundaries.
export type { EncodeResult, CognitivePrimitive, MutatingPrimitive, ClassifyResult } from '../config/codec-types'
export type { CodecPipelineResult, BindingDomain, RouteAction } from '../config/codec-routing-types'
export type { GlobalSeedInput, IngestionSource, GlobalAdminAction, GlobalGraphSummary } from '../config/codec-admin-types'

// ─── Memory actions (w3-19-memory-exports) ───────────────────────────────────
// A3: public surface for memory API routes. Routes import from contract, not app/.
export { executeMemoryAction } from '../app/codec-memory-actions'
export { getDecodedState, getArtifactsForMode } from '../app/codec-read'

// ─── Admin actions (w3-20-admin-exports) ──────────────────────────────────────
// A3: public surface for admin API routes. Routes import from contract, not app/.
export { seedGlobalNode, ingestExternal, removeNode, batchSeedAndTraverse, getModulesForClient } from '../app/codec-admin-actions'
export { classifyGraph } from '../domain/codec-decode'

// ─── Module registry — symmetric deregistration (4b-discovery-unregister) ────
// Directional symmetry: every register operation has a matching unregister.
// Exposed at R3 so test / hot-reload / teardown call sites use the contract,
// not codec-registry / codec-discovery directly.
export { unregisterDiscovery } from '../app/codec-discovery'
export { unregisterModule, clearRegistry } from '../app/codec-registry'
