// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/authorize-intent.ts]
// Sprint 2 — Shot 2
//
// PR2 — PS handshake mechanics per Present Standard v1.0.1 §3.7 + PrA4.
//
// PrA4: F-present applies mechanics, does NOT authorize. PS PA-IR3 owns enforcement.
// The intent arriving at F-present already carries PS-stamped userId + scopeRef
// (enforced at perimeter src/proxy.ts). PR2 confirms both present and non-empty.
// F-present does NOT call into PS at runtime.
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentReadIntent } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export function authorizeIntent(intent: PresentReadIntent): PresentResult<PresentReadIntent> {
  if (!intent.userId || intent.userId.length === 0) {
    return {
      ok: false,
      error: {
        code:    'PRESENT_AUTH_REJECTED',
        message: 'missing or empty userId on intent — PS handshake incomplete',
      },
    }
  }

  if (!intent.scopeRef || (intent.scopeRef as string).length === 0) {
    return {
      ok: false,
      error: {
        code:    'PRESENT_AUTH_REJECTED',
        message: 'missing or empty scopeRef on intent — PS handshake incomplete',
      },
    }
  }

  return { ok: true, data: intent }
}
