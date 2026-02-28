// [F-user-profile/R3/C2] User profile contract — API + hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { loadProfile, setPreferredModel, setDisplayName } from '../app/user-profile-workflow'
import { resolveSession } from '@/features/F-session/app/session-workflow'
import { SESSION_CONFIG } from '@/features/F-session/config/session-config'

// --- GET /api/profile ---

export async function GET_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const profile = await loadProfile(session.userId)
  if (!profile) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(profile)
}

// --- PATCH /api/profile ---

export async function PATCH_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { preferredModelId, displayName } = await req.json()

  if (preferredModelId) await setPreferredModel(session.userId, preferredModelId)
  if (displayName)      await setDisplayName(session.userId, displayName)

  return NextResponse.json({ ok: true })
}

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  if (!token) return null
  return resolveSession(token)
}

export { useUserProfile } from './user-profile-hook'

export { upsertProfileForUser } from "../app/user-profile-workflow"
