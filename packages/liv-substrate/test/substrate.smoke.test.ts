// @liv-standard v1.5.2
// Built with LIV · livai.dev
// Standalone live proof for the portable substrate package. Two tiers:
//   - pure tier (no DB): the word-cut is an exact inverse, the seam is baseline-
//     empty, and the barrel exposes the named socket. Always runs.
//   - live tier (DB): a real write→read round-trip + scope read against a Postgres
//     with the `state_change` table. Runs only when DATABASE_URL is set; otherwise
//     skipped so the package proves itself with no LIV server present.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  writeRawTurn,
  readTranscript,
  readScope,
  cutCells,
  joinCells,
  isWordCell,
  getReplyComposer,
  getContextReader,
  registerReplyComposer,
  resetCognitionSeam,
  closeDb,
} from '../src/index'

// ── Pure tier: the word-cut is an exact inverse ────────────────────────────────
test('cutCells / joinCells round-trip byte-exact', () => {
  const samples = [
    'hello world',
    "don't stop — well-known U.S. facts, 3.14 and all",
    '  leading and  doubled   spaces \n newline\t tab ',
    'punctuation!!! ...standalone??? (parens) [brackets]',
    'буідл stays буідл — unicode words survive',
    '',
    'singleword',
  ]
  for (const s of samples) {
    assert.equal(joinCells(cutCells(s)), s, `round-trip must reproduce: ${JSON.stringify(s)}`)
  }
})

test('cutCells numbers positions from 1, contiguous', () => {
  const cells = cutCells('a b c')
  assert.deepEqual(cells.map(c => c.pos), [1, 2, 3, 4, 5]) // word, space, word, space, word
})

test('isWordCell distinguishes word cells from inert cells', () => {
  const cells = cutCells('hi, there')
  // 'hi' word, ',' punct, ' ' space, 'there' word
  assert.equal(isWordCell(cells[0].word), true)   // hi
  assert.equal(isWordCell(cells[1].word), false)  // ,
  assert.equal(isWordCell(cells[2].word), false)  // space
  assert.equal(isWordCell(cells[3].word), true)   // there
})

// ── Pure tier: the seam is baseline-empty until the engine plugs in ────────────
test('cognition seam baseline — empty registry, engine-absent', () => {
  resetCognitionSeam()
  assert.equal(getReplyComposer(), null, 'no composer registered → baseline')
  assert.equal(getContextReader(), null, 'no reader registered → baseline')

  // Plug a stand-in engine into the fuse point.
  registerReplyComposer(async () => ({ sc: 1, markCount: 0, text: 'ok' }))
  assert.notEqual(getReplyComposer(), null, 'engine plugged → upgraded')

  // Pull it back off — the store stands alone again.
  resetCognitionSeam()
  assert.equal(getReplyComposer(), null, 'engine removed → baseline restored')
})

// ── Live tier: a real write → read round-trip (DB-gated) ───────────────────────
test('live store: write a raw turn, read it back, scope it', async (t) => {
  if (!process.env.DATABASE_URL) {
    t.skip('DATABASE_URL not set — live store tier skipped (pure tier proves the rest)')
    return
  }

  const userId = `smoke_${Date.now()}`
  const scope = userId
  const words = cutCells('hello from the standalone substrate')

  const sc = await writeRawTurn({ who: 'wearer', words, userId, scope })
  assert.equal(typeof sc, 'number')
  assert.ok(Number.isFinite(sc), 'write returns a real coordinate')

  const transcript = await readTranscript(userId)
  assert.equal(transcript.length, 1, 'one turn written, one read back')
  assert.equal(transcript[0].sc, sc, 'coordinate is stable across write/read')
  assert.equal(transcript[0].who, 'wearer')
  assert.equal(joinCells(transcript[0].words), 'hello from the standalone substrate')

  const scoped = await readScope(userId)
  assert.equal(scoped.ok, true, 'scope read succeeds')
  if (scoped.ok) {
    assert.equal(scoped.data.length, 1, 'scope read returns the row')
    assert.equal(scoped.data[0].userId, userId)
  }

  await closeDb()
})
