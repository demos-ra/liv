// @liv-standard v1.5.2
// [F-payload-store/R4]
// Built with LIV · livai.dev
// [F-payload-store/exec/in-memory-byte-store.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    Wing-B B2 (byte I/O — the §3b socket slot, occupied by the hosted default).
//             This is where a byte store's outbound I/O lives. The hosted default keeps bytes
//             in-process (a Map keyed by minted handle) — the integration-socket slot, filled,
//             with no external system to call. A real store (S3/R2/GCS) sits BESIDE this file:
//             it puts bytes to its bucket, mints a livbyte:// handle over the object key, and
//             gets them back by key; the R2 binding is repointed at it and NOTHING else moves.
//             Mirrors F-entitlement/exec/hosted-entitlement-provider. The engine is byte-
//             untouched: it never imports this; it holds a StoreHandle and resolves through R3.
// slice:      F-payload-store
// layer:      R4
// wires-in:
//   W-ATOM  ByteStoreAdapter / StoreHandle / PayloadBytes  @/features/F-payload-store/config/payload-store-config
//   W-CONST PAYLOAD_HANDLE_SCHEME                           @/features/F-payload-store/config/payload-store-config
//   W-FN    generateId                                      @/core/types/primitives
// wires-out:
//   W-FN    inMemoryByteStore  →  F-payload-store/R2
// deps:
//   R0  @/features/F-payload-store/config/payload-store-config
//   R0  @/core/types/primitives
// validated: pending

import type { ByteStoreAdapter, StoreHandle, PayloadBytes } from '@/features/F-payload-store/config/payload-store-config'
import { PAYLOAD_HANDLE_SCHEME } from '@/features/F-payload-store/config/payload-store-config'
import { generateId } from '@/core/types/primitives'

// The hosted default byte store — the socket slot, occupied.
//
// Bytes live in-process, keyed by the handle's stable id. `put` mints a livbyte://
// handle over a fresh id (the engine receives only that handle — bytes never cross the
// seam into engine code). `get` resolves bytes LAZILY — only when a read actually asks.
// A handle whose bytes are absent (e.g. after a restart, or a foreign handle) is a loud
// failure, named — the resolver, not the engine, owns byte-presence.
//
// A real adapter replaces this whole object: same two methods, same shapes; it talks to
// its bucket instead of a Map. That is the entire swap (the R2 binding repoints).
function makeInMemoryByteStore(): ByteStoreAdapter {
  const blobs = new Map<string, PayloadBytes>()
  const keyOf = (h: StoreHandle) => h.uri

  return {
    put: async (payload: PayloadBytes): Promise<StoreHandle> => {
      const id = generateId('blob')
      const uri = `${PAYLOAD_HANDLE_SCHEME}hosted/${id}`
      // kind is decided by the caller (R2) from the mime; the store keeps bytes only.
      const handle: StoreHandle = { uri, kind: kindFromMime(payload.mimeType) }
      blobs.set(keyOf(handle), payload)
      return handle
    },
    get: async (handle: StoreHandle): Promise<PayloadBytes> => {
      const found = blobs.get(keyOf(handle))
      if (!found) {
        throw new Error(`in-memory-byte-store: no bytes for handle "${handle.uri}" — the handle resolves to nothing in this store (foreign handle, or bytes evicted).`)
      }
      return found
    },
  }
}

// Mime → media class (PayloadKind). Channel/container-blind: the major type decides the
// rendering class, never the container ('image/png' and 'image/webp' are both 'image').
function kindFromMime(mime: string): StoreHandle['kind'] {
  const major = mime.split('/')[0]?.toLowerCase()
  if (major === 'image') return 'image'
  if (major === 'video') return 'video'
  if (major === 'audio') return 'audio'
  return 'file'
}

// The single hosted-default instance (one in-process store for the process lifetime).
export const inMemoryByteStore: ByteStoreAdapter = makeInMemoryByteStore()
