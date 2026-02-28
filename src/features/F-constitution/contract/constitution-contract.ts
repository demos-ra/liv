// [F-constitution/R3/C2] Constitution contract — API routes + client hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import {
  proposeSlices,
  confirmConstitutionForProject,
  loadConstitution,
} from '../app/constitution-workflow'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

// --- GET /api/constitution/[projectId] ---

export async function GET_constitution(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'constitution_read')

  const constitution = await loadConstitution(params.projectId)
  if (!constitution) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(constitution)
}

// --- POST /api/constitution/[projectId]/propose ---
// AI proposes slice list

export async function POST_propose(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'constitution_write')

  const { slices } = await req.json()
  if (!Array.isArray(slices) || slices.length === 0) {
    return NextResponse.json({ error: 'missing_slices' }, { status: 400 })
  }

  const result = await proposeSlices(params.projectId, slices)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 })

  return NextResponse.json({ ok: true })
}

// --- POST /api/constitution/[projectId]/confirm ---
// Human confirms the slice list — no build until this fires

export async function POST_confirm(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'constitution_confirm')

  const result = await confirmConstitutionForProject(params.projectId, session.userId)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 422 })

  return NextResponse.json({ ok: true })
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return null
  return resolveSession(token)
}

export { useConstitution } from './constitution-hook'

export { initConstitution } from "../app/constitution-workflow"
