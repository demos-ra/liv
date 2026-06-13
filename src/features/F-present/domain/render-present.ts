// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/render-present.ts]
//
// PivotResult -> context text, name-first. Plain serialization of the pivot — the cells
// render the RAW marks only (never a synthesized state), re-skinned to the MUSICAL register
// (note · tie · chord · expression) at this outbound boundary via engineOpToMusical (R9); the
// engine's own technical vocabulary (identity · RELATE · QUALIFY · IDENTIFY) stays inside the
// gate. Marks are split by op into typed sub-sections so the table stays organized.
//
// sprint-wire-cognition Shot 3R (L0 ruling — coordinates are fetched, never rendered,
// never counted): the TRANSCRIPT renders PLAIN joined text — the wearer's byte-pure
// record carries NO positional markup of any kind. Coordinates live on STRUCTURAL
// surfaces only: the `lookup` tool (turn | span | thing → numbered cells) and the marks
// SHEET (which renders each mark's home @pos — teaching the coordinate format from real
// marks).

import type { Ref } from '@/features/F-present/config/mark-types'
import type { ForestResult, ForestNode, SheetResult, SheetCell } from '@/features/F-present/config/read-engine-types'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import { joinCells } from '@/features/F-memory/contract/substrate-contract'
import { engineOpToMusical } from '@/features/F-present/config/register-map'   // R9: render the MUSICAL register (note·tie·chord·expression)

const refText = (r: Ref): string => (typeof r === 'string' ? r : `${r.who}:${r.sc}:${r.pos}`)

// ── Transcript (the raw line) — plain, byte-pure (3R.1) ─────────────────────────
// The transcript is the wearer's record: `[sc] (who): joinCells(words)`, nothing more.
// joinCells is the sole text authority; there is no positional markup — positions are
// obtained from structural surfaces (lookup / sheet), never counted from this prose.
export function renderTranscript(turns: RawTurn[]): string {
  const out: string[] = ['TRANSCRIPT (turns in position order):']
  for (const t of turns) {
    const who = t.who === 'wearer' ? '—' : t.who           // '—' the person
    out.push(`[${t.sc}] (${who}): ${joinCells(t.words)}`)
  }
  return out.join('\n')
}

export function renderForest(r: ForestResult): string {
  const out: string[] = ['FOREST (structure — lineage by weight; root = wearer):']
  const walk = (n: ForestNode, depth: number) => {
    const indent = '  '.repeat(depth)
    const name = depth === 0 ? n.label : n.label                 // '—' wearer at root
    out.push(`${indent}${name} [w=${n.weight}]`)
    for (const c of n.children) walk(c, depth + 1)
  }
  walk(r.root, 0)
  if (r.threads.length > 0) {
    out.push(`${engineOpToMusical('RELATE')} (lateral threads):`)   // "chord (lateral threads):"
    for (const t of r.threads) out.push(`  ${t.word}: ${t.peers.join(' \u2194 ')}`)
  }
  return out.join('\n')
}

export function renderSheet(r: SheetResult): string {
  const out: string[] = [`SHEET (state — columns = the focus's direct line):`]
  if (r.columns.length === 0) return out.concat('  (no focus)').join('\n')
  out.push(`columns: ${r.columns.join(' | ')}`)
  for (const row of r.rows) {
    out.push(`sc${row.sc}:`)
    for (const col of r.columns) {
      const cell = row.cells[col]
      if (!cell || cell.length === 0) continue                   // sparse — empty where untouched
      out.push(`  ${col}: ${renderCell(cell)}`)
    }
  }
  return out.join('\n')
}

// split a cell's raw marks by op into typed sub-groups (organized, never a dump).
// 3R.3: each op group prints its marks' home positions (@pos) — the sheet teaches the
// coordinate format from REAL marks. sc is the row key, who the column context, so only
// the position prints per mark (do not repeat sc/who). A group's positions are appended
// once: `identity(2)@5,9`, `RELATE[trip]@7`, `QUALIFY[tall]@5`, `IDENTIFY[Kyoto]@3`.
function renderCell(cell: SheetCell): string {
  const byOp = {
    identity: [] as number[],
    RELATE:   { v: [] as string[], at: [] as number[] },
    QUALIFY:  { v: [] as string[], at: [] as number[] },
    IDENTIFY: { v: [] as string[], at: [] as number[] },
  }
  for (const e of cell) {
    if (e.op === 'identity') byOp.identity.push(e.home.pos)
    else if (e.op === 'RELATE') { byOp.RELATE.v.push(e.value ?? (e.ref ? refText(e.ref) : '')); byOp.RELATE.at.push(e.home.pos) }
    else if (e.op === 'QUALIFY') { byOp.QUALIFY.v.push(e.value ?? ''); byOp.QUALIFY.at.push(e.home.pos) }
    else if (e.op === 'IDENTIFY') { byOp.IDENTIFY.v.push(e.ref ? refText(e.ref) : ''); byOp.IDENTIFY.at.push(e.home.pos) }
  }
  // OUTBOUND register (R9): each engine op renders in the MUSICAL register —
  // identity→note, RELATE→chord, QUALIFY→expression, IDENTIFY→tie. One home (the map).
  const parts: string[] = []
  if (byOp.identity.length) parts.push(`${engineOpToMusical('identity')}(${byOp.identity.length})@${byOp.identity.join(',')}`)
  if (byOp.RELATE.v.length) parts.push(`${engineOpToMusical('RELATE')}[${byOp.RELATE.v.join(',')}]@${byOp.RELATE.at.join(',')}`)
  if (byOp.QUALIFY.v.length) parts.push(`${engineOpToMusical('QUALIFY')}[${byOp.QUALIFY.v.join(',')}]@${byOp.QUALIFY.at.join(',')}`)
  if (byOp.IDENTIFY.v.length) parts.push(`${engineOpToMusical('IDENTIFY')}[${byOp.IDENTIFY.v.join(',')}]@${byOp.IDENTIFY.at.join(',')}`)
  return parts.join(' ')
}
