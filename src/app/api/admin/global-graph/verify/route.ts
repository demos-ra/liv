// @liv-standard v1.5.1
// [app/R4]
// Built with LIV · livai.dev
// sprint-8-shot-3a: F-codec dissolved (admin verify used F-codec verify path).
// Sprint 9 reauthors against substrate.

import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Not Implemented' },
    { status: 501 },
  )
}
