// @liv-standard v1.5
// [app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      app
// layer:      R4
// wires-in:
//   W-HOOK  getModulesForClient()  F-codec/R3 (codec-contract)
// wires-out:  none (HTTP surface)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
// validated:  pending

// GET /api/modules — returns registered framework modules.
// No auth required — module definitions are not user-sensitive.

import { NextResponse } from 'next/server'
import { getModulesForClient } from '@/features/F-codec/contract/codec-contract'

export async function GET(): Promise<NextResponse> {
  const modules = getModulesForClient()
  return NextResponse.json({ ok: true, data: modules })
}
