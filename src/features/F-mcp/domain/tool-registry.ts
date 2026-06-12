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

import { MCP_TOOLS, TOOL_PRESENT, TOOL_TURN, TOOL_LOOKUP } from '../config/mcp-tools'
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

// What a validated tool call intends. `present` carries no payload (identity is the
// session). `turn` is DEMANDED (sprint-wire-economy R1) — ONE call carries BOTH turns:
//   { wearerText, reply, replyMarks, priorMarks } — all four required; the mark arrays may
//   be empty but never absent. Marks pass as unknown[] — STRUCTURE is validated here (R1,
//   pure: present + array); the mark GATE + the index↔surface validation run at R3 (via
//   emissionFromStructured + the recorder's locateWordMarks — one gate, no copy). userId is
//   injected at the R3 contract from the session; there is no `who` — the reply authors as
//   'llm' (the agent), the wearer is wearerText.
//
// SCOPE-SYMMETRY (carried): scope is CIRCUMSTANCE, not testimony — it is not in the demanded
// shape. The door stamps the writing connection (session.sessionId) at R3. A turn that still
// sends `scope` (or any extra) is rejected as an unknown field by firstUnknownField.
export type ToolIntention =
  | { tool: 'present' }
  | { tool: 'turn'; wearerText: string; reply: string; replyMarks: unknown[]; priorMarks: unknown[] }
  // lookup (R8) — the navigation read control: turn | span | thing → numbered cells. The
  // selector is declared inline (structurally == F-present's LookupSelector) so R1 stays
  // pure — no F-present import; the R3 contract passes it straight to lookup().
  | { tool: 'lookup'; selector:
      | { kind: 'turn'; who: Who; sc: number }
      | { kind: 'span'; from: number; to: number; who?: Who }
      | { kind: 'thing'; name: string } }

export type PlanResult =
  | { ok: true; intention: ToolIntention }
  | { ok: false; code: number; message: string }

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
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

  if (name === TOOL_TURN) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'turn: arguments object required' }
    }
    // ONE call, BOTH turns (§FORK-A + R1). wearerText: the person's verbatim words; reply:
    // authoritative; replyMarks + priorMarks REQUIRED (arrays may be present-but-empty,
    // never absent). The mark gate + index↔surface validation run at R3.
    if (typeof args.wearerText !== 'string') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'turn: requires wearerText (the person’s verbatim words — one call records both turns; LIV cuts it)' }
    }
    if (typeof args.reply !== 'string') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'turn: requires reply (§FORK-A — the reply text is authoritative)' }
    }
    if (!Array.isArray(args.replyMarks) || !Array.isArray(args.priorMarks)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'turn: requires replyMarks and priorMarks (the speaker scores BOTH turns; arrays may be empty but never absent)' }
    }
    const extra = firstUnknownField(args, ['wearerText', 'reply', 'replyMarks', 'priorMarks'])
    if (extra) return unknownFieldReject('turn', extra)
    return { ok: true, intention: { tool: 'turn', wearerText: args.wearerText, reply: args.reply, replyMarks: args.replyMarks, priorMarks: args.priorMarks } }
  }

  if (name === TOOL_LOOKUP) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup: arguments object required' }
    }
    // read door — the selector is validated per kind; any extras are ignored (no testimony).
    if (args.kind === 'turn') {
      if (args.who !== 'wearer' && args.who !== 'llm') {
        return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup turn: who must be wearer | llm (only cognition turns have cells)' }
      }
      if (typeof args.sc !== 'number' || !Number.isFinite(args.sc)) {
        return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup turn: sc must be a number (the turn position)' }
      }
      return { ok: true, intention: { tool: 'lookup', selector: { kind: 'turn', who: args.who, sc: args.sc } } }
    }
    if (args.kind === 'span') {
      if (typeof args.from !== 'number' || !Number.isFinite(args.from) || typeof args.to !== 'number' || !Number.isFinite(args.to)) {
        return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup span: from and to must be numbers (the sc range)' }
      }
      const who = args.who === 'wearer' || args.who === 'llm' ? args.who : undefined
      return { ok: true, intention: { tool: 'lookup', selector: { kind: 'span', from: args.from, to: args.to, who } } }
    }
    if (args.kind === 'thing') {
      if (typeof args.name !== 'string') {
        return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup thing: name must be a string (the thing to fetch)' }
      }
      return { ok: true, intention: { tool: 'lookup', selector: { kind: 'thing', name: args.name } } }
    }
    return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'lookup: kind must be turn | span | thing' }
  }

  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `unknown tool: ${String(name)}` }
}
