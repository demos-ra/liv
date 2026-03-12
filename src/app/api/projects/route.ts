// @liv-standard v1.3
// [F-project/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R3
// wires-in:
//   W-ATOM  handleListProjects   ../../../features/F-project/contract/project-contract
//   W-ATOM  handleCreateProject  ../../../features/F-project/contract/project-contract
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-project/contract/project-contract
// validated:  2026-03-12

import { NextRequest } from 'next/server'
import {
  handleListProjects,
  handleCreateProject,
} from '@/features/F-project/contract/project-contract'

export const dynamic = 'force-dynamic'

export function GET(req: NextRequest) {
  return handleListProjects(req)
}

export function POST(req: NextRequest) {
  return handleCreateProject(req)
}
