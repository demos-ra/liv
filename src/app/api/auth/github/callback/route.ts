// @liv-standard v1.3
// [src/app/api/auth/github/callback/route.ts]
// Built with LIV · livai.dev
// R4 — thin delegator. A5: imports via contract only.

import { NextRequest } from 'next/server'
import { handleOAuthCallback } from '@/features/F-identity/contract/oauth-contract'

export async function GET(req: NextRequest) {
  return handleOAuthCallback('github', req)
}
