// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/compose-view.ts]
// Sprint 2 — Shot 3; present-rederive — Shot 3; sprint-b3-present-build (v3.0);
//   b3-v4-reconciliation (v4.0: facet correction); sprint-b3-present-v5 (v5.0:
//   full-tree resolution + granularity dial + structure-carrying projection);
//   sprint-b3-present-v6 — Shots 1/2/5/6 (tree of stacks; per-node and per-edge
//   stack assembly; authorship; structure-carrying projection at the
//   granularity-cutoff extent)
//
// PR5 — Resolution by the dependency walk: the present is a TREE OF STACKS.
// Present Standard v6.0 §3.7 PR5 + §3.6 PrA5 dependency-walk clause + §2.1.
//
// v6.0 re-derivation:
//
//   Shot 1 — STACK ASSEMBLY ([R4]/[R5]). v5.0 resolved a flat node value and a
//     flat {parent,child,thickness} edge. v6.0 resolves each node and each edge
//     as a STACK — the append-only sequence of that carrier's state-changes,
//     ordered by the substrate append index; stack[last] is the surface, the
//     rest is depth. Node-stack and edge-stack are the SAME assembly — the
//     carriers are symmetric ([R5]).
//
//   Shot 5 — AUTHORSHIP ([R14]). Each StackEntry carries authorship — 'user'
//     (Path A external arrival: SourceChannel 'wearer') or 'llm' (Path B
//     internal-derivation: every other channel). Read from the substrate
//     record's metadata.source.channel; the present SURFACES it.
//
//   Shot 6 — STRUCTURE-CARRYING PROJECTION ([R19]/[R20]). composition carries
//     nodes (stack-carrying), edges (stack-carrying), root, camera, and
//     extent='granularity-cutoff'. The v5.0 flat dominantSurfaceForm/status/
//     recency fields are GONE — the surface IS stack[last] ([R7]).
//
//   Shot 2 — full-tree resolution ([R3]): carried from v5.0 — the walk resolves
//     the whole relationally-significant tree; the granularity cutoff bounds
//     the extent, not a hop count.
//
//   The walk ENGINE — read-computed dependency, type-blind load-bearing
//   scoring, facet-model chain-ping summation — is carried unchanged from v5.0.
//
// Determinism (PrA8): no Math.random / Date.now; stable sort; Map for ordered
//   iteration; pure deterministic function of (records, camera, dial, bound, THETA).
//
// Pure function — zero I/O. emittedAt/openedAt are supplied by the service.

import type {
  StateChangeRecord,
  IdentityRef,
  Relation,
  SourceChannel,
} from '@/core/types/substrate.types'

import type {
  PresentView,
  ViewNode,
  ViewEdge,
  StackEntry,
  CameraTrace,
  WeightingTrace,
  GranularityDial,
  ViewBound,
  ViewNodeRef,
  FrameNode,
  FrameEdge,
  PositionRef,
  StateChangeId,
} from '../config/present-types'

// ── Load-bearing threshold ────────────────────────────────────────────────────
const THETA = 0.5

// ── authorshipOf — Path A / Path B → 'user' | 'llm' ([R14], Shot 5) ───────────
// The substrate SourceChannel distinguishes the writers. 'wearer' is Path A —
// the user's external arrival. Every other channel ('ai', 'internal-derivation',
// 'cron', 'integration-event', 'system-l0') is a program/system emission —
// Path B — surfaced to the present as 'llm' (the non-user author). The present
// must surface this so the LLM does not read its own outputs as the user's
// cognition.
function authorshipOf(channel: SourceChannel): 'user' | 'llm' {
  return channel === 'wearer' ? 'user' : 'llm'
}

// ── Public interface ──────────────────────────────────────────────────────────
// composeView receives the camera trace (where the tree is centred), the lens
// dial (the mass-fraction cutoff, read from stored state by the service), the
// resource bound, and the records read from substrate. It returns the
// PresentView composition, the WeightingTrace, and the held-frame
// FrameNode[]/FrameEdge[]/root — every node and every edge stack-carrying.

export type ComposeViewInput = {
  records: StateChangeRecord[]
  camera:  CameraTrace
  dial:    GranularityDial   // the lens — the mass-fraction cutoff ([R10])
  bound:   ViewBound
}

export type ComposeViewOutput = {
  composition:    PresentView['composition']
  weightingTrace: WeightingTrace
  frameNodes:     FrameNode[]
  frameEdges:     FrameEdge[]
  frameRoot:      ViewNodeRef
}

export function composeView(input: ComposeViewInput): ComposeViewOutput {
  const { records, camera, dial, bound } = input

  // ── Step 1: CLUSTER — LMA5 identity-cluster-at-read ───────────────────────
  const recurrence = new Map<string, number>()
  const sourceIds  = new Map<string, Set<string>>()

  records.forEach(record => {
    for (const id of record.content.identities) {
      recurrence.set(id, (recurrence.get(id) ?? 0) + 1)
      const s = sourceIds.get(id) ?? new Set<string>()
      s.add(record.id as string)
      sourceIds.set(id, s)
    }
  })

  // ── Step 1 (cont.): candidate edges from LMA3 relations ───────────────────
  type EdgeKey = string   // `${source}::${relationType}::${target}`
  const relationEdges = new Map<EdgeKey, Set<string>>()

  for (const record of records) {
    for (const rel of record.content.relations) {
      collectRelationEdges(rel, record.id as string, recurrence, relationEdges)
    }
  }

  const adjacency = new Map<string, number>()
  for (const key of relationEdges.keys()) {
    const [source, , target] = key.split('::')
    adjacency.set(source, (adjacency.get(source) ?? 0) + 1)
    adjacency.set(target, (adjacency.get(target) ?? 0) + 1)
  }

  // ── Step 2: SCORE LOAD-BEARING — one type-blind function (R1) ─────────────
  const maxRecur = Math.max(...recurrence.values(), 1)
  const maxAdj   = Math.max(...adjacency.values(), 1)

  const loadBearingPairs = new Set<string>()   // `dependent::carrier`

  for (const record of records) {
    for (const rel of record.content.relations) {
      const parts = rel.identitiesWithRoles
      if (parts.length < 2) continue
      for (const dependent of parts) {
        const depId = dependent.identity as string
        const score = loadBearingScore(rel, depId, recurrence, adjacency, maxRecur, maxAdj)
        if (score < THETA) continue
        for (const carrier of parts) {
          const carId = carrier.identity as string
          if (carId === depId) continue
          loadBearingPairs.add(`${depId}::${carId}`)
        }
      }
    }
  }

  // ── Step 3: CHAIN-PING SUMMATION (facet model) — carried from v5.0 ────────
  const anchorIdentity = (camera.anchor ?? '') as string

  const dependsOn  = new Map<string, Set<string>>()   // dependent -> carriers (rootward)
  const dependents = new Map<string, Set<string>>()   // carrier -> dependents (leafward)
  for (const pair of loadBearingPairs) {
    const [dep, car] = pair.split('::')
    if (!dependsOn.has(dep)) dependsOn.set(dep, new Set())
    dependsOn.get(dep)!.add(car)
    if (!dependents.has(car)) dependents.set(car, new Set())
    dependents.get(car)!.add(dep)
  }

  const weightRaw = new Map<string, number>()
  depositChainPing(anchorIdentity, dependsOn, weightRaw)

  for (const id of recurrence.keys()) {
    if (!weightRaw.has(id)) weightRaw.set(id, 0)
  }

  const maxWeight = Math.max(...weightRaw.values(), 1)
  const weightMap: Record<string, number> = {}
  for (const [id, raw] of weightRaw) {
    weightMap[id] = raw / maxWeight
  }

  // ── Step 4: FULL-TREE RESOLUTION — the whole tree (carried from v5.0) ─────
  const leafwardReach = walkFull(anchorIdentity, dependents)
  const rootwardReach = walkFull(anchorIdentity, dependsOn)

  const reachable = new Set<string>([anchorIdentity])
  for (const id of leafwardReach) reachable.add(id)
  for (const id of rootwardReach) reachable.add(id)

  // ── Step 4b: GRANULARITY CUTOFF — bound the EXTENT ([R20]) ────────────────
  const inView = new Set<string>()
  for (const id of reachable) {
    if (!recurrence.has(id)) continue                       // not in the read cluster
    if (id === anchorIdentity) { inView.add(id); continue } // camera anchor always expanded
    if ((weightMap[id] ?? 0) >= dial.cutoff) inView.add(id) // clears the lens cutoff → expanded
    // else: collapsed — mass folded into parent (already deposited, step 3)
  }

  // ── Step 5: STACK ASSEMBLY ([R4]/[R5], Shot 1 + Shot 5) ───────────────────
  // For each identity and each relation, assemble the carrier's STACK — the
  // append-only sequence of its state-changes, ordered by substrate position.
  // Each StackEntry carries authorship ([R14]). Node-stack and edge-stack are
  // the same assembly — symmetric carriers ([R5]).

  const nodeStacks = assembleNodeStacks(records)
  const edgeStacks = assembleEdgeStacks(records)

  // substitute-value folds — the surface forms a node carries beyond its dominant
  const substituteByIdentity = new Map<string, string[]>()
  for (const [id, stack] of nodeStacks) {
    const forms = [...new Set(stack.map(e => e.surfaceForm))]
    if (forms.length > 1) substituteByIdentity.set(id, forms.slice(0, -1))
  }

  // ── Build the held-frame FrameNode[] — each carrying its stack ────────────
  const frameNodeList: FrameNode[] = []
  for (const id of inView) {
    frameNodeList.push({
      identity:         id as IdentityRef,
      stack:            nodeStacks.get(id) ?? [],
      substituteValues: substituteByIdentity.get(id) ?? [],
      weight:           clamp(weightMap[id] ?? 0),
      sourceCount:      sourceIds.get(id)?.size ?? 0,
    })
  }
  frameNodeList.sort((a, b) =>
    b.weight - a.weight || (a.identity as string).localeCompare(b.identity as string),
  )

  // Enforce maxNodes — never drop the camera anchor.
  let frameNodes = frameNodeList.slice(0, bound.maxNodes)
  if (anchorIdentity && !frameNodes.some(n => (n.identity as string) === anchorIdentity)) {
    const anchorNode = frameNodeList.find(n => (n.identity as string) === anchorIdentity)
    if (anchorNode) frameNodes = [anchorNode, ...frameNodes.slice(0, Math.max(bound.maxNodes - 1, 0))]
  }
  const nodeIdSet = new Set(frameNodes.map(n => n.identity as string))

  // ── Build the held-frame FrameEdge[] — directed parent→child, stack-carrying
  const frameEdgeList: FrameEdge[] = []
  const seenFrameEdge = new Set<string>()
  for (const pair of loadBearingPairs) {
    const [dependent, carrier] = pair.split('::')
    if (!nodeIdSet.has(dependent) || !nodeIdSet.has(carrier)) continue
    if (dependent === carrier) continue
    const key = `${carrier}::${dependent}`
    if (seenFrameEdge.has(key)) continue
    seenFrameEdge.add(key)
    // the relation's stack: the edge-stacks keyed by this (parent,child) pair,
    // merged across relation types, ordered by position.
    const stack = edgeStackFor(edgeStacks, carrier, dependent)
    frameEdgeList.push({
      parent:       carrier as IdentityRef,
      child:        dependent as IdentityRef,
      relationType: relationTypeFor(edgeStacks, carrier, dependent),
      stack,
      thickness:    clamp(1),   // a load-bearing dependency edge
    })
  }
  frameEdgeList.sort((a, b) =>
    b.thickness - a.thickness ||
    `${a.parent}::${a.child}`.localeCompare(`${b.parent}::${b.child}`),
  )
  const frameEdges = frameEdgeList.slice(0, bound.maxEdges)

  // frameRoot — the user core, densest by chain-ping mass; falls back to the
  // camera anchor when the read does not reach the core.
  const rootNode = frameNodes.length > 0
    ? frameNodes.reduce((a, b) => (b.weight > a.weight ? b : a))
    : undefined
  const frameRoot = ((rootNode?.identity ?? anchorIdentity) as unknown) as ViewNodeRef

  // ── Build the PresentView composition — STRUCTURE-CARRYING ([R19], Shot 6) ─
  const parentOf   = new Map<string, string>()
  const childrenOf = new Map<string, string[]>()
  for (const e of frameEdges) {
    const p = e.parent as string
    const c = e.child as string
    parentOf.set(c, p)
    const list = childrenOf.get(p) ?? []
    list.push(c)
    childrenOf.set(p, list)
  }

  const nodes: ViewNode[] = frameNodes.map(fn => {
    const id = fn.identity as string
    const parent = parentOf.get(id)
    return {
      identity:         fn.identity,
      stack:            fn.stack,
      substituteValues: fn.substituteValues,
      weight:           fn.weight,
      parent:           parent !== undefined ? ((parent as unknown) as ViewNodeRef) : null,
      children:         (childrenOf.get(id) ?? []).map(c => (c as unknown) as ViewNodeRef),
      sourceCount:      fn.sourceCount,
    }
  })

  const edges: ViewEdge[] = frameEdges.map(fe => ({
    parent:       fe.parent,
    child:        fe.child,
    relationType: fe.relationType,
    stack:        fe.stack,
    thickness:    fe.thickness,
  }))

  const anchorNode = nodes.find(n => (n.identity as string) === anchorIdentity) ?? nodes[0]
  const cameraRef  = ((anchorNode?.identity ?? '') as unknown) as ViewNodeRef

  const weightingTrace: WeightingTrace = {
    weightMap,
    weightingBasis: 'chain-ping-summation-v1.0',
    thresholdApplied: { loadBearingTheta: THETA },
  }

  return {
    composition: {
      nodes,
      edges,
      root:   frameRoot,
      camera: cameraRef,
      extent: 'granularity-cutoff',
    },
    weightingTrace,
    frameNodes,
    frameEdges,
    frameRoot,
  }
}

// ── assembleNodeStacks — each identity's append-only stack ([R4], Shot 1) ─────
// For each identity, the ordered sequence of state-changes about it. surfaceForm
// is the identity string (the substrate stores no separate surface-form field;
// the identity at a position IS its asserted form there). authorship from the
// record's source channel ([R14]).
function assembleNodeStacks(records: StateChangeRecord[]): Map<string, StackEntry[]> {
  const stacks = new Map<string, StackEntry[]>()
  const ordered = [...records].sort(
    (a, b) => (a.metadata.position as unknown as number) - (b.metadata.position as unknown as number),
  )
  for (const record of ordered) {
    const author = authorshipOf(record.metadata.source.channel)
    for (const id of record.content.identities) {
      const entry: StackEntry = {
        stateChangeId: record.id as StateChangeId,
        position:      record.metadata.position as unknown as PositionRef,
        surfaceForm:   id as string,
        authorship:    author,
      }
      const list = stacks.get(id as string) ?? []
      list.push(entry)
      stacks.set(id as string, list)
    }
  }
  return stacks
}

// ── assembleEdgeStacks — each relation's append-only stack ([R4]/[R5], Shot 1) ─
// Keyed `${source}::${relationType}::${target}`; symmetric with node-stack
// assembly. surfaceForm is the relation's condition (its type, negated or not).
function assembleEdgeStacks(records: StateChangeRecord[]): Map<string, StackEntry[]> {
  const stacks = new Map<string, StackEntry[]>()
  const ordered = [...records].sort(
    (a, b) => (a.metadata.position as unknown as number) - (b.metadata.position as unknown as number),
  )
  for (const record of ordered) {
    const author = authorshipOf(record.metadata.source.channel)
    for (const rel of record.content.relations) {
      const parts = rel.identitiesWithRoles
      if (parts.length < 2) continue
      const relType = rel.type as string
      const source  = parts[0].identity as string
      const surface = rel.negation ? `not:${relType}` : relType
      for (let i = 1; i < parts.length; i++) {
        const target = parts[i].identity as string
        if (source === target) continue
        const key = `${source}::${relType}::${target}`
        const entry: StackEntry = {
          stateChangeId: record.id as StateChangeId,
          position:      record.metadata.position as unknown as PositionRef,
          surfaceForm:   surface,
          authorship:    author,
        }
        const list = stacks.get(key) ?? []
        list.push(entry)
        stacks.set(key, list)
      }
    }
  }
  return stacks
}

// ── edgeStackFor — the merged stack for a (parent,child) pair ─────────────────
// A dependency edge between two identities may carry several relation types;
// the edge's stack is their entries merged, ordered by position. Direction is
// parent→child OR child→parent in the relation keys — both contribute.
function edgeStackFor(
  edgeStacks: Map<string, StackEntry[]>,
  parent: string,
  child: string,
): StackEntry[] {
  const merged: StackEntry[] = []
  for (const [key, entries] of edgeStacks) {
    const [s, , t] = key.split('::')
    if ((s === parent && t === child) || (s === child && t === parent)) {
      merged.push(...entries)
    }
  }
  merged.sort((a, b) => (a.position as unknown as number) - (b.position as unknown as number))
  return merged
}

// ── relationTypeFor — the dominant relation type for a (parent,child) pair ────
function relationTypeFor(
  edgeStacks: Map<string, StackEntry[]>,
  parent: string,
  child: string,
): IdentityRef {
  for (const key of edgeStacks.keys()) {
    const [s, relType, t] = key.split('::')
    if ((s === parent && t === child) || (s === child && t === parent)) {
      return relType as IdentityRef
    }
  }
  return 'depends-on' as IdentityRef
}

// ── walkFull — full reachability along a directed adjacency map ───────────────
function walkFull(
  start: string,
  adjacency: Map<string, Set<string>>,
): Set<string> {
  const reached = new Set<string>()
  if (!start) return reached
  const stack: string[] = [start]
  const visited = new Set<string>([start])
  while (stack.length > 0) {
    const node = stack.pop()!
    const next = adjacency.get(node)
    if (!next) continue
    for (const n of next) {
      if (visited.has(n)) continue
      visited.add(n)
      reached.add(n)
      stack.push(n)
    }
  }
  return reached
}

// ── loadBearingScore — ONE type-blind scoring function (R1) ───────────────────
function loadBearingScore(
  rel:        Relation,
  identity:   string,
  recurrence: Map<string, number>,
  adjacency:  Map<string, number>,
  maxRecur:   number,
  maxAdj:     number,
): number {
  const recurTerm = (recurrence.get(identity) ?? 0) / maxRecur
  const adjTerm   = (adjacency.get(identity) ?? 0) / maxAdj

  let modalityTerm: number
  if (rel.negation) {
    modalityTerm = 0.1
  } else if (rel.modality === 'declarative') {
    modalityTerm = 1.0
  } else if (rel.modality === 'imperative') {
    modalityTerm = 0.7
  } else {
    modalityTerm = 0.4
  }

  return clamp((recurTerm + modalityTerm + adjTerm) / 3)
}

// ── depositChainPing — chain-ping summation, facet model (carried verbatim) ───
function depositChainPing(
  start:     string,
  dependsOn: Map<string, Set<string>>,
  weightRaw: Map<string, number>,
): void {
  if (!start) return

  const walk = (node: string, onPath: Set<string>): void => {
    weightRaw.set(node, (weightRaw.get(node) ?? 0) + 1)
    const carriers = dependsOn.get(node)
    if (!carriers) return
    for (const carrier of carriers) {
      if (onPath.has(carrier)) continue
      const nextPath = new Set(onPath)
      nextPath.add(carrier)
      walk(carrier, nextPath)
    }
  }

  walk(start, new Set<string>([start]))
}

// ── collectRelationEdges — candidate edges from a Relation ────────────────────
function collectRelationEdges(
  rel:           Relation,
  recordId:      string,
  clusterIds:    Map<string, number>,
  relationEdges: Map<string, Set<string>>,
): void {
  const parts = rel.identitiesWithRoles
  if (parts.length < 2) return

  const relType = rel.type as string
  const source  = parts[0].identity as string
  if (!clusterIds.has(source)) return

  for (let i = 1; i < parts.length; i++) {
    const target = parts[i].identity as string
    if (!clusterIds.has(target)) continue
    if (source === target) continue

    const key = `${source}::${relType}::${target}`
    const set = relationEdges.get(key) ?? new Set<string>()
    set.add(recordId)
    relationEdges.set(key, set)
  }
}

// ── clamp ─────────────────────────────────────────────────────────────────────
function clamp(v: number): number {
  return Math.max(0, Math.min(1, v))
}
