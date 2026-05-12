// @liv-standard v1.3
// [F-permissions/contract/permissions-contract.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R3
// wires-in:
//   W-FN    requirePermission, assignDefaultRole, setMemberRole  F-permissions/R2 (permissions-workflow)
//   W-FN    getPerimeterSession                                   F-identity/R3 (perimeter-consultation)
//   W-ATOM  Action                                                F-permissions/R0 (permissions-config)
// wires-out:
//   W-FN    requirePermission   →  all slices (permission gate)
//   W-FN    assignDefaultRole   →  F-event-system/R2 (event-subscriptions)
//   W-FN    setMemberRole       →  F-event-system/R2 (event-subscriptions)
//   W-FN    withPermission      →  route handlers
//   W-FN    usePermissions      →  client components (re-export from permissions-hook)
// deps:
//   R0  ../config/permissions-config
//   R2  ../app/permissions-workflow
//   R3  @/features/F-identity/contract/perimeter-consultation
// validated:  pending
// R3 — permission contract surface for all other slices.
// Import from here only. Never import from F-permissions/app directly.
// A5: requirePermission exposed here; F-la-config dissolved sprint-13-shot-3.
//     slice never cross into F-permissions/app/permissions-workflow.
// Axiom cite: A5 — cross-slice calls via contract only.
//
// Step 1 — D6 fix:
//   requirePermission re-exported from this R3 surface.
//   F-verify absorbs la-contract; requirePermission stays canonical here (sprint-13-shot-3).

import { NextRequest, NextResponse } from 'next/server'
import { Action } from '../config/permissions-config'
import { requirePermission as _requirePermission, assignDefaultRole as _assignDefaultRole, setMemberRole as _setMemberRole } from '../app/permissions-workflow'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'

// ─── requirePermission (D6 fix — cross-slice contract surface) ────────────────
// Any slice needing permission checks imports this, not permissions-workflow.
// Axiom cite: A5.
export async function requirePermission(
  userId: string,
  projectId: string,
  action: Action
): Promise<void> {
  await _requirePermission(userId, projectId, action)
}

// ─── assignDefaultRole / setMemberRole ────────────────────────────────────────
// Called by event-subscriptions.ts — already correctly imported from here.
export { assignDefaultRole, setMemberRole } from '../app/permissions-workflow'

// ─── Server route guard ───────────────────────────────────────────────────────

export function withPermission(action: Action, projectIdParam = 'projectId') {
  return function guard(
    handler: (req: NextRequest, ctx: { userId: string; projectId: string }) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
      // Sprint 6 Shot 3: perimeter validates at unitary site; R3 reads via getPerimeterSession.
      const session = getPerimeterSession(req)
      if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

      const projectId = params[projectIdParam]
      if (!projectId) return NextResponse.json({ error: 'missing_project_id' }, { status: 400 })

      try {
        await _requirePermission(session.userId, projectId, action)
      } catch {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }

      return handler(req, { userId: session.userId, projectId })
    }
  }
}

// ─── Client hook ──────────────────────────────────────────────────────────────
export { usePermissions } from './permissions-hook'

// ── enforceSubstrateReadScope (sprint-12-shot-3) ──────────────────────────────
export { enforceSubstrateReadScope } from '../app/permissions-workflow'
