// @liv-standard v1.3
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM  handleAdvanceStage    @/features/F-planner/contract/planner-contract
//   W-ATOM  handleFailStage       @/features/F-planner/contract/planner-contract
//   W-ATOM  handleFreezeContract  @/features/F-planner/contract/planner-contract
//   W-ATOM  PlannerJobId          @/features/F-planner/types/planner-types
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-planner/contract/planner-contract
//   R0  @/features/F-planner/types/planner-types
// validated:  2026-03-12
//
// Next.js 16: params is a Promise — must await before use.
// Async unwrap happens here at route boundary only.
// Contract handlers always receive plain strings.

import { NextRequest }             from 'next/server'
import {
  handleAdvanceStage,
  handleFailStage,
  handleFreezeContract,
}                                  from '@/features/F-planner/contract/planner-contract'
import type { PlannerJobId }       from '@/features/F-planner/types/planner-types'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ jobId: string; action: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { jobId, action } = await params

  switch (action) {
    case 'advance':  return handleAdvanceStage(req, jobId as PlannerJobId)
    case 'fail':     return handleFailStage(req, jobId as PlannerJobId)
    case 'contract': return handleFreezeContract(req, jobId as PlannerJobId)
    default:
      return new Response(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404 })
  }
}
