// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (vocabulary + gate)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/mark-gate.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    mark-gate-placement (isMark + isRef + isCoord extracted from
//             coin-score.ts — the single home for the gate, beside the vocabulary
//             it guards; coin-score and the store-read perimeter both import here)
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  Coord                @/core/types/substrate-raw.types   (type-only)
//   W-ATOM  Mark / Ref           ../config/mark-types               (type-only)
// wires-out (every real consumer; nothing phantom — reconciled against imports):
//   W-FN  isMark   →  ../domain/coin-score                       (R1, write crossing)
//   W-FN  isMark   →  ../exec/present-mark-store-db               (R4, read crossing)
//   W-FN  isMark   →  ../contract/present-contract                (R3, re-export → external, e.g. reconcile script)
//   W-FN  isMark   →  ./__tests__/mark-gate.corpus.test           (corpus)
//   W-FN  isCoord  →  ../domain/coin-score                        (R1, priorMarks home guard)
//   W-FN  isCoord  →  ./__tests__/mark-gate.corpus.test           (corpus)
//   W-FN  isRef    →  ./__tests__/mark-gate.corpus.test           (corpus; isRef is otherwise internal to isMark)
// deps:
//   R0  @/core/types/substrate-raw.types   (type-only)
//   R0  ../config/mark-types                (type-only)
//
// R1 — PURE. The mark gate: the SINGLE place that decides whether an arbitrary
// value is a well-formed Mark / Ref / Coord. No I/O, no logging, no side effects —
// the perimeters that call it own the consequence (drop + log). It lives in
// F-present's domain, one home beside the vocabulary (mark-types) it guards, so the
// write crossing (coin-score.emissionFromStructured) and the read crossing
// (present-mark-store-db.read) narrow against the SAME criterion. No copies, no
// variants — A-isMark holds at EVERY path because there is one gate.

import type { Coord } from '@/core/types/substrate-raw.types'
import type { Mark, Ref } from '@/features/F-present/config/mark-types'

export function isCoord(c: unknown): c is Coord {
  if (!c || typeof c !== 'object') return false
  const o = c as Record<string, unknown>
  return typeof o.who === 'string' && typeof o.sc === 'number' && typeof o.pos === 'number'
}

// A Ref is a name (string) or a coordinate — the only two pointer shapes (mark-types).
export function isRef(r: unknown): r is Ref {
  return typeof r === 'string' || isCoord(r)
}

// HONEST guard: validates each op's FULL payload, not just the discriminant. A guard that
// asserts `m is Mark` while checking only `op` is a lie — a RELATE with no `peers`, or a
// QUALIFY/IDENTIFY with a missing/garbled `target`, would pass typed as valid and crash
// downstream (`.peers.every`, `.target`, the read engine's `keyOf(target).who`). Every
// mark entry into the engine — the write crossing (emissionFromStructured, both positions
// and priorMarks) AND the read crossing (the store read-back) — narrows through THIS, so
// once it is honest every downstream `.peers / .target / .coloring` in write AND read is
// safe by the type — no per-site re-guards. Fail-closed: a malformed mark is dropped,
// never placed, never read back into the engine.
export function isMark(m: unknown): m is Mark {
  if (!m || typeof m !== 'object') return false
  const o = m as Record<string, unknown>
  switch (o.op) {
    case 'identity': return true
    case 'RELATE':   return Array.isArray(o.peers) && o.peers.length > 0 && o.peers.every(isRef)
    case 'QUALIFY':  return typeof o.coloring === 'string' && isRef(o.target)
    case 'IDENTIFY': return isRef(o.target)
    default:         return false
  }
}
