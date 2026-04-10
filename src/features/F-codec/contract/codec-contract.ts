// @liv-standard v1.3
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    w3-19-memory-exports, w3-20-admin-exports
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-FN  encodeLLM()                   ←  F-codec/R2
//   W-FN  registerCodecSubscriptions()  ←  F-codec/R2
//   W-FN  processMessage()              ←  F-codec/R2 (codec-orchestrate)
//   W-FN  executeMemoryAction()         ←  F-codec/R2 (codec-memory-actions)
//   W-FN  getDecodedState()             ←  F-codec/R2 (codec-read)
//   W-FN  seedGlobalNode()              ←  F-codec/R2 (codec-admin-actions)
//   W-FN  ingestExternal()              ←  F-codec/R2 (codec-admin-actions)
//   W-FN  removeNode()                  ←  F-codec/R2 (codec-admin-actions)
// wires-out:
//   W-HOOK  encode()                →  F-chat (post-integration)
//   W-HOOK  processMessage()        →  F-chat (post-integration, replaces encode)
//   W-FN    registerSubscriptions() →  F-event-system/R2 (startup)
// deps:
//   R2  ../app/codec-encode
//   R2  ../app/codec-subscribe
//   R2  ../app/codec-orchestrate
//   R2  ../app/codec-memory-actions
//   R2  ../app/codec-read
//   R2  ../app/codec-admin-actions
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

export async function processMessage(
  content: string,
  userId:  string,
): Promise<Result<CodecPipelineResult>> {
  return _processMessage(content, userId)
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
export { getDecodedState } from '../app/codec-read'

// ─── Admin actions (w3-20-admin-exports) ──────────────────────────────────────
// A3: public surface for admin API routes. Routes import from contract, not app/.
export { seedGlobalNode, ingestExternal, removeNode } from '../app/codec-admin-actions'
export { classifyGraph } from '../domain/codec-decode'
