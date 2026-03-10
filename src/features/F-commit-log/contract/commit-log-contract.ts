// [F-commit-log/R3/C2] Commit log contract — API routes + client hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { recordCommit, confirmAiCommit, loadCommitHistory } from '../app/commit-log-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

// --- POST /api/commits/[projectId] ---
// Records a commit (before push)

export async function POST_commit(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = params
  await requirePermission(session.userId, projectId, 'commit_confirm')

  const body = await req.json()
  const { message, authorship, filesChanged, additions, deletions } = body

  if (!message || !authorship) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 })
  }

  const result = await recordCommit(projectId, session.userId, message, authorship, {
    filesChanged,
    additions,
    deletions,
  })

  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 422 })
  return NextResponse.json(result, { status: 201 })
}

// --- PATCH /api/commits/[projectId]/[commitId]/confirm ---
// Human confirms AI-generated commit

export async function PATCH_confirm(
  req: NextRequest,
  { params }: { params: { projectId: string; commitId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId, commitId } = params
  await requirePermission(session.userId, projectId, 'commit_confirm')

  const confirmed = await confirmAiCommit(commitId, session.userId)
  if (!confirmed) return NextResponse.json({ error: 'commit_not_found_or_not_ai' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

// --- GET /api/commits/[projectId] ---
// Paginated commit history

export async function GET_commits(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = params
  await requirePermission(session.userId, projectId, 'project_read')

  const cursor = req.nextUrl.searchParams.get('cursor') ?? null
  const featureTag = req.nextUrl.searchParams.get('feature') ?? undefined
  const authorship = req.nextUrl.searchParams.get('authorship') as 'human' | 'ai' | 'ai_confirmed' | undefined

  const result = await loadCommitHistory(projectId, cursor, { featureTag, authorship })
  return NextResponse.json(result)
}

// --- Internal ---

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// --- Client hook ---

export { useCommitLog } from './commit-log-hook'

export { recordCommit } from "../app/commit-log-workflow"
