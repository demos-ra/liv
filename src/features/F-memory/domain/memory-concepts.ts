// [F-memory/R1/C1] Concept extraction and utility computation
// R1: pure functions, zero I/O, zero side effects.
// Depends: R0 only.

import {
  STOPWORDS,
  MIN_CONCEPT_CHARS,
  MAX_CONCEPTS_PER_EVENT,
  PMI_THRESHOLD,
  PERSISTENCE_LOW,
  PERSISTENCE_MED,
  PERSISTENCE_HIGH,
} from '../config/memory-config'
import type { MemGraph } from '../config/memory-types'

// ─── F-* token preservation ───────────────────────────────────────────────────
// F-memory, F-chat etc. must survive tokenization as single tokens.
// Strategy: replace with underscore-joined form before split, restore after.

function preserveFTokens(text: string): { normalized: string; fTokenMap: Map<string, string> } {
  const fTokenMap = new Map<string, string>()
  const normalized = text.replace(/\bF-([a-zA-Z][a-zA-Z0-9-]*)/g, (match) => {
    const safe = 'ftoken_' + match.replace(/-/g, '_').toLowerCase()
    fTokenMap.set(safe, match.toLowerCase().replace('-', '_'))
    return safe
  })
  return { normalized, fTokenMap }
}

// ─── Extract concepts ─────────────────────────────────────────────────────────

/**
 * Extract concept tokens from free text.
 * Returns up to MAX_CONCEPTS_PER_EVENT tokens, ranked by PMI descending.
 * Deterministic — no I/O, no randomness.
 */
export function extractConcepts(text: string): string[] {
  const { normalized, fTokenMap } = preserveFTokens(text)

  // Tokenize: lowercase, split on whitespace and punctuation (not underscore)
  const raw = normalized
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  // Restore F-* tokens, filter stopwords and short tokens
  const tokens = raw
    .map((t) => fTokenMap.get(t) ?? t)
    .filter((t) => !STOPWORDS.has(t) && t.length >= MIN_CONCEPT_CHARS)

  if (tokens.length === 0) return []

  // Build unigram frequency map
  const freq = new Map<string, number>()
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1)
  }

  const total = tokens.length

  // Build bigram co-occurrence map and score by PMI
  const bigrams: Array<{ token: string; pmi: number }> = []
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i]
    const b = tokens[i + 1]
    if (a === b) continue
    const pairKey = a < b ? `${a} ${b}` : `${b} ${a}`
    const pa = (freq.get(a) ?? 0) / total
    const pb = (freq.get(b) ?? 0) / total
    // Approximate P(a,b) as observed adjacent / total pairs
    // Simple estimate: treat every adjacent occurrence as one pair
    const pab = 1 / (total - 1)
    const pmi = Math.log(pab / (pa * pb))
    if (pmi > PMI_THRESHOLD) {
      bigrams.push({ token: pairKey, pmi })
    }
  }

  // Combine: unigrams (score by freq) + high-PMI bigrams
  const unigrams: Array<{ token: string; pmi: number }> = Array.from(freq.entries()).map(
    ([token, count]) => ({ token, pmi: Math.log(count / total + 1) })
  )

  const candidates = [...unigrams, ...bigrams]
    .sort((a, b) => b.pmi - a.pmi)
    .map((c) => c.token)

  // Deduplicate preserving order
  const seen = new Set<string>()
  const result: string[] = []
  for (const t of candidates) {
    if (!seen.has(t)) {
      seen.add(t)
      result.push(t)
    }
    if (result.length >= MAX_CONCEPTS_PER_EVENT) break
  }

  return result
}

// ─── Derive persistence ───────────────────────────────────────────────────────

/**
 * Map a semantic predicate to a persistence coefficient.
 * Higher persistence = slower structural decay for this concept.
 */
export function derivePersistence(predicate?: string): number {
  if (!predicate) return PERSISTENCE_LOW
  const p = predicate.toLowerCase()

  // Identity / backbone predicates
  if (['is', 'are', 'equals', 'identity', 'name', 'called'].some((k) => p.includes(k))) {
    return PERSISTENCE_HIGH
  }

  // Stable fact predicates
  if (['has', 'uses', 'owns', 'belongs', 'works', 'builds', 'makes'].some((k) => p.includes(k))) {
    return PERSISTENCE_MED
  }

  // Transient / episodic predicates
  return PERSISTENCE_LOW
}

// ─── Compute utility ──────────────────────────────────────────────────────────

/**
 * Semantic contrast of an incoming event against current session state.
 * utility = 1 - cosine(prediction_centroid, incomingEmbedding)
 * High contrast = high utility. Cold start = 1.0.
 * Repetitive events approach 0. Contradiction events learn fastest.
 */
export function computeUtility(
  sessionActivation: Map<string, number> | null,
  incomingEmbedding: number[],
  graph: MemGraph
): number {
  if (!sessionActivation || sessionActivation.size === 0) return 1.0
  if (incomingEmbedding.length === 0) return 1.0

  // Build prediction centroid: weighted mean of top-K activated concept node embeddings
  const TOP_K = 10
  const sorted = Array.from(sessionActivation.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_K)

  const embeddingDim = incomingEmbedding.length
  const centroid = new Array<number>(embeddingDim).fill(0)
  let totalWeight = 0

  for (const [nodeId, activation] of sorted) {
    const node = graph.nodes.get(nodeId)
    if (!node || !node.embedding || node.embedding.length !== embeddingDim) continue
    for (let i = 0; i < embeddingDim; i++) {
      centroid[i] += node.embedding[i] * activation
    }
    totalWeight += activation
  }

  if (totalWeight === 0) return 1.0

  for (let i = 0; i < embeddingDim; i++) {
    centroid[i] /= totalWeight
  }

  return 1.0 - cosine(centroid, incomingEmbedding)
}

// ─── Cosine similarity (pure, sync) ──────────────────────────────────────────

export function cosine(a: number[], b: number[]): number {
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
