// [F-topography/R3/C2] Topography contract — API + SSE push + hook
// R3: interface boundary, depends R0 + R1 + R2

import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { NextRequest, NextResponse } from 'next/server'
import { loadGrid } from '../app/topography-workflow'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'
import { requirePermission } from '@/features/F-permissions/app/permissions-workflow'
import { subscribeToEvent } from '@/features/F-event-system/contract/event-bus'

// --- GET /api/topography/[projectId] ---

export async function GET_topography(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  await requirePermission(session.userId, params.projectId, 'topography_read')

  const grid = await loadGrid(params.projectId)
  if (!grid) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(grid)
}

// --- GET /api/topography/[projectId]/stream ---
// SSE: pushes grid updates in real time as checks run

export async function GET_stream(
  req: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<Response> {
  const session = await getSession(req)
  if (!session) return new Response('Unauthenticated', { status: 401 })

  await requirePermission(session.userId, params.projectId, 'topography_read')

  const { projectId } = params
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`event: grid\ndata: ${JSON.stringify(data)}\n\n`))
      }

      const unsubscribe = subscribeToEvent(EVENTS.TOPOGRAPHY.UPDATED, async (e) => {
        if (e.payload.projectId !== projectId) return
        const grid = await loadGrid(projectId)
        if (grid) send(grid)
      })

      const heartbeat = setInterval(() => {
        try { controller.enqueue(encoder.encode(': heartbeat\n\n')) }
        catch { clearInterval(heartbeat) }
      }, 25_000)

      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        unsubscribe()
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return null
  return resolveSession(token)
}

export { useTopography } from './topography-hook'

export { recordActivity, rebuildGrid, registerTopographySubscriptions } from "../app/topography-workflow"
export { loadGridSnapshot } from "../exec/topography-db"
