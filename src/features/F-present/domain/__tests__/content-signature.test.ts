// @liv-standard v1.5.2
// [F-present/R1 · test]
// Built with LIV · livai.dev
// Wing-B E3 — the syntax-signature classifier + the SHAPE-AWARE CUT + the widened home-gate.
// Channel-blind: every assertion feeds raw text; none names a platform.
// A block and a payload are the SAME citizen as a word-cell, larger: each ONE RawWord cell at
// its own coordinate, home-capable, marked identity DIRECTLY on the cell (no leading-word home).
//
// Load note (mirrors scored-turn-recorder.test): warm the F-present R3 graph first,
// then deferred-import the source — dodges the SUBSTRATE_EVENTS module-init cycle.

import { test, before } from 'node:test'
import assert from 'node:assert/strict'

/* eslint-disable @typescript-eslint/no-explicit-any */
let classifyLine: any, classifyBlocks: any, isBlockClass: any, SIGNATURE_TABLE: any
let shapeAwareCut: any, classOfCell: any, isHomeCapableCell: any
let locateCellIdentities: any
let cutCells: (t: string) => { pos: number; word: string }[]
let joinCells: (c: { pos: number; word: string }[]) => string

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ classifyLine, classifyBlocks, isBlockClass, SIGNATURE_TABLE, shapeAwareCut, classOfCell, isHomeCapableCell } =
    await import('@/features/F-present/domain/content-signature'))
  ;({ locateCellIdentities } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells, joinCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

test('prose with no signature → prose (word path)', () => {
  assert.equal(classifyLine('Kyoto truly rivals the old capital.').class, 'prose')
  assert.equal(classifyLine('').class, 'prose')
})

test('md fence row → code; pipe table → data; blockquote → data', () => {
  assert.equal(classifyLine('```js').class, 'code')
  assert.equal(classifyLine('~~~').class, 'code')
  assert.equal(classifyLine('| a | b |').class, 'data')
  assert.equal(classifyLine('> quoted line').class, 'data')
})

test('terminal box rule + ANSI → scaffold (rendering chrome, channel-blind)', () => {
  assert.equal(classifyLine('┌──────┐').class, 'scaffold')
  assert.equal(classifyLine('│ cell │').class, 'scaffold')
  assert.equal(classifyLine('[31mred[0m').class, 'scaffold')
})

test('payload reference (md image + bare handle) → payload', () => {
  assert.equal(classifyLine('![cat](livbyte://hosted/abc)').class, 'payload')
  assert.equal(classifyLine('see livbyte://hosted/x9 here').class, 'payload')
})

test('witness names are rendering classes, never platforms', () => {
  for (const w of SIGNATURE_TABLE) {
    assert.doesNotMatch(w.name, /github|iterm|slack|discord|vscode|terminal-/i, `witness "${w.name}" must not name a platform`)
  }
})

test('classifyBlocks coalesces a fenced region (pipe inside a fence is code, not data)', () => {
  const text = ['intro prose', '```', '| not | a | table |', 'code line', '```', 'outro prose'].join('\n')
  const regions = classifyBlocks(text)
  assert.equal(regions[0].class, 'prose')
  assert.equal(regions[1].class, 'code')
  assert.equal(regions[1].startLine, 1)
  assert.equal(regions[1].endLine, 4)            // open fence .. close fence inclusive
  assert.equal(regions[2].class, 'prose')
})

test('isBlockClass: only prose is non-block', () => {
  assert.equal(isBlockClass('prose'), false)
  for (const c of ['code', 'data', 'scaffold', 'payload']) assert.equal(isBlockClass(c), true)
})

// ── THE SHAPE-AWARE CUT (E3) — round-trip + verifyGrid + one-cell-per-region ──────────
// verifyGrid clone (the engine's invariant): positions are 1..N contiguous, no gap, no dup.
const verifyGrid = (cells: { pos: number; word: string }[]) =>
  cells.every((c, i) => c.pos === i + 1)

test('shapeAwareCut: prose-only is the dumb cut (round-trips, grid holds)', () => {
  const text = 'Kyoto truly rivals Tokyo.'
  const cells = shapeAwareCut(text)
  assert.equal(joinCells(cells), text)            // exact inverse
  assert.ok(verifyGrid(cells))                    // 1..N contiguous
  assert.deepEqual(cells.map((c: any) => c.word), cutCells(text).map(c => c.word))  // same as dumb cut
})

test('shapeAwareCut: a fenced code region coalesces to ONE cell (verbatim), round-trips', () => {
  const text = ['Here is the snippet:', '```python', 'print(42)', '```', 'done.'].join('\n')
  const cells = shapeAwareCut(text)
  assert.equal(joinCells(cells), text)            // joinCells∘shapeAwareCut === text
  assert.ok(verifyGrid(cells))
  // exactly one cell carries the whole fenced region, verbatim:
  const blockCells = cells.filter((c: any) => c.word.includes('print(42)'))
  assert.equal(blockCells.length, 1)
  assert.equal(blockCells[0].word, '```python\nprint(42)\n```')   // the verbatim region text
})

test('shapeAwareCut: a payload region coalesces to ONE cell whose word IS the handle', () => {
  const text = 'an image: livbyte://hosted/pic'
  const cells = shapeAwareCut(text)
  assert.equal(joinCells(cells), text)
  assert.ok(verifyGrid(cells))
  const payloadCell = cells.find((c: any) => c.word.includes('livbyte://hosted/pic'))
  assert.ok(payloadCell)
})

test('shapeAwareCut: trailing newline + multi-region text round-trips byte-exact', () => {
  const text = ['p1', '| a | b |', '| c | d |', 'p2', ''].join('\n')   // trailing '' → trailing newline
  const cells = shapeAwareCut(text)
  assert.equal(joinCells(cells), text)
  assert.ok(verifyGrid(cells))
})

// ── classOfCell (E2) — re-derive a cell's class from its OWN content, never a field ──
test('classOfCell: re-derives the class from cell content (single + multi-line)', () => {
  assert.equal(classOfCell({ pos: 1, word: 'Kyoto' }), 'prose')
  assert.equal(classOfCell({ pos: 1, word: '```js\nx=1\n```' }), 'code')
  assert.equal(classOfCell({ pos: 1, word: 'livbyte://hosted/pic' }), 'payload')
  assert.equal(classOfCell({ pos: 1, word: '| a | b |' }), 'data')
})

// ── isHomeCapableCell — THE WIDENED GATE: word OR block/payload cell, no atom field ──
test('isHomeCapableCell: a plain word-cell is home-capable', () => {
  assert.equal(isHomeCapableCell({ pos: 1, word: 'Kyoto' }), true)
})

test('isHomeCapableCell: a block/payload cell with an inner word is home-capable', () => {
  assert.equal(isHomeCapableCell({ pos: 1, word: '```python\nprint(42)\n```' }), true)
  assert.equal(isHomeCapableCell({ pos: 1, word: 'livbyte://hosted/pic' }), true)
})

test('isHomeCapableCell: pure chrome (block-cell with NO inner word) is NOT home-capable', () => {
  assert.equal(isHomeCapableCell({ pos: 1, word: '┌────┐' }), false)   // a bare box rule
})

test('isHomeCapableCell: an inert whitespace/punct prose cell is NOT home-capable', () => {
  assert.equal(isHomeCapableCell({ pos: 1, word: ' ' }), false)
  assert.equal(isHomeCapableCell({ pos: 1, word: '...' }), false)
})

// ── locateCellIdentities (E3) — identities ON the block/payload cell's OWN coordinate ──
test('locateCellIdentities: a code fence cell gets identity ON its own pos (no leading word)', () => {
  const reply = ['Here is the snippet:', '```python', 'print(42)', '```', 'done.'].join('\n')
  const cells = shapeAwareCut(reply)
  const ids = locateCellIdentities(cells)
  assert.equal(ids.length, 1)
  assert.deepEqual(ids[0].marks, [{ op: 'identity' }])
  // homed at the BLOCK CELL's own pos — the cell whose word is the verbatim block, NOT a word.
  const blockCell = cells.find((c: any) => c.word.includes('print(42)'))
  assert.equal(ids[0].pos, blockCell.pos)
})

test('locateCellIdentities: a payload cell gets identity ON its own pos; its word IS the handle', () => {
  const reply = 'an image: livbyte://hosted/pic'
  const cells = shapeAwareCut(reply)
  const ids = locateCellIdentities(cells)
  assert.equal(ids.length, 1)
  const payloadCell = cells.find((c: any) => c.word.includes('livbyte://hosted/pic'))
  assert.equal(ids[0].pos, payloadCell.pos)
  assert.ok(payloadCell.word.includes('livbyte://hosted/pic'))   // content IS the handle, no sidecar
})

test('locateCellIdentities: prose-only reply yields NO auto-identities (prose marked by name)', () => {
  assert.deepEqual(locateCellIdentities(shapeAwareCut('just plain prose, no blocks at all')), [])
})

test('locateCellIdentities: pure chrome yields no identity (no coordinate to sit on)', () => {
  assert.deepEqual(locateCellIdentities(shapeAwareCut('┌────┐')), [])
})
