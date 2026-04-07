// @liv-standard v1.3
// [src/app/api/auth/providers/route.ts]
// Built with LIV · livai.dev
// R4 — thin delegator. Public endpoint (no auth). A5: imports via contract only.

import { NextResponse } from 'next/server'
import { getConfiguredProviders } from '@/features/F-identity/contract/oauth-contract'

export async function GET() {
  return NextResponse.json(getConfiguredProviders())
}
