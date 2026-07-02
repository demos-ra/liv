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
//   W-FN     readPresent        F-present/R3 present-contract   (present tool — the read)
//   W-FN     captureWearerTurn  F-present/R3 present-contract   (E1 — summary at submit CAPTURES the wearer prompt (writeRawTurn) + delivers; this door maps the outcome)
//   W-FN     recordWireTurn     F-present/R3 present-contract   (A1/E1 — the ONE wire turn-service: WP1 gate + deliver + record reply against wearer:{written} + ack; this door maps the outcome)
//   W-FN     projectEmissionSchema   F-present/R3 present-contract  (turn inputSchema = projectEmissionSchema(MCP_SITUATION))
//   W-ATOM   MarkingSituation        F-present/R3 present-contract  (MCP_SITUATION — the wire's contract choices, type-only)
//   W-FN     projectManual      F-present/R3 present-contract   (R0-leaf manual rides the turn description — once-channel; rendered from primitives we compute from MCP_SITUATION + its schema)
//   W-ATOM   TOOL_TURN          F-mcp/config mcp-tools          (manual injection target at tools/list)
//   W-FN     lookup             F-present/R3 present-contract   (R8 read control — turn|span|thing)
//   W-ATOM   PRESENT_BUNDLES    F-present/R3 present-contract   (R7 — the wire bundle: tables only; the present-read path)
//   W-ATOM   PerimeterSession   F-identity/R3 perimeter-consultation
//   W-FN     publishToForum     F-forum/R3 forum-contract   (publish tool — the public-forum write; the NORMAL marked compose stamped public, behind a wearer confirm)
//   W-FN     readForumNetwork   F-forum/R3 forum-contract   (search·public — the public reference-graph read: nodes + parsed edges)
//   W-FN     renderForumThreads F-forum/R3 forum-contract   (search·public — folds the network into boards of threads for the browse view)
//   W-FN     joinCells          F-memory/R3 substrate-contract  (search·public — renders a node's words to text in the browse render)
//   W-ATOM   TOOL_PUBLISH       F-mcp/config mcp-tools      (publish schema-injection target at tools/list)
// wires-out:
//   W-FN     handleMcpRequest   → src/app/api/mcp/route.ts (R4)
// deps:
//   R1  ../domain/json-rpc
//   R1  ../domain/tool-registry
//   config  ../config/mcp-protocol
//   R3  @/features/F-present/contract/present-contract  (A1 — recordWireTurn folds in the WP1 entitlement gate; F-mcp no longer imports F-entitlement directly)
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R3  @/features/F-forum/contract/forum-contract  (publish tool → the forum's public write-orchestration; search·public → readForumNetwork + renderForumThreads, the public browse read)
//   R3  @/features/F-memory/contract/substrate-contract  (joinCells — render a node's words to text in the search·public browse view)
// amended:    inline-marking Touch 3 (wire delivery wired to the R0-leaf manual): the COIN_MANUAL
//             import becomes projectManual(opts); tools/list computes the schema ONCE and feeds
//             BOTH the `turn` inputSchema AND the manual opts (inline?, includeWearerText, the
//             projected field list) — so manual + schema cannot drift, and coin-manual stays a strict
//             R0 leaf. MCP_SITUATION stays 'separate' (named form) — wire migrates per-agent (§3).
// validated:  pending

import { parseRequest, buildResult, buildError } from '../domain/json-rpc'
import { listTools, initializeResult, planToolCall } from '../domain/tool-registry'
import { TOOL_TURN, TOOL_PUBLISH } from '../config/mcp-tools'
import {
  JSONRPC_METHOD_NOT_FOUND,
  JSONRPC_INTERNAL_ERROR,
  JSONRPC_INVALID_PARAMS,
  type JsonRpcResponse,
  type McpToolResult,
} from '../config/mcp-protocol'
import { readPresent, search, parseSearchSpec, PRESENT_BUNDLES, recordWireTurn, captureWearerTurn, projectManual, projectEmissionSchema } from '@/features/F-present/contract/present-contract'
import type { MarkingSituation } from '@/features/F-present/contract/present-contract'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import { publishToForum, FORUM_ROOT_URN, readForumNetwork, renderForumThreads } from '@/features/F-forum/contract/forum-contract'
import type { ForumThread, ForumBoard } from '@/features/F-forum/contract/forum-contract'
import { joinCells } from '@/features/F-memory/contract/substrate-contract'

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

// ── the search·public BROWSE view — the forum rendered as readable indented threads ──────────────
// PURE + deterministic (no I/O — it takes the already-read boards). Composition only: the network
// read (readForumNetwork) and the tree fold (renderForumThreads) are F-forum's; this is the wire's
// PRESENTATION of that tree — the Host-facing text. Each thread prints its node's words (joinCells,
// F-memory) plus its own URN (the address a reply targets), children indented two spaces under it.
// `focus` (a URN) opens ONE thread's subtree (the walk finds it anywhere in the forest); a miss is
// stated plainly, never thrown. An empty forum is stated, not blank.
function renderForumThread(thread: ForumThread, depth: number, lines: string[]): void {
  const indent = '  '.repeat(depth)
  lines.push(`${indent}- ${joinCells(thread.node.words)}  [${thread.urn}]`)
  for (const child of thread.children) renderForumThread(child, depth + 1, lines)
}

// find a thread by its URN anywhere in the forest (depth-first) — the focus scope's subtree root.
function findThread(boards: ForumBoard[], urn: string): ForumThread | null {
  const walk = (thread: ForumThread): ForumThread | null => {
    if (thread.urn === urn) return thread
    for (const child of thread.children) { const hit = walk(child); if (hit) return hit }
    return null
  }
  for (const board of boards) for (const thread of board.threads) { const hit = walk(thread); if (hit) return hit }
  return null
}

export function renderForumBrowse(boards: ForumBoard[], focus?: string): string {
  if (typeof focus === 'string' && focus.length > 0) {
    const root = findThread(boards, focus)
    if (root === null) return `No forum thread found at ${focus}.`
    const lines: string[] = []
    renderForumThread(root, 0, lines)
    return lines.join('\n')
  }
  if (boards.length === 0) return 'The forum is empty — nothing published yet.'
  const lines: string[] = []
  for (const board of boards) {
    lines.push(`# ${board.board}`)
    for (const thread of board.threads) renderForumThread(thread, 0, lines)
  }
  return lines.join('\n')
}

// MCP_SITUATION — the wire's choices about the ONE emission contract (cognition-turn
// contract). The wire carries the person's turn inline (wearerText) and DEMANDS every
// present field (all four required; the mark arrays may be empty, never absent). FIELD HINTS
// ARE ZERO (§2.4-text 4b): the schema enforces structure silently (names, types, required,
// additionalProperties:false) and the manual rides the same tool, so a per-field description
// is noise the model must read and discard — the `descriptions` choice is omitted. The `turn`
// inputSchema is projectEmissionSchema(MCP_SITUATION): the core contract, projected — it shares
// the native projection's mark item (no bare-`array` drift), so the wire ADVERTISES the full
// mark shape it always ACCEPTED. This is the only F-mcp file that imports another slice's
// contract; the situation lives here, the shape lives at the core.
export const MCP_SITUATION: MarkingSituation = {
  includeWearerText: true,
  demand: 'all-present',
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

      case 'tools/list': {
        // The `turn` tool's advertisement is DERIVED here, not hand-declared at config: its
        // inputSchema is projectEmissionSchema(MCP_SITUATION) — the one core emission contract,
        // projected for the wire (all four required, the full mark shape, field descriptions).
        // The fill manual rides its description — a ONCE-channel (R2): the client fetches
        // tools/list once at session start, so the manual crosses the wire once, never per
        // turn. One home each (the manual + the contract, via F-present R3), injected together.
        // inline-marking Touch 3: ONE schema computation feeds BOTH the manual and the inputSchema,
        // so what the wire teaches and what it accepts cannot drift. coin-manual is a strict R0
        // leaf — it renders from primitives we hand it (inline?, includeWearerText, the projected
        // field list), never re-deriving the schema. MCP_SITUATION stays 'separate' (the named
        // { surface, marks } form) until this agent proves clean [[ ]] under load (§3 wire-per-agent).
        const schema = projectEmissionSchema(MCP_SITUATION)
        const manual = projectManual({
          inline: MCP_SITUATION.replyMarking === 'inline',
          includeWearerText: MCP_SITUATION.includeWearerText,
          fields: Object.keys(schema.properties ?? {}),
        })
        // publish's advertisement is DERIVED the same way compose's is — the one core emission schema,
        // projected, PLUS `target` (the reference URN — a coordinate URN to reply to; absent → the
        // forum-root URN, a top post) and the `confirmed` phase flag (the two-phase confirm). Both are
        // OPTIONAL (not added to `required`, which stays the four present body fields), so the base
        // additionalProperties:false still admits them. Same mark shape as compose (no drift); the
        // marking manual rides compose's description (a once-channel), so it is NOT re-attached here —
        // publish's own description points the model back to compose.
        const publishSchema = { ...schema, properties: { ...schema.properties, target: { type: 'string' }, confirmed: { type: 'boolean' } } }
        return buildResult(id, {
          tools: listTools().map(t => {
            if (t.name === TOOL_TURN) return { ...t, description: `${t.description}\n\n${manual}`, inputSchema: schema }
            if (t.name === TOOL_PUBLISH) return { ...t, inputSchema: publishSchema }
            return t
          }),
        })
      }

      case 'tools/call': {
        const p = (typeof params === 'object' && params !== null ? params : {}) as {
          name?: unknown
          arguments?: unknown
        }
        const plan = planToolCall(p.name, p.arguments)
        if (!plan.ok) return buildError(id, plan.code, plan.message)
        const intention = plan.intention

        // present (summary) → the fresh present in the WIRE bundle (R7: both tables, no transcript
        // — fetched via search, never carried per turn). PURE READ (1d strip): capture is un-welded
        // off the read — it is the dedicated `capture` op below, fired at submit. summary carries no
        // capture; it only delivers. The manual rides the `compose` description (a once-channel, R2),
        // zero here.
        if (intention.tool === 'present') {
          return buildResult(id, toolText(await readPresent(session.userId, PRESENT_BUNDLES.wire)))
        }

        // capture (1d — the submit primitive) — the dedicated capture op the lifecycle hook fires at
        // the turn's ENTRY: STORE the submitted wearer prompt (captureWearerTurn → writeRawTurn,
        // native's exact mechanism) AND deliver the present, capture + deliver lifted off the read so
        // the read stays pure. Same store+deliver the present door still carries via wearerText (that
        // branch is held until the hook universally fires this op — then it is stripped). 'denied'
        // (WP1) → the entitlement-denied code, symmetric with compose.
        if (intention.tool === 'capture') {
          const captured = await captureWearerTurn(
            { wearerText: intention.wearerText },
            { userId: session.userId, scope: session.sessionId, grantKey: session.grantKey },
          )
          // gate-wiring-(6): a locked crossing relays the cta VERBATIM, in-band (a tool result),
          // never a JSON-RPC error — the conversion event reaches the model as a stating, not a fault.
          return captured.kind === 'locked'
            ? buildResult(id, toolText(captured.locked.cta))
            : buildResult(id, toolText(captured.present))
        }

        // lookup (R8) → numbered cells (turn | span | thing) so the caller COPIES coordinates
        // instead of counting them from prose. The read control lives in F-present (it holds
        // the dimension a `thing` selector needs); a miss is a stating { ok: false }, never
        // an exception.
        // search (the text-pivot) — region × lens. The door is transport: parseSearchSpec (core)
        // validates the raw payload (a named INVALID_PARAMS on a bad zone), then search composes
        // pivot/cellsOf through the one read door. A pivot lens returns the rendered grid TEXT
        // (coordinates render inside it — navigation and coordinate-fetch are one verb); a raw
        // lens returns the numbered cells as JSON (the coordinate-fetch path).
        if (intention.tool === 'lookup') {
          // look·public FORK — the SAME verb, turned outward. scope selects the substrate the look
          // reads: 'public' → the forum browse (cross-slice composition HERE at the R3 door — the
          // public reference-graph read + the tree fold, both F-forum's, rendered to indented text);
          // 'mine' / absent → the EXISTING F-present region × lens read, byte-unchanged. focus (a URN)
          // scopes a public browse to one thread's subtree. The read door is transport: scope/focus
          // rode through in `raw`; this branch reads them (a read carries no testimony — extras ignored).
          if (intention.raw.scope === 'public') {
            const focus = typeof intention.raw.focus === 'string' ? intention.raw.focus : undefined
            const boards = renderForumThreads(await readForumNetwork(session.userId))
            return buildResult(id, toolText(renderForumBrowse(boards, focus)))
          }
          const parsed = parseSearchSpec(intention.raw)
          if (!parsed.ok) return buildError(id, JSONRPC_INVALID_PARAMS, parsed.message)
          const result = await search(session.userId, parsed.spec)
          const out = !result.ok
            ? JSON.stringify({ ok: false, message: result.message })
            : result.view === 'pivot'
              ? result.text
              : JSON.stringify({ ok: true, view: 'raw', cells: result.cells })
          return buildResult(id, toolText(out))
        }

        // publish — surface a turn to the PUBLIC forum (F-forum R3). The forum AUTHORS NOTHING:
        // publishing is the NORMAL marked compose stamped source_scope='public' (F-forum hands the
        // draft to the SAME recordWireTurn, differing only by the stamped scope), behind a wearer
        // confirm. This door is TRANSPORT, mirroring compose EXACTLY: it builds the draft from the
        // four marked-turn fields and coerces `confirmed` to the phase boolean (true = proceed). The
        // discriminated PublishOutcome maps to the SAME result shapes compose uses:
        //   'confirm-required' → the verbatim confirm text the model surfaces (the locked-CTA
        //                        precedent — a tool returns text, a second call carries confirmed:true);
        //   'locked'           → the cta relayed verbatim, in-band (gate-wiring-(6));
        //   'invalid-testimony'→ INVALID_PARAMS (a false mark claim, loud + atomic);
        //   'present'          → the fresh present; 'degraded' → the honest ack JSON.
        if (intention.tool === 'publish') {
          const result = await publishToForum(session, {
            wearerText: intention.wearerText,
            reply:      intention.reply,
            replyMarks: intention.replyMarks,
            priorMarks: intention.priorMarks,
            // the REQUIRED forum target: the model-supplied reference URN (a coordinate URN → a reply),
            // defaulted to FORUM_ROOT_URN when absent/not a string (→ a top post). The un-weld: target
            // is now a recorded field value, not a hardcoded root — this is what makes replies real.
            target:     typeof intention.target === 'string' ? intention.target : FORUM_ROOT_URN,
          }, intention.confirmed === true)
          switch (result.kind) {
            case 'confirm-required':
              return buildResult(id, toolText(result.payload))
            case 'locked':
              return buildResult(id, toolText(result.locked.cta))
            case 'invalid-testimony':
              return buildError(id, JSONRPC_INVALID_PARAMS, result.message)
            case 'present':
              return buildResult(id, toolText(result.present))
            case 'degraded':
              return buildResult(id, toolText(JSON.stringify(result.degraded)))
          }
        }

        // turn — DEMANDED (R1): ONE call carries BOTH turns. The whole write turn-service (the WP1
        // entitlement crossing decision, capture wearerText, deliver/narrow through the SAME gate
        // the native path uses, record BOTH turns, the honest post-write present-or-degraded ack)
        // is the ONE core recordWireTurn (A1 — F-present R3). userId is ALWAYS the session's; scope
        // = stamped circumstance (session.sessionId), symmetric with native's route-stamped
        // projectId — speakers never declare circumstance.
        //
        // The DRIVER (this door) is the per-surface variable (Mechanics §F): it maps the typed
        // WireTurnOutcome to the JSON-RPC envelope. 'denied' → the entitlement-denied code (the
        // write was never reached); 'invalid-testimony' → INVALID_PARAMS (law-named — a false mark
        // claim, loud + atomic, not an internal error to be masked, so the agent re-emits);
        // 'present' → the fresh present (WIRE bundle, tables only) straight through; 'degraded' →
        // the honest ack JSON (a committed-but-unrendered write STILL STANDS; a dropped no-write is
        // reported not-persisted — never masked). The REST /api/compose plug derives the same core
        // and maps the same outcome to HTTP codes — one home, two thin drivers.
        // the reply-marking FORMAT is the wire's OWN situation (MCP_SITUATION.replyMarking) — the
        // SAME situation that projects the `turn` inputSchema above, so what the wire advertises and
        // how it records can never drift. Absent ≡ 'separate' today; the per-agent migration (§3)
        // flips it on MCP_SITUATION alone. Never a surface name.
        const outcome = await recordWireTurn(intention, {
          userId:              session.userId,
          scope:               session.sessionId,
          grantKey:            session.grantKey,
        }, { mode: 'submit-captured' }, MCP_SITUATION.replyMarking ?? 'separate')
        switch (outcome.kind) {
          case 'locked':
            // gate-wiring-(6): relay the cta verbatim, in-band (tool result), not -32002.
            return buildResult(id, toolText(outcome.locked.cta))
          case 'invalid-testimony':
            return buildError(id, JSONRPC_INVALID_PARAMS, outcome.message)
          case 'present':
            return buildResult(id, toolText(outcome.present))
          case 'degraded':
            return buildResult(id, toolText(JSON.stringify(outcome.degraded)))
        }
      }

      default:
        if (isNotification) return null
        return buildError(id, JSONRPC_METHOD_NOT_FOUND, `method not found: ${method}`)
    }
  } catch (err) {
    // OBSERVABLE, not swallowed: a thrown handler is LOGGED server-side (the method + the error) so a
    // failure is visible in the server's own record — the silent catch is gone. The CLIENT still
    // receives the SAME non-leaky envelope (no internal detail crosses the wire): fail-closed to a
    // generic internal-error. Observability is a server concern; non-leak is the wire's.
    console.error(`[mcp] handler threw for method "${method}":`, err)
    if (isNotification) return null
    return buildError(id, JSONRPC_INTERNAL_ERROR, 'internal error')
  }
}
