// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) — transport-safe advertisement
// [F-mcp/config/__tests__/mcp-tools.schema.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-transport T5 — pin every advertised tool schema against the Anthropic API
// tool-schema transport constraints. The root class this sprint closes: the wire was
// verified against LIV's own door but never against the CLIENT TRANSPORT STACK. The
// `write` tool's top-level `oneOf` was silently dropped by the client:
//   [ERROR] MCP server "liv" Skipping tool "write": its input schema uses top-level
//   oneOf, which the Anthropic API does not accept.
// This test is the regression record — if any tool reintroduces a transport-rejected
// construct, it fails here, before a client ever drops the tool.
//
// THE CONSTRAINT SET (T1 — established from the live client testimony):
//   C1. top-level inputSchema.type MUST be 'object'.
//   C2. NO top-level oneOf / anyOf / allOf — the Anthropic API rejects them and the
//       client drops the WHOLE tool (the verified failure mode).
//   C3. top-level MUST declare a `properties` object (the API expects an object schema).
// (Nested oneOf/anyOf/allOf inside item schemas were not exercised by the client and are
//  not present in the surface; if ever added, extend this set and re-verify live.)
//
// Imports ONLY mcp-tools (its imports are type-only → erased), so it runs under bare
// `tsx --test` with zero `@/` resolution.
// Run: npx tsx --test src/features/F-mcp/config/__tests__/mcp-tools.schema.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MCP_TOOLS, TOOL_TURN } from '../mcp-tools'

const FORBIDDEN_TOP_LEVEL = ['oneOf', 'anyOf', 'allOf'] as const

// ── C1–C3 hold for EVERY tool that DECLARES a config inputSchema ─────────────────
// (cognition-turn contract) The `turn` schema is now a DERIVED view — projected at R3 as
// projectEmissionSchema(MCP_SITUATION), not hand-declared at config. Its transport-safety
// (flat object, no top-level oneOf/anyOf/allOf, has properties) is pinned against the
// PROJECTION in F-mcp/domain/__tests__/wire-turn. Here we pin the config-declared schemas
// (present, lookup) and that turn correctly declares NONE.
test('every config-declared tool schema is transport-safe (type:object, no top-level oneOf/anyOf/allOf, has properties)', () => {
  assert.ok(MCP_TOOLS.length >= 1, 'there is at least one tool')
  for (const tool of MCP_TOOLS) {
    if (!tool.inputSchema) continue                                  // turn defers its schema to R3
    const s = tool.inputSchema as Record<string, unknown>
    assert.equal(s.type, 'object', `${tool.name}: C1 — top-level type must be 'object'`)            // C1
    for (const k of FORBIDDEN_TOP_LEVEL) {
      assert.ok(!(k in s), `${tool.name}: C2 — top-level "${k}" is transport-rejected (client drops the tool)`) // C2
    }
    assert.equal(typeof s.properties, 'object', `${tool.name}: C3 — top-level must declare 'properties'`)        // C3
    assert.ok(s.properties !== null, `${tool.name}: C3 — 'properties' must be an object`)
  }
})

// ── turn's schema is the core contract, projected at R3 — NOT hand-declared at config ──
test('turn declares no config inputSchema (its emission shape is projected at R3)', () => {
  const turn = MCP_TOOLS.find(t => t.name === TOOL_TURN)
  assert.ok(turn, 'the turn tool exists')
  assert.equal(turn!.inputSchema, undefined,
    'the emission shape is the one core contract, projected at R3 (projectEmissionSchema) — never re-declared at config')
})

// ── reads admit envelope baggage (read-door law) — advertised honestly ──────────
test('read doors (summary, search) advertise additionalProperties:true (extras ignored)', () => {
  for (const name of ['summary', 'search']) {
    const tool = MCP_TOOLS.find(t => t.name === name)
    assert.ok(tool, `${name} exists`)
    assert.equal((tool!.inputSchema as { additionalProperties?: boolean }).additionalProperties, true,
      `${name}: reads ignore extras — additionalProperties advertised true`)
  }
})
