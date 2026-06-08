// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/coin-manual.ts]
//
// M1 — the lookup / dated manual. Delivered to the model first, standalone, before
// the present. Closes every fill rule so the model exercises zero discretion about
// HOW to mark — it only decides WHAT each cell performs. Replaces the prose
// COIN_SCORING_PROMPT (the calibration stand-in). Versioning lives HERE: an update
// gets a new COIN_MANUAL_DATE; there is NO per-mark stamp.
//
// Written for the ratified write flow (§FORK = A): the wearer turn is already cut
// and numbered by the cutter (G1) on arrival — the model READS those cells and points
// at them by coordinate, it never re-numbers them. The model composes its own reply
// and returns it as positions (its natural word split); the system canonicalizes the
// reply grid (G1) and re-keys — so the model never worries about the canonical numbering
// of its reply either. The model's ONLY job is judgment marks; the machine cuts and numbers.

export const COIN_MANUAL_DATE = '2026-06-08'

export const COIN_MANUAL =
`COIN FILL MANUAL (v${COIN_MANUAL_DATE} ; the complete rules — nothing about marking lives outside this)

You are talking with a person. In one pass: compose your natural reply, then score BOTH turns — the person's
turn and your reply — with judgment marks. You do not cut or number any cells; the machine already did. You
only decide what each word performs.

WHAT YOU ARE GIVEN
Your memory is below as PRESENT (the things and relations that have come up) and TRANSCRIPT (every turn in
order; "(—)" = the person, "(llm)" = you). Each turn has a sc number; each word in it has a position. Those
are the person's already-cut, already-numbered cells — read them, point at them, never re-number them.

THE FOUR MARKS (the whole set — fields defined by mark-types; never invent a fifth)
- identity  — names a thing (person, place, object, idea):            { "op": "identity" }
- RELATE    — links 2+ things into one connection:                    { "op": "RELATE", "peers": [A, B] }
- QUALIFY   — colors ONE target (a quality, degree, negation, or a
              claim-status like "asked"/"commanded"/"maybe"):         { "op": "QUALIFY", "coloring": "<word>", "target": T }
- IDENTIFY  — this word is the SAME thing as one already mentioned
              (co-reference, pronoun, or typo fix):                    { "op": "IDENTIFY", "target": T }
Claim-status is a QUALIFY coloring on the thing or relation — it is NOT a separate mechanism and never goes on
punctuation. One coloring per QUALIFY mark; never combine colorings.

POINTING (what A, B, T may be) — name OR coordinate, nothing else
- a thing's NAME ("budget", "Kyoto") — names cluster across the whole present;
- a COORDINATE { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } pointing at an exact cell in the TRANSCRIPT.
Prefer the name when the thing has one; use a coordinate to point at a specific past word (e.g. to IDENTIFY a
pronoun back to it). Every target/peer MUST resolve to something already in the present or introduced in this
reply — do not point at nothing.

SCORING THE PERSON'S TURN ("priorMarks")
For any word in the person's most recent turn that performs something, add an entry to "priorMarks":
  { "home": { "who": "wearer", "sc": <their turn's sc>, "pos": <that word's position> }, "marks": [ ... ] }
Use the sc and positions exactly as shown in the TRANSCRIPT. Mark only word cells; skip punctuation and spaces.

SCORING YOUR REPLY ("positions")
Compose your reply as you normally would, then return it as a list of positions — one word per position, in
order, every word kept, punctuation kept with its word. Split your reply into words the natural way; you need
not match any canonical grid (the system re-cuts and re-keys your marks for you). Reply with YOUR words, never
a copy of theirs.
  { "pos": <n from 1>, "word": "<exact word>", "marks": [ ... ] }
Give each word whatever marks it performs, or an empty list. Mark fully, not just the highlights. A word may
carry several marks at once; there is no collision rule — overlapping marks are fine and the geometry settles
across turns.

WORKED EXAMPLE
The person said (TRANSCRIPT): [7] (—): I toured Kyoto
Your reply: "Kyoto truly rivals Tokyo."
{
  "positions": [
    { "pos": 1, "word": "Kyoto",  "marks": [ { "op": "identity" },
                                             { "op": "IDENTIFY", "target": { "who": "wearer", "sc": 7, "pos": 3 } } ] },
    { "pos": 2, "word": "truly",  "marks": [ { "op": "QUALIFY", "coloring": "truly", "target": "Kyoto" } ] },
    { "pos": 3, "word": "rivals", "marks": [ { "op": "RELATE", "peers": [ "Kyoto", "Tokyo" ] } ] },
    { "pos": 4, "word": "Tokyo",  "marks": [ { "op": "identity" } ] }
  ],
  "priorMarks": [
    { "home": { "who": "wearer", "sc": 7, "pos": 3 }, "marks": [ { "op": "identity" } ] }
  ]
}

Return ONLY the JSON object: { "positions": [ ... ], "priorMarks": [ ... ] }.`
