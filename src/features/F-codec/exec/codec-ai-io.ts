// @liv-standard v1.3
// [F-codec/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R4
// wires-in:
//   W-ATOM  CODEC_CONFIG  ←  F-codec/R0
//   W-FN    getApiKey()   ←  F-user-profile/R3 (deferred — env var until per-user key threading)
// wires-out:
//   W-FN  classifyAndLabel()  →  F-codec/R2
// deps:
//   R0  ../config/codec-types
// validated:  pending

// R4: I/O boundary. Makes the LLM call for classify + label extraction.
// Result<string> — returns raw LLM response text. R1 parses it.
// A4: all I/O at R4 only. This is the only file in F-codec that touches the network.
// Uses direct fetch — classify is a short JSON response, no streaming needed.

import type { Result } from '@/core/types/primitives'
import { CODEC_CONFIG } from '../config/codec-types'
// getApiKey from F-user-profile/R3 will be wired when per-user key threading
// is added to encode(). For now, codec uses ANTHROPIC_API_KEY env var.
// import { getApiKey } from '@/features/F-user-profile/contract/user-profile-contract'

// ─── Classify and Label (Single LLM Call) ─────────────────────────────────────
// Makes a non-streaming call to the AI provider.
// The prompt (built by R1, orchestrated by R2) requests both primitive
// classification and label extraction in one JSON response.
// Returns the raw response string — R1 handles parsing.

export async function classifyAndLabel(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  try {
    // Get user API key — same pattern as F-chat
    // Note: userId is not available here; the caller (R2) should thread it.
    // For now, codec uses the server-side key. This will be amended when
    // per-user key threading is wired through encode().
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
        max_tokens:  CODEC_CONFIG.CLASSIFY_MAX_TOKENS,
        temperature: CODEC_CONFIG.CLASSIFY_TEMPERATURE,
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

    // Extract text from response
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
