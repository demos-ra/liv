// @liv-standard v1.5.2
// [F-present/R1 · test]
// Built with LIV · livai.dev
// Wing-B E3 — PAYLOAD AS A CELL. A payload is the same citizen as a word-cell, larger:
// ONE RawWord cell whose `word` IS the StoreHandle uri (livbyte://…). The sidecar is GONE
// (no PayloadAppearance.handle, no arms.payloads). Bytes live behind the §3b socket and
// resolve LAZILY on read (storePayload mints; resolvePayload fetches). The handle is the
// cell's CONTENT, NEVER a Ref form.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shapeAwareCut, isHomeCapableCell, classOfCell } from '@/features/F-present/domain/content-signature'
import { locateCellIdentities } from '@/features/F-present/domain/coin-score'
import { storePayload, resolvePayload, isPayloadHandle, PAYLOAD_HANDLE_SCHEME } from '@/features/F-payload-store/contract/payload-store-contract'

test('§3b socket: storePayload mints a livbyte:// handle; resolvePayload fetches the bytes LAZILY', async () => {
  const bytes = new Uint8Array([1, 2, 3, 4])
  const handle = await storePayload({ bytes, mimeType: 'image/png' })
  assert.ok(handle.uri.startsWith(PAYLOAD_HANDLE_SCHEME))   // the handle is a livbyte:// uri
  assert.equal(handle.kind, 'image')                        // kind derived from the mime
  // bytes never crossed into the engine — they resolve only when asked, through the socket:
  const back = await resolvePayload(handle)
  assert.deepEqual(back.bytes, bytes)
  assert.equal(back.mimeType, 'image/png')
})

test('a minted handle, dropped into a reply, becomes a PAYLOAD-CELL whose word IS the handle', async () => {
  const handle = await storePayload({ bytes: new Uint8Array([9]), mimeType: 'image/png' })
  const reply = `here you go: ${handle.uri}`
  const cells = shapeAwareCut(reply)
  const payloadCell = cells.find((c: any) => c.word.includes(handle.uri))
  assert.ok(payloadCell, 'the handle coalesced into one payload-cell')
  assert.equal(classOfCell(payloadCell), 'payload')        // E2 re-derives the class from content
  assert.ok(isHomeCapableCell(payloadCell))                // home-capable like any cell
  // the cell's CONTENT carries the handle — the same uri the socket resolves bytes from:
  const recognized = isPayloadHandle(payloadCell.word)
  assert.ok(recognized)
  assert.equal(recognized.uri, handle.uri)
})

test('a payload-cell takes identity ON ITS OWN coordinate (no leading-word home, no Ref)', async () => {
  const handle = await storePayload({ bytes: new Uint8Array([7, 7]), mimeType: 'video/mp4' })
  const cells = shapeAwareCut(`watch: ${handle.uri}`)
  const ids = locateCellIdentities(cells)
  assert.equal(ids.length, 1)
  assert.deepEqual(ids[0].marks, [{ op: 'identity' }])
  const payloadCell = cells.find((c: any) => c.word.includes(handle.uri))!
  assert.equal(ids[0].pos, payloadCell.pos)                // homed at the cell's OWN pos
})

test('the handle is the cell CONTENT, NEVER a Ref — the mark on the cell carries no handle field', async () => {
  const handle = await storePayload({ bytes: new Uint8Array([0]), mimeType: 'audio/mpeg' })
  const cells = shapeAwareCut(handle.uri)
  const ids = locateCellIdentities(cells)
  // the located identity is a plain { pos, marks:[{op:'identity'}] } — no handle, no ref arm:
  assert.deepEqual(ids[0].marks, [{ op: 'identity' }])
  for (const m of ids[0].marks) {
    assert.equal((m as any).target, undefined)             // no Ref target carries the handle
    assert.equal((m as any).peers, undefined)
  }
})
