// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/chain-ping.ts]
//
// Sets each thing's weight + parent. The principle, stated once so the mechanics
// are one thing — not a count, a score, or a gate: every mark is a TOUCH on a
// resolved identity (M2); every touch deposits one ping on that thing and climbs
// its single direct line home to the wearer; weight = the sum of pings routing
// through a node (Present Standard §16.4/§16.5; read-surface B.6; PS-manager-6 [R8]
// facets-not-rings; "direct line, no cousins").
//  - Edges = every RELATE (type-blind). No score, no threshold, no gate — a
//    relation is never filtered by "strength"; mass IS strength, as an output,
//    never a precondition. Direction is computed FROM mass, toward the
//    wearer-core: heavier is rootward. Containment is not stored.
//  - MASS = every touch deposits on the RESOLVED thing, never the surface word:
//    identity (names), RELATE (each distinct peer), QUALIFY (its target), IDENTIFY
//    (the host). "there"/"it"/a second spelling are one thing by M2, so all pile
//    onto one node (resolve-then-deposit). No op is mass-free.
//  - weight = the mass rolled UP the line: weight = mass + Σ children. An upstream
//    thing carries the sum of everything routing through it; a leaf never
//    out-weighs its upstream. Convergence is read, not computed — the shared
//    upstream node is simply already heavier (it carries both deposits).
//  - parent = the single heaviest RELATE-neighbor strictly above (no cousins).
//    parent = null terminates the line at the wearer (the implicit Σ root; not a
//    Thing member; densest by structural necessity). A thing touched only by
//    QUALIFY/identity has no RELATE neighbor -> parent = null -> direct child of
//    the wearer. That is correct.

import type { Dimension, FactRow, ThingId } from '@/features/F-present/config/read-engine-types'

export function weighDimension(dim: Dimension, rows: FactRow[]): void {
  const ids = [...dim.things.keys()]
  const mass = new Map<ThingId, number>()
  for (const id of ids) mass.set(id, 0)

  // EDGES = every RELATE (type-blind, >= 2 distinct things). MASS = every touch:
  // each mark deposits one ping on its RESOLVED thing (never the surface word).
  const adj = new Map<ThingId, Set<ThingId>>()
  for (const id of ids) adj.set(id, new Set())
  for (const r of rows) {
    if (r.op === 'RELATE') {
      const peers = [...new Set(r.refs.map(dim.resolveRef).filter((p): p is ThingId => p !== null))]
      if (peers.length < 2) continue                       // malformed RELATE: no edge, no deposit
      for (const p of peers) mass.set(p, (mass.get(p) ?? 0) + 1)   // touch each peer
      for (let i = 0; i < peers.length; i++)               // edges from RELATE
        for (let j = i + 1; j < peers.length; j++) { adj.get(peers[i])!.add(peers[j]); adj.get(peers[j])!.add(peers[i]) }
    } else {
      // identity -> the home's own thing; QUALIFY/IDENTIFY -> the target thing (refs[0])
      const t = r.op === 'identity' ? dim.resolveRef(r.home) : dim.resolveRef(r.refs[0])
      if (t) mass.set(t, (mass.get(t) ?? 0) + 1)           // every touch deposits on the resolved thing
    }
  }

  // orient: parent = the single heaviest neighbor with strictly greater mass
  // (tie-break by id for determinism). None heavier -> parent = null (-> wearer).
  const heavier = (a: ThingId, b: ThingId): boolean => {
    const ma = mass.get(a)!, mb = mass.get(b)!
    return mb > ma || (mb === ma && b > a)               // strictly above by mass, deterministic tie-break
  }
  for (const id of ids) {
    let best: ThingId | null = null
    for (const n of adj.get(id)!) if (heavier(id, n) && (best === null || heavier(best, n))) best = n
    dim.things.get(id)!.parent = best
  }

  // roll the mass UP the line: weight = mass + Σ weight(children). Children = things
  // whose parent === id. Process leaves -> root (parent strictly increases mass, so
  // the parent relation is acyclic and terminates).
  const children = new Map<ThingId, ThingId[]>()
  for (const id of ids) children.set(id, [])
  for (const id of ids) { const p = dim.things.get(id)!.parent; if (p) children.get(p)!.push(id) }

  const weightOf = new Map<ThingId, number>()
  const compute = (id: ThingId): number => {
    const cached = weightOf.get(id); if (cached !== undefined) return cached
    let w = mass.get(id)!
    for (const c of children.get(id)!) w += compute(c)
    weightOf.set(id, w)
    return w
  }
  for (const id of ids) dim.things.get(id)!.weight = compute(id)
}
