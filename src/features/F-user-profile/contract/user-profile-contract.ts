// @liv-standard v1.0
// [F-user-profile/contract/user-profile-contract.ts]
// Built with LIV · livai.dev
// R3: interface boundary, depends R0 + R1 + R2.
// A5: this is the only import path into F-user-profile for other slices.
// Phase 4 change: re-export getApiKey so F-chat R2 imports from contract, not exec.
// Phase 5 change: POST_apiKey + DELETE_apiKey handlers added.

import { NextRequest, NextResponse } from 'next/server'
import { loadProfile, setPreferredModel, setDisplayName } from '../app/user-profile-workflow'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { setApiKey, deleteApiKey, getApiKey, hasApiKey } from '../exec/api-key-db'
import { PROVIDERS } from '../config/provider-keys-config'
import type { ProviderId } from '../config/provider-keys-config'

// ── GET /api/profile ──────────────────────────────────────────────────────────

export async function GET_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const profile = await loadProfile(session.userId)
  if (!profile) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(profile)
}

// ── PATCH /api/profile ────────────────────────────────────────────────────────

export async function PATCH_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { preferredModelId, displayName } = await req.json()

  if (preferredModelId) await setPreferredModel(session.userId, preferredModelId)
  if (displayName)      await setDisplayName(session.userId, displayName)

  return NextResponse.json({ ok: true })
}

// ── Session helper ────────────────────────────────────────────────────────────

async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// ── Cross-slice exports (A5: all F-user-profile access goes through here) ─────

export { useUserProfile }    from './user-profile-hook'
export { upsertProfileForUser } from '../app/user-profile-workflow'

// Phase 4: getApiKey re-exported so F-chat can load per-user keys without
// importing across slice boundaries into exec/ directly. (A2 + A5 compliant)
export { getApiKey, hasApiKey } from '../exec/api-key-db'

// ── GET /api/profile/api-key?provider=x ──────────────────────────────────────
// Returns { hasKey: boolean } — no key value ever leaves the server.

export async function GET_apiKey(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const provider = new URL(req.url).searchParams.get('provider')
  if (!provider || !(provider in PROVIDERS)) {
    return NextResponse.json({ error: 'unknown_provider' }, { status: 400 })
  }

  const has = await hasApiKey(session.userId, provider as ProviderId)
  return NextResponse.json({ hasKey: has })
}

// ── POST /api/profile/api-key ─────────────────────────────────────────────────
// Body: { provider: ProviderId, key: string }

export async function POST_apiKey(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.provider !== 'string' || typeof body.key !== 'string') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const { provider, key } = body as { provider: string; key: string }

  // A3: validate provider against registry before touching DB
  if (!(provider in PROVIDERS)) {
    return NextResponse.json({ error: 'unknown_provider' }, { status: 400 })
  }

  if (!key.trim()) {
    return NextResponse.json({ error: 'key_required' }, { status: 400 })
  }

  await setApiKey(session.userId, provider as ProviderId, key.trim())
  return NextResponse.json({ ok: true })
}

// ── DELETE /api/profile/api-key ───────────────────────────────────────────────
// Body: { provider: ProviderId }

export async function DELETE_apiKey(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.provider !== 'string') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const { provider } = body as { provider: string }

  if (!(provider in PROVIDERS)) {
    return NextResponse.json({ error: 'unknown_provider' }, { status: 400 })
  }

  await deleteApiKey(session.userId, provider as ProviderId)
  return NextResponse.json({ ok: true })
}
