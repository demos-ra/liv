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
//             inline-marking Touch 3 (native delivery wired to the R0-leaf manual): the COIN_MANUAL
//               constant import becomes projectManual(opts); buildScoringContext computes opts from
//               NATIVE_SITUATION — inline (replyMarking==='inline'), includeWearerText:false, and the
//               field list Object.keys(projectEmissionSchema(NATIVE_SITUATION).properties). coin-manual
//               is a strict R0 leaf (imports nothing from R1); the schema lives HERE (R2→R1 downward),
//               so manual + schema are paired at the caller and cannot drift. Native is the inline form.
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    streamStructuredEmit                         @/features/F-ai-adapter/contract/ai-contract       (Group 1: R3 surface)
//   W-ATOM  ChatMessage                                  @/features/F-ai-adapter/contract/ai-contract       (Group 2: R3 surface)
//   W-FN    SCORE_EMIT_CONFIG/emissionFromStructured     ../domain/coin-score
//   W-FN    projectManual                                ../config/coin-manual   (inline-marking Touch 3 — the R0-leaf manual rendered from primitives the caller computes)
//   W-FN    projectEmissionSchema                        ../domain/coin-score    (the native field list = Object.keys(projectEmissionSchema(NATIVE_SITUATION).properties))
//   W-FN    recordScoredTurn                             ../app/scored-turn-recorder   (sprint-wire-cognition Shot 1)
//   W-FN    toWriteAck                                   ../app/write-ack              (§1a — the shared ack deriver)
//   W-FN    buildFactTable                               ../domain/fact-table
//   W-FN    resolveDimension                             ../domain/resolve-dimension
//   W-FN    weighDimension                               ../domain/chain-ping
//   W-FN    pivot / lineageView / timelineView           ../domain/pivot
//   W-FN    renderGrid / renderTranscript                ../domain/render-present
//   W-FN    currentFocus/sessionWindow                   ../domain/session-window      (sprint-wire-cognition Shot 2)
//   W-ATOM  PRESENT_BUNDLES / PresentBundle                                      ../config/read-engine-types   (R7 rail-aware bundles)
//   W-FN    createDbPresentMarkStore                     ../exec/present-mark-store-db
//   W-FN    gather                                       @/features/F-memory/contract/substrate-contract    (scope seam — the one scope-resolving read)
//   W-FN    registerReplyComposer/registerContextReader  @/core/domain/cognition-seam                      (F-present -> core)
// deps:
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R1  ../domain/coin-score
//   R2  ../app/scored-turn-recorder
//   R2  ../app/write-ack
//   R1  ../domain/fact-table
//   R1  ../domain/resolve-dimension
//   R1  ../domain/chain-ping
//   R1  ../domain/pivot
//   R1  ../domain/render-present
//   R1  ../domain/session-window
//   R0  ../config/read-engine-types
//   R0  ../config/coin-manual
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
import { SCORE_EMIT_CONFIG, emissionFromStructured, NATIVE_SITUATION, projectEmissionSchema } from '@/features/F-present/domain/coin-score'
import { projectManual } from '@/features/F-present/config/coin-manual'
import { recordScoredTurn }                              from '@/features/F-present/app/scored-turn-recorder'
import type { WearerSource }                             from '@/features/F-present/app/scored-turn-recorder'
import { toWriteAck }                                    from '@/features/F-present/app/write-ack'
import { buildFactTable }                                from '@/features/F-present/domain/fact-table'
import { resolveDimension }                              from '@/features/F-present/domain/resolve-dimension'
import { weighDimension }                                from '@/features/F-present/domain/chain-ping'
import { pivot, lineageView, timelineView }              from '@/features/F-present/domain/pivot'
import { renderGrid, renderTranscript }                  from '@/features/F-present/domain/render-present'
import { currentFocus, sessionWindow }                   from '@/features/F-present/domain/session-window'
import type { PresentBundle }                            from '@/features/F-present/config/read-engine-types'
import { PRESENT_BUNDLES }                                from '@/features/F-present/config/read-engine-types'
import { createDbPresentMarkStore }                      from '@/features/F-present/exec/present-mark-store-db'
import { gather }                                        from '@/features/F-memory/contract/substrate-contract'
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
// (sprint-wire-economy) The WEARER-TURN CELLS data block is GONE (deletion manifest, both
// rails): priorMarks are now keyed by WORD-INDEX into the wearer's turn text — which the
// model reads straight from the transcript — plus the surface word, validated by the
// recorder. The model no longer copies <pos>:<word> pairs, so there is no cells block to
// render. CognitionInput.wearerTurn survives, but ONLY as the recorder's wearer SOURCE (its
// word-cells resolve priorMarks); it is never rendered into the scoring context.

// Assemble the scoring system message: manual (M1) first, then the present. ONE source
// (projectManual), rendered from PRIMITIVES the caller computes from native's situation: the
// inline form (NATIVE_SITUATION.replyMarking==='inline'), native's HOW TO RETURN
// (includeWearerText:false → "return ONLY the JSON object"), and the field list derived from
// native's OWN schema (projectEmissionSchema(NATIVE_SITUATION)). The schema lives at R1 (here, R2,
// a downward import) — coin-manual stays a strict R0 leaf, so manual + schema are paired HERE and
// cannot drift. The wire pairs its own at its delivery site. Absent present → the manual alone.
export function buildScoringContext(systemPrompt: string | null): string {
  const manual = projectManual({
    inline: NATIVE_SITUATION.replyMarking === 'inline',
    includeWearerText: NATIVE_SITUATION.includeWearerText,
    fields: Object.keys(projectEmissionSchema(NATIVE_SITUATION).properties ?? {}),
  })
  return systemPrompt ? `${manual}\n\n${systemPrompt}` : manual
}

export const composeAndWrite: ReplyComposer = async (input) => {
  // System message: the dated COIN manual (M1) first (the complete fill rules), then the
  // present (input.systemPrompt). Instruction first so "below" is true. The wearer turn is
  // not rendered here — it feeds the recorder as the priorMark source (below).
  const systemContent = buildScoringContext(input.systemPrompt)
  const messages: ChatMessage[] = [
    { role: 'system' as const, content: systemContent },
    { role: 'user' as const, content: input.userContent },
  ]

  // 1. structured emit — one structured request; the final chunk carries the object.
  let structured: unknown = null
  for await (const chunk of streamStructuredEmit(messages, input.modelId, SCORE_EMIT_CONFIG, input.apiKey)) {
    if (chunk.type === 'final') structured = chunk.structured
  }

  // 2. narrow -> emission (malformed -> empty reply), then record (sprint-wire-economy):
  //    locate+verify BOTH mark sets (claim+validate, loud) → cut once → write → home → M4
  //    verify → place → render. The recorder is the single scored-turn composition, shared
  //    with the demanded wire. The wearer turn is E1's pre-write (the spine wrote it at the
  //    perimeter): hand it as `wearer: { written }` so priorMarks resolve against its
  //    word-cells — "feeds it", E1 untouched. Absent wearerTurn (no live caller) → empty.
  const emission = emissionFromStructured(structured)
  const wearer: WearerSource = input.wearerTurn
    ? { written: { sc: input.wearerTurn.sc, wordCells: input.wearerTurn.cells } }
    : { written: { sc: 0, wordCells: [] } }
  // Native calls the recorder IN-SLICE (the raw RecordedTurn) and wraps it with the SHARED
  // toWriteAck — the one ack deriver every rail uses, none reconstructing (§1a). The seam now
  // carries only text (F5): landed → { text }; dropped (empty/malformed reply) → { text:'' },
  // the live empty-text signal F-chat already handles at chat-contract.
  // the reply-marking FORMAT comes from native's SITUATION (NATIVE_SITUATION), never a surface name —
  // absent ≡ 'separate' today; the native-first migration (§3) flips it on the situation, here unchanged.
  const recorded = await recordScoredTurn(emission, input.who, input.userId, input.scope, wearer, NATIVE_SITUATION.replyMarking ?? 'separate')
  const ack = toWriteAck(recorded)
  return { text: ack.landed ? ack.text : '' }
}

// ── Read-front — the rail-aware present bundle (R7) ────────────────────────────
// The wake-default bundle the reader wakes with, run through the read engine
// (buildFactTable -> resolveDimension -> weighDimension -> pivot -> renderGrid). The sections
// are a REMOVABLE template layer, not engine structure — pivot() still answers any explicit
// config; lookup still fetches any cells. `bundle` (R7 named config) selects the sections
// per rail: native = windshield transcript + both sections; wire = both sections only (the
// transcript is fetched via lookup, never carried per turn, R8). Sections join with a blank
// line — byte-identical to the prior native render; clean (no leading blank) when the wire
// bundle drops the transcript. The registered ContextReader (native) uses PRESENT_BUNDLES.native.
//
// A section is a PresentView (assignment + render spec) consumed by two fixed mechanisms:
// pivot(view.assignment, …) → Grid ; renderGrid(grid, view.render) → text.
export async function presentContext(userId: string, bundle: PresentBundle = PRESENT_BUNDLES.native): Promise<string> {
  const transcript = await gather({ kind: 'mine', reader: userId })   // scope seam — 'mine' = user_id=$1, same rows
  const store      = await createDbPresentMarkStore().read(userId)

  const rows = buildFactTable(transcript, store)
  const dim  = resolveDimension(rows)
  weighDimension(dim, rows)
  const focus = currentFocus(dim)

  const sections: string[] = []
  // 1. transcript — the SESSION WINDOW, byte-pure (3R.1). Native windshield only; the wire
  //    fetches cells via lookup. Full history stays reachable via readTranscript / lookup.
  if (bundle.transcript) sections.push(renderTranscript(sessionWindow(transcript, dim, rows, focus)))

  // structure + state appear once marks exist (sparse early, richer as it compounds).
  if (dim.things.size > 0) {
    // 2. structure — the lineage view (rows=lineage, ring-local top).
    if (bundle.structure) sections.push(renderGrid(pivot(lineageView.assignment, dim, rows), lineageView.render))
    // 3. state — the timeline view, sliced at the current focus.
    if (bundle.state && focus) {
      const tv = timelineView(focus)
      sections.push(renderGrid(pivot(tv.assignment, dim, rows), tv.render))
    }
  }
  return sections.join('\n\n')
}

// The registered upgrader conforms to the core ContextReader (userId → string) — native rail.
export const presentContextReader: ContextReader = (userId) => presentContext(userId)

// ── The single composition wire ────────────────────────────────────────────────
// Called from F-event-system bootstrap() (warm start) AND from chat-contract at
// request time via F-present's R3 W-HOOK (resolve-at-read). Registers both
// upgraders into the core seam. The seam's _ensureDone guard prevents duplicate
// registration when both paths fire in the same module instance.
// Deleting F-present: remove this call + the slice; registry stays empty;
// markCognitionEnsured never fires; core loop runs its baseline.
export function registerCognitionUpgrades(): void {
  registerReplyComposer(composeAndWrite)
  registerContextReader(presentContextReader)
}
