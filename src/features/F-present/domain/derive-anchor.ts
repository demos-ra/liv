// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/derive-anchor.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3;
//   sprint-b3-present-v5 (v5.0: anchor re-derived);
//   sprint-b3-present-v6 — Shot 3/7 (the camera — derived or set)
//
// PR3 — Camera resolution per Present Standard v6.0 §3.7, [R9].
//
// v6.0 re-derivation (Shot 3/7 — the camera):
//   v5.0 derived an AnchorTrace from intent.zoomAnchor. v6.0 resolves the
//   CAMERA — where the tree is centred — into a CameraTrace ([R9]). Two modes:
//
//   DERIVED — intent.camera.mode = 'derived' (the user-driven path):
//     The camera points at the identity the user's latest state-change touches.
//     If the latest state-change touches several identities, the camera anchor
//     is the highest-mass cluster among them — and that crystallization needs
//     the substrate read, so it happens at PR4 (dispatch-read.ts). PR3 emits a
//     CameraTrace{mode:'derived'} with an EMPTY anchor seed; PR4 fills the
//     crystallized identity and the derivedFrom state-change.
//
//   SET — intent.camera.mode = 'set' (an LLM-initiated look, [R9]):
//     The camera anchor is intent.camera.anchor directly — a real identity the
//     LLM located in a present it was already given. No crystallization: PR3
//     takes it as the camera anchor. CameraTrace{mode:'set', anchor}.
//
// Design note: PrA7 (no cached anchor maps between invocations) is satisfied —
//   every call re-derives from scratch. derive-anchor.ts stays a PURE function:
//   it reads only the intent. The latest-state-change read is PR4's job; PR3
//   only routes (set -> direct anchor; derived -> empty seed for PR4 to fill).
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentIntent, CameraTrace, IdentityRef } from '../config/present-types'

// EMPTY_ANCHOR — the derived-mode seed. PR3 cannot know the crystallized
// identity (that needs the substrate read); it emits an empty anchor that PR4
// fills. Typed as IdentityRef to satisfy CameraTrace; treated as "unfilled" by
// PR4, which always overwrites it on the derived path.
const EMPTY_ANCHOR = '' as IdentityRef

export function deriveAnchor(intent: PresentIntent): CameraTrace {
  // SET — an LLM-initiated look ([R9]): the camera anchor IS intent.camera.anchor.
  if (intent.camera.mode === 'set') {
    return {
      mode:   'set',
      anchor: intent.camera.anchor,
    }
  }

  // DERIVED — the user-driven path ([R9]): the camera points at the identity the
  // user's latest state-change touches. PR3 emits an empty-anchor seed; PR4
  // reads the latest state-change, crystallizes the highest-mass identity, and
  // fills anchor + derivedFrom.
  return {
    mode:   'derived',
    anchor: EMPTY_ANCHOR,
  }
}
