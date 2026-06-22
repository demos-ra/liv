// @liv-standard v1.5.2
// [F-payload-store/R3]
// Built with LIV · livai.dev
// [F-payload-store/contract/payload-store-contract.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    Wing-B B2 (the §3b outbound socket's public boundary).
//             The ONLY import path for the byte store across slices. F-present (the Y-seam)
//             reaches the store HERE — never into R0/R2/R4. storePayload mints a handle;
//             resolvePayload reads bytes lazily; isPayloadHandle recognizes a handle in text.
//             Mirrors F-entitlement/contract/entitlement-contract. A6: outbound surface declared
//             at R3 of the defining slice. The engine consumes only the S1 object-mark + this
//             handle; bytes never cross into engine code (A2 — the socket plugs the boundary,
//             grows no engine).
// slice:      F-payload-store
// layer:      R3
// wires-in:
//   W-FN    storePayload / resolvePayload  @/features/F-payload-store/app/payload-store-workflow
//   W-ATOM  StoreHandle / PayloadKind / PayloadBytes / PayloadDescriptor / ByteStoreAdapter
//                                          @/features/F-payload-store/config/payload-store-config
//   W-CONST PAYLOAD_HANDLE_SCHEME          @/features/F-payload-store/config/payload-store-config
// wires-out:
//   W-FN    storePayload / resolvePayload  →  F-present (Y-seam intake), payload intake routes
//   W-FN    isPayloadHandle                →  F-present (the Y-seam — recognize a handle in a reply)
//   W-ATOM  StoreHandle / PayloadKind / PayloadDescriptor  →  F-present (the block-identity's content)
//   W-ATOM  ByteStoreAdapter / PayloadBytes →  tests + a real-adapter author
// deps:
//   R2  @/features/F-payload-store/app/payload-store-workflow
//   R0  @/features/F-payload-store/config/payload-store-config
// validated: pending

export { storePayload, resolvePayload } from '@/features/F-payload-store/app/payload-store-workflow'
export type {
  StoreHandle, PayloadKind, PayloadBytes, PayloadDescriptor, ByteStoreAdapter,
} from '@/features/F-payload-store/config/payload-store-config'
export { PAYLOAD_HANDLE_SCHEME } from '@/features/F-payload-store/config/payload-store-config'

import type { StoreHandle } from '@/features/F-payload-store/config/payload-store-config'
import { PAYLOAD_HANDLE_SCHEME } from '@/features/F-payload-store/config/payload-store-config'

// Recognize a store handle in raw text — the Y-seam's gate on the payload arm. A reply
// that carries a livbyte:// handle is a payload appearance; F-present's classifier
// (content-signature.ts payload-ref witness) flags the line, and this confirms+parses the
// handle into a StoreHandle the engine can carry as the block-identity's content. Channel-
// blind: it reads only the text. Returns the parsed handle or null (not a throw — a
// non-handle is simply prose). `kind` is left 'file' unless a media hint is present; the
// authoritative kind is the one minted at storePayload (descriptor), this is the read-side
// recognizer.
export function isPayloadHandle(text: string): StoreHandle | null {
  const m = text.match(/livbyte:\/\/\S+/)
  if (!m) return null
  const uri = m[0]
  return uri.startsWith(PAYLOAD_HANDLE_SCHEME) ? { uri, kind: 'file' } : null
}
