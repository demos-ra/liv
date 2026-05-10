// @liv-standard v1.5.1 amended sprint-13-shot-2 sprint-b1-shot-1 sprint-b1-shot-2
// @perimeter-standard v1.0
// [F-identity/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-shot-1 (PerimeterSession extended: resolvedChannel + crossedAt; new header reads)
//             sprint-b1-shot-2 (PerimeterSession extended: resolvedDisposition; PERIMETER_HEADER_DISPOSITION read)
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM    NextRequest                     next/server
//   W-ATOM    ValidatedSession                ../app/auth-workflow
//   W-ATOM    PERIMETER_HEADER_USER_ID        @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_SESSION_ID     @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CHANNEL        @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_CROSSED_AT     @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_DISPOSITION    @/core/constants/perimeter-headers
//   W-ATOM    CHANNEL_KIND_ENUM               @/core/constants/perimeter-standard  (F-1 fix: guarded narrowing)
//   W-ATOM    DISPOSITION_KIND_ENUM           @/core/constants/perimeter-standard  (F-1 fix: guarded narrowing)
//   W-ATOM    ChannelKind                     @/core/types/perimeter-standard.types
//   W-ATOM    DispositionKind                 @/core/types/perimeter-standard.types
// wires-out:
//   W-FN      getPerimeterSession             → all distributed R3 contracts (F-chat, F-verify, F-output, F-permissions, F-plan, F-project, F-user-profile)
//   W-ATOM    PerimeterSession                → all distributed R3 contracts
// validated:  pending
//
// Perimeter consultation surface — Sprint 6 Shot 3 wire-in.
// =========================================================
// Per Perimeter Standard v1.0 §6.9 (Audit query pattern): distributed contracts
// consult the perimeter for already-validated session state via this thin
// header-reader. The header names are owned by src/middleware.ts (the unitary
// perimeter site per Manual §I.4 + PS PA-I).
//
// This file replaces the pre-Shot-3 distributed pattern in which each contract
// imported `validateSession` from F-identity/contract/auth-contract and re-ran
// session validation per route handler. F-005 audit finding closure: distributed
// validation is removed; contracts now read middleware-set headers only.
//
// Discipline:
// - This function MUST NOT call validateSession itself. It is a pure header
//   reader. validateSession is called exactly once per crossing — at the
//   unitary perimeter site (src/middleware.ts).
// - If a request has not passed through middleware (e.g., an internal call
//   bypassing HTTP routing), the headers will be absent and this returns null.
//   That is the correct state — non-routed crossings are not covered by the
//   perimeter at this v1.0 delivery (out-of-scope per Perimeter Standard §1
//   scopeOut: "runtime execution of boundary typing — owned by L4 program;
//   F-identity slice middleware").
// - Contracts that need ValidatedSession-shaped data should consume this
//   function's return value directly. Re-validating is a structural defect
//   (PA-I unitary-site violation).

import type { NextRequest } from 'next/server'
import type { ValidatedSession } from '../app/auth-workflow'
import {
  PERIMETER_HEADER_USER_ID,
  PERIMETER_HEADER_SESSION_ID,
  PERIMETER_HEADER_CHANNEL,
  PERIMETER_HEADER_CROSSED_AT,
  PERIMETER_HEADER_DISPOSITION,
} from '@/core/constants/perimeter-headers'
import { CHANNEL_KIND_ENUM, DISPOSITION_KIND_ENUM } from '@/core/constants/perimeter-standard'
import type { ChannelKind, DispositionKind } from '@/core/types/perimeter-standard.types'

// ─── Guarded narrowing helpers (F-1 fix) ─────────────────────────────────────
// Header values arrive as string | null. Casting directly to ChannelKind /
// DispositionKind is structurally impure — an unknown string bypasses the enum.
// These helpers validate against the declared enum sets before narrowing.
// Unknown values fall through to the caller-supplied default.

function toChannelKind(raw: string | null, fallback: ChannelKind): ChannelKind {
  if (raw && (CHANNEL_KIND_ENUM as readonly string[]).includes(raw)) {
    return raw as ChannelKind
  }
  return fallback
}

function toDispositionKind(raw: string | null, fallback: DispositionKind): DispositionKind {
  if (raw && (DISPOSITION_KIND_ENUM as readonly string[]).includes(raw)) {
    return raw as DispositionKind
  }
  return fallback
}

/**
 * PerimeterSession — extended session surface carrying boundary-stamped fields.
 *
 * sprint-b1-shot-1: resolvedChannel and crossedAt added.
 * sprint-b1-shot-2: resolvedDisposition added. Derived from route classification
 * at the unitary perimeter site; carried downstream so programs know the
 * governance level of their crossing without re-classifying.
 */
export interface PerimeterSession {
  userId:              string
  sessionId:           string
  resolvedChannel:     ChannelKind
  crossedAt:           number
  resolvedDisposition: DispositionKind
}

/**
 * Reads the perimeter-validated session from middleware-set request headers.
 *
 * Returns PerimeterSession if all required perimeter headers are present; null otherwise.
 *
 * Per Perimeter Standard v1.0:
 * - PA-A1 (authority validation) was performed at src/middleware.ts before
 *   this header set was applied — null return means perimeter rejected the
 *   crossing or the route is in PUBLIC_PREFIXES.
 * - PA-I (unitary site) preserved: this function does not re-validate; the
 *   perimeter is the sole validation site.
 *
 * sprint-b1-shot-1:
 *   resolvedChannel: read from PERIMETER_HEADER_CHANNEL; defaults to 'wearer-message' if absent.
 *   crossedAt: read from PERIMETER_HEADER_CROSSED_AT; defaults to 0 if absent.
 * sprint-b1-shot-2:
 *   resolvedDisposition: read from PERIMETER_HEADER_DISPOSITION; defaults to 'act' if absent
 *   (conservative — over-governs rather than under-governs on missing stamp).
 */
export function getPerimeterSession(req: NextRequest): PerimeterSession | null {
  const userId    = req.headers.get(PERIMETER_HEADER_USER_ID)
  const sessionId = req.headers.get(PERIMETER_HEADER_SESSION_ID)

  if (!userId || !sessionId) {
    return null
  }

  const channelRaw     = req.headers.get(PERIMETER_HEADER_CHANNEL)
  const crossedAtRaw   = req.headers.get(PERIMETER_HEADER_CROSSED_AT)
  const dispositionRaw = req.headers.get(PERIMETER_HEADER_DISPOSITION)

  const resolvedChannel: ChannelKind         = toChannelKind(channelRaw, 'wearer-message')
  const crossedAt: number                    = crossedAtRaw ? Number(crossedAtRaw) : 0
  // Default 'act': conservative — over-governs (triggers confirmation/audit) rather than
  // under-governs (skips governance) when stamp is absent.
  const resolvedDisposition: DispositionKind = toDispositionKind(dispositionRaw, 'act')

  return {
    userId,
    sessionId,
    resolvedChannel,
    crossedAt,
    resolvedDisposition,
  }
}
