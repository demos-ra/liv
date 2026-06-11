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

// The MCP surface is exactly two tools (manager §2): present (read) and write
// (record turn). No third tool, no LLM-reply turn — LIV is the agent's memory
// substrate; the agent is itself the LLM. Tool names and arg shapes are declared
// here; mapping to in-process R3 targets is performed at the R3 contract.

export const TOOL_PRESENT = 'present' as const
export const TOOL_WRITE = 'write' as const

// Runtime membership set for the `who` content-authorship axis. `satisfies
// readonly Who[]` binds it to the canonical Who type: if Who's literals change,
// this fails to compile. Validation fails closed — an author not in this set is
// rejected (a new Who value would simply not be accepted until added here).
export const WHO_VALUES = ['wearer', 'llm', 'program'] as const satisfies readonly Who[]

export const MCP_TOOLS: readonly McpToolDescriptor[] = [
  {
    name: TOOL_PRESENT,
    description:
      "Read the wearer's present — the resolved memory context. Takes no arguments; the wearer is the authenticated session identity.",
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: TOOL_WRITE,
    description:
      "Record one conversation turn into the wearer's substrate. The turn shape is DEMANDED per author: a wearer turn is words-only ({ who, scope, text }) — LIV cuts the text into cells, the machine cuts, never the caller. An llm turn is pair-scored (§FORK-A: { who, scope, reply, replyMarks, priorMarks }) — the speaker scores its own turn; replyMarks and priorMarks are required (arrays may be empty but never absent). program turns are not accepted over the wire at v2.",
    inputSchema: {
      type: 'object',
      // who DEMANDS its turn shape — a discriminated union. The wearer never emits
      // marks (words-only); the llm always carries its own pair-scoring (§FORK-A).
      // additionalProperties:false on EACH branch — a wearer cannot smuggle marks, an
      // llm cannot omit them. program is in neither branch (rejected at tool-registry
      // with a law-naming message). The authoritative validation is planToolCall (R1);
      // this schema advertises the demanded shapes to the client.
      oneOf: [
        {
          type: 'object',
          properties: {
            who: { const: 'wearer', description: 'Content authorship — the person. Words-only.' },
            scope: { type: 'string', description: 'The conversation/session scope being recorded into.' },
            text: { type: 'string', description: 'The verbatim wearer turn text. LIV cuts it into cells.' },
          },
          required: ['who', 'scope', 'text'],
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            who: { const: 'llm', description: 'Content authorship — you (the agent). Pair-scored (§FORK-A).' },
            scope: { type: 'string', description: 'The conversation/session scope being recorded into.' },
            reply: { type: 'string', description: 'Your reply as ONE plain text string — authoritative; LIV cuts it (§FORK-A), renders it byte-identical.' },
            replyMarks: {
              type: 'array',
              description: 'Marks on your reply, keyed by 1-based word index ({ word, marks }). Required; may be empty, never absent.',
              items: { type: 'object', properties: { word: { type: 'number' }, marks: { type: 'array' } }, required: ['word', 'marks'], additionalProperties: false },
            },
            priorMarks: {
              type: 'array',
              description: "Marks on the person's existing cells, by coordinate ({ home, marks }). Required; may be empty, never absent.",
              items: { type: 'object', properties: { home: { type: 'object' }, marks: { type: 'array' } }, required: ['home', 'marks'], additionalProperties: false },
            },
          },
          required: ['who', 'scope', 'reply', 'replyMarks', 'priorMarks'],
          additionalProperties: false,
        },
      ],
    },
  },
]
