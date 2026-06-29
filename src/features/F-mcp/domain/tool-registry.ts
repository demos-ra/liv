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
//   W-ATOM   MCP_TOOLS / TOOL_PRESENT / TOOL_TURN / TOOL_LOOKUP   F-mcp/config mcp-tools
// wires-out:
//   W-FN     listTools / initializeResult / planToolCall   F-mcp/R3 contract
// deps:
//   config  ../config/mcp-tools
//   config  ../config/mcp-protocol
//   R0      @/core/types/substrate-raw.types
// validated:  pending

import { MCP_TOOLS, TOOL_PRESENT, TOOL_TURN, TOOL_LOOKUP, TOOL_CAPTURE, TURN_ARGS } from '../config/mcp-tools'
import {
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  JSONRPC_INVALID_PARAMS,
  type McpToolDescriptor,
} from '../config/mcp-protocol'

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
// session). `turn` is TRANSPORT (cognition-turn contract — the door is transport): ONE call
// carries BOTH turns as { wearerText, reply, replyMarks, priorMarks }. The door no longer
// validates the emission SHAPE — that concern is the CORE contract's (F-present), the sole
// validator. So every field passes as `unknown`: emissionFromStructured narrows reply/marks
// at R3, recordScoredTurn surface-checks loud, and the recorder's wearerText guard absorbs a
// non-string. The door owns only wire-hygiene (arguments-is-object + foreign-field rejection
// against TURN_ARGS) — it imports nothing from F-present. userId is injected at R3 from the
// session; there is no `who` — the reply authors as 'llm' (the agent), the wearer is wearerText.
//
// SCOPE-SYMMETRY (carried): scope is CIRCUMSTANCE, not testimony — it is not a wire arg. The
// door stamps the writing connection (session.sessionId) at R3. A turn that still sends
// `scope` (or any field outside TURN_ARGS) is rejected as an unknown field by firstUnknownField.
export type ToolIntention =
  // present (summary) — the PURE read (1d strip): capture is un-welded off it (the dedicated
  // `capture` op below). summary carries NO payload; it only delivers. The read door ignores all
  // extras (RD law) — including a stray wearerText, which is no longer a capture payload here.
  | { tool: 'present' }
  // capture (the submit primitive, 1d) — the dedicated capture op the lifecycle hook fires at the
  // turn's ENTRY. Carries the submitted wearer prompt (wearerText); R3 stores it (captureWearerTurn)
  // and delivers the present. Dispatchable, not advertised (the model never picks it). TRANSPORT:
  // the core (captureWearerTurn) is the sole shape validator — a non-string wearerText absorbs → empty.
  | { tool: 'capture'; wearerText: unknown }
  | { tool: 'turn'; wearerText: unknown; reply: unknown; replyMarks: unknown; priorMarks: unknown }
  // search (the text-pivot) — region × lens. The door is TRANSPORT: it carries the raw args
  // through; the CORE (parseSearchSpec, F-present) is the sole validator (region defaults to
  // all, lens required, bad zones named) — symmetric with compose. R1 stays pure: no F-present
  // import, the R3 contract hands `raw` to parseSearchSpec → search().
  | { tool: 'lookup'; raw: Record<string, unknown> }

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
// write shape. present + lookup validate their selectors and ignore everything else.
function firstUnknownField(args: Record<string, unknown>, allowed: readonly string[]): string | null {
  for (const k of Object.keys(args)) if (!allowed.includes(k)) return k
  return null
}
function unknownFieldReject(tool: string, field: string): PlanResult {
  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `${tool}: unknown field "${field}" — the demanded shape admits no extras (additionalProperties:false)` }
}

export function planToolCall(name: unknown, args: unknown): PlanResult {
  if (name === TOOL_PRESENT) {
    // read door — no selectors, no payload; ignores ALL extras (lifecycle envelopes), RD law. 1d
    // strip: summary is a PURE read — capture moved to the dedicated `capture` op, so a stray
    // wearerText is just an ignored extra here, never a capture.
    return { ok: true, intention: { tool: 'present' } }
  }

  if (name === TOOL_CAPTURE) {
    // the submit-capture primitive (1d) — the hook fires it at the turn's entry with the submitted
    // wearer prompt. TRANSPORT: carry wearerText through; captureWearerTurn (core) is the sole shape
    // validator. Extras ignored, symmetric with the read door (a capture carries one payload, no testimony).
    const wearerText = isObject(args) ? args.wearerText : undefined
    return { ok: true, intention: { tool: 'capture', wearerText } }
  }

  if (name === TOOL_TURN) {
    // TRANSPORT + WIRE-HYGIENE ONLY (cognition-turn contract — the door is transport). The
    // door checks that arguments is an object and rejects FOREIGN fields against the tool's
    // own arg names (TURN_ARGS, the write-door extras allow-list — a standing wire policy). It
    // does NOT validate the emission SHAPE: that is the CORE contract's concern (F-present),
    // the sole validator, which re-checks every field — emissionFromStructured narrows the
    // unknown reply/marks, recordScoredTurn surface-checks the marks loud, and the recorder's
    // wearerText guard absorbs a non-string. The fields pass through as unknown; the door
    // imports nothing from F-present.
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'turn: arguments object required' }
    }
    const extra = firstUnknownField(args, TURN_ARGS)
    if (extra) return unknownFieldReject('turn', extra)
    return { ok: true, intention: { tool: 'turn', wearerText: args.wearerText, reply: args.reply, replyMarks: args.replyMarks, priorMarks: args.priorMarks } }
  }

  if (name === TOOL_LOOKUP) {
    if (!isObject(args)) {
      return { ok: false, code: JSONRPC_INVALID_PARAMS, message: 'search: arguments object required' }
    }
    // read door (TRANSPORT) — region × lens. The core (parseSearchSpec) validates and is the
    // sole validator; extras are ignored (no testimony). The raw args ride to R3 unchanged.
    return { ok: true, intention: { tool: 'lookup', raw: args } }
  }

  return { ok: false, code: JSONRPC_INVALID_PARAMS, message: `unknown tool: ${String(name)}` }
}
