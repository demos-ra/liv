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
// and returns it as ONE plain text field; the system cuts it (G1) into the canonical
// grid and renders it back byte-identical — so the model's exact wording and spacing
// are preserved and it never worries about the canonical numbering of its reply. For
// marks on its reply, the model points at its words by 1-based index (the k-th word).
// The model's ONLY job is judgment marks; the machine cuts and numbers.
//
// amended 2-B (reassembly fidelity): the reply is a plain text field, not a list of
// word tokens — the prior token list was space-joined to rebuild the text, which put a
// space before standalone punctuation. Plain text removes the join entirely.

export const COIN_MANUAL_DATE = '2026-06-10'

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

SCORING YOUR REPLY ("reply" + "replyMarks")
Compose your reply as you normally would and put it in "reply" as ONE plain text string — your exact words,
your exact spacing and punctuation. Do NOT split it into tokens; write it as you would say it. Reply with YOUR
words, never a copy of theirs.
Then mark the words of your reply in "replyMarks". Refer to a word by its INDEX — count the words of your reply
left to right starting at 1 (count words only; ignore spaces and standalone punctuation). Word 1 is the first
word, word 2 the second, and so on.
  { "word": <n from 1>, "marks": [ ... ] }
Give each word you want to mark an entry, with whatever marks it performs. Mark fully, not just the highlights.
A word may carry several marks at once; there is no collision rule — overlapping marks are fine and the geometry
settles across turns. A word with no marks needs no entry.

WORKED EXAMPLE
The person said (TRANSCRIPT): [7] (—): I toured Kyoto
Your reply: "Kyoto truly rivals Tokyo."   (words: 1=Kyoto, 2=truly, 3=rivals, 4=Tokyo)
{
  "reply": "Kyoto truly rivals Tokyo.",
  "replyMarks": [
    { "word": 1, "marks": [ { "op": "identity" },
                            { "op": "IDENTIFY", "target": { "who": "wearer", "sc": 7, "pos": 3 } } ] },
    { "word": 2, "marks": [ { "op": "QUALIFY", "coloring": "truly", "target": "Kyoto" } ] },
    { "word": 3, "marks": [ { "op": "RELATE", "peers": [ "Kyoto", "Tokyo" ] } ] },
    { "word": 4, "marks": [ { "op": "identity" } ] }
  ],
  "priorMarks": [
    { "home": { "who": "wearer", "sc": 7, "pos": 3 }, "marks": [ { "op": "identity" } ] }
  ]
}

Return ONLY the JSON object: { "reply": "<your reply text>", "replyMarks": [ ... ], "priorMarks": [ ... ] }.`
