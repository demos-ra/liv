// Emit the LIV Claude Code plugin's hooks.json FROM the contract — the universal-by-derivation
// step (L0 hard requirement). One source: deriveClaudeCodePluginHooks() (F-mcp enforcement-adapter)
// derives the capture hook purely from CLAIM_CODE_BINDING + opsForRole + the prompt-arg map. This
// script writes that output to plugin/hooks/hooks.json so the shipped artifact is DERIVED, never
// hand-authored. A test (plugin-hook-derivation.test.ts) pins the committed file equal to this
// emitter, so the artifact can never drift from the contract.
//
//   run:  npx tsx scripts/emit-plugin-hooks.ts

import { writeFileSync, mkdirSync } from 'node:fs'
import { deriveClaudeCodePluginHooks } from '../src/features/F-mcp/contract/enforcement-adapter'

const hooks = deriveClaudeCodePluginHooks()
mkdirSync('plugin/hooks', { recursive: true })
writeFileSync('plugin/hooks/hooks.json', JSON.stringify(hooks, null, 2) + '\n')
console.log('emitted plugin/hooks/hooks.json from the contract (deriveClaudeCodePluginHooks)')
