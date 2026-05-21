// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/run-gates.ts]
// Sprint 2 — Shot 4; present-rederive — Shot 3 (v2.0 domain re-wire — PrG5 re-derived)
//
// PR7 — PrG1–PrG8 runtime audit harness per Present Standard v2.0 §4.2.
//
// Gate taxonomy (§4.2 ground-class):
//   PrG1 — structural (type-check + reference-resolution)
//   PrG2 — cardinality + type-check
//   PrG3 — enum-membership + cardinality + type-check
//   PrG4 — type-check (userId + scopeRef on all reads and writes)
//   PrG5 — type-check + enum-membership (the one operation's three-dimension
//          parameter space — standpoint, focus.kind, ordering.axis — is valid)
//   PrG6 — enum-membership (primitive ∈ 4 valid; contentClassFilter ∈ 2 valid)
//   PrG7 — declarative-pass (design assertion: no module-level mutable state)
//   PrG8 — declarative-pass at runtime (replay determinism verified at Shot 7 harness)
//
// v2.0 re-derivation of PrG5:
//   The v1.0.1 PrG5 asserted `operation.kind ∈ 5 valid kinds`. Under v2.0 there
//   is no operation.kind and no five-kind enum — the operation set collapsed to
//   one parameterized operation `present(standpoint, focus, ordering)` (rev2
//   derivation Phase four). A gate asserting membership in a five-kind set is the
//   five-operation model surfacing in the gate harness — the same residue class
//   as the removed operationApplied field. PrG5 is re-derived (not dissolved:
//   PrG2's provenance-cardinality checks do not cover dimension validity, and the
//   PR7 harness independently confirms what PR1 validated). v2.0 PrG5 gates the
//   three independent dimensions of the one operation's parameter space.
//
// PrG7 declarative rationale:
//   F-present has no module-level mutable variables; every invocation derives
//   from its input alone (PrA7). The gate passes by construction.
//
// PrG8 declarative rationale:
//   Replay determinism (PrA8) is a property of the full PR1→PR8 pipeline. At
//   runtime this gate passes by design; Shot 7 audit verifies via replay test.
//
// Pure function — no I/O. Deterministic on identical input (PrA8).

import type {
  PresentIntent,
  PresentView,
  ReadPrimitiveTrace,
} from '../config/present-types'

import type { StateChangeId } from '@/core/types/substrate.types'

// ── Gate ID type ──────────────────────────────────────────────────────────────

export type GateId = 'PrG1' | 'PrG2' | 'PrG3' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8'

export type GateResult = {
  id:      GateId
  pass:    boolean
  detail?: string
}

export type GateRunResult = {
  overall: boolean
  gates:   GateResult[]
}

// ── Input shape ───────────────────────────────────────────────────────────────

export type RunGatesInput = {
  intent:               PresentIntent
  view:                 PresentView
  emissionId:           StateChangeId
  emissionChannel:      'internal-derivation'
  emissionContentClass: 'system-introspection'
  readsLog:             ReadPrimitiveTrace[]
  writesLog:            Array<{
    channel:      string
    contentClass: string
    userId:       string
    scope:        string
  }>
}

// ── Valid enum sets ───────────────────────────────────────────────────────────

const VALID_FOCUS_KINDS = new Set([
  'identity',
  'identity-role',
  'density',
])

const VALID_ORDERING_AXES = new Set([
  'time',
  'identity',
  'role',
])

const VALID_READ_PRIMITIVES = new Set([
  'identity-recurrence',
  'role-pattern',
  'adjacency',
  'iterate-axis',
])

const VALID_CONTENT_CLASSES = new Set([
  'wearer-life',
  'system-introspection',
])

// ── Main ──────────────────────────────────────────────────────────────────────

export function runGates(input: RunGatesInput): GateRunResult {
  const gates: GateResult[] = [
    checkPrG1(input),
    checkPrG2(input),
    checkPrG3(input),
    checkPrG4(input),
    checkPrG5(input),
    checkPrG6(input),
    checkPrG7(),
    checkPrG8(),
  ]

  return {
    overall: gates.every(g => g.pass),
    gates,
  }
}

// ── PrG1 — structural shape conformance ───────────────────────────────────────
// view.composition.nodes is array of ViewNode; threads is array of ViewThread;
// focus is non-empty string; perspective.axis ∈ valid set.

function checkPrG1(input: RunGatesInput): GateResult {
  const { view } = input
  const c = view.composition

  if (!Array.isArray(c.nodes)) {
    return fail('PrG1', 'composition.nodes is not an array')
  }
  if (!Array.isArray(c.threads)) {
    return fail('PrG1', 'composition.threads is not an array')
  }
  if (typeof c.focus !== 'string' || c.focus.length === 0) {
    return fail('PrG1', 'composition.focus is missing or empty')
  }
  if (!['time', 'identity', 'role'].includes(c.perspective.axis)) {
    return fail('PrG1', `composition.perspective.axis '${c.perspective.axis}' is not a valid axis`)
  }
  for (let i = 0; i < c.nodes.length; i++) {
    const n = c.nodes[i]
    if (typeof n.identity !== 'string' || n.identity.length === 0) {
      return fail('PrG1', `nodes[${i}].identity missing or empty`)
    }
    if (typeof n.weight !== 'number' || n.weight < 0 || n.weight > 1) {
      return fail('PrG1', `nodes[${i}].weight out of [0,1] range`)
    }
    if (typeof n.sourceCount !== 'number' || n.sourceCount < 0) {
      return fail('PrG1', `nodes[${i}].sourceCount is not a non-negative number`)
    }
  }
  for (let i = 0; i < c.threads.length; i++) {
    const t = c.threads[i]
    if (typeof t.source !== 'string' || t.source.length === 0) {
      return fail('PrG1', `threads[${i}].source missing or empty`)
    }
    if (typeof t.target !== 'string' || t.target.length === 0) {
      return fail('PrG1', `threads[${i}].target missing or empty`)
    }
    if (typeof t.relationType !== 'string' || t.relationType.length === 0) {
      return fail('PrG1', `threads[${i}].relationType missing or empty`)
    }
    if (typeof t.thickness !== 'number' || t.thickness < 0 || t.thickness > 1) {
      return fail('PrG1', `threads[${i}].thickness out of [0,1] range`)
    }
    if (!Array.isArray(t.sourceStateChangeIds)) {
      return fail('PrG1', `threads[${i}].sourceStateChangeIds is not an array`)
    }
  }

  return pass('PrG1')
}

// ── PrG2 — cardinality ────────────────────────────────────────────────────────
// sourceStateChangeIds.length ≥ distinct StateChangeId count from composed nodes+threads.
// readPrimitivesUsed.length ≥ 1.

function checkPrG2(input: RunGatesInput): GateResult {
  const { view } = input

  if (view.provenance.readPrimitivesUsed.length < 1) {
    return fail('PrG2', 'provenance.readPrimitivesUsed is empty — at least one primitive read required')
  }

  // Collect all StateChangeIds referenced in thread provenance
  const composedIds = new Set<string>()
  for (const thread of view.composition.threads) {
    for (const id of thread.sourceStateChangeIds) {
      composedIds.add(id as string)
    }
  }

  if (view.provenance.sourceStateChangeIds.length < composedIds.size) {
    return fail(
      'PrG2',
      `provenance.sourceStateChangeIds.length (${view.provenance.sourceStateChangeIds.length}) ` +
      `is less than distinct composed StateChangeId count (${composedIds.size})`,
    )
  }

  return pass('PrG2')
}

// ── PrG3 — emission channel + contentClass + no-modification ─────────────────
// All writesLog entries: channel='internal-derivation', contentClass='system-introspection'.
// emissionChannel and emissionContentClass literals confirmed.
// "Zero modifications to existing rows" is structural (writeStateChange is append-only
// per LMA4; the substrate has no update path). Verified declaratively.

function checkPrG3(input: RunGatesInput): GateResult {
  if (input.emissionChannel !== 'internal-derivation') {
    return fail('PrG3', `emissionChannel is '${input.emissionChannel}'; expected 'internal-derivation'`)
  }
  if (input.emissionContentClass !== 'system-introspection') {
    return fail('PrG3', `emissionContentClass is '${input.emissionContentClass}'; expected 'system-introspection'`)
  }

  for (let i = 0; i < input.writesLog.length; i++) {
    const w = input.writesLog[i]
    if (w.channel !== 'internal-derivation') {
      return fail('PrG3', `writesLog[${i}].channel is '${w.channel}'; expected 'internal-derivation'`)
    }
    if (w.contentClass !== 'system-introspection') {
      return fail('PrG3', `writesLog[${i}].contentClass is '${w.contentClass}'; expected 'system-introspection'`)
    }
  }

  // No-modification assertion: substrate is append-only (LMA4); writeStateChange has no update path.
  // Declarative pass — verified by substrate design, not per-call observation.

  return pass('PrG3')
}

// ── PrG4 — userId + scopeRef on all reads and writes ─────────────────────────
// Runtime check: every readsLog entry carries parameters.userId === intent.userId
// and parameters.scope === intent.scopeRef (Shot 4b: userId added to all 5
// ReadPrimitiveTrace parameters records at dispatch-read.ts invocation sites).
// Every writesLog entry carries userId + scope directly.

function checkPrG4(input: RunGatesInput): GateResult {
  for (let i = 0; i < input.readsLog.length; i++) {
    const r = input.readsLog[i]
    const p = r.parameters

    if (p['userId'] !== input.intent.userId) {
      return fail(
        'PrG4',
        `readsLog[${i}].parameters.userId ('${p['userId']}') does not match intent.userId ('${input.intent.userId}')`,
      )
    }
    if (!p['scope'] || typeof p['scope'] !== 'string') {
      return fail('PrG4', `readsLog[${i}].parameters.scope missing or not a string`)
    }
    if (p['scope'] !== (input.intent.scopeRef as string)) {
      return fail(
        'PrG4',
        `readsLog[${i}].parameters.scope ('${p['scope']}') does not match intent.scopeRef ('${input.intent.scopeRef}')`,
      )
    }
  }

  for (let i = 0; i < input.writesLog.length; i++) {
    const w = input.writesLog[i]
    if (!w.userId || w.userId.length === 0) {
      return fail('PrG4', `writesLog[${i}].userId missing or empty`)
    }
    if (!w.scope || w.scope.length === 0) {
      return fail('PrG4', `writesLog[${i}].scope missing or empty`)
    }
  }

  return pass('PrG4')
}

// ── PrG5 — the one operation's three-dimension parameter space is valid ──────
// v2.0 re-derivation: gates the three independent dimensions of PresentIntent,
// read off view.derivedFromIntent —
//   D1 standpoint  — PositionRef | null
//   D2 focus.kind  — ∈ {identity, identity-role, density}
//   D3 ordering.axis — ∈ {time, identity, role}
// (Replaces the v1.0.1 `operation.kind ∈ 5 valid kinds` check — there is no
// operation.kind under v2.0; the operation set collapsed to one.)

function checkPrG5(input: RunGatesInput): GateResult {
  const intent = input.view.derivedFromIntent

  // D1 — standpoint is PositionRef | null
  if (intent.standpoint !== null) {
    if (typeof intent.standpoint !== 'number' || !Number.isInteger(intent.standpoint) || intent.standpoint < 0) {
      return fail('PrG5', `standpoint '${intent.standpoint}' is not null or a non-negative integer PositionRef`)
    }
  }

  // D2 — focus.kind ∈ valid focus kinds
  if (!intent.focus || !VALID_FOCUS_KINDS.has(intent.focus.kind)) {
    return fail('PrG5', `focus.kind '${intent.focus?.kind}' is not in the valid 3-kind FocusSelector set`)
  }

  // D3 — ordering.axis ∈ valid ordering axes
  if (!intent.ordering || !VALID_ORDERING_AXES.has(intent.ordering.axis)) {
    return fail('PrG5', `ordering.axis '${intent.ordering?.axis}' is not in the valid 3-axis OrderingSelector set`)
  }

  return pass('PrG5')
}

// ── PrG6 — read primitives ∈ 4 valid; contentClassFilter ∈ 2 valid ───────────

function checkPrG6(input: RunGatesInput): GateResult {
  for (let i = 0; i < input.readsLog.length; i++) {
    const r = input.readsLog[i]
    if (!VALID_READ_PRIMITIVES.has(r.primitive)) {
      return fail('PrG6', `readsLog[${i}].primitive '${r.primitive}' is not in the valid 4-primitive set`)
    }
    if (r.contentClassFilter !== undefined && !VALID_CONTENT_CLASSES.has(r.contentClassFilter)) {
      return fail(
        'PrG6',
        `readsLog[${i}].contentClassFilter '${r.contentClassFilter}' is not in the valid 2-class set`,
      )
    }
  }
  return pass('PrG6')
}

// ── PrG7 — declarative: no module-level mutable state ────────────────────────
// F-present holds no module-level mutable variables. All functions are pure or
// async-pure (derive from input; no heap state persists across invocations).
// PrA7 is satisfied by design. This gate passes by construction on every call.
// Shot 7 audit independently confirms via static inspection of module exports.

function checkPrG7(): GateResult {
  return pass('PrG7')
}

// ── PrG8 — declarative: replay determinism (PrA8) ────────────────────────────
// Identical PresentIntent + unchanged substrate → equivalent PresentView.
// This is a full-pipeline property (PR1→PR8), not observable from a single invocation's
// output alone. At runtime this gate passes by construction (compose-view is deterministic;
// no non-determinism introduced at any PR step). Shot 7 audit verifies via two-invocation
// replay test against a fixed substrate snapshot.

function checkPrG8(): GateResult {
  return pass('PrG8')
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pass(id: GateId): GateResult {
  return { id, pass: true }
}

function fail(id: GateId, detail: string): GateResult {
  return { id, pass: false, detail }
}
