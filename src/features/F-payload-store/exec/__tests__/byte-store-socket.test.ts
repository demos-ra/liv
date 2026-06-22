// @liv-standard v1.5.2
// [F-payload-store/R4 · test]
// Built with LIV · livai.dev
// Wing-B B2 — the §3b byte-store socket: store by reference, resolve lazily, swappable.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { storePayload, resolvePayload, isPayloadHandle, PAYLOAD_HANDLE_SCHEME } from '@/features/F-payload-store/contract/payload-store-contract'
import type { ByteStoreAdapter, PayloadBytes } from '@/features/F-payload-store/contract/payload-store-contract'

test('store → mint a livbyte:// handle; engine receives the handle, not bytes', async () => {
  const handle = await storePayload({ bytes: new Uint8Array([1, 2, 3]), mimeType: 'image/png' })
  assert.ok(handle.uri.startsWith(PAYLOAD_HANDLE_SCHEME))
  assert.equal(handle.kind, 'image')                   // mime → media class
})

test('resolve is lazy + round-trips the exact bytes', async () => {
  const original = new Uint8Array([9, 8, 7, 6])
  const handle = await storePayload({ bytes: original, mimeType: 'audio/ogg' })
  assert.equal(handle.kind, 'audio')
  const back = await resolvePayload(handle)
  assert.deepEqual([...back.bytes], [...original])
  assert.equal(back.mimeType, 'audio/ogg')
})

test('a foreign / unknown handle fails LOUD (the resolver owns byte-presence)', async () => {
  await assert.rejects(
    () => resolvePayload({ uri: 'livbyte://hosted/never-stored', kind: 'file' }),
    /no bytes for handle/,
  )
})

test('isPayloadHandle recognizes a handle in raw text, rejects prose (channel-blind)', () => {
  assert.ok(isPayloadHandle('see livbyte://hosted/abc'))
  assert.equal(isPayloadHandle('just prose'), null)
})

test('THE SWAP POINT: a caller may inject its own adapter — seam is adapter-agnostic', async () => {
  const calls: string[] = []
  const fake: ByteStoreAdapter = {
    put: async (_p: PayloadBytes) => { calls.push('put'); return { uri: 'livbyte://fake/k', kind: 'file' } },
    get: async () => { calls.push('get'); return { bytes: new Uint8Array([42]), mimeType: 'application/octet-stream' } },
  }
  const h = await storePayload({ bytes: new Uint8Array([0]), mimeType: 'application/pdf' }, fake)
  assert.equal(h.uri, 'livbyte://fake/k')
  const b = await resolvePayload(h, fake)
  assert.deepEqual([...b.bytes], [42])
  assert.deepEqual(calls, ['put', 'get'])              // production binding never touched
})
