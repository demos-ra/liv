// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (inline marking — situation-axis + parseInlineReply, Touch 1)
// [F-present/domain/__tests__/inline-marking.test.ts]
// Built with LIV · livai.dev
//
// INLINE-MARKING TOUCH 1 SUITE — the inline situation axis + the inline reply parser, both
// ADDITIVE (the separate/SpanMark[] path is byte-identical to today; pinned in emission-contract).
//   - PROJECTION: replyMarking:'inline' OMITS replyMarks and teaches the form on `reply`, keeps
//     priorMarks intact; 'separate'/absent is unchanged (the projection is the SAME shape as today).
//   - PARSER: parseInlineReply round-trips — strip [[ ]] + the trailing op-clause, return the CLEAN
//     reply and each wrap's CHARACTER-OFFSET span into THAT clean text (so clean.slice(start,end)
//     reproduces the wrapped span). Op is the musical word; targets parse (names → strings, who:sc:pos
//     → Coord). Malformed tag / unknown op / unclosed clause → MarkSurfaceError, loud, naming the span.
//
// Load note: warm the F-present R3 graph first (db client is lazy), then import coin-score.
// Run: npx tsx --test src/features/F-present/domain/__tests__/inline-marking.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cs: any

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  cs = await import('@/features/F-present/domain/coin-score')
})

// ── PROJECTION — the inline situation omits replyMarks; keeps priorMarks; teaches `reply` ──
test('inline projection omits replyMarks, keeps priorMarks, teaches the form on reply', () => {
  const s = cs.projectEmissionSchema({ includeWearerText: true, demand: 'all-present', replyMarking: 'inline' })
  assert.deepEqual(Object.keys(s.properties), ['wearerText', 'reply', 'priorMarks'], 'NO replyMarks field; priorMarks intact')
  assert.equal(s.properties.replyMarks, undefined, 'replyMarks is omitted entirely under inline')
  assert.ok(typeof s.properties.reply.description === 'string' && s.properties.reply.description.includes('[['),
    'the reply field carries the inline-form teaching')
  // priorMarks is the SAME shared mark geometry as today — the prior side is unchanged.
  assert.equal(s.properties.priorMarks.items, cs.SCORE_SCHEMA.properties.priorMarks.items, 'priorMarks rides the one shared mark item')
  assert.equal(s.properties.priorMarks.type, 'array')
  // required follows demand over the PRESENT fields (replyMarks is not present, so not required).
  assert.deepEqual(s.required, ['wearerText', 'reply', 'priorMarks'])
  assert.equal(s.additionalProperties, false)
})

test('separate / absent replyMarking is byte-identical to today (the SpanMark[] path survives)', () => {
  const absent = cs.projectEmissionSchema({ includeWearerText: true, demand: 'all-present' })
  const separate = cs.projectEmissionSchema({ includeWearerText: true, demand: 'all-present', replyMarking: 'separate' })
  assert.deepEqual(absent, separate, 'absent ≡ separate')
  assert.deepEqual(Object.keys(absent.properties), ['wearerText', 'reply', 'replyMarks', 'priorMarks'], 'replyMarks present on separate')
  // native MIGRATED to inline (Touch 3 native-first): NATIVE_SITUATION.replyMarking === 'inline',
  // so its projection now OMITS replyMarks and rides the inline teaching on `reply`. SCORE_SCHEMA
  // still IS the native projection (deterministic). The SEPARATE (SpanMark[]) path survives for the wire.
  assert.equal(cs.NATIVE_SITUATION.replyMarking, 'inline', 'native migrated to inline')
  assert.deepEqual(cs.SCORE_SCHEMA, cs.projectEmissionSchema(cs.NATIVE_SITUATION))
  assert.deepEqual(Object.keys(cs.SCORE_SCHEMA.properties), ['reply', 'priorMarks'], 'native inline omits replyMarks')
  assert.ok(typeof cs.SCORE_SCHEMA.properties.reply.description === 'string', 'native inline rides the inline teaching on reply')
})

// ── PARSER — round-trip: strip then the clean text reproduces the spans, offsets land right ──
test('parseInlineReply strips wraps and the clean text is what cutCells would cut', () => {
  const reply = 'I think [[Kyoto]] truly [[rivals]](chord Kyoto, Tokyo) [[Tokyo]].'
  const { clean, marks } = cs.parseInlineReply(reply)
  assert.equal(clean, 'I think Kyoto truly rivals Tokyo.', 'all markup stripped; the clean reply is plain text')
  assert.equal(marks.length, 3)
  // every offset lands on its exact substring in the CLEAN text.
  for (const m of marks) {
    assert.ok(m.start >= 0 && m.end <= clean.length && m.start < m.end, 'offsets are in-range into the clean text')
  }
  assert.equal(clean.slice(marks[0].start, marks[0].end), 'Kyoto')
  assert.equal(clean.slice(marks[1].start, marks[1].end), 'rivals')
  assert.equal(clean.slice(marks[2].start, marks[2].end), 'Tokyo')
})

test('a bare ]] is a note; a clause carries op + parsed targets (names + who:sc:pos coords)', () => {
  const { clean, marks } = cs.parseInlineReply('[[note]] and [[chord]](chord a, llm:7:3) and [[tie]](tie thing)')
  assert.equal(clean, 'note and chord and tie')
  // each span carries a marks ARRAY (the inline analog of SpanMark.marks[]).
  assert.deepEqual(marks[0].marks, [{ op: 'note', targets: [] }], 'a bare wrap → the implicit single note')
  assert.equal(marks[1].marks.length, 1)
  assert.equal(marks[1].marks[0].op, 'chord')
  assert.deepEqual(marks[1].marks[0].targets, ['a', { who: 'llm', sc: 7, pos: 3 }], 'bare name stays a string; who:sc:pos parses to Coord')
  assert.equal(marks[2].marks[0].op, 'tie')
  assert.deepEqual(marks[2].marks[0].targets, ['thing'])
})

// ── UNCAP — a span carries an ARRAY of marks (no one-mark cap; inline mirrors named SpanMark) ──
test('a span with two clauses carries BOTH marks; a chord-only span carries exactly one (no implicit note)', () => {
  const { clean, marks } = cs.parseInlineReply('[[Kyoto]](note)(tie Tokyo) and [[rivals]](chord Kyoto, Tokyo)')
  assert.equal(clean, 'Kyoto and rivals')
  // [[Kyoto]](note)(tie Tokyo) → TWO marks (note + tie) on the one span.
  assert.equal(marks[0].marks.length, 2, 'two adjacent clauses → two marks')
  assert.equal(marks[0].marks[0].op, 'note')
  assert.equal(marks[0].marks[1].op, 'tie')
  assert.deepEqual(marks[0].marks[1].targets, ['Tokyo'])
  // [[rivals]](chord …) → EXACTLY one mark (chord only) — a chord home is NOT auto-noted.
  assert.equal(marks[1].marks.length, 1, 'a wrap with clauses carries exactly those clauses; no implicit note')
  assert.equal(marks[1].marks[0].op, 'chord')
})

test('a span with note+tie homes BOTH marks at one pos through locateInlineMarks', () => {
  const { clean, marks } = cs.parseInlineReply('I love [[Kyoto]](note)(tie Tokyo) deeply.')
  assert.equal(clean, 'I love Kyoto deeply.')
  const cells = cs.cutReply(clean).cells
  const located = cs.locateInlineMarks(marks, cells)
  // ONE home (the span "Kyoto") carrying TWO engine marks: identity (note) + IDENTIFY (tie).
  const wc = cs.wordCells(cells)
  const kyotoPos = wc.find((c: { word: string }) => c.word === 'Kyoto').pos
  const entry = located.find((l: { pos: number }) => l.pos === kyotoPos)
  assert.ok(entry, 'the span homes once at "Kyoto"')
  assert.equal(entry.marks.length, 2, 'both marks ride the one home')
  assert.deepEqual(entry.marks.map((m: { op: string }) => m.op).sort(), ['IDENTIFY', 'identity'])
})

test('text with no wraps round-trips unchanged with zero marks', () => {
  const { clean, marks } = cs.parseInlineReply('just plain prose, no marks at all.')
  assert.equal(clean, 'just plain prose, no marks at all.')
  assert.equal(marks.length, 0)
})

// ── PARSER — malformed input rejected LOUD (MarkSurfaceError-class), naming the span ──
test('an unclosed [[ throws MarkSurfaceError', () => {
  assert.throws(() => cs.parseInlineReply('start [[Kyoto and on'), (e: Error) => e.name === 'MarkSurfaceError')
})

test('an unknown op throws MarkSurfaceError naming the span', () => {
  assert.throws(
    () => cs.parseInlineReply('[[Kyoto]](sonata Tokyo)'),
    (e: Error) => e.name === 'MarkSurfaceError' && e.message.includes('Kyoto'),
  )
})

test('an unclosed op-clause ( throws MarkSurfaceError', () => {
  assert.throws(() => cs.parseInlineReply('[[Kyoto]](chord Tokyo'), (e: Error) => e.name === 'MarkSurfaceError')
})

test('an empty wrap [[]] throws MarkSurfaceError', () => {
  assert.throws(() => cs.parseInlineReply('a [[]] b'), (e: Error) => e.name === 'MarkSurfaceError')
})

// ── EXPRESSION — coloring restored (ruling B): a dropped field, not a layer ──
// named QUALIFY is { coloring, target } (mark-types.ts:42, TWO values). inline expression now
// carries BOTH: coloring = the FIRST whitespace token (stated, not inferred), target = the remainder.
test('inline expression parses coloring (first token) + target (remainder); note/chord/tie keep no coloring', () => {
  const { clean, marks } = cs.parseInlineReply('[[Kyoto]](expression vivid Tokyo) and [[a]] and [[b]](tie c)')
  assert.equal(clean, 'Kyoto and a and b')
  assert.equal(marks[0].marks[0].op, 'expression')
  assert.equal(marks[0].marks[0].coloring, 'vivid', 'the coloring is the first whitespace token')
  assert.deepEqual(marks[0].marks[0].targets, ['Tokyo'], 'the target is the remainder Ref')
  // a who:sc:pos coord target after the coloring parses to a Coord.
  const { marks: m2 } = cs.parseInlineReply('[[X]](expression negated llm:7:3)')
  assert.equal(m2[0].marks[0].coloring, 'negated')
  assert.deepEqual(m2[0].marks[0].targets, [{ who: 'llm', sc: 7, pos: 3 }])
  // note / tie carry NO coloring (absent, not empty).
  assert.equal(marks[1].marks[0].coloring, undefined, 'note carries no coloring')
  assert.equal(marks[2].marks[0].coloring, undefined, 'tie carries no coloring')
})

test('inline expression homes through locateInlineMarks as a QUALIFY with { coloring, target } (the previously-dropped case lands)', () => {
  const reply = 'I think [[Kyoto]](expression vivid Tokyo) shines.'
  const { clean, marks } = cs.parseInlineReply(reply)
  assert.equal(clean, 'I think Kyoto shines.')
  const cells = cs.cutReply(clean).cells
  const located = cs.locateInlineMarks(marks, cells)
  // ONE located mark: a QUALIFY (engine op for expression) carrying BOTH coloring and target.
  const quals = located.flatMap((l: { marks: { op: string }[] }) => l.marks).filter((m: { op: string }) => m.op === 'QUALIFY')
  assert.equal(quals.length, 1, 'the expression now passes the gate and HOMES (it dropped before, missing coloring)')
  assert.equal(quals[0].coloring, 'vivid')
  assert.deepEqual(quals[0].target, 'Tokyo')
  // it homes on the wrapped span "Kyoto".
  const wc = cs.wordCells(cells)
  const kyotoPos = wc.find((c: { word: string }) => c.word === 'Kyoto').pos
  assert.ok(located.some((l: { pos: number; marks: { op: string }[] }) => l.pos === kyotoPos && l.marks.some((m: { op: string }) => m.op === 'QUALIFY')))
})

test('an expression missing its coloring or its target throws MarkSurfaceError, naming the span', () => {
  // no whitespace remainder after the op → coloring present but target missing
  assert.throws(
    () => cs.parseInlineReply('[[Kyoto]](expression vivid)'),
    (e: Error) => e.name === 'MarkSurfaceError' && e.message.includes('Kyoto'),
  )
  // empty clause body after the op → no coloring at all
  assert.throws(
    () => cs.parseInlineReply('[[Kyoto]](expression)'),
    (e: Error) => e.name === 'MarkSurfaceError' && e.message.includes('Kyoto'),
  )
})

// ── UNIFORMITY — the 4 marks carry exactly the named fields, nothing added/dropped ──
test('4-mark uniformity: note=home only, chord=peers, tie=target, expression=coloring+target', () => {
  const { marks } = cs.parseInlineReply('[[n]] [[c]](chord a, b) [[t]](tie x) [[e]](expression warm y)')
  // each wrap here is a single-mark span — read the lone mark off each span's marks array.
  const note = marks[0].marks[0], chord = marks[1].marks[0], tie = marks[2].marks[0], expr = marks[3].marks[0]
  // note: just a home, no fields.
  assert.equal(note.op, 'note'); assert.deepEqual(note.targets, []); assert.equal(note.coloring, undefined)
  // chord: peers (comma-separated), no coloring.
  assert.equal(chord.op, 'chord'); assert.deepEqual(chord.targets, ['a', 'b']); assert.equal(chord.coloring, undefined)
  // tie: one target, no coloring.
  assert.equal(tie.op, 'tie'); assert.deepEqual(tie.targets, ['x']); assert.equal(tie.coloring, undefined)
  // expression: coloring + one target — both named fields of QUALIFY.
  assert.equal(expr.op, 'expression'); assert.equal(expr.coloring, 'warm'); assert.deepEqual(expr.targets, ['y'])
})
