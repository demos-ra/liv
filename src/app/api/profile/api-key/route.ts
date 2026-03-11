// @liv-standard v1.0
// [src/app/api/profile/api-key/route.ts]
// Built with LIV · livai.dev
// R4: Next.js route handler — thin delegation only. No logic here.
// A4: all logic lives in F-user-profile/contract. Route files are wiring only.
//
// POST  { provider, key }    → save encrypted key for provider
// DELETE { provider }        → remove key for provider

import { type NextRequest } from 'next/server'
import { GET_apiKey, POST_apiKey, DELETE_apiKey } from '@/features/F-user-profile/contract/user-profile-contract'

export async function GET(req: NextRequest) {
  return GET_apiKey(req)
}

export async function POST(req: NextRequest) {
  return POST_apiKey(req)
}

export async function DELETE(req: NextRequest) {
  return DELETE_apiKey(req)
}
