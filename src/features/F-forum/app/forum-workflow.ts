// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-forum/R2]
// Built with LIV · livai.dev
// [F-forum/app/forum-workflow.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    forum-is-reference: postToForum / replyToForum / ForumWritePort (and the admitWriteRaw
//             default) are GONE — the forum no longer authors a substrate write of its own. The ONE
//             write-orchestration is publishToForum, which AUTHORS NOTHING ITSELF: it calls the
//             injected compose port (default = recordWireTurn, bound at R3) with scope = PUBLIC_SCOPE
//             (also supplied at R3). This layer holds the two-phase shape + the DI seam; it value-
//             imports nothing (the substrate/compose graph stays out — DI per the repo's test idiom).
// slice:      F-forum
// layer:      R2
// wires-in:
//   W-ATOM  WireTurnInput / WireTurnIdentity / WireTurnOutcome  @/features/F-present/contract/present-contract  (type-only — the compose port's shape)
//   W-ATOM  PerimeterSession  @/features/F-identity/contract/perimeter-consultation  (author = a slice of the session)
//   W-ATOM  Coord             @/core/types/substrate-raw.types  (TYPE-ONLY — the draft's required target)
//   W-FN    decidePublish     ../domain/forum-logic
//   W-FN    buildForumRef     ../domain/forum-logic  (the ref handle prepended as leading content)
//   W-ATOM  PublishDecision   ../domain/forum-logic
// wires-out:
//   W-FN    publishToForum    →  F-forum/R3 forum-contract
//   W-ATOM  PublishAuthority / ForumDraft / ForumComposePort / PublishOutcome  →  F-forum/R3 forum-contract (+ tests)
// deps:
//   R3  @/features/F-present/contract/present-contract  (TYPE-ONLY — the compose port's signature;
//        the live recordWireTurn is bound once at R3, never value-imported here, so this module loads
//        without dragging the cognition graph in — DI, mirroring F-inbox's SubstratePort)
//   R3  @/features/F-identity/contract/perimeter-consultation  (TYPE-ONLY — the author slice)
//   R5  @/core/types/substrate-raw.types  (TYPE-ONLY — Coord, the required target)
//   R1  ../domain/forum-logic
// validated:  pending

// publishToForum — the forum's ONLY write-orchestration. It AUTHORS NOTHING: publishing is the
// NORMAL marked compose stamped source_scope='public'. Phase one (confirmed falsy) surfaces the
// wearer confirm and writes nothing; phase two (confirmed true) hands the draft to the injected
// compose port stamped with the PUBLIC scope, and returns the port's WireTurnOutcome unchanged. The
// marking is identical to the connection-scope compose — the forum changes NOTHING about it; it
// differs ONLY by the stamped scope.

import type { WireTurnInput, WireTurnIdentity, WireTurnOutcome } from '@/features/F-present/contract/present-contract'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import type { Coord } from '@/core/types/substrate-raw.types'
import { decidePublish, buildForumRef } from '../domain/forum-logic'

// The author authority — a SLICE of the perimeter session (PA-I: resolved once at the perimeter,
// carried, never re-derived here). userId is the wearer's own substrate (an agent cannot publish to
// another wearer's id); grantKey is the perimeter-resolved write authority the compose's gate reads.
// scope is NOT here — publish stamps the PUBLIC scope (supplied at R3), never the connection scope.
export type PublishAuthority = Pick<PerimeterSession, 'userId' | 'grantKey'>

// The draft = the wire's marked-compose payload (the four cognition-turn fields) PLUS the REQUIRED
// forum target — the Coord of the forum payload this one points at (its reply parent, or FORUM_ROOT
// for a top post). The four body fields ride through untouched (recordWireTurn is the SOLE shape
// validator); `target` never reaches the compose port — it is consumed HERE, encoded to the ref
// handle prepended ahead of the body, so the network is readable from gather(public) alone.
export type ForumDraft = WireTurnInput & { target: Coord }

// The compose PORT — recordWireTurn's exact call shape (input + identity → outcome). The DI seam
// (default real bound at R3, tests inject a spy) EXACTLY like F-inbox's SubstratePort: this layer
// type-imports the signature only; the live binding never crosses into R2. Publish differs from the
// connection-scope compose ONLY by the scope stamped into the identity — the marking is unchanged.
export type ForumComposePort = (
  input:    WireTurnInput,
  identity: WireTurnIdentity,
) => Promise<WireTurnOutcome>

// The phase-one carrier — the verbatim confirm text the driver surfaces to the wearer. Phase two
// returns the compose port's WireTurnOutcome straight through (present | degraded | locked |
// invalid-testimony — the SAME shapes the connection-scope compose returns).
export type PublishOutcome =
  | { kind: 'confirm-required'; payload: string }
  | WireTurnOutcome

// publishToForum — two phases, one DI seam. `publicScope` (the one reserved value) and `compose`
// (the live recordWireTurn) are INJECTED from R3 — this layer binds neither, so it value-imports
// nothing from the substrate/cognition graph (mirroring F-inbox's injected SubstratePort). Phase one
// writes nothing; phase two stamps `publicScope` into the identity and returns the port's outcome.
export async function publishToForum(
  authority:   PublishAuthority,
  draft:       ForumDraft,
  confirmed:   boolean | undefined,
  publicScope: string,
  compose:     ForumComposePort,
): Promise<PublishOutcome> {
  const decision = decidePublish(draft, confirmed)
  if (decision.kind === 'needs-confirm') {
    return { kind: 'confirm-required', payload: decision.payload }
  }
  // phase two — the NORMAL marked compose, stamped PUBLIC. userId/grantKey are the perimeter-sliced
  // author; scope is the injected PUBLIC scope (vs the connection scope a normal compose stamps). The
  // required target is encoded to a ref handle and PREPENDED as the payload's leading content, so
  // recordWireTurn composes [ref-handle-cell, ...body] as one public marked turn (forum-blind — the
  // handle is just content it cuts). The body's marking is unchanged: replyMarks/priorMarks name
  // spans BY SURFACE and the handle is a single opaque word-cell, colliding with no named body span.
  return compose(withRefPrepended(decision.draft), {
    userId:   authority.userId,
    scope:    publicScope,
    grantKey: authority.grantKey,
  })
}

// Prepend the target's ref handle ahead of the body, returning the four-field WireTurnInput the
// compose port takes (target consumed — it is not a compose field). The reply is `unknown` at this
// core (the door sheds shape-validation); a non-string body absorbs to empty, so the ref still leads
// on its own. A single space separates the handle cell from the first body cell.
function withRefPrepended(draft: ForumDraft): WireTurnInput {
  const handle = buildForumRef(draft.target)
  const body = typeof draft.reply === 'string' ? draft.reply : ''
  const reply = body.length > 0 ? `${handle} ${body}` : handle
  return { wearerText: draft.wearerText, reply, replyMarks: draft.replyMarks, priorMarks: draft.priorMarks }
}
