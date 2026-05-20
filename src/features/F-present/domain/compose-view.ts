// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/compose-view.ts]
// Sprint 2 — Shot 3
//
// PR5 — Composition + Option C weighting + perspective + focus.
// Present Standard v1.0.1 §3.7 PR5 + §2.1 ViewNode/ViewThread/PerspectiveDeclaration.
//
// Option C weights (spec §5 non-negotiable):
//   w_recur  = 0.4   (identity recurrence across records)
//   w_density = 0.2  (co-occurrence density with other identities in record)
//   w_adj    = 0.4   (adjacency edge count from ViewThread materialization)
//
// Determinism (PrA8):
//   - No Math.random, no Date.now (timestamps come from input records)
//   - Stable sort: primary descending score; tiebreak lexicographic on identity string
//   - Map used (not Object) where key-iteration order matters
//   - All intermediate sorts are stable (Array.prototype.sort is stable ES2019+)
//
// Pure function — zero I/O. emittedAt is supplied by the service caller, not here.

import type {
  StateChangeRecord,
  IdentityRef,
  Relation,
} from '@/core/types/substrate.types'

import type {
  PresentView,
  ViewNode,
  ViewThread,
  PerspectiveDeclaration,
  AnchorTrace,
  WeightingTrace,
  WearerOperation,
  OperationParameter,
  ViewBound,
  ViewNodeRef,
} from '../config/present-types'

// ── Option C weight constants ─────────────────────────────────────────────────

const W_RECUR   = 0.4
const W_DENSITY = 0.2
const W_ADJ     = 0.4

// ── Public interface ──────────────────────────────────────────────────────────

export type ComposeViewInput = {
  records:   StateChangeRecord[]
  anchor:    AnchorTrace
  operation: WearerOperation
  parameter: OperationParameter   // Shot 5: added for perspective.direction resolution on move-trajectory
  bound:     ViewBound
}

export type ComposeViewOutput = {
  composition:    PresentView['composition']
  weightingTrace: WeightingTrace
}

export function composeView(input: ComposeViewInput): ComposeViewOutput {
  const { records, anchor, operation, parameter, bound } = input

  // ── Step 1: cluster records by identity → identity stats ──────────────────
  // recurrenceCount[id] = number of records in which id appears
  // surfaceForms[id]    = most-frequent surface-form string (identity string itself;
  //   substrate stores IdentityRef strings — dominantSurfaceForm = the identity value
  //   as its own surface form, since no separate surface-form field exists on StateChangeRecord)
  // sourceIds[id]       = set of StateChangeRecord ids contributing to this node

  const recurrenceCount  = new Map<string, number>()
  const sourceIds        = new Map<string, Set<string>>()

  for (const record of records) {
    for (const id of record.content.identities) {
      recurrenceCount.set(id, (recurrenceCount.get(id) ?? 0) + 1)
      const s = sourceIds.get(id) ?? new Set<string>()
      s.add(record.id as string)
      sourceIds.set(id, s)
    }
  }

  // ── Step 2: co-occurrence density score per identity ─────────────────────
  // density_score[id] = mean number of *other* distinct identities sharing a
  // record with id, normalized by (totalDistinctIdentities - 1) to [0, 1].
  // Stable: determined entirely from record content.

  const totalDistinct = recurrenceCount.size
  const densityRaw    = new Map<string, number>()

  for (const record of records) {
    const ids = record.content.identities
    if (ids.length < 2) continue
    for (const id of ids) {
      densityRaw.set(id, (densityRaw.get(id) ?? 0) + (ids.length - 1))
    }
  }

  const densityScore = new Map<string, number>()
  const denominator  = Math.max(totalDistinct - 1, 1)   // avoid div-by-zero for single-identity corpus

  for (const [id, raw] of densityRaw) {
    const recur = recurrenceCount.get(id) ?? 1
    // mean co-occurrence per record occurrence, normalized
    densityScore.set(id, Math.min((raw / recur) / denominator, 1))
  }

  // ── Step 3: materialize ViewThread[] from relations ───────────────────────
  // A ViewThread connects source → target via a relationType, where both
  // source and target are identities present in the node set.
  // thickness = adjacency weight contribution; computed after node set is known.
  // adjacency_count[id] = number of thread edges incident on id (in or out).

  // Collect all (source, relationType, target) triples from all records.
  type ThreadKey = string   // `${source}::${relationType}::${target}`

  const threadSources = new Map<ThreadKey, Set<string>>()   // → StateChangeRecord ids

  for (const record of records) {
    for (const rel of record.content.relations) {
      buildThreadEdges(rel, record.id as string, recurrenceCount, threadSources)
    }
  }

  // adjacency count per identity (edges incident = threads where it is source or target)
  const adjacencyCount = new Map<string, number>()
  for (const key of threadSources.keys()) {
    const [source, , target] = key.split('::')
    adjacencyCount.set(source, (adjacencyCount.get(source) ?? 0) + 1)
    adjacencyCount.set(target, (adjacencyCount.get(target) ?? 0) + 1)
  }

  // ── Step 4: compute node weights and build ViewNode[] ────────────────────

  const maxRecur = Math.max(...recurrenceCount.values(), 1)
  const maxAdj   = Math.max(...adjacencyCount.values(), 1)

  const weightMap: Record<string, number> = {}
  const nodeList: ViewNode[] = []

  for (const [id, recur] of recurrenceCount) {
    const r = recur / maxRecur
    const d = densityScore.get(id) ?? 0
    const a = (adjacencyCount.get(id) ?? 0) / maxAdj
    const w = clamp(W_RECUR * r + W_DENSITY * d + W_ADJ * a)
    weightMap[id] = w
    nodeList.push({
      identity:            id as IdentityRef,
      dominantSurfaceForm: id,             // IdentityRef string is its own surface form
      weight:              w,
      sourceCount:         sourceIds.get(id)?.size ?? 0,
    })
  }

  // Sort descending weight, tiebreak lexicographic ascending on identity
  nodeList.sort((a, b) => b.weight - a.weight || a.identity.localeCompare(b.identity))

  // Enforce maxNodes bound
  const nodes = nodeList.slice(0, bound.maxNodes)
  const nodeIdSet = new Set(nodes.map(n => n.identity as string))

  // ── Step 5: build ViewThread[] — only between nodes in the final node set ─

  const maxAdjacentForThickness = Math.max(...adjacencyCount.values(), 1)

  const threadList: ViewThread[] = []
  for (const [key, scIds] of threadSources) {
    const [source, relationType, target] = key.split('::')
    if (!nodeIdSet.has(source) || !nodeIdSet.has(target)) continue

    // thickness = Option C: w_recur * type_recurrence + w_density * pair_density + w_adj * adjacency_density
    // type_recurrence = scIds.size / maxRecur (how often this exact edge appears)
    // pair_density    = density of the source-target pair relative to total distinct
    // adjacency_density = mean adjacency of source + target, normalized
    const typeRecur      = scIds.size / Math.max(maxRecur, 1)
    const pairDensity    = Math.min(scIds.size / Math.max(totalDistinct, 1), 1)
    const adjDensity     = ((adjacencyCount.get(source) ?? 0) + (adjacencyCount.get(target) ?? 0)) / 2 / maxAdjacentForThickness
    const thickness      = clamp(W_RECUR * typeRecur + W_DENSITY * pairDensity + W_ADJ * adjDensity)

    threadList.push({
      source:               source as IdentityRef,
      target:               target as IdentityRef,
      relationType:         relationType as IdentityRef,
      thickness,
      sourceStateChangeIds: [...scIds].sort() as any,   // stable sort for determinism
    })
  }

  // Sort descending thickness, tiebreak lexicographic on key
  threadList.sort((a, b) =>
    b.thickness - a.thickness ||
    `${a.source}::${a.relationType}::${a.target}`.localeCompare(`${b.source}::${b.relationType}::${b.target}`)
  )

  // Enforce maxThreads bound
  const threads = threadList.slice(0, bound.maxThreads)

  // ── Step 6: focus — anchor identity node if present; else highest-weight node ─

  const anchorIdentity = anchor.derivedAs.identity
  let focusNode = nodes[0]   // highest weight (list is already sorted)

  if (anchorIdentity) {
    const found = nodes.find(n => n.identity === anchorIdentity)
    if (found) focusNode = found
  }

  const focus = (focusNode?.identity ?? nodes[0]?.identity ?? '') as unknown as ViewNodeRef

  // ── Step 7: perspective — derived from operation.kind (+ parameter for direction) ─

  const perspective = derivePerspective(operation, parameter)

  // ── Weighting trace ───────────────────────────────────────────────────────

  const weightingTrace: WeightingTrace = {
    weightMap,
    weightingBasis:    'option-C-v1.0',
    thresholdsApplied: {
      w_recur:   W_RECUR,
      w_density: W_DENSITY,
      w_adj:     W_ADJ,
    },
  }

  return {
    composition: { nodes, threads, focus, perspective },
    weightingTrace,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v))
}

/**
 * Derive PerspectiveDeclaration from operation.kind + parameter.
 *   move-trajectory   → 'time' + direction from parameter.direction (Shot 5 resolution)
 *   search-by-role    → 'role'
 *   everything else   → 'identity'
 */
function derivePerspective(operation: WearerOperation, parameter: OperationParameter): PerspectiveDeclaration {
  switch (operation.kind) {
    case 'move-trajectory': {
      const p = parameter as Extract<OperationParameter, { kind: 'move-trajectory' }>
      return { axis: 'time', direction: p.direction }
    }
    case 'search-by-role':
      return { axis: 'role' }
    case 'search-by-identity':
    case 'default-entry':
    case 'move-neighborhood':
      return { axis: 'identity' }
  }
}

/**
 * Extract (source, relationType, target) edges from a Relation.
 * Relation shape (source-of-truth substrate.types.ts):
 *   type:                IdentityRef          ← relationType
 *   modality:            RelationModality
 *   identitiesWithRoles: IdentityWithRole[]   ← ≥1 entry; each has .identity + .role
 *   negation:            boolean
 *
 * A thread edge is: source = identitiesWithRoles[0].identity,
 *                   target = identitiesWithRoles[1].identity (if present),
 *                   relationType = rel.type
 * For relations with only one identityWithRole (self-referential / unary),
 * no thread edge is emitted (threads require source ≠ target).
 * For relations with ≥3 identitiesWithRoles, all pairwise (first→each subsequent) edges
 * are emitted. Deterministic: order is the storage order.
 */
function buildThreadEdges(
  rel:            Relation,
  recordId:       string,
  nodeIds:        Map<string, number>,   // only create edges between known identities
  threadSources:  Map<string, Set<string>>,
): void {
  const participants = rel.identitiesWithRoles
  if (participants.length < 2) return

  const relType = rel.type as string
  const source  = participants[0].identity as string

  if (!nodeIds.has(source)) return

  for (let i = 1; i < participants.length; i++) {
    const target = participants[i].identity as string
    if (!nodeIds.has(target)) continue
    if (source === target) continue   // skip self-loops

    const key  = `${source}::${relType}::${target}`
    const scSet = threadSources.get(key) ?? new Set<string>()
    scSet.add(recordId)
    threadSources.set(key, scSet)
  }
}
