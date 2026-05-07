// @liv-standard v1.5.1
// @perimeter-standard v1.0
// [app/R4]
// Built with LIV · livai.dev
// Sprint 6 Shot 3: perimeter validates at unitary site (src/middleware.ts);
// R4 reads middleware-set headers via getPerimeterSession per PS v1.0 §6.9.
import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'

export async function POST(req: NextRequest) {
  const session = getPerimeterSession(req)
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
