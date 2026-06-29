// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (M10 — the hook, role-first)
// [F-mcp/R3]
// Built with LIV · livai.dev
// [F-mcp/contract/enforcement-adapter.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    A3 (the hook / enforcement adapter — the in-tree L1 wire contract + L2 lifecycle
//             home; per-turn enforcement fires the wire reliably; the L3 per-client adapter is
//             machine-local — .claude/ + CLAUDE.md — and is NOT a tree artifact)
//             E1 (capture-at-submit, uniform with native): the 'capture-deliver' role now
//             GENUINELY captures — summary at UserPromptSubmit STORES the submitted wearer prompt
//             (the wire's captureWearerTurn → writeRawTurn, native's exact mechanism) AND delivers
//             the present. compose at Stop records the reply against the already-stored wearer turn
//             (wearer:{written}), no wearerText re-carry. The no-lifecycle fallback's
//             AbsentCaptureFlag is the only remaining {text}-at-compose carry (honest, not silent).
// slice:      F-mcp
// category:   Modality
// layer:      R3
// wires-in:
//   W-ATOM  TOOL_PRESENT / TOOL_TURN   ../config/mcp-tools   (the wire ops the lifecycle fires)
// wires-out:
//   W-ATOM  EnforcementEvent           →  the per-client L3 adapter (machine-local) — the lifecycle vocabulary
//   W-ATOM  WireOp                     →  the L3 adapter — the wire op a lifecycle phase fires
//   W-FN    enforcementPlan            →  the L3 adapter — maps a lifecycle event to its wire ops (role-first, M10)
//   W-ATOM  EnforcementBinding         →  the L3 adapter — the per-surface lifecycle binding (which event → which phase)
//   W-FN    voluntaryFallbackBinding   →  the L3 adapter — the no-lifecycle fallback (voluntary compose + a fail flag)
//   W-ATOM  AbsentCaptureFlag          →  the L3 adapter — the honest fail flag (absent capture is flagged, never silent)
// deps:
//   config  ../config/mcp-tools
// validated:  pending
//
// ─────────────────────────────────────────────────────────────────────────────
// A3 — THE HOOK / ENFORCEMENT ADAPTER (M10 — the hook, role-first).
//
// Per-turn enforcement fires the wire RELIABLY, so the memory loop closes every turn
// without the agent having to remember to. The role-first contract (M10): a lifecycle
// PHASE has a ROLE (capture / deliver / write); the adapter binds each role to the wire
// op that performs it. The CLAIM-CODE adapter (the first client) binds:
//
//   UserPromptSubmit  →  capture(M1) + deliver(M2)   — the wearer's words arrive; the prompt is
//                        STORED and the present is delivered as context. (E1: capture is no longer
//                        implicit — summary at submit fires captureWearerTurn, which writeRawTurns
//                        the wearer prompt EXACTLY as native's perimeter pre-write, then delivers
//                        the present. One phase: capture the prompt + set the present in front of
//                        the model before it replies.)
//   Stop              →  write(M7)                    — the agent's turn is complete; the reply +
//                        marks are written via compose AGAINST the already-stored wearer turn
//                        (wearer:{written}) — compose never re-carries the wearer's words (E1).
//
// NOT SessionStart / SessionEnd: enforcement is PER-TURN, not per-session. SessionStart
// would deliver once and capture nothing per turn; SessionEnd would write once at the end,
// losing every intermediate turn. The turn boundary is UserPromptSubmit…Stop — that is the
// unit memory is kept at. (A read-door law consequence too: a SessionStart hook that passed
// its event envelope as tool arguments is exactly the lifecycle baggage the read doors now
// ignore — see tool-registry RD — but binding to it at all is the wrong granularity.)
//
// HOMES (per the spec): the L1 wire contract + the L2 lifecycle home are IN-TREE, here, at
// the wire surface's R3 (F-mcp is the agent-driven surface). The L3 PER-CLIENT adapter is
// machine-local (.claude/ hooks + CLAUDE.md) and is NOT a tree artifact — it is live machine
// config outside framework authority. This unit is the contract that L3 consumes; it imports
// nothing client-specific and performs no I/O (A4 — pure mapping).
//
// SECOND AGENT = ONE NEW ADAPTER, ZERO CORE CHANGE (A7): a second agent-driven client binds
// its own lifecycle vocabulary to these same roles via its own L3 adapter. The wire ops and
// the role mapping (this file) are unchanged; only the per-client EnforcementBinding differs.
// A client with NO lifecycle hooks at all falls back to the voluntary binding below.
// ─────────────────────────────────────────────────────────────────────────────

import { TOOL_PRESENT, TOOL_TURN, TOOL_CAPTURE } from '../config/mcp-tools'

// The wire ops a lifecycle phase can fire. 'capture' at the turn's ENTRY STORES the submitted
// wearer prompt (captureWearerTurn → writeRawTurn, native's exact mechanism) AND delivers the
// present — its OWN submit primitive now (the capture un-weld, 1d), no longer a job riding the
// read. 'compose' at Stop writes the reply + marks against that stored wearer turn. 'summary' (the
// read) stays a WireOp — a lifecycle may deliver a bare present — but it no longer carries capture.
// (capture is dispatchable but NOT advertised in MCP_TOOLS: the hook fires it, the model never
// picks it.)
export type WireOp = typeof TOOL_PRESENT | typeof TOOL_TURN | typeof TOOL_CAPTURE

// The lifecycle ROLES (M10 — role-first). A client's lifecycle event maps to a role; a role maps
// to its wire ops. The role is the stable axis — clients differ in event NAMES, never in roles.
//   - 'capture-deliver' (M1 + M2): the wearer's words arrive — STORED — and the present is
//     delivered as context, before the model replies. (E1, one phase: summary at submit CAPTURES
//     the prompt — captureWearerTurn writeRawTurns it, native's exact mechanism — and the present
//     read is the deliver; they fire together at the turn's open.)
//   - 'write'           (M7): the turn is complete; the reply + both mark sets are written against
//     the already-stored wearer turn (wearer:{written}) — compose never re-carries the words.
export type EnforcementRole = 'capture-deliver' | 'write'

// The role → wire ops mapping (M10, role-first). The ONE place a role's wire ops are named; every
// client adapter derives its firing from this, never hand-listing ops — this is the contract a
// universal, generated hook reads (no per-machine hand-config). capture-deliver fires the dedicated
// capture op (which STORES the wearer prompt then delivers the present — its own submit primitive,
// 1d); write fires the turn record (compose, reply-only).
export function opsForRole(role: EnforcementRole): readonly WireOp[] {
  switch (role) {
    case 'capture-deliver': return [TOOL_CAPTURE]
    case 'write':           return [TOOL_TURN]
  }
}

// A client's lifecycle event, abstracted. The CLAIM-CODE client's concrete events are
// 'UserPromptSubmit' and 'Stop'; the binding (below) maps those to roles. The type is open
// (string) because each client names its own events — the BINDING is what pins them to roles.
export type EnforcementEvent = string

// enforcementPlan — the L3 adapter calls this with the lifecycle event it observed; it returns the
// wire ops to fire (role-first: the binding resolves the event → role, opsForRole resolves the role
// → ops). An unbound event returns [] (the adapter fires nothing — a foreign lifecycle phase is not
// an error, it is simply not a turn boundary). Pure (A4): no I/O, no throw.
export function enforcementPlan(event: EnforcementEvent, binding: EnforcementBinding): readonly WireOp[] {
  const role = binding[event]
  return role ? opsForRole(role) : []
}

// The per-surface lifecycle BINDING (L2 — the lifecycle home): a client's event names mapped to
// roles. The CLAIM-CODE binding is the first; a second agent supplies its own. This is the ONLY
// per-client axis — the role mapping (opsForRole) is shared, so a new client is one new binding.
export type EnforcementBinding = Record<EnforcementEvent, EnforcementRole>

// The CLAIM-CODE adapter binding (the first client; M10 worked example). UserPromptSubmit opens the
// turn (capture + deliver); Stop closes it (write). SessionStart/SessionEnd are deliberately ABSENT
// — per-turn granularity, not per-session (see header).
export const CLAIM_CODE_BINDING: EnforcementBinding = {
  UserPromptSubmit: 'capture-deliver',
  Stop:             'write',
}

// ── No-lifecycle fallback — voluntary compose + a fail flag ─────────────────────────
// A client with NO lifecycle hooks cannot be ENFORCED — it can only be ASKED. It cannot CAPTURE at
// submit (there is no submit hook to fire captureWearerTurn), so it captures at COMPOSE instead:
// the agent calls `compose` (the write op) itself, of its own discipline, carrying the wearer's
// words inline. That drives the wire turn-service's 'compose-fallback' capture mode — the ONLY
// remaining {text}-at-compose carry (the enforced path captures once, at submit). Capture is then
// NOT guaranteed per turn — and that absence is made HONEST by this flag, never hidden. A turn
// recorded under the fallback carries absentCapture:true so the loss of the capture guarantee is
// visible downstream (a degraded-but-named enforcement, not a silent gap). The flag is the A3
// honesty floor AND the wire turn-service's WireCaptureMode discriminant: absent enforcement is
// flagged, never silently dropped. (Shape-identical to F-present's AbsentCaptureFlag — the driver
// hands this straight into recordWireTurn's 'compose-fallback' mode.)
export type AbsentCaptureFlag = { absentCapture: boolean; reason: string }

// The voluntary binding fires the write op on a voluntary 'compose' call and NOTHING on any
// lifecycle event (there are none to bind). The fail flag rides every turn recorded this way.
export function voluntaryFallbackBinding(): { binding: EnforcementBinding; flag: AbsentCaptureFlag } {
  return {
    // No lifecycle events → no enforced firing. The only write is the agent's voluntary compose.
    binding: {},
    flag: {
      absentCapture: true,
      reason: 'no-lifecycle client: capture(M1) is not enforced per turn — compose is voluntary; this turn\'s capture guarantee is absent (flagged, not silent)',
    },
  }
}
