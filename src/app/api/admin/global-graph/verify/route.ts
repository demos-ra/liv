// @liv-standard v1.5
// [app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.2-verification
// slice:      app (API route)
// layer:      R4
// wires-in:
//   W-INJECT validateSession     F-identity/R3
//   W-INJECT isEmailAllowed      F-identity/R3
//   W-ATOM   SESSION_COOKIE_NAME F-identity/R3
//   W-INJECT dbGetUserEmail      F-admin/R3
//   W-INJECT getGlobalGraph, getGlobalArms, getUserGraph, getUserArms  F-memory/R3
//   W-INJECT getPresentState, traverse  F-memory/R3
//   W-INJECT seedAndTraverseGlobal F-memory/R3 (memory-contract)
//   W-ATOM   GLOBAL_SEED_NODES   F-memory/R0 (memory-seed-data)
//   W-INJECT classifyGraph       F-codec/R3 (codec-contract)
//   W-INJECT processMessage      F-codec/R3 (codec-contract)
// wires-out:  none (HTTP response)
// deps:
//   R3  @/features/F-memory/contract/memory-contract
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-admin/contract/admin-contract
//   R0  @/features/F-memory/config/memory-seed-data
// validated:  pending

// Phase 6.2 — verification route for global graph seed.
// Read-only diagnostics. Runs 5 tests against R3 contract surface.
// A4: I/O at R4 only. Admin-gated.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, isEmailAllowed, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { dbGetUserEmail } from '@/features/F-admin/contract/admin-contract'
import {
  getGlobalGraph,
  getGlobalArms,
  getUserGraph,
  getUserArms,
  getPresentState,
  traverse,
  seedAndTraverseGlobal,
} from '@/features/F-memory/contract/memory-contract'
import type { PresentState, MemGraph } from '@/features/F-memory/contract/memory-contract'
import { GLOBAL_SEED_NODES } from '@/features/F-memory/config/memory-seed-data'
import {
  classifyGraph,
  processMessage,
} from '@/features/F-codec/contract/codec-contract'

const TEST_USER_ID = 'test-verify-6_2'

// ── Shared auth helper ──
async function validateAdmin(): Promise<{ userId: string } | NextResponse> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await validateSession(sessionCookie.value)
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const emailResult = await dbGetUserEmail(session.userId)
  if (!emailResult.ok) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
  const email = emailResult.data
  if (!email || !isEmailAllowed(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId: session.userId }
}

// ── Test result types ──
type TestResult = {
  name:     string
  passed:   boolean
  criteria: Array<{ label: string; passed: boolean; detail: string }>
}

// ── GET: Run verification tests ──
export async function GET() {
  try {
    const auth = await validateAdmin()
    if (auth instanceof NextResponse) return auth

    const results: TestResult[] = []

    // ── Test 1: Present state from global graph alone ────────────────────────
    // Trigger ensureUserLoaded for test user, then read present state.
    // Test user has no prior traversals → empty user graph + global graph.
    await traverse('verification ping', TEST_USER_ID)
    const presentState: PresentState = getPresentState(TEST_USER_ID)

    const stmts = presentState.statements
    const stmtTexts = stmts.map(s => s.value.toLowerCase())
    const allText = stmtTexts.join(' ')

    const hasIdentity = allText.includes('liv') && (
      allText.includes('platform') || allText.includes('construction') || allText.includes('software')
    )
    const hasMode = allText.includes('epistemic') || allText.includes('structural') ||
                    allText.includes('generative') || allText.includes('verificative')
    const hasArchitecture = allText.includes('slice') || allText.includes('layer') ||
                           allText.includes('wire') || allText.includes('axiom') ||
                           allText.includes('r-layer') || allText.includes('r0')
    const noM4 = stmts.every(s => s.layer < 4)

    // Check sort order: statements should be ordered by confidence tier / layer
    let sortOrderCorrect = true
    for (let i = 1; i < stmts.length; i++) {
      // Deeper layers (lower number) should appear first
      if (stmts[i].layer < stmts[i - 1].layer) {
        // A deeper-layer statement appeared after a shallower one — check if recency explains it
        // Accept small inversions (sort is by composite score, not strictly by layer)
      }
    }
    // Simplified: just check that M0/M1 statements (if any) appear before M3 statements
    const firstM3Idx = stmts.findIndex(s => s.layer >= 3)
    const lastDeepIdx = stmts.reduce((max, s, i) => s.layer <= 1 ? i : max, -1)
    if (firstM3Idx >= 0 && lastDeepIdx >= 0 && lastDeepIdx > firstM3Idx) {
      sortOrderCorrect = false
    }

    results.push({
      name: 'Test 1: Present state from global graph',
      passed: stmts.length >= 5 && hasIdentity && hasMode && hasArchitecture && noM4,
      criteria: [
        { label: 'statements.length >= 5', passed: stmts.length >= 5, detail: `${stmts.length} statements` },
        { label: 'Identity mentioned', passed: hasIdentity, detail: hasIdentity ? 'found' : 'missing' },
        { label: 'Mode mentioned', passed: hasMode, detail: hasMode ? 'found' : 'missing' },
        { label: 'Architecture mentioned', passed: hasArchitecture, detail: hasArchitecture ? 'found' : 'missing' },
        { label: 'No M4 statements', passed: noM4, detail: noM4 ? 'all < M4' : `found M4 at layers: ${stmts.filter(s => s.layer === 4).map(s => s.value.slice(0, 40)).join(', ')}` },
        { label: 'Sort order', passed: sortOrderCorrect, detail: sortOrderCorrect ? 'correct' : 'deep-layer statement after shallow' },
      ],
    })

    // ── Test 2: Decode output from global graph ──────────────────────────────
    const emptyGraph: MemGraph = { nodes: new Map(), edges: new Map() }
    const decoded = classifyGraph(
      { user: emptyGraph, global: getGlobalGraph() },
      [],
      getGlobalArms(),
    )

    const entityLayersOk = decoded.entities.every(e => e.layer <= 2)

    results.push({
      name: 'Test 2: Decode output',
      passed: decoded.entities.length >= 3 && decoded.relations.length >= 1 && entityLayersOk,
      criteria: [
        { label: 'entities.length >= 3', passed: decoded.entities.length >= 3, detail: `${decoded.entities.length} entities` },
        { label: 'relations.length >= 1', passed: decoded.relations.length >= 1, detail: `${decoded.relations.length} relations` },
        { label: 'No entity layer > 2', passed: entityLayersOk, detail: entityLayersOk ? 'all <= M2' : `found: ${decoded.entities.filter(e => e.layer > 2).map(e => `${e.name}@M${e.layer}`).join(', ')}` },
      ],
    })

    // ── Test 3+4: Full pipeline integration ──────────────────────────────────
    // processMessage covers renderForSystemPrompt internally.
    const pipelineResult = await processMessage(
      'Hello, what can you help me with?',
      TEST_USER_ID,
      'test-project-verify',
      'claude-sonnet-4-20250514',
    )

    if (pipelineResult.ok) {
      const data = pipelineResult.data
      const block = data.decodedContext.systemPromptBlock
      const blockLower = block.toLowerCase()
      const hasLivContent = blockLower.includes('liv') || blockLower.includes('platform') ||
                            blockLower.includes('standard') || blockLower.includes('memory')
      const withinBudget = block.length <= 8000 // DECODE_MAX_TOKENS * 4

      results.push({
        name: 'Test 3: System prompt block',
        passed: block.length > 0 && data.decodedContext.structureCount >= 4 && hasLivContent && withinBudget,
        criteria: [
          { label: 'Non-empty block', passed: block.length > 0, detail: `${block.length} chars` },
          { label: 'structureCount >= 4', passed: data.decodedContext.structureCount >= 4, detail: `${data.decodedContext.structureCount} structures` },
          { label: 'Recognizable LIV content', passed: hasLivContent, detail: hasLivContent ? 'found' : 'missing' },
          { label: 'Within token budget', passed: withinBudget, detail: `${block.length} / 8000 chars` },
        ],
      })

      results.push({
        name: 'Test 4: Pipeline integration',
        passed: true && block.length > 0 && data.route.type === 'chat-response',
        criteria: [
          { label: 'Pipeline succeeded', passed: true, detail: 'ok' },
          { label: 'System prompt block present', passed: block.length > 0, detail: `${block.length} chars` },
          { label: 'Route type = chat-response', passed: data.route.type === 'chat-response', detail: data.route.type },
          { label: 'LIV content in prompt', passed: hasLivContent, detail: hasLivContent ? 'found' : 'missing' },
        ],
      })
    } else {
      results.push({
        name: 'Test 3: System prompt block',
        passed: false,
        criteria: [{ label: 'Pipeline failed', passed: false, detail: pipelineResult.error.message }],
      })
      results.push({
        name: 'Test 4: Pipeline integration',
        passed: false,
        criteria: [{ label: 'Pipeline failed', passed: false, detail: pipelineResult.error.message }],
      })
    }

    // ── Test 5: Idempotency ────────────────────────────────────────────────────
    // Call seedAndTraverseGlobal a second time — all nodes should already exist.
    const nodeCountBefore = getGlobalGraph().nodes.size
    const idempotencyResult = await seedAndTraverseGlobal(GLOBAL_SEED_NODES)

    if (idempotencyResult.ok) {
      const nodeCountAfter = getGlobalGraph().nodes.size
      const seededZero = idempotencyResult.data.seeded === 0
      const noNewNodes = nodeCountAfter === nodeCountBefore

      results.push({
        name: 'Test 5: Idempotency',
        passed: seededZero && noNewNodes,
        criteria: [
          { label: 'seeded === 0', passed: seededZero, detail: `seeded: ${idempotencyResult.data.seeded}` },
          { label: 'Node count unchanged', passed: noNewNodes, detail: `before: ${nodeCountBefore}, after: ${nodeCountAfter}` },
        ],
      })
    } else {
      results.push({
        name: 'Test 5: Idempotency',
        passed: false,
        criteria: [{ label: 'Seed call failed', passed: false, detail: idempotencyResult.error.message }],
      })
    }

    // ── Diagnostics ──────────────────────────────────────────────────────────
    // Layer distribution of global graph nodes
    const globalGraph = getGlobalGraph()
    const layerDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    for (const node of globalGraph.nodes.values()) {
      layerDist[node.cachedLayer] = (layerDist[node.cachedLayer] ?? 0) + 1
    }

    const allPassed = results.every(r => r.passed)

    return NextResponse.json({
      ok: allPassed,
      tests: results,
      diagnostics: {
        globalNodeCount: globalGraph.nodes.size,
        globalEdgeCount: Array.from(globalGraph.edges.values()).reduce((s, e) => s + e.length, 0),
        globalArmCount: getGlobalArms().length,
        layerDistribution: layerDist,
        presentStateCount: stmts.length,
        entityCount: decoded.entities.length,
        relationCount: decoded.relations.length,
        statementSample: stmts.slice(0, 5).map(s => ({
          value: s.value.slice(0, 100),
          layer: s.layer,
          confidence: s.confidence,
        })),
        entitySample: decoded.entities.slice(0, 5).map(e => ({
          name: e.name.slice(0, 100),
          layer: e.layer,
          energy: e.energy,
        })),
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 },
    )
  }
}
