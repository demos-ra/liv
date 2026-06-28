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
//             inline-marking Touch 3 (projectManual — ONE manual, PROJECTED per situation):
//             the COIN_MANUAL constant becomes projectManual(opts) — ONE source, a shared spine
//             (the concepts, byte-exact span naming, the search/looking-around section, the voice)
//             identical across both forms, with ONLY the emission-syntax sections branching by
//             form. opts.inline picks the [[ ]] + musical teaching vs the named { surface, marks }
//             teaching (the named prose is VERBATIM — voice is load-bearing, transposition not
//             rewrite); opts.includeWearerText picks the HOW TO RETURN instruction (native returns
//             the JSON object; the wire calls compose); opts.fields is the field list it prints.
//             The inline expression form carries BOTH QUALIFY fields (ruling B):
//             [[span]](expression <coloring> <target>). COIN_MANUAL_DATE bumped; the "complete
//             rules — nothing about marking lives outside this" framing preserved.
//
//             inline-marking Touch 3 re-seal (STRICT R0 LEAF — fix (c)): this file imports NOTHING
//             from coin-score (R1) — no value, no type. projectManual no longer derives its own
//             fields; the CALLER computes the schema and feeds primitives: { inline, includeWearerText,
//             fields }. R0 interprets no field-name semantics — it renders exactly what it is handed.
//             manualFields and the COIN_MANUAL constant (both needed R1 to compute fields) are GONE.
//             The native caller (cognition-orchestrator R2) and the wire caller (mcp-contract R3)
//             each compute Object.keys(projectEmissionSchema(situation).properties) (R2/R3 → R1,
//             downward, legal) and pass the result in — the one-home guarantee holds at the caller,
//             where the schema already lives, so manual + schema cannot drift.
//
// The example's sentences are exported constants; the prose renders FROM them and coin-manual's
// test pins them against the live cutter (cutCells word-cells) — every span the example names is
// proven to occur in its text, so the manual can never silently teach a span that isn't there.
//
// wires-in:  (none — this file is a LEAF; it imports nothing from another layer)
// wires-out:
//   W-FN    projectManual(opts)  W-ATOM COIN_MANUAL_DATE / COIN_EXAMPLE_* / COIN_EXAMPLE_INLINE
//             →  ../app/cognition-orchestrator (R2, native delivery — computes opts from NATIVE_SITUATION),
//                ../contract/present-contract (R3 → F-mcp wire delivery — computes opts from MCP_SITUATION)

export const COIN_MANUAL_DATE = '2026-06-25'

// The worked example. The model NAMES a span it reproduces exactly; LIV locates it. The test
// runs the real cutCells on both texts and asserts every named span occurs there (byte-exact),
// both texts — so the manual can never teach a span the cutter cannot find. The reply renders
// two ways (one source): named { surface, marks } JSON, or inline [[ ]] + musical. Both name
// exactly the spans Kyoto · truly · rivals · Tokyo over the SAME reply sentence.
export const COIN_EXAMPLE_WEARER = 'I toured Kyoto'
export const COIN_EXAMPLE_REPLY = 'Kyoto truly rivals Tokyo.'

// The inline rendering of COIN_EXAMPLE_REPLY: stacked clauses + all four marks + a coloring.
// parseInlineReply(COIN_EXAMPLE_INLINE).clean === COIN_EXAMPLE_REPLY, and every wrapped span
// occurs byte-exact in the live cut — both pinned by coin-manual.test against the real parser.
export const COIN_EXAMPLE_INLINE =
  '[[Kyoto]](note)(tie Kyoto) [[truly]](expression truly Kyoto) [[rivals]](chord Kyoto, Tokyo) [[Tokyo]].'

// ── The shared spine — identical PROSE across both forms (the concepts, the naming rule, the
// search section, the voice). Only the emission-SYNTAX sections (THE FOUR MARKS, the variant
// and block rules' written form, the worked example, HOW TO RETURN) branch by form. ──

const SPINE_HEAD =
`You are with a person. In one pass: compose your reply, then mark both turns — theirs and yours.
You name the spans; LIV finds them. You never count anything.

NAME — by span, not by number
Quote the span a mark sits on, exactly as it appears in the text — a word ("Kyoto") or a short
span ("truly rivals"). LIV locates it. If you name a span the text does not contain, LIV rejects
it loud, naming the span you wrote. Reproduce the span byte-for-byte; that exactness is your
safety. If a word repeats, the first one is meant — to mean a later one, name a longer span that
appears only once ("rivals Tokyo" instead of a second "Kyoto").`

// A, B, T resolution + the search/looking-around section — identical in both forms (the model
// reads the same present and copies the same coordinates whichever way it writes a mark).
const SPINE_TARGETS =
`A, B, T — a name or a coordinate, nothing else
  a NAME ("Kyoto") — clusters across the whole present; prefer it.
  a COORDINATE { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } — to pin one exact past
  appearance; copied from search, never counted. A coordinate lives ONLY inside a Ref; it is
  never a home. Every target/peer must resolve to something in the present or this reply.

To pin one exact earlier appearance: search { region:{ kind:"thing", name:"Kyoto" }, lens:{ view:"raw" } }
returns numbered cells; copy a cell's { who, sc, pos } into your Ref —
  { "op": "tie", "target": { "who": "wearer", "sc": 7, "pos": 5 } }   (copied from search, never counted)`

const SPINE_SEARCH =
`LOOKING AROUND — search (when you want more than the present sets before you)
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

// ── The NAMED ({ surface, marks }) emission-syntax sections — the CURRENT manual prose, VERBATIM.
// Only the way a mark is WRITTEN lives here; every concept (the four, variant=note+tie, block=note)
// is the same in both forms. ──

const NAMED_MARKS =
`THE FOUR MARKS (the whole set)
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
attach it with the ordinary marks (chord it to what it relates to, expression to color it).`

const NAMED_REPLY_SECTION =
`THE PERSON'S TURN — "priorMarks", naming spans of their most-recent turn
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
}`

// ── The INLINE ([[ ]] + musical) emission-syntax sections — the SAME concepts, only the way a
// mark is WRITTEN transposed: a thing is wrapped in [[ ]] in the reply text and its musical op +
// targets ride a trailing (clause). The four marks, variant=note+tie, block=note are unchanged. ──

const INLINE_MARKS =
`THE FOUR MARKS (the whole set)
  note        names a thing                                    [[span]]            (a bare ]] is a note)
  chord       links 2+ things into one connection              [[span]](chord A, B)
  expression  colors one thing — quality, degree, negation,
              or claim-status ("asked", "maybe")               [[span]](expression <coloring> <target>)
  tie         the same thing as one already named
              (pronoun, co-reference, typo)                    [[span]](tie T)
The wrapped span is what the mark sits on; for a chord it is also the relation's name. State the
coloring as one word, then one target. One coloring per expression. Never wrap punctuation.

A span may carry several marks — stack the clauses: [[span]](note)(tie T) is a note AND a tie.
A wrap with clauses carries exactly those; a bare [[span]] is a note.

A variant of a thing is the same thing: wrap its span and stack (note)(tie <the thing>) —
"it"/"they", a second mention, a typo ("buidl"→"build") — so it folds into the one thing
instead of splitting into many.

A block is a thing: a code block, a table, a payload — do not wrap it; LIV marks it for you.
Refer to it by name in the ordinary marks (chord it to what it relates to, expression to color it).`

const INLINE_REPLY_SECTION =
`THE PERSON'S TURN — "priorMarks", naming spans of their most-recent turn
  { "surface": "<a span their turn contains>", "marks": [ ... ] }

YOUR REPLY — "reply", marked AS you write it
  Put your reply in "reply" as ONE plain text string — your exact words and punctuation. Wrap
  each thing in [[ ]] right where it sits and stack its marks in trailing clauses. Mark fully,
  not only the highlights; a span may carry several marks; overlap is fine — the geometry
  settles across turns. Do not wrap code/data blocks — LIV marks those for you.

WORKED EXAMPLE
The person said: [7] (—): ${COIN_EXAMPLE_WEARER}
Your reply: "${COIN_EXAMPLE_REPLY}"
  "reply": "${COIN_EXAMPLE_INLINE}"
  "priorMarks": [
    { "surface": "Kyoto", "marks": [ { "op": "note" } ] }
  ]`

// HOW TO RETURN — renders ONLY the projected surface's OWN instruction, keyed on includeWearerText
// (the stable native-vs-wire key — never replyMarking): the wire carries the person's turn inline
// (wearerText) and calls compose; native returns the JSON object alone. `fields` is the surface's
// own projected field list (computed by the caller from its schema) — never both surfaces' lines.
function howToReturn(includeWearerText: boolean, fields: readonly string[]): string {
  return includeWearerText
    ? `HOW TO RETURN
  call compose ONCE with exactly these fields: { ${fields.join(', ')} } — the person's words and
  your scored reply together; LIV records both turns and sets your present.`
    : `HOW TO RETURN
  return ONLY the JSON object, exactly these fields: { ${fields.join(', ')} }.`
}

// ── The projection — ONE manual, rendered from primitives the CALLER computes (strict R0 leaf) ──
// The spine is identical; only the emission-syntax sections (THE FOUR MARKS, the reply section,
// the worked example) branch on opts.inline, and HOW TO RETURN on opts.includeWearerText. R0
// interprets no field-name semantics — opts.fields is the field list the caller derived from its
// OWN projectEmissionSchema(situation), so the manual and the schema share one logical source AT
// THE CALLER (where the schema lives) and cannot drift. This file imports nothing from R1.
export function projectManual(opts: { inline: boolean; includeWearerText: boolean; fields: readonly string[] }): string {
  const marksSection = opts.inline ? INLINE_MARKS : NAMED_MARKS
  const replySection = opts.inline ? INLINE_REPLY_SECTION : NAMED_REPLY_SECTION
  return `FILL MANUAL (v${COIN_MANUAL_DATE} ; the complete rules — nothing about marking lives outside this)

${SPINE_HEAD}

${marksSection}

${SPINE_TARGETS}

${replySection}

${howToReturn(opts.includeWearerText, opts.fields)}

${SPINE_SEARCH}`
}
