// [F-memory/R4/C5] Embedding service — provider-swappable via env
// R4: I/O only. Zero domain logic.
// EMBEDDING_PROVIDER=ollama → nomic-embed-text at OLLAMA_URL
// EMBEDDING_PROVIDER=openai → text-embedding-3-small
//
// Embed fires only:
//   - once per concept on promotion
//   - once per recall query
// Never at write time for non-promoted concepts.
//
// O3: timeout 30s on all external calls. Fail-throws (caller decides to ignore or rethrow).

/**
 * Cosine similarity between two vectors. Pure, sync.
 * Inlined at R4 to avoid upward R4→R1 dependency violation.
 */
export function similarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

const PROVIDER   = process.env.EMBEDDING_PROVIDER ?? 'ollama'
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'

/**
 * Embed a single string. Returns a float32 vector.
 * Throws on provider error — R2 handles graceful degradation.
 */
export async function embed(text: string): Promise<number[]> {
  switch (PROVIDER) {
    case 'ollama':  return embedOllama(text)
    case 'openai':  return embedOpenAI(text)
    default:        return embedOllama(text)
  }
}

// ─── Ollama ───────────────────────────────────────────────────────────────────
// Uses /api/embed (current endpoint) with `input` field.
// Returns embeddings[0] (array of arrays — we always embed one string at a time).

async function embedOllama(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_URL}/api/embed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ model: 'nomic-embed-text', input: text }),
    signal:  AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    throw new Error(`[F-memory/embedding] Ollama error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as { embeddings: number[][] }
  const vec = data.embeddings?.[0]
  if (!vec || vec.length === 0) {
    throw new Error('[F-memory/embedding] Ollama returned empty embedding')
  }
  return vec
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function embedOpenAI(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('[F-memory/embedding] OPENAI_API_KEY not set')

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
    throw new Error(`[F-memory/embedding] OpenAI error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as { data: Array<{ embedding: number[] }> }
  return data.data[0]?.embedding ?? []
}
