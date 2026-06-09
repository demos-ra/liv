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

import { MCP_TOOLS, TOOL_PRESENT, TOOL_WRITE, WHO_VALUES } from '../config/mcp-tools'
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
// the session). `write` carries the validated authorship, raw text, and scope —
// userId is injected at the R3 contract from the session, never from the call.
export type ToolIntention =
  | { tool: 'present' }
  | { tool: 'write'; who: Who; text: string; scope: string }

export type PlanResult =
  | { ok: true; intention: ToolIntention }
  | { ok: false; code: number; message: string }

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isWho(v: unknown): v is Who {
  return typeof v === 'string' && (WHO_VALUES as readonly string[]).includes(v)
}

export function planToolCall(name: unknown, args: unknown): PlanResult {
  if (name === TOOL_PRESENT) {
    return { ok: true, intention: { tool: 'present' } }
  }

  if (name === TOOL_WRITE) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: arguments object required' }
    }
    if (!isWho(args.who)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: who must be one of wearer | llm | program' }
    }
    if (typeof args.text !== 'string') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: text must be a string' }
    }
    if (typeof args.scope !== 'string') {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'write: scope must be a string' }
    }
    return { ok: true, intention: { tool: 'write', who: args.who, text: args.text, scope: args.scope } }
  }

  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `unknown tool: ${String(name)}` }
}
