// @liv-standard v1.3
// [src/app/api/planner/[jobId]/versions/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e-corrective
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
//   New route. GET /api/planner/[jobId]/versions.
//   Delegates to handleGetVersionHistory in planner-contract (R3).
//   Pattern matches all other planner routes: route → R3 contract handler → IPlannerDb.
//   Axiom cite: A2 — no direct R4 imports. A1 — planner-contract is sole R3 surface.
//
// step5e-corrective:
//   Moved from [projectId]/versions/route.ts to [jobId]/versions/route.ts.
//   Next.js requires all dynamic segments at the same path level share one slug name.
//   The existing [jobId] routes at /api/planner/[jobId]/* own this level — [projectId]
//   caused a slug conflict at runtime. Param is destructured as projectId for clarity:
//   the value sent by the UI is always a projectId, not a jobId.

import { NextRequest, NextResponse }  from 'next/server'
import { handleGetVersionHistory }    from '@/features/F-plan/contract/plan-contract'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ jobId: string }> }

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { jobId: projectId } = await params
  return handleGetVersionHistory(req, projectId)
}
