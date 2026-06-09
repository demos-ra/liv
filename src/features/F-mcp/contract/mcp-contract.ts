// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [F-mcp/R3]
// Built with LIV · livai.dev
// [F-mcp/contract/mcp-contract.ts]
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      R3
// wires-in:
//   W-FN     parseRequest / buildResult / buildError   F-mcp/R1 json-rpc
//   W-FN     listTools / initializeResult / planToolCall   F-mcp/R1 tool-registry
//   W-FN     readPresent        F-present/R3 present-contract
//   W-FN     writeRawTurn       F-memory/R3 substrate-contract
//   W-FN     cutCells           F-memory/R3 substrate-contract
//   W-ATOM   PerimeterSession   F-identity/R3 perimeter-consultation
// wires-out:
//   W-FN     handleMcpRequest   → src/app/api/mcp/route.ts (R4)
// deps:
//   R1  ../domain/json-rpc
//   R1  ../domain/tool-registry
//   config  ../config/mcp-protocol
//   R3  @/features/F-present/contract/present-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R3  @/features/F-identity/contract/perimeter-consultation
// validated:  pending

import { parseRequest, buildResult, buildError } from '../domain/json-rpc'
import { listTools, initializeResult, planToolCall } from '../domain/tool-registry'
import {
  JSONRPC_METHOD_NOT_FOUND,
  JSONRPC_INTERNAL_ERROR,
  type JsonRpcResponse,
  type McpToolResult,
} from '../config/mcp-protocol'
import { readPresent } from '@/features/F-present/contract/present-contract'
import { writeRawTurn, cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'

// R3 — the slice's sole public boundary and orchestration site. handleMcpRequest
// parses the JSON-RPC envelope (R1), dispatches the method, plans the tool call
// (R1), and executes the intention against the in-process LIV R3 surfaces. This
// is the ONLY file in F-mcp that imports another slice's contract.
//
// Identity joint (manager §2): userId is ALWAYS session.userId — never read from
// the request body. An agent cannot write to another wearer's substrate. The
// agent crosses as the wearer by delegation; session.userId IS the wearer's id.
//
// Fail-closed: any thrown error becomes a JSON-RPC internal-error envelope; no
// internal detail leaks. Notifications (no id) receive no response (null).

function toolText(text: string): McpToolResult {
  return { content: [{ type: 'text', text }] }
}

export async function handleMcpRequest(
  body: unknown,
  session: PerimeterSession,
): Promise<JsonRpcResponse | null> {
  const parsed = parseRequest(body)
  if (!parsed.ok) return parsed.error

  const { id, isNotification, method, params } = parsed.request

  try {
    switch (method) {
      case 'initialize':
        return buildResult(id, initializeResult())

      case 'notifications/initialized':
        return null

      case 'ping':
        return buildResult(id, {})

      case 'tools/list':
        return buildResult(id, { tools: listTools() })

      case 'tools/call': {
        const p = (typeof params === 'object' && params !== null ? params : {}) as {
          name?: unknown
          arguments?: unknown
        }
        const plan = planToolCall(p.name, p.arguments)
        if (!plan.ok) return buildError(id, plan.code, plan.message)

        if (plan.intention.tool === 'present') {
          const present = await readPresent(session.userId)
          return buildResult(id, toolText(present))
        }

        const { who, text, scope } = plan.intention
        const words = cutCells(text)
        const sc = await writeRawTurn({ who, words, userId: session.userId, scope })
        return buildResult(id, toolText(JSON.stringify({ ok: true, sc })))
      }

      default:
        if (isNotification) return null
        return buildError(id, JSONRPC_METHOD_NOT_FOUND, `method not found: ${method}`)
    }
  } catch {
    if (isNotification) return null
    return buildError(id, JSONRPC_INTERNAL_ERROR, 'internal error')
  }
}
