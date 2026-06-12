// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — sprint-wire-economy R8)
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/lookup.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-wire-economy R8 (lookup — the navigation read control; grid generalized
//               and RE-HOMED from the wire to F-present, where the dimension lives)
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    buildFactTable / resolveDimension   ../domain/fact-table, ../domain/resolve-dimension
//   W-FN    createDbPresentMarkStore            ../exec/present-mark-store-db
//   W-ATOM  PresentMarkStore                    ../app/present-store (type-only)
//   W-FN    readTranscript                      @/features/F-memory/contract/substrate-contract (R3 surface)
//   W-ATOM  Who / Coord / RawTurn               @/core/types/substrate-raw.types (type-only)
// wires-out:
//   W-FN    lookup  →  ../contract/present-contract (R3 → F-mcp wire `lookup` tool)
//   W-ATOM  LookupSelector / LookupResult / LookupCell
//
// THE READ CONTROL (R8). grid was a turn-only fetch on the wire (readTranscript → one turn's
// cells). lookup GENERALIZES it — turn | span | thing → numbered cells — and re-homes it to
// F-present, the one place that holds BOTH the transcript AND the resolved dimension (a
// `thing` selector resolves a name to its cluster's appearances). The wire exposes lookup and
// no longer carries the transcript per turn (R7 wire bundle): the transcript is FETCHED here.
//
// A read control takes NO testimony and writes NOTHING — it numbers existing cells. Coordinates
// returned here are the ONLY source the model copies into a mark's Ref (never counted, A2.4).
// I/O injected (A4 deps) so it runs DB-free under test.

import { buildFactTable } from '@/features/F-present/domain/fact-table'
import { resolveDimension } from '@/features/F-present/domain/resolve-dimension'
import { createDbPresentMarkStore } from '@/features/F-present/exec/present-mark-store-db'
import type { PresentMarkStore } from '@/features/F-present/app/present-store'
import { readTranscript } from '@/features/F-memory/contract/substrate-contract'
import type { Who, Coord, RawTurn } from '@/core/types/substrate-raw.types'

// what to fetch — by turn (one turn), by span (an sc range), or by thing (a name's cluster).
export type LookupSelector =
  | { kind: 'turn'; who: Who; sc: number }
  | { kind: 'span'; from: number; to: number; who?: Who }
  | { kind: 'thing'; name: string }

// a numbered cell — the cutter's truth: a coordinate + its verbatim word.
export type LookupCell = { who: Who; sc: number; pos: number; word: string }
export type LookupResult =
  | { ok: true; selector: LookupSelector; cells: LookupCell[] }
  | { ok: false; selector: LookupSelector; message: string }

export type LookupDeps = {
  readTranscript: (userId: string) => Promise<RawTurn[]>
  store:          PresentMarkStore
}
function defaultDeps(): LookupDeps {
  return { readTranscript, store: createDbPresentMarkStore() }
}

const cellsOf = (t: RawTurn): LookupCell[] => t.words.map(w => ({ who: t.who, sc: t.sc, pos: w.pos, word: w.word }))

export async function lookup(userId: string, selector: LookupSelector, deps: LookupDeps = defaultDeps()): Promise<LookupResult> {
  const transcript = await deps.readTranscript(userId)

  if (selector.kind === 'turn') {
    const turn = transcript.find(t => t.who === selector.who && t.sc === selector.sc)
    if (!turn) return { ok: false, selector, message: `no such turn (who=${selector.who}, sc=${selector.sc}) in your substrate` }
    return { ok: true, selector, cells: cellsOf(turn) }
  }

  if (selector.kind === 'span') {
    const lo = Math.min(selector.from, selector.to), hi = Math.max(selector.from, selector.to)
    const turns = transcript.filter(t => t.sc >= lo && t.sc <= hi && (selector.who === undefined || t.who === selector.who))
    return { ok: true, selector, cells: turns.flatMap(cellsOf) }
  }

  // thing: resolve the name to its cluster, then number the word at each member coordinate.
  const store = await deps.store.read(userId)
  const rows = buildFactTable(transcript, store)
  const dim = resolveDimension(rows)
  const thingId = dim.resolveRef(selector.name)
  const thing = thingId ? dim.things.get(thingId) : undefined
  if (!thing) return { ok: false, selector, message: `no thing named "${selector.name}" in your present` }

  const wordAt = (c: Coord): string | undefined =>
    transcript.find(t => t.who === c.who && t.sc === c.sc)?.words.find(w => w.pos === c.pos)?.word
  const cells: LookupCell[] = []
  for (const c of thing.members) {
    const word = wordAt(c)
    if (word !== undefined) cells.push({ who: c.who, sc: c.sc, pos: c.pos, word })
  }
  return { ok: true, selector, cells }
}
