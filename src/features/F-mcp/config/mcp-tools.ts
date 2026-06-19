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
//   W-ATOM   MCP_TOOLS / TOOL_PRESENT / TOOL_TURN / TOOL_LOOKUP   F-mcp/R1 tool-registry, R3 contract
//   W-ATOM   TURN_ARGS   F-mcp/R1 tool-registry   (the write-door's extras allow-list — the four wire arg names)
// validated:  pending

import type { McpToolDescriptor } from './mcp-protocol'

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

// The `turn` write-door's arg names — the allow-list the door rejects extras against
// (planToolCall, R1). The four WIRE fields, in present order. Pinned by test to the projected
// schema's property keys (projectEmissionSchema(MCP_SITUATION)): the door's extras-check and
// the advertised shape can never disagree. Config owns the arg NAMES (wire-hygiene); the
// emission SHAPE is the core contract's, projected at R3 (cognition-turn contract).
export const TURN_ARGS = ['wearerText', 'reply', 'replyMarks', 'priorMarks'] as const

// (sprint-wire-economy) WHO_VALUES is GONE: the `turn` door carries no `who` axis — a turn
// is inherently a wearer+llm pair (the reply authors as 'llm', the wearer is wearerText).
// lookup validates its own who (wearer|llm) per selector kind. No remaining consumer.

export const MCP_TOOLS: readonly McpToolDescriptor[] = [
  {
    name: TOOL_PRESENT,
    description:
      'Your present, set before you — the memory as it now stands, gathered into its default tables: the transcript, the structure, the state. It asks nothing of you; the wearer is the session, and it is already yours.',
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
    name: TOOL_LOOKUP,
    // The SHAPE is region × lens (two orthogonal axes that compose): region (where) selects the
    // substrate; lens (how) returns raw numbered cells (to copy a coordinate) or the rendered
    // pivot grid (its zones as fields). The advertisement (Part 4, the Host voice) names those
    // axes warmly — where to look (turn|span|thing|all) × how to see it (raw|pivot).
    description:
      'Look closer, or look another way. Name **where** to look — `turn`, `span`, `thing`, or `all` — and **how** to see it: `raw` returns the numbered cells, each carrying its `{who, sc, pos}`, to copy a coordinate into a mark; `pivot` re-lays the same things into a table you shape — focus one thing, change the rows, hide a column, sort, go deeper. The tables are the ones summary already serves; here you turn them in your hands.',
    inputSchema: {
      type: 'object',
      properties: {
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
          // zero field hints (4b): the how-axis (raw | pivot and the pivot zones) is taught by
          // the manual's LOOKING AROUND section; the schema carries shape, not prose.
          type: 'object',
          properties: {
            view:    { type: 'string', enum: ['raw', 'pivot'] },
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
      required: ['lens'],
      additionalProperties: true,
    },
  },
]
