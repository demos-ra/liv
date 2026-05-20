// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/deliver-view.ts]
// Sprint 2 — Shot 4
//
// PR8 — Consumer emission with ViewBound enforcement per Present Standard v1.0.1 §3.7.
//
// Defensive bound re-trim: compose-view (PR5) applies bounds at composition time;
// PR8 re-trims defensively in case the gate path or upstream logic produced an
// oversized view. No further composition (PrA1).
//
// Sort order matches compose-view for determinism (PrA8):
//   nodes:   descending weight, tiebreak lexicographic ascending on identity
//   threads: descending thickness, tiebreak lexicographic ascending on key
//
// Pure function — no I/O. Returns PresentResult<PresentView>.

import type { PresentView, PresentReadIntent } from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export function deliverView(input: {
  view:   PresentView
  intent: PresentReadIntent
}): PresentResult<PresentView> {
  const { view, intent } = input

  let nodes   = view.composition.nodes
  let threads = view.composition.threads

  // Nodes: trim to maxNodes, stable sort descending weight + lexicographic tiebreak
  if (nodes.length > intent.bound.maxNodes) {
    nodes = [...nodes]
      .sort((a, b) => b.weight - a.weight || a.identity.localeCompare(b.identity))
      .slice(0, intent.bound.maxNodes)
  }

  // Threads: trim to maxThreads, stable sort descending thickness + lexicographic tiebreak
  if (threads.length > intent.bound.maxThreads) {
    threads = [...threads]
      .sort((a, b) =>
        b.thickness - a.thickness ||
        `${a.source}::${a.relationType}::${a.target}`.localeCompare(
          `${b.source}::${b.relationType}::${b.target}`,
        )
      )
      .slice(0, intent.bound.maxThreads)
  }

  // If neither list was trimmed, return view reference directly (no allocation)
  if (nodes === view.composition.nodes && threads === view.composition.threads) {
    return { ok: true, data: view }
  }

  return {
    ok: true,
    data: {
      ...view,
      composition: {
        ...view.composition,
        nodes,
        threads,
      },
    },
  }
}
