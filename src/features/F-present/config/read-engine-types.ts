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

export type PivotConfig = {
  view: 'forest' | 'sheet'
  focus?: ThingId
  show: Selection                 // Filter zone + field-value visibility — never a hardcoded class list
  weightCutoff?: number           // forest zoom: show WHERE (weight / Σ-at-wearer) >= cutoff. A FRACTION
                                  // of the whole (0..1), NOT an absolute weight — scale-invariant, future-proof.
  ancestorsUp?: number            // sheet: how many ancestor levels (along the direct line)
  descendantsDown?: number        // sheet: how many descendant levels
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
// DEFAULT_FOREST_CUTOFF is a SHARE-OF-WHOLE fraction (0..1 of Σ-at-wearer), never an
// absolute weight — a percent-of-whole brightness floor, so it stays correct as the
// substrate grows. Builder-chosen default; a reader may override per call.
export const DEFAULT_FOREST_CUTOFF = 0.02       // show things carrying >= 2% of total mass
export const DEFAULT_ANCESTORS_UP = 3           // sheet: ancestor levels along the direct line
export const DEFAULT_DESCENDANTS_DOWN = 2        // sheet: descendant levels along the direct line
