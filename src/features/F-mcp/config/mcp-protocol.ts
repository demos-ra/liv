// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [F-mcp/config]
// Built with LIV · livai.dev
// [F-mcp/config/mcp-protocol.ts]
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      config
// wires-out:
//   W-ATOM   JsonRpc* / Mcp*   F-mcp/R1 domain, F-mcp/R3 contract
// validated:  pending

export const JSONRPC_VERSION = '2.0' as const

// MCP transport protocol surface (JSON-RPC 2.0 envelope + MCP tool shapes).
// Pure types and literal constants only — no I/O, no slice imports. The wire
// speaks JSON-RPC at the door; these atoms are its vocabulary. MCP revision and
// JSON-RPC error codes are fixed by their respective specs (not LIV decisions).

export const MCP_PROTOCOL_VERSION = '2025-06-18' as const
export const MCP_SERVER_NAME = 'liv' as const
export const MCP_SERVER_VERSION = '1.0.0' as const

// JSON-RPC 2.0 standard error codes (spec-fixed).
export const JSONRPC_PARSE_ERROR = -32700 as const
export const JSONRPC_INVALID_REQUEST = -32600 as const
export const JSONRPC_METHOD_NOT_FOUND = -32601 as const
export const JSONRPC_INVALID_PARAMS = -32602 as const
export const JSONRPC_INTERNAL_ERROR = -32603 as const
// Implementation-defined server-error range (-32000..-32099). Auth rejection.
export const JSONRPC_UNAUTHENTICATED = -32001 as const

export type JsonRpcId = string | number | null

export interface JsonRpcSuccess {
  jsonrpc: '2.0'
  id: JsonRpcId
  result: unknown
}

export interface JsonRpcError {
  jsonrpc: '2.0'
  id: JsonRpcId
  error: { code: number; message: string; data?: unknown }
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcError

export interface McpToolDescriptor {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface McpTextContent {
  type: 'text'
  text: string
}

export interface McpToolResult {
  content: McpTextContent[]
  isError?: boolean
}
