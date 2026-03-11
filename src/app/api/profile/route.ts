// @liv-standard v1.0
// [src/app/api/profile/route.ts]
// Built with LIV · livai.dev
// R4: Next.js route handler — thin delegation only. No logic here.
// A4: all logic lives in F-user-profile/contract. Route files are wiring only.

import { type NextRequest } from 'next/server'
import { GET_profile, PATCH_profile } from '@/features/F-user-profile/contract/user-profile-contract'

export async function GET(req: NextRequest) {
  return GET_profile(req)
}

export async function PATCH(req: NextRequest) {
  return PATCH_profile(req)
}
