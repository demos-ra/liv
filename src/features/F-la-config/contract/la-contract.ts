// @liv-standard v1.3
// [F-la-config/contract/la-contract.ts]
// Built with LIV · livai.dev
// R3 — HTTP contract for LA validation trigger.
// Moved from core/api/routes.ts — core must have zero slice imports.
// Route: POST /api/la/:projectId/run
//
// Step 1 — D6 fix (A5):
//   requirePermission now imported from F-permissions/contract/permissions-contract
//   instead of F-permissions/app/permissions-workflow.
//   Axiom cite: A5 — cross-slice calls via R3 contract only, never R2/app directly.

import { NextRequest, NextResponse } from 'next/server'
import { triggerValidation } from '../app/la-runner'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { requirePermission } from '@/features/F-permissions/contract/permissions-contract'

export async function POST_laRun(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await validateSession(token)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'la_run')

  const result = await triggerValidation(params.projectId)
  return NextResponse.json(result)
}

export { buildGridFromResults } from './execution-check'
