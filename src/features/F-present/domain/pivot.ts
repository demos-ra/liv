// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/pivot.ts]
//
// ONE engine (sprint pivot-compute-close — finishing R6's compute half). pivot() is a FIXED
// COMPOSITION over three config-keyed zone-function registries — a row-source, a column-source
// and a cell-filler. It indexes the registries by the config's zone names and runs the SAME
// loop for every assignment: there is no `if (table)`, no `if (columns==='line')`, no
// `if (value-type)`. The two cuts are two NAMED configs (lineageConfig / timelineConfig) — open,
// compose, return, gone. Adding a table = a new config triple (the registries are the tool); the
// engine body never changes. That is "the engine accommodates, never special-cases."
//
// RING-LOCAL FILTER (the R6 fix): `top` is a SHARE-OF-RING fraction — keep a node WHERE
// weight / Σ(weights at its concentric ring = same depth from the wearer) >= top. Ring-local
// and scale-invariant, the SAME semantic on both axes. On the `line` column axis it trims
// DESCENDANTS only — the ancestor chain to the wearer is taken whole (L0-2). `filter` is the
// Selection (mark-ops / colorings) — never a hardcoded class list; the engine drops nothing on
// its own.

import type { Mark } from '@/features/F-present/config/mark-types'
import type {
  Dimension, FactRow, ThingId, Selection, PivotConfig, PivotSort, RowAxis, ColAxis, ValueField,
  ColKey, RowKey, Grid, GridRow, GridCell, MarkEntry, Thread, PresentView,
} from '@/features/F-present/config/read-engine-types'
import { VALUE_COL, DEFAULT_LINEAGE_TOP, DEFAULT_TIMELINE_LEVEL } from '@/features/F-present/config/read-engine-types'

const ALL_OPS: Mark['op'][] = ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY']

// the resolved Selection predicates (the Filter zone), built once per read.
type Lens = { opOK: (op: Mark['op']) => boolean; colorOK: (v: string) => boolean }

// ── Named configs (the two cuts as data over the one engine) ──────────────────────
// Overridable: a reader passes any PivotConfig; these are the wake-default shapes.
export function lineageConfig(overrides: Partial<PivotConfig> = {}): PivotConfig {
  return { rows: 'lineage', columns: 'single', values: 'weight', top: DEFAULT_LINEAGE_TOP, sort: 'weight', filter: {}, ...overrides }
}
export function timelineConfig(slicer: ThingId, overrides: Partial<PivotConfig> = {}): PivotConfig {
  return { rows: 'time', columns: 'line', values: 'marks', slicer, level: DEFAULT_TIMELINE_LEVEL, sort: 'weight', filter: {}, ...overrides }
}

// ── A "table" is pure data: assignment (which zones) + render spec (which layout) ──
// Add-a-table = add a PresentView; touch neither engine nor renderer. (Render specs are plain
// data — no import of the renderer; the orchestrator hands grid + spec to renderGrid.)
export const lineageView: PresentView = {
  assignment: lineageConfig(),
  render: { header: 'structure — lineage by weight; root = wearer:', columnsLine: false, cellLayout: 'inline', threadsBlock: true },
}
export function timelineView(slicer: ThingId): PresentView {
  return {
    assignment: timelineConfig(slicer),
    render: { header: "state — columns = the focus's direct line:", columnsLine: true, cellLayout: 'matrix', threadsBlock: false },
  }
}

// resolve a Selection to concrete predicates. Presets are defaults; explicit ops/colorings
// override them (nothing is hardcoded — a preset is a saved Selection).
function makeLens(show: Selection = {}): Lens {
  let baseOps: Mark['op'][] = ALL_OPS
  let baseColorAll = true
  if (show.preset === 'skeleton') { baseOps = ['identity', 'RELATE']; baseColorAll = false }
  else if (show.preset === 'evolution') { baseOps = ['QUALIFY'] }
  const ops = new Set<Mark['op']>(show.ops ?? baseOps)
  const c = show.colorings
  const colorOK = (v: string): boolean =>
    c === 'all' ? true
    : c && 'show' in c ? c.show.includes(v)
    : c && 'hide' in c ? !c.hide.includes(v)
    : baseColorAll
  return { opOK: (op) => ops.has(op), colorOK }
}

// row/child comparator from the sort register (default 'weight' then id — preserved).
function comparator(sort: PivotSort | undefined, weightOf: (id: ThingId) => number) {
  if (sort === 'id') return (a: ThingId, b: ThingId) => (a < b ? -1 : a > b ? 1 : 0)
  return (a: ThingId, b: ThingId) => weightOf(b) - weightOf(a) || (a < b ? -1 : 1)
}

// distinct resolved peers of a RELATE row (Rule 5 lives at the relation site)
function distinctPeers(dim: Dimension, refs: FactRow['refs']): ThingId[] {
  return [...new Set(refs.map(dim.resolveRef).filter((p): p is ThingId => p !== null))]
}

// ── Concentric rings — depth from the wearer-core + the ring-local keep predicate ──
// depth(thing) = steps from the wearer-core (parent===null ⇒ depth 1). ringSum[d] = Σ of
// the weights at depth d. keep = weight / ringSum[depth] >= top (top undefined ⇒ keep all).
function rings(dim: Dimension): { depthOf: (id: ThingId) => number; ringSum: Map<number, number> } {
  const depthCache = new Map<ThingId, number>()
  const depthOf = (id: ThingId): number => {
    const seen = new Set<ThingId>()
    let d = 0, cur: ThingId | null = id
    while (cur !== null && !seen.has(cur)) {
      const cached = depthCache.get(cur)
      if (cached !== undefined) { d += cached; break }
      seen.add(cur); d += 1
      cur = dim.things.get(cur)?.parent ?? null
    }
    depthCache.set(id, d)
    return d
  }
  const ringSum = new Map<number, number>()
  for (const t of dim.things.values()) {
    const d = depthOf(t.id)
    ringSum.set(d, (ringSum.get(d) ?? 0) + t.weight)
  }
  return { depthOf, ringSum }
}

function ringKeeper(dim: Dimension, top: number | undefined) {
  const { depthOf, ringSum } = rings(dim)
  return (id: ThingId): boolean => {
    if (top === undefined || top <= 0) return true
    const d = depthOf(id)
    const sum = ringSum.get(d) ?? 0
    if (sum <= 0) return true
    return (dim.things.get(id)?.weight ?? 0) / sum >= top      // share-of-ring, scale-invariant
  }
}

// ── Row sources (the row-zone, selected by config.rows) ───────────────────────────
// lineage: flat rows carrying depth/parent + the denormalized label, emitted DFS PRE-ORDER
// (parent immediately before its children, siblings in sort order) so render-time indent
// reproduces the nested walk byte-for-byte. Ring-trimmed by `top`, bounded by `level`. The
// synthetic root (key '', label '—') is the wearer-core; its value is Σ the top lines (placed
// by the cell-filler). Ignores `columns`/`lens` — the tree is not Selection-gated (threads are).
function lineageRows(dim: Dimension, _rows: FactRow[], config: PivotConfig, _columns: ColKey[], _lens: Lens): GridRow[] {
  const things = dim.things
  const keep = ringKeeper(dim, config.top)
  const weightOf = (id: ThingId) => things.get(id)?.weight ?? 0
  const cmp = comparator(config.sort, weightOf)
  const maxLevel = config.level ?? Infinity

  // children of `id` (null = the wearer-core), kept by ring share, sorted. `depth` is the ring
  // the children sit at; once depth > level we stop descending.
  const childrenOf = (id: ThingId | null, depth: number): ThingId[] =>
    depth > maxLevel ? []
      : [...things.values()].filter(t => t.parent === id && keep(t.id)).map(t => t.id).sort(cmp)

  const out: GridRow[] = []
  out.push({ key: '' as ThingId, label: '—', depth: 0, parent: null, cells: {} })    // wearer-core root
  const walk = (id: ThingId, depth: number, parent: RowKey) => {
    const t = things.get(id)!
    out.push({ key: id, label: t.label, depth, parent, cells: {} })
    for (const c of childrenOf(id, depth + 1)) walk(c, depth + 1, id)
  }
  for (const c of childrenOf(null, 1)) walk(c, 1, '' as ThingId)
  return out
}

// time: one row per sc, label `sc{n}`, depth 0. Emitted for exactly the scs with a hit on a
// COLUMN member (β: columns are computed first and handed in) — a hit being a lens-passed mark
// resolving to a column thing, so the row set matches the cell content (no empty rows).
function timeRows(dim: Dimension, rows: FactRow[], _config: PivotConfig, columns: ColKey[], lens: Lens): GridRow[] {
  const colSet = new Set<ColKey>(columns)
  const seen = new Set<number>()
  const scs: number[] = []
  const note = (sc: number) => { if (!seen.has(sc)) { seen.add(sc); scs.push(sc) } }
  for (const r of rows) {
    if (!lens.opOK(r.op)) continue
    if (r.op === 'RELATE') {
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                                   // Rule 5
      if (peers.some(p => colSet.has(p))) note(r.home.sc)
    } else if (r.op === 'QUALIFY') {
      if (r.value !== null && !lens.colorOK(r.value)) continue
      const t = dim.resolveRef(r.refs[0]); if (t && colSet.has(t)) note(r.home.sc)
    } else {                                                           // identity → home ; IDENTIFY → target
      const t = r.op === 'identity' ? dim.resolveRef(r.home) : dim.resolveRef(r.refs[0])
      if (t && colSet.has(t)) note(r.home.sc)
    }
  }
  scs.sort((a, b) => a - b)
  return scs.map(sc => ({ key: sc, label: `sc${sc}`, depth: 0, parent: null, cells: {} }))
}

// ── Column sources (the column-zone, selected by config.columns) ──────────────────
const singleColumn = (): ColKey[] => [VALUE_COL]

// the slicer's direct line: ancestors (WHOLE — never `top`-trimmed; L0-2) | focus | descendants
// (BFS, `top`-trimmed, `sort`-ordered). `level` bounds both spans.
function lineColumns(dim: Dimension, _rows: FactRow[], config: PivotConfig): ColKey[] {
  const things = dim.things
  const focus = config.slicer
  if (!focus || !things.has(focus)) return []
  const span = config.level ?? Infinity
  const keep = ringKeeper(dim, config.top)
  const weightOf = (id: ThingId) => things.get(id)?.weight ?? 0
  const cmp = comparator(config.sort, weightOf)

  // ANCESTORS — taken WHOLE up `span` levels. `top` NEVER trims here: severing the line to the
  // wearer is a hard fail (L0-2). Only `level` bounds how far up the chain is shown.
  const ancestors: ThingId[] = []
  let cur = things.get(focus)!.parent
  let levels = 0
  while (cur && levels < span) { ancestors.unshift(cur); cur = things.get(cur)!.parent; levels++ }

  // DESCENDANTS — BFS down the dependency children, flat, to `span` levels, kept by the
  // ring-local `top`, ordered by `sort`. Trimming applies to descendants ONLY.
  const descendants: ThingId[] = []
  let frontier: ThingId[] = [focus]
  for (let d = 0; d < span; d++) {
    const next: ThingId[] = []
    const kids = [...things.values()].filter(t => frontier.includes(t.parent as ThingId) && keep(t.id)).map(t => t.id).sort(cmp)
    for (const id of kids) { descendants.push(id); next.push(id) }
    if (next.length === 0) break
    frontier = next
  }
  return [...ancestors, focus, ...descendants]
}

// ── Cell fillers (the value-zone, selected by config.values) ──────────────────────
// The engine never inspects the value's type — it indexes CELL_FILLERS[config.values] and
// places the result. Each filler reads its OWN field; neither knows the other exists.
//
// weight: the scalar at this lineage row. A real thing carries Thing.weight; the synthetic root
// ('') carries Σ the top lines — the wearer-core mass.
function weightCell(rowKey: RowKey, _colKey: ColKey, dim: Dimension, _rows: FactRow[], _config: PivotConfig, _lens: Lens): GridCell {
  const t = dim.things.get(rowKey as ThingId)
  if (t) return { kind: 'weight', weight: t.weight }
  let sigma = 0
  for (const x of dim.things.values()) if (x.parent === null) sigma += x.weight
  return { kind: 'weight', weight: sigma }
}

// marks: the raw marks at (thing = colKey, sc = rowKey), split by op at render. identity /
// RELATE / IDENTIFY / QUALIFY all land on the thing they score, at the home sc; Selection-gated.
function marksCell(rowKey: RowKey, colKey: ColKey, dim: Dimension, rows: FactRow[], _config: PivotConfig, lens: Lens): GridCell {
  const sc = rowKey as number
  const thing = colKey as ThingId
  const marks: MarkEntry[] = []
  for (const r of rows) {
    if (!lens.opOK(r.op) || r.home.sc !== sc) continue
    if (r.op === 'identity') {
      if (dim.resolveRef(r.home) === thing) marks.push({ op: 'identity', value: null, home: r.home })
    } else if (r.op === 'IDENTIFY') {
      if (dim.resolveRef(r.refs[0]) === thing) marks.push({ op: 'IDENTIFY', value: null, ref: r.refs[0], home: r.home })
    } else if (r.op === 'QUALIFY') {
      if (r.value !== null && !lens.colorOK(r.value)) continue
      if (dim.resolveRef(r.refs[0]) === thing) marks.push({ op: 'QUALIFY', value: r.value, ref: r.refs[0], home: r.home })
    } else if (r.op === 'RELATE') {
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                                   // Rule 5
      if (peers.includes(thing)) marks.push({ op: 'RELATE', value: r.surface, ref: r.home, home: r.home })
    }
  }
  return { kind: 'marks', marks }
}

// ── Threads — the lateral RELATE overlay, derived every read, generically (no table branch) ──
// Folded (Rule 4), gated by the Selection. Ephemeral: a field on the read-time Grid, persisted
// nowhere. Shown iff the table's RenderSpec.threadsBlock (lineage:true; timeline:false — RELATE
// rides in its cells).
function deriveThreads(dim: Dimension, rows: FactRow[], lens: Lens): Thread[] {
  const threads: Thread[] = []
  if (!lens.opOK('RELATE')) return threads
  const seen = new Set<string>()
  for (const r of rows) {
    if (r.op !== 'RELATE') continue
    const peers = distinctPeers(dim, r.refs)
    if (peers.length < 2) continue                                     // Rule 5
    const sig = r.surface.toLowerCase() + '|' + [...peers].sort().join(',')
    if (seen.has(sig)) continue                                        // fold identical
    seen.add(sig)
    threads.push({ word: r.surface, at: r.home, peers })
  }
  return threads
}

// ── The registries — the tool; indexed by config, never branched on ───────────────
const ROW_SOURCES: Record<RowAxis, (dim: Dimension, rows: FactRow[], config: PivotConfig, columns: ColKey[], lens: Lens) => GridRow[]> = {
  lineage: lineageRows,
  time:    timeRows,
}
const COLUMN_SOURCES: Record<ColAxis, (dim: Dimension, rows: FactRow[], config: PivotConfig) => ColKey[]> = {
  single: singleColumn,
  line:   lineColumns,
}
const CELL_FILLERS: Record<ValueField, (rowKey: RowKey, colKey: ColKey, dim: Dimension, rows: FactRow[], config: PivotConfig, lens: Lens) => GridCell> = {
  weight: weightCell,
  marks:  marksCell,
}

// ── The one engine — a fixed composition; the SAME loop for every assignment ───────
// Columns first (β: time rows gate on column hits), then rows, then place each value
// type-agnostically. Indexing a config-keyed map is composition, not a branch.
export function pivot(config: PivotConfig, dim: Dimension, rows: FactRow[]): Grid {
  const lens     = makeLens(config.filter)
  const columns  = COLUMN_SOURCES[config.columns](dim, rows, config)
  const gridRows = ROW_SOURCES[config.rows](dim, rows, config, columns, lens)
  const fill     = CELL_FILLERS[config.values]
  for (const r of gridRows)
    for (const c of columns)
      r.cells[c] = fill(r.key, c, dim, rows, config, lens)
  const threads  = deriveThreads(dim, rows, lens)
  return { columns, rows: gridRows, threads }
}
