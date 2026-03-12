// @liv-standard v1.3
// [F-project/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R3
// wires-in:
//   W-ATOM  handleGetProject     @/features/F-project/contract/project-contract
//   W-ATOM  handleUpdateProject  @/features/F-project/contract/project-contract
//   W-ATOM  handleDeleteProject  @/features/F-project/contract/project-contract
//   W-ATOM  ProjectId            @/features/F-project/types/project-types
// wires-out:  none  (Next.js route handler — external surface only)
// deps:
//   R3  @/features/F-project/contract/project-contract
//   R0  @/features/F-project/types/project-types
// validated:  2026-03-12

import { NextRequest } from 'next/server'
import {
  handleGetProject,
  handleUpdateProject,
  handleDeleteProject,
} from '@/features/F-project/contract/project-contract'
import type { ProjectId } from '@/features/F-project/types/project-types'

export const dynamic = 'force-dynamic'

type Params = { params: { projectId: string } }

export function GET(req: NextRequest, { params }: Params) {
  return handleGetProject(req, params.projectId as ProjectId)
}

export function PATCH(req: NextRequest, { params }: Params) {
  return handleUpdateProject(req, params.projectId as ProjectId)
}

export function DELETE(req: NextRequest, { params }: Params) {
  return handleDeleteProject(req, params.projectId as ProjectId)
}
