// @liv-standard v1.5.2
// [F-payload-store/R0]
// Built with LIV · livai.dev
// [F-payload-store/config/payload-store-config.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    Wing-B B2 (payload-by-reference + byte-store socket — NET-NEW slice).
//             The §3b OUTBOUND socket vocabulary: a payload (image/video/audio/file) is an
//             OBJECT-IDENTITY (S1) whose content resolves to a SEPARATE byte store, plugged as
//             a swappable adapter. The engine never sees a byte — it holds only a StoreHandle
//             (an opaque reference), and the bytes resolve LAZILY on read through this socket.
//             Mirrors the F-entitlement §3b precedent (EntitlementProvider): one async function
//             behind one shape; the live binding is one line at R2; swapping the adapter touches
//             no consumer. R9: reference, NEVER embed — the handle is what crosses, not bytes.
// slice:      F-payload-store
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  StoreHandle        →  F-payload-store/R3 R4, F-present (the block-identity's content reference)
//   W-ATOM  PayloadKind        →  F-payload-store/R3 R4
//   W-ATOM  PayloadBytes       →  F-payload-store/R3 R4
//   W-ATOM  PayloadDescriptor  →  F-payload-store/R3 R4
//   W-ATOM  ByteStoreAdapter   →  F-payload-store/R3 R4 (THE SWAP POINT)
//   W-CONST PAYLOAD_HANDLE_SCHEME →  F-payload-store/R4, F-present (the livbyte:// scheme)
// deps:      none
// validated: pending

// The rendering kinds a payload object can carry. Named by MEDIA CLASS, never by
// platform or container — 'image' not 'png', 'video' not 'mp4'. Open-vocabulary in
// spirit (mirrors the substrate's open enums); the closed set here is the four the
// intake-widening contract names (M6). 'file' is the catch-all for any other byte blob.
export type PayloadKind = 'image' | 'video' | 'audio' | 'file'

// THE STORE HANDLE — the opaque reference the engine holds INSTEAD of the bytes. It is
// NOT a Ref (the frozen mark Ref = string | Coord is UNTOUCHED): a payload's content is
// the store handle, carried OUTSIDE the mark rail. A block-identity (B1) homes at the
// payload's appearance coordinate; this handle is its CONTENT, resolved lazily on read.
//
// `uri` is the addressable handle in the livbyte:// scheme (PAYLOAD_HANDLE_SCHEME); the
// adapter alone knows how to turn it into bytes. `kind` lets a reader render a placeholder
// without resolving. The handle is immutable once minted (content-addressed in spirit).
export type StoreHandle = {
  uri:  string        // e.g. livbyte://<adapter>/<key> — opaque to the engine
  kind: PayloadKind
}

// The byte payload the adapter writes/reads. Bytes are NEVER held by the engine — they
// live behind the socket; this type appears only inside the §3b boundary (R3/R4).
export type PayloadBytes = {
  bytes:    Uint8Array
  mimeType: string    // the wire mime ('image/png', …) — a descriptor, not a routing key
}

// What the engine knows about a payload WITHOUT resolving bytes — the descriptor that
// rides alongside the StoreHandle so a reader can render/route lazily. Size is advisory.
export type PayloadDescriptor = {
  handle: StoreHandle
  bytes?: number      // size in bytes, if the adapter reported it; advisory
}

// ── THE SWAP POINT (§3b — mirrors EntitlementProvider) ────────────────────────
// A byte store is two async functions behind this shape: `put` mints a handle from
// bytes, `get` resolves bytes from a handle (LAZILY — only when a read needs them).
// The hosted default plugs in here; an S3/R2 cloud store plugs in here. Swapping the
// adapter is changing which object the R2 binding names — no consumer re-cut, no engine
// line touched. The engine stays byte-UNTOUCHED: it never imports this; it holds only a
// StoreHandle and asks the R3 contract to resolve it.
export type ByteStoreAdapter = {
  put: (payload: PayloadBytes) => Promise<StoreHandle>
  get: (handle: StoreHandle) => Promise<PayloadBytes>
}

// The handle scheme — the rendering-class-neutral prefix every handle carries. Detected
// by the B1 classifier (content-signature.ts payload-ref witness) so a bare handle in a
// reply routes down the payload arm. One literal, one home.
export const PAYLOAD_HANDLE_SCHEME = 'livbyte://' as const

export const PAYLOAD_STORE_NAMESPACE = 'payload_store' as const
