// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-config.ts]
// Sprint Item-1 — Shot 1a (present-store policy declaration)
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    item-1-storage
// slice:      F-present
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  PRESENT_STORE_POLICY  →  F-present/R4 (present-store-db)
// deps:       none
// validated:  pending
//
// R0 — pure config, zero dependencies, declaration only (no runtime logic).
//
// A6 (LIV-Standard v1.5.2 — Declaration at origin): the present-store POLICY is
// a construct owned by F-present, so it is declared here at F-present's R0 —
// never embedded in the R4 db module's bodies. The R4 module READS this and
// OBEYS it; it does not contain policy.
//
// The store SHAPES (PresentFrame / GranularityDial / SnapshotArchiveEntry /
// Window) are NOT here — they are contract-fixed by Present Standard v6.0 §2.1
// and live in present-types.ts. Changing a shape is a standard revision; this
// file governs only the three POLICY dimensions below.
//
// NOT a setting, deliberately: the downloadability boundary. Present data is
// non-downloadable — structurally, by absence: F-present's contract publishes
// only `present.read`, no export surface (cf. F-memory's `exportByScope`).
// There is no `exportable` flag here; making present data exportable is a
// deliberate contract-surface change, never a config toggle.

// ── Store identity ────────────────────────────────────────────────────────────

export const PRESENT_STORE_NAMESPACE = 'present_store' as const

// The four F-present stores (Present Standard v6.0 §2.1 line 341 — "three
// F-present stores, one substrate"; the held-present tier groups three of the
// four). The substrate itself is NOT an F-present store — it is read-only and
// owned by F-memory.
export type PresentStoreName =
  | 'held-present'   // store (2a) — the live PresentFrame, one per (userId, scopeRef)
  | 'dial'           // store (2b) — the GranularityDial (lens) position
  | 'window-set'     // store (2c) — the accumulating Window set
  | 'archive'        // store (3)  — the per-user SnapshotArchiveEntry archive

// ── Policy dimension 1 — backing selection, per store ─────────────────────────
// Which backing a store uses. 'disk' = the LIV database via @/core/db/client.
// Declared per-store so a future backing change is a config edit, not a body
// rewrite. Only 'disk' is wired this sprint; the type leaves room for more.

export type PresentStoreBacking = 'disk'

// ── Policy dimension 2 — persist-vs-derive, per store ─────────────────────────
// persisted=true  → disk-backed, survives restart.
// persisted=false → session-ephemeral / recompute-on-read (no table created).

export type PresentStorePolicy = {
  persisted: boolean
  backing:   PresentStoreBacking
}

// ── Policy dimension 3 — archive retention ────────────────────────────────────
// How long the per-user archive retains resolved presents. 'keepAll' = the
// movie is never truncated. A positive integer = a day-count after which an
// archived present is eligible for pruning. L0 changes retention by editing
// this one value — no migration, no body rewrite, no service change.

export type ArchiveRetention = 'keepAll' | { keepDays: number }

// ── The policy declaration ────────────────────────────────────────────────────
//
// Per-store persist-vs-derive — derived against Present Standard v6.0, basis
// cited per store:
//
//   held-present  persisted  — §2.1 line 341 groups the held PresentFrame as
//     one of F-present's own stores; keyed (userId, scopeRef), inherited
//     forward (PrG7 held-present discipline). Persisted so the post-restart
//     first read is a hold-read, consistent with the standard's store grouping.
//   dial          persisted  — §2.1 lines 130 + 316-319 state it three times:
//     "persistent stored position", "it is dialled and persists", "Stored in
//     F-present's own state". A non-persisted dial would silently reset every
//     user's granularity to default on every restart. Persisted.
//   window-set    persisted  — §2.1 line 341 names it explicitly as F-present's
//     own store ("...and the accumulating Window set"); §16.5 line 304 — the
//     window-set "is the session: the look-trail... the authorship seam". A
//     look-trail that resets each restart is not a trail. Persisted.
//   archive       persisted  — §2.1 line 341: "the per-user present archive —
//     SnapshotArchiveEntry records in F-present's own store in the LIV
//     database." The movie. Restart-survival of the film is this sprint's
//     exit gate. Persisted.
//
// All four persist this sprint. The per-store flag is nonetheless a real
// setting: L0 can flip any store to session-ephemeral by editing one value
// here, and the R4 db module obeys it without a body rewrite.

export const PRESENT_STORE_POLICY: Record<PresentStoreName, PresentStorePolicy> = {
  'held-present': { persisted: true, backing: 'disk' },
  'dial':         { persisted: true, backing: 'disk' },
  'window-set':   { persisted: true, backing: 'disk' },
  'archive':      { persisted: true, backing: 'disk' },
} as const

// Archive retention — default keepAll (the movie is never truncated). L0 edits
// this single value to change retention; nothing else moves.
export const ARCHIVE_RETENTION: ArchiveRetention = 'keepAll'

// ── Defaults ──────────────────────────────────────────────────────────────────
// The lens cutoff served when a (userId, scopeRef) has not set a dial.
// Carried from the pre-Item-1 in-process DEFAULT_DIAL (present-execution.ts).
export const DEFAULT_DIAL_CUTOFF = 0.15 as const
