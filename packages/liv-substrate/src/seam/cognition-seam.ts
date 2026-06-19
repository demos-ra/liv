// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/core/domain/cognition-seam.ts (d6d13c8).
//
// The fuse point — the registration seam where the ENGINE plugs onto the store
// without the store knowing the engine exists. This is the socket; absent any
// registration, the store runs alone and the present recomposes on arrival (Law 2).
//
// The store owns a BASELINE: a plain reply written as raw words, a flat-transcript
// read — both close the loop with NO engine import. The engine is an OPTIONAL top
// layer that, when registered here, UPGRADES each seam:
//   - write-compose: structured emit → split → place marks → raw write
//   - read-front:    the engine's structured present as the LLM's context
//
// Composition is by registration into this store-owned registry. The store imports
// nothing of the engine; the engine imports this module to register. Delete the
// engine and its single registration line → the registry stays empty → baseline →
// the loop still compiles and runs. That is what makes "the store stands alone"
// literally true on the write side.

import type { Who } from '../types/substrate-raw.types'

// What the loop hands a composer. Store-local — no engine types here.
export type CognitionInput = {
  systemPrompt: string | null
  userContent:  string
  modelId:      string
  who:          Who
  userId:       string
  scope:        string
  apiKey?:      string
  // The wearer turn being replied to, already cut at the write site — word cells
  // only, positions canonical. The recorder's priorMark SOURCE. Optional → every
  // caller compiles; absent = no priorMark resolution surface.
  wearerTurn?:  { sc: number; cells: { pos: number; word: string }[] }
}

// What a composer returns: the substrate position, the placed-mark count (0 for the
// baseline plain reply), and the rendered response text for the UI.
export type CognitionResult = { sc: number; markCount: number; text: string }

// The two optional upgraders.
export type ReplyComposer = (input: CognitionInput) => Promise<CognitionResult>
export type ContextReader = (userId: string) => Promise<string>

// ── Registry (module singleton) ────────────────────────────────────────────────
let _composer: ReplyComposer | null = null
let _reader:   ContextReader | null = null

export function registerReplyComposer(fn: ReplyComposer): void { _composer = fn }
export function registerContextReader(fn: ContextReader): void { _reader = fn }

// ── Ensure-on-read (registration-lifetime contract) ───────────────────────────
// Registration is called at boot (and, in the host app, resolve-at-read). The
// store only reads _ensureDone to short-circuit re-registration; it never calls
// this itself.
let _ensureDone = false

export function markCognitionEnsured(): void { _ensureDone = true }
export function isCognitionEnsured(): boolean { return _ensureDone }

// Null when no upgrader is registered (engine absent) → caller uses its baseline.
export function getReplyComposer(): ReplyComposer | null { return _composer }
export function getContextReader(): ContextReader | null { return _reader }

// Test/boot hygiene — clear the registry (the engine-absent smoke asserts the loop
// closes with this empty).
export function resetCognitionSeam(): void {
  _composer   = null
  _reader     = null
  _ensureDone = false
}
