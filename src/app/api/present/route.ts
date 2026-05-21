// @liv-standard v1.5.2
// @present-standard v2.0
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/present/route.ts]
// Sprint 2 — Shot 5; present-rederive — Shot 4 (v2.0 contract re-migration)
//
// REST POST handler for /api/present.
// Mirrors src/app/api/substrate/export/route.ts session pattern.
// Auth: getPerimeterSession — perimeter-validated at unitary site (src/proxy.ts).
// userId sourced from session; scopeRef + the three intent dimensions from body.
//
// present-rederive-shot-4: body-mapping re-migrated to the v2.0 PresentIntent
// fields — standpoint / focus / ordering — replacing the v1.0.1 operation /
// parameter / currentPosition mapping.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession }            from '@/features/F-identity/contract/perimeter-consultation'
import { present }                        from '@/features/F-present/contract/present-contract'
import { generateId }                     from '@/core/types/primitives'

import type {
  PresentIntent,
  FocusSelector,
  OrderingSelector,
  FrameworkRef,
  IntentIdRef,
} from '@/features/F-present/contract/present-contract'

import type { ScopeRef, PositionRef } from '@/core/types/substrate.types'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth — perimeter-validated session required.
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'PRESENT_AUTH_REJECTED', message: 'unauthenticated' } }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'PRESENT_INTENT_INVALID', message: 'invalid JSON body' } }, { status: 400 })
  }

  // scopeRef + the three intent dimensions sourced from body; userId from PS-stamped session.
  const intent: PresentIntent = {
    intentId:    generateId('intent') as unknown as IntentIdRef,
    consumerRef: (body['consumerRef'] ?? 'external') as unknown as FrameworkRef,
    userId:      session.userId,
    scopeRef:    body['scopeRef']   as unknown as ScopeRef,
    standpoint:  (body['standpoint'] ?? null) as PositionRef | null,
    focus:       body['focus']      as FocusSelector,
    ordering:    body['ordering']   as OrderingSelector,
    bound:       (body['bound'] as PresentIntent['bound']) ?? { maxNodes: 20, maxThreads: 40, walkBudget: 100 },
    provenance: {
      consumerSlice: (body['consumerRef'] ?? 'external') as unknown as FrameworkRef,
      stampedAt:     Date.now(),
    },
  }

  const result = await present(intent)

  if (!result.ok) {
    return NextResponse.json(result, { status: 422 })
  }

  return NextResponse.json(result)
}
