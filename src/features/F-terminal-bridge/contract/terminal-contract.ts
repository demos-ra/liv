// [F-terminal-bridge/R3/C2] Terminal bridge contract — API + hook — STUB
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { executeCommand, connectTerminal } from '../app/terminal-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'
import { TERMINAL_IS_STUB } from '../config/terminal-config'

// --- POST /api/terminal/execute ---

export async function POST_execute(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await validateSession(accessToken)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json()
  const { projectId, command } = body

  if (!projectId || !command) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 })
  }

  await requirePermission(session.userId, projectId, 'terminal_connect')

  const result = await executeCommand(command, session.userId, projectId)

  return NextResponse.json({ ...result, stub: TERMINAL_IS_STUB })
}

// --- POST /api/terminal/connect ---

export async function POST_connect(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!accessToken) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const session = await validateSession(accessToken)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { projectId } = await req.json()
  if (!projectId) return NextResponse.json({ error: 'missing_project_id' }, { status: 400 })

  await requirePermission(session.userId, projectId, 'terminal_connect')

  const connected = await connectTerminal(session.userId, projectId)

  return NextResponse.json({ connected, stub: TERMINAL_IS_STUB })
}

// --- Client hook ---

export { useTerminal } from './terminal-hook'
