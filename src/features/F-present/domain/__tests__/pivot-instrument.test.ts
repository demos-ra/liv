// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — sprint-wire-economy R6 one instrument)
// [F-present/domain/__tests__/pivot-instrument.test.ts]
// Built with LIV · livai.dev
//
// THE INSTRUMENT BARS (done-criterion #4):
//   - RING INVERSION / concentric altitude: a heavy DEEP node, bright within its own ring,
//     surfaces under share-of-RING even though its share-of-WHOLE is below the floor — while
//     a light ring-1 node, dim in its ring, is pruned. This is the R6 fix: the cross-branch
//     inversion (deep heavy nodes diluted against the whole, sinking below shallow light
//     ones) is gone — each node is judged among its depth-peers.
//   - LEVEL bounds the rings shown; an OFF-DEFAULT config (level, top, sort, filter) answers
//     correctly; the default lineage render is byte-equal to a golden.
//
// Pure domain — builds a Dimension directly (no DB), so it runs under bare tsx with zero @/.
// Run: npx tsx --test src/features/F-present/domain/__tests__/pivot-instrument.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import { pivot, lineageConfig, lineageView } from '../pivot'
import type { Dimension, ThingId, Grid } from '../../config/read-engine-types'

// renderGrid pulls the F-memory R3 barrel (joinCells) — warm the F-present R3 graph first
// so it resolves cleanly under bare tsx (db client is lazy), then load it dynamically.
let renderGrid: (g: Grid, spec: typeof lineageView.render) => string
before(async () => {
  await import('@/features/F-present/contract/present-contract')
  ;({ renderGrid } = await import('../render-present'))
})

// build a Dimension from a flat spec (id, label, weight, parent). resolveRef by name.
function mkDim(specs: { id: string; label: string; weight: number; parent: string | null }[]): Dimension {
  const things = new Map<ThingId, { id: ThingId; label: string; members: never[]; weight: number; parent: ThingId | null }>()
  for (const s of specs) things.set(s.id, { id: s.id, label: s.label, members: [], weight: s.weight, parent: s.parent })
  const byLabel = new Map(specs.map(s => [s.label.toLowerCase(), s.id]))
  return { things: things as unknown as Dimension['things'], resolveRef: (r) => (typeof r === 'string' ? byLabel.get(r.toLowerCase()) ?? null : null) }
}

// the thing-keys shown, in flat DFS pre-order (the synthetic root '' dropped).
const ids = (g: Grid): string[] => g.rows.map(r => String(r.key)).filter(Boolean)
// the top-level children, in row order (depth 1).
const topChildren = (g: Grid): string[] => g.rows.filter(r => r.depth === 1).map(r => String(r.key))

// H (ring 1, weight 100) → D (ring 2, weight 80, bright in its ring); L (ring 1, weight 5, dim).
// ring sums: ring1 = H+L = 105 ; ring2 = D = 80.
const INVERSION = () => mkDim([
  { id: 'h', label: 'H', weight: 100, parent: null },
  { id: 'd', label: 'D', weight: 80, parent: 'h' },
  { id: 'l', label: 'L', weight: 5, parent: null },
])

// ── ring inversion — concentric altitude ─────────────────────────────────────────
test('share-of-RING surfaces a bright deep node that share-of-WHOLE would sink (concentric)', () => {
  const dim = INVERSION()
  const f = pivot(lineageConfig({ top: 0.5 }), dim, [])
  const shown = ids(f)

  // D is 80/80 = 100% of ring 2 → bright → shown, under its parent H (95% of ring 1).
  assert.ok(shown.includes('h'), 'H (95% of ring 1) shows')
  assert.ok(shown.includes('d'), 'D (100% of its ring) shows — the bright deep node surfaces')
  // L is 5/105 = 4.8% of ring 1 → dim → pruned.
  assert.ok(!shown.includes('l'), 'L (dim in ring 1) is pruned')

  // the inversion proof: D's SHARE-OF-WHOLE is below the floor — only the ring-local lens
  // surfaces it. The old share-of-whole cutoff would have hidden D below shallow L.
  const shareOfWhole = 80 / (100 + 80 + 5)         // 0.432
  assert.ok(shareOfWhole < 0.5, 'D would FAIL a share-of-whole floor of 0.5')
})

// ── level bounds the rings ───────────────────────────────────────────────────────
test('level bounds the rings shown (off-default config answers)', () => {
  const dim = INVERSION()
  const f = pivot(lineageConfig({ top: 0.5, level: 1 }), dim, [])
  const shown = ids(f)
  assert.ok(shown.includes('h'), 'ring 1 shows')
  assert.ok(!shown.includes('d'), 'D (ring 2) is cut by level=1')
})

// ── top=0 shows all; sort=id orders by id ────────────────────────────────────────
test('top=0 keeps the whole ring; sort=id orders children by id', () => {
  const dim = mkDim([
    { id: 'b', label: 'B', weight: 1, parent: null },
    { id: 'a', label: 'A', weight: 100, parent: null },
  ])
  const all = ids(pivot(lineageConfig({ top: 0 }), dim, []))
  assert.deepEqual(all.sort(), ['a', 'b'])                  // both kept (no floor)

  const byId = pivot(lineageConfig({ top: 0, sort: 'id' }), dim, [])
  assert.deepEqual(topChildren(byId), ['a', 'b'])   // id order (not weight)
  const byWeight = pivot(lineageConfig({ top: 0 }), dim, [])
  assert.deepEqual(topChildren(byWeight), ['a', 'b'])   // weight order: a(100) before b(1)
})

// ── default lineage render is byte-equal to a golden (header terse + token-free; body = HEAD) ─
test('the default lineage config renders byte-equal to the golden', () => {
  const dim = INVERSION()
  const golden =
`structure — lineage by weight; root = wearer:
— [w=105]
  H [w=100]
    D [w=80]`
  // top=0.5 prunes L; H→D survive. (lineageConfig default top is 0.02 — here we pin the
  // 0.5 shape so the golden is unambiguous about which ring the floor judges.) The body is
  // byte-equal to the pre-build nested walk; only the baked title became the terse header.
  const cfg = lineageConfig({ top: 0.5 })
  assert.equal(renderGrid(pivot(cfg, dim, []), lineageView.render), golden)
})
