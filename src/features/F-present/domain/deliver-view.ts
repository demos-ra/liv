// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/deliver-view.ts]
// Sprint 2 — Shot 4; present-rederive — Shot 3 (v2.0 domain re-wire);
//   sprint-b3-present-v5 (v5.0: structure-carrying composition);
//   sprint-b3-present-v6 — Shots 1/6 (maxThreads -> maxEdges; the trim
//   preserves the stack-carrying nodes/edges, root, camera, extent)
//
// PR8 — Consumer emission with ViewBound enforcement per Present Standard v6.0 §3.7.
//
// Defensive bound re-trim: compose-view (PR5) applies bounds at composition time;
// PR8 re-trims defensively in case upstream produced an oversized view. No
// further composition (PrA1).
//
// v6.0 ([R4]/[R19]): the composition carries the tree of stacks — nodes
// (ViewNode[] each carrying a stack), edges (ViewEdge[] each carrying a stack),
// plus root + camera refs and extent='granularity-cutoff'. The trim re-sorts
// and slices nodes and edges; root, camera, and extent are carried through
// untouched; every node and edge keeps its stack.
//
// Sort order matches compose-view for determinism (PrA8):
//   nodes: descending weight, tiebreak lexicographic ascending on identity
//   edges: descending thickness, tiebreak lexicographic ascending on edge key
//
// Pure function — no I/O. Returns PresentResult<PresentView>.

import type { PresentView, PresentIntent } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export function deliverView(input: {
  view:   PresentView
  intent: PresentIntent
}): PresentResult<PresentView> {
  const { view, intent } = input

  let nodes = view.composition.nodes
  let edges = view.composition.edges

  // Nodes: trim to maxNodes, stable sort descending weight + lexicographic tiebreak
  if (nodes.length > intent.bound.maxNodes) {
    nodes = [...nodes]
      .sort((a, b) => b.weight - a.weight || (a.identity as string).localeCompare(b.identity as string))
      .slice(0, intent.bound.maxNodes)
  }

  // Edges: trim to maxEdges, stable sort descending thickness + lexicographic tiebreak
  if (edges.length > intent.bound.maxEdges) {
    edges = [...edges]
      .sort((a, b) =>
        b.thickness - a.thickness ||
        `${a.parent}::${a.relationType}::${a.child}`.localeCompare(
          `${b.parent}::${b.relationType}::${b.child}`,
        ),
      )
      .slice(0, intent.bound.maxEdges)
  }

  // If neither list was trimmed, return view reference directly (no allocation)
  if (nodes === view.composition.nodes && edges === view.composition.edges) {
    return { ok: true, data: view }
  }

  return {
    ok: true,
    data: {
      ...view,
      composition: {
        ...view.composition,
        nodes,
        edges,
      },
    },
  }
}
