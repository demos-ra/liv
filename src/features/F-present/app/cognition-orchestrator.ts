// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/cognition-orchestrator.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-4 (R2b cognition write orchestrator)
//             sprint-COIN-I1 (composeAndWrite conformed to the core ReplyComposer;
//               read-front upgrader presentContext added; registerCognitionUpgrades()
//               — the single wire F-event-system bootstrap() calls to compose F-present
//               onto the two core seams, mirroring registerDomainPrograms())
//             registration-lifetime-unification (registerEnsureHook wired in
//               registerCognitionUpgrades — ensure slot filled at boot so request-time
//               reads trigger registration in any module instance)
//             registration-guard-ordering (registerEnsureHook removed — hook-slot
//               superseded by R3-import pattern; chat-contract calls registerCognitionUpgrades
//               directly via F-present R3 W-HOOK)
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    streamStructuredEmit                         @/features/F-ai-adapter/exec/structured-stream
//   W-ATOM  ChatMessage                                  @/features/F-ai-adapter/config/ai-adapter-config
//   W-FN    SCORE_EMIT_CONFIG/emissionFromStructured/splitEmission   ../domain/coin-score
//   W-FN    derive                                       ../domain/coin-read
//   W-FN    createDbPresentMarkStore                     ../exec/present-mark-store-db
//   W-FN    writeRawTurn                                 @/features/F-memory/exec/raw-turn-write   (F-present -> core)
//   W-FN    readTranscript                               @/features/F-memory/exec/transcript-read  (F-present -> core)
//   W-FN    registerReplyComposer/registerContextReader  @/core/domain/cognition-seam              (F-present -> core)
// deps:
//   R4  @/features/F-ai-adapter/exec/structured-stream
//   R1  ../domain/coin-score
//   R1  ../domain/coin-read
//   R4  ../exec/present-mark-store-db
//   R4  @/features/F-memory/exec/raw-turn-write
//   R4  @/features/F-memory/exec/transcript-read
//   core @/core/domain/cognition-seam
//
// ─────────────────────────────────────────────────────────────────────────────
// F-PRESENT is the OPTIONAL TOP LAYER of cognition. It composes onto the two core
// seams via registration (registerCognitionUpgrades, called once in bootstrap):
//   - write-compose (composeAndWrite): structured emit -> split -> place marks -> R2a
//   - read-front    (presentContext):  coin-read's structured present as LLM context
//
// DEPENDENCY DIRECTION: F-present -> core (writeRawTurn, readTranscript, the seam).
// Core NEVER imports F-present. The substrate gets only raw words+coords; marks live
// wholly in F-present's store — byte-identical / traceless at the write seam. Remove
// the bootstrap registration wire and F-present is gone with no core change.
// ─────────────────────────────────────────────────────────────────────────────

import { streamStructuredEmit }                          from '@/features/F-ai-adapter/exec/structured-stream'
import type { ChatMessage }                              from '@/features/F-ai-adapter/config/ai-adapter-config'
import { SCORE_EMIT_CONFIG, emissionFromStructured, splitEmission } from '@/features/F-present/domain/coin-score'
import { derive }                                        from '@/features/F-present/domain/coin-read'
import { createDbPresentMarkStore }                      from '@/features/F-present/exec/present-mark-store-db'
import { writeRawTurn }                                  from '@/features/F-memory/exec/raw-turn-write'
import { readTranscript }                                from '@/features/F-memory/exec/transcript-read'
import { registerReplyComposer, registerContextReader } from '@/core/domain/cognition-seam'
import type { ReplyComposer, ContextReader }             from '@/core/domain/cognition-seam'

// ── Write-compose upgrader (R2b) — conforms to the core ReplyComposer ──────────
// Compose one cognition turn: emit -> split -> core raw-word write (R2a) + place marks.
// Degrades gracefully: a malformed/empty emission -> empty result, no write, no throw.
export const composeAndWrite: ReplyComposer = async (input) => {
  // core hands a CognitionInput (systemPrompt + userContent); map to the provider
  // message shape HERE — that mapping is F-present's concern, kept out of core.
  const messages: ChatMessage[] = [
    ...(input.systemPrompt ? [{ role: 'system' as const, content: input.systemPrompt }] : []),
    { role: 'user' as const, content: input.userContent },
  ]

  // 1. structured emit — one structured request; the final chunk carries the object.
  let structured: unknown = null
  for await (const chunk of streamStructuredEmit(messages, input.modelId, SCORE_EMIT_CONFIG)) {
    if (chunk.type === 'final') structured = chunk.structured
  }

  // 2. narrow -> emission (malformed -> empty positions).
  const emission = emissionFromStructured(structured)
  if (emission.positions.length === 0) return { sc: 0, markCount: 0, text: '' }

  // 3. hand the raw words DOWN to core (R2a). The assigned substrate position IS sc.
  const words = emission.positions.map(p => ({ pos: p.pos, word: p.word }))
  const sc = await writeRawTurn({ who: input.who, words, userId: input.userId, scope: input.scope })

  // 4. split at sc for the marks; place them into F-present's store. splitEmission is
  //    the single source of mark geometry (its rebuilt rawTurn is already persisted).
  const { placedMarks } = splitEmission(emission, input.who, sc)
  await createDbPresentMarkStore().place(input.userId, placedMarks)

  // 5. render text for the UI (response words in order). Per the ratified Shot 1
  //    stream:false decision, delivered on completion; incremental surfacing deferred.
  const text = words.map(w => w.word).join(' ')
  return { sc, markCount: placedMarks.length, text }
}

// ── Read-front upgrader — conforms to the core ContextReader ───────────────────
// The structured present as the LLM's context: coin-read derives things + relations
// from the words (substrate) and marks (F-present store). Strict superset of the
// baseline flat transcript — the transcript is always included for continuity; the
// structured overlay is added when marks exist (sparse early, richer as it compounds).
export const presentContext: ContextReader = async (userId) => {
  const transcript = await readTranscript(userId)
  const store      = await createDbPresentMarkStore().read(userId)
  const d          = derive(transcript, store)

  const out: string[] = []
  if (d.things.size > 0) {
    out.push('PRESENT — things:')
    for (const [, t] of d.things)
      out.push(`  ${t.name}: ${t.stack.map(a => `${a.who === 'wearer' ? '\u2014' : a.who}@sc${a.sc}`).join(', ')}`)
    if (d.connections.length > 0) {
      out.push('PRESENT — relations:')
      for (const c of d.connections) out.push(`  ${c.peers.map(d.nameOf).join(' \u2194 ')} (${c.word})`)
    }
  }
  out.push('TRANSCRIPT (turns in position order):')
  for (const tt of transcript)
    out.push(`[${tt.sc}] (${tt.who === 'wearer' ? '\u2014' : tt.who}): ${tt.words.map(w => w.word).join(' ')}`)
  return out.join('\n')
}

// ── The single composition wire ────────────────────────────────────────────────
// Called from F-event-system bootstrap() (warm start) AND from chat-contract at
// request time via F-present's R3 W-HOOK (resolve-at-read). Registers both
// upgraders into the core seam. The seam's _ensureDone guard prevents duplicate
// registration when both paths fire in the same module instance.
// Deleting F-present: remove this call + the slice; registry stays empty;
// markCognitionEnsured never fires; core loop runs its baseline.
export function registerCognitionUpgrades(): void {
  registerReplyComposer(composeAndWrite)
  registerContextReader(presentContext)
}
