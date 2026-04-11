// @liv-standard v1.4
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.4
// amended:    phase-b-item1
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-FN  classifyAndLabel()  ←  F-codec/R4 (codec-ai-io)
// wires-out:
//   W-FN  classifyAndLabel()  →  F-codec/R2 (codec-encode)
// deps:
//   R4  ../exec/codec-ai-io
// validated:  pending
//
// phase-b-item1 (A2, T1.1):
//   R3 inject bridge for R4 I/O. codec-encode.ts (R2) was importing
//   classifyAndLabel() directly from codec-ai-io.ts (R4).
//   T1.1: "R4: Never directly imported."
//   Separate file from codec-contract.ts to avoid circular import
//   (codec-contract.ts imports R2; R2 cannot import back from it).
//   Pattern identical to planner-inject.ts.
//   Axiom cite: A2 — directional deps. T1.1 — R4 never directly imported.
//   A7 — deletable. No other R3 file depends on this.

import type { Result } from '@/core/types/primitives'
import { classifyAndLabel as _classifyAndLabel } from '../exec/codec-ai-io'

export async function classifyAndLabel(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  return _classifyAndLabel(prompt, modelId)
}
