// @liv-standard v1.5.1
// [F-ai-adapter/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-3a (relocated from F-codec/exec/codec-ai-io.ts; F-codec dissolved)
// slice:      F-ai-adapter
// layer:      R4
// wires-in:   none (LLM_CLASSIFY_CONFIG inlined per Decision-D-S3a-1)
// wires-out:
//   W-HOOK  classifyAndLabel()    →  available at F-ai-adapter/R3 when wired
//   W-HOOK  executeModuleCall()   →  available at F-ai-adapter/R3 when wired
// deps:
//   R5  @/core/types/primitives
// validated:  pending

// Single-shot non-streaming LLM call utilities.
//
// Originally F-codec/exec/codec-ai-io.ts. Salvage-F6 retained these two
// functions when F-codec dissolved at Sprint 8 Shot 3a; Decision-D-S3a-1
// relocated them to F-ai-adapter — the existing slice for AI provider I/O —
// rather than preserving an empty F-codec directory. CODEC_CONFIG inlined
// as LLM_CLASSIFY_CONFIG (4 fields: max-tokens × 2, temperature × 2).
//
// Sibling of features/F-ai-adapter/exec/ai-io.ts (streaming provider adapter).
// This file's functions are non-streaming, single-response — distinct concern
// from streaming AI calls. No current callers; preserved per Salvage-F6 for
// Sprint 9+ wiring (F-router rules / L4 framework slices may invoke directly).
//
// R4: I/O boundary. Direct fetch — no streaming.
// A4: all I/O at R4 only. This is a network-touching file.

import type { Result } from '@/core/types/primitives'

// ─── Inlined LLM config (formerly F-codec/R0 CODEC_CONFIG) ────────────────────

const LLM_CLASSIFY_CONFIG = {
  CLASSIFY_MAX_TOKENS:     200,
  CLASSIFY_TEMPERATURE:    0,        // deterministic classification
  MODULE_EXEC_MAX_TOKENS:  1024,
  MODULE_EXEC_TEMPERATURE: 0,
} as const

// ─── Classify and Label (Single LLM Call) ─────────────────────────────────────
// Non-streaming. The prompt requests a JSON response (built by caller).
// Returns the raw response string — caller handles parsing.

export async function classifyAndLabel(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return { ok: false, error: { code: 'NO_API_KEY', message: 'ANTHROPIC_API_KEY not set' } }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:       modelId,
        max_tokens:  LLM_CLASSIFY_CONFIG.CLASSIFY_MAX_TOKENS,
        temperature: LLM_CLASSIFY_CONFIG.CLASSIFY_TEMPERATURE,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '(unreadable)')
      return { ok: false, error: { code: 'LLM_CALL_FAILED', message: `HTTP ${response.status} ${body}` } }
    }

    const data = await response.json() as {
      content?: Array<{ type: string; text?: string }>
    }

    const textBlock = data.content?.find(b => b.type === 'text')
    if (!textBlock?.text) {
      return { ok: false, error: { code: 'LLM_EMPTY_RESPONSE', message: 'no text block in response' } }
    }

    return { ok: true, data: textBlock.text }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'LLM_CALL_ERROR', message } }
  }
}

// ─── Execute Module Call (Structured Response) ─────────────────────────────
// Non-streaming call for module execution. Larger token budget than classify.

export async function executeModuleCall(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return { ok: false, error: { code: 'NO_API_KEY', message: 'ANTHROPIC_API_KEY not set' } }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:       modelId,
        max_tokens:  LLM_CLASSIFY_CONFIG.MODULE_EXEC_MAX_TOKENS,
        temperature: LLM_CLASSIFY_CONFIG.MODULE_EXEC_TEMPERATURE,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '(unreadable)')
      return { ok: false, error: { code: 'LLM_CALL_FAILED', message: `HTTP ${response.status} ${body}` } }
    }

    const data = await response.json() as {
      content?: Array<{ type: string; text?: string }>
    }

    const textBlock = data.content?.find(b => b.type === 'text')
    if (!textBlock?.text) {
      return { ok: false, error: { code: 'LLM_EMPTY_RESPONSE', message: 'no text block in response' } }
    }

    return { ok: true, data: textBlock.text }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: { code: 'LLM_CALL_ERROR', message } }
  }
}
