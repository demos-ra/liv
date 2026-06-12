// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/pivot.ts]
//
// ONE instrument (sprint-wire-economy R6). No `view` enum: pivot() reads the Excel-register
// zones (rows · columns · slicer · level · top · filter · sort) and lays the SAME resolved
// dimension two ways. forest and sheet are two NAMED default configs (forestConfig /
// sheetConfig) over one engine — open, compute, return, gone. No stateful pivot object.
//
// RING-LOCAL FILTER (the R6 fix): `top` is a SHARE-OF-RING fraction — keep a node WHERE
// weight / Σ(weights at its concentric ring = same depth from the wearer) >= top. Ring-local
// and scale-invariant, the SAME semantic on both layouts (rows: ring-depth; columns: fan-
// depth). It replaces the old share-of-whole cutoff, which diluted deep heavy nodes against
// the whole and inverted them below shallow light ones. `filter` is the Selection (mark-ops
// / colorings) — never a hardcoded class list; the engine drops nothing on its own.

import type { Mark, Ref } from '@/features/F-present/config/mark-types'
import type {
  Dimension, FactRow, ThingId, Selection, PivotConfig, PivotSort,
  ForestNode, ForestResult, SheetCell, SheetRow, SheetResult, PivotResult, Thread,
} from '@/features/F-present/config/read-engine-types'
import { DEFAULT_FOREST_TOP, DEFAULT_SHEET_LEVEL } from '@/features/F-present/config/read-engine-types'

const ALL_OPS: Mark['op'][] = ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY']

// ── Named default configs (R7) — forest/sheet as two configs of the one engine ────
// Overridable: a reader passes any PivotConfig; these are just the wake-default shapes.
export function forestConfig(overrides: Partial<PivotConfig> = {}): PivotConfig {
  return { rows: 'lineage', top: DEFAULT_FOREST_TOP, sort: 'weight', filter: {}, ...overrides }
}
export function sheetConfig(slicer: ThingId, overrides: Partial<PivotConfig> = {}): PivotConfig {
  return { columns: 'line', slicer, level: DEFAULT_SHEET_LEVEL, sort: 'weight', filter: {}, ...overrides }
}

// resolve a Selection to concrete predicates (the Filter zone). Presets are defaults;
// explicit ops/colorings override them (nothing is hardcoded — a preset is a saved Selection).
function lens(show: Selection = {}): { opOK: (op: Mark['op']) => boolean; colorOK: (v: string) => boolean } {
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
function distinctPeers(dim: Dimension, refs: Ref[]): ThingId[] {
  return [...new Set(refs.map(dim.resolveRef).filter((p): p is ThingId => p !== null))]
}

// ── Concentric rings — depth from the wearer-core + the ring-local keep predicate ──
// depth(thing) = steps from the wearer-core (parent===null ⇒ depth 1). ringSum[d] = Σ of
// the weights at depth d. keep = weight / ringSum[depth] >= top (top undefined ⇒ keep all).
// This is the SHARE-OF-RING filter — the same predicate both layouts use.
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

export function pivot(config: PivotConfig, dim: Dimension, rows: FactRow[]): PivotResult {
  return config.columns === 'line' ? sheet(config, dim, rows) : forest(config, dim, rows)
}

// ── Forest (structure) — rows zone = lineage, nested by parent; root = wearer ──────
// Values = Thing.weight, AS-IS (the chain-ping sum from M3). Kept by the ring-local `top`,
// bounded by `level` rings, ordered by `sort`.
function forest(config: PivotConfig, dim: Dimension, rows: FactRow[]): ForestResult {
  const { opOK } = lens(config.filter)
  const things = dim.things
  const keep = ringKeeper(dim, config.top)
  const weightOf = (id: ThingId) => things.get(id)?.weight ?? 0
  const cmp = comparator(config.sort, weightOf)
  const maxLevel = config.level ?? Infinity

  // Σ-at-wearer = sum of the top lines' weights (every chain terminates at the wearer).
  let sigma = 0
  for (const t of things.values()) if (t.parent === null) sigma += t.weight

  // children of `id` (null = the wearer-core), kept by ring share, sorted. `depth` is the
  // ring the children sit at; once depth > level we stop descending.
  const childrenOf = (id: ThingId | null, depth: number): ThingId[] => {
    if (depth > maxLevel) return []
    return [...things.values()]
      .filter(t => t.parent === id && keep(t.id))
      .map(t => t.id)
      .sort(cmp)
  }

  const build = (id: ThingId, depth: number): ForestNode => {
    const t = things.get(id)!
    return { thing: id, label: t.label, weight: t.weight, children: childrenOf(id, depth + 1).map(c => build(c, depth + 1)) }
  }

  const root: ForestNode = {
    thing: '' as ThingId, label: '—', weight: sigma,        // '—' the wearer-core
    children: childrenOf(null, 1).map(c => build(c, 1)),
  }

  // threads — lateral RELATE relations, folded (Rule 4), gated by the Selection
  const threads: Thread[] = []
  if (opOK('RELATE')) {
    const seen = new Set<string>()
    for (const r of rows) {
      if (r.op !== 'RELATE') continue
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                            // Rule 5
      const sig = r.surface.toLowerCase() + '|' + [...peers].sort().join(',')
      if (seen.has(sig)) continue                                // fold identical
      seen.add(sig)
      threads.push({ word: r.surface, at: r.home, peers })
    }
  }

  return { view: 'forest', root, threads }
}

// ── Sheet (state) — columns zone = the slicer's direct line ───────────────────────
// Columns = ancestors | slicer | descendants (flat). Rows = sc (one shared time axis).
// Values = the RAW marks at each cell, split by op. `level` bounds BOTH the ancestor walk
// and the descendant fan; `top` keeps descendants by the same ring-local share; `sort`
// orders the descendant fan.
function sheet(config: PivotConfig, dim: Dimension, rows: FactRow[]): SheetResult {
  const { opOK, colorOK } = lens(config.filter)
  const things = dim.things
  const focus = config.slicer
  if (!focus || !things.has(focus)) return { view: 'sheet', columns: [], rows: [] }

  const span = config.level ?? Infinity
  const keep = ringKeeper(dim, config.top)
  const weightOf = (id: ThingId) => things.get(id)?.weight ?? 0
  const cmp = comparator(config.sort, weightOf)

  // ancestors: walk the single parent chain up `span` levels (root-most first).
  const ancestors: ThingId[] = []
  let cur = things.get(focus)!.parent
  let levels = 0
  while (cur && levels < span) { ancestors.unshift(cur); cur = things.get(cur)!.parent; levels++ }

  // descendants: BFS down the dependency children, flat, to `span` levels — kept by the
  // ring-local `top`, ordered by `sort`.
  const descendants: ThingId[] = []
  let frontier: ThingId[] = [focus]
  for (let d = 0; d < span; d++) {
    const next: ThingId[] = []
    const kids = [...things.values()].filter(t => frontier.includes(t.parent as ThingId) && keep(t.id)).map(t => t.id).sort(cmp)
    for (const id of kids) { descendants.push(id); next.push(id) }
    if (next.length === 0) break
    frontier = next
  }

  const columns = [...ancestors, focus, ...descendants]
  const colSet = new Set(columns)

  // a row contributes one (thing, sc, cell-entry): identity/RELATE/IDENTIFY/QUALIFY all
  // land on the thing they score, at the home sc.
  type Hit = { thing: ThingId; sc: number; entry: SheetCell[number] }
  const hits: Hit[] = []
  const push = (thing: ThingId | null, sc: number, entry: SheetCell[number]) => {
    if (thing && colSet.has(thing)) hits.push({ thing, sc, entry })
  }
  for (const r of rows) {
    if (!opOK(r.op)) continue
    if (r.op === 'identity') push(dim.resolveRef(r.home), r.home.sc, { op: 'identity', value: null, home: r.home })
    else if (r.op === 'IDENTIFY') push(dim.resolveRef(r.refs[0]), r.home.sc, { op: 'IDENTIFY', value: null, ref: r.refs[0], home: r.home })
    else if (r.op === 'QUALIFY') {
      if (r.value !== null && !colorOK(r.value)) continue
      push(dim.resolveRef(r.refs[0]), r.home.sc, { op: 'QUALIFY', value: r.value, ref: r.refs[0], home: r.home })
    } else if (r.op === 'RELATE') {
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                            // Rule 5
      for (const p of peers) push(p, r.home.sc, { op: 'RELATE', value: r.surface, ref: r.home, home: r.home })
    }
  }

  const scSet = [...new Set(hits.map(h => h.sc))].sort((a, b) => a - b)
  const sheetRows: SheetRow[] = scSet.map(sc => {
    const cells: Record<ThingId, SheetCell> = {}
    for (const h of hits) {
      if (h.sc !== sc) continue
      ;(cells[h.thing] ??= []).push(h.entry)                    // dynamic width — widens on multi-mark same-sc
    }
    return { sc, cells }
  })

  return { view: 'sheet', columns, rows: sheetRows }
}
