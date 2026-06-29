// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (M10 — the hook, role-first)
// [F-mcp/contract/__tests__/enforcement-adapter.test.ts]
// Built with LIV · livai.dev
//
// A3 — the in-tree L1 wire contract + L2 lifecycle home. Per-turn enforcement (M10, role-first):
//   UserPromptSubmit → capture(M1)+deliver(M2) (summary) ; Stop → write(M7) (compose).
//   NOT SessionStart/SessionEnd. The no-lifecycle fallback = voluntary compose + an honest fail flag.
//
// Run: npx tsx --test src/features/F-mcp/contract/__tests__/enforcement-adapter.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  enforcementPlan,
  opsForRole,
  CLAIM_CODE_BINDING,
  voluntaryFallbackBinding,
} from '../enforcement-adapter'
import { TOOL_TURN, TOOL_CAPTURE } from '../../config/mcp-tools'

// ── M10 role-first: a role maps to its wire op (the one mapping) ────────────────────
test('opsForRole: capture-deliver → the dedicated capture op (1d un-weld); write → the turn record (compose)', () => {
  assert.deepEqual(opsForRole('capture-deliver'), [TOOL_CAPTURE])
  assert.deepEqual(opsForRole('write'), [TOOL_TURN])
})

// ── the CLAIM-CODE binding: the turn boundary is UserPromptSubmit…Stop ──────────────
test('UserPromptSubmit fires capture (the submit primitive); Stop fires write (compose)', () => {
  assert.deepEqual(enforcementPlan('UserPromptSubmit', CLAIM_CODE_BINDING), [TOOL_CAPTURE])
  assert.deepEqual(enforcementPlan('Stop', CLAIM_CODE_BINDING), [TOOL_TURN])
})

// ── NOT SessionStart / SessionEnd — per-turn, not per-session ───────────────────────
test('SessionStart and SessionEnd fire NOTHING (per-turn granularity, not per-session)', () => {
  assert.deepEqual(enforcementPlan('SessionStart', CLAIM_CODE_BINDING), [])
  assert.deepEqual(enforcementPlan('SessionEnd', CLAIM_CODE_BINDING), [])
})

// ── an unbound / foreign lifecycle event is not an error — it fires nothing ──────────
test('a foreign lifecycle event fires nothing (not a turn boundary, not an error)', () => {
  assert.deepEqual(enforcementPlan('PreToolUse', CLAIM_CODE_BINDING), [])
})

// ── the no-lifecycle fallback — voluntary compose + an honest fail flag ──────────────
test('voluntaryFallbackBinding: no enforced firing; the absent-capture flag is honest (not silent)', () => {
  const { binding, flag } = voluntaryFallbackBinding()
  // No lifecycle events bound → nothing is enforced.
  assert.deepEqual(enforcementPlan('UserPromptSubmit', binding), [])
  assert.deepEqual(enforcementPlan('Stop', binding), [])
  // The absence of the capture guarantee is FLAGGED, never silent.
  assert.equal(flag.absentCapture, true)
  assert.match(flag.reason, /capture/i)
})

// ── A7: a second agent is one new binding — the role mapping is unchanged ────────────
test('a second agent binds its own event names to the SAME roles (zero core change)', () => {
  const secondAgentBinding = { 'prompt.received': 'capture-deliver' as const, 'turn.done': 'write' as const }
  assert.deepEqual(enforcementPlan('prompt.received', secondAgentBinding), [TOOL_CAPTURE])
  assert.deepEqual(enforcementPlan('turn.done', secondAgentBinding), [TOOL_TURN])
})
