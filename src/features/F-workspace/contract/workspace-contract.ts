// [F-workspace/R3/C2] Workspace contract — API + hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import {
  getOrCreateLayout,
  activatePanel,
  togglePanelVisibility,
  resizePanelSize,
  toggleSidebarState,
} from '../app/workspace-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'

// --- GET /api/workspace/[projectId] ---

export async function GET_workspace(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const layout = await getOrCreateLayout(session.userId, params.projectId)
  return NextResponse.json(layout)
}

// --- PATCH /api/workspace/[projectId] ---
// Single endpoint for all layout mutations — action-based

export async function PATCH_workspace(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { action, panelId, sizePct } = await req.json()

  switch (action) {
    case 'activate':
      await activatePanel(session.userId, params.projectId, panelId)
      break
    case 'toggle':
      await togglePanelVisibility(session.userId, params.projectId, panelId)
      break
    case 'resize':
      await resizePanelSize(session.userId, params.projectId, panelId, sizePct)
      break
    case 'toggle_sidebar':
      await toggleSidebarState(session.userId, params.projectId)
      break
    default:
      return NextResponse.json({ error: 'unknown_action' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

export { useWorkspace } from './workspace-hook'
