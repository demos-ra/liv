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
//   W-ATOM   Who                @/core/types/substrate-raw.types
//   W-ATOM   McpToolDescriptor  F-mcp/config mcp-protocol
// wires-out:
//   W-ATOM   MCP_TOOLS / WHO_VALUES   F-mcp/R1 tool-registry
// deps:
//   R0  @/core/types/substrate-raw.types
// validated:  pending

import type { Who } from '@/core/types/substrate-raw.types'
import type { McpToolDescriptor } from './mcp-protocol'

// The MCP surface (manager §2 + sprint-wire-cognition 3R.2): present (read), write
// (record turn), grid (fetch one turn's canonical cell grid — the first navigation
// read control). LIV is the agent's memory substrate; the agent is itself the LLM.
// Tool names and arg shapes are declared here; mapping to in-process R3 targets is
// performed at the R3 contract.
//
// grid is the FIRST navigation read control. It is derived here once on the wire;
// candidate for promotion to an F-present read control at Phase 3 (re-homed if L0
// rules — the wire would then call that control rather than readTranscript directly).

export const TOOL_PRESENT = 'present' as const
export const TOOL_WRITE = 'write' as const
export const TOOL_GRID = 'grid' as const

// Runtime membership set for the `who` content-authorship axis. `satisfies
// readonly Who[]` binds it to the canonical Who type: if Who's literals change,
// this fails to compile. Validation fails closed — an author not in this set is
// rejected (a new Who value would simply not be accepted until added here).
export const WHO_VALUES = ['wearer', 'llm', 'program'] as const satisfies readonly Who[]

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
    name: TOOL_WRITE,
    description:
      "Record one conversation turn into the wearer's substrate. The turn shape is DEMANDED per author (enforced at the door, not the schema): a wearer turn is words-only — send { who: 'wearer', text } (LIV cuts the text into cells, the machine cuts, never the caller). An llm turn is pair-scored (§FORK-A) — send { who: 'llm', reply, replyMarks, priorMarks }; the speaker scores its own turn, and replyMarks + priorMarks are both required (arrays may be empty but never absent). Send ONLY the fields your author demands — extra fields are rejected. program turns are not accepted over the wire at v2. Circumstance fields (identity, channel, scope) are stamped by the perimeter — never sent.",
    // TRANSPORT-SAFE ADVERTISEMENT (sprint-wire-transport T1): ONE flat object — no
    // top-level oneOf/anyOf/allOf (the Anthropic API rejects those and the client drops
    // the whole tool). `who` is the only structurally-required field; the per-author
    // demanded shapes are carried in the description (prose) and enforced AUTHORITATIVELY
    // at the door (planToolCall: wearer→text, llm→reply+replyMarks+priorMarks, extras
    // rejected, program rejected). FIX-2 correctly layered: the ad describes truthfully +
    // transport-safe; one home (the door) demands. additionalProperties:false stays — the
    // write door takes no envelope baggage; only the demanded fields are admitted.
    inputSchema: {
      type: 'object',
      properties: {
        who: { type: 'string', enum: ['wearer', 'llm'], description: 'Content authorship of the turn. wearer → words-only; llm → pair-scored (§FORK-A). Not identity, not authority.' },
        text: { type: 'string', description: "wearer turn: the verbatim turn text. LIV cuts it into cells. (Send only on a wearer turn.)" },
        reply: { type: 'string', description: 'llm turn: your reply as ONE plain text string — authoritative; LIV cuts it (§FORK-A), renders it byte-identical. (Send only on an llm turn.)' },
        replyMarks: {
          type: 'array',
          description: 'llm turn: marks on your reply, keyed by 1-based word index ({ word, marks }). Required on an llm turn; may be empty, never absent.',
          items: { type: 'object', properties: { word: { type: 'number' }, marks: { type: 'array' } }, required: ['word', 'marks'], additionalProperties: false },
        },
        priorMarks: {
          type: 'array',
          description: "llm turn: marks on the person's existing cells, by coordinate ({ home, marks }). Required on an llm turn; may be empty, never absent.",
          items: { type: 'object', properties: { home: { type: 'object' }, marks: { type: 'array' } }, required: ['home', 'marks'], additionalProperties: false },
        },
      },
      required: ['who'],
      additionalProperties: false,
    },
  },
  {
    name: TOOL_GRID,
    description:
      "Fetch the canonical cell grid of one recorded turn — every cell (word, punctuation, space) with its 1-based position. Coordinates are COPIED from this grid, never counted from prose: the transcript is the wearer's byte-pure record and carries no positions. Use grid to obtain a (who, sc, pos) coordinate for a precise home or target. Extra fields are ignored — reads take no testimony; clients may attach lifecycle envelopes freely.",
    inputSchema: {
      type: 'object',
      properties: {
        who: { type: 'string', enum: ['wearer', 'llm'], description: 'Authorship of the turn whose grid you want.' },
        sc: { type: 'number', description: 'The turn position (sc) whose cell grid you want.' },
      },
      required: ['who', 'sc'],
      additionalProperties: true,
    },
  },
]
