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

// ── ONE instrument — the Excel-register zone config (sprint-wire-economy R6) ───────
// The `view: 'forest'|'sheet'` enum is GONE. There is one pivot(); forest and sheet are
// two NAMED default configs (forestConfig / sheetConfig) over one engine. The registers:
//   rows     — row-zone layout: 'lineage' (things nested by parent → the forest).
//   columns  — column-zone layout: 'line' (the slicer's direct line → the sheet).
//   slicer   — the focus/anchor thing (the Excel slicer; required by columns:'line').
//   level    — depth bound: rings down the lineage (rows) / fan along the line (columns).
//              undefined = ∞ (all).
//   top      — brightness floor as a SHARE-OF-RING fraction (0..1): keep a node WHERE
//              weight / Σ(weights at the node's concentric ring = same depth from the
//              wearer) >= top. RING-LOCAL and scale-invariant — a heavy deep node is judged
//              among its depth-peers, never diluted against the whole. This is the R6 fix
//              for the cross-branch inversion; it replaces weightCutoff (share-of-whole).
//   filter   — which mark-ops/colorings are in play (the Selection; was `show`).
//   sort     — child/row ordering: 'weight' (then id) | 'id'. default 'weight' (preserved).
export type PivotSort = 'weight' | 'id'
export type PivotConfig = {
  rows?:    'lineage'
  columns?: 'line'
  slicer?:  ThingId
  level?:   number
  top?:     number
  filter?:  Selection
  sort?:    PivotSort
}

export type ForestNode = { thing: ThingId; label: string; weight: number; children: ForestNode[] }
export type ForestResult = { view: 'forest'; root: ForestNode; threads: Thread[] }   // root = wearer
// raw marks, dynamic width. `home` = the mark's home coordinate (Shot 3R: the sheet
// teaches the coordinate format from real marks — render shows @home.pos; sc is the
// row key, who the column context, so only the position need print per mark).
export type SheetCell = { op: Mark['op']; value: string | null; ref?: Ref; home: Coord }[]
export type SheetRow = { sc: number; cells: Record<ThingId, SheetCell> }
export type SheetResult = { view: 'sheet'; columns: ThingId[]; rows: SheetRow[] }     // columns = ancestors|focus|descendants
export type PivotResult = ForestResult | SheetResult

// ── Wake-default knobs (M6) — overridable, owning no taxonomy ───────────────────
// DEFAULT_FOREST_TOP is the share-of-RING brightness floor (0..1 of the node's concentric
// ring = Σ-weights at the same depth), NOT share-of-whole — ring-local and scale-invariant
// (R6). DEFAULT_SHEET_LEVEL bounds the sheet's fan/line depth. Builder-chosen defaults; a
// reader overrides per call. (DEFAULT_FOREST_CUTOFF / ANCESTORS_UP / DESCENDANTS_DOWN are
// retired — share-of-whole and the asymmetric up/down knobs are gone with the view enum.)
export const DEFAULT_FOREST_TOP = 0.02          // forest: show nodes carrying >= 2% of their ring
export const DEFAULT_SHEET_LEVEL = 3            // sheet: ancestor + descendant depth along the line

// ── Present bundles (R7) — rail-aware named defaults; CONFIG DATA, not code ────────
// The wake bundle per rail. native carries the windshield transcript + both tables; wire
// carries the tables ONLY — the transcript is fetched on demand (lookup, R8), never carried
// per turn. The model may request a different shape per call; it never edits these defaults.
export type PresentBundle = { transcript: boolean; forest: boolean; sheet: boolean }
export const PRESENT_BUNDLES = {
  native: { transcript: true,  forest: true, sheet: true },
  wire:   { transcript: false, forest: true, sheet: true },
} as const satisfies Record<string, PresentBundle>
