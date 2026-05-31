// @liv-standard v1.5.2
// [core/types/substrate-raw.types.ts]
// Built with LIV · livai.dev
// PROPOSED SUBSTRATE THINNING (version bump escalated; direction settled: STRIP).
//
// L0 line: SUBSTRATE = the wearer's raw content + its INTRINSIC coordinates.
// Wearer-owned, per-user, the only thing they own. It interprets nothing, points
// at nothing, computes nothing — a faithful, attributed, ordered transcript of
// both turns. The core loop runs on this ALONE.
//
// A word's coordinate (turn, position, author) is a FACT about the record. An
// arrow between words (refers/links/colors/merges) is INTERPRETATION → F-present,
// never here. No Relation atom, no type/role/modality/negation, no addressing,
// no Mark. The substrate gets THINNER.

// Authorship of a turn. wearer + llm are the cognition rail; program is the
// system-introspection author (plan/build/etc.) — folded in here so future program
// channels need no re-derivation. Extensible by design (coin-spec: authorship is
// stamped at write; the set is open at the author axis, not the structure axis).
export type Who = 'wearer' | 'llm' | 'program'

// A coordinate — intrinsic. "this word is at turn sc, position pos, said by who."
export type Coord = { who: Who; sc: number; pos: number }

// A word at a position — verbatim, nothing dropped, never normalized ('buidl'
// stays 'buidl' forever; the clean form exists only in the lens).
export type RawWord = { pos: number; word: string }

// A turn — attributed, ordered. Both the wearer's turn and the LLM's end response
// land here as raw content.
export type RawTurn = { sc: number; who: Who; words: RawWord[] }

// The substrate = an ordered transcript of turns. Nothing relational.
export type Transcript = RawTurn[]
