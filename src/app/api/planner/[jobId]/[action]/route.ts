// @liv-standard v1.5.1 amended sprint-13-shot-2
// [F-plan/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-13-shot-2 (header: slice F-planner → F-plan; standard v1.3 → v1.5.1; wires-in corrected)
// slice:      F-plan
// layer:      R3
// wires-in:
//   W-ATOM  handleAdvanceStage    @/features/F-plan/contract/plan-contract
//   W-ATOM  handleFailStage       @/features/F-plan/contract/plan-contract
//   W-ATOM  handleFreezeContract  @/features/F-plan/contract/plan-contract
//   W-ATOM  PlannerJobId          @/features/F-plan/types/pipeline-types
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-plan/contract/plan-contract
//   R0  @/features/F-plan/types/pipeline-types
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
}                                  from '@/features/F-plan/contract/plan-contract'
import type { PlannerJobId }       from '@/features/F-plan/types/pipeline-types'

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
