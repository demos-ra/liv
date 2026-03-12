// @liv-standard v1.3
// [F-project/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R3
// wires-in:
//   W-ATOM    ProjectResult        ../types/project-types
//   W-ATOM    CreateProjectPayload ../types/project-types
//   W-ATOM    UpdateProjectPayload ../types/project-types
//   W-ATOM    ProjectDelta         ../types/project-types
//   W-ATOM    ProjectId            ../types/project-types
//   W-ATOM    CreateBuildPayload   ../types/project-types
//   W-ATOM    SESSION_COOKIE_NAME  F-identity/contract/auth-contract (W-ATOM)
//   W-ATOM    validateSession      F-identity/contract/auth-contract (W-ATOM)
// wires-out:
//   W-HOOK  useProject  →  F-chat/R3, F-workspace/R3
// deps:
//   R0  ../types/project-types
//   R1  (none — R3 does not import R1)
//   R2  ../workflow/project-workflow
//   R4  ../exec/project-db  (injection only — createProjectDb)
// validated:  2026-03-12

import { NextRequest, NextResponse } from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import {
  createProject,
  getProject,
  listProjects,
  updateProject,
  deleteProject,
} from '../workflow/project-workflow'
import { createProjectDb } from './project-inject'
import type {
  ProjectId,
  CreateProjectPayload,
  ProjectDelta,
} from '../types/project-types'

// ── Shared session helper ─────────────────────────────────────────────────────
// FL-AUTH: R3 extracts token → R2 validates → R4 reads session → R3 receives result
async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// ── GET /api/projects ─────────────────────────────────────────────────────────
export async function handleListProjects(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createProjectDb()
  const result = await listProjects({ db }, session.userId)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })

  return NextResponse.json({ ok: true, data: result.data })
}

// ── POST /api/projects ────────────────────────────────────────────────────────
export async function handleCreateProject(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const input = body as CreateProjectPayload
  if (!input?.name) return NextResponse.json({ error: 'VALIDATION_FAILED', message: 'name required' }, { status: 422 })

  const db     = createProjectDb()
  const result = await createProject({ db }, session.userId, {
    name:        input.name,
    description: input.description ?? null,
  })

  if (!result.ok) {
    const status = result.error.code === 'VALIDATION_FAILED' ? 422 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data }, { status: 201 })
}

// ── GET /api/projects/[projectId] ─────────────────────────────────────────────
export async function handleGetProject(
  req: NextRequest,
  projectId: ProjectId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createProjectDb()
  const result = await getProject({ db }, session.userId, projectId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404
                 : result.error.code === 'FORBIDDEN' ? 403
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── PATCH /api/projects/[projectId] ───────────────────────────────────────────
export async function handleUpdateProject(
  req: NextRequest,
  projectId: ProjectId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 }) }

  const delta = body as ProjectDelta
  const db    = createProjectDb()
  const result = await updateProject({ db }, session.userId, projectId, delta)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404
                 : result.error.code === 'FORBIDDEN' ? 403
                 : result.error.code === 'VALIDATION_FAILED' ? 422
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true, data: result.data })
}

// ── DELETE /api/projects/[projectId] ──────────────────────────────────────────
export async function handleDeleteProject(
  req: NextRequest,
  projectId: ProjectId
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const db     = createProjectDb()
  const result = await deleteProject({ db }, session.userId, projectId)

  if (!result.ok) {
    const status = result.error.code === 'NOT_FOUND' ? 404
                 : result.error.code === 'FORBIDDEN' ? 403
                 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true })
}
