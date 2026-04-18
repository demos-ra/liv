// @liv-standard v1.5
// [app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      app
// layer:      R4
// wires-in:
//   W-HOOK  getArtifactsForMode()  F-codec/R3 (codec-contract)
//   W-HOOK  validateSession()      F-identity/R3 (auth-contract)
//   W-ATOM  SESSION_COOKIE_NAME    F-identity/R3 (auth-contract)
// wires-out:  none (HTTP surface)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
// validated:  pending

// GET /api/modules/[mode]/artifacts — returns artifact summaries for a mode.
// Auth required — artifacts are per-user.

import { NextRequest, NextResponse } from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { getArtifactsForMode } from '@/features/F-codec/contract/codec-contract'

type Params = { params: Promise<{ mode: string }> }

export async function GET(
  req: NextRequest,
  { params }: Params,
): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const session = await validateSession(token)
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { mode } = await params
  const artifacts = getArtifactsForMode(mode, session.userId)
  return NextResponse.json({ ok: true, data: artifacts })
}
