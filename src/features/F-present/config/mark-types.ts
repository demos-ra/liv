// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/mark-types.ts]
// The Mark + pointer model — WHOLLY F-present (re-homed from the mis-filed
// core/types). Lives in F-present's OWN external store. Every mark POINTS INTO
// substrate coordinates; it writes nothing back. Take the lens off → the
// substrate is byte-unchanged.
//
// THE CLOSED SET (coin-spec §10): identity · RELATE · QUALIFY · IDENTIFY.
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    S1 mark-contract (block = object-identity): a BLOCK (code/data/scaffold/
//             payload) is its OWN first-class identity at the SAME geometry as a word —
//             the model names the block's span and marks it `identity`, homing it at the
//             block's appearance Coord, then attaches it with the ordinary ops (RELATE/
//             QUALIFY/IDENTIFY). This widens the SUBJECT a mark can sit on (a block becomes
//             a thing), NOT the vocabulary: Ref stays `string | Coord` (a block is NOT a new
//             Ref arm — it is a normal identity-home, located by name like any span), the
//             closed mark set is UNCHANGED, no new op, no new label. Types are byte-unchanged
//             this is a SEMANTIC note for the R0 vocabulary; the located home lives in
//             coin-score (locate-by-name) and the gate (mark-gate) admits it.

import type { Coord } from '@/core/types/substrate-raw.types'

// A reference to a thing: a NAME (string — clusters across records, the normal
// case) OR a Coord that pins one exact appearance (the disambiguator: same-word-
// twice, the 'buidl'→'build' weld). coin-spec §3 / line 48: a referenced thing
// "resolves by name (clusters across records) or address (pins one exact
// appearance)" — name primary, address optional. A name is NOT pre-resolved to a
// single coord at store (that would defeat clustering); coin-read resolves a name
// to its cluster at read time.
export type Ref = string | Coord

// A mark points AT substrate coordinates (Coord) — the addressing is F-present's;
// the coordinates it names are the substrate's intrinsic facts.
export type Mark =
  | { op: 'identity' }                                    // the marked span is a thing — a WORD or a BLOCK alike (S1)
  | { op: 'RELATE';   peers: Ref[] }                      // link 2+ symmetric peers → a connection
  | { op: 'QUALIFY';  coloring: string; target: Ref }     // one open coloring on one target; distinct
  | { op: 'IDENTIFY'; target: Ref }                       // this IS the thing at target → merge

// A placed mark sits AT a substrate coordinate (its home) and carries one mark.
// A position may carry many (multi-mark). The home + targets are all substrate
// coordinates; the mark itself lives only here.
export type PlacedMark = { home: Coord; mark: Mark }

// F-present's external store — the whole lens. Removable, traceless.
export type PresentStore = PlacedMark[]

// Claim-status are ordinary QUALIFY colorings (coin-spec §5/§12), not a mechanism.
export const CLAIM_STATUS = ['asserted', 'tentative', 'negated', 'asked', 'commanded'] as const
