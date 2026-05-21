// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/derive-anchor.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3 (v2.0 domain re-wire)
//
// PR3 — Anchor derivation per Present Standard v2.0 §3.7.
// v2.0 re-derivation: anchor is derived from `focus` + `standpoint`, not from a
// five-arm `operation.kind`. The focus dimension determines the anchor's source
// and shape; the standpoint dimension is recorded for downstream ceiling wiring
// (PR4 dispatch-read) but does not itself change the anchor shape.
//
//   focus 'identity'      → wearer-content anchor on the named identity
//   focus 'identity-role' → wearer-content anchor on the named identity + role
//   focus 'density'       → system-derived seed anchor (userId), crystallized at PR4
//
// Design note (density crystallization):
//   For focus='density', PR3 emits an AnchorTrace with derivedAs.identity = userId
//   (seed). The actual densest identity is crystallized at PR4 (dispatch-read.ts)
//   after the substrate read. PrA7 (no cached anchor maps between invocations) is
//   satisfied: every call re-derives from scratch.
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentIntent, AnchorTrace } from '../config/present-types'
import type { IdentityRef } from '@/core/types/substrate.types'

export function deriveAnchor(intent: PresentIntent): AnchorTrace {
  const focus = intent.focus

  switch (focus.kind) {
    case 'identity': {
      return {
        source:    'wearer-content',
        derivedAs: { identity: focus.identity },
      }
    }

    case 'identity-role': {
      return {
        source:    'wearer-content',
        derivedAs: { identity: focus.identity, role: focus.role },
      }
    }

    case 'density': {
      const rule = focus.rule ?? 'identity-density'
      // Seed: userId cast to IdentityRef. PR4 crystallizes the true anchor after reading.
      const seed = intent.userId as unknown as IdentityRef
      return {
        source:    'system-derived',
        derivedAs: { identity: seed },
        rule,
      }
    }
  }
}
