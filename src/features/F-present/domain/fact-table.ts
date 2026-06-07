// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/fact-table.ts]
//
// Joins the two frozen stores into one flat fact table. Pure ("one flat source").
// Words come from the SUBSTRATE (intrinsic coordinates -> verbatim word); marks
// come from F-present's OWN store. No word-class is computed or stamped. A mark
// whose home word is absent (anchor removed) is dropped (graceful; the lens never
// pins content). Punctuation rides its surface (it is substrate, never a mark);
// hiding it is a display Selection (M4), not a class.

import type { Transcript } from '@/core/types/substrate-raw.types'
import type { Coord } from '@/core/types/substrate-raw.types'
import type { PresentStore, Ref } from '@/features/F-present/config/mark-types'
import type { FactRow } from '@/features/F-present/config/read-engine-types'

const keyOf = (c: Coord) => `${c.who}:${c.sc}:${c.pos}`

export function buildFactTable(transcript: Transcript, store: PresentStore): FactRow[] {
  // the substrate's intrinsic coordinate -> the verbatim word at it
  const wordAt = new Map<string, string>()
  for (const t of transcript)
    for (const w of t.words)
      wordAt.set(keyOf({ who: t.who, sc: t.sc, pos: w.pos }), w.word)

  const rows: FactRow[] = []
  for (const pm of store) {
    const surface = wordAt.get(keyOf(pm.home))
    if (surface === undefined) continue            // anchor removed by wearer -> drop (graceful)
    const m = pm.mark
    let value: string | null = null
    let refs: Ref[] = []
    if (m.op === 'RELATE') refs = m.peers
    else if (m.op === 'QUALIFY') { value = m.coloring; refs = [m.target] }
    else if (m.op === 'IDENTIFY') refs = [m.target]
    rows.push({ home: pm.home, surface, op: m.op, value, refs })
  }
  return rows
}
