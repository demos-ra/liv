// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [core/domain]
// Built with LIV · livai.dev
// [src/core/domain/cognition-seam.ts]
//
// The cognition composition seam — I1's modular boundary.
//
// The core loop (F-chat) owns a BASELINE: a plain reply written as raw words (R2a),
// a flat-transcript read. Both close the loop with NO F-present import. F-present is
// an OPTIONAL top layer that, when registered, UPGRADES each seam:
//   - write-compose: structured emit → split → place marks → R2a (composeAndWrite)
//   - read-front:    coin-read's structured present as the LLM's context
//
// Composition is by registration into this core-owned registry (the native LIV
// pattern — F-router registers destinations the same way, populated once in
// F-event-system bootstrap()). chat-contract imports ONLY this module; F-present
// imports this module to register; neither imports the other. Delete F-present and
// its single bootstrap registration line → the registry stays empty → baseline →
// the cognition loop still compiles and runs. That is what makes "delete F-present,
// the substrate stands" literally true on the write side.
//
// Runtime-in-core is consistent with core/domain/rate-limiter.ts (the precedent).
// The seam carries NO feature types: messages are passed as a core-local
// CognitionInput (systemPrompt + userContent), which the F-present composer maps to
// its provider message shape internally — so core imports no F-ai-adapter / F-present.

import type { Who } from '@/core/types/substrate-raw.types'

// What the core loop hands a composer. Core-local — no F-ai-adapter ChatMessage here.
export type CognitionInput = {
  systemPrompt: string | null
  userContent:  string
  modelId:      string
  who:          Who
  userId:       string
  scope:        string
}

// What a composer returns: the substrate position, the placed-mark count (0 for the
// baseline plain reply), and the rendered response text for the UI.
export type CognitionResult = { sc: number; markCount: number; text: string }

// The two optional upgraders.
export type ReplyComposer = (input: CognitionInput) => Promise<CognitionResult>
export type ContextReader = (userId: string) => Promise<string>

// ── Registry (module singleton — same lifetime model as F-router's registry) ────
let _composer: ReplyComposer | null = null
let _reader:   ContextReader | null = null

export function registerReplyComposer(fn: ReplyComposer): void { _composer = fn }
export function registerContextReader(fn: ContextReader): void { _reader = fn }

// Null when no upgrader is registered (F-present absent) → caller uses its baseline.
export function getReplyComposer(): ReplyComposer | null { return _composer }
export function getContextReader(): ContextReader | null { return _reader }

// Test/boot hygiene — clear the registry (e.g. the delete-F-present smoke asserts
// the loop closes with this empty).
export function resetCognitionSeam(): void { _composer = null; _reader = null }
