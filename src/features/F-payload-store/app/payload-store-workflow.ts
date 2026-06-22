// @liv-standard v1.5.2
// [F-payload-store/R2]
// Built with LIV · livai.dev
// [F-payload-store/app/payload-store-workflow.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    Wing-B B2 (the binding — the one line that names the live byte store).
//             storePayload mints a handle (lazy bytes never touch the engine); resolvePayload
//             reads bytes back LAZILY through the adapter. Mirrors F-entitlement/app/
//             entitlement-workflow: the ACTIVE_BYTE_STORE binding is the whole swap point —
//             repoint it at an S3/R2 adapter and no consumer changes. A test/caller may pass
//             its own adapter (proving the seam is adapter-agnostic); production passes nothing.
// slice:      F-payload-store
// layer:      R2
// wires-in:
//   W-ATOM  ByteStoreAdapter / StoreHandle / PayloadBytes  @/features/F-payload-store/config/payload-store-config
//   W-FN    inMemoryByteStore                              @/features/F-payload-store/exec/in-memory-byte-store
// wires-out:
//   W-FN    storePayload / resolvePayload  →  F-payload-store/R3
// deps:
//   R0  @/features/F-payload-store/config/payload-store-config
//   R4  @/features/F-payload-store/exec/in-memory-byte-store
// validated: pending

import type { ByteStoreAdapter, StoreHandle, PayloadBytes } from '@/features/F-payload-store/config/payload-store-config'
import { inMemoryByteStore } from '@/features/F-payload-store/exec/in-memory-byte-store'

// THE BINDING — the one line that names the live byte store. To plug S3/R2: add the
// R4 adapter and repoint this to it. That is the whole swap; no consumer changes, no
// engine/boundary/surface line is touched. (Mirrors ACTIVE_ENTITLEMENT_PROVIDER.)
const ACTIVE_BYTE_STORE: ByteStoreAdapter = inMemoryByteStore

// Store bytes → mint a handle. The engine receives ONLY the handle; bytes stay behind
// the socket (R9 — reference, never embed). Consumers call this; they never name an adapter.
export function storePayload(
  payload: PayloadBytes,
  store:   ByteStoreAdapter = ACTIVE_BYTE_STORE,
): Promise<StoreHandle> {
  return store.put(payload)
}

// Resolve bytes from a handle — LAZY: called only when a read actually needs the bytes.
// The engine holds the handle on the block-identity's content and asks here on demand.
export function resolvePayload(
  handle: StoreHandle,
  store:  ByteStoreAdapter = ACTIVE_BYTE_STORE,
): Promise<PayloadBytes> {
  return store.get(handle)
}
