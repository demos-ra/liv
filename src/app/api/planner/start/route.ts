// @liv-standard v1.5.1 amended sprint-13-shot-2
// [F-plan/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-13-shot-2 (header: slice F-planner → F-plan; standard v1.3 → v1.5.1; wires-in corrected)
// slice:      F-plan
// layer:      R3
// wires-in:
//   W-ATOM  handleStartPipeline  @/features/F-plan/contract/plan-contract
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-plan/contract/plan-contract
// validated:  2026-03-12

import { NextRequest } from 'next/server'
import { handleStartPipeline } from '@/features/F-plan/contract/plan-contract'

export const dynamic = 'force-dynamic'

export function POST(req: NextRequest) {
  return handleStartPipeline(req)
}
