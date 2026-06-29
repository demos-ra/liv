// @liv-standard v1.5.2
// The universality-by-derivation GATE (L0 hard requirement). The shipped Claude Code plugin's
// hooks.json must be DERIVED from the in-tree contract — pinned equal to deriveClaudeCodePluginHooks()
// so it can NEVER drift into hand-config. One source (the contract) → one derived artifact. If the
// contract changes, regenerate: `npx tsx scripts/emit-plugin-hooks.ts`; this test fails until the
// shipped artifact matches the contract again.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { deriveClaudeCodePluginHooks } from '../enforcement-adapter'

test('plugin hooks.json is DERIVED from the contract (no drift, zero hand-config)', () => {
  const path = fileURLToPath(new URL('../../../../../plugin/hooks/hooks.json', import.meta.url))
  const shipped = JSON.parse(readFileSync(path, 'utf8'))
  assert.deepEqual(
    shipped,
    deriveClaudeCodePluginHooks(),
    'plugin/hooks/hooks.json must equal deriveClaudeCodePluginHooks() — regenerate with scripts/emit-plugin-hooks.ts',
  )
})

test('the derived hook fires liv:capture at UserPromptSubmit with wearerText=${prompt}; NO Stop hook', () => {
  const { hooks } = deriveClaudeCodePluginHooks()
  const entry = hooks['UserPromptSubmit']?.[0]?.hooks?.[0]
  assert.deepEqual(entry, { type: 'mcp_tool', server: 'liv', tool: 'capture', input: { wearerText: '${prompt}' } })
  // M10 redline: write is the model's compose call, not a hook — so no Stop trigger is emitted.
  assert.equal(hooks['Stop'], undefined, "no Stop hook — write-with-marks is the model's compose")
})
