// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/read-engine-types.ts]
//
// The typed boundary the whole read engine imports by type (W-ATOM). Declared at
// origin (A6). No word-class, no taxonomy: the engine owns no list of
// filler/article/claim-status. What shows is a reader Selection (M4), never a
// stored class. Geometry (line/weight) is computed at read (M2/M3), never stored.

import type { Coord } from '@/core/types/substrate-raw.types'
import type { Mark, Ref } from '@/features/F-present/config/mark-types'

// ONE flat fact-table row = one mark joined to the word at its home (M1 fills it).
// This is the PivotTable SOURCE: one row per record, fixed fields, never edited.
// No word-class is stamped — the engine owns no taxonomy of filler/article/claim-status.
export type FactRow = {
  home: Coord            // (who, sc, pos) — the address
  surface: string        // the raw word at home (from substrate; frozen). For RELATE this IS the chord's name (anchor, not a payload).
  op: Mark['op']         // identity | RELATE | QUALIFY | IDENTIFY
  value: string | null   // QUALIFY coloring (OPEN string), else null
  refs: Ref[]            // RELATE peers / QUALIFY|IDENTIFY target — addresses, never copied content
}

export type ThingId = string                       // branded: the cluster root key

// A resolved dimension member. label = modal surface. parent = the ONE direct line toward the
// wearer (null = terminates whole at the wearer-core). weight = chain-ping summed roll-up (M3).
export type Thing = {
  id: ThingId
  label: string
  members: Coord[]       // all surfaces (trunk + vines + pronouns) welded into this one column
  weight: number         // summed mass rolled up the line — NOT a count
  parent: ThingId | null
}

// A relation is a field, not hierarchy (lateral; the line is M3's parent chain).
export type Thread = { word: string; at: Coord; peers: ThingId[] }

// The resolved dimension — declared at R0 (the origin) so M2 builds it and M3/M4 consume it all via R0.
// (The tree has zero R1->R1 precedent; placing the shared shape here keeps every domain module R0-only.)
export type Dimension = { things: Map<ThingId, Thing>; resolveRef: (r: Ref) => ThingId | null }

// The reader's selection — Excel-style. The engine owns the four ZONES (fixed per view, below);
// the reader picks which field-VALUES are in play, per call. Nothing is hardcoded to drop.
//   ops              — which mark kinds are in play (omit => all)
//   colorings        — 'all' | { show: string[] } | { hide: string[] }  (hide the "the" column like an Excel column)
//   preset           — saved Selections, fully overridable, owning no taxonomy:
//                      'skeleton' = ops {identity, RELATE} (structure, colorings hidden)
//                      'verbatim' = everything shown
//                      'evolution'= the focus's coloring trail (QUALIFY down the line)
//   [L0 sets the final field vocabulary of `show`; the SHAPE above is fixed by the four zones]
export type Selection = {
  ops?: Mark['op'][]
  colorings?: 'all' | { show: string[] } | { hide: string[] }
  preset?: 'skeleton' | 'verbatim' | 'evolution'
}

// ── ONE engine — the Excel-register zone config (sprint pivot-compute-close) ───────
// There is one pivot() that COMPOSES three config-keyed zone functions (row-source ·
// column-source · cell-filler); it never branches on which table it is. A table is named
// wholly by this config — every zone the engine reads has a name here, including the row
// axis (so the engine selects a row-source by name, never infers one from `columns`):
//   rows     — row axis: 'lineage' (things by parent → the structure tree) | 'time' (sc).
//   columns  — column axis: 'single' (one synthetic value column) | 'line' (the slicer's
//              direct line). selects the column-source.
//   values   — value field: 'weight' (scalar, from Thing.weight) | 'marks' (the raw marks
//              at the intersection). selects the cell-filler. The engine PLACES the value
//              type-agnostic — the cell union (GridCell) is read only by the renderer.
//   slicer   — the focus/anchor thing (the Excel slicer; required by columns:'line').
//   level    — depth bound: rings down the lineage (rows) / ancestor+descendant span along
//              the line (columns). undefined = ∞ (all).
//   top      — share-of-ring floor as a fraction (0..1): keep a node WHERE
//              weight / Σ(weights at the node's concentric ring = same depth from the
//              wearer) >= top. RING-LOCAL and scale-invariant — a heavy deep node is judged
//              among its depth-peers, never diluted against the whole. On the `line` column
//              axis it trims DESCENDANTS only; the ancestor chain is taken whole (L0-2).
//   filter   — which mark-ops/colorings are in play (the Selection; was `show`).
//   sort     — child/row ordering: 'weight' (then id) | 'id'. default 'weight' (preserved).
export type RowAxis    = 'lineage' | 'time'
export type ColAxis    = 'single'  | 'line'
export type ValueField = 'weight'  | 'marks'
export type PivotSort  = 'weight' | 'id'
export type PivotConfig = {
  rows:     RowAxis
  columns:  ColAxis
  values:   ValueField
  slicer?:  ThingId
  level?:   number
  top?:     number
  filter?:  Selection
  sort?:    PivotSort
}

// ── The ONE Grid (no discriminant — nothing to switch on in compute) ──────────────
// A column key is a ThingId, or VALUE_COL for the single synthetic value column (which is
// never rendered as a header). A row key is a ThingId (lineage) or an sc number (time).
export type ColKey = string                     // a ThingId, or VALUE_COL (single-column layouts)
export type RowKey = ThingId | number           // lineage → ThingId ; time → sc
export const VALUE_COL: ColKey = '__value__'  // synthetic single-value column; never printed (columnsLine:false)

// ── The #REF! representation (R12 save-and-flag — surface, never silently drop) ────
// A VALID mark whose reference resolves to a MISSING target (resolveRef → null) is the
// Excel #REF! case: it must be SURFACED carrying the broken coordinate, not filtered out —
// the coordinate is what lets the model self-correct on a future turn. REF_ERROR is BOTH the
// render token AND a synthetic column that collects the dangling-ref marks at a row (appended
// only when a row actually has one, so clean grids are byte-unchanged — like VALUE_COL, it is
// engine-internal geometry, not a stored thing).
export const REF_ERROR: ColKey = '#REF!'

// One mark placed at an intersection — `home` is the mark's home coordinate (Shot 3R: the
// state grid teaches the coordinate format from real marks — render shows @home.pos; the sc
// is the row key, the column the context, so only the position prints per mark).
export type MarkEntry = { op: Mark['op']; value: string | null; ref?: Ref; home: Coord }

// The Values-zone payload — a typed union, declared for honesty at the type boundary. The
// ENGINE never reads the tag (L0-3, the heart); only the renderer does (presentation, legal).
// The 'ref' arm is the #REF! cell (R12): marks whose target resolved to null, each carrying its
// broken coordinate (the mark's home + the ref it named) so the renderer can print `#REF!` in
// place — surfaced, not dropped. Reuses MarkEntry: a broken mark is just one whose ref dangles.
export type GridCell =
  | { kind: 'weight'; weight: number }
  | { kind: 'marks'; marks: MarkEntry[] }
  | { kind: 'ref';   marks: MarkEntry[] }
export type GridRow  = { key: RowKey; label: string; depth: number; parent: RowKey | null; cells: Record<ColKey, GridCell> }
// `threads` is an EPHEMERAL read-time overlay (lateral RELATE relations) derived every read,
// generically, from the marks — persisted nowhere. Store-nothing = persist nothing to the
// mark store; a field on the read-time Grid is not storage. Shown iff RenderSpec.threadsBlock.
export type Grid = { columns: ColKey[]; rows: GridRow[]; threads: Thread[] }

// ── Render is modular the same way compute is — one renderer + a render spec (data) ──
// Compute = one engine + an assignment (which zones). Render = one renderer + a RenderSpec
// (which layout). EVERY way the two bodies diverge — the header line included — is a
// DECLARATIVE FIELD, authored per table, fed in; none is a render branch. renderGrid reads
// ONLY the spec + each cell's own `kind` — never config, never table/assignment identity,
// and never re-derives compute structure (full registry-symmetry with the engine).
export type RenderSpec = {
  header:       string               // the terse, token-free header line — DATA, not derived from config (NF-1)
  columnsLine:  boolean              // emit "columns: a | b | …"?            lineage:false  timeline:true
  cellLayout:   'inline' | 'matrix'  // cell on the row line, or per-column sub-lines   lineage:'inline'  timeline:'matrix'
  threadsBlock: boolean              // emit the trailing chord section from grid.threads?    lineage:true   timeline:false
}

// A "table" is now pure data: two halves, each fed to a fixed general mechanism —
// pivot(view.assignment, …) → Grid ; renderGrid(grid, view.render) → text.
// Add-a-table = add a PresentView; touch neither engine nor renderer. (Instances live with
// the named configs in domain/pivot — R0 declares the shape, never imports R1.)
export type PresentView = { assignment: PivotConfig; render: RenderSpec }

// ── Wake-default knobs (M6) — overridable, owning no taxonomy ───────────────────
// DEFAULT_LINEAGE_TOP is the share-of-RING floor (0..1 of the node's concentric ring =
// Σ-weights at the same depth), NOT share-of-whole — ring-local and scale-invariant (R6).
// DEFAULT_TIMELINE_LEVEL bounds the `line` ancestor+descendant span. Builder-chosen
// defaults; a reader overrides per call.
export const DEFAULT_LINEAGE_TOP = 0.02         // structure: show nodes carrying >= 2% of their ring
export const DEFAULT_TIMELINE_LEVEL = 3         // state: ancestor + descendant depth along the line

// ── Present bundles (R7) — rail-aware named defaults; CONFIG DATA, not code ────────
// The wake bundle per rail, named for the SECTIONS it selects: the windshield transcript,
// the `structure` section (the lineage view) and the `state` section (the timeline view).
// native carries the transcript + both sections; wire carries the sections ONLY — the
// transcript is fetched on demand (lookup, R8), never carried per turn. The model may
// request a different shape per call; it never edits these defaults.
export type PresentBundle = { transcript: boolean; structure: boolean; state: boolean }
export const PRESENT_BUNDLES = {
  native: { transcript: true,  structure: true, state: true },
  wire:   { transcript: false, structure: true, state: true },
} as const satisfies Record<string, PresentBundle>
