// [F-git-connector/R3/C2] Git connector contract — OAuth routes + agent websocket
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { initiateOAuth, handleOAuthCallback } from '../app/git-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'

// --- GET /api/git/oauth/initiate ---
// Redirects user to GitHub OAuth

export async function GET_initiate(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await validateSession(accessToken)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ error: 'missing_project_id' }, { status: 400 })

  await requirePermission(session.userId, projectId, 'git_connect')

  const { url, state } = initiateOAuth()

  const res = NextResponse.redirect(url)
  // store state in httpOnly cookie for callback verification
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 min
    path: '/',
  })
  res.cookies.set('oauth_project_id', projectId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })
  return res
}

// --- GET /api/git/oauth/callback ---

export async function GET_callback(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)

  const session = await validateSession(accessToken)
  if (!session) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)

  const code = req.nextUrl.searchParams.get('code')
  const receivedState = req.nextUrl.searchParams.get('state')
  const expectedState = req.cookies.get('oauth_state')?.value
  const projectId = req.cookies.get('oauth_project_id')?.value

  if (!code || !receivedState || !expectedState || !projectId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?code=oauth_missing_params`)
  }

  const result = await handleOAuthCallback(
    code,
    receivedState,
    expectedState,
    session.userId,
    projectId
  )

  const res = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/project/${projectId}?git=${result.success ? 'connected' : 'error'}`
  )
  res.cookies.delete('oauth_state')
  res.cookies.delete('oauth_project_id')
  return res
}

// --- WebSocket upgrade handler: /api/git/agent ---
// Local agent connects here and maintains persistent websocket

export { createAgentWebSocketHandler } from './git-ws-handler'
