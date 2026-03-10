// [F-notifications/R3/C2] Notification contract — API routes + SSE push + hook
// R3: interface boundary, depends R0 + R1 + R2

import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { NextRequest, NextResponse } from 'next/server'
import { loadNotifications, readNotifications } from '../app/notifications-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { subscribeToEvent } from '@/features/F-event-system/contract/event-bus'

// --- GET /api/notifications ---
// Paginated list for current user

export async function GET_notifications(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const projectId = req.nextUrl.searchParams.get('projectId') ?? null
  const cursor = req.nextUrl.searchParams.get('cursor') ?? null

  const result = await loadNotifications(session.userId, projectId, cursor)
  return NextResponse.json(result)
}

// --- PATCH /api/notifications/read ---
// Mark one or many notifications as read

export async function PATCH_read(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { notificationIds } = await req.json()
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return NextResponse.json({ error: 'missing_notification_ids' }, { status: 400 })
  }

  await readNotifications(session.userId, notificationIds)
  return NextResponse.json({ ok: true })
}

// --- GET /api/notifications/stream ---
// SSE push: delivers notification.created events to the client in real time

export async function GET_stream(req: NextRequest): Promise<Response> {
  const session = await getSession(req)
  if (!session) return new Response('Unauthenticated', { status: 401 })

  const { userId } = session
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Subscribe to notification.created events for this user
      const unsubscribe = subscribeToEvent(EVENTS.NOTIFICATIONS.CREATED, async (event) => {
        if (event.payload.userId !== userId) return
        controller.enqueue(
          encoder.encode(`event: notification\ndata: ${JSON.stringify(event.payload)}\n\n`)
        )
      })

      // Heartbeat every 25s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
        }
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

// --- Internal helper ---

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// --- Client hook ---

export { useNotifications } from './notifications-hook'

export { createNotification } from "../app/notifications-workflow"
