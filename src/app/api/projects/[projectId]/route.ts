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

// Next.js 15+: params is a Promise. Must be awaited at the route boundary.
// Unwrap here — pass plain string into contract handlers. Never pass Promise inward.
type Params = { params: Promise<{ projectId: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { projectId } = await params
  return handleGetProject(req, projectId as ProjectId)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { projectId } = await params
  return handleUpdateProject(req, projectId as ProjectId)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { projectId } = await params
  return handleDeleteProject(req, projectId as ProjectId)
}
