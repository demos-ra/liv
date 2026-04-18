// @liv-standard v1.5
// [F-codec/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-b-item1, 6.9-6.10-module-exec
// slice:      F-codec
// layer:      R4
// wires-in:
//   W-ATOM  CODEC_CONFIG  ←  F-codec/R0
// wires-out:
//   W-HOOK  classifyAndLabel()    →  F-codec/R3 (codec-inject)
//   W-HOOK  executeModuleCall()   →  F-codec/R3 (codec-inject)
// deps:
//   R0  ../config/codec-types
// validated:  pending
//
// phase-b-item1 (A2, T1.1):
//   wires-out updated: classifyAndLabel() now consumed by R3 (codec-inject),
//   not R2 (codec-encode) directly. T1.1: "R4: Never directly imported."
//   Axiom cite: A2 — R4 consumed only through R3 bridge.

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

// ─── Execute Module Call (Structured Response) ─────────────────────────────
// Non-streaming call for module execution (discovery, planning, verification).
// Larger token budget than classify. Same HTTP pattern, different config.

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
        max_tokens:  CODEC_CONFIG.MODULE_EXEC_MAX_TOKENS,
        temperature: CODEC_CONFIG.MODULE_EXEC_TEMPERATURE,
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
