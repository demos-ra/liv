// @liv-standard v1.3
// [src/app/api/profile/models/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-d
// slice:      F-user-profile
// layer:      R3
// wires-in:
//   W-FN  GET_modelPreferences  F-user-profile/contract/user-profile-contract
//   W-FN  PUT_modelPreferences  F-user-profile/contract/user-profile-contract
// wires-out:  none  (Next.js route — external HTTP surface)
// deps:
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R5  next/server
// validated:  pending
//
// step4b2-phase-d (A1, A5):
//   GET /api/profile/models — returns saved ModelPreferences or null.
//   PUT /api/profile/models — validates and writes ModelPreferences.
//   Logic lives in user-profile-contract.ts (A1: F-user-profile owns preferences).
//   This file is a thin Next.js adapter — no business logic.

import { type NextRequest } from 'next/server'
import {
  GET_modelPreferences,
  PUT_modelPreferences,
} from '@/features/F-user-profile/contract/user-profile-contract'

export async function GET(req: NextRequest) {
  return GET_modelPreferences(req)
}

export async function PUT(req: NextRequest) {
  return PUT_modelPreferences(req)
}
