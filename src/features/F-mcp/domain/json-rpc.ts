// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [F-mcp/R1]
// Built with LIV · livai.dev
// [F-mcp/domain/json-rpc.ts]
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      R1
// wires-in:
//   W-ATOM   JsonRpc*   F-mcp/config mcp-protocol
// wires-out:
//   W-FN     parseRequest / buildResult / buildError   F-mcp/R3 contract
// deps:
//   config  ../config/mcp-protocol
// validated:  pending

import {
  JSONRPC_VERSION,
  JSONRPC_PARSE_ERROR,
  JSONRPC_INVALID_REQUEST,
  type JsonRpcId,
  type JsonRpcResponse,
} from '../config/mcp-protocol'

// R1 — pure JSON-RPC 2.0 envelope mechanics. Parse an inbound body into a typed
// request (fail-closed on shape), and build success/error response envelopes. No
// I/O, no slice imports, no ambient state — deterministic functions only.
//
// `isNotification` is true when the inbound object carried no `id` member;
// JSON-RPC notifications receive no response.

export interface ParsedRequest {
  id: JsonRpcId
  isNotification: boolean
  method: string
  params: unknown
}

export type ParseResult =
  | { ok: true; request: ParsedRequest }
  | { ok: false; error: JsonRpcResponse }

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function parseRequest(body: unknown): ParseResult {
  if (!isObject(body)) {
    return { ok: false, error: buildError(null, JSONRPC_PARSE_ERROR, 'parse error: body is not a JSON-RPC object') }
  }

  if (body.jsonrpc !== JSONRPC_VERSION) {
    return { ok: false, error: buildError(null, JSONRPC_INVALID_REQUEST, 'invalid request: jsonrpc must be "2.0"') }
  }

  if (typeof body.method !== 'string') {
    return { ok: false, error: buildError(null, JSONRPC_INVALID_REQUEST, 'invalid request: method must be a string') }
  }

  const hasId = 'id' in body
  const rawId = hasId ? body.id : null
  const idValid = rawId === null || typeof rawId === 'string' || typeof rawId === 'number'
  if (hasId && !idValid) {
    return { ok: false, error: buildError(null, JSONRPC_INVALID_REQUEST, 'invalid request: id must be string, number, or null') }
  }

  return {
    ok: true,
    request: {
      id: idValid ? (rawId as JsonRpcId) : null,
      isNotification: !hasId,
      method: body.method,
      params: body.params,
    },
  }
}

export function buildResult(id: JsonRpcId, result: unknown): JsonRpcResponse {
  return { jsonrpc: JSONRPC_VERSION, id, result }
}

export function buildError(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcResponse {
  const error = data === undefined ? { code, message } : { code, message, data }
  return { jsonrpc: JSONRPC_VERSION, id, error }
}
