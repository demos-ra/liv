// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/render-present.ts]
//
// Grid -> context text, name-first. ONE general renderer (sprint pivot-compute-close): render
// is modular the same way compute is — one engine + an assignment; one renderer + a RenderSpec.
// renderGrid is a BRANCHLESS walker of (grid, spec): it reads only `grid.rows` / `grid.columns` /
// `grid.threads`, the spec's layout fields, and each cell's own `kind` tag — it NEVER sees config,
// NEVER inspects table/assignment identity, and NEVER re-derives compute structure (no re-nest,
// re-group, re-weight, re-column). EVERY way the two bodies diverge — header line · columns line ·
// cell placement · trailing threads block — is a declarative RenderSpec field, authored per table,
// fed in (row indent/key fall out of grid.rows' depth/label); data, not a render branch. (NF-1.)
//
// The cells render the RAW marks only (never a synthesized state), re-skinned to the MUSICAL
// register (note · tie · chord · expression) at this outbound boundary via engineOpToMusical (R9);
// the engine's own technical vocabulary (identity · RELATE · QUALIFY · IDENTIFY) stays inside the
// gate. Branching on a cell's own `kind` (weight vs marks) is presentation on the cell's own data
// — legal; it is not a branch on table.
//
// sprint-wire-cognition Shot 3R (L0 ruling — coordinates are fetched, never rendered, never
// counted): the TRANSCRIPT renders PLAIN joined text — the wearer's byte-pure record carries NO
// positional markup. Coordinates live on STRUCTURAL surfaces only: the `lookup` tool and the
// state grid (which renders each mark's home @pos — teaching the coordinate format from real marks).

import type { Ref } from '@/features/F-present/config/mark-types'
import type { Grid, GridRow, GridCell, MarkEntry, ColKey, RenderSpec, Thread } from '@/features/F-present/config/read-engine-types'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import { joinCells } from '@/features/F-memory/contract/substrate-contract'
import { engineOpToMusical } from '@/features/F-present/config/register-map'   // R9: render the MUSICAL register (note·tie·chord·expression)

const refText = (r: Ref): string => (typeof r === 'string' ? r : `${r.who}:${r.sc}:${r.pos}`)

// ── Transcript (the raw line) — plain, byte-pure (3R.1) ─────────────────────────
// The transcript is the wearer's record: `[sc] (who): joinCells(words)`, nothing more.
// joinCells is the sole text authority; there is no positional markup — positions are
// obtained from structural surfaces (lookup / state grid), never counted from this prose.
export function renderTranscript(turns: RawTurn[]): string {
  const out: string[] = ['TRANSCRIPT (turns in position order):']
  for (const t of turns) {
    const who = t.who === 'wearer' ? '—' : t.who           // '—' the person
    out.push(`[${t.sc}] (${who}): ${joinCells(t.words)}`)
  }
  return out.join('\n')
}

// ── The one renderer — header + (optional) columns line + rows + (optional) threads ──
// Every clause reads grid data, gated by a spec field. Nothing here asks which table it is;
// the renderer never sees config — full registry-symmetry with the engine (NF-1).
export function renderGrid(grid: Grid, spec: RenderSpec): string {
  const out: string[] = [renderHeader(spec)]
  if (spec.columnsLine) out.push(renderColumns(grid.columns))
  for (const r of grid.rows) out.push(renderRow(r, grid.columns, spec.cellLayout))
  if (spec.threadsBlock && grid.threads.length > 0) out.push(renderThreads(grid.threads))
  return out.join('\n')
}

// the terse header — now a RenderSpec FIELD (data), not derived from config (NF-1). No baked
// title, no dead table-name literal: each table authors its own header line, fed in.
export function renderHeader(spec: RenderSpec): string {
  return spec.header
}

const renderColumns = (columns: ColKey[]): string => `columns: ${columns.join(' | ')}`

// a row: indent (depth) + label, then its cells per the spec's cellLayout —
//   inline : the single value cell sits on the row line   →  "  Japan [w=38]"
//   matrix : "sc20:" then one sub-line per non-empty cell  →  "  dentist: note(1)@0 …"
// the cell text switches on the cell's own `kind` (presentation on its own data), never on table.
function renderRow(r: GridRow, columns: ColKey[], layout: RenderSpec['cellLayout']): string {
  if (layout === 'inline') {
    return `${'  '.repeat(r.depth)}${r.label} ${renderCell(r.cells[columns[0]])}`
  }
  const lines = [`${r.label}:`]
  for (const c of columns) {
    const cell = r.cells[c]
    if (!cell || (cell.kind === 'marks' && cell.marks.length === 0)) continue   // sparse — skip untouched
    lines.push(`  ${c}: ${renderCell(cell)}`)
  }
  return lines.join('\n')
}

// one cell to text — the only place a cell's `kind` is read (presentation; the engine never reads it).
function renderCell(cell: GridCell): string {
  return cell.kind === 'weight' ? `[w=${cell.weight}]` : renderMarks(cell.marks)
}

// split a cell's raw marks by op into typed sub-groups (organized, never a dump). 3R.3: each op
// group prints its marks' home positions (@pos) — the grid teaches the coordinate format from REAL
// marks. sc is the row key, who the column context, so only the position prints per mark. A group's
// positions are appended once: `note(2)@5,9`, `chord[trip]@7`, `expression[tall]@5`, `tie[Kyoto]@3`.
function renderMarks(cell: MarkEntry[]): string {
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
  // OUTBOUND register (R9): identity→note, RELATE→chord, QUALIFY→expression, IDENTIFY→tie.
  const parts: string[] = []
  if (byOp.identity.length) parts.push(`${engineOpToMusical('identity')}(${byOp.identity.length})@${byOp.identity.join(',')}`)
  if (byOp.RELATE.v.length) parts.push(`${engineOpToMusical('RELATE')}[${byOp.RELATE.v.join(',')}]@${byOp.RELATE.at.join(',')}`)
  if (byOp.QUALIFY.v.length) parts.push(`${engineOpToMusical('QUALIFY')}[${byOp.QUALIFY.v.join(',')}]@${byOp.QUALIFY.at.join(',')}`)
  if (byOp.IDENTIFY.v.length) parts.push(`${engineOpToMusical('IDENTIFY')}[${byOp.IDENTIFY.v.join(',')}]@${byOp.IDENTIFY.at.join(',')}`)
  return parts.join(' ')
}

// the trailing lateral-relations block, from the ephemeral grid.threads overlay (3R: `chord …`).
function renderThreads(threads: Thread[]): string {
  const out: string[] = [`${engineOpToMusical('RELATE')} (lateral threads):`]   // "chord (lateral threads):"
  for (const t of threads) out.push(`  ${t.word}: ${t.peers.join(' ↔ ')}`)
  return out.join('\n')
}
