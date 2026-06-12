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
// validated:  pending

import type { McpToolDescriptor } from './mcp-protocol'

// The MCP surface (manager §2 + sprint-wire-economy R1/R2): present (read), turn (record
// ONE conversation turn — both the person's words and the scored reply, in one call — and
// respond with the fresh present), grid (fetch one turn's canonical cell grid). LIV is the
// agent's memory substrate; the agent is itself the LLM. Tool names and arg shapes are
// declared here; mapping to in-process R3 targets is performed at the R3 contract.
//
// ONE CALL PER TURN (sprint-wire-economy R1): the wire no longer carries a separate
// wearer write then an llm write — a `turn` carries wearerText + the scored reply together,
// LIV records both turns, and the response IS the fresh present. The per-turn manual and
// per-turn transcript are gone from the wire: the manual rides the `turn` description (a
// once-channel, R2), the transcript is fetched (grid / lookup), never carried.
//
// lookup is the navigation read control (R8): grid generalized (turn | span | thing →
// numbered cells) and re-homed to F-present, where the dimension lives. grid is deleted.

export const TOOL_PRESENT = 'present' as const
export const TOOL_TURN = 'turn' as const
export const TOOL_LOOKUP = 'lookup' as const

// (sprint-wire-economy) WHO_VALUES is GONE: the `turn` door carries no `who` axis — a turn
// is inherently a wearer+llm pair (the reply authors as 'llm', the wearer is wearerText).
// grid validates its own who (wearer|llm) inline. No remaining consumer.

export const MCP_TOOLS: readonly McpToolDescriptor[] = [
  {
    name: TOOL_PRESENT,
    description:
      "Read the wearer's present — the resolved memory context. Takes no arguments; the wearer is the authenticated session identity. Extra fields are ignored — reads take no testimony; clients may attach lifecycle envelopes freely.",
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: true,
    },
  },
  {
    name: TOOL_TURN,
    description:
      "Record ONE conversation turn — the person's words AND your scored reply, in a single call — and receive your fresh present in return. LIV writes both turns; you never make a separate wearer write. DEMANDED shape (enforced at the door): { wearerText, reply, replyMarks, priorMarks } — all four required (the mark arrays may be empty, never absent); extra fields are rejected. wearerText is the person's verbatim words (LIV cuts it). reply is your reply as ONE plain text string — authoritative; LIV cuts it (§FORK-A) and renders it byte-identical. replyMarks score YOUR reply; priorMarks score the PERSON's turn. Each mark entry is { word, surface, marks }: word is the 1-based WORD-INDEX into that turn's text (count word-cells left to right), surface is the exact word you claim sits at that index — LIV verifies surface against the cut byte-exact and rejects a mismatch loud. Coordinates appear only inside a mark's Ref (target/peer), copied from grid/lookup, never as a home index. Circumstance (identity, channel, scope) is stamped by the perimeter — never sent. The full fill manual is delivered with this tool.",
    // TRANSPORT-SAFE ADVERTISEMENT (sprint-wire-transport T1, carried): ONE flat object —
    // no top-level oneOf/anyOf/allOf (the Anthropic API rejects those and the client drops
    // the whole tool). All four fields are structurally required; the door enforces the
    // same demand AUTHORITATIVELY (planToolCall) and rejects extras. additionalProperties
    // stays false — the turn is a write door, it takes no envelope baggage.
    inputSchema: {
      type: 'object',
      properties: {
        wearerText: { type: 'string', description: "the person's verbatim turn text. LIV cuts it into cells; priorMarks index its word-cells." },
        reply: { type: 'string', description: 'your reply as ONE plain text string — authoritative; LIV cuts it (§FORK-A), renders it byte-identical. replyMarks index its word-cells.' },
        replyMarks: {
          type: 'array',
          description: 'marks on YOUR reply, by 1-based word index into the reply, each carrying its surface word: { word, surface, marks }. Required; may be empty, never absent.',
          items: { type: 'object', properties: { word: { type: 'number' }, surface: { type: 'string' }, marks: { type: 'array' } }, required: ['word', 'surface', 'marks'], additionalProperties: false },
        },
        priorMarks: {
          type: 'array',
          description: "marks on the PERSON's turn, by 1-based word index into wearerText, each carrying its surface word: { word, surface, marks }. Required; may be empty, never absent.",
          items: { type: 'object', properties: { word: { type: 'number' }, surface: { type: 'string' }, marks: { type: 'array' } }, required: ['word', 'surface', 'marks'], additionalProperties: false },
        },
      },
      required: ['wearerText', 'reply', 'replyMarks', 'priorMarks'],
      additionalProperties: false,
    },
  },
  {
    name: TOOL_LOOKUP,
    description:
      "Fetch numbered cells — the cutter's truth (each cell's verbatim word + its (who, sc, pos) coordinate) — when you need to copy a coordinate into a mark's Ref. Coordinates are COPIED from here, NEVER counted from prose. Selectors: { kind: 'turn', who, sc } one turn's cells; { kind: 'span', from, to, who? } every turn in an sc range; { kind: 'thing', name } every appearance of a named thing in your present. A read control — it takes no testimony; extra fields are ignored.",
    inputSchema: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['turn', 'span', 'thing'], description: "what to fetch: 'turn' | 'span' | 'thing'." },
        who: { type: 'string', enum: ['wearer', 'llm'], description: "turn: the turn's author (required). span: optional author filter." },
        sc: { type: 'number', description: 'turn: the turn position (sc).' },
        from: { type: 'number', description: 'span: first sc (inclusive).' },
        to: { type: 'number', description: 'span: last sc (inclusive).' },
        name: { type: 'string', description: "thing: the thing's name (clusters across the present)." },
      },
      required: ['kind'],
      additionalProperties: true,
    },
  },
]
