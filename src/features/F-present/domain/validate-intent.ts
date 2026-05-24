// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/validate-intent.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3; sprint-b3-present-build (v3.0);
//   b3-v4-reconciliation (v4.0); sprint-b3-present-v5 (v5.0 intent collapse);
//   sprint-b3-present-v6 — Shot 7 (J-intent-binding re-stated against the
//   three-control envelope)
//
// PR1 — J-intent-binding mechanical check per Present Standard v6.0 §7.1.
//
// v6.0 re-derivation (Shot 7 — the three-control envelope):
//   The v5.0 criteria were C1 (standpoint) + C2 (zoomAnchor). v6.0 re-states
//   PresentIntent against the three controls, so the criteria are re-derived:
//     C1 — standpoint: PositionRef | null            (carried unchanged)
//     C2 — camera:     CameraSetting                 (re-derived — zoomAnchor
//          generalized into CameraSetting's 'set' mode)
//     C3 — temporal:   TemporalSetting               (v6.0 NEW)
//   The lens is stored dial state, validated where it is set — not at PR1.
//   C2 checks SHAPE only — a 'set' camera's anchor must be a well-formed
//   IdentityRef; it does NOT check the identity exists in any present (that is
//   the LLM's responsibility, [R9]).
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentIntent } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export function validateIntent(intent: PresentIntent): PresentResult<PresentIntent> {
  // C1: standpoint is PositionRef | null.
  //   null = the live present. non-null = a past position (scrub-back, [R16]).
  if (intent.standpoint !== null) {
    if (typeof intent.standpoint !== 'number' || !Number.isInteger(intent.standpoint) || intent.standpoint < 0) {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C1',
          message:         `standpoint must be null or a non-negative integer PositionRef; got '${String(intent.standpoint)}'`,
        },
      }
    }
  }

  // C2: camera is a well-formed CameraSetting ([R9]).
  //   { mode: 'derived' }  OR  { mode: 'set', anchor: <well-formed IdentityRef> }
  const cam = intent.camera
  if (cam === null || typeof cam !== 'object' || (cam.mode !== 'derived' && cam.mode !== 'set')) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C2',
        message:         `camera must be { mode: 'derived' } or { mode: 'set', anchor }; got '${JSON.stringify(cam)}'`,
      },
    }
  }
  if (cam.mode === 'set') {
    if (typeof cam.anchor !== 'string' || cam.anchor.length === 0) {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C2',
          message:         `camera.anchor must be a well-formed IdentityRef when mode='set'; got '${String(cam.anchor)}'`,
        },
      }
    }
  }

  // C3: temporal is a well-formed TemporalSetting ([R10]/[R11]).
  //   { depth: 'surface' }  OR  { depth: 'span', from?, to? }
  const tmp = intent.temporal
  if (tmp === null || typeof tmp !== 'object' || (tmp.depth !== 'surface' && tmp.depth !== 'span')) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C3',
        message:         `temporal must be { depth: 'surface' } or { depth: 'span', ... }; got '${JSON.stringify(tmp)}'`,
      },
    }
  }
  if (tmp.depth === 'span') {
    for (const k of ['from', 'to'] as const) {
      const v = tmp[k]
      if (v !== undefined && (typeof v !== 'number' || !Number.isInteger(v) || v < 0)) {
        return {
          ok: false,
          error: {
            code:            'PRESENT_INTENT_INVALID',
            failedCriterion: 'C3',
            message:         `temporal.${k} must be a non-negative integer PositionRef when present; got '${String(v)}'`,
          },
        }
      }
    }
  }

  return { ok: true, data: intent }
}
