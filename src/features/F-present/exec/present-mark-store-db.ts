// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R4]
// Built with LIV · livai.dev
// [F-present/exec/present-mark-store-db.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-3 (production PlacedMark store — the disclosed seam)
// slice:      F-present
// layer:      R4
// wires-in:
//   W-ATOM  PresentMarkStore        ../app/present-store
//   W-ATOM  PlacedMark / PresentStore / Mark   ../config/mark-types
//   W-ATOM  Who                     @/core/types/substrate-raw.types
//   W-ATOM  db                      @/core/db/client
//   W-FN    isMark                  ../domain/mark-gate
// wires-out:
//   W-FN    createDbPresentMarkStore →  F-present (wired in Shot 4 as the live store)
// deps:
//   R2  ../app/present-store
//   R1  ../domain/mark-gate
//   R0  ../config/mark-types
//   R0  @/core/types/substrate-raw.types
//   R5  @/core/db/client

// R4 — Execution / I/O. A4 (LIV-Standard v1.5.2 — Isolated execution): all disk
// I/O lives here; no business logic beyond row-mapping. This is the production
// form of present-store.ts's in-memory reference impl — the SAME PresentMarkStore
// contract (place / read / clear), durably backed by table present_marks (023).
//
// Per-wearer isolation = user_id (identical to the in-memory ref's Map key — the
// contract has no scopeRef). Append-only place; read returns the wearer's whole
// lens; clear removes it. Writes NOTHING to the substrate (F-present is the lens).
//
// SEAM PARITY: createInMemoryPresentStore (the ref) and createDbPresentMarkStore
// (this) are interchangeable behind PresentMarkStore — Shot 4 wires THIS one into
// the loop; tests may use the in-memory ref. No caller distinguishes them.

import { db }                              from '@/core/db/client'
import type { PresentMarkStore }           from '@/features/F-present/app/present-store'
import type { PlacedMark, PresentStore, Mark } from '@/features/F-present/config/mark-types'
import type { Who }                        from '@/core/types/substrate-raw.types'
import { isMark }                          from '@/features/F-present/domain/mark-gate'

// Row shape read back from present_marks (jsonb mark may arrive parsed or as text).
type MarkRow = { seq: number | string; home_who: string; home_sc: number | string; home_pos: number | string; mark: unknown }

// One structured line per rejected row — the read crossing's never-silent contract.
// `op` is read off the raw payload for triage even when the row failed the gate (it may
// be absent/garbled — surfaced as-is). Logged, never thrown: a skipped row is not fatal.
function rejected(userId: string, row: MarkRow, reason: 'gate-rejected' | 'unparseable-jsonb'): void {
  const op = (() => {
    try {
      const m = typeof row.mark === 'string' ? JSON.parse(row.mark) : row.mark
      return m && typeof m === 'object' ? (m as { op?: unknown }).op ?? null : null
    } catch { return null }
  })()
  console.warn(JSON.stringify({
    level:     'warn',
    event:     'mark-gate.rejected',
    crossing:  'store-read',
    seq:       Number(row.seq),
    user_id:   userId,
    op,
    reason,
    timestamp: new Date().toISOString(),
  }))
}

export function createDbPresentMarkStore(): PresentMarkStore {
  return {
    // append the lens — one row per mark, bulk-inserted. Writes nothing to substrate.
    async place(userId: string, marks: PlacedMark[]): Promise<void> {
      if (marks.length === 0) return
      const tuples: string[] = []
      const params: unknown[] = []
      for (const pm of marks) {
        const b = params.length
        tuples.push(`($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}::jsonb)`)
        params.push(userId, pm.home.who, pm.home.sc, pm.home.pos, JSON.stringify(pm.mark))
      }
      await db.query(
        `INSERT INTO present_marks (user_id, home_who, home_sc, home_pos, mark)
         VALUES ${tuples.join(', ')}`,
        params,
      )
    },

    // the wearer's marks (for coin-read). Row-mapping only; coin-read computes geometry.
    //
    // PERIMETER GATE (A-isMark, read crossing): every row is narrowed through isMark —
    // the SAME honest guard the write crossing uses — before it enters the engine. The
    // store carries pre-gate sediment (bare-number Refs, missing target/peers) that the
    // read engine cannot survive (keyOf(target).who on a missing target throws and renders
    // the whole wake dead). A row that fails the gate — or whose jsonb will not parse — is
    // SKIPPED, never returned, with one structured log line (mark-gate.rejected, row seq +
    // op). Fail-open at the row, never wake-fatal, never silent: one bad mark drops itself,
    // the rest of the wearer's lens still renders.
    async read(userId: string): Promise<PresentStore> {
      const r = await db.query<MarkRow>(
        `SELECT seq, home_who, home_sc, home_pos, mark
           FROM present_marks
          WHERE user_id = $1
          ORDER BY seq ASC`,
        [userId],
      )
      const out: PresentStore = []
      for (const row of r.rows) {
        let parsed: unknown
        try {
          parsed = typeof row.mark === 'string' ? JSON.parse(row.mark) : row.mark
        } catch {
          rejected(userId, row, 'unparseable-jsonb')
          continue
        }
        if (!isMark(parsed)) {
          rejected(userId, row, 'gate-rejected')
          continue
        }
        out.push({
          home: { who: row.home_who as Who, sc: Number(row.home_sc), pos: Number(row.home_pos) },
          mark: parsed as Mark,
        })
      }
      return out
    },

    // wearer removes their lens — substrate untouched, traceless.
    async clear(userId: string): Promise<void> {
      await db.query(`DELETE FROM present_marks WHERE user_id = $1`, [userId])
    },
  }
}
