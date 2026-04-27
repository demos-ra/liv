// @liv-standard v1.3
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v2-2-shot4
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  CognitivePrimitive, ClassifyResult, COGNITIVE_PRIMITIVES  ←  F-codec/R0
// wires-out:
//   W-FN  buildClassifyPrompt()   →  F-codec/R2
//   W-FN  parseClassifyResponse() →  F-codec/R2
// deps:
//   R0  ../config/codec-types
// validated:  pending

// R1: pure functions. Zero I/O. Zero side effects.
// CA5: primitive determined from content + graph state. No external classifier.
// The classify prompt includes label extraction — single LLM call, single parse.
// R2 orchestrates the call. R4 executes it. R1 builds and parses.
//
// lm-v2-2-shot4: signature changed to accept rendered stateBlock string
// instead of PresentState. v2.2 §D PresentState carries `projected: NodeId[]`
// — rendering content requires F-memory accessors (R3), so R2 caller now
// builds the stateBlock string before calling. R1 stays pure, no F-memory
// type import.

import type { CognitivePrimitive, ClassifyResult } from '../config/codec-types'
import { COGNITIVE_PRIMITIVES } from '../config/codec-types'

// ─── Build Classify Prompt ────────────────────────────────────────────────────
// Builds system + user prompt for the single LLM call that classifies the
// primitive AND extracts the label. CA5: observable transition from content +
// graph state — the LLM reads both to determine the primitive.
//
// The prompt asks for JSON:
// { "primitive": "...", "confidence": 0.X, "reasoning": "...", "label": "..." }
// Label is null-equivalent (empty string) for Reference.
//
// lm-v2-2-shot4: stateBlock is the rendered graph-state context string built
// by the R2 caller. Empty string ⇒ "(empty graph — no existing nodes)".

export function buildClassifyPrompt(
  content:    string,
  stateBlock: string,
): string {
  const block = stateBlock.length > 0 ? stateBlock : '(empty graph — no existing nodes)'

  return `You are a cognitive encoder. Given a user message and the current graph state, determine:
1. Which cognitive primitive this message represents
2. A canonical label for the concept (if mutating)

The 6 cognitive primitives:
- anchor: UNBOUND, ADD. Seeds new structure. Use when the message introduces a genuinely new topic or concept not present in the graph.
- relate: BOUND, ADD. Creates edges between existing nodes. Use when the message connects two or more existing concepts.
- restructure: BOUND, REORGANIZE. Reorganizes topology, shifts focus. Use when the message reframes, reprioritizes, or reorganizes existing knowledge.
- reinforce: BOUND, INCREASE weight. Strengthens existing. Use when the message confirms, deepens, or repeats an existing concept.
- suppress: BOUND, DECREASE weight. Weakens existing. Use when the message contradicts, corrects, or deprecates an existing concept.
- reference: BOUND, read-only. No mutation. Use when the message is purely querying or referencing existing knowledge without changing it.

Current graph state:
${block}

Rules:
- Classify based on the message content AND the graph state above. CA5: the transition must be observable from these two inputs alone.
- For mutating primitives (not reference): extract a canonical label — lowercase, hyphenated, noun-phrase, singular. Max 100 chars.
- For reference: label must be empty string.
- Confidence: 0–1. Be honest — low confidence is fine.
- Reasoning: one line explaining why this primitive.

Respond with ONLY valid JSON, no markdown, no preamble:
{"primitive":"...","confidence":0.0,"reasoning":"...","label":"..."}

User message:
${content}`
}

// ─── Parse Classify Response ──────────────────────────────────────────────────
// Parses the single LLM JSON response containing both classify and label data.
// Returns null on parse failure — caller handles fallback.
// CA4: validates primitive is one of the 6 known values.

export function parseClassifyResponse(raw: string): (ClassifyResult & { label: string }) | null {
  try {
    // Strip markdown fences if present
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned)

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.primitive !== 'string' ||
      typeof parsed.confidence !== 'number' ||
      typeof parsed.reasoning !== 'string' ||
      typeof parsed.label !== 'string'
    ) {
      return null
    }

    // CA4: validate primitive is one of the 6
    if (!COGNITIVE_PRIMITIVES.includes(parsed.primitive as CognitivePrimitive)) {
      return null
    }

    const confidence = Math.max(0, Math.min(1, parsed.confidence))

    return {
      primitive:  parsed.primitive as CognitivePrimitive,
      confidence,
      reasoning:  parsed.reasoning,
      label:      parsed.label,
    }
  } catch {
    return null
  }
}
