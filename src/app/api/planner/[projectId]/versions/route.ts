// @liv-standard v1.3
// [src/app/api/planner/[projectId]/versions/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-FN  handleGetVersionHistory  @/features/F-planner/contract/planner-contract
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-planner/contract/planner-contract
//   R5  next/server
// validated:  pending
//
// step5e (A1, A2):
//   New route. GET /api/planner/[projectId]/versions.
//   Delegates to handleGetVersionHistory in planner-contract (R3).
//   Pattern matches all other planner routes: route → R3 contract handler → IPlannerDb.
//   Axiom cite: A2 — no direct R4 imports. A1 — planner-contract is sole R3 surface.

import { NextRequest, NextResponse }  from 'next/server'
import { handleGetVersionHistory }    from '@/features/F-planner/contract/planner-contract'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ projectId: string }> }

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { projectId } = await params
  return handleGetVersionHistory(req, projectId)
}
