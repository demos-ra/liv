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
//             sprint-wire-cognition Shot 1 (composeAndWrite delegates steps 2–7 to
//               recordScoredTurn — the shared scored-turn recorder; behavior byte-identical)
//             sprint-wire-cognition Shot 2 (presentContext: transcript section is the
//               session window; currentFocus relocated to ../domain/session-window — one
//               focus home)
//             sprint-wire-cognition 3R.1 (transcript renders plain — coordinates are
//               fetched, never rendered; per-word positions reverted)
//             sprint-wire-cognition 3R.5 (composeAndWrite renders the WEARER-TURN CELLS
//               data block into the scoring context — one render home; backward-compatible)
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    streamStructuredEmit                         @/features/F-ai-adapter/contract/ai-contract       (Group 1: R3 surface)
//   W-ATOM  ChatMessage                                  @/features/F-ai-adapter/contract/ai-contract       (Group 2: R3 surface)
//   W-FN    SCORE_EMIT_CONFIG/emissionFromStructured     ../domain/coin-score
//   W-ATOM  COIN_MANUAL                                  ../config/coin-manual
//   W-FN    recordScoredTurn                             ../app/scored-turn-recorder   (sprint-wire-cognition Shot 1)
//   W-FN    buildFactTable                               ../domain/fact-table
//   W-FN    resolveDimension                             ../domain/resolve-dimension
//   W-FN    weighDimension                               ../domain/chain-ping
//   W-FN    pivot                                        ../domain/pivot
//   W-FN    renderForest/renderSheet/renderTranscript    ../domain/render-present
//   W-FN    currentFocus/sessionWindow                   ../domain/session-window      (sprint-wire-cognition Shot 2)
//   W-ATOM  DEFAULT_FOREST_CUTOFF/DEFAULT_ANCESTORS_UP/DEFAULT_DESCENDANTS_DOWN   ../config/read-engine-types
//   W-FN    createDbPresentMarkStore                     ../exec/present-mark-store-db
//   W-FN    readTranscript                               @/features/F-memory/contract/substrate-contract    (Group 1: R3 surface)
//   W-FN    registerReplyComposer/registerContextReader  @/core/domain/cognition-seam                      (F-present -> core)
// deps:
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R1  ../domain/coin-score
//   R2  ../app/scored-turn-recorder
//   R1  ../domain/fact-table
//   R1  ../domain/resolve-dimension
//   R1  ../domain/chain-ping
//   R1  ../domain/pivot
//   R1  ../domain/render-present
//   R1  ../domain/session-window
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
import { SCORE_EMIT_CONFIG, emissionFromStructured }     from '@/features/F-present/domain/coin-score'
import { COIN_MANUAL } from '@/features/F-present/config/coin-manual'
import { recordScoredTurn }                              from '@/features/F-present/app/scored-turn-recorder'
import { buildFactTable }                                from '@/features/F-present/domain/fact-table'
import { resolveDimension }                              from '@/features/F-present/domain/resolve-dimension'
import { weighDimension }                                from '@/features/F-present/domain/chain-ping'
import { pivot }                                         from '@/features/F-present/domain/pivot'
import { renderForest, renderSheet, renderTranscript }   from '@/features/F-present/domain/render-present'
import { currentFocus, sessionWindow }                   from '@/features/F-present/domain/session-window'
import { DEFAULT_FOREST_CUTOFF, DEFAULT_ANCESTORS_UP, DEFAULT_DESCENDANTS_DOWN } from '@/features/F-present/config/read-engine-types'
import type { ForestResult, SheetResult }                from '@/features/F-present/config/read-engine-types'
import { createDbPresentMarkStore }                      from '@/features/F-present/exec/present-mark-store-db'
import { readTranscript }                                from '@/features/F-memory/contract/substrate-contract'
import { registerReplyComposer, registerContextReader } from '@/core/domain/cognition-seam'
import type { ReplyComposer, ContextReader }             from '@/core/domain/cognition-seam'

// ── Write-compose upgrader (R2b) — conforms to the core ReplyComposer ──────────
// Compose one cognition turn and score BOTH turns (pair-scoring):
//   manual (M1) + present → model emits its reply as PLAIN TEXT AND marks on its reply
//   (replyMarks, by word index) and on the person's existing cells (priorMarks) → reply
//   cut by G1 (cutReply = cutCells) → river records the canonical reply cells → marks
//   (both turns) placed → M4 verify → M5 split → lens store. §FORK = A: the reply text
//   is authoritative — G1 cuts it, joinCells renders it byte-identical (no re-join); the
//   model never numbers the grid, it references reply words by 1-based index. The wearer
//   turn is already recorded by E1 (the spine) — composeAndWrite never re-records it;
//   it only marks the person's existing cells by coordinate.
// Degrades gracefully: an empty/malformed reply -> empty result, no write, no throw.
// WEARER-TURN CELLS block (3R.5; one render home) — the person's just-written turn as
// <pos>:<word> pairs, so the model COPIES priorMark home coordinates instead of counting
// them off the (position-free) transcript. Word cells only (homes land on word cells).
function renderWearerCells(wearerTurn: { sc: number; cells: { pos: number; word: string }[] }): string {
  const pairs = wearerTurn.cells.map(c => `${c.pos}:${c.word}`).join(' | ')
  return `WEARER-TURN CELLS (for priorMarks homes — copy, never count): sc=${wearerTurn.sc} | ${pairs}`
}

// Assemble the scoring system message: manual (M1) first, then the present, then — when
// present — the wearer-cells data block (after the present, before userContent). Absent
// wearerTurn → byte-identical to the prior `${manual}\n\n${present}` form (backward-compat).
// Exported for the 3R.5 backward-compat gate test.
export function buildScoringContext(systemPrompt: string | null, wearerTurn?: { sc: number; cells: { pos: number; word: string }[] }): string {
  const base = systemPrompt ? `${COIN_MANUAL}\n\n${systemPrompt}` : COIN_MANUAL
  return wearerTurn ? `${base}\n\n${renderWearerCells(wearerTurn)}` : base
}

export const composeAndWrite: ReplyComposer = async (input) => {
  // System message: the dated COIN manual (M1) first (the complete fill rules), then the
  // present (input.systemPrompt), then the wearer-cells data block (3R.5). Instruction
  // first so "below" is true.
  const systemContent = buildScoringContext(input.systemPrompt, input.wearerTurn)
  const messages: ChatMessage[] = [
    { role: 'system' as const, content: systemContent },
    { role: 'user' as const, content: input.userContent },
  ]

  // 1. structured emit — one structured request; the final chunk carries the object.
  let structured: unknown = null
  for await (const chunk of streamStructuredEmit(messages, input.modelId, SCORE_EMIT_CONFIG, input.apiKey)) {
    if (chunk.type === 'final') structured = chunk.structured
  }

  // 2. narrow -> emission (malformed -> empty reply), then record (Shot 1): cut once →
  //    write → split → M4 verify → place → render. The recorder is the single scored-turn
  //    composition, shared with the demanded wire. Empty reply → honest non-write (the
  //    recorder guards it). Behavior is byte-identical to the prior inline steps 2–7.
  const emission = emissionFromStructured(structured)
  const { sc, markCount, text } = await recordScoredTurn(emission, input.who, input.userId, input.scope)
  return { sc, markCount, text }
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
  const focus = currentFocus(dim)

  const out: string[] = []
  // 1. transcript — the SESSION WINDOW (Shot 2: from where the current focus-line run
  //    began, to now), rendered with per-word cell positions (Shot 3). Always on (not a
  //    table call). Full history stays reachable via readTranscript; only the default
  //    windshield scope narrows. forest/sheet scope is unchanged this sprint.
  out.push(renderTranscript(sessionWindow(transcript, dim, rows, focus)))

  // structure + state appear once marks exist (sparse early, richer as it compounds).
  if (dim.things.size > 0) {
    // 2. forest (structure) @ ALL mark-types, brightness-floor = DEFAULT_FOREST_CUTOFF.
    out.push('')
    out.push(renderForest(pivot({ view: 'forest', show: {}, weightCutoff: DEFAULT_FOREST_CUTOFF }, dim, rows) as ForestResult))
    // 3. sheet (state) anchored at the current focus @ ALL mark-types.
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
