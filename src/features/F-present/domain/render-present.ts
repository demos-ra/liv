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

import type { Ref } from '@/features/F-present/config/mark-types'
import type { ForestResult, ForestNode, SheetResult, SheetCell } from '@/features/F-present/config/read-engine-types'

const refText = (r: Ref): string => (typeof r === 'string' ? r : `${r.who}:${r.sc}:${r.pos}`)

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
