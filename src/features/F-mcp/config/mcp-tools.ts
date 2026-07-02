// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector)
// [F-mcp/config]
// Built with LIV · livai.dev
// [F-mcp/config/mcp-tools.ts]
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      config
// wires-in:
//   W-ATOM   McpToolDescriptor  F-mcp/config mcp-protocol
// wires-out:
//   W-ATOM   MCP_TOOLS / TOOL_PRESENT / TOOL_TURN / TOOL_LOOKUP / TOOL_PUBLISH   F-mcp/R1 tool-registry, R3 contract
//   W-ATOM   TURN_ARGS / PUBLISH_ARGS   F-mcp/R1 tool-registry   (the write-doors' extras allow-lists)
// validated:  pending

import type { McpToolDescriptor } from './mcp-protocol'
import { PRESENT_BUNDLES } from '@/features/F-present/config/read-engine-types'

// The summary advertisement names the wire bundle's CARRIED sections, DERIVED from
// PRESENT_BUNDLES.wire (F4 — the advertisement can never drift from the bundle again). The wire
// bundle drops the transcript (fetched on demand via search); the carried sections are the
// enabled non-transcript ones → 'the structure and the state'. One source of truth: the bundle.
const SUMMARY_SECTIONS = (Object.keys(PRESENT_BUNDLES.wire) as Array<keyof typeof PRESENT_BUNDLES.wire>)
  .filter(section => section !== 'transcript' && PRESENT_BUNDLES.wire[section])
  .map(section => `the ${section}`)
  .join(' and ')

// The MCP surface (manager §2 + sprint-wire-economy R1/R2): present (read), turn (record
// ONE conversation turn — both the person's words and the scored reply, in one call — and
// respond with the fresh present), lookup (fetch numbered cells — turn | span | thing). LIV
// is the agent's memory substrate; the agent is itself the LLM. Tool names and arg shapes are
// declared here; mapping to in-process R3 targets is performed at the R3 contract.
//
// ONE CALL PER TURN (sprint-wire-economy R1): the wire no longer carries a separate
// wearer write then an llm write — a `turn` carries wearerText + the scored reply together,
// LIV records both turns, and the response IS the fresh present. The per-turn manual and
// per-turn transcript are gone from the wire: the manual rides the `turn` description (a
// once-channel, R2), the transcript is fetched (lookup), never carried.
//
// lookup is the navigation read control (R8): grid generalized (turn | span | thing →
// numbered cells) and re-homed to F-present, where the dimension lives. grid is deleted.

// PUBLIC WIRE NAMES (DIST vocabulary). The constant IDENTIFIERS stay (TOOL_PRESENT/TOOL_TURN/
// TOOL_LOOKUP — referenced across R1/R3); only their VALUES are the renamed public verbs. The
// surface maps public→internal: the wire advertises these names, planToolCall matches on them,
// and the intention discriminator + internal functions (readPresent / lookup() / recordScoredTurn)
// keep the old internal tokens behind the boundary. Advertisement/manual PROSE now speaks the
// public verbs in the Host voice (Part 4): summary / search / compose throughout, no stale verb.
export const TOOL_PRESENT = 'summary' as const
export const TOOL_TURN = 'compose' as const
export const TOOL_LOOKUP = 'search' as const

// TOOL_PUBLISH — surface a turn to the PUBLIC forum. Publishing AUTHORS NOTHING new: it is the
// NORMAL marked compose (the SAME four fields, the SAME marking) stamped source_scope='public'
// instead of the connection scope, behind a wearer confirm. The forum is a network of public
// REFERENCE, not an authored store. Like `compose`, its emission schema is DERIVED at R3 (the one
// core contract, projected) + the `confirmed` phase flag — never re-declared at config.
export const TOOL_PUBLISH = 'publish' as const

// TOOL_CAPTURE — the submit-capture primitive (the capture un-weld, 1d). Capture is
// its OWN op now, no longer a job riding the read (summary's wearerText branch). It is
// DISPATCHABLE but NOT advertised in MCP_TOOLS — the lifecycle hook fires it at the
// turn's entry (UserPromptSubmit), the model never picks it from the menu. So the model
// surface stays the read/record verbs; capture is plumbing the hook drives. It stores the
// submitted wearer prompt (captureWearerTurn → writeRawTurn) and delivers the present —
// the same store+deliver, now lifted off the read so the read becomes pure.
export const TOOL_CAPTURE = 'capture' as const

// The `turn` write-door's arg names — the allow-list the door rejects extras against
// (planToolCall, R1). The four WIRE fields, in present order. Pinned by test to the projected
// schema's property keys (projectEmissionSchema(MCP_SITUATION)): the door's extras-check and
// the advertised shape can never disagree. Config owns the arg NAMES (wire-hygiene); the
// emission SHAPE is the core contract's, projected at R3 (cognition-turn contract).
export const TURN_ARGS = ['wearerText', 'reply', 'replyMarks', 'priorMarks'] as const

// The `publish` write-door's arg names — the compose args (the marked-turn payload, reused verbatim —
// no new vocabulary), plus `target`, the reference URN the model supplies (a coordinate URN for a
// reply parent, or absent → defaulted to the forum-root URN at R3 = a top post), plus `confirmed`, the
// two-phase flag (absent/false = phase one, surface the confirm; true = phase two, write public). The
// door rejects extras against this list.
export const PUBLISH_ARGS = [...TURN_ARGS, 'target', 'confirmed'] as const

// (sprint-wire-economy) WHO_VALUES is GONE: the `turn` door carries no `who` axis — a turn
// is inherently a wearer+llm pair (the reply authors as 'llm', the wearer is wearerText).
// lookup validates its own who (wearer|llm) per selector kind. No remaining consumer.

export const MCP_TOOLS: readonly McpToolDescriptor[] = [
  {
    name: TOOL_PRESENT,
    description:
      `Read the present — ${SUMMARY_SECTIONS} of what's held, gathered for you. The full transcript is not carried here; fetch it on demand with search.`,
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
  },
  {
    name: TOOL_TURN,
    description:
      "Offer this turn — the person's words and your reply, marked as you read them — and receive your present, freshly set. LIV keeps both turns; you never write the person's words separately. The full manual for marking rides with this tool.",
    // NO inputSchema here — the `turn` advertisement is a DERIVED view (cognition-turn
    // contract). Its schema is projected at R3 (mcp-contract) as projectEmissionSchema(
    // MCP_SITUATION): the one core emission contract, projected for the wire — flat object,
    // all four required, additionalProperties:false, the full mark shape. Config owns the
    // arg NAMES only (TURN_ARGS, above), not the emission shape. Transport-safety (flat
    // object, no top-level oneOf/anyOf/allOf) is the projector's invariant, pinned by test.
  },
  {
    name: TOOL_PUBLISH,
    description:
      "Publish this turn to the public forum — the SAME marked turn you offer with compose, but stamped public so anyone can reference it. The forum authors nothing of its own; publishing IS your normal compose, made public. Two steps: call publish once to receive the wearer's confirm prompt (surface it verbatim and wait), then call again with confirmed:true to write it. Mark exactly as you do for compose.",
    // NO inputSchema here — like compose, publish's emission shape is a DERIVED view projected at R3
    // (mcp-contract): projectEmissionSchema(MCP_SITUATION) + the `confirmed` phase flag. Config owns
    // the arg NAMES only (PUBLISH_ARGS = the compose args + confirmed); the emission shape stays the
    // one core contract, never re-declared here.
  },
  {
    name: TOOL_LOOKUP,
    // The SHAPE is region × lens (two orthogonal axes that compose): region (where) selects the
    // substrate; lens (how) returns raw numbered cells (to copy a coordinate) or the rendered
    // table (its zones as fields). The advertisement (the Host voice) names those axes — where to
    // look (turn|span|thing|all) × how it returns (raw|table). WP5: the verbatim manager string.
    // look·public FORK: `scope` picks the SUBSTRATE the look reads — 'mine' (default, absent) is
    // your own present (the region × lens read, untouched); 'public' turns the same verb outward,
    // reading the forum — the public network of published turns, rendered as threads. `focus` (a
    // URN) scopes a public browse to one thread's subtree. lens is no longer top-level required:
    // it is the mine-read's shape (the core still demands it there), and a public browse needs none.
    description:
      "Look — name where to look (a turn, a span, a thing, or all) and how it returns (the raw numbered cells, or shaped as a table). Copy a coordinate from it to point back at an exact past word, or read the table to see the shape of what's held. By default you look at what's held for you (your present). Set scope:'public' to read the forum instead — the public network of turns anyone has published, rendered as threads; pass focus with a thread's URN to open just that thread and its replies.",
    inputSchema: {
      type: 'object',
      properties: {
        // the look·public fork (top-level, both optional). scope selects the substrate the look
        // reads (mine = your present, the default; public = the forum browse); focus scopes a
        // public browse to one thread's URN subtree. Read door → the core / R3 branch validates.
        scope: { type: 'string', enum: ['mine', 'public'] },
        focus: { type: 'string' },
        region: {
          // zero field hints (4b): the schema enforces shape silently; the manual teaches
          // the where-axis (LOOKING AROUND), and the search advertisement names it warmly.
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['turn', 'span', 'thing', 'all'] },
            who:  { type: 'string', enum: ['wearer', 'llm'] },
            sc:   { type: 'number' },
            from: { type: 'number' },
            to:   { type: 'number' },
            name: { type: 'string' },
          },
          additionalProperties: true,
        },
        lens: {
          // zero field hints (4b): the how-axis (raw | table and the table zones) is taught by
          // the manual's LOOKING AROUND section; the schema carries shape, not prose. `table` is
          // the PUBLIC value (WP5); parseLens maps it to the internal pivot lens (one translation).
          type: 'object',
          properties: {
            view:    { type: 'string', enum: ['raw', 'table'] },
            rows:    { type: 'string', enum: ['lineage', 'time'] },
            columns: { type: 'string', enum: ['single', 'line'] },
            values:  { type: 'string', enum: ['weight', 'marks'] },
            focus:   { type: 'string' },
            depth:   { type: 'number' },
            top:     { type: 'number' },
            sort:    { type: 'string', enum: ['weight', 'id'] },
            filter:  { type: 'object', additionalProperties: true },
          },
          required: ['view'],
          additionalProperties: true,
        },
      },
      // lens is NOT top-level required — it is the mine-read's shape (parseSearchSpec, the core, is
      // its sole validator and demands it there with a named INVALID_PARAMS), while a public browse
      // (scope:'public') carries none. Advertising it as required would lie to the public fork.
      additionalProperties: true,
    },
  },
]
