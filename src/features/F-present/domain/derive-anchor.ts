// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/derive-anchor.ts]
// Sprint 2 — Shot 2
//
// PR3 — Anchor derivation per Present Standard v1.0.1 §3.7.
// Dispatches on operation.kind → AnchorTrace.
//
// Design note (default-entry crystallization):
//   PR3 emits an AnchorTrace with derivedAs.identity = userId (seed).
//   The actual densest identity is crystallized at PR4 (dispatch-read.ts) after
//   the substrate read. PR4 returns a crystallizedAnchor that either confirms the
//   seed or promotes the densest result. This is Shape A (see dispatch-read.ts).
//   PR3 does NOT perform any read — it only emits the trace shell.
//   PrA7 (no cached anchor maps between invocations) is satisfied: every call
//   re-derives from scratch; no heap state persists across invocations.
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentReadIntent, AnchorTrace, OperationParameter } from '../config/present-types'
import type { IdentityRef, RoleRef } from '@/core/types/substrate.types'

export function deriveAnchor(intent: PresentReadIntent): AnchorTrace {
  const op    = intent.operation
  const param = intent.parameter

  switch (op.kind) {
    case 'search-by-identity': {
      const p = param as Extract<OperationParameter, { kind: 'search-by-identity' }>
      return {
        source:    'wearer-content',
        derivedAs: { identity: p.identity },
      }
    }

    case 'search-by-role': {
      const p = param as Extract<OperationParameter, { kind: 'search-by-role' }>
      return {
        source:    'wearer-content',
        derivedAs: { identity: p.identity, role: p.role },
      }
    }

    case 'move-neighborhood':
    case 'move-trajectory': {
      // C4 validated upstream (currentPosition non-null for move-*).
      return {
        source:    'current-position',
        derivedAs: { position: intent.currentPosition! },
      }
    }

    case 'default-entry': {
      const p    = param as Extract<OperationParameter, { kind: 'default-entry' }>
      const rule = p.anchorRule ?? 'identity-density'
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
