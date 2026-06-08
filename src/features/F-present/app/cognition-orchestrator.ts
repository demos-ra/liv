// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/cognition-orchestrator.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-4 (R2b cognition write orchestrator), foundation-group1 (exec imports → R3 surfaces: F-ai-adapter/R3 + F-memory/R3)
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
//             key-source-symmetry (input.apiKey threaded to streamStructuredEmit 4th arg —
//               wearer key resolves over env fallback; mirrors baseline streamAIResponse call)
//             coin-scoring-prompt (COIN_SCORING_PROMPT prepended to system message —
//               instruction first, present second; compose instruction always present)
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    streamStructuredEmit                         @/features/F-ai-adapter/contract/ai-contract       (Group 1: R3 surface)
//   W-ATOM  ChatMessage                                  @/features/F-ai-adapter/contract/ai-contract       (Group 2: R3 surface)
//   W-FN    SCORE_EMIT_CONFIG/emissionFromStructured/splitEmission/rekeyReply/verifyGrid/validateSharedUniverse   ../domain/coin-score
//   W-ATOM  COIN_MANUAL                                  ../config/coin-manual
//   W-FN    cutCells/joinCells                           @/features/F-memory/contract/substrate-contract     (G1 — Group 1: R3 surface)
//   W-FN    buildFactTable                               ../domain/fact-table
//   W-FN    resolveDimension                             ../domain/resolve-dimension
//   W-FN    weighDimension                               ../domain/chain-ping
//   W-FN    pivot                                        ../domain/pivot
//   W-FN    renderForest/renderSheet                     ../domain/render-present
//   W-ATOM  DEFAULT_FOREST_CUTOFF/DEFAULT_ANCESTORS_UP/DEFAULT_DESCENDANTS_DOWN   ../config/read-engine-types
//   W-FN    createDbPresentMarkStore                     ../exec/present-mark-store-db
//   W-FN    writeRawTurn                                 @/features/F-memory/contract/substrate-contract    (Group 1: R3 surface)
//   W-FN    readTranscript                               @/features/F-memory/contract/substrate-contract    (Group 1: R3 surface)
//   W-FN    registerReplyComposer/registerContextReader  @/core/domain/cognition-seam                      (F-present -> core)
// deps:
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R1  ../domain/coin-score
//   R1  ../domain/fact-table
//   R1  ../domain/resolve-dimension
//   R1  ../domain/chain-ping
//   R1  ../domain/pivot
//   R1  ../domain/render-present
//   R0  ../config/read-engine-types
//   R4  ../exec/present-mark-store-db
//   R3  @/features/F-memory/contract/substrate-contract
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

import { streamStructuredEmit }                          from '@/features/F-ai-adapter/contract/ai-contract'
import type { ChatMessage }                              from '@/features/F-ai-adapter/contract/ai-contract'
import { SCORE_EMIT_CONFIG, emissionFromStructured, splitEmission, rekeyReply, verifyGrid, validateSharedUniverse } from '@/features/F-present/domain/coin-score'
import { COIN_MANUAL } from '@/features/F-present/config/coin-manual'
import { buildFactTable }                                from '@/features/F-present/domain/fact-table'
import { resolveDimension }                              from '@/features/F-present/domain/resolve-dimension'
import { weighDimension }                                from '@/features/F-present/domain/chain-ping'
import { pivot }                                         from '@/features/F-present/domain/pivot'
import { renderForest, renderSheet }                     from '@/features/F-present/domain/render-present'
import { DEFAULT_FOREST_CUTOFF, DEFAULT_ANCESTORS_UP, DEFAULT_DESCENDANTS_DOWN } from '@/features/F-present/config/read-engine-types'
import type { Dimension, ThingId, ForestResult, SheetResult } from '@/features/F-present/config/read-engine-types'
import { createDbPresentMarkStore }                      from '@/features/F-present/exec/present-mark-store-db'
import { writeRawTurn, cutCells, joinCells } from '@/features/F-memory/contract/substrate-contract'
import { readTranscript }                                from '@/features/F-memory/contract/substrate-contract'
import { registerReplyComposer, registerContextReader } from '@/core/domain/cognition-seam'
import type { ReplyComposer, ContextReader }             from '@/core/domain/cognition-seam'

// ── Write-compose upgrader (R2b) — conforms to the core ReplyComposer ──────────
// Compose one cognition turn and score BOTH turns (pair-scoring):
//   manual (M1) + present → model emits its reply (positions) AND marks on the
//   person's existing cells (priorMarks) → reply cut by G1 (cutCells) → river records
//   the canonical reply cells → marks (both turns) re-keyed/placed → M4 verify →
//   M5 split → lens store. §FORK = A: the model self-cuts its reply coarsely; G1 owns
//   the canonical grid; splitEmission re-keys reply marks word→word-cell. The wearer
//   turn is already recorded by E1 (the spine) — composeAndWrite never re-records it;
//   it only marks the person's existing cells by coordinate.
// Degrades gracefully: a malformed/empty emission -> empty result, no write, no throw.
export const composeAndWrite: ReplyComposer = async (input) => {
  // System message: the dated COIN manual (M1) first (the complete fill rules), then
  // the present (input.systemPrompt). Instruction first so "below" is true.
  const systemContent = input.systemPrompt
    ? `${COIN_MANUAL}\n\n${input.systemPrompt}`
    : COIN_MANUAL
  const messages: ChatMessage[] = [
    { role: 'system' as const, content: systemContent },
    { role: 'user' as const, content: input.userContent },
  ]

  // 1. structured emit — one structured request; the final chunk carries the object.
  let structured: unknown = null
  for await (const chunk of streamStructuredEmit(messages, input.modelId, SCORE_EMIT_CONFIG, input.apiKey)) {
    if (chunk.type === 'final') structured = chunk.structured
  }

  // 2. narrow -> emission (malformed -> empty positions).
  const emission = emissionFromStructured(structured)
  if (emission.positions.length === 0) return { sc: 0, markCount: 0, text: '' }

  // 3. reply cut by G1 (the canonical grid — the model's coarse split is normalized).
  const { cells } = rekeyReply(emission.positions)

  // 4. hand the canonical reply cells DOWN to core (R2a). The assigned position IS sc.
  const sc = await writeRawTurn({ who: input.who, words: cells, userId: input.userId, scope: input.scope })

  // 5. split at sc: reply marks re-key word->word-cell; priorMarks home on the person's
  //    existing cells. splitEmission is the single source of mark geometry.
  const { placedMarks } = splitEmission(emission, input.who, sc)

  // 6. M4 VERIFY (newly wired — was dead code): invoked on every scored turn, after
  //    fill, before placement — (a) the grid is numbered once & contiguous (verifyGrid),
  //    and (b) every ref POSITIVELY resolves against the known universe (this reply's
  //    cells + the recorded transcript: coord-keys AND lowercased names), not merely
  //    dangler-dropped. Marks that fail either check do not persist.
  const known = new Set<string>()
  for (const c of cells) { known.add(`${input.who}:${sc}:${c.pos}`); known.add(c.word.toLowerCase()) }
  const transcript = await readTranscript(input.userId)
  for (const t of transcript) for (const w of t.words) { known.add(`${t.who}:${t.sc}:${w.pos}`); known.add(w.word.toLowerCase()) }
  const verified = verifyGrid(cells) ? validateSharedUniverse(placedMarks, known) : []

  // 7. place the verified marks into F-present's store.
  await createDbPresentMarkStore().place(input.userId, verified)

  // 8. render text for the UI — G1's inverse (F1), never an ad-hoc space-join.
  const text = joinCells(cells)
  return { sc, markCount: verified.length, text }
}

// ── Read-front upgrader — conforms to the core ContextReader ───────────────────
// The wake-default bundle the LLM wakes with: transcript + forest@ALL +
// sheet@focus@ALL, run through the read engine (buildFactTable -> resolveDimension
// -> weighDimension -> pivot -> render). The three are a REMOVABLE template layer,
// not engine structure — drop the bundle and pivot() still answers any explicit
// PivotConfig. show:{} = ALL mark-types (each op in its own typed sub-section);
// scoping is on the things (forest by weight, sheet by the focus line), never on
// mark-types. The defaults are a convenience surface, not a contract.
export const presentContext: ContextReader = async (userId) => {
  const transcript = await readTranscript(userId)
  const store      = await createDbPresentMarkStore().read(userId)

  const rows = buildFactTable(transcript, store)
  const dim  = resolveDimension(rows)
  weighDimension(dim, rows)

  const out: string[] = []
  // 1. transcript — the raw words of the line, always on (not a table call).
  out.push('TRANSCRIPT (turns in position order):')
  for (const tt of transcript)
    out.push(`[${tt.sc}] (${tt.who === 'wearer' ? '\u2014' : tt.who}): ${joinCells(tt.words)}`)

  // structure + state appear once marks exist (sparse early, richer as it compounds).
  if (dim.things.size > 0) {
    // 2. forest (structure) @ ALL mark-types, brightness-floor = DEFAULT_FOREST_CUTOFF.
    out.push('')
    out.push(renderForest(pivot({ view: 'forest', show: {}, weightCutoff: DEFAULT_FOREST_CUTOFF }, dim, rows) as ForestResult))
    // 3. sheet (state) anchored at the current focus @ ALL mark-types.
    const focus = currentFocus(dim)
    if (focus) {
      out.push('')
      out.push(renderSheet(pivot(
        { view: 'sheet', focus, show: {}, ancestorsUp: DEFAULT_ANCESTORS_UP, descendantsDown: DEFAULT_DESCENDANTS_DOWN },
        dim, rows,
      ) as SheetResult))
    }
  }
  return out.join('\n')
}

// current focus (a wake-default template knob, not engine logic): the most
// recently touched thing — highest member sc, then heaviest, then id. Overridable;
// the LLM re-anchors freely by calling pivot with any focus.
function currentFocus(dim: Dimension): ThingId | null {
  let best: ThingId | null = null
  let bestSc = -Infinity, bestW = -Infinity
  for (const t of dim.things.values()) {
    const sc = t.members.length ? t.members[t.members.length - 1].sc : -Infinity
    if (sc > bestSc || (sc === bestSc && (t.weight > bestW || (t.weight === bestW && (best === null || t.id < best))))) {
      best = t.id; bestSc = sc; bestW = t.weight
    }
  }
  return best
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
