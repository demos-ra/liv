// @liv-standard v1.5
// [F-codec/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-b-item1, 6.9-6.10-module-exec
// slice:      F-codec
// layer:      R3
// wires-in:
//   W-HOOK  classifyAndLabel()    ←  F-codec/R4 (codec-ai-io)
//   W-HOOK  executeModuleCall()   ←  F-codec/R4 (codec-ai-io)
// wires-out:
//   W-HOOK  classifyAndLabel()  →  F-codec/R2 (codec-encode)
//   W-HOOK  executeModule()     →  F-codec/R2 (codec-discovery, codec-planning, codec-verify)
// deps:
//   R4  ../exec/codec-ai-io
// validated:  pending

import type { Result } from '@/core/types/primitives'
import { classifyAndLabel as _classifyAndLabel, executeModuleCall as _executeModuleCall } from '../exec/codec-ai-io'

export async function classifyAndLabel(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  return _classifyAndLabel(prompt, modelId)
}

export async function executeModule(
  prompt:  string,
  modelId: string,
): Promise<Result<string>> {
  return _executeModuleCall(prompt, modelId)
}
