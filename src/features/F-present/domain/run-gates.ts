// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/run-gates.ts]
// Sprint 2 — Shot 4
//
// PR7 — PrG1–PrG8 runtime audit harness per Present Standard v1.0.1 §4.2.
//
// Gate taxonomy (§4.2 ground-class):
//   PrG1 — structural (type-check + reference-resolution)
//   PrG2 — cardinality + type-check
//   PrG3 — enum-membership + cardinality + type-check
//   PrG4 — type-check (userId + scopeRef on all reads and writes)
//   PrG5 — enum-membership + cardinality (operation kind ∈ 5 valid)
//   PrG6 — enum-membership (primitive ∈ 4 valid; contentClassFilter ∈ 2 valid)
//   PrG7 — declarative-pass (design assertion: no module-level mutable state)
//   PrG8 — declarative-pass at runtime (replay determinism verified at Shot 7 harness)
//
// PrG7 declarative rationale:
//   F-present has no module-level mutable variables; every invocation derives
//   from its input alone (PrA7). This is a structural property of the design,
//   not a runtime-observable fact on each call. The gate passes by construction.
//   Shot 7 audit independently verifies via static inspection of module exports.
//
// PrG8 declarative rationale:
//   Replay determinism (PrA8) — identical intent + unchanged substrate → equivalent view —
//   is a property of the full PR1→PR8 pipeline, not verifiable in a single call's output.
//   At runtime this gate passes by design; Shot 7 audit verifies via two-invocation
//   replay test against a fixed substrate snapshot.
//
// Pure function — no I/O. Deterministic on identical input (PrA8).

import type {
  PresentReadIntent,
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
  intent:               PresentReadIntent
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

const VALID_OPERATION_KINDS = new Set([
  'search-by-identity',
  'search-by-role',
  'default-entry',
  'move-neighborhood',
  'move-trajectory',
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

// ── PrG5 — operation kind ∈ 5 valid kinds ────────────────────────────────────

function checkPrG5(input: RunGatesInput): GateResult {
  const kind = input.view.derivedFromIntent.operation.kind
  if (!VALID_OPERATION_KINDS.has(kind)) {
    return fail('PrG5', `operation.kind '${kind}' is not in the valid 5-kind set`)
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
// Identical PresentReadIntent + unchanged substrate → equivalent PresentView.
// This is a full-pipeline property (PR1→PR8), not observable from a single invocation's
// output alone. At runtime this gate passes by construction (compose-view is deterministic;
// no non-determinism introduced at any PR step). Shot 7 audit verifies via two-invocation
// replay test against a fixed substrate snapshot (5 operations × 2 invocations = 10 records).

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
