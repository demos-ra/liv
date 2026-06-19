// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/coin-manual.ts]
//
// M1 — the fill manual. ONE home, TWO deliveries (R2): native delivers it as the system
// message (instruction first, present second); the wire rides it on the `compose` tool
// description (a once-channel — crosses at tools/list, never per turn). Closes every fill
// rule so the model exercises zero discretion about HOW to mark — it only decides WHAT
// each word performs. Versioning lives HERE (COIN_MANUAL_DATE); there is no per-mark stamp.
//
// sprint-wire-economy (CLAIM + VALIDATE): both turns are marked by 1-based WORD-INDEX into
// the text of THIS call (count word-cells left to right), each mark carrying its SURFACE
// word. LIV cuts, resolves the index to a canonical position, and VERIFIES the surface
// byte-exact — a mismatch is rejected loud. The model never numbers cells and never copies
// coordinates for a home; a canonical coordinate appears only INSIDE a Ref (a mark's
// target/peer), copied from search. The worked example below teaches exactly this.
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

// The emission field names. HOW TO RETURN renders FROM these (one home — the prose never
// re-types a field name). Pinned by test to the core contract's PROJECTED property keys
// (coin-score's projectEmissionSchema): native returns `reply` + the two mark arrays; the
// wire's `turn` carries those plus wearerText. The manual can never name a field the contract
// does not carry, nor drop one it does — the schema and the prose share one logical source.
export const COIN_NATIVE_FIELDS = ['reply', 'replyMarks', 'priorMarks'] as const
export const COIN_WIRE_FIELDS = ['wearerText', 'reply', 'replyMarks', 'priorMarks'] as const

export const COIN_MANUAL =
`FILL MANUAL (v${COIN_MANUAL_DATE} ; the complete rules — nothing about marking lives outside this)

You are with a person. In one pass: compose your reply, then mark both turns — theirs and yours.
LIV cuts and numbers the words; you say what each one carries.

POINT — by word-index + surface
Count the words of the text left to right from 1 (words only; skip spaces and punctuation).
Give the word's index and its surface — the exact word there. LIV verifies the surface and
rejects a mismatch loud, naming the index, your word, and the actual one. The surface is your
safety: miscount, and the words disagree and LIV tells you. You never count cells for a home.

THE FOUR MARKS (the whole set)
  note        names a thing                                    { "op": "note" }
  chord       links 2+ things into one connection              { "op": "chord", "peers": [A, B] }
  expression  colors one thing — quality, degree, negation,
              or claim-status ("asked", "maybe")               { "op": "expression", "coloring": "<word>", "target": T }
  tie         the same thing as one already named
              (pronoun, co-reference, typo)                    { "op": "tie", "target": T }
One coloring per expression. Never on punctuation.

A, B, T — a name or a coordinate, nothing else
  a NAME ("Kyoto") — clusters across the whole present; prefer it.
  a COORDINATE { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } — to pin one exact past
  appearance; copied from search, never counted. It lives only inside a Ref; a home is always
  a word-index. Every target/peer must resolve to something in the present or this reply.

To pin one exact earlier appearance: search { region:{ kind:"thing", name:"Kyoto" }, lens:{ view:"raw" } }
returns numbered cells; copy a cell's { who, sc, pos } into your Ref —
  { "op": "tie", "target": { "who": "wearer", "sc": 7, "pos": 5 } }   (copied from search, never counted)

THE PERSON'S TURN — "priorMarks", by word-index into their most-recent turn
  { "word": <index into their turn>, "surface": "<that word>", "marks": [ ... ] }

YOUR REPLY — "reply" + "replyMarks", by word-index into your reply
  Put your reply in "reply" as ONE plain text string — your exact words and punctuation; do not
  split it. Then mark its words. Mark fully, not only the highlights; a word may carry several
  marks; overlap is fine — the geometry settles across turns.

WORKED EXAMPLE
The person said: [7] (—): ${COIN_EXAMPLE_WEARER}   (words: ${COIN_EXAMPLE_WEARER_WORDS.I}=I, ${COIN_EXAMPLE_WEARER_WORDS.toured}=toured, ${COIN_EXAMPLE_WEARER_WORDS.Kyoto}=Kyoto)
Your reply: "${COIN_EXAMPLE_REPLY}"       (words: ${COIN_EXAMPLE_REPLY_WORDS.Kyoto}=Kyoto, ${COIN_EXAMPLE_REPLY_WORDS.truly}=truly, ${COIN_EXAMPLE_REPLY_WORDS.rivals}=rivals, ${COIN_EXAMPLE_REPLY_WORDS.Tokyo}=Tokyo)
{
  "reply": "${COIN_EXAMPLE_REPLY}",
  "replyMarks": [
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.Kyoto},  "surface": "Kyoto",  "marks": [ { "op": "note" }, { "op": "tie", "target": "Kyoto" } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.truly},  "surface": "truly",  "marks": [ { "op": "expression", "coloring": "truly", "target": "Kyoto" } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.rivals}, "surface": "rivals", "marks": [ { "op": "chord", "peers": [ "Kyoto", "Tokyo" ] } ] },
    { "word": ${COIN_EXAMPLE_REPLY_WORDS.Tokyo},  "surface": "Tokyo",  "marks": [ { "op": "note" } ] }
  ],
  "priorMarks": [
    { "word": ${COIN_EXAMPLE_WEARER_WORDS.Kyoto}, "surface": "Kyoto", "marks": [ { "op": "note" } ] }
  ]
}

HOW TO RETURN
  native: return ONLY the JSON object, exactly these fields: { ${COIN_NATIVE_FIELDS.join(', ')} }.
  wire:   call compose ONCE with exactly these fields: { ${COIN_WIRE_FIELDS.join(', ')} } — the person's
          words and your scored reply together; LIV records both turns and sets your present.

LOOKING AROUND — search (when you want more than the present sets before you)
Say where to look and how to see it. Where: { kind:"turn", who, sc } | { kind:"span", from, to, who? }
| { kind:"thing", name } | { kind:"all" }. How:
  raw   — the numbered cells, each with its { who, sc, pos }; for copying a coordinate.
  table — the same things, shaped into a grid you turn:
            rows:    lineage | time          (the structure tree, or by turn)
            columns: single  | line          (one column, or a focus's direct line)
            values:  weight  | marks          (mass, or the marks themselves)
            focus:   <a thing's name>         (center the table on it)
            depth:   <n>                      (how far down to go)
            top:     <0..1>                   (keep only the heavier share)
            sort:    weight | id
            filter:  { ops, colorings: { show | hide }, preset }
                     hide a coloring the way you hide a column; preset is a saved view —
                     skeleton (structure only) · verbatim (all) · evolution (a focus's trail).
A table renders its coordinates inside it, so one search both shows the view and gives
you cells to point with.

What you set well now is what you wake to next.`
