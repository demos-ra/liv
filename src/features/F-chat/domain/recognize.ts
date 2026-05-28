// @liv-standard v1.5.1 amended sweep-capture-gate
// [F-chat/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sweep-capture-gate (recognition step — the capture mechanic
//             between LLM response / wearer utterance and substrate write)
// imports:
//   R5  @/core/types/substrate.types            (IdentityRef, RoleRef brands)
//   R3  @/features/F-memory/contract/substrate-contract  (Relation, RelationModality)
// exports:
//   recognize(text) → { identities, relations }
// validated:  pending
//
// completed-structure.md §5 / §7.1 — the recognition floor.
//
// This is NOT a decomposer. There is no encoding job, no domain translation,
// no second LLM job. recognize() reads the structure already present in any
// well-formed sentence: the words that sit together are the neighbourhood of
// that state-change. Grammar IS the geometry the substrate stores (L0 ruling).
//
// Standing principle (§0): focus the capture; the geometry emerges from it.
// No thresholds, filters, guards, normalization, lemmatization, stopwords,
// dedup, lowercasing, or behavioural rules. Capture cleanly into the schema
// the substrate already has. Everything else is read-side / future-sprint.
//
// Vocabulary lock: recognize() produces a NEIGHBOURHOOD — write-time, stored,
// one-write co-occurrence. It does NOT cluster (read-time, emergent, never
// stored — not in this build).

import type { IdentityRef, RoleRef } from '@/core/types/substrate.types'
import type { Relation } from '@/features/F-memory/contract/substrate-contract'

// ─── recognize ────────────────────────────────────────────────────────────────
// Pure. Deterministic. No I/O, no throw on well-formed string input.
//
// The recognition floor (§5, derived by Python sweep + per-record observation):
//   Identities — words of the utterance / response, whitespace-segmented,
//     case preserved, punctuation kept attached. Possessives intact
//     (`substrate's` is one identity, not two). No edge-strip.
//   Relations  — exactly one per non-empty write. type='co-occurrence'
//     (brand-cast to IdentityRef — Relation.type is IdentityRef, verbs/concepts
//     are identities, open vocabulary). modality='declarative' (LMA11: stored,
//     re-derived at read). identitiesWithRoles — same words, role='token'
//     (brand-cast to RoleRef). negation=false (no lexical-substring guessing —
//     found at sweep to false-positive on content words containing 'not'/'no').
//
// Empty input (zero tokens after split) → empty output. The recognizer does
// not synthesize content where none was said. SW1 rejects empty-identity
// writes; the caller (chat-contract) handles this honestly (400 for empty
// wearer arrivals; no-write for stream-errored responses).

export function recognize(text: string): {
  identities: IdentityRef[]
  relations:  Relation[]
} {
  // Tokenize: whitespace-split, drop empty fragments. Case preserved,
  // punctuation kept attached. No regex beyond the whitespace split.
  const words = text.split(/\s+/).filter((w) => w.length > 0)

  // Empty input → empty output. Do not synthesize.
  if (words.length === 0) {
    return { identities: [], relations: [] }
  }

  const identities = words.map((w) => w as IdentityRef)

  const relation: Relation = {
    type:                'co-occurrence' as IdentityRef,
    modality:            'declarative',
    identitiesWithRoles: words.map((w) => ({
      identity: w as IdentityRef,
      role:     'token' as RoleRef,
    })),
    negation: false,
  }

  return { identities, relations: [relation] }
}
