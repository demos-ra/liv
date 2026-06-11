// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/scored-turn-recorder.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-wire-cognition Shot 1 (extraction of composeAndWrite steps 2–7 into
//               ONE composition — the scored-turn recorder; single-cut folded in);
//             sprint-wire-cognition Shot 2 (M4 universe seeded from the session window)
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    splitEmission/verifyGrid/validateSharedUniverse/cutReply   ../domain/coin-score
//   W-ATOM  ScoredEmission                                             ../domain/coin-score (type-only)
//   W-FN    buildFactTable                                             ../domain/fact-table
//   W-FN    resolveDimension                                           ../domain/resolve-dimension
//   W-FN    weighDimension                                             ../domain/chain-ping
//   W-FN    currentFocus/sessionWindow                                 ../domain/session-window
//   W-FN    createDbPresentMarkStore                                   ../exec/present-mark-store-db
//   W-ATOM  PresentMarkStore                                           ../app/present-store (type-only)
//   W-FN    writeRawTurn/readTranscript/joinCells   @/features/F-memory/contract/substrate-contract (R3 surface)
//   W-ATOM  RawTurn/RawWord/Who                     @/core/types/substrate-raw.types (type-only)
// wires-out:
//   W-FN    recordScoredTurn  →  ../app/cognition-orchestrator (R2), ../contract/present-contract (R3 → F-mcp wire)
// deps:
//   R1  ../domain/coin-score
//   R1  ../domain/fact-table
//   R1  ../domain/resolve-dimension
//   R1  ../domain/chain-ping
//   R1  ../domain/session-window
//   R4  ../exec/present-mark-store-db
//   R2  ../app/present-store
//   R3  @/features/F-memory/contract/substrate-contract
//   R0  @/core/types/substrate-raw.types
//
// ─────────────────────────────────────────────────────────────────────────────
// THE SCORED-TURN RECORDER (R2). One composition that records a single SCORED turn
// (an llm/program reply that carries its own pair-scoring) into the substrate + the
// lens. It is the shared spine of BOTH scored-turn writers:
//   - native cognition (composeAndWrite): model emit → emissionFromStructured → HERE.
//   - the demanded wire (F-mcp write, who:'llm'): the agent's emission → HERE.
// The wearer's words-only turn is NOT recorded here — it carries no marks (cutCells
// + writeRawTurn only, on its own path).
//
// THE ORDER (Shot 1) — cutReply ONCE, then thread that one cut everywhere:
//   cutReply(reply) → writeRawTurn(cells) → splitEmission(REUSING the cut) → M4 verify
//   (verifyGrid + validateSharedUniverse over the SESSION WINDOW) → place → joinCells.
// "no double work": cutReply runs exactly once per turn — splitEmission is handed the
// cut, it does not re-cut. §FORK = A: the reply text is authoritative; joinCells renders
// it byte-identical.
//
// A4 (isolated execution): the genuinely-ambient I/O — transcript read, raw-turn write,
// the mark store — and the canonical cutter are INJECTED as `deps` (the native R2
// pattern: F-plan R2Deps, F-verify ComposeDeps, F-multi-instance Ports). Production
// callers omit deps and get the real wires; tests inject stubs to run DB-free and to
// COUNT the single cut. Default-bound, so the public 4-arg call is byte-identical.
// ─────────────────────────────────────────────────────────────────────────────

import { splitEmission, verifyGrid, validateSharedUniverse, cutReply } from '@/features/F-present/domain/coin-score'
import type { ScoredEmission } from '@/features/F-present/domain/coin-score'
import { buildFactTable } from '@/features/F-present/domain/fact-table'
import { resolveDimension } from '@/features/F-present/domain/resolve-dimension'
import { weighDimension } from '@/features/F-present/domain/chain-ping'
import { currentFocus, sessionWindow } from '@/features/F-present/domain/session-window'
import { createDbPresentMarkStore } from '@/features/F-present/exec/present-mark-store-db'
import type { PresentMarkStore } from '@/features/F-present/app/present-store'
import { writeRawTurn, readTranscript, joinCells } from '@/features/F-memory/contract/substrate-contract'
import type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// What the recorder returns — the substrate position (sc), the CANONICAL cut (so the
// caller holds exact coordinates), the count of marks that survived M4, and the
// byte-identical render of the turn (joinCells, never an ad-hoc join).
export type RecordedTurn = { sc: number; cells: RawWord[]; markCount: number; text: string }

// The injected I/O + cutter seam (A4). Default-bound to the live wires.
export type ScoredTurnDeps = {
  readTranscript: (userId: string) => Promise<RawTurn[]>
  writeRawTurn:   (input: { who: Who; words: RawWord[]; userId: string; scope: string }) => Promise<number>
  store:          PresentMarkStore
  cutReply:       (reply: string) => { cells: RawWord[]; wordCellPos: number[] }
}

function defaultDeps(): ScoredTurnDeps {
  return { readTranscript, writeRawTurn, store: createDbPresentMarkStore(), cutReply }
}

const EMPTY: RecordedTurn = { sc: 0, cells: [], markCount: 0, text: '' }

// Record ONE scored turn. `emission` is already narrowed (emissionFromStructured) —
// the gate filter that drops malformed marks lives there, ahead of this composition.
export async function recordScoredTurn(
  emission: ScoredEmission,
  who: Who,
  userId: string,
  scope: string,
  deps: ScoredTurnDeps = defaultDeps(),
): Promise<RecordedTurn> {
  // Empty / malformed reply → honest non-write (byte-identical to the prior guard).
  if (emission.reply.length === 0) return EMPTY

  // 1. cut ONCE — the canonical grid (the reply text is authoritative, §FORK = A).
  const cut = deps.cutReply(emission.reply)
  const { cells } = cut
  if (cells.length === 0) return EMPTY

  // 2. session window (Shot 2): derive the active line from the EXISTING transcript +
  //    lens (this turn's marks are placed below). The M4 universe is seeded from the
  //    window, not all history — refs resolve against the current run.
  const transcript = await deps.readTranscript(userId)
  const store = await deps.store.read(userId)
  const rows = buildFactTable(transcript, store)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  const window = sessionWindow(transcript, dim, rows, currentFocus(dim))

  // 3. hand the canonical reply cells DOWN to the substrate (R2a). The assigned
  //    position IS sc — one coordinate; the marks placed below key on the same sc.
  const sc = await deps.writeRawTurn({ who, words: cells, userId, scope })

  // 4. split at sc, REUSING the cut (no second tokenization). splitEmission is the
  //    single source of mark geometry; the cut is its input, not a re-derivation.
  const { placedMarks } = splitEmission(emission, who, sc, cut)

  // 5. M4 VERIFY — (a) the grid is numbered once & contiguous; (b) every ref POSITIVELY
  //    resolves against the known universe (this reply's cells + the windowed turns:
  //    coord-keys AND lowercased names). Marks failing either check do not persist.
  const known = new Set<string>()
  for (const c of cells) { known.add(`${who}:${sc}:${c.pos}`); known.add(c.word.toLowerCase()) }
  for (const t of window) for (const w of t.words) { known.add(`${t.who}:${t.sc}:${w.pos}`); known.add(w.word.toLowerCase()) }
  const verified = verifyGrid(cells) ? validateSharedUniverse(placedMarks, known) : []

  // 6. place the verified marks into F-present's store (writes nothing to substrate).
  await deps.store.place(userId, verified)

  // 7. render text — G1's inverse (joinCells), never an ad-hoc space-join.
  return { sc, cells, markCount: verified.length, text: joinCells(cells) }
}
