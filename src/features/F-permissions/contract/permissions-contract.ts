// [F-permissions/R3/C2] Permission contract — server guard + client hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { Action } from '../config/permissions-config'
import { requirePermission } from '../app/permissions-workflow'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'

// --- Server guard: wraps any route handler requiring a permission ---

export function withPermission(action: Action, projectIdParam = 'projectId') {
  return function guard(
    handler: (req: NextRequest, ctx: { userId: string; projectId: string }) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
      const accessToken = req.cookies.get(SESSION_CONFIG.cookieName)?.value
      if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

      const session = await resolveSession(accessToken)
      if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

      const projectId = params[projectIdParam]
      if (!projectId) return NextResponse.json({ error: 'missing_project_id' }, { status: 400 })

      try {
        await requirePermission(session.userId, projectId, action)
      } catch {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }

      return handler(req, { userId: session.userId, projectId })
    }
  }
}

// --- Client hook ---

export { usePermissions } from './permissions-hook'

export { assignDefaultRole, setMemberRole } from "../app/permissions-workflow"
