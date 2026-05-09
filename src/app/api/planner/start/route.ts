// @liv-standard v1.3
// [F-planner/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R3
// wires-in:
//   W-ATOM  handleStartPipeline  @/features/F-planner/contract/planner-contract
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-planner/contract/planner-contract
// validated:  2026-03-12

import { NextRequest } from 'next/server'
import { handleStartPipeline } from '@/features/F-plan/contract/plan-contract'

export const dynamic = 'force-dynamic'

export function POST(req: NextRequest) {
  return handleStartPipeline(req)
}
