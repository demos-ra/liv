// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R4]
// Built with LIV · livai.dev
// [F-present/exec/present-execution.ts]
// Sprint 2 — Shot 5; b3-v4-reconciliation (v4.0: the held store);
//   sprint-b3-present-v5 (v5.0: archive + dial stores; scrub-back lookup);
//   sprint-b3-present-v6 — Shot 4 (the accumulating Window set store) + the
//     tree-of-stacks vocabulary (the held object is the present);
//   item-1-storage (the four stores re-pointed from in-process Maps to the
//     per-user disk backing in present-store-db; functions are now async)
//
// R4 — Execution / I/O layer.
//
// v6.0: F-present is a non-emitter — it writes nothing to the substrate ([R1]).
// It has FOUR storage facts, and the substrate is none of them:
//   (1) the substrate — read only (the LMA9 primitives, delegated below);
//   (2) the HELD LIVE PRESENT — one live PresentFrame (a tree of stacks) per
//       (userId, scopeRef);
//   (3) the LENS dial — the GranularityDial position, one per (userId,scopeRef);
//   (4) the per-user PRESENT ARCHIVE — every resolved present as a
//       SnapshotArchiveEntry ([R15]);
//   (5) the accumulating WINDOW SET — every Window opened, per (userId,scopeRef)
//       ([R12]/[R13]). Windows ACCUMULATE — they do not replace.
//
// Stores (2)-(5) are F-present's OWN. LMA8 forbids the *substrate* storing
// derived geometry; the present is a tree of stacks the flat substrate ledger
// cannot hold — it lives here, at F-present's execution tier, and in the
// per-user store in the LIV database. "Delete F-present and the substrate
// stands" — (2)-(5) die with the paid layer; the open substrate is untouched
// ([R1]).
//
// item-1-storage: stores (2)-(5) are now durably backed. This module no longer
// holds in-process Maps — it delegates to present-store-db.ts (R4), the
// per-user disk backing in the LIV database. The store SHAPES
// (PresentFrame / GranularityDial / SnapshotArchiveEntry / Window) remain the
// Present Standard v6.0 §2.1 contract. Persist-vs-derive, backing, and archive
// retention are policy — declared in present-config.ts (R0), obeyed by the db
// module. Because disk I/O is async, every store function below is now async;
// callers (present-service.ts) await them.
//
// The archive ([R15]): every resolved present is written to the archive, keyed
// (userId, scopeRef, position). Played back in order, the archive is the movie.
// A scrub-back ("show me Tuesday") is an archive LOOKUP ([R16]) — the past
// present is RETRIEVED, not recomputed.
//
// The lens ([R10]): a persistent mass-fraction cutoff, one position per
// (userId, scopeRef). Read at resolve time. Turning the lens does not recompute.
//
// The Window set ([R12]/[R13]): every present() call opens a Window — the one
// tree at one camera/lens/temporal/standpoint setting. Windows accumulate; the
// accumulating set is the session — the look-trail, the multi-region hold, and
// the authorship seam (user windows vs llm windows).
//
// Substrate I/O delegation (reads only — F-present is a non-emitter):
//   threadQuery / iterateAxis — F-memory/R3 substrate-contract -> F-memory/R2.

import type {
  PresentFrame,
  SnapshotArchiveEntry,
  SnapshotArchiveKey,
  GranularityDial,
  Window,
  UserId,
  ScopeRef,
  PositionRef,
  Timestamp,
} from '../config/present-types'

import { DEFAULT_DIAL_CUTOFF } from '../config/present-config'

import {
  storeHeldPresent,
  readHeldPresentRow,
  storeDial,
  readDialRow,
  storeArchiveEntry,
  readArchiveEntryRow,
  listArchivePositionsRow,
  appendWindowRow,
  listWindowRows,
}                              from './present-store-db'

// ── Store (2) — the held live present, per (userId, scopeRef) ─────────────────
// Between invocations F-present holds exactly one live PresentFrame per key
// (PrG7 — held-present discipline). A new resolution supersedes the prior.
// item-1-storage: backed by present_held (disk) via present-store-db.

/**
 * holdPresent — install `frame` as the live held present for its
 * (userId, scopeRef). Last-write-wins: the live present is inherited forward
 * and superseded, never forked. Throws on a store-backing failure.
 */
export async function holdPresent(frame: PresentFrame): Promise<void> {
  const r = await storeHeldPresent(frame)
  if (!r.ok) throw new Error(`[F-present] holdPresent: ${r.error.message}`)
}

/**
 * readHeldPresent — the current live held present for (userId, scopeRef), or
 * null if none has been resolved yet. Pure read; no recompute.
 */
export async function readHeldPresent(userId: UserId, scopeRef: ScopeRef): Promise<PresentFrame | null> {
  const r = await readHeldPresentRow(userId, scopeRef)
  if (!r.ok) throw new Error(`[F-present] readHeldPresent: ${r.error.message}`)
  return r.data
}

// ── Store (3) — the lens (granularity dial), per (userId, scopeRef) ([R10]) ───
// A persistent mass-fraction cutoff. Read at resolve time. NOT a PresentIntent
// field. Turning the lens does not recompute.
// item-1-storage: backed by present_dial (disk) via present-store-db.

/** The default lens cutoff when a (userId, scopeRef) has not set one. */
const DEFAULT_DIAL: GranularityDial = {
  cutoff:    DEFAULT_DIAL_CUTOFF,   // present-config.ts — the default mass-fraction cutoff
  setBy:     'user',
  updatedAt: 0,
}

/**
 * readDial — the lens dial for (userId, scopeRef). Returns the default when
 * none has been set. Pure read.
 */
export async function readDial(userId: UserId, scopeRef: ScopeRef): Promise<GranularityDial> {
  const r = await readDialRow(userId, scopeRef)
  if (!r.ok) throw new Error(`[F-present] readDial: ${r.error.message}`)
  return r.data ?? DEFAULT_DIAL
}

/**
 * setDial — persist a new lens-dial position for (userId, scopeRef).
 * Customizable by the user and the LLM ([R10]). Does NOT trigger a recompute.
 */
export async function setDial(userId: UserId, scopeRef: ScopeRef, dial: GranularityDial): Promise<void> {
  const r = await storeDial(userId, scopeRef, dial)
  if (!r.ok) throw new Error(`[F-present] setDial: ${r.error.message}`)
}

// ── Store (4) — the per-user present archive ([R15]) ──────────────────────────
// Every resolved present is archived here as a SnapshotArchiveEntry, keyed
// (userId, scopeRef, position). F-present's own store in the LIV database —
// NOT the substrate. Played back in order, the archive is the movie.
// item-1-storage: backed by present_archive (disk) via present-store-db.

/**
 * archivePresent — write a resolved present to the per-user archive store
 * ([R15]). `position` is the substrate append-index the present was resolved
 * at — the scrub-back lookup key. `archivedAt` is the time of the archival act
 * — supplied by the caller (v6.0: PresentFrame.resolvedAt is deleted, [R11];
 * the archival timestamp is a distinct fact and is passed in). The archived
 * shape is the PresentFrame whole. A write to F-present's OWN store — never
 * the substrate.
 */
export async function archivePresent(
  frame:      PresentFrame,
  position:   PositionRef,
  archivedAt: Timestamp,
): Promise<SnapshotArchiveEntry> {
  const key: SnapshotArchiveKey = {
    userId:   frame.userId,
    scopeRef: frame.scopeRef,
    position,
  }
  const entry: SnapshotArchiveEntry = {
    archiveKey: key,
    present:    frame,
    archivedAt,
  }
  const r = await storeArchiveEntry(entry)
  if (!r.ok) throw new Error(`[F-present] archivePresent: ${r.error.message}`)
  return entry
}

/**
 * lookupArchivedPresent — the scrub-back read ([R16]). Retrieves the archived
 * present at (userId, scopeRef, position). Returns null when none was archived
 * at that position. A LOOKUP — the retrieved present is the present as it was
 * actually resolved then, NOT a recompute.
 */
export async function lookupArchivedPresent(
  userId:   UserId,
  scopeRef: ScopeRef,
  position: PositionRef,
): Promise<PresentFrame | null> {
  const r = await readArchiveEntryRow(userId, scopeRef, position)
  if (!r.ok) throw new Error(`[F-present] lookupArchivedPresent: ${r.error.message}`)
  return r.data ? r.data.present : null
}

/**
 * listArchivedPositions — the positions at which presents are archived for
 * (userId, scopeRef), ascending. Played in order, these are the movie's frames.
 */
export async function listArchivedPositions(userId: UserId, scopeRef: ScopeRef): Promise<PositionRef[]> {
  const r = await listArchivePositionsRow(userId, scopeRef)
  if (!r.ok) throw new Error(`[F-present] listArchivedPositions: ${r.error.message}`)
  return r.data
}

// ── Store (5) — the accumulating Window set ([R12]/[R13]) ─────────────────────
// Every present() call opens a Window. Windows ACCUMULATE — they do not replace
// ([R12]). The accumulating set is the session: the look-trail, the multi-
// region hold, and the authorship seam (Window.openedBy — user vs llm).
// item-1-storage: backed by present_window (disk) via present-store-db.

/**
 * appendWindow — record a newly opened Window in the accumulating set for
 * (userId, scopeRef) ([R12]). The window is APPENDED — never replacing a prior
 * one; looking somewhere else adds a window, it does not destroy the last look.
 */
export async function appendWindow(userId: UserId, scopeRef: ScopeRef, window: Window): Promise<void> {
  const r = await appendWindowRow(userId, scopeRef, window)
  if (!r.ok) throw new Error(`[F-present] appendWindow: ${r.error.message}`)
}

/**
 * listWindows — the accumulated Window set for (userId, scopeRef), in the order
 * opened. This is the session — the look-trail. Pure read.
 */
export async function listWindows(userId: UserId, scopeRef: ScopeRef): Promise<Window[]> {
  const r = await listWindowRows(userId, scopeRef)
  if (!r.ok) throw new Error(`[F-present] listWindows: ${r.error.message}`)
  return r.data
}
