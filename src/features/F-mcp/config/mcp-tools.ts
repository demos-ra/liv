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
      "Record one conversation turn into the wearer's substrate. Natural-language text is cut into cells by LIV; the machine cuts, never the caller.",
    inputSchema: {
      type: 'object',
      properties: {
        who: {
          type: 'string',
          enum: [...WHO_VALUES],
          description: 'Content authorship of the turn. Not identity, not authority.',
        },
        text: {
          type: 'string',
          description: 'The verbatim turn text. LIV cuts it into cells.',
        },
        scope: {
          type: 'string',
          description: 'The conversation/session scope being recorded into.',
        },
      },
      required: ['who', 'text', 'scope'],
      additionalProperties: false,
    },
  },
]
