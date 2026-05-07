// @liv-standard v1.5.1
// @perimeter-standard v1.0
// [F-identity/R3]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-ATOM    NextRequest                     next/server
//   W-ATOM    ValidatedSession                ../app/auth-workflow
//   W-ATOM    PERIMETER_HEADER_USER_ID        @/core/constants/perimeter-headers
//   W-ATOM    PERIMETER_HEADER_SESSION_ID     @/core/constants/perimeter-headers
// wires-out:
//   W-FN      getPerimeterSession             → all distributed R3 contracts (F-chat, F-la-config, F-output, F-permissions, F-planner, F-project, F-user-profile)
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
} from '@/core/constants/perimeter-headers'

/**
 * Reads the perimeter-validated session from middleware-set request headers.
 *
 * Returns the ValidatedSession if both `x-perimeter-user-id` and
 * `x-perimeter-session-id` headers are present; null otherwise.
 *
 * Per Perimeter Standard v1.0:
 * - PA-A1 (authority validation) was performed at src/middleware.ts before
 *   this header set was applied — null return means perimeter rejected the
 *   crossing or the route is in PUBLIC_PREFIXES.
 * - PA-I (unitary site) preserved: this function does not re-validate; the
 *   perimeter is the sole validation site.
 *
 * Replaces pre-Shot-3 distributed pattern:
 *   const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
 *   if (!token) return null
 *   return validateSession(token)
 *
 * Post-Shot-3 callers do:
 *   const session = getPerimeterSession(req)
 *   if (!session) return NextResponse.json({error:'UNAUTHORIZED'}, {status:401})
 */
export function getPerimeterSession(req: NextRequest): ValidatedSession | null {
  const userId    = req.headers.get(PERIMETER_HEADER_USER_ID)
  const sessionId = req.headers.get(PERIMETER_HEADER_SESSION_ID)

  if (!userId || !sessionId) {
    return null
  }

  return {
    userId,
    sessionId,
  }
}
