// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [F-mcp/R1]
// Built with LIV · livai.dev
// [F-mcp/domain/tool-registry.ts]
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      R1
// wires-in:
//   W-ATOM   MCP_TOOLS / WHO_VALUES   F-mcp/config mcp-tools
//   W-ATOM   Who                      @/core/types/substrate-raw.types
// wires-out:
//   W-FN     listTools / initializeResult / planToolCall   F-mcp/R3 contract
// deps:
//   config  ../config/mcp-tools
//   config  ../config/mcp-protocol
//   R0      @/core/types/substrate-raw.types
// validated:  pending

import { MCP_TOOLS, TOOL_PRESENT, TOOL_WRITE, TOOL_GRID, WHO_VALUES } from '../config/mcp-tools'
import {
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  JSONRPC_INVALID_PARAMS,
  type McpToolDescriptor,
} from '../config/mcp-protocol'
import type { Who } from '@/core/types/substrate-raw.types'

// R1 — pure tool mechanics. Lists the tool descriptors, builds the MCP
// initialize result, and plans a tools/call by validating its arguments
// fail-closed. Returns an INTENTION (a typed description of what to do); it
// performs no I/O. The R3 contract executes the intention against the in-process
// LIV surfaces. Pure: no slice contract imports, no DB, no network.

export function listTools(): readonly McpToolDescriptor[] {
  return MCP_TOOLS
}

export function initializeResult(): {
  protocolVersion: string
  capabilities: { tools: Record<string, unknown> }
  serverInfo: { name: string; version: string }
} {
  return {
    protocolVersion: MCP_PROTOCOL_VERSION,
    capabilities: { tools: {} },
    serverInfo: { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
  }
}

// What a validated tool call intends. `present` carries no payload (identity is
// the session). `write` is DEMANDED per author (sprint-wire-cognition Shot 4):
//   - wearer → words-only ({ text }); the wearer never emits marks.
//   - llm    → pair-scored (§FORK-A: { reply, replyMarks, priorMarks }); the speaker
//     scores its own turn. Marks pass as unknown[] — STRUCTURE is validated here (R1,
//     pure: present + array), the mark GATE runs at R3 via emissionFromStructured (one
//     gate, no copy). userId is injected at the R3 contract from the session.
//
// SCOPE-SYMMETRY (scope-symmetry delta): scope is CIRCUMSTANCE, not testimony — it left
// the demanded schema. Speakers send only what they author; the door stamps the writing
// connection (session.sessionId) at R3. A turn that still sends `scope` is now rejected
// as an unknown field by firstUnknownField — intentional, zero added code.
export type ToolIntention =
  | { tool: 'present' }
  | { tool: 'write'; who: 'wearer'; text: string }
  | { tool: 'write'; who: 'llm'; reply: string; replyMarks: unknown[]; priorMarks: unknown[] }
  | { tool: 'grid'; who: Who; sc: number }   // 3R.2 — fetch one turn's canonical cell grid

export type PlanResult =
  | { ok: true; intention: ToolIntention }
  | { ok: false; code: number; message: string }

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isWho(v: unknown): v is Who {
  return typeof v === 'string' && (WHO_VALUES as readonly string[]).includes(v)
}

// READ-DOOR LAW (RD): read doors ignore extras (a read carries no testimony, so
// extras-rejection protects nothing — and it bounces clients whose lifecycle attaches
// envelope baggage, e.g. a SessionStart hook passing its event envelope as arguments);
// write doors demand (FIX-2). So the extras gate below is the WRITE door's enforcement
// only: planToolCall is the authoritative validator — the schema advertises, the write
// door enforces. An unknown top-level field on a WRITE is rejected fail-closed with a
// law-naming message. No second layer, no middleware — just the demanded allow-list per
// write shape. present + grid validate their selectors and ignore everything else.
function firstUnknownField(args: Record<string, unknown>, allowed: readonly string[]): string | null {
  for (const k of Object.keys(args)) if (!allowed.includes(k)) return k
  return null
}
function unknownFieldReject(tool: string, field: string): PlanResult {
  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `${tool}: unknown field "${field}" — the demanded shape admits no extras (additionalProperties:false)` }
}

export function planToolCall(name: unknown, args: unknown): PlanResult {
  if (name === TOOL_PRESENT) {
    // read door — no selectors, no testimony; ignores any extras (lifecycle envelopes).
    return { ok: true, intention: { tool: 'present' } }
  }

  if (name === TOOL_WRITE) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: arguments object required' }
    }
    if (!isWho(args.who)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: who must be one of wearer | llm | program' }
    }
    // program: rejected at v2 — the wire carries only wearer words + llm pair-scored
    // turns. A program turn is not speaker-scored, and LIV never invents structure.
    if (args.who === 'program') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: no program writer over the wire at v2 (§no-server-side-marking — only wearer words and llm pair-scored turns cross the wire)' }
    }
    // wearer: words-only by design (the wearer never emits marks).
    if (args.who === 'wearer') {
      if (typeof args.text !== 'string') {
        return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: wearer turn requires text (words-only — the wearer never emits marks)' }
      }
      const extra = firstUnknownField(args, ['who', 'text'])
      if (extra) return unknownFieldReject('write', extra)
      return { ok: true, intention: { tool: 'write', who: 'wearer', text: args.text } }
    }
    // llm: pair-scored (§FORK-A). reply authoritative; replyMarks + priorMarks REQUIRED
    // (arrays may be present-but-empty, never absent). The mark gate runs at R3.
    if (typeof args.reply !== 'string') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: llm turn requires reply (§FORK-A — the reply text is authoritative)' }
    }
    if (!Array.isArray(args.replyMarks) || !Array.isArray(args.priorMarks)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: llm turn requires replyMarks and priorMarks (§FORK-A — the speaker scores its own turn; arrays may be empty but never absent)' }
    }
    const extra = firstUnknownField(args, ['who', 'reply', 'replyMarks', 'priorMarks'])
    if (extra) return unknownFieldReject('write', extra)
    return { ok: true, intention: { tool: 'write', who: 'llm', reply: args.reply, replyMarks: args.replyMarks, priorMarks: args.priorMarks } }
  }

  if (name === TOOL_GRID) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'grid: arguments object required' }
    }
    // grid reads a turn's cells; only the two cognition channels record turns —
    // program is not a wire turn-writer at v2, so it has no grid to fetch.
    if (args.who !== 'wearer' && args.who !== 'llm') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'grid: who must be wearer | llm (only cognition turns have a grid)' }
    }
    if (typeof args.sc !== 'number' || !Number.isFinite(args.sc)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'grid: sc must be a number (the turn position)' }
    }
    // read door — selectors (who, sc) validated above; any extras are ignored.
    return { ok: true, intention: { tool: 'grid', who: args.who, sc: args.sc } }
  }

  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `unknown tool: ${String(name)}` }
}
