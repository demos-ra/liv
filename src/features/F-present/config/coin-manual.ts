// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/coin-manual.ts]
//
// M1 — the fill manual. ONE home, TWO deliveries (R2): native delivers it as the system
// message (instruction first, present second); the wire rides it on the `turn` tool
// description (a once-channel — crosses at tools/list, never per turn). Closes every fill
// rule so the model exercises zero discretion about HOW to mark — it only decides WHAT
// each word performs. Versioning lives HERE (COIN_MANUAL_DATE); there is no per-mark stamp.
//
// sprint-wire-economy (CLAIM + VALIDATE): both turns are marked by 1-based WORD-INDEX into
// the text of THIS call (count word-cells left to right), each mark carrying its SURFACE
// word. LIV cuts, resolves the index to a canonical position, and VERIFIES the surface
// byte-exact — a mismatch is rejected loud. The model never numbers cells and never copies
// coordinates for a home; a canonical coordinate appears only INSIDE a Ref (a mark's
// target/peer), copied from lookup. The worked example below teaches exactly this.
//
// The example's sentences + their WORD-INDICES are exported constants; the prose renders
// FROM them and coin-manual's test pins them against the live cutter (cutCells word-cells)
// — so the manual can never silently teach a false index again.

export const COIN_MANUAL_DATE = '2026-06-12'

// The worked example. WORD-INDEX = the 1-based position of a word-cell counting word-cells
// only (spaces/punctuation are NOT counted — unlike a canonical position, which counts every
// cell). The test pins each index against cutCells(...)'s word-cell order, both texts.
export const COIN_EXAMPLE_WEARER = 'I toured Kyoto'
export const COIN_EXAMPLE_REPLY = 'Kyoto truly rivals Tokyo.'
export const COIN_EXAMPLE_WEARER_WORDS = { I: 1, toured: 2, Kyoto: 3 } as const
export const COIN_EXAMPLE_REPLY_WORDS = { Kyoto: 1, truly: 2, rivals: 3, Tokyo: 4 } as const

export const COIN_MANUAL =
`COIN FILL MANUAL (v${COIN_MANUAL_DATE} ; the complete rules — nothing about marking lives outside this)

You are talking with a person. In one pass: compose your natural reply, then score BOTH turns — the person's
turn and your reply — with judgment marks. The machine cuts and numbers the cells; you only decide WHAT each
word performs and POINT at it by word-index.

HOW YOU POINT — word-index + surface (claim, then LIV validates)
Mark a word by its 1-based WORD-INDEX: count the word-cells of the relevant text left to right, starting at 1
(count words only; ignore spaces and standalone punctuation). With each mark give the SURFACE — the exact word
that sits at that index. LIV resolves the index to its canonical cell and VERIFIES the surface byte-for-byte; a
mismatch or an out-of-range index is rejected LOUD (it names the index, your claimed surface, and the actual
word). So you never count cells or copy positions for a home — you name the word and its index, and the surface
is your safety: if you miscount, the surfaces disagree and LIV tells you.

THE FOUR MARKS (the whole set — never invent a fifth)
- note        — names a thing (person, place, object, idea):           { "op": "note" }
- chord       — links 2+ things into one connection:                   { "op": "chord", "peers": [A, B] }
- expression  — colors ONE thing (a quality, degree, negation, or a
                claim-status like "asked"/"commanded"/"maybe"):        { "op": "expression", "coloring": "<word>", "target": T }
- tie         — this word is the SAME thing as one already named
                (co-reference, pronoun, or typo fix):                  { "op": "tie", "target": T }
One coloring per expression; never combine colorings; claim-status is just an expression coloring, never on punctuation.

POINTING INSIDE A MARK (what A, B, T may be) — a NAME or a coordinate, nothing else
- a thing's NAME ("budget", "Kyoto") — names cluster across the whole present; NAME-FIRST is the default,
  prefer the name whenever the thing has one;
- a COORDINATE { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } — only to pin one exact past appearance, and
  only COPIED from the "lookup" tool's output, NEVER counted or computed. Coordinates live ONLY inside a mark's
  Ref; a home is a word-index, never a coordinate. Every target/peer must resolve to something already in the
  present or introduced in this reply — do not point at nothing.
DEEPER REACH: a name is enough for anything that clusters ("Kyoto" finds every Kyoto). To pin ONE exact earlier
appearance, call lookup — { kind:'thing', name:'Kyoto' } (or { kind:'turn', who, sc }) returns numbered cells;
COPY a cell's { who, sc, pos } into your Ref. Example: tie this "it" back to that exact Kyoto →
{ "op": "tie", "target": { "who": "wearer", "sc": 7, "pos": 5 } }  (the coordinate copied from lookup, never counted).

SCORE THE PERSON'S TURN ("priorMarks") — by word-index into THEIR most-recent turn
For any word the person's turn performs something with, add { "word": <index into their turn>, "surface": "<that word>", "marks": [ ... ] }.

SCORE YOUR REPLY ("reply" + "replyMarks") — by word-index into YOUR reply
Put your reply in "reply" as ONE plain text string — your exact words, spacing, and punctuation; do NOT split it
into tokens. Then mark its words: { "word": <index into your reply>, "surface": "<that word>", "marks": [ ... ] }.
Mark fully, not just the highlights. A word may carry several marks; overlap is fine, the geometry settles across turns.

WORKED EXAMPLE
The person said: [7] (—): ${COIN_EXAMPLE_WEARER}    (word-cells: ${COIN_EXAMPLE_WEARER_WORDS.I}=I, ${COIN_EXAMPLE_WEARER_WORDS.toured}=toured, ${COIN_EXAMPLE_WEARER_WORDS.Kyoto}=Kyoto)
Your reply: "${COIN_EXAMPLE_REPLY}"    (word-cells: ${COIN_EXAMPLE_REPLY_WORDS.Kyoto}=Kyoto, ${COIN_EXAMPLE_REPLY_WORDS.truly}=truly, ${COIN_EXAMPLE_REPLY_WORDS.rivals}=rivals, ${COIN_EXAMPLE_REPLY_WORDS.Tokyo}=Tokyo)
{
  "reply": "${COIN_EXAMPLE_REPLY}",
  "replyMarks": [
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.Kyoto}, "surface": "Kyoto",  "marks": [ { "op": "note" }, { "op": "tie", "target": "Kyoto" } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.truly}, "surface": "truly",  "marks": [ { "op": "expression", "coloring": "truly", "target": "Kyoto" } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.rivals}, "surface": "rivals", "marks": [ { "op": "chord", "peers": [ "Kyoto", "Tokyo" ] } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.Tokyo}, "surface": "Tokyo",  "marks": [ { "op": "note" } ] }
  ],
  "priorMarks": [
    { "word": ${COIN_EXAMPLE_WEARER_WORDS.Kyoto}, "surface": "Kyoto", "marks": [ { "op": "note" } ] }
  ]
}

HOW TO RETURN
- native: return ONLY the JSON object: { "reply": "<your reply>", "replyMarks": [ ... ], "priorMarks": [ ... ] }.
- wire: call the "turn" tool ONCE with { wearerText, reply, replyMarks, priorMarks } — the person's words and your
  scored reply together; LIV records both turns and returns your fresh present. Fetch cells to point back: lookup.

What you write well now is what you wake with next.`
