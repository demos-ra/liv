// [F-la-config/contract/la-contract.ts]
// R3 — HTTP contract for LA validation trigger.
// Moved from core/api/routes.ts — core must have zero slice imports.
// Route: POST /api/la/:projectId/run

import { NextRequest, NextResponse } from 'next/server'
import { triggerValidation } from '../app/la-runner'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/core/types/session'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

export async function POST_laRun(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await resolveSession(token)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'la_run')

  const result = await triggerValidation(params.projectId)
  return NextResponse.json(result)
}

export { buildGridFromResults } from './execution-check'
