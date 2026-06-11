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
//   W-FN     recordScoredTurn   F-present/R3 present-contract   (Shot 4 — llm pair-scored turn)
//   W-FN     emissionFromStructured  F-present/R3 present-contract  (Shot 4 — the narrowing/gate)
//   W-ATOM   COIN_MANUAL        F-present/R3 present-contract   (Shot 4 — manual-with-present)
//   W-FN     writeRawTurn       F-memory/R3 substrate-contract
//   W-FN     cutCells           F-memory/R3 substrate-contract
//   W-FN     readTranscript     F-memory/R3 substrate-contract   (3R.2 — grid: fetch one turn's cells)
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
import { readPresent, recordScoredTurn, emissionFromStructured, COIN_MANUAL } from '@/features/F-present/contract/present-contract'
import { writeRawTurn, cutCells, readTranscript } from '@/features/F-memory/contract/substrate-contract'
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
        const intention = plan.intention

        // present → MANUAL + present, one return, manual first (mirrors the native
        // system-message order: instruction first so "below" is true). COIN_MANUAL
        // comes from its one home via F-present R3.
        if (intention.tool === 'present') {
          const present = await readPresent(session.userId)
          return buildResult(id, toolText(`${COIN_MANUAL}\n\n${present}`))
        }

        // grid (3R.2) → the canonical cell grid of one turn (ALL cells — the cutter's
        // truth), so the caller COPIES coordinates instead of counting them from prose.
        // Turn not found → a stating { ok: false }, never an exception. Uses the already-
        // imported substrate R3 surface; no new cross-slice import.
        if (intention.tool === 'grid') {
          const turn = (await readTranscript(session.userId)).find(t => t.who === intention.who && t.sc === intention.sc)
          if (!turn) {
            return buildResult(id, toolText(JSON.stringify({ ok: false, who: intention.who, sc: intention.sc, message: 'no such turn (who, sc) in your substrate' })))
          }
          return buildResult(id, toolText(JSON.stringify({
            ok: true, who: turn.who, sc: turn.sc, cells: turn.words.map(c => ({ pos: c.pos, word: c.word })),
          })))
        }

        // write — DEMANDED per author (Shot 4). userId is ALWAYS the session's.
        // scope = stamped circumstance (the writing connection), symmetric with native's
        // route-stamped projectId — speakers never declare circumstance.
        if (intention.who === 'llm') {
          // llm turn → narrow through emissionFromStructured (the SAME gate the native
          // path uses — one gate, no copy), then record the pair-scored turn via the
          // shared recorder. Return the canonical cut so the caller holds exact coords.
          const emission = emissionFromStructured({
            reply: intention.reply, replyMarks: intention.replyMarks, priorMarks: intention.priorMarks,
          })
          const recorded = await recordScoredTurn(emission, 'llm', session.userId, session.sessionId)
          return buildResult(id, toolText(JSON.stringify({
            ok: true, sc: recorded.sc, cells: recorded.cells.map(c => ({ pos: c.pos, word: c.word })),
          })))
        }

        // wearer turn → words-only (LIV cuts; the machine cuts, never the caller).
        const words = cutCells(intention.text)
        const sc = await writeRawTurn({ who: 'wearer', words, userId: session.userId, scope: session.sessionId })
        return buildResult(id, toolText(JSON.stringify({
          ok: true, sc, cells: words.map(c => ({ pos: c.pos, word: c.word })),
        })))
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
