// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (R9 — registers)
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/register-map.ts]
//
// THIS FILE TRANSLATES NAMES; MARK-GATE ALONE VALIDATES MARKS, BOTH CROSSINGS.
//
// (sprint-wire-economy R9) The CONTENT register is musical (note · tie · chord · expression)
// on every model/wearer-facing surface: the manual, the emit schema, the rendered
// cells. The ENGINE keeps its own vocabulary (identity · RELATE · QUALIFY · IDENTIFY) —
// mark-gate, mark-types, the store, the spec, the DB are technical and UNTOUCHED. This map
// is the one name-translation seam, one home per direction:
//   - musical → engine at recorder INTAKE (before the gate): the model emits note/tie/chord/
//     expression; toEngineMark rewrites only the `op` name; the payload (peers/coloring/
//     target) passes through unchanged; then mark-gate.isMark validates the engine mark.
//   - engine → musical at render OUTBOUND: engineOpToMusical re-skins the op name for the
//     model-facing cells.
// The map NEVER validates — a name with no musical counterpart passes through untouched and
// the gate decides. mark-gate is not imported here and is not modified.

import type { Mark } from '@/features/F-present/config/mark-types'

// The musical content register, in canonical order.
export const MUSICAL_OPS = ['note', 'tie', 'chord', 'expression'] as const
export type MusicalOp = (typeof MUSICAL_OPS)[number]

// one home per direction — the only place op names cross the register boundary.
const MUSICAL_TO_ENGINE: Record<MusicalOp, Mark['op']> = {
  note:       'identity',
  tie:        'IDENTIFY',
  chord:      'RELATE',
  expression: 'QUALIFY',
}
const ENGINE_TO_MUSICAL: Record<Mark['op'], MusicalOp> = {
  identity: 'note',
  IDENTIFY: 'tie',
  RELATE:   'chord',
  QUALIFY:  'expression',
}

export function isMusicalOp(v: unknown): v is MusicalOp {
  return typeof v === 'string' && (MUSICAL_OPS as readonly string[]).includes(v)
}

// engine → musical (render outbound). Total over the engine ops.
export function engineOpToMusical(op: Mark['op']): MusicalOp {
  return ENGINE_TO_MUSICAL[op]
}

// musical → engine at intake. Translates ONLY the `op` name, and ONLY when it is a known
// musical op; everything else (already-engine ops from internal callers, malformed values,
// the whole payload) passes through untouched for the gate to judge. Never throws, never
// validates — that is mark-gate's job, downstream.
export function toEngineMark(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw
  const op = (raw as { op?: unknown }).op
  if (!isMusicalOp(op)) return raw
  return { ...(raw as object), op: MUSICAL_TO_ENGINE[op] }
}
