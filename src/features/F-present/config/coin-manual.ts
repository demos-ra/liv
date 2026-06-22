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
// each span performs. Versioning lives HERE (COIN_MANUAL_DATE); there is no per-mark stamp.
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    S1 mark-contract (name-not-count, M4): the manual is rewritten ENTIRELY off
//             word-index. A mark NAMES the span it sits on (`surface` — a verbatim word or
//             short span the model reproduces exactly) and LIV LOCATES it; the model emits NO
//             index and NEVER counts cells. The "POINT — by word-index" rule, "count the
//             words", "a home is always a word-index", and the { word, surface, marks } shape
//             are GONE — a mark entry is now { surface, marks }. A coordinate appears ONLY
//             inside a Ref (target/peer), copied from search, never as a home. Two teach-lines
//             added in the Host register (the weld; naming a block as a thing). A repeated span
//             resolves to its FIRST occurrence; name a longer unique span to mean a later one.
//             A named span that isn't in the relevant text is rejected LOUD (MarkSurfaceError —
//             "you named text that isn't there"). The worked example carries no `word` field;
//             its sentences are pinned to the live cutter by coin-manual.test (the index maps
//             COIN_EXAMPLE_*_WORDS are gone — there is no index to pin).
//
// The example's sentences are exported constants; the prose renders FROM them and coin-manual's
// test pins them against the live cutter (cutCells word-cells) — every span the example names is
// proven to occur in its text, so the manual can never silently teach a span that isn't there.

export const COIN_MANUAL_DATE = '2026-06-22'

// The worked example. The model NAMES a span it reproduces exactly; LIV locates it. The test
// runs the real cutCells on both texts and asserts every named span occurs there (byte-exact),
// both texts — so the manual can never teach a span the cutter cannot find.
export const COIN_EXAMPLE_WEARER = 'I toured Kyoto'
export const COIN_EXAMPLE_REPLY = 'Kyoto truly rivals Tokyo.'

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
You name the spans; LIV finds them. You never count anything.

NAME — by span, not by number
Quote the span a mark sits on, exactly as it appears in the text — a word ("Kyoto") or a short
span ("truly rivals"). LIV locates it. If you name a span the text does not contain, LIV rejects
it loud, naming the span you wrote. Reproduce the span byte-for-byte; that exactness is your
safety. If a word repeats, the first one is meant — to mean a later one, name a longer span that
appears only once ("rivals Tokyo" instead of a second "Kyoto").

THE FOUR MARKS (the whole set)
  note        names a thing                                    { "op": "note" }
  chord       links 2+ things into one connection              { "op": "chord", "peers": [A, B] }
  expression  colors one thing — quality, degree, negation,
              or claim-status ("asked", "maybe")               { "op": "expression", "coloring": "<word>", "target": T }
  tie         the same thing as one already named
              (pronoun, co-reference, typo)                    { "op": "tie", "target": T }
One coloring per expression. Never on punctuation.

A variant of a thing is the same thing: name its span "note" AND "tie" it to the thing —
"it"/"they", a second mention, a typo ("buidl"→"build") — so it folds into the one thing
instead of splitting into many.

A block is a thing: a code block, a table, a payload — name its leading span "note", then
attach it with the ordinary marks (chord it to what it relates to, expression to color it).

A, B, T — a name or a coordinate, nothing else
  a NAME ("Kyoto") — clusters across the whole present; prefer it.
  a COORDINATE { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } — to pin one exact past
  appearance; copied from search, never counted. A coordinate lives ONLY inside a Ref; it is
  never a home. Every target/peer must resolve to something in the present or this reply.

To pin one exact earlier appearance: search { region:{ kind:"thing", name:"Kyoto" }, lens:{ view:"raw" } }
returns numbered cells; copy a cell's { who, sc, pos } into your Ref —
  { "op": "tie", "target": { "who": "wearer", "sc": 7, "pos": 5 } }   (copied from search, never counted)

THE PERSON'S TURN — "priorMarks", naming spans of their most-recent turn
  { "surface": "<a span their turn contains>", "marks": [ ... ] }

YOUR REPLY — "reply" + "replyMarks", naming spans of your reply
  Put your reply in "reply" as ONE plain text string — your exact words and punctuation; do not
  split it. Then mark its spans. Mark fully, not only the highlights; a span may carry several
  marks; overlap is fine — the geometry settles across turns.

WORKED EXAMPLE
The person said: [7] (—): ${COIN_EXAMPLE_WEARER}
Your reply: "${COIN_EXAMPLE_REPLY}"
{
  "reply": "${COIN_EXAMPLE_REPLY}",
  "replyMarks": [
    { "surface": "Kyoto",  "marks": [ { "op": "note" }, { "op": "tie", "target": "Kyoto" } ] },
    { "surface": "truly",  "marks": [ { "op": "expression", "coloring": "truly", "target": "Kyoto" } ] },
    { "surface": "rivals", "marks": [ { "op": "chord", "peers": [ "Kyoto", "Tokyo" ] } ] },
    { "surface": "Tokyo",  "marks": [ { "op": "note" } ] }
  ],
  "priorMarks": [
    { "surface": "Kyoto", "marks": [ { "op": "note" } ] }
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
  table — the same things, shaped into a table you turn:
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
