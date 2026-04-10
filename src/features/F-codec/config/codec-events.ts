// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:   none
// wires-out:
//   W-EVENT  codec.encode-complete  →  F-event-system/R0
//   W-EVENT  codec.encode-failed    →  F-event-system/R0
// deps:       none
// validated:  pending

// A6: event names declared at R0 of emitting slice.
// A5: consumed via event bus only — no slice imports these directly.

export const CODEC_EVENTS = {
  ENCODE_COMPLETE: 'codec.encode-complete',
  ENCODE_FAILED:   'codec.encode-failed',
} as const

export type CodecEventType = typeof CODEC_EVENTS[keyof typeof CODEC_EVENTS]
