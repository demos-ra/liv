// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — BUILD-4 session window)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/session-window.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-wire-cognition Shot 2 (BUILD-4 session window — the windshield's
//             default transcript scope; currentFocus relocated here from the R2
//             orchestrator so the focus notion has one home the recorder + read-front
//             both consume — no parallel focus)
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  RawTurn                      @/core/types/substrate-raw.types   (type-only)
//   W-ATOM  Dimension/FactRow/ThingId    ../config/read-engine-types        (type-only)
// wires-out:
//   W-FN    currentFocus   →  ../app/cognition-orchestrator (R2), ../app/scored-turn-recorder (R2)
//   W-FN    sessionWindow  →  ../app/cognition-orchestrator (R2), ../app/scored-turn-recorder (R2)
// deps:
//   R0  @/core/types/substrate-raw.types   (type-only)
//   R0  ../config/read-engine-types         (type-only)
//
// R1 — PURE. No I/O. Operates on the already-resolved+weighted dimension, the flat
// fact table, and the transcript. Derives nothing the read engine doesn't already
// know: the focus is currentFocus(dim); the line is the focus's parent chain (M3,
// chain-ping); a turn's touches reuse chain-ping's resolve-then-deposit semantics.
//
// THE WINDOW (coin mechanics §3.3–3.4): the transcript run from where the CURRENT
// wearer→focus-line run began, to now. Reading the suffix forward, the conversation
// DESCENDS the focus line (rootward → leafward, into children) — that descent IS the
// run, and the window extends with it. The run begins where the line last re-routed:
// UP a ring (toward the wearer — a shallower point after a deeper one) or HORIZONTAL
// (off the line entirely — a sibling / unrelated thing). full history stays reachable
// (readTranscript untouched); only the windshield's default scope narrows.

import type { RawTurn } from '@/core/types/substrate-raw.types'
import type { Dimension, FactRow, ThingId } from '@/features/F-present/config/read-engine-types'

// The current focus (a wake-default anchor, not engine logic): the most recently
// touched thing — highest member sc, then heaviest, then id. Overridable; the LLM
// re-anchors freely by calling pivot with any focus. Relocated verbatim from the
// orchestrator (sprint-wire-cognition Shot 2) so the focus notion lives in one home
// the read-front AND the recorder's window both read — no parallel focus.
export function currentFocus(dim: Dimension): ThingId | null {
  let best: ThingId | null = null
  let bestSc = -Infinity, bestW = -Infinity
  for (const t of dim.things.values()) {
    const sc = t.members.length ? t.members[t.members.length - 1].sc : -Infinity
    if (sc > bestSc || (sc === bestSc && (t.weight > bestW || (t.weight === bestW && (best === null || t.id < best))))) {
      best = t.id; bestSc = sc; bestW = t.weight
    }
  }
  return best
}

// The session window — the suffix of `transcript` that is the current run on the
// focus line. Pure, mechanical, lineage-derived:
//   line  = focus + its parent chain (M3); depth(focus) deepest, topmost ancestor 0.
//   touch = chain-ping's resolve-then-deposit: a turn touches thing T at sc when a
//           mark homed (identity) or targeted (RELATE peer / QUALIFY|IDENTIFY target)
//           in that turn resolves to T. Same deposit law as weighDimension — no
//           parallel touch notion.
// Walk turns backward from now, tracking the deepest line-position reached. A turn
// ON the line at depth ≤ the running anchor extends the window (a descent step, read
// forward); a turn whose deepest line-touch is SHALLOWER-after-deeper (depth > anchor)
// is an up-a-ring re-route; a turn touching only OFF-line things is a horizontal
// re-route. Either re-route cuts: the window begins at the turn after it. A turn with
// no structural touch is transparent (it neither extends nor cuts — it rides along).
//
// Degenerate (sparse early): no focus / focus absent → the whole transcript is the
// current line (nothing has re-routed yet).
export function sessionWindow(
  transcript: RawTurn[],
  dim: Dimension,
  rows: FactRow[],
  focus: ThingId | null,
): RawTurn[] {
  if (transcript.length === 0) return transcript
  if (focus === null || !dim.things.has(focus)) return transcript

  // focus line → depth map (focus deepest). The chain terminates at parent === null
  // (the wearer-core) or a cycle-guard (lineDepth already seen).
  const lineDepth = new Map<ThingId, number>()
  const chain: ThingId[] = []
  for (let cur: ThingId | null = focus; cur !== null && !lineDepth.has(cur);) {
    lineDepth.set(cur, -1)                 // placeholder marks visited (cycle guard)
    chain.push(cur)
    const t = dim.things.get(cur)
    cur = t ? t.parent : null
  }
  for (let i = 0; i < chain.length; i++) lineDepth.set(chain[i], chain.length - 1 - i)

  // touched things per sc — resolve-then-deposit (mirrors chain-ping exactly).
  const touchedAt = new Map<number, Set<ThingId>>()
  const deposit = (sc: number, t: ThingId | null) => {
    if (!t) return
    ;(touchedAt.get(sc) ?? touchedAt.set(sc, new Set<ThingId>()).get(sc)!).add(t)
  }
  for (const r of rows) {
    if (r.op === 'RELATE') for (const p of new Set(r.refs.map(dim.resolveRef))) deposit(r.home.sc, p)
    else if (r.op === 'identity') deposit(r.home.sc, dim.resolveRef(r.home))
    else deposit(r.home.sc, dim.resolveRef(r.refs[0]))          // QUALIFY | IDENTIFY → target
  }

  // backward walk → window start index.
  let cut = 0
  let anchor = Infinity
  for (let i = transcript.length - 1; i >= 0; i--) {
    const touched = touchedAt.get(transcript[i].sc)
    if (!touched || touched.size === 0) continue                // transparent turn — rides along
    let onDepth = -1
    for (const t of touched) { const d = lineDepth.get(t); if (d !== undefined && d > onDepth) onDepth = d }
    if (onDepth >= 0) {                                          // on the line
      if (onDepth > anchor) { cut = i + 1; break }              // up-a-ring re-route → cut after
      anchor = onDepth
    } else {                                                    // touched only off-line things
      cut = i + 1; break                                        // horizontal re-route → cut after
    }
  }
  return transcript.slice(cut)
}
