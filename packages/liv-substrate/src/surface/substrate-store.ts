// @liv-standard v1.5.2
// Built with LIV · livai.dev
// The store surface — the package's socket. Canonical analogue:
// src/features/F-memory/contract/substrate-contract.ts (d6d13c8), scoped to the
// store alone. No engine, no perimeter, no events: a dumb store that takes typed
// writes and returns raw reads.
//
// The socket the spec names: writeRawTurn / readTranscript / readScope, plus the
// word-cut pair cutCells / joinCells (and isWordCell). The engine plugs in through
// the fuse point (seam/cognition-seam), exactly as in the host tree.

import type { Result } from '../types/primitives'
import type { StateChangeRecord, ContentClass } from '../types/substrate.types'
import { readIsolatedRows } from '../store/substrate-repository'

// ─── Cognition rail (raw words in, raw turns out) ─────────────────────────────
export { writeRawTurn, cutCells, joinCells, isWordCell } from '../store/raw-turn-write'
export { readTranscript }                                from '../store/transcript-read'

// ─── Scope-ordered read ───────────────────────────────────────────────────────
// readScope: the canonical scope-ordered substrate read — every StateChangeRecord
// for a userId, position ASC. A thin wrapper over the store body's readIsolatedRows.
// Scope ACCESS CONTROL is a perimeter responsibility applied above the store; the
// store reads whatever userId arrives (the same line the canonical contract holds:
// "scope access control are perimeter responsibilities; LM writes/reads whatever
// arrives").
export async function readScope(
  userId: string,
  contentClass?: ContentClass,
): Promise<Result<StateChangeRecord[]>> {
  return readIsolatedRows(userId, contentClass)
}
