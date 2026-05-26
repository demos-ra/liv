// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/present-service.ts]
// Sprint 2 — Shot 5; present-rederive — Shot 3; sprint-b3-present-build (v3.0);
//   b3-v4-reconciliation (v4.0: non-emitter); sprint-b3-present-v5 (v5.0:
//   hold + archive; scrub-back lookup); sprint-b3-present-v6 — Shots 1-7
//   (tree of stacks; the three controls; every action opens a Window);
//   item-1-storage (the store functions are now async — durable disk backing;
//   six call sites await: readDial / lookupArchivedPresent / appendWindow x2 /
//   holdPresent / archivePresent);
//   sprint-beta-shot-2 (Item-2 Part A: four R2 navigation orchestration
//     wrappers — navigateSetDial / navigateReadDial / navigateListWindows /
//     navigateScrubBack — each the R2 leg of the slice's R3→R2→R4 route path,
//     wrapping an existing v6.0 R4 exec primitive; no new exec, no new
//     capability. listArchivedPositions / appendWindow deliberately not
//     wrapped — no enumeration surface, no consumer-driven window append.)
//
// R2 — Orchestration layer. Composes PR1→PR8 per Present Standard v6.0 §3.7.
//
// PR1  validateIntent  — J-intent-binding (C1 standpoint, C2 camera, C3 temporal)
// PR2  authorizeIntent — PS handshake mechanics (userId + scopeRef presence)
// PR3  deriveAnchor    — the CAMERA: a CameraTrace, derived on the user path or
//                        set on an LLM look ([R9])
// PR4  dispatchRead    — the LIVE-RESOLVE substrate read, dispatched on camera
//                        mode; SCRUB-BACK ([R16]) routed to the archive first
// PR5  composeView     — the dependency walk: the present is a TREE OF STACKS
//                        ([R3]/[R4]); the granularity cutoff bounds extent ([R20])
// PR6  hold + archive  — install the present as the held live present, archive
//                        it, AND open a Window ([R12]) — windows accumulate
// PR7  runGates        — PrG1,2,4,5,6,7,8 runtime audit harness
// PR8  deliverView     — project the structure-carrying PresentView ([R19]) +
//                        ViewBound enforce
//
// v6.0 (sprint-b3-present-v6, §16 + §16-REF):
//   - The present is one connected TREE OF STACKS ([R3]/[R4]): composeView
//     resolves each node and edge as a stack; the service holds and projects it.
//   - EVERY ACTION OPENS A WINDOW ([R12]): each present() call — live resolve
//     OR scrub-back — opens a Window (the one tree at one camera/lens/temporal/
//     standpoint setting) and appends it to the accumulating window set. The
//     window's openedBy is the authorship seam ([R14]).
//   - The CAMERA ([R9]): PR3 resolves a CameraTrace; on the derived path PR4
//     crystallizes the anchor; on the set path it is the LLM-located identity.
//   - SCRUB-BACK ([R16]): a non-null standpoint routes to lookupArchivedPresent;
//     PR4/PR5 are skipped — the archived present is retrieved, not recomputed.
//   - resolvedAt is DELETED ([R11]) — standpoint + frameId position a present.
//     archivedAt (the archival act's time) is stamped at PR6 and passed in.
//   - F-present is a non-emitter ([R1]): no substrate write anywhere.

import { validateIntent }  from '../domain/validate-intent'
import { authorizeIntent } from '../domain/authorize-intent'
import { deriveAnchor }    from '../domain/derive-anchor'
import { dispatchRead }    from '../domain/dispatch-read'
import { composeView }     from '../domain/compose-view'
import { runGates }        from '../domain/run-gates'
import { deliverView }     from '../domain/deliver-view'
import {
  holdPresent,
  archivePresent,
  lookupArchivedPresent,
  readDial,
  setDial,
  appendWindow,
  listWindows,
}                          from '../exec/present-execution'
import { generateId }      from '@/core/types/primitives'

import type {
  PresentIntent,
  PresentView,
  PresentFrame,
  Window,
  ViewIdRef,
  FrameIdRef,
  WindowRef,
  PositionRef,
  GranularityDial,
  UserId,
  ScopeRef,
} from '../config/present-types'
import type { PresentResult } from '../config/present-errors'

export async function presentService(intent: PresentIntent): Promise<PresentResult<PresentView>> {

  // PR1 — J-intent-binding.
  const v1 = validateIntent(intent)
  if (!v1.ok) return v1

  // PR2 — PS handshake.
  const v2 = authorizeIntent(v1.data)
  if (!v2.ok) return v2

  // The lens (granularity dial) — read from stored state; needed for the live
  // resolve AND to stamp the Window every action opens.
  const dial: GranularityDial = await readDial(v2.data.userId, v2.data.scopeRef)

  // ── SCRUB-BACK ROUTING ([R16]) — checked before PR3/PR4 ───────────────────
  // A non-null standpoint is a past position: retrieve the archived present
  // from the per-user store and project it. The live-resolve path (PR3-PR6) is
  // skipped — scrub-back is a LOOKUP, not a recompute.
  if (v2.data.standpoint !== null) {
    const archived = await lookupArchivedPresent(
      v2.data.userId,
      v2.data.scopeRef,
      v2.data.standpoint,
    )
    if (archived === null) {
      return {
        ok: false,
        error: {
          code:    'PRESENT_READ_FAILED',
          message: `no archived present at position ${v2.data.standpoint as unknown as number} for this scope ([R16] archive lookup)`,
        },
      }
    }
    // A scrub-back is still an action — it opens a Window ([R12]).
    const window = openWindow(v2.data, dial)
    await appendWindow(v2.data.userId, v2.data.scopeRef, window)
    return projectAndDeliver(archived, v2.data, window.windowId)
  }

  // ── LIVE RESOLVE — PR3 onward ─────────────────────────────────────────────

  // PR3 — the camera: a CameraTrace ([R9]).
  const cameraTrace = deriveAnchor(v2.data)

  // PR4 — the live-resolve substrate read, dispatched on camera mode.
  const r4 = await dispatchRead(v2.data, cameraTrace)
  if (!r4.ok) return r4

  const frameId = generateId('frame') as unknown as FrameIdRef

  // PR5 — the dependency walk: the present is a tree of stacks ([R3]/[R4]),
  // bounded by the granularity cutoff ([R20]).
  const composed = composeView({
    records: r4.data.records,
    camera:  r4.data.crystallizedCamera,
    dial,
    bound:   v2.data.bound,
  })

  // PR6 — resolve the PresentFrame, HOLD it, ARCHIVE it, and open a Window.
  // No substrate write — F-present is a non-emitter ([R1]).
  const frame: PresentFrame = {
    frameId,
    userId:     v2.data.userId,
    scopeRef:   v2.data.scopeRef,
    standpoint: v2.data.standpoint,             // v6.0: no resolvedAt ([R11])
    root:       composed.frameRoot,
    nodes:      composed.frameNodes,
    edges:      composed.frameEdges,
    weighting:  composed.weightingTrace,
    provenance: {
      sourceStateChangeIds: r4.data.records.map(r => r.id),
      readPrimitivesUsed:   r4.data.traces,
      cameraDerived:        r4.data.crystallizedCamera,
    },
  }
  await holdPresent(frame)

  // The archive key's position is the substrate append-index this present was
  // resolved at — the live edge (the head position; 0 when no records read).
  const livePosition = (r4.data.records.length as unknown) as PositionRef
  await archivePresent(frame, livePosition, Date.now())   // archivedAt = the archival act's time

  // Every action opens a Window ([R12]) — append it to the accumulating set.
  const window = openWindow(v2.data, dial)
  await appendWindow(v2.data.userId, v2.data.scopeRef, window)

  // PR7 + PR8 — project, gate, deliver.
  return projectAndDeliver(frame, v2.data, window.windowId)
}

// ── R2 navigation orchestration — sprint-beta-shot-2 (Item-2 Part A) ──────────
// The navigation operations exposed at the R3 boundary (present-trpc.ts). Each
// is the slice's standard R3→R2→R4 path — the R3 route calls one of these R2
// functions, which awaits an existing v6.0 R4 exec primitive. No new exec
// function, no new capability: these are pass-throughs that wrap an exec call
// (or, for scrubBack, the existing presentService scrub-back path) into a
// PresentResult, exactly as `read` wraps presentService.
//
// Scope (brief Item-2 Part A): these are NAVIGATION primitives — a consumer
// moving through its OWN live present (change the lens, read the lens, list its
// look-trail, scrub to a past position it already knows). They are NOT a
// bulk-extraction surface. `listArchivedPositions` (the archive ENUMERATION
// primitive) and `appendWindow` (an internal effect of present()) are
// deliberately NOT exposed — without an enumeration route there is no
// iterate-then-dump surface; the present-archive is not exportable ([R15] is
// F-present's own store, present-data export is granted to no channel).

/**
 * navigateSetDial — persist a new lens (granularity) position for
 * (userId, scopeRef). Wraps the R4 setDial exec primitive ([R10]). Does NOT
 * recompute the held present — turning the lens is a stored-state change.
 */
export async function navigateSetDial(
  userId:   UserId,
  scopeRef: ScopeRef,
  dial:     GranularityDial,
): Promise<PresentResult<{ ok: true }>> {
  try {
    await setDial(userId, scopeRef, dial)
    return { ok: true, data: { ok: true } }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:       'PRESENT_READ_FAILED',
        message:    `navigateSetDial: ${err instanceof Error ? err.message : 'dial store failed'}`,
        underlying: err,
      },
    }
  }
}

/**
 * navigateReadDial — the current lens (granularity dial) for (userId, scopeRef).
 * Wraps the R4 readDial exec primitive ([R10]); returns the default dial when
 * none has been set. Pure read.
 */
export async function navigateReadDial(
  userId:   UserId,
  scopeRef: ScopeRef,
): Promise<PresentResult<GranularityDial>> {
  try {
    const dial = await readDial(userId, scopeRef)
    return { ok: true, data: dial }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:       'PRESENT_READ_FAILED',
        message:    `navigateReadDial: ${err instanceof Error ? err.message : 'dial read failed'}`,
        underlying: err,
      },
    }
  }
}

/**
 * navigateListWindows — the accumulated Window set for (userId, scopeRef), in
 * the order opened — the session's look-trail ([R12]/[R13]). Wraps the R4
 * listWindows exec primitive. Pure read. `appendWindow` is NOT exposed: a
 * Window is opened by present() itself (PR6), never by a direct consumer call.
 */
export async function navigateListWindows(
  userId:   UserId,
  scopeRef: ScopeRef,
): Promise<PresentResult<Window[]>> {
  try {
    const windows = await listWindows(userId, scopeRef)
    return { ok: true, data: windows }
  } catch (err) {
    return {
      ok: false,
      error: {
        code:       'PRESENT_READ_FAILED',
        message:    `navigateListWindows: ${err instanceof Error ? err.message : 'window list failed'}`,
        underlying: err,
      },
    }
  }
}

/**
 * navigateScrubBack — resolve the present as it was at a past position
 * ([R16]). Scrub-back IS a present() call with a non-null standpoint: this
 * builds the PresentIntent and delegates to presentService, which routes a
 * non-null standpoint to the archive lookup, opens a Window for the action,
 * gates, and projects. No new path — it reuses presentService's existing
 * scrub-back routing. The camera is 'derived' (the consumer is navigating its
 * own present, not the LLM placing a look) and temporal is 'surface' (a still
 * at that position). `position` is a standpoint the consumer already holds —
 * from a prior PresentView; this is interactive navigation, not enumeration.
 */
export async function navigateScrubBack(
  userId:      UserId,
  scopeRef:    ScopeRef,
  consumerRef: string,
  position:    PositionRef,
  bound:       PresentIntent['bound'],
): Promise<PresentResult<PresentView>> {
  const intent: PresentIntent = {
    intentId:    generateId('intent') as unknown as PresentIntent['intentId'],
    consumerRef: consumerRef as unknown as PresentIntent['consumerRef'],
    userId,
    scopeRef,
    camera:      { mode: 'derived' },
    temporal:    { depth: 'surface' },
    standpoint:  position,
    bound,
    provenance: {
      consumerSlice: consumerRef as unknown as PresentIntent['provenance']['consumerSlice'],
      stampedAt:     Date.now(),
    },
  }
  return presentService(intent)
}

// ── openWindow — the unit every present() call yields ([R12]/[R13]) ───────────
// A window is the one tree at one camera/lens/temporal/standpoint setting.
// openedBy is the authorship seam: a 'set' camera is an LLM-initiated look, a
// 'derived' camera is the user-driven path ([R9]/[R14]).
function openWindow(intent: PresentIntent, dial: GranularityDial): Window {
  return {
    windowId:   generateId('window') as unknown as WindowRef,
    openedBy:   intent.camera.mode === 'set' ? 'llm' : 'user',
    camera:     intent.camera,
    lensCutoff: dial.cutoff,
    temporal:   intent.temporal,
    standpoint: intent.standpoint,
    openedAt:   Date.now(),
  }
}

// ── projectAndDeliver — PR8 projection + PR7 gates + PR8 ViewBound deliver ────
// Shared by the live-resolve path and the scrub-back path: both project a
// PresentView from a PresentFrame, run the gate harness, and deliver with
// ViewBound enforcement. The PresentView carries the WindowRef of the window
// this action opened ([R12]).

async function projectAndDeliver(
  frame:    PresentFrame,
  intent:   PresentIntent,
  windowId: WindowRef,
): Promise<PresentResult<PresentView>> {
  const viewId = generateId('view') as unknown as ViewIdRef

  // PR8 — project the structure-carrying PresentView FROM the frame ([R19]).
  // The frame already carries the resolved tree of stacks (compose-view built
  // it); projection re-shapes nodes/edges into the consumer-renderable atom
  // without losing the stacks, the connectivity, or authorship.
  const view: PresentView = {
    viewId,
    projectedFromFrame: frame.frameId,
    derivedFromIntent:  intent,
    window:             windowId,                // v6.0 ([R12]) — the window this projection is
    emittedAt:          Date.now(),
    composition:        projectComposition(frame),
    provenance: {
      sourceStateChangeIds: frame.provenance.sourceStateChangeIds,
      readPrimitivesUsed:   frame.provenance.readPrimitivesUsed,
      cameraDerived:        frame.provenance.cameraDerived,
      weightingApplied:     frame.weighting,
    },
    reversibility: {
      appealCourtIs:    'substrate-state-change-table',
      replayDiscipline: 'invoke F-present with same PresentIntent -> equivalent PresentFrame and PresentView per PrA8',
    },
  }

  // PR7 — runtime audit harness (read-side only; F-present is a non-emitter).
  const gates = runGates({
    intent,
    view,
    readsLog: frame.provenance.readPrimitivesUsed,
  })

  if (!gates.overall) {
    const failed = gates.gates.find(g => !g.pass)
    return {
      ok: false,
      error: {
        code:       'PRESENT_GATE_FAILED',
        failedGate: failed!.id as 'PrG1' | 'PrG2' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8',
        message:    failed!.detail ?? `gate ${failed!.id} failed`,
      },
    }
  }

  // PR8 (cont.) — ViewBound enforcement + consumer return.
  return deliverView({ view, intent })
}

// ── projectComposition — the structure-carrying projection ([R19]/[R20]) ──────
// Projects the frame's FrameNode[]/FrameEdge[] (each stack-carrying) into the
// PresentView composition: ViewNode[] carrying the node's stack + parent +
// children, ViewEdge[] carrying the edge's stack, root + camera refs, and
// extent='granularity-cutoff' ([R20]). The stacks carry authorship ([R14]) —
// they are copied through, never flattened.

function projectComposition(frame: PresentFrame): PresentView['composition'] {
  const parentOf   = new Map<string, string>()
  const childrenOf = new Map<string, string[]>()
  for (const e of frame.edges) {
    const p = e.parent as string
    const c = e.child as string
    parentOf.set(c, p)
    const list = childrenOf.get(p) ?? []
    list.push(c)
    childrenOf.set(p, list)
  }

  const nodes = frame.nodes.map(fn => {
    const id = fn.identity as string
    const parent = parentOf.get(id)
    return {
      identity:         fn.identity,
      stack:            fn.stack,                // the node's stack — carries authorship ([R14])
      substituteValues: fn.substituteValues,
      weight:           fn.weight,
      parent:           parent !== undefined
        ? ((parent as unknown) as PresentView['composition']['nodes'][number]['parent'])
        : null,
      children:         (childrenOf.get(id) ?? []).map(
        c => (c as unknown) as PresentView['composition']['nodes'][number]['children'][number],
      ),
      sourceCount:      fn.sourceCount,
    }
  })

  const edges = frame.edges.map(fe => ({
    parent:       fe.parent,
    child:        fe.child,
    relationType: fe.relationType,
    stack:        fe.stack,                      // the edge's stack — symmetric with node-stack ([R5])
    thickness:    fe.thickness,
  }))

  // the camera ref — the centred identity. The CameraTrace carries the anchor;
  // it falls back to the root when the trace anchor is empty.
  const cameraAnchor = frame.provenance.cameraDerived.anchor
  const cameraRef = ((cameraAnchor && (cameraAnchor as string).length > 0)
    ? cameraAnchor
    : frame.root) as unknown as PresentView['composition']['camera']

  return {
    nodes,
    edges,
    root:   frame.root,
    camera: cameraRef,
    extent: 'granularity-cutoff',
  }
}
