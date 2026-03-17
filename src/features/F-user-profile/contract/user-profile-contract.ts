// @liv-standard v1.3
// [F-user-profile/contract/user-profile-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-corrective-2
// slice:      F-user-profile
// layer:      R3
// wires-in:
//   W-ATOM  ProviderId        ../config/provider-keys-config
//   W-ATOM  PROVIDERS         ../config/provider-keys-config
//   W-ATOM  ModelPreferences  ../types/profile-types
//   W-ATOM  ModelTierPreference ../types/profile-types
//   W-ATOM  SESSION_COOKIE_NAME  F-identity/contract/auth-contract
//   W-ATOM  validateSession      F-identity/contract/auth-contract
// wires-out:
//   W-HOOK  useUserProfile       →  F-chat/R3, F-dashboard/R3
//   W-FN    upsertProfileForUser →  F-identity/R3
//   W-FN    getApiKey            →  F-planner/R3, F-chat/R2
//   W-FN    hasApiKey            →  F-chat/R3
//   W-FN    getModelPreferences  →  (cross-slice export — A5)
//   W-FN    setModelPreferences  →  (internal — called by route handlers below)
// deps:
//   R0  ../config/provider-keys-config
//   R0  ../types/profile-types
//   R2  ../app/user-profile-workflow
//   R3  @/features/F-identity/contract/auth-contract
//   R4  ../exec/api-key-db
//   R4  ../exec/user-profile-db
//   R5  next/server
// validated:  pending
//
// A5: this is the only import path into F-user-profile for other slices.
// Phase 4 change: getApiKey re-exported. Phase 5 change: API key handlers added.
//
// step4b2-phase-d (A1, A3, A5):
//   getModelPreferences() and setModelPreferences() exported as cross-slice surface.
//   GET_modelPreferences / PUT_modelPreferences route handlers added.
//   PUT validates: (1) valid JSON shape, (2) non-null tier references a provider
//   the user has a key for, (3) model string is non-empty.
//   On API key removal, preference for that provider tier is NOT auto-cleared here —
//   F-planner resolveModel() falls back to default when preference provider has no key.
//   Axiom cite: A1 — F-user-profile owns model preferences. A5 — sole export path.

import { NextRequest, NextResponse }                         from 'next/server'
import { loadProfile, setPreferredModel, setDisplayName }   from '../app/user-profile-workflow'
import { validateSession, SESSION_COOKIE_NAME }             from '@/features/F-identity/contract/auth-contract'
import { setApiKey, deleteApiKey, getApiKey, hasApiKey }    from '../exec/api-key-db'
import { dbGetModelPreferences, dbSetModelPreferences }     from '../exec/user-profile-db'
import { PROVIDERS }                                        from '../config/provider-keys-config'
import type { ProviderId }                                  from '../config/provider-keys-config'
import type { ModelPreferences, ModelTierPreference }       from '../types/profile-types'

// ── Session helper ─────────────────────────────────────────────────────────────
async function getSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return validateSession(token)
}

// ── GET /api/profile ───────────────────────────────────────────────────────────
export async function GET_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const profile = await loadProfile(session.userId)
  if (!profile) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json(profile)
}

// ── PATCH /api/profile ─────────────────────────────────────────────────────────
export async function PATCH_profile(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { preferredModelId, displayName } = await req.json()

  if (preferredModelId) await setPreferredModel(session.userId, preferredModelId)
  if (displayName)      await setDisplayName(session.userId, displayName)

  return NextResponse.json({ ok: true })
}

// ── GET /api/profile/api-key?provider=x ───────────────────────────────────────
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

// ── POST /api/profile/api-key ──────────────────────────────────────────────────
export async function POST_apiKey(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.provider !== 'string' || typeof body.key !== 'string') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const { provider, key } = body as { provider: string; key: string }

  if (!(provider in PROVIDERS)) {
    return NextResponse.json({ error: 'unknown_provider' }, { status: 400 })
  }

  if (!key.trim()) {
    return NextResponse.json({ error: 'key_required' }, { status: 400 })
  }

  await setApiKey(session.userId, provider as ProviderId, key.trim())
  return NextResponse.json({ ok: true })
}

// ── DELETE /api/profile/api-key ────────────────────────────────────────────────
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

// ── GET /api/profile/models ───────────────────────────────────────────────────
// Returns current model preferences, or null if never set (caller uses defaults).
export async function GET_modelPreferences(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const result = await dbGetModelPreferences(session.userId)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ ok: true, data: result.data })
}

// ── PUT /api/profile/models ───────────────────────────────────────────────────
// Body: ModelPreferences — { largest, medium, smallest } each ModelTierPreference | null.
// Validates: non-null tier must reference a provider the user has a key for.
// Model string must be non-empty.
export async function PUT_modelPreferences(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }) }

  // Shape validation
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  const tiers = ['largest', 'medium', 'smallest'] as const
  const validated: ModelPreferences = { largest: null, medium: null, smallest: null }

  for (const tier of tiers) {
    const raw = b[tier]
    if (raw === null || raw === undefined) {
      validated[tier] = null
      continue
    }

    if (typeof raw !== 'object' || Array.isArray(raw)) {
      return NextResponse.json(
        { error: 'invalid_body', message: `${tier} must be null or { provider, model }` },
        { status: 400 }
      )
    }

    const t = raw as Record<string, unknown>
    if (typeof t.provider !== 'string' || typeof t.model !== 'string') {
      return NextResponse.json(
        { error: 'invalid_body', message: `${tier}.provider and ${tier}.model must be strings` },
        { status: 400 }
      )
    }

    if (!(t.provider in PROVIDERS)) {
      return NextResponse.json(
        { error: 'unknown_provider', message: `${tier}.provider '${t.provider}' is not a registered provider` },
        { status: 400 }
      )
    }

    if (!t.model.trim()) {
      return NextResponse.json(
        { error: 'invalid_body', message: `${tier}.model must not be empty` },
        { status: 400 }
      )
    }

    // Validate user actually has a key for this provider
    const hasKey = await hasApiKey(session.userId, t.provider as ProviderId)
    if (!hasKey) {
      return NextResponse.json(
        { error: 'no_key_for_provider', message: `No API key saved for ${t.provider}. Add the key before setting a model preference.` },
        { status: 422 }
      )
    }

    validated[tier] = { provider: t.provider as ProviderId, model: t.model.trim() } satisfies ModelTierPreference
  }

  const setResult = await dbSetModelPreferences(session.userId, validated)
  if (!setResult.ok) return NextResponse.json({ error: setResult.error }, { status: 500 })
  return NextResponse.json({ ok: true, data: validated })
}

// ── Cross-slice exports (A5) ──────────────────────────────────────────────────
export { useUserProfile }      from './user-profile-hook'
export { upsertProfileForUser } from '../app/user-profile-workflow'
export { getApiKey, hasApiKey } from '../exec/api-key-db'

// step4b2-phase-d: model preferences exported for cross-slice reads (F-planner reads
// preferences via its own R4, but these are available for future consumers).
export { dbGetModelPreferences as getModelPreferences } from '../exec/user-profile-db'
