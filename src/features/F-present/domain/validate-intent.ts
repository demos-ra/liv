// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/validate-intent.ts]
// Sprint 2 — Shot 2
//
// PR1 — J-operation-binding mechanical check per Present Standard v1.0.1 §7.1.
// Six criteria C1–C6. Returns on first failure with failedCriterion populated.
// Pure function — no I/O, no cross-slice calls.

import type { PresentReadIntent, WearerOperation, OperationParameter } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

const VALID_OPERATION_KINDS: ReadonlySet<WearerOperation['kind']> = new Set([
  'search-by-identity',
  'search-by-role',
  'default-entry',
  'move-neighborhood',
  'move-trajectory',
])

export function validateIntent(intent: PresentReadIntent): PresentResult<PresentReadIntent> {
  // C1: operation.kind ∈ {5 valid kinds}
  if (!VALID_OPERATION_KINDS.has(intent.operation.kind)) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C1',
        message:         `operation.kind '${intent.operation.kind}' is not a valid WearerOperation kind`,
      },
    }
  }

  // C2: parameter.kind === operation.kind (discriminated union alignment)
  if (intent.parameter.kind !== intent.operation.kind) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C2',
        message:         `parameter.kind '${intent.parameter.kind}' does not match operation.kind '${intent.operation.kind}'`,
      },
    }
  }

  // C3: parameter conforms to OperationParameter discriminated-union arm per kind.
  //   TypeScript's type system narrows at compile time; runtime checks cover
  //   required fields missing from the arm (e.g., identity absent on search-by-identity).
  const c3Error = validateParameterArm(intent.operation.kind, intent.parameter)
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

  // C4: currentPosition cardinality —
  //   move-*: non-null required
  //   default-entry: null required
  //   search-*: null permitted (no enforcement)
  const opKind = intent.operation.kind
  if ((opKind === 'move-neighborhood' || opKind === 'move-trajectory') && intent.currentPosition === null) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C4',
        message:         `currentPosition must be non-null for operation '${opKind}'`,
      },
    }
  }
  if (opKind === 'default-entry' && intent.currentPosition !== null) {
    return {
      ok: false,
      error: {
        code:            'PRESENT_INTENT_INVALID',
        failedCriterion: 'C4',
        message:         `currentPosition must be null for operation 'default-entry'`,
      },
    }
  }

  // C5: for move-*, parameter.relationFilter if present must be a non-empty string (IdentityRef)
  if (opKind === 'move-neighborhood' || opKind === 'move-trajectory') {
    const param = intent.parameter as Extract<OperationParameter, { kind: 'move-neighborhood' }> | Extract<OperationParameter, { kind: 'move-trajectory' }>
    if ('relationFilter' in param && param.relationFilter !== undefined && typeof param.relationFilter !== 'string') {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C5',
          message:         `parameter.relationFilter must be an IdentityRef string when present`,
        },
      }
    }
    if ('relationFilter' in param && param.relationFilter !== undefined && (param.relationFilter as string).length === 0) {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C5',
          message:         `parameter.relationFilter must be non-empty when present`,
        },
      }
    }
  }

  // C6: for default-entry, parameter.anchorRule if present ∈ {'identity-density', 'position-density'}
  if (opKind === 'default-entry') {
    const param = intent.parameter as Extract<OperationParameter, { kind: 'default-entry' }>
    if (
      param.anchorRule !== undefined &&
      param.anchorRule !== 'identity-density' &&
      param.anchorRule !== 'position-density'
    ) {
      return {
        ok: false,
        error: {
          code:            'PRESENT_INTENT_INVALID',
          failedCriterion: 'C6',
          message:         `parameter.anchorRule '${param.anchorRule}' must be 'identity-density' or 'position-density'`,
        },
      }
    }
  }

  return { ok: true, data: intent }
}

// ── C3 arm-specific field checks ──────────────────────────────────────────────

function validateParameterArm(kind: WearerOperation['kind'], param: OperationParameter): string | null {
  switch (kind) {
    case 'search-by-identity': {
      const p = param as Extract<OperationParameter, { kind: 'search-by-identity' }>
      if (!p.identity || typeof p.identity !== 'string') return `parameter.identity is required for 'search-by-identity'`
      return null
    }
    case 'search-by-role': {
      const p = param as Extract<OperationParameter, { kind: 'search-by-role' }>
      if (!p.identity || typeof p.identity !== 'string') return `parameter.identity is required for 'search-by-role'`
      if (!p.role    || typeof p.role    !== 'string') return `parameter.role is required for 'search-by-role'`
      return null
    }
    case 'default-entry':
      // no required fields beyond kind; anchorRule optional (C6 checks membership)
      return null
    case 'move-neighborhood': {
      const p = param as Extract<OperationParameter, { kind: 'move-neighborhood' }>
      if (typeof p.window !== 'number' || p.window <= 0 || !Number.isInteger(p.window)) {
        return `parameter.window must be a positive integer for 'move-neighborhood'`
      }
      return null
    }
    case 'move-trajectory': {
      const p = param as Extract<OperationParameter, { kind: 'move-trajectory' }>
      if (p.direction !== 'forward' && p.direction !== 'backward') {
        return `parameter.direction must be 'forward' or 'backward' for 'move-trajectory'`
      }
      if (typeof p.count !== 'number' || p.count <= 0 || !Number.isInteger(p.count)) {
        return `parameter.count must be a positive integer for 'move-trajectory'`
      }
      return null
    }
  }
}
