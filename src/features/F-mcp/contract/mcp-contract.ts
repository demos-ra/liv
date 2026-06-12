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
//   W-FN     readPresent        F-present/R3 present-contract   (turn response + present tool)
//   W-FN     recordScoredTurn   F-present/R3 present-contract   (turn door — records BOTH turns)
//   W-FN     emissionFromStructured  F-present/R3 present-contract  (the narrowing/gate)
//   W-ATOM   MarkSurfaceError   F-present/R3 present-contract   (claim+validate — loud, atomic reject)
//   W-ATOM   COIN_MANUAL        F-present/R3 present-contract   (manual rides the turn description — once-channel)
//   W-ATOM   TOOL_TURN          F-mcp/config mcp-tools          (manual injection target at tools/list)
//   W-FN     lookup             F-present/R3 present-contract   (R8 read control — turn|span|thing)
//   W-ATOM   PRESENT_BUNDLES    F-present/R3 present-contract   (R7 — the wire bundle: tables only)
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
import { TOOL_TURN } from '../config/mcp-tools'
import {
  JSONRPC_METHOD_NOT_FOUND,
  JSONRPC_INTERNAL_ERROR,
  JSONRPC_INVALID_PARAMS,
  type JsonRpcResponse,
  type McpToolResult,
} from '../config/mcp-protocol'
import { readPresent, lookup, PRESENT_BUNDLES, recordScoredTurn, emissionFromStructured, MarkSurfaceError, COIN_MANUAL } from '@/features/F-present/contract/present-contract'
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
        // The fill manual rides the `turn` tool description — a ONCE-channel (R2): the
        // client fetches tools/list once at session start, so the manual crosses the wire
        // once, never per turn. One home (COIN_MANUAL via F-present R3), injected here.
        return buildResult(id, {
          tools: listTools().map(t => t.name === TOOL_TURN ? { ...t, description: `${t.description}\n\n${COIN_MANUAL}` } : t),
        })

      case 'tools/call': {
        const p = (typeof params === 'object' && params !== null ? params : {}) as {
          name?: unknown
          arguments?: unknown
        }
        const plan = planToolCall(p.name, p.arguments)
        if (!plan.ok) return buildError(id, plan.code, plan.message)
        const intention = plan.intention

        // present → the fresh present, ONLY, in the WIRE bundle (R7: both tables, no
        // transcript — the transcript is fetched via lookup, never carried per turn). The
        // manual rides the `turn` description (a once-channel, R2), so zero manual tokens here.
        if (intention.tool === 'present') {
          return buildResult(id, toolText(await readPresent(session.userId, PRESENT_BUNDLES.wire)))
        }

        // lookup (R8) → numbered cells (turn | span | thing) so the caller COPIES coordinates
        // instead of counting them from prose. The read control lives in F-present (it holds
        // the dimension a `thing` selector needs); a miss is a stating { ok: false }, never
        // an exception.
        if (intention.tool === 'lookup') {
          return buildResult(id, toolText(JSON.stringify(await lookup(session.userId, intention.selector))))
        }

        // turn — DEMANDED (R1): ONE call carries BOTH turns. userId is ALWAYS the session's;
        // scope = stamped circumstance (session.sessionId), symmetric with native's
        // route-stamped projectId — speakers never declare circumstance. emissionFromStructured
        // narrows through the SAME gate the native path uses (one gate, no copy); the recorder
        // cuts + writes BOTH turns and surface-validates both mark sets.
        const emission = emissionFromStructured({
          reply: intention.reply, replyMarks: intention.replyMarks, priorMarks: intention.priorMarks,
        })
        let recorded
        try {
          recorded = await recordScoredTurn(emission, 'llm', session.userId, session.sessionId, { text: intention.wearerText })
        } catch (err) {
          // CLAIM + VALIDATE failure (R3): a word-index↔surface mismatch is rejected LOUD and
          // ATOMIC — nothing persisted. Name it (law-named, invalid params) so the agent
          // re-emits; this is invalid testimony, not an internal error to be masked.
          if (err instanceof MarkSurfaceError) return buildError(id, JSONRPC_INVALID_PARAMS, err.message)
          throw err
        }

        // Response = the fresh present in the WIRE bundle (R7: tables only), rendered POST-write
        // (R2 — the turn door is a write door whose response carries the present). FAILURE
        // ORDERING (A2.2): the write COMMITTED above; if the present render fails, the turn STILL
        // STANDS — state it truthfully rather than masking a committed write as a failure.
        try {
          return buildResult(id, toolText(await readPresent(session.userId, PRESENT_BUNDLES.wire)))
        } catch (err) {
          const reason = err instanceof Error ? err.message : String(err)
          return buildResult(id, toolText(JSON.stringify({
            ok: true, sc: recorded.sc, present: null, note: `turn recorded; present unavailable: ${reason}`,
          })))
        }
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
