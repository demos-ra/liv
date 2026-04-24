// @liv-standard v1.5.1
// [F-memory/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      F-memory
// layer:      R4
// wires-in:   none
// wires-out:  none (consumed by R2 service)
// deps:       none (env vars only)
// validated:  pending

// Living Memory v1.0 — embedding service.
// R4: I/O only. Zero domain logic.
// Provider-swappable via EMBEDDING_PROVIDER env var.
// §7 encode(): pure embedding projection. No concept extraction, no tokenization.
// Input text → vector. That's it.
//
// Fires only:
//   - once per new node on creation (encode the content)
//   - once per traversal input (encode the ping)
// Never inline with propagation.
//
// Result<T> for all fallible operations per CC.07.

import type { Result, AppError } from '@/core/types/primitives'

const PROVIDER   = process.env.EMBEDDING_PROVIDER ?? 'ollama'
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'

// ─── Encode ───────────────────────────────────────────────────────────────────
// §7: pure embedding projection. Input text → vector.

export async function encode(text: string): Promise<Result<number[]>> {
  try {
    switch (PROVIDER) {
      case 'ollama':  return await encodeOllama(text)
      case 'openai':  return await encodeOpenAI(text)
      default:        return await encodeOllama(text)
    }
  } catch (err) {
    return { ok: false, error: embedError('ENCODE_FAILED', err) }
  }
}

// ─── Ollama ───────────────────────────────────────────────────────────────────

async function encodeOllama(text: string): Promise<Result<number[]>> {
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ model: 'nomic-embed-text', input: text }),
    signal:  AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    return {
      ok: false,
      error: embedError('OLLAMA_HTTP_ERROR', new Error(`${res.status} ${res.statusText}`)),
    }
  }

  const data = await res.json() as { embeddings: number[][] }
  const vec = data.embeddings?.[0]
  if (!vec || vec.length === 0) {
    return {
      ok: false,
      error: embedError('OLLAMA_EMPTY_EMBEDDING', new Error('Empty embedding returned')),
    }
  }

  return { ok: true, data: vec }
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function encodeOpenAI(text: string): Promise<Result<number[]>> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      error: { code: 'OPENAI_KEY_MISSING', message: 'OPENAI_API_KEY not set' },
    }
  }

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    return {
      ok: false,
      error: embedError('OPENAI_HTTP_ERROR', new Error(`${res.status} ${res.statusText}`)),
    }
  }

  const data = await res.json() as { data: Array<{ embedding: number[] }> }
  const vec = data.data?.[0]?.embedding
  if (!vec || vec.length === 0) {
    return {
      ok: false,
      error: embedError('OPENAI_EMPTY_EMBEDDING', new Error('Empty embedding returned')),
    }
  }

  return { ok: true, data: vec }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function embedError(code: string, err: unknown): AppError {
  return {
    code,
    message: err instanceof Error ? err.message : String(err),
  }
}
