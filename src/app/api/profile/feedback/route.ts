// @liv-standard v1.3
// [app/R4]
// Built with LIV · livai.dev
import { type NextRequest, NextResponse } from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await validateSession(token)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body?.message || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }

  console.log(JSON.stringify({
    event:   'user.feedback',
    userId:  session.userId,
    message: body.message.slice(0, 2000),
    ts:      new Date().toISOString(),
  }))

  return NextResponse.json({ ok: true })
}
