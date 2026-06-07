// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/pivot.ts]
//
// One engine, two configs over the resolved+weighted dimension. A PivotTable:
// ONE source (the fact table), four fixed zones per view (Filter · Rows · Columns
// · Values), computed as a PURE function — open, compute, return, gone. No
// stateful pivot object, no cell edit, no cache. The two views are two zone
// layouts of the same source, not two code paths. `show` is the Filter zone +
// field-value visibility — never a hardcoded class list; the engine drops nothing
// on its own. Presets are overridable saved Selections owning no taxonomy.

import type { Mark, Ref } from '@/features/F-present/config/mark-types'
import type {
  Dimension, FactRow, ThingId, Selection, PivotConfig,
  ForestNode, ForestResult, SheetCell, SheetRow, SheetResult, PivotResult, Thread,
} from '@/features/F-present/config/read-engine-types'

const ALL_OPS: Mark['op'][] = ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY']

// resolve a Selection to concrete predicates. Presets are defaults; explicit
// ops/colorings override them (proving nothing is hardcoded — the preset is just
// a saved Selection reachable explicitly).
function lens(show: Selection): { opOK: (op: Mark['op']) => boolean; colorOK: (v: string) => boolean } {
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

// distinct resolved peers of a RELATE row (Rule 5 lives at the relation site)
function distinctPeers(dim: Dimension, refs: Ref[]): ThingId[] {
  return [...new Set(refs.map(dim.resolveRef).filter((p): p is ThingId => p !== null))]
}

export function pivot(config: PivotConfig, dim: Dimension, rows: FactRow[]): PivotResult {
  return config.view === 'forest' ? forest(config, dim, rows) : sheet(config, dim, rows)
}

// ── Forest (structure) ──────────────────────────────────────────────────────────
// Rows = things nested by parent (the lineage). Values = Thing.weight, AS-IS (it is
// already the chain-ping sum from M3; M4 never re-aggregates). Root = wearer.
function forest(config: PivotConfig, dim: Dimension, rows: FactRow[]): ForestResult {
  const { opOK } = lens(config.show)
  const things = dim.things

  // Σ-at-wearer = sum of the top lines' weights (every chain terminates at the wearer)
  let sigma = 0
  for (const t of things.values()) if (t.parent === null) sigma += t.weight

  const cutoff = config.weightCutoff
  const keep = (id: ThingId): boolean => {
    if (cutoff === undefined || sigma <= 0) return true
    return things.get(id)!.weight / sigma >= cutoff       // share-of-whole fraction, scale-invariant
  }

  const childrenOf = (id: ThingId | null): ThingId[] =>
    [...things.values()]
      .filter(t => t.parent === id && keep(t.id))
      .sort((a, b) => b.weight - a.weight || (a.id < b.id ? -1 : 1))
      .map(t => t.id)

  const build = (id: ThingId): ForestNode => {
    const t = things.get(id)!
    return { thing: id, label: t.label, weight: t.weight, children: childrenOf(id).map(build) }
  }

  const root: ForestNode = {
    thing: '' as ThingId, label: '\u2014', weight: sigma,    // '—' the wearer-core
    children: childrenOf(null).map(build),
  }

  // threads — lateral RELATE relations, folded (Rule 4), gated by the Selection
  const threads: Thread[] = []
  if (opOK('RELATE')) {
    const seen = new Set<string>()
    for (const r of rows) {
      if (r.op !== 'RELATE') continue
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                       // Rule 5
      const sig = r.surface.toLowerCase() + '|' + [...peers].sort().join(',')
      if (seen.has(sig)) continue                           // fold identical
      seen.add(sig)
      threads.push({ word: r.surface, at: r.home, peers })
    }
  }

  return { view: 'forest', root, threads }
}

// ── Sheet (state) ─────────────────────────────────────────────────────────────
// Columns = the focus's direct line: ancestors | focus | descendants (flat —
// a grandchild is a further column, never nested). Rows = sc (one shared time
// axis). Values = the RAW marks at each cell, split by op, dynamic width, sparse —
// no aggregation, no synthesized state.
function sheet(config: PivotConfig, dim: Dimension, rows: FactRow[]): SheetResult {
  const { opOK, colorOK } = lens(config.show)
  const things = dim.things
  const focus = config.focus
  if (!focus || !things.has(focus)) return { view: 'sheet', columns: [], rows: [] }

  const up = config.ancestorsUp ?? Infinity
  const down = config.descendantsDown ?? Infinity

  // ancestors: walk the single parent chain up (root-most first)
  const ancestors: ThingId[] = []
  let cur = things.get(focus)!.parent
  let levels = 0
  while (cur && levels < up) { ancestors.unshift(cur); cur = things.get(cur)!.parent; levels++ }

  // descendants: BFS down the dependency children, flat, to `down` levels
  const descendants: ThingId[] = []
  let frontier: ThingId[] = [focus]
  for (let d = 0; d < down; d++) {
    const next: ThingId[] = []
    for (const id of frontier)
      for (const t of things.values())
        if (t.parent === id) { descendants.push(t.id); next.push(t.id) }
    if (next.length === 0) break
    frontier = next
  }

  const columns = [...ancestors, focus, ...descendants]
  const colSet = new Set(columns)

  // a row contributes one (thing, sc, cell-entry): identity/RELATE/IDENTIFY/QUALIFY
  // all land on the thing they score, at the home sc.
  type Hit = { thing: ThingId; sc: number; entry: SheetCell[number] }
  const hits: Hit[] = []
  const push = (thing: ThingId | null, sc: number, entry: SheetCell[number]) => {
    if (thing && colSet.has(thing)) hits.push({ thing, sc, entry })
  }
  for (const r of rows) {
    if (!opOK(r.op)) continue
    if (r.op === 'identity') push(dim.resolveRef(r.home), r.home.sc, { op: 'identity', value: null })
    else if (r.op === 'IDENTIFY') push(dim.resolveRef(r.refs[0]), r.home.sc, { op: 'IDENTIFY', value: null, ref: r.refs[0] })
    else if (r.op === 'QUALIFY') {
      if (r.value !== null && !colorOK(r.value)) continue
      push(dim.resolveRef(r.refs[0]), r.home.sc, { op: 'QUALIFY', value: r.value, ref: r.refs[0] })
    } else if (r.op === 'RELATE') {
      const peers = distinctPeers(dim, r.refs)
      if (peers.length < 2) continue                       // Rule 5
      for (const p of peers) push(p, r.home.sc, { op: 'RELATE', value: r.surface, ref: r.home })
    }
  }

  const scSet = [...new Set(hits.map(h => h.sc))].sort((a, b) => a - b)
  const sheetRows: SheetRow[] = scSet.map(sc => {
    const cells: Record<ThingId, SheetCell> = {}
    for (const h of hits) {
      if (h.sc !== sc) continue
      ;(cells[h.thing] ??= []).push(h.entry)               // dynamic width — widens on multi-mark same-sc
    }
    return { sc, cells }
  })

  return { view: 'sheet', columns, rows: sheetRows }
}
