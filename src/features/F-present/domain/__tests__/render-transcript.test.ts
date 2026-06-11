// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — numbered transcript cells)
// [F-present/domain/__tests__/render-transcript.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 3 — numbered cells in the transcript render.
//   (A) COORD FROM THE RENDER: from the render text ALONE, construct a (who, sc, pos)
//       coordinate for an arbitrary word and verify it matches the cutCells ground
//       truth (the word at that position is exactly that word).
//   (B) FIDELITY: joinCells stays the sole text authority — strip every ⟨pos⟩ tag and
//       the line is joinCells(cells) byte-for-byte (annotation, never reassembly), over
//       an adversarial-punctuation corpus.
//   (C) punctuation/space cells are NOT tagged (manual: mark only word cells).
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/render-transcript.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let renderTranscript: (turns: RawTurn[]) => string
let cutCells: (t: string) => RawWord[]
let joinCells: (cells: RawWord[]) => string
let isWordCell: (w: string) => boolean

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ renderTranscript } = await import('@/features/F-present/domain/render-present'))
  ;({ cutCells, joinCells, isWordCell } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// parse a rendered turn line back into { sc, who, words:[{word,pos}] } using ONLY the
// render text — exactly what a reader (the LLM) has to do.
function parseLine(line: string): { sc: number; who: Who; words: { word: string; pos: number }[] } {
  const m = line.match(/^\[(\d+)\] \((.+?)\): (.*)$/)
  assert.ok(m, `unparseable turn line: ${JSON.stringify(line)}`)
  const sc = Number(m![1])
  const who: Who = m![2] === '—' ? 'wearer' : (m![2] as Who)
  const words: { word: string; pos: number }[] = []
  const re = /([^⟨\s]+)⟨(\d+)⟩/g
  let w: RegExpExecArray | null
  while ((w = re.exec(m![3])) !== null) words.push({ word: w[1], pos: Number(w[2]) })
  return { sc, who, words }
}

// ── (A) construct a coord from the render, verify against cutCells ──────────────
test('a (who, sc, pos) coord built from the render matches cutCells ground truth', () => {
  const text = 'Kyoto truly rivals Tokyo.'
  const turn: RawTurn = { sc: 7, who: 'llm', words: cutCells(text) }
  const render = renderTranscript([turn])

  const body = render.split('\n').slice(1)                  // drop the header line
  const parsed = parseLine(body[0])
  assert.equal(parsed.sc, 7)
  assert.equal(parsed.who, 'llm')

  // every parsed (pos → word) matches the canonical grid at that coordinate.
  const ground = cutCells(text)
  for (const { word, pos } of parsed.words) {
    const cell = ground.find(c => c.pos === pos)
    assert.ok(cell, `render names pos ${pos} which is not a real cell`)
    assert.equal(cell!.word, word, `render's word at pos ${pos} must equal the cut cell`)
    assert.ok(isWordCell(cell!.word), 'only word cells are tagged')
  }

  // pick an ARBITRARY word (the 4th word, "Tokyo") and build its full coordinate.
  const tokyo = parsed.words[3]
  assert.equal(tokyo.word, 'Tokyo')
  const coord = { who: parsed.who, sc: parsed.sc, pos: tokyo.pos }
  assert.deepEqual(coord, { who: 'llm', sc: 7, pos: ground.find(c => c.word === 'Tokyo')!.pos })
})

// ── (B) fidelity — strip the tags, get joinCells byte-for-byte ──────────────────
test('joinCells stays the sole text authority — tags strip to byte-identical text', () => {
  const corpus = [
    'hello, world', 'Kyoto truly rivals Tokyo.', 'wait... really?',
    'he said "hi" to U.S. officials', "don't go — it's 3.14 miles",
    'a, b, c.', 'spaces   kept    verbatim',
  ]
  for (const text of corpus) {
    const turn: RawTurn = { sc: 1, who: 'wearer', words: cutCells(text) }
    const body = renderTranscript([turn]).split('\n')[1]
    const after = body.slice(body.indexOf(': ') + 2)        // the rendered line body
    const stripped = after.replace(/⟨\d+⟩/g, '')            // remove every position tag
    assert.equal(stripped, joinCells(turn.words), `tag-strip drift for: ${JSON.stringify(text)}`)
    assert.equal(stripped, text, `not byte-identical to the source for: ${JSON.stringify(text)}`)
  }
})

// ── (C) punctuation/space cells are not tagged ──────────────────────────────────
test('punctuation and space cells carry no position tag', () => {
  const turn: RawTurn = { sc: 2, who: 'wearer', words: cutCells('hi, there') }
  const body = renderTranscript([turn]).split('\n')[1]
  // the comma and the space are present verbatim but never followed by ⟨n⟩.
  assert.ok(body.includes('hi⟨1⟩'), 'word cell tagged')
  assert.ok(body.includes('there⟨'), 'word cell tagged')
  assert.ok(!/,⟨/.test(body), 'comma cell must not be tagged')
  assert.ok(!/ ⟨/.test(body), 'space cell must not be tagged')
})
