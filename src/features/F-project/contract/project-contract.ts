// [F-project/R3/C2] Project contract — API routes + client hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { createProject, connectRepo, archive, loadProject, loadUserProjects } from '../app/project-workflow'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

// --- POST /api/projects ---

export async function POST_project(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { name, description } = await req.json()
  const result = await createProject(session.userId, name, description ?? null)

  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 422 })
  return NextResponse.json(result, { status: 201 })
}

// --- GET /api/projects ---

export async function GET_projects(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const cursor = req.nextUrl.searchParams.get('cursor') ?? null
  const result = await loadUserProjects(session.userId, cursor)
  return NextResponse.json(result)
}

// --- GET /api/projects/[projectId] ---

export async function GET_project(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'project_read')

  const project = await loadProject(params.projectId)
  if (!project) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json(project)
}

// --- PATCH /api/projects/[projectId]/repo ---

export async function PATCH_repo(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'project_update')

  const { repoOwner, repoName, defaultBranch } = await req.json()
  if (!repoOwner || !repoName || !defaultBranch) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 })
  }

  const ok = await connectRepo(params.projectId, repoOwner, repoName, defaultBranch)
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

// --- DELETE /api/projects/[projectId] (archive) ---

export async function DELETE_project(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'project_delete')

  const ok = await archive(params.projectId)
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return null
  return resolveSession(token)
}

export { useProject, useProjectList } from './project-hook'
