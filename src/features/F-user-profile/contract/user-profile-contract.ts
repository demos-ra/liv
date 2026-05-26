// @liv-standard v1.3
// [F-user-profile/contract/user-profile-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-corrective-2, sprint-beta-addon-shot-1 (PUT body de-tiered to flat selection), sprint-beta-addon-shot-2 (PUT resolves provider→model via PROVIDER_DEFAULT_MODEL; body is { provider })
// slice:      F-user-profile
// layer:      R3
// wires-in:
//   W-ATOM  ProviderId        ../config/provider-keys-config
//   W-ATOM  PROVIDERS         ../config/provider-keys-config
//   W-ATOM  ModelPreferences  ../types/profile-types
//   W-ATOM  PROVIDER_DEFAULT_MODEL  @/features/F-ai-adapter/config/ai-adapter-config  (sprint-beta-addon-shot-2: PUT /api/profile/models resolves provider→model)
//   W-FN    getPerimeterSession  F-identity/contract/perimeter-consultation
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
//   R3  @/features/F-identity/contract/perimeter-consultation
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
import { getPerimeterSession }                              from '@/features/F-identity/contract/perimeter-consultation'
import { setApiKey, deleteApiKey, getApiKey, hasApiKey }    from '../exec/api-key-db'
import { dbGetModelPreferences, dbSetModelPreferences }     from '../exec/user-profile-db'
import { PROVIDERS }                                        from '../config/provider-keys-config'
import type { ProviderId }                                  from '../config/provider-keys-config'
import type { ModelPreferences }                            from '../types/profile-types'
import { PROVIDER_DEFAULT_MODEL }                           from '@/features/F-ai-adapter/config/ai-adapter-config'

// ── Session helper ─────────────────────────────────────────────────────────────
// Sprint 6 Shot 3: perimeter validates at unitary site (src/middleware.ts);
// R3 reads middleware-set headers via getPerimeterSession per PS v1.0 §6.9.
async function getSession(req: NextRequest) {
  return getPerimeterSession(req)
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

  const hasResult = await hasApiKey(session.userId, provider as ProviderId)
  if (!hasResult.ok) return NextResponse.json({ error: hasResult.error.message }, { status: 500 })
  return NextResponse.json({ hasKey: hasResult.data })
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

// ── DELETE /api/profile/api-key ────────────────────────────────────────────
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
// sprint-beta-addon-shot-1 (L0 ruling): the per-tier body is struck.
// sprint-beta-addon-shot-2: provider-granularity selection. Body carries the
// wearer's picked provider — { provider }. The route resolves the provider's
// canonical model from F-ai-adapter's PROVIDER_DEFAULT_MODEL and writes the full
// ModelPreferences = { provider, model } with a real model id (never null).
// Validates: the provider is registered and the wearer holds a key for it.
export async function PUT_modelPreferences(req: NextRequest): Promise<NextResponse> {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }) }

  // Shape validation — body carries the picked provider.
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const b = body as Record<string, unknown>
  if (typeof b.provider !== 'string') {
    return NextResponse.json(
      { error: 'invalid_body', message: 'body must be { provider } with a string provider' },
      { status: 400 }
    )
  }

  if (!(b.provider in PROVIDERS)) {
    return NextResponse.json(
      { error: 'unknown_provider', message: `provider '${b.provider}' is not a registered provider` },
      { status: 400 }
    )
  }
  const provider = b.provider as ProviderId

  // Validate the wearer actually holds a key for this provider.
  const hasKeyResult = await hasApiKey(session.userId, provider)
  if (!hasKeyResult.ok) {
    return NextResponse.json({ error: hasKeyResult.error.message }, { status: 500 })
  }
  if (!hasKeyResult.data) {
    return NextResponse.json(
      { error: 'no_key_for_provider', message: `No API key saved for ${provider}. Add the key before selecting this engine.` },
      { status: 422 }
    )
  }

  // Resolve the provider's canonical model — provider-granularity selection.
  // PROVIDER_DEFAULT_MODEL declares one model per provider.
  const model = PROVIDER_DEFAULT_MODEL[provider]

  const validated: ModelPreferences = { provider, model }

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
