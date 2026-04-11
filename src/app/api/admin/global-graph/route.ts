// @liv-standard v1.3
// [app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      app (API route)
// layer:      R4
// wires-in:
//   W-FN  validateSession     F-identity/R3
//   W-FN  isEmailAllowed      F-identity/R3
//   W-ATOM SESSION_COOKIE_NAME F-identity/R3
//   W-FN  dbGetUserEmail      F-admin/R3
//   W-FN  getGlobalGraph      F-memory/R3
//   W-FN  getGlobalArms       F-memory/R3
//   W-FN  classifyGraph       F-codec/R3
// wires-out:  none (HTTP response)
// deps:
//   R3  @/features/F-memory/contract/memory-contract
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-admin/contract/admin-contract
// validated:  pending

// Admin API: GET global graph decode state.
// A4: I/O at R4 only. Session + isAdmin validation.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, isEmailAllowed, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { dbGetUserEmail } from '@/features/F-admin/contract/admin-contract'
import { getGlobalGraph, getGlobalArms } from '@/features/F-memory/contract/memory-contract'
import type { ScopedGraphSet, MemGraph } from '@/features/F-memory/contract/memory-contract'
import { classifyGraph } from '@/features/F-codec/contract/codec-contract'
import type { GlobalGraphSummary } from '@/features/F-codec/contract/codec-contract'

export async function GET() {
  try {
    // ── Auth: session + isAdmin ──
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await validateSession(sessionCookie.value)
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // isAdmin check: typed query via F-admin/R3 + F-identity/R3
    const emailResult = await dbGetUserEmail(session.userId)
    if (!emailResult.ok) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    const email = emailResult.data
    if (!email || !isEmailAllowed(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── Build summary ──
    const globalGraph = getGlobalGraph()
    const globalArms = getGlobalArms()

    // Empty user graph — admin view is global-only
    const emptyGraph: MemGraph = { nodes: new Map(), edges: new Map() }
    const graphs: ScopedGraphSet = { user: emptyGraph, global: globalGraph }

    const decoded = classifyGraph(graphs, [], globalArms)

    // Count edges across all adjacency lists
    let edgeCount = 0
    for (const edges of globalGraph.edges.values()) {
      edgeCount += edges.length
    }

    const summary: GlobalGraphSummary = {
      decoded,
      nodeCount: globalGraph.nodes.size,
      edgeCount,
      armCount: globalArms.length,
    }

    return NextResponse.json(summary)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 },
    )
  }
}
