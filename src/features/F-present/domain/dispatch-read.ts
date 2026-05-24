// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/dispatch-read.ts]
// Sprint 2 — Shot 2; present-rederive — Shot 3; sprint-b3-present-build (v3.0);
//   b3-v4-reconciliation (v4.0); sprint-b3-present-v5 (v5.0: full-tree read);
//   sprint-b3-present-v6 — Shot 3/7 (camera modes) + Shot 1 (stack-bearing reads)
//
// PR4 — the LIVE-RESOLVE substrate read, per Present Standard v6.0 §3.7, [R9].
//
// v6.0 re-derivation:
//   Shot 3/7 ([R9]): PR4 dispatches on the CAMERA mode (CameraTrace), not on a
//     null zoomAnchor.
//       DERIVED — the camera anchor was seeded empty at PR3; PR4 reads the
//         user's latest state-change (iterateAxis backward, count 1), takes its
//         identity set as the anchor candidates, and CRYSTALLIZES the highest-
//         mass identity as the camera anchor.
//       SET — the camera anchor is already the LLM-located identity (CameraTrace
//         from PR3); PR4 skips the latest-state-change read and goes straight to
//         the identity-recurrence read on that anchor.
//   Shot 1 ([R4]): the records PR4 reads carry, per identity and per relation,
//     the full sequence of state-changes about that carrier — the carrier's
//     STACK. The stack is the substrate records about a carrier returned by the
//     existing LMA9 thread primitives; PR4 introduces no new read primitive.
//     compose-view (PR5) assembles each node-stack and edge-stack from these.
//
//   SCRUB-BACK ([R16]): a non-null standpoint is NOT handled here — it is an
//     archive lookup, routed in present-service.ts before PR4. dispatchRead is
//     the live-resolve path only; it asserts standpoint === null.
//
// ContentClass: anchor-candidate reads pass contentClass 'wearer-life' — a
//   READ-SIDE filter on what emitting programs declared (LMA13). F-present
//   declares no ContentClass — it is a non-emitter ([R1]).
//
// One ReadPrimitiveTrace is emitted per primitive invocation per §2.1.

import { threadQuery, iterateAxis } from '@/features/F-memory/contract/substrate-contract'

import type {
  StateChangeRecord,
  IdentityRef,
  ContentClass,
  ThreadQueryInput,
} from '@/core/types/substrate.types'

import type {
  PresentIntent,
  CameraTrace,
  ReadPrimitiveTrace,
} from '../config/present-types'

import type { PresentResult } from '../config/present-errors'

// ── Return shape ──────────────────────────────────────────────────────────────

export type DispatchReadResult = {
  records:           StateChangeRecord[]
  traces:            ReadPrimitiveTrace[]
  crystallizedCamera: CameraTrace
}

// ── Main dispatch — the LIVE-RESOLVE read path ────────────────────────────────

export async function dispatchRead(
  intent: PresentIntent,
  camera: CameraTrace,
): Promise<PresentResult<DispatchReadResult>> {
  // Scrub-back ([R16]) is an archive lookup, routed before PR4. dispatchRead is
  // the live-resolve path only.
  if (intent.standpoint !== null) {
    return {
      ok: false,
      error: {
        code:    'PRESENT_READ_FAILED',
        message: 'dispatchRead is the live-resolve path; a non-null standpoint must be routed to the archive lookup before PR4',
      },
    }
  }

  const traces: ReadPrimitiveTrace[] = []

  // ── Resolve the camera anchor identity ────────────────────────────────────
  // SET ([R9]): the camera anchor is the LLM-located identity, already set at
  //   PR3. DERIVED ([R9]): read the user's latest state-change and crystallize
  //   the highest-mass identity.
  let anchorIdentity: IdentityRef
  let crystallizedCamera: CameraTrace

  if (camera.mode === 'set') {
    // Set path — the camera anchor is the LLM's located identity.
    anchorIdentity     = camera.anchor
    crystallizedCamera = camera
  } else {
    // Derived path — derive the camera anchor from the user's latest state-change.
    const latest = await iterateAxis(
      // start at the live edge; iterateAxis backward count 1 returns the most
      // recent state-change.
      Number.MAX_SAFE_INTEGER as unknown as number & { readonly _brand: 'PositionRef' },
      'backward',
      1,
    )
    if (!latest.ok) {
      return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: latest.error.message, underlying: latest.error } }
    }
    traces.push({
      primitive:   'iterate-axis',
      parameters:  { direction: 'backward', count: 1, purpose: 'camera derivation — the latest state-change ([R9])' },
      recordCount: latest.data.length,
    })

    const latestRecord: StateChangeRecord | undefined = latest.data[0]
    if (latestRecord === undefined || latestRecord.content.identities.length === 0) {
      // No state-change yet, or it touches no identity: the camera anchor is the
      // user seed and the present is the root with zero children — a
      // determinate terminal case (the density-on-empty terminal case, carried).
      const seed = intent.userId as unknown as IdentityRef
      return {
        ok: true,
        data: {
          records:            [],
          traces,
          crystallizedCamera: { mode: 'derived', anchor: seed },
        },
      }
    }

    // The latest state-change's identity set is the anchor-candidate set.
    // Crystallize the highest-mass identity among them ([R9]).
    anchorIdentity = await crystallizeAnchorFromCandidates(
      latestRecord.content.identities,
      intent,
      traces,
    )
    crystallizedCamera = {
      mode:        'derived',
      anchor:      anchorIdentity,
      derivedFrom: latestRecord.id,
    }
  }

  // ── Read the relationally-significant tree around the camera anchor ───────
  // identity-recurrence on the anchor gives the anchor's thread; the records it
  // returns carry the co-uttered identities and relations — and the full
  // sequence of state-changes about each carrier (the carrier's STACK, [R4]) —
  // from which compose-view (PR5) assembles the tree of stacks. The walk depth
  // is bounded by the granularity cutoff (compose-view), not a one-level hop.
  const treeQuery: ThreadQueryInput = {
    threadKind:   'identity-recurrence',
    anchor:       anchorIdentity,
    scope:        intent.scopeRef,
    contentClass: 'wearer-life' as ContentClass,
    limit:        intent.bound.maxNodes,
  }
  const treeResult = await threadQuery(treeQuery, intent.userId)
  if (!treeResult.ok) {
    return { ok: false, error: { code: 'PRESENT_READ_FAILED', message: treeResult.error.message, underlying: treeResult.error } }
  }
  traces.push({
    primitive:          'identity-recurrence',
    parameters:         { userId: intent.userId, anchor: anchorIdentity, scope: intent.scopeRef, limit: intent.bound.maxNodes },
    recordCount:        treeResult.data.records.length,
    contentClassFilter: 'wearer-life' as ContentClass,
  })

  return {
    ok: true,
    data: {
      records:            treeResult.data.records,
      traces,
      crystallizedCamera,
    },
  }
}

// ── Anchor crystallization ([R9]) ─────────────────────────────────────────────
// The latest state-change may touch several identities. The camera anchor is
// the highest-mass cluster among them at its main value. Mass here is read as
// identity recurrence: an identity-recurrence read on each candidate gives its
// thread length — the candidate with the densest thread is the anchor. On a
// single candidate, that candidate is the anchor with no extra read.

async function crystallizeAnchorFromCandidates(
  candidates: IdentityRef[],
  intent:     PresentIntent,
  traces:     ReadPrimitiveTrace[],
): Promise<IdentityRef> {
  if (candidates.length === 1) return candidates[0]

  let best: IdentityRef = candidates[0]
  let bestMass = -1

  for (const candidate of candidates) {
    const q: ThreadQueryInput = {
      threadKind:   'identity-recurrence',
      anchor:       candidate,
      scope:        intent.scopeRef,
      contentClass: 'wearer-life' as ContentClass,
      limit:        intent.bound.maxNodes,
    }
    const r = await threadQuery(q, intent.userId)
    const mass = r.ok ? r.data.records.length : 0
    traces.push({
      primitive:          'identity-recurrence',
      parameters:         { userId: intent.userId, anchor: candidate, scope: intent.scopeRef, purpose: 'camera-anchor mass crystallization ([R9])' },
      recordCount:        mass,
      contentClassFilter: 'wearer-life' as ContentClass,
    })
    if (mass > bestMass) {
      bestMass = mass
      best     = candidate
    }
  }

  return best
}
