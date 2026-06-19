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
import { weighDimension } from '@/features/F-present/domain/chain-ping'
import { currentFocus } from '@/features/F-present/domain/session-window'
import { pivot, lineageView, timelineView, lineageConfig, timelineConfig } from '@/features/F-present/domain/pivot'
import { renderGrid } from '@/features/F-present/domain/render-present'
import { createDbPresentMarkStore } from '@/features/F-present/exec/present-mark-store-db'
import type { PresentMarkStore } from '@/features/F-present/app/present-store'
import type { PivotConfig, RowAxis, ColAxis, ValueField, PivotSort, Selection } from '@/features/F-present/config/read-engine-types'
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

// ── search — the read door as region × lens (the text-pivot) ───────────────────────
// Two ORTHOGONAL axes that compose; neither is a second way to do the other:
//   region (WHERE) — which part of the substrate: turn | span | thing | all. The old
//     turn|span|thing live HERE now (a LookupSelector IS a region), not as a parallel path.
//   lens   (HOW)   — raw → numbered cells (cellsOf, to copy a coordinate); pivot → the
//     rendered grid (pivot → renderGrid, the Excel view), its zones exposed as text commands.
// Region scopes the data (for raw it selects the cells via lookup; for a pivot it scopes the
// transcript the table computes over). The ENGINE is byte-untouched — search only COMPOSES
// pivot / cellsOf / renderGrid (Blueprint §2.2 "pivot takes any config; a view is just data").
// A returned pivot grid renders coordinates inside it, so navigation and coordinate-fetch are
// one verb. Stateless: each call carries a full spec and the grid recomputes every read.
export type SearchRegion =
  | { kind: 'turn'; who: Who; sc: number }
  | { kind: 'span'; from: number; to: number; who?: Who }
  | { kind: 'thing'; name: string }
  | { kind: 'all' }

export type SearchLens =
  | { view: 'raw' }
  | { view: 'pivot'; rows?: RowAxis; columns?: ColAxis; values?: ValueField; focus?: string; depth?: number; top?: number; sort?: PivotSort; filter?: Selection }

export type SearchSpec = { region?: SearchRegion; lens: SearchLens }

export type SearchResult =
  | { ok: true;  view: 'raw';   region: SearchRegion; cells: LookupCell[] }
  | { ok: true;  view: 'pivot'; region: SearchRegion; text: string }
  | { ok: false; region: SearchRegion; message: string }

// scope the transcript to a region (the data fed to a pivot). all → full (≡ the present's
// tables). thing → the turns where the thing appears (a local pivot). turn/span → those turns.
function scopeTranscript(transcript: RawTurn[], region: SearchRegion, store: Awaited<ReturnType<PresentMarkStore['read']>>): RawTurn[] {
  if (region.kind === 'all') return transcript
  if (region.kind === 'turn') return transcript.filter(t => t.who === region.who && t.sc === region.sc)
  if (region.kind === 'span') {
    const lo = Math.min(region.from, region.to), hi = Math.max(region.from, region.to)
    return transcript.filter(t => t.sc >= lo && t.sc <= hi && (region.who === undefined || t.who === region.who))
  }
  const dim = resolveDimension(buildFactTable(transcript, store))
  const id = dim.resolveRef(region.name)
  const thing = id ? dim.things.get(id) : undefined
  if (!thing) return []
  const scs = new Set(thing.members.map(m => m.sc))
  return transcript.filter(t => scs.has(t.sc))
}

export async function search(userId: string, spec: SearchSpec, deps: LookupDeps = defaultDeps()): Promise<SearchResult> {
  const region: SearchRegion = spec.region ?? { kind: 'all' }

  // ── RAW lens: region selects the cells (the coordinate-fetch path) ──
  if (spec.lens.view === 'raw') {
    if (region.kind === 'all') {
      const transcript = await deps.readTranscript(userId)
      return { ok: true, view: 'raw', region, cells: transcript.flatMap(cellsOf) }
    }
    // a turn|span|thing region IS a LookupSelector — reuse the raw selector, no parallel path.
    const r = await lookup(userId, region, deps)
    return r.ok
      ? { ok: true, view: 'raw', region, cells: r.cells }
      : { ok: false, region, message: r.message }
  }

  // ── PIVOT lens: region scopes the data; the lens picks the table (zones over the engine) ──
  const lens = spec.lens
  const transcript = await deps.readTranscript(userId)
  const store = await deps.store.read(userId)
  const rows = buildFactTable(scopeTranscript(transcript, region, store), store)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)

  const slicer = lens.focus ? (dim.resolveRef(lens.focus) ?? undefined) : undefined
  if (lens.focus && !slicer) return { ok: false, region, message: `no thing named "${lens.focus}" to focus` }

  const overrides: Partial<PivotConfig> = {}
  if (lens.columns !== undefined) overrides.columns = lens.columns
  if (lens.values  !== undefined) overrides.values  = lens.values
  if (lens.depth   !== undefined) overrides.level   = lens.depth
  if (lens.top     !== undefined) overrides.top     = lens.top
  if (lens.sort    !== undefined) overrides.sort    = lens.sort
  if (lens.filter  !== undefined) overrides.filter  = lens.filter

  if ((lens.rows ?? 'lineage') === 'time') {
    const anchor = slicer ?? currentFocus(dim)
    if (!anchor) return { ok: false, region, message: 'no focus available for a timeline view' }
    const text = renderGrid(pivot(timelineConfig(anchor, overrides), dim, rows), timelineView(anchor).render)
    return { ok: true, view: 'pivot', region, text }
  }
  const text = renderGrid(pivot(lineageConfig({ ...overrides, ...(slicer ? { slicer } : {}) }), dim, rows), lineageView.render)
  return { ok: true, view: 'pivot', region, text }
}

// ── parseSearchSpec — the ONE validator for the region × lens payload ───────────────
// The wire door and the REST route are both TRANSPORT; this is the sole validator (one home,
// symmetric with emissionFromStructured for compose). A read door: unknown extras are ignored;
// region defaults to { kind: 'all' }; lens is required. Bad enums are named (fail-closed) so an
// invalid zone never reaches the engine's registry lookup. Returns a typed SearchSpec.
const ROW_AXES = ['lineage', 'time'] as const
const COL_AXES = ['single', 'line'] as const
const VALUE_FIELDS = ['weight', 'marks'] as const
const PIVOT_SORTS = ['weight', 'id'] as const
const FILTER_PRESETS = ['skeleton', 'verbatim', 'evolution'] as const

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function parseRegion(raw: unknown): { ok: true; region: SearchRegion } | { ok: false; message: string } {
  if (raw === undefined || raw === null) return { ok: true, region: { kind: 'all' } }
  if (!isObj(raw)) return { ok: false, message: 'search region: must be an object { kind: turn | span | thing | all }' }
  switch (raw.kind) {
    case 'all': return { ok: true, region: { kind: 'all' } }
    case 'turn':
      if (raw.who !== 'wearer' && raw.who !== 'llm') return { ok: false, message: 'search region turn: who must be wearer | llm' }
      if (typeof raw.sc !== 'number' || !Number.isFinite(raw.sc)) return { ok: false, message: 'search region turn: sc must be a number' }
      return { ok: true, region: { kind: 'turn', who: raw.who, sc: raw.sc } }
    case 'span':
      if (typeof raw.from !== 'number' || !Number.isFinite(raw.from) || typeof raw.to !== 'number' || !Number.isFinite(raw.to))
        return { ok: false, message: 'search region span: from and to must be numbers' }
      return { ok: true, region: { kind: 'span', from: raw.from, to: raw.to, who: raw.who === 'wearer' || raw.who === 'llm' ? raw.who : undefined } }
    case 'thing':
      if (typeof raw.name !== 'string') return { ok: false, message: 'search region thing: name must be a string' }
      return { ok: true, region: { kind: 'thing', name: raw.name } }
    default:
      return { ok: false, message: 'search region: kind must be turn | span | thing | all' }
  }
}

function parseFilter(raw: unknown): { ok: true; filter: Selection } | { ok: false; message: string } {
  if (!isObj(raw)) return { ok: false, message: 'search filter: must be an object' }
  const filter: Selection = {}
  if (raw.ops !== undefined) {
    if (!Array.isArray(raw.ops) || !raw.ops.every(o => typeof o === 'string')) return { ok: false, message: 'search filter.ops: must be a string array' }
    filter.ops = raw.ops as Selection['ops']
  }
  if (raw.colorings !== undefined) {
    const c = raw.colorings
    if (c === 'all') filter.colorings = 'all'
    else if (isObj(c) && Array.isArray(c.show)) filter.colorings = { show: (c.show as unknown[]).map(String) }
    else if (isObj(c) && Array.isArray(c.hide)) filter.colorings = { hide: (c.hide as unknown[]).map(String) }
    else return { ok: false, message: "search filter.colorings: 'all' | { show: [...] } | { hide: [...] }" }
  }
  if (raw.preset !== undefined) {
    if (!(FILTER_PRESETS as readonly string[]).includes(raw.preset as string)) return { ok: false, message: 'search filter.preset: skeleton | verbatim | evolution' }
    filter.preset = raw.preset as Selection['preset']
  }
  return { ok: true, filter }
}

function parseLens(raw: unknown): { ok: true; lens: SearchLens } | { ok: false; message: string } {
  if (!isObj(raw)) return { ok: false, message: 'search lens: required object { view: raw | table }' }
  if (raw.view === 'raw') return { ok: true, lens: { view: 'raw' } }
  // PUBLIC lens vocabulary (WP5): the model types `table`; the engine stays `pivot`/grid. This is
  // the ONE translation point — `table` is mapped to the internal pivot lens here, nowhere else.
  if (raw.view !== 'table') return { ok: false, message: 'search lens: view must be raw | table' }
  const lens: Extract<SearchLens, { view: 'pivot' }> = { view: 'pivot' }
  if (raw.rows !== undefined) { if (!(ROW_AXES as readonly string[]).includes(raw.rows as string)) return { ok: false, message: 'search lens.rows: lineage | time' }; lens.rows = raw.rows as RowAxis }
  if (raw.columns !== undefined) { if (!(COL_AXES as readonly string[]).includes(raw.columns as string)) return { ok: false, message: 'search lens.columns: single | line' }; lens.columns = raw.columns as ColAxis }
  if (raw.values !== undefined) { if (!(VALUE_FIELDS as readonly string[]).includes(raw.values as string)) return { ok: false, message: 'search lens.values: weight | marks' }; lens.values = raw.values as ValueField }
  if (raw.focus !== undefined) { if (typeof raw.focus !== 'string') return { ok: false, message: 'search lens.focus: a thing name (string)' }; lens.focus = raw.focus }
  if (raw.depth !== undefined) { if (typeof raw.depth !== 'number' || !Number.isFinite(raw.depth)) return { ok: false, message: 'search lens.depth: a number' }; lens.depth = raw.depth }
  if (raw.top !== undefined) { if (typeof raw.top !== 'number' || !Number.isFinite(raw.top)) return { ok: false, message: 'search lens.top: a number (fraction)' }; lens.top = raw.top }
  if (raw.sort !== undefined) { if (!(PIVOT_SORTS as readonly string[]).includes(raw.sort as string)) return { ok: false, message: 'search lens.sort: weight | id' }; lens.sort = raw.sort as PivotSort }
  if (raw.filter !== undefined) { const f = parseFilter(raw.filter); if (!f.ok) return f; lens.filter = f.filter }
  return { ok: true, lens }
}

export function parseSearchSpec(raw: unknown): { ok: true; spec: SearchSpec } | { ok: false; message: string } {
  const r = isObj(raw) ? raw : {}
  const region = parseRegion(r.region)
  if (!region.ok) return region
  const lens = parseLens(r.lens)
  if (!lens.ok) return lens
  return { ok: true, spec: { region: region.region, lens: lens.lens } }
}
