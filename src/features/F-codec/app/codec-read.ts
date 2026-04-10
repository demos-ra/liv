// @liv-standard v1.3
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-FN    classifyGraph()    ←  F-codec/R1 (codec-decode)
//   W-FN    getGlobalGraph()   ←  F-memory/R3
//   W-FN    getUserGraph()     ←  F-memory/R3
//   W-FN    getGlobalArms()    ←  F-memory/R3
//   W-FN    getUserArms()      ←  F-memory/R3
//   W-ATOM  ScopedGraphSet     ←  F-memory/R0
//   W-ATOM  DecodeOutput       ←  F-codec/R0
// wires-out:
//   W-FN  getDecodedState()    →  F-codec/R4 (API route)
// deps:
//   R1  ../domain/codec-decode
//   R0  ../../F-memory/config/memory-types  (type only)
//   R0  ../config/codec-decode-types        (type only)
// validated:  pending

// Read-only decode surface.
// R2: orchestration — assembles graph set, delegates to R1 classifier.
// A3: typed boundary — takes userId, returns DecodeOutput atom.
// No encode, no LLM, no mutation. Pure graph read → classify.

import type { ScopedGraphSet } from '@/features/F-memory/config/memory-types'
import type { DecodeOutput } from '../config/codec-decode-types'
import { classifyGraph } from '../domain/codec-decode'
import {
  getGlobalGraph,
  getUserGraph,
  getGlobalArms,
  getUserArms,
} from '@/features/F-memory/contract/memory-contract'

// ─── getDecodedState ─────────────────────────────────────────────────────────
// Returns the full classified graph for a user without triggering encode.
// A2: depends on F-memory (lower) and F-codec/R1 (same slice, lower layer).
// A3: typed boundary — DecodeOutput is an atom from F-codec/R0.

export function getDecodedState(userId: string): DecodeOutput {
  const graphs: ScopedGraphSet = {
    user:   getUserGraph(userId),
    global: getGlobalGraph(),
  }
  const userArms   = getUserArms(userId)
  const globalArms = getGlobalArms()

  return classifyGraph(graphs, userArms, globalArms)
}
