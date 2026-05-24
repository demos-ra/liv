// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/run-gates.ts]
// Sprint 2 — Shot 4; present-rederive — Shot 3 (v2.0 domain re-wire);
//   sprint-b3-present-build (v2.0 → v3.0: PrG5 + PrG1 ordering enum);
//   b3-v4-reconciliation (v3.0 → v4.0: non-emitter — PrG3 deleted, PrG4/PrG7 re-derived);
//   sprint-b3-present-v5 (v5.0: PrG5 split-subject; structure-carrying PrG1);
//   sprint-b3-present-v6 — Shots 1/5/6/7 (PrG1 stack-carrying + extent + window;
//     PrG2 authorship; PrG5 three-control envelope)
//
// PR7 — PrG1,2,4,5,6,7,8 runtime audit harness per Present Standard v6.0 §4.2.
//
// v6.0 re-derivation:
//   PrG1 ([R4]/[R19]/[R20]): the composition carries the tree of stacks. PrG1
//     checks that every ViewNode and every ViewEdge carries a `stack`
//     (StackEntry[]); that composition.extent = 'granularity-cutoff'; that
//     composition.root and composition.camera are well-formed; and that
//     view.window is a well-formed WindowRef.
//   PrG2 ([R14]): PrG2 adds the authorship check — every StackEntry, on every
//     node-stack and every edge-stack, carries authorship ∈ {'user','llm'}.
//   PrG5 ([R9]): re-stated against the three-control envelope — camera
//     (CameraSetting), temporal (TemporalSetting), standpoint. The v5.0
//     zoomAnchor check is the camera 'set' arm.
//
// Gate count holds at 7 — no gate deleted, none added; PrG1, PrG2, PrG5
// re-derived in content (§3.2, §4.2).
//
// Pure function — no I/O. Deterministic on identical input (PrA8).

import type {
  PresentIntent,
  PresentView,
  ReadPrimitiveTrace,
} from '../config/present-types'

// ── Gate ID type ──────────────────────────────────────────────────────────────

export type GateId = 'PrG1' | 'PrG2' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8'

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
// F-present is a non-emitter — the harness audits the read side only.

export type RunGatesInput = {
  intent:   PresentIntent
  view:     PresentView
  readsLog: ReadPrimitiveTrace[]
}

// ── Valid enum sets ───────────────────────────────────────────────────────────

const VALID_READ_PRIMITIVES = new Set([
  'identity-recurrence',
  'role-pattern',
  'adjacency',
  'iterate-axis',
])

// Read-side contentClass filter set — F-present reads on the class emitters
// declared (it does not itself declare a class; non-emitter, [R4]).
const VALID_CONTENT_CLASSES = new Set([
  'wearer-life',
  'system-introspection',
])

// ── Main ──────────────────────────────────────────────────────────────────────

export function runGates(input: RunGatesInput): GateRunResult {
  const gates: GateResult[] = [
    checkPrG1(input),
    checkPrG2(input),
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

// ── PrG1 — tree-of-stacks composition conformance ([R4]/[R19]/[R20]) ──────────
// v6.0: every ViewNode and every ViewEdge carries a `stack` (StackEntry[]);
// composition carries root, camera, extent='granularity-cutoff'; the view
// carries a WindowRef ([R12]).

function checkPrG1(input: RunGatesInput): GateResult {
  const { view } = input
  const c = view.composition

  if (!Array.isArray(c.nodes)) {
    return fail('PrG1', 'composition.nodes is not an array')
  }
  if (!Array.isArray(c.edges)) {
    return fail('PrG1', 'composition.edges is not an array ([R19] — the projection must carry edges)')
  }
  if (typeof c.root !== 'string' || c.root.length === 0) {
    return fail('PrG1', 'composition.root is missing or empty')
  }
  if (typeof c.camera !== 'string' || c.camera.length === 0) {
    return fail('PrG1', 'composition.camera is missing or empty')
  }
  if (c.extent !== 'granularity-cutoff') {
    return fail('PrG1', `composition.extent must be 'granularity-cutoff' ([R20]); got '${String(c.extent)}'`)
  }
  if (typeof view.projectedFromFrame !== 'string' || view.projectedFromFrame.length === 0) {
    return fail('PrG1', 'view.projectedFromFrame is not a well-formed FrameIdRef')
  }
  if (typeof view.window !== 'string' || view.window.length === 0) {
    return fail('PrG1', 'view.window is not a well-formed WindowRef ([R12] — every action opens a window)')
  }
  for (let i = 0; i < c.nodes.length; i++) {
    const n = c.nodes[i]
    if (typeof n.identity !== 'string' || n.identity.length === 0) {
      return fail('PrG1', `nodes[${i}].identity missing or empty`)
    }
    if (typeof n.weight !== 'number' || n.weight < 0 || n.weight > 1) {
      return fail('PrG1', `nodes[${i}].weight out of [0,1] range`)
    }
    if (!Array.isArray(n.stack)) {
      return fail('PrG1', `nodes[${i}].stack is not an array ([R4] — a node IS a stack)`)
    }
    if (!Array.isArray(n.substituteValues)) {
      return fail('PrG1', `nodes[${i}].substituteValues is not an array ([R19])`)
    }
    if (!Array.isArray(n.children)) {
      return fail('PrG1', `nodes[${i}].children is not an array ([R19])`)
    }
    if (n.parent !== null && typeof n.parent !== 'string') {
      return fail('PrG1', `nodes[${i}].parent is neither null nor a ViewNodeRef ([R19])`)
    }
    if (typeof n.sourceCount !== 'number' || n.sourceCount < 0) {
      return fail('PrG1', `nodes[${i}].sourceCount is not a non-negative number`)
    }
  }
  for (let i = 0; i < c.edges.length; i++) {
    const e = c.edges[i]
    if (typeof e.parent !== 'string' || e.parent.length === 0) {
      return fail('PrG1', `edges[${i}].parent missing or empty`)
    }
    if (typeof e.child !== 'string' || e.child.length === 0) {
      return fail('PrG1', `edges[${i}].child missing or empty`)
    }
    if (typeof e.relationType !== 'string' || e.relationType.length === 0) {
      return fail('PrG1', `edges[${i}].relationType missing or empty`)
    }
    if (!Array.isArray(e.stack)) {
      return fail('PrG1', `edges[${i}].stack is not an array ([R4]/[R5] — an edge IS a stack)`)
    }
    if (typeof e.thickness !== 'number' || e.thickness < 0 || e.thickness > 1) {
      return fail('PrG1', `edges[${i}].thickness out of [0,1] range`)
    }
  }

  return pass('PrG1')
}

// ── PrG2 — provenance cardinality + authorship ([R14]) ───────────────────────
// v6.0: PrG2 keeps the read-cardinality check and adds the authorship check —
// every StackEntry, on every node-stack and every edge-stack, carries
// authorship ∈ {'user','llm'} ([R14] — the present surfaces whose state-change
// each entry is).

function checkPrG2(input: RunGatesInput): GateResult {
  const { view } = input

  if (view.provenance.readPrimitivesUsed.length < 1) {
    return fail('PrG2', 'provenance.readPrimitivesUsed is empty — at least one primitive read required')
  }

  // Authorship — every node-stack entry.
  for (let i = 0; i < view.composition.nodes.length; i++) {
    const n = view.composition.nodes[i]
    for (let j = 0; j < n.stack.length; j++) {
      const a = n.stack[j].authorship
      if (a !== 'user' && a !== 'llm') {
        return fail('PrG2', `nodes[${i}].stack[${j}].authorship '${String(a)}' is not 'user' | 'llm' ([R14])`)
      }
    }
  }
  // Authorship — every edge-stack entry (symmetric carrier, [R5]).
  for (let i = 0; i < view.composition.edges.length; i++) {
    const e = view.composition.edges[i]
    for (let j = 0; j < e.stack.length; j++) {
      const a = e.stack[j].authorship
      if (a !== 'user' && a !== 'llm') {
        return fail('PrG2', `edges[${i}].stack[${j}].authorship '${String(a)}' is not 'user' | 'llm' ([R14])`)
      }
    }
  }

  // Cardinality — provenance enumerates at least the distinct StateChangeIds
  // the composed stacks reference.
  const composedIds = new Set<string>()
  for (const n of view.composition.nodes) {
    for (const entry of n.stack) composedIds.add(entry.stateChangeId as string)
  }
  for (const e of view.composition.edges) {
    for (const entry of e.stack) composedIds.add(entry.stateChangeId as string)
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

// ── PrG4 — userId + scopeRef on all reads (read-side; v5.0) ───────────────────
// F-present is a non-emitter. PrG4 gates the read carry; the held snapshot and
// the archive entry are keyed (userId, scopeRef) at the exec tier (PrA4).

function checkPrG4(input: RunGatesInput): GateResult {
  for (let i = 0; i < input.readsLog.length; i++) {
    const r = input.readsLog[i]
    const p = r.parameters

    // iterate-axis (the latest-state-change read, [R6]) carries no userId/scope
    // parameter — it reads the append head; the userId/scope carry is asserted
    // on the thread reads. Skip the carry check for iterate-axis.
    if (r.primitive === 'iterate-axis') continue

    if (p['userId'] !== input.intent.userId) {
      return fail(
        'PrG4',
        `readsLog[${i}].parameters.userId ('${String(p['userId'])}') does not match intent.userId ('${String(input.intent.userId)}')`,
      )
    }
    if (!p['scope'] || typeof p['scope'] !== 'string') {
      return fail('PrG4', `readsLog[${i}].parameters.scope missing or not a string`)
    }
    if (p['scope'] !== (input.intent.scopeRef as string)) {
      return fail(
        'PrG4',
        `readsLog[${i}].parameters.scope ('${String(p['scope'])}') does not match intent.scopeRef ('${String(input.intent.scopeRef)}')`,
      )
    }
  }

  return pass('PrG4')
}

// ── PrG5 — intent parameter space valid: the three controls ([R9]) ──────────
// v6.0: re-stated against the three-control envelope — camera (CameraSetting),
// temporal (TemporalSetting), standpoint. The v5.0 zoomAnchor check survives as
// the camera 'set' arm. The lens is not gated here — it is stored dial state,
// not a PresentIntent field.

function checkPrG5(input: RunGatesInput): GateResult {
  const intent = input.view.derivedFromIntent

  // standpoint — PositionRef | null
  if (intent.standpoint !== null) {
    if (typeof intent.standpoint !== 'number' || !Number.isInteger(intent.standpoint) || intent.standpoint < 0) {
      return fail('PrG5', `standpoint '${String(intent.standpoint)}' is not null or a non-negative integer PositionRef`)
    }
  }

  // camera — a well-formed CameraSetting ([R9]). Inspected as `unknown`: the
  // static type asserts the union, but PrG5 is the runtime gate — the boundary
  // may have admitted a malformed value, so the shape is checked at runtime.
  const camera = intent.camera as unknown as { mode?: unknown; anchor?: unknown }
  if (camera === null || typeof camera !== 'object' || typeof camera.mode !== 'string') {
    return fail('PrG5', 'camera is not a CameraSetting')
  }
  if (camera.mode === 'set') {
    if (typeof camera.anchor !== 'string' || (camera.anchor as string).length === 0) {
      return fail('PrG5', "camera.mode 'set' requires a well-formed IdentityRef anchor")
    }
  } else if (camera.mode !== 'derived') {
    return fail('PrG5', `camera.mode '${String(camera.mode)}' is not 'derived' | 'set'`)
  }

  // temporal — a well-formed TemporalSetting ([R10]/[R11]). Inspected as
  // `unknown` for the same reason — PrG5 is the runtime gate.
  const temporal = intent.temporal as unknown as { depth?: unknown }
  if (temporal === null || typeof temporal !== 'object' || typeof temporal.depth !== 'string') {
    return fail('PrG5', 'temporal is not a TemporalSetting')
  }
  if (temporal.depth !== 'surface' && temporal.depth !== 'span') {
    return fail('PrG5', `temporal.depth '${String(temporal.depth)}' is not 'surface' | 'span'`)
  }

  return pass('PrG5')
}

// ── PrG6 — read primitives ∈ 4 valid; contentClassFilter ∈ 2 valid ───────────
// v5.0: the v4.0 asOfPosition clause is removed — scrub-back is an archive
// lookup ([R14]), F-present passes no asOfPosition on any read.

function checkPrG6(input: RunGatesInput): GateResult {
  for (let i = 0; i < input.readsLog.length; i++) {
    const r = input.readsLog[i]
    if (!VALID_READ_PRIMITIVES.has(r.primitive)) {
      return fail('PrG6', `readsLog[${i}].primitive '${r.primitive}' is not in the valid 4-primitive set`)
    }
    if (r.contentClassFilter !== undefined && !VALID_CONTENT_CLASSES.has(r.contentClassFilter)) {
      return fail(
        'PrG6',
        `readsLog[${i}].contentClassFilter '${String(r.contentClassFilter)}' is not in the valid 2-class set`,
      )
    }
  }
  return pass('PrG6')
}

// ── PrG7 — declarative: held-present + lens + archive + windows discipline ───
// F-present's retained state is exactly: the live PresentFrame (a tree of
// stacks), the GranularityDial (lens) position, the per-user present archive,
// and the accumulating Window set — all keyed (userId, scopeRef), all in
// F-present's own stores (exec tier / LIV database). F-present makes ZERO
// substrate writes — the archive write targets F-present's own LIV-database
// store, never the substrate ([R1]/[R15]). Passes by construction
// (present-execution.ts holds exactly these stores; no writeStateChange call
// site exists in the slice). Build-tier audit confirms via static inspection.

function checkPrG7(): GateResult {
  return pass('PrG7')
}

// ── PrG8 — declarative: replay determinism (PrA8) ────────────────────────────
// Identical PresentIntent + unchanged substrate + identical lens-dial position
// → equivalent PresentView; a scrub-back with identical standpoint → the
// identical archived present. A full-pipeline property; passes by construction.

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
