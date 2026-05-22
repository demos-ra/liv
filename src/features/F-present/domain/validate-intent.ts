// @liv-standard v1.5.2
// @present-standard v2.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/validate-intent.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3 (v2.0 domain re-wire)
//
// PR1 — J-intent-binding mechanical check per Present Standard v2.0 §7.1.
//
// v2.0 re-derivation: the v1.0.1 PR1 validated a five-arm operation/parameter
// pair (criteria C1–C6 over WearerOperation × OperationParameter). Under v2.0
// there is one operation; the wearer-callable surface is the three independent
// dimensions of PresentIntent. PR1 validates the three dimensions:
//   D1 standpoint — PositionRef | null (no further constraint; null = live present)
//   D2 focus      — FocusSelector: well-formed 3-arm discriminated union
//   D3 ordering   — OrderingSelector: axis ∈ {weight,temporal,categorical,relational}, direction optional
//
// Pure function — no I/O, no cross-slice calls.

import type { PresentIntent, FocusSelector } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

const VALID_FOCUS_KINDS: ReadonlySet<FocusSelector['kind']> = new Set([
  'identity',
  'identity-role',
  'density',
])

const VALID_ORDERING_AXES: ReadonlySet<string> = new Set([
  'weight',
  'temporal',
  'categorical',
  'relational',
])

export function validateIntent(intent: PresentIntent): PresentResult<PresentIntent> {
  // C1: standpoint is PositionRef | null.
  //   null = the live present (head). non-null = a Reading-A snapshot ceiling.
  //   A PositionRef is a monotonic integer; reject non-integer / negative.
  if (intent.standpoint !== null) {
    if (typeof intent.standpoint !== 'number' || !Number.isInteger(intent.standpoint) || intent.standpoint < 0) {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C1',
          message:         `standpoint must be null or a non-negative integer PositionRef; got '${intent.standpoint}'`,
        },
      }
    }
  }

  // C2: focus.kind ∈ {identity, identity-role, density}.
  if (!intent.focus || !VALID_FOCUS_KINDS.has(intent.focus.kind)) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C2',
        message:         `focus.kind '${intent.focus?.kind}' is not a valid FocusSelector kind`,
      },
    }
  }

  // C3: focus arm-specific field checks.
  const c3Error = validateFocusArm(intent.focus)
  if (c3Error) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C3',
        message:         c3Error,
      },
    }
  }

  // C4: ordering.axis ∈ {weight, temporal, categorical, relational}.
  if (!intent.ordering || !VALID_ORDERING_AXES.has(intent.ordering.axis)) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C4',
        message:         `ordering.axis '${intent.ordering?.axis}' is not a valid ordering axis`,
      },
    }
  }

  // C5: ordering.direction, if present, ∈ {forward, backward}.
  if (
    intent.ordering.direction !== undefined &&
    intent.ordering.direction !== 'forward' &&
    intent.ordering.direction !== 'backward'
  ) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C5',
        message:         `ordering.direction '${intent.ordering.direction}' must be 'forward' or 'backward' when present`,
      },
    }
  }

  // C6: density focus rule, if present, ∈ {identity-density, position-density}.
  if (intent.focus.kind === 'density') {
    const rule = intent.focus.rule
    if (rule !== undefined && rule !== 'identity-density' && rule !== 'position-density') {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C6',
          message:         `focus.rule '${rule}' must be 'identity-density' or 'position-density' when present`,
        },
      }
    }
  }

  return { ok: true, data: intent }
}

// ── C3 arm-specific field checks ──────────────────────────────────────────────

function validateFocusArm(focus: FocusSelector): string | null {
  switch (focus.kind) {
    case 'identity': {
      if (!focus.identity || typeof focus.identity !== 'string') {
        return `focus.identity is required for focus kind 'identity'`
      }
      return null
    }
    case 'identity-role': {
      if (!focus.identity || typeof focus.identity !== 'string') {
        return `focus.identity is required for focus kind 'identity-role'`
      }
      if (!focus.role || typeof focus.role !== 'string') {
        return `focus.role is required for focus kind 'identity-role'`
      }
      return null
    }
    case 'density':
      // no required fields beyond kind; rule optional (C6 checks membership)
      return null
  }
}
