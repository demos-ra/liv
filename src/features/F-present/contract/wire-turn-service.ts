// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine) + MCP-wire sibling
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/wire-turn-service.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    A1 (turn-services → one core: the agent-driven write turn factored to a single
//             home; the driver — JSON-RPC envelope vs REST envelope, error-code mapping — is the
//             per-surface variable; native rides the cognition-seam composer, not this core)
//             E1 (capture-at-submit, uniform with native): the wire now captures the wearer turn
//             at its ENTRY (UserPromptSubmit) via writeRawTurn — native's exact mechanism, fired
//             by the hook instead of the perimeter (captureWearerTurn). compose at Stop records
//             the reply + marks against the ALREADY-STORED wearer turn with wearer:{written}
//             (resolved from the latest wearer turn in the transcript) — it no longer re-carries
//             wearerText. The {text}-at-compose carry SURVIVES only for the no-lifecycle FALLBACK
//             (a client that cannot capture at submit), where it rides an honest AbsentCaptureFlag.
// slice:      F-present
// category:   Cognition
// layer:      R3
// wires-in:
//   W-FN    entitlementAdmits        @/features/F-entitlement/contract/entitlement-contract  (WP1 — the crossing decision)
//   W-ATOM  EntitlementStatus        @/features/F-entitlement/contract/entitlement-contract  (the stamped attribute, type-only)
//   W-FN    emissionFromStructured   ./present-contract   (the deliver/narrow gate — in-layer R3)
//   W-FN    recordScoredTurn         ./present-contract   (the record — reply + marks, returns WriteAck — in-layer R3)
//   W-ATOM  MarkSurfaceError         ./present-contract   (the loud, atomic reject — caught here, returned typed)
//   W-FN    presentOrDegraded        ./present-contract   (the honest ack — in-layer R3)
//   W-FN    readPresent              ./present-contract   (the deliver — capture-at-submit returns the fresh present)
//   W-ATOM  DegradedPresent          ./present-contract   (the named degraded payload, type-only)
//   W-ATOM  PRESENT_BUNDLES          ./present-contract   (R7 — the wire bundle: tables only)
//   W-FN    writeRawTurn             @/features/F-memory/contract/substrate-contract  (E1 — capture: store the wearer turn, native's exact mechanism)
//   W-FN    cutCells / isWordCell    @/features/F-memory/contract/substrate-contract  (E1 — cut the submitted prompt; resolve its word-cells, native's exact filter)
//   W-FN    readTranscript           @/features/F-memory/contract/substrate-contract  (E1 — recover the already-stored wearer turn at compose)
//   W-ATOM  RawWord                  @/core/types/substrate-raw.types (type-only)
// wires-out:
//   W-FN    recordWireTurn           →  surfaced via present-contract → F-mcp turn door + /api/compose (REST)
//   W-FN    captureWearerTurn        →  surfaced via present-contract → F-mcp summary door (capture-at-submit) + /api/compose (REST capture)
//   W-ATOM  WireTurnInput            →  F-mcp + REST (the per-surface raw-args carrier, type-only)
//   W-ATOM  WireTurnOutcome          →  F-mcp + REST (the discriminated outcome the driver maps to its envelope)
//   W-ATOM  WireCaptureInput         →  F-mcp + REST (the capture-at-submit raw-args carrier, type-only)
//   W-ATOM  WireCaptureOutcome       →  F-mcp + REST (the discriminated capture outcome the driver maps)
//   W-ATOM  WireCaptureMode          →  F-mcp + REST (enforced submit-capture vs the flagged no-lifecycle fallback)
// deps:
//   R3  @/features/F-entitlement/contract/entitlement-contract
//   R3  ./present-contract            (in-layer — the turn-services already homed here)
//   R3  @/features/F-memory/contract/substrate-contract  (the substrate surface — writeRawTurn/cutCells/isWordCell/readTranscript; the recorder reaches it the same way)
//   R0  @/core/types/substrate-raw.types
// validated:  pending
//
// ─────────────────────────────────────────────────────────────────────────────
// A1 — TURN-SERVICES → ONE CORE.  ·  E1 — CAPTURE ONCE, UNIFORM WITH NATIVE.
//
// The agent-driven write turn is one sequence, every surface derives it identically. E1 makes
// the wire CAPTURE the wearer turn the same way native does — once, at the turn's ENTRY — so the
// wire and native share ONE core: both capture via writeRawTurn and both record the reply via
// recordScoredTurn(..., wearer:{written}). The only difference is WHERE the entry-capture fires:
//   - native: the E1 perimeter pre-write (writeRawTurn at the chat spine), then composeAndWrite
//             marks against it with wearer:{written:{sc,wordCells}} — never re-recording the turn.
//   - wire:   captureWearerTurn fires at UserPromptSubmit (the wire's entry) and stores the turn
//             via the SAME writeRawTurn; compose at Stop recovers it (the latest wearer turn in
//             the transcript) and records the reply with wearer:{written} — never re-carrying it.
//
// THE WIRE TURN, E1 (the enforced path — two phases, one capture):
//   submit  captureWearerTurn (WP1 gate · writeRawTurn the wearer's words · deliver the present) —
//           the wearer turn is CUT + STORED ONCE here, native's exact mechanism. circumstance
//           (scope) is stamped, never sent.
//   Stop    recordWireTurn (WP1 gate · deliver/narrow the emission through the SAME gate native
//           uses · resolve the already-stored wearer turn as wearer:{written} · record the reply +
//           BOTH mark sets · honest present-or-degraded ack). NO wearerText re-carry — priorMarks
//           resolve against the stored wearer cells, identical to native.
//
// THE NO-LIFECYCLE FALLBACK (the only remaining {text} carry): a client WITHOUT lifecycle hooks
// cannot capture at submit — it can only call compose voluntarily. So compose still accepts the
// {text}-at-compose carry, but ONLY under WireCaptureMode 'compose-fallback', and it rides an
// honest AbsentCaptureFlag so the lost capture guarantee is visible (degraded-but-named, never
// silent). The ENFORCED path ('submit-captured') never carries text — the capture already happened.
//
// The DRIVER is the one variable (Mechanics §F): the JSON-RPC door maps the outcomes → JSON-RPC
// codes; the REST plug maps them → HTTP codes. Neither re-implements the sequence; both call
// captureWearerTurn (at submit) + recordWireTurn (at Stop) and translate the typed outcomes.
//
// HOME (A1 single-ownership): the turn-services (capture · deliver · record · ack) live in
// F-present; this unit is the one composition of them for the wire rail. It sits at R3 (in-layer)
// and reaches the substrate surface (F-memory R3 — writeRawTurn/readTranscript) exactly as the
// recorder does (the seal holds — no engine internal). NATIVE does NOT pass through this core — it
// rides the cognition-seam composer (composeAndWrite); this core is the WIRE rail's one home.
// ─────────────────────────────────────────────────────────────────────────────

import { grantAdmits, regionOfScope } from '@/features/F-entitlement/contract/entitlement-contract'
import type { GrantKey } from '@/features/F-entitlement/contract/entitlement-contract'
import { lockedResult, LOCKED_CTA_PRIVATE, type LockedResult } from './locked-result'
import {
  emissionFromStructured,
  recordScoredTurn,
  MarkSurfaceError,
  presentOrDegraded,
  readPresent,
  PRESENT_BUNDLES,
} from './present-contract'
import type { DegradedPresent, ReplyMarking } from './present-contract'
import { admitWriteRaw, cutCells, isWordCell, gather, mine } from '@/features/F-memory/contract/substrate-contract'
import type { RawWord } from '@/core/types/substrate-raw.types'

// The wire's raw turn payload — exactly the four fields the cognition-turn contract carries (the
// wearer's words inline + the agent's emission). Every field is `unknown`: this core does NOT
// validate the SHAPE — emissionFromStructured narrows reply/marks, recordScoredTurn surface-checks
// the marks loud, and the recorder's wearerText guard absorbs a non-string. The driver hands the
// transport-validated args straight through (the door owns only wire-hygiene; the core is the sole
// shape validator). E1: on the ENFORCED path wearerText is unused (the wearer turn is already
// stored at submit); it is read ONLY under the 'compose-fallback' capture mode (below).
export type WireTurnInput = {
  wearerText: unknown
  reply:      unknown
  replyMarks: unknown
  priorMarks: unknown
}

// The capture-at-submit payload — the wearer's words crossing the boundary at the turn's ENTRY
// (the wire's UserPromptSubmit). `unknown`: this core is the sole shape validator (a non-string is
// absorbed → empty, never thrown), symmetric with the recorder's wearerText guard.
export type WireCaptureInput = {
  wearerText: unknown
}

// The identity + circumstance the core stamps onto the turn — read from the perimeter session by
// the driver and handed in. userId is ALWAYS the session's (an agent cannot write to another
// wearer's substrate); scope is the stamped circumstance (the connection), never sent by the wire.
export type WireTurnIdentity = {
  userId:              string
  scope:               string
  grantKey:            GrantKey
}

// E1 — the wire's capture MODE, the one axis that decides where the wearer turn was captured:
//   - 'submit-captured' (the ENFORCED path, the default): the wearer turn was already stored at
//     submit (captureWearerTurn). compose resolves it as wearer:{written}; wearerText is unused.
//   - 'compose-fallback' (the no-lifecycle FALLBACK): a client without hooks could not capture at
//     submit, so compose captures the wearer turn from its inline wearerText ({text}) and rides the
//     honest AbsentCaptureFlag. This is the ONLY remaining {text}-at-compose carry.
export type WireCaptureMode =
  | { mode: 'submit-captured' }
  | { mode: 'compose-fallback'; absentCapture: AbsentCaptureFlag }

// The honest fail flag (mirrors A3's AbsentCaptureFlag — the L3 adapter's no-lifecycle binding
// hands it in). Carried on a fallback-recorded turn so the absent capture guarantee is visible
// downstream (degraded-but-named), never silently dropped.
export type AbsentCaptureFlag = { absentCapture: boolean; reason: string }

// The one discriminated outcome the driver maps to its envelope. The core never throws for a
// turn-shaped reason — every honest end-state is a tag:
//   - 'denied'           — WP1: the crossing is not admitted (the recorder was never reached)
//   - 'invalid-testimony'— a false mark claim (word-index ↔ surface mismatch): loud + atomic,
//                          nothing persisted; the message is law-named for the agent to re-emit
//   - 'present'          — the happy path: a landed write, the fresh present rendered (text)
//   - 'degraded'         — the honest ack (DegradedPresent): a committed-but-unrendered write
//                          (ok:true), or a dropped no-write (ok:false) — never masked
export type WireTurnOutcome =
  | { kind: 'locked';            locked: LockedResult }
  | { kind: 'invalid-testimony'; message: string }
  | { kind: 'present';           present: string }
  | { kind: 'degraded';          degraded: DegradedPresent }

// The discriminated capture-at-submit outcome the driver maps to its envelope:
//   - 'denied'   — WP1: the crossing is not admitted (nothing stored)
//   - 'captured' — the wearer turn was stored (sc) AND the fresh present delivered (capture+deliver)
export type WireCaptureOutcome =
  | { kind: 'locked';   locked: LockedResult }
  | { kind: 'captured'; sc: number; present: string }

// The per-region cta values-list is DEFERRED to L0; only PRIVATE is pinned (locked-result.ts). Until
// the list lands, a locked region relays the pinned PRIVATE line (the conversion cta). Flagged.
const REGION_CTA: Record<string, string> = { PRIVATE: LOCKED_CTA_PRIVATE }
function ctaFor(region: string): string {
  return REGION_CTA[region] ?? LOCKED_CTA_PRIVATE
}

// The injected substrate seam (A4 — isolated execution), mirroring the recorder's deps. The
// capture (writeRawTurn), the present deliver (readPresent), and the stored-wearer recovery
// (readTranscript) are INJECTED; production callers omit deps and get the live wires, tests inject
// stubs to run DB-free and to COUNT the single capture write. The recorder owns its own deps seam;
// this is the seam for the wire's capture-at-submit + stored-wearer resolution.
export type WireCaptureDeps = {
  writeRawTurn:   (input: { who: 'wearer'; words: RawWord[]; userId: string; scope: string; grantKey: GrantKey }) => Promise<number>
  cutCells:       (text: string) => RawWord[]
  isWordCell:     (word: string) => boolean
  readTranscript: (userId: string) => Promise<{ sc: number; who: 'wearer' | 'llm' | 'program'; words: RawWord[] }[]>
  readPresent:    (userId: string, bundle: typeof PRESENT_BUNDLES.wire) => Promise<string>
}
function defaultCaptureDeps(): WireCaptureDeps {
  // the production capture write routes through the F-009 seam (admit + writeRawTurn); the dep key
  // stays `writeRawTurn` (its shape) so tests inject their own. Pure indirection (admits today).
  return { writeRawTurn: admitWriteRaw, cutCells, isWordCell, readTranscript: (userId: string) => gather(mine(userId)), readPresent }
}

// captureWearerTurn — E1's CAPTURE-AT-SUBMIT (the wire's entry, UserPromptSubmit). It stores the
// wearer turn via writeRawTurn — NATIVE'S EXACT MECHANISM (the perimeter pre-write), just fired by
// the hook — then delivers the fresh present (capture + deliver, one phase). The wearer turn is CUT
// + STORED ONCE, here; compose at Stop never re-records it (it resolves wearer:{written} below).
// WP1 gates the crossing first (a capture is the wearer's words crossing the write boundary). A
// non-string wearerText is absorbed → empty (the sole shape validator); an all-punctuation arrival
// still writes (the recorder's empty-reply guard is the reply's concern, not the wearer turn's).
export async function captureWearerTurn(
  input:    WireCaptureInput,
  identity: WireTurnIdentity,
  deps:     WireCaptureDeps = defaultCaptureDeps(),
): Promise<WireCaptureOutcome> {
  // (WP1) the crossing decision — a capture is the wearer's words crossing the write boundary.
  const region = regionOfScope(identity.scope)
  if (!grantAdmits(identity.grantKey, region, 'write')) {
    return { kind: 'locked', locked: lockedResult(region, ctaFor(region)) }
  }

  // cut + store the wearer turn — the SAME writeRawTurn native fires at the perimeter (the full
  // cut is stored; the reply's recorder resolves word-cells from it at Stop). who:'wearer', scope
  // the stamped circumstance. ONE write — the wearer turn is cut + stored ONCE, here.
  const text = typeof input.wearerText === 'string' ? input.wearerText : ''
  const wearerCells = deps.cutCells(text)
  const sc = await deps.writeRawTurn({ who: 'wearer', words: wearerCells, userId: identity.userId, scope: identity.scope, grantKey: identity.grantKey })

  // deliver — set the fresh present in front of the model (the wire bundle, R7: tables only).
  const present = await deps.readPresent(identity.userId, PRESENT_BUNDLES.wire)
  return { kind: 'captured', sc, present }
}

// latestWearerWritten — recover the wearer turn captureWearerTurn stored at submit: the LATEST
// who:'wearer' turn in the transcript, as wearer:{written:{sc,wordCells}}. Word-cells are filtered
// with isWordCell — NATIVE'S EXACT FILTER (chat-contract's wearerCells.filter(isWordCell)) — so the
// recorder receives the same shape native hands composeAndWrite. Absent (no wearer turn ever
// stored) → null: the enforced path then has nothing to mark against (a no-capture compose).
async function latestWearerWritten(userId: string, deps: WireCaptureDeps): Promise<{ sc: number; wordCells: RawWord[] } | null> {
  const transcript = await deps.readTranscript(userId)
  for (let i = transcript.length - 1; i >= 0; i--) {
    const t = transcript[i]
    if (t.who === 'wearer') {
      return { sc: t.sc, wordCells: t.words.filter(c => deps.isWordCell(c.word)) }
    }
  }
  return null
}

// recordWireTurn — the one wire turn-service (compose, at Stop). Both agent-driven write surfaces
// (the MCP `compose` door and the REST /api/compose plug) call this; the driver maps the returned
// WireTurnOutcome to its own envelope.
//
// E1: it records the REPLY + BOTH mark sets against the wearer turn ALREADY STORED at submit — NO
// wearerText re-carry on the enforced path. The capture mode decides the wearer source:
//   - 'submit-captured' (enforced, default): resolve the stored wearer turn → wearer:{written},
//     EXACTLY native's composeAndWrite. priorMarks resolve against the stored wearer cells.
//   - 'compose-fallback' (no-lifecycle): the wearer turn was NOT captured at submit, so capture it
//     here from input.wearerText → wearer:{text} (the ONLY remaining {text} carry), flagged honest.
// `replyMarking` (inline-marking Touch 2) is the wire's reply-marking FORMAT — it comes from the
// wire's SITUATION (MCP_SITUATION.replyMarking), passed by the driver, NEVER a surface name. Absent
// ≡ 'separate' (byte-identical to today); the wire flips per-agent in the migration (§3), at which
// point the driver hands 'inline' here and the recorder consumes the parsed inline spans.
export async function recordWireTurn(
  input:       WireTurnInput,
  identity:    WireTurnIdentity,
  capture:     WireCaptureMode = { mode: 'submit-captured' },
  replyMarking: ReplyMarking = 'separate',
  deps:        WireCaptureDeps = defaultCaptureDeps(),
): Promise<WireTurnOutcome> {
  // (WP1) the crossing decision — before the recorder is ever reached. Reads the stamped
  // attribute, re-resolves nothing (PA-I). Default 'trial' (no provider) → admit; dormant until
  // a provider feeds 'lapsed'. A gate, not a meter.
  const region = regionOfScope(identity.scope)
  if (!grantAdmits(identity.grantKey, region, 'write')) {
    return { kind: 'locked', locked: lockedResult(region, ctaFor(region)) }
  }

  // deliver/narrow — the same gate the native path uses (one gate, no copy). The fields ride as
  // unknown; emissionFromStructured narrows reply/marks, a malformed emission → empty reply.
  const emission = emissionFromStructured({
    reply: input.reply, replyMarks: input.replyMarks, priorMarks: input.priorMarks,
  })

  // E1 — resolve the WEARER SOURCE per capture mode. The ENFORCED path mirrors native exactly:
  // the wearer turn was stored at submit, so hand it as wearer:{written} (resolved from the
  // transcript's latest wearer turn) — never re-carrying its text. The FALLBACK path (no-lifecycle
  // client) is the ONLY place {text}-at-compose survives — flagged, not silent.
  let wearer: { written: { sc: number; wordCells: RawWord[] } } | { text: unknown }
  if (capture.mode === 'submit-captured') {
    // native's wearer:{written} — resolved from the stored wearer turn. Absent (nothing captured)
    // → empty cells: priorMarks (if any) then fail LOUD via the recorder's surface-check, never
    // silently — the same loud failure native gets from an empty wearer turn.
    const stored = await latestWearerWritten(identity.userId, deps)
    wearer = { written: stored ?? { sc: 0, wordCells: [] } }
  } else {
    // the no-lifecycle FALLBACK — capture-at-compose from the inline text. This is the only
    // remaining {text} carry; the AbsentCaptureFlag (capture.absentCapture) made it honest at the
    // adapter (the loss of the per-turn capture guarantee is named, not hidden).
    wearer = { text: input.wearerText }
  }

  // record — the reply + BOTH mark sets. who:'llm' (the agent), userId/scope from the stamped
  // identity (never the body). A false claim (surface mismatch) throws MarkSurfaceError — loud +
  // atomic, nothing persisted; caught HERE and returned as a typed outcome so the driver names it
  // without re-importing the error class.
  let ack
  try {
    ack = await recordScoredTurn(emission, 'llm', identity.userId, identity.scope, identity.grantKey, wearer, replyMarking)
  } catch (err) {
    if (err instanceof MarkSurfaceError) return { kind: 'invalid-testimony', message: err.message }
    throw err
  }

  // ack — the honest post-write present-or-degraded (§1b). A pass-through present (string) is the
  // happy path; otherwise the honest DegradedPresent (committed-but-unrendered stands; dropped
  // no-write reported not-persisted). The bundle is the WIRE bundle (R7: tables only).
  const out = await presentOrDegraded(identity.userId, PRESENT_BUNDLES.wire, ack)
  return typeof out === 'string'
    ? { kind: 'present', present: out }
    : { kind: 'degraded', degraded: out }
}
