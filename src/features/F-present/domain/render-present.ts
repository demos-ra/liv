// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/render-present.ts]
//
// PivotResult -> context text, name-first. Plain serialization of the pivot — no
// metaphor in the engine, technical terms only (identity · RELATE · QUALIFY ·
// IDENTIFY). Cells render the RAW marks only — never a synthesized state. Marks
// are split by op into typed sub-sections so the table stays organized.
//
// sprint-wire-cognition Shot 3: the TRANSCRIPT section renders HERE too (one render
// home — moved off the orchestrator's inline line), with per-word cell positions —
// the manual promises them, the render now delivers them.

import type { Ref } from '@/features/F-present/config/mark-types'
import type { ForestResult, ForestNode, SheetResult, SheetCell } from '@/features/F-present/config/read-engine-types'
import type { RawTurn, RawWord } from '@/core/types/substrate-raw.types'
import { isWordCell } from '@/features/F-memory/contract/substrate-contract'

const refText = (r: Ref): string => (typeof r === 'string' ? r : `${r.who}:${r.sc}:${r.pos}`)

// ── Transcript (the raw line) — numbered cells ──────────────────────────────────
// The manual tells the model "each word has a position; point at them by coordinate";
// this is where those positions become visible. Each WORD cell is tagged ⟨pos⟩ — its
// substrate position — so the reader can construct a (who, sc, pos) coordinate for any
// word directly from the render. Punctuation/space cells are NOT tagged (manual: mark
// only word cells); they render verbatim.
//
// joinCells stays the SOLE text authority — positions are ANNOTATION, never reassembly:
// each cell emits its literal `word` (the exact concatenation joinCells performs), and
// word cells additionally carry the ⟨pos⟩ tag. Strip every ⟨…⟩ tag and the line is
// joinCells(cells) byte-for-byte — the cutter's exact inverse, no re-join, no drift.
const POS_OPEN = '⟨', POS_CLOSE = '⟩'   // ⟨ ⟩ — rare in prose, unambiguous, parseable

function annotateLine(cells: RawWord[]): string {
  return cells.map(c => isWordCell(c.word) ? `${c.word}${POS_OPEN}${c.pos}${POS_CLOSE}` : c.word).join('')
}

export function renderTranscript(turns: RawTurn[]): string {
  const out: string[] = ['TRANSCRIPT (turns in position order; each word tagged ⟨pos⟩ — its cell position):']
  for (const t of turns) {
    const who = t.who === 'wearer' ? '—' : t.who           // '—' the person
    out.push(`[${t.sc}] (${who}): ${annotateLine(t.words)}`)
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
    out.push('RELATE (lateral threads):')
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

// split a cell's raw marks by op into typed sub-groups (organized, never a dump)
function renderCell(cell: SheetCell): string {
  const byOp = { identity: [] as string[], RELATE: [] as string[], QUALIFY: [] as string[], IDENTIFY: [] as string[] }
  for (const e of cell) {
    if (e.op === 'identity') byOp.identity.push('•')
    else if (e.op === 'RELATE') byOp.RELATE.push(e.value ?? (e.ref ? refText(e.ref) : ''))
    else if (e.op === 'QUALIFY') byOp.QUALIFY.push(e.value ?? '')
    else if (e.op === 'IDENTIFY') byOp.IDENTIFY.push(e.ref ? refText(e.ref) : '')
  }
  const parts: string[] = []
  if (byOp.identity.length) parts.push(`identity(${byOp.identity.length})`)
  if (byOp.RELATE.length) parts.push(`RELATE[${byOp.RELATE.join(',')}]`)
  if (byOp.QUALIFY.length) parts.push(`QUALIFY[${byOp.QUALIFY.join(',')}]`)
  if (byOp.IDENTIFY.length) parts.push(`IDENTIFY[${byOp.IDENTIFY.join(',')}]`)
  return parts.join(' ')
}
