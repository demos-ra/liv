// @liv-standard v1.5.2
// @present-standard v1.0.1
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/present/route.ts]
// Sprint 2 — Shot 5
//
// REST POST handler for /api/present.
// Mirrors src/app/api/substrate/export/route.ts session pattern.
// Auth: getPerimeterSession — perimeter-validated at unitary site (src/proxy.ts).
// userId sourced from session; scopeRef from request body.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession }            from '@/features/F-identity/contract/perimeter-consultation'
import { present }                        from '@/features/F-present/contract/present-contract'
import { generateId }                     from '@/core/types/primitives'

import type {
  PresentReadIntent,
  WearerOperation,
  OperationParameter,
  FrameworkRef,
  IntentIdRef,
} from '@/features/F-present/contract/present-contract'

import type { ScopeRef } from '@/core/types/substrate.types'

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

  // scopeRef sourced from body; userId from PS-stamped session.
  const intent: PresentReadIntent = {
    intentId:        generateId('intent') as unknown as IntentIdRef,
    consumerRef:     (body['consumerRef'] ?? 'external') as unknown as FrameworkRef,
    userId:          session.userId,
    scopeRef:        body['scopeRef']        as unknown as ScopeRef,
    operation:       body['operation']       as WearerOperation,
    parameter:       body['parameter']       as OperationParameter,
    currentPosition: (body['currentPosition'] ?? null) as any,
    bound:           (body['bound'] as any) ?? { maxNodes: 20, maxThreads: 40, walkBudget: 100 },
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
