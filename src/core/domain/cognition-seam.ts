// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [core/domain]
// Built with LIV · livai.dev
// [src/core/domain/cognition-seam.ts]
// amended: registration-lifetime-unification (ensure-on-read; registerEnsureHook added;
//          getReplyComposer/getContextReader call ensureCognitionUpgrades at head;
//          resetCognitionSeam clears _ensureFn/_ensureDone)
//          registration-guard-ordering (hook-slot bridge superseded by R3-import pattern;
//          _ensureFn/_ensureFn removed; markCognitionEnsured added; get fns simplified —
//          registration is chat-contract's responsibility via F-present R3 W-HOOK)
//          key-source-symmetry (CognitionInput.apiKey? added — wearer's resolved provider
//          key threaded from chat-contract through to streamStructuredEmit; env fallback
//          unchanged as last resort)
//          sprint-wire-cognition 3R.5 (CognitionInput.wearerTurn? added — the cut wearer
//          cells threaded from chat-contract; optional, backward-compatible)
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
  apiKey?:      string  // wearer's resolved provider key; undefined → transport falls back to env
  // sprint-wire-cognition 3R.5: the wearer turn being replied to, already cut at the
  // write site — word cells only (homes land on word cells), positions canonical. The
  // composer renders these as the WEARER-TURN CELLS data block so the model COPIES
  // priorMark home coordinates instead of counting them. Optional → every existing
  // caller compiles unchanged; absent = no block rendered (byte-identical context).
  wearerTurn?:  { sc: number; cells: { pos: number; word: string }[] }
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

// ── Ensure-on-read (registration-lifetime contract) ───────────────────────────
// Registration is W-HOOK-called at boot (F-present's registerCognitionUpgrades()
// wired into bootstrap()). Bootstrap runs in one module instance; request handlers
// resolve a different instance where bootstrap never ran → registry reads empty.
//
// Fix (resolve-at-read via R3 hook): chat-contract imports registerCognitionUpgrades
// from F-present's R3 contract and calls it at the head of the request handler,
// before getReplyComposer()/getContextReader(). This puts F-present's registration
// in the chat request graph. The seam's _ensureDone guard prevents duplicate
// registration when bootstrap already ran in the same instance.
//
// I1 preserved: F-present absent → its R3 export absent → chat-contract's import
// absent → registerCognitionUpgrades never called → _composer/_reader stay null →
// getReplyComposer() returns null → baseline. The seam carries no F-present import.
let _ensureDone = false

// Called by chat-contract at request time (and by bootstrap at boot) to mark
// registration as done for this module instance. The seam never calls this itself —
// it only reads _ensureDone to short-circuit re-registration.
export function markCognitionEnsured(): void { _ensureDone = true }

// Null when no upgrader is registered (F-present absent) → caller uses its baseline.
export function getReplyComposer(): ReplyComposer | null { return _composer }
export function getContextReader(): ContextReader | null { return _reader }

// Test/boot hygiene — clear the registry (e.g. the delete-F-present smoke asserts
// the loop closes with this empty).
export function resetCognitionSeam(): void {
  _composer   = null
  _reader     = null
  _ensureDone = false
}
